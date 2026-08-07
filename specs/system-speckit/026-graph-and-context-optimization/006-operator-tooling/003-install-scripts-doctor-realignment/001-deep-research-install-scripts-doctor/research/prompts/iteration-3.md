DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

You are a LEAF deep-research agent auditing OPERATOR-FACING infrastructure for post-CocoIndex-deprecation staleness + 116-deep-skill-evolution impact. Investigate (Grep/Glob/Read/Bash), then write the 3 required artifacts. Report findings only — do NOT implement fixes.

## STATE

STATE SUMMARY (auto-generated):
Segment 1 | Iteration 3 of 10
Questions: Q1 (install guides) + Q2 (scripts) substantially answered | Last focus: Q2 scripts sweep | Last 2 ratios: 0.72 -> 0.66 | Stuck count: 0
Next focus: Q3 /doctor command + routes.

Research Topic: Are install guides, scripts, and /doctor commands aligned with post-CocoIndex-deprecation reality, and did 116 deep-skill-evolution leave stale refs there?
Iteration: 3 of 10
Focus Area: Q3 — /DOCTOR. Audit the `/doctor` command surface, its route manifest, subsystem handlers, and any doctor scripts/playbooks:
  1. Inventory: `rg --files .opencode/commands/doctor .claude/commands/doctor .gemini/commands/doctor .codex 2>/dev/null | rg -i doctor`; also `rg -ril 'doctor' .opencode/commands .opencode/skills --glob '*.md' | head -40` and find any `doctor-*.sh`/`doctor-*.cjs` scripts or `doctor-cocoindex*`/`cocoindex-daemon` playbooks.
  2. In the doctor command(s) + route manifest/table + each subsystem handler (memory, causal-graph, code-graph, deep-loop, skill-advisor, skill-budget), Grep for: `cocoindex`/`CocoIndex`, `\bccc\b`, `coco.?daemon`, `doctor:?cocoindex`, `cocoindex-daemon`, `reindex`, `rerank`, `sidecar`, `\b8765\b`, `cross-encoder`, `cocoIndexAvailable`. Read each hit in context.
  3. Classify each: STALE-LIVE (a `/doctor` route/check/repair that targets a REMOVED cocoindex daemon / ccc / rerank-sidecar — would error, mislead, or run dead repair steps) vs HISTORICAL/changelog vs CORRECT.
  Also verify: (a) the doctor route manifest is internally consistent post-coco (every advertised route resolves to a real target/mutation-class); (b) NO live `doctor:cocoindex` / `doctor-cocoindex-daemon` route or playbook survives; (c) note (Q4) any doctor route/handler referencing OLD skill names or renamed commands.

Remaining Key Questions: Q1 (install guides — done), Q2 (scripts — done), Q3 (THIS — doctor), Q4 (116 impact — partial; one hit so far), Q5 (cross-surface/4-runtime consistency).
Last iteration summary: Iter 2 swept scripts. Found P2 (`system-spec-kit/scripts/setup/install.sh:280` install help still says "cross-encoder reranking") + P1/Q4 (`system-spec-kit/scripts/test-council-matrix.sh:14` invokes the renamed/absent `sk-ai-council` path → live failure). Ruled out coco/ccc/venv/sidecar/8765 runtime-setup residue in scripts; deleted pre-push-council hook fully dereferenced. Do NOT re-report those.

## STATE FILES (relative to repo root /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public)
- State Log (APPEND iteration line here): .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-install-scripts-doctor-realignment/001-deep-research-install-scripts-doctor/research/deep-research-state.jsonl
- Write iteration narrative to: .../001-deep-research-install-scripts-doctor/research/iterations/iteration-003.md
- Write per-iteration delta file to: .../001-deep-research-install-scripts-doctor/research/deltas/iter-003.jsonl

## KNOWN CONTEXT (do not re-discover)
- `/doctor` is an argv-positional router with routes: memory, causal-graph, code-graph, deep-loop, skill-advisor, skill-budget. Plus `/doctor:mcp` (install|debug) and `/doctor:update`. The colon-form `/doctor:<name>` LEGACY routes were REMOVED — a `/doctor:<name>` route to a removed subsystem is a real miss. A historical `/doctor:cocoindex` mention in a CHANGELOG is HISTORICAL/OK.
- CocoIndex + `ccc` + rerank sidecar (port 8765) + coco daemon were DELETED (014). system-code-graph = tree-sitter structural (`mk_code_index`, 8 tools, NO daemon/sidecar). mk-spec-memory = 35 tools, embedder nomic-embed-text-v1.5.
- 116 renamed sk-* deep skills to deep-* + relocated deep-loop-runtime + reworked hooks/skills-index. Doctor routes/handlers referencing old skill names = Q4.
- KEPT/OK: frozen benchmarks, z_archive, changelogs.

## CONSTRAINTS
- LEAF agent. No sub-agents. Target 3-5 actions, max 12 tool calls. Report findings only — do NOT edit any command/script.
- Evidence-based: file:line + actual text. STALE-LIVE only if a `/doctor` invocation would actually hit a removed thing or a dead route.

## OUTPUT CONTRACT — produce ALL THREE artifacts
1. **Narrative** at `.../research/iterations/iteration-003.md` with these EXACT headings: `# Iteration 3: <focus>`, `## Focus`, `## Actions Taken`, `## Findings`, `## Ruled Out`, `## Questions Answered`, `## Questions Remaining`, `## Next Focus`.
   - **CRITICAL — `## Findings` formatting:** EXACTLY ONE top-level `- ` bullet per finding. NO `###` sub-headers, NO nested/indented bullets inside Findings or Ruled Out (the reducer counts every `- ` line as a separate finding). Put severity + classification + file:line + evidence inline in the single bullet: `- **[P1 / STALE-LIVE]** \`path:line\` — <text> vs <reality>; <why live>.`
2. **Canonical JSONL** APPENDED (`>>`) to the state log, EXACT: `{"type":"iteration","iteration":3,"newInfoRatio":<0..1>,"status":"insight|thought","focus":"<short>","graphEvents":[]}` (single line; no pretty-print).
3. **Delta** at `.../research/deltas/iter-003.jsonl`: the iteration line + one `{"type":"finding","id":"f-iter003-NNN","severity":"...","label":"...","iteration":3}` per finding + `{"type":"ruled_out","id":"r-iter003-NNN","label":"...","iteration":3}` per ruled-out.
All three REQUIRED. Begin the investigation now.
