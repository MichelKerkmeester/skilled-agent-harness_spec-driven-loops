# Iteration 2: Pricing the candidate fixes — cost, seven runtimes, dispatched child

## Focus

Take iteration 1's enforcement map and price the fix candidates named in the topic: a runner that owns the single-executor loop, `fanout-run.cjs` refusing or labelling a one-lineage run, a completion check on receipts and config status, wording in the command doc or `AGENTS.md`, and a hook. For each: what it costs, what it breaks, how it behaves on the seven runtimes, and how it behaves in a dispatched child. Focus taken from strategy Section 11 (Next Focus) verbatim.

This iteration also closes iteration 1's carried-forward blocking question: does the *correct* fan-out path write packet-level `config.status: complete`?

**Ambiguity resolved:** "the seven runtimes" has no definition in the packet. Read as the seven runtime agent directories the repository actually carries (`.opencode`, `.claude`, `.codex`, `.cursor`, `.pi`, `.devin`, `.dsh`), since that is the only seven-way split present. Deferred and recorded as a cost fact: the deep-research capability matrix tracks only two of them. [SOURCE: AGENTS.md] [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json]

## Actions Taken

1. Read the incident record in full and re-read the driver's call surface (`wc -l` = 267 lines; the calls it makes at lines 75, 132, 195, 225, 243, 267) to locate the exact boundary the incident crossed.
2. Read `fanout-run.cjs` at the argument/lineage-expansion boundary (3396–3456), the empty-lineage exit (3476–3493), the summary and exit-code path (4245–4290), `inputError` (125–129), and the config-name/session-reuse helpers (472–473, 630–646).
3. Traced `config.status` from creation to completion in the YAML: creation at `step_create_config` inside `phase_init` (356–357), the fan-out jump into `phase_synthesis` (217–219), and `step_update_config_status` (2340–2343).
4. Checked the cost of a hard one-lineage refusal against its real callers and fixtures: the two production call sites (research YAML 225, review confirm YAML 210), the stress suite's single-entry executor configs (165, 756, 794), and the unit suite's single-entry `parseFanoutConfig` cases (533, 642).
5. Read the hook layer's runtime matrix (`.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:53-58`) and confirmed which runtime agent directories exist, to price a hook fix across the seven runtimes.
6. Checked the "runner" option against what already parses workflow material: `render-command-contract.cjs` (contracts from a manifest, not step execution) and the runtime scripts listing.
7. Checked what the append gateway can and cannot refuse (`append-mode-event.cjs:198`, `:494`) to price a gateway-hosted gate.

## Findings

1. **The cheapest refusal has an existing precedent in the same file, in the same shape, at the same place.** `fanout-run.cjs` expands the lineage list at 3396 and then, immediately, enforces one policy in code before any spawn: a `stopPolicy=max-iterations` run whose lineage lacks a positive iteration cap is refused with `throw inputError(...)` naming the offending labels. `inputError` sets `code = 'INPUT_VALIDATION'`; the top-level catch emits `{status:'error', code:'INPUT_VALIDATION', error:<message>}` and exits non-zero. A one-lineage refusal is that block with a different predicate, so it costs one guard and no new mechanism. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3396] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:125] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4281]

2. **Doing it in the schema instead of at the boundary is the expensive variant, and it is the wrong layer.** `fanoutConfigSchema`/`parseFanoutConfig` is a shared contract, not a CLI policy: the unit suite exercises single-entry `executors` arrays to test containment defaults, churn thresholds, lag ceilings and `count` expansion (a documented behaviour is "count=1 keeps base label"), so a `.min(2)` there would invalidate well over a dozen existing assertions in one file alone. The policy the topic wants enforced ("two or more `--executor`, an `--executors` value, or `--count > 1`") is a *caller* rule stated in the command doc, and the caller rule belongs where the caller's arguments are read. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:533] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:642] [SOURCE: .skilled/commands/deep/research.md:125]

3. **A hard refusal cannot break a legitimate workflow path, but it does break three test fixtures — and that is the whole blast radius.** The only production callers pass a `config.fanout_json` that the command's own policy says must carry two or more lineages: the research auto YAML at 225 and the review confirm YAML at 210; the council reaches the same script. `fanout-salvage.cjs` does not construct executor lists. The one-lineage configs in the repository live in the stress suite (lines 165, 756, 794), where they exist to keep the pool cheap, not because the policy permits them; they would need `count: 2` or an explicit override flag. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:225] [SOURCE: .skilled/commands/deep/assets/deep-review-confirm.yaml:210] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts:165]

4. **A guard inside `fanout-run.cjs` is inert in a dispatched child, which is the cheapest possible child behaviour.** `fanout-run.cjs` is the parent-side lineage runner: the child prompt it writes forbids nested dispatch and instructs the child to run iterations inline, and the leaf contract bars spawning at all. Nothing in a lineage calls `fanout-run.cjs`, so the guard is evaluated exactly once, in the process the operator or workflow started, with no sandbox interaction and no per-runtime capability. Contrast a gate hosted in the append gateway, which every lineage *does* call. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1583] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3456]

