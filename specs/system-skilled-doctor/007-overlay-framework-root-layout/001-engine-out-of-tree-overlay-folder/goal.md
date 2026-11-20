---
title: "Goal: Phase 1: engine-out-of-tree-overlay-folder"
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
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder"
    last_updated_at: "2026-11-20T10:35:16Z"
    last_updated_by: "orchestrator"
    recent_action: "Met every completion criterion"
    next_safe_action: "Start phase 002"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-001-engine-out-of-tree-overlay-folder"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: engine-out-of-tree-overlay-folder

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** The doctor overlay engine runs status, apply, `--guard`, pre-commit, `--adopt`, `--capture`, `--relayout`, re-pin, `repin --stage` and `repin --rollback` against an overlay folder that `.skilled-overlays.json` places beside the tree as `../<name>`, while an in-tree folder behaves as it does today.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase changes only `overlay-engine.cjs`, its tests under `.skilled/commands/doctor/scripts/tests/` and one new case in `overlay-guard.test.cjs`. No doc, workflow yaml, `overlay-guard.cjs` or Barter file changes. |
| D2 | A re-pin backup records overlay-folder files as `"area": "overlay"` entries with overlay-relative paths in their own run subfolder. An entry with no `area` restores as a tree path, so an older run folder rolls back as today. |
| D3 | `a/../../overlays` is accepted because it normalizes to `../overlays`. |
| D4 | `repin --stage` refuses a stage folder inside the live overlay folder with exit 2. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0.
- [x] `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs` exits 0 and asserts that `resolveOverlayDir` returns `../overlays` for `../overlays`, `../overlays/` and `a/../../overlays` and throws for `..`, `../`, `.`, `/etc`, `../../x` and `../a/b`.
- [x] `node --test --test-name-pattern sibling` on each of `overlay-engine-sync.test.cjs`, `overlay-engine-repin.test.cjs` and `overlay-engine-strict-writes.test.cjs` in `.skilled/commands/doctor/scripts/tests/` exits 0 with a pass count above 0.
- [x] `git diff -U0 -- .skilled/commands/doctor/scripts/tests/overlay-engine-{sync,strict-writes,repin,follow-up}.test.cjs | rg '^-\s*(assert|test\()'` prints nothing.
- [x] `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` exits 0 with a sibling-folder case, and `git diff --quiet -- .skilled/hooks/overlay-guard/lib/overlay-guard.cjs` exits 0.
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
| Child goal authored | Done | `/create:goal ... child :auto`, criteria drawn from AC-001 to AC-012 in `acceptance-criteria.md` |
| Engine suite | Done | 238/238, exit 0 (`scratch/evidence/after-engine-suite.txt`) |
| Accept and refuse table | Done | fixes test 33/33, exit 0, with rows for `../overlays`, `../overlays/` and `a/../../overlays` |
| Sibling patterns | Done | sync 3/3, repin 10/10, strict-writes 5/5, each exit 0 |
| No assertion removed | Done | the `rg` printed nothing |
| Guard core | Done | 20/20, exit 0; `overlay-guard.cjs` has no diff |

### Deviations and findings

| Item | Note |
|------|------|
| Negative-control message | The tasks expected `destination escapes the sync root`; the new tests failed earlier, at `names a folder outside the tree root`, because `resolveOverlayDir` throws first |
| Engine work split | Two sequential engine lanes instead of one, to stay inside one worker's tool budget |
| Review fix | A tree-self refusal that compared spelling only was hardened to compare resolved paths, with two negative tests |
| Open P2 | A dangling sibling link into the tree is accepted until its target exists (`implementation-summary.md` Known Limitations) |
<!-- /ANCHOR:log -->
