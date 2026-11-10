# Iteration 7: Third-party plugin migration

## Focus

Angle 7: one verdict per third-party Pi package in `.pi/PLUGINS.md` and `.pi/settings.json` —
does the harness already ship the capability natively, is there a harness plugin-market equivalent,
or is the package not relevant to dispatch?

## Actions Taken

- Read `.pi/PLUGINS.md` and the `.pi/settings.json` package list.
- Read the plugin-market guide.
- Checked the base bundle for native `todo`, `user-questions`, compaction and web tools.
- Checked the `llm-pi-ai` reference for cache and header controls, and the config catalog for a
  service-tier field.

## Findings

1. Six of the ten packages have a native equivalent already mounted by `dsh-base`: `todo_write`
   (`tool-todo`), the user-questions seam, compaction (`compaction-basic`, tool-result pruner, image
   offload), subagents plus the team task board, plan mode, and `web_fetch`/`web_search`
   (`tool-web`). No Pi package needs a line-by-line port.
   [SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:79-80]
   [SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:355-359]
   [SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:434-446]
   [SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:499-500]
2. `@juicesharp/rpiv-ask-user-question`: native user-questions exists, but a headless dispatch has
   no live approval or answer channel, so a structured questionnaire cannot be answered. Verdict:
   **drop for dispatch**, keep for interactive profiles.
   [SOURCE: dsh-src/packages/bundle/headless/README.md:100]
3. `@juicesharp/rpiv-todo`: `todo_write` is mounted in base and persists across turns and reopened
   sessions, with whole-list replacement and per-session ownership. Verdict: **native replacement**,
   no migration.
   [SOURCE: dsh-src/packages/todo/tool-todo/README.md:12]
4. `pi-blackhole`: the compaction half maps to `compaction-basic` plus the tool-result pruner and
   image offload; the observational-memory half has no native store. Verdict: **replace compaction,
   drop observational memory**; the session log is the durable record.
   [SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:355-359]
   [SOURCE: .pi/PLUGINS.md:30]
5. `pi-btw`: parallel side conversations map to `subagent`/`subagent_fork` plus the team task board,
   which share the checkout and keep intermediate traffic out of the parent conversation. Verdict:
   **native replacement**, no plugin.
   [SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:363-403]
   [SOURCE: dsh-src/packages/team/agent-team/README.md:12]
6. `pi-cache-optimizer`: cache behavior is route configuration, not a plugin — `cacheControlFormat`,
   `supportsLongCacheRetention` and profile `headers` cover prompt-cache markers and session
   affinity. The `.pi/models.json` affinity overlay becomes route `headers` or a compat field.
   Verdict: **native replacement by config**, no plugin.
   [SOURCE: dsh-src/docs/config-catalog.md:2194-2199]
   [SOURCE: dsh-src/packages/llm/llm-pi-ai/README.md:150]
7. `pi-fast-mode-w-subagent-support`: the config catalog has no `serviceTier` or `service_tier`
   field for a model route; the harness executor's `serviceTier` is an OpenCode-runner concept, not
   a dsh request control. Verdict: **not portable, drop for dsh** unless a specific gateway is shown
   to honor a header — `UNKNOWN` today.
   [SOURCE: dsh-src/docs/config-catalog.md:2031-2108]
   [SOURCE: .pi/PLUGINS.md:81]
8. `pi-plan-build`: native plan mode covers plan-then-approve in interactive profiles, but
   `exit_plan_mode` fails closed without an interactive review, so a headless dispatch cannot use it
   as a gate. Verdict: **native for interactive, prompt-phase pattern for headless**.
   [SOURCE: dsh-src/packages/plan/plan-mode/README.md:63]
9. `pi-claude-code-ui` and `pi-statusline`: rendering-only packages with no headless surface.
   Verdict: **not relevant to dispatch**, drop.
   [SOURCE: .pi/PLUGINS.md:68-79]
10. `pi-web-access`: `web_fetch` and `web_search` are native, and the shipped headless profile routes
    DeepSeek Search and Fetch through the DeepSeek model credential. PDF extraction, YouTube and
    local-video analysis have no native equivalent. Verdict: **partial native replacement**.
    [SOURCE: dsh-src/packages/bundle/headless/README.md:56]
    [SOURCE: .pi/PLUGINS.md:102]
11. The plugin market is not a Pi compatibility layer: dsh ships no index source, indexes list
    installable dsh bundles, and a Pi package is not a dsh bundle. Verdict for all ten: **no market
    path**; the market matters only as a future distribution channel for the repo's own bundle.
    [SOURCE: dsh-src/docs/user/guide/plugin-market.md:12]

## Ruled Out

- Porting any Pi package as a dsh plugin: none is a dsh bundle, and six capabilities already exist.
- Installing from the plugin market as a migration shortcut: Pi packages are not listed as dsh
  bundles.
- A service-tier plugin for `pi-fast-mode`: no request field exists to carry it.

## Dead Ends

- Searching for a `serviceTier` model-route field: the catalog exposes only executor-side service
  tier, not a model request control.

## Edge Cases

- Ambiguous input: "not relevant" is scoped to headless dispatch; the UI packages stay useful in Pi.
- Contradictory evidence: `pi-blackhole` claims unified compaction plus memory; the harness has the
  compaction half only.
- Missing dependencies: no configured provider, so no native replacement was exercised live.
- Partial success: verdicts are based on the shipped compositions and package contracts.

## Sources Consulted

- `.pi/PLUGINS.md:16-102`
- `.pi/settings.json` package list
- `dsh-src/packages/bundle/base/cordis.patch.yml:79-80,355-359,363-403,434-446,499-500`
- `dsh-src/packages/todo/tool-todo/README.md:12`
- `dsh-src/packages/team/agent-team/README.md:12`
- `dsh-src/packages/plan/plan-mode/README.md:63`
- `dsh-src/packages/bundle/headless/README.md:56,100`
- `dsh-src/docs/config-catalog.md:2031-2108,2194-2199`
- `dsh-src/packages/llm/llm-pi-ai/README.md:150`
- `dsh-src/docs/user/guide/plugin-market.md:12`

## Assessment

- New information ratio: 0.90 (nine new per-package verdicts, one that extends the plugin-market
  finding into a "no migration path" conclusion)
- Questions addressed: Angle 7 third-party plugin migration
- Questions answered: For each third-party Pi plugin, does the harness ship the capability natively, offer a market equivalent, or is it irrelevant to dispatch?

## Reflection

- What worked and why: checking the base bundle first turned the question from "port or not" into
  "already mounted or not", and six of ten were already mounted.
- What did not work and why: the plugin-market guide is about index files, not third-party
  compatibility; reading it confirmed the absence of a Pi path rather than a presence.
- What I would do differently: put the ten packages in a table before the research, so each verdict
  has a fixed slot and no package is dropped silently.

## Recommended Next Focus

Angle 8: MCP configuration, transports, per-dispatch enable/deny, and whether `.pi/mcp.json` and the
code-mode server can connect.
