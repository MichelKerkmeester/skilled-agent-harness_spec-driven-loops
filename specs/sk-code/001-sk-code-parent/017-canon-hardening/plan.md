---
title: "Implementation Plan: Phase 17 canon hardening"
description: "Plan for reconciling parent-hub bundleRules canon, sk-code reference naming/version cleanup, stale placeholder removal, and migration-safe validator hardening."
trigger_phrases:
  - "phase 017 implementation plan"
  - "canon hardening plan"
  - "bundleRules validator plan"
importance_tier: "high"
contextType: "implementation"
status: "Complete"
parent: "sk-code/001-sk-code-parent"
phase: "017"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/017-canon-hardening"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase executed; bundleRules canon reconciled, STRICT 0/0"
    next_safe_action: "124 rollup"
---
# Implementation Plan: Phase 17 canon hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON, Markdown, Node.js validator script |
| **Framework** | OpenCode parent-skill canon, sk-doc templates, system-spec-kit phase docs |
| **Storage** | Repository filesystem |
| **Testing** | `parent-skill-check.cjs` strict runs for sk-code and deep-loop-workflows, grep/read self-consistency checks |

### Overview
This phase plans a small but shared canon hardening pass. The implementation should first settle the canonical `bundleRules[]` shape, then update sk-code naming/version metadata, then run strict parent-skill checks with a baseline delta so deep-loop's known 26 failures do not increase.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Master plan phase 017 lines 38-47 reviewed and treated as scope lock.
- [x] Audit digest canon-gap and collision-risk evidence reviewed.
- [x] Current template, schema, validator, sk-code registry/router, and metadata files read before edits.
- [x] Baseline parent-skill-check result captured for sk-code and deep-loop-workflows.

### Definition of Done
- [x] Template, schema, and validator agree on the canonical `bundleRules[]` vocabulary.
- [x] Validator remains additive/tolerant for legacy aliases and absent rules.
- [x] sk-code uses `surfaces`, 4-part registry/router versions, and no stale placeholder metadata fields.
- [x] sk-code strict parent-skill-check remains green.
- [x] deep-loop strict failure count is unchanged or reduced.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Migration-safe schema hardening: publish one canonical shape while parsing legacy aliases during the transition.

### Key Components
- **Template**: `parent_skill_hub_router_template.json` teaches the copy-paste router scaffold.
- **Schema doc**: `parent_hub_router_schema.md` explains the public `hub-router.json` contract.
- **Validator**: `parent-skill-check.cjs` enforces check 5 without making migration-window hubs worse.
- **Reference hub**: sk-code demonstrates the canon through its registry, router, description, and graph metadata.

### Data Flow
The canonical shape flows from template and schema into hub-router files; the validator reads those hub-router files and verifies mode references against `mode-registry.json`. During migration, the validator should normalize canonical fields and legacy aliases before checking referenced modes.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `parent_skill_hub_router_template.json` | Template producer | Update bundleRules example to canonical fields | Read/grep for `whenPrimary` and `includeSurfaces` |
| `parent_hub_router_schema.md` | Schema producer | Keep examples and prose aligned with template | Read/grep bundleRules section |
| `parent-skill-check.cjs` | Validator consumer and enforcer | Normalize canonical fields plus aliases; validate referenced modes | Run parent-skill-check against sk-code and deep-loop |
| `sk-code/mode-registry.json` | Reference registry | Rename `surfacePackets` to `surfaces`; 4-part version | Read/JSON parse and parent-skill-check |
| `sk-code/hub-router.json` | Reference router | 4-part version; optional concrete bundleRules | Read/JSON parse and parent-skill-check |
| `sk-code/description.json` | Reference advisor metadata | Remove stale placeholder field | Grep for `internal design notes` |
| `sk-code/graph-metadata.json` | Reference graph metadata | Remove stale placeholder fields | Grep for `internal design notes` |

Required inventories:
- Same-class producers: search `bundleRules` across sk-doc parent-hub templates and schema docs.
- Consumers of changed fields: search validator and router replay consumers for `whenPrimary`, `includeSurfaces`, `primary`, `surfaces`, `modes`, and `evidence`.
- Matrix axes: canonical surface bundle, workflow bundle, legacy template fields, legacy validator fields, absent bundleRules.
- Validator invariant: unknown referenced modes fail or warn; legacy aliases do not create new failures by themselves.

<!-- /ANCHOR:affected-surfaces -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture parent-skill-check baseline for sk-code strict.
- [ ] Capture parent-skill-check baseline for deep-loop-workflows strict and record the current 26 failures.
- [ ] Read the three bundleRules authorities before editing: template, schema, validator.
- [ ] Read sk-code registry/router/metadata before editing.

### Phase 2: Core Implementation
- [ ] Update the template and schema to the canonical `bundleRules[]` shape.
- [ ] Update the validator to normalize canonical fields and legacy aliases before checking registry references.
- [ ] Rename sk-code `surfacePackets` to `surfaces`.
- [ ] Bump sk-code registry/router versions to 4-part release-hub versions.
- [ ] Remove the three stale `"internal design notes"` placeholder fields.
- [ ] Optionally add concrete sk-code and sk-design declarative surfaceBundle rules only after the canonical shape lands.

