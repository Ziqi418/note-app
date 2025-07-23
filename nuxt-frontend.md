# Nuxt.js Frontend Design

This document details the design of the Nuxt.js frontend, including the authentication flow, component architecture, and data management strategy.

## 1. Authentication Flow

Authentication will be handled using the Supabase client.

1.  **Login/Registration:**
    *   Users will be directed to `/login` or `/register` pages.
    *   These pages will use an `auth` layout to provide a clean, focused UI.
    *   The `useAuth.ts` composable will contain the logic for signing in/up with Supabase (`supabase.auth.signInWithPassword`, `supabase.auth.signUp`).
    *   Upon successful login/registration, the user's session (including the JWT) will be stored by the Supabase client. The user will be redirected to the homepage (`/`).

2.  **Authenticated Routes:**
    *   The main to-do page (`/`) will be protected.
    *   We will use Nuxt's route middleware (`middleware/auth.ts`) to check if a user is authenticated before allowing access.
    *   If an unauthenticated user tries to access a protected page, they will be redirected to `/login`.

3.  **Logout:**
    *   A logout button in the `AppHeader.vue` component will call a `logout` function in `useAuth.ts`.
    *   This function will call `supabase.auth.signOut()`.
    *   The user will be redirected to the `/login` page.

## 2. Component Architecture

Components will be organized by feature as outlined in `project-structure.md`.

*   **`auth/`**:
    *   `LoginForm.vue`: A form with email/password fields and a submit button. Will use Nuxt UI components like `UInput` and `UButton`.
    *   `RegisterForm.vue`: Similar to the login form, but for new user registration.

*   **`todos/`**:
    *   `TodoList.vue`: Fetches and displays a list of to-do items using the `useTodos.ts` composable. It will iterate over the list and render a `TodoItem.vue` for each.
    *   `TodoItem.vue`: Displays a single to-do item's title. It will include buttons for editing (e.g., toggling `is_completed`) and deleting the item.
    *   `AddTodoForm.vue`: A simple form (e.g., in a modal or on the main page) to add a new to-do item.

*   **`common/`**:
    *   `AppHeader.vue`: Contains the site title/logo and a logout button for authenticated users.
    *   `AppFooter.vue`: A simple footer.

## 3. GraphQL Integration (`useGraphQL.ts`)

We will use a GraphQL client like Apollo or `urql` to communicate with the Hasura API. The choice depends on the complexity needed; `urql` is often lighter for simple cases.

1.  **Client Initialization (`plugins/apollo-client.ts` or similar):**
    *   The GraphQL client will be initialized as a Nuxt plugin.
    *   It needs to be configured with the Hasura GraphQL endpoint URL.
    *   Crucially, it must be configured to add the `Authorization` header to every request. The header's value will be the JWT from the Supabase session (`Bearer ${supabase.auth.getSession()?.access_token}`). This is how Hasura authenticates the user.

2.  **Composables (`composables/useTodos.ts`):**
    *   This composable will encapsulate all GraphQL operations related to to-dos.
    *   It will use the GraphQL client to execute queries (e.g., `GetTodos`) and mutations (`AddTodo`, `UpdateTodo`, `DeleteTodo`).
    *   It will manage the state of the to-do list (e.g., using `ref` or `reactive`) and provide functions to the components to interact with the data.

## 4. State Management

For this simple application, Nuxt's built-in `useState` composable will be sufficient for managing global state, such as the current user's profile or session information. More complex state can be handled within the feature-specific composables (`useAuth.ts`, `useTodos.ts`).