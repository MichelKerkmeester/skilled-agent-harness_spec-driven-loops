---
title: "Implementation Summary"
description: "Every gate that failed before the removal now passes or is recorded as a status, and two more defects found on the way are fixed: the phrase gate no longer blocks commits in a clone without node_modules, and the hook-installer harness runs again."
trigger_phrases:
  - "pre existing gate failures implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/039-deprecate-improvement-modes/011-pre-existing-gate-failures"
    last_updated_at: "2026-10-11T06:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed phase 011: five pre-existing defects fixed, all gates rerun"
    next_safe_action: "Operator: review the worktree diff, then decide on commit and merge"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-pre-existing-gate-failures"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-pre-existing-gate-failures |
| **Completed** | 2026-10-11 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The compiled-routing move simulation resolves all seven hubs again. The local Python advisor routes the network-waterfall and deep-research prompts to their gold skills. The broken-move drill runs on the already-moved tree. The phrase linter fails open when its YAML dependency is missing. The hook-installer harness tests the installer's source-root choice through its sentinel file.

### Phase 11: pre-existing-gate-failures

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/002-system-deep-loop/{fixtures/canary-cases.v1.json,lib/canary-router.cjs,lib/registry-compiler.cjs}` | Modified | Authored sources now match the runtime copy phase 005 edited |
| `.../009-parent-hub-rollout/008-cli-classifier/{fixtures/canary-cases.v1.json,harness/build-artifacts.cjs}` | Modified | Authored sources drop the removed `cli-deem` mode, as the runtime copy already did |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modified | `waterfall` intent term for mcp-tooling |
| `.skilled/skills/system-deep-loop/graph-metadata.json`, advisor `skill-graph.json` | Modified, regenerated | `deep-research pass` intent signal |
| `.github/scripts/tests/broken-move-drill.sh` | Modified | Skips the move on a moved clone and reads the move commit from history |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs` | Modified | Loads the census module inside the fail-open guard |
| `.skilled/skills/system-spec-kit/runtime/tests/template-phrase-lint-fail-open.vitest.ts` | Created | Proves the fail-open path without node_modules |
| `.skilled/scripts/git-hooks/tests/install-git-hooks-worktree-harness.sh` | Modified | Uses the sentinel instead of rewriting a line that no longer exists |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator traced each failure to its cause, made the five compiled-routing file copies itself, and sent the advisor and drill fixes to two parallel DeepSeek V4.1 Flash max dispatches with disjoint write paths. The drill worker found the phrase-lint defect and the phrase-lint worker found the harness defect; each went to its own dispatch. The orchestrator re-ran every worker's proof itself: the drill on a scratch clone of the staged tree, the phrase-lint and hook tests, the scorer-eval comparison and all 33 program gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
| Decision | Why |
|----------|-----|
| Copy runtime files over the authored sources, not the reverse | The sync build reads the authored program; all five runtime files are the newer ones |
| Leave `verify-authority` exit 2 alone | Its help text defines exit 2 as "not all modes on ledger"; all three modes are on the legacy writer, a rollout state rather than a defect |
| Put the deep-research anchor in graph metadata, not the static phrase table | The static table moved the pinned no-graph parity count; graph metadata fixes the case without touching any pin |
| Keep the drill's skips for dependency-bound gates | The clone has no node_modules; phrase lint joins the three gates already skipped for that reason |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Baseline | Final (tree `f7d0871d5`) |
|-------|----------|-------|
| Bin vitest | 1 failed (move simulation: `cli-classifier`, and since phase 005 `system-deep-loop`) | 57/57 passed |
| Advisor vitest | 2 failed | 1013 passed, 6 skipped, 0 failed |
| Advisor regression | 82/84 (`P0-CHROME-002`) | 84/84 |
| Advisor pytests | pass | pass |
| Scorer-eval metrics | 153/195 corpus, 49/66 holdout | Identical to the committed baseline |
| Broken-move drill, scratch clone of the staged tree | exit 2 at setup | exit 0, 48 passed, 0 failed |
| Broken-move drill, in place | exit 2 | exit 1, 47/48: it clones the last commit, where the mirror checker is still at its old path |
| Git-hook test scripts | 9/10 (`install-git-hooks-worktree-harness.sh` exit 1) | 10/10 exit 0 |
| Phrase-lint fail-open test | fails on the unfixed linter (exit 1) | passes; existing hook tests 7/7 |
| `verify-authority` | exit 2 | exit 2, recorded as rollout status |
| Other 28 program gates | 0 | 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The broken-move drill tests committed history, so in place it shows 47/48 until this branch is committed; on a clone of the staged tree it is 48/48.
2. `verify-authority` keeps exiting 2 until the deep-loop modes move to the ledger writer, which is a rollout decision outside this packet.
3. The `waterfall` term routes any prompt using the word to mcp-tooling at weight 1.0; a project-management "waterfall" prompt without other cues could lean there.
<!-- /ANCHOR:limitations -->

---


