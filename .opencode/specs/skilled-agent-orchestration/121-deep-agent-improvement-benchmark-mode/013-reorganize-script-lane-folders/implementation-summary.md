---
title: "Implementation Summary: scripts physical lane reorg"
description: "The 16 deep-agent-improvement scripts moved into agent-improvement, model-benchmark, and shared lane subdirs; __dirname path joins repaired; TST-1 byte-identity preserved via spawn-time lane resolution."
trigger_phrases:
  - "scripts-physical-reorg summary"
  - "scripts lane reorg summary"
  - "deep-agent-improvement scripts impl summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/013-reorganize-script-lane-folders"
    last_updated_at: "2026-05-29T10:50:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Moved 16 scripts into lanes, fixed __dirname, TST-1 + vitest 133 green"
    next_safe_action: "Close packet 121: version bump + changelog"
    blockers: []
    key_files:
      - ".opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs"
      - ".opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-013-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-reorganize-script-lane-folders |
| **Completed** | Complete |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The skill's 16 scripts are now lane-separated on disk, the last piece of the full physical two-lane layout. Opening `scripts/` now shows `agent-improvement/`, `model-benchmark/`, and `shared/` subdirs that match `references/` and `assets/`, so an operator sees at a glance which code serves which lane. The risky part was doing this without changing any observable behavior, and the suite proves it.

### The move

Eight Lane A scripts (score-candidate, generate-profile, rollback-candidate, candidate-lineage, scan-integration, check-mirror-drift, trade-off-detector, benchmark-stability) moved to `scripts/agent-improvement/`. Two Lane B scripts (dispatch-model, run-benchmark) plus the whole `scorer/` subtree moved to `scripts/model-benchmark/`. Six shared scripts (loop-host, promote-candidate, materialize-benchmark-fixtures, reduce-state, improvement-journal, mutation-coverage) moved to `scripts/shared/`. `lib/`, `tests/`, and `vitest.config.mjs` stayed at the scripts root because `lib/` is cross-lane infrastructure and the tests resolve scripts by absolute path. All 26 moves (16 top-level plus 10 scorer files) used `git mv`, so history follows.

### Preserving TST-1

`loop-host.planInvocation()` was kept byte-identical: it still returns bare script names like `score-candidate.cjs`, so the TST-1 identity gate (default route equals the explicit agent-improvement route) stays green. The lane is resolved at spawn time instead: a new `resolveScriptPath()` helper maps each bare name to its lane path (`../agent-improvement/`, `../model-benchmark/`, or `./` for same-dir shared scripts), and `runNode()` calls it. This is the key design choice that let the move happen without touching the plan contract.

### Repairing the path joins

`dispatch-model.cjs` moved one level deeper, so every `__dirname`-relative path gained one `..` (state dir, the assets config load, and the repo-root fallback). This was the highest-risk fix because the config load is wrapped in a try/catch that swallows errors, so a wrong depth would fail silently. Scripts that required `./lib/...` now require `../lib/...`. `run-benchmark.cjs` needed no change because `scorer/` moved with it, and the scorer subtree's internal paths are self-relative.

### Rewriting references

Every live reference to `scripts/<name>.cjs` became `scripts/<lane>/<name>.cjs`: the 4 command YAMLs, both command docs, SKILL.md, both README files (the STRUCTURE table), the skill graph-metadata, the 13 vitest path literals (which is how the suite proves ref-completeness), the `target_manifest.jsonc` runtime script pointers, and the live operator docs under feature_catalog, manual_testing_playbook, and references. Frozen historical records (changelogs, prior spec evidence) were left verbatim.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A single coordinated reorg agent did the move, the path-join repairs, and the reference rewrite in one pass to keep the interdependent edits consistent, then an adversarial verifier and the orchestrator independently confirmed the gates. The full vitest suite went from 133 passing before the move to 133 passing after, with zero path or require errors, which is the primary ref-completeness proof. The dispatch-model config load was positively asserted (the resolved path exists and parses, converting the silent-fallback risk into a checked fact). Both cross-lane smokes ran: loop-host in shared spawning score-candidate in agent-improvement, and loop-host spawning run-benchmark plus the scorer in model-benchmark to a benchmark-complete report.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Three lane subdirs (ADR-001) | Match the references and assets layout so lane is visible on disk |
| Spawn-time lane resolution (ADR-002) | Keep planInvocation byte-identical so TST-1 stays green |
| Fix depth + positive config-load assertion (ADR-003) | Turn the dispatch-model silent fallback into a checked, caught failure |
| lib and tests stay at root (ADR-004) | lib is cross-lane infra and tests resolve scripts by absolute path |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| TST-1 byte-identity (loop-host) | PASS, 11/11, default plan equals explicit agent-improvement plan |
| vitest full suite | PASS, 13 files, 133 tests, identical to baseline, 0 path/require errors |
| dispatch-model config load (positive) | PASS, resolves to an existing assets/agent-improvement/improvement_config.json, parses |
| model-benchmark smoke (cross-lane) | PASS, benchmark-complete, scoringMethod 5dim, aggregateScore 90 |
| agent-improvement smoke (cross-lane) | PASS, loop-host spawns score-candidate, score json produced |
| residual bare scripts/ paths (live) | PASS, 0 |
| alignment-drift | PASS, 54 files scanned, 0 findings |
| validate.sh --strict on 013 + --recursive on parent | PASS, 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **None functional.** A P2 doc-prose staleness in `improvement_config_reference.md` (two old script paths in a non-executed reference doc) was fixed in this phase.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
