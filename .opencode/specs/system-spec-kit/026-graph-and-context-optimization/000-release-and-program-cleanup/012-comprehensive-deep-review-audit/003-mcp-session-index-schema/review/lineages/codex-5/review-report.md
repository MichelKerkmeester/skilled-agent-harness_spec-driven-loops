# Deep Review Report: MCP Session + Index + Schema/Entrypoint Slice

## Verdict
CONDITIONAL

The review loop covered correctness, security, traceability, and maintainability across the listed session/index/schema/entrypoint files. No P0 finding was found. One P1 remains active and blocks a clean PASS.

## Findings

### P1: Governed ingest metadata is accepted and validated, then discarded on scan/async ingest paths

Location:
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:472`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:721`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:263`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:253`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:627`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2074`

Evidence:
- `memory_index_scan` and `memory_ingest_start` strict schemas accept governance fields via `...governanceSchemaFields` (`tool-input-schemas.ts:455-462`, `tool-input-schemas.ts:472-476`).
- The allowed-parameter registry also permits tenant/user/agent/session/provenance/retention fields for both tools (`tool-input-schemas.ts:596-598`).
- The public `tool-schemas.ts` definitions expose only scan flags for `memory_index_scan` and only `paths`/`specFolder` for `memory_ingest_start` (`tool-schemas.ts:519-522`, `tool-schemas.ts:531-550`).
- Both handlers call `validateGovernedIngest()`, but scan calls `indexSingleFile()` with only quality/scan/async options (`memory-index.ts:330`, `memory-index.ts:721-725`), and async ingest creates a job with only `id`, `paths`, and `specFolder` (`memory-ingest.ts:263-267`).
- The job queue persists only identity/spec/path/progress/error/timestamp fields and invokes the worker with `filePath` only (`job-queue.ts:253-282`, `job-queue.ts:624-627`).
- Startup binds that worker to `indexSingleFile(filePath, false)` (`context-server.ts:2074-2077`).
- Governance storage and retention support exists, so the lost fields have real downstream effect (`vector-index-schema.ts:1721-1730`, `vector-index-schema.ts:1788-1791`, `memory-retention-sweep.ts:36`).

Impact:
Governed scan/async ingest callers can provide tenant/user/agent/session/provenance/retention metadata and pass validation, but that metadata is not written through to indexed memory rows. This can break scope isolation, provenance attribution, and retention behavior for memories created by scan or async ingest paths.

Fix:
Normalize the governed-ingest decision once, then pass the normalized metadata through both scan and async ingest. Concretely, align the public tool definitions with strict schemas, extend the `indexSingleFile()`/`indexMemoryFile()` options contract, persist governance metadata on ingest jobs, and pass it from the queue worker into the indexer. Add tests proving `memory_index_scan` and `memory_ingest_start` preserve tenant/session/provenance/retention fields through to `memory_index`.

## Traceability
| Protocol | Status | Notes |
|----------|--------|-------|
| `spec_code` | partial | REQ-001/REQ-002 were covered; F001 is the active schema-to-handler parity drift. |
| `checklist_evidence` | blocked | This Level 1 slice has no `checklist.md`; no checklist reconciliation was possible. |
| `feature_catalog_code` | partial | Public tool definitions and strict schema registry disagree for governed ingest fields. |
| `playbook_capability` | partial | Entrypoint validation exists, but governed ingest capability is not clean while F001 is active. |

## Coverage
- Correctness: covered in iteration 1.
- Security: covered in iteration 2.
- Traceability: covered in iteration 3.
- Maintainability: covered in iteration 4.
- Stabilization: covered in iteration 5.

## Ruled Out
- Missing dispatcher registration for target lifecycle/memory tools.
- Strict validation bypass at lifecycle/memory dispatch points.
- Path traversal escalation in `memory_ingest_start`.
- Cross-session targeted resume escalation for non-stdio transports.
- Embedder active pointer flipping before reindex completion.
- Separate P2+ maintainability issue in embedder list/set/status handlers.

## Synthesis
Final result is `CONDITIONAL`: one active P1, no active P0/P2. The next implementation work should fix F001 at the governance propagation boundary, not as a one-call-site patch.
