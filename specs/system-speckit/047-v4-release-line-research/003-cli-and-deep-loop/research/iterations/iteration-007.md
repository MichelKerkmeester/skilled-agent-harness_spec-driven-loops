# Iteration 007 — Over-engineering census of `system-deep-loop`

## Focus

Census six nominated over-engineering candidates in `.skilled/skills/system-deep-loop`, count live
**production** callers for each (tests and `specs/` run artifacts excluded), name what breaks if the
surface is removed, and report a cut list with evidence. Two of the six premises under test were
falsified; four are confirmed.

## Actions Taken

1. Enumerated the runtime tree (`runtime/lib/**`, `runtime/scripts/**`, `deep-*/scripts/**`), excluding `node_modules`.
2. Counted production importers for each candidate with `rg` restricted to non-test, non-`specs/`, non-doc paths.
3. Resolved introduction commits with `git log --follow --diff-filter=A -- <path>`.
4. Read the definitions that settle reachability: `EXECUTOR_KINDS`, the substrate port, the reducer section registry, the fan-out telemetry writers.
5. Cross-checked the auto vs confirm command variants for the idea-lifecycle step.

Method note: two of my own scans produced false negatives before being corrected, both recorded in
F7 below, because a false "surface is absent" is exactly the shape of a wrong cut recommendation.

## Findings

### F1 — `if_cli_copilot` branches are unreachable dead branches · P1 · over-engineering

Three `if_cli_copilot` branches exist in the deep command assets:

- `[SOURCE: .skilled/commands/deep/assets/deep-review-confirm.yaml:1317]`
- `[SOURCE: .skilled/commands/deep/assets/deep-research-confirm.yaml:1190]`
- `[SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:1239]`

No executor can ever reach them. The registered vocabulary is
`[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11]` —
`native`, `cli-codex`, `cli-claude-code`, `cli-opencode`, `cli-cursor`, `cli-devin`, `cli-pi`,
`cli-deepseek-harness` — and `copilot` is not in it. Config is validated against that enum at
`[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:82]`, so a config
naming `copilot` is rejected at parse time rather than merely unsupported downstream. Consistently, no
`cli-copilot` skill directory exists under `cli-external-orchestration/` (only the seven kinds above).

**What breaks if removed:** nothing. The branches cannot be selected; removing them changes no
dispatch. Conditional on the kind being added later, the branch would need re-authoring from the other
`if_cli_*` branches, which is the cheaper direction of work. **Confidence:** high (schema-enforced
enum). **Verify:**
`rg -n "if_cli_copilot" .skilled/commands/deep/assets/*.yaml` then
`sed -n '11,21p;82p' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`.

Note the asymmetry: three of the four variants carry the branch; `deep-research-auto.yaml` does not.
A dead branch that half the variants lack is the strongest single signal of copy-drift rather than intent.

### F2 — the wave orchestrator is dark: 3,117 LOC with no production caller · P1 · over-engineering

`runtime/lib/branch-leases-waves/` totals 3,117 lines and has **no production importer outside its own
directory**. The only inbound references are type-only imports, which are erased at compile:
`[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/conditional-fanin/types.ts:19]` and
`[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/mode-contracts/substrate-ports.ts:10]`. The
substrate port declares the collaborator at
`[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/mode-contracts/substrate-ports.ts:72]`
(`readonly branchLeasesAndWaves: DurableBranchOrchestrator`), but nothing implements
`DurableBranchOrchestrator` outside its own module — `rg "implements DurableBranchOrchestrator"`
returns zero production hits. The class and its planner exist and are fully formed
(`[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts:249]`,
`[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/branch-leases-waves/wave-plan.ts:60]`) and are
exercised only by `runtime/tests/unit/branch-leases-waves.vitest.ts`.

Introduced by `c8943e4d9f 2026-07-21 feat(deep-loop): add durable fan-out/fan-in orchestration, dark
(036/009)` — the commit message itself declares the surface dark.

