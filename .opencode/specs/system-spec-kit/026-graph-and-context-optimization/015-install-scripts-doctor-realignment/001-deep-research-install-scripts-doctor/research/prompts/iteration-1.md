DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

You are a LEAF deep-research agent auditing OPERATOR-FACING infrastructure (install guides, scripts, /doctor) for post-CocoIndex-deprecation staleness + 116-deep-skill-evolution impact. Investigate (Grep/Glob/Read/Bash), then write the 3 required artifacts. Report findings only — do NOT implement fixes.

## STATE

STATE SUMMARY (auto-generated):
Segment 1 | Iteration 1 of 10
Questions: 0/5 answered | Last focus: none yet | Last 2 ratios: N/A -> N/A | Stuck count: 0
Next focus: Q1 install-guide sweep.

Research Topic: Are install guides, scripts, and /doctor commands aligned with post-CocoIndex-deprecation reality, and did 116 deep-skill-evolution leave stale refs there?
Iteration: 1 of 10
Focus Area: Q1 — INSTALL GUIDES. Inventory + sweep every install guide for stale references to removed infrastructure:
  1. `fd -t f 'INSTALL_GUIDE.md'` (or `rg --files -g 'INSTALL_GUIDE.md'`) across `.opencode/skills/` — list them all.
  2. In each, Grep for: `cocoindex`/`CocoIndex`, `\bccc\b`, `coco-daemon`, `\.venv`, `\.cocoindex_code`, `cross-encoder`, `CodeRankEmbed`, `rerank`, `sidecar`, `RERANKER_LOCAL`, `SPECKIT_CROSS_ENCODER`, `Voyage.*rerank`. Read each hit in context.
  3. Classify each: STALE-LIVE (an operator following this install step would hit a now-removed/broken thing — a real miss) vs HISTORICAL/OK (changelog-style or accurately documents the removal) vs CORRECT (already updated).
  Pay special attention to: prerequisite/install steps that say to `pip install`/build CocoIndex or `ccc`; embedder/reranker "chooser" tables (e.g. system-code-graph INSTALL_GUIDE §4) that list cross-encoder/CodeRankEmbed models; setup steps mentioning a coco daemon or `.venv/bin/ccc`.

Remaining Key Questions: Q1 (THIS), Q2 (scripts), Q3 (doctor), Q4 (116 impact), Q5 (cross-surface/4-runtime consistency).
Last 3 Iterations Summary: none yet (iteration 1).

## STATE FILES (relative to repo root /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public)
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-install-scripts-doctor-realignment/001-deep-research-install-scripts-doctor/research/deep-research-state.jsonl
- Strategy: .../015-install-scripts-doctor-realignment/001-deep-research-install-scripts-doctor/research/deep-research-strategy.md
- Write iteration narrative to: .../001-deep-research-install-scripts-doctor/research/iterations/iteration-001.md
- Write per-iteration delta file to: .../001-deep-research-install-scripts-doctor/research/deltas/iter-001.jsonl

## KNOWN CONTEXT (do not re-discover)
- CocoIndex (mcp-coco-index) + `ccc` CLI + `.venv`/`.cocoindex_code` + rerank sidecar were DELETED (014 arc). system-code-graph = tree-sitter STRUCTURAL now (NO embeddings, NO embedder install, identity `mk_code_index`, 8 MCP tools). mk-spec-memory default embedder = nomic-embed-text-v1.5; 35 MCP tools.
- A prior deep-research (017) already audited rerank/coco residue in CODE/DOCS/CONFIGS — this packet targets the DIFFERENT operator-facing install/scripts/doctor surfaces.
- 116 deep-skill-evolution renamed sk-* deep skills to deep-* + relocated deep-loop-runtime + reworked root docs/hooks/skills-index — may have left stale skill-name/path refs (relevant for later iterations, but note any you see).
- KEPT/OK: frozen benchmarks, z_archive, changelogs (historical mentions of the removal are CORRECT, not misses).

## CONSTRAINTS
- LEAF agent. No sub-agents. Target 3-5 actions, max 12 tool calls. Write ALL findings to files. Do NOT edit strategy/registry/dashboard (reducer-owned). Report findings only.
- Evidence-based: file:line + the actual text. Only call STALE-LIVE if an operator following it would actually hit a removed thing. A confirmed-CLEAN install guide is a valuable finding too.

## OUTPUT CONTRACT — produce ALL THREE artifacts
1. **Narrative** at `.../research/iterations/iteration-001.md` — headings: Focus, Actions Taken, Findings (each: severity P0/P1/P2/INFO + file:line + evidence + STALE-LIVE/HISTORICAL/CORRECT), Questions Answered, Questions Remaining, Next Focus.
2. **Canonical JSONL** APPENDED (`>>`) to the state log, EXACT `"type":"iteration"`: `{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"insight|thought","focus":"<short>","graphEvents":[]}` (single line via echo; do not pretty-print).
3. **Delta** at `.../research/deltas/iter-001.jsonl`: the iteration line + one `{"type":"finding","id":"f-iter001-NNN","severity":"...","label":"...","iteration":1}` per finding + `{"type":"ruled_out",...}` per ruled-out direction.
All three REQUIRED. Begin the investigation now.
