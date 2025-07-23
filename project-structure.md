# Project Structure

Here is the recommended file and directory structure for the Nuxt 3 to-do application.

```
.
├── .env                  # Environment variables (Supabase URL, anon key, etc.)
├── .gitignore
├── nuxt.config.ts        # Nuxt configuration file
├── package.json
├── README.md
├── tsconfig.json
│
├── app/
│   └── router.options.ts # Optional: for custom router options
│
├── assets/
│   └── css/
│       └── main.css      # Global styles
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
│   ├── useAuth.ts        # Supabase authentication logic
│   ├── useGraphQL.ts     # GraphQL client (Apollo/urql) setup and helpers
│   └── useTodos.ts       # To-do related data fetching and mutations
│
├── layouts/
│   ├── default.vue       # Default layout with header/footer
│   └── auth.vue          # Layout for authentication pages
│
├── middleware/
│   └── auth.ts           # Route middleware to protect pages
│
├── pages/
│   ├── index.vue         # Homepage / main to-do list view
│   ├── login.vue
│   └── register.vue
│
├── plugins/
│   ├── apollo-client.ts  # (If using Apollo) Apollo client plugin
│   └── supabase.ts       # Supabase client initialization plugin
│
├── server/
│   └── api/
│       └── __sitemap.ts  # Example server route
│
└── types/
    └── index.ts          # TypeScript type definitions (e.g., for Todo items)