<template>
  <div class="flex items-center justify-between p-2 border-b">
    <div class="flex items-center">
      <UCheckbox :model-value="todo.is_completed" @update:model-value="handleToggle" class="mr-2" />
      <span :class="{ 'line-through': todo.is_completed }">{{ todo.title }}</span>
    </div>
    <UButton color="red" variant="ghost" icon="i-heroicons-trash" @click="handleDelete" />
  </div>
</template>

<script setup lang="ts">
import { useTodos } from '../../composables/useTodos'

const { updateTodo, deleteTodo } = useTodos()
const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['todo-updated', 'todo-deleted'])

const handleToggle = async () => {
  try {
    await updateTodo(props.todo.id, { is_completed: !props.todo.is_completed })
    emit('todo-updated')
  } catch (error) {
    console.error('Failed to update todo:', error)
  }
}

const handleDelete = async () => {
  try {
    await deleteTodo(props.todo.id)
    emit('todo-deleted')
  } catch (error) {
    console.error('Failed to delete todo:', error)
  }
}
</script>