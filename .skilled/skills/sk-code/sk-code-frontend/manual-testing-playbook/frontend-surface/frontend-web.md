---
id: frontend-surface-web
category: frontend_surface
stage: routing
title: 'Web markup and CSS routing'
description: "This scenario validates FRONTEND_WEB routing. It confirms a request to review semantic HTML markup loads the cross-stack core and the web stack layer, rather than a Figma or generic resource set."
expected_intent: FRONTEND_WEB
expected_resources:
  - references/frontend-practice.md
  - references/web-markup-and-css.md
version: 1.0.1.0
---

# Web markup and CSS routing

This document captures the routing-recall contract, execution process, source anchors and metadata for the `sk-code-frontend` scenario.

---

## 1. OVERVIEW

This scenario validates `FRONTEND_WEB` routing. It confirms that the exact prompt below classifies as `FRONTEND_WEB` and loads the cross-stack core and the web stack layer instead of a Figma or generic resource set. The intent signal and the resource map are read from the `MACHINE ROUTER` section at the end of [`ROUTER.md`](../../ROUTER.md); section 2 of the same router and the reference map in [`SKILL.md`](../../SKILL.md) name the same paths in prose.

### Why This Matters

A web change that reaches the hub with no frontend surface loads none of the repository's markup, form, layout or accessibility rules. The web layer carries the element choice, the form and label rules, the layout, responsive and media rules, and the CSS architecture a review applies. A request routed nowhere would leave the review to memory.

### What This Scenario Does Not Claim

This is an operator scenario. It declares the intent and the packet-relative resource paths, and it deliberately declares no typed routing-gold fields, because the compiled-routing shape belongs to the hub's own scenarios under the sk-code playbook's `compiled-routing/` category, which resolves typed leaf pairs against the hub's `leaf-manifest.json`. This packet has no leaf manifest of its own, so a typed pair here would be checked by no gate and would only move the file out of the operator contract. The route claim is therefore checked here by commands 6 and 7.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt classifies as `FRONTEND_WEB` and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `FRONTEND_WEB` and every path in `expected_resources`, and that each routed file is the one the intent model names.
- Real user request: `Review this semantic HTML markup for a settings page. The save control is a div with a click handler and the inputs have no labels.`
- Prompt: `Review this semantic HTML markup for a settings page. The save control is a div with a click handler and the inputs have no labels.`

**Exact prompt**:
```text
Review this semantic HTML markup for a settings page. The save control is a div with a click handler and the inputs have no labels.
```

- Expected execution process: the packet router matches `semantic html markup` in `INTENT_SIGNALS`, selects `FRONTEND_WEB`, and assembles the two paths this scenario lists under `expected_resources`.
- Expected signals: the replay prints `FRONTEND_WEB` as the only intent and both paths in its resource list; every path exists under the packet root and prints the title its filename claims; `ROUTER.md` carries the same two paths under `FRONTEND_WEB`.
- Desired user-visible outcome: the answer cites the core and the web layer as the evidence for the markup review, and names the div acting as a control and the missing input labels as findings.
- Pass/fail: PASS if every listed path exists, prints its own title, the replay selects `FRONTEND_WEB` alone and emits exactly these two paths. FAIL if a path is missing, a title disagrees with its file, the frontmatter intent disagrees with `FRONTEND_WEB`, or the replay emits a path outside the set.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this semantic HTML markup for a settings page. The save control is a div with a click handler and the inputs have no labels.`

### Commands

1. `awk 'NR==1 && /^---$/{print; next} /^---$/{print; exit} {print}' .skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/frontend-surface/frontend-web.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md | grep -F '"FRONTEND_WEB"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md | sed -n '/"FRONTEND_WEB": \[/,/\]/p'`
4. `for p in references/frontend-practice.md references/web-markup-and-css.md; do test -e ".skilled/skills/sk-code/sk-code-frontend/$p" && echo "OK $p" || echo "MISS $p"; done`
5. `for p in references/frontend-practice.md references/web-markup-and-css.md; do grep -m1 '^title:' ".skilled/skills/sk-code/sk-code-frontend/$p"; done`
6. `node -e 'const lib=require("./.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs"); const r=lib.routeSkillResources({skillRoot:".skilled/skills/sk-code/sk-code-frontend", taskText:"Review this semantic HTML markup for a settings page. The save control is a div with a click handler and the inputs have no labels."}); console.log("intents " + r.intents.join(",")); console.log("resources " + r.resources.join(","));'`
7. `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 4 | grep -c 'sk-code-frontend/'; echo "exit $?"; node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 4 | grep -c 'router-sync:'; echo "exit $?"`

