---
title: "Implementation Plan: Phase 9: sk-code-browser-evidence"
description: "Names the mcp-browser-use hub in sk-code's frontend verification row, bumps sk-code's version and records the change in a changelog. Proof is the parent-skill checker, the router sync verifier and strict validation of this packet and its parent."
trigger_phrases:
  - "sk code browser evidence plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: sk-code-browser-evidence

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON, with Node.js for the sk-code checkers |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `parent-skill-check.cjs`, `verify-router-sync.cjs`, and `validate.sh --strict` |

### Overview
The change rewrites one table row in sk-code's `ROUTER.md`, bumps the version in the four files that carry it, and adds a changelog file. Two sk-code checkers prove the router still resolves and the hub is still registered. Strict validation proves this packet and its parent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met, as tasks.md records
- [x] `parent-skill-check.cjs .skilled/skills/sk-code` prints `OK: parent-skill-check — all hard invariants passed, 0 warnings` and exits 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a single router row, checked by the sk-code verifiers and the parent-skill checker.

### Key Components
- **sk-code `ROUTER.md` section 5, `sk-code-frontend` row**: Names the verification an agent runs after it changes a frontend file. Without the hub name, nothing points the agent at the browser tooling.
- **Version fields in `SKILL.md`, `description.json`, `mode-registry.json`, `hub-router.json`**: Carry sk-code's version. The parent-skill checker compares them with the newest changelog entry (checks 13a and 13b), so a bump must reach all four.

### Data Flow
An agent changes a frontend file and reads the router's verification table. The row names the hub. The agent opens the changed page through whichever browser mode is installed, then records a screenshot and the console result, or NOT RUN with the reason.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup reads the `sk-code-frontend` row and the four version fields as HEAD holds them. Implementation rewrites the row, bumps the versions, adds `changelog/v3.12.2.0.md`, and amends the parent. Verification runs the two sk-code checkers and strict validation of this packet and its parent.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The one command that proves the row change is `parent-skill-check.cjs .skilled/skills/sk-code`, which must print its `OK` line and exit 0. `verify-router-sync.cjs` then checks that the router's maps still agree, and must print `router-sync: 5/5 checks passed`. The advisor replay is carried from an earlier run and is not repeated here. No browser test is part of this packet.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Node.js runs the two sk-code checkers. No new package is added. The advisor replay needs the `system-skill-advisor` runtime built, which this worktree does not have.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the row sends agents to a browser mode the user does not have, or a checker fails on the version fields after a later change. Rollback: restore the HEAD text of the `sk-code-frontend` row and the five version values, then delete `.skilled/skills/sk-code/changelog/v3.12.2.0.md`. The rollback touches only the sk-code files named in spec section 3, not the advisor or the hub.
<!-- /ANCHOR:rollback -->

---
