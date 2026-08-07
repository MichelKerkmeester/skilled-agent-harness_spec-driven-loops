---
title: "Implementation Plan: large-surface catalog reconciliation"
description: "The two catalog surfaces outside every gate are the two that most need one: system-spec-kit (348 leaves, 94 orphans, eight registered MCP tools with no root mention, two leaves publishing obsolete contracts) and the system-deep-loop nested runtime and benchmark catalogs (75 leaves, whole undocumented typed-spine domains, two stale executor rosters, 22 leaves carrying forbidden packet-history metadata). This phase reconciles both, with the typed-spine rollout state adjudicated externally rather than guessed."
trigger_phrases:
  - "large surface catalog reconciliation implementation plan"
  - "feature catalog integrity implementation plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/023-feature-catalog-integrity/003-large-surface-catalog-reconciliation"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the implementation plan from research synthesis"
    next_safe_action: "Confirm baselines in T001 before any edit begins"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

# Implementation Plan: Large-Surface Catalog Reconciliation

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
`system-spec-kit/feature-catalog` holds 348 leaves and 94 of the repo's 104 orphan leaves. It is outside the validator
because it is a single skill rather than a mode hub. The `system-deep-loop` nested catalogs (`runtime/feature-catalog`
at 50 leaves, `deep-improvement/feature-catalog` at 25) are outside it because they are nested rather than hub roots.
Both surfaces are large enough that a manual sweep will not hold, and both carry defects an agent will act on: obsolete
response contracts, halved token budgets, executor rosters that name three kinds against five and seven live ones, and
a runtime catalog that claims a complete inventory while whole typed domains are undocumented.

### Overview
Two lanes. Lane A reconciles `system-spec-kit` by generating rather than transcribing, and triages the 94 orphans
individually. Lane B is evidence-table-first: it builds a per-module rollout-state table for the typed spine, sends it
for adjudication, and only then writes catalog prose. The non-adjudication parts of Lane B run in parallel.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- T001 confirm-against-HEAD has completed the 8-missing-tools check across all 41 `TOOL_DEFINITIONS` (the synthesis
  sampled 5), re-read the `session_bootstrap` handler and `CONTEXT_MODES`, re-counted the `Source phase:` files, and
  re-derived both executor rosters.
- The typed-spine rollout-state evidence table exists and has been sent for adjudication.
- `001` has ruled the feature-leaf definition, for the orphan triage only.

### Definition of Done
- A generated reconciliation table shows zero registered MCP tools absent from the spec-kit root.
- `rg -c "Source phase"` over the runtime catalog returns 0 files.
- Both executor rosters derive from source and a test fails when a new executor lands without a catalog update.
- Every typed-spine module carries a label traceable to the adjudicated table; dark and shadow-only modules carry empty
  or stub SOURCE FILES tables.
- Both packages are `--strict` clean under the widened validator, with spec-kit orphans at zero by ruling.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Generate, do not transcribe. Where a catalog claim mirrors a source of record — the tool inventory, the executor
rosters, the token budgets, the response envelope — the durable artifact is the generator or the assertion, and the
table it produces is downstream. Where a catalog claim is a judgment — the rollout state of a typed-spine module — the
durable artifact is the adjudicated table and its evidence.

### Key Components
- **Tool-reconciliation generator** — reads `TOOL_DEFINITIONS`, reads the spec-kit root, emits the absent set.
  Preferred location is `.opencode/skills/sk-doc/shared/scripts/` so `001`'s gate can run it.
- **Roster derivations** — fan-out from `executor-config.ts`, model-benchmark from `KNOWN_EXECUTORS`, each with a test
  that fails on a new executor.
- **Contract assertions** — `session_bootstrap` envelope against the handler and schema; `memory_context` budgets
  against `CONTEXT_MODES`.
- **Rollout-state evidence table** — one row per typed-spine module: module path, tests present, wiring path if any,
  default-on or default-off, proposed label, evidence. This is the Lane B gate artifact.
- **Orphan classification ledger** — one row per orphan: path, classification (feature, category overview, retirement
  record), and the reason.

### Data Flow
Source of record produces the derived claim, the claim is written into the catalog, and verification re-derives the
claim by a committed command. For Lane B's typed spine, the evidence table is produced first, adjudicated externally,
and only the adjudicated labels flow into the catalog.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Confirm every measured figure against HEAD, then build and dispatch the typed-spine rollout-state evidence table before
any writing begins.

### Phase 2: Core Implementation
Lane A: generator, contract and budget assertions, template-shape repairs, packet-history prose, then the 94-orphan
triage once `001` rules. Lane B non-adjudication work in parallel: derived rosters, `Source phase:` removal, Lane C
benchmark controls. Lane B typed-spine writing only after adjudication returns.

### Phase 3: Verification
Generated reconciliation at zero absent, `Source phase:` at zero, roster tests, contract assertions, label spot-checks,
widened-validator strict-clean, then the checklist and strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Mechanical wherever a source of record exists, manual only for the rollout labels.

**Mechanical.**
- A generated 41-tool reconciliation table from `TOOL_DEFINITIONS` with zero tools absent from the root. The generator,
  not the table, is the committed artifact.
