# Verdict on the GPT-5.6 Luna review of the reworked check

The reviewer was GPT-5.6 Luna at `xhigh` on the fast tier through cli-codex, in a read-only sandbox, from 2026-09-17 06:38Z to 06:53Z. A worktree fingerprint before and after matched apart from the return file and the orchestrator's own documentation commit `89aaa5f0b9`. It reviewed `057c3664c0` and `a220c9b904`, the second round of check fixes (T054).

The reviewer judged the check not ready and raised four P1 findings and one P2 finding. None of the five shapes occurs in the repository today: a search of the eleven gate files and the workflows found no root name written apart from its dot, no negated root filter, no variable root path in a git command, no echo followed by another command on a root-naming line and no trailing comment that names a root. The orchestrator turned each finding into a fixture case and ran it against the committed check before changing anything.

| ID | Checked by | Verdict | Disposition |
|----|------------|---------|-------------|
| P1-001 | `grep -E '^(\.)opencode/agents/'` puts regex syntax between the dot and the name, so no rule of the check sees a root on that line | Confirmed, outside what a text check can read | Answered, no parser change. A root spelled in pieces, by a regex or by a variable holding the name, cannot be recognized from text without guessing, and guessing would flag every line that mentions the word. The check's header now states that boundary, and the hook test scripts cover filter behavior by staging `.skilled` paths through each gate |
| P1-002 | Case 28, an inline filter with a negated one-root entry, passed the committed check | Confirmed | Fixed: negated entries are read in block and inline filters, and their twins must match |
| P1-003 | Case 29, `git diff -- "$REPO_ROOT/.skilled/skills/demo/SKILL.md"`, passed | Confirmed | Fixed: a variable root path in a git command is a pathspec, and its twin must sit in the same command. A variable path in an array stays a script path to resolve, because the real hooks keep their script arrays that way |
| P1-004 | Case 30, `echo "..." && source .opencode/lib/extra.sh`, passed because the message accounted for the whole line | Confirmed | Fixed: accounting moved from lines to command segments, array entries, filter entries and dependabot lines, so each piece that names a root must be read. A parser that fails to run now fails the file instead of reading nothing |
| P2-001 | Case 31, a trailing comment holding a one-root regex and a root path, failed the committed check | Confirmed | Fixed: the regex scan drops trailing comments as the parsers do |

While testing the fix, the orchestrator caught two regressions of its own before any dispatch. Treating a variable path in an array as a pathspec failed six script paths at `pre-commit:189-194`, and a broad regex test let `contains(github.ref, ".skilled/x")` pass. Both were corrected, and a probe for each now behaves as intended.

The suite passes 31 of 31 under `/bin/bash` 3.2.57, and the four new cases failed against `a220c9b904`. The tree passes with 130 inputs resolved, 8 dynamic and 167 twin pairs. The resolved count fell from 136 because six `$REPO_ROOT/.opencode/...` paths inside echo and printf messages are no longer checked as inputs, while each of those paths is still checked where a command uses it.
