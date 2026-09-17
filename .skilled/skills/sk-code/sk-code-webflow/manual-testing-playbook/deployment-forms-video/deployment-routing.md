---
id: WF-010
category: deployment_forms_video
title: 'Deployment routing'
description: "This scenario validates DEPLOYMENT routing for `WF-010`. It confirms that a CDN/wrangler/minify/staging-before-production prompt classifies as `DEPLOYMENT` and loads the full deployment and minification-guide set plus the `assets/scripts/README.md` asset, matching `SKILL.md` §2b's `RESOURCE_MAP[\"DEPLOYMENT\"]` entry exactly."
expected_surface: WEBFLOW
expected_intent: DEPLOYMENT
expected_resources:
  - references/deployment/cdn-deployment.md
  - references/deployment/minification-guide/overview-terser-and-patterns.md
  - references/deployment/minification-guide/workflow-verification-and-debugging.md
  - references/deployment/minification-guide/batch-rules-and-related.md
  - references/deployment/webflow-staging-production.md
  - assets/scripts/README.md
version: 1.0.0.0
---

# WF-010: Deployment routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `WF-010`.

---

## 1. OVERVIEW

This scenario validates DEPLOYMENT routing for `WF-010`. It confirms that a CDN/wrangler/minify/staging-before-production prompt classifies as `DEPLOYMENT` and loads the full deployment and minification-guide set plus the `assets/scripts/README.md` asset, matching `SKILL.md` §2b's `RESOURCE_MAP["DEPLOYMENT"]` entry exactly.

### Why This Matters

This is the deploy-side mirror of WF-004's CDN-runtime-reality standard: `webflow-staging-production.md` and the minification-guide trio exist so a "deploy to CDN, minify, verify staging before production" prompt treats every release as versioned, not as a direct-to-production overwrite.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `WF-010` classifies as `DEPLOYMENT` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `WEBFLOW`, intent `DEPLOYMENT`, and every
  path in `expected_resources`.
- Real user request: `Deploy the Webflow client script to the cdn with wrangler, minify it, and verify staging before production release.`
- Prompt: `Deploy the Webflow client script to the cdn with wrangler, minify it, and verify staging before production release.`

**Exact prompt**:
```text
Deploy the Webflow client script to the cdn with wrangler, minify it, and verify staging before production release.
```

- Expected execution process: the hub detects `WEBFLOW`, the `DEPLOYMENT` `INTENT_SIGNALS` keywords
  (`deploy`, `cdn`, `wrangler`, `minify`, `staging`, ...) match the prompt, and every path this scenario lists under `expected_resources`
  resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-webflow/`, and each one
  documents `DEPLOYMENT` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow minifies the script per the Terser workflow, deploys through wrangler to the CDN, and verifies the staging runtime before promoting to production, per `webflow-staging-production.md`.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `WEBFLOW`/
  `DEPLOYMENT`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Deploy the Webflow client script to the cdn with wrangler, minify it, and verify staging before production release.`

### Commands

1. `sed -n '1,19p' .opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/deployment-forms-video/deployment-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-webflow/SKILL.md | sed -n '/"DEPLOYMENT": \[/,/\],/p'`
3. `for p in references/deployment/cdn-deployment.md references/deployment/minification-guide/overview-terser-and-patterns.md references/deployment/minification-guide/workflow-verification-and-debugging.md references/deployment/minification-guide/batch-rules-and-related.md references/deployment/webflow-staging-production.md assets/scripts/README.md; do test -e ".opencode/skills/sk-code/sk-code-webflow/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: WEBFLOW` and `expected_intent: DEPLOYMENT`. Step 2 shows the
`DEPLOYMENT` `RESOURCE_MAP` entry this scenario's set mirrors exactly. Step 3 prints `OK` for every
path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["DEPLOYMENT"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `WEBFLOW`/`DEPLOYMENT`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `WEBFLOW`/`DEPLOYMENT`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["DEPLOYMENT"]` excerpt —
   the two sets are an exact mirror for this intent, so any difference means either this scenario
   file or `SKILL.md` §2b drifted and needs reconciling, not that a subset omission is by design.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §3 | The "CDN runtime reality" non-negotiable this scenario grounds in |

---

## 5. SOURCE METADATA

- Group: Deployment Forms And Video
- Playbook ID: WF-010
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `deployment-forms-video/deployment-routing.md`

