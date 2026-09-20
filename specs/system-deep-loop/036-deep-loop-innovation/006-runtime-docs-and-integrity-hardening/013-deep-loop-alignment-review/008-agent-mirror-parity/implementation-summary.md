---
title: "Implementation Summary"
description: "The six agent trees now have a written translation contract, each workflow mode owns its own leaves, and the deep-review bodies no longer demand state keys nothing reads."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/008-agent-mirror-parity"
    last_updated_at: "2026-09-16T01:45:00Z"
    last_updated_by: "agent-mirror-parity"
    recent_action: "Recorded the change set and its evidence"
    next_safe_action: "Close the phase and hand off to 009-containment-promise-and-severity-scale"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/references/shared/agent-mirror-crosswalk.md"
      - ".opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs"
      - ".opencode/skills/system-deep-loop/leaf-scopes.json"
      - ".opencode/skills/sk-doc/leaf-scopes.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-mirror-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-agent-mirror-parity |
| **Status** | Complete |
| **Completed** | 2026-09-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Six trees ship the same twelve agents, and until now nothing stated what each runtime does with an agent's declarations. A declaration was either translated, downgraded to prose, or silently dropped, and the reader could not tell which. This phase writes that contract down, gives each workflow mode the leaf set its own router scopes, and removes the one demand the trees made on a state schema that never carried it.

### Phase 8: agent-mirror-parity

The crosswalk documents, per source key, what each of the six trees actually does with it: the permission deny half takes five forms, sampling survives as a key in one tree and a prose sentence in one agent elsewhere, the role key translates nowhere as a key, the tool lexicon has three dialects, and only `.codex` pins a model. It also states the `.pi` `# Unmapped` rule as the contract the generator already enforces, lists the sanctioned differences the mirror gate normalises, and names the manual-invocation drift — a silent tree means "no pin", not an unowned setting. Both agent READMEs point at it.

The leaf-manifest half fixes a multiplexing bug: one shared packet serving two workflow modes was walked once per mode, so both modes received byte-identical 61-leaf sets although each router scopes a different subset. Modes now declare packet-relative scopes in an authored `leaf-scopes.json`, and the generator refuses to build a manifest in which two modes' normalised leaf sets collide. The router-contract reachability check learned that a mapped path is reachable when a mode of the same packet owns the leaf, not only when the first packet-named mode declares it.

