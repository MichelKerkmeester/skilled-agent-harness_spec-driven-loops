---
title: "deep-alignment: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality reference for the deep-alignment conformance-review loop."
version: 1.0.0.2
---

# deep-alignment: Feature Catalog

This document combines the current feature inventory for the `deep-alignment` system into a single reference. The root catalog acts as the system-level directory: it summarizes lane resolution, the pluggable adapter contract, the loop lifecycle, and the four-invariant alignment contract, and points to the per-feature files that carry the deeper protocol and source anchors.

`deep-alignment` audits whether artifacts follow a **named authority's own creation standards** (sk-doc, sk-git, sk-design, sk-code), not general code correctness (that is `deep-review`) and not hub structure such as folders, registries, or routing wiring (that is `parent-skill-check.cjs`). Keep that boundary in mind while reading every entry below: a finding here is always "artifact X drifts from authority Y's documented standard," re-verified against live ground truth before it is asserted.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the `deep-alignment` feature surface. The numbered sections below group the system by lane resolution, adapter contract, loop lifecycle, and the alignment contract so readers can move from a top-level summary into per-feature reference files without losing the contract behind each phase.

> **Availability.** The engine catalogued here — `scoping.cjs`, the five per-authority adapters, `check-convergence.cjs`, `partition-corpus.cjs`, the intentionally-unimplemented `remediate-hook.cjs` stub, and `runtime/scripts/reduce-alignment-state.cjs` — is shipped and independently runnable today, each through its own CLI. The `/deep:alignment` command and `@deep-alignment` LEAF agent are the invocation path for these scripts, built and verified in phase 009 with both cutover gates green. Every mention of a "command workflow," "invoking command," or "driving agent" below describes that built and verified orchestration surface.

| Category | Coverage | Primary Surfaces |
|---|---:|---|
| Lane resolution | 5 features | `scripts/scoping.cjs`, `references/scoping-protocol.md`, `references/lane-config-schema.md` |
| Adapter contract | 8 features | `references/discover-contract.md`, `scripts/adapters/*.cjs`, `references/adapters/sk_*_adapter.md` |
| Loop lifecycle | 4 features | `references/state-machine-wiring.md`, `scripts/{check-convergence,partition-corpus,remediate-hook}.cjs`, `runtime/scripts/reduce-alignment-state.cjs` |
| Alignment contract | 4 features | `SKILL.md` §2 (four invariants), `references/adapters/sk_*_known_deviations.md`, `scripts/remediate-hook.cjs` |

---

## 2. LANE RESOLUTION

These entries cover the `SCOPE`-state work that resolves a run into one or more alignment lanes — a `(authority, artifactClass, scope)` tuple each — before any artifact is discovered.

### Scoping tree

#### Description

Resolves an interactive or non-interactive run into N alignment lanes through one three-axis decision tree.

#### How It Works

The tree is walked once per lane the operator wants: pick an artifact-class, multi-select the authorities valid for it, name a scope. Both the interactive path (`resolveLanesFromSelections`) and the config-file path (`resolveLanesFromConfig`) funnel through the same `validateLane()` choke point, so an interactively-answered lane and a config-file lane are indistinguishable once resolved.

#### Source Files

See [`lane-resolution/scoping-tree.md`](../feature-catalog/lane-resolution/scoping-tree.md) for full implementation and validation file listings.

---

### Artifact classes

#### Description

The four artifact-class values a lane may carry: `docs`, `code`, `designs`, `git-history`.

#### How It Works

`ARTIFACT_CLASSES` is a frozen four-value set that names the kind of thing a lane audits. It is asked first in the tree because it determines which authorities are even offered next, and it decides which scope shapes make sense (`git-history` pairs with `branchRange`; the rest pair with `paths`/`globs`).

#### Source Files

See [`lane-resolution/artifact-classes.md`](../feature-catalog/lane-resolution/artifact-classes.md) for full implementation and validation file listings.

---

### Authority registry

#### Description

The `AUTHORITY_ARTIFACT_CLASSES` map binding each registered authority to the artifact-class(es) it may check.

#### How It Works

A frozen registry maps `sk-doc -> [docs]`, `sk-git -> [git-history]`, `sk-design -> [designs]`, `sk-code -> [code]`. A new authority registers by adding one entry, with no change to the tree or the loop. Values are arrays so a future authority may cover more than one class; every v1 authority covers exactly one.

#### Source Files

