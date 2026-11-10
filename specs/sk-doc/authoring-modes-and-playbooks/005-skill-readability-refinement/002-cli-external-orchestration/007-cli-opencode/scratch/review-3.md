VERDICT: FIX

- [P2] `.skilled/skills/cli-external-orchestration/cli-opencode/README.md:162` | 8 | The File/Role-table half landed, but the §5 STRUCTURE tree still omits `hard-rules.json`, `scripts/` and `references/install-and-versions.md`, so the directory index does not list every support file; `guard-3.txt` records the tree block as restored. | Insert after `  README.md                                       # this orientation document`:
```text
  hard-rules.json                                 # dispatch preflight rules read before a dispatch
  scripts/                                        # setup helper for the v2, side-by-side and v1 layouts
    opencode-setup.sh                             # builds the layout and reports version resolution
```
and after `    destructive-scope-violations.md               # the RM-8 incident and the four-layer prevention playbook`:
```text
    install-and-versions.md                       # version baselines, side-by-side layout and the capability delta
```

- [P1] `.skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md:273` | 2 | The decision tree is unchanged from HEAD: `parallel words` still splits across lines and collides with `(OpenCode Copilot)`, a bare `|` sits where the right branch has `v`, and `+------+------+` hangs off no column, so the four leaves cannot be traced. The redraw was restored by the block guard. | Replace lines 273-293 (from `[CALLING RUNTIME]` through `handback)      to OpenCode)`), leaving the ` ```text ` fences in place, with:
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

- [P2] `.skilled/skills/cli-external-orchestration/cli-opencode/references/opencode-tools.md:25` | contract | The finding changed HEAD's sibling list from `cli-opencode` to `cli-codex`, which changes a named claim; this readability pass freezes every claim and authorizes no factual rewrite. Restore the HEAD text and route the factual correction as a separate content change. | replace `The sibling cli-* skills (cli-claude-code, cli-codex) dispatch` with `The sibling cli-* skills (cli-claude-code, cli-opencode) dispatch`.

- [P2] `.skilled/skills/cli-external-orchestration/cli-opencode/references/opencode-tools.md:183` | contract | Same problem: HEAD attributes `-p <profile>` to `cli-opencode`, and the edit reassigns the example to `cli-codex`, changing the claim's owner. | replace `cli-codex's `-p <profile>` flag` with `cli-opencode's `-p <profile>` flag`.

Accepted skip: `SKILL.md:291` keeps `## 5. REFERENCES AND RELATED RESOURCES` before §6-§7 because §5 is cited by number (`manual-testing-playbook/prompt-templates/templates-inventory.md:15`); the remaining `render_section_order` warning is the recorded inbound constraint. Record both corrected blocks in `scratch/approved-blocks.md` before the next guard pass, or `code-blocks.py` will restore them again.
