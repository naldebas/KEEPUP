# KEEPUP BI Dashboard

A business intelligence dashboard for the KEEPUP CRM & Loyalty Platform, providing real-time insights into customer behavior, business performance, and operational efficiency.

## ✨ Features

*   **📊 Interactive Dashboard**: At-a-glance view of key metrics like total revenue, new customers, and conversion rates with customizable time periods.
*   **📈 Data Visualization**: Rich charts for tracking revenue trends, customer growth, loyalty engagement, and booking statuses.
*   **👥 Customer Management (CRM)**: Full CRUD functionality for customer records.
*   **🤖 AI-Powered Insights**: Leverage the Google Gemini API to generate actionable insights from your customer data.
*   **🏆 Loyalty Program**: Configure loyalty tiers, benefits, and redeemable rewards to engage and retain customers.
*   **📧 Campaign Management**: Create and manage email & WhatsApp campaign templates, with AI-assisted content generation.
*   **🗓️ Reservations & Calendar**: Manage customer reservations and schedule promotional activities with an interactive calendar.
*   **🔐 Role-Based Access Control (RBAC)**: Different views and permissions for Admins, Branch Managers, and Staff, ensuring data security and relevance.
*   **📱 Responsive Design**: A clean user interface that works on various screen sizes.

## 🛠️ Tech Stack

*   **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Routing**: [React Router](https://reactrouter.com/)
*   **Charting**: [Recharts](https://recharts.org/)
*   **AI**: [Google Gemini API](https://ai.google.dev/)
*   **Testing**:
    *   Unit/Integration: [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
    *   End-to-End: [Playwright](https://playwright.dev/)

## 🚀 Getting Started

This project is set up to run in a web-based development environment.

### Prerequisites

An API key for the Google Gemini API is required for the AI-powered features to function. This key must be available as an environment variable:

```
API_KEY="YOUR_GEMINI_API_KEY"
```

The application is configured to read this key directly from `process.env.API_KEY`.

### Running the Application

1.  Open the project in the development environment.
2.  The application should start automatically.
3.  Navigate to the provided URL to view the app.

## 🧪 Testing

The application includes a comprehensive testing suite:

*   **Unit & Component Tests**: Located alongside the components, written with Vitest and React Testing Library.
*   **End-to-End Tests**: Located in the `tests-e2e` directory, written with Playwright.

## 📂 Project Structure

```
.
├── components/       # Reusable UI components, pages, and feature-specific components
├── context/          # React Context providers (Auth, Toast, etc.)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and libraries
├── sdk/              # SDK modules for interacting with APIs
├── services/         # Mock API implementation
├── tests/            # Vitest configuration and setup
├── tests-e2e/        # Playwright E2E tests
├── types.ts          # TypeScript type definitions
├── App.tsx           # Root component with routing setup
└── index.tsx         # Main entry point of the application
```

## 🔐 Test Accounts

Use the following email addresses on the login page to test different user roles:

*   **Admin**: `admin@example.com`
*   **Branch Manager**: `manager@example.com`
*   **Staff**: `staff@example.com`

(Any password will work with the mock API).
