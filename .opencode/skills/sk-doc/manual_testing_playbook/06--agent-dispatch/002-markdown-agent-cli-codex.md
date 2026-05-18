---
id: SD-019
category: 06--agent-dispatch
title: '@markdown agent inline-contract execution via cli-codex'
execution_mode: dispatch_inline_contract
dispatch_rationale: "cli-codex's SpawnAgent runtime allowlist (in `codex_core::tools::router`) does not include user-defined agents from `.codex/config.toml`. Real typed-agent dispatch via `codex exec` rejects `agent_type=markdown` with 'agent type is currently not available'. This scenario instead verifies INLINE-CONTRACT execution: codex's gpt-5.5 reads `.codex/agents/markdown.toml` developer_instructions and follows them itself, without sub-agent dispatch. F-001 is therefore resolved via inline workaround, not via real SpawnAgent dispatch — see 102/005 implementation-summary and 102/spec.md Known Issues. Re-enable real-dispatch semantics if a future codex release maps `.codex/config.toml` user-defined agents into the SpawnAgent allowlist."
expected_intent: CHANGELOG
expected_agent: '@markdown (inline contract — gpt-5.5 follows .codex/agents/markdown.toml itself)'
expected_resources:
  - assets/changelog_template.md
expected_token_range_input: 800-2500
expected_token_range_output: 1500-4000
created: 2026-05-11
revised: 2026-05-11
---

# SD-019: @markdown agent inline-contract execution via cli-codex

## 1. OVERVIEW

This scenario validates that `cli-codex` (gpt-5.5/high/fast) can correctly execute the `@markdown` agent contract inline for a `/create:changelog` task, when real typed-agent dispatch is unavailable.

### Why This Matters

Codex CLI v0.130.0's `codex exec` rejects `agent_type=markdown` in its internal SpawnAgent router (`codex_core::tools::router`) — the SpawnAgent runtime allowlist does not include user-defined agents declared in `.codex/config.toml`. Real `@markdown` dispatch under non-interactive `codex exec` is therefore upstream-blocked. This scenario verifies the practical workaround: codex's gpt-5.5 reads the `@markdown` agent definition file directly and executes its instructions inline. The verification is genuine end-to-end (sk-doc loaded, template followed, output file written) but the dispatch surface is inline-contract, not typed sub-agent dispatch.

**The rubric shift matters.** SD-018 (cli-claude-code) and SD-020 (cli-opencode) prove real typed-agent dispatch. SD-019 proves codex can execute the contract inline. Reading evidence files, treat the three as different verifications of the same agent identity, not three of the same dispatch surface.

---

## 2. SCENARIO CONTRACT

- Real user request: scaffold a v0.1.0 changelog for stub skill `sk-test-dummy` via the `@markdown` agent contract, executed inline under `codex exec`
- Prompt: the full inline-contract prompt with pre-bound setup answers, explicit SpawnAgent forbid, and Gate 3 pre-answer (see Setup block)
- Expected intent: `CHANGELOG`
- Expected executor: codex gpt-5.5 follows `.codex/agents/markdown.toml` developer_instructions inline — no sub-agent dispatch
- Desired user-visible outcome: A scaffolded changelog file at `/tmp/sk-test-dummy-CHANGELOG-cli-codex.md` with sk-doc compact-changelog sections, plus a transcript with `BINDING:` trace lines and the final report fields (`AGENT_RECEIVED=inline-codex-following-.codex/agents/markdown.toml`, `SPAWN_AGENT_USED=no`, etc.).

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-019 | @markdown via cli-codex (inline contract) | Verify codex gpt-5.5 can execute the @markdown contract inline for /create:changelog under `codex exec`. | See Setup. | See Setup. | `BINDING:` lines emit; sk-doc + template loaded; `SPAWN_AGENT_USED=no` in transcript; output file exists. | Transcript + output changelog content. | PASS when all 5 BINDING lines emit, `SPAWN_AGENT_USED=no` line emits, output file exists with sk-doc compact-changelog sections, AND no SpawnAgent error fires. PARTIAL if BINDING lines emit but output incomplete. FAIL if codex tries SpawnAgent and triggers `codex_core::tools::router` error. SKIP if `codex` binary unavailable. | Re-check the prompt explicitly forbids SpawnAgent / collab / Task; re-check the Gate 3 pre-answer `D) Skip` appears verbatim in the prompt; verify gpt-5.5 model + xhigh reasoning are passed. |

### Setup

This scenario EXECUTES real work via the **inline-contract** path. Codex's gpt-5.5 reads `.codex/agents/markdown.toml` and follows its instructions itself; no sub-agent dispatch.

Memory-mandated flags:
- `-c service_tier="fast"` (cli-codex fast mode must be explicit)
- `-c sandbox_workspace_write.network_access=true` (sandbox blocks sub-process network without this)
- `-c model_reasoning_effort="xhigh"` (raise reasoning for the contract following)