See [`lane-resolution/authority-registry.md`](../feature-catalog/lane-resolution/authority-registry.md) for full implementation and validation file listings.

---

### Scope types

#### Description

The three scope shapes — `paths`, `globs`, `branchRange` — validated against the repo root before any adapter sees them.

#### How It Works

`validateScope()` normalizes a lane's scope into one of three shapes and, for `paths`/`globs`, validates every value against the repo root via the shared `validateNamespaceValue()` helper so a malformed scope can never escape the workspace. `branchRange` carries git refs, not filesystem paths, so it is not repo-root-checked.

#### Source Files

See [`lane-resolution/scope-types.md`](../feature-catalog/lane-resolution/scope-types.md) for full implementation and validation file listings.

---

### Lane config

#### Description

The non-interactive `--lane-config <file.json>` path: a bare JSON array of lane objects for headless and cron runs.

#### How It Works

`parseLaneConfigFile()` reads a file (or `-` for stdin), parses it, and hands it to `resolveLanesFromConfig()`, which maps each entry through `validateLane()`. The same content always resolves to the same lanes (no clock or session dependency), and any single malformed lane fails the whole file with exit `3` rather than resolving a partial set.

#### Source Files

See [`lane-resolution/lane-config.md`](../feature-catalog/lane-resolution/lane-config.md) for full implementation and validation file listings.

---

## 3. ADAPTER CONTRACT

These entries describe ADR-003's authority-agnostic three-method adapter contract and the five per-authority adapters that implement it, so the loop itself never branches on which authority it is running.

### discover(scope)

#### Description

The first adapter method: turn a lane's scope into an artifact corpus plus coverage-graph seed `FILE` nodes.

#### How It Works

`discover(scope) -> { artifacts, nodes }` takes exactly the `scope` field of one resolved lane (already repo-root-validated) and returns one artifact entry per discovered item plus one `FILE` seed node each, shaped for `runtime/scripts/upsert.cjs --nodes`. An empty or zero-match scope resolves to `{ artifacts: [], nodes: [] }` and a zero-coverage lane, never an error. The signature never takes a second authority parameter.

#### Source Files

See [`adapter-contract/discover.md`](adapter-contract/discover.md) for full implementation and validation file listings.

---

### standardSource(authority)

#### Description

The second adapter method: resolve where an authority's own creation standard lives.

#### How It Works

`standardSource(authority) -> { templates, rules, knownDeviations, ... }` returns the concrete paths of the authority's own validators, standards docs, and templates, plus its loaded known-deviation list. It never reads the artifacts under review — only the standard they are checked against — and rejects any authority name that is not its own.

#### Source Files

See [`adapter-contract/standard-source.md`](../feature-catalog/adapter-contract/standard-source.md) for full implementation and validation file listings.

---

### check(artifact, rules)

#### Description

The third adapter method: check one artifact against its lane's standard and return re-verified findings.

#### How It Works

`check(artifact, rules[, options]) -> findings` runs each authority's sub-checks (deterministic and, where applicable, reasoning-agent), tags every finding with the layer that produced it, and applies known-deviation suppression last. The reasoning-agent sub-checks are structurally verify-first: they translate only already-verified, caller-supplied contradictions into findings and never invent one from nothing.

#### Source Files

See [`adapter-contract/check.md`](adapter-contract/check.md) for full implementation and validation file listings.

---

### sk-doc adapter

#### Description

The reference authority adapter: wraps `validate_document.py` and `extract_structure.py` for the `docs` artifact-class.

#### How It Works

`sk-doc.cjs` is the phase-005 reference every other adapter copies in shape. It walks Markdown files, classifies each document type from its path, runs the two real sk-doc validators as subprocesses, and maps their blocking-errors/warnings/DQI-floor results onto P0/P1/P2 findings, plus a verify-first reality-alignment sub-check.

#### Source Files

See [`adapter-contract/adapter-sk-doc.md`](../feature-catalog/adapter-contract/adapter-sk-doc.md) for full implementation and validation file listings.

---

### sk-git adapter

#### Description

The single-layer deterministic authority adapter for the `git-history` artifact-class.

#### How It Works

`sk-git.cjs` discovers commits over a `branchRange` plus live branch names, then checks two dimensions against live git state: conventional-commit subject grammar (a line-cited port of the real `commit-msg` hook) and `wt/{NNNN}-{name}` branch-naming. It is 100% deterministic with no reasoning-agent layer, and carries two structural pre-check exemptions (Git-generated subjects, `work/` launch-wrapper branches).

