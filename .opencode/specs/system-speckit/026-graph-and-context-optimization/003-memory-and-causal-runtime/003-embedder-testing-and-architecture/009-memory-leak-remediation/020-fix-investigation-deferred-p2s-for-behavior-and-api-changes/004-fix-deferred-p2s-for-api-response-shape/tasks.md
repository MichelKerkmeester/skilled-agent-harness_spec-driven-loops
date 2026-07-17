---
title: "Tasks: API Response Shape Closure for F9 F32 F39 F97 F99"
description: "Task breakdown for closing sidecar-client API response-shape deferred P2 findings."
trigger_phrases:
  - "020 004 tasks"
  - "api response shape tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/004-fix-deferred-p2s-for-api-response-shape"
    last_updated_at: "2026-05-23T10:45:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified"
    next_safe_action: "Parent agent may review and commit packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0200040200040200040200040200040200040200040200040200040200040200"
      session_id: "020-004-api-response-shape"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: API Response Shape Closure for F9 F32 F39 F97 F99

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Marker | Meaning |
|--------|---------|
| `[ ]` | Not started |
| `[~]` | In progress |
| `[x]` | Complete |
| `[!]` | Blocked or deferred |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T-001 Validate scaffold before source edits.
- [x] T-002 Read parent spec, F37 precedent, current source/tests, and predecessor diff.
- [x] T-003 Prove `buildSidecarEnv` has no live production consumers.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T-004 Move `buildSidecarEnv` test consumption to `sidecar-client.testables.ts`.
- [x] T-005 Remove production export of `buildSidecarEnv` from `sidecar-client.ts`.
- [x] T-006 Implement canonical camelCase response names with deprecated aliases.
- [x] T-007 Emit once-per-process warning on legacy alias reads.
- [x] T-008 Replace pending-map cast with discriminator narrowing.
- [x] T-009 Add regression fixtures for F9/F32/F39/F97/F99.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T-010 Run embedders vitest.
- [x] T-011 Run mcp-server typecheck.
- [x] T-012 Fill checklist, ADRs, and implementation summary.
- [x] T-013 Run final strict validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- Five findings are closed or explicitly DEFERRED-AGAIN.
- Requested verification commands exit 0 unless halt-on-first-regression triggers.
- Packet docs are synchronized and strict validation exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `../spec.md` for phase parent and halt-on-first-regression rule.
- `../001-fix-deferred-p2s-for-test-only-and-shared-exports/decision-record.md` for export-surface cleanup pattern.
- `../../015-deep-research-drift-and-simplification/research/findings-registry.json` for deferred finding evidence.
- `ac54fd1062` for Bucket 1 sidecar-client baseline.
<!-- /ANCHOR:cross-refs -->
