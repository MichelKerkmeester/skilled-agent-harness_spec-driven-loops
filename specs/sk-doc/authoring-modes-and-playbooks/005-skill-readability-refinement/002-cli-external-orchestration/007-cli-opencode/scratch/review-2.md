VERDICT: FIX

- [P2] `.skilled/skills/cli-external-orchestration/cli-opencode/README.md:162` | 8 | Only the File/Role-table half of the finding landed. The STRUCTURE tree still omits `hard-rules.json`, `scripts/` and `references/install-and-versions.md`, so the packet-root index does not list every file; `guard-2.txt` records the tree block as restored. | Insert after `  README.md                                       # this orientation document`:
  ```text
    hard-rules.json                                 # dispatch preflight rules read before a dispatch
    scripts/                                        # setup helper for the v2, side-by-side and v1 layouts
      opencode-setup.sh                             # builds the layout and reports version resolution
  ```
  and after `    destructive-scope-violations.md               # the RM-8 incident and the four-layer prevention playbook`:
  ```text
      install-and-versions.md                       # version baselines, side-by-side layout and the capability delta
  ```
  Record the whole edited tree block verbatim in `scratch/approved-blocks.md` beside `scope.txt`, or the `code-blocks.py` guard restores it again.

- [P1] `.skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md:273` | 2 | The decision tree is unchanged from HEAD: `parallel words` still splits across 277-278 and collides with `(OpenCode Copilot)`, line 280 has a bare `|` where the right branch has `v`, and `+------+------+` at 286 hangs off no column, so the four leaves cannot be traced. The redraw was restored by the block guard again. | Replace lines 273-293, from `[CALLING RUNTIME]` through `handback)      to OpenCode)`, leaving the ` ```text ` fences in place, with:
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
  Record the whole edited block verbatim in `scratch/approved-blocks.md` beside `scope.txt`, or the guard restores it again.
