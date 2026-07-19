---
title: "deep-alignment"
description: "Autonomous structured conformance-review loop that audits artifacts against a named standard authority's own creation rules across resolved lanes, verifies every finding against live ground truth, suppresses known deviations and stays read-only by default."
trigger_phrases:
  - "deep alignment"
  - "alignment lane"
  - "conformance review"
  - "standard authority check"
  - "known-deviation suppression"
  - "/deep:alignment"
version: 1.0.0.1
---

# deep-alignment

> Run an autonomous conformance-review loop that checks artifacts against a named authority's own creation standards, re-verifies every finding against live reality before asserting it and reports one verdict per lane without touching the audited artifacts.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Auditing whether docs, code, designs or git history follow a *named authority's* own creation standards (sk-doc, sk-git, sk-design, sk-code): conformance, not general correctness |
| **Invoke with** | `/deep:alignment :auto "target"` / `:confirm` (built and registered, with a full live run as the remaining acceptance step), supplying lanes via `--lane-config <file.json>` or the interactive three-axis scoping question. The engine scripts are also runnable directly. Keyword triggers include "deep alignment", "alignment lane" and "conformance review" |
| **Works on** | Four artifact classes across four registered authorities: `docs` (sk-doc), `code` (sk-code), `designs` (sk-design) and `git-history` (sk-git), one or many in a single run |
| **Produces** | One `alignment-report.md` with a dedicated section per lane plus a `deep-alignment-findings-registry.json`, both under `{spec_folder}/alignment/`, every finding carrying a P0/P1/P2 severity and a per-lane and overall verdict (PASS, CONDITIONAL, FAIL or NOT_APPLICABLE) |

---

## 2. OVERVIEW

### Why This Skill Exists

Three different questions get confused for one. "Is this code correct?" is a general review that `deep-review` owns. "Is this hub wired up right: folders, registries, routing?" is a structural check that `parent-skill-check.cjs` owns. But "does this artifact follow the standards its own authoring skill defines?" had no home. A README can be perfectly correct and still violate every convention in `sk-doc`'s templates. A commit series can be bug-free and still ignore `sk-git`'s conventional-commit rules. And a "shipped to standard" claim in a spec doc is only as trustworthy as the last time someone re-checked it against the live validator. This skill audits artifact-content conformance against one specific, named authority's own templates and creation standards, nothing more and nothing less. It re-verifies every finding against live ground truth before asserting it and suppresses the authority's own documented, intentional conventions so a real repo-wide pattern is never flagged as drift.

### What It Does

`deep-alignment` resolves a run into one or more **alignment lanes**, one lane per `(authority x artifact-class x scope)` the operator names. For each lane it invokes that authority's adapter to discover the artifact corpus, loads that authority's own standard source and checks the artifacts slice by slice, re-probing every claimed drift against the real validator, CLI or registry before recording it. The loop converges when artifact coverage and dry-run stability both clear their thresholds, then emits one report per lane. It observes and reports only: the audited artifacts are never modified. Fixing findings is a separate, gated, operator-approved pass, not an automatic follow-on.

It is not `deep-review`, which audits general code and doc correctness across arbitrary dimensions. It is not `parent-skill-check.cjs`, which checks hub structure, not artifact content. The runtime-backed deep-loop families share `runtime/` for state handling, coverage graphs and the convergence philosophy this mode reuses.

---

## 3. QUICK START

> **Availability.** The `/deep:alignment` command and its `@deep-alignment` LEAF agent are **built and registered**. The command renders and the cutover gates pass (routing drift-guard and the parent-skill-check strict pass) and it runs in the same `fallback` render mode as `/deep:ai-council`. A full live end-to-end run against a real lane is the remaining acceptance step. The underlying engine (scoping, the five adapters, the SCOPE/DISCOVER/ITERATE/CONVERGE/REPORT scripts and the reducer) is independently runnable today through each script's own CLI.

**Step 1: Invoke it.** Pick a mode. Autonomous runs straight through with no gates. Confirm asks for approval at each iteration. The skill is invoked through the `/deep:alignment` command, whose workflow owns state, dispatch and convergence, mirroring every other mode in this hub.

```bash
/deep:alignment :auto "sk-doc docs conformance across the cli-external hub"
/deep:alignment :confirm --lane-config path/to/lanes.json
```

The target can be a spec folder path, a skill name, an interactively scoped set of lanes or a `--lane-config` file.

