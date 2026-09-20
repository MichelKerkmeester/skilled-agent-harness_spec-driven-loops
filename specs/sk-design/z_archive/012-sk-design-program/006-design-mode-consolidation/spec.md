---
title: "Feature Specification: sk-design mode consolidation"
description: "Reduce sk-design to four registered modes and three commands by retiring /interface:audit and /interface:foundations entirely (ADR-002 supersedes the original permanent-subworkflow design), folding load-bearing anti-slop checks into the interface preflight card, keeping styles unchanged, and retaining every downstream verification seam."
trigger_phrases:
  - "sk-design mode consolidation"
  - "four design modes"
  - "interface foundations audit subworkflows"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/006-design-mode-consolidation"
    last_updated_at: "2026-07-27T04:33:25.494Z"
    last_updated_by: "claude"
    recent_action: "Reconciled scope to the ADR-002 retirement outcome (4 modes, 3 commands)"
    next_safe_action: "Orchestrator runs validate.sh --strict, styles SHA-256 equality, and the design benchmark suite"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
    completion_pct: 85
    open_questions: []
    answered_questions:
      - "Audit and foundations are retired entirely, not preserved as permanent interface-owned subworkflows (ADR-002 supersedes ADR-001)."
---
# Feature Specification: sk-design Mode Consolidation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

## EXECUTIVE SUMMARY

