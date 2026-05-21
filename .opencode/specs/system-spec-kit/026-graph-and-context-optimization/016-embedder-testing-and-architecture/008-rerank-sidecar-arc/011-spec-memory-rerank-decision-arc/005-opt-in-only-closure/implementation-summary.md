---
title: "Implementation Summary: opt-in-only closure [template:level_1/implementation-summary.md]"
description: "Code patch, supersede sweep, arc closure, and verification evidence for the 011/005 opt-in-only rerank verdict."
trigger_phrases:
  - "011/005 summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure"
    last_updated_at: "2026-05-21T15:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Implemented opt-in-only closure"
    next_safe_action: "Main agent commit handoff"
    blockers: []
    completion_state: "complete"
---
# Implementation Summary: opt-in-only closure

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: COMPLETE.** cli-codex executed the code patch, supersede sweep, arc parent closure, docs update, and verification sweep.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete |
| **Created** | 2026-05-21 |
| **Completed** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `011-spec-memory-rerank-decision-arc` |
| **Position in arc** | Terminal (arc closer) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` — flipped `SPECKIT_CROSS_ENCODER` to opt-in semantics and added `isRerankerExpected()`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` — guarded the reranker confidence factor behind operator opt-in.
- `.opencode/skills/system-spec-kit/mcp_server/tests/scoring-opt-in.vitest.ts` — added 3 focused Vitest cases for default-off, local opt-in, and cloud opt-in scoring behavior.
- Seven sibling packets — marked superseded in frontmatter and `graph-metadata.json`.
- `011-spec-memory-rerank-decision-arc/` and `008-rerank-sidecar-arc/` — updated phase maps and graph metadata to close the decision arc.
- `.opencode/skills/system-spec-kit/SKILL.md` and `.opencode/skills/system-rerank-sidecar/SKILL.md` — documented spec-memory reranking as opt-in while cocoindex remains a default sidecar consumer.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

cli-codex gpt-5.5 medium fast, `network=false`, single dispatch, workspace-write. No daemons, model downloads, package changes, fixture rebuilds, database edits, or commits.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:code-changes -->
## Code Changes

