---
title: "Implementation Plan: Code Mode manual variable prefixes"
description: "Confirm the prefixing rule against the transport, repair the references and keys it invalidates, and prove the result on a freshly started server."
trigger_phrases:
  - "code mode variable prefix plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Code Mode manual variable prefixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON configuration and an untracked environment file |
| **Framework** | Code Mode's UTCP variable substitution |
| **Storage** | None beyond the environment file already present |
| **Testing** | A freshly started server, because a runtime registration bypasses the code path that fails |

### Overview

Establish the rule, compute the key each manual actually needs, repair what a config or environment change can reach, and name what it cannot.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The prefixing rule is confirmed against the transport and the install guide
- [x] The exact lookup key for every credentialed manual is computed rather than guessed
- [x] The pre-change failure set is recorded from a fresh server

### Definition of Done
- [x] Every repairable manual registers on a fresh server
- [x] The manuals that worked before still work
- [x] No secret appears in a tracked file
- [x] Each remaining failure names its cause
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Repair at the layer that owns the mistake. A reference written with the prefix already applied is a configuration error and is fixed in the configuration. A manual name that forces an unusual key is not a mistake at all, so the environment gains the key rather than the manual losing its name.

### Key Components

- **Rule confirmation**: the documented table plus a controlled probe, since the underscore behaviour is not in the documentation.
- **Key computation**: the lookup key derived for every credentialed manual and compared against the environment file.
- **Fresh-server verification**: the only path that exercises startup registration.

### Data Flow

A manual declares a reference. Code Mode doubles each underscore in the manual name, appends the referenced variable, and resolves that key through the configured loader. A mismatch at that single step is the whole defect.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the per-task state. The work divides into three stages:

### Phase 1: Establish the rule
Confirm the prefixing behaviour against the documentation and a probe before editing anything, because the fix is the inverse of the rule and an inverted rule produces a confident wrong edit.

### Phase 2: Repair
Strip the duplicated prefix where the reference is wrong. Add the key where the manual name is unusual but correct.

### Phase 3: Prove on a fresh server
Start a server against the real configuration and read every registration line. A runtime registration cannot show this failure, which is why it went unnoticed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The only meaningful test is a freshly started server reading the real configuration, because registration happens once at startup and the running servers loaded their environment before any edit. Success is the full registration list, not the absence of an error: a manual that silently fails to register looks identical to one that was never configured.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Code Mode's variable substitution and the dotenv loader configured for this repository. If the prefixing rule changes, every credentialed manual's reference changes with it.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Both changed files were copied before editing. Restoring the configuration returns the four references to their previous form, and removing the two added environment keys returns that file to its previous content; neither restoration needs a value that is not already present. Reverting returns the system to its prior state, in which those manuals did not register.
<!-- /ANCHOR:rollback -->

---
