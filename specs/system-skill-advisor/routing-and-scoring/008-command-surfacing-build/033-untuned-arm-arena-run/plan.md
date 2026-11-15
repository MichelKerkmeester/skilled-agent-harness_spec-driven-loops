---
title: "Implementation Plan: Phase 33: untuned-arm-arena-run"
description: "Run the phase 026 untuned arm live, unchanged, in five fresh arenas at one commit. Smoke first, then run 1 of both arms and the decline run 2, then score with the committed scorer and log the verdict against the 026 target."
trigger_phrases:
  - "untuned arm arena run plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 33: untuned-arm-arena-run

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node scripts of the advisor runtime's `routing-accuracy` folder, five CLI runtimes |
| **Framework** | `run-command-behaviour.mjs`, `prepare-behaviour-arena.mjs` and `score-command-transcripts.mjs`, all committed and unchanged here |
| **Storage** | Run logs and evidence in this phase's `scratch/`. Arenas under `$TMPDIR/skilled-behaviour-arenas/fresh-<runtime>` |
| **Testing** | The smoke row per runtime and arm, the scorer's summary and the advisor suite as a no-change check |

### Overview
This phase changes no code. It reruns tasks T039 and T041 to T049 of phase 026 at a new arena commit, sized by the option D review: run 1 of both arms over the 36 fresh rows and run 2 of the 8 decline rows in the `on` arm, on claude, opencode, pi, devin and dsh. The verdict applies the 026 Pre-registered Target, where with one run per arm a row gains when its `on` run followed and its `off` run did not.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The worktree is clean at the merged commit and `env -u AI_SESSION_CHILD npx vitest run` in the advisor runtime reports 0 failed
- [ ] The stopped arm's kept lines sit in `026-untuned-behaviour-arm/scratch/runs/discarded/`
- [ ] Five builder runs print `"ok":true` with `head` equal to the arena commit

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Each runtime log groups `[36,36,8]` and the scorer's `--summary ... --pair off,on --json` exits 0
- [ ] The goal log holds the verdict, per-runtime, step reader and B-5 rows
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Paired arm measurement, unchanged from phase 026.

### Key Components
- **Arena builder**: one throwaway clone per runtime at the arena commit, no remote, refusing a dirty source, a stale build or an escaping link
- **Runner**: one turn per row with the advisor switched off or on, a per-turn refusal and restore, and one JSON line per turn
- **Scorer**: joins each line to its fresh label, pairs the arms and prints the followed, paired, pooled, starts and delivery blocks

No new file, module, option or dependency. Without this run the untuned question has no scored session.

### Data Flow
The runner reads a fresh row in the arena, starts one turn, restores the arena and appends a line to `scratch/runs/<runtime>.jsonl`. The scorer reads those lines and the runtime's session store and writes `summary-arm.json`. Committed `jq` filters turn that into `arm-evidence.txt`, and the verdict is read from it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a fix packet. No producer, consumer or shared contract changes, so the table records only what the run touches.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `026-untuned-behaviour-arm/scratch/runs/*.jsonl` | Stopped-arm lines from older arenas | Moved to `discarded/`, unchanged | `ls` before and after, line counts equal |
| `../goal.md` | Parent goal log | Rows appended through the goal log command | `rg -c` per row and `goal.cjs packet` prints `packet_budget=ok` |

Required inventories:
- Same-class producers: none, no code changes.
- Consumers of changed symbols: none.
- Matrix axes: runtime (5) x arm (off, on) x run (1, and 2 for decline rows on `on`).
- Algorithm invariant: a session never reaches a remote, and every line reads `restored: true`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Unchanged harness, confirmed by the full advisor suite at the arena commit | Vitest |
| Integration | One smoke row per runtime and arm through arena, runner, reader and scorer | The runner and scorer |
| Manual | Step reader over picked sessions, read-only judgment | One Fable 5.2 medium session |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Claude CLI with Sonnet 5.5 | External | Green | Claude arm stops, its remaining rows resume with `--row-id` |
| OpenCode Go DeepSeek flash for OpenCode and Pi | External | Green | Those two arms stop |
| Devin CLI swe-2-max and DSH on LLM Gateway | External | Green | Those arms stop |
| Free disk under `$TMPDIR`, at least 45 GB | Internal | Green | Arena build refused |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a smoke contradiction, a builder refusal, or any line with `restored` not true
- **Procedure**: stop the runners, leave the arenas for inspection, move this phase's run logs to `scratch/runs/discarded/` and log the stop. Nothing outside the arenas and this phase's folder is written, so no code rollback applies
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (discard, arenas, smoke) | The merged commit and a clean suite | Implementation |
| Implementation (run 1, decline run 2, reruns) | A smoke with no contradiction | Verification |
| Verification (score, floors, verdict, step reader, B-5) | Every runtime log at `[36,36,8]` | Close-out |
<!-- /ANCHOR:phase-deps -->

---
