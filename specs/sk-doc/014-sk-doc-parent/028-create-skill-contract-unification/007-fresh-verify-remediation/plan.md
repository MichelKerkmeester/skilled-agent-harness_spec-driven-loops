---
title: "Implementation Plan: Fresh-Verify Fleet Remediation"
description: "Verify -> remediate -> re-verify harness: a 46-agent Sonnet-5 fleet audit, surgical + fresh LUNA MAX fixes per defect, then a 12-agent fresh Sonnet-5 re-verify confirming each defect resolved on disk with no regression."
trigger_phrases:
  - "fresh verify remediation plan"
  - "remediation dispatch harness"
  - "sonnet re-verify"
importance_tier: "normal"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification/007-fresh-verify-remediation"
    last_updated_at: "2026-07-14T07:12:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Remediated fleet defects from fresh verify"
    next_safe_action: "Run advisor re-baseline for description changes"
    blockers: []
    key_files: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

# Implementation Plan: Fresh-Verify Fleet Remediation

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Auditor / verifier** | fresh `claude-sonnet-5`, reasoning effort `xhigh`, via the Workflow tool (the only path to Sonnet xhigh) |
| **Fixer (surgical)** | orchestrator, for confirmed exact edits (path renames, commas, keyword, json-guard) |
| **Fixer (substantial)** | GPT-5.6 LUNA MAX via `codex exec --model gpt-5.6-luna -c model_reasoning_effort=max`, one per investigation-heavy defect |
| **Validator** | `package_skill.py <dir> --check --strict` (children/surface); `parent-skill-check.cjs` (hubs) |

### Overview
A 46-agent Sonnet-5 xhigh audit found 11 pre-existing FAIL defects. Each is remediated by the cheapest correct means
— surgical edit where the fix is exact, a fresh LUNA MAX agent where it needs repo investigation — then re-verified by
a fresh Sonnet-5 xhigh agent that confirms the defect is resolved on disk and no regression was introduced. Work-items
are path-disjoint, so dispatches run >=5 in parallel.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Fleet audit complete (46 agents) [EVIDENCE: workflow `wf_8d695f77-ad0`; 11 PASS/24 CONCERN/11 FAIL]
- [x] Each FAIL confirmed pre-existing, not a sweep regression [EVIDENCE: `git diff` against sweep commits]
- [x] Per-defect fix mechanism chosen (surgical vs LUNA) [EVIDENCE: `plan.md` ARCHITECTURE]

### Definition of Done
- [x] All 11 defects resolved, confirmed on disk [EVIDENCE: re-verify `wf_ec00e980-b1a`; 12/12, 0 FAIL]
- [x] Surface validator branch tested [EVIDENCE: `c3352a176a`; both surface packets PASS `--strict`]
- [x] Gates green (children `--strict`, hubs 0 warnings) [EVIDENCE: `6ff2546493`; per-skill gate PASS]
- [x] `validate.sh --recursive --strict` Errors 0 on 028 [EVIDENCE: `validate.sh --recursive --strict` recursive run -> Errors:0]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### The three-stage harness
1. **Audit** — 46 fresh Sonnet-5 xhigh agents, one per SKILL.md, each running the objective gate + an independent behavior read; verdicts collected as structured output.
2. **Remediate** — triage the FAILs: surgical edits for exact fixes (5), a fresh LUNA MAX dispatch per investigation-heavy/substantial defect (6). LUNA agents are path-scoped and carry `GATE-3 PRE-RESOLVED` + the specific finding + ground-truth sources to read.
3. **Re-verify** — 12 fresh Sonnet-5 xhigh agents, each confirming its defect resolved on disk and checking for a regression introduced by the fix. CONCERN-level completeness gaps (same defect in sibling files) are closed package-wide.

### Concurrency
Audit and re-verify run as single Workflow fan-outs (auto-capped ~16 concurrent). LUNA remediation runs as background
`codex exec` processes, >=5 in parallel, path-disjoint.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Audit
- [x] 46-agent Sonnet-5 xhigh fleet verify; collect verdicts
- [x] Confirm each FAIL is pre-existing (git-diff vs sweep)

### Phase 2: Remediate
- [x] Surgical fixes for the 5 exact defects
- [x] Fresh LUNA MAX dispatch for the 6 substantial defects; orchestrator-verify each output
- [x] Followup: teach `package_skill.py` to branch on packetKind: surface

### Phase 3: Re-verify
- [x] 12-agent Sonnet-5 xhigh re-verify; confirm resolved + no regression
- [x] Close CONCERN completeness gaps (sibling files) package-wide
- [x] `validate.sh --recursive --strict` Errors 0; reconcile packet docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Objective gate | each remediated child/surface | `package_skill.py <dir> --check --strict` |
| Hub gate | each remediated parent | `parent-skill-check.cjs <hub>` (0 warnings) |
| Link resolution | broken-path fixes | `check-markdown-links.cjs` + direct existence checks |
| Independent re-verify | each defect | fresh Sonnet-5 xhigh agent |
| Packet | this folder + parent | `validate.sh --recursive --strict` Errors 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| create-skill validator (phase 000) | Internal | Green | No objective gate |
| `codex exec` + `gpt-5.6-luna` | External | Green | No LUNA remediator |
| `claude-sonnet-5` xhigh (Workflow) | Internal | Green | No audit / re-verify |
| `.utcp_config.json` / mode-registry.json | Internal | Green | No ground truth for config/mode fixes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a re-verify agent reports a defect not actually resolved, or a fix introduced a regression.
- **Procedure**: fixes are path-scoped and committed in two logical commits (validator; remediation); revert the offending path or commit; each skill's blast radius is its own dir.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Audit ──> Remediate (surgical ∥ LUNA, per defect) ──> Re-verify (confirm + close gaps + packet validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit | phase 000 validator | Remediate |
| Remediate | Audit | Re-verify |
| Re-verify | Remediate | None |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit | Low | one 46-agent fan-out |
| Remediate (11 defects) | Medium | 5 surgical + 6 LUNA + 1 validator |
| Re-verify | Low | one 12-agent fan-out + gap close |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Worktree isolated at origin tip
- [x] Each FAIL confirmed pre-existing before fixing

### Rollback Procedure
1. Identify the offending path-scoped change.
2. `git checkout` the path (or `git revert` the commit).
3. Re-run the skill's gate + a fresh re-verify to confirm the prior state.

### Data Reversal
- **Has data migrations?** No — documentation/content and one validator branch only.
<!-- /ANCHOR:l2-rollback -->
