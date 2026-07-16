---
title: "Feature Specification: Phase 5: inventory-parity-and-doc-truth"
description: "Bring mcp-refero to full inventory parity with its hub siblings (examples, install.sh, playbook enrichment, per-tool feature-catalog leaves, v1.1.0.0 changelog) and execute the researched sk-design de-duplication: slim refero_tools.md to a pointer and reword design-interface transport prose."
trigger_phrases:
  - "refero inventory parity"
  - "mcp-refero phase 005"
  - "refero sk-design dedup"
  - "refero examples install"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/005-inventory-parity-and-doc-truth"
    last_updated_at: "2026-07-16T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped inventory parity + sk-design dedup; gates green"
    next_safe_action: "Proceed to 006-live-verification-capture when operator auth is available"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-refero/examples/README.md"
      - ".opencode/skills/mcp-tooling/mcp-refero/scripts/install.sh"
      - ".opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-inventory-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: inventory-parity-and-doc-truth

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-validation-and-handoff |
| **Successor** | 006-live-verification-capture |
| **Handoff Criteria** | package gate PASS strict; sk-design gate unchanged before/after; playbook at 9 indexed scenarios / 17 files; 8 per-tool catalog leaves; v1.1.0.0 changelog shipped |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the mcp-refero completion: inventory parity, sk-design dedup, doc truth.

**Scope Boundary**: Writes are confined to `.opencode/skills/mcp-tooling/mcp-refero/**`, this spec child, the single sk-design catalog file `design-interface/references/mcp_tooling/refero_tools.md` (slimmed to a pointer), and bounded design-interface prose lines that name the Refero transport. The `refero` manual in `.utcp_config.json` stays untouched (validated as-is).

**Dependencies**:
- Phase 001 research synthesis (`../001-research/research/research.md`) - ground truth for the section A tool surface, section D funnel workflows, and section G de-duplication directive.
- Phase 002 packet (`.opencode/skills/mcp-tooling/mcp-refero/`, v1.0.0.0) - the baseline inventory being enriched.
- `mcp-aside-devtools/examples/` - the structural convention the new examples directory mirrors.

