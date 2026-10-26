---
title: "Acceptance Criteria: Runner limit closeout"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "runner limit closeout acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/008-runner-limit-closeout"
    last_updated_at: "2026-10-26T12:13:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed every criterion with the command that produced its evidence"
    next_safe_action: "Hand the packet to the conductor for the commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-runner-limit-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Runner limit closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/015-quality-agnostic-gate/008-runner-limit-closeout
**Level:** 2
**Status:** Complete
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Commands run from the repository root. Set the variables from `tasks.md` (`Q`, `H`, `K`, `P`, `T`). A `\|` inside a table cell stands for a plain `|` in the command. Each row names what its command printed on 2026-10-26.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a hook that names a present checker, a hook that names a missing checker and a hook that names a checker without the execute bit, When the layers probe runs, Then the three cases read `present`, `broken` and `broken` | `node --test --test-reporter=tap --test-name-pattern='^unit: layers' $T` prints `# pass 1` and `# fail 0`. Evidence 2026-10-26: the command printed `# pass 1` and `# fail 0`, and the case reads `present` for a checker that exists, `broken` for a missing checker and `broken` for a checker without the execute bit | Met | - |
| AC-002 | REQ-001 | Given this repository's own pre-commit hook, which names the checker through `SOURCE_ROOT`, When the probe reads it, Then the layer reads `present`, so the resolution did not break the working case | `node $Q/scripts/quality-gate.cjs --files $Q/scripts/lib/run-check.cjs --format json \| node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).layers.pre_commit_hygiene"` prints `present`. Evidence 2026-10-26: the command printed `present` | Met | - |
| AC-003 | REQ-001 | Given a reader of the contract, When `broken` is searched for, Then it is defined as installed but not runnable and names the path it could not resolve | `rg -c 'installed but not runnable' $Q/references/runner-contract.md` prints `1`. Evidence 2026-10-26: the command printed `1` | Met | - |
| AC-004 | REQ-002 | Given a declared generated path in `--files` scope, When the run finishes, Then `dist-staleness` reached the adapter without reading `ERROR` and no file under a dist folder appeared or changed | `node --test --test-reporter=tap --test-name-pattern='^F20' $T` prints `# pass 2` and `# fail 0`. Evidence 2026-10-26: the command printed `# pass 2` and `# fail 0`, F20 asserting a real `fresh` verdict for the declared path and F20b a stale one, with the dist folders unchanged | Met | - |
| AC-005 | REQ-002 | Given a freshness check in read-only mode on a temporary workspace, When it runs, Then no cache record appears and the verdict matches a writable run, and the writable default still writes its record | `node --test --test-reporter=tap --test-name-pattern='^unit: dist read-only' $T` prints `# pass 1` and `# fail 0`. Evidence 2026-10-26: the command printed `# pass 1` and `# fail 0`, with no cache record after the read-only check and one after the writable one | Met | - |
| AC-006 | REQ-002 | Given the four session-start hook configs, When the dist checker is searched for, Then each still calls it on the writable default, the same four calls as before the change | `rg -n 'check-dist-staleness' .claude/settings.json .codex/hooks.json .cursor/hooks.json .devin/hooks.v1.json \| wc -l` prints `4`. Evidence 2026-10-26: the command printed `4` | Met | - |
| AC-007 | REQ-003 | Given 50 changed files in this repository, When the recorded timing command runs five times, Then every line reads under `2.00` and the machine and HEAD are recorded beside them | `for run in 1 2 3 4 5; do /usr/bin/time -p node $Q/scripts/quality-gate.cjs --files $(git ls-files '*.cjs' \| head -50) --format json > /dev/null; done 2>&1 \| rg '^real'` prints five `real` lines, each under `2.00`. Evidence 2026-10-26: the fifth round measured on the final tree and the command printed `real 1.23`, `real 0.86`, `real 0.87`, `real 0.83` and `real 0.90` at a load average of 8.69 at HEAD `f1732e4d95`, and the run before it printed `real 1.10`, `real 0.84`, `real 0.82`, `real 0.97` and `real 0.99` | Met | - |
| AC-008 | REQ-003 | Given a `--files` scope and a worktree scope, When one run finishes, Then the scope and the guard's before-snapshot share one workspace listing, the after-snapshot takes one listing bounded to the folders the scope reaches (so a path a check creates is still seen), and a `--files` run takes no scope listing, taking one bounded listing per guard snapshot over the folders its named files sit in | `node --test --test-reporter=tap --test-name-pattern='^unit: scope listing\|^unit: guard snapshot source' $T` prints `# pass 2` and `# fail 0`. Evidence 2026-10-26: the command printed `# pass 2` and `# fail 0` | Met | - |
| AC-009 | REQ-003 | Given a stand-in check that writes an untracked file inside the scope, When the run finishes, Then it ends with exit 3 and `CHECK_MUTATED_WORKSPACE` naming the path, so the cost change did not weaken the guard | `node --test --test-reporter=tap --test-name-pattern='^unit: argv spawn and guard' $T` prints `# pass 1` and `# fail 0`. Evidence 2026-10-26: the command printed `# pass 1` and `# fail 0` | Met | - |
| AC-010 | REQ-004 | Given the ignored listing measured at the folder bound and over the whole tree, When the decision record and the contract are read, Then the ADR carries both numbers and its decision, and the contract states what the guard sees and does not see | `rg -c '91555\|447' $P/decision-record.md` prints `2`, and `rg -n 'ignored' $Q/references/runner-contract.md` prints the boundary sentence. Evidence 2026-10-26: the first command printed `2` and the second printed five lines, among them the boundary sentence at contract line 55 | Met | - |
| AC-011 | REQ-005 | Given the phase 002 implementation summary, When its limitation list is read, Then items 1, 3, 4 and 5 say what closed each, and item 8 names phase 005, with no other content changed but the continuity block | `rg -c 'closed by' specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/implementation-summary.md` prints `4`, and `rg -c 'phase 005' specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/implementation-summary.md` prints `1`. Evidence 2026-10-26: the two commands printed `4` and `1` | Met | - |
| AC-012 | REQ-006 | Given a foreign repository holding `specs/demo/spec.md` and `specs/demo/notes.js` where every file resolves to `UNKNOWN`, When the runner reads them, Then no spec-folder checklist is listed and the three `.js` style checklists still are | `node --test --test-reporter=tap --test-name-pattern='^F21' $T` prints `# pass 1` and `# fail 0`. Evidence 2026-10-26: the command printed `# pass 1` and `# fail 0` | Met | - |
| AC-013 | REQ-006 | Given this repository's own spec files, When the runner reads them, Then `spec-folder-authoring-checklist.md` is still listed, which is what stops the scope from being drawn too tight | `node $Q/scripts/quality-gate.cjs --files specs/sk-code/015-quality-agnostic-gate/spec.md --format json \| node -p "(v => v.checklists.some((c) => c.file.endsWith('spec-folder-authoring-checklist.md')))(JSON.parse(require('fs').readFileSync(0, 'utf8')))"` prints `true`. Evidence 2026-10-26: the command printed `true` | Met | - |
| AC-014 | REQ-006 | Given the base layer, When its checklist rows are counted, Then one row carries the repository condition and the three `.js` and `.css` rows carry none, so the surface-neutral rows keep matching by path alone | `node -p "require('./$Q/assets/quality-defaults.json').checklists.filter((row) => (row.extensions \|\| []).length && !row.hubRepo).length"` prints `3`. Evidence 2026-10-26: the command printed `3` | Met | - |
| AC-015 | All | Given the finished packet, When the strict validator runs, Then its last line reads `RESULT: PASSED` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict \| tail -1` prints `RESULT: PASSED`. Evidence 2026-10-26: the command printed `RESULT: PASSED`, with `Summary: Errors: 0  Warnings: 0` above it | Met | - |

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

All 15 criteria are Met, each with the command that produced its evidence recorded in its cell on 2026-10-26. The rows that carry the packet are AC-007 for the budget, AC-012 and AC-013 for the checklist scope, and AC-015 for the packet gate. The task rows in `tasks.md` are closed, and the strict validator printed `RESULT: PASSED`.
<!-- /ANCHOR:closure -->
