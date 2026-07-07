---
title: "Feature Specification: Phase 15 sk-design canon alignment"
description: "Forward-looking Level 2 plan for closing sk-design parent-hub canon gaps, adding missing hub companion artifacts, and producing the Lane-C baseline while preserving the already-pushed packetKind repair."
trigger_phrases:
  - "sk-design canon alignment"
  - "sk-design parent hub benchmark"
  - "transform verbs bundle rules"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/015-sk-design-canon-alignment"
    last_updated_at: "2026-07-05T09:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase executed; STRICT 0 failures"
    next_safe_action: "None for this phase — proceed to phase 018 (deep-loop canon alignment)."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/changelog/"
      - ".opencode/skills/sk-design/description.json"
      - ".opencode/skills/sk-design/manual_testing_playbook/"
      - ".opencode/skills/sk-design/benchmark/"
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/design-interface/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-015-doc-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - question: "Is packetKind still in scope?"
        answer: "No. packetKind on all five sk-design modes is already done and pushed in commit f8673ff0db; this phase records it as completed evidence only."
      - question: "Ship prose-only transform-verb routing before phase 017, or wait for declarative bundleRules?"
        answer: "Waited: phase 017 landed the canon shape first, then ui-build-bundle was encoded declaratively (whenAll interface+foundations, orderedBundle) in commit 5a6765c9b1; check 5f validates it."
---
# Feature Specification: Phase 15 sk-design canon alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Progress** | 100% — all canon gaps closed; STRICT parent-skill-check 0 failures |
| **Created** | 2026-07-05 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent** | `.opencode/specs/sk-code/017-sk-code-parent/` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The master plan reports that `parent-skill-check` strict mode leaves sk-design with four remaining parent-hub invariant failures after the five-mode `packetKind` repair was already pushed in commit `f8673ff0db`. The audit digest confirms the unresolved strict failures are symlinked hub changelog entries, missing hub `description.json`, missing hub `manual_testing_playbook/`, and missing hub `benchmark/` baseline, with additional P1/P2 canon alignment work around transform verbs and a broken interface README link.

### Purpose
Plan the remaining safe-now sk-design canon alignment work so execution can close the sk-design hub gaps without touching unrelated phases, while explicitly sequencing declarative `bundleRules` after the phase 017 canon reconciliation.

### Evidence Base

| Source | Evidence | Scope Impact |
|--------|----------|--------------|
| Master plan lines 17-26 | Phase 015 is safe-now Level 2 and lists the sk-design deliverables plus strict verification | Defines authoritative deliverables and verification gate |
| Audit digest lines 7-10 | sk-design has 4 P0, 3 P1, and 3 P2 findings; strict failures are checks 7a, 8a, 9a, and 9b | Confirms unresolved strict parent-hub failures |
| Audit digest lines 124-142 | P0-9 through P0-12 name the symlink, description, playbook, and benchmark fixes | Maps P0 requirements to concrete files |
| Parent hub template lines 73-84 | Hub companion files include real `changelog/`, `manual_testing_playbook/`, `benchmark/`, and `description.json` | Confirms canon shape for required hub artifacts |

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the already-completed five-mode `packetKind` work from commit `f8673ff0db` as completed evidence only.
- Delete the five sk-design hub changelog symlinks while preserving real per-mode changelog directories in their packet folders.
- Author sk-design hub `description.json` from the parent skill description template with a four-part version, SKILL keyword harvesting, and trigger examples.
- Scaffold a hub-level `manual_testing_playbook/` for mode classification and transform-verb framing, mirroring the design-audit packet playbook without colliding with it.
- Produce a hub-level `benchmark/` Lane-C baseline package.
- Declare the `transform-verbs` extension in `mode-registry.json`.
- Track the prose Bundle Rule to declarative `bundleRules` conversion as blocked on phase 017 canon `bundleRules` reconciliation.
- Fix the pre-existing broken `design-interface/README.md` link that points to `../sk-code/README.md`.
- Verify sk-design with strict parent-skill-check after execution.

