---
sidebar_position: 3
title: "Controllers, Actuators, and Sensor Feedback Loop"
---

# Controllers, Actuators, and Sensor Feedback Loop

## Introduction

The control loop represents the complete pathway from AI intent to physical robot motion and back through sensor feedback. This closed-loop system is essential for precise robot control, enabling the robot to adjust its behavior based on real-world conditions and achieve its goals despite uncertainties and disturbances.

## Control System Architecture

### Hierarchical Control Structure
Robotic control systems typically employ a hierarchical structure:

- **High-Level Planning**: AI reasoning, task planning, and path planning
- **Trajectory Generation**: Smooth trajectories from high-level plans
- **Low-Level Control**: Joint-level and motor-level control
- **Hardware Interface**: Direct actuator control and sensor reading

### Control Loop Components
The complete control loop includes:
1. **AI Intent**: High-level goals and commands
2. **Controllers**: Translate high-level commands to low-level actuator commands
3. **Actuators**: Physical components that produce motion
4. **Plant**: The physical robot and environment
5. **Sensors**: Measure robot state and environment
6. **Feedback Processing**: Interpret sensor data for control adjustment

## Controller Types and Implementation

### PID Controllers
Proportional-Integral-Derivative (PID) controllers are fundamental in robotics:

```python
class PIDController:
    def __init__(self, kp, ki, kd, min_output=-1.0, max_output=1.0):
        self.kp = kp  # Proportional gain
        self.ki = ki  # Integral gain
        self.kd = kd  # Derivative gain
        self.min_output = min_output
        self.max_output = max_output

        self.prev_error = 0.0
        self.integral = 0.0
        self.prev_time = None

    def compute(self, setpoint, measured_value, dt=None):
        """Compute control output using PID algorithm"""
        if dt is None and self.prev_time is not None:
            dt = self.get_time() - self.prev_time
        elif dt is None:
            dt = 0.1  # Default time step

        error = setpoint - measured_value

        # Proportional term
        p_term = self.kp * error

        # Integral term
        self.integral += error * dt
        i_term = self.ki * self.integral

        # Derivative term
        derivative = (error - self.prev_error) / dt if dt > 0 else 0
        d_term = self.kd * derivative

        # Total output
        output = p_term + i_term + d_term

        # Clamp output to limits
        output = max(self.min_output, min(self.max_output, output))

        # Update for next iteration
        self.prev_error = error
        self.prev_time = self.get_time() if dt is None else None

        return output
```

### Joint Controllers
Joint controllers manage individual robot joints:

```python
from rclpy.node import Node
from control_msgs.msg import JointControllerState
from std_msgs.msg import Float64MultiArray

class JointController(Node):
    def __init__(self, joint_name):
        super().__init__(f'{joint_name}_controller')

        self.joint_name = joint_name
        self.position_controller = PIDController(kp=10.0, ki=0.1, kd=0.5)
        self.velocity_controller = PIDController(kp=2.0, ki=0.05, kd=0.1)

        # Subscriptions
        self.joint_state_sub = self.create_subscription(
            JointState, 'joint_states', self.joint_state_callback, 10
        )

        # Publishers
        self.command_pub = self.create_publisher(
            Float64MultiArray, f'{joint_name}/command', 10
        )

        self.state_pub = self.create_publisher(
            JointControllerState, f'{joint_name}/controller_state', 10
        )

        # Control timer
        self.control_timer = self.create_timer(0.01, self.control_loop)  # 100Hz

        self.current_position = 0.0
        self.current_velocity = 0.0
        self.desired_position = 0.0
        self.desired_velocity = 0.0

    def joint_state_callback(self, msg):
        """Update current joint state from sensor feedback"""
        try:
            idx = msg.name.index(self.joint_name)
            self.current_position = msg.position[idx]
            self.current_velocity = msg.velocity[idx] if idx < len(msg.velocity) else 0.0
        except ValueError:
            pass  # Joint not found in message

    def control_loop(self):
        """Main control loop for the joint"""
        # Compute position error and control effort
        position_error = self.desired_position - self.current_position
        position_effort = self.position_controller.compute(
            setpoint=self.desired_position,
            measured_value=self.current_position
        )

        # Compute velocity control (if needed)
        velocity_error = self.desired_velocity - self.current_velocity
        velocity_effort = self.velocity_controller.compute(
            setpoint=self.desired_velocity,
            measured_value=self.current_velocity
        )

        # Combine efforts (typically use position control with feedforward velocity)
        total_effort = position_effort + velocity_effort

        # Publish command
        cmd_msg = Float64MultiArray()
        cmd_msg.data = [total_effort]
        self.command_pub.publish(cmd_msg)

        # Publish controller state for monitoring
        state_msg = JointControllerState()
        state_msg.set_point = self.desired_position
        state_msg.process_value = self.current_position
        state_msg.process_value_derivative = self.current_velocity
        state_msg.error = position_error
        state_msg.time_stamp = self.get_clock().now().to_msg()
        state_msg.command = total_effort
        self.state_pub.publish(state_msg)
```

