---
title: "Decision Record: Changelog Backfill and Work Audit for Spec 026"
description: "Decisions on scaffold-then-enrich, full canonicalization, no-fabrication HALT policy, and the isolated child-packet location."
trigger_phrases:
  - "026 changelog decisions"
  - "changelog backfill adr"
  - "decision record"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/008-docs-and-catalogs-rollup/001-changelog-backfill-and-audit"
    last_updated_at: "2026-05-31T19:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Recorded architecture decisions"
    next_safe_action: "Build and dry-run the per-track enrichment workflow"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000005"
      session_id: "changelog-backfill-2026-05-31"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Decision Record: Changelog Backfill and Work Audit for Spec 026

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Scaffold with the generator, then enrich with an agent

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-31 |
| **Deciders** | Owner, orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context

A live dry run of `nested-changelog.js --json` on seven packets across every type showed the generator extracts the right evidence but its raw output is not publishable. It dumps raw task lines, misclassifies research as Fixed, leaks checklist-id noise, extracts phase-parent boilerplate verbatim, and leaves Files Changed empty when the implementation summary lacks a three-column table. It does pin the canonical output path and structure.

### Constraints

- About 441 changelogs must match the HVR voice and the 004 gold standard.
- No claim may be fabricated.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a two-step pipeline where the generator scaffolds and a Sonnet agent enriches the scaffold into a publishable changelog using a written contract.

**How it works**: each packet agent runs the generator for the scaffold and output path, reads the implementation summary, spec, and git history, then rewrites Summary, classifies Added, Changed and Fixed, builds the Files Changed table, and prunes Follow-Ups. A Bash gate verifies the result.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scaffold then enrich** | Deterministic structure plus human-quality prose | Two steps per packet | 9/10 |
| Generator only with --write | Fastest, cheapest | Output not publishable, fails HVR and misclassifies | 3/10 |
| Hand-author from scratch | Highest control | No reuse of the generator path logic, slower | 5/10 |

**Why this one**: the generator removes the boilerplate and pathing work, the agent supplies the voice and judgment the generator cannot.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Every changelog has consistent structure and human voice.
- The output path and template choice are never guessed.

**What it costs**:
- One agent per packet. Mitigation: pipeline concurrency and track-by-track sequencing.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Enrichment introduces an unsupported claim | H | Fabrication guard plus sampled adversarial verify |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 441 phases have no changelog |
| 2 | **Beyond Local Maxima?** | PASS | Three options scored |
| 3 | **Sufficient?** | PASS | Generator plus one agent meets the bar |
| 4 | **Fits Goal?** | PASS | Directly produces the requested changelogs |
| 5 | **Open Horizons?** | PASS | Reuses the standing generator and templates |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- A reusable workflow script runs scaffold, enrich, and verify per packet.

**How to roll back**: delete the track's new changelog files. They are additive.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Full canonicalization of reorg residue

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-31 |
| **Deciders** | Owner |

---

<!-- ANCHOR:adr-002-context -->
### Context

Recon found the track was renumbered several times. All 103 existing changelogs carry old spec-folder paths, the program changelog directory holds 9 dangling symlinks pointing at a deleted folder, two files use a non-canonical changelog.md name, and track 003 stores changelogs in scattered per-child directories rather than one parent directory like the 004 gold standard.

### Constraints

- Canonicalization must not lose any existing changelog.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: backfill plus full canonicalization. Fix stale paths, repair the symlinks, rename the two files, migrate 003 directories to parent-level, and rebuild the program aggregation.

**How it works**: a canonicalization sweep runs after all leaf changelogs exist, moving files rather than deleting them and verifying counts before and after.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Backfill plus full canonicalization** | Clean, consistent tree | Most file churn | 8/10 |
| Backfill only | Fastest | Leaves known inconsistencies | 5/10 |
| Backfill plus path normalization only | Middle ground | 003 stays scattered | 6/10 |

**Why this one**: the owner asked for a clean end state and the residue is already mapped.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- One consistent changelog layout across the program.
- Every symlink resolves to a real file.

**What it costs**:
- Edits to 103 existing files plus directory moves. Mitigation: move not delete, verify counts, commit the sweep separately for easy revert.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A move drops a changelog | M | Count before and after, never delete |
| A path edit breaks a working link | M | Inventory symlink targets before and after |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Dangling symlinks and stale paths exist now |
| 2 | **Beyond Local Maxima?** | PASS | Three options scored |
| 3 | **Sufficient?** | PASS | Sweep covers all known residue classes |
| 4 | **Fits Goal?** | PASS | A clean tree was explicitly requested |
| 5 | **Open Horizons?** | PASS | Matches the gold-standard layout going forward |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Existing changelog Spec folder lines, the 026/changelog symlinks, and the 003 directory layout.

**How to roll back**: `git checkout` the changelog tree paths to restore prior paths, symlinks, and layout.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: No fabrication, HALT on thin evidence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-31 |
| **Deciders** | Owner, orchestrator |

---

<!-- ANCHOR:adr-003-context -->
### Context

Recon flagged about 47 packets that are phase-parent control folders, unshipped stubs, or in-flight work at 0 to 5 percent. Authoring a normal changelog for these would require inventing outcomes.

### Constraints

- The Four Laws forbid fabrication. Honesty over coverage.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: HALT on thin or unshipped packets. They get no authored changelog. They are listed in the audit with a reason.

**How it works**: the enrichment contract classifies each packet first. Phase parents get a root rollup. Unshipped or thin packets are recorded in the audit HALT inventory.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **HALT and log in audit** | Honest, traceable | Coverage is below 100 percent of folders | 9/10 |
| Write planned-not-shipped stubs | Uniform file presence | Risks implying work that did not ship | 4/10 |

**Why this one**: an honest gap recorded in the audit is better than a misleading stub.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Readers can trust every changelog reflects real shipped work.

**What it costs**:
- Some folders have no changelog. Mitigation: the audit explains each one.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A shipped packet is wrongly flagged thin | L | Sampled review of the HALT list during audit |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 47 packets lack authorable evidence |
| 2 | **Beyond Local Maxima?** | PASS | Stub option considered and rejected |
| 3 | **Sufficient?** | PASS | Audit captures every gap |
| 4 | **Fits Goal?** | PASS | Honesty is a Four-Laws requirement |
| 5 | **Open Horizons?** | PASS | Gaps can be filled when those phases ship |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- The audit report gains a HALT inventory section.

**How to roll back**: not applicable. This is a policy, not a file mutation.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
