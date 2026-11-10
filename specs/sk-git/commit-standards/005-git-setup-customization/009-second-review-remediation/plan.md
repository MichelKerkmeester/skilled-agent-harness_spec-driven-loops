---
title: "Implementation Plan: Phase 9: second-review-remediation"
description: "Fix each finding of the second v4.0.0.11 review in the setup battery, its tests and its docs, one external-model dispatch per change, each checked by a diff, the suite and a mutation check."
trigger_phrases:
  - "second review remediation plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: second-review-remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (the battery), Markdown and YAML (commands and docs) |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node:test` through `.skilled/commands/doctor/scripts/tests/run-all.sh` |

### Overview
Each finding in `../scratch/review-v4.0.0.11.md` was checked against the code first (section 8 below). Every one holds. The fixes extend `git-setup-check.cjs` in place, add one fixture test per code fix and correct the docs that state the same claims. Luna (cli-codex) takes the logic changes and DeepSeek (cli-pi) the mechanical ones, one dispatch at a time.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One read-only script with a fixed list of check functions. Each returns a verdict, and `main()` folds the verdicts into a status and exit code.

### Key Components
- **`checkHooks`, `checkTrust`**: compare the installed hook links with the hook sources, and mirror the trust block the hooks carry (P1-1, P1-5).
- **`checkAdvisoryRules`**: moves from the battery's own rule file to `<repo>/.skilled/skills/sk-git/hard-rules.json`, which `git-preflight-advisory.mjs:107` reads (P1-2).
- **`checkAiToolHooks`, `registersAdvisory`**: add a script-exists check, the `"*"` matcher and the Hermes adapter (P1-3, P2-3, P2-4, P2-6).
- **`checkSuppression`**: adds the advisory's own off switches as DEGRADED (P2-5).
- **`main()`**: applies the safe git environment to `process.env` once, prints a reason before usage and caps details only in the human render (P2-2, P2-9, P2-14).

### Data Flow
`main()` resolves the repository, runs the checks in order, then renders the human report or the JSON object and returns the exit code.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each code fix ships with a test in `git-setup-check.test.cjs` that builds its fixture under a fresh `mktemp -d` style folder and removes it afterwards. After each dispatch the orchestrator runs the battery test file, then puts the old code back and confirms the new test fails (the mutation check), then restores the fix. The whole runner is rerun at the end and compared with the baseline of 334 node tests.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Why |
|------------|-----|
| `install-git-hooks.sh` `is_git_hook_name` | The hook-name set the battery must match (P1-5) |
| The hook trust block in every lifecycle hook | What the trust row must mirror (P1-1) |
| `git-preflight-advisory.mjs` and `hook-flags.cjs` | Which rule file and which switches decide whether the advisory runs (P1-2, P2-5) |
| `.hermes/plugins/repo-guards/__init__.py` | The Hermes wiring the battery reads (P2-3) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every target is backed up to the scratchpad before its dispatch. Nothing is committed in this phase, so `git diff` on the named files shows the whole change, and the backups restore any single file.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:finding-check -->
## 8. FINDING CHECK

Every finding was re-read against the code before planning. Each row names the line that confirms it.

| Finding | Verdict | Evidence |
|---------|---------|----------|
| P1-1 trust | Confirmed | `checkTrust` returns SKIP unless the common dirs match or trust is set (`git-setup-check.cjs:403-407`), while every hook's trust block compares the common dir of the hook script's own resolved path with the repository's (`scripts/git-hooks/pre-commit:38-49`). A hook linked into the clone's own tree trusts itself |
| P1-2 advisory-rules | Confirmed | The row reads `OWN_ROOT/skills/sk-git/hard-rules.json` (`:709`). The advisory reads `<projectDir>/.skilled/skills/sk-git/hard-rules.json` (`git-preflight-advisory.mjs:107`) |
| P1-3 ai-tool-hooks | Confirmed | A command counts when it contains `git-preflight-advisory` (`:866`). No path is resolved |
| P1-4 quoting | Confirmed | Paths are interpolated bare at `:305`, `:337-338` and `:459` |
| P1-5 stray file | Confirmed | Every non-README file is expected (`:344-347`). The installer links only `is_git_hook_name` names (`install-git-hooks.sh:57-71`, `:131`) |
| P2-1 allowlist exits | Confirmed | An exit outside 0 and 1 becomes a `refused` detail on a PASS row (`:519-524`, `:537-538`) |
| P2-2 GIT_DIR | Confirmed | `safeGitEnv` is passed to children only (`:180`). The contract module runs `execFileSync('git', ...)` with the inherited `process.env` (`message-contract.mjs:261-267`) |
| P2-3 Hermes | Confirmed | `TOOLS` has six names (`:52`). `repo-guards` runs the advisory through `GIT_PREFLIGHT_ADVISORY` (`__init__.py:41`, `:294-300`) and registers `transform_tool_result` (`:1016`) |
| P2-4 `*` matcher | Confirmed | `new RegExp('^(?:*)$')` throws and the catch returns false (`:871-875`) |
| P2-5 muted advisory | Confirmed | Only the three master switches fail (`:106`, `:809-821`). The advisory exits on `SK_GIT_PREFLIGHT_DISABLED` or `MK_GIT_PREFLIGHT_DISABLED` (`hook-flags.cjs:39`, `:74`) and on `SKGIT_ADVISORY=0|false|off` (`git-preflight-advisory.mjs:64`) |
| P2-6 parse bytes | Confirmed | `err.message` from `JSON.parse` goes into the detail (`:938-940`) |
| P2-7 restore | Confirmed | Only `rev-parse --show-toplevel` is checked before printing a HEAD restore (`:298-305`) |
| P2-8 dangling base | Confirmed | `nearestExistingDir` walks with `existsSync`, which follows links (`:586-594`) |
| P2-9 JSON cap | Confirmed | `limitDetails` runs in `runCheck`, before both renderers (`:993`) |
| P2-10 hardcoded root | Confirmed | `RULES_REPAIR` and `COMMIT_ID_REPAIR` spell `.skilled/` (`:73`, `:78`) |
| P2-11 gate drift | Confirmed | The gate sits inside section 1 in `deep/research.md:38`, `deep/review.md:21`, `deep/ai-council.md:20` and `prompt/improve.md:17`. The 008 limitation still says `doctor/git.md` keeps its gate before the H1, while `git.md:8-12` puts it after |
| P2-12 YAML wording | Confirmed | `doctor-git-setup.yaml:49` and `:60`, `doctor-git-presentation.txt:245-247` and `:256` |
| P2-13 tests | Confirmed | The gaps the review lists have no test, and the fsmonitor marker comment admits no query reaches it (`test.cjs:356-359`) |
| P2-14 refinements | Confirmed | `GIT_FLAGS` (`:210`), the PATH comment twice (`:146-150`, `:168-172`), one bare usage line for two causes (`:1084-1097`), invalid JSON reported as "not a JSON array" (`:717`) |
<!-- /ANCHOR:finding-check -->
