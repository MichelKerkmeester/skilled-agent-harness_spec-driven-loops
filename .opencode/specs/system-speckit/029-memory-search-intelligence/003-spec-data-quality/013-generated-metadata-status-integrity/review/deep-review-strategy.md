---
title: Deep Review Strategy - gpt-followup-audit
description: Runtime strategy file for the two-target follow-up review (create.sh parent-packet corruption bug + phase-010 deriveStatus fix audit)
trigger_phrases:
  - "gpt followup audit review strategy"
  - "create.sh parent packet corruption"
  - "deriveStatus fix independent audit"
importance_tier: normal
contextType: planning
version: 1.0.0
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

Two independent targets reviewed in one session under executor cli-opencode (openai/gpt-5.5-fast, reasoningEffort=xhigh), stop_policy=max-iterations (10 forced iterations, no early convergence stop). Review target is READ-ONLY: no repo file outside `review/` may be modified, created, or deleted. No live `create.sh --phase` invocation against a real packet; reproduction only in an isolated /tmp copy.

## 2. TOPIC

**Target 1 — create.sh parent-packet corruption bug (newly found, not yet root-caused).**
While scaffolding a new phase under an existing parent packet (`create.sh --phase --phase-parent <existing-packet> --phase-names <name> ... "<feature description>"`), the PARENT packet's own `description.json` was found corrupted afterward: `specFolder` lost its track prefix, `description`/`keywords` were overwritten with the NEW CHILD phase's content, and `parentChain` was emptied. Caught by chance via git diff size, reverted with `git checkout --` before commit; never root-caused. Reproduced once; determinism and blast radius unconfirmed.

**Target 2 — independent audit of the shipped deriveStatus fix** (system-speckit/028 phase 010, commits `ea2bb09b7a`, `ca9bea9f78`, `b70a441388`, already committed+pushed on `system-speckit/029-memory-search-intelligence`). Fixed `deriveStatus` in `mcp_server/lib/graph/graph-metadata-parser.ts` to gate `complete` on `completion_pct >= 100 AND no open tasks.md items` instead of mere `implementation-summary.md` presence. New validator check `STATUS_COMPLETE_EVIDENCE_MISMATCH` in `mcp_server/lib/validation/generated-metadata-integrity.ts`, gated behind `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE` in `mcp_server/lib/config/capability-flags.ts`. Never had independent adversarial review — implementer wrote its own tests/smoke tests.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness — Target 1 root cause + Target 2 gate logic vs REQ-001..005
- [x] D2 Security — Target 1 write-path/blast-radius + Target 2 severity-resolution regression risk
- [x] D3 Traceability — Target 1 repo-wide corruption scan + Target 2 spec/test coverage cross-check
- [x] D4 Maintainability — Target 1 minimal-fix proposal quality complete; Target 2 test-suite gap analysis still scheduled for iteration 8
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- Not evaluating unrelated packets/skills outside the two named targets.
- Not implementing fixes — findings + remediation proposals only.
- Not running a live `create.sh --phase` against any real packet in this repo.
- Not auditing the full 815-file mcp_server test suite; scoped to the two named test files plus any files the reducer's own cross-reference discovers as direct importers of the changed functions.

## 5. STOP CONDITIONS

- Hard stop only at `iteration_count >= maxIterations` (10) — `stopPolicy: max-iterations` makes convergence telemetry-only before the ceiling.
- Both targets must have >=1 dedicated correctness pass and >=1 dedicated traceability/security pass before the final synthesis iteration is treated as adversarial wrap-up rather than new-ground coverage.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Correctness | CONDITIONAL | 1-2 | Target 1 parent description writer root cause and determinism confirmed. |
| Security | CONDITIONAL | 3 | Target 1 same-signature blast radius found one logical corrupted packet. |
| Maintainability | CONDITIONAL | 4 | Target 1 minimal fix and repair strategy proposed; Target 2 maintainability remains scheduled. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 6 active
- **P2 (Minor):** 1 active
- **Delta this iteration:** +0 P0, +1 P1, +0 P2

