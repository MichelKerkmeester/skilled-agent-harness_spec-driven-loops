---
title: "D2-R8 — Register (Brand/Product) not pinnable at command entry"
description: "Add registerPolicy{accepted,default:auto,resolutionOrder,askWhen,proofFields} plus a --register flag to command-metadata.json, emitting STATUS=ASK MISSING_REGISTER and reusing shared/register.md proof fields."
trigger_phrases:
  - "d2-r8 register pinning"
  - "register pinning design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D2-R8 — Register (Brand/Product) not pinnable at command entry

## 1. OBJECTIVE
Let a caller pin Brand or Product at command entry, and fail-closed when the register is ambiguous.

## 2. WHY
The register cannot be set at the command layer, so Brand-vs-Product dials are decided implicitly with no entry-point control or proof.

## 3. TARGET & CLASS
- **Target file(s):** `command-metadata.json` → `.opencode/commands/design/*.md`
- **Severity:** P1
- **Enforcement class:** hybrid
- **Dimension:** D2 — Command Specificity

## 4. BUILD OUTLINE
- Add `registerPolicy{accepted,default:auto,resolutionOrder,askWhen,proofFields}` + a `--register` flag.
- Emit `STATUS=ASK MISSING_REGISTER` when unresolved.
- Reuse `shared/register.md` proof fields; fixtures assert Brand≠Product dials.

## 5. ACCEPTANCE
- Fixtures show Brand vs Product producing distinct dials; an unresolved register emits `STATUS=ASK MISSING_REGISTER` (mixed-surface call stays advisory).

## 6. EVIDENCE
- `commands/design/interface.md:3` — wrapper exposes no register pin at entry.
- `shared/register.md:16` — proof fields the policy should reuse.
- Source: `research/research.md` §5 (D2-R8)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
