---
title: "Implementation Summary"
description: "The chart packet's twenty-two releases now number below 1.0, and the four live surfaces that still named files the corpus cleanup deleted have been reconciled."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/039-prerelease-versioning-and-residue"
    last_updated_at: "2026-09-10T19:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Renumbered the changelog below 1.0 and closed the cleanup residue"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/sk-design-chart/SKILL.md"
      - ".opencode/skills/sk-design/leaf-manifest.json"
      - ".opencode/skills/sk-design/command-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-10-chart-prerelease-versioning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 039-prerelease-versioning-and-residue |
| **Status** | Complete |
| **Completed** | 2026-09-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The chart packet had been counting like a released product. It ran from `v1.0.0.0` to `v2.5.0.0`, which reads as two public majors with a breaking change between them, and it has never shipped. The releases now run `v0.1.0.0` to `v0.22.0.0` in the same order, and the number tells the truth about what the packet is. Alongside that, the corpus cleanup of the last two phases deleted fifteen files and told nobody, so four live surfaces were still naming things that are gone.

### Phase 1: prerelease-versioning-and-residue

You get a version number that means something. Below 1.0, the contract is that anything may change, which is the contract this packet actually offers, and the twenty-two entries stay in the order they shipped so the history still reads straight through. Every citation moved with them: an entry that says a repaint landed in a prior release now names the prior release by its new number, and the two references that date a decision do the same.

The residue is the other half. The hub's leaf manifest listed seven deleted deliveries, a deleted gallery and the whole deleted cursor Style Reference, and the hub doctor check was failing two invariants on it. Three manual-test scenarios told a reader to copy or read a file that is not there, which makes a test that cannot be run. The hub's command description advertised twenty-six forms against twenty-nine on disk, which is what the advisor reads when it decides where a chart request goes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-design-chart/changelog/` (22 files) | Modified, renamed | The releases renumber below 1.0 in shipping order, titles and version fields following |
| `sk-design-chart/SKILL.md` | Modified | The anchor moves to `0.22.0.0`, seeded by hand because the engine takes a maximum |
| `sk-design-chart/references/` (5 files) | Modified | Two carry moved citations, all five inherit the new anchor |
| `sk-design-chart/manual-testing-playbook/` (10 files) | Modified | Three scenarios repointed at the templates, all ten inherit the anchor |
| `sk-design-chart/README.md`, `scripts/README.md` | Modified | Inherit the anchor |
| `sk-design-chart/scripts/tests/fixtures/references/` (4 files) | Modified | In the engine's declared scope, so they inherit too |
| `sk-design/leaf-manifest.json` | Modified | Re-minted from disk, fifteen dead leaves dropped |
| `sk-design/command-metadata.json` | Modified | The catalog count matches the corpus |
| `system-spec-kit/runtime/data/trigger-index.json` and retrieval fixtures | Modified | Regenerated, so a lookup resolves the renamed files |
| `033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` | Modified | Two form counts and the Style Reference claim corrected |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The renumber was scripted, not hand-edited, because twenty-two files with cross-citations is exactly where a manual pass drops one. A script derived the mapping from the directory in release order, so the numbers came from the filesystem rather than from a table someone typed.

The first pass was wrong and the diff caught it. Its citation pattern used a word boundary before the digits, which never matches after a `v`, so no in-body citation moved at all while every frontmatter field did. The same pattern also rewrote `generator=1.4.0.0` in a provenance example, which is a different tool's version. Reading every changed line before doing the renames is what surfaced both. The pass was reverted whole and redone with a pattern that matches only a `v`-prefixed number, which fixes the miss and the false positive together.

Verification ran from the final state, not from memory of an earlier run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Sequential minor bumps rather than preserving the old major boundary | Below 1.0 the contract already says anything may break, so encoding a second breaking boundary inside the minor segment would carry a meaning the scheme does not have. Sequential keeps order and count intact. |
| Only a `v`-prefixed number is treated as this packet's version | A bare four-part number in a provenance example belongs to the md generator. The prefix is the only signal that separates the two, and the first pass proved that guessing gets it wrong. |
| The anchor was seeded by hand before running the engine | The anchor is the maximum of the frontmatter and the highest changelog, so a downward move needs the frontmatter lowered first or the engine keeps the number being retired. |
| The apply was bounded to an explicit path list | Running it by skill name would have rewritten the three sibling design modes as well, which is drift correction outside this packet's scope. |
| Historical spec packets keep naming the old changelog paths | Each records an action taken against a file that existed at the time. Rewriting them would make a packet claim it created a file it never created. |
| The version engine's path guard was worked around, not patched | It is a defect in a script shared by every skill, and fixing it here would put an unreviewed change to shared tooling inside a documentation packet. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-corpus.cjs` | PASS. `errors: 0`, `RESULT: PASSED` |
| `node --test scripts/tests/` | PASS. 84 tests, 84 pass, 0 fail |
| `parent-skill-check.cjs` on the hub | PASS. Zero invariant failures. `10b-byte-drift` and `10c-target-collision` both green, having failed before the re-mint |
| `frontmatter-version.mjs verify` on the packet | PASS. `ok=20 skip-no-frontmatter=3`, zero mismatches |
| `check-frontmatter-versions.sh` repository-wide | PASS. 2,961 files, `ok=2949 skip-no-frontmatter=12`, exit 0 |
| Retrieval corpus manifest | PASS. Zero old changelog paths, twenty-two new ones |
| `lookup-trigger-index.mjs -- "chart catalog form"` | PASS. Resolves a `sk-design-chart/references` path |
| Non-owned version left alone | PASS. `references/design-md-theming.md:148` still reads `generator=1.4.0.0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Eight historical spec packets still name an old changelog path.** Each names it inside a Files-to-Change table describing work that shipped when the file carried that name. A reader following one of those entries will not find the file. Leaving them intact keeps the record honest, and remapping them is an operator decision rather than a mechanical follow-on.

2. **The version engine's explicit-path guard refuses `manual-testing-playbook.md`.** The guard is meant to reject an unsupported catalog or playbook root directory, but it tests every path segment, so the index file inside a supported root matches its own directory's prefix and is rejected. The workaround is to drop that one path from the list and set it by hand to the value the engine computed. This affects `--paths` mode only, so the repository-wide gate is unaffected.

3. **One sk-doc test fixture is stale from the earlier cleanup, not from this packet.** `sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` lists `sk-design-chart/assets/examples`, a directory phase 36 removed. The staleness is present at the commit before this work began, so it belongs to that phase rather than this one.
<!-- /ANCHOR:limitations -->

---
