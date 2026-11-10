ROLE: Release-notes editor for the Skilled framework.

TASK: Apply exactly these edits to `.skilled/changelog/skilled/v4.0.0.13.md`, in place, and change nothing else. The facts source is `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/060-v4-0-0-13-changelog-rewrite/scratch/before.md`.

1. **Title and H1.** Change both the frontmatter `title` and the H1 to: `v4.0.0.13, Sessions That Hand Themselves Over and Every Plugin on OpenCode 1 and 2`.
2. **Interrupted hop.** In "Proven Live in Thirteen Situations", change "An interrupted hop now prints a warning with the command to continue." to "A hop interrupted before the new session claims its note now prints a warning with the command to continue."
3. **Glance bullet 2.** Change its bold lead to "**The whole framework works on OpenCode 1 and 2.**", and make its first plain sentence say that all 17 plugins, the agents, the commands and one config run on both versions and showed their effect live on 1.19.3 and 2.0.32.
4. **State bullet.** In the glance bullet that starts "**State survives a rebuild.**", add one sentence: "The two Pi extension suites, the sk-git suite and two sk-doc suites now run in CI."
5. **Model.** In "A Fresh Session Picks Up the Note", change "restarts the same runtime in the same terminal" to "restarts the same runtime in the same terminal with the model you started it on".
6. **Watcher bound.** In "A Stuck Hop Leaves a Trail", add "The watcher only ever signals a process the loop started." after the sentence that ends "to continue by hand."
7. **Other providers.** In "One Default Model on Both Versions", add at the end: "`opencode-go` remains a provider you can select on OpenCode 1."
8. **Install details.** In "Both Versions Install Side by Side":
   - change "Homebrew's formula is v2-only." to "Homebrew's formula is v2-only and cannot sit beside a v1 install.";
   - add after the four-modes sentence: "Every step prints its rollback line, so each move can be undone."
9. **No behaviour change.** In "The Framework Surface Has Its Own Name", add "What it checks has not changed." before the `**Breaking:**` line, as the last sentence of the first paragraph.
10. **Existing installs.** In "A Fresh Code Mode Install Starts", change "A scoped override fixes it." to "A scoped override fixes it, and an existing install keeps working as before."
11. **Alias.** In Upgrade Notes, change "and remove any `claude` alias." to "and remove any `claude` alias, because an alias wins over the shim."

Rules: no Oxford commas, no em dashes, no semicolons. When done, print the title line and the glance list.
