---
title: Deep Research Strategy - Mistral Vibe runtime mode and cli-opencode parity
description: Session tracking for the mistral-deepseek fan-out lineage researching Mistral Vibe as a governed cli-external-orchestration runtime and its feature parity with cli-opencode.
trigger_phrases:
  - "mistral vibe research strategy"
  - "vibe cli parity strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Mistral Vibe Runtime Mode

## 1. OVERVIEW

### Purpose

Persistent brain for the `mistral-deepseek` fan-out lineage. Records what to investigate, what worked, what failed, and where to focus next across the eight research angles.

### Usage

- **Init:** created by the lineage executor before iteration 1.
- **Per iteration:** the iteration agent reads Next Focus and writes iteration evidence; the reducer refreshes What Worked/Failed, answered questions, ruled-out directions, and Next Focus.
- **Mutability:** analyst-owned sections stay stable; machine-owned sections are rewritten by the reducer after each iteration.

---

## 2. TOPIC
Mistral Vibe (vibe 3.1.2, installed) as a governed cli-external-orchestration runtime mode, and feature parity of its extensions, hooks, plugins, skills, commands and agents with cli-opencode.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] How does Vibe run one task non-interactively: prompt as argument, stdin or file, which flags set model, agent profile, permissions, working directory and turn or time limits, what lands on stdout and stderr, and what are the exit codes on success, provider error, denied tool and timeout?
- [x] How does Vibe authenticate (browser sign-in, API key, bring-your-own key), can a dispatch pin deepseek-v4-1-flash-1017 and zai-glm-5-3-flash, how is reasoning effort set, and which usage counter does a Vibe turn draw on?
- [x] What does Vibe read from the working directory and from ~/.vibe/ (agents as TOML, AGENTS.md, project config), what would a repo-root .vibe/ folder contain, and which parts should be generated mirrors of .skilled/ sources?
- [x] For each OpenCode surface this repository uses (plugins, spec gate, dispatch preflight hooks, session-relaunch loop, goal and context bridges, slash commands, custom agents, skills, MCP and Code Mode, permissions, self-invocation guard), does Vibe have an equivalent, a partial one or none, and what porting would it take?
- [x] What skill format does Vibe load and from where, and how do its slash-command skills and custom subagents map onto this repository's skills, commands and agent directories?
- [x] What hook system does Vibe expose, at which events, can a hook block a tool call, can the eight repo guards the DeepSeek Harness plugin carries be expressed there, and what are Vibe's approval and sandbox modes?
- [x] What would a cli-mistral-vibe executor kind need in the deep-loop runtime: the command builder, the environment allowlist, a closed model roster, dispatch-audit recognition and stress coverage?
- [x] Vibe speaks the Agent Client Protocol: is ACP a better dispatch surface than a print mode for this repository, and what would it change in the fan-out?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do not implement a `cli-mistral-vibe` runtime packet, plugin, or executor; this run produces findings and a ranked build plan only.
- Do not read, print, or persist any credential, API key, or `~/.vibe/` secret material.
- Do not modify the researched surfaces: the installed Vibe package, `.skilled/`, `.opencode/`, or any spec outside this lineage directory.
- Do not benchmark Mistral model quality; the question is runtime integration, not model capability.

---

## 5. STOP CONDITIONS

