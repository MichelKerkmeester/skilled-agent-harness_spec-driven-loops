---
name: create-manual-testing-playbook
description: Author manual testing playbook packages with deterministic scenarios, structured evidence collection, and multi-agent execution planning.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.1.1
---

<!-- Keywords: manual testing playbook, testing playbook, deterministic scenario, evidence collection, operator validation, multi-agent execution, release readiness, create:manual-testing-playbook -->

# Manual Testing Playbook Creation

`create-manual-testing-playbook` is the manual-validation package workflow for the `sk-doc` family. It authors `manual_testing_playbook/` packages for skills and systems that need reproducible operator-facing scenarios, evidence capture, release-readiness review, and realistic orchestration or multi-agent execution planning.

Core principle: keep shared rules in the root playbook, keep execution truth in per-feature files, and make every scenario deterministic enough that another operator can reproduce the verdict.

---

## 1. WHEN TO USE

Keyword triggers: manual testing playbook, testing playbook, deterministic scenario, evidence collection, operator validation, multi-agent execution, release readiness, `/create:manual-testing-playbook`.

### Activation Triggers

Use this workflow when the request involves:

- `/create:manual-testing-playbook`.
- Creating `manual_testing_playbook/manual_testing_playbook.md`.
- Building one-file-per-feature manual test scenarios.
- Designing deterministic prompts, command sequences, expected signals, evidence, pass/fail criteria, and failure triage.
- Planning manual validation across multiple operators, agents, CLIs, MCP tools, or runtime surfaces.
- Converting an ad hoc release checklist into a reusable evidence-driven playbook package.
- Aligning a manual testing playbook with a feature catalog.

Strong signals that a playbook is warranted:

- 5+ distinct features need manual validation.
- Release decisions depend on structured evidence.
- Realistic orchestration behavior matters.
- Multiple operators or agents will execute the same scenarios.
- Automated tests cover internals but not operator-visible behavior.

### When NOT to Use

Use a lighter alternative when:

- Test steps fit cleanly in a spec folder checklist.
- The feature is one-off or experimental.
- The system has only a few manually testable behaviors.
- Automated tests already cover the only meaningful acceptance criteria.
- The user asks for a feature catalog rather than executable validation scenarios.
- The task is generic markdown cleanup or DQI scoring without creating a playbook package.

---

## 2. SMART ROUTING

### Decision Rule

Decision rule:

```text
Need reusable manual validation with captured evidence?
YES -> Create a playbook package
NO  -> Keep test steps in spec/checklist docs
```

### Family Boundary

This packet owns manual testing playbook packages only. It consumes shared `sk-doc` standards from `../shared`, but the advisor identity lives at the `sk-doc` hub root. Do not add a packet-local `graph-metadata.json`.

### Router Resilience

This packet routes by whether the target needs reusable manual validation with captured evidence. It does not use runtime keyed resource discovery through `references/<key>/` because its references are flat.

- Load optional markdown resources only after resolving them under this packet and confirming they exist.
- Treat `references/README.md` as the fallback route map when the validation scope or evidence needs are unclear.
- Ask for the missing target system, feature set, or evidence requirements instead of silently loading no resources.
- Do not add a full `references/<key>/` or `assets/<key>/` runtime-key router unless this packet gains real keyed resource subdirectories.

---

## 3. OUTPUT PACKAGE CONTRACT

### Canonical Package Shape

Author this layout:

```text
manual_testing_playbook/
|-- manual_testing_playbook.md
|-- category_name/
|   |-- feature_name.md
|   `-- another_feature_name.md
`-- another_category/
    `-- feature_name.md
```

Package invariants:

- The root file is always `manual_testing_playbook.md`.
- Per-feature files live in root-level category folders.
- Category directories use descriptive `underscore_case` names such as `category_name` (no numeric prefix).
- Per-feature files use stable `underscore_case` slugs such as `feature_name.md`; no numeric file prefix.
- Per-feature snippet order is defined by the root playbook listing order.
- Display order is owned by the root playbook index (`manual_testing_playbook.md`), not the folder name.
- Benchmark tier is owned by the per-feature file's optional `stage:` frontmatter field (`routing` default, or `holdout`/`negative`), not by a filename token.
- Every feature ID maps to exactly one per-feature file.

Do not create:

- A `snippets/` subtree for canonical per-feature files.
- Separate canonical `review_protocol.md`.
- Separate canonical `subagent_utilization_ledger.md`.
- Duplicated scenario truth across multiple sidecar files.

### Root Playbook Responsibilities

`manual_testing_playbook/manual_testing_playbook.md` is the package directory and review surface. It owns:

- Frontmatter and H1 intro.
- Global overview and coverage note.
- Global preconditions.
- Global evidence requirements.
- Deterministic command notation rules.
- Integrated review protocol and release-readiness rules.
- Integrated orchestration and wave-planning guidance.
- Category sections with short per-feature summaries.
- Automated test cross-reference section.
- Feature catalog cross-reference index.

Root summaries should be concise but useful:

- Provide enough context to understand what each scenario covers.
- Preview operator intent and prompt shape.
- Do not duplicate the full execution matrix from the per-feature file.

Root-to-feature rule: the root document explains package-level policy; per-feature files carry scenario-specific execution truth.

### Per-Feature File Responsibilities

Each per-feature file is the canonical scenario contract for one feature ID.

Required per-feature section order:

1. `## 1. OVERVIEW`
2. `## 2. SCENARIO CONTRACT`
3. `## 3. TEST EXECUTION`
4. `## 4. REFERENCES` or `## 4. SOURCE FILES`
5. `## 5. SOURCE METADATA`

