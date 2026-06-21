# R2-21 Keystone Leverage

**Angle summary:** Pressure-test whether A1 (extend the live quality loop to the authored surface) is truly the highest-leverage keystone, or whether the program's own evidence points at a cheaper higher-value move and whether A1's central deliverable actually measures authored quality.

**Slice:** keystone-leverage. **Findings:** P0=0, P1=2, P2=1.

---

## Finding 1 (P1, SPEC-PREMISE): The headline crowns A1 the "single biggest value" while the program's own evidence ranks A4 above it on measured value-per-cost

The top-level framing declares A1 the largest win. `SUMMARY.md:11` says "The biggest single win in the whole program is just to also run it on the spec docs and the JSON metadata files". `SUMMARY.md:60` and parent `spec.md:60` repeat "The single biggest piece of value is the keystone: extend the live quality checker".

The research synthesis contradicts that ranking. `research/research.md:29` states "A4 is the only measured unconditional GO in the whole program. It touches validation not ranking, so it has zero prod-retrieval risk, its surface is counted and its mechanism is shipped. It ships first." `SUMMARY.md:26` calls A4 the free zero-risk "Do now, one sure thing". A4 also carries no 026 dependency, whereas A1 sits behind 026 (parent `spec.md:210`).

A1 as scoped is report-only. `001-a1-extend-quality-loop-authored/spec.md:64` and `:151` confirm "zero new scorer and zero body mutation" and the H3 rule lands "default-off and warn", so A1 changes nothing on disk and forces no action on day one. By the program's own truncation-law leverage test (`SUMMARY.md:9`, only "which three show up" and "AI better read and follow" help), a report-only score touches neither lever directly. A4 does touch lever one: a packet with an invalid or missing metadata JSON "stays invisible to retrieval" (parent `spec.md:239`), so A4 schema enforcement gates whether a doc can ever reach the top three.

The "keystone" honor is therefore a largest-reuse-surface claim presented as a largest-value claim. The highest measured value-per-cost move is A4, which is cheaper, the only one with counted evidence (11 invalid live-root graph files per `research/research.md:21`) and zero risk. The headline should rank A4 first on leverage and reserve "keystone" for A1's reuse-seam role.

---

## Finding 2 (P1, LIVE-CODE): The verbatim-reuse scorer mis-measures the authored surface, so the keystone's central deliverable is dominated by file-type and length artifacts not authored quality

A1 H1 scores both metadata JSONs with the shipped `computeMemoryQualityScore` and REQ-005 plus REQ-002 forbid any second or alternative scorer (`001-a1-extend-quality-loop-authored/spec.md:108-117`). That scorer is memory-calibrated.

`computeMemoryQualityScore` (`quality-loop.ts:392`) blends four sub-scores with weights triggers 0.25, anchors 0.30, budget 0.20 and coherence 0.25 (`quality-loop.ts:74-79`). Two of those dimensions are markdown-and-memory specific and structurally unreachable for the JSON files H1 targets:

- `scoreTriggerPhrases` reads `metadata.triggerPhrases` and returns 0 when absent (`quality-loop.ts:104-111`). Verified live: `description.json` exposes keys `level, specFolder, description, keywords, ...` with no `triggerPhrases` and no `trigger_phrases`, and `graph-metadata.json` exposes `schema_version, packet_id, ..., derived` with no trigger field. The scorer ignores the `keywords` array entirely. So the 0.25 trigger weight is pinned to 0 for both JSONs.
- `scoreAnchorFormat` returns the neutral 0.5 when content has no `<!-- ANCHOR -->` tags (`quality-loop.ts:157-159`). A serialized JSON body has none, so the 0.30 anchor weight caps at 0.5.

Together those two dimensions (55 percent of the weight) cannot exceed a 0.15 contribution. The absolute ceiling for a perfect JSON is `0 x 0.25 + 0.5 x 0.30 + 1.0 x 0.20 + 1.0 x 0.25 = 0.60`, which is exactly the memory pass threshold of 0.6 (`quality-loop.ts:587`). Every real metadata JSON therefore scores at or below the pass line by construction of file type, not by quality.

The budget dimension also misfires on authored docs. `scoreTokenBudget` returns `8000 / charCount` above an 8000-char memory budget (`quality-loop.ts:235-247`, `DEFAULT_CHAR_BUDGET` at `:85`). The parent `spec.md` is 16,793 bytes live, so it scores ~0.48 on budget for being a normal-length spec. The A1 spec under-cites this file as 10.6KB (`001-a1-extend-quality-loop-authored/spec.md:79`), which is already stale.

Net effect: the keystone's stated central output, a meaningful quality score on the authored surface, is largely noise as specified, and the verbatim-reuse contract blocks the obvious fix. The phase must either widen scope to a JSON-and-spec-doc-aware rubric or downgrade the value claim. This directly weakens the leverage argument behind calling A1 the biggest win.

---

## Finding 3 (P2, SPEC-PREMISE): The keystone is sequenced behind a 026 dependency it does not functionally use, inflating its critical path

Parent `spec.md:210` states "The 026 shared safe-fix engine ships before 001 A1 and 011 B1 and 012 B2, because those three reuse it as their fix path." That rationale holds for B1 and B2, which do operator-local safe-apply, but A1 has no fix path. A1's scope is pure score plus non-mutating review plus a default-off warn rule, and `001-a1-extend-quality-loop-authored/spec.md` §3 Out-of-Scope explicitly excludes `runQualityLoop`, every content-mutating auto-fix and the A2 A3 A6 detectors. A1 imports only the already-shipped `computeMemoryQualityScore` and `reviewPostSaveQuality`, neither of which lives in 026.

A1's own docs quietly reframe the same edge as forward-compatibility rather than function: `001-a1-extend-quality-loop-authored/plan.md:160` and `spec.md:140` describe it as "keep the engine seam compatible with the later front doors". So the dependency is sequencing-for-compat, not a functional need. Stating it as a fix-path reuse mis-describes why the keystone waits on 026 and places the program's "biggest value" item behind infra it never calls. Correct the build-order rationale, or note A1 can ship its report-only seam independently of 026.

---

## What was checked and is clean

- The "live default-ON quality loop" premise is accurate. `SPECKIT_QUALITY_LOOP` and `SPECKIT_QUALITY_AUTO_FIX` both default `true` (`ENV_REFERENCE.md:391`, `:198`), and the gate sits at `quality-loop.ts:570,594`.
- The destructive-path hazard is correctly scoped out. `runQualityLoop` (`quality-loop.ts:582`) and `attemptAutoFix` with the 8000-char `substring` trim (`quality-loop.ts:434,465-467`) are real, and A1 REQ-002 bars any path that reaches them.
- The cited seams resolve: `computeMemoryQualityScore` def `:392` export `:747`, `reviewPostSaveQuality` `post-save-review.ts:573`, `atomicWriteJson` def `generate-context.ts:398` sole call `:587`, `savePerFolderDescription` calls `workflow.ts:1683,1720`, reviewer call `workflow.ts:1854`.

---

## Most important finding

Finding 2. The keystone's own deliverable is hollow on its primary surface: the memory-calibrated scorer caps any metadata JSON at 0.60 by file type and the verbatim-reuse contract (REQ-005) forbids fixing it, so "extend the quality checker to the JSONs" produces a score that measures format mismatch rather than authored quality. That undercuts the claim that A1 is the single biggest piece of value.
