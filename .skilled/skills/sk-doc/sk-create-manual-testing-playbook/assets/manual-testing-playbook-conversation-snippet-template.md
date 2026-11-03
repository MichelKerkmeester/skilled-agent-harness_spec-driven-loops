---
title: Manual Testing Playbook Conversation Snippet Template
description: Template for per-feature multi-turn conversation scenario files.
trigger_phrases:
  - "conversation snippet template"
  - "conversation scenario file"
  - "json conversation placeholder block"
importance_tier: normal
contextType: general
version: 1.0.1.0
---

# Manual Testing Playbook Conversation Snippet Template

Per-feature conversation scenario files for split manual testing playbooks. Use this template for one multi-turn conversation scenario per feature. Use `manual-testing-playbook-snippet-template.md` for a single-prompt scenario.

> **EXECUTION POLICY**: Every scenario MUST be executed for real, never mocked or stubbed. AI agents executing these scenarios must run the actual commands, inspect real files, call real handlers and verify real outputs. The only acceptable classifications are PASS, FAIL or SKIP with a specific sandbox or runtime blocker documented.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **COMPLETION**: This feature run is incomplete until its `PASS`, `FAIL` or `SKIP` outcome and reason are recorded into `<skill>/benchmark/reports/<dated-run-label>/`. Generated report Markdown is renderer-owned.

---

## 1. OVERVIEW

Use this template for a multi-turn conversation scenario. Use `manual-testing-playbook-snippet-template.md` for a single-prompt scenario.

Each feature file is the canonical home for full conversation scenario execution detail. The root `manual-testing-playbook.md` stays readable by summarizing the feature and linking here, while the feature file carries the realistic user-testing context, orchestration process, 9-column test row, structured source references and concise metadata. The file shape should mirror the Feature Catalog snippet pattern so operators can move between the catalog and the playbook without relearning the document structure.

**Required uses**:
- One file per feature ID
- One primary 9-column conversation scenario row per file
- Frontmatter that mirrors the larger root docs (`title` + `description`)
- Root playbook summary plus per-feature file cross-link
- Realistic user request and orchestrator prompt
- Desired user-visible outcome and execution process notes
- One required multi-turn conversation script per file
- The runner command as the exact command sequence

**Do not use this template for**:
- Single-prompt scenarios. Use `manual-testing-playbook-snippet-template.md` for those.
- General reusable prose fragments
- Replacing root-level review, release-readiness or orchestration guidance
- Spreading one feature across multiple primary files without a clear reason

This template is split from the single-prompt template because a leftover sample block in a single template passed validation silently. The obvious placeholders here fail validation until every value is replaced.

**Validator note**: `scripts/validate-playbook-package.cjs` recurses into category folders and checks per-feature structure, required execution content, verdicts, local links and root-index bijection. Cross-file markdown links are verified separately by the `check-markdown-links.cjs` CI guard.

---

## 2. TEMPLATE SCAFFOLD

Copy this into `manual-testing-playbook/{CATEGORY_DIR}/{FEATURE_SLUG}.md`. Keep `{CATEGORY_DIR}` and `{FEATURE_SLUG}` kebab-case, then replace the scenario placeholders using the notes in this scaffold:

````markdown
---
title: "{FEATURE_ID} -- {FEATURE_NAME}"
description: "This scenario validates {FEATURE_NAME} for `{FEATURE_ID}`. It focuses on {OBJECTIVE}."
stage: routing   # routing | holdout | negative. Benchmark tier that replaces the numbered filename prefix.
# Routing-gold fields. REQUIRED when the scenario claims a route. Any one of them, and
# `stage:` on its own, enrols the scenario in the topology gate
# (validate-playbook-topology.cjs). The compiled-routing validator rejects a scenario
# that lacks id, expected_intent or expected_resources. When a scenario exercises a
# script or hook and makes no routing claim, omit `stage:` together with every gold
# field: a stage without gold fails the strict topology gate.
id: "{FEATURE_ID}"                       # Stable scenario id. Falls back to the filename when omitted.
expected_intent: "{EXPECTED_INTENT}"     # Routing intent or mode the skill should select for this prompt.
expected_resources:                      # Resource paths the correct route must load, one per line.
  - "{EXPECTED_RESOURCE_PATH}"
