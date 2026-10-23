---
title: "Tasks: Phase 1: ignore-and-commit-guard"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "ignore and commit guard tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: ignore-and-commit-guard

<!-- SPECKIT_LEVEL: 3 -->

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

Every task carries seven fields in this order: **File**, **Anchor**, **Change**,
**Proof**, **AC**, **Rollback**, **Stop if**. The anchor quotes text that exists in
the file at the time the task runs; a writer that cannot find it re-reads the file
once and stops if it is still missing. Line numbers were checked against the files
on disk when this plan was written, and the anchor text is what decides, not the
number: earlier tasks move later line numbers. Work runs in an OpenCode 2 session
with a DeepSeek orchestrator, and reviews run through the `subagent` tool with agent
`review`, read-only by instruction; no dispatch kit or executor branch name is used.

Every fenced block below is indented four spaces so it nests under its bullet. The
text inside the fence is flush-left in the target file: strip the four-space list
indent before pasting, and never paste the indent into `.gitignore`, the hook or the
harness.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the phase base commit (none)
  - **File:** `none`; writes `specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt`
  - **Anchor:** `new file`
  - **Change:**
    ```bash
    git rev-parse HEAD > specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt
    ```
  - **Proof:**
    ```bash
    wc -l < specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt
    git cat-file -t "$(cat specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt)"
    ```
    Expected: `1` then `commit`.
  - **AC:** AC-013
  - **Rollback:** `rm specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt`
  - **Stop if:** the second command prints anything other than `commit`, because every later scope proof reads this file.

- [ ] T002 Re-read the pre-commit insertion anchor (read-only)
  - **File:** `.skilled/scripts/git-hooks/pre-commit`
  - **Anchor:** line 96, exactly `# --- Comment hygiene gate (blocking) ---`
  - **Change:** none. This task only reads the anchor and reports it.
  - **Proof:**
    ```bash
    awk 'NR==96' .skilled/scripts/git-hooks/pre-commit
    grep -c '^# --- Comment hygiene gate (blocking) ---$' .skilled/scripts/git-hooks/pre-commit
    ```
    Expected: the first command prints `# --- Comment hygiene gate (blocking) ---`; the second prints `1`.
  - **AC:** AC-007
  - **Rollback:** `n/a: read-only, nothing to undo`
  - **Stop if:** line 96 is not that exact text, or the count is not `1`.

- [ ] T003 Re-read the ignore-file insertion anchor (read-only)
  - **File:** `.gitignore`
  - **Anchor:** lines 227 to 229, the divider, the header `# Runtime state leaked into nested trees`, and the divider
  - **Change:** none. This task only reads the anchor and reports it.
  - **Proof:**
    ```bash
    awk 'NR>=227 && NR<=229' .gitignore
    grep -c '^# Runtime state leaked into nested trees$' .gitignore
    ```
    Expected: three lines, a divider line of `# ` followed by 43 `─` characters, then `# Runtime state leaked into nested trees`, then the same divider; and the second command prints `1`.
  - **AC:** AC-001
  - **Rollback:** `n/a: read-only, nothing to undo`
  - **Stop if:** the header is not on line 228 or its divider pair does not bracket it.

- [ ] T004 Re-read the harness anchors (read-only)
  - **File:** `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Anchor:** line 2 `# Test harness for the pre-commit hook's two auto re-mint gates, compiled routing`; line 929 `# ── 67-73. doc-version bump: a staged skill doc whose body changed gets its version raised ──`; line 999 `echo "pre-commit gates: $PASS passed, $FAIL failed"`
  - **Change:** none. This task only reads the anchors and reports them.
  - **Proof:**
    ```bash
    awk 'NR==2' .skilled/scripts/git-hooks/tests/pre-commit.test.sh
    awk 'NR==929' .skilled/scripts/git-hooks/tests/pre-commit.test.sh
    awk 'NR==999' .skilled/scripts/git-hooks/tests/pre-commit.test.sh
    ```
    Expected: the three quoted lines, in that order, each printed exactly once.
  - **AC:** AC-012
  - **Rollback:** `n/a: read-only, nothing to undo`
  - **Stop if:** any of the three lines differs, because the case blocks and the header edit both attach to them.

