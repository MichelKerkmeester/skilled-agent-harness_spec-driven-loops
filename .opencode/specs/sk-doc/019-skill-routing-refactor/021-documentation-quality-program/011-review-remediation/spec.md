---
title: "Feature Specification: Deep-Review Remediation"
description: "Fix the confirmed blockers the 20-iteration deep review found in the 021 documentation-quality program: NUL-byte header corruption, validator correctness gaps, non-runnable Quick-Start commands, and the broken style-catalog links, so the branch becomes merge-ready."
trigger_phrases:
  - "021 review remediation"
  - "fix nul corruption headers"
  - "deep review blockers remediation"
importance_tier: "high"
contextType: "implementation"
status: "in-progress"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-documentation-quality-program/011-review-remediation"
    last_updated_at: "2026-07-22T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Opened remediation packet from the FAIL deep-review verdict."
    next_safe_action: "Fix the NUL-byte header corruption in the two files."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/references/writing-style-guide.md"
      - ".opencode/skills/sk-prompt/prompt-models/references/vision-audit-benchmark.md"
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
---

# Feature Specification: Deep-Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In progress |
| **Created** | 2026-07-22 |
| **Branch** | `sk-doc/0097-documentation-quality` |
| **Source** | The 20-iteration `/deep:review` FAIL verdict (`../review/review-report.md`) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The forced 20-iteration deep review of the 021 program returned FAIL. The orchestrator verified the load-bearing findings against disk: the header-uppercase transform wrote literal NUL bytes into two files (corrupting backtick code spans inside parenthetical headers); the refined `is_uppercase_section` lets arbitrary mixed-case prose pass the ALL-CAPS gate and mishandles nested parenthetical and URL forms; several rewritten Quick-Start commands cannot run from any single working directory; and the sk-design style catalog carries broken relative links. One raw P0 ("all phases fail strict validation") was refuted as a read-only-sandbox artifact.

### Purpose

Fix the confirmed, in-scope blockers so `sk-doc/0097-documentation-quality` is merge-ready, and harden the validator that produced the corruption so it cannot recur.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Restore the two corrupted headers by replacing the destroyed code spans (`\x00 0 \x00`) with their originals, keeping the uppercased main prose and the preserved parenthetical convention.
- Harden `is_uppercase_section` in `validate_document.py`: require true `word.isupper()` for prose, and replace the first-closing-paren regex exemptions with a balanced-delimiter scanner for code spans, parentheticals, function calls, and autolinks; add table-driven tests.
- Fix the non-runnable Quick-Start commands so they run from one documented working directory.

### Out of Scope

- The sk-design `styles/README.md` 1,290-link breakage — attribution is under investigation; the `library/bundles/` restructure is sk-design (packet 012) territory. Routed separately if it is not this program's regression.
- Re-running the full 20-iteration review (targeted re-verification of the fixed defects only).
- The 52 P1 README-vs-code accuracy findings (tracked for surface-by-surface triage, not blockers).

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Sev | Requirement |
|----|-----|-------------|
| REQ-001 | P0 | The two corrupted files contain zero NUL bytes and their headers keep the uppercased prose plus the restored code span. |
| REQ-002 | P0 | `is_uppercase_section` rejects arbitrary mixed-case prose and correctly exempts balanced code spans, parentheticals, function calls, and autolinks, with table-driven regression tests. |
| REQ-003 | P0 | The rewritten Quick-Start commands run from a single documented working directory. |
| REQ-004 | P1 | The style-catalog link breakage is either fixed (if this program's regression) or routed to sk-design with evidence. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `tr -dc '\000'` over every changed `.md` returns empty across the branch.
- `validate_document.py` passes on the two restored files and its new mixed-case/parenthetical tests pass.
- The remediated Quick-Start commands execute as documented from their stated directory.
- Parent packet re-validates `Errors: 0` and the FAIL blockers are closed or explicitly routed.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Editing the validator changes the whole gate.** Mitigated: table-driven tests pin the accepted and rejected header forms before and after.
- **Byte-precise header repair.** Mitigated: the original code spans are extracted from the merge-base blob, not retyped.

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- Each fix is byte-precise and independently revertible.
- Out-of-scope findings are routed with evidence rather than silently dropped.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A header whose entire parenthetical was a code span (writing-style-guide) versus one code span among prose (vision-audit-benchmark).
- Commands that resolve only from a working directory the reader was never told to assume.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Whether the sk-design style-catalog link breakage is fixed by sk-design or accepted as a known-stale generated catalog.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `../review/review-report.md` (the FAIL verdict this packet remediates).
- `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` (this phase).

<!-- /ANCHOR:related-docs -->
