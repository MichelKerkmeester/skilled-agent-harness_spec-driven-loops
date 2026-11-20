# Overengineering Review: Opus 5.5 High on the Second Account

Read-only review of the planned refinements (section 11 and 13 of `research.md`, N1-N8 of `review-fable-5-2.md`) against `.skilled/repo-rules/prevent-overengineering.md`. Paths below are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot.

The plan should ship three phases, not five. Two of the five planned changes are fixes nobody needs today, and only a third of the sixteen items survive as shipped work:

1. R2, the crash fallback, cut down to the one shared catch.
2. N3, cut down to removing the advisor's own echoed lines before scoring.
3. R3's benchmark with R5 folded in as a counter in the existing calibration bench.

N1 becomes a one-line doc fix. N6 and R4 are dropped. R6 stays research, with N2 and N8 folded into it. Everything else is cut.

I read every code path cited below. I did not re-run the reviewer's live probes. Crash frequency is unmeasured because reading the diagnostics file in the temp directory needed an approval I did not get.

## Group 1: ship, reduced to the smallest form

**R2 crash fallback. SHRINK.**
- **Real today, but narrower than written.** The producer catches its own faults and returns `fail_open` (`runtime/lib/skill-advisor-brief.ts:593-597`). The hook already turns that into a visible outage line (`hooks/claude/user-prompt-submit.ts:389`, `runtime/lib/render.ts:633-657`).
- **What the silent catch still covers.** The catch at `user-prompt-submit.ts:468-479` returns `{}`. It is reached only by faults in the hook's own steps: finding the workspace root (`:344`), rendering (`:387`) and the policy observer (`:460`).
- **Failure prevented.** A bug in render or root-finding drops the route and the comment-hygiene directive with no sign to the model.
- **Smallest fix.** In that catch, render the timeout fallback inside a nested try and return it as `additionalContext`. Copy the OpenCode pattern at `.opencode/plugins/system-skill-advisor.js:1577-1598`.
- **Why one edit is enough.** Pi (`hooks/pi/prompt-advisor.ts:316-317`), DSH (`hooks/dsh/prompt-advisor.mjs:174`) and Vibe (`hooks/vibe/prompt-advisor.mjs:241`) pass `additionalContext` straight through, so this covers four runtimes.
- **Test.** One: inject a throwing `renderBrief` (the dependency exists at `:359`) and assert the fallback text comes back.
- **Defer the adapter catches** (Pi `:323-324` and the missing `else` at `:285`, DSH `:181-184`, Vibe `:244-246`). They fire only when importing the built module fails (Pi `:76-77`, DSH `:17-18`, Vibe `:32-33`). In that case the renderer lives in the module that failed to load, so a fallback would need a duplicated hardcoded string. Nobody has named an environment where that import fails.

**N3 strip pasted context. SHRINK.**
- **Real gap.** My search of `prompt-policy.ts`, `skill-advisor-brief.ts` and `prompt-cache.ts` found no stripping of any kind. The only cleanup is a byte cap (`user-prompt-submit.ts:174-193`).
- **Failure prevented.** The reviewer's probe showed an echoed advisor line flipping the top skill. That probe ran the scorer, not a hook (I did not re-run it).
- **Smallest fix.** Strip the advisor's own output lines before scoring. Their format is exact and the advisor owns it (`render.ts:605`, `:618`, `:657`). Add one corpus row.
- **Cut "discount skill names in pasted spans".** Without a reliable paste delimiter in the hook input, that is a guess. Whether hosts pass their paste markers through to the hook is INFERRED and unchecked.
- **Placement matters (see the underengineering section).**

**R3 follow-up guard plus N4. KEEP R3 gated, MERGE N4 into it as a deferred option.**
- **Real behavior.** "fix that too" fires through the work-intent rule (`runtime/lib/prompt-policy.ts:182`). The scorer sets `confidenceFloored` at `runtime/lib/scorer/fusion.ts:1383-1400`.
- **Failure prevented.** A three-word follow-up gets a confident route unrelated to the session's task. Whether that harms real sessions is unshown, which is why the benchmark comes first.
- **N4's premise is false outside Vibe.** The directive-lifecycle store keeps only the directive text, not the route (`hooks/lib/directive-lifecycle.ts:98-104`). Only Vibe stores the last route (`vibe/prompt-advisor.mjs:168-188`).
- **So N4 adds new per-session state on three runtimes.** Build it only if the benchmark shows the simple guard over-suppresses. The simple guard: the top pass is floored and the policy reason is work-intent, so emit nothing.

**R5 floored-confidence count. SHRINK and MERGE into R3's benchmark.**
- The calibration bench calls the scorer directly (`runtime/bench/scorer-calibration.bench.ts:18`, `:202`). It can count floored passes with no change to the schema or the diagnostics.
- Drop the "in diagnostics" half. Nothing reads it.

## Group 2: no code, or a doc line only

**N1 threshold env override. SHRINK to a doc fix.**
- **What is broken.** The value is read once when the module loads, in the daemon process (`fusion.ts:72`, `skill-advisor-brief.ts:125`). That explains why the reviewer's CLI probe never saw the override (INFERRED, confirmed only by restarting the daemon with the variable set).
- **No real caller.** My search found the variable only in `contract.ts:26,32` and `system-spec-kit/runtime/ENV-REFERENCE.md:382-383`. Nothing sets it, and a per-request override already exists (`runtime/handlers/advisor-recommend.ts:512-515`).
- **Fix.** Say in `ENV-REFERENCE.md` that the daemon reads it at start, or remove the knob.
- **The planned output field, warning and schema bump fail §4 Options.** No two callers need different values today.
- **The knob is also half-wired.** `render.ts:530-539` treats a recommendation as passing if the daemon already passed it, or if it clears the threshold read in the hook's own process. Raising the value in the hook's environment therefore does nothing, and lowering it lets more pass.

