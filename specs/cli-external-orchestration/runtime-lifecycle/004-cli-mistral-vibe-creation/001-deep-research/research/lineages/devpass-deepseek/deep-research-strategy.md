---
title: Deep Research Strategy - Mistral Vibe as a cli-external-orchestration runtime
description: Session tracking for the devpass-deepseek lineage of the Mistral Vibe runtime-mode research run.
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Mistral Vibe runtime mode

## 1. OVERVIEW

### Purpose

Persistent brain for this lineage. Records what to investigate, what worked, what failed, and where to focus next. Read at every iteration.

### Usage

- Init populated Topic, Key Questions, Known Context and Research Boundaries.
- Per iteration: the agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions and Next Focus.

---

## 2. TOPIC

Mistral Vibe (vibe 3.1.2, installed) as a governed cli-external-orchestration runtime mode, and feature parity of its extensions, hooks, plugins, skills, commands and agents with cli-opencode. Work the eight angles in `research-angles.md`, one per iteration, using `research/evidence/vibe-help.txt` as the captured headless contract.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] How does Vibe run one task non-interactively: which prompt source, flags, output formats and exit codes does the headless contract expose?
- [x] Which providers, models and authentication paths can a Vibe dispatch use, and which usage counter does a turn draw on?
- [x] What does Vibe read from the working directory and ~/.vibe/, and what would a generated repo-root .vibe/ mirror contain?
- [x] For each cli-opencode surface this repository uses, does Vibe have an equivalent, a partial equivalent or none, and what would porting take?
- [x] What would a cli-mistral-vibe deep-loop executor kind need, and is ACP a better dispatch surface than print mode?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Building any part of the `cli-mistral-vibe` mode. This run writes findings and a ranked phase plan only.
- Writing the operator's `~/.vibe/` directory or any credential value.
- Re-implementing Vibe features speculatively; every parity claim must name a Vibe source location or a live command capture.

---

## 5. STOP CONDITIONS

- All eight research angles answered with cited evidence and a parity table, or `maxIterations` (8) reached.
- A hard blocker on the Vibe source (package not readable) makes the source-based angles `UNKNOWN`; record it and continue with the captured CLI contract.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- How does Vibe run one task non-interactively: which prompt source, flags, output formats and exit codes does the headless contract expose?
- Which providers, models and authentication paths can a Vibe dispatch use, and which usage counter does a turn draw on?
- What does Vibe read from the working directory and ~/.vibe/, and what would a generated repo-root .vibe/ mirror contain?
- For each cli-opencode surface this repository uses, does Vibe have an equivalent, a partial equivalent or none, and what would porting take?
- What would a cli-mistral-vibe deep-loop executor kind need, and is ACP a better dispatch surface than print mode?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the bundled Python half first turned an opaque CLI into a two-process contract (Rust client + app server), and `run_export.py` is the single authoritative exit-code taxonomy, so the contract claims are grounded in code rather than in help prose. (iteration 1)
- starting from the config schema and `ProviderConfig`/`ModelConfig` gave the whole model surface in two files, and `_billing.py` answered the counter question directly instead of by inference from marketing copy. (iteration 2)
- `find_local_config_dirs` is the single function that answers "what does Vibe read at the project root", and reading it beat assembling the answer from individual loaders. (iteration 3)
- reading `_foreign.py` before designing the table settled the biggest question immediately — Vibe deliberately refuses executable OpenCode plugins — and prevented a table full of optimistic "partial" verdicts. (iteration 4)
- reading the skill model's field descriptions answered the slash-command question that Angle 4 got wrong, because `user-invocable` explicitly names `/skill-name`. (iteration 5)
- grading the guards by their DSH event rather than by name turned a vague "can we port hooks" question into a per-event yes/no, and `strict` is the single field that decides blocking. (iteration 6)
- reading the kind registry and the adapter table first turned "add an executor" into a checklist of exact tables, and the cli-pi comment supplied the proven failure mode for a missing env prefix. (iteration 7)
- comparing the two surfaces by their completion signal (exit code plus export versus protocol events) made the recommendation obvious and grounded, instead of a preference between transports. (iteration 8)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- treating `--help` as the full contract. It omits denial behaviour and the JSON-RPC run server, both of which appear only in the binary's strings. (iteration 1)
- looking for a "subscription" flag in the CLI. There is none: the plan is read from the platform, not configured locally. (iteration 2)
- looking for a commands directory. Vibe 3.x has prompts and skills, not slash-command markdown, so the OpenCode command surface has no direct mirror path. (iteration 3)
- trying to find a slash-command directory. The absence is the finding, and it only surfaced by reading the discovery function rather than the feature docs. (iteration 4)
- searching `core/tools/builtins` for a TypeScript tool. Code Mode lives in the harness package, so the first verdict was a false negative that only surfaced while reading the `task` tool's neighbours. (iteration 5)
- looking for a sandbox flag. The absence is real and had to be established from both the schema and the CLI capture before it could be stated. (iteration 6)
- looking for a reasoning flag. Vibe's absence forced the sharper finding that the roster must carry the thinking level, which is a better requirement than a flag mapping. (iteration 7)
- trying to find ACP flags. There are none, which itself narrows the design: everything a governed dispatch needs must arrive through config or the protocol. (iteration 8)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A live `vibe -p OK` smoke dispatch: `~/.vibe/` holds only `trusted_folders.toml`, no `config.toml` and no key, so the run would have exercised the auth-error branch (`config_error`, exit 1) rather than the dispatch contract. Deferred to the second allowed smoke dispatch once credentials exist. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A live `vibe -p OK` smoke dispatch: `~/.vibe/` holds only `trusted_folders.toml`, no `config.toml` and no key, so the run would have exercised the auth-error branch (`config_error`, exit 1) rather than the dispatch contract. Deferred to the second allowed smoke dispatch once credentials exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A live `vibe -p OK` smoke dispatch: `~/.vibe/` holds only `trusted_folders.toml`, no `config.toml` and no key, so the run would have exercised the auth-error branch (`config_error`, exit 1) rather than the dispatch contract. Deferred to the second allowed smoke dispatch once credentials exist.

