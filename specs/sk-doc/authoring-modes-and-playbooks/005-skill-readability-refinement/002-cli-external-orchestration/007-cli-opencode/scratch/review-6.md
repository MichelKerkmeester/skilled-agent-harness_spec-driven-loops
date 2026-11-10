VERDICT: FIX

- [P1] `.skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md:273` | 2 | The smart-router decision tree still renders wrong: `parallel words` is split across lines 278-279 and collides with `(OpenCode Copilot)`, the left branch shows `|` where the right branch shows `v` at line 280, and `+------+------+` at line 286 hangs off no column, so the four leaves cannot be traced to their labels. No code block changed this round (`code_blocks_changed=0`), so the finding was not applied. | Replace lines 273-293 (from `[CALLING RUNTIME]` through `handback)      to OpenCode)`) with:

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

Keep the ADR-001 guard block and its `NO`/`YES` fan-in above line 273, and the closing fence at line 294, unchanged.
