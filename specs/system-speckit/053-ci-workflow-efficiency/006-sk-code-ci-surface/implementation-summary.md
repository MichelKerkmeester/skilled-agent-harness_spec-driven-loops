---
title: "Implementation Summary"
description: "Planned, not built: this phase creates the read-only sk-code-ci surface packet with ten rule families, registers it in every sk-code hub artifact, adds the message-contract exception and the routing evidence, and proves the registration through the hub's own gates. Nothing in this folder has been implemented yet."
trigger_phrases:
  - "sk code ci surface implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface"
    last_updated_at: "2026-10-23T15:45:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Recorded the planned scope and the not-built state"
    next_safe_action: "Run tasks.md from T001"
    blockers:
      - "004-setup-caching-provisioning has not landed; .github/actions/setup/action.yml is absent"
      - "specs/sk-code/013-private-surface-skills/002-hub-surface-removal edits the same registration files"
      - "The worktree is not provisioned, so parent-skill-check leg 12-lib fails before this phase starts"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-006-sk-code-ci-surface"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-sk-code-ci-surface |
| **Completed** | Not built |
| **Level** | 3 |
| **Status** | Planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing. This packet is a plan, and no file under `.skilled/` or `.github/` has changed. The plan is carried by `spec.md` (REQ-001 to REQ-010), `plan.md` (the L3 dependency graph, critical path, milestones and decision summary), `tasks.md` (T001 to T068), `acceptance-criteria.md` (AC-001 to AC-012), `decision-record.md` (ADR-001 to ADR-010) and `goal.md`.

### Phase 6: sk-code-ci-surface

