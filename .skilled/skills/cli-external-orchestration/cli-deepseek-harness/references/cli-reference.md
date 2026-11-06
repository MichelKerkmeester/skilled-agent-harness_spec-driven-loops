---
title: "DeepSeek Harness CLI - Headless Command Reference"
description: "The pinned dsh headless option set, the launcher flags that precede it, the composed dispatch shape, the JSON event stream and the exit contract, each tied to the offline contract pin."
trigger_phrases:
  - "dsh headless flags"
  - "dsh cli reference"
  - "dsh json event stream"
  - "dsh exit code contract"
  - "dsh launcher patch flag"
importance_tier: important
contextType: implementation
version: 1.0.1.0
---

# DeepSeek Harness CLI - Headless Command Reference

Open this file before composing or checking any `dsh` command line. Every option it names was captured from the installed binary, so a flag missing here is a flag dsh headless does not take.

---

## 1. OVERVIEW

### Purpose

Keeps the observed dsh headless contract in one place: which options exist, which launcher flags come before them, what the JSON stream carries and what the exit code means.

### When to Use

- Composing a dsh dispatch before launch.
- Checking a command another agent built.
- Classifying a failed run from its stdout, stderr and exit code.

### Evidence Base

| Capture | What it pins | Path |
|---|---|---|
| Headless help | The app option set in section 3 | `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/002-dsh-offline-contract-pin/evidence/headless-help.txt` |
| Version | The installed version | `.../002-dsh-offline-contract-pin/evidence/version.txt` |
| Registry read | Integrity and dist-tags | `.../002-dsh-offline-contract-pin/evidence/dist-tags.json` |
| Composed config | What the route and lineage patches change | `.../002-dsh-offline-contract-pin/evidence/dump-config-llmgateway.txt`, `dump-config-opencode-go.txt` |
| Keyless run | The failure stream and exit code | `.../002-dsh-offline-contract-pin/evidence/missing-credential.stdout.jsonl`, `missing-credential.stderr.txt`, `exit.txt` |
| Plugin boot | A relative plugin loads before the provider call | `.../002-dsh-offline-contract-pin/evidence/plugin-boot.txt` |

Keyed results are route-specific. The LLM Gateway result is verified below. OpenCode Go and behaviors outside the saved probes remain unverified with their evidence gaps named.

---

## 2. VERSION PIN

| Field | Value | Source |
|---|---|---|
| Package | `@deepseek-ai/dsh` | `dist-tags.json` |
| Version | `0.2.2-rc.1` | `version.txt` |
| Integrity | `sha512-ijR9UEVYkG15Q/Q79JzvzLBzQOQfc63VLr9n6flpwHPhr5IKn2UxthnSoto/P9l7qGd7pPvI1Ra6TW7LH3oKpg==` | `dist-tags.json` |
| Dist-tags at capture | `latest` and `next` both `0.2.2-rc.1`, `alpha` `0.2.2-alpha.3` | `dist-tags.json` |

This table is the packet's one pin record, and the `pinned-version-required` hard rule enforces the same version. The research run saw `latest` at `0.2.1-rc.5` a day before this capture, so the tag moves and is never a pin. A new release is re-pinned offline before any dispatch uses it.

The installed package requires Node `>=24.9.0` (research synthesis section 7).

---

## 3. HEADLESS OPTIONS

`dsh --profile headless [options] [task...]` answers one task and exits. The answer goes to stdout and diagnostics go to stderr. The task is positional words joined by spaces, or a lone `-` that reads stdin.

| Option | Meaning, as the help text states it | Dispatch use |
|---|---|---|
| `--json` | Write newline-delimited run events to stdout instead of the final message | Always on, so the caller can read the `final` event |
| `--session-id <id>` | Adopt the persisted session with this id. An unknown id is an error | Resume only, inside the same disposable `DSH_HOME` |
| `--permission-mode <preset>` | Select a configured permission preset for this task, including on resume | `workspace-write` for writers, `read-only` for reviewers |
| `--approval-policy <policy>` | Set approval behavior after selecting the preset. Choices `ask` and `never` | Always `never` |
| `--add-dir <path>` | Allow an additional physical absolute directory under `workspace-write`. Repeatable | Only for a named absolute path the task must write |
| `-h`, `--help` | Show the help | Never part of a dispatch |

That is the whole option set. There is no model, provider, reasoning-effort, working-directory or timeout option. Route and model come from a `--patch` overlay (section 4), the working directory is the process cwd and the caller owns the time bound.

