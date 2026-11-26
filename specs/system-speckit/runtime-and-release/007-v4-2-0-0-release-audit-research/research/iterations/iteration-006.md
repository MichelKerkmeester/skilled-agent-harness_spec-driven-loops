# Iteration 6: Q4 runtime and hook audit

## Focus

Inspect changed system-spec-kit runtime and hook paths for logic bugs or documentation drift against v4.2.0.0, focusing on decision-capture, session-handover, CLI dispatch, overlay guard, and Git hooks.

## Actions Taken

- Read the research config, state log, strategy, and findings registry before selecting Q4.
- Compared the v4.1.0.0..HEAD changes and reviewed selected hook implementations and their release or operator documentation.
- Performed static inspection only; no tests or builds were run.

## Findings

1. **P3 — The pre-commit header's uninstall command can leave the active hook installed.** It tells the reader to remove `.git/hooks/pre-commit`, while the installer resolves the actual hook directory through Git and its `--uninstall` path removes links from that directory. The installer explicitly honors repository or global `core.hooksPath`, and the Git Hooks README recommends `install-git-hooks.sh --uninstall`. When a non-default hooks path is active, the header command can remove an inactive file and leave the actual hook in place. [SOURCE: .skilled/scripts/git-hooks/pre-commit:12-13] [SOURCE: .skilled/scripts/install-git-hooks.sh:50-53] [SOURCE: .skilled/scripts/install-git-hooks.sh:166-179] [SOURCE: .skilled/scripts/install-git-hooks.sh:204-206] [SOURCE: .skilled/scripts/git-hooks/README.md:131] [SOURCE: .skilled/scripts/git-hooks/README.md:163-165]

## Ruled Out

- The reviewed OpenCode decision-capture sweep reads `session_v2` and `session_message`, consistent with the release's OpenCode 2-only support claim; no version-layout mismatch was confirmed. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:40-43] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:128-145] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:509-522]
- The reviewed CLI dispatch path applies every rule to an unresolved OpenCode version, matching the release description; no version-gate drift was confirmed. [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1119-1145] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:516-522]
- The overlay guard's suggested `status` command is accepted by the overlay engine CLI; no command-shape drift was confirmed. [SOURCE: .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:59-63] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:23-26] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9267-9316] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9344-9348]

## Questions Answered

- None at the full-question level. This iteration found one concrete Q4 documentation mismatch, but the broader Q4 surface remains under review.

## Questions Remaining

- Q4: Do the changed system-spec-kit runtime and hooks (decision-capture, session-handover, cli-dispatch, overlay-guard, git hooks) hold logic bugs or doc drift against what v4.2.0.0 claims?
- Q5: Do the doctor commands and skill, sk-doc, sk-code, sk-git, runtime mirrors, CI workflows and the v4.2.0.0 changelog agree with the code they describe?

## Sources Consulted

- `.skilled/scripts/git-hooks/pre-commit:12-13`
- `.skilled/scripts/install-git-hooks.sh:50-53,166-179,204-206`
- `.skilled/scripts/git-hooks/README.md:131,163-165`
- `.skilled/hooks/decision-capture/bin/sweep-opencode.mjs:40-43,128-145,204-215`
- `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1119-1145`
- `.skilled/hooks/overlay-guard/lib/overlay-guard.cjs:59-63`
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:23-26,9267-9316,9344-9348`
- `.skilled/changelog/skilled/v4.2.0.0.md:509-522`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/deep-research-strategy.md:61,246-248`

## Assessment

- New information ratio: 1.0
- Questions addressed: Q4, specifically Git hook uninstall guidance
- Questions answered: none at the full-question level
- Questions remaining: 2
- Edge cases: partial success; the full Q4 surface was not exhaustively reviewed in this iteration

## Reflection

- What worked and why: comparing the hook's own recovery instructions with the installer and canonical README exposed a concrete failure for global `core.hooksPath` users.
- What did not work and why: Q4 spans more changed runtime and hook code than this focused pass could fully inspect.
- What I would do differently: continue Q4 with source-level review of the remaining changed handover and runtime paths before moving to Q5.

## Recommended Next Focus

Continue Q4 by auditing the remaining changed session-handover and system-spec-kit runtime paths, then review the git hook gate behavior beyond the uninstall instructions.
