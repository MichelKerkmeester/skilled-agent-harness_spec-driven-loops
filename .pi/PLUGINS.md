# Pi Plugins

Reference list of all pi plugins installed for this environment. Eight npm
packages install at both user level (`~/.pi/agent/npm`) and project level
(`.pi/npm`) carrying the same set; two git-source extensions (`pi-btw`,
`pi-plan-build`) install the same way under `git/`. `deep-pi` and
`pi-cache-optimizer` load from local extension directories (`.pi/extensions/`).
Entries are sorted alphabetically by package name.

---

#### @juicesharp/rpiv-ask-user-question (v2.6.0)
[github.com/juicesharp/rpiv-mono/tree/main/packages/rpiv-ask-user-question](https://github.com/juicesharp/rpiv-mono/tree/main/packages/rpiv-ask-user-question)

A structured questionnaire the model can put to you when it would otherwise guess — typed options instead of free-form replies

---

#### @juicesharp/rpiv-todo (v2.6.0)
[github.com/juicesharp/rpiv-mono/tree/main/packages/rpiv-todo](https://github.com/juicesharp/rpiv-mono/tree/main/packages/rpiv-todo)

A todo list for the model, rendered as a live overlay that survives /reload and conversation compaction

---

#### deep-pi (v1.0.0)
[github.com/christopherarter/deep-pi](https://github.com/christopherarter/deep-pi)

Direct DeepSeek cache economics, prefix stability, and retry reduction for the Pi coding agent

---

#### pi-blackhole (v0.4.7)
[github.com/k0valik/pi-blackhole](https://github.com/k0valik/pi-blackhole)

Unified compaction + observational memory — compresses conversation context while preserving durable observations and reflections

---

#### pi-btw (v0.4.1)
[github.com/dbachelder/pi-btw](https://github.com/dbachelder/pi-btw)

A pi extension for parallel side conversations with /btw

---

#### pi-cache-optimizer (v2.8.0)
[github.com/jiangge/pi-cache-optimizer](https://github.com/jiangge/pi-cache-optimizer)

Improve Pi prompt/KV cache hit rates — stable prompt ordering, OpenAI-compatible cache keys, proxy-compat warnings, and footer cache stats

**Cache-compat overlay (`.pi/models.json`).** This repo ships a small `models.json`
that Pi layers on top of its login-provisioned model catalog
(`~/.pi/agent/models-store.json`, auto-refreshed from the gateway and not a durable
edit target). It currently sets `sendSessionAffinityHeaders: true` on the
`opencode-go` channel (the OpenCode Zen gateway that serves DeepSeek V4 Pro / Flash
over an OpenAI-compatible API), so a Pi session stays pinned to one upstream backend
and the provider-side prefix cache stays warm. This also silences the extension's
per-channel "DeepSeek-like … missing compat" startup warning for that channel.

`supportsLongCacheRetention` is deliberately **left off**: DeepSeek's prefix cache is
automatic and does not need it, and the Zen gateway's support for OpenAI long
`prompt_cache_retention` is unverified — enabling it blindly risks
`400 Unsupported parameter: prompt_cache_retention`. Add it per-model only after
confirming the endpoint accepts it. No credentials live in `models.json`; auth stays
in `auth.json` / `models-store.json`. The file is a symlinked canonical
(`~/.pi/agent/models.json` → repo `.pi/models.json`) — see [`SYNC.md`](SYNC.md).

---

#### pi-fast-mode-w-subagent-support (v0.3.0)
Local fork at `packages/pi-fast-mode-w-subagent-support` — based on [pi-openai-fast-mode](https://github.com/johncmunson/pi-openai-fast-mode) commit `9b28456`

Toggles OpenAI / OpenAI-Codex priority `service_tier` for the configured GPT-5.4–5.6 targets via `/fast [on|off|toggle]` and the `--fast` startup flag. Propagates the fast-mode preference to child Pi processes through the strict `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1|0` environment handoff. Replaces the former `pi-gpt-fast-mode`.

---

#### pi-plan-build (v0.1.25)
[github.com/janvitos/pi-plan-build](https://github.com/janvitos/pi-plan-build)

Plan safely, approve explicitly, then implement here or in a clean session.

---

#### pi-statusline (v0.0.2)
[github.com/hsingjui/pi-statusline](https://github.com/hsingjui/pi-statusline)

Claude Code-compatible command-driven statusline extension

---

#### pi-subagents (v0.50.0)
[github.com/nicobailon/pi-subagents](https://github.com/nicobailon/pi-subagents)

Delegating tasks to subagents with chains, parallel execution, and TUI clarification

---

#### pi-web-access (v0.23.0)
[github.com/nicobailon/pi-web-access](https://github.com/nicobailon/pi-web-access)

Web search, URL fetching, GitHub repo cloning, PDF extraction, YouTube video understanding, and local video analysis — zero-config Exa search plus many provider backends

---

## Updating packages

Packages install at **two scopes**: user (`~/.pi/agent/npm`) and project
(`.pi/npm` in any repo whose `.pi/settings.json` lists them). The startup
"Package Updates Available" banner checks **both** and prefers the project
scope when the same package is listed twice — a stale project install keeps
the banner firing even after a plain update.

`pi update --extensions` updates the user scope, but **skips project packages
unless the project is trusted**. Without `--approve` the CLI does not even
load project settings, so the project scope is silently skipped and only git
sources still run. Fix the stale project scope with:

```bash
cd <repo root with project packages> && pi update --extensions --approve
```

`--approve` forces the project-trust override for that command. After updating,
verify the banner check passes: the installed version in
`.pi/npm/node_modules/<pkg>/package.json` must equal `npm view <pkg> version`.

---

Source of truth: `pi list` and the `repository`/`homepage` fields of each
package's `package.json`. Versions reflect the installed release.