### Out of Scope
- Executing the remaining sk-design changes during this documentation-only pass.
- Editing any file outside this phase folder during this documentation-only pass.
- Creating `description.json` or `graph-metadata.json` for this spec folder; the brief assigns those to the orchestrator.
- Changing shared canon templates, schema, or validator behavior; phase 017 owns bundleRules reconciliation.
- Touching deep-loop files, live-agent dirty files, or other 124 child phases.

### Files to Change During Future Execution

| File Path | Change Type | Description | Source |
|-----------|-------------|-------------|--------|
| `.opencode/skills/sk-design/changelog/design-audit` | Delete symlink | Remove hub symlink; keep real packet changelog directory | audit P0-9, master 015 bullet |
| `.opencode/skills/sk-design/changelog/design-foundations` | Delete symlink | Remove hub symlink; keep real packet changelog directory | audit P0-9, master 015 bullet |
| `.opencode/skills/sk-design/changelog/design-interface` | Delete symlink | Remove hub symlink; keep real packet changelog directory | audit P0-9, master 015 bullet |
| `.opencode/skills/sk-design/changelog/design-md-generator` | Delete symlink | Remove hub symlink; keep real packet changelog directory | audit P0-9, master 015 bullet |
| `.opencode/skills/sk-design/changelog/design-motion` | Delete symlink | Remove hub symlink; keep real packet changelog directory | audit P0-9, master 015 bullet |
| `.opencode/skills/sk-design/description.json` | Create | Advisor-facing hub description from parent template | audit P0-10, master 015 bullet |
| `.opencode/skills/sk-design/manual_testing_playbook/` | Create | Hub-level mode classification and transform-verb playbook | audit P0-11, master 015 bullet |
| `.opencode/skills/sk-design/benchmark/` | Create | Lane-C baseline package | audit P0-12, master 015 bullet |
| `.opencode/skills/sk-design/mode-registry.json` | Update | Declare `extensions: { transform-verbs }` and later declarative bundle rules | master 015 bullet, parent template lines 215-225 |
| `.opencode/skills/sk-design/design-interface/README.md` | Update | Fix stale `../sk-code/README.md` link | master 015 bullet |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-001 | Preserve the already-pushed `packetKind` repair as completed evidence only | Five sk-design modes retain `packetKind`; no duplicate packetKind work is planned | User note; master line 19; commit `f8673ff0db` |
| REQ-002 | Remove hub changelog symlinks | `parent-skill-check` check 7a no longer reports symlinked sk-design changelog entries | audit P0-9 lines 124-128; master line 20 |
| REQ-003 | Add hub `description.json` | `parent-skill-check` check 8a passes and file contains name, description, four-part version, keywords, and trigger examples | audit P0-10 lines 129-133; master line 21 |
| REQ-004 | Add hub `manual_testing_playbook/` | `parent-skill-check` check 9a passes and playbook covers mode classification plus transform-verb framing | audit P0-11 lines 134-138; master line 22 |
| REQ-005 | Add hub `benchmark/` Lane-C baseline | `parent-skill-check` check 9b passes and baseline artifacts are present under the hub benchmark package | audit P0-12 lines 139-142; master line 23 |
| REQ-006 | Verify strict parent hub conformance | `PARENT_HUB_CHECK_STRICT=1` parent-skill-check for sk-design reports 0 fails | master line 26; audit line 8 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-007 | Declare the `transform-verbs` extension | `mode-registry.json` declares `extensions` for transform-verb routing without introducing a third physical tier | master line 24; parent template lines 215-225 |
| REQ-008 | Convert prose Bundle Rule to declarative `bundleRules` when unblocked | Task remains blocked until phase 017 reconciles the bundleRules vocabulary, then sk-design uses the reconciled shape | master line 24; master lines 38-46 |
| REQ-009 | Fix the broken design-interface README link | `design-interface/README.md` no longer points at `../sk-code/README.md` | master line 25 |
| REQ-010 | Keep design-audit packet playbook separate | Hub playbook mirrors useful scenario shape but does not overwrite or duplicate the design-audit packet playbook | master line 22; audit P0-11 line 137 |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: sk-design strict parent-skill-check moves from the audited 4 strict failures to 0 failures after execution.
- **SC-002**: The five hub changelog symlinks are gone, and per-mode packet changelog directories remain real directories in their packet folders.
- **SC-003**: `description.json`, `manual_testing_playbook/`, and `benchmark/` exist at the sk-design hub root and match the parent-hub companion-file canon.
- **SC-004**: `mode-registry.json` declares the `transform-verbs` extension, while declarative `bundleRules` conversion is either completed after phase 017 or explicitly left blocked with the phase 017 dependency.
- **SC-005**: The pre-existing `design-interface/README.md` broken link to `../sk-code/README.md` is fixed.

