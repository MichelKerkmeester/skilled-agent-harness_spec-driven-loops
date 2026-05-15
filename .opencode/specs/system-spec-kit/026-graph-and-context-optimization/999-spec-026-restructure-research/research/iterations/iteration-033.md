I'll produce the iteration-033.md output as required by the task contract. Due to read-only constraints, I'll present the content here rather than writing to disk.

---

# Iter 033 — Track 8: top-N rename proposals

## Question / Evidence / Findings

### Research Question
From the severe-mismatch list:
1. Top-N highest-priority renames (ranked by recall impact)?
2. Final name per rename?
3. Conservation: does the new name preserve enough of the old for search continuity?

### Evidence Sources
- Iter 031: Top-level naming audit (5 mismatches: 1 severe, 4 mild)
- Iter 032: Nested-child naming audit (3 mild mismatches)
- Spec files for each mismatched packet
- Implementation summaries where available

### Top-N renames (ranked)

| Rank | Old name | New name | Recall impact | Conservation note |
|------|----------|----------|----------------|-------------------|
| 1 | `014-local-llama-cpp` | `014-local-embeddings-setup-a` | **High** - The current name suggests a narrow llama-cpp investigation, but the actual work is a multi-provider embeddings migration (Voyage → OpenAI → llama-cpp → hf-local). Operators searching for "embeddings setup" or "local embeddings" would miss this packet. The new name preserves "local" (key concept) and adds "embeddings-setup-a" (matches spec title exactly). | **Good** - Retains "local" and the numeric prefix. Adds "embeddings" which is the actual domain. The "setup-a" suffix matches the spec title verbatim, ensuring alignment with documentation. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/spec.md" lines="2-4, 72-73" /> |
| 2 | `015-global-security-sweep-and-supply-chain-audit` | `015-tanstack-security-audit` | **Medium-High** - The current name is overly verbose (31 chars) and doesn't surface the triggering event (TanStack Mini Shai-Hulud disclosure). Operators searching for "TanStack security" or "Shai Hulud" would miss this packet. The new name is 50% shorter and surfaces the primary context. | **Good** - Retains "security-audit" (core work) and numeric prefix. Adds "tanstack" which is the primary search term for operators responding to the 2026-05-15 disclosure. The "global-sweep" and "supply-chain" aspects are preserved in the spec body. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-global-security-sweep-and-supply-chain-audit/spec.md" lines="1-4, 62-76" /> |
| 3 | `006-graph-impact-and-affordance-uplift` | `006-external-project-adoption` | **Medium** - The current name is abstract ("impact and affordance uplift") and doesn't surface the actual work: External Project research adoption. Operators searching for "external project" or "pt-01 pt-02" would miss this packet. The new name directly surfaces the domain. | **Fair** - Loses "graph" which might be a search term, but the current name is misleading (sounds like performance optimization). The new name is semantically accurate. Operators searching for "graph" would find this via the parent 026 context or spec content. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-graph-impact-and-affordance-uplift/spec.md" lines="1-4, 48-52, 65" /> |
| 4 | `002-resource-map-template` | `002-resource-map-and-deep-loop-fix` | **Medium** - The current name focuses only on Phase 002 (template creation), missing Phase 001 (reverse parent folder restoration) and Phase 003 (deep-loop integration). Operators searching for "deep-loop" or "reverse parent" would miss this packet. The new name captures the full scope. | **Good** - Retains "resource-map" (core concept) and numeric prefix. Adds "deep-loop-fix" which is the primary architectural change. The "template" aspect is preserved in the spec body. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/spec.md" lines="1-4, 46-48, 86-88" /> |

### Mild mismatches (deferred)

The following mild mismatches are deferred to lower priority due to verbosity-only issues (semantic accuracy is preserved):

| Packet | Current name | Proposed name | Reason for deferral |
|--------|--------------|---------------|-------------------|
| 004 | `004-runtime-executor-hardening` | `004-runtime-consolidation-wrapper` | Merge candidate per iter 002; naming moot if consolidated into 003 |
| 013-003 | `003-rm8-013-remediation-doc-honesty-security` | `003-rm8-013-remediation` | Verbosity-only; semantically accurate. Low recall impact. |
| 007-010 | `010-fix-iteration-quality-meta-research` | `010-fix-iteration-quality` | Verbosity-only; semantically accurate. Low recall impact. |
| 007-011 | `011-broader-scope-excludes-and-granular-skills` | `011-scope-excludes-and-skills` | Verbosity-only; semantically accurate. Low recall impact. |

### Ranking rationale

**Rank 1 (014)**: Severe semantic mismatch. The name suggests a narrow technical investigation (llama-cpp) but the work is a broad multi-provider embeddings migration. High recall impact because "embeddings" is a primary search domain, and the current name completely obscures this.

**Rank 2 (015)**: Mild severity but high recall impact due to missing triggering event context. The TanStack disclosure is time-sensitive and operators would search for "TanStack security" specifically. The current name is also unwieldy (31 chars).

**Rank 3 (006)**: Mild severity with medium recall impact. The current name is abstract and misleading (sounds like performance optimization). Operators searching for "external project" (the actual domain) would miss this packet.

**Rank 4 (002)**: Mild severity with medium recall impact. The current name captures only 1 of 3 phases. Operators searching for "deep-loop" (the primary architectural change) would miss this packet.

## Gaps / JSONL delta row

### Gaps for next iteration
- Need to verify that the proposed names don't conflict with existing packet names in the broader codebase
- Should assess whether the renaming would break external references (e.g., in other specs, documentation, or tooling)
- Need to confirm the naming convention for suffixes (e.g., "-setup-a" vs "-setup") before finalizing 014's new name

### JSONL delta row

```json
{"iter_id": "033", "timestamp_utc": "2026-05-15T21:17:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 8, "status": "complete", "top_n_renames": 4, "severe_mismatches": 1, "mild_mismatches_deferred": 4, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-031.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-032.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-global-security-sweep-and-supply-chain-audit/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-graph-impact-and-affordance-uplift/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/spec.md"]}
```
