# Deep Review Strategy — Skill Documentation Drift Remediation (lineage: glm-max)

<!-- ANCHOR:topic -->
## topic
Independent review of phase `015-skill-doc-drift-remediation` — a documentation/scanner-config correction phase that claims to have patched all 6 drift clusters from phase 014's audit. Review verifies the claims hold against current runtime reality, with no residual drift, no new stale claims, and no regressions.
<!-- /ANCHOR:topic -->

<!-- ANCHOR:review-dimensions -->
## review-dimensions (remaining)
(all covered — see completed-dimensions)
<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## completed-dimensions
- [x] correctness (iter 1) — PASS. Clusters 1, 4, REPO_ROOT verified clean against runtime reality.
- [x] security (iter 2) — PASS. No secrets/permission changes; .claude/agents mirrors verified present; Cluster 5 exact (6).
- [x] traceability (iter 3) — CONDITIONAL. REQ-001..005 mapped green; F001 (P1) residual ai-council "primary" contradiction in playbook.md:362.
- [x] maintainability (iter 4) — CONDITIONAL. Residual-drift sweep complete; F002 (P2) CHK-010 command non-reproducible (substance clean).
<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## running-findings
- P0: 0  P1: 1 (F001)  P2: 1 (F002)
- Provisional verdict: CONDITIONAL (activeP1 > 0, activeP0 == 0)
- stopReason: maxIterationsReached (5/5); composite convergence 0.78 (telemetry only per stopPolicy=max-iterations)
<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:what-worked -->
## what-worked
(initializing)
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## what-failed
(initializing)
<!-- /ANCHER:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## exhausted-approaches
(none yet)
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## ruled-out-directions
(none yet)
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## next-focus
Iteration 1: correctness dimension — verify Cluster 1 (ai-council direct-invoke removal), Cluster 4 (scanner `MIRROR_TEMPLATES` `.toml` removal), and the REPO_ROOT off-by-one fix in the two `setup-cp-sandbox.sh` scripts. Independent grep + read, do not trust phase 014's citations.
<!-- /ANCHOR:next-focus -->

<!-- ANCHOR:known-context -->
## known-context
- Phase 015 is a FIX phase (no behavior change beyond packet 031's already-shipped changes). Predecessor: `../014-skill-doc-drift-audit/` (20-iteration audit, independently verified, zero rejections).
- 6 clusters: (1) cli-opencode direct `--agent ai-council` guidance; (2/3) `.opencode/agents/*.toml` mirror in 5 deep-loop SKILL.md docs; (4) `.toml` mirror in `scan-integration.cjs` `MIRROR_TEMPLATES` + 6 deep-improvement docs; (5) `plugins/README.md` entrypoint count (3→6); (6) orchestrate/cli-opencode routing tension.
- Cluster 6 was resolved by narrowing cli-opencode's wording; `orchestrate.md`'s `@deep-review` Priority row kept untouched (load-bearing per `deep-review.md` Caller contract).
- Spec Out-of-Scope: pre-existing `@deep-ai-council` naming mismatch; re-running the full 20-iteration audit.
- Spec NFR: preserve intentional historical/changelog text; no comment-hygiene violations in `scan-integration.cjs`.
- `resource-map.md` NOT present at init → Resource Map Coverage Gate section omitted; coverage-gate pass skipped.
<!-- /ANCHOR:known-context -->

<!-- ANCHOR:cross-reference-status -->
## cross-reference-status
| Protocol | Level | Status |
|----------|-------|--------|
| spec_code | core (hard) | pending |
| checklist_evidence | core (hard) | pending |
<!-- /ANCHOR:cross-reference-status -->

<!-- ANCHOR:files-under-review -->
## files-under-review
| File / Cluster | Coverage state |
|----------------|----------------|
| cli-opencode/SKILL.md, README.md, prompt_templates.md, playbook (Cluster 1, 6) | pending |
| 5 deep-loop SKILL.md + 2 sub-docs (Cluster 2/3) | pending |
| deep-improvement scan-integration.cjs + 6 docs (Cluster 4) | pending |
| plugins/README.md (Cluster 5) | pending |
| orchestrate.md @deep-review row (Cluster 6, untouched claim) | pending |
| setup-cp-sandbox.sh x2 (REPO_ROOT fix) | pending |
<!-- /ANCHOR:files-under-review -->

<!-- ANCHOR:review-boundaries -->
## review-boundaries
- maxIterations: 5 (stopPolicy=max-iterations; convergence before that is telemetry only — broaden angles)
- convergenceThreshold: 0.10
- severityThreshold: P2
- Scope: living operational docs + scan-integration.cjs + the phase's own spec/checklist/summary claims. Historical specs (`z_archive`, iteration files) and retired skills are correctly out of scope per spec NFR.
- Artifact dir: `review/lineages/glm-max` (fan-out lineage; strongest-restriction merge with sibling lineage gpt-fast-high).
<!-- /ANCHOR:review-boundaries -->
