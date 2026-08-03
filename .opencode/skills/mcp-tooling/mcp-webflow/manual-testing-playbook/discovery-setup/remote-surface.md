---
title: "REMOTE-SURFACE-001 -- Remote vs local surface reconciliation"
description: "The session resolves which surface is live (remote vs local OSS) before any call."
stage: routing
version: 1.0.0.0
---

# REMOTE-SURFACE-001 -- Remote vs local surface reconciliation

## 1. OVERVIEW

This scenario validates Remote vs local surface reconciliation for `REMOTE-SURFACE-001`. It focuses on The session resolves which surface is live (remote vs local OSS) before any call..

### Why This Matters

The session resolves which surface is live (remote vs local OSS) before any call.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `REMOTE-SURFACE-001` and confirm the expected signals without contradictory evidence.

- Objective: The session resolves which surface is live (remote vs local OSS) before any call.
- Real user request: `Run discovery and identify the live surface.`
- Prompt: `Run discovery and identify the live surface.`
- Expected execution process: Count list_tools entries; compare against the remote (220) and local (18-module) references; pin the version.
- Expected signals: Surface identified (31-tool/220-action remote vs 18-module local); version pinned.
- Desired user-visible outcome: A recorded surface verdict and pinned version.
- Pass/fail: PASS if the surface is identified and recorded; FAIL if surfaces are mixed.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run discovery and identify the live surface.`

### Commands

1. `list_tools()`; count entries. 2. Compare with both references. 3. Record the surface verdict.

### Expected

Surface identified (31-tool/220-action remote vs 18-module local); version pinned.

### Evidence

list_tools count, surface verdict, pinned version.

### Pass / Fail

- **Pass**: if the surface is identified and recorded
- **Fail**: if surfaces are mixed

### Failure Triage

1. Compare counts against both references. 2. Pin the version and record.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/feature-catalog.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/action-reference.md` | Action inventory with classes |
| `../../SKILL.md` | Frozen classes and gates |

---

## 5. SOURCE METADATA

- Group: Discovery and Setup
- Playbook ID: REMOTE-SURFACE-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `discovery-setup/remote-surface.md`
