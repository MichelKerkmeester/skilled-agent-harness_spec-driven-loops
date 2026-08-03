---
title: "Feature Specification: Code README structure and durability sweep"
description: "Eighty-eight findings across roughly 85 existing, substantively-accurate code READMEs repeat four defect shapes: no selective Directory Tree, no separators between numbered H2 sections, unnumbered or non-sequential headings, and non-durable content such as packet IDs, commit hashes and mutable spec paths. This phase runs them as four sequential lanes behind the standard ruling, and installs a CI grep gate so the durability class cannot re-enter."
trigger_phrases:
  - "code readme structural sweep"
  - "readme durability grep gate"
  - "readme separator heading conformance"
  - "code readme lane sweep"
importance_tier: "normal"
contextType: "planning"
parent: "sk-doc/022-code-readme-coverage"
_memory:
  continuity:
    packet_pointer: "sk-doc/022-code-readme-coverage/003-code-readme-structure-and-durability-sweep"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the phase spec from the track-A research synthesis"
    next_safe_action: "Hold — do not author the task list until 001's ruling lands"
    blockers:
      - "Hard gate on 001: 26 findings dissolve and ~50 shrink depending on the tree ruling"
    key_files:
      - "spec.md"
    completion_pct: 0
    open_questions:
      - "Q1 — the tree ruling decides the surviving finding count (88 vs ~62)"
      - "Q4 — if 019 widens, lane 003-B folds into it"
      - "Q6 — is the sweep worth doing at its post-ruling survivor count?"
    answered_questions:
      - "Truth defects found during the sweep escalate to 002; they are never silently repaired here"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Code README Structure And Durability Sweep

## EXECUTIVE SUMMARY

This is the homogeneous batch: bring existing, substantively-accurate code READMEs into structural conformance and strip content that cannot stay true. Four defect shapes repeat across 88 findings in ten skill hubs plus `.opencode/bin` and `.pi`. Seventy-six of the 88 cite a missing Directory Tree, which is why the phase is hard-gated on the standard ruling in `001` — 26 of them dissolve outright if a complete file table counts as equivalent navigation, and roughly 50 more shrink to a residual defect.

**Key Decisions**: whether the sweep runs at all at its post-ruling survivor count (Q6); whether lane B stays here or folds into `036/019` (Q4).

**Critical Dependencies**: hard on `001` (ruling plus validator mode); soft on `002` (run after, so the sweep is purely structural).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/022-code-readme-coverage/003-code-readme-structure-and-durability-sweep |
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `sk-doc/022-code-readme-coverage` |
<!-- /ANCHOR:metadata -->

> **[OPERATOR-DECISION: Q6 — is the sweep worth doing?]** Every finding here is P2 and none makes a reader do something wrong. Research recommendation: do `001` and `002` unconditionally, and gate this phase on the post-ruling survivor count. If survivors stay near 88, consider shipping only the durability grep gate — which stops the class growing without repainting 85 files — and deferring lanes A and B.

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Four shapes repeat, and their counts overlap because most files carry more than one:

| Shape | Findings citing it |
|-------|--------------------|
| Missing selective Directory Tree | 76 (**gated on the ruling**) |
| Missing `---` separators between numbered H2 sections | 34 (**gated on the format-rule ruling**) |
| Unnumbered, Title-Case or non-sequential H2 headings | 11 (**gated on the format-rule ruling**) |
| Non-durable content: packet IDs, `026` predecessor-audit language, commit hashes, migration narration, mutable `.opencode/specs/` paths | 18 |

Separately, nine code-folder READMEs link the *skill* README template as their authority instead of the code template, which is how a code folder ends up with a TOC.

The 45 separator and heading findings rest on an inference that the "General README format rules" block binds code-folder READMEs at all. **[OPERATOR-DECISION: Q2 — format-rule applicability]** If the ruling scopes that block away from code folders, those 45 findings dissolve alongside the tree ones.

The durability class is the one worth mechanising. A README that names a packet ID or a spec path is guaranteed to become false, because those paths move. The others are consistency defects.

### Purpose

Bring the surviving finding set into structural conformance with the ruled standard, and install a CI grep gate for the durability class so it cannot re-enter regardless of whether the rest of the sweep ships.

