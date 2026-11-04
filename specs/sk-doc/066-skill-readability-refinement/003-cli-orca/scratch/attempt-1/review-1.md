VERDICT: FIX

- [P2] `.skilled/skills/cli-orca/assets/PROVENANCE.md`:3 | 1 | The asset template requires the frontmatter description to match the intro. | Replace with:
  ```yaml
  description: "Verbatim `SKILL.md` snapshots of the eight official Orca Agent Skills, vendored so this skill can read upstream wording without a network call."
  ```

- [P2] `.skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md`:3 | 1 | The reference template requires the frontmatter description to match the intro. | Replace with:
  ```yaml
  description: "Safety-class contract for every state-changing Orca lane. Authorization, rollback and evidence rules here are hard boundaries, not suggestions."
  ```

- [P2] `.skilled/skills/cli-orca/references/orca-cli-reference.md`:3 | 1 | The reference template requires the frontmatter description to match the intro. | Replace with:
  ```yaml
  description: "Open this reference when a request needs an Orca command family and the installed guide must settle the exact flags."
  ```

- [P2] `.skilled/skills/cli-orca/references/orca-skills/computer-use.md`:3 | 1 | The reference template requires the frontmatter description to match the intro. | Replace with:
  ```yaml
  description: "The upstream file is a discovery stub: it declares when to engage, then loads the version-matched guide from the Orca executable used for the session, because the real flags live in the binary."
  ```

- [P2] `.skilled/skills/cli-orca/references/orca-skills/linear-tickets.md`:3 | 1 | The reference template requires the frontmatter description to match the intro. | Replace with:
  ```yaml
  description: "The upstream file is a discovery stub: it declares when to engage, then loads the version-matched guide from the Orca executable used for the session, because the real flags live in the binary."
  ```

- [P2] `.skilled/skills/cli-orca/references/troubleshooting.md`:3 | 1 | The reference template requires the frontmatter description to match the intro. | Replace with:
  ```yaml
  description: "Fail-closed recovery map for Orca CLI failures."
  ```

- [P2] `.skilled/skills/cli-orca/README.md`:15 | 3 | The intro restates the Overview purpose instead of giving a distinct hook. | Replace with `> Open this README when you need the local entry point for an Orca-owned request.`

- [P2] `.skilled/skills/cli-orca/ROUTER.md`:16 | 3 | The intro restates the Purpose, which already says the router selects resources for a request. | Replace with `Open this router once a request qualifies for cli-orca, before loading a local reference.`

- [P2] `.skilled/skills/cli-orca/README.md`:43 | 7 | The paragraph packs four separate ownership boundaries into prose. | Replace with:
  ```md
  What it deliberately does not own:
  - Generic Git worktrees and branch work stay with `sk-git`.
  - Chrome or Chromium CDP debugging stays with `mcp-chrome-devtools`, and generic agentic browser work stays with `mcp-aside-devtools`.
  - Supervised multi-agent coordination stays with the official `orchestration` skill, while cli-orca keeps the lightweight terminal prompts and full handoffs.
  - Ordinary shell commands with no Orca terminal involved belong to the normal coding workflow, where no skill owns them.
  ```