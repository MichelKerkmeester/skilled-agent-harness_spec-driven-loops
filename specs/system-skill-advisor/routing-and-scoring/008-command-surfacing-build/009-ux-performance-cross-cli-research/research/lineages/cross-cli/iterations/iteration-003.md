# Iteration 3: Ranked post-008 changes, and the install steps that decide whether a runtime is reachable at all

## Focus

Answer Q3: which change after phases 005-008 raises the start rate per runtime, ranked by expected gain for the work, with the exact file and a verification that does not require a full six-runtime arm. Follow the reducer's next focus (the moving pre-arm log) by making the measurement gate explicit rather than treating a snapshot as a baseline.

## Actions Taken

1. Read the install guide's runtime list and the Codex hook-approval contract, then compared them with the runtime table the one-turn runner uses.
2. Checked the DSH plugin's enabling surface and the doc that names the flag.
3. Read the advisor brief renderer's options and its existing `runtime` field to test whether a per-runtime head is localized.
4. Re-read the scorer's aggregation points and the runner's Codex argv to place the measurement changes precisely.
5. Ranked the candidate changes by expected gain per unit of work using the iteration 1-2 evidence.

## Findings

1. **Codex surfacing depends on a per-entry approval that the install path never mentions.** Codex runs a project hook only after that exact entry is approved, stored as `trusted_hash` in `~/.codex/config.toml`; the only place this is written down is the repo-internal `.codex/README.md`. `INSTALL-SKILLED.md` tells a new user to build Spec Kit and register Code Mode, and never says to approve hooks. A fresh external repository therefore reaches Codex with no advisor brief, which is the same state the arena is in. [SOURCE: .codex/README.md:54] [SOURCE: INSTALL-SKILLED.md:40] [SOURCE: INSTALL-SKILLED.md:75]

2. **DSH has two independent install blockers, not one.** Its prompt-advisor adapter is off unless the `promptAdvisor` row flag is true, and `INSTALL-SKILLED.md` lists the supported runtimes as claude, opencode, codex, cursor, devin and pi without dsh, so a DSH user is never told to install the surface that carries the flag. The flag's existence is documented only inside the plugin's own README. [SOURCE: .dsh/plugins/repo-guards/index.mjs:53] [SOURCE: .dsh/plugins/repo-guards/README.md:120] [SOURCE: INSTALL-SKILLED.md:100]

3. **A per-runtime brief head is a small, localized change.** `AdvisorBriefRenderOptions` already carries `readonly runtime?: string`, and the Claude hook already passes its runtime through the lifecycle path; the head simply ignores it. That makes a runtime-specific suffix (the canonical document path for hosts with no command registry) a change inside one function rather than a new data flow. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:48] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:478] [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:293]

4. **Pi is the clean test bed for a head change, and the only runtime where it is.** Pi's brief is delivered in the prompt itself (6 of 6 sampled sessions), while Claude injects out of band and Codex is unapproved in the arena. A Pi-only A/B on the six started rows therefore isolates the head change from delivery and trust confounds. [SOURCE: .pi/extensions/prompt-advisor.ts:1] [SOURCE: .pi/extensions/README.md:93]

5. **Every claimed gain is conditional on two scorer facts that do not exist yet: arm completeness and brief attribution.** The log is still growing (24/24/24/15/13/11 rows at the last check), and the normalized records the scorer reads carry no `Advisor:` line for Claude. A before/after delta without `armComplete` and an offered-command join can be produced by row-set drift or by delivery failure and still look like a model-behaviour change. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1146] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:325]

## Recommendation Set (post-008)

Ordered by expected gain per unit of work. Each names the file, the gain and the check; none repeats a phase 005-008 task.

1. **Report Codex hooks as unapproved, and put the approval step in the install path.**
   - Files: `INSTALL-SKILLED.md` (new step after the build), `.skilled/commands/doctor/assets/` runtime-mirrors route + `.skilled/commands/doctor/scripts/` check (report `codex hooks unapproved` when the project has no trusted entry), `.codex/README.md` (link from the install step).
   - Gain: turns Codex from "0/12, no brief" into a measured runtime. The ceiling is the six started rows; the floor is whatever the first approved run shows.
   - Verify: `rg -n "approve" INSTALL-SKILLED.md` prints a hook step; one Codex smoke run's rollout contains `Advisor:`; the doctor route prints `WARN codex-hooks-unapproved` on a fresh clone and `PASS` after approval.

2. **Make the DSH surface visible and on by default in the repo.**
   - Files: `INSTALL-SKILLED.md` (add dsh to both runtime lists), `.dsh/plugins/repo-guards/index.mjs` (default `enabled: options.promptAdvisor !== false`), `.dsh/plugins/repo-guards/README.md` (update the sentence).
   - Gain: +1 runtime that can receive a brief at all. Today DSH's start rate is measured under a disabled advisor, so it cannot answer the surfacing question.
   - Verify: one DSH smoke run's step payload contains `Advisor:`; `rg -c "dsh" INSTALL-SKILLED.md` prints at least 2; the plugin test that asserts the off default is updated.

