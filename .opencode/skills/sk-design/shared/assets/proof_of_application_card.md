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

## 6. SOURCE PROOF

Recompute rule: raw-byte sha256 per `../../references/design_proof_token.md` section 4. Gate: `python3 ../scripts/proof_check.py --require-source-proof <this-file>.md`.

| Path | SHA256 | Anchor | Echo |
|---|---|---|---|
| `__________` | `sha256:__________` | `__________` | `__________` |

---

## 7. APPLICATION WITNESS

A witness proves a loaded rule had an observable effect on one named output choice. It does not prove the design is good; taste stays advisory. Classify each row as `not-loaded` (rule never loaded), `loaded-inert` (loaded but no output choice traces to it), or `loaded-determinative` (a cited loaded rule changed a named output choice). A ready-claim needs at least one `loaded-determinative` witness.

| Output choice | Loaded rule source | Classification | Counterfactual |
|---|---|---|---|
| `__________` | `__________` | [ ] not-loaded [ ] loaded-inert [ ] loaded-determinative | `__________` |

---

## 8. INTERACTION STATE MATRIX

Fill this section only when the surface is stateful: interactive states beyond default, including loading/error/empty/disabled states, async fetch, form submit, multi-step flow, optimistic update, or state-transition motion. For non-stateful surfaces, mark every row N/A. This section is carried by the proof-card discipline; the binary gate form lives on the interface pre-flight card.

| Matrix field | Status | Evidence or gap |
|---|---|---|
| states | [ ] pass [ ] fail [ ] N/A | `__________` |
| events | [ ] pass [ ] fail [ ] N/A | `__________` |
| transitions | [ ] pass [ ] fail [ ] N/A | `__________` |
| forbidden | [ ] pass [ ] fail [ ] N/A | `__________` |
| guards | [ ] pass [ ] fail [ ] N/A | `__________` |
| uiByState | [ ] pass [ ] fail [ ] N/A | `__________` |
| recovery | [ ] pass [ ] fail [ ] N/A | `__________` |
| a11y | [ ] pass [ ] fail [ ] N/A | `__________` |
| reducedMotion | [ ] pass [ ] fail [ ] N/A | `__________` |

---

Gate this card deterministically: `python3 ../scripts/proof_check.py <this-file>.md` exits non-zero unless all four proof fields are present and the verdict reads READY. Add `--require-source-proof` to also verify cited source files by raw-byte hash and literal echo.
Add `--require-application-witness` to also require a well-formed `loaded-determinative` witness naming both the output choice and the loaded rule source.
