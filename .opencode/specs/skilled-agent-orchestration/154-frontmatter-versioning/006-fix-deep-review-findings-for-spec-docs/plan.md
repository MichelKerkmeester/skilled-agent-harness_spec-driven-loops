---
title: "Implementation Plan: Phase 6 — Fix Deep-Review Findings"
description: "Reconcile the deep-review findings without changing versioning behavior: correct spec.md counts to the engine-gate ground truth, refresh parent/child metadata and continuity, populate the child plan/tasks, document the reconcile asymmetry, and harden the engine. Metadata is regenerated last so fingerprints match final content."
trigger_phrases:
  - "fix deep review findings plan"
  - "spec doc remediation plan"
  - "metadata refresh backfill plan"
  - "child continuity reconcile plan"
  - "engine hardening plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-frontmatter-versioning/006-fix-deep-review-findings-for-spec-docs"
    last_updated_at: "2026-06-23T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Planned the remediation: counts, metadata, continuity, plan/tasks, engine nits"
    next_safe_action: "Phase complete; commit the working tree when ready"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/154-frontmatter-versioning/spec.md"
      - ".opencode/skills/sk-doc/scripts/frontmatter-version.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-fix-deep-review-findings-for-spec-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Run the graph-metadata backfill LAST, after every doc edit, so fingerprints match final content."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6 — Fix Deep-Review Findings

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
| **Language/Stack** | Markdown spec docs + Node engine (`.mjs`) + Bash gate |
| **Framework** | system-spec-kit (validate.sh, backfill-graph-metadata, generate-context) |
| **Storage** | `graph-metadata.json` / `description.json` (generated) |
| **Testing** | `validate.sh --strict`, the engine's 21-assertion suite, the gate |

### Overview
Resolve every deep-review finding without changing versioning behavior. Correct the spec.md counts to the engine-gate ground truth, reconcile child continuity, populate the child plan/tasks, document the SKILL.md reconcile exception, and apply low-risk engine hardening. Regenerate all metadata last, then validate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (engine 21/21, gate exit 0)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation remediation — no runtime architecture change.

### Key Components
- **Spec docs (parent + 6 children)**: accuracy + continuity.
- **Generated metadata**: `graph-metadata.json` + `description.json`, refreshed via the sanctioned generators.
- **Engine (`frontmatter-version.mjs` + gate)**: dead-code removal + low-risk hardening only.

### Data Flow
Doc edits land first; the graph-metadata backfill then re-derives each folder's source fingerprint from the final doc content; `validate.sh` checks the result.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is the deep-review-CONDITIONAL case the addendum is written for.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| parent + child `spec.md` | describe scope + continuity | update counts + continuity | engine gate counts; `validate.sh` |
| `graph-metadata.json` (all folders) | generated source fingerprint + status | regenerate via backfill | `validate.sh` GENERATED_METADATA_INTEGRITY |
| `frontmatter-version.mjs` + gate | the versioning engine | dead-code removal + node guard + maxBuffer | 21-assertion test; gate exit 0 |
| `frontmatter_versioning.md` | the standard | document the reconcile exception | doc review |

Required inventories:
- Counts cross-checked against `frontmatter-version.mjs gate` (2,222 / 457 / 1,753).
- Engine behavior held invariant: the 21-assertion suite + gate re-run after every engine edit.
- Algorithm invariant: the apply path only writes files from its own in-scope discovery, never user-supplied paths — so no path-boundary guard is added (documented, not coded).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Spec accuracy + continuity
- [x] Correct parent spec.md counts + execution-model wording + 3-part normalization note
- [x] Reconcile child spec.md continuity (completion_pct, recent_action, `.ts`->`.mjs`)
- [x] Populate the five child plan/tasks from impl-summaries

### Phase 2: Standard + engine
- [x] Document the SKILL.md reconcile exception in the standard
- [x] Remove the dead variable; add the node guard; raise maxBuffer
- [x] Re-run the engine test + gate (green)

### Phase 3: Metadata refresh + verification
- [x] Backfill graph-metadata on parent + all 6 children
- [x] generate-context for description + continuity
- [x] `validate.sh --strict` green across the tree
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | the engine | the 21-assertion suite |
| Integration | the gate over the corpus | `check-frontmatter-versions.sh` |
| Spec validation | parent + 6 children | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `backfill-graph-metadata.js` | Internal | Green | metadata fingerprints stay stale |
| `generate-context.js` | Internal | Green | description/continuity stay stale |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `validate.sh` regresses or the engine test fails.
- **Procedure**: the tree is uncommitted; `git checkout` the affected docs/engine files to revert. The metadata generators are idempotent and can be re-run.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
