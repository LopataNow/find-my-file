/// <reference types="vite/client" />

export interface ImportMetaEnv {
    readonly VITE_BACKEND_API: string;
}

export interface ImportMeta {
    readonly env: ImportMetaEnv
}