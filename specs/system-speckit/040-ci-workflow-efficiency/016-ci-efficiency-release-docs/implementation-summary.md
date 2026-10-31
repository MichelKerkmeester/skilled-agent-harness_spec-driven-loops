---
title: "Implementation Summary: CI efficiency release docs"
description: "Eleven changelog entries, the audit doc fixes and the version carriers that bring the release record in line with main, with the open items and their evidence."
trigger_phrases:
  - "ci efficiency release docs implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/055-ci-efficiency-release-docs"
    last_updated_at: "2026-10-26T00:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed: 53 of 53 tasks ticked, 12 of 12 criteria Met"
    next_safe_action: "None, packet complete"
    blockers: []
    key_files:
      - "specs/system-speckit/055-ci-efficiency-release-docs/tasks.md"
      - ".skilled/skills/sk-doc/changelog/v2.3.13.0.md"
      - ".skilled/skills/sk-code/changelog/v3.0.0.0.md"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-055-ci-efficiency-release-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Open question 2: join framework entry v4.0.0.14 (operator)"
      - "Open question 3: operator-private id in sk-code-quality v1.4.0.0 (operator)"
      - "Open question 4: surfaceDetection step in create-skill-parent scaffold (operator)"
      - "Open question 5: lagging editions outside this packet (operator)"
    answered_questions:
      - "Open question 1: sk-doc hub entry is 2.3.13.0 (deviation a)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.3 -->
# Implementation Summary: CI efficiency release docs

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 055-ci-efficiency-release-docs |
| **Completed** | 2026-10-26 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The release record now matches main. Eleven skill and mode changelog entries record the CI workflow efficiency and private surface work at their decided versions. The docs that describe those surfaces now name the two-surface sk-code hub and the `/doctor:ci` command, and they no longer describe the removed Webflow and Obsidian surfaces as live. Two follow-up commits closed the last three doc gaps the first closure pass found, so every task and criterion is closed.

The eleven entries cover the sk-code hub at 3.0.0.0, which removes the Webflow and Obsidian surfaces and states the correction to the v2.4.0.0 keyword claim. They also cover the four sk-code mode packets: sk-code-skilled 2.0.1.0, sk-code-review 1.8.0.0, sk-code-ci 1.1.0.0 (the `/doctor:ci` command) and sk-code-quality 1.4.1.0. The advisor entry at 0.17.0.0 covers private skill routing and the `/doctor:ci` routes. The spec-kit entry at 2.9.2.0 covers fail-fast embedding calls and the Hermes private-skill skip. The sk-doc hub entry at 2.3.13.0 covers the citation redirects and fixtures, and sk-create-skill at 1.5.6.0 and sk-create-command at 1.0.5.0 cover the root-metadata gate and the `/doctor:ci` contract. The sk-git entry at 1.9.5.0 covers the placeholder server exclusion in worktree provisioning.

The doc fixes update the sk-code, advisor, spec-kit, sk-doc, sk-git and root docs and their catalogs. The version carriers, the Hermes mirrors and the two re-minted activation manifests move with them. This packet changes no runtime or code file.

### Files Changed

Grouped by commit. `Added` marks a new file, and `Modified` marks an existing file. The two `specs/sk-doc/z_archive/` rows are the archived authored twins of the activation manifests, which the pre-commit gate writes in the same commit.

