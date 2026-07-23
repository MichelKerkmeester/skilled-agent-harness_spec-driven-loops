---
title: "Feature Specification: Title-Case Enforcement, Config Flip, and Program Closeout"
description: "Refine the validator's ALL-CAPS header check to accept legitimate mixed-case, flip h2UppercaseRequired for reference and asset types, uppercase the 270 genuine offender headers, and close out the documentation-quality program with the code findings deferred."
trigger_phrases:
  - "titlecase enforcement config flip"
  - "h2uppercaserequired flip closeout"
  - "documentation quality program closeout"
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/009-titlecase-config-and-closeout"
    last_updated_at: "2026-07-22T16:53:38Z"
    last_updated_by: "claude"
    recent_action: "Refined the uppercase check, flipped the config, uppercased 270 headers."
    next_safe_action: "Operator ff-merge to v4."
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/skills/sk-doc/shared/assets/template-rules.json"
---

# Feature Specification: Title-Case Enforcement, Config Flip, and Program Closeout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-22 |
| **Branch** | `sk-doc/0097-documentation-quality` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `h2UppercaseRequired` config was off for the reference and asset types, so Title-Case header drift only showed in the advisory score. Flipping it was blocked by two facts the scan surfaced: the validator's `is_uppercase_section` flagged any lowercase character, so it would reject legitimate mixed-case headers (inline code, parenthetical annotations, function signatures, proper nouns like ClickUp), and 58 reference and asset files carried 270 genuinely Title-Case or sentence-case headers, dominated by sk-design's design-audit house style. This is also the program's closeout phase, which must record what shipped and what was deferred.

### Purpose

Refine the validator so the uppercase check only enforces ALL-CAPS on prose words, flip the config for reference and asset, uppercase the 270 genuine offender headers with a transform that preserves the exempt parts, and close the program. The remaining code findings (a stale benchmark `RIG_ROOT`, an unused `dispatch-swe16` carryover, the pre-existing `10a-manifest-source` checker path bug) are deferred as code-maintenance tasks, since fixing benchmark and checker runtime code needs its own context.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Refine `is_uppercase_section` to exempt code spans, parentheticals, function signatures and internal-capital proper nouns.
- Flip `h2UppercaseRequired` to true for the reference and asset types.
- Uppercase the 270 genuine Title-Case headers across 58 reference and asset files with an exempt-preserving transform.
- Record the program closeout and the deferred items.

### Out of Scope

- The skill and command types (unscanned, riskier; tracked for a future pass).
- The three code findings (`RIG_ROOT`, `dispatch-swe16`, `10a-manifest-source`), deferred as code maintenance.
- The repo-wide HVR sweep (pre-existing em dashes in untouched content).
- Merge to v4, which stays behind the operator gate.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Sev | Requirement |
|----|-----|-------------|
| REQ-001 | P2 | `is_uppercase_section` accepts legitimate mixed-case (code, parentheticals, signatures, proper nouns) and fails only on genuine Title-Case or sentence-case prose. |
| REQ-002 | P2 | `h2UppercaseRequired` is true for reference and asset, and all 667 reference/asset files pass the check. |
| REQ-003 | P2 | The 270 offender headers are uppercased header-only, with code spans, signatures and annotations preserved. |
| REQ-004 | P2 | The refinement causes no README or playbook regression (the audit's invalid count does not rise). |
| REQ-005 | P2 | The three deferred code findings are documented with enough specificity to action later. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 667 reference/asset files report VALID with the flipped config.
- The README audit's template-invalid count drops (43 to 41) rather than rises.
- The full program validates recursively clean (parent plus all children).

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Force-uppercasing legitimate content.** Mitigated by the refined check plus a transform that protects code, signatures and annotations, verified header-only by diff.
- **Rushing benchmark or checker code.** Mitigated by deferring the three code findings to a focused session rather than half-fixing runtime code at closeout.

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- The uppercase transform is deterministic and header-only, so a reviewer can confirm the change class from the diff.
- The closeout is legible: what shipped, what was deferred, and why.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A header of only code spans, signatures or annotations (`## 3. `depends_on``) passes; there is no prose to enforce.
- Template-body headers inside a fenced example are checked too (a deliberate validator design), so they were uppercased to model the standard.
- `skill`/`command` types keep the check off; their headers were not scanned in this phase.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Whether to also flip skill and command types (after scanning their headers) is left for a future pass.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` (this phase).
- `../spec.md` and `../context-index.md` (the 021 program parent).
- Previous phase: [`008-existing-readme-cleanup`](../008-existing-readme-cleanup/spec.md). Next phase: [`010-deferred-code-and-checker-fixes`](../010-deferred-code-and-checker-fixes/spec.md).

<!-- /ANCHOR:related-docs -->
