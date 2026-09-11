# sk-vision host adapters

## 1. OVERVIEW

The skill drives four coding hosts. Each reaches the same runtime through the strongest mechanism its host actually supports, and the skill owns the source for every adapter it has.

| Host | Attach model | Source in `hooks/` | Host load path |
|------|--------------|--------------------|----------------|
| **OpenCode** | in-process JS plugin with `/vision` hook | `opencode/sk-vision.ts` (built to `sk-vision.js`) | `.opencode/plugins/sk-vision.js` → symlink |
| **Pi** | in-process TS extension with hidden tools and `/vision` prompt | `pi/sk-vision.ts` | `.pi/extensions/sk-vision.ts` → symlink |
| **Devin** | lifecycle hook that injects evidence at prompt time | `devin/sk-vision.mjs` | `.devin/hooks.v1.json` → `UserPromptSubmit` |
| **Cursor** | the built CLI, invoked by a command and a rule | no adapter source; `cursor/vision-rule.md` carries the instruction | `.cursor/commands/vision.md` and `.cursor/rules/sk-vision.md` |

The three adapter sources are mirrored into the shared hook hub at `.opencode/hooks/sk-vision/{pi,opencode,devin}` as per-file symlinks back here, so the fleet sees every host's entry in one place.

Claude Code has no sk-vision integration and gains none here.

---

## 2. WHY THE FOUR HOSTS DIFFER

The split is not in-process against out-of-process. It is what each host's extension surface can actually deliver.

**OpenCode and Pi** expose in-process plugin APIs, so their adapters register tools and hooks directly inside the host.

**Devin** has no plugin API but does deliver lifecycle hooks. `UserPromptSubmit` accepts `additionalContext` in the `hookSpecificOutput` envelope, so the adapter can analyze an image and place the evidence in the turn before the model reads it. That makes Devin the second host after OpenCode where vision is *injected* rather than requested.

**Cursor** has neither. It registers hooks, but a live probe against build `2026.09.02-c22c1a3` confirmed that `beforeSubmitPrompt` is never delivered, with a `sessionStart` positive control firing on the same runs. The two spec-kit hooks registered on that event are dormant for the same reason. Cursor therefore cannot receive injected evidence at all, and reaches vision by running the CLI at `../vision-runtime/dist/vision-cli.js`, driven by its `/vision` command and its always-apply rule.

> **The consequence worth stating plainly.** On OpenCode and Devin the evidence is there whether or not the model would have asked for it. On Cursor and Pi the call has to be made. Nothing in a command or a rule can compel it, which is why the Cursor rule says so in its own text rather than implying a guarantee it cannot give.

An earlier design gave Cursor and Devin a shared MCP stdio server. It was retired: Cursor's registration had already been removed, and Devin's permission allowlist never granted the `mcp__sk-vision__*` namespace, so the one host still registering the server could not call it in the mode this repository dispatches in.

---

## 3. COMMAND-GATED VISION

The default posture is opt-in and idle. No host auto-inspects an attached image because of a normal message.

- **OpenCode**: `/vision <question>` runs in the `command.execute.before` hook. It fetches the latest session image, injects a `<SK-VISION COMMAND>` evidence block and tears the runtime down after the call. Bare `/vision` returns scene, caption and OCR for the latest image.
- **Pi**: `/vision <question>` drives the hidden `sk_vision_inspect` tool. Bare `/vision` asks in the conversation or returns a full read, because a prompt file cannot open a UI input box. Each call opens a fresh runtime and tears it down afterward. `SK_VISION_AUTOINSPECT=1` restores visible tools and legacy auto-inspect.
- **Devin**: no command surface and none needed. The hook fires on a prompt naming an image path that resolves on disk, and stays silent otherwise, so it never spins a GPU on a filename mentioned in passing.
- **Cursor**: `/vision <image-path> [question]` runs the CLI. The path is required, because the CLI cannot see the conversation.

### Devin hook behavior

Every path fails open. A malformed payload, a disabled kill-switch, an unbuilt runtime, a prompt naming no image, or any error resolves to an empty response: never a block, never an error surfaced into the session.

Disable it with `SYSTEM_SK_VISION_DISABLED=1`, or every hook in this repository with `SYSTEM_HOOKS_DISABLED=1`.

Its timeout is 60 seconds. A warm model answers well inside that. A cold first load downloads roughly 3.9 GB of weights and will exceed it, and the host skips a timed-out hook, so the first image-bearing turn after a cold start arrives without evidence. Later turns are fast.

---

## 4. FRESH-CHECKOUT NOTE

`vision-runtime/dist/` and `opencode/sk-vision.js` are gitignored build artifacts. Run `bun run scripts/build.ts` in `vision-runtime/` before the OpenCode plugin, the Devin hook or the Cursor CLI can work. Until then the Devin hook resolves nothing and stays silent by design, rather than raising on every turn.
