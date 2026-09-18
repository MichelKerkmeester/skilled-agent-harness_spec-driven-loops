# Iteration 008: Consumers and other machines

**Executor.** gpt-5.6-luna, reasoning max, service tier fast, read-only sandbox.

## CONSUMER-001 Legacy-only consumers bypass OpenCode dispatch safeguards

- **Severity:** P1
- **File:** `.opencode/plugins/cli-dispatch-audit.js:80`
- **Trigger:** A consumer exposes only `.opencode`; the plugin resolves that consumer root, then looks for rules under `<consumer>/.skilled/...`.
- **Consequence:** `readHardRules()` returns an empty rule set for the missing path, so blocking dispatch rules never run. The same pattern affects Git preflight and Codex watchdog paths.
- **Evidence:** Dual-root discovery accepts `.opencode` at `.skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs:109-119`; the plugin then hard-codes `.skilled` at lines 58 and 80. Missing rule files fail open at `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:60-66`. Old-only consumers are explicitly supported by `.opencode/README.md:40-45`.
- **Fix:** Return the selected source-root spelling from the resolver and use it for these plugin-relative paths.

## CONSUMER-002 Legacy-only consumers make advisor cache signatures ignore skill changes

- **Severity:** P2
- **File:** `.opencode/plugins/system-skill-advisor.js:337`
- **Trigger:** OpenCode supplies an old-only consumer directory as `ctx.directory`, with skills available under `<consumer>/.opencode/skills`.
- **Consequence:** The advisor hashes `<consumer>/.skilled/skills`, records a stable “missing” marker, and can reuse cached advice after linked skills change.
- **Evidence:** `ctx.directory` becomes `projectDir` at `.opencode/plugins/system-skill-advisor.js:949-953`; the signature hashes only `.skilled` at lines 337-350; the result remains cacheable at lines 1104-1127. The base-to-tip diff changed this path from `.opencode/skills` to `.skilled/skills`.
- **Fix:** Resolve the actual selected source root before building the signature, and mark the result uncacheable if neither spelling exists.
