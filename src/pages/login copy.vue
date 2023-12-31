<script setup lang="ts">
import logo from '@/assets/logo.svg?raw'
import { useTheme } from 'vuetify'

import { login } from '@/api/login'
import authV1MaskDark from '@/assets/images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@/assets/images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@/assets/images/pages/auth-v1-tree-2.png'
import authV1Tree from '@/assets/images/pages/auth-v1-tree.png'
import Message from '@/layouts/components/message/message'
import router from '@/router/index'

const form = ref({
  username: '',
  password: '',
  remember: false,
})

const vuetifyTheme = useTheme()
const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? authV1MaskLight
    : authV1MaskDark
})

const isPasswordVisible = ref(false)

const loginLsp = () => {
  login(form.value).then(res => {
    if (res.code === '200') {
      //存储登录信息
      localStorage.setItem("token", res.data.token)
      router.replace({
        path: '/',
        query: { redirect: router.currentRoute.fullPath }
      })
    } else {
      Message.warning(res.msg)
    }
  })
}


</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-4 pt-7" max-width="448">
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div v-html="logo" />
          </div>
        </template>

        <VCardTitle class="font-weight-semibold text-2xl text-uppercase">
          LSP
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 font-weight-semibold mb-1">
          Welcome to LSP! 👋🏻
        </h5>
        <p class="mb-0">
          请输入你的账号开启lsp之门🙈
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="() => { }">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField v-model="form.username" label="Account" type="account" />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField v-model="form.password" label="Password" :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible" />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <VCheckbox v-model="form.remember" label="Remember me" />

                <a class="ms-2 mb-1" href="javascript:void(0)">
                  忘记密码?
                </a>
              </div>

              <!-- login button -->
              <VBtn block type="submit" @click="loginLsp">
                Login
              </VBtn>
            </VCol>

            <!-- create account -->
            <!-- <VCol cols="12" class="text-center text-base">
              <span>New on our platform?</span>
              <RouterLink class="text-primary ms-2" :to="{ name: 'register' }">
                Create an account
              </RouterLink>
            </VCol> -->

            <!-- <VCol cols="12" class="d-flex align-center">
              <VDivider />
              <span class="mx-4">or</span>
              <VDivider />
            </VCol> -->

            <!-- auth providers -->
            <!-- <VCol cols="12" class="text-center">
              <AuthProvider />
            </VCol> -->
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VImg class="auth-footer-start-tree d-none d-md-block" :src="authV1Tree" :width="250" />

    <VImg :src="authV1Tree2" class="auth-footer-end-tree d-none d-md-block" :width="350" />

    <!-- bg img -->
    <VImg class="auth-footer-mask d-none d-md-block" :src="authThemeMask" />
  </div>
</template>


<style lang="scss">
@use "@core/scss/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
