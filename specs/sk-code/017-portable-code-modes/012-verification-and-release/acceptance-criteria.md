---
title: "Acceptance Criteria: Phase 12: verification-and-release"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "verification and release acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/012-verification-and-release"
    last_updated_at: "2026-10-28T09:10:00Z"
    last_updated_by: "implementer"
    recent_action: "Met every criterion with the recorded scenario runs and the in-repository checks"
    next_safe_action: "Conductor reviews and commits the packet"
    blockers: []
    key_files:
      - "scratch/e2e/CQ-012.md"
      - "scratch/e2e/CR-031.md"
      - "scratch/in-repo.txt"
      - ".skilled/skills/sk-code/sk-code-quality/repository/quality.json"
      - ".skilled/changelog/skilled/v4.0.0.17.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "verification-and-release-implementer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 12: verification-and-release

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `012-verification-and-release`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the six shipped playbook scenarios, When each runs end to end from this worktree, Then every run ends `VERDICT: PASS` | `rg -c 'VERDICT: PASS' scratch/e2e/*.md` prints one hit per file; the verdict lines are `scratch/e2e/CQ-012.md:201`, `scratch/e2e/CQ-013.md:197`, `scratch/e2e/CR-029.md:207`, `scratch/e2e/CR-030.md:219`, `scratch/e2e/CR-031.md:313` and `scratch/e2e/ci-foreign-repository-profile.md:295` | Met | - |
| AC-002 | REQ-002 | Given a recorded run, When its first section is read, Then it names every fixture and executor deviation | `scratch/e2e/CR-029.md:11` fixes the fixture path, `scratch/e2e/CR-029.md:14` names the devin executor and `scratch/e2e/CR-029.md:20` records the skill symlink; `scratch/e2e/CR-031.md:20` records the scaffolding, `scratch/e2e/CR-031.md:23` the failed first attempt and `scratch/e2e/CR-031.md:34` the fixture reset; `scratch/e2e/CQ-012.md:5` and `scratch/e2e/ci-foreign-repository-profile.md:5` record the fixed path | Met | - |
| AC-003 | REQ-003 | Given this repository, When `/doctor:sk-code quality status` runs, Then it reads the skill-folder config as source `repo`, trusted, with no error, and no hygiene rule disabled | The run prints `Config: .skilled/skills/sk-code/sk-code-quality/repository/quality.json (repo, 748 bytes)`, `Trust: trusted`, `Errors: none` and `STATUS=OK SOURCE="repo" TRUST=trusted`, exit 0; the file names the repository at `.skilled/skills/sk-code/sk-code-quality/repository/quality.json:3`, adds `actionlint` at `.skilled/skills/sk-code/sk-code-quality/repository/quality.json:7` and leaves `disableRules` empty at `.skilled/skills/sk-code/sk-code-quality/repository/quality.json:27`; `scratch/in-repo.txt:11` records the same read | Met | - |
| AC-004 | REQ-004 | Given the CI foreign-repository fixture, When step 1 runs, Then the fixture holds `shared/scripts/lib/repository-identity.cjs` before the copied `ci-profile.cjs` loads | `.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/foreign-repository/foreign-repository-profile.md:80` copies the helper, and `scratch/e2e/ci-foreign-repository-profile.md:295` records the pass | Met | - |
| AC-005 | REQ-005 | Given this repository, When the doctor and guard checks run, Then the report reads 32 workflows with no drift flag, the setup battery reads `STATUS=OK legs=9`, the route guard and sync pass, the skill graph is fresh, the Hermes copies are in sync and the routing capture equals the baseline | `scratch/in-repo.txt:3` to `scratch/in-repo.txt:16` record each check and its exit 0; the battery line is `scratch/in-repo.txt:9`, the route sync line `scratch/in-repo.txt:13` and the routing capture `scratch/in-repo.txt:16` | Met | - |
| AC-006 | REQ-006 | Given the framework changelog, When the two entries are read, Then `v4.0.0.17.md` describes the settings move and `v4.0.0.16.md` keeps the tagged wording | `.skilled/changelog/skilled/v4.0.0.17.md:35` places the settings in the skill folders and `.skilled/changelog/skilled/v4.0.0.17.md:47` describes this repository's config; `.skilled/changelog/skilled/v4.0.0.16.md:39` still names `.sk-code/quality.json`, which is the wording the tag published | Met | - |
| AC-007 | REQ-007 | Given the three skill releases, When each changelog and its carrier are read, Then each entry exists and its `SKILL.md` carries the same version | `.skilled/skills/sk-code/changelog/v3.9.18.0.md:10` matches `.skilled/skills/sk-code/SKILL.md:5`; `.skilled/skills/sk-code/sk-code-ci/changelog/v1.1.9.0.md:10` matches `.skilled/skills/sk-code/sk-code-ci/SKILL.md:5`; `.skilled/skills/sk-code/sk-code-quality/changelog/v1.13.11.0.md:10` matches `.skilled/skills/sk-code/sk-code-quality/SKILL.md:5` | Met | - |
| AC-008 | REQ-008 | Given the stepped version, When the carriers and the compiled route are read, Then `description.json`, `hub-router.json`, `mode-registry.json` and the `.hermes` copies carry `3.9.18.0`, the skill graph is regenerated and fresh, and the route manifest carries a re-minted policy hash | `.skilled/skills/sk-code/description.json:4`, `.skilled/skills/sk-code/hub-router.json:3` and `.skilled/skills/sk-code/mode-registry.json:3` read `3.9.18.0`; `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json:1` carries the new hash; the setup battery passes after the re-mint at `scratch/in-repo.txt:9` | Met | - |

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

Every criterion is met with a recorded run or an observed command, and the packet states plainly that no GitHub release was published and that the operator-local surface is outside this repository.
<!-- /ANCHOR:closure -->