```bash
PROMPT='Run this as an inline Codex execution of the @markdown contract. Do NOT call SpawnAgent, collab: SpawnAgent, Task, or any sub-agent. If you are about to dispatch, stop and perform the work inline instead.

This is the user'"'"'s consolidated Gate 3 answer for this run: D) Skip spec-folder creation. The only allowed write is /tmp/sk-test-dummy-CHANGELOG-cli-codex.md. specFolder=none. Do not ask interactive questions; stdin is closed.

Follow .codex/agents/markdown.toml developer_instructions inline for /create:changelog.

Resolved setup bindings:
command_name=/create:changelog
execution_mode=AUTONOMOUS
target=sk-test-dummy
output_path=/tmp/sk-test-dummy-CHANGELOG-cli-codex.md
template_path=.opencode/skills/sk-doc/assets/changelog_template.md
spec_folder=none

Before any file reads, print these binding lines:
BINDING: command=/create:changelog
BINDING: target=sk-test-dummy
BINDING: output=/tmp/sk-test-dummy-CHANGELOG-cli-codex.md
BINDING: template=.opencode/skills/sk-doc/assets/changelog_template.md
BINDING: mode=AUTONOMOUS
BINDING: specFolder=none

Then read:
1. .codex/agents/markdown.toml
2. .opencode/skills/sk-doc/SKILL.md
3. .opencode/skills/sk-doc/assets/changelog_template.md

Create a compact v0.1.0 changelog for stub skill sk-test-dummy at /tmp/sk-test-dummy-CHANGELOG-cli-codex.md. Do NOT install or create anything under .opencode/skills/.

Final report must include:
AGENT_RECEIVED=inline-codex-following-.codex/agents/markdown.toml
SPAWN_AGENT_USED=no
SK_DOC_RESOURCES_LOADED=<actual existing paths loaded>
CHANGELOG_SECTIONS=<sections produced>
STATUS=OK PATH=/tmp/sk-test-dummy-CHANGELOG-cli-codex.md'

EVIDENCE='/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/<spec-folder>'

codex exec \
  --model gpt-5.5 \
  -c model_reasoning_effort="xhigh" \
  -c service_tier="fast" \
  -c sandbox_workspace_write.network_access=true \
  --sandbox workspace-write \
  "$PROMPT" </dev/null 2>&1 | tee "$EVIDENCE"
```

After the dispatch returns, run the grading probes:

```bash
EVIDENCE='/Users/michelkerkmeester/.../004-.../evidence/SD-019-cli-codex.txt'

# Binding lines emitted (must be 5)
grep -c '^BINDING:' "$EVIDENCE"

# SpawnAgent NOT used (must be 1)
grep -c 'SPAWN_AGENT_USED=no' "$EVIDENCE"

# No SpawnAgent runtime error (must be 0)
grep -c 'codex_core::tools::router' "$EVIDENCE"
grep -c 'agent type is currently not available' "$EVIDENCE"

# Inline contract acknowledged (must be ≥1)
grep -c 'AGENT_RECEIVED=inline-codex-following' "$EVIDENCE"

# Output file exists and has content
test -f /tmp/sk-test-dummy-CHANGELOG-cli-codex.md && wc -c /tmp/sk-test-dummy-CHANGELOG-cli-codex.md
```

## Expected Behavior

- **Intent picked**: `CHANGELOG`
- **Executor**: codex gpt-5.5 inline (following `.codex/agents/markdown.toml` developer_instructions)
- **Resources loaded**:
  - `.codex/agents/markdown.toml` (the @markdown contract itself)
  - `.opencode/skills/sk-doc/SKILL.md`
  - `.opencode/skills/sk-doc/assets/changelog_template.md`
- **Outcome**: codex scaffolds a v0.1.0 changelog file with sk-doc compact-changelog sections (`## What Changed` → `#### New Features` / `## Files Changed` / `## Upgrade`) at `/tmp/sk-test-dummy-CHANGELOG-cli-codex.md`.

## Cross-CLI Variants

This scenario is fixed to `cli-codex` and verifies inline-contract execution. SD-018 (cli-claude-code) and SD-020 (cli-opencode) verify real typed-agent dispatch — the dispatch surfaces differ across the three CLIs because of upstream runtime differences.

## Success Criteria

- 5 `BINDING:` lines emit in transcript before any file reads (proves setup acknowledged)
- `SPAWN_AGENT_USED=no` line emits (proves inline path taken)
- `AGENT_RECEIVED=inline-codex-following-.codex/agents/markdown.toml` line emits (proves contract acknowledged)
- 0 `codex_core::tools::router` errors in transcript (proves no SpawnAgent attempt)
- output file at `/tmp/sk-test-dummy-CHANGELOG-cli-codex.md` exists with non-zero size
- output contains sk-doc compact-changelog sections (`What Changed` + `Files Changed` + `Upgrade`)
- no installation under `.opencode/skills/` (stub stayed out of the skills tree)

## 4. SOURCE METADATA

- Group: Agent Dispatch
- Playbook ID: SD-019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--agent-dispatch/002-markdown-agent-cli-codex.md`
- Introduced by: `<spec-folder>`
- Revised by: `<spec-folder>` (post codex meta-analysis 2026-05-11; F-001 resolved via inline-contract workaround)
