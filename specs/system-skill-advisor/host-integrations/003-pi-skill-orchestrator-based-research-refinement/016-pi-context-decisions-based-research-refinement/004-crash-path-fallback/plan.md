---
title: "Implementation Plan: Crash-Path Fallback and Threshold Doc Line"
description: "Return the outage fallback from the shared Claude hook's unhandled catch inside a nested try, the way the OpenCode plugin already does, prove it with one test and add one sentence to the threshold variable's doc row."
trigger_phrases:
  - "crash path fallback plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Crash-Path Fallback and Threshold Doc Line

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node for the hook, Markdown for the doc line |
| **Framework** | The shared Claude `UserPromptSubmit` handler, reused by Pi, DSH and Vibe |
| **Storage** | None |
| **Testing** | Vitest hook suite in the advisor runtime |

### Overview
The catch at `hooks/claude/user-prompt-submit.ts:468-480` keeps its diagnostic and then returns the timeout fallback as `additionalContext` instead of `{}`. The render sits in a nested try that falls back to `{}`. One test proves it, and one sentence in `ENV-REFERENCE.md` says when the confidence-threshold variable is read.

Paths are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `sed -n 468,480p hooks/claude/user-prompt-submit.ts` still shows the catch that ends in `return {};`
- [ ] `npx vitest run tests/hooks` from `runtime/` exits 0 before the edit

### Definition of Done
- [ ] `npx vitest run tests/hooks` from `runtime/` exits 0 with the new test included
- [ ] `git diff --stat` lists only the three planned files
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Visible fallback in a nested try.

### Key Components
- **The catch in `hooks/claude/user-prompt-submit.ts:468-480`**: after `emitDiagnostic` (`:469-478`), it renders `renderAdvisorTimeoutFallback()` inside its own try and returns `{ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext } }`. Its inner catch returns `{}`. The hook imports `renderAdvisorBrief`, `renderAdvisorFallbackDirective` and `observeEmittedAdvisorPolicy` from `runtime/lib/render.js` (`:32-36`), so the edit adds `renderAdvisorTimeoutFallback` (`runtime/lib/render.ts:669-674`) to that import. The shape copies the OpenCode plugin's catch (`.opencode/plugins/system-skill-advisor.js:1574-1598`): set the failure state, render the fallback inside a try, swallow a render fault.
- **The test in `runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`**: it stubs `buildCliBrief` the way `runHookWithStore` does (`:79`, `:87-93`), injects a `renderBrief` that throws and expects `additionalContext` to equal `expectedOutageContext('fail_open')` (`:38`), the helper the timeout test AS6 already uses (`:470`). It also reads the diagnostic's `errorCode` as `UNKNOWN`.
- **The doc row at `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:382`**: one sentence added to the description cell. The value is read once when the daemon starts (`runtime/lib/scorer/fusion.ts:72`), and the per-request `confidenceThreshold` option of `advisor_recommend` is the supported override (`runtime/handlers/advisor-recommend.ts:518-521`). Hook briefs always send `confidenceThreshold` 0.8 (`hooks/lib/skill-advisor-cli-fallback.ts:245`), so the variable never reaches them, even after a daemon restart. The sentence says that too.

### Data Flow
A throw anywhere in the try at `:316-467` lands in the catch. The diagnostic is written as today, then the fallback text goes back as `additionalContext`. Pi, DSH and Vibe read `additionalContext` from the returned object and pass it on (`hooks/pi/prompt-advisor.ts:316-317`, `hooks/dsh/prompt-advisor.mjs:174`, `hooks/vibe/prompt-advisor.mjs:241`), so they get the fallback with no adapter edit.

### Why this is small
The catch fired 0 times across 8,231 retained diagnostic records on 2026-11-18, and 0 of 8,211 in the orchestrator's earlier count. The change is a cheap guard for a fault that has not happened, not an incident fix. The adapter import-failure catches stay out of scope for the same reason.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup re-reads the catch and runs the hook suite for a baseline. Implementation edits the catch and its import in `hooks/claude/user-prompt-submit.ts`, adds the test and adds the doc sentence. This phase builds before phase 003, whose guard would otherwise shift the catch lines pinned here. Verification runs the hook suite and checks the diff covers only the three files. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`npx vitest run tests/hooks` from `runtime/` must exit 0. The one new test fails before the edit, because the handler returns `{}`, and passes after it. The three existing `{}` cases (`:411`, `:432`, `:446`) cover the disabled hook and the parse failure. They never reach the catch and must stay green unchanged.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the existing runtime. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the fallback appears on prompts where the hook did not crash. Revert the one commit, which restores the `{}` return, removes the test and removes the doc sentence.
<!-- /ANCHOR:rollback -->

---
