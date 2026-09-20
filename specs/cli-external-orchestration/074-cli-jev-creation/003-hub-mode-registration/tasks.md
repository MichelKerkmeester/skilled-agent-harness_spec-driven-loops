---
title: "Tasks: Phase 3: hub-mode-registration"
description: "Task ledger for registering and wiring cli-jev: the transport registry entry and axis, every routing surface, the dispatch-audit shape, eight implemented checks with fixtures, the compiler's transport support and the serving re-mint."
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/074-cli-jev-creation/003-hub-mode-registration"
    last_updated_at: "2026-09-20T10:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Registration, hook checks and compiled wiring landed; all gates re-run green"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-074-003-hub-mode-registration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: hub-mode-registration

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the baseline: per-hub gate failure count, compiled manifest freshness, generator output before edits
- [x] T002 Read the transport rules the per-hub gate already enforces, so the registration is written to satisfy them rather than to satisfy a guess
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Register the mode and declare the `transport-axis` extension (`mode-registry.json`)
- [x] T004 Add the router signal, two vocabulary classes and the tie-break position (`hub-router.json`)
- [x] T005 Add the `JEV` intent row and the two-leaf resource map (`ROUTER.md`)
- [x] T006 Update the mode table, the two-axis model, the layout and the references (`SKILL.md`)
- [x] T007 Add the roster row, the routing chain and the corrected default statement (`README.md`)
- [x] T008 Register five leaves and regenerate the manifest byte-for-byte (`leaf-manifest.json`)
- [x] T009 Update the advisor description, the graph intent signals and add the `1.6.0.0` changelog entry
- [x] T010 Add the jev dispatch shape, both executor basenames and the command-position branch (`dispatch-audit.mjs`)
- [x] T011 Implement the eight checks (`dispatch-rule-checks.mjs`)
- [x] T012 Add eight fixture pairs and a transport governance test (`dispatch-rule-checks.test.mjs`)
- [x] T013 Add the shape rows and the management commands that must not resolve (`dispatch-audit.test.mjs`)
- [x] T014 Teach the hub compiler the transport role and the `evidenceOnly` authority edge (`registry-compiler.cjs`)
- [x] T015 Add the packet to the harness sources and the transport cases to the canary fixture
- [x] T016 Re-mint the serving manifest and regenerate the trigger index
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Re-run the per-hub gate from the final state and read the summary line, not just the exit status
- [x] T018 Run the transport rule's negative control and restore the file
- [x] T019 Run both dispatch test suites
- [x] T020 Replay the compiled router on four prompts, including two that must not change and one that must defer
- [x] T021 Verify the executor-delegation scorer does not resolve the transport
- [x] T022 Verify the compiled manifest is fresh and serving the new policy hash
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed — see the Verification Checklist below
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Consumes: `../002-cli-jev-skill-packet/` (the rules this phase implements)
- Consumed by: `../005-docs-governance-and-closeout/` (the closeout re-runs these gates)
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

### Pre-Task Checklist

- Capture the baseline before touching a routing file, because "no regressions" is not a claim anyone can make from memory
- Read the gate's own rule text before satisfying it

### Task Execution Rules

| ID | Rule |
|----|------|
| TASK-SEQ | Registration, then enforcement, then compilation: the compiler reads the registry, so it cannot be taught the transport before the transport exists |
| TASK-EVIDENCE | Every gate is re-run from the final state, and its summary line is read rather than its exit status |
| TASK-SCOPE | A pre-existing defect found in a file this phase edits is corrected and recorded; one found elsewhere is recorded only |

### Status Reporting Format

Status Reporting is one line per gate: the command, the verdict, and the count behind the verdict.

### Blocked Task Protocol

A task is marked `[B]` only when an external dependency is missing and no in-scope substitute exists. One genuine blocker appeared and was resolved in-phase: the compiled hub refused to load a registry containing a transport at all, which required the compiler change that this ledger lists as T014 rather than a workaround.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] [P0] Baseline captured for the per-hub gate, the compiled manifest and the generator outputs
- [x] [P1] The seven existing modes' entries read before editing, so their fields were not disturbed
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] [P0] The compiler change follows the branch the shared schema already declares instead of inventing a parallel contract
- [x] [P1] Comments state the durable reason, not the artifact that prompted the change
- [x] [P1] Two unused constants introduced mid-edit were removed before the phase closed
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] [P0] Every new check has a satisfied and a violated fixture, and the bijection guard passes in both directions
- [x] [P1] The new dispatch shape is covered by a govern list and a do-not-govern list
- [x] [P1] The per-hub gate was negative-controlled on the transport rule specifically
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] [P0] The compile failure was fixed at its cause: the compiler learned the role, rather than the mode being registered as a workflow to satisfy it
- [x] [P1] The stale manifest was re-minted rather than explained away
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] [P0] The transport forbids `Write`, `Edit` and `Task`, and the compiled policy carries `mutatesWorkspace: false`
- [x] [P0] The transport holds no commit authority in the compiled policy (`evidenceOnly`)
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] [P0] The registry's own discriminator prose was corrected, because it asserted that no mode here could be a transport
- [x] [P1] The hub README, description and graph metadata all name the new mode
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] [P1] No packet-local `graph-metadata.json` or `description.json` was created; the hub stays the single advisor identity
- [x] [P1] Generated artifacts were produced by their generators, not edited by hand
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Twenty-two tasks and fifteen checklist rows closed. The mode is registered on every surface, enforced by eight implemented checks, and served by a freshly compiled policy whose freshness was verified after the last edit.
<!-- /ANCHOR:summary -->
