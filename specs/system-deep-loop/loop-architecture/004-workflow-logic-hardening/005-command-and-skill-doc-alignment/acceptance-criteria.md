---
title: "Acceptance Criteria: Phase 5: command-and-skill-doc-alignment"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "command and skill doc alignment acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/005-command-and-skill-doc-alignment"
    last_updated_at: "2026-11-14T11:33:23Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-command-and-skill-doc-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: command-and-skill-doc-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 004-workflow-logic-hardening/005-command-and-skill-doc-alignment
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the start commit before any doc edit, When `node .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs --facts` runs, Then it exits 1 and names `deep-research/SKILL.md:92`. Given the final tree, When the same command runs, Then it exits 0 and prints `"errors": []` | `node .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs --facts` output for both trees, logged in `goal.md`. Observed: exit 1 with 463 errors on the first run, naming `deep-research/SKILL.md:92`. Exit 0 and `"errors": []` on the final tree | Met | - |
| AC-002 | REQ-002 | Given the final tree, When the budget lines are searched, Then no mode skill, reference or agent file states a tool-call number and each names its owner | `rg -n 'max 12\|default: 12\|8-11' .skilled/skills/system-deep-loop/deep-research/SKILL.md .skilled/skills/system-deep-loop/deep-review/SKILL.md .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md .skilled/agents/deep-research.md` prints nothing. Observed: the `rg` prints nothing. Evidence at `.skilled/skills/system-deep-loop/deep-research/SKILL.md:112` | Met | - |
| AC-003 | REQ-003 | Given each command doc, When its directive is counted and searched, Then it holds one directive, no runtime binary and no research wording in review | `rg -c 'AUTONOMOUS EXECUTION DIRECTIVE' .skilled/commands/deep/research.md .skilled/commands/deep/review.md` prints 1 per file and `rg -n 'opencode run\|research topic' .skilled/commands/deep/review.md` prints nothing. Observed: 1 per file, and the second `rg` prints nothing. Evidence at `.skilled/commands/deep/review.md:51` | Met | - |
| AC-004 | REQ-004 | Given `EXECUTOR_KINDS` in `executor-config.ts`, When the facts check reads `deep-research/SKILL.md`, Then it reports no executor count mismatch | `rg -n 'nine executor kinds' .skilled/skills/system-deep-loop/deep-research/SKILL.md` prints nothing and `node .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs --facts` exits 0. Observed: the `rg` prints nothing and the facts check exits 0. Evidence at `.skilled/skills/system-deep-loop/deep-research/SKILL.md:100` | Met | - |
| AC-005 | REQ-005 | Given `deep-review/SKILL.md`, When its script paths are resolved, Then each exists and the reducer is `runtime/scripts/reduce-state.cjs` | `rg -n 'runtime/scripts/reduce-state.cjs' .skilled/skills/system-deep-loop/deep-review/SKILL.md` prints at least 1 line and `node .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs --facts` exits 0. Observed: 3 lines, and the facts check exits 0. Evidence at `.skilled/skills/system-deep-loop/deep-review/SKILL.md:59` | Met | - |
| AC-006 | REQ-006 | Given the doc scan set without changelogs, benchmarks and tests, When the stale-name inventory runs, Then it finds no missing workflow file | The T057 inventory command in `tasks.md` prints 0. Observed: printed 0. Evidence at `.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:129` | Met | - |
| AC-007 | REQ-007 | Given `deep-research/SKILL.md`, When its rules are searched, Then one research.md ownership rule, a leaf-scoped no-ask rule and the command workflow as dispatcher remain | `rg -n 'never replace\|@orchestrate dispatches' .skilled/skills/system-deep-loop/deep-research/SKILL.md` prints nothing. Observed: the `rg` prints nothing. Evidence at `.skilled/skills/system-deep-loop/deep-research/SKILL.md:218` | Met | - |
| AC-008 | REQ-008 | Given each command doc, When the facts check compares the routing step with the flag table, Then it reports no routing mismatch | `node .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs --facts` exits 0. Observed: exit 0. Evidence at `.skilled/commands/deep/research.md:84` | Met | - |
| AC-009 | REQ-009 | Given both command docs, When their `##` headings are listed, Then the lists match | `diff <(rg -o '^## .*' .skilled/commands/deep/research.md) <(rg -o '^## .*' .skilled/commands/deep/review.md)` prints nothing. Observed: the `diff` prints nothing. Evidence at `.skilled/commands/deep/review.md:27` | Met | - |
| AC-010 | REQ-010 | Given phase 003 is Complete, When the research flag table is searched, Then it lists `--restart` and `--lineage-mode`, and the review table holds the `--dry-run` row phase 004 added | `rg -n '^\| \x60--(restart\|lineage-mode)' .skilled/commands/deep/research.md` prints 2 lines and `rg -c '^\| \x60--dry-run' .skilled/commands/deep/review.md` prints 1. Observed: 2 lines and 1. Evidence at `.skilled/commands/deep/research.md:109` | Met | - |
| AC-011 | REQ-011 | Given `convergence.cjs`, `deep-research.yaml` and `deep-review.yaml` exist, When each mode skill is searched, Then it names the stop script, `maxDurationReached` and its workflow file, and the facts check finds no missing file | `rg -l 'runtime/scripts/convergence.cjs' .skilled/skills/system-deep-loop/deep-research/SKILL.md .skilled/skills/system-deep-loop/deep-review/SKILL.md` prints 2 paths, `rg -c maxDurationReached` prints at least 1 per skill and `node .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs --facts` exits 0. Observed: 2 paths, 2 per skill, and the facts check exits 0. Evidence at `.skilled/skills/system-deep-loop/deep-review/SKILL.md:228` | Met | - |
| AC-012 | REQ-012 | Given each packet with a changed file, When its changelog folder is listed, Then the newest entry names the changed files | `ls -t <folder> \| head -1` for each of the five changelog folders in `plan.md` names a file dated after the start commit. Observed: `v1.15.13.0.md`, `v1.11.15.0.md`, `v1.9.17.0.md`, `v1.0.12.0.md` and `v2.1.19.0.md`, each written on 2026-11-14 and each naming its changed files. Evidence at `.skilled/skills/system-deep-loop/runtime/changelog/v1.9.17.0.md:23` | Met | - |
| AC-013 | REQ-013 | Given phase 001's frozen stop-reason list, When section 2 of `deep-research/references/convergence/convergence.md` is read, Then its table lists every value including `manualStop` and `maxDurationReached` | `sed -n '/^## 2\./,/^## 3\./p' .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md \| rg -c 'manualStop\|maxDurationReached'` prints at least 2. Observed: printed 2. Evidence at `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:94` | Met | - |
| AC-014 | REQ-014 | Given phase 001 D4, When step 7 of section 3 in the same file is read, Then it says a missing graph decision blocks every non-terminal STOP | `rg -n 'If graphEvents exist' .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` prints nothing. Observed: the `rg` prints nothing. Evidence at `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:123` | Met | - |
| AC-015 | REQ-015 | Given the review agent and its mirrors, When they are searched for the deleted twins, Then none is named and the contract test that reads them passes | `rg -l 'deep-review-(auto\|confirm)' .skilled/agents .claude/agents .opencode/agents .pi/agents .codex/agents .dsh/agents` prints nothing and `deep-review-contract-parity.vitest.ts` exits 0. Observed: the `rg` prints nothing and the test file passes inside 21 passed spec-kit contract tests. Evidence at `.skilled/agents/deep-review.md:310` | Met | - |
| AC-016 | REQ-016 | Given the sk-doc and sk-code command docs, When they are searched for the deleted workflow files, Then neither names one | `rg -n 'deep-research-(auto\|confirm)' .skilled/skills/sk-doc/sk-create-command/SKILL.md .skilled/skills/sk-code/sk-code-skilled/assets/checklists/command-authoring.md` prints nothing. Observed: the `rg` prints nothing. Evidence at `.skilled/skills/sk-doc/sk-create-command/SKILL.md:148` | Met | - |
| AC-017 | REQ-017 | Given the speckit README, When it is searched, Then it names no deleted workflow file and no stop reason outside the frozen list | `rg -n 'deep-(research\|review)-(auto\|confirm)\|stopReason' .skilled/skills/system-spec-kit/README.md` prints nothing. Observed: the `rg` prints nothing. Evidence at `.skilled/commands/speckit/README.txt:158` | Met | - |
| AC-018 | REQ-018 | Given `deep-review/SKILL.md`, When its no-ask rule is read, Then it applies to the leaf agent and names `:confirm` as the workflow's ask point | `rg -n -A1 'Ask the user' .skilled/skills/system-deep-loop/deep-review/SKILL.md` prints a line naming the leaf agent. Observed: line 255 reads `The leaf agent never asks.`. Evidence at `.skilled/skills/system-deep-loop/deep-review/SKILL.md:255` | Met | - |
| AC-019 | REQ-019 | Given phase 002's failure rule, When both mode skills are searched for the gate, Then each describes Retry, Skip or Cancel as a confirm-only checkpoint | `rg -n 'Retry' .skilled/skills/system-deep-loop/deep-research/SKILL.md .skilled/skills/system-deep-loop/deep-review/SKILL.md` prints lines that name confirm mode. Observed: three lines, each naming confirm mode. Evidence at `.skilled/skills/system-deep-loop/deep-research/SKILL.md:86` | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Yes. Every criterion is met, with the observed result written in its Verification cell.
<!-- /ANCHOR:closure -->
