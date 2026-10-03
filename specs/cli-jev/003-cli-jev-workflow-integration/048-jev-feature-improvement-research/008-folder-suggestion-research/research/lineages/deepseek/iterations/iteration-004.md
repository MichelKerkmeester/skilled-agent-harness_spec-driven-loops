# Iteration 004 -- Where else the same judgment would pay off

- **Focus:** Q4. Find every place in `.skilled` that already performs the same judgment -- pick the right small-set target from a content signal -- and say which copy is built or unbuilt, what evidence supports it and what a pay-off would cost.
- **Status:** complete. **newInfoRatio:** 0.78.
- **Sources read:** `folder-detector.ts` (call sites, candidate ranking, confidence bands), `alignment-validator.ts` (both paths), `continuity/generate-context.ts:1005-1040`, `core/subfolder-utils.ts:130+` and its ambiguity hook (:29), `core/find-predecessor-memory.ts:244-268, :312-372`, `019/goal.md`, `020` and `021` rows in `047/scratch/evidence/results.md`.

## Findings

**F4-01 [OBSERVED] The save flow contains the same judgment four times; two copies are built, two are not.**
(a) CLI save alignment -- built: `validateContentAlignment` is called from `folder-detector.ts:1043` with the relative folder and specs dir, and lists up to three higher-scoring siblings with an interactive switch (alignment-validator.ts:522-572).
(b) Data save alignment -- half-built: `validateFolderAlignment` is called from `folder-detector.ts:1160` and `:1187`, lists alternatives, but in non-interactive mode prints "proceeding with specified folder" and returns `useAlternative:false` (alignment-validator.ts:658-669). The suggestion is computed and never usable.
(c) Folder auto-detection -- built ranking, no model decision: session, git-status, session-activity and generic auto-detect candidates are ranked (`rankSessionCandidates` :296, `rankGitStatusCandidates` :450, `assessAutoDetectConfidence` :541) and selected with confidence bands.
(d) Explicit-CLI argument -- deliberately suppressed: the alignment result is computed and then logged as `ALIGNMENT_BYPASSED (CLI-explicit)` when the operator named the folder (folder-detector.ts:1046-1049).
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec-folder/folder-detector.ts:1043-1049, :1160, :1187; alignment-validator.ts:522-572, :658-669]

**F4-02 [OBSERVED] Auto-detection already computes the exact near-tie condition a typed judgment exists to resolve.**
`assessSessionConfidence` marks low confidence when the top candidates tie on quality with near-identical recency, or the quality gap is under 10 within the recency window (:300-325). The production path falls through on low-confidence git-status (:1247-1250, "[Priority 2.7] Low-confidence git-status match ... falling through"), on low-confidence session-activity (:1301-1304), and on low-confidence auto-detect (:1346, "using deterministic fallback"). So the code already knows it is in a near-tie and currently has two answers -- interactive confirm or deterministic fallback. This is the highest-value copy of the judgment because the gate and the decision point already exist.
[SOURCE: folder-detector.ts:300-325, :1247-1250, :1301-1304, :1346]

**F4-03 [OBSERVED] Child-resolution ambiguity is refused rather than adjudicated.**
`findChildFolderAsync` collects every match by name across specs roots (subfolder-utils.ts:130-133) and exposes an `onAmbiguous` callback (:29); `generate-context.ts:1020` comments "FindChildFolder logs its own error for ambiguous matches" and then prints a "Did you mean:" list (:1035-1040) instead of choosing. Same judgment shape, error-path surface.
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/subfolder-utils.ts:29, :130-133; continuity/generate-context.ts:1020, :1035-1040]

**F4-04 [OBSERVED] Predecessor-memory ties are resolved to null.**
`compareCandidates` can return `tie` (:244-268); a tie between two different sessions sets `ambiguous` (:365-366) and the lookup returns null (:370-372). Same shape, and the safe default is already chosen.
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/find-predecessor-memory.ts:244-268, :312-372]

**F4-05 [OBSERVED] The pattern already paid in the sibling features; 022 is the folder-domain copy.**
019 reorders the skill advisor's whole near-tie cluster with a live Jev run whose verdict was a kill (`019/goal.md:16, :41`, D4 keep rule with a 2,200 ms child budget). 020 votes among router modes and kept: "`verdict jev: keep K=54 M=54 A=28 B=15 W=17 L=4 F=10 p=0.003599`, baseline: first alternative right on 15 of 54" (047 `results.md`). 021's replay stopped at `no headroom` (047 `results.md`). The same typed-choice frame therefore already spans skill order, router mode and route replay; the unbuilt copies are the two in F4-01(b) and (c).
[SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/goal.md:16, :41, D4; 047/scratch/evidence/results.md rows 020 and 021]

**F4-06 [DERIVED] Pay-off ranking.**
1. **Auto-detect near-ties (F4-02)** -- gate and decision point already exist; a Jev choice would give the low-confidence branch a third answer (propose) instead of confirm/fallback. Blast radius medium: a selection writes a save into a folder. Natural posture: propose-and-confirm interactively, never silent. Frequency UNKNOWN -- no census of low-confidence auto-detect decisions exists in the repo (the 047 measurements counted events, not confidence branches).
2. **Data-path non-interactive (F4-01b)** -- the suggestion is computed, printed and unused; a typed pick would give automation what it currently cannot take. Constraint: the non-interactive budget and the fact that proceeding is an intentional policy (:666-669). Frequency UNKNOWN for the same reason.
3. **Child-resolution ambiguity (F4-03)** -- turns an error into a ranked shortlist; low frequency, low blast radius.
4. **Predecessor-memory ties (F4-04)** -- lowest: the null default is already safe and the signal is thin.
5. **Explicit-CLI argument (F4-01d)** -- not a candidate: the policy that the operator's explicit folder wins is correct, and F1's own metric already excludes it.

**F4-07 [DERIVED] One cost unit, one gate set, one posture across all spots.**
Every spot sends a similar payload class (session text + option descriptions) and would pay the same measured unit cost (~1 model call, p50 324 ms per call on the 022 run) plus the same checks (version pin, auth, payload acceptance; alignment-validator 022 REQ-003 / scorer :731-770). All spots share the frozen posture "a typed tiebreak, never a first responder", which 047 D6 states as "No Jev arm joins a default path" (`047/goal.md` D6). So the pay-off question is not "where could a model run" but "which near-tie branch already exists and has no third answer".
[SOURCE: F2-05; score-alignment-suggestion.ts:731-770; 047/goal.md D6]

**F4-08 [DERIVED] An adjacent, different pay-off: labels for the deterministic ranker.**
The 10 baseline errors in the 022 corpus are exactly the cases where a model chose correctly and the deterministic scorer did not. Collected at scale, that disagreement set is a training/eval signal for `calculateAlignmentScore` itself (alignment-validator.ts:454-471) rather than for a call-time model. No pipeline collects it today, and building one is an architecture decision beyond this research.
[SOURCE: F2-01; alignment-validator.ts:454-471]

## Ruled out

- **Trigger-index near-ties** as a fifth spot: not verified in this iteration and no tie-handling code was found in a quick pass; marked UNKNOWN rather than claimed. [SOURCE: negative result, no citation]

## Next focus

Q5 -- default-on integration: what it needs, its cost and its risk, using the measured unit cost and the gates above.
