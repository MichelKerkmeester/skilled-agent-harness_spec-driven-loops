VERDICT: FIX
- [P1] `.skilled/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md:49` | 5 | Rule preservation: the P1 preflight replacement rewrites the instruction, not its layout. HEAD said "check **only the exit status**"; the new text says "test **its output**" and "the status alone is not enough". That is a rule change the readability pass cannot make, even though it resolves the old prose/code mismatch. | Replace line 49 with the HEAD sentence verbatim:
  ```
  Run one cheap command and check **only the exit status**. This is the single case where `$?` is meaningful, because the app-down failure is the one failure raised by the launcher rather than by the app.
  ```

Accepted skip: `references/troubleshooting.md` §5b/§5c keep their letter suffixes; `references/troubleshooting.md:38` and `changelog/v0.23.0.0.md:86` cite §5b/§5c by number, so the two remaining `render_h2_numbering` warnings are the frozen exception the finding names.
