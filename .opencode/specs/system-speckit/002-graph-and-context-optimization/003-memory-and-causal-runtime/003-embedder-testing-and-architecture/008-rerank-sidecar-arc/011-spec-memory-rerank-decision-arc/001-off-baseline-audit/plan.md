---
title: "Plan: OFF baseline audit + penalty removal [template:level_1/plan.md]"
description: "Phase-1 execution plan: baseline measurement, penalty-site discovery, conditional patch, validation."
trigger_phrases:
  - "011/001 plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit"
    last_updated_at: "2026-05-21T13:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan scaffolded"
    next_safe_action: "Run Phase A measurement before any code edits"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: OFF baseline audit + penalty removal

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Three phases. Phase A measures, Phase B decides + patches if warranted, Phase C verifies. Total wall clock: ~1 hour. Cli-codex dispatch fits in a single invocation.

| Phase | Step | Wall clock |
|---|---|---|
| A | Run OFF baseline; capture numbers | ~10-15 min |
| B | Decide verdict; if OFF_ACCEPTABLE, identify penalty site + write conditional patch + new vitest | ~30-40 min |
| C | Vitest exit 0 + strict-validate + update continuity | ~10 min |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

```
COMPLETE iff
  baseline numbers captured (hit-rate, NDCG@10, recall@5) AND
  verdict (OFF_ACCEPTABLE or OFF_DEFICIENT) is supported by data AND
  IF OFF_ACCEPTABLE:
    conditional patch applied + new vitest passes AND
    arc parent's phase-map updated to mark Phases 2-3 superseded
  ELSE (OFF_DEFICIENT):
    failure-mode categorization recorded + Phase 2 spec gets concrete target metrics
  AND strict-validate exit 0
ELSE PARTIAL.
```

Thresholds (provisional, may revise after Phase A data):

- `OFF_ACCEPTABLE` iff: hit-rate@5 ≥ 0.70 AND NDCG@10 ≥ 0.65 AND no probe category has zero recall
- `OFF_DEFICIENT` otherwise

Auxiliary:

