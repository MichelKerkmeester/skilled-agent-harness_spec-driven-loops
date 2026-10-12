---
title: Deep Review Strategy, playbook path repair
description: Session tracking for the five-iteration review of the playbook path repair commits.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Playbook Path Repair

## 1. OVERVIEW

Persistent state for the review of commits 41302e72be..HEAD on worktrees/118-playbook-paths.

## 2. TOPIC
The playbook path repair commits 41302e72be..HEAD on branch worktrees/118-playbook-paths: the validator change (symlink and .skilled/release/ rules plus tests) and the backticked path corrections across 223 manual-testing-playbook files.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Not the 89 non-path warnings the validator still reports; they are out of this phase's scope.
- Not version lines in child docs; the phase forbids adding or changing them.
- Not the release changelog `.skilled/changelog/skilled/v4.0.0.4.md`.

---

## 5. STOP CONDITIONS
- stopPolicy is max-iterations: run all 5 iterations; convergence is telemetry only.
- Halt on 3 consecutive dispatch errors.

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
- P1 (Required): 1
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Mechanical hunk classification plus old-to-new token pairing over the 127-file cli diff isolated every non-path hunk and the one removed table row without reading all 223 files (iteration 2)
- Per-package strict validator runs as the existence proof, with the full manual-testing-playbook directory path required (iteration 2)
- Ledger-row to package mapping over the full 234-file diff proved all 29 rows trace to changes and no playbook file sits outside a row (iteration 3)
- Word-diff slices plus git ls-files resolution closed the non-cli identity check without reading all 96 files (iteration 3)
- Six-surface version grep plus the three compiled-routing and Hermes checks in one batch closed the maintainability consistency question with zero drift (iteration 5)

---

## 9. WHAT FAILED
- Bare `--package <id>` proof invocations exit 2; the resolver accepts only directory paths (iteration 2)
- The first token-pair grouping script used a wrong path-field index and silently produced zero classes for five packages; corrected on retry (iteration 2)
- A compact awk extraction died on shell quoting; the per-file JS parse plus word-diff slices replaced it (iteration 3)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **agent_cross_runtime / feature_catalog_code**: not re-entered (covered in iteration 3). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **agent_cross_runtime / feature_catalog_code**: not re-entered (covered in iteration 3).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **agent_cross_runtime / feature_catalog_code**: not re-entered (covered in iteration 3).

### **checklist_evidence (n/a)**: no acceptance-criteria row is scoped to the security dimension this iteration. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **checklist_evidence (n/a)**: no acceptance-criteria row is scoped to the security dimension this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **checklist_evidence (n/a)**: no acceptance-criteria row is scoped to the security dimension this iteration.

### **checklist_evidence (not applicable)**: no acceptance-criteria row is scoped to maintainability. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **checklist_evidence (not applicable)**: no acceptance-criteria row is scoped to maintainability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **checklist_evidence (not applicable)**: no acceptance-criteria row is scoped to maintainability.

### **Cross-runtime**: the only non-`.skilled` sk-doc surface is `.hermes/skills/sk-doc/SKILL.md`; it carries the same 2.3.7.0 bump and no stale 2.3.6.0 copy exists under `.hermes`/`.opencode`/`.claude`/`.codex`/`.cursor`/`.pi`. Both compiled sk-doc manifests (source mirror under `specs/sk-doc/z_archive` and repo copy under `.skilled/bin`) carry the same new hash -- no compiled/source divergence. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Cross-runtime**: the only non-`.skilled` sk-doc surface is `.hermes/skills/sk-doc/SKILL.md`; it carries the same 2.3.7.0 bump and no stale 2.3.6.0 copy exists under `.hermes`/`.opencode`/`.claude`/`.codex`/`.cursor`/`.pi`. Both compiled sk-doc manifests (source mirror under `specs/sk-doc/z_archive` and repo copy under `.skilled/bin`) carry the same new hash -- no compiled/source divergence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Cross-runtime**: the only non-`.skilled` sk-doc surface is `.hermes/skills/sk-doc/SKILL.md`; it carries the same 2.3.7.0 bump and no stale 2.3.6.0 copy exists under `.hermes`/`.opencode`/`.claude`/`.codex`/`.cursor`/`.pi`. Both compiled sk-doc manifests (source mirror under `specs/sk-doc/z_archive` and repo copy under `.skilled/bin`) carry the same new hash -- no compiled/source divergence.

### **Feature catalogs**: no stale `tool-input-schemas`, `memory-indexer` or `search-flags` references remain in the deep-ai-council and system-spec-kit feature-catalog trees. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Feature catalogs**: no stale `tool-input-schemas`, `memory-indexer` or `search-flags` references remain in the deep-ai-council and system-spec-kit feature-catalog trees.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Feature catalogs**: no stale `tool-input-schemas`, `memory-indexer` or `search-flags` references remain in the deep-ai-council and system-spec-kit feature-catalog trees.

