---
title: "Implementation Summary"
description: "A track can now hold declared named sub-tracks that every track-level tool follows, and the doctor keeps a host's own .env.example and points .skilled/specs at the host's specs."
trigger_phrases:
  - "named subtracks and host repos implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/044-named-subtracks-and-host-repos"
    last_updated_at: "2026-11-07T15:26:58Z"
    last_updated_by: "generate-context"
    recent_action: "Implemented and verified all 19 tasks; acceptance criteria all Met"
    next_safe_action: "Run the review gate, then commit and push"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh"
      - ".skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts"
      - ".skilled/commands/doctor/scripts/symlink-engine.cjs"
    session_dedup:
      fingerprint: "sha256:bb5db22ec6a183584eec3729bbe64e3ca9fd4bec53dc5dcc66a3244962a7593b"
      session_id: "scaffold-044-named-subtracks-and-host-repos"
      parent_session_id: null
    completion_pct: 90
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 044-named-subtracks-and-host-repos |
| **Completed** | 2026-11-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now file packets as `specs/<track>/<sub-track>/<NNN>-<slug>/` and every track-level tool follows them: track roots, refresh, the pre-push sweep, `create.sh`, validation, recursive validation, archive and parent derivation. A flat track with no sub-track behaves exactly as before, so no existing repository changes on upgrade.

### Named sub-tracks and three host-repository fixes

A sub-track is declared, never guessed. You give the folder a `description.json` with `level: "sub-track"` and a `graph-metadata.json` in the track-root shape, and the track lists it in its `children_ids`. Its packets number from `001` on their own, archive into its own `z_archive/`, and take the sub-track as their `parent_id`. A non-numbered folder without the declaration, or a symlinked folder, gets one advisory line from the sweep and is never followed. Barter's phase 004, which groups tracks of 276 and 282 packets, was waiting on exactly this.

