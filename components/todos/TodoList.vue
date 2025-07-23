<template>
  <div>
    <div class="flex gap-2 mb-4">
      <UButton @click="handleRefreshSession" variant="outline" size="sm">
        Refresh Session
      </UButton>
    </div>
    <TodosAddTodoForm @todo-added="fetchTodos" />
    <div v-for="todo in todos" :key="todo.id">
      <TodosTodoItem :todo="todo" @todo-updated="fetchTodos" @todo-deleted="fetchTodos" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, onMounted } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { useTodos } from '../../composables/useTodos'

const { todos, fetchTodos } = useTodos()
const { refreshSession, user } = useAuth()

// Fetch todos when component is mounted
onMounted(() => {
  fetchTodos()
})

const handleRefreshSession = async () => {
  try {
    await refreshSession()
  } catch (error) {
    console.error('Failed to refresh session:', error)
  }
}

// Watch for the user object to become available.
// This ensures we don't try to fetch data before authentication is confirmed.
watch(user, (newUser) => {
  if (newUser) {
    fetchTodos()
  }
}, { immediate: true }) // 'immediate' runs the watcher once on component mount.
</script>