### Phase 3: Verification
- [ ] JSON-parse all changed JSON files.
- [ ] Run parent-skill-check strict for sk-code and require green.
- [ ] Run parent-skill-check strict for deep-loop-workflows and require failure count unchanged or reduced.
- [ ] Grep for stale bundleRules aliases and `"internal design notes"` placeholders.
- [ ] Update phase docs with verification evidence after execution.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| JSON validity | Changed JSON files | `node -e` or `jq` equivalent parser |
| Parent hub contract | sk-code | `PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-code` |
| Collision guard | deep-loop-workflows | `PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/deep-loop-workflows` and compare failure count |
| Canon consistency | Template/schema/validator | Grep/read for `bundleRules`, canonical fields, and tolerated aliases |
| Placeholder cleanup | sk-code metadata | Grep for `internal design notes` in the three named fields |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 011 parent-hub canon | Internal | Available | Provides the template/schema/validator baseline this phase hardens |
| Phase 016 sk-code content coherence | Internal | Parallel but dependent on naming decisions | Hub-root metadata refresh should use the post-017 field/version decisions |
| Phase 018 deep-loop alignment | Internal | Gated | This phase must not require deep-loop registry edits while live-agent refactor is active |
| Phase 019 validator promotion | Internal | Future | Hard promotion waits until all hubs pass |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: sk-code strict parent-skill-check fails after the hardening, or deep-loop strict failure count increases.
- **Procedure**: Revert only the phase 017 file changes, restore the prior validator parser and sk-code metadata, then rerun the same sk-code and deep-loop parent-skill-check commands to confirm baseline behavior returns.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Master plan and audit digest | Core implementation |
| Core implementation | Setup and source reads | Verification |
| Verification | Core implementation | Phase 015 declarative bundleRules, phase 016 hub-root refresh, phase 019 promotion |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Baseline checker runs and source inventory |
| Core Implementation | Medium | Seven focused files, one shared validator |
| Verification | High | Requires cross-hub before/after failure comparison |
| **Total** | | **Moderate shared-canon hardening** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline parent-skill-check outputs captured for sk-code and deep-loop-workflows.
- [ ] Changed file list limited to phase 017 scope.
- [ ] Validator change reviewed for alias tolerance.

### Rollback Procedure
1. Revert template/schema/validator changes from phase 017.
2. Revert sk-code registry/router version and `surfaces` field changes if they caused checker failure.
3. Revert placeholder removals only if a consumer unexpectedly requires them.
4. Re-run sk-code and deep-loop strict parent-skill-check commands.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Revert repository file edits only; no persisted data or generated metadata is part of this phase.

<!-- /ANCHOR:enhanced-rollback -->
---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Master plan + audit digest
          |
          v
Source inventory + checker baselines
          |
          v
BundleRules decision -> template/schema/validator update
          |
          v
sk-code naming/version/placeholder cleanup
          |
          v
sk-code strict pass + deep-loop fail-count guard
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| BundleRules decision | Template/schema/validator reads | Canonical field vocabulary | Template/schema/validator edits |
| Validator tolerance | BundleRules decision | Migration-safe check 5f | Cross-hub verification |
| sk-code cleanup | BundleRules decision and source reads | Canon reference metadata | Phase 016 hub-root refresh |
| Cross-hub verification | All edits | Confidence to proceed | Phase 019 promotion |

<!-- /ANCHOR:dependency-graph -->
---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Settle bundleRules vocabulary** - critical because phase 015 and phase 016 depend on the naming decision.
2. **Patch validator tolerantly** - critical because shared enforcement can affect all hubs.
3. **Run before/after parent-skill-check comparison** - critical because deep-loop failure count must not increase.

**Total Critical Path**: source reads -> vocabulary decision -> validator/template/schema patch -> sk-code cleanup -> cross-hub verification.

**Parallel Opportunities**:
- sk-code placeholder cleanup can run after source inventory while validator patch is reviewed.
- Grep/read consistency checks can run in parallel with JSON parsing after edits.

<!-- /ANCHOR:critical-path -->
---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Canon vocabulary selected | `decision-record.md` decision matches planned edits | Before implementation |
| M2 | Shared sources aligned | Template, schema, and validator speak one shape | Core implementation |
| M3 | Reference hub cleaned | sk-code naming, versions, and placeholder fields match canon | Core implementation |
| M4 | Collision guard passed | sk-code green and deep-loop failure count not increased | Verification |

<!-- /ANCHOR:milestones -->
---

<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Read the master plan phase 017 section and audit digest before edits.
- Read every target file before modifying it.
- Capture sk-code and deep-loop parent-skill-check baselines before validator edits.
- Confirm the changed file list remains inside the planned seven-file execution scope.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Scope lock | Do not modify deep-loop files in this phase |
| Validator safety | Add tolerant alias parsing before adding stricter bundleRules checks |
| Evidence | Record command output for sk-code pass and deep-loop failure-count comparison |
| Documentation | Keep tasks and checklist unchecked until execution evidence exists |

### Status Reporting Format

Use this format after implementation starts:

```text
Phase 017 status: [planned|in-progress|blocked|verified]
Changed files: [paths]
sk-code strict: [pass/fail + command]
deep-loop strict delta: [baseline -> current]
Next safe action: [one task id]
```

### Blocked Task Protocol

If strict sk-code fails or deep-loop failure count increases, stop phase execution, keep the failing diff intact for inspection, and report the exact command, exit code, and failing checks before proposing a rollback or narrower validator change.

<!-- /ANCHOR:ai-execution -->
---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Single bundleRules shape

**Status**: Proposed for execution

**Context**: The current canon sources disagree on bundleRules fields. The phase will use the schema's explicit `whenPrimary` and `includeSurfaces` shape as the canonical form and keep legacy aliases tolerant in the validator.

**Decision**: See `decision-record.md`.

**Consequences**:
- Template and schema become easier to copy.
- Validator gains normalization logic but does not punish in-flight hubs for legacy aliases.

**Alternatives Rejected**:
- Keep all three shapes active as peers: rejected because it preserves the canon gap this phase exists to close.
