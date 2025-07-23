# Hasura GraphQL API Setup

This guide explains how to connect Hasura to your Supabase PostgreSQL database and configure the GraphQL API for the to-do application.

## 1. Connect Hasura to Supabase

1.  **Get your Supabase database connection string:**

    - In your Supabase project, go to `Settings` > `Database`.
    - Under `Connection string`, copy the URI.

2.  **Deploy Hasura Cloud and connect the database:**
    - Create a new project on [Hasura Cloud](https://cloud.hasura.io/).
    - During the project setup, you'll be prompted to connect a database. Paste the Supabase connection string.
    - Hasura will connect to your Supabase database.

## 2. Track the `todos` Table

1.  **Go to the `Data` tab in the Hasura Console.**
2.  You should see the `todos` table under the `public` schema.
3.  Click the **Track** button next to the `todos` table.
4.  Hasura will now expose a GraphQL API for this table.

## 3. Configure Permissions

For Hasura to enforce the RLS policies we created in Supabase, we need to forward the user's JWT from the Nuxt app to Hasura.

1.  **Configure a JWT secret in Hasura:**

    - In your Hasura Cloud project settings, go to the `Env vars` section.
    - Add a new env var `HASURA_GRAPHQL_JWT_SECRET`.
    - The value should be your Supabase JWT secret, which you can find in your Supabase project settings under `API` > `JWT Settings`. It will look like this:
      ```json
      {
        "type": "HS256",
        "key": "YOUR_SUPABASE_JWT_SECRET"
      }
      ```

2.  **Set up permissions for the `user` role:**
    - In the Hasura Console, go to the `Data` tab, select the `todos` table, and then go to the `Permissions` tab.
    - Create a new role called `user`.
    - **Select:**
      - Row permissions: `{"user_id":{"_eq":"X-Hasura-User-Id"}}`
      - Column permissions: Allow access to all columns.
    - **Insert:**
      - Row permissions: `{"user_id":{"_eq":"X-Hasura-User-Id"}}`
      - Column permissions: `id`, `title`, `is_completed`.
    - **Update:**
      - Row permissions: `{"user_id":{"_eq":"X-Hasura-User-Id"}}`
      - Column permissions: `title`, `is_completed`.
    - **Delete:**
      - Row permissions: `{"user_id":{"_eq":"X-Hasura-User-Id"}}`

## 4. Example GraphQL Queries and Mutations

Here are the basic GraphQL operations you'll use in your Nuxt app.

### Fetch all todos for the logged-in user

```graphql
query GetTodos {
  todos {
    id
    title
    is_completed
    created_at
  }
}
```

### Add a new todo

```graphql
mutation AddTodo($title: String!) {
  insert_todos_one(object: { title: $title }) {
    id
    title
    is_completed
    created_at
  }
}
```

### Update a todo

```graphql
mutation UpdateTodo($id: bigint!, $title: String, $is_completed: Boolean) {
  update_todos_by_pk(
    pk_columns: { id: $id }
    _set: { title: $title, is_completed: $is_completed }
  ) {
    id
    title
    is_completed
  }
}
```

### Delete a todo

```graphql
mutation DeleteTodo($id: bigint!) {
  delete_todos_by_pk(id: $id) {
    id
  }
}
```
