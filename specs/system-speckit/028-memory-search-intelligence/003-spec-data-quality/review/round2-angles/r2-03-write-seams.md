# R2-03 Write Seams (code-quality angle)

**Angle summary:** The 001 A1 spec names real seams at exact line numbers, but its byte-identity premise for the `description.json` seam is unachievable at the cited call site because the writer merges its argument against the existing file, and the two metadata seams serialize differently.

**Slice:** r2-03 write-seams. Scope read: `generate-context.ts` (`atomicWriteJson`), `workflow.ts` (`savePerFolderDescription` via `savePFD`, the `reviewPostSaveQuality` call), `folder-discovery.ts` (`savePerFolderDescription` body), `quality-loop.ts` (scorer and destructive loop), against `001-extend-quality-loop-authored/spec.md` and `plan.md`.

**Verdict on the program premise:** Nothing in 005 is built. These are findings against the SPEC PREMISE that the 001 docs assert, checked against the LIVE tree.

---

## Confirming-clean baseline (what checks out)

Every line number the 001 spec and plan cite is exact in the live tree:
- `atomicWriteJson` def at `generate-context.ts:398`, sole call at `:587` inside `updatePhaseParentPointer`. Verified.
- `runWorkflow` reached from `generate-context.ts:885`. Verified.
- `savePerFolderDescription` call sites at `workflow.ts:1683` and `:1720` (aliased to `savePFD` at the destructure on `:1668`, which is why a literal grep for the full name shows only `:1668`). The seam the spec names is real at both lines.
- `reviewPostSaveQuality` wired at `workflow.ts:1854` (import) and `:1855` (call). Verified.
- `computeMemoryQualityScore` at `quality-loop.ts:392`, export `:747`. `runQualityLoop` at `:582`. `reviewPostSaveQuality` export at `post-save-review.ts:573`. All verified.
- The scorer is pure: `computeMemoryQualityScore(content, metadata): QualityScore` (`quality-loop.ts:392`) reads and returns, it never writes a body. So report-only scoring carries no body-mutation risk at any seam.
- The out-of-scope guard is correct. `attemptAutoFix` does trim by `substring(0, DEFAULT_CHAR_BUDGET)` at `quality-loop.ts:465`, so the spec is right to fence `runQualityLoop`/`attemptAutoFix` off the authored body.
- The H2 reviewer seam is already the safe report-only shape: `workflow.ts:1852-1864` wraps the call in try/catch and logs on failure without aborting the workflow.

---

## FINDINGS

### F1 (P1, required) - H1b byte-identity is unachievable at the named seam

**Title:** `savePerFolderDescription` writes a merged payload, not its argument, so scoring at `workflow.ts:1683/1720` scores the wrong bytes.

**Type:** SPEC-PREMISE issue (the spec names the wrong layer to satisfy its own P0).

**Evidence:**
- Spec REQ-001 (`001/spec.md:108`) and scope H1b (`001/spec.md:73`) require serializing the `description.json` payload "so the scored bytes equal the written bytes" at the `savePerFolderDescription` seam. The plan repeats this at `001/plan.md:87` and `:107`.
- The cited seam passes its argument: `savePFD(regenerated, ...)` at `workflow.ts:1683` and `savePFD(sequenceSnapshot, ...)` at `workflow.ts:1720`.
- But `savePerFolderDescription` does NOT write that argument. At `folder-discovery.ts:967` it computes `payload = getDescriptionWritePayload(desc, loadExistingDescription(folderPath))` and writes `payload` at `:974`. `getDescriptionWritePayload` (`folder-discovery.ts:238`) returns `mergeDescription(existing.data, canonical, incoming).merged` at `:250`, a merge of the argument against the existing on-disk file plus `buildCanonicalDescriptionFields(desc)`.
- Net: the written bytes are a function of disk state the call site does not hold. Scoring `regenerated` or `sequenceSnapshot` at `:1683/1720` scores a different object than what lands on disk, so the REQ-001 byte-identity acceptance criterion fails as written. The fix is to score inside `savePerFolderDescription` after `:967` (or to replicate `getDescriptionWritePayload` plus `loadExistingDescription` at the call site), neither of which the 001 docs mention.

