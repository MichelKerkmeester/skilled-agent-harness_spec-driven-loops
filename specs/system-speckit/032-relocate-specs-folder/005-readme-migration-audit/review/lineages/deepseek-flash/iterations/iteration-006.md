# Iteration 6: Historical specs/** classification + root README canonical-vs-legacy split

## Focus

Classify the 6 historical `specs/**` README hits for out-of-scope confirmation (spec.md §3), and verify the root README's canonical-vs-legacy split (its directory trees use `specs/` correctly; only the RELATED DOCUMENTS link uses the legacy alias).

## Scorecard

- Dimensions covered: [correctness, security, traceability, maintainability]
- Files reviewed: 7
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings

### P2, Suggestion

- **F020**: `specs/**` README hits that look historical contain live-command `.opencode/specs` usage worth a follow-up confirmation, `specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/003-continuity-refactor-gates/prompts/README.md` (12 literal hits)
  - Evidence: This prompts/README lives in a packet whose spec.md status is "Complete" (closed), so it is spec-doc artifact content and out of scope per spec.md §3. But it carries 12 literal `.opencode/specs` references in copy-paste research-loop commands (`/deep:start-research-loop:auto ... --spec-folder .opencode/specs/...`). If an operator reuses these commands post-flip, they run against the legacy alias (functional via symlink) — flagged for the fix phase to decide keep-as-historical vs update.
  - Recommendation: Leave as historical (out of scope) but list in Deferred Items so the migration owner can decide whether archived prompt templates should be canonicalized.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | root README.md:108,219,249 vs README.md:1303 | Root README is canonical in its trees; only the related-docs link is legacy |
| checklist_evidence | notApplicable | hard | - | No checklist.md |

## Assessment

- New findings ratio: 0.0
- Dimensions addressed: [correctness, security, traceability, maintainability]
- Novelty justification: F020 captures the borderline historical-vs-live classification for the 026 prompts README; root README split confirms F010 is isolated (not systemic).

## Ruled Out

- Root README directory trees (lines 108, 219, 249) and Spec Folder Structure diagram use canonical `specs/` — correct, no finding.
- 5 of 6 `specs/**` README hits are in `z_archive` or `output/` artifact trees — genuinely historical, out of scope, no finding.
- sk-doc `output/README.md:110` is a rendered sample prompt (pre-flip, uses `opencode-go/deepseek-v4-pro`) — output artifact, out of scope.

## Dead Ends

- None.

## Recommended Next Focus

Full hit-file verification pass (iteration 7): re-read each of the 21 literal-hit README.md files end-to-end for any additional stale claims beyond the line-level hits already captured, ensuring per-file coverage completeness.

## Claim Adjudication

(No new P0/P1 findings this iteration — no packet required.)

Review verdict: PASS
