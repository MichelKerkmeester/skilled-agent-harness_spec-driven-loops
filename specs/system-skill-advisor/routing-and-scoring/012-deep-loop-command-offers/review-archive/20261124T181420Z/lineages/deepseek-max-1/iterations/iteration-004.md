# Review Iteration 004 — deepseek-max-1

**Dimension:** security (D2)
**Protocol:** behavior execution + code read
**Focus:** the gate's handling of untrusted prompt text: regex cost on very long inputs, the bounded lead window, and the trust boundary at the degraded brief where a child-supplied command string could reach the reader.

## Dispatcher

- Run: `fanout-deepseek-max-1-1795518961022-7ms9ak`, generation 1, label `deepseek-max-1`.
- Execution: this process; no nested dispatch ran.
- Config: `maxIterations=7`, `stopPolicy=max-iterations`.
- Steering channel: `steer.md` is absent at iteration 4.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:630-680,1320-1360,1400-1490`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888,5000-5030,5441-5470`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1485-1520,1560-1600`
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:180-240`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:996-1010`
- `.skilled/skills/system-skill-advisor/runtime/tests/cli-degraded-command-contract.vitest.ts:150-185`
- `.skilled/hooks/injection-contract.md:1-60`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A typed `/doctor:deep-loop` after a stuck complaint is withheld as "only mentioned"** -- `command-attach.ts:1401` -- The gate's own comment says a doctor command the reader typed and asked for is the request itself, and the shared fixture header says a bare naming on a stuck run keeps it. Measured: `commandOnlyMentioned("the deep research run is stuck, /doctor:deep-loop", "/doctor:deep-loop")` returns `true`, so `attachCommand` returns `undefined` for that prompt, while the near-identical "the loop stalled. /doctor:deep-loop now" returns `/doctor:deep-loop`.
   Case: an operator whose research run is stuck writes "the deep research run is stuck, /doctor:deep-loop" and receives the hub with no command, though they typed the diagnosis command they want. The bare command alone, and the same command after "the loop stalled.", both keep it, so the withholding depends on the symptom word used.
   Finding class: `typed-request-withheld` (false negative; no wrong command is offered and the operator can still type the command).
   Scope proof: `command-attach.ts` is a `reviewScopeFiles` entry; the three prompts were evaluated against the built `dist` gate and the `commandOnlyMentioned` result was read directly. This finding surfaced during the trust-boundary pass but is a correctness defect, tagged `correctness`.
   Affected surface hints: `command-attach.ts:1401`, `command-attach.ts:1325` (`commandOnlyMentioned`), fixture doctor rows `:138-156`.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | partial (carried) | Iterations 1 and 3 findings stand. |
| `checklist_evidence` | pass (carried) | Iteration 2 result stands. |

What this iteration actually ran:

1. **Regex cost on adversarial inputs through the built native gate.** 96,000-character prompts (one repeated letter; repeated "do not run /deep:review."; repeated refusal clause; repeated "deep review"; repeated "iterations"; a 90,000-character nested loop request) all completed under 17 ms for `asksForLoopRun` + `isStuckRunComplaint` + `attachCommand` together. No catastrophic backtracking observed in the native patterns.
2. **The same inputs through the Python gate.** Worst case 35 ms for a 96,000-character refusal prompt; 6 ms for a repeated-letter prompt; 3 ms for the 10,000-character case. The Python head cut (`_advisor_prompt_head`) bounds the work as REQ-030 states.
3. **The bounded lead window.** `LEAD_WINDOW = 400` at `command-attach.ts:641`, used by `endsBefore` with a 16-character context; the window is fixed, so a refusal lead more than 400 characters before a match is out of scope by design rather than by accident.
4. **The degraded-path trust boundary.** `degradedRecommendations` reads a child-supplied `entry.command` only through `trackedCommandForOwner`, which requires the command to exist in `TRACKED_COMMANDS` and its owner to match the row's skill or the skill's alias (`skill-advisor-cli.ts:1489-1495`). The contract test at `cli-degraded-command-contract.vitest.ts:152` keeps a tracked command and `:178` drops an unknown string and another skill's command. A prompt cannot make the child print an arbitrary command through this path.
5. **Untrusted-content handling in the hook contract.** `.skilled/hooks/injection-contract.md` treats injected text as data; nothing in the reviewed files takes instruction from prompt content beyond pattern matching.

## Integration Evidence

- Native gate: built `dist/runtime/lib/command-attach.js`, executed directly for timing and predicate reads.
- Python gate: `skill_advisor.py` imported directly for timing and predicate reads.
- Degraded brief: `skill-advisor-cli.ts:1489` + `cli-degraded-command-contract.vitest.ts:152,178`.
- Hook contract: `.skilled/hooks/injection-contract.md`.

## Edge Cases

- **Timing is a measurement on this host, not a proof.** The inputs cover the shapes that would trigger catastrophic backtracking; a different machine could shift absolute numbers, but the bounded windows and precompiled patterns are what rule out quadratic growth, and the shape holds.
- **The typed-doctor gap is not a security defect.** It is recorded at P2 and tagged correctness, because it withholds an offer rather than exposing anything.
- **Doctor rows from the doctor skill itself are out of this gate's scope.** "how many passes does /doctor:deep-loop need" surfaces `/doctor:deep-loop` from `command-doctor-deep-loop`, not from `attachCommand`; the gate returns no command for it. Recorded as context, not as a finding against this packet.

## Confirmed-Clean Surfaces

- No catastrophic backtracking in either gate copy on 96,000-character adversarial prompts (native ≤ 17 ms, Python ≤ 35 ms).
- The lead window is fixed and documented, and the Python head is the same 10,000-unit head the native schema accepts.
- The degraded path cannot print an untracked or foreign command.
- Injection text is treated as data by the hook contract.

## Ruled Out

- **ReDoS on repeated refusal text.** Ruled out: 96k and 10k refusal prompts finish in single-digit milliseconds, and the refusal scan is windowed.
- **A crafted prompt can smuggle a command through the degraded brief.** Ruled out: `trackedCommandForOwner` gates the string on the tracked table and the row's owner.
- **The Python gate's head cut diverges from the native schema.** Ruled out: both read the same 10,000-unit head and the long-prompt fixture cases pin the withheld result.

## Next Focus

- **Dimension:** maintainability
- **Focus area:** the two gate copies' vocabulary lists, the drift guard's coverage, and the readability of the 400-character window and cue logic; plus the docs' description of these mechanisms.
- **Reason:** security is covered; maintainability is the last canonical dimension the coverage gate needs.
- **Rotation status:** security complete; maintainability next.
- **Required evidence:** exported list definitions, guard lines and doc statements at `file:line`.

## Assessment

Dimensions addressed: security

The security surface is clean: bounded windows, precompiled patterns, no observed super-linear cost, and a degraded path that refuses untrusted command strings. One correctness P2 was surfaced and tagged accordingly. No P0.

Review verdict: CONDITIONAL
