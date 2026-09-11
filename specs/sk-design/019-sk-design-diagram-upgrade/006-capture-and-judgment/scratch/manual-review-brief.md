Gate 3 is pre-resolved: your write authority is `specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment/scratch/evidence/` (one file, named below) and the render directory named below. Do not ask the documentation-scope question. Do not edit any file under `.opencode/`. This is a read-only review that writes exactly one report.

You are a senior design reviewer with a rendering pipeline and a checker at hand. Your job: manually check every shipped template and example of the diagram skill, one by one, and record what a careful human would find that the automated checker cannot.

## Scope (38 files)

- `.opencode/skills/sk-design/sk-design-diagram/assets/templates/*.html` (4)
- `.opencode/skills/sk-design/sk-design-diagram/assets/examples/*.html` (34)

Plus, as context you check the files against (read, do not review): `SKILL.md`, `references/foundations/style-guide.md`, `references/foundations/derivation-record.md`, `references/catalog.md`, `assets/color/diagram-palette.json`, `assets/templates/README.md`, `assets/examples/README.md`.

## Method — per file, in this order

1. Read the whole file. Note: structure (title/desc wiring, one `<svg>` with `viewBox`, `aria-labelledby`), the palette block (`/* DIAGRAM_PALETTE:BEGIN skin=… */` … `END`), marker defs versus markers used, connector geometry, text sizes, label boxes versus label lengths, anything hard-coded that the skin should own, copy quality (typos, placeholder text, sentences that do not match the drawing).
2. Render it fresh and LOOK at the PNG with the Read tool. Render all files once up front:
   `node .opencode/skills/sk-design/shared/scripts/render-screenshots.cjs .opencode/skills/sk-design/sk-design-diagram/assets /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/2bce8375-95be-49d4-89d7-21a303845583/scratchpad/manual-review/render`
   If that renderer fails, say so in the report and review the committed PNGs under `.opencode/skills/sk-design/sk-design-diagram/screenshots/` instead, stating which you used.
3. Judge what you see: overlapping or clipped text, labels that overflow their boxes, arrows that miss their targets or cross needlessly, misaligned nodes, uneven spacing, contrast that looks wrong to the eye even if the gate passes, a focal point that is missing or in the wrong place, a diagram that does not answer the question its catalog row says it answers, a skin that does not match the file's declared skin, a dark or terminal skin that leaks light-skin values.
4. Compare the file against its catalog row (`references/catalog.md`) and against the README that indexes it.

Also run once and quote the result lines: `cd .opencode/skills/sk-design/sk-design-diagram && node scripts/check-diagram-corpus.cjs | tail -5`.

## Output — exactly one file

Write `specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment/scratch/evidence/manual-review-opus.md` with:

1. A header: date, model, how you rendered, the checker result line.
2. A table with one row per file (38 rows, in directory order): `file | skin | verdict (PASS / P1 / P2 / P3) | one-line summary`. Every file gets a row, including the ones that pass.
3. A findings section: one entry per finding, numbered, with `file:line`, severity (P1 = a reader is misled or something is broken; P2 = visibly wrong but understood; P3 = polish), what you saw, and the concrete fix (the exact attribute or line you would change). Findings the automated checker already covers are not findings here; say only what a human eye adds.
4. A "Systemic" section: patterns that repeat across files (say which files), so the fix can be one change.
5. A "Confirmed clean" paragraph: what you checked across all 38 and found nothing on.

Rules: verdicts come from what you actually rendered and read, never from the checker or from the catalog description. If you could not view a PNG, say so for that row rather than guessing. Keep prose plain and specific; no praise, no hedging. Do not start or stop any git operation. Finish the whole set — 38 rows — before writing the summary sections.
