---
title: "Implementation Summary"
description: "Epic docs alignment for the spec-folder tooling: the playbooks, catalogs, READMEs, doctor docs and release changelogs now describe what the code ships."
trigger_phrases:
  - "epic docs alignment implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/018-epic-docs-alignment"
    last_updated_at: "2026-10-09T17:09:29Z"
    last_updated_by: "close-out"
    recent_action: "Closed the packet with 26 findings fixed, two release changelogs and five requirement rows Met"
    next_safe_action: "None for this packet. Follow-ups are listed under Known Limitations"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "close-out-018-epic-docs-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-epic-docs-alignment |
| **Completed** | 2026-10-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The spec-folder tooling epic shipped commands and checks that the docs did not yet describe. This phase brings the playbooks, feature catalogs, READMEs, doctor docs and release changelogs in line with that code, so an operator or tester who reads a doc gets what the tool does now. A docs audit found 26 such gaps, and each one is fixed or checked in its file.

### Phase 18: epic-docs-alignment

A playbook that expected twelve hook gates now expects thirteen. The `/doctor:update compat` action appears in every surface that lists the update actions. Eleven playbook scenarios (DOC-381 and 466 to 475) and seven feature catalog entries now cover the compat action, the upgrade-legacy tooling, the heal and anchor repairs, the repo era report and the phrase lint gate. Each release changelog records the epic, and the spec-kit version moves to 2.7.1.0. A maintainer no longer has to read the code to learn which flags exist or which gate a commit runs.

### Files Changed

| Doc type | Modified | New | Files |
|----------|----------|-----|-------|
| Playbooks | 5 | 11 | sk-git `doctor-git-hooks-list.md`. system-spec-kit `doctor-commands/README.md`, `doctor-update-check.md`, `manual-testing-playbook.md`, `tooling-and-scripts/phase-folder-creation.md`. New: `doctor-update-compat.md` and ten `tooling-and-scripts/` scenarios |
| Feature catalogs | 3 | 7 | `doctor-commands/category-overview.md`, `feature-catalog.md`, `tooling-and-scripts/spec-lifecycle-automation.md`. New: seven `tooling-and-scripts/` entries |
| READMEs and references | 9 | 0 | System-spec-kit `README.md`, spec README, sweep README, retrieval lib README, test-fixtures README, hook test README, `path-scoped-rules.md`, `worked-examples.md`, `trigger-config.md` |
| Doctor, env, hooks and root docs | 7 | 0 | Root `README.md`, `.env.example`, `ENV-REFERENCE.md`, commands `README.txt`, doctor tests README, git-hooks README, `speckit-implement.yaml` |
| Changelogs and version | 2 | 1 | `.skilled/changelog/skilled/v4.0.0.4.md`, `SKILL.md` (version 2.7.1.0). New: `.skilled/skills/system-spec-kit/changelog/v2.7.1.0.md` |
| Parent spec status | 2 | 0 | `specs/system-speckit/034-spec-folder-tooling/spec.md`, `016-research-recommendations/spec.md` |

The new playbook scenarios are DOC-381 (`/doctor:update compat`) and 466 to 475. Those ten cover the upgrade-legacy dry run, apply with manifest and refusal without git, the heal anchor repair dry run and apply, the lane modes, the repo era report, the template phrase lint bypass and blocked commit, and the nested anchor check.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work ran in four doc lanes with disjoint file sets: playbooks, feature catalogs, READMEs and references, and doctor, env, hook and root docs. A changelog lane came next, then a fresh read-only review and one fix round. A status lane corrected the stale rows in the two parent specs. Each of the 26 findings was checked by grep against its named file, and the output is in `scratch/evidence/`.

The review result was 0 P0, 2 P1, 1 P1 risk and about 10 P2 findings, all fixed. That count is the operator's report from the close-out brief. This close-out did not rerun the review, so the count is not observed here.

