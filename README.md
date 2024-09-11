# test-for-qloo: Timeline Visualization

## How long you spent on the assignment

Approximately 5.5 hours.

## What you like about your implementation

The implementation is simple and uses CSS Grid for efficient layout.

## What you would change if you were going to do it again

I would add more features like zooming, drag-and-drop, and inline editing.
Modularizing Tooltip
Modularizing Event component
Avoid inline styles
Change the utils that use zoomLevel to custom hook and get the zoomLevel from the context directly instead of receving it from param
Change position absolute/ position relative by flex

## How you made your design decisions

I looked at other timeline visualizations for inspiration and decided to use CSS Grid for simplicity and efficiency.

## How you would test this if you had more time

Fix cursor grabbing active
Add unit testing (Storybook and Jest)
Add Typescript
Add e2e testing (Cypress)
Add accessibility compliance following WCAG 2.2 AAA

## Instructions to build and run the project

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm start` to start the development server.
4. Open `http://localhost:3000` to view the timeline.
