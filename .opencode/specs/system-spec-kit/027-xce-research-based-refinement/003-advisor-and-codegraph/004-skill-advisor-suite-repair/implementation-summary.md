---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Repaired 26 in-scope system-skill-advisor vitest failures from the deep-loop-workflows merge and the fable-5 governor brief, dropping the suite from 61 failed to 36 failed, where the 36 residuals are confined to two evidenced out-of-scope files."
trigger_phrases:
  - "skill advisor suite repair summary"
  - "deep-loop merge test repair"
  - "fable-5 governor brief repair"
  - "parity re-baseline 61 to 62"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/004-skill-advisor-suite-repair"
    last_updated_at: "2026-06-15T16:20:19Z"
    last_updated_by: "opus-agent"
    recent_action: "Suite repaired: 61 failed to 36 failed; build clean; out-of-scope residuals evidenced"
    next_safe_action: "None — complete; external-metadata + local-hook owners can close the 2 residual clusters"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-003-004-skill-advisor-suite-repair"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 004-skill-advisor-suite-repair |
| **Completed** | 2026-06-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `system-skill-advisor` vitest suite went from 61 failing tests to 36, and `npm run build` is clean again. The 61 failures were not one bug. They were two distinct waves: the committed deep-loop merge that folded five legacy deep-* skills into one `deep-loop-workflows` node but left the tests, corpora, ledgers, Python disambiguation, and metadata allowlist still expecting the deleted ids; and a deliberate fable-5 governor line now appended to every advisor brief, which broke every test that hard-coded the old brief string.

### Deep-loop merge fallout, fixed at the root
The legacy `deep-research`, `deep-review`, and `deep-ai-council` skill directories no longer exist on disk; only `deep-loop-workflows` does. Routing already lands on the merged node, so the repair was to make the tests and data agree with reality. The native-scorer council fixture and the intent-prompt corpus now expect `deep-loop-workflows`; the CLI parity row points at the merged skill that actually has a `SKILL.md`; and the metadata-category allowlist in `skill_graph_compiler.py` now recognizes the `workflow` and `design` categories that `deep-loop-workflows` and `sk-interface-design` carry.

The subtle one was the Python disambiguation layer. `_apply_deep_research_disambiguation` enforced a >= 0.10 confidence margin for deep-research/deep-review over `sk-code-review`, but it looked up the now-absent legacy ids, so the margin was never applied and the merged node sat in a 0.02 tie. Pointing the winner resolver at the merged id (with a legacy fallback) restored the 0.10 margin.

### Honest re-baselines, not silenced gates
Two parity tests locked `pythonCorrect === 61`. The Python scorer legitimately improved to 62 correct rows on the unchanged corpus after the merge plus the registry/scorer hardening; TS preserves all 62 with zero regressions. Both baselines were moved to 62 with the contract intact. The local-vs-native divergence ledger was regenerated from current scorer output, preserving the original reason and date on unchanged entries and tagging only the 18 new or changed entries with the merge re-baseline reason (67 -> 73 entries).

