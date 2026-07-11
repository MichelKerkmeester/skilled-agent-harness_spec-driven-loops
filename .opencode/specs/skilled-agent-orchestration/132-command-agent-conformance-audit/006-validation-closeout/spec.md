---
title: "Feature Specification: Phase 6: Validation & Close-Out"
description: "Phases 002-005 remediate command, doctor, agent, and README drift, but nothing yet proves the whole program landed cleanly as an integrated unit. Without a terminal validation pass the parent packet can be left claiming conflicting completion states, and any advisor-facing metadata change could silently regress routing. This phase runs last to gate the program on recursive strict validation, doctor route-validation, an advisor re-baseline, and a clean parent rollup."
trigger_phrases:
  - "validation closeout"
  - "recursive strict validate"
  - "doctor route-validate parent rollup"
  - "advisor re-baseline no regression"
  - "006-validation-closeout"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-command-agent-conformance-audit/006-validation-closeout"
    last_updated_at: "2026-07-11T00:30:00Z"
    last_updated_by: "fable-5"
    recent_action: "Authored scope-locked spec/plan/tasks for CMD-05, XS-01, XS-03 findings"
    next_safe_action: "Await 002-005 completion; operator approval gates XS-01 skill-graph regen"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
      - ".opencode/commands/doctor/scripts/route-validate.sh"
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
      - ".opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py"
      - ".opencode/commands/doctor/scripts/skill-graph-freshness.cjs"
      - ".opencode/specs/skilled-agent-orchestration/132-command-agent-conformance-audit/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: Validation & Close-Out

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-readme-alignment |
| **Successor** | None |
| **Handoff Criteria** | Terminal phase — program closes when: (1) XS-01 skill-graph regen is either operator-approved-and-executed or explicitly deferred with rationale; (2) CMD-05 contracts recompiled + manifest reconciled; (3) XS-03 12-hub timestamp backfill done; (4) recursive strict validate is Errors:0; (5) `route-validate` exits 0; (6) advisor re-baseline shows no routing regression (or documents an intended delta); (7) parent rollup has `children_ids` == on-disk (6) with `last_active_child_id` set |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Command, agent, and asset conformance audit against current skill reality specification.

**Scope Boundary**: This phase owns the program's terminal validation gate PLUS the three cross-cutting systemic-S2 build-artifact findings that research.md §6 routes here rather than to 002-005 (`deep/assets/compiled/**`, `system-skill-advisor/mcp_server/scripts/skill-graph.json`, and 12 hub `graph-metadata.json` files are generated artifacts, not source `command.md` / doctor YAML / agent / README files). No source `command.md`, doctor route YAML, agent frontmatter, or README is touched here — those fixes belong to phases 002-005; a validation-gate failure caused by upstream drift routes back to the owning phase, it is not patched inline. Findings owned directly by this phase:
- **XS-01** (P0, OPERATOR-GATED) — regenerate `skill-graph.json` (purge 9 ghost nodes + 2 family mismatches) and run `skill_graph_scan` to purge the SQLite `cli-codex-retired` zombie. This mutates persistent advisor routing state and MUST NOT run without explicit operator go-ahead.
- **CMD-05** (P1) — recompile the 3 deep compiled contracts via `compile-command-contracts.cjs` (picking up phase 002's CMD-06 source fixes to the presentation `.txt` executor selectors) and reconcile the `deep/ai-council` manifest/on-disk sha256 divergence.
- **XS-03** (P2) — backfill `derived.generated_at` across the 12 hub `graph-metadata.json` files that `skill-graph-freshness.cjs` reports as null.

**Dependencies**:
- Phases 002-remediation-slash-commands, 003-remediation-doctor, 004-remediation-agents, and 005-readme-alignment must be complete and individually validated before the validation-gate portion of this phase begins. The CMD-05/XS-03 build-artifact regen is independent of 002-005's own completion state (CMD-05 only needs 002's CMD-06 fix landed first) but is sequenced before the final gate run so the gate reflects the true end state.
- `validate.sh --strict` (recursive), `route-validate.sh`, `parent-skill-check.cjs`, `compile-command-contracts.cjs`, and `skill-graph-freshness.cjs` must be runnable in the current environment.
- The skill-advisor re-baseline path is exercised whenever 002-005 OR this phase's own XS-01/XS-03 work changed advisor-facing metadata (command `trigger_phrases`, agent frontmatter, doctor route `trigger_phrases`, or the skill graph itself).

