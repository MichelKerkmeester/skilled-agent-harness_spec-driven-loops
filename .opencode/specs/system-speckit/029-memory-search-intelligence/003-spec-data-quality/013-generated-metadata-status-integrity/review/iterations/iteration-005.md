## Dimension

Correctness: TARGET 2 ONLY - REQ-BY-REQ AUDIT of the shipped `deriveStatus` completion-evidence fix.

## Files Reviewed

| File | Evidence |
| --- | --- |
| `.opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/spec.md` | REQ-001..REQ-005 at lines 132-143 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | status precedence at lines 1185-1195, no-checklist fallback at lines 1215-1239, helper parsing at lines 1262-1280, graph output at lines 1318 and 1356 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts` | mismatch validator at lines 179-233, resolver rollout at lines 323-364 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | flag contract and default-off reader at lines 193-220 |
| `.opencode/skills/system-spec-kit/scripts/validation/generated-metadata-integrity.ts` | validate.sh bridge wiring at lines 81-101 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | deriveStatus branch tests at lines 383-439, status-precedence tests at lines 496-520 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts` | validator report/enforced tests at lines 221-232 and flag tests at lines 296-313 |
| `git show ea2bb09b7a` | confirmed the code diff patched only the no-checklist fallback and added validator logic |
| `git show ca9bea9f78` | confirmed closure-doc changes only; no additional code fix for the bypass |
| `git show b70a441388` | no relevant changes to the reviewed Target 2 code paths |

## Requirements Extracted Verbatim

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| REQ-001 | `deriveStatus`'s `!checklistDoc` branch no longer returns `complete` from file-presence alone | A folder with an unfilled `implementation-summary.md` scaffold (no `completion_pct`, or `completion_pct` under 100, or open `tasks.md` items) and no `checklist.md` derives a non-`complete` status |
| REQ-002 | The null-`completion_pct` edge case (296 folders repo-wide) does not silently resolve to `complete` | A folder with no parseable `completion_pct` field derives a non-`complete` status with `reviewRequired: true` (or preserves a pre-existing valid status), never a fresh false-positive `complete` |
| REQ-003 | A new `validate.sh --strict` rule flags `derived.status: complete` folders whose completion evidence disagrees | Running the new check against a folder with `status: complete` but `completion_pct < 100` or open tasks produces a violation |
| REQ-004 | The new rule ships non-blocking (report/info mode) by default | A fresh `validate.sh --strict` run against one of the 213 already-mislabeled folders does NOT newly fail because of this rule alone, unless the new flag is explicitly opted into enforced mode |
| REQ-005 | Regression tests pin both fixes | `node --test` (or the relevant vitest suite) covers: the corrected `deriveStatus` branch, the null-`completion_pct` edge case, and the new validator rule in both report and enforced mode |

## REQ-by-REQ Audit