### Acceptance Scenarios

- **Scenario 1**: **Given** the sk-design hub changelog contains five symlinks, **when** phase execution removes only those hub symlinks, **then** check 7a passes and per-mode changelog directories remain intact.
- **Scenario 2**: **Given** sk-design lacks hub `description.json`, **when** execution authors it from the parent description template, **then** check 8a passes with name, description, version, and keywords present.
- **Scenario 3**: **Given** sk-design lacks hub `manual_testing_playbook/`, **when** execution scaffolds mode-classification and transform-verb scenarios, **then** check 9a passes without replacing the design-audit packet playbook.
- **Scenario 4**: **Given** sk-design lacks hub `benchmark/`, **when** the Lane-C baseline package is produced, **then** check 9b passes and later phase 019 can compare cross-hub baselines.
- **Scenario 5**: **Given** phase 017 has not reconciled canon `bundleRules`, **when** phase 015 reaches declarative bundle rule work, **then** execution stops or records a blocked TODO instead of inventing a local shape.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 017 canon bundleRules reconciliation | Declarative bundleRules shape may be invalid if authored early | Block REQ-008 until phase 017 reconciles template, schema, and validator vocabulary |
| Risk | Changelog symlink deletion | Accidental deletion of real per-mode changelog directories would lose packet history | Delete only hub symlink entries named by audit P0-9; verify packet changelog directories still exist |
| Risk | Hub playbook collision | Hub playbook could duplicate or overwrite design-audit packet playbook | Scaffold hub-level scenarios only; mirror structure, not packet-local files |
| Dependency | Lane-C benchmark tooling | Baseline may be incomplete if produced before playbook exists | Sequence benchmark after playbook scaffold |
| Risk | Shared branch with live agent | Unrelated dirty files may coexist | Touch only sk-design files during execution and only this phase folder during documentation |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Benchmark generation must produce a usable Lane-C baseline without modifying historical benchmark runs.

### Security
- **NFR-S01**: `description.json`, playbook content, and benchmark artifacts must not include secrets, local credentials, or private runtime state.

### Reliability
- **NFR-R01**: Final verification must use strict parent-skill-check for sk-design and report 0 fails before phase execution is considered complete.
- **NFR-R02**: Bundle rule work must not proceed on an unreconciled schema shape.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Hub changelog entries must be distinguished from packet-local changelog directories.
- Hub manual testing playbook must not replace design-audit packet-local manual testing content.
- Benchmark baseline must be new hub-level evidence, not a rewrite of old or sibling hub benchmark artifacts.

### Error Scenarios
- If `parent-skill-check` still reports check 7a, inspect for additional symlinks before editing unrelated files.
- If `description.json` passes existence but fails content checks, compare against the parent description template rather than inventing fields.
- If declarative `bundleRules` shape is still unreconciled, leave the task blocked on phase 017.

### Concurrent Operations
- The master plan marks 015 parallel-safe now, but shared branch discipline still limits execution to sk-design files and excludes deep-loop hot files.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | Multiple sk-design hub companion artifacts plus one README link and registry extension |
| Risk | 13/25 | Symlink deletion, benchmark baseline, and blocked bundleRules sequencing |
| Research | 10/20 | Master plan and audit provide concrete target files; phase 017 dependency needs confirmation |
| **Total** | **40/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should phase 015 ship prose-only transform-verb routing before phase 017, or wait to encode declarative `bundleRules` after phase 017 reconciles the canon shape?

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Hub Program**: See `../spec.md`

<!-- /ANCHOR:related-docs -->
