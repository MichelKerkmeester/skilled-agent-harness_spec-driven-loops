---
title: "Feature Specification: Code READMEs (Design, Prompt, Spec-Kit Batch)"
description: "Author lean per-folder code READMEs for the code and script folders across sk-design, sk-prompt and system-spec-kit that have none, excluding benchmark seed-project fixtures and a stale duplicate test folder that are unsafe or wrong to document."
trigger_phrases:
  - "code readmes design prompt speckit"
  - "benchmark seed fixture exclusion"
  - "open-design tests duplicate"
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/006-code-readmes-design-prompt-speckit"
    last_updated_at: "2026-07-22T13:27:47Z"
    last_updated_by: "claude"
    recent_action: "Shipped and validated the thirty-eight in-scope code READMEs; honored the seven exclusions."
    next_safe_action: "Proceed to phase 007 (system-deep-loop; 53 folders)."
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate"
      - ".opencode/skills/sk-design/design-mcp-open-design/tests"
      - ".opencode/skills/sk-prompt/prompt-models/benchmarks/003-minimax-prompt-framework/eval-rig/grader"
---

# Feature Specification: Code READMEs (Design, Prompt, Spec-Kit Batch)

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

The repo-wide scan flagged forty-five code and script folders without a README across sk-design (13), sk-prompt (14) and system-spec-kit (18). Seven of the forty-five are not safe or correct to document. Six are benchmark seed projects under `sk-prompt/prompt-models/benchmarks/*/fixtures/fix-*/seed/`, which the eval harness copies and runs a model against; adding a `README.md` there could pollute the fixture and change the benchmark. The seventh, `sk-design/design-mcp-open-design/__tests__`, is a byte-identical stale duplicate of the sibling `tests/` folder (the `tests/` copy was touched more recently and matches the repo convention), so documenting it would legitimize residue that should be deleted.

### Purpose

Author a lean per-folder code README for the thirty-eight in-scope folders, sourced from each folder's real files. Exclude the six benchmark seed folders and the stale duplicate with a documented reason, and flag the stale duplicate for an operator delete decision rather than deleting it here.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A `README.md` in each of the thirty-eight in-scope folders (12 sk-design, 8 sk-prompt benchmark-harness, 18 system-spec-kit).
- Each README sourced from the folder's real files with an accurate CONTENTS table and a resolving RELATED link.
- The floor validator reports zero issues on every new README, and the new prose is HVR-clean.

### Out of Scope

- The six benchmark seed-project folders under `benchmarks/*/fixtures/fix-*/seed/`. A README could pollute a fixture the eval harness operates on.
- `sk-design/design-mcp-open-design/__tests__`, a stale byte-identical duplicate of `tests/`. It is flagged for an operator delete decision, not documented.
- The fifty-three system-deep-loop folders (phase 007) and the closeout sweeps (phase 008).
- Any change to the code being documented, and the actual deletion of the stale duplicate.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Sev | Requirement |
|----|-----|-------------|
| REQ-001 | P2 | Each of the thirty-eight in-scope folders carries a `README.md` with a numbered ALL-CAPS OVERVIEW and an accurate CONTENTS table. |
| REQ-002 | P2 | The six benchmark seed folders receive no README, and the reason is recorded so the exclusion is not read as an oversight. |
| REQ-003 | P2 | The stale `design-mcp-open-design/__tests__` duplicate is flagged in `context-index.md` for an operator delete decision and is not documented. |
| REQ-004 | P2 | Layered library folders (`storage/ports`, `observability`, `triggers`, `spec-gate`) carry a small boundary or architecture note; flat script and fixture folders stay lean. |
| REQ-005 | P2 | `validate_document.py --type readme` reports zero issues for every new README, and the em-dash and semicolon sweep is zero. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All thirty-eight in-scope folders have a `README.md` that reports VALID with zero issues.
- Every CONTENTS table matches the folder's real `ls`, and the six seed exclusions plus the one duplicate flag are recorded.
- The em-dash and semicolon sweep across the new READMEs returns zero.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Fixture pollution.** Mitigated by excluding the benchmark seed folders the harness operates on.
- **Documenting residue.** Mitigated by flagging the stale `__tests__` duplicate for deletion rather than giving it a README.
- **Invented file purposes.** Mitigated by requiring each author to open the real files.

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- A code README orients before the source and documents current behavior only.
- Exclusions are documented so coverage gaps are intentional and legible, not silent.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- The `benchmarks/*/eval-rig/scripts/deterministic` folder is harness code, not a seed fixture, so it is in scope.
- The corpus `__tests__` folders under each design mode are real test suites for that mode's corpus data and are documented.
- `mcp-server/lib/eval/fixtures` holds test input data consumed by a test, not a seed project a harness runs, so a lean README is safe.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Whether to delete `sk-design/design-mcp-open-design/__tests__` is an operator decision; the two folders are byte-identical and `tests/` is the more recent, convention-matching copy.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` (this phase).
- `../spec.md` and `../context-index.md` (the 021 program parent).
- Previous phase: [`005-code-readmes-infra-and-sk`](../005-code-readmes-infra-and-sk/spec.md).

<!-- /ANCHOR:related-docs -->
