---
title: "D3-R6 — Content-bound SOURCE PROOF"
description: "Add a SOURCE PROOF (path/sha256/anchor/echo) to the context + application proof cards and a proof_check.py flag that recomputes digest/anchor."
trigger_phrases:
  - "d3-r6 source proof"
  - "content bound proof design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D3-R6 — Content-bound SOURCE PROOF

## 1. OBJECTIVE
Add a `SOURCE PROOF` block (path / sha256 / anchor / echo) to the context and application proof cards, and add `proof_check.py --require-source-proof` that recomputes the loaded-file digest and anchor echo rather than checking field presence.

## 2. WHY
Utilization is self-attested today: a checkbox can claim a file was loaded without proof. A content-bound digest/anchor replaces self-attestation so a ready-claim must actually bind to loaded content.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/sk-design/shared/assets/context_loaded_card.md`, `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`, `.opencode/skills/sk-design/shared/scripts/proof_check.py`
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D3 — Routing & Utilization

## 4. BUILD OUTLINE
- Add a `SOURCE PROOF` (path/sha256/anchor/echo) section to both proof cards.
- Implement `proof_check.py --require-source-proof` to recompute digest + anchor echo.
- Fail the check on digest mismatch or missing anchor, not just missing fields.
- **Candidate nested sub-phases (materialize at execution):** (a) `SOURCE PROOF` block in `context_loaded_card.md`; (b) `SOURCE PROOF` block in `proof_of_application_card.md`; (c) `proof_check.py --require-source-proof` digest/anchor recompute.

## 5. ACCEPTANCE
- `proof_check.py --require-source-proof` recomputes the loaded-file sha256 / anchor and fails on a tampered or absent digest; passes on a faithful card.

## 6. EVIDENCE
- `proof_check.py:47` — checker entry to extend with source-proof recompute.
- Source: `research/research.md` §6 (D3-R6).

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
