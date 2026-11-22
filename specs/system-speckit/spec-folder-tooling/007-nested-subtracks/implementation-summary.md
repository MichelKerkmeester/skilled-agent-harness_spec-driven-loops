---
title: "Implementation Summary"
description: "A track can now hold two levels of declared sub-tracks, so specs/mcp/mcp-tooling/clickup-figma/001-* is a valid home. Depth three is refused with a diagnostic, and every one-level tree reads byte-identically to before."
trigger_phrases:
  - "nested subtracks implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/007-nested-subtracks"
    last_updated_at: "2026-11-21T07:10:55Z"
    last_updated_by: "generate-context"
    recent_action: "Implemented two-level sub-tracks; suite, sweep and review all green"
    next_safe_action: "Commit the change from this worktree after operator review"
    packet_purpose: "Purpose: A level-1 sub-track can hold declared sub-tracks, every tool treats a level-2 sub-track like a level-1 one, depth three is refused with a diagnostic, and a one-level tree produces the same output as before."
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/nested-subtrack.vitest.ts"
    session_dedup:
      fingerprint: "sha256:d1d1df034c5389d779fbcccce66d8121c924aebabaac8b6ba105025cbe84eb51"
      session_id: "scaffold-007-nested-subtracks"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "4f8b79d7-b621-4417-a2d6-53ceb5cb2630"
      workspace: "/Users/michelkerkmeester/worktrees/public/505-mcp-browser-use-hub"
      savedAt: "2026-11-21T07:10:55Z"
      locatorKind: "transcript_path"
      version: 1
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-nested-subtracks |
| **Completed** | 2026-11-21 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now file packets two sub-track levels below a track, as in `specs/mcp/mcp-tooling/clickup-figma/001-*`. A declared folder one level deeper is refused by every tool, and a tree that uses one level reads exactly as it did before.

### Allow a declared sub-track to hold declared sub-tracks (max two sub-track levels under a track)

A level-1 sub-track can hold numbered packets or declared level-2 sub-tracks, never both, the same rule a track follows. A level-2 sub-track holds only numbered packets, keeps its own `z_archive/` and numbers its packets from `001`. Its `graph-metadata.json` names the level-1 sub-track as its parent, and the level-1 sub-track's `children_ids` lists it. `create.sh --track`, `validate.sh`, `archive.sh`, `relocate.mjs` (moves and `--declare-subtrack`), `repair-derived.cjs`, the graph parser and the sweep all accept the second level.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` | Modified | One recursive scan per view reads a second declared level and reports a third; exports `MAX_SUB_TRACK_DEPTH` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs` | Modified | Mixed check covers a level-1 sub-track |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified | Three-segment `--track`, refusal at four, refresh of every level, fit advisory judged at level 1 |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Modified | Recognises and recurses into level-2 sub-tracks |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modified | Exempts a level-2 sub-track from packet rules |
| `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts` | Modified | Derives a level-2 sub-track as its packet's parent |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Modified | Same parent rule as the parser |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs` | Modified | Moves into, declares and refuses past two levels; mixed preflight on a level-1 sub-track |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modified | Archive, restore and archive listing inside a level-2 sub-track |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-subtrack.vitest.ts` | Created | Twelve two-level cases across every tool above |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts` | Modified | Depth-limit case moved from three to four segments, plus an undeclared three-segment case |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/relocate.vitest.ts` | Modified | Depth-limit case moved from two to three sub-track levels |
| `.skilled/skills/system-spec-kit/references/structure/folder-structure.md` | Modified | States the two-level rule |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/track-root-children-lists.md`, `spec-packet-relocation.md`, `sub-track-proposal.md` | Modified | Catalog entries for the two-level rule |
| `.skilled/skills/system-spec-kit/SKILL.md`, `.skilled/skills/system-spec-kit/runtime/cli/lib/README.md`, `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modified | One line each for the second level |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The cli vitest suite and the sweep were captured into `scratch/` before any source edit. Each predicate was then extended in place, the runtime was rebuilt with `npm --prefix .skilled/skills/system-spec-kit run build`, and the new test file was run first against the change (12 pass) and then against the previous sources (11 fail). `scratch/one-level-parity.mjs` compared the old and new reader on three one-level fixtures and this repository. The full suite and the sweep were rerun last. Nothing was committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Inside a level-1 sub-track only a declared folder is acted on | A level-1 sub-track's other folders were never reported, so reporting them now would change one-level output |
| A level-2 sub-track can be created by `relocate.mjs` only inside an existing declared level-1 one | One map declaring both levels at once needs ordering the declare step does not have; declaring level 1 first is one extra command |
| `suggest-subtracks.mjs` stays one level | Its proposals work on one track at a time and the contract asks for no nested proposals |
| Name checks run before a parent declaration read in `archive.sh` and `validate.sh` | Review found the first order started one node process per numbered packet beside a sub-track, a cost one-level trees did not pay before |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| cli vitest, baseline (`scratch/vitest-cli-baseline.txt`) | 1 failed, 208 passed, 3 skipped files; 2593 passed, 20 skipped tests. The one failure is the checkout guard in `relocate-real-pipeline.vitest.ts`, tripped because this packet was scaffolded while that run was in progress |
| cli vitest, after (`scratch/vitest-cli-after.txt`) | PASS: 210 passed, 3 skipped files; 2606 passed, 20 skipped tests |
| Root-project tests covering the parser and orchestrator (10 files) | PASS: 154 passed. No baseline was taken for these |
| Sweep (`scratch/sweep-baseline.txt` vs `scratch/sweep-after.txt`) | PASS: one diagnostic before and after; the only diff is `spec-folder-tooling: declared=7 actual=7` for this packet |
| One-level reader parity (`scratch/one-level-parity.txt`) | PASS: `identical=true` on all eight lines, working tree and commit |
| New tests against previous sources | 11 of 12 fail, so the tests detect the change |
| Code review (`@review`, gate validation) | APPROVED, no P0 or P1; P2 on check order fixed, P2 on REQ-005 wording fixed |
| Acceptance criteria | 9 of 9 Met, `acceptance-criteria.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The graph parser and `repair-derived.cjs` derive a parent for a declared folder four segments deep.** The reader refuses that folder, and no caller derives metadata for a folder without `spec.md`, so nothing reads the value. Returning null when the leaf declares a sub-track would make them match the reader.
2. **`relocate.mjs` cannot declare a level-1 and a level-2 sub-track in one map.** Run `--declare-subtrack <track>/<sub> --apply` first, then the map.
<!-- /ANCHOR:limitations -->

---

### Deviations From Plan

The depth-limit cases in `create-track-refresh.vitest.ts` and `relocate.vitest.ts` asserted the old limit and were moved one level deeper rather than left unchanged. `create.sh`'s sub-track fit advisory was also changed, because a level-2 `--track` would otherwise print a false "may fit better" line.

### Skill Updates

`system-spec-kit` `SKILL.md`, `references/structure/folder-structure.md`, three feature-catalog pages and two READMEs. `phase-definitions.md` makes no one-level claim and was left as is.

### Recommended Next Steps

Commit the change from this worktree. Optionally make the parser and repair writer return null for a declared four-segment leaf.

### Browser Testing Results

N/A: these are command-line tools with no browser surface.
