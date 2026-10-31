---
title: "Implementation Summary"
description: "New packets carry seeded phrases in all five documents, the judge flags every template's defaults, and the approved cleanup removed default rows from 1,319 live files. All 541 touched folders pass strict validation, after fixing 21 that were already failing."
trigger_phrases:
  - "template phrase cleanup round two implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/012-template-phrase-cleanup-round-two"
    last_updated_at: "2026-10-07T16:50:00Z"
    last_updated_by: "claude-opus-5.5"
    recent_action: "Fixed the 21 failing folders and closed AC-006"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-template-phrase-cleanup-round-two-close"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-template-phrase-cleanup-round-two |
| **Completed** | 2026-10-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A packet is no longer indexed under a phrase that describes a template. The judge now knows all five templates' defaults, new packets seed phrases about their own work in every document, and one approved pass removed the default rows from 1,319 live files.

### Phase 12: template-phrase-cleanup-round-two

`phrase-judge.mjs` gained three frozen sets for the plan, tasks and implementation summary templates, and the `template-default` check matches any of the five sets. `create.sh` seeds each of those documents with one slug phrase when the exact four-line block is present, and it trims trailing stop words from the description-derived phrase using a 48-word list shared with the cleanup tool.

The cleanup now handles the three new kinds and two new list shapes. A partial list loses only its default rows and keeps author rows byte for byte, a list made only of defaults is reseeded like a full block, and an eight-word `spec.md` phrase that ends on a stop word is trimmed or dropped. After the operator approved the apply, 1,319 files changed across 541 folders, and a second run reported 0 files to change.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs` | Modified | Three new frozen default sets and the five-set match rule |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified | Seeds the three new documents and trims trailing stop words |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs` | Modified | New kinds, partial-block rules, the stop-word trim and the `spec.md` reseed |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs` | Modified | Counts the new kinds and the partial carriers |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-cleanup.vitest.ts` | Modified | Tests for both partial rules, the trim and the second run |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts` | Modified | Scaffold seeds, the description trim and the template pins |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts` | Modified | Asserts a phrase from each of the five templates judges as `template-default` |
| `specs/` corpus, 541 folders | Modified | 1,319 files lost default rows or got the trimmed reseed |
| 21 of those folders | Modified | Pre-existing validation failures fixed: missing frontmatter fields, empty trigger lists, one description, one continuity block, one status cell and missing anchors or template headers |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three cli-pi lanes built the change in order, because they share files: the judge sets and document seeds, then the partial-block rules, then the stop-word trim. The orchestrator reviewed each diff and reran the gates on the final code. The CLI suite ended at 161 files passed and 3 skipped with 1636 tests passed, 19 skipped and 0 failed, which is 11 more passing tests than the 1625 baseline. `bash -n create.sh` exited 0 and the executable bit held, and `node --check` passed on both tools.

The corpus ran dry first: 1,319 files would change and 21 were skipped for no opening frontmatter delimiter. Then the operator approved the apply as its own commit, and a second run reported 0 files to change, so the change is idempotent. The derived metadata was re-derived for all 541 touched folders with 0 failed. Strict validation passed for 520 folders. The other 21 failed on rules that read content the cleanup never changed, such as missing `importance_tier` or `contextType` fields, empty trigger lists and anchor checks, so they were failing before it. The operator chose to fix them here. A script copied 43 missing fields from each folder's `spec.md`, the orchestrator made the small hand fixes, and three cli-pi lanes added anchors and template headers around unchanged prose. All 21 then passed, so all 541 touched folders pass. The census now reports 0 live carriers for all five templates in every track, and archived packets keep 470 carriers that this phase deliberately leaves alone.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Match only the exact default rows, never a prefix or a partial phrase | An author phrase that happens to contain a template's words must survive untouched |
| Keep author rows byte for byte in a partial block and add no seed | The list already names the packet's work, so only the template's rows are noise |
| Reseed a defaults-only list like a full block, even a partial set of defaults | A list of nothing but defaults carries no author intent, regardless of how many defaults it has |
| Trim only the first-eight-words description phrase and only in `spec.md` | The cut-off sentences come from one fixed derivation, and the rule stays narrow enough to test |
| Share one 48-word stop list between the shell and the tool, pinned by a test | The two producers must agree, or a packet seeded by one is rewritten by the other |
| Split the work across three lanes in order | The lanes share files, so parallel edits would conflict |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Judge and seeding suites | PASS - 1636 tests passed, 19 skipped and 0 failed, up from the 1625-pass baseline |
| Stop-word pins | PASS - `create-root-numbering.vitest.ts:212` pins the shell list to `DESCRIPTION_STOP_WORDS` |
| Cleanup rules | PASS - dry runs stay byte-identical, author phrases survive, partial and defaults-only lists are handled, and the second run changes nothing |
| Dry run before apply | PASS - 1,319 files would change, 21 skipped for no frontmatter delimiter, and the orchestrator reviewed 10 samples |
| Operator-approved apply | PASS - 1,319 files changed across 541 folders, 0 archived and 0 scratch, and a second run reports 0 changes |
| Derived metadata re-derivation | PASS - 541 folders repaired and 0 failed |
| Strict validation over the 541 touched folders | PASS - 520 passed on the first run, and the 21 pre-existing failures each passed after their fix |
| Census after apply | PASS - 0 live carriers for all five templates in every track |
| Trigger index check | PASS - `generate-trigger-index.mjs --check` exits 0 after the rebuild |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`create.sh` repeats the detect-and-replace block five times.** A shared helper would be smaller, but it was not done to keep the change tested and narrow.
2. **The cleanup exits 2 whenever a file has no opening frontmatter delimiter.** The 21 skipped files are reported and never rewritten, and the exit code is 2 even when nothing else is wrong.
3. **Archived packets keep their template carriers.** The census reports 470 carriers under `z_archive/`, and this phase leaves them untouched on purpose.
<!-- /ANCHOR:limitations -->

---
