---
title: "Implementation Plan: sk-design mode consolidation"
description: "Stage the foundations and audit relocation beneath design-interface, then update routing consumers and verify exact topology, behavior, frozen styles, and generated metadata."
trigger_phrases:
  - "sk-design consolidation plan"
  - "four design mode implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/006-design-mode-consolidation"
    last_updated_at: "2026-07-26T09:08:32Z"
    last_updated_by: "opencode"
    recent_action: "Defined staged consolidation and file-scoped rollback"
    next_safe_action: "Capture baselines, consumers, counts, and styles hashes"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/sk-design/leaf-manifest.json"
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-design Mode Consolidation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, JavaScript, TypeScript, Python, Bash, YAML |
| **Framework** | OpenCode skill hub, command routers, advisor metadata, compiled routing |
| **Storage** | Repository files and generated manifests |
| **Testing** | Node tests, corpus checks, shell verifiers, benchmark gates, strict SpecKit validation |

### Overview

Capture a full baseline and immutable styles hash manifest. Move foundations first, then audit, under `design-interface`; transform each nested `SKILL.md` into `contract.md`; preserve owned files and permanent commands; remove only the two hub registry rows; update live consumers and generated metadata; verify exact counts and behavior after each stage.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Approved target topology and superseding audit decision are documented.
- [x] Exact relocation and leaf-manifest counts are frozen.
- [x] Rollback boundary and unchanged styles invariant are documented.
- [ ] Baseline commands, path inventory, and styles manifest are captured.

### Definition of Done

- [ ] Exactly four mode registry entries remain.
- [ ] Foundations and audit are complete permanent interface command subworkflows.
- [ ] Exact relocation and manifest counts pass.
- [ ] Styles pre/post manifests are identical.
- [ ] All routing, command, corpus, fingerprint, checker, benchmark, and strict documentation gates pass.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Four top-level hub modes with interface-owned permanent command subworkflows.

### Key Components

- **Hub registry/router**: Enumerates only top-level mode identities and dispatches generic design work.
- **Interface mode**: Owns ordinary interface generation plus named foundations and audit command subworkflows.
- **Foundations subworkflow**: Retains static-system authoring, procedure selection, corpus, and validation.
- **Audit subworkflow**: Retains independently invoked review, severity, scoring, evidence, reporting, corpus, fingerprints, and executable gates.
- **Command routers**: Keep stable public command ids and select an interface subworkflow.
- **Generated routing surfaces**: Mirror the authored source through canonical generators and drift checks.

### Data Flow

