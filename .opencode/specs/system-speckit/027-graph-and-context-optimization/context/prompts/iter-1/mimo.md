# CONTEXT
You are a READ-ONLY codebase-context analyzer (one model lens in a deep-context loop).
Repo root: the current `--dir`. We are gathering a reuse-first context map of all work done in the
COMPLETED spec-kit packet `system-spec-kit/026-graph-and-context-optimization`. This is iteration 1
of a multi-iteration sweep. THIS iteration covers the **documentation narrative / program band**:
what each of the 9 phases delivered, the key decisions, and the program-level seams.

Canonical read-only root:
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization`

# OBJECTIVE
Use your Read tool to read EACH of these files in full, then extract structured findings about what
the 026 program delivered (the program narrative — NOT a line-by-line code audit this pass):

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md`  (root program map / 8-track topology / status)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/context-index.md`  (migration bridge, consolidation history)
- `.../026-graph-and-context-optimization/000-release-and-program-cleanup/spec.md`
- `.../026-graph-and-context-optimization/001-research-and-baseline/spec.md`
- `.../026-graph-and-context-optimization/002-spec-kit-internals/spec.md`
- `.../026-graph-and-context-optimization/003-memory-and-causal-runtime/spec.md`
- `.../026-graph-and-context-optimization/004-code-graph/spec.md`
- `.../026-graph-and-context-optimization/005-graph-impact-and-affordance/spec.md`
- `.../026-graph-and-context-optimization/006-operator-tooling/spec.md`
- `.../026-graph-and-context-optimization/007-mcp-daemon-reliability/spec.md`
- `.../026-graph-and-context-optimization/008-runtime-defect-fixes/spec.md`

For each phase capture: what it shipped (and its status — complete/deferred/partial), the key
decisions/ADRs (durable policies), the seams where its subsystem connects to others, cross-phase
dependencies, and any deferred/abandoned/open work.

# STYLE
Terse and evidence-cited. Every finding cites `evidence` as `file:line` (or `file` if a whole-doc
claim). Prefer specific subsystem/artifact names over vague phrases. No hedging, no filler.

# TONE
Precise, analytical, neutral.

# AUDIENCE
A downstream `/speckit:plan` author who needs to know what already exists in 026 so they reuse it
rather than rebuild it. Findings must be actionable pointers.

# RESPONSE FORMAT
Return ONLY a single JSON object and NOTHING else (no prose, no markdown fences). Schema:

```
{ "findings": [
  { "path": "<repo-relative file the finding is about>",
    "symbol": "<phase id / subsystem / decision name, optional>",
    "kind": "reuse_candidate | integration_point | convention | dependency | gap",
    "signature": "<one-line what-it-is>",
    "reuse": "extend | compose | wrap | import",
    "evidence": "<file:line or file>",
    "relevance": 0.0,
    "notes": "<concise, what a planner must know>" }
] }
```

Rules:
- `kind` MUST be exactly one of the 5 values above.
- Every finding MUST have a `path` (and/or `symbol`) and a numeric `relevance` in [0,1].
- Map narrative → kinds: shipped capability to build on = `reuse_candidate`; cross-subsystem seam =
  `integration_point`; established policy/ADR/standard = `convention`; cross-phase/subsystem need =
  `dependency`; deferred/abandoned/open = `gap`.
- Omit `unit_id` (the host derives it).
- Aim for 15–30 high-signal findings spanning all 9 phases. Do not pad.
