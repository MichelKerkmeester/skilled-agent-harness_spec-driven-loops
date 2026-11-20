---
title: "Goal: Phase 5: barter-move-overlays-out-of-tree"
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
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree"
    last_updated_at: "2026-11-20T10:38:03Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-005-barter-move-overlays-out-of-tree"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: barter-move-overlays-out-of-tree

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** In an `ai-speckit` session, Barter's overlay folder moves from `skilled/barter-overlays/` to `ai-speckit/overlays/`, `skilled/.skilled-overlays.json` names `../overlays`, and status, the edit guard, the commit gate and the git-write gate behave as they did before the move.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Two commits, in this order. Commit 1 changes only the three hooks and their tests so each finds the folder at `<tree>/barter-overlays` or `<tree>/../overlays`. Commit 2 runs `git mv skilled/barter-overlays overlays`, fixes every other path and drops the hooks' old-location fallback. `git mv` never runs before commit 1 exists. |
| D2 | The session runs in `ai-speckit`. In the Skilled checkout it writes only this phase's spec docs. |
| D3 | From the operator's answers: `ai-speckit/` is the git top level, so `overlays/` sits inside the repository, and `repin --stage <dir>` copies the tree to `<dir>/skilled` and the folder to `<dir>/overlays`. |
| D4 | Each hook takes the tree root as the folder holding `.skilled`, never as the overlay folder's parent. |
| D5 | `sync-state.json` is never edited by hand. `apply` retargets the two layout links. |
| D6 | Out of scope: changelogs, `.index/` and the track name `skilled-barter-overlays`. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] In `ai-speckit`, `git show --stat -M HEAD` lists `skilled/barter-overlays/... => overlays/...` renames, and `git show --stat -M HEAD~1` lists no rename and only hook and hook-test files.
- [ ] In `ai-speckit/skilled`, `cat .skilled-overlays.json` prints `{ "overlayDir": "../overlays" }`, `ls -d barter-overlays` fails, and `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --json` reports `result` `PASSED`, an empty `offLayout` and the `counts["in-sync"]` value this goal's log records before the move.
- [ ] In `ai-speckit/skilled`, `node .skilled/commands/doctor/scripts/overlay-engine.cjs --guard .skilled/skills/sk-git/sk-git-skilled/SKILL.md` exits 1 and names a source under `../overlays/framework/`, and `--guard ../overlays/README.md` exits 0.
- [ ] In `ai-speckit`, `skilled/.opencode/scripts/git-hooks/pre-commit` exits 0 on a clean index and prints the overlay status, and from `skilled/`, `node .skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs --session-kind` prints `ai-speckit`.
- [ ] After `node .skilled/commands/doctor/scripts/overlay-engine.cjs repin --stage <empty dir outside skilled/ and overlays/> --upstream <Skilled checkout> --to <manifest pin.commit>` runs from `ai-speckit/skilled`, `shasum -a 256` of `overlays/overlay-manifest.json`, `overlays/sync-state.json` and every file under `overlays/repin-runs/` prints the hashes this goal's log records before it.
- [ ] In `ai-speckit`, `bash tests/run-all.sh` exits 0 and `node --test` on every `*.test.cjs` and `*.test.mjs` under `overlays/` exits 0.
- [ ] In `ai-speckit`, `rg -n '(^|[^-])barter-overlays' overlays/framework/hooks overlays/root/opencode/scripts overlays/framework/skills/sk-git/scripts/hooks` prints nothing, and `git check-ignore -v overlays/repin-runs/x overlays/framework/skills/a/node_modules/x overlays/framework/hooks/a/dist/x` prints three rule lines.
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
| Phase goal authored | Done | `/create:goal ... child :auto`, criteria taken from AC-001 to AC-008 and AC-010 |
| Baselines before the move: in-sync count, git-write gate answers, `core.hooksPath` | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| AC-009 not a goal criterion | Its allowed matches are listed in another file, so it cannot be checked from this goal alone. It stays a closure row in the phase's acceptance criteria |
<!-- /ANCHOR:log -->