Each per-feature file must include:

- Frontmatter with `title`, `description`, and a 4-part `version`.
- Realistic user request when it clarifies user intent.
- Operator prompt or orchestrator prompt.
- Exact prompt in the scenario table when a table is used.
- Exact command sequence.
- Expected signals.
- Evidence requirements.
- Pass/fail criteria.
- Failure triage.
- Root playbook link.
- Feature catalog link when applicable.

---

## 4. HOW IT WORKS - AUTHORING WORKFLOW

Follow this sequence:

1. Confirm the target skill or system, package owner, feature set, and whether a feature catalog already exists.
2. Decide whether a manual testing playbook is appropriate using the decision rule in this skill.
3. Define category directories using a descriptive `underscore_case` slug such as `category_name`.
4. Define stable feature IDs using a consistent `{PREFIX}-{NNN}` pattern.
5. Create the root `manual_testing_playbook/` directory.
6. Create `manual_testing_playbook/manual_testing_playbook.md` from `assets/testing_playbook/manual_testing_playbook_template.md`.
7. Create one per-feature file for each feature ID from `assets/testing_playbook/manual_testing_playbook_snippet_template.md`.
8. Write root package policy before writing scenario-specific exceptions.
9. Write each per-feature prompt and execution truth before polishing root summary prose.
10. Fill each scenario contract with the required 9 fields: Feature ID, Feature Name, Scenario Objective, Exact Prompt, Exact Command Sequence, Expected Signals, Evidence, Pass/Fail Criteria, Failure Triage.
11. Write root category summaries and link every per-feature file.
12. Add automated-test anchors when they exist.
13. Add feature-catalog cross-references when a catalog exists.
14. Explicitly note when a scenario has no dedicated catalog entry.
15. Review destructive scenarios and isolate them in root preconditions and recovery guidance.
16. Validate the root document with shared validators.
17. Manually spot-check per-feature structure, prompt synchronization, feature ID counts, and local links.
18. Report any remaining manual validation scope honestly.

Authoring sequence matters:

- Decide categories and IDs before writing summaries.
- Write root package policy before scenario exceptions.
- Write execution truth before root prose.
- Keep scenario-specific execution truth in per-feature files.

---

## 5. SCENARIO DESIGN RULES

### Determinism

Each scenario must be reproducible by another operator. Include exact prompts, exact command sequences, observable expected signals, captured evidence, and binary pass/fail criteria.

Execution status is limited to:

- `PASS`
- `FAIL`
- `SKIP` with a specific sandbox blocker

Do not classify scenarios as `UNAUTOMATABLE`.

### Prompt Quality

Prompts should be:

- Realistic, not bare command paraphrases.
- Deterministic enough to produce stable evidence.
- Explicit about what to capture.
- Explicit about the user-facing verdict or outcome.
- Compact enough for a 9-column table cell.

Weak prompt:

```text
Test search
```

Acceptable prompt:

```text
Use memory_context in auto mode for the flaky index scan retry issue, capture the returned bounded context, and return a concise pass/fail verdict with the main reason.
```

### Natural-Human vs RCAF Voice

The canonical `Prompt:` field defaults to natural-human voice. Match how a real user would phrase the request to an AI in conversation.

Use the RCAF wrapper only when the actor is an AI orchestrator:

```text
As a {ROLE}, {ACTION} against {TARGET}. Verify {EXPECTED_OUTCOME}. Return {OUTPUT_FORMAT}.
```

Use natural-human voice when:

- A human asks the AI directly in conversation.
- The scenario is a code review, commit/git workflow, bug fix, code question, or preference question.
- The scenario could plausibly originate from a Slack DM or terminal prompt.

Use RCAF when:

- The actor is an AI orchestrator delegating to another tool, AI, agent, CLI, or runtime.
- Role context determines safety refusal behavior.
- The validation contract treats the orchestrator as the operator.

When in doubt, prefer natural-human voice. The `Real user request:` field is always natural-human and serves as the voice reference baseline.

### Prompt Synchronization Gate

These fields must agree:

- Structured prompt field in `SCENARIO CONTRACT`.
- `Exact Prompt` column in the execution table.
- Any root summary prompt text.

Do not ship unsynchronized prompt fields.

