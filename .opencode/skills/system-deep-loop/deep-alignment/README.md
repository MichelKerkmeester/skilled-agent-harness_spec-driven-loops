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
version: 1.0.0.0
---

# deep-alignment

> Run an autonomous conformance-review loop that checks artifacts against a named authority's own creation standards, re-verifies every finding against live reality before asserting it, and reports one verdict per lane without touching the audited artifacts.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Auditing whether docs, code, designs or git history follow a *named authority's* own creation standards (sk-doc, sk-git, sk-design, sk-code) — conformance, not general correctness |
| **Invoke with** | `/deep:alignment :auto "target"` / `:confirm` (built and registered; a full live run is the remaining acceptance step — see §5), supplying lanes via `--lane-config <file.json>` or the interactive three-axis scoping question; the engine scripts are also runnable directly. Keyword triggers include "deep alignment", "alignment lane" and "conformance review" |
| **Works on** | Four artifact classes across four registered authorities: `docs` (sk-doc), `code` (sk-code), `designs` (sk-design) and `git-history` (sk-git) — one or many in a single run |
| **Produces** | One `alignment-report.md` with a dedicated section per lane plus a `deep-alignment-findings-registry.json`, both under `{spec_folder}/alignment/`, every finding carrying a P0/P1/P2 severity and a per-lane and overall verdict (PASS, CONDITIONAL, FAIL or NOT_APPLICABLE) |

---

## 2. OVERVIEW

### Why This Skill Exists

Three different questions get confused for one. "Is this code correct?" is a general review — `deep-review` owns it. "Is this hub wired up right — folders, registries, routing?" is a structural check — `parent-skill-check.cjs` owns it. But "does this artifact actually follow the standards its own authoring skill defines?" had no home. A README can be perfectly correct and still violate every convention in `sk-doc`'s templates. A commit series can be bug-free and still ignore `sk-git`'s conventional-commit rules. And a "shipped to standard" claim in a spec doc is only as trustworthy as the last time someone re-checked it against the live validator. This skill audits artifact-content conformance against one specific, named authority's own templates and creation standards — nothing more, nothing less — re-verifying every finding against live ground truth before it is asserted, and suppressing the authority's own documented, intentional conventions so a real repo-wide pattern is never flagged as drift.

### What It Does

`deep-alignment` resolves a run into one or more **alignment lanes**, one lane per `(authority x artifact-class x scope)` the operator names. For each lane it invokes that authority's adapter to discover the artifact corpus, loads that authority's own standard source, and checks the artifacts slice by slice — re-probing every claimed drift against the real validator, CLI or registry before recording it. The loop converges when artifact coverage and dry-run stability both clear their thresholds, then emits one report per lane. It observes and reports only: the audited artifacts are never modified. Fixing findings is a separate, gated, operator-approved pass, not an automatic follow-on.

It is not `deep-review` — that mode audits general code and doc correctness across arbitrary dimensions. It is not `parent-skill-check.cjs` — that script checks hub structure, not artifact content. The runtime-backed deep-loop families share `runtime/` for state handling, coverage graphs and the convergence philosophy this mode reuses.

---

## 3. HOW IT WORKS

### The State Machine

The loop runs seven states, `INIT -> SCOPE -> DISCOVER -> ITERATE -> CONVERGE -> REPORT`, with an optional gated `REMEDIATE` that runs only on explicit approval. Each state calls a single-shot script that answers one question and returns — none of them loop or dispatch internally.

| State | What it does | Owning script |
|---|---|---|
| `INIT` | Resolve the bound spec folder and loop config; acquire the loop lock | `runtime/scripts/loop-lock.cjs` |
| `SCOPE` | Resolve the run's alignment lanes from `--lane-config` or the interactive answers; freeze them into `deep-alignment-config.json` | `scripts/scoping.cjs` |
| `DISCOVER` | Call each lane's adapter `discover(scope)`, persist the corpus and seed coverage-graph `FILE` nodes | each `scripts/adapters/<authority>.cjs` |
| `ITERATE` | Pick the next unaudited slice, run that lane's `standardSource` + `check`, append findings and an iteration record | `scripts/partition-corpus.cjs` + the adapters |
| `CONVERGE` | Decide CONVERGED / CONTINUE / STOP_MAX_ITERATIONS / NOTHING_TO_CONVERGE | `scripts/check-convergence.cjs` |
| `REPORT` | Reduce the state log and deltas into the findings registry and the per-lane report | `runtime/scripts/reduce-alignment-state.cjs` |
| `REMEDIATE` | Gated, opt-in hook point — enterable and safe, but performs no action today | `scripts/remediate-hook.cjs` |