- T1-P1-001: Append-mode phase scaffolding overwrites the existing parent packet's `description.json` by calling `generate-description.js` on `FEATURE_DIR` after `FEATURE_DIR` has been set to the existing parent.
- T1-P1-002: Existing `001-speckit-memory` phase-parent metadata is already stored with basename-only `specFolder` and empty `parentChain` in both `.opencode/specs` and `specs` roots.
- T1-P1-003: Already-corrupted phase-parent metadata needs a scoped dry-run repair pass after the writer fix; the minimal code patch prevents future corruption but does not repair persisted basename-only `specFolder` and empty `parentChain` records.
- T2-P1-003: No orchestrator-level regression test covers the explicit status-completion enforcement flag, so active P1 `T2-P1-002` can remain green under the scoped resolver-only tests.

[Findings tracked in `deep-review-findings-registry.json`.]
<!-- MACHINE-OWNED: END -->

## 8. ITERATION PLAN (advisory, orchestrator may adapt)

| # | Focus | Target |
|---|-------|--------|
| 1 | Inventory + scope map: locate exact write path in create.sh/generate-description.ts/.js that touches the PARENT description.json during --phase --phase-parent; enumerate call graph | T1 |
| 2 | Correctness: determinism analysis — reproduce in isolated /tmp copy, does it happen every invocation or only under specific conditions (positional feature_description arg, stale/missing parent description.json, etc.) | T1 |
| 3 | Security/blast-radius: repo-wide scan of existing description.json files for the same corruption signature (specFolder missing track prefix, description/keywords matching a child phase instead of parent) | T1 |
| 4 | Traceability + maintainability: minimal-fix proposal, cross-check against is-phase-parent.ts/phase-classifier.ts assumptions | T1 |
| 5 | Correctness: audit graph-metadata-parser.ts deriveStatus diff (git show ea2bb09b7a) against spec.md REQ-001..REQ-005 acceptance criteria, one requirement at a time | T2 |
| 6 | Correctness/edge cases: malformed/non-numeric completion_pct, string vs number, tasks.md with only comments, empty implementation-summary.md, concurrent deriveStatus calls | T2 |
| 7 | Security/regression: resolveGeneratedMetadataIntegrity severity-resolution logic vs the other 7 pre-existing violation codes previously governed only by the blanket grandfather flag | T2 |
| 8 | Traceability/maintainability: test suite gap analysis in graph-metadata-schema.vitest.ts + generated-metadata-integrity.vitest.ts vs claimed coverage | T2 |
| 9 | Cross-cutting: capability-flags.ts default/rollout wiring correctness for SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE; re-verify T1 fix proposal against any T2 findings that might interact (both touch generated-metadata subsystem) | T1+T2 |
| 10 | Adversarial wrap-up: claim adjudication on all active P0/P1 across both targets, final verdict pass, no new ground unless genuine gaps remain | T1+T2 |

## 9. KNOWN CONTEXT

No resource-map.md present at init; coverage gate skipped. This is a fresh session (no prior review/ packet existed for this phase folder before init). Related prior work: phase 010's own implementation-summary.md documents the shipped fix's own test/verification claims (see spec_folder/implementation-summary.md) — treat as the artifact under audit, not as ground truth.

## 10. REVIEW BOUNDARIES

Allowed write paths: `review/iterations/*.md`, `review/deep-review-state.jsonl` (append-only), `review/deltas/*.jsonl`, `review/deep-review-strategy.md` (in-place), `review/deep-review-findings-registry.json` (in-place). All other repo paths are READ-ONLY for this session. Any would-be mutation outside these paths must be recorded as a `scope_violation` in the iteration narrative instead of executed.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 6
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `agent_cross_runtime`: N/A. No executor parity behavior was under review. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `agent_cross_runtime`: N/A. No executor parity behavior was under review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: N/A. No executor parity behavior was under review.

### `agent_cross_runtime`: NOT APPLICABLE. No cross-runtime agent parity behavior was under review. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `agent_cross_runtime`: NOT APPLICABLE. No cross-runtime agent parity behavior was under review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: NOT APPLICABLE. No cross-runtime agent parity behavior was under review.

### `agent_cross_runtime`: NOT APPLICABLE. No cross-runtime executor behavior was under review. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `agent_cross_runtime`: NOT APPLICABLE. No cross-runtime executor behavior was under review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: NOT APPLICABLE. No cross-runtime executor behavior was under review.

