# Review Iteration 002 — Security

## Dispatcher

- Lineage `review/lineages/deepseek-max-1`, iteration 2 of 7, session `fanout-deepseek-max-1-1795550334883-gjbarh`
- Dimension: D2 security. Operator review focus carried: the `spec_code` and `checklist_evidence` protocols stay open and are advanced where the security surfaces meet a REQ.
- Scope: the pre-bound 72-file list; this iteration reads the degraded, fallback and subprocess surfaces inside it.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:145` (`sanitizeStderr`, `capOutput`), `:255` (`runSpawnAttempt`), `:383` (`runAdvisorSubprocess`)
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:207` (`childEnvForCli`), `:256` (child spawn), `:276` (prompt on stdin)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:300` (`frontDoorReadsPromptFromStdin`), `:313` (`compiledRouteForRecommendation`), `:334` (`execFileSync`)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489` (`trackedCommandForOwner`), `:1503` (`degradedRecommendations`), `:1571` (the supplied-command branch)
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257` (`ADVISOR_PROMPT_MAX_CHARS`, prompt bound)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts:146` (`mergedSkillForAlias`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888` (`_advisor_prompt_head`), `:5230` (`_LEAD_WINDOW`), `:6627` (gate reads the head)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Level | Status this iteration | Evidence |
| --- | --- | --- | --- |
| `spec_code` | core | partial | REQ-038's hardening is in the code: `trackedCommandForOwner` (`skill-advisor-cli.ts:1489`) admits a supplied command only when `TRACKED_COMMANDS` holds it and its `ownerSkillId` matches the row's skill, directly or through `mergedSkillForAlias` (`aliases.ts:146`), and `degradedRecommendations` calls it at `:1571` where the supplied string reaches the row. REQ-030's bounded reads are in place on both sides: `_advisor_prompt_head` (`skill_advisor.py:888`) cuts at the same 10,000 UTF-16 units the schema bounds (`advisor-tool-schemas.ts:257`), and `_LEAD_WINDOW = 400` (`skill_advisor.py:5230`) bounds the per-match prefix scan. The REQ-023 to REQ-034 block is still carried to iteration 4. |
| `checklist_evidence` | core | partial | AC-047's claim was checked against the surface it names: `cli-degraded-command-contract.vitest.ts` exists and `trackedCommandForOwner` is the function the cell points at. AC-037's long-prompt claim was checked against both copies rather than the test names: the Python cut and the native bound both read 10,000, and the 400-unit lead window is the bound the cell relies on. No acceptance row was found asserting a behaviour this iteration disproved. |

## Integration Evidence

- The subprocess boundary between the TypeScript runtime and the Python fallback was reviewed as an exact surface: `runAdvisorSubprocess` (`subprocess.ts:383`) spawns `python3 <script> --stdin` through `runSpawnAttempt`, which uses `spawn(command, args, { stdio: ['pipe','pipe','pipe'], env: process.env })` with no shell, writes the prompt on stdin (`:306`), caps both streams (`capOutput`, `:158`), kills on timeout with `SIGKILL`, and reduces stderr to 240 characters (`sanitizeStderr`, `:145`).
- The hook fallback was reviewed as an exact surface: `hooks/lib/skill-advisor-cli-fallback.ts:256` spawns `process.execPath` with an argument vector, keeps the prompt out of argv on purpose (`:276` to `:282`), and narrows the child environment through `childEnvForCli` (`:207`).
- The compiled-route front door was reviewed as an exact surface: `compiledRouteForRecommendation` (`advisor-recommend.ts:313`) refuses a front door that cannot read the prompt from stdin instead of falling back to argv (`frontDoorReadsPromptFromStdin`, `:300`), runs it with `execFileSync` (no shell), a 5-second timeout and a 1 MB buffer.

## Edge Cases

- An oversized prompt is refused by the native schema (`prompt: z.string().min(1).max(ADVISOR_PROMPT_MAX_CHARS)`) while the Python fallback cuts the head and answers. This is not recorded as a finding: the schema comment states the transport contract (a caller holding a longer prompt sends its head, and `skill-advisor-brief.ts:481` slices it), and the two gate copies still read the same 10,000-unit window, so the gate layer REQ-030 describes is at parity. Recorded here so a later iteration does not rediscover it as new.
- `runSpawnAttempt` passes `env: process.env` to the Python child. Both processes are the same trust domain and the child is the repository's own script, so this is not a disclosure path; it is named here because a future change that let a caller pick the executable would turn it into one.

## Confirmed-Clean Surfaces

- No shell interpolation reaches a caller-controlled string on any of the three spawn sites: `spawn` with an argument vector twice and `execFileSync` with an argument vector once.
- The prompt never rides in `argv` in either direction: the hook fallback sends `JSON.stringify(payload)` on stdin, and the runtime sends the raw prompt on stdin.
- Output is bounded before it is kept (`capOutput`) and stderr is bounded before it is surfaced (`sanitizeStderr`, 240 chars), so a runaway child cannot hold the hook's memory or spill a full log into a brief.
- The supplied-command path is an allowlist, not a sanitizer: a string the tracked table does not hold, or holds for another skill, prints as the row's skill with no command, policy, owner or typed marker, which is what REQ-038 states.

## Ruled Out

- Command injection through a supplied command string or a typed command: eliminated, every one of the three execution sites uses an argument vector with no shell, and the degraded path gates the string through `trackedCommandForOwner` before it can print.
- Prompt disclosure through the process table: eliminated, both spawn paths carry the prompt on stdin and `advisor-recommend.ts:300` refuses a front door that cannot read stdin rather than falling back to argv.
- Unbounded work on a 96,000-character prompt: eliminated at the code level, the gate reads a 10,000-unit head and the per-match prefix scan is bounded at 400 units on both sides.
- Secret or path disclosure through a child failure: eliminated as a security finding, stderr is reduced to 240 characters and the brief already names the workspace root, so the reduction does not hide a secret or expose one.

## Review Focus

The operator focus asked for `spec_code` and `checklist_evidence` to finish. This iteration advanced `spec_code` on two sixth-round requirements (REQ-030, REQ-038) by reading the code they name rather than the tests that assert it, and checked two acceptance cells (AC-037, AC-047) against the surfaces they cite. Both protocols stay `partial`; the remaining REQ block is scheduled for iterations 3 to 5.

## Next Focus

- Dimension: D3 traceability, first `spec_code` sweep (REQ-001 to REQ-022)
- Focus area: the offer-shaping and lane requirements, against `lib/command-attach.ts`, `lib/scorer/lanes/explicit.ts`, `lib/scorer/fusion.ts` and the 013 sibling packet docs
- Reason: traceability is the operator's stated priority and the third dimension in risk order; the spec_code protocol has the most remaining work
- Rotation status: D1 and D2 reviewed; D3 starts here
- Blocked/productive carry-forward: the counted-claim sweep is productive and is scheduled for iteration 5
- Required evidence: `file:line` per REQ, and for a REQ that a decision records instead of code, the ADR id and line

Review verdict: PASS
