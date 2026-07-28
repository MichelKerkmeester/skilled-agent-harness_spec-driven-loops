---
title: "Implementation Summary: Advisor Ingestion Seam"
description: "Delivered: a skill created while the advisor daemon is warm is ingested automatically — the watcher watches the skills root shallowly, newborn roots route through the standard debounce into reindex, deletion retires targets, and both creation journeys document discovery, the manual fallback, and a routing smoke test."
trigger_phrases:
  - "advisor ingestion seam summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/026-advisor-ingestion-seam"
    last_updated_at: "2026-07-28T16:27:03Z"
    last_updated_by: "claude-code"
    recent_action: "Delivered the watcher mechanism with the real-chokidar proof green"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-advisor-ingestion-seam"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Mechanism: the watcher watches the skills root (depth zero) — gate-triggered scans were rejected for coupling always-available tooling to a sometimes-present daemon"
      - "The smoke test stays a documented workflow step, not a gate flag"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Advisor Ingestion Seam

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Delivered** | 2026-07-28 |
| **Execution model** | Orchestrator implements the daemon change directly (design-first per the decision record); SOL high adversarial review before landing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The watcher now watches the skills root itself, shallowly (`depth: 0` bounds the directory watch; explicit file targets are unaffected). A new top-level directory is watched immediately — so the `SKILL.md` landing moments later fires a normal event even before discovery runs — and its expected `SKILL.md` path is enqueued through the standard debounce, storm tracking, and orchestrator flow; the reindex tail's refresh then promotes the root's files into durable targets. Deleting a root retires its targets through the same refresh. Five new watcher tests cover the mechanism, including a real-chokidar integration case that creates a skill on real disk after startup and observes it reindexed and target-promoted with no restart. Both creation workflows gained the closing steps the journey lacked: routing-evidence quality (the scored fields named explicitly, slug-only defaults called out as placeholders), the automatic discovery statement, the `skill_graph_scan` manual fallback, and an `advisor_recommend` smoke test; the advisor SKILL.md carries the matching lifecycle note.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Design before code, per the decision record: the startup-only discovery and event-gated refresh were verified at source, three mechanisms weighed, and the watcher option chosen because it reuses machinery the daemon already owns (dynamic add/unwatch, debounce, refresh) while the gate-triggered alternative would couple always-available tooling to a sometimes-present daemon.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Recorded in `decision-record.md`: the skills-root watch with the manual scan as documented fallback; depth-zero scoping plus the dot-directory filter as the storm bound; enqueueing the expected `SKILL.md` path (not the directory) because the hash path treats only ENOENT as missing.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Real-chokidar integration | newborn skill discovered, reindexed, target-promoted; no restart |
| Watcher unit cases | shallow root watch + depth 0 asserted; nested/dot dirs ignored; deletion retires targets |
| Regression | existing watcher/daemon suites 7+43 tests green alongside the 5 new |
| Docs | both journeys and the advisor lifecycle note name the same mechanism and fallback |

Commands: `vitest run tests/daemon-watcher-new-root-ingestion.vitest.ts` (5 passed) alongside `tests/daemon-watcher-resource-leaks-049-005.vitest.ts` (7 passed) via the spec-kit toolchain.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

A directory added via the newborn path stays watched for the daemon's lifetime (one descriptor per created root; existing roots' directories are not watched — an accepted asymmetry noted in the code). A root created and never given a `SKILL.md` ingests nothing until its first real file event or a manual scan — the documented manual step covers the cold-daemon case and this one.
<!-- /ANCHOR:limitations -->
