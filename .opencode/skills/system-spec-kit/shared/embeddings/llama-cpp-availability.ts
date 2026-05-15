// ───────────────────────────────────────────────────────────────────
// MODULE: llama-cpp availability probe
// ───────────────────────────────────────────────────────────────────

// Sync helpers extracted from factory.ts so profile.ts can mirror
// the canonical Voyage -> OpenAI -> llama-cpp -> hf-local cascade
// without creating a circular dependency
// (factory.ts already imports from profile.ts).

import { existsSync } from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const LLAMA_CPP_DEFAULT_MODEL_FILE = 'embeddinggemma-300M-Q8_0.gguf';

export const LLAMA_CPP_DEFAULT_MODEL_PATH = path.join(
  os.homedir(),
  '.cache',
  'huggingface',
  'gguf',
  'embeddinggemma-300m',
  LLAMA_CPP_DEFAULT_MODEL_FILE,
);

function normalizeOptionalPath(rawPath: string | undefined | null): string | null {
  if (!rawPath || rawPath.trim().length === 0) {
    return null;
  }
  const trimmed = rawPath.trim();
  if (trimmed.startsWith('~/')) {
    return path.join(os.homedir(), trimmed.slice(2));
  }
  return path.resolve(trimmed);
}

export function resolveLlamaCppModelPath(): string {
  return normalizeOptionalPath(process.env.LLAMA_CPP_EMBEDDINGS_MODEL_PATH) || LLAMA_CPP_DEFAULT_MODEL_PATH;
}

export function resolveWorkspaceNodeLlamaCppEntrypoint(): string | null {
  let currentDir = path.dirname(fileURLToPath(import.meta.url));
  while (currentDir !== path.dirname(currentDir)) {
    const candidates = [
      path.join(currentDir, 'node_modules', 'node-llama-cpp', 'dist', 'index.js'),
      path.join(currentDir, 'mcp_server', 'node_modules', 'node-llama-cpp', 'dist', 'index.js'),
    ];
    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        return candidate;
      }
    }
    currentDir = path.dirname(currentDir);
  }
  return null;
}

export function getLlamaCppAvailability(): { available: boolean; reason?: string } {
  if (!resolveWorkspaceNodeLlamaCppEntrypoint()) {
    return {
      available: false,
      reason: 'node-llama-cpp is not installed',
    };
  }

  const modelPath = resolveLlamaCppModelPath();
  if (!existsSync(modelPath)) {
    return {
      available: false,
      reason: `GGUF model not found at ${modelPath}`,
    };
  }

  return { available: true };
}
