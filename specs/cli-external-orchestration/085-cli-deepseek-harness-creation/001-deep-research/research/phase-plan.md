---
title: "Phase plan: DeepSeek Harness as mode cli-deepseek-harness"
description: "Ranked phases 002 to 014 for building cli-deepseek-harness from the phase 001 research, with outcomes, files, dependencies, risk, authoring mode, executor and verifiable acceptance criteria, plus the parent goal and the key-gated unknowns."
trigger_phrases:
  - "deepseek harness phase plan"
  - "cli-deepseek-harness phases"
  - "dsh build roadmap"
importance_tier: "important"
contextType: "planning"
---

# Phase plan: DeepSeek Harness as mode cli-deepseek-harness

The evidence for every decision here is in `research.md` in this folder. `dsh-src/` means the harness source clone at commit `fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159`, cited as plain code spans because it sits outside the repository. Phase folders live under `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/`.

## 1. Parent goal

**Objective.** DeepSeek Harness (`dsh`, pinned `@deepseek-ai/dsh@0.2.2-rc.1`) is the eighth `cli-external-orchestration` runtime, `cli-deepseek-harness`, mirroring `cli-pi`. That means a skill packet with fail-closed hard rules, a `.dsh/` runtime folder with route, lineage and guard patches, generated skill, prompt and persona mirrors, a repo-guards Cordis plugin, opt-in Code Mode MCP, a deep-loop executor kind with stress coverage, and every cross-repo reference updated. The closed roster is LLM Gateway `deepseek-v4.1-flash-1017` and OpenCode Go `deepseek-v4.1-flash`.

**Completion test.** The program is done when all five hold:

1. Each roster route that the operator has keyed answers a harmless headless task with exit 0 and `final.reason.kind === 'completed'`, recorded verbatim.
2. One deep-research fan-out lineage on the kind completes with a clean containment scan.
3. The `.dsh/` mirror `--check` jobs and the dispatch, executor and stress test suites pass.
4. The hub, advisor and deep-loop contracts list the mode without changing existing modes.
5. `validate.sh --strict --recursive` on the parent packet prints `RESULT: PASSED`.

A route that cannot be keyed or reached stays marked "configured, not verified" and is excluded from default allowlists. Criterion 1 is not met for that route.

## 2. Stays UNKNOWN until the operator configures a provider key

These are answered only by phase 013, which is gated on the operator entering a key. No other phase may claim them.

- Which OpenCode Go endpoint authenticates for the harness: `https://opencode.ai/inference/go/openai/v1` or `https://opencode.ai/zen/go/v1`.
- Whether a route patch repoints `agent-default-model` for a real request, beyond what `--dump-config` shows.
- Whether LLM Gateway accepts `compat.thinkingFormat: deepseek` at `max`, and whether `compat.supportsDeveloperRole: false` is needed.
- Whether the `bash` tool spawns after npm skipped the `koffi` and `node-pty` install scripts.
- Whether `workspace-write` confines file tools, shell, MCP and plugin effects on macOS, and whether enforcement is reported `full`.
- Whether about 54 linked skills load in one session.
- Whether the repo-guards adapters deny and allow correctly on real tool calls, not only on fixtures.
- Real task-to-final latency and cost per iteration on each route.
- Whether cache-control compat fields help on either route.

## 3. Ranked phases

