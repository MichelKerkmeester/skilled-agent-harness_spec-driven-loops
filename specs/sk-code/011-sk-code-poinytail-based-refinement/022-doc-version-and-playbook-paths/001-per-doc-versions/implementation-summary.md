---
title: "Implementation Summary: Per-doc versions"
description: "Every skill doc carries its own 4-part version again, the pre-commit hook raises it on a body change, a pull-request job checks the raise, and the 2,845 removed version lines are back."
trigger_phrases:
  - "per doc versions implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions"
    last_updated_at: "2026-10-12T07:51:58Z"
    last_updated_by: "builder"
    recent_action: "Built PV-R1 to PV-R8, ran the five-iteration deep review and fixed its findings"
    next_safe_action: "Merge the branch, then run frontmatter-version.mjs bump over the docs phase 002 changed"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs"
      - ".skilled/scripts/git-hooks/pre-commit"
      - ".skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-001-per-doc-versions"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The 21 hand-authored docs with no frontmatter gain frontmatter and a version (operator ruling, 2026-10-12)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Per-doc versions

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-per-doc-versions |
| **Completed** | 2026-10-12 |
| **Level** | 2 |
| **Branch** | `worktrees/119-docver-per-doc`, from the scaffold commit 41302e72be |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every hand-authored skill doc carries its own 4-part `version` again. `SKILL.md` keeps the skill edition. Every other doc in scope carries its own edition, which starts at `1.0.0.0` and goes up when its body changes.

- `frontmatter-version.mjs` scopes every doc with frontmatter except changelogs, tests, fixtures, runtime and benchmark output and the spec-doc examples. `verify` requires a valid version on each child doc. The new `bump` mode compares each staged doc's body, frontmatter excluded, with the base and raises the third segment (`1.2.3.4` becomes `1.2.4.0`).
- The pre-commit gate `[gate:doc-version-bump]` runs `bump`, re-stages what it raised and blocks on a partly staged doc or a pathspec-narrowed commit. Bypass: `SPECKIT_SKIP_DOC_VERSION_BUMP=1`, gates.tsv key `docVersionBump`.
- The `doc-version-raise` job in `skill-doc-frontmatter.yml` runs `bump --check` against the pull request's base.
- `package_skill.py` and `post-edit-router.cjs` apply the same scope rule as the engine.
- The 2,845 version lines removed in 31888d05bb are back with their prior values. 22 hand-authored docs gained frontmatter and `1.0.0.0`, and 68 other docs started at `1.0.0.0`.
- sk-doc is released as 2.3.7.0 with one changelog entry.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs` | Modified | Scope, verify, bump mode |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`, `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` | Modified | Scope mirrors |
| `.skilled/scripts/git-hooks/pre-commit`, `lib/gates.tsv`, `README.md`, `tests/pre-commit.test.sh` | Modified | Auto-bump gate and its bypass |
| `.github/workflows/skill-doc-frontmatter.yml` | Modified | Pull-request check |
| `frontmatter-versioning.md`, `frontmatter-templates.md`, three sk-create-readme templates, `init_skill.py` | Modified | Contract, bump rule, template seeding |
| 2,845 child docs, 22 docs given frontmatter, 68 docs started at 1.0.0.0, 7 sk-code playbook docs re-anchored | Modified | Restore and bring into contract |
| `.skilled/skills/sk-doc/SKILL.md`, `ROUTER.md`, three hub JSON files, `changelog/v2.3.7.0.md` | Modified, Created | sk-doc 2.3.7.0 |
| Tests under `sk-doc/scripts/tests/`, `.opencode/plugins/tests/`, `.skilled/commands/doctor/scripts/tests/` | Created, Modified | T1 to T7 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Code and bulk doc edits went through DeepSeek V4.1 Flash at max effort via cli-pi, one literal change per brief, and every diff was read before commit. The restore was one deterministic script (`git diff -U1 31888d05bb^ 31888d05bb`, insert after the prior neighbour line), committed on its own; a second run changes nothing and the md5 of the restored lines equals that of the removed ones.

### Ledger

