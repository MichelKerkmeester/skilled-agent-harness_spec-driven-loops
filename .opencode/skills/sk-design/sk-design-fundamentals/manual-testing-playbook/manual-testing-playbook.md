---
title: "sk-design Manual Testing Playbook"
description: "Deterministic operator scenarios for sk-design, covering routing entry, value discipline, conflict handling and boundary deference, and the corpus its benchmark runs score against."
trigger_phrases:
  - "sk-design manual testing"
  - "sk-design playbook"
  - "design skill operator scenarios"
importance_tier: "important"
contextType: "general"
version: 1.0.0.0
---

# sk-design Manual Testing Playbook

Operator scenarios for the design skill. This corpus is an input: a run reads it and never rewrites it, so a later run can be compared against an earlier one.

> **EXECUTION POLICY**: Every scenario is executed for real, never mocked. Run the actual commands, issue the actual prompt, and read the actual reply. The only classifications are `PASS`, `FAIL`, or `SKIP` naming a specific sandbox or runtime blocker.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **COMPLETION**: A scenario run is incomplete until its `PASS`, `FAIL`, or `SKIP` outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into `../benchmark/reports/<dated-run-label>/`. Generated report markdown is renderer-owned and is never hand-authored.

---

## 1. OVERVIEW

### What This Package Covers

`sk-design` is a knowledge skill. It ships no scripts, so there is nothing to unit-test: every behavior worth checking is what an agent *does* when a prompt reaches it. That makes the operator-facing scenario the only meaningful test, and this package the only place those behaviors are validated.

Four categories divide the surface:

- **routing** proves the right reference loads for a realistic prompt, since a correct answer reached without loading the reference is luck.
- **value-discipline** proves the returned values come from a scale rather than from plausibility.
- **conflict-handling** proves the skill defers where it should and escalates where the decision is not its own.
- **boundary** proves it routes away from work that belongs to a neighbouring skill.

### What This Package Deliberately Leaves Out

- Package structure, root metadata and link integrity, which `validate_skill_package.py`, `ci-skill-root-metadata.cjs` and the repository link guard already own.
- Prose quality, which `validate_document.py` owns.
- Anything requiring live network access or a real browser. This skill never touches either.

---

## 2. GLOBAL PRECONDITIONS

Before running any scenario:

1. The repository is at its checked-out state with no uncommitted edit to `.opencode/skills/sk-design/` in flight. A scenario run against a dirty skill measures the edit, not the skill.
2. The skill advisor has ingested the current skill graph. When a probe returns a transport timeout rather than a ranking, re-run through the Python advisor path used in the command sequences here.
3. Agent-issued prompts are issued in a **fresh session**. A session that has already loaded a reference will appear to route correctly whether or not the router works.

No scenario in this package is destructive. Nothing writes to the repository, deletes state, or contacts a remote, so no recovery guidance is required and no scenario needs isolation.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

Every scenario captures three things:

| Evidence | Why it is required |
|---|---|
| Advisor output | Proves which skill was selected and at what confidence, rather than assuming the right one answered |
| The agent reply, verbatim | The behavior under test. A paraphrase is not evidence |
| A grep against the skill tree | Proves the rule the reply claims to follow is actually written down, not invented |

The third is what separates this corpus from a vibe check. A reply can be correct by accident; a reply that matches a grep-confirmed rule is correct on purpose.

---

## 4. DETERMINISTIC COMMAND NOTATION

Command sequences use a prefix naming the executor:

- `bash:` runs in a shell from the repository root.
- `agent:` is issued to an AI session as a prompt.

Steps are numbered and run in order. Repository-relative paths are used throughout; a developer-absolute path in a scenario would break it for every other operator.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

A reviewer reads the scenarios in category order, because the categories are ordered by what fails first. A skill that misroutes never reaches its value rules, so a routing failure makes the later categories uninformative rather than passing.

Verdict rules:

- `PASS` requires every expected signal present and no contradictory evidence in the same reply.
- `FAIL` requires naming which signal was absent or which contradiction appeared.
- `SKIP` requires naming the specific sandbox blocker, missing credential, or unavailable runtime that prevented execution. An unexplained skip is a `FAIL`.