### Cartesian Controllers
For end-effector control in Cartesian space:

```python
import numpy as np
from geometry_msgs.msg import Pose, Twist
from tf2_ros import TransformListener, Buffer

class CartesianController:
    def __init__(self):
        # Initialize TF listener for pose feedback
        self.tf_buffer = Buffer()
        self.tf_listener = TransformListener(self.tf_buffer, self)

        # PID controllers for each Cartesian dimension
        self.position_controllers = [
            PIDController(kp=10.0, ki=0.1, kd=0.5) for _ in range(3)
        ]  # X, Y, Z
        self.orientation_controllers = [
            PIDController(kp=5.0, ki=0.05, kd=0.2) for _ in range(3)
        ]  # Roll, Pitch, Yaw

        self.current_pose = Pose()
        self.desired_pose = Pose()

    def compute_cartesian_control(self, dt):
        """Compute Cartesian control commands"""
        # Get current end-effector pose
        current_pose = self.get_current_pose()

        # Extract position and orientation
        current_pos = np.array([current_pose.position.x,
                               current_pose.position.y,
                               current_pose.position.z])
        desired_pos = np.array([self.desired_pose.position.x,
                               self.desired_pose.position.y,
                               self.desired_pose.position.z])

        # Compute position control
        position_commands = []
        for i in range(3):
            cmd = self.position_controllers[i].compute(
                setpoint=desired_pos[i],
                measured_value=current_pos[i],
                dt=dt
            )
            position_commands.append(cmd)

        # Similar approach for orientation (simplified)
        # In practice, orientation control is more complex due to rotation representations

        return position_commands
```

## Actuator Types and Control

### Servo Motors
Servo motors provide precise position control:

```python
class ServoController:
    def __init__(self, joint_name, min_angle=-90, max_angle=90):
        self.joint_name = joint_name
        self.min_angle = np.radians(min_angle)
        self.max_angle = np.radians(max_angle)

        # Hardware interface (example using PWM)
        self.pwm_pin = self.initialize_hardware_interface()

    def set_position(self, angle_rad):
        """Set servo position in radians"""
        # Clamp to limits
        angle_rad = max(self.min_angle, min(self.max_angle, angle_rad))

        # Convert to PWM duty cycle
        duty_cycle = self.radians_to_duty_cycle(angle_rad)

        # Send to hardware
        self.pwm_pin.duty_cycle = duty_cycle

    def radians_to_duty_cycle(self, angle_rad):
        """Convert radians to PWM duty cycle"""
        # Example conversion (varies by servo type)
        # Standard servos: 1ms = -90°, 1.5ms = 0°, 2ms = 90°
        pulse_width_ms = 1.5 + (angle_rad * 180/np.pi) * (0.5 / 90)
        return pulse_width_ms / 20.0 * 65535  # For 20ms period on 16-bit timer
```

### Stepper Motors
Stepper motors provide precise angular control:

```python
class StepperController:
    def __init__(self, steps_per_revolution=200):
        self.steps_per_revolution = steps_per_revolution
        self.current_step = 0

        # Initialize step and direction pins
        self.step_pin = self.initialize_step_pin()
        self.direction_pin = self.initialize_direction_pin()

    def move_to_position(self, target_angle):
        """Move stepper to target angle"""
        target_step = int((target_angle / (2 * np.pi)) * self.steps_per_revolution)
        steps_to_move = target_step - self.current_step

        # Set direction
        if steps_to_move > 0:
            self.direction_pin.value = 1
        else:
            self.direction_pin.value = 0
            steps_to_move = abs(steps_to_move)

        # Generate step pulses
        for _ in range(steps_to_move):
            self.step_pin.value = 1
            time.sleep(0.001)  # 1ms pulse
            self.step_pin.value = 0
            time.sleep(0.001)  # 1ms delay

        self.current_step = target_step
```

