# Data Model: ROS2 Nervous System Book Module

**Date**: 2025-12-26
**Feature**: 001-ros2-nervous-system
**Modeler**: Claude Code

## Overview

This document defines the conceptual data model for the ROS2 Nervous System Book Module. Since this is a book content project, the "data model" represents the key concepts, relationships, and structures that will be taught to users.

## Core Entities

### ROS2Architecture
**Description**: The distributed system that connects AI reasoning components with physical robot bodies

**Attributes**:
- name: String (e.g., "ROS 2 Humble Hawksbill")
- middleware: String (e.g., "DDS Implementation")
- nodes: List[ROS2Node]
- communication_patterns: List[CommunicationPattern]

**Relationships**:
- Contains many ROS2Node
- Contains many CommunicationPattern

### ROS2Node
**Description**: A computational unit in the ROS 2 distributed system

**Attributes**:
- id: String (unique identifier)
- name: String (node name)
- type: NodeType (e.g., "AI Agent", "Sensor", "Controller", "Actuator")
- status: NodeStatus (e.g., "running", "idle", "error")
- publishers: List[Publisher]
- subscribers: List[Subscriber]
- services: List[ServiceServer]
- clients: List[ServiceClient]
- actions: List[ActionServer]
- action_clients: List[ActionClient]

**Relationships**:
- Belongs to one ROS2Architecture
- Has many Publisher
- Has many Subscriber
- Has many ServiceServer
- Has many ServiceClient
- Has many ActionServer
- Has many ActionClient

### CommunicationPattern
**Description**: The different ways nodes communicate in ROS 2

**Attributes**:
- type: PatternType (e.g., "Topic", "Service", "Action")
- name: String (e.g., "sensor_data", "move_arm", "navigate_to_pose")
- description: String
- qos_profile: QoSProfile
- message_type: String

### Publisher
**Description**: Component that publishes messages to a topic

**Attributes**:
- topic_name: String
- message_type: String
- qos_profile: QoSProfile
- rate: Float (optional, for rate-controlled publishing)

**Relationships**:
- Belongs to one ROS2Node

### Subscriber
**Description**: Component that subscribes to messages from a topic

**Attributes**:
- topic_name: String
- message_type: String
- qos_profile: QoSProfile
- callback_function: String

**Relationships**:
- Belongs to one ROS2Node

### ServiceServer
**Description**: Component that provides a service that other nodes can call

**Attributes**:
- service_name: String
- service_type: String (e.g., "std_srvs/SetBool")
- callback_function: String

**Relationships**:
- Belongs to one ROS2Node

### ServiceClient
**Description**: Component that calls services provided by other nodes

**Attributes**:
- service_name: String
- service_type: String
- request_timeout: Float

**Relationships**:
- Belongs to one ROS2Node

### ActionServer
**Description**: Component that executes long-running tasks with feedback

**Attributes**:
- action_name: String
- action_type: String (e.g., "move_base_msgs/MoveBase")
- callback_function: String

**Relationships**:
- Belongs to one ROS2Node

### ActionClient
**Description**: Component that sends goals to action servers

**Attributes**:
- action_name: String
- action_type: String
- goal_timeout: Float

**Relationships**:
- Belongs to one ROS2Node

### RobotModel
**Description**: Representation of a physical robot using URDF

**Attributes**:
- name: String (e.g., "humanoid_robot_1")
- urdf_file: String (path to URDF file)
- links: List[Link]
- joints: List[Joint]
- materials: List[Material]
- gazebo_config: GazeboConfig (optional)

**Relationships**:
- Contains many Link
- Contains many Joint
- Contains many Material

### Link
**Description**: A rigid body in the robot model

**Attributes**:
- name: String
- visual: VisualElement
- collision: CollisionElement
- inertial: InertialElement
- mass: Float
- origin: Pose

### Joint
**Description**: Connection between two links

