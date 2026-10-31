# Iteration 002: Compatibility directory contract

**Executor.** gpt-5.6-luna, reasoning max, service tier fast, read-only sandbox.

## COMPAT-001 Per-entry plugin links cannot resolve the runtime SDK

- **Severity:** P1
- **File:** `.opencode/plugins:1`
- **Trigger:** A fresh checkout runs OpenCode, which installs dependencies under `.opencode/node_modules`.
- **Consequence:** Plugins resolve from `.skilled/plugins`, so `@opencode-ai/plugin/tool` is not found. `opencode-goal.js`, `system-skill-advisor.js` and `system-speckit-completion.js` fail to load.
- **Evidence:** `.opencode/plugins` points to `../.skilled/plugins`; `system-skill-advisor.js:24` imports the SDK. The recorded probe reports shape B not loading package-importing plugins at `runtime-symlink-resolution.md:34,49,58`.
- **Fix:** Make `.opencode/plugins` a real OpenCode-only directory, track its ESM package manifest, and make `.skilled/plugins` the compatibility symlink back to it.

## COMPAT-002 `SYNC.md` contradicts the runtime-owned `node_modules` contract

- **Severity:** P2
- **File:** `.opencode/SYNC.md:30`
- **Trigger:** An operator follows the surface inventory after OpenCode installs its runtime files.
- **Consequence:** `node_modules` is documented both as a symlink to `.skilled/node_modules` and as runtime-written untracked state, creating an impossible contract and obscuring the dependency failure above.
- **Evidence:** Lines 30 and 38 make contradictory claims. The requested tree tracks no `.opencode/node_modules`, package files or `.gitignore`.
- **Fix:** Remove `node_modules` from the symlink inventory and clarify that only `README.md` and `SYNC.md` are authored real files.
