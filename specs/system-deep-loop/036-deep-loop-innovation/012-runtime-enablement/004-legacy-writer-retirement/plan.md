---
title: "Implementation Plan: Legacy Writer Retirement"
description: "Plan for removing the direct-append write paths, enforcing their absence, and confirming every legacy file is still produced by the projection."
trigger_phrases:
  - "legacy writer retirement plan"
  - "direct append removal plan"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/004-legacy-writer-retirement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/004-legacy-writer-retirement"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Planned retirement in three phases"
    next_safe_action: "Inventory every direct-append path across the tree"
    blockers:
      - "Predecessor 003-fleet-enablement must pass first"
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Legacy Writer Retirement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Seven mode protocol sets, direct-append code paths, a new enforcement guard |
| **Change class** | Removal plus enforcement |
| **Authority** | Unchanged; this phase removes the losing writer, not the winner |
| **Blast radius** | Medium: the files stay, the writers go, the consumers must not notice |

The distinction this phase turns on: retiring a writer is not deleting a file.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command | Blocking |
|------|---------|----------|
| Predecessor | `003` complete, all seven modes on ledger authority | Yes |
| Tree-wide search, docs | No direct-append instruction remains | Yes |
| Tree-wide search, code | No reachable direct-append path remains | Yes |
| Enforcement fires | A real attempted direct append fails | Yes |
| File production | Every manifest-named legacy file exists and is current post-retirement | Yes |
| Consumer contracts | Every consumer runs post-retirement | Yes |
| Spec validation | `validate.sh <this folder> --strict` Errors: 0 | Yes |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Retirement has two halves that are easy to conflate and must not be.

The **writer** goes: protocol documents stop instructing a direct append, and executable direct-append paths are
removed or neutralised. After this, nothing but the gateway writes mode state.

The **file** stays: the projection continues to materialise it from ledger events, at the manifest's declared refresh
boundary. Its consumers are unchanged and unaware.

The enforcement guard exists because removal alone is not durable. Code gets copied back, instructions get restored
from an old draft, a script survives in a branch. A guard that fails on a direct append converts a silent reintroduction
into an immediate failure, which is the only version of this that stays true over time.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Inventory every direct-append path across the whole skill tree — protocol documents and executable code both — rather than only the ones this epic has already touched.
- Capture, per mode, the current contents of every manifest-named legacy file so post-retirement production can be compared rather than assumed.
- Capture authority record bytes for all seven modes.

### Phase 2: Implementation
- Remove direct-append instructions from every mode's protocol documents.
- Remove or neutralise each executable direct-append path, recording per path which was done and why.
- Add the enforcement guard that detects and fails a direct append after retirement.

### Phase 3: Verification
- Re-run the tree-wide searches and confirm nothing remains, including in files this phase did not edit.
- Attempt a real direct append and confirm the guard fires.
- Run each mode and confirm every manifest-named legacy file exists and is current.
- Run every consumer of every legacy file; record exit statuses.
- Diff all seven authority records against the Phase 1 capture.
- Re-run the full suite and report the delta; run strict packet validation.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The enforcement test is the one that cannot be skipped. A guard that has never been observed firing is indistinguishable
from a guard that does not work, and this epic has already produced findings of exactly that shape — tests that named a
surface without exercising it, and a parity oracle that could not have gone red.

File production is checked per mode against the Phase 1 capture. Checking that a file merely exists would pass on a
stale file left over from before retirement, which is precisely the failure mode being guarded against.

Consumer runs are executed, not reasoned about. The consumer list comes from the manifest per mode.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | State | Note |
|------------|-------|------|
| `003-fleet-enablement` | Predecessor | All seven modes must be on ledger authority first |
| Projection engine and manifest | Landed | Sole producer of the legacy files after this phase |
| Append gateway | Landed in `001` | Sole writer of mode state after this phase |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

None by policy, consistent with the rest of this packet.

Worth stating plainly: this phase is the one where the old path stops existing, so it is also the point after which
"go back to the legacy writer" stops being a coherent idea even informally. That is the intended end state — a single
writer — and it is why the fleet phase's per-mode gates run before this one rather than after.
<!-- /ANCHOR:rollback -->
