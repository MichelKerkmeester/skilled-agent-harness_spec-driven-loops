---
title: "Implementation Plan: Fix sk-prompt drift and recommend improvements from a survey of other prompt improvers"
description: "Fix two stale references now, then rebuild sk-prompt around a one-pass checklist in place of DEPTH, with deliver-first replies, a pasted-prompt guard and runnable router fixtures."
trigger_phrases:
  - "sk prompt improvements plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Fix sk-prompt drift and recommend improvements from a survey of other prompt improvers

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs, Python router pseudocode, shell fixtures |
| **Framework** | Skilled skill package (`SKILL.md`, `ROUTER.md`, references, assets) |
| **Storage** | None |
| **Testing** | `rg` residue checks, a new `benchmark/router/run_fixtures.sh`, `validate.sh --strict` |

### Overview
The drift fix edits one line in sk-prompt and one line each in the AI Systems Prompt Improver skill and README. The build then replaces DEPTH with a one-pass checklist and applies REQ-003 to REQ-011 across sk-prompt, its agent and its command. Residue greps and router fixtures prove it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash .skilled/skills/sk-prompt/benchmark/router/run_fixtures.sh` prints `PASSED n/n` and the DEPTH residue grep prints 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-pass checklist pipeline.

### Key Components
- **`SKILL.md` and `references/`**: the checklist, component skeleton and quality screen that replace DEPTH and the framework matrix.
- **`ROUTER.md` and `benchmark/router/`**: routing on the user's own words, held equal to runnable fixtures.

### Data Flow
The request enters `ROUTER.md`, which sets any pasted prompt aside and picks the format. The skill runs the checklist once, builds the prompt from the model-agnostic skeleton, self-checks it and returns the prompt with open items and a change list.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup fixes the two stale references and records the survey. Implementation replaces DEPTH and lands REQ-003 to REQ-011 across sk-prompt, the agent and the command. Verification runs the residue greps, the new fixtures and the playbook scenarios. Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`bash .skilled/skills/sk-prompt/benchmark/router/run_fixtures.sh` must print `PASSED n/n`, with fixtures for a pasted `$json` and a well-formed prompt that needs no change.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond `rg`, `bash` and `python3`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: `/prompt:improve` or `@prompt-improver` fails after the rebuild. Revert the build commit; the drift-fix lines revert independently.
<!-- /ANCHOR:rollback -->

---
