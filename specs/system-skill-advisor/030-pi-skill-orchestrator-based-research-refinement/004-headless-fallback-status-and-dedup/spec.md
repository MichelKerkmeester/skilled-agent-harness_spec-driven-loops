---
title: "Feature Specification: Headless Fallback Status and Dedup"
description: "When the advisor finds no route, every runtime sends the same 215-character directives block, whether the advisor timed out, matched nothing or skipped the prompt, and Claude and OpenCode resend it in full on every such turn. This phase heads the fallback with one line that says what happened and, on an outage, names the CLI command the model can run, which also lets the existing lifecycle split drop the repeated block."
trigger_phrases:
  - "advisor fallback status line"
  - "advisor no skill matched"
  - "fallback names advisor cli"
  - "headless fallback dedup"
  - "repeated directives fallback"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Headless Fallback Status and Dedup

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-09-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-hook-path-cli-spawn-trim |
| **Successor** | None |
| **Handoff Criteria** | A forced timeout names the CLI command, a scored no-match says no skill matched, and five no-route turns in one Claude session deliver one full block followed by head-only repeats |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Pi skill orchestrator research for skill advisor refinement specification. It carries recommendations R4 and R6 from `../001-deep-research/research/research.md` section 11.

**Scope Boundary**: The advisor's fallback renderer, the Claude hook's use of it, the OpenCode plugin's copy of it and its repeat handling, and the Pi hook's debug classifier. No change to scoring, to what counts as a match or to the directives text itself.

**Dependencies**:
- 002-hook-deadline-and-diagnostics, hard. Its R1 makes the fallback reach Codex, Cursor and Devin, and its `emittedBytes` and directives-suppressed flag measure R6.
- 003-hook-path-cli-spawn-trim, soft. Its gate creates the `skipped` case this phase labels.

**Deliverables**:
- A fallback headed by one status line for each no-route case
- The CLI command named in the outage line
- Head-only repeats of the fallback on Claude and OpenCode

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The fallback is the directives block alone (`.skilled/skills/system-skill-advisor/runtime/lib/render.ts:443-448`). The renderer returns `null` when no recommendation passes (`:409-413`), and the Claude hook sends the fallback for any `null` (`hooks/claude/user-prompt-submit.ts:302`). So a timeout, an unreachable daemon, a scored no-match and a skipped prompt all look the same to the model, and none of them tells it how to recover. The recovery exists: the CLI command is documented at `SKILL.md:297`. A timeout renderer that marks the outage exists too (`render.ts:450-463`), but nothing calls it outside its own file. The OpenCode plugin keeps its own copy of the block (`.skilled/plugins/system-skill-advisor.js:61`).

The block is also resent in full. The lifecycle split looks for the `\nDirectives:` separator after a head (`hooks/lib/directive-lifecycle.ts:44-47`) and reduces only when a head exists (`:126-127`). The fallback starts with `Directives:`, so it has no head, cannot be split, and every no-route turn on Claude and OpenCode delivers all of it (`hooks/claude/user-prompt-submit.ts:303-308`, plugin `:267-272`). Pi already suppresses an exact repeat (`hooks/pi/prompt-advisor.ts:129-152`).

### Purpose
The model can tell an outage from a no-match, can recover from an outage in the same turn, and does not reread the same directives block on every no-route turn.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R4: head the fallback with one status line, then the unchanged directives block after `\nDirectives:`:
  - Outage (`fail_open`, or `degraded` with `unavailable` freshness): the status and the CLI command from `SKILL.md:297`. Build it by rewriting `renderAdvisorTimeoutFallback`, which has no caller outside its file.
  - Scored no-match (`ok`, nothing passes): a short line saying no skill matched.
  - Skipped by the gate: a short line saying the advisor skipped the prompt.
- R4: mirror the same three lines in the OpenCode plugin's fallback paths (`:61`, `:1298-1318`, `:1371-1383`).
- R4: teach Pi's debug classifier the new heads (`hooks/pi/prompt-advisor.ts:184`), which today labels a fallback by its `Directives:` prefix.
- R6: once the fallback has a head, remove it from the hook's fall-open list, so the existing split keeps the head and drops the repeated directives block. The operator allowed this on 2026-09-26.

### Out of Scope
- The directives text and the brief format for a real recommendation.
- The shim's `{}` when it kills the child. Phase 002 makes that rare.
- Pi's repeat handling, which already works.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | Modify | R4: status-headed fallback, with the timeout renderer rewritten as the outage line |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Modify | R4: pick the fallback by result status at `:302`. R6: drop the fallback from the fall-open list at `:303-308` |
| `.skilled/plugins/system-skill-advisor.js` | Modify | R4 and R6 in the plugin's copy |
| `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Modify | R4: debug classifier at `:184` |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modify | Status lines and head-only repeats |
| `.skilled/plugins/tests/system-skill-advisor.test.cjs`, `runtime/tests/system-skill-advisor-plugin.vitest.ts` | Modify | Plugin status lines and repeats |
| `runtime/tests/policy-observation-sink.vitest.ts`, `runtime/tests/policy-plan-negative-controls.vitest.ts`, `runtime/tests/parity/policy-plan-serializer-parity.vitest.ts` | Modify | These pin the current fallback text |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | R4: an outage names the recovery | A Claude hook test whose CLI stub times out emits a fallback whose first line names the outage and contains `skill-advisor.cjs advisor_recommend` |
| REQ-002 | R4: a no-match is told apart from an outage | A hook test with an `ok` result and no passing recommendation emits the no-match line, and a `skipped` result emits the skipped line |
| REQ-003 | R4: the plugin and the renderer agree | The plugin's three lines equal the renderer's output for the same status, checked by a parity test |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | R6: repeats drop the block | Five no-route turns in one Claude session with a known session id deliver one full fallback, then four head-only lines. An unknown session still gets the full fallback every turn |
| REQ-005 | R6: the plugin matches | The same five-turn test against the plugin gives the same result |
| REQ-006 | R4: Pi's debug line stays accurate | Pi's debug output labels each of the three heads by its case, not by the status word alone |
| REQ-007 | R4: the head stays short | The no-match and skipped heads are each under 40 characters, and the outage head under 160, checked by test |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A model that meets an advisor outage has the command to recover in the same turn.
- **SC-002**: The directives-suppressed flag from 002 shows repeats on no-route turns, and `emittedBytes` on those turns falls to the head's size.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | R6 changes the hook's stated rule that a fallback falls open to the full block | Med | The operator approved the change. Unknown sessions, the kill switch and thrown errors still fall open |
| Risk | A head on every no-match and skipped turn adds bytes on the first such turn | Low | REQ-007 caps the heads, and R6 makes later repeats cheaper than today |
| Risk | Whether a model runs the named command is unknown (research Q6) | Low | After this phase, force a timeout and watch whether the model runs the command |
| Dependency | 002's R1 | High | Without it, Codex, Cursor and Devin never see any fallback, so R4 would reach only Claude, Pi and OpenCode |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The operator decided on 2026-09-26 that Claude and OpenCode may drop a repeated fallback's directives block in a known session (research Q7). The hook's comment at `hooks/claude/user-prompt-submit.ts:303-308` changes with the code, and unknown sessions keep the full block.
<!-- /ANCHOR:questions -->

---
