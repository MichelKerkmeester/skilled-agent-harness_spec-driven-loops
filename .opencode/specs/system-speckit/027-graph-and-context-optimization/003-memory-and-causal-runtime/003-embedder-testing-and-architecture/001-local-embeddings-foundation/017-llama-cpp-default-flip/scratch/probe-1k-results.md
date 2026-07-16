# 017 llama-cpp 1k retrieval quality probe

## Result

Verdict: **MILD_DIVERGENCE**

One-line interpretation: The 1k/100-query rerun mostly agrees but shows enough movement to treat the default flip as conditional.

## Metrics

| Metric | Value | Target |
|--------|-------|--------|
| Corpus size | 1000 | 1000 |
| Query count | 100 | 100 |
| Query strategy | approach_A | approach_A preferred |
| hf-local embedding time | 124.551654s | n/a |
| llama-cpp embedding time | 46.808793s | n/a |
| Recall@5 overlap mean | 0.926 | >= 0.80 equivalent |
| Recall@5 overlap p25 | 0.8 | diagnostic |
| Spearman rho top-10 mean | 0.816125 | >= 0.85 equivalent |
| MRR hf-local top200 | 0.976 | baseline |
| MRR llama-cpp top200 | 0.975556 | compare |
| MRR relative delta | 0.000455 | < 0.05 equivalent |

## Human Eyeball Check

The example top-5 lists expose visible rank/result movement, so the aggregate divergence should be treated as decision-relevant.

### Example 1

Query: Packet: system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/007-voyage-cleanup-and-egress-monitoring Spec Folder: system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/007-voyage-cleanup-and-egress-monitoring Status: in_progress Importance Tier: important Summary:

Target doc: 2435

Overlap@5: 1; Spearman top-10: 0.827273

hf-local top-5:

```text
1. 2435 (0.8811) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/007-
2. 2441 (0.8599) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/013-
3. 2442 (0.8437) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a
4. 2440 (0.8333) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/012-
5. 2430 (0.828) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/002-
```

llama-cpp top-5:

```text
1. 2435 (0.8402) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/007-
2. 2441 (0.8035) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/013-
3. 2442 (0.7826) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a
4. 2440 (0.772) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/012-
5. 2430 (0.7633) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/002-
```

### Example 2

Query: Spec folder: system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-memory-retention-policy-sweep Description: Spec: Memory Retention Sweep Spec id: 020 Folder slug: memory-retention-sweep Parent chain: system-spec-kit > 027-graph-and-context-optimization > 000-release-cleanup Keywords: spec, memory,

Target doc: 885

Overlap@5: 0.8; Spearman top-10: 0.699301

hf-local top-5:

```text
1. 885 (0.9348) - Description: Spec: Memory Retention Sweep
2. 584 (0.8566) - Description: Feature Specification: Memory-Indexer Storage-Boundary Remediation
3. 605 (0.846) - Description: Feature Specification: 005 Post-Program Cleanup
4. 589 (0.8457) - Description: Feature Specification: MCP Stress-Cycle Doc/Observability Cleanup
5. 1203 (0.8437) - Description: Feature Specification: 006 Architecture Cleanup Remediation
```

llama-cpp top-5:

```text
1. 885 (0.9204) - Description: Spec: Memory Retention Sweep
2. 584 (0.8077) - Description: Feature Specification: Memory-Indexer Storage-Boundary Remediation
3. 589 (0.8015) - Description: Feature Specification: MCP Stress-Cycle Doc/Observability Cleanup
4. 822 (0.7988) - Description: Spec: memory_search degradedReadiness Wiring
5. 1203 (0.7947) - Description: Feature Specification: 006 Architecture Cleanup Remediation
```

### Example 3