### Adopting ACP as the first executor surface: it requires a protocol supervisor, a new completion signal and a permission answerer before a single iteration can run, while print mode runs on the existing contract. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Adopting ACP as the first executor surface: it requires a protocol supervisor, a new completion signal and a permission answerer before a single iteration can run, while print mode runs on the existing contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adopting ACP as the first executor surface: it requires a protocol supervisor, a new completion signal and a permission answerer before a single iteration can run, while print mode runs on the existing contract.

### Answering the OpenCode-versus-Vibe counter comparison from client code. Both clients send a key to a provider; which internal counter the platform debits is server-side and unobservable locally. Recorded as UNKNOWN with the exact measurement that would settle it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Answering the OpenCode-versus-Vibe counter comparison from client code. Both clients send a key to a provider; which internal counter the platform debits is server-side and unobservable locally. Recorded as UNKNOWN with the exact measurement that would settle it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Answering the OpenCode-versus-Vibe counter comparison from client code. Both clients send a key to a provider; which internal counter the platform debits is server-side and unobservable locally. Recorded as UNKNOWN with the exact measurement that would settle it.

### Assuming a `.vibe/commands/` directory: it is absent from `find_local_config_dirs`, so slash commands cannot be mirrored by dropping markdown into a commands folder. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Assuming a `.vibe/commands/` directory: it is absent from `find_local_config_dirs`, so slash commands cannot be mirrored by dropping markdown into a commands folder.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming a `.vibe/commands/` directory: it is absent from `find_local_config_dirs`, so slash commands cannot be mirrored by dropping markdown into a commands folder.

### Assuming project config applies by presence: `ProjectConfigLayer` requires trust, so the repo mirror must also be trusted per worktree (`--trust`) or it is inert. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Assuming project config applies by presence: `ProjectConfigLayer` requires trust, so the repo mirror must also be trusted per worktree (`--trust`) or it is inert.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming project config applies by presence: `ProjectConfigLayer` requires trust, so the repo mirror must also be trusted per worktree (`--trust`) or it is inert.

