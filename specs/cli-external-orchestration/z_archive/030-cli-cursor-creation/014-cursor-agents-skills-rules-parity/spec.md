---
title: "Feature Specification: Cursor agents/skills/rules parity"
description: "Resolve whether Cursor's UserPromptSubmit hook already injects skill-advisor-equivalent context, populate the currently-empty .cursor/rules/*.md, mirror the 13-agent roster into .cursor/agents/, and record that a dedicated command-file system is not a concept cursor-agent supports."
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
    recent_action: "Implemented static rules and parity findings."
    next_safe_action: "Review scoped uncommitted diff."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cursor-agents-skills-rules-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does .cursor/hooks.json's UserPromptSubmit entry already inject skill-advisor-equivalent context? Must be resolved by reading the actual hook source before deciding whether new rules content should also carry advisor-routing information."
    answered_questions:
      - "CORRECTED: Cursor DOES support custom subagents via .cursor/agents/*.md plus Claude-format auto-import from .claude/agents/*.md -- both confirmed live. An earlier pass wrongly inferred 'no such concept' from the absence of a --help flag; profiles are discovered by file convention, so a flag's absence proves nothing."
      - ".cursor/rules/ does not exist (0 files) -- a real gap, unlike Devin's free CLAUDE.md/AGENTS.md auto-discovery."
      - "A dedicated command-file system is not a concept Cursor CLI supports, mirroring the Devin finding -- confirmed live via --help."
      - "beforeSubmitPrompt is designed to call the shared skill-advisor brief builder, but the installed Cursor CLI does not deliver the event; .cursor/rules/ is the static complement."
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
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../013-cursor-spec-gate-prebind/spec.md` (sequential); `../004-cursor-hook-adapter-layer/spec.md` (dependency — provides access to the `UserPromptSubmit` hook source this phase must read first) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The user asked to "scaffold a phase that makes sure cli-cursor and cli-devin have all the agents, commands and skills properly working and supported, like .claude and .opencode have." Live investigation during the 5-iteration deep-research pass found:

- **CORRECTED (superseded finding).** An earlier pass in this phase recorded that "`cursor-agent --help` has no custom-agent-loading concept at all — confirmed live," and treated custom agents as an architectural non-concept for Cursor. **That was wrong.** Cursor loads custom subagents from `.cursor/agents/*.md` (its own documented convention, per its bundled `create-subagent` skill) and additionally auto-imports Claude-format `.claude/agents/*.md`. Both are confirmed live: a roster probe listed all 13 repo agents, and a real dispatch through one returned content derived from the agent body. The original error came from grepping `--help` for an agent flag; agent profiles are discovered by *file convention*, never by a flag, so the flag's absence proved nothing about the concept's existence.
- `.cursor/rules/` does not exist (0 files) — a genuine gap, unlike Devin's free `CLAUDE.md`/`AGENTS.md` auto-discovery which required no build work at all.
- The registered `beforeSubmitPrompt` adapter is designed to inject a skill-advisor-equivalent brief, but a live marker re-probe under the installed Cursor CLI confirmed that the event is dormant. The static rules file therefore carries compact routing pointers as a complement, not as a duplicate of delivered dynamic output.
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
- Mirror all 13 repo agents into `.cursor/agents/<name>.md` as symlinks to the canonical `.claude/agents/<name>.md`, and correct the superseded "custom agents are a non-concept" claim wherever it was recorded.
- Record the "commands doesn't apply as a distinct category for Cursor" decision explicitly, mirroring the Devin-side decision in the sibling phase.

### Out of Scope
- Authoring Cursor-specific agent *content*. The mirrors are symlinks to the canonical `.claude/agents/*.md`; no per-runtime rewrite of the 6,378 lines of agent bodies is in scope, because duplication would guarantee drift.
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
| REQ-003 | All 13 repo agents are dispatchable in Cursor, and the superseded "non-concept" claim is corrected wherever recorded. | A live `cursor-agent` roster probe lists all 13 with no duplicates; a real dispatch through one succeeds; `cli-cursor/SKILL.md` documents `.cursor/agents/` + Claude-format auto-import and flags the earlier claim as wrong. |
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
| Research | 6/20 | The adapter source and installed-CLI delivery result are recorded in the phase evidence. |
| **Total** | **20/70** | **Level 2 — small build gated on a source-read verification step.** |
<!-- /ANCHOR:complexity -->

---

## 7. OPEN QUESTIONS

The `beforeSubmitPrompt` entry is designed to inject a shared skill-advisor-equivalent brief, but live delivery is dormant under the tested Cursor CLI build. The static `.cursor/rules/skill-routing.md` file carries concise repository-specific routing pointers until that dynamic path delivers.
<!-- /ANCHOR:questions -->

---

## Related Documents
- `plan.md`, `tasks.md`, `checklist.md`
- `../004-cursor-hook-adapter-layer/spec.md` (predecessor — provides the `UserPromptSubmit` hook implementation)
- `../../029-cli-devin-revival/015-devin-agents-skills-rules-parity/spec.md` (sibling phase — Devin-side parity investigation)
