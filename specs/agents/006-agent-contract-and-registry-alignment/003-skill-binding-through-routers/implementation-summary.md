---
title: "Implementation Summary: Phase 3: skill-binding-through-routers"
description: "Six agent files now reach their skills through each skill's entry file, and the roster check fails when an agent cites a skill path that is not on disk."
trigger_phrases:
  - "skill binding through routers implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/003-skill-binding-through-routers"
    last_updated_at: "2026-11-14T13:05:00Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 3 with all seven acceptance rows Met"
    next_safe_action: "Run the phase 004 tasks in order from T001"
    packet_purpose: "Purpose: Every agent reaches a skill through that skill's entry point and router, and CI fails when an agent cites a skill path that is not on disk."
    blockers: []
    key_files:
      - ".skilled/bin/sync-agent-roster.cjs"
      - ".skilled/agents/markdown.md"
      - ".skilled/agents/design.md"
    session_dedup:
      fingerprint: "sha256:4011417adae04571db58943678526693107b8ef1bc685dd5886cb923f1750356"
      session_id: "b4d994a7-2eea-4664-a8cc-18efadcb7983"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "b4d994a7-2eea-4664-a8cc-18efadcb7983"
      workspace: "/Users/michelkerkmeester/worktrees/public/377-agent-contract-and-registry-alignment"
      savedAt: "2026-11-14T13:05:00Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-skill-binding-through-routers |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An agent that cites a renamed skill file now fails in CI. Before this phase it failed only when the agent tried to read the file in the middle of a task.

### The path check

The `--check` mode of `.skilled/bin/sync-agent-roster.cjs` reads every `.skilled/skills/` path in each agent file. It reports a path that is missing, a directory that holds no `SKILL.md` and a path containing `..`, and it skips placeholders written with angle brackets or a star. Three test cases cover it.

### Skills reached through their entry files

`design.md` no longer cites four files inside `sk-code-frontend`. It reads the `sk-code` entry file and follows its route. `markdown.md` points each `/create:*` row at the mode packet's `SKILL.md`, down from 17 cited `sk-create-*` asset paths to none. `deep-review.md` loads the review doctrine through the review mode's `SKILL.md`. `debug.md`, `context.md` and `prompt-improver.md` each state when a skill loads and name its entry file.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/sync-agent-roster.cjs` | Modified | Skill path check in `--check` mode |
| `.skilled/bin/sync-agent-roster.vitest.ts` | Modified | Three cases, seven in total |
| `.skilled/agents/design.md` | Modified | Decide path loads through `sk-code/SKILL.md` |
| `.skilled/agents/markdown.md` | Modified | Command map and related resources name mode packet entry files |
| `.skilled/agents/deep-review.md` | Modified | Four lines name `sk-code-review/SKILL.md` |
| `.skilled/agents/debug.md`, `context.md` | Modified | One line each: load condition and entry file for `system-spec-kit` |
| `.skilled/agents/prompt-improver.md` | Modified | An entry file column, and no bare references folder |
| `.skilled/agents/orchestrate.md` | Modified | One placeholder path written as `cli-<mode>` |
| `.claude/agents` twins of the seven files | Modified | Hand-kept twins, the same lines |
| `.codex`, `.pi` and `.dsh` copies | Regenerated | Generated copies |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrating session ran both skill routers and wrote `scratch/route-parity.md`, one line per path an agent file was about to stop citing, and committed it before any agent file changed. DeepSeek V4.1 Flash at max, through `cli-opencode` on the LLM Gateway route, then made the edits in eight dispatches: one for the script and its tests, and one per agent file with its Claude twin. Each brief carried the literal old and new text and its own searches. After each return the orchestrating session compared the canonical diff with the twin diff, reran the searches, ran the three copy generators, the mirror check, the roster check and the tests. The briefs are kept under `scratch/dispatch-kit/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A directory citation without `SKILL.md` was rewritten, and the rule was not narrowed | The spec's edge case says such a citation fails the check. The two in `markdown.md` became the card that names the examples folder and the full path of one script, and the one in `prompt-improver.md` became a sentence about the entry file |
| `orchestrate.md` changed although the phase's file table does not list it | Its placeholder `cli-X` read as a real folder, so the check could not exit 0 on the final tree without it. The parent spec puts phase 3's check over every agent file |
| No path was kept | Both routers reach every cited file, so the parity table has no `kept` line |
| Agents do not call `compiled-route.cjs` themselves | The spec decides that an agent names the entry file and follows what it says |
| `code.md` and `review.md` were compared against the close of phase 2, not main | Phase 1 changed both on this branch, so a diff against main would show phase 1 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Acceptance criteria | 7 of 7 `Met`, none waived, see `acceptance-criteria.md` |
| `tasks.md` checklist | Every P0 and P1 item checked with its output, the one P2 item deferred with its reason |
| `node .skilled/bin/sync-agent-roster.cjs --check` | `agent-roster: OK`, exit 0, 0.062 seconds real |
| The same check on a scratch copy with one citation renamed | `missing skill path: deep-review:` with the path, exit 1 |
| `vitest run --root .skilled --config vitest.config.bin.ts bin/sync-agent-roster.vitest.ts` | 7 passed of 7 |
| `quality-gate.cjs --files` on the script and its test | No P0, P1 or P2 finding, exit 0 |
| `node .skilled/bin/check-agent-mirror-sync.cjs --all` | `11 agent(s) checked — all comparable mirrors in sync — OK`, exit 0 |
| Canonical diff against Claude twin diff, seven files | The changed lines are identical in each pair |
| One `design` dispatch on a fixed task | 6 tool calls, 4 before. The agent found every reference and reported nothing missing |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The decide path of `design` costs two more reads.** One dispatch took 6 tool calls where it took 4, because it now reads the `sk-code` and `sk-code-frontend` entry files first.
2. **Only `design` was dispatched after the edit.** `markdown`, `deep-review`, `debug`, `context` and `prompt-improver` were checked by search, not by a live run.
3. **The check reads paths that begin with `.skilled/skills/` only.** A short form such as `sk-code-review/SKILL.md` with no prefix is not resolved.
4. **The agent-authoring pitfalls reference does not yet name hard-coded skill paths.** The parent packet keeps skill reference files out of scope.
5. **The CI step was not run on GitHub.** The branch is local, so the check has only run on this machine.
<!-- /ANCHOR:limitations -->

---