### Non-Goals

- Factual rewrites. Any file where the sweep uncovers a false claim is escalated into `002`'s checklist, never silently repaired here.
- `runtime/**` — `036/019` owns it.
- The mode-root README content drift owned by WS1 `032`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Four sequential lanes, each independently verifiable and reviewable. Recommended order **D → C → A → B**: D is smallest and validates the gate before it is applied at scale.

| Lane | Surface | Findings |
|------|---------|----------|
| `003-D` | `system-spec-kit/**`, `system-skill-advisor/**`, `.opencode/bin`, `.pi/**` | 14 |
| `003-C` | `sk-doc/**`, `sk-git/**`, `mcp-*/**`, `sk-prompt/**` | 19 |
| `003-A` | `sk-code/**`, `sk-design/**` | 26 |
| `003-B` | `system-deep-loop/**` outside `runtime/` | 29 |

Plus the durability grep gate, wired into CI so the class cannot re-enter.

### Out of Scope

- Any factual correction — escalate to `002`.
- `runtime/**` and the `019` amendment set.
- `shared/rollout/README.md`'s governance contradiction — WS1 `F-036-05` owns it; this phase touches only the orientation framing (`RA-004-40`).

### Findings in scope — lane D (14)

| ID | File | Defect shape |
|----|------|--------------|
| `RA-003-02` | `system-spec-kit/mcp-server/hooks/pi/README.md` | Structural |
| `RA-005-32` | `system-skill-advisor/mcp-server/README.md` | Non-durable: `:28` narrates packet moves |
| `RA-005-34` | `system-skill-advisor/mcp-server/lib/cross-skill-edges/README.md` | Structural |
| `RA-005-35` | `system-skill-advisor/mcp-server/lib/embedders/README.md` | Structural |
| `RA-005-36` | `system-skill-advisor/mcp-server/lib/ipc/README.md` | Structural |
| `RA-005-37` | `system-skill-advisor/mcp-server/lib/shared/README.md` | Structural |
| `RA-005-39` | `system-skill-advisor/mcp-server/tests/embedders/README.md` | Structural |
| `RA-006-04` | `.opencode/bin/README.md` | Structural |
| `RA-007-07` | `.opencode/scripts/git-hooks/lib/README.md` | Structural |
| `RA-008-05` | `system-spec-kit/mcp-server/README.md` | Structural / non-durable |
| `RA-008-06` | `system-spec-kit/mcp-server/lib/query/README.md` | Structural / non-durable |
| `RA-008-10` | `system-spec-kit/mcp-server/scripts/README.md` | Structural / non-durable |
| `RA-010-03` | `.pi/extensions/README.md` | Structural; invisible to the pre-`001` auditor |
| `RA-010-04` | `system-spec-kit/scripts/pi/README.md` | `## 2. CONTENTS` table, no fenced tree — **ruling-dependent** |

### Findings in scope — lane C (19)

| ID | File | Defect shape |
|----|------|--------------|
| `RA-005-09` | `mcp-code-mode/mcp-server/README.md` | Structural |
| `RA-005-11` | `mcp-tooling/mcp-chrome-devtools/scripts/README.md` | Structural |
| `RA-005-13` | `mcp-tooling/mcp-click-up/mcp-servers/clickup-cli/README.md` | Structural |
| `RA-005-14` | `mcp-tooling/mcp-click-up/scripts/README.md` | Structural |
| `RA-005-15` | `mcp-tooling/mcp-figma/examples/README.md` | Structural |
| `RA-005-16` | `mcp-tooling/mcp-figma/scripts/README.md` | Structural |
| `RA-005-17` | `sk-doc/scripts/tests/README.md` | Structural |
| `RA-005-18` | `sk-doc/shared/scripts/README.md` | `## 2. CONTENTS` table over **24** non-README files (research recorded 25 — carry the correction), one fenced block — **ruling-dependent** |
| `RA-005-19` | `sk-doc/sk-create-benchmark/scripts/README.md` | Structural |
| `RA-005-23` | `sk-git/scripts/hooks/README.md` | Structural |
| `RA-005-24` | `sk-git/scripts/lib/README.md` | Structural |
| `RA-005-25` | `sk-prompt/sk-prompt-models/benchmarks/2026-06-01--prompt-framework--mimo/eval/README.md` | Structural |
| `RA-005-26` | `.../2026-07-10--eval-loop--swe-1-6/scripts/README.md` | Structural |
| `RA-005-27` | `.../2026-07-10--extraction-rerun--swe-1-6/scripts/README.md` | Structural |
| `RA-005-28` | `.../2026-07-10--prompt-framework--minimax/eval-loop/scripts/README.md` | Structural |
| `RA-005-29` | `.../minimax/eval-rig/grader/README.md` | Structural |
| `RA-005-30` | `.../minimax/eval-rig/scripts/README.md` | Structural |
| `RA-005-31` | `.../minimax/eval-rig/scripts/deterministic/README.md` | Structural |
| `RA-008-08` | `sk-doc/scripts/README.md` | Structural / non-durable |

