---
title: "Implementation Summary"
description: "One manifest of the shipped template surface with a generated derived key, one shared segmenter, the line 3 wording, the empty marked block and the two CI path filters, with every gate run and its output recorded."
trigger_phrases:
  - "agents md manifest implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/001-manifest-and-template-block"
    last_updated_at: "2026-10-30T13:05:00Z"
    last_updated_by: "code-agent"
    recent_action: "Implemented the manifest, segmenter, generator and both root-file edits"
    next_safe_action: "Start 002-check-engine against the fresh manifest"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/assets/agents-md-manifest.json"
      - ".skilled/commands/doctor/scripts/agents-md-manifest.cjs"
      - ".skilled/commands/doctor/scripts/lib/agents-md-sections.cjs"
      - ".skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs"
      - "AGENTS.md"
      - ".github/workflows/spec-kit-check.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The manifest's measured size is 82,621 bytes (33,830 of body copy and hashes, 12,667 of twelve release-tag bodies, 8,052 of router rows)"
      - "An untagged branch holds no history bodies and the check reports the count rather than failing"
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
| **Spec Folder** | 001-manifest-and-template-block |
| **Completed** | 2026-10-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A repository can now ask what the template ships without reading the template. The manifest names every shipped section with the prefix that finds it, the pins the tooling greps out of the root file with the consumer of each one, the runtime copies a repository is expected to hold, the delivery budget, the block markers and the shipped router rows. Its `derived` key is a byte-exact copy of the shipped bodies with a sha256 each, the twelve release-tag bodies that are no longer current, and the source router's trigger and index rows.

Three callers now share one definition of a section: the generator that writes the manifest, the check engine that will grade a repository in `002-check-engine`, and the embed engine that will rewrite a document in `003-embed-engine`. A section starts at a heading of level 1 to 4, runs to the next heading, is measured in bytes because the delivery budget is a byte count, and the repository-owned block is cut out before segmentation because its heading looks exactly like a shipped one.

The template itself gained the two edits the design decided: line 3 now says a repository's own content goes in the marked block at the end or in rules its router routes, and the file ends with one empty marked block for a repository to fill.

### Phase 1: manifest and template block

**Measured, on this worktree, after the work:**

| Fact | Value |
|------|-------|
| `AGENTS.md` | 27,888 bytes (27,673 after the line 3 edit, plus a 215-byte empty block) |
| Deepest delivery anchor | byte 16,368 (`#### Blast-Radius Management`), 16 bytes of headroom to 16,384 |
| Shipped sections | 44, from 44 level-1 to level-4 headings |
| Pins | 30: 21 delivery anchors, 4 verification labels, the Iron Law line, the byte ceiling, the gate 1 lookup, the gate 3 contract, the child exemption, the gate 5 router, the section order and root presence |
| Manifest | 82,621 bytes: 33,830 of body copy and hashes, 12,667 of release history, 8,052 of router rows, 17,348 of authored keys |
| Suite | 24 cases, 24 pass, 0 fail |
| Doctor suite | 36 files, 723 tests, 723 pass, 0 fail, 7 suites |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Created | The shipped manifest: authored keys plus the generated `derived` key |
| `.skilled/commands/doctor/scripts/agents-md-manifest.cjs` | Created | `--check` (default, read-only) and `--write`, source repository only |
| `.skilled/commands/doctor/scripts/lib/agents-md-sections.cjs` | Created | The segmenter, the sha256 helper, the classifier and the anchor measurement |
| `.skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs` | Created | 24 cases, written before the modules existed |
| `AGENTS.md` | Modified | Line 3 wording, then the empty marked block at the end |
| `.github/workflows/spec-kit-check.yml` | Modified | `AGENTS.md` and `REPO RULES.md` added to both path-filter lists |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Tests first. The suite was written and run before either module existed, and its failure is `Cannot find module '../lib/agents-md-sections.cjs'`, saved in `scratch/t003-failing-test.txt`. Then the segmenter, the manifest's authored keys and the generator, each run against the growing suite. The two root-file edits came after the generator, so the regeneration in the last step compares the edited document with the edited manifest instead of with a copy that no longer exists.

