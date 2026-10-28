---
id: ci-surface-routing-floor
category: ci_surface
stage: negative
title: 'Prompts that share CI words do not route to the CI surface'
description: "This scenario validates the routing floor for `ci-surface-routing-floor`. It focuses on prompts that carry CI vocabulary without being CI requests, and confirms the compiled route defers or bundles another surface instead of selecting `sk-code-ci`."
version: 1.0.0.0
---

# Prompts that share CI words do not route to the CI surface

This document captures the run contract, execution process, source anchors and metadata for `ci-surface-routing-floor`.

---

## 1. OVERVIEW

This scenario validates the routing floor stated in the `MACHINE ROUTER` block of `SKILL.md`: every keyword in `INTENT_SIGNALS` is multi-word, so a bare `workflow` never scores this surface. It sends three prompts that share CI words without being CI requests, plus one positive control, through the same compiled route the hub serves.

### Why This Matters

A surface that scores on a single common word is worse than one that scores on nothing: it adds four rule references to a review about a documentation diagram, and the reviewer reads them as relevant. The floor is the only thing keeping the packet out of unrelated turns, and it is invisible without a prompt that tries to cross it: every positive routing scenario passes whether the floor exists or not.

---

## 2. SCENARIO CONTRACT

Operators send three near-miss prompts and one positive control through the compiled route and confirm which surface each one selects.

- Objective: confirm that a bare `workflow` prompt and a CI-vocabulary prompt defer, that a code-review prompt bundles a surface without `sk-code-ci`, and that the positive control still bundles `sk-code-ci` so the check is not vacuous.
- Real user request: `Check that asking about a workflow diagram does not drag the whole CI rule set into the answer.`
- Prompt: `Send these near-miss prompts through the router and tell me whether any of them pulls in the CI surface.`

**Exact prompt**:
```text
Send these near-miss prompts through the router and tell me whether any of them pulls in the CI surface.
```

- Fixture: none. The scenario reads the compiled route the hub serves for this repository and calls it with four prompts.
- Expected execution process: the operator runs one command, reads four JSON lines, and confirms the `ci` field is false for the three near misses and true for the control. Nothing is written.
- Expected signals: the first two lines report `action: defer` with no targets; the third reports a `surfaceBundle` of `sk-code-review` and `sk-code-skilled`; the control reports a `surfaceBundle` of `sk-code-review` and `sk-code-ci`.
- Desired user-visible outcome: the operator sees a documentation question stay unrouted and a code question route to the right surface, with the CI rule set arriving only for the CI request.
- Pass/fail: PASS if the three near-miss prompts select no `sk-code-ci` target and the control selects one. FAIL if any near-miss prompt selects `sk-code-ci`, or the control does not, because a control that fails makes the other three meaningless.
- Benchmark tier: `negative`. This scenario is filed as an out-of-domain case for the packet, and it declares no `expected_intent` or `expected_resources`, because what it asserts is a non-selection and the router-sync guard replays only scenarios that declare a selection.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Send these near-miss prompts through the router and tell me whether any of them pulls in the CI surface.`

### Commands

Run the command from the repository root.

1. Send the four prompts through the compiled route.

```bash
node -e '
const {compiledRoute}=require("./.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs");
const prompts=["rename the workflow file in the docs folder","The CI pipeline diagram in the handbook is out of date, redraw it","review my typescript module for jank","review the github actions workflow yaml"];
for (const p of prompts) { const r=compiledRoute("sk-code",p,{}); console.log(JSON.stringify({prompt:p,action:r.action,selectionKind:r.selectionKind,targets:r.targets.map(t=>t.workflowMode),ci:r.targets.some(t=>t.workflowMode==="sk-code-ci")})); }
'; echo "exit $?"
```

2. List every intent keyword that carries the word `workflow`.

```bash
sed -n '/^INTENT_SIGNALS = {/,/^}/p' .skilled/skills/sk-code/sk-code-ci/SKILL.md | grep -o '"[^"]*workflow[^"]*"'
```

### Expected

Step 1 prints four JSON lines, one per prompt:

```text
{"prompt":"rename the workflow file in the docs folder","action":"defer","selectionKind":null,"targets":[],"ci":false}
{"prompt":"The CI pipeline diagram in the handbook is out of date, redraw it","action":"defer","selectionKind":null,"targets":[],"ci":false}
{"prompt":"review my typescript module for jank","action":"route","selectionKind":"surfaceBundle","targets":["sk-code-review","sk-code-skilled"],"ci":false}
{"prompt":"review the github actions workflow yaml","action":"route","selectionKind":"surfaceBundle","targets":["sk-code-review","sk-code-ci"],"ci":true}
exit 0
```

Step 2 prints every keyword that carries the word `workflow`. None of them is the bare word, and each needs a second word beside it, which is why the first prompt's bare `workflow` scores nothing:

```text
"github actions workflow"
"ci workflow"
"workflow path filters"
"github workflow timeout"
"github workflow concurrency"
"github workflow permissions"
"required status check workflow"
".github/workflows/"
```

| Signal | Expected value |
| --- | --- |
| bare `workflow` prompt | `action: defer`, no targets, `ci: false` |
| CI-vocabulary prompt | `action: defer`, no targets, `ci: false` |
| code-review prompt | `surfaceBundle` of `sk-code-review` and `sk-code-skilled`, `ci: false` |
| positive control | `surfaceBundle` of `sk-code-review` and `sk-code-ci`, `ci: true` |
| intent keywords naming `workflow` | every one carries a second word |

### Evidence

Command transcript from steps 1 and 2 with the exit status, and the four JSON lines. The positive control is part of the evidence, not a convenience: three lines with `ci: false` also describe a router that selects nothing at all.

### Pass / Fail

- **Pass**: no near-miss prompt selects `sk-code-ci` and the control does.
- **Fail**: a near-miss prompt selects `sk-code-ci`, or the control does not, which means the run proves nothing about the other three.

### Failure Triage

1. If a near-miss prompt selects `sk-code-ci`, read the hub's alias list for the packet in `.skilled/skills/sk-code/mode-registry.json`: a single-word alias there scores the surface before `INTENT_SIGNALS` is consulted, and the floor is then a review finding against the registry rather than against this packet.
2. If every prompt defers, including the control, the compiled engine is not serving this hub. Run `node .skilled/bin/compiled-route-status.cjs --hub sk-code` and read the serving authority before treating the result as a floor.
3. If the second prompt defers today and later routes, the CI word was promoted to a keyword or an alias. Check which list gained it before changing this scenario, because the interesting answer is which list moved.
4. If step 2 prints a one-word `workflow` keyword, the floor is gone from this packet and either the keyword list or this scenario has to change.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| [two-axis-registry-driven-routing.md](../../../feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md) | Feature-catalog entry that records how the hub resolves the surface from registry vocabulary |
| [ci-surface.md](ci-surface.md) | The positive routing scenario this one is the control partner of |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) `MACHINE ROUTER` section | The multi-word `INTENT_SIGNALS` keywords the floor rests on |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | The compiled route engine behind step 1 |
| `.skilled/skills/sk-code/mode-registry.json` | The packet's alias list, which can score the surface before the intent signal is read |
| `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | The automated near-miss assertions this scenario's prompts mirror |

---

## 5. SOURCE METADATA

- Group: sk-code-ci CI surface
- Playbook ID: ci-surface-routing-floor
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `ci-surface/routing-floor.md`