**What breaks if removed:** no production path. The port field at `substrate-ports.ts:72` becomes
dangling and must drop with it, and `branch-leases-waves.vitest.ts` plus the `conditional-fanin` type
import must go too. **Confidence:** high for "no production caller"; the surface is reachable only from
its own tests. **Verify:**
`rg -n "branch-leases-waves|durable-orchestrator" --glob=!**/tests/** --glob=!specs/** --glob=!**/branch-leases-waves/** .`

### F3 — `reference_only_appendix.wave_orchestration` is prose with no code reader · P2 · over-engineering

The appendix key appears in four assets (`[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:2483]`,
plus `deep-research-confirm.yaml:1868`, `deep-review-auto.yaml:2615`, `deep-review-confirm.yaml:2062`).
`rg` for `reference_only_appendix` across all `.cjs`/`.ts`/`.mjs` returns **zero** hits: no script or
runtime module reads the key. Its `wave_orchestration.summary` is natural-language instructions
("Dispatch up to 3 parallel agents…") that nothing executes, sitting beside F2's unexercised engine.

**What breaks if removed:** nothing machine-readable. A human following the command asset loses three
sentences of advisory prose. **Confidence:** high for "no code reader"; medium for whether the workflow
engine treats unknown top-level keys as significant. **Verify:**
`rg -n "reference_only_appendix" --glob='*.cjs' --glob='*.ts' --glob='*.mjs' .`

### F4 — `orchestration-status.log` duplicates `observability-events.jsonl` · P2 · over-engineering

Two telemetry streams are written per run. The structured one is written by the fan-out runner and its
peers (`[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:519]`,
`status.cjs:34`, `convergence.cjs:41`, `round-state-jsonl.cjs:22`). The second, the plain status ledger,
is declared as a run path at `[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:152]` and
written at `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3364]`.

Observed run data shows the log line is a **strict subset** of the JSONL event: the JSONL row's
`payload` field carries the identical `{event,label,at,gauges}` object the log line records, and the log
additionally carries `index`/`attempt` while the JSONL carries the envelope (`event_id`, `schema_version`,
`producer`, `subject`, `observed_at_iso`). Every fact in the log is derivable from the JSONL; the reverse
is not true. I found no machine reader of `orchestration-status.log` in production code — the readers I
could confirm read the JSONL.

**What breaks if removed:** confirmed nothing; **unconfirmed** whether an operator or an external tail
consumes the log by convention. That is why this is P2 and not P1: the risk is operator habit, not code.
**Confidence:** medium-high. **Verify:** diff the two files in any
completed run directory (`research/observability-events.jsonl` vs `research/orchestration-status.log`),
then `rg -n "orchestration-status" --glob=!**/tests/** --glob=!specs/** .`

### F5 — the idea lifecycle is inert in the reducer and contradicted across variants · P2 · over-engineering

The reducer registers the idea events as no-ops with empty section lists:
`[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts:151]`
through `:158` map `idea_promoted`, `idea_observed`, `idea_rejected`, `idea_rejected_removed` and
`idea_rejected_reset` to `Object.freeze([])`, with an inline rationale at `:154` that the rejected-pattern
cache is rebuilt from the state log "not here".

Meanwhile the auto variant runs a rejected-pattern suppression step
(`[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1068]`) consuming
`registry.rejectedPatternIndex` and `registry.promotedIdeas` (`:1091`), and the confirm variant records
that its own `step_rejected_pattern_cache` is **deliberately absent** because `step_read_state` does not
extract those fields
(`[SOURCE: .skilled/commands/deep/assets/deep-research-confirm.yaml:1920]`).

So the same feature is live in one variant, documented-removed in another, and a no-op in the reducer that
both share. The confirm variant's own justification — a suppression list "the operator can judge directly
at gate_pre_iteration" — is an argument that the mechanism is redundant wherever it does fire.

**What breaks if removed:** the auto variant loses candidate suppression, which is a real behaviour change
for runs that accumulate rejected patterns. **Confidence:** high on the three-way contradiction; medium on
whether suppression has ever fired usefully. **Verify:** the three sed reads above, then
`rg -n "rejectedPattern" .skilled/commands/deep/assets/deep-research-*.yaml`.

### F6 — census results that **falsify** the removal premise (2 of 6)

