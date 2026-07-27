---
title: "Feature Specification: Cursor agents/skills/rules parity"
description: "Resolve whether Cursor's UserPromptSubmit hook already injects skill-advisor-equivalent context, populate the currently-empty .cursor/rules/*.md, and record that custom agent-profile loading and a dedicated command-file system are not concepts cursor-agent supports."
trigger_phrases:
  - "cursor agents skills rules parity"
  - "cursor rules populate"
  - "cursor UserPromptSubmit skill advisor"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/014-cursor-agents-skills-rules-parity"
    last_updated_at: "2026-07-27T07:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase re-scaffolded (Planned)."
    next_safe_action: "Read UserPromptSubmit hook source; then populate .cursor/rules/*.md."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cursor-agents-skills-rules-parity"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does .cursor/hooks.json's UserPromptSubmit entry already inject skill-advisor-equivalent context? Must be resolved by reading the actual hook source before deciding whether new rules content should also carry advisor-routing information."
    answered_questions:
      - "cursor-agent --help has no custom-agent-loading concept -- confirmed live; this is an architectural non-concept for Cursor, not a gap to fill."
      - ".cursor/rules/ does not exist (0 files) -- a real gap, unlike Devin's free CLAUDE.md/AGENTS.md auto-discovery."
      - "A dedicated command-file system is not a concept Cursor CLI supports, mirroring the Devin finding -- confirmed live via --help."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Cursor agents/skills/rules parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../004-cursor-hook-adapter-layer/spec.md` (dependency — provides access to the `UserPromptSubmit` hook source this phase must read first) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The user asked to "scaffold a phase that makes sure cli-cursor and cli-devin have all the agents, commands and skills properly working and supported, like .claude and .opencode have." Live investigation during the 5-iteration deep-research pass found:

- `cursor-agent --help` has no custom-agent-loading concept at all — confirmed live. This is an architectural non-concept for Cursor (unlike Devin, which has a real, documented-but-unbuilt `.devin/agents/` mechanism), not a gap to fill.
- `.cursor/rules/` does not exist (0 files) — a genuine gap, unlike Devin's free `CLAUDE.md`/`AGENTS.md` auto-discovery which required no build work at all.
- An open question was raised but not resolved during the research pass: does `.cursor/hooks.json`'s `UserPromptSubmit` entry already inject skill-advisor-equivalent context into every Cursor session? If it already does, populating `.cursor/rules/*.md` with overlapping routing content would be redundant; if it does not, the rules content should carry that routing information itself.
- A dedicated command-file system is not a concept Cursor CLI supports either, mirroring the Devin finding.

### Purpose
Resolve the `UserPromptSubmit` open question first by reading the actual hook source (not re-guessing), then populate `.cursor/rules/*.md` via `cursor-agent rule`/`generate-rule` informed by that answer, and record the agents/commands non-applicability decisions explicitly so they are not re-investigated as open gaps later.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the `.cursor/hooks.json` `UserPromptSubmit` hook's actual source code to determine whether it already injects skill-advisor-equivalent context.
- Populate `.cursor/rules/*.md` via `cursor-agent rule`/`generate-rule`, informed by the answer to the question above (either as a complement to existing hook-injected context, or as the primary carrier of routing information if the hook does not already do this).
- Record the "custom agent-profile loading is not a concept `cursor-agent` supports" decision explicitly.
- Record the "commands doesn't apply as a distinct category for Cursor" decision explicitly, mirroring the Devin-side decision in the sibling phase.

### Out of Scope
- Building a custom-agent-loading mechanism for Cursor — confirmed live as architecturally absent, not a gap.
- Any Devin-side work — tracked separately in `029-cli-devin-revival/015-devin-agents-skills-rules-parity/`.
- Modifying `.cursor/hooks.json`'s `UserPromptSubmit` hook itself — this phase reads it to answer the open question, it does not change its behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.cursor/rules/*.md` | Create | New rules content, informed by the resolved `UserPromptSubmit` question. |
| `cli-external-orchestration/cli-cursor/SKILL.md` | Modify | Record the agents/commands non-applicability decisions and the `UserPromptSubmit` finding. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The `UserPromptSubmit` open question is resolved by reading the actual hook source before any `.cursor/rules/*.md` content is written. | `implementation-summary.md` cites the specific file/lines read and states the answer before the rules-content creation timestamp. |
| REQ-002 | `.cursor/rules/*.md` is populated with content that does not duplicate what `UserPromptSubmit` already injects (if it injects anything). | The rules content and the hook's injected content are diffed and shown to be non-overlapping, or the rules content is scoped explicitly around the gap the hook does not cover. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The agents non-applicability decision is recorded explicitly. | `cli-cursor/SKILL.md` states `cursor-agent --help` has no custom-agent-loading concept, confirmed live. |
| REQ-004 | The commands non-applicability decision is recorded explicitly, mirroring the Devin-side decision. | `cli-cursor/SKILL.md` states Cursor CLI has no dedicated command-file-system concept, confirmed live. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `UserPromptSubmit` open question is resolved with a cited source read, not an assumption.
- **SC-002**: `.cursor/rules/*.md` contains real, non-empty, non-duplicative content.
- **SC-003**: The agents and commands non-applicability decisions are both recorded explicitly.
- **SC-004**: Phase 014 strict validation passes with 0 errors and 0 warnings.
- **SC-005**: Recursive parent strict validation (030-cli-cursor-creation) passes with 0 errors and 0 warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Populating `.cursor/rules/*.md` before resolving the `UserPromptSubmit` question produces redundant or conflicting routing content | Medium — wasted work and a confusing dual-source-of-truth for skill routing | REQ-001 makes the source-read a hard prerequisite, task-ordered first in `tasks.md`. |
| Dependency | Phase 004 (cursor-hook-adapter-layer) | Provides access to the `UserPromptSubmit` hook implementation this phase must read | Complete. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The new `.cursor/rules/*.md` content does not alter any existing hook behavior — it is a pure addition.

### Documentation
- **NFR-D01**: The `UserPromptSubmit` finding is cited with the actual file/lines read, not paraphrased from memory of the earlier research pass.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- If `UserPromptSubmit` already injects full skill-advisor-equivalent context, `.cursor/rules/*.md` is scoped to genuinely complementary content (e.g. repo-specific conventions) rather than being skipped entirely — Cursor still benefits from `.cursor/rules/` for content outside the hook's scope.

### State Transitions
- N/A — this phase adds static rules content and documentation; no runtime state transitions are involved.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 1 new rules-content file set + 1 doc update. |
| Risk | 6/25 | Read-before-write ordering avoids the main risk (redundant/conflicting content). |
| Research | 6/20 | Requires reading the actual `UserPromptSubmit` hook source, not yet done in this session. |
| **Total** | **20/70** | **Level 2 — small build gated on a source-read verification step.** |
<!-- /ANCHOR:complexity -->

---

## 7. OPEN QUESTIONS

- Does `.cursor/hooks.json`'s `UserPromptSubmit` entry already inject skill-advisor-equivalent context? Must be resolved via a source read as this phase's first task, per the task-ordering requirement noted in the parent `spec.md`'s Phase Transition Rules.
<!-- /ANCHOR:questions -->

---

## Related Documents
- `plan.md`, `tasks.md`, `checklist.md`
- `../004-cursor-hook-adapter-layer/spec.md` (predecessor — provides the `UserPromptSubmit` hook implementation)
- `../../029-cli-devin-revival/015-devin-agents-skills-rules-parity/spec.md` (sibling phase — Devin-side parity investigation)
