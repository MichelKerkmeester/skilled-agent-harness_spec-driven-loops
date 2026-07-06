---
title: "Implementation Plan: Phase 002 — Parent Hub Compatibility Shell"
description: "Completed Level 2 plan for adding parent hub manager behavior while preserving sk-design routing identity, mode registry authority, proof gates, and transport-vs-taste separation."
trigger_phrases:
  - "implementation plan"
  - "parent hub compatibility shell"
  - "sk-design manager shell"
  - "mode registry"
importance_tier: "high"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-design/009-sk-design-claude-parity/002-parent-hub-compatibility-shell/"
    last_updated_at: "2026-07-05T22:14:30Z"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Closed hub shell plan."
    next_safe_action: "Start Phase 003 procedure cards."
---
# Implementation Plan: Phase 002 — Parent Hub Compatibility Shell

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | OpenCode `sk-design` parent hub behavior |
| **Primary Area** | `.opencode/skills/sk-design/SKILL.md` and registry-adjacent hub contract after Phase 001 gates close |
| **Spec Level** | 2 |
| **Testing** | Strict spec validation, router/registry preservation, negative controls, proof-gate review |
| **Mutation Policy** | One approved hub edit in `.opencode/skills/sk-design/SKILL.md`; Phase 002 docs and metadata updated |

### Overview
This plan executed the parent hub compatibility shell at the `sk-design` hub boundary without changing the public skill model. The shell introduces context-first intake, a visible plan, proof gates, verifier cadence, and a durable transport-vs-taste boundary while preserving the single `sk-design` advisor identity and mode-registry routing.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 002 documentation scope is explicit and confined to this folder for this authoring task. Evidence: `spec.md` scope names Phase 002 docs plus `.opencode/skills/sk-design/SKILL.md` as the writable implementation scope.
- [x] Parent shell goal is documented in `spec.md`. Evidence: `spec.md` problem and purpose sections define the parent hub manager shell.
- [x] Phase 001 gates have passed strict validation and ownership closure. Evidence: Phase 001 checklist records 9/9 P0, 12/12 P1, 1/1 P2 verified and gate status closed.
- [x] Existing `sk-design` hub and mode registry state have been inspected after Phase 001 closure. Evidence: read `.opencode/skills/sk-design/SKILL.md`, `mode-registry.json`, and `hub-router.json` before editing.
- [x] Canonical router/registry verification command is named. Evidence: `benchmark/README.md` command ran to `/tmp/skd-bench/report.json`.

### Definition of Done
- [x] Parent hub shell contract is implemented in the approved hub location. Evidence: `.opencode/skills/sk-design/SKILL.md` sections 2, 4, 6, and 7.
- [x] Single `sk-design` advisor identity is preserved. Evidence: `Glob("**/graph-metadata.json", .opencode/skills/sk-design)` returned only the root graph metadata file.
- [x] Existing public mode registry remains routing authority. Evidence: `git diff -- .opencode/skills/sk-design/mode-registry.json .opencode/skills/sk-design/hub-router.json` returned no output.
- [x] Context-first intake, visible plan, proof gates, and verifier cadence are present. Evidence: `SKILL.md` has `Manager Intake Before Routing`, `Visible Plan Before Design or Build Work`, and `Proof Gates and Verifier Cadence`.
- [x] Transport-vs-taste separation is documented and enforced. Evidence: `SKILL.md` section 7 states transports are evidence/mechanics, not acceptance authority.
- [x] Negative controls prove no 14 public skill mirror was introduced. Evidence: no new public modes, no mode-packet graph metadata, and no registry/router diff.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parent hub compatibility shell: the parent hub owns manager choreography and delegates to existing mode packets through registry-backed routing. It does not become a transport layer and does not create public procedure identities.

### Key Components
- **Intake Contract**: Required user/context/design inputs before routing.
- **Visible Plan Contract**: Short user-visible plan before design, implementation, or transport work proceeds.
- **Proof Gate Contract**: Evidence fields for design judgment, accessibility, responsive behavior, and requested transport checks.
- **Verifier Cadence**: Named points where validation or review must run before release claims.
- **Registry Boundary**: The existing mode registry stays the source of public route truth.
- **Negative Controls**: Explicit checks that prevent public skill mirroring, registry bypass, and transport-owned taste.

### Data Flow
1. Confirmed Phase 001 gates are closed and implementation is allowed.
2. Inspected current parent hub, mode registry, and hub router without mutating unrelated files.
3. Drafted the parent shell contract against existing hub/router structure.
4. Added context-first intake and visible plan behavior at the hub boundary.
5. Added proof gate and verifier cadence language that routes to existing modes and verification tools.
6. Ran registry preservation and negative-control checks before claiming behavior is ready.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Entry Gate and Current Hub Review
- [x] Verify Phase 001 P0 gates are closed with evidence. Evidence: Phase 001 checklist summary records closed gate and Phase 001 implementation summary names Phase 002 as next safe action.
- [x] Read the current `sk-design` parent hub and mode registry. Evidence: `SKILL.md`, `mode-registry.json`, and `hub-router.json` read before edits.
- [x] Record any logic-sync conflict before writing. Evidence: no conflict found; live registry matched the user-provided grounding facts.

