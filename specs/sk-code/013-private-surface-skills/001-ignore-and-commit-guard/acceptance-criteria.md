---
title: "Acceptance Criteria: Phase 1: ignore-and-commit-guard"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ignore and commit guard acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/001-ignore-and-commit-guard"
    last_updated_at: "2026-10-23T10:34:19Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Rewrote the criteria for Level 3 with one proof block per criterion"
    next_safe_action: "Execute tasks.md and mark each criterion Met with observed evidence"
    blockers: []
    key_files:
      - ".gitignore"
      - ".skilled/scripts/git-hooks/pre-commit"
      - ".skilled/scripts/git-hooks/tests/pre-commit.test.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-001-ignore-and-commit-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: ignore-and-commit-guard

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 001-ignore-and-commit-guard
**Level:** 3
**Status:** Draft
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. Every command lives in the proof block for its criterion in section 3, never in this table.

| AC-ID | REQ | Given / When / Then | Status | Waiver |
|-------|-----|---------------------|--------|--------|
| AC-001 | REQ-001 | Given the edited root ignore file, when `git check-ignore -v` runs for a private path under each of the four rule-bearing roots, then each of the four rules is named and the command exits 0 | Unmet | - |
| AC-002 | REQ-001 | Given a symlink named `local-probe` under the skills tree, when the ignore layer is asked about it, then the slash-less rule matches it, and a `local-` file below the skill root is not ignored | Unmet | - |
| AC-003 | REQ-002 | Given a throwaway repository with `.skilled/skills/local-probe/SKILL.md` staged, when the real hook runs, then it exits 1 and the log names the path, the gate and the repair | Unmet | - |
| AC-004 | REQ-002 | Given the same staged path, when the operator runs the repair the refusal printed, then the hook exits 0 on the next run, so the guard does not block its own fix | Unmet | - |
| AC-005 | REQ-004 | Given a private skill staged under each of the eight guarded roots plus a file nested inside one, when the harness runs, then every one of those paths is refused and named | Unmet | - |
| AC-006 | REQ-004 | Given a `local-` name that sits below the skill root rather than at it, when the hook runs, then nothing is refused and the guard stays silent | Unmet | - |
| AC-007 | REQ-003 | Given the edited hook, when its syntax and its gate order are checked, then the file parses, the guard's closing `fi` is the last non-blank line before the comment-hygiene gate, and no bypass exists for it | Unmet | - |
| AC-008 | REQ-003 | Given the edited hook, when its index read and its pattern constant are inspected, then the read is NUL-separated with `--diff-filter=ACMR` and the constant names all eight roots | Unmet | - |
| AC-009 | REQ-004 | Given a staged symlink named `local-*`, when the hook runs, then the symlink is refused with exit 1 | Unmet | - |
| AC-010 | REQ-004 | Given a staged gitlink named `local-*`, when the hook runs, then the gitlink entry is refused with exit 1 | Unmet | - |
| AC-011 | REQ-002 | Given a private skill copied to a tracked name that does not start with `local-`, when the hook runs, then the copy is committable with exit 0, and the limit is recorded in the spec and in ADR-003 | Unmet | - |
| AC-012 | REQ-004 | Given the harness with the seven new cases, when it runs, then it exits 0 with `pre-commit gates: 131 passed, 0 failed`, and no existing case was rewritten to make that true | Unmet | - |
| AC-013 | REQ-006 | Given the phase commit, when the diff is inspected, then only the three code files changed outside `specs/`, and no added code comment names a spec path, packet number or phase number | Unmet | - |
| AC-014 | REQ-005 | Given a reader looking for the limits, when they read `spec.md`, then they find `--no-verify`, git-history retention, the renamed-copy limit and the absence of an ongoing pre-push surface-token guard | Unmet | - |
| AC-015 | REQ-006 | Given the pushed phase commit, when the worktree and the refs are checked, then `git status --porcelain` prints nothing and HEAD equals `origin/main` | Unmet | - |

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

<!-- ANCHOR:proofs -->
## 3. PROOF BLOCKS

Run every block from the repository root. `scratch/` is this packet's scratch
directory and its `*.log` files are gitignored. `HEAD~1` is the commit before the
phase commit, because this phase ships as exactly one commit.

### AC-001 - four ignore rules, each named

```bash
rg -c '^/\.(skilled|hermes|codex|cursor)/skills/local-\*$' .gitignore
git check-ignore -v .skilled/skills/local-webflow/SKILL.md .hermes/skills/local-obsidian .codex/skills/local-probe .cursor/skills/local-probe | sed 's/^[^:]*:[0-9]*://'
git check-ignore -q .cursor/skills/local-probe; echo "rc=$?"
```

