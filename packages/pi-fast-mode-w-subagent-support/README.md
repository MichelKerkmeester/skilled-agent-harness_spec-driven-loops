# pi-fast-mode-w-subagent-support

Pi package that adds a Fast Mode toggle for GPT-5.6, GPT-5.5, and GPT-5.4.

<img style="width: 100%; height: auto;" alt="fast mode" src="https://raw.githubusercontent.com/johncmunson/pi-openai-fast-mode/refs/heads/main/preview-img.png" />

## Features

- Registers `/fast [on|off|toggle]`.
- Registers `--fast` to enable Fast Mode at startup.
- Injects `service_tier: "priority"` into matching OpenAI/OpenAI-Codex provider payloads.
- Shows a compact right-aligned TUI `fast` indicator only when enabled and the current model is configured.
- Persists state in user or project scope depending on how the package is loaded.

> View on the [Pi Package Registry](https://pi.dev/packages/pi-fast-mode-w-subagent-support)

## Install

```bash
pi install npm:pi-fast-mode-w-subagent-support
# or project-local
pi install -l npm:pi-fast-mode-w-subagent-support
```

For local development:

```bash
pi -e ./src/index.ts
```

## Usage

```text
/fast          # toggle
/fast toggle   # toggle
/fast on       # enable
/fast off      # disable
```

Start Pi with Fast Mode enabled and persisted:

```bash
pi --fast
```

## Default configuration

Fast Mode starts disabled and only applies to exact configured provider/model pairs:

```json
{
  "enabled": false,
  "targets": [
    { "provider": "openai", "model": "gpt-5.4", "serviceTier": "priority" },
    { "provider": "openai", "model": "gpt-5.5", "serviceTier": "priority" },
    { "provider": "openai", "model": "gpt-5.6", "serviceTier": "priority" },
    { "provider": "openai", "model": "gpt-5.6-sol", "serviceTier": "priority" },
    { "provider": "openai", "model": "gpt-5.6-terra", "serviceTier": "priority" },
    { "provider": "openai", "model": "gpt-5.6-luna", "serviceTier": "priority" },
    {
      "provider": "openai-codex",
      "model": "gpt-5.4",
      "serviceTier": "priority"
    },
    {
      "provider": "openai-codex",
      "model": "gpt-5.5",
      "serviceTier": "priority"
    },
    {
      "provider": "openai-codex",
      "model": "gpt-5.6",
      "serviceTier": "priority"
    },
    {
      "provider": "openai-codex",
      "model": "gpt-5.6-sol",
      "serviceTier": "priority"
    },
    {
      "provider": "openai-codex",
      "model": "gpt-5.6-terra",
      "serviceTier": "priority"
    },
    {
      "provider": "openai-codex",
      "model": "gpt-5.6-luna",
      "serviceTier": "priority"
    }
  ]
}
```

User-scoped state is stored under `~/.pi/agent/extensions/pi-fast-mode-w-subagent-support/config.json`.
Project-scoped state is stored under `./.pi/pi-fast-mode-w-subagent-support/config.json`.

## Subagent handoff

Fast Mode preference propagates from a parent Pi session to child processes through the `PI_FAST_MODE_W_SUBAGENT_SUPPORT` environment variable.

- Strict values: `1` enables, `0` disables; any other or unset value carries no opinion.
- The parent writes the normalized value whenever Fast Mode is toggled (`/fast`) or set by the `--fast` startup flag; children inherit it via ordinary process-environment copying.
- At `session_start`, resolution precedence is: an explicitly present `--fast` flag, then the inherited `PI_FAST_MODE_W_SUBAGENT_SUPPORT` value, then persisted config. Handoff never bypasses the configured provider/model target match.
- The variable is parent-owned and one-directional: children read it and never overwrite the parent's value.

## Provenance

Fork of [`pi-openai-fast-mode`](https://github.com/johncmunson/pi-openai-fast-mode) pinned at commit `9b28456` (v0.3.0). MIT-licensed; the original copyright is retained in `LICENSE`. This fork renames the package and is the base for adding fast-mode subagent handoff support.

## Development

```bash
npm install
npm run check
```
