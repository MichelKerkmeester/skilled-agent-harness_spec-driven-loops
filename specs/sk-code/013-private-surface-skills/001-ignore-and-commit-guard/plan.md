---
title: "Implementation Plan: Phase 1: ignore-and-commit-guard"
description: "Add the two root local-* ignore rules, insert one blocking private-skill guard into the pre-commit hook just before the comment-hygiene gate, and prove both with harness cases and a throwaway-repository probe. Every construct is chosen for the bash 3.2 that runs the hook."
trigger_phrases:
  - "ignore and commit guard plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: ignore-and-commit-guard

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (`/bin/bash` 3.2 on macOS, the shell that runs the hook), git plumbing, POSIX file rules |
| **Framework** | None; the repository's own pre-commit hook and its shell test harness |
| **Storage** | The git index (`git diff --cached`), the root `.gitignore`, `lib/gates.tsv` for gate registration |
| **Testing** | `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`, a self-contained shell harness that builds throwaway repositories |

### Overview
Two edits close the publish path and one test file proves them. The ignore rules make a `local-*` skill directory invisible to `git add`; the guard makes `git add -f` useless by refusing the staged path inside the hook. The harness gains four cases so the guard's block, its printed repair, its coverage of all six skill roots and its false-positive boundary stay true after the next edit to the hook.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Every anchor named below re-read at the current commit; the line numbers in this plan match the file
- [ ] `git check-ignore -v .skilled/skills/local-webflow/SKILL.md` exits 1 before the change, which is the failing baseline
- [ ] The installed hook's resolution is known (`bash .skilled/scripts/install-git-hooks.sh --status`)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` exits 0 with `0 failed`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks/acceptance criteria)
- [ ] The phase ships as one commit pushed as `HEAD:main` (T017)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered gate: the ignore rules are the default, the hook is the enforcement point, the harness is the proof. Each layer fails closed and each is independently observable.

### Key Components
- **Root `.gitignore` rules**: git's own ignore layer. Matches the `local-*` directory name itself, so everything under it is ignored, including a symlink (which git treats as a file, which is why no rule carries a trailing slash).
- **Private-skill guard in `pre-commit`**: a pure-bash block that reads staged names from the index and exits non-zero on a match. It sits after the trust block and the shared kill switch and before the comment-hygiene gate, so it inherits documented behavior and introduces no new configuration.
- **`lib/gates.tsv`**: the registry the hook reads through `gate-config.sh` to decide which gates may be switched off. The guard is deliberately absent from it, so no git config key and no `SPECKIT_SKIP_*` variable can disable it.
- **`tests/pre-commit.test.sh`**: builds throwaway repositories with `core.hooksPath /dev/null` and runs the real hook file against them, so a case covers the block as written rather than a copy.

### Data Flow
`git add` consults `.gitignore` and skips the private path. `git add -f` bypasses that, so the path reaches the index. `git commit` runs the hook, which reads `git diff --cached --name-only -z --diff-filter=ACMR`, matches each name against the anchored pattern, prints the offending paths plus `git rm --cached -r <path>`, and exits 1. The operator runs the printed command, the index no longer carries the path, and the next commit proceeds.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.gitignore` (root) | Policy: the only ignore layer the commit path consults | update - two rules | `git check-ignore -v .skilled/skills/local-webflow/SKILL.md .hermes/skills/local-obsidian` |
| `.skilled/scripts/git-hooks/pre-commit` | Producer: the live blocking gate | update - one block before the comment-hygiene gate | `bash -n` plus the harness |
| `.opencode/scripts/git-hooks/pre-commit` | Symlink to `../.skilled/scripts`, verified with `readlink` | unchanged - resolves to the edited file | `readlink .opencode/scripts` |
| `.skilled/scripts/git-hooks/lib/gates.tsv` | Gate registry read by `gate-config.sh` | unchanged - deliberate: no row means no bypass | `grep -c private .skilled/scripts/git-hooks/lib/gates.tsv` is 0 |
| `.skilled/scripts/git-hooks/lib/gate-config.sh` | Consumer of `gates.tsv` | not a consumer of the guard | `grep -n gates.tsv .skilled/scripts/git-hooks/lib/gate-config.sh` |
| `.skilled/scripts/install-git-hooks.sh` | Installs hooks as symlinks (`ln -sf`), so an edit is live once installed | unchanged | `bash .skilled/scripts/install-git-hooks.sh --status` |
| `.opencode/hooks/git/pre-commit` | Legacy compatibility helper with two gates of its own | unchanged - the live hook is the enforcement point, and the helper's scope is the mirror and comment gates | `grep -c 'private-skill' .opencode/hooks/git/pre-commit` is 0 |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Consumer: runs the real hook against throwaway repositories | update - header line plus four cases | harness exit 0 with `0 failed` |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` `gitIgnoredPaths` | Consumer of committed `.gitignore` files; keeps `local-*` out of the tracked trigger index | unchanged - it reads the file this phase edits | `grep -n gitIgnoredPaths` and the 005 zero-hit check |

