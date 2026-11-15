# Brief: analyze the Mistral Vibe session-handover logic

You are analyzing, not building. The operator approves fixes after reading your report.

## Pre-resolved gates (do not ask, nobody is at your prompt)

- Gate 3 is answered: spec folder `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/047-vibe-handover-hardening` (worktree `/Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening`, work only there).
- Write authority: exactly one file, `047-vibe-handover-hardening/scratch/analysis.md`. Edit nothing else. No git add, commit or branch.
- You may run read-only commands, the existing test suites (`node --test .skilled/hooks/session-handover/tests/*.test.cjs`), `vibe --help` and read the installed Vibe CLI source (`which vibe` resolves the install). Do not start a live Vibe or model session.
- Never read, write or name a dotenv file.

## Question

How does session handover work for Mistral Vibe today, where does it fail or risk failing, and what changes would make it more reliable? Judge it against the Claude Code path, which is the most proven runtime.

## Read

- `.skilled/hooks/session-handover/vibe/handover-parts.mjs` (Vibe hook adapter)
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs` (vibe arms: `vibeSessionFolder`, `vibeWorkingFolder`, `mintHandoverLocator`, arm/killer logic)
- `.skilled/hooks/session-handover/lib/context-usage.cjs`, `.skilled/hooks/session-handover/bin/session-handover.cjs`
- `.skilled/bin/skilled-loop` (vibe branches, around line 630)
- `.vibe/hooks.toml`, `.vibe/config.toml` and the Vibe hook registration they point at
- `.skilled/hooks/session-handover/history/lib/cli.ts` (Vibe store root)
- Tests: `tests/vibe-adapters.test.cjs`, `tests/session-handover-cli.test.cjs`, `tests/relaunch-core.test.cjs`, `tests/context-usage.test.cjs`
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md`
- The installed Vibe CLI source: which session data, environment and hook payload fields it gives hooks and tools
- Recorded limits: the `implementation-summary.md` Known Limitations of phases `043-vibe-handover-flag-and-live-hop`, `045-vibe-automatic-handover`, `046-vibe-history-locator` (siblings of 047)

## Recorded limits to test, not to accept

1. A typed `/speckit-handoff` does not arm: the recorded claim is that Vibe exports no session id to tools.
2. The killer treats three quiet seconds as idle and might signal during a slow model call (inferred, never seen live).
3. Parallel `post_tool` hooks might nudge twice (inferred).
4. An exported `MISTRAL_API_KEY` overrides the keychain plan key, which caused a live HTTP 402.
5. The sender's journal held the receiver's claim output at one sequence, cause unknown.

For each: confirm, refute or mark UNKNOWN, with evidence from code or Vibe source.

## Return shape

`analysis.md` with:

1. How the Vibe path works, end to end, in under 40 lines, every step cited `file:line`.
2. Findings: one section each, with severity (P0 breaks a hop, P1 makes it unreliable, P2 rough edge), evidence `file:line`, whether observed in code or inferred, and a proposed fix sized in lines and files.
3. A ranked list of fixes you recommend building, with the test that would prove each one and whether it needs a live Vibe hop to prove.
4. What you could not determine, and what would settle it.

Cite `file:line` for every claim. Keep fixes to the smallest change that solves the problem. Reply to me with the path of the file and a five-line summary.