### **Non-cli resolution**: each added/removed path-like token was classified either as a repo target that resolves via `git ls-files` (direct path or unique basename) or as an explicit external/placeholder class; no repo-intended token fails to resolve. The only `test -e` failure among repair targets (`.opencode/plugins/sk-vision.js`) is the tracked symlink above, not a wrong target. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Non-cli resolution**: each added/removed path-like token was classified either as a repo target that resolves via `git ls-files` (direct path or unique basename) or as an explicit external/placeholder class; no repo-intended token fails to resolve. The only `test -e` failure among repair targets (`.opencode/plugins/sk-vision.js`) is the tracked symlink above, not a wrong target.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Non-cli resolution**: each added/removed path-like token was classified either as a repo target that resolves via `git ls-files` (direct path or unique basename) or as an explicit external/placeholder class; no repo-intended token fails to resolve. The only `test -e` failure among repair targets (`.opencode/plugins/sk-vision.js`) is the tracked symlink above, not a wrong target.

### **playbook_capability (pass)**: added-line sweep over the 223-file diff across destructive, secret and personal-path classes; all skip-token variables carry in-scenario definitions. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **playbook_capability (pass)**: added-line sweep over the 223-file diff across destructive, secret and personal-path classes; all skip-token variables carry in-scenario definitions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **playbook_capability (pass)**: added-line sweep over the 223-file diff across destructive, secret and personal-path classes; all skip-token variables carry in-scenario definitions.

### **playbook_capability (pass)**: added-line sweep; no playbook claim contradicts the new rules. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **playbook_capability (pass)**: added-line sweep; no playbook claim contradicts the new rules.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **playbook_capability (pass)**: added-line sweep; no playbook claim contradicts the new rules.

### **Recording gap (carried)**: `implementation-summary.md` is still scaffold text; the ledger's Fixed/Closed side and the Remaining table cannot be traced at HEAD. Same root as R1-P1-001; not re-raised as a new finding. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Recording gap (carried)**: `implementation-summary.md` is still scaffold text; the ledger's Fixed/Closed side and the Remaining table cannot be traced at HEAD. Same root as R1-P1-001; not re-raised as a new finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Recording gap (carried)**: `implementation-summary.md` is still scaffold text; the ledger's Fixed/Closed side and the Remaining table cannot be traced at HEAD. Same root as R1-P1-001; not re-raised as a new finding.

### **Removed-reference sweep** (question 3 above): D1-compliant removals only; no successor exists for any removed target; no residual citations. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Removed-reference sweep** (question 3 above): D1-compliant removals only; no successor exists for any removed target; no residual citations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Removed-reference sweep** (question 3 above): D1-compliant removals only; no successor exists for any removed target; no residual citations.

### **Row-to-change map**: every ledger row has package-local changes; no changed playbook file lacks a row; the four commit trailers and the sk-doc changelog connect PP-V to its surfaces. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Row-to-change map**: every ledger row has package-local changes; no changed playbook file lacks a row; the four commit trailers and the sk-doc changelog connect PP-V to its surfaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Row-to-change map**: every ledger row has package-local changes; no changed playbook file lacks a row; the four commit trailers and the sk-doc changelog connect PP-V to its surfaces.

### **skill_agent (pass)**: `2.3.7.0` consistent across the five surfaces plus the Hermes mirror; `compiled-route-sync --check` (55/55 served copies match), `compiled-route-guard` (sk-doc fresh) and `sync-skills-hermes --check` (68 copies) all exit 0. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **skill_agent (pass)**: `2.3.7.0` consistent across the five surfaces plus the Hermes mirror; `compiled-route-sync --check` (55/55 served copies match), `compiled-route-guard` (sk-doc fresh) and `sync-skills-hermes --check` (68 copies) all exit 0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **skill_agent (pass)**: `2.3.7.0` consistent across the five surfaces plus the Hermes mirror; `compiled-route-sync --check` (55/55 served copies match), `compiled-route-guard` (sk-doc fresh) and `sync-skills-hermes --check` (68 copies) all exit 0.

### **skill_agent / agent_cross_runtime / feature_catalog_code**: not re-entered (swept in iterations 1 and 3). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **skill_agent / agent_cross_runtime / feature_catalog_code**: not re-entered (swept in iterations 1 and 3).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **skill_agent / agent_cross_runtime / feature_catalog_code**: not re-entered (swept in iterations 1 and 3).

### **spec_code (partial)**: the changelog and version surfaces map to the change they describe; spec-side REQ rows were verified in iteration 3 (SL-016) and are not re-entered. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **spec_code (partial)**: the changelog and version surfaces map to the change they describe; spec-side REQ rows were verified in iteration 3 (SL-016) and are not re-entered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code (partial)**: the changelog and version surfaces map to the change they describe; spec-side REQ rows were verified in iteration 3 (SL-016) and are not re-entered.

### **spec_code (partial)**: the PP-V validator rule traces to its exercised test rows; spec-side ledger mapping was verified in iteration 3 (SL-016) and is not re-entered here. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **spec_code (partial)**: the PP-V validator rule traces to its exercised test rows; spec-side ledger mapping was verified in iteration 3 (SL-016) and is not re-entered here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code (partial)**: the PP-V validator rule traces to its exercised test rows; spec-side ledger mapping was verified in iteration 3 (SL-016) and is not re-entered here.

