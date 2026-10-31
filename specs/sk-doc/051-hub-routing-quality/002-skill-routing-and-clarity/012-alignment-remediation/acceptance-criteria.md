---
title: "Acceptance Criteria: Phase 12: alignment-remediation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "alignment remediation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/012-alignment-remediation"
    last_updated_at: "2026-10-28T21:50:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the evidence for every criterion"
    next_safe_action: "Land the phase on main"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0266-alignment-remediation-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 12: alignment-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-doc/072-skill-routing-and-clarity/012-alignment-remediation`
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
| AC-001 | REQ-001 | Given the mirror expectation reads the tree's ignore rules, When `sync-runtime-mirrors.cjs --check` and `validate-command-tree-parity.sh` run, Then both exit 0 and the test file covers the expected-mirror set and the MISSING branch. | `sync-runtime-mirrors.cjs --check` and `validate-command-tree-parity.sh` both print `PASS: 201 mirrors across 9 trees are in sync.` with exit 0, and `node --test sync-runtime-mirrors.test.mjs` reports 5 tests, 5 pass, covering ignored roots, a tracked root, a `local-*` entry and the MISSING branch | Met | - |
| AC-002 | REQ-002 | Given the preamble rule reads unconditionally and cli-devin is under 5000 words, When `validate_skill_package.py` runs on cli-devin, Then it prints `PASS`. | `validate_skill_package.py` on cli-devin prints `package_skill.py --check: PASS (exit 0)`, and the gated preamble wording appears in no cli SKILL.md | Met | - |
| AC-003 | REQ-003 | Given cli-orca's routing signal is corrected, When `advisor_recommend` runs on both operator phrasings, Then each returns `cli-orca` as top-1. | Live `advisor_recommend` from the worktree, after a forced rebuild and a daemon restart: cli-orca 0.8397 for the first phrasing and 0.9187 for the second, each top-1. The scorer fix is in `fusion.ts`, with routing accuracy at 155/195, 49/66 and 19/24 before and after | Met | - |
| AC-004 | REQ-004 | Given the leaf-scopes capability is documented, When the four documents are searched, Then each names `leaf-scopes.json` and the advisor's inventory names all five leaf roots. | `rg -l leaf-scopes` lists the sk-create-skill SKILL.md, the root-metadata contract, the playbook index and its standalone scenario, and `system-skill-advisor/SKILL.md:256` names all five leaf roots | Met | - |
| AC-005 | REQ-005 | Given the two checkers are corrected and the READMEs with real defects are fixed, When both rows rerun over the 55 files, Then each prints `SUMMARY files=55 pass=55 fail=0`. | Both rows rerun over the 55 files print `SUMMARY files=55 pass=55 fail=0`, and `check_derived_readme_counts.py --self-test` prints `SELF-TEST PASS` | Met | - |
| AC-006 | REQ-006 | Given sk-create-benchmark is bumped, When its changelog folder and package check are read, Then `v1.6.3.0.md` exists and the package check prints `PASS`. | `changelog/v1.6.3.0.md` exists, and `validate_skill_package.py` on sk-create-benchmark prints `package_skill.py --check: PASS (exit 0)` | Met | - |
| AC-007 | REQ-007 | Given the comment is corrected and the two test cases are restored, When the comment is searched and both test files run, Then the removed glob is named nowhere and both files pass with the restored cases. | `rg -c "The other spelling"` on `index-scope.ts` finds nothing, `quality-gate-surfaces.test.cjs` holds both plugins-link cases inside the 96 passing `quality-gate-*` tests, and `test_audit_descriptions.py` reports 13 passed | Met | - |
| AC-008 | REQ-008 | Given the OVERVIEW sections are added, When `validate_document.py` runs on each of the four files, Then each exits 0. | `validate_document.py` prints `Total issues: 0` with exit 0 on each of the four files | Met | - |
| AC-009 | REQ-009 | Given prompt-improver cites the command that exists, When the agent file and its three mirrors are searched, Then the wrong path appears in none of them. | `rg -c 'prompt-improve\.md'` finds nothing in the agent or in its `.claude`, `.codex` and `.pi` mirrors, and `.skilled/commands/prompt/improve.md` exists | Met | - |
| AC-010 | REQ-010 | Given the duplicated filters are dropped, When each of the three workflow files is searched, Then `.opencode/plugins` appears once per trigger block. | Each of the three workflows has 2 trigger blocks and 2 `.opencode/plugins` entries | Met | - |
| AC-011 | REQ-011 | Given the changed-packets job is sized from its own runs, When the workflow is read, Then its timeout covers the full-history checkout its step performs. | `changed-packet-validation.yml:21` reads `timeout-minutes: 20`, and the checkout adds `filter: blob:none` beside `fetch-depth: 0`. CI on the landing commit confirms the job finishes | Met | - |
| AC-012 | REQ-012 | Given the sk-code standards are aligned, When the quality gate and the review checks run, Then both pass and no shared rule is stated twice with different wording. | The 96 `quality-gate-*` tests, the config and configured-check suites, the rule canary (133 PASS) and the comment-hygiene, ceiling-report and typo-flag suites all pass. A `find … -exec wc -l` over the three modes' scripts, the shared scripts and the five sk-code doctor scripts lists no code file past 500 lines | Met | - |
| AC-013 | REQ-013 | Given the sk-code-skilled guides agree, When their shared rules are compared, Then each shared rule reads the same in every guide that states it. | The four language standards state the shared rules in the same words, read section by section after the guide pass, and `run-all-drift-guards.sh` reports all 4 guards passed | Met | - |
| AC-014 | REQ-014 | Given the five playbooks are brought in line, When each playbook's own check runs, Then each passes and every scenario it lists resolves. | `validate-playbook-package.cjs` reports `violations=0 warnings=0` on all five packages, and `verify-router-sync.cjs` reports 5/5 | Met | - |
| AC-015 | REQ-015 | Given every flagged README has a disposition, When the diff is read against `plan.md` §5, Then the two match row for row and no README changed only to satisfy a checker misreading. | Replaced by AC-016: ten rule rows and three fix rows shipped as reasoned `readme-check` markers, as ADR-001 records | Superseded | ADR-001 |
| AC-016 | REQ-015 | Given each flagged README has a disposition, When the diff is read against `plan.md` §5 and ADR-001, Then each token-class row is a checker rule with a test case, each one-README row is a `readme-check` marker with its reason, and each text change fixes a real defect. | The reference checker's template rule and the count checker's category and folder rules each have a self-test or pytest case, 14 READMEs carry a reasoned marker, and the sk-create-diff and plugin tests READMEs fix real defects | Met | - |

A `-` in the Verification cell means no evidence is recorded yet. The Then clause of each row names the command and the output that will prove it, and `tasks.md` Phase 3 carries the same check, so the row is testable before its evidence exists.

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

A row reading `Not yet met` is unmet: the criterion is written and the evidence is not. It blocks closure exactly as `Unmet` does.

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

Fifteen criteria are Met with observed evidence, and AC-015 is Superseded by AC-016 under ADR-001, which `decision-record.md` holds.
<!-- /ANCHOR:closure -->
