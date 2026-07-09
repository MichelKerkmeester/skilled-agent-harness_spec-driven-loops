---
title: "Decision Record: Multi-Topic Session and Findings Registry"
description: "Scaffold for Multi-Topic Session and Findings Registry."
trigger_phrases:
  - "129 004 multi-topic session and findings registry"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/002-deep-ai-council/011-iterative-session-findings-registry"
    last_updated_at: "2026-05-23T08:04:54Z"
    last_updated_by: "codex"
    recent_action: "findings-registry + cross-topic priors + workflow YAML scaffolds"
    next_safe_action: "dispatch F4 -- 129/005 command + skill wiring"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:1290260000000000000000000000000000000000000000000000000000000006"
      session_id: "wave-5-e1-2026-05-23"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Multi-Topic Session and Findings Registry

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Council-Prefixed Registry File Name

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Phase implementer |

<!-- ANCHOR:adr-001-context -->
### Context

ADR-005 originally named `ai-council/council-findings-registry.json`, while the F3 phase request requires `ai-council/deep-ai-council-findings-registry.json` to match the deep-review prefix pattern and avoid deep-research's unprefixed registry name.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Use `ai-council/deep-ai-council-findings-registry.json` for F3. The helper exports `REGISTRY_FILE_NAME`, `registryPath()`, `appendFinding()`, `loadRegistry()`, and `getCrossTopicPriors()` around that file name.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Keep ADR-005 `council-findings-registry.json` | Shorter | Conflicts with newer F3 request and prefix parity goal | 2/5 |
| Use `deep-ai-council-findings-registry.json` | Matches deep-review-style prefix and user request | Longer file name | 5/5 |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

Downstream F4 command wiring should reference the prefixed path. No deep-review, deep-research, or deep-loop-runtime files changed.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

| Check | Result |
|-------|--------|
| Simplicity | Pass - one packet-local registry path. |
| Scope | Pass - no sibling skill or runtime edits. |
| Maintainability | Pass - exported constant prevents string drift. |
| Testability | Pass - registry path and JSON shape are covered by Vitest. |
| Reversibility | Pass - isolated filename choice before command activation. |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

Implemented in `.opencode/skills/deep-ai-council/scripts/lib/findings-registry.cjs` and referenced by the two workflow YAML scaffolds.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
