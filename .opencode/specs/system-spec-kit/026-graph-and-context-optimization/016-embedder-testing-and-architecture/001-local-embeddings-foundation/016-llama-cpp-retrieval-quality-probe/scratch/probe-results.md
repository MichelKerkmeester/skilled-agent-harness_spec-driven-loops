# 016 llama-cpp retrieval quality probe

## Result

Verdict: **EQUIVALENT**

One-line interpretation: Retrieval rank ordering is stable enough that the prior vector-cosine miss looks migration-only, assuming a one-time re-index.

## Metrics

| Metric | Value | Target |
|--------|-------|--------|
| Corpus size | 200 | 200 |
| Query count | 50 | 50 |
| Query strategy | approach_A | approach_A preferred |
| hf-local embedding time | 27.746219s | n/a |
| llama-cpp embedding time | 11.686622s | n/a |
| Recall@5 overlap mean | 0.912 | >= 0.80 equivalent |
| Recall@5 overlap p25 | 0.8 | diagnostic |
| Spearman rho top-10 mean | 0.865028 | >= 0.85 equivalent |
| MRR hf-local top200 | 1 | baseline |
| MRR llama-cpp top200 | 1 | compare |
| MRR relative delta | 0 | < 0.05 equivalent |

## Human Eyeball Check

The example top-5 lists show no obvious canonicality regression beyond normal rank movement.

### Example 1

Query: Packet: system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/004-synthesis-and-remediation Spec Folder: system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/004-synthesis-and-remediation Status:

Target doc: 2299

Overlap@5: 0.8; Spearman top-10: 0.951515

hf-local top-5:

```text
1. 2299 (0.8925) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-re
2. 2280 (0.8905) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-re
3. 2279 (0.8577) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-re
4. 2244 (0.8517) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/004
5. 2253 (0.8515) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/006-graph-impact-and-affordance-u
```

llama-cpp top-5:

```text
1. 2299 (0.8572) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-re
2. 2280 (0.85) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-re
3. 2279 (0.8073) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-re
4. 2228 (0.7958) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-re
5. 2244 (0.7933) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/004
```

### Example 2

Query: --- title: "Tasks: 101/004 Deep AI Council Reference Expansion" description: "Task list for deep-ai-council reference expansion, playbook coverage, SKILL. md routing, and Level 1 packet metadata.

Target doc: 479

Overlap@5: 0.8; Spearman top-10: 0.915152

hf-local top-5:

```text
1. 479 (0.8843) - Tasks: 101/004 Deep AI Council Reference Expansion
2. 491 (0.7761) - Implementation Plan: 101/004 Deep AI Council Playbook Graph Coverage
3. 2202 (0.7688) - Graph Metadata: skilled-agent-orchestration/101-deep-multi-ai-council-skill
4. 519 (0.762) - Tasks: 101/008 Council Surface Polish
5. 2198 (0.75) - Graph Metadata: skilled-agent-orchestration/101-deep-multi-ai-council-skill/005-deep-ai-council-fixu
```

llama-cpp top-5:

```text
1. 479 (0.8635) - Tasks: 101/004 Deep AI Council Reference Expansion
2. 491 (0.707) - Implementation Plan: 101/004 Deep AI Council Playbook Graph Coverage
3. 2202 (0.6959) - Graph Metadata: skilled-agent-orchestration/101-deep-multi-ai-council-skill
4. 519 (0.6862) - Tasks: 101/008 Council Surface Polish
5. 505 (0.6754) - Description: Close six residual gaps from 101/001..006: council test gate, 32-entry feature catalog,
```

### Example 3

Query: --- title: "Implementation Summary: Live Handler Envelope Capture Seam" template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2. 2" description: "Created the live handleMemorySearch envelope/audit behavioral test that closes the deterministic capture seam for v1.

Target doc: 811

Overlap@5: 1; Spearman top-10: 0.9

hf-local top-5:

```text
1. 811 (0.8832) - Implementation Summary: Live Handler Envelope Capture Seam
2. 812 (0.858) - Implementation Plan: Live Handler Envelope Capture Seam
3. 816 (0.776) - Tasks: Live Handler Envelope Capture Seam
4. 1013 (0.7231) - Implementation Summary: Memory Data Integrity Audit
5. 826 (0.7176) - Spec: memory_search degradedReadiness Wiring
```

llama-cpp top-5:

```text
1. 811 (0.8523) - Implementation Summary: Live Handler Envelope Capture Seam
2. 812 (0.8178) - Implementation Plan: Live Handler Envelope Capture Seam
3. 816 (0.7194) - Tasks: Live Handler Envelope Capture Seam
4. 1013 (0.6368) - Implementation Summary: Memory Data Integrity Audit
5. 826 (0.6263) - Spec: memory_search degradedReadiness Wiring
```

### Example 4

Query: --- title: "Implementation Plan: Stress Test Folder Completion" template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2. 2" description: "Plan for content-based stress-test discovery, subsystem moves, config updates, docs refresh, and verification.

Target doc: 959

Overlap@5: 0.8; Spearman top-10: 0.866667

hf-local top-5:

```text
1. 959 (0.8988) - Implementation Plan: Stress Test Folder Completion
2. 1116 (0.7803) - Implementation Plan: 052 Stress Test Expansion and Alignment
3. 1199 (0.7769) - Implementation Plan: 005 Resource Leaks And Silent Errors Remediation [template:level_2/plan.md]
4. 1136 (0.7589) - Plan: Stress-Test Coverage Audit and Run
5. 802 (0.7549) - Feature Specification: Stress-Test v1.0.3 with W3-W13 Wiring
```

llama-cpp top-5:

```text
1. 959 (0.8682) - Implementation Plan: Stress Test Folder Completion
2. 1116 (0.7142) - Implementation Plan: 052 Stress Test Expansion and Alignment
3. 1199 (0.7103) - Implementation Plan: 005 Resource Leaks And Silent Errors Remediation [template:level_2/plan.md]
4. 1136 (0.6842) - Plan: Stress-Test Coverage Audit and Run
5. 935 (0.6833) - Implementation Plan: 037/004 sk-doc Template Alignment
```

### Example 5

Query: Packet: system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-followup-quality-pass/005-stress-test-folder-migration Spec Folder:

Target doc: 2278

Overlap@5: 0.8; Spearman top-10: 0.909091

hf-local top-5:

```text
1. 2278 (0.8668) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-re
2. 2299 (0.8515) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-re
3. 2280 (0.8508) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-re
4. 2253 (0.8436) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/006-graph-impact-and-affordance-u
5. 2309 (0.8409) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-re
```

llama-cpp top-5:

```text
1. 2278 (0.8249) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-re
2. 2299 (0.7995) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-re
3. 2280 (0.7964) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-re
4. 2244 (0.7916) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/004
5. 2253 (0.7875) - Graph Metadata: system-spec-kit/026-graph-and-context-optimization/006-graph-impact-and-affordance-u
```

