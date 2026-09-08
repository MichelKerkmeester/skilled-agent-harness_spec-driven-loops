# Iteration 6: Evidence the index is consulted; second-order consumers; wrapper and utilization tooling

## Focus

Complete the "is the index consulted or dead?" question with the full consumer census (deep-loop references, all seven agent docs, doctor, YAML assets), verify the rg-wrapper implements conventions §5's rank tuple, and score the utilization of the two auxiliary retrieval tools (`measure-cold-lookup.mjs`, `sweep-memory-residue.mjs`).

## Findings

| # | path:line | Claimed vs actual | Severity | Recommendation |
|---|-----------|-------------------|----------|----------------|
| F6.1 | second-order consumer census | Claimed: retrieval is load-bearing beyond search.md. Actual: `retrieval-conventions.md` is referenced by deep-loop (`deep-research/references/guides/quick-reference.md:60,229`), and by **seven** agent surfaces (`.opencode/agents/{debug,deep-improvement,context,deep-review,ai-council,deep-research}.md` + mirrors): each carries the identical "Daemon-free retrieval" block with the flag-correct lookup invocation and the lexical-only disclaimer. `context.md:75` and `ai-council.md:128` additionally read `runtime/data/trigger-index.json` directly (Bash-denied agents). The index is consulted by agents, commands, doctor, tests, and docs. **Not a dead surface.** | P2 (positive) | Document. |
| F6.2 | `.opencode/agents/context.md:75` | Claimed: "run the ripgrep recipes … through the Grep tool **and read the trigger-index.json directly**". Actual: reading a 3.8 MB JSON into a Bash-denied agent's context on every retrieval is a real context-budget cost, and the file contains no query-relevant structure (35k phrase keys + postings). The keyed lane's documented access path for Bash-denied agents is brute-force ingestion. | P2 (utilization) | Recommend: a slimmer published artifact for agent consumption (e.g. paths-only list), or document that context.md should prefer the Grep lane and treat the index read as last-resort. |
| F6.3 | `rg-wrapper.mjs:4-31` + empirical run | Claimed: wrapper applies §5 rank; refuses mode combination; reads exit status. Actual: `search()` (`:178-230`) runs one recipe, maps `error` outcome with stderr; `rankMatches` (`lib/rg-lane.mjs:380-411`) implements the tuple — evidence field (`trigger_phrases` → `title-or-description` → `anchor-marker` → body), then match-class order (`rg-lane.mjs:427` exact/phrase-containment/query-containment/token-overlap/partial), then path, then line. Spot-checked `path` recipe exit 0 with 3 paths at packet scope. Wrapper is a faithful §2+§5 front door. | P2 (positive) | Document. |
| F6.4 | `rg-wrapper.mjs:270-273` (`--root` semantics) | Claimed (usage header): `[--root <dir>]` — a search-root override. Actual: `--root` sets the wrapper's **cwd** (`main()`: `cwd: args.root ? path.resolve(args.root) : process.cwd()`), while `--search-root` appends positional search roots. With `--root specs`, the child ripgrep receives roots `specs .opencode` resolved against `<repo>/specs` — both missing → exit 2 error surfaced with stderr. First probe ran exactly this and read the error. The flag name invites the wrong mental model (I initially read it as root-override), and the error output is honest but the flag is a trap for any caller expecting `--root` to narrow scope. | P2 | Fix: rename `--root` to `--cwd`, or document the distinction at the usage header; `--search-root` is the scoped flag callers actually want. |
| F6.5 | `measure-cold-lookup.mjs:1-40` | Claimed: cold-start latency harness with auditable discard, exit 1 over budget. Actual: full harness (spawnSync per sample, warmup discard, percentiles, 200 ms budget); produced the committed `latency-report.json`. But **zero callers** reference it outside `retrieval/` itself — no doctor yaml, no AGENTS/CLAUDE quick-reference, no workflow wires it. It is an accepted-once acceptance tool now orphaned from any recurring gate. | P1 (unused enforcement surface — the one automated freshness/latency check that exists is not wired into any recurring run) | Recommend: wire into doctor-speckit-retrieval's optional checks or a CI task; or document as acceptance-only in retrieval/README.md (verify). |
| F6.6 | `sweep-memory-residue.mjs` | Claimed (charter): a retrieval-side tool. Actual: 24 KB residue scanner for retired memory-database terms; **zero external callers** (grep across .opencode docs/assets). Same orphaned-tool pattern as F6.5. | P2 (unused; but one-shot residue sweeps are naturally ad hoc) | Recommend: document as one-shot acceptance tool in README.md, or fold into the doctor's residue check if one exists. |
| F6.7 | `rg-wrapper.mjs:149-166` (`assertRecipeParity`) | Claimed: parity assertion keeps wrapper recipe and shared lane from drifting. Actual: present and exported; compares sorted flag argv of builder vs lane for all three recipes. This is the mechanical answer to F3.2-style drift *inside* the wrapper — but no equivalent guard ties **search.md's inline recipe** to conventions §2.1 (the doc-level drift found in iter 3), because a markdown block has no assertable runtime. | P2 (positive + gap note) | Document; note the doc-level recipe drift (F3.2) has no mechanical guard and needs a doc-check or the pointer fix. |
| F6.8 | `retrieval-conventions.md` §5 vs `lib/rg-lane.mjs:427` | Claimed (§5 tuple): evidence field, then "normalized match class: exact phrase, then phrase containment, then token coverage". Actual code order: exact, phrase-containment, **query-containment**, token-overlap, partial — the doc's 3-class summary compresses the 5-class ladder the code implements. Minor doc-code vocabulary mismatch (presentation §3 uses yet another 3-class set: exact/containment/token-coverage — see F3.4). Three documents, three class vocabularies, one implementation. | P2 | Fix: one canonical class ladder in conventions §5 (list all five), and have search-presentation §3 reference it. |

