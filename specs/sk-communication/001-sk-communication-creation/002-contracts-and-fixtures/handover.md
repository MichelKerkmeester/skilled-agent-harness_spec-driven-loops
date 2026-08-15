---
title: "Session Handover: Portable CLI Communication Projection"
description: "Verified Phase 002 completion state and the handoff to Phase 003 normalization and assembly."
trigger_phrases:
  - "portable cli projection handover"
  - "resume contracts and fixtures"
  - "improved communication phase 002"
importance_tier: "high"
contextType: "handover"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/002-contracts-and-fixtures"
    last_updated_at: "2026-08-11T15:21:48Z"
    last_updated_by: "codex"
    recent_action: "Completed Phase 002 contracts, fixtures, tests, and final-state verification."
    next_safe_action: "Start Phase 003 T001 by consuming the frozen v1 package and replaying its fixtures."
    blockers: []
    key_files:
      - "handover.md"
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      session_id: "phase-002-handover-20260811"
      parent_session_id: "phase-002-scaffold-20260811"
    completion_pct: 100
    open_questions:
      - "Which live runtime versions will seed Phase 006 adapter captures?"
      - "What human baseline variance will Phase 007 measure?"
    answered_questions:
      - "Phase 002 was the next implementation phase and is now complete."
      - "The authoritative implementation target is packages/cli-communication-projection/."
      - "Phase 002 is complete and Phase 003 is next."
---
# Session Handover: Portable CLI Communication Projection

Recovery state for continuing the improved-communication epic without repeating Phase 001 research or Phase 002 contract work.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## When to Use This Handover

Use this handover when starting Phase 003. Phase 001 research and Phase 002 contracts-and-fixtures are complete. The package is a verified contract boundary, but it does not yet normalize runtime streams, call providers, protect spans, or render into any CLI.

**Status:** complete
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** Phase 002 contracts-and-fixtures implementation, 2026-08-11
- **To Session:** Phase 003 core normalization and assembly
- **Phase Completed:** Phase 002 standalone package, v1 contracts, fixtures, tests, and verification
- **Handover Time:** 2026-08-11T15:21:48Z
- **Recent action:** Passed the package gate, benchmark, security/dependency reviews, documentation reconciliation, and strict packet gates.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
| --- | --- | --- |
| Keep canonical CLI events and transcripts immutable; generate a separate validated display projection. | Friendly communication must never corrupt the authoritative agent record or replay state. | Phase 002 schemas and fixtures, Phase 003 normalization and assembly, all runtime adapters. |
| Freeze versioned contracts and adversarial fixtures before implementing the transformer. | Fixture-first development makes the exact-original fallback and protected-region rules independently testable. | Phase 002 is the mandatory implementation starting point. |
| Treat bounded user context and a versioned prompt profile as explicit contracts. | The reference's 1:1 feel depends on whole-message context, a narrow copy-editing prompt, low sampling, and disabled thinking. | Phase 002 contracts, Phase 003 context selection, Phase 005 provider controls, and Phase 007 evaluation. |
| Route providers per model with privacy-first policy instead of binding the system to one backend. | The design must support OpenCode Go with DeepSeek V4 Flash, local Ollama or llama.cpp, and generic hosted providers. | Phase 005 provider routing and Phase 008 hardening. |
| Integrate each CLI through a declared full-projection or safe-native presentation tier. | Claude CLI, Codex CLI, Pi CLI, OpenCode CLI, Devin CLI, and Cursor CLI expose different extension boundaries. | Phase 006 adapters and Phase 007 tier-stratified evaluation; capability revalidation is required against pinned versions. |
| Return the exact original output on uncertainty, timeout, validation failure, or provider failure. | Safety and fidelity take precedence over presentation quality. | Cross-cutting acceptance rule for contracts, projection, adapters, and release gates. |

### 2.2 Blockers Encountered

**Current blockers:** None for the Phase 002 handoff. Phase 003 retains its own approval and boundary-preflight gates.

| Blocker or constraint | Status | Resolution or workaround |
| --- | --- | --- |
| The repository had no existing package workspace for this cross-CLI product. | Resolved | `packages/cli-communication-projection/` now builds and tests independently. |
| Human parity variance does not exist yet. | Explicitly deferred | The evaluation contract stores `pending` plus null measurements and zero provisional margins; Phase 007 owns measurement. |
| Live runtime/provider shapes can drift. | Open downstream constraint | Keep synthetic fixtures honest and add version-pinned captures in the adapter phases. |
| The packet is currently untracked and no commit or push was requested. | Recorded | Preserve unrelated working-tree changes and establish git scope only when explicitly requested. |

### 2.3 Key Files

| File | Change Summary | Status |
| --- | --- | --- |
| `../spec.md` | Defines the parent purpose, eight-phase map, concrete handoffs, and active child. | Complete for planning |
| `../001-research-strategy/research/research.md` | Synthesizes the multi-model research evidence and recommendations. | Complete |
| `spec.md` | Freezes Phase 002 package, context, prompt, contract, fixture, evaluation, telemetry, benchmark, and safety boundaries. | Complete |
| `plan.md` | Defines the implemented contract/fixture architecture and verification approach. | Complete |
| `tasks.md` | Lists T001-T012 with observed evidence. | 12/12 complete |
| `decision-record.md` | Records the accepted fixture-first package decision. | Accepted and implemented |
| `implementation-summary.md` | Records package contents, requirement evidence, verification, and residual limitations. | Complete |
| `packages/cli-communication-projection/` | Public v1 contracts, fixtures, tests, and package commands. | Verified; untracked |
| `../003-core-normalization-and-assembly/` through `../008-packaging-and-release-hardening/` | Provides the remaining Level 3 phase packets and corrected downstream scopes. | Scaffolded and repaired |
| `handover.md` | Provides this recovery path and verified next action. | Current |

