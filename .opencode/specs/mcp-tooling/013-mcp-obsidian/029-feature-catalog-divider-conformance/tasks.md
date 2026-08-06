# Tasks — mcp-obsidian feature-catalog divider conformance

- [x] T1: Confirm dividers are the house convention (cli/mcp leaves + other skills have them) and that the validator does not enforce them for `feature_catalog`. — root cause found.
- [x] T2: Read the exact sibling pattern from `cli/create-note.md` (divider before ## 2/3/4, none after intro, none between H3s).
- [x] T3: Confirm the 3 pre-existing `M` plugin leaves differ by non-divider text edits (no clobber risk).
- [x] T4: Write the deterministic, idempotent, code-fence-aware inserter.
- [x] T5: Apply to the 11 `plugins/*.md` leaves — 33 dividers inserted.
- [x] T6: Verify — all 11 at HR:3, `validate_document.py` 0 issues, diff `---`+blank only, re-run inserts 0.
- [x] T7: Bump SKILL.md 0.16.0.0 → 0.17.0.0, author changelog, confirm leaf-manifest `--check` (unchanged).
- [x] T8: Commit skill work + this record to v4.
