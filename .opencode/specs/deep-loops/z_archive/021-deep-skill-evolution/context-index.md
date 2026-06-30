---
title: "Context Index: deep-skill evolution arc"
description: "Migration bridge for the 116 nested phase parent: 2026-05-26 reorganization to 7 thematic clusters + 2026-05-28 system-spec-kit/030 to 007 cross-track migration (8th cluster), plus the original source-packet lineage relocated out of spec.md."
trigger_phrases:
  - "116 context index"
  - "deep skill evolution reorganization"
  - "001-ai-council rename"
  - "deep-stack cross-cutting fold"
  - "deep skill arc source packets"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "authored reorganization + source-lineage bridge"
    next_safe_action: "use as navigation bridge during resume"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:6530dd6774882cb05536bd2169c3f8efac7064e10a10195b8dcc4b5764ea6f50"
      session_id: "116-context-index"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Context Index: deep-skill evolution arc

<!-- SPECKIT_TEMPLATE_SOURCE: context-index | v1.0 -->

---

## WHEN TO USE THIS FILE

This phase parent was reorganized on 2026-05-26 (cluster rename, thin-cluster fold, orphan/scratch cleanup) and gained an 8th cluster on 2026-05-28 (the `system-spec-kit/030 → 007-deep-stack-playbook-validation` cross-track migration). Use this file to resolve an old cluster path to its new home and to see the original source-packet lineage. For an exhaustive leaf-by-leaf path map use `merged-phase-map.md`. Detailed rationale lives in each leaf's own docs.

---

<!-- ANCHOR:migration-bridge -->
## Migration Bridge (2026-05-26 reorganization)

| Original Phase | New Home | Status | Notes |
|----------------|----------|--------|-------|
| `001-ai-council/` | `001-deep-ai-council/` | active | Renamed for `deep-` prefix consistency; all 13 leaves moved with the parent. Old packet ID kept as alias. |
| `006-deep-skills-differentiation/001-unique-value-differentiation/` | `006-deep-stack-cross-cutting/001-unique-value-differentiation/` | active | Folded into new cross-cutting cluster. |
| `007-deep-commands-relocation/` | `006-deep-stack-cross-cutting/002-commands-relocation/` | active | Heavy-doc leaf (was a cluster-rank leaf) promoted into a real leaf. |
| `008-deep-skill-doc-evolution/001-spec-and-resource-map/` | `006-deep-stack-cross-cutting/003-doc-evolution-spec-and-resource-map/` | active | Folded; gap renumber. |
| `008-deep-skill-doc-evolution/009-deep-research-gap-backstop/` | `006-deep-stack-cross-cutting/004-doc-evolution-research-gap-backstop/` | active | Folded; gap renumber (009→004). |
| `008-deep-skill-doc-evolution/010-post-impl-deep-review/` | `006-deep-stack-cross-cutting/005-doc-evolution-post-impl-deep-review/` | active | Folded; gap renumber (010→005). |
| `scratch/{115-arc-changelog,115-arc-review,116-arc-review,118-arc-review,118-009-research-workspace}/` | `z_archive/arc-workspaces/` | archive | Cross-arc workspace artifacts moved out of scratch; preserved, not deleted. |
| `000-release-cleanup/.opencode/` (advisor-state) | (removed) | replaced | Stray untracked advisor-state artifact deleted. |

The empty `006-deep-skills-differentiation/`, `007-deep-commands-relocation/`, and `008-deep-skill-doc-evolution/` cluster wrappers were removed after their leaves moved; old packet IDs are preserved in the new folders' `graph-metadata.json` (`manual.supersedes`) and `description.json` (`memoryNameHistory`).
<!-- /ANCHOR:migration-bridge -->

---

<!-- ANCHOR:cross-track-migration -->
## Cross-Track Migration (2026-05-28)

| Original Phase | New Home | Status | Notes |
|----------------|----------|--------|-------|
| `system-spec-kit/030-deep-loop-skills-playbook-validation/` (10 leaves) | `007-deep-stack-playbook-validation/` | complete | Relocated out of the `system-spec-kit` track into 116 as a new cross-cutting **playbook-validation** cluster. Self-contained phase parent (children 001–010) moved intact via `git mv`; all `packet_pointer`s, `graph-metadata.json`/`description.json` identity fields, and authored-doc references rewritten to the new path. Original lineage: followed "Code Graph Playbook Validation" (was system-spec-kit/029, now `system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening`). Deliverable: 177/177 PASS → verdict READY. Leaf-by-leaf old→new paths in `merged-phase-map.md`. |
<!-- /ANCHOR:cross-track-migration -->

---

<!-- ANCHOR:source-lineage -->
## Source-Packet Lineage (original arc)

The clusters consolidated work that began as independently-created packets in the 115–130 range plus later follow-ons. Best-effort lineage:

| Source packet | Cluster | Leaf range |
|---------------|---------|------------|
| 115 deep-ai-council-rename (6 subphases) | `001-deep-ai-council/` | 001–006 |
| 124 sk-ai-council shared-runtime-deliberation | `001-deep-ai-council/` | 007 |
| 129 deep-ai-council iterative-multi-topic (6 subphases) | `001-deep-ai-council/` | 008–013 |
| 116 deep-review complexity (8 subphases) | `002-deep-review/` | 001–008 |
| 117 deep-loop core-isolation-deliberation | `003-deep-loop-runtime/` | 001 |
| 118 deep-loop full-isolation-no-mcp (8 subphases) + later CLI-migration/closeout | `003-deep-loop-runtime/` | 002–011 |
| 119 deep-research uplift (3 subphases) | `004-deep-research/` | 001–003 |
| 120 deep-research iteration-ordering-fix | `004-deep-research/` | 004 |
| 121 deep-research uncovered-questions | `004-deep-research/` | 005 |
| 122 deep-research hygiene-fix-pack | `004-deep-research/` | 006 |
| 123 deep-agent-improvement uplift (3 subphases) | `005-deep-agent-improvement/` | 001–003 |
| 124–128 deep-agent-improvement correctness → mixed-executor + later command-surface relocation | `005-deep-agent-improvement/` | 004–009 |
| 130 deep-skills unique-value-differentiation | `006-deep-stack-cross-cutting/` | 001 |
| deep-* commands relocation | `006-deep-stack-cross-cutting/` | 002 |
| deep-* skill documentation evolution | `006-deep-stack-cross-cutting/` | 003–005 |
| deep-* per-skill release cleanup | `000-release-cleanup/` | 15 flat specs (flattened 2026-05-26; see `000-release-cleanup/context-index.md`) |
| 030 deep-loop-skills-playbook-validation (system-spec-kit track; relocated 2026-05-28) | `007-deep-stack-playbook-validation/` | 001–010 |

> Clusters 003 and 005 gained later leaves beyond the original packet count; the `000-release-cleanup` meta-cluster and the cross-cutting documentation/command work were added after the initial arc.
<!-- /ANCHOR:source-lineage -->