```text
user prompt -> sk-design advisor identity -> four-mode hub router
                                      |
                                      +-> interface -> ordinary interface workflow
/interface:foundations -------------->+-> interface/foundations contract
/interface:audit -------------------->+-> interface/audit contract
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Mode registry and hub router | Six top-level modes | Remove foundations/audit rows; add subworkflow doctrine | Registry and router checks |
| Interface skill contract | Ordinary interface owner | Add explicit foundations/audit ownership and route selection | Parent-hub and package checks |
| Foundations tree | Peer mode | Relocate under interface and transform identity contract | Corpus and command gates |
| Audit tree | Peer mode | Relocate under interface and transform identity contract | Corpus, fingerprint, Bash, and command gates |
| Command metadata/wrappers/assets | Public route surface | Preserve command ids and repoint internal ownership | Command surface tests |
| Leaf and advisor metadata | Topology projections | Regenerate from canonical source | Manifest and advisor checks |
| Compiled routing fixtures | Downstream consumers | Regenerate source-owned artifacts | Sync, drift, and benchmark gates |
| Styles tree | Shared frozen package | No edit | Tracked-file hash equality |

Algorithm invariant: registry identity and workflow capability are separate. Removing a top-level mode row must not remove, weaken, or make temporary the permanent command-owned workflow.
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline and Inventory

- [ ] Capture package, command, corpus, fingerprint, checker, benchmark, and routing baselines.
- [ ] Classify all old-path consumers as live, generated, or historical.
- [ ] Record exact source counts and a full tracked styles SHA-256 manifest.

### Phase 2: Foundations Consolidation

- [ ] Add interface-owned foundations route doctrine before removing the mode row.
- [ ] Relocate the complete foundations surface beneath `design-interface`.
- [ ] Transform `SKILL.md` to non-identity `contract.md`; preserve README and changelog.
- [ ] Repoint command, corpus, and live consumers; run foundations gates.

### Phase 3: Audit Consolidation

- [ ] Add interface-owned audit route doctrine before removing the mode row.
- [ ] Relocate the complete audit surface beneath `design-interface`.
- [ ] Transform `SKILL.md` to non-identity `contract.md`; preserve README and changelog.
- [ ] Repoint reports, corpus, fingerprints, Bash verifiers, commands, and live consumers; run audit gates.

### Phase 4: Four-Mode Routing and Generation

- [ ] Remove the two mode rows and all nested identity metadata.
- [ ] Update hub/router/command metadata and canonical documentation.
- [ ] Regenerate leaf, advisor, compiled-routing, fixture, and activation metadata.

### Phase 5: Verification and Reconciliation

- [ ] Verify exact relocation and 69-leaf accounting.
- [ ] Compare styles manifests byte-for-byte.
- [ ] Run focused and whole-package verification.
- [ ] Reconcile spec evidence, metadata, checklist, and strict validation.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Baseline/delta | Exact pass counts before and after | Existing package scripts and Node test runners |
| Registry/router | Four modes and permanent subworkflow targets | JSON assertions, parent-hub checker, command tests |
| Foundations | Procedures, relationship corpus, validators, auto/confirm parity | Existing foundations scripts/corpus |
| Audit | Scoring, reports, comparison corpus, fingerprint parity, shell gates | Existing audit scripts and fixtures |
| Generated artifacts | Leaf/advisor/compiled route freshness | Canonical generators, sync, and drift checkers |
| Frozen data | All tracked styles files | Git path list plus SHA-256 manifest |
| Documentation | Required files, anchors, metadata, checklist | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Canonical mode-consolidation research | Internal evidence | Green | Scope and topology rationale unavailable |
| Existing command/corpus/fingerprint gates | Internal verification | To baseline | Behavioral preservation cannot be proven |
| Compiled-route sync/generation | Internal generator | Available in dirty shared worktree | Generated consumer freshness must be isolated carefully |
| SpecKit validator and metadata scripts | Internal docs | Available | Packet cannot close |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any permanent command, corpus, fingerprint, Bash verifier, generated routing, exact-count, or styles invariant fails after a stage.
- **Procedure**: Restore only Packet 2 touched paths from the scoped pre-change Git state, recreate the original two peer directories, restore the six-row registry and old consumer paths, regenerate canonical metadata, and rerun the captured baseline commands. Never revert unrelated dirty files.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Baseline -> Foundations -> Audit -> Four-mode routing -> Generation -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline | None | All topology changes |
| Foundations | Baseline | Audit and registry contraction |
| Audit | Foundations green | Registry contraction |
| Routing/generation | Both moves green | Final verification |
| Verification | All implementation | Completion |
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline and inventory | High | 2-4 hours |
| Foundations migration | High | 3-5 hours |
| Audit migration | High | 4-6 hours |
| Routing and generation | High | 3-5 hours |
| Verification and reconciliation | High | 3-5 hours |
| **Total** | **High** | **15-25 hours** |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Implementation Checklist

- [ ] Capture scoped status and diff for every target path.
- [ ] Capture exact source file/accounting manifests.
- [ ] Capture tracked styles hashes and mode registry bytes.

### Rollback Procedure

1. Stop at the first failing stage and retain its command output.
2. Restore only paths listed in this packet from the pre-change Git content and recorded manifests.
3. Recreate the original six-mode authored topology and regenerate only its derived consumers.
4. Re-run the same stage baseline and compare pass counts.
5. Confirm styles hashes still match the pre-change manifest.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Repository path relocation only; no persistent user data or external deployment changes.
<!-- /ANCHOR:enhanced-rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
foundations source --+                         +-> command contracts
                     +-> design-interface -----+-> corpora/verifiers
audit source --------+                         +-> leaf manifest
                                                |
mode registry + router + metadata --------------+-> compiled routing consumers
styles hash manifest ------------------------------> unchanged proof
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline manifest | Current authored topology | Rollback and delta evidence | Relocation |
| Interface subworkflow doctrine | Hub/interface schemas | Valid permanent route targets | Mode-row removal |
| Foundations relocation | Doctrine and baseline | Interface-owned foundations | Registry contraction |
| Audit relocation | Foundations green and baseline | Interface-owned audit | Registry contraction |
| Metadata generation | Final authored topology | Live derived consumers | Completion gates |
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baseline and frozen manifests** - CRITICAL
2. **Foundations relocation and proof** - CRITICAL
3. **Audit relocation and proof** - CRITICAL
4. **Four-mode consumer regeneration** - CRITICAL
5. **Full verification and strict reconciliation** - CRITICAL

**Parallel Opportunities**: Live-consumer inventory and baseline commands may run in parallel; topology stages remain sequential for attributable rollback.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Status |
|-----------|-------------|------------------|--------|
| M1 | Baseline frozen | Counts, hashes, consumers, and pass totals recorded | Pending |
| M2 | Foundations embedded | Command and corpus behavior green from new path | Pending |
| M3 | Audit embedded | Scoring, reports, fingerprints, corpus, and Bash gates green | Pending |
| M4 | Four-mode hub generated | All authored and derived consumers show four modes | Pending |
| M5 | Packet verified | Full gates and strict SpecKit validation pass | Pending |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the complete record.

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Four hub modes plus two interface command subworkflows | Removes unnecessary identities without deleting capability |
| ADR-002 | Audit remains embedded, not standalone | User-approved architecture keeps one advisor identity and permanent command ownership |
| ADR-003 | Styles remain byte-unchanged | Topology cleanup does not justify data/service migration |