#### Source Files

See [`adapter-contract/adapter-sk-git.md`](../feature-catalog/adapter-contract/adapter-sk-git.md) for full implementation and validation file listings.

---

### sk-design adapter

#### Description

The static-only hybrid authority adapter for the `designs` artifact-class (DESIGN.md and tokens.json).

#### How It Works

`sk-design.cjs` checks DESIGN.md structural conformance against `design-md-format.md`'s Style Reference schema (required headings, banned extractor-leak patterns, Quick-Start color consistency) and tokens.json parse-validity, plus a verify-first reasoning-agent audit-rubric layer. It never renders and never invokes the extraction pipeline; live-render is a separate authority adapter.

#### Source Files

See [`adapter-contract/adapter-sk-design.md`](../feature-catalog/adapter-contract/adapter-sk-design.md) for full implementation and validation file listings.

---

### sk-code adapter

#### Description

The hardest hybrid authority adapter for the `code` artifact-class, spanning the OpenCode and Webflow surfaces.

#### How It Works

`sk-code.cjs` classifies each artifact's sk-code surface from the ported `stack-detection.md` order, runs the real deterministic drift tooling per surface (`verify_alignment_drift.py` for OpenCode; `verify-minification.mjs`/`test-minified-runtime.mjs` for Webflow), and builds a reasoning-agent dispatch packet for the pattern-conformance dimensions no script can judge. It excludes the tree-mutating `minify-webflow.mjs` to stay read-only.

#### Source Files

See [`adapter-contract/adapter-sk-code.md`](../feature-catalog/adapter-contract/adapter-sk-code.md) for full implementation and validation file listings.

---

### sk-design live-render adapter

#### Description

The live-render authority adapter that wraps no local renderer and checks only caller-supplied render evidence.

#### How It Works

`sk-design-live-render.cjs` classifies a target as a URL or repo-relative component entry, then `check()` requires an `options.renderResult` that the ITERATE-state driving agent, built and verified in phase 009 with both cutover gates green, supplies by dispatching through `design-mcp-open-design`. Without it — or with the wrong dispatch boundary, a rejected dispatch, or an auth-blocked target — it returns a single honest `render-unavailable`-family finding, never a fabricated pass. When present, it runs deterministic threshold checks over the supplied measurements.

#### Source Files

See [`adapter-contract/adapter-sk-design-live-render.md`](../feature-catalog/adapter-contract/adapter-sk-design-live-render.md) for full implementation and validation file listings.

---

## 4. LOOP LIFECYCLE

These entries cover the seven-state machine and the single-shot runtime scripts each state calls, from lock acquisition through the optional gated remediation hook.

### State machine

#### Description

The `INIT -> SCOPE -> DISCOVER -> ITERATE -> CONVERGE -> REPORT -> [REMEDIATE]` wiring onto single-shot scripts and the `alignment/` state-file layout.

#### How It Works

Each state calls one single-shot script that answers a question and returns; no script loops or dispatches internally. `INIT` acquires the loop lock, `SCOPE` freezes lanes into `deep-alignment-config.json`, `DISCOVER` writes `deep-alignment-corpus.json` and seeds `FILE` nodes, and `ITERATE`/`CONVERGE`/`REPORT`/`REMEDIATE` are covered by their own feature files. The `/deep:alignment` command workflow, built and verified in phase 009 with both cutover gates green, is the surface that drives the states. The state machine forbids any custom bash/shell dispatcher.

#### Source Files

See [`loop-lifecycle/state-machine.md`](../feature-catalog/loop-lifecycle/state-machine.md) for full implementation and validation file listings.

---

### Corpus partitioning

#### Description

The `ITERATE`-state resolver that answers "what should the next iteration check?" by round-robin over lanes.

#### How It Works

`partition-corpus.cjs` reads the discovered corpus and the reducer's per-lane `artifactsChecked` count, then returns the next lane with unaudited artifacts remaining — visited in corpus-declaration order, wrapping, sliced to `batchSize` (default 5). A zero-length or fully-checked lane is skipped without ending the walk; `{ done: true }` comes only when every lane's corpus is exhausted.

#### Source Files

See [`loop-lifecycle/corpus-partitioning.md`](../feature-catalog/loop-lifecycle/corpus-partitioning.md) for full implementation and validation file listings.

---

### Convergence check

#### Description

The `CONVERGE`-state decision: coverage AND dry-run-stability, with max-iterations as an independent hard stop.

