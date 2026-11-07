---
name: cli-deepseek-harness
description: "DeepSeek Harness (dsh) CLI executor for pinned headless one-task dispatch over a closed two-route DeepSeek V4.1 Flash roster."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.0.0.0
---

# DeepSeek Harness CLI Orchestrator - Cross-AI Task Delegation

> **Experimental executor kind.** LLM Gateway `deepseek-v4.1-flash-1017` is verified on dsh
> 0.2.2-rc.1 (2026-11-06) and is the default route. OpenCode Go `deepseek-v4.1-flash` is
> configured, not verified, and stays out of defaults. Its endpoint and authentication remain
> UNKNOWN because no request was sent while `OPENCODE_API_KEY` was unset.

Orchestrate DeepSeek Harness (`dsh`, npm `@deepseek-ai/dsh`) for one-task headless runs: a read-only review, a single scoped implementation or an independent second opinion, with the model fixed by a checked-in route patch.
The offline contract pin is the source for every flag and failure shape: [contract pin evidence](../../../../specs/cli-external-orchestration/085-cli-deepseek-harness-creation/002-dsh-offline-contract-pin/evidence/headless-help.txt).
Each live result applies only to the route and behavior the saved probe exercised. Keep OpenCode Go and untested behavior marked UNKNOWN with the reason.

**Core principle**: the harness owns model selection, so the caller owns composition. Every dispatch names exactly one roster route patch, the lineage patch and the guards patch, runs from a scratch cwd with a disposable `DSH_HOME`, and counts as complete only on exit 0 plus a `completed` final event.

---

## 1. WHEN TO USE

### Activation Triggers

- **Explicit dsh dispatch**: the task names DeepSeek Harness, `dsh` or `dsh headless`.
- **Cross-AI validation**: an independent review or second opinion from a DeepSeek V4.1 Flash run that is not the calling runtime.
- **One-task headless work**: a bounded task that answers once and exits, with a machine-readable JSON event stream.
- **Composition checks**: proving a route or lineage patch composes with `--dump-config` before any model call.

### When NOT to Use

- `dsh` is not on PATH, or `dsh --version` is not the pinned version.
- The task needs a model outside the two-route roster, a GLM or official DeepSeek route, or a provider the roster does not list.
- The task needs an interactive session, a human answer mid-run, plan mode or native goal rounds.
- The task requires OpenCode Go, whose route is configured but not verified.
- The only cwd available is the repository root.

---

## 2. SMART ROUTING

The `cli-external-orchestration` hub routes a dsh dispatch here when the request names DeepSeek Harness, `dsh`, `dsh headless` or says "delegate to dsh". LLM Gateway is verified. OpenCode Go remains configured, not verified.
`command -v dsh` and the pinned `dsh --version` decide whether a local dispatch can run, and both run before every dispatch.
Every run loads `references/cli-reference.md` and `assets/prompt-quality-card.md` first, before any intent selection.
Read [`ROUTER.md`](./ROUTER.md) before selecting skill-local resources, and open only the matched files.

---

## 3. HOW IT WORKS

### Execution Ownership

This packet owns the dispatch contract: the hard rules, the roster, the argv shape and the prompt mechanics.
For research and review lineages, the shared deep-loop runtime owns process construction through the experimental `cli-deepseek-harness` executor kind, described in [fanout-executor.md](./references/fanout-executor.md). The verified LLM Gateway route is the default. OpenCode Go remains explicit-only until a keyed run verifies it.
Do not add a packet-local wrapper, spawn path or command builder.

**Closed roster: non-roster routes are FORBIDDEN.** Two routes exist, LLM Gateway and OpenCode Go, both serving DeepSeek V4.1 Flash. [providers-and-models.md](./references/providers-and-models.md) section 2 is the one place the ids, endpoints and key variables are recorded. dsh validates no catalog membership, so a patch naming any other model would run. The preflight is the only gate.

### The Dispatch Shape

```bash
cd "$RUN_DIR" && printf '%s' "$PROMPT" | DSH_HOME="$RUN_DIR/.dsh-home" \
  dsh --profile headless --patch "$REPO/.dsh/patches/route-llmgateway-deepseek.patch.yml" --patch "$REPO/.dsh/patches/lineage.patch.yml" \
    --patch "$REPO/.dsh/patches/guards.patch.yml" \
    --json --permission-mode read-only --approval-policy never -
```

