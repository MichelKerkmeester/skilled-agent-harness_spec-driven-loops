---
title: "Decision Record: Investigation P2 Cleanup Sweep"
description: "ADRs for non-trivial cleanup and deferral choices in packet 010/003/005."
trigger_phrases:
  - "arc 010 003 005 decisions"
  - "p2 cleanup adr"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep"
    last_updated_at: "2026-05-23T07:05:00Z"
    last_updated_by: "codex"
    recent_action: "recorded-cleanup-adrs"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0100030050100030050100030050100030050100030050100030050100030050"
      session_id: "010-003-005-p2-cleanup"
      parent_session_id: null
    completion_pct: 100
---
# Decision Record: Investigation P2 Cleanup Sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v1.0 -->

---

## ADR-001: Delete Only Proven-Dead Barrel Exports

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F42, F45, F77, F78, F106, F107, F108, F109

### Decision
Remove barrel exports with no direct consumers in current source or regression tests. Keep `EmbedderManifest` and `listSupportedDimensions` even though they are production-dead because current tests import them and test edits are out of scope.

### Rationale
- This packet is cleanup-only and regression-only.
- Removing test-consumed exports would force test edits outside the allowed source/doc scope.
- Production-dead but test-live exports need a separate API/test hygiene packet.

### Consequences
- Several unused barrel exports are gone.
- Two test-live barrel exports remain and are marked deferred.

---

## ADR-002: Defer Behavior-Changing Security P2s

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F16, F17, F40, F46, F50, F51, F72, F89, F90, F103

### Decision
Defer P2 security/hardening findings that would alter accepted environment variables, process signal handling, credential cache lifetime, filesystem durability, timing, or path validation.

### Rationale
- The user explicitly required zero behavioral changes.
- Security hardening is valuable, but these findings affect runtime policy and operational semantics.
- Forcing closure would hide behavior changes inside a cleanup packet.

### Consequences
- The packet closes maintainability cleanup while preserving runtime behavior.
- Deferred findings should be handled in a future P1 or dedicated hardening packet with tests.

---

## ADR-003: Keep Test Harness Exports When Tests Are Out of Scope

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F9, F11, F28, F41, F44, F46, F104

### Decision
Do not remove exports or options that current regression tests use unless no test edit is required. Prune only named exports with no direct consumers.

### Rationale
- Test files are read-only for this packet.
- Regression failures from export removal are not cleanup wins.
- A test-harness API cleanup should move helpers to explicit testables modules and update tests in one packet.

### Consequences
- Some test-only surfaces remain and are documented as deferred.
- CJS launcher exports were reduced only where importer search found no direct consumers.

---

## ADR-004: Close Stale Findings by Current-Source Absence

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F29, F54, F84, F93, F98

### Decision
Mark findings closed when the named helper or branch no longer exists in the current source, without creating churn to mimic the stale registry line numbers.

### Rationale
- Sibling P1 packets already changed some target surfaces.
- Reintroducing or rewriting absent code would create artificial diff.
- The acceptance target is current-source closure, not historical line-number matching.

### Consequences
- Several findings are closed as baseline-current rather than by new code hunks.
- The checklist records them explicitly so closure accounting stays honest.
