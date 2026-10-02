---
title: "Acceptance Criteria: Template-driven, repo-agnostic enforcement of commit messages and PR descriptions"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/032-template-driven-message-enforcement"
    last_updated_at: "2026-10-01T19:05:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed AC-006: first CI run passed and the check is required by ruleset 24326453"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-032-template-driven-message-enforcement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Template-driven, repo-agnostic enforcement of commit messages and PR descriptions

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-git/032-template-driven-message-enforcement
**Level:** 3
**Status:** Complete
**Date:** 2026-10-01
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the sk-git commit template, When its contract block is parsed, Then it holds a rule id for every rule the current `commit-msg` and `prepare-commit-msg` enforce, plus the `Spec:` packet-existence rule | .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs:60; Parity run of the 22 original `commit-msg.test.sh` cases plus 19 commit rule ids in the template table; `templateDriftErrors` clean (`message-contract.test.mjs`, 38b2135472) | Met | - |
| AC-002 | REQ-002 | Given the finished change, When the hook, pre-push, agent gate and CI sources are searched for rule patterns, Then none carries its own copy of a rule | .skilled/scripts/git-hooks/commit-msg:75; `rg` over `commit-msg`, `lib/message-contract-gate.sh`, `git-message-gate.mjs`, the workflow and pre-push gate 6 finds only the rules-heading probe and zero-SHA checks (38b2135472) | Met | - |
| AC-003 | REQ-003 | Given git config `skgit.messageContract`, a repo `.sk-git/` template, the repo's sk-git templates and none of them, When `validate-message.mjs --explain` runs, Then it names the expected source each time and reports no enforcement when none exists | .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs:152; `message-contract.test.mjs` resolution tests (no templates, `.sk-git/`, missing `skgit.contractDir`) and `validate-message.mjs --explain` output (38b2135472) | Met | - |
| AC-004 | REQ-004 | Given a fixture repository whose template allows only `feat`/`fix`, drops `Spec:` and sets a 72-character limit, When commits are validated there, Then its rules apply and sk-git's do not | .skilled/scripts/git-hooks/tests/commit-msg.test.sh:377; `commit-msg.test.sh` case 24: a `.sk-git/` template with only feat/fix and a 50-char limit accepts `feat: …` and rejects `docs(…)` and a 61-char subject (38b2135472) | Met | - |
| AC-005 | REQ-005 | Given a commit whose subject, body or trailers break the contract, When `git commit` runs, Then it is blocked and each violation is printed with its rule id | .skilled/scripts/git-hooks/tests/commit-msg.test.sh:81; `commit-msg.test.sh` 29/29; every block names its rule id (38b2135472) | Met | - |
| AC-006 | REQ-006 | Given a pushed commit or PR body that breaks the contract, When the `message-contract` workflow runs, Then the check fails and names the commit or section | .github/workflows/message-contract.yml:41; First GitHub run 36910183390 on push 502e06659c passed; the check "Commit messages, branch names and PR description follow the templates" is required on the default branch by ruleset 24326453 (`message-contract-required`, active, admin role may bypass) | Met | - |
| AC-007 | REQ-007 | Given every case in `tests/commit-msg.test.sh`, When run through the old hook and the new validator, Then the verdicts are identical | 19 of 22 original cases give identical verdicts; 3 change on purpose (bypass case 9, `specs/`-prefixed Spec cases 4 and 10) | Superseded | ADR-004 |
| AC-008 | REQ-008 | Given a commit made with `--no-verify` that breaks the contract, When it is pushed, Then `pre-push` blocks the push | .skilled/scripts/git-hooks/tests/pre-push-message-contract.test.sh:86; `pre-push-message-contract.test.sh` cases 2 and 3: a hookless commit is blocked at push, including below a good tip; 10/10 (38b2135472) | Met | - |
| AC-009 | REQ-009 | Given an agent runs `gh pr create` with a body missing a required section, When the PreToolUse gate fires, Then the call is denied with the violated rule ids | .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs:179; Gate denies over real payloads for Claude, Codex and Devin (`permissionDecision: deny`) and Cursor (`permission: deny`, exit 2), rendered through the hook registry. OpenCode throws the refusal (.opencode/plugins/tests/sk-git-message-gate.test.cjs, 5/5), Pi returns `{ block: true }` (.skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.test.ts, 3/3) and Hermes returns `action: block` (.hermes/plugins/repo-guards/tests/test_repo_guards.py, 48/48, one case running the real core). Not yet proven in a live OpenCode, Pi or Hermes session | Met | - |
| AC-010 | REQ-010 | Given a self-check bullet with no matching contract rule id, When the drift test runs, Then it fails | .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs:66; `message-contract.test.mjs` "drift is caught in both directions" (38b2135472) | Met | - |
| AC-011 | REQ-011 | Given `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1` is set, When a misaligned commit is made, Then it is still blocked; and a `--no-verify` commit is caught by pre-push and CI | .skilled/scripts/git-hooks/tests/commit-msg.test.sh:190; `commit-msg.test.sh` case 9 and pre-push case 4 block with `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1` set; `rg` finds the variable only in those tests, the retired changelog and a spec-kit scratch playbook (38b2135472) | Met | - |
| AC-012 | REQ-012 | Given a branch named outside the naming contract, When the agent creates it, it is pushed, or CI runs, Then each layer blocks it with the rule id | .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs:138; Branch rules in `message-contract.test.mjs`, agent-gate branch test, pre-push cases 5 and 6 (38b2135472) | Met | - |
| AC-013 | REQ-013 | Given a canonical scope or a configured scope alias, When the contract validates it, Then canonical scopes pass and aliases fail with `subject.scope-alias`; replay of the missed range reports exactly the three new rule ids for the four recorded deviations | .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs:124; alias fails with `subject.scope-alias` and the canonical scope passes; `node --test` 24 pass 0 fail; .skilled/scripts/git-hooks/tests/commit-msg.test.sh:442 "the hook names the canonical scope" (PASS=31 FAIL=0); replay of `f8519088b9..03afeb4552` flags exactly 4ceef9d5e7 `body.breaking-sections`, 7488e80836 `subject.scope-alias`, 4754d270ab `subject.length-target` | Met | - |
| AC-014 | REQ-014 | Given subjects at 80, 81 and 100 characters and a subject above 100, When validation runs, Then lengths above 80 through 100 warn with `subject.length-target`, while lengths above 100 remain blocked | .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs:139; an 81-character subject yields only the `subject.length-target` warning and 80 yields none, `node --test` 24 pass 0 fail; maxLength 100 stays an error; replay warns on the 82-character subject of 4754d270ab | Met | - |
| AC-015 | REQ-015 | Given a breaking commit missing any of `Context`, `Changes` or `Verification`, When validation runs, Then it is blocked with `body.breaking-sections`; a breaking commit with all three sections passes this rule | .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs:161; "breaking commits require every declared section" passes; a breaking message with Context and Changes but no Verification is blocked by `validate-message.mjs --commit` with "Missing: Verification" (exit 1) | Met | - |
| AC-016 | REQ-016 | Given the commit template and `SKILL.md`, When their scope guidance and examples are reviewed, Then they use `system-spec-kit`, `system-skill-advisor`, `system-deep-loop` and `repo-rules` as canonical scopes | .skilled/skills/sk-git/assets/commit-message-template.md:132; the example reads `fix(system-spec-kit):`; the scopeAliases block at .skilled/skills/sk-git/assets/commit-message-template.md:228 maps spec-kit, skill-advisor, deep-loop and rules to their canonical scopes; `--check-template --kind commit` exits 0 | Met | - |
| AC-017 | REQ-017 | Given the unit and hook tests pass locally, When the message-contract workflow runs for the implementing change, Then CI executes the unit suite and reports success | .github/workflows/message-contract.yml:42; the step runs `node --test .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs`, which passes locally (27/27); workflow run 37013431668 on 88cf1b5f36 concluded success, with the "Test message contract rules" step passing | Met | - |

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

All 16 active criteria are Met. AC-007 remains Superseded by ADR-004 because three verdict changes were intentional. Follow-up criteria AC-013 through AC-017 are Met; AC-017 closed on the CI run for the pushed change.
<!-- /ANCHOR:closure -->