Required inventories:
- Same-class producers: `rg -n 'local-' .gitignore .skilled/scripts/git-hooks/` - after the change, the two rules and the guard are the only hits, so no second ignore layer needs the pattern.
- Consumers of changed symbols: `rg -n 'gate:private-skill|PRIVATE_SKILL_RE|PRIVATE_STAGED' .` - the hook and the harness only.
- Matrix axes: skill root (six: `.skilled`, `.opencode`, `.claude`, `.pi`, `.devin`, `.hermes`) x path shape (top-level skill dir, file nested inside it, `local-` name below the skill root) x index action (add, modify, rename, delete).
- Algorithm invariant: a path is refused if and only if its first segment is a skill root and the directory immediately below `skills/` starts with `local-`. Adversarial cases: path with a space, non-ASCII bytes, staged deletion (must pass), rename into the private path (must block), `local-` deeper than the skill root (must pass).
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The step order below is the order the proofs depend on; each step names the file, the anchor and the command that proves it.

### Step 0 - Re-read the anchors (read-only)

Files: `.skilled/scripts/git-hooks/pre-commit`, `.gitignore`, `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`.

Anchors, all verified at `42b41dd286`:

- `.skilled/scripts/git-hooks/pre-commit` line 96 is exactly `# --- Comment hygiene gate (blocking) ---`.
- `.gitignore` has no line anchor in the fact set; read the file and locate the section header `# Runtime state leaked into nested trees`.
- `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` has no line anchor in the fact set; read the file and locate the final summary line `echo "pre-commit gates: $PASS passed, $FAIL failed"` and the harness header comment that begins `# Test harness for the pre-commit hook's two auto re-mint gates`.

Proof: `awk 'NR==96' .skilled/scripts/git-hooks/pre-commit` prints the comment-hygiene line; `grep -c '# Runtime state leaked into nested trees' .gitignore` prints `1`; `grep -c 'pre-commit gates: \$PASS passed' .skilled/scripts/git-hooks/tests/pre-commit.test.sh` prints `1`. Stop and report if any of the three differs.

### Step 1 - Add the two ignore rules

File: `.gitignore`. Insert a new commented section immediately before the section header `# Runtime state leaked into nested trees`:

```
# ───────────────────────────────────────────
# Private skills (operator-local only)
# ───────────────────────────────────────────
# A local-* skill belongs to the operator, not to this repository. No trailing
# slash: git treats a symlink as a file, so `local-*/` would miss a symlink to a
# private repo. The runtime skill dirs link to .skilled/skills, so they need no
# rule of their own; .hermes/skills is a real directory and does.
/.skilled/skills/local-*
/.hermes/skills/local-*
```

Proof: `git check-ignore -v .skilled/skills/local-webflow/SKILL.md .hermes/skills/local-obsidian` prints two lines, each naming `.gitignore` and its rule, and exits 0. Before this step the same command exits 1.

### Step 2 - Insert the guard into the hook

File: `.skilled/scripts/git-hooks/pre-commit`. Insert the block below immediately before the line `# --- Comment hygiene gate (blocking) ---`, with one blank line between the block and that line, so the guard runs first:

