---
title: "Feature Specification: Haiku-default Explore override and haiku-pinned context agent across Claude and sibling runtime surfaces"
description: "Claude Code's built-in Explore subagent runs on the main model, so every search on an Opus or Sonnet session pays the main model's price. This packet overrides Explore to run on Haiku by default, pins the context agent to Haiku, and keeps every runtime's agent roster in step."
trigger_phrases:
  - "haiku explore and context agents"
  - "haiku default explore override and haiku pinned context"
  - "explore subagent haiku"
  - "context agent model haiku"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Haiku-default Explore override and haiku-pinned context agent across Claude and sibling runtime surfaces

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-08 |
| **Branch** | `scaffold/019-haiku-explore-and-context-agents` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Claude Code's built-in Explore subagent no longer runs on Haiku. It inherits the main session model, so on Opus every search sweep is billed at the main model's rate. The documented settings route (`CLAUDE_CODE_SUBAGENT_MODEL` plus `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1`) forces every subagent onto one model and stops Claude from passing a different model when the operator asks for one. Without the force flag, Explore and Plan ignore the variable entirely.

### Purpose
Explore runs on Haiku by default and the `context` and `markdown` agents are pinned to Haiku, while a model the operator names on request still wins and no force flag is set.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A user-level override at `~/.claude/agents/Explore.md` with `name: Explore` and `model: haiku`.
- The same override in the repo's canonical Claude tree, marked Claude-only so no other runtime surface carries a copy.
- A Claude-only exemption in the roster check and the symlink sync, with one test.
- `model: haiku` in the frontmatter of `.claude/agents/context.md` and `.claude/agents/markdown.md`.
- Correcting the documents that state no agent file declares a model.

### Out of Scope
- `CLAUDE_CODE_SUBAGENT_MODEL` and `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` - the first does not reach Explore and the second removes the operator's per-request model choice.
- A dispatch hook that rewrites the model on every Agent call - frontmatter is a default, and a hook is a separate enforcement design.
- The built-in Plan subagent - not requested.
- Pinning Haiku in the OpenCode, Codex and Pi dialects - those runtimes have their own model configuration.
- Mirroring Explore to the other runtimes - only Claude Code has the built-in to replace, and the Codex generator rejects a capitalised filename, so a mirror would be a second unrelated agent. The operator chose Claude-only over loosening the Codex generator.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `~/.claude/agents/Explore.md` | Create | User-level Haiku Explore override (outside the repo, already written) |
| `.claude/agents/Explore.md` | Create | Canonical Claude-dialect override with `model: haiku` and read-only `tools:` |
| `.claude/agents/context.md`, `.claude/agents/markdown.md` | Modify | Add `model: haiku` to frontmatter |
| `.claude/agents/README.txt` | Modify | Correct the model note and record Explore as Claude-only |
| `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` | Modify | Skip Claude-only agents when building the roster |
| `.skilled/commands/doctor/scripts/tests/agent-roster-mirror-check.test.cjs` | Modify | One test: a Claude-only agent needs no mirror |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` | Modify | Skip Claude-only agents when linking Cursor and Devin |
| `.skilled/skills/system-deep-loop/deep-improvement/references/shared/agent-mirror-crosswalk.md` | Modify | Correct the sections that say no Claude-tree agent declares a model |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `~/.claude/agents/Explore.md` and `.claude/agents/Explore.md` exist with `name: Explore`, `model: haiku` and a read-only `tools:` allow-list. |
| REQ-002 | Explore is exempt from mirroring in the roster check and the symlink sync, and `agent-roster-mirror-check.cjs` reports `STATUS=OK` with Explore present only in the Claude tree. |
| REQ-003 | `.claude/agents/context.md` and `.claude/agents/markdown.md` frontmatter declare `model: haiku`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The runtime-mirror, Pi, Codex and agent-mirror-sync checks pass after the change, as they did before it. |
| REQ-005 | The Claude agents README and the mirror crosswalk record Explore as Claude-only and no longer claim that no Claude-tree agent declares a model. |
| REQ-006 | No force flag or subagent model env var is added to any `settings.json`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh Claude Code session spawns Explore on Haiku, and `context` on Haiku, with no `settings.json` change.
- **SC-002**: All five mirror and sync checks that passed before the change pass after it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Claude Code reads agent files at session start | A running session keeps the built-in Explore | Verify in a new session, which only the operator can start |
| Risk | The `context` and `markdown` pins are defaults, not locks | Medium: an explicit model on the Agent call or the force flag overrides it | Say so in the close-out and leave the force flag unset on purpose |
| Risk | Cursor and Devin symlink to `context.md` and now read `model: haiku` | Medium: either runtime may reject the value or ignore it | Mark UNKNOWN until each runtime is run, and note the exposure |
| Risk | Explore on Haiku misses files and the work is redone | Low: the operator can name another model per request | Revert the one file or ask for another subagent |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Search-type subagent runs bill at the Haiku rate instead of the main model's rate.
- **NFR-P02**: No added latency on sessions that never spawn Explore or `context`.

### Security
- **NFR-S01**: The Explore override keeps the built-in's read-only posture through an explicit `tools:` allow-list with no Write or Edit.
- **NFR-S02**: No secret or credential is written to any file.

### Reliability
- **NFR-R01**: Mirror drift stays at zero on every runtime surface.
- **NFR-R02**: Each edit reverts with one `git checkout` or one `rm`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an Explore call with no search target returns a short report that nothing was searched.
- Maximum length: not applicable, the files are short prose.
- Invalid format: an unknown `model` value falls back to the main model in Claude Code, which is UNKNOWN for Cursor and Devin.

### Error Scenarios
- External service failure: the Haiku alias is unavailable, so Claude Code resolves it per its alias rules or errors at spawn.
- Network timeout: not applicable.
- Concurrent access: a user-level and a project-level `Explore.md` coexist, and the project file wins.

### State Transitions
- Partial completion: if the generators are not run, the roster check reports the missing surfaces by name.
- Session expiry: a session started before the change keeps the old agent list until it restarts.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | About 14 small files across six runtime trees |
| Risk | 8/25 | Config and agent definitions only, one-command rollback |
| Research | 6/20 | Docs check for model precedence, mirror contract read |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Do Cursor and Devin accept `model: haiku` in an agent file? Unanswered until each runtime runs the `context` agent.
- Does Claude Code load a project `Explore.md` over the built-in in this version (2.1.294)? The docs say yes, and the live check needs a new session.
<!-- /ANCHOR:questions -->

---