Expected: the first command prints `4`. The second prints four lines, in this order:

```
/.skilled/skills/local-*	.skilled/skills/local-webflow/SKILL.md
/.hermes/skills/local-*	.hermes/skills/local-obsidian
/.codex/skills/local-*	.codex/skills/local-probe
/.cursor/skills/local-*	.cursor/skills/local-probe
```

The third prints `rc=0`.

### AC-002 - a symlink matches, a nested `local-` name does not

```bash
mkdir -p .skilled/skills
ln -s "$PWD" .skilled/skills/local-probe
git check-ignore -q .skilled/skills/local-probe; echo "rc=$?"
git check-ignore -v .skilled/skills/local-probe | sed 's/^[^:]*:[0-9]*://'
git check-ignore -q .skilled/skills/sk-code/local-notes.md; echo "rc=$?"
```

Expected: `rc=0`, then `/.skilled/skills/local-*	.skilled/skills/local-probe`, then `rc=1`. The first `rc=0` is the positive control for the last `rc=1`: the same command that ignores the symlink refuses to ignore the nested name.

### AC-003 - a staged private skill is refused, and the refusal names its repair

```bash
HOOK="$PWD/.skilled/scripts/git-hooks/pre-commit"
PROBE="$(mktemp -d)"; git -C "$PROBE" init -q
git -C "$PROBE" config user.email t@example.com; git -C "$PROBE" config user.name t
mkdir -p "$PROBE/.skilled/skills/local-probe"; echo private > "$PROBE/.skilled/skills/local-probe/SKILL.md"
git -C "$PROBE" add .skilled/skills/local-probe/SKILL.md
( cd "$PROBE" && bash "$HOOK" ); echo "rc=$?"
rm -rf "$PROBE"
```

Expected:

```
BLOCKED [gate:private-skill]: a private skill is staged and would be published:
  .skilled/skills/local-probe/SKILL.md
  Fix: git rm --cached -r -- ".skilled/skills/local-probe/SKILL.md"
rc=1
```

### AC-004 - the printed repair clears the block

```bash
HOOK="$PWD/.skilled/scripts/git-hooks/pre-commit"
PROBE="$(mktemp -d)"; git -C "$PROBE" init -q
git -C "$PROBE" config user.email t@example.com; git -C "$PROBE" config user.name t
mkdir -p "$PROBE/.skilled/skills/local-probe"; echo private > "$PROBE/.skilled/skills/local-probe/SKILL.md"
git -C "$PROBE" add .skilled/skills/local-probe/SKILL.md
( cd "$PROBE" && bash "$HOOK" > "$PROBE/out.log" 2>&1 ); echo "rc-before=$?"
rg -c 'gate:private-skill' "$PROBE/out.log"
git -C "$PROBE" rm --cached -r -q -- .skilled/skills/local-probe/SKILL.md
( cd "$PROBE" && bash "$HOOK" > "$PROBE/out.log" 2>&1 ); echo "rc-after=$?"
rg -c 'gate:private-skill' "$PROBE/out.log" || echo 0
rm -rf "$PROBE"
```

Expected: `rc-before=1`, then `1`, then `rc-after=0`, then `0`. The first `1` is the positive control: the same log pattern sees the refusal, so the zero after the repair is an absence and not a broken pipeline.

### AC-005 - eight roots and a nested file

```bash
bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh > scratch/harness.log 2>&1; echo "rc=$?"
rg -c '^PASS  the refusal names \.(skilled|opencode|claude|pi|devin|hermes|codex|cursor)$' scratch/harness.log
rg -c '^PASS  the refusal names a file nested in a private skill$' scratch/harness.log
```

Expected: `rc=0`, then `8`, then `1`.

### AC-006 - the false-positive boundary

```bash
rg -c '^PASS  a local- file below the skill root is committable$' scratch/harness.log
rg -c '^PASS  the guard stayed silent on an ordinary file$' scratch/harness.log
```

Expected: `1` and `1`.

### AC-007 - placement, syntax and no bypass

```bash
bash -n .skilled/scripts/git-hooks/pre-commit; echo "rc=$?"
awk '/Private skill guard \(blocking\)/{g=NR} /Comment hygiene gate \(blocking\)/{c=NR} END{print (g && c && g < c) ? "guard-before-hygiene" : "order-wrong"}' .skilled/scripts/git-hooks/pre-commit
grep -c 'SPECKIT_SKIP_COMMENT_HYGIENE' .skilled/scripts/git-hooks/pre-commit
grep -c 'SPECKIT_SKIP_PRIVATE' .skilled/scripts/git-hooks/pre-commit || echo 0
rg -c 'pre-commit' .skilled/scripts/git-hooks/lib/gates.tsv
rg -c 'private' .skilled/scripts/git-hooks/lib/gates.tsv || echo 0
```