The `sk-design` hub originally registered six modes even though foundations and audit were durable command workflows owned by the interface domain. This packet reduces the registry to exactly four entries: `interface`, `motion`, `md-generator`, and `design-mcp-open-design`. The original plan (ADR-001) moved foundations and audit beneath `design-interface` as permanent subworkflows. That design proved undeliverable: embedding them via a `commandSubworkflows` array required a second per-packet ownership array, which the create-skill parent-hub doctrine (one entry per packet in `modes[]`) does not allow. **ADR-002 supersedes ADR-001**: the operator retired both `/interface:audit` and `/interface:foundations` entirely rather than extracting audit as a standalone skill (the canonical research's ranked recommendation). The registry ends at 4 modes and 3 commands (`/interface:design`, `/interface:motion`, `/interface:design-reference`).

**Key Decisions**: Delete the audit surface (70 files / 6,202 lines) and two dead AI-fingerprint parity scripts (915 lines); flatten foundations into `design-interface/` without preserving its `contract.md`/`README.md`/`changelog/`; fold 7 load-bearing anti-slop checks into `design-interface/assets/interface-preflight-card.md` section 11; delete the `commandSubworkflows` concept entirely; leave `styles/` byte-unchanged.

**Critical Dependencies**: Canonical five-iteration mode-consolidation research, live mode registry/router schemas, command contracts, corpus tests, and strict SpecKit validation. AI-fingerprint parity and compiled-routing dependencies from the original plan are no longer applicable — the fingerprint scripts were deleted as dead code once audit was retired.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-07-26 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `../` |
| **Research Dependency** | `001-research/006-mode-consolidation-research` in linked worktree `0103-sk-design-structure-naming-cleanup` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Foundations and audit were registered as peer hub modes despite being interface-domain workflows. Their independent mode identities enlarged advisor and router topology. The original fix (embed both as permanent `interface` command subworkflows) turned out to violate the create-skill doctrine's one-entry-per-packet rule, so it was not implementable as designed.

### Purpose

Remove the two unnecessary hub-mode identities by retiring both commands (ADR-002), preserving only the specific anti-slop checks with real evidence value, and proving that no styles data or downstream command/corpus contract regresses.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Reduce `mode-registry.json` to exactly four entries: `interface`, `motion`, `md-generator`, and `design-mcp-open-design`.
- Retire `/interface:audit` and `/interface:foundations` entirely; delete the `commandSubworkflows` concept (array, `extensions["command-subworkflows"]`, `commandSubworkflowSignals`, `canonicalBySubworkflow`, `commandSubworkflowBundles`, `transformVerbRouting.excludedAliases`).
- Delete the audit surface (`design-interface/audit/`, `assets/audit/`, `references/audit/` — 70 files / 6,202 lines) and the two dead AI-fingerprint parity scripts.
- Flatten foundations into `design-interface/`; delete its `contract.md`/`README.md`/`changelog/`; move `procedures/`, `corpus/`, `scripts/` flat, with references/assets at `design-interface/references/foundations/` and `assets/foundations/`.
- Fold 7 load-bearing anti-slop checks into `design-interface/assets/interface-preflight-card.md` section 11; add a `VISUAL_SYSTEM` intent + `visual-system` task lane so the inherited foundations resources stay reachable.
- Rewrite `shared/procedures/polish-gate-orchestration.md` (not delete) for its five live consumers; delete six unfixable playbook scenarios; fix the pre-existing dangling `command-metadata.json` reference.
- Pass command-contract, command-surface, corpus, and parent-hub gates from the final topology.

### Out of Scope

- Any content or byte change beneath `.opencode/skills/sk-design/styles/`.
- A standalone `design-audit` advisor identity (the canonical research's ranked recommendation 3 — considered again under ADR-002 and rejected in favor of retirement).
- Any relocate-and-preserve migration of foundations/audit — superseded by retirement.
- Changing visual design guidance for the retained `interface`/`motion`/`md-generator` modes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-interface/` | Modify | Flattened foundations content; interface preflight card carries the folded anti-slop checks |
| `.opencode/skills/sk-design/design-interface/audit/`, `assets/audit/`, `references/audit/` | Delete | Audit surface retired (70 files / 6,202 lines) |
| `.opencode/skills/sk-design/design-interface/foundations/{contract.md,README.md,changelog/}` | Delete | Judged packet-mimicking ceremony, not preserved |
| `.opencode/skills/sk-design/{SKILL.md,mode-registry.json,hub-router.json,command-metadata.json}` | Modify | Four-mode registry; `commandSubworkflows` and related fields deleted |
| `.opencode/skills/sk-design/shared/procedures/polish-gate-orchestration.md` | Rewrite | Re-anchored on the interface preflight card for its five live consumers |
| `.opencode/skills/sk-design/shared/scripts/ai-fingerprint-{registry,fixture}-check.mjs` | Delete | Dead parity scripts (915 lines) with no other consumer |
| `.opencode/commands/interface/` | Modify | Three commands remain: `/interface:design`, `/interface:motion`, `/interface:design-reference` |
| `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/` | Create | Level 3 implementation and verification evidence |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria | Status |
|----|-------------|---------------------|--------|
| REQ-001 | Hub registry has exactly four entries | Registry keys and ordered mode ids are `interface`, `motion`, `md-generator`, `design-mcp-open-design` | Met — verified final state |
| REQ-002 *(superseded)* | ~~Foundations remains a complete permanent interface subworkflow~~ | Superseded by ADR-002: foundations is flattened into `design-interface/`, not a permanent subworkflow; its `contract.md`/`README.md`/`changelog/` were deleted | N/A |
| REQ-003 *(superseded)* | ~~Audit remains a complete permanent interface subworkflow~~ | Superseded by ADR-002: `/interface:audit` is retired; the audit surface (70 files / 6,202 lines) is deleted | N/A |
| REQ-004 | No nested foundations or audit skill identities remain | No `SKILL.md`, advisor metadata pair, or registry row exists for either — true a fortiori under retirement | Met |
| REQ-005 | Styles remain unchanged | Pre/post tracked-path count and SHA-256 manifest are identical for all 7,812 tracked files | NOT verified — baseline captured, final comparison not run |
| REQ-006 *(superseded)* | ~~Relocation accounting is exact (112 subordinate relocations, 2 READMEs, 2 contract transforms, 2 changelogs)~~ | Superseded by ADR-002: outcome was deletion (audit) and flattening-without-preservation (foundations), not the planned relocation accounting | N/A |
| REQ-007 | Command/corpus/checker gates pass from the final topology | `interface-command-contract.test.mjs` 8/8, `design-command-surface-check.test.mjs` 7/7, `design-command-surface-check.mjs` (`commands=3 aliases=9 invalid=0 drift=0`), `parent-skill-check.cjs` OK/0-warnings, corpus (interface+motion) 70/0 | Met — fingerprint/benchmark/compiled-routing gates not evidenced |

### P1 - Required

| ID | Requirement | Acceptance Criteria | Status |
|----|-------------|---------------------|--------|
| REQ-008 *(superseded)* | ~~Command-subworkflow doctrine is explicit~~ | Superseded by ADR-002: the `commandSubworkflows` concept is deleted, not documented as doctrine | N/A |
| REQ-009 | All live routing consumers use the new paths | Grep inventory for live `design-audit/`/`design-foundations/` references: 152 baseline -> 0 final | Met |
| REQ-010 *(superseded)* | ~~Interface leaf manifest reports exactly 69 leaves~~ | The 69-leaf figure was specific to the retired relocation plan; not re-verified against the retirement outcome here | N/A |
| REQ-011 | Router default and styles path prose match executable behavior | Not directly evidenced in this reconciliation pass | Pending |
| REQ-012 | Retained historical records stay legible | Audit/foundations `README`/`changelog` were deleted, not retained — the operator judged them packet-mimicking ceremony rather than history worth keeping (ADR-002) | Deliberately not met — accepted cost |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Advisor and hub routing expose one `sk-design` identity with exactly four registered modes. **Met.**
- **SC-002** *(superseded)*: ~~Both permanent commands execute the same owned workflows from beneath `design-interface`.~~ ADR-002 retired both commands instead; three commands remain.
- **SC-003** *(superseded)*: ~~Existing audit and foundations proof suites pass without weakened assertions.~~ The audit suite was deleted with the surface; foundations content is covered by interface+motion corpus (70/0).
- **SC-004**: The pre/post styles manifest is byte-identical. **NOT verified** — baseline captured, final comparison pending.
- **SC-005**: Command/corpus/checker gates pass and strict packet validation succeeds. **Partially met** — command/corpus/checker gates pass (see gate table); `validate.sh --strict` NOT run.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation / Outcome |
|------|------|--------|------------|
| Dependency | Create-skill parent-hub doctrine (one entry per packet) | The original `commandSubworkflows` design was not implementable | Realized — resolved by ADR-002 retirement instead of a second ownership array |
| Risk | Audit review-quality capability is lost entirely | Any workflow depending on standalone audit scoring/reports has no replacement | Accepted cost of ADR-002; 7 anti-slop checks folded into the interface preflight card |
| Risk | Live consumers retain old `design-audit/`/`design-foundations/` paths | Runtime and source topology diverge | Verified: grep count 152 -> 0 |
| Risk | Styles tree changes during the change | Frozen data/service behavior regresses | Baseline hash captured (`scratch/styles.sha256.before`, 7,812 rows); final comparison NOT yet run |
| Risk | Historical references are mistaken for live consumers | Scope broadens into archives | Classified before editing; six now-dead playbook scenarios deleted rather than rewritten |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: No new runtime process, styles query, or hydration pass is introduced.
- **NFR-P02**: Registry and command dispatch remain bounded by the existing four-mode router.

### Security

- **NFR-S01** *(superseded by ADR-002)*: ~~Existing audit shell invocation and path-validation gates remain intact.~~ Audit was retired, not relocated; the surviving write-boundary guarantee is the md-generator's shared `output-policy.ts` allowlist gating every generated write, plus interface and motion staying read-only tool surfaces.
- **NFR-S02**: No external dependency, credential, network call, or executable permission change is introduced.

### Reliability

- **NFR-R01**: Relocation is deterministic and reversible from a scoped pre-change manifest.
- **NFR-R02**: Generated artifacts must be produced by repository generators, not manually approximated.
- **NFR-R03**: A failing stage halts before subsequent topology changes.

## 8. EDGE CASES

### Data Boundaries

- Historical benchmark reports, changelogs, and archived specs that name the retired `design-audit`/`design-foundations` paths remain valid evidence and are not live route consumers.
- Command metadata no longer preserves a subworkflow discriminator — `commandSubworkflows` and its consumers are deleted, not repointed.

### Error Scenarios

- Any styles hash mismatch would halt verification and trigger scoped rollback — comparison itself has not run yet.
- Any old live path discovered after this reconciliation pass blocks completion (verified clear: 152 -> 0).
- Any baseline failure is recorded before implementation and must be resolved or explicitly attributed before a regression claim.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Two full workflow trees, hub routing, commands, generated consumers |
| Risk | 20/25 | Public commands, path-sensitive verifiers, frozen 7,812-file styles tree |
| Research | 15/20 | Five canonical iterations plus approved architecture override |
| Multi-Agent | 6/15 | Single executor with cross-surface verification |
| Coordination | 15/15 | Sequential migrations and shared compiled-routing consumers |
| **Total** | **78/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Outcome |
|---------|-------------|--------|------------|------------|
| R-001 | `commandSubworkflows` design violates doctrine, blocking the embed-and-preserve plan | H | Realized | Resolved via ADR-002 retirement, not a workaround |
| R-002 | Audit review capability is lost when its scoring/reports are not carried forward | H | Realized (accepted) | 7 anti-slop checks folded into the interface preflight card; scoring apparatus intentionally not carried over |
| R-003 | Dead AI-fingerprint scripts left orphaned after audit retirement | M | Realized | Both scripts deleted (915 lines) rather than left as dead code |
| R-004 | Live old-path references survive the change | H | Not realized | Verified 152 -> 0 |
| R-005 | Frozen styles files change | H | Not observed | Baseline captured; final comparison NOT yet run |

## 11. USER STORIES

### US-001: Use the retained design workflows without dead-weight commands (Priority: P0)

**As a** design operator, **I want** `/interface:design`, `/interface:motion`, and `/interface:design-reference` to keep working with the anti-slop essentials preserved, **so that** retiring audit/foundations does not silently drop quality checks I relied on.

**Acceptance Criteria**:
1. Given `/interface:design`, when it runs, then the 7 folded anti-slop checks in `interface-preflight-card.md` section 11 still apply, and the `visual-system` task lane surfaces the inherited foundations resources.
2. Given `/interface:audit` or `/interface:foundations`, when invoked, then they no longer exist — this is an accepted, intentional capability removal, not a defect.

### US-002: Route through a smaller hub (Priority: P0)

**As a** skill advisor consumer, **I want** `sk-design` to expose exactly four modes and three commands, **so that** routing reflects durable top-level jobs with no dead or superseded identities.

**Acceptance Criteria**:
1. Given advisor or hub routing, when mode candidates are enumerated, then only `interface`, `motion`, `md-generator`, and `design-mcp-open-design` appear, and `commandSubworkflows` does not exist anywhere in the schema.

## 12. OPEN QUESTIONS

None currently open. Two decisions are now on record: ADR-001 (embed both as permanent interface subworkflows) was accepted first, then superseded by ADR-002 (retire both entirely) once the embedding design was found to violate the create-skill one-entry-per-packet doctrine rule. ADR-002 also revisits and again rejects the canonical research's ranked recommendation to extract audit as a standalone skill. See `decision-record.md` for both ADRs.
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Architecture Decisions**: `decision-record.md`
- **Research Source**: linked-worktree packet `001-research/006-mode-consolidation-research/research/research.md`
