# Iteration 016 — MAINTAINABILITY (onboarding pass)

## P0 Findings

### registry.ts:180-182 — Special case without rationale
**Issue:** The `getAdapter` function has a hardcoded special case for `'embeddinggemma-300m'` that allows it through the `llama-cpp` backend, but throws `NotImplementedError` for all other `llama-cpp` models. No comment explains why only this specific model is supported.

**Repro:** A new engineer reading the code will see the switch statement at line 176 and wonder: "Why is llama-cpp partially implemented? Why only this one model? Is this temporary or permanent? Should I add other models here?" The comment at line 4-7 mentions phase 016/002 but doesn't explain the restriction.

**Recommendation:** Add a comment explaining the constraint: "llama-cpp backend is currently legacy-only for embeddinggemma-300m (baseline). New models should use ollama backend. See phase 016/004 for migration plan." Link to relevant spec documentation.

### stage2-fusion.ts:21-33 — Signal application order without rationale
**Issue:** The file has a 13-step signal application order with detailed steps but no explanation of why this specific order, why 13 steps, or what would break if reordered. A new engineer cannot understand the architectural reasoning.

**Repro:** When a new engineer needs to add a new signal or debug a scoring issue, they have no guidance on where to insert it or why the current order exists. They might reorder steps and break the "G2 double-weighting guard" mentioned at line 11 without understanding the invariant.

**Recommendation:** Add architectural rationale: "Order is critical: session/recency signals must be applied before intent weights to prevent double-counting. Graph signals (causal, co-activation, community) are grouped together as they represent structural relationships. Feedback signals come after base scoring to avoid contaminating learned models. Document the G2 double-weighting bug this order prevents."

### retrieval-rescue.ts:45-52 — Magic weights without derivation
**Issue:** `DOCUMENT_HINTS` array contains hardcoded weights (0.22, 0.18, 0.16, 0.14) with no explanation of how they were derived or what they represent. A new engineer cannot tune these or understand their impact.

**Repro:** When tuning retrieval performance, a new engineer sees these numbers but has no context: Are these empirically derived? Theoretically motivated? What happens if I change 0.22 to 0.25? Is there a constraint that weights must sum to something?

**Recommendation:** Add comment explaining: "Weights are empirically tuned on paraphrase recall dataset (see packet 008/cat-24/409). Decision records get highest weight (0.22) as they're high-signal for intent. Weights are independent (no sum constraint) but should stay below 0.3 to avoid overwhelming semantic scores."

## P1 Findings

### reindex.ts:331 — Complex job ID format without documentation
**Issue:** Job ID format `emb-swap-${timestamp.replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}` is complex with no explanation of the format or why this structure.

**Repro:** A new engineer debugging job issues needs to parse job IDs or generate test IDs but doesn't understand the components. Why replace `:` and `.` with `-`? Why only 8 chars of UUID? Is this format consumed elsewhere?

**Recommendation:** Add comment: "Job ID format: emb-swap-{ISO-timestamp-sanitized}-{UUID-8char}. Timestamp sanitized for filesystem safety. UUID suffix prevents collisions if multiple jobs start in same second. Format is stable — do not change without migration plan."

### retrieval-rescue.ts:82-91 — Complex regex without breakdown
**Issue:** `queryTokens` uses a complex regex `/[a-z]+[-_/]\d+|[a-z0-9]+(?:[-_/][a-z0-9]+)+/g` with no explanation of what patterns it matches or why.

**Repro:** A new engineer debugging tokenization issues sees this regex but cannot understand what it's extracting. Does it match version numbers? Ticket IDs? File paths? The subsequent filtering (length >= 4) is also unexplained.

**Recommendation:** Add comment: "Matches compound tokens like 'ticket-123' or 'feature/v2' and kebab/snake_case identifiers. First alternative matches letter-prefix + number suffix. Second matches sequences with separators. Filtered to length >= 4 to avoid noise."

### retrieval-rescue.ts:135-166 — Magic scoring constants without explanation
**Issue:** `phraseScore` contains magic numbers (0.35, 0.92, 0.32, 0.86) in the matching logic with no explanation of the scoring curve or rationale.

