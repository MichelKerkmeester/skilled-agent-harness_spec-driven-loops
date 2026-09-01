---
title: "Implementation Summary: Moving the Frontmatter Contract Into Its Mode"
description: "Both frontmatter documents moved out of the hub's shared tier into the owning mode, and all 34 consumer files were repointed, matching the phase 001 inventory's prediction exactly. One substitution covered the bulk because both homes are direct children of the hub; the real work was six references written in other forms and five links inside the moved documents that no reference probe could see."
trigger_phrases:
  - "frontmatter migration summary"
  - "outbound link blind spot"
  - "sibling depth relative path"
  - "no alias added migration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/003-content-migration"
    last_updated_at: "2026-09-01T08:42:58Z"
    last_updated_by: "implementation"
    recent_action: "Moved both frontmatter documents into the mode and repointed 34 consumers"
    next_safe_action: "Proceed to phase 004 (routing integration)"
    blockers: []
    key_files:
      - "../001-inventory-and-contract/inventory/consumer-inventory.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-content-migration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-content-migration |
| **Completed** | 2026-09-01 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The frontmatter contract now lives in the mode that owns it.
`.opencode/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` (939 lines) and
`.opencode/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` (148 lines) were
moved out of the hub's shared tier with `git mv`, and every consumer was repointed at the real location.
No alias was added, so the path a consumer reads is the path the file is at.

### The Move, and Why It Was Cheap

`shared/` and `sk-create-frontmatter/` are both direct children of the hub, and both documents kept the
same `assets/` and `references/` subdirectory names. Every relative reference therefore kept its
existing `../` prefix and only the path segment changed. One substitution over 28 files handled the
bulk of the 34 consumers.

### The Six References the Substitution Could Not Reach

Six references were written in a form the bulk substitution does not match, and each was fixed by hand:

- Three files under `shared/references/` used `../assets/frontmatter-templates.md`, a sibling reference valid only from inside `shared/`. Each had to become `../../sk-create-frontmatter/assets/...`: `validation.md:544`, `core-standards.md:337`, `quick-reference.md:351`.
- Two used the same-directory form `./frontmatter-templates.md`: `shared/assets/llmstxt-templates.md:850` and `sk-create-changelog/assets/changelog-template.md:286`.
- `shared/scripts/quick_validate.py` (lines 12, 254, 261, 266) and `sk-create-skill/scripts/package_skill.py` (line 334) carried a skill-relative `references/frontmatter-versioning.md` inside docstrings and inside strings printed to the operator. Those now read `sk-create-frontmatter/references/frontmatter-versioning.md`.

### The Links the Probe Could Not See

Four links inside the moved documents also broke, and the phase 001 probe was structurally incapable of
finding them: the probe matches the two filenames, and these links point out of the moved files at
something else. They were found by scanning both documents for every relative link.

- `frontmatter-templates.md` lines 938 and 939: `../references/core-standards.md` and `../references/validation.md`, now `../../shared/references/...`.
- `frontmatter-versioning.md` lines 147 and 148: `../scripts/frontmatter-version.mjs` and `../scripts/check-frontmatter-versions.sh`, now `../../shared/scripts/...`.
- Line 126 of the versioning document named `scripts/check-frontmatter-versions.sh` in prose and now names `shared/scripts/...`.

Three other outbound links survived unchanged, because both the old and the new home sit two levels
under the hub.

### What the Validators Actually Prove