Query: --- template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2. 2" title: "Implementation Plan: 002 Deep-Loop Workflow State-Machine Remediation [template:level_2/plan.

Target doc: 1181

Overlap@5: 0.8; Spearman top-10: 0.727273

hf-local top-5:

```text
1. 1180 (0.8535) - Implementation Summary: 002 Deep-Loop Workflow State-Machine Remediation [template:level_2/implement
2. 1181 (0.8401) - Implementation Plan: 002 Deep-Loop Workflow State-Machine Remediation [template:level_2/plan.md]
3. 1211 (0.803) - Implementation Plan: 007 Topology And Build/Dist Boundary Remediation [template:level_2/plan.md]
4. 708 (0.7901) - Implementation Plan: MCP Runtime Improvement Deep Research [system-spec-kit/026-graph-and-context-op
5. 862 (0.7858) - Implementation Plan: Automation Self-Management Deep Research [template:level_2/plan.md]
```

llama-cpp top-5:

```text
1. 1180 (0.8043) - Implementation Summary: 002 Deep-Loop Workflow State-Machine Remediation [template:level_2/implement
2. 1181 (0.7808) - Implementation Plan: 002 Deep-Loop Workflow State-Machine Remediation [template:level_2/plan.md]
3. 1211 (0.7321) - Implementation Plan: 007 Topology And Build/Dist Boundary Remediation [template:level_2/plan.md]
4. 1178 (0.7164) - Quality Checklist: 002 Deep-Loop Workflow State-Machine Remediation [template:level_2/checklist.md]
5. 862 (0.7154) - Implementation Plan: Automation Self-Management Deep Research [template:level_2/plan.md]
```

### Example 4

Query: --- title: "... ization/007-hook-parity/005-codex-hook-parity-remediation/research/007-deep-review-remediation-pt-02/research]" description: "Synthesis of 10 iterations investigating the exact Codex CLI 0.

Target doc: 1692

Overlap@5: 0.8; Spearman top-10: 0.763636

hf-local top-5:

```text
1. 1692 (0.8431) - ...ization/007-hook-parity/005-codex-hook-parity-remediation/research/007-deep-review-remediation-pt
2. 1681 (0.7912) - ...ation/007-hook-parity/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt
3. 1691 (0.7799) - ...t/026-graph-and-context-optimization/007-hook-parity/003-codex-native-startup-advisor-hooks/implementa
4. 1678 (0.7696) - 029 - Runti [system-spec-kit/026-graph-and-context-optimization/007-hook-parity/001-hook-parity-reme
5. 1486 (0.7558) - ...ion/007-hook-parity/013-code-graph-hook-improvements/research/028-code-graph-hook-improvements-pt
```

llama-cpp top-5:

```text
1. 1692 (0.7626) - ...ization/007-hook-parity/005-codex-hook-parity-remediation/research/007-deep-review-remediation-pt
2. 1681 (0.7094) - ...ation/007-hook-parity/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt
3. 1691 (0.6883) - ...t/026-graph-and-context-optimization/007-hook-parity/003-codex-native-startup-advisor-hooks/implementa
4. 1678 (0.6878) - 029 - Runti [system-spec-kit/026-graph-and-context-optimization/007-hook-parity/001-hook-parity-reme
5. 1690 (0.6696) - Description: Feature Specification: Codex CLI Hook Parity Remediation
```

### Example 5

Query: --- # SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2. 2 title: "Implementation Plan: v1.

Target doc: 849

Overlap@5: 0.6; Spearman top-10: 0.643357

hf-local top-5:

```text
1. 1211 (0.7932) - Implementation Plan: 007 Topology And Build/Dist Boundary Remediation [template:level_2/plan.md]
2. 1236 (0.7923) - Implementation Plan: Architecture Diagrams & Topology
3. 702 (0.7911) - Implementation Plan: Search Intelligence Stress-Test Playbook [system-spec-kit/026-graph-and-context
4. 1187 (0.7899) - Implementation Plan: 003 Advisor Quality [template:level_2/plan.md]
5. 855 (0.7898) - Implementation Plan: v1.0.4 Full-Matrix Stress Test Design
```

llama-cpp top-5:

```text
1. 1211 (0.7382) - Implementation Plan: 007 Topology And Build/Dist Boundary Remediation [template:level_2/plan.md]
2. 1236 (0.7365) - Implementation Plan: Architecture Diagrams & Topology
3. 987 (0.7297) - Implementation Plan: 042 root README refresh
4. 855 (0.7264) - Implementation Plan: v1.0.4 Full-Matrix Stress Test Design
5. 178 (0.7261) - Implementation Plan: Stress-Test v1.0.3 with W3-W13 Wiring
```

