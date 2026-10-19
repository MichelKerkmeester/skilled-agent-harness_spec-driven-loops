---
title: "AI-006 Doc-Frontmatter Trigger Harvest"
description: "Manual validation that the flag-gated doc harvest indexes reference/asset frontmatter, routes doc-specific prompts with matchedDocs pointers and stays inert flag-off."
trigger_phrases:
  - "ai-006"
  - "doc harvest smoke"
  - "matchedDocs validation"
  - "doc trigger flag"
version: 0.8.2.0
id: AI-006
category: auto_indexing
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# AI-006 Doc-Frontmatter Trigger Harvest

Prompt: Manual validation that the flag-gated doc harvest indexes reference/asset frontmatter, routes doc-specific prompts with matchedDocs pointers and stays inert flag-off.


---

## 1. OVERVIEW

Validate that with `SPECKIT_ADVISOR_DOC_TRIGGERS=true` the scan harvests reference/asset doc frontmatter into `skill_docs`, a doc-specific prompt routes to the owning skill carrying `matchedDocs`, and that the flag-off default is byte-identical to pre-feature behavior.

---

## 2. SCENARIO CONTRACT

- Advisor runtime built. The daemon must be spawned by a launcher whose environment carries the flag. The launcher forwards only `CHILD_ENV_ALLOWLIST` keys. A daemon started before the flag changed must be respawned via a fresh session. Do not recycle it with SIGTERM.
- Trusted caller for the scan (`--trusted` on the CLI or `SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT=trusted` in the daemon env).
- Generated trigger index present at `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` for the negative boundary check.

---

## 3. TEST EXECUTION

### Commands

1. Run a trusted scan and capture the doc counters:

```bash
node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted --format json
```

2. Inspect `skill_docs` directly (counts should match the scan's `docs` counters):

```bash
sqlite3 .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite "SELECT COUNT(*) FROM skill_docs;"
```

3. Call `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "coverage graph script exit codes" --format json` and read the top candidate.
4. Negative boundary check: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "coverage graph script exit codes"` must return spec-doc packets only, never a skill doc.
5. Flag-off invariance probe: in an isolated workspace copy without the flag, rerun steps 1-3.

### Expected

- Scan result carries `docs` counters for the current scanned and indexed corpus, and the `skill_docs` row count matches the indexed count.
- The recommend response ranks `runtime/` carrying `matchedDocs: ["references/script-interface-contract.md"]` with `doc_reference_signal` evidence.
- A doc-only match at `normal` tier stays below the 0.8 pass threshold (assists ranking, cannot hard-route alone).
- The trigger-index lookup returns zero skill-doc results. Skill docs are advisor-owned, and the trigger index covers spec docs only.
- Flag-off: no `docs` counters, `skill_docs` empty, no `matchedDocs` field, scores identical to pre-feature.

### Evidence

- Capture each command's output and exit status.
- Record the scan's `docs` counters, the `skill_docs` row count, the top recommendation and its `matchedDocs` evidence, the trigger-index result, and the flag-off counters, fields, and scores.

### Pass / Fail

- **Pass**: Every expected signal holds.
- **Fail**: Any expected signal differs.

### Failure Triage

| Symptom | Detection | Action |
| --- | --- | --- |
| Scan shows no `docs` counters with flag set in configs | `skill_docs` has 0 rows | Daemon child never received the flag: verify `CHILD_ENV_ALLOWLIST` in `system-skill-advisor-launcher.cjs` and respawn via fresh session. |
| `matchedDocs` missing while harvest counters look right | Evidence shows no `doc:` entries | Inspect projection flag gate and `runtime/lib/scorer/lanes/derived.ts` scoring. |
| Doc-heavy skill outranks curated matches | doc evidence dominates attribution | Audit top-3/tier-weight/0.45-cap constants in `runtime/lib/scorer/lanes/derived.ts`. |
| Skill docs appear in spec-doc retrieval results | the trigger index lookup returns skill paths | Block release. That boundary is an operator directive. |

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Scenario [AI-001](../../manual-testing-playbook/auto-indexing/derived-extraction.md), derived extraction baseline.
- Feature [`auto-indexing/doc-frontmatter-harvest.md`](../../feature-catalog/auto-indexing/doc-frontmatter-harvest.md).
- Source: `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts`.
- Tests: `.skilled/skills/system-skill-advisor/runtime/tests/skill-doc-harvest.vitest.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Indexing
- Playbook ID: AI-006
- Canonical root source: manual-testing-playbook.md
- Feature file path: auto-indexing/doc-frontmatter-harvest.md
