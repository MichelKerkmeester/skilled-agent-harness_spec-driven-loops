---
title: "Implementation Summary"
description: "The CLI import-policy gate is green again and every file packet 054 touched now matches its standard: 46 audit findings fixed or closed across code, skill docs, READMEs, changelogs, agents, commands and advisor routing, with one P2 residual left open."
trigger_phrases:
  - "alignment audit fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/020-alignment-audit-fixes"
    last_updated_at: "2026-10-26T20:45:00Z"
    last_updated_by: "closeout-doc-writer"
    recent_action: "Closed out: every acceptance row Met, residuals recorded"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-020-alignment-audit-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-alignment-audit-fixes |
| **Status** | Complete |
| **Completed** | 2026-10-26, uncommitted on `worktrees/217-weak-model-spec-authoring` |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The CLI AST import check passes again, so `npm run check` and the CI step that runs it are green. Every file 054 touched now agrees with its standard and with what shipped: the playbook expects the v2.4 stamp fresh scaffolds print, the orchestrate agent no longer treats exit 1 as a pass, and the advisor sends Measured Behavior and template add-on prompts to system-spec-kit.

### Phase 20: alignment-audit-fixes

You asked for an alignment check of everything 054 touched. Four Opus medium leads audited one lane each and a critic looked for what they missed: 46 findings, 1 P0, 12 P1 and 33 P2. The first scope list matched another 054 packet's commits, so it was rebuilt as `scratch/audit/scope2.txt` and each lane's verifier re-audited the files the first list left out.

DeepSeek V4.1 Flash 1017 through cli-pi made the literal fixes, one short brief each, and every dispatch exited 0 with no redispatch. Sonnet 5.5 high made the judgment fixes: two new catalog entries and two new playbook scenarios for Measured Behavior and Draft auto-repair, strict mode and one shared stamp parser in the shell rules, compact release entries, the packet changelog through phase 019, and spec-scoped advisor phrases. A fresh verifier then checked each lane and found 21 residuals. Each is fixed or recorded with a reason, and the conductor fixed the last open one, R2, by wiring the guard scripts into the speckit workflow gates (`scratch/review.md`).

### Files Changed

