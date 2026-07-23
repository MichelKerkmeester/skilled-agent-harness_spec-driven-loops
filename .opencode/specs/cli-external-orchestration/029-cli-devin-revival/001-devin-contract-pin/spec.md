---
title: "Feature Specification: Devin CLI contract pin"
description: "Verify the live Devin CLI (v3000.2.17) contract - install, hooks, config, permissions, models, subagents, auth - before any executor or skill-packet work depends on assumptions from the pre-deprecation (2026-05) product."
trigger_phrases: ["devin contract pin", "devin cli verification", "devin hooks contract"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/001-devin-contract-pin"
    last_updated_at: "2026-07-23T20:03:10Z"
    last_updated_by: "claude-code"
    recent_action: "Verified live Devin CLI contract against docs.devin.ai"
    next_safe_action: "Hand contract facts to phase 002 (deep-loop-executor-support)"
    blockers: ["devin auth login requires an interactive OAuth browser flow - not automatable"]
    key_files: ["implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Devin CLI is a real, currently-shipping local coding agent (not primarily a cloud-only product as the original 2026-05 packet partly assumed) with a native project-level hook contract closely mirroring Claude Code's own hook event names."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Devin CLI contract pin

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-23 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/029-cli-devin-revival` |
| **Predecessor** | None (first phase) |
| **Successor** | `002-deep-loop-executor-support` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The archived `016`/`017`/`018` cli-devin packets and the `022` deprecation were all authored against the Devin CLI as it existed 2026-05/06. Fourteen months of product evolution (current version `3000.2.17`) means several of that era's documented assumptions are now stale: a 2-mode permission system (now 4: normal/accept-edits/bypass/autonomous), no documented local hook contract for the IDE-runtime hooks vs. the CLI itself, no documented subagent/`AGENT.md` delegation mechanism, and older model slugs. Building the revival on the archived assumptions would restore an inaccurate skill.

### Purpose
Install the CLI, verify its live version, and pin the current contract for every surface the later phases depend on: invocation/flags, hooks, config file format and precedence, permissions model, model roster, subagent delegation, sandbox, and auth - each confirmed against the official `docs.devin.ai` reference, not inferred.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Install the official Devin CLI and confirm the live binary version.
- Confirm auth model (OAuth login vs. `COGNITION_API_KEY`/service-user API key for headless) and current auth state on this machine.
- Confirm the hooks contract (event names, schema, config file locations) against `docs.devin.ai/cli/extensibility/hooks/**`.
- Confirm the config file format/precedence (`~/.config/devin/config.json`, `.devin/config.json`, `.devin/config.local.json`) against `docs.devin.ai/cli/reference/configuration/**`.
- Confirm the permissions model (`Read()`/`Write()`/`Exec()`/`Fetch()` allow/deny/ask, 4 permission modes) against `docs.devin.ai/cli/reference/permissions.md`.
- Confirm the model roster (`swe-1.6` + fast variant, `opus`, `gpt`/codex, `gemini`, `deepseek`, `kimi`, `glm`, `adaptive` router) against `docs.devin.ai/cli/models.md`.
- Confirm the subagent delegation mechanism (`subagent_explore`/`subagent_general`, custom `.devin/agents/[name]/AGENT.md`) against `docs.devin.ai/cli/subagents.md`.
- Confirm the cloud-handoff command (`/handoff`) against `docs.devin.ai/cli/handoff.md`.

### Out of Scope
- Completing `devin auth login` (interactive OAuth, operator-only action).
- Any executor, skill-packet, or hook-adapter implementation (phases 002-004).

### Files to Change
| File Path | Change Type | Phase | Description |
|---|---|---|---|
| (none - verification only) | N/A | 001 | This phase produces evidence, not code changes. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | Devin CLI installed and its version confirmed via `devin --version`. | P0 |
| REQ-002 | Auth state confirmed via `devin auth status`; headless auth path (`COGNITION_API_KEY` / service-user `cog_` token) documented for later CI use even though not completed here. | P0 |
| REQ-003 | Hook event list, schema, and config file locations confirmed against official docs, not assumed from the archived packets. | P0 |
| REQ-004 | Config file format, locations, and precedence order confirmed. | P0 |
| REQ-005 | Permission model (modes + `Read/Write/Exec/Fetch` matcher syntax) confirmed as materially different from the archived 2-mode assumption. | P1 |
| REQ-006 | Model roster confirmed, including that `swe-1.6` is Cognition-native and still the CLI's coding-specialized model. | P1 |
| REQ-007 | Subagent delegation mechanism confirmed as a genuine (if different-shaped) analog to Codex's `-p <profile>` / cli-opencode's `--agent <slug>`. | P2 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- `devin --version` returns a live version string.
- Every REQ above has a citation to either a live command's stdout or a `docs.devin.ai` URL, not an inference.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- **Docs-vs-binary drift**: fetched documentation could describe a newer/older feature set than the exact installed build. Mitigated by cross-checking every doc claim against a live `--help`/subcommand where one exists (`essential-commands.md` and `reference/commands.md` were both fetched and agree on the command surface).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

None beyond standard evidence-based verification.

## 8. EDGE CASES

- `devin` absent from `PATH` entirely (handled by phase 002's fail-closed executor guard, not this phase).
- User never completes `devin auth login` (headless `COGNITION_API_KEY` path documented as the CI-safe alternative).

## 9. COMPLEXITY ASSESSMENT

Low - read-only verification, no code changes.

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Docs describe unshipped/beta features | Low | Medium | Cross-checked docs against live `--help` output where available |

## 11. USER STORIES

- As the operator, I want the revival's later phases built against the CLI I actually have installed, not a 14-month-old assumption.

## 12. OPEN QUESTIONS

None - all findings evidence-backed (see `implementation-summary.md`).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` (this phase)
- `../002-deep-loop-executor-support/spec.md` (consumes this phase's contract facts)