The deep-review agent bodies in `.opencode`, `.claude`, `.pi` and `.codex` demanded `budgetProfile` and `edgeCases` in the iteration record and self-certified that the JSONL matched them. Neither key exists in any prompt pack, state-record list or verifier, so the demand was removed rather than carried: the budget-profile choice stays as a plan step, and the JSONL claim keeps the fields that do exist.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/deep-improvement/references/shared/agent-mirror-crosswalk.md` | Created | The translation contract for all six agent trees |
| `.opencode/agents/README.txt` | Modified | Crosswalk pointer and the manual-invocation model note |
| `.claude/agents/README.txt` | Modified | Crosswalk pointer and the manual-invocation model note |
| `.opencode/skills/system-deep-loop/deep-improvement/README.md` | Modified | Index the crosswalk in the packet's related documents |
| `.opencode/agents/deep-review.md` | Modified | Drop the `budgetProfile`/`edgeCases` demand |
| `.claude/agents/deep-review.md` | Modified | Same drop; restore its own tier's path references |
| `.pi/agents/deep-review.md` | Modified | Regenerated from the canonical body |
| `.codex/agents/deep-review.toml` | Modified | Regenerated from the canonical body |
| `.opencode/skills/system-deep-loop/leaf-scopes.json` | Created | Per-mode scopes for the two improvement lanes |
| `.opencode/skills/sk-doc/leaf-scopes.json` | Created | Per-mode scopes for the two create-skill modes |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` | Modified | Read scopes; refuse colliding mode leaf sets |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs` | Modified | Leaf-set digest and collision helpers |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` | Modified | Leaf ownership across a shared packet |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-scopes.test.cjs` | Created | Scoping and collision coverage |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs` | Modified | Cover the new pure helpers |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/README.md` | Modified | Index the new test |
| `.opencode/skills/system-deep-loop/leaf-manifest.json` | Modified | Regenerated with per-mode leaf sets |
| `.opencode/skills/sk-doc/leaf-manifest.json` | Modified | Regenerated with per-mode leaf sets |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The translation rules were measured against the generators before they were documented: the `.pi` tool map, the `.codex` sandbox derivation and both dialects were read from their source rather than inferred from the output. The leaf scoping was proven by first demonstrating the collision on the committed manifests, then fixing the generator, and only then regenerating. Every gate in the affected pipelines was re-run from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Drop the `budgetProfile`/`edgeCases` demand instead of carrying the keys through | The prompt pack, the state record and the verifier share one canonical schema; adding two required fields mid-migration would change a public contract to serve a self-certification checklist no consumer reads. The budget choice survives as a plan step, and `ruledOut` already carries the edge-case evidence. |
| Scope leaves with an authored `leaf-scopes.json` rather than a new key in `mode-registry.json` | A registry key would change a compiled-routing input and stale two hubs' compiled manifests; the authored file changes no routing input, and its absence keeps the previous walk byte-identical. |
| Check collisions globally across a hub's modes, not only within one packet | A mode receiving another packet's leaf set is the same bug class, and after scoping no two modes anywhere share a set. |
| Fix the router contract rather than exempting it | The check was resolving a routed path to the first mode that named the packet; teaching it leaf ownership keeps the check meaningful for a shared packet instead of weakening it. |
| Normalise `.claude/agents/deep-review.md` path references to its own tier | The crosswalk states that each tier references its own agents directory; leaving one file pointing at the other tier would have made the statement false. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skills/system-deep-loop/runtime && npx vitest run --no-coverage` | exit 0 - 154 of 154 files, 2677 of 2685 tests passed, 8 skipped |
| `node .opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs --all` | exit 0 - 12 agents checked, all mirrors in sync |
| `node .opencode/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check` | exit 0 - PASS: 12 agents are in sync |
| `node .opencode/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check` | exit 0 - PASS: 12 agents are in sync |
| `node .opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs` | exit 0 - every runtime covers the canonical roster |
| `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs` | exit 0 - checked=13 fresh=13 failed=0 |
| `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | exit 0 - checked=13 passed=13 failed=0 |
| `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs` | exit 0 - checked=13 fresh=13 stale=0 errored=0 |
| `node .opencode/commands/doctor/scripts/parent-skill-check.cjs <hub>` for both touched hubs | exit 0 - all hard invariants passed, 0 warnings |
| `for f in ./*.test.cjs; do node "$f"; done` in the create-skill scripts tests | all pass except the pre-existing `skill-root-metadata-contract.test.cjs` (see Known Limitations) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The suite cannot see a body edit that swaps one word for another word the body already uses elsewhere.** The mirror gate compares normalised token sets, so a rewrite that replaces a sentence with one built from tokens present elsewhere in the document passes. The crosswalk states the expectation ("the same text in every tree"), and the per-tree diff is the tool for settling a suspected swap.
2. **`skill-root-metadata-contract.test.cjs` fails on `testFleetDiscoveryUsesTheAuthoredMarker`** because it still expects the retired `sk-design-md-generator` hub. That belongs to the `sk-design` track and no surface in this packet touches skill discovery.
3. **`node .opencode/bin/compiled-route-guard.cjs` reports `stale-manifest` for `system-deep-loop`.** No routing input of that hub changed in this packet; the staleness predates it and comes from a compiler-side change on another track. A re-mint is the fix and it belongs to whoever changed the compiler.
4. **The vendored `barter/ai-speckit/coder/` tree still carries the removed demand.** It is a copy of another product's agents, not one of the six runtime trees.
<!-- /ANCHOR:limitations -->
