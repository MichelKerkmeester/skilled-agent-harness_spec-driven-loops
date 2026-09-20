---
title: "Implementation Plan: Phase 8 — End-to-end verification and closeout of the mcp-obsidian mode"
description: "Run the packet's verification gates (recursive strict validate, parent-skill-check, route-validate, advisor-recall) plus a live CLI + MCP smoke, then reconcile completion metadata across all packet docs and close out."
trigger_phrases:
  - "obsidian verification plan"
  - "mcp-obsidian closeout plan"
  - "mcp-obsidian phase 8 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/008-verification-and-closeout"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 8 verification + closeout plan"
    next_safe_action: "Run validate.sh --recursive --strict on the whole packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-verification-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8 — End-to-end verification and closeout of the mcp-obsidian mode

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Verification scripts + Bash (CLI smoke) + Code Mode (MCP smoke); no new code |
| **Framework** | spec-kit validation + `mcp-tooling` routing/advisor gates |
| **Storage** | Packet docs + `../changelog/`; no runtime state |
| **Testing** | `validate.sh --recursive --strict`, `parent-skill-check.cjs`, `route-validate.sh`, `advisor_validate`, live smoke |

### Overview
Run every gate on the completed packet (recursive strict validate, parent-skill-check, route-validate, advisor-recall), smoke both the CLI and MCP surfaces against a real vault (or record documented-unproven), optionally benchmark the mode, then reconcile completion metadata across all packet docs and write the closeout artifacts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 001–007 complete (package authored + registered + advisor-rebuilt)
- [ ] Continuity/fingerprints refreshed so `--strict` freshness passes
- [ ] Live-smoke availability known (vault + Local REST API token, or documented-unproven)

### Definition of Done
- [ ] `validate.sh --recursive --strict` on the packet exits 0
- [ ] `parent-skill-check.cjs` exit 0; `route-validate.sh` passes; advisor-recall returns `mcp-tooling`
- [ ] Live CLI + MCP smoke passes OR recorded documented-unproven with a reason
- [ ] Completion metadata reconciled; `implementation-summary.md` written; `../changelog/` refreshed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gate-then-close — run every independent verification gate, capture evidence, reconcile metadata, then write closeout docs.

### Key Components
- **Gates**: recursive strict validate + parent-skill-check + route-validate + advisor-recall.
- **Live smoke**: CLI vault op (Bash) + MCP `call_tool_chain` round-trip (Code Mode).
- **Closeout**: metadata reconciliation across packet docs + `implementation-summary.md` + changelog refresh.

### Data Flow
Completed packet → gates (pass/fail evidence) → live smoke (proven / documented-unproven) → optional benchmark → reconciled metadata → closeout artifacts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable as a runtime/policy fix — this phase runs read-only verification and writes ONLY packet documentation (`implementation-summary.md`, `checklist.md`, cross-doc completion metadata, and `../changelog/`). It adds no runtime code and makes no hub/advisor edits. The only mutation is the live-smoke CLI vault operation, which runs against an external test vault (not repo state) and is reverted or recorded documented-unproven. (All runtime surfaces were inventoried and edited in Phase 7.)
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm Phases 001–007 complete; refresh continuity/fingerprints for `--strict` freshness
- [ ] Determine live-smoke availability (vault + Local REST API token) or plan documented-unproven
- [ ] Decide whether `/deep:skill-benchmark` runs now or is deferred

### Phase 2: Core Implementation
- [ ] Run `validate.sh --recursive --strict` on the packet; resolve any freshness/structure failures
- [ ] Run `parent-skill-check.cjs` (exit 0) + `route-validate.sh`; run the advisor-recall test
- [ ] Live smoke: CLI vault op (Bash) + MCP `call_tool_chain` round-trip — or record documented-unproven with the reason
- [ ] Optional: `/deep:skill-benchmark` on the mode

### Phase 3: Verification
- [ ] Reconcile completion metadata across `spec`/`plan`/`tasks`/`checklist`/`implementation-summary` (no conflicting states)
- [ ] Write `implementation-summary.md` with verification evidence + final state
- [ ] Refresh `../changelog/`; final continuity save
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Doc | Whole packet structure + freshness | `validate.sh --recursive --strict` |
| Routing | Hub consistency + mode routing | `parent-skill-check.cjs`, `route-validate.sh` |
| Advisor | Recall returns `mcp-tooling` for obsidian prompts | `advisor_status`, `advisor_validate` |
| Live smoke | CLI vault op + MCP round-trip | Bash, Code Mode `call_tool_chain` |
| Benchmark | Mode behavior (optional) | `/deep:skill-benchmark` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001–007 | Internal | Green | Nothing to verify until the mode ships + registers |
| Obsidian vault + Local REST API token | External | Yellow | No live smoke → documented-unproven |
| `validate.sh` / `parent-skill-check.cjs` / `route-validate.sh` | Internal | Green | No gate evidence without them |
| `/deep:skill-benchmark` | Internal | Green | Optional; defer if unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate fails (validate/parent-skill-check/route-validate/advisor-recall) or the live smoke reveals a broken surface.
- **Procedure**: this phase writes only docs — no runtime to revert. Route any surfaced defect back to its owning phase (003/004 for a tool bug, 007 for a routing/advisor regression) rather than patching here; re-run the gates after that phase's fix. Closeout stays blocked until P0 gates are green.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
