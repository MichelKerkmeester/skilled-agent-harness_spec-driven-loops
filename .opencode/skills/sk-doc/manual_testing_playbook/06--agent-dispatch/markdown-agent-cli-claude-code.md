---
id: SD-018
category: 06--agent-dispatch
title: '@markdown agent dispatch via cli-claude-code'
execution_mode: dispatch_real
expected_intent: CHANGELOG
expected_agent: '@markdown'
expected_resources:
  - assets/changelog_template.md
expected_token_range_input: 400-1500
expected_token_range_output: 1500-4000
created: 2026-05-11
version: 1.8.0.5
---

# SD-018: @markdown agent dispatch via cli-claude-code

## 1. OVERVIEW

This scenario validates that `cli-claude-code` correctly routes a `/create:changelog` task to the `@markdown` agent (the dedicated documentation executor introduced in 102-sk-doc-skill-readme-and-structure/003-markdown-agent-rename), and that the agent loads sk-doc CHANGELOG resources before scaffolding the output.

### Why This Matters

Phase 003 renamed the documentation executor from `@create` to `@markdown` without updating the sk-doc playbook. This is the first scenario that actually dispatches `@markdown` (rather than only routing-trace inspecting sk-doc). A passing run proves end-to-end that the rename's wiring holds under cli-claude-code dispatch.

---

## 2. SCENARIO CONTRACT

- Real user request: scaffold a v0.1.0 changelog for a stub skill via the `@markdown` agent
- Prompt: `Use the @markdown agent to scaffold a v0.1.0 changelog for a stub skill named sk-test-dummy via /create:changelog. Write the result to /tmp/sk-test-dummy-CHANGELOG-cli-claude-code.md. Do NOT install the stub skill into the .opencode/skills/ tree. Report which agent received the work, which sk-doc resources were loaded, and the changelog sections produced.`
- Expected intent: `CHANGELOG`
- Expected executor: `@markdown` agent (NOT `@code`, NOT direct sk-doc invocation)
- Desired user-visible outcome: A scaffolded changelog file at `/tmp/sk-test-dummy-CHANGELOG-cli-claude-code.md` with Keep-a-Changelog sections, plus a transcript showing `@markdown` Phase 0 verification ran before the YAML workflow loaded.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-018 | @markdown via cli-claude-code | Verify `@markdown` agent receives `/create:changelog` work dispatched through cli-claude-code. | See Setup. | See Setup. | `@markdown` Phase 0 verification text appears in transcript; CHANGELOG asset reference appears; output file written. | Transcript + output changelog content. | PASS when `@markdown` invocation appears AND output file exists AND has Keep-a-Changelog sections. PARTIAL if `@markdown` invoked but output incomplete. FAIL if a different agent answered. SKIP if `claude` binary unavailable. | Re-check `.claude/agents/markdown.md` exists; re-check `.opencode/commands/create/changelog.md` Phase 0 block. |

### Setup

This scenario EXECUTES real work — it is not a routing-trace probe.

```bash
PROMPT='Use the @markdown agent to scaffold a v0.1.0 changelog for a stub skill named sk-test-dummy via /create:changelog. Write the result to /tmp/sk-test-dummy-CHANGELOG-cli-claude-code.md. Do NOT install the stub skill into the .opencode/skills/ tree. Report which agent received the work, which sk-doc resources were loaded, and the changelog sections produced.'

EVIDENCE='/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/<spec-folder>'

# Dispatch via cli-claude-code (Opus 4.7 1M context)
claude --model claude-opus-4-7 --print "$PROMPT" </dev/null 2>&1 | tee "$EVIDENCE"

# Append verdict footer manually after grading
```

After the dispatch returns, run these grading probes against the evidence transcript:

```bash
# Routing trace: @markdown must appear
grep -c '@markdown\|markdown agent\|Phase 0' "$EVIDENCE"

# Resource trace: changelog template must be referenced
grep -c 'changelog_template\|changelog_creation\|Keep-a-Changelog' "$EVIDENCE"

# Output existence + shape
test -f /tmp/sk-test-dummy-CHANGELOG-cli-claude-code.md && \
  grep -cE '^## .*(Added|Changed|Fixed|Removed)' /tmp/sk-test-dummy-CHANGELOG-cli-claude-code.md
```

## Expected Behavior

- **Intent picked**: `CHANGELOG`
- **Executor**: `@markdown` agent (Phase 0 verification text appears verbatim in transcript)
- **Resources loaded**:
  - `.opencode/skills/sk-doc/assets/changelog_template.md`
  - `.opencode/skills/sk-doc/references/changelog_creation.md`
- **Outcome**: CLI scaffolds a v0.1.0 changelog file with Added / Changed / Fixed / Removed sections at `/tmp/sk-test-dummy-CHANGELOG-cli-claude-code.md`.

## Cross-CLI Variants

This scenario is fixed to `cli-claude-code`. Equivalent dispatches for cli-opencode and cli-claude-code are SD-019 and SD-020 respectively.

## Success Criteria

- `@markdown` invocation evidence present in transcript (regex `@markdown` or `Phase 0` Keep-a-Changelog block)
- output file exists at the requested path
- output contains at least 3 of the 4 Keep-a-Changelog sections (Added / Changed / Fixed / Removed)
- no installation under `.opencode/skills/` (stub stayed out of the skills tree)

## 4. SOURCE METADATA

- Group: Agent Dispatch
- Playbook ID: SD-018
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--agent-dispatch/markdown-agent-cli-claude-code.md`
- Introduced by: `<spec-folder>`
