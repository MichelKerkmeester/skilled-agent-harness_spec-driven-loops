# Iteration 8: Maintainability (Re-pass)

**Date:** 2026-05-21  
**Dimension:** maintainability  
**Focus:** Long-term maintenance burden of dual flag pattern, test clarity, spec doc traceability, code clarity, future re-enable path, naming consistency, comments quality  
**Status:** complete

---

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:99-126` — Dual flag functions
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:256-262` — Conditional penalty application
- `.opencode/skills/system-spec-kit/mcp_server/tests/scoring-opt-in.vitest.ts:70-107` — Test coverage
- `.opencode/skills/system-spec-kit/SKILL.md:377-379` — Opt-in documentation
- `.opencode/skills/system-rerank-sidecar/SKILL.md:12,220-223` — Consumer documentation
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure/spec.md` — Implementation scope
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure/implementation-summary.md` — Verification evidence
- Superseded packet frontmatters (011/002, 011/003, 011/004, 008/005, 008/007, 008/008, 008/009) — Traceability verification

---

## Findings by Severity

### P2: Dual flag maintainability burden

**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:99-126`

**Evidence:** Two functions with nearly identical logic exist without clear documentation of their relationship:

- `isCrossEncoderEnabled()` (lines 103-109): Returns true if `SPECKIT_CROSS_ENCODER=true` OR cloud API key present OR `RERANKER_LOCAL=true`
- `isRerankerExpected()` (lines 120-126): Returns true if cloud API key present OR `SPECKIT_CROSS_ENCODER=true` OR `RERANKER_LOCAL=true`

The implementations are semantically equivalent (same three conditions, different order), but the naming suggests different semantics ("enabled" vs "expected"). No comment explains why both exist or when to use which. A future maintainer must read both implementations carefully to determine the correct usage.

**Finding class:** maintainability

**Scope proof:** Grep for `isCrossEncoderEnabled` and `isRerankerExpected` shows only two usages: `isCrossEncoderEnabled` is used in `cross-encoder.ts` for provider selection, while `isRerankerExpected` is used only in `confidence-scoring.ts:256` for the conditional penalty.

**Affected surface hints:** ["search-flags.ts", "confidence-scoring.ts", "cross-encoder.ts"]

**Recommendation:** Add a clarifying comment above both functions explaining their relationship, or consolidate to a single function if the semantic distinction is not meaningful. Example: `// isRerankerExpected() is the canonical opt-in detector for confidence scoring. isCrossEncoderEnabled() is a legacy alias used by cross-encoder.ts provider selection; prefer isRerankerExpected() for new code.`

---

### P2: Naming inconsistency obscures semantic distinction

**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:99-126`

**Evidence:** The function names `isCrossEncoderEnabled` and `isRerankerExpected` suggest different semantics ("is feature enabled?" vs "was reranker expected?"), but the implementations are nearly identical. The naming does not tell a coherent story about when to use which function. A reader would reasonably assume "enabled" means the feature is active, while "expected" means operator intent, but both check the same three conditions.

**Finding class:** maintainability

**Scope proof:** Only two call sites exist in the codebase (cross-encoder.ts and confidence-scoring.ts), so this is not a widespread confusion risk, but the naming is nonetheless misleading for future maintainers.

**Affected surface hints:** ["search-flags.ts", "function naming"]

**Recommendation:** Rename to clarify semantics: `isCrossEncoderEnabled` → `isRerankerAvailable` (for provider selection), `isRerankerExpected` → `isRerankerOptedIn` (for confidence scoring). Or consolidate to a single function if the distinction is not meaningful.

---

### P2: Missing inline rationale for dual-function pattern

**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:99-126`

**Evidence:** The code comments document the default-off decision (line 100: "Default: FALSE (opt-in). See 011 arc 011/005-opt-in-only-closure for the evidence + decision"), but there is no comment explaining why two nearly identical functions exist or what the semantic difference is between them. The rationale for the opt-in default-off lives in spec docs and SKILL.md, but the dual-function design rationale is not documented anywhere.

**Finding class:** documentation

**Scope proof:** No comments exist between lines 99-126 explaining the relationship between the two functions.

**Affected surface hints:** ["search-flags.ts", "code comments"]

**Recommendation:** Add a module-level comment or inline comment explaining the dual-function pattern: "Two opt-in detectors exist for historical reasons: isCrossEncoderEnabled() is used by cross-encoder.ts provider selection, isRerankerExpected() is used by confidence-scoring.ts for penalty logic. Both check the same three conditions (SPECKIT_CROSS_ENCODER, cloud keys, RERANKER_LOCAL) but are kept separate to avoid coupling provider selection to confidence semantics."

---

## Positive Findings (No Issues)

### Test maintainability: PASS

**File:** `.opencode/skills/system-spec-kit/mcp_server/tests/scoring-opt-in.vitest.ts:70-107`

