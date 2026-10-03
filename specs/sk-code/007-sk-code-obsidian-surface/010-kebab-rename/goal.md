---
title: "Goal: Kebab-Case Source Rename"
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
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/010-kebab-rename"
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
# Goal: Kebab-Case Source Rename

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Rename every non-conforming file under `src/` and `tools/` to lowercase-kebab by manifest, rewrite every import specifier and path reference the rename touches, and prove the tree still builds, type-checks, tests and renders identically so `scan-naming.mjs` exits 0.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One rename manifest drives every pass: the rename, the import rewrite and the path rewrite. No pass derives a name on its own. |
| D2 | Every rename runs through `git mv`, never delete-and-create. |
| D3 | No source logic, behavior or exported surface changes. Every touched line is a filename, an import path or a `resolve()` argument. |
| D4 | The screenshot-harness date nondeterminism is recorded for the harness owner and not fixed here. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node tools/naming/scan-naming.mjs` reports 253 files scanned and exits 0
- [x] All 235 renames ran through `git mv` with 0 failures and 0 basename collisions
- [x] `npx tsc --noEmit` and `npm run build` both exit 0 from the renamed tree
- [x] `npx vitest run` passes 386 tests across 49 files after the 10 bare-filename `resolve(__dirname, "...")` references are rewritten
- [x] `npm run screenshots:verify` reports 180 entries current after recapture
- [x] `npm run lint` reports 115 problems (100 errors, 15 warnings), unchanged from the pre-rename baseline
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
| Manifest, 235 renames, import and path rewrites, bare-filename fix, recapture | Done (2026-08-28) | `tasks.md` T010 to T015 |
| Scanner and gate suite | Done | `tasks.md` T020 to T025; `implementation-summary.md` Verification |
| Phase status | Complete | `spec.md` metadata |

### Deviations and findings

| Item | Note |
|------|------|
| Screenshot harness nondeterminism | Two clean captures differed in 6 of 180 images (calendar, timeline and list views that render `today`); freezing a clock is recommended future work |
| Bare-filename reference class | Found by vitest, not by static analysis; no detector was built for it |
<!-- /ANCHOR:log -->