The changes ship in three commits: the docs, the two changelogs with SKILL.md, and the packet with its parent status rows. The gates ran on the tree at HEAD `9dbfe3a046` plus those changes, before the commits.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The spec-kit changelog entry went into a new `v2.7.1.0.md` file, not the `v2.7.0.0.md` that the spec scope named | SKILL.md moves to 2.7.1.0 in this epic, so the entry belongs to the release it ships in. `v2.7.0.0.md` describes the earlier release and was not changed |
| `scratch/` stays in the packet | The operator directed the evidence to `scratch/evidence`, and the plan cites `scratch/audit-findings.md`. This is the one deviation from the checklist's CHK-051 rule that scratch is cleaned before completion |
| The two index READMEs count as passing under their `readme` type | The validator detects `command` for the doctor tests README and `playbook_feature` for the doctor-commands README from their paths. Both fail the detected type identically at HEAD, and both pass as `readme`. The operator should confirm this reading, which is what AC-005 relies on |
| Stale status rows changed only where the operator named them | The 034 rows 16 and 18 and the 16 phase-map rows of 016 were changed. The 016 header status and its packet table were not, and they are listed below as follow-ups |
| Row 18 of the 034 parent lost its placeholder focus text | The row read `[Phase 18 scope]`, so it needed real text to read as a finished phase |
| The docs ship in three commits: non-spec docs, changelogs, and the packet | Each change set stays separate, so the three commits can be reverted in reverse order |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Playbook, system-spec-kit | Exit 0, 0 violations, 1 warning (`PROMPT_UNSYNCED`, present before this phase) | `scratch/evidence/playbook-spec-kit.txt` |
| Playbook, sk-git | Exit 0, 0 violations, 0 warnings | `scratch/evidence/playbook-sk-git.txt` |
| Feature catalog, system-spec-kit | Exit 0, 85 warnings, 0 failures | `scratch/evidence/catalog.txt` |
| Markdown links | 7,945 files, 14,105 links, 0 broken | `scratch/evidence/links.txt` |
| Document validator, 42 changed `.md` files outside `specs/` | 40 pass. Two index READMEs fail their detected type identically at HEAD and pass as `readme` | `scratch/evidence/validate-docs.txt` |
| Gate 3 menu parity | 12 pass, 0 fail, `rc=0` | `scratch/evidence/gate3-parity.txt` |
| Hook gate list | `STATUS=OK GATES=13 OFF=0`, `rc=0` | `scratch/evidence/hook-gates.txt` |
| Doctor compat suite | 21 pass, 0 fail, `rc=0` | `scratch/evidence/doctor-compat.txt` |
| Removed behavior | Corrected run `rc=0` with five matches, all removal notices in two changelogs and `MIGRATION.md`. The first form returned `rc=2` from argument order | `scratch/evidence/removed-behavior-corrected.txt`, `removed-behavior.txt` |
| Finding fixes, F01 to F26 | Each fix present in the file its task names | `scratch/evidence/findings-check.txt`, `findings-check-b.txt`, `findings-check-c.txt`, `f18-and-children.txt` |
| Follow-up claims | ENV-REFERENCE duplicate confirmed at lines 76 and 209. `completedAt` written at `upgrade-legacy.mjs:494`, absent from the spec README. Parity test omits the three F25 files. `retrieval/lib/README.md` line 23 names a missing path | `scratch/evidence/followup-verify.txt`, `followup-verify-b.txt` |
| Review result | Reported by the operator: 0 P0, 2 P1, 1 P1 risk, about 10 P2, all fixed. Not rerun here | Operator brief |
| Strict validation, this packet | `RESULT: PASSED`, 0 errors, 0 warnings, `rc=0` | `scratch/evidence/validate-packet.txt` |
| Strict validation, 034 parent, with its children | `RESULT: PASSED`, 0 errors, 0 warnings in every block, `rc=0` | `scratch/evidence/validate-034.txt` |
| Strict validation, 016 parent, recursive | `RESULT: PASSED`, 0 errors, 1 warning (`SOURCE_TAGS`, see Known Limitations 11), `rc=0` | `scratch/evidence/validate-016.txt` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

These are follow-ups outside this packet. None of them changes a claim this packet makes.

1. **`ENV-REFERENCE.md` lists `SYSTEM_SPEC_GATE_DISABLED` twice** at lines 76 and 209, with conflicting metadata, so `/doctor:env` stops on it. Confirmed by grep, not run.
2. **The compat YAML does not say** whether an owed recovery step counts as a planned move for the dirty-roots check. Reported by the review, not rerun.
3. **The compat YAML may write run-complete only on success, and may read a missing layout-map script as collisions.** Inferred from the YAML, not run.
4. **The Gate 3 parity test covers twelve files** and does not cover `speckit-implement.yaml`, `worked-examples.md` or `trigger-config.md`. Confirmed in the test's file list.
5. **The CLI test suite creates temporary folders in the real `specs/` root.** Reported by the review, not rerun.
6. **Two documentation gaps and one broken path.** The spec README omits the `completedAt` manifest field that `upgrade-legacy.mjs:494` writes. `retrieval/lib/README.md` line 23 names `../retrofit-convention.mjs`, which does not exist. The file is `runtime/cli/ops/retrofit-convention.mjs`. The link checker reads markdown links only, so it does not catch a code-span path.
7. **The reviewer's cleanup deleted about 27 temp fixture folders it did not create.** Reported by the review, count not verified here. Git does not hold untracked folders, so the repository cannot restore them.
8. **The validator's path-based type detection** classifies the doctor tests README as `command` and the doctor-commands README as `playbook_feature`. Both are index READMEs and pass as `readme`. The fix belongs in the validator or in the files' classification.
9. **The 016 parent's header status (line 24, "In Progress") and its packet table (lines 67 to 82, "Planned packet")** still show old status. F27 covered only the phase map, as the operator named.
10. **The 11 new playbook scenarios were not executed.** They were checked for structure only. Running their steps is the operator's test work.
11. **The 016 recursive strict run prints one warning.** `SOURCE_TAGS` reports 61 of 289 research citations in 016's `research/` folder that do not resolve. `repair-derived` reports the same item as not repairable. The warning is in research files this packet did not change.
<!-- /ANCHOR:limitations -->