### `agent_cross_runtime`: NOT APPLICABLE. No executor parity behavior was under review. -- BLOCKED (iteration 9, 3 attempts)
- What was tried: `agent_cross_runtime`: NOT APPLICABLE. No executor parity behavior was under review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: NOT APPLICABLE. No executor parity behavior was under review.

### `blast_radius_scan`: Partial, read-only. Exact grep for basename-only `specFolder` and empty `parentChain` found candidate metadata shapes, including `.opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/description.json:3`; full path-aware corruption classification remains deferred to the planned blast-radius iteration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `blast_radius_scan`: Partial, read-only. Exact grep for basename-only `specFolder` and empty `parentChain` found candidate metadata shapes, including `.opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/description.json:3`; full path-aware corruption classification remains deferred to the planned blast-radius iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `blast_radius_scan`: Partial, read-only. Exact grep for basename-only `specFolder` and empty `parentChain` found candidate metadata shapes, including `.opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/description.json:3`; full path-aware corruption classification remains deferred to the planned blast-radius iteration.

### `checklist_evidence`: Deferred; this iteration was an inventory/root-cause pass and did not adjudicate checklist completion. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: Deferred; this iteration was an inventory/root-cause pass and did not adjudicate checklist completion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: Deferred; this iteration was an inventory/root-cause pass and did not adjudicate checklist completion.

### `checklist_evidence`: N/A for this iteration. This pass audited validator severity and rollout wiring, not checklist completion evidence. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `checklist_evidence`: N/A for this iteration. This pass audited validator severity and rollout wiring, not checklist completion evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: N/A for this iteration. This pass audited validator severity and rollout wiring, not checklist completion evidence.

### `checklist_evidence`: Not applicable for this iteration. The target was deterministic code-path adjudication, not checklist completion. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence`: Not applicable for this iteration. The target was deterministic code-path adjudication, not checklist completion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: Not applicable for this iteration. The target was deterministic code-path adjudication, not checklist completion.

### `checklist_evidence`: NOT APPLICABLE. This iteration audited test coverage against spec requirements, not packet checklist completion evidence. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `checklist_evidence`: NOT APPLICABLE. This iteration audited test coverage against spec requirements, not packet checklist completion evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: NOT APPLICABLE. This iteration audited test coverage against spec requirements, not packet checklist completion evidence.

### `checklist_evidence`: NOT APPLICABLE. This iteration was a read-only blast-radius data-integrity scan, not a completion-evidence audit. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence`: NOT APPLICABLE. This iteration was a read-only blast-radius data-integrity scan, not a completion-evidence audit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: NOT APPLICABLE. This iteration was a read-only blast-radius data-integrity scan, not a completion-evidence audit.

### `checklist_evidence`: NOT APPLICABLE. This pass audited code, prior review coverage, and spec requirement traceability, not packet checklist completion evidence. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `checklist_evidence`: NOT APPLICABLE. This pass audited code, prior review coverage, and spec requirement traceability, not packet checklist completion evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: NOT APPLICABLE. This pass audited code, prior review coverage, and spec requirement traceability, not packet checklist completion evidence.

### `checklist_evidence`: NOT APPLICABLE. This pass audited code/spec/test claims, not checklist completion evidence. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `checklist_evidence`: NOT APPLICABLE. This pass audited code/spec/test claims, not checklist completion evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: NOT APPLICABLE. This pass audited code/spec/test claims, not checklist completion evidence.

### `checklist_evidence`: NOT APPLICABLE. This Target 1 review pass is not auditing a completion checklist. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `checklist_evidence`: NOT APPLICABLE. This Target 1 review pass is not auditing a completion checklist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: NOT APPLICABLE. This Target 1 review pass is not auditing a completion checklist.

### `claim_adjudication`: PASS. Six active P1 findings across both targets received typed Hunter/Skeptic/Referee adjudication fields. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `claim_adjudication`: PASS. Six active P1 findings across both targets received typed Hunter/Skeptic/Referee adjudication fields.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `claim_adjudication`: PASS. Six active P1 findings across both targets received typed Hunter/Skeptic/Referee adjudication fields.