### Governor brief alignment
The `render.ts` governor capsule is verified-correct and untouched. Every test that asserts a brief now expects the appended governor line: the renderer and brief-producer expected-brief helpers, and the `EXPECTED_ADVISOR_CONTEXT` constants in the claude/codex hook and prompt-wrapper tests. Two length/token-cap assertions were adjusted to measure the capped advisor portion only, since the governor is appended in full after the cap by design.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/skill_advisor.py` | Modified | Disambiguation margin targets merged `deep-loop-workflows` id (legacy fallback) |
| `scripts/skill_graph_compiler.py` | Modified | Allow `workflow` and `design` metadata categories |
| `tests/scorer/native-scorer.vitest.ts` | Modified | Council fixture + assertion use merged id |
| `tests/scorer/fixtures/intent-prompt-corpus.ts` | Modified | Two `deep-ai-council` labels to `deep-loop-workflows` |
| `tests/parity/python-ts-parity.vitest.ts` | Modified | Re-baseline pythonCorrect/tsAlsoCorrect 61 to 62 |
| `tests/legacy/advisor-corpus-parity.vitest.ts` | Modified | Re-baseline pythonCorrect/hookPreserved 61 to 62 |
| `tests/parity/fixtures/local-native-approved-divergences.json` | Modified | Regenerated ledger (67 to 73 entries) |
| `tests/skill-advisor-cli-parity.vitest.ts` | Modified | Council parity row uses merged id |
| `tests/python/test_skill_advisor.py` | Modified | SA-011/SA-012 look up merged id |
| `tests/legacy/advisor-renderer.vitest.ts` | Modified | Expected brief includes governor; length check excludes suffix |
| `tests/legacy/advisor-brief-producer.vitest.ts` | Modified | Expected brief + token-cap check exclude governor suffix |
| `tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modified | Expected context includes governor |
| `tests/hooks/codex-user-prompt-submit-hook.vitest.ts` | Modified | Expected context includes governor |
| `tests/hooks/codex-prompt-wrapper.vitest.ts` | Modified | Expected context includes governor |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each failure cluster was reproduced and root-caused against the real source before any edit: the council null was traced to a fixture id that no longer exists in the projection; the margin tie was traced to a dead legacy-id lookup; the category errors were traced to the compiler allowlist; the +1 parity delta was isolated to the scorer (the corpus was unchanged since the 61 baseline). The divergence ledger was regenerated by a throwaway vitest fixture that ran the exact same Python-local-vs-TS-native comparison the ratchet uses, then deleted. After all edits, `npm run build` exited 0 and a full `npx vitest run` was executed twice to confirm stability.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Re-baseline parity to 62 rather than chase 61 | The corpus was unchanged since the 61 baseline; the +1 is a genuine scorer improvement from the merge with 0 regressions, so 62 is the honest current state |
| Fix the Python disambiguation rather than relax the SA-011/012 margin test | The >= 0.10 margin is a real routing-quality contract; the merge broke its id lookup, so restoring the lookup keeps the contract instead of weakening it |
| Extend the compiler allowlist rather than edit external skill metadata | `workflow`/`design` are the intended, committed categories for those skills; the advisor's allowlist was simply stale, and editing external metadata is out of scope |
| Regenerate the divergence ledger preserving unchanged reasons | Keeps the ledger an honest current-state baseline while not rewriting the provenance of divergences that did not change |
| Leave the 35 settings-parity + 1 graph-health failures | Their causes live outside `system-skill-advisor/**` (gitignored local hook config; reciprocal edges in external skill metadata) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS (exit 0) |
| Baseline `npx vitest run` | 61 failed / 487 passed / 5 skipped (553) |
| Final `npx vitest run` | 36 failed / 512 passed / 5 skipped (553) |
| In-scope clusters (native-scorer, parity x2, corpus-parity, divergence-ratchet, lane-weight-sweep, cli-parity, python-compat, renderer, brief-producer, 3 hook tests) | PASS |
| Remaining failures | settings-driven-invocation-parity (35) + advisor-graph-health (1), both out of scope with evidence |
| Launcher orphan-reaping flake | Passes in isolation (7/7) and on full re-run; pre-existing parallel-state flake, not a regression |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **settings-driven-invocation-parity (35 tests) still fail.** They read the gitignored, machine-local `.claude/settings.local.json`, which holds only `permissions` in this checkout. The committed `.claude/settings.json` uses `system-spec-kit/mcp_server/...` command paths that do not match the test's `dist/hooks/claude/*.js` expected fragments, so repointing would not pass either. Resolution requires the Claude-hook-wiring owner, outside `system-skill-advisor/**`.
2. **advisor-graph-health (1 test) still fails.** Three edge-symmetry asymmetries live in external skill metadata (`deep-loop-runtime` empty `prerequisite_for`, plus `mcp-code-mode`/`sk-prompt`/`deep-loop-workflows`), present on `main`. Resolution requires editing those external graph-metadata.json files, outside this package and off-limits.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
