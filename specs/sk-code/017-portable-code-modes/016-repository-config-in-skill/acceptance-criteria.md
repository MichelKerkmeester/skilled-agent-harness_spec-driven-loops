---
title: "Acceptance Criteria: Repository config inside the owning skill folder"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "repository config in skill acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/016-repository-config-in-skill"
    last_updated_at: "2026-10-28T05:58:48Z"
    last_updated_by: "implementer"
    recent_action: "Met every criterion with observed runs against the worktree"
    next_safe_action: "Conductor reviews and commits the packet"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/shared/scripts/lib/repository-identity.cjs"
      - ".skilled/commands/doctor/scripts/lib/ci-profile.cjs"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs"
      - ".skilled/skills/sk-code/sk-code-ci/repository/ci.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repository-config-in-skill-implementer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Repository config inside the owning skill folder

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `016-repository-config-in-skill`
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
| AC-001 | REQ-001 | Given both loaders, When they discover the committed file, Then they read `repository/ci.json` or `repository/quality.json` inside the owning skill folder, or the same path under `.opencode/` | `ci-profile.test.cjs` "a repository that installs the skills under .opencode/ reads the same path there" and `quality-config.test.cjs` "discovery: a repository that installs skills under .opencode/ keeps the config at the same path there" pass; the report reads `"path": ".skilled/skills/sk-code/sk-code-ci/repository/ci.json"` | Met | - |
| AC-002 | REQ-002 | Given a temp root holding each file at the old root path, When each loader and the doctor quality command run, Then the loaders raise their own code, the CI routes and the gate exit 3, and the doctor prints the same move message with `ERROR=CONFIG_LEGACY_LOCATION` | The temp-root run prints `CI: PROFILE_LEGACY_LOCATION \| .sk-code/ci.json is no longer read: move it to .skilled/skills/sk-code/sk-code-ci/repository/ci.json` and `QUALITY: CONFIG_LEGACY_LOCATION \| .sk-code/quality.json is no longer read: move it to .skilled/skills/sk-code/sk-code-quality/repository/quality.json`; a second temp root through `sk-code-quality-config.cjs status` prints `ERROR  .sk-code/quality.json is no longer read: move it to …` and `STATUS=FAIL SOURCE="repo" TRUST=none ERROR=CONFIG_LEGACY_LOCATION`, exit 1, which the doctor test "status: a config left at the old root path fails CONFIG_LEGACY_LOCATION and names the move" pins; `ci-profile.test.cjs` "a profile left at the old repository-root path is refused with its move target" and `quality-config.test.cjs` "discovery: a config left at the old root-level path is refused, and the message names where it belongs" pass | Met | - |
| AC-003 | REQ-003 | Given a committed file that names another repository, When the report, toggle, scaffold and quality loader read it, Then none applies it and each reports `{path, repository, current}` | `ci-profile.test.cjs` "a profile written for another repository is reported and ignored" asserts the object; `ci-report.test.cjs` "a skill-folder profile written for another repository is ignored and named in the report" asserts `profile: default; ignored …, written for someone/else, this repository is acme/widgets`; `ci-toggle.test.cjs` "a skill-folder profile written for another repository is ignored and named in the plan" passes; `quality-config.test.cjs` "discovery: a repository field decides whether the config applies, and a mismatch names both repositories" asserts source `none`; `ci-scaffold.cjs` writes the note at line 248 | Met | - |
| AC-004 | REQ-004 | Given a file with no `repository` field and a file whose name differs only in case, When each loader runs, Then both apply | `ci-profile.test.cjs` "a profile with no repository field applies here" and "a profile written for this repository applies, in either spelling of its name" pass; `quality-config.test.cjs` "discovery: a config with no repository field applies in every repository" passes; `repository-identity.test.cjs` "repositoryMatches accepts an absent field and a case-insensitive match" passes | Met | - |
| AC-005 | REQ-005 | Given a checkout, When the identity is read, Then `GITHUB_REPOSITORY` wins when it matches `owner/name`, the origin remote answers otherwise, and https, ssh and scp-like URLs all reduce to `owner/name` | `repository-identity.test.cjs` prints `tests 9 pass 9 fail 0`; the live call reads `{"identity":"MichelKerkmeester/skilled-agent-harness_spec-driven-loops","source":"origin"}` | Met | - |
| AC-006 | REQ-006 | Given this repository, When the profile is read, Then it lives at `repository/ci.json` with its `repository` field and no root `.sk-code/` folder exists | `ls .sk-code` prints `No such file or directory`; the file carries `"repository": "MichelKerkmeester/skilled-agent-harness_spec-driven-loops"`; `doctor-ci-contract.test.cjs` "this repository commits the CI profile that keeps its protections" passes | Met | - |
| AC-007 | REQ-007 | Given this repository, When `ci-report.cjs --no-gh --json` runs, Then it reads 32 workflows and 0 errors, and the only changed field is the profile path | The run prints `"path": ".skilled/skills/sk-code/sk-code-ci/repository/ci.json"`, `"workflowCount": 32` and `"errors": []` | Met | - |
| AC-008 | REQ-008 | Given a repository with the skills installed, When `/doctor:sk-code quality init --apply` runs, Then it writes `repository/quality.json` and creates the folder | `sk-code-quality-config.test.cjs` uses `TARGET = '.skilled/skills/sk-code/sk-code-quality/repository/quality.json'`, and "init apply: creates the file once, and a second apply refuses with CONFIG_EXISTS and keeps it byte-identical" passes; `quality-config.test.cjs` "discovery: a repository with no skill folder gets the path this framework installs" passes | Met | - |
| AC-009 | REQ-009 | Given a config at the old root path, When the quality gate reads it, Then the fault carries `CONFIG_LEGACY_LOCATION` and its own repair line, not `GIT_FAILED` | `quality-gate.cjs` repair table reads `CONFIG_LEGACY_LOCATION: 'move .sk-code/quality.json to the path the message names inside the sk-code-quality skill folder, then delete the .sk-code folder'`, and its named-code list keeps the code instead of mapping it to `GIT_FAILED` | Met | - |
| AC-010 | REQ-010 | Given the current docs, When `rg -n '\.sk-code/'` runs outside `specs/` and `**/changelog/**`, Then every doc hit describes the refusal or the move | The sweep leaves the refusal and move wording in the doctor commands, assets, root README, hub README, ROUTER, hub-router keyword, shared references, feature catalog, quality, ci and review READMEs, references and playbooks; the other hits are the two `LEGACY_*` constants, the gate's repair line, the README checker's two allowlist entries, and the fixtures and tests that prove the refusal | Met | - |
| AC-011 | REQ-011 | Given the suites, When they run, Then every case passes | Five CI suites `tests 73 pass 73 fail 0`; the combined quality, doctor-quality, shared and CI run `tests 270 pass 270 fail 0`; pre-commit `152 passed, 0 failed`; the rule canary prints `All rule-canary test cases passed`; the README checker prints `SELF-TEST PASS` | Met | - |
| AC-012 | REQ-012 | Given the five skills, When the changelogs and carriers are read, Then each entry exists and its `SKILL.md:5` carries the same version | `v3.9.15.0.md` with `3.9.15.0`, `v1.1.7.0.md` with `1.1.7.0`, `v1.13.9.0.md` with `1.13.9.0`, `v1.9.8.0.md` with `1.9.8.0` and `v1.3.7.0.md` with `1.3.7.0`, each matching its `SKILL.md` | Met | - |

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

Every criterion is met with observed runs against the worktree, and the packet's five documents agree on the same completion state.
<!-- /ANCHOR:closure -->
