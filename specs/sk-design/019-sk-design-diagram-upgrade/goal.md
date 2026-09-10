---
title: "Goal: bring sk-design-diagram to the chart standard"
description: "The binding goal for the whole packet. Every child goal.md inherits these rules; where a child disagrees with this file, this file wins."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "diagram upgrade goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade"
    last_updated_at: "2026-09-10T20:00:00Z"
    last_updated_by: "claude-conductor"
    recent_action: "All six child phases authored and gated; packet ready for phase 002 execution"
    next_safe_action: "Execute 002-skin-contract: reconcile the ledger, then sign the seven decisions"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/001-upgrade-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-019-sk-design-diagram-upgrade"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Goal: bring sk-design-diagram to the chart standard

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: the runtime goal surfaces cap what they hold.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every rule the diagram skill states is held by a check, its files are generated from one palette source, and what no check can see is read by an eye on a schedule — the standard the chart skill reached, adapted to a skin chosen per deliverable.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One skin per file; all skins in one palette source. No `prefers-color-scheme` blocks |
| D2 | The Google Fonts link stays, on a one-entry allowlist; fallback chains are documented, not added |
| D3 | Onboarding stays; an applicator is added; no second carried Style Reference |
| D4 | Order is forced: decisions → applicator → repaint → checker → eye. No checker before the corpus passes it |
| D5 | The 4px rule exempts font sizes and derived label offsets; `SKILL.md:403` yields to `:337` |
| D6 | Markers: define only what you draw, per file. Ids are unique per file |
| D7 | Nodes carry `data-diagram-node`; budgets count tagged nodes, not rects |
| D8 | The accent stays `#eb6c36`; its 2.86:1 is a recorded departure, not re-derived |
| D9 | `#3d4460` becomes a type-scoped role; sketchy is descoped with a stated reason |
| D10 | Both lineages' findings are reconciled into one fact base before any decision is signed |
| D11 | Implementation runs on GLM-5.3-Flash at max through cli-pi and DevPass, and on DeepSeek V4.1 Flash at max by the same route once its support lands; phase docs are authored by Sonnet 5 at xhigh under an Opus xhigh orchestrator; every deep-loop lineage runs in a worktree |
| D12 | Nothing changes in the chart skill. Comment hygiene is a hard block |

### Operator copy

The operator holds this directive as the session objective. Whenever anything above the log changes, resend this file in chat.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-upgrade-research | `001-upgrade-research/goal.md` |
| 002-skin-contract | `002-skin-contract/goal.md` |
| 003-applicator-and-sentinels | `003-applicator-and-sentinels/goal.md` |
| 004-corpus-and-catalog | `004-corpus-and-catalog/goal.md` |
| 005-checker-mutations-and-ci | `005-checker-mutations-and-ci/goal.md` |
| 006-capture-and-judgment | `006-capture-and-judgment/goal.md` |

**Precedence.** Decisions outrank child detail; child detail outranks any summary. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` prints `RESULT: PASSED`
- [ ] `node --test .opencode/skills/sk-design/sk-design-diagram/scripts/tests/` passes, and its completeness guard reports no family without a case
- [ ] `apply-diagram-tokens.cjs --default` over the four templates produces a byte-identical copy of each
- [ ] `grep -rhoE "#[0-9a-fA-F]{6}" assets/examples assets/templates` outside sentinel blocks returns nothing
- [ ] One version field across the skill; `.github/workflows/diagram-corpus.yml` green on a push
- [ ] A dated capture-review report exists under `benchmark/reports/` with no hand-authored markdown
- [ ] `validate.sh specs/sk-design/019-sk-design-diagram-upgrade --strict --recursive` reports `RESULT: PASSED` for all seven folders
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| 001 research, two lineages | Done | 29 findings; 15 confirmed, 15 corrected, 1 fabrication caught |
| 002–006 authored | Done | five child goals, each refining parent decisions by id; 29 of 29 findings placed; parent validates recursively |
| 002 skin-contract | Authored | validate PASSED (0 errors, 0 warnings), 13 tasks, 16 findings |
| 003 applicator-and-sentinels | Authored | validate PASSED (0 errors, 0 warnings), 10 tasks, 3 findings |
| 004 corpus-and-catalog | Authored | validate PASSED (0 errors, 0 warnings), 19 tasks, 6 findings |
| 005 checker-mutations-and-ci | Authored | validate PASSED (0 errors, 0 warnings), 24 tasks, 13 findings |
| 006 capture-and-judgment | Authored | validate PASSED, 17 tasks, 3 findings; two agents wrote it concurrently and reconciled |

### Deviations and findings

| Item | Note |
|------|------|
| The reconciliation pass is not a phase | Folded into 002's first tasks rather than renumbering five children |
| The orchestrator's final report never printed | Its stdout came back empty after node 005; node 006 was authored by its last agent and a conductor-dispatched one concurrently, reconciled, and gated by the conductor |
<!-- /ANCHOR:log -->
