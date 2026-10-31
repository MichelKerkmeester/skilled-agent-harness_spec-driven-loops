---
title: "Iteration 7: The smallest new surface"
trigger_phrases: []
---
# Iteration 7: The smallest new surface

**Angle:** deepseek-07 · **Lens:** integration engineer · **Wave 3 begins** · **Jev package under study:** Python `jev-cli` 0.6.2

## Focus

Do the top ideas so far need a new skill, command or shared helper, or can each call the `cli-usage` transport from its own seam? If a shared piece is needed, what is the smallest one that three real callers use? Hand-off target: the surface decision (none, helper, command or skill), its callers at `file:line`, and its LOC.

## Sibling check (required from wave 2 onward)

Newest siblings at read time: grok-010 (complete) and mimo-001 (still first). Grok-010's first-slice verdict (offline routing arm) and kill criterion were already incorporated at iteration 6. Mimo-001's D4 build-now position with the silent-mock catch was incorporated at iteration 6 as a position update. No further sibling movement that changes this angle; no restating.

## Actions Taken (opened this iteration)

- `.skilled/skills/cli-jev/SKILL.md:1-60`
- `.skilled/skills/cli-jev/cli-usage/SKILL.md:85-135`
- `.skilled/skills/cli-jev/cli-usage/references/integration-patterns.md:1-120`
- `.skilled/skills/cli-jev/cli-usage/references/providers-and-models.md:140-168`
- Repo-wide search for existing `jev` spawns in `.skilled/skills`, `.skilled/hooks`, `.skilled/bin` (result: none)

## Findings

1. **No repository code spawns `jev` today.** A search for `execFileSync`/`spawnSync` near `jev` across `.skilled/skills`, `.skilled/hooks` and `.skilled/bin` returns nothing. The integration surface is documented shell patterns only; the first arm of any kind will be the first programmatic caller.
2. **The transport posture forbids a new skill or command for this.** `cli-usage` is `packetKind: "transport"`, read/Bash only, mutates nothing (`cli-jev/SKILL.md:12`, `:22`), and "a transport pairs with a workflow before any effecting operation" (`cli-usage/SKILL.md:113-114`). Scripts that need a judgment spawn the binary; they do not invoke a skill. A new `jev-judge` command would add a routing surface without adding a capability the transport lacks, and the hub already declares one mode with no bundle outcome (`cli-jev/SKILL.md:34`).
3. **The smallest first surface is none.** The first caller (the routing eval arm, per iteration 2.1 and grok-010) inlines its call: probe, spawn, classify, parse. Everything it needs is published in the transport docs: probe (`cli-usage/SKILL.md:96-103`), gate shape with exit-before-value (`integration-patterns.md:29-44`), choice triage (`:52-58`), score branching with ascending levels and fractional positions (`:80-95`), batch (`:103-119`).
4. **The one correctness-critical shared concern is the package probe.** `command -v jev` cannot distinguish the Python `jev-cli` 0.6.2 from the vendored npm `jevctl`, which installs the same binary name and disagrees on exit codes. Every caller that trusts an exit code must probe `jev --version` and expect 0.6.2 (`cli-usage/SKILL.md:97`) plus `jev auth status` (never prints the key, `:98-103`; `auth test` costs one billed call, `providers-and-models.md:145-148`). This is the line most likely to drift across copy-paste callers.
5. **A helper is not earned yet, and the rule says so.** Zero real callers exist; the repo requires a third instance before an abstraction (`repo-rules-digest.md` §2 item 12) and rejects a wrapper that only forwards arguments (§4). When three callers actually exist — the routing arm, the latency/cost probe (iteration 8's likely first harness), and the D4 grader wrapper — the smallest shared piece is a reference client of roughly 60-80 LOC: `probe()`, `judgment(args, {timeoutMs})` with stdin bounded and caller-set timeout, an exit-code map that returns `{ok:false, reason}` instead of a value for 1/2/3/4/130, strict JSON parse, and typed-answer validation where a missing key is an error. Home at that time: a `scripts/jev-client.cjs` beside the transport that owns the contract, or the deep-loop runtime lib if only deep-loop callers appear. That decision belongs to the third caller, not to this research.
6. **What must be recorded from slice 1 is the probe output, not the helper.** Every offline report should name the binary version and provider/model it used (the vendored material's "pin the model and record it" pattern), because a report without them cannot be re-benchmarked later.

## Surface decision

- **None.** No new skill, no new command, no shared helper in the first slices.
- **First caller:** the offline routing arm; inline spawn following `integration-patterns.md` shapes; ~20-30 lines inside the arm script.
- **Helper trigger:** the third real caller (candidates: routing arm, latency/cost probe, D4 grader wrapper); ~60-80 LOC; named callers at that time.
- **Never:** a second hub mode, a command that only re-exposes `cli-usage`, a wrapper without classification/validation logic.

## Ruled Out

- **A new `cli-jev` skill mode or command for judging scripts**: transport posture already covers it; registry gain without capability.
- **A helper in slice 1**: zero callers; would be the two-instance abstraction the repo forbids, and a pure forwarding wrapper.
- **A preemptive helper home decision**: the home depends on which three callers appear.

## Questions Answered

- Surface decision: none; direct transport calls from each seam.
- If a shared piece is needed later: ~60-80 LOC reference client with probe, bounded spawn, exit map, strict parse; born at caller three.
- The smallest thing to standardize now: record the version/provider probe output in every report.

## Questions Remaining

- Which three callers actually land first? (decides whether the helper-owned contract is worth extracting)

## Hand-off (for iteration 8)

- Iteration 8 designs the smallest runnable harness for the top two ideas; the latency/cost probe candidate doubles as a future helper caller. The harness must probe and record the package version, skip cleanly with no key, and write a JSONL record per call (latency, exit, usage fields if returned).
- Do not scaffold a shared client until the third caller exists.

## Assessment

- `newInfoRatio`: `0.62`
- Novelty justification: Proved no repo code spawns `jev` today, fixed the no-new-surface decision on the transport's own posture, and named the probe/exit-map duplication as the one real shared concern with its trigger point at caller three.
- Confidence: high for the no-spawn search and the documented shapes; medium for the future helper size (inferred from the four required behaviors).

## Sources Consulted

- `.skilled/skills/cli-jev/SKILL.md`
- `.skilled/skills/cli-jev/cli-usage/SKILL.md`
- `.skilled/skills/cli-jev/cli-usage/references/integration-patterns.md`
- `.skilled/skills/cli-jev/cli-usage/references/providers-and-models.md`
- Siblings: grok-010, mimo-001 (read at iteration 6; unchanged)
