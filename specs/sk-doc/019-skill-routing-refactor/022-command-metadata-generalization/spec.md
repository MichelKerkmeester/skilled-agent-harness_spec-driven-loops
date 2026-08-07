---
title: "Feature Specification: Command Metadata as a Hub Standard"
description: "Graduate command-metadata.json from an sk-design-only overlay to a class-H requirement: a hub-agnostic core schema, a root-enumerating validator inside the fleet gate, authored command surfaces for every hub (empty array when a hub owns no commands), scaffolder support, and canonical doctrine."
trigger_phrases:
  - "command metadata standard"
  - "every hub command metadata"
  - "command metadata core schema"
  - "hub command surface validation"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/022-command-metadata-generalization"
    last_updated_at: "2026-07-28T13:08:48Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the packet scaffold alongside the build"
    next_safe_action: "Verify gates and land"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-command-metadata-generalization"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "The fleet gate is the root-enumerating consumer that made generalization legitimate"
      - "The registry names /doc:quality but no definition file exists; the entry is deliberately omitted"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Command Metadata as a Hub Standard

---

## EXECUTIVE SUMMARY

`command-metadata.json` existed on exactly one hub, validated by four sk-design-specific programs, while three other hubs owned slash commands documented only in prose. The predecessor packet deliberately scoped it as an overlay because no consumer enumerated roots — copying the file would have produced data nothing reads. The operator directed that every hub carry it as the standard. This packet makes that legitimate rather than cosmetic: a hub-agnostic core schema, validation inside the fleet gate (which already enumerates every root), authored command surfaces for all seven hubs, scaffolder support so new hubs start conforming, and the contract flipped from overlay to class-H requirement.

**Key Decisions**: The core schema is a strict subset of sk-design's existing shape, so the richest file passes unchanged and hub-specific extension fields stay legal. A hub with no commands declares `[]` — presence is uniform, content is honest.

**Critical Dependencies**: The predecessor packet's class contract and fleet gate; the mode registries as the owner-mode authority.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-28 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Only sk-design's two commands had machine-checked contracts: argument grammar, routing signals, and load choreography as validated data. The other command-owning hubs — sk-doc with eleven `/create:*` commands and system-deep-loop with eight `/deep:*` commands, the most complex and most drift-bitten command surfaces in the repo — declared their commands only as registry vocabulary and prose. Nothing verified that a command's documented load order still resolved on disk, that its owner mode still existed, or that two commands did not claim the same routing phrase.

The blocker to fixing this was principled: the contract's own rule says an extension never ships without a reader, and no reader enumerated roots. Generalizing by copying would have recreated the dead-file drift the contract eliminated.

### Purpose

Give the file a root-enumerating consumer — the fleet gate — and a hub-agnostic core schema, then require it on every hub. Commands become checkable data everywhere; hubs without commands state that explicitly with an empty array.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A pure core-schema validator: `command`, `ownerMode`, `description`, `argumentHint`, `userIntent{job, ownedSignals[]}`, `choreography[{order, skill, resource, action}]`; unknown extension fields legal; command ids and owned signals unique per file.
- Fleet-gate integration for class-H roots: registry-bound owner modes, on-disk choreography resources, command definition files under `.opencode/commands/`, `COMMAND_METADATA_*` violation codes.
- Contract flip: required for H, forbidden for S (entries bind to registry modes S lacks); overlay set now empty with the mechanism retained.
- Authored files for six hubs (sk-design's existing file untouched): sk-doc 11 entries, system-deep-loop 8, sk-prompt 1, and `[]` for cli-external-orchestration, mcp-tooling, sk-code.
- Scaffolder: the parent-hub path writes `[]`; canonical doc, SKILL.md workflow, and READMEs updated; tests extended.

### Out of Scope

- Advisor scoring changes that consume owned signals (a future consumer; the data now exists for it).
- sk-design's extension fields and its four richer validators — they layer above the core untouched.
- The registry's `/doc:quality` declaration, which names a command with no definition file anywhere; the entry is deliberately omitted and the inconsistency recorded here rather than papered over.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs` | Create | Pure core-schema validator with caller-injected existence probes |
| `.opencode/skills/sk-doc/create-skill/scripts/lib/skill-root-metadata-contract.cjs` | Modify | H-required, S-forbidden, overlay set emptied |
| `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs` | Modify | Per-hub command-metadata validation with disk resolution |
| `.opencode/skills/{sk-doc,system-deep-loop,sk-prompt}/command-metadata.json` | Create | Authored command surfaces (11 + 8 + 1 entries) |
| `.opencode/skills/{cli-external-orchestration,mcp-tooling,sk-code}/command-metadata.json` | Create | Empty declarations |
| `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py` | Modify | Parent scaffold writes the empty declaration |
| `.opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md` | Modify | Matrix, rationale, violation codes, adding-a-root; version 1.1.0.0 |
| `.opencode/skills/sk-doc/create-skill/SKILL.md`, `scripts/README.md`, `scripts/lib/README.md` | Modify | Workflow step and catalog rows |
| `.opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` | Modify | H-required / S-forbidden / uniform-across-hubs coverage |
| `.opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs` | Modify | Fixture hub carries the empty declaration |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Core schema validates every hub's file inside the fleet gate | Gate reports `COMMAND_METADATA_*` on seeded mutations (unknown owner mode, missing resource) and passes the real fleet |
| REQ-002 | sk-design's existing file passes unchanged | Byte-identical file, gate `OK` — proving core ⊂ existing shape |
| REQ-003 | Every hub carries the file | Fleet gate 11/11 with all seven H roots validated |
| REQ-004 | Scaffolded hubs conform from the first command | `init_skill.py --kind parent` output passes the gate with `--fix` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Authored entries are faithful to their command docs | Owner modes match the registry; descriptions/hints sourced from command frontmatter; choreography paths resolve |
| REQ-006 | Canonical doctrine updated with no stale overlay claims | Contract doc v1.1.0.0; no create-skill text still calls the file an sk-design overlay |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Fleet gate 11/11 with per-hub command validation; deliberate mutations are caught.
- **SC-002**: All test suites (create-skill 5/5, doctor) and the sk-code drift guards pass.
- **SC-003**: A scaffolded parent hub and standalone skill both pass the gate end-to-end.
- **SC-004**: Cross-model verification (LUNA authors, SOL adversarial review) returns no unrefuted P0/P1.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Authored signals overlap across hubs and confuse routing later | M | Uniqueness is enforced per file now; cross-hub uniqueness becomes checkable the day the advisor consumes the data |
| Risk | Choreography paths rot as packets move | L | The gate resolves them on every run; rot is a build failure, not a silent lie |
| Dependency | Predecessor class contract and fleet gate | H | This packet extends them in place; their tests still pass |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- RESOLVED: `/doc:quality` is registry vocabulary with no definition file — omitted from sk-doc's surface and recorded as a pre-existing inconsistency for the registry's owner to resolve.
- Future: should the advisor score `ownedSignals` for command-level routing? The data now exists; that consumer is deliberately out of scope.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Predecessor**: `../021-skill-metadata-json-unification/spec.md`
- **Canonical contract**: `.opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `021-skill-metadata-json-unification` |
| **Successor** | none |
