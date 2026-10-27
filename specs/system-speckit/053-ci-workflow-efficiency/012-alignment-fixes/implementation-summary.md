---
title: "Implementation Summary"
description: "The advisor default suite now runs in CI, the naming guard accepts the deep loop's synthesis marker and runs on main, two hook tests stop depending on the host, and the runtime lint check passes."
trigger_phrases:
  - "alignment fixes implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/012-alignment-fixes"
    last_updated_at: "2026-10-27T21:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Fixed all seven findings with before and after checks"
    next_safe_action: "None; the conductor lands the commits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-27-053-012-alignment-fixes"
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
| **Spec Folder** | 012-alignment-fixes |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The advisor's 150 default test files now run in CI on every change to the advisor runtime, where before no workflow ran them. The naming guard stops rejecting the marker file the deep loop writes and now runs on pushes to `main`. Two hook tests no longer pass or fail with the host's opencode, and the spec-kit runtime's `npm run check` exits 0 for the first time since its lint configuration fell behind the file types it reads.

### Phase 12: alignment-fixes

The advisor suite needed one thing CI lacked: its skill-graph database. A fresh checkout has none, which is why five files failed when the whole suite ran. One `skill_graph_scan` builds it, so the workflow scans and then runs `npm test` after the stress suite, reusing the job's install and build. That suite already spawns `tests/python/test_skill_advisor.py` from `tests/compat/python-compat.vitest.ts`, so the Python suite runs with it and is not run twice.

The lint check failed on 239 errors. The `^_` unused-binding rule applied only to TypeScript while the linter also reads `.js`, `.cjs` and `.mjs`, and extending it cleared 102. The other 137 were real, and 133 of them sat in `cli/`, whose own lint is a plain `tsc` run that checks neither unused bindings nor `any`, so nothing else would have reported them. They were fixed in the code: dead imports, helpers and bindings deleted, `any` replaced by named interfaces for the shapes the tests assert on, and the two reducer suites given a module-scoped `createRequire`. One of the four outside `cli/` was a spec-gate helper that took an environment it never read, and wiring it through would have been wrong: `isHookEnabled` given an env skips the saved hook-flags file, so a saved kill switch would stop working. The parameter is gone and a comment says why.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/skill-advisor-stress.yml` | Modified | Scan, then the default suite, timeout 25; sk-doc's package installed so the parent-skill checker resolves the shared package |
| `.github/workflows/naming-standard-guard.yml` | Modified | `main` added to the push branches |
| `.github/workflows/README.md` | Modified | Rows for both workflows |
| `.skilled/skills/sk-code/sk-code-ci/references/*.md` | Modified | Four citations and the timeout table |
| `.skilled/skills/sk-doc/shared/scripts/check_no_new_snake_case.py` | Modified | Exact-name exemption for the marker |
| `.skilled/skills/sk-doc/scripts/tests/test_no_new_snake_case_guard.py` | Modified | Test for the exemption and its limit |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modified | Versions cached through the probe seam |
| `.skilled/hooks/shared/hook-stdin-deadline.test.mjs` | Modified | v1 stub first on PATH |
| `.skilled/skills/system-spec-kit/runtime/eslint.config.mjs` | Modified | `^_` rule scope |
| `.skilled/skills/system-spec-kit/runtime/cli/**` (36 files) | Modified | The 133 cli lint errors |
| `.skilled/skills/system-spec-kit/runtime/hooks/**`, `tests/hooks/spec-gate-devin.test.mjs` | Modified | The four lint errors outside `cli/` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each defect was reproduced first: the suite on a fresh checkout, the lint count, the hook test on this host, the guard over the audited range and the slow-probe variant of the resolution case. Then each fix was applied and the same command rerun. The hook tests ran five times each. The changelogs were validated, the sk-doc compiled-routing manifest was re-minted after its version step and `compiled-route-guard.cjs` reported every hub fresh.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Put the default suite in `skill-advisor-stress.yml`, after the stress step | It already filters on the advisor and builds it, and the stress suite keeps the fresh state it has always run in |
| No separate Python step | `python-compat.vitest.ts` already runs that file inside the default suite |
| Prime the version cache through `resolveOpencodeVersion`'s `deps.probe` | The sync resolver inside `evaluate` has no seam of its own but reads the same cache, keyed on the same file identity |
| Leave the 3-second timeout test as it is | It tests the timeout itself, and the fixed `PROBE_TIMEOUT_MS` has no seam to shorten |
| Add `main` to the naming guard's push trigger with no path filter | A filter that has to list every top-level root saves no runner minutes and would narrow the `skilled/v*` coverage, as `spec.md` section 10 records |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor `npm test` after a fresh scan | PASS, 150 of 150 files, 1253 tests, 2:40.51 wall |
| Guard unittest | PASS, 9 of 9 (1 failure before the exemption) |
| Guard replay since `583316d0833e` | 18 names before, 8 after, no marker left |
| `check-gate-inputs.sh` | `RESULT: PASSED`, failures 0 |
| `dispatch-rule-checks.test.mjs`, 5 runs | PASS, 42 of 42 each |
| `hook-stdin-deadline.test.mjs`, 5 runs | PASS, 21 of 21 each (19 of 21 before) |
| Runtime `npm run check` | PASS, 0 errors, 0 warnings (239 errors and 5 warnings before; the last three warnings were unused directives that predated this phase, deleted) |
| cli `npm run typecheck`, `npm run check` | PASS, exit 0 before and after |
| cli `npm test` | vitest 191 of 194 files and 2239 of 2259 tests passed with 3 files and 20 tests skipped, and every legacy and validation suite passed, exit 0, the same as the baseline run before the change |
| Spec-gate suites | PASS, 152 pass, 0 fail |
| `compiled-route-guard.cjs` | All hubs fresh or excused |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The advisor job's timeout is an estimate.** It has no run history with the default suite yet. Resize it from 40 measured runs with the `job-shape-rules.md` formula.
2. **The guard still reports 8 names since `583316d0833e`.** They are session transcripts and one archive folder, outside these findings.
<!-- /ANCHOR:limitations -->

---
