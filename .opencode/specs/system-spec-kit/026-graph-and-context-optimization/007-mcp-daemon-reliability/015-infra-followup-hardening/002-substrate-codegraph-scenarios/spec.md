---
title: "Feature Specification: Substrate Code-Graph scenario tool-contract fix"
description: "The substrate playbooks 403/404/407 called code_graph_query({query, num_results}) — rejected because that tool is structural (required: operation+subject, additionalProperties:false). Corrected them to the semantic sibling code_graph_context({input, queryMode}). The live 2nd-daemon harness wiring stays deferred as flake-prone."
trigger_phrases:
  - "substrate code-graph scenario fix"
  - "code_graph_query vs code_graph_context playbook"
  - "403 404 407 tool contract"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/002-substrate-codegraph-scenarios"
    last_updated_at: "2026-05-30T23:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Rewrote 403/404/407 to verified code_graph_context schema; substrate no-regression confirmed"
    next_safe_action: "Gate then commit; proceed to child 003"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/403-code-intent-matching.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003610"
      session_id: "036-002-spec"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Verified schema source: the code-graph tools live in system-code-graph/mcp_server/tool-schemas.ts, NOT system-spec-kit's tool-schemas.js (that file only has memory_* tools; the code_graph mentions there are prose inside descriptions)."
      - "code_graph_query IS structural (required: operation+subject) — the swarm was right; code_graph_context EXISTS and is the semantic surface (required:[], input + queryMode enum neighborhood/outline/impact)."
---
# Feature Specification: Substrate Code-Graph scenario tool-contract fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Completed (2026-05-30) — contract fix shipped; daemon-wiring deferred |
| **Created** | 2026-05-30 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening |
| **Predecessor** | system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn/001-daemon-lifecycle-healing (F3 substrate test) |
| **Successor** | None |
| **Handoff Criteria** | Playbooks call the verified tool + schema-valid payload; substrate scenarios SKIP identically before/after (no regression); the deferred daemon-wiring is documented with its reason. |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deferred goal was "make substrate scenarios 403/404/407 run for real instead of SKIP." Investigation found the playbooks call `mcp__mk_code_index__code_graph_query({query, num_results})`, which is rejected.

Verified against the authoritative source (`.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` — the code-graph tools live in the system-code-graph server, NOT in system-spec-kit's `tool-schemas.js`, whose only code-graph mentions are prose inside memory-tool descriptions):

- `code_graph_query` is STRUCTURAL: `additionalProperties: false`, `required: ['operation', 'subject']`, where `operation` ∈ {outline, calls_from, calls_to, imports_from, imports_to, blast_radius}. It has no `query` or `num_results` field, so `{query, num_results}` is rejected twice over (unknown keys + missing required).
- `code_graph_context` is the SEMANTIC sibling: `required: []`, props `{input, queryMode (enum: neighborhood/outline/impact, default neighborhood), subject, seeds, budgetTokens, profile}`.

Because 403/404/407 are explicitly semantic-ranking scenarios ("rank the implementation above the doc", "disambiguate by surrounding context", "the semantically-correct file outranks the lexical decoy"), they belong to `code_graph_context`, not the structural `code_graph_query`.

### Purpose
Correct the playbook tool calls to the verified tool + valid payload (`code_graph_context({input, queryMode})`), and honestly defer the flake-prone part (running a second live daemon in the automated harness).

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the 403/404/407 playbook tool calls from `code_graph_query({query, num_results})` to `code_graph_context({input, queryMode: "neighborhood"})` — the verified semantic tool + valid payload for their natural-language intent. Query text preserved verbatim.

### Out of Scope (deferred, with reason)
- Wiring a second live Code-Graph daemon into `run-substrate-stress-harness.mjs` so 403/404/407 execute instead of SKIP. This reintroduces the failure modes this session has been fighting: cold-build `tsc` exceeding the connect timeout (runner FAIL on a clean checkout), the unix-socket `sun_path` length limit from a deep DB dir, and real two-daemon process-lifecycle flake. Per the standing guidance that a flaky infra test is worse than none, it is left deferred. The F3 substrate test already tolerates these scenarios SKIPping when no Code-Graph daemon is connected.
- 410 (memory latency) — already correct (`memory_search`); untouched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `manual_testing_playbook/24--local-llm-query-intelligence/403-code-intent-matching.md` | Modify | 4 calls + prose ref → code_graph_context |
| `manual_testing_playbook/24--local-llm-query-intelligence/404-disambiguation-under-context.md` | Modify | 3 calls → code_graph_context |
| `manual_testing_playbook/24--local-llm-query-intelligence/407-adversarial-near-miss.md` | Modify | 3 calls → code_graph_context |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Correct tool contract | 403/404/407 call `code_graph_context` with `{input, queryMode}` — the verified schema's keys (props include `input` + `queryMode` enum neighborhood/outline/impact; `required: []`) — instead of the rejected `code_graph_query({query, num_results})`. |
| REQ-002 | No regression | The playbook edits change nothing in the automated harness outcome: 403/404/407 SKIP before AND after (no Code-Graph client is wired into the runner). The substrate vitest is independently RED in this environment because `runner:mk-spec-memory` fails to connect and 410 consequently SKIPs (the pre-existing SQ1 connection condition from packet 032) — unrelated to and unaffected by these doc-only edits. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Honest deferral documented | The reason the daemon-wiring stays deferred (flake) is recorded, so a future packet can pick it up deliberately. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A human (or a future two-daemon harness) running 403/404/407 against a live Code-Graph daemon gets a schema-valid `code_graph_context({input, queryMode})` call, not the previous `code_graph_query({query, num_results})` validation error.
- **SC-002**: No regression from these edits — 403/404/407 SKIP identically before and after. (The substrate vitest's separate `runner:mk-spec-memory` connection RED + 410 SKIP is the pre-existing SQ1 condition, tracked in 032; not in scope here.)

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Acting on an unverified schema claim | Wrong edit | Resolved by reading the authoritative tool-schemas.ts in system-code-graph before editing; an earlier draft of this very spec cited the wrong file and was corrected |
| Risk | queryMode default may not match each scenario's intent | Ranking differs | Used `neighborhood` (the schema default) uniformly; the scenarios test ranking of returned context, which neighborhood mode provides |
| Risk | Doc-only fix does not change the automated SKIP outcome | The "run for real" goal looks unmet | Documented: the run-for-real path needs the deferred 2nd daemon; the contract fix is the safe, real part |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No performance impact — doc-only change to manual playbooks.

### Security
- **NFR-S01**: No new external input.

### Reliability
- **NFR-R01**: Deliberately avoids adding a flaky live-daemon dependency to the automated suite.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- No Code-Graph daemon connected (the automated harness today): scenarios SKIP — unchanged, tolerated by the F3 test.
- Code-Graph daemon connected (manual / future): scenarios now execute a valid `code_graph_context` call instead of erroring on a rejected `code_graph_query` payload.

### Error Scenarios
- No memory daemon connected (this test environment): `runner:mk-spec-memory` FAILs and 410 SKIPs — the pre-existing SQ1 condition, independent of these edits.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | 3 markdown playbook edits |
| Risk | 4/25 | Doc-only; no daemon added; no regression |
| Research | 12/20 | Required finding the AUTHORITATIVE schema file (two false starts on the wrong file/handler) and reconciling two conflicting earlier claims |
| **Total** | **20/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The run-for-real daemon-wiring is a deliberate, documented deferral; a future packet can take it on alongside a harness clock/socket refactor if the value justifies the flake risk.

<!-- /ANCHOR:questions -->
