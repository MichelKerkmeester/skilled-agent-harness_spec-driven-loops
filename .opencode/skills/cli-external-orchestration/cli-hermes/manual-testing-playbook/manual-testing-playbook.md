---
title: "cli-hermes: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, evidence rules, orchestration guidance, and per-scenario validation files for the cli-hermes skill."
version: 1.2.0.0
---

# cli-hermes: Manual Testing Playbook

> **EXECUTION POLICY**: Every executable scenario MUST be executed for real - not mocked, not stubbed, and not classified as an unsupported automation case. AI agents executing these scenarios must run the actual Hermes commands in the sanctioned headless shape, inspect real output, capture stdout, stderr, exit code and elapsed seconds, and verify behavior from output content. Exit code alone is never proof: a Hermes run can exit 0 having delivered nothing, so every check tests stdout for content as well, which is what `HERMES-022` asserts. The only acceptable classifications are PASS, FAIL, or SKIP with a specific blocker. This playbook uses strict three-state verdict discipline throughout, including review and release readiness.

> **RECURSION BOUNDS**: This playbook must be run from a non-Hermes runtime. Hermes has in-process delegation of its own, so a Hermes session hands work out through `delegate_task` and never by re-dispatching this CLI; the `repo-guards` project plugin enforces that refusal, and `HERMES-018` proves it live. A dispatch from inside a fan-out lineage, or one whose kind already appears in the dispatch stack, is refused by the shared runtime and must be recorded as such if it fires.

This document is the operator directory and package-level validation contract for the `cli-hermes` skill. It defines realistic requests, deterministic command notation, evidence expectations, review rules, wave planning, category summaries, automated-test anchors, and links to the 36 canonical scenario files.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **Result persistence**: a scenario run is complete only after its `PASS`, `FAIL`, or `SKIP`
> outcome and reason are recorded into
> `cli-hermes/benchmark/reports/<dated-run-label>/`.

---

This playbook package follows the Feature Catalog split-document pattern. The root document owns shared policy and the directory index; each category file owns one scenario's full execution truth.

Canonical package artifacts:

- `manual-testing-playbook.md`
- `cli-invocation/`
- `permission-modes/`
- `agent-routing/`
- `prompt-templates/`
- `integration-patterns/`
- `session-continuity/`
- `cost-and-background/`
- `git-preflight-advisory/`
- `goal-hook/`
- `skills-and-plugins/`
- `stress/`

---

## 1. OVERVIEW

This playbook provides 37 deterministic scenarios across 11 categories validating the `cli-hermes` skill surface. Each scenario keeps its `HERMES-NNN` identifier (or `cli-hermes-EC-NNN` for the hermetic stress-matrix category) and links to one dedicated file with the complete execution contract.

Coverage note: the ten operator categories cover the sanctioned headless shape, the provider preflight, prompt transport, the closed model roster, the approval boundary and the read-only contract, persona and template delivery, empty-response detection, cross-model validation, MCP reach, session resumption, the two run bounds, the project plugin's advisory, goal and blocking surfaces, and project-skill loading. The eleventh category is the shared hermetic stress matrix, executed by the runtime suite rather than by an operator.

### Realistic Test Model

1. A realistic user request is given to an orchestrator running outside Hermes.
2. The orchestrator reads the `cli-hermes` routing and guard contract, selects the toolset and the approval posture deliberately, and constructs a bounded prompt.
3. The operator captures the exact command, stdout, stderr, exit code, elapsed seconds, changed-file state, and any provider or plugin blocker.
4. The scenario passes only when its stated observable signals are present and the user-visible outcome is useful. A named blocker produces SKIP, not an assumed success.

### What Each Scenario File Explains

- The realistic user request that should trigger the Hermes route
- The exact Hermes-facing prompt
- The expected toolset, approval, model and isolation choices
- The observable signals and evidence to capture
- The desired user-visible outcome
- The source files that justify the contract
- The recorded result of the latest execution pass

---

## 2. GLOBAL PRECONDITIONS