- [ ] T005 Record how the installed hook resolves in this worktree (read-only)
  - **File:** `.skilled/scripts/install-git-hooks.sh` (invoked, not edited)
  - **Anchor:** `n/a: status call`
  - **Change:** none. This task only runs the status command and records the result.
  - **Proof:**
    ```bash
    bash .skilled/scripts/install-git-hooks.sh --status | rg -A3 '^  pre-commit$'
    bash .skilled/scripts/install-git-hooks.sh --status | rg -c 'SHADOWED: the installed hook resolves outside this checkout'
    ```
    Expected: a block starting `  pre-commit` whose `installed:` line names a path outside this worktree and whose fourth line begins `SHADOWED:`, then a count of `7`.
  - **AC:** AC-012
  - **Rollback:** `n/a: read-only, nothing to undo`
  - **Stop if:** the `pre-commit` block is absent. A shadowed hook is expected here and is not a stop: the harness and T017 are the proofs that do not depend on the installed copy.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Add the four private-skill ignore rules (.gitignore)
  - **File:** `.gitignore`
  - **Anchor:** lines 227 to 229, the divider, `# Runtime state leaked into nested trees`, and the divider
  - **Change:** replace those three lines with:
    ```gitignore
    # ───────────────────────────────────────────
    # Private skills (operator-local only)
    # ───────────────────────────────────────────
    # A local-* skill belongs to the operator, not to this repository. No trailing
    # slash: git treats a symlink as a file, so a trailing slash would miss a symlink
    # to a repository outside this checkout. The runtime roots that link to .skilled/skills need no rule
    # of their own, because git cannot stage a path beneath a symlink. .hermes/skills,
    # .codex/skills and .cursor/skills are real directories when they exist, so each
    # carries its own rule.
    /.skilled/skills/local-*
    /.hermes/skills/local-*
    /.codex/skills/local-*
    /.cursor/skills/local-*

    # ───────────────────────────────────────────
    # Runtime state leaked into nested trees
    # ───────────────────────────────────────────
    ```
  - **Proof:**
    ```bash
    rg -c '^/\.(skilled|hermes|codex|cursor)/skills/local-\*$' .gitignore
    git check-ignore -v .skilled/skills/local-webflow/SKILL.md .hermes/skills/local-obsidian .codex/skills/local-probe .cursor/skills/local-probe | sed 's/^[^:]*:[0-9]*://'
    ```
    Expected: `4`, then four lines:
    ```
    /.skilled/skills/local-*	.skilled/skills/local-webflow/SKILL.md
    /.hermes/skills/local-*	.hermes/skills/local-obsidian
    /.codex/skills/local-*	.codex/skills/local-probe
    /.cursor/skills/local-*	.cursor/skills/local-probe
    ```
  - **AC:** AC-001, AC-002
  - **Rollback:** `git checkout "$(cat specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt)" -- .gitignore`
  - **Stop if:** the count is not `4` or any of the four `check-ignore` lines is missing.

- [ ] T007 Insert the blocking private-skill guard (.skilled/scripts/git-hooks/pre-commit)
  - **File:** `.skilled/scripts/git-hooks/pre-commit`
  - **Anchor:** line 96, exactly `# --- Comment hygiene gate (blocking) ---`
  - **Change:** replace that line with the block below followed by one blank line and then that same line:
    ```bash
    # --- Private skill guard (blocking) ---
    # A private skill belongs to the operator, not to this repository: staging one
    # publishes a file that exists only on this machine. Names are read NUL-separated,
    # so a path with a space or non-ASCII bytes is refused rather than skipped, and
    # --diff-filter=ACMR ignores a staged deletion, which publishes nothing. The match
    # is on the path name, so a renamed copy is not caught; a content match would need
    # a manifest of private bytes to compare against, and this guard owns no such
    # manifest. There is no bypass variable and no gate-config row: staging a private
    # skill is never correct.
    PRIVATE_SKILL_RE='^\.(skilled|opencode|claude|pi|devin|hermes|codex|cursor)/skills/local-[^/]+(/|$)'
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

    # --- Comment hygiene gate (blocking) ---
    ```
  - **Proof:**
    ```bash
    bash -n .skilled/scripts/git-hooks/pre-commit; echo "rc=$?"
    awk '/Comment hygiene gate \(blocking\)/{print last; exit} NF{last=$0}' .skilled/scripts/git-hooks/pre-commit
    awk '/Private skill guard \(blocking\)/{g=NR} /Comment hygiene gate \(blocking\)/{c=NR} END{print (g && c && g < c) ? "guard-before-hygiene" : "order-wrong"}' .skilled/scripts/git-hooks/pre-commit
    grep -cF "PRIVATE_SKILL_RE='^\.(skilled|opencode|claude|pi|devin|hermes|codex|cursor)/skills/local-[^/]+(/|$)'" .skilled/scripts/git-hooks/pre-commit
    ```
    Expected: `rc=0`, then `fi`, then `guard-before-hygiene`, then `1`.
  - **AC:** AC-003, AC-007, AC-008
  - **Rollback:** `git checkout "$(cat specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt)" -- .skilled/scripts/git-hooks/pre-commit`
  - **Stop if:** `bash -n` fails, the awk prints `order-wrong`, or the constant count is not `1`. Do not add a bypass variable or a `lib/gates.tsv` row to make a later check pass.