#### How It Works

`check-convergence.cjs` reports `CONVERGED` only when artifact-coverage meets the threshold (default 100%) AND the last N iterations (default 2) all reported zero new findings — never OR. `max-iterations` forces `STOP_MAX_ITERATIONS` regardless of that pair, and a run with zero applicable lanes reports `NOTHING_TO_CONVERGE`. This is the NFR-R01 documented manual coverage check, deliberately not a `runtime/scripts/convergence.cjs` code path.

#### Source Files

See [`loop-lifecycle/convergence-check.md`](../feature-catalog/loop-lifecycle/convergence-check.md) for full implementation and validation file listings.

---

### Alignment-report reducer

#### Description

The `REPORT`-state reducer that folds the JSONL state log and deltas into the findings registry and one report per lane.

#### How It Works

`reduce-alignment-state.cjs` aggregates each lane's findings (deduplicated), derives a per-lane verdict (`FAIL`/`CONDITIONAL`/`PASS`/`NOT_APPLICABLE`), and rolls them into an overall verdict that is the worst per-lane verdict present — never an average, so a single `FAIL` lane fails the run. It renders `alignment-report.md` with one section per lane and is idempotent.

#### Source Files

See [`loop-lifecycle/alignment-report-reducer.md`](../feature-catalog/loop-lifecycle/alignment-report-reducer.md) for full implementation and validation file listings.

---

## 5. ALIGNMENT CONTRACT

These entries cover the four invariants the engine enforces itself rather than leaving to individual adapters to opt into. They are what make a `deep-alignment` finding trustworthy and what keep the mode read-only by default.

### Verify-first

#### Description

Every finding that claims a drift from live reality is re-probed against the real validator, CLI, or registry before it is asserted.

#### How It Works

Pattern-matching alone is never sufficient grounds for a finding. Deterministic sub-checks re-run the real tool on every `check()` call; reasoning-agent sub-checks translate only already-verified, caller-supplied contradictions (each carrying cited reprobe evidence) into findings, and drop any entry missing that evidence. sk-git's live git reads re-fetch commit and branch state at check-time rather than trusting anything cached at discover-time.

#### Source Files

See [`alignment-contract/verify-first.md`](../feature-catalog/alignment-contract/verify-first.md) for full implementation and validation file listings.

---

### Known-deviation suppression

#### Description

Each authority carries its own list of accepted, intentional conventions so a real repo-wide convention is never flagged as drift.

#### How It Works

Each adapter's `standardSource()` loads a machine-readable deviation list parsed directly from the fenced JSON block of that authority's `sk_*_known_deviations.md` — the single source of truth, with no hand-synced copy in code. `suppressKnownDeviations()` filters findings through per-authority match rules as the final step of `check()`, suppressing only the matched finding, never the whole artifact. sk-git additionally uses structural pre-check exemptions that never produce a finding to suppress in the first place.

#### Source Files

See [`alignment-contract/known-deviation-suppression.md`](../feature-catalog/alignment-contract/known-deviation-suppression.md) for full implementation and validation file listings.

---

### Read-only default

#### Description

The loop observes and reports; it never modifies an audited artifact unless remediation is explicitly requested.

#### How It Works

The default surface exposes no `Write`/`Edit`. `Task` and `Bash` are present in `allowed-tools` but reserved for the gated remediation pass, and loop-owned state writes route through shared runtime scripts under the bound `alignment/` directory, not direct edits to audited files. No `WebFetch`: alignment checks local artifacts against local authority standards.

#### Source Files

See [`alignment-contract/read-only-default.md`](../feature-catalog/alignment-contract/read-only-default.md) for full implementation and validation file listings.

---

### Gated remediation

#### Description

Fixing findings is a separate, opt-in, operator-approved pass — never an automatic follow-on to the read-only loop.

#### How It Works

The optional `REMEDIATE` state exists as a callable, testable hook point (`remediate-hook.cjs`) that today performs no action and always returns `{ status: 'not_implemented' }`, citing ADR-005 invariant 4. The wiring contract (REPORT can optionally transition to REMEDIATE) is already correct; a future phase replaces the hook's body, not its call site. When real remediation lands it stays verify-first and honors the repo's existing safety discipline: scoped staging only, a worktree when the branch has diverged, and doc-only restraint when concurrent sessions are live.

#### Source Files

See [`alignment-contract/gated-remediation.md`](../feature-catalog/alignment-contract/gated-remediation.md) for full implementation and validation file listings.
