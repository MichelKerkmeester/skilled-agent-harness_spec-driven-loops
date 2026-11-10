### .skilled/skills/sk-doc/sk-create-goal/README.md
- [P1] .skilled/skills/sk-doc/sk-create-goal/README.md:149 | 8 | The scenario index is one file short: `manual-testing-playbook/goal-authoring/` holds ten scenario docs (SCG-001 to SCG-010), the playbook root says ten, and the package validator prints `scenarios=10`, yet this sentence says nine and the table below lists nine. | Replace `holds nine deterministic operator scenarios` with `holds ten deterministic operator scenarios`, and after the `refuse-leftover-placeholder.md` row insert: `| \`refuse-leftover-placeholder-conversation.md\` | An unresolved decision fails first and passes once the operator supplies it on a later turn |`
- [P1] .skilled/skills/sk-doc/sk-create-goal/README.md:173 | 1 | The documented expected output does not match the command: the suite reports `tests 32, pass 29, fail 3`, not `pass 53, fail 0`, and the three failures are the template-parity tests against `goal.md.tmpl`, so the parity claim is also false. | Replace `\`pass 53\`, \`fail 0\`` with `\`pass 32\`, \`fail 0\`` and repair the three template-parity failures before claiming `fail 0`.
- [P1] .skilled/skills/sk-doc/sk-create-goal/README.md:175 | 1 | The playbook validator prints `scenarios=10` for this package, so `scenarios=9` cannot be the output of a passing run. | Replace `scenarios=9` with `scenarios=10`.
- [P2] .skilled/skills/sk-doc/sk-create-goal/README.md:183 | 8 | The related-documents table maps the packet's files but never lists `ROUTER.md`, the sibling router `SKILL.md` tells readers to open before selecting resources. | After the `SKILL.md` row insert: `| [\`ROUTER.md\`](./ROUTER.md) | The intent model, the pre-write routing decisions and the machine router |`

### .skilled/skills/sk-doc/sk-create-goal/ROUTER.md
- [P1] .skilled/skills/sk-doc/sk-create-goal/ROUTER.md:36 | 1 | The intent model promises that `UNKNOWN_FALLBACK` reports a disambiguation checklist, but the machine block's `UNKNOWN_FALLBACK` object (lines 71-75) carries no checklist and nothing else supplies one; the router template requires `UNKNOWN_FALLBACK_CHECKLIST`. | Replace `and reports \`UNKNOWN_FALLBACK\` with the disambiguation checklist instead of guessing a family.` with `and reports \`UNKNOWN_FALLBACK\` instead of guessing a family.`; the missing constant is a router-source fix.
- [P2] .skilled/skills/sk-doc/sk-create-goal/ROUTER.md:45 | 1 | The sentence has no verb and restates the two H3 headings that follow, so it reads as a leftover list fragment at the head of the machine section. | Delete line 45.

### .skilled/skills/sk-doc/sk-create-goal/SKILL.md
- [P2] .skilled/skills/sk-doc/sk-create-goal/SKILL.md:119 | 1 | The link description names `its scorer`, but `scripts/README.md` and the `scripts/` folder contain no scorer; the sentence describes only the checker, the lint and their tests. | Replace `describes the checker, the advisory criteria lint, its scorer and their tests.` with `describes the checker, the advisory criteria lint and their tests.`

### .skilled/skills/sk-doc/sk-create-goal/assets/goal-exemplars.md
- [P2] .skilled/skills/sk-doc/sk-create-goal/assets/goal-exemplars.md:13 | 3 | The H1 is followed directly by `## 1. OVERVIEW`; the asset template requires a 1-2 sentence hook before the overview. | Insert after line 13: `Settle a drafting question against a classified example when the rule wording alone does not decide it.` followed by a blank line and `---`.
- [P2] .skilled/skills/sk-doc/sk-create-goal/assets/goal-exemplars.md:15 | 4 | The overview is two unlabeled paragraphs, so it opens with neither Purpose nor Usage as the asset template requires. | Insert `### Purpose` before line 17 and `### Usage` before line 19.

### .skilled/skills/sk-doc/sk-create-goal/assets/goal-phase-child-template.md
- clean

### .skilled/skills/sk-doc/sk-create-goal/assets/goal-phase-parent-template.md
- clean

### .skilled/skills/sk-doc/sk-create-goal/assets/goal-top-level-template.md
- clean

### .skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md
- [P2] .skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:14 | 3 | The H1 is followed directly by `## 1. OVERVIEW`; the reference template requires a 1-2 sentence hook before the overview. | Insert after line 14: `Open this while a goal is being drafted or reviewed: each rule names the failure it prevents and the question that settles it.` followed by a blank line and `---`.
- [P2] .skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:16 | 4 | The overview is an unlabeled paragraph, so it opens with neither Purpose nor When to Use; the reference skeleton requires both before any other overview content. | Replace lines 16-18 with `## 1. OVERVIEW`, a blank line, `### Purpose`, a blank line, the existing paragraph, a blank line, `### When to Use`, a blank line and these bullets: `- Writing or revising a packet \`goal.md\`.`, `- Deciding whether a completion criterion is self-contained.`, `- Reviewing a goal before it is handed to an operator.`
