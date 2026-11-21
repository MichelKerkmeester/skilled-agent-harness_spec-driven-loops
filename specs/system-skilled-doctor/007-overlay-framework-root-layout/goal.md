---
title: "Goal: Move a consumer's overlays out of the vendored tree into a sibling overlays folder with framework and root source roots"
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
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout"
    last_updated_at: "2026-11-20T15:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-007-overlay-framework-root-layout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Move a consumer's overlays out of the vendored tree into a sibling overlays folder with framework and root source roots

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Every doctor overlay engine consumer names overlay sources `framework/` for `.skilled` content and `root/` for everything else, the overlay folder may sit beside the vendored tree, and Barter keeps its overlays at `ai-speckit/overlays/` on that layout.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Flag day: the `framework/` + `root/` rule is every consumer's default, with no opt-in field. Old-layout trees keep applying, with a capped LAYOUT notice until one `apply --relayout`. |
| D2 | `overlayDir` may name only a direct sibling, `../<name>`. Deeper paths and a folder outside the git repository are refused. |
| D3 | With a sibling folder, `repin --stage <dir>` holds `<dir>/<tree>` and `<dir>/<overlays>`, writing nothing live. |
| D4 | `ai-speckit/skilled/.skilled-overlays.json` stays in the vendored copy and names `../overlays`. |
| D5 | Phase 004 re-pins Barter onto phase 003's Skilled commit and relays every source in one session. |
| D6 | Out of scope: removing old-layout or in-tree support, non-path overlay content changes, and spec history under `ai-speckit/specs/`. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING
<!-- FILL: List each child phase and its goal path. Name the precedence rule. GOOD: 001 and 002. Decisions here outrank child detail. WEAK: Children are bound. -->

**Read the child goal before working a phase.** It binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-engine-out-of-tree-overlay-folder | its `goal.md` |
| 002-engine-framework-root-source-layout | its `goal.md` |
| 003-engine-docs-and-release | its `goal.md` |
| 004-barter-repin-and-relayout | its `goal.md` |
| 005-barter-move-overlays-out-of-tree | its `goal.md` |
| 006-review-remediation | its `goal.md` |
| 014-overlay-folder-readmes | its `goal.md` |
| 015-alignment-command-overlay-targets | its `goal.md` |
| 016-upstream-code-alignment | its `goal.md` |
| 017-overlay-alignment-follow-ups | its `goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] In Skilled, `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0.
- [ ] In Skilled, `sed -n 5p .skilled/skills/system-skilled-doctor/SKILL.md` prints `version: 1.2.0.0`, and `changelog/v1.2.0.0.md` names `/doctor:overlay apply --relayout`.
- [ ] In `ai-speckit/skilled`, `cat .skilled-overlays.json` prints `{ "overlayDir": "../overlays" }`, and `ls -d barter-overlays` fails.
- [ ] In `ai-speckit/skilled`, `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --json` reports `PASSED` and an empty `offLayout`.
- [ ] In `ai-speckit/skilled`, `node .skilled/commands/doctor/scripts/overlay-engine.cjs --guard .skilled/skills/sk-git/sk-git-skilled/SKILL.md` exits 1 and names a source under `../overlays/framework/`.
- [ ] `validate.sh --recursive --strict` on this packet and every phase child prints `RESULT: PASSED`.
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
| Parent goal authored | Done | `/create:goal ... phase-parent :auto`, five binding rows matched the five phase folders by name |
| Phase 004 complete | Done | ai-speckit commits `c8cd005b173` (re-pin), `fd6dd18b66d` (changelog), `51e218edf2e` (relayout) |
| Phase 005 complete | Done | 2026-11-20: ai-speckit commits `a954fc956ce` (hooks) and `2a8f454c8d1` (move); `.skilled-overlays.json` names `../overlays`, status PASSED with offLayout=0 |
| Phase 006 complete | Done | 2026-11-20: Skilled merge `f2a608297c9` fixes the review's Skilled findings; on main the engine suite passes 262/262, guard 20/20, contract 9/9 |

### Deviations and findings

| Item | Note |
|------|------|
| Child `acceptance-criteria.md` check | Phases 002, 003 and 004 are Level 1 and carry none. On the operator's direction their goals take acceptance from each phase's `spec.md`, `plan.md` and `tasks.md`, so the workflow did not stop there |
<!-- /ANCHOR:log -->
