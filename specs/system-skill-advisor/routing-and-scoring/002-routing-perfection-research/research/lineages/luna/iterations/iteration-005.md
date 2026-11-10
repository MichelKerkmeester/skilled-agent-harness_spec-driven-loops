# Iteration 5 — measurement as gate — gpt-5.6-luna

## Focus

Turn the evidence into a gate that catches wrong-hub routing, reports no-reach telemetry, excludes bare common words, and cannot silently pass when the advisor probe is unavailable.

### What was read

- `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:1-18,20-35,37-66,68-118` in full.
- `specs/sk-design/018-sk-design-parent-v2/011-router-vocabulary-repair/scratch/fleet-reach-scan.md:1-74`, the supplied daemon-generation-679 fleet report.
- `specs/sk-design/018-sk-design-parent-v2/011-router-vocabulary-repair/scratch/why-a-checker.md:1-38`, the supplied argument for exhaustive probing and the wrong-hub/no-reach split.
- `specs/sk-design/018-sk-design-parent-v2/011-router-vocabulary-repair/scratch/reach-check-after.txt:1-15`, a concrete checker result.
- Prior lineage iterations and the worker prompt, including the fixed confidence bar and baseline totals.

### What was measured

The supplied full-fleet baseline at daemon generation 679 is 439 declared multi-word phrases, 19 wrong-hub observations, and 136 no-reach observations. The concrete `sk-design` report is:

```text
FAIL sk-design declared=77 wrong-hub=1 no-reach=10
wrong-hub decision branch sk-git=0.9452, sk-code=0.8200
...
checked=1 hub(s), wrong-hub=1, no-reach=10
RESULT: FAILED
```

The checker source shows four gate-relevant behaviors: it filters to multi-word phrases, calls the advisor serially with a 60-second per-call timeout, silently returns `null` on probe/JSON errors, and exits nonzero only when a recorded `wrong-hub` exists. `--limit` can truncate the phrase inventory.

### Findings

1. The checker’s inventory boundary is principled: it extracts the first `INTENT_SIGNALS` block, deduplicates quoted values, keeps phrases containing a space, and filters structural artifacts. This catches meaningful mode/leaf declarations while skipping bare one-word common vocabulary whose failure is generally a length/ambiguity issue. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:7-18,37-51`]
2. The existing dynamic taxonomy is the right semantic gate: a different above-threshold hub is `wrong-hub` and should fail; an empty above-threshold set is `no-reach` and should be reported for diagnosis. The supplied `sk-design` result proves the intended behavior with one hard failure and ten informational rows. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:80-118`; `specs/sk-design/018-sk-design-parent-v2/011-router-vocabulary-repair/scratch/reach-check-after.txt:1-15`]
3. The current implementation has a false-green failure mode: `reaches` catches advisor execution errors and JSON parse errors as `null`, and the main loop ignores null results. If the daemon is unavailable, the checker can emit no unreachable rows and `RESULT: PASSED` without proving any phrase. The sandbox’s observed `EPERM` socket failure demonstrates this is not hypothetical. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:54-65,74-93`; `.opencode/skills/system-skill-advisor/mcp-server/dist/mcp-server/skill-advisor-cli.js:1105-1124`]
4. Full-inventory proof must reject a truncated run. `--limit` slices the extracted phrase list before probing, so a CI invocation that accidentally supplies a limit can miss the very wrong-hub row that should fail. The gate should record the extraction count, require the complete inventory, and separately report the supplied baseline generation/source signature. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:68-78`]
5. The baseline trap is to make all no-reach rows hard failures or to freeze every confidence number as a golden route. The supplied report documents that many no-reach phrases are short fragments and that a checker failing on them stops being run; confidence can also vary with daemon generation. The stable assertions are inventory completeness, probe health, zero wrong-hub, explicit no-reach telemetry, and safe positive/negative categories. [SOURCE: `specs/sk-design/018-sk-design-parent-v2/011-router-vocabulary-repair/scratch/fleet-reach-scan.md:57-65`; `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:110-118`]

### Recommendations

1. [implementable today] Make probe errors first-class `probe-error` records and fail closed when any occur; never map an unavailable advisor to an empty result. Record the command, hub, phrase, error class, and daemon generation separately from `wrong-hub` and `no-reach`.
2. [implementable today] Require the full untruncated extracted inventory in CI: no `--limit`, a nonzero declaration count for every target hub, and a reported `(hub, phrase, owner, confidence, generation)` record for every probe.
3. [implementable today] Keep `wrong-hub` as the hard failure and `no-reach` as visible telemetry, while pairing the dynamic gate with the iteration-3 static stage-1 authorization report. Bare one-word declarations remain outside the hard-failure set.
4. [implementable today] Add safe positives and negatives: correct `visual audit`/`code review`/`/deep:review` ownership; wrong-hub cases `decision branch`, `audit the diff`, `review this screen`, and `review the documentation`; and no-reach informational cases such as `font size`, `critique this`, and `stack trace` until the scorer shape is repaired.
5. [needs a scorer change] After stage-1 authorization exists, require the scorer’s bounded phrase-anchor result to be evidenced in the dynamic probe; do not solve gate failures by lowering `0.8` or unioning all router strings.

### What this iteration could not settle

It did not implement the checker hardening or scorer phrase-anchor lane, and it did not obtain a fresh live daemon result because IPC returned `EPERM`. The exact CI command/sequencing can be chosen by the owning workflow after the invariant and probe-health contract are accepted.

## Sources Consulted

The full reach checker, supplied fleet and sample reports, worker prompt, and all four prior lineage iterations.

## Assessment

Question 5 is answered: the gate should be exhaustive over multi-word declarations, fail closed on probe errors and wrong-hub results, report no-reach as telemetry, and reject truncated inventories. Static owner-local stage-1 authorization and dynamic reach are complementary; compiled freshness is a separate gate.

## Reflection

The most dangerous measurement bug is not a noisy no-reach count but an unavailable advisor being treated as zero evidence. Probe health must be part of the result contract before any convergence or fleet claim is trusted. The five-iteration evidence now supports a synthesis that names the scorer seam, the contract seam, the compiled boundary, and the gate order.

## Recommended Next Focus

Phase synthesis: merge the five angle findings into a concise causal model, rank implementable versus scorer-change recommendations, preserve the max-iterations stop reason, and leave implementation outside this detached lineage.