**N6 closed error code at the catch. CUT.**
- The existing codes describe subprocess faults (`runtime/lib/metrics.ts:26-38`). A programming error in the hook would classify as `UNKNOWN` anyway.
- The fixed detail string at `user-prompt-submit.ts:477` already makes R2's path countable.

**R1 emit-time history rule. CUT as phase work.**
- It governs a history view that does not exist. Reopen it only if R4 is ever built.

## Group 3: research only, no phase

**R6 shadow tie-break. KEEP as research, with N2 and N8 merged in.**
- N2 corrects R6's design: a single `choice` question, which the Jev transport already supports (`cli-classifier/shared/scripts/jev-transport.mjs:4-5`, `:606-611`). No failure today. It needs operator consent before any prompt leaves the machine.

**N8 budget gates. SHRINK and MERGE into R6.**
- If a paid run is ever approved, use one explicit opt-in and a hard request cap. My search of `cli-classifier` found neither today. The other two gates wait for a multi-run benchmark.

## Group 4: cut

1. **R4 debug "why" fields.** Nothing would read them. Adding them means changing the closed validator (`metrics.ts:415`) and the persistence path (`:460`) for an investigation nobody is asking for. `dominantLane` is already in the CLI output (`advisor-recommend.ts:264`).
2. **R7 per-session flip rate.** It needs a new persisted session key, and no decision depends on the number. If it is ever wanted, a counter at Vibe's existing comparison (`vibe/prompt-advisor.mjs:185`) costs nothing new.
3. **R8 `acceptable` label class.** No case was shown where the ratchet scored a near miss wrongly and blocked a change.
4. **N5 status-line segment.** `.pi/statusline.sh` has no advisor segment, but no missed outage was shown. It would be a new surface on every runtime.
5. **N7 real-host Pi test.** It needs a Pi SDK dev dependency for drift no incident has shown. §4 Dependencies applies.

## Phases

Planned order: R2, N1, N3, R4 with R5, then R3. Changes:
- **Drop N1 as a phase.** It is a one-line doc edit and can ride with any commit that touches the docs.
- **Drop the R4 plus R5 phase.** R4 is cut and R5 moves into R3's benchmark.
- **Keep R2 first.** It is the cheapest change and the code is fully confirmed.

The minimum list is the three phases at the top.

## Additions no current failure earns

- **N1:** a threshold-source output field, a new warnings entry and a schema bump.
- **R4:** four new persisted diagnostic fields plus the validator change.
- **R5:** a runtime diagnostics counter. The bench-only counter is enough.
- **R7:** a session key on the diagnostic record.
- **N4:** route receipts on Claude, Pi and OpenCode, which is new per-session state on disk.
- **Group 3 and 4 extras:** status-line segments on every runtime (N5), a Pi SDK dev dependency (N7), and four budget gates where two cover the risk (N8).
- **R2:** fallback paths in the three adapter catches. No environment where the import fails has been named.

## Where the plan is too small

1. **R3 cannot be built as written.** `confidenceFloored` stops at the scorer: it is in neither the handlers nor the output schema. The policy reason is attached only to skipped prompts (`skill-advisor-brief.ts:437-440`). So the guard needs that flag passed through the output, or the guard must run inside the daemon. The plan names neither.
2. **N3's placement.** The strip has to happen in the shared producer, before the cache key is built. Putting it in the Claude hook's `normalizePrompt` (`user-prompt-submit.ts:174`) would cover only the runtimes that load that handler. Whether the OpenCode plugin reaches the same producer is INFERRED and unchecked.

## What you can do

Run this to learn whether R2's catch ever fires. If the count is zero over a long log, R2 is a guard against a fault that has not happened, and it can wait behind N3:

`grep -c "Unhandled UserPromptSubmit hook exception" "$TMPDIR"/speckit-skill-advisor-metrics/*-diagnostics.jsonl`

## Orchestrator Verification

The orchestrator re-checked the load-bearing claims on 2026-11-18.

- **Confirmed:** the producer catches its own faults and returns `fail_open` (`runtime/lib/skill-advisor-brief.ts:589-597`).
- **Confirmed:** both thresholds are read once at module load (`runtime/lib/scorer/fusion.ts:72`, `runtime/lib/skill-advisor-brief.ts:125`). A per-request override exists (`runtime/handlers/advisor-recommend.ts:512-515`). Outside docs, only `runtime/lib/compat/contract.ts` names the variable.
- **Confirmed:** `confidenceFloored` appears only in the scorer (`fusion.ts:1383-1400`, `ambiguity.ts:73`, `types.ts:174`), not in the handlers or the output. R3 needs that flag carried through.
- **Confirmed:** the directive-lifecycle record stores directives, not the route (`hooks/lib/directive-lifecycle.ts:96-104`).
- **Crash count run:** 187 diagnostics files, 8,211 records, 0 `Unhandled UserPromptSubmit hook exception`, 0 `UNCAUGHT_EXCEPTION`, 108 `fail_open`. R2's silent catch has not fired in the retained log.
- **Contradicted, N3 shrink is too small:** a plain-prose pasted reply, not in the advisor's output format, still flips the route. `Refactor the session store module to remove duplicated locking code` alone gives sk-code first at 0.82. Prefixed with `Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now:`, it gives sk-doc first at 0.9268. Stripping only the advisor's own lines would not fix this case. N3 stays a real gap, but its smallest fix is still undesigned.
