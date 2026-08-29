---
title: "Feature Specification: Surface-Reality Conformance"
description: "Building a cross-repo drift guard that proves every filename citation in the sk-code-obsidian packet resolves against the real plugin tree, and using it to find and repair the drift the 235-file rename left behind."
trigger_phrases:
  - "obsidian surface reality conformance"
  - "sk-code-obsidian phase 013 drift guard"
  - "scan-skill-references obsidian"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/025-sk-code-obsidian-surface/013-surface-reality-conformance"
    last_updated_at: "2026-08-29T00:05:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Surface-reality conformance guard + repair"
    next_safe_action: "None — this is the packet's final planned phase"
    blockers: []
    key_files:
      - "../../../tools/naming/scan-skill-references.mjs"
      - "../../../../Code_Environment/Public/.opencode/skills/sk-code/sk-code-obsidian/references/skill-reference-integrity.md"
      - "../../../../Code_Environment/Public/.opencode/skills/sk-code/sk-code-obsidian/SKILL.md"
      - "../../../../Code_Environment/Public/.opencode/skills/sk-code/sk-code-obsidian/scripts/run-source-gates.sh"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-013"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether a resolver-only guard can prove prose descriptions are true, not just that a cited path exists: no — the guard resolves paths, not claims; recorded as a standing risk carried forward, not solved by this phase (operator, 2026-08-29)"
---
# Feature Specification: Surface-Reality Conformance

> Phase chain: parent [`../spec.md`](../spec.md), predecessor
> [`../012-doc-template-conformance/spec.md`](../012-doc-template-conformance/spec.md), successor: none —
> this is the packet's final planned phase.

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-28 |
| **Branch** | `worktrees/001-sk-code-obsidian-surface` |
| **Wave** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 010 renamed 235 files across the plugin tree to enforce kebab-case, and every plugin-side gate
(`tsc`, `build`, `vitest`, lint) stayed green throughout, because none of those gates read the
`sk-code-obsidian` packet's prose. The packet cites specific plugin filenames and paths across its
`SKILL.md`, references, and playbook to describe the real source tree. Nothing checked whether those
citations still resolved after the rename. A documentation packet that goes stale silently — passing
every code gate while its own prose points at files that no longer exist — is a worse failure mode
than one that fails loudly, because nothing signals the drift until a reader follows a dead citation.

### Purpose

Build a cross-repo drift guard (`tools/naming/scan-skill-references.mjs`) that resolves every
filename/path citation this packet makes against the real plugin tree, wire it into the packet's own
gate runner and `SKILL.md`, run it, repair every citation it finds broken, and prove the guard itself
cannot be fooled into reporting a false pass.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `tools/naming/scan-skill-references.mjs`: a script that extracts filename/path citations from the
  `sk-code-obsidian` packet's markdown and resolves each one against the real plugin repository tree.
- `references/skill-reference-integrity.md`: documentation of the guard's purpose, method, and the
  sentinel counter-example it must correctly reject.
- Wiring the guard into `SKILL.md` (a reference-map row, an assets note naming the gates runner) and
  into `scripts/run-source-gates.sh` (two executable checks under its integration points), so the
  guard runs as part of the packet's standing gate suite, not as a one-off script.
- Running the guard, repairing every citation it reports broken, and re-running it to a clean state.
- Proving the guard cannot pass falsely: a sentinel path that must never resolve, and a planted dead
  citation that must be caught and then confirmed cleared once removed.
- Confirming the plugin's own gate suite (`tsc`, `build`, `vitest`, `screenshots:verify`, `lint`) is
  unaffected by this phase's changes, since none of them read this packet's prose.

### Out of Scope

- Verifying that every resolved citation's surrounding prose accurately describes the file it points
  to. The guard resolves paths, not claims; that gap is recorded as a standing risk, not solved here.
