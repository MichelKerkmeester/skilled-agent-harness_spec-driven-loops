## Dimension

Correctness: TARGET 2 ONLY - edge-case audit of the shipped `deriveStatus` completion-evidence fallback.

## Files Reviewed

| File | Evidence |
| --- | --- |
| `.opencode/skills/sk-code-review/references/review_core.md` | Severity and evidence contract at lines 28-49 |
| `.claude/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md` | Iteration checklist at lines 166-176 |
| `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/deep-review-state.jsonl` | Prior state through iteration 5 at lines 1-6 |
| `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/deep-review-strategy.md` | Scheduled iteration 6 Target 2 edge-case focus at lines 77-80 |
| `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-005.md` | Prior Target 2 P1 explicit-status bypass finding at lines 48-58 |
| `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/spec.md` | REQ-001..REQ-005 at lines 132-143 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | frontmatter scalar extraction at lines 482-495; no-checklist fallback at lines 1215-1239; helper parsing at lines 1262-1280; derive assembly at lines 1307-1318; atomic writer at lines 1505-1527 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | fixture shape at lines 22-37; deriveStatus tests at lines 383-439; writer interleaving test at lines 766-808 |

## Edge-Case Matrix

| Case | Current shipped behavior | Correctness assessment | Existing test coverage in `graph-metadata-schema.vitest.ts` |
| --- | --- | --- | --- |
| (a) Malformed or non-numeric `completion_pct` | `parseCompletionPct` reads the scalar, runs `Number(raw)`, and returns `null` for non-finite values at `graph-metadata-parser.ts:1262-1269`; the no-checklist branch maps `null` to preserved valid prior status or `planned` with `status_review_required` at `graph-metadata-parser.ts:1225-1233`. | Correct for a fresh derive through the patched fallback: malformed pct does not become a fresh `complete`. The already-recorded explicit-status bypass from iteration 5 still applies if a complete-like frontmatter status is present before this fallback. | Not directly covered. The suite covers absent pct at `graph-metadata-schema.vitest.ts:400-410`, but not malformed text such as `completion_pct: no`. |
| (b) `completion_pct` expressed as string `100` vs number `100` | `extractFrontmatterScalar` strips surrounding quotes at `graph-metadata-parser.ts:493-494`, and `Number(raw)` converts quoted numeric text to `100` at `graph-metadata-parser.ts:1262-1269`. | Correct: quoted numeric 100 reaches the same `completionPct >= 100 && !openTasks` gate as numeric 100. | Not directly covered. The fixture option is typed as `number | null` at `graph-metadata-schema.vitest.ts:29` and writes numeric YAML at `graph-metadata-schema.vitest.ts:100-105`; the happy-path test uses numeric 100 at `graph-metadata-schema.vitest.ts:383-394`. |
| (c) `tasks.md` contains only comments or non-checkbox lines | `hasOpenTaskItems` only matches GFM checkbox list items and returns `false` when none exist at `graph-metadata-parser.ts:1278-1280`; its own comment states zero checkbox items are treated as no open tasks at `graph-metadata-parser.ts:1272-1276`. With pct 100, the fallback returns `complete` at `graph-metadata-parser.ts:1236-1238`. | Vacuously true by current design, not a new spec gap: REQ-001 and the deliverables require `completion_pct >= 100` and no open `tasks.md` items, not at least one checked task item. | Not directly covered. Existing tests cover no open tasks by omitting task items in the numeric-100 happy path at `graph-metadata-schema.vitest.ts:383-394`, and open tasks at `graph-metadata-schema.vitest.ts:427-439`, but not comments-only `tasks.md`. |
| (d) `implementation-summary.md` exists but is empty or whitespace-only | Empty or whitespace-only content has no `completion_pct` scalar, so `parseCompletionPct` returns `null` at `graph-metadata-parser.ts:1262-1265`; the fallback returns non-complete for fresh derives at `graph-metadata-parser.ts:1225-1233`. | Correct for a fresh derive through the patched fallback: a zero-byte summary does not become a fresh `complete`. | Partially covered by behavior class. The absent-pct regression at `graph-metadata-schema.vitest.ts:400-410` exercises the same null-pct branch, but the fixture still writes a non-empty implementation summary at `graph-metadata-schema.vitest.ts:112-120`. |
| (e) Two processes call `deriveStatus` concurrently on the same folder | `deriveGraphMetadata` reads docs into local values, then passes them into `deriveStatus` at `graph-metadata-parser.ts:1307-1318`; the reviewed `deriveStatus` path performs no filesystem writes and has no shared mutable state. The shared module counter is used only by `writeGraphMetadataFile` temp paths at `graph-metadata-parser.ts:1505-1527`. | Correct for derive-only concurrency: two read-only derivations do not race through shared state. Concurrent mutation of source docs during a derive would be a broader consistency model question, not a defect in this completion gate. | Not directly covered for derive-only concurrency. The existing interleaving test covers atomic graph-metadata writes, not concurrent derives, at `graph-metadata-schema.vitest.ts:766-808`. |

## Findings by Severity

### P0

None.

### P1

None. Iteration 5 already recorded `T2-P1-001` for the explicit-status bypass at `iteration-005.md:48-58`; this edge-case pass found no separate P1 beyond that existing finding.

### P2

#### T2-P2-001 [P2] Edge-case completion-evidence behavior lacks direct parser regression tests

| Field | Detail |
| --- | --- |
| Claim | The shipped fallback handles the requested malformed pct, quoted pct, empty summary, zero-checkbox tasks, and derive-only concurrency cases, but the parser suite directly pins only numeric pct, absent pct, low pct, and open-task cases. |
| Evidence refs | `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:22-37`, `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:383-439`, `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:766-808`, `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1262-1280` |
| Final severity | P2: advisory test-coverage hardening. The shipped behavior is not a confirmed correctness bug under REQ-001..REQ-005. |
| Confidence | 0.78 |
| Downgrade trigger | Close if direct tests are added for quoted and non-numeric `completion_pct`, whitespace-only `implementation-summary.md`, comments-only `tasks.md`, and concurrent derive-only calls, or if maintainers explicitly accept the current branch-level tests as sufficient. |

## Traceability Checks

| Protocol | Result | Evidence |
| --- | --- | --- |
| spec_code | PASS | The patched fallback enforces non-complete for null/malformed pct and open tasks at `graph-metadata-parser.ts:1215-1239`; quoted numeric pct follows the same numeric conversion at `graph-metadata-parser.ts:1262-1269`; zero-checkbox tasks are no-open by documented helper behavior at `graph-metadata-parser.ts:1272-1280`. |
| checklist_evidence | NOT APPLICABLE | This iteration audited parser edge cases against `spec.md` requirements, not packet checklist completion. |
| skill_agent | PASS | `deep-review` was loaded and `sk-code-review/references/review_core.md` was read before severity classification. |
| agent_cross_runtime | NOT APPLICABLE | No cross-runtime executor behavior was under review. |
| feature_catalog_code | NOT APPLICABLE | No feature catalog surface was under review. |
| playbook_capability | NOT APPLICABLE | No playbook capability claim was under review. |

## SCOPE VIOLATIONS

None.

## Verdict

PASS with advisory. No new P0/P1 finding was found in the requested edge-case matrix; one P2 test-hardening advisory was recorded.

## Next Dimension

Continue with the scheduled Target 2 security/regression pass on `resolveGeneratedMetadataIntegrity` severity-resolution behavior versus the remaining pre-existing violation codes.

Review verdict: PASS
