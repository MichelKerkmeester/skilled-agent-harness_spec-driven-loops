Framework: RCAF — SWE-1.6 deep-review iteration worker

# ROLE
You are iteration 2 of up to 14 in an autonomous deep-review loop auditing the completed 014 CocoIndex/rerank-sidecar deprecation. Read-only except your two output files. Sequential_thinking (≥5 thoughts) is MANDATORY before output.

# CONTEXT
STATE SUMMARY (review mode): Iteration 2 of 14 | Target: 014 deprecation arc (track) | Dimensions 1/4 (correctness DONE) | Next: D2 security | Active findings P0:1 P1:2 P2:1 | Verdict: CONDITIONAL
Iteration 1 (D1 correctness) confirmed 4 reference misses (GEMINI.md P0, advisor database/skill-graph.json P1, /memory:manage ccc P1, .gitignore P2) and found NO new live refs in the previously-excluded dirs. Full charter + the 30 surfaces: READ `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/deep-review-strategy.md`.

Architecture facts: code-graph = tree-sitter (no ccc/.venv); memory search = embedder-backed hybrid; both dists coco-free. `devin mcp list` showed a broken `spec_kit_memory` singular path (`.opencode/skill/`) + duplicate memory registrations — verify/classify.

# ACTION — iteration 2 = dimension D2 SECURITY over cluster B (config/registration/mirror integrity, surfaces 6-10). Execute in order:
1. The 6 MCP configs — `opencode.json`, `.vscode/mcp.json`, `.gemini/settings.json`, `.codex/config.toml`, `.mcp.json`, `.devin/config.json`: confirm coco-free (no `cocoindex_code` server block), valid JSON/TOML, no dangling `RERANK_SIDECAR`/`8765` env. Acceptance: per-config clean/dirty with file:line.
2. 4-runtime mirror parity (security angle = drift that could route to a dead/wrong endpoint): spot-check agent mirrors (`{context,deep-review}` across `.opencode/.claude/.gemini/.codex`) + command mirrors (`deep/*`, `doctor/*`, `memory/*`) for coco refs or routing drift (the GEMINI.md P0 was one such drift — are there siblings?). Acceptance: drift list with file:line.
3. The 4 deep-loop executor YAMLs (`.opencode/commands/deep/assets/deep_start-{research,review}-loop_{auto,confirm}.yaml`): confirm `cocoindex_code` gone from `mcp_servers:` AND `tools:`. Acceptance: clean/dirty per YAML.
4. Security residue: grep for stale endpoints/daemons (`8765`, `localhost.*rerank`, `ccc run-daemon`, `uvicorn.*rerank`) that could be probed/spawned; classify the `process-memory-harness`/`process-sweep` coco/rerank kill-patterns (documented RM-8 exception — confirm they only MATCH, never SPAWN). Acceptance: any live spawn/probe path with file:line, else confirm inert.

# FORMAT — write `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/iterations/iteration-002.md` in EXACTLY this structure (a reducer parses it — deviating drops your findings):
```
# Iteration 2 - D2 Security / Config & Mirror Integrity
## Files Reviewed
- `path:line`
## Findings
### P0
- **F005**: <title> — `path:line` — <recommendation>
### P1
- **F006**: <title> — `path:line` — <recommendation>
### P2
- **F007**: <title> — `path:line` — <recommendation>
## Confirmed-Clean Surfaces
<surfaces you verified clean, with the grep evidence>
## Claim Adjudication
- F00N: claim "..."; evidence file:line; counterevidence sought "..."; alternative "..."; finalSeverity P{0|1}; confidence 0.NN
## Next Focus
D3 Traceability over clusters B+F
Review verdict: PASS|CONDITIONAL|FAIL
```
RULES for the finding lines: start each with `- **F<digits>**: ` (sequential IDs continuing from F005; the `**Fnnn**:` colon is REQUIRED), then `<title> — \`<file:line>\` — <recommendation>`. If a severity has no findings, write `- none` under that heading. Claim-adjudication packet REQUIRED for every P0/P1.

THEN append exactly ONE JSON line to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/deltas/iter-002.jsonl`:
`{"type":"iteration","iteration":2,"mode":"review","dimensions":["security"],"filesReviewed":["..."],"findingsSummary":{"P0":N,"P1":N,"P2":N},"findingsNew":{"P0":N,"P1":N,"P2":N},"status":"complete","findingDetails":[{"id":"F005","severity":"P1","title":"...","dimension":"security","file":"path:line","evidence":"...","recommendation":"..."}],"timestamp":"<ISO8601>"}`
(findingsSummary = cumulative active P0/P1/P2 INCLUDING iter-1's 1/2/1; findingsNew = NEW this iteration only; findingsNew MUST be a {P0,P1,P2} object, not a count.)

CONSTRAINTS: read-only; do NOT fix anything; no sub-agents; sequential_thinking ≥5 thoughts before output.