### Findings in scope — lane A (26)

| ID | File | Defect shape |
|----|------|--------------|
| `RA-002-02` | `sk-code/shared/assets/patterns/README.md` | Structural |
| `RA-002-03` | `sk-code/sk-code-opencode/assets/scripts/README.md` | Structural |
| `RA-002-04` | `sk-code/sk-code-opencode/scripts/README.md` | Structural |
| `RA-002-05` | `sk-code/sk-code-quality/scripts/README.md` | Structural |
| `RA-002-06` | `sk-code/sk-code-review/scripts/README.md` | Structural |
| `RA-002-07` | `sk-code/sk-code-webflow/assets/animation/snippets/README.md` | Structural |
| `RA-002-08` | `sk-code/sk-code-webflow/assets/integrations/README.md` | Structural |
| `RA-002-09` | `sk-code/sk-code-webflow/assets/patterns/README.md` | Links `skill-readme-template.md` at `:114`; `026` predecessor text at `:94`, `:103` |
| `RA-002-10` | `sk-code/sk-code-webflow/assets/scripts/README.md` | Structural |
| `RA-002-11` | `sk-code/sk-code-webflow/assets/templates/README.md` | Structural |
| `RA-002-12` | `sk-design/shared/corpus-context/README.md` | Structural |
| `RA-002-13` | `sk-design/shared/corpus-context/tests/README.md` | Structural |
| `RA-002-14` | `sk-design/shared/scripts/README.md` | Structural |
| `RA-002-15` | `sk-design/sk-design-interface/corpus/README.md` | Structural |
| `RA-002-16` | `sk-design/sk-design-interface/corpus/tests/README.md` | Structural |
| `RA-002-17` | `sk-design/sk-design-interface/scripts/README.md` | Structural |
| `RA-002-19` | `sk-design/sk-design-mcp-open-design/scripts/README.md` | Structural |
| `RA-002-20` | `sk-design/sk-design-mcp-open-design/transport/README.md` | Structural |
| `RA-002-21` | `sk-design/styles/lib/README.md` | Structural |
| `RA-002-22` | `sk-design/styles/lib/database/README.md` | Structural |
| `RA-002-23` | `sk-design/styles/lib/engine/README.md` | Structural |
| `RA-002-24` | `sk-design/styles/scripts/README.md` | Unnumbered H2 after `## 1. OVERVIEW`; `:112` embeds a mutable `.opencode/specs/` path |
| `RA-002-25` | `sk-design/styles/tests/database/README.md` | Structural |
| `RA-002-26` | `sk-design/styles/tests/engine/README.md` | Structural |
| `RA-002-27` | `sk-design/styles/tests/oracle/README.md` | Structural |
| `RA-008-07` | `sk-design/styles/README.md` | Structural / non-durable |

### Findings in scope — lane B (29)

**[OPERATOR-DECISION: Q4 — 019 scope width]** If `019` widens from `runtime/**` to the whole `system-deep-loop` skill, this entire lane folds into `019` and is removed from this phase.

