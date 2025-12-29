import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'category',
      label: 'ROS2 Nervous System Book Module',
      items: [
        {
          type: 'category',
          label: 'Physical AI and ROS 2 Architecture',
          items: [
            'physical-ai-ros2-architecture/physical-ai-embodied-intelligence',
            'physical-ai-ros2-architecture/why-robots-need-middleware',
            'physical-ai-ros2-architecture/ros2-distributed-nervous-system'
          ],
        },
        {
          type: 'category',
          label: 'Communication and Control with ROS 2',
          items: [
            'communication-control-ros2/nodes-computational-units',
            'communication-control-ros2/topics-services-actions',
            'communication-control-ros2/python-ai-agents-rclpy'
          ],
        },
        {
          type: 'category',
          label: 'Robot Representation and End-to-End Control Flow',
          items: [
            'robot-representation-control-flow/urdf-links-joints-structure',
            'robot-representation-control-flow/ai-intent-to-ros-messages',
            'robot-representation-control-flow/controllers-actuators-feedback'
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Module 2: The Digital Twin',
      items: [
        'module-2-digital-twin/digital-twins',
        'module-2-digital-twin/physics-and-sensors-gazebo',
        'module-2-digital-twin/visualization-and-interaction-unity'
      ],
    },
    {
      type: 'category',
      label: 'Module 3: The AI-Robot Brain (NVIDIA Isaac)',
      items: [
        'module-3-isaac-ai-brain/nvidia-isaac-overview',
        'module-3-isaac-ai-brain/perception-navigation',
        'module-3-isaac-ai-brain/sim-to-real-transfer'
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action (VLA)',
      items: [
        'module-4-vla/spec',
        'module-4-vla/vision-language-action-overview',
        'module-4-vla/voice-to-action',
        'module-4-vla/llm-based-planning',
        'module-4-vla/prompt-history'
      ],
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
