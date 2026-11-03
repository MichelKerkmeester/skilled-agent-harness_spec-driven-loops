---
id: frontend-surface-figma-check
category: frontend_surface
stage: routing
title: 'Figma frame check routing'
description: "This scenario validates FIGMA_TO_CODE routing. It confirms a request to run the Figma frame check loads the five-pass check and the cross-stack core, and that a check with any pass not run ends INCOMPLETE rather than PASS."
expected_intent: FIGMA_TO_CODE
expected_resources:
  - references/figma-to-code.md
  - references/frontend-practice.md
version: 1.0.1.0
---

# Figma frame check routing

This document captures the routing-recall contract, execution process, source anchors and metadata for the `sk-code-frontend` scenario.

---

## 1. OVERVIEW

This scenario validates `FIGMA_TO_CODE` routing. It confirms that the exact prompt below classifies as `FIGMA_TO_CODE` and loads the five-pass check and the cross-stack core instead of a web or generic resource set. The intent signal and the resource map are read from the `MACHINE ROUTER` section at the end of [`ROUTER.md`](../../ROUTER.md); section 2 of the same router and the reference map in [`SKILL.md`](../../SKILL.md) name the same paths in prose.

### Why This Matters

A Figma comparison run without the check is an opinion about a screenshot. [`references/figma-to-code.md`](../../references/figma-to-code.md) names the read-only inputs, the five passes, the evidence each pass reads and the conditions that fail it. It also fixes the verdict rule this scenario grades: the overall result is `PASS` only when every pass passes, a pass that cannot run is recorded as `NOT RUN` with its reason, and the overall verdict is then `INCOMPLETE`, never `PASS`. A run that reports `PASS` over an unrun pass claims evidence it does not have.

### What This Scenario Does Not Claim

This is an operator scenario. It declares the intent and the packet-relative resource paths, and it deliberately declares no typed routing-gold fields, because the compiled-routing shape belongs to the hub's own scenarios under the sk-code playbook's `compiled-routing/` category, which resolves typed leaf pairs against the hub's `leaf-manifest.json`. This packet has no leaf manifest of its own, so a typed pair here would be checked by no gate and would only move the file out of the operator contract. The route claim and the verdict rule are therefore checked here by commands 6 to 8.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt classifies as `FIGMA_TO_CODE`, resolves the declared resource set, and answers with the check's own verdict rule.

- Objective: confirm the exact prompt routes to intent `FIGMA_TO_CODE` and every path in `expected_resources`, and that the answer records a pass that could not run as `NOT RUN` and ends the Figma check `INCOMPLETE`.
- Real user request: `Run the Figma frame check on the pricing page build and report which passes cannot run.`
- Prompt: `Run the Figma frame check on the pricing page build and report which passes cannot run.`

**Exact prompt**:
```text
Run the Figma frame check on the pricing page build and report which passes cannot run.
```

- Expected execution process: the packet router matches `figma frame check` in `INTENT_SIGNALS`, selects `FIGMA_TO_CODE`, and assembles the two paths this scenario lists under `expected_resources`. The answer then walks the five passes, names the evidence each one needs, and applies the verdict rule in the check reference.
- Expected signals: the replay prints `FIGMA_TO_CODE` as the only intent and both paths in its resource list; every path exists under the packet root and prints the title its filename claims; the check reference still states the `INCOMPLETE` rule; the answer reports any pass it could not run as `NOT RUN` with its reason and never gives the overall Figma verdict as `PASS`.
- Desired user-visible outcome: the answer lists the five passes, says which one could not run and why, and ends the Figma check `INCOMPLETE` when any pass did not run. It cites the check reference and the core as its evidence, and it does not treat the frame as the code structure.
- Pass/fail: PASS if every listed path exists, prints its own title, the replay selects `FIGMA_TO_CODE` alone and emits exactly these two paths, and the answer ends the Figma check `INCOMPLETE` whenever a pass did not run. FAIL if a path is missing, a title disagrees with its file, the replay selects another intent, or the answer reports the Figma check `PASS` while any pass is `NOT RUN`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the Figma frame check on the pricing page build and report which passes cannot run.`

### Commands

1. `awk 'NR==1 && /^---$/{print; next} /^---$/{print; exit} {print}' .skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/frontend-surface/figma-check.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md | grep -F '"FIGMA_TO_CODE"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md | sed -n '/"FIGMA_TO_CODE": \[/,/\]/p'`
4. `for p in references/figma-to-code.md references/frontend-practice.md; do test -e ".skilled/skills/sk-code/sk-code-frontend/$p" && echo "OK $p" || echo "MISS $p"; done`
5. `for p in references/figma-to-code.md references/frontend-practice.md; do grep -m1 '^title:' ".skilled/skills/sk-code/sk-code-frontend/$p"; done`
6. `node -e 'const lib=require("./.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs"); const r=lib.routeSkillResources({skillRoot:".skilled/skills/sk-code/sk-code-frontend", taskText:"Run the Figma frame check on the pricing page build and report which passes cannot run."}); console.log("intents " + r.intents.join(",")); console.log("resources " + r.resources.join(","));'`
7. `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 4 | grep -c 'sk-code-frontend/'; echo "exit $?"; node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 4 | grep -c 'router-sync:'; echo "exit $?"`
8. `grep -c 'overall verdict is then .INCOMPLETE., never .PASS.' .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md`