---

### F2 (P2, advisory) - The two seams serialize differently, the spec treats them as one formula

**Title:** `graph-metadata.json` is written with a trailing newline, `description.json` without one, but REQ-001 uses a single `JSON.stringify(value, null, 2)` formula for both.

**Type:** SPEC-PREMISE issue confirmed against LIVE code.

**Evidence:**
- REQ-001 (`001/spec.md:108`) and the plan (`001/plan.md:87`) say each payload is serialized "matching the written `JSON.stringify(value, null, 2)` body" for BOTH seams, implying one serialization.
- H1a write: `generate-context.ts:404` writes `` `${JSON.stringify(value, null, 2)}\n` ``, with a trailing `\n`.
- H1b write: `folder-discovery.ts:974` writes `JSON.stringify(payload, null, 2)` with no trailing newline.
- So the spec formula is off by one trailing `\n` for `graph-metadata.json`, and the two seams are not uniform. An implementer following the literal formula produces scored content that does not byte-match the H1a file. Low blast because the scorer tokenizes content rather than diffing exact bytes, but the spec's stated byte-identity claim is inaccurate.

---

### F3 (P2, advisory) - H1a scores only the phase-parent pointer bump, not the saved folder's own graph-metadata

**Title:** `atomicWriteJson:587` is reached only through `updatePhaseParentPointer`, so H1a never scores a standalone leaf's own `graph-metadata.json`.

**Type:** LIVE-CODE coverage gap against the spec's broad framing.

**Evidence:**
- The problem statement frames it broadly: "`graph-metadata.json` is written by `atomicWriteJson`" (`001/spec.md:61`).
- In the live tree `atomicWriteJson` (`generate-context.ts:398`) has one call, `:587`, inside `updatePhaseParentPointer` (`:552`). The other `graphFile` handle at `:532` is read-only (`getPacketIdFromGraphMetadata`).
- The entry point `updatePhaseParentPointersAfterSave` runs on save at `generate-context.ts:899`, then it only writes when the folder is a phase parent or has a phase parent (`:597`, `:603`). A standalone leaf with no parent triggers no `atomicWriteJson` write, and a saved child gets only its PARENT's pointer bump scored, never its own `graph-metadata.json`.
- So H1a as scoped covers a narrow subset of `graph-metadata.json` writes. The spec is internally consistent that the seam is "sole call `:587` inside `updatePhaseParentPointer`", so this is a coverage-scope advisory rather than a wrong-line error.

---

### F4 (P2, advisory) - The H1b seam is two call sites, one inside a retry loop

**Title:** Naive scoring at `workflow.ts:1720` reports 1 to 3 times per save because the call site sits in the memory-sequence retry loop.

**Type:** LIVE-CODE issue against the spec's single-seam framing.

**Evidence:**
- The plan lists "`workflow.ts:1683,1720`" as one seam (`001/plan.md:107`).
- `:1683` fires only in the regenerate-missing branch (`workflow.ts:1674-1688`).
- `:1720` sits inside `for (let attempt = 1; attempt <= MAX_MEMORY_SEQUENCE_RETRIES; attempt++)` (`workflow.ts:1699`), with `MAX_MEMORY_SEQUENCE_RETRIES = 3` (`:1695`). On lost-update retries `savePFD` runs more than once, so a scoring call placed here computes and reports the score per attempt.
- A clean report-only implementation must score once after the loop settles, not per `savePFD` call. The single-seam framing hides this.

---

## Write-path safety verdict

Report-only scoring is safe to add at these seams. The scorer is pure (no body mutation), the H2 reviewer already runs non-blocking under try/catch (`workflow.ts:1852-1864`) and the spec's edge cases already require "still write, score unavailable" on malformed input. The real risk on this slice is not write corruption, it is the H1b byte-identity guarantee (F1), which the spec cannot meet at the seam it names.