The doctor now keeps a host's own `.env.example` instead of linking the vendored one over it, and reports it as `project-owned`. A new host also gets `.skilled/` built as a real folder, so `.skilled/specs` points at the host's own `specs/`, or is left out when the host has none. The host trigger index is documented with the explicit `--index` the Gate 1 lookup needs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/lib/track-roots.mjs` | Modified | Returns declared sub-tracks with their own packets in both views, plus advisory diagnostics |
| `runtime/cli/spec/refresh-track-roots.mjs` | Modified | Accepts `--track <track>/<sub-track>` |
| `runtime/cli/spec/sweep-track-roots.mjs` | Modified | Sweeps sub-tracks and prints the diagnostics without changing the exit code |
| `runtime/cli/spec/create.sh` | Modified | Refreshes the sub-track and its track after creating a packet in it |
| `runtime/lib/validation/orchestrator.ts` | Modified | Treats a declared sub-track folder as a container, like a track root |
| `runtime/cli/spec/validate.sh` | Modified | Recurses through declared sub-tracks, skipping archives and symlinks |
| `runtime/lib/graph/graph-metadata-parser.ts` | Modified | Derives a sub-track packet's `parent_id` from the declaration |
| `runtime/cli/spec/repair-derived.cjs` | Modified | Recomputes `parent_id` from a packet's new location after a move |
| `runtime/cli/spec/archive.sh` | Modified | Accepts a sub-track as a packet home, directly below its track only |
| `.skilled/commands/doctor/scripts/symlink-engine.cjs` | Modified | `project_owned` entries, and in-place build of a folder holding a host-relative link |
| `.skilled/commands/doctor/assets/symlink-manifest.json` | Modified | Marks `.env.example` project-owned |
| `runtime/cli/tests/fixtures/subtrack-tree.mjs`, `subtrack-fixture.vitest.ts`, `validate-subtrack.vitest.ts` | Created | The shared sub-track fixture, its smoke test and the validation cases |
| Seven existing test files | Modified | Failing-first cases for each behavior above |
| `references/structure/folder-structure.md`, `README.md`, `.skilled/commands/speckit/search.md`, `runtime/data/README.md` | Modified | The sub-track level and host trigger-index mode |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline came first: 145 vitest cases across eight files and 46 doctor node tests, all passing. One fixture holds every shape a sub-track can meet. Workers wrote each new case and kept its failing run in `scratch/red-*.log` before changing code: four on Luna xhigh fast until that model's quota ran out, then DeepSeek flash max for the rest. Every worker's result was rerun here before it was accepted. The end-to-end check built a scratch repository, created a flat packet and a sub-track packet with `create.sh`, then ran recursive validation, strict validation of the sub-track and the refresh.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The sub-track is marked in `description.json`, and `graph-metadata.json` keeps the track-root shape | No schema migration: every existing reader of track metadata still reads a sub-track |
| Undeclared and symlinked folders get advisory diagnostics only | A push that passed before must not start failing; REQ-008's "exits 1" contradicted T006, the risk table and the open question, so it was corrected to advisory |
| A new host gets `.skilled/` built in place when the source holds a host-relative link | A whole link resolves `.skilled/specs` into the Skilled checkout's own specs, the wrong tree for a host. The operator chose this default change on 2026-11-07 |
| A sub-track counts as a packet home only directly below its track | A folder deeper down that shares a sub-track's name must not become an archive home |
| Declared sub-tracks follow the reader's candidate-name and filesystem rules | `subtrack-predicate-parity.vitest.ts` checks numbered, hidden, `node_modules`, archive, symlinked and packet-shaped folders across validation, archive and graph-parent consumers |
| Recursive validation reaches a sub-track's packets, not their phases | A flat track's run stops at its packets, so a packet's result does not depend on whether it sits in a sub-track |
| `repair-derived` writes a parent only where a sub-track or an archive is involved | After a move the merge kept a stale parent flagged for review. A flat packet's stored parent and its review flag are left alone, because they wait for a person; the review gate caught an earlier version that rewrote them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Packet test set, `plan.md` section 5 | 10 vitest files 178/178 pass (baseline 145, plus 33 new); doctor node tests 50/50 (baseline 46) |
| Full cli and core suites, after the review fixes | cli project 2346 passed, 0 failed, 20 skipped; core 4243 passed, 0 failed, 21 skipped |
| End-to-end reproduction (`scratch/t019-reproduction.log`) | Recursive validation of `specs/demo` reaches `demo/sub/001-nested-probe`; `validate.sh specs/demo/sub --strict` prints `RESULT: PASSED`; `refresh-track-roots.mjs --track demo/sub` exits 0 |
| `refresh-track-roots.mjs --track demo/missing` | Exits 2 and names the path |
| Sweep on this repository, old code against new | Same exit codes in the working-tree and commit views; the new code adds seven advisory lines for symlinked folders in `ai-systems/` |
| Track discovery time on this repository | 0.04 to 0.05 s before and after |
| `bash -n` on `create.sh`, `validate.sh`, `archive.sh` | Exit 0 |
| sk-code alignment check and quality gate on the 19 changed code files | 0 errors, 0 findings |
| `@review` gate | First pass FAIL with one P1 (flat parents rewritten) and five P2s; all six fixed test-first. The recheck passed with every finding resolved; its one new P2, a stored parent with `..` segments, was fixed by accepting only an exact `<track>/<sub>` id |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One level only.** A sub-track holds numbered packets, not another sub-track. A deeper layout is not reported: discovery never looks inside a sub-track, so it produces no diagnostic.
2. **A symlinked sub-track is never followed.** Copy or move the folder into the track and declare it, and the tools pick it up.
3. **A fresh `/doctor:symlink` now builds `.skilled/` as a real folder** with a link per child, where it used to make one whole link. An existing whole-link install still checks as linked and is left alone, but a whole-linked `.skilled` reads the checkout's `specs/` through `.skilled/specs`, not the host's; relink with `--mode merge` when the host's own `specs/` must stay reachable.
<!-- /ANCHOR:limitations -->

---