| ID | File | Defect shape |
|----|------|--------------|
| `RA-004-05` | `deep-ai-council/scripts/README.md` | Structural |
| `RA-004-06` | `deep-ai-council/scripts/lib/README.md` | Structural |
| `RA-004-07` | `deep-ai-council/scripts/tests/README.md` | Structural |
| `RA-004-08` | `deep-alignment/scripts/README.md` | Structural |
| `RA-004-09` | `deep-alignment/scripts/adapters/README.md` | Structural |
| `RA-004-10` | `deep-alignment/scripts/command-benchmark/README.md` | Structural |
| `RA-004-11` | `deep-alignment/scripts/tests/README.md` | Structural |
| `RA-004-12` | `deep-improvement/scripts/README.md` | Structural |
| `RA-004-13` | `deep-improvement/scripts/agent-improvement/README.md` | Structural |
| `RA-004-14` | `deep-improvement/scripts/lib/README.md` | Structural |
| `RA-004-15` | `deep-improvement/scripts/model-benchmark/README.md` | Structural |
| `RA-004-16` | `deep-improvement/scripts/model-benchmark/lib/README.md` | Structural |
| `RA-004-17` | `deep-improvement/scripts/model-benchmark/scorer/README.md` | Structural |
| `RA-004-18` | `.../scorer/deterministic/README.md` | Structural |
| `RA-004-19` | `.../scorer/grader/README.md` | Structural |
| `RA-004-20` | `.../scorer/lib/README.md` | Structural |
| `RA-004-21` | `deep-improvement/scripts/model-benchmark/tests/README.md` | Structural |
| `RA-004-22` | `deep-improvement/scripts/shared/README.md` | Structural |
| `RA-004-23` | `deep-improvement/scripts/shared/tests/README.md` | Structural |
| `RA-004-24` | `deep-improvement/scripts/skill-benchmark/README.md` | Structural |
| `RA-004-25` | `deep-review/scripts/tests/README.md` | Structural |
| `RA-004-36` | `shared/behavior-benchmark/README.md` | Structural |
| `RA-004-37` | `shared/behavior-benchmark/tests/README.md` | Structural |
| `RA-004-38` | `shared/behavior-benchmark/tests/fixtures/README.md` | Structural |
| `RA-004-39` | `shared/progress/README.md` | Structural |
| `RA-004-40` | `shared/rollout/README.md` | Documents deferred work as current orientation. **Coordinates with WS1 `F-036-05`** — same sentence, different defect class; the governance contradiction stays WS1's |
| `RA-004-41` | `shared/rollout/tests/README.md` | Structural |
| `RA-004-42` | `shared/synthesis/README.md` | Structural |
| `RA-008-09` | `deep-research/scripts/README.md` | Structural. **File also touched by `002` `RA-004-03`** — sequence after `002` |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| The 88 README files listed above | Modify | Structural conformance and durability strip, per the ruled standard |
| CI workflow | Modify | Wire the durability grep gate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The finding set is re-triaged against `001`'s ruling before any task list is authored, and exempted findings are deleted rather than carried | Surviving count published before `tasks.md` exists. **[OPERATOR-DECISION: Q1 — tree vs table]** Expected: 88 if trees are mandatory, ~62 if complete tables count for flat folders |
| REQ-002 | Each lane passes `001`'s code-folder validator mode with zero blocking issues | Validator run over the lane's file set |
| REQ-003 | The durability grep returns zero per lane | `rg -n "\.opencode/specs/\|[Pp]acket [0-9]\|Spec [0-9]{2,}\|ADR-[0-9]\|[Pp]hase [0-9]+ \|\b026\b\|[Ff]ormerly the\|merged into this hub" <lane files>` → no matches |
| REQ-004 | Zero code-folder READMEs cite the skill README template as their authority | `rg -l "skill-readme-template" <lane files>` → empty |
| REQ-005 | The sweep introduces no truth drift | The `002` referenced-path resolution script re-run over each lane: zero unresolved |
| REQ-006 | Truth defects discovered during the sweep are escalated, not repaired here | Each escalation appears as a new row in `002`'s checklist with its source evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The durability grep gate runs in CI so the class cannot re-enter | CI job present and failing on a seeded violation |
| REQ-008 | A second reader samples 10% of each lane against source | ≈9 files audited with recorded verdicts |
| REQ-009 | Files shared with `002` and WS1 `032` are sequenced, not raced | `RA-008-09` lands after `002`; `RA-004-40` touches only the orientation framing and follows the WS1 sequencing choice. **[OPERATOR-DECISION: Q7 — WS1 sequencing]** *(author-added)* |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every surviving finding is closed or explicitly exempted by the recorded ruling, with no finding carried into a task list that the ruling exempts.
- **SC-002**: All four lanes pass the code-folder validator mode and the durability grep.
- **SC-003**: No code-folder README cites the skill template as its authority.
- **SC-004**: The durability class is mechanically prevented in CI, independently of how much of the sweep ships.
- **SC-005**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` → Errors: 0 per lane.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Carrying a ruling-exempted finding into the task list | High — the main failure mode for this phase | REQ-001: publish the surviving count before authoring tasks |
| Risk | A structural reformat introduces a stale reference | High | REQ-005 re-runs `002`'s resolution gate per lane |
| Risk | Silent factual "fixes" during a structural pass | High | REQ-006 escalates instead; the sweep never rewrites a claim |
| Risk | Durability grep false-positives on legitimate example text | Medium | Pattern tuned against `001`'s conformant control fixture |
| Risk | Lane B collides with WS1 `032` and `019` in adjacent trees | Medium | Lane B runs last; `RA-004-40` scoped to orientation framing only |
| Dependency | `001` ruling + validator mode | **Hard** | The phase cannot be verified without them |
| Dependency | `002` | Soft — run after, so the sweep is purely structural | Lane order allows it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The durability grep is deterministic and lane-scoped; it never depends on the CWD.
- **NFR-R02**: Each lane is independently revertible — no cross-lane state.

---

## 8. EDGE CASES

### Data Boundaries
- A README that legitimately documents a spec-kit path as part of its subject matter: needs an explicit, reviewed allowance rather than a blanket pattern exception.
- A flat folder whose complete table already navigates: verdict follows the ruling; do not repaint if exempt.

### Error Scenarios
- A file appears in two lanes because of a path overlap: assign to the lane owning its hub, never to both.
- A file whose structural fix would change meaning: escalate to `002` rather than editing.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | ~85 files, 10 hubs, four lanes |
| Risk | 8/25 | Documentation-only, but a wide blast radius of edits |
| Research | 6/20 | Re-triage against the ruling is the only investigation |
| Multi-Agent | 6/15 | Four lanes, sequential |
| Coordination | 10/15 | Depends on `001`, sequences after `002`, adjacent to `019` and WS1 `032` |
| **Total** | **50/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Exempted findings carried into tasks | H | H if the gate is skipped | REQ-001 hard gate |
| R-002 | Structural pass introduces stale references | H | M | REQ-005 per-lane resolution gate |
| R-003 | Truth defects silently repaired mid-sweep | H | M | REQ-006 escalation rule |
| R-004 | 85 files repainted for zero reader benefit | M | M | Q6 gate on the survivor count |
| R-005 | Lane B and WS1 `032` edit the same tree concurrently | M | M | Lane B last; scoped edits |

---

## 11. USER STORIES

### US-001: One authority (Priority: P2)

**As a** code README author, **I want** every code-folder README to cite the code template, **so that** copying a neighbour does not propagate a TOC the standard forbids.

**Acceptance Criteria**:
1. Given any file in a lane, When I grep for `skill-readme-template`, Then there are no matches.

### US-002: Durable by construction (Priority: P1)

**As a** maintainer, **I want** packet IDs and spec paths rejected in CI, **so that** a README cannot acquire a claim guaranteed to expire.

**Acceptance Criteria**:
1. Given a seeded violation in any code README, When CI runs, Then the durability job fails and names the file and line.

---

## 12. OPEN QUESTIONS

- **Q1** — the tree ruling decides whether this phase carries 88 findings or ~62. Re-triage is Task 1.
- **Q4** — if `019` widens to the whole `system-deep-loop` skill, lane B (29 findings) moves there and this phase drops to three lanes.
- **Q6** — at ~88 survivors, is the sweep worth it, or should only the durability grep gate ship? *Research recommendation: gate lanes A and B on the survivor count; ship the gate regardless.*
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Spec**: See `../spec.md`
- **Upstream**: `001-code-readme-standard-and-enforcement` (hard), `002-code-readme-truth-and-missing-orientation` (soft)