### 2.4 Traps & Scar Tissue

| Trap or blast site | Activation condition | Type | How to avoid re-paying it |
| --- | --- | --- | --- |
| Phase generator creates Level 1 children even when Level 3 is requested. | Re-running `create.sh --phase --level 3`. | Defensive | Do not regenerate existing phases; preserve the authored Level 3 packets. |
| Level upgrader references a missing checklist addendum template. | Re-running `upgrade-level.sh` on these children. | Defensive | Use the official manifest/template renderer only when a required document is genuinely missing; inspect the result before editing. |
| Primary checkout contains unrelated dirty work. | Broad reset, checkout, cleanup, or bulk formatting. | Load-bearing | Limit every command and diff inspection to this packet; never discard unrelated changes. |
| CLI and provider capabilities can change. | Implementing against remembered behavior or unpinned external versions. | Load-bearing | Revalidate supported integration surfaces and provider identifiers at implementation and release time. |
| Raw research worktree still exists. | Cleanup of `.worktrees/0138-system-deep-loop-communication-research`. | Defensive | Do not delete or detach it without explicit approval and a named rollback. |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **File:** `../003-core-normalization-and-assembly/tasks.md:58`
- **Next safe action:** Execute Phase 003 T001: read this handoff, import the v1 public contracts, replay the Phase 002 fixture corpus, and capture the Phase 003 baseline before adding core behavior.
- **Cold-read order:** 1. `handover.md` → 2. `implementation-summary.md` → 3. `../003-core-normalization-and-assembly/spec.md` → 4. its `decision-record.md` → 5. its `plan.md` → 6. its `tasks.md`
- **Context:** Phase 002 is complete. Phase 003 may add normalizer, assembler, and context-selector behavior, but must not change v1 contracts silently or mutate canonical bytes.

### 3.2 Priority Tasks Remaining

1. Run the Phase 003 boundary preflight against the exported v1 contract surface.
2. Implement immutable envelope normalization and generation-keyed assembly without rewriting exact-original records.
3. Consume the six context cases for bounded, privacy-aware selection.
4. Preserve exact-original fallback for duplicate order, missing final, cancellation, stale context, or other uncertain state.

### 3.3 Critical Context to Load

- [x] This handover and `implementation-summary.md` for final Phase 002 state.
- [x] `packages/cli-communication-projection/src/index.ts` for the adapter-free public surface.
- [x] `packages/cli-communication-projection/test/fixtures/` for 100 declared contract cases.
- [x] `../003-core-normalization-and-assembly/spec.md` and `tasks.md` for successor scope.
- [x] Phase 002 continuity frontmatter and generated packet metadata refreshed.
- **Indexing status:** Semantic search refresh is unavailable because the memory MCP transport and daemon IPC socket are closed; canonical files and generated metadata remain the recovery authority.
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [x] Workspace state recorded: the package and packet are untracked, no commit or push was requested, and unrelated changes remain untouched.
- [x] `npm run check` passes type-check, build, 7 files/30 tests, and built-package import smoke.
- [x] Exact-original, privacy, schema-major, ordering, telemetry, evaluation, and provider-control negative cases pass.
- [x] The 1 MiB warm benchmark records p50 1.324 ms and p95 1.680 ms under the 10 ms provisional budget.
- [x] Phase 002 and the recursive parent pass strict validation with zero errors and zero warnings.
- [x] Canonical continuity frontmatter and generated packet metadata are refreshed for Phase 002.
- **Indexing status:** Memory transport remains unavailable; this does not weaken package or packet validation evidence.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

- The research campaign completed all requested iterations without early convergence: seven DeepSeek V4 Flash passes through OpenCode Go and three GPT-5.6 SOL Fast high-effort passes.
- Phase 001 research and Phase 002 contracts-and-fixtures are complete. Phase 003 is the next implementation packet.
- The package tree fingerprint before documentation reconciliation is `220722657e5ce1d9b8c3b6ff300e135bbeef952095c199eb6e7d31007e8f93e0`.
- The 100 declared cases are synthetic or human-authored synthetic. They do not claim live runtime capture or model-generated reference output.
- The intended user experience is a Claudish-to-English-quality communication layer shared across six CLIs, while the canonical record remains exact and recoverable. Full 1:1 projection is claimed only for client-owned or headless paths; constrained native surfaces use safe append, sidecar, or original-only behavior.
- Provider support is intentionally plural: OpenCode Go/DeepSeek V4 Flash is a preferred hosted path, local LLMs remain first-class, and generic hosted providers remain supported.
<!-- /ANCHOR:session-notes -->

---

<!-- ANCHOR:template-instructions -->
## Handover Maintenance

Update this file only when the latest validation result, blocker, or next safe action changes. Keep planning/scaffolding evidence separate from implementation claims, preserve the template source marker and anchors, and refresh indexed continuity after material updates.
<!-- /ANCHOR:template-instructions -->
