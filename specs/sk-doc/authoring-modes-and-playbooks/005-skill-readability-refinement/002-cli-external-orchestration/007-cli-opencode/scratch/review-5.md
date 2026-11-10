VERDICT: FIX

- [P1] `.skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md:273` | 2 | The `## 5. SMART-ROUTER DECISION TREE` block is still the broken HEAD diagram: `parallel words` splits across two lines and collides with `(OpenCode Copilot)`, and `+------+------+` hangs off no column, so the four leaves cannot be traced to their labels. This finding was not applied. | Replace the branch from `[CALLING RUNTIME]` through the final `USE CASE 1 (external to OpenCode)` leaf (current lines 273-293) with the following, leaving the `[ADR-001 SELF-INVOCATION GUARD]` block and its `NO`/`YES` fork above it unchanged:

```text
[CALLING RUNTIME]   [PROMPT KEYWORDS]
        |               |
        |               +-- parallel words ......... USE CASE 2 (in-OpenCode parallel)
        |               +-- self-dispatch only ..... REFUSE (cycle — surface ADR-001 error)
        |
        +-- Anthropic (Claude Code) ............... USE CASE 1 (external to OpenCode)
        +-- Other (OpenCode Copilot)
              |
              v
        [PROJECT SUBSYSTEM NAMED?]
              +-- YES -> USE CASE 3 (cross-AI handback)
              +-- NO  -> USE CASE 1 (external to OpenCode)
```

The remaining `SKILL.md:291` `render_section_order` warning is the documented constrained skip from finding line 12: moving §5 would break the `SKILL.md §5` reference at `manual-testing-playbook/prompt-templates/templates-inventory.md:15`.
