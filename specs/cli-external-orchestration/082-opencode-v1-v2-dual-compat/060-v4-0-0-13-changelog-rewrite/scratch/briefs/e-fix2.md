ROLE: Release-notes editor for the Skilled framework.

TASK: Apply exactly these edits to `.skilled/changelog/skilled/v4.0.0.13.md`, in place, and change nothing else.

1. **Glance bullet 2.** It starts "**The whole framework works on OpenCode 1 and 2.**". Rewrite its plain sentences so they say:
   - the 17 plugins, the agents, the commands and one config run on both versions;
   - only the 17 plugins showed their effect live on 1.19.3 and 2.0.32.

   Keep the CI sentence as it is.
2. **OpenCode section lead.** The lead paragraph is directly under `## OpenCode 1 and 2`. Rewrite it so that:
   - the 17 plugins, the agents, the commands and one config run on both versions from one source;
   - the two versions install side by side;
   - the 17 plugins were tested live on 1.19.3 and 2.0.32.

   Keep it at two or three sentences.
3. **Model reload.** In "The Local Model Frees Its Memory", change "The next embedding reloads it in about half a second." to "The next embedding reloads it in about half a second on a warm model cache."
4. **cupt add.** In "ClickUp and Figma Install More Safely", change "and `cupt add` sends the plain description" to "and the docs now say `cupt add` sends the plain description".
5. **Archive file.** In "A Corrupt Goal Record Reads Empty", change "An archive file holding something other than a goal record, such as a bare null, no longer hides every archived goal." to "An archive file holding something other than a goal record, such as a bare null, used to hide every archived goal and is now skipped."

Rules: no Oxford commas, no em dashes, no semicolons. When done, print the changed lines.
