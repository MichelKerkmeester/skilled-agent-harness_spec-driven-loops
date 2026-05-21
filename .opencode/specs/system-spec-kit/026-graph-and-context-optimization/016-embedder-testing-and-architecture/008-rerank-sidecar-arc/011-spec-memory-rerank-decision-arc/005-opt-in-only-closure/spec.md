---
title: "Spec: spec-memory rerank — opt-in-only closure [template:level_1/spec.md]"
description: "Terminal verdict for arc 011: keep the shared rerank-sidecar framework for cocoindex but make spec-memory's consumption explicitly opt-in (default OFF). Flips SPECKIT_CROSS_ENCODER default true→false, conditions WEIGHT_RERANKER penalty on intentional opt-in, supersedes sibling 011/002+003+004 + arc-008 spec-memory tuning packets (005/007/008/009), and closes arc 011 with a defensible decision recorded across docs."
trigger_phrases:
  - "011/005 opt-in closure"
  - "spec-memory rerank default off"
  - "WEIGHT_RERANKER conditional penalty"
  - "rerank decision arc closure"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure"
    last_updated_at: "2026-05-21T15:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded after opt-in-only decision"
    next_safe_action: "Dispatch cli-codex gpt-5.5 medium fast"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: spec-memory rerank — opt-in-only closure

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Planned (ready to execute) |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `011-spec-memory-rerank-decision-arc` |
| **Position in arc** | Terminal (closes the arc) |
| **Executor** | cli-codex gpt-5.5 medium fast |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After four HOLD verdicts (Phase 004 CPU-Qwen, Phase 005 CPU-ms-marco, Phase 007 MPS-Qwen, Phase 011/002 bge-v2-m3) plus an AI Council deliberation, the rerank arc reached the conclusion that no off-the-shelf or runtime-tuned reranker delivers a measurable quality lift for spec-memory's corpus. Phase 011/002 in particular returned **literally identical numbers to the OFF baseline** (hit-rate@5 0.12, NDCG@10 0.11, recall@5 0.12) at 19× the latency.

Two facts that stay true regardless of root cause:
1. **Spec-memory's `WEIGHT_RERANKER=0.20` boolean penalty** in `confidence-scoring.ts:38/250/258` is currently dragging `requestQuality` confidence down by 20% across every `memory_search` even when no reranker would help — measurement, not theory.
2. **Cocoindex's reranker works** (validated this session: 3/3 correct top-1 on the Ollama e2e with `cross_encoder_rerank` firing). The shared sidecar infrastructure is load-bearing for cocoindex.

The operator's decision: **don't tear down the shared framework, but stop pretending spec-memory uses it**. Make spec-memory's reranker consumption explicit opt-in. Default OFF. Penalty fires only when reranker was opted-in and is unavailable (cloud configured but unreachable, sidecar opted-in but down).

### Purpose

Land a small, mechanical patch that:
1. Flips `SPECKIT_CROSS_ENCODER` default from `true` → `false`.
2. Conditions the `WEIGHT_RERANKER` penalty on intentional opt-in via a new `isRerankerExpected()` helper.
3. Documents the opt-in semantics in spec-memory's INSTALL_GUIDE / SKILL.md and the sidecar skill's docs.
4. Sweeps supersede statuses across the 7 sibling rerank packets the decision invalidates.
5. Closes arc 011 with a terminal implementation-summary recording the decision + the evidence trail that produced it.

### Why this is the right closure

- **Reversible.** Future operator can flip `SPECKIT_CROSS_ENCODER=true` and the existing pipeline code (`cross-encoder.ts`, `pipeline/stage3-rerank.ts`, `RERANKER_LOCAL` flag) all still work. Nothing deleted.
- **Honest.** Removes the silent confidence penalty that hasn't been paying for itself.
- **Cheap.** ~15 LOC + 1 vitest + ~8 doc/spec updates. No models reloaded, no fixture rebuild, no fine-tune.
- **Closes loose ends.** 5 planned packets become explicitly superseded with the decision recorded once.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Code changes (`.opencode/skills/system-spec-kit/mcp_server/`):**