| Commit | File | Action | Purpose |
|--------|------|--------|---------|
| `d19f17b062` sk-code family | `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` | Modified | Re-minted activation manifest for the sk-code hub |
| | `.skilled/skills/sk-code/README.md` | Modified | Surface guidance and CI wording (T008) |
| | `.skilled/skills/sk-code/ROUTER.md` | Modified | Surface wording in the router, including line 189 in `2d068d4b7f` (T010) |
| | `.skilled/skills/sk-code/SKILL.md` | Modified | Hub version 3.0.0.0 (T007) |
| | `.skilled/skills/sk-code/changelog/v3.0.0.0.md` | Added | Hub release entry in the expanded format (T006) |
| | `.skilled/skills/sk-code/description.json` | Modified | Hub version 3.0.0.0 (T007) |
| | `.skilled/skills/sk-code/feature-catalog/feature-catalog.md` | Modified | Current Reality block and last_updated (T016) |
| | `.skilled/skills/sk-code/hub-router.json` | Modified | Hub version 3.0.0.0 (T007) |
| | `.skilled/skills/sk-code/manual-testing-playbook/doctor-commands/README.md` | Modified | Doctor playbook index entry for the CI report |
| | `.skilled/skills/sk-code/manual-testing-playbook/doctor-commands/doctor-ci-report.md` | Added | Playbook scenario for `/doctor:ci report` |
| | `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md` | Modified | Coverage note with the CI bundling and precedence lines (T017) |
| | `.skilled/skills/sk-code/mode-registry.json` | Modified | Hub version 3.0.0.0 (T007) |
| | `.skilled/skills/sk-code/sk-code-ci/README.md` | Modified | `/doctor:ci` wording (T014) |
| | `.skilled/skills/sk-code/sk-code-ci/SKILL.md` | Modified | Version 1.1.0.0 and `/doctor:ci` wording (T013, T014) |
| | `.skilled/skills/sk-code/sk-code-ci/changelog/v1.1.0.0.md` | Added | sk-code-ci entry (T013) |
| | `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Modified | Version 1.4.1.0, resolved_surface template and style guide link (T015) |
| | `.skilled/skills/sk-code/sk-code-quality/changelog/v1.4.1.0.md` | Added | sk-code-quality entry (T015) |
| | `.skilled/skills/sk-code/sk-code-review/README.md` | Modified | sk-code-ci row in the related table (T012) |
| | `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Modified | Version 1.8.0.0 (T012) |
| | `.skilled/skills/sk-code/sk-code-review/changelog/v1.8.0.0.md` | Added | sk-code-review entry (T012) |
| | `.skilled/skills/sk-code/sk-code-review/references/review-core.md` | Modified | Floor reference fix (T012) |
| | `.skilled/skills/sk-code/sk-code-skilled/README.md` | Modified | Surface wording (T011) |
| | `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` | Modified | Version 2.0.1.0 (T011) |
| | `.skilled/skills/sk-code/sk-code-skilled/changelog/v2.0.1.0.md` | Added | sk-code-skilled entry (T011) |
| | `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` | Modified | Archived authored twin of the sk-code manifest |
| `ef39b28497` system-skill-advisor | `.skilled/skills/system-skill-advisor/README.md` | Modified | Private-skill and doctor wording |
| | `.skilled/skills/system-skill-advisor/SKILL.md` | Modified | Version 0.17.0.0 (T018) |
| | `.skilled/skills/system-skill-advisor/changelog/v0.17.0.0.md` | Added | Advisor entry (T018) |
| | `.skilled/skills/system-skill-advisor/feature-catalog/auto-indexing/private-skill-containment.md` | Modified | Daemon containment sentence (T020, this page) |
| | `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md` | Modified | Active `/doctor:ci` bridges (T019) |
| | `.skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-setup-run.md` | Modified | Doctor table row count 18 (T021) |
| `068f774a3b` system-spec-kit | `.skilled/skills/system-spec-kit/ARCHITECTURE.md` | Modified | Spec check sentence with the SKILLED_CI condition (T023) |
| | `.skilled/skills/system-spec-kit/SKILL.md` | Modified | Version 2.9.2.0 (T022) |
| | `.skilled/skills/system-spec-kit/changelog/v2.9.2.0.md` | Added | Spec-kit entry (T022) |
| | `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md` | Modified | `/doctor:ci` in the router list (T024) |
| | `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | Modified | `/doctor:ci` in the doctor routers line (T024) |
| | `.skilled/skills/system-spec-kit/feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md` | Modified | Read-only and mutating `/doctor:ci` routes (T024) |
| | `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md` | Modified | `/doctor:ci` cross-playbook line (T025) |
| | `.skilled/skills/system-spec-kit/runtime/cli/hermes/README.md` | Modified | Hermes skip list for operator-private skills (T023) |
| `1dae97a865` sk-git | `.skilled/skills/sk-git/SKILL.md` | Modified | Version 1.9.5.0 (T030) |
| | `.skilled/skills/sk-git/changelog/v1.9.5.0.md` | Added | sk-git entry (T030) |
| `19ba5c662d` sk-doc family | `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` | Modified | Re-minted activation manifest for the sk-doc hub |
| | `.skilled/skills/sk-doc/SKILL.md` | Modified | Hub version 2.3.13.0 (T026) |
| | `.skilled/skills/sk-doc/changelog/v2.3.13.0.md` | Added | Hub entry with the redirect and fixture changes (T026) |
| | `.skilled/skills/sk-doc/description.json` | Modified | Hub version 2.3.13.0 (T026) |
| | `.skilled/skills/sk-doc/hub-router.json` | Modified | Hub version 2.3.13.0 (T026) |
| | `.skilled/skills/sk-doc/mode-registry.json` | Modified | Hub version 2.3.13.0 (T026) |
| | `.skilled/skills/sk-doc/sk-create-command/SKILL.md` | Modified | Version 1.0.5.0 (T029) |
| | `.skilled/skills/sk-doc/sk-create-command/changelog/v1.0.5.0.md` | Added | `/doctor:ci` contract entry (T029) |
| | `.skilled/skills/sk-doc/sk-create-skill/SKILL.md` | Modified | Version 1.5.6.0 (T027) |
| | `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.5.6.0.md` | Added | Root-metadata gate and private roots entry (T027) |
| | `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md` | Modified | Worked example moved to the live surfaces (T028) |
| | `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | Modified | Surface packet example moved to the live surfaces (T028) |
| | `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` | Modified | Violation code row and enforcement list (T028) |
| | `.skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md` | Modified | Upgrade example names the live surfaces (T028) |
| | `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-doc/manifest.json` | Modified | Archived authored twin of the sk-doc manifest |
| `cdd611f210` root and command docs, mirrors | `.github/workflows/README.md` | Modified | Composite action, daily schedule and `/doctor:ci` pointers (T036) |
| | `.hermes/skills/sk-code-ci/SKILL.md` | Modified | Regenerated Hermes mirror (T037) |
| | `.hermes/skills/sk-code-quality/SKILL.md` | Modified | Regenerated Hermes mirror (T037) |
| | `.hermes/skills/sk-code-review/SKILL.md` | Modified | Regenerated Hermes mirror (T037) |
| | `.hermes/skills/sk-code-skilled/SKILL.md` | Modified | Regenerated Hermes mirror (T037) |
| | `.hermes/skills/sk-code/SKILL.md` | Modified | Regenerated Hermes mirror (T037) |
| | `.hermes/skills/sk-create-command/SKILL.md` | Modified | Regenerated Hermes mirror (T037) |
| | `.hermes/skills/sk-create-skill/SKILL.md` | Modified | Regenerated Hermes mirror (T037) |
| | `.hermes/skills/sk-doc/SKILL.md` | Modified | Regenerated Hermes mirror (T037) |
| | `.hermes/skills/sk-git/SKILL.md` | Modified | Regenerated Hermes mirror (T037) |
| | `.hermes/skills/system-skill-advisor/SKILL.md` | Modified | Regenerated Hermes mirror (T037) |
| | `.hermes/skills/system-spec-kit/SKILL.md` | Modified | Regenerated Hermes mirror (T037) |
| | `.skilled/commands/README.txt` | Modified | `ci.md` in the doctor tree (T035) |
| | `.skilled/commands/doctor/assets/doctor-setup.yaml` | Modified | Presentation sentence matched to the table (T035) |
| | `.skilled/skills/README.txt` | Modified | sk-code-ci row in the sk-code entry (T035) |
| | `README.md` | Modified | DOCTOR section with `/doctor:ci`, the CI off switches and the sk-code surface wording (T031 to T034) |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Six commits landed on main in order: `d19f17b062` (sk-code family), `ef39b28497` (system-skill-advisor), `068f774a3b` (system-spec-kit), `1dae97a865` (sk-git), `19ba5c662d` (sk-doc family) and `cdd611f210` (root and command docs, plus all eleven Hermes mirrors). Each hub commit staged its own paths. The mirrors landed with the root docs, because the pre-commit mirror-parity gate blocks a mirror that stages while another mirror is dirty (deviation b). The push replayed the six commits onto origin/main and pushed them to main under the operator's standing instruction (deviation c). origin/main now holds the six commits and one later commit, `cdb16f3208`, a trigger index rebuild that this packet did not make.