Ruled out: "wrapper ignores exit 2 on --root misuse" (verified error path prints command+stderr and exits ≥2 — the EXIT=0 in my first probe was the pipeline's `head`, not the wrapper); "measure-cold-lookup wired in doctor yaml" (read the yaml's checks — mtime/size probe only).

## Sources Consulted

- `.opencode/agents/{debug,deep-improvement,context,deep-review,ai-council,deep-research}.md` (retrieval blocks)
- `.opencode/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:60,229`
- `rg-wrapper.mjs` (full read, usage header + parseArgs + main), `lib/rg-lane.mjs:303-435`
- Empirical: wrapper `path` recipe at packet scope (exit 0, 3 paths); wrapper `--root specs` misuse probe (exit 2 error path observed)
- `measure-cold-lookup.mjs` (header + usage), `sweep-memory-residue.mjs` (existence, caller grep)
- `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml:148-149` (probe inventory)

## Assessment

- newInfoRatio: 0.7 — F6.4 (flag trap), F6.5/F6.6 (orphaned tools), and F6.8 (three-vocabulary mismatch) are new; F6.1/F6.3 confirmations extend iter 4's census.
- Novelty justification: the wrapper flag-semantics finding and the no-recurring-caller findings are first evidence here; the class-vocabulary triple-mismatch consolidates iter 3's presentation finding into a cross-doc pattern.

## Reflection

- Worked: running the wrapper's misuse path (rather than only reading it) caught my own pipeline misattribution before writing the row — exit codes must be read from the process, not a pipeline stage.
- Failed: nothing; census method is now routine.
- Ruled out: see above.

## Recommended Next Focus

Iteration 7: removal/merge candidates — full inventory of `retrieval/` files vs documented capability (retrofit-convention.mjs 48 KB utilization, fixtures trio size/benefit, README accuracy), plus severity roll-up of P1s for the ledger.
