# Iteration 8: Shell Hygiene

## Focus
Angle 8 — strict-mode coverage, variable quoting, `cd`/`eval`/portability hygiene in `runtime/cli` shell scripts.

## Findings

### F8.1 [P2] `eval` of a command substitution in a setup script
- **Code:** `runtime/cli/setup/check-prerequisites.sh:74` — `eval "$(get_feature_paths)"`.
- **Standard:** `sk-code-opencode/references/shell/quality-standards/validation-security-and-shellcheck.md` §5 "Security Considerations" — "Never use eval with user input"; the safe alternative is the documented case-statement pattern. ShellCheck flags `eval` as a defensive-coding risk.
- **What is present:** `get_feature_paths` returns a shell snippet that is then `eval`'d so the function's emitted assignments land in the caller scope. The source is an internal function, not direct user input, so this is not an injection vulnerability today — but it is the exact pattern the standard steers away from, and any future drift in the function's output becomes an `eval` injection surface.
- **Severity:** P2 (no live injection; code smell with a documented safer alternative).
- **One-line fix:** **judgment-required** — have `get_feature_paths` `echo` a single value/array and consume it with a `read`/`mapfile` into the caller scope, or `printf` assignments into a temp and `source` it, instead of `eval`.

### F8.2 [P2] `cd` without `|| exit` on three paths
- **Code:** `runtime/cli/spec/archive.sh:299` (`cd "$PROJECT_ROOT"`), `runtime/cli/spec/create.sh:894` (`cd "$REPO_ROOT"`), `runtime/cli/setup/rebuild-native-modules.sh:23` (`cd "$ROOT_DIR/shared"`).
- **Standard:** `validation-security-and-shellcheck.md` §7 ShellCheck table — SC2164 ("Use `cd ... || exit`") and the safe-file-operation patterns in §2.
- **What is present:** All three scripts enable `set -euo pipefail`, so a failing `cd` already terminates the script; the `|| exit` is redundant under strict mode. But SC2164 still flags them because `cd` can sit in a context where `-e` is reset, and the documented idiom is explicit.
- **Severity:** P2.
- **One-line fix:** **mechanical** — add `|| exit $?` (or `|| { echo "cannot cd into $X" >&2; exit 1; }`) to match the documented idiom.

### F8.3 [Conforming] Strict mode, quoting, and no `eval`-of-user-input across the main CLI surface
- **Code:** all in-scope non-test `runtime/cli/**/*.sh` (lib, spec, setup, kpi, ops, rules) carry `set -euo pipefail` (the strict-mode scan returned zero missing). Unquoted command-position `$var` (SC2086) and single-bracket `[ -f $var ]`-style unquoted tests returned zero hits, so quoting is clean. `validate.sh` (the authoritative gate) returns exit 0/1/2/3.
- **Standard:** `sk-code-opencode/references/shell/quality-standards/overview-and-priority-blockers.md` §2 P0 (shebang, strict mode, double-quoted variables, file header).
- **What is present:** A strong conforming baseline. The non-portable-constructs P2 (bash-specific `local`, `[[ ]]`) is expected since the shebang is `#!/usr/bin/env bash`; the whole surface is Bash by design.
- **Severity:** Baseline (no finding).

## Sources Consulted
- `runtime/cli/setup/check-prerequisites.sh:74`
- `runtime/cli/spec/archive.sh:299`, `runtime/cli/spec/create.sh:894`, `runtime/cli/setup/rebuild-native-modules.sh:23`
- strict-mode / unquoted-variable / single-bracket scans across `runtime/cli/lib|spec|setup|kpi|ops|rules`
- `sk-code-opencode/references/shell/quality-standards/validation-security-and-shellcheck.md` §2,§5,§7

## Assessment
- **newInfoRatio:** 0.55
- **Novelty justification:** The `eval`-of-command-substitution in `check-prerequisites.sh` and the three SC2164 `cd` sites are new; the strict-mode and quoting baseline is a confirming negative.
- **Confidence:** High — the baseline scans are mechanical; the `eval` and `cd` sites are direct reads. Given `set -e` is on, the `cd` sites are P2 rather than P0.

## Reflection
- What worked: Distinguishing "eval of user input" (a real P0) from "eval of an internal function's output" (P2, code smell) kept the finding honest.
- What failed: The scripted SC2086 scan is a heuristic; a real ShellCheck run would be the ground truth, but that tool is out of scope for this lineage.
- Ruled out: Flagging the `cd` sites as P0 — they are covered by `set -e`, so they are a style concern, not a correctness break.

## Recommended Next Focus
Angle 1 (repeat) — revisit header/banner conformance on the remaining un-inspected `runtime/cli` sub-surfaces (setup, kpi, ops, api, hooks) to confirm the census holds beyond `rules/` and `spec/`.
