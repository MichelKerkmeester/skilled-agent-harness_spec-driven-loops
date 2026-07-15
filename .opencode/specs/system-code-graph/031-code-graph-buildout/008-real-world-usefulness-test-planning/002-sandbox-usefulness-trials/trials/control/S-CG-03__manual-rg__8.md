# Control: createMCPSuccessResponse

```
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:15:import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:269:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:316:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:346:    return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:358:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:25:  createMCPSuccessResponse,
.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:1125:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:12:import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:133:    return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:311:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:20:import { createMCPSuccessResponse, createMCPErrorResponse, createMCPEmptyResponse } from '../lib/response/envelope.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:597:    return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:715:    return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:815:    return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:902:    return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:32:import { createMCPSuccessResponse, createMCPEmptyResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:507:  const _triggersResponse = createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts:17:import { createMCPSuccessResponse } from '../lib/response/envelope.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts:313:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts:376:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts:401:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:46:import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:374:    return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:701:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:17:import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:301:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/tests/integration-error-recovery.vitest.ts:15:type ErrorHelpers = Partial<Record<'createMCPSuccessResponse' | 'createMCPErrorResponse', unknown>>;
.opencode/skills/system-spec-kit/mcp_server/tests/integration-error-recovery.vitest.ts:186:      const hasCreateResponse = typeof errorHelpers.createMCPSuccessResponse === 'function';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2799:    const { createMCPSuccessResponse } = await import('../lib/response/envelope.js');
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2838:    return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/save/response-builder.ts:10:import { createMCPErrorResponse, createMCPSuccessResponse } from '../../lib/response/envelope.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/save/response-builder.ts:468:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/save/response-builder.ts:490:    return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/save/response-builder.ts:524:    return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/save/response-builder.ts:730:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:13:import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:166:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:17:import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:357:    return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:466:    return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:605:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:14:import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:289:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:19:import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:347:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:23:import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:342:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:388:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:530:    return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:549:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:613:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:764:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:10:import { createMCPSuccessResponse } from '../lib/response/envelope.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:369:      return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:419:    return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:606:    return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts:842:    return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts:7:import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts:48:    return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:67:import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:476:  return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:701:    return createMCPSuccessResponse({
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index-cooldown.vitest.ts:103:  createMCPSuccessResponse: (payload: unknown) => ({
.opencode/skills/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:750:      createMCPSuccessResponse: vi.fn((payload: unknown) => payload),
.opencode/skills/system-spec-kit/mcp_server/stress_test/memory/gate-d-benchmark-trigger-fast-path.vitest.ts:77:  createMCPSuccessResponse: vi.fn(({ data }: { data: Record<string, unknown> }) => ({
.opencode/skills/system-spec-kit/mcp_server/lib/response/envelope.ts:306: * Provides the createMCPSuccessResponse helper.
.opencode/skills/system-spec-kit/mcp_server/lib/response/envelope.ts:308:export function createMCPSuccessResponse<T = unknown>(options: CreateResponseOptions<T>): MCPResponse {

```