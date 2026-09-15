---
title: "Iteration 8: Programmatic Wiring — What Each Builder Fails to Set"
trigger_phrases: []
---
# Iteration 8: Programmatic Wiring — What Each Builder Fails to Set

## Focus
For every executor the fan-out runner builds, list the environment and flags the runtime needs that the builder does not currently set (Hermes persona first); decide which belong in the builder rather than a prompt rule; state the cost of each addition and the test it needs.

## Findings

1. **Hermes — the project-plugin opt-in is the largest gap, and it is upstream of the read-only guard.** The builder wires `HERMES_SPEC_FOLDER` and, for a read-only lineage, `SPECKIT_HERMES_READ_ONLY`, but it never sets `HERMES_ENABLE_PROJECT_PLUGINS=1`. The packet is explicit about the consequence: "The project plugin `repo-guards` … carries the repo guards into a Hermes session when `HERMES_ENABLE_PROJECT_PLUGINS=1` is set and `repo-guards` is listed under `plugins.enabled`; without both, a Hermes dispatch runs with no repo guard hooks." So unless the operator exported the variable in the parent shell (it would then survive the `HERMES_` env prefix), a fan-out Hermes lineage consumes neither of the markers the builder carefully wires: the read-only refusal is inert, the spec-folder goal is unused, and the session-context section never appears. Cost to add: one env line in the `extraEnv` block; the operator's `plugins.enabled` line remains a documented step (the packet says `hermes plugins enable` refuses a project key). Test: a builder unit assertion that a cli-hermes lineage's dispatch env contains `HERMES_ENABLE_PROJECT_PLUGINS=1`, plus one live lineage whose agent log shows a `Session plugin prompt section` line. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3268-3272] [SOURCE: .opencode/skills/cli-external-orchestration/cli-hermes/references/hook-contract.md:53,35] [SOURCE: cli-hermes/references/hermes-tools.md:64]

2. **Hermes persona (the confirmed fact): `HERMES_AGENT_PERSONA` is never set, and the persona section reads only that env.** `PERSONA_ENV = "HERMES_AGENT_PERSONA"`; the plugin's `_persona()` returns empty when the variable is absent, so the persona section renders as an empty string and no persona binds. The builder wires read-only and spec-folder, not persona (starting fact 8). Cost: read the lineage's agent/persona field if present and set the env var; the optional native-shaped dispatch additionally needs `-s agent-<name>` and the generated mirror `.hermes/skills/agent-<name>/SKILL.md` (fallback `skill_view` exists in the plugin if the preload is absent). Test: builder unit asserting the env var when a persona is configured; one live lineage proving the persona section binds (the plugin's section line in the agent log names the section; HERMES-020 is the pattern for quoting a section back). [SOURCE: .hermes/plugins/repo-guards/__init__.py:133,689-713] [SOURCE: cli-hermes/references/agent-delegation.md:48]

3. **Claude and OpenCode builder paths lack the availability check every other path has.** `buildCodexLineageCommand`, `buildCursorLineageCommand`, `buildDevinLineageCommand`, `buildPiLineageCommand`, and `buildHermesLineageCommand` each call a `command -v` probe and throw `inputError` before constructing anything; the Claude and OpenCode builders do not. The preflight's availability checks cover five runtimes, and the packet's own dispatch pre-flight discipline requires the probe before any dispatch — so the two richest runtimes are the two the builder cannot refuse. Cost: mirror the existing helper (three lines each + one helper). Test: unit with a PATH lacking the binary → `inputError` naming the executor. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2066,2104,2200,2309,2431,2536,2654,2737-2790]

4. **Model defaults diverge between builder and packet, and one is not on the documented roster.** Codex: builder default `o4-mini` vs packet default `gpt-5.5`. OpenCode: builder default `anthropic/claude-opus-4-8` vs packet default `opencode-go/deepseek-v4.1-flash`. Neither builder validates its model against a roster (Claude, Codex, OpenCode are the three kinds without `*_ALLOWED_MODELS` checks). Cost: point each default at the packet's pinned model and add the allowlist where the roster exists; where no roster exists, at minimum assert the default against the SKILL.md's documented default instead of a literal. Test: unit asserting each kind's default when `lineage.model` is unset equals the documented default. [SOURCE: fanout-run.cjs:2070,2200-2203] [SOURCE: cli-codex/SKILL.md:201] [SOURCE: cli-opencode/SKILL.md:174]

