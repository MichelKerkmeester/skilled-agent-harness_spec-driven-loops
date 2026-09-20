---
title: "Implementation Plan: V4 Documentation Freshness"
description: "Ten-iteration cited research lane over the v4 changelog and the root README, producing claim-by-claim freshness verdicts and applying only the corrections a verdict confirms."
trigger_phrases:
  - "v4 doc freshness plan"
  - "release doc research lane"
  - "verdict gated documentation edits"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: V4 Documentation Freshness

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Node runtime scripts under `.skilled/` |
| **Framework** | Deep-research loop (`/deep:research:auto`) over the fan-out runtime |
| **Storage** | JSONL state log, iteration files and derived strategy/registry/dashboard under `research/` |
| **Testing** | `validate.sh --strict`, run-shape assertions on iterations and receipts, sampled citation re-verification |

### Overview

The lane dispatches ten sequential research iterations through the deep-research workflow on the `cli-devin` executor, each one reading the target documents against the current tree and the recent commit history. The run's synthesized findings become two verdict documents, and the corrections those verdicts confirm are applied to the two release documents as targeted edits.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Run-shape and citation checks passing
- [x] Docs updated (spec/plan/tasks/verdicts/summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Orchestrator plus leaf iterations: the workflow YAML owns setup, dispatch, convergence and synthesis; each iteration is a fresh leaf that owns only its own artifacts.

### Key Components

- **Research lane**: ten chained iterations writing `iteration-NNN.md`, a state event and a delta each
- **Reducer**: derives strategy, findings registry and dashboard from the state log after every iteration
- **Synthesis**: collapses the accepted findings into `research/research.md` with source citations
- **Verdict documents**: one per target document, turning findings into per-claim decisions with evidence
- **Gated edit pass**: applies only what a verdict confirms, to the two release documents

### Data Flow

Target documents and commit history → per-iteration findings → state log → reducer-derived artifacts → synthesis → verdict rows → confirmed corrections in the two documents. The executor never writes outside `research/`, and the verdict pass never edits a claim no row covers.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The work is documentation freshness, so the surfaces are the documents and the evidence they rest on rather than runtime code paths.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `../CHANGELOG-v4.0.0.0.md` | Release narrative and upgrade notes for v4.0.0.0 | Update only where a verdict row confirms drift | Diff scoped to the packet plus this file; each hunk traced to a verdict row |
| `../../../README.md` | Root entry document for the repository | Update only where a verdict row confirms drift | Same scoping check; sampled re-verification of three corrections |
| `research/verdict-changelog.md` | Decision record for the changelog | Create | Every row carries a resolvable citation |
| `research/verdict-readme.md` | Decision record for the README | Create | Every row carries a resolvable citation |
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Owns loop setup, dispatch, convergence and synthesis | Unchanged - read-only contract | Not modified; run-shape checks confirm it drove the run |

Required inventories:
- Same-class producers: `rg -n '\.opencode/(bin|skills)' ../CHANGELOG-v4.0.0.0.md ../../../README.md` before judging any path claim.
- Consumers of a changed claim: `rg -n '<the corrected path or statement>' .` to find surfaces that still repeat the old wording, recorded rather than edited.
- Matrix axes: document (changelog, README) against claim class (path, capability, count, workflow) - every cell either produces a verdict row or is explicitly recorded as not checked.
- Algorithm invariant: a correction may only be applied where a verdict row names current truth; when a citation does not resolve, the row is re-verified rather than edited around.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Run shape | Iteration files, gateway receipts, route proof, convergence totals | Directory assertions plus `rg -c` over the state log |
| Synthesis | Citation coverage and placeholder residue in `research/research.md` | `rg` for `[SOURCE:` and for `TBD`/`TODO`/placeholder markers |
| Packet | Document structure, anchors, metadata consistency | `validate.sh --strict` |
| Sampled re-verification | Three corrections re-checked against the cited commit or file | `git show` and targeted `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Devin CLI seat and OAuth login | External | Green | The lane cannot run; halt and report rather than substituting an executor |
| `deepseek-v4-1-flash-max` on the executor allowlist | Internal | Green | The named model is refused; the run does not start |
| Deep-research workflow and fan-out runtime | Internal | Green | No dispatch path exists; the lane cannot proceed |
| Prior packets (041 migration, 049-050 deep-loop work) | Internal | Green | Less evidence about what moved; the verdicts weaken accordingly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A correction proves wrong, a verdict is contradicted by the tree, or the packet cannot validate.
- **Procedure**: `git restore ../CHANGELOG-v4.0.0.0.md ../../../README.md` to drop the applied corrections; `rm -r` this packet to drop the lane and its verdicts. Neither the documents nor the packet carry an outbound effect, so the revert is complete.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Research lane) ──► Phase 3 (Verdicts) ──► Phase 4 (Verify & close)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Research lane |
| Research lane | Setup | Verdicts |
| Verdicts | Research lane | Verify & close |
| Verify & close | Verdicts | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Packet and run configuration |
| Research lane | High | Ten executor iterations plus reducer refresh per iteration |
| Verdicts | Medium | Claim classification with cited evidence |
| Verify & close | Low | Scoped diff, strict validation, sampled re-verification |
| **Total** | | **One lane run plus the verdict pass** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Working tree clean before the first write
- [x] Target documents read before editing
- [x] Rollback command named before the first edit

### Rollback Procedure
1. `git restore` the two release documents to drop every applied correction.
2. `rm -r` this packet folder to drop the lane, its state and its verdicts.
3. Re-run `validate.sh --strict` on the parent to confirm the revert left the tree consistent.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - working-tree edits only, nothing persisted outside the repository
<!-- /ANCHOR:enhanced-rollback -->

---
