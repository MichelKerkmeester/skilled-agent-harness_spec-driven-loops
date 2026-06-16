---
title: "Implementation Summary: Machine-checkable evidence contract (Complete)"
description: "Five-field evidence contract validated non-blockingly at post-dispatch: absent metadata passes silently, malformed metadata warns, the verdict stays ok:true by default. Schema module + advisory wiring + agent-io-contract doc shipped and proven by vitest."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/149-operate-like-fable-5/009-evidence-contract"
    last_updated_at: "2026-06-16T05:00:00Z"
    last_updated_by: "opus-agent"
    recent_action: "Shipped advisory evidence-contract validator; absent passes, malformed warns; tests green"
    next_safe_action: "Orchestrator reconciles the 149 parent map"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/evidence-contract.ts"
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts"
      - ".opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-009-evidence-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-evidence-contract |
| **Status** | Complete |
| **Completed** | 2026-06-16 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

A load-bearing claim at the dispatch boundary now has a fixed, machine-checkable shape to carry its proof in. A new `evidence-contract.ts` module defines the five fields — `claim_class`, `would_confirm`, `gate_delta`, `scope_state`, `child_result_verified` — with allowed enum values for `claim_class` and `scope_state`, and exports `validateEvidenceContract(input)` that classifies any input as `absent`, `present`, or `malformed` plus per-field issues. The validator never throws and treats field values as inert data, never interpreting them.

### Machine-checkable evidence contract

`post-dispatch-validate.ts` calls the validator on the parsed iteration record's `evidence` field and maps a `malformed` result to `PostDispatchAdvisory` warnings on the existing `warnings` channel, naming the offending `evidence.<field>` path. No new `PostDispatchFailureReason` was added, so the verdict stays `ok: true` in every case the contract touches. The backward-compatibility guarantee is concrete: a record with no `evidence` field classifies as `absent` and produces no warning, so a legacy exchange still passes. A `malformed` payload (partial field set, wrong type, or unknown enum value) warns but never blocks.

Enforcement mirrors the existing v2 off/warn/strict pattern via `DEEP_LOOP_EVIDENCE_ENFORCEMENT`, defaulting to `warn` (advisory). `off` suppresses the advisories; `strict` marks them distinctly but still does not block, because no blocking failure reason is defined for evidence yet — any promotion to blocking is a separate, baseline-gated decision. The contract is documented as a new `AGENT_IO_EVIDENCE v1` optional group in `agent-io-contract.md`, consistent with the other `AGENT_IO_*` groups, and that doc defers to the schema module as the source of truth for allowed values. The existing `computeBehavioralAdvisories` helper and its best-effort advisory push were preserved untouched.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Shipped advisory-only. The schema module landed first with its own unit suite covering present / absent / malformed plus per-field type and enum cases, then the validator was wired into `post-dispatch-validate.ts` and proven by three new integration cases: present-and-valid passes with no evidence warning, present-and-malformed warns while staying `ok: true`, and absent passes with no evidence warning. The full deep-loop-runtime suite stayed green after the wiring, confirming no existing post-dispatch behavior regressed. The change adds no failure reason and no producer depends on the contract, so rollback is removing the single validator call.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Ship the contract as advisory metadata, not a blocking gate | Keeps a valid exchange that omits the fields passing, satisfying the hard backward-compatibility criterion (ADR-001). |
| Reuse the existing `PostDispatchAdvisory` warning channel | Avoids a parallel mechanism and a new failure surface for an in-memory schema check. |
| Sequence this phase last | It is the largest, most structural item and builds on phases 003 (measurement) and 008 (provenance). |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

Evidence pinned to the working tree at base SHA `ff7b28ebcd` plus the uncommitted edits in this packet (not yet committed).

| Check | Result |
|-------|--------|
| Spec-folder strict validation | PASS (`validate.sh --strict`, exit 0). |
| Unit suite `evidence-contract.vitest.ts` | PASS, 8/8 (present / absent / partial-malformed / wrong-type / unknown-enum x2 / inert-data). |
| Integration cases in `post-dispatch-validate.vitest.ts` | PASS, 3/3 (valid present passes, malformed warns + ok:true, absent passes). |
| Full `deep-loop-runtime` suite | PASS, 376 passing — no regression in existing post-dispatch behavior. |
| Grep proof of the five fields | The field names now resolve in `evidence-contract.ts` and `agent-io-contract.md`; previously zero hits in `deep-loop-runtime`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Advisory only.** The contract warns but never blocks, so it will not force producers to fill the fields. A later phase must retrofit the agent prompts and mirrors to emit the metadata.
2. **Producers out of scope.** This phase defines and validates the contract; no agent currently emits the five fields, so warnings will be common until adoption.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

