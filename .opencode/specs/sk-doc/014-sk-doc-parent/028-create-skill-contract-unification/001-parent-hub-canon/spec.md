---
title: "Feature Specification: Parent Hub Canon Conformance"
description: "Bring the 7 parent hub SKILL.md files in this batch into full conformance with the parent-hub canon; each file is updated by a fresh GPT-5.6 LUNA MAX agent and independently verified by a fresh Sonnet-5 xhigh agent, then must pass its validator."
trigger_phrases:
  - "001-parent-hub-canon conformance"
  - "parent hub canon"
  - "SKILL.md conformance parent-hub-canon"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification/001-parent-hub-canon"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded conformance phase packet (planned)"
    next_safe_action: "Dispatch LUNA-MAX updates after operator go-ahead"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

# Feature Specification: Parent Hub Canon Conformance

> **Phase adjacency** (grouping order under the parent, not a runtime dependency): predecessor `000-create-skill-contract`; successor `002-sk-doc-children`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/014-sk-doc-parent/028-create-skill-contract-unification/001-parent-hub-canon |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-14 |
| **Parent Packet** | sk-doc/014-sk-doc-parent/028-create-skill-contract-unification |
| **Files in batch** | 7 |
| **Target** | the parent-hub canon enforced by `parent-skill-check.cjs` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Packet 028 defined the machine-readable create-skill contract (phase `000`, complete). This phase enforces it on a
concrete batch of 7 SKILL.md files so every skill in the batch measures against the same rules.

**Purpose:** update each file to the parent-hub canon enforced by `parent-skill-check.cjs` and prove conformance with the file's own validator. The
per-file execution contract is fixed: a **fresh GPT-5.6 LUNA MAX** agent performs the update and a **fresh
Sonnet-5 xhigh** agent independently verifies it before the validator gate runs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** the 7 files below, plus each file's own resource-doc frontmatter where the validator requires it.

| `.opencode/skills/cli-external-orchestration/SKILL.md` | Modify | Conform to parent canon |
| `.opencode/skills/mcp-tooling/SKILL.md` | Modify | Conform to parent canon |
| `.opencode/skills/sk-code/SKILL.md` | Modify | Conform to parent canon |
| `.opencode/skills/sk-design/SKILL.md` | Modify | Conform to parent canon |
| `.opencode/skills/sk-doc/SKILL.md` | Modify | Conform to parent canon |
| `.opencode/skills/sk-prompt/SKILL.md` | Modify | Conform to parent canon |
| `.opencode/skills/system-deep-loop/SKILL.md` | Modify | Conform to parent canon |

**Out of scope (deliberate):**
- Any SKILL.md not in this batch (owned by a sibling phase).
- Behavioral/routing changes — this is conformance to structure and contract, not a redesign of what a skill does.
- The advisor scorer, skill-graph, or benchmark corpora — untouched, so no re-baseline gate applies.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Each file must satisfy (per the target):

- `skill_id` equals the hub directory name; `family` is a recognized hub family
- hub declares >=1 mode; each mode has a valid shape (packet + toolSurfaces)
- hub `allowed-tools` equals the union of every mode's tool surfaces
- router `tieBreak` is an exact permutation; base outcomes are well-formed
- canonical section order + description budget hold at the hub level

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | `.opencode/skills/cli-external-orchestration/SKILL.md` conforms to parent canon and passes its validator | P0 |
| REQ-002 | `.opencode/skills/mcp-tooling/SKILL.md` conforms to parent canon and passes its validator | P0 |
| REQ-003 | `.opencode/skills/sk-code/SKILL.md` conforms to parent canon and passes its validator | P0 |
| REQ-004 | `.opencode/skills/sk-design/SKILL.md` conforms to parent canon and passes its validator | P0 |
| REQ-005 | `.opencode/skills/sk-doc/SKILL.md` conforms to parent canon and passes its validator | P0 |
| REQ-006 | `.opencode/skills/sk-prompt/SKILL.md` conforms to parent canon and passes its validator | P0 |
| REQ-007 | `.opencode/skills/system-deep-loop/SKILL.md` conforms to parent canon and passes its validator | P0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. All 7 files pass their validator (`node .opencode/commands/doctor/scripts/parent-skill-check.cjs <hub-dir>`) with zero errors/warnings.
2. Every file was updated by a fresh LUNA MAX dispatch and signed off by a fresh Sonnet-5 xhigh verify (evidence per row in `tasks.md`).
3. No file outside this batch was modified; the owning hub's regression check stays green.
4. `validate.sh --strict` is Errors 0 on this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Scope drift** — a LUNA agent edits a sibling's file. Mitigated: each dispatch is path-scoped to one SKILL.md (+ its own resources), disjoint from every other item, so parallel runs cannot collide.
- **Over-eager rewrite** — an agent rewrites routing/behavior while conforming structure. Mitigated: the Sonnet-5 verify contract rejects any semantic/behavioral change and confines diffs to contract structure.
- **Validator staleness in the worktree** — node validators run from the main tree against worktree paths (worktree lacks `node_modules`).
- **Dependency:** the create-skill contract + validators shipped in phase `000`; the hub's own checker for the regression gate.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Isolation | one SKILL.md (+ its resources) per work-item; disjoint paths |
| NFR-02 | Parallelism | >=5 concurrent work-items per wave |
| NFR-03 | Independence | the verifier is a different model family (Sonnet-5) than the updater (LUNA) |
| NFR-04 | Idempotence | re-running a conformant file is a no-op (validator already green) |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A file is **already conformant** -> LUNA makes no change; Sonnet confirms; validator green (no-op, still recorded).
- A file legitimately **cannot carry a required section** (e.g. a pure-transport packet) -> the file documents the N/A per the contract's exemption path rather than being force-fit.
- The validator flags a **pre-existing, out-of-contract** issue -> recorded as a finding, not silently "fixed" outside scope.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

None blocking. Execution is gated on operator go-ahead (see parent packet); the per-file dispatch/verify contract is fixed in `plan.md`.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Plan**: `./plan.md` (dispatch + verify harness)
- **Tasks**: `./tasks.md` (one row per file)
- **Checklist**: `./checklist.md`
- **Parent**: `../spec.md`; contract source: phase `../000-create-skill-contract/`
<!-- /ANCHOR:related-docs -->
