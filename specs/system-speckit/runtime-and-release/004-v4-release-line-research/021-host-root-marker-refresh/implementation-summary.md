---
title: "Implementation Summary"
description: "The marker refresh now runs against the host repository it is started from, its anchor proof counts every anchor the template emits, and Barter's marker census is measured on a copy."
trigger_phrases:
  - "host root marker refresh implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/021-host-root-marker-refresh"
    last_updated_at: "2026-11-09T13:50:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed the phase"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-lead"
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
| **Spec Folder** | 021-host-root-marker-refresh |
| **Completed** | 2026-11-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A host can now run the marker refresh against its own packets, and the proof behind it no longer refuses current documents.

### Phase 21: host-root-marker-refresh

`upgrade-legacy.mjs` asks `host-index.mjs` whether the caller's checkout is a host. If it is, that checkout is the repository: the default root is its `specs/` only, folders its git ignores are skipped, and stderr names the host and how many folders were skipped, with a warning when every folder was ignored. Elsewhere the script's own location still decides. `provenMarker` in `heal-spec-docs.cjs` now treats any anchor the template emits as part of the render, so `measured-behavior` and a phase child's `phase-context` no longer read as foreign, while a missing required or optional anchor still refuses. `refreshMarker` reports nothing for a document already at its level's marker. The lib and spec READMEs name the new pieces.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `SP/upgrade-legacy.mjs` | Modified | Host repository, default roots, ignored folders, stderr counts |
| `SP/heal-spec-docs.cjs` | Modified | Anchor sets in `provenMarker`, quiet current markers |
| `runtime/cli/tests/upgrade-legacy-host-root.vitest.ts` | Created | 3 host cases |
| `runtime/cli/tests/upgrade-legacy-refresh-markers.vitest.ts` | Modified | 3 proof cases |
| `runtime/cli/retrieval/lib/README.md`, `SP/README.md` | Modified | Name the new pieces |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines ran first. Four DeepSeek V4.1 Flash briefs through cli-pi wrote the host root, the skipped-folder count, the proof fix and the READMEs, because cli-codex is out of quota until 2026-11-13. The lead reviewed every diff, ran the touched suites and the cli project, and ran the refresh as a dry run over a scratch copy of Barter's spec documents twice: once to expose the proof defect, once to measure the census after the fix. Barter's own checkout was only read.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse `host-index.mjs` instead of adding a flag | One definition of a host for the trigger index and the refresh |
| Emitted anchors for extras, required and optional for missing | Checking missing against every emitted anchor refused 5,073 of 5,379 spec documents here |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| upgrade-legacy, refresh-markers, host trigger index (3 files) | 82 before, 85 after |
| Heal, template-structure, refresh-markers (6 files) | 130 before; 11 touched files 241 after, all pass |
| cli vitest project | 2433 passed before (phase 020 close), 2439 passed and 20 skipped after (+6 new) |
| Barter dry run, before the proof fix | 1009 packets, 0 refreshable, 1482 refused |
| Barter dry run, after | 1009 packets, 0 refreshable, 280 refused (202 no level, 77 missing anchor, 1 extra anchor) |
| validate.sh --strict | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Barter has nothing to refresh.** Every old-marker document in Barter's passing packets is refused for a real reason, so its markers need authoring: a level line in 202 packets' spec.md, missing sections in 77 documents. The about 3,400 v2.2 documents in research, lineage and archive folders are skipped by design.
2. **Stale host index.** The trigger index lookup trusts a host's committed `.speckit-index/`; the host's CI owns its `--check`.
3. **Host apply path.** The three host cases are dry runs; `--apply` in a host uses the unchanged apply code with no host-specific test.
<!-- /ANCHOR:limitations -->

---