- Eight angles worked (one per iteration), or convergence on newInfoRatio.
- A live smoke dispatch is attempted at most twice in the whole lineage, and only as a one-turn `OK` request in a temp working directory.
- Any operation that would write outside the lineage directory stops that action and is recorded as a scope violation instead.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- How does Vibe run one task non-interactively: prompt as argument, stdin or file, which flags set model, agent profile, permissions, working directory and turn or time limits, what lands on stdout and stderr, and what are the exit codes on success, provider error, denied tool and timeout?
- How does Vibe authenticate (browser sign-in, API key, bring-your-own key), can a dispatch pin deepseek-v4-1-flash-1017 and zai-glm-5-3-flash, how is reasoning effort set, and which usage counter does a Vibe turn draw on?
- What does Vibe read from the working directory and from ~/.vibe/ (agents as TOML, AGENTS.md, project config), what would a repo-root .vibe/ folder contain, and which parts should be generated mirrors of .skilled/ sources?
- For each OpenCode surface this repository uses (plugins, spec gate, dispatch preflight hooks, session-relaunch loop, goal and context bridges, slash commands, custom agents, skills, MCP and Code Mode, permissions, self-invocation guard), does Vibe have an equivalent, a partial one or none, and what porting would it take?
- What skill format does Vibe load and from where, and how do its slash-command skills and custom subagents map onto this repository's skills, commands and agent directories?
- What hook system does Vibe expose, at which events, can a hook block a tool call, can the eight repo guards the DeepSeek Harness plugin carries be expressed there, and what are Vibe's approval and sandbox modes?
- What would a cli-mistral-vibe executor kind need in the deep-loop runtime: the command builder, the environment allowlist, a closed model roster, dispatch-audit recognition and stress coverage?
- Vibe speaks the Agent Client Protocol: is ACP a better dispatch surface than a print mode for this repository, and what would it change in the fan-out?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the app-server Python instead of the CLI help. The help lists flags; `run_export.py` carries the exit taxonomy and the export contract in one docstring, which is exactly the part a governed executor needs and the part a help screen cannot show. (iteration 1)
- reading the config JSON schema instead of the docs. `vibe config schema` emits the complete typed surface — provider fields, the `allowed_models` glob/regex semantics, the thinking ladder — which no help screen exposes and which is authoritative because it is generated from the model. (iteration 2)
- reading `_local_config_files.py` before any doc. It is 96 lines and names every directory Vibe will ever look at, which turns "what would a `.vibe/` contain" from a guess into a transcription. (iteration 3)
- reading the plugin catalog and the hook model before writing any row. The distinction that decides most of the table is "can a plugin run code on an event" — no — and "can a hook block a call" — yes for three event types. Everything else follows from those two facts. (iteration 4)
- reading `manager.py`'s claimant order rather than only the model. The frontmatter tells you what a skill *is*; the claimant order tells you which one you actually get, which is the part a mirror can silently break. (iteration 5)
- reading the DSH adapter table beside the Vibe event enum. The two lists are the same shape — event, scope, deny policy — so the mapping fell out row by row instead of needing a design. (iteration 6)
- reading one complete adapter (`cli-pi`) instead of all eight. The adapters are deliberately uniform — preflight, roster, mapping, args, finalize — so one full example plus the shared finalizer gives the whole contract, and the per-kind differences live in the tables that were read separately. (iteration 7)
- comparing on the fan-out's actual requirements rather than on protocol richness. ACP is unambiguously the richer protocol; it is not the better dispatch surface for a one-process-per-lineage runner, and separating "richer" from "better fit" is what made the recommendation usable. (iteration 8)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- `strings` on the Rust binary. Serde does not emit literal field names, so binary archaeology cannot recover a JSON schema; only an authenticated run or upstream source can. (iteration 1)
- searching for a reasoning-effort flag. The absence is itself the finding, but it cost two calls to establish because an absence has to be proven twice (binary flag table and Python call sites). (iteration 2)
- looking for a reusable mirror generator. Each runtime's sync scripts are bespoke, so the answer is "write one", not "reuse one" — worth knowing before a build phase estimates effort. (iteration 3)
- looking for `run_typescript` in the Rust binary. It is a harness-provided tool documented in the local-harness package, not a string in the CLI binary, so the binary search was the wrong place. (iteration 4)
- looking for a command directory. There is none, so the search produced a negative that had to be confirmed from the registry instead of from a path constant. (iteration 5)
- assuming the goal bridge had no mechanism. Iteration 4 read the prompt-loading path and stopped there; the host-hook docstring, twenty lines long, was the missing piece. (iteration 6)
- looking for the env allowlist in `fanout-run.cjs`. It lives in `executor-audit.ts`, because the audit owns the spawn. Splitting the read across the two files cost a call but produced the more useful fact: the allowlist and the recursion guard are the same module. (iteration 7)
- there was no way to measure the cost side. Every latency claim would have needed an authenticated session, and the smoke budget was gone. The comparison is therefore structural, and says so. (iteration 8)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Assuming `.vibe/` is recursive like `.opencode/`: discovery examines only the root, so nested `.vibe/` folders in subpackets are invisible. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Assuming `.vibe/` is recursive like `.opencode/`: discovery examines only the root, so nested `.vibe/` folders in subpackets are invisible.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming `.vibe/` is recursive like `.opencode/`: discovery examines only the root, so nested `.vibe/` folders in subpackets are invisible.