### `env_override_path`: CONDITIONAL due existing finding only. The shell validation bridge passes the helper into the resolver (`scripts/validation/generated-metadata-integrity.ts:81-85`), while the MCP orchestrator still omits `statusCompletionConsistencyEnforced` (`orchestrator.ts:563-568`). That is not a new mismatch; it is active finding `T2-P1-002` from iteration 7 and test gap `T2-P1-003` from iteration 8. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `env_override_path`: CONDITIONAL due existing finding only. The shell validation bridge passes the helper into the resolver (`scripts/validation/generated-metadata-integrity.ts:81-85`), while the MCP orchestrator still omits `statusCompletionConsistencyEnforced` (`orchestrator.ts:563-568`). That is not a new mismatch; it is active finding `T2-P1-002` from iteration 7 and test gap `T2-P1-003` from iteration 8.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `env_override_path`: CONDITIONAL due existing finding only. The shell validation bridge passes the helper into the resolver (`scripts/validation/generated-metadata-integrity.ts:81-85`), while the MCP orchestrator still omits `statusCompletionConsistencyEnforced` (`orchestrator.ts:563-568`). That is not a new mismatch; it is active finding `T2-P1-002` from iteration 7 and test gap `T2-P1-003` from iteration 8.

### `feature_catalog_code`: N/A. No feature-catalog surface was under review. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `feature_catalog_code`: N/A. No feature-catalog surface was under review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: N/A. No feature-catalog surface was under review.

### `feature_catalog_code`: NOT APPLICABLE. No feature catalog surface was under review. -- BLOCKED (iteration 10, 4 attempts)
- What was tried: `feature_catalog_code`: NOT APPLICABLE. No feature catalog surface was under review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: NOT APPLICABLE. No feature catalog surface was under review.

### `feature_catalog_code`: NOT APPLICABLE. The target was generated metadata identity, not feature catalog code. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_code`: NOT APPLICABLE. The target was generated metadata identity, not feature catalog code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: NOT APPLICABLE. The target was generated metadata identity, not feature catalog code.

### `flag_name_default`: PASS at resolver/helper level. The env constant is exactly `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE` (`capability-flags.ts:209`), the helper reads `process.env[STATUS_COMPLETION_CONSISTENCY_GATE_ENV]` and returns true only for `true` or `1` (`capability-flags.ts:218-220`), and the resolver's absent-option default is false/report mode (`generated-metadata-integrity.ts:348-352`). Tests assert the same default and true/1/false behavior (`generated-metadata-integrity.vitest.ts:296-310`). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `flag_name_default`: PASS at resolver/helper level. The env constant is exactly `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE` (`capability-flags.ts:209`), the helper reads `process.env[STATUS_COMPLETION_CONSISTENCY_GATE_ENV]` and returns true only for `true` or `1` (`capability-flags.ts:218-220`), and the resolver's absent-option default is false/report mode (`generated-metadata-integrity.ts:348-352`). Tests assert the same default and true/1/false behavior (`generated-metadata-integrity.vitest.ts:296-310`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `flag_name_default`: PASS at resolver/helper level. The env constant is exactly `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE` (`capability-flags.ts:209`), the helper reads `process.env[STATUS_COMPLETION_CONSISTENCY_GATE_ENV]` and returns true only for `true` or `1` (`capability-flags.ts:218-220`), and the resolver's absent-option default is false/report mode (`generated-metadata-integrity.ts:348-352`). Tests assert the same default and true/1/false behavior (`generated-metadata-integrity.vitest.ts:296-310`).

### `playbook_capability`: N/A. No playbook capability claim was under review. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `playbook_capability`: N/A. No playbook capability claim was under review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: N/A. No playbook capability claim was under review.

### `playbook_capability`: NOT APPLICABLE. No playbook capability claim was adjudicated. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `playbook_capability`: NOT APPLICABLE. No playbook capability claim was adjudicated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: NOT APPLICABLE. No playbook capability claim was adjudicated.

### `playbook_capability`: NOT APPLICABLE. No playbook capability claim was under review. -- BLOCKED (iteration 10, 4 attempts)
- What was tried: `playbook_capability`: NOT APPLICABLE. No playbook capability claim was under review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: NOT APPLICABLE. No playbook capability claim was under review.