### Guessing a `VIBE_SESSION_ID` env var for the session-env map: unobserved, and cli-devin deliberately omits its equivalent rather than inventing one. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Guessing a `VIBE_SESSION_ID` env var for the session-env map: unobserved, and cli-devin deliberately omits its equivalent rather than inventing one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Guessing a `VIBE_SESSION_ID` env var for the session-env map: unobserved, and cli-devin deliberately omits its equivalent rather than inventing one.

### Looking for a Code Mode equivalent among builtin tools: the tool list has no script/execute member. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for a Code Mode equivalent among builtin tools: the tool list has no script/execute member.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a Code Mode equivalent among builtin tools: the tool list has no script/execute member.

### Looking for a per-kind sandbox flag in Vibe: none exists, so `EXECUTOR_SANDBOX_IS_OS_BOUNDARY` must be `false` and containment must be post-hoc. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Looking for a per-kind sandbox flag in Vibe: none exists, so `EXECUTOR_SANDBOX_IS_OS_BOUNDARY` must be `false` and containment must be post-hoc.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a per-kind sandbox flag in Vibe: none exists, so `EXECUTOR_SANDBOX_IS_OS_BOUNDARY` must be `false` and containment must be post-hoc.

### Looking for a Vibe command-markdown directory: none exists, and `.vibe/prompts` is resolved by prompt id, not by user invocation. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for a Vibe command-markdown directory: none exists, and `.vibe/prompts` is resolved by prompt id, not by user invocation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a Vibe command-markdown directory: none exists, and `.vibe/prompts` is resolved by prompt id, not by user invocation.

### Looking for a Vibe web-search policy switch: the CLI has no such option, so the policy is `inherit`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Looking for a Vibe web-search policy switch: the CLI has no such option, so the policy is `inherit`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a Vibe web-search policy switch: the CLI has no such option, so the policy is `inherit`.

### Looking for ACP flags to pin a model or workdir: `vibe-acp` has no flags, so those come from config or from the session `new_session` payload, and the exact payload fields are UNKNOWN from the Python surface alone. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Looking for ACP flags to pin a model or workdir: `vibe-acp` has no flags, so those come from config or from the session `new_session` payload, and the exact payload fields are UNKNOWN from the Python surface alone.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for ACP flags to pin a model or workdir: `vibe-acp` has no flags, so those come from config or from the session `new_session` payload, and the exact payload fields are UNKNOWN from the Python surface alone.

### Looking for an ACP export path: none exists; export is a headless-only artifact. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Looking for an ACP export path: none exists; export is a headless-only artifact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an ACP export path: none exists; export is a headless-only artifact.

### Mapping `reasoningEffort` to a Vibe flag: no such flag exists, so the field must be declared unsupported and the pin carried by the model row. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Mapping `reasoningEffort` to a Vibe flag: no such flag exists, so the field must be declared unsupported and the pin carried by the model row.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mapping `reasoningEffort` to a Vibe flag: no such flag exists, so the field must be declared unsupported and the pin carried by the model row.

### Mapping `session.compacted`/`session.idle` onto `post_agent`: the event timing and payload differ, so the relaunch loop's idempotency and context-withdrawal logic would not carry over. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Mapping `session.compacted`/`session.idle` onto `post_agent`: the event timing and payload differ, so the relaunch loop's idempotency and context-withdrawal logic would not carry over.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mapping `session.compacted`/`session.idle` onto `post_agent`: the event timing and payload differ, so the relaunch loop's idempotency and context-withdrawal logic would not carry over.

### Packaging the repository's `.opencode/plugins/*.js` as a Vibe plugin and expecting them to run: `_foreign.py` refuses executable OpenCode components by design. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Packaging the repository's `.opencode/plugins/*.js` as a Vibe plugin and expecting them to run: `_foreign.py` refuses executable OpenCode components by design.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Packaging the repository's `.opencode/plugins/*.js` as a Vibe plugin and expecting them to run: `_foreign.py` refuses executable OpenCode components by design.

### Porting `completion-evidence` as a blocking hook: `post_agent` has no `strict`, so the port degrades to an advisory. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Porting `completion-evidence` as a blocking hook: `post_agent` has no `strict`, so the port degrades to an advisory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Porting `completion-evidence` as a blocking hook: `post_agent` has no `strict`, so the port degrades to an advisory.