`quick_validate.py` reports `Skill is valid!` and `package_skill.py --check --strict` reports
`Result: PASS` against the new location. That claim is narrower than it sounds, and the narrowness is
worth stating: phase 001 established that neither script parses either document. Both carry the paths
in docstrings and in strings printed to an operator. So "runs clean against the new location" means the
scripts still work and no longer print a path that leads nowhere. It does not mean a parse was repaired,
because there was never a parse.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/shared/assets/frontmatter-templates.md` | Moved | To `sk-create-frontmatter/assets/frontmatter-templates.md` via `git mv`, history preserved |
| `.opencode/skills/sk-doc/shared/references/frontmatter-versioning.md` | Moved | To `sk-create-frontmatter/references/frontmatter-versioning.md` via `git mv`, history preserved |
| `.opencode/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` | Modified | Its own lines 938 and 939 repointed at the shared reference tree, plus its two internal cross-links preserved unedited |
| `.opencode/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` | Modified | Lines 126, 147 and 148 repointed at the shared script tree |
| `.opencode/skills/sk-doc/shared/references/{validation.md,core-standards.md,quick-reference.md}` | Modified | The three `shared/`-internal sibling references, rewritten at their new depth |
| `.opencode/skills/sk-doc/shared/assets/llmstxt-templates.md` | Modified | Same-directory `./` form repointed |
| `.opencode/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` | Modified | Same-directory `./` form repointed; this link was broken before the move and the repoint is what fixed it |
| `.opencode/skills/sk-doc/shared/scripts/quick_validate.py` | Modified | Four skill-relative paths in a docstring and in operator-facing strings |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | Modified | One skill-relative path inside a validation-failure message |
| 25 further consumer files across the mode packets, the hub tier and the command YAML | Modified | Repointed by the bulk substitution |
| `.opencode/skills/sk-doc/leaf-aliases.json` | Unchanged | Deliberately: `git diff` is empty and the table still holds its original 5 entries |

34 consumer files were modified in total, exactly matching the count the phase 001 inventory predicted.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines were captured before the first `git mv`: 113 link-resolver failures across the hub, vitest at
54 files and 683 tests passing, and `leaf-aliases.json` at 5 entries. The move then ran in one pass,
followed by the bulk substitution and the eleven hand edits. Verification ran in both directions. A
repo-wide scan asked whether anything still points at the old home, and returned only frozen surfaces:
three benchmark report bundles under `sk-doc/benchmark/reports/compiled-routing/`, one line in
`system-skill-advisor/manual-testing-playbook/auto-indexing/provenance-and-trust-lanes.md` that is closed
to this packet by instruction, and three entries in the released changelog `sk-doc/changelog/v1.8.0.0.md`
that record where the file used to be and stay true. The link resolver asked the opposite question,
whether anything now points at nothing, and the hub total fell from 113 to 112 with frontmatter-related
failures at zero. The vitest suite was unchanged at 54 files and 683 tests.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Repoint every consumer instead of adding an alias | An alias is how the shared tier hid this ownership problem in the first place; layering a second indirection would make the next move harder rather than easier |
| Keep `assets/` and `references/` as siblings inside the mode | It preserves the four internal cross-links between the two documents unedited, and it is the reason a single substitution was safe over 28 files |
| Scan both moved documents for every relative link, not just for the two filenames | The reference probe cannot see a link that points out of a moved file, and four such links were broken by the move |
| Leave the released changelog, the benchmark bundles and the advisor playbook line alone | They record where the file was, which stays true; rewriting frozen history to match a current path makes the history wrong |
| Fix `changelog-template.md:286` in passing rather than as separate work | It was already broken before the move, and repointing it is precisely what fixes it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Repo scan for both old paths | PASS — survivors are three frozen benchmark bundles, one out-of-scope advisor playbook line, and three released-changelog entries (REQ-001, SC-001) |
| `quick_validate.py` against the new location | PASS — `Skill is valid!` (REQ-002, SC-002) |
| `package_skill.py --check --strict` against the new location | PASS — `Result: PASS` (REQ-002, SC-002) |
| `git diff .opencode/skills/sk-doc/leaf-aliases.json` | PASS — empty; the table still holds its original 5 entries, none of them frontmatter (REQ-003, SC-003) |
| Hub-wide link integrity, before and after | PASS — 113 failures before, 112 after, frontmatter-related failures at 0; the one removed failure was the pre-existing broken link at `changelog-template.md:286` |
| vitest suite | PASS — 54 files, 683 tests, unchanged across the move |
| Modified-file count against the phase 001 prediction | PASS — 34 files, exactly as predicted |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The hub's compiled routing went stale as a side effect.** Changing the disk tree alone dropped it
   to `stale-manifest` with no routing input edited. Nothing in this phase's scope could refresh it,
   because the mode was still unregistered. Phase 004's refresh closed it.
2. **"Both validators run clean" is a narrower claim than it reads.** Neither script parses either
   document; they carry the paths in docstrings and in operator-facing strings. The proof is that they
   still work and no longer print a dead path, not that a parse was repaired.
3. **Three surfaces still name the old path, correctly.** The released `sk-doc/changelog/v1.8.0.0.md`
   keeps its three entries recording where the file was, three benchmark report bundles under
   `sk-doc/benchmark/reports/compiled-routing/` are frozen output, and one line in
   `system-skill-advisor/manual-testing-playbook/auto-indexing/provenance-and-trust-lanes.md` is closed
   to this packet by instruction. A future reader scanning for the old path will find all four and
   should leave them alone.
4. **112 link failures remain across the hub.** None of them is frontmatter-related. They pre-date this
   packet and are outside its frozen scope.
<!-- /ANCHOR:limitations -->

---
