<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">My To-Dos</h1>
    <TodosTodoList />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>