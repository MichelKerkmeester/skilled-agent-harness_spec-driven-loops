---
title: "Implementation Plan: The mcp-magicpath mode packet"
description: "Author the packet from the registration outward, in the hub-member shape a sibling already demonstrates, and close on the packaging gate."
trigger_phrases:
  - "mcp-magicpath packet plan"
  - "hub member authoring"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: The mcp-magicpath mode packet

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documents in a hub-member packet directory |
| **Framework** | The create-skill contract, deferring to the skill-root metadata contract for file placement |
| **Storage** | None |
| **Testing** | The create-skill packaging gate, plus a per-entry check against the registration |

### Overview

The registration is the source. Every document is written from what phase 002 actually registered, and the packet's file set is copied in shape - not in content - from a sibling that already passes the fleet audit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] A sibling packet's real file set is enumerated as the shape to match
- [ ] The registered tool list from phase 002 is captured as the catalog's source
- [ ] The metadata files forbidden at a mode sublevel are named before authoring

### Definition of Done
- [ ] The packaging gate reports the packet clean
- [ ] Every catalog entry maps to a registered tool
- [ ] The packet carries no root-level metadata file
- [ ] The entry contract states both when to route here and when not to
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Documentation derived from a registration rather than from a vendor's readme. The registration is what an agent can actually call, so it is the only honest source for what the packet claims.

### Key Components

- **Entry contract**: when this route is right, when it is not, and the rules that bind it.
- **References**: the command surface, the credential path, the mutation boundary.
- **Asset**: the registered manual, documented where a reader can compare it to the live config.
- **Feature catalog**: one entry per registered tool.

### Data Flow

Phase 002's registration is read, each registered tool becomes a catalog entry, and the entry contract summarises the boundary those tools sit inside. Nothing is authored from the vendor's published readme, which describes a build this machine may not run.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the per-task state. The work divides into three stages:

### Phase 1: Fix the shape
Enumerate a sibling's file set and name the forbidden root-level metadata files. Getting this wrong produces a packet the fleet audit rejects, and it is cheaper to establish before writing than to correct after.

### Phase 2: Author from the registration
Entry contract first, since it decides what the rest must support. Then references, asset and catalog, each traced to a registered tool.

### Phase 3: Gate
Run the packaging gate and reconcile every catalog entry against the registration.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Two checks, neither of which is a test suite. The packaging gate is the contract's own validator and is authoritative for shape. The catalog-to-registration reconciliation is manual and is the one that catches the failure that matters: a document promising a capability the surface does not have.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The create-skill contract and the skill-root metadata contract it defers to. If the hub-member shape changes, this packet's file set changes with it, and the sibling used as the shape reference is the signal.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The packet is a new directory and nothing outside it changes, so deleting the directory restores the previous state exactly. The mode is not routable until phase 004, so a packet removed here leaves no dangling reference in the hub.
<!-- /ANCHOR:rollback -->

---
