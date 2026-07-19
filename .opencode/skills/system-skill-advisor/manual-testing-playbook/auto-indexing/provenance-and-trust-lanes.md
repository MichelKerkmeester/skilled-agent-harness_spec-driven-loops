---
title: "AI-003 Provenance Fingerprints and Trust Lanes"
description: "Manual validation that derived entries carry provenance fingerprints and are tagged with the correct trust lane (author, frontmatter, body, examples, local_docs, derived_local)."
trigger_phrases:
  - "ai-003"
  - "provenance fingerprint"
  - "trust lanes"
  - "derived provenance"
version: 0.8.0.15
id: AI-003
category: auto_indexing
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# AI-003 Provenance Fingerprints and Trust Lanes

Prompt: Manual validation that derived entries carry provenance fingerprints and are tagged with the correct trust lane (author, frontmatter, body, examples, local_docs, derived_local).


<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `lib/derived/provenance.ts` writes provenance fingerprints for each derived entry and that `lib/derived/trust-lanes.ts` assigns the correct lane among `author`, `frontmatter`, `body`, `examples`, `local_docs` and `derived_local`.

---

## 2. SCENARIO CONTRACT

- Disposable workspace copy or read-only inspection against the live repo.
- MCP server built. Daemon reachable.
- A target skill with content spanning multiple lane sources (frontmatter, body, a fenced example and a local references/ or assets/ doc).

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred-decisions.md` §F34 for rationale.

1. Read the target skill's `graph-metadata.json.derived` block for the current state.
2. Identify the derived lane sources present in the target (frontmatter terms, fenced examples, local docs, body n-grams).
3. Confirm the derived block carries the block-level `provenance_fingerprint` and `trust_lane` fields (provenance is tracked per derived block, not per entry).
4. Touch the target skill to force a reindex:

```bash
touch .opencode/skills/sk-doc/SKILL.md
```

5. Re-read `graph-metadata.json.derived` and verify fingerprints are stable for unchanged sources and changed for mutated sources.

### Expected Signals

- The derived block carries block-level `provenance_fingerprint` and `trust_lane` fields; per-entry provenance/lane fields are not part of the shipped schema.
- The trust lane matches the block's source tier (author-tier frontmatter signals resolve to the author lane; harvested content resolves to the derived lane).
- Fingerprints are stable across reindex for unchanged content and change only when the underlying source bytes change.
- Author-tier tokens (intent_signals in frontmatter) resolve to the `author` lane.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Missing provenance | Derived entry lacks fingerprint | Inspect `lib/derived/provenance.ts` write path. |
| Wrong lane tag | Body token shows `author` or vice versa | Audit `trust-lanes.ts` classification rules. |
| Unstable fingerprints | Fingerprint changes without source change | Verify sort order and fingerprint input normalization. |

### Evidence

Precondition check, MCP skill graph status:

```json
{"status":"ok","data":{"totalSkills":20,"totalEdges":81,"lastIndexedAt":"2026-06-28T16:25:56.252Z","families":[{"name":"cli","count":3},{"name":"deep-loop","count":2},{"name":"mcp","count":5},{"name":"sk-code","count":3},{"name":"sk-util","count":4},{"name":"system","count":3}],"categories":[{"name":"cli-orchestrator","count":3},{"name":"code-quality","count":2},{"name":"design","count":1},{"name":"mcp-tool","count":5},{"name":"system","count":4},{"name":"utility","count":4},{"name":"workflow","count":1}],"schemaVersions":[{"name":"2","count":20}],"staleness":{"trackedSkills":20,"freshSourceFiles":0,"changedSourceFiles":19,"missingSourceFiles":1,"staleSkillIds":["cli-claude-code","cli-codex","cli-opencode","deep-loop-runtime","system-deep-loop","mcp-chrome-devtools","mcp-click-up","mcp-code-mode","mcp-figma","mcp-open-design","sk-code","sk-code-review","sk-design","sk-doc","sk-git","sk-prompt","sk-prompt/prompt-models","system-code-graph","system-skill-advisor","system-spec-kit"]},"validation":{"brokenEdgeCount":0,"weightBandViolations":4,"unsupportedSchemaVersionCount":0,"isHealthy":true},"dbStatus":"ready"}}
```

Target skill metadata read from `.opencode/skills/sk-doc/graph-metadata.json`:

```json
{
  "schema_version": 2,
  "skill_id": "sk-doc",
  "family": "sk-util",
  "category": "utility",
  "domains": [
    "documentation",
    "markdown",
    "readme",
    "guide",
    "flowchart",
    "catalog"
  ],
  "intent_signals": [
    "create readme",
    "write documentation",
    "install guide",
    "feature catalog",
    "skill.md headline",
    "rewrite section",
    "documentation section",
    "headline section",
    "headline section to clarify",
    "update skill.md",
    "update sk-code skill.md",
    "update the sk-code skill.md",
    "clarify the routing",
    "clarify the routing model",
    "clarify the two-axis routing",
    "rewrite the headline",
    "reorganize the readme",
    "reorganize readme into",
    "reorganize the cli",
    "add a one-line summary",
    "one-line summary at the top"
  ],
  "derived": {
    "trigger_phrases": [
      "create readme",
      "write documentation",
      "install guide",
      "feature catalog",
      "documentation quality workflow",
      "validate markdown structure",
      "create skill or readme docs",
      "ascii flowchart generation",
      "sk-doc",
      "sk doc",
      "markdown-quality",
      "skill-creation"
    ],
    "key_topics": [
      "documentation",
      "markdown",
      "readme",
      "guide",
      "flowchart",
      "catalog",
      "markdown validation",
      "component creation",
      "templates",
      "flowcharts"
    ],
    "intent_signals": [
      "write documentation",
      "validate markdown",
      "create readme",
      "scaffold component",
      "build install guide"
    ],
    "key_files": [
      ".opencode/skills/sk-doc/SKILL.md",
      ".opencode/skills/sk-doc/README.md",
      ".opencode/skills/sk-doc/shared/references/validation.md",
      ".opencode/skills/sk-doc/create-skill/references/README.md",
      ".opencode/skills/sk-doc/create-readme/assets/readme-template.md",
      ".opencode/skills/sk-doc/scripts/validate_document.py",
      ".opencode/skills/sk-doc/scripts/extract_structure.py",
      ".opencode/skills/sk-doc/shared/assets/template-rules.json"
    ],
    "causal_summary": "Unified markdown and OpenCode component specialist providing document quality enforcement, content optimization, component creation workflows (skills, agents, commands), ASCII flowcharts, install guides, feature catalogs, and manual testing playbooks. It matters because it gives the workspace a single specialist for creating and validating high-quality markdown components and documentation artifacts.",
    "source_docs": [
      "SKILL.md",
      "README.md",
      "references/global/validation.md",
      "references/skill-creation.md",
      "references/README.md"
    ],
    "created_at": "2026-04-13T00:00:00Z",
    "last_updated_at": "2026-04-13T23:00:00Z"
  }
}
```

Derived provenance/trust field check:

```bash
jq '.derived | {provenance_fingerprint, trust_lane, intent_signals, source_docs}' '.opencode/skills/sk-doc/graph-metadata.json'
```

```json
{
  "provenance_fingerprint": null,
  "trust_lane": null,
  "intent_signals": [
    "write documentation",
    "validate markdown",
    "create readme",
    "scaffold component",
    "build install guide"
  ],
  "source_docs": [
    "SKILL.md",
    "README.md",
    "references/global/validation.md",
    "references/skill-creation.md",
    "references/README.md"
  ]
}
```

Fenced example source check:

~~~text
Found 2 matches
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/SKILL.md:
  Line 208: ```python

  Line 345: ```
~~~

Local docs/assets source check returned paths including:

```text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/shared/assets/frontmatter-templates.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual-testing-playbook-template.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/shared/references/validation.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-skill/references/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-readme/references/README.md
```

The scenario command below was not run because this manual execution was constrained to write only this scenario file, and `touch` would modify `.opencode/skills/sk-doc/SKILL.md` metadata:

```bash
touch .opencode/skills/sk-doc/SKILL.md
```

### Pass/Fail

BLOCKED. The scenario requires `touch .opencode/skills/sk-doc/SKILL.md` to force reindexing, but the execution request allowed writes only to `.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/provenance-and-trust-lanes.md`. Read-only evidence also showed `provenance_fingerprint: null` and `trust_lane: null` in the current derived block, so the expected provenance/trust fields were not observable before the blocked reindex step.

---

## 4. SOURCE FILES

- Scenario [AI-001](../../manual-testing-playbook/auto-indexing/derived-extraction.md), deterministic extraction.
- Scenario [SC-004](../../manual-testing-playbook/scorer-fusion/lane-attribution.md), lane attribution on the read side.
- Feature [`auto-indexing/provenance-and-trust-lanes.md`](../../feature-catalog/auto-indexing/provenance-and-trust-lanes.md).
- Source: `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/provenance.ts` and `lib/derived/trust-lanes.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Indexing
- Playbook ID: AI-003
- Canonical root source: manual-testing-playbook.md
- Feature file path: auto-indexing/provenance-and-trust-lanes.md
