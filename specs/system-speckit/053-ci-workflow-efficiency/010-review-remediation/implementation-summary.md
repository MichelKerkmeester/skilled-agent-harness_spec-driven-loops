---
title: "Implementation Summary"
description: "A worker-pool prompt no longer lands on the CI surface, a review naming only a workflow path now loads the CI rules, and the packet records match the tree again."
trigger_phrases:
  - "review remediation implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/010-review-remediation"
    last_updated_at: "2026-10-25T17:19:18Z"
    last_updated_by: "claude-code"
    recent_action: "Applied the confirmed review findings"
    next_safe_action: "Orchestrator commits, and 007 T100-T102 and 004 T072-T074 stay time-gated"
    blockers: []
    key_files:
      - "../review/review-report.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-25-053-010-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-review-remediation |
| **Completed** | 2026-10-25 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A prompt about a worker pool's concurrency group no longer pulls the GitHub Actions evidence into an unrelated task, and a review that names only a `.github/workflows/` file now loads the CI rules. The `sk-code-ci` rules no longer contradict the README on what a switched-off required check does, and every phase record of this packet now describes the tree that is on `main`.

### Phase 10: review-remediation

The routing fix took `concurrency group` out of the CI vocabulary in `.skilled/skills/sk-code/hub-router.json`, `ROUTER.md` (table and INTENT_SIGNALS), `graph-metadata.json` and `sk-code-ci/SKILL.md`, kept `actions concurrency group`, and added `.github/workflows/` in the same five places. The rule fixes add the `persist-credentials: false` rule to `references/job-shape-rules.md` and to both templates, rewrite the skip-semantics sentence in `references/protected-set.md`, and move a citation in `references/trigger-and-filter-rules.md` from `:151` to `:152`. The record fixes reconcile the parent phase map and goal and the 002 to 009 records.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/hub-router.json`, `ROUTER.md`, `graph-metadata.json`, `sk-code-ci/SKILL.md` | Modified | The CI routing vocabulary |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Regenerated | `skill_graph_compiler.py --export-json` |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` | Regenerated | `compiled-route-manifest.cjs refresh`, then the re-minted file copied to its authored path |
| `.hermes/skills/sk-code-ci/SKILL.md` | Regenerated | `sync-skills-hermes.cjs` |
| `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md`, `protected-set.md`, `trigger-and-filter-rules.md` | Modified | `persist-credentials`, skip semantics, line citation |
| `.skilled/skills/sk-code/sk-code-ci/assets/workflow-template.yml`, `job-block-template.yml` | Modified | `persist-credentials: false` on the checkout step |
| `.skilled/skills/sk-code/SKILL.md`, `hub-router.json` (`outcomes.single`), `sk-code-ci/SKILL.md` (opening paragraph) | Modified | The surface contract: bundled after a scoring mode, routed alone when no mode scores |
| `.skilled/skills/sk-code/manual-testing-playbook/compiled-routing/surface-alone-skilled-compiled-routing.md`, `surface-alone-ci-compiled-routing.md`, `workflow-alone-review-compiled-routing.md` | Created | Replays CB-CR-002 to CB-CR-004 for the three single routes |
| `.skilled/bin/tests/compiled-route-admission.test.cjs` | Modified | `LIVE_CORPUS_SIZE` raised from 85 to 88 for the three new gold scenarios |
| `.skilled/commands/doctor/ci.md` | Modified | `\| list \| ?` added to the argument hint |
| `.skilled/commands/doctor/scripts/ci-report.cjs` | Modified | The WHY comment for the rebuild exclusion |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | The two `/doctor:ci` mutations in `destructive_policy.operations` |
| `.github/workflows/routing-registry-drift.yml` | Modified | The routing-suite comment no longer says the gate installs only vitest, since the setup step provisions the advisor runtime tree |
| `.skilled/commands/doctor/assets/doctor-ci-toggle.yaml`, `doctor-ci-presentation.txt`, `.skilled/commands/doctor/ci.md` | Modified | The `SKILLED_CI=off` refusal says it would skip the only required check, whose skipped run reports Success |
| `.skilled/commands/doctor/scripts/tests/doctor-ci-contract.test.cjs` | Modified | Asserts the new refusal line in the toggle workflow and in the presentation contract |
| `003-trigger-and-job-hygiene/acceptance-criteria.md`, `decision-record.md` | Modified | AC-005 and AC-006 criterion text matches the verified proof, dated 2026-10-25 |
| `002-rebuild-fanout-removal/implementation-summary.md`, `acceptance-criteria.md`, `decision-record.md`, `scratch/baseline-24h/pr-runs-by-branch.json` | Modified, Created | The band remainder traced to pull_request traffic |
| `004-setup-caching-provisioning/scratch/cache-adoption-runs.md` | Modified | The old 1.12 GB entry is no longer listed and could not be hit |

