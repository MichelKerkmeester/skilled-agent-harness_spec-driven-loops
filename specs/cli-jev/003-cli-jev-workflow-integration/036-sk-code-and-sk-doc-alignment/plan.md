---
title: "Implementation Plan: Phase 36: sk-code-and-sk-doc-alignment"
description: "Bring the 28 files the 2026-09-30 audit names into line with sk-code-opencode and sk-doc, in five batches: header markers, bracketed stderr tags, doc prose fixes, cross-family review, and the proof run. DeepSeek V4.1 Flash writes, MiMo v2.6 Pro reviews. No behavior change and no version bump."
trigger_phrases:
  - "sk code and sk doc alignment plan"
  - "header conformance batches"
  - "stderr tag batch plan"
  - "alignment proof plan"
  - "cross-family review plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 36: sk-code-and-sk-doc-alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`, `.cjs`) and two Python files, standard library only. No new dependency |
| **Framework** | None. The work is comments, stderr text and doc prose |
| **Storage** | None |
| **Testing** | Each changed script's own suite (`node --test`, `python3`) plus sk-code's drift verifier and sk-doc's validators |

### Overview

The 2026-09-30 audit at `scratch/audit/findings.md` read the 130 files the cli-jev 003 packet created between `f9d701bd13` and `089693d899` and found six fix groups: C1, the missing header markers on 9 files. C2, the stderr tags on 11 scripts. D1, two playbook scenarios carrying dated run transcripts. D2, four catalog entries carrying a Feature ID bullet. D3, seven files with prose hard blockers. D4, one missing README and one missing README row. This plan fixes exactly those 28 files, proves the fix with each standard's own validator, and changes no behavior. DeepSeek V4.1 Flash writes each batch, MiMo v2.6 Pro reviews every diff, and the session runs the proof commands and commits path-scoped (parent goal D5, this phase's D5).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator's ask is recorded: 2026-09-30, "Make sure all skills and things we created aligns with sk code opencode and sk doc", "Think feature catalogs, playbooks, readme's", "Use external orchestration"
- [ ] The audit is present and read: `scratch/audit/findings.md`, with the fix lists C1, C2, D1 to D4, the "Recorded, not fixed" list and the baseline results
- [ ] The 28 files and their line numbers are on disk at the audit's revision `089693d899`
- [ ] The validators are present: `verify_alignment_drift.py`, `validate_document.py`, `hvr_scan.py`, `validate-playbook-package.cjs`, `validate_catalog_package.py`, `check-comment-hygiene.sh`
- [ ] Phase 035 is Complete at its label gate (`3d0641004b`), and the three runtime trees are assigned to other sessions' align packets (this phase's D1)
- [ ] The executors are available under the parent D5 roster: DeepSeek V4.1 Flash to write, MiMo v2.6 Pro to review

