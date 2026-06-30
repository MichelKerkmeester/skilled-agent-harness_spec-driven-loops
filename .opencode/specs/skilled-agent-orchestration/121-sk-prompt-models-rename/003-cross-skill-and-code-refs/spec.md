---
title: "Feature Specification: Phase 3: cross-skill-and-code-refs"
description: "Update references to the skill in the 8 referencing skills plus the hardcoded code/config (card-sync guard .sh, reviewer-regression.json, secret-scrubber test, executor-config.ts comment)."
trigger_phrases:
  - "sk-prompt-models cross-skill refs"
  - "card-sync guard path rename"
  - "hardcoded sk-prompt-small-model paths"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-sk-prompt-models-rename/003-cross-skill-and-code-refs"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/003-cross-skill-and-code-refs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: cross-skill-and-code-refs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-core-rename |
| **Successor** | 004-commands-scripts-data |
| **Handoff Criteria** | All 8 skills' refs + hardcoded code/config updated; the card-sync guard path points at the new folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the sk-prompt-models-rename specification — the routing/code surfaces with the highest break risk.

**Scope Boundary**: References to the skill in OTHER skills + hardcoded code/config. The skill's own folder is phase 2; commands/specs are phases 4–5.

**Dependencies**:
- Phase 2 complete (folder moved) so the new path exists for these references to point at.

**Deliverables**:
- Updated refs in the 8 referencing skills: `cli-opencode` (18), `deep-loop-workflows` (12), `sk-prompt` (6), `cli-codex` (4), `cli-claude-code` (4), `system-spec-kit` (3), `system-skill-advisor` (3), `deep-loop-runtime` (1).
- Hardcoded code/config updated: the card-sync guard `.sh` (Python f-string path), `reviewer-regression.json` (`outputsDir`), `secret-scrubber.vitest.ts` (test fixture string), `executor-config.ts` (prose comment — non-breaking).

**Changelog**:
- When this phase closes, add the matching file to ../changelog/.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The card-sync guard hardcodes `H = f"{ROOT}/.opencode/skills/sk-prompt-small-model"` — after the folder moves, that gate fails immediately. Eight sibling skills link the old path (the cli-* prompt-craft 3-tier rule, the deep-loop benchmark output paths, etc.). A benchmark profile and a test also hardcode the path/string.

### Purpose
Repoint every cross-skill and hardcoded code/config reference at `sk-prompt-models` so the routing, the card-sync gate, and the benchmark/test machinery work under the new name.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Token-replace `sk-prompt-small-model` in: cli-opencode, deep-loop-workflows, sk-prompt, cli-codex, cli-claude-code, system-spec-kit, system-skill-advisor (non-generated files), deep-loop-runtime.
- The card-sync guard `.sh` path; `reviewer-regression.json` `outputsDir`; `secret-scrubber.vitest.ts` fixture string; `executor-config.ts` prose comment.

### Out of Scope
- The advisor's GENERATED `skill-graph.json`/`.sqlite` (regenerated in phase 6, not edited here).
- Commands/scripts/agents (phase 4) and specs (phase 5).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/{cli-opencode,deep-loop-workflows,sk-prompt,cli-codex,cli-claude-code,system-spec-kit,deep-loop-runtime}/**` | Modify | Path/prose refs to the skill |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh` | Modify | Hardcoded `H = ...sk-prompt-small-model` path (gate-breaking) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/reviewer-regression.json` | Modify | `outputsDir` path |
| `.opencode/skills/system-spec-kit/mcp_server/tests/secret-scrubber.vitest.ts` | Modify | Test fixture string (~line 152) |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Modify | Prose comment (~line 250, non-breaking) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Card-sync guard path updated | The guard's hardcoded `H` path points at `sk-prompt-models`; the guard runs (exit code unchanged by the rename) |
| REQ-002 | All 8 skills' refs updated | `rg "sk-prompt-small-model" .opencode/skills` returns only the renamed folder's frozen benchmark logs (if any) + the GENERATED advisor index (phase 6) |
| REQ-003 | reviewer-regression.json outputsDir updated | Points at `sk-prompt-models/benchmarks/{run_label}` |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Test + comment updated | `secret-scrubber.vitest.ts` fixture + `executor-config.ts` comment say the new name; the vitest suite still passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No live cross-skill or code/config reference to the old name remains (excluding the GENERATED advisor index, which phase 6 regenerates).
- **SC-002**: The card-sync guard resolves the registry under the new path.
<!-- /ANCHOR:success-criteria -->

### Acceptance Scenarios

- **Given** the edits, **When** the card-sync guard runs, **Then** it locates the registry/profiles under `sk-prompt-models` (no path error).
- **Given** the secret-scrubber suite, **When** it runs, **Then** it passes with the updated fixture string.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing the GENERATED advisor skill-graph by hand | Stale/inconsistent index | Leave it; regenerate in phase 6 |
| Risk | Card-sync guard path missed | The model-registry gate breaks for the whole session | Treat REQ-001 as the phase's first task; run the guard immediately after |
| Risk | A relative cli-* link missed | Broken prompt-craft pointer | Post-edit `rg` over each of the 8 skills returns 0 (minus generated/logs) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — the cross-skill + code/config set is enumerated by phase 1's map.
<!-- /ANCHOR:questions -->
