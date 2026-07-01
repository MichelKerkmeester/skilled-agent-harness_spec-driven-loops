# Iteration 6 — KQ5 plugin: resolve the fail-closed residual, surface a build landmine

**Focus:** KQ-OPUS-6 — `sonnet-critical` left open "whether a plugin can actually reject (not just rewrite) a dispatch is unconfirmed from the type surface alone." Resolve it from the plugin SDK type, and check for implementation risks neither prior lineage named.

## What was read (this iteration)

- `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:235-271` — `tool.execute.before`, `tool.execute.after`, `experimental.chat.*.transform` hook signatures
- `.opencode/plugins/README.md:28, 48-50` — default-export rule, plugin inventory (mk-goal, mk-spec-memory)

## Finding 1 — Fail-closed is possible only by throwing; host semantics undetermined

The hook signature:

```ts
"tool.execute.before"?: (input: { tool: string; sessionID: string; callID: string; },
                         output: { args: any; }) => Promise<void>;
```

[SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:235-241]

Two facts fall straight out of the type:
1. Return type is `Promise<void>` — the hook **cannot return a deny/allow verdict**. There is no `{ block: true }` or boolean channel. So a clean "reject this dispatch" API does not exist.
2. `output.args` is `any` and mutable — the hook **can rewrite the dispatch arguments** (e.g. inject or correct a `Deep Route:` header inside the Task prompt before the tool runs).

Therefore fail-closed rejection is achievable **only by throwing** from the hook. Whether a thrown `before`-hook (a) hard-aborts the tool call, (b) surfaces an error the model sees and may retry around, or (c) aborts the whole turn is **not determinable from the type surface** — the type says `Promise<void>`, and the host's handling of a rejected promise is unspecified here. So the precise answer to sonnet-critical's residual is: **rejection is possible-by-throw, but its user-visible semantics are host-dependent and must be smoke-tested on the installed OpenCode version before relying on fail-closed** (echoing gpt-fast-high's open question `:184`, now with the exact mechanism). This is sharper than "unconfirmed." It also re-confirms the detection-only boundary: because `subagent_type` is normalized to `"general"` upstream (predecessor root cause), the hook can inspect/rewrite the *prompt args* or throw, but cannot bind a hard custom-agent identity — KQ5 stays detection/prompt-enforcement, not hard identity.

## Finding 2 — A default-export build landmine that would silently disable the plugin

`README.md:28` (load-bearing warning): "OpenCode treats *every* export of a plugin module as its own plugin and invokes each one. A stray named export … is loaded as a plugin, throws when invoked, and silently drops the **entire file** — including its real default plugin, which then never registers its tools or hooks." So a KQ5 enforcement plugin authored with a helper `export function` or `export const` beside its `export default` would **silently fail to register the `tool.execute.before` hook** — no error, just no enforcement. Neither prior lineage nor sonnet-critical surfaced this. The correct reference pattern is `mk-goal.js` (`README.md:49`): default-export only, test surface hung off the default as a property (`MkGoalPlugin.__test`). This is a concrete acceptance criterion for the KQ5 phase: smoke-test that the hook actually fires (not just that the file loads) from both project root and any symlinked workspace (`README.md:38`).

## Finding 3 — Home-location note

Both prior lineages proposed `system-skill-advisor` as the home; gpt-fast-high alternatively proposed a standalone `.opencode/plugins/mk-deep-route-guard.js` (`gpt-fast-high/research.md:77,87`). The `tool.execute.before` hook lives in the `.opencode/plugins/*.js` auto-load surface regardless of which skill "owns" the metadata, so the plugin FILE must be a plugin entrypoint under `.opencode/plugins/` (per `README.md:24-36` auto-load); `system-skill-advisor` can own the registry/route metadata the plugin reads, but the executable hook is a plugins-dir entrypoint. This reconciles the two prior proposals: metadata home = `system-skill-advisor`; executable hook file = `.opencode/plugins/`.

## Ruled out this iteration

- Treating plugin fail-closed capability as fully "unconfirmed" — RULED OUT; resolved to "possible-by-throw, host-semantics-undetermined, must smoke-test."
- Treating the plugin's home as a free choice between `system-skill-advisor` and `.opencode/plugins/` — RULED OUT; the hook entrypoint must live under `.opencode/plugins/` (auto-load), metadata may live in the skill.

## Status

`insight` — resolves an open residual and adds a build-failure mode from direct type + README reading.

newInfoRatio: 0.70 — novelty: converts an "unconfirmed" residual into a precise mechanism-level answer, and surfaces a silent-disable build landmine plus a home-location reconciliation neither prior lineage nor sonnet-critical had.