- [ ] T008 Describe the new coverage in the harness header (.skilled/scripts/git-hooks/tests/pre-commit.test.sh)
  - **File:** `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Anchor:** lines 2 to 4:
    ```
    # Test harness for the pre-commit hook's two auto re-mint gates, compiled routing
    # and spec derived metadata, and for how every gate treats a source tree under
    # .skilled/ and a gate script that is missing.
    ```
  - **Change:** replace those three lines with:
    ```bash
    # Test harness for the pre-commit hook's two auto re-mint gates, compiled routing
    # and spec derived metadata, the private-skill guard, and how every gate treats a
    # source tree under .skilled/ and a gate script that is missing.
    ```
  - **Proof:**
    ```bash
    rg -c 'private-skill' .skilled/scripts/git-hooks/tests/pre-commit.test.sh
    ```
    Expected: `1`, because the cases that add the other mentions do not exist yet.
  - **AC:** AC-012
  - **Rollback:** `git checkout "$(cat specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt)" -- .skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Stop if:** the count is not `1`.

- [ ] T009 Add harness case 74: a staged private skill is refused (.skilled/scripts/git-hooks/tests/pre-commit.test.sh)
  - **File:** `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Anchor:** line 999, `echo "pre-commit gates: $PASS passed, $FAIL failed"`; insert immediately above it. Later tasks reuse this same anchor, so each case lands after the previous one.
  - **Change:** insert:
    ```bash
    # ── 74. a staged private skill is refused and the refusal names its repair ──
    setup_gate_fixture
    stage_new ".skilled/skills/local-webflow/SKILL.md" "private"
    run_hook; RC=$?
    check "a staged private skill is refused" 1 "$RC" "BLOCKED \[gate:private-skill\]"
    check "the refusal names the staged path" 1 "$RC" ".skilled/skills/local-webflow/SKILL.md"
    check "the refusal names the repair" 1 "$RC" "git rm --cached -r"
    ```
  - **Proof:**
    ```bash
    bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh > scratch/harness.log 2>&1; echo "rc=$?"
    rg -c '^PASS  a staged private skill is refused$' scratch/harness.log
    ```
    Expected: `rc=0`, then `1`.
  - **AC:** AC-003
  - **Rollback:** `git checkout "$(cat specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt)" -- .skilled/scripts/git-hooks/tests/pre-commit.test.sh`, which also removes the cases added after this one; re-run the later case tasks in order.
  - **Stop if:** `rc` is not `0` or the label count is not `1`.

- [ ] T010 Add harness case 75: the printed repair clears the block (.skilled/scripts/git-hooks/tests/pre-commit.test.sh)
  - **File:** `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Anchor:** line 999, `echo "pre-commit gates: $PASS passed, $FAIL failed"`; insert immediately above it, which places the case after case 74.
  - **Change:** insert:
    ```bash
    # ── 75. the printed repair leaves a committable index ──
    setup_gate_fixture
    stage_new ".skilled/skills/local-webflow/SKILL.md" "private"
    git -C "$TMP" rm --cached -r -q -- ".skilled/skills/local-webflow/SKILL.md"
    run_hook; RC=$?
    check "the printed repair clears the block" 0 "$RC"
    ```
  - **Proof:**
    ```bash
    bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh > scratch/harness.log 2>&1; echo "rc=$?"
    rg -c '^PASS  the printed repair clears the block$' scratch/harness.log
    ```
    Expected: `rc=0`, then `1`.
  - **AC:** AC-004
  - **Rollback:** `git checkout "$(cat specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt)" -- .skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Stop if:** `rc` is not `0` or the label count is not `1`.

- [ ] T011 Add harness case 76: all eight roots and a nested file (.skilled/scripts/git-hooks/tests/pre-commit.test.sh)
  - **File:** `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Anchor:** line 999, `echo "pre-commit gates: $PASS passed, $FAIL failed"`; insert immediately above it, which places the case after case 75.
  - **Change:** insert:
    ```bash
    # ── 76. every guarded skill root and a nested private file are refused ──
    setup_gate_fixture
    for ROOT in .skilled .opencode .claude .pi .devin .hermes .codex .cursor; do
      stage_new "$ROOT/skills/local-probe/SKILL.md" "private"
    done
    stage_new ".skilled/skills/local-probe/references/deep.md" "private"
    run_hook; RC=$?
    if [[ "$RC" -ne 1 ]]; then
      echo "FAIL  a private skill under every guarded root is refused: expected rc 1, got $RC"; FAIL=$((FAIL + 1))
    else
      echo "PASS  a private skill under every guarded root is refused"; PASS=$((PASS + 1))
    fi
    for ROOT in .skilled .opencode .claude .pi .devin .hermes .codex .cursor; do
      if grep -qF "$ROOT/skills/local-probe/SKILL.md" "$TMP/out.log"; then
        echo "PASS  the refusal names $ROOT"; PASS=$((PASS + 1))
      else echo "FAIL  the refusal never named $ROOT"; FAIL=$((FAIL + 1)); fi
    done
    if grep -qF '.skilled/skills/local-probe/references/deep.md' "$TMP/out.log"; then
      echo "PASS  the refusal names a file nested in a private skill"; PASS=$((PASS + 1))
    else echo "FAIL  a nested private file was not refused"; FAIL=$((FAIL + 1)); fi
    ```
  - **Proof:**
    ```bash
    bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh > scratch/harness.log 2>&1; echo "rc=$?"
    rg -c '^PASS  the refusal names \.(skilled|opencode|claude|pi|devin|hermes|codex|cursor)$' scratch/harness.log
    rg -c '^PASS  the refusal names a file nested in a private skill$' scratch/harness.log
    ```
    Expected: `rc=0`, then `8`, then `1`.
  - **AC:** AC-005
  - **Rollback:** `git checkout "$(cat specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt)" -- .skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Stop if:** the root count is not `8`. A count of `6` means the two added roots were dropped from the loop.

- [ ] T012 Add harness case 77: a `local-` name below the skill root is committable (.skilled/scripts/git-hooks/tests/pre-commit.test.sh)
  - **File:** `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Anchor:** line 999, `echo "pre-commit gates: $PASS passed, $FAIL failed"`; insert immediately above it, which places the case after case 76.
  - **Change:** insert:
    ```bash
    # ── 77. a local- name below the skill root is an ordinary file ──
    setup_gate_fixture
    stage_new ".skilled/skills/sk-code/local-notes.md" "an ordinary file"
    run_hook; RC=$?
    check "a local- file below the skill root is committable" 0 "$RC"
    if grep -q 'gate:private-skill' "$TMP/out.log"; then
      echo "FAIL  the guard spoke on an ordinary file"; FAIL=$((FAIL + 1))
    else
      echo "PASS  the guard stayed silent on an ordinary file"; PASS=$((PASS + 1))
    fi
    ```
  - **Proof:**
    ```bash
    bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh > scratch/harness.log 2>&1; echo "rc=$?"
    rg -c '^PASS  a local- file below the skill root is committable$' scratch/harness.log
    rg -c '^PASS  the guard stayed silent on an ordinary file$' scratch/harness.log
    ```
    Expected: `rc=0`, then `1`, then `1`.
  - **AC:** AC-006
  - **Rollback:** `git checkout "$(cat specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt)" -- .skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Stop if:** either count is not `1`. A failure here means the pattern overreaches and must be fixed in the hook, not in the expectation.

- [ ] T013 Add harness case 78: a renamed copy of a private skill is committable (.skilled/scripts/git-hooks/tests/pre-commit.test.sh)
  - **File:** `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Anchor:** line 999, `echo "pre-commit gates: $PASS passed, $FAIL failed"`; insert immediately above it, which places the case after case 77.
  - **Change:** insert:
    ```bash
    # ── 78. a renamed copy of a private skill is committable: the guard matches names ──
    setup_gate_fixture
    stage_new ".skilled/skills/local-webflow/SKILL.md" "private"
    stage_new ".skilled/skills/private-copy/SKILL.md" "private"
    git -C "$TMP" rm --cached -r -q -- ".skilled/skills/local-webflow/SKILL.md"
    run_hook; RC=$?
    check "a renamed copy of a private skill is committable" 0 "$RC"
    if grep -q 'gate:private-skill' "$TMP/out.log"; then
      echo "FAIL  the guard claimed to catch a renamed copy"; FAIL=$((FAIL + 1))
    else
      echo "PASS  the guard does not claim to catch a renamed copy"; PASS=$((PASS + 1))
    fi
    ```
  - **Proof:**
    ```bash
    bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh > scratch/harness.log 2>&1; echo "rc=$?"
    rg -c '^PASS  a renamed copy of a private skill is committable$' scratch/harness.log
    rg -c '^PASS  the guard does not claim to catch a renamed copy$' scratch/harness.log
    ```
    Expected: `rc=0`, then `1`, then `1`.
  - **AC:** AC-011
  - **Rollback:** `git checkout "$(cat specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt)" -- .skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Stop if:** either count is not `1`. This case pins the documented limit; do not change it to expect a block.

- [ ] T014 Add harness case 79: a staged symlink named `local-*` is refused (.skilled/scripts/git-hooks/tests/pre-commit.test.sh)
  - **File:** `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Anchor:** line 999, `echo "pre-commit gates: $PASS passed, $FAIL failed"`; insert immediately above it, which places the case after case 78.
  - **Change:** insert:
    ```bash
    # ── 79. a staged symlink named local-* is refused ──
    setup_gate_fixture
    mkdir -p "$TMP/.skilled/skills" "$TMP/outside"
    printf 'private\n' > "$TMP/outside/SKILL.md"
    ln -s ../../outside "$TMP/.skilled/skills/local-link"
    git -C "$TMP" add -- ".skilled/skills/local-link"
    run_hook; RC=$?
    check "a staged symlink named local-* is refused" 1 "$RC" ".skilled/skills/local-link"
    ```
  - **Proof:**
    ```bash
    bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh > scratch/harness.log 2>&1; echo "rc=$?"
    rg -c '^PASS  a staged symlink named local-\* is refused$' scratch/harness.log
    ```
    Expected: `rc=0`, then `1`.
  - **AC:** AC-009
  - **Rollback:** `git checkout "$(cat specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt)" -- .skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Stop if:** `rc` is not `0` or the label count is not `1`.

- [ ] T015 Add harness case 80: a staged gitlink named `local-*` is refused (.skilled/scripts/git-hooks/tests/pre-commit.test.sh)
  - **File:** `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Anchor:** line 999, `echo "pre-commit gates: $PASS passed, $FAIL failed"`; insert immediately above it, which places the case after case 79.
  - **Change:** insert:
    ```bash
    # ── 80. a staged gitlink named local-* is refused ──
    setup_gate_fixture
    git -C "$TMP" update-index --add --cacheinfo 160000,1111111111111111111111111111111111111111,.skilled/skills/local-sub
    run_hook; RC=$?
    check "a staged gitlink named local-* is refused" 1 "$RC" ".skilled/skills/local-sub"
    ```
  - **Proof:**
    ```bash
    bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh > scratch/harness.log 2>&1; echo "rc=$?"
    rg -c '^PASS  a staged gitlink named local-\* is refused$' scratch/harness.log
    ```
    Expected: `rc=0`, then `1`.
  - **AC:** AC-010
  - **Rollback:** `git checkout "$(cat specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt)" -- .skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Stop if:** `rc` is not `0` or the label count is not `1`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Run the whole harness and read the summary line (read-only)
  - **File:** `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` (executed, not edited)
  - **Anchor:** `n/a: pure command`
  - **Change:** none. A single `FAIL` line is a stop condition; fix the guard, not the expectation.
  - **Proof:**
    ```bash
    bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh > scratch/harness.log 2>&1; echo "rc=$?"
    tail -1 scratch/harness.log
    ```
    Expected: `rc=0`, then `pre-commit gates: 131 passed, 0 failed`. The count is the 111 the harness printed before this phase plus 20 from the seven new cases.
  - **AC:** AC-012
  - **Rollback:** `n/a: read-only, nothing to undo`
  - **Stop if:** `rc` is not `0`, the summary is not exactly that line, or any `FAIL` line appears.

- [ ] T017 Prove the guard in a throwaway repository (none)
  - **File:** `none`; the probe builds a temporary repository under `mktemp -d` and removes it in the same command.
  - **Anchor:** `n/a: pure command`
  - **Change:** run the probe exactly as written:
    ```bash
    HOOK="$PWD/.skilled/scripts/git-hooks/pre-commit"
    PROBE="$(mktemp -d)"; git -C "$PROBE" init -q
    git -C "$PROBE" config user.email t@example.com; git -C "$PROBE" config user.name t
    mkdir -p "$PROBE/.skilled/skills/local-probe"; echo private > "$PROBE/.skilled/skills/local-probe/SKILL.md"
    git -C "$PROBE" add .skilled/skills/local-probe/SKILL.md
    ( cd "$PROBE" && bash "$HOOK" ); echo "rc=$?"
    rm -rf "$PROBE"
    ```
  - **Proof:** the command above is its own proof.
    Expected:
    ```
    BLOCKED [gate:private-skill]: a private skill is staged and would be published:
      .skilled/skills/local-probe/SKILL.md
      Fix: git rm --cached -r -- ".skilled/skills/local-probe/SKILL.md"
    rc=1
    ```
  - **AC:** AC-003
  - **Rollback:** `n/a: the probe removes its own temporary directory in its last line`
  - **Stop if:** `rc` is not `1`, or the output omits the path or the repair. `HOOK` is captured before the `cd`, so the probe runs this checkout's hook and not a path inside the throwaway repository.

- [ ] T018 Prove the ignore rules against a real symlink (.gitignore)
  - **File:** `.gitignore` (read by git); the probe creates `.skilled/skills/local-probe`
  - **Anchor:** the four rules added in T006
  - **Change:** create the probe symlink and check it:
    ```bash
    mkdir -p .skilled/skills
    ln -s "$PWD" .skilled/skills/local-probe
    git check-ignore -q .skilled/skills/local-probe; echo "rc=$?"
    git check-ignore -v .skilled/skills/local-probe | sed 's/^[^:]*:[0-9]*://'
    ```
  - **Proof:** the command above is its own proof.
    Expected: `rc=0`, then `/.skilled/skills/local-*	.skilled/skills/local-probe`.
  - **AC:** AC-002
  - **Rollback:** `rm -f .skilled/skills/local-probe`
  - **Stop if:** `rc` is not `0`, or `.skilled/skills/local-probe` already exists before the `ln -s` (remove it first and re-check that nothing tracked lives there).

- [ ] T019 Remove the symlink probe and confirm nothing is left (none)
  - **File:** `none`; removes the probe T018 created
  - **Anchor:** `n/a: pure command`
  - **Change:**
    ```bash
    git status --porcelain --ignored=matching | rg -c 'local-probe'
    rm -f .skilled/skills/local-probe
    git status --porcelain | rg -c 'local-probe' || echo 0
    ```
  - **Proof:** the command above is its own proof.
    Expected: `1`, then `0`. The `1` is the positive control: the status pipeline sees the ignored probe before the removal, so the zero after it is an absence and not a broken pipe.
  - **AC:** AC-002
  - **Rollback:** `n/a: this task is itself the rollback of T018`
  - **Stop if:** the first count is not `1`, because that means T018 left no probe to remove.

- [ ] T020 Confirm the scope and the comment hygiene of the diff (the three changed files)
  - **File:** the three changed files, read through `git diff`
  - **Anchor:** `n/a: pure command`
  - **Change:** none. Any file outside the three, or any added comment naming a spec path, packet number or phase number, is removed rather than justified.
  - **Proof:**
    ```bash
    git diff --name-only "$(cat specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt)" -- . ':(exclude)specs/**'
    git diff "$(cat specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt)" -- .gitignore .skilled/scripts/git-hooks/ | rg -c '^\+.*local-' || echo 0
    git diff "$(cat specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt)" -- .gitignore .skilled/scripts/git-hooks/ | rg -c '^\+.*(specs/|phase [0-9]|013-private)' || echo 0
    ```
    Expected: exactly three paths:
    ```
    .gitignore
    .skilled/scripts/git-hooks/pre-commit
    .skilled/scripts/git-hooks/tests/pre-commit.test.sh
    ```
    then `26`, then `0`. The `26` is the positive control: the added-line pipeline sees the new `local-` lines, so the zero is an absence.
  - **AC:** AC-013
  - **Rollback:** `n/a: read-only, nothing to undo`
  - **Stop if:** a fourth path appears, or the second count is `0` (the pipeline is broken, not clean).

- [ ] T021 Confirm the limits are recorded where a reader finds them (spec.md, read-only)
  - **File:** `spec.md`
  - **Anchor:** `n/a: pure command`
  - **Change:** none.
  - **Proof:**
    ```bash
    rg -c 'no-verify' specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/spec.md
    rg -c 'git history' specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/spec.md
    rg -c 'ongoing pre-push surface-token guard' specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/spec.md
    rg -c 'renamed copy' specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/spec.md
    ```
    Expected: `4`, `4`, `3`, `5`.
  - **AC:** AC-014
  - **Rollback:** `n/a: read-only, nothing to undo`
  - **Stop if:** any count differs. A lower count means a limit was deleted; restore it rather than lowering the expectation.

- [ ] T022 Reviewer round through the `subagent` tool, agent `review` (none)
  - **File:** `none`; the reviewer reads the three changed files and this packet's six documents
  - **Anchor:** `n/a: pure command`
  - **Change:** none by the reviewer. The review runs through the `subagent` tool with agent `review` (agent `deep-review` for a multi-dimension pass), read-only by instruction: the prompt says it edits no file. Capture `git status --porcelain` before and after and require the two to be identical. The reviewer reads the diff and the packet; findings come back as text; the writer repairs in-scope findings and the reviewer re-reads once. A finding that would widen the scope is recorded in `implementation-summary.md` and left to the phase that owns it. At most two rounds.
  - **Proof:** the reviewer's report is the proof.
    Expected: the report's final line reads `VERDICT: PASS` and lists no unresolved in-scope finding.
  - **AC:** AC-013
  - **Rollback:** `n/a: read-only session, nothing to undo`
  - **Stop if:** the second round still reports an unresolved in-scope finding. Do not start a third round; report the finding instead.

- [ ] T023 Final strict validation (this packet)
  - **File:** this packet
  - **Anchor:** `n/a: pure command`
  - **Change:** none. Fix the documents until the command prints `RESULT: PASSED`; never edit the validator.
  - **Proof:**
    ```bash
    bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard --strict > scratch/validate.log 2>&1; echo "rc=$?"
    rg -c '^RESULT: PASSED$' scratch/validate.log
    ```
    Expected: `rc=0`, then `1`. A `SPEC_DOC_SUFFICIENCY` warning naming `implementation-summary.md` is expected before implementation and does not fail the run.
  - **AC:** AC-012, AC-013, AC-014
  - **Rollback:** `n/a: read-only, nothing to undo`
  - **Stop if:** `rc` is not `0`, or the log holds an error other than that one warning.

- [ ] T024 Remove the scratch artifacts (none)
  - **File:** `none`; removes `specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt`, `scratch/harness.log` and `scratch/validate.log`
  - **Anchor:** `n/a: pure command`
  - **Change:**
    ```bash
    rm -f specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/phase-base.txt \
          specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/harness.log \
          specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/validate.log
    ```
  - **Proof:**
    ```bash
    ls specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/scratch/
    ```
    Expected: `.gitkeep` and nothing else.
  - **AC:** AC-015
  - **Rollback:** `n/a: the files are disposable; re-run T001 and T016 to recreate the two that matter`
  - **Stop if:** any file other than `.gitkeep` remains.

- [ ] T025 Stage the phase files and commit them (the three code files and this packet's documents)
  - **File:** `.gitignore`, `.skilled/scripts/git-hooks/pre-commit`, `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`, and this packet's `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md`, `goal.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`, plus the parent packet's `goal.md`
  - **Anchor:** `n/a: pure command`
  - **Change:** stage the files by name, never with `git add -A`, then commit:
    ```bash
    git add .gitignore .skilled/scripts/git-hooks/pre-commit .skilled/scripts/git-hooks/tests/pre-commit.test.sh \
            specs/sk-code/013-private-surface-skills/goal.md \
            specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/spec.md \
            specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/plan.md \
            specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/tasks.md \
            specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/acceptance-criteria.md \
            specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/decision-record.md \
            specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/goal.md \
            specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/implementation-summary.md \
            specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/description.json \
            specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/graph-metadata.json
    git commit -m "chore(git-hooks): block staged private skills and ignore local-* skill paths" -m "Add four slash-less ignore rules and a pre-commit guard covering eight skill roots, with seven harness cases for the block, the repair, the false-positive boundary, a renamed copy, a symlink and a gitlink."
    ```
  - **Proof:**
    ```bash
    git log --oneline -1
    git show --name-only --format='' HEAD | rg -c '^(\.gitignore|\.skilled/scripts/git-hooks/pre-commit|\.skilled/scripts/git-hooks/tests/pre-commit\.test\.sh)$'
    git show --name-only --format='' HEAD | rg -vc '^(\.gitignore|\.skilled/scripts/git-hooks/pre-commit|\.skilled/scripts/git-hooks/tests/pre-commit\.test\.sh|specs/sk-code/013-private-surface-skills/goal\.md|specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/.+)$' || echo 0
    ```
    Expected: one commit whose subject starts `chore(git-hooks): block staged private skills`, then `3`, then `0`. The `3` is the positive control for the zero: the commit lists all three code files, so the zero means no path outside the allowed set.
  - **AC:** AC-015
  - **Rollback:** `git reset --soft HEAD~1` before the push, or `git revert --no-edit HEAD` after it.
  - **Stop if:** `git status --porcelain` shows a staged path outside the thirteen listed above. Unstage it rather than committing it.

- [ ] T026 Push the phase commit to main (none)
  - **File:** `none`
  - **Anchor:** `n/a: pure command`
  - **Change:**
    ```bash
    git push origin HEAD:main
    ```
  - **Proof:**
    ```bash
    git log --oneline -1 origin/main
    git log --oneline -1 HEAD
    ```
    Expected: the same commit subject and SHA on both lines.
  - **AC:** AC-015
  - **Rollback:** `n/a: a pushed commit is undone by the revert in the spec's Rollback section, not by a force push`
  - **Stop if:** the push is rejected. Report the rejection; do not force, and do not rebase onto a different tip.

