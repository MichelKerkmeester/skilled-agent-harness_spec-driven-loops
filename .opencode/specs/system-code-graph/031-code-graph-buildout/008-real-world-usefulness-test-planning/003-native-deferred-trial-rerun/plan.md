---
title: "Implementation Plan: Native Rerun of Deferred Usefulness Cells"
description: "Plan and execution record for native rerun cells deferred by the sandbox usefulness campaign."
trigger_phrases:
  - "native rerun usefulness"
  - "026/007/012/002"
  - "native synthesis update"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/008-real-world-usefulness-test-planning/003-native-deferred-trial-rerun"
    last_updated_at: "2026-05-06T04:47:44.000Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Documented native rerun plan and measured outcomes"
    next_safe_action: "Fix code graph P0 backlog or run separate live-runtime campaign"
    blockers:
      - "Code graph native scope policy and parser failures remain unresolved"
      - "Plugin/runtime integration still needs a separate authenticated live-runtime campaign"
    key_files:
      - "plan.md"
      - "trials/trial-log.jsonl"
      - "synthesis-report-native-rerun.md"
    session_dedup:
      fingerprint: "sha256:b8573afd98812522094e9f5aa54f5d37d81833610eaaa1bd3f99e41c397950d4"
      session_id: "026-007-012-003-native-deferred-trial-rerun"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which live-runtime campaign should validate plugin/runtime integration next?"
    answered_questions:
      - "Native access changes the code graph finding from sandbox-bound overhead to product overhead."
---
# Implementation Plan: Native Rerun of Deferred Usefulness Cells

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript, MCP surfaces, markdown documentation |
| **Framework** | Spec Kit Memory, code graph, hook/advisor routing, native orchestrator evidence |
| **Storage** | Packet-local markdown, JSON metadata, JSONL trial log, raw evidence files |
| **Testing** | Native rerun measurements plus strict spec validation |

