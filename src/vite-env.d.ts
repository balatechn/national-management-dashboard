/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ZOHO_CLIENT_ID: string
  readonly VITE_ZOHO_CLIENT_SECRET: string
  readonly VITE_ZOHO_REDIRECT_URI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
