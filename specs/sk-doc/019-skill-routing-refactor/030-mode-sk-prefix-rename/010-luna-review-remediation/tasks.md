---
title: "Tasks: Remediate LUNA review findings for the sk-prefix rename"
description: "Dependency-ordered tasks for catalog parity, fail-closed freshness traversal, durable verification evidence, and superseding closeout documentation."
trigger_phrases:
  - "LUNA remediation tasks"
  - "catalog parity tasks"
  - "freshness gate regression"
  - "current state verification tasks"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/010-luna-review-remediation"
    last_updated_at: "2026-07-29T12:41:33Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-luna-review-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Remediate LUNA Review Findings For The Sk-Prefix Rename

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Confirm the twelve canonical sk-doc workflow keys and shared-packet mapping from `.opencode/skills/sk-doc/mode-registry.json`.
- [ ] T002 Confirm maintained route-gold, metadata, catalog, and strict packet verification commands from their owning README files.
- [ ] T003 Create packet-local `verification/` output locations and define the exact evidence links expected by `current-state-verification.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Replace stale workflow keys in `.opencode/skills/sk-doc/feature-catalog/feature-catalog.md` with all twelve canonical `sk-create-*` values.
- [ ] T005 [P] Replace the repeated stale discriminator inventory in `.opencode/skills/sk-doc/feature-catalog/packet-authored-registry-routing/packet-authored-registry-routing.md`.
- [ ] T006 Add an exact registry-to-catalog parity assertion or bounded check that rejects missing, extra, or duplicate workflow keys while preserving `sk-create-skill-parent`.
- [ ] T007 Change `findManifestDirs()` and `run()` in `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs` so attempted subtree read failures are reported and fail the gate.
- [ ] T008 Add `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/ci-leaf-manifest-freshness.test.cjs` covering injected `EACCES`, multiple failures, stable text/JSON output, exclusions, root errors, fresh/stale behavior, and mock restoration.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run catalog document/package validation and exact workflow-key parity; retain command results.
- [ ] T010 Run the focused freshness regression, root-metadata gate, and fleet freshness gate; retain machine-readable generated-metadata output.
- [ ] T011 Run the sk-doc Lane C benchmark with route-gold and compiled-routing parity enabled into the packet-local verification directory; retain `report.json` and `report.md`.
- [ ] T012 Publish `current-state-verification.md` with commit/diff identity, timestamp, exact commands, linked outputs, results, and an explicit statement that it supersedes the phase 008 snapshot.
- [ ] T013 Add current-state pointers to the parent packet and phase 008/009 records without changing their historical observations.
- [ ] T014 Run strict child validation followed by recursive parent validation, reconcile checklist evidence, and rerun the LUNA review gate if available.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 and P1 requirements have linked evidence in `current-state-verification.md` and `checklist.md`.
- [ ] Both live catalog inventories equal the registry's twelve-key set.
- [ ] Unreadable attempted subtrees cause visible, deterministic nonzero freshness results.
- [ ] Route-gold, generated metadata, and strict packet validation results are current and durable.
- [ ] Historical phase records point to one superseding current-state authority.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Review Source**: See `../review/review-report.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