### core `checklist_evidence`: blocked (swept direction; implementation summary still scaffold). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: core `checklist_evidence`: blocked (swept direction; implementation summary still scaffold).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: core `checklist_evidence`: blocked (swept direction; implementation summary still scaffold).

### core `spec_code`: blocked (swept direction, REQ-001 evaluation not re-entered). R1-P1-001 carried. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: core `spec_code`: blocked (swept direction, REQ-001 evaluation not re-entered). R1-P1-001 carried.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: core `spec_code`: blocked (swept direction, REQ-001 evaluation not re-entered). R1-P1-001 carried.

### core/checklist_evidence: `implementation-summary.md` is still scaffold text; AC-001 is marked Unmet -- consistent with R1-P1-001. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: core/checklist_evidence: `implementation-summary.md` is still scaffold text; AC-001 is marked Unmet -- consistent with R1-P1-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: core/checklist_evidence: `implementation-summary.md` is still scaffold text; AC-001 is marked Unmet -- consistent with R1-P1-001.

### core/spec_code: REQ-001 evaluated against HEAD -- 1 warning vs 0 Remaining rows -> R1-P1-001. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: core/spec_code: REQ-001 evaluated against HEAD -- 1 warning vs 0 Remaining rows -> R1-P1-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: core/spec_code: REQ-001 evaluated against HEAD -- 1 warning vs 0 Remaining rows -> R1-P1-001.

### overlay `agent_cross_runtime`, `feature_catalog_code`: deferred to the traceability iteration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: overlay `agent_cross_runtime`, `feature_catalog_code`: deferred to the traceability iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay `agent_cross_runtime`, `feature_catalog_code`: deferred to the traceability iteration.

### overlay `playbook_capability`: pass. 7/7 package runs clean; the 127-file diff carries no new unresolved backticked path. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: overlay `playbook_capability`: pass. 7/7 package runs clean; the 127-file diff carries no new unresolved backticked path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay `playbook_capability`: pass. 7/7 package runs clean; the 127-file diff carries no new unresolved backticked path.

### overlay `skill_agent`: not re-entered (swept in iteration 1). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: overlay `skill_agent`: not re-entered (swept in iteration 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay `skill_agent`: not re-entered (swept in iteration 1).

### overlay/playbook_capability: fleet validator run over all packages: 1 `BACKTICK_PATH_UNRESOLVED`, exit 0 under strict, confirming the repairs took the corpus from 258 to 1. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: overlay/playbook_capability: fleet validator run over all packages: 1 `BACKTICK_PATH_UNRESOLVED`, exit 0 under strict, confirming the repairs took the corpus from 258 to 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay/playbook_capability: fleet validator run over all packages: 1 `BACKTICK_PATH_UNRESOLVED`, exit 0 under strict, confirming the repairs took the corpus from 258 to 1.

### overlay/skill_agent: validator rules live in `sk-doc` scripts; no skill or reference doc references `BACKTICK_PATH_UNRESOLVED`, so no documented surface drifted. `agent_cross_runtime` and `feature_catalog_code` deferred to the traceability iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: overlay/skill_agent: validator rules live in `sk-doc` scripts; no skill or reference doc references `BACKTICK_PATH_UNRESOLVED`, so no documented surface drifted. `agent_cross_runtime` and `feature_catalog_code` deferred to the traceability iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay/skill_agent: validator rules live in `sk-doc` scripts; no skill or reference doc references `BACKTICK_PATH_UNRESOLVED`, so no documented surface drifted. `agent_cross_runtime` and `feature_catalog_code` deferred to the traceability iteration.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- Path-intent mismatch across all 156 token substitutions: every substitution class resolves to the artifact its scenario names (iteration 2, evidence: 7/7 strict package validator runs plus leaf-heading checks)
- Deleted devin `CLAUDE.md` anchor row: no `CLAUDE.md` exists at the repo root or in the skill tree, so the row had no correct target (iteration 2, evidence: filesystem checks and `git ls-files`)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- Baseline: 258 BACKTICK_PATH_UNRESOLVED warnings; after the commits the validator prints 1 (`.cursor/worktrees.json`, kept on purpose as RM-1).
- The full scope list (234 files) is in deep-review-config.json reviewScopeFiles.
- Proof per package: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package <id>`.
- Diff to review: `git diff 41302e72be..HEAD`.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| validate-playbook-package.cjs + test | - | - | - | pending |
| cli-external-orchestration playbooks (127 files) | - | - | - | pending |
| skill playbook families (85 files) | - | - | - | pending |
| sk-doc bump, changelog, manifest, Hermes mirror (9 files) | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-10-12T06:18:50.635Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-10-12T06:18:50.635Z
<!-- MACHINE-OWNED: END -->

resource-map.md not present; skipping coverage gate.
