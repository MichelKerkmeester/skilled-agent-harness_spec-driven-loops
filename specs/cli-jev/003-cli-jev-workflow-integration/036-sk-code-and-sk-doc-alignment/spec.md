---
title: "Feature Specification: Phase 36: sk-code-and-sk-doc-alignment"
description: "Align every file the cli-jev 003 packet created with sk-code-opencode and sk-doc, proved by their own validators. The 2026-09-30 audit found 9 files missing the COMPONENT: or MODULE: marker in the header they already use, 11 scripts with bare stderr diagnostics, two playbook scenarios carrying dated run transcripts, four catalog entries carrying packet-history bullets, five prose semicolons and six prose uses of one banned word, and no README for the injection-screen folder. Headers, stderr tags and doc text only, with no behavior change and no skill version bump."
trigger_phrases:
  - "sk code and sk doc alignment"
  - "alignment audit fixes"
  - "code header conformance"
  - "bracketed stderr tags"
  - "packet doc conformance"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 36: sk-code-and-sk-doc-alignment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-30 |
| **Branch** | `worktrees/071-cli-jev-sk-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 36 of 36 |
| **Predecessor** | 035-fetched-text-injection-screen |
| **Successor** | None |
| **Handoff Criteria** | The five completion criteria in `goal.md` each run from the final state with their evidence recorded: the drift verifier over the staged 34-file copy prints `Errors: 0` and `Warnings: 0`, every C2 stderr diagnostic carries its `[<script-name>]` prefix and each changed script's suite passes, the playbook and catalog validators report no violation, `hvr_scan.py` and `validate_document.py` report only the recorded false positives, and comment hygiene, the key grep and `validate.sh --strict` pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 36** of the cli-jev workflow integration specification. It is the conformance pass the operator asked for on 2026-09-30: "Make sure all skills and things we created aligns with sk code opencode and sk doc", "Think feature catalogs, playbooks, readme's", "Use external orchestration". It follows the read-only audit of the 130 files the packet created between `f9d701bd13` and `089693d899`, recorded at `scratch/audit/findings.md`.

**Scope Boundary**: The 28 files the audit's fix findings name, in five groups, plus this phase folder. C1 is 9 code files whose header misses its `COMPONENT:` or `MODULE:` marker, and the fix adds only that missing marker. C2 is 11 scripts whose stderr diagnostics carry no `[<script-name>]` tag. D1 is two playbook scenarios carrying dated run transcripts. D2 is four catalog entries carrying a Feature ID bullet. D3 is seven files with prose hard blockers. D4 is one new README and one README row. No behavior change, no new feature, no version bump.

**Dependencies**:
- Phase 035 (`035-fetched-text-injection-screen`) is Complete at its label gate, build `3d0641004b`. Its `injection-screen/` folder and the reply check folder are part of the audited scope.
- The audit at `scratch/audit/findings.md`, read 2026-09-30. It is the source of every file, rule, line number and baseline number this phase writes.
- sk-code-opencode's `references/javascript/style-guide.md` section 2, `references/python/style-guide.md` section 2, `assets/checklists/javascript-checklist.md` section 3 and `verify_alignment_drift.py` with `--check-exact-headers --fail-on-warn` set the code standard (parent goal D6, this phase's D2).
- sk-doc's `validate_document.py`, `extract_structure.py`, `hvr_scan.py`, `validate-playbook-package.cjs`, `validate_catalog_package.py` and `check-comment-hygiene.sh` set the doc standard.
- The parent goal's D5 roster: DeepSeek V4.1 Flash writes, MiMo v2.6 Pro reviews it, and the reverse for MiMo's writes. No Claude workers.
- The 42 code files inside `.skilled/skills/system-deep-loop/runtime`, `.skilled/skills/system-skill-advisor/runtime` and `.skilled/skills/system-spec-kit/runtime` wait on other sessions' align packets (this phase's D1). They are not in scope.

**Deliverables**:
- The missing `COMPONENT:` or `MODULE:` marker on each of the 9 C1 files, in the header style the file already uses.
- A `[<script-name>]` prefix on every stderr diagnostic the 11 C2 scripts write, `cli-deem.mjs` excepted.
- The two dated run transcripts removed from the `hub-routing` scenarios and the four Feature ID bullets deleted from the four catalog entries.
- Five semicolons split and six prose uses of one banned word replaced in the seven D3 files.
- `injection-screen/README.md` created and the missing `judge-agreement.test.mjs` row added to the reply check README.
- This phase folder's six docs.

**Changelog**:
- The parent packet has no `../changelog/` folder. No skill changelog is touched, because D6 forbids a skill version bump for conformance edits.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The cli-jev 003 packet shipped 130 files between `f9d701bd13` and `089693d899`, and a read-only audit on 2026-09-30 found conformance gaps against the two skills that own their standards. The sk-code drift verifier with `--check-exact-headers --fail-on-warn` reports 10 errors over the 35 audited code files: 9 files miss the `COMPONENT:` or `MODULE:` marker in the header they already use, and the tenth is the exempt recorded run evidence, which stays byte-identical. Eleven scripts write bare `error: ...` lines to stderr where the JavaScript checklist requires a bracketed `[component]` tag. On the sk-doc side, the playbook package validator fails its fail-closed gate with two `BAKED_RUN_TRANSCRIPT` errors on cli-classifier scenarios, the catalog validator flags `packet_history_metadata` on four feature catalog entries, `hvr_scan.py` reports real prose hard blockers on seven files, and the new `injection-screen/` folder has no README while its sibling folders do.

The rest of the audit passed and must keep passing. Comment hygiene is clean on 31 of 31 scripts, `validate_document.py` returns VALID on 89 of 89 docs with no error, DQI sits at 78 or above on all 89, the cli-classifier catalog packages PASS, and 10 of 11 playbook packages holding packet scenarios PASS or SKIP. The audit also records items it does not fix, and the reasons sit in section 3 under Out of Scope.

### Purpose

Every file the packet created meets sk-code-opencode and sk-doc, proved by their own validators, with no behavior change and no skill version bump.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **C1, code headers (9 files).** `verify_alignment_drift.py --check-exact-headers` wants a `MODULE:` or `COMPONENT:` marker in the first 40 lines of every non-test file. Each file keeps the header style its folder's older files use and gains the missing marker: the seven box headers keep their box and gain `COMPONENT:` on the name line, `hvr_reader_lens.py` gains the marker on its Python divider line, and `judge-agreement.test.mjs` gains the three-line header its sibling `judge-agreement.mjs` uses, carrying the `MODULE:` marker. Test files under a `tests/` folder are exempt from that check. The files whose header already carries its marker are not edited, and `raw/mode-routing-run.sh` is recorded run evidence that stays byte-identical.
- **C2, stderr tags (11 scripts).** The default stderr writer, or each direct `process.stderr.write` diagnostic, gets the prefix `[<script-name>] ` where `<script-name>` is the file's base name without extension. Injected `deps.err` writers in tests stay untouched. Report lines on stdout are program output and do not change. `cli-deem.mjs` writes one JSON object per error line to stderr, which its callers parse, so it keeps that form and is exempt. `lint-goal-criteria.cjs` and `score-goal-lint.cjs` already carry a `TAG` constant and are left alone.
- **D1, playbook scenarios (2 files).** Remove the dated "Observed on ..." paragraphs from `hub-routing/alias-still-resolves.md` section "### Recorded Result" (lines 67-72) and `hub-routing/judgment-request-routes-to-transport.md` section "### Recorded Result" (lines 70-75). Scenario files state what to run and what passing looks like, and dated observations belong in a benchmark report. Keep the expected answer shape in the expected-result wording: a single route, `workflowMode` `cli-jev`, `packetId` `cli-usage`, with no date, run id or policy hash. The dated runs already live under `.skilled/skills/cli-classifier/benchmark/reports/`.
- **D2, catalog entries (4 files).** Delete the one `- Feature ID: F0NN` bullet at each named line. Nothing else changes.
- **D3, prose hard blockers (7 files).** Split the five semicolons in prose into two sentences or replace one with a comma where the grammar allows, and replace the six prose uses of the banned word with "script", "runner" or "check" to match what the thing is. Text inside a path or link target stays, so the `reply-harness` folder name is untouched.
- **D4, READMEs (1 new, 1 row).** Create `injection-screen/README.md` in the shape of the sibling code-folder README: what the check measures, the files, how to run it, the label gate. Add the missing `judge-agreement.test.mjs` row to the reply check README.
- **This phase folder.** `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md` and `implementation-summary.md`, plus the derived `description.json` and `graph-metadata.json` through `repair-derived.cjs`.
- **Source of truth.** `scratch/audit/findings.md` and the audit lists beside it (`code.txt`, `md.txt`, `scope.txt`, `docs.tsv`, `drift.txt`, `hygiene.txt`, `hvr-hits.txt`, `playbook-cli-classifier.json`).

### Out of Scope

- Everything under "Recorded, not fixed" in `scratch/audit/findings.md`, with the reason the audit gives:
  - The sk-code checklist conflict: `javascript-checklist.md` section 2 asks for a plain-name `╔═╗` box and calls the COMPONENT form retired, while `javascript/style-guide.md` section 2 and the verifier require the `MODULE:` divider. The style guide and the verifier win here, the conflict is recorded, and the checklist belongs to sk-code.
  - The sk-doc conflict: `extract_structure.py`'s README checklist fails a README without a TABLE OF CONTENTS, while `sk-create-readme/SKILL.md:217` forbids one. The READMEs follow the authoring rule.
  - `check_authored_name_kebab.py` fails `cli-classifier/ROUTER.md`. The hub canon names that file in capitals, so it is a checker false positive.
  - The `cli-classifier` and `cli-deem` `SKILL.md` descriptions at 155 and 151 characters sit over the soft 130 target. Trimming one changes a routing input and forces a routing remint, so it is recorded rather than done (this phase's D6).
  - 28 HVR soft deductions (do, make, get, good, take, craft) and 526 "oxford-comma-candidate" review items across the docs. Advisory, and the second is reviewer judgment.
  - JSDoc on public functions and docstrings on six small Python methods in `hvr_reader_lens.py`. Recommended and deferred.
  - Package-level playbook warnings on roots this packet did not create, and the sk-communication catalog failure on `provider-and-privacy/external-cli-provider.md`. Pre-existing.
  - `sk-create-with-human-voice/scripts/README.md` starting its numbering at `## 0.`. Pre-existing, commit `ec33385ae5`, before this packet.