The authored keys were assembled by a throwaway authoring script rather than typed, because 44 match prefixes and 21 anchor texts are transcription work and a single wrong prefix would surface as a refused heading. The script lived outside the repository and wrote only the manifest; the result is the authored file, and the generator is the only thing that has written its `derived` key since.

`scratch/baseline.txt` holds the six baseline commands recorded before the first edit and the same six re-run at the end, so the delta is in one file.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One manifest with an authored part and a generated part | A consumer has no other copy of the template, and a hand-kept copy drifts silently while a generated one fails a check |
| Pins name the file that consumes them, plus the string that file still holds | A pin list with no consumer check is a comment that rots, and a pin whose consumer changed wording is the same rot with a different cause |
| Both root edits land in one commit with the regenerated derived key | The freshness check compares the two, so splitting them makes CI red between commits |
| The measured budget lives in `derived.budget`, not in the authored budget | A hand-kept byte count goes stale the moment someone edits line 3, and `--check` would not notice |
| The router is optional, the template is not | A repository may route no rules at all, which is an answer; a missing `AGENTS.md` is a precondition failure |
| The generator's history stops at the last six release tags | All 140 tags hold 384 distinct non-current bodies and 542 KB, which is two thirds of the manifest for bodies no consumer of the current release can encounter |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:deviations -->
## Deviations From The Packet Documents

The packet's own documents say **46 shipped sections** in REQ-001, AC-001, T005 and SC-001. The file carries **44** headings of level 1 to 4, and the design's own section table also lists 44 rows, in exactly the order the manifest records. The number 46 appears to be a miscount carried from prose into the child spec. 44 is what the segmenter reports, what the manifest holds and what the suite asserts. Nothing else in the packet depends on the figure beyond the PASS line, which names the count it measures.

The design's section table was measured before the line 3 edit. That edit is 6 bytes shorter and sits above every heading, so every start byte below it moves up by 6 and the deepest delivery anchor moves from 16,374 to 16,368. The manifest records the post-edit offsets and the suite compares the two tables section by section.

`derived.repo_rules` also records whether the router is present, which the design does not spell out but its own A11 row requires, where an absent router is a reported state and not a failure.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` | exit 0: `PASS: 44 sections, 30 pins, derived matches AGENTS.md` |
| `node --test .skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs` | `tests 24, pass 24, fail 0` |
| `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` | exit 0, `  16368  #### Blast-Radius Management` |
| `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs --check` | `PASS: 1 instruction files carry the root Gate 1 lookup.` |
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | `7 suite(s) passed, 0 failed`, 723 tests, 0 fail |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <child> --strict` | `RESULT: PASSED` |
| `wc -c < AGENTS.md` | 27888 |
| `git status --porcelain` | the six files in `spec.md` section 3, plus this packet's own `scratch/` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The history key depends on release tags.** A branch with no matching tag writes an empty history and the check reports the count instead of failing, so a section that only matches an older release classifies as `unknown-base` there.
2. **The history is bounded to six tags.** A repository that skips more than six releases loses `stale-known` for the sections it missed and reports `unknown-base` for them, which is conservative: the check can no longer prove that replacing the section is safe.
3. **`--check` reads this repository's own release tags**, so a run without git reports the history as unread and skips that comparison while still comparing the bodies.
4. **One checklist row cannot pass as written.** `rg -ni 'api[_-]?key|token|secret|password'` over the manifest matches the word "token" in the shipped sentence "Exact text, token or symbol", because the manifest is a byte-exact copy of the template. The secret-shaped scan prints nothing; the reasoning is in `CHK-030` in `tasks.md`.
<!-- /ANCHOR:limitations -->

---
