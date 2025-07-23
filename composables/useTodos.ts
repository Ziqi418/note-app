import { gql } from '@apollo/client/core'
import { ref } from 'vue'

const GET_TODOS = gql`
  query GetTodos {
    todos(order_by: {created_at: desc}) {
      id
      title
      is_completed
      created_at
    }
  }
`

const ADD_TODO = gql`
  mutation AddTodo($title: String!) {
    insert_todos_one(object: {title: $title}) {
      id
      title
      is_completed
      created_at
    }
  }
`

const UPDATE_TODO_COMPLETION = gql`
  mutation UpdateTodoCompletion($id: bigint!, $is_completed: Boolean) {
    update_todos_by_pk(
      pk_columns: {id: $id}, 
      _set: {
        is_completed: $is_completed
      }
    ) {
      id
      is_completed
    }
  }
`

const UPDATE_TODO_TITLE = gql`
  mutation UpdateTodoTitle($id: bigint!, $title: String!) {
    update_todos_by_pk(
      pk_columns: {id: $id}, 
      _set: {
        title: $title
      }
    ) {
      id
      title
    }
  }
`

const DELETE_TODO = gql`
  mutation DeleteTodo($id: bigint!) {
    delete_todos_by_pk(id: $id) {
      id
    }
  }
`

export const useTodos = () => {
  const { apolloClient } = useGraphQL()
  const todos = ref([])

  const fetchTodos = async () => {
    try {
      const { data } = await apolloClient.query({ 
        query: GET_TODOS,
        fetchPolicy: 'network-only' // Force network request, don't use cache
      })
      todos.value = data.todos
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  const addTodo = async (title: string) => {
    try {
      await apolloClient.mutate({
        mutation: ADD_TODO,
        variables: { title },
      })
      await fetchTodos() // Refetch todos after adding
    } catch (error) {
      console.error('Error adding todo:', error)
      throw error
    }
  }

  const updateTodo = async (id: number, updates: any) => {
    try {
      // Choose the appropriate mutation based on what's being updated
      if ('is_completed' in updates && !('title' in updates)) {
        // Only updating completion status
        await apolloClient.mutate({
          mutation: UPDATE_TODO_COMPLETION,
          variables: { id, is_completed: updates.is_completed },
        })
      } else if ('title' in updates && !('is_completed' in updates)) {
        // Only updating title
        await apolloClient.mutate({
          mutation: UPDATE_TODO_TITLE,
          variables: { id, title: updates.title },
        })
      } else {
        // Updating both
        // First update completion
        await apolloClient.mutate({
          mutation: UPDATE_TODO_COMPLETION,
          variables: { id, is_completed: updates.is_completed },
        })
        // Then update title if it's provided and not null/undefined
        if (updates.title) {
          await apolloClient.mutate({
            mutation: UPDATE_TODO_TITLE,
            variables: { id, title: updates.title },
          })
        }
      }
      
      await fetchTodos() // Refetch todos after updating
    } catch (error) {
      console.error('Error updating todo:', error)
      throw error
    }
  }

  const deleteTodo = async (id: number) => {
    await apolloClient.mutate({
      mutation: DELETE_TODO,
      variables: { id },
    })
    await fetchTodos() // Refetch todos after deleting
  }

  return {
    todos,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
  }
}