- Code inside the three runtime trees named in section Phase Context. Another session's align packets own those 42 files. The packet's catalog entries, playbook scenarios and changelogs inside those skill trees stay in scope.
- Any behavior change, refactor, rename or version bump. This phase edits comments, stderr text and doc prose only.

### Files to Change

One row per file with an edit under C1, C2, D1 to D4. A file that appears under both C1 and C2 carries one row with both changes. Every name below is a path the audit read.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/goal/lib/build-verifier-fixture.cjs` | Modify | Tag the six stderr writes at lines 383-413 with `[build-verifier-fixture]` (C2) |
| `.skilled/hooks/goal/lib/count-pi-goal-nudges.mjs` | Modify | Tag the stderr write at line 52 with `[count-pi-goal-nudges]` (C2) |
| `.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs` | Modify | Tag the five stderr writes at lines 424-456 with `[score-verifier-labeled-set]` (C2) |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs` | Modify | Give the box name line the `COMPONENT:` marker. Its `TAG` prefix is already correct (C1) |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs` | Modify | Give the box name line the `COMPONENT:` marker. Its `TAG` prefix is already correct (C1) |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` | Modify | Give the box name line the `COMPONENT:` marker and tag the default stderr writer at line 1529 with `[leaf-route-replay]` (C1, C2) |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` | Modify | Give the box name line the `COMPONENT:` marker and tag the default stderr writer at line 1436 with `[score-clarify-default]` (C1, C2) |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs` | Modify | Give the box name line the `COMPONENT:` marker and tag its stderr diagnostics with `[score-verdict-fallback]` (C1, C2) |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` | Modify | Give the box name line the `COMPONENT:` marker and tag its stderr diagnostics with `[score-d4-agreement]` (C1, C2) |
| `.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs` | Modify | Give the box name line the `COMPONENT:` marker and tag the default stderr writer at line 1474 with `[score-residue-flagger]` (C1, C2) |
| `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs` | Modify | Add the three-line header its sibling `judge-agreement.mjs` uses, carrying the `MODULE:` marker (C1) |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py` | Modify | Add the `COMPONENT:` marker to its Python divider line (C1) |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` | Modify | Tag every stderr diagnostic with `[score-injection-screen]`. Its header is already correct (C2) |
| `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs` | Modify | Tag every stderr diagnostic with `[judge-agreement]`. Its header is already correct (C2) |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Modify | Tag the default stderr writer at line 1518 with `[cite-drift-scan]`. Its header is already correct (C2) |
| `.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/alias-still-resolves.md` | Modify | Remove the dated paragraph from the Recorded Result section and keep the expected answer shape (D1) |
| `.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/judgment-request-routes-to-transport.md` | Modify | Remove the dated paragraph from the Recorded Result section and keep `workflowMode` `cli-jev` and `packetId` `cli-usage` with no date, run id or policy hash (D1) |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-pair-replay.md` | Modify | Delete the Feature ID bullet at line 111 and split the semicolon at line 98 (D2, D3) |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/severity-replay.md` | Modify | Delete the Feature ID bullet at line 77 (D2) |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-hint-replay.md` | Modify | Delete the Feature ID bullet at line 77 (D2) |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-rater-replay.md` | Modify | Delete the Feature ID bullet at line 84 (D2) |
| `.skilled/skills/sk-communication/manual-testing-playbook/release-gating/offline-judge-census-stops-at-label-gate.md` | Modify | Split the semicolons at lines 32 and 47 into two sentences or a comma (D3) |
| `.skilled/skills/system-spec-kit/changelog/v4.2.0.0.md` | Modify | Split the semicolon at line 28 into two sentences or a comma (D3) |
| `.skilled/skills/cli-classifier/benchmark/reports/README.md` | Modify | Split the semicolon at line 27 into two sentences or a comma (D3) |
| `.skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md` | Modify | Replace the prose use of the banned word at line 143 with "script", "runner" or "check" (D3) |
| `.skilled/skills/sk-design/benchmark/reports/2026-09-27--manual-testing-playbook--hub-routing-replay/skill-benchmark-report.md` | Modify | Replace the prose use of the banned word at lines 68, 74, 192, 205, 231 and 235. Path references keep the folder name (D3) |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/README.md` | Create | The code-folder README: what the check measures, the files, how to run it, the label gate (D4) |
| `.skilled/skills/sk-communication/benchmark/reply-harness/README.md` | Modify | Add the missing `judge-agreement.test.mjs` row beside the `judge-agreement.mjs` row (D4) |

