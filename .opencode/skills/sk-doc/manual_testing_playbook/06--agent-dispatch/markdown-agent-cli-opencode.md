---
id: SD-020
category: 06--agent-dispatch
title: '@markdown agent dispatch via cli-opencode (DeepSeek v4 Pro direct API)'
execution_mode: dispatch_real
expected_intent: CHANGELOG
expected_agent: '@markdown'
expected_resources:
  - assets/changelog_template.md
expected_token_range_input: 400-1500
expected_token_range_output: 1500-4000
created: 2026-05-11
---

# SD-020: @markdown agent dispatch via cli-opencode (DeepSeek v4 Pro direct API)

## 1. OVERVIEW

This scenario validates that `cli-opencode`, when pointed at the DeepSeek v4 Pro model through the direct DeepSeek API (NOT the opencode-go gateway), correctly routes a `/create:changelog` task to the `@markdown` agent and loads sk-doc CHANGELOG resources before scaffolding the output.

### Why This Matters

The DeepSeek API rejects MCP tool names containing `:` or `@` characters (memory: `feedback_opencode_pure_flag_required_for_deepseek.md`, `feedback_opencode_skills_node_modules_recursion.md`). The opencode skills index globs vendored `node_modules/**/SKILL.md` files whose paths include `@github/...`, which violate the regex. Successful dispatch requires `--pure` to strip the MCP skills surface and `</dev/null` to avoid the v1.14.39 stdin-hang bug (memory: `feedback_opencode_run_requires_dev_null_stdin.md`). This scenario also exercises the user's preferred DeepSeek dispatch shape under those constraints.

---

## 2. SCENARIO CONTRACT

- Real user request: scaffold a v0.1.0 changelog for a stub skill via the `@markdown` agent
- Prompt: `Use the @markdown agent to scaffold a v0.1.0 changelog for a stub skill named sk-test-dummy via /create:changelog. Write the result to /tmp/sk-test-dummy-CHANGELOG-cli-opencode.md. Do NOT install the stub skill into the .opencode/skills/ tree. Report which agent received the work, which sk-doc resources were loaded, and the changelog sections produced.`
- Expected intent: `CHANGELOG`
- Expected executor: `@markdown` agent (NOT `@code`, NOT direct sk-doc invocation)
- Desired user-visible outcome: A scaffolded changelog file at `/tmp/sk-test-dummy-CHANGELOG-cli-opencode.md` with Keep-a-Changelog sections, plus a JSON-format transcript showing the `@markdown` agent received the work.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-020 | @markdown via cli-opencode + DeepSeek v4 Pro direct | Verify `@markdown` agent receives `/create:changelog` work dispatched through cli-opencode with DeepSeek v4 Pro through DeepSeek API. | See Setup. | See Setup. | `@markdown` agent invocation appears in JSON transcript; CHANGELOG asset reference appears; output file written. | Transcript + output changelog content. | PASS when `@markdown` invocation appears AND output file exists AND has Keep-a-Changelog sections. PARTIAL if `@markdown` invoked but output incomplete. FAIL if a different agent answered or DeepSeek rejected the tool-name regex. SKIP if `opencode` binary or `deepseek` provider auth unavailable. | Verify `opencode providers list` shows `deepseek`; confirm `--pure` strips the MCP skills surface; confirm `</dev/null` redirect applied. |

### Setup

This scenario EXECUTES real work — it is not a routing-trace probe.

Memory-mandated flags:
- `--pure` (DeepSeek API rejects tool names with `:` or `@`; `--pure` strips the MCP skills surface)
- `--model deepseek/deepseek-v4-pro` (DIRECT DeepSeek API, NOT the `opencode-go/deepseek-v4-pro` gateway alias)
- `--variant high` (elevated reasoning per cli-opencode default reference)
- `</dev/null` (opencode v1.14.39 reads stdin at startup; without this, redirected dispatches hang at 0% CPU)

```bash
PROMPT='Use the @markdown agent to scaffold a v0.1.0 changelog for a stub skill named sk-test-dummy via /create:changelog. Write the result to /tmp/sk-test-dummy-CHANGELOG-cli-opencode.md. Do NOT install the stub skill into the .opencode/skills/ tree. Report which agent received the work, which sk-doc resources were loaded, and the changelog sections produced.'

EVIDENCE='/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/<spec-folder>'

REPO_ROOT='/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public'

# Pre-flight: confirm deepseek provider is wired
opencode providers list 2>&1 | grep -i deepseek || echo "[SKIP] deepseek provider not configured"

# Dispatch via cli-opencode + DeepSeek v4 Pro direct API
opencode run \
  --pure \
  --model deepseek/deepseek-v4-pro \
  --variant high \
  --agent general \
  --format json \
  --dir "$REPO_ROOT" \
  "$PROMPT" </dev/null 2>&1 | tee "$EVIDENCE"

# Append verdict footer manually after grading
```

After the dispatch returns, run the grading probes against the evidence transcript:

```bash
# Routing trace: @markdown must appear in JSON transcript (agent names, prompts, or trace events)
grep -c '@markdown\|"agent":"markdown"\|markdown agent\|Phase 0' "$EVIDENCE"

# Resource trace: changelog template must be referenced
grep -c 'changelog_template\|changelog_creation\|Keep-a-Changelog' "$EVIDENCE"

# Output existence + shape
test -f /tmp/sk-test-dummy-CHANGELOG-cli-opencode.md && \
  grep -cE '^## .*(Added|Changed|Fixed|Removed)' /tmp/sk-test-dummy-CHANGELOG-cli-opencode.md
```

## Expected Behavior

- **Intent picked**: `CHANGELOG`
- **Executor**: `@markdown` agent (opencode resolves via `.opencode/agents/markdown.md`)
- **Resources loaded**:
  - `.opencode/skills/sk-doc/assets/changelog_template.md`
  - `.opencode/skills/sk-doc/references/changelog_creation.md`
- **Outcome**: CLI scaffolds a v0.1.0 changelog file with Added / Changed / Fixed / Removed sections at `/tmp/sk-test-dummy-CHANGELOG-cli-opencode.md`.

## Cross-CLI Variants

This scenario is fixed to `cli-opencode` with the DeepSeek v4 Pro DIRECT API provider. Equivalent dispatches for cli-claude-code and cli-codex are SD-018 and SD-019 respectively.

## Success Criteria

- `@markdown` invocation evidence present in JSON transcript
- output file exists at the requested path
- output contains at least 3 of the 4 Keep-a-Changelog sections (Added / Changed / Fixed / Removed)
- no installation under `.opencode/skills/` (stub stayed out of the skills tree)
- no DeepSeek 400 errors due to tool-name regex (proves `--pure` is doing its job)

## 4. SOURCE METADATA

- Group: Agent Dispatch
- Playbook ID: SD-020
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--agent-dispatch/markdown-agent-cli-opencode.md`
- Introduced by: `<spec-folder>`
