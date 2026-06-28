---
title: Proof Of Application Card
description: One-screen end-of-work card proving loaded sk-design context was applied before ready, ship, audit, or adoption claims.
trigger_phrases:
  - "proof of application card"
  - "design proof card"
  - "end of work design proof"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Proof Of Application Card

Fill this at the end of design, build, audit, or delegated work. It proves the loaded context changed the output, not merely that files were opened. Full contract: `../context_loading_contract.md`.

---

## 1. OVERVIEW

This card blocks unsupported readiness claims. Fill the read/citation ledger, proof field status, lineage attribution, and final verdict before saying the work is ready.

---

## 2. FILES READ AND CITED

| File or artifact | Cited where |
|---|---|
| `__________` | `__________` |
| `__________` | `__________` |
| `__________` | `__________` |

---

## 3. PROOF FIELDS

| Field | Status | Evidence or gap |
|---|---|---|
| REGISTER / WHY / DIALS / DOWNSTREAM EFFECT | [ ] pass [ ] fail [ ] N/A | `__________` |
| CONTRAST PAIRS | [ ] pass [ ] fail [ ] N/A | `__________` |
| INTERFACE PREFLIGHT | [ ] pass [ ] fail [ ] N/A | `__________` |
| AUDIT EVIDENCE | [ ] pass [ ] fail [ ] N/A | `__________` |

---

## 4. LINEAGE ATTRIBUTION

| Field | Value |
|---|---|
| Produced by fan-out or delegated lineage? | [ ] yes [ ] no |
| Lineage id / agent / model | `__________` |
| Merge attribution preserved? | [ ] yes [ ] no [ ] N/A |
| Adoption gate required before canonical mutation? | [ ] yes [ ] no [ ] N/A |

---

## 5. VERDICT

| Result | Mark |
|---|---|
| All applicable proof fields pass | [ ] READY |
| One or more applicable proof fields fail or are missing | [ ] NOT READY |

Gaps blocking readiness: `__________`

---

Gate this card deterministically: `python3 ../scripts/proof_check.py <this-file>.md` exits non-zero unless all four proof fields are present and the verdict reads READY.