### `skill_agent`: PASS. `deep-review` and `sk-code-review/references/review_core.md` were loaded before final severity calls. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `skill_agent`: PASS. `deep-review` and `sk-code-review/references/review_core.md` were loaded before final severity calls.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. `deep-review` and `sk-code-review/references/review_core.md` were loaded before final severity calls.

### `skill_agent`: PASS. `deep-review` was loaded, and `sk-code-review/references/review_core.md` was read before severity classification. -- BLOCKED (iteration 9, 3 attempts)
- What was tried: `skill_agent`: PASS. `deep-review` was loaded, and `sk-code-review/references/review_core.md` was read before severity classification.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. `deep-review` was loaded, and `sk-code-review/references/review_core.md` was read before severity classification.

### `skill_agent`: PASS. `deep-review` was loaded, and `sk-code-review/references/review_core.md` was read before the severity decision. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `skill_agent`: PASS. `deep-review` was loaded, and `sk-code-review/references/review_core.md` was read before the severity decision.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. `deep-review` was loaded, and `sk-code-review/references/review_core.md` was read before the severity decision.

### `skill_agent`: PASS. Deep-review was loaded and `sk-code-review/references/review_core.md` was read before the severity call. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `skill_agent`: PASS. Deep-review was loaded and `sk-code-review/references/review_core.md` was read before the severity call.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. Deep-review was loaded and `sk-code-review/references/review_core.md` was read before the severity call.

### `skill_agent`: PASS. The deep-review skill was loaded, and `sk-code-review/references/review_core.md` was read before severity classification. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `skill_agent`: PASS. The deep-review skill was loaded, and `sk-code-review/references/review_core.md` was read before severity classification.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. The deep-review skill was loaded, and `sk-code-review/references/review_core.md` was read before severity classification.

### `skill_agent`: Satisfied by loading deep-review and review core doctrine before severity calls. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent`: Satisfied by loading deep-review and review core doctrine before severity calls.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: Satisfied by loading deep-review and review core doctrine before severity calls.

### `spec_code`: CONDITIONAL. REQ-005 has direct tests for the main deriveStatus and validator branches, but the active orchestrator enforced-mode defect from iteration 7 is not pinned by an end-to-end test in the scoped files. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `spec_code`: CONDITIONAL. REQ-005 has direct tests for the main deriveStatus and validator branches, but the active orchestrator enforced-mode defect from iteration 7 is not pinned by an end-to-end test in the scoped files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: CONDITIONAL. REQ-005 has direct tests for the main deriveStatus and validator branches, but the active orchestrator enforced-mode defect from iteration 7 is not pinned by an end-to-end test in the scoped files.

### `spec_code`: CONDITIONAL. Target 1 code path and Target 2 code path were re-read. Active P1 findings remain tied to cited source lines. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `spec_code`: CONDITIONAL. Target 1 code path and Target 2 code path were re-read. Active P1 findings remain tied to cited source lines.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: CONDITIONAL. Target 1 code path and Target 2 code path were re-read. Active P1 findings remain tied to cited source lines.

### `spec_code`: CONDITIONAL. The resolver-level implementation satisfies the intended split: only `STATUS_COMPLETE_EVIDENCE_MISMATCH` uses `statusCompletionConsistencyEnforced`, and the seven legacy codes remain under `!opts.grandfather`. End-to-end wiring is incomplete because the MCP orchestrator path omits the new option. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `spec_code`: CONDITIONAL. The resolver-level implementation satisfies the intended split: only `STATUS_COMPLETE_EVIDENCE_MISMATCH` uses `statusCompletionConsistencyEnforced`, and the seven legacy codes remain under `!opts.grandfather`. End-to-end wiring is incomplete because the MCP orchestrator path omits the new option.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: CONDITIONAL. The resolver-level implementation satisfies the intended split: only `STATUS_COMPLETE_EVIDENCE_MISMATCH` uses `statusCompletionConsistencyEnforced`, and the seven legacy codes remain under `!opts.grandfather`. End-to-end wiring is incomplete because the MCP orchestrator path omits the new option.

### `spec_code`: Direct code path confirmed for Target 1. Target 2 REQ-001..REQ-005 was intentionally out of scope for this iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: Direct code path confirmed for Target 1. Target 2 REQ-001..REQ-005 was intentionally out of scope for this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: Direct code path confirmed for Target 1. Target 2 REQ-001..REQ-005 was intentionally out of scope for this iteration.

