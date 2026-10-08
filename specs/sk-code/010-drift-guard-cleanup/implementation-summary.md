---
title: "Implementation Summary"
description: "The sk-code drift-guard wrapper passes again: the alignment-drift verifier now skips recorded spec evidence and experiment fixture trees, which cleared all 60 errors without touching a recorded file."
trigger_phrases:
  - "drift guard cleanup implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/010-drift-guard-cleanup"
    last_updated_at: "2026-10-08T04:40:00Z"
    last_updated_by: "session"
    recent_action: "Narrowed the alignment-drift verifier and verified the wrapper exits 0"
    next_safe_action: "Commit the verifier, its test and this packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-drift-guard-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-drift-guard-cleanup |
| **Completed** | 2026-10-08 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sk-code drift-guard wrapper exits 0 again. All 60 errors came from files that are records, not shipped code, so the verifier now leaves those records out of its scan and the records stay exactly as they were written.

### Narrow the alignment drift guard so it skips recorded evidence and experiment fixtures

The verifier's file walk now asks one more question before it checks a file: does the file sit under an `evidence` directory below a `specs` directory, or under a directory named `fixture` or ending in `-fixture`? If so, it is skipped. Only directory names count. An `evidence` folder in shipped source, such as sk-vision's `src/evidence/`, is still scanned because it has no `specs` ancestor.

On this tree the rule skips 428 tracked files: 406 spec evidence files and 22 files in fixture trees. Outside `specs/`, the only skipped files are the five in sk-create-repo-rule's `rule-experiment-fixture/`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py` | Modified | Adds `is_unscanned_record_path` and calls it from `iter_code_files` |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/test_verify_alignment_drift.py` | Modified | Adds `test_skips_spec_evidence_and_fixture_trees` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash, dispatched through cli-pi at max thinking, wrote the predicate and the test from a one-change brief. The orchestrating session read the diff, reran the tests and the wrapper, and listed every tracked file the rule skips to confirm no shipped code was hidden. The diff needed no correction.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Skip the records rather than fix them | Editing evidence changes what a packet recorded, and a fixture's shape is the point of the fixture |
| Require a `specs` ancestor for `evidence` | Shipped source also uses `evidence` as a folder name, and it must stay covered |
| Match `fixture` and `*-fixture`, not the plural `fixtures` | The singular forms clear every error, and the verifier already downgrades plural `fixtures` paths to WARN |
| Skip inside the walk, not by severity | Recorded files should not count as scanned at all, the same way excluded directories do not |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python3 -m pytest .skilled/skills/sk-code/sk-code-opencode/assets/scripts/test_verify_alignment_drift.py -q` | PASS, 27 passed, exit 0 (26 before) |
| `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` | PASS, `all 2 guards PASSED`, exit 0. Scanned 22120 files, 0 errors, 247 warnings (before: exit 1, 22548 scanned, 60 errors, 254 warnings) |
| `git status --porcelain` | Only the verifier, its test, this packet and `specs/sk-code/graph-metadata.json` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The rule is judged below the scan root.** A folder above the checkout named `specs` or `*-fixture` cannot hide the tree, but scanning from a subfolder such as `specs/` itself would not skip that subfolder's `evidence` folders. The wrapper always scans from the repository root.
2. **247 WARN findings remain.** They do not fail the gate and are a separate cleanup. Seven warnings left with the skipped files.
<!-- /ANCHOR:limitations -->

---
