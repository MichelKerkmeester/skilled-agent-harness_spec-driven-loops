---
title: "Acceptance Criteria: Phase 3: adjacent-alignment"
description: "The criteria this phase must satisfy before it may close: each defect gone with a test that fails on the old code, and each surface next to the changelog work matching what ships."
trigger_phrases:
  - "adjacent-alignment acceptance criteria"
  - "changelog surface closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/061-skilled-release-changelog/003-adjacent-alignment"
    last_updated_at: "2026-09-27T18:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked all 12 criteria Met with observed evidence"
    next_safe_action: "Commit the phase by owner, rebuild the committed trigger index and push"
    blockers: []
    key_files:
      - "acceptance-criteria.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: adjacent-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/061-skilled-release-changelog/003-adjacent-alignment
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
| AC-001 | REQ-001 | Given a change under `.skilled/skills/sk-doc/sk-create-changelog/` or the hint `sk-doc`, When step 2 of either workflow resolves the component, Then it records `sk-doc/create-changelog` or `sk-doc/parent`, and the version reader returns that link's newest entry | `.skilled/commands/create/assets/create-changelog-auto.yaml:448`, `create-changelog-confirm.yaml:437` and sk-create-changelog `SKILL.md:374`. The step 3 reader run on each target. Observed: the reader returns nothing for `sk-doc` and `sk-code`, the hub folders themselves. It returns `v2.2.2.0.md` for `sk-doc/parent`, `v1.3.1.0.md` for `sk-doc/create-changelog` and `v4.2.3.0.md` for `sk-code/parent`. Both YAMLs parse with PyYAML | Met | - |
| AC-002 | REQ-002 | Given the three install-guide-named entries and the five in `001-shared-mode-contracts-and-fixtures`, When the validator runs on each, Then each is typed a changelog and passes | `.skilled/skills/sk-doc/shared/scripts/validate_document.py:147`, `:195` and `:254`. The old and new validators run on all eight. Observed: the old validator typed three as `install_guide` and failed them. It skipped five with `Fixture tree: holds the shapes it exercises`. The new one types all eight `changelog`, and all eight print `VALID` | Met | - |
| AC-003 | REQ-003 | Given a spec titled `The "Quiet" Session` and a summary holding `$'` and `$&`, When the generator renders its changelog, Then the frontmatter parses and the summary reads as written | `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts:572`, `:580` and `:776`. A scratch packet rendered by HEAD's renderer and by the current build. Observed: HEAD's renderer gives `bad indentation of a mapping entry (2:25)` and loses the summary. The build parses, with the title `Changelog: The \"Quiet\" Session [901-quote-repro/root]` and both patterns literal | Met | - |
| AC-004 | REQ-004 | Given each code fix, When its test runs, Then it fails on the old code and passes on the new. The suites that cover the changed files pass | `.skilled/skills/sk-doc/scripts/tests/test_changelog_validator.py:94` and `:103`, `runtime/cli/tests/nested-changelog.vitest.ts:251`. Observed: against the old validator, the two new defect tests fail. The new vitest case's check fails on HEAD's renderer, as AC-003 shows. Targeted pytest passes 12 of 12, vitest passes 81 of 81 across five suites and `npm run typecheck` exits 0. The full sk-doc run passes 121 of 122. Its one failure is a rename-tooling test that never touches the validator, and it passes alone in 311 seconds. CI's run of the same suite failed on `test_readme_manifest.py`, because phase 1 created `.skilled/changelog/skilled/` without refreshing the frozen manifest. The refreshed manifest reproduces 827 of 827 | Met | - |
| AC-005 | REQ-005 | Given the command README, the mode README, the retrieval library README, the frontmatter reference and the `.opencode` manifests, When each is read against what ships, Then none names a flag, path or rule that does not exist | `.skilled/commands/create/README.txt:208`, sk-create-changelog `README.md:106`, `runtime/cli/retrieval/lib/README.md:32`, `frontmatter-templates.md:682` and `.opencode/SYNC.md:34`. Observed: the troubleshooting row names the first argument, since no `--component` flag exists. The corpus row lists `.skilled/changelog/skilled/`. Every `.opencode` row names a path on disk, and the validator passes the five markdown files | Met | - |
| AC-006 | REQ-006 | Given CHG-001 and CHG-006, When the playbook validator reads the package, Then it passes and each scenario matches its workflow | `manual-testing-playbook/topology/route-global-component.md:29` and `release-and-boundaries/prepare-release-notes.md:17`. `validate-playbook-package.cjs --package` on the mode's playbook. Observed: `PASS` with 12 scenarios, 5 categories and 0 violations. CHG-001 expects `.skilled/changelog/sk-doc/parent/vX.Y.Z.B.md`, and CHG-006 expects an empty `git tag --list v{VERSION}` | Met | - |
| AC-007 | REQ-007 | Given the two catalogs and the system-spec-kit playbook, When their validators run, Then they list the changelog check and the generator and report no new finding | sk-doc `feature-catalog/feature-catalog.md:64`, system-spec-kit `feature-catalog/feature-catalog.md:250` and `manual-testing-playbook/manual-testing-playbook.md:210`. Observed: the catalog validator reports 6 and 84 findings, the same sets as before this phase. The playbook passes with its one earlier warning. Scenario 458's generator payload is `phase` mode with the committed entry's phrase, and the lookup ranks that entry first with an exact match | Met | - |
| AC-008 | REQ-008 | Given the v4.0.0.2 draft, When it is read, Then it mentions the release line and findable changelogs, and the operator's text is untouched | `.skilled/changelog/skilled/v4.0.0.2.md:43`, `:118` and `:141`. `git diff` on the draft. Observed: the diff adds two bullets, the Changelogs section and one upgrade note. It removes nothing. The voice scan scores 99 as HEAD does, and the validator passes it | Met | - |
| AC-009 | REQ-009 | Given packets 027 and `sk-git/023`, When `validate.sh --strict` runs on each, Then `METADATA_DISK_PATH_CONSISTENCY` passes | `specs/system-speckit/027-xce-research-based-refinement/graph-metadata.json:5` and `specs/sk-git/023-live-follow-disjoint-ff/graph-metadata.json:5`. Observed: `parent_id` is JSON `null` in both, and the stale review flag is gone. The rule passes on both, and `sk-git/023` prints `RESULT: PASSED`. 027 still fails on `FRONTMATTER_MEMORY_BLOCK` and `SPEC_DOC_SUFFICIENCY`, which record documents only its owner can write | Met | - |
| AC-010 | REQ-010 | Given the three changed components, When their versions and Hermes copies are checked, Then each newest entry matches its `SKILL.md` and every copy matches its source | sk-create-changelog `SKILL.md:5`, sk-doc `SKILL.md:5` and system-spec-kit `SKILL.md:5`. Observed: the reader returns v1.3.1.0, v2.2.2.0 and v4.1.3.0, the same as each `SKILL.md`. The hub's five version fields read 2.2.2.0. `sync-skills-hermes.cjs --check` prints `PASS: 71 Hermes skill copies in sync`, and the frontmatter gate passes 2,960 documents with exit 0 | Met | - |
| AC-011 | SC-002 | Given every changelog file, When the validator sweeps them, Then every entry Gate 1 can see is typed a changelog and passes. No failure is new | A scripted sweep with the new and old validators, saved in the session scratch folder. Observed: all 1,968 visible entries are typed `changelog` and pass. Across all 2,222 files, the new validator fails 63 and skips the 3 templates, where the old one failed 66 and skipped 8. The 63 are the same files in both runs: 59 in `z_archive` and 4 review containment copies | Met | - |
| AC-012 | NFR-R02 | Given a real `INSTALL-GUIDE.md` and a real fixture tree, When the validator types them, Then each keeps its old handling | `.skilled/skills/sk-doc/scripts/tests/test_changelog_validator.py:109`. Observed: the test passes on the new validator and passed on the old one, so the change narrows only the cases it targets | Met | - |

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

The three code fixes and their tests carried the phase, with the sweep showing no new failure across 2,222 changelog files. The owners' own findings in packet 027 and the 63 archived or containment files were left alone.
<!-- /ANCHOR:closure -->
