---
id: OC-011
category: routing_tier
title: 'Shared default tier routing'
description: "This scenario validates the always-load shared tier for `OC-011`. It confirms the six-path `DEFAULT_RESOURCE` set, including `workflow-guardrails.md`, resolves under the skill root and joins the resources a routed intent emits, instead of a route that carries only its intent-specific leaves."
expected_surface: SKILLED
expected_intent: IMPLEMENTATION
expected_resources:
  - references/shared/universal-patterns/naming-and-commenting.md
  - references/shared/universal-patterns/organization-security-and-examples.md
  - references/shared/code-organization/overview-and-module-organization.md
  - references/shared/code-organization/imports-and-exports.md
  - references/shared/code-organization/directory-and-test-conventions.md
  - references/shared/workflow-guardrails.md
version: 1.0.2.0
---

# OC-011: Shared default tier routing

This document captures the always-load tier contract, execution process, source anchors, and metadata for
`OC-011`.

---

## 1. OVERVIEW

This scenario validates the always-load shared tier for `OC-011`. It focuses on confirming that the six
`DEFAULT_RESOURCE` paths resolve under the skill root and are emitted alongside a routed intent, per
`ROUTER.md` §3's machine-readable router, instead of a route that carries only its intent-specific leaves.

Every other routing scenario in this playbook asserts an intent-specific resource set. None of them
asserts the tier that `SKILL.md` §2b says a route loads first, and the replay library seeds a route with
`DEFAULT_RESOURCE` before it adds any intent's paths, so the tier is present on every route the packet
serves and can regress without any language scenario noticing.

### Why This Matters

`references/shared/workflow-guardrails.md` carries the implementation guardrails, the verification command
chain and the runtime build traps that every route builds on. If `DEFAULT_RESOURCE` loses a path, or the
replay stops seeding the tier, a routed task would silently lose the guardrail contract while each
language scenario still passed on its own leaf set.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OC-011` resolves the six-path default tier in addition to the
intent it selects, without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `SKILLED`, selects an intent, and emits every path
  in `expected_resources` ahead of that intent's own leaves.
- Real user request: `Implement a small helper inside a .skilled skill and tell me which shared references you load.`
- Prompt: `Implement a small helper inside a .skilled skill and tell me which shared references you load.`

**Exact prompt**:
```text
Implement a small helper inside a .skilled skill and tell me which shared references you load.
```

- Expected execution process: the hub detects `SKILLED` (work under `.skilled/`), the `IMPLEMENTATION`
  `INTENT_SIGNALS` keywords match the prompt, the replay seeds the route with `DEFAULT_RESOURCE`, and every
  path this scenario lists under `expected_resources` resolves under the skill root.
- Expected signals: step 2 lists six paths, step 3 prints `OK` six times, and step 4 prints
  `intents=IMPLEMENTATION` followed by all six default-tier paths.
- Desired user-visible outcome: the bundled workflow loads the shared guardrails tier before the
  intent-specific checklists, rather than answering from the checklists alone.
- Pass/fail: PASS if all six listed paths exist and all six appear in the replay output; FAIL if any listed
  path is missing from step 3 or from step 4's emitted list.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Implement a small helper inside a .skilled skill and tell me which shared references you load.`

### Commands

1. `sed -n '/^---$/,/^---$/p' .skilled/skills/sk-code/sk-code-skilled/manual-testing-playbook/routing-tier/shared-default-tier.md`
2. `sed -n '/^DEFAULT_RESOURCE = \[/,/^\]/p' .skilled/skills/sk-code/sk-code-skilled/ROUTER.md`
3. `for p in references/shared/universal-patterns/naming-and-commenting.md references/shared/universal-patterns/organization-security-and-examples.md references/shared/code-organization/overview-and-module-organization.md references/shared/code-organization/imports-and-exports.md references/shared/code-organization/directory-and-test-conventions.md references/shared/workflow-guardrails.md; do test -e ".skilled/skills/sk-code/sk-code-skilled/$p" && echo "OK $p" || echo "MISS $p"; done`
4. `node -e "const l=require('./.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs');const r=l.routeSkillResources({skillRoot:'.skilled/skills/sk-code/sk-code-skilled',taskText:'Implement a small helper inside a .skilled skill and tell me which shared references you load.'});console.log('intents='+r.intents.join(','));r.resources.forEach((p)=>console.log(p));"`

### Expected

Step 1 shows `expected_intent: IMPLEMENTATION` and the six-path `expected_resources` list in the
frontmatter. Step 2 shows the same six paths in `ROUTER.md`'s `DEFAULT_RESOURCE` block. Step 3 prints `OK`
for every path. Step 4 prints `intents=IMPLEMENTATION` and then the emitted list, whose first six entries
are the default-tier paths in `DEFAULT_RESOURCE` order, followed by the four `IMPLEMENTATION` authoring
checklists.

### Evidence

Command transcript from steps 1-4 with the replay output; the resolved frontmatter block; the
`DEFAULT_RESOURCE` excerpt; the emitted resource list from step 4.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, the replay selects at least one intent, and every one
  of the six default-tier paths appears in step 4's emitted list.
- **Fail**: a default-tier path is missing from disk or from the emitted list, or the replay selects no
  intent at all.

### Failure Triage

1. If step 4 omits a default-tier path, compare step 2's block with the six listed paths and confirm
   whether `ROUTER.md`'s `DEFAULT_RESOURCE` changed or the replay library stopped seeding the tier.
2. If step 3 prints `MISS`, re-run step 3 for that path and confirm whether it was renamed under
   `references/shared/`.
3. If step 4 selects no intent, grep the `INTENT_SIGNALS` block for the word this prompt relies on and
   confirm that keyword still belongs to `IMPLEMENTATION`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [ROUTER.md](../../ROUTER.md) §3 | `DEFAULT_RESOURCE` block and the intent maps this scenario exercises |
| [SKILL.md](../../SKILL.md) §2b | The prose claim that every route loads the shared tier first |
| [router-replay-lib.cjs](../../assets/scripts/router-replay-lib.cjs) | Replay that seeds a route with `DEFAULT_RESOURCE` |

---

## 5. SOURCE METADATA

- Group: sk-code-skilled routing
- Playbook ID: OC-011
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `routing-tier/shared-default-tier.md`