### Assuming `strict` works on every hook type: the validator rejects it outside the three tool/agent events, so a design that relies on a blocking `session_end` hook fails at config parse. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Assuming `strict` works on every hook type: the validator rejects it outside the three tool/agent events, so a design that relies on a blocking `session_end` hook fails at config parse.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming `strict` works on every hook type: the validator rejects it outside the three tool/agent events, so a design that relies on a blocking `session_end` hook fails at config parse.

### Assuming a same-name skill merges across scopes: the manager shadows the loser, so a project skill cannot extend a global one. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Assuming a same-name skill merges across scopes: the manager shadows the loser, so a project skill cannot extend a global one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming a same-name skill merges across scopes: the manager shadows the loser, so a project skill cannot extend a global one.

### Assuming slash commands port one-to-one. Vibe has no user command file format, so a command with argument templating has to become a skill with a different invocation contract. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Assuming slash commands port one-to-one. Vibe has no user command file format, so a command with argument templating has to become a skill with a different invocation contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming slash commands port one-to-one. Vibe has no user command file format, so a command with argument templating has to become a skill with a different invocation contract.

### Assuming the built-in catalog can name an OpenCode model id: the catalog is Mistral's, so a foreign id needs a provider entry. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Assuming the built-in catalog can name an OpenCode model id: the catalog is Mistral's, so a foreign id needs a provider entry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming the built-in catalog can name an OpenCode model id: the catalog is Mistral's, so a foreign id needs a provider entry.

### Assuming Vibe reads a repo-root config file by default: it walks up to the trust root and stops at the home directory, and an untrusted directory's `.vibe/config.toml` does not apply. A mirror therefore needs the working directory trusted (`--trust` or the trust store) before any of it takes effect. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Assuming Vibe reads a repo-root config file by default: it walks up to the trust root and stops at the home directory, and an untrusted directory's `.vibe/config.toml` does not apply. A mirror therefore needs the working directory trusted (`--trust` or the trust store) before any of it takes effect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming Vibe reads a repo-root config file by default: it walks up to the trust root and stops at the home directory, and an untrusted directory's `.vibe/config.toml` does not apply. A mirror therefore needs the working directory trusted (`--trust` or the trust store) before any of it takes effect.

### Comparing the actual usage counter for the *same* model on the *same* key across Vibe and OpenCode. That needs an authenticated dispatch on both runtimes and a billing read, which is out of budget and would consume the operator's quota. Left as an explicit open question for a later phase. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Comparing the actual usage counter for the *same* model on the *same* key across Vibe and OpenCode. That needs an authenticated dispatch on both runtimes and a billing read, which is out of budget and would consume the operator's quota. Left as an explicit open question for a later phase.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Comparing the actual usage counter for the *same* model on the *same* key across Vibe and OpenCode. That needs an authenticated dispatch on both runtimes and a billing read, which is out of budget and would consume the operator's quota. Left as an explicit open question for a later phase.

### Confirming that `vibe-rs` is the process name the ancestor walk sees. The launcher `execvpe`s the binary, so the process image is `vibe-rs` while the command the operator typed is `vibe`. Both names must be in the guard's match set; a live dispatch would confirm which one appears, and none was in budget. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Confirming that `vibe-rs` is the process name the ancestor walk sees. The launcher `execvpe`s the binary, so the process image is `vibe-rs` while the command the operator typed is `vibe`. Both names must be in the guard's match set; a live dispatch would confirm which one appears, and none was in budget.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Confirming that `vibe-rs` is the process name the ancestor walk sees. The launcher `execvpe`s the binary, so the process image is `vibe-rs` while the command the operator typed is `vibe`. Both names must be in the guard's match set; a live dispatch would confirm which one appears, and none was in budget.

