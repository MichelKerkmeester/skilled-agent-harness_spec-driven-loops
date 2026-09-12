---
title: "Deep-Research Strategy: Goal unification (036 / phase 001)"
trigger_phrases:
  - "goal unification research strategy"
---
# Deep-Research Strategy: Goal unification (036 / phase 001)

> Charter every iteration reads first. Two sequential lineages on this folder: iterations 1-10 on `deepseek-v4.1-flash`, iterations 11-15 on `glm-5.3-flash`, both via llmgateway through cli-pi at thinking max, stop policy max-iterations. Research only: **do not edit any file outside this folder's `research/` tree.**

## Objective

Decide, with `file:line` citations from this repository, how the cross-runtime goal hook (`.opencode/hooks/goal/`, `.opencode/plugins/opencode-goal.js`) should be rebuilt so that the packet `goal.md` under `specs/` is the single source of goal state, nested when a packet is phased and singular otherwise, while spec-kit keeps the parent goal current and resends it in chat without frontmatter.

## Subject under study

- `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` (goal | v2.2): frontmatter with `_memory.continuity`, anchors directive / binding (phase only) / completion / log.
- `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md`: set string = pointer + binding sentence + criteria copied verbatim; §5 resend rule says "full text"; §7 cites a 3000 budget; §8 links a deleted validator.
- `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:203-229`: goal.md continuity block mandatory; anchors required when present. `check-goal-shape.sh` was deleted in commit `1cdc362aa62`.
- `.opencode/hooks/goal/lib/goal-core.cjs`: `resolveStateDir` (:145), scope key sha256([workspace, runtime, sessionId]) (:174-208), `readGoalRecordForScope` (:622), `renderGoalBrief` (:405), `buildGoalPrompt`, `status !== 'active'` gate (:384), `setGoal` (:897). Store: `<repo>/.opencode/skills/.state/goal/<key>.json` plus `.locks/` and archive; currently holds only a README.
- `.opencode/plugins/opencode-goal.js`: independent implementation, keys sha256(sessionId), caps 4000 objective / 4000 goal_prompt / 4800 injection (:29-33).
- Runtime adapters: `.opencode/hooks/goal/pi/goal-context.ts`, `cursor/goal-inject.mjs`, `bin/goal.cjs`; commands `.opencode/commands/goal-opencode.md`, `.cursor/commands/goal-cursor.md` (refuses: no session identity), `.pi/prompts/goal-pi.md`. No goal hook for Claude Code, Codex, Devin (Devin removed in `specs/hooks/009-goal-isolation/006-*`).
- speckit commands `.opencode/commands/speckit/{plan,implement,complete,resume}.md` whitelist `opencode_goal` tools only; `assets/speckit-plan.yaml` `goal_prompting.set_mutation.dispatch_by_runtime` and `objective_shape: "Pointer plus copied completion criteria; never a file body"`.
- Contracts: `.opencode/hooks/hooks/injection-contract.md`, `.opencode/skills/system-spec-kit/references/config/hook-system.md`, `.opencode/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md`.
- History: `specs/hooks/003-goal-hooks-cross-runtime`, `specs/hooks/009-goal-isolation` (removed a process-global current-goal pointer), `specs/system-speckit/033-system-speckit-v4/010-goal-file-addon`, `.../029-goal-operator-resync-rule`.
- Operator constraints already decided (do not re-litigate): goal commands ship for pi, opencode, cursor, devin; Claude Code and Codex keep their native goal command and reach nesting through speckit commands or natural conversation; the parent durable slice is at most 4000 characters excluding frontmatter, children unbounded.

## Evidence discipline (every iteration)

1. Every claim about current behavior carries a `[SOURCE: path:line]` citation that resolves.
2. A design option is recorded with: what it costs today, what fails at the cheaper option, and the exact enforcement site (file and function).
3. Distinguish confirmed (read in the repo) from inferred (state what would confirm it). Mark unknowns UNKNOWN.
4. Max 12 tool calls per iteration; one angle per iteration; no sub-dispatch.
5. Write nothing outside `research/`.

