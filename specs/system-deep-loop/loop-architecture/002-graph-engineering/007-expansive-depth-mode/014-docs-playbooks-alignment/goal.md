---
title: "Goal: Playbook coverage, feature catalogs and alignment for the expansive-depth program"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "docs playbooks alignment goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment"
    last_updated_at: "2026-11-17T17:15:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-17-expansive-depth-goals"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Playbook coverage, feature catalogs and alignment for the expansive-depth program

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Confirm that every user-visible feature and fix of phases 001-013 has the manual testing playbook scenario its phase wrote, give each a feature catalog entry, and close the program with both alignment checks reporting no open finding.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each implementation phase writes its own playbook scenarios through `/create:manual-testing-playbook` (operator decision 2026-11-17); this phase only verifies coverage and routes a gap to its owning phase. |
| D2 | Catalog entries are written only through `/create:feature-catalog`; other doc findings are fixed here by direct edit, and a compiled contract they make stale is regenerated, never hand-edited. |
| D3 | This phase changes docs only; a code finding goes back to its owning phase and blocks closure until fixed or waived by the operator. |
| D4 | This phase starts only after phases 001-013 are complete. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `rg -l -- "--extend=" .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook` prints at least one file in each directory.
- [ ] `rg -l -- "--depth-mode=expansive" .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook` prints at least one file in each directory.
- [ ] `rg -il "custom review dimension" .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook .skilled/skills/system-deep-loop/deep-review/feature-catalog` prints at least one file in each directory.
- [ ] `rg -l -- "--depth-mode" .skilled/skills/system-deep-loop/deep-research/feature-catalog .skilled/skills/system-deep-loop/deep-review/feature-catalog` prints at least one file in each directory.
- [ ] The last `/local-doc-alignment` run and the last `/local-skilled-alignment` run under this phase's `scratch/` each have a `report.md` that shows zero open findings.
- [ ] `git diff --name-only` for this phase's commits lists no file outside `specs/` ending in `.cjs`, `.ts`, `.js`, `.yaml`, `.json`, `.toml` or `.txt`, and `npm test -- tests/unit/check-contract-drift.vitest.ts` run from `.skilled/skills/system-deep-loop/runtime` exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase spec authored | Done | `spec.md`, `plan.md`, `tasks.md` written 2026-11-17 |
| Implementation | Pending | Waits on phases 001-013 |
| Playbook coverage table | Pending | One scenario file per Feature to Playbook Map row, filled by T003 |

### Deviations and findings

| Item | Note |
|------|------|
| Baseline | On 2026-11-17 no playbook or catalog under `.skilled/skills/system-deep-loop/` names `--extend=`, `--depth-mode` or custom review dimensions (`rg` exit 1). |
| Rescope 2026-11-17 | Operator decision: each phase writes its own playbook scenarios, so this phase verifies coverage instead of writing scenarios. The plan review's F014-1 (REQ-005 against REQ-007) is resolved by letting this phase fix any live doc and regenerate contracts, while code findings return to their phase. F014-2 changelog ownership moved to the phases (`../scratch/cross-phase-handoff.md`). |
<!-- /ANCHOR:log -->
