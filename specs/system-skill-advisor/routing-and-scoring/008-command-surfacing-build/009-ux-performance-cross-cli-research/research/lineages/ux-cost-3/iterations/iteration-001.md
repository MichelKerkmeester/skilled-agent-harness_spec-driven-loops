# Iteration 1: Hook health default — what a default-on record costs

## Focus

KQ1, carried question (c): hook health reaches `/doctor:setup` only after a run with `SKILL_ADVISOR_DEBUG=1`. What should the default be, and what does a default-on record cost in bytes per prompt, latency per prompt, file growth and privacy of what is recorded? Read the diagnostics writer and the `advisor_status` reader, then measure the write.

## Focus Selection Check

Strategy next focus named KQ1. No exhausted approach applied: the debug gate's cost was never measured in segment one or two, only its existence named as a known limitation of phase 011 (`011-typed-command-delivery-and-guards/implementation-summary.md:175`). This is a new measurement, not a re-recommendation.

## Actions Taken

1. Read the diagnostics writer `writeBoundedJsonl` and the record schema in `runtime/lib/metrics.ts`.
2. Read the reader path `readAdvisorHookHealthSection` → `advisor_status` → the `advisor_setup` advisor leg text in `.skilled/commands/doctor/assets/doctor-setup.yaml`.
3. Counted real diagnostics and outcome files in the operator's metrics root, which is evidence of how often the gate is on in practice.
4. Measured the record size and the append cost in one process, 240 samples, gated on.
5. Measured the hook with the gate off and on, two designs (block over six prompts, then 30 alternating pairs), to separate the write from daemon noise.

## Findings

1. **The gate is one early return, not a sampling policy.** `writeBoundedJsonl` returns before any write unless `process.env.SKILL_ADVISOR_DEBUG` is set, and `persistAdvisorHookDiagnosticRecord` calls it with the default (gated) options, while outcome records are written with `requireDebug: false`. So today the only choice is "one full record per prompt" or "nothing". [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:319-321] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:524-530]

2. **The reader needs four fields, not the record's nine.** `buildAdvisorHookHealthSection` computes `rollingP95Ms` from `durationMs` on cache hits, `rollingCacheHitRate` from `cacheHit`, and `rollingFailOpenRate` from `status`; it never reads `skillLabel`, `emittedBytes`, `directivesSuppressed`, `generation` or `errorDetails`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:456-481]

3. **`/doctor:setup` shows nothing at all on a default install, and it is the only surface that would.** The advisor leg prints the section only when `data.hookHealth` exists, and `advisor-status.ts` emits it only when the diagnostics file holds at least one valid record. Measured uptake on this machine: 17 `-diagnostics.jsonl` files against 119 `-outcomes.jsonl` files in the same metrics root, so 86% of workspace keys have never written a diagnostic record and can never show hook health. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:487-510] [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:59] [COMMAND: `ls $TMPDIR/speckit-skill-advisor-metrics | grep -c -- '-diagnostics.jsonl'` → 17; the same with `-outcomes.jsonl` → 119]

4. **A record costs about 200 bytes, and a health-only record would cost about 120.** Measured over 240 gated writes in one process: 47,040 bytes for 240 lines, 196 bytes per record, against a minimal hook record of 107 bytes. The live hook's 24 records averaged 201.7 bytes because they carry `skillLabel`, `emittedBytes` and `directivesSuppressed`. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/ux-cost-3/scratch/diagnostic-write-cost.mjs] [COMMAND output: medianMs 0.26, bytesPerRecord 196]

5. **The latency cost is below the hook's own noise floor.** The append itself is 0.26 ms median and 1.96 ms p95 over 240 writes. On the hook path, 30 alternating pairs on one prompt gave a paired delta median of -4.69 ms with p25 -57.57 and p75 53.5; a first block design over six prompts read +40 ms, which the paired design shows was a slow daemon spell rather than the write. The hook also caps the wait for pending diagnostic writes at 100 ms, so no prompt can wait longer than that. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/ux-cost-3/scratch/hook-latency-paired.mjs] [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:258-273]

6. **Growth is bounded at 200 records, and the bound is already in code.** `MAX_DURABLE_DIAGNOSTIC_RECORDS` is 200, and the writer trims only after the file passes 300 lines, so steady state is 40 KB and the worst transient is 60 KB, per workspace, in the OS temp directory. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:187-188] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:322-334]

7. **The privacy cost is the skill id, not the prompt.** The schema forbids `prompt`, `promptFingerprint`, `promptExcerpt`, `stdout` and `stderr`, and both the file and its directory are created 0600/0700. What a default-on record would newly persist is `skillLabel` — which skill the person's prompt routed to — plus `emittedBytes`, under a file named by a truncated sha256 of the workspace path. The code comment states the reason for the mode: "The logs record which skills a user works with, so only that user may read them". [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:175-181] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:188-194] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:281-289]

