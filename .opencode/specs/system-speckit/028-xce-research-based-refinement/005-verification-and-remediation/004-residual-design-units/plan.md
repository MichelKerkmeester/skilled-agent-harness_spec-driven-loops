---
title: "Implementation Plan: Residual 029 Design Units"
description: "Sequences the three residual design units (vector truth, replay pool, launcher parity) per the AI Council roadmap, each behind its own safety gate, with the launcher port last as the highest-blast-radius work."
trigger_phrases:
  - "residual design units plan"
  - "vector reconcile plan"
  - "replay pool plan"
  - "launcher parity plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/005-verification-and-remediation/004-residual-design-units"
    last_updated_at: "2026-06-13T14:30:00Z"
    last_updated_by: "scaffold-author"
    recent_action: "Sequenced 3 units behind safety gates from council roadmap"
    next_safe_action: "Operator review; then write Unit A design note"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:b3db1ff916fb4c6f23bce7c21683241320a90f4d5e406396002455b735916221"
      session_id: "030-scaffold-populate-2026-06-13"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Residual 029 Design Units

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
| **Language/Stack** | TypeScript (mcp_server) + CommonJS launchers (`.cjs`) |
| **Framework** | better-sqlite3 vector store; daemon launcher/proxy supervision |
| **Storage** | SQLite vector surfaces (`vec_<dim>` BLOB payload + `vec_memories` vec0 index) |
| **Testing** | vitest (mcp_server combined config); live-daemon adoption harness |

### Overview
Ship three residual design units, each gated by its own safety contract and preceded by a design note. The AI Council report (`029-deep-research-remediation/ai-council/council-report.md`) is the design reference: sequence vector-truth first (it pairs with the already-shipped tri-105 health), then the replay pool, then the launcher port last because it carries the highest blast radius (3x historical dual-writer DB corruption).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Design-unit decomposition: each unit is a self-contained design-doc-then-implement slice with an explicit safety gate, rather than a flat finding list.

### Key Components
- **Unit A — Vector storage truth**: backup + daemon-quiesce + per-class reconcile of the active surface vs `vec_memories` divergence (~314 rows across 3 classes).
- **Unit B — Shadow/feedback + replay pool**: hash-class synthetic corpus builder + shadow-evaluation scheduler integration, with the no-raw-query-text invariant; folds Cluster B/C remnants.
- **Unit C — Launcher parity**: port of the spec-memory packet-140 supervision scaffold into `mk-code-index-launcher.cjs`, gated by the live-daemon adoption harness, or a recorded document-the-asymmetry decision.

### Data Flow
Unit A consumes the shipped divergence-health surface, adjudicates each divergence class, then mutates the backed-up, quiesced store. Unit B samples eval queries by `query_hash`/intent into a synthetic corpus the scheduler replays. Unit C's launcher supervises the code-index daemon child through crash-loop, owner-disposal-race, backoff, and reap states.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Vector store (`vec_<dim>` BLOB, `vec_memories` vec0) | Active query surface + derived index | Unit A reconciles divergence after backup+quiesce | Per-class count adjudication; post-reconcile health surface clean |
| `memory_index` success rows | Truth set for which memories should have vectors | Unit A adjudicates 5 missing-success + 308 non-success | Counts reconcile against the success set |
| shadow-evaluation scheduler | Emits typed `no-replay-pool` skip today (honesty half shipped) | Unit B integrates the synthetic corpus | Scheduler replays the corpus; typed skip only when corpus empty |
| consumption_log / privacy test | Bans raw `query_text` permanently | Unit B keys corpus on hash/intent only — not a consumer of raw text | `consumption-logger-privacy.vitest.ts` still asserts absence |
| `mk-code-index-launcher.cjs` | Owner-attached, EXITs on child SIGTERM (no front-proxy) | Unit C ports packet-140 scaffold OR documents the asymmetry | Live-daemon adoption harness proves no flap, or recorded decision |
| spec-memory launcher supervision | Reference implementation (transparent recycle) | Source of the port — unchanged | Parity diff against the proven scaffold |

Required inventories:
- Same-class producers: `rg -n 'shouldAbortRelaunchOnFire|crash-loop|relaunch|process-group' .opencode/bin .opencode/skills/*/mcp_server`.
- Consumers of changed symbols: `rg -n 'vec_768|vec_memories|getActiveVectorSourceForQuery|query_hash' . --glob '*.ts' --glob '*.cjs' --glob '*.md'`.
- Matrix axes: Unit A divergence classes (orphan / non-success-with-vector / missing-success) x reconcile decision (prune / re-embed / adjudicate-keep).
- Algorithm invariant: Unit B — no raw query text is ever stored; corpus keys are `query_hash`/intent only, and the privacy test must still pass after the build.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Operator decisions captured for the three escalation questions (Unit A per-class, Unit B corpus model, Unit C parity-vs-document)
- [ ] Design notes drafted per unit before any code
- [ ] Safety harnesses identified (backup procedure, privacy test, live-adoption harness)

### Phase 2: Core Implementation
- [ ] Unit A: vector reconcile (backup -> quiesce -> per-class reconcile -> health re-check)
- [ ] Unit B: hash-class synthetic replay corpus + scheduler integration + Cluster B/C remnants
- [ ] Unit C: launcher parity port (gated by adoption harness) OR recorded document-the-asymmetry decision

### Phase 3: Verification
- [ ] Each unit verified against its safety gate (backup+quiesce for A, privacy invariant for B, no-flap harness for C)
- [ ] Defer-by-design bucket and L9/L2 tail tracked; L9/L2 items re-confirmed before any implementation
- [ ] Documentation updated (spec/plan/tasks + parent phase-map row 30)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Reconcile per-class logic; corpus key shape; launcher supervision predicates | vitest (mcp_server combined config) |
| Integration | Shadow scheduler replaying the corpus; launcher child lifecycle | vitest + live-daemon adoption harness |
| Manual | Backup/quiesce dry-run for Unit A; flap observation for Unit C | Daemon ops + health surface inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| tri-105 divergence health (shipped `c86424df8a`) | Internal | Green | Unit A loses its measurement baseline |
| tri-007/008/009 honesty half (shipped `6cbb7b457c`) | Internal | Green | Unit B loses its integration point |
| spec-memory packet-140 supervision scaffold | Internal | Green | Unit C loses its reference implementation |
| Live-daemon adoption test harness | Internal | Yellow | Unit C cannot prove no-flap; falls back to document-the-asymmetry |
| Operator escalation decisions (3 questions) | External | Yellow | Units A/B/C cannot start their builds |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Unit A reconcile corrupts the store, Unit B leaks raw text (privacy test fails), or Unit C reintroduces the flap under the adoption harness.
- **Procedure**: Unit A restores from the pre-mutation backup and re-quiesces; Unit B reverts the corpus build and keeps only the shipped honesty patch; Unit C withdraws the launcher change and falls back to the documented asymmetry.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