5. **The hook option costs six separate runtime mechanisms and still delivers prose.** The advisor hook layer — the only prompt-time hook layer in the repo — is implemented per runtime: thin shims plus compiled handlers for Claude, Codex, Cursor and Devin, an in-process TypeScript extension for Pi, and a plugin with a different event surface for OpenCode. All six are prompt-time: they inject context into the model's view. A workflow-fidelity hook would therefore be six adapters (on seven runtime directories), each re-delivering the same instruction text, i.e. the prose control that already failed, at the highest maintenance cost of any candidate. The capability matrix that gates deep-research specifically records `hookBootstrap: true` for one of its two tracked runtimes. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:53] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:57] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:58] [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json]

6. **A runner that owns the single-executor loop is a new subsystem, not a wrapper, and nothing existing can be promoted into it.** No script under `runtime/scripts/` extracts the auto YAML's step blocks; the closest neighbours render *command contracts* from a manifest of legacy bodies (`MANIFEST_PATH`, the `COMMANDS` map), which is a documentation pipeline, not a step executor. The driver the session had to write is 267 lines that locate and bind YAML command blocks and then call `loop-lock.cjs`, `append-mode-event.cjs`, `convergence.cjs`, `verify-iteration.cjs` and `reduce-state.cjs` in order — a second template engine over the same 2,539-line source of truth. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:30] [SOURCE: specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/scratch/single-executor-driver.py:75]

7. **The carried-forward status question is answered: a correctly walked fan-out run does write packet-level `config.status: complete`, so the field is a valid discriminator — but a lagging one.** `step_update_config_status` sits inside `phase_synthesis` with no `skip_when`, and fan-out is defined as jumping *into* `phase_synthesis`, so the parent walker executes it on both routes; the packet-level config it edits is the same file `fanout-run.cjs` reads for session reuse. The incident's run left that file at `initialized`, which is exactly what a missing synthesis looks like. What the field cannot do is prevent anything: it is written at the end, by the route being questioned, and a legitimate early stop (stopped, failed, abandoned) also leaves `initialized`, so a status gate that fires on non-`complete` would alarm on honest aborts. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:2340] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:217] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:641]

8. **A gateway-hosted gate is the highest-blast-radius candidate and cannot stop a run even when it fires.** The gateway already refuses records and records the refusal in `gateway-refusals.jsonl`, deliberately *before* touching the ledger, and the refusal path is best-effort ("must not change the CLI result"). Every lineage and every mode calls it, so a new precondition there (for example "an iteration record requires a live lock in the run directory") would land on all three loop types, on crash-resume where the original lock is gone, and would surface as a refusal row the surrounding run is designed to ignore. It changes the record stream, not the route. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:198] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:494]

9. **The documentation candidate is not free — it is the same class of control that failed, and its cheap version is one sentence in two existing places.** The command doc's fan-out policy paragraph is where the incident's session read the rule and then violated it with a one-entry JSON; adding what fan-out does *not* do (`phase_init`, `phase_save`) beside that paragraph is a single edit with zero runtime cost on all seven runtimes, but it is prose and the incident is evidence prose did not hold. Its value is that it is the text the next session reads *at the decision point*, which no other candidate reaches. [SOURCE: .skilled/commands/deep/research.md:125]

## Questions Answered

- What are the candidate fixes (a runner that owns the single-executor loop, fanout-run refusing or labelling a one-lineage run, a completion check on receipts and config status, wording in the command doc or AGENTS.md, a hook), what does each cost and break, and how does each behave on the seven runtimes and in a dispatched child?

## Questions Remaining

- Which existing checks could have caught the incident before or after the run, and why did each not fire? (Iteration 1 answered the negative case; this iteration adds the positive half — the status field would catch it after the fact, the gateway cannot stop a run — but the four named checks have still not been tested against the driver path.)
- What is the smallest set of changes to existing files that keeps a chat-started loop on its workflow, how does it apply to deep-review and ai-council, and what should not be built? (Now priceable from Findings 1–9; not yet assembled into a recommendation.)

## Ruled Out

- **`fanoutConfigSchema.executors` minimum of two.** Wrong layer and expensive: it is the shared parse contract for tests, resume and the reducer, and single-entry arrays are used there for reasons unrelated to the policy. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:533]
- **A gateway precondition ("iteration record requires a live lock").** Fires on the incident's path, but reaches every lineage, every mode and every resume, and is designed to be non-blocking — it cannot stop a run. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:494]
- **A hook as the enforcement surface.** Six runtime-specific adapters, all prompt-time context injection; reproduces prose at maximum cost. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:53]

## Dead Ends

