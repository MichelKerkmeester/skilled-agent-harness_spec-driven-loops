# CONTEXT
READ-ONLY codebase-context analyzer, deep-context loop iteration 2. We are mapping all work done in
the COMPLETED packet `system-spec-kit/026-graph-and-context-optimization`. Iteration 1 already
captured the program narrative (per-phase deliverables). THIS iteration goes DEEPER on the **decisions,
research recommendations, and the one detailed implementation-summary** — the durable "why" a planner
must not relitigate.

Canonical read-only root: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization`

# KNOWN CONTEXT (already found in iter 1 — do NOT re-report these; deepen or add only)
reuse_candidates already captured: code-graph structural-indexing (004), 8-track program topology,
memory continuity substrate (003/001), v2 research synthesis (001), skill-advisor system (002),
daemon-lifecycle reliability (007), doctor command surface (006), causal-graph channel routing (003),
embedding local-first cascade ADR-014 (003/016).
conventions already captured: split semantic/structural/continuity topology; trust-axis separation;
honest-measurement-before-multiplier; single-writer daemon lease; manifest-driven templates;
code-graph structural-only.
gaps already captured: 005 deferred; 008 plugin-bridge fix reverted (dual-writer, → 028);
002/004 literal-names deferred; 006/003 install-doctor-realignment deferred.

# OBJECTIVE
Use Glob/Grep/Read to locate and read:
1. The 001 research deliverables under
   `.../026-graph-and-context-optimization/001-research-and-baseline/` — find `research.md`,
   `recommendations.md`, `findings-registry.json`, `cross-phase-matrix.md` (use Glob; they may be
   nested in a `research/` dir or a child phase). Extract the RANKED recommendations (R1, R10, etc.)
   and their adoption decisions.
2. `.../026-graph-and-context-optimization/008-runtime-defect-fixes/implementation-summary.md` —
   the four live defects, what shipped vs reverted, and WHY (especially the dual-writer hazard).
3. A sample of high-signal `decision-record.md` files (use `Glob` for
   `**/026-graph-and-context-optimization/**/decision-record.md`, then read 4–8 of the most
   architecturally significant — prioritize 003 memory/embedding, 004 code-graph, 007 daemon).

Capture: durable ADRs/decisions (conventions), hard constraints (CONSTRAINT→use kind `convention`),
research recommendations a planner must honor, cross-phase/subsystem dependencies, contradictions or
reversed decisions, and any additional deferred/open work (gaps).

# STYLE
Terse, evidence-cited (`file:line`). Name the specific ADR/recommendation id and decision verbatim-ish.
Skip anything already in KNOWN CONTEXT unless you add a materially new detail.

# TONE
Precise, analytical, neutral.

# AUDIENCE
A `/speckit:plan` author who must not re-decide what 026 already decided, and must honor its constraints.

# RESPONSE FORMAT
Return ONLY one JSON object, no prose/fences. Schema:
{ "findings": [ { "path": "...", "symbol": "<ADR/rec id or decision name>",
  "kind": "reuse_candidate | integration_point | convention | dependency | gap",
  "signature": "<one-line>", "reuse": "extend|compose|wrap|import",
  "evidence": "<file:line>", "relevance": 0.0, "notes": "<what a planner must honor>" } ] }
Rules: kind ∈ the 5 values; every finding has path and numeric relevance ∈ [0,1]; omit unit_id;
aim for 12–25 NEW high-signal findings (mostly convention/dependency/gap this pass). Do not pad.