### Permission Presets

The composed config lists three presets (`dump-config-llmgateway.txt`, row `permission`):

| Preset | Sandbox | Default approval |
|---|---|---|
| `read-only` | `read-only` | `ask` |
| `workspace-write` | `workspace-write` | `ask` |
| `danger-full-access` | `danger-full-access` | `never` |

Never dispatch `danger-full-access`. The 2026-11-06 LLM Gateway probe showed that `workspace-write` lets a file tool write inside the cwd, denies a write under `$HOME` outside it with a `tool_result` error and allows a sibling path under the OS temp directory. A `bash` `echo ok` call completed. These probes do not establish shell write limits, MCP behavior or plugin effects. The source says the sandbox fails with `SANDBOX_UNAVAILABLE` rather than running unconfined, which the saved run did not test. See [confinement evidence](../../../../specs/cli-external-orchestration/085-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/confinement.md).

---

## 4. LAUNCHER FLAGS

The launcher reads its own flags first and stops at the first token it does not know, so these flags come before the headless options. They are not in the headless help capture, because they belong to the launcher, not to the headless app.

| Flag | Meaning | Grounding |
|---|---|---|
| `--profile <name>` | Select the profile. Dispatch always uses `headless` | Headless help usage line |
| `--patch <path>` | Apply a YAML patch as the last composition layer. Repeatable, applied in argv order | Research synthesis section 9.1, resource map launcher list, the two `dump-config-*.txt` captures whose rows read "patched by" each patch file |
| `--dump-config` | Print the composed config and exit, without a model call | Research synthesis section 14, the two `dump-config-*.txt` captures |
| `--dump-default-config` | Print the default composition and exit | Resource map launcher list |
| `--version` | Print the installed version and exit | `version.txt`, captured as `dsh --version </dev/null` |

The flag check for this file runs every double-dash token against the headless help capture and treats exactly the four launcher flags `--patch`, `--dump-config`, `--dump-default-config` and `--version` as the only exclusions, because each is grounded in the sources in this table rather than in that capture. `--profile` is in the help capture and is checked like any app option.

### Patch Grammar

A patch is a YAML list. Each item is one of:

- `- id: <row>` with `config:`, which replaces the whole `config` of that row.
- `- id: <row>` with `disabled: true`, which switches the row off.
- `- insert:` with a list of new rows. A relative plugin `name` inside an insert resolves beside the patch file.

The last layer wins per row. Composition runs bundle patches, then the profile's `cordis.patch.yml`, then `$DSH_HOME/cordis.patch.yml`, then each `--patch` in order. A patch whose target row does not exist is only a loader warning, so a renamed row silently turns that patch into a no-op. Read stderr of a `--dump-config` run for that warning.

Observed: with the draft route and lineage patches, `--dump-config` exited 0 with empty stderr, `agent-default-model` named the route's provider and model, and the five lineage rows were changed (`dump-config-llmgateway.txt`, `dump-config-llmgateway.stderr.txt`). Observed: a stub plugin inserted by relative path wrote its marker file before the provider error (`plugin-boot.txt`).

---

## 5. THE DISPATCH SHAPE

Every dispatch composes the same argv. Variables keep the shape copyable and the paths explicit:

```bash
# Run these two lines from the checkout root, then leave it: the dispatch itself never starts there.
REPO="$(pwd -P)"
RUN_DIR="$(mktemp -d)"

cd "$RUN_DIR" && printf '%s' "$PROMPT" | DSH_HOME="$RUN_DIR/.dsh-home" \
  dsh --profile headless \
    --patch "$REPO/.dsh/patches/route-llmgateway-deepseek.patch.yml" \
    --patch "$REPO/.dsh/patches/lineage.patch.yml" \
    --patch "$REPO/.dsh/patches/guards.patch.yml" \
    --json --permission-mode read-only --approval-policy never - \
  >"$RUN_DIR/stdout.jsonl" 2>"$RUN_DIR/stderr.txt"
echo "exit=$?" >"$RUN_DIR/exit.txt"
```

