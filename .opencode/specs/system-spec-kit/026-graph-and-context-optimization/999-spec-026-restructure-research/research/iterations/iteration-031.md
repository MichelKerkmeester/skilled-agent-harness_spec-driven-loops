I'm in read-only mode per the research iteration constraints. Here is the iteration-031.md content that should be written to the specified path:

---

# Iter 031 — Track 8: top-level naming audit

## Question / Evidence / Findings

### Research Question
For each top-level 026 child:
1. Does the current name match the actual delivered work?
2. Severity of mismatch?
3. Proposed better name?

### Evidence Sources
- Iterations 001-006 classification outputs (top-level packet inventory)
- spec.md files for each top-level 026 child
- implementation-summary.md files for single implementation packets
- Folder names vs spec titles and delivered work descriptions

### Mismatches

| Packet | Current name | Delivered work | Severity | Proposed name |
|--------|--------------|----------------|----------|---------------|
| 014 | `014-local-llama-cpp` | **Local embeddings Setup A — EmbeddingGemma-300m for code, EmbeddingGemma-300m for memory**. Phase parent for 23 children covering prefix registry architecture, model installation, MCP config rollout, vec-store rebuild, quantization, bge-m3 hybrid evaluation, Voyage cleanup, CocoIndex IPC fixes, code-only pattern cleanup, EmbeddingGemma unification, v3 remediation, embedding worker deep-dive, error propagation, token-aware chunking, and deep-loop alignment. The spec title explicitly states "Local embeddings Setup A" and the closing summary describes the arc as "Voyage-to-local embeddings migration" concluding with `EMBEDDINGS_PROVIDER=auto` cascading Voyage → OpenAI → llama-cpp → hf-local. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/spec.md" lines="2-4, 72-73" /> | **Severe** - Folder name focuses only on llama-cpp (one backend among many), but the actual work is a multi-provider embeddings migration with Voyage, OpenAI, llama-cpp, and hf-local. The name "local-llama-cpp" suggests a narrow llama-cpp investigation, not a broad embeddings Setup A with 23 phases across multiple backends. | `014-local-embeddings-setup-a` |
| 015 | `015-global-security-sweep-and-supply-chain-audit` | **TanStack Mini Shai-Hulud npm worm response audit**. Single implementation packet triggered by the 2026-05-15 TanStack disclosure. Delivered a 25-iteration deep-research security audit covering 19 dimensions: TanStack IOCs, credential exposure, supply-chain (npm/pip/cargo/uv/brew), postinstall scripts, persistence mechanisms, PATH integrity, MCP server allowlist, auth state files, GitHub state, workspace trust, external MCP transports, suspicious commit patterns, CI/CD workflows, external plugins/skills/agents, network exposure. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-global-security-sweep-and-supply-chain-audit/spec.md" lines="1-4, 62-76" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-global-security-sweep-and-supply-chain-audit/implementation-summary.md" lines="62-72" /> | **Mild** - The name accurately describes the work (global security sweep + supply-chain audit), but it's overly verbose (31 characters) and doesn't surface the triggering event (TanStack Mini Shai-Hulud) which is the primary context for operators searching for this packet. The delivered work is specifically a response to that disclosure, not a generic global sweep. | `015-tanstack-security-audit` or `015-security-audit-shai-hulud` |
| 004 | `004-runtime-executor-hardening` | **Runtime executor hardening phase parent** with 3 children: foundational-runtime, sk-deep-cli-runtime-execution, system-hardening. However, iteration-002 classified this as a **merge candidate** due to minimal implementation evidence and consolidation artifact status. The code search for "runtime-executor|deep-cli|system-hardening" returned only 14 matches, mostly in test files and changelog entries—no substantive implementation files in the active codebase. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/spec.md" lines="1-4, 62-66" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-002.md" lines="15-26, 59-71" /> | **Mild** - The name accurately describes the intended scope, but the actual delivered work appears to be a consolidation artifact with minimal implementation evidence. The packet is a structural wrapper with thematic overlap to 003-continuity-memory-runtime, suggesting potential consolidation. The name doesn't signal that this is primarily a consolidation wrapper rather than active implementation work. | `004-runtime-consolidation-wrapper` (if kept) or merge into 003 |
| 006 | `006-graph-impact-and-affordance-uplift` | **External Project pt-01 + pt-02 adoption**. Draft status with 8 child phases (001-clean-room-license-audit through 008-deep-research-review). The spec describes implementing converged pt-01 + pt-02 External Project research recommendations as a 6-sub-phase Level 3 implementation packet. However, the code search for "phase-runner|detect-changes|affordance" returned only 10 matches, all in documentation—no actual implementation files found. This suggests the packet is planned but not yet implemented. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-graph-impact-and-affordance-uplift/spec.md" lines="1-4, 48-52, 65" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-002.md" lines="42-56, 87-96" /> | **Mild** - The name "graph-impact-and-affordance-uplift" is abstract and doesn't surface the actual work: External Project research adoption. The spec explicitly states this is about implementing "converged pt-01 + pt-02 External Project research recommendations." The current name sounds like a performance optimization ("impact and affordance uplift") rather than a research adoption packet. | `006-external-project-adoption` |
| 002 | `002-resource-map-template` | **Resource map template introduction, deep-loop integration, and reverse parent folder restoration**. Level 3 implementation packet with 3 sub-phases: 001-reverse-parent-research-review-folders, 002-resource-map-template-creation, 003-resource-map-deep-loop-integration. The spec describes introducing a lean, level-agnostic resource-map.md template that catalogs every file path a spec folder touches, restoring the local-owner deep-loop artifact contract, and wiring automatic resource-map emission into deep loops. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/spec.md" lines="1-4, 46-48, 86-88" /> | **Mild** - The name "resource-map-template" focuses only on the template creation aspect (Phase 002), but the packet also includes reverse parent folder restoration (Phase 001) and deep-loop integration (Phase 003). The name doesn't capture the full scope of the work, which is about fixing deep-loop artifact placement policy AND introducing the template. | `002-resource-map-and-deep-loop-fix` |

