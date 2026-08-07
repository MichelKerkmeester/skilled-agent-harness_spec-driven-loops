# Seat gpt-regression-doctruth — iteration 4 (global #42)

- Model: `openai/gpt-5.5-fast` · Executor: opencode · Angle: gpt-regression-doctruth
- Verdict: **CONDITIONAL** · Findings: P0=0 P1=1 P2=1

## Analysis

Reviewing the approved 027 slice read-only, starting by locating the 014 phase docs/changelog and benchmark/code evidence behind the BM25 ranking claims.Skill routing selected `sk-code-review` for a findings-first, file-line-evidence review. I’ll keep the final response in the user’s required JSON envelope rather than the generic review footer.I’m narrowing the review to files that mention `014`, `BM25`, `meets-or-beats`, `RSS`, or benchmark artifacts, then I’ll trace any referenced code/fixtures before deciding findings.Early doc-truth signal: the 009 spec and changelog acknowledge the realistic-fixture RSS breach and phase-017 closure, but I’m checking whether all 014/009 phase docs were corrected or whether stale task evidence still contradicts them.The stale RSS task rows are a likely traceability finding; before finalizing, I’m verifying the benchmark/test code and baseline harness so the ranking claim is either supported or separately contradicted.The benchmark harness supports the revised ranking language: it compares packed vs legacy across MRR/NDCG/recall and has explicit BM25F title-signal assertions. I’m reading the exact scoring and RSS code paths now to avoid relying on test names.The shipped code/test evidence matches the corrected RSS path: current fixture uses non-stop-word per-doc vocabulary, peak-sampled RSS is asserted unconditionally, and phase 010 records 136.5 MB under budget. The remaining contradiction appears confined to 009 task evidence.The contradiction is broader than tasks: `plan.md` still says the current corpus passed and only 3x is a follow-up, while the spec, scratch evidence, changelogs, and phase-010 summary say the 1x realistic fixture breached and was later fixed.I found a second doc-truth inconsistency in the 010/phase-017 closure docs: some entries say the pre-fix realistic RSS spike was ~687 MB, while the changelog and implementation summary headline say 743 MB. I’m checking whether 743 is backed by a preserved benchmark before treating it as a finding.No code-side benchmark artifact surfaced a `743MB` number; the preserved 014 evidence I read is `686.8MB` committed and `799.4MB` batched, while 010 spec/plan repeat `~687MB`. That makes the 743 headline look unbacked in docs, not code.The ranking claim itself held up: the test asserts `packedAtLeastLegacy` and `titleSignalRestored`, and the harness defines those as packed MRR/NDCG/recall plus hit-rate not below legacy. My findings are about RSS traceability, not ranking behavior.Analysis: The `meets-or-beats` ranking claim is supported by the shipped code path I read. `runBM25EngineComparison()` defines `packedAtLeastLegacy` as packed `mrr5`, `ndcg10`, and `recall20` all >= legacy, and `titleSignalRestored` as packed hit-rate >= legacy (`.opencode/skills/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:233-237`). The packed BM25 test asserts both, plus direct BM25F/title-signal behavior (`tests/bm25-packed-inmemory.vitest.ts:259-286`, `:212-233`). I did not find a ranking-claim defect.

The doc-truth failures are in the RSS traceability trail. Some canonical 009 docs still state the repudiated 111MB/current-corpus-pass story, and the 010 closure docs mix incompatible pre-fix/final RSS numbers.

```json
{
  "seat": "gpt-regression-doctruth",
  "model": "openai/gpt-5.5-fast",
  "angle": "REGRESSION: 014 \"meets-or-beats\" ranking claim + repudiated RSS evidence were corrected. Re-verify the 014 docs match the shipped benchmark.",
  "verdict": "CONDITIONAL",
  "summary": "Ranking claim is supported, but RSS benchmark truth still diverges in 009 plan/tasks and 010 headline docs.",
  "files_reviewed": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/009-packed-bm25-field-weights/spec.md",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/009-packed-bm25-field-weights/plan.md",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/009-packed-bm25-field-weights/tasks.md",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/009-packed-bm25-field-weights/implementation-summary.md",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/009-packed-bm25-field-weights/scratch/rss-probe-evidence.md",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/010-bm25-warmup-churn-reduction/spec.md",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/010-bm25-warmup-churn-reduction/implementation-summary.md",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/010-bm25-warmup-churn-reduction/review/review-report.md",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/changelog/002-memory-store-and-search/changelog-002-009-packed-bm25-field-weights.md",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/changelog/002-memory-store-and-search/changelog-002-010-bm25-warmup-churn-reduction.md",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/spec.md",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/before-vs-after.md",
    ".opencode/skills/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts",
    ".opencode/skills/system-spec-kit/mcp_server/lib/eval/fixtures/bm25-packed-fixture.ts",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts",
    ".opencode/skills/system-spec-kit/mcp_server/tests/bm25-packed-inmemory.vitest.ts"
  ],
  "findings": [
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "009 plan/tasks still preserve repudiated RSS pass",
      "file": ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/009-packed-bm25-field-weights/tasks.md:50",
      "evidence": "tasks.md:50 records the superseded 111,017,984-byte RSS spike, tasks.md:70-71 still says the current corpus stayed below 150MB and contingency was not triggered, and plan.md:117 repeats 'current corpus passed'. But spec.md:139 and scratch/rss-probe-evidence.md:11 record the realistic fixture breach at 686.8MB > 150MB, while implementation-summary.md:103 says the 111MB measurement was superseded and phase 017 closed the budget at 136.5MB.",
      "why": "Canonical phase docs still contradict the corrected benchmark trail. A reader can conclude 009 met REQ-001 at phase close, even though the corrected evidence says 009 failed the RSS budget and 010/phase-017 later closed it.",
      "recommendation": "Update 009 plan.md and tasks.md to mark the 111MB/current-corpus-pass evidence as superseded, state the realistic 1x breach at phase close, and point to 010/phase-017 as the closure."
    },
    {
      "severity": "P2",
      "dimension": "traceability",
      "title": "Pre-fix RSS headline drifts between 687MB and 743MB",
      "file": ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/changelog/002-memory-store-and-search/changelog-002-010-bm25-warmup-churn-reduction.md:23",
      "evidence": "changelog-002-010.md:23, parent spec.md:130, and before-vs-after.md:255/293 say the pre-fix realistic RSS spike was 743MB. The preserved 014 re-validation evidence says 686.8MB committed and 799.4MB batched in scratch/rss-probe-evidence.md:11-12, and 010 spec.md:66 repeats ~687MB. 010 implementation-summary.md:3 also says final 134MB while lines 50 and 91 say 136.5MB.",
      "why": "The shipped benchmark story has multiple incompatible headline numbers. The pass/fail outcome is unchanged, but traceability is not clean enough for a benchmark-backed release note.",
      "recommendation": "Choose the authoritative preserved benchmark number or add the missing 743MB artifact, then normalize the 010 changelog, parent spec, before-vs-after summary, and implementation-summary frontmatter/body to one pre-fix value and one final value."
    }
  ]
}
```
