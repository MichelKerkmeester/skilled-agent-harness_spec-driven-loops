# OpenCode 2 official release check (2026-10-18)

The operator reported that OpenCode 2 is officially released. Checked against npm and https://opencode.ai/v2/docs/.

## Versions (npm dist-tags, read 2026-10-18)
- @opencode/cli latest = 2.0.32, published 2026-10-16T22:14:49Z. This is the packet's v2 target, so the target is the released version.
- @opencode/plugin latest = 2.0.32.
- opencode-ai latest = 1.19.3, @opencode-ai/plugin latest = 1.19.3. The v1 package was not moved to 2.x, so v1 users are not upgraded by a v1 package update.

## What the official docs confirm
- One default export can serve both versions: `{ ...Plugin.define({ id, setup }), async server() }`. v1 calls server(), v2 reads id and setup() and ignores server() (/v2/docs/build/plugins, /build/plugins/migrate-v1). This is parent decision D1 and the phase 2 bridge.
- "The V1 object form is supported in OpenCode 1.18.29" and newer. That is the v1 floor.
- Tool execute returns `{ content }`, with a JSON Schema input (phase 2 decision 9).
- v2 auto-discovers .js and .ts files in any .opencode/plugins/ directory. The v2 config key is `plugins` (D2 keeps it out of the shared opencode.json).
- The migration table: event -> ctx.event.subscribe, tool.execute.before/after -> ctx.tool.hook, experimental.chat.system.transform -> session.hook("context"), chat.message -> session.hook("prompt"), command.execute.before -> a command transform, permission.ask -> ctx.permission.hook("evaluate"), tool map -> ctx.tool.transform. "this shape does not translate hooks automatically": the repo's bridge does that translation itself.
- No v2 equivalent for: the `$` shell helper, the mutable global config, experimental.compaction.autocontinue, experimental.provider.small_model, experimental.text.complete, and a global command.execute.before.

## New for later phases
- Phase 7 (install guidance): the official v2 channels are `curl -fsSL https://opencode.ai/v2/install | bash`, `brew install anomalyco/tap/opencode-v2`, `npm install -g @opencode/cli`, bun, pnpm, yarn, Vite+, AUR `opencode-beta`, and `mise use -g opencode`. mise 2026.10.9 or later now installs OpenCode 2 under that name ("older versions install OpenCode 1"), so a mise user can be moved to v2 without asking. The v2 binary is named `opencode`, the same as v1, so side-by-side still needs a renamed launcher such as `opencode2`.
- Phase 3 open lead: the migration guide shows a v2 subscription checking `session.idle`, and the v2 schema declares that type (event-manifest.d.ts:5971), but the live re-probe saw only session.execution.succeeded on a real turn. The bridge alias must not double-fire if a v2 flow does emit session.idle.
- Phase 10 and 11: the public claim (D8) can name 2.0.32 as the released v2 version as of 2026-10-16.
