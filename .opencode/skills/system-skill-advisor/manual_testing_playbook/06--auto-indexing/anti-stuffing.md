---
title: "AI-005 Anti-Stuffing and Cardinality Caps"
description: "Manual validation that derived lane anti-stuffing enforces cardinality caps, demotes repetition-dense tokens and rejects adversarial fixtures."
trigger_phrases:
  - "ai-005"
  - "anti stuffing"
  - "cardinality cap"
  - "repetition density demote"
---

# AI-005 Anti-Stuffing and Cardinality Caps

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `lib/derived/anti-stuffing.ts` enforces cardinality caps on derived entries, demotes tokens with suspicious repetition density and rejects adversarial fixtures designed to stuff the routing surface.

---

## 2. SCENARIO CONTRACT

- Disposable workspace copy.
- MCP server built.
- Pre-built adversarial fixtures under `scripts/fixtures/` or equivalent. Otherwise generate a SKILL.md with >500 repeated trigger phrases as an isolated fixture.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred_decisions.md` §F34 for rationale.

1. Copy an existing active skill into the disposable copy and duplicate a trigger phrase 1000 times in its body.
2. Add a second fixture where a single n-gram is repeated with only punctuation variation.
3. Trigger reindex:

```bash
touch /tmp/path-to-copy/.opencode/skills/adversarial-fixture/SKILL.md
```

4. Read the fixture's `graph-metadata.json.derived` block.
5. Call `advisor_recommend` with a prompt that would match the stuffed n-gram. Compare the fixture's derived lane score against a normal skill.

### Expected Signals

- The fixture's derived entries respect a hard cardinality cap (not every repetition is stored).
- Tokens with high repetition density receive demoted weights relative to normal skills.
- Known adversarial fixtures (per the bundled test suite) are rejected and excluded from routing.
- The fixture does not outrank an honest candidate in `advisor_recommend` output.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Cardinality cap ineffective | Derived list is unbounded | Inspect `lib/derived/anti-stuffing.ts` cap enforcement. |
| No repetition demotion | Stuffed fixture outranks normals | Audit density-weighted scoring. |
| Adversarial fixture routed | Fixture slug appears as top-1 | Block release. Update rejection list. |

---

## 4. SOURCE FILES

- Scenario [AI-002](./sanitizer-boundaries.md), sanitizer at write boundaries.
- Feature [`02--auto-indexing/anti-stuffing.md`](../../feature_catalog/02--auto-indexing/anti-stuffing.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/derived/anti-stuffing.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Indexing
- Playbook ID: AI-005
- Canonical root source: manual_testing_playbook.md
- Feature file path: 06--auto-indexing/anti-stuffing.md