1. The working directory is the repository root and contains `.git/`.
2. Hermes is installed and available: `command -v hermes` returns a path and `hermes --version` returns a non-empty current runtime version.
3. The provider preflight is `hermes config get providers.llmgateway.base_url`, which prints the base URL and exits 0. **`hermes status` is not a usable preflight**: it reads the built-in provider catalog only, so on a correctly configured machine it reports `Model: (not set)` and `Provider: Auto` while every dispatch works. `HERMES-021` records both readings side by side.
4. Dispatches use only the two roster model ids. An off-roster id fails with exit 1 and a gateway diagnostic on stdout, which `HERMES-003` proves deliberately.
5. Every dispatch closes stdin with `</dev/null` or feeds it through `--query-file -`. An inherited terminal stdin can hang with zero output.
6. Every dispatch is bounded by an outer wall-clock alarm. macOS has no `timeout`; use `perl -e 'alarm N; exec @ARGV' -- hermes ...`. The package's standard bound is 300 seconds per dispatch.
7. Every dispatch is judged on stdout content, not on its exit code. A run that exits 0 with empty or fragmentary stdout has failed, and the caller's byte-and-content gate is what catches it.
8. The `cli-hermes` skill references and assets exist under `.opencode/skills/cli-external-orchestration/cli-hermes/{references,assets}/`.
9. The project surfaces exist before execution: `.hermes/skills/<name>/SKILL.md` generated copies (`sync-skills-hermes.cjs --check` passes), `.hermes/prompts/*.md`, `.hermes/plugins/repo-guards/`, and `.hermes/SYNC.md`.
10. Scenarios that exercise the project plugin set `HERMES_ENABLE_PROJECT_PLUGINS=1` and require `repo-guards` to be listed under `plugins.enabled` in the user-level config. Both are operator steps; `hermes plugins list` does not display project plugins, so the load proof is the `repo-guards-session-context` line in `~/.hermes/logs/agent.log`.
11. Scenarios that bind a packet goal set `HERMES_SPEC_FOLDER` to a repository-relative packet path holding a `goal.md`.
12. No scenario runs an operator-owned management command. `hermes skills trust`, `hermes mcp add`, `hermes plugins install|enable`, `hermes config set`, `hermes import-agent`, `hermes setup` and `hermes model` are out of scope and are recorded as SKIP blockers when a scenario would need one. `hermes config get` is a read and is permitted.
13. Destructive scenarios operate only inside a disposable directory created under the session scratchpad, or carry `--dry-run`. No scenario deletes, moves or overwrites anything inside the repository, the operator's home, or `~/.hermes`.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The realistic user request and the exact Hermes prompt
- The complete command sequence, including the outer `perl -e 'alarm N'` bound and any `HERMES_ENABLE_PROJECT_PLUGINS=1`, `SPECKIT_HERMES_READ_ONLY=1` or `HERMES_SPEC_FOLDER=...` prefix
- Hermes stdout and stderr captured **separately**, because the response is on stdout and `session_id:` and `Error:` are on stderr
- Exit code, stdout byte count and measured elapsed seconds recorded alongside output content; exit code alone is never proof
- The captured `session_id` for every dispatch, so a later scenario can resume it and so the agent log can be searched for that session
- Host-side log lines from `~/.hermes/logs/agent.log` where the scenario names one: the plugin's prompt-section line, the budget wrap-up notice, the max-iterations line, or a deferred-tool error
- Relevant file snapshots, existence checks, counts and diffs for any scenario that writes or deletes, plus HEAD before and after for any git scenario
- Provider, plugin, trust or MCP blockers named exactly where they occur
- The final user-visible outcome and a PASS, FAIL, or SKIP verdict
- For negative controls, an explicit statement of what was held constant and what single variable changed
- Where a dispatch had to be written into a scratch shell script to get past this environment's own PreToolUse guard, that fact stated in the evidence

---

## 4. DETERMINISTIC COMMAND NOTATION

