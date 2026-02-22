---
title: "Verification Checklist: 012 - Deprecate Skill Graph and [012-deprecate-skill-graph-and-readme-indexing/checklist]"
description: "Evidence format: [Evidence: command/file/result]"
trigger_phrases:
  - "verification"
  - "checklist"
  - "012"
  - "deprecate"
  - "skill"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: 012 - Deprecate Skill Graph and README/Skill-Ref Indexing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR user-approved deferral |
| **[P2]** | Optional | Can defer with documented reason |

Evidence format: `[Evidence: command/file/result]`
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:p0 -->
## P0 - Hard Blockers

- [x] CHK-001 [P0] SGQS tools removed from schema and handler registry [Evidence: `rg -n "memory_skill_graph_query|memory_skill_graph_invalidate|sgqs|skill[-_ ]graph|SPECKIT_GRAPH_MMR|SPECKIT_GRAPH_AUTHORITY" .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts || true` -> no matches (2026-02-21)]
- [x] CHK-002 [P0] SGQS runtime modules removed or fully disconnected [Evidence: `test -f .opencode/skill/system-spec-kit/mcp_server/handlers/sgqs-query.ts` -> no; `test -f .opencode/skill/system-spec-kit/mcp_server/lib/search/skill-graph-cache.ts` -> no; `rg -n "sgqs|skill[-_ ]graph" .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts || true` -> no matches]
- [x] CHK-003 [P0] README indexing removed from index scan behavior [Evidence: `rg -n "includeReadmes|README indexing" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts || true` -> no matches; targeted test `VOYAGE_API_KEY='' npm run test --workspace mcp_server -- tests/handler-memory-index.vitest.ts` -> PASS]
- [x] CHK-004 [P0] workflows-code/sk-code `references/` and `assets/` indexing removed [Evidence: `test -f .opencode/skill/system-spec-kit/mcp_server/lib/config/skill-ref-config.ts` -> no; `rg -n "includeSkillRefs|skillReferenceIndexing|SPECKIT_INDEX_SKILL_REFS|references/|assets/" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/lib/config .opencode/skill/system-spec-kit/config/config.jsonc || true` -> no matches]
- [x] CHK-005 [P0] Root README and in-scope docs no longer claim SGQS/removed indexing as active [Evidence: `rg -n "memory_skill_graph_query|memory_skill_graph_invalidate|SGQS|Skill Graph|skill graph|skill_graph|SPECKIT_GRAPH_MMR|SPECKIT_GRAPH_AUTHORITY|includeReadmes|includeSkillRefs|skillReferenceIndexing|SPECKIT_INDEX_SKILL_REFS" .opencode/skill/system-spec-kit .opencode/command .opencode/agent .opencode/agent/chatgpt README.md --glob '!**/dist/**' --glob '!**/specs/**' || true` -> no matches]
- [x] CHK-006 [P0] README generation guidance mandates paired ANCHOR tags [Evidence: `rg -n "anchor_requirements|<!-- ANCHOR:|<!-- /ANCHOR:" .opencode/command/create .opencode/skill/sk-documentation` -> paired anchor guidance present (e.g., `.opencode/command/create/assets/create_folder_readme_auto.yaml:501`, `.opencode/command/create/assets/create_skill_confirm.yaml:714`, `.opencode/skill/sk-documentation/assets/opencode/skill_md_template.md:110`)]
- [x] CHK-007 [P0] MCP server typecheck passes [Evidence: `(cd .opencode/skill/system-spec-kit && npm run typecheck)` -> PASS (`tsc -p shared/tsconfig.json && tsc --noEmit --composite false -p mcp_server/tsconfig.json && tsc --noEmit --composite false -p scripts/tsconfig.json`)]
- [x] CHK-008 [P0] MCP server tests pass [Evidence: `(cd .opencode/skill/system-spec-kit && VOYAGE_API_KEY='' npm run test --workspace mcp_server)` -> PASS (`155` files, `4528` passed, `19` skipped); note: inherited `VOYAGE_API_KEY` run in network-restricted sandbox timed out one test]
<!-- /ANCHOR:p0 -->

---

<!-- ANCHOR:p1 -->
## P1 - Required