**Attributes**:
- name: String
- type: JointType (e.g., "revolute", "prismatic", "continuous", "fixed")
- parent_link: String
- child_link: String
- origin: Pose
- axis: Vector3
- limits: JointLimits (optional)

### JointLimits
**Description**: Constraints for joint movement

**Attributes**:
- lower: Float (for revolute joints)
- upper: Float (for revolute joints)
- effort: Float
- velocity: Float

### AIAgent
**Description**: Software component that implements artificial intelligence reasoning and decision-making for robot control

**Attributes**:
- name: String (e.g., "navigation_agent", "manipulation_agent")
- framework: String (e.g., "TensorFlow", "PyTorch", "Custom")
- input_topics: List[String]
- output_topics: List[String]
- services_used: List[String]
- actions_used: List[String]
- control_algorithm: String

**Relationships**:
- Belongs to one ROS2Architecture
- Connects to many ROS2Node (via communication patterns)

### ControlFlow
**Description**: The path from high-level AI commands to physical robot actions

**Attributes**:
- name: String (e.g., "navigation_flow", "manipulation_flow")
- ai_intent: String (high-level goal)
- ros_messages: List[ROSMessage]
- controllers: List[Controller]
- actuators: List[Actuator]
- feedback_loops: List[FeedbackLoop]

**Relationships**:
- Connects AIAgent to Actuator via ROS2Node
- Contains many ROSMessage
- Contains many Controller
- Contains many Actuator
- Contains many FeedbackLoop

### ROSMessage
**Description**: The data structure passed between nodes

**Attributes**:
- type: String (e.g., "sensor_msgs/JointState", "geometry_msgs/Twist")
- fields: Map[String, FieldValue]
- timestamp: DateTime
- source_node: String
- destination_node: String

### Controller
**Description**: Component that translates high-level commands to low-level actuator commands

**Attributes**:
- name: String (e.g., "joint_trajectory_controller", "velocity_controller")
- type: ControllerType (e.g., "position", "velocity", "effort")
- controlled_joints: List[String]
- control_frequency: Float
- parameters: Map[String, String]

**Relationships**:
- Belongs to one RobotModel
- Connects to many Actuator

### Actuator
**Description**: Physical component that produces motion

**Attributes**:
- name: String
- type: ActuatorType (e.g., "servo", "stepper", "hydraulic")
- joint_name: String
- position: Float
- velocity: Float
- effort: Float

**Relationships**:
- Belongs to one RobotModel
- Connected to by one Controller

### FeedbackLoop
**Description**: Mechanism for sensing and correcting robot behavior

**Attributes**:
- name: String (e.g., "position_feedback", "force_feedback")
- sensor_type: String
- update_rate: Float
- correction_algorithm: String

## Relationships Summary

- ROS2Architecture contains many ROS2Node
- ROS2Node has many communication components (Publisher, Subscriber, etc.)
- RobotModel contains many Link and Joint
- ControlFlow connects AIAgent to Actuator through the ROS2Architecture
- AIAgent communicates with other nodes via CommunicationPattern

## Validation Rules

1. Every Joint must have a valid parent_link and child_link that exist in the same RobotModel
2. Every Controller must control joints that exist in the same RobotModel
3. Every Actuator must be associated with a joint that exists in the same RobotModel
4. Every ROS2Node must belong to exactly one ROS2Architecture
5. Topic names must follow ROS naming conventions (start with /, contain only alphanumeric characters and underscores)
6. Node names must be unique within the same ROS2Architecture
7. Message types must be valid ROS message types or custom types defined in the workspace

## State Transitions

### ROS2Node States
- `uninitialized` → `configuring` → `inactive` → `active` → `finalized`
- Can transition to `error` from any state
- Can transition back to `configuring` from `active` or `inactive` for reconfiguration

### Action States
- `pending` → `active` → `preempting` → `succeeded` / `aborted` / `canceled`
- These states are managed by the action server/client interface