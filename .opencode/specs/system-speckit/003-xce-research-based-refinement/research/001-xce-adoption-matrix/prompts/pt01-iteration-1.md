# Deep-Research Iteration 1 of 10 — 027 XCE Research-Based Refinement

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 10
Questions: 0/9 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: **RQ1 — Architectural Context Gap**

Research Topic: Compare the public Xanther Context Engine (XCE) MCP surface in `external/` against our local `code_graph` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/`) and `skill_advisor` (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/`) subsystems. Identify adoption candidates by extracting findings, methods, logic, and architectural patterns from XCE's 5 tool primitives (`xce_get_context`, `xce_architecture_context`, `xce_search`, `xce_trace`, `xce_impact_analysis`), HLD/LLD layered abstractions, and context-first steering pattern. Reverse-engineer the closed-source PRAT (Persistent Recursive Abstract Tree) algorithm from public clues. Produce: `research/research.md`, `research/findings.md` (adoption matrix), `research/sub-packet-proposals.md`, `research/resource-map.md`.

Iteration: 1 of 10
Focus Area: **RQ1 — Architectural Context Gap**
Remaining Key Questions: RQ1, RQ2, RQ3, RQ4, RQ5, RQ6, RQ7, RQ8, RQ9
Last 3 Iterations Summary: (none yet — first iteration)

## STATE FILES (paths from repo root)

- Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`
- Spec authority (READ FIRST for full RQ list and scope): `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md`
- Config: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/deep-research-config.json`
- State Log: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/deep-research-state.jsonl`
- Strategy: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/deep-research-strategy.md`
- Registry: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/findings-registry.json`
- **Write iteration narrative to**: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-001.md`
- **Write per-iteration delta file to**: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/deltas/iter-001.jsonl`
- **Append iteration JSONL record to**: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/deep-research-state.jsonl`

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3–5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy.md machine-owned sections, registry, and dashboard. Do NOT edit those manually.
- Cite `file:line` for every claim. Read-only against `external/`, `mcp_server/code_graph/`, `mcp_server/skill_advisor/`.
- **Forbidden writes**: any path under `mcp_server/`, any path under `external/`. **Allowed writes**: only `research/` subfolder of this packet.

## ITERATION 1 GOAL — RQ1 ARCHITECTURAL CONTEXT GAP

Inventory both sides (XCE public surface, our local `code_graph`); diff payload shapes; propose minimum-viable HLD/LLD schema we could emit deterministically from existing graph data (no LLM yet).

### Suggested actions (≤5)

1. Read `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/README.md` (full file, ~283 lines). Capture XCE's `xce_architecture_context` payload shape: HLD vs LLD vs per-symbol component description. Note exact line numbers and quotes.
2. Read `.opencode/skills/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts` — enumerate all tool registrations. Locate `code_graph_context` schema.
3. Read `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/` — at least the `get-context` handler. What payload fields does it return?
4. Read 1–2 of `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/*.ts` (e.g. `structural-indexer.ts`, `budget-allocator.ts`). Are there any narrative-emitting helpers, or only structural-data emitters?
5. Diff the two payload shapes side-by-side. Identify the **minimum viable HLD/LLD schema** we could emit deterministically (no LLM): which fields come from existing graph data, which would require new computation, which would require generation.

### Findings expected (≥4)

- ≥2 `file:line` citations from `external/README.md` describing XCE's architecture-context payload (HLD/LLD/component description structure).
- ≥2 `file:line` citations from `mcp_server/code_graph/` describing our `code_graph_context` payload shape.
- A bullet list naming each field XCE's HLD/LLD has that ours lacks.
- A draft minimum-viable HLD/LLD schema (just field names + types + source) we could emit from existing graph data without an LLM call. Mark fields needing LLM generation as `[LLM-required]`.
- Preliminary verdict for RQ1: ADOPT / ADAPT / DEFER / SKIP with 1-sentence rationale (subject to revision in later iterations).

## OUTPUT CONTRACT (3 ARTIFACTS REQUIRED — workflow validation will fail the iteration if any is missing)

### Artifact 1 — Iteration narrative
Write `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-001.md` with sections (markdown):
- `# Iteration 1 — RQ1 Architectural Context Gap`
- `## Focus` (1–2 sentence statement of what this iteration explores)
- `## Actions Taken` (bullet list of file reads / greps / etc. — each with `file:line` cite)
- `## Findings` (subsections per finding, each with `file:line` evidence)
- `## Questions Answered` (RQs whose answers were filled in this iter — likely RQ1 progress, not yet resolved)
- `## Questions Remaining` (other RQs untouched)
- `## Next Focus` (recommendation for iteration 2 — typically RQ2 Trace Tool Design)

### Artifact 2 — JSONL iteration record
APPEND ONE LINE to `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/deep-research-state.jsonl`. The line MUST use `"type":"iteration"` exactly:
```json
{"type":"iteration","iteration":1,"newInfoRatio":<float between 0 and 1>,"status":"complete","focus":"RQ1 — Architectural Context Gap","graphEvents":[/* optional */]}
```

Append via: `echo '<single-line-json>' >> <state_log_path>`

### Artifact 3 — Per-iteration delta file
Write `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/deltas/iter-001.jsonl` with multiple JSONL records (one per line):
- ONE `{"type":"iteration",...}` record (same content as state-log append)
- ONE OR MORE `{"type":"finding","id":"f-iter001-NNN","severity":"P0|P1|P2","label":"...","iteration":1}`
- Optional: `{"type":"observation",...}`, `{"type":"ruled_out","direction":"...","reason":"...","iteration":1}`, `{"type":"edge",...}`, `{"type":"invariant",...}`

## NEXT FOCUS HINT (for iteration 2)

RQ2 — Trace Tool Design: define `code_graph_trace` inputs/outputs to walk symbol → file → package → repo. Determine if existing edge table is sufficient or a schema delta is needed.
