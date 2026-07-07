---
title: "Implementation Summary: Substrate Code-Graph scenario tool-contract fix"
description: "Corrected the 403/404/407 substrate playbooks to call code_graph_context({input, queryMode}) — the verified semantic tool — instead of the rejected code_graph_query({query, num_results}). Authoritative schema read in system-code-graph after two false-file starts. Live 2nd-daemon harness wiring stays deferred."
trigger_phrases:
  - "substrate code-graph tool-contract summary"
  - "code_graph_context playbook fix summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/008-code-graph-scatter/003-substrate-codegraph-scenarios"
    last_updated_at: "2026-05-30T23:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixed 403/404/407 tool contract; verified no regression"
    next_safe_action: "Commit; proceed to child 003"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/403-code-intent-matching.md"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/404-disambiguation-under-context.md"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/407-adversarial-near-miss.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003614"
      session_id: "036-002-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The code-graph tools are defined in system-code-graph/mcp_server/tool-schemas.ts, NOT system-spec-kit's tool-schemas.js (which has only memory_* tools; its code_graph mentions are prose). Verifying the right file was the crux."
---
# Implementation Summary: Substrate Code-Graph scenario tool-contract fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-substrate-codegraph-scenarios |
| **Completed** | 2026-05-30 (contract fix; live-daemon wiring deferred) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three substrate playbooks now call the Code-Graph tool with a schema-valid payload. Before, 403/404/407 called `mcp__mk_code_index__code_graph_query({query, num_results})` — and that tool is structural, requiring `operation` + `subject` with `additionalProperties:false`, so `query`/`num_results` are rejected (unknown keys + missing required).

### Getting the schema right was the actual work
This took two false starts I want to be honest about. First I trusted a swarm claim citing `dist/tool-schemas.js` in system-spec-kit; then I "disproved" it citing a handler path that doesn't exist. Both were wrong because the code-graph tools are not in the system-spec-kit memory server at all — that file's only `code_graph_query` mentions are prose inside memory-tool descriptions. The authoritative definitions live in `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts`:
- `code_graph_query`: `required: ['operation', 'subject']`, `additionalProperties: false`, structural operations (outline, calls_from/to, imports_from/to, blast_radius). The swarm's original "needs operation/subject" was correct.
- `code_graph_context`: `required: []`, props `{input, queryMode (enum: neighborhood/outline/impact, default neighborhood), subject, seeds, budgetTokens, profile}` — the semantic surface.

### The fix
403/404/407 are semantic-ranking scenarios ("rank the implementation above the doc", "disambiguate by context", "the semantically-correct file outranks the lexical decoy"), so the right tool is `code_graph_context`. All 10 call sites (403:4 + prose ref, 404:3, 407:3) were rewritten to `code_graph_context({input, queryMode: "neighborhood"})`, query text preserved verbatim. 410 (memory latency, `memory_search`) left untouched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `manual_testing_playbook/24--local-llm-query-intelligence/403-code-intent-matching.md` | Modified | 4 calls + prose ref → code_graph_context |
| `manual_testing_playbook/24--local-llm-query-intelligence/404-disambiguation-under-context.md` | Modified | 3 calls → code_graph_context |
| `manual_testing_playbook/24--local-llm-query-intelligence/407-adversarial-near-miss.md` | Modified | 3 calls → code_graph_context |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Schema-first, after the false starts: located the authoritative `tool-schemas.ts` in system-code-graph and read both tool definitions by `name:` anchor before any edit. The playbook edits were uniform-prefix replacements (tool name, `query:`→`input:`, `num_results:`→`queryMode: "neighborhood"`), verified by grep counts (10 context calls, 0 residual). A substrate run confirmed no regression: 403/404/407 SKIP identically before and after, because the runner wires no Code-Graph client.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read the authoritative schema before acting | Two prior claims (mine and the swarm's framing) cited the wrong file/handler; only system-code-graph's tool-schemas.ts is authoritative |
| Use code_graph_context, not code_graph_query | The scenarios test semantic ranking; context is the semantic tool (required:[], input+queryMode); query is structural (operation/subject) |
| queryMode: "neighborhood" | The schema default; the scenarios rank returned context, which neighborhood mode provides |
| Defer the live 2nd-daemon harness wiring | Cold tsc-build timeout, sun_path socket limit, and two-process flake — a flaky infra test is worse than none |
| Reword REQ-002/SC-002 to the truth | The substrate vitest is red in this env from the pre-existing runner:mk-spec-memory connection failure (SQ1) + consequent 410 SKIP, unrelated to and unaffected by these doc edits |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Authoritative schema located + read | PASS — system-code-graph/mcp_server/tool-schemas.ts; query=structural, context=semantic |
| 403/404/407 rewritten | PASS — 10 code_graph_context calls; 0 residual query:/num_results:/code_graph_query |
| 410 untouched | PASS — still memory_search |
| No regression | PASS — 403/404/407 SKIP before AND after |
| substrate vitest overall | RED — from pre-existing `runner:mk-spec-memory` connection FAIL + 410 SKIP (SQ1), not these edits; doc edits cannot affect memory-daemon connection |
| Packet strict-validate | PASS (to confirm at commit gate) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scenarios still SKIP in the automated harness.** The substrate runner wires only the memory daemon, so 403/404/407 SKIP on Code-Graph-client-unavailable — unchanged by this fix. Making them execute for real needs a second live Code-Graph daemon in the harness, which is deferred (cold-build timeout + sun_path + two-process flake).
2. **The substrate vitest is currently red in this environment** for an unrelated, pre-existing reason: `runner:mk-spec-memory` fails to connect and 410 consequently SKIPs (the SQ1 connection-diagnostic condition from packet 032). This fix neither caused nor resolves it.
3. **Not executed against a live Code-Graph daemon.** The payload validity is verified against the tool schema, not by a live call (no daemon wired here). queryMode "neighborhood" is the schema default; a future live run may tune per-scenario mode.
<!-- /ANCHOR:limitations -->
