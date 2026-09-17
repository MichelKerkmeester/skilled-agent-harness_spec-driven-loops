---
id: PR-020
category: surface_detection
title: 'Negative control: non-PI_REMOTE path does not bundle this packet'
description: "This scenario validates a negative control for `PR-020`. It focuses on confirming a task whose target files sit outside app-mobile/, app-relay/, and packages/pi-rpc-protocol/ does NOT resolve PI_REMOTE and does not load any sk-code-mobile-cli resource."
expected_surface: NONE
expected_intent: NONE
expected_resources: []
version: 1.0.0.0
---

# PR-020: Negative control: non-PI_REMOTE path does not bundle this packet

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-020`.

---

## 1. OVERVIEW

This scenario validates a negative control for `PR-020`. It focuses on confirming that a task whose CWD or
changed/target files sit entirely outside `app-mobile/`, `app-relay/`, and `packages/pi-rpc-protocol/` —
for example, a change to this surface's own `sk-code-webflow` sibling — does not resolve `PI_REMOTE`, does
not bundle `sk-code-mobile-cli`, and loads zero paths from this packet, including its own
`DEFAULT_RESOURCE` pair.

### Why This Matters

Every positive scenario in this playbook proves what loads when `PI_REMOTE` correctly resolves. None of
them prove the converse: that an unrelated surface's task does not accidentally pull in this packet's
Svelte/design-system evidence, which would be irrelevant noise for a request that has nothing to do with
the Pi Remote app. `SKILL.md` §5 states this packet must "never load resources outside this packet
directory" and must "never act as a separate advisor identity or route as a primary" — this scenario is
the negative-space proof that the packet also never self-inserts into an unrelated surface's dispatch.

---

## 2. SCENARIO CONTRACT

Operators confirm a prompt targeting a sibling surface's files does not resolve `PI_REMOTE` and loads zero
`sk-code-mobile-cli` resources, including `DEFAULT_RESOURCE`.

- Objective: confirm the exact prompt does NOT route to surface `PI_REMOTE` and loads zero paths from
  `sk-code-mobile-cli/references/` or `sk-code-mobile-cli/assets/`.
- Real user request: `Update the Webflow component library's button variant styling in the sk-code-webflow surface.`
- Prompt: `Update the Webflow component library's button variant styling in the sk-code-webflow surface.`

**Exact prompt**:
```text
Update the Webflow component library's button variant styling in the sk-code-webflow surface.
```

- Expected execution process: the hub reads the task's CWD/changed-file context, finds no path under
  `app-mobile/`, `app-relay/`, or `packages/pi-rpc-protocol/`, and does not resolve `PI_REMOTE`; the hub
  bundles the `sk-code-webflow` sibling surface's own evidence instead, per `SKILL.md` §6's sibling-surface
  cross-reference, and this packet loads nothing.
- Expected signals: zero paths under `sk-code-mobile-cli/references/` or `sk-code-mobile-cli/assets/`
  appear in the resolved set; `sk-code-mobile-cli` does not appear in the bundled-surface list at all.
- Desired user-visible outcome: the response addresses the Webflow button-variant request using
  `sk-code-webflow` evidence only, with no Svelte-grammar or Pi Remote token-model content mixed in.
- Pass/fail: PASS if `PI_REMOTE` does not resolve and no `sk-code-mobile-cli` resource loads; FAIL if
  `PI_REMOTE` resolves for this prompt, or any `sk-code-mobile-cli` resource — including
  `DEFAULT_RESOURCE` — appears in the bundled set.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Update the Webflow component library's button variant styling in the sk-code-webflow surface.`

### Commands

1. `sed -n '1,15p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/surface-detection/negative-control-non-mobile-cli.md`
2. `sed -n '/^## 1\. WHEN THE HUB BUNDLES THIS/,/^## 2\. REFERENCE MAP/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md`
3. Dispatch the exact prompt; capture the resolved surface list and every packet whose resources loaded.
4. `test -e .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md && echo "OK SKILL.md exists for negative-control confirmation"`

### Expected

Step 2 shows the three-path detection rule from `SKILL.md` §1, confirming `sk-code-webflow`'s own files
are not among the three PI_REMOTE triggers. Step 3 reports a resolved-surface list that does not include
`PI_REMOTE`, and a bundled-resource list with zero `sk-code-mobile-cli/` paths. Step 4 confirms this
packet's own `SKILL.md` is readable (proving the negative result is a routing decision, not a missing-file
artifact).

### Evidence

Command transcript from steps 1-4; the dispatch transcript's full resolved-surface and bundled-resource
list.

### Pass / Fail

- **Pass**: `PI_REMOTE` is absent from the resolved-surface list, and zero `sk-code-mobile-cli/` paths
  appear in the bundled-resource list.
- **Fail**: `PI_REMOTE` resolves for this prompt, or any `sk-code-mobile-cli/` path — including
  `DEFAULT_RESOURCE` — appears in the bundled-resource list.

### Failure Triage

1. If `PI_REMOTE` incorrectly resolved, check whether the prompt's literal text contains one of the three
   trigger substrings (`app-mobile`, `app-relay`, `packages/pi-rpc-protocol`) by accident — a false
   positive here means the detection rule is matching on prompt text rather than actual CWD/changed-file
   context, which is a real routing scoping bug per `SKILL.md` §5's "never load resources outside this
   packet directory" rule.
2. If a specific `sk-code-mobile-cli/` path leaked into the bundled set despite `PI_REMOTE` correctly not
   resolving, treat it as a hub-level bundling defect, not a defect in this packet's own evidence content.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §1 | The three `PI_REMOTE` surface-detection trigger paths this scenario's negative control tests against |
| [SKILL.md](../../SKILL.md) §5 | The "never load resources outside this packet directory" / "never route as a primary" rules this scenario proves |

---

## 5. SOURCE METADATA

- Group: code-mobile-cli surface detection
- Playbook ID: PR-020
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `surface-detection/negative-control-non-mobile-cli.md`
