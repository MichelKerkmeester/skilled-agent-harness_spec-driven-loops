---
title: "Implementation Summary"
description: "Live leftovers that phase 010's name-based search missed are gone: agent-improvement phrase boosters in both advisor scorers, the improvement and benchmark families in runtime types, the behavior benchmark's candidate-evidence kind, and stale statements in hub docs."
trigger_phrases:
  - "residual reference sweep implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/039-deprecate-improvement-modes/012-residual-reference-sweep"
    last_updated_at: "2026-10-11T08:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed phase 012: residual leftovers removed, derived files regenerated, gates rerun on the merged tree"
    next_safe_action: "Operator: review the branch, then push to main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-residual-reference-sweep"
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
| **Spec Folder** | 012-residual-reference-sweep |
| **Completed** | 2026-10-11 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Searching for the retired modes' vocabulary rather than their names found live leftovers in three owners, now removed.

### Phase 12: residual-reference-sweep

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modified | 27 agent-improvement phrase boosters and the `improvement` synonym group removed |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modified | 4 matching native-scorer phrase boosts removed |
| `.skilled/skills/system-deep-loop/runtime/lib/path-coverage-termination/{types,profiles}.ts`, `stopping-clocks/stopping-clock-{types,profiles}.ts`, `deep-loop/continuity-identity/continuity-identity-types.ts` and two tests | Modified | `improvement` and `benchmark` families removed |
| `.skilled/skills/system-deep-loop/shared/behavior-benchmark/{behavior-bench-run.cjs,framework.md,tests/behavior-bench-run.test.cjs}` | Modified | `candidate_evidence` kind and the improvement mode removed |
| `.skilled/skills/sk-doc/sk-create-benchmark/` SKILL, guide and three templates | Modified | Improvement prefix, mode and evidence placeholders removed |
| Hub `SKILL.md`, `ARCHITECTURE.md`, `graph-metadata.json`, runtime READMEs, state-format, playbook, `sk-prompt/graph-metadata.json`, `.skilled/skills/README.txt`, three benchmark READMEs | Modified | Stale statements, two guard rules, the improvement peer edge and three dead related-skill rows removed; ADR-004 marked Retired |
| `specs/system-deep-loop/graph-metadata.json` | Modified | Track root lists this packet |
| `cli-classifier`, `cli-external-orchestration`, `mcp-tooling`, `sk-design`, `sk-doc` README, `mode-registry.json`, `hub-router.json`, `description.json` | Modified | Follow-up at the operator's request: every parent-skill-check warning on these hubs cleared (README versions match `SKILL.md`, aliases lowercased, each alias added to its router class keywords, packet names added to description keywords); all five hubs report 0 warnings, scorer metrics unchanged |
| `.skilled/changelog/skilled/v4.0.0.4.md` | Modified | Follow-up at the operator's request: the release entry records the mode removal, the checker move, the fixes and three upgrade steps; two pairs of glance bullets merged to stay within the 12-bullet ceiling |
| Contracts, activation manifests, Hermes mirrors, skill graph, trigger index | Regenerated | Built from the edited sources |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The leftovers surfaced while merging `origin/main`. The orchestrator built the inventory with a vocabulary search, then ran three DeepSeek V4.1 Flash max dispatches in parallel with disjoint write paths: advisor scorers, runtime and behavior benchmark, docs. It reapplied the README fixes it had set aside from the merge commit, regenerated every derived file, and reran all gates on the merged tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
| Decision | Why |
|----------|-----|
| Keep the `candidate`, `proposal` and `evaluator` synonym groups | They are generic vocabulary that names no retired mode, and other skills may rely on them |
| Keep the escalation rule about the runtime gaining MCP tools | It guards ADR-001, which still holds; only the improvement clause was removed |
| Keep deep-review's `CANDIDATE_EVIDENCE` artifact kind | It is a review concept, not the retired mode |
| Leave the cli-external-orchestration README version warning | It predates this branch on `origin/main` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Phase 011 | Final (tree `ccbe1a717`) |
|-------|-----------|-------|
| Deep-loop runtime vitest | 2710 passed | 2689 passed, 0 failed; 21 parametrized cases left with the two deleted profiles |
| Advisor vitest | 1013 passed | 1035 passed, 0 failed (main added tests) |
| Advisor regression | 84/84 | 84/84 |
| Scorer-eval metrics | 153/195, 49/66 | Identical |
| Behavior-benchmark node tests | pass | pass |
| Bin vitest | 57/57 | 57/57 |
| Router sync (renamed `verify-router-sync.cjs` on main) | pass | 5/5 checks |
| sk-doc pytests | pass | 127 passed; the rename-harness test failed only while the orchestrator edited the tree mid-run, and passes alone |
| Git-hook test scripts | 10/10 | 10/10 |
| `verify-authority` | exit 2, status | exit 2, status |
| Track roots | - | up to date after adding this packet |
| Vocabulary search | - | Only history and kept hits |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The broken-move drill tests committed history, so it is rerun on a clone of the final commits before the push.
2. `verify-authority` exits 2 until the deep-loop modes move to the ledger writer, a rollout decision outside this packet.
<!-- /ANCHOR:limitations -->

---


