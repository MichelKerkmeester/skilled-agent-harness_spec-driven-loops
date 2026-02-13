# Verification Checklist: README Rewrite

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md — all 14 requirements defined with acceptance criteria
- [ ] CHK-002 [P0] Technical approach defined in plan.md — 3-phase approach with dependency graph
- [ ] CHK-003 [P1] Dependencies identified — codebase feature inventory is sole critical dependency

---

## Content Quality

- [ ] CHK-010 [P0] All 11 sections present in final README (Hero, Quick Start, Architecture, Memory Engine, Agent Network, Gate System, Spec Kit, Skills, Commands, Installation, What's Next)
- [ ] CHK-011 [P0] No placeholder text remaining — grep for `[PLACEHOLDER]`, `[TODO]`, `[TBD]` returns zero results
- [ ] CHK-012 [P1] Section order matches decision D1 — Memory Engine appears before Agent Network, Gate System before Spec Kit
- [ ] CHK-013 [P1] Writing follows project's engaging tone — no dry reference-manual sections, no repetitive marketing copy

---

## Accuracy Verification

- [ ] CHK-020 [P0] All 10 success criteria from spec.md verified with evidence
- [ ] CHK-021 [P0] Feature claims cross-referenced against codebase:
  - [ ] 22 MCP tools verified across 7 layers (L1-L7)
  - [ ] 10 agents verified (8 custom: @orchestrate, @context, @debug, @review, @research, @write, @speckit, @handover + 2 built-in: @general, @explore)
  - [ ] 9 skills verified (system-spec-kit, workflows-code--web-dev, workflows-code--full-stack, workflows-code--opencode, workflows-documentation, workflows-git, workflows-chrome-devtools, mcp-code-mode, mcp-figma)
  - [ ] 17 commands verified across 4 categories (7 spec_kit + 5 memory + 4 create + 1 utility)
  - [ ] 118 test files, 3,872 tests, 0 TS errors verified
  - [ ] 8 cognitive memory subsystems verified
  - [ ] 7 search stack components verified
  - [ ] 3 gates verified with correct descriptions
- [ ] CHK-022 [P1] All code examples in Quick Start tested and working
- [ ] CHK-023 [P1] ASCII diagrams render correctly in GitHub markdown preview

---

## Structural Verification

- [ ] CHK-030 [P0] Total line count between 400-550 lines
- [ ] CHK-031 [P0] Quick Start appears within first 50 lines
- [ ] CHK-032 [P0] Maximum 1 before/after comparison table (down from 5)
- [ ] CHK-033 [P1] Installation section under 35 lines with link to detailed guide
- [ ] CHK-034 [P1] No section exceeds its line budget by more than 20%

---

## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized — all reflect final README structure
- [ ] CHK-041 [P1] Decision record complete — all 8 decisions (D1-D8) documented with rationale
- [ ] CHK-042 [P2] Implementation summary created after completion

---

## File Organization

- [ ] CHK-050 [P1] Working files during creation stored in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Session context saved to memory/ if valuable insights discovered

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | [ ]/9 |
| P1 Items | 10 | [ ]/10 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: (pending)

---

## L3: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] All 8 architecture decisions documented in decision-record.md (D1-D8)
- [ ] CHK-101 [P1] All ADRs have Accepted status with date and rationale
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale for each decision

---

## L3: RISK VERIFICATION

- [ ] CHK-110 [P1] Risk matrix reviewed — all 6 risks (R-001 through R-006) have mitigations in place
- [ ] CHK-111 [P1] Critical path verified — feature inventory → content creation → verification sequence honored
- [ ] CHK-112 [P2] Milestone completion documented in tasks.md (M1, M2, M3)

---

<!--
Level 3 checklist - Full verification + architecture + risk
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
