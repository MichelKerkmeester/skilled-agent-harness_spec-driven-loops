---
title: "Tasks: Phase 1: scenario-contract"
description: "Ordered tasks for the conversation block: baselines first, then the reference, the validator change and its tests, then the template, SKILL.md and the leaf manifest, then the before-and-after comparison."
trigger_phrases:
  - "scenario contract tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/065-conversation-playbook-scenarios/001-scenario-contract"
    last_updated_at: "2026-11-01T21:11:38Z"
    last_updated_by: "planning-session"
    recent_action: "Planned 15 tasks across setup, implementation and verification"
    next_safe_action: "Run T001 to record the fleet baseline"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: scenario-contract

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `.skilled/skills/sk-doc/sk-create-manual-testing-playbook`. `V` is `$S/scripts/validate-playbook-package.cjs`. Commands run from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the fleet baseline (`scratch/fleet-before.json`). Verify: `node $V --format json > scratch/fleet-before.json` runs, and the counting one-liner from `spec.md` Measured Behavior prints the package, violation and warning counts, which go into the log of `goal.md`.
- [x] T002 [P] Record the test and manifest baselines. Verify: `node $S/scripts/tests/validate-playbook-package.test.cjs` exits 0, and `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-doc` prints `leaf-manifest.json OK`.
- [x] T003 [P] List every importer of the validator before its export list changes (`scratch/importers.txt`). Verify: `rg -n "validate-playbook-package" .skilled .github --glob '*.cjs' --glob '*.js' --glob '*.yml'` output is saved and each importer is named in the log.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the contract reference with roles, the schema table from `plan.md`, the evidence list, the example and authoring rules (`$S/references/conversation-scenarios.md`). Verify: `rg -c "json conversation|delay_ms|timeout_ms|optional|reply|restart|compact" $S/references/conversation-scenarios.md` prints a count of 7 or more.
Decided before the rules are written: the fixture split (T008) and the masking (T016), per research sections 5.4 and 6.1, and the key-set additions in the parent ADR-002.

- [x] T005 Add `parseConversationScript` and `CONVERSATION_RUNTIMES` and export both (`$V`). Verify: `node -e "const v=require('./$V'); console.log(typeof v.parseConversationScript, v.CONVERSATION_RUNTIMES.join(','))"` prints `function claude-code,opencode,codex,pi,devin`.
- [x] T006 Call `conversationChecks` from `validateScenario` and report each parser finding as `CONVERSATION_SCRIPT_INVALID` with its field path (`$V`). Verify: a temp copy of the clean fixture holding a `{}` block reports `CONVERSATION_SCRIPT_INVALID` with path `turns` and exit 1.
- [x] T007 Add the first turn's `send` to `promptSyncChecks` (`$V`). Verify: a temp copy whose first send differs from the contract prompt reports one `PROMPT_UNSYNCED` warning naming "the conversation script's first send".
- [x] T008 Add a table-driven conversation suite over a new `fixtures/conversation-package` (leave `fixtures/clean-package` byte-identical): one clean case, one case per malformed shape in REQ-003 asserting its field path with a new path helper, the first-send agree and differ cases (`$S/scripts/tests/validate-playbook-package.test.cjs`). Verify: the suite exits 0 and prints `conversation script regressions: PASS`, and `git diff --stat -- $S/scripts/tests/fixtures/clean-package` prints nothing.
- [x] T016 Mask the block's body before `verdictChecks` and `evergreenChecks` (REQ-010), with a negative case whose `check` greps for `BLOCKED` and holds a bare `SKIP`, and a positive case with `BLOCKED` outside the block (`$V`). Verify: the masked case reports no `FORBIDDEN_VERDICT` or `SKIP_BLOCKER_MISSING`, and the outside case still reports `FORBIDDEN_VERDICT`.
- [x] T009 Add a Conversation Script subsection with a filled example and authoring notes (`$S/assets/manual-testing-playbook-snippet-template.md`). Verify: the example pasted into a temp copy of the clean fixture validates with no `CONVERSATION_SCRIPT_INVALID` and no `PROMPT_UNSYNCED`.
- [x] T010 Update `SKILL.md` sections 6, 7 and 10, set version 1.0.9.0 and write `changelog/v1.0.9.0.md` (`$S/SKILL.md`). Verify: `rg -n "json conversation" $S/SKILL.md` prints at least two lines and `rg -n "^version: 1.0.9.0$" $S/SKILL.md` prints one.
- [x] T011 Name the reference in `ROUTER.md` and `references/README.md`, then regenerate the hub leaf manifest (`.skilled/skills/sk-doc/leaf-manifest.json`). Verify: `generate-leaf-manifest.cjs --check .skilled/skills/sk-doc` prints OK and `rg -n "conversation-scenarios.md" .skilled/skills/sk-doc/leaf-manifest.json` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Rerun the fleet and compare (`scratch/fleet-after.json`). Verify: the counting one-liner prints the same package, violation and warning counts for `fleet-before.json` and `fleet-after.json`.
- [x] T013 Rerun the suite, the manifest check and the hub gate. Verify: the suite exits 0, `--check` prints OK and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` ends with `OK: parent-skill-check`.
- [x] T014 Validate the new reference as a document. Verify: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py $S/references/conversation-scenarios.md --type reference` exits 0.
- [x] T015 Validate this phase. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/065-conversation-playbook-scenarios/001-scenario-contract --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: a scenario built from the template section validates clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: See `../decision-record.md`, ADR-001
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task gets `[B]`, a reason and the command output that blocked it in the `goal.md` log.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The fleet baseline exists at `scratch/fleet-before.json` with its counts in the `goal.md` log
- [x] CHK-002 [P0] The test suite exits 0 before any edit
- [x] CHK-003 [P1] Every importer of the validator is listed in `scratch/importers.txt`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check $V` exits 0
- [x] CHK-011 [P0] A file without the block yields the same findings as before, shown by the fleet comparison
- [x] CHK-012 [P1] Every `CONVERSATION_SCRIPT_INVALID` message names the field path, such as `turns[2].questions[0].match`
- [x] CHK-013 [P1] No code comment carries a packet, phase or task id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] The clean conversation case passes with exit 0 and no conversation finding
- [x] CHK-021 [P0] Each malformed shape in REQ-003 has a case that exits 1 with `CONVERSATION_SCRIPT_INVALID`
- [x] CHK-022 [P1] The first-send agree case raises no warning and the differ case raises one `PROMPT_UNSYNCED`
- [x] CHK-023 [P1] Fleet counts after the change equal `scratch/fleet-before.json`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The validator never executes a `setup` or `check` string. `rg -n "child_process|execSync|spawnSync" $V` prints nothing new
- [x] CHK-031 [P0] A pattern that fails to compile is caught and reported, never thrown
- [x] CHK-033 [P0] Text inside the block raises no verdict or evergreen finding, and the same text outside it still does
- [x] CHK-032 [P1] N/A for auth. The validator reads files only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and the reference list the same keys, checked with `rg -o "\`[a-z_]+\`" | sort -u` on each
- [x] CHK-041 [P1] The reference passes `validate_document.py --type reference`
- [x] CHK-042 [P2] `SKILL.md` version and `changelog/v1.0.9.0.md` agree, shown by the hub gate's 13d check
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Baseline and comparison files live in this phase's `scratch/`
- [x] CHK-051 [P1] Temp fixture copies made for manual checks are deleted before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-01. Evidence in `implementation-summary.md` Verification.
<!-- /ANCHOR:summary -->

---
