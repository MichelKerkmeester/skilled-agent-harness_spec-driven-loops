ROLE: Release-notes editor for the Skilled framework.

TASK: Apply exactly these edits to `.skilled/changelog/skilled/v4.0.0.13.md`, in place. Change nothing else. The facts source is `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/060-v4-0-0-13-changelog-rewrite/scratch/before.md`.

1. **Glance list, OpenCode bullets.** Rebalance the three OpenCode bullets (the 2nd, 4th and 6th) so each carries one theme:
   - 2nd: every plugin on both versions, tested live on 1.19.3 and 2.0.32, with the CI checks;
   - 4th: dispatch follows the installed version, the guards know the version, and one default model (`llmgateway/deepseek-v4.1-flash` at `max`) on both;
   - 6th: "**Both versions install side by side.**", covering the setup script and the `opencode2` launcher that keeps v2 on its own database, plus the unchanged command list (40 on OpenCode 1, 42 on OpenCode 2) thanks to the `.markdown` names.

   Each bullet is a bold sentence plus at most two plain sentences.
2. **Glance list, reliability bullet.** Change the bold lead of the bullet that starts "**Advisor lookups queue and give up on time.**" to "**Reliability fixes across the stack.**", and make its first plain sentence say that advisor lookups queue and give up on time.
3. **Shared database line.** In "Both Versions Install Side by Side", change "Without it OpenCode 2 opens v1's `opencode.db` and migrates it in place." to "Without it OpenCode 2 is documented to open v1's `opencode.db` and migrate it in place."
4. **Shared config folder.** In the same item, change "Both versions share one `~/.config/opencode` folder." to "Both versions share one `~/.config/opencode` folder, so a key you write for one version is live on the other."
5. **Rebuilds.** In "Fresh Worktrees Build What They Need", change "while a build that writes nothing new no longer runs" to "and a build that writes nothing new no longer rebuilds every time".
6. **Stdin cap.** In "Smaller Fixes Across the Stack", add after the git pre-commit sentence: "The shared stdin reader now stops at 64 MiB."
7. **Model reload.** In "The Local Model Frees Its Memory", add after the sentence ending "unloads after 10 minutes without an embedding.": "The next embedding reloads it in about half a second."

Rules: no Oxford commas, no em dashes, no semicolons. Keep every `&nbsp;` line and every heading as it is. When done, print the glance list.
