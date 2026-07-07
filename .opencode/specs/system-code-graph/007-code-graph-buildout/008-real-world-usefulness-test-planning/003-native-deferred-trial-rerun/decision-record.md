---
title: "Decision Record: Native Rerun of Deferred Usefulness Cells"
description: "ADRs for treating the code graph native failure as a product finding and recommending an interim workflow."
trigger_phrases:
  - "native rerun usefulness"
  - "026/007/012/002"
  - "code graph scope policy failure"
importance_tier: "important"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/008-real-world-usefulness-test-planning/003-native-deferred-trial-rerun"
    last_updated_at: "2026-05-06T04:47:44.000Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Recorded native rerun decisions"
    next_safe_action: "Fix code graph P0 backlog or run separate live-runtime campaign"
    blockers:
      - "Code graph native scope policy and parser failures remain unresolved"
      - "Plugin/runtime integration still needs a separate authenticated live-runtime campaign"
    key_files:
      - "decision-record.md"
      - "synthesis-report-native-rerun.md"
    session_dedup:
      fingerprint: "sha256:b8573afd98812522094e9f5aa54f5d37d81833610eaaa1bd3f99e41c397950d4"
      session_id: "026-007-012-003-native-deferred-trial-rerun"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which live-runtime campaign should validate plugin/runtime integration next?"
    answered_questions:
      - "Code graph scope-policy failure is a real product finding."
      - "Recommended interim workflow is lexical search plus targeted direct reads, with advisor/hooks retained."
---
# Decision Record: Native Rerun of Deferred Usefulness Cells

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Treat Code Graph Scope-Policy Failure as a Product Finding

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-06 |
| **Deciders** | User, Codex |

### Context

The sandbox campaign classified code graph as useful because direct local graph queries completed. The native rerun changed the evidence. A first scan with `includeSkills: true` succeeded, but three read queries immediately blocked on candidate manifest drift. A default-scope scan then persisted `totalNodes: 0`, and a later `includeSkills: true` scan did not recover the graph.

### Constraints

- Native findings outweigh sandbox assumptions when they exercise the real MCP path.
- The packet must not describe a product failure as a sandbox limitation.
- The verdict must distinguish code graph from advisor/hooks, which performed well natively.

### Decision

**We chose**: Classify the native code graph result as OVERHEAD and treat scope policy, drift detection, parser crashes, and zero-node persistence as real product failure modes.

**How it works**: `synthesis-report-native-rerun.md` updates the code graph axis to OVERHEAD and moves the defects into native-derived P0/P1 backlog items.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Native product finding | Matches observed MCP behavior and prevents false confidence. | Reverses the prior sandbox verdict. | 10/10 |
| Keep sandbox-useful verdict with caveat | Preserves prior result. | Hides the day-to-day failure mode users will hit. | 3/10 |
| Defer code graph verdict entirely | Avoids overclaiming. | Ignores concrete native failures already measured. | 5/10 |

### Consequences

**What improves**:
- The backlog now targets the failure modes blocking real use.
- Future reruns have clear pass/fail criteria for scope, drift, and recovery behavior.

**What it costs**:
- The packet now contradicts the optimistic code graph sandbox result. That is correct under the stronger native evidence.

### Implementation

- `synthesis-report-native-rerun.md` records code graph as OVERHEAD.
- `trials/trial-log.jsonl` preserves the scan/query failure sequence.
- `plan.md` lists the affected implementation surfaces.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Use Lexical Search and Direct Reads as the Interim Workflow

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-06 |
| **Deciders** | User, Codex |

### Context

The native run showed that code graph state can become empty after scope mismatch and remain unrecovered after repeating the broader scan. The advisor probes, by contrast, routed 3/3 prompts correctly. Hook formatting also worked after compaction, though relevance quality was not fully measured.

### Constraints

- Day-to-day guidance should help users keep working before code graph fixes land.
- The recommended path must avoid depending on a graph index that can silently empty itself.
- Useful native surfaces should remain in the workflow.

### Decision

**We chose**: Recommend `rg`/direct file reads for structural orientation, use advisor/hooks where they already show native value, and reserve code graph for explicit post-fix verification until P0 defects are closed.

**How it works**: Engineers should start with lexical search for exact symbols, direct reads for local context, and advisor/hook routing for skill selection. Code graph should be used only when a fresh scan reports non-zero nodes for the active scope and queries do not trip drift.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Lexical search plus direct reads | Reliable today and matches existing CLI habits. | Loses structural graph conveniences. | 8/10 |
| Force `includeSkills: true` everywhere | Addresses default-scope exclusion. | Does not solve parser crashes, drift blocks, or zero-node persistence. | 4/10 |
| Disable advisor/hooks too | Simplifies guidance. | Throws away native surfaces that worked. | 2/10 |

### Consequences

**What improves**:
- Users avoid the highest-risk graph path while still benefiting from advisor and hook routing.
- Product work can focus on restoring graph reliability instead of asking users to memorize fragile scan flags.

**What it costs**:
- Blast-radius and call-graph workflows stay slower until the graph fixes land.

### Implementation

- `synthesis-report-native-rerun.md` names the interim workflow.
- The new backlog makes graph reliability the prerequisite for returning graph to default day-to-day use.
<!-- /ANCHOR:adr-002 -->
