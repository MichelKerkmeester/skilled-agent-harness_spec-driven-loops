---
title: "Dual Claude Max Accounts — claude2 Is Intentional"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  - claude2
  - claude-account2
  - second account
  - dual account
  - CLAUDE_CONFIG_DIR
  - CLAUDE_CODE_OAUTH_TOKEN
  - two max subscriptions
---

# Dual Claude Max Accounts — claude2 Is Intentional

## Rule

The user runs TWO separate paid Claude Max subscriptions on this machine. If you encounter `~/.claude-account2/` or the `claude2` shell function, it is this intentional dual-account setup — not stray or duplicate config to clean up.

## Why

- `claude` → account #1 (michel.k@getbarter.com, Max), auth in the macOS **Keychain** (`Claude Code-credentials`).
- `claude2` → account #2 (second Max sub), a zsh function in `~/.zshrc` that sets `CLAUDE_CONFIG_DIR=~/.claude-account2` and `CLAUDE_CODE_OAUTH_TOKEN` (read from `~/.claude-account2/.oauth-token`, perms 600, minted via `claude setup-token`).

On macOS, `CLAUDE_CONFIG_DIR` alone does NOT isolate credentials (single shared Keychain entry — anthropics/claude-code#20553), so account #2 must authenticate via the env-var OAuth token to coexist without clobbering account #1's Keychain login.

## How to apply

`claude2` is a legitimate cross-AI dispatch target (a genuinely separate runtime/account), usable for delegated work. Both subs are paid and owned by the user, so it is ToS-compliant. Invocation pattern: `CLAUDE_CONFIG_DIR=~/.claude-account2 CLAUDE_CODE_OAUTH_TOKEN="$(<~/.claude-account2/.oauth-token)" claude -p "..."`. Do not treat the second config dir as an error.