### Definition of Done
- [ ] The five completion criteria in `goal.md` pass from the final state
- [ ] Every row of `acceptance-criteria.md` is `Met` with its observed command output, or left `Unmet` with the reason
- [ ] MiMo reviewed every DeepSeek diff and DeepSeek reviewed any MiMo fix, with no open P0 or P1 finding (parent D5)
- [ ] Comment hygiene reports 0 violations on the 31 scripts, and the key grep exits 1
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`, `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)`, and `goal.cjs packet` prints `packet_durable_chars` at or under 4000
- [ ] Only the files in `spec.md` section 3 changed, and `raw/mode-routing-run.sh` is byte-identical to `089693d899`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A conformance pass over shipped files. Each group is a bounded batch whose edits are comments, stderr text or doc prose, and each batch closes on its standard's own check. Nothing new is built.

### Key Components
- **Header marker addition (C1)**: adds the missing `COMPONENT:` or `MODULE:` marker to the 9 files findings.md C1 lists, keeping the header style each file already uses. A box stays a box and gains `COMPONENT:` on its name line, `hvr_reader_lens.py` gains the marker on its Python divider line, and `judge-agreement.test.mjs` gains the three-line header its sibling uses, carrying the `MODULE:` marker.
- **Stderr tagger (C2)**: prefixes `[<script-name>] ` at the default stderr writer, or at each direct `process.stderr.write` diagnostic, in the 11 named scripts. `cli-deem.mjs` keeps its JSON stderr contract.
- **Scenario and catalog editor (D1, D2)**: removes the two dated paragraphs and the four Feature ID bullets, keeping each scenario's expected answer shape.
- **Prose editor (D3)**: splits five semicolons and replaces six prose uses of one banned word with "script", "runner" or "check". Path text is left alone.
- **README author (D4)**: writes `injection-screen/README.md` in the sibling README's shape and adds the missing test row to the reply check README.
- **Proof set (C1 to D4)**: a staged copy of the 34 in-scope code files with `raw/mode-routing-run.sh` left out, the playbook and catalog validators, `hvr_scan.py`, `validate_document.py`, comment hygiene, the key grep and `validate.sh --strict`.
- **Review loop (parent D5)**: MiMo reviews every DeepSeek diff, DeepSeek reviews any MiMo fix, P0 and P1 findings close, P2 findings are recorded.

### Data Flow

The audit lists become the batch manifests. Each batch reads its files at `089693d899`, applies its edits and runs its own check. The C1 batch stages a copy of the 34 files for the drift proof. The C2 batch runs each changed script's suite. The doc batches pass `validate_document.py`, `hvr_scan.py`, `validate-playbook-package.cjs` and `validate_catalog_package.py`. The review loop runs read-only over the diffs. The session then runs the five proof commands from the final state and records each result in `goal.md`'s log and `acceptance-criteria.md`.

### Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The 9 C1 code files | A missing `COMPONENT:` or `MODULE:` marker | Add the missing marker in the header style each file already uses | `verify_alignment_drift.py --check-exact-headers --fail-on-warn` over the staged 34-file copy prints `Errors: 0` and `Warnings: 0` |
| The 11 C2 scripts | Bare stderr diagnostics | Update the stderr writer or each diagnostic | Each script's own suite passes, and a grep shows the `[<script-name>]` prefix |
| `cli-deem.mjs` stderr | One JSON object per error line, parsed by callers | Unchanged | `cli-deem.test.mjs` stays green |
| Stdout report lines of every script | Program output | Unchanged | Each suite passes, and the drift scan does not read stdout |
| The two hub-routing scenarios | Dated run transcripts in scenario truth | Remove the dated paragraphs | `validate-playbook-package.cjs --package .skilled/skills/cli-classifier/manual-testing-playbook` exits 0 with status PASS |
| The four runtime catalog entries | A Feature ID bullet each | Delete that one bullet | `validate_catalog_package.py --json` lists no violation whose leaf is one of the packet's 28 catalog entries |
| The seven D3 doc files | Prose hard blockers | Split semicolons, replace the banned word | `hvr_scan.py` reports hard blockers only on the recorded false positives |
| `injection-screen/` and the reply check README | No README and one missing row | Create the README and add the row | `validate_document.py` returns VALID on both, DQI band good or better |
| `raw/mode-routing-run.sh` | Recorded run evidence | Untouched, byte-identical | `cmp` against the `089693d899` copy prints nothing |
| The three runtime trees | Owned by other sessions' align packets | Not a consumer of this phase | No file under the three runtime trees changes |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The fix spans five groups of shipped files, so every producer and consumer of the changed surfaces is inventoried before the first edit.

- Same-class producers, headers: `rg -n 'MODULE:|COMPONENT:|╔' .skilled/hooks/goal/lib .skilled/skills/cli-classifier/cli-deem/scripts .skilled/skills/sk-doc .skilled/skills/system-deep-loop/deep-improvement/scripts .skilled/skills/system-deep-loop/deep-review/scripts .skilled/skills/sk-communication/benchmark`. Every hit is either in the C1 list or on the audit's "already correct" list.
- Same-class producers, stderr: `rg -n 'process\.stderr\.write|console\.error' <the 11 C2 scripts>`. Each site gets the prefix, except the `TAG` writers that already carry one and the `deps.err` writers inside tests.
- Consumers of the changed wording: `rg -n 'BAKED_RUN_TRANSCRIPT|packet_history_metadata|Feature ID' .skilled/skills`. The two scenario files and the four catalog entries are the only packet leaves the validators flag.
- Consumers of the exempt contract: `rg -n 'stderr' .skilled/skills/cli-classifier/cli-deem` and `cli-deem.test.mjs`, which parse one JSON object per line and stay green.
- Matrix axes: five groups (C1, C2, D1, D2, D3, D4), two executors (write and review), and two proof modes for the raw script (staged out or one documented exemption). Required rows are the group totals: 9, 11, 2, 4, 7 and 2.
- Algorithm invariant: a header edit changes no executable line, a stderr prefix changes no stdout line, and a doc edit changes no checker input. Every batch check reads the file content, not only the exit code.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the task checkboxes and state. The five phases below are the plan of record.

**Who builds (parent goal D5, this phase's D5).** DeepSeek V4.1 Flash writes every batch, dispatched by Bash through the external orchestration route. MiMo v2.6 Pro reviews every DeepSeek diff, and DeepSeek reviews any MiMo fix. No Claude worker writes or reviews. The session runs the proof commands, records the results and commits path-scoped. P0 and P1 findings are fixed and rechecked, P2 findings are recorded.

Each phase's observable check:

1. **Code headers (C1).** Add the missing `COMPONENT:` or `MODULE:` marker to the 9 files findings.md C1 lists, in one batch: the seven box headers keep their box and gain `COMPONENT:` on the name line, `hvr_reader_lens.py` gains the marker on its Python divider line, and `judge-agreement.test.mjs` gains the three-line header its sibling uses, carrying the `MODULE:` marker. Check: `verify_alignment_drift.py --check-exact-headers --fail-on-warn` over the staged 34-file copy prints `Errors: 0` and `Warnings: 0`, down from 9 errors over that copy, with `raw/mode-routing-run.sh` staged out or counted as the one documented exemption.
2. **Stderr tags (C2).** Tag the 11 scripts after the C1 batch touches the same files, so each file gets one edit pass. Check: every stderr diagnostic starts `[<script-name>] `, and each changed script's own suite passes. `cli-deem.mjs` is exempt and unchanged.
3. **Docs (D1 to D4).** Remove the two dated paragraphs and the four Feature ID bullets, split the five prose semicolons, replace the six prose uses of the banned word, create `injection-screen/README.md` and add the reply check README row. Check: the playbook package exits 0 with status PASS, the catalog validator lists no violation on the packet's 28 entries, `hvr_scan.py` reports hard blockers only on the recorded false positives, and `validate_document.py` returns VALID on all 89 audited docs plus the new README.
4. **Cross-family review.** MiMo reviews every DeepSeek diff and DeepSeek reviews any MiMo fix. Check: no open P0 or P1 finding, each review's file hashes equal before and after, and P2 findings are recorded.
5. **Verification and closure.** The session runs the five proof commands from the final state: the drift scan over the staged copy, the stderr grep and the changed suites, the playbook and catalog validators, `hvr_scan.py` and `validate_document.py`, and comment hygiene, the key grep and `validate.sh --strict`. Check: each expected result line is read and recorded, then the phase docs and derived metadata are refreshed and the commit is path-scoped.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each changed script's own suite: hooks goal lib, sk-create-goal, sk-create-skill, deep-improvement, deep-review, cli-deem, the reply check and the Python reader lens | `node --test`, `python3` |
| Static code gate | Exact headers on the 34 in-scope code files, comment hygiene on the 31 scripts, the key grep | `verify_alignment_drift.py --check-exact-headers --fail-on-warn`, `check-comment-hygiene.sh` |
| Doc gates | The two playbook scenarios, the four catalog entries, the seven prose files, the two READMEs | `validate-playbook-package.cjs`, `validate_catalog_package.py --json`, `hvr_scan.py`, `validate_document.py` |
| Manual | Read each staged diff for a shebang, a strict-mode directive, a stdout line or a path that moved | Terminal, `git diff` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The 2026-09-30 audit at `scratch/audit/findings.md` | Internal | Read | No fix list exists |
| sk-code-opencode and sk-doc validators | Internal | Present in the three skill trees | No proof can run |
| Phase 035 Complete at its label gate | Internal | Complete, build `3d0641004b` | The injection-screen README row waits |
| DeepSeek V4.1 Flash and MiMo v2.6 Pro | External, dispatched by Bash | Under the parent D5 roster | A batch waits or the phase reports the blocker |
| The three runtime trees owned by other sessions | Internal, other sessions | In progress elsewhere | No impact. Their files are out of scope, and the staged 34-file copy fixes this phase's scan set |
| The revision of the validators at proof time | Internal, other sessions | UNKNOWN until the proof runs | The proof names the revision it ran, and the staged copy fixes the file set |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A changed script's suite fails, a stderr prefix reaches stdout, a validator regresses below the audit baseline, or a file outside the 28 named paths changed.
- **Procedure**: Stop the batch. Revert the offending path-scoped commit with `git revert` on its own commit only. Header, stderr and prose edits carry no behavior, so a revert restores the audit baseline with no migration. No version field changed, so no routing manifest or activation manifest needs a remint.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Headers) ──────┐
                         ├──► Phase 2 (Stderr) ──► Phase 3 (Docs) ──► Phase 4 (Review) ──► Phase 5 (Proof)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1. Code headers (C1) | The audit and the staged 34-file copy | Phase 2, Phase 5 |
| 2. Stderr tags (C2) | Phase 1 on the same files, so each file gets one pass | Phase 5 |
| 3. Docs (D1 to D4) | The audit line numbers | Phase 5 |
| 4. Cross-family review | Phases 1 to 3 | Phase 5 |
| 5. Verification and closure | Phases 1 to 4 | Nothing |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1. Code headers (C1) | Med | One batch of 9 files |
| 2. Stderr tags (C2) | Low | One pass after Phase 1 |
| 3. Docs (D1 to D4) | Med | One batch per doc group |
| 4. Cross-family review | Med | One review round plus one fix round |
| 5. Verification and closure | Low | The five proof commands |
| **Total** | | The five phases above |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline recorded: the staged copy's 9 drift errors, the two playbook errors and the four catalog violations
- [ ] The staged 34-file copy exists, with `raw/mode-routing-run.sh` left out
- [ ] The key grep exits 1 before the first edit

### Rollback Procedure
1. Stop the batch at its failing check.
2. Revert the batch's path-scoped commit with `git revert`, paths only.
3. Rerun the batch's check and the audit baseline commands.
4. Record the revert and the reason in `goal.md`'s log.

### Data Reversal
- **Has data migrations?** No. The edits are comments, stderr text and doc prose.
- **Reversal procedure**: Not applicable. A `git revert` of the path-scoped commit restores the audited bytes.
<!-- /ANCHOR:enhanced-rollback -->

---
