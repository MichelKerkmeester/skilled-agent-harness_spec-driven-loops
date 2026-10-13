---
title: "Decision Record: Surface tie order warning"
description: "Where check 5l reads which sk-code surface is native and which are examples, and why it reports as a soft failure."
trigger_phrases:
  - "surface tie order warning decision record"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "scaffold/027-surface-tie-order-warning"
    last_updated_at: "2026-10-13T15:21:05Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded the source-of-truth and severity decisions"
    next_safe_action: "None; both decisions are accepted"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-027-surface-tie-order-warning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Surface tie order warning

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Name the native and example surfaces in the doctor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-13 |
| **Deciders** | Phase orchestrator, from the operator's stated intent |

---

<!-- ANCHOR:adr-001-context -->
### Context

Check 5l has to know which sk-code surface is native and which two are the operator's examples. `mode-registry.json` carries `workflowMode` and `packetKind` for each mode and no native or example marker, and `hub-router.json` carries none either. The check needs one source of truth for three names.

### Constraints

- `prevent-overengineering.md` binds: no field, option or abstraction that a current requirement does not earn.
- A registry or router field has to be written by `/create:skill-parent`, read by the doctor and kept by any user who hand-edits the hub, so it touches the scaffold twins, the schema references and both JSON files.
- Only one hub, sk-code, ships a native surface today.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: two constants in `parent-skill-check.cjs`, `SK_CODE_NATIVE_SURFACE` and `SK_CODE_EXAMPLE_SURFACES`, read by check 5l, which runs only when the hub folder is named `sk-code`.

**How it works**: 5l finds `sk-code-opencode` in `routerPolicy.tieBreak` and takes every mode after it whose registry `packetKind` is `surface` and whose name is not one of the two examples. Any such mode is a soft failure naming both fixes; none is a PASS line.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Doctor constants scoped to sk-code** | One file; nothing for the scaffold or a user to write; follows the hub-scoped `VOCABULARY_PARITY_WARN_ONLY` constant already in the doctor | The names live in code, not in the hub's data | 8/10 |
| A `nativeSurface` or `example` field in `mode-registry.json` | The hub describes itself | The scaffold twins, two schema references and the registry validator must learn it; a user who deletes the examples must also keep it right; no second hub needs it | 4/10 |
| A field in `hub-router.json` `routerPolicy` | Next to `tieBreak` | The same writer and reader cost, and 5k-style parity checks would need to learn it | 4/10 |

**Why this one**: three fixed names on one hub do not earn a schema field. If a second hub ships a native surface, that is the moment to move the names into its registry.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A hand-added surface after `sk-code-opencode` is reported, with no change to any file a user edits.

**What it costs**:
- Renaming `sk-code-opencode` or an example means editing the constants. Mitigation: the README calls the native surface one to keep, and a rename already touches many files.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A user keeps an example under a new name after opencode | L | 5l reports it as a user surface, which matches the intent |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Today a hand-added surface after opencode passes the doctor silently |
| 2 | **Beyond Local Maxima?** | PASS | Registry and router fields were weighed above |
| 3 | **Sufficient?** | PASS | Two constants and one function |
| 4 | **Fits Goal?** | PASS | It is the check the phase exists to add |
| 5 | **Open Horizons?** | PASS | Moving the names into a registry later changes only where 5l reads them |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `parent-skill-check.cjs`: the two constants, `checkNativeSurfaceLast`, and its call after `checkTieBreakOrder` in `checkHubRouter`.

**How to roll back**: revert the phase's build commit; no data file carries the names.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Report 5l as a soft failure

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-13 |
| **Deciders** | Phase orchestrator |

---

<!-- ANCHOR:adr-002-context -->
### Context

The doctor has three verdicts that matter here. `softFail` prints FAIL and counts toward exit 1 under the default strict canon, and prints WARN when `PARENT_HUB_CHECK_STRICT=0`. `warn` always prints WARN and leaves the exit code at 0. Its neighbours 5e (tieBreak is a permutation) and 5i (workflow modes first) both use `softFail`. The only `warn` in the 5x range is the 5k parity leg for hubs listed in `VOCABULARY_PARITY_WARN_ONLY`, which tolerates drift those hubs already carry.

### Constraints

- The root README's sk-code guide ends with a verify block whose first line is the sk-code doctor and says each command must exit 0. A plain warning exits 0, so a user who follows the guide would not see it.
- The operator's own repository must stay green.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: `softFail`, the same verdict as 5e and 5i.

**How it works**: a user surface after `sk-code-opencode` prints `FAIL: 5l: ...` and the doctor exits 1; with `PARENT_HUB_CHECK_STRICT=0` it prints `WARN: 5l: ...` and exits 0.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **softFail** | Matches the two tieBreak neighbours; the README verify step catches it; work-in-progress hubs can opt down | A user mid-edit sees red | 8/10 |
| warn | Never blocks | Exit 0, so the README verify battery passes and the gap the phase closes stays open | 3/10 |

**Why this one**: the gap is that nothing signals; a WARN that exits 0 under the documented verify step is close to the same silence.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The README's verify step fails on the misplacement and names the fix.

**What it costs**:
- A sk-code fork that deliberately ranks its own surface below opencode must set `PARENT_HUB_CHECK_STRICT=0` or accept the red line. Mitigation: the operator's intent is that no user surface ranks below opencode.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| CI for the operator's repository goes red | L | The shipped order passes; the test pins it |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A severity has to be chosen |
| 2 | **Beyond Local Maxima?** | PASS | `warn` was weighed against the README verify step |
| 3 | **Sufficient?** | PASS | Reuses the existing `softFail` helper |
| 4 | **Fits Goal?** | PASS | Makes the report reach the user |
| 5 | **Open Horizons?** | PASS | The strict switch already gives an opt-down |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `checkNativeSurfaceLast` calls `softFail` for a misplaced surface and `pass` otherwise.

**How to roll back**: change the one `softFail` call to `warn`.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
