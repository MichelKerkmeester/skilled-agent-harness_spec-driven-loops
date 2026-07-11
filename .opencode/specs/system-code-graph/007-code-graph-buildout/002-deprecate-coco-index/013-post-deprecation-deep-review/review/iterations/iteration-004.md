# Iteration 4 - D4 Maintainability / Behavior, Incidents & Exceptions
## Dimensions Covered
- maintainability
## Files Reviewed
- `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:89-138`
- `.opencode/skills/system-spec-kit/scripts/tests/process-sweep.vitest.ts:141-157`
- `.opencode/skills/cli-codex/SKILL.md:357`
- `.opencode/skills/cli-claude-code/SKILL.md:350`
- `.opencode/skills/cli-opencode/SKILL.md:296`
- `.opencode/skills/cli-devin/SKILL.md:372`
- `.opencode/skills/cli-gemini/SKILL.md:309`
- `.opencode/skills/system-spec-kit/references/memory/embedder_pluggability.md:189`
- `.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC3-happy-path.json:22`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/local-llm-query-intelligence/409-fixture.json:3`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `.opencode/skills/system-spec-kit/changelog/v3.2.0.0.md:209`
## Findings
### P0
- none
### P1
- none
### P2
- none
## Confirmed-Clean Surfaces
- **Kept exceptions (RM-8)**: All justified-inert, no live coupling:
  - `process-memory-harness.ts:89-138` - coco/rerank patterns are MATCH-only rules in `DEFAULT_PROCESS_RULES` for process classification, never spawn commands. Lines 91-101 define cocoindex-daemon/cocoindex-mcp patterns; line 127-131 define rerank-sidecar pattern. All are used only for `pattern.test()` matching in `classifyProcesses()` line 446, not for execution.
  - `process-sweep.vitest.ts:141-157` - test fixture preserves ccc-daemon classification as historical test coverage for the process-sweep logic. The test verifies that ccc daemons without owner tokens are preserved (line 153-156), not spawned.
  - cli-* SKILL.md files (cli-codex:357, cli-claude-code:350, cli-opencode:296, cli-devin:372, cli-gemini:309) - `pkill -9 -f "ccc search"` lines are documented cleanup safety mechanisms for orphaned dispatcher processes, not live coupling to the deleted ccc CLI.
  - `embedder_pluggability.md:189` - explicit obsolescence banner: "⚠️ Obsolete as of the 014 CocoIndex deprecation. system-code-graph no longer has a pluggable embedder or a CocoIndex/`ccc` vector layer — it is now a structural tree-sitter indexer."
  - Test fixtures use "coco" as search-term data only: `F-AC3-happy-path.json:22` expects "phase 7 cocoindex" as absent trigger (test data); `409-fixture.json:3` uses "CocoIndex complete-fork" as historical query data for memory retrieval testing (frozen benchmark data).

- **Static behavioral review (surfaces 16-20)**: No dangling references or broken paths:
  - `memory-search.ts` - no references to removed cocoIndex/cocoIndexAvailable fields, calibration logic, or daemon-probe code. The file uses the 4-stage pipeline architecture (line 16) and has no coco-specific imports or logic.
  - `code-graph-boundary.ts` - no references to removed cocoIndex/cocoIndexAvailable fields. The file uses the readiness marker pattern (line 152-183) and MCP RPC to code-graph (line 269-302), with no coco coupling.
  - `compact-inject.ts` (claude) - no references to removed cocoIndex/cocoIndexAvailable fields. The file uses the 3-source merge pipeline (line 210) and auto-surface from memory (line 284), with no coco coupling.
  - `session-prime.ts` (claude) - no references to removed cocoIndex/cocoIndexAvailable fields. The file uses getStartupBriefFromMarker (line 26) and handles compact/startup/resume/clear sources, with no coco coupling.
  - `session-prime.ts` (gemini) - no references to removed cocoIndex/cocoIndexAvailable fields. Same pattern as claude version, uses getStartupBriefFromMarker (line 33), with no coco coupling.
  - `session-resume.ts` - no references to removed cocoIndex/cocoIndexAvailable fields. The file uses code-graph-boundary for status (line 14-15) and builds resume context, with no coco coupling.

- **Incident-revert cleanliness (surfaces 21-22)**: No residue:
  - No `codeGraph-*` rename artifacts found outside review docs (009 incident revert was clean).
  - No `rerank-rerank-consumer` or `code_graph-complete-fork` falsification found outside review docs (010 incident-#3 revert was clean).

- **Doc-prose accuracy (surface 29)**: No misleading instructions:
  - Only historical reference found: `changelog/v3.2.0.0.md:209` mentions "Must use CocoIndex" style instructions in past tense as part of historical context about routing enforcement changes. This is not a live instruction.
  - No live "enable the sidecar" or "use CocoIndex" instructions found in live docs (SKILL.md files, README.md, references/).

## Claim Adjudication
- No new P0/P1 findings to adjudicate. Prior findings F001-F007 remain unchanged from iterations 1-3.

## Next Focus
Synthesis (all 4 dimensions covered: correctness, security, traceability, maintainability). The review is complete with no new findings in iteration 4. All kept exceptions are justified-inert, behavioral paths are clean, incident reverts left no residue, and doc prose is accurate.

Review verdict: PASS