### Hydraulic/Pneumatic Actuators
For high-force applications:

```python
class HydraulicController:
    def __init__(self, max_pressure=200):  # bar
        self.max_pressure = max_pressure
        self.current_pressure = 0

    def set_force(self, desired_force):
        """Set actuator force by controlling pressure"""
        # Convert force to pressure based on actuator characteristics
        required_pressure = self.force_to_pressure(desired_force)

        # Limit to maximum pressure
        required_pressure = min(self.max_pressure, required_pressure)

        # Control pressure valve
        self.set_pressure_valve(required_pressure)

    def force_to_pressure(self, force):
        """Convert force to required pressure (simplified)"""
        # This would depend on the specific actuator geometry
        # force = pressure * area
        effective_area = 0.001  # m^2, example value
        return force / effective_area
```

## Sensor Feedback Systems

### Position Sensors
Encoders provide precise position feedback:

```python
class EncoderReader:
    def __init__(self, counts_per_revolution=4096):
        self.counts_per_revolution = counts_per_revolution
        self.current_count = 0
        self.previous_count = 0

        # Initialize encoder interface
        self.encoder_interface = self.initialize_encoder()

    def read_position(self):
        """Read current encoder position"""
        current_count = self.encoder_interface.read()

        # Handle encoder wraparound
        if abs(current_count - self.previous_count) > self.counts_per_revolution / 2:
            if current_count > self.previous_count:
                self.current_count -= self.counts_per_revolution
            else:
                self.current_count += self.counts_per_revolution

        self.current_count = current_count
        self.previous_count = current_count

        # Convert to radians
        angle_rad = (self.current_count % self.counts_per_revolution) * \
                   (2 * np.pi / self.counts_per_revolution)

        return angle_rad
```

### Force/Torque Sensors
Force/torque sensors provide interaction feedback:

```python
class ForceTorqueSensor:
    def __init__(self):
        self.bias = np.zeros(6)  # [fx, fy, fz, mx, my, mz]
        self.is_calibrated = False

    def calibrate(self):
        """Calibrate sensor to zero with no load"""
        raw_readings = self.read_raw_sensor()
        self.bias = np.array(raw_readings)
        self.is_calibrated = True

    def read_force_torque(self):
        """Read calibrated force and torque"""
        if not self.is_calibrated:
            self.calibrate()

        raw_readings = self.read_raw_sensor()
        calibrated_readings = np.array(raw_readings) - self.bias

        return calibrated_readings
```

### IMU Sensors
Inertial measurement units provide orientation and acceleration:

```python
from sensor_msgs.msg import Imu

class IMUProcessor:
    def __init__(self):
        self.imu_sub = self.create_subscription(
            Imu, 'imu/data', self.imu_callback, 10
        )

        self.orientation = np.array([0, 0, 0, 1])  # quaternion
        self.angular_velocity = np.array([0, 0, 0])
        self.linear_acceleration = np.array([0, 0, 0])

    def imu_callback(self, msg):
        """Process IMU data"""
        # Update orientation
        self.orientation = np.array([
            msg.orientation.x,
            msg.orientation.y,
            msg.orientation.z,
            msg.orientation.w
        ])

        # Update angular velocity
        self.angular_velocity = np.array([
            msg.angular_velocity.x,
            msg.angular_velocity.y,
            msg.angular_velocity.z
        ])

        # Update linear acceleration
        self.linear_acceleration = np.array([
            msg.linear_acceleration.x,
            msg.linear_acceleration.y,
            msg.linear_acceleration.z
        ])
```

## Feedback Loop Implementation

