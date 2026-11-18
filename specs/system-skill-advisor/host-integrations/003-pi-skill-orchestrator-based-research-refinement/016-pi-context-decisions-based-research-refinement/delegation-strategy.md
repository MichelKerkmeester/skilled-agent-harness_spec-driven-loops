---
title: "Delegation Strategy: Building Phases 002, 004 and 003"
description: "How the three build phases are delegated to a GPT-6 Luna xhigh fast swarm through cli-codex, with DeepSeek V4.1 Flash max through cli-mistral-vibe as the fallback, while the orchestrating session reads, runs and verifies."
trigger_phrases:
  - "pi-context-decisions delegation strategy"
  - "luna swarm advisor refinement"
importance_tier: "important"
contextType: "planning"
---
# Delegation Strategy: Building Phases 002, 004 and 003

The executors write code. The orchestrating session, called the conductor below, reads the code, runs every check and decides. A green result from an executor counts only after the conductor has run the check itself.

---

## 1. Roles and Executors

| Role | Who | Does |
|------|-----|------|
| Conductor | The orchestrating Claude Code session | Writes the briefs, reviews every diff, runs every build, test, probe and validation, marks tasks done, asks the operator |
| Primary executor | GPT-6 Luna, `xhigh` reasoning, `fast` service tier, through cli-codex | One change per brief, up to 4 leaves in parallel on disjoint files |
| Fallback executor | DeepSeek V4.1 Flash, `max` thinking, through cli-mistral-vibe (alias `deepseek-flash`) | Takes a brief only when the fallback rule in section 3 fires |

The operator set both on 2026-11-18: "For implementation use luna 6 xhigh fast swarm, fallback to deepseek v4.1 flash max cli vibe (mistral cli)".

### Luna dispatch

```bash
cd "$REPO" && AI_SESSION_CHILD=1 codex exec \
  --model gpt-6-luna \
  -c model_reasoning_effort="xhigh" \
  -c service_tier="fast" \
  -c approval_policy=never \
  --sandbox workspace-write \
  "$(cat "$BRIEF")" </dev/null > "$OUT/leaf-$ID.log" 2>&1
```

- `--sandbox workspace-write` is required. The default sandbox is read-only and an edit brief would silently do nothing.
- The sandbox blocks the local sockets `tsx` needs, so a leaf cannot run the advisor's typecheck, vitest or build. Every brief says so, and the conductor runs those checks.
- `</dev/null` is required, or a backgrounded dispatch can hang with no output.

### Vibe fallback dispatch

```bash
RUN_DIR="$REPO/tmp/vibe-runs/$ID"; mkdir -p "$RUN_DIR"   # tmp/ is gitignored
export VIBE_HOME="$(mktemp -d)"; cp "$REPO/.vibe/config.toml" "$VIBE_HOME/config.toml"
node "$REPO/.vibe/plugins/repo-guards/render-home-hooks.cjs" "$VIBE_HOME"
cd "$RUN_DIR" && AI_SESSION_CHILD=1 VIBE_SPEC_FOLDER="$REPO/$PHASE" VIBE_HOME="$VIBE_HOME" \
  vibe -p "$(cat "$BRIEF")" --model deepseek-flash --add-dir "$REPO" --output-dir "$RUN_DIR/out" </dev/null
```

- A write run starts from a scratch folder inside the checkout, below its root, with `VIBE_HOME` outside it. From outside the checkout the repository hooks cannot find it and every tool call is skipped.
- The run counts as complete only when `out/export.json` records `exit_code` 0 and `outcome` `finished`. A clean stdout proves nothing.
- `deepseek-flash` carries `thinking = "max"` in its model row. No reasoning flag exists, and no other alias is used.
- Remove `$RUN_DIR` after the conductor has read the result.

---

## 2. Brief Rules

Every brief, for either executor:

- **One change.** One file and one edit, or one tightly coupled pair of files the task names together. The proving check goes in the brief.
- **Literal text.** Old text and new text at a named `file:line`, pasted, not described. The conductor fixes every new name (function, helper, constant) before the wave starts and pastes the same name into every brief that uses it.
- **Short.** Under about 90 lines.
- **Three fixed blocks, pasted verbatim into every brief:**

```text
RUN CONTEXT
You are a code leaf. Repository root: the current directory. Work only on the file(s) named in TASK.
Follow the coding standards in .skilled/skills/sk-code/. Comments keep the durable why and never name spec paths, phase numbers or finding ids.
You cannot run tsx, vitest, the typecheck or the build in this sandbox. The conductor runs them.

DON'T
Do not edit any file not named in TASK. Do not commit, push, branch or stash.
Do not reformat or "improve" code outside the change. Do not add tests, options, files or logging that TASK does not ask for.

HANDBACK
Reply with: the files you changed, the final text of each changed block, and anything in TASK that did not match the file (quote both).
```

- **Vibe briefs** also inline the full current text of every block the change touches. DeepSeek stalls in long read loops, so it gets what it needs in the brief and is told not to search.

