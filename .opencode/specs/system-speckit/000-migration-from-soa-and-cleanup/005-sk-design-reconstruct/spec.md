---
title: "Feature Specification: Reconstruct sk-design 001-008 design specs and establish clean 001-009 numbering [template:level_2/spec.md]"
description: "sk-design's spec-folder z_archive is empty and no 001-008 packet has ever existed in git; three active numbered folders (002, 003, 003-duplicate) are never-tracked orchestration scratch that collide with the intended clean sequence. This packet plans the reconstruction of 8 design-spec packets from the intact skill source of truth and the collision-clearing cleanup that yields a clean 001-009 numbering."
trigger_phrases:
  - "sk-design reconstruction"
  - "sk-design 001-008"
  - "sk-design numbering cleanup"
  - "design spec reconstruction"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/005-sk-design-reconstruct"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded Level 2 planning docs for reconstruction"
    next_safe_action: "Await operator go-ahead for downstream fill run"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/"
      - ".opencode/specs/sk-design/z_archive/"
      - ".opencode/specs/sk-design/002-mcp-open-design/"
      - ".opencode/specs/sk-design/003-mcp-figma-with-direct-cli-support/"
      - ".opencode/specs/sk-design/003-sk-design-parent/"
      - ".opencode/specs/sk-design/009-sk-design-claude-parity/"
      - ".opencode/skills/sk-design/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "005-sk-design-reconstruct-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the 8 reconstructed packets carry a Level indicator narrower than Level 2 given they document already-shipped, stable skill content rather than planned change?"
      - "Should the 3 scratch folders be deleted outright or first re-verified for any last untracked artifact worth preserving before the gated clear runs?"
    answered_questions:
      - "Confirmed via `git log --all --diff-filter=A --name-only` that no `.opencode/specs/sk-design/00[1-8]*` path has ever been committed; only `009-sk-design-claude-parity` (first commit `3907a95f12e`) has ever been tracked under sk-design specs."
---
# Feature Specification: Reconstruct sk-design 001-008 design specs and establish clean 001-009 numbering

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
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
| **Status** | Draft |
| **Created** | 2026-07-16 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`.opencode/specs/sk-design/` is missing a coherent 001-N packet sequence. `z_archive/` contains only
`description.json` and `graph-metadata.json` — no archived phase folders at all. The active top-level
directory holds `002-mcp-open-design`, `003-mcp-figma-with-direct-cli-support`, and `003-sk-design-parent`
(a duplicate `003`), all three of which are `git ls-files`-confirmed to have **zero tracked files**: every
file under them is an untracked, gitignored orchestration/review log (`orchestration-status.log`,
`seat-*.out`, vendored `external/*-main` clones, etc.) — 19, 2, and 2,712 untracked files respectively.
The only tracked sk-design spec packet is `009-sk-design-claude-parity` (442 tracked files, first committed
`3907a95f12e`). There is no `001-design-foundations` through `008-...` on disk, in `z_archive/`, in git
history, or in the memory DB.

### Forensic Finding (verified this session)

`git log --all --diff-filter=A --name-only -- '.opencode/specs/sk-design/00[1-8]*'` returns **no output** —
no commit in the entire repository history has ever added a file under `sk-design/001` through `sk-design/008`.
`git log --diff-filter=A --oneline --reverse -- '.opencode/specs/sk-design/009*'` shows `009` was the first
and only sk-design spec packet ever tracked. This means the missing 001-008 range is **not a lost-and-recoverable
git artifact** — it never existed as committed content. Any downstream work must be framed as **creation /
reconstruction from the intact skill source of truth**, not as "restoring" deleted history. The stale top-level
`graph-metadata.json` (`children_ids` listing phantom entries like `design/001-sk-design-interface`,
`design/004-sk-design-md-generator`) is generated-metadata drift consistent with this gap, not counter-evidence
of a real 001-008 packet — it is regenerated downstream and out of scope here.

### Purpose

Plan (not execute) two coupled outcomes: (1) eight new design-spec packets, `001-008`, each documenting one
real, already-shipped surface of `.opencode/skills/sk-design/` as a Level-2 spec/plan/tasks/checklist bundle,
sourced only from the intact skill tree; and (2) a gated cleanup of the three never-tracked scratch folders
that collide with `002` and `003` so the final on-disk sk-design spec sequence is a clean, contiguous
`001-009` (001-008 newly authored, 009 the existing, untouched Claude-parity packet).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define the 8-packet source map: which `.opencode/skills/sk-design/` surface backs each of `001-008`,
  with file/line-count evidence for each.
