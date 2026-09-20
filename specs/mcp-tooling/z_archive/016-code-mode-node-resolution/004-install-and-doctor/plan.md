---
title: "Implementation Plan: Installers, guides and diagnosis"
description: "Make the portable registration survive a fresh install, surface an unsatisfiable host through the diagnostic route, and record the constraint where readers meet the launch path."
trigger_phrases:
  - "code mode install plan"
  - "doctor mcp diagnosis design"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Installers, guides and diagnosis

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell installers, markdown guides, and the diagnostic route's MCP target |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Run each installer against a scratch configuration and inspect what it wrote |

### Overview

Three strands close the packet. The installers stop emitting an absolute interpreter path so a fresh install matches the cutover. The diagnostic route gains a check that asks the resolver whether this host can satisfy the declared range, turning a runtime crash into a reported gap. The guides and the authoring checklist record the constraint and its consequence, sourced from the server's own postinstall explanation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The cutover is complete, so installers have a correct shape to emit
- [ ] The resolver exposes the declared range alongside its answer, so the diagnosis can name it
- [ ] The wording in the server's postinstall check is the agreed source for the reason

### Definition of Done
- [ ] Each installer run against a scratch configuration writes no absolute interpreter path
- [ ] A forced-unsatisfiable range makes the MCP diagnosis report the gap rather than health
- [ ] No installer, guide or checklist names an absolute interpreter path for this server
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single source of truth, consumed rather than copied. The range lives in the server manifest; the resolver reads it; the diagnosis and the guides refer to it instead of restating a version number that would drift.

### Key Components

- **Installers**: emit the launcher-based registration.
- **Diagnosis**: calls the resolver and reports the range when the answer is absent.
- **Documents**: name the constraint and the refusal behavior, not a path.

### Data Flow

The manifest declares the range. The resolver reads it and answers for this host. The diagnostic route reports that answer. The guides describe what the reader will see when the answer is absent.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the per-task state. The work divides into three stages:

### Phase 1: Observe what the installers write
Run each installer against a scratch configuration and keep the output. An installer's behavior is not inferable from reading it, and this phase exists because their output outlives the cutover.

### Phase 2: Change installers, diagnosis and documents
The installers and the diagnostic check first, since they are executable and testable; the guides and checklist after, so they describe behavior that already exists.

### Phase 3: Re-run and scan
Re-run the installers against scratch configurations, force the range unsatisfiable to see the diagnosis branch, and scan the changed files for absolute interpreter paths.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Installers are executed, not read: each runs against a scratch configuration and the written registration is inspected, because an installer edited but never run is an assumption. The diagnosis is exercised with the range forced unsatisfiable, which is the only way to see the branch that matters. The documentation check is a scan for absolute interpreter paths across the changed files, which is objective and cheap to repeat.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The resolver from 001-resolution-contract, which the diagnosis calls. The cutover from 003-host-config-cutover, which defines the shape the installers emit.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reverting the six files restores the previous installers, guides and diagnosis. None of them is on the launch path, so a revert here changes what a fresh install writes and what the diagnosis reports, and leaves running servers unaffected.
<!-- /ANCHOR:rollback -->

---