**Evidence:** Test names are descriptive and would produce clear failures:
- "does not make retrieval-quality results weak when reranking is not opted in"
- "applies the existing missing-reranker confidence gap when local rerank is opted in"  
- "applies the existing missing-reranker confidence gap when cloud rerank is configured"

Test structure is clean with helper functions (`resetRerankerEnv`, `makeRetrievalQualityResults`, `topConfidenceValue`) that reduce duplication. Failures would clearly indicate which opt-in case is broken.

---

### Spec doc supersede traceability: PASS

**Files:** All 7 superseded packet frontmatters

**Evidence:** All 7 supersede statuses are traceable from current state without forensics:
- `011/002-bge-v2-m3-trial/spec.md:15` — `recent_action: "Superseded by 011/005 opt-in closure"`
- `011/003-domain-tuned-finetune/spec.md:16` — `recent_action: "Superseded by 011/005 opt-in closure"`
- `011/004-retrieval-and-fixture-audit/spec.md:16` — `recent_action: "Superseded by 011/005 opt-in closure"`
- `008/005-promote-qwen-as-default/spec.md:16` — `recent_action: "Superseded by 011/005 opt-in closure"`
- `008/007-spec-memory-mps-rerank-promotion/spec.md:16` — `recent_action: "Superseded by 011/005 opt-in closure"`
- `008/008-cap-rerank-top-k/spec.md:15` — `recent_action: "Superseded by 011/005 opt-in closure"`
- `008/009-fp16-rerank/spec.md:15` — `recent_action: "Superseded by 011/005 opt-in closure"`

All also have `blockers: ["Superseded — do not execute"]` and `next_safe_action: "Use 011/005 instead"`. The arc parent phase maps (011/spec.md and 008/spec.md) also reflect the supersede statuses. No forensics required to understand the decision trail.

---

### Conditional penalty pattern clarity: PASS

**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:256`

**Evidence:** The conditional penalty pattern `const rerankerPenalty = isRerankerExpected() ? WEIGHT_RERANKER * rerankerFactor : 0;` is reasonably clear. The ternary operator explicitly shows that the penalty is applied only when reranker was expected, and zero otherwise. The variable name `rerankerPenalty` is descriptive. No clearer alternative pattern is evident.

---

### Future re-enable path: PASS

**Files:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure/spec.md:67-70`

**Evidence:** The future re-enable path is straightforward: a future operator can flip `SPECKIT_CROSS_ENCODER=true` and the existing pipeline code (`cross-encoder.ts`, `pipeline/stage3-rerank.ts`, `RERANKER_LOCAL` flag) all still work. The spec explicitly states "Reversible" as a closure rationale (spec.md:67). No production code was deleted, only default consumption and confidence semantics changed. The opt-in path remains fully functional.

---

### Documentation updates: PASS

**Files:** `.opencode/skills/system-spec-kit/SKILL.md:377-379`, `.opencode/skills/system-rerank-sidecar/SKILL.md:12,220-223`

**Evidence:** Both SKILL.md files were updated with opt-in language:
- system-spec-kit/SKILL.md:377-379 has a "Reranking (opt-in)" section explaining the OFF-by-default decision with reference to 011 arc evidence
- system-rerank-sidecar/SKILL.md:12 and 220-223 clarifies consumers as "cocoindex (default), spec-memory (opt-in only via SPECKIT_CROSS_ENCODER=true or RERANKER_LOCAL=true)"

The documentation matches the implementation-summary's claims (lines 117-118).

---

## Traceability Checks

- **spec_code:** PASS — Code changes match spec requirements (search-flags.ts dual functions, confidence-scoring.ts conditional penalty, vitest coverage)
- **checklist_evidence:** PASS — All P0 requirements from 005 spec verified (default flipped, isRerankerExpected exists, penalty conditional, tests pass, docs updated, supersede sweep complete)
- **skill_agent:** PASS — SKILL.md has the documented opt-in section
- **agent_cross_runtime:** PASS — Opt-in semantics consistent across runtimes (documented in both SKILL.md files)

---

## Verdict

**CONDITIONAL** — No P0/P1 findings. Three P2 findings address the dual-function maintainability burden (naming, comments, relationship documentation). The implementation is functionally correct and well-tested, but the dual `isCrossEncoderEnabled`/`isRerankerExpected` pattern creates unnecessary cognitive load for future maintainers. The findings are advisory (P2) and do not block merge, but addressing them would improve long-term maintainability.

---

## SCOPE VIOLATIONS

**Delta file creation failed:** Attempted to create `review/deltas/iter-008.jsonl` but the deltas/ directory does not exist and directory creation is not permitted in non-interactive mode. The iteration narrative (iterations/iteration-008.md) and state log append (deep-review-state.jsonl) were successful. The delta file content is documented below for manual creation if needed:

