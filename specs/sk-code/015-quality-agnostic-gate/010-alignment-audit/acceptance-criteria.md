---
title: "Acceptance Criteria: Phase 10: alignment-audit"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "alignment audit acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/010-alignment-audit"
    last_updated_at: "2026-10-26T20:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Flipped AC-006 to Met and added AC-017 and AC-018, all eighteen criteria Met"
    next_safe_action: "Operator commits the working tree"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-alignment-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Phase 10: alignment-audit

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/015-quality-agnostic-gate/010-alignment-audit
**Level:** 2
**Status:** Complete
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Commands run from the repository root. Set the variables from `tasks.md` (`H`, `Q`, `R`, `P`). A `\|` inside a table cell stands for a plain `|` in the command. Every reading is HEAD `6d6e82c269` plus the uncommitted working tree.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the code and config files these packets changed, When the quality runner checks them in file mode, Then the gate reads `NO_BLOCKER_FOUND` with no finding | `node $Q/scripts/quality-gate.cjs --lines file --format json --files <final code set>` exits 0 with gate `NO_BLOCKER_FOUND`. Evidence 2026-10-26: over 421 files it printed `p0_blocking 0`, `p1_open 0`, `p2_open 0` and 0 findings, with `comment-hygiene` `RAN_CLEAN` over 347 files and `secrets` over 406 | Met | - |
| AC-002 | REQ-001 | Given the workflows, shell scripts and test files in scope, When `actionlint`, `shellcheck`, the four drift guards and the gate-input check run, Then each exits 0 and the six findings' test files sit under `tests/` | `actionlint .github/workflows/*.yml`, `shellcheck -S warning` on `test-dist-freshness.sh`, `run-all-drift-guards.sh` and `check-gate-inputs.sh` each exit 0. Evidence 2026-10-26: `actionlint` printed nothing, `shellcheck` printed nothing, the guards printed `all 4 guards PASSED, 10 non-blocking warning(s)` and the gate-input check printed `files=45 ... failures=0` and `RESULT: PASSED`. A `find` for `*.test.*` outside a `tests/` folder in the three scripts folders listed two files, `typo-flags.test.sh` and `hooks/claude-posttooluse.test.sh`, neither in the scope file nor changed by these packets, and both are named in the scripts README | Met | - |
| AC-003 | REQ-002 | Given the 23 in-scope skill and mode packets, When the strict package check runs on the two that failed, Then both pass, and the four hubs pass the parent-skill check | `validate_skill_package.py --strict` on cli-opencode and sk-git exits 0. Evidence 2026-10-26: both printed `package_skill.py --check --strict: PASS (exit 0)`. `parent-skill-check.cjs` on sk-code, system-deep-loop, cli-external-orchestration and sk-doc each printed `all hard invariants passed, 0 warnings` | Met | - |
| AC-004 | REQ-002 | Given `sk-code/ROUTER.md`, When its headings and citations are read, Then the sections run 1 to 10 and no citation points at a section that is gone | `! rg -n 'section 11' $H/README.md`, `verify-router-sync.cjs` exits 0, and the drift guards pass. Evidence 2026-10-26: the guards printed `all 4 guards PASSED`, which runs `verify-router-sync`, the route guard printed `All hubs fresh or excused`, and `rg -n 'section 11'` on the sk-code README found no match (exit 1) | Met | - |
| AC-005 | REQ-003 | Given the in-scope playbook packages, When the package validators and the sk-code topology validator run, Then each prints `PASS` with 0 violations, and the features these packets shipped each have a scenario | `validate-playbook-package.cjs --package <p>` and `validate-playbook-topology.cjs --skill-dir $H --strict`. Evidence 2026-10-26: sk-code `scenarios=28 ... violations=0 warnings=0`, sk-code-quality `scenarios=11 ... violations=0 warnings=11`, sk-code-skilled `scenarios=9 ... violations=0`, sk-code-ci `scenarios=1 ... violations=0`, cli-external-orchestration `scenarios=24 ... violations=0 warnings=0`, system-deep-loop `scenarios=20 ... violations=0`, and the topology printed `verdict=PASS valid=14 blocked=0 unenrolled=15 total=29`. The 11 quality warnings are `BACKTICK_PATH_UNRESOLVED` on fixture paths. `ls` lists `untrusted-config.md`, `scoped-checklist-faults.md` and `parallel-syntax-pool.md` under `quality-gate/`, and `doctor-ci-scaffold.md` and `doctor-ci-toggle.md` under `doctor-commands/` | Met | - |
| AC-006 | REQ-006 | Given three prompts that name GitHub Actions work, When the hub router resolves each, Then each routes to `sk-code-ci`, and a quality-config or trust prompt routes to `sk-code-quality` | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt '<prompt>'` names `sk-code-ci` for all three and `compiled-route-admission.cjs --all` exits 0. Evidence 2026-10-26: after `deploy workflow`, `release workflow`, `turn off the ci`, `turn on the ci` and `ci review workflow` joined the `sk-code-ci` keywords and the bare `github actions` keyword was narrowed to `github actions permissions` (T025), `harden the GitHub Actions permissions`, `add concurrency to the deploy workflow`, `turn off the CI review workflows` and `add a timeout to the CI job` each routed `single` to `sk-code-ci`. `review the github actions workflow yaml` routed `surfaceBundle` to `sk-code-review` and `sk-code-ci`, `review my pull request` routed `single` to `sk-code-review`, `run the quality gate on my change` routed `single` to `sk-code-quality`, and `why is my repository check SKIPPED_UNTRUSTED` routed `surfaceBundle` to `sk-code-quality` and `sk-code-skilled`. Admission printed `Every hub passes the admission check`, the guard printed `All hubs fresh or excused` with exit 0, and `node --test .skilled/bin/tests/compiled-route-*.test.cjs` printed `tests 94`, `pass 94`, `fail 0` | Met | - |
| AC-007 | REQ-004 | Given the READMEs next to the changed files, When they are validated and compared with their folders, Then none lists a file set that differs from its folder and none tells migration history | `validate_document.py --blocking-only` over the changed READMEs prints no `FAIL`, and the file-name loops print no `MISSING`. Evidence 2026-10-26: 86 changed or new markdown files, READMEs among them, printed no `FAIL`. Reported by the re-audit: the doctor scripts, doctor tests, quality scripts, lib, hooks and plugin tests READMEs each printed `Total issues 0` or an empty `MISSING` loop, and `grep -c 'new home\|no longer lives'` printed `0` | Met | - |
| AC-008 | REQ-005 | Given the root README and the commands index, When they are read against the tree, Then they name the quality runner, the trust grant and the `quality` target, and a link in them resolves | `rg -c trustRepoChecks README.md` prints `1` or more, and `validate_document.py README.md` prints `Total issues: 0`. Evidence 2026-10-26: `rg -c trustRepoChecks README.md` printed `1`, and the changed-markdown run printed no `FAIL` for `README.md` or `.skilled/commands/README.txt`. Reported by the re-audit: `README.md:1250` reads `/doctor:sk-code [setup\|quality] [--prompt=<text>] [--dry-run]` and the broken Devin hooks link count is `0` | Met | - |
| AC-009 | REQ-007 | Given the skill advisor, When a bare `/doctor:ci` is submitted, Then it returns the report bridge, and the bridge README describes the default-target rule | `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"/doctor:ci"}' --format json` names `command-doctor-ci-report`, and `rg -n default_target` on the bridge README prints a line. Evidence 2026-10-26: it returned `command-doctor-ci-report` with confidence `0.82`. Reported by c11: the README line 60 prints. The scorer question that `/doctor:git hooks` also returns the setup bridge second stays open in `spec.md` section 10 and does not decide this criterion | Met | - |
| AC-010 | REQ-008 | Given the changelog validator, When a changelog entry names an internal id or a test count, Then it warns, and each in-scope skill whose behavior changed has an entry at its `SKILL.md` version | `validate_document.py --type changelog` on `v1.4.0.0.md` prints a `changelog_internal_id` warning with exit 0, and the version loop prints `ok` for each packet. Evidence 2026-10-26: the warning printed, `test_changelog_validator.py` printed `12 passed`, and the loop over 15 packets printed `ok` 15 times | Met | - |
| AC-011 | REQ-009 | Given the command index and the `/doctor:setup` playbook, When they are read, Then they describe the 19-row table and the `quality` target, and the route and bridge gates pass | `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` prints `STATUS=OK`, `route-validate.sh` exits 0 and `rg -n '19' doctor-setup-run.md` prints the three lines. Evidence 2026-10-26: the catalog check printed `STATUS=OK command-catalog-mirror: every catalog and hub metadata covers the command tree`, `route-validate.sh` printed `OK: route-validate - 18 routes validated, 2 warnings`, and the search printed lines 22, 29 and 71 | Met | - |
| AC-012 | REQ-010 | Given the `@code` agent and its mirrors, When the Iron Law citation is read, Then each copy cites `workflow-verify.md` and the mirror checks pass | `rg -n 'sk-code/SKILL.md:62' .skilled/agents .claude/agents .pi/agents .codex/agents .hermes/skills/agent-code` finds none, and the three mirror checks exit 0. Evidence 2026-10-26: the `rg` found none (exit 1), `check-agent-mirror-sync.cjs --all` printed `11 agent(s) checked - all mirrors in sync - OK`, and the codex and pi syncs each printed `PASS: 11 agents are in sync` | Met | - |
| AC-013 | REQ-011 | Given the fifteen skill packets the fixes touched, When their versions and changelogs are read, Then each carries a bumped version with an entry at that number, and the packet changelog exists | The version loop prints `ok` for each, and `ls $R/changelog/changelog-015-010-alignment-audit.md` lists the file. Evidence 2026-10-26: the loop printed `ok` for all 15 and `git status` counted 15 new `changelog/v` files. `nested-changelog.js specs/sk-code/015-quality-agnostic-gate/010-alignment-audit --write` exited 0 and `ls` lists `changelog/changelog-015-010-alignment-audit.md`. No Files Changed row held command text, so none was removed | Met | - |
| AC-014 | REQ-011 | Given the generated copies, route manifests and mirrors, When their `--check` modes run, Then each exits 0 | `sync-skills-hermes.cjs --check`, `compiled-route-guard.cjs` and `compiled-route-sync.cjs --check`. Evidence 2026-10-26: they printed `PASS: 67 Hermes skill copies in sync`, `All hubs fresh or excused` with seven hubs `fresh`, and `all 55 served copies match their authored files`, each exit 0 | Met | - |
| AC-015 | All | Given the final tree, When the four node suites and the bash suites run, Then none fails | The quality, hook, sk-code-skilled and doctor suites exit 0. Evidence 2026-10-26: `# tests 123 ... # fail 0`, `# tests 13 ... # fail 0`, `# tests 31 ... # fail 0` and `# tests 470 ... # fail 0`, and `ceiling-report.test.sh`, `check-comment-hygiene.test.sh`, `check-rule-copies.test.sh`, `test-dist-freshness.sh` and `check-gate-inputs.test.sh` each exited 0 | Met | - |
| AC-016 | All | Given the finished packet, When the strict validator runs on this folder and recursively on the packet, Then both last lines read `RESULT: PASSED` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $R --recursive --strict \| tail -1` prints `RESULT: PASSED`. Evidence 2026-10-26: after `repair-derived.cjs --roots $R --apply` printed `inspected=11 repaired=3 failed=0`, `validate.sh $P --strict` printed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, and `validate.sh $R --recursive --strict` printed the same with exit 0. At closeout, after AC-006 flipped and AC-017 and AC-018 joined, `repair-derived.cjs --roots $R --apply` printed `inspected=11 repaired=2 failed=0`, and `validate.sh $P --strict` and `validate.sh $R --recursive --strict` each printed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, the recursive run with exit 0 | Met | - |
| AC-017 | REQ-012 | Given `AGENTS.md`, `REPO RULES.md` and the 13 `.skilled/repo-rules/` files, When two audit lenses and a refute pass read them, Then every surviving finding is fixed or resolved by a contract amendment, and the repo-rule checks pass | `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` prints `RESULT: PASSED` and `python3 -m pytest -q .skilled/skills/sk-doc/scripts/tests/test_check_repo_rules.py` passes. Evidence 2026-10-26: the contract and accuracy lenses raised 9 findings and the refute pass kept 5. ACCURACY-01, ACCURACY-02, CONTRACT-03 and CONTRACT-07 are fixed and CONTRACT-01 is resolved by amending `agents-md-integration.md` section 1 (T049 to T053). `check-repo-rules.cjs` printed `RESULT: PASSED (11/11 checks)`, the pytest run printed `6 passed`, `actionlint .github/workflows/repo-rules-corpus.yml` exited 0, `check-gate-inputs.sh` printed `RESULT: PASSED`, and `rg -n 'Reply Rules and Mandates' 'REPO RULES.md'` prints line 87. Reported by the conductor: `validate_document.py` on the edited docs printed 0 errors, and sk-create-repo-rule 1.1.2.0 carries a changelog for the edits | Met | - |
| AC-018 | REQ-001 | Given the six moved test files, When the moved suites run and the CI workflows are read, Then each suite passes from its new path and CI still runs it | The hook suite and the three moved bash suites exit 0, and the two workflows name the new paths. Evidence 2026-10-26: the hook suite printed `# tests 13 ... # fail 0` and the three moved `.sh` suites exited 0 (T007). `rg -n 'tests/.*\.test\.sh' .github/workflows/sk-code-script-tests.yml` prints the `sk-code-quality/scripts/tests/` paths at lines 83 and 84, and `opencode-plugin-tests.yml:112` finds hook tests with a recursive `find .skilled/hooks`, so the moved hook test stays in its run. Reported by the conductor and re-read here (T054) | Met | - |

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

All eighteen rows are `Met`. AC-006 closed on 2026-10-26 when the three CI prompts routed to `sk-code-ci`, and AC-017 and AC-018 record the repo-rules audit and the moved-test coverage. The items that stay open in `tasks.md` (T038, T039, T040, T041 and T045) are not acceptance criteria, and each carries its reason there.
<!-- /ANCHOR:closure -->
