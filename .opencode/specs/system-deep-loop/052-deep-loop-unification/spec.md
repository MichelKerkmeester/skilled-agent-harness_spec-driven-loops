---
title: "Feature Specification: Deep-Loop Unification (system-deep-loop)"
description: "Merges deep-loop-workflows (the invokable hub) and deep-loop-runtime (its backend) into one skill, system-deep-loop, then migrates every downstream reference across commands, agents, READMEs, hooks, and advisor routing."
trigger_phrases:
  - "deep loop unification"
  - "system-deep-loop merge"
  - "merge deep-loop-workflows and deep-loop-runtime"
  - "052 deep loop unification"
  - "deep-loop-runtime into deep-loop-workflows"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification"
    last_updated_at: "2026-07-08T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Phase-parent + 5 child phases scaffolded from 3 parallel sonnet-5 Plan-agent analyses"
    next_safe_action: "Launch 001-reference-research's /deep:research fanout loop"
    blockers: []
    key_files:
      - "001-reference-research/spec.md"
      - "002-hub-rename-and-runtime-nesting/spec.md"
      - "003-external-reference-migration/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Should fallback-router.ts get a real caller (phase 004) as part of this packet, or is it out-of-scope hardening tracked separately?"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Deep-Loop Unification (system-deep-loop)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-08 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | None (top-level packet in the system-deep-loop track) |