## The eight angles

- **A1 Session-to-packet binding.** How a session learns which packet's goal.md is active: Gate-3 answer, a speckit set step, a thin per-session pointer, or nearest-packet inference from cwd. Failure modes with two concurrent sessions in one packet and one session switching packets.
- **A2 Frontmatter-strip contract.** Where the durable boundary lives (YAML parse versus an explicit marker), which surfaces must strip (chat resend, injection, objective string, CLI show), and what breaks when one call site reads the file raw.
- **A3 Legacy store fate.** What `.opencode/skills/.state/goal/` uniquely holds that goal.md cannot: liveness, locks, archive, two key schemes. Retire outright, or demote to a session-to-packet index.
- **A4 Resend and reminder mechanics.** Trigger predicate (durable-slice hash, not mtime), cadence, dedup, and non-blocking semantics: remind while unset, never stop work unless told.
- **A5 Per-runtime feasibility.** pi, opencode, cursor, devin command and hook surfaces, session identity availability, injection caps. Verify whether Claude Code and Codex expose a native goal command and how a speckit-command path can set it. Fate of the Claude Code memory goal files (`~/.claude/projects/*/memory/goal_*.md`).
- **A6 Isolation regression.** How a packet-shared goal.md avoids re-introducing what `009-goal-isolation` removed; what must stay per-session.
- **A7 Auto-update authority.** What may mutate the parent goal unprompted, what needs operator ratification, and how a child change propagates to the parent.
- **A8 Budget and truncation.** The 4000 durable budget against every real cap; cut order when over; where the budget is enforced.

## Iteration allocation

| Iteration | Model | Angle | Required focus |
|-----------|-------|-------|----------------|
| 1 | deepseek | A1 | Enumerate binding mechanisms with their session and packet failure modes |
| 2 | deepseek | A2 | Every surface that renders goal text today; where a strip function would sit |
| 3 | deepseek | A3 | Inventory of what the store holds and which fields goal.md lacks |
| 4 | deepseek | A4 | Trigger predicate, cadence and dedup options; spam risks |
| 5 | deepseek | A5 | Runtime-by-runtime surface and identity map, including the two native goal commands |
| 6 | deepseek | A6 | Read 009-goal-isolation; name what shared state was removed and why |
| 7 | deepseek | A7 | Authority ladder for parent mutation; child-to-parent amendment path |
| 8 | deepseek | A8 | Caps across plugin, core, chat; cut order; enforcement site |
| 9 | deepseek | A1 + A3 | Second pass: binding and store fate as one design |
| 10 | deepseek | A2 + A4 | Second pass: strip and resend as one pipeline |
| 11 | glm | weakest of A1-A8 | Attack the angle with the thinnest evidence in run 1 |
| 12 | glm | A5 | Verify or refute run 1's runtime claims against the repo |
| 13 | glm | A6 + A7 | Reconcile isolation with auto-update authority |
| 14 | glm | A8 + A2 | Verify budget arithmetic on the real parent goal of packet 036 |
| 15 | glm | synthesis | Ranked options per decision D1-D7 with rejected alternatives and enforcement sites |

## Deliverables (must exist in `research.md` at the cap)

1. **Decision matrix**: for each of D1 binding, D2 store fate, D3 strip, D4 resend, D5 runtimes, D6 budget, D7 isolation reconciliation: options, chosen, rejected, enforcement site, citations.
2. **Runtime feasibility table**: pi, opencode, cursor, devin, claude-code, codex, with identity source, command surface, injection cap, ship or defer.
3. **Risk register**: shared-state regression, concurrent writes, two implementations drifting, resend spam, frontmatter leak.
4. **Migration note**: what happens to existing store records under each store-fate option.

## Non-goals

No code edits. No template edits. No new model roster entries. No re-litigation of the operator constraints listed above.
