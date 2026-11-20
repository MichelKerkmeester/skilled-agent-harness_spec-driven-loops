---
title: "Goal: Phase 2: engine-framework-root-source-layout"
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
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout"
    last_updated_at: "2026-11-20T10:35:39Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-007-002-engine-framework-root-source-layout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: engine-framework-root-source-layout

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Make the overlay engine's `framework/` + `root/` source naming rule the default for every consumer, mapping `.skilled/X` to `framework/X` and any other `X` to `root/X` with its leading dots dropped, while old-layout trees keep applying with a capped advisory LAYOUT notice and `apply --relayout` is the one migration step.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Apply reads every `source` as written, so no destination changes. LAYOUT never blocks status, and no tree is refused for its layout. |
| D2 | Status prints at most 20 LAYOUT lines, then one `LAYOUT   … N more; run <engine> apply --relayout` line. `status --json` keeps every entry in `offLayout`. |
| D3 | A `source`, `fragment` or `base` at or under `root/skilled/` is a blocked overlay. Adopt exits 2 on a destination starting `skilled/`, and relayout exits 2 naming an entry whose new-rule path lands there. |
| D4 | For a `repin.exclude` path, adopt takes a copy at the old dot-dropped path when the new-rule path holds none, prefers the new-rule path when both exist, and names the new-rule path when it refuses. |
| D5 | Fixture manifests keep their sources. Only `overlay-engine.cjs` and the follow-up and strict-writes tests change: no doc, Barter file or folder location. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 and reports `fail 0`.
- [x] `node --test --test-name-pattern 'old layout' .skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` exits 0 with `pass` of at least 1: an old-layout fixture applies and its status prints `RESULT: PASSED` with LAYOUT lines naming `framework/` and `root/` targets.
- [x] `node --test --test-name-pattern 'layout cap' .skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` exits 0 with `pass` of at least 1: 25 off-layout entries print 20 LAYOUT lines plus `LAYOUT   … 5 more; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout`, `offLayout` holds 25 items, and 20 entries print no overflow line.
- [x] `node --test --test-name-pattern 'relayout moves every off-layout source' .skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` exits 0 with `pass 1`: after `apply --relayout`, status exits 0 and prints no line starting `LAYOUT`.
- [x] `node --test --test-name-pattern 'root/skilled' .skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs .skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` exits 0 with `pass` of at least 3: a blocked source by entry id, an adopt that exits 2 without writing, and a relayout that exits 2 naming the blocked entry's id.
- [x] `node --test --test-name-pattern 'excluded copy' .skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` exits 0 with `pass` of at least 1: with copies at both `framework/local/hook.sh` and `skilled/local/hook.sh`, adopt of `.skilled/local/hook.sh` writes source `framework/local/hook.sh`.
- [x] `rg -c 'sourceLayout' .skilled/commands/doctor/scripts/overlay-engine.cjs .skilled/commands/doctor/scripts/tests` prints nothing and exits 1, so no manifest field chooses the source naming rule.
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
| Child goal authored | Done | `/create:goal ... child :auto`, from `goal-phase-child-template.md`, sources `spec.md` §3-§5, `plan.md` and `tasks.md` |
| Phase work | Done | Engine suite 250/250 and guard 20/20, each exit 0; every completion criterion passed (`scratch/evidence/after-per-criterion.txt`) |

### Deviations and findings

| Item | Note |
|------|------|
| No `acceptance-criteria.md` | This phase is Level 1 and carries none. On the operator's direction the criteria come from `spec.md` §4 REQ-001 to REQ-008 and §5 SC-001 to SC-003, with the verify commands of `tasks.md` T004-T021, so the workflow did not stop there |
| `packet_budget=unknown` | Expected: a phase child that is not itself a phase parent is exempt from the 4,000-character cap |
| `validate.sh` not run | The authoring brief barred it; `check-goal.cjs` was the gate |
| Extra scope | The phase also closed phase 001's dangling-link P2 and fixed three review P2s, each with a test |
| Worker split | Tests in parallel (Claude and DeepSeek through cli-pi), engine edits in two sequential lanes |
| Git-state checks left out of the criteria | T020 (`git diff HEAD` on the fixtures) and T022 (`git status --porcelain` on docs) hold only before the phase commit, so D5 records the boundary instead |
<!-- /ANCHOR:log -->
