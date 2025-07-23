<template>
  <UCard class="w-96">
    <UForm :state="credentials" @submit="handleLogin">
      <UFormField label="Email" name="email" class="mb-4">
        <UInput v-model="credentials.email" type="email" placeholder="you@example.com" />
      </UFormField>

      <UFormField label="Password" name="password" class="mb-4">
        <UInput v-model="credentials.password" type="password" />
      </UFormField>

      <UButton type="submit" block>Login</UButton>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
const { login } = useAuth()
const credentials = reactive({ email: '', password: '' })

const handleLogin = async () => {
  try {
    await login(credentials)
    await navigateTo('/')
  } catch (error) {
    console.error('Login failed:', error)
    // You can add user-facing error handling here
  }
}
</script>