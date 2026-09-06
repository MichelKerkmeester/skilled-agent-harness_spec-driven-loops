# Deferred: docs still claiming twenty-one chart forms

The corpus holds 26 template files. Several live documents still say twenty-one, a count that was
correct before the corpus expansion and is now wrong.

Fixed here, because this phase rewrites these two lines anyway:

- `.opencode/commands/design/chart.md` frontmatter description
- `.opencode/skills/sk-design/command-metadata.json` command description

Left alone, because they belong to the chart mode's own documentation rather than to the command
surface this phase owns:

- `references/README.md` - "twenty-one chart forms across six question families"
- `references/template-contract.md` - three occurrences, including a per-form table introduction
- `manual-testing-playbook/manual-testing-playbook.md` - "twenty-one chart forms"
- `scripts/check-corpus.cjs` - a comment reading "twenty-one forms agreeing"

Deliberately not touched, because they are historical records of what was true when written:

- `changelog/v1.2.0.0.md` - two occurrences describing the state at that version

A count in a contract is load-bearing: the template contract's per-form table introduction promises a
table of twenty-one rows. Whoever corrects it should check the table matches, not only the number.
