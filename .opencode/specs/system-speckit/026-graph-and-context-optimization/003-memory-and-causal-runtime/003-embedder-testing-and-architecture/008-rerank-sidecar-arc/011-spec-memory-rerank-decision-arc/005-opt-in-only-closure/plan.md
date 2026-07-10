---
title: "Plan: opt-in-only closure [template:level_1/plan.md]"
description: "3-phase plan: code patch → supersede sweep → arc closure narrative."
trigger_phrases:
  - "011/005 plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure"
    last_updated_at: "2026-05-21T15:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan scaffolded"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: opt-in-only closure

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

3 sequential phases; ~30-45 min wall clock; single cli-codex dispatch (`gpt-5.5 medium fast`).

| Phase | Step | Wall clock |
|---|---|---|
| A | Code patch (flag default + helper + conditional penalty + new vitest) | ~15-20 min |
| B | Supersede sweep (7 packets) | ~10-15 min |
| C | Arc closure narrative + impl-summary | ~10 min |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

```
COMPLETE iff
  SPECKIT_CROSS_ENCODER default is false AND
  isRerankerExpected() exported with correct semantics AND
  WEIGHT_RERANKER penalty conditional on isRerankerExpected() AND
  new vitest covering 3 cases passes (exit 0) AND
  all 7 supersede targets have frontmatter + graph-metadata updated AND
  011 + 008 arc parents updated AND
  spec-memory + sidecar docs updated with opt-in language AND
  strict-validate exit 0 on all 9 touched packets AND
  existing vitest failure count <= 168 (no new regressions)
ELSE PARTIAL
```

Auxiliary:
- Cocoindex side untouched (no edits under `mcp-coco-index/`)
- Sidecar Python source untouched (no edits under `system-rerank-sidecar/scripts/`)
- `cross-encoder.ts` + `pipeline/stage3-rerank.ts` untouched (opt-in path stays viable)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Phase A — Code patch

Three files in `.opencode/skills/system-spec-kit/mcp_server/`:

**`lib/search/search-flags.ts`:**
- Find the `SPECKIT_CROSS_ENCODER` accessor (line 100 area). Inline comment currently says "Default: TRUE (enabled)." Change default and the comment.
- Add new function:
  ```ts
  /**
   * Returns true when reranker was opted-in by operator intent
   * (cloud API key set OR SPECKIT_CROSS_ENCODER explicitly true
   * OR RERANKER_LOCAL explicitly true). False for default-off.
   *
   * Used by confidence-scoring to decide whether a missing
   * reranker counts as a penalty (opted-in but unavailable)
   * versus an expected absence (correctly off-by-default).
   */
  export function isRerankerExpected(): boolean {
    if (process.env.VOYAGE_API_KEY?.trim()) return true;
    if (process.env.COHERE_API_KEY?.trim()) return true;
    if (process.env.SPECKIT_CROSS_ENCODER?.toLowerCase().trim() === 'true') return true;
    if (process.env.RERANKER_LOCAL?.toLowerCase().trim() === 'true') return true;
    return false;
  }
  ```

**`lib/search/confidence-scoring.ts`:**
- Find line ~258 where `WEIGHT_RERANKER * rerankerFactor` is applied
- Wrap in `isRerankerExpected()` guard:
  ```ts
  import { isRerankerExpected } from './search-flags';
  ...
  const rerankerPenalty = isRerankerExpected() ? WEIGHT_RERANKER * rerankerFactor : 0;
  // (use rerankerPenalty where the original code used WEIGHT_RERANKER * rerankerFactor)
  ```

**`tests/scoring-opt-in.vitest.ts` (new):**
- Case 1: no env vars set → no penalty applied; confidence preserved
- Case 2: `SPECKIT_CROSS_ENCODER=true` + no sidecar reachable → penalty applied (existing behavior)
- Case 3: `VOYAGE_API_KEY=fake-key` + no Voyage reachable → penalty applied (cloud opt-in)
- Each case: construct a search result with known retrieval quality, assert `requestQuality` + confidence value

### Phase B — Supersede sweep

Seven packets. For each, update:

1. `spec.md` frontmatter `_memory.continuity.recent_action` → "Superseded by 011/005 opt-in closure"
2. `spec.md` frontmatter `_memory.continuity.next_safe_action` → "Use 011/005 instead" or "Superseded — do not execute"
3. `spec.md` frontmatter `_memory.continuity.blockers` → ["Superseded — do not execute"]
4. `graph-metadata.json` add `manual.superseded_by`: ["system-spec-kit/.../011/005-opt-in-only-closure"]
5. `graph-metadata.json` `derived.status` → "superseded"

Targets:
- `011/002-bge-v2-m3-trial/`
- `011/003-domain-tuned-finetune/`
- `011/004-retrieval-and-fixture-audit/`
- `008/005-promote-qwen-as-default/`
- `008/007-spec-memory-mps-rerank-promotion/`
- `008/008-cap-rerank-top-k/`
- `008/009-fp16-rerank/`

### Phase C — Arc closure + docs

Updates:

1. `011-spec-memory-rerank-decision-arc/spec.md` — phase-map: mark 005 Complete, all other phases Superseded; arc closure note at end of §1 ROOT PURPOSE
2. `011-spec-memory-rerank-decision-arc/graph-metadata.json` — last_active_child_id = 011/005, status = "complete"
3. `008-rerank-sidecar-arc/spec.md` — phase-map: mark 005/007/008/009 Superseded by 011/005; 011 Complete
4. `008-rerank-sidecar-arc/graph-metadata.json` — last_active_child_id update
5. `.opencode/skills/system-spec-kit/SKILL.md` — add "Reranking (opt-in)" section
6. `.opencode/skills/system-rerank-sidecar/SKILL.md` — clarify consumer table
7. `005-opt-in-only-closure/implementation-summary.md` — fill all sections with the decision narrative + evidence citations
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A (15-20 min)
1. Read `lib/search/search-flags.ts` to confirm line numbers
2. Flip default + update inline comment
3. Add `isRerankerExpected()` function with docstring
4. Read `lib/search/confidence-scoring.ts:38/250/258` to confirm penalty application
5. Wrap in conditional via the helper
6. Write `tests/scoring-opt-in.vitest.ts` with 3 cases
7. Run `npx vitest run tests/scoring-opt-in.vitest.ts` → exit 0
8. Run a focused regression check: `npx vitest run tests/search-flags.vitest.ts tests/confidence-scoring.vitest.ts` (if those exist)

### Phase B (10-15 min)
For each of 7 packets, sequentially:
1. Read spec.md + graph-metadata.json
2. Update frontmatter + graph-metadata per the spec
3. Strict-validate the packet → exit 0

### Phase C (10 min)
1. Update 011 arc parent
2. Update 008 arc parent
3. Update spec-memory + sidecar SKILL.md docs
4. Fill 005's implementation-summary.md sections (§What Was Built, §Verification, §Commit Handoff)
5. Final strict-validate sweep on all 9 packets
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- New `tests/scoring-opt-in.vitest.ts` with 3 cases (REQ-004)
- Smoke: ensure existing 168 vitest failure count doesn't grow (REQ-009)
- Manual: `SPECKIT_CROSS_ENCODER=true` env smoke test verifying the opt-in path still wires the reranker request
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 011/001 evidence (read-only, for narrative)
- 011/002 evidence (read-only, for narrative)
- vitest harness (already installed)
- No model loads, no daemons, no fixture access
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

```bash
git revert <commit-sha>
cd .opencode/skills/system-spec-kit/mcp_server && npm run build
```

No data, no daemon state, no env files touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dispatch -->
## 8. DISPATCH (cli-codex gpt-5.5 medium fast)

**Pre-flight:** `.opencode/skills/cli-codex/SKILL.md` already in context. No sidecar needed. No model loads.

**Dispatch prompt** lives in `/tmp/codex-011-005-prompt.txt`.

**Invocation:**

```bash
codex exec \
  --model gpt-5.5 \
  -c model_reasoning_effort="medium" \
  -c service_tier="fast" \
  -c approval_policy=never \
  --sandbox workspace-write \
  -c sandbox_workspace_write.network_access=false \
  -c "sandbox_workspace_write.writable_roots=[\"<REPO>\"]" \
  --cd <REPO> \
  -o /tmp/codex-011-005-output.txt \
  "$(cat /tmp/codex-011-005-prompt.txt)"
```

network_access=false (no daemon/model network calls), workspace-write (file edits + new test file).
<!-- /ANCHOR:dispatch -->