### Reading `~/.vibe/config.toml` or any key to confirm the live provider: the directory holds only `trusted_folders.toml`, so there is no local provider state to observe, and reading a key value is out of scope by the angle's own rule. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reading `~/.vibe/config.toml` or any key to confirm the live provider: the directory holds only `trusted_folders.toml`, so there is no local provider state to observe, and reading a key value is out of scope by the angle's own rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `~/.vibe/config.toml` or any key to confirm the live provider: the directory holds only `trusted_folders.toml`, so there is no local provider state to observe, and reading a key value is out of scope by the angle's own rule.

### Reading the `task` tool as an unrestricted subagent dispatch: its default allowlist contains only `explore`, so a custom subagent is invisible until the allowlist names it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Reading the `task` tool as an unrestricted subagent dispatch: its default allowlist contains only `explore`, so a custom subagent is invisible until the allowlist names it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the `task` tool as an unrestricted subagent dispatch: its default allowlist contains only `explore`, so a custom subagent is invisible until the allowlist names it.

### Reading the Python package as the CLI implementation: `launcher.py` only execs the Rust binary, so Python is the app-server/session half. The Rust parser has no local source in the wheel, only the help text and binary strings, so CLI-flag claims beyond those captures are `documented, unconfirmed`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading the Python package as the CLI implementation: `launcher.py` only execs the Rust binary, so Python is the app-server/session half. The Rust parser has no local source in the wheel, only the help text and binary strings, so CLI-flag claims beyond those captures are `documented, unconfirmed`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the Python package as the CLI implementation: `launcher.py` only execs the Rust binary, so Python is the app-server/session half. The Rust parser has no local source in the wheel, only the help text and binary strings, so CLI-flag claims beyond those captures are `documented, unconfirmed`.

### Searching for a command-argument templating feature in the skill parser: there is no `$ARGUMENTS` or equivalent placeholder in `SkillMetadata` or the skill tool. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Searching for a command-argument templating feature in the skill parser: there is no `$ARGUMENTS` or equivalent placeholder in `SkillMetadata` or the skill tool.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a command-argument templating feature in the skill parser: there is no `$ARGUMENTS` or equivalent placeholder in `SkillMetadata` or the skill tool.

### Searching for a project-local plugin config file separate from `.vibe/config.toml`: plugin enablement (`enabled_plugins`/`disabled_plugins`) lives in the same layered config, so there is one config file to render, not two. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Searching for a project-local plugin config file separate from `.vibe/config.toml`: plugin enablement (`enabled_plugins`/`disabled_plugins`) lives in the same layered config, so there is one config file to render, not two.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a project-local plugin config file separate from `.vibe/config.toml`: plugin enablement (`enabled_plugins`/`disabled_plugins`) lives in the same layered config, so there is one config file to render, not two.

### Searching the binary for a hook decision JSON schema: the decision protocol is not exposed as strings, so blocking is cited from the `strict` model contract rather than a wire format. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Searching the binary for a hook decision JSON schema: the decision protocol is not exposed as strings, so blocking is cited from the `strict` model contract rather than a wire format.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching the binary for a hook decision JSON schema: the decision protocol is not exposed as strings, so blocking is cited from the `strict` model contract rather than a wire format.

### Searching the builtin tool directory for a Code Mode tool: `run_typescript` lives in the Unified Harness runtime, not in `core/tools/builtins`, which is why the first pass missed it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Searching the builtin tool directory for a Code Mode tool: `run_typescript` lives in the Unified Harness runtime, not in `core/tools/builtins`, which is why the first pass missed it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching the builtin tool directory for a Code Mode tool: `run_typescript` lives in the Unified Harness runtime, not in `core/tools/builtins`, which is why the first pass missed it.

### Searching the config schema for a sandbox mode: there is no field, so any "sandbox mode" claim would be documentation-only and is marked UNKNOWN for the CLI. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Searching the config schema for a sandbox mode: there is no field, so any "sandbox mode" claim would be documentation-only and is marked UNKNOWN for the CLI.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching the config schema for a sandbox mode: there is no field, so any "sandbox mode" claim would be documentation-only and is marked UNKNOWN for the CLI.

