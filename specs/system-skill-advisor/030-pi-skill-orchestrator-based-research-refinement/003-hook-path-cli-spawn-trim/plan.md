---
title: "Implementation Plan: Hook Path CLI Spawn Trim"
description: "Add an includeCompiledRoute request option that the hook-side CLI caller sets to false, so hook turns stop spawning compiled-route children, and put the casual-prompt gate back in front of the Claude hook's CLI call."
trigger_phrases:
  - "hook path cli spawn plan"
  - "include compiled route option plan"
  - "casual prompt gate plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Hook Path CLI Spawn Trim

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, ESM |
| **Framework** | Advisor runtime: daemon handler, CLI front door and hooks in system-skill-advisor |
| **Storage** | In-memory prompt cache in the daemon, unchanged |
| **Testing** | Vitest: `npm test` in `.skilled/skills/system-skill-advisor/runtime`, and `node --test .skilled/plugins/tests/system-skill-advisor.test.cjs` for the plugin |

### Overview
The option has to travel in the request, because the handler runs in the daemon, where a hook-side environment variable cannot reach. It is one boolean added to three schema copies that parity tests already hold together, one condition in front of the two `enrichCompiledRoutes` returns and one field in the hook-side payload. The gate is one call in the Claude handler before the CLI branch. The handler already turns a `skipped` result into the fallback directive at `hooks/claude/user-prompt-submit.ts:302`, so a declined prompt shows the model the same text a no-match shows it today.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Caller-scoped work: the caller that uses a result asks for it, and the caller that does not skips it. The default stays on, so a caller that says nothing keeps today's behavior.

### Key Components
- **advisor_recommend handler** (`runtime/handlers/advisor-recommend.ts`): reads the option and skips `enrichCompiledRoutes` at `:504` (cache hit) and `:571` (fresh result) when it is `false`.
- **Schema copies**: zod at `runtime/schemas/advisor-tool-schemas.ts:217-228`, the descriptor at `runtime/tools/advisor-recommend.ts:12-25`, and the CLI manifest at `runtime/skill-advisor-cli-manifest.ts:23-45`.
- **CLI front door** (`runtime/skill-advisor-cli.ts`): `invokeAdvisorRecommendPayload` at `:1414` gains a single retry without the option when the daemon rejects it.
- **Hook-side caller** (`hooks/lib/skill-advisor-cli-fallback.ts:222`): adds the option to its payload.
- **Claude hook handler** (`hooks/claude/user-prompt-submit.ts:270-290`): calls `shouldFireAdvisor` (`runtime/lib/prompt-policy.ts:100`) before the injected or CLI branch.

### Data Flow
A hook turn enters the Claude handler, from Claude directly or through the Codex, Cursor, Devin or Pi adapters. The gate runs first. A declined prompt returns a `skipped` result, and the renderer turns it into the fallback directive with no process spawned. An accepted prompt goes to the CLI with `includeCompiledRoute: false`. The daemon scores it and returns without starting `compiled-route.cjs`. The OpenCode plugin builds its own payload at `.skilled/plugins/system-skill-advisor.js:763` without the option, so it keeps receiving `compiledRoute`.

### Stale daemon path
The CLI validates the request against its own manifest, so the new CLI accepts the option. A daemon started before the change parses with the old strict zod schema and rejects the unknown key. The CLI maps that rejection to exit 64 (`runtime/skill-advisor-cli.ts:991-997`), and the hook would fail open. The retry sends the same request without the option, which costs one extra socket round trip and no extra process, and only on the older daemon. Confirm the exact error the older daemon returns before writing the retry, since the mapping above is read from code and not yet observed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Capture a baseline first: pass counts for the advisor runtime suite and the plugin suite. Each requirement gets a test that fails before its change. The handler test mocks `node:child_process` the way `runtime/tests/compiled-routing-consumption.vitest.ts:10` already mocks `spawn`, and counts `execFileSync` calls whose script is `compiled-route.cjs`. The hook tests inject a `buildCliBrief` spy and assert it is never called for `/help` and "thanks". The replay runs `shouldFireAdvisor` over both corpora and lists every declined prompt whose expected skill is a real skill; the list must be empty. The retry test uses a daemon stub that rejects the key. Rerun both whole suites at the end and report the delta.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 002-hook-deadline-and-diagnostics, for the `durationMs` baseline that REQ-006 compares against.
- None beyond 002. The docs direction for REQ-007 is decided: the docs follow the code.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert this phase's commit. The option defaults to on, so an older hook against a newer daemon, or a newer daemon with no caller setting the option, behaves exactly as today. Removing the gate call alone restores the current CLI-for-every-prompt behavior.
<!-- /ANCHOR:rollback -->

---
