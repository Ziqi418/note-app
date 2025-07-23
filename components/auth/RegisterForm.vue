<template>
  <UCard class="w-96">
    <UForm :state="credentials" @submit="handleRegister">
      <UFormField label="Email" name="email" class="mb-4">
        <UInput v-model="credentials.email" type="email" placeholder="you@example.com" />
      </UFormField>

      <UFormField label="Password" name="password" class="mb-4">
        <UInput v-model="credentials.password" type="password" />
      </UFormField>

      <UButton type="submit" block>Register</UButton>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
const { register } = useAuth()
const credentials = reactive({ email: '', password: '' })

const handleRegister = async () => {
  try {
    await register(credentials)
    // You might want to show a message to the user to check their email for confirmation
    await navigateTo('/login')
  } catch (error) {
    console.error('Registration failed:', error)
    // You can add user-facing error handling here
  }
}
</script>