### Treating `--auto-approve` as a sandbox: it suppresses prompts, and the only containment is `outside_workdir` plus protected-path escalation. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating `--auto-approve` as a sandbox: it suppresses prompts, and the only containment is `outside_workdir` plus protected-path escalation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `--auto-approve` as a sandbox: it suppresses prompts, and the only containment is `outside_workdir` plus protected-path escalation.

### Treating `--output json` as the canonical machine record. It is the response channel; `export.json` is the run record. Building an executor around stdout JSON alone would lose `outcome`, `usage`, `cost_usd`, `steps` and `exit_code`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `--output json` as the canonical machine record. It is the response channel; `export.json` is the run record. Building an executor around stdout JSON alone would lose `outcome`, `usage`, `cost_usd`, `steps` and `exit_code`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `--output json` as the canonical machine record. It is the response channel; `export.json` is the run record. Building an executor around stdout JSON alone would lose `outcome`, `usage`, `cost_usd`, `steps` and `exit_code`.

### Treating the absence of `.vibe/commands` as proof that Vibe has no slash commands: user-invocable skills are the slash surface, so the correct verdict is "commands map to skills, without `$ARGUMENTS`". -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the absence of `.vibe/commands` as proof that Vibe has no slash commands: user-invocable skills are the slash surface, so the correct verdict is "commands map to skills, without `$ARGUMENTS`".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the absence of `.vibe/commands` as proof that Vibe has no slash commands: user-invocable skills are the slash surface, so the correct verdict is "commands map to skills, without `$ARGUMENTS`".

### Treating the model catalogue as a shipped roster: it is fetched from `/model-catalog` at runtime with a 5s cap and 30-day cache, so an offline install has only declared rows. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the model catalogue as a shipped roster: it is fetched from `/model-catalog` at runtime with a 5s cap and 30-day cache, so an offline install has only declared rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the model catalogue as a shipped roster: it is fetched from `/model-catalog` at runtime with a 5s cap and 30-day cache, so an offline install has only declared rows.

