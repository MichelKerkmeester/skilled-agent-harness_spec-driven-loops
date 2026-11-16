# Iteration 7: What the process chain costs, and what the instrument leaves out

## Focus

Price the Node process chain on the built state and state the ceiling a collapse could recover. Segment one estimated 100-110 ms of a 205 ms Claude median as three Node starts; this pass measures the uncached path on the built state and checks how many processes a Claude prompt actually starts, including the hooks the advisor record does not time.

## Actions Taken

1. Split Claude's live rows by `cacheHit` and computed percentiles for each mode, because the uncached path is the one a process collapse would help.
2. Read the Claude `UserPromptSubmit` configuration to count every hook command the host runs and each one's timeout.
3. Composed the chain cost from the committed bare-Node start measurement and stated the recoverable ceiling.

## Findings

1. **Claude's uncached live path is p50 172 ms, p90 348, p95 618, max 1,538 ms over 529 rows.** The cached path is p50 30, p95 151, max 913 over 926 rows. The 2,500 ms budget holds at 4x the uncached p95. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl]

2. **A Claude prompt runs five Node processes, and the advisor record times three of them.** `.claude/settings.json` declares three `UserPromptSubmit` commands — the spec-kit shim, `spec-gate-classify.mjs` and `context-nudge.mjs` — each with `timeout: 3`. The shim then spawns the advisor hook, which spawns the advisor CLI, so the advisor path alone is three starts and the prompt pays two more hooks outside that path. [SOURCE: .claude/settings.json] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:21-22]

3. **At the committed 36.85 ms bare-Node start, the advisor's three starts are about 111 ms, or 64 percent of the uncached median.** Collapsing the CLI spawn and the adapter spawn would recover about 74 ms, 43 percent of the uncached p50. Both figures are estimates built on a start cost measured on this machine in an earlier segment, not on the built state. [INFERENCE: based on 3 × 36.85 ms against the 172 ms uncached p50] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md:78]

4. **The health record cannot price the whole prompt, because two of the three hook commands are outside it.** The advisor's `durationMs` covers its own leg; `spec-gate-classify` and `context-nudge` have no join to it, so a prompt's total hook latency is at least the advisor leg plus two more Node starts that no single record sums. [SOURCE: .claude/settings.json] [INFERENCE: based on three independent UserPromptSubmit commands and the advisor record's own start and end stamps]

5. **What would confirm the ceiling: one timing probe that runs the three configured hooks in the host's order.** Record wall time per command and total, then compare with the advisor leg alone. Absent that, 111 ms and 74 ms are ceilings, not savings. [INFERENCE: based on findings 2 and 3]

## Ruled Out

- Reading the advisor leg as the prompt's hook cost: two more hook commands run and are not in its record.
- Adding the three hook timeouts as a worst case: `timeout: 3` is a host kill, not a cost.

## Dead Ends

- The shim's compiled dispatcher could not be timed without running it, which this lane may not do.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: the uncached p50 172 ms is lower than segment one's 205 ms Claude median; the earlier figure was a mixed-population median from a different build, so both stand for their populations.
- Missing dependencies: no built-state bare-Node start measurement; the earlier 36.85 ms is carried.
- Partial success: the chain composition is measured from configuration, the cost is inferred. Status `complete`.

## Sources Consulted

- `$TMPDIR/speckit-skill-advisor-metrics/*.jsonl`
- `.claude/settings.json`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:21-22`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md:78`

## Assessment

- New information ratio: 0.75
- Questions addressed: KQ1's process-chain half, KQ5's coverage half
- Questions answered: none new

## Reflection

- What worked and why: splitting by cache hit produced the first honest uncached median of the segment and made the process-chain share computable.
- What did not work and why: the settings read initially looked like one hook; reading all three commands changed the coverage claim.
- What I would do differently: read the host's hook list before attributing a latency record to "the hook".

## Recommended Next Focus

Iteration 8: assemble the lane's per-prompt cost ledger — hook (cached and uncached), brief bytes and tokens, started-document tokens — per runtime, with each number's source and the one measurement that would confirm the inferred cells, then close the lineage.
