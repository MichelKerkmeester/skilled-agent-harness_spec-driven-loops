---
title: "Deep Review Strategy: 010 Hook Feature Flags + Full Hub Index (pi lineage)"
description: "Persistent brain for the fanout-pi review lineage on packet 010. Tracks dimension coverage, findings, next focus across 10 iterations."
trigger_phrases:
  - "deep review strategy packet 010"
  - "hook feature flags review"
  - "fanout-pi lineage"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking

## 2. TOPIC
Review of `specs/hooks/010-hook-feature-flags-and-hub-index` — a Level-3 spec packet covering: (1) per-concern kill-switch feature flags for ~90 repo-authored runtime hooks across six runtimes behind `isHookEnabled(concern)` + master switch `MK_HOOKS_DISABLED`, and (2) the full browsable hub index at `.opencode/hooks/` where skill-owned hooks are symlinked in under `<concern>/<runtime>/`.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [x] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [x] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [x] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS
- Not assessing the internal logic quality of each hook's domain logic (dispatch rules, MCP routing heuristics, goal tracking verifier) beyond whether the kill-switch guard is correctly wired and default-on behavior is preserved.
- Not re-validating the git pre-commit chain (covered by git/ tree docs, out of the flag/hub scope).
- Not reviewing third-party / non-authored hooks.
- Not an implementation pass: no code changes under review; findings only.

---

## 5. STOP CONDITIONS
- Hard stop: `maxIterations` (10) reached — stopPolicy is `max-iterations`, so convergence before the ceiling is telemetry only and angles are broadened instead of synthesizing early.
- Convergence (telemetry): all 4 dimensions covered, required traceability protocols (`spec_code`, `checklist_evidence`) covered, no active P0/P1, stabilization pass aged >= 1.
- Escalate: 3+ consecutive timeouts, state corruption, all dimensions covered with P0 remaining, security vuln in production code, all recovery tiers exhausted.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | PASS (1 P2) | 1 | Guard core logic correct (7/7 tests), adapter entry placement correct; 1 P2 efficiency finding in cursor proxy |
| D2 Security | PASS (1 P2) | 2 | Fail-open posture verified across adapters/plugins; 1 P2 installer exclusion from kill-switch surface |
| D3 Traceability | CONDITIONAL (1 P1) | 3,4 | spec_code + checklist_evidence partial: spec/plan status contradiction (F003), 3 doc-state P2s (F004-F006) |
| D4 Maintainability | PASS (2 P2) | 5 | README tree/prose drift (F007-F008); naming and matrix otherwise coherent |
| D4 Maintainability (broaden) | PASS (0 new) | 6,10 | Hub completeness vs matrix verified; cursor mirror entrypoint present (F009 doc residue); mirrors/hub all resolve |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 1 active
- **P2 (Minor):** 8 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2 (final stabilization sweep clean)

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
- Running the guard test suite directly (`node --test`) as an objective baseline (iteration 1)
- Cross-checking the in-tree `_DISABLED` env sweep against the alias table to prove alias coverage (iteration 1)
- Sampling guard placement across all module flavors (.cjs/.mjs/.ts) at entry (iteration 1)

---

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]

---

## 10. EXHAUSTED APPROACHES (do not retry)
[Populated when a review approach has been tried from multiple angles without yielding new findings]

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- MACHINE-OWNED: END -->

---

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
PHASE SYNTHESIS — compile review-report.md, dedup registry, replay convergence, finalize verdict.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers:
  - Spec docs: `specs/hooks/010-hook-feature-flags-and-hub-index/{spec,plan,tasks,implementation-summary}.md`
  - Guard core: `.opencode/hooks/shared/hook-flags.{cjs,mjs,ts}` + `hook-flags.test.cjs` (7 tests)
  - Hub index: `.opencode/hooks/README.md` (incl. 15-concern × 6-runtime coverage matrix), `injection-contract.md`
  - Symlink tree: `.opencode/hooks/<concern>/<runtime>/` (58 symlinks), `.pi/extensions/` (18 entries), `.opencode/plugins/` (14 `mk-*.js`)
  - Skill-owned hook sources: `system-spec-kit/mcp-server/hooks/**`, `system-skill-advisor/hooks/**`
- Behavior claims to verify:
  - `isHookEnabled(concern)`: master `MK_HOOKS_DISABLED` OR canonical `MK_<CONCERN>_DISABLED` OR legacy alias → disabled; default on.
  - Truthy = `1|true|yes|on`, case/space-insensitive.
  - Every adapter adds guarded early-return at entry; no other logic change.
  - Full hub index: every skill-owned hook symlinked under `<concern>/<runtime>/`, symlinks resolve.
  - Coverage matrix: every concern × runtime cell either covered, by-design, `~ partial`, or `unverified` with a stated reason.
- Reuse/convention pointers: `mcp-route-guard` pilot is the proven gating pattern; `.cjs` require / `.mjs` import / `.ts` import via `.pi/extensions/` base; fail-open posture for advisory adapters.
- Review risks and gaps: `resource-map.md not present. Skipping coverage gate` (no resource-map in this packet). dist/ trees are compiled artifacts (guards dormant until `npm run build` — noted, not re-validated from source). Some runtime wiring lives in `dist/` which is gitignored; source-level guard placement is the reviewable surface.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1,3 | Guard contract holds; spec STATUS stale (F003), count drift (F005), matrix label (F006) |
| `checklist_evidence` | core | pass | 3,4 | 27/27 [x] verified against shipped artifacts |
| `skill_agent` | overlay | notApplicable | — | target is spec-folder, not a skill |
| `agent_cross_runtime` | overlay | notApplicable | — | target is spec-folder, not an agent |
| `feature_catalog_code` | overlay | pass | 9 | No stale hub claims in catalog |
| `playbook_capability` | overlay | pass | 9 | Scenarios executable against shipped code |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| spec.md | — | — | 0/0/0 | pending |
| plan.md | — | — | 0/0/0 | pending |
| tasks.md | — | — | 0/0/0 | pending |
| implementation-summary.md | — | — | 0/0/0 | pending |
| .opencode/hooks/shared/hook-flags.cjs | correctness | 1 | 0/0/0 | partial |
| .opencode/hooks/shared/hook-flags.mjs | correctness | 1 | 0/0/0 | partial |
| .opencode/hooks/shared/hook-flags.ts | correctness | 1 | 0/0/0 | partial |
| .opencode/hooks/shared/hook-flags.test.cjs | correctness | 1 | 0/0/0 | partial |
| .opencode/hooks/dispatch/cursor/post-tool-use.mjs | correctness | 1 | 0/0/1 | partial |
| .opencode/hooks/README.md | — | — | 0/0/0 | pending |
| .opencode/hooks/injection-contract.md | — | — | 0/0/0 | pending |
| .opencode/hooks/** (58 symlinks) | — | — | 0/0/0 | pending |
| .opencode/plugins/mk-*.js (14) | correctness | 1 | 0/0/0 | partial |
| .pi/extensions/** (18) | correctness | 1 | 0/0/0 | partial |
| system-spec-kit/mcp-server/hooks/** | correctness | 1 | 0/0/0 | partial |
| system-skill-advisor/hooks/** | — | — | 0/0/0 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10 (from config; stopPolicy=max-iterations)
- Convergence threshold: 0.10 (telemetry only until ceiling)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-pi-1786595204346-uaqi6k, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Artifact dir (fanout override): `specs/hooks/010-hook-feature-flags-and-hub-index/review/lineages/pi`
- Started: 2026-08-13T04:32:00Z
<!-- MACHINE-OWNED: END -->
