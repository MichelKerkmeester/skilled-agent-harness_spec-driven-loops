---
title: "Feature Specification: Phase 021 - Command Surface Validator Rewrite & Deep-Research Finding Fixes"
description: "Rewrites design-command-surface-check.mjs's surface-drift stage to validate against the actual Phase 015 router+assets command shape (it still assumed the pre-refactor flat command file), fixes command-metadata.json's two metadata-stage errors, and applies the remaining fixes from the 020 deep-research audit (obsolete mcp-open-design naming, design agent tool-surface/mode-map parity, SKILL.md version hygiene)."
trigger_phrases:
  - "command surface validator rewrite"
  - "phase 021 sk-design"
  - "design-command-surface-check drift"
  - "020 deep-research findings fix"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/021-command-surface-validator-and-agent-parity"
    last_updated_at: "2026-07-07T12:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec.md"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "surface-validator-021"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 021 - Command Surface Validator Rewrite & Deep-Research Finding Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 020 deep-research audit (`../020-drift-and-improvement-audit/research/research.md`) found `design-command-surface-check.mjs` reporting `STATUS=INVALID STAGE=metadata` with 10 errors, attributed to `:auto|:confirm` modeled as a flag and missing `design-mcp-open-design` sibling coverage. Fixing those two root causes (removing the invalid flag entry, adding sibling entries to `command-metadata.json`) unblocked the metadata stage — but revealed a second, much larger, pre-existing problem: the surface-drift stage (`collectSurfaceDrift` and its ~10 `expected*Drift` helper functions) still assumed the PRE-Phase-015 flat command-file shape (`## USER INTENT`, `## CHOREOGRAPHY`, `## PIPELINE & HANDOFF`, `## HANDOFF GRAMMAR`, literal `NEXT_OPTIONS=`/`HANDOFF_REASON=`/`STATUS=ASK MISSING_REGISTER` tokens). Phase 015 (`../013-design-commands-asset-refactor/`, `../015-design-commands-implementation/`) had already restructured every `/design:*` command into a thin router `.md` plus three owned assets (`assets/design_<mode>_{auto.yaml,confirm.yaml,presentation.txt}`) months earlier, moving nearly all of that content out of the wrapper file. The validator was never updated to match — it had been silently broken since Phase 015 shipped, with the breakage hidden behind the metadata-stage's earlier exit (the script never reached the drift check while metadata errors existed).

### Purpose

Rewrite the surface-drift stage to validate against the real router+assets shape (reading wrapper + presentation.txt + auto.yaml + confirm.yaml as one combined surface), reaching a genuine `STATUS=PASS drift=0` rather than a validator that either false-exits early or reports 77 phantom drift items. Then apply the remaining fixes from the 020 audit's finding list per the user's "fix all findings" directive: obsolete `mcp-open-design` naming in `design-md-generator`'s docs, the design agent's tool-surface/mode-map gaps, and `SKILL.md`'s stale version field.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `design-command-surface-check.mjs`'s surface-drift functions to read a combined `{wrapper, presentation, auto, confirm, combined}` surface per command instead of a single flat markdown file, retargeting each check to where Phase 015 actually put the content.
- Add a `readTransportCommands()` exemption so `collectRosterReconciliationDrift` no longer demands a wrapper/metadata command record for `packetKind: "transport"` modes (a second, independent bug the metadata-stage fix exposed: the roster check assumed every registry `workflowMode` has a `/design:<mode>` command, which is false for `design-mcp-open-design`, `command: null` by design).
- Add a `design-mcp-open-design` sibling-discriminator bullet to all 5 wrapper `.md` files, and a literal `**Ask-first:**` marker in each `PRECONDITIONS` section (both required by the rewritten checks, both true statements about the existing design).
- Fix obsolete `mcp-open-design` naming in `design-md-generator/{SKILL.md,README.md,references/extraction_workflow.md}` and `feature_catalog/feature_catalog.md` (4 files, 7 occurrences total; the historical changelog entry `design-md-generator/changelog/v1.0.0.0.md` is deliberately left untouched).
- Fix `.opencode/agents/design.md` and `.claude/agents/design.md` (both runtime mirrors): add `design-mcp-open-design` to the Mode Map, add a "Tool-Surface Downshift" rule set (the agent's static permission grant is Read/Write/Edit/Bash for all modes, but 4 of 6 registry modes are Read-only or Read/Bash-only), and fix the mode-3 packet-path note (the transport's own mode key and packet folder name are both `design-mcp-open-design`, so the `design-<mode>` template pattern would double the prefix).
- Bump `sk-design/SKILL.md`'s `version` field from `1.1.0.0` to `1.2.0.0`, matching `description.json` (already at `1.2.0.0` since Phase 019) — it had never been bumped despite real content changes in Phases 018/019.
- Commit the previously-uncommitted `020-drift-and-improvement-audit/` deep-research folder alongside this phase's fixes.

### Out of Scope

