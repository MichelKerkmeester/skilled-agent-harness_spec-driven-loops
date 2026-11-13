# Iteration 5: Overlap audit, aggregate gain and the one measurement gap

## Focus
Consolidation. This iteration audits every performance recommendation against phases 005 to 008 for overlap, computes the aggregate expected gain across the six runtimes, names the one measurement still missing, and states which directions are declined with a reason. It adds no new source reading beyond the audit of the four phase plans and the growing pre-arm log.

## Actions Taken
1. Re-read the 005 to 008 plans and tasks for any process, keep-alive, warm-up, cache or read-cost work.
2. Compared each recommendation with the four phases' stated scope and their explicit non-goals.
3. Summed the measured per-prompt savings across the runtimes by process count.
4. Read the current pre-arm summary to separate a latency gap from a behaviour gap.
5. Wrote the final recommendation table with file, gain and verification for each row.

## Findings
1. The overlap audit finds no duplicate: phase 005 changes fields and the brief head, phase 006 changes the Gate 2 text and pointers, phase 007 measures behaviour, and phase 008 adds embedder visibility, a 750 ms wrapper deadline, doctor routes and guide text. None changes the hook transport, warms the daemon, adds `keep_alive`, or reports a command document's read cost. Phase 008 says outright that nothing preloads the model, so the keep-alive is a genuine miss rather than a repeat. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/spec.md:157] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/plan.md:76] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/005-recommendation-contract-and-brief/plan.md:58]

2. The aggregate per-prompt gain is two removed process starts on Claude: 205.09 ms median minus about 73.7 ms is roughly 131 ms, a 36% cut. Codex, Devin and Cursor lose one of their three starts, and OpenCode, Pi and DSH lose one of two. At the measured 36.85 ms per start, every runtime gains at least that much per prompt once the advisor hook is imported in-process and the CLI call becomes a direct bridge call. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/004-command-meaning-matching/scratch/hook-latency-after-3.json:1] [INFERENCE: 205.09 minus two measured 36.85 ms starts]

3. Warming the daemon at session start removes the only fail-open path this lineage found: the 2200 ms Claude child budget and the 2800 ms Codex adapter timeout are both shorter than the CLI's 5000 ms cold wait. The gain is bounded by the cap, not by a measured cold-start time, because no packet records how long a cold daemon start takes. [SOURCE: .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js:137] [SOURCE: .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js:12] [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:34]

4. The one measurement gap is that cold daemon start. Its procedure is a sandbox socket directory and a sandbox database, as the launcher tests already use, then five timed starts and a `hook-latency.mjs` run against a cold socket. That measurement belongs in an arena, not on the live daemon, and it is the first task of any phase that takes the warm-up recommendation. [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/011-observation-fixes/evidence/goal-reverify/reports/pi-433.md:1]

5. The performance work is upstream of command surfacing: the command head adds about 7 tokens and one start costs about 1,131 tokens, so no change in phases 005 to 008 is needed for cost. The only command-surfacing cost lever is the `ask` turn, and that is a UX decision the parent already made. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:557] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/spec.md:94]

6. Performance does not explain the cross-CLI behaviour gap. The growing pre-arm log scores claude 3 of 12, codex 0 of 12, pi 0 of 12, devin 2 of 12, opencode 4 of 9 and dsh 3 of 8, with one `COMMAND:` line in total, on a hook path whose cost is the same order on every runtime. The gap is a routing and instruction-following gap, which the cross-CLI lineage owns; this lineage records only that no latency explanation fits. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl:1]

7. Declined with reasons: a semantic cache (pays an embedding to decide a hit and risks a wrong route), cache persistence (the daemon recycles on build staleness), new precompute (both vector sets exist), brief trimming (54 tokens a session), a per-prompt token budget (the 80-token cap binds at 64), and a longer cold timeout (trades a fast fail-open for a 5 s stall). [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts:16] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:23]

## Ruled Out
- Any further cache or precompute project. The evidence does not support a payoff and the telemetry needed to justify one is off by default.
- A performance explanation for the uneven start rates across runtimes. The same hook cost applies to every runtime and the spread is behavioural.
- Re-opening the brief's token budget. The measured brief is below the cap and the constant block is already suppressed.

## Dead Ends
- Cold daemon start remains unmeasured inside the hard rules. Starting or stopping the live daemon is out of scope, and no existing packet records the number. The procedure is named instead of guessed.

## Edge Cases
- Ambiguous input: "aggregate gain" could mean per prompt or per session. Reported per prompt, because the session-level number depends on the prompt count.
- Contradictory evidence: Codex's host kills a hook at 3 s while its adapter passes 2800 ms; both are read from source and the lower one binds, so the finding uses 2800 ms.
- Missing dependencies: the cold daemon number. Named as the first task of the warm-up phase.
- Partial success: findings 1 to 3 and 5 to 7 are an audit of existing evidence; finding 4 is a procedure. Status is `insight` because the value is consolidation, not new external evidence.

## Sources Consulted
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/005-recommendation-contract-and-brief/plan.md
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/plan.md
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/plan.md
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/plan.md,spec.md:157
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/004-command-meaning-matching/scratch/hook-latency-after-3.json
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl (summary only)
- .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js:137
- .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js:12
- .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:34

## Assessment
- New information ratio: 0.45
- Questions addressed: the recommendation audit, the aggregate gain, the remaining gap
- Questions answered: none new; this iteration closes the set

## Reflection
- What worked and why: auditing the four plans line by line turned "probably not planned" into a citable overlap result, including the one place where 008 explicitly leaves the model cold.
- What did not work and why: the aggregate gain cannot be stated as a measured end-to-end number without the very code changes it proposes. It is stated as a sum of measured parts, which is the honest ceiling.
- What I would do differently: run the overlap audit before the detailed cost work, so the recommendation set is bounded earlier.

## SCOPE VIOLATIONS
None. No out-of-scope write was attempted.

## Recommended Next Focus
None. The five key questions are answered or declined with a reason, the recommendation set is audited against phases 005 to 008, and the only open item is the cold-daemon measurement, which the warm-up phase owns.
