---
title: Deep Review Strategy - sk-doc routing pass eleven
description: Runtime strategy for the routing-11 lineage, tracking stage-two README intent narrowing, generated intent signals and the compiled skill graph.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - routing-11

## 1. OVERVIEW

### Purpose

Persistent state for the `routing-11` lineage of review pass eleven. It records which dimensions remain, what was found, which approaches worked, and where the next iteration focuses.

### Usage

- **Init:** populated from the review brief, the scope file and the commit range.
- **Per iteration:** read Next Focus, review the named area, record findings, mark dimensions, set the next focus.
- **Mutability:** updated in place by this lineage.

---

## 2. TOPIC

Review of the routing area for command surfacing pass eleven: `.skilled/skills/sk-doc/ROUTER.md` (v2.4.13.0), `.skilled/skills/sk-doc/graph-metadata.json`, and `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`. The area covers phase 039's narrowing of the README intents main added to sk-doc: the git-* and spec-gate named hook phrases, the hook mirror README phrase and the bare security policy phrase were dropped, security.md was kept, the router prose states why, and the generated intent signals and compiled skill graph follow the router.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Reviewing the fixes area (`command-attach.ts`, doctor install assets/tests) assigned to `fixes-11`; read-only context only.
- Re-reporting the recorded limits in `review-brief-11.txt` unless a new input breaks them.
- Running the repository test suite, the build, or any git write; this lineage reports only.
- Opening the prompt corpora except through the allowed aggregate paths; the holdout rule stays in force.

---

## 5. STOP CONDITIONS

- Composite convergence stop at threshold 0.10 with all four dimensions covered.
- `maxIterations` 8 reached without a legal convergence stop.
- A blocking stop from `convergence.cjs` naming an uncovered dimension or an unresolved active P0.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Reading the packet's own probe file (`039/scratch/readme-probes.txt`) before scoring anything: it turned a suspected SECURITY.md reach failure into a ruled-out direction and narrowed the real gap to the leaf level (iteration 1).
- Diffing the declared phrases against both generated artifacts as sets: the 16 removed phrases are gone from both, `intent_signals_generated` has no orphans, and all 14 hubs match their source metadata byte-for-byte (iteration 1).
- Reproducing the documented stage-two rule from `leaf-route-replay.cjs` instead of inventing a matcher: each finding names the intent scores that select the leaves (iteration 1).
- Tokenizing the committed signals with the scorer's own stop-word rule and intersecting the 39 hook-phrase tokens with the 13 other hubs: the residual cross-hub class became a named list rather than a hunch (iteration 2).
- Reading the generator's carry filter before trusting its gate output: `--check` passes because it shares the same `includes(' ')` blind spot as the writer, which is what finding 5 records (iteration 2).

---

## 9. WHAT FAILED

- A first read treated "README requests keep reaching their templates" as a hub-level claim; the acceptance criterion only asserts `top=sk-doc`, so the template-level gap needed the leaf scorer to surface (iteration 1).
- The generator's `--check` cannot see a dotted phrase because it only carries phrases containing a space, so it reported `missing=0` while `security.md` was absent from the signals; the packet probe, not the gate, settled that reach still holds (iteration 1).
- A lexical-lane token overlap is necessary evidence, not a route proof: the lane weight is 0.28, so the residual-token finding had to be stated as a latent ambiguity instead of a current misroute (iteration 2).
- The prose's "git / hooks / gate" sentence cannot be verified as one claim: two of the three words are gone and the third survives through a hook that was not in the removal set (iteration 2).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A broken security reach after dropping `security policy`: probe line 7 tops sk-doc; ruled out in iteration 1 and rechecked here (iteration 2). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A broken security reach after dropping `security policy`: probe line 7 tops sk-doc; ruled out in iteration 1 and rechecked here (iteration 2).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A broken security reach after dropping `security policy`: probe line 7 tops sk-doc; ruled out in iteration 1 and rechecked here (iteration 2).

### A broken SECURITY.md reach path: the packet probe shows `create a SECURITY.md for this repo => sk-doc` despite `security.md` being absent from the generated signals (iteration 1). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A broken SECURITY.md reach path: the packet probe shows `create a SECURITY.md for this repo => sk-doc` despite `security.md` being absent from the generated signals (iteration 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A broken SECURITY.md reach path: the packet probe shows `create a SECURITY.md for this repo => sk-doc` despite `security.md` being absent from the generated signals (iteration 1).

### A carried dotted phrase in either generated artifact: `grep` over `graph-metadata.json` and `skill-graph.json` returns no `security.md` or `sync.md`; recorded as finding 5, not as parity failure (iteration 2). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A carried dotted phrase in either generated artifact: `grep` over `graph-metadata.json` and `skill-graph.json` returns no `security.md` or `sync.md`; recorded as finding 5, not as parity failure (iteration 2).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A carried dotted phrase in either generated artifact: `grep` over `graph-metadata.json` and `skill-graph.json` returns no `security.md` or `sync.md`; recorded as finding 5, not as parity failure (iteration 2).

### A false "done" on a stale artifact: the delta first rows equal their records, and the state log carries the two records plus two convergence events (iteration 3). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A false "done" on a stale artifact: the delta first rows equal their records, and the state log carries the two records plus two convergence events (iteration 3).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A false "done" on a stale artifact: the delta first rows equal their records, and the state log carries the two records plus two convergence events (iteration 3).

