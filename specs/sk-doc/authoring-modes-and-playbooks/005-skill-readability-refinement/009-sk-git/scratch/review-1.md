VERDICT: FIX

- [P1] `.skilled/skills/sk-git/references/continuous-integration.md:28` | 4 | “When to Use” describes the workflow instead of giving a use case; the concurrent-session trigger belongs there. | Replace that section and its following workflow lead-in with:
  ```markdown
  ### When to Use

  - When concurrent sessions need each session's committed work to reach the operator's primary checkout while each session keeps its isolated worktree and MCP databases.

  ### How It Works

  The continuous-integration workflow resolves this by giving the operator one **live branch**, whatever branch the primary checkout is on, that always reflects every session's committed work within seconds:
  ```
  Keep the existing three behavior bullets after this text.

- [P2] `.skilled/skills/sk-git/references/worktree-workflows.md:159` | 7 | The closing guarantee is nested under only the scan-source bullet, which drops the lock from its cause. | Replace the indented closing line with an unindented paragraph after a blank line: `The lock serializes contenders, and the scan reads the high-water mark first, so a partial scan can never reissue a live number. Never hand-compute \`{NNN}\`.`

- [P1] `.skilled/skills/sk-git/manual-testing-playbook/recovery-and-edge-cases/empty-commit-or-no-changes.md:33,49` | Inbound references | Both references use Step 6 for readiness checks, but Step 6 is now scoped staging. | Replace `references/commit-workflows.md §3 Step 6` with `references/commit-workflows.md §3 Step 7` at both locations.

- [P1] `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-convert/source/sk-git/references/shared-patterns.md:794,861,870` | Inbound references | These references still point to Step 7 for scoped staging, which is now Step 6. | Replace each `commit-workflows.md §3 Step 7` reference with `commit-workflows.md §3 Step 6`.

Skip justifications: the `SKILL.md:153` findings about type/scope inference and trailer queries point to content in `README.md`, where those paragraphs were reformatted. The validator’s sole warning, `render_h2_numbering` on the frozen `8b.` heading, is justified by its inbound anchor. The findings file also misattributes its lookup-command finding to `commit-workflows.md`; those queries are in `README.md`.

All 17 requested validators exited 0. Sixteen reported no warnings; `worktree-workflows.md` reported only the justified frozen-heading warning.