| Rank | Folder | Title | Required | Risk | Depends on |
|---|---|---|---|---|---|
| 1 | `002-dsh-offline-contract-pin` | Credential-free contract pin | Required | Medium | 001 |
| 2 | `003-cli-deepseek-harness-skill-packet` | Mode skill packet | Required | Medium | 002 |
| 3 | `004-dsh-runtime-folder-and-patches` | `.dsh/` folder and patches | Required | Medium | 002, 003 |
| 4 | `005-dsh-mirror-generators` | Skill, prompt and persona generators | Required | Medium | 004 |
| 5 | `006-deep-loop-executor-kind` | Executor kind, audit and builder | Required | High | 002, 004 |
| 6 | `007-dispatch-recognition-and-stress-adapter` | Dispatch hook and stress adapter | Required | Medium | 003, 006 |
| 7 | `008-dsh-repo-guards-safety-wave` | Repo-guards plugin, safety guards | Required | High | 002, 004 |
| 8 | `009-dsh-context-guards-and-goal-bridge` | Context guards and packet goal bridge | Required (goal and session-start), optional rest | Medium | 008 |
| 9 | `010-dsh-mcp-code-mode` | Opt-in Code Mode MCP | Optional | Medium | 004, 006, 008 |
| 10 | `011-hub-registration-and-routing` | Hub, advisor and prompt routing | Required | Medium | 003, 006 |
| 11 | `012-deep-loop-modes-and-commands` | Deep-loop modes, commands and council | Required | Medium | 006, 007, 011 |
| 12 | `013-dsh-live-contract-pin` | Keyed live contract pin | Required for release, gated on the operator key | High | 006, 008, operator key |
| 13 | `014-playbook-docs-and-closeout` | Playbook, docs reconciliation, closeout | Required | Medium | 002 to 013 |

Phase 013 may run as soon as 006 and 008 exist and the key is present. Phases 007 to 012 do not wait for it. Until it passes, the executor kind stays experimental and out of default allowlists.

## 4. Phases

### 002-dsh-offline-contract-pin

- **Title.** Credential-free contract pin.
- **Outcome.** The literal package version, integrity, source commit, help text, patch composition, failure-path JSON shape and relative-plugin boot are recorded from a disposable `DSH_HOME`, without any provider call.
- **Creates or changes.** `002-dsh-offline-contract-pin/` spec docs and `evidence/` captures: `version.txt`, `headless-help.txt`, `dump-config-<route>.txt` from draft patches kept in the phase's `scratch/`, `missing-credential.stdout.jsonl`, `missing-credential.stderr.txt`, `exit.txt`, `plugin-boot.txt`, `dist-tags.json`. No file outside the phase folder.
- **Depends on.** 001.
- **Risk.** Medium. First-boot writes can escape to `~/.dsh` if `DSH_HOME` is unset, and the rc dist-tag moved during research.
- **Required.** Yes.
- **Failure it prevents.** Building patches, rules and a builder on documentation alone, and pinning a moving dist-tag.
- **Authoring mode.** `system-spec-kit` for the phase docs. `sk-code` (`sk-code-skilled` verification surface, shell) for the probes.
- **Executor.** The orchestrating Claude session, because every command must be checked for home isolation before it runs.
- **Acceptance criteria.**
  1. `evidence/version.txt` holds `dsh --version </dev/null` output `0.2.2-rc.1`, and `evidence/dist-tags.json` holds `npm view @deepseek-ai/dsh@0.2.2-rc.1 dist.integrity` plus `npm view @deepseek-ai/dsh dist-tags --json`.
  2. `DSH_HOME=$(mktemp -d) dsh --profile headless --patch <draft-route> --patch <draft-lineage> --dump-config </dev/null` output shows `agent-default-model` with the route's provider and model, telemetry `mode: DISABLED`, and `session-log-deepseek`, `goal-round-driver` and `plan-mode` disabled. It is saved per route in `evidence/`.
  3. With no key in the environment, `printf 'Reply with the single word OK' | DSH_HOME=<tmp> dsh --profile headless --patch <draft-route> --json -` exits 1, and its last stdout line parses as JSON with `type` `error` or `final` (`node -e` parse recorded).
  4. A stub relative plugin row in a draft patch writes a marker file in the temp dir at `apply`, and the marker exists after the run above. This proves relative plugins load before the provider error.
  5. `ls -R ~/.dsh` output is identical before and after the phase's commands (diff saved), so nothing was written outside the disposable homes.
  6. `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <phase folder> --strict` prints `RESULT: PASSED`.

### 003-cli-deepseek-harness-skill-packet

