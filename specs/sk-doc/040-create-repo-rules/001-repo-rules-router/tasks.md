---
title: "Tasks: Repo Rules Router and Thinking-Discipline Rule Snippets"
description: "Ordered task breakdown and verification checklist for creating REPO RULES.md and the six /repo-rules leaf documents."
trigger_phrases:
  - "repo rules tasks"
  - "rule snippet checklist"
  - "router verification"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Repo Rules Router and Thinking-Discipline Rule Snippets

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `AGENTS.md` end to end and outline its ten sections (`AGENTS.md`)
- [x] T002 Locate every existing reference to `REPO RULES.md` and classify each as consumer or third-party mention (`AGENTS.md` §3, `.opencode/skills/sk-code/sk-code-obsidian/references/*.md`)
- [x] T003 Select the compressed operating-discipline rows worth expanding, excluding all skill-routing, workflow, spec-mechanics, agent-dispatch and MCP content
- [x] T004 Scaffold the Level 2 packet and relocate it to the `agents` track (`specs/sk-doc/040-create-repo-rules/001-repo-rules-router/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Author the router: loading protocol, precedence ladder, trigger table, index, scope statement (`REPO RULES.md`)
- [x] T006 [P] Author the over-engineering rule: restraint ladder, pre-write pass, signal table, per-domain restraints, what-it-is-not (`repo-rules/overengineering.md`)
- [x] T007 [P] Author the scope-discipline rule: three drifts, default scope, always-ask set, adjacent-defect protocol, plan deviation, amendment (`repo-rules/scope-discipline.md`)
- [x] T008 [P] Author the evidence rule: claim tiers, command evidence, four ways a green run lies, negative control, baselines, proof plan, final-state proof (`repo-rules/evidence-and-proof.md`)
- [x] T009 [P] Author the blast-radius rule: stakes read, reversibility ladder, rollback sentence, old-contract consumers, persistence boundaries (`repo-rules/blast-radius.md`)
- [x] T010 [P] Author the root-cause rule: diagnostic loop, symptom smells, repeat-without-new-evidence stop, seam naming, flake evidence, escalation format (`repo-rules/root-cause.md`)
- [x] T011 [P] Author the uncertainty rule: confidence bands, UNKNOWN, never-invent list, truth over agreement, contradiction halt, close-out (`repo-rules/uncertainty-and-honesty.md`)
- [x] T012 Cross-link composing rules by filename rather than restating them (`repo-rules/*.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Resolve every `repo-rules/*.md` link in the router against the filesystem — 6/6 `OK`
- [x] T014 Confirm none of the new paths are git-ignored — `git check-ignore -v` exit 1 (no match)
- [x] T015 Sweep the leaves for excluded vocabulary (`skill`, `workflow`, `spec folder`, `mcp`, `advisor`, `dispatch`) — `NO MATCHES` after removing one `named workflow` phrase from `scope-discipline.md`
- [x] T016 Confirm all six leaves carry the four required sections — `fires=1 rule=1 selfcheck=1` for each
- [x] T017 Run `validate.sh <folder> --strict` and require an explicit `RESULT: PASSED` — PASSED, exit 0, 0 errors 0 warnings, after repairing derived metadata and generating `description.json`
- [x] T018 Complete packet docs and reconcile completion metadata across spec / plan / tasks / acceptance-criteria / implementation-summary
- [x] T019 Apply an independent review: verify all 10 findings against `AGENTS.md`, fix 4 contradictions, remove 5 duplications, close the task-specific-proof gap
- [x] T020 Strengthen the `AGENTS.md` `REPO RULES.md` reference: top-block split statement, §3 load instruction, Self-Check line, §10 row (+3 net lines), keeping every mention conditional so the shared template stays correct where no `REPO RULES.md` exists
- [x] T021 Promote the load to `GATE 5: REPO RULES LOAD [HARD] BLOCK` in §2, placed after Gate 4 so Gate 2 and its tiebreakers stay contiguous; shrink the §3 bullet to a pointer so the gate is the single owner of the mechanics
- [x] T022 State the load-versus-content split at both ends — `AGENTS.md` GATE 5 and the `REPO RULES.md` precedence section — so a mandatory load cannot be read as promoting rule content above `AGENTS.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure gate**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001…REQ-009
- [x] CHK-002 [P0] Technical approach defined in plan.md — router + leaves, §3
- [x] CHK-003 [P1] Dependencies identified and available — `AGENTS.md` §3 confirmed; both MCP daemons recorded as unavailable this session
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Lint/format checks — N/A, no code in this packet; markdown structural checks run instead (T016)
- [x] CHK-011 [P0] No console errors or warnings — N/A, no executable surface
- [x] CHK-012 [P1] Error handling implemented — N/A; the router's equivalent is the no-match branch, which states that `AGENTS.md` alone governs
- [x] CHK-013 [P1] Follows project patterns — router-plus-leaves mirrors the existing hub/leaf convention in this repository
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — `acceptance-criteria.md`, AC-001…AC-009 all `Met`
- [x] CHK-021 [P0] Manual testing complete — each leaf read standalone against REQ-006
- [x] CHK-022 [P1] Edge cases tested — no-match, two-match, already-in-context and missing-link branches all addressed in the router and verified by T013
- [x] CHK-023 [P1] Error scenarios validated — broken router link would fail T013; sweep regression would fail T015
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class — N/A, this packet fixes no defect; it creates a file an existing instruction already points at
- [x] CHK-FIX-002 [P0] Same-class producer inventory — `grep -rn "REPO RULES" . --include=*.md`, 5 hits, all classified in `plan.md` Affected Surfaces
- [x] CHK-FIX-003 [P0] Consumer inventory — one real consumer (`AGENTS.md` §3), unchanged; four third-party-scoped mentions, not consumers
- [x] CHK-FIX-004 [P0] Adversarial table tests — N/A, no path handling, parsing, redaction or security surface
- [x] CHK-FIX-005 [P1] Matrix axes — N/A, single axis (rule file), six rows, all authored
- [x] CHK-FIX-006 [P1] Hostile env variant — N/A, no process-wide state read
- [x] CHK-FIX-007 [P1] Evidence pinned — evidence is command output captured in this session and reproducible from the committed tree
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — prose only; no credentials, tokens, hostnames or paths outside the repository
- [x] CHK-031 [P0] Input validation — N/A, no input surface
- [x] CHK-032 [P1] Auth/authz — N/A, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — all three describe the same seven files and the same nine requirements
- [x] CHK-041 [P1] Comments adequate — N/A, no code; each leaf states its own trigger and binding rule inline
- [x] CHK-042 [P2] README updated — deferred: no root README section indexes repository doctrine today, and adding one is outside the frozen scope
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — no temp files were created
- [x] CHK-051 [P1] scratch/ cleaned before completion — contains only `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 (deferred with reason) |

**Verification Date**: 2026-08-31
<!-- /ANCHOR:summary -->

---
