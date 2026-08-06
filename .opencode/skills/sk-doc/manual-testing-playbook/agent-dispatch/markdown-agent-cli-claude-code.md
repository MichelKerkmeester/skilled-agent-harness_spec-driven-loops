---
id: SD-018
title: '@markdown agent dispatch via cli-claude-code'
description: "This scenario validates that cli-claude-code correctly routes a /create:changelog task to the @markdown agent (the dedicated documentation executor introduced in 102-sk-doc-skill-readme-and-structure/003-markdown-agent-rename), and that the agent loads sk-doc CHANGELOG resources before scaffolding the output."
stage: routing
execution_mode: dispatch_real
expected_intent: sk-create-changelog
expected_agent: '@markdown'
expected_resources:
  - shared/assets/changelog-template.md
expected_workflow_mode: sk-create-changelog
expected_leaf_resources:
  - workflow_mode: sk-create-changelog
    leaf_resource_id: assets/changelog-template.md
version: 1.8.0.5
---

# Output existence + shape

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-018`.

---

## 1. OVERVIEW

This scenario validates that `cli-claude-code` correctly routes a `/create:changelog` task to the `@markdown` agent (the dedicated documentation executor introduced in 102-sk-doc-skill-readme-and-structure/003-markdown-agent-rename), and that the agent loads sk-doc CHANGELOG resources before scaffolding the output.

### Why This Matters

Phase 003 renamed the documentation executor from `@create` to `@markdown` without updating the sk-doc playbook. This is the first scenario that actually dispatches `@markdown` (rather than only routing-trace inspecting sk-doc). A passing run proves end-to-end that the rename's wiring holds under cli-claude-code dispatch.

---

---

## 2. SCENARIO CONTRACT

- Objective: Verify `@markdown` agent receives `/create:changelog` work dispatched through cli-claude-code.
- Real user request: scaffold a v0.1.0 changelog for a stub skill via the `@markdown` agent
- Prompt: See Setup.
- Expected signals: `@markdown` Phase 0 verification text appears in transcript; CHANGELOG asset reference appears; output file written.
- Desired user-visible outcome: A scaffolded changelog file at `/tmp/sk-test-dummy-CHANGELOG-cli-claude-code.md` with Keep-a-Changelog sections, plus a transcript showing `@markdown` Phase 0 verification ran before the YAML workflow loaded.
- Pass/fail: PASS when `@markdown` invocation appears AND output file exists AND has Keep-a-Changelog sections. PARTIAL if `@markdown` invoked but output incomplete. FAIL if a different agent answered. SKIP if `claude` binary unavailable.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use the @markdown agent to scaffold a v0.1.0 changelog for a stub skill named sk-test-dummy via /create:changelog. Write the result to /tmp/sk-test-dummy-CHANGELOG-cli-claude-code.md. Do NOT install the stub skill into the .opencode/skills/ tree. Report which agent received the work, which sk-doc resources were loaded, and the changelog sections produced.`

### Commands

```text
PROMPT='Use the @markdown agent to scaffold a v0.1.0 changelog for a stub skill named sk-test-dummy via /create:changelog. Write the result to /tmp/sk-test-dummy-CHANGELOG-cli-claude-code.md. Do NOT install the stub skill into the .opencode/skills/ tree. Report which agent received the work, which sk-doc resources were loaded, and the changelog sections produced.'

EVIDENCE='/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/<spec-folder>'

# Dispatch via cli-claude-code (Opus 4.7 1M context)
claude --model claude-opus-4-7 --print "$PROMPT" </dev/null 2>&1 | tee "$EVIDENCE"

# Append verdict footer manually after grading
```

### Expected

`@markdown` Phase 0 verification text appears in transcript; CHANGELOG asset reference appears; output file written.

### Evidence

Transcript + output changelog content.

### Pass / Fail

- **Pass**: PASS when `@markdown` invocation appears AND output file exists AND has Keep-a-Changelog sections. PARTIAL if `@markdown` invoked but output incomplete. FAIL if a different agent answered. SKIP if `claude` binary unavailable.
- **Fail**: wrong intent or empty output

### Failure Triage

Re-check `.claude/agents/markdown.md` exists; re-check `.opencode/commands/create/changelog.md` Phase 0 block.

### Optional Supplemental Checks

**Expected Behavior**

- **Intent picked**: `CHANGELOG`
- **Executor**: `@markdown` agent (Phase 0 verification text appears verbatim in transcript)
- **Resources loaded**:
  - `.opencode/skills/sk-doc/shared/assets/changelog-template.md`
  - `.opencode/skills/sk-doc/sk-create-changelog/references/README.md`
- **Outcome**: CLI scaffolds a v0.1.0 changelog file with Added / Changed / Fixed / Removed sections at `/tmp/sk-test-dummy-CHANGELOG-cli-claude-code.md`.

**Cross-CLI Variants**

This scenario is fixed to `cli-claude-code`. Equivalent dispatches for cli-opencode and cli-claude-code are SD-019 and SD-020 respectively.

**Success Criteria**

- `@markdown` invocation evidence present in transcript (regex `@markdown` or `Phase 0` Keep-a-Changelog block)
- output file exists at the requested path
- output contains at least 3 of the 4 Keep-a-Changelog sections (Added / Changed / Fixed / Removed)
- no installation under `.opencode/skills/` (stub stayed out of the skills tree)


---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | The sk-doc router under test |
| `../../sk-create-skill/scripts/validate-playbook-topology.cjs` | Routing-gold contract gate |

---

## 5. SOURCE METADATA

- Group: Agent Dispatch
- Playbook ID: SD-018
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `agent-dispatch/markdown-agent-cli-claude-code.md`

