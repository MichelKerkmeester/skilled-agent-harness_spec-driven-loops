---
title: Manual Testing Playbook Snippet Template
description: Template for per-feature scenario files stored directly under manual-testing-playbook category directories.
trigger_phrases:
  - "playbook snippet template"
  - "per feature scenario file"
  - "nine column test row"
  - "scenario execution detail"
importance_tier: normal
contextType: general
version: 1.8.0.11
---

# Manual Testing Playbook Snippet Template

Per-feature scenario files for split manual testing playbooks. Use this template for the one-file-per-feature contract described in the main playbook template.

> **EXECUTION POLICY**: Every scenario MUST be executed for real — not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual commands, inspect real files, call real handlers, and verify real outputs. The only acceptable classifications are PASS, FAIL, or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.

---

## 1. OVERVIEW

Each feature file is the canonical home for full scenario execution detail. The root `manual-testing-playbook.md` stays readable by summarizing the feature and linking here, while the feature file carries the realistic user-testing context, orchestration process, 9-column test row, structured source references, and concise metadata. The file shape should intentionally mirror the Feature Catalog snippet pattern so operators can move between the catalog and the playbook without relearning the document structure.

**Required uses**:
- One file per feature ID
- One primary 9-column scenario row per file
- Frontmatter that mirrors the larger root docs (`title` + `description`)
- Root playbook summary plus per-feature file cross-link
- Realistic user request and orchestrator prompt
- Desired user-visible outcome and execution process notes

**Do not use this template for**:
- General reusable prose fragments
- Replacing root-level review/release-readiness or orchestration guidance
- Spreading one feature across multiple primary files without a clear reason

**Validator note**: The current validator checks markdown structure on the root playbook and does not recurse into category folders, so per-feature file structure needs manual review. Cross-file markdown links are verified separately by the `check-markdown-links.cjs` CI guard (fails the PR on any broken markdown link).

---

## 2. TEMPLATE SCAFFOLD

Copy this into `manual-testing-playbook/{CATEGORY_DIR}/{FEATURE_SLUG}.md`. Both placeholder values must be kebab-case:

```markdown
---
title: "{FEATURE_ID} -- {FEATURE_NAME}"
description: "This scenario validates {FEATURE_NAME} for `{FEATURE_ID}`. It focuses on {OBJECTIVE}."
stage: routing   # routing | holdout | negative — benchmark-tier grouping; carries what a numbered filename prefix used to encode
# Lane C skill-benchmark fields — REQUIRED when this playbook also serves as a hub's
# skill-benchmark corpus. The scenario loader SKIPS any feature file whose frontmatter
# carries none of id / expected_intent / expected_resources, so a routing scenario
# without them is silently absent from the D1 benchmark. Omit them for a pure
# manual-testing playbook that is never scored.
id: "{FEATURE_ID}"                       # stable scenario id; falls back to the filename if omitted
expected_intent: "{EXPECTED_INTENT}"     # routing intent/mode the skill should select for this prompt
expected_resources:                      # resource paths the correct route must load (one per line)
  - "{EXPECTED_RESOURCE_PATH}"
version: 1.0.0.0
---

# {FEATURE_ID} -- {FEATURE_NAME}

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `{FEATURE_ID}`.

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
- Prompt: `{PROMPT — natural-human voice by default (e.g., "Review this auth diff for security issues"); use RCAF "As a {ROLE}, {ACTION} against {TARGET}. Verify {EXPECTED_OUTCOME}. Return {OUTPUT_FORMAT}." only when actor is an AI orchestrator. See references/prompt-voice.md.}`
- Expected execution process: {EXPECTED_PROCESS}
- Expected signals: {EXPECTED_SIGNALS}
- Desired user-visible outcome: {DESIRED_USER_OUTCOME}
- Pass/fail: PASS if {PASS_CONDITION}; FAIL if {FAIL_CONDITION}

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `{PROMPT — natural-human voice by default (e.g., "Review this auth diff for security issues"); use RCAF "As a {ROLE}, {ACTION} against {TARGET}. Verify {EXPECTED_OUTCOME}. Return {OUTPUT_FORMAT}." only when actor is an AI orchestrator. See references/prompt-voice.md.}`

### Commands

1. `{COMMAND_1}`
2. `{COMMAND_2}`

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

Use this subsection only when the feature needs a tightly scoped follow-up variant, compatibility check, or artifact note.

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
```

### Authoring Notes

- Keep the feature file aligned with the matching root summary block and feature-catalog entry.
- Preserve stable feature IDs and file paths once published.
- The per-feature filename is a descriptive kebab-case slug with no numeric prefix (e.g. `full-runtime-dispatch.md`, not `001-full-runtime-dispatch.md`). Ordering and benchmark tier are owned by the root index and the `stage:` frontmatter field, not the filename — the scenario loader discovers files by their frontmatter, so a numbered filename buys nothing and forces a renumber-on-insert cascade.
- Set `stage:` to mark the scenario's benchmark tier: `routing` (default — a positive in-domain recall scenario), `holdout` (a generalization scenario held out of the primary set), or `negative` (an out-of-domain scenario the skill must NOT route to). This is what a numbered/holdout/negative filename token used to signal implicitly. The skill-benchmark loader treats `stage: negative` as a suppression test (negative activation), not a positive routing hit.
- For a scenario that also feeds the Lane C skill-benchmark, fill `id`, `expected_intent`, and `expected_resources` in the frontmatter, and keep the exact executor prompt in the `### Prompt` block — the loader parses the prompt from that block and records a `missing-exact-prompt` warning when it is absent. `expected_resources` is the list of resource paths the correct route should load; the D1 score is measured against it.
- When a feature needs extra checks, add them beneath the main row instead of creating a second primary scenario row by default.
- Put feature-specific review caveats, routing notes, and isolation constraints here instead of inventing separate sidecar docs.
