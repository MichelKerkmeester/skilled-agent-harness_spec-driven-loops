---
title: "Acceptance Criteria: Phase 14: sk-design-doc-and-routing-check"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "sk design doc and routing check acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check"
    last_updated_at: "2026-09-27T19:45:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "AC-006 amended at close to name generated derivatives; all eight rows Met"
    next_safe_action: "None. The phase is closed; the orchestrator commits"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "AC-006 scope: amended at close to allow generated derivatives, 2026-09-27"
      - "Which md-generator gate option does the owner choose: option A, 2026-09-27"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 14: sk-design-doc-and-routing-check

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check
**Level:** 2
**Status:** Complete
**Date:** 2026-09-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the live front door routes sk-design at build time, When rule 6 is rewritten, Then the file no longer says the hub is outside compiled routing and rule 6 names the front door and the legacy fallback | `node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "make a bar chart of monthly revenue"` prints `"action":"route"` and `sk-design-chart`. `grep -c "not in the compiled closure" .skilled/skills/sk-design/SKILL.md` prints `0`. `grep -n "compiled-route.cjs --hub sk-design" .skilled/skills/sk-design/SKILL.md` shows a hit inside section 5. Observed 2026-09-27 at `31768cc51e` (orchestrator gates g1 and g2): the chart prompt prints action `route` to `sk-design-chart` and the grep prints 0. Rerun read-only while closing the docs: the grep prints 0, and `grep -n` hits line 50 in the section 2 callout and line 203 inside rule 6 under `## 5. RULES` (`:194`). Build commit `fb04862cee`, brief 01. Evidence: `.skilled/skills/sk-design/SKILL.md:202` | Met | - |
| AC-002 | REQ-002 | Given two gate options, When the owner chooses, Then the choice is in this phase's spec before any md-generator file changes | `grep -n "Owner choice: [AB]" specs/cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check/spec.md` prints one line with a date. `git log -G 'Owner choice: [AB]' --format='%h %ad' --date=iso -- <this spec.md>` prints a commit dated no later than this build's first commit in `git log --since='2026-09-27 00:00' --reverse --format='%h %ad' --date=iso -- .skilled/skills/sk-design/sk-design-md-generator`. The query was `--since=2026-09-27` until the close, which git reads as that date at the current time of day, so it printed nothing. Observed: the `grep` prints `Owner choice: A, 2026-09-27, the operator ...` (`spec.md` section 10), and `git log -G` prints `6f47c32dce 2026-09-27 18:04:32 +0200`. The reworded query first lists `094cdb9f8a` at 17:16, another packet's changelog-metadata commit that touches only `changelog/v1.0.0.0.md` and `changelog/v1.1.0.0.md` and no gate text. This build's first md-generator commit is `fb04862cee` at 18:30:45, after the owner choice at 18:04:32. Evidence: `specs/cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check/spec.md:247` | Met | - |
| AC-003 | REQ-003 | Given the owner's choice, When the build applies it, Then docs and code state one gate | Option A: `rg -n 'isPass[^A-Za-z]\|>= ?80' -g '*.md' .skilled/skills/sk-design/sk-design-md-generator` prints nothing and `git diff --stat HEAD~1 -- .skilled/skills/sk-design/sk-design-md-generator/backend` is empty. Option B: `npm test` in `.skilled/skills/sk-design/sk-design-md-generator/backend` exits 0 and its output names the new cases. Observed at `31768cc51e` (g3): `rg` prints nothing, exit 1. `git diff --stat 6f47c32dce..HEAD -- .skilled/skills/sk-design/sk-design-md-generator/backend` is empty, a pinned range rather than `HEAD~1`, since the build spans five commits. Both rerun read-only while closing the docs with the same result. Option A changed 27 lines in 11 files, commit `fb04862cee`. Evidence: `.skilled/skills/sk-design/sk-design-md-generator/references/quality-checklist.md:29` | Met | - |
| AC-004 | REQ-004 | Given the existing admission harness, When it runs on sk-design, Then its gold-scored result is kept in the run folder | `.skilled/skills/sk-design/benchmark/reports/<run-label>/raw/admission.json` exists, and `node -e` over it prints 4 scenario rows and the hub verdict. The report quotes the same counts. Baseline on 2026-09-27: `3 pass, 1 drift`, SD-007 `wrong-mode`, exit 1. Observed: `raw/admission.json` exists in `2026-09-27--manual-testing-playbook--hub-routing-replay` (commit `def91d168d`). The `node -e` over `hubs[0]` prints `drift {"pass":3,"drift":1,"stale-gold":0,"invalid":0,"broken":0,"n/a":0} 4`, rerun read-only while closing the docs. The report's admission row reads 4 scenarios, 3 pass and 1 drift (`SD-007`). Evidence: `.skilled/skills/sk-design/benchmark/reports/2026-09-27--manual-testing-playbook--hub-routing-replay/skill-benchmark-report.md:51` | Met | - |
| AC-005 | REQ-005 | Given 49 mode scenarios with no gold frontmatter, When each prompt is routed at `--hub sk-design`, Then the report states the first routing accuracy over 53 scenarios | `grep -c '^### ' .skilled/skills/sk-design/benchmark/reports/<run-label>/raw/mode-routing.txt` prints `49`. The report prints `N of M scored` with M plus the n/a count equal to 53, and names every miss and n/a. `grep -c '<run-label>' .skilled/skills/sk-design/benchmark/README.md` prints 1 or more. Observed, rerun read-only while closing the docs: `grep -c '^### '` prints 49 and `grep -c '^RC: 0$'` prints 49. The report prints **40 of 52 scored, 1 n/a (`SKD-031`), 12 misses**, so M plus n/a is 53, and the orchestrator recounted it against `raw/`. The README `grep -c` prints 1. Evidence: `.skilled/skills/sk-design/benchmark/reports/2026-09-27--manual-testing-playbook--hub-routing-replay/skill-benchmark-report.md:47` | Met | - |
| AC-006 | REQ-006 | Given the phase's scope, When the build ends, Then only sk-design files, this phase's docs and generated derivatives of in-scope sources changed, and no model was called | `git show --name-only --format= fb04862cee def91d168d 31768cc51e` lists only paths under `.skilled/skills/sk-design/` and this phase folder, plus generated derivatives of in-scope sources: the `sync-skills-hermes.cjs` copies under `.hermes/skills/` of changed sk-design `SKILL.md` files, and `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-design/manifest.json` with its `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-design/manifest.json` mirror, which the pre-commit route-remint gate re-mints. No other `.skilled/bin` file changes. `grep -oE 'node [^ ]+' .skilled/skills/sk-design/benchmark/reports/<run-label>/raw/mode-routing-run.sh \| sort -u` prints only `node .skilled/bin/compiled-route.cjs`. Amended at close by the orchestrator (see the `goal.md` log). Observed 2026-09-27 by the orchestrator and rerun read-only while closing the docs: the `git show` lists exactly four paths outside `.skilled/skills/sk-design/` and this phase, the two Hermes copies and the two manifests. Both Hermes files carry `<!-- generated by sync-skills-hermes.cjs; do not edit -->` (line 11 and line 8). Each manifest diff changes only `effectivePolicyHash` (`b150477a...` to `cdc87474...`), because the gate re-mints it whenever a hub `SKILL.md` is staged, whichever SD-007 option is taken. The `grep -oE` prints only `node .skilled/bin/compiled-route.cjs`. Evidence: `.skilled/skills/sk-design/benchmark/reports/2026-09-27--manual-testing-playbook--hub-routing-replay/raw/mode-routing-run.sh:9` | Met | - |
| AC-007 | REQ-007 | Given the build evidence, When the phase docs are refreshed, Then the phase validates | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check --strict` prints `RESULT: PASSED`. Observed on the final state of this closure: `validate.sh --strict` prints `RESULT: PASSED` (see `implementation-summary.md` Verification). Evidence: `specs/cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check/implementation-summary.md:133` | Met | - |
| AC-008 | REQ-008 | Given the replay baseline and the owner's yes on the diagnosed fix, When the fix lands, Then SD-007 routes to its gold and nothing else regresses | The report names SD-007's cause. `grep -n "SD-007 fix approved:"` on this phase's `spec.md` prints one line. `node .skilled/bin/compiled-route-admission.cjs --hub sk-design` prints `4 pass, 0 drift` and exits 0. `node .skilled/bin/compiled-route-status.cjs --hub sk-design` prints `"causeCode":"compiled-serving"`. Comparing the post-fix `raw/` capture with the baseline capture lists no scenario that matched its gold before and misses after. Observed by the orchestrator at `31768cc51e`: report section 6 names the cause, a prompt that asks for flowcharts and names no chart, with `flowchart` in diagram's vocabulary (`hub-router.json:125-127`). `grep -n "SD-007 fix approved:"` prints one line, committed in `c114d00d97` before the fix. Admission prints "sk-design pass 4 pass, 0 drift, 0 stale, 0 n/a; 3 mode(s) without gold", exit 0, and status prints `"causeCode":"compiled-serving"`, exit 0. `raw/mode-routing-after-fix.txt` is byte-identical to `raw/mode-routing.txt` (`cmp` rerun while closing the docs), so no scenario moved. Fix commit `31768cc51e`. Evidence: `.skilled/skills/sk-design/benchmark/reports/2026-09-27--manual-testing-playbook--hub-routing-replay/skill-benchmark-report.md:186` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All eight rows are Met. AC-006 was amended at close by the orchestrator to name the generated derivatives the repository's own generators write: two Hermes copies and the sk-design activation manifest with its mirror. The `goal.md` log records the amendment, and the operator can revert it.
<!-- /ANCHOR:closure -->