| ID | Outcome | Proof |
|----|---------|-------|
| PV-R1 | Fixed | `git show --format= --name-only 31888d05bb \| while read f; do [ -f "$f" ] && ! grep -qE '^version: "?[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+"?$' "$f" && echo "$f"; done \| wc -l` printed 0 over the 2,845 files; restore commit a8d0dd7c2a, 2,845 insertions, md5 of restored lines equals the removed lines |
| PV-R2 | Fixed | `grep -n '^## 4. BUMP RULE\|SPECKIT_SKIP_DOC_VERSION_BUMP' .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` prints the bump-rule section and the enforcement row with the bypass; the scope table names every out-of-scope class |
| PV-R3 | Fixed | `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify` printed `[verify] 5624 files \| ok=3027  skip-no-frontmatter=2597`, exit 0; T3, T5, T6 and T7 cover the engine and both mirrors |
| PV-R4 | Fixed | `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` printed 111 passed, exit 0, including the doc-version cases (raise and re-stage, bypass, partial staging, pathspec commit); gates.tsv row `docVersionBump` with `SPECKIT_SKIP_DOC_VERSION_BUMP` |
| PV-R5 | Fixed | `grep -n 'bump --check' .github/workflows/skill-doc-frontmatter.yml` prints the `doc-version-raise` job line `frontmatter-version.mjs bump --check --base "origin/$BASE_REF"`; T2 proves the check fails on an unraised change and prints the fix command |
| PV-R6 | Fixed | `python3 -m pytest .skilled/skills/sk-doc/scripts/tests/test_template_version_seed.py` printed 3 passed: a scaffolded skill and hub pass the engine gate and every sk-doc template block seeds `version: 1.0.0.0` |
| PV-R7 | Fixed | `git grep -l '^version:' 41302e72be -- '.skilled/skills/**/*.md'` minus SKILL.md and changelogs, frontmatter lines only: 61 docs, all valid 4-part; 45 in scope and passing `verify`, 16 now out of scope (14 benchmark READMEs and reports, one sk-doc test fixture, one runtime README) and listed in `goal.md` |
| PV-R8 | Fixed | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` printed `13a-version: all routing artifacts carry the SKILL.md version 2.3.7.0` and `13b-version: ... matches the newest changelog entry`; one new entry `changelog/v2.3.7.0.md` (commit aa89063bca) |

### Tests

Each row ran from the repository root. "Before" is the scaffold commit's code (for T4, the scaffold sk-doc tree extracted to scratch).

| ID | Test | Before | After |
|----|------|--------|-------|
| T1 | `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` (hook auto-bump, bypass, partial staging, pathspec commit) | before: exit 1 | after: exit 0 |
| T2 | `node .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version-bump.mjs` cases 1 to 10 (bump and the pull-request `--check`) | before: exit 1 | after: exit 0 |
| T3 | `node .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs` (verify fails a child doc with no version) | before: exit 1 | after: exit 0 |
| T4 | `python3 -m pytest .skilled/skills/sk-doc/scripts/tests/test_template_version_seed.py` (template seeding) | before: exit 1 | after: exit 0 |
| T5 | `python3 -m pytest .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py -k child_doc_without_version` (packager scope) | before: exit 1 | after: exit 0 |
| T6 | `node --test .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs` (post-edit router scope) | before: exit 1 | after: exit 0 |
| T7 | `node .skilled/skills/sk-doc/scripts/tests/test-root-name-consumer-matrix.cjs` (catalog root classed as a versioned doc) | before: exit 1 | after: exit 0 |
| T8 | `node .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version-bump.mjs` cases 11 to 13 (empty key, line-break path, symlinked doc) | before: exit 1 | after: exit 0 |
| T9 | `node .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs` case 5b (leading zero, empty key) | before: exit 1 | after: exit 0 |

### Hook timing

On the restore commit's staged set, `bump --check` over 2,835 in-scope staged docs took 0.29 to 0.35 s. The worktree pre-commit with only the doc-version gate on took 0.50 to 0.76 s, against 0.15 s with it off.

### Deep review

`/deep:review :auto`, 5 iterations, cli-pi `deepseek-v4.1-flash` at max reasoning, stop policy `max-iterations`; artifacts and `review-report.md` under `review/`. Verdict at review time CONDITIONAL: P0 0, P1 1, P2 8. Each finding was reproduced with a command before its fix (`review-report.md` section 10).

| Finding | Severity | Disposition |
|---------|----------|-------------|
| R3-P1-001 packet record unwritten | P1 | Fixed: this file, `acceptance-criteria.md`, `tasks.md`, `goal.md` and `spec.md` |
| R1-P2-001 leading-zero version fails verify | P2 | Fixed in e293b7cc17, T9 |
| R1-P2-002 empty version key duplicated | P2 | Fixed in e293b7cc17, T8 and T9 |
| R1-P2-003 rewritten move raises nothing | P2 | Fixed in the standard (e293b7cc17): the rename-threshold behavior is stated |
| R2-P2-001 line-break path staged as fragments | P2 | Fixed in e293b7cc17, T8 |
| R2-P2-002 raise written through a symlink | P2 | Fixed in e293b7cc17, T8 |
| R2-P2-003 PR job runs the PR's own engine | P2 | Rejected: a safety net for a missed raise, not a guard against a hostile author; every CI check here runs the code under review, and an engine change is itself reviewed (prevent-overengineering) |
| R3-P2-001 D1 amendment unrecorded | P2 | Fixed: amendment and operator decision recorded in `goal.md` |
| R4-P2-001 scope copies claim to mirror | P2 | Fixed in e293b7cc17: the packager comment names its two deliberate differences |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bump rule: third segment up by one, fourth reset; a hand raise to any higher value is kept | Smallest rule that always moves the version and never fights a hand raise |
| Scope: frontmatter docs except changelog, scratch, tests, fixtures, runtime, benchmark output and `templates/examples/` | Those classes are generated, dated or spec-doc examples; a doc subtree (`references`, `assets`, `feature-catalog`, `manual-testing-playbook`) is always in |
| The 22 hand-authored docs with no frontmatter gained frontmatter and `1.0.0.0` | Operator ruling 2026-10-12, recorded in `goal.md` as an amendment to D1 |
| The two hub READMEs (sk-code, mcp-tooling) took their SKILL.md version in the restore commit | Parent-skill doctor 13c blocked the commit otherwise |
| Only sk-doc is bumped | The hook, the post-edit router and the workflow live outside any skill; every other skill change is the restore or a per-doc raise, which D6 excludes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `frontmatter-version.mjs verify` and `gate` | exit 0, `5624 files \| ok=3027  skip-no-frontmatter=2597` (baseline at the scaffold commit: 57 ok) |
| `package_skill.py --check --strict` on all 14 skills | each `Result: PASS`, exit 0 (baseline the same) |
| sk-doc `run-script-tests.sh` | `all sk-doc script tests passed`, exit 0 (baseline exit 1: `test_root_name_consumer_matrix.py` and `test_rename_tooling_fixture_harness.py` failing; the second failed once more mid-build and passed on the final run, so it reads as flaky rather than fixed) |
| `node --test .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs` | pass 43, fail 0 |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | `111 passed, 0 failed` (baseline 100) |
| `git-hook-gates.test.cjs` | pass 6, fail 0 |
| `sync-skills-hermes.cjs --check` | `PASS: 68 Hermes skill copies in sync` |
| `compiled-route-sync.cjs --check`, `compiled-route-guard.cjs` | `all 55 served copies match`; `All hubs fresh or excused` |
| `parent-skill-check.cjs sk-doc` | all hard invariants pass; 13c README warning predates this phase |
| `generate-trigger-index.mjs --check` | regenerated after the packet docs, then fresh |
| `validate.sh --strict` and `check-goal.cjs` | `RESULT: PASSED` (Errors 0, Warnings 0) after `repair-derived.cjs --apply`; `[check-goal] RESULT: PASSED (5/5 checks)` |
| Goal completion criteria 1 to 5 | 8 rows; 0 and 0; ok; verify exit 0 with 0 files missing a version; ok |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The installed hook runs main's copy.** `~/.config/git/hooks/pre-commit` links to the main checkout, so the new gate only runs once this branch merges. Until then a doc commit runs `frontmatter-version.mjs bump` by hand.
2. **Phase 002 docs need one bump after the merge.** The integrator runs `frontmatter-version.mjs bump` over the docs phase 002 changed.
3. **The pull-request job runs the pull request's own engine** (R2-P2-003, rejected with reason).
4. **A rewritten move keeps its version.** git reads it as a new doc; the standard says to raise it by hand.
5. **sk-doc README stays at 2.3.4.0.** Parent-skill doctor warns (13c, a warning, not a failure) as it did before this phase; the README carries its own edition.
<!-- /ANCHOR:limitations -->
