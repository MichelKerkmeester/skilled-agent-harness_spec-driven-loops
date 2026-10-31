# An absent mirror is never created by the check

The n/a row is the route step rule: the workflow declares that a checkout with no
`.hermes/` tree reports n/a and adds no row, and the contract test asserts that sentence
in both Hermes steps. The half that can be observed here is the second clause, that the
check form leaves an absent tree absent.

```text
$ test -e absent-hermes/skills   # before
exit 1 (absent)

$ HERMES_SKILLS_OUTPUT_DIR=<scratch>/absent-hermes/skills node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check
DRIFT agent-prompt-improver
DRIFT agent-review
FAIL: 65 drifted, 0 stale; run without --check to regenerate
exit 1

$ test -e <scratch>/absent-hermes/skills   # after
exit 1 (still absent, the check created nothing)
```

The shape to read: the check reports every copy as drifted because there is no tree to
compare, and it leaves the absent directory absent. The generator is what creates the
tree, and the route never runs it.
