---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "The /deep:* setup contract now binds a spec folder named inline in the scope and fails closed on standalone-while-identifiable, so a context run pointed at a folder lands inside it."
trigger_phrases:
  - "deep loop folder binding summary"
  - "scope extract implementation"
  - "standalone guard delivered"
  - "deep context misroute fix"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-deep-context-gathering/008-deep-loop-folder-binding"
    last_updated_at: "2026-06-07T10:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Applied family-wide fix; dry-run + validate green"
    next_safe_action: "Commit via sk-git when ready"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md"
      - ".opencode/commands/deep/start-context-loop.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ctx-fix-008-deep-loop-folder-binding"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Fix scope = whole /deep:* family"
      - "Agent ruled out as defect source"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-deep-loop-folder-binding |
| **Completed** | 2026-06-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A `/deep:*` run can now point at a spec folder by naming its path inline in the scope, and the packet lands inside that folder. Before this change the setup contract only read `spec_folder` from a `--spec-folder` flag, a marker, or an interactive answer, so a folder named in the scope text was invisible. deep-context made it worse by allowing a standalone run dir to win with no guard, which is how a context run aimed at `026-graph-and-context-optimization` wrote to a standalone dir instead of `026/context/`.

### Positional-scope spec-folder extraction (shared)
`auto_mode_contract.md` §1 gains a Tier-1 resolution source: if the scope contains a path that canonicalizes to an existing folder under `specs/` or `.opencode/specs/`, the command binds `spec_folder` to it and strips the token from the scope. A folder named inline is now a confident resolution, not an ambiguity or an absence. An explicit flag or marker still wins.

### Fail-closed standalone guard (shared + deep-context)
The contract adds a guard: a standalone or no-folder fallback is valid only when no spec folder is named or derivable. deep-context's `start-context-loop.md` binds from the scope before asking and only offers Q1 option E when nothing is identifiable, and both deep-context preflights now fail closed if a standalone target is bound while a folder was identifiable.

### Sibling parity
deep-research and deep-review cite the shared scope-extract source in their `spec_folder` rows. Their preflights already excluded standalone, so they needed no preflight change.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md` | Modified | §1 scope-extract Tier-1 source + fail-closed fallback guard; §3 legend |
| `.opencode/commands/deep/start-context-loop.md` | Modified | spec_folder row + §0 bind-from-scope + Q1 option E guard |
| `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` | Modified | preflight `spec_folder_is_within` fail-closed |
| `.opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml` | Modified | preflight `spec_folder_is_within` fail-closed |
| `.opencode/skills/deep-context/SKILL.md` | Modified | explicit host guard line |
| `.opencode/skills/deep-context/references/protocol/loop_protocol.md` | Modified | explicit host guard line |
| `.opencode/commands/deep/start-research-loop.md` | Modified | spec_folder row cites scope-extract (parity) |
| `.opencode/commands/deep/start-review-loop.md` | Modified | spec_folder row cites scope-extract (parity) |
| `.opencode/agents/deep-context.md` | Not edited here | Read-only analyzer, ruled out. Shows modified in the working tree from an unrelated concurrent refactor (pool-default native-only), not this packet. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two Explore passes located the decision points, then the exact source lines confirmed the gap. The edits are prose and YAML contract changes, so verification is a deterministic dry-run plus the spec validator. The dry-run replayed the original failing scope through the patched step-4 logic (the same `find specs .opencode/specs` discovery the command runs, then a `realpath` canonicalized match), and it bound `spec_folder = .opencode/specs/system-spec-kit/026-graph-and-context-optimization`, stripped the path from the scope, and resolved output to `026/context/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Put the extraction source and guard in the shared `auto_mode_contract.md` | The gap is shared by deep-research and deep-review, so fixing it once in the contract is the DRY fix the operator chose |
| Left the `@deep-context` agent untouched | It is a read-only analyzer that receives `specFolder` as an input binding and never chooses location, so it cannot be the defect |
| Downsized the tracking packet from Level 3 to Level 2 | A six-file prose-contract fix has no architecture decision or risk matrix to justify; Level 3 was over-engineering |
| Kept the fix as prose, flagged a runtime helper as optional | The contract is AI-interpreted; a deterministic extraction helper plus a fixture test would harden it, but the operator scoped this to the contracts |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on 029 | PASS, Errors: 0  Warnings: 0 |
| Dry-run: original failing scope through patched step-4 | PASS, bound `026` folder, output `026/context/`, scope stripped |
| `:auto` path no longer fail-fasts on the inline-named folder | PASS, Tier-1 resolves (no Tier-3 absence) |
| Standalone suppressed when folder identifiable | PASS, Q1 option E gated + preflight fail-closed |
| Sibling parity rows present | PASS, deep-research + deep-review cite scope-extract |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Prose enforcement.** The extraction and guard are contract prose interpreted by the runtime AI, not executable code. A deterministic `extract-spec-folder-from-scope` helper plus a fixture test would make the binding code-enforced. The dry-run shows the logic is well defined (~15 lines), so this is cheap if wanted.
2. **Non-`/deep:*` commands unchanged.** The shared contract gains the new source, but only the three `/deep:*` command tables were updated to cite it. Other commands that take a `spec_folder` (for example `/speckit:*`) would benefit from the same row update, deferred as out of scope.
<!-- /ANCHOR:limitations -->
