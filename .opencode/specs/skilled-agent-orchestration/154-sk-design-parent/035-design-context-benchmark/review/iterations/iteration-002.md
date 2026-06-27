# Iteration 002 - Internal Coherence

## Dimension

Internal coherence: check whether completion and validation claims agree with observed validation results.

## Review Actions

- Ran `python3 .opencode/skills/sk-doc/scripts/validate_document.py <file>` on every changed or untracked Markdown file under `.opencode/skills`.
- Compared failures with 030 quality-gate claims.

## Findings

### F-002 - P1 - Mandatory sk-doc validation fails on three modified reference docs

Hypothesis confirmed. The plan requires every new or edited file to pass `validate_document.py` at `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/030-design-context-adoption/plan.md:46`. The implementation summary claims "PASS (0 issues) on all 18 files" at `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/030-design-context-adoption/implementation-summary.md:95`.

The validator failed three modified Markdown files:

- `.opencode/skills/sk-design/design-audit/references/anti_patterns_production.md:18` begins with `## 1. Anti-Slop Signals`, so the required overview section is absent.
- `.opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md:22` begins with `## 1. HOW TO USE THE MATRIX`, so the required overview section is absent.
- `.opencode/skills/sk-design/design-motion/references/advanced_craft.md:17` begins with `## 1. Origin-Aware Popovers`, so the required overview section is absent.

Fix: add required overview sections or remove these files from the release surface, then rerun sk-doc validation across the actual changed Markdown set.

Review verdict: CONDITIONAL
