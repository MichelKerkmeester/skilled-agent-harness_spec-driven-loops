---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/003-update"
    last_updated_at: "2026-10-02T23:12:59Z"
    last_updated_by: "implementation"
    recent_action: "Split rebuild to /doctor:rebuild; shipped release updater"
    next_safe_action: "None — packet closed"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/release-update.cjs"
      - ".skilled/commands/doctor/assets/doctor-update-check.yaml"
      - ".skilled/commands/doctor/assets/doctor-update-align.yaml"
      - ".skilled/commands/doctor/assets/doctor-update-apply.yaml"
      - ".skilled/commands/doctor/rebuild.md"
      - ".skilled/commands/doctor/update.md"
      - ".skilled/commands/doctor/_routes.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-003-update"
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
| **Spec Folder** | 003-update |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Verdict: fix, by redesign.** The audit showed that `/doctor:update` was a database rebuild whose mutation boundary forbids skill writes, so it could never host a release apply. The phase split it in two: the rebuild keeps its behaviour as `/doctor:rebuild`, and `/doctor:update` becomes the release-aware updater that updates the units an operator never customized and proposes per-file alignment for the ones they did.

### Phase 3: update

The audit read the router, the workflow YAML and the presentation in full, probed every path they name, and kept the evidence in `scratch/reality-check.md` and `scratch/doctor-run.log`. Its verdict was `fix`; what decided the shape was the rebuild's forbidden targets, which ban writes to `.skilled/skills/**/SKILL.md` and `graph-metadata.json` (`doctor-rebuild.yaml:123-131`), and its VACUUM-snapshot rollback, which could not restore skill bodies. The redesign was researched in ten deep-research iterations (`research/research.md`) and settled in `scratch/design.md`: two commands, a bare `/doctor:update` running the read-only `check`, `align` writing only a gitignored run directory, `apply` as the only skill-body writer with a per-file decision, and the rebuild as the final reindex.

The engine is `.skilled/commands/doctor/scripts/release-update.cjs`, a CommonJS script over git plumbing with five subcommands. `check` reports the checkout position and every unit's status. `align` freezes a plan, evidence cards and merge proposals into a run directory. `decide` records one file decision or defers one unit. `apply` takes the lock, writes only decided or uncustomized units, and `rollback` restores the paths it changed. A locally changed file is never overwritten: it becomes a proposal, and merged text is written only after an explicit `merge` or `use-proposal` decision.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/update.md` → `rebuild.md` | Moved | The database rebuild router under its new name, with the held rebuild fixes: the advisor runs through its CLI with `--trusted` on mutations, the deep-loop graph is out of the dependency order, a read-only daemon check replaces the client probe, and post-run validation runs `generate-trigger-index.mjs --check`, `skill_graph_validate` and `advisor_status` |
| `.skilled/commands/doctor/assets/doctor-update.yaml` → `doctor-rebuild.yaml` | Moved | The rebuild workflow; its state files moved from `.doctor-update.*` to `.doctor-rebuild.*` |
| `.skilled/commands/doctor/assets/doctor-update-presentation.txt` → `doctor-rebuild-presentation.txt` | Moved | The rebuild presentation text |
| `.skilled/commands/doctor/update.md` | Rewritten | Thin router for the release updater: `check`, `align`, `apply`; a bare invocation selects the read-only check |
| `.skilled/commands/doctor/assets/doctor-update-check.yaml` | Created | Read-only check workflow: release position, upstream latest and per-unit status |
| `.skilled/commands/doctor/assets/doctor-update-align.yaml` | Created | Add-only alignment workflow; writes the run directory, evidence cards and proposals and nothing else |
| `.skilled/commands/doctor/assets/doctor-update-apply.yaml` | Created | Mutating apply workflow: dry-run plan, one startup approval, post-apply battery, engine rollback, `/doctor:rebuild` prompt with `reindex rebuilt\|skipped\|failed` |
| `.skilled/commands/doctor/assets/doctor-update-presentation.txt` | Created | Shared presentation for the three update actions |
| `.skilled/commands/doctor/scripts/release-update.cjs` | Created | The engine: `check`, `align`, `decide`, `apply`, `rollback` |
| `.skilled/commands/doctor/scripts/tests/release-update.test.cjs` | Created | Engine tests, 16 cases |
| `.skilled/commands/doctor/_routes.yaml` | Modified | Standalone entries for `/doctor:update` (with its actions map: check read-only, align add-only, apply mutates) and `/doctor:rebuild` |
| `.gitignore` | Modified | `.skilled/release/runs/` is ignored; `base.json` and `divergence.json` stay git-tracked |
| `.skilled/commands/README.txt`, `README.md`, feature catalog, playbook | Modified | Both command names, the 4-to-5 count and the six renamed `doctor-rebuild-*` scenarios |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | Doctor family selector, aliases and operation text |
| `.claude/` and `.cursor/` symlinks; codex, pi and hermes prompt trees | Modified | Regenerated by their sync scripts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Audit first, then research, then design, then the build in three commits on `worktrees/079-doctor-command-audit`, none pushed: `b0be233a6b` moved the rebuild to `/doctor:rebuild`, `b853457597` added the engine and its tests, and `8215a33a7b` shipped the `/doctor:update` router and workflows with the registration and mirror sweep.

Three defects were found and fixed while delivering. The first engine build reported three locally created units (cli-classifier, cli-deem and cli-jev) as removed and turned any customized unit into updates-available; the engine now reports a `local` unit status and drives the overall status from release-side changes only, with four tests added. The design named `regenerate-skill-derived.cjs --check`, a flag the script does not have, and the build halted on it; the design now uses `--all --dry-run`, the script's check mode, and `--all --write` as its repair, and the apply workflow passes only when the JSON reports changed 0 and errored 0, because the script can exit 0 while reporting stale items. Applying also requires an existing alignment run even when only `update` or `new` units need writes; the apply workflow directs the operator to align first, which freezes the plan the drift guard checks against.

