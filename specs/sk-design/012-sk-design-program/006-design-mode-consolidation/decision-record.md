---
title: "Decision Record: sk-design mode consolidation"
description: "Architecture decisions for a four-mode sk-design hub: ADR-001's permanent interface-owned subworkflow design (superseded) and ADR-002's final retirement of both /interface:audit and /interface:foundations, with a frozen styles package throughout."
trigger_phrases:
  - "sk-design consolidation decisions"
  - "design command subworkflow architecture"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/006-design-mode-consolidation"
    last_updated_at: "2026-07-27T04:33:25.494Z"
    last_updated_by: "claude"
    recent_action: "Added ADR-002: operator retired both command subworkflows; ADR-001 marked Superseded"
    next_safe_action: "Orchestrator runs validate.sh --strict, styles SHA-256 equality, and the design benchmark suite"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Audit and foundations are retired entirely, not embedded as permanent subworkflows (ADR-002 supersedes ADR-001)."
---
# Decision Record: sk-design Mode Consolidation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Four Modes with Permanent Interface Subworkflows

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Superseded by ADR-002 |
| **Date** | 2026-07-26 |
| **Deciders** | User, OpenCode execution agent |

<!-- ANCHOR:adr-001-context -->
### Context

Foundations and audit are real independently invoked workflows, but they belong to the interface design domain and do not need peer hub-mode identities. Deleting their capabilities would regress public commands, corpora, validators, and evidence contracts.

The canonical research recommended a standalone audit skill because audit has independent scoring, reports, corpora, fingerprints, and Bash gates. The approved objective instead requires one `sk-design` advisor identity with exactly four registry modes and both workflows embedded beneath interface. The shared styles package has 7,812 tracked files and does not need to move for this topology change.

### Constraints

- Keep `/interface:foundations` and `/interface:audit` permanent and complete.
- Preserve all behavior and downstream verifier seams without nested skill identities.
- Do not edit any tracked file under `styles/`.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep exactly four top-level registry modes and preserve foundations and audit as permanent interface-owned command subworkflows.

**How it works**: Move both complete workflow trees beneath `design-interface`, transform their nested `SKILL.md` files to `contract.md`, and let stable public commands select typed subworkflows of the interface mode. Preserve audit authority and foundations behavior in full, expose no standalone audit advisor identity, and freeze every tracked styles byte.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Four modes plus permanent interface subworkflows** | Small topology, stable commands, complete behavior | Requires atomic path and generated-consumer migration | 10/10 |
| Keep six modes | No path migration | Preserves unnecessary identities | 5/10 |
| Standalone audit skill | Preserves independent authority | Adds another advisor identity contrary to approved architecture | 6/10 |
| Flatten both into shared prose | Few directories | Cannot own artifacts, corpora, reports, or executable gates | 2/10 |

**Why this one**: It is the smallest approved topology that preserves every real user job and proof surface. It changes identity and ownership only, not workflow capability or styles behavior.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Smaller advisor and hub topology.
- Stable public commands and specialized workflows.
- Clear interface-domain ownership.

**What it costs**:
- Command metadata and router schemas must represent subworkflow ownership separately from mode rows. Mitigation: update authored schemas before deleting rows.
- Every path-sensitive verifier and generated consumer must migrate atomically. Mitigation: sequential stages with local gates and scoped rollback.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Permanent command loses a route | H | Add typed subworkflow routing before row removal |
| Audit proof surface splits | H | Move owned files atomically and run all audit gates |
| Styles bytes change | H | Require identical full tracked-file manifests |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Six mode identities contradict the approved four-mode target |
| 2 | **Beyond Local Maxima?** | PASS | Research compared peer modes, embedded workflows, standalone audit, and shared doctrine |
| 3 | **Sufficient?** | PASS | Removes only identities while retaining complete capability |
| 4 | **Fits Goal?** | PASS | Exact four-mode routing is the goal's critical path |
| 5 | **Open Horizons?** | PASS | Typed subworkflow ownership supports durable commands without topology growth |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Relocate foundations and audit beneath `design-interface` and transform their identity contracts.
- Update authored and generated routing consumers to four modes plus two permanent command subworkflows.