```bash
# --- Private skill guard (blocking) ---
# A private skill is the operator's, not the repository's: staging one publishes a
# file that exists only on this machine. Names are read NUL-separated, so a path
# with a space or non-ASCII bytes is refused rather than skipped, and
# --diff-filter=ACMR ignores a staged deletion, which publishes nothing. There is no
# bypass variable and no gate-config row: staging a private skill is never correct.
PRIVATE_SKILL_RE='^\.(skilled|opencode|claude|pi|devin|hermes)/skills/local-[^/]+(/|$)'
PRIVATE_STAGED=()
while IFS= read -r -d '' PRIVATE_PATH; do
  if [[ "$PRIVATE_PATH" =~ $PRIVATE_SKILL_RE ]]; then
    PRIVATE_STAGED+=("$PRIVATE_PATH")
  fi
done < <(git diff --cached --name-only -z --diff-filter=ACMR)
if [[ "${#PRIVATE_STAGED[@]}" -gt 0 ]]; then
  echo "BLOCKED [gate:private-skill]: a private skill is staged and would be published:" >&2
  for PRIVATE_PATH in "${PRIVATE_STAGED[@]}"; do
    echo "  $PRIVATE_PATH" >&2
    echo "  Fix: git rm --cached -r -- \"$PRIVATE_PATH\"" >&2
  done
  exit 1
fi
```

Constraints, all load-bearing:

- The pattern variable is used unquoted after `=~`; quoting it would turn the regex into a literal string.
- `${#PRIVATE_STAGED[@]}` on an empty array is safe under `set -u` on bash 3.2; verified on the shell that runs this hook.
- `--diff-filter=ACMR` excludes `D`, so the repair the guard prints does not itself block.
- No `SPECKIT_SKIP_*` read and no `lib/gates.tsv` row. Do not add either.

Proof: `bash -n .skilled/scripts/git-hooks/pre-commit` exits 0, and `awk '/Comment hygiene gate \(blocking\)/{print last; exit} NF{last=$0}' .skilled/scripts/git-hooks/pre-commit` prints `fi`, which is the guard's closing line. The proof reads the last non-blank line before the comment, because the required blank line sits between the two.

### Step 3 - Describe the new coverage in the harness header

File: `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`. Extend the header sentence that begins `# Test harness for the pre-commit hook's two auto re-mint gates` so it also names the private-skill guard. Read the file and locate that sentence; keep the surrounding lines unchanged.

Proof: `grep -c 'private-skill' .skilled/scripts/git-hooks/tests/pre-commit.test.sh` prints at least `1`.

### Step 4 - Case 74: a staged private skill is refused

File: `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`. Read the file and locate the final summary line `echo "pre-commit gates: $PASS passed, $FAIL failed"`; insert the case above it, after the last existing block, which is `# ── 67-73. doc-version bump`, numbered 74 in the file's `# ── N.` style:

```bash
# ── 74. a staged private skill is refused and the refusal names its repair ──
setup_gate_fixture
stage_new ".skilled/skills/local-webflow/SKILL.md" "private"
run_hook; RC=$?
check "a staged private skill is refused" 1 "$RC" "BLOCKED \[gate:private-skill\]"
check "the refusal names the staged path" 1 "$RC" ".skilled/skills/local-webflow/SKILL.md"
check "the refusal names the repair" 1 "$RC" "git rm --cached -r"
```

Proof: the full harness run in Step 8 prints `PASS  a staged private skill is refused`.

### Step 5 - Case 75: the printed repair clears the block

File: `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`, same insertion point, numbered 75:

```bash
# ── 75. the printed repair leaves a committable index ──
setup_gate_fixture
stage_new ".skilled/skills/local-webflow/SKILL.md" "private"
git -C "$TMP" rm --cached -r -q -- ".skilled/skills/local-webflow/SKILL.md"
run_hook; RC=$?
check "the printed repair clears the block" 0 "$RC"
```

Proof: the harness prints `PASS  the printed repair clears the block`.

### Step 6 - Case 76: every skill root is covered, including a nested file

File: `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`, same insertion point, numbered 76. Stage one private path under each of the six roots plus one file nested inside a private skill, then assert the log names every one:

```bash
# ── 76. every skill root and a nested private file are refused ──
setup_gate_fixture
for ROOT in .skilled .opencode .claude .pi .devin .hermes; do
  stage_new "$ROOT/skills/local-probe/SKILL.md" "private"
done
stage_new ".skilled/skills/local-probe/references/deep.md" "private"
run_hook; RC=$?
check "a private skill under every skill root is refused" 1 "$RC" "gate:private-skill"
for ROOT in .skilled .opencode .claude .pi .devin .hermes; do
  if grep -qF "$ROOT/skills/local-probe/SKILL.md" "$TMP/out.log"; then
    echo "PASS  the refusal names $ROOT"; PASS=$((PASS + 1))
  else echo "FAIL  the refusal never named $ROOT"; FAIL=$((FAIL + 1)); fi
done
if grep -qF '.skilled/skills/local-probe/references/deep.md' "$TMP/out.log"; then
  echo "PASS  the refusal names a file nested in a private skill"; PASS=$((PASS + 1))
else echo "FAIL  a nested private file was not refused"; FAIL=$((FAIL + 1)); fi
```

Proof: the harness prints one `PASS` per root plus `PASS  the refusal names a file nested in a private skill`.

### Step 7 - Case 77: a `local-` name below the skill root does not block

File: `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`, same insertion point, numbered 77:

```bash
# ── 77. a local- name below the skill root is an ordinary file ──
setup_gate_fixture
stage_new ".skilled/skills/sk-code/local-notes.md" "an ordinary file"
run_hook; RC=$?
check "a local- file below the skill root is committable" 0 "$RC"
grep -q 'gate:private-skill' "$TMP/out.log" && { echo "FAIL  the guard spoke on an ordinary file"; FAIL=$((FAIL + 1)); }
```

Proof: the harness prints `PASS  a local- file below the skill root is committable`.

### Step 8 - Run the whole harness

Proof: `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` exits 0 and its last line reads `pre-commit gates: <N> passed, 0 failed`, where `<N>` is larger than the count before this phase. A single `FAIL` line is a stop condition.

### Step 9 - Prove the guard outside the harness

Build a throwaway repository, stage a private path and run the real hook against it:

```bash
HOOK="$PWD/.skilled/scripts/git-hooks/pre-commit"
PROBE="$(mktemp -d)"; git -C "$PROBE" init -q
git -C "$PROBE" config user.email t@example.com; git -C "$PROBE" config user.name t
mkdir -p "$PROBE/.skilled/skills/local-probe"; echo private > "$PROBE/.skilled/skills/local-probe/SKILL.md"
git -C "$PROBE" add .skilled/skills/local-probe/SKILL.md
( cd "$PROBE" && bash "$HOOK" ); echo "rc=$?"
rm -rf "$PROBE"
```

`HOOK` is captured before the `cd`, so the probe runs this checkout's hook rather than a path inside the throwaway repository.

Proof: `rc=1` and the output contains `BLOCKED [gate:private-skill]` and the staged path. Before the guard exists the same probe prints `rc=0`, which is the failing baseline.

### Step 10 - Prove the ignore rules against a symlink

```bash
rm -f .skilled/skills/local-probe
ln -s "$PWD" .skilled/skills/local-probe
git check-ignore -v .skilled/skills/local-probe
rm .skilled/skills/local-probe
git status --porcelain | grep -c local-probe
```

Proof: the `check-ignore` line names `/.skilled/skills/local-*`, and the final `grep -c` prints `0`, so the probe left nothing behind. The slash-less pattern is the load-bearing part: written with a trailing slash it matches a real directory but not a symlink, which is why REQ-001 forbids the slash.

### Step 11 - Confirm the scope and the comment hygiene

Proof: `git diff --name-only 42b41dd286` lists only `.gitignore`, `.skilled/scripts/git-hooks/pre-commit`, `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` and this packet's documents; `git diff 42b41dd286 -- .gitignore .skilled/scripts/git-hooks/ | grep '^+' | grep -c -E 'specs/|phase [0-9]|013-private'` prints `0`.

### Step 12 - Review round

