## Verdict
**AGREE-WITH-CHANGES** — confidence **0.62**. The measurement-surface + failure-only repair architecture is sound, but the spec as written contains a load-bearing dimensional contradiction and success criteria that imply capabilities this phase does not actually ship.

## What GPT-5.5 got right
- The **failure-JSON measurement surface** is the highest-ROI artifact here; even if SHIP lift is modest, phases 002–006 cannot run without it.
- **Failure-only repair** is correctly costed and avoids refining already-SHIP tiles.
- The **three-arm A/B** (control / prompt-only / prompt+gate+repair) is the right experimental structure to isolate causal effects.
- The six gate checks map cleanly to the observed RC-1..RC-5 failure modes.

## Gaps / risks / errors

### 1. CRITICAL: 480 vs 560 dimensional contradiction
The research-grounded A1 contract says **480×480** (`--tile-w:480px; --tile-h:480px; visualBox [24,24,432,304]`), while the spec and harness say **560×480** (`x=30..530`, `SAFE_LINEAR_560`). Applying the 480-width contract to a 560 card will either leave an 80px dead band or silently break centering/padding math. The spec cannot be implemented until one geometry is chosen and the contract coordinates recalculated. This is a copy-paste error from the parent research that has propagated into scope, requirements, and NFRs.

### 2. Success criteria are program-level, not phase-level
SC-001 claims **34–37/45 (76–82%) SHIP** and SC-002 claims narrowing the diagram-vs-linear delta to **15–22 pts** for a phase that explicitly **excludes** primitive routing (002), MiniMax fix-JSON (003), skeleton-first 2D (004), and GPT-5.5 skeleton author (005). Those four phases are where the 41-pt gap actually closes. Phase 001 should target a smaller, honest lift (e.g., +6–12 pp SHIP, mostly from RC-1/RC-3/RC-4 compliance, not diagram sophistication).

### 3. The contract does not actually ban the root-cause primitive
The root cause is **2D-positioned diagrams**. A2 says “Do not use a freeform 2D node map,” but the A1 contract only says *“convert to linear-flow if >3 nodes.”* A 3-node freeform diagram is still allowed and will still collide. The repair prompt should include a hard downgrade rule: if the gate detects ≥N absolute-positioned content elements or bbox overlap, the repair must switch to a linear/table primitive.

### 4. Bbox overlap detection will false-positive
“Any readable text/card/node bbox overlap” with zero tolerance will flag valid adjacent grid/flex items whose margins/padding touch. The gate needs a **pixel tolerance** (e.g., overlap area > 4 px²) and must ignore whitespace-collapsed inline text spans, otherwise T2 will over-repair and burn tokens.

### 5. “As-text vs as-fill” contrast is under-specified
REQ-004/NFR-C02 require distinguishing `#8591b3` as stroke vs text, but the algorithm is not defined. Edge cases not covered: SVG `<text>` inside a shape with the same fill, `currentColor`, CSS `color` inherited into pseudo-elements, text on semi-transparent overlays. Without a concrete rule, the gate will be noisy.

### 6. Preflight JSON assumes GLM compliance
REQ-005 requires parseable preflight metadata “stored as metadata, never rendered.” GLM-5.2 reliably emits JSON only when the format is trivial and the example is few-shot. A complex schema with nested arrays (`contrast_pairs`, `accent_semantics`) will frequently be malformed or hallucinated. The harness needs a **graceful fallback**: if preflight parse fails, fall back to DOM gate results.

### 7. Control-arm byte-reproducibility is unverified
NFR-R02 claims `control` reproduces the existing single-shot path, but `gen-tile.mjs` is being modified with arm guards, preflight parsing, and output isolation. Unless the control branch literally short-circuits before any of that code, byte reproducibility is a claim, not a fact.

### 8. Branch name is wrong
`system-speckit/028-memory-search-intelligence` is unrelated to this work; it is a copy-paste from a different packet and should be corrected.

## Strongest improvement or alternative
**Pull primitive-routing forward into the repair pass.** The phase should not wait until 002 to downgrade 2D diagrams. In `a1-repair.mjs`, when the gate detects absolute-positioned content overlap, title-zone intrusion, or >3 nodes/rows, the repair prompt should include a mandatory directive: *“Rebuild this tile using `linear-flow`, `stacked-ledger`, or `mini-table`; do not attempt to fix the 2D layout.”* This single change makes phase 001 capable of hitting a realistic SHIP target instead of merely measuring the problem.

## One thing to test or verify before building this phase
Run the **T1 (prompt-only) arm on the 5 lowest-scoring 2D tiles** (accountbeheer-4, orders-facturen-4, goedkeuringssysteem-4, oci-4, aangepast-assortiment-3) with no gate and no repair. If the prompt alone does not convert at least 3 of them to linear/table primitives, the phase-1 SHIP target is unachievable and primitive routing must be added before implementation.