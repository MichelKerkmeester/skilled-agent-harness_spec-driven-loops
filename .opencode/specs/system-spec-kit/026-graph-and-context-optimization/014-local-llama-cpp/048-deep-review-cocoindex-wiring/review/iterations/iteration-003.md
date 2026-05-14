# Iteration 3: Traceability

## Focus
D3 Traceability — Spec/docs alignment with implementation, continuity frontmatter accuracy, architecture decisions documentation, actor slug naming consistency, smoke results vs TSV evidence, checklist evidence verification.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 7 (all 045 spec docs + TSV + handover)
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.04

## Findings

### P2 — Suggestion

- **F008**: Handover file describes 045 as PARTIAL, contradicting the commit that flips it to SHIPPED — `HANDOVER-2026-05-14-evening.md:96,165-167`
  - **Evidence**: Line 96: `| **045** shared-daemon suite runner | ✅ PARTIAL | ... smoke: 410 PASS, 403 SKIP (CocoIndex wiring follow-on) |`. Lines 165-167: `### 045 PARTIAL — CocoIndex MCP not yet wired — Scenarios 403/404/407 require cocoindex_code.search which the current runner doesn't connect to. P1 next-session task.` These describe the pre-fix state. However, commit cddfbe4aa both ships the CocoIndex wiring fix AND includes this handover file. The commit message says "Also includes the 2026-05-14 evening handover documenting the full substrate-repair wave inventory... and the now-resolved open items" — but the handover text itself was not updated to reflect the fix it ships alongside.
  - **Category**: traceability
  - **Recommendation**: Either (a) update the handover to reflect post-fix state (045=SHIPPED, CocoIndex wired, P1 resolved), or (b) add a clear note at the top that the handover describes wave state PRIOR to the 045 fix it ships alongside, e.g., "NOTE: 045 CocoIndex wiring was completed in this same commit — see commit message and 045 packet for current state."

- **F009**: Spec requirements REQ-002 and SC-001 only describe single-client architecture, not two-client CocoIndex wiring — `spec.md:112,133`
  - **Evidence**: Line 112: `REQ-002: Runner starts the memory launcher once. Script creates one StdioClientTransport for .opencode/bin/spec-kit-memory-launcher.cjs.` Line 133: `SC-001: Runner uses one MCP client connection to the memory launcher.` Both describe the pre-wiring state. The CocoIndex client (`.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc mcp`) is not mentioned in the formal requirements or success criteria, only in the scope (line 80) and risks (line 149) sections.
  - **Category**: traceability
  - **Recommendation**: Add REQ-010 (or update REQ-002) to explicitly cover the CocoIndex client: "Runner starts one StdioClientTransport for cocoindex_code." Update SC-001 to "Runner uses one MCP client connection per daemon surface (memory and CocoIndex)."

- **F010**: Architecture tradeoff analysis ("two transports" vs "proxy through memory") not documented — `implementation-summary.md:119-130`
  - **Evidence**: The "Key Decisions" table (lines 122-129) documents the chosen approach ("Use one transport per MCP surface") but does not discuss the alternative of proxying CocoIndex calls through the memory daemon (which already has routing infrastructure). The spec's answered questions (line 33) states the decision but not the rationale. For an architectural change that adds process-spawning and ~200 lines of transport management code, the tradeoff analysis should be explicit.
  - **Category**: traceability
  - **Recommendation**: Add a decision record or expand the "Key Decisions" entry to explain: (1) why proxying through memory was rejected (e.g., memory daemon would need CocoIndex SDK dependency, adds latency hop, different transport lifecycle), and (2) why two independent transports was preferred (direct stdio, independent daemon lifecycle, fail-isolated).

## Cross-Reference Results

### Core Protocols

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:112,133 vs run-mcp-direct.mjs:518-549 | REQ-002 and SC-001 describe only memory launcher, but implementation has two clients. Scope section (line 80) correctly lists CocoIndex. |
| checklist_evidence | partial | hard | checklist.md:62-66 | CHK-012 "both clients close in finally" — partially inaccurate per F001. Other checklist items verified: CHK-010 syntax PASS, CHK-020 smoke PASS, CHK-030 no secrets, CHK-031 input validation. |

### Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| Smoke results match TSV | PASS | implementation-summary.md:150-155 matches run-2026-05-14-shared-daemon.summary.tsv verbatim. |
| Continuity frontmatter consistency | PASS | All 5 spec docs have identical `_memory.continuity` fields: `last_updated_at: 2026-05-14T17:53:33Z`, `last_updated_by: cli-codex-gpt-5-5-high`, `recent_action: "Wired second cocoindex_code MCP client..."`, `completion_pct: 100`. |
| Actor slug naming | PASS | `cli-codex-gpt-5-5-high` uses hyphens (no `@` prefix), consistent across all docs. Commit message uses "Codex GPT-5.5" as Co-Authored-By. |
| description.json accuracy | PASS | `status: "complete"`, keywords include `"cocoindex-wired"`, `lastUpdated: 2026-05-14T17:53:33Z` matches docs. |
| graph-metadata.json accuracy | PASS | `derived.status: "complete"`, `causal_summary` describes two-client routing, `key_files` lists runner, TSV, stderr logs, and vitest. |
| plan.md phases | PASS | "Phase 2 - CocoIndex Wiring" (lines 133-138) documents all 6 sub-tasks. |
| tasks.md T018/T019 | PASS | T018 documents cocoindex wiring; T019 documents routing helper unit coverage. |
| Implementation summary limitations | PASS | Line 187: "CocoIndex now wired" — accurately describes state after commit. |

## Assessment
- New findings ratio: 0.04 (3 P2 traceability findings across 7 docs + TSV)
- Dimensions addressed: traceability
- Novelty justification: F008 (handover contradiction) and F009 (spec staleness) are new findings. F010 (missing tradeoff analysis) is a new documentation gap. No P0 or P1 traceability findings — the core spec/implementation alignment is strong. The TSV evidence is truthful, continuity frontmatter is consistent, and cross-references are mostly intact.
- The handover contradiction (F008) is noteworthy because the file is included in the same commit that fixes the condition it describes as pending. This could confuse an operator resuming from the handover without reading the commit message.

## Ruled Out
- **Smoke result fabrication**: TSV file matches implementation-summary verbatim. The commit message describes the same results. Trustworthy.
- **Missing checklist items**: All 28 checklist items marked `[x]` with evidence. CHK-012 has the partially-inaccurate "both clients close in finally" claim (documented in F001).
- **Continuity drift across spec docs**: All 5 `_memory.continuity` blocks are identical across spec.md, plan.md, tasks.md, checklist.md, and implementation-summary.md.

## Dead Ends
None.

## Recommended Next Focus
D4 Maintainability — Helper extraction quality (`connectSharedClient`, `selectClientForServer`, `createCappedStderrStream`), test coverage gaps (routing fallback, partial-connect, retry paths), readability of long blocks, and new transitive dependency surface.
