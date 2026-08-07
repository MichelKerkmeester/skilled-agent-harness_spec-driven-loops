---
title: "Verification Checklist: Advisory Research"
description: "Verification evidence for the ten-pass research program determining which git operations warrant a preflight advisory."
trigger_phrases:
  - "advisory research checklist"
  - "git advisory verification"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: Advisory Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A pass that exits zero having written a summary instead of findings has not completed. That
failure occurred in the prior research program and was caught by output size, not exit status.

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Briefing states the required fields per finding
  - **Evidence**: `research/BRIEFING.md` states the five required fields per finding
- [x] CHK-002 [P0] Both transports verified present before dispatch
  - **Evidence**: `command -v devin` and `command -v opencode` both returned before dispatch
- [x] CHK-003 [P1] Devin focuses target surfaces the fan-out will not reach
  - **Evidence**: `research/manual-devin/FOCUS-PLAN.md` — five gap-targeted focuses

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P0] Every finding names the exact pre-execution state its rule would read
  - **Evidence**: `research.md` §4.2 — every candidate names its discriminator
- [x] CHK-005 [P0] Findings needing post-execution state are labelled unbuildable as preflight
  - **Evidence**: SOL findings 6 and 8 label unknowable post-execution outcomes explicitly
- [x] CHK-006 [P1] Every sk-git rule classified mechanical, partial, or judgement-only
  - **Evidence**: `research/manual-devin/devin-03.md` — 69 KB classification of every rule
- [x] CHK-007 [P1] Candidates with no prose source flagged as new and justified
  - **Evidence**: `research.md` §4.2 — F2, F3, F5-F9 marked new with justification

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P0] Ten passes completed: 5 `gpt-5.6-sol` high, 5 `glm-5-2`
  - **Evidence**: 5 SOL iterations plus 5 GLM artifacts, 325 KB total
- [x] CHK-009 [P0] No pass stopped early on convergence
  - **Evidence**: stop reason `max-iterations` at convergence 0.75
- [x] CHK-010 [P0] Every finding carries a noise estimate or an explicit not-measured statement
  - **Evidence**: `research.md` §2 — measured figures plus explicit not-measured labels
- [x] CHK-011 [P1] Noise estimates grounded in real repository history where measurable
  - **Evidence**: reflog re-derived independently: 201/1486 = 13.5%, matching both halves

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-020 [P0] Every observed incident matched to a candidate rule or explained as unadvisable
  - **Evidence**: `research.md` §3 — three of the five originally proposed rules were narrowed or refuted; the fourth and fifth survive as F1 and the worktree evidence
- [x] CHK-021 [P0] Rules the research refuted are recorded, not quietly dropped
  - **Evidence**: `research.md` §3 table plus 11 ruled-out directions in `findings-registry.json`
- [x] CHK-022 [P1] Overlap with existing enforcement identified
  - **Evidence**: two independent ruled-out entries name duplicating pre-push branch-naming and permission enforcement

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-012 [P0] Write containment held; no file modified outside this packet
  - **Evidence**: no file modified outside this packet; 0 containment events
- [x] CHK-013 [P1] Transcripts scanned for credentials before they are committed
  - **Evidence**: 43 files scanned for token, key and private-key patterns; single hit at `devin-03.md:424` is prose describing secret-detection patterns, not a credential

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-014 [P0] `research.md` ranks candidate rules with a confirmed-versus-inferred split
  - **Evidence**: `research.md` §4 tiers confirmed against mechanism-confirmed
- [x] CHK-015 [P0] A noise threshold is recommended with supporting reasoning
  - **Evidence**: `research.md` §2 — two denominators reconciled with reasoning
- [x] CHK-016 [P1] Each of the five observed incidents matched to a rule or explained as unadvisable
  - **Evidence**: `research.md` §3 — three of five narrowed or refuted, with reasons
- [x] CHK-017 [P1] At least one external prior-art comparison including where it is ignored
  - **Evidence**: `research/manual-devin/devin-04.md` — five systems, three fatigue tiers

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-018 [P0] Merged registry written under `research/`
  - **Evidence**: `research/lineages/sol/findings-registry.json`
- [x] CHK-019 [P2] Candidates belonging in the pre-push hook as enforcement identified as such
  - **Evidence**: two ruled-out entries name existing pre-push enforcement overlap

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Priority | Total | Complete | Outstanding |
|----------|-------|----------|-------------|
| P0 | 12 | 12 | 0 |
| P1 | 9 | 9 | 0 |
| P2 | 1 | 1 | 0 |

All items carry evidence from artifacts on disk, not from processes exiting zero. The measurement
claims were re-derived independently by the orchestrator rather than accepted from transcripts; the
single confirmed finding was re-checked against `git show HEAD:opencode.json` at source.

<!-- /ANCHOR:summary -->
