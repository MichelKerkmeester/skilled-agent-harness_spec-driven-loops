---
id: WF-012
category: deployment_forms_video
title: 'Video routing'
description: "This scenario validates VIDEO routing for `WF-012`. It confirms that an HLS/adaptive-stream/video-player prompt classifies as `VIDEO` and loads the third-party-integrations set covering HLS, Botpoison, Finsweet, and FilePond, matching `SKILL.md` §2b's `RESOURCE_MAP[\"VIDEO\"]` entry exactly."
expected_surface: WEBFLOW
expected_intent: VIDEO
expected_resources:
  - references/implementation/third-party-integrations/overview-hls-and-lenis.md
  - references/implementation/third-party-integrations/botpoison-and-finsweet.md
  - references/implementation/third-party-integrations/filepond.md
  - references/implementation/third-party-integrations/best-practices-and-summary.md
version: 1.0.0.0
---

# WF-012: Video routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `WF-012`.

---

## 1. OVERVIEW

This scenario validates VIDEO routing for `WF-012`. It confirms that an HLS/adaptive-stream/video-player prompt classifies as `VIDEO` and loads the third-party-integrations set covering HLS, Botpoison, Finsweet, and FilePond, matching `SKILL.md` §2b's `RESOURCE_MAP["VIDEO"]` entry exactly.

### Why This Matters

SKILL.md §3's interaction-gated-loading standard names HLS.js explicitly as a heavy vendor that must load on interaction or visibility, never eagerly. This scenario confirms an HLS adaptive-stream prompt routes to the third-party-integrations doctrine that documents that gating, not just a generic "add a video player" implementation note.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `WF-012` classifies as `VIDEO` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `WEBFLOW`, intent `VIDEO`, and every
  path in `expected_resources`.
- Real user request: `Add an hls adaptive stream video player to the Webflow page and handle vendor loading.`
- Prompt: `Add an hls adaptive stream video player to the Webflow page and handle vendor loading.`

**Exact prompt**:
```text
Add an hls adaptive stream video player to the Webflow page and handle vendor loading.
```

- Expected execution process: the hub detects `WEBFLOW`, the `VIDEO` `INTENT_SIGNALS` keywords
  (`hls`, `adaptive stream`, `video player`, ...) match the prompt, and every path this scenario lists under `expected_resources`
  resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-webflow/`, and each one
  documents `VIDEO` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow gates the HLS.js vendor load behind interaction or visibility per the third-party-integrations doctrine, rather than loading the adaptive-stream library eagerly on page load.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `WEBFLOW`/
  `VIDEO`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Add an hls adaptive stream video player to the Webflow page and handle vendor loading.`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/deployment-forms-video/video-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-webflow/SKILL.md | sed -n '/"VIDEO": \[/,/\],/p'`
3. `for p in references/implementation/third-party-integrations/overview-hls-and-lenis.md references/implementation/third-party-integrations/botpoison-and-finsweet.md references/implementation/third-party-integrations/filepond.md references/implementation/third-party-integrations/best-practices-and-summary.md; do test -e ".opencode/skills/sk-code/sk-code-webflow/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: WEBFLOW` and `expected_intent: VIDEO`. Step 2 shows the
`VIDEO` `RESOURCE_MAP` entry this scenario's set mirrors exactly. Step 3 prints `OK` for every
path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["VIDEO"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `WEBFLOW`/`VIDEO`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `WEBFLOW`/`VIDEO`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["VIDEO"]` excerpt —
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
| [SKILL.md](../../SKILL.md) §3 | The "Interaction-gated loading" non-negotiable this scenario grounds in |

---

## 5. SOURCE METADATA

- Group: Deployment Forms And Video
- Playbook ID: WF-012
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `deployment-forms-video/video-routing.md`

