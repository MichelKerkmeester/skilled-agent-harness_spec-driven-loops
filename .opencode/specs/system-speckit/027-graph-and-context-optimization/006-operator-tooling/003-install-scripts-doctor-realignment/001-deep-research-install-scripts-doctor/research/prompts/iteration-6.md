DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

You are a LEAF deep-research agent. This is a CONSOLIDATION iteration: do ONE exhaustive long-tail sweep to close out remaining stale references in the install/scripts/doctor surface set + all 4 runtime mirrors. Report ONLY net-new findings (not already cataloged below). Report findings only — do NOT implement fixes.

## STATE

STATE SUMMARY (auto-generated):
Segment 1 | Iteration 6 of 10
Questions: Q1-Q5 substantially answered; this is a completeness/long-tail pass | Last 5 ratios: 0.72 -> 0.66 -> 0.61 -> 0.68 -> 0.74 (rising because each iteration opened a new surface; this pass should close the tail) | Stuck count: 0
Next focus: exhaustive net-new long-tail sweep.

Research Topic: Are install guides, scripts, and /doctor commands aligned with post-CocoIndex-deprecation reality, and did 116 deep-skill-evolution leave stale refs there?
Iteration: 6 of 10
Focus Area: EXHAUSTIVE NET-NEW LONG-TAIL. Do ONE comprehensive sweep of the surface set + mirrors for EVERY remaining stale token, and report ONLY file:line NOT already in the "ALREADY CATALOGED" list below.
  Surface set (scope): `.opencode/skills/*/INSTALL_GUIDE.md`, `.opencode/skills/*/mcp_server/INSTALL_GUIDE.md`, `.opencode/scripts/`, `.opencode/skills/*/scripts/`, `.github/hooks/`, `.opencode/commands/doctor/` (+ assets/scripts), and the runtime mirrors `.claude/commands/doctor/`, `.gemini/commands/doctor/`, `.gemini/commands/deep/`, `.codex/config.toml`, `.codex/agents/`.
  Stale token set (grep each across the scope, then SUBTRACT already-cataloged hits):
    - Tool counts: `\b11 (graph )?tools\b`, `\b39 tools\b`, `\b64 tools\b` (current truth: mk_code_index 8, mk-spec-memory 35, total 60).
    - CocoIndex era: `cocoindex`, `\bccc\b`, `coco.?daemon`, `cross-encoder`, `rerank`, `sidecar`, `\b8765\b`, `semantic search daemon`.
    - 116 renames: `sk-deep-`, `sk-ai-council`, `sk-research`, `sk-review`, `sk-agent-improvement`.
    - Stale DB paths: `mcp_server/database/code-graph`, `mcp_server/database/deep-loop`, `deep-loop-runtime/storage`, `\.spec-kit/code-graph/database`.
    - Advisor ownership: `mcp__mk_spec_memory__advisor`.
  For EACH net-new hit: file:line + text + classification STALE-LIVE / SHARED-STALE / MIRROR-DRIFT / HISTORICAL / CORRECT. If a token returns ZERO net-new hits, SAY SO explicitly (a clean token is a convergence signal). The goal is COMPLETENESS: after this pass, the fix-target list for install/scripts/doctor should be closed.

