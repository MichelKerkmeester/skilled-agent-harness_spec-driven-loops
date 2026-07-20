---
title: "Tasks: Compiled-Routing Playbooks — Scenario Matrix & LUNA-High Acceptance"
description: "Task breakdown for the 7-hub compiled-routing scenario matrix, its evidence contract, the non-frozen validators/executor, and the two-plane LUNA-High acceptance stage. Not yet started."
trigger_phrases:
  - "compiled routing playbook tasks"
  - "luna high acceptance task list"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Compiled-Routing Playbooks — Scenario Matrix & LUNA-High Acceptance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Reconcile this child's evidence-contract field names with `004`'s planned `row.compiledParity` shape (or plan an adapter).
- [ ] T002 [P] Read all 7 hubs' current `manual-testing-playbook.md` structure and evidence-field conventions.
- [ ] T003 [P] Read `validate-playbook-topology.cjs`'s current recursion boundary and verdict-enum handling.
- [ ] T004 [P] Confirm the hub activation manifest shape as the direct-read stopgap for serving-status evidence.

**Evidence (planned)**: Each read is checked against the real file at implementation time; the schema reconciliation with `004` is recorded before scenario authoring starts.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Author the `sk-code` compiled-routing scenario (surfaceBundle route shape) with the full 7-field evidence contract.
- [ ] T006 [P] Author the `mcp-tooling` compiled-routing scenario (ordered-bundle route shape).
- [ ] T007 [P] Author the `system-deep-loop` compiled-routing scenario (ordered-bundle route shape).
- [ ] T008 [P] Author the `cli-external-orchestration` compiled-routing scenario (ordered-bundle route shape).
- [ ] T009 [P] Author the `sk-prompt` compiled-routing scenario (default route shape).
- [ ] T010 [P] Author the `sk-design` compiled-routing scenario (bundle-rules route shape).
- [ ] T011 [P] Author the `sk-doc` compiled-routing scenario (bundle-rules route shape).
- [ ] T012 Author `validate-compiled-routing-scenarios.cjs` (non-frozen content validator; CF-PB-1 field contract).
- [ ] T013 Modify `validate-playbook-topology.cjs`: recurse into per-feature files; unify the verdict enum.
- [ ] T014 Author `cutover-playbook-executor.cjs` (non-frozen; runs the command sequence, gates on captured evidence).
- [ ] T015 Author `luna-acceptance.cjs`: orchestrator-owned scenario map, `providerModel=openai/gpt-5.6-luna`, `variant=high`, stdout/stderr captured separately, timeout → `SKIP`.
- [ ] T016 Add >= 1 gold-bearing held-out paraphrase scenario per hub (7 total), route withheld from the prompt.
- [ ] T017 [P] Realign the `sk-doc` root playbook to `mode-registry.json`/`hub-router.json` (drop the retired flat RESOURCE_MAP reference).
- [ ] T018 [P] Promote `mcp-tooling`'s Figma+Refero bundle from prose-supplemental to a primary evidence row.
- [ ] T019 [P] Prove `sk-prompt`'s `orderedBundle` dual-intent claim deterministic, or remove it.
- [ ] T020 Move secondary-authority checks (legacy/holdout/disambiguation) to an Optional Supplemental section.

**Evidence (planned)**: Each item lands as a scoped diff inside the Files-to-Change table in `spec.md`; no file outside that table is touched.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Content validator fixture sweep: reject id-only, reject missing-field, accept the real 7 scenarios.
- [ ] T022 Topology validator recursion fixture test against a hub with nested per-feature files.
- [ ] T023 Cutover executor dry run on >= 1 hub: gate outcome derived from captured evidence, not asserted.
- [ ] T024 LUNA-HIGH seeded transport-timeout fixture: classifies `SKIP`, never `PASS`/`FAIL`.
- [ ] T025 Holdout audit: every hub's holdout route is present in its own gold record and absent from its own prompt text.
- [ ] T026 Root-playbook realignment check across `sk-doc`, `mcp-tooling`, `sk-prompt`.
- [ ] T027 `validate.sh --strict` on this phase folder → Errors: 0.

**Evidence (planned)**: None of the above has run yet. This phase defines the acceptance bar; `implementation-summary.md` will be updated with real results once implementation starts.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 7 eligible hubs have exactly one compiled-routing scenario file with the full evidence contract.
- [ ] Content and topology validators pass their fixture sweeps.
- [ ] The cutover executor's gating is evidence-derived, proven on a dry run.
- [ ] The LUNA-HIGH stage classifies timeout as `SKIP` and every hub has a gold-bearing holdout.
- [ ] Root-playbook realignment lands for `sk-doc`, `mcp-tooling`, `sk-prompt`.
- [ ] Strict Level-2 packet validation passes on this phase folder.

**Evidence**: Not yet executed — Planned. This packet has not been implemented; the criteria above define what MUST be proven before `implementation-summary.md` can honestly claim completion.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification checklist**: See `checklist.md`
- **Completion record**: See `implementation-summary.md`
- **Upstream research**: `../001-research/{review-v1.md, synthesis-v1.md}` §2.3 (CF-PB-1..5), §2.2 (CF-BM-7)
- **Sibling dependency**: `../004-benchmark-compiled-lane-c/`

<!-- /ANCHOR:cross-refs -->