- Define the gated collision-clearing step: which 3 never-tracked scratch folders must be removed before
  `001-008` can be authored at those exact numbers, and the safety conditions the gate must confirm first.
- Define the final-state numbering contract: `001-008` newly authored + `009-sk-design-claude-parity`
  unchanged = clean `001-009`.
- Hand off the downstream execution shape (sonnet-5 scaffold pass + GPT-5.6 fill pass per packet) as a
  planning note, not as work this packet performs.

### Out of Scope
- Actually authoring the 8 packets' `spec.md`/`plan.md`/`tasks.md`/`checklist.md` content — that is the
  downstream scaffold + fill run this packet hands off to.
- Running `rm -rf` on the 3 scratch folders — that is a gated downstream execution step, never performed
  by this planning packet.
- Any other workstream under the `000-migration-from-soa-and-cleanup` phase-parent (this packet's track is
  sk-design only).
- Regenerating `.opencode/specs/sk-design/description.json` or `graph-metadata.json` (generated downstream
  after the 8 packets exist on disk).
- Modifying `.opencode/skills/sk-design/` itself — it is the read-only source of truth for this reconstruction.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/sk-design/001-design-foundations/{spec,plan,tasks,checklist}.md` | Create (downstream) | Reconstructed from `.opencode/skills/sk-design/design-foundations/` |
| `.opencode/specs/sk-design/002-design-interface/{spec,plan,tasks,checklist}.md` | Create (downstream) | Reconstructed from `.opencode/skills/sk-design/design-interface/`; requires prior clear of the existing `002-mcp-open-design` scratch folder |
| `.opencode/specs/sk-design/003-design-motion/{spec,plan,tasks,checklist}.md` | Create (downstream) | Reconstructed from `.opencode/skills/sk-design/design-motion/`; requires prior clear of the existing `003-mcp-figma-with-direct-cli-support` and `003-sk-design-parent` scratch folders |
| `.opencode/specs/sk-design/004-design-audit/{spec,plan,tasks,checklist}.md` | Create (downstream) | Reconstructed from `.opencode/skills/sk-design/design-audit/` |
| `.opencode/specs/sk-design/005-design-md-generator/{spec,plan,tasks,checklist}.md` | Create (downstream) | Reconstructed from `.opencode/skills/sk-design/design-md-generator/` (excludes vendored `node_modules/`) |
| `.opencode/specs/sk-design/006-design-mcp-open-design/{spec,plan,tasks,checklist}.md` | Create (downstream) | Reconstructed from `.opencode/skills/sk-design/design-mcp-open-design/` (transport packet) |
| `.opencode/specs/sk-design/007-design-hub-routing/{spec,plan,tasks,checklist}.md` | Create (downstream) | Reconstructed from the sk-design hub: `SKILL.md`, `mode-registry.json`, `hub-router.json` |
| `.opencode/specs/sk-design/008-design-shared-backbone/{spec,plan,tasks,checklist}.md` | Create (downstream) | Reconstructed from `shared/`, `benchmark/`, `feature_catalog/` |
| `.opencode/specs/sk-design/002-mcp-open-design/` | Delete (gated, downstream) | Never-tracked orchestration scratch (19 untracked files); collides with target `002` |
| `.opencode/specs/sk-design/003-mcp-figma-with-direct-cli-support/` | Delete (gated, downstream) | Never-tracked orchestration scratch (2 untracked files); collides with target `003` |
| `.opencode/specs/sk-design/003-sk-design-parent/` | Delete (gated, downstream) | Never-tracked orchestration scratch + vendored `external/*-main` clones (2,712 untracked files); collides with target `003` |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/` | Unchanged | Existing tracked packet (442 files); final position in the clean sequence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document the forensic non-existence finding | `spec.md` §2 cites the exact `git log --all` commands run and their (empty) output for `sk-design/001-008`, distinguishing reconstruction from restoration. |
| REQ-002 | Define an 8-packet source map | Each of `001-008` names one real `.opencode/skills/sk-design/` folder/file set as its sole source, with file-count/line-count evidence captured in this session. |
| REQ-003 | Define the scratch-collision gate | The gate names all 3 colliding folders, confirms (via `git ls-files`) that each has 0 tracked files before any downstream delete, and is documented as a precondition, not performed here. |
| REQ-004 | State the final numbering contract | Documented final state is exactly `001-008` (new) + `009-sk-design-claude-parity` (untouched) = contiguous `001-009`, with no other top-level sk-design spec folder remaining. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Hand off downstream execution shape | `plan.md` records that per-packet authoring is a downstream sonnet-5 scaffold + GPT-5.6 fill run, not work performed in this packet. |
| REQ-006 | Preserve skill-source read-only boundary | No edit, mutation, or deletion command against `.opencode/skills/sk-design/**` appears anywhere in this packet's docs. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/005-sk-design-reconstruct --strict` passes for this planning packet.
- **SC-002**: The source-map table in this `spec.md` names exactly 8 distinct `.opencode/skills/sk-design/` sources, each independently verifiable with `find <path> -type f | wc -l` and `wc -l <path>/SKILL.md`.
- **SC-003**: `git ls-files .opencode/specs/sk-design/002-mcp-open-design/ .opencode/specs/sk-design/003-mcp-figma-with-direct-cli-support/ .opencode/specs/sk-design/003-sk-design-parent/` continues to return zero lines at hand-off time, confirming the gate's "0 tracked files" precondition still holds.
- **SC-004**: Downstream execution (out of scope here) results in `ls .opencode/specs/sk-design/` showing exactly `001` through `009` as the only numbered packet folders.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Downstream framing drifts into "restoring deleted content" | Misleads future readers into believing content was lost, when it never existed | This spec's forensic finding (§2) is the canonical framing; downstream packets must cite it. |
| Risk | Scratch-clear runs before the 0-tracked-files gate is re-verified | Accidental loss of a genuinely valuable but untracked artifact | Gate is documented as a precondition requiring fresh `git ls-files` + `git status --porcelain` confirmation immediately before delete, not reuse of this session's snapshot. |
| Risk | `009-sk-design-claude-parity` numbering assumption becomes stale | Final `001-009` claim breaks if `009` is renumbered elsewhere before this reconstruction lands | Downstream execution must re-check `ls .opencode/specs/sk-design/` immediately before authoring `001-008`. |
| Dependency | `.opencode/skills/sk-design/` skill tree (source of truth) | If it changes materially before the downstream fill run, packet content could go stale | Downstream fill run re-reads the live skill tree at authoring time rather than trusting this session's counts verbatim. |
| Dependency | Downstream sonnet-5 scaffold + GPT-5.6 fill run | Reconstruction only completes once that run executes | This packet's `next_safe_action` names the hand-off explicitly. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A — this packet produces planning documentation only; no runtime path is touched.

### Security
- **NFR-S01**: The gated scratch-clear must not run against any folder with nonzero `git ls-files` output; downstream execution re-verifies this immediately before any `rm -rf`.

### Reliability
- **NFR-R01**: Reconstructed packet claims must never assert git-history recovery; every reconstructed packet states its skill-source origin explicitly (mirroring the `001-design-foundations/spec.md` format proof already drafted in-session).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Scratch folder later found to have tracked files: downstream gate must re-run `git ls-files` immediately before delete and abort if any path returns.
- `009-sk-design-claude-parity` renumbered or moved before hand-off: downstream execution must re-list `.opencode/specs/sk-design/` rather than assume this session's numbering is still current.

### Error Scenarios
- Skill source folder (`.opencode/skills/sk-design/<mode>/`) renamed or restructured before the fill run: downstream authoring must re-verify the source map against the live tree, not this spec's cached counts.
- Downstream fill run cannot access `.opencode/skills/sk-design/design-md-generator/backend/` (large vendored `node_modules/`, 2,793 files): packet 005 must scope its source citation to the pipeline code only and explicitly exclude vendored dependencies.

### State Transitions
- Partial downstream completion (e.g., only 001-004 authored before interruption): the numbering contract in REQ-004 still requires the full 001-008 range before the packet claims done; a partial state is not a valid completion.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | 8 distinct source packets to map + 1 numbering contract + 1 gated cleanup step; documentation-only, no code. |
| Risk | 14/25 | Main risk is a mischaracterized forensic claim or a premature destructive delete; both are mitigated by explicit gating and citation. |
| Research | 15/20 | Required `git log --all`, `git ls-files`, `find`/`wc -l` verification across 6 mode folders + hub + shared/benchmark/feature_catalog. |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the 8 reconstructed packets carry a Level indicator narrower than Level 2 given they document already-shipped, stable skill content rather than planned change?
- Should the 3 scratch folders be deleted outright or first re-verified for any last untracked artifact worth preserving before the gated clear runs?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