- **Title.** Mode skill packet.
- **Outcome.** The `cli-deepseek-harness` packet exists with hard rules and references that match the 002 evidence, not yet registered in the hub.
- **Creates or changes.** `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/` with `SKILL.md`, `ROUTER.md`, `README.md`, `hard-rules.json`, `references/cli-reference.md`, `references/providers-and-models.md`, `references/runtime-folder-and-sync.md`, `references/guards-and-hooks.md`, `references/mcp.md`, `references/fanout-executor.md`, `assets/` prompt templates, and `changelog/` first entry.
- **Depends on.** 002.
- **Risk.** Medium. Rules can drift from observed behavior.
- **Required.** Yes.
- **Failure it prevents.** Ad-hoc dispatch composition and unstated hard rules such as the missing route patch or a repo-root `.env`.
- **Authoring mode.** `sk-doc` `sk-create-skill`, plus `sk-create-changelog` for the changelog entry.
- **Executor.** The orchestrating Claude session.
- **Acceptance criteria.**
  1. `node .skilled/commands/doctor/scripts/sk-skill-check.cjs .skilled/skills/cli-external-orchestration/cli-deepseek-harness` reports no errors.
  2. `hard-rules.json` parses (`node -e 'JSON.parse(require("fs").readFileSync(process.argv[1]))' <file>`) and `rg` finds all eleven rule ids from research Section 11: `headless-only`, `stdin-dash-required`, `route-patch-required`, `closed-roster`, `approval-never-required`, `dsh-home-isolated`, `lineage-patch-required`, `json-final-and-exit-required`, `pinned-version-required`, `no-repo-root-dotenv`, `mcp-opt-in-only`.
  3. Every flag named in `references/cli-reference.md` appears in `002-dsh-offline-contract-pin/evidence/headless-help.txt` (scripted `rg` loop exits 0).
  4. `references/providers-and-models.md` lists exactly the two roster routes and marks the OpenCode Go endpoint UNKNOWN.
  5. `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <phase folder> --strict` prints `RESULT: PASSED`.

### 004-dsh-runtime-folder-and-patches

- **Title.** `.dsh/` folder and patches.
- **Outcome.** `.dsh/` exists with two route patches, a lineage patch, `SYNC.md` and `README.md`, and each patch composes cleanly.
- **Creates or changes.** `.dsh/SYNC.md`, `.dsh/README.md`, `.dsh/patches/route-llmgateway-deepseek.patch.yml`, `.dsh/patches/route-opencode-go-deepseek.patch.yml`, `.dsh/patches/lineage.patch.yml`, `.gitignore` (`/.dsh/skills/local-*`).
- **Depends on.** 002, 003.
- **Risk.** Medium. Wrong row ids silently become no-op patches, which the loader only warns about.
- **Required.** Yes.
- **Failure it prevents.** A dispatch reaching the base default `deepseek-official` route, and config drift between the packet and the folder.
- **Authoring mode.** `sk-code` `sk-code-skilled` for the YAML patches. `sk-doc` `sk-create-readme` for `SYNC.md` and `README.md`.
- **Executor.** `cli-codex gpt-6-luna xhigh fast` for the patches. The orchestrating Claude session for the two docs.
- **Acceptance criteria.**
  1. For each route patch, `DSH_HOME=$(mktemp -d) dsh --profile headless --patch .dsh/patches/<route> --patch .dsh/patches/lineage.patch.yml --dump-config </dev/null` shows the expected provider and model and prints no unmatched-target warning on stderr.
  2. `rg -n -i 'api_?key|secret|token' .dsh/patches` matches only `apiKeyEnv` lines that name `LLMGATEWAY_API_KEY` or `OPENCODE_API_KEY`.
  3. `git check-ignore -q .dsh/skills/local-probe` exits 0.
  4. `SYNC.md` names every top-level entry under `.dsh/` with its mechanism and source (a `ls .dsh` versus `SYNC.md` `rg` loop exits 0).

### 005-dsh-mirror-generators

