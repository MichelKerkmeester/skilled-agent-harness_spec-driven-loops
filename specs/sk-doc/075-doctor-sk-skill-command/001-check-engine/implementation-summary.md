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
    last_updated_at: "2026-10-30T12:00:00Z"
    last_updated_by: "codex"
    recent_action: "Read a target from another Skilled repository against its own repository"
    next_safe_action: "No phase work pending"
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

#### Router row and route documentation

Row C7 grades a router by what the replay reader can read. The skill router template permits a map named `INTENT_MODEL` and a router that routes by pseudocode alone, and the reader matches only uppercase map keys, so an unreadable map is the template working as designed rather than a defect. C7 now stays FINDING for the two shapes that are faults, a dual declaration and a hub root, whose map is the one thing that flexibility never relaxes, and reports INFO naming the reason for a skill or a hub packet. A parseable router still reports PASS with its intent and resource counts.

The check workflow and the presentation now name each row the way the engine prints it, and the presentation's fleet result line carries `PASS` and `FINDINGS (N)`, matching `Roots: [N]; result: ...`.

#### A target from another Skilled repository

A skill can live in a second checkout. The changelog index link, the runtime mirrors, the skills root a location is classified against and any validator that resolves repository-relative paths all belong to the repository that owns the skill, so a single target that resolves inside another repository's `.skilled/skills` is read against that repository. A tool the owning repository does not ship keeps running from the checker's own checkout, and each row's detail then names the repository it read and, where a tool was borrowed, which checkout supplied it. A target outside any `.skilled/skills`, a target in the checker's own repository, a caller-named repository root and the no-argument fleet report are unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/sk-skill-check.cjs` | Created | Runs C1-C13 checks and renders deep and fleet reports |
| `.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs` | Created | Locates and classifies inputs, maps child exit codes, discovers a Python interpreter with PyYAML, re-roots a target to the repository that owns it, and shares probes |
| `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` | Updated | Covers 58 cases for fixture classification, rendering, failure mappings, fleet behavior, target-aware probes, advisor envelopes, Python discovery, the router row's four verdict shapes, route-document parity and a converted skill read from its own repository |
| `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-check/` | Updated | Holds plain, pre-migration, canon, dual, mode-template, outside-root, reserved-prefix, direct-hub, and nested-packet fixtures |
| `.skilled/commands/doctor/assets/doctor-sk-skill-check.yaml` | Updated | Names rows C1 to C13 and H1 to H11 with the labels the engine prints |
| `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt` | Updated | Documents the fleet result line the engine prints |
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
| `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` | 31 passed, 0 failed, exit 0; 57 passed after the router-row follow-up; 58 passed after the second-repository follow-up |
| New second-repository test on the pre-fix engine | Failed with `'outside' !== 'direct'`; with that assertion lifted, C6 printed `derived.key_files is missing or empty after repair` and C10 `The changelog index link is missing or does not resolve` |
| `check` on a converted skill in a second repository, before the fix | C6 and C10 FINDING, `Result: FINDINGS (2)`, exit 1 |
| `check` on the same skill after the fix | C1 PASS `direct`, C6 PASS, C10 PASS, `Result: PASS`, exit 0, every row naming the repository it read |
| `check sk-git` after the fix | Same rows as before the change, no repository note, exit 0 |
| `node --test .skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs` | 32 passed, 0 failed, exit 0 |
| `check <each of the 14 sk-doc packets>` against `package_skill.py --check --strict --json` | Every packet: gate `valid: true` exit 0, check C3 PASS, `findingCount: 0`, exit 0; no C7 FINDING |
| Three new tests on the pre-fix engine | Failed with `'FINDING' !== 'INFO'`, `the workflow names C1 Location`, and `the documented result line names PASS` |
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

The fleet reports `Roots: 13; result: PASS`. An earlier run of this phase reported `Roots: 13; result: FINDINGS (1)`, whose one finding was `sk-prompt`'s Format cell: `package_skill.py --check --strict`'s own verdict on `benchmark/router/run_fixtures.sh`. That gate now returns `valid: true` for `sk-prompt`, exit 0, and `sk-skill-check.cjs` reports nothing the gate does not.
<!-- /ANCHOR:limitations -->

---
