---
title: "sk-communication trigger commands"
description: "Phase parent for two sk-communication trigger commands: an in-context self-rewrite and a one-shot engine-choice projection flow, both preserving the projection and default-off invariants."
trigger_phrases:
  - "sk-communication trigger commands"
  - "rewrite response command"
  - "one-shot communication projection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers"
    last_updated_at: "2026-08-20T05:10:00.000Z"
    last_updated_by: "claude"
    recent_action: "Hardened the external-cli spawn boundary to group-kill (phase 008)"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - "spec.md"
      - "002-rewrite-response/spec.md"
      - "003-rewrite-response-by-external-agent/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "002-sk-communication-triggers-20260819"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Command 2 built as command-level orchestration (no package edits); external-cli provider is a future hardening."
      - "All six cli-* skills are selectable engines."
      - "Command names: /rewrite-response (self-rewrite, no LLM) and /rewrite-response-by-external-agent (engine choice)."
      - "Command 1 is engine-independent and applies the rewrite rubric in-context with no LLM or file writes."
      - "ON/OFF state uses process-scoped COMMUNICATION_PROJECTION_ENABLED, flipped off in a guaranteed finally/trap."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# sk-communication trigger commands

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase parent |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None |
| **Parent Packet** | `sk-communication/002-sk-communication-triggers` |
| **Predecessor** | `sk-communication/001-sk-communication-creation` |
| **Successor** | None |
| **Handoff Criteria** | Both commands authored to template, projection and default-off invariants intact, every touched folder validates `--strict` with zero errors. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-communication projection layer ships as a package that is off by default and invoked by hand. It has no operator-facing trigger surface: nothing lets a user (a) ask the active AI to re-render its own reply in the projection's plain-English style without spinning up any model, or (b) run the real projection flow once, against a chosen engine, without leaving projection globally enabled.

### Purpose

Add two slash commands that expose those two trigger paths while preserving every projection invariant.

- `/rewrite:response` — the active AI rewrites its own most recent reply into plain English, entirely in-context. No local or external LLM. Display-only: canonical bytes stay unchanged.
- `/rewrite:response-by-external-agent` — flips projection ON for a single request, runs the projection flow through a user-chosen engine, then flips it OFF, guaranteed. Default-off is preserved even on error.

The root invariants both commands preserve:

```text
canonical transcript/history ──> unchanged (display-only projection)
projection enablement        ──> off by default, off again after any one-shot run
```

Detailed research, design, implementation, and verification belong to the child phases. This parent records only the packet contract and phase map.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Two OpenCode slash commands under `.opencode/commands/`, authored to the sk-create-command standard, with cross-runtime mirrors.
- The one-shot ON→run→OFF enablement ceremony for `COMMUNICATION_PROJECTION_ENABLED`, with a guaranteed flip-off.
- Command 2's engine selection across the cli-* family, native in-context, and the package's local providers (exact model pending Fork 1).
- Targeted sk-communication `SKILL.md` updates only where required to document the new trigger surface, keeping the default-off invariant intact.

### Out of Scope

