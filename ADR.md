# Architecture Decision Record (ADR)

**Title**: State Management Strategy

## 1. Context

The application's state includes the master list of leads, the list of opportunities, UI state (search query, filters), and the state of the slide-over panel (open/closed, selected lead data, edit form state). The "Convert" action is now more complex, as it must update a lead's status in one list while simultaneously creating a new entry in another. This requires a robust, centralized approach to manage state transitions reliably.

## 2. Decision

We will use **React's built-in state management tools**: the Context API combined with a `useReducer` hook.

- A global `AppContext` will provide state and dispatch functions to the entire application.
- The `useReducer` hook will manage all complex state logic. It will handle actions like `LEADS_LOADED`, `LEAD_UPDATED`, `LEAD_CONVERTED`, and `FILTER_CHANGED`. This keeps the business logic predictable and separate from the UI components.
- Local component state (`useState`) will be reserved for simple, non-shared UI state, such as controlling the input values in the edit form before a "Save" action is dispatched.

## 3. Consequences

### Pros:

- **No Third-Party Dependencies**: This keeps the project lightweight and with less overengineering.
- **Centralized & Predictable Logic**: Using a reducer for all major state changes (including the two-part conversion logic) makes the application's behavior easier to understand, test, and debug.
- **Decoupled Components**: Components can dispatch actions without needing to know how the state will be updated, leading to cleaner, more maintainable code.

### Cons:

- **Minor Boilerplate**: Setting up the context, provider, actions, and reducer involves more initial code than using `useState` alone. However, this structure pays off by preventing complexity as features are added.
- **Performance at Scale**: For an app with thousands of records or very frequent updates, a single context could cause extra re-renders. For the specified scope of ~100 leads, this is not a concern.

## 4. Justification

The Context with `useReducer` pattern is the ideal choice for this project. It is powerful enough to handle the specified requirements—especially the updated conversion logic—without the overhead of an external library like Redux. This decision demonstrates a practical understanding of choosing the right tool for the job in a React application.
