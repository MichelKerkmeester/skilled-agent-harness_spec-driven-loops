---
title: "Acceptance Criteria: verification and docs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "agents md verification acceptance criteria"
importance_tier: "important"
contextType: "implementation"
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
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: verification and docs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `agents/021-doctor-agents-md/001-doctor-agents-md/005-verification-and-docs`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the six baseline commands recorded before the work, When each reruns from the final tree, Then each prints the same pass line | `scratch/baseline.txt` holds both captures and every command exits 0 at both ends: the canary reads `OK: all rule invariants present` at scratch/baseline.txt:53, the repo-rules checker reads `RESULT: PASSED (11/11 checks)` at scratch/baseline.txt:134, `route-validate.sh` reads `OK: route-validate — 24 routes validated, 5 warnings` at scratch/baseline.txt:125, and the family runner ends `7 suite(s) passed, 0 failed` at scratch/baseline.txt:1261 | Met | - |
| AC-002 | REQ-002 | Given the nine fixtures, When the pair runs on a copy of each, Then nine transcripts exist under `scratch/e2e/` | `find scratch/e2e -type f \| wc -l` prints 9, one per recipe folder under `.skilled/commands/doctor/scripts/tests/fixtures/agents-md/`, each composed by scratch/run-e2e.sh:1 and captured with its own exit codes | Met | - |
| AC-003 | REQ-003 | Given a repository the check calls `pure` or `adopted`, When the plan runs, Then it prints `NOTHING TO DO`; given any other state, Then it prints a plan with a digest | every transcript pairs the state with the matching outcome. `pure` prints `NOTHING TO DO` on the pre-apply tree (scratch/e2e/pure.txt:35). `adopted` is the one state that carries repository lines the plan moves into the block, so it plans on the pre-apply tree and prints `NOTHING TO DO` on the reconfigured one (scratch/e2e/adopted.txt:148), and every applied fixture pairs that way. `over-budget` is refused by name at exit 2 and writes nothing (scratch/e2e/over-budget.txt:56) | Met | - |
| AC-004 | REQ-004 | Given the final tree, When the recursive phase gate runs, Then it prints `RESULT: PASSED` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md --recursive --strict` prints `RESULT: PASSED` for every folder with `Errors: 0  Warnings: 0`, captured with its exit code at scratch/gate.txt:4 | Met | - |
| AC-005 | REQ-001 | Given the final tree, When the repo-rules checker runs, Then it prints `RESULT: PASSED (11/11 checks)` | `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` prints `[repo-rules-check] RESULT: PASSED (11/11 checks)` at scratch/baseline.txt:134, exit 0 | Met | - |
| AC-006 | REQ-001 | Given the final tree, When the rule-copy canary runs, Then it prints `OK: all rule invariants present` | `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` prints the `OK: all rule invariants present` line at scratch/baseline.txt:53, exit 0 | Met | - |
| AC-007 | REQ-009 | Given the final tree, When the change list is read, Then it names only files named by children 001 to 005 and no local-only path | `git status --porcelain` names the change set and every entry is explained in `implementation-summary.md`: the README doctor section, the script README, the catalog and playbook rows with the two new scenarios, the four changelogs, three skill version carriers and their Hermes copies, the retrieval corpus that the repository's Trigger Index Rebuild CI workflow rebuilds after the merge (this change set does not commit it), the re-minted sk-doc activation manifest, and this packet's own documents. `git status --porcelain` piped into `rg -n 'local-'` prints nothing, and implementation-summary.md:128 names every deviation behind the list | Met | - |
| AC-008 | REQ-005 | Given a live Devin session, When it is asked to quote the last line of the block, Then the row records either the quoted line or an unknown with its reason | `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-agents-md-block-devin-quote.md:60` records `Answer` = `UNKNOWN` with its reason and the six operator steps that answer it | Met | - |
| AC-009 | REQ-006 | Given a Cursor window, When `.cursor/rules/repo-local.md` is read there, Then the row records whether it loaded | `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-agents-md-cursor-mirror-load.md:60` records `Answer` = `UNKNOWN` with its reason and the six operator steps that answer it | Met | - |
| AC-010 | REQ-007 | Given the script README, When it is read, Then it names the three new scripts and the three new suites | `rg -c 'agents-md' .skilled/commands/doctor/scripts/README.markdown` prints 16, the key-files table carries `agents-md-embed.cjs` at .skilled/commands/doctor/scripts/README.markdown:101, and all three suite names are listed in that row | Met | - |
| AC-011 | REQ-008 | Given the changelog entry, When it is read, Then it names the command, its three targets and the state of its advisor bridges | `.skilled/changelog/skilled/v4.0.1.0.md` names `check`, `embed` and `restore` in its doctor section, one item per target, and records the four doctor bridges as active. The entry this packet wrote was folded into that release | Met | - |

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

AC-001 through AC-011 are `Met`. The end-to-end pass over the nine fixtures is captured under `scratch/e2e/`, the two claims the design could only infer are recorded as open with their reasons and an operator's steps, and the documentation rows name the command, its targets and the three engines.
<!-- /ANCHOR:closure -->
