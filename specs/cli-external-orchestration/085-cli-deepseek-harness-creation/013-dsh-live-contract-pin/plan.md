---
title: "Implementation Plan: Phase 13: dsh-live-contract-pin"
description: "Reconcile the saved dsh route probes, promote only the verified LLM Gateway model and record OpenCode Go as configured, not verified. Update the route references, confinement caveat and re-pin runbook."
trigger_phrases:
  - "dsh live contract pin plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 13: dsh-live-contract-pin

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | bash probes, `dsh` 0.2.2-rc.1 headless, YAML patches, TypeScript config |
| **Framework** | DeepSeek Harness headless profile, system-deep-loop fan-out |
| **Storage** | Evidence files in this phase folder, disposable `DSH_HOME` directories under `mktemp -d` |
| **Testing** | Live probes with exit status and `final.reason.kind` checks, `fanout-run.cjs` containment scan |

### Overview
The saved probes show one completed LLM Gateway turn and two completed Gateway lineages. OpenCode Go received no request because its key was unset, so it stays configured, not verified. This phase updates runtime defaults and the packet to match those route-specific results.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] The operator keyed the LLM Gateway route, confirmed by the saved completed run without reading the key

### Definition of Done
- [x] All acceptance criteria met
- [x] The keyed LLM Gateway route has a saved exit 0 run with `final.reason.kind` `completed`; OpenCode Go is recorded as configured, not verified
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-first live verification.

### Key Components
- **Route patches**: `.dsh/patches/route-*.patch.yml` select provider and model, corrected only from evidence.
- **Disposable home**: a fresh `DSH_HOME` per probe keeps `~/.dsh` untouched.
- **Promotion switch**: the default allowlist and preventive-sandbox capability in `executor-config.ts`, flipped per proven route.

### Data Flow
The saved Gateway run used the route, lineage and guards patches with a fresh `DSH_HOME`; its stdout, stderr and exit status are in `evidence/`. OpenCode Go had no request because its key was unset. The observed results feed the packet references, runtime default and live-contract entry.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: this phase verifies a new runtime and fixes no reported finding.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the Gateway key confirmation and the `~/.dsh` baseline. Implementation uses the saved probes, with OpenCode Go unverified. Verification promotes only the Gateway model, records the temp-dir caveat and writes the runbook.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The `executor-config.ts` allowlist change | Phase 006 vitest suites |
| Integration | One deep-research lineage through the kind | `fanout-run.cjs` and its containment scan |
| Manual | Saved route, confinement, `bash echo ok` and `max` reasoning probes | Existing phase evidence; no new live probe is run during this update |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Provider keys | External | Partial | LLM Gateway completed. OpenCode Go key was unset, so its route remains configured, not verified |
| `006-deep-loop-executor-kind` | Internal | Validated | Strict phase validation passed and the requested focused suites are rerun here |
| `008-dsh-repo-guards-safety-wave` | Internal | Guard evidence available | Bundle tests and boot evidence are present; broader packet closeout remains separate |
| LLM Gateway and OpenCode Go availability | External | LLM Gateway verified, OpenCode Go not verified | Only the verified Gateway model is promoted |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a promoted route fails a later run, or the confinement probe shows a write outside the workspace.
- **Procedure**: `git revert <sha>` on the promotion commit so the kind leaves the default allowlist, and mark the route "configured, not verified" in the packet. Delete the disposable `DSH_HOME` directories with `rm -rf` on their `mktemp` paths.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (key gate and `~/.dsh` baseline) | Phases 006 and 008, operator key | Implementation |
| Implementation (per-route probes) | Setup | Verification |
| Verification (promotion and runbook) | Implementation | Phase 014 "supported" wording |
<!-- /ANCHOR:phase-deps -->

---
