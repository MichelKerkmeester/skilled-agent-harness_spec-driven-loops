---
title: "Goal: every link resolves and every generated artifact is fresh after the move"
description: "The durable directive for the phase that retargets hand-made links, re-runs every generator from new source constants and proves the tree with a link census and owner freshness checks."
trigger_phrases:
  - "skilled links phase goal"
  - "generated state phase directive"
  - "link census completion criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/008-links-and-generated-state"
    last_updated_at: "2026-09-16T22:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the phase directive, plan and task list"
    next_safe_action: "Wait for 007 to validate PASSED, then run T001"
    blockers:
      - "007-source-root-move has not validated"
    key_files:
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-008-goal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: every link resolves and every generated artifact is fresh after the move

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** After the rename, every tracked link resolves into `.skilled/`, and every generated or derived artifact is rebuilt by its owner and proven fresh by that owner's own check.

### Decisions

Frozen. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Runtime links target `.skilled/` directly. Generator-owned links and files change only through a generator run from edited source constants, and a second write run must change nothing. |
| D2 | Units run in the order of `plan.md` §4, each followed by its own check and suite before the next starts. The trigger index runs last and again after the final document edit. |
| D3 | DeepSeek V4.1 Flash max on cli-pi executes one runtime directory or one generator per brief. GPT-5.6-sol on cli-codex reviews every constant or path-data diff before its write run. The orchestrator re-runs every check and decides the four already-broken links. |
| D4 | `regenerate-skill-derived.cjs` never runs with `--write` in this phase. It prunes paths it cannot find, so the 13 skill `graph-metadata.json` path fields are rewritten by a JSON-aware script and its dry run is the proof. |

### Operator copy

A change here that alters a parent decision or criterion is applied to the parent first.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The link census over `git ls-files -s -z` lists only the frozen `specs/` allowlist as dangling, counts 0 links outside `.opencode/` and `specs/` with a target containing `.opencode` and counts 4 absolute targets
- [ ] All nine runtime generator `--check` runs exit 0, including `sync-runtime-mirrors.cjs` at 168 mirrors across 8 trees, and a second write run leaves `git status` empty
- [ ] `check-contract-drift.cjs`, `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs` and the four per-package dist checks exit 0, and `compiled-route-sync.cjs --verify` prints `move-simulation OK`
- [ ] A second trigger-index run is byte-identical to the committed index and its three fixtures, and the index path table holds no `.opencode/` entry
- [ ] Each of the four already-broken links has a recorded retire-or-restore decision, applied
- [ ] The phase validates `RESULT: PASSED` with every acceptance row `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this file, 2026-09-16 |
| Read-only baseline at `728c4f3efc` | Done | 8 of 9 runtime `--check` runs PASS, among them `sync-runtime-mirrors.cjs` at 168 mirrors across 8 trees. A NUL-safe count finds 435 tracked links, 8 dangling |
| Execution | Pending | Waits for `007-source-root-move` to validate |

### Deviations and findings

| Item | Note |
|------|------|
| `sync-skills-hermes.cjs --check` already exits 1 at `728c4f3efc` | Pre-existing drift on `agent-deep-review`, class `instance-only`. Neither CI (`.github/workflows/spec-kit-check.yml:142-148`) nor pre-commit (`pre-commit:168-175`) runs the Pi or Hermes checks, which is how it went unseen. T033 regenerates it, and it does not count as move-caused |
| Map class `regenerate` for the 13 skill `graph-metadata.json` rows | The supported owner prunes and never rewrites (`regenerate-skill-derived.cjs:9-16`, `:114-137`), and the advisor writer that re-derives `key_files` is kept for its tests only (`system-skill-advisor/runtime/lib/derived/sync.ts:95-98`). Class `algorithmic`. D4 follows from it |
| Map class `manual` for `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json` | All three are `generate-trigger-index.mjs` outputs (`:64-67`), so T052 regenerates them. Class `matrix/evidence` |
| Map counts 34 Pi prompt rows as generated | `.pi/prompts/goal-pi.md` is hand-authored (`command-scope.cjs:27-30`), and the live check reports 33 prompts. The generators own 197 runtime files, not 198 |
| Map classes `commands/deep/assets/compiled/README.md` as generated | `compile-command-contracts.cjs` writes only `<slug>.contract.md` (`:662-665`), so the README is phase 009 text |
| The dist builds depend on `.opencode` package roots | Every spec-kit build calls `dist-freshness.cjs`, whose 12 package roots name `.opencode/` (`:28-140`). T007 changes them unless phase 006 already did. Class `cross-consumer` |
| Pre-commit skips a mirror check whose script is missing | `scripts/git-hooks/pre-commit:179-180`. Until phase 005 lands, commits in this phase are not gated by it, so each unit runs its own check. Class `cross-consumer` |
| Three frozen `z_archive/022-hybrid-rag-fusion` links point into `.opencode/skills` | They resolve only while that path does. If phase 004 drops it, they join the allowlist by name and stay unedited |
<!-- /ANCHOR:log -->