ALREADY CATALOGED (do NOT re-report; these are known — only report NET-NEW beyond them):
  1. `system-spec-kit/mcp_server/INSTALL_GUIDE.md:718-720` cross-encoder reranking enabled-by-default (P1).
  2. `system-spec-kit/scripts/setup/install.sh:280` install --help "cross-encoder reranking" (P2).
  3. `system-spec-kit/scripts/test-council-matrix.sh:14` invokes absent `sk-ai-council` path (P1).
  4. `doctor/assets/doctor_deep-loop.yaml:78,162` pre-116 `mcp_server/database/deep-loop-graph.sqlite` (P1).
  5. `doctor/assets/doctor_update.yaml:100,106` stale `mcp_server/database/{code-graph,deep-loop-graph}.sqlite` (P1).
  6. `doctor/update.md:4` (+ .claude mirror) advisor tools under `mk_spec_memory` (P1).
  7. `doctor/speckit.md:101,133` (+ .claude mirror) menu "6) ... semantic search daemon" (P1).
  8. `doctor/scripts/route-validate.sh:30` ROUTER_FILE defaults to missing `doctor.md` (P2).
  9. `doctor/assets/doctor_code-graph.yaml:158` includeSkills globs only `sk-*` (P2).
  10. `skill_advisor_regression_cases.jsonl:17-45` sk-deep-* gold ids (P1, advisor infra).
  11. `routing-accuracy/labeled-prompts.jsonl` sk-deep-* gold labels (P1, advisor infra).
  12. `optimizer-manifest.json:15-38` sk-deep-* configPaths (P2).
  13. `deep-research-contract-parity.vitest.ts` + `graph-aware-stop.vitest.ts` sk-deep-research paths (P2, test infra).
  14. `deep-review-contract-parity.vitest.ts` sk-deep-review paths (P2, test infra).
  15. `doctor/_routes.yaml:92` + `speckit.md:47` + `update.md:219,270` (+ .claude mirror) deep-loop `storage/` path (current: `database/`) (P1, SHARED-STALE).
  16. `doctor/scripts/mcp-doctor.sh:61` (+ .claude mirror) "11 graph tools" (P2, SHARED-STALE).
  17. `.codex/config.toml:89` code-graph DB `.spec-kit/code-graph/database/` (P2, MIRROR-DRIFT).
  18. `.gemini/commands/deep/start-research-loop.toml:2` sk-deep-research (P1, MIRROR-DRIFT).

## STATE FILES (relative to repo root /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public)
- State Log (APPEND iteration line here): .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-install-scripts-doctor-realignment/001-deep-research-install-scripts-doctor/research/deep-research-state.jsonl
- Write iteration narrative to: .../001-deep-research-install-scripts-doctor/research/iterations/iteration-006.md
- Write per-iteration delta file to: .../001-deep-research-install-scripts-doctor/research/deltas/iter-006.jsonl

## KNOWN CONTEXT (current truth)
- mk-spec-memory 35 tools; mk_code_index 8 tools; 60 total. Advisor tools under `mk_skill_advisor`. CocoIndex/ccc/rerank-sidecar/8765 DELETED. deep-loop DB = `.opencode/skills/deep-loop-runtime/database/deep-loop-graph.sqlite`. code-graph DB = `.opencode/skills/system-code-graph/database/code-graph.sqlite`. 116 renamed `sk-*` deep skills -> `deep-*`. Runtimes: `.opencode` canonical, `.claude` full doctor mirror, `.codex` config/agents only (no doctor mirror), `.gemini` thin doctor TOML wrappers + deep command mirrors.
- KEPT/OK: frozen benchmarks, z_archive, changelogs, git history, the smart-router measurement result files (historical outputs).

## CONSTRAINTS
- LEAF agent. No sub-agents. Target 4-6 actions, max 12 tool calls. Report findings only — do NOT edit anything.
- Evidence-based: file:line + actual text. Report ONLY net-new beyond the 18 cataloged. Explicitly note tokens with zero net-new hits (convergence signal).

## OUTPUT CONTRACT — produce ALL THREE artifacts
1. **Narrative** at `.../research/iterations/iteration-006.md` with EXACT headings: `# Iteration 6: <focus>`, `## Focus`, `## Actions Taken`, `## Findings`, `## Ruled Out`, `## Questions Answered`, `## Questions Remaining`, `## Next Focus`.
   - **CRITICAL — `## Findings` formatting:** EXACTLY ONE top-level `- ` bullet per finding. NO `###` sub-headers, NO nested/indented bullets. Severity + classification + file:line + evidence inline: `- **[P1 / STALE-LIVE]** \`path:line\` — <text>.` If there are NO net-new findings, write a single bullet: `- **[INFO / CONVERGED]** No net-new stale references beyond the 18 cataloged; <which tokens returned zero net-new>.`
2. **Canonical JSONL** APPENDED (`>>`) to the state log, EXACT: `{"type":"iteration","iteration":6,"newInfoRatio":<0..1>,"status":"insight|thought","focus":"<short>","graphEvents":[]}` (single line; reflect LOW ratio if few net-new).
3. **Delta** at `.../research/deltas/iter-006.jsonl`: the iteration line + one `{"type":"finding","id":"f-iter006-NNN","severity":"P1|P2|P3","label":"...","iteration":6}` per NET-NEW finding (use P1/P2/P3 severities, NOT "important") + `{"type":"ruled_out","id":"r-iter006-NNN","label":"...","iteration":6}` per clean token.
All three REQUIRED. Begin the investigation now.
