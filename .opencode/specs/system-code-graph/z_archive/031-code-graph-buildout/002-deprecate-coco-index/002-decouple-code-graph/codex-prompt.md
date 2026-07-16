ROLE
You are a senior TypeScript engineer executing a SCOPED, surgical decouple. Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/002-decouple-code-graph` (pre-approved, skip Gate 3). Load the `sk-code` skill, let it emit the surface tag for this stack, and run its verification commands.

CONTEXT
Part of deprecating CocoIndex. THIS phase severs `system-code-graph`'s coupling to CocoIndex while keeping the structural skill fully green. Do NOT delete the coco or rerank-sidecar skills (separate phases). The authoritative, verified edit-set lives in these in-repo docs — READ THEM FIRST and follow them exactly:
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/resource-map.md` (§4 Phase 002 row + §2)
- `.../014-deprecate-coco-index/001-touchpoint-research/research/iterations/iteration-003.md` (the precise code-graph decouple edit-set, 11→8 tools, with file:line)
- `.../iterations/iteration-012.md` §"Phase 002" (the doctor/launcher/feature-catalog items this phase absorbed)
- `.../iterations/iteration-009.md` (dynamic/runtime coco ties: cocoindex-path.ts, ccc-readiness-probe.ts, startup-brief.ts)

ACTION (apply EXACTLY the edit-set from those docs). Key items:
1. `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts`: remove the `cccStatus`/`cccReindex`/`cccFeedback` schema definitions AND their entries in the `CODE_GRAPH_TOOL_SCHEMAS` array (11 → 8 tools).
2. `mcp_server/tools/code-graph-tools.ts`: remove the `handleCcc*` imports, the 3 `ccc_*` names from the `TOOL_NAMES` set, and their dispatch cases.
3. DELETE the ccc handler files (`mcp_server/handlers/ccc-status.ts`, `ccc-reindex.ts`, `ccc-feedback.ts` — confirm exact paths) and `mcp_server/lib/shared/cocoindex-path.ts` and `mcp_server/lib/ccc-readiness-probe.ts`.
4. `mcp_server/lib/query-intent-classifier.ts`: neutralize the semantic/hybrid → CocoIndex routing (return structural-only or an explicit "no semantic backend" verdict; do NOT reference coco).
5. `mcp_server/lib/startup-brief.ts` + `mcp_server/handlers/query.ts`: remove `isCocoIndexAvailable`/coco availability + ccc semantic-routing references.
6. Docs: `SKILL.md`, `ARCHITECTURE.md`, `README.md`, `INSTALL_GUIDE.md`, `references/runtime/tool_surface.md`, `references/runtime/ownership_boundary.md` — remove the glossary "Semantic search (CocoIndex)" line, the CCC router-pseudocode branch, the "When NOT to use → mcp-coco-index" line, the Tool Dispatch Contract ccc rows, and update the tool count to 8. DELETE `references/integrations/ccc_bridge_integration.md`.
7. DELETE `feature_catalog/07--ccc-integration/` (3 files) and update `feature_catalog/mcp-tool-surface/01-tool-registrations.md` + any manual_testing_playbook tool-count reference to 8 tools.
8. tests: in `mcp_server/tests/**` remove the ccc-bridge test blocks (`code-graph-siblings-readiness.vitest.ts`, `lib/security-hardening.vitest.ts`) so the suite is green without ccc.
9. `.opencode/commands/doctor/_routes.yaml`: remove the `cocoindex` route (lines ~106-120), remove `mcp__cocoindex_code__search` from the `code-graph` route (~line 73) and `skill-advisor` route (~line 129), and fix the stale "ccc" comment (~line 20). DELETE `.opencode/commands/doctor/assets/doctor_cocoindex.yaml`. Remove `cocoindex_code` entries from `doctor_mcp_install.yaml` + `doctor_mcp_debug.yaml`.
10. `.opencode/bin/mk-code-index-launcher.cjs`: remove `COCOINDEX_BIN_PATH` from the `DOTENV_ALLOW_RE` (~line 20).
11. If `system-code-graph/graph-metadata.json` declares `enhances`/`related_to` edges to `mcp-coco-index`, remove them.

SCOPE LOCK (RM-8 — STRICT)
- ALLOWED WRITE PATHS (only): `.opencode/skills/system-code-graph/**`, `.opencode/commands/doctor/**`, `.opencode/bin/mk-code-index-launcher.cjs`.
- BANNED (never touch): anything under `.opencode/specs/**` (frozen history), `.opencode/skills/mcp-coco-index/**` and `.opencode/skills/system-rerank-sidecar/**` (deleted in later phases, NOT here), and any path outside ALLOWED.
- Do NOT git commit or git add — leave changes in the working tree; the orchestrator commits.

VERIFY (run these; report results)
- `cd .opencode/skills/system-code-graph/mcp_server && npx tsc --noEmit` (no new type errors from the decouple).
- `npx vitest run` in that mcp_server (the ccc tests are removed; the rest must pass).
- Confirm `CODE_GRAPH_TOOL_SCHEMAS` now has exactly 8 entries (grep/print them).
- `rg -n "cocoindex|ccc_status|ccc_reindex|ccc_feedback|mcp__cocoindex_code|isCocoIndexAvailable" .opencode/skills/system-code-graph .opencode/commands/doctor .opencode/bin/mk-code-index-launcher.cjs` returns ZERO live references.

FORMAT (end your run with)
- `CHANGED PATHS:` a newline list of every file you edited/created/deleted (exact repo-relative paths) — this is the orchestrator's commit manifest.
- `VERIFY:` the results of each verify command (pass/fail + key output).
- `NOTES:` anything you could not complete or that needs follow-up.
