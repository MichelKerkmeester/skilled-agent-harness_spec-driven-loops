# Deep Review Report — 010 Hook Feature Flags + Full Hub Index (pi lineage)

## 1. Executive Summary

| Field | Value |
|-------|-------|
| Verdict | **CONDITIONAL** |
| Active P0 | 0 |
| Active P1 | 1 |
| Active P2 | 8 |
| hasAdvisories | true |
| Scope | `specs/hooks/010-hook-feature-flags-and-hub-index` (spec-folder, Level 3) |
| Iterations | 10 (max-iterations stop policy) |
| Stop reason | maxIterationsReached (telemetry-only convergence per stopPolicy) |
| Release readiness | in-progress (1 active P1) |

The kill-switch guard implementation and full hub index are **functionally sound**: the shared guard passes 7/7 tests, all 84 guarded importers place `isHookEnabled` before work, all 14 OpenCode plugins gate at factory entry, all 15 Pi extension adapters carry the guard, all 58 hub symlinks plus all runtime discovery mirrors resolve with zero broken links, and every one of the 27 checked tasks.md items has evidence. The single P1 is a **documentation-state contradiction** (spec.md understates the packet at 30%, plan.md overstates Phase 6 as shipped) — no code defect, no security issue. The 8 P2s are documentation drift and one efficiency nit.

## 2. Planning Trigger

CONDITIONAL routes to `/speckit:plan` for remediation of the P1: reconcile `spec.md` STATUS/completion_pct and `plan.md` Phase 6 claims to the true shipped state. The P2s (README tree/prose drift, tasks.md checkbox, stale counts/residue) can be folded into the same documentation pass. No changelog yet — advisory P2s remain.

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | First/Last Seen |
|----|----------|-----------|-------|----------|-----------------|
| F003 | P1 | traceability | spec.md STATUS stale (Phases 1-2/30%) vs plan.md overstating Phase 6 — packet status contradiction | spec.md:72, spec.md:5, plan.md:50, tasks.md:5, implementation-summary.md:5 | 3/4 |
| F001 | P2 | correctness | Cursor post-tool proxy spawns children for a disabled concern | post-tool-use.mjs:101, claude-posttooluse.cjs:89, dispatch-audit-posttooluse.mjs:45 | 1/7 |
| F002 | P2 | security | SessionStart-wired Codex hook installer lacks kill-switch coverage | .claude/settings.json SessionStart, install-codex-hooks.mjs | 2/7 |
| F004 | P2 | traceability | tasks.md Phase 5 README rewrite checkbox stale (work completed) | tasks.md:47, implementation-summary.md:106 | 3/3 |
| F005 | P2 | traceability | Hub symlink count claim drifted (49 vs 58) | implementation-summary.md:104, tasks.md:45 | 3/3 |
| F006 | P2 | traceability | Matrix directive-lifecycle labeling inconsistent (embedded vs covered) | README.md:176, codex/cursor/devin session-start.ts:14 | 3/3 |
| F007 | P2 | maintainability | README DIRECTORY TREE omits the ten skill-owned concern folders | README.md:55-98 | 5/5 |
| F008 | P2 | maintainability | README pi annotations describe symlink direction backwards | README.md:70,76,83,95 | 5/5 |
| F009 | P2 | maintainability | implementation-summary stale P2 residue: cursor mirror completion entrypoint is present | implementation-summary.md:110, .cursor/hooks/README.md:11,32 | 6/6 |

## 4. Remediation Workstreams

| Lane | Findings | Action | Order |
|------|----------|--------|-------|
| L1 Packet status reconciliation | F003 | Update spec.md STATUS + completion_pct to the true shipped state; fix plan.md Phase 6 claim (Phases 1-5,7-9 shipped; Phase 6 pending deployment-side sweep); align completion_pct across the four docs | 1 |
| L2 tasks.md + summary hygiene | F004, F005, F009 | Check the Phase 5 README-rewrite box (or reword the skip note); refresh symlink count to 58; drop the resolved cursor-mirror residue | 2 |
| L3 Hub README coherence | F006, F007, F008 | Extend DIRECTORY TREE to all 15 concern folders; fix pi symlink-direction annotations; align directive-lifecycle matrix labels (by-design embedded or add hub index symlinks for codex/cursor/devin) | 3 |
| L4 Cursor proxy efficiency | F001 | Gate each proxy branch on its own `isHookEnabled` before spawning the child | 4 |
| L5 Installer kill-switch scope | F002 | Document the installer exclusion in injection-contract.md, or gate with the master switch if full-silence is intended | 5 |

## 5. Spec Seed

Minimal spec delta implied by findings:
- §7 STATUS: replace "Phases 1-2 shipped … Phase 3 fan-out next" with the actual shipped state (Phases 1-5, 7-9 shipped; Phase 6 cross-runtime validation pending deployment-side sweep). Bump `completion_pct` in line with tasks/implementation docs.
- §3 Scope (optional): add an explicit note that the Codex hook installer (`install-codex-hooks.mjs`) is a maintenance tool outside the adapter kill-switch contract (F002).

## 6. Plan Seed