```jsonl
{"type":"iteration","iteration":8,"mode":"review","run":"20260521T170312Z","status":"complete","focus":"maintainability (re-pass: long-term burden + future-flexibility)","dimensions":["maintainability"],"filesReviewed":[".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:99-126",".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:256-262",".opencode/skills/system-spec-kit/mcp_server/tests/scoring-opt-in.vitest.ts:70-107",".opencode/skills/system-spec-kit/SKILL.md:377-379",".opencode/skills/system-rerank-sidecar/SKILL.md:12,220-223",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure/spec.md",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure/implementation-summary.md",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial/spec.md",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune/spec.md",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/004-retrieval-and-fixture-audit/spec.md",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/005-promote-qwen-as-default/spec.md",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/007-spec-memory-mps-rerank-promotion/spec.md",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/008-cap-rerank-top-k/spec.md",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/009-fp16-rerank/spec.md"],"findingsCount":3,"findingsSummary":{"P0":0,"P1":0,"P2":3},"findingsNew":["R8-P2-001","R8-P2-002","R8-P2-003"],"traceabilityChecks":{"spec_code":"PASS","checklist_evidence":"PASS","skill_agent":"PASS","agent_cross_runtime":"PASS"},"newFindingsRatio":1,"sessionId":"20260521T170312Z","generation":1,"lineageMode":"new","timestamp":"2026-05-21T19:57:00Z","durationMs":180000,"graphEvents":[]}
{"type":"finding","id":"R8-P2-001","severity":"P2","cluster":"maintainability","file":".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:99-126","title":"Dual flag maintainability burden","iteration":8,"evidence":"Two functions with nearly identical logic exist without clear documentation of their relationship: isCrossEncoderEnabled() (lines 103-109) and isRerankerExpected() (lines 120-126). Both check the same three conditions (SPECKIT_CROSS_ENCODER, cloud API keys, RERANKER_LOCAL) in different order. No comment explains why both exist or when to use which. A future maintainer must read both implementations carefully to determine correct usage.","findingClass":"maintainability","scopeProof":"Grep for isCrossEncoderEnabled and isRerankerExpected shows only two usages: isCrossEncoderEnabled is used in cross-encoder.ts for provider selection, while isRerankerExpected is used only in confidence-scoring.ts:256 for the conditional penalty.","affectedSurfaceHints":["search-flags.ts","confidence-scoring.ts","cross-encoder.ts"],"recommendation":"Add a clarifying comment above both functions explaining their relationship, or consolidate to a single function if the semantic distinction is not meaningful. Example: '// isRerankerExpected() is the canonical opt-in detector for confidence scoring. isCrossEncoderEnabled() is a legacy alias used by cross-encoder.ts provider selection; prefer isRerankerExpected() for new code.'"}
{"type":"finding","id":"R8-P2-002","severity":"P2","cluster":"maintainability","file":".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:99-126","title":"Naming inconsistency obscures semantic distinction","iteration":8,"evidence":"The function names isCrossEncoderEnabled and isRerankerExpected suggest different semantics ('is feature enabled?' vs 'was reranker expected?'), but the implementations are nearly identical. The naming does not tell a coherent story about when to use which function. A reader would reasonably assume 'enabled' means the feature is active, while 'expected' means operator intent, but both check the same three conditions.","findingClass":"maintainability","scopeProof":"Only two call sites exist in the codebase (cross-encoder.ts and confidence-scoring.ts), so this is not a widespread confusion risk, but the naming is nonetheless misleading for future maintainers.","affectedSurfaceHints":["search-flags.ts","function naming"],"recommendation":"Rename to clarify semantics: isCrossEncoderEnabled → isRerankerAvailable (for provider selection), isRerankerExpected → isRerankerOptedIn (for confidence scoring). Or consolidate to a single function if the distinction is not meaningful."}
{"type":"finding","id":"R8-P2-003","severity":"P2","cluster":"documentation","file":".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:99-126","title":"Missing inline rationale for dual-function pattern","iteration":8,"evidence":"The code comments document the default-off decision (line 100: 'Default: FALSE (opt-in). See 011 arc 011/005-opt-in-only-closure for the evidence + decision'), but there is no comment explaining why two nearly identical functions exist or what the semantic difference is between them. The rationale for the opt-in default-off lives in spec docs and SKILL.md, but the dual-function design rationale is not documented anywhere.","findingClass":"documentation","scopeProof":"No comments exist between lines 99-126 explaining the relationship between the two functions.","affectedSurfaceHints":["search-flags.ts","code comments"],"recommendation":"Add a module-level comment or inline comment explaining the dual-function pattern: 'Two opt-in detectors exist for historical reasons: isCrossEncoderEnabled() is used by cross-encoder.ts provider selection, isRerankerExpected() is used by confidence-scoring.ts for penalty logic. Both check the same three conditions (SPECKIT_CROSS_ENCODER, cloud keys, RERANKER_LOCAL) but are kept separate to avoid coupling provider selection to confidence semantics.'"}
```

---

## Next Dimension

Maintainability re-pass complete. All four review dimensions (correctness, security, traceability, maintainability) have now been covered twice. Coverage ratios are stable. Recommended next step: assess convergence and prepare final review report, or exit if convergence threshold is met.
