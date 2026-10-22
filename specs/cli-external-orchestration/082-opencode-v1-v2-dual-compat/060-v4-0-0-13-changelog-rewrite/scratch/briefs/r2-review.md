ROLE: Read-only release-notes reviewer. You must NOT edit, create or delete any file. Read only.

TASK: Round 2 review of `.skilled/changelog/skilled/v4.0.0.13.md`. The previous version is `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/060-v4-0-0-13-changelog-rewrite/scratch/before.md`.

Round 1 raised two P1s, now addressed:
- the title "Sessions That Never Run Out" overstated the handover, and the title now reads "Sessions That Hand Themselves Over and Every Plugin on OpenCode 1 and 2";
- the interrupted-hop sentence had lost its condition.

Round 1 also raised many P2s about dropped detail. The operator asked for a shorter, more marketing-style entry, so dropping low-value detail on purpose is allowed. Report a dropped fact only if its loss would mislead a user or change the meaning of a sentence that remains.

CHECK:
1. Every sentence in the file must be true to before.md. Report any claim that is new, stronger than the source, or wrong.
2. The handover and OpenCode 1 and 2 headlines must carry equal weight, from the title through the glance list to the two sections.
3. No Oxford commas, no em dashes, no semicolons, an `&nbsp;` line before every H2, and at most 12 glance bullets.

OUTPUT: one line per finding, as `P0|P1|P2: <location> - <problem> - <fix>`. End with exactly one line: `VERDICT: PASS` if there is no P0 or P1, otherwise `VERDICT: FAIL`.
