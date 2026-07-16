# Control: checkDatabaseUpdated

```
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:25:  checkDatabaseUpdated,
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:965:    const dbReinitialized = await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts:14:    checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts:22:    checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/stress_test/memory/gate-d-trigger-perf-benchmark.vitest.ts:242:    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:47:    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:133:    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:201:    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:243:    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/stress_test/memory/gate-d-benchmark-memory-search.vitest.ts:19:  checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/stress_test/memory/gate-d-benchmark-trigger-fast-path.vitest.ts:33:  checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/symlink-realpath-hardening.vitest.ts:60:          checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:29:  checkDatabaseUpdated: vi.fn(async () => undefined),
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:217:export async function checkDatabaseUpdated(): Promise<boolean> {
.opencode/skills/system-spec-kit/mcp_server/core/index.ts:50:  checkDatabaseUpdated,
.opencode/skills/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:39:    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-fallback-fingerprint.vitest.ts:366:      checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-fallback-fingerprint.vitest.ts:373:      checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:125:      vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:144:      vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:177:    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:263:    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:162:      checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:625:          checkDatabaseUpdated: vi.fn(async () => {}),
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:6:// Mock core/db-state to prevent real DB operations (checkDatabaseUpdated throws
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:12:    checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:20:    checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-ablation-drift.vitest.ts:11:  checkDatabaseUpdated: vi.fn(),
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-ablation-drift.vitest.ts:47:  checkDatabaseUpdated: mocks.checkDatabaseUpdated,
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-ablation-drift.vitest.ts:207:    mocks.checkDatabaseUpdated.mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:48:    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:105:        checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:113:        checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:160:        checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:168:        checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1001:          checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1008:          checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-constitutional-memory.vitest.ts:15:  checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:138:    vi.spyOn(coreModule, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-ingest-edge.vitest.ts:16:  checkDatabaseUpdated: mocks.mockCheckDatabaseUpdated,
.opencode/skills/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts:222:      vi.spyOn(coreIndex, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:34:    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:16:    checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:24:    checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts:32:  vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts:135:  it('T007b-H9: checkDatabaseUpdated failures return MCP error response with requestId', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts:136:    vi.spyOn(core, 'checkDatabaseUpdated').mockRejectedValue(new Error('marker read failed'));
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-list-edge.vitest.ts:26:  vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-list-edge.vitest.ts:114:  it('T006-L9: checkDatabaseUpdated failures return MCP error response with requestId', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-list-edge.vitest.ts:115:    vi.spyOn(core, 'checkDatabaseUpdated').mockRejectedValue(new Error('marker read failed'));
.opencode/skills/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:28:  checkDatabaseUpdated: vi.fn(async () => undefined),
.opencode/skills/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:88:  vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:185:      vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(true);
.opencode/skills/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:434:      vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:515:        vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:180:      // Mock checkDatabaseUpdated to prevent db-state reinitialization failures
.opencode/skills/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:181:      const dbSpy = vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/modularization.vitest.ts:200:    'checkDatabaseUpdated',
.opencode/skills/system-spec-kit/mcp_server/tests/modularization.vitest.ts:209:    'checkDatabaseUpdated', 'reinitializeDatabase',
.opencode/skills/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:58:    // Mock checkDatabaseUpdated to prevent db-state reinitialization failures
.opencode/skills/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:60:    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts:32:  checkDatabaseUpdated: mocks.mockCheckDatabaseUpdated,
.opencode/skills/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:14:    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:15:  checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts:84:      checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts:30:    checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts:38:    checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-embedding-semantic-search.vitest.ts:6:  checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:30:    checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:38:    checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:655:        checkDatabaseUpdated: checkDatabaseUpdatedMock,
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:664:        checkDatabaseUpdated: checkDatabaseUpdatedMock,
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1495:      expect(sourceCode).toContain('const dbReinitialized = await checkDatabaseUpdated()')
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-index-scope.vitest.ts:92:      checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:36:  checkDatabaseUpdated: mocks.mockCheckDatabaseUpdated,
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:13:import { ALLOWED_BASE_PATHS, DATABASE_PATH, checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:143:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:295:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:324:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:713:      checkDatabaseUpdated: vi.fn(async () => {}),
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:7:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:62:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts:83:  vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts:209:  it('T007a-S14: checkDatabaseUpdated failures return MCP error response with requestId', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts:210:    vi.spyOn(core, 'checkDatabaseUpdated').mockRejectedValue(new Error('marker read failed'));
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:16:// { checkDatabaseUpdated } from '../core', which re-exports from './db-state'.
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:21:    checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:29:    checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:705:      vi.mocked(core.checkDatabaseUpdated).mockRejectedValueOnce(new Error('db unavailable'));
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:16:import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:193:  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:238:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts:6:import { checkDatabaseUpdated, init, reinitializeDatabase } from '../core/db-state';
.opencode/skills/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts:93:      const firstAttempt = await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts:97:      const secondAttempt = await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:22:// Mock core/db-state to prevent real DB operations (checkDatabaseUpdated throws
.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:28:    checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:36:    checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts:103:      vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts:144:      vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts:212:      vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts:309:      vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts:328:      vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts:343:      vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-intent-routing.vitest.ts:8:  checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-intent-routing.vitest.ts:62:  checkDatabaseUpdated: mocks.checkDatabaseUpdated,
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-4-stage-search-pipeline.vitest.ts:11:  checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:5:// Mock core/db-state to prevent real DB operations (checkDatabaseUpdated throws
.opencode/skills/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:11:    checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:19:    checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:13:  checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:22:      checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index-cooldown.vitest.ts:43:  checkDatabaseUpdated: mocks.mockCheckDatabaseUpdated,
.opencode/skills/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:7:  checkDatabaseUpdated,
.opencode/skills/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:410:    await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:9:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:69:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:10:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:49:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts:4:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts:15:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:28:import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2726:  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2731:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts:7:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts:235:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts:346:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts:389:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:10:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1367:    await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:10:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:234:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:12:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:35:    await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:11:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:34:    await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:5:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:312:  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:323:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:470:  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:481:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:669:  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:674:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:63:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:627:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:15:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:441:    await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:674:    await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:749:    await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:875:    await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:19:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:303:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:364:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:427:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:570:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:636:  await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:13:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:227:    await checkDatabaseUpdated();
.opencode/skills/system-spec-kit/scripts/tests/test-bug-fixes.js:113:      const hasCheck = dbState.includes('checkDatabaseUpdated') || dbState.includes('check_database_updated');
.opencode/skills/system-spec-kit/scripts/tests/test-bug-fixes.js:117:             'checkDatabaseUpdated()/reinitializeDatabase() (or snake_case aliases) found');
.opencode/skills/system-spec-kit/scripts/tests/test-bug-fixes.js:120:             'checkDatabaseUpdated()/reinitializeDatabase() not found in dist/core/db-state.js');
.opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:289:    expect(typeof mcpCore.checkDatabaseUpdated).toBe('function');

```