### Expected

Step 1 prints the frontmatter block alone, from the opening fence to the closing fence, with `expected_intent: FIGMA_TO_CODE` and the two `expected_resources`. Step 2 prints the keyword list this prompt matches. Step 3 prints the `RESOURCE_MAP` entry this scenario's list mirrors. Step 4 prints `OK` for every path. Step 5 prints:

```text
title: Figma to Code Translation
title: Frontend Practice
```

Step 6 prints the selected intent and the assembled resources. The assembly prints the core first and the intent's Figma reference after it, which is the same two paths the map declares, in the reverse order:

```text
intents FIGMA_TO_CODE
resources references/frontend-practice.md,references/figma-to-code.md
```

Step 7 runs the guard's check 4 twice and counts what it printed. The leg is fleet-wide: it walks every packet-level playbook under the hub, so the count that matters here is the one for this packet's own lines, `0`, together with the `1` that proves the leg ran and printed its summary. A non-zero first count names the `sk-code-frontend` scenario the guard rejects, and a red fleet total with a zero first count belongs to another packet and is recorded in triage rather than failing this scenario:

```text
0
exit 1
1
exit 0
```

Step 8 prints `1`, which proves the check reference still states the overall verdict rule this scenario grades.

| Signal | Expected value |
| --- | --- |
| frontmatter intent | `FIGMA_TO_CODE` |
| expected resource paths present | 2 of 2 print `OK` |
| reference titles | `Figma to Code Translation`, then `Frontend Practice` |
| replayed intent set | `FIGMA_TO_CODE`, alone |
| replayed resource list | the same two paths, core first and the Figma reference second |
| router-sync check 4, lines for this packet | `0`, so the guard rejected no `sk-code-frontend` scenario |
| router-sync check 4, summary line | `1`, so the leg ran |
| `INTENT_SIGNALS` row | `"FIGMA_TO_CODE"` with `"figma frame check"` among its keywords |
| `RESOURCE_MAP` entry | the same two paths, in the order step 3 prints |
| check verdict rule present | step 8 prints `1` |
| answer verdict when a pass did not run | `INCOMPLETE`, with the pass recorded `NOT RUN` and its reason |

### Evidence

Command transcript from steps 1 to 8, the resolved frontmatter block, the two printed titles, the replay lines, the guard's two counts, and the answer's pass table with its overall Figma verdict.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, prints the title its filename claims, the replay selects `FIGMA_TO_CODE` alone, the emitted resources are exactly the declared two, and the answer ends the Figma check `INCOMPLETE` whenever a pass did not run.
- **Fail**: any listed path is missing, a title disagrees with its file, the replay selects another intent or a second intent, a pass that did not run is recorded as passed, or the answer gives the Figma check as `PASS` while any pass is `NOT RUN`.

### Failure Triage

1. Re-run step 4 for the path that failed and confirm whether it was renamed or removed under `references/`.
2. Diff this scenario's `expected_resources` against the step 3 map to see whether the drift is a stale scenario or a stale `ROUTER.md` map.
3. If step 5 prints a title that does not match its file, the rules moved between references. Re-read the reference and correct this scenario's expectation rather than the file.
4. If step 8 prints `0`, the verdict rule moved or was reworded. Re-read the check reference and correct this scenario's expectation and command, because that rule is the behaviour this scenario grades.
5. If step 7's first count is not `0`, the guard printed a problem for a `sk-code-frontend` scenario. Read that line: it names the scenario and the resource the router does not emit. A `router-sync:` total below `5/5` whose problem lines all name another packet is that packet's finding, not this scenario's.
6. If the answer reports `PASS` while a pass is `NOT RUN`, that is the failure this scenario exists to catch. Re-read the verdict rule in the check reference and record the answer's own verdict as the evidence.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| [two-axis-registry-driven-routing.md](../../../feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md) | Feature-catalog entry that records the surface axis and the advisor-invisible `sk-code-frontend` surface this scenario routes |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [ROUTER.md](../../ROUTER.md) `MACHINE ROUTER` section | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) section 2 | The prose reference map that names the same two paths |
| [references/figma-to-code.md](../../references/figma-to-code.md) | The five-pass check, its read-only inputs, its verdict rule and its red flags |
| [references/frontend-practice.md](../../references/frontend-practice.md) | The cross-stack core that carries the Figma boundary |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | The guard's check 4 behind step 7: every routing scenario's expected resource is emitted |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` | The router replay behind step 6 |

---

## 5. SOURCE METADATA

- Group: Frontend Surface
- Playbook ID: frontend-surface-figma-check
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `frontend-surface/figma-check.md`
