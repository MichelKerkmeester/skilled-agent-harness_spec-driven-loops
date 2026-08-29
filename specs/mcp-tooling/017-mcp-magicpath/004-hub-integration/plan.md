---
title: "Implementation Plan: Hub integration for mcp-magicpath"
description: "Settle the mode's axis and posture from the registration, add exactly one registry entry, regenerate the manifest, and gate on the fleet audit."
trigger_phrases:
  - "hub integration plan"
  - "mode registry entry design"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Hub integration for mcp-magicpath

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON metadata and markdown prose in the hub root |
| **Framework** | The hub's mode registry and router contracts, audited by the fleet metadata tool |
| **Storage** | None |
| **Testing** | The fleet metadata audit, plus an observed routing result |

### Overview

Decide the axis before writing the entry, because the axis decides what the entry is allowed to claim. Then one added entry, a regenerated manifest, and prose.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The mutating-family decision from phase 002 is re-read from the registration
- [ ] The axis question is answered: transport, workflow, or a stated widening
- [ ] The manifest's generator is identified, so the manifest is never hand-edited

### Definition of Done
- [ ] A MagicPath request routes to the mode, observed
- [ ] The fleet metadata audit passes with the member present
- [ ] The registry diff shows one added entry and no edits to existing ones
- [ ] The declared posture is true of the registered surface
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Declaration derived from capability. What the mode is allowed to claim follows from what phase 002 registered, so the registry stays a description rather than an aspiration.

### Key Components

- **Axis decision**: transport or workflow, settled against the mutation posture rather than by resemblance to siblings.
- **Registry entry**: kind, backend, tool surface, aliases and routing class.
- **Regenerated manifest**: produced by its tool as the last metadata step.
- **Prose**: readme and router, so a human reader finds the member where they find the others.

### Data Flow

A request reaches the hub, the hub reads the registry to resolve a mode, and the mode's packet supplies the contract. The manifest is a derived artifact of that tree, which is why it is generated after the entry exists rather than written alongside it.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the per-task state. The work divides into three stages:

### Phase 1: Settle the axis
Answer whether a CLI-backed bridge that may write to the working tree belongs on an axis whose members declare they write nothing. Writing the entry first and rationalising the axis afterwards is how a registry acquires a false statement.

### Phase 2: Declare and regenerate
Add exactly one entry, bind the route, then regenerate the manifest with its own tool. Prose last, once the machine-readable surface is settled.

### Phase 3: Gate and prove routing
Run the fleet audit, then observe a real request resolving to the mode. A passing audit shows the metadata is consistent; only a routed request shows it works.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The fleet metadata audit is the authoritative gate for shape and consistency, and it is the same tool that regenerates the manifest, so the two cannot disagree. It cannot tell whether routing actually resolves, which is why an observed request is required alongside it. Sibling routing is exercised after the change, because the failure mode of a registry edit is not a broken new mode but a broken existing one.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The hub's registry and router contracts, and the fleet metadata audit tool that regenerates the leaf manifest. If the hub's member shape changes, this entry changes with it.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reverting the registry and router edits removes the route, and re-running the manifest generator returns the manifest to a tree without the member. The packet from phase 003 survives as an unrouted document, which is exactly its state before this phase, so the rollback is a clean return rather than a partial one. The fleet audit is re-run after reverting to confirm the hub is consistent without the member.
<!-- /ANCHOR:rollback -->

---
