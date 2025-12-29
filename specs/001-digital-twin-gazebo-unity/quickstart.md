# Quickstart: Digital Twin (Gazebo & Unity) Module

## Setup

1. Ensure you're in the project root directory
2. Verify Docusaurus is properly configured in the `frontend/` directory
3. Run `npm install` in the `frontend/` directory if dependencies are not installed

## Create Module Structure

```bash
# Navigate to the docs directory in frontend
cd frontend/docs

# Create the module directory
mkdir -p module-2-digital-twin

# Create the category file
cat > module-2-digital-twin/_category_.json << 'EOF'
{
  "label": "Module 2: The Digital Twin",
  "collapsed": false
}
EOF
```

## Create Chapter Files

```bash
# Create Chapter 1
cat > module-2-digital-twin/01-digital-twins.md << 'EOF'
---
title: Digital Twins in Physical AI
---

# Digital Twins in Physical AI
- Goals
- Key Concepts
- Summary
EOF

# Create Chapter 2
cat > module-2-digital-twin/02-physics-and-sensors-gazebo.md << 'EOF'
---
title: Physics & Sensors in Gazebo
---

# Physics & Sensors in Gazebo
- Goals
- Key Concepts
- Summary
EOF

# Create Chapter 3
cat > module-2-digital-twin/03-visualization-and-interaction-unity.md << 'EOF'
---
title: Visualization & Interaction in Unity
---

# Visualization & Interaction in Unity
- Goals
- Key Concepts
- Summary
EOF
```

## Verify Build

```bash
# Navigate to frontend directory
cd frontend

# Build the site to verify everything works
npm run build

# If building locally, you can also start the development server
npm start
```

## Verify Integration

1. Check that the new module appears in the sidebar
2. Verify all three chapters are accessible
3. Confirm the build process completes without errors