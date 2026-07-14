---
title: "Feature Specification: agent create-agent canon conformance — 13 agents × 2 runtimes validated clean, plus Codex TOML parity gate restored"
description: "Confirm the 13 OpenCode/Claude agents (26 .md) already meet the sk-doc create-agent validator gate (validate_document --type agent exit 0), document the canon-required ## 0. hard block versus the validator's sequential-numbering warning as a sanctioned dialect artifact, and restore fail-closed Codex agent-TOML parity by regenerating stale .codex/agents/*.toml until sync-agents.cjs --check is GREEN. Behavior-preserving parity resync only — no agent .md edits."
trigger_phrases:
  - "agent canon conformance"
  - "create-agent validator gate"
  - "codex agent toml parity"
  - "sync-agents check gate"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/002-agent-canon-conformance"
    last_updated_at: "2026-07-14T19:30:00Z"
    last_updated_by: "claude"
    recent_action: "Agents meet exit-0 canon; codex TOML parity gate restored"
    next_safe_action: "Orchestrator runs validate.sh --strict on this child, then rolls up the parent"
    blockers: []
    key_files:
      - ".opencode/agents/*.md"
      - ".claude/agents/*.md"
      - ".codex/agents/*.toml"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs"
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: agent create-agent canon conformance — 13 agents × 2 runtimes validated clean, plus Codex TOML parity gate restored

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Branch** | `skilled/v4.0.0.0` (worktree `.worktrees/0041-skilled-command-agent-canon`) |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | skilled-agent-orchestration/138-command-agent-canon-conformance |
| **Predecessor** | 001-command-template-conformance |
| **Successor** | 003-codex-command-parity |
| **Commit** | `e893d9adde` (Codex TOML resync) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 13 agents ship in two canonical markdown runtimes — `.opencode/agents/*.md` (with `permission:` frontmatter) and `.claude/agents/*.md` (with `tools:` frontmatter), 26 files total — plus a generated Codex runtime, `.codex/agents/*.toml`, produced only by `sync-agents.cjs`. Two questions were open against the sk-doc `create-agent` canon. First, structural conformance: does every agent satisfy `validate_document.py --type agent`, and how does the canon-REQUIRED `## 0. ILLEGAL NESTING / HARD BLOCK` section interact with the validator's sequential-numbering check that begins counting at section 1? Second, dual-runtime parity: `sync-agents.cjs` is the sole md→toml converter and its `--check` mode is the only drift gate, but it was un-gated and RED — four `.codex/agents/*.toml` had drifted away from legitimate agent-`.md` edits made in prior packets that were never re-synced.

### Purpose
Establish and record that all 26 agent `.md` files already pass the create-agent validator gate (exit 0), correctly characterize the single sequential-numbering warning emitted by the 11 agents that carry the canon-required `## 0.` hard block as a sanctioned-dialect artifact (not drift), leave the two agents that lack `## 0.` (`deep-improvement`, `prompt-improver`) as-is at the exit-0 bar, and restore fail-closed Codex TOML parity by regenerating the stale TOMLs until `sync-agents.cjs --check` reports GREEN (13/13 in sync). All work is behavior-preserving: no agent `.md` file was edited; the only mutated files are the three regenerated TOMLs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Validate every agent `.md` in both canonical runtimes — `.opencode/agents/*.md` and `.claude/agents/*.md` (26 files) — against `validate_document.py --type agent`.
- Characterize and document the `## 0. ILLEGAL NESTING / HARD BLOCK` versus `non_sequential_numbering` interaction as a sanctioned-dialect artifact of the create-agent canon.
- Restore Codex agent-TOML parity: regenerate stale `.codex/agents/*.toml` via the worktree's `sync-agents.cjs` and confirm `sync-agents.cjs --check` is GREEN (exit 0).
- Record the two standing recommendations (validator numbering-gap; `## 0.` backfill for the two exempt agents) as ADRs in `decision-record.md`.

