---
title: "PI-005 -- Nested skill flattening risk"
description: "This scenario isolates the unknown whether nested mode `SKILL.md` files surface as independent Pi skills rather than preserving the parent-hub design for `PI-005`."
version: 1.0.0.0
---

# PI-005 -- Nested skill flattening risk

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-005`.

---

## 1. OVERVIEW

This scenario is a live negative-risk check for skill flattening. It does not treat recursive filesystem discovery as proof that Pi's model-visible skill list preserves the repository's single-advisor-identity architecture.

### Why This Matters

Flattening every nested mode into an independent skill could create duplicate routes, bypass hub policy, and make the visible skill surface materially larger than the intended 12 hubs.

---

## 2. SCENARIO CONTRACT

- Objective: Determine whether nested mode files are independently surfaced by Pi.
- Real user request: `Tell me whether Pi sees every nested mode skill separately or keeps the repository's parent hubs as the visible identities.`
- Prompt: `Using the configured repository skill location, enumerate the exact skill names Pi makes available. Distinguish parent hubs from nested mode files and report any flattening.`
- Expected execution process: Use an isolated configured skills fixture -> start Pi with `--offline --approve` -> capture the model-visible enumeration -> compare names against the 12 hub inventory and nested files.
- Expected signals: The result explicitly identifies parent hubs and any nested mode entries; no conclusion is drawn from file counts alone.
- Desired user-visible outcome: A definitive flattening result or a named blocker.
- Pass/fail: SKIP with exact blocker `a live Pi session with provider credentials is absent on this machine`. PASS only when the live enumeration is captured and classifiable. FAIL if the captured result contradicts its own names or the configured fixture.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Do not edit the repository settings file.
2. Prepare a disposable project fixture with the same skills pointer and a small uniquely named nested skill.
3. Run the exact prompt under a temporary `PI_CODING_AGENT_DIR`.
4. Compare the returned names with the known parent and nested fixture names.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-005 | Nested skill flattening risk | Identify independent nested-mode skill exposure | `Using the configured repository skill location, enumerate the exact skill names Pi makes available. Distinguish parent hubs from nested mode files and report any flattening.` | `PI_CODING_AGENT_DIR=<tmp> pi --offline --approve -p "Using the configured repository skill location, enumerate the exact skill names Pi makes available. Distinguish parent hubs from nested mode files and report any flattening." </dev/null > /tmp/pi-005.txt 2>&1` -> inspect output text -> compare with the fixture inventory | A live name list is required; no current output can prove the flattening choice | No provider-backed enumeration was captured. The native-resource reference explicitly labels recursive discovery and resulting prompt content unconfirmed. | SKIP with blocker `provider credentials are absent on this machine`; never replace the missing model-visible list with a filesystem count. | Preserve the exact output, confirm the skills pointer was accepted, and rerun only after credentials are available. |

### Optional Supplemental Checks

- Run the same fixture with `--no-skills` to confirm the control path removes the discovery surface.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Credential and no-inference policy |
| `../../SKILL.md` | Resource loading levels and routing boundary |
| `../../references/native-skills-and-extensions.md` | Explicit unconfirmed flattening guidance |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/` | Parent and nested skill inventory |
| `.pi/settings.json` | Project-local settings inspected before a live fixture run |

---

## 5. SOURCE METADATA

- Group: Skill Discovery
- Playbook ID: PI-005
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `skill-discovery/nested-skill-flattening-risk.md`
