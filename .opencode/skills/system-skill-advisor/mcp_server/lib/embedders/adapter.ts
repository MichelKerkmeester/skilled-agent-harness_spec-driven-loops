// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — adapter interface
// ───────────────────────────────────────────────────────────────

import type { BackendKind } from './types.js';

export type EmbedderInputType = 'document' | 'query';

export interface EmbedderOptions {
  readonly inputType?: EmbedderInputType;
}

export interface EmbedderAdapter {
  readonly name: string;
  readonly dim: number;
  readonly backend: BackendKind;
  readonly prefixQuery?: string;
  readonly prefixDocument?: string;

  embed(texts: ReadonlyArray<string>, options?: EmbedderOptions): Promise<Float32Array[]>;
  ready(): Promise<boolean>;
}
