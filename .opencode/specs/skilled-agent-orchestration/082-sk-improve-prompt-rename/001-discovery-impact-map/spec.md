---
title: "Feature Specification: Phase 001 Discovery Impact Map"
description: "Read-only inventory for every active reference to sk-improve-prompt before rename execution begins. Produces discovery-output.md, or inventory.md plus inventory.tsv, and validates measured counts against the parent resource-map estimates."
trigger_phrases:
  - "082 phase 001"
  - "sk-improve-prompt discovery inventory"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/082-sk-improve-prompt-rename/001-discovery-impact-map"
    last_updated_at: "2026-05-06T12:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored phase spec scaffold"
    next_safe_action: "Run read-only grep and filename inventory for active sk-improve-prompt references"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-082-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
# Feature Specification: Phase 001 Discovery Impact Map

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Pending |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `082-sk-improve-prompt-rename` |
| **Phase** | 001 of 006 |
| **Handoff Criteria** | Inventory complete; counts validated against `../resource-map.md` estimates within +/-10%; no source files modified |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 082 renames `sk-improve-prompt` to `sk-prompt` across active repo surfaces. The parent resource map estimates broad impact, but implementation phases need an exact active-reference inventory before any source rename starts.

### Purpose
Phase 001 is read-only inventory. It produces `discovery-output.md` or `inventory.md` plus `inventory.tsv` cataloging every active reference to `sk-improve-prompt`, with phase ownership and measured counts.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Search active repo surfaces for exact text references and filename/symlink embeds containing `sk-improve-prompt`.
- Produce `discovery-output.md`, or `inventory.md` plus `inventory.tsv`.
- Compare measured counts with `../resource-map.md` estimates and flag variance outside +/-10%.
- Record phase ownership for every active hit.

### Out of Scope
- Modifying source files that contain `sk-improve-prompt`.
- Renaming the skill folder, updating advisor graph JSON, runtime mirrors, root docs, or config files.
- Rewriting frozen historical scope under archive, future, or excluded completed packets.
- Running advisor rebuilds or final validation probes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-discovery-impact-map/spec.md` | Replace | Phase 001 scope and handoff contract |
| `001-discovery-impact-map/discovery-output.md` | Create | Single-file inventory option |
| `001-discovery-impact-map/inventory.md`, `inventory.tsv` | Create | Human and machine-readable inventory option |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:implementation -->
## 4. IMPLEMENTATION APPROACH

Dispatch cli-codex gpt-5.5 medium fast for this phase. The executor should run read-only `rg` and filename/symlink discovery, normalize hits into the chosen inventory artifact shape, and leave all rename-target source files untouched.
<!-- /ANCHOR:implementation -->

<!-- ANCHOR:handoff -->
## 5. HANDOFF CRITERIA

- Inventory artifact exists and catalogs every active `sk-improve-prompt` reference and filename embed.
- Counts are validated against `../resource-map.md` estimates within +/-10%, or deviations are explained.
- `git diff --name-only` shows no source-file edits outside the Phase 001 folder.

```bash
rg -n 'sk-improve-prompt' .opencode .claude .codex .gemini README.md AGENTS*.md --glob '!**/z_archive/**' --glob '!**/z_future/**'
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/082-sk-improve-prompt-rename/001-discovery-impact-map --strict
```
<!-- /ANCHOR:handoff -->

<!-- ANCHOR:related -->
## 6. RELATED DOCUMENTS

- **Parent Spec**: [../spec.md](../spec.md)
- **Resource Map**: [../resource-map.md](../resource-map.md)
- **Predecessor Phase**: None
- **Successor Phase**: [../002-skill-folder-rename/spec.md](../002-skill-folder-rename/spec.md)
<!-- /ANCHOR:related -->
