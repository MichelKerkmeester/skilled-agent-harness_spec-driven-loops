---
title: "Implementation Plan: Changelog Backfill and Work Audit for Spec 026"
description: "A four-phase agent swarm: generator scaffold then HVR enrichment then 10-check verification, run track-by-track, followed by rollups, residue canonicalization, and audit synthesis."
trigger_phrases:
  - "026 changelog backfill plan"
  - "changelog swarm plan"
  - "nested changelog enrichment"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/008-docs-and-catalogs-rollup/001-changelog-backfill-and-audit"
    last_updated_at: "2026-05-31T19:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored implementation plan"
    next_safe_action: "Build and dry-run the per-track enrichment workflow"
    blockers: []
    key_files:
      - "spec.md"
      - "references/stage-b-enrichment-contract.md"
      - "references/verification-gate.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000002"
      session_id: "changelog-backfill-2026-05-31"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Changelog Backfill and Work Audit for Spec 026

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Node.js generator, Bash verification |
| **Framework** | Workflow tool (deterministic agent orchestration) |
| **Storage** | Filesystem (spec tree under 026) |
| **Testing** | `validate.sh --strict` plus a 10-check HVR/structure gate |

### Overview

A swarm scaffolds each packet with `nested-changelog.js --json`, a Sonnet agent enriches the scaffold into a publishable HVR-voice changelog using the Stage B contract, and a Bash gate verifies it. The work runs track-by-track for control, then phase-parent rollups and indexes are authored, residue is canonicalized, and an audit is synthesized. GPT-5.5-medium-fast via cli-opencode is the minority adversarial-verify and audit lens. Sonnet does the bulk.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Coverage matrix and per-track work-lists produced by recon
- [x] Generator fidelity validated across packet types
- [x] Enrichment contract and 10-check verification gate captured

### Definition of Done
- [ ] All in-scope shipped phases have a changelog or an audit entry
- [ ] Zero verification-gate failures on new files
- [ ] Residue canonicalized, audit report written, `validate.sh --strict` clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Pipeline-per-track. Each packet flows through scaffold, enrich, verify as one agent owning all three steps, so a slow packet never blocks a fast one.

### Key Components

- **Generator**: `nested-changelog.js --json` produces the structured scaffold and the canonical output path.
- **Enrichment agent (Sonnet)**: applies the Stage B contract, writes the file.
- **Verification gate (Bash)**: the 10 checks; failures recycle to the agent at most twice.
- **Adversarial sampler (GPT-5.5 via cli-opencode)**: fidelity check on a sample per track.
- **Rollup and index author (Sonnet)**: `root.md` plus `README.md` per directory.
- **Canonicalizer**: path fixes, symlink repair, directory migration.

### Data Flow

Work-list (per-track packet paths) feeds the pipeline. Each agent reads packet evidence and git history, writes a changelog, self-verifies. Rollups read child changelogs. The audit reads the before and after coverage.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a documentation backfill, not a code fix, so the bug-fix surface inventory is not applicable. The one cross-cutting surface is the `026/changelog/` symlink aggregation, which must be rebuilt after canonicalization so every symlink resolves to a real file.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `026/changelog/` symlinks | Aggregates per-track changelogs at program root | rebuild | `find -L 026/changelog -type l ! -exec test -e {} \; -print` returns empty |
| existing `changelog-*.md` Spec folder lines | Point at old renumbered paths | update | grep for old track numbers returns zero in narrative |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create isolated child packet and governance docs
- [x] Generate per-track work-lists
- [ ] Generate description.json and graph-metadata.json, pass strict validate
- [ ] Dry-run the enrichment workflow on 2-3 packets against the 004 gold standard

### Phase 2: Backfill (per track, full send)
- [ ] 001-research-and-baseline (7) and 005-graph-impact-and-affordance (7) first as small shakeouts
- [ ] 007-mcp-daemon-reliability (14), 006-operator-tooling (11), 004-code-graph (41)
- [ ] 002-spec-kit-internals (13, thematic)
- [ ] 000-release-and-program-cleanup (131)
- [ ] 003-memory-and-causal-runtime (217)

