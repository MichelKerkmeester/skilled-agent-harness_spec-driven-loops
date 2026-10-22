ROLE: Read-only release-notes reviewer. You must NOT edit, create or delete any file. Read only.

TASK: Review the rewritten changelog `.skilled/changelog/skilled/v4.0.0.13.md` against the previous version `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/060-v4-0-0-13-changelog-rewrite/scratch/before.md`.

CHECK:
1. **Fact fidelity.** Every fact, number, path, command, setting and name in the new file must be stated, or directly implied, in before.md. Flag any claim that is new, stronger, weaker in a way that changes meaning, or wrong. Examples: a changed number, a hedge removed, a mechanism misdescribed, a runtime list changed.
2. **Lost facts.** List any fact from before.md that a user would act on or notice but that is missing from the new file. This is a P2 unless the loss would mislead a user, in which case it is a P1.
3. **Equal headlines.** The two headlines must carry equal weight from the top: in-session handover, and the framework on OpenCode 1 and 2 (all 17 plugins on both versions). Check the title, the description, the opening paragraphs, Why This Release, the glance order and the two sections' length. Flag any imbalance.
4. **Contract.** No Oxford commas, no em dashes and no semicolons. An `&nbsp;` line before every H2. H4 headings of 2-7 words. At most 12 glance bullets. No phase numbers or finding ids.

SEVERITY: P0 for a false claim a user would act on, P1 for any other false or changed-meaning claim or a misleading loss, P2 for minor losses and style.

OUTPUT: list each finding on its own line as `P0|P1|P2: <location> - <problem> - <fix>`. End with exactly one line, `VERDICT: PASS` (no P0 or P1) or `VERDICT: FAIL`.