**How to roll back**: Restore the two peer directories, nested skill contracts, six registry rows, and old consumer paths from the scoped pre-change state; regenerate derived metadata and rerun baselines without touching unrelated dirty files.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-002 -->
## ADR-002: Retire Both Command Subworkflows Instead of Preserving Them

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-26 |
| **Deciders** | User (operator) |

<!-- ANCHOR:adr-002-context -->
### Context

ADR-001 committed to keeping `/interface:foundations` and `/interface:audit` permanent, embedding both beneath `design-interface` via a new `commandSubworkflows` array so that top-level mode identity and durable command capability stayed separate. Implementing that array against the create-skill parent-hub doctrine surfaced a direct conflict: the doctrine's structural rule is that every packet is one entry in `modes[]`; it does not authorize a second parallel ownership array. `commandSubworkflows`, `extensions["command-subworkflows"]`, `commandSubworkflowSignals`, `canonicalBySubworkflow`, and `commandSubworkflowBundles` were all instances of that disallowed second array, and `transformVerbRouting.excludedAliases` existed only to support it.

Separately, the canonical five-iteration mode-consolidation research had ranked "extract audit as a standalone skill" as its top recommendation (recommendation 3), which ADR-001 explicitly overrode in favor of embedding. With the embedding path now blocked by doctrine, the operator faced the same fork again: promote audit to a standalone skill (the research's original recommendation) or retire both commands. The operator chose retirement.

A `toolSurface` check of the two subworkflows found no Bash-authority argument for either path: the audit mode already declared `forbidden: [Write, Edit, Bash]` with an empty `bashAllowlist` before this decision, so neither embedding, extraction, nor retirement changes what shell authority the workflow ever had.

### Constraints

- Do not add a second per-packet ownership array anywhere in `mode-registry.json` or its consumers.
- Preserve the anti-slop essentials the audit command produced value from, without carrying over its scoring/severity apparatus.
- Do not touch `styles/`.
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Retire `/interface:audit` and `/interface:foundations` entirely, delete the `commandSubworkflows` concept in full, and fold only the load-bearing anti-slop checks forward.

**How it works**: `sk-design` registers four modes (`interface`, `motion`, `md-generator`, `design-mcp-open-design`) and now exposes three commands (`/interface:design`, `/interface:motion`, `/interface:design-reference`) with no subworkflow ownership layer. The audit surface (`design-interface/audit/`, `assets/audit/`, `references/audit/` — 70 files, 6,202 lines) and the two dead AI-fingerprint parity scripts (`ai-fingerprint-registry-check.mjs`, 383 lines; `ai-fingerprint-fixture-check.mjs`, 532 lines) are deleted outright. The 7 binary checks worth keeping are folded into `design-interface/assets/interface-preflight-card.md` section 11 (204 → 211 lines); no scoring or severity apparatus was carried over. `design-interface/foundations/` is flattened: its `contract.md`, `README.md`, and `changelog/` are deleted as packet-mimicking ceremony rather than transformed and preserved, while `procedures/` (3 cards), `corpus/`, and `scripts/` (3 Python checkers) move flat into `design-interface/`, with references and assets at `design-interface/references/foundations/` and `assets/foundations/`. A new `VISUAL_SYSTEM` intent signal and matching `visual-system` task lane keep the inherited foundations resources reachable from `/interface:design`. `shared/procedures/polish-gate-orchestration.md` is rewritten (not deleted) around the interface preflight card because five live consumers still reference it. Six unfixable playbook scenarios that assumed audit/foundations as live routing targets are deleted. A pre-existing dangling reference in `command-metadata.json` (pointing at a `design-audit/references/transform-remediation.md` directory that never existed) is fixed as a byproduct.
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Retire both, preserve anti-slop essentials only** | No doctrine conflict, smallest topology, no scoring apparatus to maintain | Loses independently invoked audit workflow entirely | 9/10 |
| Extract audit as a standalone skill (research recommendation 3) | Matches original canonical research; preserves full scoring/reporting authority | Adds a second advisor identity the operator had already rejected once (ADR-001); does not resolve foundations | 5/10 |
| Keep ADR-001's embedded `commandSubworkflows` design | No user-facing capability loss | Violates the create-skill doctrine's one-entry-per-packet rule; not implementable as designed | 2/10 |
| Flatten both into shared prose with zero preserved gates | Simplest possible tree | Discards the anti-slop essentials that were still catching real defects | 3/10 |

**Why this one**: It is the only option that both respects the parent-hub doctrine (no second ownership array) and keeps the specific checks that were load-bearing, without re-opening the standalone-skill question ADR-001 already closed.
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- No doctrine violation: `modes[]` remains the single ownership array.
- Smaller tree: 70 files / 6,202 lines of audit surface and 915 lines of dead parity scripts removed.
- Anti-slop essentials survive in `interface-preflight-card.md` section 11 without a scoring apparatus to maintain.

**What it costs**:
- `/interface:audit` and `/interface:foundations` no longer exist as independently invoked commands; any workflow that depended on their standalone reports, scoring, or corpora loses that surface. Mitigation: none attempted — this is the accepted cost of retirement, not a regression to fix.
- Six playbook scenarios that proved audit/foundations routing behavior are deleted rather than rewritten, since there is no longer a target to prove.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A live consumer still expects `design-audit/` or `design-foundations/` | M | Verified grep for old-path references dropped from 152 to 0 |
| Anti-slop coverage regresses silently | M | 7 binary checks explicitly re-homed into the preflight card rather than dropped |
| Doctrine conflict resurfaces elsewhere | L | No second ownership array remains anywhere in `mode-registry.json` or its consumers |
<!-- /ANCHOR:adr-002-consequences -->

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | ADR-001's embedded design is not implementable without violating the one-entry-per-packet doctrine rule |
| 2 | **Beyond Local Maxima?** | PASS | Re-evaluated against both the original research recommendation (standalone skill) and the now-blocked embedded design |
| 3 | **Sufficient?** | PASS | Preserves the specific anti-slop checks with real evidence value; does not preserve unused scoring ceremony |
| 4 | **Fits Goal?** | PASS | Restores a single valid `modes[]` array while cutting real dead weight (915 lines of unused parity scripts) |
| 5 | **Open Horizons?** | PASS | A future standalone audit skill remains possible later without any embedded-subworkflow debt to unwind first |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Delete `commandSubworkflows`, `extensions["command-subworkflows"]`, `commandSubworkflowSignals`, `canonicalBySubworkflow`, `commandSubworkflowBundles`, and `transformVerbRouting.excludedAliases`.
- Delete the audit surface and the two dead fingerprint parity scripts; flatten foundations into `design-interface/` without preserving its `contract.md`/`README.md`/`changelog/`.
- Fold 7 anti-slop checks into `interface-preflight-card.md` section 11; add `VISUAL_SYSTEM` intent + `visual-system` task lane so inherited foundations resources stay reachable.
- Rewrite (not delete) `shared/procedures/polish-gate-orchestration.md` for its five live consumers.
- Delete six playbook scenarios that assumed live audit/foundations routing targets.

**How to roll back**: Restore the deleted audit/foundations trees, the two parity scripts, and the six playbook scenarios from the scoped pre-change Git state; reinstate `commandSubworkflows` and its consumers; revert `interface-preflight-card.md` and `polish-gate-orchestration.md` to their pre-ADR-002 content. Not recommended — reinstating `commandSubworkflows` reintroduces the doctrine violation this ADR exists to resolve.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
