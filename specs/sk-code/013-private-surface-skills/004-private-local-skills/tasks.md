---
title: "Tasks: Phase 4: private-local-skills"
description: "Task Format: T### [P?] Description (file path) - branch - proof"
trigger_phrases:
  - "private local skills tasks"
  - "restore local skills tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: private-local-skills

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

**Task Format**: `T### [P?] Description (file path)`

Every task also names the writer branch and one proof command. `plan.md` section 4 owns the commands, the quoted anchors and the replacement text; this file owns the order and the state.

Checkout rule: two checkouts, split by what each one holds. The operator's main checkout, `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, owns the two `local-*` trees and every command that reads them, because an ignored tree never travels between checkouts: T001 to T012, and the seven checks in T014, run there. The authoring worktree, `<worktree>`, owns every packet-document edit, because this child's documents exist only in that worktree: T013's evidence write, T015 and T016 run there, and T014 reads them there. No task copies a packet document into the operator's checkout and none copies one back: T013 transcribes readings taken in the operator's checkout into the worktree copy of `implementation-summary.md`, and T016 stages that same worktree copy.

Branch rule: `deepseekpi` for every task that changes content under `.skilled/skills/local-*`, and `deepseekpihigh` for the docs-only commit in T016.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P0] In the operator's main checkout (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`), verify the four preconditions in `plan.md` Step 0 and record the folder-mode decision; no file is written yet, and T013 writes the decision into `implementation-summary.md` (`.skilled/skills/local-webflow/`, `.skilled/skills/local-obsidian/`) - branch `deepseekpi` - proof: `git cat-file -t 42b41dd286` prints `commit`, `git check-ignore -v .skilled/skills/local-webflow` prints a line naming `/.skilled/skills/local-*`, `git diff --cached --name-only` prints nothing, and `git status --porcelain .skilled` prints nothing
- [ ] T002 [P0] In the operator's main checkout, restore both trees from `42b41dd286` with the Mode A or Mode B command block in `plan.md` Step 1, exactly as written, and nothing else (`.skilled/skills/local-webflow/`, `.skilled/skills/local-obsidian/`) - branch `deepseekpi` - proof: `test -f .skilled/skills/local-webflow/SKILL.md && test -f .skilled/skills/local-obsidian/SKILL.md && echo OK` prints `OK`, `find .skilled/skills/local-webflow/ -type f | wc -l` prints `158` and the `local-obsidian` twin `62`, and `git status --porcelain --ignored .skilled/skills/local-webflow .skilled/skills/local-obsidian | wc -l` prints `2`
- [ ] T003 [P0] Replace the six `references/workflow-*.md` symlinks with real copies using the loop in `plan.md` Step 2; remove each link with `rm` before the `cp`, because `cp` onto a symlink writes through it into the tracked hub file (`.skilled/skills/local-webflow/references/workflow-implement.md`, `workflow-debug.md`, `workflow-verify.md` and the same three under `.skilled/skills/local-obsidian/references/`) - branch `deepseekpi` - proof: `find .skilled/skills/local-webflow/ .skilled/skills/local-obsidian/ -type l | wc -l` prints `0`, `find .skilled/skills/local-webflow/ -type f | wc -l` prints `161` and the `local-obsidian` twin `65`, and `git status --porcelain .skilled` prints nothing
- [ ] T004 [P0] In the four copies that carry it, read the file and locate `../../sk-code-skilled/references/shared/workflow-guardrails.md` and replace it with `../../sk-code/sk-code-skilled/references/shared/workflow-guardrails.md` (`.skilled/skills/local-webflow/references/workflow-implement.md`, `.skilled/skills/local-webflow/references/workflow-verify.md`, `.skilled/skills/local-obsidian/references/workflow-implement.md`, `.skilled/skills/local-obsidian/references/workflow-verify.md`) - branch `deepseekpi` - proof: `grep -rn "\.\./\.\./sk-code-skilled/" .skilled/skills/local-webflow .skilled/skills/local-obsidian` prints nothing, and `grep -rc "workflow-guardrails.md" .skilled/skills/local-webflow/references/workflow-*.md .skilled/skills/local-obsidian/references/workflow-*.md` reports `0` for each `workflow-debug.md`, `1` for each `workflow-implement.md` and `2` for each `workflow-verify.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [P0] Create the link audit exactly as `plan.md` Step 4 gives it, and take the intermediate reading on both skills before any link edit; the intermediate reading is expected to fail and is not the pass condition (`/tmp/psurf-phase4/link-audit.sh`) - branch `deepseekpi` - proof: `bash /tmp/psurf-phase4/link-audit.sh .skilled/skills/local-webflow` and the `local-obsidian` twin both run to completion and end `AUDIT_FAIL=1`, with at least one `BROKEN` line each
- [ ] T006 [P0] Apply `E-20` to `E-28` from the `plan.md` edit catalogue, one file at a time; apply `E-27` and `E-28` to `assets/animation/snippets/README.md` first, then `E-25` and `E-26` to the four other asset READMEs and never to the snippets file (`references/shared/enforcement.md`, `references/shared/cross-language-rules.md`, `references/shared/dev-workflow/common-commands.md`, `references/javascript/quick-reference.md`, `references/performance/interaction-gated-loading.md`, `assets/patterns/README.md`, `assets/integrations/README.md`, `assets/scripts/README.md`, `assets/templates/README.md`, `assets/animation/snippets/README.md`) - branch `deepseekpi` - proof: `bash /tmp/psurf-phase4/link-audit.sh .skilled/skills/local-webflow` prints only the one pre-existing `BROKEN ... shared-listener-and-weakmap.md -> target` line and ends `AUDIT_FAIL=1`
- [ ] T007 [P0] Apply `O-29` to `O-34` from the `plan.md` edit catalogue, including the prose path mentions those blocks carry (`SKILL.md`, `README.md`, `manual-testing-playbook/surface-detection/negative-control-non-obsidian.md`) - branch `deepseekpi` - proof: `bash /tmp/psurf-phase4/link-audit.sh .skilled/skills/local-obsidian` prints no `BROKEN` line and ends `AUDIT_FAIL=0`
- [ ] T008 [P1] Apply `E-18` to `.skilled/skills/local-webflow/README.md` first, because its `OLD` block quotes the pre-rewrite hub path that the `sed` consumes; then rewrite every remaining absolute self-path with the two `sed` passes in `plan.md` Step 6, excluding `changelog/` and `benchmark/reports/` (every `.md`, `.mjs`, `.js`, `.css` and `.html` under `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/`) - branch `deepseekpi` - proof: `grep -rn 'sk-code/sk-code-webflow\|sk-code/sk-code-obsidian' .skilled/skills/local-webflow .skilled/skills/local-obsidian | grep -v '/changelog/'` prints nothing
- [ ] T009 [P0] Apply `E-01` to `E-17` and `E-19` from the `plan.md` edit catalogue (`E-18` already ran in T008): frontmatter, section 1, section 2b, the AT A GLANCE rows, QUICK START step 1, HOW IT WORKS, INTEGRATION & NAVIGATION, the two FAQ answers and the RELATED DOCUMENTS row (`.skilled/skills/local-webflow/SKILL.md`, `.skilled/skills/local-webflow/README.md`) - branch `deepseekpi` - proof: `grep -n -i "hub bundles\|hub detects\|the hub's\|packetKind\|advisor-invisible\|parent hub" .skilled/skills/local-webflow/SKILL.md .skilled/skills/local-webflow/README.md` prints nothing, and `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/local-webflow/README.md --type readme` prints `VALID`
- [ ] T010 [P0] Apply `O-01` to `O-28` from the `plan.md` edit catalogue, skipping `O-31`, `O-32` and `O-33` because `O-24` already replaces their block (`.skilled/skills/local-obsidian/SKILL.md`, `.skilled/skills/local-obsidian/README.md`) - branch `deepseekpi` - proof: `grep -n -i "hub bundles\|hub detects\|the hub's\|packetKind\|advisor-invisible\|parent hub\|NESTED_IDENTITY" .skilled/skills/local-obsidian/SKILL.md .skilled/skills/local-obsidian/README.md` prints nothing, and `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/local-obsidian/README.md --type readme` prints `VALID`
- [ ] T011 [P0] Write one skill-root `graph-metadata.json` per skill using the field table in `plan.md` Step 8, with the trigger vocabulary read from `git show 42b41dd286:.skilled/skills/sk-code/mode-registry.json` at line 73 and line 110 and `git show 42b41dd286:.skilled/skills/sk-code/hub-router.json` at lines 74, 77, 90 and 93 (the `keywords` arrays; each key sits one line above its array) (`.skilled/skills/local-webflow/graph-metadata.json`, `.skilled/skills/local-obsidian/graph-metadata.json`) - branch `deepseekpi` - proof: `node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root .skilled/skills/local-webflow --write` and the same for `local-obsidian` each report `"status": "written"` or `"status": "unchanged"`, never `"status": "error"`, and a second run of each without `--write` reports `"status": "unchanged"`, because the default is a dry run and a `"status": "would-change"` on the second run means the file is still wrong
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 [P0] Prove the advisor indexes both skills on a throwaway database using the block in `plan.md` Step 9; the database lives at the absolute path `/tmp/psurf-phase4/advisor-db`, outside the repository tree, and the override relocates it, so the live one is untouched and no untracked directory appears in either checkout (`.skilled/skills/local-webflow/graph-metadata.json`, `.skilled/skills/local-obsidian/graph-metadata.json`) - branch `deepseekpi` - proof: the `sqlite3 ... "SELECT id FROM skill_nodes WHERE id LIKE 'local-%'"` query prints `local-obsidian` and `local-webflow`, one per line
- [ ] T013 [P0] In the authoring worktree, write the evidence into `implementation-summary.md` from the readings T005 to T012 took in the operator's checkout - folder mode, restore commands, the intermediate and final link-audit readings, ignore evidence, advisor scan result, paths and counts only - then remove `/tmp/psurf-phase4`, which holds the link audit and the throwaway database, so the repository tree holds no temporary file (`implementation-summary.md`, `/tmp/psurf-phase4/link-audit.sh`, `/tmp/psurf-phase4/advisor-db`) - branch `deepseekpi` - proof, run in the operator's checkout: `git status --porcelain` prints nothing, `git status --porcelain --ignored .skilled/skills/local-webflow .skilled/skills/local-obsidian` prints exactly two lines each starting `!!`, one per `local-*` path, `git diff --cached --name-only` prints nothing, and `git check-ignore -v .skilled/skills/local-webflow .skilled/skills/local-obsidian` prints two lines naming `/.skilled/skills/local-*`
- [ ] T014 [P0] Reviewer round: dispatch a separate read-only DeepSeek session on branch `deepseekpi`, at most 2 rounds, with the checklist below; the reviewer runs the seven checks in the operator's main checkout, where the private trees live, and reads this child's documents from the authoring worktree; the reviewer edits nothing (`.skilled/skills/local-webflow/`, `.skilled/skills/local-obsidian/`, `implementation-summary.md`) - branch `deepseekpi` - proof: the reviewer's report states, with the command output for each: (1) `git status --porcelain .skilled` prints nothing, (2) `git diff --cached --name-only | grep -c local-` prints `0`, (3) `find .skilled/skills/local-webflow/ .skilled/skills/local-obsidian/ -type l | wc -l` prints `0`, (4) both link audits end at the expected `AUDIT_FAIL`, (5) each `SKILL.md` has exactly one `name: local-*` line and no `packetKind`, (6) each `graph-metadata.json` parses and its `skill_id` equals its folder name, (7) `grep -rn "013-private-surface-skills\|004-private-local-skills" .skilled/skills/local-webflow .skilled/skills/local-obsidian` prints nothing
- [ ] T015 [P0] In the authoring worktree, run the packet's authoritative gate from the final state, after T014's findings are repaired and before anything is committed; fix only what the validator names, and never edit the validator (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`) - branch `deepseekpi` - proof: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/004-private-local-skills --strict` prints `RESULT: PASSED`
- [ ] T016 [P1] In the authoring worktree, commit this child's documents only, by name, with a prose commit body, then push `HEAD:main`; the private trees stay in the operator's main checkout and no path under `.skilled/skills/local-*` is staged (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`) - branch `deepseekpihigh` - proof: `git show --name-only --format= HEAD` lists only the five documents, `git status --porcelain` prints nothing after the commit, and `git rev-parse HEAD` equals `git rev-parse origin/main` after `git fetch origin main`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks - the two `graph-metadata.json` files parse as JSON and pass the advisor's field validation, proven by T011
- [ ] CHK-011 [P0] No console errors or warnings - the generator `--write` run, the confirming dry run and the advisor scan all exit 0
- [ ] CHK-012 [P1] Error handling implemented - `plan.md` Step 9 names the exit-75 fallback for the advisor scan
- [ ] CHK-013 [P1] Code follows project patterns - the metadata shape follows `.skilled/skills/sk-git/graph-metadata.json`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete - T012's advisor scan and both link audits
- [ ] CHK-022 [P1] Edge cases tested - the symlink mode and the pre-existing broken link are both covered
- [ ] CHK-023 [P1] Error scenarios validated - a failed ignore precondition stops the phase at T001
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented - no path under `.skilled/skills/local-*` is staged, proven by T013 and T014
- [ ] CHK-032 [P1] Auth/authz working correctly - not applicable; no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate - no spec path, packet number or phase number in any comment, proven by T014 item 7
- [ ] CHK-042 [P2] README updated (if applicable) - both skill READMEs are rewritten by T009 and T010
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files outside the repository tree - `/tmp/psurf-phase4` holds the link audit and the throwaway database, and neither checkout gains an untracked path, proven by T013's `git status --porcelain`
- [ ] CHK-051 [P1] `/tmp/psurf-phase4` removed before completion - T013 deletes it
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | [ ]/12 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-10-23
<!-- /ANCHOR:summary -->

---
