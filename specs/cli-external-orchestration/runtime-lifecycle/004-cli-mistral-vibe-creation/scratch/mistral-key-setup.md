# Mistral key setup

Two operator steps unblock phase 004 (the Vibe contract pin), phase 003's keyed proofs (T008 and T009) and the keyed checks in phases 006, 008 and 009. Vibe and DeepSeek Harness read the key only from the environment. OpenCode keeps its own stored Mistral credential, so it already works without these steps.

Never paste the key into a chat, a spec file or a command line that lands in shell history. The commands below read it from a hidden prompt.

## 1. Get the key

Open https://console.mistral.ai, go to **API Keys**, and create or copy a key on the plan that carries your subscription.

## 2. Export `MISTRAL_API_KEY` in `~/.zshenv`

Run this in a terminal. It asks for the key without echoing it and appends one line to `~/.zshenv`.

```zsh
read -rs "k?Mistral API key: "; echo; printf '\nexport MISTRAL_API_KEY=%s\n' "$k" >> ~/.zshenv; unset k
```

Check it. Each command prints a count or a status, never the key.

```zsh
grep -c '^export MISTRAL_API_KEY=' ~/.zshenv          # prints 1
zsh -c 'env | grep -c "^MISTRAL_API_KEY="'            # prints 1
zsh -c 'curl -s -o /dev/null -w "%{http_code}\n" https://api.mistral.ai/v1/models -H "Authorization: Bearer $MISTRAL_API_KEY"'   # prints 200
```

If the first command prints 2 or more, an older line is still there. Open `~/.zshenv` in an editor and keep only the newest `export MISTRAL_API_KEY=` line.

`~/.zshenv` is read by every new zsh, so new terminals and new agent shells see the key. A terminal that was already open needs `source ~/.zshenv`.

## 3. Replace Pi's stored Mistral credential

Pi's stored Mistral key is currently a pasted file path, not a key. Log in again with the real key. Pi prompts for it.

```zsh
pi auth login mistral --api-key
```

Check it. `check` prints `ready`, `not_ready` or `invalid` and exits 0, 1 or 2.

```zsh
pi auth check --provider mistral; echo "exit=$?"     # prints ready, exit=0
```

## 4. Tell the session

Reply "key exported" in the Claude session. It then runs phase 004's T001 check (`zsh -c 'env | grep -c MISTRAL_API_KEY'` prints 1) and continues with the keyed runs.