- **Title.** Skill, prompt and persona generators.
- **Outcome.** Three generators produce the per-skill symlink farm, flattened prompt templates and persona patches, each with a `--check` mode wired into CI and the runtime-mirrors doctor.
- **Creates or changes.** `.skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs`, `sync-prompts-dsh.cjs`, `sync-agents-dsh.cjs`, `README.md`. Tests under `.skilled/skills/system-spec-kit/runtime/cli/tests/` (`sync-skills-dsh.test.mjs`, `sync-prompts-dsh.test.mjs`, `sync-agents-dsh.test.mjs`). Generated `.dsh/skills/`, `.dsh/prompts/`, `.dsh/agents/`. `.github/workflows/command-tree-parity.yml` gains a `dsh-mirror` job. `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` and `.skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs` gain the `.dsh/` mirror. `.dsh/SYNC.md` is updated.
- **Depends on.** 004.
- **Risk.** Medium. Nested skills can be missed, two packets can share a frontmatter `name`, and descriptions over 500 characters are truncated in the catalog.
- **Required.** Yes.
- **Failure it prevents.** A whole-tree link that hides nested mode packets, and mirrors that drift from `.skilled/` without a failing check.
- **Authoring mode.** `sk-code` `sk-code-skilled` (JavaScript runtime plus tests). `sk-code-ci` for the workflow job.
- **Executor.** `cli-codex gpt-6-luna xhigh fast`.
- **Acceptance criteria.**
  1. `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs --check` exits 0, and the count of `.dsh/skills/*` equals `find .skilled/skills -name SKILL.md -not -path '*/node_modules/*' | wc -l` minus the exclusions the generator prints.
  2. `sync-prompts-dsh.cjs --check` and `sync-agents-dsh.cjs --check` both exit 0.
  3. `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-*-dsh.test.mjs` passes, including a duplicate-name case and an over-500-character description warning case.
  4. Every farm entry resolves through its link: `ls .dsh/skills/*/SKILL.md | wc -l` equals `ls -d .dsh/skills/*/ | wc -l`.
  5. `rg -n 'dsh-mirror' .github/workflows/command-tree-parity.yml` matches, and `node --test .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs` passes.

### 006-deep-loop-executor-kind

