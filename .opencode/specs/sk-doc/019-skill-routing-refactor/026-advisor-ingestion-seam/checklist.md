---
title: "Verification Checklist: Advisor Ingestion Seam"
description: "Planned verification for the mechanism decision, warm-daemon discovery proof, journey docs, and routing-evidence guidance."
trigger_phrases:
  - "advisor ingestion seam checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/026-advisor-ingestion-seam"
    last_updated_at: "2026-07-28T16:27:03Z"
    last_updated_by: "claude-code"
    recent_action: "Delivered and verified"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-advisor-ingestion-seam"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Advisor Ingestion Seam

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Items marked only with command output or diff evidence at execution time.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P1] Startup-only discovery re-verified at watcher source on the execution tip [evidence: `walkSkillDirectories` startup enumeration + tail-only `refreshTargets()` verified]
- [x] CHK-002 [P1] Decision record accepted before any daemon code changes [evidence: `decision-record.md` Accepted status predates the `watcher.ts` diff in the commit order]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P1] Mechanism change bounded and isolated in its own commits [evidence: `git show --stat` for the seam commit: `watcher.ts` + its test + docs only]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-004 [P1] Integration test proves create → discover on a warm daemon, no restart [evidence: `daemon-watcher-new-root-ingestion.vitest.ts` real-chokidar case: 5/5 tests passed]
- [x] CHK-005 [P1] Advisor daemon suite green; no watcher-latency regression on existing roots [evidence: 12/12 watcher tests pass; no changes to file-target handling paths]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-006 [P1] Both journeys document the same refresh step [evidence: `SKILL.md` steps 28 (both workflows) and the advisor lifecycle note name `skill_graph_scan`]
- [x] CHK-007 [P1] Routing-evidence guidance + smoke test landed per the open-question resolution [evidence: steps 27/28 in both workflows carry the scored fields + `advisor_recommend` one-liner]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-008 [P1] No new privileged paths; any fs-watch widening scoped to top-level roots with debounce [evidence: `watcher.ts` diff: `depth: 0` + `startsWith('.')` filter + `dirname === skillsRoot` guard, 3/3 bounds present]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-009 [P1] Decision record and edited docs version-bumped and cross-linked [evidence: `decision-record.md` linked from implementation-summary key_files; sweep bumps cover the SKILL.md edits]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-010 [P2] Daemon changes stay under system-skill-advisor/mcp-server; doc changes under their owning skills [evidence: daemon changes under mcp-server; doc changes under owning skills]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Pending execution.
<!-- /ANCHOR:summary -->