### Confirming which of the seven mirrors' generation scripts would be reusable for Vibe. The scripts are per-runtime (`sync-skills-dsh.cjs`, `sync-prompts-dsh.cjs`, and so on), so a Vibe mirror needs its own writers rather than a parameterised one. Out of scope for a research pass. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Confirming which of the seven mirrors' generation scripts would be reusable for Vibe. The scripts are per-runtime (`sync-skills-dsh.cjs`, `sync-prompts-dsh.cjs`, and so on), so a Vibe mirror needs its own writers rather than a parameterised one. Out of scope for a research pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Confirming which of the seven mirrors' generation scripts would be reusable for Vibe. The scripts are per-runtime (`sync-skills-dsh.cjs`, `sync-prompts-dsh.cjs`, and so on), so a Vibe mirror needs its own writers rather than a parameterised one. Out of scope for a research pass.

### Declaring `reasoningEffort` for `cli-mistral-vibe`: Vibe has no flag for it, and the unsupported-field scan would reject the config or the kind would silently drop it. The honest mapping is a model-level `thinking` setting in the generated Vibe config. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Declaring `reasoningEffort` for `cli-mistral-vibe`: Vibe has no flag for it, and the unsupported-field scan would reject the config or the kind would silently drop it. The honest mapping is a model-level `thinking` setting in the generated Vibe config.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Declaring `reasoningEffort` for `cli-mistral-vibe`: Vibe has no flag for it, and the unsupported-field scan would reject the config or the kind would silently drop it. The honest mapping is a model-level `thinking` setting in the generated Vibe config.

### Determining whether the 32-subagent default is a hard ceiling or a soft one under load. It is a config field with a documented failure mode ("a spawn beyond this fails"), so the answer is "hard until raised", and no live multi-subagent run was in budget. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Determining whether the 32-subagent default is a hard ceiling or a soft one under load. It is a config field with a documented failure mode ("a spawn beyond this fails"), so the answer is "hard until raised", and no live multi-subagent run was in budget.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Determining whether the 32-subagent default is a hard ceiling or a soft one under load. It is a config field with a documented failure mode ("a spawn beyond this fails"), so the answer is "hard until raised", and no live multi-subagent run was in budget.

### Expressing `completion-evidence` or `ask-surface-guard` as Vibe hooks: both bind to a turn-stopping moment Vibe does not expose, and no other event fires there. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Expressing `completion-evidence` or `ask-surface-guard` as Vibe hooks: both bind to a turn-stopping moment Vibe does not expose, and no other event fires there.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Expressing `completion-evidence` or `ask-surface-guard` as Vibe hooks: both bind to a turn-stopping moment Vibe does not expose, and no other event fires there.

### Extracting the `--output json` / `--output streaming` event schema without an authenticated dispatch. The schema is Rust-side and not mirrored in the Python package. Candidate for the second and last allowed live dispatch, or for an upstream source read. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Extracting the `--output json` / `--output streaming` event schema without an authenticated dispatch. The schema is Rust-side and not mirrored in the Python package. Candidate for the second and last allowed live dispatch, or for an upstream source read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Extracting the `--output json` / `--output streaming` event schema without an authenticated dispatch. The schema is Rust-side and not mirrored in the Python package. Candidate for the second and last allowed live dispatch, or for an upstream source read.

### Finding a Vibe equivalent for the goal object. There is no goal model, no goal file, and no prompt-rewriting hook; the concept has no home in 3.1.2. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Finding a Vibe equivalent for the goal object. There is no goal model, no goal file, and no prompt-rewriting hook; the concept has no home in 3.1.2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Finding a Vibe equivalent for the goal object. There is no goal model, no goal file, and no prompt-rewriting hook; the concept has no home in 3.1.2.

### Finding an in-process hook API. Every hook is an external command; there is no Python or JavaScript handler registry, so a guard that needs to inspect structured tool arguments must parse them from the hook payload. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Finding an in-process hook API. Every hook is an external command; there is no Python or JavaScript handler registry, so a guard that needs to inspect structured tool arguments must parse them from the hook payload.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Finding an in-process hook API. Every hook is an external command; there is no Python or JavaScript handler registry, so a guard that needs to inspect structured tool arguments must parse them from the hook payload.