### Overview
The native rerun focused on cells that `001-sandbox-usefulness-trials` could not measure from the sandbox. The plan was simple: replay the deferred code graph and hook/advisor cells under native access, record whether they ran or blocked, and update the synthesis only where native evidence exists.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Prior execution packet reviewed. Evidence: `../001-sandbox-usefulness-trials/spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, and `synthesis-report.md`.
- [x] Spec folder approved. Evidence: user pre-approved `003-native-deferred-trial-rerun/`.
- [x] Native measurements supplied by orchestrator. Evidence: prompt included concrete scan, query, advisor, hook, and backlog-fix results.

### Definition of Done
- [x] Native measurements logged to `trials/trial-log.jsonl`.
- [x] Level 2 docs and metadata authored.
- [x] Synthesis updated per axis.
- [x] Native-derived backlog recorded.
- [x] Parent metadata updated with this child.
- [x] Strict validation run after doc creation.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Native evidence replay packet with explicit status classification.

### Key Components
- **Trial Log**: JSONL rows for scans, blocked queries, advisor probes, compaction recovery, and backlog-fix verification.
- **Raw Evidence**: Packet-local JSON files that preserve the observed payload or a placeholder summary when the orchestrator holds the full transcript.
- **Synthesis Update**: `synthesis-report-native-rerun.md` compares sandbox and native verdicts.
- **Decision Record**: ADRs define why the code graph finding is a real product issue and which workflow should be used until the graph is fixed.

### Data Flow
The orchestrator produced native measurements. This packet records those measurements, maps them to requirements and tasks, updates the verdict table, and turns unresolved native defects into P0/P1 backlog items.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Native Result | Follow-up |
|---------|--------------|---------------|-----------|
| `mcp_server/code_graph/lib/index-scope-policy.ts` | Selects default graph scope. | Default scope excluded the system code most users work on. | P0: expand default or warn when active CWD indexes to zero nodes. |
| `mcp_server/code_graph/handlers/scan.ts` | Persists scan results as live graph state. | Scope-mismatched scan persisted `totalNodes: 0` over a populated graph. | P0: reject or loudly warn before replacing a non-empty graph with zero nodes. |
| `mcp_server/code_graph/lib/structural-indexer.ts` | Parses/indexes TypeScript structure. | 10 files hit `memory access out of bounds` parser crashes. | P0: surface crashes and preserve recoverable partial state. |
| `mcp_server/code_graph/handlers/query.ts` | Handles graph query operations and drift checks. | Drift detector blocked read paths after scan/query scope mismatch. | P1: auto-rescan with union scope or emit actionable includeSkills guidance. |
| `mcp_server/hooks/codex/session-start.ts` | Codex hook entrypoint. | `--smoke` mode verified valid envelope. | Fixed from prior backlog. |
| `mcp_server/hooks/copilot/README.md` | Copilot hook preflight docs. | Offline unauthenticated preflight now emits two context markers. | Fixed from prior backlog. |

Required inventories:
- Same-class producers: scan scope policy, scan persistence, structural parser, query drift detector.
- Consumers: day-to-day code graph users, startup/resume flows that depend on graph availability, native CLI sessions.
- Matrix axes: code graph, hooks, plugin/runtime integration; sandbox verdict versus native verdict.
- Algorithm invariant: never persist a zero-node scan over a previously non-empty graph without an explicit rejection or warning path.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Packet Setup
- [x] Create Level 2 metadata and documentation files.
- [x] Reuse the existing `trials/raw/` and `analysis/` scaffold.
- [x] Read prior execution packet and parent metadata.

### Phase 2: Native Measurement Capture
- [x] Log successful first code graph scan with `includeSkills: true`.
- [x] Log three code graph queries blocked by candidate manifest drift.
- [x] Log default-scope scan that wiped the graph to zero nodes.
- [x] Log outline query blocked by empty graph.
- [x] Log failed recovery scan with `includeSkills: true`.
- [x] Log three advisor probes.
- [x] Log compaction hook formatting confirmation.
- [x] Log two prior backlog fixes as verified.

### Phase 3: Synthesis
- [x] Update code graph verdict to OVERHEAD.
- [x] Update hooks verdict to USEFUL.
- [x] Update plugin/runtime integration verdict to DEFERRED.
- [x] Record native-derived P0/P1 backlog.

### Phase 4: Verification
- [x] Update parent metadata.
- [x] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Completed Native Measurements

| Cell | Status | Evidence |
|------|--------|----------|
| `S-CG-setup/includeSkills-first-scan` | COMPLETED | `filesScanned: 9280`, `totalNodes: 56843`, `durationMs: 13376`. |
| `S-CG-01/code_graph_query calls_to scoreLexicalLane` | BLOCKED | Candidate manifest drift blocked read path. |
| `S-CG-03/code_graph_query blast_radius recommend_with_native_advisor` | BLOCKED | Candidate manifest drift blocked read path. |
| `S-CG-02/code_graph_query imports_to skill-graph-db.ts` | BLOCKED | Candidate manifest drift blocked read path. |
| `S-CG-scan/default-scope` | COMPLETED_WITH_FAILURE | Persisted `totalNodes: 0`, `totalEdges: 764`, and parser crash errors. |
| `S-CG-04/outline sk-code/SKILL.md` | BLOCKED | Graph empty with zero nodes. |
| `S-CG-recovery/includeSkills-third-scan` | COMPLETED_WITH_FAILURE | Still zero nodes with parser crashes. |
| `S-HK-02/advisor frontend motion prompt` | COMPLETED | Top-1 `sk-code`, score `0.86`, confidence `0.95`, correct. |
| `S-HK-02/advisor save context prompt` | COMPLETED | Top results `system-spec-kit` then `memory:save`, correct. |
| `S-HK-02/advisor create spec folder prompt` | COMPLETED | Top-1 `system-spec-kit`, score `0.80`, confidence `0.93`, correct. |
| `S-HK-04/compaction recovery formatting` | PARTIAL | Hook-cache source and cachedAt marker surfaced after compaction. |
| `backlog/codex-session-start-smoke` | VERIFIED | `node ...session-start.js --smoke` returned valid envelope. |
| `backlog/copilot-offline-preflight` | VERIFIED | Offline preflight emitted two `SPEC-KIT-COPILOT-CONTEXT` markers. |

### Deferred Measurements

| Cell | Status | Reason |
|------|--------|--------|
| Plugin/runtime integration axis | DEFERRED | Needs a separate authenticated live-runtime campaign with cli-gemini, Claude Code, and OpenCode. |
| Compaction recovery quality | PARTIAL | Formatting confirmed; relevance scoring needs a controlled trigger. |

### Scoring Mechanics
- Completed native rows use observed values from the orchestrator.
- Blocked rows preserve exact failure strings where supplied.
- Hook/advisor rows use correctness against the expected routing verdict.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Native MCP access | Runtime | Available to orchestrator | Enabled advisor and code graph rerun. |
| Code graph scan/query handlers | Internal | Available but failing | Produced native product findings. |
| Hook cache after compaction | Runtime | Available | Confirmed formatting only. |
| Authenticated external runtime campaign | External/runtime | Deferred | Plugin/runtime verdict remains deferred. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The native rerun packet is rejected or superseded by a corrected rerun.
- **Procedure**: Remove `003-native-deferred-trial-rerun/` and remove `system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/003-native-deferred-trial-rerun` from `../graph-metadata.json.children_ids`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Prior sandbox synthesis -> Native rerun evidence -> Verdict update -> Code graph backlog -> Separate live-runtime campaign
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Existing scaffold and prior packet review. |
| Native Measurement Capture | Medium | Thirteen orchestrator-supplied measurements mapped into trial evidence. |
| Synthesis | Medium | Verdict reversal required careful scope and confidence language. |
| Verification | Low | JSON checks, JSONL checks, and strict spec validation. |
| **Total** | **Medium** | **Single documentation packet pass** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production code changes included.
- [x] Parent metadata change is isolated to one `children_ids` addition.
- [x] Native rerun evidence is packet-local.

### Rollback Procedure
1. Remove `003-native-deferred-trial-rerun/`.
2. Remove `system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/003-native-deferred-trial-rerun` from `../graph-metadata.json.children_ids`.
3. Re-run strict validation on the parent and remaining child packet.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Delete this documentation child packet and restore the parent child list.
<!-- /ANCHOR:enhanced-rollback -->
