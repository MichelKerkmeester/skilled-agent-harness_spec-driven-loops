# Control: handlers-db-state-imports

```
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:13:import { ALLOWED_BASE_PATHS, DATABASE_PATH, checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:143:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:295:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:324:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:7:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:62:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:16:import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:193:  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:238:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:9:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:69:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:10:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:49:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts:4:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts:15:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:10:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1367:    await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:11:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:34:    await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:13:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:227:    await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:19:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:303:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:364:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:427:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:570:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:636:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:5:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:312:  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:323:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:470:  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:481:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:669:  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:674:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:63:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:627:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts:7:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts:235:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts:346:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts:389:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:12:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:35:    await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:15:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:441:    await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:674:    await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:749:    await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:875:    await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:28:import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2726:  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2731:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:10:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:234:  await checkDatabaseUpdated();

```