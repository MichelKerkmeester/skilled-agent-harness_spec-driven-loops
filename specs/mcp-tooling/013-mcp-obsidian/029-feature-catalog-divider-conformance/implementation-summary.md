# Implementation Summary — mcp-obsidian feature-catalog divider conformance

## Final state: complete — shipped to v4

The 11 plugin feature-catalog leaves now carry the Style-A section dividers they were missing, matching the sibling `cli/`/`mcp/` leaves and the repo-wide catalog convention.

## What changed

- **`feature-catalog/plugins/*.md` (11 files)** — a `---` divider inserted before every numbered H2 after `## 1.` (3 per file, **33 total**). Each leaf now matches its `cli/`/`mcp/` siblings: a rule between each numbered section, none after the intro, none between `###` H3s.
- **Housekeeping** — SKILL.md 0.16.0.0 → 0.17.0.0; `changelog/v0.17.0.0.md`. Leaf-manifest unchanged (it does not hash catalog leaf content).

## Root cause (why they were missing)

`validate_document.py` classifies these as the `feature_catalog` doc type, whose contract has `requiredSections: []` and no divider rule — so the leaves validated with 0 issues despite the gap, and the 026 reference/asset conformance pass never covered `feature-catalog/`. The dividers are a de-facto house convention (every other catalog leaf, including this skill's own `cli/` and `mcp/` leaves, has them), not a validator-enforced one — which is exactly why only these 11 slipped through.

## How

Deterministic in an isolated worktree from `origin/skilled/v4.0.0.0`: read the exact pattern from `cli/create-note.md`, wrote a code-fence-aware idempotent inserter, applied it to the 11 leaves. No LLM — dividers are structural, so scripting is the reliable tool.

## Verification (all passed)

- Every leaf reaches **3 body dividers**, matching the `cli/`/`mcp/` siblings; `validate_document.py` **0 issues** on all 11.
- `git diff` on `plugins/` is **exclusively** `---` + blank-line insertions (66 insertions, 0 content lines changed).
- Idempotent: a second inserter run reports **0** insertions.
- `charts.md` structure confirmed identical in shape to the `cli/create-note.md` sibling.

## Scar tissue

- The `feature_catalog` validator type intentionally does not enforce dividers, so this class of drift is invisible to `validate_document.py`. A cross-leaf divider-count check (compare each catalog leaf against its siblings) would catch it earlier; not added here.
- Confirms the earlier session lesson: for structural whitespace/divider work, a deterministic script beats an LLM pass.
