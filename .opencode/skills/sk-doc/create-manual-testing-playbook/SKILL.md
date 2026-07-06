---
name: create-manual-testing-playbook
description: Author manual testing playbook packages with deterministic scenarios, structured evidence collection, and multi-agent execution planning.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

<!-- Keywords: manual testing playbook, testing playbook, deterministic scenario, evidence collection, operator validation, multi-agent execution, release readiness, create:testing-playbook -->

# Manual Testing Playbook Creation

`create-manual-testing-playbook` is the manual-validation package workflow for the `sk-doc` family. It authors `manual_testing_playbook/` packages for skills and systems that need reproducible operator-facing scenarios, evidence capture, release-readiness review, and realistic orchestration or multi-agent execution planning.

---

## 1. WHEN TO USE

### Activation Triggers

Use this workflow when the request involves:

- `/create:testing-playbook`.
- Creating `manual_testing_playbook/manual_testing_playbook.md`.
- Building one-file-per-feature manual test scenarios.
- Designing deterministic prompts, command sequences, expected signals, evidence, pass/fail criteria, and failure triage.
- Planning manual validation across multiple operators, agents, CLIs, MCP tools, or runtime surfaces.
- Converting an ad hoc release checklist into a reusable evidence-driven playbook package.
- Aligning a manual testing playbook with a feature catalog.

Keyword triggers: `manual testing playbook`, `testing playbook`, `manual validation matrix`, `operator validation`, `deterministic scenario`, `evidence collection`, `release readiness`, `multi-agent testing`, `scenario contract`.

### When NOT to Use

Skip this workflow when:

- A small feature only needs a few checklist items in a spec folder.
- Automated tests already cover the only meaningful acceptance criteria.
- The user asks for a feature catalog rather than executable validation scenarios.
- The task is generic markdown cleanup or DQI scoring without creating a playbook package.
- The output would be an internal draft rather than a reusable operator-facing contract.

### Family Boundary

This packet owns manual testing playbook packages only. It consumes the shared `sk-doc` standards from `../shared`, but the advisor identity lives at the `sk-doc` hub root. Do not add a packet-local `graph-metadata.json`.

---

## 2. HOW IT WORKS

### Resource Routing

Load these packet-local resources before authoring:

| Need | Resource |
| --- | --- |
| Workflow contract | `references/manual_testing_playbook_creation.md` |
| Root playbook scaffold | `assets/testing_playbook/manual_testing_playbook_template.md` |
| Per-feature scenario scaffold | `assets/testing_playbook/manual_testing_playbook_snippet_template.md` |

Load these shared resources as needed:

| Need | Resource |
| --- | --- |
| Markdown structure and document type rules | `../shared/references/global/core_standards.md` |
| Validation gates and DQI workflow | `../shared/references/global/validation.md` |
| Frontmatter version expectations | `../shared/references/global/frontmatter_versioning.md` |
| Evergreen current-state wording | `../shared/references/global/evergreen_packet_id_rule.md` |
| Validators | `../shared/scripts/validate_document.py`, `../shared/scripts/extract_structure.py`, `../shared/scripts/quick_validate.py` |

### Canonical Package Shape

Author this layout:

```text
manual_testing_playbook/
├── manual_testing_playbook.md
├── 01--category-name/
│   ├── feature-name.md
│   └── another-feature-name.md
└── 02--another-category/
    └── feature-name.md
```

The root file is the directory, package policy, review protocol, orchestration guide, feature index, evidence standard, and release-readiness surface. Per-feature files carry the executable scenario truth.

### Authoring Workflow

1. Confirm the target skill or system, the feature set, and whether a feature catalog already exists.
2. Define category folders with `NN--category-name` names and stable feature IDs using `{PREFIX}-{NNN}`.
3. Create `manual_testing_playbook/manual_testing_playbook.md` from the root template.
4. Create one per-feature file per feature ID from the snippet template.
5. Write realistic user requests and exact prompts before polishing summary prose.
6. Fill the 9-column scenario contract: Feature ID, Feature Name, Scenario Objective, Exact Prompt, Exact Command Sequence, Expected Signals, Evidence, Pass/Fail Criteria, Failure Triage.
7. Keep root summaries concise and link each scenario to its per-feature file.
8. Add automated-test anchors and feature-catalog links when they exist; explicitly note exceptions.
9. Mark destructive scenarios in root preconditions and isolate their recovery expectations.
10. Validate the root document with shared validators, then manually spot-check per-feature structure and links.

### Scenario Design

Each scenario must be deterministic enough that another operator can reproduce the verdict.

Prompts should be natural-human by default. Use RCAF only when the actor is an AI orchestrator delegating to a tool, agent, CLI, or runtime.

The prompt in the root summary, `SCENARIO CONTRACT`, and execution table must stay synchronized.

Execution status is limited to `PASS`, `FAIL`, or `SKIP` with a specific sandbox blocker. Do not classify scenarios as `UNAUTOMATABLE`.

### Validation

Run shared validation on the root playbook before delivery:

```bash
python ../shared/scripts/validate_document.py manual_testing_playbook/manual_testing_playbook.md --type reference
python ../shared/scripts/extract_structure.py manual_testing_playbook/manual_testing_playbook.md
```

The current validator is root-document focused. It does not recurse into category folders or prove every cross-file playbook link. Manually review per-feature frontmatter, numbered sections, divider lines, prompt synchronization, feature ID counts, and local links.

---

## 3. RULES

### ALWAYS

1. Read the packet-local creation guide and templates before authoring.
2. Use `manual_testing_playbook.md` as the root file name.
3. Put per-feature files in numbered root-level category folders.
4. Keep one canonical per-feature file for each feature ID.
5. Use exact prompts, exact command sequences, observable expected signals, captured evidence, and binary pass/fail criteria.
6. Keep shared review, orchestration, and release-readiness rules in the root playbook.
7. Link scenarios back to the matching feature catalog entry when a catalog exists.
8. Validate the root playbook and state any remaining manual validation scope honestly.

### NEVER

1. Create a `snippets/` subtree for canonical per-feature files.
2. Create separate canonical `review_protocol.md` or `subagent_utilization_ledger.md` files.
3. Duplicate full execution truth in the root summary.
4. Renumber published feature IDs just to remove gaps.
5. Use packet-history or spec-phase references as scenario identity.
6. Ship unsynchronized prompt fields.
7. Add packet-local `graph-metadata.json`.

### ESCALATE IF

1. The target feature set, category boundary, or package owner is unclear.
2. A scenario would require destructive actions without a safe recovery path.
3. The user expects external credentials, live production access, or privileged tool execution.
4. Feature catalog links are required but no stable catalog exists.
5. Validation fails after structural fixes or the package shape conflicts with existing published playbooks.
