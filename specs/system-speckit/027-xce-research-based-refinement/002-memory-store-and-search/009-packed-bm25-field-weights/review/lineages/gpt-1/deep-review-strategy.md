# Deep Review Strategy

## Topic
Fan-out lineage review of `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights`.

## Binding
`artifact_dir` is bound directly to `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/review/lineages/gpt-1` from `config.fanout_lineage_artifact_dir`. The `resolveArtifactRoot` node command was not run.

## Review Dimensions
| Dimension | Status | Iterations |
|-----------|--------|------------|
| Correctness | Covered, active P0 | 001, 005 |
| Traceability | Covered, active P0 | 002, 006 |
| Security | Covered, no finding | 003 |
| Maintainability | Covered, advisory P2 | 004 |

## Completed Dimensions
| Dimension | Verdict | Summary |
|-----------|---------|---------|
| Correctness | FAIL | Production async warmup does not finalize packed postings after the last non-empty batch. |
| Traceability | FAIL | Claimed current-corpus memory gate is based on a stop-word-only body fixture that avoids body postings. |
| Security | PASS | No credential, injection, auth, path traversal, or trust-boundary issue found in reviewed BM25 code. |
| Maintainability | PASS with advisory | Packet graph metadata includes out-of-scope drift files as key files. |

## Running Findings
| Severity | Count | Active IDs |
|----------|-------|------------|
| P0 | 2 | GPT1-F001, GPT1-F002 |
| P1 | 0 | none |
| P2 | 1 | GPT1-F003 |

## Files Under Review
| File | Coverage | Notes |
|------|----------|-------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts` | High | Packed engine, warmup, scoring, engine selection. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/lexical-normalizer.ts` | Focused | Stop-word filtering evidence for fixture validity. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts` | Medium | Engine comparison helper reviewed. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/fixtures/bm25-packed-fixture.ts` | High | Corpus and eval fixtures reviewed. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/bm25-packed-inmemory.vitest.ts` | High | Budget, weighting, selection, and comparison tests reviewed. |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | High | Requirements and completion claims cross-checked. |
| `description.json`, `graph-metadata.json` | Medium | Metadata cross-check found advisory drift. |

## Cross-Reference Status
| Protocol | Class | Status | Evidence |
|----------|-------|--------|----------|
| spec_code | Core | FAIL | REQ-001 memory-bound packed warmup is contradicted by GPT1-F001 and GPT1-F002. |
| checklist_evidence | Core | FAIL | Checked budget evidence depends on the invalid fixture in GPT1-F002. |
| feature_catalog_code | Overlay | PASS | Engine flag and exports exist for packed, legacy, auto, and sqlite routing. |
| playbook_capability | Overlay | PASS | Tests cover query-time field overrides and engine selection paths, aside from the active P0 gaps. |

## Known Context
The packet is Level 1 and marked shipped. Code graph MCP reported stale readiness, so structural graph answers were not used as authoritative evidence. Direct Grep/Glob/Read evidence was used instead. `resource-map.md` was not present in the target spec folder, so the resource-map coverage gate was skipped.

## What Worked
| Iteration | Approach |
|-----------|----------|
| 001 | Read production warmup control flow and compared it to finalization requirements. |
| 002 | Cross-checked fixture text against tokenizer stop-word filtering and budget claims. |
| 003 | Reviewed env parsing and SQLite fallback error behavior for security-sensitive input handling. |
| 004 | Compared derived metadata against implementation-summary out-of-scope drift notes. |
| 005 | Replayed correctness P0 and found no contradiction. |
| 006 | Replayed traceability P0 and found no contradiction. |

## What Failed
| Iteration | Approach | Reason |
|-----------|----------|--------|
| 001 | Code graph structural query | Graph readiness was stale, so direct file reads were used. |

## Exhausted Approaches
| Approach | Result |
|----------|--------|
| Re-read P0 code evidence | Both P0 findings remained active after replay. |
| Search for existing checklist.md | Not applicable, Level 1 packet has no checklist.md. |

## Ruled-Out Directions
| Direction | Reason |
|-----------|--------|
| Treat 3x RSS overage as this review's P0 | Spec gates current corpus only; 3x is documented as scale risk. |
| Flag FTS5 channel change | FTS5 path was not changed by this packet. |

## Next Focus
Open a remediation packet or patch for GPT1-F001 and GPT1-F002 before considering the packed fallback shipped.

## Review Boundaries
Max iterations: 6. Verdict mapping: active P0 forces FAIL. No files outside the lineage artifact directory were modified.

## Non-Goals
No code fixes were implemented. No external web research was performed. No nested agents were dispatched.

## Stop Conditions
Stopped after reaching `config.maxIterations` with all dimensions covered and active P0 findings unresolved.
