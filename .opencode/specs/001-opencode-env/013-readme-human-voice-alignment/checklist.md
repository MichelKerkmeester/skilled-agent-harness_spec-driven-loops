# Verification Checklist: README Human Voice Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available (HVR rules sourced)

<!-- /ANCHOR:pre-impl -->

---

## HVR Punctuation (P0 - HARD BLOCKERS)

- [ ] CHK-010 [P0] Zero em dashes (—) in any README.md file
- [ ] CHK-011 [P0] Zero semicolons (;) in any README.md file (excluding code blocks)
- [ ] CHK-012 [P0] Zero banned words remaining: leverage, robust, seamless, utilize, comprehensive, cutting-edge, innovative, streamline, facilitate, empower, holistic, synergy, paradigm
- [ ] CHK-013 [P0] workflows-documentation skill updated with HVR enforcement section

---

## HVR Voice and Style (P1 - Required)

- [ ] CHK-020 [P1] Oxford commas eliminated from all README files
- [ ] CHK-021 [P1] Active voice used throughout (no passive constructions)
- [ ] CHK-022 [P1] No exactly-3-item inline lists ("X, Y, and Z" pattern)
- [ ] CHK-023 [P1] No setup language or meta-commentary
- [ ] CHK-024 [P1] Simple words preferred over complex alternatives
- [ ] CHK-025 [P1] Direct address used consistently

---

## Anchor Tag Policy (P1 - Required)

- [ ] CHK-030 [P1] system-spec-kit/README.md retains all anchor tags
- [ ] CHK-031 [P1] All other README files have anchor tags removed
- [ ] CHK-032 [P1] No broken internal links after anchor removal

---

## Priority Alignment (P1 - Required)

- [ ] CHK-040 [P1] system-spec-kit/README.md style-aligned with root README
- [ ] CHK-041 [P1] mcp_server/README.md style-aligned with root README

---

## Meaning Preservation (P1 - Required)

- [ ] CHK-050 [P1] Spot-check of 5 random READMEs confirms meaning preserved
- [ ] CHK-051 [P1] No technical information lost during rewrites
- [ ] CHK-052 [P1] Code examples unchanged (only surrounding prose modified)

---

## Soft Deductions (P2 - Optional)

- [ ] CHK-060 [P2] Sentence variety maintained (not all same structure)
- [ ] CHK-061 [P2] Paragraph lengths reasonable (not all single-sentence)
- [ ] CHK-062 [P2] Table content voice-aligned where practical
- [ ] CHK-063 [P2] Heading style consistent across all files

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-070 [P1] Spec/plan/tasks synchronized with actual work
- [ ] CHK-071 [P1] Decision record complete (ADR-001 for HVR adoption)
- [ ] CHK-072 [P2] Implementation summary written after completion
- [ ] CHK-073 [P2] Memory context saved for future reference

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-080 [P1] Temp files in scratch/ only
- [ ] CHK-081 [P1] scratch/ cleaned before completion
- [ ] CHK-082 [P2] Findings saved to memory/

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale

<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 2/5 |
| P1 Items | 17 | 0/17 |
| P2 Items | 5 | 0/5 |

**Verification Date**: [pending]

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel Kerkmeester | Project Owner | [ ] Approved | |

<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - README Human Voice Alignment
P0: Punctuation + banned words (hard blockers)
P1: Voice, anchors, meaning preservation
P2: Soft quality improvements
-->
