VERDICT: FIX

- [P2] `.skilled/skills/cli-external-orchestration/cli-opencode/README.md:162` | 8 | The File/Role rows for `references/install-and-versions.md`, `hard-rules.json` and `scripts/opencode-setup.sh` are present, but the STRUCTURE-tree half of the finding is absent: the tree still omits all three, so the packet-root tree does not index every support file. The code-block guard restored the tree edit this round. | Insert after `  README.md                                       # this orientation document`:
  ```text
    hard-rules.json                                 # dispatch preflight rules read before a dispatch
    scripts/                                        # setup helper for the v2, side-by-side and v1 layouts
      opencode-setup.sh                             # builds the layout and reports version resolution
  ```
  and after `    destructive-scope-violations.md               # the RM-8 incident and the four-layer prevention playbook`:
  ```text
      install-and-versions.md                       # version baselines, side-by-side layout and the capability delta
  ```

- [P1] `.skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md:273` | 2 | The decision tree still renders with `parallel words` split across two lines and colliding with `(OpenCode Copilot)`, a bare `|` where the right branch has `v`, and a `+------+------+` that hangs off no column, so the four leaves cannot be traced. The redraw was restored by the code-block guard. | Replace current lines 273-293 (from `[CALLING RUNTIME]` through `handback)      to OpenCode)`, leaving the ```text fences) with:
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

Note: both replacements sit inside fences that `code-blocks.py` restored this round. Record each new block verbatim in `scratch/approved-blocks.md` before the next guard pass, or the guard will restore them again.