- **Title.** Executor kind, audit and builder.
- **Outcome.** `cli-deepseek-harness` is a closed executor kind with an exact builder, env allowlist, recursion guard, version probe and JSON-final validation, unit-tested and marked experimental.
- **Creates or changes.** `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `executor-audit.ts`, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, unit tests `executor-config.vitest.ts`, `fanout-run.vitest.ts`, `combo-matrix.vitest.ts`, `executor-audit.vitest.ts`, and `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md`.
- **Depends on.** 002, 004.
- **Risk.** High. Env leakage, false success on a well-formed failed stream, or a missing recursion guard.
- **Required.** Yes.
- **Failure it prevents.** Fan-out runs that pass the official DeepSeek key, accept a failed run, recurse into dsh, or hang without a bound.
- **Authoring mode.** `sk-code` `sk-code-skilled` (TypeScript and JavaScript runtime plus tests), then `sk-code-quality`.
- **Executor.** `cli-codex gpt-6-luna xhigh fast`.
- **Acceptance criteria.**
  1. The runtime's vitest run of `tests/unit/executor-config.vitest.ts`, `fanout-run.vitest.ts`, `combo-matrix.vitest.ts` and `executor-audit.vitest.ts` passes, and the full unit directory has no new failures against a baseline captured before the edit.
  2. A builder test asserts the exact argv: `dsh --profile headless --patch <route> --patch <lineage> --patch <guards> --json --permission-mode <preset> --approval-policy never -`, with stdin set to the prompt and cwd set to the lineage directory.
  3. An env test asserts `LLMGATEWAY_API_KEY`, `OPENCODE_API_KEY` and `DSH_HOME` pass and `DEEPSEEK_API_KEY`, `DSH_TELEMETRY_OTLP_URL` and an unrelated `OPENCODE_FOO` are dropped.
  4. Tests assert failure for non-zero exit, a missing `final`, an `error` event and `final.reason.kind` other than `completed`, and a nested `dsh` dispatch is refused with no self-presence exemption.
  5. The kind is absent from every default allowlist (`rg` on `executor-config.ts` for the default tables).

### 007-dispatch-recognition-and-stress-adapter

- **Title.** Dispatch hook and stress adapter.
- **Outcome.** The dispatch-audit hook recognizes dsh task shapes and enforces the packet's hard rules, and the stress adapter matrix exercises the kind through a shim.
- **Creates or changes.** `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` and `.test.mjs`, `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` and `.test.mjs`, `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts`, `fixtures/adapter-fixture.ts`, `fixtures/adapter-suite.ts`, `shims/adapter-shim-core.cjs`, new `shims/dsh-shim.cjs`, new `cli-deepseek-harness.vitest.ts`, `shims/README.md`, `README.md`.
- **Depends on.** 003, 006.
- **Risk.** Medium. The regex can over-match `dsh plugin` or `--dump-config`, or miss env-wrapped calls.
- **Required.** Yes.
- **Failure it prevents.** dsh dispatches that skip preflight, or the adapter matrix silently omitting the new runtime.
- **Authoring mode.** `sk-code` `sk-code-skilled` (hooks and tests).
- **Executor.** `cli-codex gpt-6-luna xhigh fast`.
- **Acceptance criteria.**
  1. `node --test .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` passes, with positive cases for `dsh headless -`, `dsh --profile headless --json -` and env- and shell-wrapped forms, and negative cases for `dsh plugin --profile x add y`, `dsh --profile headless --help` and `dsh --profile headless --dump-config`.
  2. `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` passes, with cases that flag a missing `-`, a missing `--approval-policy never`, a missing route patch and a repo-root cwd.
  3. The runtime's vitest run of `tests/stress/cli-adapter/cli-deepseek-harness.vitest.ts` passes.
  4. `cli-pi.vitest.ts` and `cli-hermes.vitest.ts` still pass unchanged.

### 008-dsh-repo-guards-safety-wave

- **Title.** Repo-guards plugin, safety guards.
- **Outcome.** A relative-path Cordis plugin bundle bridges the eight safety guards onto harness seams through the shared guard cores, with an explicit error policy per guard.
- **Creates or changes.** `.dsh/plugins/repo-guards/` (entry plus adapters for `dispatch-audit`, `dispatch-preflight-lint`, `spec-gate-classify`, `spec-gate-enforce`, `completion-evidence`, `task-dispatch-guard`, `post-edit-quality`, `classifier-injection-screen`), tests beside it, `.dsh/patches/guards.patch.yml`, `.dsh/SYNC.md`, the packet's `references/guards-and-hooks.md`, and a decision record in the phase folder for native plugin versus the experimental Claude hook bridge.
- **Depends on.** 002 (relative-plugin boot proof), 004.
- **Risk.** High. A plugin can fail open, or its imports of shared cores can fail to resolve under the harness resolver.
- **Required.** Yes.
- **Failure it prevents.** dsh dispatches running with no spec gate, dispatch preflight or completion evidence.
- **Authoring mode.** `sk-code` `sk-code-skilled` (TypeScript and JavaScript runtime plugin plus tests).
- **Executor.** `cli-codex gpt-6-luna xhigh fast`.
- **Acceptance criteria.**
  1. A keyless run with `--patch .dsh/patches/guards.patch.yml` under a disposable `DSH_HOME` fails only with `MISSING_CREDENTIAL`. stderr names no failed plugin and no `startup-*.log` report.
  2. The adapter tests feed each guard a fixture tool call and assert the same allow or deny the matching `.pi/extensions/*.ts` gives for that input.
  3. For each adapter, a test throws inside the shared core and asserts the declared error policy (fail closed for `spec-gate-enforce` and `dispatch-preflight-lint`, as documented in the decision record).
  4. `rg -n -E 'specs/|packet [0-9]|phase [0-9]' .dsh/plugins` returns nothing, so comments carry no ephemeral labels.
  5. The decision record names the chosen mechanism, the rejected one and the evidence (`hooks-claude-code` absent from the install, fail-open config parse).

### 009-dsh-context-guards-and-goal-bridge

- **Title.** Context guards and packet goal bridge.
- **Outcome.** Packet `goal.md` context and session-start context reach dsh sessions. The later-wave guards are added where their seams hold.
- **Creates or changes.** `.dsh/plugins/repo-guards/` adapters for `goal-context` and `session-start-context` (required), and `prompt-advisor` (off in the lineage patch), `session-compact-context`, `session-stop-context`, `session-start-advisories`, `git-preflight-advisory`, `git-message-gate` and `decision-capture` (optional, each shipped or recorded as deferred). Tests, `.dsh/patches/guards.patch.yml`, `.dsh/SYNC.md`, packet references.
- **Depends on.** 008.
- **Risk.** Medium. Compaction and disposal seams carry less shutdown evidence.
- **Required.** `goal-context` and `session-start-context` yes. The rest are optional.
- **Failure it prevents.** dsh sessions working without the bound packet goal, which the goal posture rule requires on every runtime.
- **Authoring mode.** `sk-code` `sk-code-skilled`.
- **Executor.** `cli-codex gpt-6-luna xhigh fast`.
- **Acceptance criteria.**
  1. A test feeds a fixture packet `goal.md` and asserts the injected context holds the `chat_slice` that `goal.cjs packet` prints and none of the frontmatter.
  2. A test on a `compaction/summary` fixture event asserts packet context is restored, or the phase records the adapter as deferred with its reason.
  3. `git-message-gate`, if shipped, passes the sk-git message-contract fixtures used by `.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs`.
  4. The 008 keyless boot criterion still holds with the extended guards patch.

### 010-dsh-mcp-code-mode

- **Title.** Opt-in Code Mode MCP.
- **Outcome.** A separate MCP patch mounts one `code_mode` stdio server with explicit env, cwd and timeouts, and the MCP route guard covers its tools.
- **Creates or changes.** `.dsh/patches/mcp-code-mode.patch.yml`, the `mcp-route-guard` adapter in `.dsh/plugins/repo-guards/`, the kind's MCP capability entry in `executor-config.ts`, packet `references/mcp.md`, `.dsh/SYNC.md`. Optional `.skilled/commands/doctor/assets/doctor-mcp-*.yaml` rows.
- **Depends on.** 004, 006, 008.
- **Risk.** Medium. Startup is eager, the scrubbed env can drop what the launcher needs, and the launcher process can be orphaned.
- **Required.** No.
- **Failure it prevents.** MCP mounted in every leaf, or a Code Mode server that leaks inherited secrets or never shuts down.
- **Authoring mode.** `sk-code` `sk-code-skilled`.
- **Executor.** `cli-codex gpt-6-luna xhigh fast`.
- **Acceptance criteria.**
  1. `--dump-config` with the MCP patch shows exactly one `@deepseek-ai/dsh-mcp-client` row (`serverName: code_mode`, `transport: stdio`, `env` naming `UTCP_CONFIG_FILE`), and without it shows none.
  2. A keyless run with the MCP patch exits 1 with `MISSING_CREDENTIAL` and no MCP startup failure on stderr, and the `pgrep -f mcp-code-mode-launcher` process list after the run equals the list captured before it, so the run leaves no launcher behind. Other sessions already run launchers on this machine, so an empty list is not a usable test.
  3. A route-guard test denies an `mcp__code_mode__*` tool outside the allowlist.
  4. The executor-config test asserts the kind's MCP capability and that MCP stays off when no server is requested.

### 011-hub-registration-and-routing

- **Title.** Hub, advisor and prompt routing.
- **Outcome.** The hub, advisor, compiled-routing fixtures, prompt card and agent tables route to the eighth mode, and existing modes keep their behavior.
- **Creates or changes.** `.skilled/skills/cli-external-orchestration/SKILL.md`, `ROUTER.md`, `README.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `graph-metadata.json`, `description.json`, `feature-catalog/feature-catalog.md`, `feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md`, `feature-catalog/cli-executor-dispatch-routing/cli-executor-dispatch-routing.md`, a new feature-catalog entry, sibling `cli-*/README.md` mode tables, the hub changelog. `.skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh`, `runtime/scripts/skill-graph.json` (regenerated), `runtime/tests/parity/fixtures/executor-delegation-cases.json`, `runtime/tests/scorer/executor-delegation.vitest.ts`. `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json` and `harness/build-artifacts.cjs`. `.skilled/skills/sk-prompt/SKILL.md`, `assets/cli-prompt-quality-card.md`. `.skilled/agents/orchestrate.md`, `prompt-improver.md`, and their regenerated mirrors in `.claude/agents/`, `.codex/agents/`, `.pi/agents/`, `.hermes/agents/`.
- **Depends on.** 003, 006.
- **Risk.** Medium. Generated artifacts drift, and "seven" counts go stale.
- **Required.** Yes.
- **Failure it prevents.** A mode that exists but cannot be selected, or an advisor that routes "deepseek" model requests to the harness.
- **Authoring mode.** `sk-doc` `sk-create-skill` conventions for hub docs, `sk-create-feature-catalog` for the catalog entry, `sk-create-changelog` for the changelog. `sk-code` `sk-code-skilled` for JSON, fixtures and advisor tests.
- **Executor.** The orchestrating Claude session for docs. `cli-codex gpt-6-luna xhigh fast` for JSON, fixtures and tests.
- **Acceptance criteria.**
  1. `node -e` over `mode-registry.json` counts eight modes, one of them `cli-deepseek-harness` with aliases `dsh`, `dsh headless`, `deepseek harness`.
  2. `bash .skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh` exits 0, and the advisor parity and scorer vitest suites pass.
  3. `node .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs` followed by `git diff --exit-code` on its outputs shows no drift.
  4. `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0.
  5. `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"run this task through dsh headless"}' --format json` names `cli-external-orchestration`, and a canary case asserts that "use cli-opencode with deepseek-v4.1-flash" still resolves to `cli-opencode`.

