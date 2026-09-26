# Pi compatibility

[Back to the main README](../README.md) · [Documentation index](README.md)

## Current compatibility target

Pi Skill Orchestrator `0.1.26` targets Pi `0.85.1` and the current public extension APIs audited on 2026-09-15.

It was audited on 2026-09-15 against Pi upstream `main` at commit `60e7e76bd7ea25cad1dd6f3f1ce0d18814a42759`, including the public extension APIs for tool-result rewriting, provider-request rewriting, active-tool control, deferred-tool loading, and session-shutdown cleanup.

At that audit point, the Pi coding-agent package still reported version `0.85.1`, but upstream `main` contained unreleased changes.

## Public APIs used

The extension uses Pi public package roots. It does not import unsupported deep internal paths.

Pi-provided modules are peer dependencies:

```json
{
  "@earendil-works/pi-coding-agent": "*",
  "@earendil-works/pi-tui": "*",
  "typebox": "*"
}
```

Pi's package documentation recommends this pattern so the running Pi installation supplies its matching core modules.

## Runtime assumptions

The extension depends on these Pi behaviors:

- extensions can register commands and model tools;
- extensions can intercept raw input before native skill expansion;
- extensions can modify the system prompt in `before_agent_start`;
- `systemPromptOptions.skills` exposes the skill records used to build the prompt;
- Pi skill commands expose public `sourceInfo` metadata;
- Pi TUI supports autocomplete provider wrapping and centered custom overlays;
- model-facing tools must provide parameter schemas;
- `tool_result` handlers can replace tool-result content before later model turns;
- `before_provider_request` handlers can inspect or replace the serialized provider payload;
- extensions can inspect configured tools and change the active tool set at runtime with `getAllTools()`, `getActiveTools()`, and `setActiveTools()`;
- `session_shutdown` runs for quit, reload, new-session, resume, and fork transitions, so temporary active-tool changes can be restored before replacement.

## Skill catalog assumption

The current Pi skill prompt uses an `<available_skills>` block. Each model-visible entry contains a name, description, and location.

Skill Orchestrator has tests for that current format and for conservative fallback detection.

If Pi changes this format, the extension must be audited before claiming compatibility with that new Pi release.

## After a Pi update

Run:

```bash
npm test
npm run check
```

Then run a real Pi smoke test:

```bash
pi -e ./src/index.ts
```

Verify these behaviors:

1. `/skill:` autocomplete still works.
2. `/skill-profile:` autocomplete still works.
3. A group can be activated without bulk loading member bodies.
4. `skill_search` returns bounded metadata.
5. Global fallback can find an outside-scope skill without changing scope.
6. A selected skill loads its dependency closure.
7. Pi's eager all-skill catalog is not left in the model system prompt.
8. `/token-saver on` exposes `token_retrieve` and `token_tool_search`, while `/token-saver off` removes them from the active model-tool set.
9. A compacted tool result remains recoverable exactly, and explicit machine-readable output requests remain unchanged.
10. Deferred non-core tools can be found and activated through `token_tool_search`.
