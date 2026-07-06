# create-manual-testing-playbook

Author reusable manual testing playbook packages with deterministic scenarios, evidence capture, release-readiness review, and multi-operator or multi-agent execution planning.

## When To Use

Use this packet when you need an operator-facing validation package, not just a short checklist.

Good fits:

- `/create:testing-playbook`
- Creating `manual_testing_playbook/manual_testing_playbook.md`
- Building one file per feature scenario
- Defining exact prompts, commands, expected signals, evidence, pass/fail criteria, and failure triage
- Planning validation across humans, agents, CLIs, MCP tools, or runtime surfaces
- Converting an ad hoc release checklist into a reusable evidence-driven playbook
- Aligning manual scenarios with a feature catalog

Skip it when a small feature only needs checklist rows in a spec folder, automated tests cover the only meaningful criteria, or the user asked for generic markdown cleanup instead of a playbook package.

## What's Inside

- `SKILL.md`: Authoritative packet contract, activation rules, package shape, workflow, validation expectations, and hard rules.
- `references/manual_testing_playbook_creation.md`: Detailed standards for package structure, root/per-feature responsibilities, prompt quality, validation, and common mistakes.
- `assets/testing_playbook/manual_testing_playbook_template.md`: Root playbook scaffold for `manual_testing_playbook/manual_testing_playbook.md`.
- `assets/testing_playbook/manual_testing_playbook_snippet_template.md`: Per-feature scenario scaffold for `manual_testing_playbook/{NN--category}/{feature-name}.md`.
- `changelog/.gitkeep`: Reserved changelog directory placeholder.
- No packet-local `scripts/` directory currently exists.
- Shared validators live under `../shared/scripts/`, including `validate_document.py` and `extract_structure.py`.

## Canonical Output Shape

```text
manual_testing_playbook/
├── manual_testing_playbook.md
├── 01--category-name/
│   ├── feature-name.md
│   └── another-feature-name.md
└── 02--another-category/
    └── feature-name.md
```

The root playbook owns package policy, review protocol, orchestration guidance, feature index, evidence standards, and release-readiness rules.

Per-feature files own the executable scenario truth: exact prompt, exact command sequence, expected signals, evidence, pass/fail criteria, and failure triage.

## Quick Start

1. Read `SKILL.md`.
2. Read `references/manual_testing_playbook_creation.md`.
3. Copy the root scaffold from `assets/testing_playbook/manual_testing_playbook_template.md`.
4. Create `manual_testing_playbook/manual_testing_playbook.md`.
5. Define category folders using `NN--category-name`.
6. Create one per-feature file per feature ID from `assets/testing_playbook/manual_testing_playbook_snippet_template.md`.
7. Keep prompt fields synchronized between the root summary, `SCENARIO CONTRACT`, and execution table.
8. Validate the root playbook:

```bash
python ../shared/scripts/validate_document.py manual_testing_playbook/manual_testing_playbook.md --type reference
python ../shared/scripts/extract_structure.py manual_testing_playbook/manual_testing_playbook.md
```

Then manually spot-check per-feature frontmatter, numbered sections, divider lines, feature ID counts, prompt synchronization, and local links.

## Hub Relationship

This is a nested workflow packet of the `sk-doc` parent hub.

The shared doc-quality backbone lives at `../shared`.

The single advisor identity and mode registry live at the `sk-doc` hub root, not inside this packet.

Do not add packet-local `graph-metadata.json`.
