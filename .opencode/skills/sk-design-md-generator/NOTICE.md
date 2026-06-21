# Attribution

The vendored tool under `tool/` is derived from **design-md-generator** by Jason (`jasonhnd`).

- Source: https://github.com/jasonhnd/design-md-generator
- License: MIT (see `tool/LICENSE`)
- Pinned upstream commit: `b591554648f9d3a4547b912ee2e81b6cd7ec3304`
- Vendored: 2026-06-21

## What was changed during vendoring

The tool is vendored faithfully, with these adjustments:

- Generated HTML reports (`examples/**/*.html` — `proof.html`, `report.html`, `preview.html`) were dropped. They are regenerable outputs of `report-gen.ts` / `preview-gen.ts` / `proof.ts`, not source, and add ~2 MB of embedded-image HTML. The gold-standard `DESIGN.md`, `tokens.json`, and `writing-notes.md` per example are kept.
- The redundant per-platform entry files (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`) were dropped. This skill's `SKILL.md` is the single entry point for this framework.
- The upstream `SKILL.md` (the full 3-phase workflow specification) was preserved as `tool/design-md-workflow.md` to avoid a second `SKILL.md` colliding with this skill's routing entry point.

No source code under `tool/scripts/` or knowledge under `tool/resources/` was modified.