State lives on disk under `{spec_folder}/alignment/`: `deep-alignment-config.json` (SCOPE output, frozen immutable), `deep-alignment-corpus.json` (DISCOVER output, auto-generated), `deep-alignment-state.jsonl` (ITERATE append log), `deltas/iter-NNN.jsonl` (per-iteration finding deltas), `iterations/iteration-NNN.md` (narrative), and the reducer-owned `deep-alignment-findings-registry.json` + `alignment-report.md`.

### The Adapter Contract

Every authority is a plug-in that implements the same three methods, so the loop itself never branches on which authority it is running:

- `discover(scope)` — turn a lane's scope into the artifact corpus, plus seed `FILE` nodes for the coverage graph.
- `standardSource(authority)` — resolve that authority's own templates, validators, standards doc and known-deviation list.
- `check(artifact, rules)` — check one artifact against the standard and return findings.

Five adapters ship: `sk-doc` (the reference adapter, wrapping the real `validate_document.py` + `extract_structure.py` validators), `sk-git`, `sk-design`, `sk-code`, and a `sk-design-live-render` adapter for live-rendered design output. A new authority registers by adding one entry to `scripts/scoping.cjs`'s `AUTHORITY_ARTIFACT_CLASSES` map and shipping one adapter — no change to the loop, the scoping tree, or the discover contract.

### The Four Invariants

The engine enforces four invariants; adapters cannot opt out of them:

1. **Verify-first** — every finding that claims a drift from live reality is re-probed against the real validator, CLI or registry before it is asserted. Pattern-matching alone is never sufficient grounds for a finding.
2. **Known-deviation suppression** — each authority's standard source carries a list of accepted, intentional conventions (seeded from real findings and re-verified against live config), so a real repo-wide convention is never flagged as drift.
3. **Read-only by default** — the loop observes and reports; it never modifies an audited artifact unless remediation is explicitly requested.
4. **Gated remediation** — fixing findings is a separate, opt-in, operator-approved pass. When it runs it stays verify-first and respects existing safety discipline: scoped staging only, a worktree when the branch has diverged, and doc-only restraint when concurrent sessions are live. The `remediate-hook.cjs` script is the callable proof this transition exists; it performs no remediation action today and always returns `not_implemented`.

### Convergence

Convergence requires two signals to hold together — AND, never OR:

- **Artifact coverage** — the fraction of discovered artifacts checked at least once, across all applicable lanes, must reach the coverage threshold (default `1.0`, every discovered artifact). A lane that discovered zero artifacts is excluded from both sides of the ratio rather than folded into a false pass.
- **Dry-run stability** — the last N iteration records (default window `2`), across all lanes in append order, must all report zero new findings. Fewer than N iterations recorded yet fails closed to "not stable," so a fresh run can never converge on its first iteration by construction.

Full coverage with unstable findings is not done (something is still drifting); stability with incomplete coverage is not done either (large parts of the corpus were never looked at). `max-iterations` (default `10`) is an independent hard stop applied regardless of the AND-pair — a lane that never stabilizes still terminates. The `check-convergence.cjs` decision is one of CONVERGED, CONTINUE, STOP_MAX_ITERATIONS or NOTHING_TO_CONVERGE.

### Corpus Partitioning and Verdicts

`partition-corpus.cjs` walks the lanes in declaration order, wrapping, and returns the next lane with unaudited artifacts remaining, sliced to `batchSize` (default `5`) per iteration. A lane whose corpus is empty or fully checked is skipped without ending the walk.

The reducer aggregates findings per lane, weighting severities P0 (10), P1 (5) and P2 (1). Each lane earns a verdict: `FAIL` (a P0 remains), `CONDITIONAL` (a P1 remains, no P0), `PASS` (clean), or `NOT_APPLICABLE` (nothing discovered). The overall verdict is the **worst** per-lane verdict present — a single FAIL lane fails the run and is never averaged away by clean lanes.

---

## 4. THE LANE MODEL

An alignment lane is a `(authority, artifact-class, scope)` tuple. One run resolves to **N** lanes — the operator walks a three-axis tree once per combination they care about, and lanes accumulate across walks in a single session.

