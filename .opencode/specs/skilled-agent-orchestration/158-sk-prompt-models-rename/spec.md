---
title: "Feature Specification: sk-prompt-models-rename"
description: "Phase parent for sk-prompt-models-rename"
trigger_phrases:
  - "158-sk-prompt-models-rename"
  - "phase parent"
  - "sk-prompt-models rename"
  - "rename sk-prompt-small-model"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/158-sk-prompt-models-rename"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Rename shipped; 0 live residual; advisor routes sk-prompt-models"
    next_safe_action: "Packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Also rename the older legacy name sk-small-model (124 files), or leave as pre-rename history? (default: leave)"
    answered_questions:
      - "New name = sk-prompt-models; scope = Everything (all ~799 files)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: sk-prompt-models-rename

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | skilled-agent-orchestration/158-sk-prompt-models-rename |
| **Predecessor** | skilled-agent-orchestration/157-glm-5-2-support (surfaced the misnomer) |
| **Successor** | None |
| **Handoff Criteria** | Rename lands as one coordinated change; derived indexes regenerated; all gates green; zero live references to the old name |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill `sk-prompt-small-model` is the per-model prompt-craft hub for the non-frontier models dispatched out via the cli-* executors (DeepSeek-v4-pro, Kimi-k2.7-code, MiniMax-M3, MiMo-V2.5-Pro, GLM-5.2). The "small" in the name is inaccurate — several of these models are large (GLM-5.2 and MiMo-V2.5-Pro are 1M-context). The grouping was never about size; it is "non-frontier models you delegate to." The misnomer misleads operators and the advisor's name-based routing.

### Purpose
Rename the skill to **`sk-prompt-models`** repo-wide and update **every** reference (`~799 files / ~4,516 occurrences`), then regenerate the derived indexes and prove no live reference to the old name remains. This is a routing-critical Level 3 refactor: it must land as one coordinated change and pass the card-sync guard, validate.sh, the affected tests, and an advisor routing probe.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, and the reference inventory live in the child phase folders listed below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename the skill folder `sk-prompt-small-model/` → `sk-prompt-models/` (`git mv`) and update its identity (`name:`, `skill_id`).
- Replace the token `sk-prompt-small-model` → `sk-prompt-models` across all text references repo-wide (skills, commands, scripts, agents, READMEs, specs, logs, changelogs).
- Regenerate (NOT string-edit) all derived/binary indexes (advisor skill-graph, spec-memory index, packet metadata).
- Verify every gate stays green and zero live references to the old name remain.

### Out of Scope
- The older legacy name `sk-small-model` (a different, earlier rename generation) — left as pre-rename history by default (open question).
- Any behavioral change to the skill's content, model registry data, or prompt-craft logic — this is a pure rename.

### Files to Change
Summary of aggregate scope. Per-phase detail lives in child plans. (Nothing is changed by this parent scaffold.)

| Area | Change Type | Phase | Description |
|------|-------------|-------|-------------|
| `.opencode/skills/sk-prompt-small-model/**` | git mv + edit | 2 | Folder move + identity + internal back-links |
| Other skills + hardcoded code/config | Modify | 3 | cli-*, deep-loop-*, system-*, card-sync guard `.sh`, reviewer-regression.json, secret-scrubber test, executor-config.ts |
| `commands/**`, `scripts/**`, `agents/**` | Modify | 4 | deep_*.yaml paths, pre-commit hook, benchmark run-pointers |
| `specs/**` (incl. archive/logs/changelogs) | Modify | 5 | The "Everything" bulk sweep, with history-care carve-out |
| Derived indexes (advisor/memory/metadata) | Regenerate | 6 | Rebuild, do NOT hand-edit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently reviewable child spec folder. The rename itself lands as ONE coordinated change (routing breaks if half-applied); the phases organize the work and verification by reference category. Currently **scaffolded only** — no phase has started.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-reference-inventory/ | Exhaustive reference map (799 files) classified TEXT-REPLACE / REGENERATE / GIT-MV / HISTORY-CARE; the replace command + binary exclusions | Complete |
| 2 | 002-core-rename/ | `git mv` the folder; skill identity (`name:`, `skill_id`), internal back-links, `model_profiles.json` profile_refs | Complete |
| 3 | 003-cross-skill-and-code-refs/ | Other skills' refs + hardcoded code/config (card-sync guard `.sh`, reviewer-regression.json, secret-scrubber test, executor-config.ts) | Complete |
| 4 | 004-commands-scripts-data/ | deep_*.yaml benchmark/context paths, pre-commit hook, agent, benchmark run-pointers | Complete |
| 5 | 005-specs-history-sweep/ | The "Everything" bulk sweep across specs/logs/changelogs, with the history-care carve-out | Complete |
| 6 | 006-regenerate-verify/ | Regenerate advisor + memory + packet indexes; card-sync, validate.sh, tests, zero-reference sweep, routing probe, smoke | Complete |

### Phase Transition Rules

- Phases 2–5 are edits that MUST all land before phase 6 regenerates indexes — a partial rename breaks the advisor `skill_id` and the card-sync guard path.
- Phase 1 (inventory) gates the rest: nothing is edited until the full classified map exists.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-reference-inventory | 002-core-rename | Complete classified map exists; replace command + exclusions defined | Inventory doc lists every file + class |
| 002→003→004→005 | 006-regenerate-verify | All token replacements + git mv applied; no binary/SQLite was string-edited | `rg` shows old name only in deliberately-frozen history-care lines |
| 006-regenerate-verify | (done) | Indexes regenerated; all gates green; zero live old-name refs | card-sync exit 0; validate.sh 0 errors; advisor probe returns sk-prompt-models |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should the older legacy name `sk-small-model` (124 files, a separate earlier rename) also be folded into `sk-prompt-models`, or left as pre-rename history? (Default: leave; flag as optional follow-up.)
- For changelogs that document the original `sk-small-model → sk-prompt-small-model` rename event, use a clarifying parenthetical rather than a blind flip (history-care carve-out). Confirm the wording in phase 5.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Approved plan**: the implementation blueprint this packet encodes (rename mechanics, carve-outs, verification).
- **Predecessor**: `../157-glm-5-2-support/` — the GLM-5.2 adoption that surfaced the misnomer.
- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer.