**Repro:** A new engineer tuning phrase matching sees these thresholds but no guidance: Why 0.35 for single-token exact phrase vs 0.92 for multi-token? What's the difference between 0.86 and 0.92 for reverse inclusion? Are these empirically derived?

**Recommendation:** Add comment: "Scoring curve: exact match = 1.0. Query-contains-phrase: single token gets 0.35 (weak signal), multi-token gets 0.92 (strong signal). Phrase-contains-query: single token gets 0.32, multi-token gets 0.86. Token overlap coverage score for partial matches. Thresholds tuned on paraphrase dataset."

### stage2-fusion.ts:268-277 — Validation scoring magic numbers
**Issue:** Validation signal scoring uses magic numbers (0.9, 0.2, 0.06, 0.02, 0.04, 0.015, 0.01) with no explanation of derivation or constraints.

**Repro:** A new engineer adjusting validation weights cannot understand the formula: Why 0.9 + quality * 0.2? Why is specLevel bonus capped at 0.06? What's the rationale for completion bonus (0.04 vs 0.015)?

**Recommendation:** Add comment: "Quality factor: baseline 0.9, max 1.1 (±10% adjustment). Spec level bonus: (level-1) * 0.02, capped at 0.06 (max level 4). Completion: complete=0.04, partial=0.015. Checklist=0.01. All bonuses additive but clamped via clampMultiplier to [0.8, 1.2] to prevent extreme swings."

## P2 Findings

### registry.ts:188-189 — Unreachable case could confuse
**Issue:** The `default` case in the switch statement uses `never` type assertion to mark unreachable, which could confuse TypeScript newcomers.

**Repro:** A new engineer unfamiliar with TypeScript exhaustiveness checking might wonder why this case exists or what it does.

**Recommendation:** Add comment: "Exhaustiveness check: if BackendKind enum is extended, this will compile-error reminding to add adapter case."

### reindex.ts:70 — Batch size without rationale
**Issue:** `DEFAULT_BATCH_SIZE = 50` with no explanation of why this number or performance implications.

**Repro:** A new engineer might wonder if this should be tuned for their deployment or if there are memory/performance tradeoffs.

**Recommendation:** Add comment: "Batch size balances memory usage (embeddings are Float32Array) vs. throughput. 50 is conservative for 768-dim models (~150KB per batch). Tune via EMBEDDER_REINDEX_BATCH_SIZE env var."

### retrieval-rescue.ts:254-262 — Document type priority without explanation
**Issue:** Complex CASE statement for document type priority in `fetchSiblingRows` with no explanation of why this order.

**Repro:** A new engineer seeing this priority order (spec → decision_record → implementation_summary → tasks → checklist → plan) doesn't understand the reasoning.

**Recommendation:** Add comment: "Priority order reflects signal density: specs are highest-signal, followed by decision records (rationale), then implementation artifacts. Lower priority for tasks/checklists as they're more operational."

### stage2-fusion.ts:126-135 — Magic constants without context
**Issue:** Multiple magic constants (SPREAD_ACTIVATION_TOP_N = 5, RECENCY_FUSION_WEIGHT = 0.07, RECENCY_FUSION_CAP = 0.10) with no explanation of why these values.

**Repro:** A new engineer tuning these parameters has no guidance on appropriate ranges or what changing them will affect.

**Recommendation:** Add comments for each constant explaining its purpose and tuning guidance. For example: "TOP_N = 5: spread activation from top 5 results. Higher N increases recall but may dilute signal. Weight/cap are env-tunable for experimentation."

### Cross-file coupling undocumented
**Issue:** All four files have significant cross-file dependencies (imports, shared types) but no high-level architecture diagram or module relationship documentation.

**Repro:** A new engineer cannot understand the data flow: how registry.ts manifests flow into reindex.ts jobs, how retrieval-rescue.ts integrates with stage2-fusion.ts pipeline, or the overall architecture.

**Recommendation:** Add a module-level ARCHITECTURE.md or inline diagrams showing: registry → adapter → embedder → reindex → pipeline stages. Document the contract between modules (e.g., PipelineRow field evolution, EmbedderAdapter interface).
