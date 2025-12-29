# Quickstart Guide: ROS2 Nervous System Book Module

**Date**: 2025-12-26
**Feature**: 001-ros2-nervous-system
**Guide**: Claude Code

## Overview

This quickstart guide provides the essential information needed to begin developing the ROS2 Nervous System Book Module. It covers the foundational concepts that will be expanded upon in the full book content.

## Prerequisites

- Basic Python programming knowledge
- Familiarity with software architecture concepts
- Understanding of basic robotics concepts (optional but helpful)

## ROS 2 Architecture Fundamentals

### The Distributed Nervous System Concept

ROS 2 operates as a distributed nervous system for robots:

1. **Nodes** act as computational units (like neurons)
2. **Topics** serve as communication pathways (like synapses)
3. **Services** provide request-response communication (like reflexes)
4. **Actions** handle long-running tasks with feedback (like complex behaviors)
5. **Middleware** (DDS) manages communication (like the central nervous system)

### Setting up a Basic Node with rclpy

```python
import rclpy
from rclpy.node import Node

class RobotNervousSystemNode(Node):
    def __init__(self):
        super().__init__('robot_nervous_system')
        self.get_logger().info('Robot Nervous System initialized')

def main(args=None):
    rclpy.init(args=args)
    node = RobotNervousSystemNode()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Communication Patterns

### Topics (Publish-Subscribe)

Topics enable continuous data flow:

```python
# Publisher
publisher = self.create_publisher(String, 'sensor_data', 10)

# Subscriber
subscriber = self.create_subscription(
    String,
    'sensor_data',
    self.sensor_callback,
    10
)
```

### Services (Request-Response)

Services handle synchronous operations:

```python
# Service Server
service = self.create_service(
    SetBool,
    'enable_motor',
    self.enable_motor_callback
)

# Service Client
client = self.create_client(SetBool, 'enable_motor')
```

### Actions (Goal-Oriented)

Actions manage long-running tasks:

```python
# Action Server
action_server = ActionServer(
    self,
    Fibonacci,
    'fibonacci',
    self.execute_fibonacci
)

# Action Client
action_client = ActionClient(self, Fibonacci, 'fibonacci')
```

## Robot Representation with URDF

URDF defines robot structure:

```xml
<robot name="simple_humanoid">
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.5 0.5 0.5"/>
      </geometry>
    </visual>
  </link>

  <joint name="base_to_head" type="fixed">
    <parent link="base_link"/>
    <child link="head"/>
  </joint>

  <link name="head">
    <visual>
      <geometry>
        <sphere radius="0.1"/>
      </geometry>
    </visual>
  </link>
</robot>
```

## AI Integration Pattern

AI agents connect to the ROS 2 nervous system:

```python
class AIAgentNode(Node):
    def __init__(self):
        super().__init__('ai_agent')

        # Subscribe to sensor data
        self.sensor_sub = self.create_subscription(
            LaserScan,
            'scan',
            self.scan_callback,
            10
        )

        # Publish commands to robot
        self.cmd_pub = self.create_publisher(
            Twist,
            'cmd_vel',
            10
        )

    def scan_callback(self, msg):
        # Process sensor data with AI
        command = self.ai_process_sensors(msg)
        # Send command to robot
        self.cmd_pub.publish(command)
```

## Control Flow: From AI Intent to Robot Motion

The complete flow from AI intent to physical action:

1. **AI Intent**: High-level goal (e.g., "navigate to location X")
2. **ROS Messages**: AI agent sends goals via ROS topics/services/actions
3. **Controllers**: Middleware translates goals to low-level commands
4. **Actuators**: Physical components execute the commands
5. **Feedback Loop**: Sensors provide feedback to adjust behavior

## Simulation Environment

Use Gazebo for safe experimentation:

```bash
# Launch robot simulation
ros2 launch my_robot_bringup my_robot.launch.py

# In another terminal, run AI agent
ros2 run my_ai_package ai_agent_node
```

## Key Takeaways

1. ROS 2 provides a distributed architecture for connecting AI reasoning to physical robot bodies
2. Three communication patterns (topics, services, actions) serve different purposes
3. URDF defines robot structure and kinematics
4. AI agents integrate as ROS 2 nodes that communicate with other components
5. Simulation environments allow safe experimentation without physical hardware

## Next Steps

1. Explore each communication pattern in detail
2. Learn to create custom message types
3. Understand Quality of Service (QoS) settings
4. Build complete robot applications using the patterns described