**Step 2: Run the primary workflow.**

```bash
/deep:alignment :auto --lane-config lanes.json --max-iterations=6 --coverage-threshold=1.0
```

The workflow resolves lanes, discovers each lane's artifact corpus, audits slices per iteration and stops once coverage and stability both clear their thresholds.

**Step 3: Verify the reducer output after the loop finishes.**

```bash
node .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs <spec-folder>
```

Expected output: a JSON summary with `registryPath`, `reportPath`, `overallVerdict`, `laneCount`, `findingsBySeverity` and `corruptionCount`.

---

## 4. HOW IT WORKS

### The State Machine

The loop runs seven states, `INIT -> SCOPE -> DISCOVER -> ITERATE -> CONVERGE -> REPORT`, with an optional gated `REMEDIATE` that runs only on explicit approval. Each state calls a single-shot script that answers one question and returns. None of them loop or dispatch internally.

| State | What it does | Owning script |
|---|---|---|
| `INIT` | Resolve the bound spec folder and loop config, then acquire the loop lock | `runtime/scripts/loop-lock.cjs` |
| `SCOPE` | Resolve the run's alignment lanes from `--lane-config` or the interactive answers, then freeze them into `deep-alignment-config.json` | `scripts/scoping.cjs` |
| `DISCOVER` | Call each lane's adapter `discover(scope)`, persist the corpus and seed coverage-graph `FILE` nodes | each `scripts/adapters/<authority>.cjs` |
| `ITERATE` | Pick the next unaudited slice, run that lane's `standardSource` + `check`, append findings and an iteration record | `scripts/partition-corpus.cjs` + the adapters |
| `CONVERGE` | Decide CONVERGED / CONTINUE / STOP_MAX_ITERATIONS / NOTHING_TO_CONVERGE | `scripts/check-convergence.cjs` |
| `REPORT` | Reduce the state log and deltas into the findings registry and the per-lane report | `runtime/scripts/reduce-alignment-state.cjs` |
| `REMEDIATE` | Gated, opt-in hook point: enterable and safe, but performs no action today | `scripts/remediate-hook.cjs` |

State lives on disk under `{spec_folder}/alignment/`: `deep-alignment-config.json` (SCOPE output, frozen immutable), `deep-alignment-corpus.json` (DISCOVER output, auto-generated), `deep-alignment-state.jsonl` (ITERATE append log), `deltas/iter-NNN.jsonl` (per-iteration finding deltas), `iterations/iteration-NNN.md` (narrative) and the reducer-owned `deep-alignment-findings-registry.json` + `alignment-report.md`.

### The Adapter Contract

Every authority is a plug-in that implements the same three methods, so the loop itself never branches on which authority it is running:

- `discover(scope)`: turn a lane's scope into the artifact corpus, plus seed `FILE` nodes for the coverage graph.
- `standardSource(authority)`: resolve that authority's own templates, validators, standards doc and known-deviation list.
- `check(artifact, rules)`: check one artifact against the standard and return findings.

Five adapters ship: `sk-doc` (the reference adapter, wrapping the real `validate_document.py` + `extract_structure.py` validators), `sk-git`, `sk-design`, `sk-code` and a `sk-design-live-render` adapter for live-rendered design output. A new authority registers by adding one entry to `scripts/scoping.cjs`'s `AUTHORITY_ARTIFACT_CLASSES` map and shipping one adapter. No change to the loop, the scoping tree or the discover contract is required.

### The Four Invariants

The engine enforces four invariants. Adapters cannot opt out of them:

1. **Verify-first**: every finding that claims a drift from live reality is re-probed against the real validator, CLI or registry before it is asserted. Pattern-matching alone is never sufficient grounds for a finding.
2. **Known-deviation suppression**: each authority's standard source carries a list of accepted, intentional conventions (seeded from real findings and re-verified against live config), so a real repo-wide convention is never flagged as drift.
3. **Read-only by default**: the loop observes and reports. It never modifies an audited artifact unless remediation is explicitly requested.
4. **Gated remediation**: fixing findings is a separate, opt-in, operator-approved pass. When it runs it stays verify-first and respects existing safety discipline: scoped staging only, a worktree when the branch has diverged and doc-only restraint when concurrent sessions are live. The `remediate-hook.cjs` script is the callable proof this transition exists. It performs no remediation action today and always returns `not_implemented`.

### Convergence

Convergence requires two signals to hold together, always AND and never OR:

