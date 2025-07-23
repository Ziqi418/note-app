<template>
  <UForm :state="newTodo" @submit="handleAddTodo" class="flex gap-2 mb-4">
    <UInput v-model="newTodo.title" placeholder="Add a new to-do..." class="flex-grow" />
    <UButton type="submit">Add</UButton>
  </UForm>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useTodos } from '../../composables/useTodos'

const { addTodo } = useTodos()
const emit = defineEmits(['todo-added'])
const newTodo = reactive({ title: '' })

const handleAddTodo = async () => {
  if (!newTodo.title.trim()) return
  try {
    await addTodo(newTodo.title)
    newTodo.title = ''
    emit('todo-added')
  } catch (error) {
    console.error('Failed to add todo:', error)
  }
}
</script>