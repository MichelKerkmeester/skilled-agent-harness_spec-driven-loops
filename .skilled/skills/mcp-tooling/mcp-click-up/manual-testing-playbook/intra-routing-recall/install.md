---
id: CU-R03
category: intra_routing_recall
stage: routing
title: 'Install routing'
description: "This scenario validates the SKILL.md Smart Router's INSTALL intent for `CU-R03`. It confirms a first-time setup/auth prompt scores INSTALL and loads exactly RESOURCE_MAP['INSTALL']."
expected_intent: INSTALL
expected_resources:
  - INSTALL-GUIDE.md
  - references/troubleshooting.md
version: 1.1.0.0
---

# CU-R03: Install routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CU-R03`.

---

## 1. OVERVIEW

This scenario validates that the `mcp-click-up` Smart Router's `INSTALL` intent signal fires on a
first-time setup and authentication request, and that the router loads exactly
`RESOURCE_MAP["INSTALL"]` — `INSTALL-GUIDE.md` (skill-root-relative, not under `references/`) and
`references/troubleshooting.md` — per `SKILL.md` §2.

### Why This Matters

`INSTALL` is one of the two intents that participate in `route_clickup_resources()`'s hard tie-break:
an `INSTALL` score above 4 wins over any other intent's raw score, but only below a `TROUBLESHOOT`
score above 3, which wins first. `INSTALL` is also the one intent whose `RESOURCE_MAP` entry points
outside `references/` — at `INSTALL-GUIDE.md`, directly under the skill root — so this scenario also
guards against that path silently drifting to a `references/INSTALL-GUIDE.md` location that does not
exist.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt scores `INSTALL` under `SKILL.md` §2's weighted keyword model and
that the router's `RESOURCE_MAP["INSTALL"]` entry matches this scenario's declared
`expected_resources`, including the skill-root-relative `INSTALL-GUIDE.md` path.

- Objective: confirm the prompt's keyword overlap with `INTENT_SIGNALS["INSTALL"]` crosses the `> 4`
  tie-break threshold, that no higher-priority `TROUBLESHOOT` keyword fires, and that both mapped
  resources exist on disk at their declared paths.
- Real user request: `Walk me through the cupt setup - install cupt and authenticate with my API token.`
- Prompt: `Walk me through the cupt setup - install cupt and authenticate with my API token.`

**Exact prompt**:
```text
Walk me through the cupt setup - install cupt and authenticate with my API token.
```

- Expected execution process: the router scores every intent's keyword set (weight 6 per hit) against
  the lowercased prompt; `setup`, `install cupt`, `authenticate`, and `api token` are all literal
  `INTENT_SIGNALS["INSTALL"]` keywords, giving an `INSTALL` score of 24 (> 4), and no
  `TROUBLESHOOT` keyword appears, so `SKILL.md` §2's tie-break selects `INSTALL` directly.
- Expected signals: `SKILL.md` §2 lists `INSTALL` in `INTENT_SIGNALS` with those keywords;
  `RESOURCE_MAP["INSTALL"]` names exactly `INSTALL-GUIDE.md` and `references/troubleshooting.md`; both
  files exist at those exact paths (the first at the skill root, not under `references/`).
- Desired user-visible outcome: the router states plainly that this request routes to `INSTALL` and
  bundles the install guide plus the troubleshooting reference before answering.
- Pass/fail: PASS if `SKILL.md` §2 names the matched `INSTALL` keywords and both mapped resources
  exist at their declared paths; FAIL if the keyword weights or `RESOURCE_MAP["INSTALL"]` entry in
  `SKILL.md` no longer matches this scenario's frontmatter, or either resource path is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Walk me through the cupt setup - install cupt and authenticate with my API token.`

### Commands

1. `sed -n '1,12p' .opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/intra-routing-recall/install.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md`
4. `test -e .opencode/skills/mcp-tooling/mcp-click-up/INSTALL-GUIDE.md && echo "OK INSTALL-GUIDE.md" || echo "MISS INSTALL-GUIDE.md"`
5. `test -e .opencode/skills/mcp-tooling/mcp-click-up/references/troubleshooting.md && echo "OK references/troubleshooting.md" || echo "MISS references/troubleshooting.md"`

### Expected

Step 1 shows `expected_intent: INSTALL` and both `expected_resources`. Step 2's output lists
`"INSTALL"` with keywords including `setup`, `install cupt`, `authenticate`, and `api token` at
weight 6. Step 3's output shows `"INSTALL": ["INSTALL-GUIDE.md", "references/troubleshooting.md"]` —
note the first path has no `references/` prefix. Steps 4-5 both print `OK`.

### Evidence

Command transcript from steps 1-5; the `INTENT_SIGNALS["INSTALL"]`/`RESOURCE_MAP["INSTALL"]` excerpts
from steps 2-3 with the matched keywords and the exact `INSTALL-GUIDE.md` path highlighted.

### Pass / Fail

- **Pass**: `SKILL.md` §2 names the matched `INSTALL` keywords and `RESOURCE_MAP["INSTALL"]` lists
  both resources at their declared paths, and both resource paths exist.
- **Fail**: the keyword set or resource map in `SKILL.md` no longer matches this scenario's
  frontmatter, or a resource path does not resolve (including a resource incorrectly expected under
  `references/`).

### Failure Triage

1. Re-run step 2 and diff the current `INTENT_SIGNALS["INSTALL"]` keyword list against this
   scenario's quoted matches to see which keyword moved or was reworded.
2. Re-run steps 4-5 and confirm whether `INSTALL-GUIDE.md` or `references/troubleshooting.md` was
   renamed, moved, or removed.
3. If step 4 fails, confirm the path is being resolved at the skill root and not under `references/`
   — this is the one `RESOURCE_MAP` entry that intentionally lives outside that folder.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and §16 routing-recall index |
| `troubleshoot.md` | The neighboring routing scenario sharing `references/troubleshooting.md` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` §2 | The `INSTALL` `INTENT_SIGNALS` keywords, `RESOURCE_MAP` entry, and tie-break rule this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CU-R03
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/install.md`