8. **Only the Claude hook adapter writes these records.** No OpenCode plugin, Pi extension or DSH plugin path references the diagnostic writer, so a default flip covers the hook-shaped runtimes (Claude, Codex, Cursor, Devin through the shared adapter) and leaves 2 of the 6 measured runtimes with no health at all. [COMMAND: `grep -rln "createAdvisorHookDiagnosticRecord|emitDiagnostic" .skilled/skills/system-skill-advisor/hooks` → only `claude/user-prompt-submit.ts`]

9. **The gate's original premise no longer holds, which is what reopens it.** The changelog says diagnostics were made opt-in because they "previously flushed on every invocation, even when no one was reading them". Since phase 011 `advisor_status` and `/doctor:setup` read them, and the install guide's prove-it step (`INSTALL-SKILLED.md:73`) does not set the variable, so a fresh install can never produce the thing the doctor reads. [SOURCE: .skilled/skills/system-skill-advisor/changelog/v0.3.0.0.md:20] [SOURCE: INSTALL-SKILLED.md:73]

## Questions Answered

- KQ1: The default should write a health-only record unconditionally and keep the content fields behind `SKILL_ADVISOR_DEBUG`. Cost: ~120 bytes per prompt, 0.26 ms, bounded at 200 records (about 24 KB health-only), no prompt text and no skill id.

## Questions Remaining

- KQ2: brief and cold-path cost at HEAD, and which bytes can be cut with no information lost.
- KQ3: ranking and floor risk.

## Ruled Out

- **Default-on with the full record as it stands.** It works (200 bytes, 0.26 ms) but it makes the skill id persist for every prompt on every install, and no reader uses that field. Rejected on privacy cost with no measured benefit.
- **Seeding one record at install time** (set `SKILL_ADVISOR_DEBUG=1` in the prove-it step). Rejected: the section would then show `p95 68 ms over 1 prompt` from install day forever, because `hookHealth` carries no age. A stale health number that never changes is worse than a missing one, and `advisor_status` has no field to express it.
- **Recording only fail-open and non-ok invocations.** Rejected: `rollingCacheHitRate` and `rollingP95Ms` need the ok population, so the health section would reduce to a fail-open count.

## Dead Ends

- A block design (N runs off, then N runs on) cannot measure this: daemon variance over seconds is 10x the write. Any reproduction must alternate pairs and report the paired delta.
- Reading the record's own `emittedBytes` as a brief-cost measurement is valid (it is the byte count the hook emitted) but it includes the directive block, so it measures the first message of a session, not the steady state.

## Edge Cases

- Ambiguous input: none; the question names the writer and the reader, and both exist at HEAD.
- Contradictory evidence: the first block measurement (+40 ms) contradicts the paired one (-4.69 ms). Resolved in favour of the paired design: it alternates the two arms against the same daemon state, and the in-process write number (0.26 ms) is three orders of magnitude below +40 ms.
- Missing dependencies: none. The measurements need no daemon start, no sandbox and no model.
- Partial success: none; every planned action ran.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:175-194, 281-334, 420-489, 524-530`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:487-510`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:238-273, 415-427`
- `.skilled/commands/doctor/assets/doctor-setup.yaml:59`
- `.skilled/skills/system-skill-advisor/changelog/v0.3.0.0.md:20`
- `INSTALL-SKILLED.md:73`
- `scratch/diagnostic-write-cost.mjs`, `scratch/hook-latency-paired.mjs`, `scratch/hook-health-cost.mjs`
- `$TMPDIR/speckit-skill-advisor-metrics/` file counts (17 diagnostics, 119 outcomes)

## Assessment

- New information ratio: 0.88
- Questions addressed: KQ1
- Questions answered: KQ1

## Reflection

- What worked and why: measuring the write in-process first turned a vague "diagnostics cost something" into 0.26 ms, which then explained why the hook-level block design had to be wrong. Counting the two metric file kinds was the cheapest possible evidence of real uptake, and it is the fact that actually decides the default.
- What did not work and why: the first hook design ran four runs off then four on per prompt. Within a prompt the daemon drifted more than the write costs, so the +40 ms was an artifact. The paired design removed that.
- What I would do differently: read the record schema before designing the latency test, because knowing the record is 200 bytes would have predicted that the write cannot be visible against a 170 ms hook.

## Recommended Next Focus

KQ2: re-run `measure-brief-cost.mjs` at HEAD and compare with the live brief, because the script's socket design may not reach a live daemon, and measure the embedder lane's warm and cold cost against the running Ollama server.
