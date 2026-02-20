---
description: "Activation triggers, use cases, phase overview, and when NOT to use this skill"
---
# When To Use

Defines when to activate the full-stack development orchestrator and which phase applies.

## Activation Triggers

**Use this skill when:**
- Starting development work across any supported stack
- Implementing new features, APIs, components, services, or modules
- Encountering errors, failing tests, or unexpected runtime behavior
- Before any completion claim (`works`, `fixed`, `done`, `complete`, `passing`)
- After implementation changes that require verification evidence

**Keyword triggers:**
- Implementation: `implement`, `build`, `create`, `add feature`, `service`, `component`, `handler`
- Testing: `test`, `unit test`, `integration test`, `coverage`, `mock`
- Debugging: `debug`, `fix`, `error`, `broken`, `issue`, `bug`, `failing`
- Verification: `done`, `complete`, `works`, `finished`, `verify`

## When NOT to Use

**Do NOT use this skill for:**
- Documentation-only changes (use `workflows-documentation`)
- Git/version-control workflows (use `workflows-git`)
- Browser inspection tasks only (use `workflows-chrome-devtools`)

## Phase Overview

This orchestrator runs in three primary phases:

| Phase                       | Purpose                                           | Trigger                               |
| --------------------------- | ------------------------------------------------- | ------------------------------------- |
| **Phase 1: Implementation** | Write code with stack-specific patterns           | Starting/modifying code               |
| **Phase 2: Testing**        | Debug failures and validate behavior              | Test failures, runtime errors         |
| **Phase 3: Verification**   | Final evidence before completion claims           | Before any `done`/`works` statement   |

**The Iron Law**: no completion claims without verification commands for the detected stack.

## Cross References
- [[how-it-works]] - Core development lifecycle
- [[smart-routing]] - Stack detection and intent routing
- [[rules]] - ALWAYS/NEVER/ESCALATE rules per phase