- Changing the default-off behavior of the projection layer.
- Rewriting canonical transcripts, model context, or any on-disk file as a projection default.
- Re-architecting the existing projection pipeline beyond adding the engine path command 2 requires.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/commands/rewrite-response.md` | Create | 002 | Command 1, self-rewrite, no LLM (shipped) |
| `.opencode/commands/rewrite-response-by-external-agent.md` | Create | 003 | Command 2, one-shot engine-choice flow |
| `.opencode/skills/sk-communication/cli-communication-projection/` | Modify | 003 | Engine path for command 2 (scope pending Fork 1) |
| `.opencode/skills/sk-communication/SKILL.md` | Modify | 004 | Document the trigger surface |
| `.claude/commands/`, `.cursor/commands/`, `.codex/prompts/` | Create | 004 | Cross-runtime command mirrors |
| `.opencode/skills/sk-communication/cli-communication-projection/bin/`, `src/`, `test/` | Create/Modify | 006 | External-cli runtime entrypoint, per-engine command table, projection module, and tests |
| `.opencode/commands/rewrite-response-by-external-agent.md` | Modify | 006 | Branch B routes through the external-cli entrypoint |
| `.opencode/commands/rewrite/` | Rename | 007 | Move both commands into the `rewrite/` namespace; invoke as `/rewrite:response` and `/rewrite:response-by-external-agent` |
| `.../src/transports/cli.ts` | Modify | 008 | Spawn detached and group-kill the external-cli child on timeout and abort |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Title / Focus | Level | Status |
|-------|--------|---------------|-------|--------|
| 1 | `001-research-contracts/` | Verified current-state facts, activation mechanism, cli roster, command-authoring standard, dispatch contract | 2 | Complete |
| 2 | `002-rewrite-response/` | `/rewrite-response` — in-context self-rewrite, no LLM, display-only | 1 | Complete |
| 3 | `003-rewrite-response-by-external-agent/` | `/rewrite-response-by-external-agent` — one-shot engine-choice flow, command-level orchestration (no package edits) | 1 | Complete |
| 4 | `004-skill-and-mirrors/` | sk-communication `SKILL.md` trigger-surface note and cross-runtime command mirrors | 1 | Complete |
| 5 | `005-external-cli-provider/` | First-class external-cli provider family, injected CLI transport, tests, and catalog and playbook references | 1 | Complete |
| 6 | `006-external-cli-runtime-wiring/` | Runnable external-cli entrypoint over projectMessage, verified per-engine command table, and command 2 Branch B adoption | 1 | Complete |
| 7 | `007-command-namespace-rename/` | Move both commands into the `rewrite/` namespace; invoke as `/rewrite:response` and `/rewrite:response-by-external-agent` | 1 | Complete |
| 8 | `008-spawn-process-group-hardening/` | Spawn the external-cli child detached and group-kill it on timeout and abort so a forked helper cannot orphan | 1 | Complete |
| 9 | (parent closeout) | Final gate: `validate.sh --strict --recursive`, hygiene sweep, metadata reconciliation | — | Complete |

### Phase Transition Rules

- Each phase must pass `validate.sh --strict` independently before its handoff.
- Neither command may write a projection into canonical state; both are display-only or one-shot.
- Command 2 must leave `COMMUNICATION_PROJECTION_ENABLED` off after every run, including error paths.
- Run recursive strict validation on this parent after every child-phase status change.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 research-contracts | 002 rewrite-response | Facts verified: activation gate, runnable entrypoint, provider families, cli roster, dispatch contract | Phase 001 research evidence |
| 002 rewrite-response | 003 by-external-agent | `/rewrite-response` passes `validate_document.py --type command` and the projection/no-LLM invariants hold | Independent validator re-run |
| 003 by-external-agent | 004 skill-and-mirrors | Command 2 flips ON→run→OFF with a guaranteed off, honoring privacy and exact-original fallback | Command validator plus package `npm run check` if code changed |
| 004 skill-and-mirrors | 005 external-cli-provider | SKILL update keeps default-off intact; mirrors resolve in every runtime | Mirror resolve check plus SKILL review |
| 005 external-cli-provider | 006 external-cli-runtime-wiring | Provider builds, `npm run check` is green, catalog and playbook reference the new adapter code | Package gate plus recursive strict validation |
| 006 external-cli-runtime-wiring | 007 command-namespace-rename | The entrypoint routes the cli-* path through `projectMessage`, the engine table resolves all six engines, command 2 Branch B invokes the entrypoint, and the gate is green | Package gate plus recursive strict validation |
| 007 command-namespace-rename | 008 spawn-process-group-hardening | Both commands live under `.opencode/commands/rewrite/`, invoke under the colon namespace, and no functional surface references the old flat names | Recursive strict validation |
| 008 spawn-process-group-hardening | Parent closeout | The spawn boundary group-kills on timeout and abort, a forked helper does not survive, and the package gate is green | Package gate plus recursive strict validation |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Fork 1 (resolved and built):** command 2 first shipped as command-level orchestration; phase 005 then built the first-class `external-cli` package provider that routes the cli-* path through the package's privacy and fidelity pipeline, under operator approval.
- **Fork 2 (resolved):** all six cli-* skills are selectable engines.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research and contracts**: `001-research-contracts/`
- **Predecessor packet**: `../001-sk-communication-creation/`
- **Skill**: `.opencode/skills/sk-communication/SKILL.md`
- **Graph metadata**: `graph-metadata.json`