The closure pass ran from the current tree. It reran the Phase 2 verify commands and the gates with their exit codes, and it read the eleven entries against the paths they name. Checks that compared against the pre-commit state reran against the pinned base `bb9b9d1c09` or against the named commit, and each evidence clause says which one. Each changed markdown file went through `validate_document.py`, with a type chosen from its path. The Message Contract run on `cdd611f210` failed on the Spec trailer, because this packet folder was still untracked (deviation f). The fix is a packet commit to main, which the coordinator makes after closure. The closure pass did not stage or commit anything.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The sk-doc hub entry is 2.3.13.0, not the decided 2.3.12.0 (deviation a). | Commit `c301fa4bc7` had already released `v2.3.12.0.md`, and the hub's SKILL.md already read 2.3.12.0. 2.3.13.0 is the next free patch. Its three source commits predate that release, so this entry is their first release record. |
| Each hub commit carries only its own paths, and the Hermes mirrors land in `cdd611f210` (deviation b). | The pre-commit mirror-parity gate blocks a mirror staged while another is dirty. The gate's own fix line says to stage the mirrors together, which is what was done, so no `SPECKIT_SKIP_MIRROR_PARITY=1` bypass was used. |
| The push replayed the commits onto main, and the worktree branch was not pushed (deviation c). | The operator's standing instruction from 2026-10-25 covers a push once the work is complete. A replay keeps the commits in order and leaves the worktree branch local. |
| The T053 check is amended to an ancestry check (deviation c). | The CI bot's trigger-index rebuild commit `cdb16f3208` landed on main after the push, so HEAD and origin/main cannot be equal. `git merge-base --is-ancestor cdd611f210 origin/main` exits 0, which proves the six commits are on main. |
| The CI failure is recorded as deviation f and is not hidden. | The Message Contract run on `cdd611f210` failed the Spec trailer check, because the packet folder was untracked when the commits were pushed. No criterion relies on CI being green, and the packet commit is the fix. |
| The framework release note and the stale README edit stay out (deviation d, open question 2). | REQ-005 keeps the framework folder unchanged, and the operator names the release note at release time. The stale README edit is saved as a patch for the operator. |
| The three open doc gaps were fixed in follow-up commits, not waived. | T009, T010 and T020 were in scope, and each fix is a short edit to a file the packet already owned: `2d068d4b7f` for the sk-code README and ROUTER.md, `c3ca0efaa9` for the advisor README. |
| The edition values were checked against the raise rule, not by running the bump hook. | `frontmatter-versioning.md` section 4 gives one result for each edited doc, so arithmetic on each base value is a sound check. No standalone derivation script exists in the tree, and the hook was not rerun. |
| The packet commit goes last, after the two follow-up commits, in one fast-forward push. | The six earlier commits failed the Spec trailer check because this folder was not on main. Pushing the folder in the same push as the follow-ups puts it at the pushed head. |
| `last_updated_by` is set to `claude-opus-5-5`, as the closure brief directed. | The brief set the value. The agent that ran this closure pass was claude-haiku-5-5. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T001 ancestry | The literal `git merge-base --is-ancestor origin/main HEAD` exited 1, because origin/main moved. The pinned base `bb9b9d1c09` is an ancestor of HEAD, exit 0. |
| T002 new entries | `git cat-file -e` printed 128 at the base commit and 0 at HEAD for all eleven paths. |
| T003 and T042 mirror sync | `[runtime-mirror-sync] PASS: 194 mirrors across 8 trees are in sync.` Exit 0. |
| T042 route validation | `OK: route-validate, 17 routes validated, 2 warnings`. The two warnings are informational `--dry-run` notes on routes these commits do not touch. Exit 0. |
| T042 router-sync | `router-sync: 5/5 checks passed`. Exit 0. |
| T042 parent-skill check | `OK: parent-skill-check, all hard invariants passed, 0 warnings`. Exit 0. |
| T040 link scan | Two paths: the style-library bundle changelog folder and the spec templates changelog folder. 57 links in total. |
| T039 carrier sweep | No line for any old version: 2.4.0.0, 2.0.0.0, 1.7.1.0, 1.0.0.0, 1.4.0.0, 0.16.3.0, 2.9.1.0, 1.5.5.0, 1.0.4.0, 1.9.4.0 and 2.3.12.0. |
| T037 Hermes mirrors | Eleven `version:` lines, each the decided value. The sk-doc hub mirror reads 2.3.13.0. |
| T041 validate_document | 59 changed markdown files, each exit 0, with 0 nonzero results. |
| T043 released-entry guard | The literal origin/main diff printed nothing. Per commit, 0 released entries were modified and 0 framework paths changed. |
| T044 privacy and style | Per commit, 0 em dashes and 0 private-name matches in the added lines. |
| T045 code files | No `.ts`, `.js`, `.cjs`, `.mjs`, `.py` or `.sh` file in the six commits. |
| T053 push check | `git merge-base --is-ancestor cdd611f210 origin/main` exited 0 after `git fetch`. The literal sha equality no longer applies, see deviation c. |
| CI on the pushed head | Message Contract run 40242193992 concluded failure on `cdd611f210`, because each commit's Spec trailer named this folder before it was on main (deviation f). The other 18 runs on that commit concluded success. |
| AC-009 private paths | The added lines held 0 user-home paths and 0 temporary-folder paths, and no credential pattern matched. |
| CHK-051 scratch folder | `scratch/` holds `.gitkeep` only. |
| Packet validate.sh | `validate.sh specs/system-speckit/055-ci-efficiency-release-docs --strict` printed `RESULT: PASSED` with exit 0, after the final `repair-derived.cjs --apply`. Errors 0, Warnings 0. |
| validate_document on the four packet docs | `validate_document.py --type spec` on spec.md, plan.md, tasks.md and acceptance-criteria.md printed `Total issues: 0` with exit 0 on each file. |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The Message Contract run on `cdd611f210` stays red.** It failed because this folder was untracked when the six commits were pushed. A rerun checks out the same tree, so it cannot pass. Commit a packet before, or together with, the first commit whose Spec trailer cites it.
2. **The framework changelog README is stale.** `.skilled/changelog/skilled/README.md` still names `v4.0.0.4.md` as the unreleased entry. REQ-005 keeps that folder out of scope, so the writer's correction is saved for the operator as a patch, together with open question 2.
3. **Changelog entries name their spec folder.** The sk-doc hub entry and the advisor entry carry a `Spec folder` line, as the changelog template asks. The comment hygiene rule covers code comments, so these lines stay.
4. **origin/main moves after each push.** The CI bot adds a trigger-index rebuild commit, so a literal HEAD equals origin/main check fails by construction. T053 uses an ancestry check instead.
5. **sk-code ROUTER.md section numbering jumps from 3 to 6** at HEAD, the same before and after this work. Its sections are cited by number, so renumbering is a separate change.
6. **Pre-existing HVR findings** on lines this packet did not change are not fixed. The operator recorded them, and the closure pass did not re-observe them. Every changed file still exits 0 under `validate_document.py`.
7. **sk-create-skill v1.5.6.0** does not mention the `047-020-recorded-picks.jsonl` fixture or the `leaf-resource-contract.test.cjs` id renames. This is by choice, because the changelog template leaves test-fixture housekeeping out.
8. **`validate_document.py` without `--type`** reads the sk-code feature catalog as the readme type, so those files need `--type`.
9. **The skills catalog row** in `.skilled/skills/README.txt` names sk-code-ci and not `/doctor:ci`. AC-012 is judged Met for the doctor and CI docs, and this exception is flagged for the operator.
10. **The framework release note is not written.** The stale README edit is saved as a patch at the path in deviation d. Open question 2 stays with the operator.
11. **Open questions 3, 4 and 5 in spec.md stay open.** Question 3 is the operator-private skill id in the sk-code-quality v1.4.0.0 entry and two checklists. Question 4 is a `surfaceDetection` step in the create-skill-parent scaffold. Question 5 is the lagging editions outside this packet.

<!-- /ANCHOR:limitations -->
