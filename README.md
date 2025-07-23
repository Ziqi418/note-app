# To-Do Application with Nuxt, Supabase, and Hasura

This project is a basic to-do application built with Nuxt.js, Supabase, and Hasura. It provides user authentication and basic CRUD (Create, Read, Update, Delete) functionality for to-do items.

## Technology Stack

*   **Frontend:** Nuxt.js with Nuxt UI
*   **Authentication:** Supabase Auth
*   **Database:** Supabase PostgreSQL
*   **GraphQL API:** Hasura

## 1. Project Structure

Here is the recommended file and directory structure:

```
.
├── .env                  # Environment variables
├── nuxt.config.ts
├── package.json
├── README.md
├── tsconfig.json
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.vue
│   │   └── RegisterForm.vue
│   ├── common/
│   │   ├── AppHeader.vue
│   │   └── AppFooter.vue
│   └── todos/
│       ├── TodoItem.vue
│       ├── TodoList.vue
│       └── AddTodoForm.vue
│
├── composables/
│   ├── useAuth.ts
│   ├── useGraphQL.ts
│   └── useTodos.ts
│
├── layouts/
│   ├── default.vue
│   └── auth.vue
│
├── middleware/
│   └── auth.ts
│
├── pages/
│   ├── index.vue
│   ├── login.vue
│   └── register.vue
│
├── plugins/
│   ├── apollo-client.ts
│   └── supabase.ts
│
└── types/
    └── index.ts
```

## 2. Supabase Setup

### Database Schema

Create a `todos` table with the following SQL schema. You can run this in the Supabase SQL Editor.

```sql
CREATE TABLE public.todos (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.todos OWNER TO postgres;

CREATE SEQUENCE public.todos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.todos_id_seq OWNER TO postgres;

ALTER SEQUENCE public.todos_id_seq OWNED BY public.todos.id;

ALTER TABLE ONLY public.todos ALTER COLUMN id SET DEFAULT nextval('public.todos_id_seq'::regclass);

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

### Row Level Security (RLS)

Enable RLS and create policies to ensure users can only manage their own data.

```sql
-- Enable RLS
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow individual read access" ON public.todos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow individual insert access" ON public.todos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow individual update access" ON public.todos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow individual delete access" ON public.todos FOR DELETE USING (auth.uid() = user_id);
```

## 3. Hasura Setup

### Connect to Supabase

1.  Get your database connection string from Supabase (`Settings` > `Database`).
2.  Create a new project on [Hasura Cloud](https://cloud.hasura.io/) and connect it to your Supabase database using the connection string.

### Track Table and Configure Permissions

1.  In the Hasura Console, go to the `Data` tab and **Track** the `todos` table.
2.  Configure a JWT secret in Hasura's environment variables (`HASURA_GRAPHQL_JWT_SECRET`). The value should be `{"type": "HS256", "key": "YOUR_SUPABASE_JWT_SECRET"}`. You can find your JWT secret in your Supabase project's API settings.
3.  Set up permissions for a `user` role on the `todos` table, using `{"user_id":{"_eq":"X-Hasura-User-Id"}}` as the row permission for all actions (select, insert, update, delete).

### GraphQL API

Hasura will automatically generate the GraphQL API. Here are some example operations:

```graphql
# Query
query GetTodos {
  todos { id, title, is_completed }
}

# Mutation
mutation AddTodo($title: String!) {
  insert_todos_one(object: {title: $title}) { id }
}
```

## 4. Nuxt.js Frontend

### Authentication

*   Use the `useAuth.ts` composable to wrap Supabase's `signInWithPassword`, `signUp`, and `signOut` methods.
*   Protect authenticated routes with `middleware/auth.ts`.
*   Use an `auth` layout for login and registration pages.

### GraphQL Integration

*   Initialize your GraphQL client (e.g., Apollo) in a Nuxt plugin.
*   Configure the client to send the Supabase JWT in the `Authorization` header with each request.
*   Use the `useTodos.ts` composable to handle all GraphQL queries and mutations for to-do items.

This document provides the architectural blueprint. The next step is to implement this design.