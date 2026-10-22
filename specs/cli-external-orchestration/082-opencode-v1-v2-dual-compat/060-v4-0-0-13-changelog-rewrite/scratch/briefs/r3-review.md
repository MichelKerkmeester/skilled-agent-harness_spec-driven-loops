ROLE: Read-only release-notes reviewer. You must NOT edit, create or delete any file. Read only.

TASK: Round 3, the final review, of `.skilled/changelog/skilled/v4.0.0.13.md`. The facts source is `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/060-v4-0-0-13-changelog-rewrite/scratch/before.md`.

Round 2 raised one P1, now addressed: the live-test and side-by-side claims had attached to agents, commands and config. They now cover only the 17 plugins and the two versions, in the second glance bullet and in the OpenCode section's lead paragraph. Round 2 also raised three P2s, now addressed: the warm-cache qualifier, the `cupt add` docs wording and the skipped archive file.

Shortening on purpose is allowed, because the operator asked for a concise marketing-style entry. Merging H4 items is also allowed.

CHECK:
1. Every sentence must be true to before.md. Report any claim that is new, stronger than the source, or wrong.
2. The handover and OpenCode 1 and 2 headlines must carry equal weight.
3. No Oxford commas, no em dashes, no semicolons, an `&nbsp;` line before every H2, and at most 12 glance bullets.

OUTPUT: one line per finding, as `P0|P1|P2: <location> - <problem> - <fix>`. End with exactly one line: `VERDICT: PASS` if there is no P0 or P1, otherwise `VERDICT: FAIL`.
