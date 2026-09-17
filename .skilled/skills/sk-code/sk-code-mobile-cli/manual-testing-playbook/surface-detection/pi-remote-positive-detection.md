---
id: PR-019
category: surface_detection
title: 'PI_REMOTE positive detection across all three trigger paths'
description: "This scenario validates PI_REMOTE surface detection itself for `PR-019`. It focuses on confirming the hub resolves PI_REMOTE for each of the three independent path triggers SKILL.md §1 declares: app-mobile/, app-relay/, and packages/pi-rpc-protocol/."
expected_surface: PI_REMOTE
expected_intent: SURFACE_DETECTION
expected_resources:
  - references/design-system/token-library.md
  - references/conventions/comment-grammar.md
version: 1.0.0.0
---

# PR-019: PI_REMOTE positive detection across all three trigger paths

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-019`.

---

## 1. OVERVIEW

This scenario validates `PI_REMOTE` surface detection itself for `PR-019`, one layer beneath every other
scenario in this playbook. Every other scenario file states "assumes the hub's surface detection has
already resolved `PI_REMOTE`" — this scenario is the one that actually exercises that assumption, across
each of the three independent path triggers `SKILL.md` §1 declares: a task whose CWD or changed/target
files sit under `app-mobile/`, `app-relay/`, or `packages/pi-rpc-protocol/`.

### Why This Matters

Intent-detection scenarios (`PR-001`..`PR-007`) and every category built on top of them are meaningless if
the surface never resolves `PI_REMOTE` in the first place. `app-relay/` and `packages/pi-rpc-protocol/`
are easy to under-test because the seven original scenarios all used `app-mobile/`-flavored prompts; this
scenario closes that gap by exercising all three triggers explicitly, not just the most common one.

---

## 2. SCENARIO CONTRACT

Operators confirm each of three prompts, one per declared trigger path, independently resolves
`PI_REMOTE`.

- Objective: confirm a task targeting `app-mobile/`, a task targeting `app-relay/`, and a task targeting
  `packages/pi-rpc-protocol/` each independently resolve surface `PI_REMOTE`.
- Real user request (trigger 1): `Update the composer component under app-mobile/src/pages/chat.`
- Real user request (trigger 2): `Check the relay's auth handling under app-relay for a token-refresh edge case.`
- Real user request (trigger 3): `Confirm the wire-protocol message shape in packages/pi-rpc-protocol matches what app-mobile expects.`
- Prompt: `Update the composer component under app-mobile/src/pages/chat.` (trigger 1; triggers 2 and 3 follow in Test Execution below)

**Exact prompt (trigger 1)**:
```text
Update the composer component under app-mobile/src/pages/chat.
```

- Expected execution process: for each of the three prompts, the hub reads the task's CWD or
  changed/target file path, matches it against `app-mobile/`, `app-relay/`, or `packages/pi-rpc-protocol/`
  per `SKILL.md` §1, and resolves `PI_REMOTE` — bundling this packet behind whichever workflow mode the
  request's intent needs.
- Expected signals: all three prompts resolve `PI_REMOTE`; none resolves a different or no surface.
- Desired user-visible outcome: a request touching any of the three trigger paths gets this surface's
  design-system and Svelte-grammar evidence bundled in, regardless of which of the three paths it names.
- Pass/fail: PASS if all three trigger-path prompts independently resolve `PI_REMOTE`; FAIL if any of the
  three fails to resolve `PI_REMOTE`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt (trigger 1, `app-mobile/`): `Update the composer component under app-mobile/src/pages/chat.`
- Prompt (trigger 2, `app-relay/`): `Check the relay's auth handling under app-relay for a token-refresh edge case.`
- Prompt (trigger 3, `packages/pi-rpc-protocol/`): `Confirm the wire-protocol message shape in packages/pi-rpc-protocol matches what app-mobile expects.`

### Commands

1. `sed -n '1,15p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/surface-detection/pi-remote-positive-detection.md`
2. `sed -n '/^## 1\. WHEN THE HUB BUNDLES THIS/,/^## 2\. REFERENCE MAP/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md`
3. Dispatch trigger 1 (`app-mobile/` path); capture the resolved surface.
4. Dispatch trigger 2 (`app-relay/` path); capture the resolved surface.
5. Dispatch trigger 3 (`packages/pi-rpc-protocol/` path); capture the resolved surface.

### Expected

Step 2 shows the three-path detection rule from `SKILL.md` §1. Steps 3-5 each report `PI_REMOTE`.

### Evidence

Command transcript from steps 1-5; the three per-trigger dispatch transcripts; the `SKILL.md` §1 excerpt.

### Pass / Fail

- **Pass**: all three trigger-path prompts independently resolve `PI_REMOTE`.
- **Fail**: any of the three trigger-path prompts fails to resolve `PI_REMOTE`, or resolves a different
  surface.

### Failure Triage

1. Re-read `SKILL.md` §1's exact trigger wording and confirm the specific trigger path used in the failing
   prompt is still listed there verbatim.
2. If a trigger path was renamed or restructured in the app repository (for example, `app-relay/` moving
   under a different top-level folder), confirm whether `SKILL.md` §1 has been updated to match, since this
   scenario's evidence is authored from this repository and cannot observe the app repository's live
   structure directly.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §1 | The three `PI_REMOTE` surface-detection trigger paths this scenario exercises |

---

## 5. SOURCE METADATA

- Group: code-mobile-cli surface detection
- Playbook ID: PR-019
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `surface-detection/pi-remote-positive-detection.md`
