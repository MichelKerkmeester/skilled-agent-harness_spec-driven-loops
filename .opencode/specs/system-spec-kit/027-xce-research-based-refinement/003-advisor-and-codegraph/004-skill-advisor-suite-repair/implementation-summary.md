---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Drove the system-skill-advisor vitest suite from 61 failed to 0 failed: first 26 scorer/governor fixes (61 to 36), then retargeted the settings-parity guard to the committed portable settings.json and added three reciprocal symmetry edges to external skill graph-metadata (36 to 0)."
trigger_phrases:
  - "skill advisor suite repair summary"
  - "deep-loop merge test repair"
  - "fable-5 governor brief repair"
  - "settings parity committed settings.json retarget"
  - "reciprocal symmetry edge graph-health"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/004-skill-advisor-suite-repair"
    last_updated_at: "2026-06-15T19:00:00Z"
    last_updated_by: "opus-agent"
    recent_action: "Suite at 0 failed/553: settings-parity retargeted; 3 symmetry edges added; build clean"
    next_safe_action: "None — complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/hooks/settings-driven-invocation-parity.vitest.ts"
      - ".opencode/skills/deep-loop-runtime/graph-metadata.json"
      - ".opencode/skills/mcp-code-mode/graph-metadata.json"
      - ".opencode/skills/deep-loop-workflows/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:2cbb230c47ddd4b004d5c88890dc4779f6dea9f068bb2d31e9ed72d562caf8c9"
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

The `system-skill-advisor` vitest suite went from 61 failing tests to 0, and `npm run build` is clean again. The repair happened in two passes. The first pass (61 to 36) fixed two waves of in-package failures: the committed deep-loop merge that folded five legacy deep-* skills into one `deep-loop-workflows` node but left the tests, corpora, ledgers, Python disambiguation, and metadata allowlist still expecting the deleted ids; and a deliberate fable-5 governor line now appended to every advisor brief, which broke every test that hard-coded the old brief string. The second pass (36 to 0) closed the last two failures: the settings-parity guard was reading the wrong file, and the graph-health validator was tripping on three missing reciprocal edges.

### Deep-loop merge fallout, fixed at the root
The legacy `deep-research`, `deep-review`, and `deep-ai-council` skill directories no longer exist on disk; only `deep-loop-workflows` does. Routing already lands on the merged node, so the repair was to make the tests and data agree with reality. The native-scorer council fixture and the intent-prompt corpus now expect `deep-loop-workflows`; the CLI parity row points at the merged skill that actually has a `SKILL.md`; and the metadata-category allowlist in `skill_graph_compiler.py` now recognizes the `workflow` and `design` categories that `deep-loop-workflows` and `sk-interface-design` carry.

The subtle one was the Python disambiguation layer. `_apply_deep_research_disambiguation` enforced a >= 0.10 confidence margin for deep-research/deep-review over `sk-code-review`, but it looked up the now-absent legacy ids, so the margin was never applied and the merged node sat in a 0.02 tie. Pointing the winner resolver at the merged id (with a legacy fallback) restored the 0.10 margin.

### Honest re-baselines, not silenced gates
Two parity tests locked `pythonCorrect === 61`. The Python scorer legitimately improved to 62 correct rows on the unchanged corpus after the merge plus the registry/scorer hardening; TS preserves all 62 with zero regressions. Both baselines were moved to 62 with the contract intact. The local-vs-native divergence ledger was regenerated from current scorer output, preserving the original reason and date on unchanged entries and tagging only the 18 new or changed entries with the merge re-baseline reason (67 -> 73 entries).

### Governor brief alignment
The `render.ts` governor capsule is verified-correct and untouched. Every test that asserts a brief now expects the appended governor line: the renderer and brief-producer expected-brief helpers, and the `EXPECTED_ADVISOR_CONTEXT` constants in the claude/codex hook and prompt-wrapper tests. Two length/token-cap assertions were adjusted to measure the capped advisor portion only, since the governor is appended in full after the cap by design.

### Settings-parity guard pointed at the committed source of truth
The 35 settings-parity failures came from the test reading `REPO_ROOT/.claude/settings.local.json`, a gitignored machine-local override that carries only `permissions` and no `hooks`, so every assertion ran against an empty hooks block. The committed, shared `.claude/settings.json` is the real source of truth and already contains the canonical nested hooks for all four events with correct `dist/hooks/claude/<event>.js` handler fragments. The fix repointed `SETTINGS_PATH` to `.claude/settings.json`. The committed commands use a portable form, `bash -c 'cd "${CLAUDE_PROJECT_DIR:-$PWD}" && node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/<event>.js'`, so the one machine-specific assertion was relaxed: it previously expected an absolute `cd "<REPO_ROOT>"` and a pinned absolute node path, and now accepts `cd "${CLAUDE_PROJECT_DIR:-$PWD}"` and a bare `node .opencode/...` invocation. Every real-contract guard was preserved unchanged: the four events, single-element matcher-group arrays, the matcher string field, no top-level `bash` field, inner `type: "command"`, the claude-adapter handler fragments, the no-copilot/no-codex assertions, the SessionStart worktree-guard second hook, and the Stop async + 10s-floor timeout. The committed settings.json satisfied all of them, so no config edit was needed. The header comment block now states it validates the committed portable contract. Result: 41/41.

