---
title: "Acceptance Criteria: Phase 14: fix-deep-review-findings"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "fix deep review findings acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings"
    last_updated_at: "2026-11-24T05:19:40Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-fix-deep-review-findings"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 14: fix-deep-review-findings

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `014-fix-deep-review-findings`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the two `_utils.sh` copies, When the parity test runs, Then it passes 5 of 5 | `node --test .skilled/bin/tests/mcp-installers.test.cjs` prints `pass 5` and `fail 0`, and `diff` of the two copies exits 0 | Met | - |
| AC-002 | REQ-002 | Given the Bladebro docs, When `npx -y bladebro` is searched, Then every hit carries an operator yes and the `4.8.2` pin | `rg -n 'npx -y bladebro' .skilled/skills/mcp-browser-use/mcp-bladebro specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md` shows each hit gated and pinned | Met | - |
| AC-003 | REQ-003 | Given the 003 and 004 goals, When their criteria are read, Then each criterion that holds is `[x]` with evidence | `rg -c '^- \[x\]'` on both `goal.md` files equals the count of holding criteria, and both continuity blocks read above 0 percent | Met | - |
| AC-004 | REQ-004 | Given 003's closure surfaces, When they are read together, Then all say AC-002 is Met | `rg -n 'Closeable' 003-mode-relocation/acceptance-criteria.md` prints Yes, and the 003 goal log and summary carry no "Await operator choice on AC-002" | Met | - |
| AC-005 | REQ-005 | Given 005 goal criterion 1, When it is compared with `scratch/after-stage1.jsonl`, Then the wording matches the evidence | Read of `005-routing-and-surfaces/goal.md` criterion 1 against the scratch evidence | Met | - |
| AC-006 | REQ-006 | Given 011's criterion and the parent handoff row, When their checks run on the current tree, Then both pass | `rg -n 'rg -c' 011-bdg-eval-port-note/goal.md ../spec.md` prints nothing for the troubleshooting guide, and the new presence check exits 0 | Met | - |
| AC-007 | REQ-007 | Given the parent handoff table, When `TBD` is searched, Then nothing prints | `rg -n 'TBD\|505-mcp-browser-use-hub' specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md` prints nothing | Met | - |
| AC-008 | REQ-008 | Given the parent docs, When status and continuity are compared, Then spec.md, goal.md and graph-metadata.json agree | Read of the three files' status, `completion_pct` and `next_safe_action` | Met | - |
| AC-009 | REQ-009 | Given the Chrome DevTools packet, When `browser-debugger-cli@alpha` is searched in live docs and scripts, Then nothing prints | `rg -n 'browser-debugger-cli@alpha' .skilled/skills/mcp-browser-use/mcp-chrome-devtools --glob '!changelog/**' --glob '!benchmark/reports/**'` prints nothing, and `install.sh` names `@0.6.10` | Met | - |
| AC-010 | REQ-010 | Given the Bladebro installer, When it is read, Then `npm install` disables lifecycle scripts and a launcher digest check runs before first use | `rg -n 'ignore-scripts' mcp-bladebro/scripts/install.sh` prints the install line, and `bash -n` exits 0 for `install.sh` and `doctor.sh` | Met | - |
| AC-011 | REQ-011 | Given the changelogs, When the parent-skill check runs, Then each packet version matches its newest entry and v1.0.27.0 matches its published text | `parent-skill-check.cjs .skilled/skills/mcp-browser-use` passes `13d-packet-version`, and `git diff` shows v1.0.27.0 back to its 011 text | Met | - |
| AC-012 | REQ-012 | Given the Aside packet, When `page.on(` and `page.context()` are searched in live docs, Then no hit teaches them as working | `rg -n 'page\.on\(\|page\.context\(\)' .skilled/skills/mcp-browser-use/mcp-aside-devtools --glob '!changelog/**'` prints only warnings that they throw | Met | - |
| AC-013 | REQ-013 | Given the Aside example, When it runs with no argument, Then it writes under `./tmp/` | `rg -n 'OUT_DIR' mcp-aside-devtools/examples/repl-evidence-capture.sh` prints the `./tmp/` default, and `bash -n` exits 0 | Met | - |
| AC-014 | REQ-014 | Given the Aside playbook, When its validator runs, Then it prints no warning | `validate-playbook-package.cjs --package .skilled/skills/mcp-browser-use/mcp-aside-devtools/manual-testing-playbook` prints `warnings=0` | Met | - |
| AC-015 | REQ-015 | Given BB-015, When it is read, Then it names the Chrome 136+ default-profile precondition and a triage row for it | `rg -n '136' mcp-bladebro/manual-testing-playbook/real-browser/attach-mode-reads.md` prints the precondition and the triage row | Met | - |
| AC-016 | REQ-016 | Given the ClickUp report, When each evidence citation is resolved, Then every cited file exists or the cell says it was not retained | A listing of the report folder against every path its `results.csv` and README cite | Met | - |
| AC-017 | REQ-017 | Given the hub SKILL.md and ROUTER.md, When they are read, Then both state where a caller-owned or own-Chrome attach routes, matching `hub-router.json` | `rg -n -i 'own chrome' .skilled/skills/mcp-browser-use/SKILL.md .skilled/skills/mcp-browser-use/ROUTER.md` prints the rule in both | Met | - |
| AC-018 | REQ-018 | Given the two 005 REQ-009 prompts, When the advisor scores them, Then `mcp-browser-use` is not recommended above the 0.8 floor | Advisor replay output recorded in the new two-stage replay report, and 005's summary records the closure | Met | - |
| AC-019 | REQ-019 | Given paraphrased tie-break requests, When both stages replay them, Then each reaches its intended mode | The new two-stage replay `results.csv` shows a pass on every paraphrase row and every original row | Met | - |
| AC-020 | REQ-020 | Given the out-of-domain phrases R6 and R7 name, When the advisor scores them, Then none reaches the hub above 0.8, and 005's T020 note states the measured numbers | Advisor replay rows in the new report, and a read of `005-routing-and-surfaces/tasks.md` T020 | Met | - |

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