---

## 3. Fallback Rule

A brief moves from Luna to Vibe only when one of these happens:

1. Codex reports the ChatGPT usage limit or an auth failure.
2. The same brief fails twice on Luna: no edit, a wrong edit the conductor rejects, or a hang past 20 minutes.

Luna is never routed through any other provider, even as a fallback. If both executors fail on the same brief, the conductor stops and asks the operator. It does not hand-write the change without saying so.

---

## 4. Waves per Phase

Build order: 002, then 004, then 003. A phase starts only when the one before it is done and validated. Leaves in one wave touch disjoint files. `A` is `.skilled/skills/system-skill-advisor/runtime`.

### Phase 002: pasted-context stripping

| Wave | Who | Tasks | Files |
|------|-----|-------|-------|
| 0 | Conductor | T001 rebuild and probe pair; T002 fix the rule and the function name, and run the rule on the probe, negatives and nested case; T003 corpus count; T004 placement check | none written except `implementation-summary.md` |
| 1 | 4 Luna leaves in parallel | T005 the exported function; T006 the call in `scoreAdvisorPrompt`; T007 the strip in `computeRecommendationOutput`; T008 the corpus row | `A/lib/prompt-policy.ts`; `A/lib/scorer/fusion.ts`; `A/handlers/advisor-recommend.ts`; `A/scripts/routing-accuracy/labeled-prompts.jsonl` |
| 2 | Conductor | Typecheck, then T009 to T011 baseline recaptures, T012 corpus gates, T013 rebuild and the three probes, T014 comment hygiene, T015 summary | the three baseline files, written by their own scripts |

### Phase 004: crash-path fallback

| Wave | Who | Tasks | Files |
|------|-----|-------|-------|
| 0 | Conductor | T001 re-read the catch; T002 hook suite baseline | none |
| 1 | 2 Luna leaves in parallel | T003 the failing test; T005 the doc sentence | `A/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`; `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` |
| 2 | Conductor, then 1 Luna leaf | Conductor confirms the new test fails for the right reason; leaf does T004 the nested-try fallback | `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` |
| 3 | Conductor | T006 typecheck, T007 diff holds three files, T008 hygiene, T009 summary | none |

### Phase 003: follow-up routing benchmark

| Wave | Who | Tasks | Files |
|------|-----|-------|-------|
| 0 | Conductor | T001 confirm 002 and 004 are done; T002 baseline bench run | none |
| 1 | 3 Luna briefs in series on one file | T003 floor counts and `C` row ids; T004 the nine pairs; T005 the follow-up scoring line | `A/bench/scorer-calibration.bench.ts` |
| 2 | Conductor | T006 no pinned value moved, T007 hygiene, T008 apply the decision rule and record it | `implementation-summary.md` |
| 3, ship only | 4 Luna leaves in parallel | T009 schema; T010 `publicRecommendation`; T011 subprocess type and CLI fallback; the skipped-result helper export from T012 | `A/schemas/advisor-tool-schemas.ts`; `A/handlers/advisor-recommend.ts`; `A/lib/subprocess.ts` with `hooks/lib/skill-advisor-cli-fallback.ts`; `A/lib/skill-advisor-brief.ts` |
| 4, ship only | 2 Luna leaves in parallel | T012 the guard; T013 the guard test | `hooks/claude/user-prompt-submit.ts`; `A/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` |
| 5 | Conductor | Typecheck, `npx vitest run tests/hooks tests/schemas tests/handlers`, the ship probe, T014, T015 | none |

The plan expects the no-guard branch, so waves 3 and 4 most likely never run.

---

## 5. Conductor Checks

- **After every leaf:** read the diff, compare it with the brief's literal new text, and reject any change outside the named file. A rejected edit is reverted with `git checkout -- <file>` before the retry.
- **After every wave:** run the checks the wave's tasks name, from the conductor's own shell, and read both the output and the exit code.
- **Refutation pass after each phase.** One read-only Luna dispatch (`--sandbox read-only`) gets the phase's full diff and one instruction: refute it, naming an input and the wrong outcome for each finding. "Looks good" counts as a failed review. The conductor checks each finding before acting on it.
- **Completion:** the phase's `tasks.md` has no open task except branches the decision rule skipped, its goal criteria are ticked with evidence, and `validate.sh <phase> --strict` prints `RESULT: PASSED`.

---

## 6. Stops and Asks

- **Before phase 002 starts**, the conductor asks the operator to choose a git worktree or the current branch.
- **Commits and pushes** happen only when the operator says so.
- **Line drift:** when a cited line no longer matches the file, the conductor halts, re-reads the file and updates the brief. It does not let a leaf guess.
- **Three failed fixes** for the same symptom, or both executors failing on one brief: stop and ask.

---

## 7. Goals

The parent `goal.md` binds the five phase goals. Each build phase works against its own `goal.md`, and the parent goal's decisions outrank child detail. When the conductor starts a phase, it reads that phase's goal first and resends the parent goal's chat slice if the goal file changed.
