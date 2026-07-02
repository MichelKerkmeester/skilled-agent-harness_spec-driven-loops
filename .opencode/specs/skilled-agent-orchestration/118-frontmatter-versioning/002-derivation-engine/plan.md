---
title: "Implementation Plan: Phase 2 - Derivation Engine"
description: "Phase 2 planned the deterministic frontmatter-version compute, apply, and verify engine. The phase is complete with fixture tests, dry-run manifest output, idempotent insertion, and numstat-gated version derivation."
trigger_phrases:
  - "derivation engine plan"
  - "frontmatter version engine plan"
  - "numstat gated plan"
  - "version manifest plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-frontmatter-versioning/002-derivation-engine"
    last_updated_at: "2026-07-02T05:45:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold frontmatter with authored phase plan"
    next_safe_action: "Run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/scripts/frontmatter-version.mjs"
      - ".opencode/skills/sk-doc/scripts/tests/test_frontmatter_version.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediated-002-derivation-engine-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The engine is deterministic; MiMo is not in the compute path."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2 - Derivation Engine

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node (self-contained ES module), git plumbing |
| **Framework** | sk-doc scripts (plain JS, no build step) |
| **Storage** | None (reads files and git history; writes a dry-run manifest) |
| **Testing** | Fixture-based integration harness |

### Overview
This phase built one deterministic engine that computes the correct 4-part version for any in-scope skill doc and inserts it without ever reflowing the rest of the frontmatter. The approach was a single self-contained ES module that resolves each skill's anchor as the higher of the SKILL.md frontmatter version and the latest changelog, derives the build segment from a numstat-gated commit count, and exposes compute, apply, and verify modes, all proven on a fixture tree and dry-run against a live skill before any corpus edit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (hand-versioning thousands of files is infeasible; a naive commit count over-counts due to a historical rename)
- [x] Success criteria measurable (unit tests pass; dry-run matches hand-computed versions; re-run is a byte-level no-op)
- [x] Dependencies identified (phase 1 standard supplies the format and derivation rules)

### Definition of Done
- [x] All acceptance criteria met (compute/apply/verify implemented; idempotent; manifest emitted)
- [x] Tests passing (fixture harness green; dry-run on a live skill confirmed)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A single deterministic command-line engine with three modes over a precomputable manifest, modeled on the existing nested-changelog tooling.

### Key Components
- **Anchor resolver**: computes each skill's anchor as the higher of the SKILL.md frontmatter version and the highest changelog version, normalizing 3-part to 4-part; a child doc's version is the skill major and minor, a zero patch, and the build segment.
- **Numstat-gated edit counter**: one follow-numstat git log per file, counting only commits whose own added-plus-deleted lines for that file exceed zero; the build segment is capped to keep it bounded.
- **Line-wise inserter**: writes the version as the last frontmatter key before the closing fence, never re-serializing YAML, so multi-line array blocks stay intact.
- **Three modes**: compute (dry-run manifest as CSV and JSON), apply (idempotent insert), and verify (every file's version equals the computed value and is positioned last).

### Data Flow
The engine traces each file's git history once to derive its version, writes a reviewable manifest in compute mode, inserts the field line-wise in apply mode, and re-reads each file in verify mode to confirm value and position; a SKILL.md reconciles up to its anchor automatically while a child doc's human-set value is preserved unless an update is requested.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Chose the engine home and the self-contained ES-module form (no TypeScript dist pipeline, matching the plain-script convention)
- [x] Built a fixture harness with a skills-root test hook to run the real command against an isolated tree

### Phase 2: Core Implementation
- [x] Implemented the anchor resolver (higher of frontmatter and changelog, with 3-part normalization) and the child-version formula
- [x] Implemented the numstat-gated edit counter (one git call per file; drop zero-line commits)
- [x] Implemented line-wise insertion and the compute/apply/verify modes with a CSV plus JSON manifest

### Phase 3: Verification
- [x] Ran the fixture harness across every frontmatter variant (5-field, 2-field, no-frontmatter, already-versioned, 3-part)
- [x] Confirmed idempotency, skip-equal, skip-conflict, and the update override
- [x] Dry-ran against a live skill on real git history to confirm the anchor and edit counts
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Anchor reconciliation, normalization, insertion, idempotency, skip/update logic | Fixture harness (Node) |
| Integration | Full compute/apply/verify through the real command on an isolated skills tree | Fixture harness (Node) |
| Manual | Dry-run on a live skill against real git history | Engine compute mode |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 version standard | Internal | Green | Supplies the format and changelog-anchored derivation the engine implements |
| git history (follow-numstat) | External | Green | Drives the build-segment count; gated on per-file numstat to discount renames |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The engine miscomputes or apply corrupts frontmatter on the dry-run sample.
- **Procedure**: The engine only dry-ran in this phase, so no corpus state exists to revert; remove the script and tests. Apply is idempotent and line-wise, so an accidental run reverts by deleting the single inserted line.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
