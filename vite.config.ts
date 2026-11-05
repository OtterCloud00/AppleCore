import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

const config = defineConfig(({ command, isPreview, mode }) => {

  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value
  }


  const useCloudflare = command === 'build' || isPreview

  return {
    resolve: { tsconfigPaths: true },
    plugins: useCloudflare
      ? [
          devtools(),
          cloudflare({ viteEnvironment: { name: 'ssr' } }),
          tailwindcss(),
          tanstackStart(),
          viteReact(),
        ]
      : [
          devtools(),
          tailwindcss(),
          tanstackStart(),
          nitro(),
          viteReact(),
        ],
  }
})

export default config