The engine's write path was not exercised against the live checkout; its apply, refusal and rollback paths are covered by the test suite against disposable repositories. The post-change verification ran after the commits: the engine suite, the live read-only check, the route and catalog gates, both router documents, the four workflow YAMLs, the prompt trees and the runtime mirrors.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Split into two commands instead of one | The rebuild's mutation boundary forbids skill writes and its rollback is a VACUUM snapshot; release apply needs git-based rollback over skill bodies (DR-Q4-001, `research/research.md` section 9) |
| A bare `/doctor:update` runs the read-only `check` | The read-only action is the only safe default, and no silent mutation happens under the old name; there is no deprecated rebuild alias |
| `align` keeps its name | The operator asked for skills that align with the latest release; the `v3.5.0.0` use of "alignment" for the rebuild is history, and changelogs are never rewritten |
| `base.json` and `divergence.json` are git-tracked, run directories gitignored | The ledger is the repository's record of its own overrides; it must survive clones and be reviewable in a diff, while per-run state should not be committed |
| Prereleases are excluded unless named | Release identity comes from git tags and GitHub releases, compared numerically by segment; `--release=<tag>` can name a prerelease explicitly |
| Merged text is written only after an explicit decision | A locally changed file becomes a proposal, never an overwrite; `merge` or `use-proposal` records the decision and its fingerprints first |
| The rebuild keeps its behaviour, with the held fixes applied | The split must not change what the rebuild does; the fixes were already agreed for it and travel with the rename |
| `apply` requires an existing alignment run | Accepted limitation: the run freezes the plan the drift guard checks against, so applying without one would have no fingerprint to refuse drift against |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs` | tests 16, pass 16, fail 0 (re-run at close-out) |
| `node .skilled/commands/doctor/scripts/release-update.cjs --help` / unknown subcommand | `--help` exits 0 and lists every subcommand, option, path and exit code; an unknown subcommand exits 2 (re-run at close-out) |
| `node .skilled/commands/doctor/scripts/release-update.cjs check --json` (online, phase run) | Exit 0 — upstream known with latest `v4.0.0.2`; checkout ahead (263 commits) and dirty; status `current`; units `local` 54 and `current` 30. An offline re-run at close-out also exits 0, with upstream `unknown` by design and checkout ahead 265 after the split commits |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | Exit 0 — `OK: route-validate — 9 routes validated, 2 warnings` (re-run at close-out) |
| `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` | `STATUS=OK` — every catalog and hub metadata covers the 36-command tree (re-run at close-out) |
| `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/commands/doctor/update.md --type command` and the same for `rebuild.md` | `VALID`, 0 issues each (re-run at close-out) |
| `python3 yaml.safe_load` on `doctor-rebuild.yaml`, `doctor-update-check.yaml`, `doctor-update-align.yaml` and `doctor-update-apply.yaml` | `YAML_OK` for each (re-run at close-out) |
| codex, pi and hermes `sync-prompts --check`; `sync-runtime-mirrors.cjs --check` | `PASS: 34 prompts are in sync` each; `PASS: 174 mirrors across 8 trees are in sync` (re-run at close-out) |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/048-doctor-command-audit/003-update --strict` | `RESULT: PASSED` — Summary: Errors: 0, Warnings: 0 (re-run at close-out) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`apply` requires an existing alignment run.** Even when only `update` or `new` units need writes, `apply` refuses without the run directory; the apply workflow directs the operator to align first. Accepted because the run freezes the plan the drift guard checks against.
2. **The full apply path was not exercised on the live checkout.** The engine's write, decision, refusal and rollback paths are covered by the test suite against disposable repositories; the live run during the phase was the read-only `check`.
3. **Research left three questions open.** The full customization signal set beyond git history and `provenance_fingerprint`, the exact hash input of `provenance_fingerprint`, and the prerelease policy beyond "excluded unless named" (`research/research.md` section 12).
4. **The `/deep:research` workflow showed defects during its own run.** `step_create_state_log` needed the gateway; the marker scan raised a false positive on a DEEP-RESEARCH header; the lock release needs `--nonce`; bookkeeping events were refused with exit 1; the graph upsert was skipped; the strategy's key-question checkboxes were never ticked (`research/research.md` section 16); `resource-map.md` lists 0 references because the delta records carry no path fields (section 15); and its `git add` staged 93 paths including lock and lock-coordinator state, which were unstaged.
5. **The mutation-class gate's manifest lives inside `doctor-mcp-install.yaml`.** Recorded in phase 001; the gate's coverage stays coupled to that workflow.
6. **The phase context keeps the audit's original framing.** The close-out revised the problem, purpose, scope and requirements; the Phase Context scope boundary still describes `/doctor:update` as it stood when the phase opened.

**Follow-up status.** Item 1 is resolved by `specs/system-speckit/049-doctor-audit-followups` phase 002: an update-only apply no longer needs an alignment run. Item 3 is narrowed by the same phase: generator output is its own `generated` class and `record-base` records a base, with the remaining limits recorded there. Item 4 is resolved by `specs/system-deep-loop/041-read-only-and-research-bookkeeping`. Items 5 and 6 are resolved by `specs/system-speckit/049-doctor-audit-followups` phase 003: a guard-owned manifest, and a rewritten Phase Context. Item 2 stands by design: a live apply would rewrite this checkout to a release, so the engine is exercised against disposable fixtures.
<!-- /ANCHOR:limitations -->

---

