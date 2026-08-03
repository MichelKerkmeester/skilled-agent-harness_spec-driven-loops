---
title: "READCMS-001 -- Read CMS collection"
description: "RO CMS reads pass without confirmation."
stage: routing
version: 1.0.0.0
---

# READCMS-001 -- Read CMS collection

## 1. OVERVIEW

This scenario validates Read CMS collection for `READCMS-001`. It focuses on RO CMS reads pass without confirmation..

### Why This Matters

RO CMS reads pass without confirmation.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `READCMS-001` and confirm the expected signals without contradictory evidence.

- Objective: RO CMS reads pass without confirmation.
- Real user request: `List the CMS collection items in the test site.`
- Prompt: `List the CMS collection items in the test site.`
- Expected execution process: Discover, classify RO, scope-check, read.
- Expected signals: Scope check passes; collection items returned.
- Desired user-visible outcome: Collection items returned with evidence.
- Pass/fail: PASS if items are returned without a confirmation gate; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `List the CMS collection items in the test site.`

### Commands

1. `list_tools()`. 2. `list_collection_items` on the test collection.

### Expected

Scope check passes; collection items returned.

### Evidence

Tool output (redacted).

### Pass / Fail

- **Pass**: if items are returned without a confirmation gate
- **Fail**: otherwise

### Failure Triage

1. Check token scopes (cms:read). 2. Confirm the collection id.

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

- Group: Read-Only
- Playbook ID: READCMS-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `read-only/readcms.md`
