

---
title: "Changelog: Substrate Code-Graph scenario tool-contract fix [015-infra-followup-hardening/002-substrate-codegraph-scenarios]"
description: "Three substrate playbooks called code_graph_query(query, num_results) which was always rejected because that tool requires operation+subject. Corrected to code_graph_context(input, queryMode: neighborhood)."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/002-substrate-codegraph-scenarios` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening`

### Summary

Three substrate playbooks called code_graph_query(query, num_results), which was always rejected because that tool is structural (requires operation and subject fields with additionalProperties:false). The query and num_results parameters were unknown to that tool and the required fields were missing. The playbooks are semantic-ranking scenarios, so they now call code_graph_context(input, queryMode: neighborhood) instead, which accepts the payload they send.

### Added

- None.

### Changed

- Playbook 403 makes 4 semantic-ranking calls to code_graph_context instead of the rejected code_graph_query.
- Playbook 404 makes 3 semantic-ranking calls to code_graph_context instead of the rejected code_graph_query.
- Playbook 407 makes 3 semantic-ranking calls to code_graph_context instead of the rejected code_graph_query.

### Fixed

- Tool contract corrected: code_graph_query (structural, operation+subject required) replaced with code_graph_context (semantic, input+queryMode accepted) across all affected call sites.
- Authoritative schema read from system-code-graph after two incorrect file claims. The code-graph tools live in system-code-graph/mcp_server/tool-schemas.ts, not in system-spec-kit.

### Verification

- Authoritative schema located and read from system-code-graph/mcp_server/tool-schemas.ts. code_graph_query is structural (operation+subject required). code_graph_context is semantic (input+queryMode accepted). PASS
- 10 code_graph_context calls written across 403, 404, 407. Zero residual code_graph_query, query, or num_results references. PASS
- Playbook 410 verified unaffected and still calls memory_search. PASS
- No regression: 403/404/407 SKIP identically before and after the edits. PASS
- Packet strict-validate PASS

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/403-code-intent-matching.md` | Modified | 4 calls and prose reference now use code_graph_context(input, queryMode: neighborhood) |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/404-disambiguation-under-context.md` | Modified | 3 calls now use code_graph_context(input, queryMode: neighborhood) |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/407-adversarial-near-miss.md` | Modified | 3 calls now use code_graph_context(input, queryMode: neighborhood) |

### Follow-Ups

- The scenarios still SKIP in the automated harness. The substrate runner wires only the memory daemon, so 403/404/407 SKIP on Code-Graph-client-unavailable. Making them execute for real requires a second live Code-Graph daemon in the harness, which is deferred (cold-build timeout, sun_path socket limit, two-process flake risk).
- The substrate vitest is red in this environment for a pre-existing unrelated reason. runner:mk-spec-memory fails to connect and 410 consequently SKIPs (the SQ1 connection-diagnostic condition from packet 032). This fix neither caused nor resolves that red state.
- Not executed against a live Code-Graph daemon. Payload validity was verified against the tool schema only. queryMode neighborhood is the schema default, a future live run may tune per-scenario mode.
