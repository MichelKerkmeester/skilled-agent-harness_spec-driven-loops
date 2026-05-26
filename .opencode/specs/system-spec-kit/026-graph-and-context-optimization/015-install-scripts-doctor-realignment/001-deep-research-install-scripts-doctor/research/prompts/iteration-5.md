DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

You are a LEAF deep-research agent auditing OPERATOR-FACING infrastructure for post-CocoIndex-deprecation staleness + 116-deep-skill-evolution impact. Investigate (Grep/Glob/Read/Bash), then write the 3 required artifacts. Report findings only — do NOT implement fixes.

## STATE

STATE SUMMARY (auto-generated):
Segment 1 | Iteration 5 of 10
Questions: Q1-Q4 substantially answered | Last focus: Q4 systematic 116 sweep | Last 4 ratios: 0.72 -> 0.66 -> 0.61 -> 0.68 | Stuck count: 0
Next focus: Q5 cross-surface + 4-runtime mirror consistency.

Research Topic: Are install guides, scripts, and /doctor commands aligned with post-CocoIndex-deprecation reality, and did 116 deep-skill-evolution leave stale refs there?
Iteration: 5 of 10
Focus Area: Q5 — CROSS-SURFACE + 4-RUNTIME MIRROR CONSISTENCY. The 4 runtimes are `.opencode` (canonical), `.claude`, `.codex`, `.gemini`. The install/scripts/doctor findings so far are all in `.opencode`. Check whether the runtime MIRRORS carry the same (or different/worse) drift, and whether tool-counts/skill-names are consistent:
  1. `/doctor` mirror parity: compare `.opencode/commands/doctor/*` against `.claude/commands/doctor/*`, `.codex` doctor command(s), `.gemini/commands/doctor/*`. Do the mirrors repeat the stale items (menu option "6 ... semantic search daemon", deep-loop DB path `storage/` vs `database/`, code-graph DB `mcp_server/database` vs `system-code-graph/database`, advisor MCP tool ownership `mk_spec_memory` vs `mk_skill_advisor`)? Flag MIRROR-DRIFT (one runtime fixed, others not) and SHARED-STALE (all carry it).
  2. Tool-count + identity consistency across the install/doctor surfaces in all 4 runtimes: `rg -n '\b39 tools\b|\b64 tools\b|11 tools|cocoindex|mk_code_index|mk-spec-memory|35 tools|8 tools|60 tools' .opencode/commands/doctor .claude/commands/doctor .gemini/commands/doctor .codex 2>/dev/null` — current truth: mk-spec-memory 35 tools, mk_code_index 8 tools, 60 total. Flag any 39/64/11 or cocoindex tool-count claims in these surfaces.
  3. Skill-name consistency: do any runtime mirrors of doctor/install reference `sk-deep-*` / `sk-ai-council` (renamed to `deep-*`)? `rg -n 'sk-deep-|sk-ai-council|sk-research|sk-review' .claude .codex .gemini --glob '*doctor*' --glob '*install*' 2>/dev/null` plus the command/agent mirrors those surfaces point to.
  3. Classify each NEW hit (do NOT re-report .opencode iter 1-4 findings; only NEW mirror/cross-surface drift): STALE-LIVE / MIRROR-DRIFT / SHARED-STALE vs CORRECT/IN-SYNC.
  If a mirror is correctly in-sync, that is a valuable CORRECT finding too. Also confirm whether the 4-runtime mirror is even EXPECTED to carry /doctor (some commands are .opencode-only) — report the actual mirror topology.

Remaining Key Questions: Q1-Q4 done; Q5 (THIS — cross-surface/4-runtime).
Last iteration summary: Iter 4 systematic 116 sweep found advisor regression fixture + routing corpus (sk-deep-* gold labels, LIVE advisor validation inputs), optimizer manifest + contract-parity tests (sk-deep-* paths), and a deep-loop DB double-relocation (`storage/` is ALSO stale; current is `deep-loop-runtime/database/deep-loop-graph.sqlite`). Do NOT re-report those.

## STATE FILES (relative to repo root /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public)
- State Log (APPEND iteration line here): .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-install-scripts-doctor-realignment/001-deep-research-install-scripts-doctor/research/deep-research-state.jsonl
- Write iteration narrative to: .../001-deep-research-install-scripts-doctor/research/iterations/iteration-005.md
- Write per-iteration delta file to: .../001-deep-research-install-scripts-doctor/research/deltas/iter-005.jsonl

## KNOWN CONTEXT (do not re-discover)
- 4 runtimes: `.opencode` (canonical), `.claude`, `.codex`, `.gemini`. NOT every command is mirrored to all 4 — report the actual topology, don't assume.
- Current truth: mk-spec-memory 35 MCP tools; mk_code_index 8 tools; 60 total. Skill-advisor extracted to `mk_skill_advisor` MCP server. CocoIndex/ccc/rerank-sidecar DELETED. deep-loop DB canonical path = `.opencode/skills/deep-loop-runtime/database/deep-loop-graph.sqlite`. code-graph DB = `.opencode/skills/system-code-graph/database/code-graph.sqlite`. 116 renamed `sk-*` deep skills -> `deep-*`.
- KEPT/OK: frozen benchmarks, z_archive, changelogs, git history.

## CONSTRAINTS
- LEAF agent. No sub-agents. Target 4-6 actions, max 12 tool calls. Report findings only — do NOT edit anything.
- Evidence-based: file:line + actual text. Distinguish MIRROR-DRIFT (one fixed, others not) from SHARED-STALE (all carry it) from CORRECT/IN-SYNC.

## OUTPUT CONTRACT — produce ALL THREE artifacts
1. **Narrative** at `.../research/iterations/iteration-005.md` with EXACT headings: `# Iteration 5: <focus>`, `## Focus`, `## Actions Taken`, `## Findings`, `## Ruled Out`, `## Questions Answered`, `## Questions Remaining`, `## Next Focus`.
   - **CRITICAL — `## Findings` formatting:** EXACTLY ONE top-level `- ` bullet per finding. NO `###` sub-headers, NO nested/indented bullets inside Findings or Ruled Out. Severity + classification + file:line + evidence inline.
2. **Canonical JSONL** APPENDED (`>>`) to the state log, EXACT: `{"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"insight|thought","focus":"<short>","graphEvents":[]}` (single line; no pretty-print).
3. **Delta** at `.../research/deltas/iter-005.jsonl`: the iteration line + one `{"type":"finding","id":"f-iter005-NNN",...}` per finding + `{"type":"ruled_out","id":"r-iter005-NNN",...}` per ruled-out.
All three REQUIRED. Begin the investigation now.