- Re-running or modifying the 235-file kebab-case rename itself (phase 010's work).
- Any change to plugin source files, styles, or components. This phase touches only the guard script,
  its reference documentation, `SKILL.md`, the gates runner, and packet markdown citations.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `tools/naming/scan-skill-references.mjs` | Create | Cross-repo citation-resolution drift guard |
| `references/skill-reference-integrity.md` | Create | Guard's purpose, method, and counter-example documentation |
| `SKILL.md` | Modify | Reference-map row, assets note, two INTEGRATION POINTS checks |
| `scripts/run-source-gates.sh` | Modify | Wire the guard in as a fourth guard alongside naming, comments, folder-docs |
| 14 packet documents | Modify | Repair 26 broken citations found by the guard's first run |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Replace scaffold | This leaf's spec-kit record |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A cross-repo drift guard exists and resolves every packet citation against the real plugin tree | `tools/naming/scan-skill-references.mjs` exists, is wired into `run-source-gates.sh`, and its first run against the post-rename tree reports `broken : 23`. |
| REQ-002 | Every citation the guard found broken is repaired | 14 documents repaired, 26 substitutions made, guard re-run reports `broken : 0`. |
| REQ-003 | The guard cannot report a false pass | A sentinel path that must never resolve is checked and confirmed to fail resolution (`counter-example rejected : yes`); a deliberately planted dead citation is caught (rc 1, `broken : 1`) and confirmed cleared once removed (rc 0, `broken : 0`). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The full plugin gate suite is confirmed unaffected by this phase | `bash scripts/run-source-gates.sh` reports all four guards PASS (naming, comments, folder-docs, skill-refs), rc 0; `tsc` 0, `build` 0, `vitest` 386, `screenshots:verify` 180 current, `lint` 115 (100 errors, 15 warnings) — exactly baseline. |
| REQ-005 | The guard's known limitation is recorded, not hidden behind a clean result | This leaf states that the guard resolves paths, not claims — a citation can point at a real file while describing it wrongly — as a standing risk for future work. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scan-skill-references.mjs` exists, is wired into `SKILL.md` and `run-source-gates.sh`,
  and runs deterministically offline with no network or model dispatch.
- **SC-002**: The guard's first run against the post-rename tree reports `broken : 23`; after repair,
  a re-run reports `broken : 0`.
- **SC-003**: The sentinel counter-example and the planted-then-removed dead citation both prove the
  guard fails closed rather than passing falsely.
- **SC-004**: `bash scripts/run-source-gates.sh` exits 0 with all four guards reporting PASS.
- **SC-005**: The plugin's own gate suite (`tsc`, `build`, `vitest`, `screenshots:verify`, `lint`)
  matches the exact baseline recorded at the close of phase 010/011, confirming this phase introduced
  no regression.

### Acceptance Scenarios

- **Scenario 1**: **Given** the 235-file kebab-case rename from phase 010 landed with every plugin
  gate green, **when** `scan-skill-references.mjs` is run for the first time against the packet's
  prose, **then** it reports `broken : 23` — 23 citations pointing at filenames the rename removed,
  proving that no gate in the plugin repository could have caught documentation drift living in
  another repository's prose.
- **Scenario 2**: **Given** 23 broken citations across the packet, **when** each is repaired against
  the real current filename, **then** 14 documents are modified, 26 substitutions are made (some
  documents needed more than one), and a re-run reports `broken : 0`.
- **Scenario 3**: **Given** a guard whose resolver could theoretically have a broken path-join bug
  that always reports zero, **when** the guard is asked to resolve a sentinel path defined as never
  existing, **then** it must fail to resolve that sentinel, and the guard's own output states
  `counter-example rejected : yes` to prove it is not silently passing everything.
- **Scenario 4**: **Given** the guard needs to be proven both directions, **when** a deliberately dead
  citation is planted, **then** the guard returns rc 1 and `broken : 1`; when that citation is
  removed, the guard returns rc 0 and `broken : 0`.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The guard resolves paths, not claims — a citation can point at a real file while describing it wrongly | A future rename could leave a technically-resolving but semantically-false description undetected | Recorded explicitly as a standing risk in this leaf's docs; only reading keeps prose true, and this is carried forward rather than claimed solved |
| Risk | A resolver with a broken path-join bug could report zero broken citations regardless of real state | Would make the guard worthless while looking like it passed | The sentinel counter-example: a path defined as never existing must fail to resolve, or the guard's own run is invalid |
| Dependency | Phase 010's kebab-case rename | The event that created the drift this phase's guard detects and repairs | Confirmed via the guard's first-run `broken : 23` count, not assumed from the rename's file-count alone |
| Dependency | `scripts/run-source-gates.sh`'s existing three guards (naming, comments, folder-docs) | The integration point this phase's fourth guard is wired alongside | Read directly before wiring; the runner already treats an absent guard script as SKIP, not FAIL, so wiring in a fourth guard follows the same pattern |
| Dependency | The plugin's own build/test/lint gate suite | Confirms this phase's changes (script, docs, `SKILL.md`) introduced no regression | Re-run live and compared exactly against phase 010/011's recorded baseline |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Whether a resolver-only guard can prove that prose descriptions of a file are accurate, not just
  that the cited path exists**: no. The guard resolves paths; it does not read or verify prose
  content against the file it cites. This is recorded as a standing risk carried forward for future
  work, not something this phase claims to have solved (operator, 2026-08-29).

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Spec**: [`../spec.md`](../spec.md)
- **Predecessor**: [`../012-doc-template-conformance/spec.md`](../012-doc-template-conformance/spec.md)
- **Guard Script**: `../../../tools/naming/scan-skill-references.mjs`
- **Guard Documentation**: `../../../../Code_Environment/Public/.opencode/skills/sk-code/sk-code-obsidian/references/skill-reference-integrity.md`
- **Gates Runner**: `../../../../Code_Environment/Public/.opencode/skills/sk-code/sk-code-obsidian/scripts/run-source-gates.sh`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:related-docs -->