- **Artifact coverage**: the fraction of discovered artifacts checked at least once, across all applicable lanes, must reach the coverage threshold (default `1.0`, every discovered artifact). A lane that discovered zero artifacts is excluded from both sides of the ratio rather than folded into a false pass.
- **Dry-run stability**: the last N iteration records (default window `2`), across all lanes in append order, must all report zero new findings. Fewer than N iterations recorded yet fails closed to "not stable," so a fresh run can never converge on its first iteration by construction.

Full coverage with unstable findings is not done, because something is still drifting. Stability with incomplete coverage is not done either, because large parts of the corpus were never looked at. `max-iterations` (default `10`) is an independent hard stop applied regardless of the AND-pair. A lane that never stabilizes still terminates. The `check-convergence.cjs` decision is one of CONVERGED, CONTINUE, STOP_MAX_ITERATIONS or NOTHING_TO_CONVERGE.

### Corpus Partitioning And Verdicts

`partition-corpus.cjs` walks the lanes in declaration order and wraps back to the start when it reaches the end. It returns the next lane with unaudited artifacts remaining, sliced to `batchSize` (default `5`) per iteration. A lane whose corpus is empty or fully checked is skipped without ending the walk.

The reducer aggregates findings per lane, weighting severities P0 (10), P1 (5) and P2 (1). Each lane earns a verdict: `FAIL` (a P0 remains), `CONDITIONAL` (a P1 remains, no P0), `PASS` (clean), or `NOT_APPLICABLE` (nothing discovered). The overall verdict is the **worst** per-lane verdict present. A single FAIL lane fails the run and is never averaged away by clean lanes.

### The Lane Model

An alignment lane is a `(authority, artifact-class, scope)` tuple. One run resolves to **N** lanes. The operator walks a three-axis tree once per combination they care about and lanes accumulate across walks in a single session.

| Axis | Values | Notes |
|---|---|---|
| **ARTIFACT-CLASS** | `docs`, `code`, `designs`, `git-history` | Asked first. It narrows which authorities are offered next |
| **AUTHORITY** | `sk-doc` (docs), `sk-git` (git-history), `sk-design` (designs), `sk-code` (code) | Registered in `scripts/scoping.cjs`, extensible per authority-governance |
| **SCOPE** | `{type:"paths", values:[...]}`, `{type:"globs", values:[...]}`, `{type:"branchRange", from, to}` | `paths`/`globs` are validated against the repo root before any adapter sees them |

One walk, meaning one artifact-class, one multi-selected authority set valid for that class and one scope, expands to one lane per selected authority. Auditing `sk-code`, `sk-git` and `sk-design` in one pass is three walks (`code`/`sk-code`, `git-history`/`sk-git`, `designs`/`sk-design`), each contributing one lane, all in one session. It is not a full cross-product. Only the combinations the operator names become lanes.

Both the interactive path and the `--lane-config` file resolve to the exact same lane-tuple shape through the same `validateLane()` choke point, so a config lane and an interactively-answered lane are indistinguishable once resolved.

### The Invocation Contract

Arguments follow the SKILL.md contract: `[target]`, `[authority]`, `:auto` or `:confirm`, `--lane-config <file.json>`, `--max-iterations=N`, `--convergence=N`. Supplying `--lane-config` skips the interactive scoping question. Omitting it makes the three-axis conversation the only path and the two never run together.

A `--lane-config` file is a bare JSON array of lane objects:

```json
[
  { "authority": "sk-code", "artifactClass": "code", "scope": { "type": "globs", "values": ["src/**/*.ts"] } },
  { "authority": "sk-git", "artifactClass": "git-history", "scope": { "type": "branchRange", "from": "main", "to": "HEAD" } },
  { "authority": "sk-design", "artifactClass": "designs", "scope": { "type": "paths", "values": ["DESIGN.md"] } }
]
```

Any validation failure fails the whole file before `DISCOVER` starts (exit `3`), naming the offending lane and field. It never resolves a malformed file to a partial lane set.

Never hand-roll a bash or shell dispatcher to parallelize lanes, invoke a CLI executor in a loop to simulate iterations, `Task`-dispatch the `@deep-alignment` LEAF agent for iteration loops, write ad-hoc state outside the bound `alignment/` directory or run remediation without an explicit, separate operator opt-in. Each of these five is a distinct failure mode the engine is designed to prevent.