### `spec_code`: PASS for this iteration's cross-cutting scope. Target 1's corruption path is contained to `create.sh` plus the `generate-description` CLI payload construction and persistence path (`create.sh:1046-1062`, `create.sh:1310-1317`, `generate-description.ts:77-90`, `generate-description.ts:108`). Target 2's flag path is contained to `capability-flags.ts`, the generated-metadata integrity resolver, and validation callers (`capability-flags.ts:193-220`, `generated-metadata-integrity.ts:323-364`, `scripts/validation/generated-metadata-integrity.ts:81-85`, `orchestrator.ts:563-568`). No import, env read, or shared helper couples `capability-flags.ts` to the `create.sh` parent metadata writer. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `spec_code`: PASS for this iteration's cross-cutting scope. Target 1's corruption path is contained to `create.sh` plus the `generate-description` CLI payload construction and persistence path (`create.sh:1046-1062`, `create.sh:1310-1317`, `generate-description.ts:77-90`, `generate-description.ts:108`). Target 2's flag path is contained to `capability-flags.ts`, the generated-metadata integrity resolver, and validation callers (`capability-flags.ts:193-220`, `generated-metadata-integrity.ts:323-364`, `scripts/validation/generated-metadata-integrity.ts:81-85`, `orchestrator.ts:563-568`). No import, env read, or shared helper couples `capability-flags.ts` to the `create.sh` parent metadata writer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS for this iteration's cross-cutting scope. Target 1's corruption path is contained to `create.sh` plus the `generate-description` CLI payload construction and persistence path (`create.sh:1046-1062`, `create.sh:1310-1317`, `generate-description.ts:77-90`, `generate-description.ts:108`). Target 2's flag path is contained to `capability-flags.ts`, the generated-metadata integrity resolver, and validation callers (`capability-flags.ts:193-220`, `generated-metadata-integrity.ts:323-364`, `scripts/validation/generated-metadata-integrity.ts:81-85`, `orchestrator.ts:563-568`). No import, env read, or shared helper couples `capability-flags.ts` to the `create.sh` parent metadata writer.

### `spec_code`: PASS. The expected metadata fields come from `generate-description.ts:77-90`, while the observed files show basename-only `specFolder` and empty `parentChain`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code`: PASS. The expected metadata fields come from `generate-description.ts:77-90`, while the observed files show basename-only `specFolder` and empty `parentChain`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS. The expected metadata fields come from `generate-description.ts:77-90`, while the observed files show basename-only `specFolder` and empty `parentChain`.

### `spec_code`: PASS. The fix proposal follows the exact producer path from append-mode routing through parent generator invocation and preserves the separate child generator invocation. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec_code`: PASS. The fix proposal follows the exact producer path from append-mode routing through parent generator invocation and preserves the separate child generator invocation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS. The fix proposal follows the exact producer path from append-mode routing through parent generator invocation and preserves the separate child generator invocation.

### `spec_code`: PASS. The Target 1 code path was re-read from parser through append-mode routing, parent generation, generator canonical field construction, and atomic description write. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code`: PASS. The Target 1 code path was re-read from parser through append-mode routing, parent generation, generator canonical field construction, and atomic description write.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS. The Target 1 code path was re-read from parser through append-mode routing, parent generation, generator canonical field construction, and atomic description write.

### Blast-radius scan: Partial only. A broad read-only grep over `.opencode/specs/**/description.json` found many `specFolder`/`parentChain` records, but this iteration did not run an exhaustive classifier for corrupted parent signatures. Strategy already reserves that work for a later Target 1 pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Blast-radius scan: Partial only. A broad read-only grep over `.opencode/specs/**/description.json` found many `specFolder`/`parentChain` records, but this iteration did not run an exhaustive classifier for corrupted parent signatures. Strategy already reserves that work for a later Target 1 pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Blast-radius scan: Partial only. A broad read-only grep over `.opencode/specs/**/description.json` found many `specFolder`/`parentChain` records, but this iteration did not run an exhaustive classifier for corrupted parent signatures. Strategy already reserves that work for a later Target 1 pass.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
