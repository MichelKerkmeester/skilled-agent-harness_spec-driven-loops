---
title: "Tasks: hub catalog truth repair"
description: "Ten hub-root feature catalogs mislead a reading agent: eight files cite retired compiled-routing directories, six roster and count claims contradict their own registries, four shipped capabilities have no catalog entry at all, and one safety claim about transport mutation is flatly wrong. This phase repairs them in four lanes, starting with the mechanical retired-path lane that takes the validator from 19 violations to 0."
trigger_phrases:
  - "hub catalog truth repair task list"
  - "feature catalog integrity task list"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/023-feature-catalog-integrity/002-hub-catalog-truth-repair"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the phased task breakdown"
    next_safe_action: "Execute T001 confirm-against-HEAD before further tasks"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Hub Catalog Truth Repair

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Status: Planned. No task is started.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 **Confirm findings against HEAD before any edit.** Run
      `python3 .opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --json` and record
      the baseline (expected: 19 violations, all `missing_source_path`). Run
      `rg -l "011-runtime-engine|010-live-activation" .opencode/skills/**/feature-catalog/` and record the file list
      (expected: 8, seven table cells plus one prose citation in
      `system-spec-kit/feature-catalog/governance/feature-flag-governance.md`). Re-check the six roster and count claims
      against their registries — CLI four-versus-six, sk-prompt packet ids, sk-doc twelve-versus-eleven, sk-design
      three-versus-two commands, the compiled-routing opt-in wording in two hubs, the advisor test baseline — because
      these are the ones most likely to have been repaired mid-flight. Confirm all four Lane C features still exist and
      still lack catalog entries. **Re-derive the authored-brand guard path**, which the research cited as
      `shared/scripts/authored-brand-boundary.mjs`; the real path is `shared/authored-brand/authored-brand-boundary.mjs`.
- [ ] T002 [P] Hand-run the five derived assertions from `plan.md` section 5 and record the mismatch counts as the
      Lane B baseline.
- [ ] T003 [P] Enumerate every plain-text `.md` row across the ten hub root tables (the phantom-row class).
- [ ] T004 Confirm `RC-008-02` remains closed at HEAD and record it as do-not-resurrect. It was refuted at iteration 9.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lane A — retired paths (unblocked, run first and alone)

- [ ] T005 Substitute `011-runtime-engine` to `014-runtime-engine` and `010-live-activation` to `013-live-activation`
      across the seven mirrored `compiled-routing-and-legacy-fallback.md` SOURCE FILES cells. Covers `RC-001-04` and
      `RC-006-02` (merge group).
- [ ] T006 Fix the eighth citation, which is prose in
      `system-spec-kit/feature-catalog/governance/feature-flag-governance.md` and invisible to today's validator.
- [ ] T007 Repair the five broken advisor anchors: `claude-hook.md`, `goal-opencode-plugin.md`, `advisor-rebuild.md`
      (two occurrences), `projection.md`. Covers the Lane A half of `RC-001-05`.
- [ ] T008 Confirm the validator now reports 0 violations and record the 19-to-0 delta.

### Lane B — stale rosters and counts

- [ ] T009 [P] `cli-external-orchestration`: correct four executor packets to the six the registry declares, at all
      four occurrences in the root. Covers `RC-005-01`.
- [ ] T010 [P] `sk-prompt`: replace the retired `prompt-improve` and `prompt-models` identifiers with
      `sk-prompt-improve` and `sk-prompt-models`, matching both the registry keys and the on-disk directories. Covers
      `RC-007-03`.
- [ ] T011 [P] `mcp-tooling`: replace the blanket "never mutate this workspace" claim with wording that carries the
      registry's `workspaceWrites` nuance for `mcp-figma`. Safety-ranked; do this before the other wording fixes.
      Covers `RC-005-02`.
- [ ] T012 [P] `sk-doc`: correct "twelve packets" to twelve modes over eleven packet owners, at all four occurrences.
      Covers `RC-006-03`.
- [ ] T013 [P] `sk-design`: correct the `/interface:*` command count to match `.opencode/commands/interface/`, and
      reassign `interaction-states-pass.md` away from the retired Motion owner. Covers `RC-002-03` and `RC-002-04`.
- [ ] T014 [P] `sk-code` and `system-deep-loop`: correct "opt-in" to default-on for compiled routing. Covers
      `RC-002-05` and `RC-004-03` (merge group).
- [ ] T015 [B] `system-skill-advisor`: handle the frozen 167-tests-across-23-files baseline per the volatile-value
      policy. Covers `RC-007-04`. **OPERATOR-DECISION (Q6).**
