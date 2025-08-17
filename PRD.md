# Product Requirements Document (PRD)

## 1. Introduction & Goal

This document outlines the requirements for the **Mini Seller Console**. The goal is to build a lightweight, client-side React application that allows a sales representative to efficiently manage and triage leads, converting them into opportunities.

## 2. User Persona

**Alex, the Sales Rep**: Alex needs a simple tool to view incoming leads, quickly identify the most promising ones, update their status, and track conversions without the complexity of a full-fledged CRM.

## 3. Features & User Stories

### Feature 1: Leads List View

**User Story**: As Alex, I want to see all my leads in a single list so I can get a clear overview of my pipeline.

**Requirements**:

- On page load, the application must fetch and display leads from a local `leads.json` file.
- The list must display the `name`, `company`, `email`, `source`, `score`, and `status` for each lead.
- A loading indicator must be shown while data is being fetched.
- An "empty state" message should be displayed if no leads are available.

### Feature 2: Search, Filter, and Sort Leads

**User Story**: As Alex, I want to quickly find specific leads or focus on the most important ones, so I need to be able to search, filter, and sort my list.

**Requirements**:

- **Search**: An input field that allows searching by name or company. The list must update in real-time as the user types, with a **debounce mechanism** to prevent excessive re-renders.
- **Filter**: A dropdown menu to filter leads by status. The possible statuses are: "New", "Contacted", "Qualified", and "Converted".
- **Sort**: A control to sort the leads by score in descending order.

### Feature 3: Lead Detail and Editing

**User Story**: As Alex, I want to view more details about a lead and update their information quickly without leaving the main page.

**Requirements**:

- Clicking on a lead row opens a **slide-over side panel** displaying all lead details.
- The **status and email fields** in the panel must be editable inline.
- Email input must be validated for correct formatting before saving.

**Save/Cancel Actions**:

- **Save**: Persists changes to the application's state, simulating a network delay.
- **Cancel**: Discards any changes and closes the panel.
- **Error Handling**: All errors (e.g., validation failure, simulated save failure) must be communicated to the user via toast notifications.

### Feature 4: Lead Conversion

**User Story**: As Alex, once I've qualified a lead, I want to convert it into an Opportunity to move it to the next stage of the sales process.

**Requirements**:

- A "Convert Lead" button is visible in the Lead Detail Panel. This button should be **disabled if the lead's status is already "Converted"**.
- Clicking "Convert Lead" creates a new Opportunity object and updates the lead's **status to "Converted"**.
- The lead remains in the main list, but its table row should be visually distinguished with a success-themed background color.
- The new Opportunity appears in a simple "Opportunities" table on the main dashboard.
- An optional **amount field** should accept numbers and display the value formatted as a USD currency string (e.g., $1,500.00).

## 4. Nice-to-Haves

**Optimistic Updates**: When editing a lead, the UI should update instantly. If a simulated failure occurs, the UI should roll back to the original state and show an error toast. The failure rate should be low (<5%) and easily configurable.

## 5. Non-Functional Requirements

**Technology Stack**: React (Vite) + Tailwind CSS + ShadCN + TanStack Virtual.

**Performance**: The UI must remain smooth and responsive with up to 100 lead records.

**Environment**: The application must run entirely client-side using a local JSON file for data.
