---
title: "Tasks: DESIGN router intent lane in all 3 CLI dictionaries"
description: "Phased task list to add an additive DESIGN intent lane (INTENT_SIGNALS-only) to the three cli-* provider dictionaries, reconcile its keywords with the hub-router vocabulary, and verify zero regression on the existing routes, the concurrent GLM WIP, and the sk-design hubRoute scorer."
trigger_phrases:
  - "design router intent lane tasks"
  - "DESIGN lane cli tasks"
  - "cross-cli design routing tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/004-design-router-intent-lane"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark T001-T013 and completion criteria complete with evidence"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r4-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: DESIGN router intent lane in all 3 CLI dictionaries

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

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Resolve the resource-map precondition and capture the baseline before authoring.

- [x] T001 Confirm no skill-local design `.md` is resolvable inside any cli-* skill root, so a `RESOURCE_MAP` target is not viable; resolve the lane to INTENT_SIGNALS-only (`cli-codex/`, `cli-claude-code/`, `cli-opencode/`) [10m] — confirmed; INTENT_SIGNALS-only resolution recorded in spec RISKS + plan §6
- [x] T002 Capture the verbatim baseline of the existing intents + `RESOURCE_MAP` entries per dictionary (`cli-codex/SKILL.md`, `cli-claude-code/SKILL.md`, `cli-opencode/SKILL.md`) [10m] — captured; existing routes unchanged post-edit
- [x] T003 Capture the current hubRoute scorer result (13 pass / 5 known-gap / 0 regression) (sk-design `hubRoute` scorer) [10m] — baseline 13 / 5 / 0 captured

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Compose the reconciled keyword set, then add the `DESIGN` key (INTENT_SIGNALS-only) to the three dictionaries (clean files first, the GLM-dirty file last).

### Reconcile vocabulary
- [x] T004 Compose the coarse `DESIGN` keyword set, each entry traceable to a hub-router vocabulary alias or hub-identity token [15m] — keywords (sk-design, interface/frontend/visual design, foundations, tokens, motion, micro-interactions, audit, ui critique, extract design system, generate design.md) trace to hub vocabulary
- [x] T005 Confirm the lane composes with the always-fires D5-R1 Design Standards Loading rule (no `RESOURCE_MAP` target, no contradictory load instruction) (`cli-codex/SKILL.md`) [10m] — WHY comment states the lane is an intent signal only; durable contract is D5-R1 + the D5-R3 manifest

### Add the lane (parallel keyword sets, INTENT_SIGNALS-only)
- [x] T006 Add `DESIGN` to `INTENT_SIGNALS` (weight 4) + a WHY comment in cli-codex; `RESOURCE_MAP` unchanged (`cli-codex/SKILL.md`) [10m] — key at line 112, WHY lines 109-111; no `RESOURCE_MAP["DESIGN"]`
- [x] T007 [P] Mirror the identical `DESIGN` lane into cli-claude-code (`cli-claude-code/SKILL.md`) [10m] — key at line 113, WHY lines 110-112; `RESOURCE_MAP` unchanged
- [x] T008 [P] Mirror the identical `DESIGN` lane into cli-opencode (stacked on GLM WIP) (`cli-opencode/SKILL.md`) [10m] — key at line 127, WHY lines 124-126; GLM WIP byte-identical

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Signal presence
- [x] T009 Static read: `DESIGN` is a weighted `INTENT_SIGNALS` key in all three cli-*; confirm no `DESIGN` key in any `RESOURCE_MAP` (`cli-*/SKILL.md`) [10m] — grep: 1 INTENT_SIGNALS `DESIGN` key each; 0 RESOURCE_MAP `DESIGN` keys (the apparent hit was a grep false-match on the WHY comment)

### Parity & no-regression
- [x] T010 Parity check: all three siblings define the lane with an identical keyword set (`cli-*/SKILL.md`) [10m] — keyword sets byte-identical across siblings
- [x] T011 No-regression on existing routes: the existing intents/resources are byte-identical to baseline (`cli-*/SKILL.md`) [10m] — existing routes unchanged; only the `DESIGN` key added
- [x] T012 No-regression on GLM WIP + hub: the cli-opencode GLM WIP is byte-identical, and the hubRoute scorer stays 13 pass / 5 known-gap / 0 regression (`cli-opencode/SKILL.md`, sk-design `hubRoute` scorer) [10m] — GLM WIP byte-identical; scorer 13 / 5 / 0 (a cli-* INTENT_SIGNALS change does not touch the hub corpus)

### Hygiene & docs
- [x] T013 Evergreen scan over the diff: no spec/packet/phase/finding IDs, no `specs/` paths in the lane; complete implementation-summary.md and mark all checklist items with evidence (`cli-*/SKILL.md`) [10m] — evergreen clean; implementation-summary.md authored; checklist verified

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `DESIGN` lane defined + parallel across all three cli-* (INTENT_SIGNALS-only)
- [x] No `RESOURCE_MAP["DESIGN"]` entry — guard-safe; design resource reached via D5-R1 + D5-R3
- [x] No-regression confirmed: existing routes unchanged, GLM WIP unchanged, hubRoute 13 / 5 / 0
- [x] Lane is evergreen (no IDs/paths)
- [x] Checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (D5-R4)
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research**: `research.md` §8 (D5 — Cross-CLI Survival, D5-R4 row)

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Setup (precondition + baseline) -> implementation (define lane x3, INTENT_SIGNALS-only) -> verification (static read + parity + no-regression)
- Effort estimates + explicit verification tasks per CLAUDE.md baseline-before-no-regressions
-->
</content>
