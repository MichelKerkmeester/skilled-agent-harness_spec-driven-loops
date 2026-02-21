// ---------------------------------------------------------------
// MODULE: Memory CRUD Types
// ---------------------------------------------------------------

interface DeleteArgs {
  id?: number | string;
  specFolder?: string;
  confirm?: boolean;
}

interface UpdateArgs {
  id: number;
  title?: string;
  triggerPhrases?: string[];
  importanceWeight?: number;
  importanceTier?: string;
  allowPartialUpdate?: boolean;
}

interface ListArgs {
  limit?: number;
  offset?: number;
  specFolder?: string;
  sortBy?: string;
}

interface StatsArgs {
  folderRanking?: string;
  excludePatterns?: string[];
  includeScores?: boolean;
  includeArchived?: boolean;
  limit?: number;
}

interface HealthArgs {
  _?: never;
}

interface ProviderMetadata {
  provider: string;
  model: string;
  healthy?: boolean;
}

interface MemoryHashSnapshot {
  id: number;
  content_hash: string | null;
  spec_folder?: string | null;
  file_path?: string | null;
}

type CrudMutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';

interface MutationLedgerInput {
  mutationType: CrudMutationType;
  reason: string;
  priorHash: string | null;
  newHash: string;
  linkedMemoryIds: number[];
  decisionMeta: Record<string, unknown>;
  actor: string;
  sessionId?: string | null;
}

export type {
  DeleteArgs,
  UpdateArgs,
  ListArgs,
  StatsArgs,
  HealthArgs,
  ProviderMetadata,
  MemoryHashSnapshot,
  MutationLedgerInput,
};