### Fine (no mismatch)

The following packets have names that accurately describe the delivered work:

- **000-release-cleanup** - Phase parent for release cleanup work (memory terminology, sk-code alignment, dead-code audit/pruning, review remediation). Name matches scope.
- **001-research-and-baseline** - Research coordination packet for v2 master synthesis, adoption decisions, and downstream sequencing. Name matches scope.
- **003-continuity-memory-runtime** - Phase parent for cache hooks, memory quality, continuity refactor, and memory-save rewrite. Name matches scope.
- **005-memory-indexer-invariants** - Memory indexer lineage fix and constitutional-tier index-scope invariants. Name matches scope exactly. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/spec.md" lines="1-4" />
- **007-code-graph** - Code Graph Package phase parent. Name matches scope.
- **008-skill-advisor** - Skill Advisor system phase parent. Name matches scope.
- **009-hook-parity** - Hook parity phase parent for runtime hook parity across Claude/Codex/Copilot/OpenCode. Name matches scope.
- **010-template-levels** - Template system rework phase parent. Name matches scope.
- **011-cocoindex-daemon-resilience** - CocoIndex daemon resilience with 7-patch defense-in-depth. Name matches scope exactly. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-cocoindex-daemon-resilience/spec.md" lines="1-4" />
- **012-causal-graph-channel-routing** - Causal graph channel routing utilization phase parent. Name matches scope.
- **013-doctor-update-orchestrator** - Doctor update orchestrator phase parent. Name matches scope.

## Gaps / JSONL delta row

### Gaps for next iteration
- Need to examine the actual implementation evidence for 004-runtime-executor-hardening's 3 child phases to confirm whether this is truly a consolidation artifact or has substantive delivered work.
- Should verify whether 006-graph-impact-and-affordance-uplift has any implementation artifacts beyond documentation, or if it remains in draft state.
- Need to assess whether the proposed name changes would break external references (e.g., in other specs, documentation, or tooling).

### JSONL delta row

```json
{"iter_id": "031", "timestamp_utc": "2026-05-15T21:15:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 8, "status": "complete", "findings_count": 5, "gaps_count": 3, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-global-security-sweep-and-supply-chain-audit/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-global-security-sweep-and-supply-chain-audit/implementation-summary.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-graph-impact-and-affordance-uplift/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/spec.md"]}
```

---

**Summary:** Found 5 naming mismatches among top-level 026 children:
- **1 severe**: 014-local-llama-cpp (name focuses on one backend, but work is multi-provider embeddings Setup A)
- **4 mild**: 015 (overly verbose, misses triggering event), 004 (doesn't signal consolidation artifact status), 006 (abstract name doesn't surface External Project adoption), 002 (name focuses only on template, missing deep-loop fix scope)

The remaining 11 packets have names that accurately describe their delivered work.