### Phase 2: Compatibility Shell Contract
- [x] Define required intake fields and visible plan behavior. Evidence: `SKILL.md` section 2.
- [x] Define proof fields and verifier cadence. Evidence: `SKILL.md` section 2.
- [x] Define negative rules for public identity and transport boundaries. Evidence: `SKILL.md` section 4 and section 7.

### Phase 3: Registry Preservation
- [x] Confirm existing public modes remain the route surface. Evidence: `mode-registry.json` lists `interface`, `foundations`, `motion`, `audit`, and `md-generator`.
- [x] Preserve mode-registry as route authority. Evidence: scoped registry/router diff returned no output.
- [x] Avoid adding public skill identities or duplicated mode maps. Evidence: one root graph metadata file and no mode-packet graph metadata files.

### Phase 4: Verification and Handoff
- [x] Run strict validation for this phase docs after authored changes. Evidence: final command and exit code are recorded in `implementation-summary.md` after metadata regeneration.
- [x] Run later router/registry preservation checks after implementation. Evidence: benchmark output `/tmp/skd-bench/report.json`, verdict `CONDITIONAL`, aggregate `69`, D5 `100`, gate failed `false`.
- [x] Update checklist with evidence or approved deferrals. Evidence: `checklist.md` P0/P1 rows are checked with concrete file/command evidence.
- [x] Hand off private procedure-card detail to Phase 003. Evidence: `implementation-summary.md` continuation notes.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Phase docs structure and required metadata | `validate.sh --strict` |
| Entry gate review | Phase 001 closure and go/no-go state | Phase 001 checklist and implementation-summary evidence |
| Registry preservation | Public routing remains registry-backed | Canonical router/registry check named during implementation |
| Negative controls | No 14 public skill mirror, no registry bypass, no transport-owned taste | File inventory and content review |
| Proof cadence review | Context-first intake, visible plan, proof gates, verifier cadence | Hub shell contract review |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 closure | Governance | Closed | Phase 002 implementation unblocked |
| Current `sk-design` hub shape | Evidence | Inspected | Shell targeted live hub structure |
| Mode registry | Architecture | Preserved unchanged | Public routing did not drift or duplicate |
| Transport skills/tools | Boundary | Transport-only boundary documented | Design judgment remains in `sk-design` |
| Phase 003 private procedure cards | Follow-on | Deferred explicitly | Shell avoids private card schema detail |
| Strict spec validation | Documentation | Re-run after metadata regeneration | Result recorded in `implementation-summary.md` |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase 001 has not passed, public identity changes are introduced, mode-registry routing is bypassed, or transport tooling starts owning design taste decisions.
- **Procedure**: Stop implementation; inspect `git diff` and `git status` first; revert or remove only Phase 002 shell changes after explicit approval; preserve unrelated user and sibling-phase work.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 001 Gate ──> Hub Review ──> Shell Contract ──> Registry Preservation ──> Verification Handoff
       │                                                                           │
       └──────────── blocks all sk-design implementation until evidenced ──────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 001 Gate | Phase 001 checklist and summary evidence | All Phase 002 implementation |
| Hub Review | Phase 001 Gate | Shell Contract |
| Shell Contract | Hub Review | Registry Preservation, verifier cadence |
| Registry Preservation | Shell Contract, current registry | Verification Handoff |
| Verification Handoff | Registry Preservation | Phase 003 procedure-card detail |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Entry Gate and Hub Review | Low | 20-40 minutes |
| Compatibility Shell Contract | Medium | 45-90 minutes |
| Registry Preservation | Medium | 30-60 minutes |
| Verification and Handoff | Medium | 30-75 minutes |
| **Total** | | **2-4.5 hours after Phase 001 closure** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [x] Phase 001 P0 gates are closed. Evidence: Phase 001 checklist summary records gate status closed.
- [x] Current hub and registry files are read before edit. Evidence: `SKILL.md`, `mode-registry.json`, and `hub-router.json` were read before the hub patch.
- [x] Public identity preservation criteria are recorded. Evidence: `spec.md`, `checklist.md`, and `decision-record.md` record one-root-graph-metadata and no-public-micro-skill criteria.
- [x] Non-destructive rollback path is named. Evidence: rollback procedure starts with `git diff` and `git status` inspection.
- [x] Negative controls are ready before implementation. Evidence: checklist rows CHK-010, CHK-011, CHK-021, CHK-030, and CHK-031 are checked with evidence.

### Rollback Procedure
1. **Immediate**: Stop hub-shell implementation and preserve current worktree state.
2. **Document**: Record which invariant failed: Phase 001 gate, public identity, registry authority, proof cadence, or transport boundary.
3. **Preserve**: Avoid stash/reset/revert until unrelated work ownership is clear.
4. **Recover**: Remove or revise only the shell change after approval.
5. **Re-verify**: Re-run registry preservation and negative controls before resuming.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Documentation-only changes can be removed by deleting this phase folder; later hub edits must be reverted only after preserving unrelated user work.

<!-- /ANCHOR:l2-rollback -->
