---
id: ci-surface-ci-standards
category: ci_surface
stage: routing
title: 'CI workflow standards routing'
description: "This scenario validates CI_WORKFLOW routing. It confirms a request to review a GitHub Actions workflow loads the four rule references, the rule index, the trigger and filter rules, the job shape rules and the protected set, instead of an unrelated resource set."
expected_intent: CI_WORKFLOW
expected_resources:
  - references/ci-workflow-standards.md
  - references/trigger-and-filter-rules.md
  - references/job-shape-rules.md
  - references/protected-set.md
version: 1.0.3.0
---

# CI workflow standards routing

This document captures the routing-recall contract, execution process, source anchors and metadata for the `sk-code-ci` scenario.

---

## 1. OVERVIEW

This scenario validates `CI_WORKFLOW` routing. It confirms that the exact prompt below classifies as `CI_WORKFLOW` and loads the four routed references instead of a generic or mismatched resource set. The intent signal and the resource map are read from the `MACHINE ROUTER` section at the end of [`ROUTER.md`](../../ROUTER.md); section 2b carries the prose that names the same four paths.

### Why This Matters

A workflow diff that reaches the hub with no CI surface reviews as an unknown surface and loads none of the repository's workflow rules. The four references carry the rule index, the trigger and filter rules, the job shape rules and the protected set, so a request routed elsewhere risks approving a change that breaks a rule or weakens a protected workflow.

### What This Scenario Does Not Claim

This is an operator scenario. It declares the intent and the packet-relative resource paths, and it deliberately declares no typed routing-gold fields, because the compiled-routing shape belongs to the hub's own scenarios under the sk-code playbook's `compiled-routing/` category, which resolves typed leaf pairs against the hub's `leaf-manifest.json`. This packet has no leaf manifest of its own, so a typed pair here would be checked by no gate and would only move the file out of the operator contract. The route claim is therefore checked here by commands 6 to 9.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt classifies as `CI_WORKFLOW` and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `CI_WORKFLOW` and every path in `expected_resources`, that each routed file is the one the route names, and that the hub integrations naming the same four paths agree with the packet's map.
- Real user request: `review the github actions workflow yaml`
- Prompt: `review the github actions workflow yaml`

**Exact prompt**:
```text
review the github actions workflow yaml
```

- Expected execution process: the hub resolves the prompt to the `surfaceBundle` `[sk-code-review, sk-code-ci]`, the `CI_WORKFLOW` keywords in `INTENT_SIGNALS` match the prompt and every path this scenario lists under `expected_resources` resolves under the packet root.
- Expected signals: every path in `expected_resources` exists under `sk-code-ci/` and prints the title its filename claims; the hub's `quality.checklists` row for `.github/workflows/**` resolves to the rule index; `ROUTER.md` carries the four paths with the `sk-code-ci/` prefix and `hub-router.json` registers the packet.
- Desired user-visible outcome: the bundled workflow cites the routed rule references as the evidence for the review.
- Pass/fail: PASS if every listed path exists, prints its own title, and every integration surface below names the same four paths for `CI_WORKFLOW`. FAIL if any listed path is missing, a title disagrees with its file, the frontmatter intent disagrees with `CI_WORKFLOW`, or an integration surface names a different set.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `review the github actions workflow yaml`

### Commands

1. `awk 'NR==1 && /^---$/{print; next} /^---$/{print; exit} {print}' .skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/ci-surface/ci-surface.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .skilled/skills/sk-code/sk-code-ci/ROUTER.md | grep -F '"CI_WORKFLOW"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .skilled/skills/sk-code/sk-code-ci/ROUTER.md`
4. `for p in references/ci-workflow-standards.md references/trigger-and-filter-rules.md references/job-shape-rules.md references/protected-set.md; do test -e ".skilled/skills/sk-code/sk-code-ci/$p" && echo "OK $p" || echo "MISS $p"; done`
5. `for p in references/ci-workflow-standards.md references/trigger-and-filter-rules.md references/job-shape-rules.md references/protected-set.md; do grep -m1 '^title:' ".skilled/skills/sk-code/sk-code-ci/$p"; done`
6. `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 4 | grep -c 'sk-code-ci/'; echo "exit $?"; node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 4 | grep -c 'router-sync:'; echo "exit $?"`
7. `node -e 'const {compiledRoute}=require("./.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs"); const r=compiledRoute("sk-code","review the github actions workflow yaml",{}); console.log(r.selectionKind, r.targets.map(t=>t.workflowMode).join(", "))'`
8. `node -e 'const fs=require("fs"),path=require("path");const root=".skilled/skills/sk-code";const reg=require("./"+root+"/mode-registry.json");for(const m of reg.modes||[])for(const row of (m.quality&&m.quality.checklists)||[]){if(!(row.paths||[]).includes(".github/workflows/**"))continue;const file=path.join(root,row.file);console.log("checklist "+row.paths.join(",")+" -> "+row.file+" exists "+fs.existsSync(file));}'`
9. `grep -o 'sk-code-ci/references/[a-z-]*\.md' .skilled/skills/sk-code/ROUTER.md | sort -u; grep -A4 '"sk-code-ci": {' .skilled/skills/sk-code/hub-router.json`

