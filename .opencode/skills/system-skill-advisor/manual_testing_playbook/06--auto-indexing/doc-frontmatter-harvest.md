---
title: "AI-006 Doc-Frontmatter Trigger Harvest"
description: "Manual validation that the flag-gated doc harvest indexes reference/asset frontmatter, routes doc-specific prompts with matchedDocs pointers and stays inert flag-off."
trigger_phrases:
  - "ai-006"
  - "doc harvest smoke"
  - "matchedDocs validation"
  - "doc trigger flag"
version: 0.8.0.1
---

# AI-006 Doc-Frontmatter Trigger Harvest

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that with `SPECKIT_ADVISOR_DOC_TRIGGERS=true` the scan harvests reference/asset doc frontmatter into `skill_docs`, a doc-specific prompt routes to the owning skill carrying `matchedDocs`, and that the flag-off default is byte-identical to pre-feature behavior.

---

## 2. SCENARIO CONTRACT

- MCP server built; daemon spawned by a launcher whose environment carries the flag (the launcher forwards only `CHILD_ENV_ALLOWLIST` keys — a daemon predating the flag flip must be respawned via a fresh session, never SIGTERM-recycled).
- Trusted caller for the scan (`--trusted` on the CLI or a trusted MCP env block).
- Spec Kit Memory MCP reachable for the negative boundary check.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred_decisions.md` §F34 for rationale.

1. Run a trusted scan and capture the doc counters:

```bash
node .opencode/bin/skill-advisor.cjs skill_graph_scan --trusted --format json
```

2. Inspect `skill_docs` directly (counts should match the scan's `docs` counters):

```bash
sqlite3 .opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite "SELECT COUNT(*) FROM skill_docs;"
```

3. Call `advisor_recommend({ prompt: "coverage graph script exit codes" })` (MCP or CLI) and read the top candidate.
4. Negative boundary check: `memory_match_triggers({ prompt: "coverage graph script exit codes" })` must return spec-doc memories only.
5. Flag-off invariance probe: in an isolated workspace copy without the flag, rerun steps 1-3.

### Expected Signals

- Scan result carries `docs` counters (~355 scanned / 84 indexed on the 2026-06-11 corpus; grows as the frontmatter campaign lands) and `skill_docs` row count matches.
- The recommend response ranks `deep-loop-runtime` carrying `matchedDocs: ["references/script_interface_contract.md"]` with `doc_reference_signal` evidence.
- A doc-only match at `normal` tier stays below the 0.8 pass threshold (assists ranking, cannot hard-route alone).
- Memory returns zero skill-doc results (skill docs are advisor-owned; memory never indexes them).
- Flag-off: no `docs` counters, `skill_docs` empty, no `matchedDocs` field, scores identical to pre-feature.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Scan shows no `docs` counters with flag set in configs | `skill_docs` has 0 rows | Daemon child never received the flag: verify `CHILD_ENV_ALLOWLIST` in `mk-skill-advisor-launcher.cjs` and respawn via fresh session. |
| `matchedDocs` missing while harvest counters look right | Evidence shows no `doc:` entries | Inspect projection flag gate and `lanes/derived.ts` scoring. |
| Doc-heavy skill outranks curated matches | doc evidence dominates attribution | Audit top-3/tier-weight/0.45-cap constants in `lanes/derived.ts`. |
| Skill docs appear in memory results | `memory_match_triggers` returns skill paths | Block release — the memory boundary is an operator directive. |

### Evidence

Step 1 command:

```bash
node .opencode/bin/skill-advisor.cjs skill_graph_scan --trusted --format json
```

Observed output:

```json
{
  "status": "error",
  "data": {
    "progress": [
      {
        "step": "advisor_status_before",
        "generation": 9476,
        "ok": true
      },
      {
        "step": "skill_graph_scan",
        "ok": false
      },
      {
        "step": "advisor_status_after",
        "generation": 9476,
        "ok": true
      }
    ],
    "generationBefore": 9476,
    "generationAfter": 9476,
    "scan": {
      "status": "error",
      "error": "Skill graph scan failed: .opencode/skills/z_archive/cli-codex-retired/graph-metadata.json: skill_id \"cli-codex\" does not match folder name \"cli-codex-retired\""
    }
  },
  "error": "Skill graph scan failed: .opencode/skills/z_archive/cli-codex-retired/graph-metadata.json: skill_id \"cli-codex\" does not match folder name \"cli-codex-retired\""
}
```

Step 2 command:

```bash
sqlite3 .opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite "SELECT COUNT(*) FROM skill_docs;"
```

Observed output:

```text
295
```

Step 3 command:

```bash
node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"coverage graph script exit codes"}' --format json
```

Observed output:

```json
{
  "status": "ok",
  "data": {
    "workspaceRoot": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public",
    "effectiveThresholds": {
      "confidenceThreshold": 0.8,
      "uncertaintyThreshold": 0.35,
      "confidenceOnly": false
    },
    "recommendations": [],
    "ambiguous": false,
    "freshness": "unavailable",
    "trustState": {
      "state": "unavailable",
      "reason": "advisor_unavailable",
      "generation": 9476,
      "checkedAt": "2026-07-03T02:19:30.702Z",
      "lastLiveAt": null
    },
    "generatedAt": "2026-07-03T02:19:30.702Z",
    "cache": {
      "hit": false,
      "sourceSignaturePresent": false
    },
    "warnings": [
      "advisor_unavailable"
    ],
    "abstainReasons": [
      "Skill advisor freshness is unavailable; returning fail-open empty recommendations."
    ]
  }
}
```

Step 4 MCP call:

```text
memory_match_triggers({ prompt: "coverage graph script exit codes", limit: 10 })
```

Observed output excerpt with actual returned values:

```json
{
  "summary": "Found 10 memories",
  "data": {
    "matchType": "trigger-phrase",
    "count": 10,
    "results": [
      {
        "memoryId": 8651,
        "specFolder": "system-spec-kit/z_archive/024-compact-code-graph/019-code-graph-auto-trigger",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/z_archive/024-compact-code-graph/019-code-graph-auto-trigger/spec.md",
        "title": "Phase 019: Code Graph Auto-Trigger [system-spec-kit/024-compact-code-graph/019-code-graph-auto-trigger/spec]",
        "matchedPhrases": ["graph"],
        "importanceWeight": 0.8
      },
      {
        "memoryId": 8580,
        "specFolder": "system-spec-kit/z_archive/024-compact-code-graph/009-code-graph-storage-query",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/z_archive/024-compact-code-graph/009-code-graph-storage-query/spec.md",
        "title": "Phase 009: Code Graph Storage + Query [system-spec-kit/024-compact-code-graph/009-code-graph-storage-query/spec]",
        "matchedPhrases": ["graph"],
        "importanceWeight": 0.8,
        "compact": true
      },
      {
        "memoryId": 6901,
        "specFolder": "system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/053-script-analysis-testing",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/053-script-analysis-testing/spec.md",
        "title": "Feature Specificatio [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/053-script-analysis-testing/spec]",
        "matchedPhrases": ["script"],
        "importanceWeight": 0.8,
        "compact": true
      }
    ],
    "constitutionalCount": 0
  }
}
```

Step 5 was not run. The required flag-off invariance probe specifies "in an isolated workspace copy without the flag," but this execution was constrained to the single allowed write path above, and the prerequisite trusted scan in Step 1 failed before doc counters were available.

### Pass/Fail

BLOCKED - The trusted scan prerequisite failed with `skill_id "cli-codex" does not match folder name "cli-codex-retired"`, so the scenario could not produce doc counters, verify `matchedDocs`, or run the isolated flag-off invariance probe.

---

## 4. SOURCE FILES

- Scenario [AI-001](./derived-extraction.md), derived extraction baseline.
- Feature [`02--auto-indexing/doc-frontmatter-harvest.md`](../../feature_catalog/02--auto-indexing/doc-frontmatter-harvest.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/doc-frontmatter.ts`.
- Tests: `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-doc-harvest.vitest.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Indexing
- Playbook ID: AI-006
- Canonical root source: manual_testing_playbook.md
- Feature file path: 06--auto-indexing/doc-frontmatter-harvest.md
