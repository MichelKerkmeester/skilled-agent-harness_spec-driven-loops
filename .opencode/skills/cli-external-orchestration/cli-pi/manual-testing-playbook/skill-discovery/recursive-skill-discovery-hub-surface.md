---
title: "PI-004 -- Recursive skill discovery and hub surface"
description: "This scenario checks the configured `.pi/settings.json` skills pointer and the documented recursive `SKILL.md` discovery shape for `PI-004`, without claiming a provider-gated live hub count."
version: 1.0.0.0
---

# PI-004 -- Recursive skill discovery and hub surface

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-004`.

---

## 1. OVERVIEW

This scenario verifies whether Pi receives `.opencode/skills/` as a configured skill location and whether a successful session exposes the expected 12 hub-level identities.

### Why This Matters

The repository's advisor architecture depends on hub-level identity. A recursive pointer can be valid syntax while still producing an unsafe or noisy discovery surface, so configuration acceptance and live enumeration must remain separate claims.

---

## 2. SCENARIO CONTRACT

- Objective: Inspect the skills setting, count the 12 hub-level `SKILL.md` files, and live-check Pi's discovered surface when the configured pointer and credentials are available.
- Real user request: `Check whether Pi is pointed at this repository's .opencode/skills directory and whether the expected hub skills are discoverable without flattening every nested mode.`
- Prompt: `List the Pi skills discovered from the configured .opencode/skills location, one per line, and report whether nested SKILL.md files appear as independent skills. Do not infer the answer from the filesystem alone.`
- Expected execution process: Read `.pi/settings.json` -> count hub-level files -> if the `skills` array is configured, run an isolated approved Pi session -> capture the discovered list and output text.
- Expected signals: The configured shape is `"skills": [".opencode/skills/"]`; filesystem inspection returns 12 hub-level `SKILL.md` files; a live session either reports the surface or reaches the provider gate.
- Desired user-visible outcome: A clear distinction between filesystem inventory, configuration presence, and live Pi discovery behavior.
- Pass/fail: PASS for a live, credential-backed hub enumeration matching the configured shape. SKIP with blockers `the current settings file has no skills array` and `provider credentials are absent on this machine`; FAIL if Pi accepts the configured pointer but reports a contradictory or malformed resource result.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read `.pi/settings.json` without editing it.
2. Count hub-level and total `SKILL.md` files separately.
3. Confirm whether the required `skills` array is present.
4. Only with that array and provider credentials, run the isolated live discovery prompt.
5. Record the live count and names; never substitute the filesystem count for Pi's model-visible result.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-004 | Recursive skill discovery and hub surface | Verify configured skills pointer and live hub enumeration | `List the Pi skills discovered from the configured .opencode/skills location, one per line, and report whether nested SKILL.md files appear as independent skills. Do not infer the answer from the filesystem alone.` | `jq -c '.skills // null' .pi/settings.json` -> `find .opencode/skills -maxdepth 2 -name SKILL.md -type f | wc -l` -> `find .opencode/skills -name SKILL.md -type f | wc -l` -> if configured, `PI_CODING_AGENT_DIR=<tmp> pi --offline --approve -p "List the Pi skills discovered from the configured .opencode/skills location, one per line, and report whether nested SKILL.md files appear as independent skills." </dev/null` | Current output is `skills=null`, hub count `12`, total count `50`; no live hub count without a configured pointer and provider credentials | Captured output: `skills=null`; `hub_count=      12`; `all_skill_count=      50`. The current project settings contain only the package array. | SKIP because the required skills pointer is absent and provider credentials are absent. PASS only after a live session reports the hub surface from the configured pointer. | Do not add the skills pointer in this playbook. Supply it in a separately approved fixture, then repeat the isolated probe with credentials. |

### Optional Supplemental Checks

- Compare a whole-tree pointer with an explicitly enumerated hub-path fixture in a disposable project and record the difference.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Credential and discovery evidence rules |
| `../../SKILL.md` | Native-resource routing and progressive loading boundary |
| `../../references/native-skills-and-extensions.md` | Recursive discovery guidance marked documented but unconfirmed |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/settings.json` | Current project package state and absence of a skills key |
| `.opencode/skills/` | Hub and nested `SKILL.md` inventory |

---

## 5. SOURCE METADATA

- Group: Skill Discovery
- Playbook ID: PI-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `skill-discovery/recursive-skill-discovery-hub-surface.md`
