---
title: "Implementation Summary"
description: "The deep-loop-owned red tests in the spec-kit CLI suite are green, the runtime typecheck reports zero errors without a loosened compiler option, and the compiled command contracts match their sources again."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "deep loop test debt"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/042-deep-loop-test-debt"
    last_updated_at: "2026-09-05T15:10:00Z"
    last_updated_by: "implementer"
    recent_action: "Typecheck clean, contracts regenerated"
    next_safe_action: "None; packet complete. Environment-dependent suites listed under Known Limitations"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs"
      - ".opencode/commands/deep/review.md"
      - ".opencode/skills/system-spec-kit/runtime/cli/tests/review-reducer-fail-closed.vitest.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-types.ts"
    session_dedup:
      fingerprint: "sha256:d120b6b81e21eeffa13f2afce9c9c5a1ce489942d2b60947790614fd853e4cd0"
      session_id: "2026-09-05-042-deep-loop-test-debt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should the reducer throw on a missing machine-owned anchor? No - the 016 audit remediation deliberately made it warn and keep the computed output; the CLI-tree test encoded the older contract."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 042-deep-loop-test-debt |
| **Status** | Complete |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four deep-loop-owned tests that live in the spec-kit CLI suite were red before the CLI workspace moved. Three of them encoded contracts that later, deliberate commits had superseded, and one exposed a real guard defect: the council persistence helper refused the first write into a packet whose council root did not exist yet.

### The guard fix

`assertInside` required the target's nearest existing parent to sit inside the council root. On a fresh packet that parent is the packet root, which is outside, so a payload written alongside the first artifacts was rejected as out of scope. The guard now also accepts a nearest existing parent that is an ancestor of the base. Symlink safety is unchanged: the existing prefix is realpath-resolved and the missing segments cannot be links.

### The stale assertions

- The reducer test expected a throw on a missing machine-owned strategy anchor. The 016 audit remediation had replaced that throw with a warning so an input problem no longer withholds the computed registry; the test now asserts the warning and the registry.
- The council test expected a `native` seat file while the fixture's third seat has been `cli-opencode` since the executor rename, and it wrote the payload outside the council root; both expectations now follow the fixture and the containment contract.
- The restart-contract test asserted runner identifiers a committed refactor removed and one workflow literal that never existed in that form; it now asserts the committed identifiers. The command doc gained the two invocation literals the test names, and its compiled contract was regenerated.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `deep-ai-council/scripts/lib/persist-artifacts.cjs` | Modify | Accept a first write into a not-yet-created council root |
| `.opencode/commands/deep/review.md` | Modify | Name the restart and stop-policy invocation literals |
| `.opencode/commands/deep/assets/compiled/deep-review.contract.md` | Regenerate | Compiled from the updated command doc |
| `runtime/cli/tests/review-reducer-fail-closed.vitest.ts` | Modify | Assert the audited warn-and-keep-output contract |
| `runtime/cli/tests/multi-ai-council-persist-artifacts.vitest.ts` | Modify | Follow the fixture's seat executor and the containment root |
| `runtime/cli/tests/deep-review-auto-restart-contract.vitest.ts` | Modify | Assert the committed runner identifiers |
| `runtime/lib/legacy-projections/*.ts`, `runtime/lib/authorized-ledger/authorized-ledger-types.ts` | Modify | Type-level fixes so the runtime typechecks |
| `runtime/lib/coverage-graph/better-sqlite3.d.ts` | Add | Ambient declaration for the sqlite binding's used surface |
| `.opencode/commands/deep/assets/compiled/*.contract.md` | Regenerate | Compiled from their current sources |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A GLM lane took the first pass and reversed two committed decisions to make tests pass; those runtime edits were reverted here and the tests were aligned to the committed contracts instead. The guard fix was made by hand after reading the containment helpers. The runtime typecheck errors were fixed by a Sonnet lane at the type level: a readonly-array JSON carrier for the legacy projection states, the reason code the gateway's allow result may carry, and a minimal ambient declaration for the sqlite binding.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Align the stale CLI-tree tests rather than change the reducer or the containment guard | The newer behavior is a recorded decision with its own tests in the deep-loop tree; a test that contradicts it is the stale artifact |
| Widen the guard only for a not-yet-created base | The narrowest change that lets a fresh packet receive its first write without weakening the outside-root rejection |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Council helper's own suite (`deep-ai-council`) | 28 of 28 pass |
| The three CLI-tree tests (`--project cli`) | 13 of 13 pass |
| Full CLI project | 1568 of 1589 pass; the one red file targets the operator's in-flight 036 packet |
| Runtime mirrors, agent mirrors | 169 of 169 and 12 of 12 in sync |
| Deep-loop runtime typecheck | 0 errors at `75fc0c7713` (was 53: 34 assignability, 15 index-signature, 2 missing sqlite types, 2 missing gateway field), no compiler option changed |
| Deep-loop runtime suite | Baseline and post-fix totals identical: 9 files red out of 154, all environment-dependent or contract-drift; contracts regenerated at `26c6746225`, drift check OK for 3 commands |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- `recursive-child-manifest.vitest.ts` asserts a goal-file manifest inside the operator's in-flight 036 packet and stays red until that packet settles.
- Nine deep-loop suite files stay red on this host: locale and collation child-process tests that depend on the machine's environment. They failed identically before and after every change here.
- The fan-out runner rejects a lineage whose leaf records no `stopReason` even when all iterations and the report landed; the third nesting review pass hit this. Leaf-protocol debt for the deep-review agent contract.
<!-- /ANCHOR:limitations -->
