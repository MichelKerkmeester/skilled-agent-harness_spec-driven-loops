# Iteration 023 — NEW: Spec-vs-Code — implementation-summary File Lists vs Actual Existence

**Focus:** Do implementation-summary.md "Files Changed" tables match files that actually exist/were modified?
**Angle:** Cross-reference claimed surfaces against the filesystem.

## Findings

**009/001 implementation-summary.md (the one Complete 009 child)** lists changed files:
- `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` — EXISTS (verified in iter 010, `normalizeRegistrySchema` live)
- `.opencode/skills/deep-loop-runtime/tests/unit/fanout-merge.vitest.ts` — EXISTS (claimed 33/33 tests)

Both claimed files exist and contain the described changes. **009/001 spec-vs-code is CONSISTENT** — the rare honest case.

**Contrast — 008 parent implementation-summary.md:** claims nothing real because it IS the template (`"Replace template defaults on first save"`). Its "Files Changed" section is template boilerplate, not a real audit trail. So 008's spec-vs-code is INCONSISTENT (claims Complete, provides no real file list).

**Graph-metadata key_files vs reality (iter 005 deepened):** root graph-metadata lists `fanout-run.cjs` (exists) but OMITS `fanout-merge.cjs` (the file 009/001 just modified). So the metadata discovery layer missed a recently-modified implementation surface. This is a spec-vs-code drift: the metadata claims to list key files but is stale.

**Pattern:** implementation-summary.md file lists are accurate WHEN authored (009/001), but graph-metadata key_files are auto-derived and lag behind real modifications. This points to the metadata generator (`generate-context.js` / graph-metadata backfill) not re-running post-implementation as the root cause of key_files staleness — supporting the "one shared root cause" hypothesis for metadata drift.

## Evidence
[SOURCE: 009/001/implementation-summary.md:52-55 — files listed]
[SOURCE: fanout-merge.cjs exists with normalizeRegistrySchema]
[SOURCE: graph-metadata.json:45-62 — omits fanout-merge.cjs]

## newInfoRatio: 0.75 (spec-vs-code consistent for 009/001; metadata generator lag identified as key_files root cause)