3. **Name the command document in the brief on hosts with no command registry.**
   - Files: `ADV/lib/render.ts` (use the existing `runtime` option; append `doc .skilled/commands/<ns>/<name>.md` when runtime is codex, pi or dsh), `ADV/tests` golden briefs (three new rows).
   - Gain: a model that receives the brief no longer has to infer the path from `/create:readme`; Pi is the clean A/B (6 started rows). Expected direction: Pi 0 of 6 started → above 0 on the same rows; the exact number is the measurement.
   - Verify: a Pi-only A/B on the six started rows with `score-command-transcripts --summary`; `started` rises with no new `unsafe`; the token delta per brief is under the existing cap (`bench/hook-brief-signal-noise.bench.ts`).

4. **Add the measurement gate before any before/after claim.**
   - Files: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` (`armComplete`, `uncappedStartRate`, `offered`), `run-command-behaviour.mjs` (record the brief hash/offered command in the run line), `ADV/lib/metrics.ts` (add `offeredCommand` to the hook outcome record).
   - Gain: converts "start 3 of 12" into "offered X of 12, started Y of X, capped Z excluded", which is the only form in which a delta is evidence.
   - Verify: a fixture log with 23 of 24 rows prints `arm incomplete`; a fixture with a brief naming `/create:readme` and no doc read prints `offered 1, started 0`.

5. **Reproduce G5, then fix the Claude mirror only if it reproduces.**
   - Files: a throwaway repo with `CLAUDE_CONFIG_DIR=$(mktemp -d)`; if reproduced, `sync-runtime-mirrors.cjs` (Claude-only mirror name for `create/skill.md`) plus the inventory name map from finding 5 in iteration 1.
   - Gain: 12 hidden `create:*` names become visible on Claude, or the defect is closed as a stand-in artifact. Both outcomes are useful; the current state is an untested claim in a phase doc.
   - Verify: two listings in one throwaway repo, with and without the `skill.md` basename; the diff names the 12 commands.

## Ruled Out

- **"Ship 005 and 006 and the start rate rises."** That is the planned path and cannot be recommended; it is also unverifiable until the two measurement facts exist. The recommendations above are what remains after those phases.
- **"Add the document path to every runtime's brief."** Unnecessary token cost on Claude and OpenCode, which can resolve the command through their own surfaces; the change is worth it only on hosts with no registry.

## Dead Ends

- No existing artifact measures a failed host-command invocation (for example a Codex `/create:readme` typed into an exec turn). The scorer sees tool calls and text, not a rejected slash token, so this gap is recorded rather than guessed.

## Edge Cases

- **Ambiguous input:** "raise the start rate" can mean the product rate or the measured rate. This iteration keeps both and labels which one each recommendation moves.
- **Contradictory evidence:** none.
- **Missing dependency:** the exact ceiling for recommendation 3 needs the Pi A/B, which this lineage cannot run (no CLI runs allowed).
- **Partial success:** the ranking is evidence-based but its top two items are install-path fixes whose gain is bounded by the six started rows, not by all 24.

## Questions Answered

- Q3: Which change to the brief contract or hook wiring raises start rate per runtime, and how does it extend rather than duplicate planned phases 005-008? — Answered with the ranked set above: Codex approval + install step, DSH default/install, per-runtime document path, the measurement gate, and the conditional G5 mirror fix.

## Questions Remaining

1 of 5 in substance: Q4's reproduction and Q5's implementation are now specified but not executed; Q3's ranking needs the Pi A/B to become a number.

## Sources Consulted

- `INSTALL-SKILLED.md`
- `.codex/README.md`, `.codex/config.toml`, `~/.codex/config.toml`
- `.dsh/plugins/repo-guards/index.mjs`, `README.md`, `adapters/prompt-advisor.mjs`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`
- `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.pi/extensions/README.md`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`, `run-command-behaviour.mjs`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl`
- `steer.md`

## Assessment

- New information ratio: 0.7
- Questions addressed: Q3
- Questions answered: Q3

## Reflection

- What worked and why: reading the install guide as a user would exposed two production blockers (Codex approval, DSH absence) that a repo-internal view hides; the renderer's existing `runtime` option made the head change cheap enough to rank.
- What did not work and why: no artifact exists for failed host-command invocations, so that path stays a gap.
- What I would do differently: check the install guide before the runtime shims; it explains why a runtime can be wired in-repo and still unreachable for a user.

## Recommended Next Focus

Iteration 4: the external-repository setup path in detail. Verify how hooks and command mirrors are installed per runtime, whether a fresh repo gets the six surfaces, and what the advisor does when a surface is missing. That closes the install half of the topic with file-level evidence.