# Routing-gold topology fields. REQUIRED when the scenario claims a route. The
# topology gate resolves these against the hub's leaf-manifest.json. Omitting them
# fails the routing-gold contract even though the operator-scenario validator never
# checks them.
expected_workflow_mode: "{EXPECTED_WORKFLOW_MODE}"   # Mode that owns the routed leaves.
expected_leaf_resources:                             # One typed pair per leaf the route loads.
  - workflow_mode: "{EXPECTED_WORKFLOW_MODE}"
    leaf_resource_id: "{LEAF_RESOURCE_ID}"
version: 1.0.0.0
---

# {FEATURE_ID} -- {FEATURE_NAME}

This document captures the realistic conversation contract, current behavior, execution flow, source anchors and metadata for `{FEATURE_ID}`.

---

## 1. OVERVIEW

This scenario validates {FEATURE_NAME} for `{FEATURE_ID}`. It focuses on {OBJECTIVE}.

### Why This Matters

{WHY_THIS_MATTERS}

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `{FEATURE_ID}` and confirm the expected signals without contradictory evidence.

- Objective: {OBJECTIVE}
- Real user request: `{REAL_USER_REQUEST}`
- Prompt: `{FIRST_SEND}`
- Expected execution process: {EXPECTED_PROCESS}
- Expected signals: {EXPECTED_SIGNALS}
- Desired user-visible outcome: {DESIRED_USER_OUTCOME}
- Pass/fail: PASS if {PASS_CONDITION}, FAIL if {FAIL_CONDITION}

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `{FIRST_SEND}`

### Conversation Script

```json conversation
{
  "runtimes": ["{RUNTIME}"],
  "turns": [
    {
      "id": "{TURN_ID}",
      "send": "{FIRST_SEND}",
      "check": "{CHECK_COMMAND}"
    }
  ]
}
```

- The first `send` must match the contract prompt exactly.
- Use one block per scenario file.
- Replace every `{...}` placeholder and keep the schema from `references/conversation-scenarios.md`.

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario <file.md> --runtime <id[,id...]> --scratch <scratch-dir> --out <evidence-dir> [--seed N] [--overwrite] [--no-sandbox]`

The scratch directory must be outside the repository.

### Expected

{EXPECTED_SIGNALS}

### Evidence

{EVIDENCE_DESCRIPTION}

### Pass / Fail

- **Pass**: {PASS_CONDITION}
- **Fail**: {FAIL_CONDITION}

### Failure Triage

{TRIAGE_STEPS}

### Optional Supplemental Checks

Use this subsection only when the feature needs a tightly scoped follow-up variant, compatibility check or artifact note.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/{CATALOG_PATH}` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `{IMPLEMENTATION_FILE}` | Primary implementation anchor |
| `{TEST_FILE}` | Regression or validation anchor |

---

## 5. SOURCE METADATA

- Group: {CATEGORY_NAME}
- Playbook ID: {FEATURE_ID}
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `{CATEGORY_DIR}/{FEATURE_SLUG}.md`
````

### Authoring Notes

- Keep the feature file aligned with the matching root summary block and feature-catalog entry.
- Preserve stable feature IDs and file paths once published.
- The per-feature filename is a descriptive kebab-case slug with no numeric prefix. For example, use `full-runtime-dispatch.md`, not `001-full-runtime-dispatch.md`. The root index owns ordering and the `stage:` field owns benchmark tier. Routing gates enrol a scenario through its frontmatter, so a numbered filename adds nothing and forces renumbering on insert.
- Use `stage:` to mark the scenario's benchmark tier. `routing` is the default positive in-domain recall tier. Use `holdout` for a generalization scenario held out of the primary set. Use `negative` for an out-of-domain scenario the skill must not route to. This field carries the meaning that a numbered filename token once implied.
- For a compiled-routing scenario, fill `id`, `expected_intent` and `expected_resources` in the frontmatter. Give the exact prompt as a fenced `**Exact prompt**` block or an inline `Prompt:` line. The validator parses both forms and rejects a scenario whose prompt it cannot parse. `expected_resources` lists the resource paths the correct route should load.
- When a feature needs extra checks, add them beneath the main row instead of creating a second primary scenario row by default.
- Put feature-specific review caveats, routing notes and isolation constraints here instead of inventing separate sidecar docs.
- The first `send` must equal the scenario contract prompt.
- Use one `json conversation` block per scenario file.
- A different scratch project or `env` needs a separate scenario file.
- Pick the style with `SKILL.md` section 6, Choosing the Scenario Style.
- Keep the schema from `references/conversation-scenarios.md`.
- Follow the authoring rules in [conversation-scenarios.md](../references/conversation-scenarios.md#7-authoring-rules) when writing a conversation script.