- Existing focused vitest suites (skill-advisor + spec-kit embedder-sidecar + system-skill-advisor pytest) continue to PASS.
- No regression in the 168-fixture-failure-baseline count from packet `005-cross-cutting-quality/008-spec-memory-vitest-stabilization` (this phase only adds tests; it doesn't fix existing ones).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Phase A — Measurement (no code changes)

Locate the fixture + harness:

```text
.opencode/specs/.../008-rerank-sidecar-arc/004-spec-memory-rerank-benchmark/
  ├── fixtures/<50-probe-file>.jsonl
  └── benchmark-harness.* (per arc 008 convention)
```

Run with reranker disabled. The relevant env path:

```bash
cd .opencode/skills/system-spec-kit/mcp_server
SPECKIT_CROSS_ENCODER=false RERANKER_LOCAL=false \
  npm run bench:rerank -- --fixture <path> --mode off-baseline
```

(Exact target name TBD during Phase A — first action is `grep -n "bench:rerank\|rerank-bench" package.json` to find it. If no scripts exists yet for OFF-only mode, the harness from arc 008 Phase 004 should accept a `--mode off` flag; if not, add it before measuring.)

Output: `001-off-baseline-audit/evidence/off-baseline-<date>.json` with per-probe results + summary stats.

### Phase B — Verdict + Patch

Decision tree:

```
hit-rate@5 ≥ 0.70 AND NDCG@10 ≥ 0.65 AND no zero-recall category?
  YES → OFF_ACCEPTABLE → execute Patch path
  NO  → OFF_DEFICIENT → execute Escalate path
```

#### Patch path (if OFF_ACCEPTABLE)

Find the penalty site:

```bash
grep -rn "WEIGHT_RERANKER" .opencode/skills/system-spec-kit/mcp_server/lib/
```

Expected pattern (likely in `lib/search/scoring/` or similar):

```ts
const WEIGHT_RERANKER = 0.20;
// ...
confidence *= hasReranker ? 1.0 : (1.0 - WEIGHT_RERANKER);
```

Patch: make the penalty conditional on intentional rerank configuration. Sketch:

```ts
// Penalty only applies when reranking is configured but unavailable
// (e.g. cloud provider configured but unreachable). If no reranker was
// requested in the first place (local-first defaults, sidecar absent),
// don't penalize — confidence reflects retrieval quality, not reranker presence.
const rerankerExpected = isRerankerExpected(); // true iff cloud provider configured OR SPECKIT_CROSS_ENCODER=true intent
confidence *= rerankerExpected && !hasReranker ? (1.0 - WEIGHT_RERANKER) : 1.0;
```

`isRerankerExpected()` reads `search-flags.ts` for the intent signal. Exact helper name + return rules belong to the cli-codex dispatch (see §Dispatch).

#### Escalate path (if OFF_DEFICIENT)

Categorize failures:

- **Ranking inversion**: correct doc in top-N but wrong position
- **Recall miss**: correct doc not in top-N at all
- **Empty result**: probe returned 0 results

Per-category counts go into implementation-summary §Failure Analysis. Phase 2 spec gets these as concrete target metrics ("bge-v2-m3 must close ≥X recall misses + ≤Y ranking inversions").

### Phase C — Verification

- Vitest passes for the new test asserting `requestQuality` reflects retrieval quality
- Strict-validate exit 0
- Arc parent's phase-map updated; if OFF_ACCEPTABLE, Phases 2-3 statuses change to "Superseded by 001 outcome"
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Measure

1. `grep -rn "bench.*rerank\|rerank.*bench" .opencode/skills/system-spec-kit/` to locate the harness
2. Identify how to run with reranker OFF (env flag, CLI arg, or harness mode)
3. Run on the 50-probe fixture; redirect output to `evidence/off-baseline-<date>.json`
4. Compute summary stats: hit-rate@5, NDCG@10, recall@5, per-category counts
5. Write the §Baseline Numbers table in implementation-summary

### Phase B — Verdict

1. Apply thresholds → record verdict (OFF_ACCEPTABLE / OFF_DEFICIENT) in §Verdict
2. If OFF_ACCEPTABLE: locate `WEIGHT_RERANKER` site, design conditional patch, add `isRerankerExpected()` helper if needed, land patch + new vitest
3. If OFF_DEFICIENT: categorize failures, update Phase 2 spec with concrete target metrics, do NOT patch anything

### Phase C — Verify

1. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run <new-test>` → exit 0
2. Re-run focused vitest sets that Dispatch C of the prior 016 work verified (skill-advisor + embedder-sidecar) → exit 0
3. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` → exit 0
4. Update arc parent's `_memory.continuity` and phase-map
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Phase A**: no test changes; only the existing benchmark runs.
- **Phase B (Patch path)**: one new vitest at `tests/scoring-request-quality.vitest.ts` (name TBD) that:
  - Constructs a search result with high retrieval scores but no reranker
  - Asserts `requestQuality` is not `'weak'`
  - Asserts the actual confidence value isn't penalized by 0.20
  - Also asserts the OPPOSITE: when reranker is configured but absent (cloud configured, sidecar down), confidence IS penalized
- **Phase B (Escalate path)**: no test changes; just the failure-mode table
- **Phase C**: existing focused suites continue to PASS
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 50-probe fixture from `004-spec-memory-rerank-benchmark/`
- Benchmark harness (location TBD in Phase A step 1)
- `SPECKIT_CROSS_ENCODER`, `RERANKER_LOCAL` env flags
- `lib/search/search-flags.ts` (likely needs a new `isRerankerExpected()` helper)
- `lib/search/scoring/` (penalty site)
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase only touches tests + scoring config. To revert:

1. `git revert <commit-sha>` for the patch + test
2. `npm run build` in `.opencode/skills/system-spec-kit/mcp_server/`

No data or daemon state to roll back; no sidecar config touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dispatch -->
## 8. DISPATCH (cli-codex gpt-5.5 high fast)

**Pre-flight:** main agent reads `.opencode/skills/cli-codex/SKILL.md` before composing the prompt (CLAUDE.md CLI dispatch rule).

**Dispatch prompt (copy-paste verbatim into cli-codex invocation):**

```text
SCOPE: spec packet 011/001-off-baseline-audit in .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit/. Execute Phase A (measure) → Phase B (decide + patch if applicable) → Phase C (verify).

GATE 3: D) Skip — packet already exists; this dispatch only fills evidence + may patch lib/search/scoring/

ALLOWED WRITE PATHS:
- 011/001-off-baseline-audit/implementation-summary.md (fill §Baseline Numbers + §Verdict + §Penalty Site)
- 011/001-off-baseline-audit/evidence/ (new evidence files)
- .opencode/skills/system-spec-kit/mcp_server/lib/search/ (penalty patch + new helper, ONLY if OFF_ACCEPTABLE)
- .opencode/skills/system-spec-kit/mcp_server/tests/ (new vitest, ONLY if OFF_ACCEPTABLE)
- 011-spec-memory-rerank-decision-arc/spec.md (continuity update only)

DO NOT TOUCH: cross-encoder.ts, the sidecar, any other rerank packet, any other lib/ subdir.

DELIVERABLES:
1. evidence/off-baseline-<YYYY-MM-DD>.json with per-probe results + summary
2. implementation-summary.md filled (§Baseline Numbers, §Penalty Site, §Verdict, §Failure Analysis if applicable)
3. If OFF_ACCEPTABLE: patch landed + vitest exits 0 + arc parent phase-map updated
4. If OFF_DEFICIENT: Phase 2 spec gets concrete target metrics in its §Scope
5. Strict-validate exit 0 on this packet

VERIFICATION (run + paste output into implementation-summary):
- cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/<new-test> (if patched)
- bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/.../011-spec-memory-rerank-decision-arc/001-off-baseline-audit --strict
- bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/.../011-spec-memory-rerank-decision-arc --strict

COMMIT HANDOFF: do NOT commit. Cli-codex sandbox blocks .git/index.lock per existing memory. List exact paths modified at the end of implementation-summary §Commit Handoff. Main agent commits on behalf.
```

**Invocation shape (main agent issues):**

```bash
codex exec \
  --model gpt-5.5 \
  --sandbox workspace-write \
  -c sandbox_workspace_write.network_access=false \
  -c model_reasoning_effort="high" \
  -c service_tier="fast" \
  -c sandbox_workspace_write.writable_roots='["/path/to/Public"]' \
  --output-last-message /tmp/codex-001-output.txt \
  --prompt-file /tmp/codex-001-prompt.txt
```

Network access stays disabled because no model downloads are needed in Phase 1 (no embedder + no reranker work).
<!-- /ANCHOR:dispatch -->
