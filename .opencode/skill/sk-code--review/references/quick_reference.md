---
title: Code Review Quick Reference
description: Fast execution reference for findings-first review workflow with severity handling and next-step confirmation.
---

# Code Review Quick Reference

Fast execution reference for findings-first review workflow with severity handling and next-step confirmation.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provide a compact review protocol that keeps outputs consistent, risk-focused, and actionable.

### Core Principle

Findings first, implementation second.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:review-flow -->
## 2. REVIEW FLOW

1. Scope current changes:

```bash
git status --short
git diff --stat
git diff
```

2. Run focused analysis in this order:
- Correctness and regression risk
- Security and reliability
- Performance and maintainability
- Removal/deprecation opportunities

3. Publish findings by severity (`P0` -> `P3`) with file-line references.
4. Ask user what to do next before writing code.
<!-- /ANCHOR:review-flow -->

---

<!-- ANCHOR:design-lens -->
## 3. KISS / DRY / SOLID LENS

Apply this lens during every review pass:

- **KISS**: flag complexity that does not serve a current requirement.
- **DRY**: flag duplicated logic/constants that should be centralized.
- **SOLID**: explicitly evaluate SRP/OCP/LSP/ISP/DIP risks in changed modules.

Escalation rule: when uncertain between P1 and P2 for architecture risk, choose P1 and state uncertainty.
<!-- /ANCHOR:design-lens -->

---

<!-- ANCHOR:overlay-contract -->
## 4. BASELINE + OVERLAY CONTRACT

Apply this skill as baseline first, then select one overlay skill:

- OpenCode system code -> `sk-code--opencode`
- Frontend/web code -> `sk-code--web`
- Default/other stacks -> `sk-code--full-stack`

Precedence:
- Baseline security/correctness minimums are always enforced.
- Overlay style/process/build/test conventions override generic baseline guidance when conflicts occur.
- Unclear conflicts must be escalated before final scoring.
<!-- /ANCHOR:overlay-contract -->

---

<!-- ANCHOR:severity-model -->
## 5. SEVERITY MODEL

| Level | Meaning | Handling |
| --- | --- | --- |
| P0 | Security vulnerability, data-loss risk, critical correctness issue | Block merge |
| P1 | High-impact logic defect, major regression risk | Fix before merge |
| P2 | Medium maintainability/design concern | Fix now or schedule follow-up |
| P3 | Low-priority style/readability suggestion | Optional |

Escalation rule: If confidence is low but impact is high, classify toward higher severity and call out uncertainty explicitly.
<!-- /ANCHOR:severity-model -->

---

<!-- ANCHOR:output-checklist -->
## 6. OUTPUT CHECKLIST

Before returning a review, confirm:

- [ ] Findings appear before summary sections.
- [ ] Each finding has path + line reference.
- [ ] Risk and impact are explained in plain language.
- [ ] Suggested fixes are specific and proportional.
- [ ] KISS/DRY/SOLID checks are explicitly reported.
- [ ] Next-step options are presented.

Recommended next-step options:
1. Fix all findings
2. Fix P0/P1 only
3. Fix selected findings
4. No implementation changes
<!-- /ANCHOR:output-checklist -->

---

<!-- ANCHOR:no-diff-path -->
## 7. NO-DIFF PATH

If no changes are detected, return:
- What was checked (`git status`, `git diff`, staged state)
- The result (`no diff found`)
- A concrete follow-up choice:
  - Review staged changes only
  - Review a specific commit/range
  - Review selected files
<!-- /ANCHOR:no-diff-path -->

---

<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

- [security_checklist.md](./security_checklist.md) - Security, reliability, and abuse-prevention checks.
- [code_quality_checklist.md](./code_quality_checklist.md) - Non-security correctness, KISS, and DRY checks.
- [solid_checklist.md](./solid_checklist.md) - Architecture and SOLID (SRP/OCP/LSP/ISP/DIP) checks.
- [removal_plan.md](./removal_plan.md) - Safe-now versus deferred deletion planning.

Overlay portability: apply this baseline with `sk-code--opencode`, `sk-code--web`, or `sk-code--full-stack`.
<!-- /ANCHOR:related-resources -->
