# Plan — mcp-obsidian feature-catalog divider conformance

## Approach

Done directly in an isolated worktree from `origin/skilled/v4.0.0.0`; deterministic, no fan-out.

1. **Confirm the target pattern** from a conformant sibling (`cli/create-note.md`): a `---` before each numbered H2 after `## 1.`, none after the intro, none between `###` H3s — yielding 3 dividers for a 4-H2 leaf.
2. **Write a deterministic inserter** — inserts `---` before every `## N.` with N≥2, skips one already preceded by a divider (idempotent), code-fence aware. No LLM (dividers are structural; scripting is the reliable tool).
3. **Apply** to the 11 `plugins/*.md` leaves.
4. **Verify** — each leaf reaches 3 body dividers, still passes `validate_document.py`, the diff is `---`+blank only, and a re-run inserts 0.
5. **Ship** — version bump, changelog, then commit skill work + this record to v4.

## Critical files

- Rewritten: `feature-catalog/plugins/*.md` (11 files).
- New: `changelog/v0.17.0.0.md`. Edited: `SKILL.md` (version).
- Inserter (scratch, not shipped): `add-catalog-dividers.py`.

## Verification

- `validate_document.py` exit 0 on all 11 leaves post-edit.
- `git diff` on `plugins/` contains only added `---` and blank lines (0 content changes).
- Idempotency: second inserter run reports 0 insertions.
- Each leaf's body-divider count equals its `cli/`/`mcp/` siblings' (3).

## Risk note

Low-blast, reversible — additive whitespace/rule insertions into docs, no runtime code and no content edits. The pre-existing uncommitted edits to 3 of these leaves in the main tree are small non-divider text changes on different lines, so they merge cleanly with these divider-only additions rather than conflicting.
