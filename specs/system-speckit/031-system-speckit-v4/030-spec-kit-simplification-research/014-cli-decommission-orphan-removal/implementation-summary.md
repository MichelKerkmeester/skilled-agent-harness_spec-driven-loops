---
title: "Implementation Summary: CLI decommission orphan removal"
description: "Six orphan files and a dead test left the CLI package with their rows, the four lines child 007 left behind were corrected, and the legacy and validation lanes were repaired and wired into CI after rotting unseen."
trigger_phrases:
  - "orphan removal summary"
  - "what shipped cli orphans"
  - "legacy lane repaired"
  - "validation lane in ci"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/014-cli-decommission-orphan-removal"
    last_updated_at: "2026-09-07T06:45:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "None; continue with lane 003's second round"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/cli/tests/test-scripts-modules.js"
      - ".github/workflows/spec-kit-check.yml"
    session_dedup:
      fingerprint: "sha256:6a6ac0b69709c215b6160c61148b5f77afe97631ac690c1474f99c70b0979868"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: CLI decommission orphan removal

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-cli-decommission-orphan-removal |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The CLI lane's second round verified child 007 and then enumerated what round one had certified by directory. Of its twelve removal rows, six held under a census that included relative imports; two named modules the workflow and the tool sanitizer import relatively, and four named tools that documents describe as manual commands or that the doctor wires. The six went, with every README, catalog and hooks row that named them and the two legacy test blocks that were the only consumers of one of them.

### The lines child 007 left behind

The environment-variables reference, a second document child 008 never touched, taught `SPECKIT_ROLLOUT_PERCENT` as read by a function that exists nowhere; the row is gone and the other 26 variables all have readers. Two documents kept the looser phase-child regex; three fixtures advertised the removed adaptive-fusion flag; the architecture tree tag said the CLI indexes and runs evals; the retrieval frontmatter reader's comment named the pre-nesting path. Each was corrected, and two census documents were corrected with them: the resource-map row is superseded because the reducer's emit path reaches the extractor, and lane 005's alias citation no longer names the dead loader.

### Two lanes that had rotted unseen

The CI workflow ran the vitest project only, while `npm test` also runs the legacy module lane and the bash validation suites. Both failed at baseline for reasons that had accumulated since nobody watched them: the legacy lane still tested the embeddings module child 009 removed; the validation-system test addressed the pre-nesting `scripts/` layout; the frozen compliant fixture carried a derived fingerprint its own documents no longer matched; and the extended suite expected that fixture to be silent where the base suite documents its folder-token warning. The fixture's documents were restored byte for byte after an attempted rewrite, its fingerprint was re-derived with the runtime's own function, the expectations were aligned, and both lanes now run in CI after the vitest project.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `rules/check-doc-pointers.sh`, `utils/phase-classifier.ts`, `utils/validation-utils.ts`, `observability/live-session-wrapper.ts`, `lib/cli-capture-shared.ts`, `lib/validator-registry.ts`, `check-links.sh`, `tests/test-naming-migration.js` | Deleted | Orphans |
| `utils/index.ts` | Modified | Barrel drops the validation helpers |
| `tests/test-scripts-modules.js` | Modified | Validation-utils and embeddings blocks removed |
| `tests/test-validation-system.cjs`, `tests/test-validation-extended.sh` | Modified | Nested layout; fixture expectations |
| `test-fixtures/053-template-compliant-level2/graph-metadata.json` | Modified | Derived fingerprint re-derived |
| `test-fixtures/00{2,3,4}-*/implementation-summary.md` | Modified | Removed-flag sentence dropped |
| Five CLI READMEs, two catalog documents, the hooks README, the telemetry README | Modified | Rows for removed files; the rule path |
| `environment-variables.md`, `template-compliance-contract.md`, `runtime/lib/spec/README.md`, `ARCHITECTURE.md`, `retrieval/lib/frontmatter.mjs` | Modified | Leftover lines |
| `.github/workflows/spec-kit-check.yml` | Modified | Legacy and validation lanes |
| Lane 002 and lane 005 confirmed findings | Modified | Round-two section; two corrections |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every removal row was re-run for importers in every path form before a file moved, which turned two rows into kept rows. The removals went in one pass; the first rebuild still caught two relative imports the search pattern had not covered, and those modules were restored before anything else. The three test lanes were run as the gate, and the two that CI never ran were repaired fault by fault, each reproduced first. The commit was assembled in a private index.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the modules relative imports reach | A no-importer claim that only searched workspace paths is not evidence |
| Keep the maintenance commands and the doctor-wired sync scripts | A CLI entrypoint has no importers by design; the doctor asset names the pi scripts as its targets |
| Restore the frozen fixture's documents and restamp only its fingerprint | Five suites and the parity probes pin its content; its own note says change the expectation, never the fixture |
| Add the lanes to CI rather than narrow the claim | The lanes are what `npm test` runs; a claim narrowed to the vitest project would document the rot instead of ending it |
| Leave the runtime root project for its own child | Seven failing files with distinct causes; pulling it into CI red would not fix them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Rebuild; `npm run check`; dist freshness | Exit 0; all watched outputs fresh |
| Legacy module lane | 262 passed, 0 failed, 5 skipped |
| Validation lane | Three suites RESULT: PASSED; 95 of 95, 31 of 31, 83 of 83 |
| Suites that pin the compliant fixture | validation-engine-coherence 15 passed; spec-doc-structure passed; validation-optional-anchors fails as it did before, in the root project |
| Full CLI vitest project | 138 files and 1,355 tests pass, 19 skipped, zero failures |
| Residue search for the removed names | Only changelog entries |
| sk-doc validator on touched READMEs | Exit 0 on all twelve |
| `validate.sh <this child> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The runtime root project still fails** Seven files, fifteen tests, with causes ranging from status derivation to write-scope checks; the next child owns them.
2. **The validation-system test skips its JSON level case** It reads two fields the output no longer carries; the skip is reported, not silent.
<!-- /ANCHOR:limitations -->

---
