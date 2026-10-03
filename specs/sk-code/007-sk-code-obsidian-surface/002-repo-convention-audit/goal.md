---
title: "Goal: Repo convention audit"
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
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/002-repo-convention-audit"
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
# Goal: Repo convention audit

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Measure the plugin's real naming, comment, folder-doc and stylesheet conventions, its rename blast radius and its gate baselines into a machine-readable `audit.json`, so every later phase cites a measured number and the phase 008 scanners can be shown to fail before they pass.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Read-only: this phase changes no source file and adds only `audit.json` beside its spec documents. |
| D2 | The audit records conventions and does not judge them. Design decisions belong to `001-surface-design-plan`. |
| D3 | Known open debt from earlier packets is recorded as evidence, not repaired. |
| D4 | Every gate exit status is read directly, never through a pipe. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `audit.json` parses as JSON: `json.load` returns without error
- [x] `git status --porcelain` shows no source file changed by this phase, only the packet
- [x] The recorded baselines read `npx vitest run` at 386 passing across 49 files and `npm run screenshots:verify` at 180 current entries
- [x] The lint baseline is recorded as failing at 115 problems (100 errors, 15 warnings)
- [x] The rename blast radius counts consumers outside `src/`, including 41 paths in the screenshot scenarios and the capture-manifest coupling
- [x] An independently written scanner reproduces the audit's counts: naming 235, comments 249, folder docs 19
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
| Measurements and `audit.json` | Done (2026-08-28) | `tasks.md` T-010 to T-017, CHK-012 |
| Scanner corroboration | Done | `tasks.md` CHK-023 |
| Phase status | Complete | `spec.md` metadata and `implementation-summary.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Reconstructed summary | `implementation-summary.md` was rebuilt from `tasks.md`; its results are quoted, not re-run |
<!-- /ANCHOR:log -->
