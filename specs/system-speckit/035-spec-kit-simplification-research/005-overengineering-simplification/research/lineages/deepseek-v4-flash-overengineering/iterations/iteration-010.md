# Iteration 010 — KQ-R3: kept-row re-examination closure + the round-two ranked plan

Session: fanout-deepseek-v4-flash-overengineering-1788762836148-1dgwlq | run 10 | focus: complete the kept-row re-examination (F4, F23 — F8/F11/F13/F31/F30 done runs 4-8), fix the missing side of job 1's ledger, and rank the round-two simplification plan.
Evidence reads: `runtime/lib/validation/orchestrator.ts:102-103,295,419,432-453` (skip severity + SPECKIT_RULES narrowing), `runtime/cli/optimizer/` + `audit/promotion-reports/` (0 files). Reads cost: 2 bash calls. No node/validate/git.

## Kept-row re-examination — final verdicts (round two)

| Round-one kept row | Re-examined with | Verdict |
|---|---|---|
| F4 (`skip` severity, 0 users) | orchestrator.ts:102-103,295,419 (skip) vs :432-453 (SPECKIT_RULES narrowing: runs ONLY listed rules, fatal on unknown) | **Keep confirmed.** The narrowing is a subset-select (must re-nominate everything), not a per-row off-switch; skip remains the only disable-without-listing-all mechanism. Round-one note stands: cut or exercise at the next registry revision. |
| F8 (10 rows → 2 impls, attribution) | helper switch (run 6) — per-rule message text verified | **Keep confirmed** (direct evidence at last). |
| F11 (3,582-LOC adapter ceremony) | similarity measurement + thin precedent (run 7) | **Keep confirmed**; phase-2 scope now quantified (~70% duplicated gate text; shared.ts 12-28% is the transport layer; pi/opencode thin shapes are the in-tree precedent). |
| F13 (`opencode/` empty → census dropped) | symlink verified + README:67,82 documentation (run 7) | **Census right.** |
| F23 (optimizer promotion tail, 0 promotions) | optimizer dir re-check (this run): 5 scripts + manifest + README adoption statement + `audit/promotion-reports/` = 0 files | **Keep confirmed** (census disposition; manifest consumers out-of-boundary per boundary, UNKNOWN remains). |
| F31 (playbook provenance) | corrected corpus + re-measure 17/85 (run 8) | **Keep confirmed**; per-tree numbers corrected. |
| F30 (fingerprint definition unnamed) | 3-layer agreement verified (run 3) | **Fixed correctly**; verified. |

## Job-1 ledger (remediation completeness) — FINAL

**011 — command-surface contract realignment: PARTIAL (8/8 asset touches verified; runtime + reference/catalog consumers left behind).**
- Holds: all 8 workflow assets (acceptance-criteria closure, real template paths — 0 MISS on disk, recommend-level.sh wired in 6 sites, comment hygiene 0 residue); validate.sh printer + registry-driven test; complete.md:92 presentation boundary; README strict-only count (3, verified); validation-rules fingerprint definition (verified against code); optimizer adoption README (verified); resource-map link (file exists); BM25 zero residue (only declared-loss + changelog).
- Left behind: **F2-01** (the completion-evidence runtime gate still enforces checklist.md — the single biggest residual), **F2-02** (check-completion.sh documented as THE gate in 7+ sites, live only via the sentinel legacy path), **F2-03** (catalog upgrade-level line), **F2-05** (LOC soft-guidance ×9 lines), **F2-06** (level-decision-matrix split contract), **F2-07** (catalog Level-2 checklist line + loose "same contract" claim), **F2-08** (manifest dead fields + "match the manifest" precision), plus the new F2-10/F2-12 catalog-drift classes (pre-existing, not 011-caused, but same repair family).

**012 — pre-existing test repair: COMPLETE** (freshness fixture edits the hashed doc; manifest suite self-contained for its tracked case; twin suites complementary — verified runs 3-4). Residual: F2-09 cross-packet checker/fixture (disclosed, intentional).

## The round-two ranked simplification plan

Verdict first: **the 011/012 repair program is sound at the command surface and incomplete at the enforcement gate; this round's 5 P1s... wait — 2 P1s** (F2-01 sentinel contract-mismatch, F2-14 fake fingerprint stamps) **and 13 P2s, of which 9 are one doc-coherence sweep + 2 are one checker branch + 2 are keep-verified with corrected numbers.** No round-one capability was dropped by any recommendation; every move preserves the validated core.

| # | Move (findings) | Capability preserved | Files touched | Risk | Gain: output / adherence / maintenance |
|---|---|---|---|---|---|
| M1 | Sentinel gates on acceptance-criteria closure; checklist path demoted to legacy-compat (F2-01+F2-02) | the sentinel's advise contract, legacy checklist gating, AC_CLOSURE's own rule | `runtime/lib/hooks/completion-evidence-sentinel.cjs` (evaluateCompletionEvidence + verdict), `completion-state.cjs` (or shared AC read), sentinel tests + playbook entry, `check-completion.sh` docs | **LOW-MED** (advisory-only fail-open gate; AC evidence = the workflow's own closure rows + AC_CLOSURE's format) | completion gate matches the authored contract / agents' completion claims actually gated / checklist parser + docs die or shrink |
| M2 | Fake-stamp classification + normalization (F2-14) | everything; only adds a visible class | `continuity-freshness.ts:345-356` (+1 branch), 29 impl-summary stamps → zero placeholder | **TRIVIAL** (mechanical) | — / fake stamps no longer silent; census clean / metrics honest |
| M3 | Doc-coherence sweep (F2-03, F2-05, F2-06, F2-07, F2-08, F2-10-README-claim, F2-12) | nothing (doc alignment only) | 7 catalog/reference/asset files + rules/README.md + manifest fields | **TRIVIAL** | — / level chosen by scorer, contract single-voice / drift class that already produced 2 cross-tree errors dies |
| M4 | Wire the wikilink cluster (F2-11) | wikilink scanning (documented capability) | registry row + check-links.sh env-gate | **LOW** | link integrity actually checked / the flag has a gate / cluster gets a caller or an explicit manual-only note |
| M5 | Register check-doc-pointers.sh (F2-10) | the AGENTS.md-pointer guard class | 1 registry row + README claim fix | **LOW** | AGENTS.md pointer rot fails loud (the class already misled a lineage) / / inventory claim true |
| — | Keep-list (F2-04, F2-09, F2-13, F2-15 + round-one keeps re-verified) | nested-changelog legacy, the manifest checker test subject, the provenance decision, the corrected adoption fact | 0 | — | the measured non-bloat stays put |

**M1 is the one behavior-changing move; M2-M5 are mechanical/documentary. Expected effect on the three outcomes: better output (completion gating actually reflects the contract), better adherence in practice (sentinel + stamped attestation + scorer-based level choice), lower maintenance (one voice for level/checklist/catalog/paths; dead fields and orphan scripts resolved).**