**Deliverables**:
- CMD-05: 3 recompiled deep contracts with sha256-verified `sourceDigests` + a reconciled `deep/ai-council` manifest row.
- XS-03: 12 hub `graph-metadata.json` files with a non-null `derived.generated_at`.
- XS-01: either operator-approved execution evidence (regenerated `skill-graph.json` + purged SQLite zombie) or an explicit, dated deferral recorded in this phase's continuity/handoff.
- Recursive strict-validation evidence for the 132 parent (Errors:0 across parent + all 6 children).
- Doctor `route-validate` exit-0 evidence plus a clean re-run of each read-only `/doctor` target.
- An advisor re-baseline result (no regression, or a documented intended delta) when advisor-facing metadata changed.
- `parent-skill-check.cjs` STRICT-0 evidence for any touched parent hub (at minimum `sk-doc`, which owns `create-agent`; add `system-skill-advisor` if XS-01 executes).
- Refreshed program metadata (`description.json` + `graph-metadata.json` for children then parent) with the parent `derived.last_active_child_id` rolled forward and a memory-save of the program.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 002-005 remediate the command, doctor, agent, and README surfaces one at a time, but nothing yet proves the program landed cleanly as an integrated whole. Three findings also fall outside any single surface phase because they are generated-artifact drift, not source drift: the 3 compiled deep contracts are stale against their own `sourceDigests` and the `deep/ai-council` contract's on-disk sha256 no longer matches its own manifest row (CMD-05); the compiled skill-graph carries 9 ghost nodes, 2 family mismatches, and a SQLite zombie that corrupt persistent advisor-routing state (XS-01, confirmed live via `skill-graph-freshness.cjs` on 2026-07-10/11: `GHOST` 9 ids, `FAMILY MISMATCH` 2, `ZOMBIE` 1, `NULL derived.generated_at` 12 hubs); and 12 hub `graph-metadata.json` files carry a null `derived.generated_at` (XS-03). Without a terminal gate the 132 parent can also be left with docs claiming conflicting completion states, the read-only `/doctor` targets may not have been re-run against the corrected surface, and any advisor-facing metadata change (command `trigger_phrases`, agent frontmatter, doctor route `trigger_phrases`, or the skill graph itself) could silently regress skill routing.

