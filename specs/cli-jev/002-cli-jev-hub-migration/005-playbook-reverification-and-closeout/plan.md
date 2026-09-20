---
title: "Implementation Plan: Phase 5: playbook-reverification-and-closeout"
description: "Run the transport's 22 scenarios and the hub's routing corpus from the migrated home, record the runs, reconcile the living docs with what was observed, regenerate the derived surfaces the edits feed, and close the program."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "execution phases"
  - "quality gates"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/002-cli-jev-hub-migration/005-playbook-reverification-and-closeout"
    last_updated_at: "2026-09-20T16:30:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Phase plan authored at closeout from the executed run"
    next_safe_action: "Operator decision: commit the working tree, or leave it uncommitted"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-005-playbook-reverification-and-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: playbook-reverification-and-closeout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, POSIX shell, Python 3, Node.js |
| **Framework** | The skill-doc playbook contract plus the compiled-routing CLI |
| **Storage** | The `jev` credential store, the benchmark report folders, the frontmatter-version manifest |
| **Testing** | The 22-scenario transport corpus, the three-scenario hub corpus, the dispatch-gate probes, both fleet suites |

### Overview
Run first, write second. The corpora are executed against the live front door and the live binary, their streams are captured to files that stay beside the report, and only then are the living docs edited — because the point of the phase is that the observations decide the wording. The derived surfaces are regenerated last, over the final bytes, so no generated artifact lags the docs it derives from.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

**Definition of Ready**
- [x] The hub resolves through compiled policy and the old hub is decoupled (phase 004 closed)
- [x] `jev 0.6.2` resolves on `PATH` and the `official` credential is in the store
- [x] The recorded baseline matrices exist, so the no-key half is a comparison rather than a fresh judgement

**Definition of Done**
- [x] All 22 transport scenarios and all three hub scenarios executed with observed output
- [x] Both runs recorded as dated reports with their raw captures
- [x] Living docs reconciled: run records, run index, the refused command, the one overclaim
- [x] Derived surfaces regenerated and verifying
- [x] Both packets validate with `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Observe, record, then reconcile. Each corpus is executed by a script that keeps the run reproducible and the captures inspectable; the report cites the captures rather than paraphrasing them; the docs are edited only where an observation contradicts them.

### Key Components
- **Capture scripts** — one per half, writing `###`-labelled blocks of command, exit status, stdout and stderr.
- **Comparison scripts** — field-by-field comparison against the recorded baseline, normalizing only the scratch path so a difference means a real difference.
- **The value-blind leak check** — intersects each capture's token set with the credential store's token set and prints counts, never values.
- **The dispatch-preflight probe** — feeds Claude-shaped tool calls to the lint to observe which of the eight declared rules decide, and at which severity.

### Data Flow
label → probe script → raw capture → comparison or report → living doc edit → derived regeneration → packet validation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Phase 1: Execute the transport corpus (no-key half under an isolated store, then the credential-gated half), compare each half against its recorded baseline, run the two dispatch-guard suites on the live files only.
Phase 2: Execute the hub routing corpus against the compiled front door, including the kill-switch control and one end-to-end judgment through the resolved packet; re-probe the dispatch gates.
Phase 3: Author both reports, reconcile the living docs, regenerate the derived surfaces, run the gate matrix and validate both packets.

Task-level detail lives in [tasks.md](./tasks.md).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Level | Scope | Method |
|-------|-------|--------|
| Unit | Dispatch rules and audit shapes | `node --test` and `vitest` against the live files, with quarantine and worktree copies excluded |
| Integration | The two corpora | The capture scripts, compared field by field against the recorded baseline |
| End-to-end | Route → packet → judgment | A `jev` judgment executed from the hub's own resolved route |
| Contract | Generated surfaces | The validators' own gates: leaf manifest, playbook package, catalog, doctor, freshness, admission |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `jev` 0.6.2 on `PATH`, and for the credential half a stored `official` key plus network egress.
- The compiled-routing CLI (`compiled-route`, `-admission`, `-status`, `-guard`, `-manifest`) for every routing verdict.
- The sk-doc and system-spec-kit owning scripts for every derived surface: leaf manifest, frontmatter versions, trigger index, folder descriptions, graph metadata.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Everything this phase writes is either a new report folder or an edit to a living doc, so the rollback is reversion of those files. The corpus itself mutates nothing: `jev` is read-only by contract, the credential rows only read the store, and the dispatch probes only feed stdin to a lint. The two generated surfaces roll back by re-running their own writer at the previous inputs — the frontmatter manifest is derived from the tree (and its pre-phase state is one `compute` away), and the trigger index is regenerated by its generator.
<!-- /ANCHOR:rollback -->

---

## Related Documents

- [Specification](./spec.md)
- [Tasks](./tasks.md)
- [Implementation Summary](./implementation-summary.md)
