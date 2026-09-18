# Iteration 001: Dual-root resolution

**Executor.** gpt-5.6-luna, reasoning max, service tier fast, read-only sandbox.

## DR-001 Directory-only root selection misclassifies the legacy layout

- **Severity:** P1
- **File:** `.skilled/scripts/git-hooks/pre-commit:331-333`
- **Trigger:** A legacy checkout has a placeholder `.skilled/` directory but the authored tree and route files under `.opencode/`; a routing file is staged.
- **Consequence:** The hook selects the empty placeholder, derives runtime paths under `.skilled`, then rejects the commit for missing route manifests at lines 411-418.
- **Evidence:** The base tree contains only a `.skilled` placeholder, while route modules exist under `.opencode`. The root check uses `-d`, not the sentinel file used by `_in_toolchain_repo`.
- **Fix:** Select the root by `skills/system-spec-kit/SKILL.md` existence, trying `.skilled` before `.opencode`.
