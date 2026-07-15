---
title: "Implementation Plan: command contract adapter"
description: "Plan for the deterministic sk-doc-command peer adapter and its fixture proof."
status: complete
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/003-command-contract-adapter"
    last_updated_at: "2026-07-15T07:22:15Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the command contract adapter"
    next_safe_action: "Refresh generated metadata, then register the peer adapter in the successor phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/tests/sk-doc-command-adapter.test.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: command contract adapter

<!-- ANCHOR:summary -->
## 1. SUMMARY

Implement the deterministic peer adapter and prove it against the independent fixtures, reusing existing reference and sync machinery and staying clear of generic document validation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Adapter node syntax check exit 0 and adapter test suite exit 0.
- Discovery set equals the canonical source inventory.
- Generic document-validation finding types are absent.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

sk-doc-command is a peer adapter selected via the lane-config adapter discriminator, binding to sk-doc create-command and the topology registry. It wraps the reference-checks tool and the sync inventory for mirror and reachability signal, adds topology-aware route and boundary checks, and returns findings on the existing severity vocabulary.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Adapter core
Implement discover, standardSource, and check with S1 to S5 over the canonical command set.

### Phase 2: Fixture proof
Extend reference checks to all topologies and prove exact outcomes against the frozen fixtures.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run the adapter test suite against every fixture, assert discovery equals the canonical inventory, and confirm no generic document-validation finding types are emitted.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The fixtures and reference oracle, the command reference-checks tool, the sync inventory, and the deep-alignment adapter contract.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The adapter is a single module plus tests, so rollback is removing the module and reverting the reference-checks extension. No lane is registered yet, so no live run is affected.
<!-- /ANCHOR:rollback -->
