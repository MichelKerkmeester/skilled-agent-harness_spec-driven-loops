# Iteration 012 — NEW ROOT CAUSE: Salvage Naming Collision (fanout-salvage.cjs:112)

**Focus:** Identify the root cause of the duplicate iteration-file naming (padded vs non-padded).
**Angle:** Read fanout-salvage.cjs line-by-line; trace how filenames are constructed.

## Findings

**ROOT CAUSE FOUND — one bug, one line.** `fanout-salvage.cjs:112`:
```js
const iterFile = path.join(iterDir, `iteration-${iterNum}.md`);
```

`iterNum` comes from `record.iteration` (a NUMBER, line 97-98), so salvage writes **unpadded** filenames: `iteration-1.md`, `iteration-2.md`, ..., `iteration-9.md`, `iteration-10.md`.

But the NORMAL iteration-writing path (the agent/executor) writes **zero-padded** filenames: `iteration-001.md`, `iteration-002.md`, etc.

When salvage runs after real iterations already exist as `iteration-001.md`, it creates a DUPLICATE `iteration-1.md` placeholder (for failed-salvage: containing only `<!-- fanout_salvage_failed -->`). The two files coexist on disk, inflating apparent iteration counts and confusing any downstream glob that matches `iteration-*.md` (the reducer, merge, dashboard).

**Fix is a one-liner:** `iteration-${String(iterNum).padStart(3,'0')}.md`.

**Symptom quantification:**
- Codex review lineage: 50 padded + 9 non-padded single-digit (iteration-1.md .. iteration-9.md) = **59 total files for 50 iterations**.
- Round-1 archived glm research lineage: 18 padded + 18 non-padded = **36 files for 18 iterations** (every iteration had a salvage duplicate — a worse collision).
- Round-1 F-014 hypothesis (codex 0-findings caused by naming collision confusing the reducer glob) is now strongly supported: the reducer likely matched the non-padded placeholders (which are empty markers) instead of the padded real files, finding zero content.

## Evidence
[SOURCE: fanout-salvage.cjs:112 — `iteration-${iterNum}.md` unpadded]
[SOURCE: review/lineages/codex/iterations/ — 50 padded + 9 non-padded]
[SOURCE: research/research_archive/.../lineages/glm/iterations/ — 18 padded + 18 non-padded]

## newInfoRatio: 1.0 (root cause + one-line fix + symptom reconciliation across 3 lineages)