**Build state (v1.0.0.0).** The scoping engine, the five per-authority adapters and the SCOPE/DISCOVER/ITERATE/CONVERGE/REPORT scripts are shipped and independently runnable. Each has its own CLI and can be dry-run directly. The `remediate-hook.cjs` state is an intentionally unimplemented, operator-gated stub. The `/deep:alignment` command workflow and `@deep-alignment` LEAF agent, the orchestration layer that drives these scripts end to end, are built and registered. The command renders and the cutover gates pass. A full live end-to-end run against a real lane is the remaining acceptance step.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Run `deep-alignment` when checking whether docs, code, configs or git history in a scope follow a named authority's own creation standards rather than general correctness. Run it to audit multiple authorities in one pass, for example sk-doc, sk-git and sk-design conformance together. Run it to verify a claimed "shipped to standard" state against live reality before trusting it. Run it for unattended or headless conformance sweeps across a repo or a spec folder, driven by a `--lane-config` file.

Skip it for general code or doc correctness review with no specific named authority in mind, that is `deep-review`'s job. Skip it for checking hub structure such as folders, registries or routing wiring rather than artifact content, that is `parent-skill-check.cjs`'s job. Skip it for a single, already-known fix, go straight to implementation instead. Skip it for a quick one-file check too, a direct Grep or Read against the authority's own standards doc is faster.

### Boundaries And Siblings

| Skill / tool | Relationship |
|---|---|
| `deep-review` | Audits general code and doc correctness across arbitrary dimensions with a release-readiness verdict. `deep-alignment` audits conformance to one named authority's own standards, not general correctness. |
| `parent-skill-check.cjs` | Checks hub structure: folders, registries, routing wiring. `deep-alignment` checks artifact *content* conformance, never hub structure. |
| `deep-research` / `deep-ai-council` / `deep-improvement` | The other deep-loop families, each owning a different phase. None crosses into another's territory. |
| `system-spec-kit` | Owns the spec folder, validation and memory continuity the loop writes its `alignment/` state beneath. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| The `--lane-config` file is rejected before `DISCOVER` runs | A lane object failed the `validateLane()` schema check (bad authority, artifact class or scope) | Read the exit `3` error for the offending lane and field, fix that lane and rerun |
| A lane reports the `NOT_APPLICABLE` verdict | The lane's scope resolved to zero discovered artifacts | Confirm the scope's paths, globs or branch range match real files before assuming a bug |
| Remediation makes no changes to the audited artifacts | `remediate-hook.cjs` is an intentionally unimplemented, gated stub that always returns `not_implemented` | Fixing findings is a separate, operator-approved pass. Request it explicitly, it never runs automatically |
| A run reaches `max-iterations` without converging | Coverage and stability have not both cleared their thresholds inside the iteration budget | Raise `--max-iterations` or narrow the scope so `DISCOVER` returns a smaller corpus |

---

## 7. FAQ

**Q: How does deep-alignment differ from deep-review?**

A: `deep-review` audits general code and doc correctness across arbitrary dimensions and ends with a release-readiness verdict. `deep-alignment` audits conformance to one named authority's own creation standards only, re-verifying every finding against live ground truth before asserting it. Use `deep-review` for a general quality audit. Use `deep-alignment` to check whether an artifact follows its own authoring skill's documented rules.

**Q: How does deep-alignment differ from parent-skill-check.cjs?**

A: `parent-skill-check.cjs` checks hub structure: folders, registries and routing wiring. `deep-alignment` checks artifact content against a named authority's standards and never touches hub structure.

**Q: Is `/deep:alignment` ready to run today?**

A: The command and its `@deep-alignment` LEAF agent are built and registered. The command renders and the cutover gates pass. A full live end-to-end run against a real lane is the remaining acceptance step. The underlying engine, meaning scoping, the five adapters and the SCOPE/DISCOVER/ITERATE/CONVERGE/REPORT scripts, is independently runnable today through each script's own CLI.

**Q: What happens when deep-alignment is asked to fix a finding?**

A: Nothing changes automatically. Fixing findings is a separate, gated, operator-approved pass. `remediate-hook.cjs` is the callable proof this transition exists, but it performs no remediation action today and always returns `not_implemented`.

**Q: Can a new authority be added to audit?**

A: Yes. A new authority registers by adding one entry to `scripts/scoping.cjs`'s `AUTHORITY_ARTIFACT_CLASSES` map and shipping one adapter that implements `discover`, `standardSource` and `check`. No change to the loop, the scoping tree or the discover contract is required.