1. [L1] Reconcile spec.md/plan.md/tasks.md/implementation-summary.md STATUS + completion_pct (F003).
2. [L2] Fix tasks.md checkbox, symlink count, and impl-summary residue (F004, F005, F009).
3. [L3] Rewrite README tree + pi annotations + matrix labels (F006, F007, F008).
4. [L4] Per-branch guard in cursor proxy (F001).
5. [L5] injection-contract installer note (F002).

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| spec_code | core | **partial** | Guard contract holds across sampled adapters; spec.md STATUS contradicts shipped state (F003); doc counts drifted (F005); matrix label inconsistent (F006); README tree/prose drift (F007, F008) |
| checklist_evidence | core | **pass** | 27/27 checked tasks.md items carry direct evidence; 2 unchecked items honest (Phase 6 pending; Phase 5 README work completed but box stale — F004) |
| feature_catalog_code | overlay | **pass** | No stale hub claims in catalog tree |
| playbook_capability | overlay | **pass** | Scenarios executable against shipped code |
| skill_agent | overlay | notApplicable | spec-folder target |
| agent_cross_runtime | overlay | notApplicable | spec-folder target |

## 9. Deferred Items

- P2 advisories F001-F002, F004-F009 (all actionable in the remediation lanes above; none block behavior).
- Phase 6 cross-runtime validation sweep remains pending deployment-side (per plan.md/tasks.md) — not review-blocking since the guard is default-on and every adapter fail-opens.
- Compiled `dist/` guards are dormant until `npm run build` — documented activation state, not a defect.

## 10. Audit Appendix

### Iteration Table

| Run | Focus | Dimension | newFindingsRatio | New P0/P1/P2 | Verdict |
|-----|-------|-----------|------------------|--------------|---------|
| 1 | Guard core + entry placement | correctness | 1.00 | 0/0/1 | PASS |
| 2 | Fail-open + master switch | security | 1.00 | 0/0/1 | PASS |
| 3 | spec_code protocol | traceability | 1.00 | 0/1/3 | CONDITIONAL |
| 4 | checklist_evidence | traceability | 0.50 | 0/0/0 (1 refined) | CONDITIONAL |
| 5 | README/tree coherence | maintainability | 1.00 | 0/0/2 | PASS |
| 6 | Hub completeness + mirrors | maintainability | 1.00 | 0/0/1 | PASS |
| 7 | Adversarial guard replay | correctness | 0.00 | 0/0/0 | PASS |
| 8 | Plugin registration replay | security | 0.00 | 0/0/0 | PASS |
| 9 | Overlay protocols | traceability | 0.00 | 0/0/0 | PASS |
| 10 | Mirrors + stabilization sweep | maintainability | 0.00 | 0/0/0 | PASS |

### Convergence Signal Replay

stopPolicy=max-iterations: convergence is telemetry only until the ceiling. Composite stop score at ceiling: signals were rolling-avg 0.06 (below 0.08), MAD noise floor 0.00 (below floor), dimension coverage 1.0 with stabilization ≥1 → weighted score ≈ 0.30·0 + 0.25·0 + 0.45·1 = 0.45 (below 0.60 composite threshold) at the time of the ceiling hit, so the loop ran the full 10 iterations by design. Terminal stop reason: `maxIterationsReached`.

### Legal-Stop Gate Replay (post-hoc audit)

| Gate | Pass | Notes |
|------|------|-------|
| convergenceGate | — | n/a (max-iterations stop) |
| dimensionCoverageGate | pass | 4/4 dimensions, core+overlay protocols covered |
| p0ResolutionGate | pass | 0 active P0 |
| evidenceDensityGate | pass | every finding carries file:line evidence |
| hotspotSaturationGate | pass | guard core/hub revisited across iterations 1,3,5,7 |
| claimAdjudicationGate | pass | F003 carries a typed packet; no other P0/P1 |
| fixCompletenessReplayGate | pass | not a security-sensitive fix rerun |
| candidateCoverageGate | pass | v2 search path inactive |
| graphlessFallbackGate | pass | graph unavailable → fallback ledger rows cited |

### File Coverage Matrix

| Surface | Iterations | Result |
|---------|-----------|--------|
| shared/hook-flags.{cjs,mjs,ts,test} | 1,7 | Correct, 7/7 tests |
| .opencode/hooks/** (58 symlinks) | 3,5,6,10 | All resolve; counts/matrix drift P2s |
| .opencode/plugins/mk-*.js (14) | 1,2,8 | All guard at factory entry |
| .pi/extensions/** (15 .ts) | 2,10 | All guarded, all resolve |
| Runtime configs (.claude/.codex/.cursor/.devin) | 2,4,6,8 | Wiring verified; installer exclusion F002 |
| Packet docs (spec/plan/tasks/impl-summary) | 3,4,7 | F003 (P1), F004, F005, F009 |
| README + injection-contract | 3,5 | F006, F007, F008; slugs complete |
| Catalog/playbook overlays | 9 | pass |

### Verdict Determination

activeP0=0, activeP1=1 → **CONDITIONAL** → `/speckit:plan` for the F003 documentation reconciliation (with the P2 lanes folded in). hasAdvisories=true (8 P2).
