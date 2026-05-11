---
id: SD-019
category: 06--agent-dispatch
title: '@markdown agent dispatch via cli-codex'
execution_mode: dispatch_real
expected_skip_in_non_interactive: true
skip_rationale: "cli-codex @markdown dispatch under `codex exec` non-interactive mode falls back to a sub-agent path that hits Gate 3. Documented as accepted limitation in 102/005 (F-001). Re-enable when codex agent resolver routes @markdown directly under `codex exec`."
expected_intent: CHANGELOG
expected_agent: '@markdown'
expected_resources:
  - assets/changelog_template.md
  - references/changelog_creation.md
expected_token_range_input: 400-1500
expected_token_range_output: 1500-4000
created: 2026-05-11
---

# SD-019: @markdown agent dispatch via cli-codex

## 1. OVERVIEW

This scenario validates that `cli-codex` (gpt-5.5/fast/high) correctly routes a `/create:changelog` task to the `@markdown` agent and that the agent loads sk-doc CHANGELOG resources before scaffolding the output.

### Why This Matters

cli-codex runs in a workspace-write sandbox by default that blocks sub-process network calls (memory: `feedback_codex_sandbox_blocks_network.md`). For sk-doc dispatch to succeed, the codex invocation must explicitly enable network access and the `fast` service tier (memory: `feedback_codex_cli_fast_mode.md`). This scenario tests that the codex pathway honors the `@markdown` rename under those constraints.

---

## 2. SCENARIO CONTRACT

- Real user request: scaffold a v0.1.0 changelog for a stub skill via the `@markdown` agent
- Prompt: `Use the @markdown agent to scaffold a v0.1.0 changelog for a stub skill named sk-test-dummy via /create:changelog. Write the result to /tmp/sk-test-dummy-CHANGELOG-cli-codex.md. Do NOT install the stub skill into the .opencode/skills/ tree. Report which agent received the work, which sk-doc resources were loaded, and the changelog sections produced.`
- Expected intent: `CHANGELOG`
- Expected executor: `@markdown` agent (NOT `@code`, NOT direct sk-doc invocation)
- Desired user-visible outcome: A scaffolded changelog file at `/tmp/sk-test-dummy-CHANGELOG-cli-codex.md` with Keep-a-Changelog sections, plus a transcript showing `@markdown` Phase 0 verification ran before the YAML workflow loaded.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-019 | @markdown via cli-codex | Verify `@markdown` agent receives `/create:changelog` work dispatched through cli-codex. | See Setup. | See Setup. | `@markdown` Phase 0 verification text appears in transcript; CHANGELOG asset reference appears; output file written. | Transcript + output changelog content. | PASS when `@markdown` invocation appears AND output file exists AND has Keep-a-Changelog sections. PARTIAL if `@markdown` invoked but output incomplete. FAIL if a different agent answered. SKIP if `codex` binary unavailable. | Re-check `.codex/agents/markdown.toml` exists; verify `.codex/config.toml` registers `agents.markdown`; verify network-access + fast flags applied. |

### Setup

This scenario EXECUTES real work — it is not a routing-trace probe.

Memory-mandated flags:
- `-c service_tier="fast"` (cli-codex fast mode must be explicit — never rely on global default)
- `-c sandbox_workspace_write.network_access=true` (sandbox blocks sub-process network without this; embeddings / API calls would fail)

```bash
PROMPT='Use the @markdown agent to scaffold a v0.1.0 changelog for a stub skill named sk-test-dummy via /create:changelog. Write the result to /tmp/sk-test-dummy-CHANGELOG-cli-codex.md. Do NOT install the stub skill into the .opencode/skills/ tree. Report which agent received the work, which sk-doc resources were loaded, and the changelog sections produced.'

EVIDENCE='/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/102-sk-doc-skill-readme-and-structure/004-sk-doc-playbook-markdown-agent-coverage/evidence/SD-019-cli-codex.txt'

# Dispatch via cli-codex (gpt-5.5/fast)
codex exec \
  -c service_tier="fast" \
  -c sandbox_workspace_write.network_access=true \
  "$PROMPT" </dev/null 2>&1 | tee "$EVIDENCE"

# Append verdict footer manually after grading
```

After the dispatch returns, run the grading probes against the evidence transcript:

```bash
# Routing trace: @markdown must appear
grep -c '@markdown\|markdown agent\|Phase 0\|agents.markdown\|markdown.toml' "$EVIDENCE"

# Resource trace: changelog template must be referenced
grep -c 'changelog_template\|changelog_creation\|Keep-a-Changelog' "$EVIDENCE"

# Output existence + shape
test -f /tmp/sk-test-dummy-CHANGELOG-cli-codex.md && \
  grep -cE '^## .*(Added|Changed|Fixed|Removed)' /tmp/sk-test-dummy-CHANGELOG-cli-codex.md
```

## Expected Behavior

- **Intent picked**: `CHANGELOG`
- **Executor**: `@markdown` agent (Codex resolves via `.codex/config.toml` `[agents.markdown]` → `.codex/agents/markdown.toml`)
- **Resources loaded**:
  - `.opencode/skills/sk-doc/assets/changelog_template.md`
  - `.opencode/skills/sk-doc/references/changelog_creation.md`
- **Outcome**: CLI scaffolds a v0.1.0 changelog file with Added / Changed / Fixed / Removed sections at `/tmp/sk-test-dummy-CHANGELOG-cli-codex.md`.

## Cross-CLI Variants

This scenario is fixed to `cli-codex`. Equivalent dispatches for cli-claude-code and cli-opencode are SD-018 and SD-020 respectively.

## Success Criteria

- `@markdown` invocation evidence present in transcript
- output file exists at the requested path
- output contains at least 3 of the 4 Keep-a-Changelog sections (Added / Changed / Fixed / Removed)
- no installation under `.opencode/skills/` (stub stayed out of the skills tree)

## 4. SOURCE METADATA

- Group: Agent Dispatch
- Playbook ID: SD-019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--agent-dispatch/002-markdown-agent-cli-codex.md`
- Introduced by: `.opencode/specs/skilled-agent-orchestration/102-sk-doc-skill-readme-and-structure/004-sk-doc-playbook-markdown-agent-coverage`
