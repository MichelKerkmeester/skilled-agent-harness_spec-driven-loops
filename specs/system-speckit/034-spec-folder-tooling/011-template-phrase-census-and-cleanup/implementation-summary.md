---
title: "Implementation Summary"
description: "New Level 2 packets carry phrases about their own work, the acceptance criteria template defaults are flagged by the judge, and the operator-approved cleanup removed the exact template block from 509 files across 375 packets. The trigger index is rebuilt and fresh."
trigger_phrases:
  - "template phrase census and cleanup implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/011-template-phrase-census-and-cleanup"
    last_updated_at: "2026-10-07T13:12:41Z"
    last_updated_by: "deepseek-v4.1-flash"
    recent_action: "Wrote the implementation summary for the template phrase census and cleanup and refreshed the continuity block"
    next_safe_action: "None, the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "011-template-phrase-census-and-cleanup-close"
      parent_session_id: null
    completion_pct: 90
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
| **Spec Folder** | 011-template-phrase-census-and-cleanup |
| **Completed** | 2026-10-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A packet that used to be indexed under `acceptance criteria` now carries phrases about its own work, in new packets from the moment they are scaffolded and in the existing corpus after one operator-approved pass. The change matters because those four words said nothing about any packet and matched hundreds of them.

### Phase 11: template-phrase-census-and-cleanup

`phrase-judge.mjs` gained `AC_TEMPLATE_DEFAULT_PHRASES` for `acceptance criteria`, `closure gate`, `ac traceability` and `waiver adr`, and the template-default check now matches either template's set. `create.sh` seeds a new Level 2 packet's `acceptance-criteria.md` with one slug phrase, the way it already seeds `spec.md`, and only when the exact template block is present.

Two tools complete the loop. `template-phrase-census.mjs` is read-only: it counts exact-block carriers per track with live and archived kept apart, and counts the plan, tasks and implementation summary defaults informationally for a later phase. `template-phrase-cleanup.mjs` previews every proposed replacement without writing, and writes only under `--apply`. After the operator reviewed the dry run, the apply replaced the exact block in 509 files (195 `spec.md`, 314 `acceptance-criteria.md`) across 375 packets.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs` | Modified | The four acceptance criteria defaults join the `template-default` class |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified | New `acceptance-criteria.md` files are seeded from the packet slug |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs` | Created | Read-only carrier counts by track, live and archived apart |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs` | Created | Dry-run-first cleanup with `--apply` and `--include-archive` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-cleanup.vitest.ts` | Created | Tool tests, including idempotence and duplicate suppression |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts` | Modified | Asserts the seeded phrase, the absence of `closure gate` and the template pin |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts` | Modified | Asserts the new judge class on real phrases |
| `specs/` corpus, 375 packets | Modified | The approved apply replaced the exact block in 509 files, 0 archived |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The tools landed with their suites. The seeding and judge tests grew from the 76-test baseline to 80 tests across 3 files, and `template-phrase-cleanup.vitest.ts` covers the dry run writing nothing, an apply that keeps author phrases, a second apply that changes nothing, broken frontmatter being skipped, `scratch/` and `containment/` being ignored, one seeded acceptance criteria phrase and duplicate suppression. At the end the whole spec-kit CLI folder passed with 161 files and 3 skipped, 1621 tests passed, 19 skipped and 0 failed.

The corpus ran dry first. The operator approved `--apply` on 2026-10-07, the apply changed 509 files in 375 packets with 0 archived, and a second dry run reported 0 files to change. Each touched packet's derived metadata was then re-derived (375 folders, 0 repairable left). Strict validation found only two classes of failure over the 375 packets: three packets whose seeded phrase duplicated an author phrase, fixed by the orchestrator and now passing. Phase 008 passed once the index was rebuilt. The tool was then changed to drop seeded duplicates, so the hand fix cannot recur.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Replace only the exact template block, never a partial match | A packet that kept a default phrase on purpose must never be half-rewritten |
| Dry run by default with `--apply` as the only write path | The edit touches hundreds of packets, so the operator reviews the file list first |
| One seeded phrase in `acceptance-criteria.md`, built from the packet slug | The slug is always derivable, needs no description, and names the work |
| Leave archived packets out unless `--include-archive` | Archived packets are historical record, and the run touched 0 of them |
| Drop seeded phrases that duplicate an existing author phrase | Three packets failed strict validation on exactly this, and the fix removes the class rather than the three instances |
| Count the other templates' defaults informationally and leave them | Plan, tasks and implementation summary cleanup is deliberately a later phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Seeding and judge suites | PASS - 3 files, 80 tests, up from the 76-test baseline |
| Cleanup tool tests | PASS - dry run writes nothing, apply keeps author phrases, second apply is idempotent, broken frontmatter skipped, scratch and containment ignored, duplicate suppression |
| Whole spec-kit CLI folder | PASS - 161 files passed and 3 skipped, 1621 tests passed, 19 skipped and 0 failed |
| Census on the real `specs/` tree | PASS - 4,412 `spec.md` and 489 `acceptance-criteria.md` scanned |
| Operator-approved apply | PASS - 509 files in 375 packets, 0 archived, 7 files skipped for a leading HTML comment, and a second dry run reports 0 files to change |
| Derived metadata re-derivation | PASS - 375 folders, 0 repairable left |
| Strict validation over the 375 touched packets | PASS - all 375 pass after the three duplicate-phrase packets were fixed and the index was rebuilt |
| Trigger index rebuild | PASS - `--check` exit 0, 0 stale and 0 missing |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Some seeded spec phrases read as cut-off sentences.** The description-derived phrase is the first eight words of the description, so a seed can end mid-sentence, for example "the hub answers from its new home but". This is the same algorithm `create.sh` uses for new packets, so a fix belongs to that algorithm, not this phase.
<!-- /ANCHOR:limitations -->

---