### 012-deep-loop-modes-and-commands

- **Title.** Deep-loop modes, commands and council.
- **Outcome.** Deep research and deep review can select the kind through their command YAMLs and compiled contracts, and the council seat question is decided and implemented or recorded.
- **Creates or changes.** `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md`, `deep-review/references/protocol/loop-protocol.md`, `deep-review/SKILL.md`, `deep-research/SKILL.md` if it lists executors, `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-review-auto.yaml`, the confirm variants where they enumerate kinds, `deep-research-presentation.txt`, `deep-review-presentation.txt`, regenerated `compiled/deep-research.contract.markdown` and `compiled/deep-review.contract.markdown`. If council admits a seat: `deep-ai-council/SKILL.md`, `scripts/orchestrate-session.cjs`, `scripts/tests/orchestrate-session-cli.vitest.ts`, `references/patterns/seat-diversity-patterns.md`, the council YAML and compiled contract.
- **Depends on.** 006, 007, 011.
- **Risk.** Medium. Hand edits to compiled contracts drift from their sources.
- **Required.** Yes for research and review. The council seat is a recorded decision.
- **Failure it prevents.** The executor existing in the runtime but being unreachable from `/deep:research` and `/deep:review`.
- **Authoring mode.** `sk-doc` for SKILL and protocol text. `sk-code` `sk-code-skilled` for YAML, contract regeneration and the council script and test.
- **Executor.** `cli-codex gpt-6-luna xhigh fast` for code and regeneration. The orchestrating Claude session for docs.
- **Acceptance criteria.**
  1. `rg -l cli-deepseek-harness` matches each research and review file listed above.
  2. Regenerating the compiled contracts after the edits leaves `git diff --exit-code` clean on `compiled/`.
  3. The council decision is recorded in the phase decision record, and if a seat is admitted the council vitest suite passes.
  4. The deep-loop unit suites from phase 006 still pass.