`$RUN_DIR` is a fresh scratch directory and `$REPO` is the checkout root, so all three patches are named by absolute path. Swap the route file for `route-opencode-go-deepseek.patch.yml` to use the other roster route. Name each patch by its literal file name: the preflight checks the roster from that name, and a patch hidden behind a variable fails `route-patch-required`. A writer uses `workspace-write` and names any directory it must write outside the cwd with `--add-dir`. The annotated shape and every flag are in [cli-reference.md](./references/cli-reference.md) sections 3 to 5.

### Dispatch Lifecycle

1. Create the scratch cwd and set `DSH_HOME` inside it.
2. Run `command -v dsh` and `dsh --version </dev/null`, and refuse anything but the pin in [cli-reference.md](./references/cli-reference.md) section 2.
3. Pick exactly one route patch from the roster, then check that it, the lineage patch and the guards patch exist.
4. Compose the prompt with [prompt-quality-card.md](./assets/prompt-quality-card.md) and a template from [prompt-templates.md](./assets/prompt-templates.md).
5. Pipe the prompt to the dispatch shape, keeping stdout, stderr and the exit code apart.
6. Validate exit 0 and a last `final` event with `reason.kind` `completed`, then check the diff and the tests.

### Dispatch-Critical Gotchas

- **No model, provider, reasoning, cwd or timeout option exists.** dsh headless takes only `--json`, `--session-id`, `--permission-mode`, `--approval-policy` and `--add-dir`. A Pi or OpenCode flag is not a dsh option. Route and model come from the route patch, and the caller owns the time bound.
- **A missing route patch reaches the official DeepSeek API.** The default composition names provider `deepseek-official`. It is never a roster route.
- **The repository root leaks keys.** Headless reads keys from the environment, then `<cwd>/.env`, then `$DSH_HOME/.env`, and the root holds a `.env`. The `session` event's `cwd` field shows where a run started.
- **A well-formed stream can be a failure.** Observed keyless: exit 1, and the last line is a valid `final` event with `reason.kind` `error` and code `MISSING_CREDENTIAL`. Read both the exit code and the reason.
- **First boot writes into the resolved home.** A profile-scoped command, even `--help`, initializes profile files. An unset `DSH_HOME` means `~/.dsh`.
- **Approvals default to `ask`.** `read-only` and `workspace-write` both ask, and a headless run has no one to answer, so `--approval-policy never` is mandatory. It rejects calls and confines nothing.

### Provider Preflight

A missing key fails fast and cheaply: the keyless offline run exited 1 with `MISSING_CREDENTIAL` naming the route's key variable on stderr. Surface that variable name to the operator and stop. Never pass a key in a prompt or write one into the checkout.

---

## 4. RULES

The thirteen fail-closed rules live in [hard-rules.json](./hard-rules.json): `headless-only`, `stdin-dash-required`, `route-patch-required`, `closed-roster`, `approval-never-required`, `dsh-home-isolated`, `lineage-patch-required`, `guards-patch-required`, `json-final-and-exit-required`, `pinned-version-required`, `dsh-availability-required`, `no-repo-root-dotenv` and `mcp-opt-in-only`.

### ✅ ALWAYS

1. Run `command -v dsh` and the pinned version probe before every dispatch.
2. Dispatch `dsh --profile headless` with the prompt on stdin after a lone `-`.
3. Pass exactly one roster route patch, the lineage patch and the guards patch, by absolute path, before the app options.
4. For a single dispatch, set `DSH_HOME` to a fresh directory and use a scratch cwd outside the checkout. Deep-loop fan-out is the exception: each lineage runs with `cwd` set to its lineage directory and a disposable `DSH_HOME` under the OS temp directory.
5. Pass `--json` and `--approval-policy never`, and pick `read-only` or `workspace-write` deliberately.
6. Count a run complete only on exit 0 and a last `final` event whose `reason.kind` is `completed`.
7. Compose every dispatch as `{resolved agent persona + task prompt}`, inlining the persona block, because dsh has no agent-file loader. Canonical contract: `../../sk-prompt/assets/cli-prompt-quality-card.md` "Persona Injection".
8. Set `AI_SESSION_CHILD=1` in the child's environment and copy the preamble from [`shared/references/child-dispatch-preamble.md`](../shared/references/child-dispatch-preamble.md) to the top of the prompt.
9. Give a build dispatch one change per brief: the file, the edit and the check that proves it.
10. Keep route status specific: LLM Gateway is verified, OpenCode Go is configured, not verified, and unresolved behaviors remain UNKNOWN with their evidence gap.

### ⛔ NEVER