1. `lib/search/search-flags.ts` — flip `SPECKIT_CROSS_ENCODER` default `true` → `false`. Update the inline doc comment that currently says "Default: TRUE (enabled)."
2. `lib/search/search-flags.ts` — add `export function isRerankerExpected(): boolean` returning `true` iff (a) a cloud provider is configured (voyage / cohere API key set) OR (b) `SPECKIT_CROSS_ENCODER` is explicitly set to `true` OR (c) `RERANKER_LOCAL` is explicitly set to `true`. Returns `false` for default-off.
3. `lib/search/confidence-scoring.ts:258` — change `WEIGHT_RERANKER * rerankerFactor` application from unconditional to `isRerankerExpected() ? WEIGHT_RERANKER * rerankerFactor : 0`. Penalty fires only when reranker was opted-in but unavailable.
4. New `tests/scoring-opt-in.vitest.ts` asserting:
   - With no opt-in: `requestQuality` is not `'weak'` solely due to missing reranker; confidence not penalized
   - With opt-in (`SPECKIT_CROSS_ENCODER=true`) + no reachable reranker: confidence IS penalized (existing behavior preserved)
   - With opt-in + reachable reranker: confidence reflects retrieval quality with rerank lift

**Doc changes:**

5. `.opencode/skills/system-spec-kit/SKILL.md` (or INSTALL_GUIDE if it exists) — add a "Reranking (opt-in)" section: "Default OFF based on 011 arc evidence. Set `SPECKIT_CROSS_ENCODER=true` + ensure sidecar is running to enable."
6. `.opencode/skills/system-rerank-sidecar/SKILL.md` — clarify "Consumers: cocoindex (default), spec-memory (opt-in only)."

**Spec discipline (supersede sweep):**

7. `011/002-bge-v2-m3-trial/spec.md` — frontmatter `recent_action: "Superseded by 011/005 opt-in closure"`; phase-map row in 011/spec.md marks Superseded.
8. `011/003-domain-tuned-finetune/spec.md` — frontmatter superseded; status changed.
9. `011/004-retrieval-and-fixture-audit/spec.md` — frontmatter superseded; remains scaffolded as future-opt-in option with note.
10. `008-rerank-sidecar-arc/005-promote-qwen-as-default/spec.md` — frontmatter superseded.
11. `008-rerank-sidecar-arc/007-spec-memory-mps-rerank-promotion/spec.md` — frontmatter superseded.
12. `008-rerank-sidecar-arc/008-cap-rerank-top-k/spec.md` — frontmatter superseded.
13. `008-rerank-sidecar-arc/009-fp16-rerank/spec.md` — frontmatter superseded.
14. `011/spec.md` parent — phase-map updated; arc closure note in §1 ROOT PURPOSE.
15. `008-rerank-sidecar-arc/spec.md` parent — phase-map row for 011 updated to "Complete (opt-in only verdict)"; 005/007/008/009 marked Superseded by 011/005.
16. Update `graph-metadata.json` for each superseded packet: add `manual.superseded_by` pointing at `011/005`.

### Out of Scope

- **No production code deletion.** `cross-encoder.ts`, `pipeline/stage3-rerank.ts`, `RERANKER_LOCAL` flag — all stay. Opt-in path remains usable.
- **No sidecar changes.** `.opencode/skills/system-rerank-sidecar/` Python source and config untouched.
- **No cocoindex changes.** Cocoindex's reranker path stays exactly as it is.
- **No retrieval-pipeline changes.** The 011/004 audit's hypothetical RETRIEVAL_WORK branch stays open as a future arc.
- **No fixture rebuild.**
- **No deletion of superseded packets.** Per "DELETE not archive" memory rule, the docs stay; only frontmatter status updates.

