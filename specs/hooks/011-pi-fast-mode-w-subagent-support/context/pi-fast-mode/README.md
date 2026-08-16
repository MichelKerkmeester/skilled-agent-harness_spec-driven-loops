# @thebinaryguy/pi-fast-mode

[![npm version](https://img.shields.io/npm/v/@thebinaryguy/pi-fast-mode.svg?style=flat-square)](https://www.npmjs.com/package/@thebinaryguy/pi-fast-mode)
[![Pi package](https://img.shields.io/badge/Pi-package-6f42c1?style=flat-square)](https://pi.dev/packages/@thebinaryguy/pi-fast-mode)

A [Pi](https://pi.dev) extension that adds a persistent, toggleable Fast mode for supported OpenAI Codex models.

When Fast mode is enabled, matching requests include:

```json
{
  "service_tier": "priority"
}
```

## Install

```bash
pi install npm:@thebinaryguy/pi-fast-mode
```

Or install directly from GitHub:

```bash
pi install git:github.com/TheBinaryGuy/pi-fast-mode
```

Restart Pi after installing, or run `/reload` in an existing session.

## Usage

```text
/fast          Toggle Fast mode
/fast on       Enable Fast mode
/fast off      Disable Fast mode
/fast status   Show the current state
```

When enabled, Pi adds `fast` to the built-in model status:

```text
gpt-5.6-sol • high • fast
```

The custom footer is active only while Fast mode is enabled. Pi supports one custom footer at a time, so another extension that installs a custom footer may override this indicator.

## Persistence

The extension stores its global state in:

```text
~/.pi/agent/openai-codex-fast-mode.json
```

The file is created automatically the first time Fast mode is toggled or explicitly enabled/disabled. New Pi processes load the saved state. If `PI_CODING_AGENT_DIR` is set, the file is stored in that directory instead.

## Scope

Fast mode is applied only when all of these conditions are true:

- Provider is `openai-codex`
- API is `openai-codex-responses`
- Model is GPT-5.5 or a GPT-5.6 variant
- The outgoing payload does not already define `service_tier`

Priority processing may have higher usage costs. The extension changes only the outgoing request payload; depending on the service-tier value echoed by Codex, Pi's locally displayed cost may not reflect priority pricing.

## Security

Pi extensions execute with your user permissions. This extension reads and writes only its state file in Pi's agent directory and modifies matching OpenAI Codex request payloads.

## License

MIT