| Axis | Values | Notes |
|---|---|---|
| **ARTIFACT-CLASS** | `docs`, `code`, `designs`, `git-history` | Asked first — it narrows which authorities are even offered next |
| **AUTHORITY** | `sk-doc` (docs), `sk-git` (git-history), `sk-design` (designs), `sk-code` (code) | Registered in `scripts/scoping.cjs`; extensible per authority-governance |
| **SCOPE** | `{type:"paths", values:[...]}`, `{type:"globs", values:[...]}`, `{type:"branchRange", from, to}` | `paths`/`globs` are validated against the repo root before any adapter sees them |

One walk — one artifact-class, one multi-selected authority set valid for that class, one scope — expands to one lane per selected authority. Auditing `sk-code`, `sk-git` and `sk-design` in one pass is three walks (`code`/`sk-code`, `git-history`/`sk-git`, `designs`/`sk-design`), each contributing one lane, all in one session. It is not a full cross-product — only the combinations the operator actually names become lanes.

Both the interactive path and the `--lane-config` file resolve to the exact same lane-tuple shape through the same `validateLane()` choke point, so a config lane and an interactively-answered lane are indistinguishable once resolved.

---

## 5. INVOCATION

> **Availability.** The `/deep:alignment` command and its `@deep-alignment` LEAF agent are **built and registered** — the command renders and the cutover gates pass (routing drift-guard and the parent-skill-check strict pass); it runs in the same `fallback` render mode as `/deep:ai-council`. A full live end-to-end run against a real lane is the remaining acceptance step. The underlying engine (scoping, the five adapters, the SCOPE/DISCOVER/ITERATE/CONVERGE/REPORT scripts and the reducer) is independently runnable today via each script's own CLI.

The skill is invoked through the `/deep:alignment` command, whose workflow owns state, dispatch and convergence, mirroring every other mode in this hub.

```bash
/deep:alignment :auto "sk-doc docs conformance across the cli-external hub"
/deep:alignment :confirm --lane-config path/to/lanes.json
/deep:alignment :auto --lane-config lanes.json --max-iterations=6 --coverage-threshold=1.0
```

Arguments follow the SKILL.md contract: `[target]`, `[authority]`, `:auto` or `:confirm`, `--lane-config <file.json>`, `--max-iterations=N`, `--convergence=N`. Supplying `--lane-config` skips the interactive scoping question; omitting it makes the three-axis conversation the only path. The two never run together, and neither is silently skipped.

A `--lane-config` file is a bare JSON array of lane objects:

```json
[
  { "authority": "sk-code", "artifactClass": "code", "scope": { "type": "globs", "values": ["src/**/*.ts"] } },
  { "authority": "sk-git", "artifactClass": "git-history", "scope": { "type": "branchRange", "from": "main", "to": "HEAD" } },
  { "authority": "sk-design", "artifactClass": "designs", "scope": { "type": "paths", "values": ["DESIGN.md"] } }
]
```

Any validation failure fails the whole file before `DISCOVER` starts (exit `3`), naming the offending lane and field — it never resolves a malformed file to a partial lane set.

After the loop finishes, verify the reducer output:

```bash
node .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs <spec-folder>
```

Expected output: a JSON summary with `registryPath`, `reportPath`, `overallVerdict`, `laneCount`, `findingsBySeverity` and `corruptionCount`.

**Never** hand-roll a bash/shell dispatcher to parallelize lanes, invoke a CLI executor in a loop to simulate iterations, `Task`-dispatch the `@deep-alignment` LEAF agent for iteration loops, write ad-hoc state outside the bound `alignment/` directory, or run remediation without an explicit, separate operator opt-in.

**Build state (v1.0.0.0).** The scoping engine, the five per-authority adapters, and the SCOPE/DISCOVER/ITERATE/CONVERGE/REPORT scripts are shipped and independently runnable — each has its own CLI and can be dry-run directly. The `remediate-hook.cjs` state is an intentionally-unimplemented, operator-gated stub. The `/deep:alignment` command workflow and `@deep-alignment` LEAF agent — the orchestration layer that drives these scripts end-to-end — are built and registered, the command renders and the cutover gates pass; a full live end-to-end run against a real lane is the remaining acceptance step.

---

## 6. WHEN TO USE

### Use This Skill

Run `deep-alignment` when you need to check whether docs, code, configs or git history in a scope follow a named authority's own creation standards rather than general correctness. Run it to audit multiple authorities in one pass (for example sk-doc and sk-git and sk-design conformance together). Run it to verify a claimed "shipped to standard" state against live reality before trusting it. Run it for unattended or headless conformance sweeps across a repo or a spec folder, driven by a `--lane-config` file.

