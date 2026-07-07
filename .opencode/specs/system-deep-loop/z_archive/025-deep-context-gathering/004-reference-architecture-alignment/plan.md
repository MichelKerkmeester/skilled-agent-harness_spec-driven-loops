---
title: "Implementation Plan: deep-context reference-architecture alignment"
description: "Align the deep-context reference layout and smart-router to deep-research: move the two flat references into convergence/ and protocol/ subfolders, author eight new lean references extracted from the loop YAML/scripts/runtime, rewrite SKILL.md §2 to the canonical router, and sweep ~62 old-flat-path citations to the new subfolder paths, with zero loop-behavior change."
trigger_phrases:
  - "reference alignment plan"
  - "smart router rewrite plan"
  - "reference subfolder move"
  - "citation sweep plan"
  - "sibling layout parity"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/025-deep-context-gathering/004-reference-architecture-alignment"
    last_updated_at: "2026-06-07T09:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-3 plan for the reference-architecture-alignment phase"
    next_safe_action: "Execute the reference move + 8 new refs + router rewrite + citation sweep"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/SKILL.md"
      - ".opencode/skills/deep-context/references/convergence.md"
      - ".opencode/skills/deep-research/SKILL.md"
    session_dedup:
      fingerprint: "sha256:db845e0d74e2f0decc7e374fefdc3ca128789fc7e931a977111fcaf95099955f"
      session_id: "dc-134-004-20260607"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions:
      - "Mirror deep-research's 4-subfolder layout; MOVE the two flat files"
      - "Keep references lean and cross-linked to feature_catalog, no duplication"
---
# Implementation Plan: deep-context reference-architecture alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (references, SKILL.md, README), Python (router pseudocode), YAML (workflow `references_map`), JSON (graph-metadata) |
| **Framework** | deep-research reference layout as the structural template; the sk-doc smart-router resilience template |
| **Storage** | Skill `references/` tree + `graph-metadata.json` + the skill-advisor graph |
| **Testing** | sk-doc structure validators; router path-resolution check; `rg` citation-completeness; `deep-loop-runtime` vitest regression; advisor reindex; `validate.sh --strict` on the packet |

### Overview
This phase aligns deep-context's reference layer and smart-router to its mature sibling `deep-research`. It moves `references/convergence.md` into `references/convergence/` and `references/loop_protocol.md` into `references/protocol/`, authors eight new lean references across `convergence/`, `state/`, and `guides/` (each extracted from the loop YAML, scripts, and runtime, and cross-linked to its `feature_catalog/0N` counterpart), rewrites `SKILL.md` §2 SMART ROUTING to the canonical `{weight, keywords}` / subfoldered-`RESOURCE_MAP` / `ALWAYS=quick_reference` pattern with §3 trimmed to pointers, updates the README structure, and sweeps roughly 62 old-flat-path citations across the skill docs, command docs, workflow YAMLs, and the agent doc. No loop behavior changes: no `.cjs` script or runtime helper is edited.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, phase-parent spec.md)
- [x] Success criteria measurable (SC-001..SC-003 in spec.md)
- [x] Dependencies identified (deep-research layout, sk-doc validators, runtime source surface, advisor graph)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..REQ-008)
- [ ] Verification passing (sk-doc structure validators, router path-resolution, zero old-flat-path citations, vitest regression, advisor reindex)
- [ ] Docs authored (spec/plan/tasks/checklist/decision-record/implementation-summary)
- [ ] Lean + cross-linked references confirmed (no feature_catalog duplication; ADR-003)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sibling-mirrored reference layout plus the canonical sk-doc smart-router: `references/` is partitioned into `convergence/ guides/ protocol/ state/` subfolders exactly as `deep-research`, and `SKILL.md` §2 runs the shared router (runtime discovery, weighted intent scoring, guarded existence-checked loading, multi-tier fallback). The new references are thin pointers into the existing `feature_catalog/`, not a second copy of it.