- `rg -c "Source phase" .opencode/skills/system-deep-loop/runtime/feature-catalog/` goes 22 to 0.
- Executor rosters derived from `executor-config.ts` and `KNOWN_EXECUTORS`, with a test that fails when a new executor
  is added without a catalog update. This is the check that stops both roster findings from recurring the next time an
  executor lands.
- `memory_context` budgets and the `session_bootstrap` envelope asserted against the handler and schema, not
  transcribed.
- After `001` lands: both packages inside the widened validator, `--strict` clean, spec-kit orphans 94 to 0-by-ruling.

**Manual, per the standard's dark-labeling rule.** Every typed-spine module in the catalog carries an explicit rollout
label, and every module labeled dark or shadow-only has an empty or stub SOURCE FILES table. A reviewer spot-checks
five labels against actual command and YAML wiring — not against the evidence table, which is what produced them.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `001` for the feature-leaf definition (orphan triage) and validator coverage (the strict-clean criterion).
- **The 036 program owner for the Q5 rollout-state adjudication.** Hard external dependency; Lane B's typed-spine
  writing cannot proceed without it.
- The spec-kit MCP server and the deep-loop runtime as read-only truth sources.
- Coordination, not dependency, with `036/032`: different files, same facts, so whichever lands second links.
- Independent of `002`. Disjoint files; the two can run in parallel.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Catalog markdown plus one generator. Rollback is `git revert` per lane. The one item needing care is a rollout label:
if an adjudicated label turns out wrong, correct the label and the SOURCE FILES table together, because a shipped label
with a stub table and a dark label with a populated table are both violations of the standard.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Work | Depends on | Blocks | Note |
|------|-----------|--------|------|
| Lane A generator and assertions | T001 | Nothing | Start immediately |
| Lane A orphan triage | `001` feature-leaf definition | REQ-011 strict-clean | Sequenced last in Lane A |
| Lane B evidence table | T001 | Lane B typed-spine writing | Build and dispatch first |
| Lane B typed-spine writing | Q5 adjudication | REQ-006 | The single hard external block |
| Lane B rosters, metadata, benchmark controls | T001 | Nothing | Parallel with the evidence table |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Workstream | Relative size | Driver |
|-----------|---------------|--------|
| Lane A generator and assertions | Medium | Four derivations against live handlers and schemas |
| Lane A orphan triage | Large | 94 individual classifications with recorded reasons |
| Lane B evidence table | Large | Per-module rollout state is the real work of this phase |
| Lane B rosters and metadata | Small | Two derivations plus a 22-file metadata sweep |
| Lane B benchmark controls | Medium | Five undocumented controls, several default-off |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- The 8-missing-tools check completed across all 41 `TOOL_DEFINITIONS`, not the 5 that were sampled.
- `Source phase:` file count captured (baseline 22).
- Both executor rosters re-derived and recorded.
- The rollout-state evidence table dispatched and its adjudication received or explicitly deferred.

### Rollback Procedure
1. Revert the offending lane's commits; lanes are separable.
2. If a rollout label is wrong, correct the label and its SOURCE FILES table in the same edit.
3. If an orphan classification is wrong, correct the classification and the root link together so bijection stays
   intact.
4. Re-run the widened validator to confirm the revert did not reintroduce a violation.

### Data Reversal
None. Documentation plus one generator.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
  T001 confirm-at-HEAD
        |
        +--> Lane A generator + assertions --------------> Lane A repairs
        |                                                       |
        |    001 feature-leaf definition ---------------------> orphan triage --> strict-clean
        |
        +--> Lane B evidence table --> Q5 adjudication (036 owner) --> typed-spine labeling
        |
        +--> Lane B rosters / Source phase / benchmark controls (independent)
```

### Dependency Matrix

| Item | Needs | Needed by |
|------|-------|-----------|
| Tool-reconciliation generator | `TOOL_DEFINITIONS`, spec-kit root | REQ-001, `001`'s gate |
| Orphan triage | `001` feature-leaf definition | REQ-007, REQ-011 |
| Rollout-state table | Per-module evidence | Q5 adjudication, REQ-006 |
| Derived rosters | `executor-config.ts`, `KNOWN_EXECUTORS` | REQ-004 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The evidence table and its adjudication. Everything else in this phase can be derived, asserted, or classified without
an external decision; the typed-spine labeling cannot, and it is the item where a wrong answer becomes a false claim
about a safety-relevant runtime. Build the table first, dispatch it first, and let the rest of the phase run beside it.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| M1 Baselines confirmed | 41-tool check complete, handler and `CONTEXT_MODES` re-read, 22 `Source phase:` files, both rosters re-derived |
| M2 Evidence table dispatched | Per-module table with evidence, sent to the 036 owner |
| M3 Lane A reconciled | Generator committed, zero tools absent, contracts and budgets asserted |
| M4 Lane B derived and cleaned | Rosters derived with a failing-on-new-executor test, `Source phase:` at 0, benchmark controls documented |
| M5 Adjudicated labels landed | Every typed-spine module labeled; five labels spot-checked against real wiring |
| M6 Strict-clean | Both packages inside the widened validator, orphans 94 to 0-by-ruling |
<!-- /ANCHOR:milestones -->
