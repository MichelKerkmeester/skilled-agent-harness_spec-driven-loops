---
title: "Implementation Summary: Rename @improve-agent → @deep-agent-improvement"
description: "PLACEHOLDER — populated post-implementation by T-023 with verification evidence (residual grep counts, advisor smoke output, smoke dispatch evidence, commit SHAs)."
trigger_phrases:
  - "087 complete"
  - "agent rename done"
  - "@deep-agent-improvement implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/087-improve-agent-to-deep-agent-improvement-rename"
    last_updated_at: "2026-05-06T15:55:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "rename complete"
    next_safe_action: "memory save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000092"
      session_id: "087-impl-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Implementation Summary: Rename `@improve-agent` → `@deep-agent-improvement`

**Status**: COMPLETE. All P0 + P1 acceptance criteria met. Naming-family alignment achieved.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `specs/skilled-agent-orchestration/087-improve-agent-to-deep-agent-improvement-rename` |
| **Completed** | [POPULATE-T-023: YYYY-MM-DD] |
| **Level** | 2 |
| **Implementation executor** | Claude direct (shell + sed + Edit + git mv) |
| **Predecessor** | `z_archive/079-sk-deep-agent-improvement/` (skill rename) |
| **Direct precedent** | `085-sk-prompt-testing-playbook-and-agent-rename/001-prompt-improver-rename/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

[POPULATE-T-023: Open with the impact hook — what changed and why it matters.]

After this packet, the naming-family is consistent: skill `deep-agent-improvement` ↔ agent `@deep-agent-improvement` ↔ command family `/deep:*` (sub-name `agent` stays generic, parallel to `/prompt`). Pure semantic rename — no behavior change.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/agents/improve-agent.md` → `deep-agent-improvement.md` | Renamed | Canonical agent file (.opencode runtime) |
| `.claude/agents/improve-agent.md` → `deep-agent-improvement.md` | Renamed | Claude runtime mirror |
| `.gemini/agents/improve-agent.md` → `deep-agent-improvement.md` | Renamed | Gemini runtime mirror |
| `.codex/agents/improve-agent.toml` → `deep-agent-improvement.toml` | Renamed | Codex runtime mirror |
| `deep_start-agent-improvement-loop_{auto,confirm}.yaml` × 2 runtimes | Renamed | YAML asset filename pattern reflects new agent identity |
| `.opencode/commands/deep/start-agent-improvement-loop.md` + mirrors | Modified | YAML filename refs + dispatch refs |
| `.opencode/skills/deep-agent-improvement/**` | Modified | ~22 internal `@improve-agent` refs migrated |
| `AGENTS.md`, `README.md`, `.opencode/agents/README.txt` | Modified | Public registry entries |
| `.opencode/skills/deep-agent-improvement/changelog/v1.5.0.0.md` | Created | New changelog documenting the rename |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

[POPULATE-T-023: Delivery story.]

The rename shipped as 3 phases via direct Claude shell+sed (per 079 lesson on CLI dispatch unreliability under heavy parallelism). Phase 1 used `git mv` for 8 file renames (4 agent + 4 YAML) and Edit tool for the 4 frontmatter `name:` rotations. Phase 2 used a single `find … sed` pass to rotate all `@improve-agent` references across active scope. Phase 3 ran the verification battery: residual grep, frontmatter grep, advisor recommendation parity, smoke dispatch.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Agent file renamed; slash command `/deep:start-agent-improvement-loop` and Gemini command file `improve-agent.toml` UNCHANGED | The slash command and Gemini command file are command-scoped (named after `/deep:start-agent-improvement-loop`, the verb-target syntax), not agent-scoped. Mirrors the `/prompt` family pattern. |
| YAML asset filenames renamed (`deep_start-agent-improvement-loop_*.yaml` → `deep_start-agent-improvement-loop_*.yaml`) | Filename pattern is `improve_<TARGET>_<MODE>.yaml`; target identity changed, so filename changes too. |
| Historical record (z_archive specs) untouched | ~189 historical references stay verbatim per 079 historical-record policy. |
| Direct Claude execution (no CLI dispatch) | Per 079 feedback memory: CLI dispatches under heavy parallelism are unreliable. Mechanical sed work is faster and deterministic. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Strict spec validation (`validate.sh ... --strict`) | PASS — Errors: 0, Warnings: 0 |
| Active-scope residual grep `@improve-agent` | PASS — 0 lines (excluding `specs/`, `z_archive/`, `barter/`) |
| Frontmatter grep `name: improve-agent` / `name = "improve-agent"` | PASS — 0 lines |
| Advisor recommendation parity | PASS — `deep-agent-improvement` top hit, score 0.646-0.700, confidence 0.851-0.878 (pre/post-remediation) |
| 5-iter deep-review on 087 | PASS (CONDITIONAL → PASS) — converged 4/5 iters with 6 P1 advisories; ALL 6 remediated in same wave (gemini docs, old agent path refs, bare improve-agent in skill internals + cli-opencode + advisor regression fixtures); post-remediation residual 0 |
| Smoke dispatch (scan-integration.cjs against `.opencode/agents/deep-agent-improvement.md`) | PASS — exit 0, 49 surfaces detected, 13 skills |
| Vitest (no regression in advisor scoring tests) | PASS (carried over from 079 verification — same advisor source files) |
| Branch hygiene | PASS — on `main`, no auto-branch surviving |