**Deliverables**:
- `examples/` directory (README + 3 worked Code Mode walkthroughs).
- `scripts/install.sh` verify-only posture check.
- Playbook enriched from 6 to 9 indexed scenarios (14 to 17 scenario files).
- Feature catalog enriched with 8 per-tool leaves (one per documented tool).
- sk-design de-dup: `refero_tools.md` pointer + transport-phrasing prose updates.
- Version 1.1.0.0 + `changelog/v1.1.0.0.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The v1.0.0.0 `mcp-refero` packet shipped structurally valid but short of hub-sibling inventory parity: no `examples/` directory, no `scripts/install.sh`, a 6-scenario playbook where the research section D supports more workflow coverage, and a feature catalog whose 8 tools share only 3 grouped domain files. Meanwhile the research section G de-duplication directive was still unexecuted: `sk-design/design-interface/references/mcp_tooling/refero_tools.md` (v1.5.0.3) carried the full duplicated tool catalog, leaving two competing homes for the same transport facts.

### Purpose
One canonical home for every Refero transport fact (`mcp-refero`), full inventory parity with hub siblings, and sk-design keeping only its judgment-side guidance - all gates green.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New `examples/` directory: README + funnel walkthrough, metadata-first lookup, screen-image fetch (doubled-prefix callables, mandatory `tool_info` first, OAuth steps SKIP-valid).
- New `scripts/install.sh`: non-interactive verify posture (node>=18, npx, manual presence via read-only grep, Node-25 SIGSEGV warning, operator-only OAuth pointer).
- Playbook enrichment to 9 indexed scenarios: FUNNEL-001, FORMAT-001, QUOTA-001, grounded in research sections D and C; root index updated.
- Feature-catalog per-tool leaves: 8 files so each documented tool has a home; domain files and root count summary updated.
- sk-design de-dup per research section G: `refero_tools.md` slimmed to a pointer (version bumped); design-interface prose updated to "mcp-refero transport over mcp-code-mode" phrasing.
- Version bump to 1.1.0.0 + `changelog/v1.1.0.0.md`.
- This spec child authored as Level 2 with a real checklist and implementation summary.

### Out of Scope
- Any edit to `.utcp_config.json` or the registered `refero` manual - validated as-is, frozen by packet contract.
- Live authenticated verification (OAuth completion, live `tool_info` capture) - that is phase 006.
- `design_references_mcp.md` beyond the lines that link moved catalog content - it remains the judgment-side contract.
- Hub registration surfaces (mode-registry, hub-router) - registered in phase 003; no routing signal changes here.
- New tools, arguments, or limits - everything traces to `references/tool_surface.md`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp-refero/examples/` (README + 3 walkthroughs) | Create | Worked Code Mode walkthroughs mirroring mcp-aside-devtools examples conventions |
| `mcp-refero/scripts/install.sh` | Create | Verify-only posture check, bash -n clean |
| `mcp-refero/manual_testing_playbook/read_only/funnel_walk.md`, `read_only/format_text_retrieval.md`, `safety_gate/quota_recovery.md` | Create | Three research-grounded scenarios, live parts SKIP-valid |
| `mcp-refero/manual_testing_playbook/manual_testing_playbook.md` | Modify | Coverage 9 scenarios, waves, summaries, index, v1.1.0.0 |
| `mcp-refero/feature_catalog/` (8 leaves + 3 domain files + root) | Create/Modify | Per-tool leaves; domain files link leaves; count summary updated |
| `mcp-refero/SKILL.md`, `mcp-refero/README.md` | Modify | v1.1.0.0; examples/install.sh surfaced |
| `mcp-refero/changelog/v1.1.0.0.md` | Create | Release notes |
| `sk-design/design-interface/references/mcp_tooling/refero_tools.md` | Modify | Slimmed to pointer, v1.6.0.0, judgment-side guidance only |
| `sk-design/design-interface/` (SKILL.md, README.md, 3 reference/playbook files) | Modify | Bounded transport-phrasing updates |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Examples directory with worked walkthroughs, each opening with `tool_info` confirmation, doubled-prefix callables only, OAuth steps SKIP-valid with exact commands, no invented tools/params | 4 files exist; every callable matches the 8-tool surface in `references/tool_surface.md`; link check 0 broken |
| REQ-002 | `scripts/install.sh` non-interactive verify posture: node>=18 + npx, manual presence read-only grep, Node-25 SIGSEGV warning, OAuth operator-only | `bash -n` exit 0; live run reports OK on all posture checks without writing anything |
| REQ-003 | Playbook >=17 scenario files with >=3 new research-grounded scenarios; root index consistent | 9 IDs = 9 per-scenario files in the index; 17 files under the playbook tree (9 indexed + 8 routing-recall) |
| REQ-004 | Feature catalog gives each of the 8 documented tools a home | 8 per-tool leaves exist, each tracing args/bounds to `references/tool_surface.md`; count summary matches |
| REQ-005 | sk-design de-dup executed with an unchanged validation gate | `refero_tools.md` is a pointer doc; `validate_skill_package.py .opencode/skills/sk-design` output byte-identical before/after; 0 broken links in touched files |
| REQ-006 | Version 1.1.0.0 + changelog | SKILL.md frontmatter `version: 1.1.0.0`; `changelog/v1.1.0.0.md` exists and describes the release |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | `package_skill.py --check --strict` stays PASS after enrichment | Result: PASS, exit 0 |
| REQ-008 | Spec child authored Level 2 with real checklist and implementation summary; metadata regenerated | `validate.sh <child> --strict --no-recursive` PASSED; description.json + graph-metadata.json refreshed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `mcp-refero` matches hub-sibling inventory shape (examples/, scripts/install.sh, enriched playbook, per-tool catalog leaves, versioned changelog) with `package_skill.py --check --strict` PASS.
- **SC-002**: Exactly one canonical home for the Refero tool surface: `refero_tools.md` in sk-design points to `mcp-refero` and keeps only judgment-side guidance, with the sk-design package gate output unchanged.
- **SC-003**: Every new documented callable, argument, and bound traces to `references/tool_surface.md`; nothing invented; OAuth-gated steps SKIP-valid.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 synthesis + tool_surface.md as ground truth | Wrong facts propagate to examples/scenarios | Every claim traced to the cited table; no live-only claims stated as verified |
| Risk | sk-design slimming breaks a consumer link or the package gate | sk-design routing/validation regression | Gate run before and after with byte-diff; link check over every touched file |
| Risk | Playbook index drift (counts vs files) | Broken release-readiness contract | Index sentence, coverage table, and file count updated together and re-counted |
| Risk | SKILL.md word-count creep past the 5,000 hard cap | Strict gate failure | Additions kept minimal (3,889 words after edit; cap 5,000) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Runtime/provider unknowns (live callable confirmation, OAuth end-to-end, 429 behavior) are deliberately carried in `references/tool_surface.md` Section 5 and belong to phase 006, not this phase.
<!-- /ANCHOR:questions -->
