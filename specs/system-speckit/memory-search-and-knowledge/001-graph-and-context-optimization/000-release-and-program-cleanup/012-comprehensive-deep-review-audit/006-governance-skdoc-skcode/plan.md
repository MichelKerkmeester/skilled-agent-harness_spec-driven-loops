---
title: "Implementation Plan: Governance + sk-doc + sk-code Drift Review Slice"
description: "Read-only deep-review slice plan for auditing constitutional rule enforcement against actual repo practice and sk-doc / sk-code standards conformance drift under the parent comprehensive deep-review audit."
trigger_phrases:
  - "governance skdoc skcode drift review plan"
  - "constitutional standards drift plan"
importance_tier: "normal"
contextType: "general"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Governance + sk-doc + sk-code Drift Review Slice

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Not recorded |
| **Framework** | Not recorded |
| **Storage** | Not recorded |
| **Testing** | Not recorded |

### Overview

Audit the constitutional rules against their actual enforcement and audit the sk-doc / sk-code standards against what the repository practices, reporting unenforced rules, contradictory guidance, and standards drift. The slice is a READ-ONLY review; it modifies nothing in the reviewed sources.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done

- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Read-only review slice inside the parent comprehensive deep-review audit campaign.

### Key Components

- **Constitutional rule files** (`.opencode/skills/system-spec-kit/constitutional/`): audited for rules with no enforcement mechanism or rules contradicted by repo practice or other rules.
- **sk-doc standards** (`.opencode/skills/sk-doc/SKILL.md` + `.opencode/skills/sk-doc/assets/`): template, voice, and section-order rules cross-checked against the templates the repository actually uses.
- **sk-code standards** (`.opencode/skills/sk-code/SKILL.md` + `.opencode/skills/sk-code/assets/`): surface-detection and authoring-checklist contracts checked against how `.opencode/` code is actually authored and verified.
- **AGENTS.md / CLAUDE.md guidance**: checked for internal contradictions with the constitutional rules.

### Data Flow

The slice reads the in-scope sources above, records findings with evidence under the packet's `review/` artifacts, and modifies none of the reviewed files.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — a read-only review slice records findings rather than tests; the recorded verdict is the evidence artifact.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Parent audit packet (`../`): campaign plan and slice ordering.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — a read-only review slice produces no repository changes to revert; discard the slice verdict together with the parent campaign if the campaign is abandoned.

<!-- /ANCHOR:rollback -->

---
