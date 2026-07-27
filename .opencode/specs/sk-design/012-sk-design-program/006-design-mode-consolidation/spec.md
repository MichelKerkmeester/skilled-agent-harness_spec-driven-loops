---
title: "Feature Specification: sk-design mode consolidation"
description: "Reduce sk-design to four registered modes while preserving foundations and audit as complete permanent design-interface command subworkflows, keeping styles unchanged, and retaining every downstream verification seam."
trigger_phrases:
  - "sk-design mode consolidation"
  - "four design modes"
  - "interface foundations audit subworkflows"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/006-design-mode-consolidation"
    last_updated_at: "2026-07-26T09:08:32Z"
    last_updated_by: "opencode"
    recent_action: "Initialized the approved Level 3 implementation packet"
    next_safe_action: "Capture baselines, consumers, counts, and styles hashes"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Audit and foundations remain permanent interface-owned subworkflows."
---
# Feature Specification: sk-design Mode Consolidation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

## EXECUTIVE SUMMARY

The `sk-design` hub currently registers six modes even though foundations and audit are durable command workflows owned by the interface domain. This packet reduces the registry to exactly four entries: `interface`, `motion`, `md-generator`, and `design-mcp-open-design`. Foundations and audit move beneath `design-interface` as complete permanent subworkflows, retain their public commands and behavioral contracts, and cease to expose nested skill identities.

**Key Decisions**: Preserve both command subworkflows permanently; transform their nested `SKILL.md` files into non-identity `contract.md` files; leave `styles/` byte-unchanged; preserve all downstream checker and benchmark seams.

**Critical Dependencies**: Canonical five-iteration mode-consolidation research, live mode registry/router schemas, command contracts, corpus tests, AI-fingerprint parity, compiled routing metadata, and strict SpecKit validation.

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

Foundations and audit are registered as peer hub modes despite being permanent interface-domain workflows. Their independent mode identities enlarge advisor and router topology, while their commands, procedures, corpora, report contracts, and verifiers must remain independently executable.

### Purpose

Remove only the two unnecessary hub-mode identities. Preserve every user-visible foundations and audit capability under `design-interface`, update all live consumers to the new ownership model, and prove that no styles data or downstream contract regresses.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Reduce `mode-registry.json` to exactly four entries: `interface`, `motion`, `md-generator`, and `design-mcp-open-design`.
- Move all foundations and audit capability beneath `design-interface` without nested skill identities.
- Keep `/interface:foundations` and `/interface:audit` as permanent command subworkflows.
- Add explicit command-subworkflow doctrine and typed routing ownership to the hub, interface contract, router, and command metadata.
- Preserve audit P0-P3 severity, five `/20` dimensions, reports, comparison corpus, AI-fingerprint parity, and Bash verifier seams.
- Preserve foundations procedures, references, assets, relationship corpus, validators, and command behavior.
- Preserve two historical READMEs, two historical changelogs, and convert two nested `SKILL.md` files to `contract.md`.
- Relocate exactly 112 subordinate files and rebuild `leaf-manifest.json` to 69 interface-owned leaves.
- Regenerate every live routing consumer and pass package, command, corpus, fingerprint, checker, benchmark, and strict SpecKit gates.

### Out of Scope

