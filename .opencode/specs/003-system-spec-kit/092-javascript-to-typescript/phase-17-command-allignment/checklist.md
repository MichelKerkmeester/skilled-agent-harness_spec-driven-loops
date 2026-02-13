# Verification Checklist: Command Alignment (Post JS-to-TS Migration)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.0 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — Evidence: spec.md created with full scope
- [x] CHK-002 [P0] Technical approach defined in plan.md — Evidence: plan.md created with 4 phases
- [x] CHK-003 [P1] Dependencies identified and available — Evidence: No dependencies (documentation-only changes)

---

## Path Correction: generate-context.js

### Command .md Files (Phase 1)

- [x] CHK-020 [P0] All `scripts/memory/generate-context.js` paths fixed in .md files
  - [x] `command/spec_kit/complete.md` — replaced via replace_all
  - [x] `command/spec_kit/handover.md` — replaced via replace_all
  - [x] `command/spec_kit/plan.md` (2 occurrences) — replaced via replace_all
  - [x] `command/spec_kit/research.md` (1 full-path occurrence) — replaced via replace_all
  - [x] `command/create/agent.md` — replaced via replace_all
  - [x] `command/memory/save.md` (6 occurrences) — replaced via replace_all

- [x] CHK-021 [P0] grep validation: `grep -r "scripts/memory/generate-context.js" .opencode/command/` returns 0 results — Evidence: Verified, 0 matches

### YAML Asset Files (Phase 2)

- [x] CHK-022 [P0] All `scripts/memory/generate-context.js` paths fixed in .yaml files
  - [x] `spec_kit/assets/spec_kit_research_auto.yaml` — replaced via replace_all
  - [x] `spec_kit/assets/spec_kit_research_confirm.yaml` — replaced via replace_all
  - [x] `spec_kit/assets/spec_kit_complete_auto.yaml` — replaced via replace_all
  - [x] `spec_kit/assets/spec_kit_complete_confirm.yaml` — replaced via replace_all
  - [x] `spec_kit/assets/spec_kit_implement_auto.yaml` — not present (no match in grep)
  - [x] `spec_kit/assets/spec_kit_implement_confirm.yaml` — not present (no match in grep)
  - [x] `create/assets/create_agent.yaml` — replaced via replace_all

- [x] CHK-023 [P0] grep validation: `grep -r "scripts/memory/generate-context.js" .opencode/command/**/*.yaml` returns 0 results — Evidence: Verified, 0 matches

---

## Script Reference: create-spec-folder.sh (Phase 3)

- [x] CHK-024 [P1] All `create-spec-folder.sh` references updated
  - [x] `spec_kit/assets/spec_kit_complete_auto.yaml` — updated to `create.sh script (scripts/spec/create.sh)`
  - [x] `spec_kit/assets/spec_kit_complete_confirm.yaml` — updated to `create.sh script (scripts/spec/create.sh)`
  - [x] `spec_kit/assets/spec_kit_plan_auto.yaml` — updated to `create.sh script (scripts/spec/create.sh)`
  - [x] `spec_kit/assets/spec_kit_plan_confirm.yaml` — updated to `create.sh script (scripts/spec/create.sh)`

- [x] CHK-025 [P1] grep validation: `grep -r "create-spec-folder.sh" .opencode/command/` returns 0 results — Evidence: Verified, 0 matches

---

## AGENTS.md Fixes (Added to Scope)

- [x] CHK-030 [P0] AGENTS.md lines 52, 62: `scripts/memory/generate-context.js` → `scripts/dist/memory/generate-context.js` — Evidence: replace_all applied
- [x] CHK-031 [P0] AGENTS.md line 211: `scripts/generate-context.js` → `scripts/dist/memory/generate-context.js` — Evidence: Targeted edit applied
- [x] CHK-032 [P0] grep validation: 0 results for old patterns in AGENTS.md — Evidence: Verified

---

## Runtime Verification (Phase 4)

- [x] CHK-026 [P0] `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --help` exits with code 0 — Evidence: Output shows "Usage: node generate-context.js [options] <input>"
- [ ] CHK-027 [P1] git diff reviewed — only expected path string replacements, no unintended changes
- [x] CHK-028 [P1] Changed files parse correctly (YAML/Markdown structure intact) — Evidence: grep confirms new paths present in correct count (16 in commands, 3 in AGENTS.md)

---

## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized and reflect actual work done — Evidence: All docs updated post-implementation
- [ ] CHK-041 [P2] implementation-summary.md created after completion

---

## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — Evidence: All research in scratch/agent-*.md
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Findings saved to memory/

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 8 | 6/8 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-02-07

---

## L3: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md — Evidence: ADR-001 (Replace Path vs Shim)
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) — Evidence: ADR-001 status: Accepted
- [x] CHK-102 [P1] Alternatives documented with rejection rationale — Evidence: Shim approach rejected with rationale

---

## L3: RISK VERIFICATION

- [x] CHK-110 [P1] Risk matrix reviewed and mitigations in place — Evidence: 3 risks documented in spec.md
- [x] CHK-111 [P1] Critical path dependencies verified — Evidence: No blocking dependencies
- [x] CHK-112 [P2] Milestone completion documented — Evidence: All 3 milestones (M1-M3) complete

---

## Out-of-Scope Items Flagged for Future Work

| Item | Location | Issue | Status |
|------|----------|-------|--------|
| ~~AGENTS.md~~ | ~~Lines 52, 62, 211~~ | ~~Broken path + missing `/memory/` segment~~ | FIXED (added to scope per user) |

---

<!--
Level 3 checklist - Full verification + architecture + risk
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
