---
title: "Iteration 5: Adversarial completeness — citation audit, sibling corroboration, honest limits"
trigger_phrases: []
---
# Iteration 5: Adversarial completeness — citation audit, sibling corroboration, honest limits

## Focus

Re-verify the load-bearing citations from iterations 1–4 against the live tree rather than trusting them; check the sibling decommission packet for corroboration or contradiction of the taxonomy; audit write containment; name what this lineage did *not* verify.

## Actions Taken

1. Re-read ~20 cited file:line references against the current tree; corrected the three that were wrong (see Audit results).
2. Read the sibling pattern packet `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/` (named "Pattern reference" at the packet's own spec.md:196) — its goal.md and phase list.
3. Ran `git status --porcelain` and bucketed `git grep -l "system-skill-advisor/mcp-server"` for the final containment and closure check.

## Citation audit results

**Three citations corrected:**
- `--no-warm-only` flag: cited as `fallback.ts:242-246`; actual location is `runtime/dist/hooks/lib/skill-advisor-cli-fallback.js:148-150` — and the adjacent comment carries the mechanism verbatim ("the child env's prompt-time marker makes the CLI default to warm-only, which refuses with exit 75 and never starts anything — leaving every cold session with no brief at all"). Corrected in iteration-004 step 8 and strengthened: the file is the *fixed* code documenting the defect it repaired.
- `REPO_ENV_DEFAULTS`: cited as `launcher.cjs:83-91`; actual path is `.opencode/bin/system-skill-advisor-launcher.cjs:83-91` (the launcher moved to `.opencode/bin/`). Lines 83–91 confirmed carrying `SPECKIT_ADVISOR_DOC_TRIGGERS` and `SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT: 'trusted'` under the comment "a .env entry still wins, so an operator can override". Corrected in iteration-004 step 2.
- `fanout-run.cjs`: the runner is `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, and the cited finding needed updating — the `--convergence-mode` gap is **now repaired**: `normalizeConvergenceMode` is called at :2644 and threaded into params at :1361/1430/1452. The fix's own comment at :191-196 records the hiding mechanism verbatim ("the runner never read the flag... Only the stop policy reached the leaf, which happens to produce the same no-early-stop behaviour and hid the gap"). Corrected in iteration-004 step 21. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:191-196,2644]

**Verified exact (unchanged):** `skill-advisor.cjs:22-23` (`mcpServerDir` resolving `runtime/`); `caller-context.ts:6-10` (the "Only 'stdio'" comment); `route-contract.test.cjs:141-142` (`!includes('mcp__system_skill_advisor__')`); spec-kit shim `user-prompt-submit.ts:19` (`TARGET_REL` → `runtime/dist/`); `007 spec.md:156` ("Run every command a document tells a reader to run") and :172-176 (three sweep exemptions); `goal.md:81` ("each caller's own helper proven too"); `goal.md:114-117` (phase table); `goal.md:144-148` (deviations rows); `008 acceptance-criteria.md:60-68` (AC-005–008 rows, "87 live files at first measurement, now zero; 24 historical") and :89-97 (closure statement, plugin naming kept); `latency-delta.md:32-34,56-58` (two-baselines and "flattered the change"); `skill-advisor-cli.ts:390-394` (`defaultWarmOnly` ← prompt-time markers); `advisor-recommend.md:6` (`"mcp recommend tool"` trigger phrase); `daemon-cli-reference.md` (spec-kit references/cli/:164 — "no MCP server to fall back to"); `bin/README.md` (daemon-backed CLI shims section — "registers no MCP server"); `baseline.md:40-45,70-74` (3008 ms vs 926 ms; "No stateless prototype needs to be built"); `warm-mechanism.md:22-24,60-63` (MCP client starts the daemon today; Pi gap recorded); `protocol-contract.md:41-46,129-135` (D1/D7 conflict; bespoke-protocol rejection).

## Sibling-packet corroboration — `017-memory-database-decommission`

The sibling migration (spec-memory MCP subsystem → committed trigger index + ripgrep, cited as this packet's pattern reference) independently produced the same taxonomy — and one member of it the advisor packet did not hit:

- **Assertion residue at larger scale**: "214 hits in 115 live files that still presented the memory database, daemon, server, tools or retired commands as existing were swept by area" — after its token sweep already read zero. Same class C1, same miss-then-claims-hunt shape. [SOURCE: file:specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/goal.md:143]
- **Removal breaking code seams, not just docs**: "two code seams the removal broke were repaired: the embedding client's spawn-authority guard and doctor:update's first phase" — a doctor surface again (corroborates C4), plus a spawn-authority seam (the sibling's version of the advisor's socket-scope-digest defect: shared infrastructure assuming the removed caller). [SOURCE: file:same goal.md:143]
- **The literal-zero criterion itself was the trap**: the sibling's AC was amended — "closed on the reading that no live instruction surface remains rather than on a literal zero. The 17 are the residue sweep itself, three dated changelogs and one benchmark report, one negative-guard test, this packet's own documents and one historical packet." The advisor packet's AC-007 wording ("87 live files… zero; 24 historical files keep the old name by design") is the corrected form of the same criterion. A literal-zero criterion is unfalsifiable-by-design once kept evidence exists — writing the buckets *into* the criterion is the fix. [SOURCE: file:same goal.md:94,129]
- **Classify-before-editing at scale**: 22,094 documents classified with zero unclassified, 10,210 rewritten across 14 tracks, `verify-preimage` 22,094/0 mismatches, "a second run wrote 0" (idempotence proof). Checklist step 15 corroborated at ~27× the advisor packet's scale. [SOURCE: file:same goal.md:117]
- **A bucket member this packet didn't need**: the residue sweep's *own documents* contain the retired tokens (they must, to name what they hunted). Same keep-class as negative guards.

## New finding — inter-loop artifact hygiene (why this lineage's binding rule exists)

The goal deviations table records: "The research lineage was failed by another loop's leftovers — write containment found 19 untracked paths and reverted the research lineage on them; all 19 belong to the review's output, left uncommitted from the earlier run. Committing a loop's artifacts before starting the next one is the fix." This is the direct provenance of this lineage's containment binding ("this packet has already lost work that way twice"), and it generalizes: **an uncommitted loop output is a landmine for the next loop** — residue class C10 extended across loop boundaries. [SOURCE: file:goal.md:146]

## Containment audit (this lineage)

`git status --porcelain` over the whole repo shows exactly one untracked entry — `?? specs/system-skill-advisor/025-mcp-decommission-cli-front-door/011-deep-research-swe-2/` — the runner-scaffolded phase folder containing this lineage. **Zero tracked files modified anywhere in the repository.** Every write this session landed inside the bound lineage directory. [SOURCE: command:`git status --porcelain` → single `??` line]

`git grep -l "system-skill-advisor/mcp-server"` → 820 files; filtered to exclude `specs/`, `changelog`, `benchmark` → **0 files**. The AC-007 "zero live" closure still holds on the live tree. [SOURCE: command:`git grep -l` bucketed]

## Honest limits (per the binding rules)

- **This lineage ran zero suite executions and zero timing measurements.** `validate.sh` and test runs were prohibited (they write outside the lineage). Every test count (860/872) and latency figure (819 ms hook warm, 1,566–1,812 cold) is cited as a *packet document claim* from 008, not an observation of this run. The binding rule says a green test proves nothing until output and exit status are read — none were read; none are claimed as this lineage's evidence.
- **Phase 010's research output was not read** (independence constraint). Any agreement between the two lineages is therefore convergent evidence, not copying.
- **C11's intentionality is a labeled hypothesis** — no packet document records whether "mcp recommend tool" trigger phrases were deliberately preserved as asker-vocabulary.
- **The 009 review report was read from its archive** — cited as packet evidence of what the defect hunt found, not re-adjudicated.

## Coverage check — the three questions

- **Q1 (latent failures)**: answered — four defects named at file with hiding mechanisms (socket-scope probe, budget clamp, unreachable-daemon semantics, warm-only→no-brief), plus three structural exposures (env blocks carried in declarations, cross-package shim path, Server-as-socket-handler) and three verification-system failures (invalid frozen inputs, sampled suites, unbound flag).
- **Q2 (residue classes)**: answered — eleven classes with a bucketing rule; the missed classes named (assertion residue; CI/corpus-outside wiring); sibling corroboration adds "the sweep's own documents" and the literal-zero-criterion trap.
- **Q3 (checklist)**: answered — 21 steps in five phases ordered by cost-of-failure-prevented, each citing a packet episode; sibling packet corroborates steps 13/15/17 and step 2's ordering.

## Ruled Out

- Reading phase 010's output for comparison: prohibited by the binding rules; independence is the point.
- Treating the corrected citations as iteration-4 defects: they were transcription errors in this lineage's own artifacts, found and fixed by this iteration — which is what an adversarial pass is for.

## Dead Ends

- `runtime/launcher.cjs` does not exist — the launcher lives at `.opencode/bin/system-skill-advisor-launcher.cjs` (found via `REPO_ENV_DEFAULTS` grep).

## Edge Cases

- The 820-file count includes the spec corpus (packet documents = packet-record bucket by rule) — the 0-file live count is the load-bearing number.

## Sources Consulted

- All re-verified citations listed above (live tree)
- specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/goal.md (lines 94,116-117,129,142-143)
- .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs (191-196, 2644, 1361/1430/1452)
- .opencode/bin/system-skill-advisor-launcher.cjs:83-91
- git status --porcelain; git grep bucket counts

## Assessment

- New information ratio: 0.55
- Novelty justification: Mostly verification, but produced three genuinely new items — the sibling corroboration (with a bucket member this packet lacked), the inter-loop artifact-hygiene lesson, and the discovery that the fanout flag gap has since been repaired.
- Confidence: high — the audit's method was re-reading the tree, not trusting citations.

## Reflection

- What worked and why: adversarially re-reading my own citations caught three transcription errors that a summarizing pass would have propagated into research.md.
- What did not work and why: nothing material.
- What I would do differently: cite full repo-relative paths from the start — all three errors were short-path citations that hid wrong locations.

## Recommended Next Focus

Synthesis — research.md answering all three questions; resource-map; registry and dashboard finalization; terminal state record with `stopReason: "maxIterationsReached"`.
