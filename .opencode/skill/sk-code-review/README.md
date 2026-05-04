---
title: "sk-code-review: Code Review Baseline"
description: "Stack-agnostic code review baseline with findings-first severity analysis, mandatory security and correctness minimums, and surface-aware standards evidence from sk-code."
trigger_phrases:
  - code review
  - pr review
  - review
  - audit
  - security review
  - quality gate
  - merge readiness
  - findings
  - blocking issues
  - request changes
---

# sk-code-review

`sk-code-review` is the findings-first review baseline. It enforces severity, evidence, security, and correctness rules. For stack/surface conventions, pair it with `sk-code` surface evidence (`WEBFLOW`, `OPENCODE`, or `UNKNOWN`).

---

## Overview

Every review starts with findings, not summaries. Findings carry severity labels (`P0`, `P1`, `P2`), file:line evidence, risk, user impact, and recommended fixes.

The old `sk-code-*` overlay model is retired. Review now uses:

```text
sk-code-review baseline -> sk-code surface evidence -> findings-first output
```

| Surface Evidence | Use When |
| --- | --- |
| `sk-code:WEBFLOW` | Webflow/frontend HTML/CSS/JS work |
| `sk-code:OPENCODE` | `.opencode/` system code, scripts, skills, agents, commands, config |
| `sk-code:UNKNOWN` | Surface is unclear; review baseline-only and disclose uncertainty |

---

## Quick Start

1. Activate `sk-code-review` for review/audit/security/quality-gate requests.
2. Load baseline references: `review_core`, `review_ux_single_pass`, `security_checklist`, and `code_quality_checklist`.
3. Load `sk-code` and use its detected surface resources as standards evidence.
4. Report findings in P0/P1/P2 order with file:line evidence.

---

## Structure

```text
.opencode/skill/sk-code-review/
├── SKILL.md
├── README.md
└── references/
    ├── review_core.md
    ├── review_ux_single_pass.md
    ├── quick_reference.md
    ├── security_checklist.md
    ├── code_quality_checklist.md
    ├── solid_checklist.md
    ├── removal_plan.md
    └── test_quality_checklist.md
```

---

## Output Contract

```markdown
## Findings

### P0 - Critical
1. `path:line` Title
   - Risk
   - User impact
   - Recommended fix

### P1 - High
...

### P2 - Advisory
...

## Review Context

**Baseline used**: sk-code-review
**Surface evidence used**: sk-code:WEBFLOW | sk-code:OPENCODE | sk-code:UNKNOWN
```

---

## Related Documents

| Resource | Purpose |
| --- | --- |
| [SKILL.md](./SKILL.md) | Full skill definition and routing logic |
| [references/review_core.md](./references/review_core.md) | Shared review doctrine |
| [references/security_checklist.md](./references/security_checklist.md) | Mandatory security and reliability checks |
| [references/code_quality_checklist.md](./references/code_quality_checklist.md) | Correctness, KISS, DRY checks |
| [sk-code SKILL.md](../sk-code/SKILL.md) | WEBFLOW and OPENCODE surface standards |