| Part | Why | Hard rule |
|---|---|---|
| `cd "$RUN_DIR"` | Headless reads `<cwd>/.env`, and the repository root holds one | `no-repo-root-dotenv` |
| `DSH_HOME="$RUN_DIR/.dsh-home"` | Profiles, sessions and the anonymous user id land in a disposable home | `dsh-home-isolated` |
| `--profile headless` | One task, then exit | `headless-only` |
| `--patch "$REPO/.dsh/patches/route-*.patch.yml"` | Selects the roster route, named by its literal file name so the preflight can check it against the roster. Without it the base default is the official DeepSeek route | `route-patch-required`, `closed-roster` |
| `--patch "$REPO/.dsh/patches/lineage.patch.yml"` | Telemetry off, session log off, goal and plan off | `lineage-patch-required` |
| `--patch "$REPO/.dsh/patches/guards.patch.yml"` | Loads the repo-guards plugin bundle; a run without it is unguarded | `guards-patch-required` |
| `--json` | The `final` event is the completion signal | `json-final-and-exit-required` |
| `--approval-policy never` | No human answers a headless approval | `approval-never-required` |
| `-` with the prompt on stdin | The prompt never sits in argv, and stdin closes when the pipe ends | `stdin-dash-required` |

The route, lineage and guards patches ship under `.dsh/patches/`. Prove their composition with `--dump-config` from a disposable home before dispatch. The live probe used a fresh temp workspace as cwd. A file tool write under `$HOME` outside that cwd returned an error, while a sibling OS temp path remained writable. MCP and plugin confinement were not probed. A writer swaps `read-only` for `workspace-write` and names any absolute directory outside the cwd with `--add-dir` only when the task must write there.

dsh has no agent-file loader. Generated persona patches exist at `.dsh/agents/<name>.patch.yml`; a hand-composed dispatch still includes the resolved persona in its prompt, while the deep-loop fan-out builder passes the patch when `agentPersona` is set.

---

## 6. OUTPUT AND EXIT CONTRACT

### The JSON Stream

With `--json`, stdout carries one JSON object per line. The keyless capture shows the order (`missing-credential.parse.txt`):

```text
1 session   {"type":"session","sessionId":"session-...","cwd":"..."}
2 status    {"type":"status","phase":"turn_start","turn":1}
3 status    {"type":"status","phase":"step_start","turn":1,"step":1}
4 status    {"type":"status","phase":"step_end","turn":1,"step":1}
5 status    {"type":"status","phase":"turn_end","turn":1,"reason":{...}}
6 final     {"type":"final","sessionId":"session-...","reason":{"kind":"error","error":{"code":"MISSING_CREDENTIAL",...}},"text":""}
```

The `session` event's `cwd` is the process cwd, so it is a cheap check that the dispatch did not start at the repository root.

### Exit Codes

| Outcome | Exit | Last stdout line | Status |
|---|---|---|---|
| No key for the route | `1` | `final` with `reason.kind` `error` and `error.code` `MISSING_CREDENTIAL` | Observed (`exit.txt`, `missing-credential.stdout.jsonl`) |
| Completed task | `0` | `final` with `reason.kind` `completed` | Verified for LLM Gateway on 2026-11-06. OpenCode Go is configured, not verified. See `013-dsh-live-contract-pin/evidence/route-llmgateway.*` and `latency-and-tokens.md` |
| Failure outside a turn | `1` | an `error` event and no `final` | UNKNOWN. No saved run produced this failure shape |

Count a run complete only on exit `0` AND a last `final` line whose `reason.kind` is `completed`. A missing `final`, a line that does not parse, an `error` event or any other reason is a failure, whatever the exit code says.

### Stderr

stderr carries diagnostics as `dsh: <code>: <message>`. The keyless run printed one line that begins `dsh: MISSING_CREDENTIAL: llm-pi-ai: no credential for provider route "llmgateway"` and names `LLMGATEWAY_API_KEY` as the unset variable (`missing-credential.stderr.txt`). Classify failures from the `final` event first and from stderr second.

---

## 7. CREDENTIALS

Headless takes provider keys from the launch environment, then `<cwd>/.env`, then `$DSH_HOME/.env`. The interactive credential store is disabled in the headless profile, and the composed config shows the `credentials` row `disabled: true` (`dump-config-llmgateway.txt`). Pass keys only through the environment of the dispatch, by name, never in a prompt or a file in the checkout. The key names per route are in [providers-and-models.md](./providers-and-models.md).

---

## 8. RELATED

- [providers-and-models.md](./providers-and-models.md) - the closed roster and the route patches.
- [runtime-folder-and-sync.md](./runtime-folder-and-sync.md) - where the patches live and how `DSH_HOME` is kept disposable.
- [fanout-executor.md](./fanout-executor.md) - the same shape built by the shared runner for lineages.
- [../hard-rules.json](../hard-rules.json) - the thirteen rules this shape satisfies.
