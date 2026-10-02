---
title: "cli-deem"
description: "Typed judgments from the Deem model served on this machine, answered in the field names jev readers already parse, with a health check that refuses the stub."
trigger_phrases:
  - "cli-deem readme"
  - "local deem judgment"
  - "deem health check"
version: 0.1.0.0
---

# cli-deem

> Ask the Deem model on this machine for a probability, a category or a ranked level. Read the answer the way you already read `jev` output.

A classifier that runs locally costs no key and no quota. That only helps when a caller can trust that the model is there. `cli-deem` gives every caller one binary for both halves: `health` says whether Deem is available. Four judgment subcommands return typed answers.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | A typed judgment from the local Deem model. The check that Deem is usable |
| **Invoke with** | `node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs <subcommand>` |
| **Works on** | The Deem server at `127.0.0.1:8300` and its install under `~/.local/share/deem/` |
| **Produces** | One JSON line on stdout and an exit code that names the outcome |

---

## 2. OVERVIEW

### What It Does

`cli-deem` is the `cli-classifier` hub's transport for the locally served Deem model. `health` checks the server and prints the backend, the model id and the commit pair. `noul`, `choice`, `score` and `run` post Deem's own request shape and print the answer with `noul`, `choice` and `score` fields, so a caller written for `jev` output needs no second parser. It is one Node file with no dependency and no key.

### Why This Skill Exists

Deem's server speaks the same System One protocol as Jev but takes its request fields differently. Pointing the Python `jev` CLI at it fails for `choice` and `score` with HTTP 400, because `jev` sends the options as `criteria` where Deem expects an `options` or `levels` list. Deem's `choice` answer also names the option text where a `jev` reader expects the submitted key. The stub backend also answers `status` `ok` with a flat 0.5 for everything, so a caller that trusted `status` alone would treat noise as a judgment.

### Why It Matters

- **One availability rule for every feature:** a feature that stays dormant without Deem calls `health` and reads one exit code.
- **Readers stay unchanged:** the answer arrives in the field names the existing `jev` readers parse.
- **Nothing leaves the machine:** the client sends no key and accepts only a loopback URL.

---

## 3. QUICK START

**Step 1: Check that Deem is available.**

```bash
node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs health
```

Exit 0 prints `{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"...","source_commit":"..."}`. Exit 4 means the server is not running.

**Step 2: Ask a question.**

```bash
node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs choice -q 'Which team owns this?' -s 'The invoice total is wrong.' -o billing='Payment or refund problem' -o support='Product or account problem' --value
```

With `--value` the output is the chosen key alone, here `billing` or `support`.

**Step 3: Run the tests before you rely on a change.**

```bash
node --test .skilled/skills/cli-classifier/cli-deem/scripts/tests/
```

The tests use an in-process fake server and never reach port 8300. Every test passes with exit 0.

---

## 4. HOW IT WORKS

A caller spawns the binary with a subcommand and its flags. The client checks the flags and the caps before it opens any socket, posts Deem's request shape to `/v1/systemone` and validates the answer, mapping a `choice` description back to its submitted key. Every failure maps to an exit code the caller already handles for `jev`.

```text
caller
   |
   v
cli-deem health  -->  GET /health, then the commit pair on disk  -->  exit 0, or 1 to 4
   |
   v
cli-deem noul | choice | score | run
   |   checks flags and caps (26 options, 64 questions)
   v
POST /v1/systemone (Deem's shape, no key)  -->  answer validated; choice mapped to its key  -->  stdout
```

### The Commit Pair

The model id `deem-0.8-v1` is a launch label that survives every update. The commit pair names the weights: the model commit is the checkpoint `~/.local/share/deem/models/current` points at. The source commit is the server checkout's `HEAD`. A result measured on one pair holds for that pair only. [`references/model-pin.md`](./references/model-pin.md) explains how a result survives an update.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

- A hook or an offline arm needs a local probability, category or level and must stay dormant when Deem is down.
- A script needs one availability answer before it chooses Deem for a run.
- An operator wants to see which commits the server is running.

For a hosted judgment with a stored key, use this hub's `cli-jev` mode instead. Starting, updating and rolling back the server belongs to `deem-ctl`, described in [`references/deem-ctl-lifecycle.md`](./references/deem-ctl-lifecycle.md).

### Related Skills

| Skill | Relationship |
|---|---|
| `cli-jev` | The hosted Jev transport, a mode of the same hub over the `cli-jev` packet. Same answer field names, a different backend, no silent failover between the two |
| `cli-classifier` | The hub that routes a Deem request to this packet |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Every subcommand exits 4 | The server is stopped. A server started less than about 10 s ago is still loading the weights | Run `deem-ctl status`, then `deem-ctl start` if it is stopped |
| `health` exits 3 with `refused backend: stub` | The server runs without a checkpoint | Restart it with `deem-ctl start`, which loads the pinned checkpoint |
| `health` exits 3 with `refused model: deem-1.5` | A Deem server started without the pinned model id holds the port | Stop it and start the pinned one with `deem-ctl` |
| `health` exits 2 with `missing checkpoint link` | `~/.local/share/deem/models/current` is gone | Repair the install with `deem-ctl update` or `deem-ctl rollback` |
| `choice` exits 2 before sending | More than 26 options. Two options that share a description or a key | Cut the options or make each description distinct |

---

## 7. VERIFICATION

| Check | Result |
|---|---|
| Client tests | `node --test .skilled/skills/cli-classifier/cli-deem/scripts/tests/` exits 0 |
| No key in the client | `grep -cE 'Authorization\|Bearer\|API_KEY' .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs` prints 0 |
| Live availability | `node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs health` exits 0 with `torch` and `deem-0.8-v1` |
| README structure | `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py README.md --type readme` reports zero issues |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | The runtime contract: subcommands, exit codes and rules |
| [`references/wire-contract.md`](./references/wire-contract.md) | Request and answer fields, caps and timeouts |
| [`references/deem-ctl-lifecycle.md`](./references/deem-ctl-lifecycle.md) | Starting, updating and rolling back the server |
| [`references/model-pin.md`](./references/model-pin.md) | What the model id and the commit pair name |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | One entry per subcommand with source anchors |
| [`changelog/v0.1.0.0.md`](./changelog/v0.1.0.0.md) | The first release |
