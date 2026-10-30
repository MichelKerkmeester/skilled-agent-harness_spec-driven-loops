---
title: "Implementation Summary"
description: "The child closes the phase: every fixture checked, planned, applied and restored with its transcript captured, the two manual claims recorded as open with their reasons, and the doctor family's docs naming the command, its targets and the three engines."
trigger_phrases:
  - "agents md verification implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/005-verification-and-docs"
    last_updated_at: "2026-10-30T17:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Ran the end-to-end pass, recorded both manual answers and landed the documentation rows"
    next_safe_action: "Close the 001 phase parent and the top 021 packet"
    blockers: []
    key_files:
      - "specs/agents/021-doctor-agents-md/001-doctor-agents-md/005-verification-and-docs/scratch/e2e"
      - ".skilled/changelog/skilled/v4.0.1.4.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-verification-and-docs |
| **Completed** | 2026-10-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The pair was driven end to end against a copy of every fixture and the result was captured rather than remembered. Then the family's documentation was brought in line with what shipped, and the two claims the design could only infer were written down as open questions with the steps that close them.

### Phase 5: verification and docs

`scratch/run-e2e.sh` composes one fixture into a throwaway root, checks it, plans it, applies it with the digest the plan printed, checks and re-plans it, restores it and compares the result with a pristine copy. Each run writes one transcript to `scratch/e2e/`, and the nine transcripts are the evidence every criterion cites.

| Fixture | Check before | Plan | Check after | Re-plan after | Restore |
|---|---|---|---|---|---|
| `absent` | `absent` (FINDING) | digest `5cf535ecc92e` | `pure` (PASS) | `NOTHING TO DO` | byte-identical |
| `adopted` | `adopted` (PASS) | digest `339eefaa508a` | `adopted` (PASS) | `NOTHING TO DO` | byte-identical |
| `claude-only` | `claude-only` (FINDING) | digest `439ffcaaa0c5` | `adopted` (PASS) | `NOTHING TO DO` | files byte-identical, one empty `.cursor/rules` left behind |
| `foreign` | `foreign` (FINDING) | digest `3cf4c39c5ea8` | `adopted` (PASS) | `NOTHING TO DO` | files byte-identical, one empty `.cursor/rules` left behind |
| `forked` | `forked` (FINDING) | digest `336d35694b7d` | `adopted` (PASS) | `NOTHING TO DO` | byte-identical |
| `over-budget` | `forked` (FINDING) | exit 2, refused by name, nothing written | unchanged | no digest to re-plan | unchanged |
| `pure` | `pure` (PASS) | `NOTHING TO DO` | unchanged | no work to plan | unchanged |
| `shadowed-pin` | `forked` (FINDING) | digest `5975d71cb452` | `adopted` (PASS) | `NOTHING TO DO` | byte-identical |
| `stale` | `stale` (FINDING) | digest `e784ace18434` | `pure` (PASS) | `NOTHING TO DO` | byte-identical |

The one reading worth stating plainly: `adopted` is a passing state that still plans. Its repository lines sit in an unmarked block, and moving them into the marked block, folding its `CLAUDE.md` and writing the Cursor mirror is exactly the work the plan shows. The `NOTHING TO DO` pairing holds on the reconfigured tree, which is what "the reconfigured repository state agrees across the two engines" asks for.

### The two recorded answers

Neither claim could be observed from this run, so both rows record the honest answer rather than a default pass.

| Row | Question | Recorded |
|---|---|---|
| DOC-396 | Can a live Devin session quote the last line of the repository block? | `UNKNOWN`: no live Devin session is reachable from this run. The scenario names the six steps an operator runs to answer it. |
| DOC-397 | Does a Cursor window load the generated `.cursor/rules/repo-local.md`? | `UNKNOWN`: no Cursor window is reachable from this run. The scenario names the six steps an operator runs to answer it. |

Both scenarios state what the engine side already proves, so the open part is one observation each and nothing else.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `README.md` | Modified | The doctor section reads fourteen commands and gains the `/doctor:agents-md` bullet, and the keep-it-healthy sentence near the top names it |
| `.skilled/commands/doctor/scripts/README.markdown` | Modified | Tree, key-files, entrypoint and mutation-boundary rows for the three engines and their three suites |
| `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md` | Modified | The command, its three targets, its four files and its three suites |
| `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | Modified | The category's index row names the new route and the corrected router list |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-agents-md-block-devin-quote.md` | Created | DOC-396, the Devin question |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-agents-md-cursor-mirror-load.md` | Created | DOC-397, the Cursor question |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md` | Modified | The scenario count, both new rows and where they run |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | Modified | The index row-set in section 7.2 |
| `.skilled/changelog/skilled/v4.0.1.4.md` | Created | The framework entry for the command |
| `.skilled/skills/system-spec-kit/changelog/v2.12.27.0.md` | Created | The catalog and playbook coverage |
| `.skilled/skills/system-skill-advisor/changelog/v0.17.28.0.md` | Created | The three derived bridges |
| `.skilled/skills/sk-doc/changelog/v2.3.34.0.md` | Created | The command contract entry |
| `scratch/run-e2e.sh`, `scratch/baseline.txt`, `scratch/doc-locations.txt`, `scratch/router-answers.txt`, `scratch/e2e/*.txt` | Created | The runner, both baseline captures, the resolved locations and the nine transcripts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One verification pass first, because a documentation row written before the pair was proven would describe a promise. The nine fixtures were composed, checked, planned, applied, checked again, re-planned and restored in that order, and each transcript carries its own exit codes.