### Skip This Skill

Skip it for general code or doc correctness review with no specific named authority in mind — that is `deep-review`. Skip it for checking hub structure such as folders, registries or routing wiring rather than artifact content — that is `parent-skill-check.cjs`. Skip it for a single, already-known fix (go straight to implementation) or a quick one-file check (a direct Grep/Read against the authority's own standards doc is faster).

### Boundaries and Siblings

| Skill / tool | Relationship |
|---|---|
| `deep-review` | Audits general code and doc correctness across arbitrary dimensions with a release-readiness verdict. `deep-alignment` audits conformance to one named authority's own standards, not general correctness. |
| `parent-skill-check.cjs` | Checks hub structure — folders, registries, routing wiring. `deep-alignment` checks artifact *content* conformance, never hub structure. |
| `deep-research` / `deep-ai-council` / `deep-improvement` | The other deep-loop families, each owning a different phase; none crosses into another's territory. |
| `system-spec-kit` | Owns the spec folder, validation and memory continuity the loop writes its `alignment/` state beneath. |

---

## 7. VERIFICATION

The state-machine wiring ships a test that pins the state-to-script contract:

```bash
node .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs
```

You can also confirm this document passes structural validation:

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/system-deep-loop/deep-alignment/README.md --type readme
```

Expected output: zero blocking errors.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | The mode contract: state machine, adapter contract, the four invariants and the boundary statement |
| [`references/scoping_protocol.md`](./references/scoping_protocol.md) | The three-axis ARTIFACT-CLASS x AUTHORITY x SCOPE decision tree and lane resolution |
| [`references/lane_config_schema.md`](./references/lane_config_schema.md) | The `--lane-config` JSON shape, authority/artifact-class validity and the error contract |
| [`references/discover_contract.md`](./references/discover_contract.md) | The authority-agnostic `discover(scope) -> artifacts` half of the adapter contract |
| [`references/state_machine_wiring.md`](./references/state_machine_wiring.md) | The concrete state-to-script wiring, `alignment/` file layout and the convergence formula |
| [`references/adapters/sk_doc_adapter.md`](./references/adapters/sk_doc_adapter.md) | The reference sk-doc adapter specification (validators, sub-checks, severity mapping) |
| [`references/adapters/sk_git_adapter.md`](./references/adapters/sk_git_adapter.md) | The sk-git adapter specification |
| [`references/adapters/sk_design_adapter.md`](./references/adapters/sk_design_adapter.md) | The sk-design adapter specification |
| [`references/adapters/sk_code_adapter.md`](./references/adapters/sk_code_adapter.md) | The sk-code adapter specification |
| [`references/adapters/sk_design_live_render_adapter.md`](./references/adapters/sk_design_live_render_adapter.md) | The sk-design live-render adapter specification |
| [`references/adapters/sk_doc_known_deviations.md`](./references/adapters/sk_doc_known_deviations.md) | Per-authority known-deviation suppression lists (also sk_git, sk_design, sk_code variants) |
| [`scripts/scoping.cjs`](./scripts/scoping.cjs) | Lane resolution: `AUTHORITY_ARTIFACT_CLASSES`, `validateLane`, `resolveLanesFromConfig`/`FromSelections` |
| [`scripts/check-convergence.cjs`](./scripts/check-convergence.cjs) | The coverage-AND-stability-AND-max-iterations CONVERGE decision |
| [`scripts/partition-corpus.cjs`](./scripts/partition-corpus.cjs) | Round-robin lane slicing for the next iteration |
| [`scripts/remediate-hook.cjs`](./scripts/remediate-hook.cjs) | The gated, intentionally-unimplemented REMEDIATE hook point |
| [`scripts/adapters/`](./scripts/adapters/) | The five per-authority adapters implementing `discover` / `standardSource` / `check` |
| [`assets/deep_alignment_config_template.json`](./assets/deep_alignment_config_template.json) | Config template with convergence defaults, file-protection rules and script wiring |
| [`../runtime/scripts/reduce-alignment-state.cjs`](../runtime/scripts/reduce-alignment-state.cjs) | The per-lane reducer that builds the findings registry and the alignment report |
| [`changelog/v1.0.0.0.md`](./changelog/v1.0.0.0.md) | The mode-packet establishment changelog |