| File | Lines | Change |
|------|-------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | 99-108 | Updated the cross-encoder comment to default OFF and made `isCrossEncoderEnabled()` true only for explicit opt-in signals: `SPECKIT_CROSS_ENCODER=true`, cloud API key, or `RERANKER_LOCAL=true`. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | 111-126 | Added exported `isRerankerExpected()` with the plan docstring and the same operator-intent checks. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | 27 | Imported `isRerankerExpected` from `./search-flags.js`. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | 39, 251, 256-262 | Audited all `WEIGHT_RERANKER` / `rerankerFactor` sites. The only application now uses `const rerankerPenalty = isRerankerExpected() ? WEIGHT_RERANKER * rerankerFactor : 0;`. No other call sites required a guard. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/scoring-opt-in.vitest.ts` | 70-107 | Added the three opt-in scoring assertions. |
<!-- /ANCHOR:code-changes -->

---

<!-- ANCHOR:new-tests -->
## New Tests

| Case | Assertion |
|------|-----------|
| No env vars set | Retrieval-quality results remain `requestQuality: good`; they are not weak solely because reranking is absent. |
| `SPECKIT_CROSS_ENCODER=true`, no reachable reranker | Existing missing-reranker confidence gap is preserved: the same results score lower without real reranker fields than with `rerankerApplied: true`. |
| `VOYAGE_API_KEY=fake-key`, no reachable Voyage | Cloud configuration counts as opt-in and preserves the same missing-reranker confidence gap. |
<!-- /ANCHOR:new-tests -->

---

<!-- ANCHOR:supersede-sweep -->
## Supersede Sweep

| Packet | Before status | After status |
|--------|---------------|--------------|
| `011/002-bge-v2-m3-trial/` | `complete` | `superseded` |
| `011/003-domain-tuned-finetune/` | `planned` | `superseded` |
| `011/004-retrieval-and-fixture-audit/` | `planned` | `superseded` |
| `008/005-promote-qwen-as-default/` | `planned` in graph metadata; spec body said Complete (HOLD) | `superseded` |
| `008/007-spec-memory-mps-rerank-promotion/` | `planned` | `superseded` |
| `008/008-cap-rerank-top-k/` | `planned` | `superseded` |
| `008/009-fp16-rerank/` | `planned` | `superseded` |
<!-- /ANCHOR:supersede-sweep -->

---

<!-- ANCHOR:arc-closure -->
## Arc Closure

Arc 011 is closed with the operator verdict from 2026-05-21: keep the shared sidecar framework because cocoindex has a working default consumer, but make spec-memory reranking explicit opt-in only. The 011 parent phase map now marks 002, 003, and 004 as superseded by 011/005 and marks 005 complete. The 008 parent phase map marks 005, 007, 008, and 009 superseded by 011/005, with 011 complete as the opt-in-only verdict.
<!-- /ANCHOR:arc-closure -->

---

<!-- ANCHOR:docs-updated -->
## Docs Updated

- `.opencode/skills/system-spec-kit/SKILL.md` — added `Reranking (opt-in)` under Spec Kit Memory with the OFF-by-default decision and enablement instructions.
- `.opencode/skills/system-rerank-sidecar/SKILL.md` — clarified consumers as cocoindex default and spec-memory opt-in via `SPECKIT_CROSS_ENCODER=true` or `RERANKER_LOCAL=true`.
<!-- /ANCHOR:docs-updated -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001: Keep shared sidecar framework; make spec-memory opt-in only
**Rationale:** Cocoindex's reranker remains load-bearing. Spec-memory's rerank arc produced HOLD verdicts and identical-to-OFF evidence, so the justified change is removing default assumptions from spec-memory rather than deleting shared infrastructure.

### D-002: Centralize opt-in semantics
**Rationale:** `isRerankerExpected()` keeps confidence scoring from hard-coding env checks. `isCrossEncoderEnabled()` also treats cloud keys and `RERANKER_LOCAL=true` as explicit operator intent so existing provider paths stay reachable.

### D-003: Supersede docs rather than delete them
**Rationale:** The superseded packets are historical decision evidence. `manual.superseded_by` preserves graph traversal to 011/005 without erasing the evidence trail.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

```bash
cd .opencode/skills/system-spec-kit/mcp_server
npx vitest run tests/scoring-opt-in.vitest.ts
```

Result:

```text
Test Files  1 passed (1)
Tests       3 passed (3)
```

```bash
cd .opencode/skills/system-spec-kit/mcp_server
npx vitest run tests/cross-encoder-extended.vitest.ts
```

Result:

```text
Test Files  1 passed (1)
Tests       34 passed (34)
```

```bash
cd .opencode/skills/system-spec-kit/mcp_server
npx vitest run tests/
```

Result after the provider-intent fix:

```text
Test Files  47 failed | 561 passed | 13 skipped (621)
Tests       157 failed | 11048 passed | 81 skipped (11286)
Errors      1 error
```

Existing-vitest delta: packet baseline ceiling was <=168 failures; after this dispatch is 157 failures, so no regression above baseline. An earlier intermediate run before the provider-intent fix showed 172 failures, and the added failures were in provider routing; the final fix brought that back under baseline.

Strict-validate sweep:

| Packet | Exit |
|--------|------|
| `011/005-opt-in-only-closure/` | 0 |
| `011/002-bge-v2-m3-trial/` | 0 |
| `011/003-domain-tuned-finetune/` | 0 |
| `011/004-retrieval-and-fixture-audit/` | 0 |
| `008/005-promote-qwen-as-default/` | 0 |
| `008/007-spec-memory-mps-rerank-promotion/` | 0 |
| `008/008-cap-rerank-top-k/` | 0 |
| `008/009-fp16-rerank/` | 0 |
| `011-spec-memory-rerank-decision-arc/` | 0 |
| `008-rerank-sidecar-arc/` | 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The full Vitest suite still has the existing failing baseline (157 failures and 1 unhandled error), but that is below the requested <=168 ceiling.
2. This packet does not investigate retrieval/fixture quality. The operator verdict intentionally defers that work unless spec-memory reranking is opted back in.
3. Existing rerank code paths remain intact; this packet changes default consumption and confidence semantics only.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:commit-handoff -->
## Commit Handoff

Modified paths for the main agent commit:

- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/scoring-opt-in.vitest.ts`
- `.opencode/skills/system-spec-kit/SKILL.md`
- `.opencode/skills/system-rerank-sidecar/SKILL.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/005-promote-qwen-as-default/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/005-promote-qwen-as-default/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/007-spec-memory-mps-rerank-promotion/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/007-spec-memory-mps-rerank-promotion/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/008-cap-rerank-top-k/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/008-cap-rerank-top-k/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/009-fp16-rerank/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/009-fp16-rerank/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/004-retrieval-and-fixture-audit/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/004-retrieval-and-fixture-audit/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure/graph-metadata.json`
<!-- /ANCHOR:commit-handoff -->