The package is fit to ship when every routing and boundary scenario passes. Value-discipline and conflict-handling failures are real defects but do not by themselves make the skill unroutable, so they are recorded and triaged rather than treated as release blockers.

---

## 6. ORCHESTRATION AND WAVE PLANNING

The categories are independent, so a multi-agent run fans them out in one wave with one agent per category. Within a category, scenarios are also independent and can run in any order.

Two constraints bind the fan-out:

- Each agent needs its own fresh session per scenario. Reusing a session across scenarios in the same category is the most common way to produce a false pass.
- The advisor probes read one shared skill graph. If an agent regenerates skill metadata mid-run, every concurrent probe becomes untrustworthy, so metadata regeneration happens before the wave or not at all.

A single-operator run follows the same order without the fan-out and takes the categories in sequence.

---

## 7. SCENARIO INDEX

### routing

Does a realistic prompt reach the right reference before the skill answers?

- [SKD-001](routing/diagnose-entry.md) — Diagnosis entry on a vague complaint. A visual complaint must produce a named mechanical cause before any value changes.
- [SKD-002](routing/review-entry.md) — Review checklist entry on a code audit. An accessibility request must produce severity-tiered findings with file and line, not impressions.
- [SKD-003](routing/motion-entry.md) — Motion band selection. A duration question must be answered from a named band with the consistency rule attached.
- [SKD-004](routing/procedure-entry.md) — Build procedure entry from nothing. A from-scratch request must start from a feature and defer color, not open with a layout.

### value-discipline

Do the returned values come from a scale, or from plausibility?

- [SKD-010](value-discipline/on-scale-values.md) — Every value comes from a scale. The returned value must appear verbatim in the scale, with the scale named.
- [SKD-011](value-discipline/no-runtime-shades.md) — Runtime shade generation is refused. A derived hover shade must come from a defined ramp step.
- [SKD-012](value-discipline/unit-discipline.md) — Type scale unit discipline. An `em` type size must be flagged and converted without breaking the measure exception.

### conflict-handling

Does the skill defer where it should, and escalate where the decision is not its own?

- [SKD-020](conflict-handling/project-system-precedence.md) — An established project system wins. A project's own token must be adopted without argument.
- [SKD-021](conflict-handling/contrast-escape-hatches.md) — Contrast failure offers both escape hatches. A brand color that cannot reach its ratio produces two options and an escalation, not a silent recolor.
- [SKD-022](conflict-handling/shadow-system-consistency.md) — One shadow system per project. A shadow request must name which of the three systems the project is on before giving values.

### boundary

Does it route away from work that belongs to a neighbour?

- [SKD-030](boundary/extraction-defers-to-md-generator.md) — Extraction routes to the measuring skill. Measuring a live site belongs to `sk-design-md-generator`.
- [SKD-031](boundary/implementation-defers-to-sk-code.md) — Implementation routes to the code skill. Application logic with no visual surface belongs to `sk-code`.

---

## 8. AUTOMATED TEST CROSS-REFERENCE

This skill has no unit tests of its own, because it ships no executable code. Three automated gates cover what a scenario would otherwise have to check, and a scenario that duplicates one of them is redundant:

| Gate | What it covers |
|---|---|
| `ci-skill-root-metadata.cjs` | Root class, required and forbidden metadata files, generated-file freshness |
| `validate_skill_package.py` | Frontmatter, required sections, size caps, name and folder agreement |
| `validate-playbook-package.cjs` | This package's own operator-scenario contract |

---

## 9. FEATURE CATALOG CROSS-REFERENCE

`sk-design` ships no feature catalog. Its capabilities are prose knowledge rather than discrete implemented features, so a catalog would restate the reference index without adding a contract.

No scenario in this package therefore carries a catalog cross-reference, and the absence is deliberate rather than an omission. Should a catalog ever be added, every scenario's Section 4 gains a catalog row.

---

## 10. RESULTS

Runs land in [`../benchmark/reports/`](../benchmark/reports/), one dated folder each, written by the canonical wrapper. `create-manual-testing-playbook` owns the scenario contract and the results-storage rules; `create-benchmark` owns the run-folder grammar.
