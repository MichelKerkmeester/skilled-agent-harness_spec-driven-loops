ROLE
Senior technical writer/engineer doing a LARGE, methodical reference sweep. Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index` (pre-approved, skip Gate 3). Load `sk-code`.

CONTEXT
`mcp-coco-index` (CocoIndex semantic code search) + `system-rerank-sidecar` are DELETED. The decision was D2: semantic code search is retired in favor of a HYBRID policy — **Code Graph structural queries (`code_graph_query`) + Grep** for concept discovery; `memory_search` only for spec-docs/memory (not arbitrary code). ~206 skill/command/doc files still mention CocoIndex / cocoindex / mcp__cocoindex_code__search / rerank-sidecar. Remove or rewrite every LIVE mention to the HYBRID reality.

ACTION — sweep these directories and remove/rewrite every coco/rerank reference:
- `.opencode/skills/**` (ALL skills: cli-claude-code, cli-codex, cli-devin, cli-gemini, cli-opencode, sk-code, sk-code-review, sk-doc, sk-prompt*, deep-research, deep-review, deep-loop-runtime, deep-ai-council, mcp-code-mode, system-code-graph, system-spec-kit, etc.) — SKILL.md, README.md, references/**, manual_testing_playbook/**, assets/**, feature_catalog/**, lib/**, scripts/**, tests/** (string mentions only; do not break tests), and `graph-metadata.json` (drop mcp-coco-index from `enhances`/`related_to`).
- `.opencode/commands/**` (remaining command docs not already cleaned).
- `.opencode/install_guides/**`.
- `README.md` (repo root, if any coco remains).
Rewrite guidance:
- "CocoIndex semantic search" / "find code by concept via CocoIndex" → "Code Graph structural query (`code_graph_query`) + Grep".
- `mcp__cocoindex_code__search` tool refs → `code_graph_query` + `Grep` (or remove from tool lists).
- cli-* "delegate to opencode for the full CocoIndex semantic index" type lines → drop the CocoIndex clause (the capability is gone).
- rerank-sidecar mentions → remove (the sidecar is deleted; memory falls back to positional scoring by default).
- Produce CLEAN prose — NEVER create duplicate words like "Code Graph, Code Graph" or "code_graph_query + Grep, code_graph_query". Read each sentence.

SCOPE LOCK (RM-8 — STRICT)
- ALLOWED: `.opencode/skills/**`, `.opencode/commands/**`, `.opencode/install_guides/**`, `README.md`.
- BANNED (do NOT touch): any `**/changelog/**` (frozen history — leave coco mentions there), `.opencode/specs/**` (frozen + the 014 packet documents coco intentionally), `opencode.json`/`.vscode`/`.gemini`/`.codex` (done), and the compiled `system-skill-advisor/mcp_server/scripts/skill-graph.json` + `database/skill-graph.json` (orchestrator recompiles). Do NOT re-introduce deleted skill folders.
- Do NOT git add/commit. Do NOT recompile the skill-graph.

METHOD (large sweep — be systematic)
Work skill-by-skill. Use `rg -l -i "cocoindex|mcp-coco-index|mcp__cocoindex_code|rerank_sidecar|system-rerank-sidecar|RERANK_SIDECAR" <dir> -g '!**/changelog/**'` to enumerate, then edit each. If you approach an output/effort limit, FINISH the current skill cleanly and report EXACTLY which files/dirs remain so a follow-up can continue — do not leave a file half-edited.

VERIFY (run; report)
- `rg -n -i "cocoindex|mcp-coco-index|mcp__cocoindex_code|rerank_sidecar|system-rerank-sidecar|RERANK_SIDECAR|SPECKIT_CROSS_ENCODER|RERANKER_LOCAL" .opencode/skills .opencode/commands .opencode/install_guides README.md -g '!**/changelog/**' -g '!**/skill-graph.json'` returns ZERO live references (report the count; if non-zero, list the remaining files in NOTES).
- `rg -n "Code Graph, Code Graph|code_graph_query \+ \`?Grep\`?, code_graph" .opencode/skills .opencode/commands` returns ZERO (no replace artifacts).

FORMAT (end with)
- `CHANGED PATHS:` newline list of every file edited (exact repo-relative paths).
- `VERIFY:` results + the remaining-coco count (must be 0, or list remaining files).
- `NOTES:` any files left for a follow-up + why.
