---
title: "Verification Checklist: Content-bound SOURCE PROOF"
description: "Verification items for the SOURCE PROOF cards + proof_check.py --require-source-proof recompute gate, including acceptance, tamper, and no-regression evidence rows."
trigger_phrases:
  - "source proof checklist"
  - "content bound proof design build"
  - "proof_check require source proof"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
# Verification Checklist: Content-bound SOURCE PROOF

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

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Targets read in full before edit (both cards + `proof_check.py`) and `design_proof_token.md` §4 confirmed as the single hashing rule
  - **Evidence**: `__________`
- [ ] CHK-002 [P0] Scope frozen to the 2 cards + 1 script; `design_proof_token.md` reused, not edited
  - **Evidence**: `__________`

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:cards -->
## Cards

- [ ] CHK-010 [P0] `SOURCE PROOF` section present in `context_loaded_card.md` with a `[Path, SHA256, Anchor, Echo]` table
  - **Evidence**: `__________`
- [ ] CHK-011 [P0] `SOURCE PROOF` section present in `proof_of_application_card.md` with the same table shape
  - **Evidence**: `__________`
- [ ] CHK-012 [P0] sha256 field uses the raw-byte rule from `design_proof_token.md` §4 (`sha256:<64 hex>`, no trim/normalize/frontmatter-strip); no second hashing rule authored
  - **Evidence**: `__________`
- [ ] CHK-013 [P1] `proof_of_application_card.md` footer gate hint documents the stricter `--require-source-proof` mode; cards stay one-screen
  - **Evidence**: `__________`

<!-- /ANCHOR:cards -->
---

<!-- ANCHOR:checker -->
## Checker

- [ ] CHK-020 [P0] `--require-source-proof` added additively to arg parsing (beside `--json` / `--require-cards`)
  - **Evidence**: `__________`
- [ ] CHK-021 [P0] Checker recomputes each cited file's raw-byte sha256 from disk (binary read) and FAILS on digest mismatch — not on field presence
  - **Evidence**: `__________`
- [ ] CHK-022 [P0] Checker verifies the `Echo` verbatim quote exists inside the cited file and FAILS on a missing/forged anchor
  - **Evidence**: `__________`
- [ ] CHK-023 [P1] Checker fails closed on an unreadable/missing cited file (does not pass)
  - **Evidence**: `__________`
- [ ] CHK-024 [P1] Parser skips header, `|---|` separator, and placeholder rows; zero real rows under the flag → FAIL
  - **Evidence**: `__________`

<!-- /ANCHOR:checker -->
---

<!-- ANCHOR:acceptance -->
## Acceptance

- [ ] CHK-030 [P0] `proof_check.py --require-source-proof` passes (exit 0) on a faithful card
  - **Evidence**: `__________`
- [ ] CHK-031 [P0] Tampered digest (one hex char flipped) FAILS (exit 1)
  - **Evidence**: `__________`
- [ ] CHK-032 [P0] Absent/forged anchor echo FAILS (exit 1)
  - **Evidence**: `__________`

<!-- /ANCHOR:acceptance -->
---

<!-- ANCHOR:no-regression -->
## No-Regression

- [ ] CHK-040 [P0] Existing invocations unaffected: `proof_check.py <card>`, `--json`, and `--require-cards` produce output + exit code identical to the pre-change baseline
  - **Evidence**: `__________`
- [ ] CHK-041 [P1] Existing `check()` return keys (`fields`, `cards`, `ready`, `not_ready_flag`, `missing`, `ok`) and the 0/1/2 exit contract preserved
  - **Evidence**: `__________`

<!-- /ANCHOR:no-regression -->
---

<!-- ANCHOR:evergreen -->
## Evergreen + Scope

- [ ] CHK-050 [P0] No spec/packet/phase IDs or spec paths embedded in the 2 cards or the script (grep clean)
  - **Evidence**: `__________`
- [ ] CHK-051 [P0] Only `context_loaded_card.md`, `proof_of_application_card.md`, and `proof_check.py` modified
  - **Evidence**: `__________`

<!-- /ANCHOR:evergreen -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 5 | 0/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: pending
**Verified By**: pending (status: planned)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
