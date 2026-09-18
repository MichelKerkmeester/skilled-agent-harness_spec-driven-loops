---
title: "Iteration 5: Recommended Path, Costs, Risks and Build Steps"
trigger_phrases: []
---

# Iteration 5: Recommended Path, Costs, Risks and Build Steps

## Focus

Q5 — pick one admissions path from the evidence of Iterations 1-4 and lay out what a later phase
would build and test.

## Recommendation

**Build a new compiled-vs-gold checker (Path B), run it as a standing gate, and restate the admission
bar it enforces.** Do not restore the retired Lane C modules by default; do not leave admission
closed.

The recommendation is a judgment grounded in the findings, not a claim of certainty:

- The bar being restated is the only genuine cost of B. Lane C's sentence was "compiled equals
  legacy". B's sentence is "compiled satisfies the authored routing contract on the hub's full typed
  gold, with coverage floors met, and no drift across fitted, holdout or negative stages". The two
  coincide wherever gold is faithful; they differ exactly where legacy itself disagrees with gold
  (F2.7) — and the absence of any way to detect that difference is already true today, because the
  only tool that measured it is gone (F4.5).
- The alternative that preserves the literal sentence (Path A) means restoring a 4,241-line script
  tree through an unfinished source-root migration, re-pinning frozen digests on any edit, and
  re-opening a lane the repository deliberately retired and fenced off-scope (F4.1, F4.2). If the
  operator insists on the literal sentence, the smallest way back is not the whole restore: restore
  `router-replay.cjs` plus a comparison adapter, decide that with the B baseline in hand.
- Keeping the door closed (Path C) is not free either: it keeps admission manual forever and leaves
  the five admitted hubs unmeasured against legacy since retirement, with only freshness and a
  2-fixture golden-prompt check standing in (F4.5).

An admission path is only needed when a candidate appears; the standing-gate half of B is needed
now, which is why B is the proportionate choice even while the cohort is closed to newcomers.

## Findings

### F5.1 — What the recommendation buys

- A repeatable admission verdict built entirely from live seams: `compiledRoute`/front door,
  `qualifiedIdToLeaf`, per-hub `leaf-manifest.json` + `mode-registry.json`, and the 74-scenario typed
  gold corpus. No deleted module, no frozen digest, no workspace build step (F2.2, F4.3).
- A standing gate that measures compiled decisions on every routing-input change — recovering, in
  part, a capability lost at retirement. The foundation invariants and golden-prompt suite continue
  to cover structure and two prompts; the checker covers the corpus (F4.5).
- Explicit defer/UNKNOWN/negative/holdout semantics so a new hub cannot be admitted on a corpus that
  silently omits the conservative half of the contract (F2.4, F2.5).
- Coverage floors that make "zero drift" meaningful for hubs with thin corpora (sk-code: 1 scenario)
  (F2.1, F4.4).

### F5.2 — What the recommendation knowingly gives up, and how it is bounded

- **Legacy independence.** Mitigation: state the restated bar in the architecture reference; keep the
  checker's failure taxonomy explicit (`routing-mismatch`, `mode-missing`, `leaf-not-declared`,
  `unresolved-target`, `gold-parse-failure`) so a shared legacy/gold divergence is visible as a gold
  question, not silently scored as engine drift.
- **Oracle ownership.** Mitigation: keep scoring in one small module with fixture tests for every
  status; the harness's injectable-seam design (`compiledParity({...}, deps)`) is a good precedent to
  copy conceptually, not to restore.
- **Corpus maintenance.** Mitigation: pin corpus counts in a test so shrinkage is a visible failure;
  fail the gate on `insufficient-coverage` rather than reporting a vacuous pass.

### F5.3 — What a later phase would build (concrete steps)

1. **Admission checker** — a new `.skilled/bin/compiled-route-admission.cjs` (name is operator's
   call), peer of `compiled-route-guard.cjs` and `compiled-route-status.cjs`:
   - CLI: `--hub <id> | --all`, `--warn-only`, `--json`; exit non-zero on drift, broken bridge, or
     insufficient coverage.
   - Corpus read: playbook frontmatter `expected_workflow_mode` + `expected_leaf_resources`, `stage`;
     loud gold-parse failures; `stage` default `routing`; `negative` → suppression.
   - Decision capture: run `.skilled/bin/compiled-route.cjs --hub <hub> --prompt <text>` with
     `SPECKIT_COMPILED_ROUTING=1` so the measured path is the real serving path (Lane C's own method).
   - Bridge: `qualifiedIdToLeaf` with a per-destination-hub `modeIndex` from `leaf-manifest.json`
     merged with `mode-registry.json`.
   - Scoring: exact mode sets for concrete gold; no-route for `defer`/`UNKNOWN` with over-detection
     fail; suppression for `negative`; fitted/holdout partition with the gap reported; browser-class
     scenarios `n/a`; unresolved targets `broken`, never skipped.
2. **Tests** — fixture cases for each status and each failure sub-reason; a live smoke (sk-doc);
   a corpus-count pin.
3. **Baseline run** — run `--all` over the five admitted hubs, record the report as the replacement
   baseline, and triage any failure into engine drift vs gold staleness before wiring CI.
4. **CI wiring** — add the checker to the routing-drift workflow beside `compiled-route-guard.cjs`,
   so the fleet is measured on every routing-input change, not only at admission.
5. **Admission ceremony (only when a candidate exists)** — the parts every path needs:
   - shadow child build (`registry-compiler.cjs` + router + canary fixtures) modeled on the existing
     five and the reference recipe;
   - add the hub to the eight cohort copies/registries (F4.0) and update the lockstep tests
     (`expect(cohort.length).toBe(5)` at `.skilled/bin/compiled-routing-foundation.vitest.ts:133` is
     the exact tripwire) plus `serving-closure.manifest.json`;
   - `mint` → `refresh` against the shadow-child snapshot → explicit, reviewable
     `servingAuthority: "compiled"` flip (currently unowned — F3.2);
   - run `compiled-route-sync.cjs` to promote the closure, then `compiled-route-guard.cjs` and
     `compiled-route-status.cjs` must read `compiled-serving`;
   - run the admission checker with floors; commit by explicit pathspec.
6. **Docs** — correct `compiled-routing-architecture.md` (five hubs, current layout paths
   `009`/`014`/`013`, and the restated bar), so the next admission does not follow the stale
   seven-hub recipe (F3.5).

### F5.4 — Recommended-path costs, risks, and the one operator decision

- **Cost:** one build phase — checker (~hundreds of lines), tests, CI wiring, baseline report, doc
  correction — plus the per-candidate ceremony that every path requires.
- **Risk:** the restated bar (F5.2) and oracle ownership; both bounded by tests, a stated taxonomy
  and the baseline report.
- **Operator decision to surface:** accept the restated sentence, or demand literal legacy equality.
  Everything else in this recommendation is implementation detail. The baseline report gives the
  operator the evidence to make that call — no further investigation should be needed (SC-001).

## Ruled-Out Directions

- **Any path that admits a hub without coverage floors** — a one-scenario corpus cannot carry the
  verdict (F2.1, F4.4).
- **Reusing the canary fixtures as the admission oracle** — they are compiled expectations, not
  legacy-authored gold, and are not executed by any standing gate (F2.6, F4.5).

## Quality Note

The recommendation is grounded in the four preceding iterations' cited evidence and names its own
semantic cost rather than hiding it. No writes outside the lineage.
