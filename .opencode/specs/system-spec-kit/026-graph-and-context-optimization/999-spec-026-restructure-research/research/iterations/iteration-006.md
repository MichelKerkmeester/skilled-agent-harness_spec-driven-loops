I'm in read-only mode per the research iteration constraints. I'll output the iteration-006.md content below, which should be written to the specified path. The JSONL append will also need to be handled separately.

---

# Iteration 006 — Track 1 (packet inventory) — 026/014 + 026/015 classification

**Date:** 2026-05-15
**Track:** 1 (packet inventory)
**Focus:** Classify `014-local-llama-cpp` (phase parent — top-level only) and `015-global-security-sweep-and-supply-chain-audit` (single packet)

---

## 014-local-llama-cpp (phase parent)

### Overall arc

014 is a phase parent for "Local embeddings Setup A — EmbeddingGemma-300m for code, EmbeddingGemma-300m for memory". The spec.md closing summary (lines 72-73) states:

> "Setup A began as a Voyage-to-local embeddings migration and concludes with `EMBEDDINGS_PROVIDER=auto` cascading Voyage -> OpenAI -> llama-cpp (when GGUF runtime is installed) -> hf-local, plus CocoIndex on local EmbeddingGemma."

The arc is coherent: it tracks a multi-phase migration from Voyage embeddings to a local-first embedding stack with automatic provider selection. The nested children span infrastructure (prefix registry, model installation, MCP config), quality work (bge-m3 hybrid evaluation, retrieval quality probes), and documentation alignment (README refresh, SKILL.md realignment).

However, there is a **naming incoherence**: the folder is named `014-local-llama-cpp` but the spec title is "Local embeddings Setup A — EmbeddingGemma-300m for code, EmbeddingGemma-300m for memory" and the description.json (line 4) describes it as "Llama-cpp embedding worker deep-dive: confirm contextSize 512 hypothesis and apply minimal fix". This appears to be legacy naming from an earlier scope that expanded into the broader Setup A phased decomposition.

### Nested children list

From graph-metadata.json lines 6-37, 014 has 23 nested children:

1. 001-prefix-registry-architecture/
2. 002-model-installation-and-compat/
3. 003-mcp-config-rollout/
4. 004-vec-store-rebuild/
5. 005-q4-quantization/
6. 006-bge-m3-hybrid-evaluation/
7. 007-voyage-cleanup-and-egress-monitoring/
8. 008-finalize-and-commit/
9. 009-cocoindex-ipc-fix/
10. 010-cocoindex-code-only-patterns/
11. 011-embeddinggemma-unification/
12. 012-v3-remediation/
13. 013-v4-cleanup/
14. 014-onnx-cross-platform-backend/
15. 015-node-llama-cpp-evaluation/
16. 016-llama-cpp-retrieval-quality-probe/
17. 017-llama-cpp-default-flip/
18. 018-llama-cpp-auto-migration/
19. 019-readme-resource-map/
20. 020-catalog-playbook-alignment-audit/
21. 021-local-llm-legacy-review/
22. 022-local-llm-legacy-remediation/
23. 037-llama-cpp-embedding-worker-deep-dive/
24. 038-embedding-error-propagation/
25. 039-token-aware-chunking/
26. 041-llama-cpp-metal-investigation/
27. 049-substrate-stress-coverage/
28. 050-all-skills-alignment-sweep/
29. 051-runtime-config-mk-code-index-parity-plus-findings/
30. 052-mk-spec-memory-rename/
31. 053-mk-spec-memory-rename-remediation/

Note: The prompt mentions 056-059 arc (root README refresh, SKILL.md realignment, cli-devin deep-loop alignment), but these are not present in graph-metadata.json's children_ids array. Either they are planned but not yet created, or they exist under a different parent.

### Coherence assessment

The 056-059 arc mentioned in the prompt (root README refresh, SKILL.md realignment, cli-devin deep-loop alignment) would fit under 014's "documentation and tooling alignment" theme alongside 019 (readme-resource-map), 020 (catalog-playbook-alignment-audit), and 050 (all-skills-alignment-sweep). The phase parent is load-bearing for the local embeddings migration work and is the MOST ACTIVE phase parent per the prompt.

