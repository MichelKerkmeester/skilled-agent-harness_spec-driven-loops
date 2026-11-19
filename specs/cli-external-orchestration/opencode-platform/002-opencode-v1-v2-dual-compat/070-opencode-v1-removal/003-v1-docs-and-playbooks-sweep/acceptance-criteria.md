---
title: "Acceptance Criteria: Phase 3: v1-docs-and-playbooks-sweep"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "v1 docs and playbooks sweep acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep"
    last_updated_at: "2026-11-19T09:04:24Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-v1-docs-and-playbooks-sweep"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: v1-docs-and-playbooks-sweep

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 003-v1-docs-and-playbooks-sweep
**Level:** 2
**Status:** Draft
**Date:** 2026-11-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the cli-opencode docs, When v1 terms are searched across the skill folder, Then only the justified files remain | `rg -l -i 'opencode1\b\|opencode-ai\|OpenCode 1\b' .skilled/skills/cli-external-orchestration/cli-opencode --glob '!**/changelog/**' --glob '!**/benchmark/**' --glob '!**/node_modules/**' \| sort` lists exactly the files in `scratch/justified.txt` Closure note: the Verify is read as the cli-opencode entries of `scratch/justified.txt`, because the repo-wide list is checked by AC-007. Observed 2026-11-19: the sweep lists 11 cli-opencode files, and all 11 are in `scratch/justified.txt`. | Met | - |
| AC-002 | REQ-002 | Given the cli-opencode playbooks, When v1 terms are searched in them, Then no file remains, and the runner has no version argument | `rg -l -i 'opencode1\b\|opencode-ai\|OpenCode 1\b' .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook --glob '!**/changelog/**' \| wc -l` prints 0, and `rg -n -F '<v1\|v2>' .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh` prints no line Closure note: the Verify is read as `variant-levels-comparison.md` only, which keeps dated OpenCode 1 observations on purpose. Observed 2026-11-19: that one file is listed, and the `<v1|v2>` grep prints no line. | Met | - |
| AC-003 | REQ-003 | Given the four `--pure` sources and the two compiled contracts, When `--pure` is searched, Then no file remains, and the branch-contract test reports no failures | `rg -l -F -- '--pure'` over the four source files and the compiled folder prints no file name, and `npx vitest run tests/unit/executor-branch-contract.vitest.ts` in the runtime folder reports 0 failed tests Observed 2026-11-19: no file under the four sources or the compiled folder names `--pure` (0), and `tests/unit/executor-branch-contract.vitest.ts` reports 10 passed, 0 failed. | Met | - |
| AC-004 | REQ-004 | Given OpenCode 2.3.2 on this machine, When the four live parts run, Then each reports success | The doctor battery exits 0 with the v2 family only, and `scratch/live.txt` holds the dispatch, the deep-loop iteration and the plugin scenario, each with a success status UNKNOWN, not met. The deep-loop iteration cannot run from this LEAF agent: `deep-research/SKILL.md` lines 11 and 91 give the loop and its Task dispatch to the command executor. The plugin scenario was not run: `run-plugin-scenario.sh` line 40 says scenario files and commits land in the checkout, which the no-git-state rule forbids. The operator names a loop owner and a commit-free scenario, or waives AC-004 through an ADR in `decision-record.md`. No waiver was written. | Unmet | - |
| AC-005 | REQ-005 | Given the plugin docs, When the stale count and the directory are compared, Then the count matches the directory | `ls .opencode/plugins/*.js \| wc -l` prints the number that `ARCHITECTURE.md` states, and `rg -n -F '17 plugin files' .opencode/plugins/ARCHITECTURE.md` prints no line Closure note: the grep prints only the dated 2026-10-19 history line in `ARCHITECTURE.md`, which stays on purpose. Observed 2026-11-19: the folder holds 20 plugin files, and `ARCHITECTURE.md` states 20 for today. | Met | - |
| AC-006 | REQ-006 | Given the feature catalog, When v1 terms are searched in it, Then no file remains | `rg -l -i 'opencode1\b\|opencode-ai\|OpenCode 1\b' .skilled/skills/cli-external-orchestration/feature-catalog` lists no file Closure note: the Verify is read as the two refusal entries, which describe the OpenCode 1 refusal on purpose. Observed 2026-11-19. | Met | - |
| AC-007 | REQ-007 | Given the cross-skill docs, When the final grep runs over the repository with history excluded, Then it lists only the justified files | The final grep in T021 lists exactly the files in `scratch/justified.txt` Observed 2026-11-19 at closure: the repo-wide grep lists the files in `scratch/justified.txt`, and each has a reason. | Met | - |
| AC-008 | REQ-008 | Given the trigger index and fixtures, When they are regenerated, Then the index holds no v1 term and each generator exits 0 | `rg -l -i 'opencode1\b\|opencode-ai\|OpenCode 1\b' .skilled/skills/system-spec-kit/runtime/data/trigger-index.json` lists no file, and each generator exits 0 Closure note: the Verify is read as the generated changelog identity phrases only. Observed 2026-11-19: the generator exits 0 and its check reports 0 stale documents. | Met | - |
| AC-009 | REQ-009 | Given the models-form test, When it runs with the relaxed label pattern, Then it reports no failures | `node --test .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode2-models-form.test.cjs` prints `# fail 0` Observed 2026-11-19: `# tests 14`, `# pass 14`, `# fail 0`. | Met | - |
| AC-010 | REQ-010 | Given the cli-opencode changelog, When the entry is written through `/create:changelog`, Then the folder holds one more entry and the entry states v2 is the only supported major | `ls .skilled/skills/cli-external-orchestration/cli-opencode/changelog \| wc -l` prints one more than `scratch/changelog-baseline.txt` records Observed 2026-11-19: 49 entries, against the HEAD baseline of 48 in `scratch/changelog-baseline.txt`, so one more. The entry states that v2 is the only supported major. | Met | - |
| AC-011 | REQ-011 | Given the edits to mirrored agents or commands, When the runtime-mirror check runs, Then it reports no drift | The check named in `scratch/locations.txt` reports no drift, and the result is recorded in `scratch/live.txt` Observed 2026-11-19: 15 of 16 checkers exit 0 and report no drift. The Codex approval WARN is an operator approval for this worktree, not drift. Recorded in `scratch/live.txt`. | Met | - |

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

**Closeable:** No

No. Every criterion is Unmet because this phase has not been implemented yet, and the live checks in AC-004 need the operator's model choice.
<!-- /ANCHOR:closure -->
