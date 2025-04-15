/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GROQ_API_URL: string;
  readonly VITE_GROQ_API_KEY: string;
  readonly VITE_GROQ_MODEL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 