### Purpose
Regenerate the 3 build-artifact findings this phase owns (CMD-05, XS-03, and — pending explicit operator approval — XS-01), then prove the whole conformance-audit program is green with cited evidence: recursive strict validation, doctor route-validation, an advisor re-baseline, and a reconciled parent rollup — and close the parent out honestly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **CMD-05**: Recompile the 3 deep contracts (`deep_research.contract.md`, `deep_review.contract.md`, `deep_ai-council.contract.md`) via `compile-command-contracts.cjs --write`, sequenced after phase 002 lands the CMD-06 presentation-`.txt` executor-selector fixes so the recompile picks up corrected source. Investigate and reconcile the `deep/ai-council` row in `manifest.jsonl` whose `compiledContractSha256` diverges from the on-disk file's own sha256.
- **XS-03**: Backfill `derived.generated_at` on the 12 hub `graph-metadata.json` files `skill-graph-freshness.cjs` reports as null (`cli-external`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `sk-git`, `sk-prompt`, `system-code-graph`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit`).
- **XS-01 (OPERATOR-GATED)**: Regenerate `skill-graph.json` via `skill_graph_compiler.py` to purge 9 ghost nodes + 2 family mismatches, and run the trusted-caller `skill_graph_scan` to purge the SQLite `cli-codex-retired` zombie — ONLY with explicit operator approval; otherwise document the deferral.
- Run `validate.sh --strict` on the 132 parent (auto-recurses all 6 children) and confirm Errors:0.
- Run `.opencode/commands/doctor/scripts/route-validate.sh` to exit 0 and re-run each read-only `/doctor` target to confirm it runs clean.
- Re-baseline the skill advisor via `skill_advisor_regression.py` and confirm no routing regression whenever advisor-facing metadata changed in 002-005 or in this phase's own XS-01/XS-03 work (or document an intended delta).
- Run `parent-skill-check.cjs` STRICT on any parent hub touched by the program (at minimum `sk-doc`; add `system-skill-advisor` if XS-01 executes) and confirm 0 warnings.
- Refresh this program's `description.json` + `graph-metadata.json` (children then parent) and roll the parent `graph-metadata.derived.last_active_child_id` forward.
- Memory-save the program via `generate-context.js`.
- Reconcile completion metadata across this phase's spec/plan/tasks/impl-summary so no doc claims a conflicting state.

### Out of Scope
- Any source remediation of commands, doctor routes, agents, or READMEs — that work is owned by phases 002-005; a failed gate here routes the fix back to the owning phase, it is not fixed inline.
- Rewriting skill behavior (SKILL.md logic) — the program aligns the surface, not the skills' internal logic.
- Wiring a CI/pre-commit hook keyed on `sourceDigests` for the compiled contracts, or a comparable hook for the skill-graph compiler — research.md recommends this but it is new tooling authorship, deferred to a future packet, not part of this closeout gate.
- Creating this phase's own `implementation-summary.md` — it is authored only when the phase actually completes, per the completion-verification rule.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/commands/deep/assets/compiled/deep_research.contract.md | Modify (generated) | CMD-05: regenerated via `compile-command-contracts.cjs --command deep/research --write` |
| .opencode/commands/deep/assets/compiled/deep_review.contract.md | Modify (generated) | CMD-05: regenerated via `compile-command-contracts.cjs --command deep/review --write` |
| .opencode/commands/deep/assets/compiled/deep_ai-council.contract.md:368 | Modify (generated) | CMD-05: regenerated via `compile-command-contracts.cjs --command deep/ai-council --write`; on-disk sha256 previously diverged from its own manifest row |
| .opencode/commands/deep/assets/compiled/manifest.jsonl | Modify | CMD-05: reconcile the `deep/ai-council` row's `compiledContractSha256` against the regenerated file (appended by `render-command-contract.cjs`, not the compiler — investigate why the prior row diverged) |
| .opencode/skills/cli-external/graph-metadata.json | Modify (generated) | XS-03: backfill `derived.generated_at` (currently absent/null) |
| .opencode/skills/mcp-code-mode/graph-metadata.json | Modify (generated) | XS-03: backfill `derived.generated_at` |
| .opencode/skills/mcp-tooling/graph-metadata.json | Modify (generated) | XS-03: backfill `derived.generated_at` |
| .opencode/skills/sk-code/graph-metadata.json | Modify (generated) | XS-03: backfill `derived.generated_at` |
| .opencode/skills/sk-design/graph-metadata.json | Modify (generated) | XS-03: backfill `derived.generated_at` |
| .opencode/skills/sk-doc/graph-metadata.json | Modify (generated) | XS-03: backfill `derived.generated_at` |
| .opencode/skills/sk-git/graph-metadata.json | Modify (generated) | XS-03: backfill `derived.generated_at` |
| .opencode/skills/sk-prompt/graph-metadata.json | Modify (generated) | XS-03: backfill `derived.generated_at` |
| .opencode/skills/system-code-graph/graph-metadata.json | Modify (generated) | XS-03: backfill `derived.generated_at` |
| .opencode/skills/system-deep-loop/graph-metadata.json | Modify (generated) | XS-03: backfill `derived.generated_at` |
| .opencode/skills/system-skill-advisor/graph-metadata.json | Modify (generated) | XS-03: backfill `derived.generated_at` |
| .opencode/skills/system-spec-kit/graph-metadata.json | Modify (generated) | XS-03: backfill `derived.generated_at` |
| .opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json | Modify (generated, OPERATOR-GATED) | XS-01: purge 9 ghost nodes (`cli-claude-code`, `cli-opencode`, `deep-loop-runtime`, `deep-loop-workflows`, `mcp-chrome-devtools`, `mcp-click-up`, `mcp-figma`, `mcp-open-design`, `sk-prompt-models`) + 2 family mismatches (`sk-design`, `sk-prompt`) via `skill_graph_compiler.py` |
| .opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite | Modify (generated, OPERATOR-GATED) | XS-01: `skill_graph_scan` (trusted caller) purges the `cli-codex-retired` zombie row |
| .opencode/specs/skilled-agent-orchestration/132-command-agent-conformance-audit/description.json | Modify | Parent program description regenerated via generate-description.js |
| .opencode/specs/skilled-agent-orchestration/132-command-agent-conformance-audit/graph-metadata.json | Modify | Parent rollup: children_ids == 6, derived.last_active_child_id rolled forward |
| .opencode/specs/skilled-agent-orchestration/132-command-agent-conformance-audit/006-validation-closeout/plan.md | Modify | Fill the validation-closeout plan from this spec |
| .opencode/specs/skilled-agent-orchestration/132-command-agent-conformance-audit/006-validation-closeout/tasks.md | Modify | Fill the validation-closeout task list |
| .opencode/specs/skilled-agent-orchestration/132-command-agent-conformance-audit/006-validation-closeout/implementation-summary.md | Create | Authored only on actual completion, with cited gate evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | **XS-01** (OPERATOR-GATED) skill-graph regenerated, or explicitly deferred | Pending operator approval: `plan.md`/handoff documents the gate and no write occurs. Upon approval: `node .opencode/commands/doctor/scripts/skill-graph-freshness.cjs` reports `GHOST (in compiled json, not on disk): none`, `FAMILY MISMATCH compiled vs disk: none`, and `ZOMBIE (in SQLite, not on disk): none` |
| REQ-002 | Recursive strict validation of the 132 parent passes | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <132-parent> --strict` exits 0 with Errors:0 across the parent and all 6 children |
| REQ-003 | Doctor route-validation and read-only targets run clean | `.opencode/commands/doctor/scripts/route-validate.sh` exits 0; each read-only `/doctor` target is re-run against the corrected surface and completes without error |
| REQ-004 | Parent rollup is reconciled | `graph-metadata.json` `children_ids` count equals on-disk children (6) and `derived.last_active_child_id` is set; no packet doc claims a conflicting completion state |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | **CMD-05** deep contracts recompiled and manifest reconciled | `node .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/research\|deep/review\|deep/ai-council --write` re-run for all 3; recomputed sha256 of each contract's declared source paths matches its own `sourceDigests` header; `deep_ai-council.contract.md`'s on-disk sha256 matches the latest `manifest.jsonl` row for `deep/ai-council` |
| REQ-006 | Advisor re-baseline shows no routing regression | If any advisor-facing metadata changed in 002-005 or in this phase's own XS-01/XS-03 work, re-run `skill_advisor_regression.py` against the fixture dataset; routing is unchanged, or an intended delta is documented with rationale |
| REQ-007 | Touched parent hubs pass parent-skill-check STRICT | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs <hub>` reports STRICT 0 warnings for every parent hub the program touched (at minimum `sk-doc`; add `system-skill-advisor` if REQ-001 executes) |
| REQ-008 | Program metadata refreshed and memory-saved | `description.json` + `graph-metadata.json` regenerated for children then parent; program memory-saved via `generate-context.js` with a POST-SAVE review that is PASSED or remediated |

### P2 - Recommended (complete OR explicitly deferred)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | **XS-03** 12 hub timestamps backfilled | `node .opencode/commands/doctor/scripts/skill-graph-freshness.cjs`'s `NULL derived.generated_at` line reports `none` (currently absent — not literally `null` — on the 12 listed hubs; a passing string-datetime value must be present under each file's `derived.generated_at` key) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: CMD-05 closed — all 3 deep contracts recompiled with sha256-matching `sourceDigests`, and the `deep/ai-council` manifest row reconciled against the on-disk file.
- **SC-002**: XS-03 closed — `skill-graph-freshness.cjs`'s `NULL derived.generated_at` line reports `none` across the 12 hubs.
- **SC-003**: XS-01 resolved one of two honest ways — either operator-approved and executed (`GHOST`, `FAMILY MISMATCH`, and `ZOMBIE` lines all report `none`) or explicitly deferred with a dated rationale in the handoff; no silent skip.
- **SC-004**: All validation-gate checks green with cited evidence — recursive `validate.sh --strict` Errors:0, `route-validate.sh` exit 0, read-only `/doctor` targets clean, and `parent-skill-check.cjs` STRICT 0 on touched hubs.
- **SC-005**: Advisor re-baseline confirms zero routing regression, or the single intended delta is named with its rationale.
- **SC-006**: Parent rollup reconciled — `children_ids` == 6, `derived.last_active_child_id` set, program metadata refreshed and memory-saved, no conflicting completion claims across spec/plan/tasks/impl-summary.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | XS-01 mutates persistent advisor routing state (SQLite + compiled skill-graph.json) | An unapproved regen could shift live skill routing without operator sign-off | Hard-gate: never execute `skill_graph_compiler.py` regen or `skill_graph_scan` without explicit operator go-ahead; default posture is document-and-wait |
| Risk | XS-03 backfill has no wired production CLI | `syncDerivedMetadata` (`lib/derived/sync.ts`) currently has only test callers; a thin driver may need to be authored at implementation time | Implementer invokes `syncDerivedMetadata` per hub directly or authors a minimal driver script; verify via `skill-graph-freshness.cjs`, not by assuming a tool exists |
| Dependency | Phases 002-005 must be complete and individually validated before the terminal gate | This phase cannot honestly gate the program until upstream remediation has landed | Confirm each upstream phase's `implementation-summary.md` exists and its strict validate is clean before starting the gate portion |
| Dependency | CMD-05 recompile must run after phase 002's CMD-06 source fix | Recompiling before CMD-06 lands re-bakes the duplicate-executor-enum defect into the contracts | Sequence CMD-05 recompile strictly after phase 002's presentation-`.txt` fix is confirmed on disk |
| Dependency | Metadata-index DB / daemon during generate-context.js save | A busy or broken indexer can race the save or fail indexing | Save via `generate-context.js`; if the daemon is contended, defer indexing to a quiet `memory_index_scan` rather than forcing a write |
| Risk | A gate fails (validate error, route-validate non-zero, advisor regression) | Program cannot be closed; temptation to patch inline violates the validation-only scope | Route the fix back to the owning remediation phase (002-005); re-run the full gate after, never claim done on a partial pass |
| Risk | Advisor re-baseline shifts routing on unchanged intent | Silent mis-routing after the program ships | Compare against the pre-program baseline; treat any unexplained delta as a regression until proven intended and documented |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does any of phases 002-005 actually change advisor-facing metadata (command `trigger_phrases`, agent frontmatter, doctor route `trigger_phrases`)? If none do, REQ-006's re-baseline is a no-op to be recorded as "not required," not skipped silently. (This phase's own XS-01, if approved, DOES change advisor-facing metadata — the skill graph itself.)
- Which parent hubs, if any, does the program touch beyond `sk-doc` (create-agent) — so `parent-skill-check.cjs` (REQ-007) runs on exactly the affected hubs rather than all of them?
- Does the operator approve XS-01's skill-graph regen for this closeout pass, or should it be explicitly deferred to a follow-up packet? REQ-001 cannot be marked complete either way without this answer being recorded.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