### Expected

Step 1 prints the frontmatter block alone, from the opening fence to the closing fence, with `expected_intent: FRONTEND_WEB` and the two `expected_resources`. Step 2 prints the keyword list this prompt matches. Step 3 prints the `RESOURCE_MAP` entry this scenario's list mirrors. Step 4 prints `OK` for every path. Step 5 prints:

```text
title: Frontend Practice
title: Web Markup and CSS Practice
```

Step 6 prints the selected intent and the assembled resources, with no other intent and no extra path:

```text
intents FRONTEND_WEB
resources references/frontend-practice.md,references/web-markup-and-css.md
```

Step 7 runs the guard's check 4 twice and counts what it printed. The leg is fleet-wide: it walks every packet-level playbook under the hub, so the count that matters here is the one for this packet's own lines, `0`, together with the `1` that proves the leg ran and printed its summary. A non-zero first count names the `sk-code-frontend` scenario the guard rejects, and a red fleet total with a zero first count belongs to another packet and is recorded in triage rather than failing this scenario:

```text
0
exit 1
1
exit 0
```

| Signal | Expected value |
| --- | --- |
| frontmatter intent | `FRONTEND_WEB` |
| expected resource paths present | 2 of 2 print `OK` |
| reference titles | `Frontend Practice`, then `Web Markup and CSS Practice` |
| replayed intent set | `FRONTEND_WEB`, alone |
| replayed resource list | the same two paths, in map order |
| router-sync check 4, lines for this packet | `0`, so the guard rejected no `sk-code-frontend` scenario |
| router-sync check 4, summary line | `1`, so the leg ran |
| `INTENT_SIGNALS` row | `"FRONTEND_WEB"` with `"semantic html markup"` |
| `RESOURCE_MAP` entry | the same two paths, in the order step 3 prints |

### Evidence

Command transcript from steps 1 to 7, the resolved frontmatter block, the two printed titles, the replay lines and the guard's two counts.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, prints the title its filename claims, the replay selects `FRONTEND_WEB` alone, and the emitted resources are exactly the declared two.
- **Fail**: any listed path is missing, a title disagrees with its file, the replay selects another intent or a second intent, or it emits a path outside the set.

### Failure Triage

1. Re-run step 4 for the path that failed and confirm whether it was renamed or removed under `references/`.
2. Diff this scenario's `expected_resources` against the step 3 map to see whether the drift is a stale scenario or a stale `ROUTER.md` map.
3. If step 5 prints a title that does not match its file, the rules moved between references. Re-read the reference and correct this scenario's expectation rather than the file.
4. If step 6 selects a second intent, read the step 2 keyword list for the extra intent. A prompt that carries two families of keywords is a scenario defect, because the surface scores every intent that matches.
5. If step 7's first count is not `0`, the guard printed a problem for a `sk-code-frontend` scenario. Read that line: it names the scenario and the resource the router does not emit. A `router-sync:` total below `5/5` whose problem lines all name another packet is that packet's finding, not this scenario's.

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
| [references/frontend-practice.md](../../references/frontend-practice.md) | The cross-stack core the web layer extends |
| [references/web-markup-and-css.md](../../references/web-markup-and-css.md) | The web stack layer this intent adds |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | The guard's check 4 behind step 7: every routing scenario's expected resource is emitted |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` | The router replay behind step 6 |

---

## 5. SOURCE METADATA

- Group: Frontend Surface
- Playbook ID: frontend-surface-web
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `frontend-surface/frontend-web.md`