Every row is Met, each on a check run from the final tree on 2026-11-24:

- AC-001: the parity test prints `pass 5` and `fail 0`, and `diff` of the two `_utils.sh` copies exits 0.
- AC-002: every `npx -y bladebro` hit in the Bladebro packet and the 004 spec names `bladebro@4.8.2` and the operator yes. The 001 research row keeps its original wording under a dated amendment note that gates it.
- AC-003 and AC-004: the 003 and 004 goals each show 5 ticked criteria and `completion_pct: 100`. 003's closure prints `Closeable: Yes`, and no 003 surface still says "Await operator choice on AC-002".
- AC-005 and AC-006: 005 criterion 1 matches its stage-one evidence. 011's criterion is now a presence check, and both of its `rg -q` runs exit 0. The `rg -c` hits left in 011 sit only in its log rows, which record the old count.
- AC-007 and AC-008: `rg -n 'TBD|505-mcp-browser-use-hub'` on the parent spec prints nothing. The parent spec, goal and graph metadata name the same status and next action.
- AC-009 to AC-011: no live Chrome DevTools file names `browser-debugger-cli@alpha`, and `install.sh` installs `@0.6.10`. The Bladebro installer runs `npm install -g --ignore-scripts`, and `bash -n` exits 0 on it and on the doctor. `parent-skill-check.cjs` prints `OK` with 0 warnings and passes `13d-packet-version`, and v1.0.27.0 has no diff against its 011 commit.
- AC-012 to AC-015: every Aside `page.on(` or `page.context()` hit says the call throws on 1.26.626.1517, or is a guarded probe. The example defaults `SESSION_DIR` to `./tmp`, the variable that replaced `OUT_DIR`, and `bash -n` exits 0. All three mode playbooks print `violations=0 warnings=0`. BB-015 states the Chrome 136+ precondition and has a triage row.
- AC-016: the ClickUp report says its raw output was not retained, and every row says the same.
- AC-017: the hub `SKILL.md` and `ROUTER.md` both state the own-Chrome rule.
- AC-018 to AC-020: the 2026-11-24 two-stage replay passes 48 of 49 rows. Every original, paraphrase, contract and out-of-domain row passes, and the advisor gives the hub 0 on all 18 out-of-domain prompts. The one failure is MBU-PB-04, a playbook row the front door routes correctly. 005 records the closure in its summary and in its T020 note. The stage-one half needed the advisor scorer change the operator widened scope to (Q001), with re-pins approved in Q003 and Q004.

<!-- /ANCHOR:closure -->
