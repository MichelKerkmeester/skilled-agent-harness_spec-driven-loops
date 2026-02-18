// ---------------------------------------------------------------
// MODULE: Handlers (Barrel Export)
// ---------------------------------------------------------------

import * as memorySearch from './memory-search';
import * as memoryTriggers from './memory-triggers';
import * as memorySave from './memory-save';
import * as memoryCrud from './memory-crud';
import * as memoryIndex from './memory-index';
import * as checkpoints from './checkpoints';
import * as sessionLearning from './session-learning';
import * as causalGraph from './causal-graph';
// T061: L1 Orchestration - unified entry point
import * as memoryContext from './memory-context';

/* ---------------------------------------------------------------
   RE-EXPORTS: All handler functions
--------------------------------------------------------------- */

// Memory search handlers
export {
  handleMemorySearch,
  handle_memory_search,
} from './memory-search';

// Memory triggers handlers
export {
  handleMemoryMatchTriggers,
  handle_memory_match_triggers,
} from './memory-triggers';

// Memory save handlers
export {
  handleMemorySave,
  indexMemoryFile,
  atomicSaveMemory,
  getAtomicityMetrics,
  handle_memory_save,
  index_memory_file,
  atomic_save_memory,
  get_atomicity_metrics,
} from './memory-save';

// Memory CRUD handlers
export {
  handleMemoryDelete,
  handleMemoryUpdate,
  handleMemoryList,
  handleMemoryStats,
  handleMemoryHealth,
  setEmbeddingModelReady,
  handle_memory_delete,
  handle_memory_update,
  handle_memory_list,
  handle_memory_stats,
  handle_memory_health,
  set_embedding_model_ready,
} from './memory-crud';

// Memory index handlers
export {
  handleMemoryIndexScan,
  indexSingleFile,
  findConstitutionalFiles,
  findSkillReferenceFiles,
  handle_memory_index_scan,
  index_single_file,
  find_constitutional_files,
  find_skill_reference_files,
} from './memory-index';

// Checkpoint handlers
export {
  handleCheckpointCreate,
  handleCheckpointList,
  handleCheckpointRestore,
  handleCheckpointDelete,
  handleMemoryValidate,
  handle_checkpoint_create,
  handle_checkpoint_list,
  handle_checkpoint_restore,
  handle_checkpoint_delete,
  handle_memory_validate,
} from './checkpoints';

// Session learning handlers
export {
  handleTaskPreflight,
  handleTaskPostflight,
  handleGetLearningHistory,
  handle_task_preflight,
  handle_task_postflight,
  handle_get_learning_history,
} from './session-learning';

// Causal graph handlers (T043-T047)
export {
  handleMemoryDriftWhy,
  handleMemoryCausalLink,
  handleMemoryCausalStats,
  handleMemoryCausalUnlink,
  handle_memory_drift_why,
  handle_memory_causal_link,
  handle_memory_causal_stats,
  handle_memory_causal_unlink,
} from './causal-graph';

// T061: L1 Orchestration handler
export {
  handleMemoryContext,
  handle_memory_context,
} from './memory-context';

/* ---------------------------------------------------------------
   SUB-MODULE REFERENCES (for direct access)
--------------------------------------------------------------- */

export {
  memorySearch,
  memoryTriggers,
  memorySave,
  memoryCrud,
  memoryIndex,
  checkpoints,
  sessionLearning,
  causalGraph,
  memoryContext,
};