---

## 8. VERIFICATION

The skill ships two validation packages.

### Feature Catalog

The `feature-catalog/` inventories 21 features across four categories: lane resolution (5), the adapter contract (8), loop lifecycle (4) and the alignment contract (4). Each entry documents a description, how it works and the source files that implement it.

The state-machine wiring ships its own test that pins the state-to-script contract:

```bash
node .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs
```

### Manual Testing Playbook

The `manual-testing-playbook/` runs 31 deterministic scenarios across 8 categories:

- Entry points and modes
- Lane resolution and scoping
- Discovery and adapters
- Verify-first and known-deviation suppression
- Iteration and convergence
- Read-only and gated remediation
- Report emission per lane
- State and fault tolerance

Every scenario maps to a dedicated feature file with the canonical objective, prompt summary, expected signals and live source anchors.

Confirm this document itself passes structural validation:

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/system-deep-loop/deep-alignment/README.md --type readme
```

Expected output: zero blocking errors.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | The mode contract: state machine, adapter contract, the four invariants and the boundary statement |
| [`references/scoping-protocol.md`](./references/scoping-protocol.md) | The three-axis ARTIFACT-CLASS x AUTHORITY x SCOPE decision tree and lane resolution |
| [`references/lane-config-schema.md`](./references/lane-config-schema.md) | The `--lane-config` JSON shape, authority/artifact-class validity and the error contract |
| [`references/discover-contract.md`](./references/discover-contract.md) | The authority-agnostic `discover(scope) -> artifacts` half of the adapter contract |
| [`references/state-machine-wiring.md`](./references/state-machine-wiring.md) | The concrete state-to-script wiring, `alignment/` file layout and the convergence formula |
| [`references/adapters/sk-doc-adapter.md`](./references/adapters/sk-doc-adapter.md) | The reference sk-doc adapter specification (validators, sub-checks, severity mapping) |
| [`references/adapters/sk-git-adapter.md`](./references/adapters/sk-git-adapter.md) | The sk-git adapter specification |
| [`references/adapters/sk-design-adapter.md`](./references/adapters/sk-design-adapter.md) | The sk-design adapter specification |
| [`references/adapters/sk-code-adapter.md`](./references/adapters/sk-code-adapter.md) | The sk-code adapter specification |
| [`references/adapters/sk-design-live-render-adapter.md`](./references/adapters/sk-design-live-render-adapter.md) | The sk-design live-render adapter specification |
| [`references/adapters/sk-doc-known-deviations.md`](./references/adapters/sk-doc-known-deviations.md) | Per-authority known-deviation suppression lists (also sk_git, sk_design, sk_code variants) |
| [`scripts/scoping.cjs`](./scripts/scoping.cjs) | Lane resolution: `AUTHORITY_ARTIFACT_CLASSES`, `validateLane`, `resolveLanesFromConfig`/`FromSelections` |
| [`scripts/check-convergence.cjs`](./scripts/check-convergence.cjs) | The coverage-AND-stability-AND-max-iterations CONVERGE decision |
| [`scripts/partition-corpus.cjs`](./scripts/partition-corpus.cjs) | Round-robin lane slicing for the next iteration |
| [`scripts/remediate-hook.cjs`](./scripts/remediate-hook.cjs) | The gated, intentionally-unimplemented REMEDIATE hook point |
| [`scripts/adapters/`](./scripts/adapters/) | The five per-authority adapters implementing `discover` / `standardSource` / `check` |
| [`assets/deep-alignment-config-template.json`](./assets/deep-alignment-config-template.json) | Config template with convergence defaults, file-protection rules and script wiring |
| [`../runtime/scripts/reduce-alignment-state.cjs`](../runtime/scripts/reduce-alignment-state.cjs) | The per-lane reducer that builds the findings registry and the alignment report |
| [`feature-catalog/`](./feature-catalog/) | Feature inventory across lane resolution, the adapter contract, loop lifecycle and the alignment contract |
| [`manual-testing-playbook/`](./manual-testing-playbook/) | Deterministic scenarios with preconditions, expected signals and per-feature execution contracts |
| [`behavior-benchmark/`](./behavior-benchmark/) | Executor-model behavior benchmark: scenario contracts for what the model does at the `/deep:alignment` command surface under realistic prompts |
| [`changelog/v1.0.0.0.md`](./changelog/v1.0.0.0.md) | The mode-packet establishment changelog |
