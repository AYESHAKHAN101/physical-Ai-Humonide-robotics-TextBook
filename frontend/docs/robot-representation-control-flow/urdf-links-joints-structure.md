---
sidebar_position: 1
title: "URDF: Links, Joints, and Humanoid Structure"
---

# URDF: Links, Joints, and Humanoid Structure

## Introduction

URDF (Unified Robot Description Format) is the established standard for representing robot structure in ROS ecosystems. It defines the physical structure of robots using links (rigid parts), joints (connections), and kinematic chains, providing the foundation for understanding humanoid robot structure.

## URDF Fundamentals

### What is URDF
URDF is an XML-based format that describes robot models in ROS. It specifies the physical and visual properties of a robot, including its kinematic structure, visual appearance, and collision properties.

### Key Components
- **Links**: Rigid bodies that make up the robot
- **Joints**: Connections between links that allow relative motion
- **Materials**: Visual appearance properties
- **Gazebo Extensions**: Simulation-specific properties

## Links: The Building Blocks

### Link Definition
Links represent rigid bodies in the robot structure. Each link has:

- **Inertial Properties**: Mass, center of mass, and inertia tensor
- **Visual Elements**: How the link appears visually
- **Collision Elements**: How the link behaves in collision detection

### Link Structure
```xml
<link name="link_name">
  <inertial>
    <origin xyz="0 0 0" rpy="0 0 0"/>
    <mass value="1.0"/>
    <inertia ixx="0.01" ixy="0" ixz="0" iyy="0.01" iyz="0" izz="0.01"/>
  </inertial>
  <visual>
    <origin xyz="0 0 0" rpy="0 0 0"/>
    <geometry>
      <box size="0.1 0.1 0.1"/>
    </geometry>
    <material name="blue">
      <color rgba="0 0 1 1"/>
    </material>
  </visual>
  <collision>
    <origin xyz="0 0 0" rpy="0 0 0"/>
    <geometry>
      <box size="0.1 0.1 0.1"/>
    </geometry>
  </collision>
</link>
```

### Common Link Shapes
- **Box**: Rectangular prism
- **Cylinder**: Cylindrical shape
- **Sphere**: Spherical shape
- **Mesh**: Complex shapes loaded from external files

## Joints: Connecting the Structure

### Joint Definition
Joints define how links connect and move relative to each other. Each joint has:

- **Type**: The kind of motion allowed
- **Parent/Child**: Which links are connected
- **Limits**: Constraints on motion (for some joint types)

### Joint Types

#### Fixed Joint
- **Motion**: No relative motion between links
- **Usage**: Rigid connections, attaching sensors
- **Example**: Connecting a camera to a robot's head

```xml
<joint name="head_camera_joint" type="fixed">
  <parent link="head"/>
  <child link="camera"/>
  <origin xyz="0.1 0 0.05" rpy="0 0 0"/>
</joint>
```

#### Revolute Joint
- **Motion**: Rotation around a single axis
- **Usage**: Rotating joints like elbows, knees
- **Limits**: Minimum and maximum rotation angles

```xml
<joint name="elbow_joint" type="revolute">
  <parent link="upper_arm"/>
  <child link="forearm"/>
  <axis xyz="0 1 0"/>
  <limit lower="-1.57" upper="1.57" effort="100" velocity="1"/>
  <origin xyz="0 0 -0.3" rpy="0 0 0"/>
</joint>
```

#### Continuous Joint
- **Motion**: Unlimited rotation around a single axis
- **Usage**: Wheels, rotating sensors
- **No limits**: Can rotate continuously

#### Prismatic Joint
- **Motion**: Linear sliding motion
- **Usage**: Linear actuators, telescoping mechanisms

#### Floating Joint
- **Motion**: 6 degrees of freedom (3 translational, 3 rotational)
- **Usage**: Simulating free-floating objects

## Humanoid Robot Structure

### Humanoid Design Principles
Humanoid robots mimic human body structure with:

- **Trunk**: Central body containing core components
- **Head**: Contains sensors (cameras, LIDAR, etc.)
- **Arms**: Manipulation capabilities with hands/end-effectors
- **Legs**: Locomotion capabilities
- **Degrees of Freedom**: Joints that enable human-like motion

### Typical Humanoid Structure
```xml
<robot name="simple_humanoid">
  <!-- Trunk -->
  <link name="torso">
    <visual>
      <geometry>
        <box size="0.3 0.2 0.5"/>
      </geometry>
    </visual>
  </link>

  <!-- Head -->
  <link name="head">
    <visual>
      <geometry>
        <sphere radius="0.1"/>
      </geometry>
    </visual>
  </link>

  <joint name="neck_joint" type="revolute">
    <parent link="torso"/>
    <child link="head"/>
    <axis xyz="0 1 0"/>
    <limit lower="-0.5" upper="0.5" effort="10" velocity="1"/>
    <origin xyz="0 0 0.3" rpy="0 0 0"/>
  </joint>

  <!-- Left Arm -->
  <link name="left_shoulder">
    <visual>
      <geometry>
        <cylinder radius="0.05" length="0.1"/>
      </geometry>
    </visual>
  </link>

  <joint name="left_shoulder_joint" type="revolute">
    <parent link="torso"/>
    <child link="left_shoulder"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" effort="50" velocity="1"/>
    <origin xyz="0.15 0 0" rpy="0 0 0"/>
  </joint>

  <!-- Additional links and joints for arms, legs, etc. -->
</robot>
```

## Kinematic Chains

### Forward Kinematics
Forward kinematics calculates the position and orientation of the end-effector based on joint angles. This is essential for understanding where robot parts are in space.

### Inverse Kinematics
Inverse kinematics calculates the joint angles needed to achieve a desired end-effector position. This is crucial for robot control and motion planning.

### Chain Representation
Kinematic chains in URDF represent the sequence of joints and links from a base to an end-effector:

- **Base**: Starting point (often the world frame or robot base)
- **Chain**: Sequence of joints and links
- **End-effector**: Final point of interest (hand, foot, tool)

## URDF Best Practices

### Naming Conventions
- Use descriptive names that indicate the component's function
- Follow consistent naming patterns (e.g., left_arm_shoulder_joint)
- Use underscores for multi-word names

### Organization
- Group related components in logical sections
- Use consistent coordinate frames
- Document complex joints and their purposes

### Validation
- Check for proper parent-child relationships
- Ensure all joints have defined parent and child links
- Verify that the robot model is kinematically complete

## Integration with ROS

### TF (Transforms)
URDF works with ROS's TF system to maintain relationships between coordinate frames:

- Each link gets a coordinate frame
- TF tree represents the kinematic structure
- Transforms update based on joint states

### Robot State Publisher
The robot_state_publisher node uses URDF to publish transforms based on joint states:

```python
# Example of publishing joint states
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import JointState
import math

class JointStatePublisher(Node):
    def __init__(self):
        super().__init__('joint_state_publisher')
        self.publisher = self.create_publisher(JointState, 'joint_states', 10)
        self.timer = self.create_timer(0.1, self.publish_joint_states)

    def publish_joint_states(self):
        msg = JointState()
        msg.name = ['joint1', 'joint2']
        msg.position = [math.sin(self.get_clock().now().nanoseconds * 1e-9),
                       math.cos(self.get_clock().now().nanoseconds * 1e-9)]
        self.publisher.publish(msg)
```

## Conclusion

URDF provides the foundation for representing robot structure in ROS ecosystems. Understanding links, joints, and humanoid structure is essential for grasping how AI commands translate to physical motion in humanoid robots. The proper use of URDF enables effective simulation, control, and visualization of robotic systems.