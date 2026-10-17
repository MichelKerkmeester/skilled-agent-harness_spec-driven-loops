---
title: "Tasks: Phase 9: second-review-remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "second review remediation tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: second-review-remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture baselines for every gate before any edit (scratchpad `fix009/baseline/`) [EVIDENCE: Baselines in scratchpad fix009/baseline: doctor runner 7/7 suites, node 334/334, battery tests 47/47, battery claude STATUS=OK, hermes exit 2, route-validate OK, package PASS at 4,990 words, playbook PASS 46, Hermes sync 68, mirrors 185, drift guards 4/4]
- [x] T002 Re-read every cited line and confirm or reject each finding (plan.md section 8) [EVIDENCE: All 19 findings confirmed against the cited lines, none rejected (plan.md section 8)]
- [x] T003 Write the child preamble and back up each target before its dispatch (scratchpad `fix009/`) [EVIDENCE: Preamble at fix009/pre.txt, a backup before each of 27 dispatches]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 P1-5 Expect only real git hook names in the hook folder (.skilled/commands/doctor/scripts/git-setup-check.cjs:344) [EVIDENCE: Luna dispatch 1. GIT_HOOK_NAMES mirrors is_git_hook_name. Mutation: old filter fails the .DS_Store test]
- [x] T005 P1-4 Shell-quote every path in a repair line (.skilled/commands/doctor/scripts/git-setup-check.cjs:305, :336, :459) [EVIDENCE: Luna dispatch 2. shellQuote on five repair paths. New space-in-path round trip. Mutation caught]
- [x] T006 P1-1 Report hooks that link into the repository's own tree as running its own scripts (.skilled/commands/doctor/scripts/git-setup-check.cjs:397) [EVIDENCE: Luna dispatch 3. New own-tree trust test. Mutation caught]
- [x] T007 P1-2 Validate the inspected repository's `hard-rules.json` and name it in the repair (.skilled/commands/doctor/scripts/git-setup-check.cjs:707) [EVIDENCE: Luna dispatch 4. Reads <repo>/.skilled/skills/sk-git/hard-rules.json, DEGRADED when missing, repair names the absolute path. Both rewritten tests fail on the old code]
- [x] T008 P1-3 Require the advisory script a registration runs to exist (.skilled/commands/doctor/scripts/git-setup-check.cjs:854) [EVIDENCE: Luna dispatch 5 failed (unparseable regexes, reported incomplete), battery restored from backup and its tests kept. Dispatch 5b fixed the battery, 5c added the opencode/pi import test. Both mutations caught]
- [x] T009 P2-4 Treat Claude's `"*"` matcher as match-all (.skilled/commands/doctor/scripts/git-setup-check.cjs:867) [EVIDENCE: Luna dispatch 6. Mutation caught]
- [x] T010 P2-6 Report an adapter parse error without its text (.skilled/commands/doctor/scripts/git-setup-check.cjs:938) [EVIDENCE: Luna dispatch 7. Symlink-to-secret test checks neither output carries the text. Mutation caught]
- [x] T011 P2-3 Accept `--tool=hermes` and check the repo-guards adapter (.skilled/commands/doctor/scripts/git-setup-check.cjs:52) [EVIDENCE: Luna dispatch 8. --tool=hermes on this checkout: STATUS=OK checks=11, exit 0. Mutation caught]
- [x] T012 P2-1 Make allowlist UNKNOWN on a helper exit other than 0 or 1, or `main` refused (.skilled/commands/doctor/scripts/git-setup-check.cjs:519) [EVIDENCE: Luna dispatch 9. Mutation caught]
- [x] T013 P2-2 Apply the safe git environment once in `main()` and drop `GIT_FLAGS` (.skilled/commands/doctor/scripts/git-setup-check.cjs:126, :210) [EVIDENCE: Luna dispatch 10, second attempt (the first halted on the sandbox xcrun_db artifact before editing). GIT_DIR test now covers standards. Mutation caught]
- [x] T014 P2-5 Report a fully muted advisory as DEGRADED (.skilled/commands/doctor/scripts/git-setup-check.cjs:783) [EVIDENCE: Luna dispatch 11. Mutation caught]
- [x] T015 P2-7 Print the install restore only for paths in HEAD (.skilled/commands/doctor/scripts/git-setup-check.cjs:298) [EVIDENCE: Luna dispatch 12. Mutation caught]
- [x] T016 P2-8 Fail a dangling symlink as the worktree base (.skilled/commands/doctor/scripts/git-setup-check.cjs:586) [EVIDENCE: Luna dispatch 13. Mutation caught]
- [x] T017 P2-9 Cap detail lines in the human render only (.skilled/commands/doctor/scripts/git-setup-check.cjs:993) [EVIDENCE: Luna dispatch 14. Mutation caught]
- [x] T018 P2-10 Build the Commit-Id repair with the install-root label (.skilled/commands/doctor/scripts/git-setup-check.cjs:78) [EVIDENCE: Luna dispatch 15. The rules repair was rebuilt in dispatch 4. Mutation caught]
- [x] T019 P2-14 Print a reason before the usage line, and name invalid JSON in `hard-rules.json` (.skilled/commands/doctor/scripts/git-setup-check.cjs:1084, :717) [EVIDENCE: Luna dispatch 16 (usage reasons). Invalid JSON message came with dispatch 4. Mutation caught]
- [x] T020 P2-13 Resolve the fsmonitor assertion that cannot fail (.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:356) [EVIDENCE: Luna dispatch 17 removed the assertion that could not fail. The gpg.program test proves the environment reaches every child]
- [x] T021 P2-3 Pass `--tool=hermes` from the setup workflows and name hermes in the command docs (doctor-git-setup.yaml:41, :48, doctor-setup.yaml sk-git leg, git.md:60) [EVIDENCE: Luna dispatch 18. The parallel build's "Exit 2" sentence on the sk-git leg kept. YAML parses, route-validate OK]
- [x] T022 P2-3 Name Hermes as the seventh runtime and give one registration entry per runtime (.skilled/skills/sk-git/SKILL.md:250, README.md:60, scripts/hooks/README.md section 3) [EVIDENCE: Luna dispatch 20. package_skill.py PASS at 4,990 words. Hermes mirror regenerated]
- [x] T023 P2-12 Match the setup YAML step text to the code and list FAIL rows like the YAML (doctor-git-setup.yaml:49, doctor-git-presentation.txt:245, :256) [EVIDENCE: Luna dispatches 19 and 19b (pipe joiner fixed to a slash)]
- [x] T024 P2-11 Move the input gate before section 1 in four commands (deep/research.md, deep/review.md, deep/ai-council.md, prompt/improve.md) [EVIDENCE: Luna dispatch 21. Each gate sits after the H1 and before section 1. validate_document --type command: 0 issues each]
- [x] T025 P2-11 Make the 008 known limitation current (008-out-of-scope-cleanup/implementation-summary.md:122) [EVIDENCE: Edited by the orchestrator (spec-folder doc). validate_document --type spec: 0 issues]
- [x] T026 P1-1 P1-2 P2-3 Correct the root README trust, shared files and verify lines (README.md:1503, :1505, :1507) [EVIDENCE: Luna dispatch 22. Only the three lines changed]
- [x] T027 P2-2 Correct the environment claim and the runtime list in the feature catalog and playbook (doctor-git-settings.md:31, doctor-git-setup-check.md:50) [EVIDENCE: Luna dispatch 23. Playbook validator PASS]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T028 Mutation check for each code fix: put the old code back and confirm its test fails [EVIDENCE: Every code fix has a mutation check that fails its test, see implementation-summary.md]
- [x] T029 Rerun every gate from the final state and compare it with the baseline [EVIDENCE: Final gates in implementation-summary.md Verification]
- [x] T030 Refresh the Hermes skill mirror and the runtime mirrors if the sk-git or command sources changed [EVIDENCE: sync-skills-hermes wrote 1 of 68 (sk-git), --check PASS. Runtime mirrors 185 in sync]
- [x] T031 Add hermes to the `/doctor:git setup` route's `--tool` list in `_routes.yaml`, the one six-tool list left after both builds [EVIDENCE: orchestrator edit, `route-validate.sh` OK 14 routes, `git-setup-check.cjs --tool=hermes` STATUS=OK checks=11]
- [x] T032 Record the second-review fixes in the changelogs: sk-git v1.9.2.0, system-skill-advisor v0.16.2.0, system-spec-kit v2.8.2.0 and skilled v4.0.0.14, with each SKILL.md version raised and the Hermes copies synced [EVIDENCE: `hvr_scan.py` 0 hard blockers and `validate_document.py` 0 issues on all four, `package_skill.py --check` PASS on three skills, `ci-skill-root-metadata.cjs` passed=14 failed=0]
- [x] T033 Give every component this round changed its own changelog entry: mcp-tooling v1.8.3.0 (the "mcp tools" phrase), system-deep-loop v1.6.4.0 (the three deep command gates) and sk-prompt v3.0.4.0 (the `/prompt:improve` gate), with their hub carriers raised and ROUTER.md left on its own version. The gate bullet moves out of system-spec-kit v2.8.2.0, which does not own those commands, and is replaced by the spec-kit short-prompt routes. sk-git v1.9.2.0 gains its short-prompt routes [EVIDENCE: `hvr_scan.py` 0 hard blockers and `validate_document.py` 0 issues on all five, `parent-skill-check.cjs` OK on mcp-tooling and system-deep-loop, sk-prompt fails the same hub-file checks with or without this change (6 failures at 3.0.3.0, 5 at 3.0.4.0), `ci-skill-root-metadata.cjs` passed=14, Hermes 68 in sync]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding check**: See `plan.md` section 8
<!-- /ANCHOR:cross-refs -->

---