### Expected

Step 1 prints the frontmatter block alone, from the opening fence to the closing fence, with `expected_intent: CI_WORKFLOW` and the four `expected_resources`. Step 2 prints the keyword list this prompt matches. Step 3 prints the `RESOURCE_MAP` array this scenario's list mirrors. Step 4 prints `OK` for every path. Step 5 prints:

```text
title: CI Workflow Standards - Rule Index
title: Trigger and Filter Rules
title: Job Shape Rules
title: Repository CI Profile and Protected Workflows
```

Step 6 runs the guard's check 4 twice and counts what it printed. The leg is fleet-wide: it walks every packet-level playbook under the hub, so the count that matters here is the one for this packet's own lines, `0`, together with the `1` that proves the leg ran and printed its summary. A non-zero first count names the `sk-code-ci` scenario the guard rejects, and a red fleet total with a zero first count belongs to another packet and is recorded in triage rather than failing this scenario:

```text
0
exit 1
1
exit 0
```

Step 7 prints `surfaceBundle sk-code-review, sk-code-ci`. Step 8 prints one line, `checklist .github/workflows/** -> sk-code-ci/references/ci-workflow-standards.md exists true`. Step 9 prints the four prefixed paths in sorted order, then the `hub-router.json` entry with `"resources": ["sk-code-ci/SKILL.md"]`:

```text
sk-code-ci/references/ci-workflow-standards.md
sk-code-ci/references/job-shape-rules.md
sk-code-ci/references/protected-set.md
sk-code-ci/references/trigger-and-filter-rules.md
    "sk-code-ci": {
      "weight": 4,
      "classes": ["code-ci-aliases", "code-ci-runtime"],
      "resources": ["sk-code-ci/SKILL.md"]
    }
```

| Signal | Expected value |
| --- | --- |
| frontmatter intent | `CI_WORKFLOW` |
| expected resource paths present | 4 of 4 print `OK` |
| reference titles | the four titles above, one per file |
| router-sync check 4, lines for this packet | `0`, so the guard rejected no `sk-code-ci` scenario |
| router-sync check 4, summary line | `1`, so the leg ran |
| compiled route for the prompt | `surfaceBundle sk-code-review, sk-code-ci` |
| quality checklist row | `.github/workflows/**` resolves to the rule index, `exists true` |
| `ROUTER.md` prefixed paths | the same four paths, sorted |
| `hub-router.json` entry | `sk-code-ci` with `resources: ["sk-code-ci/SKILL.md"]` |

### Evidence

Command transcript from steps 1 to 9, the resolved frontmatter block, the guard's two counts, the compiled-route line, the checklist line and the two registration lines.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, prints the title its filename claims, the router emits it, and the checklist row, `ROUTER.md` and `hub-router.json` name the same four paths.
- **Fail**: any listed path is missing, a title disagrees with its file, the router does not emit one, or an integration surface names a different set.

### Failure Triage

1. Re-run step 4 for the path that failed and confirm whether it was renamed or removed under `references/`.
2. Diff this scenario's `expected_resources` against the step 3 map to see whether the drift is a stale scenario or a stale `ROUTER.md` map.
3. If step 5 prints a title that does not match its file, the rules moved between references. Re-read the reference and correct this scenario's expectation rather than the file.
4. If step 9 disagrees with step 3, the hub registration drifted from the packet. Correct the hub file, because the packet's map is the source the guard reads.
5. If step 6's first count is not `0`, the guard printed a problem for a `sk-code-ci` scenario. Read that line: it names the scenario and the resource the router does not emit. A `router-sync:` total below `1/1` whose problem lines all name another packet is that packet's finding, not this scenario's.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| [two-axis-registry-driven-routing.md](../../../feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md) | Feature-catalog entry that records the surface bundling and the advisor-invisible `sk-code-ci` surface this scenario routes |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [ROUTER.md](../../ROUTER.md) `MACHINE ROUTER` section | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) section 2b | The prose map that names the same four paths |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | The guard's check 4 behind step 6: every routing scenario's expected resource is emitted |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | The compiled route engine behind step 7 |
| `.skilled/skills/sk-code/mode-registry.json` | The `quality.checklists` row behind step 8 |
| `.skilled/skills/sk-code/ROUTER.md` | The hub's `CI_WORKFLOW` resource map behind step 9 |
| `.skilled/skills/sk-code/hub-router.json` | The hub registration behind step 9 |

---

## 5. SOURCE METADATA

- Group: sk-code-ci routing
- Playbook ID: ci-surface-ci-standards
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `ci-surface/ci-surface.md`