| ID | Verdict | Audit |
| --- | --- | --- |
| REQ-001 | PARTIALLY SATISFIED | The patched no-checklist fallback now reads `completion_pct`, reads `tasks.md`, and returns `complete` only when `completionPct >= 100 && !openTasks` at `graph-metadata-parser.ts:1215-1239`. However, `deriveStatus` returns any normalized frontmatter/table status before this fallback at `graph-metadata-parser.ts:1185-1195`, so an implementation-summary frontmatter `status: Done` can still produce `complete` without the required completion_pct/task evidence. The current test suite pins that bypass as expected behavior at `graph-metadata-schema.vitest.ts:510-520`. |
| REQ-002 | PARTIALLY SATISFIED | The fresh null-`completion_pct` fallback returns `planned` with review required at `graph-metadata-parser.ts:1225-1233`, and `deriveGraphMetadata` persists that review flag at `graph-metadata-parser.ts:1356`. But the earlier status-precedence path can create a fresh `complete` from `status: Done` with no parseable `completion_pct`, before the null-pct guard runs, at `graph-metadata-parser.ts:1185-1195`; the regression test at `graph-metadata-schema.vitest.ts:510-520` demonstrates that no `completion_pct` is needed for this complete result. |
| REQ-003 | SATISFIED | `assertStatusCompletionConsistency` runs for stored `derived.status === 'complete'`, reads `implementation-summary.md`, parses `completion_pct`, checks `tasks.md` for open items, and pushes `STATUS_COMPLETE_EVIDENCE_MISMATCH` when pct is absent/below 100 or open tasks exist at `generated-metadata-integrity.ts:179-233`. Tests cover absent pct, low pct, and open tasks at `generated-metadata-integrity.vitest.ts:221-249`. |
| REQ-004 | SATISFIED | The flag is documented/default-off in code and only returns true for `true`/`1` at `capability-flags.ts:193-220`. The resolver treats `STATUS_COMPLETE_EVIDENCE_MISMATCH` as blocking only when `statusCompletionConsistencyEnforced` is true at `generated-metadata-integrity.ts:344-363`. The validate bridge passes the flag and exits nonzero only on resolved `error` under strict at `scripts/validation/generated-metadata-integrity.ts:81-101`. Tests assert default report mode and explicit enforcement at `generated-metadata-integrity.vitest.ts:221-232` and `generated-metadata-integrity.vitest.ts:296-313`. |
| REQ-005 | PARTIALLY SATISFIED | Tests cover the new fallback branch for pct 100/no open tasks, absent pct, pct below 100, and open tasks at `graph-metadata-schema.vitest.ts:383-439`, and cover validator report/enforced mode at `generated-metadata-integrity.vitest.ts:221-232`. The suite does not fully pin the required evidence contract because it also asserts `implementationSummaryStatus: 'Done'` derives `complete` without `completion_pct` at `graph-metadata-schema.vitest.ts:510-520`, preserving the bypass identified under REQ-001/REQ-002. |

## Findings by Severity

### P0

None.

### P1

#### T2-P1-001 [P1] Explicit complete statuses bypass the new completion-evidence gate

| Field | Detail |
| --- | --- |
| Claim | `deriveStatus` can still produce a fresh `complete` result without `completion_pct >= 100` and without checking open tasks, because normalized frontmatter/table status is returned before the patched no-checklist fallback runs. |
| Evidence refs | `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1185-1195`, `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1215-1239`, `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:510-520`, `.opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/spec.md:134-143` |
| Counterevidence sought | I checked the patched fallback, the validator, the rollout flag, and the tests. The fallback is correctly gated, and the validator can report persisted mismatches, but neither prevents the earlier status-precedence branch from returning `complete` in `deriveStatus`. |
| Alternative explanation | Explicit `status: Done` may have been treated as authoritative completion evidence. That conflicts with this phase's requirement language, which names `completion_pct` and open `tasks.md` items as the completion evidence contract. |
| Final severity | P1: correctness/spec mismatch against REQ-001, REQ-002, and REQ-005. |
| Confidence | 0.86 |
| Downgrade trigger | Downgrade or close if the spec is amended to define explicit complete/done frontmatter as sufficient evidence independent of `completion_pct` and tasks, or if `deriveStatus` gates complete-like frontmatter statuses through the same evidence check. |

### P2

None.

## Traceability Checks

| Protocol | Result | Evidence |
| --- | --- | --- |
| spec_code | PARTIAL | REQ-003 and REQ-004 match the shipped code; REQ-001, REQ-002, and REQ-005 remain partially addressed because the explicit-status bypass can still derive complete without completion evidence. |
| checklist_evidence | NOT APPLICABLE | This iteration audited `spec.md` requirements directly, not checklist completion evidence. |
| skill_agent | PASS | `deep-review` was loaded, and `sk-code-review/references/review_core.md` was read before the severity call. |
| feature_catalog_code | NOT APPLICABLE | No feature catalog surface was under review. |
| playbook_capability | NOT APPLICABLE | No playbook capability claim was under review. |
| agent_cross_runtime | NOT APPLICABLE | No cross-runtime executor behavior was under review. |

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL. One new P1 finding remains for Target 2: the fallback branch is fixed, but the broader `deriveStatus` completion contract still has a complete-status bypass ahead of that branch.

## Next Dimension

Continue with the scheduled Target 2 edge-case correctness pass or traceability pass, focusing on whether explicit status precedence is intentional and whether tests should be revised to gate complete-like statuses on the same completion evidence.

Review verdict: CONDITIONAL
