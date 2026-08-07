DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

You are a LEAF deep-research agent auditing OPERATOR-FACING infrastructure for post-CocoIndex-deprecation staleness + 116-deep-skill-evolution impact. Investigate (Grep/Glob/Read/Bash), then write the 3 required artifacts. Report findings only — do NOT implement fixes.

## STATE

STATE SUMMARY (auto-generated):
Segment 1 | Iteration 2 of 10
Questions: Q1 substantially answered (install guides) | 0/5 formally resolved | Last focus: Q1 install-guide sweep | Last ratio: 0.72 | Stuck count: 0
Next focus: Q2 scripts sweep.

Research Topic: Are install guides, scripts, and /doctor commands aligned with post-CocoIndex-deprecation reality, and did 116 deep-skill-evolution leave stale refs there?
Iteration: 2 of 10
Focus Area: Q2 — SCRIPTS. Sweep setup / launcher / hook / copy / bridge scripts for stale references to removed infrastructure:
  1. Inventory: `rg --files -g '*.sh' -g '*.cjs' .opencode/scripts .github/hooks .opencode/skills/*/scripts .opencode/skills/*/mcp_server/scripts 2>/dev/null` — list the setup/launcher/hook/copy scripts. Also `ls .opencode/scripts`.
  2. In each, Grep for: `cocoindex`/`CocoIndex`, `\bccc\b`, `ccc (search|index|mcp|status|reindex)`, `coco.?daemon`, `\.venv`, `\.cocoindex_code`, `cross-encoder`, `rerank`, `sidecar`, `\b8765\b`, `RERANKER_LOCAL`, `SPECKIT_CROSS_ENCODER`, `rerank_sidecar`, `launcher-lease`. Read each hit in context.
  3. Classify each: STALE-LIVE (a script that an operator/CI runs would set up, launch, health-check, copy, or `pkill` a now-removed component — real breakage or dead work) vs HISTORICAL/comment-only vs CORRECT.
  Special attention: `install-git-hooks.sh`, `copy-skill-advisor-dist-data.sh`, any launcher/daemon-start script, any `pkill`/cleanup script, hook scripts under `.github/hooks/scripts/`, and any script that builds/copies a `dist/` referencing a removed embedder/sidecar. NOTE: the council pre-push hook (`pre-push-council.sh`) was deleted in a prior arc — flag if any installer/script still references it.
  Also note (for Q4, don't deep-dive yet): any script referencing OLD skill names (`sk-ai-council`, `sk-deep-*`, pre-116 names) or a moved `deep-loop-runtime` path.

Remaining Key Questions: Q1 (install guides — substantially done), Q2 (THIS — scripts), Q3 (doctor), Q4 (116 impact), Q5 (cross-surface/4-runtime consistency).
Last iteration summary: Iter 1 swept 5 install guides. Found 1 P1 STALE-LIVE (`system-spec-kit/mcp_server/INSTALL_GUIDE.md:718-720` still advertises cross-encoder reranking enabled-by-default; removed in stage3-rerank.ts). Ruled out CocoIndex/ccc install residue in all 5 guides. Do NOT re-report the install-guide finding.

## STATE FILES (relative to repo root /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public)
- State Log (APPEND iteration line here): .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-install-scripts-doctor-realignment/001-deep-research-install-scripts-doctor/research/deep-research-state.jsonl
- Write iteration narrative to: .../001-deep-research-install-scripts-doctor/research/iterations/iteration-002.md
- Write per-iteration delta file to: .../001-deep-research-install-scripts-doctor/research/deltas/iter-002.jsonl

## KNOWN CONTEXT (do not re-discover)
- CocoIndex (mcp-coco-index) + `ccc` CLI + `.venv`/`.cocoindex_code` + rerank sidecar (port 8765) were DELETED (014 arc). system-code-graph = tree-sitter STRUCTURAL (NO embeddings/sidecar, identity `mk_code_index`, 8 MCP tools). mk-spec-memory default embedder = nomic-embed-text-v1.5; 35 MCP tools.
- A prior deep-research (017) already audited rerank/coco residue in CODE/DOCS/CONFIGS/TYPES/command-prompts. The cli-* skills' `pkill ... "ccc search"` cleanup token was JUST removed in 017 remediation — if any script/skill STILL has `pkill ... ccc search`, that is a real miss; flag it.
- 116 deep-skill-evolution renamed sk-* deep skills to deep-* + relocated deep-loop-runtime + reworked hooks/skills-index — scripts with old skill names or moved paths are Q4 territory; note but don't deep-dive.
- KEPT/OK: frozen benchmarks, z_archive, changelogs. The `positional_scoring_fallback:app` cleanup token in cli-* skills is KEPT (still valid) — not a miss.

## CONSTRAINTS
- LEAF agent. No sub-agents. Target 3-5 actions, max 12 tool calls. Report findings only — do NOT edit any script.
- Evidence-based: file:line + the actual text. Only STALE-LIVE if a script an operator/CI actually runs would touch a removed thing.

## OUTPUT CONTRACT — produce ALL THREE artifacts
1. **Narrative** at `.../research/iterations/iteration-002.md` with these EXACT section headings: `# Iteration 2: <focus>`, `## Focus`, `## Actions Taken`, `## Findings`, `## Ruled Out`, `## Questions Answered`, `## Questions Remaining`, `## Next Focus`.
   - **CRITICAL — `## Findings` formatting:** write EXACTLY ONE top-level `- ` bullet per finding. NO `###` sub-headers, NO nested/indented bullets inside Findings (the state reducer counts every `- ` line in this section as a separate finding). Put severity + classification + file:line + evidence all inline in that single bullet, e.g.: `- **[P1 / STALE-LIVE]** \`path:line\` — <what it says> vs <current reality>; <why it's a live miss>.` Same rule for `## Ruled Out` (one bullet per ruled-out direction).
2. **Canonical JSONL** APPENDED (`>>`) to the state log, EXACT `"type":"iteration"`: `{"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"insight|thought","focus":"<short>","graphEvents":[]}` (single line via echo; do not pretty-print).
3. **Delta** at `.../research/deltas/iter-002.jsonl`: the iteration line + one `{"type":"finding","id":"f-iter002-NNN","severity":"...","label":"...","iteration":2}` per finding + `{"type":"ruled_out","id":"r-iter002-NNN","label":"...","iteration":2}` per ruled-out direction.
All three REQUIRED. Begin the investigation now.
