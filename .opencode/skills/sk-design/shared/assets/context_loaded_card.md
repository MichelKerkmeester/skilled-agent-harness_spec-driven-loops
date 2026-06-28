---
title: Context Loaded Card
description: One-screen pre-work card proving sk-design context was loaded before design, build, audit, or dispatch decisions.
trigger_phrases:
  - "context loaded card"
  - "design context manifest"
  - "pre-work context card"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Context Loaded Card

Fill this before design decisions, build work, audit claims, or agent dispatch. Full contract: `../context_loading_contract.md`.

---

## 1. OVERVIEW

This card blocks pre-work drift. Fill the surface, register, dials, loaded-file checklist, and staged proof fields before the first design or UI claim.

---

## 2. SURFACE

| Field | Value |
|---|---|
| Surface (page / route / file / frame) | `__________` |
| Task type | [ ] advice [ ] build [ ] redesign [ ] generation [ ] audit [ ] dispatch |
| Scope owner | [ ] interface [ ] foundations [ ] audit [ ] mixed bundle |

---

## 3. REGISTER AND DIALS

| Field | Value |
|---|---|
| Register set | [ ] Brand [ ] Product |
| Why | [ ] task cue [ ] surface in focus [ ] declared register |
| Dials | VARIANCE `__` / MOTION `__` / DENSITY `__` |

---

## 4. REQUIRED FILES LOADED

| File | Loaded |
|---|---|
| `../register.md` | [ ] yes [ ] no |
| `../../design-interface/references/design-process/brief_to_dials.md` | [ ] yes [ ] no |
| `../../design-interface/SKILL.md` | [ ] yes [ ] no [ ] N/A |
| `../../design-foundations/SKILL.md` | [ ] yes [ ] no [ ] N/A |
| `../../design-interface/assets/interface_preflight_card.md` | [ ] yes [ ] no [ ] N/A |
| Foundations contrast refs for color/text-surface work | [ ] yes [ ] no [ ] N/A |
| `../../design-audit/references/audit_contract.md` for audit/readiness claims | [ ] yes [ ] no [ ] N/A |
| Audit evidence refs or worksheet for score/accessibility/release claims | [ ] yes [ ] no [ ] N/A |
| Small-model profile for delegation | [ ] yes [ ] no [ ] N/A |

---

## 5. PROOF FIELDS STAGED

| Proof field | Staged |
|---|---|
| REGISTER / WHY / DIALS / DOWNSTREAM EFFECT | [ ] yes [ ] no |
| CONTRAST PAIRS | [ ] yes [ ] no [ ] N/A |
| INTERFACE PREFLIGHT | [ ] yes [ ] no [ ] N/A |
| AUDIT EVIDENCE | [ ] yes [ ] no [ ] N/A |

Context verdict: [ ] LOADED [ ] BLOCKED, gaps: `__________`

---

## 6. SOURCE PROOF

Recompute rule: raw-byte sha256 per `../../references/design_proof_token.md` section 4. Gate: `python3 ../scripts/proof_check.py --require-source-proof <this-file>.md`.

| Path | SHA256 | Anchor | Echo |
|---|---|---|---|
| `__________` | `sha256:__________` | `__________` | `__________` |