- Any content or byte change beneath `.opencode/skills/sk-design/styles/`.
- A standalone `design-audit` advisor identity.
- Removing, deprecating, or making temporary either public command.
- Changing visual design guidance, scoring semantics, benchmark expectations, or interface output styling.
- Adding compatibility aliases beyond the existing permanent command surfaces.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-interface/` | Modify | Own interface, foundations, and audit workflow contracts and leaves |
| `.opencode/skills/sk-design/design-foundations/` | Remove after relocation | Retire nested hub-mode identity |
| `.opencode/skills/sk-design/design-audit/` | Remove after relocation | Retire nested hub-mode identity |
| `.opencode/skills/sk-design/{SKILL.md,mode-registry.json,hub-router.json,command-metadata.json,leaf-manifest.json}` | Modify | Four-mode registry and command-subworkflow routing |
| `.opencode/skills/sk-design/{description.json,graph-metadata.json}` | Generate | Refresh advisor metadata for the four-mode hub |
| `.opencode/skills/sk-design/shared/` | Modify where referenced | Repoint live doctrine, scripts, fixtures, and tests |
| `.opencode/commands/interface/` | Modify where referenced | Preserve foundations/audit public commands with interface-owned routing |
| `.opencode/bin/compiled-route-sync.cjs` and generated sk-design routing artifacts | Modify/Generate | Preserve downstream compiled-routing seams |
| `.opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/` | Modify where generated | Refresh canonical routing fixtures and activation metadata |
| `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/` | Create | Level 3 implementation and verification evidence |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Hub registry has exactly four entries | Registry keys and ordered mode ids are `interface`, `motion`, `md-generator`, `design-mcp-open-design` |
| REQ-002 | Foundations remains a complete permanent interface subworkflow | Public command, auto/confirm workflow, procedures, corpus, and validators pass from the new path |
| REQ-003 | Audit remains a complete permanent interface subworkflow | Public command, P0-P3 model, five `/20` dimensions, report assets, corpus, fingerprints, and Bash gates pass from the new path |
| REQ-004 | No nested foundations or audit skill identities remain | No relocated `SKILL.md`, advisor metadata pair, or registry row exists for either subworkflow |
| REQ-005 | Styles remain unchanged | Pre/post tracked-path count and SHA-256 manifest are identical for all 7,812 tracked files |
| REQ-006 | Relocation accounting is exact | 112 subordinate relocations, two README relocations/rewrites, two `SKILL.md` to `contract.md` transformations, and two preserved changelogs are verified |
| REQ-007 | Every downstream verifier seam survives | Package, command, corpus, fingerprint, checker, benchmark, and compiled-routing gates pass |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Command-subworkflow doctrine is explicit | Hub and interface contracts distinguish registry modes from permanent command subworkflows |
| REQ-009 | All live routing consumers use the new paths | Grep inventory has no live old-path consumers outside historical/spec evidence and generated-before snapshots |
| REQ-010 | Interface leaf manifest is deterministic | Regenerated manifest reports exactly 69 interface-owned leaves and passes its checker |
| REQ-011 | Router default and styles path prose match executable behavior | Canonical docs use `styles/lib/engine`, `styles/lib/database`, and the actual default interface route |
| REQ-012 | Historical records remain legible | Both relocated READMEs and changelogs explain retained behavior without creating skill identities |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Advisor and hub routing expose one `sk-design` identity with exactly four registered modes.
- **SC-002**: Both permanent commands execute the same owned workflows from beneath `design-interface`.
- **SC-003**: Existing audit and foundations proof suites pass without weakened assertions.
- **SC-004**: The pre/post styles manifest is byte-identical.
- **SC-005**: All exact move counts, manifest counts, metadata regeneration, and strict packet validation pass.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Command contract schemas | Permanent commands may lose a valid target | Preserve command ids and add typed subworkflow ownership before deleting mode rows |
| Risk | Audit corpus or fingerprint split | Review quality gates silently weaken | Move owned trees atomically and run parity/corpus gates immediately |
| Risk | Generated routing fixtures retain old paths | Runtime and source topology diverge | Inventory producers, regenerate canonical artifacts, and run drift checks |
| Risk | Styles tree changes during broad move | Frozen data/service behavior regresses | Hash all tracked styles paths before and after; stop on any delta |
| Risk | Historical references are mistaken for live consumers | Scope broadens into archives | Classify grep hits as live, generated, or historical before editing |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: No new runtime process, styles query, or hydration pass is introduced.
- **NFR-P02**: Registry and command dispatch remain bounded by the existing four-mode router.

### Security

- **NFR-S01**: Existing audit shell invocation and path-validation gates remain intact.
- **NFR-S02**: No external dependency, credential, network call, or executable permission change is introduced.

### Reliability

- **NFR-R01**: Relocation is deterministic and reversible from a scoped pre-change manifest.
- **NFR-R02**: Generated artifacts must be produced by repository generators, not manually approximated.
- **NFR-R03**: A failing stage halts before subsequent topology changes.

## 8. EDGE CASES

### Data Boundaries

- Same filenames across foundations and audit retain distinct subworkflow roots.
- Historical changelogs may name prior hub modes but do not become live route consumers.
- Command metadata may preserve sibling tokens while pointing to interface-owned subworkflows.
- Generated manifests must not classify `contract.md` as a nested skill identity.

### Error Scenarios

- Any styles hash mismatch halts verification and triggers scoped rollback.
- Any relocation count mismatch halts before source directories are considered retired.
- Any old live path discovered after regeneration blocks completion.
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

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Permanent command routes disappear with mode rows | H | M | Add subworkflow routing first and run command gates |
| R-002 | Audit semantics are flattened into interface preflight | H | M | Preserve audit contract, reports, scoring, and independent invocation |
| R-003 | AI-fingerprint catalogue and checks diverge | H | M | Move and verify as one owned surface |
| R-004 | Compiled routing metadata remains stale | H | M | Use canonical sync/generation and drift checks |
| R-005 | Frozen styles files change | H | L | Full tracked-file hash manifest comparison |

## 11. USER STORIES

### US-001: Use a focused design workflow (Priority: P0)

**As a** design operator, **I want** foundations and audit to remain permanent commands, **so that** hub simplification does not remove specialized design work.

**Acceptance Criteria**:
1. Given either public command, when it resolves, then it targets the corresponding interface-owned subworkflow and retains its full workflow contract.

### US-002: Route through a smaller hub (Priority: P0)

**As a** skill advisor consumer, **I want** `sk-design` to expose exactly four modes, **so that** routing reflects durable top-level jobs rather than internal interface subworkflows.

**Acceptance Criteria**:
1. Given advisor or hub routing, when mode candidates are enumerated, then foundations and audit are absent as modes but remain valid command targets.

## 12. OPEN QUESTIONS

None. The user-approved architecture supersedes the research recommendation to create a standalone audit identity: both foundations and audit remain permanent interface-owned subworkflows.
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Architecture Decisions**: `decision-record.md`
- **Research Source**: linked-worktree packet `001-research/006-mode-consolidation-research/research/research.md`
