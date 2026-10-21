---
title: "Implementation Plan: Phase 45: relaunch-takeover-lock-identity"
description: "Prove takeover mutex ownership with a random token written beside the pid, rename the directory before removing it, and cover each race with a test that stubs the filesystem where the race happens."
trigger_phrases:
  - "relaunch takeover lock identity plan"
  - "takeover mutex owner token"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 45: relaunch-takeover-lock-identity

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS under Node 22, run by `node --test` |
| **Framework** | `node:test` with `node:assert/strict` |
| **Storage** | None. The tests use temporary directories and stub `fs` in a preload |
| **Testing** | `killer.test.cjs`, run 20 times, plus the Hook Node Tests job on `ubuntu-latest` |

### Overview
The mutex `owner` file now records the pid and a random token, and the release removes the directory only while the recorded inode and the token both match. Because a path check followed by `rmSync` still lets a contender swap the directory, the release renames it to a private `.stale-` name first, reads the token again from the renamed directory, removes it only on a match and renames it back on a mismatch. The owner-write failure paths take the same rename-first shape.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted race repair inside one module. The takeover protocol stays a directory mutex, and the fix changes what proves ownership and in what order the directory is renamed and removed.

### Key Components
- **Mutex directory**: `<lock>.takeover`, created with `mkdirSync`, whose `owner` file now holds `<pid> <token>`.
- **`removeOwnMutex`**: checks the inode and the token, renames to `.stale-<pid>-<uuid>`, re-reads the token, then removes or renames back.
- **`removeOwnerlessMutex`**: the cleanup after a non-`EEXIST` owner-write failure. It checks the inode and the missing owner file, then renames first and judges the renamed directory.
- **`acquireLock`**: creates the token, writes the owner file with `wx`, and skips removal entirely when that write fails with `EEXIST`.
- **Stale sweep**: removes `.takeover.stale-` directories older than 30 s, which is where a rename-back that lost the path leaves a directory.

### Data Flow
A killer creates the mutex directory, writes its pid and token, and holds the mutex while it re-checks the lock. On release it renames the directory away from the canonical path, reads the token from the renamed directory, and either removes it or puts it back. A contender that replaced the path during any of those steps is identified by the token rather than by the inode, because the filesystem can reuse the inode of a deleted directory.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each race gets one test, and each test stubs the exact `fs` call where the race happens: `statSync` pins the inode so Linux's reuse reproduces on every platform, `writeFileSync` fails the owner write with `EEXIST` or `EACCES` and `renameSync` swaps the directory after the ownership check. Every test was run against the code before its fix and failed there (`scratch/mutation/`). The finished suite was then run 20 consecutive times (`scratch/killer-20x-r3.txt`) before the CI job is the confirmation on Linux.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The stale sweep's existing `.takeover.stale-` prefix, and `randomUUID` from `node:crypto`, which the release uses for the private name. The lock file format and the relaunch record are unchanged, so an older killer still reads the pid from the mutex `owner` file's first field.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the three files. The mutex `owner` file returns to a single pid field and the release returns to an inode-only check, which restores the Linux failure and touches no lock file, no record and no other hook.
<!-- /ANCHOR:rollback -->

---