- **Divergent pivot is live and load-bearing.** 26 production import sites across the four deep assets
  (`deep-research-confirm.yaml` ×7, `deep-review-confirm.yaml` ×7, `deep-review-auto.yaml` ×6,
  `deep-research-auto.yaml` ×6), plus both mode wrappers
  (`[SOURCE: .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:17]`) and
  `deep-research/scripts/reduce-state.cjs` ×2. Introduced `1eb7ace51b 2026-07-11`. **Not a cut.**
  Removing it removes the interactive pivot gate entirely.
- **Legacy projections and the legacy watermark path are live.** 4,559 LOC, imported in production by
  `mode-append-gateway/append-mode-event.ts` (including a `legacy-projection-${contract.artifactId}` run
  identity at `[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:676]`),
  `check-projection-coverage.cjs` (8 refs) and `verify-iteration.cjs`. The watermark directory is
  *written*, not just excluded: `shadow-projection-store.ts` emits
  `<artifactDir>/.legacy-projection-watermarks/<artifactId>.json`, `check-direct-append.cjs` enforces it,
  and two assets exclude it from `git add`
  (`[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:2387]`). Introduced `cbabd6bc4d 2026-07-21`. **Not a cut.**

### F7 — two of my own scans were false negatives · P2 · methodology

Both would have produced a wrong cut list, so they are reported as findings rather than footnotes.

1. `rg -rn "legacy-projection-watermarks"` printed `.n` for every match. `-r` is ripgrep's **replace**
   flag, not "recursive": it substituted `n` for each match. The surface appeared absent.
2. An earlier `rg "if_cli_copilot|cli_copilot|copilot" | head -25` returned nothing about the deep
   assets because `trigger-index.json` sorted first and filled the 25-line window. The count scan
   (`rg -o "if_cli_[a-z_]+" … | sort | uniq -c`) then found 3.

**Verify:** prefer counts (`rg -c`, `rg -o | uniq -c`) over truncated `head`; never pass `-r` without
meaning replace. **Confidence:** high — both are reproducible from this narrative's commands.

### Not reached this iteration

`deep-ai-council`'s own no-caller check is **UNKNOWN** — it was in the focus brief and I did not run it,
because the six nominated surfaces plus two falsifications consumed the iteration's call budget. It is
carried to Next Focus rather than asserted.

## Questions Answered

- "Over-engineering: which system-deep-loop runtime surfaces (divergent pivot, legacy projection, idea
  lifecycle, observability, wave planner) have no live caller or test, and what would break if each were
  removed?" — Answered, with the premise partly falsified: the **wave planner** (3,117 LOC) and the
  **`reference_only_appendix` wave prose** are dark; the **`.log` telemetry stream** is a redundant
  subset; the **idea lifecycle** is inert in the reducer and contradicted across variants. The
  **divergent pivot** and **legacy projections + watermark path** are live and must not be cut. The
  `if_cli_copilot` branch (not one of the six, found while checking them) is unreachable.

## Questions Remaining

- `deep-ai-council`: which of its scripts (`advise-council-completion`, `orchestrate-topic`,
  `replay-graph-from-artifacts`, `lib/rollback`, `lib/audit-trail`) have no production caller? Deferred.
- Does any external consumer (operator habit, tail, dashboard) read `orchestration-status.log`? Blocks
  raising F4 from P2 to P1.
- Is the idea-lifecycle suppression step ever expected to fire in the auto variant, or is F5 a
  half-migration? Needs a run-state sample, not more reading.
- Hub canon conformance (`package_skill.py --strict` across hub + seven modes), single-executor
  `if_cli_*` branch defects, and executor failure handling all remain open from prior iterations.

## Next Focus

Cut list, in removal order, with blast radius stated: **F1** (3 unreachable branches, zero risk) → **F3**
(prose-only key, zero machine risk) → **F2** (3,117 dark LOC plus one dangling port field) → **F4**
(drop one of two telemetry writers after confirming no external reader) → **F5** (needs a decision, not a
deletion: unify or retire across the three variants). Then close the deferred `deep-ai-council` caller
census so the over-engineering question is fully discharged rather than 6/7 complete.

## SCOPE VIOLATIONS

None. All writes are confined to the iteration narrative and delta files; every researched path was read
only.