5. **The codex service tier and reasoning effort defaults are partially wired.** The builder only appends `-c service_tier` when `lineage.serviceTier` is set, while the packet says the tier "stays on `fast`" unless the user drops it; likewise the codex reasoning default is the builder's literal `'medium'`, which happens to match the packet. Cost: default `serviceTier` to `fast` for codex (or document the divergence where the default is defined). Test: unit asserting `-c service_tier=fast` for a codex lineage without an explicit tier. [SOURCE: fanout-run.cjs:2071-2083] [SOURCE: cli-codex/SKILL.md:201,219]

6. **Which gaps belong in the builder rather than a prompt rule follows one line: anything the command string cannot carry.** Environment variables (`HERMES_AGENT_PERSONA`, `HERMES_ENABLE_PROJECT_PLUGINS`), spawn-time stdio/cwd decisions, mirror preconditions, and model defaults are invisible to a prompt rule and to the preflight — they must be builder facts. Conversely, everything detectable from the composed command (missing `file` toolset, unpinned provider, budget under timeout, and the rest of iteration 3's predicates) belongs in the preflight, where it also covers ad-hoc dispatch. The Hermes read-only marker is the cautionary example of half-wiring across the line: the builder emits a variable with no loader. [INFERENCE: synthesis of iterations 3 and 8]

7. **The persona addition must be sequenced after the exemption fix, not before.** On the current check, a persona dispatch that omits `--ignore-rules` (the packet's documented exception) is sanctioned; once iteration 2's fix lands, the builder's existing unconditional `--ignore-rules` becomes the correct shape *and* the persona preload can carry it. Wiring the persona first would freeze the false exemption into the builder — the code path iteration 2 warns about. Sequencing: fix the check/test first, then wire persona. Test coupling: the builder test for the persona dispatch should assert `--ignore-rules` is present alongside `-s agent-<name>`. [SOURCE: iteration 2 finding 5] [SOURCE: fanout-run.cjs:2676-2683]

## Ruled Out
- Setting the persona via the dispatch prompt instead of the builder: the plugin section reads `HERMES_AGENT_PERSONA` from the environment, and a prompt cannot set an environment variable for the child process. A prompt could inline the persona text, which is the documented fallback only for a run without the plugin or the mirror. [SOURCE: .hermes/plugins/repo-guards/__init__.py:689-713]
- Wiring persona before the exemption fix: it would encode the disproved `-s` exemption path into the builder. [SOURCE: iteration 2]

## Dead Ends
- Looking for a `HERMES_AGENT_PERSONA` pass-through already present in the env allowlist: the `HERMES_` prefix would carry it if the parent exported it, but nothing in the runner ever sets it, so a normal fan-out run inherits nothing. [SOURCE: executor-audit.ts:168 plus grep over fanout-run.cjs]

## Edge Cases
- Contradictory evidence: none for the gaps; the plugin-opt-in finding is inference-bounded — it holds unless every orchestration environment exports `HERMES_ENABLE_PROJECT_PLUGINS` itself, which the builder cannot verify. The cheap resolution is to set it in the builder regardless (idempotent). [INFERENCE: based on hook-contract.md:53]
- Partial success: the spawn `cwd` is `process.cwd()`, so a fan-out launched from a subdirectory gives children (and Codex hook project-dir resolution) a non-root cwd; the packet's builders assume repo-root execution. Not counted as a gap here because the same assumption is baked into `--dir` resolution; note for the wiring phase. [SOURCE: fanout-run.cjs:3461]
- Missing dependencies: the persona mirror (`sync-skills-hermes.cjs`) must have run for `-s agent-<name>`; the plugin's `skill_view` fallback covers a missing preload.

## Sources Consulted
- .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
- .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts
- .hermes/plugins/repo-guards/__init__.py
- .opencode/skills/cli-external-orchestration/cli-hermes/references/hook-contract.md
- .opencode/skills/cli-external-orchestration/cli-hermes/references/hermes-tools.md
- .opencode/skills/cli-external-orchestration/cli-hermes/references/agent-delegation.md
- .opencode/skills/cli-external-orchestration/cli-codex/SKILL.md
- .opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md