- [ ] T027 Confirm the worktree is clean and HEAD equals origin/main (none)
  - **File:** `none`
  - **Anchor:** `n/a: pure command`
  - **Change:** none.
  - **Proof:**
    ```bash
    test -z "$(git status --porcelain)" && echo "worktree-clean"
    test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" && echo "head-equals-origin-main"
    ```
    Expected: `worktree-clean`, then `head-equals-origin-main`.
  - **AC:** AC-015
  - **Rollback:** `n/a: read-only, nothing to undo`
  - **Stop if:** either line is missing. A dirty worktree after the commit means a file was left unstaged; commit it in the same phase or revert it.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification read: T016, T017, T018 and T019
- [ ] Push confirmed: T026 landed the phase commit as the tip of `origin/main`, so phase 002's "landed on main" dependency holds
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [ ] CHK-010 [P0] `bash -n .skilled/scripts/git-hooks/pre-commit` and `bash -n .skilled/scripts/git-hooks/tests/pre-commit.test.sh` both exit 0
- [ ] CHK-011 [P0] The guard runs before the comment-hygiene gate and after the trust and kill-switch blocks
- [ ] CHK-012 [P1] The guard starts no `node` and no `python3`
- [ ] CHK-013 [P1] Code follows the hook's existing style: uppercase globals, `IFS= read -r -d ''`, and a `BLOCKED` message that names its gate
- [ ] CHK-014 [P0] The guard carries no bypass variable and no `lib/gates.tsv` row
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete: the throwaway-repository probe and the symlink probe both run and are read
- [ ] CHK-022 [P1] Edge cases tested: nested private file, `local-` below the skill root, staged deletion, all eight skill roots, a renamed copy, a staged symlink, a staged gitlink
- [ ] CHK-023 [P1] Error scenarios validated: a refusal names its path and its repair
- [ ] CHK-024 [P0] The harness exits 0 with `pre-commit gates: 131 passed, 0 failed`, and the existing cases were not edited
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep: `rg -n 'local-' .gitignore .skilled/scripts/git-hooks/`
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed pattern and message: `rg -n 'gate:private-skill|PRIVATE_SKILL_RE|PRIVATE_STAGED' .`
- [ ] CHK-FIX-004 [P0] Path fixes include adversarial table tests for a space in the name, non-ASCII bytes, a staged deletion, a rename into the private path, and a `local-` name below the skill root
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed: eight skill roots x three path shapes x four index actions
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state: the probe runs with no `skilled.trustRepoHooks` and an untrusted `SOURCE_ROOT`
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets, and no private content is read or written by this phase
- [ ] CHK-031 [P0] Input validation implemented: the staged path is matched against an anchored pattern, never interpreted
- [ ] CHK-032 [P1] The guard fails closed when it cannot read the staged names
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments explain the durable why and name no spec path, packet number or phase number
- [ ] CHK-042 [P2] README updated (not applicable: the hook's header and the harness header already describe their own gates)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion, and the three probes left nothing in the checkout
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | [ ]/14 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-10-23
<!-- /ANCHOR:summary -->

---
