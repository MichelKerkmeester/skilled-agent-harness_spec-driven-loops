---
title: "Implementation Summary"
description: "The advisor runtime build now attests its own dist, so a freshly provisioned checkout holds the freshness record before any check reads it. The first freshness check no longer writes one into a folder that suites snapshot while they run."
trigger_phrases:
  - "build freshness record implementation summary"
  - "advisor build attestation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/040-build-freshness-record"
    last_updated_at: "2026-10-30T17:35:00Z"
    last_updated_by: "code-agent"
    recent_action: "Added build prepare and record steps, a contract test, and the 0.17.29.0 release"
    next_safe_action: "Operator reviews the diff and commits it"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/package.json"
      - ".skilled/skills/system-skill-advisor/runtime/tests/dist-build-record-contract.vitest.ts"
      - ".skilled/skills/system-skill-advisor/changelog/v0.17.29.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-040-build-freshness-record"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 040-build-freshness-record |
| **Completed** | 2026-10-30 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The advisor runtime build now leaves its own freshness record, so a checkout that was just built has one before anything reads the dist. Before this change the record appeared only when a freshness check happened to write it, and that write landed inside a folder other suites snapshot while they run.

### Record the advisor runtime dist build so a fresh build writes its own freshness attestation

The package gained a `prebuild` that runs the freshness CLI's `prepare-build` for both declared dist entries, `default` and `skill-advisor-cli`, and its existing `postbuild` gained `record-build` for both, after the data copy. The compile script itself is untouched: npm runs `prebuild` before `build` and `postbuild` after it, so the prepare step sees the source that is about to be compiled and the record step sees the entries it produced.

The record step is written as `record-build || write a checker cache`. A build that ran without a preparation cannot be attested, and that must not fail a compile that succeeded, so the fallback writes the same checker-origin record a check would have written. The spec-kit runtime makes the same call in its own build finalizer.

A contract test reads the freshness registry and asserts the two scripts name exactly the entries it declares. The registry, not the package, decides how many dist entries exist, so an entry added there without a matching step now fails a suite instead of leaving the next fresh provision to discover it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/package.json` | Modified | `prebuild` prepares both entries, `postbuild` records both |
| `.skilled/skills/system-skill-advisor/runtime/tests/dist-build-record-contract.vitest.ts` | Created | Holds the scripts to the freshness registry's declared entries |
| `.skilled/skills/system-skill-advisor/SKILL.md` | Modified | Frontmatter version 0.17.29.0 |
| `.skilled/skills/system-skill-advisor/changelog/v0.17.29.0.md` | Created | Release note |
| `.hermes/skills/system-skill-advisor/SKILL.md` | Modified | Regenerated copy of the same frontmatter |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The records were deleted by absolute path, the package was built, and the two files were read back to confirm `origin: "build"`. The doctor suite ran as the very next command, and both records were hashed before and after it to show the run wrote nothing. The earlier behaviour was reproduced by deleting the records again, running the probe once, and wrapping that run in the quality suite's own snapshot helper, which reported the created record as the change. The whole doctor runner then ran green with the records in place.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use npm's `prebuild` and `postbuild` rather than a named script the build calls | The lifecycle hooks leave the `build` script that provisioning and every documented rebuild command already name completely unchanged, so nothing else has to learn a new step order. |
| Fall back to a checker-origin cache when `record-build` reports no preparation | The record exists to prove a build happened, and a build that cannot prove it is still a build. Writing the weaker record keeps the freshness check truthful and lets the compile's own result decide whether the command fails. |
| Assert the scripts against the freshness registry in a test | The registry owns how many dist entries exist. A test that read the package alone would agree with whatever the package says, including a package that had stopped covering an entry. |
| Leave the record filename and the freshness engine untouched | Both are shared with every other package in the registry, and the write that the doctor suite saw was a symptom of the missing build attestation, not of where the record lives. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` after deleting both records | PASS, exit 0, `preparation recorded` twice and `attestation recorded` twice |
| Both `.dist-freshness-system-skill-advisor-runtime-*.json` records | PASS, each carries `"version":2,"origin":"build"` |
| `node --test .skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs` as the first command after the build | PASS, 20 tests, 0 failures, exit 0 |
| Both records hashed before and after that run | PASS, byte-identical, so the run wrote nothing into the dist folder |
| Probe run with the records deleted and no rebuild, wrapped in the quality suite's snapshot helper | FAIL as expected, `the run changed files on disk` naming the created checker-origin record |
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` with the records deleted and no rebuild | FAIL as expected, `sk-code-quality-config.test.cjs` reported `the run changed files on disk` naming the created record |
| `npm --prefix .skilled/skills/system-skill-advisor/runtime run postbuild` with no prepared record | PASS, exit 0; `record-build` reported no preparation for both entries and the fallback wrote a checker-origin cache for each |
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | PASS, 7 suites passed, 0 failed, exit 0 |
| `vitest run tests/dist-build-record-contract.vitest.ts` in the advisor runtime | PASS, 2 tests |
| The same test with one entry removed from `prebuild` | FAIL as expected on the prepare assertion, restored afterwards |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/040-build-freshness-record --strict` | PASS, `RESULT: PASSED` |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh specs/system-skill-advisor/040-build-freshness-record` | PASS, no placeholders |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Deleting a record after a build brings the old behaviour back for one run.** The next freshness check writes a checker-origin record, and a suite snapshotting that folder during the write can still report it. Delete the records and rebuild, rather than only deleting them, whenever a checkout has to be handed to another process.
<!-- /ANCHOR:limitations -->

---
