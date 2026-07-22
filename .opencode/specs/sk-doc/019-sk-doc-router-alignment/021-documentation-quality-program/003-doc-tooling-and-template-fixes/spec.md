---
title: "Feature Specification: Doc-Tooling and Template Fixes"
description: "Fix the broken validate_document.py symlink path resolution so the documented top-level command runs, and add two clarifications to the skill-readme-template so authors know the analogy technique and that the validator is only a floor."
trigger_phrases:
  - "validate_document.py path bug"
  - "skill readme template clarifications"
  - "doc tooling fixes"
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/003-doc-tooling-and-template-fixes"
    last_updated_at: "2026-07-22T12:21:14Z"
    last_updated_by: "claude"
    recent_action: "Fixed the validate_document.py symlink path; added two template clarifications."
    next_safe_action: "Proceed to phase 004 (skill/mode README overhaul)."
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/skills/sk-doc/create-skill/assets/skill/skill-readme-template.md"
---

# Feature Specification: Doc-Tooling and Template Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-22 |
| **Branch** | `sk-doc/0097-documentation-quality` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The documented top-level validator path `sk-doc/scripts/validate_document.py` is a symlink to the real `sk-doc/shared/scripts/validate_document.py`. The script loaded `template-rules.json` via `Path(__file__).parent` without resolving the symlink, so when invoked through the documented top-level path it looked in the nonexistent `sk-doc/assets/` and errored before validating. Every sk-doc packet's own README Quick Start shows that top-level command, so the documented command was broken. Separately, the README audit found the `skill-readme-template` lacked two cheap clarifications: the concrete-analogy voice device the repo root README relies on, and a caveat that the validator only enforces a subset of the checklist.

### Purpose

Make the documented validator command run from either the symlink or the real path, and add the two template clarifications so authoring against the template produces the intended voice and does not stop at a green script.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `.resolve()` to the four `Path(__file__)` sites in `validate_document.py` that compute the rules path, so symlink and real-path invocations both resolve to `shared/assets/template-rules.json`.
- Add a concrete-analogy note to the template's WRITING RULES.
- Add a validator-is-a-floor caveat under the template's VALIDATION CHECKLIST, and bump the template version.

### Out of Scope

- The full documentation of `create-readme/scripts/audit_readmes.py`. Its home is a code README for that scripts folder, authored in phase 005; this phase only confirms it exists and will be used in the phase 008 conformance sweep.
- `readme-code-template.md` changes. The audit found it sound.
- The `h2UppercaseRequired` config flip (deferred with phase 002).

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Sev | Requirement |
|----|-----|-------------|
| REQ-001 | P1 | Invoking `sk-doc/scripts/validate_document.py` (the symlink) validates a file instead of erroring on a missing rules file. |
| REQ-002 | P1 | Invoking the real `sk-doc/shared/scripts/validate_document.py` still works (no regression, no double-resolve). |
| REQ-003 | P2 | The skill-readme-template WRITING RULES names the concrete-analogy technique. |
| REQ-004 | P2 | The skill-readme-template VALIDATION CHECKLIST states the validator is a floor, not a proxy for the checklist. |
| REQ-005 | P2 | The template version is bumped for the edit. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The symlink invocation reports VALID for a conformant README (was `Error: template_rules.json not found`).
- `python3 -m py_compile` on the validator passes; no `resolve().resolve()` appears.
- The template carries the analogy note, the floor caveat, and version 1.8.0.6.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Double-resolve.** Mitigated: the two already-resolved `sys.path` sites do not contain the replaced substring, and a follow-up grep confirms no `resolve().resolve()`.
- **Behavior change in validation output.** None: `.resolve()` only changes where the rules file is found, not the validation logic.

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- The fix is invocation-path agnostic: the same rules file resolves whether the script is called via the symlink or the real path.
- The template edits are additive: two bullets and a version bump, no restructure.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A future third copy or symlink of the validator would also resolve correctly, since `.resolve()` follows any symlink chain to the real file.
- The template edits keep HVR (no em dashes, no semicolons) in the added text.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Whether to also widen `template-rules.json` `readme` `requiredSections` so the validator gates the full nine-section model is deferred to the phase 008 optional-extension decision.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` (this phase).
- `../spec.md` and `../context-index.md` (the 021 program parent).

<!-- /ANCHOR:related-docs -->
