---
title: Deep Research Strategy - OpenCode v1 and v2 dual compatibility
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
How to make the Skilled repo perfectly compatible with both OpenCode v1 (1.19.x) and OpenCode v2 (2.0.x) at the same time: every agent, command, plugin, skill, hook and config file, plus the cli-opencode skill dispatching to both versions and documenting side-by-side and single-version installs

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which plugin shape and API surface loads and behaves correctly on both OpenCode v1 (1.19.x) and v2 (2.0.x), and how do the 16 repo plugins port to it?
- [x] Can one set of agent, command, skill and opencode.json files serve both versions, and where must they diverge?
- [x] How must hooks, guards and plugin dependencies become version-aware so neither version breaks?
- [x] How should cli-opencode detect the installed version and dispatch to v1 and v2, with a full flag and subcommand matrix?
- [x] What install, verification and pinning guidance supports side-by-side and single-version setups, and which gaps stay irreducible?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any change: no skill, command, agent, plugin or config file outside this packet is edited during the run.
- Choosing between v1 and v2: the goal is both at once, not a migration off one.
- OpenCode internals beyond what the repo's surfaces depend on.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: the run continues to iteration 20; convergence is telemetry only (convergenceMode off).
- A credential or quota failure on the executor pauses the run via the pause sentinel until the operator fixes it.
- Operator pause via research/.deep-research-pause.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which plugin shape and API surface loads and behaves correctly on both OpenCode v1 (1.19.x) and v2 (2.0.x), and how do the 16 repo plugins port to it?
- Can one set of agent, command, skill and opencode.json files serve both versions, and where must they diverge?
- How must hooks, guards and plugin dependencies become version-aware so neither version breaks?
- How should cli-opencode detect the installed version and dispatch to v1 and v2, with a full flag and subcommand matrix?
- What install, verification and pinning guidance supports side-by-side and single-version setups, and which gaps stay irreducible?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Does v1 tolerate the `plugins` (plural) config key, and does v2 tolerate `plugin` (singular)? Does v1 load `.opencode/plugins/` or only `.opencode/plugin/`? (iteration 1)
- Is `sk-vision.js` a symlink, and does a flat glob follow symlinks on both hosts? (iteration 1)
- Does the 2.0.32 `@opencode/plugin` `.d.ts` match the preview bundled in 1.18.34, and what is the real `PluginContext` domain list? (blocking, P1) (iteration 1)
- Can one module default-export satisfy both contracts (function + `{id, setup}`), or is a two-file split mandatory? (iteration 1)
- Which of the 16 repo plugins touch `"shell.env"`, `"chat.*"`, `experimental.*`, or `PluginInput.$` — i.e. which hit irreducible gaps? (iteration 1)
- **Does v1 pass arguments to `server()`?** The probe recorded invocation but not arguments. Decide whether the v1 leg can share a single bootstrap function. (blocking for a uniform plugin template, P1) (iteration 2)
- **Does v2 actually accept an object literal with an extra `server` key at load time** — i.e. is the F5 shape validated structurally or by an `id`+`setup` shape test that tolerates extras? Iteration 1's probe says accepted; this iteration did not re-run it against `{id, setup, server}` explicitly per-key. (P0, cheap to settle) (iteration 2)
- **Does 2.0.32 still ship the `Reload` mixin** the preview used (`agent: AgentHooks & Reload`)? `registration.d.ts` was not re-read this iteration; the preview's `Reload` may have moved into `Registration` or vanished. (P2) (iteration 2)
- **Does v1 tolerate the `plugins` (plural) config key, and v2 the singular `plugin`?** Untouched this iteration. (P1) (iteration 2)
- **Is `.opencode/plugins/` discovery in v1 a union with the ancestor directories or an override?** Affects whether one nested install is visible from deeper cwds. (P1) (iteration 2)
- **Which of the 16 repo plugins touch `"shell.env"`, `"chat.*"`, `experimental.*`, or `PluginInput.$`?** Untouched — now scoped more precisely by F8. (P1) (iteration 2)
- **Is `sk-vision.js` a symlink, and does either host's discovery follow it?** Untouched. (P2) (iteration 2)
- Does the 2.0.32 `@opencode/plugin` `.d.ts` exist and match the migrate-v1 narrative (confirm the `session.hook` / `tool.hook` / `shell.hook` names and their event payload types)? Still the carried-forward P1 from iteration 1 — `npm pack @opencode/plugin@2.0.32` was **not** performed this iteration (the doc read answered the *names*, not the *types*). (iteration 3)
- Does v2's loader tolerate unknown top-level keys on a plugin definition (`__test`)? (F11) (iteration 3)
- Does `ctx.shell.hook("create.before")` exist as documented even though no repo plugin needs it? (doc-only, low priority) (iteration 3)
- `ctx.tool` / `ctx.session.hook("execute.after")` event shape: does it still expose the tool result body, and under which key? Blocks F9 item 3 and 3 plugins' `after` hooks. (iteration 3)
- `ctx.session.messages(...)` signature in 2.0.32 vs the v1 tree-request args used at `.opencode/plugins/system-spec-gate.js:90` and `.opencode/plugins/system-completion-sentinel.js:80`. (blocking for those two) (iteration 3)
- Where does `client.tui.showToast` live in v2 — `/build/plugins/cli` page unread; `ctx.tui` is **UNVERIFIED** and is the last blocker for `sk-vision`. (iteration 3)
- Is the host-derived replacement for `ORCA_OPENCODE_PLUGIN_API` (the env-gated selector) available in both hosts, or does each plugin need two entry files after all? (P1) (iteration 4)
- What is v2's real `run --format json` output, and does `--standalone` change it? (P1, blocked locally by F10) (iteration 4)
- Does v2 emit any compaction event at all, and what should replace `session.compacted` for skill-advisor's context re-injection and spec-gate's re-arm? (P0) (iteration 4)
- Can `session.idle` be derived reliably from `session.execution.*` for `system-completion-sentinel`, whose entire behaviour rests on that event? (P0) (iteration 4)
- Which v2 event scheme is current — `session.next.*` / `permission.v2.*` or `session.execution.*` / `form.*` — and does 2.0.32 emit both? (P1) (iteration 4)
- Does v2's CLI still load **flat** `.opencode/plugins/*.js`, or only the documented per-plugin directories? (blocking the layout decision; P0) (iteration 4)
- Does v1 forward unknown frontmatter keys to the model as provider `options`? (`options` resolved to `{}` for `markdown`, which had no unknown keys — inconclusive by construction.) (iteration 5)
- Does 2.0.32 still expose `hidden`/`color`/`steps` in `/api/agent` responses when set, or only in the input schema? (iteration 5)
- Does v1 tolerate a v2-shaped `permissions:` list, or unknown frontmatter keys such as `steps` / `hidden` / `color` / `disabled` — strip silently, ignore, or misread? (iteration 5)
- Does v2 accept `mode: all` for `markdown`, or coerce it? (iteration 5)
- All prior open questions from iterations 1-4 remain open (plugin default-export shapes, `plugins` vs `plugin` config key, v2 event scheme, `session.messages` signature, `ctx.tui`, v2 flat-plugin discovery). (iteration 5)
- Carried forward unchanged: v1/v2 `plugin` vs `plugins` config keys; `.opencode/plugins/` discovery unions; flat-file loading on v2; `sk-vision.js` symlink following; `run --format json` schema; `ORCA_OPENCODE_PLUGIN_API` host-derived replacement; the `Reload` mixin. (iteration 6)
- `session.idle`: is `session.execution.*` emitted by 2.0.32 at all, and is `session.wait` usable as a completion signal for `system-completion-sentinel`? (P0, runtime-only) (iteration 6)
- `SystemPart` shape — read from `@opencode/ai`, not yet read. Blocks writing any `context` mutation. (P1) (iteration 6)
- Is `ctx.session.hook("context")` invoked for compaction and title requests too (`SessionRequestKind`), and can appending to `system` there replace skill-advisor's re-injection on all four kinds? (P1) (iteration 6)
- Does the event stream carry the native event names at all, or is it RPC-frames only? Needs a live `GET /api/event` capture. (P0) (iteration 6)
- Does v2's loader accept extra top-level keys on the definition? Settle via `plugin.check` rather than a custom probe dir. (P0) (iteration 6)
- Which of the 16 plugins can reach a message cache populated from `context` early enough to matter, given that `context` fires only at request time? (P1) (iteration 6)
- Does v2 still support `` !`cmd` `` shell injection and `@path` includes in command templates? (iteration 7)
- Does v2 `run` expand a `/name args` message end-to-end, or is `POST /api/session/{id}/command` the (iteration 7)
- Does v2 tolerate unknown frontmatter keys (`argument-hint`, `allowed-tools`, `title`, (iteration 7)
- Does v2 scan `.opencode/command` (singular), `.opencode/commands` (plural), or both? v1 does both; (iteration 7)
- Why does v2 `/api/command` return no project commands while the earlier orchestrator probe saw 54? (iteration 7)
- Is `disabled: false` alone (without a sibling `permission:`) clean on v2, and is it dropped or (iteration 8)
- Does a v2 Ruleset's resource scoping and `deny`/`ask` survive the v1 `permission` map path, i.e. is (iteration 8)
- Does v2 accept `mcp.<name>` (the v1 MCP shape), or does a v1-only MCP server simply disappear on (iteration 8)
- Does v2 honour `plugin` (singular) at all, or drop it silently like v1 drops `plugins`? The v2 (iteration 8)
- All prior open questions from iterations 1-7 remain open (v2 event scheme, `session.messages` (iteration 8)
- **The skill leg of key question 2.** No skill has been probed on either host. Skills are `.md` + (iteration 8)
- **Q-R5 (new, P2):** Should `sk-communication` gain a `SKILL.md` or move out of `.skilled/skills` — a repo decision, not a host one, and out of scope for editing here. (iteration 9)
- Carried forward and untouched: v1/v2 `plugin` vs `plugins` config keys; `.opencode/plugins/` discovery unions; flat-file plugin loading on v2; `sk-vision.js` symlink following; `run --format json` schema; `ORCA_OPENCODE_PLUGIN_API` host-derived replacement; the `Reload` mixin; `session.idle`/`session.execution.*`; `SystemPart` shape; `context` hook `SessionRequestKind`; `plugin.check` extra-key tolerance; command-template `` !`cmd` `` injection and `POST /api/session/{id}/command`; `.opencode/command` vs `.opencode/commands` scan; why `/api/command` returned no project commands. (iteration 9)
- **Q-R1 (new, P1):** Which permission key gates skill invocation on each version — v2's `skill` action and the v1 equivalent — and do they accept the same values? Read `opencode.json`'s resolved `permission` block on both hosts, or the `permission` schema page on each docs tree. (iteration 9)
- **Q-R2 (new, P1):** The five ids in F3 that report `.claude/skills/…` on v1 only — what decides the winning root, and does it flip when `.claude/skills` is removed? Cheap test: temporarily point only one root at the tree in a scratch project (not this repo) and re-read both catalogs. (iteration 9)
- **Q-R3 (new, P2):** Does either version honour `disable-model-invocation: true`, and does `allowed-tools` restrict the model's tool surface or is it documentation only? The repo uses `allowed-tools` in 57 files, so a v2 change of meaning would be a behaviour break even though the catalog looks identical. (iteration 9)
- **Q-R4 (new, P2):** Is the `node_modules` leak (F5) suppressible by config on either version (an ignore/exclude key), or must the vendored tree move out of the skills root? (iteration 9)
- Does v2's loader accept `.opencode/plugins/*.js` flat, or require per-plugin directories? Now blocking (F7), not merely structural. (iteration 10)
- Does **v2 reject a bare top-level `--agent general`** as v1 does? Keep `no-bare-agent-general` advisory until probed. (iteration 10)
- Is `opencode run` on v2 safe against a **stale background service** (`--standalone` omitted)? If not, v2 needs a sibling rule to `stdin-redirect-required` whose subject is service attachment, not stdin. (iteration 10)
- All earlier carried questions remain open (plugin default-export shapes, `plugins` vs `plugin` key, flat plugin loading, `session.messages` signature, `ctx.tui`, v2 event scheme, `run --format json` schema). (iteration 10)
- Does `~/.opencode/hooks.json` behind `[features].opencode_hooks` exist on 1.19.3 or 2.0.32? Unverified either way; if it does, it is a third hook surface the repo does not use. (iteration 10)
- Does a `#` in an unquoted `provider/model#variant` survive shell comment handling in every shell the repo dispatches through (bash ok by word-position rule; zsh, fish and `sh -c` unverified)? If any shell truncates it, the argv pattern is itself unsafe and must be quoted in every documented recipe. (iteration 10)
- What is the v2 command-expansion route for a `/family:name args` prompt that replaces `run --command` — `POST /api/session/{id}/command` (iteration 7's carried question)? (iteration 10)
- Does **v1 1.19.3 accept `-m provider/model#variant`**, or does the `#variant` form fail there? Binds whether one model string can serve both. (iteration 10)
- **A10-Q4 (new, P2):** Does either host tolerate a tool definition whose `input`/`args` is a JSON Schema on v1, or a zod raw shape on v2 — i.e. is the F7 adapter strictly necessary, or does one shape already pass both validators? (iteration 11)
- **A10-Q2 (new, P0):** Does `@opencode-ai/plugin@2.0.32` still export the `./tool` subpath, and does it keep `zod` as a hoistable dependency? Requires `npm pack @opencode-ai/plugin@2.0.32` — still never performed (carried from iteration 1). (iteration 11)
- **A10-Q3 (new, P1):** Does 2.0.32's `PluginContext` add `tool`, and does it add `session`/`shell`/`tui`? 1.18.34 has none of the four (F4), so this decides whether the earlier carried questions on `ctx.session.messages`, `ctx.tui` and `ctx.shell` are answerable against the pin we ship. (iteration 11)
- **A10-Q1 (new, P0):** Does v2 install `.opencode/package.json` dependencies at all, and where? This is now the decisive input: if it does not, every bare import in a plugin is a crash on a v2-only install, and the import-free path is mandatory rather than preferred. (iteration 11)
- All previously carried questions remain open: v1/v2 `plugin` vs `plugins` config keys; `.opencode/plugins/` discovery unions and flat-file loading on v2; `sk-vision.js` symlink following; `run --format json`; `session.idle`/`session.execution.*`; `SystemPart` shape; `context` hook `SessionRequestKind`; event-stream native names; `Q-R1`–`Q-R5`; `-m provider/model#variant` on v1; `~/.opencode/hooks.json`. (iteration 11)
- Does the `context` session hook fire for `SessionRequestKind` compaction and title requests, and does appending to `context.system` there survive into the provider prompt? (carried from iteration 6, now the *primary* injection route for two plugins) (iteration 12)
- Do v1 and v2 both accept `.opencode/plugins/*.js` flat files, given `plugins` is now a *config array* on v2? The v2 config key is a plugin-enablement list, which makes the flat-directory discovery question more urgent, not less — iteration 10's P0 stands. (iteration 12)
- Is `shell.env` a real v2 hook? Absent from every grep; the string may be constructed at runtime. (iteration 12)
- Does **v1 1.19.3** accept `-m provider/model#variant`? The v2 half is now settled (F9); the dual-model-string decision needs the v1 half. (iteration 12)
- What exactly does `plugin.check` report for a definition carrying an extra top-level key? One call would settle the whole "uniform definition shape" question. (iteration 12)
- Can a v2 plugin **emit** `tui.toast.show`, or is `ctx.tui` required? (blocks `sk-vision`) (iteration 12)
- What is `Config.Plugin.Entry.package` resolved against — npm, a local path, or both? `It = w([string, {package, options}])` suggests a string form exists but does not say what it names. (iteration 12)
- Does v1's event stream include `session.execution.*` (so one subscriber can serve both), or is that family v2-only? New, and cheap to probe. (iteration 12)
- All earlier carried questions not listed above remain open. (iteration 12)
- **New (P2):** whether `assets/prompt-templates.md`'s six `--variant` invocations are rendered from a single template variable or hand-written six times (affects whether the change is one edit or six). (iteration 13)
- **New (P1):** does `--model provider/model#variant` survive on **v1 1.19.3** (i.e. can one model string serve both)? Requires a live run. (iteration 13)
- Carried unchanged: `plugins` (plural) vs `plugin` (singular) config tolerance on both versions; `.opencode/plugins/` discovery unions; flat-file plugin loading on v2; `sk-vision.js` symlink following; `run --format json` schema and whether `--standalone` changes it; `ORCA_OPENCODE_PLUGIN_API` host-derived replacement; the `Reload` mixin; `session.idle` / `session.execution.*`; `SystemPart` shape; `context` hook `SessionRequestKind`; `plugin.check` extra-key tolerance. (iteration 13)
- **New (P0):** v2 `run` positional-directory behaviour — `opencode run /path "<msg>"` (is `[<directory>]` consumed before `message...`?), `opencode /path run "<msg>"`, or neither. Blocks the entire v2 invocation shape in F6. Requires a live run. (iteration 13)
- **New (P0):** does `--dangerously-skip-permissions` exist on either `run` as a hidden flag? Help text cannot distinguish hidden from absent. Settle by `opencode run --dangerously-skip-permissions --help` exit status, or by reading the compiled argv schema in the binary — neither is available under the Pi guard. (iteration 13)
- **New (P2):** v2 `models` has no positional provider argument in its help — how does the auth pre-flight (`opencode models opencode-go`, `cli-reference.md:175`–`:178`) behave on v2? That pre-flight is a documented exit-code contract and v2 may not honour it. (iteration 13)
- **New (P1):** does v2 `run` expand a `/family:name args` message, or must `session.command` be used? Iteration 7's question, now sharpened by F3. (iteration 13)
- Carried unchanged: command-template `` !`cmd` `` injection and `.opencode/command` vs `.opencode/commands` scanning on v2; why `/api/command` returned no project commands; the `~/.opencode/hooks.json` + `[features].opencode_hooks` surface; `#`-in-model shell safety across zsh/fish/`sh -c`; skill permission key (`skill` vs v1 equivalent), skill root precedence, `disable-model-invocation`, `allowed-tools` meaning on v2, the `node_modules` leak. (iteration 13)
- **New (P2):** does either version dedupe a plugin file referenced twice (directory discovery **plus** `plugin` array entry)? F5 shows distinct ids both loading; same-id dedupe was not tested. (iteration 14)
- Carried and untouched: `plugins` (plural) tolerance on v1; `sk-vision.js` symlink following; `run --format json` schema; `ORCA_OPENCODE_PLUGIN_API` host-derived replacement; the `Reload` mixin; `session.idle` / `session.execution.*`; `SystemPart` shape; `context` hook `SessionRequestKind`; `plugin.check` extra-key tolerance; `-m provider/model#variant` on v1; v2 positional directory for `run`; `--dangerously-skip-permissions`; `models` positional provider; `#`-in-model shell safety; skill permission key / root precedence / `disable-model-invocation` / `allowed-tools` / `node_modules` leak; `~/.opencode/hooks.json`; `Q-R1`–`Q-R5`. (iteration 14)
- **New (P1):** can the client env be re-injected per request instead (an `/api` body field, `service set`, or project-local config)? If not, every `AI_SESSION_CHILD`-based rule is unusable on v2 without `--standalone`. (iteration 14)
- **New (P1):** v1's local plugin discovery with id-tagged files — the v1 legs died on F3 before load, so "which two of the four layouts v1 picked" is still unknown. Cheap test: re-run in the probe dir with `OPENCODE_DB` unset. (iteration 14)
- **New (P0):** under `run` against an already-running daemon, which env do plugins see — the daemon's or the client's? F2 answers this for `api`; `run` should match but was not probed. (iteration 14)
- **New (P0):** does `run --standalone` on v2 load the project plugin tree? `api --standalone` did not (F4), so the recommended dispatch mode rests on an untested assumption. Requires one live `run` with a trivial prompt. (iteration 14)
- Does v1 honour `OPENCODE_DB`, or is the variable v2-only? If v1 honours it, the `v2`-only mode's warning about a stale `opencode.db` applies symmetrically. Not probed. (P2) (iteration 15)
- Does `opencode upgrade --major` require an interactive confirmation, or does it act on `--force`/non-interactive? Determines how loud the warning must be. (P2) (iteration 15)
- Carried and untouched: `plugins` vs `plugin` config keys; `.opencode/plugins/` discovery unions and flat-file loading on v2; `sk-vision.js` symlink following; `run --format json` schema; `session.idle`/`session.execution.*`; `SystemPart` shape; `context` hook `SessionRequestKind`; `plugin.check` extra-key tolerance; `-m provider/model#variant` on v1; `~/.opencode/hooks.json`; `Q-R1`–`Q-R5`; v2 `run` positional-directory behaviour; hidden `--dangerously-skip-permissions`; `models <provider>` on v2. (iteration 15)
- Do `bun add -g` / `pnpm add -g` support the two-prefix side-by-side layout that npm does (`--prefix` equivalent)? Only npm was verified. (P2) (iteration 15)
- Does v2's per-user background service survive `opencode2 uninstall`? Was not probed — `--dry-run` prints a manifest, and no uninstall was run. (P2, needs a disposable machine) (iteration 15)
- **A14-Q3 (new, P2):** Does `POST /api/session/{sessionID}/prompt` return before the turn runs (true `promptAsync` parity), or does the inbox item only mean "queued for delivery"? `Session.Inbox.Delivery` is the field that decides it, and `opencode-goal`'s continuation gate (`.opencode/plugins/opencode-goal.js:2697`) depends on the answer. (iteration 16)
- **A14-Q4 (new, P2):** Does v2 pass the same client handle to a plugin, i.e. is `ctx.client` still the v1-shaped `createOpencodeClient` result on v1 and a `@opencode/client` promise surface on v2? If so, the v1 calls in F1 are *not portable by adapter* — they are portable by rewrite only. (iteration 16)
- **A14-Q1 (new, P0):** Is `Session.Message.Info[]` in `SessionMessagesResponse` really missing `parts`, i.e. must the sentinel and sk-vision fetch `GET /api/session/{sessionID}/message/{messageID}` per entry to get text and image parts? One live `GET /api/session/{id}/message` against 2.0.32 settles it. Blocks `system-completion-sentinel` and `sk-vision`. (iteration 16)
- **A14-Q2 (new, P1):** Which RPC method names does `POST /api/rpc/{rpcID}/{method}` accept, and does one of them deliver `tui.toast.show`? `Rpc.Input` is the only envelope; without the method vocabulary the toast gap stays open. Readable from `@opencode/client`'s `.d.ts` (`./dist/promise/api.d.ts`) or from a running server's plugin docs. (iteration 16)
- Carried forward unchanged: `plugins` (plural) vs `plugin` (singular) config tolerance on both versions; `.opencode/plugins/` discovery unions and flat-file loading on v2; `sk-vision.js` symlink following; `run --format json` schema and `--standalone`; `ORCA_OPENCODE_PLUGIN_API` host-derived replacement; the `Reload` mixin; `session.idle` / `session.execution.*`; `SystemPart` shape; `context` hook `SessionRequestKind`; `plugin.check` extra-key tolerance; the v2 event scheme; `SystemPart`; command-template `` !`cmd` `` injection; `.opencode/command` vs `.opencode/commands` scan; `Q-R1`–`Q-R5`; `-m provider/model#variant` on v1 1.19.3; `run` positional-directory behaviour; hidden `--dangerously-skip-permissions`; `models` positional provider on v2. (iteration 16)
- **A14-Q5 (new, P1):** Is the repo's `@opencode-ai/plugin` `1.18.34` pin a deliberate v1 floor or drift? `.opencode/package.json:7` and `.skilled/package.json:4` disagree with the 1.19.x v1 host being targeted, which means every v1-side plugin-contract answer gathered in iterations 1–3 was measured against the wrong pin. (iteration 16)
- **A15-Q3 (new, P1):** what is the exact npm package name and version pin for each family (the CI matrix's `<package>@<version>`)? Carried from iteration 15's install findings, but never needed for a check list until now. (iteration 17)
- **A15-Q2 (new, P1):** does the v1 log roll per run (timestamped files) or is `opencode.log` a single append-only file? V1-6 needs a stable window boundary; today's evidence is one 28 MB rolling file plus timestamped siblings. (iteration 17)
- Carried and untouched: `plugins` vs `plugin` config tolerance (narrowed to resolved-form by F6, not closed); flat-file plugin loading on v2; `sk-vision.js` symlink following; `run --format json`; `ORCA_OPENCODE_PLUGIN_API` host-derived replacement; the `Reload` mixin; `session.idle`/`session.execution.*`; `SystemPart`; `context` `SessionRequestKind`; `plugin.check` extra-key tolerance; `-m provider/model#variant` on v1; `~/.opencode/hooks.json`; `Q-R1`–`Q-R5`; v2 `run` positional directory; hidden `--dangerously-skip-permissions`; `models <provider>` on v2. (iteration 17)
- **A15-Q1 (new, P0):** which v1 command actually instantiates plugins? `debug config` does not, and the repo guard denies `run` from Pi. Candidates: `opencode debug agent <name>`, or any `run` variant under the guard's escape. Blocks V1-6 outside CI. (iteration 17)
- **A15-Q4 (new, P2):** does `plugin_origins` include a `disabled` or `error` field when a spec fails to resolve, which would let V1-3 detect a broken entry without a load? (iteration 17)
- Does the v2 event stream actually deliver `session.idle`, `session.compacted`, `session.status` and `message.updated` to `ctx.event.subscribe`? (P0, runtime-only) (iteration 18)
- Does `SessionHooks.context` fire for `kind === "compaction"` and `"title"`, and does a push to `system` survive into the provider request? (P1, now the only injection route for two plugins) (iteration 18)
- What is the `tui` RPC id and method set behind `POST /api/rpc/{rpcID}/{method}`? (P1, the only surviving toast channel) (iteration 18)
- What is `Tool.ValueSchema` — zod raw shape or JSON Schema? Decides whether one `args` definition serves both hosts. (P1) (iteration 18)
- Does `POST /api/plugin/check` accept `Object.assign(fn, {id, setup})`, or reject a callable with extra keys? (P0 for the uniform template) (iteration 18)
- Is there any plugin-facing way to read session messages on 2.0.32 — a `SessionApi` method not in the `SessionDomain` pick, or a `ctx.rpc` method? (P0 for the sentinel and sk-vision transcript reads) (iteration 18)
- `Location.Info` field names — which one replaces `ctx.directory`? (P2) (iteration 18)
- **A16-Q1 (new, P1):** Does `@opencode/plugin@2.0.32` re-export `zod`, and at which major? If it (iteration 19)
- **A16-Q5 (new, P2):** What is the publish date of `2.0.0` relative to `2.0.32`? F2's span starts at (iteration 19)
- **A16-Q2 (new, P1):** Do `@opencode-ai/plugin` (v1 scope) and `@opencode/plugin` (v2 scope) (iteration 19)
- Carried forward and untouched: `plugins` (plural) vs `plugin` (singular) config tolerance on both (iteration 19)
- **A16-Q3 (new, P2):** Does `opencode --version` print a bare `2.0.32` on the v2 binary, and does (iteration 19)
- **A16-Q4 (new, P2):** Does v1 1.19.3's version string carry a build suffix (e.g. `1.19.3-<hash>`)? (iteration 19)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
No prior context: the continuity ladder found no handover.md, implementation-summary.md or decision-record.md (spec.md is a fresh scaffold), and the ripgrep recipe over specs and .skilled returned a clean no-hit (exit 1).

resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 20
- Convergence threshold: 0
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-10-18T09:23:10.373Z
