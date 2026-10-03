---
title: "Goal: Scanners and Gates"
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
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/008-scanners-and-gates"
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
# Goal: Scanners and Gates

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give each of the plugin's three target conventions an executable Node ESM scanner under `tools/naming/`, for filename grammar, comment banners and folder docs, and prove each one fails against the unconverted tree in this same phase.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase builds the gates and does not convert the tree. Phases 009 and 010 make the scanners pass. |
| D2 | The scanners import only Node built-ins and `package.json` stays untouched. |
| D3 | Nothing already in the tree is grandfathered by an exception in any scanner. |
| D4 | The `src/data/__tests__` disagreement with `audit.json` is recorded as evidence; `audit.json` is not edited. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `tools/naming/scan-naming.mjs`, `scan-comments.mjs` and `scan-folder-docs.mjs` exist, each accepts `--json` and exits `0` when clean and `1` on violations
- [x] `node tools/naming/scan-naming.mjs --json` reports 252 files scanned and 235 violations, exit 1
- [x] `node tools/naming/scan-comments.mjs --json` reports 252 files scanned, 249 missing a banner, 249 missing paired sections and 0 commented-out-code lines, exit 1
- [x] `node tools/naming/scan-folder-docs.mjs --json` reports 10 folders scanned and 19 violations, exit 1
- [x] None of the three scanner files appears among its own violations
- [x] The commented-out-code heuristic classifies all 8 labeled cases correctly, 4 real code and 4 prose
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
| Three scanners written; one false positive fixed | Done (2026-08-28) | `tasks.md` T010 to T013 |
| Six scanner runs, heuristic check, audit cross-check | Done | `tasks.md` T020 to T024 |
| Phase status | Complete | `spec.md` metadata and `implementation-summary.md` |

### Deviations and findings

| Item | Note |
|------|------|
| `src/data/__tests__` classification | `audit.json` lists it as README-only; the live scan finds 5 source files and places it in owe-both |
| Source-gates runner | A `run-source-gates.sh` equivalent was left out of this phase as future scope |
| Reconstructed summary | `implementation-summary.md` was rebuilt from `tasks.md`; its results are quoted, not re-run |
<!-- /ANCHOR:log -->
