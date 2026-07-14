---
title: "Implementation Plan: agent create-agent canon conformance + Codex TOML parity gate"
description: "Assess 26 agent .md files against the create-agent validator gate, characterize the sanctioned ## 0. numbering warning, and restore fail-closed Codex agent-TOML parity by regenerating stale TOMLs until sync-agents.cjs --check is GREEN. Verification uses validate_document --type agent, the --check gate, and a behavior-preservation diff."
trigger_phrases:
  - "agent canon conformance plan"
  - "create-agent validator plan"
  - "codex toml parity plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/002-agent-canon-conformance"
    last_updated_at: "2026-07-14T19:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored implementation plan for agent canon conformance + Codex TOML parity resync"
    next_safe_action: "Orchestrator runs validate.sh --strict on this child"
    blockers: []
    key_files:
      - ".opencode/agents/*.md"
      - ".claude/agents/*.md"
      - ".codex/agents/*.toml"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: agent create-agent canon conformance + Codex TOML parity gate

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent prompts, TOML (generated), Node.js sync tool, Python validator |
| **Framework** | sk-doc create-agent canon, system-spec-kit codex sync, OpenCode/Claude/Codex agent runtimes |
| **Storage** | Repo-tracked `.opencode/agents/*.md`, `.claude/agents/*.md`, generated `.codex/agents/*.toml` |
| **Testing** | `validate_document.py --type agent` (per-file), `sync-agents.cjs --check` (drift gate), git diff (behavior preservation) |

### Overview
This is an assess-and-conform child, not a rewrite. The 26 agent `.md` files are validated against the create-agent gate and confirmed conformant with no edit; the single sequential-numbering warning on the 11 `## 0.` agents is characterized as a sanctioned dialect artifact rather than drift. The only mutation is regenerating the three stale `.codex/agents/*.toml` via the canonical `sync-agents.cjs` so its `--check` gate returns GREEN (13/13 in sync). No agent behavior changes.

### Planning Evidence

| Evidence | Result |
|----------|--------|
| `validate_document.py --type agent` sweep over 26 files | 26/26 exit 0; 22/26 emit one `non_sequential_numbering` warning; 4/26 report 0 issues. |
| `## 0.` coverage grep | 11 of 13 agents carry `## 0.`; `deep-improvement` and `prompt-improver` do not. |
| `sync-agents.cjs --check` (pre-fix) | RED (exit 1): 4 stale TOMLs. |
| `sync-agents.cjs --check` (post-regen) | GREEN (exit 0): "PASS: 13 agents are in sync." |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Create-agent canon gate identified: `validate_document.py --type agent`.
- [x] Codex parity gate identified: `sync-agents.cjs --check`.
- [x] Behavior-preservation constraint documented: no agent `.md` edit.

### Definition of Done
- [x] All 26 agent `.md` files exit 0 on `validate_document.py --type agent`.
- [x] `sync-agents.cjs --check` GREEN (13/13 in sync).
- [x] Only `.codex/agents/{ai-council,deep-alignment,markdown}.toml` mutated; no agent `.md` edited.
- [x] Sanctioned `## 0.` warning documented; validator-gap and backfill nuance recorded as ADRs.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Assess-confirm-then-resync: validate the frozen `.md` surface, then regenerate the generated TOML surface to restore parity. No source `.md` mutation.

### Key Components
- **Agent `.md` canon surface**: `.opencode/agents/*.md` (permission frontmatter) and `.claude/agents/*.md` (tools frontmatter) — the human-authored canonical agents, validated against create-agent.
- **Generated Codex surface**: `.codex/agents/*.toml` — produced only by `sync-agents.cjs`; never hand-edited.
- **Gates**: `validate_document.py --type agent` (structural canon) and `sync-agents.cjs --check` (cross-runtime drift).

### Data Flow
An agent `.md` edit in either canonical runtime must be re-run through `sync-agents.cjs` to regenerate its `.codex/agents/*.toml`. When that resync is skipped, `--check` drifts RED. This child regenerates the drifted TOMLs and confirms both gates green; it does not touch the `.md` sources.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Assessment & Canon Gate
- [x] Enumerate the 13 agents × 2 runtimes (26 `.md` files) and run `validate_document.py --type agent` across all of them.
- [x] Confirm 26/26 exit 0 and each has `## 1. CORE WORKFLOW`.
- [x] Classify `## 0.` hard-block coverage (11/13 agents present → 22/26 files emit the sanctioned warning; 2/13 absent → 4/26 at 0/0).

### Phase 2: Codex TOML Parity Resync
- [x] Run `sync-agents.cjs --check` (RED, 4 stale TOMLs).
- [x] Regenerate via the worktree's `sync-agents.cjs` → 3 files changed (`ai-council.toml`, `deep-alignment.toml`, `markdown.toml`).
- [x] Re-run `--check` → GREEN ("PASS: 13 agents are in sync."); commit `e893d9adde`.

### Phase 3: Verification & Decision Capture
- [x] Confirm no agent `.md` was edited (diff shows only the three TOMLs).
- [x] Record the validator numbering-gap and `## 0.` backfill nuance as ADRs in `decision-record.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Canon structural gate | 26 agent `.md` | `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <file> --type agent` |
| Codex parity gate | 13 agents md→toml | `node .opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs --check` |
| Behavior preservation | Whole child diff | `git show --stat e893d9adde` (only 3 TOMLs changed; no `.md`) |
| Spec validation | This child | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` (orchestrator-run) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sync-agents.cjs` | Internal generator | Available (worktree) | Codex TOML parity cannot be regenerated without it. |
| `validate_document.py --type agent` | Internal gate | Available | Per-file canon conformance cannot be proven. |
| 001-command-template-conformance | Predecessor phase | Complete | Ordering only; no shared file state. |
| Operator decision (validator-gap, `## 0.` backfill) | External | Deferred | Follow-ups recorded as ADRs; do not block this child's exit-0 bar. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The TOML resync is later found to encode an unintended `.md` change, or the `--check` gate must be reverted.
- **Procedure**: `git revert e893d9adde` (or restore the three `.codex/agents/*.toml` from the prior commit), then re-run `sync-agents.cjs --check`. Because no agent `.md` was touched, the `.md` canon surface has nothing to roll back.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Assess + canon gate) -> Phase 2 (TOML parity resync) -> Phase 3 (Verify + decisions)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Assessment & Canon Gate | None | TOML parity resync |
| Codex TOML Parity Resync | Assessment | Verification |
| Verification & Decision Capture | TOML parity resync | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Assessment & Canon Gate | Low | < 1 hour |
| Codex TOML Parity Resync | Low | < 1 hour |
| Verification & Decision Capture | Low | < 1 hour |
| **Total** | | **1-2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production deployment or data migration — generated config only.
- [x] Diff reviewed: only three generated TOMLs changed; no agent `.md`.
- [x] Codex TOMLs are fully reproducible from `.md` via `sync-agents.cjs`.

### Rollback Procedure
1. `git revert e893d9adde` (or restore the three TOMLs from the prior commit).
2. Re-run `sync-agents.cjs --check` to observe the pre-fix RED state.
3. No agent `.md` restoration is needed — the `.md` surface was never modified.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Regenerate `.codex/agents/*.toml` from the canonical `.md` via `sync-agents.cjs`; the generated surface is deterministic from source.
<!-- /ANCHOR:enhanced-rollback -->
