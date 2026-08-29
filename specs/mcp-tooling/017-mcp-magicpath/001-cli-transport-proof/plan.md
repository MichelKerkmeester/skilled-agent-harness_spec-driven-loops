---
title: "Implementation Plan: CLI transport proof"
description: "Register one probe manual, call it through Code Mode, and prove both the success and the failure path before four phases depend on the transport."
trigger_phrases:
  - "cli transport proof plan"
  - "probe manual design"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: CLI transport proof

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON configuration plus TypeScript executed through Code Mode |
| **Framework** | `@utcp/cli@1.1.0`, already a dependency of the Code Mode server |
| **Storage** | None; the probe reads and returns |
| **Testing** | Observed `call_tool_chain` results, with a negative control |

### Overview

One manual, one read-only command, two calls: one that must succeed and one that must fail. The manual is a probe, not a deliverable, so it is written to be deleted.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The current manual count and the config's checksum are recorded
- [ ] The probe command is confirmed to answer without credentials
- [ ] The `cli` manual schema is read from the installed plugin, not from memory

### Definition of Done
- [ ] A Code Mode call returns MagicPath's own JSON through the manual
- [ ] A deliberately broken command reports a failure rather than empty success
- [ ] The thirteen pre-existing manuals are byte-identical to their pre-change state
- [ ] The probe is promoted or removed, with the choice recorded
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A disposable probe. The manual exists to answer one question, and the phase closes by deciding whether it becomes real or disappears.

### Key Components

- **Probe manual**: a `cli` entry naming one command, chosen because it answers without credentials.
- **Success call**: the observed result that proves the transport.
- **Negative control**: the same manual with the command broken, proving a failure is visible.
- **Config guard**: a before-and-after comparison of the untouched entries.

### Data Flow

Code Mode resolves the manual, the plugin generates a platform shell wrapper, the wrapper runs the command, stdout is parsed as JSON when detected, and the parsed object returns to the caller. Each hop is a place the chain can break, which is why the phase watches the whole chain rather than inspecting the config.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the per-task state. The work divides into three stages:

### Phase 1: Record the baseline
Capture the config's parsed manual list and a checksum before touching it, so "nothing else changed" is a comparison rather than a claim.

### Phase 2: Register and call
Add the probe, call it, and record exactly what comes back. Then break the command deliberately and record that too.

### Phase 3: Decide the probe's fate
Promote it into the phase 002 surface or remove it. Leaving an unowned probe in a shared config is how a config accumulates entries nobody can explain.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The proof is an observed call, not a passing assertion, because there is no suite covering `.utcp_config.json`. Both directions are required: a success alone cannot distinguish a working transport from a call that silently returned nothing. The negative control - the same manual with an unrunnable command - is what makes the success meaningful.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`@utcp/cli` must stay a dependency of the Code Mode server. If it is dropped, every later phase loses its transport and the packet returns to the question the parent spec opened with.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The only change is one entry in `.utcp_config.json`. Removing that entry restores the previous state exactly, and the recorded pre-change checksum proves the restoration. No other file is touched, and no MagicPath state is created, since the probe command only reads.
<!-- /ANCHOR:rollback -->

---
