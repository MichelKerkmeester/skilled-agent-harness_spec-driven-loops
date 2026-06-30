ROLE
Senior TypeScript engineer performing a REMOVAL (not a rename, not a rewrite) of a vestigial dependency from a live MCP server. Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/010-remove-memory-coco-integration` (pre-approved, skip Gate 3). Load `sk-code`. Work dir for all verify commands: `.opencode/skills/system-spec-kit/mcp_server`.

CONTEXT — what is already done + why this is safe
The CocoIndex skill + daemon are DELETED. I (the orchestrator) have ALREADY DELETED memory's coco SOURCE + dedicated TEST files:
- `lib/cocoindex/` (daemon-probe.ts + README.md), `lib/utils/cocoindex-path.ts`, `lib/search/cocoindex-calibration.ts`
- `tests/cocoindex-daemon-probe.vitest.ts`, `stress_test/search-quality/w6-cocoindex-calibration.vitest.ts`, `stress_test/search-quality/w11-cocoindex-calibration-telemetry.vitest.ts`
Your job: remove every now-broken CONSUMER of those files + all remaining coco references, so the package typechecks + tests pass again.

BEHAVIORAL SAFETY (verified by orchestrator — do not second-guess, do not re-add): memory's REAL search is an embedder-backed hybrid channel (`lib/search/vector-index.ts`, `lib/search/hybrid-search.ts`, channels vector/fts/bm25/graph/degree). The coco coupling is VESTIGIAL: `probeCocoIndexDaemon` + `calibrateCocoIndexOverfetch` produce post-fetch TELEMETRY only (calibration runs AFTER results are fetched), and the `"vector channel unavailable, lexical-only"` warning is MISLEADINGLY keyed off the coco daemon. Removing all of it does NOT change actual search results. Do NOT replace removed telemetry with stubs. Do NOT re-key the vector warning (out of scope).

THE 002 TYPE-BREAK YOU MUST REPAIR: phase 002 already removed `cocoIndex` from `MergeInput` and `cocoIndexAvailable` from `StartupBriefResult` in system-code-graph. Memory's consumers still pass/require them → these are among the typecheck errors. Repair by REMOVING the coco fields from memory's literals/types (consistent with the removal), NOT by re-adding fields to code-graph.

ACTION
1. Read `/tmp/ph010-tc.log` — the current 13 typecheck errors (the import-break layer). Fix each by REMOVING the broken import + every usage it feeds (the symbol's call sites, the object fields it populated, the branches it gated). Re-run typecheck; new usage-layer errors will surface; repeat until `npm run typecheck` exits 0.
2. Remove ALL remaining coco references (typed + string-literal + comment) in system-spec-kit. Enumerate with:
   `rg -n -i "cocoindex|cocoIndex|isCocoIndex|probeCocoIndex|calibrateCoco" .opencode/skills/system-spec-kit -g '!**/changelog/**'`
   Known heavy consumers: `handlers/session-resume.ts` (33 refs — likely a coco status section in the resume surface; remove it), `handlers/memory-search.ts` (the probe + calibration + the misleading vector warning at ~line 1117-1123 + 1216-1219 + 1282-1290), `handlers/memory-crud-health.ts`, `lib/search/search-decision-envelope.ts` (remove the `cocoindexCalibration`/`cocoIndex`/`CocoIndexCalibrationEnvelopeTelemetry` from the envelope type + builder), `lib/search/pipeline/types.ts`, `lib/session/session-snapshot.ts` (remove `cocoIndexAvailable` + `isCocoIndexAvailable()` call), `hooks/memory-surface.ts`, `hooks/claude/compact-inject.ts` (remove the `cocoIndex` const + the MergeInput field), `hooks/claude/session-prime.ts` + `hooks/gemini/session-prime.ts` + `hooks/devin/session-start.ts` (remove `cocoIndexAvailable`), `lib/code-graph-boundary.ts` (remove `cocoIndexAvailable` from the StartupBriefResult literal + any local type), `context-server.ts` (lines ~195/735/854 — remove the field + the "CocoIndex: ..." hint text), `lib/rag/trust-tree.ts`, `tool-schemas.ts`.
3. Update the ~20 TEST files that reference coco: `tests/structural-contract.vitest.ts`, `tests/memory-crud-extended.vitest.ts`, `tests/session-resume.vitest.ts`, `tests/compact-merger.vitest.ts`, `tests/budget-allocator.vitest.ts`, `tests/code-graph-boundary-env-allowlist.vitest.ts`, `tests/handler-memory-search-live-envelope.vitest.ts`, `tests/shared-daemon-runner-helpers.vitest.ts`, `tests/dual-scope-hooks.vitest.ts`, `tests/hook-session-start.vitest.ts`, `tests/{devin,codex}-session-start-hook.vitest.ts`, `tests/copilot-user-prompt-submit-hook.vitest.ts`, `tests/hooks-codex-freshness.vitest.ts`, `stress_test/search-quality/{w3-trust-tree,w8-search-decision-envelope}.vitest.ts`, `stress_test/search-quality/{corpus,measurement-fixtures}.ts`. RULE: remove ONLY coco-specific assertions/cases/fixtures. Do NOT delete or weaken any non-coco test assertion. Do NOT delete a whole test file unless it is 100% coco-dedicated (only w-files already deleted were). Report test count before/after.
4. Remove coco from system-spec-kit DOCS: `SKILL.md`, `README.md`, `manual_testing_playbook/**`, `references/**`, `mcp_server/**/README.md` (incl `lib/search/README.md`, `stress_test/search-quality/README.md`). Rewrite any "semantic code search" guidance to the HYBRID policy (Code Graph structural + Grep); memory_search stays for spec-docs/memory. CLEAN prose — no duplicate words, no "codeGraph-path.ts" dangling refs.

SCOPE LOCK (RM-8 — STRICT)
- ALLOWED: `.opencode/skills/system-spec-kit/**` ONLY (EXCEPT `**/changelog/**`).
- BANNED: everything else — `.opencode/specs/**`, system-code-graph, system-skill-advisor, all other skills, all configs/agents/commands, `**/changelog/**`. Do NOT touch `dist/` (gitignored; rebuilt separately).
- NEVER rename a symbol, file, directory, or identifier. This is the failure mode of the prior attempt — `cocoIndex`→`codeGraph` renaming created duplicate identifiers + broke imports. REMOVE; do not rename. If a removal leaves an empty object/branch, delete the empty construct cleanly.
- Do NOT git add/commit.

VERIFY (HARD GATE — iterate until BOTH pass; report actual exit codes)
- `npm run typecheck` → exit 0 (this also proves the 002 break is repaired).
- `npm run test` → exit 0 (FULL vitest suite). If a test legitimately can't pass without coco, the fix is removing the coco-specific case — NOT weakening unrelated assertions.
- `rg -n -i "cocoindex|cocoIndex|isCocoIndex|probeCocoIndex|calibrateCoco" .opencode/skills/system-spec-kit -g '!**/changelog/**' -g '!**/dist/**'` → ZERO.

FORMAT (end with)
- `CHANGED PATHS:` newline list of every file edited/deleted (exact repo-relative paths, backtick-wrapped).
- `VERIFY:` typecheck exit, vitest exit + test count before/after, coco-grep count (must be 0).
- `NOTES:` any test case removed (with one-line justification) + anything incomplete.
