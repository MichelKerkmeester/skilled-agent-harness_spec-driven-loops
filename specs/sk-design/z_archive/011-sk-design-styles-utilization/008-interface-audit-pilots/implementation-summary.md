---
title: "Implementation Summary: interface + audit contrasting pilots"
description: "The two contrasting styles-library pilots are built and verified: design-interface as a relational-exemplar pilot with a typed decision-only handoff, and design-audit as a non-authoritative comparison lane. Both consume the phase-007 seam and enforce the fixed authority order through closed typed schemas. 36/36 tests pass after an adversarial review closed four authority/override bypasses."
trigger_phrases:
  - "interface audit pilots summary"
  - "styles library consumers status"
  - "relational exemplar comparison lane status"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/008-interface-audit-pilots"
    last_updated_at: "2026-07-18T19:05:14Z"
    last_updated_by: "claude"
    recent_action: "Built and verified both pilots; 36/36 tests pass, authority order enforced by typed schemas"
    next_safe_action: "Extend the pattern to foundations + motion in phase 009"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-interface-audit-011-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The audit lane cannot represent a verdict/severity/proof — a closed typed schema forbids it."
      - "The interface pilot rejects any decision targeting a locked authority; preservation is computed, not asserted."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

> **Complete — built, adversarially reviewed, and verified.** `node --test` is 36/36 across both pilot suites.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-interface-audit-pilots |
| **Status** | Complete — implemented, reviewed, verified |
| **Level** | 3 |
| **Estimated Effort** | ~14–23 engineer-days (two pilots) |
| **Depends On** | `../004-retrieval-substrate/`, `../007-shared-context-seam/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two contrasting pilots that consume the styles library through the phase-007 seam, each proving a distinct integration shape while enforcing the fixed authority order via closed typed schemas.

- **design-interface** — a relational-exemplar pilot: retrieve one coherent anchor plus an optional bounded contrast / rejected-default, and produce a relational exemplar with a **typed, decision-only handoff** (no raw hydrated content, no source literals or prose).
- **design-audit** — a comparison lane: 0–2 comparison references consumed as **non-authoritative** context, intended-anchor drift bound to owned-system identity, and evidence labels. The audit schema structurally cannot express a severity/verdict, a WCAG/performance proof, a copying determination, an exact-reuse authorization, or a fix owner.

Also encodes three corpus uses: falsification infrastructure, counterfactual critique (bound to emitted decisions), and a maintainer fixture atlas.

### Files Created / Modified

| File | Action | Result |
|------|--------|--------|
| `design-interface/corpus/relational-exemplar.mjs` | Create | Anchor + bounded contrast retrieval, immutable authority locks, typed decision-only handoff |
| `design-interface/corpus/__tests__/**` | Create | Adversarial fixtures + tests (locked-authority override, handoff leak, counterfactual) |
| `design-interface/SKILL.md`, `README.md` | Modify | Seam wiring + explicit execution-consumer boundary |
| `design-audit/corpus/comparison-lane.mjs` | Create | Closed typed comparison schema, verified intended-anchor identity, fail-closed unavailability |
| `design-audit/corpus/__tests__/**` | Create | Adversarial fixtures + tests (verdict-in-value, self-asserted anchor, unavailable) |
| `design-audit/SKILL.md`, `README.md` | Modify | Seam wiring + explicit execution-consumer boundary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built by a `cli-codex gpt-5.6-sol` (high, fast) implementer to `spec.md`/`plan.md`/`tasks.md` in an isolated worktree, consuming the phase-004 engine and the phase-007 seam. A `gpt-5.6-sol` xhigh-fast adversarial reviewer ran live calls and found the authority guards were LEXICAL (keyword/denylist) and therefore bypassable — an audit reference could emit a verdict in a value field, and an interface decision could target a locked authority, both returning success. A scoped fix pass replaced the lexical approach with closed typed schemas: the audit comparison schema cannot represent authoritative claims; intended-anchor drift requires a verified owned-system identity; interface decisions carry immutable authority locks and are rejected if they target one; the handoff is a typed decision-only envelope; counterfactual axes bind to emitted decisions; and unavailability fails closed to a validated negative outcome. Scope stayed locked to `design-interface/**` and `design-audit/**`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Closed typed schemas, not lexical guards | Keyword/denylist filtering is bypassable; a typed schema that cannot represent a verdict/override is enforcement, not theater (ADR-001) |
| Audit corpus is strictly non-authoritative | It never assigns severity/score, proves a11y/perf, determines copying, authorizes reuse, or owns fixes (ADR-002) |
| Interface handoff is typed and decision-only | No raw hydrated content, source literals, or prose cross the boundary (ADR-003) |
| Intended-anchor drift requires verified identity | A self-asserted anchor cannot masquerade as authoritative (ADR-004) |
| Negative outcomes fail closed | no-fit / comparison-unavailable are validated evidence, never thrown errors |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Run by the implementer and independently re-run by the orchestrator (writable checkout; the harness uses `mkdtemp`).

| Check | Result |
|-------|--------|
| Test suite | VERIFIED: `node --test` 36/36 pass (18 interface + 18 audit; up from 20 pre-fix) |
| Audit authority (typed) | VERIFIED: a severity/WCAG/reuse claim in any value slot, and an added free-text claim field, are both rejected |
| Intended-anchor identity | VERIFIED: a self-asserted or mismatched intended anchor is rejected; drift needs an owned-system ID + content-hash match |
| Interface non-override | VERIFIED: a decision targeting locked navigation/target/preflight is rejected; preservation is computed |
| Decision-only handoff | VERIFIED: oklch/%/gradient/font-name/named-color/source-prose are rejected from the handoff |
| Negative-outcome fail-closed | VERIFIED: missing/stale manifests yield validated `no-fit` / `comparison-unavailable`, not a thrown error |
| Scope | VERIFIED: changes only under `design-interface/**` + `design-audit/**` |
| Packet validity | VERIFIED: `validate.sh 008-interface-audit-pilots --strict` → Errors 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Opt-in execution via an explicit consumer.** The read-only modes (Read/Grep/Glob) do not run the pilots themselves; a Bash-capable consumer (the sk-code runtime, or the test harness) executes the deterministic pilot module and receives the bounded handoff. This keeps both pilots behind an explicit, opt-in boundary rather than the default mode path.
2. **Foundations + motion deferred.** `design-foundations` and `design-motion` integration is phase 009; the Open Design transport is a later phase.
3. **Shared fields stabilized against two consumers only.** The phase-007 field set was exercised by interface + audit; the relationship-heavy modes in 009 may surface further reuse.
<!-- /ANCHOR:limitations -->
