# Iteration 012: Codex Review Iteration Numbering Collision (Salvage Placeholder Duplicates)

## Focus
- Scope: Codex review lineage iterations directory — dual numbering scheme collision
- Question: Why are there 100 iteration files (50 real + 50 placeholders)?

## Findings

### F-012: Codex review lineage has 100 iteration files — 50 real + 50 salvage-failure placeholders

**Severity: High (salvage path bug producing orphaned files + registry pollution)**

The codex review lineage `iterations/` directory contains **100 files**:
- `iteration-001.md` through `iteration-050.md` (zero-padded, real content) — 50 files
- `iteration-1.md` through `iteration-50.md` (non-zero-padded, salvage placeholders) — 50 files

[SOURCE: `review/lineages/codex/iterations/` directory listing]

**The placeholder files contain only:**
```html
<!-- fanout_salvage_failed: iteration N content not recoverable from subprocess stdout -->
```

[SOURCE: `review/lineages/codex/iterations/iteration-1.md`]

**What happened:** The codex CLI executor's subprocess output was not recoverable for all 50 iterations. The fan-out salvage path (`fanout_salvage_failed`) created placeholder files using a NON-zero-padded naming scheme (`iteration-1.md`) while the real iterations (when content WAS recoverable) used zero-padded naming (`iteration-001.md`).

**The collision:**
- Iteration 1 exists as BOTH `iteration-001.md` (real content: "Phase status and placeholder reconciliation") AND `iteration-1.md` (placeholder: "content not recoverable")
- This means iteration 1 was salvaged (placeholder created) AND later recovered (real file written) — but the placeholder was never cleaned up
- 50 duplicate placeholders exist alongside their real counterparts

**Connection to P1-002 and P1-003:**
This directly evidences the GLM review's P1-002 ("Unrecoverable iteration salvage can still produce a fulfilled lineage") and P1-003 ("Mixed salvage/missing-artifact failures skip the transient retry path"). The salvage path:
1. Created placeholders when content was unrecoverable (correct behavior)
2. Later recovered the content and wrote real files (correct behavior)
3. **Failed to clean up the placeholders** (bug)
4. The lineage still "fulfilled" because the real files exist, but the placeholders pollute the directory

**Impact:**
1. **Directory pollution:** 50 orphaned files that serve no purpose
2. **Iteration parsing ambiguity:** Any tool that globs `iteration-*.md` will match both `iteration-001.md` and `iteration-1.md`, potentially double-counting iterations
3. **Confusion:** A reader seeing both `iteration-001.md` and `iteration-1.md` doesn't know which is authoritative
4. **Codex registry empty (0 findings):** The salvage failures may have prevented findings from being written to the registry — the 50 placeholder iterations produced no findings because their content was "not recoverable"

**Root cause:** The salvage path writes placeholder files with `iteration-{N}.md` (non-padded) while the normal path writes `iteration-{NNN}.md` (zero-padded). The cleanup step that should remove placeholders when real content arrives is missing or uses a different glob pattern.

**Recommendation:**
1. **Immediate:** Delete the 50 placeholder files (`iteration-1.md` through `iteration-50.md`) from the codex lineage
2. **Bug fix:** Align the salvage path's naming convention with the normal path (zero-padded: `iteration-001.md`)
3. **Bug fix:** Add a cleanup step after successful recovery that removes the placeholder file with the matching iteration number
4. **Validation:** Add a check in the lineage reducer that flags duplicate iteration files (same N in padded and non-padded form)

## Novelty Justification
This is a NEW finding beyond all known leads. The dual-numbering collision (100 files where 50 should exist) is a concrete, quantified bug in the salvage path. The connection between empty placeholder files and the empty codex registry (0 findings) is a new causal hypothesis.

## What Was Tried and Failed
- Checked if the placeholder files contained any content beyond the HTML comment (they do not)

## Ruled-Out Directions
- The placeholders are NOT intentional (they say "content not recoverable" and real content exists alongside them)
