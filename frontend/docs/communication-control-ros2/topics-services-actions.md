---
sidebar_position: 2
title: "Topics, Services, and Actions"
---

# Topics, Services, and Actions

## Introduction

ROS 2 provides three distinct communication patterns that serve different purposes in robotic systems: topics for continuous data streams, services for request-response interactions, and actions for goal-oriented tasks with feedback. Understanding these patterns is essential for designing effective robotic applications.

## Topics (Publish-Subscribe Pattern)

### Overview
Topics enable asynchronous, many-to-many communication through a publish-subscribe pattern. Publishers send messages to a topic, and subscribers receive messages from that topic.

### Characteristics
- **Asynchronous**: Publishers and subscribers don't need to run simultaneously
- **Many-to-Many**: Multiple publishers can send to one topic, multiple subscribers can receive from one topic
- **Continuous**: Designed for streaming data like sensor readings or robot state

### Usage Examples
- Sensor data streams (camera images, LIDAR scans, IMU data)
- Robot state information (joint positions, odometry)
- Command streams (velocity commands, trajectory points)

### Code Example
```python
# Publisher
publisher = self.create_publisher(String, 'topic_name', 10)
msg = String()
msg.data = 'Hello World'
self.publisher.publish(msg)

# Subscriber
def callback(self, msg):
    self.get_logger().info(f'Received: {msg.data}')

subscriber = self.create_subscription(
    String,
    'topic_name',
    self.callback,
    10
)
```

### Quality of Service (QoS)
Topics support various QoS profiles for different requirements:
- **Reliability**: Reliable or best-effort delivery
- **Durability**: Volatile or transient local durability
- **History**: Keep all or keep last N messages

## Services (Request-Response Pattern)

### Overview
Services provide synchronous, one-to-one communication for request-response interactions. A client sends a request and waits for a response from a server.

### Characteristics
- **Synchronous**: Client blocks until response is received
- **One-to-One**: One client communicates with one server
- **Stateless**: Each request is independent of others

### Usage Examples
- Configuration requests (set parameters, enable/disable components)
- Single-shot operations (take photo, execute single action)
- Query operations (get robot status, retrieve configuration)

### Code Example
```python
# Service Server
def callback(self, request, response):
    response.success = True
    response.message = f'Processed: {request.data}'
    return response

service = self.create_service(
    SetBool,
    'service_name',
    self.callback
)

# Service Client
client = self.create_client(SetBool, 'service_name')

request = SetBool.Request()
request.data = True
future = client.call_async(request)
```

### Error Handling
- **Timeout**: Service calls can timeout if no response is received
- **Availability**: Clients should check if service is available before calling
- **Failure**: Services can return error responses

## Actions (Goal-Oriented Pattern)

### Overview
Actions handle long-running tasks with feedback and status reporting. They support goals, feedback during execution, and final results.

### Characteristics
- **Long-Running**: Designed for operations that take time to complete
- **Feedback**: Provides ongoing feedback during execution
- **Preemption**: Goals can be canceled or preempted
- **Status**: Supports various execution states (active, succeeded, aborted, etc.)

### Usage Examples
- Navigation tasks (move to position)
- Manipulation tasks (pick and place)
- Calibration procedures (sensor calibration)
- Complex multi-step operations

### Code Example
```python
# Action Server
def execute_callback(self, goal_handle):
    feedback_msg = Fibonacci.Feedback()
    result = Fibonacci.Result()

    for i in range(goal_handle.request.order):
        feedback_msg.sequence = self._get_partial_sequence(i)
        goal_handle.publish_feedback(feedback_msg)

    result.sequence = feedback_msg.sequence
    return result

action_server = ActionServer(
    self,
    Fibonacci,
    'fibonacci',
    execute_callback
)

# Action Client
action_client = ActionClient(self, Fibonacci, 'fibonacci')

goal_msg = Fibonacci.Goal()
goal_msg.order = 10
future = action_client.send_goal_async(goal_msg)
```

### States and Transitions
- **Pending**: Goal accepted but not yet started
- **Active**: Goal is currently being executed
- **Succeeded**: Goal completed successfully
- **Aborted**: Goal execution failed
- **Canceled**: Goal was canceled

## Pattern Selection Guide

### Use Topics When:
- Streaming continuous data
- Multiple subscribers need the same information
- Asynchronous communication is acceptable
- Data is time-sensitive (e.g., sensor data)

### Use Services When:
- Need immediate response to a request
- Operation is idempotent
- Operation is quick to complete
- Need to modify system state

### Use Actions When:
- Operation takes a long time to complete
- Need feedback during execution
- Operation can be canceled or preempted
- Need to track progress or status

## Integration with AI Agents

### Topics and AI
- AI agents subscribe to sensor topics for perception
- AI agents publish commands to robot control topics
- Continuous data flow enables real-time AI processing

### Services and AI
- AI agents call services for configuration
- AI agents provide services for other components
- Synchronous calls enable coordinated behavior

### Actions and AI
- AI agents send goals for complex robot behaviors
- AI agents monitor action feedback for adaptive control
- Long-running tasks enable complex AI planning

## Conclusion

The three communication patterns in ROS 2 - topics, services, and actions - provide a comprehensive toolkit for designing robotic applications. Each pattern serves specific use cases and understanding when to use each is crucial for effective robotic system design.