When it is built, `.skilled/skills/sk-code/sk-code-ci/SKILL.md` is a read-only surface packet that states the repository's GitHub Actions rules with a `file:line` citation for each, and the hub bundles it as evidence beside `sk-code-quality` or `sk-code-review`. `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `description.json`, `SKILL.md` and the generated `leaf-manifest.json` all name `sk-code-ci`, and `verify-router-sync.cjs` unions its map into the parent projection. `.skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md` records message-contract's every-branch push trigger as an intentional exception, and `.github/workflows/message-contract.yml` stays byte-identical.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-ci/SKILL.md`, `README.md`, `changelog/v0.1.0.0.md` | Planned create | The surface contract, the human orientation and the first packet release |
| `.skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md` | Planned create | The rule index: path parity, SHA pins, README row, `set -euo pipefail`, fork and secret safety, matrix and `fail-fast` |
| `.skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md` | Planned create | The twin rule with the 8-entry form, the rebuild-skip rule, push-only scope and the message-contract exception |
| `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` | Planned create | Timeout sizing, least privilege, the concurrency template, the composite action and the switch `if:` shape |
| `.skilled/skills/sk-code/sk-code-ci/references/protected-set.md` | Planned create | The protected-by-function workflows and the required-context rule |
| `.skilled/skills/sk-code/sk-code-ci/assets/workflow-template.yml`, `assets/job-block-template.yml` | Planned create | The scaffold templates the later doctor route reads |
| `.skilled/skills/sk-code/sk-code-ci/references/workflow-implement.md`, `workflow-debug.md`, `workflow-verify.md` | Planned create (symlink) | The shared implement, debug and verify doctrine, the way `sk-code-skilled/references/` carries it |
| `.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/manual-testing-playbook.md`, `ci-surface/ci-surface.md` | Planned create | The packet playbook index and the `CI_WORKFLOW` scenario that router-sync leg 4 replays |
| `.skilled/skills/sk-code/mode-registry.json` | Planned modify | The `sk-code-ci` mode entry, its surface-axis membership and the description wording |
| `.skilled/skills/sk-code/hub-router.json` | Planned modify | The tie-break slot, the router signal and the two vocabulary classes |
| `.skilled/skills/sk-code/ROUTER.md` | Planned modify | The CI prose map and the `CI_WORKFLOW` entry in both machine maps |
| `.skilled/skills/sk-code/description.json` | Planned modify | The `sk-code-ci` keyword |
| `.skilled/skills/sk-code/SKILL.md`, `README.md`, `shared/README.md`, `shared/references/phase-detection.md`, `feature-catalog/` | Planned modify | The surface table row, the four-surface wording and the packet listings |
| `.skilled/skills/sk-code/leaf-manifest.json`, `graph-metadata.json` | Planned regenerate | The two generated artifacts, with `causal_summary` as the one authored field |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Planned modify | `sk-code-ci` in both surface lists |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` and its archived twin | Planned modify | The `surface-bundle-ci` case and its byte-identical copy |
| `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Planned modify | One test asserting the CI prompt resolves to `[sk-code-review, sk-code-ci]` |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its archived twin | Planned regenerate | The refreshed compiled policy and its byte-identical copy |
| `.hermes/skills/sk-code-ci/SKILL.md` | Planned create (generated) | The Hermes mirror |
| `.skilled/skills/sk-code/changelog/v2.4.0.0.md` | Planned create | The hub release note |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Planned regenerate | The durable-directory manifest, which counts the new packet's README |
| `scratch/` | Planned create | The baseline, the pattern inputs, the two registration snapshots, the ordering state, the ten anchors, the consumer inventory and the phase result |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Planned in five phases, in `tasks.md`: the gate baseline, the pattern inputs, the pre-phase registration, the ordering state, the ten anchors and the consumer inventory (T001 to T006); the packet files, the rule data, the exception and the playbook scenario (T007 to T019); the registry, router, `ROUTER.md`, guard, generated artifacts, hub prose, release, canary, compiled-route test, Hermes mirror and compiled policy (T020 to T058); the durable-directory manifest, the four gate runs, the scope proof, the registration proof and the validator (T059 to T065); then the phase commit, the phase result and the closure evidence commit (T066 to T068). The gates are `parent-skill-check.cjs`, `run-all-drift-guards.sh`, the compiled-route suites, `verify-router-sync.cjs`, `verify-doc-claims.cjs` and `validate.sh --strict`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A read-only surface packet, not a workflow mode | The rules are evidence two acting modes consume, and a surface's tool set is the only one that matches the job |
| Additive registration with a before and after snapshot | `013/002` edits the same five files, and insertion is the only order-independent operation |
| The message-contract exception lives in rule data | The workflow is correct as written; the reader needs the standard, not a YAML comment |
| The playbook scenario lives in the packet | Router-sync leg 4 walks packet-level playbooks only, so a hub-level scenario would pass without being replayed |
| The rebuild-skip rule records the sibling default | The form belongs to `002-rebuild-fanout-removal`; this phase records one actionable rule |
| `CI_WORKFLOW` is mirrored in both maps | Leg 2 keys the union by intent, so both sides must carry the same four paths |
| The hub release is `2.4.0.0` with a `2.5.0.0` fallback | The smallest truthful version, with a mechanical escape when another phase took the minor |
| Four references split by rule family | Each intent loads only its family, and the index stays short |
| Workflow-file citations only | The packet ships in a skill package, where `specs/` does not exist |
| Generator-only writes for the four generated artifacts | Four freshness checks compare the committed file with a fresh regeneration |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `test -f` each of the nine packet files and `test -L` each of the three symlinks | Planned: every command exits `0` (AC-001) |
| `parent-skill-check.cjs` `3g` line | Planned: `all 4 surface packet(s) are read-only evidence-base and advisor-invisible` (AC-001) |
| The ten rule-family tokens in the packet | Planned: the loop prints nothing (AC-002) |
| The seven registration booleans | Planned: seven `true` values (AC-003) |
| `grep -c '"CI_WORKFLOW"'` and `grep -c "'sk-code-ci'"` in the guard | Planned: `2` and `2` (AC-004) |
| `verify-router-sync.cjs --checks 1a,1b,2,3` | Planned: `router-sync: 4/4 checks passed` (AC-004) |
| The canary case, its twin and the surface-hint suite | Planned: `true`, `cmp` exit `0`, and `pass 7` with `fail 0` (AC-005) |
| `grep -c 'intentional-exception'` and the message-contract diff | Planned: at least `1`, and `git diff --exit-code` exit `0` (AC-006) |
| `run-all-drift-guards.sh` | Planned: exit `0` with `all 4 guards PASSED` (AC-007) |
| `parent-skill-check.cjs` full run | Planned: seven PASS lines, with `12-lib` the only FAIL while the worktree is unprovisioned (AC-007) |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$PWD/…/006-sk-code-ci-surface" --strict` | Planned: `RESULT: PASSED` (AC-007) |
| The four version fields and the hub changelog | Planned: one version repeated four times, and the matching changelog file (AC-008) |
| `verify-doc-claims.cjs` | Planned: `doc-claims: 4/4 checks passed` (AC-008) |
| The registration before and after comparison | Planned: `true true true true true true true` (AC-009) |
| The ephemeral-id search over the phase diff | Planned: no output, exit `1` (AC-010) |
| The composite-action status line | Planned: `1` `status: proposed` and `0` `status: landed` while the action is absent (AC-011) |
| `rg -c 'specs/'` over the packet | Planned: no matches, `rg` exits `1` (AC-012) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No number is measured yet.** Every figure in this packet comes from `001-research/research/synthesis-reviews/final-review.md` and is restated as a rule, not an observation. R22 and R23 save 0 runner-minutes.
2. **The composite-action rule is proposed, not landed.** `.github/actions/setup/action.yml` does not exist on this commit, so the rule says `status: proposed` and AC-011 checks that it says so. It flips to `landed` when `004-setup-caching-provisioning` lands.
3. **`parent-skill-check` is red before this phase starts.** Leg `12-lib` needs `@spec-kit/shared/frontmatter/parse-frontmatter.js`, which this worktree has not built. T001 records it and T060 allows it as the only FAIL line.
4. **The `/doctor:ci report` half of R23 lands in phase 009.** This phase records the exception label; the report behaviour and its acceptance criterion belong to `009-doctor-ci-review-wiring`.
5. **The ordering with `013/002` is a risk, not a resolved question.** `specs/sk-code/013-private-surface-skills/002-hub-surface-removal` is Draft and edits the same five files. T003, T004, T064 and T067 record and re-check the state, and the preferred order is that phase first.
6. **The hub playbook gains no row.** The scenario lives in the packet because leg 4 cannot see a hub-level one. ADR-004 records the trade.
7. **Three routing changes outside the frozen scope were approved on 2026-10-24.** The operator approved them and they are done. Bare runtime keywords such as `matrix`, `ruleset`, `cache key`, `fail-fast` and `concurrency group` became multi-word phrases, because non-CI prompts were being pulled into `sk-code-ci`. Eight multi-word CI phrases were added to the advisor `intent_signals` in `graph-metadata.json`, so `pin the actions/checkout sha in the github actions workflow` and `add a timeout to the ci workflow` now reach `sk-code`. The overlapping CI aliases were trimmed from twelve to eight. A second read-only review (a DeepSeek pass) found seven non-CI prompts still selecting the surface, and the same intent was applied again: `workflow timeout`, `workflow concurrency` and `workflow permissions` became `github workflow ...`, `required status check` became `required status check workflow`, `protected workflow` was dropped, `fail-fast` became `fail-fast: false`, and the runtime list settled on `strategy matrix`, `ruleset context` and `actions concurrency group`. All of it amends the frozen line in `spec.md` that ruled out advisor vocabulary changes, and the amendment section of `decision-record.md` holds the reasons and the replay table.
8. **The earlier canary prompt no longer bundles, accepted by the operator.** `review the github actions workflow yaml` resolves to `surfaceBundle` `[sk-code-review, sk-code-ci]` and is now the canary and test prompt. `code review the github actions workflow` routes to `sk-code-review` alone, because `code review` scores twice on the review side and no CI weight or alias set in range bundles both. Bundling both needs `routerPolicy.ambiguityDelta` raised from 1, which affects every two-mode prompt in the hub. The operator ruled on 2026-10-24 to accept the limitation and keep the tolerance at 1. A bare surface prompt does not defer, contrary to the earlier ADR-001 wording: `add a timeout to the ci workflow` resolves to `single` `[sk-code-ci]`.
9. **The pinned gold-corpus failure predates the phase and is resolved.** `the live corpus holds the pinned number of gold scenarios` read `85 !== 82` at `compiled-route-admission.test.cjs:241`, because the pin was set to 82 on 2026-10-11 and the live corpus holds 85. The orchestrator reproduced it in a clean checkout of `113d8b56d1` before any edit of this phase. The operator approved raising the pin to 85 on 2026-10-24, and the serial run now prints `pass 90` and `fail 0` with exit `0`. CI does not run this suite. AC-007 is `Met`. No commit of this phase exists yet, and T065 to T068 stay open.
<!-- /ANCHOR:limitations -->

---
