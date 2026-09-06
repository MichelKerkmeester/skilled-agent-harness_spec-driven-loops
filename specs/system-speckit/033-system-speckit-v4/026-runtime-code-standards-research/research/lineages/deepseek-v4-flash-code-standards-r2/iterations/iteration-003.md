# Iteration 3: runtime/cli/rules/*.sh and runtime/cli/spec/*.sh (shell)

## Focus
Priority surface 3 — `runtime/cli/rules/*.sh` and `runtime/cli/spec/*.sh` against the shell standards: exit codes, quoting, sourcing, documented flags vs parsed flags, dead helpers.

## Findings

### F3.1 [P2] Dead helper `log_suggest()` in `spec/progressive-validate.sh`
- **Code:** `runtime/cli/spec/progressive-validate.sh:172` (`log_suggest()`).
- **Standard:** `shell/quality-standards/overview-and-priority-blockers.md` §2 (all defined functions should serve a purpose; no dormant code) and §4 (shell scripts should be clean of unused helpers).
- **What is present:** `log_suggest()` is defined to print a `[SUGGEST]` line behind JSON/quiet guards. Repo-wide grep (`.opencode` `*.sh`) returns only the definition — it is never invoked by the script and nothing sources it externally. The sibling functions in the same file (`log_fix`, `log_verbose`) are all called; `log_suggest` is not.
- **Severity:** P2 — dormant helper, low behavioral risk, but a maintenance/dead-code cost.
- **One-line fix:** **mechanical** — delete `log_suggest()`; if a suggestion path was intended but not wired, file it separately rather than leaving a dead function.

### F3.2 [P2] Inconsistent standalone-entry pattern across the `rules/` family, with misdocumented exit-code contract
- **Code:** `runtime/cli/rules/check-template-source.sh:100-103` and `runtime/cli/rules/check-toc-policy.sh:71` use `if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then run_check "$@"; fi`; `runtime/cli/rules/check-files.sh:20-51` (and ~10 sibling rules) define `run_check()` and then end with `# Exit codes: 0 - Success` with no bottom invocation.
- **Standard:** `shell/quality-standards/overview-and-priority-blockers.md` §3 "Exit Codes Documented" (a documented exit-code contract should be truthful) and `universal/code-quality-standards.md` §3 P0#4 (no silent failures).
- **What is present:** Only a minority of rules guard a standalone `run_check "$@"` behind `BASH_SOURCE[0] == "$0"`. The rest are source-only entry points, yet many still print `# Exit codes: 0 - Success`. Running one of the unguarded rules directly (`bash rules/check-files.sh`) sources nothing, invokes `run_check` never, and returns 0 — a silent no-op that nonetheless declares an exit-code contract.
- **Severity:** P2 — an inconsistent invocation pattern with a misleading exit-code comment; not a correctness break because the supported path is the sourced loader.
- **One-line fix:** **judgment-required** — either add the `BASH_SOURCE[0] == "$0"` guard to every rule implementing `run_check` (making standalone runs honest), or drop the `# Exit codes:` comment from the source-only scripts so no contract is implied.

## Sources Consulted
- `runtime/cli/spec/progressive-validate.sh:172,165-183`
- `runtime/cli/rules/check-template-source.sh:100-103`
- `runtime/cli/rules/check-toc-policy.sh:71`
- `runtime/cli/rules/check-files.sh:20-51` (tail)
- `runtime/cli/rules/*.sh` (strict-mode and invocation census: 28 rules files)
- `runtime/cli/spec/*.sh` (14 spec files)
- `runtime/cli/spec/calculate-completeness.sh:8,82-93,546-553` (documented vs parsed flags)
- `runtime/cli/spec/archive.sh:7,59-62,307-310`
- `sk-code-opencode/references/shell/quality-standards/overview-and-priority-blockers.md`
- `sk-code-opencode/references/shell/quality-standards/validation-security-and-shellcheck.md`
- `shared/references/universal/code-quality-standards.md`

## Assessment
- **newInfoRatio:** 0.4
- **Novelty justification:** Both items are new; the shell baseline (strict mode, quoting, sourcing, exit codes) is largely a confirming pass.
- **Confidence:** High for `log_suggest` (repo-wide zero references). Medium for the standalone-entry inconsistency — it is a deliberate source-or-standalone design, but the unguarded scripts' `# Exit codes: 0` comment is misleading. Confirmed-negatives across all 42 scripts: every one has `set -euo pipefail`; no bash `exit`/`return` outside 0/1/2/126/127; every `source` path is double-quoted; no unquoted command-position variable found; `calculate-completeness.sh` and `archive.sh` document exactly the flags they parse. (The `rc=20/21` codes seen in `check-graph-metadata-child-drift.sh` belong to an inline Node subprocess and are documented internal contract codes, not a bash exit-code deviation.)

## Reflection
- What worked: A strict-mode + source-quote + exit-code census over the whole rules/spec surface gave a clean confirming baseline instead of anecdotes; the function-definition-vs-reference pass exposed `log_suggest` as a genuinely uncalled helper.
- What failed: The "dead helper" heuristic flagged `run_check` in every rules file, but that is the loader-contract entry point called by `validate.sh`/tests, not dead code — ruled out as a false positive.
- Ruled out: Reporting the `rc=20/21` Node subprocess exit codes as a shell exit-code deviation — they are the scanner's documented internal contract, not the bash script's exit codes.

## Recommended Next Focus
Iteration 4 — `runtime/hooks/lib`, `runtime/hooks/pi` and the spec-gate `.mjs` adapters across all runtimes: parity between runtimes, swallowed errors, path handling, hook conventions.
