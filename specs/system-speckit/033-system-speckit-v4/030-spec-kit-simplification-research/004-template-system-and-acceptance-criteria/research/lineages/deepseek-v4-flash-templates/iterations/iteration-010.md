# Iteration 010 — Final cross-angle consistency sweep and synthesis preparation

- Angle: registry-level consistency of the whole corpus — ID uniqueness, severity calibration, path:line presence, cross-file contradictions, and the answers to every carried question.
- Result: 34 findings, all unique, all with path:line + severity + one-line action; 0 new findings this iteration (newInfoRatio 0.0 — the surface is saturated; per the stopPolicy this is telemetry, not a stop, but the loop has reached its cap at 10).
- Corrections applied during the sweep: iteration-005's "41 registry rules" → 39 (recounted: 39 rules, unchanged from round one); the root README carries NO mention of --sharded (the phantom flag is advertised only inside create.sh — f-iter009-001's surface is create.sh only).
- Final corpus: code=34 findings (6 P1 / 28 P2); 20 ruled-out directions; 8/8 RQ answered; 9 carried questions closed or scoped (CQ-001..CQ-009); 1 amendment chain (f-iter002-005 re-listed with new evidence in f-iter006-002 — the only round-one row re-listed, per the "new evidence the stated reason is wrong" rule).
- Per-charter check: (1) remediation verification ✓ done (it-001..008); (2) round-one misses found ✓ (—sharded, privateTaxonomy, sentinel branch, 010's own AC, goal anchors, research/research.md resolution, changelog, TEMPLATE_SOURCE set, has_file_line, FREEFORM comment, auto-upgrade set, ToC list, README trigger row, playbook contradiction — 14 of 34 findings are outside round one's ledger or refine its classes); (3) kept rows re-examined ✓ — only f-iter002-005 re-listed (new evidence: goal.md is now flag-owned, the disposition's "author-written" criterion does not match the list); f-iter006-002 and f-iter004-004 kept with fresh counts (88 goal docs/26 binding; 157 AC files/138 Met/31 cite).
- Recommendation-mix for the synthesis: fix = the 6 P1 + the machine-adjacent P2s (sentinel branch, collectDocuments union, TOCTOU list, auto-upgrade set, goldens, parity pins, templates/README tree, has_file_line); document = playbook row, EXTENSION-GUIDE field semantics, checker scope, resource-map continuity, changelog status, FREEFORM policy, SKILL gate scope; remove = --sharded, privateTaxonomy, stress-test/, resource-map manual-render exception can stay.

## Ruled out (this iteration)
- any cross-finding contradiction: RULED OUT — spot re-checks of the P1s' cited lines (check-template-source.sh:52-55, check-ac-coverage.sh:381-396, template-utils.sh:201-226, spec-kit-docs.json:175-185, create.sh:450-475) held verbatim after every later iteration's re-reads.
- root README advertises the sharded flag: RULED OUT — grep of repo-root README for 'sharded' returns nothing; create.sh alone (help :284, example :332, block :1722-1762) is the live surface.

## Synthesis prep notes
- newInfoRatio trend: 1.0, 0.444, 0.417, 0.364, 0.308, 0.214, 0.273, 0.222, 0.167, 0.0 (mean ≈ 0.341) — no triple-consecutive ≤0.05 before the cap; stopReason = maxIterationsReached.
- The synthesis (research.md) and resource-map.md will be written immediately after this iteration; the terminal event will carry stopReason "maxIterationsReached".
