# r2-11 H1/H2/H3 seams (angle: wiring)

**Angle summary:** Verified every H1/H2/H3 seam file:line in the 001 spec against the real tree. The seam map is accurate including the deliberate two-seam split for the metadata JSONs. One off-by-one cite is the only defect, the H3 absence correctly matches the research-only premise.

---

## FINDINGS

### F1 — P2 advisory — H2 reviewer cite points at the import line not the call
**Evidence (LIVE-CODE):** spec.md:90 says the `reviewPostSaveQuality` call is "already wired at `:1854`". In `workflow.ts:1854` line 1854 is the dynamic import `const { reviewPostSaveQuality, printPostSaveReview } = await import('./post-save-review.js')`. The actual call `reviewPostSaveQuality({ ... })` is at `workflow.ts:1855`. Off by one.
**Type:** LIVE-CODE. The seam exists and is real, the cite just labels the wrong adjacent line. Fix the cite to `:1855` (call) or `:1854-1855` (import plus call).

### F2 — clean (no defect) — focus question answered: atomicWriteJson does NOT handle both metadata JSONs, and the spec says so correctly
**Evidence (LIVE-CODE):** `generate-context.ts:398` defines `atomicWriteJson`, sole call site `generate-context.ts:587` inside `updatePhaseParentPointer` (def `:552`), writing `graphFile` which resolves to `GRAPH_METADATA_FILE = 'graph-metadata.json'` (`:55`). No `atomicWriteJson` call writes `description.json`. `description.json` is written by `savePerFolderDescription` (aliased `savePFD` from `@spec-kit/mcp-server/api` at `workflow.ts:1668`) at `workflow.ts:1683` and `workflow.ts:1720`. `generate-context.ts:885` reaches that path via `runWorkflow`.
**Type:** Confirmation, not a defect. spec.md:61 and spec.md:73 correctly split H1 into H1a (atomicWriteJson / graph-metadata) and H1b (savePerFolderDescription / description) and explicitly reject the single-seam framing. The slice is clean here.

### F3 — clean (no defect) — H3 CONTENT_QUALITY rule is correctly absent, matching the research-only premise
**Evidence (LIVE-CODE):** `validate.sh` has zero `CONTENT_QUALITY` or `content-quality` matches. `validator-registry.json:192` holds `GRAPH_METADATA_SHAPE` and `:200` holds `DESCRIPTION_SHAPE`, no `CONTENT_QUALITY` entry. `scripts/validation/content-quality.ts` does not exist.
**Type:** Confirmation. spec.md:75 and the Files-to-Change table mark these "Create later", so absence is the expected state for a 28-phase planned program with nothing built. No spec-vs-code contradiction.

### F4 — clean (no defect) — the shipped scorer/reviewer/destructive-loop cites all resolve exactly
**Evidence (LIVE-CODE):** `computeMemoryQualityScore` at `quality-loop.ts:392`, re-exported at `:747` (spec.md:61, 117). `reviewPostSaveQuality` at `post-save-review.ts:573` (spec.md:61, 110). `runQualityLoop` at `quality-loop.ts:582` (spec.md:79). `attemptAutoFix` at `:434` trims via `substring(0, DEFAULT_CHAR_BUDGET)` at `:465-467`, budget = 8000 chars per the `:229` comment (spec.md:79). The out-of-scope hazard cite is accurate.
**Type:** Confirmation. The reuse-only invariant (REQ-002, REQ-005) rests on accurate ship-line cites, and they hold.

---

## Counts
- P0: 0
- P1: 0
- P2: 1 (F1)
- Clean confirmations: 3 (F2, F3, F4)