Then the documentation pass, in the order the sk-doc router resolved it: the script README rows, the two playbook scenarios with their index rows, the catalog category with its index row, the README doctor section, and the four changelogs with every version carrier for their skills. Every document was validated with its own `validate_document.py --type`, and both package validators were run over the playbook and the catalog.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The runner shortens absolute paths on the way into a transcript | The transcripts are committed, and a committed transcript must carry no checkout path. Each transcript's header says what was shortened. |
| The throwaway backup root is redirected into the run root | A composed tree is not a git repository, so the engine falls back to the OS temp folder. Pointing `TMPDIR` at the run root keeps that path out of the committed evidence and leaves the engine unchanged. |
| `adopted` is recorded as planning on the pre-apply tree | Its lines sit in an unmarked block, so the plan has real work to show. Recording it as `NOTHING TO DO` would describe a state the fixture does not have. |
| Both manual rows record `UNKNOWN` | No live Devin session and no Cursor window existed in this run. A default pass would claim a fact nobody observed, which is the one thing the design forbids. |
| The empty `.cursor` folders are recorded rather than tidied | Restore removes the files a run recorded and leaves the folders above them. The engine belongs to the child that owns it, and the transcripts show exactly what it did. |
| A skill whose files changed gets a changelog at its next free version | The packet touched sk-doc's command contract, the advisor's generated bridges and system-spec-kit's catalogs, and each of those is a reader-visible change in that skill. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:deviations -->
## Deviations

| Item | What changed and why |
|------|----------------------|
| The retrieval corpus was regenerated | The four new documents made `generate-trigger-index.mjs --check` report four stale documents. The index is the generated corpus its own README says is published only by that generator, so it was published again rather than left stale for `/doctor:speckit` and the advisory CI job to report. |
| The sk-doc activation manifest was re-minted | Bumping the hub's version changes its compiled policy hash, so the manifest that selects that policy went stale and sk-doc fell back to legacy routing. `compiled-route-manifest.cjs refresh --hub sk-doc` re-pinned it, the authored copy under the routing spec was updated to match, and `compiled-route-guard.cjs` reports every hub fresh. Without this, the routing drift guard would fail on the branch. |
| Three Hermes skill copies were regenerated | Bumping three `SKILL.md` versions made `sync-skills-hermes.cjs --check` report three drifted copies. The sync script wrote them, and `--check` now passes on all 65. |
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | `7 suite(s) passed, 0 failed`, exit 0 |
| `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` | `OK: all rule invariants present`, exit 0 |
| `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs --check` | `PASS: 1 instruction files carry the root Gate 1 lookup.`, exit 0 |
| `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` | `RESULT: PASSED (11/11 checks)`, exit 0 |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | `OK: route-validate — 24 routes validated, 5 warnings`, exit 0 |
| `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` | `PASS: 44 sections, 30 pins, derived matches AGENTS.md`, exit 0 |
| `node .skilled/commands/doctor/scripts/agents-md-check.cjs` | `STATUS=OK rows=12 findings=0 unknown=0`, exit 0, `A1 install state: pure` |
| `node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan` | `NOTHING TO DO`, exit 0 |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md --recursive --strict` | `RESULT: PASSED` for every folder, `Errors: 0  Warnings: 0` |
| `python3 .skilled/skills/sk-doc/scripts/validate_document.py` on every changed document | `Total issues: 0` on each |
| `validate-playbook-package.cjs --package system-spec-kit` | `PASS ... violations=0`, 11 warnings, all pre-existing path warnings plus one per new scenario for the generated `.cursor` path |
| `validate_catalog_package.py --package system-spec-kit` | `PASS tier=fail violations=0` |
| `node .skilled/bin/compiled-route-guard.cjs` | `All hubs fresh or excused`, exit 0 |
| `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` | `PASS: 65 Hermes skill copies in sync`, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Both manual rows are open.** DOC-396 and DOC-397 each need one observation from a live session. Until an operator runs them, the claim behind the Cursor mirror stays inferred, which is what both rows say.
2. **Restore leaves an empty folder behind.** After restoring `claude-only` and `foreign`, `diff -r` reports only the `.cursor` folder the embed created. Every recorded file is byte-identical, and the engine that owns folder cleanup is the embed child.
3. **The root README's command total is one behind.** `README.md:1039` reads `41 commands: 40 in six groups plus one utility`, which was correct at thirteen doctor commands. It now needs `42 commands: 41 in six groups plus one utility`, and this child's scope covered only the doctor section and the sentence near the top.
4. **One child spec still reads Draft.** `001-doctor-agents-md/001-manifest-and-template-block/spec.md` carries `Status: Draft` while its 42 tasks, its 18 criteria and its implementation summary are all closed. The one-line fix is that status row.
5. **Two scenario files add a path warning.** The playbook package validator warns that the backticked `.cursor/rules/repo-local.md` resolves from no base, because the file is generated per repository and never shipped.
<!-- /ANCHOR:limitations -->

---
