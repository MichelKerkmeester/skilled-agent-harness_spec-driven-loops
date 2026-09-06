# Iteration 3: Error Handling & Exit-Code Contract

## Focus
Angle 3 — assess swallowed exceptions, exit codes off the 0/1/2/3 contract, and inconsistent stdout/stderr in CLI entry points across `runtime/cli` and `runtime/hooks`.

## Findings

### F3.1 [P1] Top-level promise rejection swallowed without logging in a hook entry point
- **Code:** `runtime/hooks/cursor/completion-evidence-response.mjs:65` — `main().catch(() => {});`
- **Standard:** `shared/references/universal/code-quality-standards.md` §3 P0 #4 "No silent failures — exceptions either surface to the caller or are logged with enough context to debug"; TS `tsdoc-errors-and-async.md` §4 (handle rejection, never swallow).
- **What is present:** The hook's entry exports invoke `main()` and discard any rejection entirely. A payload parse, IO, or hook-flags failure is invisible to the operator and to the process exit status, defeating the "completion-evidence" purpose of the hook.
- **Severity:** P1 (silent-failure block category, though it does not break a documented contract).
- **One-line fix:** **judgment-required** — log the rejection (e.g., `main().catch((err) => console.error('[completion-evidence]', err))`) and/or propagate a non-zero exit.

### F3.2 [P2] Exit codes 20 / 26 / 64 outside the documented shell exit-code contract
- **Code:** `runtime/cli/doctor.sh:43` (`exit 20`), `:51` (`exit 26`), `:69` (`exit 26`); `runtime/cli/validate-command-tree-parity.sh:34` (`exit 64`).
- **Standard:** `sk-code-opencode/references/shell/quality-standards/validation-security-and-shellcheck.md` §3 "Exit Code Standards" (0 success, 1 general error, 2 misuse, 126, 127); §3 "P1 Exit Codes Documented".
- **What is present:** `doctor.sh` returns 20/26 for its own branch conditions and `validate-command-tree-parity.sh` returns 64 (a sysexits `EX_USAGE` value). None of 20/26/64 is in the documented table, and neither script's header documents them. There is no shared `exit` helper, so the codes are ad hoc.
- **Severity:** P2 (no correctness break; maintainability/debugging cost — a caller cannot infer the error class from the code).
- **One-line fix:** **mechanical** — either map these onto the documented 0/1/2/7 range or document each non-standard code in the script header's `EXIT CODES:` block.

### F3.3 [Conforming] Bulk of shell exit-path usage stays on the documented contract
- **Code:** census of `exit` statements across in-scope `runtime/cli/*.sh` — 124 `exit 1`, 49 `exit 0`, 47 `exit 2`, 6 `exit 3`; only the 5 off-contract cases in F3.2 sit outside `{0,1,2,3}`.
- **Standard:** same §3.
- **What is present:** The 0/1/2/3 vocabulary that `validate.sh` (exit 0/1/2/3 semantic, per the root-doc Completion Verification Rule) relies on is honored by the large majority of entry points; the off-contract cases are localized to `doctor.sh` and the parity script.
- **Severity:** Baseline (no finding beyond F3.2).

## Sources Consulted
- `runtime/hooks/cursor/completion-evidence-response.mjs:65`
- `runtime/cli/doctor.sh:43,51,69`
- `runtime/cli/validate-command-tree-parity.sh:34`
- `sk-code-opencode/references/shell/quality-standards/validation-security-and-shellcheck.md` §3
- `shared/references/universal/code-quality-standards.md` §3 P0#4
- `sk-code-opencode/references/typescript/quality-standards/tsdoc-errors-and-async.md` §4

## Assessment
- **newInfoRatio:** 0.7
- **Novelty justification:** The swallowed `main().catch` and the 20/26/64 exit-code outliers are new; the conforming exit census is a useful baseline.
- **Confidence:** High for F3.1/F3.2 (direct reads); F3.3 is a mechanical count.

## Reflection
- What worked: A census of `exit N` across hook and CLI entry points exposed the off-contract codes immediately, and the empty-`catch` scan surfaced the swallowed rejection.
- What failed: The `catch (e) {}` empty-body scan returned nothing because the remaining swallows in the codebase are `try {…} catch {}` blocks (opt-in feature-flag guards in `runtime/hooks/{claude,codex,devin}/completion-evidence-stop.cjs`) rather than empty parameterized catches.
- Ruled out: Treating the `try {…} catch {}` feature-flag guards (`runtime/hooks/claude/completion-evidence-stop.cjs:39` and siblings) as P0 — they are deliberate default-off guards, though they emit no log and are a P2.

## Recommended Next Focus
Angle 4 — module-boundary breaks: cli importing dist paths, lib importing cli, circular edges, shared depending on runtime.
