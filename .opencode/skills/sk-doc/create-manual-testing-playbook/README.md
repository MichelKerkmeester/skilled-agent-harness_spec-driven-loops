# create-manual-testing-playbook

Author reusable manual testing playbook packages with deterministic scenarios, evidence capture, release-readiness review, and multi-operator or multi-agent execution planning.

## 1. OVERVIEW

This workflow packet turns a request for operator-facing validation into a `manual_testing_playbook/` package: one root playbook holding shared policy and review protocol, plus one file per feature scenario holding the exact prompt, commands, expected signals, evidence, and pass/fail criteria. It keeps every scenario deterministic enough for another operator or agent to reproduce the verdict, rather than leaving validation as an ad hoc checklist.

## 2. WHEN TO USE

Use this packet when you need an operator-facing validation package, not just a short checklist.

Good fits:

- `/create:manual-testing-playbook`
- Creating `manual_testing_playbook/manual_testing_playbook.md`
- Building one file per feature scenario
- Defining exact prompts, commands, expected signals, evidence, pass/fail criteria, and failure triage
- Planning validation across humans, agents, CLIs, MCP tools, or runtime surfaces
- Converting an ad hoc release checklist into a reusable evidence-driven playbook
- Aligning manual scenarios with a feature catalog

Skip it when a small feature only needs checklist rows in a spec folder, automated tests cover the only meaningful criteria, or the user asked for generic markdown cleanup instead of a playbook package.

## 3. WHAT'S INSIDE

- `SKILL.md`: Authoritative packet contract, activation rules, package shape, workflow, validation expectations, and hard rules.
- `references/README.md`: Reference map routing to the overflow detail - prompt voice (`prompt_voice.md`), common pitfalls (`common_pitfalls.md`), and reference implementations (`examples.md`). The complete workflow lives in `SKILL.md`.
- `assets/manual_testing_playbook_template.md`: Root playbook scaffold for `manual_testing_playbook/manual_testing_playbook.md`.
- `assets/manual_testing_playbook_snippet_template.md`: Per-feature scenario scaffold for `manual_testing_playbook/{category_name}/{feature_name}.md`.
- `changelog/.gitkeep`: Reserved changelog directory placeholder.
- No packet-local `scripts/` directory currently exists.
- Shared validators live under `../shared/scripts/`, including `validate_document.py` and `extract_structure.py`.

## 4. CANONICAL OUTPUT SHAPE

```text
manual_testing_playbook/
├── manual_testing_playbook.md
├── category_name/
│   ├── feature_name.md
│   └── another_feature_name.md
└── another_category/
    └── feature_name.md
```

The root playbook owns package policy, review protocol, orchestration guidance, feature index, evidence standards, and release-readiness rules.

Per-feature files own the executable scenario truth: exact prompt, exact command sequence, expected signals, evidence, pass/fail criteria, and failure triage.

## 5. QUICK START

1. Read `SKILL.md`.
2. Skim `references/README.md` for overflow detail (prompt voice, pitfalls, examples) as needed.
3. Copy the root scaffold from `assets/manual_testing_playbook_template.md`.
4. Create `manual_testing_playbook/manual_testing_playbook.md`.
5. Define category folders using a descriptive `underscore_case` slug such as `category_name`; the root `manual_testing_playbook.md` owns display order, not the folder name.
6. Create one per-feature file per feature ID from `assets/manual_testing_playbook_snippet_template.md`.
7. Keep prompt fields synchronized between the root summary, `SCENARIO CONTRACT`, and execution table.
8. Validate the root playbook from the repo root (replace `<SKILL_PATH>` with the target skill directory, e.g. `.opencode/skills/system-spec-kit`):

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <SKILL_PATH>/manual_testing_playbook/manual_testing_playbook.md --type reference
python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py <SKILL_PATH>/manual_testing_playbook/manual_testing_playbook.md
```

Then manually spot-check per-feature frontmatter, numbered sections, divider lines, feature ID counts, prompt synchronization, and local links.

## 6. HUB RELATIONSHIP

This is a nested workflow packet of the `sk-doc` parent hub.

The shared create-quality-control backbone lives at `../shared`.

The single advisor identity and mode registry live at the `sk-doc` hub root, not inside this packet.

Do not add packet-local `graph-metadata.json`.