- Re-running the full router-mode/live-mode skill-benchmark suite — this phase is a validator/doc-fidelity fix, not a routing behavior change; `design-command-surface-check.mjs` reaching `PASS` is itself the relevant automated gate.
- Deciding whether `design-mcp-open-design` should get a real `/design:design-mcp-open-design` command wrapper file — the 020 audit flagged this as an open product decision (registry says `command: null`); this phase keeps that decision as-is (discriminator-visible, command-null) since nothing in the fix work reopened it.
- Touching the other 5 concurrently-dirty files in the working tree unrelated to this scope (`design-audit/foundations/motion/SKILL.md`'s `sk-doc` path fix, and 5 pre-existing `description.json` regenerations under `002/003/004/005/017`) — confirmed via `git diff` to be unrelated concurrent-session activity, not touched by or related to this phase's work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Edit | Rewrite surface-drift stage for the router+assets shape; add transport-command roster exemption |
| `.opencode/commands/design/{audit,foundations,interface,motion,md-generator}.md` | Edit | Add `design-mcp-open-design` sibling row; add `**Ask-first:**` marker (5 files) |
| `.opencode/skills/sk-design/command-metadata.json` | Edit | (carried over from the metadata-stage fix already applied before this phase's drift-stage work began) |
| `.opencode/skills/sk-design/design-md-generator/{SKILL.md,README.md,references/extraction_workflow.md}` | Edit | Fix obsolete `mcp-open-design` naming |
| `.opencode/skills/sk-design/feature_catalog/feature_catalog.md` | Edit | Fix obsolete `mcp-open-design` naming |
| `.opencode/agents/design.md`, `.claude/agents/design.md` | Edit | Mode Map + tool-surface downshift rules + packet-path note |
| `.opencode/skills/sk-design/SKILL.md` | Edit | Version `1.1.0.0` -> `1.2.0.0` |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/020-drift-and-improvement-audit/**` | Add | Commit the deep-research folder (previously untracked) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `design-command-surface-check.mjs` reaches a genuine clean pass | `STATUS=PASS STAGE=complete SUMMARY invalid=0 drift=0` |
| REQ-002 | The rewrite validates real content, not a weakened no-op | Each rewritten check still fails on a genuinely wrong/missing value (verified by construction: every check retains a real assertion against `record` fields, just retargeted to the correct file) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No obsolete `mcp-open-design` naming remains in live (non-changelog) sk-design docs | Grep sweep for `` `mcp-open-design` `` (excluding `design-mcp-open-design`) returns only the historical changelog entry |
| REQ-004 | Design agent (both runtime mirrors) documents all 6 modes and per-mode tool-surface downshift | Mode Map has 6 rows; a "Tool-Surface Downshift" section names the 3 distinct tool-surface tiers |
| REQ-005 | `SKILL.md` version is no longer stale relative to sibling descriptors | `version: 1.2.0.0`, matching `description.json` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** `node design-command-surface-check.mjs` runs, **Then** it exits 0 with `STATUS=PASS drift=0`.
- **SC-002**: **Given** a grep sweep for `` `mcp-open-design` `` across sk-design + design commands + both agent mirrors, **Then** 0 hits remain outside the frozen changelog entry.
- **SC-003**: **Given** both `design.md` agent files are read, **Then** each lists 6 modes and a tool-surface downshift rule set.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Loosening exact-substring checks to word-overlap/fuzzy matching (handoff rationale, choreography action text) could mask a genuine future content regression | Low-Medium | Threshold set at 0.7 (handoff) / 0.5 (choreography) word-overlap, not a bare "section exists" check; still fails if the wrong sibling/resource/rationale is substituted entirely |
| Risk | Shared working tree has unrelated concurrent-session dirty files | Medium | Confirmed via `git diff` which files are unrelated (sk-doc path fix, description.json regenerations); commit built in an isolated worktree scoped to only this phase's files |
| Dependency | Phase 015's router+assets command shape (already shipped) | High | This phase only updates the validator and docs to match it; does not re-touch the command files' actual router/asset content |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding. The one open product decision flagged by the 020 audit (whether `design-mcp-open-design` should get a real command wrapper) is explicitly deferred, not reopened, per Out of Scope above.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The validator now reflects the actual command architecture; a future `/design:*` command edit that drifts from its declared `command-metadata.json` contract will be caught again, closing a blind spot that existed silently since Phase 015.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- A future 7th transport-kind mode added to `mode-registry.json` will automatically be exempted from wrapper/metadata-roster requirements via the new `readTransportCommands()` check (keyed on `packetKind === "transport"`), without needing another validator patch.
- A future workflow-kind mode's choreography step using a path segment naming convention different from `references/` would still need the `lastPathSegment` fallback match to succeed — verified against all 5 existing commands' step 3, not assumed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | ~350-line rewrite across 1 script + content edits to 12 markdown/JSON files |
| Risk | 8/25 | Touches a checked-in validator gate; mitigated by iterating to a genuine clean pass rather than a weakened one |
| Research | 10/20 | Required reading the full validator (2600+ lines), all 5 command files + their auto/presentation assets, and `command-metadata.json` in full to map old-shape checks to new-shape equivalents |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None - see section 7.

---

## RELATED DOCUMENTS

- **Predecessor Phase**: `../020-drift-and-improvement-audit/research/research.md` (the deep-research audit this phase acts on)
- **Root Cause Phase**: `../015-design-commands-implementation/` (the router+assets refactor the validator had drifted from)
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