- Hermes dispatches are written in the sanctioned headless shape: `hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model <roster-id> --reasoning <level> -t <explicit list> [--yolo] [--max-turns N] [--run-budget S] (-q "..." | --query-file -) </dev/null`.
- **The read-only shape is `-t file,todo`**, plus `web` when web search is wanted, with no `--yolo` and with `SPECKIT_HERMES_READ_ONLY=1` in the environment. Hermes's `search` toolset is web search, and `read_file` and `search_files` ship inside `file` alongside the write tools, so no toolset list expresses read-only on its own; the `repo-guards` plugin supplies the refusal.
- **The write shape is `-t terminal,file,skills,todo,web --yolo`.** `--yolo` is required exactly when `terminal` is in the list.
- The toolset list is always explicit and never contains `delegation` or `memory`.
- `--ignore-rules` is passed on every dispatch except one that preloads a project skill with `-s`, because the flag also suppresses the preload.
- Every dispatch is wrapped as `perl -e 'alarm 300; exec @ARGV' -- hermes ...` because macOS provides no `timeout`.
- Availability and provider checks are written as `bash: command -v hermes` and `bash: hermes config get providers.llmgateway.base_url`.
- A scenario's sequential steps are separated by `->` in a command-sequence cell.
- Output capture is written as `>out.txt 2>err.txt`; stdout and stderr are never merged.
- `<scratch>` denotes the session scratchpad directory; `<scratch-repo>` denotes a disposable git fixture inside it.
- A command that reaches a provider error is not a successful model dispatch; classify the relevant model-turn check by its own criteria and name the blocker.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md`
2. All 37 linked scenario files under the eleven category folders
3. Real command transcripts or cited captured evidence for every executable scenario
4. The scenario-to-feature coverage map in §18
5. Triage notes for every FAIL or SKIP result

### Scenario Acceptance Rules

For each scenario, check:

1. Preconditions and isolation boundaries were satisfied.
2. The exact prompt and command sequence were used.
3. Expected output, file, log or tool signals are present.
4. Exit code and stdout byte count are recorded as supporting evidence, never as the sole success signal.
5. The verdict rationale is explicit and reproducible.

Scenario verdict:

- `PASS`: every acceptance check in the scenario's declared scope is true.
- `FAIL`: an expected behavior is contradicted, a required command fails for a reason within the scenario's scope, or the evidence is incomplete without a valid blocker.
- `SKIP`: a specific named blocker prevents the declared check, such as a missing provider block, a missing trust grant, or an operator-owned management step.

### Feature Verdict Rules

- `PASS`: all mapped scenarios are PASS, or a documented SKIP is outside the feature's executable core.
- `FAIL`: any mapped scenario has an unexplained FAIL.

### Release Readiness Rule

Release is `READY` only when:

1. No scenario has an unresolved FAIL.
2. The critical baseline scenarios `HERMES-001`, `HERMES-002`, `HERMES-004`, `HERMES-005`, `HERMES-006`, `HERMES-007`, `HERMES-018` and `HERMES-021` have evidence or a still-valid named blocker.
3. Coverage is 100%: all 37 root-index IDs map to exactly one scenario file.
4. Every SKIP carries a specific blocker and a safe re-run condition.
5. The root document and all scenario files pass the required document and link checks.

### Root-vs-Scenario Rule

Keep global verdict logic, isolation policy, and wave planning here. Keep exact prompts, command transcripts, feature-specific caveats, and scenario verdicts in the matching scenario files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records safe execution waves for the manual-testing package. It does not grant Hermes permission to become the outer conductor or to bypass the current runtime's evidence rules.

### Operational Rules

1. Reserve one coordinator on the calling AI side; never nest Hermes coordinators.
2. Run read-only checks in parallel when they share no mutable fixture.
3. Serialize scenarios that share a disposable fixture directory or touch the working repository's git state.
4. Pre-assign `HERMES-NNN` IDs and their exact scenario files before a wave starts.
5. Run `HERMES-021` before anything else: it is the provider preflight, and it costs one second.
6. Run `HERMES-001` next in every pass: it is the liveness gate and it supplies the session id `HERMES-011` resumes.
7. Run each permission pair together and in order, so the approval flag is the only variable between them.
8. After each wave, retain the transcript, output files, exit code, byte count, elapsed seconds and blocker classification before starting the next wave.
9. Never use a provider-backed result from one scenario as evidence for a different scenario's prompt or model contract.

### Recommended Wave Layout

- Wave 1, preflight and static checks: `HERMES-021`, `HERMES-001`, `HERMES-003`, `HERMES-017`
- Wave 2, prompt transport and templates: `HERMES-002`, `HERMES-008`, `HERMES-009`, `HERMES-022`, `HERMES-023`
- Wave 3, the permission set, serialized within each pair: `HERMES-004` then `HERMES-005`, `HERMES-006` then `HERMES-007`
- Wave 4, bounds and continuity: `HERMES-012`, `HERMES-013`, `HERMES-011`
- Wave 5, project plugin surfaces, each with `HERMES_ENABLE_PROJECT_PLUGINS=1`: `HERMES-014`, `HERMES-015`, `HERMES-020`, `HERMES-018`
- Wave 6, skills and integration: `HERMES-016`, `HERMES-010`, `HERMES-019`
- Wave 7, the hermetic stress matrix, executed by the runtime suite: `cli-hermes-EC-001` .. `cli-hermes-EC-014`

### What Belongs In Scenario Files

- One realistic user request and one canonical prompt
- One exact command sequence
- Expected signals and captured evidence
- PASS, FAIL, or SKIP criteria
- Scenario-specific rollback, credential, or isolation boundaries

---

## 7. CLI INVOCATION (`HERMES-001..HERMES-003`, `HERMES-021`)

This category covers the sanctioned headless shape, the provider preflight and the status screen that is not one, the verbatim `--query-file -` transport, and the closed roster's fail-fast rejection of an off-roster model id.

- `HERMES-001`: [Sanctioned headless smoke](cli-invocation/sanctioned-headless-smoke.md)
- `HERMES-002`: [Query-file verbatim round trip](cli-invocation/query-file-verbatim-round-trip.md)
- `HERMES-003`: [Off-roster model rejection](cli-invocation/off-roster-model-rejection.md)
- `HERMES-021`: [Provider preflight probe](cli-invocation/provider-preflight-probe.md)

---

## 8. PERMISSION MODES (`HERMES-004..HERMES-007`)

This category fixes the approval boundary in place, and it is where the first pass's biggest correction landed.

`--yolo` does **not** govern ordinary writes: an unflagged write succeeds without it, and the flag is required exactly when `terminal` is in the toolset list. What `--yolo` governs is the subset of tool calls Hermes flags against its own dangerous-command patterns, plus writes whose immediate parent directory is `.hermes`. In single-query mode those calls are refused outright, because no user is present to approve them; with `--yolo` they run.

Read-only is a separate mechanism, not the absence of `--yolo` and not a narrowed toolset. Hermes's `search` toolset is web search, and `read_file` and `search_files` ship inside `file` alongside `write_file` and `patch`, so no toolset list grants reading without also granting writing. The read-only shape is `-t file,todo` plus `SPECKIT_HERMES_READ_ONLY=1`, and the `repo-guards` plugin refuses `write_file`, `patch`, `terminal`, `process_manage` and `execute_code` for that leaf.

- `HERMES-004`: [Dangerous command blocked without --yolo](permission-modes/dangerous-command-blocked-without-yolo.md)
- `HERMES-005`: [Dangerous command runs with --yolo](permission-modes/dangerous-command-runs-with-yolo.md)
- `HERMES-006`: [Ordinary write without --yolo](permission-modes/ordinary-write-without-yolo.md)
- `HERMES-007`: [Read-only leaf refuses its write tools](permission-modes/read-only-leaf-refuses-writes.md)

---

## 9. AGENT ROUTING (`HERMES-008`, `HERMES-023`)

This category proves the inlined-persona route. Hermes has no flag that loads an agent file, so a persona reaches a dispatch only inside the prompt; the generated `.hermes/prompts/*.md` templates are the repeatable vehicle.

- `HERMES-008`: [Inlined persona via the agent-router template](agent-routing/inlined-persona-via-agent-router-template.md)
- `HERMES-023`: [Persona via the agent skill mirror and the plugin binding](agent-routing/persona-via-agent-skill-and-plugin.md)

---

## 10. PROMPT TEMPLATES (`HERMES-009`, `HERMES-022`)

This category repeats the template round trip against a second, much larger canonical command file, and keeps the caller-side gate that catches a run which exits 0 without delivering an answer.

- `HERMES-009`: [Second template round trip](prompt-templates/create-manual-testing-playbook-template-round-trip.md)
- `HERMES-022`: [Empty-stdout detection](prompt-templates/empty-stdout-detection.md)

---

## 11. INTEGRATION PATTERNS (`HERMES-010`, `HERMES-019`)

This category covers the cross-validation pattern across both roster models and the toolset gating of a configured MCP server.

- `HERMES-010`: [Cross-model validation pair](integration-patterns/cross-model-validation-pair.md)
- `HERMES-019`: [MCP code_mode reach](integration-patterns/mcp-code-mode-reach.md)

---

## 12. SESSION CONTINUITY (`HERMES-011`)

This category proves `--resume` reattaches a headless dispatch to a captured session id with its history intact.

- `HERMES-011`: [Resume a captured session id](session-continuity/resume-captured-session-id.md)

---

## 13. COST AND BACKGROUND (`HERMES-012..HERMES-013`)

This category records how the two run bounds actually behave: `--run-budget` is a wrap-up signal that the run overshoots and that ends in exit 0 with a partial answer, while `--max-turns` stops the loop outright. Both leave a host-side line in `~/.hermes/logs/agent.log`, which is the durable signal rather than the model's prose.

- `HERMES-012`: [Run-budget expiry](cost-and-background/run-budget-expiry.md)
- `HERMES-013`: [Max-turns bound](cost-and-background/max-turns-bound.md)

---

## 14. GIT PREFLIGHT ADVISORY (`HERMES-014`)

This category proves the repo's sk-git preflight advisory reaches a Hermes session. The `repo-guards` plugin runs the shared advisory core for a git-shaped terminal command and appends its text to the tool result through `transform_tool_result`, because Hermes's `pre_tool_call` directive can only block, approve or modify. The advisory fires only on a genuine sk-git rule violation; a clean shape stays silent.

- `HERMES-014`: [Git preflight advisory delivery](git-preflight-advisory/git-advisory-delivery.md)

---

## 15. GOAL HOOK (`HERMES-015`, `HERMES-020`)

This category checks the plugin's system-prompt section surface, which is how the repo's session-start context reaches a Hermes session given that Hermes ignores an `on_session_start` callback's return value. With `HERMES_SPEC_FOLDER` set, that section also carries the bound packet's path and its durable goal slice.

- `HERMES-015`: [Plugin session-context section](goal-hook/plugin-session-context-section.md)
- `HERMES-020`: [Bound packet goal slice](goal-hook/bound-packet-goal-slice.md)

---

## 16. SKILLS AND PLUGINS (`HERMES-016..HERMES-018`)

This category covers project-skill preloading with its negative control, the deliberate absence of project rows from `hermes skills list`, and the plugin's self-dispatch refusal.

- `HERMES-016`: [Project skill preload](skills-and-plugins/project-skill-preload.md)
- `HERMES-017`: [Skills list omits project skills](skills-and-plugins/skills-list-omits-project-skills.md)
- `HERMES-018`: [Plugin self-dispatch refusal](skills-and-plugins/plugin-self-dispatch-refusal.md)

---

## 17. CURRENT EXECUTION BOUNDARIES

Operator-owned management commands are a hard boundary: the trust grant, the MCP server registration, the provider block, the `plugins.enabled` entry and any config write belong to the operator and are never performed by a dispatch. A scenario that would need one records SKIP with that exact step named. `hermes config get` is a read and stays in scope.

Two behaviours shape how a dispatch is written rather than blocking it. `--ignore-rules` suppresses preloaded-skill injection, so a `-s` dispatch omits it under the hard rule's own documented exception, which `HERMES-016` exercises. And exit 0 does not imply a delivered answer, so every caller gates on stdout content as well, which `HERMES-022` asserts and `HERMES-009` was the original casualty of.

---

## 18. AUTOMATED TEST CROSS-REFERENCE

The `cli-hermes` skill is an orchestrator wrapper around the Hermes binary and the operator's user-level configuration; the manual playbook remains the operator-visible validation surface for dispatch behavior.

| Test Surface | Coverage | Playbook Overlap |
|---|---|---|
| `.opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md` | Routing, self-invocation guard, dispatch shape, the closed roster, and the hard rules | `HERMES-001`, `HERMES-003`, `HERMES-004`, `HERMES-007`, `HERMES-016`, `HERMES-018` |
| `.opencode/skills/cli-external-orchestration/cli-hermes/references/cli-reference.md` | Flags, headless forms, exit codes, the non-empty-stdout requirement, approvals, isolation, environment | `HERMES-001`, `HERMES-002`, `HERMES-003`, `HERMES-011`, `HERMES-012`, `HERMES-013`, `HERMES-021`, `HERMES-022` |
| `.opencode/skills/cli-external-orchestration/cli-hermes/references/hermes-tools.md` | Toolsets, repo-local skills, project plugins, the `.hermes/` write guard | `HERMES-007`, `HERMES-016`, `HERMES-017`, `HERMES-019` |
| `.opencode/skills/cli-external-orchestration/cli-hermes/references/mcp-policy.md` | Operator MCP steps and deny-by-default per tool | `HERMES-019` |
| `.opencode/skills/cli-external-orchestration/cli-hermes/references/hook-contract.md` | Shell hooks versus the project plugin, and the hook map for the repo's guard cores | `HERMES-007`, `HERMES-014`, `HERMES-015`, `HERMES-020`, `HERMES-018` |
| `.hermes/plugins/repo-guards/__init__.py` | Read-only refusal, self-dispatch refusal, deny forwarding, `transform_tool_result`, the system-prompt section and its goal slice, `pre_verify`, `on_session_end` | `HERMES-007`, `HERMES-014`, `HERMES-015`, `HERMES-020`, `HERMES-018` |
| `.opencode/hooks/git-preflight/shared/git-preflight-advisory.mjs` | The shared sk-git advisory core the plugin shells out to for git-shaped commands | `HERMES-014` |
| `.hermes/prompts/*.md` and `sync-prompts-hermes.cjs` | Generated prompt templates and their drift check | `HERMES-008`, `HERMES-009`, `HERMES-022` |
| `.opencode/hooks/dispatch/devin/dispatch-preflight-lint.mjs` | The shared dispatch preflight core, whose deny decision the plugin forwards | `HERMES-014`, `HERMES-018` |
| `.opencode/skills/sk-doc/shared/scripts/validate_document.py` | Root markdown structure validation | This root playbook |
| `.opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-hermes.vitest.ts` | Hermetic fan-out, lineage, timeout, and transport stress cells for the `cli-hermes` adapter | `cli-hermes-EC-001` .. `cli-hermes-EC-014` |

There is no substitute automated test for a provider-backed Hermes model turn, the live approval boundary, the read-only refusal, project-skill loading, template delivery, goal-slice delivery, or MCP reach through the toolset list. Each of those is proved only by the live scenarios above.

---

## 19. FEATURE CATALOG CROSS-REFERENCE INDEX

No `feature-catalog/` package exists for `cli-hermes`, so no scenario carries a catalog link. This index is the package's own bijection map until a catalog is authored.

### CLI INVOCATION

- HERMES-001: [Sanctioned headless smoke](cli-invocation/sanctioned-headless-smoke.md)
- HERMES-002: [Query-file verbatim round trip](cli-invocation/query-file-verbatim-round-trip.md)
- HERMES-003: [Off-roster model rejection](cli-invocation/off-roster-model-rejection.md)
- HERMES-021: [Provider preflight probe](cli-invocation/provider-preflight-probe.md)

### PERMISSION MODES

- HERMES-004: [Dangerous command blocked without --yolo](permission-modes/dangerous-command-blocked-without-yolo.md)
- HERMES-005: [Dangerous command runs with --yolo](permission-modes/dangerous-command-runs-with-yolo.md)
- HERMES-006: [Ordinary write without --yolo](permission-modes/ordinary-write-without-yolo.md)
- HERMES-007: [Read-only leaf refuses its write tools](permission-modes/read-only-leaf-refuses-writes.md)

### AGENT ROUTING

- HERMES-008: [Inlined persona via the agent-router template](agent-routing/inlined-persona-via-agent-router-template.md)
- HERMES-023: [Persona via the agent skill mirror and the plugin binding](agent-routing/persona-via-agent-skill-and-plugin.md)

### PROMPT TEMPLATES

- HERMES-009: [Second template round trip](prompt-templates/create-manual-testing-playbook-template-round-trip.md)
- HERMES-022: [Empty-stdout detection](prompt-templates/empty-stdout-detection.md)

### INTEGRATION PATTERNS

- HERMES-010: [Cross-model validation pair](integration-patterns/cross-model-validation-pair.md)
- HERMES-019: [MCP code_mode reach](integration-patterns/mcp-code-mode-reach.md)

### SESSION CONTINUITY

- HERMES-011: [Resume a captured session id](session-continuity/resume-captured-session-id.md)

### COST AND BACKGROUND

- HERMES-012: [Run-budget expiry](cost-and-background/run-budget-expiry.md)
- HERMES-013: [Max-turns bound](cost-and-background/max-turns-bound.md)

### GIT PREFLIGHT ADVISORY

- HERMES-014: [Git preflight advisory delivery](git-preflight-advisory/git-advisory-delivery.md)

### GOAL HOOK

- HERMES-015: [Plugin session-context section](goal-hook/plugin-session-context-section.md)
- HERMES-020: [Bound packet goal slice](goal-hook/bound-packet-goal-slice.md)

### SKILLS AND PLUGINS

- HERMES-016: [Project skill preload](skills-and-plugins/project-skill-preload.md)
- HERMES-017: [Skills list omits project skills](skills-and-plugins/skills-list-omits-project-skills.md)
- HERMES-018: [Plugin self-dispatch refusal](skills-and-plugins/plugin-self-dispatch-refusal.md)

---

## 20. STRESS MATRIX (`cli-hermes-EC-001..cli-hermes-EC-014`)

This category runs the shared hermetic stress-matrix cells for the `cli-hermes` adapter: authentication,
model/balance, rate-limit, timeout, stdin closure, child-spec-gate, sandbox/permission, missing
transport, budget rejection, partial lineage death, orphan cleanup, worktree collision, node_modules
integrity, and same-kind recursion. Every cell runs as a fully automated Vitest check with no live
external Hermes process; there is no operator-facing prompt beyond the run-this-test instruction.

- `cli-hermes-EC-001`: [Authentication failure](stress/auth-failure.md)
- `cli-hermes-EC-002`: [Model or balance failure](stress/model-or-balance.md)
- `cli-hermes-EC-003`: [Rate limit](stress/rate-limit.md)
- `cli-hermes-EC-004`: [Timeout](stress/timeout.md)
- `cli-hermes-EC-005`: [Stdin closure](stress/stdin-hang.md)
- `cli-hermes-EC-006`: [Child spec gate](stress/child-spec-gate.md)
- `cli-hermes-EC-007`: [Sandbox or permission](stress/sandbox-permission.md)
- `cli-hermes-EC-008`: [Missing transport](stress/transport-missing.md)
- `cli-hermes-EC-009`: [Budget rejection](stress/budget-rejection.md)
- `cli-hermes-EC-010`: [Partial lineage death](stress/partial-lineage-death.md)
- `cli-hermes-EC-011`: [Orphan cleanup](stress/orphan-cleanup.md)
- `cli-hermes-EC-012`: [Worktree collision](stress/worktree-collision.md)
- `cli-hermes-EC-013`: [Node modules integrity](stress/node-modules-integrity.md)
- `cli-hermes-EC-014`: [Self invocation](stress/self-invocation.md)
