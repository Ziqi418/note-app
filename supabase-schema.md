# Supabase Schema and Security

This document outlines the database schema for the to-do application and the necessary Row Level Security (RLS) policies to protect user data.

## Table Definitions

### `todos` table

This table will store the to-do items for each user.

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

## Row Level Security (RLS)

RLS is essential to ensure that users can only access and manage their own to-do items.

### Enable RLS on the `todos` table

```sql
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
```

### Policies

1.  **Allow users to see their own todos:**

    ```sql
    CREATE POLICY "Allow individual read access"
    ON public.todos
    FOR SELECT
    USING (auth.uid() = user_id);
    ```

2.  **Allow users to insert their own todos:**

    ```sql
    CREATE POLICY "Allow individual insert access"
    ON public.todos
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
    ```

3.  **Allow users to update their own todos:**

    ```sql
    CREATE POLICY "Allow individual update access"
    ON public.todos
    FOR UPDATE
    USING (auth.uid() = user_id);
    ```

4.  **Allow users to delete their own todos:**

    ```sql
    CREATE POLICY "Allow individual delete access"
    ON public.todos
    FOR DELETE
    USING (auth.uid() = user_id);