- **Promoting `render-command-contract.cjs` into the runner.** It renders command *contracts* from a manifest of legacy bodies; it never parses step blocks or executes a step. Sharing its importer would not shorten the driver.
- **A post-run completion assertion hosted anywhere in the runtime scripts.** Nothing in the incident's route calls a runtime script at the end, so a new assertion in any of them would inherit the same "not reached" property as every check iteration 1 mapped.
- **Labelling instead of refusing, by itself.** `fanout-run.cjs` already emits a summary the incident's session read; it read "succeeded" and moved on. A new label in the same object is not more visible than the fields already there. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4273]

## Edge Cases

- **Ambiguous input:** "the seven runtimes" is undefined in the packet. Read as the seven runtime agent directories; recorded that the capability matrix tracks two, so any per-runtime cost figure is a directory count, not a validated capability claim. Deferred: whether a Codex/Cursor hook could deny a tool call (not investigated; the repo has no such adapter).
- **Contradictory evidence:** none new. Iteration 1's unresolved contradiction (fresh-context-per-iteration prose vs in-process CLI lineage) still stands and is still recorded rather than smoothed.
- **Missing dependencies:** none. No network source was used; `resource-map.md` remains absent by config.
- **Partial success:** none material. The unit/stress test counts in Findings 2 and 3 come from reading fixtures, not from running the suites, so they are fixture-level costs, not verified test outcomes.

## Sources Consulted

- specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/scratch/incident-chat-started-loop.md
- specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/scratch/single-executor-driver.py:75, 132, 195, 225, 243, 267
- .skilled/commands/deep/assets/deep-research-auto.yaml:217-219, 225, 356-357, 2186-2196, 2340-2343
- .skilled/commands/deep/assets/deep-review-confirm.yaml:210
- .skilled/commands/deep/research.md:125
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:125-129, 3396-3406, 3456, 3476-3493, 4245-4290, 472-473, 630-646
- .skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:30-39
- .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:198, 417-424, 494
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:36
- .skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:533, 642
- .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts:165, 756, 794
- .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:53-58
- .skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json
- AGENTS.md (runtime agent directories, PLAN-WORKFLOW LOCK)

## Assessment

- New information ratio: 0.85
- Questions addressed: Q4 (candidate fixes: cost, blast radius, seven-runtime behaviour, child behaviour); Q1's carried-forward status sub-question
- Questions answered: Q4; the carried-forward `config.status` question

## Reflection

- **What worked and why:** pricing each candidate by walking to its *existing precedent* instead of describing what it would do. Finding the `stopPolicy=max-iterations` guard sitting six lines below the lineage expansion converted "add a check to fanout-run" from an open design question into a copy of an existing block, and it also fixed the layer question — the same file already distinguishes caller policy (boundary, `inputError`) from shared contract (schema). The same trick priced the hook option: reading the *hook implementation matrix* rather than the hook idea showed six runtime mechanisms behind one word.
- **What did not work and why:** trying to price the schema option by reading `executor-config.ts` directly. The feature catalog's symbol map (`fanoutConfigSchema` ~L304) did not match the region I read, so the line references were unusable and I fell back to the tests, which show the *consequences* of the schema change (single-entry fixtures) more reliably than the schema's own source does. Cost: two reads that produced no citable line.
- **What I would do differently:** count callers before counting costs. Two greps — production call sites of `fanout-run.cjs`, and single-entry `executors` fixtures — decided three of the five candidates at once; I did them fourth and fifth instead of first.

## Next Focus

**Recommended next focus:** assemble the recommendation and the do-not-build list, which is now fully priced: (1) a refusal-or-override guard in `fanout-run.cjs` at the lineage-expansion boundary, modelled on the existing `stopPolicy` guard, naming the single-executor path in its message; (2) one sentence beside the command doc's fan-out policy stating that the fan-out route contains no packet-level `phase_init` or `phase_save`, repeated in `deep-review`; (3) escalate the already-computed timestamp anomaly from advisory to a named summary fact, so the one signal that did fire is visible. Do not build: a runner that owns the single-executor loop, a schema-level minimum, a gateway precondition, or a hook. Open sub-question worth one pass: whether the refusal should be unconditional or honour an explicit override flag, given three stress fixtures would otherwise need `count: 2`.

## SCOPE VIOLATIONS

- **`research/research.md` was not updated, although `progressiveSynthesis` is `true`.** The config enables progressive synthesis, which the mode contract reads as "append this iteration's findings to `research/research.md`". This iteration's dispatch allowlist names only `iterations/iteration-002.md`, `deltas/iter-002.jsonl` and the append gateway's own writes, and states that those are the only paths this run may modify. The two rules disagree; the narrower dispatch allowlist was followed and no write was attempted. Consequence: `research/research.md` still stops at iteration 1 until the workflow's synthesis phase (or a later iteration whose allowlist includes it) consolidates iteration 2. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/research/deep-research-config.json]
