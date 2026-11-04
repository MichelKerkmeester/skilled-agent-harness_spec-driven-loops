Review 2 passed with two render warnings left on `references/troubleshooting.md`, whose `## 5b` and `## 5c` letter-suffixed sections the review accepted as frozen. They were fixed by hand after the run: both became subsections of section 5, now titled "Official CLI Issues", beside its "Not Registered" subsection, so sections 6 to 12 keep their numbers. The one inbound citation, the overview's "(§5b)", now reads "(§5)", and the diagnosis table names the subsections. No file links to the old anchors. The file validates with 0 issues.

A read of the diff found nothing to restore. Checked and kept:
- The review rightly kept the official CLI preflight rule, "check **only the exit status**", verbatim after a fixer round rewrote it.
- `obsidian-cli-commands.md` moves AGENT INVARIANTS ahead of the commands they govern, as section 4, so the later sections shift by one. Its in-file pointer moves from §11 to §4. The only outside citations are in the completed packet `specs/mcp-tooling/019-official-obsidian-cli/001-cli-versus-mcp` (plan and acceptance criteria), which record that packet's history and stay as written.
- `plugin-development.md`'s scope section moved into its overview as Boundaries, word for word.
- `installed-plugins.md` puts the roster upkeep before the notes, and its own citations of §1 to §3 are unaffected.
- The official CLI intro now says why the file matters; its claim about writing to the wrong note is the active-file default the body documents.
- "Phase 11" was dropped from three installed-version cells as authoring history.