A separate read-only DeepSeek session reads the diff and the four documents, at most two rounds. Findings are recorded, repaired where they are in scope, and re-reviewed once. A finding that would widen the scope is recorded and left to the phase that owns it.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The guard's pattern against the path matrix: six roots, nested file, `local-` below the root, staged deletion | `tests/pre-commit.test.sh` cases 74-77 |
| Integration | The real hook file run against a throwaway repository, including the trust block and the kill switch it inherits | `tests/pre-commit.test.sh` fixtures, plus the Step 9 probe |
| Manual | The ignore rules against a real directory and a real symlink, then a clean `git status` | `git check-ignore -v`, `git status --porcelain` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `git diff --cached --name-only -z` support | External (git) | Green | The guard cannot read staged names; the phase stops rather than guessing a second read path |
| bash 3.2 semantics for empty arrays under `set -u` | Internal (runtime shell) | Green - verified on the shell that runs the hook | A bash 4-only idiom would break every commit; the plan pins the verified form |
| `.opencode/scripts` symlink to `../.skilled/scripts` | Internal | Green - verified with `readlink` | The harness would run a copy instead of the edited file, so a passing run would prove nothing |
| `lib/gates.tsv` unchanged | Internal (this phase) | Green | A row would create a bypass, contradicting REQ-003 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the guard blocks a path that is not a private skill, or the harness fails after a repair attempt, or a review round finds the guard cannot be made correct within this phase's scope.
- **Procedure**: the phase ships as one commit on `deepseekpi`, pushed as `HEAD:main`. Revert that commit with `git revert --no-edit <phase-commit-sha>`; the three files return to their `42b41dd286` content. Per file, without a commit: `git checkout 42b41dd286 -- .gitignore .skilled/scripts/git-hooks/pre-commit .skilled/scripts/git-hooks/tests/pre-commit.test.sh`.
- **Verify the rollback**: `git check-ignore -v .skilled/skills/local-webflow` exits 1 again, `grep -c 'gate:private-skill' .skilled/scripts/git-hooks/pre-commit` prints `0`, and `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` still passes, because the revert removes only the new cases.
- **Do not** delete anything under `.skilled/skills/local-*` or `.hermes/skills/local-*` as part of a phase 1 rollback. This phase creates no such path, and by the time it is reverted a later phase may own real private content there. Check first: `git status --porcelain --ignored | grep -c 'local-'` printing `0` means there is nothing to protect.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (ignore rules + guard) ──► Phase 2 (hub removal) ──► Phase 3 (advisor vocabulary)
                                          │                            │
                                          └──────────────► Phase 4 (private skills) ──► Phase 5 (verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 001-ignore-and-commit-guard | None | 002, 003, 004, 005 |
| 002-hub-surface-removal | 001 | 003 |
| 003-advisor-vocabulary-cleanup | 002 | 004 |
| 004-private-local-skills | 001 (ignore rules) and 003 (scan follows a symlink) | 005 |
| 005-leak-and-routing-verification | 004 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (re-read anchors, confirm the installed hook) | Low | 15 minutes |
| Core Implementation (two rules, one guard block, four cases) | Medium | 1-2 hours |
| Verification (harness, two probes, review round, validation) | Medium | 1-2 hours |
| **Total** | | **3-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (not applicable: no data changes; the base commit `42b41dd286` is the restore point)
- [ ] Feature flag configured (not applicable: the guard has no bypass by design)
- [ ] Monitoring alerts set (the harness and the two probes are the signal)

### Rollback Procedure
1. Identify the phase commit on `deepseekpi`: `git log --oneline -1 -- .skilled/scripts/git-hooks/pre-commit`.
2. Revert it: `git revert --no-edit <sha>`, or restore the three files from `42b41dd286` as in section 7.
3. Verify: `git check-ignore -v .skilled/skills/local-webflow` exits 1 and the harness passes.
4. Tell the next phase: 002 must not start until the ignore rules are back, because it removes the hub surfaces whose replacement lives at the ignored path.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. No private file exists yet, so a revert publishes nothing; the history limit (D7) is unchanged by a revert.
<!-- /ANCHOR:enhanced-rollback -->

---

