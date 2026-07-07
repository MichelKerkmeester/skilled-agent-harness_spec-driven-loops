---
title: "Implementation Plan: Code Graph Gold-Query Battery Repair"
description: "Map stale gold-query expectations from pre-extraction Spec Kit paths to current system-code-graph and system-skill-advisor anchors, then verify that the Code Graph read gate unlocks with the repaired battery. The plan keeps runtime behavior unchanged unless verification exposes a separate bug."
trigger_phrases:
  - "gold query battery plan"
  - "code graph verify repair plan"
  - "verificationGate fail plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/014-gold-query-battery-repair"
    last_updated_at: "2026-06-07T09:30:00Z"
    last_updated_by: "openai-gpt-5-5"
    recent_action: "Completed asset repair, verifier recovery, and verification gates"
    next_safe_action: "Restart the mk-code-index MCP server so the loaded runtime uses the patched verifier code"
    blockers: []
    key_files:
      - "plan.md"
      - "code-graph-gold-queries.json"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Code Graph Gold-Query Battery Repair

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON validation assets, TypeScript source anchors, Spec Kit markdown |
| **Framework** | Code Graph MCP verification battery |
| **Storage** | SQLite-backed Code Graph index plus JSON gold-query battery |
| **Testing** | `code_graph_scan`, `code_graph_verify`, representative `code_graph_query`, `validate.sh --strict` |

### Overview
Repair the persisted gold-query battery by replacing pre-extraction paths with current `system-code-graph` and `system-skill-advisor` source anchors. Verification exposed one runtime recovery bug: a failed persisted baseline blocked the verifier's own outline probes. The delivered plan keeps public read paths fail-closed while allowing internal verifier probes to recover and persist a real passing battery result.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Current stale asset paths identified.
- [x] Stable tool-ID constraint documented.

### Definition of Done
- [x] Gold-query battery updated to current source anchors.
- [x] Companion confidence fixture checked and patched if stale.
- [x] `code_graph_scan` and `code_graph_verify` pass.
- [x] Representative `code_graph_query` no longer blocks on verification failure after the verified pass.
- [x] Parent timeline and phase docs reflect evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Verification fixture recovery plus a narrow verifier recovery fix. The runtime code remains the source of truth; the battery now tests current ownership boundaries instead of historical file layout, and verifier probes can bypass only the failed gold-query gate that they are responsible for repairing.

### Key Components
- **Gold-query battery**: JSON file that defines path/symbol expectations for verification.
- **Code Graph source anchors**: Current handlers and libs under `.opencode/skills/system-code-graph/mcp_server/**`.
- **Skill Advisor source anchors**: Current handlers and libs under `.opencode/skills/system-skill-advisor/mcp_server/**`.
- **Verification gate**: `code_graph_verify` result consumed by structural read readiness.

### Data Flow
Current source files -> `code_graph_scan` -> SQLite graph -> `code_graph_verify` using repaired battery -> trust state passes -> structural read tools answer.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `code-graph-gold-queries.json` | Verification source of truth for graph trust | Update paths, symbols, and stale ownership expectation | `code_graph_verify` passes with details |
| `exclude-rule-confidence.json` | Supporting exclude-rule evidence fixture | Replace old Code Graph/Advisor paths if present | Text search for stale `system-spec-kit/mcp_server/code_graph` and `skill_advisor` paths returns no fixture hits |
| Code Graph verifier runtime | Internal recovery path for gold-query verification | Add verifier-only bypass for failed persisted verification gate | Targeted vitest, typecheck, build, and full battery pass |
| Parent phase docs | Navigation and continuity | Add the new phase row and active-child metadata | `validate.sh --strict` on the child and parent read sanity |
| Timeline | Cross-phase narrative | Update only after verification evidence exists | Timeline entry includes scan/verify result |

Required inventories:
- Search stale path prefixes in the two asset files before patching.
- Read current source files for each expected symbol before editing assertions.
- Inspect `code_graph_verify` failing details after the first patched run before making a second patch.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create phase folder under the `004-code-graph` parent.
- [x] Replace scaffold placeholders with concrete Level 2 docs.
- [x] Read current battery and confidence fixture contents.

### Phase 2: Repair
- [x] Update moved Code Graph handler/lib paths.
- [x] Update moved Skill Advisor handler/lib paths.
- [x] Rewrite the outdated Spec Kit ownership regression to current ownership.
- [x] Fix verifier self-blocking on a persisted failed gold-query baseline.

### Phase 3: Verification
- [x] Run `code_graph_scan` with the needed scope.
- [x] Run `code_graph_verify` against the repaired battery.
- [x] Confirm a representative `code_graph_query` answers.
- [x] Update timeline and finalize phase docs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Fixture sanity | No stale source prefixes remain in updated assets | Grep |
| Structural verification | Gold-query battery over current graph | `code_graph_verify` |
| Read-path smoke | Representative outline/query no longer blocked | `code_graph_query` |
| Documentation validation | Phase docs and metadata | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Current Code Graph index freshness | Internal | Yellow | Verification must rescan before passing |
| Current source anchors under extracted skills | Internal | Green | Battery can be updated directly |
| Stable MCP tool IDs | Contract | Green | Assertions must preserve `code_graph_*` names |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: repaired battery still fails and the failure cannot be explained by stale graph state or bad line metadata.
- **Procedure**: revert only the JSON fixture edits and timeline/phase completion claims, keep this phase open with the failing `code_graph_verify` details recorded for follow-up.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (setup) -> Phase 2 (asset/runtime repair) -> Phase 3 (verification/docs)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Repair |
| Repair | Setup | Verification |
| Verification | Repair | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Effort |
|-------|------------|---------------|
| Setup | Low | Phase creation and concrete Level 2 docs |
| Repair | Medium | Asset path repair plus verifier self-blocking fix |
| Verification | Medium | Vitest, typecheck, build, scan, full battery, strict validation |
| **Total** | | **Completed in-session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Repaired battery passed before persisting a new baseline.
- [x] Public read-path fail-closed behavior remained covered.
- [x] Phase docs and parent map identify the recovery scope.

### Rollback Procedure
1. Revert the JSON asset edits and the verifier-only bypass code as one repair set.
2. Clear only the affected verification metadata if it still reflects the reverted battery.
3. Re-run `npm test -- mcp_server/tests/code-graph-verify.vitest.ts`, `npm run typecheck`, `npm run build`, `code_graph_scan`, and `code_graph_verify`.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Re-run Code Graph verification after reverting; the graph can be rebuilt by the next scan.
<!-- /ANCHOR:enhanced-rollback -->