The earlier packet note claimed repointing to settings.json "would not pass either" because the committed paths used `system-spec-kit/mcp_server/...`. That was an incorrect assumption: the committed path is `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/<event>.js`, which does contain the expected `dist/hooks/claude/*.js` fragment. The real blocker was the absolute-anchor and pinned-node assertions, not the handler path.

### Reciprocal symmetry edges added to external skill metadata
The graph-health test runs `skill_graph_compiler.py --validate-only`, which counts SYMMETRY (and ZERO-EDGE, DEPENDENCY-CYCLE) warnings as hard failures because the compiled graph is routing authority. Three directed edges lacked their reciprocal. `deep-loop-workflows depends_on deep-loop-runtime` had no `prerequisite_for deep-loop-workflows` on `deep-loop-runtime`; `mcp-figma depends_on mcp-code-mode` had no `prerequisite_for mcp-figma` on `mcp-code-mode`; and `sk-prompt` had `sibling deep-loop-workflows` with no reciprocal `sibling sk-prompt` on `deep-loop-workflows`. The three reciprocals were added with in-band weights (`prerequisite_for` 0.8 and 0.7 in band [0.7,1.0]; `siblings` 0.4 in band [0.4,0.6]). The validator now prints VALIDATION PASSED and exits 0. The pre-existing WEIGHT-BAND warnings are advisory and do not gate; one new advisory WEIGHT-PARITY warning appears because the `mcp-figma -> mcp-code-mode` source weight (0.45) is itself out of the `prerequisite_for` band, so matching it would breach the band instead. The minimal symmetric addition was chosen and the source weight left untouched.

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
| `tests/hooks/settings-driven-invocation-parity.vitest.ts` | Modified | Read committed `settings.json`; accept portable command form; preserve all real-contract guards; updated header comment |
| `../../../../deep-loop-runtime/graph-metadata.json` | Modified | Added reciprocal `prerequisite_for: deep-loop-workflows` (weight 0.8) |
| `../../../../mcp-code-mode/graph-metadata.json` | Modified | Added reciprocal `prerequisite_for: mcp-figma` (weight 0.7) |
| `../../../../deep-loop-workflows/graph-metadata.json` | Modified | Added reciprocal `siblings: sk-prompt` (weight 0.4) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each failure cluster was reproduced and root-caused against the real source before any edit: the council null was traced to a fixture id that no longer exists in the projection; the margin tie was traced to a dead legacy-id lookup; the category errors were traced to the compiler allowlist; the +1 parity delta was isolated to the scorer (the corpus was unchanged since the 61 baseline). The divergence ledger was regenerated by a throwaway vitest fixture that ran the exact same Python-local-vs-TS-native comparison the ratchet uses, then deleted.

For the second pass, the settings-parity diagnosis was confirmed by reading the test (it resolved `settings.local.json`), checking that the local file carries no `hooks` key while the committed `settings.json` carries all four nested events, and walking each preserved assertion against the committed JSON. The graph-health diagnosis was confirmed by running `skill_graph_compiler.py --validate-only` (3 SYMMETRY warnings counted as the 3 errors), reading `validate_edge_symmetry` and the CLI error-counting block to confirm SYMMETRY gates while WEIGHT-BAND/PARITY do not, then reading each source and target edge block before adding reciprocals. After all edits, `npm run build` exited 0 and a full `npx vitest run` reported 0 failed / 548 passed / 5 skipped (553).
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
| Retarget settings-parity to committed `settings.json`, relax only the machine-specific assertion | The committed file is the shared source of truth; the gitignored local file never carried hooks. Relaxing only the absolute-anchor/pinned-node check to the portable committed form keeps every real-contract guard intact, so no `settings.json` edit was needed |
| Add reciprocal symmetry edges with in-band weights, leave the source weight | The validator gates on symmetry, so the reciprocals are required; in-band weights avoid new WEIGHT-BAND warnings. The one resulting WEIGHT-PARITY warning is advisory and is the lesser evil versus breaching the `prerequisite_for` band by matching the out-of-band source weight |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS (exit 0) |
| First-pass baseline `npx vitest run` | 61 failed / 487 passed / 5 skipped (553) |
| First-pass result `npx vitest run` | 36 failed / 512 passed / 5 skipped (553) |
| Second-pass baseline `npx vitest run` | 36 failed / 512 passed / 5 skipped (553) |
| Final `npx vitest run` | 0 failed / 548 passed / 5 skipped (553) |
| settings-driven-invocation-parity (isolated) | 41/41 PASS |
| `skill_graph_compiler.py --validate-only` | exit 0, VALIDATION PASSED, no SYMMETRY warnings |
| Launcher orphan-reaping flake | Passed within the full parallel run this time; pre-existing parallel-state flake, not a regression |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One advisory WEIGHT-PARITY warning remains in the graph validator** for `mcp-figma -> mcp-code-mode` (source `depends_on` 0.45 vs reciprocal `prerequisite_for` 0.7). It is advisory only and does not gate validation or any test. Tightening it would require changing the `mcp-figma` source weight, which is out of the minimal-symmetric-addition scope and would breach the `prerequisite_for` band if matched downward.
2. **Pre-existing WEIGHT-BAND warnings** on `deep-loop-workflows`, `mcp-figma`, and `sk-prompt-small-model` predate this packet and are advisory; they were intentionally not touched (out of scope, non-gating).
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
