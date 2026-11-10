---
title: "Implementation Plan: Headless Fallback Status and Dedup"
description: "Give the fallback a one-line head per no-route case, built in the renderer and mirrored in the plugin, so the model can tell an outage from a no-match and the existing lifecycle split can drop the repeated directives block."
trigger_phrases:
  - "fallback status plan"
  - "fallback dedup plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Headless Fallback Status and Dedup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, ESM, plus the plain-JS OpenCode plugin |
| **Framework** | Advisor renderer, Claude hook, directive lifecycle, OpenCode plugin |
| **Storage** | The lifecycle receipt store the hook already uses, unchanged |
| **Testing** | Vitest: `npm test` in `.skilled/skills/system-skill-advisor/runtime`, and `node --test .skilled/plugins/tests/system-skill-advisor.test.cjs` |

### Overview
R4 is mostly a renderer change: one function picks a head by result status and appends the existing block after `\nDirectives:`. That separator is exactly what the lifecycle split looks for, so a headed fallback becomes splittable with no change to `directive-lifecycle.ts`. R6 is then one condition in the hook's fall-open list and the matching one in the plugin.
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
One canonical renderer, one mirrored copy held to it by a parity test. The head is the dynamic part and the directives are the constant part, the same shape a real recommendation already has.

### Key Components
- **Renderer** (`runtime/lib/render.ts`): `renderAdvisorFallbackDirective` at `:443-448` takes the result status. `renderAdvisorTimeoutFallback` at `:450-463` becomes the outage head and loses its `Fallback marker` JSON line, which no production path reads.
- **Claude hook** (`hooks/claude/user-prompt-submit.ts`): passes the result's status and freshness to the renderer at `:302`, and stops treating a headed fallback as a fall-open case at `:303-308`.
- **Lifecycle split** (`hooks/lib/directive-lifecycle.ts:44-47`, `:126-127`): unchanged. A head before `\nDirectives:` is all it needs.
- **Plugin** (`.skilled/plugins/system-skill-advisor.js`): `FALLBACK_DIRECTIVE` at `:61` becomes a status-aware function, used at `:1298-1318` and `:1371-1383`, with the same split at `:267-272`.
- **Pi classifier** (`hooks/pi/prompt-advisor.ts:184`): labels the three heads.

### Data Flow
The hook gets a result with no passing recommendation. It passes the status and freshness to the renderer, which returns a head plus the block. On the first no-route turn of a known session the whole text goes out. On a repeat, the lifecycle split keeps the head and drops the block, the same as it does after a real recommendation. An unknown session, the kill switch and any thrown error still fall open to the whole text.

### Heads
Wording is settled in implementation under REQ-007's caps. The outage head carries the status and the command `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json` from `SKILL.md:297`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Capture a baseline first: pass counts for the advisor runtime suite and the plugin suite, and the list of tests that pin today's fallback text. Each requirement gets a test that fails before its change. The five-turn repeat test runs once against the hook and once against the plugin, and once more with no session id to prove the fall-open path is intact. The parity test compares plugin and renderer output for each status. Rerun both whole suites at the end and report the delta.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 002-hook-deadline-and-diagnostics, hard. It delivers the fallback to Codex, Cursor and Devin, and the flags that measure R6.
- 003-hook-path-cli-spawn-trim, soft. It produces the `skipped` case.
- None for R6. The operator approved head-only repeats.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert this phase's commit. For R6 alone, setting `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` turns off all reduction in both the hook (`hooks/lib/directive-lifecycle.ts:38`) and the plugin (`:262`), so every turn gets the full text again without a revert.
<!-- /ANCHOR:rollback -->

---