Expected: `rc=0`, `guard-before-hygiene`, `6`, `0`, `9`, `0`. The `6` and the `9` are the positive controls: the same grep finds a bypass variable in the hook and a gate row in the registry, so the two zeros mean absence, not a broken pattern.

### AC-008 - the index read and the pattern constant

```bash
grep -cF "PRIVATE_SKILL_RE='^\.(skilled|opencode|claude|pi|devin|hermes|codex|cursor)/skills/local-[^/]+(/|$)'" .skilled/scripts/git-hooks/pre-commit
grep -cF 'git diff --cached --name-only -z --diff-filter=ACMR' .skilled/scripts/git-hooks/pre-commit
```

Expected: `1` and `1`.

### AC-009 - a staged symlink named `local-*`

```bash
rg -c '^PASS  a staged symlink named local-\* is refused$' scratch/harness.log
```

Expected: `1`.

### AC-010 - a staged gitlink named `local-*`

```bash
rg -c '^PASS  a staged gitlink named local-\* is refused$' scratch/harness.log
```

Expected: `1`.

### AC-011 - a renamed copy passes, and the limit is recorded

```bash
rg -c '^PASS  a renamed copy of a private skill is committable$' scratch/harness.log
rg -c '^PASS  the guard does not claim to catch a renamed copy$' scratch/harness.log
rg -c 'renamed copy' spec.md
rg -c 'ADR-003' spec.md
```

Expected: `1`, `1`, `5`, `6`.

### AC-012 - the whole harness is green and no existing case changed

```bash
bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh > scratch/harness.log 2>&1; echo "rc=$?"
tail -1 scratch/harness.log
git diff HEAD~1 -- .skilled/scripts/git-hooks/tests/pre-commit.test.sh | rg -c '^\+.*gate:private-skill'
git diff HEAD~1 -- .skilled/scripts/git-hooks/tests/pre-commit.test.sh | rg -c '^-[^-]'
git diff HEAD~1 -- .skilled/scripts/git-hooks/tests/pre-commit.test.sh | rg -c '^-[^-].*(check |setup_|run_hook)' || echo 0
```

Expected: `rc=0`, `pre-commit gates: 131 passed, 0 failed`, `3`, `2`, `0`. The `3` is the positive control for the last zero: the same diff pipeline sees the added guard references. The `2` removed lines are the two harness-header comment lines that now describe the guard.

### AC-013 - scope and comment hygiene

```bash
git diff --name-only HEAD~1 -- . ':(exclude)specs/**'
git diff HEAD~1 -- .gitignore .skilled/scripts/git-hooks/ | rg -c '^\+.*local-' || echo 0
git diff HEAD~1 -- .gitignore .skilled/scripts/git-hooks/ | rg -c '^\+.*(specs/|phase [0-9]|013-private)' || echo 0
```

Expected: exactly three paths, in this order:

```
.gitignore
.skilled/scripts/git-hooks/pre-commit
.skilled/scripts/git-hooks/tests/pre-commit.test.sh
```

Then `26` and `0`. The `26` is the positive control: the same added-line pipeline sees the new `local-` lines, so the zero is an absence and not a broken pipe.

### AC-014 - the limits are where a reader finds them

```bash
rg -c 'no-verify' spec.md
rg -c 'git history' spec.md
rg -c 'ongoing pre-push surface-token guard' spec.md
rg -c 'renamed copy' spec.md
```

Expected: `4`, `4`, `3`, `5`.

### AC-015 - the phase commit is pushed last

```bash
test -z "$(git status --porcelain)" && echo "worktree-clean"
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" && echo "head-equals-origin-main"
```

Expected: `worktree-clean` and `head-equals-origin-main`.
<!-- /ANCHOR:proofs -->

---

<!-- ANCHOR:closure -->
## 4. CLOSURE STATEMENT

**Closeable:** No

The packet closes on AC-001 through AC-015, each proven by the block above and each
recorded `Met` with the observed output. Two things are consciously left out: the
guard is name-based, so a renamed copy passes it (AC-011 pins that exit code 0 and
ADR-003 records why), and no recurring pre-push surface-token check exists after the
one-time fresh-clone sweep in phase 5 (ADR-005).
<!-- /ANCHOR:closure -->
