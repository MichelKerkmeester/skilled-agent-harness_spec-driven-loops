DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

You are a LEAF deep-research agent auditing OPERATOR-FACING infrastructure for post-CocoIndex-deprecation staleness + 116-deep-skill-evolution impact. Investigate (Grep/Glob/Read/Bash), then write the 3 required artifacts. Report findings only — do NOT implement fixes.

## STATE

STATE SUMMARY (auto-generated):
Segment 1 | Iteration 4 of 10
Questions: Q1 (install) + Q2 (scripts) + Q3 (doctor) substantially answered | Last focus: Q3 doctor route surface | Last 3 ratios: 0.72 -> 0.66 -> 0.61 | Stuck count: 0
Next focus: Q4 systematic 116-rename/relocation impact sweep.

Research Topic: Are install guides, scripts, and /doctor commands aligned with post-CocoIndex-deprecation reality, and did 116 deep-skill-evolution leave stale refs there?
Iteration: 4 of 10
Focus Area: Q4 — 116 DEEP-SKILL-EVOLUTION IMPACT (systematic). Iters 1-3 found 116 casualties INCIDENTALLY (test-council-matrix.sh sk-ai-council, doctor deep-loop DB path, doctor code-graph sk-* glob). Now do a SYSTEMATIC sweep:
  1. Build the rename/relocation map. `ls .opencode/skills | sort` and compare to references; identify which `sk-*` skills were renamed to `deep-*` (known: `sk-ai-council` -> `deep-ai-council`; check for `deep-research`, `deep-review`, `deep-agent-improvement`, `deep-loop-runtime`, `deep-ai-council`). Establish the OLD pre-116 names. Use `git log --oneline --all -- .opencode/skills | rg -i '116|rename|deep-' | head -20` and `git log --diff-filter=R --summary` if helpful to confirm renames + the deep-loop-runtime relocation (old location vs new `.opencode/skills/deep-loop-runtime/storage/`).
  2. Grep ONLY the install/scripts/doctor surfaces + their shared dependencies for OLD names/paths: `rg -n 'sk-ai-council|sk-deep-|sk-research|sk-review|sk-agent-improvement' .opencode/skills/*/INSTALL_GUIDE.md .opencode/skills/*/scripts .opencode/scripts .github/hooks .opencode/commands/doctor`; also grep those same surfaces for stale deep-loop DB locations `mcp_server/database/deep-loop` and any pre-relocation `deep-loop-runtime` path; and check the skills-index / advisor skill-graph that these surfaces depend on (`rg -n 'sk-ai-council|sk-deep' .opencode/skills/*/skills-index* .opencode/skills/system-skill-advisor/**/skill-graph.json 2>/dev/null`).
  3. Classify each NEW hit (do NOT re-report iter 1-3 findings): STALE-LIVE (a live install/script/doctor reference to a renamed-away skill or moved path) vs HISTORICAL/changelog vs CORRECT.
  Goal: a COMPLETE list of 116-rename/relocation casualties within the install/scripts/doctor surface set, so the rework phase can fix them all at once.

Remaining Key Questions: Q1-Q3 done; Q4 (THIS — systematic 116); Q5 (cross-surface/4-runtime consistency).
Last iteration summary: Iter 3 swept /doctor; found 4 P1 + 2 P2 (deep-loop DB path, /doctor:update stale code-graph+deep-loop DB paths, advisor MCP tool ownership, dead semantic-daemon menu option 6, route-validate.sh wrong ROUTER_FILE, code-graph sk-* glob). Do NOT re-report those — EXTEND them.

## STATE FILES (relative to repo root /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public)
- State Log (APPEND iteration line here): .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-install-scripts-doctor-realignment/001-deep-research-install-scripts-doctor/research/deep-research-state.jsonl
- Write iteration narrative to: .../001-deep-research-install-scripts-doctor/research/iterations/iteration-004.md
- Write per-iteration delta file to: .../001-deep-research-install-scripts-doctor/research/deltas/iter-004.jsonl

## KNOWN CONTEXT (do not re-discover)
- 116 deep-skill-evolution: renamed `sk-*` deep skills to `deep-*` (CONFIRMED `sk-ai-council` -> `deep-ai-council`), reworked council, relocated `deep-loop-runtime` (out of an mcp_server/003 location into `.opencode/skills/deep-loop-runtime/storage/`), reworked hooks + skills-index. The skill-advisor was extracted to its own `mk_skill_advisor` MCP server (advisor tools are NO LONGER under `mk_spec_memory`).
- CocoIndex/`ccc`/rerank-sidecar deleted (014); system-code-graph DB is now `.opencode/skills/system-code-graph/database/code-graph.sqlite` (moved out of `mcp_server/database/`). mk-spec-memory 35 tools; mk_code_index 8 tools.
- KEPT/OK: frozen benchmarks, z_archive, changelogs, git history.

## CONSTRAINTS
- LEAF agent. No sub-agents. Target 4-6 actions, max 12 tool calls. Report findings only — do NOT edit anything.
- Evidence-based: file:line + actual text. STALE-LIVE only if a live surface references a renamed-away skill or moved path that an operator/CI/tool would actually resolve.

## OUTPUT CONTRACT — produce ALL THREE artifacts
1. **Narrative** at `.../research/iterations/iteration-004.md` with EXACT headings: `# Iteration 4: <focus>`, `## Focus`, `## Actions Taken`, `## Findings`, `## Ruled Out`, `## Questions Answered`, `## Questions Remaining`, `## Next Focus`.
   - **CRITICAL — `## Findings` formatting:** EXACTLY ONE top-level `- ` bullet per finding. NO `###` sub-headers, NO nested/indented bullets inside Findings or Ruled Out (the reducer counts every `- ` line as a separate finding). Severity + classification + file:line + evidence inline: `- **[P1 / STALE-LIVE]** \`path:line\` — <text> vs <reality>; <why live>.`
2. **Canonical JSONL** APPENDED (`>>`) to the state log, EXACT: `{"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"insight|thought","focus":"<short>","graphEvents":[]}` (single line; no pretty-print).
3. **Delta** at `.../research/deltas/iter-004.jsonl`: the iteration line + one `{"type":"finding","id":"f-iter004-NNN","severity":"...","label":"...","iteration":4}` per finding + `{"type":"ruled_out","id":"r-iter004-NNN","label":"...","iteration":4}` per ruled-out.
All three REQUIRED. Begin the investigation now.