- [ ] T016 [P] `system-deep-loop` hub root: add a link to the nested runtime catalog so its 50 leaves are reachable
      from the hub a reader starts at. Covers `RC-004-05`.
- [ ] T017 Apply the cross-reference guardrail: where a fact is duplicated, link to the owner instead of copying.
      `cli-pi` fan-out and Devin/Cursor containment stay runtime-owned; the CLI hub gets accurate routing plus an
      ownership cross-reference, not duplicate leaves. Covers `RC-005-05`.

### Lane C — invisible shipped capabilities (four new leaves)

- [ ] T018 [P] Author the `sk-design` authored-brand lane leaf from the real guard at
      `shared/authored-brand/authored-brand-boundary.mjs` and its tests. Covers `RC-002-01`.
- [ ] T019 [P] Author the `sk-design` structural-fingerprint card-selection leaf, marked decision-support rather than a
      public mode. Covers `RC-002-02`.
- [ ] T020 [P] Author the `sk-git` multi-runtime git preflight advisory leaf: the 17-rule engine, the six runtime
      adapters, and the playbook scenario. `sk-git/SKILL.md` claims the catalog covers every capability, so this closes
      a self-contradiction. Covers `RC-006-01`.
- [ ] T021 [P] Author the `system-skill-advisor` `skill_graph_propagate_enhances` leaf plus its root entry. The tool is
      registered and dispatched today. Covers `RC-007-01`.

### Lane D — advisor structural repair and hygiene

- [ ] T022 Remove the phantom `hooks-and-plugin/opencode-hook.md (not yet authored)` row and reconcile the feature
      count with the leaf count in the same edit. Covers `RC-001-05` and `RC-007-02` (merge group). Do not author the
      missing leaf from obsolete hook names; the live plugin surface is `event` plus
      `experimental.chat.system.transform`, so either consolidate with the OpenCode Plugin Bridge entry or write a
      current adapter entry.
- [ ] T023 Reshape the advisor root from two-column Feature/File tables to the governing
      H3/Description/Current-Reality/Source-Files form, **before** any parity rule is applied. Covers `RC-007-05`.
- [ ] T024 [B] Apply description parity at the ruled strictness across `cli-external-orchestration`, `mcp-tooling`,
      `sk-git`, `sk-doc` and `sk-prompt`. Covers `RC-005-03`, `RC-005-04`, `RC-006-07`, `RC-006-08`, `RC-007-06`.
      **OPERATOR-DECISION (Q2).**
- [ ] T025 [P] `sk-git` GitKraken: add the currently documented provider to the catalog scope. Covers `RC-006-04`.
- [ ] T026 [P] `sk-git` GitKraken: replace the em-dash validation row with a real anchor, or narrow the claim to what
      is tested. Narrowing is the default. Covers `RC-006-05`.
- [ ] T027 [P] `sk-git` GitHub MCP leaf: its only anchor exercises the `gh` CLI. Add a real MCP scenario or narrow the
      claim. Covers `RC-006-06`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T028 `validate_catalog_package.py --strict` exits 0; report the 19-to-0 delta against the T001 baseline.
- [ ] T029 `rg -l "011-runtime-engine|010-live-activation"` over the catalogs returns nothing, prose included.
- [ ] T030 Zero plain-text `.md` rows in any hub root table; re-run the T003 enumeration.
- [ ] T031 Re-run all five derived assertions; every one returns zero mismatches.
- [ ] T032 Manual check: each of the four new leaves cites an implementation path that exists and a validation anchor
      that exercises the described behavior.
- [ ] T033 Manual check: the two narrowed sk-git claims match what their anchors actually test.
- [ ] T034 Close the ten-lane `checklist.md`, one lane per hub, each with evidence.
- [ ] T035 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh
      .opencode/specs/sk-doc/023-feature-catalog-integrity/002-hub-catalog-truth-repair --strict` and confirm exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining, or each carries a recorded operator deferral
- [ ] All 28 findings closed or deferred with a reason; `RC-008-02` not reopened
- [ ] Validator at 0 on the hub packages, with the delta reported against a captured baseline
- [ ] `checklist.md` fully verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Rulings**: `../001-catalog-enforcement-and-coverage/decision-record.md`
- **Parent**: `sk-doc/023-feature-catalog-integrity`
- **Parallel sibling**: `003-large-surface-catalog-reconciliation` (disjoint files)
<!-- /ANCHOR:cross-refs -->
