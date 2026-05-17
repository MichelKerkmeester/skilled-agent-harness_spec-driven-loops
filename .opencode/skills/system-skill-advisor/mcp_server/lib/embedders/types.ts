// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — types
// ───────────────────────────────────────────────────────────────

export type BackendKind = 'ollama' | 'llama-cpp' | 'api' | 'sentence-transformers';

export interface EmbedderManifest {
  readonly name: string;
  readonly dim: number;
  readonly backend: BackendKind;
  readonly ollamaName?: string;
  readonly modelPath?: string;
  readonly apiUrl?: string;
  readonly prefixQuery?: string;
  readonly prefixDocument?: string;
  readonly maxInputChars?: number;
  readonly notes?: string;
}
