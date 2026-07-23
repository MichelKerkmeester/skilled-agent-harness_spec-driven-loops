---
title: "Feature Specification: Code READMEs (Infra and SK Batch)"
description: "Author lean per-folder code READMEs for the thirty-three code and script folders across sk-doc, sk-code, system-code-graph, system-skill-advisor, mcp-code-mode, mcp-tooling and cli-external-orchestration that currently have none, using the code-folder README template."
trigger_phrases:
  - "code readmes infra batch"
  - "per-folder code readme"
  - "script folder readme authoring"
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/005-code-readmes-infra-and-sk"
    last_updated_at: "2026-07-22T13:27:47Z"
    last_updated_by: "claude"
    recent_action: "Shipped and validated the thirty-three code READMEs."
    next_safe_action: "Proceed to phase 006 (sk-design, sk-prompt, system-spec-kit; 45 folders)."
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-readme/scripts"
      - ".opencode/skills/sk-doc/create-skill/scripts"
      - ".opencode/skills/system-code-graph/runtime/lib/code-graph"
---

# Feature Specification: Code READMEs (Infra and SK Batch)

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

A repo-wide scan found one hundred thirty-one code and script folders under `.opencode/skills` that contain source files but no `README.md`, so a developer opening one gets no orientation before reading the code. This phase covers the first thirty-three: the smaller infrastructure hubs (`system-code-graph`, `system-skill-advisor`, `mcp-code-mode`, `mcp-tooling`, `cli-external-orchestration`) plus the sk-doc and sk-code families. Several are the sk-doc validators and generators the rest of this program depends on, so their folders should be self-describing.

### Purpose

Author a lean per-folder code README for each of the thirty-three folders, sourced from the real files in each folder, so a developer can orient before editing. Each README follows the code-folder README template: a numbered ALL-CAPS OVERVIEW, a CONTENTS file table, and the CONSUMERS, TESTS or VALIDATION and RELATED sections the folder earns.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A `README.md` in each of the thirty-three Phase-005 folders (8 sk-doc, 6 sk-code, 6 system-code-graph, 5 system-skill-advisor, 4 mcp-code-mode, 3 mcp-tooling, 1 cli-external-orchestration).
- Each README sourced from the folder's real files with an accurate CONTENTS table and a resolving RELATED link to the owning skill.
- The floor validator (`validate_document.py --type readme`) reports zero issues on every new README.

### Out of Scope

- The ninety-eight remaining missing-README folders (`sk-design`, `sk-prompt`, `system-spec-kit` in phase 006; `system-deep-loop` in phase 007).
- The existing code READMEs and their conformance level (the `audit_readmes.py` sizing of the existing set is a phase 008 concern).
- Any change to the code being documented. This phase authors documentation only.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Sev | Requirement |
|----|-----|-------------|
| REQ-001 | P2 | Each of the thirty-three folders carries a `README.md` with a numbered ALL-CAPS OVERVIEW and an accurate CONTENTS table listing its real files. |
| REQ-002 | P2 | Every CONTENTS entry names a file that exists in the folder, and every RELATED link resolves. |
| REQ-003 | P2 | Test, fixtures and helper folders are documented as such and kept to OVERVIEW plus CONTENTS rather than invented architecture. |
| REQ-004 | P2 | `create-readme/scripts/audit_readmes.py` is documented accurately, since phase 008 uses it as the conformance checker. |
| REQ-005 | P2 | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <folder>/README.md --type readme` reports zero issues for every new README, and the new prose is HVR-clean. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All thirty-three folders have a `README.md` that reports VALID with zero issues under the floor validator.
- Each README's CONTENTS table matches the folder's real `ls`, and its RELATED link points at the owning skill.
- The layered library folders (`code-graph`, `mcp-server/lib/graph`) carry a small architecture note; the flat script folders stay lean.
- Em-dash and semicolon sweep across the new READMEs returns zero.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Invented file purposes.** Mitigated by requiring each author to open the real files and by verifying CONTENTS filenames exist.
- **Over-architecting a flat script folder.** Mitigated by the lean council-style exemplar and the rule that test and helper folders stay to OVERVIEW plus CONTENTS.
- **Depends on phase 003.** The floor validator path fix lets authors run the documented validator on each new README.

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- A code README orients before the source. It documents current behavior only, with real file paths and commands.
- The README stays short enough to scan before opening the folder's files.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- `system-skill-advisor/mcp-server/tests/__fixtures__` is a fixtures folder; its README states that and lists the fixtures rather than describing runtime behavior.
- The `runtime/hooks/claude` and `runtime/hooks/codex` folders are platform mirrors; each README names the runtime it targets.
- A nested folder README (`create-skill/scripts/lib`, `code-quality/scripts/hooks/codex`) scopes to its own direct files and does not restate the parent.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Whether the pre-existing `10a-manifest-source` checker path bug (which touches `create-skill/scripts`) is fixed in this phase or deferred is decided during reconcile; the checker fix is code, not documentation, and may move to a separate packet.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` (this phase).
- `../spec.md` and `../context-index.md` (the 021 program parent).
- Previous phase: [`004-skill-mode-readme-overhaul`](../004-skill-mode-readme-overhaul/spec.md). Next phase: [`006-code-readmes-design-prompt-speckit`](../006-code-readmes-design-prompt-speckit/spec.md).

<!-- /ANCHOR:related-docs -->