### Out of Scope
- Any edit to an agent `.md` file — no structural renumbering, no `## 0.` backfill, no behavior/prompt change. The `.md` surface is confirmed-conformant and frozen.
- Modifying `validate_document.py` to exempt the leading `## 0.`/`## 0b.` prefix from the sequential-numbering check. That change touches a shared repo-wide validator and is deferred to the operator / a create-agent-validator packet (recorded as an ADR).
- Command-template conformance (owned by 001) and Codex command-prompt parity (owned by 003).
- Root `AGENTS.md`, which is not covered by the create-agent canon.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.codex/agents/ai-council.toml` | Regenerate | Resync from canonical agent `.md` via `sync-agents.cjs` (stale content from an un-synced prior `.md` edit) |
| `.codex/agents/deep-alignment.toml` | Regenerate | Resync from canonical agent `.md` via `sync-agents.cjs` |
| `.codex/agents/markdown.toml` | Regenerate | Resync from canonical agent `.md` via `sync-agents.cjs` |
| `.opencode/agents/*.md`, `.claude/agents/*.md` (26) | Verify only | Confirmed exit 0 on `validate_document.py --type agent`; no edit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
- REQ-001: Every agent `.md` in both runtimes (26 files) exits 0 on `validate_document.py --type agent`; each has `## 1. CORE WORKFLOW`.
- REQ-002: `sync-agents.cjs --check` is GREEN — "PASS: 13 agents are in sync" (exit 0) — after regenerating the stale TOMLs.
- REQ-003: No behavior change and no agent `.md` edit — parity resync only; the only mutated files are the three regenerated `.codex/agents/*.toml`.

### P1 - Required (complete OR user-approved deferral)
- REQ-004: The `non_sequential_numbering` warning emitted by the 11 `## 0.` agents (22 of 26 files) is DOCUMENTED as a sanctioned-dialect artifact of the canon-required `## 0.` hard block, not silenced by renumbering (which would strip or corrupt canon-required structure).
- REQ-005: The validator numbering-gap and the two-agent `## 0.` backfill nuance are recorded as ADRs in `decision-record.md` (accepted-with-follow-up), with the shared-validator fix and the backfill decision deferred to the operator.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Acceptance Scenarios
- Given all 26 agent `.md` files, when each is validated with `validate_document.py --type agent`, then all exit 0 (0 non-zero), and 22 of 26 report exactly one non-blocking `non_sequential_numbering` warning ("expected 1, found 0") from the canon-required `## 0.` section.
- Given the two agents without `## 0.` (`deep-improvement`, `prompt-improver`, 4 of 26 files), when validated, then each reports 0 issues (0/0) and is left unchanged.
- Given the regenerated TOMLs, when `sync-agents.cjs --check` runs, then it prints "PASS: 13 agents are in sync." and exits 0.
- Given the diff, when reviewed, then only `.codex/agents/{ai-council,deep-alignment,markdown}.toml` changed and no agent `.md` file changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Renumbering-strips-canon risk**: silencing the `non_sequential_numbering` warning by renumbering `## 0.` → `## 1.` would strip or corrupt the canon-required hard-block section. Mitigation: the warning is documented as sanctioned, not "fixed"; the `.md` surface is frozen (REQ-004).
- **Validator/canon conflict**: the create-agent canon requires `## 0.` while its own validator penalizes it, so a canon-conformant agent cannot reach 0/0 under the current validator. Mitigation: recorded as an ADR; the shared-validator fix is deferred to the operator (out of this child's scope).
- **Silent TOML drift risk**: `sync-agents.cjs` is the only md→toml path and its `--check` gate was un-gated. Mitigation: the gate is now GREEN and is the standing drift tripwire for the Codex runtime; any future agent `.md` edit must re-run the sync.
- **Dependency**: the worktree's `sync-agents.cjs` (`.opencode/skills/system-spec-kit/scripts/codex/`) is the regeneration source of truth; the `shared/scripts` `validate_document.py --type agent` entrypoint is the per-file gate.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Validator numbering-gap (deferred to operator): should `validate_document.py --type agent` exempt a leading `## 0.`/`## 0b.` from the sequential-numbering check so canon-conformant agents validate 0/0? This modifies a shared repo-wide validator and is out of 002 scope. See `decision-record.md` ADR-001.
- `## 0.` backfill (deferred to operator): should `deep-improvement` and `prompt-improver` gain the canon `## 0.` hard block (canon-uniform, at the cost of +2 sanctioned warnings), or stay as-is at the exit-0 bar? See `decision-record.md` ADR-002.
- Note (not a question): root `AGENTS.md` is not covered by the create-agent canon and is intentionally out of scope — flagged, not force-fit.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent Spec**: See `../spec.md`