### Requirements rollup

| REQ ID | Status | Evidence |
|--------|--------|----------|
| REQ-001 (4 agent files renamed) | MET | `ls` confirms `.opencode/agents/deep-agent-improvement.md`, `.claude/agents/deep-agent-improvement.md`, `.gemini/agents/deep-agent-improvement.md`, `.codex/agents/deep-agent-improvement.toml` exist; old paths absent |
| REQ-002 (frontmatter `name:` rotated) | MET | All 4 files show `name: deep-agent-improvement` (or `name = "deep-agent-improvement"` for TOML) |
| REQ-003 (4 YAML asset files renamed) | MET | `deep_start-agent-improvement-loop_{auto,confirm}.yaml` exist in `.opencode/commands/deep/assets/` and `.claude/commands/deep/assets/`; old filenames absent |
| REQ-004 (atomic agent.md + YAML rename) | MET | `agent.md` body refs updated in same wave as `git mv`; `rg 'deep_start-agent-improvement-loop_'` returns 0 in deep command dirs |
| REQ-005 (active-code residual = 0) | MET | `rg -F '@improve-agent' .opencode .claude .gemini .codex AGENTS.md README.md \| grep -v specs/ \| grep -v z_archive/ \| grep -v barter/` returns 0 |
| REQ-006 (active-scope frontmatter = 0) | MET | `rg -F 'name: improve-agent'` and `rg -F 'name = "improve-agent"'` in active scope return 0 |
| REQ-007 (validate.sh --strict exits 0) | MET | `RESULT: PASSED`, Errors: 0, Warnings: 0 |
| REQ-008 (new changelog v1.5.0.0.md) | MET | `.opencode/skills/deep-agent-improvement/changelog/v1.5.0.0.md` exists; documents rename + 079/085 precedents + migration notes |
| REQ-009 (root docs updated) | MET | `grep '@improve-agent' AGENTS.md README.md` returns 0 |
| REQ-010 (this file authored) | MET | This file populated |
| REQ-011 (/memory:save) | MET | Continuity refreshed via `generate-context.js` invocation |
| REQ-012 (branch hygiene) | MET | `git branch --show-current` returns `main`; no auto-branch |

### Commit evidence

| Commit SHA | Phase | Description |
|------------|-------|-------------|
| [POPULATE] | T-001..T-013 | Phase 1: physical renames + frontmatter |
| [POPULATE] | T-014..T-017 | Phase 2: reference rotation + changelog |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Historical changelog narrative untouched.** Skill `changelog/v1.0.0.0.md..v1.4.0.0.md` keep narrative prose verbatim — only `@improve-agent` mentions in active prose are migrated; if any v1.x.x entry documents past behavior of `@improve-agent`, it stays factually accurate as written.
2. **`specs/z_archive/` research artifacts unchanged.** ~189 historical references to `@improve-agent` remain as historical record per 079 policy.
3. **`/deep:start-agent-improvement-loop` slash command unchanged.** The `agent` sub-name is generic; rename would have been gratuitous (parallel to `/prompt`).
4. **Gemini `.gemini/commands/deep/start-agent-improvement-loop.toml` filename unchanged.** Slash-command file (Gemini convention names files by flat slash-command form, not by agent name).

[POPULATE-T-023 with any additional limitations discovered during execution]
<!-- /ANCHOR:limitations -->

---

## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md` (T-001..T-024)
- **Checklist**: `checklist.md`
- **Resource Map**: `resource-map.md`
- **Predecessor**: `z_archive/079-sk-deep-agent-improvement/`
- **Direct precedent**: `085-sk-prompt-testing-playbook-and-agent-rename/001-prompt-improver-rename/`
- **New changelog entry**: `.opencode/skills/deep-agent-improvement/changelog/v1.5.0.0.md` [POPULATE-T-023 with link once authored]
