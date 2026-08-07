# Iteration 18: adjacent routing/manifest surfaces — regressions

> dimension: regression | model: gpt-5.6-sol effort=high tier=fast | sandbox: read-only
> status: 0 | timedOut: false

NO ISSUES FOUND in this focus.

Verified:

- All `hub-router.json`, `mode-registry.json`, and `leaf-manifest.json` files parse successfully.
- `mcp-tooling` and `sk-code` manifest regeneration is byte-identical.
- `parent-skill-check.cjs` passes for `mcp-tooling`, `sk-code`, and `sk-prompt` with zero warnings; all route and leaf targets resolve.
- The ClickUp manifest rename points to the existing `references/install-guide.md`.
- Compiled routing selects `mcp-click-up` and `prompt-models` correctly; advisor routing still surfaces `sk-prompt` after removing the nested descriptor.
- Both changed consumer scripts pass `node --check`.

Adjacent observations: `sk-code` compiled routing currently returns the expected legacy-authority sentinel, so its registry was verified through manifest regeneration and the canonical parent checker.
