---
title: "Implementation Summary"
description: "Read-only skill check engine with C1-C13 reports, findings-only exit codes, target-aware probes, Python interpreter discovery, and fleet verification."
trigger_phrases:
  - "check engine implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/001-check-engine"
    last_updated_at: "2026-10-30T07:06:56Z"
    last_updated_by: "codex"
    recent_action: "Recorded final interpreter-discovery evidence and phase closure"
    next_safe_action: "No further work is pending in this phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-check-engine |
| **Status** | Complete |
| **Completed** | 2026-10-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The read-only checker resolves a skill name or path, runs the existing package, metadata, routing, graph, advisor, mirror, description, and corpus probes, and reports rows C1 to C13. Only FINDING rows determine exit 1; UNKNOWN rows remain distinct, are counted separately, and alone produce exit 0. With no target it reports format and metadata verdicts for every direct shipped root.

### Phase 1: check-engine

`sk-skill-check.cjs` renders deep text or JSON reports and a fleet JSON/table. `lib/sk-skill-surface.cjs` holds path resolution, classification, collision checks, validator exit mapping, and the shared probes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/sk-skill-check.cjs` | Created | Runs C1-C13 checks and renders deep and fleet reports |
| `.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs` | Created | Locates and classifies inputs, maps child exit codes, discovers a Python interpreter with PyYAML, and shares probes |
| `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` | Created | Covers 31 cases for fixture classification, rendering, failure mappings, fleet behavior, target-aware probes, advisor envelopes, and Python discovery |
| `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-check/` | Created | Holds plain, pre-migration, canon, dual, outside-root, reserved-prefix, direct-hub, and nested-packet fixtures |
| `scratch/baseline/package-skill.json` | Created | Captures strict package results for 13 shipped roots before implementation |
| `scratch/baseline/ci-skill-root-metadata.json` | Created | Captures metadata results for 13 shipped roots before implementation |
| `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` | Updated | Records completed tasks, evidence, and outcome |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fixture suite passed all 31 tests. With `PYTHON` unset, the fleet check returned 13 roots with PASS package and metadata verdicts, matching the recorded baseline, and the working tree remained unchanged across a fleet run. The requested `sk-git` report contained no FINDING rows and one UNKNOWN because the advisor backend was unavailable; it printed `Result: NO FINDINGS (1 UNKNOWN)` and exited 0. A live warm-only advisor response confirmed the `{status, data: {recommendations}}` envelope; a later invocation found the backend unavailable. Tests cover the nested response and compatibility fallback, C6 skipped and per-skill error rows, C11 isolation, package failure detail, and nested hub-packet resolution. PATH stubs confirmed that discovery skips an interpreter without PyYAML, selects the next usable one, and does not fall back when `PYTHON` is explicitly empty.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Existing validators remain authoritative | The checker parses their results instead of duplicating format, metadata, graph, mirror, or description rules |
| Advisor exit 75 is UNKNOWN | An unavailable warm-only backend cannot count as a pass or a finding; only FINDING rows determine exit 1 |
| Reserved-prefix fixture value is generated during tests | Tracked fixture files do not contain a private skill name |
| Python preconditions are explicit | A set `PYTHON` is used exclusively; otherwise the checker selects the first distinct `python3` on PATH that imports PyYAML, or exits 2 with guidance naming the attempted interpreters |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check .skilled/commands/doctor/scripts/sk-skill-check.cjs` | PASS, exit 0 |
| `node --check .skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs` | PASS, exit 0 |
| `node --check` on checker, surface library, and test file | PASS, exit 0 |
| `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` | 31 passed, 0 failed, exit 0 |
| `env -u PYTHON node .skilled/commands/doctor/scripts/sk-skill-check.cjs check` | 13 roots PASS; exit 0 |
| `env -u PYTHON node .skilled/commands/doctor/scripts/sk-skill-check.cjs check sk-git` | C8 UNKNOWN while the advisor backend was unavailable; `Result: NO FINDINGS (1 UNKNOWN)`; exit 0 |
| `env -u PYTHON node .skilled/commands/doctor/scripts/sk-skill-check.cjs check sk-code-skilled` | Resolved as `hub-packet`; exit 0 |
| `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"how to commit with git worktrees"}' --warm-only --format json` | First invocation returned `status: ok` with `data.recommendations`; a later invocation returned backend unavailable (exit 75) |
| PATH interpreter stubs | Second interpreter selected; all-candidate failure names each interpreter; explicit `PYTHON` remains exclusive; empty `PYTHON` returns `PYTHON_MISSING` without PATH fallback |
| `check --json` fleet comparison with the recorded package and metadata baselines | 13 roots; all PASS; `baseline_match=true`; exit 0 |
| `git status` around fleet check | `status_unchanged=true fleet_exit=0` |
| Scoped `quality-gate.cjs` | `NO_BLOCKER_FOUND`, findings 0, exit 0 |
| `repair-derived.cjs --apply --folder specs/sk-doc/075-doctor-sk-skill-command/001-check-engine` | Graph metadata refreshed after the acceptance evidence update; exit 0 |
| `validate.sh specs/sk-doc/075-doctor-sk-skill-command/001-check-engine --strict` | `RESULT: PASSED`, 0 errors and 0 warnings; exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

No known blockers remain for the read-only check engine.
<!-- /ANCHOR:limitations -->

---
