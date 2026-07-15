---
title: "Tasks: Arc 020 Spec Docs sk-doc Alignment"
description: "Task breakdown for the final arc 021 sk-doc sweep over arc 020 docs and selected skill surfaces."
trigger_phrases:
  - "021 003 tasks"
  - "arc 020 sk-doc sweep tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/003-align-arc-020-spec-docs-with-sk-doc"
    last_updated_at: "2026-05-23T14:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed sk-doc sweep tasks and validation evidence"
    next_safe_action: "Review and commit documentation-only packet if desired"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0210030210030210030210030210030210030210030210030210030210030210"
      session_id: "021-003-sk-doc-arc-020-spec-sweep"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Arc 020 Spec Docs sk-doc Alignment

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

- [x] T-001 Read sk-doc and system-spec-kit instructions.
- [x] T-002 Scaffold packet docs and metadata.
- [x] T-003 Run strict scaffold validation before drift fixes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T-010 Enumerate arc 020 child markdown docs.
- [x] T-011 Check H2 casing, ADR evidence rows, continuity fields, anchors, and stale citations.
- [x] T-012 Apply minimal fixes only where drift is found.
- [x] T-013 Write `scratch/sk-doc-sweep-tally.csv`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T-020 Check rerank sidecar `SKILL.md` and `README.md` for current-state mutable packet IDs.
- [x] T-021 Check five `doctor.sh` scripts for bash shebang, strict mode, and `COMPONENT:` header.
- [x] T-022 Apply minimal fixes only where drift is found.
- [x] T-030 Strict-validate all six arc 020 child packets.
- [x] T-031 Strict-validate this 021/003 packet.
- [x] T-032 Strict-validate the arc 021 parent.
- [x] T-033 Fill checklist, ADR, implementation summary, and commit handoff.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- All requested sweeps are recorded with evidence.
- All actual drift is fixed or explicitly deferred by ADR.
- Requested strict validations exit 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `../spec.md` for the 021 parent packet.
- `../002-align-rerank-sidecar-cjs-and-sidecar-worker-with-sk-code/implementation-summary.md` for the preceding child packet.
- `../../020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/` for the target arc 020 child packets.
<!-- /ANCHOR:cross-refs -->
