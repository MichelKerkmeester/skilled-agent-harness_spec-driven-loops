## Verdict

Not ready: four valid shell shapes can still bypass pathspec or missing-input checks in `.github/scripts/check-gate-inputs.sh`.

## Findings

| ID | Severity (P0 blocks the phase, P1 must fix, P2 should fix) | File:line | Scenario (the inputs and the wrong outcome) | Could an ordinary edit produce it | Suggested fix |
|---|---|---|---|---|---|
| F-001 | P1 | `.github/scripts/check-gate-inputs.sh:163-170,203-215` | `<code>/usr/bin/git diff --cached -- ".opencode/skills/missing/SKILL.md"</code>` is not recognized as a Git command; the quoted path is classified as a note, so a one-root pathspec passes. | Yes. Absolute Git invocation is valid shell. | Recognize command paths ending in `/git`, or parse pathspecs independently of command spelling. |
| F-002 | P1 | `.github/scripts/check-gate-inputs.sh:163-170,222-233` | `<code>git diff --cached -- "$REPO_ROOT/.opencode/"</code>` records no pathspec because `/./` requires a character after the trailing slash, then emits `note read`; no twin failure occurs. | Yes. The root directory with or without a trailing slash is a valid Git pathspec. | Record variable-root pathspecs for the root itself and trailing-slash forms. |
| F-003 | P1 | `.github/scripts/check-gate-inputs.sh:179-181` | `<code>PATHS=(</code><br><code>  ".opencode/skills/*/SKILL.md"</code><br><code>  ".skilled/skills/*/SKILL.md"</code><br><code>) ; git diff --cached -- ".opencode/skills/missing/SKILL.md"</code>` skips the entire closing line, including the one-root Git pathspec, so the check passes. | Yes. A command may legally follow a multiline Bash array assignment on the closing line. | Process the remainder of a closing-array line after setting `inarr=0`. |
| F-004 | P1 | `.github/scripts/check-gate-inputs.sh:199-201,212-215,222-233` | `<code>declare CHECKER=".opencode/bin/missing.sh"</code>` is not matched by the scalar-assignment rule, then is classified as a quoted argument and ignored; the missing hook input passes. | Yes. `declare` is ordinary Bash, as is `local -r`. | Parse `declare`, `typeset`, and option-bearing `local` assignments as literal hook inputs. |
Codex exit 0, 2026-09-17T07:45:31Z to 2026-09-17T07:55:57Z, --model gpt-5.6-luna, reasoning xhigh, service tier fast, --sandbox read-only.