Already fixed when checked: the `33 of 33` workflow counts in `sk-code-ci` read `32 of 32` since `0781e81da2`, and `.github/workflows/` holds 32 `.yml` files.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Source edits first, then one regeneration pass at the end, then the checks the review names. The `.hermes/skills/sk-code-review` copy was left as it was, because another worker is editing `sk-code-review/` in this round, so `sync-skills-hermes.cjs --check` still reports that one copy as drift for the orchestrator to regenerate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Drop the bare keyword and keep `actions concurrency group` | A worker pool and a GitHub Actions workflow both have concurrency groups, so only the qualified form names CI |
| Add `.github/workflows/` as a keyword | A file path is the most precise CI signal a review request carries |
| Fix the surface contract text, not the router (operator-delegated decision, 2026-10-25) | The router already routes a surface alone when no workflow mode scores, and three prompts prove it. The contract said a surface was never a primary, so the text was wrong and the code was right |
| Mark 007 AC-002 `Met` | The operator ruled on 2026-10-25 that the two recorded Dependabot runs count, with the write path still unobserved |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Before: `pass 7`, `fail 1`. After: `tests 8`, `pass 8`, `fail 0` |
| `node --test --test-concurrency=1 .skilled/bin/tests/compiled-route-*.test.cjs` | After the replays and the pin raise: exit `0`, `tests 90`, `pass 90`, `fail 0`. Before the pin raise the admission pin failed at `88 !== 85` |
| `verify-router-sync.cjs` | `router-sync: 5/5 checks passed`, and `--checks 1a,1b,2,3,4` exit `0` |
| `run-all-drift-guards.sh` | exit `0`, `all 4 guards PASSED, 10 non-blocking warning(s)` |
| `parent-skill-check.cjs .skilled/skills/sk-code` | exit `0`, `all hard invariants passed, 0 warnings` |
| `compiled-route-sync.cjs --check` | `all 55 served copies match their authored files` |
| `skill-graph-freshness.cjs --strict` | exit `0`, `SIGNAL DRIFT compiled vs disk: none` |
| `generate-leaf-manifest.cjs --check .skilled/skills/sk-code` | `leaf-manifest.json OK` |
| Front door probes | `review .github/workflows/spec-kit-check.yml` routes `surfaceBundle` to `sk-code-review` then `sk-code-ci`, and the worker-pool prompt defers |
| `ci-report.test.cjs`, `generate-command-routers.cjs --check` and `sync-prompts.cjs --check` | `pass 14` and `fail 0`, then `routers=35 clean=35`, then `39 prompts are in sync` |
| `actionlint assets/workflow-template.yml` | exit `0` |
| Contract replays | `what are the conventions for TypeScript in this repo` single `[sk-code-skilled]`, `add a timeout-minutes to the ci job` single `[sk-code-ci]`, `review my diff` single `[sk-code-review]`, and `validate-compiled-routing-scenarios.cjs` PASS for CB-CR-002 to CB-CR-004 |
| `compiled-route-admission.cjs --hub sk-code` | `6 pass, 0 drift, 0 stale, 1 n/a` |
| Canary cases | 8 of 8 match their expected modes or action through the compiled engine |
| `validate-playbook-package.cjs --package .skilled/skills/sk-code/manual-testing-playbook` | `PASS`, `violations=0` |
| `node --test doctor-ci-contract.test.cjs ci-report.test.cjs` after the refusal change | exit `0`, `tests 26`, `pass 26`, `fail 0` |
| `actionlint .github/workflows/routing-registry-drift.yml` after the comment rewrite | exit `0`, no output |
| `gh run list --event pull_request` over the 002 baseline window, read-only | exit `0`, 321 runs: 223 from probe branches, 98 from Dependabot |
| `gh cache list --limit 50` and `--limit 1000 --sort size_in_bytes` | exit `0`, 57 entries, none over 1 GB, no `a003991f` key |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The new path keyword has no guard case of its own.** `compiled-route-surface-hint.test.cjs` sits outside this round's files, so the path routing is proved by a front-door probe only.
2. **CB-CR-001 fails the compiled-routing scenario validator.** Its typed pairs name `sk-code-skilled` under an `expected_workflow_mode` of `sk-code-review`. It failed before this phase and was left as it is.
3. **Time-gated tasks stay open.** 004 T072 to T074 and 007 T100 to T102 run after their measurement windows close. The packet `changelog/` finding is closed: the dead pointer to a folder no phase kept was removed from every phase spec, the operator's call on 2026-10-25.
<!-- /ANCHOR:limitations -->

---