### A missing router changelog entry: `ROUTER.md` versions are file-local (`2.4.13.0`) while `sk-doc/changelog/` is skill-level (`v2.10.0.0`), so no changelog row is required for a router-only version bump (iteration 1). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A missing router changelog entry: `ROUTER.md` versions are file-local (`2.4.13.0`) while `sk-doc/changelog/` is skill-level (`v2.10.0.0`), so no changelog row is required for a router-only version bump (iteration 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing router changelog entry: `ROUTER.md` versions are file-local (`2.4.13.0`) while `sk-doc/changelog/` is skill-level (`v2.10.0.0`), so no changelog row is required for a router-only version bump (iteration 1).

### A new finding from the final re-run: the generator gate, freshness panel and 14-hub signal parity all pass; no new defect appeared (iteration 3). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A new finding from the final re-run: the generator gate, freshness panel and 14-hub signal parity all pass; no new defect appeared (iteration 3).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new finding from the final re-run: the generator gate, freshness panel and 14-hub signal parity all pass; no new defect appeared (iteration 3).

### A present misroute from the residual tokens: no probe or scorer result shows sk-doc beating the owning hub for a bare env, session, decision or dispatch prompt; the lexical lane alone carries 0.28 (iteration 2). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A present misroute from the residual tokens: no probe or scorer result shows sk-doc beating the owning hub for a bare env, session, decision or dispatch prompt; the lexical lane alone carries 0.28 (iteration 2).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A present misroute from the residual tokens: no probe or scorer result shows sk-doc beating the owning hub for a bare env, session, decision or dispatch prompt; the lexical lane alone carries 0.28 (iteration 2).

### A scope leak in the lineage: only iteration, delta, strategy and record/ledger files exist inside `routing-11`; `git status` over the three scope files is empty (iteration 3). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A scope leak in the lineage: only iteration, delta, strategy and record/ledger files exist inside `routing-11`; `git status` over the three scope files is empty (iteration 3).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A scope leak in the lineage: only iteration, delta, strategy and record/ledger files exist inside `routing-11`; `git status` over the three scope files is empty (iteration 3).

### Orphaned generated phrases after the 16-phrase removal: `generate-router-intent-signals.cjs --check` reports `orphans=0` (iteration 1). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Orphaned generated phrases after the 16-phrase removal: `generate-router-intent-signals.cjs --check` reports `orphans=0` (iteration 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Orphaned generated phrases after the 16-phrase removal: `generate-router-intent-signals.cjs --check` reports `orphans=0` (iteration 1).

### Stale compiled graph or signal drift: `skill-graph-freshness.cjs --strict` exits 0 with `SIGNAL DRIFT compiled vs disk: none` (iteration 1). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Stale compiled graph or signal drift: `skill-graph-freshness.cjs --strict` exits 0 with `SIGNAL DRIFT compiled vs disk: none` (iteration 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale compiled graph or signal drift: `skill-graph-freshness.cjs --strict` exits 0 with `SIGNAL DRIFT compiled vs disk: none` (iteration 1).

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- Stale compiled graph or signal drift after the 16-phrase removal: `skill-graph-freshness.cjs --strict` exits 0 with `SIGNAL DRIFT compiled vs disk: none` (iteration 1).
- Orphaned generated phrases: `generate-router-intent-signals.cjs --check` reports `orphans=0` (iteration 1).
- A broken SECURITY.md reach path: the packet probe shows `create a SECURITY.md for this repo => sk-doc` even though `security.md` is absent from the generated signals (iteration 1).
- A missing router changelog entry: `ROUTER.md` versions are file-local while `sk-doc/changelog/` is skill-level, so no changelog row is required for a router-only version bump (iteration 1).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining. - Focus area: none; the stop decision is expected at this pass. - Reason: all four dimensions and all six protocols are closed; the only open items are the five P2 advisories, which do not block a PASS. - Rotation status: exhausted. - Productive carry-forward: the exact signal-set parity and the packet probe for any follow-up pass. - Required evidence: the convergence script's stop decision recorded in the state log. - Recovery note: none.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/skills/sk-doc/ROUTER.md` §2 intent prose, §3 `INTENT_SIGNALS`/`RESOURCE_MAP`; `.skilled/skills/sk-doc/graph-metadata.json` `intent_signals` and `intent_signals_generated`; `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` `.signals["sk-doc"]`.
- Behavior claims: root-guide leaves fire on `security.md`; hook-readme leaves fire on generic hook README phrases and the named shared hooks except `git-*` and `spec-gate`; runtime-plugin-readme leaves fire on plugins/extensions folder phrases; bare `git`, `mirror` and `gate` prompts no longer pull sk-doc.
- Generation chain: `generate-router-intent-signals.cjs` carries every multi-word phrase a router declares into `graph-metadata.json`; `skill-graph.json` is the advisor's compiled graph projection of the same signals.
- Stage-two scorer: `leaf-route-replay.cjs` scores each intent once per hit keyword (intent weight for plain keywords), keeps intents within one point of the top score, then maps `RESOURCE_MAP` to leaf pairs.
- Review risks: the generator requires a space in a phrase (`k.includes(' ')`), so a dotted token such as `security.md` cannot propagate; the branch's phrase edit may therefore have a silent half-life.
- Out of scope: the nested `sk-create-readme` packet router and its templates; they are context only.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1 | Router matches phase scope; F003 records the packet-router table row. |
| `checklist_evidence` | core | notApplicable | 1 | Review pass over another phase's files; phase AC rows read as evidence. |
| `skill_agent` | overlay | pass | 1 | Change stays inside the sk-doc skill and its advisor projection. |
| `agent_cross_runtime` | overlay | notApplicable | 1 | No agent definition in the diff. |
| `feature_catalog_code` | overlay | partial | 2 | Generator contract intact for multi-word phrases; F005 records the dotted-phrase blind spot. |
| `playbook_capability` | overlay | partial | 2 | Committed probes read; no playbook scenario executed. |
<!-- /ANCHOR:cross-reference-status -->
