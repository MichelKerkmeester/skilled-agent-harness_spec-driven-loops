---
title: "Feature Specification: Crash-Path Fallback and Threshold Doc Line"
description: "The shared Claude hook handler returns an empty object when its own code throws, so the model loses the route and the comment-hygiene directive with no sign of an outage. This phase returns the visible outage fallback there instead, and adds one doc line saying the confidence-threshold variable is read once at daemon start."
trigger_phrases:
  - "crash path fallback"
  - "phase 4 crash path fallback"
  - "advisor unhandled hook exception fallback"
  - "advisor confidence threshold daemon start"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Crash-Path Fallback and Threshold Doc Line

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-18 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 002-pasted-context-stripping |
| **Successor** | 003-follow-up-routing-benchmark |
| **Handoff Criteria** | The new hook test passes, the existing hook tests stay green and the doc line is in `ENV-REFERENCE.md`. Phase 003 builds after this one, because both edit `hooks/claude/user-prompt-submit.ts` and its hook test, and 003's guard would shift the lines this phase pins |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the pi-context-decisions refinement packet. It implements R2 in the shrunk form and N1 as a doc line, as `../001-deep-research/research/review-overengineering-opus-high.md` Groups 1 and 2 set out.

Paths are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot.

**Scope Boundary**: One edit inside one catch, one test and one doc line. No new output field, warning or schema bump.

**Dependencies**:
- `renderAdvisorTimeoutFallback` in `runtime/lib/render.ts:669-674`, which already renders the outage head and the directives.

**Deliverables**:
- The catch returns the outage fallback as `additionalContext`.
- One test that throws from `renderBrief` and reads the fallback.
- One sentence in `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`handleClaudeUserPromptSubmit` wraps its work in one try (`hooks/claude/user-prompt-submit.ts:316`). Its catch (`:468-480`) records a `fail_open` diagnostic with the fixed detail `Unhandled UserPromptSubmit hook exception` and returns `{}` (`:479`). So when the hook's own code throws, for example while finding the workspace root (`:344`), rendering (`:387-389`) or observing the policy (`:460`), the model gets nothing: no route, no outage line and no comment-hygiene directive. A timeout, by contrast, already produces a visible outage line. The OpenCode plugin already pushes a fallback on its own unhandled catch, inside a nested try (`.opencode/plugins/system-skill-advisor.js:1574-1598`).

Separately, `ENV-REFERENCE.md` says `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD` overrides the threshold (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:382`). The value is read once at module load (`runtime/lib/scorer/fusion.ts:72`, `runtime/lib/skill-advisor-brief.ts:125`), so in the daemon only its start-time environment counts. A caller who sets it later sees no effect.

### Purpose
A crash inside the shared hook shows the model the same outage line a timeout does, and the threshold doc tells operators which override works.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run on 2026-11-18 over the advisor's retained hook diagnostics.

```text
$ D="$TMPDIR/speckit-skill-advisor-metrics"; echo "files=$(ls "$D"/*-diagnostics.jsonl | wc -l | tr -d ' ') records=$(cat "$D"/*-diagnostics.jsonl | wc -l | tr -d ' ') unhandled=$(cat "$D"/*-diagnostics.jsonl | grep -c 'Unhandled UserPromptSubmit hook exception')"
files=187 records=8231 unhandled=0
```

The catch has not fired in the retained log, so this is a cheap guard, not an incident fix. The orchestrator's earlier count was 0 of 8,211 records.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Render the timeout fallback inside a nested try in the catch at `hooks/claude/user-prompt-submit.ts:468-480`, and return it as `additionalContext`. Keep `{}` when the render itself throws.
- Add one test that injects a throwing `renderBrief` and asserts the fallback text.
- Add one sentence to the `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD` row: the value is read once when the daemon starts, the per-request `confidenceThreshold` option is the supported override, and hook briefs always send `confidenceThreshold` 0.8 (`hooks/lib/skill-advisor-cli-fallback.ts:245`), so the variable never reaches them.

### Out of Scope
- The per-adapter import-failure catches (Pi `hooks/pi/prompt-advisor.ts:323-324` and the missing `else` at `:285`, DSH `hooks/dsh/prompt-advisor.mjs:181-184`, Vibe `hooks/vibe/prompt-advisor.mjs:244-246`) - they fire only when the built module fails to import, and nobody has named an environment where that happens.
- The two `PARSE_FAIL` returns (`hooks/claude/user-prompt-submit.ts:340`, `:356`) - malformed input, not a crash.
- A closed error code in the catch, a threshold-source output field, a warning or a schema bump - no current failure needs them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `hooks/claude/user-prompt-submit.ts` | Modify | Import `renderAdvisorTimeoutFallback` and return it from the catch inside a nested try |
| `runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modify | One test with a throwing `renderBrief` |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | One sentence on the row at `:382` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A throw inside the hook's try returns the outage fallback | The new test injects a `renderBrief` that throws and reads `additionalContext` equal to the outage fallback for `fail_open`, with the diagnostic still `errorCode: UNKNOWN` |
| REQ-002 | Existing hook behavior is unchanged | `npx vitest run tests/hooks` from `runtime/` exits 0, including the three `{}` cases at `runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:411`, `:432` and `:446`, which never reach the catch |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The threshold doc names the working override | `rg -n 'daemon starts' .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints the `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD` row, and `git diff --stat` on that file shows one line changed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One edit in the shared handler covers Claude, Pi, DSH and Vibe, because the three adapters pass `additionalContext` through (`hooks/pi/prompt-advisor.ts:316-317`, `hooks/dsh/prompt-advisor.mjs:174`, `hooks/vibe/prompt-advisor.mjs:241`).
- **SC-002**: `git diff --stat` lists exactly the three files in Files to Change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `renderAdvisorFallbackDirective`, which the timeout renderer calls, runs `observeAdvisorPolicy` (`runtime/lib/render.ts:664`) | If the original throw came from the policy observer, the fallback render can throw again | The nested try returns `{}` in that case, the same output as today |
| Risk | The fallback skips the directive-lifecycle dedup and always sends the full text | Low | That matches the hook's stated design: thrown errors get the full text (`hooks/claude/user-prompt-submit.ts:390-394`) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- `SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD` is read the same way (`runtime/lib/scorer/fusion.ts:73`). The brief names only the confidence variable, so the plan changes only its row. The operator decides whether the uncertainty row gets the same sentence.
- Closed 2026-11-18 by the operator: the sentence also says hook briefs always send `confidenceThreshold` 0.8, so the variable never reaches them. The Claude hook calls the CLI brief builder with no threshold config (`hooks/claude/user-prompt-submit.ts:371-375`), and the builder then sends `confidenceThreshold: 0.8` on every request (`hooks/lib/skill-advisor-cli-fallback.ts:245`, fallback at `:155-158`). A per-request value wins over the daemon default (`runtime/handlers/advisor-recommend.ts:518-521`), so the daemon-start value reaches only direct CLI callers that omit the option.
<!-- /ANCHOR:questions -->

---