| **Parent Packet** | system-deep-loop |
| **Predecessor** | `051-deep-loop-parent-skill-alignment` (aligned `deep-loop-workflows` as an Option-E invokable hub but deliberately kept `deep-loop-runtime` separate) |
| **Successor** | None yet |
| **Handoff Criteria** | Each child phase validates independently under `validate.sh`; the parent validates recursively; `system-deep-loop` is the only skill_id for this family everywhere in the repo |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deep-loop-workflows` (the public, advisor-routable parent hub — 4 mode packets, ~1.1.0.0) and `deep-loop-runtime` (its "frozen, MCP-free backend" — v1.5.0.1, no MCP tools, own build tooling) are two separate top-level skills today, even though `051-deep-loop-parent-skill-alignment` already established that `deep-loop-workflows` is the canonical parent-skill hub example and explicitly deferred merging runtime in ("R4: runtime reconciliation... evaluate whether the deep-loop-specific advisor merged-identity layer stays required" — resolved as *keep separate*, not merge). The two skills are already tightly, bidirectionally coupled by hardcoded relative paths (confirmed: 5+ sites where runtime reaches into workflows' `shared/rollout/`, 12+ sites where workflows' mode packets reach into runtime's `lib/`), and runtime additionally borrows TypeScript tooling from a third skill, `system-spec-kit`, via relative paths. This is a distributed system pretending to be two skills; treating it as one canonical unit — `system-deep-loop` — removes the fiction.

### Purpose
Fold `deep-loop-runtime` into `deep-loop-workflows`, rename the unified result to `system-deep-loop` (matching this pre-existing spec category), repair every internal and external reference this creates, and leave the family with exactly one skill identity, one `graph-metadata.json`, and a validated, green test/routing/doctor surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Physical merge of `.opencode/skills/deep-loop-runtime/` into `.opencode/skills/deep-loop-workflows/` as a nested `runtime/` folder, with the unified skill renamed `system-deep-loop`.
- Repair of all internal bidirectional relative-path coupling (both directions) and the `system-spec-kit` tooling-borrow.
- Reference migration across `.opencode/commands/{deep,doctor}/`, `.opencode/agents/` + `.claude/agents/` (real duplicate, not symlinked), READMEs (root + skill-level), the `mk-deep-loop-guard` plugin, git hooks, CI workflow, `system-spec-kit`'s constitutional doc + test corpus, and — highest-risk — `system-skill-advisor`'s routing corpus (labeled-prompts, divergence ledger, hardcoded scorer constants).
- Version reset to `2.0.0.0` signaling the reunification; both prior `changelog/` histories preserved and frozen, one new changelog going forward.
- A `/deep:research` fanout loop (Phase 1, this packet's first child) validating and stress-testing the merge design across 3 independent model lineages before the irreversible move executes.

### Out of Scope
- Changing deep-loop's *workflow behavior* (loop semantics, convergence math, fan-out mechanics themselves) — this is a structural/identity merge, not a behavior change.
- Renaming the `/deep:*` command surface, the `@ai-council`/`@deep-research`/`@deep-review`/`@deep-improvement` agent names, or the 4 mode-packet folder names — these stay stable (Plan-agent B's recommendation: identity-only rename, freeze user-facing surfaces).
- Fully wiring `fallback-router.ts` into the fan-out dispatcher for automatic model-fallback-on-failure — real code exists but has zero callers; tracked as an optional, operator-gated phase (004), not required for the merge itself.
- Giving `deep-loop-runtime` (post-move, `runtime/`) fully independent TypeScript tooling (its own `typescript`/`@types` instead of reaching into `system-spec-kit`) — the tooling-borrow paths get fixed for the new depth, genuine decoupling is a follow-up hardening task.
- Historical `.opencode/specs/**` mentions of either old skill name (434+ in the sk-design precedent, 3622+ confirmed here) — left untouched as non-breaking history, per the established precedent.

### Files to Change
This is a phase-parent; the concrete file-change tables live in each child's own `spec.md`. At a glance: ~20 code-level path-repair sites (child 002), ~948 grep hits across commands/agents/READMEs/hooks/advisor-corpus (child 003), one small runtime module wiring (child 004, optional).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Exactly one skill identity for the family | `find .opencode/skills/system-deep-loop -iname graph-metadata.json \| wc -l` == 1; `deep-loop-workflows/` and `deep-loop-runtime/` no longer exist as top-level skill folders |
| REQ-002 | Both coupling directions (runtime→workflows, workflows→runtime) resolve at the new depth with zero broken `require()`/path literals | `grep -rn "deep-loop-workflows\|deep-loop-runtime" .opencode/skills/system-deep-loop --include="*.cjs" --include="*.ts"` returns zero hits outside changelog prose |
| REQ-003 | `runtime/`'s own vitest suite and `system-spec-kit`'s `test:council` both pass post-move | `cd .opencode/skills/system-deep-loop/runtime && npm test` green; `cd .opencode/skills/system-spec-kit/mcp_server && npm run test:council` green |
| REQ-004 | Advisor routing corpus re-baselined, not silently degraded | `score-routing-corpus.py` accuracy on the affected slice matches or exceeds the pre-merge baseline captured in child 003's Stage A |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `parent-skill-check.cjs`'s own hardcoded constants updated first | `/doctor parent-skill` self-check passes before trusting any other doctor output |
| REQ-006 | `.opencode/agents/**` and `.claude/agents/**` (real, non-symlinked duplicate) both updated | Per-file scoped grep for old names returns zero hits in both trees |
| REQ-007 | Divergence-ledger entries requiring rename get an explicit manual re-approve, not silent drift | `local-native-divergence-ratchet.vitest.ts` passes with reviewed, non-mechanical `reason` updates |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/skills/system-deep-loop --recursive` (or the skill's own `package_skill.py --check`) is clean across the unified skill and every nested packet.
- **SC-002**: A live `/deep:research` and `/deep:review` short run (or their vitest coverage) confirms the reverse-direction `require()`s resolve at actual execution time, not just statically.
- **SC-003**: Repo-wide residual grep for `deep-loop-workflows`/`deep-loop-runtime` (excluding `.opencode/specs/**` history and `.worktrees/**`) returns zero hits outside an explicit, reviewed allowlist.
- **SC-004**: This phase-parent's own `graph-metadata.json` and every sibling skill's edge pointing at the old identities is updated (`system-spec-kit`, `system-skill-advisor`, `cli-opencode`, `sk-code`, `sk-prompt` confirmed as edge holders).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Directional asymmetry: forward coupling (runtime→workflows) needs the SAME hop-count with a segment deleted, reverse coupling (workflows→runtime) needs ONE FEWER hop with a segment renamed — easy to get backwards | High — a naive "add a `..` everywhere since things nested deeper" pass silently breaks the reverse direction | Explicit before/after table per site in child 002's plan.md; exit-gate is a real `npm test` run, not just a grep |
| Risk | `system-spec-kit`'s `test:council`/vitest include-glob silently stops covering `runtime`'s tests if its 2 path edits are missed or handed to the wrong workstream | Medium — a silent coverage hole, not a loud failure | Child 002 explicitly owns these 4 edits (2 in runtime, 2 in system-spec-kit), landing in the same stage as the physical move |
| Risk | `system-skill-advisor`'s routing-accuracy corpus (labeled-prompts.jsonl, divergence ledger) encodes the old skill name as ground-truth labels; a naive full-file find/replace vs. a field-scoped one has different safety properties | Medium — could look like a real accuracy regression or silently corrupt historical narration | Child 003 Stage I: field-scoped replace on label keys only, manual re-approve for the divergence ledger per its own Rule (c) |
| Risk | Live git-tracked state (`observability-events.jsonl`, 2 SQLite writer-locked DBs) mid-move if a `/deep:*` loop is in flight | Medium — race against `cli-guards.cjs`'s writer lock | Child 002 Stage 0 quiesce check: zero stale/live writer-lock files, zero running convergence/fanout processes, before the physical move |
| Dependency | This packet's own Phase 1 (`001-reference-research`) validates the mechanical design below via 3 independent model lineages before Phase 2 executes the irreversible move | Phase 2 should not start until Phase 1's synthesis confirms or revises the plan | Sequenced explicitly: 001 → 002 → 003 → (004 optional) → 005 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `fallback-router.ts` get wired into `fanout-pool.cjs` (real code work, zero existing callers found) as part of this packet, or tracked as separate hardening? Currently scoped as optional child `004-fallback-router-wiring`, operator-gated. Phase 1's research may surface a stronger recommendation either way.
- Does a singleton `deep-loop` family still warrant a `family` tag in `skill-graph.json` once `deep-loop-runtime` stops being a separate skill_id? Deferred to whoever runs the post-merge advisor rebuild (child 003).
<!-- /ANCHOR:questions -->

---

## 8. PHASE DOCUMENTATION MAP

| Phase | Folder | Status | Summary |
|-------|--------|--------|---------|
| 1 | `001-reference-research` | Planned | 20-iteration multi-model `/deep:research` fanout validating the merge design |
| 2 | `002-hub-rename-and-runtime-nesting` | Planned | The irreversible structural move: rename + nest + repair bidirectional path coupling |
| 3 | `003-external-reference-migration` | Planned | Migrate every external reference (commands, agents, READMEs, advisor corpus) |
| 4 | `004-fallback-router-wiring` | Planned — optional | Wire `fallback-router.ts` into the fan-out dispatcher (operator-gated) |
| 5 | `005-validation-and-closeout` | Planned | Recursive strict validation + commit/push closeout |

Sequencing: 1 → 2 → 3 → 5, with 4 optional and runnable in parallel with 3 or deferred entirely.
