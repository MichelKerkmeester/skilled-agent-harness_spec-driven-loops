# Iteration 3: Traceability / Spec-Alignment

## Focus
Cross-reference every load-bearing `file:line` citation in `spec.md` and `plan.md` against the real shipped source, and adjudicate the central H1 claim that "the two metadata JSONs are written by `atomicWriteJson` at `generate-context.ts:398`."

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 6 (spec.md, plan.md + quality-loop.ts, post-save-review.ts, generate-context.ts, workflow.ts, validator-registry.json)
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Citation Verification (all confirmed accurate unless noted)
| Spec claim | Cited location | Verified | Evidence |
|-----------|----------------|----------|----------|
| `computeMemoryQualityScore` defined | quality-loop.ts:392 | ✅ exact | `quality-loop.ts:392` |
| pure scorer export | quality-loop.ts:747 | ✅ exact | export block `quality-loop.ts:747` |
| `reviewPostSaveQuality` reviewer | post-save-review.ts:573 | ✅ exact | `post-save-review.ts:573` |
| `atomicWriteJson` seam | generate-context.ts:398 | ✅ exact (definition) | `generate-context.ts:398` |
| reviewer call site | workflow.ts:1854 | ✅ exact | `workflow.ts:1854-1857` |
| `runQualityLoop` destructive | quality-loop.ts:582 | ✅ exact | `quality-loop.ts:582` |
| `attemptAutoFix` 8000-char trim | quality-loop.ts (substring budget) | ✅ confirmed | `quality-loop.ts:434`, trim `:465-467`, budget `:85` |

Citation fidelity is unusually strong: every line number resolves to the exact named symbol.

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: H1 seam covers only ONE of the "two metadata JSONs", `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:398`. The spec asserts in three places that **both** metadata JSONs are written at this seam: problem statement "The two metadata JSONs are written by `atomicWriteJson` at `scripts/memory/generate-context.ts:398`" (`spec.md:61`), scope H1 "score the two metadata JSONs at the `atomicWriteJson` seam in `generate-context.ts`" (`spec.md:73`), and the affected-surfaces row "`atomicWriteJson` seam (`generate-context.ts:398`) … Writes the two metadata JSONs" (`plan.md:106`). The code shows `atomicWriteJson` is **called exactly once** in `generate-context.ts` — at `:587`, for `graphFile` (graph-metadata.json, `GRAPH_METADATA_FILE` at `:55`). There is **no** `description.json` write in `generate-context.ts` at all (zero `description` tokens in the file); `description.json` is produced via the imported `runWorkflow` from `../core/workflow.js` (`generate-context.ts:27`), i.e. a different module and a different seam. Consequently an implementer wiring H1 "at the atomicWriteJson seam in generate-context.ts" reaches only graph-metadata.json and cannot satisfy REQ-001's "two metadata JSONs" as literally scoped. REQ-001's own acceptance criterion hedges to the singular "WHEN `generate-context.ts` writes **a** metadata JSON via `atomicWriteJson`" (`spec.md:107`), which is internally inconsistent with the plural scope statements above. This is a spec defect that misdirects the build, not a code defect (no code shipped).

#### Claim Adjudication
```json
{
  "findingId": "F001",
  "claim": "The H1 seam generate-context.ts:398/atomicWriteJson writes only graph-metadata.json, so the spec's repeated 'two metadata JSONs at the atomicWriteJson seam' scope cannot be met at that seam and contradicts its own singular REQ-001 acceptance criterion.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:587",
    ".opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:55",
    ".opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:27",
    ".opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/001-on-write-quality/001-extend-quality-loop-authored/spec.md:61",
    ".opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/001-on-write-quality/001-extend-quality-loop-authored/spec.md:73",
    ".opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/001-on-write-quality/001-extend-quality-loop-authored/plan.md:106"
  ],
  "counterevidenceSought": "Grepped generate-context.ts for every atomicWriteJson call, every 'description' token, every '.json' write, and every import. atomicWriteJson is called once (graphFile, :587); description has zero hits; description.json is generated through the runWorkflow import (:27). Also checked backfill-research-metadata.ts, which writes description.json on a separate iteration-pack path, confirming the description write does not live at the cited seam.",
  "alternativeExplanation": "The implementer could broaden H1 to ALSO hook the description.json write inside runWorkflow/workflow.ts and treat 'the atomicWriteJson seam' as shorthand for 'the metadata-write surface'. That is a reasonable build interpretation, but it is not what the spec says, and it changes the named seam, so the requirement-to-seam mapping is still defective as written and warrants an amendment.",
  "finalSeverity": "P1",
  "confidence": 0.83,
  "downgradeTrigger": "Downgrade to P2 once spec.md/plan.md either (a) scope H1 to graph-metadata.json only and move description.json scoring to its real seam with an explicit citation, or (b) name the description.json write seam (workflow.ts/runWorkflow) alongside the atomicWriteJson seam.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery: confirmed only one of the two named JSONs is written at the cited seam" }
  ]
}
```

### P2, Suggestion
- None new this pass.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | generate-context.ts:587 vs spec.md:61/73 | All atomic citations accurate; the plural "two JSONs at one seam" claim fails (F001) |
| checklist_evidence | pass | hard | checklist.md:81-85, tasks.md:66-71 | Tasks T004/T005 inherit the same single-seam framing and would carry the gap forward |

## Assessment
- New findings ratio: 1.0
- Dimensions addressed: traceability
- Novelty justification: The single P1 is the highest-value finding in the loop — every other citation is exact, so the lone mismatch is a precise, actionable amendment target rather than noise.

## Ruled Out
- "All citations are wrong / line numbers stale": ruled out. Six of seven citations are byte-exact to the named symbol; only the multiplicity of the JSON-write seam is wrong.
- "description.json is written at generate-context.ts via a differently-named helper": ruled out by zero `description` tokens in the file.

## Dead Ends
- Looking for a second `atomicWriteJson` call (for description.json) in generate-context.ts: only one call exists (`:587`).

## Recommended Next Focus
Maintainability / completeness: doc synchronization across the five phase docs, the source-vs-dist (`.ts` vs `.js`) citation convention, and whether T004/T005 should be split to reflect the two distinct write seams uncovered in F001.

Review verdict: CONDITIONAL
