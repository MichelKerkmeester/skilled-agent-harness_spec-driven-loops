---
title: "CU-031 -- Clear Cache"
description: "This scenario validates Clear Cache for `CU-031`. Objective: Verify `cupt config --clear-cache` removes cached data, forcing fresh API fetch."
---

# CU-031 -- Clear Cache

---

## 1. OVERVIEW

Validates that **Clear Cache** behaves as defined in the feature catalog.

### Why This Matters

Verify `cupt config --clear-cache` removes cached data, forcing fresh API fetch is required for correct agent operation. Failure here means step 2 exits non-zero or cache persists after clear.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `cupt config --clear-cache` removes cached data, forcing fresh API fetch
- **Real user request:** `Clear the cupt local cache.`
- **Prompt:** `Clear the cupt cache and verify fresh data is fetched on next command.`
- **Expected signals:** Step 2: clear cache exits 0 with confirmation. Step 3: offline mode fails or returns empty because cache was cleared.
- **Desired user-visible outcome:** Agent reports: cache cleared. Offline mode no longer has cached data.
- **Pass/fail:** PASS if step 2 exits 0 AND step 3 shows cache was cleared; FAIL if step 2 exits non-zero OR cache persists after clear

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. `cupt list --json`  # → populates cache
2. `cupt config --clear-cache`  # → exit 0
3. `cupt list --offline --json`  # → may fail or return empty (cache cleared)

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| CU-031 | Clear Cache | Verify `cupt config --clear-cache` removes cached data, | `Clear the cupt cache and verify fresh data is fetched o` | Step 2: clear cache exits 0 with confirmation. Step 3: offline mode fails or ret | PASS if step 2 exits 0 AND step 3 shows cache was cleared; FAIL if step 2 exits non-zero OR cache persists after clear | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/01--cupt-authentication/006-clear-cache.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Offline
- Playbook ID: CU-031
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--cupt-offline-and-cache/clear-cache.md`