### Looking for a `--reasoning-effort` flag: the Rust flag table has no such flag, and every Python `reasoning_effort` call site is protocol- or config-level. The flag does not exist in 3.1.2. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for a `--reasoning-effort` flag: the Rust flag table has no such flag, and every Python `reasoning_effort` call site is protocol- or config-level. The flag does not exist in 3.1.2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a `--reasoning-effort` flag: the Rust flag table has no such flag, and every Python `reasoning_effort` call site is protocol- or config-level. The flag does not exist in 3.1.2.

### Measuring ACP's real startup and per-turn latency against print mode. That needs an authenticated client and a live session, and the lineage's two-dispatch budget was already spent on the unauthenticated smoke in iteration 1. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Measuring ACP's real startup and per-turn latency against print mode. That needs an authenticated client and a live session, and the lineage's two-dispatch budget was already spent on the unauthenticated smoke in iteration 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Measuring ACP's real startup and per-turn latency against print mode. That needs an authenticated client and a live session, and the lineage's two-dispatch budget was already spent on the unauthenticated smoke in iteration 1.

### Mirroring `.skilled/commands/` into a `.vibe/commands/` directory: no such directory is read anywhere in the discovery code, and the slash-command registry is a closed builtin set plus skills. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Mirroring `.skilled/commands/` into a `.vibe/commands/` directory: no such directory is read anywhere in the discovery code, and the slash-command registry is a closed builtin set plus skills.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mirroring `.skilled/commands/` into a `.vibe/commands/` directory: no such directory is read anywhere in the discovery code, and the slash-command registry is a closed builtin set plus skills.

### Reading the headless JSON schema out of the Rust binary with `strings`: the serde structs do not leave literal JSON key names in the binary (only two `{"type":` fragments), so the exact `--output json` payload shape stays unconfirmed. Replaced by the `export.json` contract, which is Python-side and fully readable. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading the headless JSON schema out of the Rust binary with `strings`: the serde structs do not leave literal JSON key names in the binary (only two `{"type":` fragments), so the exact `--output json` payload shape stays unconfirmed. Replaced by the `export.json` contract, which is Python-side and fully readable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the headless JSON schema out of the Rust binary with `strings`: the serde structs do not leave literal JSON key names in the binary (only two `{"type":` fragments), so the exact `--output json` payload shape stays unconfirmed. Replaced by the `export.json` contract, which is Python-side and fully readable.

### Replacing the print-mode dispatch with ACP in this phase: it would require a protocol client and an outcome-persistence layer before it produced a single finding, and it would lose the export contract the audit path already reads. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Replacing the print-mode dispatch with ACP in this phase: it would require a protocol client and an outcome-persistence layer before it produced a single finding, and it would lose the export contract the audit path already reads.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing the print-mode dispatch with ACP in this phase: it would require a protocol client and an outcome-persistence layer before it produced a single finding, and it would lose the export contract the audit path already reads.

### Reusing the `cli-opencode` adapter with a different binary: the argument grammar differs on every axis (prompt delivery, output format, approval flags, limits). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Reusing the `cli-opencode` adapter with a different binary: the argument grammar differs on every axis (prompt delivery, output format, approval flags, limits).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing the `cli-opencode` adapter with a different binary: the argument grammar differs on every axis (prompt delivery, output format, approval flags, limits).

### Treating `vibe --help` as the whole contract: it is complete for flags but silent on exit codes and on the export, which only the app server documents. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `vibe --help` as the whole contract: it is complete for flags but silent on exit codes and on the export, which only the app server documents.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `vibe --help` as the whole contract: it is complete for flags but silent on exit codes and on the export, which only the app server documents.

### Treating `vibe-acp` as a thin wrapper over `vibe -p`: it is a separate entrypoint with its own capability negotiation and no flag surface. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating `vibe-acp` as a thin wrapper over `vibe -p`: it is a separate entrypoint with its own capability negotiation and no flag surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `vibe-acp` as a thin wrapper over `vibe -p`: it is a separate entrypoint with its own capability negotiation and no flag surface.