The audit exempts one audited code file from every edit: `.skilled/skills/sk-design/benchmark/reports/2026-09-27--manual-testing-playbook--hub-routing-replay/raw/mode-routing-run.sh` is recorded run evidence and stays byte-identical (this phase's D4).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | **Header conformance (C1).** Each of the 9 C1 files carries the `COMPONENT:` or `MODULE:` marker its header style needs, in the header it already uses. The seven box headers keep their box and gain `COMPONENT:` on the name line, `hvr_reader_lens.py` gains the marker on its Python divider line, and `judge-agreement.test.mjs` gains the three-line header its sibling uses, carrying the `MODULE:` marker. The other box headers stay as their folders use them, and `raw/mode-routing-run.sh` stays byte-identical. |
| REQ-002 | **Bracketed stderr (C2).** Every stderr diagnostic in the 11 C2 scripts starts with `[<script-name>] `, where `<script-name>` is the file base name without extension. Where a default stderr writer exists, it is tagged once, and each direct `process.stderr.write` diagnostic is tagged otherwise. Injected `deps.err` writers in tests stay untouched. Report lines on stdout are program output and do not change. `cli-deem.mjs` keeps its one-JSON-object-per-error-line stderr contract and is exempt. |
| REQ-003 | **Playbook scenarios (D1).** The dated "Observed on ..." paragraphs are removed from `hub-routing/alias-still-resolves.md` and `hub-routing/judgment-request-routes-to-transport.md`. The expected answer shape stays in each expected-result wording: a single route, `workflowMode` `cli-jev`, `packetId` `cli-usage`, with no date, run id or policy hash. |
| REQ-004 | **Catalog entries (D2).** The four `- Feature ID: F0NN` bullets are deleted from the four named entries. Nothing else in those files changes. |
| REQ-005 | **Authored prose (D3).** The five semicolons in prose are split into two sentences or replaced with a comma where the grammar allows. The six prose uses of the banned word are replaced with "script", "runner" or "check" to match what the thing is. Text inside a path or link target is left alone, so the `reply-harness` folder name stays. |
| REQ-006 | **READMEs (D4).** `injection-screen/README.md` is created in the shape of the sibling code-folder README: what the check measures, the files, how to run it, the label gate. The missing `judge-agreement.test.mjs` row is added to the reply check README. Both pass `validate_document.py` and reach DQI band good or better. |
| REQ-007 | **No behavior change.** Headers, stderr tags and doc text only. Stdout report formats and `cli-deem`'s JSON stderr stay as they are. Every changed script's own test suite passes. A test that asserts an exact stderr string is updated in the same step, since the rest match with `includes`. |
| REQ-008 | **Recorded evidence stays byte-identical.** The `raw/` script under the sk-design benchmark report, `raw/mode-routing-run.sh`, is never edited. It is staged out of the drift proof or counted as the one documented exemption. |
| REQ-009 | **No version bump.** No skill version field changes (this phase's D6). The `cli-classifier` and `cli-deem` `SKILL.md` descriptions at 155 and 151 characters stay over the soft 130 target and are recorded, because trimming one changes a routing input. |
| REQ-010 | **Scope and hygiene.** Only the named files and this phase folder change. Comments carry no spec path, phase number or requirement id. Comment hygiene stays clean on the 31 scripts. The key grep exits 1. `validate.sh --strict` prints `RESULT: PASSED`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-011 | **Review before commit (parent goal D5).** MiMo v2.6 Pro reviews every DeepSeek V4.1 Flash diff, and DeepSeek reviews any MiMo fix. No Claude worker writes. P0 and P1 findings are fixed and rechecked, P2 findings are recorded. The session runs the proof commands, records the results and commits path-scoped. |
| REQ-012 | **Worked evidence for the phase docs.** Every tick, number and commit in this folder comes from `scratch/audit/findings.md` or from a command the session ran and read. Where a row has no evidence, it stays open and says why. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `verify_alignment_drift.py --check-exact-headers --fail-on-warn` over a staged copy of the 34 in-scope code files prints `Errors: 0` and `Warnings: 0`, down from the staged copy's 9 errors.
- **SC-002**: Every stderr diagnostic in the 11 C2 scripts starts with `[<script-name>]`, and each changed script's test suite passes with its stdout output unchanged.
- **SC-003**: `validate-playbook-package.cjs --package .skilled/skills/cli-classifier/manual-testing-playbook` exits 0 with status PASS, and `validate_catalog_package.py --json` lists no violation on any of the packet's 28 catalog entries.
- **SC-004**: `hvr_scan.py` over the packet's docs reports hard blockers only on the recorded false positives, and `validate_document.py` returns VALID for all 89 audited docs plus the new `injection-screen/README.md`.
- **SC-005**: Comment hygiene reports 0 violations on the 31 scripts, the key grep exits 1, and `validate.sh --strict` prints `RESULT: PASSED` for this phase.

### Proof Plan

1. Stage a copy of the 34 in-scope code files with `raw/mode-routing-run.sh` left out, run `verify_alignment_drift.py --check-exact-headers --fail-on-warn` over it, and read `Errors: 0` and `Warnings: 0`. Boundary: the staged copy's baseline is 9 errors, so a nonzero count means the batch is incomplete.
2. `grep` each of the 11 C2 scripts for its `[<script-name>]` prefix and run each changed script's own test suite. Boundary: a bare `error:` or `console.error(` line without the tag fails REQ-002.
3. Run `validate-playbook-package.cjs --package .skilled/skills/cli-classifier/manual-testing-playbook` and `validate_catalog_package.py --json`, and read status PASS and no violation whose leaf is one of the packet's 28 catalog entries. Boundary: the two `BAKED_RUN_TRANSCRIPT` errors and the four `packet_history_metadata` violations are the baseline.
4. Run `hvr_scan.py` over the packet's docs and `validate_document.py` over the 89 docs plus the new README. Boundary: the recorded false positives are the only hard blockers allowed, and one non-VALID doc fails REQ-006.
5. Run comment hygiene over the 31 scripts, the key grep, and `validate.sh --strict` on this phase. Boundary: the key grep must exit 1, and `validate.sh` must print `RESULT: PASSED`, not merely lack a failure line.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The audit's line numbers, read at `089693d899` | A line has moved, so an edit lands on the wrong text | The reader re-reads each file before its batch and stops with a report if a line does not match (Law 4) |
| Dependency | The executors (this phase's D5) | No writer or no reviewer | DeepSeek V4.1 Flash writes and MiMo v2.6 Pro reviews, dispatched by Bash. No Claude workers |
| Dependency | The validators in the three skill trees | Another session's align packet may change one mid-phase | The proof runs from the staged copy of the 34 files and names the validator revision it ran. The revision at proof time is UNKNOWN until then |
| Dependency | The audit lists beside `findings.md` | A file in scope is missed | The batch files come from `code.txt`, `md.txt` and `docs.tsv`, and each group's count is checked against the audit's totals: 9, 11, 2, 4, 7, 2 |
| Risk | A header edit clips a shebang or changes a first line | A changed script fails to start | A shebang stays first, `.js` and `.cjs` keep the strict-mode directive, and each suite runs after its batch |
| Risk | A stderr prefix breaks a test that matches an exact string | A suite fails | `findings.md` records that the tests match with `includes`, so a prefix keeps them green. Any exact-string test is updated in the same step |
| Risk | Replacing the banned word changes meaning | A doc reads wrong | The replacement names what the thing is: "script", "runner" or "check" |
| Risk | A version bump would force a routing remint | Out-of-scope work and a stale manifest | D6 forbids the bump. The two over-target descriptions are recorded instead |
| Risk | Other workers edit the same tree during the phase | The gates compare against a moving baseline | The proof runs from the staged 34-file copy and the named docs, and the session records the HEAD it read |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No new process, network call or dependency at runtime. The edits are comments, stderr text and doc prose only.
- **NFR-P02**: Each proof runs over a fixed copy of its inputs, so a repeated run has the same inputs.

### Security
- **NFR-S01**: No key, token or `.env` file is read, written or printed.
- **NFR-S02**: No file outside the named scope changes. The key grep of REQ-010 exits 1.

### Reliability
- **NFR-R01**: Each changed script's own test suite passes before its batch closes.
- **NFR-R02**: The raw evidence script's bytes are identical before and after the phase.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A shebang line stays first, and `.js` and `.cjs` files keep the strict-mode directive after the header.
- A test that asserts an exact stderr string gets the prefix in the same edit. The other tests match with `includes`.
- A stderr writer that already carries a `TAG` constant (`lint-goal-criteria.cjs`, `score-goal-lint.cjs`) is left alone.

### Error Scenarios
- `verify_alignment_drift.py` missing or renamed: stop and report UNKNOWN rather than substituting another checker.
- A line number in `findings.md` that does not match the file: stop and report per Law 4.
- `cli-deem`'s JSON stderr touched by accident: revert the line before any suite runs.

### State Transitions
- Partial completion is safe per group. The C1 files and the C2 scripts overlap by design, and each batch's check stands alone.
- A session that stops mid-phase leaves the six phase docs as the state record, and the open batches stay open.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 28 files across five groups, comments, stderr text and doc prose only |
| Risk | 8/25 | No behavior change, one machine contract exempt, recorded evidence frozen |
| Research | 4/20 | The 2026-09-30 audit fixes the standard, the files and the baseline numbers |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which revision of the validators the other sessions leave in place at proof time. UNKNOWN until the proof runs. The staged 34-file copy keeps the scanned file set fixed.
- Whether the raw evidence script is staged out of the drift scan or counted as the one documented exemption. Both satisfy the audit's proof wording, and the session records which one it ran.
- Where the new README's DQI lands. The floor is band good or better, measured after it is written.
<!-- /ANCHOR:questions -->

---