### Phase 3: Rollups, indexes, canonicalization
- [ ] Author root.md rollups for phase parents
- [ ] Build or update every changelog/README.md index
- [ ] Fix stale paths, repair 9 symlinks, rename 2 files, migrate 003 directories, rebuild aggregation

### Phase 4: Audit and reconciliation
- [ ] Write audit-report.md
- [ ] Reconcile completion metadata, final strict validate, save context
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Each changelog: sections, marker, frontmatter | grep checks 4-10 of the gate |
| Voice | HVR lint: em-dash, semicolon, Oxford comma | grep checks 2-3 of the gate |
| Fidelity | Sampled per track: claim vs evidence | GPT-5.5 via cli-opencode |
| Packet | Spec folder integrity | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| nested-changelog.js | Internal | Green | No scaffold, agents author from raw evidence |
| phase.md / root.md templates | Internal | Green | No canonical structure |
| validate.sh | Internal | Green | Gate check 1 unavailable |
| cli-opencode (GPT-5.5) | External | Yellow | Drop adversarial sampling, rely on Bash gate plus Sonnet self-check |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A track's output fails quality review against the gold standard, or canonicalization breaks a path.
- **Procedure**: New changelog files are additive, so delete the track's new files to revert. Canonicalization edits and the symlink rebuild are committed separately so they can be reverted with `git checkout` of the changelog tree without touching the new files.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Backfill per track) ──► Phase 3 (Rollups + Canon) ──► Phase 4 (Audit)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Backfill |
| Backfill | Setup | Rollups |
| Rollups + Canonicalization | Backfill (leaf changelogs exist) | Audit |
| Audit | Rollups | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Done plus one dry run |
| Backfill | High | About 441 enrichment agents, track-by-track |
| Rollups + Canonicalization | Medium | Per-parent rollups plus a residue sweep |
| Audit | Low | One synthesis pass |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Per-track new-file list captured before write
- [ ] Symlink targets inventoried before canonicalization

### Rollback Procedure
1. Identify the track or sweep to revert.
2. Delete its new changelog files, or `git checkout` the canonicalization edits.
3. Rebuild the `026/changelog/` aggregation.
4. Re-run the verification gate on the remaining tree.

### Data Reversal
- **Has data migrations?** No. Filesystem only.
- **Reversal procedure**: git revert of the changelog tree paths.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
work-list ──► [scaffold ─► enrich ─► verify] per packet ──► root rollups ──► README indexes
                                              │
                                              └─► sampled adversarial verify
canonicalization (paths, symlinks, 003 migration) ──► 026/changelog aggregation ──► audit
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Enrichment | work-list, generator | leaf changelogs | rollups |
| Rollups | leaf changelogs | root.md | indexes |
| Indexes | rollups, leaves | README.md | audit |
| Canonicalization | leaves present | clean tree | audit |
| Audit | all above | audit-report.md | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup plus dry run** - validates the contract end to end - CRITICAL
2. **Track 003 backfill (217)** - the largest single block - CRITICAL
3. **Canonicalization sweep** - must follow all leaf writes - CRITICAL

**Parallel Opportunities**:
- Small tracks (001, 005, 006, 007) can be batched together.
- Per-track README indexes can be authored as soon as that track's leaves and rollups exist.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup complete and dry run passes | 2-3 changelogs match gold standard, gate green | Phase 1 |
| M2 | All 8 tracks backfilled | Every shipped leaf has a changelog or audit entry | Phase 2 |
| M3 | Tree canonical and audited | Zero dangling symlinks, audit written, strict validate clean | Phase 4 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the recorded decisions on scaffold-then-enrich, full canonicalization, and the no-fabrication HALT policy.