### Treating Vibe plugins as an OpenCode plugin port target. A `plugin.json` bundle cannot run arbitrary code on runtime events, so the 24 JS plugins cannot be moved as plugins; they must be reclassified into hooks and skills first. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating Vibe plugins as an OpenCode plugin port target. A `plugin.json` bundle cannot run arbitrary code on runtime events, so the 24 JS plugins cannot be moved as plugins; they must be reclassified into hooks and skills first.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Vibe plugins as an OpenCode plugin port target. A `plugin.json` bundle cannot run arbitrary code on runtime events, so the 24 JS plugins cannot be moved as plugins; they must be reclassified into hooks and skills first.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Extracting the `--output json` / `--output streaming` event schema without an authenticated dispatch. The schema is Rust-side and not mirrored in the Python package. Candidate for the second and last allowed live dispatch, or for an upstream source read. (iteration 1)
- Reading the headless JSON schema out of the Rust binary with `strings`: the serde structs do not leave literal JSON key names in the binary (only two `{"type":` fragments), so the exact `--output json` payload shape stays unconfirmed. Replaced by the `export.json` contract, which is Python-side and fully readable. (iteration 1)
- Treating `vibe --help` as the whole contract: it is complete for flags but silent on exit codes and on the export, which only the app server documents. (iteration 1)
- Assuming the built-in catalog can name an OpenCode model id: the catalog is Mistral's, so a foreign id needs a provider entry. (iteration 2)
- Comparing the actual usage counter for the *same* model on the *same* key across Vibe and OpenCode. That needs an authenticated dispatch on both runtimes and a billing read, which is out of budget and would consume the operator's quota. Left as an explicit open question for a later phase. (iteration 2)
- Looking for a `--reasoning-effort` flag: the Rust flag table has no such flag, and every Python `reasoning_effort` call site is protocol- or config-level. The flag does not exist in 3.1.2. (iteration 2)
- Assuming `.vibe/` is recursive like `.opencode/`: discovery examines only the root, so nested `.vibe/` folders in subpackets are invisible. (iteration 3)
- Assuming Vibe reads a repo-root config file by default: it walks up to the trust root and stops at the home directory, and an untrusted directory's `.vibe/config.toml` does not apply. A mirror therefore needs the working directory trusted (`--trust` or the trust store) before any of it takes effect. (iteration 3)
- Confirming which of the seven mirrors' generation scripts would be reusable for Vibe. The scripts are per-runtime (`sync-skills-dsh.cjs`, `sync-prompts-dsh.cjs`, and so on), so a Vibe mirror needs its own writers rather than a parameterised one. Out of scope for a research pass. (iteration 3)
- Assuming slash commands port one-to-one. Vibe has no user command file format, so a command with argument templating has to become a skill with a different invocation contract. (iteration 4)
- Finding a Vibe equivalent for the goal object. There is no goal model, no goal file, and no prompt-rewriting hook; the concept has no home in 3.1.2. (iteration 4)
- Treating Vibe plugins as an OpenCode plugin port target. A `plugin.json` bundle cannot run arbitrary code on runtime events, so the 24 JS plugins cannot be moved as plugins; they must be reclassified into hooks and skills first. (iteration 4)
- Assuming a same-name skill merges across scopes: the manager shadows the loser, so a project skill cannot extend a global one. (iteration 5)
- Determining whether the 32-subagent default is a hard ceiling or a soft one under load. It is a config field with a documented failure mode ("a spawn beyond this fails"), so the answer is "hard until raised", and no live multi-subagent run was in budget. (iteration 5)
- Mirroring `.skilled/commands/` into a `.vibe/commands/` directory: no such directory is read anywhere in the discovery code, and the slash-command registry is a closed builtin set plus skills. (iteration 5)
- Assuming `strict` works on every hook type: the validator rejects it outside the three tool/agent events, so a design that relies on a blocking `session_end` hook fails at config parse. (iteration 6)
- Expressing `completion-evidence` or `ask-surface-guard` as Vibe hooks: both bind to a turn-stopping moment Vibe does not expose, and no other event fires there. (iteration 6)
- Finding an in-process hook API. Every hook is an external command; there is no Python or JavaScript handler registry, so a guard that needs to inspect structured tool arguments must parse them from the hook payload. (iteration 6)
- Confirming that `vibe-rs` is the process name the ancestor walk sees. The launcher `execvpe`s the binary, so the process image is `vibe-rs` while the command the operator typed is `vibe`. Both names must be in the guard's match set; a live dispatch would confirm which one appears, and none was in budget. (iteration 7)
- Declaring `reasoningEffort` for `cli-mistral-vibe`: Vibe has no flag for it, and the unsupported-field scan would reject the config or the kind would silently drop it. The honest mapping is a model-level `thinking` setting in the generated Vibe config. (iteration 7)
- Reusing the `cli-opencode` adapter with a different binary: the argument grammar differs on every axis (prompt delivery, output format, approval flags, limits). (iteration 7)
- Measuring ACP's real startup and per-turn latency against print mode. That needs an authenticated client and a live session, and the lineage's two-dispatch budget was already spent on the unauthenticated smoke in iteration 1. (iteration 8)
- Replacing the print-mode dispatch with ACP in this phase: it would require a protocol client and an outcome-persistence layer before it produced a single finding, and it would lose the export contract the audit path already reads. (iteration 8)
- Treating `vibe-acp` as a thin wrapper over `vibe -p`: it is a separate entrypoint with its own capability negotiation and no flag surface. (iteration 8)

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
- The exact `--output json` and `--output streaming` payload shapes. (iteration 1)
- Whether a denied tool call changes the process exit code or only returns a denial to the model. (iteration 1)
- The real counter delta for one identical model on one identical key across Vibe and OpenCode. (iteration 2)
- Whether a generated `.vibe/agents/*.toml` can carry this repository's agent personas without losing the frontmatter fields Vibe does not model. (iteration 3)
- Whether a `pre_tool` hook can see enough of the tool call (path, command, agent name) to express the spec gate and the self-invocation guard without a wrapper. (iteration 4)
- Whether a symlinked `.vibe/skills/<name>` keeps the configured directory name in skill metadata, which matters for provenance in a generated farm. (iteration 5)
- The exact JSON payload a hook receives and the exit-code or stdout-JSON contract it answers with. (iteration 6)
- Whether the ancestor-process guard sees `vibe` or `vibe-rs`, and therefore which basenames the match set needs. (iteration 7)
- ACP startup and per-turn latency versus print mode, which needs an authenticated client to measure. (iteration 8)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- Installed runtime: `vibe 3.1.2` at `/Users/michelkerkmeester/.local/bin/vibe`, a uv tool venv whose site-packages hold the Python source (`vibe/`, 517 `.py` files). `vibe-acp` and `vibe-app-server` ship beside it.
- Captured headless contract: `research/evidence/vibe-help.txt` (version, `vibe --help`, `vibe-acp --help`, `vibe-app-server --help`).
- Angle bank: `research-angles.md` in the parent phase packet, eight angles with per-angle questions and evidence rules.
- Comparison target: `.skilled/skills/cli-external-orchestration/cli-opencode/` (SKILL.md, hard-rules.json, references, assets) and the sibling `cli-pi` packet.
- Repo runtime surfaces: `.opencode/plugins/`, `.opencode/agents/`, `.opencode/commands/`, `.skilled/skills/`, `.skilled/agents/`.
- Hook-parity templates named by the angle bank: `001-cli-hermes-creation/010-hermes-hook-parity`, `002-cli-deepseek-harness-creation/015-dsh-hook-parity`.

### Bounded Context Snapshot

- Source pointers: Vibe Python package (`vibe/cli`, `vibe/core`, `vibe/plugins`, `vibe/acp`, `vibe/permissions.py`, `vibe/agents.py`, `vibe/config_values.py`); repo `cli-opencode` packet.
- Reuse candidates: existing `cli-opencode` hard-rules and permissions-matrix schema; the DeepSeek Harness plugin guard inventory.
- Integration points: deep-loop executor config, fan-out command builder, dispatch audit, model roster.
- Constraints and risks: no operator present; live dispatch limited to two smoke runs; `~/.vibe/` must never be written.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 8
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `.deep-research-pause` in the lineage directory
- Current generation: 1
- Started: 2026-11-14T12:25:15Z