### Key Components
- **convergence/**: `convergence.md` (moved), `convergence_signals.md`, `convergence_recovery.md`, `convergence_graph.md` - the stop contract, the five signals + composite weights + thresholds, blocked-stop/stuck recovery, and the coverage-graph stop path.
- **protocol/**: `loop_protocol.md` (moved) - iteration lifecycle, parallel dispatch, host-writes-state, merge.
- **state/**: `state_format.md`, `state_jsonl.md`, `state_outputs.md`, `state_reducer_registry.md` - the packet file hub, JSONL record types, the markdown/Context-Report outputs, and `reduce-state.cjs` ownership.
- **guides/**: `quick_reference.md` - the operator cheat sheet and the new `ALWAYS` router baseline.
- **SKILL.md §2**: canonical `INTENT_SIGNALS {weight, keywords}`, `RESOURCE_MAP` → new subfolder paths, `LOADING_LEVELS` (`ALWAYS` + `ON_DEMAND`), shared helpers, `UNKNOWN_FALLBACK_CHECKLIST`.

### Data Flow
At skill invocation the router discovers markdown under `references/` and `assets/`, scores the request against `INTENT_SIGNALS`, loads `references/guides/quick_reference.md` as the `ALWAYS` baseline, then loads the intent-mapped subfolder references via the guarded existence-checked loader; low-confidence requests return the `UNKNOWN_FALLBACK_CHECKLIST`. Each new reference points the reader onward to its `feature_catalog/0N` counterpart for full implementation detail.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches reference paths cited across the skill, command, workflow, and agent surfaces, so the affected-surface inventory applies even though no runtime behavior changes.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `references/convergence.md`, `references/loop_protocol.md` | Flat reference files | move into `convergence/` and `protocol/` | `find references -type f` shows subfoldered layout; no root file |
| 8 new references | (new) lean references mirroring deep-research | create from runtime source, cross-linked | sk-doc structure validator green on each; no feature_catalog duplication |
| `SKILL.md` §2/§3/§5/§9 | Non-canonical router + flat reference tables | rewrite §2, trim §3, repath §5/§9 | router resolves every `RESOURCE_MAP` path; sk-doc structure validator green |
| `README.md` | Structure tree + reference table at flat paths | update count, tree, table | no flat-path remains; structure matches the new tree |
| `feature_catalog/**`, `manual_testing_playbook/**` | Cite the flat reference paths | repath citations | `rg` old-flat-path returns zero in these trees |
| `commands/deep/start-context-loop.md` + 2 YAMLs | Command doc + `references_map` at flat paths | repath citations | `rg` old-flat-path returns zero; YAML `references_map` resolves |
| `agents/deep-context.md` | Agent doc citing flat paths | repath citations | `rg` old-flat-path returns zero |
| `graph-metadata.json` + skill advisor | Index the flat reference paths | regenerate + reindex | advisor resolves deep-context with new paths |
| `scripts/*.cjs`, `deep-loop-runtime/**` | Loop runtime + reducer | unchanged | no edit; vitest regression suite green |

Required inventories:
- Same-class producers (citation sites): `rg -n "references/convergence\.md|references/loop_protocol\.md" .opencode/skills/deep-context .opencode/commands/deep .opencode/agents/deep-context.md`.
- Consumers of changed paths: the router `RESOURCE_MAP`, the README structure tree, the workflow `references_map`, and every `feature_catalog`/`manual_testing_playbook` cross-link.
- Matrix axes: reference (moved x new) x surface (skill docs | command docs | workflow YAML | agent doc | metadata) - every surface that cites a reference path gets a row.
- Algorithm invariant: the move is content-preserving and the sweep is path-only; loop behavior is unchanged by construction, verified by the unedited `.cjs`/runtime and a green vitest suite.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm deep-research's subfolder layout and canonical router as the structural template
- [ ] Confirm the runtime source surface (loop YAML, `convergence.cjs`, `coverage-graph-signals.ts`, `reduce-state.cjs`, `loop-lock.cjs`) and the `feature_catalog/0N` counterparts each new reference will cross-link
- [ ] Confirm the old-flat-path citation inventory (~62 hits across the sweep scope)

### Phase 2: Core Implementation
- [ ] Move `references/convergence.md` → `references/convergence/convergence.md` and `references/loop_protocol.md` → `references/protocol/loop_protocol.md`
- [ ] Author the 3 convergence references (`convergence_signals.md`, `convergence_recovery.md`, `convergence_graph.md`)
- [ ] Author the 4 state references (`state_format.md`, `state_jsonl.md`, `state_outputs.md`, `state_reducer_registry.md`)
- [ ] Author the guide reference (`guides/quick_reference.md`)
- [ ] Rewrite `SKILL.md` §2 to the canonical router; trim §3 to pointers; repath §5/§9 reference tables
- [ ] Update README structure (count, tree, reference table)
- [ ] Sweep all ~62 old-flat-path citations to the new subfolder paths
- [ ] Regenerate `graph-metadata.json` and reindex the skill advisor

### Phase 3: Verification
- [ ] sk-doc structure validator green on every new reference and the rewritten `SKILL.md`
- [ ] Router resolves every `RESOURCE_MAP` path against the new inventory
- [ ] `rg` old-flat-path returns zero hits in the deep-context sweep scope
- [ ] No-duplication review vs the feature_catalog
- [ ] `deep-loop-runtime` vitest regression suite green; advisor resolves deep-context
- [ ] `validate.sh --strict` on the packet passes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | sk-doc structure of each new reference + rewritten SKILL.md | sk-doc structure validator |
| Static | Citation completeness (zero old-flat-path in sweep scope) | `rg` |
| Static | Router path resolution against the new inventory | manual resolve of each `RESOURCE_MAP` path |
| Regression | Loop behavior unchanged | `deep-loop-runtime` vitest suite |
| Integration | Advisor resolves deep-context with new paths | skill-advisor reindex + resolve |
| Manual | No-duplication vs feature_catalog | reviewer read of each new reference against its `feature_catalog/0N` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| deep-research reference layout | Internal | Green | No structural template; layout must be designed from scratch |
| sk-doc structure validators | Internal | Green | New references cannot be gated for structure |
| deep-loop-runtime source surface | Internal | Green | References cannot be extracted accurately from source |
| deep-context feature_catalog | Internal | Green | No cross-link target; references risk duplicating detail |
| skill-advisor graph + graph-metadata schema | Internal | Green | New reference paths do not resolve in the advisor |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The router rewrite resolves wrong/missing resources, or the citation sweep leaves the reference graph inconsistent.
- **Procedure**: Move the two references back to the root (`references/convergence.md`, `references/loop_protocol.md`), delete the eight new references, revert `SKILL.md` §2/§3/§5/§9 and the README structure to the flat layout, revert the citation sweep, and regenerate `graph-metadata.json`. No `.cjs` or runtime file changed, so loop behavior is unaffected by the rollback.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: confirm template + source surface + citation inventory) ──► Phase 2 (Core: move + 8 refs + router + README + sweep + metadata) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (confirm template + source surface + inventory) | Low | 1-2 hours |
| Core Implementation (move + 8 references + router + README + sweep + metadata) | Med | 5-8 hours |
| Verification (validators + path resolution + grep + vitest + reindex + validate.sh) | Low | 1-2 hours |
| **Total** | | **7-12 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The two moved files preserved verbatim (content-loss-free move)
- [ ] Every new reference cross-links its feature_catalog counterpart (no duplication)
- [ ] No `.cjs` or runtime helper touched

### Rollback Procedure
1. Move `references/convergence/convergence.md` and `references/protocol/loop_protocol.md` back to the `references/` root.
2. Delete the eight new references and the now-empty `convergence/`, `state/`, `guides/` subfolders (keep `protocol/` only if `loop_protocol.md` stays moved).
3. Revert `SKILL.md` §2/§3/§5/§9 and the README structure to the flat layout, and revert the citation sweep across all surfaces.
4. Regenerate `graph-metadata.json` and reindex the advisor against the reverted layout.

### Data Reversal
- **Has data migrations?** No. This phase moves and authors documentation and rewrites routing; it changes no schema and no runtime data.
- **Reversal procedure**: None beyond the file-level rollback above; the skill-advisor graph is rebuilt from the reverted files.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│ confirm     │     │ move + refs │     │   Verify    │
│ template +  │     │ + router +  │     │ validators  │
│ source      │     │ sweep + meta│     │ + vitest    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │ Phase 2b  │
                    │ citation  │
                    │ sweep +   │
                    │ metadata  │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| deep-research layout + router template | None | Structural target | Move + new references + router rewrite |
| Reference move | Layout target | Subfoldered moved files | Citation sweep, router `RESOURCE_MAP` |
| 8 new references | Runtime source + feature_catalog | Lean cross-linked references | Router `RESOURCE_MAP`, README, validators |
| SKILL.md §2 rewrite | Moved + new references | Canonical router | Router path-resolution check |
| Citation sweep | All moves complete | Zero old-flat-path | Completeness gate, advisor reindex |
| Metadata regen + reindex | Sweep complete | Resolving advisor graph | Final verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Confirm the deep-research layout + router template and the runtime source surface** - 1-2 hours - CRITICAL
2. **Move the two references + author the eight new references** - 3-5 hours - CRITICAL
3. **Rewrite SKILL.md §2 router + sweep all citations + regenerate metadata** - 2-4 hours - CRITICAL

**Total Critical Path**: 6-11 hours

**Parallel Opportunities**:
- The eight new references can be authored in parallel once the move and the source surface are confirmed; the README structure update can proceed alongside the SKILL.md rewrite.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Layout aligned | `references/` matches deep-research's subfolder shape; the two flat files moved; eight new references exist | Phase 2 |
| M2 | Router canonical | SKILL.md §2 rewritten to `{weight, keywords}` / subfoldered-`RESOURCE_MAP` / `ALWAYS=quick_reference`; §3 trimmed | Phase 2 |
| M3 | Citations + metadata clean | zero old-flat-path in the sweep scope; `graph-metadata.json` regenerated; advisor resolves; vitest green | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Full mirror that MOVES the two flat references into subfolders

**Status**: Accepted

**Context**: deep-context shipped two flat reference files while every mature sibling uses subfoldered references with no root-level reference file. The options were to add subfolders additively (keeping the flat copies), or to move the two files into subfolders for a true mirror.

**Decision**: Fully mirror the sibling layout by MOVING `convergence.md` into `convergence/` and `loop_protocol.md` into `protocol/`, leaving no root-level reference file. Full detail and the other two decisions live in `decision-record.md`.

**Consequences**:
- The reference tree reads as a true peer of deep-research, with one canonical location per reference and no flat/subfolder ambiguity.
- Every consumer must be repathed in one sweep; a missed citation is the main risk, gated by a zero-hit completeness check.

**Alternatives Rejected**:
- Additive subfolders keeping the flat copies: leaves two locations for the same reference and diverges from the siblings, which carry no root-level reference file.

---
<!--
LEVEL 3 PLAN
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records (full set in decision-record.md)
-->
