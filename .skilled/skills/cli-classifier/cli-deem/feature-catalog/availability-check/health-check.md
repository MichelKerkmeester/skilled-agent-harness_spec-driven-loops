---
title: "Health check"
description: "Checks the local Deem server and prints the backend, the model id and the commit pair. It refuses the stub backend and any model id other than deem-0.8-v1."
trigger_phrases:
  - "health check"
  - "is deem up"
  - "deem availability"
  - "cli-deem health"
importance_tier: "important"
version: 0.1.0.0
---

# Health check (cli-deem health)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Checks the local Deem server and prints the backend, the model id and the commit pair. It refuses the stub backend and any model id other than deem-0.8-v1.

A feature that must stay dormant without Deem calls this subcommand and reads the exit code. It never starts the server. Starting it is the operator's step with `deem-ctl`.

---

## 2. HOW IT WORKS

### The Checks

`health` sends `GET /health` with a 2,000 ms budget. `--hook` shortens the budget to 500 ms for a caller a user is waiting on. The URL must be on `127.0.0.1`, `localhost` or `[::1]`, so the check never reaches another machine. The response must be HTTP 200 with a JSON object whose `status` is `ok`. The `backend` must be `torch` or start with `ensemble:` without containing `stub`. The `model` must be `deem-0.8-v1`. The stub backend answers `ok` too, which is why the backend check exists.

### The Commit Pair

After the server passes, `health` reads the model commit as the basename of the `~/.local/share/deem/models/current` link. It reads the source commit with `git rev-parse HEAD` in `~/.local/share/deem/src`. It prints `{"ok":true,"backend":B,"model":M,"model_commit":C1,"source_commit":C2}` on stdout.

### Exit Codes

| Exit | When |
|---|---|
| 0 | Every check passed and the pair was read |
| 1 | A non-200 answer below 500 or a body that is not the expected object |
| 2 | An extra flag, a `CLI_DEEM_URL` off loopback or malformed, a missing checkpoint link or a missing source checkout |
| 3 | The stub backend or a model id other than `deem-0.8-v1` |
| 4 | A refused connection, a timeout or a 5xx |

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs` | Script | The `health` subcommand and the shared HTTP request helper |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs` | Node test | Fake-server cases for a healthy server, the stub, a foreign model, a closed port, a 5xx, a missing checkpoint link, both timeout budgets and the loopback URL rule |

---

## 4. SOURCE METADATA

- Group: Availability check
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `availability-check/health-check.md`

Related references:
- [noul-probability.md](../judgment-subcommands/noul-probability.md) - The first judgment a caller sends after a passing check
- [model-pin.md](../../references/model-pin.md) - What the model id and the commit pair name