### 013-dsh-live-contract-pin

- **Title.** Keyed live contract pin.
- **Outcome.** Each keyed route answers through dsh headless with verbatim evidence, the UNKNOWN list in Section 2 is answered, and the kind is promoted from experimental for proven routes only.
- **Creates or changes.** `013-dsh-live-contract-pin/evidence/` captures, corrections to `.dsh/patches/route-*.patch.yml`, the packet's `references/` and `hard-rules.json`, the default allowlist and preventive-sandbox capability in `executor-config.ts`, a row in `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/live-contracts.json`, and a re-pin runbook in the packet for later rc bumps.
- **Depends on.** 006, 008, and the operator entering a key in the launch environment or a disposable home's `.env`. The session never reads, copies or prints the key.
- **Risk.** High. It costs money, the OpenCode Go route was overloaded on 2026-11-05, and a sandbox failure can surface late.
- **Required.** Required for release. Gated on the key.
- **Failure it prevents.** Shipping a "supported" runtime that has never completed a real turn.
- **Authoring mode.** `sk-code` `sk-code-skilled` verification surface for probes. `sk-doc` for the reference updates.
- **Executor.** The orchestrating Claude session, with the operator present.
- **Acceptance criteria.**
  1. Per route, `printf 'Reply with the single word OK' | DSH_HOME=<tmp> dsh --profile headless --patch .dsh/patches/<route> --patch .dsh/patches/lineage.patch.yml --json --permission-mode workspace-write --approval-policy never -` exits 0 with `final.reason.kind` `completed`, saved verbatim with stderr.
  2. In a temp workspace, a write inside the workspace succeeds and a write outside it is denied (a `tool_result` error recorded), and a `bash` `echo ok` call returns `completed`.
  3. A `max` reasoning request produces no `UNSUPPORTED_REASONING_EFFORT`, and the developer-role compat setting is recorded as needed or not.
  4. One `fanout-run.cjs` deep-research lineage with the kind completes, and its containment scan reports no out-of-lineage write.
  5. Latency (task to final) and token counts per route are recorded, and each route is marked verified or "configured, not verified" in the packet and allowlist.

