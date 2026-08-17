# pi-fast-mode-w-subagent-support

> Pi extension that adds a Fast Mode toggle for OpenAI GPT-5.4 through 5.6 models, with strict subagent handoff.

<img style="width: 100%; height: auto;" alt="fast mode indicator" src="https://raw.githubusercontent.com/johncmunson/pi-openai-fast-mode/refs/heads/main/preview-img.png" />

---

## 1. OVERVIEW

This Pi extension injects the OpenAI `service_tier: "priority"` hint into matching model requests so Fast Mode responses use priority processing. It targets developers running Pi against OpenAI or OpenAI-Codex providers who want a per-session speed toggle that also carries into spawned subagents.

Fast Mode is off by default and only affects the exact provider/model pairs listed in the configuration. It never changes a request whose model is not a configured target.

---

## 2. FEATURES

- Registers `/fast [on|off|toggle]`.
- Registers `--fast` to enable Fast Mode at startup.
- Injects `service_tier: "priority"` into matching OpenAI and OpenAI-Codex provider payloads.
- Shows a compact right-aligned TUI `fast` indicator only when enabled and the current model is a configured target.
- Persists state in user or project scope depending on how the package is loaded.
- Propagates the parent session's Fast Mode preference to child subagents through an environment variable.

---

## 3. INSTALL

This fork is not published to npm. It ships inside this repository under `.pi/extensions/` and loads automatically, because `.pi/settings.json` lists it in the `packages` array as `extensions/pi-fast-mode-w-subagent-support`.

To install it into another Pi setup, run this from the repo root:

```bash
pi install -l .pi/extensions/pi-fast-mode-w-subagent-support
```

---

## 4. USAGE

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

---

## 5. CONFIGURATION

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
    { "provider": "openai-codex", "model": "gpt-5.4", "serviceTier": "priority" },
    { "provider": "openai-codex", "model": "gpt-5.5", "serviceTier": "priority" },
    { "provider": "openai-codex", "model": "gpt-5.6", "serviceTier": "priority" },
    { "provider": "openai-codex", "model": "gpt-5.6-sol", "serviceTier": "priority" },
    { "provider": "openai-codex", "model": "gpt-5.6-terra", "serviceTier": "priority" },
    { "provider": "openai-codex", "model": "gpt-5.6-luna", "serviceTier": "priority" }
  ]
}
```

User-scoped state is stored under `~/.pi/agent/extensions/pi-fast-mode-w-subagent-support/config.json`.
Project-scoped state is stored under `./.pi/pi-fast-mode-w-subagent-support/config.json`.

---

## 6. SUBAGENT HANDOFF

Fast Mode preference propagates from a parent Pi session to child processes through the `PI_FAST_MODE_W_SUBAGENT_SUPPORT` environment variable.

- Strict values: `1` enables and `0` disables. Any other or unset value carries no opinion.
- The parent writes the normalized value whenever Fast Mode is toggled with `/fast` or set by the `--fast` startup flag. Children inherit it through ordinary process-environment copying.
- At `session_start`, resolution precedence is an explicitly present `--fast` flag, then the inherited `PI_FAST_MODE_W_SUBAGENT_SUPPORT` value, then persisted config. Handoff never bypasses the configured provider/model target match.
- The variable is parent-owned and one-directional. Children read it and never overwrite the parent's value.

---

## 7. PROVENANCE

Fork of [`pi-openai-fast-mode`](https://github.com/johncmunson/pi-openai-fast-mode) pinned at commit `9b28456` (v0.3.0). MIT-licensed. The original copyright is retained in `LICENSE`. This fork renames the package and adds Fast Mode subagent handoff support.

---

## 8. DEVELOPMENT

Install dependencies and run the full check (typecheck plus tests):

```bash
npm install
npm run check
```

Run the test suite on its own:

```bash
npm test
```

Expected output:

```text
Test Files  7 passed (7)
     Tests  76 passed (76)
```

Run the extension directly from source:

```bash
pi -e ./src/index.ts
```
