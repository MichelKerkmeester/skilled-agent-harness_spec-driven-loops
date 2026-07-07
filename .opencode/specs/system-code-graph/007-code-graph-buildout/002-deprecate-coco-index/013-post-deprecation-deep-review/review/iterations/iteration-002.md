# Iteration 2 - D2 Security / Config & Mirror Integrity

## Files Reviewed
- `.vscode/mcp.json:1-67`
- `.gemini/settings.json:1-169`
- `.codex/config.toml:1-118`
- `.mcp.json:1-69`
- `.devin/config.json:1-66`
- `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:1-327`
- `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml:1-335`
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:1-306`
- `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml:1-315`
- `.opencode/agents/context.md` (across .opencode, .claude, .gemini)
- `.opencode/agents/deep-review.md` (across .opencode, .claude, .gemini)
- `.opencode/commands/deep/*.md`
- `.opencode/commands/doctor/assets/doctor_deep-loop.yaml:97`
- `.opencode/skills/system-spec-kit/references/memory/embedder_pluggability.md:239`
- `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:91-101,127-131,142-144,529-533`

## Findings

### P0
- none

### P1
- none

### P2
- **F005**: embedder_pluggability.md §3 has obsolete ccc run-daemon command with obsolescence banner — `.opencode/skills/system-spec-kit/references/memory/embedder_pluggability.md:239` — The section carries a clear "⚠️ Obsolete as of the 014 CocoIndex deprecation" banner, but the ccc-based commands and .venv/bin/ccc paths no longer exist. While this is a documented exception, the commands are misleading if someone tries to follow them. Consider removing or collapsing the obsolete system-code-graph columns entirely.
- **F006**: doctor_deep-loop.yaml has forbidden target glob for coco databases — `.opencode/commands/doctor/assets/doctor_deep-loop.yaml:97` — Line 97 includes `"mcp_server/database/*coco*"` in forbidden_targets. This is defensive (prevents writes to non-existent coco databases), but the glob is vestigial since coco databases no longer exist. Remove the glob pattern as cleanup.

## Confirmed-Clean Surfaces
- **MCP configs**: All 5 accessible configs (.vscode/mcp.json, .gemini/settings.json, .codex/config.toml, .mcp.json, .devin/config.json) are clean — no `cocoindex_code` server blocks, no `RERANK_SIDECAR` or `8765` env vars. (Note: `opencode.json` does not exist at the expected path.)
- **Agent mirror parity**: context and deep-review agents across .opencode, .claude, .gemini are clean — no coco references. (.codex uses canonical .opencode agents, no local copies found.)
- **Command mirror parity**: deep/* commands are clean; doctor/* has one vestigial glob (F006).
- **Deep-loop YAMLs**: All 4 executor YAMLs are clean — no `cocoindex_code` in `mcp_servers:` or `tools:` sections.
- **Security residue**: No live spawn/probe paths found. The `process-memory-harness.ts` coco/rerank patterns are MATCH-only rules for process classification (DEFAULT_PROCESS_RULES), not spawn commands. The `embedder_pluggability.md` ccc commands are documented as obsolete with a banner.

## Claim Adjudication
- F005: claim "embedder_pluggability.md has obsolete ccc commands"; evidence embedder_pluggability.md:239 (obsolescence banner) + lines 239-244 (ccc run-daemon command); counterevidence sought = whether the banner is sufficient warning; alternative = retain as historical record (accepted — this is the documented exception); finalSeverity P2; confidence 0.85.
- F006: claim "doctor_deep-loop.yaml has vestigial coco glob"; evidence doctor_deep-loop.yaml:97; counterevidence sought = whether the glob causes any functional issue; alternative = defensive cleanup (accepted — it's harmless but vestigial); finalSeverity P2; confidence 0.90.

## Next Focus
D3 Traceability over clusters B+F

Review verdict: PASS