### Closed-Loop Control Example
```python
class ClosedLoopController:
    def __init__(self):
        self.joint_controller = JointController('joint1')
        self.encoder = EncoderReader()
        self.control_timer = self.create_timer(0.01, self.control_cycle)  # 100Hz

        self.desired_position = 0.0
        self.feedback_gain = 1.0

    def control_cycle(self):
        """Main control cycle"""
        # Read current position from encoder
        current_position = self.encoder.read_position()

        # Update controller with current state
        self.joint_controller.current_position = current_position

        # Compute control command based on error
        error = self.desired_position - current_position
        control_command = self.feedback_gain * error

        # Apply control command
        self.joint_controller.apply_command(control_command)

        # Log for monitoring
        self.get_logger().debug(f'Error: {error:.3f}, Command: {control_command:.3f}')
```

### Adaptive Control
Controllers that adapt to changing conditions:

```python
class AdaptiveController:
    def __init__(self):
        self.base_controller = PIDController(kp=1.0, ki=0.1, kd=0.01)
        self.parameter_adaptation_gain = 0.01
        self.model_parameters = {'mass': 1.0, 'friction': 0.1}

    def adaptive_control(self, setpoint, measured_value, dt):
        """Adaptive control with parameter estimation"""
        # Compute initial control
        control_output = self.base_controller.compute(setpoint, measured_value, dt)

        # Estimate system parameters based on model error
        model_prediction = self.predict_system_response(control_output)
        model_error = measured_value - model_prediction

        # Adapt parameters to minimize model error
        self.adapt_parameters(model_error, control_output)

        return control_output

    def adapt_parameters(self, error, control_input):
        """Update model parameters based on error"""
        # Simplified parameter adaptation
        # In practice, this would use more sophisticated algorithms
        self.model_parameters['friction'] += self.parameter_adaptation_gain * error * abs(control_input)
        self.model_parameters['mass'] = max(0.1, self.model_parameters['mass'] - self.parameter_adaptation_gain * error * abs(control_input))
```

## Safety and Monitoring

### Safety Systems
```python
class SafetyMonitor:
    def __init__(self):
        self.emergency_stop = False
        self.joint_limits = {'min': -2.0, 'max': 2.0}  # radians
        self.velocity_limits = {'max': 1.0}  # rad/s
        self.torque_limits = {'max': 10.0}  # Nm

    def check_safety(self, joint_position, joint_velocity, joint_torque):
        """Check if robot is operating safely"""
        # Check joint limits
        if joint_position < self.joint_limits['min'] or joint_position > self.joint_limits['max']:
            self.trigger_safety_stop("Joint limit exceeded")
            return False

        # Check velocity limits
        if abs(joint_velocity) > self.velocity_limits['max']:
            self.trigger_safety_stop("Velocity limit exceeded")
            return False

        # Check torque limits
        if abs(joint_torque) > self.torque_limits['max']:
            self.trigger_safety_stop("Torque limit exceeded")
            return False

        return True

    def trigger_safety_stop(self, reason):
        """Trigger emergency stop"""
        self.emergency_stop = True
        self.get_logger().error(f"SAFETY STOP: {reason}")
        # Send zero commands to all actuators
        self.send_zero_commands()
```

## Integration with AI Systems

### AI-Driven Control Adaptation
```python
class AIControlAdapter:
    def __init__(self):
        self.controller = JointController('joint1')
        self.ai_model = self.load_ai_model()  # Pre-trained model
        self.feedback_buffer = []

    def ai_adaptive_control(self, desired_trajectory):
        """Use AI to adapt control parameters based on task"""
        # Get current state and performance metrics
        current_state = self.get_current_state()
        recent_performance = self.get_recent_performance()

        # Use AI to predict optimal control parameters
        ai_recommendation = self.ai_model.predict({
            'current_state': current_state,
            'task': desired_trajectory,
            'performance': recent_performance
        })

        # Update controller parameters
        self.controller.update_parameters(ai_recommendation['gains'])

        # Execute control with AI-adapted parameters
        control_output = self.controller.compute_control(desired_trajectory)

        return control_output
```

## Conclusion

The controller-actuator-sensor feedback loop is fundamental to robotic systems, enabling precise and adaptive control of robot motion. Understanding the various types of controllers, actuators, and sensors, as well as how they integrate in a closed-loop system, is essential for building effective robotic applications. The integration of AI systems with these control loops enables more sophisticated and adaptive robot behavior, connecting high-level AI reasoning to precise physical robot control.