All paths are under `.skilled/skills/system-spec-kit/` unless they start with a dot or name a root file.

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/evals/import-policy-allowlist.json` | Modified | Allowlist the Draft auto-repair test, which clears the P0 |
| `runtime/cli/spec/check-example-drift.sh` | Modified | COMPONENT header and `set -euo pipefail`, every failure still reported |
| `runtime/cli/lib/status-classifier.sh`, `runtime/cli/rules/check-measured-behavior.sh` | Modified | One `speckit_template_stamp` parser for both rules |
| `runtime/cli/tests/{card-sync,example-drift,template-fill-guidance}.vitest.ts`, `runtime/lib/validation/orchestrator.ts` | Modified | MODULE headers, TSDoc on `writeRepairHint` |
| `feature-catalog/tooling-and-scripts/{measured-behavior-block,draft-auto-repair}.md` | Created | Catalog entries for the two shipped behaviors |
| `manual-testing-playbook/template-authoring/{measured-behavior-warns-unfilled,draft-auto-repair-rewrites-derived}.md` | Created | Scenarios 485 and 486 |
| `feature-catalog/`, `manual-testing-playbook/`, `templates/`, `references/` | Modified | v2.4 stamps, `v2.3-or-later` wording, no phase or packet ids, real paths, no effort estimates |
| `SKILL.md`, `.hermes/skills/system-spec-kit/SKILL.md` | Modified | Under the 5,000-word gate, version 2.12.1.0 |
| `changelog/v2.9.0.0.md` to `v2.12.0.0.md`, `changelog/v2.12.1.0.md` | Modified, Created | Compact entries, no test counts, the new release note |
| `README.md` (root), `README.md`, `runtime/cli/spec/README.md`, `.skilled/commands/README.txt`, `.skilled/commands/speckit/README.txt` | Modified | Rule counts, `--quiet`, Draft auto-repair, no em dashes |
| `specs/system-speckit/054-weak-model-spec-authoring/changelog/` | Modified | Root changelog through 019, phase changelogs on the template heading set |
| `.skilled/agents/orchestrate.md`, `.claude/agents/orchestrate.md`, `.codex`, `.pi` and `.hermes` copies | Modified | Exit-code rule and real template source |
| `.skilled/commands/speckit/{plan,implement,complete}.md` | Modified | Three warn-only rules named |
| `.skilled/commands/speckit/assets/speckit-{plan,implement,complete}.yaml` | Modified | The guard scripts run as a non-blocking check in every `post_write_validation` gate |
| `graph-metadata.json`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modified | Eight spec-scoped phrases and the recompiled graph |
| `.env.example`, `assets/complexity-decision-matrix.md` | Modified | The switch listed, `effort-est` gone |
| `runtime/data/trigger-index.json`, `runtime/cli/retrieval/fixtures/*.json` | Modified | Regenerated index |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The audit came first, then the four lanes ran in parallel on disjoint files, each in four passes: lead, judgment, verify and residual. The conductor then bumped the skill version, wrote the release note and ran the close gates. At closeout every check below was rerun from the final tree, one targeted command at a time, with no full suite.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Allowlist the test instead of rewriting its imports | The test needs `draftAutoRepairRefusal` and `validateFolder` directly, and the same fix already cleared `required-template-anchors.vitest.ts` |
| Spec-scoped advisor phrases only, with `spec packet repair-derived` in place of `repair derived metadata for a spec packet` | The longer phrase made system-spec-kit win a prompt sk-doc owns, and sk-doc owns skill-root derived metadata |
| Compact tier for v2.11 and v2.12 | Both are minor, non-breaking and carry five glance bullets |
| Keep pre-existing em dashes in edited files | Removing them means editing beyond the findings |
| `Draft auto-repair` placed after `Dist-freshness enforcement` in the catalog | `Dist` sorts before `Draft`, though the brief named the other order |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| AST import check, `runtime/cli` | `AST import policy check passed`, rc=0 (was `FAILED: 1 violation(s)`, exit 1) |
| `npm run check`, `runtime/cli` | rc=0, last line `AST handler cycle check passed` |
| 7 targeted CLI vitest files | `Test Files 7 passed (7)`, `Tests 117 passed (117)`, rc=0 |
| `bash -n`, `shellcheck` on the three shell files | rc 0 each, modes `-rwxr-xr-x` |
| `check-example-drift.sh`, `check-card-sync.sh` | `EXAMPLE_DRIFT_OK`, `CARD SYNC OK` |
| Catalog validator | `PASS tier=fail violations=0` |
| Playbook validator | `PASS ... scenarios=112 ... violations=0 warnings=9` |
| Skill package gate | `package_skill.py --check: PASS (exit 0)` |
| Hermes, runtime mirrors, codex and pi syncs, roster | `PASS: 67`, `PASS: 194`, `PASS` 11, 38, 11, 38, `STATUS=OK` |
| Skill graph freshness `--strict` | `SIGNAL DRIFT compiled vs disk: none`, rc=0 |
| Advisor probes | measured behavior block: system-spec-kit 0.95; template add-ons: system-spec-kit 0.9323 |
| Trigger index `--check` | `trigger index matches the corpus`, rc=0 |
| `validate.sh` on this folder, `--strict`, repair off | After `repair-derived.cjs --apply` (`inspected=1 repaired=1 failed=0`): `Errors: 0  Warnings: 0`, `RESULT: PASSED`, rc=0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The guard scripts run as a non-blocking check (R2, fixed).** The conductor wired `guard_command` (with a non-blocking `guard_on_fail`) into all nine `post_write_validation` gates: 2 in `speckit-plan.yaml`, 2 in `speckit-implement.yaml`, 5 in `speckit-complete.yaml`. All three files parse, `check-contract-drift.cjs` prints `OK commands=3`, `route-validate.sh` exits 0 and `yaml-intake-event-payloads.vitest.ts` passes 7/7. A guard failure is reported and the workflow continues, because it means the skill's own examples or card drifted.
2. **One advisor prompt still prefers sk-doc.** `repair derived metadata after editing docs` ranks sk-doc 0.8681 and system-spec-kit 0.8622. Name the spec packet in the prompt to reach system-spec-kit.
3. **The evidence is pinned after the commit.** The phase changelog is `../changelog/changelog-054-020-alignment-audit-fixes.md`; the commit SHA is recorded in the parent goal log.
4. **This folder's own edits can stale the trigger index again.** Rerun `generate-trigger-index.mjs` from the repository root before commit if `--check` reports stale documents.
<!-- /ANCHOR:limitations -->

---
