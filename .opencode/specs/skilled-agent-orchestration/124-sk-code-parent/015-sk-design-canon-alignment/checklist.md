---
title: "Verification Checklist: Phase 15 sk-design canon alignment"
description: "Unchecked Level 2 verification checklist for the future sk-design canon alignment execution."
trigger_phrases:
  - "sk-design canon checklist"
  - "sk-design strict verification"
  - "sk-design benchmark checklist"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/015-sk-design-canon-alignment"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Phase planned and documented; execution pending"
    next_safe_action: "Use this checklist during execution; do not mark items complete before evidence exists."
    blockers:
      - "Declarative bundleRules checklist coverage is blocked on phase 017 canon reconciliation."
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
    completion_pct: 15
    open_questions:
      - "BundleRules verification waits for phase 017."
    answered_questions:
      - question: "Why is packetKind not checklist-gated as future work?"
        answer: "It is already complete and pushed in commit f8673ff0db."
---
# Verification Checklist: Phase 15 sk-design canon alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in `spec.md` and trace to master plan or audit evidence [source: brief lines 25-31]
- [ ] CHK-002 [P0] Technical approach defined in `plan.md` with blocked bundleRules sequencing [source: master lines 24 and 38-46]
- [ ] CHK-003 [P1] Dependencies identified, including phase 017 and pushed packetKind commit `f8673ff0db` [source: user note; master lines 19 and 24]

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Strict parent-skill-check for sk-design passes with 0 fails after execution [source: master line 26]
- [ ] CHK-011 [P0] Changelog symlink policy follows sk-code hub pattern with real hub files only [source: audit P0-9; master line 20]
- [ ] CHK-012 [P1] `description.json`, playbook, benchmark, registry extension, and README link changes follow parent-hub canon patterns [source: parent hub template lines 73-84 and 215-225]
- [ ] CHK-013 [P1] Declarative `bundleRules` are not hand-rolled before phase 017 reconciles the canon shape [source: master lines 24 and 38-46]

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Acceptance criteria for four audited strict failures are met [source: audit lines 7-10 and P0-9 through P0-12]
- [ ] CHK-021 [P0] Manual testing playbook includes mode-classification and transform-verb framing scenarios [source: audit P0-11; master line 22]
- [ ] CHK-022 [P1] Broken `design-interface/README.md` link is verified repaired [source: master line 25]
- [ ] CHK-023 [P1] Benchmark baseline artifacts are present for later phase 019 comparison [source: master lines 54-59]

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding is classified as `instance-only` or `cross-consumer` before execution [source: audit P0-9 through P0-12]
- [ ] CHK-FIX-002 [P0] Same-class symlink inventory confirms only the five audited sk-design hub symlinks are deleted [source: audit P0-9]
- [ ] CHK-FIX-003 [P0] Consumer inventory covers strict parent-hub checks 7a, 8a, 9a, and 9b plus the design-interface README link [source: audit P0-9 through P0-12; master line 25]
- [ ] CHK-FIX-004 [P0] BundleRules work is blocked rather than implemented against an unreconciled canon vocabulary [source: master lines 24 and 38-46]
- [ ] CHK-FIX-005 [P1] Matrix axes are listed before completion: changelog policy, description metadata, playbook scenarios, benchmark baseline, transform verbs, README link [source: master lines 20-26]
- [ ] CHK-FIX-006 [P1] No hostile env/global-state variant applies because planned changes are local repo artifacts only [source: scope in spec.md]
- [ ] CHK-FIX-007 [P1] Evidence is pinned to audit digest lines or a future execution diff/commit, not a moving branch claim [source: brief line 25]

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] New hub metadata, playbook, and benchmark artifacts contain no secrets or private runtime state [source: parent hub companion file scope]
- [ ] CHK-031 [P0] Input validation is represented by strict parent-hub checks and link validation for this documentation/artifact phase [source: master line 26]
- [ ] CHK-032 [P1] Auth/authz remains not applicable because sk-design hub artifact updates do not touch authentication behavior [source: master phase 015 scope]

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, and tasks stay synchronized around safe-now scope, pushed packetKind completion, and phase 017 bundleRules blocker [source: brief lines 17-31]
- [ ] CHK-041 [P1] Code comments remain unaffected, and any embedded code in docs avoids ephemeral spec/task identifiers in comments [source: brief lines 37-38]
- [ ] CHK-042 [P2] `design-interface/README.md` link repair is reflected in execution evidence after it is changed [source: master line 25]

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temporary files, if any, stay outside committed spec docs or inside approved scratch space [source: system-spec-kit rules]
- [ ] CHK-051 [P1] Documentation-only authoring touches only the five markdown files in this phase folder; execution later touches only planned sk-design files [source: brief lines 33-36]

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Planned for execution phase; not yet run.
**Verified By**: Pending future executor.

<!-- /ANCHOR:summary -->
