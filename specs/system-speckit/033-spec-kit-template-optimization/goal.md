---
title: "Operator Goal: 033 Spec-Kit Template Optimization"
description: "The operator-issued goal prompt governing packet 033, its decisions, constraints and proof plan, kept current as the phases execute."
trigger_phrases:
  - "033 goal prompt"
  - "spec kit template optimization goal"
  - "acceptance criteria goal"
importance_tier: "important"
contextType: "planning"
---

# Operator Goal: 033 Spec-Kit Template Optimization

> Issued 2026-08-29. This document is the directive the packet executes against.
> It is kept current: the Progress section below is updated as phases land.

---

## 1. OBJECTIVE

Restructure `system-speckit/033` into a phase parent, then add a canonical,
closure-blocking `acceptance-criteria.md` to the Level 2 / 3 / 3+ doc contract.
A packet cannot close until every AC row is met, waived, or superseded by an ADR.

---

## 2. GATE 3

`specs/system-speckit/033-spec-kit-template-optimization/` — phase parent.
Confirmed 2026-08-29; do not re-ask.

---

## 3. DECISIONS (operator-confirmed — do not re-litigate)

| ID | Decision |
|----|----------|
| **D1** | Restructure the existing `033-spec-template-context-optimization` in place: keep number 033, rename to `033-spec-kit-template-optimization`, demote its current docs into child `001-`. Do not absorb packet 036. |
| **D2** | `acceptance-criteria.md` is the CANONICAL AC home. `spec.md` keeps REQ IDs and drops its AC column; user-story AC blocks move out. `check-ac-coverage.sh` counts from the new doc. |
| **D3** | Forward-only rollout. Packets at/after a dated cutoff must carry the doc; older packets stay advisory. No backfill of the 2,588 existing Level 2/3/3+ packets. |

---

## 4. PHASE MAP

| Phase | Folder | Role |
|-------|--------|------|
| 001 | `001-spec-template-context-optimization` | Existing complete packet, moved verbatim. Content frozen; only its path self-references change. |
| 002 | `002-acceptance-criteria-template` | New. All build work below. |

---

## 5. PHASE 002 — BUILD

1. **Template** `templates/addons/acceptance-criteria.md.tmpl`, gated for levels 2/3/3+. Row shape: `AC-ID | REQ | Given/When/Then | Verification | Status | Waiver`.
2. **Contract** `templates/spec-kit-docs.json`: add the `documents` entry, a `versions` entry, `sectionGates`, and list it in `requiredAddonDocs` for `2`, `3`, `3+`. `check-files.sh` picks it up through `scripts/utils/template-structure.js` — no new file-presence rule needed.
3. **Closure gate**: a new rule blocks completion under `--strict` on any unmet, unwaived AC row. Register it in `scripts/lib/validator-registry.json`.
4. **Waiver path**: an AC row may only be scrapped or superseded by a decision record. The rule requires a `Waiver: ADR-NNN` cell AND that `decision-record.md` actually contains that ADR. A waiver naming a missing ADR is an error, not a pass.
5. **Repoint** `check-ac-coverage.sh` to count ACs from `acceptance-criteria.md`, falling back to `spec.md` for pre-cutoff packets.
6. **Grandfathering**: dated cutoff, mirroring the existing `LEGACY_GRANDFATHERED` (`validate.sh:175-182`) and `CANONICAL_SAVE_CUTOFF` patterns. Do not invent a third mechanism.
7. **References**: `CLAUDE.md` §3 level table, system-spec-kit `SKILL.md`, `templates/README.md`, `templates/CONTRACT.md`, `examples/level-2|3|3+`, feature-catalog, `references/validation/validation-rules.md`, `mcp-server/ENV-REFERENCE.md`, **the system-spec-kit skill `README.md`, and the public root `README.md`**.

---

## 6. RESTRUCTURE — PARENT

- `git mv` the existing docs into `001-`; author the parent lean trio from `packet-types/phase-parent.spec.md.tmpl` (root purpose + phase list only — no merge/migration narrative).
- Regenerate `description.json` + `graph-metadata.json` for parent and both children.
- Rewrite the 19 old-slug sites: `specs/descriptions.json`, `000-release` fragments/coverage/changelog-by-skill/graph-metadata, spec-kit `changelog/v3.9.0.0.md`, playbook `scope-adherence-advisory-rule.md`, one 036 research iteration, plus 033's own docs. Historical changelog prose keeps the old name where it records what shipped under it.

---

## 7. CONSTRAINTS

- SCOPE LOCK: no cleanup of packet 036 or adjacent packets.
- Parent stays lean trio; heavy docs live in children.
- No completion claim without `validate.sh <folder> --strict` exit 0.

---

## 8. PROOF

| # | Check |
|---|-------|
| 1 | Recursive `validate.sh --strict` over the 033 tree: 0 errors. |
| 2 | Renderer emits `acceptance-criteria.md` for 2/3/3+, never for Level 1. |
| 3 | Negative control: post-cutoff packet missing the doc → exit 2; add it → 0. |
| 4 | AC waived with a real ADR → pass; waived naming a missing ADR → fail. |
| 5 | `rg '033-spec-template-context-optimization'` returns only the intended historical mentions. |

---

## 9. PROGRESS

Updated as phases land.

| Item | State | Evidence |
|------|-------|----------|
| Parent restructure (rename + demote to `001-`) | Done | `git mv`; parent holds lean trio + two children |
| Parent lean spec authored | Done | `spec.md`, phase map with both children |
| Phase `002-` scaffolded at Level 3 | Done | `create.sh --phase --parent`, then contract templates rendered at level 3 |
| Phase 002 planning docs | In Progress | `spec.md` authored |
| Phase 002 build (items 1-7) | Pending | — |
| Reference rewrite (19 sites) | Pending | — |
| Metadata regeneration | Pending | — |
| Proof run | Pending | — |

### Deviations and findings

| Item | Note |
|------|------|
| `scripts/spec/upgrade-level.sh` | Broken independently of this work: it resolves `templates/addendum/level2-verify/checklist.md`, a path that no longer exists after the template folder restructure, so every L1→L2 upgrade fails and rolls back. Reported, not fixed — out of scope under the scope lock. |
| Level 1 acceptance criteria | The goal says `spec.md` drops its AC column. Applied at Levels 2/3/3+ only: Level 1 has no `acceptance-criteria.md` in its contract, so dropping the column there would delete acceptance criteria outright rather than relocate them. |
| Scope addition | Operator added the system-spec-kit skill `README.md` and the public root `README.md` to the reference set mid-session; folded into item 7. |