**Classification:** Load-bearing phase parent with naming incoherence (folder name `local-llama-cpp` vs spec title "Local embeddings Setup A").

---

## 015-global-security-sweep-and-supply-chain-audit (single packet)

### Scope

015 is a Level 1 single packet (not a phase parent) triggered by the 2026-05-15 TanStack Mini Shai-Hulud npm worm disclosure. Spec.md lines 62-76 describe the scope:

- 25-iteration deep-research security audit (20 cli-devin SWE-1.6 primary + 5 cli-opencode deepseek-v4-pro verification)
- Covers 19 distinct security dimensions: TanStack IOCs, credential exposure, supply-chain (npm/pip/cargo/uv/brew), postinstall scripts, persistence mechanisms (LaunchAgents, systemd, cron, shell startup, git hooks), PATH integrity, MCP server allowlist, auth state files, GitHub state, workspace trust, external MCP transports, suspicious commit patterns, CI/CD workflows, external plugins/skills/agents, network exposure
- Output: severity-ranked findings + remediation playbook in `research/review-report.md`

### Status

Graph-metadata.json line 36 shows status as "planned", but implementation-summary.md lines 52-56 show:

- **Completed:** 2026-05-15
- **Verdict:** COMPROMISE-CONFIRMED (host) / CLEAN (repo)
- **completion_pct:** 100 (implementation-summary.md line 29)

Implementation-summary.md lines 63-72 detail the campaign output:
- 25 iterations completed
- 3 CRITICAL + 9 HIGH + 10 MEDIUM + 6 LOW + 7+ INFO findings
- 15-step remediation playbook authored
- Partial remediation applied (MCP supply-chain pins)

The graph-metadata.json status is stale; 015 is **complete**.

### Classification

**Classification:** Completed single packet, load-bearing (security audit with critical findings). No merge candidates (unique scope triggered by external security event). Should remain as-is for audit trail.

---

## Merge candidates

**None.** 014 and 015 have disjoint scopes:
- 014: Local embeddings migration (infrastructure + quality work)
- 015: Security audit triggered by external supply-chain event

---

## Delete or load-bearing

**014-local-llama-cpp:** Load-bearing phase parent. Hosts the completed local embeddings migration work (phases 001-022) plus ongoing deep-loop alignment work (037-039, 049-053). The naming incoherence should be addressed (folder rename to match spec title), but the packet structure is sound.

**015-global-security-sweep-and-supply-chain-audit:** Load-bearing completed packet. Critical security audit with COMPROMISE-CONFIRMED host verdict. Must remain for audit trail and remediation reference.

---

## Evidence citations

- 014 spec.md lines 2-4: title and description
- 014 spec.md lines 72-73: closing summary of Setup A arc
- 014 description.json line 4: description mismatch with spec title
- 014 graph-metadata.json lines 6-37: nested children list (23 children)
- 014 graph-metadata.json line 68: status "in-progress"
- 014 graph-metadata.json line 69: last_active_child_id "052-mk-spec-memory-rename"
- 015 spec.md lines 62-76: problem statement, purpose, scope
- 015 spec.md lines 174-202: 25-iteration plan
- 015 graph-metadata.json line 36: status "planned" (stale)
- 015 implementation-summary.md lines 52-56: completed 2026-05-15, verdict COMPROMISE-CONFIRMED/CLEAN
- 015 implementation-summary.md lines 63-72: campaign output summary
- 015 implementation-summary.md line 29: completion_pct 100

---

**Required file writes (pending write access):**
1. Write above content to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-006.md`
2. Append row to `research/deep-research-state.jsonl`: `{"track":1,"iter_id":"006","timestamp":"2026-05-15T22:38:00Z","packets":["014","015"],"classification":{"014":"load-bearing-phase-parent","015":"load-bearing-completed"}}`