### Using `run-server` now: the binary itself labels it experimental. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Using `run-server` now: the binary itself labels it experimental.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using `run-server` now: the binary itself labels it experimental.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- A live `vibe -p OK` smoke dispatch: `~/.vibe/` holds only `trusted_folders.toml`, no `config.toml` and no key, so the run would have exercised the auth-error branch (`config_error`, exit 1) rather than the dispatch contract. Deferred to the second allowed smoke dispatch once credentials exist. (iteration 1)
- Reading the Python package as the CLI implementation: `launcher.py` only execs the Rust binary, so Python is the app-server/session half. The Rust parser has no local source in the wheel, only the help text and binary strings, so CLI-flag claims beyond those captures are `documented, unconfirmed`. (iteration 1)
- Treating `--output json` as the canonical machine record. It is the response channel; `export.json` is the run record. Building an executor around stdout JSON alone would lose `outcome`, `usage`, `cost_usd`, `steps` and `exit_code`. (iteration 1)
- Answering the OpenCode-versus-Vibe counter comparison from client code. Both clients send a key to a provider; which internal counter the platform debits is server-side and unobservable locally. Recorded as UNKNOWN with the exact measurement that would settle it. (iteration 2)
- Reading `~/.vibe/config.toml` or any key to confirm the live provider: the directory holds only `trusted_folders.toml`, so there is no local provider state to observe, and reading a key value is out of scope by the angle's own rule. (iteration 2)
- Treating the model catalogue as a shipped roster: it is fetched from `/model-catalog` at runtime with a 5s cap and 30-day cache, so an offline install has only declared rows. (iteration 2)
- Assuming a `.vibe/commands/` directory: it is absent from `find_local_config_dirs`, so slash commands cannot be mirrored by dropping markdown into a commands folder. (iteration 3)
- Assuming project config applies by presence: `ProjectConfigLayer` requires trust, so the repo mirror must also be trusted per worktree (`--trust`) or it is inert. (iteration 3)
- Searching for a project-local plugin config file separate from `.vibe/config.toml`: plugin enablement (`enabled_plugins`/`disabled_plugins`) lives in the same layered config, so there is one config file to render, not two. (iteration 3)
- Looking for a Code Mode equivalent among builtin tools: the tool list has no script/execute member. (iteration 4)
- Looking for a Vibe command-markdown directory: none exists, and `.vibe/prompts` is resolved by prompt id, not by user invocation. (iteration 4)
- Mapping `session.compacted`/`session.idle` onto `post_agent`: the event timing and payload differ, so the relaunch loop's idempotency and context-withdrawal logic would not carry over. (iteration 4)
- Packaging the repository's `.opencode/plugins/*.js` as a Vibe plugin and expecting them to run: `_foreign.py` refuses executable OpenCode components by design. (iteration 4)
- Reading the `task` tool as an unrestricted subagent dispatch: its default allowlist contains only `explore`, so a custom subagent is invisible until the allowlist names it. (iteration 5)
- Searching for a command-argument templating feature in the skill parser: there is no `$ARGUMENTS` or equivalent placeholder in `SkillMetadata` or the skill tool. (iteration 5)
- Searching the builtin tool directory for a Code Mode tool: `run_typescript` lives in the Unified Harness runtime, not in `core/tools/builtins`, which is why the first pass missed it. (iteration 5)
- Treating the absence of `.vibe/commands` as proof that Vibe has no slash commands: user-invocable skills are the slash surface, so the correct verdict is "commands map to skills, without `$ARGUMENTS`". (iteration 5)
- Porting `completion-evidence` as a blocking hook: `post_agent` has no `strict`, so the port degrades to an advisory. (iteration 6)
- Searching the binary for a hook decision JSON schema: the decision protocol is not exposed as strings, so blocking is cited from the `strict` model contract rather than a wire format. (iteration 6)
- Searching the config schema for a sandbox mode: there is no field, so any "sandbox mode" claim would be documentation-only and is marked UNKNOWN for the CLI. (iteration 6)
- Treating `--auto-approve` as a sandbox: it suppresses prompts, and the only containment is `outside_workdir` plus protected-path escalation. (iteration 6)
- Guessing a `VIBE_SESSION_ID` env var for the session-env map: unobserved, and cli-devin deliberately omits its equivalent rather than inventing one. (iteration 7)
- Looking for a per-kind sandbox flag in Vibe: none exists, so `EXECUTOR_SANDBOX_IS_OS_BOUNDARY` must be `false` and containment must be post-hoc. (iteration 7)
- Looking for a Vibe web-search policy switch: the CLI has no such option, so the policy is `inherit`. (iteration 7)
- Mapping `reasoningEffort` to a Vibe flag: no such flag exists, so the field must be declared unsupported and the pin carried by the model row. (iteration 7)
- Adopting ACP as the first executor surface: it requires a protocol supervisor, a new completion signal and a permission answerer before a single iteration can run, while print mode runs on the existing contract. (iteration 8)
- Looking for ACP flags to pin a model or workdir: `vibe-acp` has no flags, so those come from config or from the session `new_session` payload, and the exact payload fields are UNKNOWN from the Python surface alone. (iteration 8)
- Looking for an ACP export path: none exists; export is a headless-only artifact. (iteration 8)
- Using `run-server` now: the binary itself labels it experimental. (iteration 8)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Populated at init from the packet's own docs and the live install.

### Bounded Context Snapshot

- Source pointers: installed package at `~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe` (version 3.1.2, console scripts `vibe`, `vibe-acp`, `vibe-app-server`); repo runtime packets under `.skilled/skills/cli-external-orchestration/cli-*/`.
- Captured evidence: `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt` (vibe 3.1.2 `--help`, `vibe-acp --help`, `vibe-app-server --help`).
- Packet context: `spec.md` (three phases, read-only research scope), `research-angles.md` (eight angles and the evidence rules), `plan.md`, `goal.md`.
- Integration points: `runtime/lib/deep-loop/executor-config.ts` (nine executor kinds), `runtime/scripts/fanout-run.cjs` (command builders and model allowlists), `runtime/scripts/append-mode-event.cjs` (state gateway), `.opencode/` plugin and agent surfaces.
- Constraints: read-only research; at most two live smoke dispatches shaped as a one-turn `OK` in a temp working directory; never read or print a key value.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 8
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-11-14T12:24:30Z
