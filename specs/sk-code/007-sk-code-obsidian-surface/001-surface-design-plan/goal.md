---
title: "Goal: sk-code-obsidian Surface Design Plan"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/001-surface-design-plan"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "None; every criterion is met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-03-child-goal-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: sk-code-obsidian Surface Design Plan

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce `mode-design-plan.md`, a cite-backed design that fixes the exact `mode-registry.json` entry, the `hub-router.json` wiring, the `OBSIDIAN` detection branch with its symlink guard, the reference map, the smart-routing block, the workflow-doctrine symlinks and the file-by-file build handoff for `sk-code-obsidian`, before any skill file is authored.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase authors no file under `sk-code-obsidian/` and writes nothing outside `001-surface-design-plan/`. |
| D2 | `mode-registry.json`, `hub-router.json` and `stack-detection.md` are not edited here. Phase `003-hub-wiring` applies the design. |
| D3 | Every count comes from `002-repo-convention-audit/audit.json`. The plugin is not re-measured. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `wc -l mode-design-plan.md` reports between 200 and 320 lines
- [x] `mode-design-plan.md` §2 states that `sk-code-obsidian` carries no `graph-metadata.json` and no `description.json`, and names the `NESTED_IDENTITY` violation code
- [x] §3 gives the full `modes[]` entry with `packetKind: "surface"`, `backendKind: "evidence-base"` and a read-only `toolSurface`, and its five proposed aliases are lowercase and overlap none of the live modes' aliases
- [x] §4 names the `routerSignals` entry, the `code-obsidian-aliases` and `code-obsidian-runtime` vocabulary classes and the `routerPolicy.tieBreak` append position
- [x] §5 states the `OPENCODE > OBSIDIAN > PI_REMOTE > WEBFLOW > UNKNOWN` precedence, specifies a resolved-realpath gate for OPENCODE detection and adds a test row where a plugin-repo working directory resolves OBSIDIAN despite the `.opencode` symlink
- [x] §9 lists every path a build phase touches with its owning phase and its gate
- [x] This folder's `spec.md`, `plan.md` and `tasks.md` contain no `REQUIREMENT_PLACEHOLDER` or bare `**Given**` scaffold text
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Design drafted and re-checked against the live hub files | Done (2026-08-28) | `tasks.md` T010 to T016 and T021 |
| Line count, alias disjointness, guard rows, handoff table | Done | `tasks.md` T020, CHK-021, CHK-022, CHK-FIX-001 |
| Phase status | Complete | `spec.md` metadata and `implementation-summary.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Live alias count | `spec.md` REQ-003 counts 33 aliases across five modes; CHK-021 (verified 2026-08-29) counts 34. The criterion states disjointness without a count |
| Reconstructed summary | `implementation-summary.md` was rebuilt from `tasks.md`; its results are quoted, not re-run |
<!-- /ANCHOR:log -->