1. Never dispatch any route outside the two-route roster, and never write a route patch for one.
2. Never start dsh with the repository root as its cwd.
3. Never run any dsh command with `DSH_HOME` unset.
4. Never use `danger-full-access`, and never treat `--approval-policy never` as confinement.
5. Never mount MCP without the dedicated MCP patch, and never for a task that names no MCP tool.
6. Never put a key, `.env` content or a credential value in a prompt, a patch or a file in the checkout.
7. Never pass `DEEPSEEK_API_KEY` to a dispatch. It switches the official web search and fetch route back on.
8. Never pin a dist-tag. Pin the literal version and integrity.
9. Never dispatch dsh from inside a dsh child or a fan-out lineage.
10. Never build a second dsh adapter inside this packet.

### ⚠️ ESCALATE IF

1. `dsh` is missing from PATH or reports a version other than the pin.
2. The task needs a keyed dispatch and the route's key variable is not set.
3. A `--dump-config` run prints any stderr line, which can mean a patch target row was renamed.
4. The task needs the OpenCode Go route, which is configured, not verified, and has an UNKNOWN endpoint.
5. The task depends on behavior still marked UNKNOWN.

---

## 5. REFERENCES

### Core References

- [cli-reference.md](./references/cli-reference.md) - The version pin, the headless option set, the launcher flags, the dispatch shape and the exit contract
- [providers-and-models.md](./references/providers-and-models.md) - The closed two-route roster, the route patch shape and what stays unconfirmed
- [runtime-folder-and-sync.md](./references/runtime-folder-and-sync.md) - The `.dsh/` folder, `DSH_HOME` isolation, skills, prompts and personas
- [guards-and-hooks.md](./references/guards-and-hooks.md) - Harness seams, the repo-guards plugin bundle and the port table
- [mcp.md](./references/mcp.md) - MCP off by default and the opt-in Code Mode patch
- [fanout-executor.md](./references/fanout-executor.md) - The experimental executor kind, its lineage command and env allowlist
- [repin-runbook.md](./references/repin-runbook.md) - Repeat route, confinement, reasoning and lineage probes after an rc bump

### Templates and Assets

- [prompt-quality-card.md](./assets/prompt-quality-card.md) - Thin delegator to the canonical prompt-models card, plus dsh addenda
- [prompt-templates.md](./assets/prompt-templates.md) - Preflight, dry composition check, review, implementation, validation and handback

### External Sources

- [Offline contract pin evidence](../../../../specs/cli-external-orchestration/085-cli-deepseek-harness-creation/002-dsh-offline-contract-pin/evidence/headless-help.txt) - The captured headless help, with version, dump-config and keyless captures beside it
- [Research synthesis](../../../../specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/research.md) - The source-backed design behind every rule

---

## 6. SUCCESS CRITERIA

### Dispatch Completion

- `dsh` is on PATH at the pinned version before launch.
- The argv carries the headless profile, one roster route patch, the lineage patch, the guards patch, `--json`, `--approval-policy never` and a lone `-`.
- The run started from a scratch cwd with a disposable `DSH_HOME`.
- Exit 0 and a last `final` event with `reason.kind` `completed`, and the workspace changes pass the caller's verification gates.

### Packet Quality

- Every flag the references name appears in the captured help text or in the launcher table that grounds it separately.
- LLM Gateway is listed as verified, OpenCode Go as configured, not verified, and every remaining UNKNOWN has a reason.
- No nested advisor identity is introduced under this packet.

---

## 7. INTEGRATION POINTS

### Hub Integration

The hub owns advisor identity, mode registration and router policy. This packet owns only the dsh dispatch contract, and it must not add `description.json` or `graph-metadata.json`. The hub already registers and routes this mode, and the shared runtime carries its executor kind. LLM Gateway is verified. OpenCode Go remains configured, not verified.

### Deep-Loop Integration

The shared runtime is the sole process adapter for lineages. This packet supplies the rules, the roster and the prompt mechanics.

### Code and Spec Integration

sk-code owns code verification. system-spec-kit owns Gate 3, spec folders and continuity. Name the established spec folder in a delegated prompt when the parent workflow has one.

### Tool Roles

- Bash runs the probes, the composition check and the dispatch.
- Read, Glob and Grep inspect prompts, references, the event stream and returned changes.
- This packet grants no new external tools.

---

## 8. REFERENCES AND RELATED RESOURCES

Start with the CLI reference and the prompt-quality card, then load only the references matching the task. The router discovers markdown resources inside this packet.

Related skills: cli-pi, cli-opencode, cli-claude-code, cli-codex, cli-cursor and cli-devin for sibling CLI dispatch, sk-code for code standards, system-deep-loop for lineage execution and system-spec-kit for packet handback.
