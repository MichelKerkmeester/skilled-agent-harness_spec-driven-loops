---
id: AD-R04
category: intra-routing-recall
stage: routing
title: 'Install routing'
description: "This scenario validates the SKILL.md Smart Router's INSTALL intent for `AD-R04`. It confirms a first-time setup prompt scores INSTALL and loads exactly RESOURCE_MAP['INSTALL']."
expected_intent: INSTALL
expected_resources:
  - references/troubleshooting.md
version: 1.1.0.0
---

# AD-R04: Install routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `AD-R04`.

---

## 1. OVERVIEW

This scenario validates that the `mcp-aside-devtools` Smart Router's `INSTALL` intent signal fires on
a first-time setup request, and that the router loads exactly `RESOURCE_MAP["INSTALL"]` —
`references/troubleshooting.md` alone — per `SKILL.md` §2.

### Why This Matters

`INSTALL` is the single-resource intent in `RESOURCE_MAP`: it points only at
`references/troubleshooting.md`, which documents the official curl installer and first-sign-in flow.
If `INSTALL` were mis-scored against `TROUBLESHOOT` (both share `references/troubleshooting.md`, and
several `INSTALL` keywords like `not found` read similarly to failure language), an operator setting up
Aside for the first time could be handed troubleshooting-only guidance without the install-specific
framing this scenario protects.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt scores `INSTALL` under `SKILL.md` §2's weighted keyword model and
that the router's `RESOURCE_MAP["INSTALL"]` entry matches this scenario's declared `expected_resources`.

- Objective: confirm the prompt's keyword overlap with `INTENT_SIGNALS["INSTALL"]` selects `INSTALL`
  as the top-scoring intent, and that the mapped resource exists on disk.
- Real user request: `Aside is not installed on this machine — set up the CLI with the curl installer and sign in for the first time.`
- Prompt: `Aside is not installed on this machine — set up the CLI with the curl installer and sign in for the first time.`

**Exact prompt**:
```text
Aside is not installed on this machine — set up the CLI with the curl installer and sign in for the first time.
```

- Expected execution process: the router scores every intent's keyword set against the lowercased
  prompt and selects `INSTALL` because `not installed`, `set up`, `curl`, `sign in`, and `first time`
  are all literal `INTENT_SIGNALS["INSTALL"]` keywords at weight 4 each.
- Expected signals: `SKILL.md` §2 lists `INSTALL` in `INTENT_SIGNALS` with those keywords;
  `RESOURCE_MAP["INSTALL"]` names exactly `references/troubleshooting.md`; the file exists.
- Desired user-visible outcome: the router states plainly that this request routes to `INSTALL` and
  bundles the troubleshooting reference (for its documented install/first-sign-in section) before
  answering.
- Pass/fail: PASS if `SKILL.md` §2 names the matched `INSTALL` keywords and the mapped resource
  exists; FAIL if the keyword weights or `RESOURCE_MAP["INSTALL"]` entry in `SKILL.md` no longer
  matches this scenario's frontmatter, or the resource path is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Aside is not installed on this machine — set up the CLI with the curl installer and sign in for the first time.`

### Commands

1. `sed -n '1,11p' .opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/intra-routing-recall/install.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md`
4. `test -e .opencode/skills/mcp-tooling/mcp-aside-devtools/references/troubleshooting.md && echo "OK references/troubleshooting.md" || echo "MISS references/troubleshooting.md"`

### Expected

Step 1 shows `expected_intent: INSTALL`. Step 2's output lists `"INSTALL"` with keywords including
`not installed`, `set up`, `curl`, `sign in`, and `first time` at weight 4. Step 3's output shows
`"INSTALL": ["references/troubleshooting.md"]`. Step 4 prints `OK`.

### Evidence

Command transcript from steps 1-4; the `INTENT_SIGNALS["INSTALL"]`/`RESOURCE_MAP["INSTALL"]` excerpts
from steps 2-3 with the matched keywords highlighted.

### Pass / Fail

- **Pass**: `SKILL.md` §2 names the matched `INSTALL` keywords and `RESOURCE_MAP["INSTALL"]` lists the
  resource, and the resource path exists.
- **Fail**: the keyword set or resource map in `SKILL.md` no longer matches this scenario's
  frontmatter, or the resource path does not resolve.

### Failure Triage

1. Re-run step 2 and diff the current `INTENT_SIGNALS["INSTALL"]` keyword list against this scenario's
   quoted matches to see which keyword moved or was reworded.
2. Re-run step 4 and confirm whether `references/troubleshooting.md` was renamed or removed.
3. If the prompt instead scored `TROUBLESHOOT`, confirm the ambiguity-delta tie-break in
   `select_intents()` (`SKILL.md` §2) still favors `INSTALL`'s higher raw keyword count.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and §14 routing-recall index |
| `troubleshoot.md` | The neighboring routing scenario sharing the same mapped reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` §2 | The `INSTALL` `INTENT_SIGNALS` keywords and `RESOURCE_MAP` entry this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: AD-R04
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/install.md`