- [x] CHK-020 [P1] Removed flags/inputs are documented with migration guidance [Evidence: deprecation and migration intent documented in `specs/003-system-spec-kit/138-hybrid-rag-fusion/012-deprecate-skill-graph-and-readme-indexing/spec.md:119`, `specs/003-system-spec-kit/138-hybrid-rag-fusion/012-deprecate-skill-graph-and-readme-indexing/spec.md:258`, `specs/003-system-spec-kit/138-hybrid-rag-fusion/012-deprecate-skill-graph-and-readme-indexing/decision-record.md:68`, `specs/003-system-spec-kit/138-hybrid-rag-fusion/012-deprecate-skill-graph-and-readme-indexing/decision-record.md:176`]
- [x] CHK-021 [P1] Command docs under `.opencode/command/**` are synchronized [Evidence: full banned-term sweep command (CHK-005) includes `.opencode/command` and returned no matches]
- [x] CHK-022 [P1] Agent docs under `.opencode/agent/**` are synchronized [Evidence: full banned-term sweep command (CHK-005) includes `.opencode/agent` and returned no matches]
- [x] CHK-023 [P1] ChatGPT agent docs under `.opencode/agent/chatgpt/**` are synchronized [Evidence: full banned-term sweep command (CHK-005) includes `.opencode/agent/chatgpt` and returned no matches]
- [x] CHK-024 [P1] Skill docs under `.opencode/skill/**` are synchronized [Evidence: full banned-term sweep command (CHK-005) includes `.opencode/skill` and returned no matches]
- [x] CHK-025 [P1] Regression tests cover removed SGQS tool availability and excluded source indexing [Evidence: targeted regression run `(cd .opencode/skill/system-spec-kit && VOYAGE_API_KEY='' npm run test --workspace mcp_server -- tests/context-server.vitest.ts tests/handler-memory-index.vitest.ts)` -> PASS (`2` files, `278` tests); full suite PASS in CHK-008]
- [x] CHK-026 [P1] This phase docs validate with zero validation errors [Evidence: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/003-system-spec-kit/138-hybrid-rag-fusion/012-deprecate-skill-graph-and-readme-indexing` -> `RESULT: PASSED` (`Errors: 0`, `Warnings: 0`); `bash .opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh specs/003-system-spec-kit/138-hybrid-rag-fusion/012-deprecate-skill-graph-and-readme-indexing` -> `PASS — Zero placeholder patterns found`]
<!-- /ANCHOR:p1 -->

---

<!-- ANCHOR:p2 -->
## P2 - Optional

- [ ] CHK-030 [P2] Add explicit post-migration cleanup task for legacy `readme` rows in memory index [Evidence: deferred - not required for phase closure]
- [ ] CHK-031 [P2] Add changelog-style deprecation note for downstream operators [Evidence: deferred - not required for phase closure]
- [ ] CHK-032 [P2] Add benchmark comparison before/after source contraction [Evidence: deferred - not required for phase closure]
<!-- /ANCHOR:p2 -->

---

<!-- ANCHOR:verification-commands -->
## Verification Commands (Must Execute)

```bash
rg -n "memory_skill_graph_query|memory_skill_graph_invalidate|SGQS|Skill Graph|skill graph|skill_graph|SPECKIT_GRAPH_MMR|SPECKIT_GRAPH_AUTHORITY|includeReadmes|includeSkillRefs|skillReferenceIndexing|SPECKIT_INDEX_SKILL_REFS" .opencode/skill/system-spec-kit .opencode/command .opencode/agent .opencode/agent/chatgpt README.md --glob '!**/dist/**' --glob '!**/specs/**' || true
(cd .opencode/skill/system-spec-kit && npm run typecheck)
(cd .opencode/skill/system-spec-kit && npm run test --workspace mcp_server)
(cd .opencode/skill/system-spec-kit && VOYAGE_API_KEY='' npm run test --workspace mcp_server)
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/003-system-spec-kit/138-hybrid-rag-fusion/012-deprecate-skill-graph-and-readme-indexing
bash .opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh specs/003-system-spec-kit/138-hybrid-rag-fusion/012-deprecate-skill-graph-and-readme-indexing
```
<!-- /ANCHOR:verification-commands -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 7 | 7/7 |
| P2 Items | 3 | 0/3 (deferred) |

**Verification Date**: 2026-02-21
**Current Status**: Complete
<!-- /ANCHOR:summary -->
