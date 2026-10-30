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
| `absent` | `absent` (FINDING) | digest `d32c4490f672` | `pure` (PASS) | `NOTHING TO DO` | byte-identical |
| `adopted` | `adopted` (PASS) | digest `4eda2cf83949` | `adopted` (PASS) | `NOTHING TO DO` | byte-identical |
| `claude-only` | `claude-only` (FINDING) | digest `33fb3ac8f70b` | `adopted` (PASS) | `NOTHING TO DO` | byte-identical, the `.cursor` folders the run created removed |
| `foreign` | `foreign` (FINDING) | digest `6d0c767fd8ee` | `adopted` (PASS) | `NOTHING TO DO` | byte-identical, the `.cursor` folders the run created removed |
| `forked` | `forked` (FINDING) | digest `daf799bad368` | `adopted` (PASS) | `NOTHING TO DO` | byte-identical |
| `over-budget` | `forked` (FINDING) | exit 2, refused by name, nothing written | unchanged | no digest to re-plan | unchanged |
| `pure` | `pure` (PASS) | `NOTHING TO DO` | unchanged | no work to plan | unchanged |
| `shadowed-pin` | `forked` (FINDING) | digest `4943b3c3cb7a` | `adopted` (PASS) | `NOTHING TO DO` | byte-identical |
| `stale` | `stale` (FINDING) | digest `694800fd9780` | `pure` (PASS) | `NOTHING TO DO` | byte-identical |

The one reading worth stating plainly: `adopted` is a passing state that still plans. Its repository lines sit in an unmarked block, and moving them into the marked block, folding its `CLAUDE.md` and writing the Cursor mirror is exactly the work the plan shows. The `NOTHING TO DO` pairing holds on the reconfigured tree, which is what "the reconfigured repository state agrees across the two engines" asks for. The digest covers the composed bytes and the root the plan ran against, so a rerun from a different temporary folder prints a different digest, and the values above are the ones the transcripts beside them recorded.

### The two recorded answers

Neither claim could be observed from this run, so both rows record the honest answer rather than a default pass.

| Row | Question | Recorded |
|---|---|---|
| DOC-396 | Can a live Devin session quote the last line of the repository block? | `UNKNOWN`: `devin -p` (devin 3000.11.234) refused with `resource_exhausted`, the account's weekly usage quota. Steps 1 to 4 and the restore ran, and the scenario names the six steps an operator runs to answer it with a session that has quota. |
| DOC-397 | Does a Cursor window load the generated `.cursor/rules/repo-local.md`? | `UNKNOWN`: `cursor-agent -p` (2026.09.28-64d2043) reported `Your stored authentication is invalid`, which only an operator's `agent login` repairs. Steps 1 to 4 and the restore ran, and the scenario names the six steps an operator runs to answer it from an authenticated window. |

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
| Both manual rows record `UNKNOWN` | A follow-up run on 2026-10-30 reached both CLIs. Devin refused with `resource_exhausted`, its weekly quota, and Cursor reported invalid stored authentication. Steps 1 to 4 and the restore ran for both. A default pass would claim a fact nobody observed, which is the one thing the design forbids. |
| The empty `.cursor` folders were fixed in the embed engine | The first transcripts showed restore leaving the folders a run created. Each backup entry for a new file now records the parent folders that did not exist yet, and restore removes those, deepest first and only while empty. An embed test fails on the old engine and passes on the new one, and the rerun of every fixture now ends its restore at `diff -r` exit 0. |
| A skill whose files changed gets a changelog at its next free version | The packet touched sk-doc's command contract, the advisor's generated bridges and system-spec-kit's catalogs, and each of those is a reader-visible change in that skill. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:deviations -->
## Deviations

| Item | What changed and why |
|------|----------------------|
| The retrieval corpus was left to the rebuild workflow | The four new documents would make `generate-trigger-index.mjs --check` report four stale documents, and the index is not committed in this change set. The repository's Trigger Index Rebuild CI workflow rebuilds it on the integration branch after the merge, so the branch ships the documents and the workflow publishes the index that names them. |
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

1. **Both manual rows are open.** DOC-396 needs a Devin session with quota left and DOC-397 needs an authenticated Cursor agent (`agent login`). Until an operator runs step 5 of each, the claim behind the Cursor mirror stays inferred, which is what both rows say.
2. **Two scenario files add a path warning.** The playbook package validator warns that the backticked `.cursor/rules/repo-local.md` resolves from no base, because the file is generated per repository and never shipped.
<!-- /ANCHOR:limitations -->

---
