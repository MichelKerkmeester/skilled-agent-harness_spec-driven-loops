# Pi Plugins

Reference list of all pi plugins installed for this environment. The ten npm
packages are installed at both user level (`~/.pi/agent/npm`) and project level
(`.pi/npm`) carrying the same set; `deep-pi` and `pi-cache-optimizer` load from
local extension directories (`.pi/extensions/`).

#### deep-pi (v1.0.0)
[github.com/christopherarter/deep-pi](https://github.com/christopherarter/deep-pi)

Direct DeepSeek cache economics, prefix stability, and retry reduction for the Pi coding agent

---

#### pi-blackhole (v0.4.5)
[github.com/k0valik/pi-blackhole](https://github.com/k0valik/pi-blackhole)

Unified compaction + observational memory — compresses conversation context while preserving durable observations and reflections

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

#### pi-gpt-fast-mode (v0.1.2)
[github.com/devwithpug/pi-gpt-fast-mode](https://github.com/devwithpug/pi-gpt-fast-mode)

Controls OpenAI's GPT service tier (priority/flex/default/auto) for GPT-5.4 / GPT-5.5, with subagent hand-off

---

#### pi-intercom (v0.10.0)
[github.com/nicobailon/pi-intercom](https://github.com/nicobailon/pi-intercom)

Direct 1:1 messaging between pi sessions on the same machine — send context, findings, or requests from one session to another

---

#### pi-omplike-advisor (v1.0.2)
[github.com/pasky/pi-omplike-advisor](https://github.com/pasky/pi-omplike-advisor)

`/advisor` — a persistent second model that reviews the main agent's work each turn and injects concise advice inline

---

#### pi-plan (v0.1.1)
[github.com/zx06/pi-packages/tree/main/packages/plan](https://github.com/zx06/pi-packages/tree/main/packages/plan)

Plan mode — read-only exploration with plan-then-execute workflow

---

#### pi-statusline (v0.0.2)
[github.com/hsingjui/pi-statusline](https://github.com/hsingjui/pi-statusline)

Claude Code-compatible command-driven statusline extension

---

#### pi-subagents (v0.46.0)
[github.com/nicobailon/pi-subagents](https://github.com/nicobailon/pi-subagents)

Delegating tasks to subagents with chains, parallel execution, and TUI clarification

---

#### pi-web-access (v0.21.0)
[github.com/nicobailon/pi-web-access](https://github.com/nicobailon/pi-web-access)

Web search, URL fetching, GitHub repo cloning, PDF extraction, YouTube video understanding, and local video analysis — zero-config Exa search plus many provider backends

---

#### @juicesharp/rpiv-ask-user-question (v2.4.0)
[github.com/juicesharp/rpiv-mono/tree/main/packages/rpiv-ask-user-question](https://github.com/juicesharp/rpiv-mono/tree/main/packages/rpiv-ask-user-question)

A structured questionnaire the model can put to you when it would otherwise guess — typed options instead of free-form replies

---

#### @juicesharp/rpiv-todo (v2.4.0)
[github.com/juicesharp/rpiv-mono/tree/main/packages/rpiv-todo](https://github.com/juicesharp/rpiv-mono/tree/main/packages/rpiv-todo)

A todo list for the model, rendered as a live overlay that survives /reload and conversation compaction

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
package's `package.json`. Versions reflect the installed release. The
`pi-intercom` package ships no repository/homepage metadata, so its URL comes
from its upstream repository.