---

## 6. VALIDATION AND RELEASE GATES

### Automated Checks

Run shared validation on the root playbook before delivery from the repo root (replace `<SKILL_PATH>` with the target skill directory, e.g. `.opencode/skills/system-spec-kit`):

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <SKILL_PATH>/manual_testing_playbook/manual_testing_playbook.md --type reference
python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py <SKILL_PATH>/manual_testing_playbook/manual_testing_playbook.md
```

Also check:

- Broken local links, by grep/script or the repository markdown-link guard.
- Feature ID counts between the root index and per-feature files.
- Automated-test links, when referenced.
- Feature-catalog links, when referenced.

### Manual Checks

The current validator is root-document focused. It does not recurse into category folders and does not prove every cross-file playbook link by itself. Cross-file markdown links are covered separately by the `check-markdown-links.cjs` CI guard, which verifies every markdown link across skills, commands, and agents and fails the PR on a broken link; per-feature file structure inside the category folders still needs manual review.

Manually verify:

- Per-feature files have frontmatter.
- Per-feature files use numbered section headers.
- Divider lines appear between numbered sections.
- Prompts are synchronized between summary fields and execution tables.
- Destructive scenarios are clearly marked and isolated.
- Review and readiness rules in the root still match the package contract.
- Every feature ID maps to exactly one per-feature file.
- Local links resolve.

Document any remaining manual scope honestly in the generated playbook docs.

---

## 7. RULES

### ALWAYS

1. Use `manual_testing_playbook.md` as the root file name.
2. Put per-feature files in root-level category folders named with the bare descriptive slug.
3. Keep one canonical per-feature file for each feature ID.
4. Use exact prompts, exact command sequences, observable expected signals, captured evidence, and binary pass/fail criteria.
5. Keep shared review, orchestration, and release-readiness rules in the root playbook.
6. Link scenarios back to the matching feature catalog entry when a catalog exists.
7. Explicitly document exceptions when no matching catalog entry exists.
8. Mark destructive scenarios and include safe recovery expectations.
9. Validate the root playbook and manually review per-feature files before delivery.

### NEVER

1. Create a `snippets/` subtree for canonical per-feature files.
2. Create separate canonical `review_protocol.md` or `subagent_utilization_ledger.md` files.
3. Duplicate full execution truth in the root summary.
4. Renumber published feature IDs just to remove gaps.
5. Use packet-history or spec-phase references as scenario identity.
6. Ship unsynchronized prompt fields.
7. Add packet-local `graph-metadata.json`.
8. Add numeric prefixes to category folder names or per-feature filenames; the root playbook index owns display order and the per-feature `stage:` field owns benchmark tier.
9. Use hyphens in category folder or per-feature filename path segments.

### ESCALATE IF

1. The target feature set, category boundary, or package owner is unclear.
2. A scenario would require destructive actions without a safe recovery path.
3. The user expects external credentials, live production access, or privileged tool execution.
4. Feature catalog links are required but no stable catalog exists.
5. Validation fails after structural fixes.
6. The requested package shape conflicts with existing published playbooks.

---

## 8. SUCCESS CRITERIA

A `create-manual-testing-playbook` run is done when:

- The package uses the canonical shape: root `manual_testing_playbook.md` plus `underscore_case` category folders of per-feature files, with no `snippets/` subtree and no separate `review_protocol.md` or `subagent_utilization_ledger.md`.
- Every feature ID maps to exactly one per-feature file, and no packet-local `graph-metadata.json` was added.
- Every scenario is deterministic: exact prompt, exact command sequence, observable expected signals, captured evidence, and binary `PASS`/`FAIL`/`SKIP` verdicts.
- Prompt fields are synchronized across the scenario contract, the execution table, and any root summary.
- Destructive scenarios are marked and isolated with safe recovery expectations.
- The root playbook passes shared `validate_document.py`, per-feature files are manually spot-checked, and any remaining manual scope is documented honestly.

---

## 9. RESOURCES FOR DEEP DETAIL & REFERENCES

The core executable workflow lives in this `SKILL.md`. Use these only for overflow detail, exhaustive examples, or template text:

- `references/README.md` - reference map routing to the overflow detail below.
- `references/prompt_voice.md` - natural-human vs RCAF decision table and voice guidelines.
- `references/common_pitfalls.md` - recurring package defects and correct fixes.
- `references/examples.md` - shipped reference playbooks and scaffold templates.
- `assets/testing_playbook/manual_testing_playbook_template.md` - root playbook scaffold.
- `assets/testing_playbook/manual_testing_playbook_snippet_template.md` - per-feature file scaffold.
- `../shared/references/core_standards.md` - shared markdown structure rules.
- `../shared/references/validation.md` - shared validation and DQI workflow.
- `../shared/references/frontmatter_versioning.md` - 4-part version expectations.
- `../shared/references/evergreen_packet_id_rule.md` - evergreen current-state wording.
