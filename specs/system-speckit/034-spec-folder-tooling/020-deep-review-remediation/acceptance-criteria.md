---
title: "Acceptance Criteria: Phase 20: deep-review-remediation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "deep review remediation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/020-deep-review-remediation"
    last_updated_at: "2026-10-10T10:30:00Z"
    last_updated_by: "lane-h"
    recent_action: "Fourteen rows Met on the G4 final-state gate. AC-005 and AC-006 Unmet as CI rows"
    next_safe_action: "Commit the phase, then read the post-push CI for AC-005 and AC-006"
    blockers: ["AC-005 and AC-006: the live Trigger Index Rebuild run after the push", "CHK-020 and CHK-FIX-007: the post-push follow-up"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "lane-h-020-deep-review-remediation"
      parent_session_id: null
    completion_pct: 87
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 20: deep-review-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/020-deep-review-remediation
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a `z_archive` symlink to a directory outside `specs`, When archive.sh archives a packet, Then it refuses before any copy, the outside directory stays empty and the source packet stays in place | Red `scratch/evidence/lane-a-red.txt` (9 of 32 archive-track cases fail). Green `scratch/evidence/lane-a-green.txt` (32 passed). Dot-segment cases: `lane-a-dotseg-red.txt` (4 failed), `lane-a-dotseg-green.txt` (4 passed). Final targeted run: `final-targeted-vitest.txt` | Met | - |
| AC-002 | REQ-002 | Given a packet whose `spec.md` or `tasks.md` is a symlink to an outside file, When the default healer runs with `--apply`, Then the outside file keeps its bytes | Red `scratch/evidence/lane-b-red.txt` (4 of 4 containment cases fail). Green `scratch/evidence/lane-b-green.txt` (5 passed). Lane modes and the heal suite: `lane-b-final-vitest.txt` (131 passed) | Met | - |
| AC-003 | REQ-003 | Given one fixture, When the three healer entrypoints resolve `--folder`, `--roots` and the default root, Then each selects the same targets as before the extraction, and one definition remains | `scratch/evidence/lane-b-parity.txt`: before and after dry-run selections match for the default, anchor and lane entrypoints (diff exit 0 each). A mutation of the lane-modes selection fails the parity test (`lane-b-parity-red.txt`, 1 failed), and the unmutated suite passes (green in `final-targeted-vitest.txt`) | Met | - |
| AC-004 | REQ-004 | Given a default root or a declared scope symlinked outside the skill, When the leaf walker runs, Then it refuses that start scope before reading it, and the manifest keeps its bytes | Red `scratch/evidence/lane-c-red.txt` (missing expected exception). Green `scratch/evidence/lane-c-green.txt` and `lane-c-final.txt` (scope contract coverage passed, exit 0) | Met | - |
| AC-005 | REQ-005 | Given `trigger-index-rebuild.yml`, When it is parsed, Then checkout sets `persist-credentials: false` and the write token appears only in the push step | CI row, left Unmet for the orchestrator. Local evidence: the workflow sets `persist-credentials: false` at line 35, and `PUSH_TOKEN` appears only in the env of the push step at line 157, which runs git only after the operator's restructure decision of 2026-10-10. `scratch/evidence/post-review-trigger-green-bash32.txt` and `post-review-trigger-green-bash52.txt` (38 passed each) run the workflow's run blocks against a scratch origin under bash 3.2 and bash 5.2, and the workflow test checks the token is absent from the step output and git config. The mutant reds in `post-review-trigger-red-*.txt` fail as expected. `lane-d-harness.txt` (29 passed) predates the restructure. `post-review-trigger-workflow-checks.txt` records actionlint exit 0 on the restructured file. The live run after the push is the receipt this row needs | Unmet | - |
| AC-006 | REQ-006 | Given a retry generator that exits nonzero after writing a partial sidecar, When the retry step runs, Then the job fails and the four outputs are checked for content and freshness, not existence | CI row, left Unmet for the orchestrator. Local evidence in `scratch/evidence/lane-d-harness.txt`: R1 and R2 (a nonzero retry generator fails the block and nothing is pushed), S and F (a stale sidecar fails the block). The live run after the push is the receipt this row needs | Unmet | - |
| AC-007 | REQ-007 | Given a packet title with an embedded newline, When the report producer feeds the Actions workflow, Then no packet-controlled line can start a workflow command | `scratch/evidence/workflow-command-trace.txt`. Route 1, the freshness sweep: red `lane-d-freshness-stop-commands-red.txt` (the injected line starts a command), green `lane-d-freshness-stop-commands-green.txt` (the line sits inside the stop-commands block). Route 2, repair output, uses the same wrapper and has no separate red run. Route 3, the changed-packet annotations, cannot receive a raw newline, and the percent-decoding case is tested and closed by the hostile replay (`scratch/evidence/route3-hostile-old.txt` and `route3-hostile-new.txt`), which prints one `::error` line per packet with `%` escaped first | Met | - |
| AC-008 | REQ-008 | Given an authored eight-token trigger that ends in a stop word, When phrase cleanup runs with `--apply`, Then the phrase stays byte-identical, and a generated phrase is still trimmed | Red `scratch/evidence/lane-e-red.txt` (the authored-phrase case fails, 1 of 29). Green `scratch/evidence/lane-e-green.txt` (29 passed), including the generated-phrase trim case | Met | - |
| AC-009 | REQ-009 | Given a symlinked apply or move target outside `specs`, When upgrade-legacy runs with apply, Then nothing is written or moved outside `specs`, and each apply and move path has a guard | `scratch/evidence/upgrade-symlink-audit.txt` lists each apply and move path with its guard. Red `lane-f-red.txt` (4 failed), green `lane-f-green.txt` (7 passed). Linked baseline census red `lane-f-census-red.txt`, green `lane-f-census-green.txt`. Linked archived spec red `lane-f-archived-red.txt`, green `lane-f-archived-green.txt` | Met | - |
| AC-010 | REQ-010 | Given the canonical SKILL.md, its Hermes copy and `speckit-implement.yaml`, When each Gate 3 section is read, Then each states the child-dispatch pre-resolution, and `sync-skills-hermes.cjs --check` passes | `scratch/evidence/child-dispatch-check.txt`: the AI_SESSION_CHILD count is 0 at HEAD and 7, 7 and 1 now (`scratch/evidence/closure-child-marker-part3.txt`, section 3) (SKILL.md, Hermes copy, implement YAML). The plan and complete YAMLs carry child_dispatch branches. Sync check: `lane-g-sync-check.txt` (PASS, 70 copies in sync) | Met | - |
| AC-011 | REQ-011 | Given the canonical SKILL.md and its Hermes copy, When they are diffed in full, Then every hunk is named and classed as fixed by REQ-010 or kept with a reason | `scratch/evidence/hermes-skill-diff.txt`: three hunk classes (the generated header, the link rewrites at Hermes lines 105, 108 to 110, 467 and 490). The child-dispatch text is identical in both files, so no hunk is a child-dispatch difference | Met | - |
| AC-012 | REQ-012 | Given a repository with neither the v4 nor the legacy root, When the repo-era classifier runs, Then it returns unknown, and the catalog sentence says the same | `scratch/evidence/lane-g-repo-era-none.json` (kind unknown). `lane-g-repo-era-legacy.json` (kind v3 with a legacy root). The catalog sentence in `repo-era-report.md` names the unknown case (`lane-g-catalog-validate.txt`, VALID). `catalog-package-system-spec-kit.txt`: 85 warnings, 0 failures, exit 0 | Met | - |
| AC-013 | REQ-013 | Given the parent's handoff table, When rows 017 to 018, 018 to 019 and 019 to 020 are read, Then each carries real criteria and cites the child evidence it rests on | `scratch/evidence/handoff-rows-check.txt`. Rechecked at this state: the parent `spec.md` holds no `TBD` (grep count 0), and every cited child file is present | Met | - |
| AC-014 | REQ-014 | Given phase 019 SC-002, When main CI is read for `079e9c34d2` and its bot commit `4669db6522`, Then SC-002 is recorded as met with its receipt | `019-epic-follow-up-fixes/scratch/evidence/post-push-ci.txt`: 14 of 14 checks succeeded on `079e9c34d2`, and 11 succeeded on `4669db6522`, whose Trigger Index Rebuild was skipped by the guard | Met | - |
| AC-015 | REQ-015 | Given phase 010, When its tasks, its summary and main CI are read, Then its status in the parent matches its record | `scratch/evidence/actionlint-final.txt`: actionlint exits 0 on every workflow, and a negative control on a bad workflow exits 1. Phase 010 `tasks.md` closes T009 and T011, `spec.md` reads Complete, and the parent row for 010 reads Complete | Met | - |
| AC-016 | REQ-016 | Given the final state, When the CLI suite, the doctor suites, the hooks suite and the three strict validates run, Then each passes at its baseline, with no failure | Met on the G4 final-state gate. The CLI suite (job j01, `cli-npm-test 0`) passed 1953 tests, with 20 skipped and 0 failed. The doctor suites (job j05) passed 7 of 7, and the hooks suite (job j04) passed 186 with 0 failed and 3 skipped (`closure-gate-final4.txt`). The strict validates are `closure-validate-020-part3.txt`, `closure-validate-034-recursive-part3.txt`, `closure-validate-010-part3.txt`, `closure-validate-016-part3.txt` and `closure-validate-019-part3.txt`, all run on the G4 final state. The deep-loop job (j03) is outside this row | Met | - |

**Note on AC-006 (wording only, not a scope change).** The retry that the Given clause describes was removed by the operator's restructure decision of 2026-10-10. The equivalent check is now the regenerate step, which runs under `set -euo pipefail` and fails the job before any commit when the generator exits nonzero, followed by the verify step, which regenerates into a scratch directory and compares the four outputs for content and freshness. The R1, R2, S and F cases in `lane-d-harness.txt` ran against the removed retry block, so they are historical evidence only. The status stays Unmet until the post-push CI run records the live receipt.

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

**Closeable:** No. Two rows are Unmet: AC-005 and AC-006, which are CI rows that need the live workflow run after the push. Fourteen rows are Met on the gate and lane evidence named in their Verification cells. No row has a waiver, and no decision record exists in this packet.

The code rows close on a red run captured before the fix and a green run after it. Where a red run was not captured for a row, its Verification cell says so. AC-005 and AC-006 are left Unmet as the operator's CI rows, so the orchestrator decides them from the post-push run.
<!-- /ANCHOR:closure -->