### 014-playbook-docs-and-closeout

- **Title.** Playbook, docs reconciliation, closeout.
- **Outcome.** The playbook runs green, every governance doc names the eighth runtime correctly, generated indexes are rebuilt, and the whole packet validates strict and recursive.
- **Creates or changes.** `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/manual-testing-playbook/`, the `.dsh/manual-testing-playbook` link, the hub playbook entry, final feature-catalog text, changelogs (packet, hub, `.skilled/changelog/skilled/`). `AGENTS.md`, `README.md`, `SECURITY.md`, `.skilled/skills/README.txt`, `.skilled/CROSS-CLI.md`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.env.example` (names only). Regenerated `.skilled/commands/doctor/assets/agents-md-manifest.json`. `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` and `baseline-readme-verdicts.json`. Rebuilt `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`. Parent `spec.md`, `goal.md` and each child's completion metadata reconciled.
- **Depends on.** 002 to 013. Phase 013 sets the "supported" wording.
- **Risk.** Medium. Stale counts and generated-index drift.
- **Required.** Yes.
- **Failure it prevents.** Docs and indexes that contradict the shipped runtime, and a packet that claims completion without a passing validator.
- **Authoring mode.** `sk-doc` `sk-create-manual-testing-playbook`, `sk-create-readme`, `sk-create-changelog`, `sk-create-feature-catalog`. `sk-code` for manifest and index regeneration.
- **Executor.** The orchestrating Claude session.
- **Acceptance criteria.**
  1. Every playbook scenario has a recorded result. Key-gated scenarios cite phase 013 evidence or are marked blocked with the reason.
  2. `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/085-cli-deepseek-harness-creation --strict --recursive` prints `RESULT: PASSED`.
  3. The `/doctor:agents-md` check reports the regenerated manifest in sync, and the sk-doc code-folder tests pass.
  4. `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json --scoring-only -- "deepseek harness"` returns the packet.
  5. `rg -n -i 'seven (cli|runtime|mode|bridge)' AGENTS.md README.md SECURITY.md .skilled/skills/cli-external-orchestration .skilled/skills/README.txt` returns no stale count.

## 5. Not planned as phases

- Optional Pi parity (observational memory, PDF and video tools, market integrations). No requirement names it. Reopen only for a named need.
- A third GLM route. Outside the two named routes.
- Interactive profiles (`web`, `tui`, `acp`, `sdk`). The mode is headless only.
- Re-pin per rc bump is a runbook from phase 013 plus the `pinned-version-required` rule, not a standing phase.
