# Verification Checklist: 138 SGQS Score Recovery Plan (Child 009, Milestone 3.5 First)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

**Locked Milestone Policy**
- Dual benchmark requirement: `Legacy20` + `V2`
- Milestone gate: `V2 >= 3.5`
- Safety gate: `Legacy20 >= 3.0`
- Historical lock: keep `006/007` unchanged
<!-- /ANCHOR:protocol -->

---

## P0

- [x] [P0] Milestone 3.5-first hard gates passed (`CHK-020`, `CHK-021`, `CHK-022`) with evidence.

## P1

- [x] [P1] Required quality and documentation gates passed (`CHK-012`, `CHK-023`, `CHK-024`, `CHK-040`, `CHK-041`, `CHK-050`) with evidence.

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Spec/plan/tasks/checklist created for child 009 [Evidence: child folder contains all 4 required planning docs]
- [x] CHK-002 [P0] Core file scopes explicitly documented (engine/parser/graph-builder/advisor) [Evidence: `spec.md` scope tables list all 4 core components]
- [x] CHK-003 [P1] Target node markdown scopes explicitly documented [Evidence: `spec.md` target node markdown scope table]
- [x] CHK-004 [P1] Test gates (TG-001..TG-006) and acceptance criteria (AC-001..AC-006) present in plan [Evidence: `plan.md` sections `## 8. TEST GATES` and `## 9. ACCEPTANCE CRITERIA`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Core files compile/runtime checks pass after recovery edits (TG-001) [Evidence: Scoped compile passed via `npx tsc scripts/sgqs/*.ts --module ES2022 --moduleResolution node --target ES2022 --outDir dist/sgqs`; full `npm run build` blocked by unrelated pre-existing `mcp_server/` TypeScript errors]
- [x] CHK-011 [P0] No unhandled runtime errors during SGQS/advisor smoke checks [Evidence: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/results-legacy20.json` and `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/results-v2.json` (`exitCode: 0`, no hard runtime errors)]
- [x] CHK-012 [P1] Scoped edits only in child 009 target files (AC-001) [Evidence: `implementation-summary.md` files-changed table documents child 009 scoped targets only]
- [x] CHK-013 [P1] Cross-skill traversal behavior is materially improved (TG-003) [Evidence: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/score-dashboard.md` (cross-skill traversal non-zero) and `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/results-v2.json`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Legacy benchmark gate passed (`Legacy20 >= 3.0`) (TG-005) [Evidence: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/results-legacy20.json` (`averageScore: 5`) and `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/score-dashboard.md` (`5.00/5.0`, PASS)]
- [x] CHK-021 [P0] Milestone benchmark gate passed (`V2 >= 3.5`) (TG-006) [Evidence: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/results-v2.json` (`averageScore: 5`) and `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/score-dashboard.md` (`5.00/5.0`, PASS)]
- [x] CHK-022 [P0] Dual benchmark protocol completed with auditable artifacts (AC-005) [Evidence: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/results-legacy20.json`, `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/results-v2.json`, `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/score-dashboard.md`]
- [x] CHK-023 [P1] Advisor routing threshold reached (>=85% correct on recovery prompts) (TG-004) [Evidence: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/score-dashboard.md` (all listed advisor probes pass threshold `0.8`)]
- [x] CHK-024 [P1] Graph build/index integrity verified on updated node set (TG-002) [Evidence: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/results-legacy20.json` and `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/results-v2.json` (`graphStats.nodes=435`, `graphStats.edges=932`, no fatal errors)]
- [x] CHK-025 [P1] Acceptance criteria AC-001..AC-006 fully satisfied [Evidence: `plan.md` AC definitions + this checklist gate evidence (`CHK-010`..`CHK-024`, `CHK-040`..`CHK-051`)]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets/tokens introduced in modified files [Evidence: Secret-pattern scan on all listed modified core/node files returned no matches]
- [x] CHK-031 [P1] No unintended file path leakage beyond current SGQS/advisor behavior [Evidence: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/results-legacy20.json` and `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/results-v2.json` show expected structured SGQS/advisor outputs]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Execution docs reflect the approved Phase 3 scope override and gate status consistently [Evidence: `tasks.md` Phase 3 and `implementation-summary.md` files-changed table both reflect the approved 9-file node target set plus implemented `sk-git` additions, with out-of-plan carryover items explicitly de-scoped (`T019`, `T020`)]
- [x] CHK-041 [P1] Gate outcomes documented with explicit pass/fail evidence [Evidence: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/results-legacy20.json`, `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/results-v2.json`, `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/score-dashboard.md`]
- [x] CHK-042 [P2] Follow-up recommendations captured for post-3.5 work [Evidence: `implementation-summary.md` documents the concrete post-3.5 follow-up to track unrelated pre-existing `mcp_server` TypeScript build errors in a separate child; score-recovery rerun requires no further action (`Legacy20=5.00`, `V2=5.00`)]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No modifications under historical baseline folders (`006`, `007`) (AC-002) [Evidence: child 009 implementation scope and files-changed table exclude `006/007`; historical folders remain out of implementation target set]
- [x] CHK-051 [P1] Temporary artifacts are confined to `scratch/` paths only [Evidence: benchmark artifacts are under `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/`]
- [x] CHK-052 [P2] Benchmark artifacts are archived with consistent naming [Evidence: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/results-legacy20.json`, `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/results-v2.json`, `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/score-dashboard.md`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 13 | 13/13 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-02-21
**Current State**: Milestone and safety gates passed (`Legacy20`: `5.00/5.0`, `V2`: `5.00/5.0`); checklist updated with gate evidence.
<!-- /ANCHOR:summary -->