### Files NOT touched

- `lib/search/cross-encoder.ts` — intentionally left intact (opt-in path)
- `lib/search/pipeline/stage3-rerank.ts` — intentionally left intact
- Any cocoindex source
- Any sidecar Python source
- Any fixture or evidence file from earlier 011 phases
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `SPECKIT_CROSS_ENCODER` default is `false` | `search-flags.ts` change + inline comment updated |
| REQ-002 | `isRerankerExpected()` helper exists + exported | Function signature + docstring in `search-flags.ts` |
| REQ-003 | `WEIGHT_RERANKER` penalty is conditional | `confidence-scoring.ts:258` reads through `isRerankerExpected()` |
| REQ-004 | New vitest covering all 3 opt-in cases passes | `npx vitest run tests/scoring-opt-in.vitest.ts` exit 0 |
| REQ-005 | spec-memory + sidecar docs updated with opt-in language | Diff captured in §Commit Handoff |
| REQ-006 | 7 sibling packets marked superseded (002, 003, 004 in 011; 005, 007, 008, 009 in arc 008) | Frontmatter `recent_action` + status updated; graph-metadata `superseded_by` populated |
| REQ-007 | 011 arc parent + 008 arc parent phase-maps updated | Spec.md diffs captured |
| REQ-008 | Strict-validate exit 0 on all 9 touched packets (this + 7 superseded + arc parent) | `validate.sh --strict` |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | The existing 168 vitest baseline doesn't grow | `npx vitest run tests/` failure count <= 168 |
| REQ-010 | Implementation-summary documents the decision narrative | §What Was Built has the evidence trail + 4-HOLD recap |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `SPECKIT_CROSS_ENCODER` default-off; opt-in by env var works on a manual smoke test
- **SC-002**: New vitest passes (3 cases)
- **SC-003**: 011 arc closes cleanly; arc 008's spec-memory-specific tuning packets all marked superseded
- **SC-004**: Cocoindex side unaffected; sidecar skill unaffected
- **SC-005**: Strict-validate exit 0 across the supersede sweep
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| `isRerankerExpected()` semantics get wrong (e.g. accidentally penalizes default-off OR fails to penalize cloud-misconfig) | Low | Confidence reporting regressions | The 3 vitest cases nail the semantic boundary; reviewer reads the function before merge |
| Other call sites of `WEIGHT_RERANKER` exist that the patch misses | Low | Partial fix | grep for `WEIGHT_RERANKER` and `rerankerFactor` references and audit each site before patching |
| Supersede sweep touches a packet that's mid-edit by another agent | Low | Merge conflict | Pull main before edits; verify no concurrent dispatch active |
| The "opt-in" doc message confuses users who DO want rerank | Low | UX papercut | Clear language: "default off based on 011 arc evidence — set env vars to enable" |

Dependencies:
- 011/001 evidence (read-only) — establishes the OFF baseline numbers that justify default-off
- 011/002 evidence (read-only) — establishes the no-quality-lift finding
- Existing vitest harness in `mcp_server/`
- No model loads, no sidecar restart, no fixture access required
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Q1**: Does `isRerankerExpected()` belong in `search-flags.ts` or `confidence-scoring.ts`? Tentative: `search-flags.ts` because it's a flag-reading helper, not a scoring concept. Consumer imports it into scoring.
- **Q2**: Should the cloud-provider check (voyage / cohere keys) be part of opt-in detection, or stay separate? Tentative: include cloud-key presence as opt-in signal — if a user configured Voyage explicitly, they're opted-in even without setting `SPECKIT_CROSS_ENCODER`.
- **Q3**: Should the dispatch also update CLAUDE.md or other top-level docs? Tentative: no — keep changes within the spec-kit skill + spec packets. Top-level updates can be a follow-on commit if anyone wants global awareness.
<!-- /ANCHOR:questions -->
