/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  // добавляйте другие env переменные здесь по необходимости
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
