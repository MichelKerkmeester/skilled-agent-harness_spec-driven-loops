---
title: "Feature Specification: Phase 1: research-and-context"
description: "Read-only research gate for the deep-alignment mode program. Confirms the deep-review packet and runtime scripts, the three prior-art packets, the four parent skills' standards surfaces, and the 130/131 reference implementation before architecture decisions begin."
status: in_progress
trigger_phrases:
  - "deep-alignment research gate"
  - "deep-alignment prior art"
  - "deep-review runtime script inventory"
  - "parent-skill standards surface inventory"
  - "phase 001 research-and-context"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/001-research-and-context"
    last_updated_at: "2026-07-11T16:00:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled 4 research passes; zero ADR contradictions found"
    next_safe_action: "Await operator review, then phase 002 re-confirmation gate"
    blockers:
      - "Operator review required before phase 002 begins"
    key_files:
      - ".opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs"
      - ".opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs"
      - ".opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md"
      - ".opencode/skills/sk-code/shared/references/stack_detection.md"
      - ".opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-001-research-and-context"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "reduce-state.cjs confirmed mode-local; matches ADR-010, promotion still unexecuted"
      - "051/052/055 prior art confirmed by direct read; 052 parent status stale, out of scope"
      - "sk-doc has 2 real template path drifts; phase 005 must verify by disk existence"
      - "ADR-008 and ADR-009 tooling claims independently re-verified; both confirmed real"
      - "Zero contradictions found across all 12 ADRs vs the 4 reconciled research passes"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: research-and-context

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress - research executed and reconciled; operator review required before phase 002 begins |
| **Created** | 2026-07-11 |
| **Branch** | `system-deep-loop/059-deep-alignment-mode` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 9 |
| **Predecessor** | 000-deep-loop-runtime-refinement (phase-0 runtime prerequisite) |
| **Successor** | 002-architecture-decision |
| **Handoff Criteria** | A verified research/context map covering the deep-review packet, runtime scripts, three prior-art packets, the four parent skills' standards surfaces, and the 130/131 reference packets is ready for human review before phase 002 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the deep-alignment mode-packet specification.

**Scope Boundary**: Read-only research and inventory planning for phase 001. This phase documents findings inside this phase folder only. It must not create, move, or edit `.opencode/skills/system-deep-loop/deep-alignment/`, any `mode-registry.json` entry, any command file, or any file outside this phase folder.

**Dependencies**:
- The phase-0 runtime remediation (`000-deep-loop-runtime-refinement`) precedes this phase as a prerequisite, since the mode reuses that runtime. This is the first mode-build phase and has no other predecessor beyond the approved parent packet context and the frozen design brief it was scaffolded from.

**Deliverables**:
- A confirmed inventory of the `deep-review` packet and the shared runtime scripts it reuses, with file:line grounding for what is shared (`runtime/scripts/`) versus mode-local (`deep-review/scripts/`).
- A confirmed summary of the three prior-art packets: `052-deep-loop-unification`, `055-deep-loop-divergent-mode`, and `051-deep-loop-parent-skill-alignment` — including what `051` actually is, since its own title and scope must be read directly rather than assumed from its name.
- A confirmed inventory of each of the four parent skills' standards surfaces: `sk-doc` (`validate_document.py`, `extract_structure.py`, `core_standards.md`), `sk-git` (`SKILL.md` conventional-commit + worktree/branch rules), `sk-design` (DESIGN.md/token structure, audit-mode dimensions), `sk-code` (`SKILL.md` Smart Routing surface-detection markers).
- A confirmed read of the reference implementation packets `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review` and `130-hub-doc-conformance-fixes/002-hub-doc-conformance-fixes`, since the mode's alignment contract productizes exactly this manual pattern.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.

### Research Findings (executed 2026-07-11)

**Runtime-engine pass - confirmed, not contradicted.** `reduce-state.cjs` is mode-local at `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs`; `runtime/scripts/` holds 13 code files and none of them is `reduce-state.cjs` (independently re-verified by direct `find`/`ls` in this pass). `loop-lock.cjs`, `convergence.cjs`, `verify-iteration.cjs`, and `upsert.cjs` are all genuinely shared under `runtime/scripts/`, with `verify-iteration.cjs` invoked only by deep-review's `:auto` YAML workflow (absent from `:confirm`). This matches ADR-010's own stated context exactly and does not disturb its promote-to-shared decision.

**Prior-art pass - three programs read directly, not inferred from folder names.** `052-deep-loop-unification` merged `deep-loop-workflows`+`deep-loop-runtime` into today's `system-deep-loop`; its own parent-level status/completion_pct fields are stale (`Planned`/5%) despite 6 of 8 children being `Complete` - a pre-existing doc-drift issue in that packet, outside this phase's scope to fix. `055-deep-loop-divergent-mode` is a clean, verified, 100%-complete convergence-mode extension. `051-deep-loop-parent-skill-alignment` is the genuine predecessor of 052 (confirmed by content, not name), git-rename-traced from an older `skilled-agent-orchestration/119-.../003-deep-loop-alignment` path, `~95%` complete with one deliberately-skipped optional e2e run.

**Standards-surface pass - all four authorities' files exist where a future adapter would read them.** `sk-doc` (`validate_document.py`, `extract_structure.py`, `core_standards.md`), `sk-git` (`SKILL.md`'s conventional-commit + worktree rules), `sk-design` (`design_md_format.md`, `design_token_vocabulary.md`, the five-dimension audit rubric), `sk-code` (`stack_detection.md`'s concrete surface markers, one level below the `SKILL.md` section-2 summary ADR-004 references). Two real doc-vs-disk path drifts surfaced in `sk-doc`'s own `create-readme` and `create-feature-catalog` SKILL.md files (cited template subfolders that do not exist on disk). ADR-008's and ADR-009's specific tooling citations (`verify_alignment_drift.py`, the Webflow verify/minify script chain, `sk-design/SKILL.md:30`, `design_dispatch_boundary.md`) fell outside this pass's original scoped file list and were independently re-verified directly in this reconciliation - all four are real and confirmed.

**Reference-implementation pass - the 130/131 precedent this whole mode-packet productizes, read in full.** An enumerated, non-sampled scoping contract with an established-gap allowlist; a P0/P1/P2 claim-adjudication finding schema (`claim`/`evidenceRefs`/`counterevidenceSought`/`alternativeExplanation`/`confidence`/`downgradeTrigger`); hard read/write separation between audit and fix; a verify-first re-probing protocol with a formal `[B]` Blocked task state; and a collision-verified, file-disjoint parallel work-stream partition. Directly informs deep-alignment's alignment contract (ADR-005) and state machine (ADR-006).

**Contradiction check against all 12 Accepted ADRs: none found.** See §8.5 for the full cross-check, including the two ADRs (008, 009) whose cited tooling required independent re-verification beyond the four passes' original scope.

**Conclusion**: the design brief's runtime-engine assumption that prompted this research gate (whether `reduce-state.cjs` is already shared) is resolved - it is confirmed still mode-local, and ADR-010's promote-to-shared decision already accounts for that fact. Phase 002's decision-record.md target shape remains valid; no ADR requires amendment.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 002's architecture freeze (adapter contract, state machine, reuse boundary) depends on accurate, current facts about the `deep-review` engine's real shape, the standards surfaces of four parent skills, and the one manual precedent (`130`/`131`) the whole mode-packet productizes. Assuming these facts from the design brief alone risks freezing an architecture against a stale or imagined shape of the runtime — for example, the design brief lists `reduce-state.cjs` as a shared runtime script, but a direct read shows it living per-mode at `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs`, not under `.opencode/skills/system-deep-loop/runtime/scripts/`, which changes what "reuse the runtime engine" actually means for phase 008.

### Purpose
Produce a trustworthy, read-only factual foundation — a research/context map with confirmed reuse points — before phase 002 freezes the deep-alignment architecture.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read `.opencode/skills/system-deep-loop/deep-review/SKILL.md` and its `runtime/scripts/` + mode-local `scripts/` directories to confirm which loop primitives are shared runtime vs. mode-local, with file:line evidence.
- Read `.opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md`, `055-deep-loop-divergent-mode/spec.md`, and `051-deep-loop-parent-skill-alignment/spec.md` to confirm what each program actually did, not what its folder name implies.
- Read the four parent skills' standards surfaces named in the design brief: `sk-doc`, `sk-git`, `sk-design`, `sk-code`.
- Read `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deep-review-strategy.md` and `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/002-hub-doc-conformance-fixes/spec.md` as the reference implementation this mode-packet generalizes.

### Out of Scope
- Any decision about the final adapter contract shape, state machine, or artifact layout — those are frozen in phase 002, not decided here.
- File moves, mode-packet scaffolding, or command/agent creation — those start no earlier than phase 003.
- Edits to `.opencode/skills/system-deep-loop/`, `.opencode/commands/`, or any file outside this phase folder — phase 001 is a read-only research gate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/001-research-and-context/spec.md` | Modify | Record the confirmed research/context map and reuse points once the research passes run |
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/001-research-and-context/plan.md` | Modify | Plan the four research passes and the verification path |
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/001-research-and-context/tasks.md` | Modify | Track the scoped research-gate tasks pending execution |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Confirmed inventory of the `deep-review` packet and runtime scripts | Inventory states, with file:line evidence, which loop primitives are shared under `runtime/scripts/` and which are mode-local under `deep-review/scripts/` |
| REQ-002 | Confirmed prior-art summary for 052, 055, and 051 | Summary is grounded in a direct read of each packet's `spec.md`, not inferred from folder names, and states what each program actually delivered |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Confirmed standards-surface inventory for `sk-doc`, `sk-git`, `sk-design`, `sk-code` | Inventory names the concrete files each authority's future adapter would read, with real paths |
| REQ-004 | Confirmed read of the 130/131 reference packets | Summary states the scoping question, ruleset, and verify-first fix pattern those packets used by hand |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Research artifacts are grounded in fresh reads with file:line citations, not assumptions carried over from the design brief.
- **SC-002**: Zero files outside `.opencode/specs/system-deep-loop/059-deep-alignment-mode/001-research-and-context/` are touched during this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None | First phase, no predecessor phase dependency | Proceed once the scoped research plan is reviewed |
| Risk | Design-brief assumptions about the runtime engine's shape are stale or imprecise | Medium | Re-read the actual scripts and packets rather than trusting the brief's bullet list verbatim |
| Risk | 051's actual scope is misread from its folder name alone | Medium | Read `051-deep-loop-parent-skill-alignment/spec.md` directly and record its real delivered scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None remaining in this phase's own scope. Both questions this phase was scaffolded to answer are now resolved:

- *Does `reduce-state.cjs` stay mode-local or move to shared runtime?* Resolved by ADR-010 (Accepted): promote to shared `runtime/scripts/`, phase 008 executes the move. Independently re-confirmed still mode-local as of this research pass - see §8.1 and §8.5.
- *Are there other deep-review mode-local scripts phase 008 will need to fork?* Resolved: `runtime-capabilities.cjs` (a thin shim that already delegates to shared `runtime/lib/deep-loop/runtime-capabilities.cjs`) and `divergent-review-pivot.ts` (a mode-specific candidate-builder) are the only other mode-local files. Neither is a required promotion candidate the way `reduce-state.cjs` is - see §8.1.
<!-- /ANCHOR:questions -->

---

## 8. RESEARCH & CONTEXT MAP

> Reconciles the four scoped research passes (runtime-engine, prior-art, standards-surface, reference-implementation) named in `plan.md` §3 into one internally consistent map, per REQ-001 through REQ-004 and SC-001. Every claim below traces to a real `Read`/`Grep`/`find` citation; none is inferred or carried over from the design brief unchecked.

### 8.1 Deep-Review Engine Shape - Shared Runtime vs. Mode-Local

**Central finding.** `reduce-state.cjs` is currently mode-local at `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs`. It has **not** been promoted to `runtime/scripts/`. The promotion is an Accepted-but-unexecuted architecture decision (ADR-010), slated for phase 008's execution pass. Confirmed independently in this reconciliation pass: `find .opencode/skills/system-deep-loop -iname "reduce-state.cjs"` returns exactly three mode-local hits (`deep-review/scripts/`, `deep-research/scripts/`, `deep-improvement/scripts/shared/`) and zero hits under `runtime/scripts/`; `ls .opencode/skills/system-deep-loop/runtime/scripts/*.cjs` lists 13 files, none named `reduce-state.cjs`.

**`deep-review/scripts/` (mode-local, actual directory contents):**

| File | Role | Evidence |
|---|---|---|
| `reduce-state.cjs` | Sole state writer/reducer | `deep-review/SKILL.md:60,374,410`; invoked at `deep_review_auto.yaml:893,1383,1595` and `deep_review_confirm.yaml:883,916,1196,1461` |
| `runtime-capabilities.cjs` | Thin mode-local shim | `deep-review/assets/deep_review_config.json:57`; the shim itself `require`s `../../runtime/lib/deep-loop/runtime-capabilities.cjs:18` - the real implementation is already shared, one directory the design brief didn't ask about (`runtime/lib/`, not `runtime/scripts/`) |
| `divergent-review-pivot.ts` | Genuine ESM import, mode-specific candidate-builder | `deep_review_auto.yaml:723`, `deep_review_confirm.yaml:691`; imported alongside the shared `runtime/lib/deep-loop/divergent-pivot.ts` transaction engine |

**`runtime/scripts/` (shared, 13 code files) - deep-review's actual usage:**

| Script | Used by deep-review | Evidence |
|---|---|---|
| `convergence.cjs` | Yes, both modes | `deep_review_auto.yaml:555,560`; `deep_review_confirm.yaml:523,528` |
| `loop-lock.cjs` | Yes, both modes | `deep_review_auto.yaml:254,262,265,268,1877`; `deep_review_confirm.yaml:229,234,237,240,1591` |
| `upsert.cjs` | Yes, both modes | `deep_review_auto.yaml:454,1414`; `deep_review_confirm.yaml:1227` |
| `verify-iteration.cjs` | Yes, `:auto` only | `deep_review_auto.yaml:1286`; zero hits in `deep_review_confirm.yaml` - a genuine asymmetry, not an assumption |
| `fanout-run.cjs` / `fanout-merge.cjs` | Yes, opt-in fan-out path | `deep_review_auto.yaml:177,1499`; `deep_review_confirm.yaml:150,1341` |
| `fanout-pool.cjs` / `fanout-salvage.cjs` | Indirect only (required internally by `fanout-run.cjs`) | Not invoked directly by deep-review YAML |
| `check-contract-drift.cjs`, `compile-command-contracts.cjs`, `render-command-contract.cjs`, `query.cjs`, `status.cjs` | No | Zero hits in either deep-review YAML; build-time contract-drift/docs tooling unrelated to loop dispatch |

`deep-review/SKILL.md:410` names only the two mode-local files as "Scripts" - the six shared-runtime scripts it actually uses are invoked exclusively from `.opencode/commands/deep/assets/deep_review_{auto,confirm}.yaml`, consistent with `SKILL.md:45,289` ("The command's YAML workflow owns state, dispatch, and convergence"). Two doc-staleness notes, not architecture concerns: `deep-review/scripts/README.md:29,69-70` still claims "2 code files" (3 exist since `divergent-review-pivot.ts` was added); `runtime/scripts/README.md:14-26`'s own inventory table omits `verify-iteration.cjs` despite it being live-invoked.

**ADR-010 status.** `002-architecture-decision/decision-record.md:918-922` records ADR-010 as `Status: Accepted, Date: 2026-07-11`. Its Context (`:929`) states the exact same mode-local finding this research independently reconfirms. Its Decision (`:941-943`) is PROMOTE TO SHARED RUNTIME, behavior-preserving, phase 008 executes. Its own Implementation section (`:1001-1002`) and Rollback note (`:1005`, "No behavior changes need reverting since none occur beyond the location move") both confirm the move has not happened yet. This is full agreement between the ADR's stated assumption and fresh, independently re-verified evidence - not a contradiction.

### 8.2 Prior Art - Packets 052, 055, 051 (system-deep-loop track)

All three folders exist at their given paths; no renesting occurred.

**052-deep-loop-unification** (phase-parent): merges `deep-loop-workflows` (advisor-routable hub) and `deep-loop-runtime` (backend) into today's `system-deep-loop`, nesting runtime as a `runtime/` subfolder and repairing internal/external path coupling (`052/spec.md:3,62-65,74-76`). Structural/identity merge only; loop semantics out of scope (`052/spec.md:81`). **Status fields are stale**: parent `spec.md` METADATA says `Status: Planned` (`:46`), `completion_pct: 5` (`:28`), `graph-metadata.json:44` says `"planned"` - but direct per-child reads show 001 Complete, 002 Complete, 003 Complete, 004 Planned (deliberately deferred, operator-gated), 005 Planned ("Validation and Closeout" - odd, since 006-008 already shipped past it), 006 Complete, 007 Complete, 008 Complete. **Real state: 6 of 8 children complete**; the parent's own status/completion_pct simply were never refreshed since scaffolding. This is a pre-existing doc-drift issue inside 052, outside this phase's scope to fix, but relevant context for anyone trusting 052's parent-level status at face value.

**055-deep-loop-divergent-mode**: adds an opt-in `divergent` convergence mode - a legal, non-terminal convergence STOP becomes a recorded "saturated direction" instead of ending the run, a three-seat AI Council picks an unexplored direction, and the loop continues until a genuine hard boundary (`055/spec.md:3,68-70,87-95`). Explicitly a modifier on `convergence.cjs` plus the four research/review YAML workflows, not a new skill/command/agent (`055/spec.md:99,111-119`). METADATA: `Status: Implemented (verified)`, `completion_pct: 100` (`055/spec.md:51,30`), `graph-metadata.json:42` `"complete"`. Corroborated externally: 052's own child `008-divergent-mode-dogfood` is a live dogfood of this exact feature (Complete), and this session's branch history includes the merge of `wt/0026-deep-loop-divergent-mode`.

**051-deep-loop-parent-skill-alignment**: confirmed genuine by content, not just folder name - title is literally "Feature Specification: deep-loop parent-skill alignment" (`051/spec.md:2`), covering invokable-hub routing via `mode-registry.json`, the `ai-council`/`deep-ai-council` folder-name fix, feature-catalog and merged-identity-layer decisions, and validation gates (`051/spec.md:85-89,130-132,138-139`). It is 052's direct predecessor - 052's own metadata names it explicitly (`052/spec.md:51`). **Provenance quirk**: this file is a git-renamed continuation of `skilled-agent-orchestration/119-parent-skill-native-invocability/003-deep-loop-alignment` - its own body still cites the pre-move path and pre-052 skill name (`051/spec.md:67-68,115-118,256`), traced via `git log --follow --diff-filter=R` to rename commit `57e4819b06`; the old path no longer exists on disk. METADATA: `Status: Complete (~95%; optional live-loop e2e not run)`, `completion_pct: 95` (`051/spec.md:72,28`), `graph-metadata.json:43` `"complete"`.

### 8.3 Standards Surfaces - sk-doc, sk-git, sk-design, sk-code

All paths below were confirmed to exist via direct `find`/`ls -la`/`test -e`, not inferred.

**sk-doc** - validation/standards trio, each cross-referenced identically from every child packet's REFERENCES section (e.g. `sk-doc/create-quality-control/SKILL.md:373-379`):

| File | Lines | Role |
|---|---|---|
| `shared/scripts/validate_document.py` | 928 | Pre-delivery blocking structure validator; loads its rule table from `shared/assets/template_rules.json` (`validate_document.py:104-107`) |
| `shared/scripts/extract_structure.py` | 1256 | Structure/metrics/DQI extractor, auto-detects doc type |
| `shared/references/core_standards.md` | 331 | Filename conventions, doc-type detection, blocking structural violations, emoji policy |

Authoring templates, each verified against `create-*` `SKILL.md` citations: skill (`create-skill/assets/skill/skill_md_template.md`, 1182L, citation accurate), README (real path `create-readme/assets/readme_template.md`, 312L), feature catalog (real path `create-feature-catalog/assets/feature_catalog_template.md`, 293L), changelog (`shared/assets/changelog_template.md`, 297L plus nested `system-spec-kit/templates/changelog/{root,phase}.md`). **Real path drift**: `create-readme/SKILL.md:47,382` cites `assets/readme/readme_template.md` (with a `readme/` subfolder) - that path does not exist; the real file has no subfolder. `create-feature-catalog/SKILL.md:105,121,265` cites `assets/feature_catalog/feature_catalog_template.md` (with a subfolder) - also does not exist; same pattern. A future `standardSource(authority)` adapter (ADR-003) must resolve templates by disk existence check, not by trusting the cited relative-path string.

**sk-git** - `SKILL.md` (584 lines). Conventional-commit rules at `## 4. RULES` -> `### Commit Message Logic`, lines 310-459 (subject contract, type/scope priority ordering, body contract, a 9-item deterministic self-check); structurally enforced by a real hook `.opencode/scripts/git-hooks/commit-msg` (186L, cited `SKILL.md:316-317`). Worktree/branch naming: ask-first gate at `SKILL.md:206-221`; numbered namespace `wt/{NNNN}-{name}` / `.worktrees/{NNNN}-{name}` at `SKILL.md:298`. Seven referenced deep-dive docs all verified present (`worktree_workflows.md` 641L through `quick_reference.md` 484L, table at `SKILL.md:486-503`).

**sk-design** - DESIGN.md structure spec at `design-md-generator/references/design_md_format.md` (300L). Shared token vocabulary at `shared/design_token_vocabulary.md` (97L). Audit-mode's real dimension set is five, not four (anti-slop folds into Anti-Patterns), defined at `design-audit/SKILL.md:143-148` and `design-audit/references/audit_contract.md:47-55`: Accessibility, Performance (`accessibility_performance.md`, 127L), Responsive Design (no dedicated file - rubric-table only), Theming (rubric table), Anti-Patterns (`anti_patterns_production.md` + `ai_fingerprint_tells.md` + `anti_patterns_score_rubric.md` + shared `anti_slop_principles.md`). **Independently re-verified beyond the original scoped pass** (needed for ADR-009's cross-check, §8.5): `SKILL.md:30`'s design-mcp-open-design table row reads exactly "a read-only bridge, always paired with a design-judgment mode that owns the taste" - the literal text ADR-009 quotes; `shared/design_dispatch_boundary.md` exists at exactly the path ADR-009 cites.

**sk-code** - `SKILL.md` §2 Smart Routing (lines 48-126) is a hub-level contract summary, not the marker definitions; it explicitly defers (`SKILL.md:122`) to `shared/references/stack_detection.md` (124 lines) for the concrete surface-detection markers: ownership table (26-30), precedence rule (36-38), bash marker checks (40-54), OPENCODE language sub-detection (84-100), an 8-row test-case table (104-115), and a self-citation back to `SKILL.md` section 2 as "the operator-facing summary" (`:123`). This is a hub-defers-to-shared pattern, not an inaccuracy in ADR-004's shorthand reference to "SKILL.md §2 Smart Routing" (that section genuinely exists and genuinely covers routing; the concrete markers just live one file deeper). **Independently re-verified beyond the original scoped pass** (needed for ADR-008's cross-check, §8.5): `code-opencode/assets/scripts/verify_alignment_drift.py` exists (558 lines, header "ALIGNMENT DRIFT VERIFIER"), and the Webflow chain ADR-008 names exists in full - `code-webflow/assets/scripts/verify-minification.mjs` (363L), `minify-webflow.mjs` (248L), `test-minified-runtime.mjs`, plus `references/verification/verification_workflows.md` and `references/deployment/minification_guide.md`. Both of ADR-008's Layer-1 deterministic-tooling claims are real.

**Cross-cutting note**: sk-doc and sk-code both hub-defer to a `shared/` directory or child packet for exact filenames; sk-git and sk-design instead enumerate files directly in one `SKILL.md`. A `standardSource(authority)` adapter (ADR-003) should branch on this pattern per authority rather than assume uniform `SKILL.md` depth, and must verify every candidate path with a real existence check given the two sk-doc drift findings above.

### 8.4 Reference Implementation Pattern - Packets 130/131 (skilled-agent-orchestration/130-hub-doc-conformance-fixes)

Phased-parent shape: phase 001 (`001-hub-doc-conformance-review`) ran the manual 10-iteration review over 294 docs, closing **FAIL** (`67 P0 / 4 P1 / 2 P2` distinct, from a raw `102/5/4` - `implementation-summary.md:88`); phase 002 (`002-hub-doc-conformance-fixes`) is a planning-only fix-fleet partition, no doc edits (`002/spec.md:3`).

**The scoping ruleset** (five parts, `review/prompts/iteration-1.md` and `review/deep-review-strategy.md`): (a) an exhaustive, enumerated 294-doc corpus, not sampling; (b) two required dimensions per doc - sk-doc TEMPLATE CONFORMANCE and REALITY-ALIGNMENT; (c) named validators, explicitly not the sk-doc/scripts/ symlink facade; (d) an explicit false-positive allowlist for established repo-wide gaps (TOC ban, changelog plain-H2, compact hub-routing playbooks, kebab-case references, cli-family frontmatter, pointer-card assets); (e) tool-level read/write separation - an `ALLOWED WRITE PATHS` allowlist, a `BANNED OPERATIONS` list, and a `scope_violation` finding as the escape hatch instead of an out-of-scope mutation.

**The finding schema**: P0/P1/P2 severity (`P0` = broken/dead link, wrong-reality, validate FAIL; `P1` = template non-conformance or DQI<75; `P2` = polish - `prompts/iteration-1.md:176`), verdict rule `FAIL|CONDITIONAL|PASS` where any P0 forces FAIL. Every P0/P1 is a claim-adjudication object: `claim`, `evidenceRefs`, `counterevidenceSought`, `alternativeExplanation`, `finalSeverity`, `confidence`, `downgradeTrigger` (`prompts/iteration-1.md:50-52`, exemplified at `iterations/iteration-001.md:20-31`) - `counterevidenceSought` and `downgradeTrigger` are the anti-confirmation-bias fields: the reviewer must argue against its own finding and name the exact fact that would flip it. **A real gap worth carrying forward**: the loop's own self-reported findings-registry rollup was untrustworthy (`deep-review-findings-registry.json` reads all-zero despite 67/4/2 distinct findings existing); the correct deduped count only exists because a downstream agent cross-checked every iteration narrative against raw delta records by hand (`002/plan.md:57`).

**The verify-first fix-fleet pattern** (ADR-001 in `002/decision-record.md:37-130`, operationalized `002/plan.md:70-75`): a mandatory 5-step protocol per reality-drift finding - probe before editing (re-run the live command the review cited), confirm if the probe matches, diverge and document if the probe contradicts the review's now-stale evidence, halt and mark `[B]` Blocked if the probe cannot run, never silently delete a capability claim. Findings partition into four file-disjoint parallel work-streams, collision-checked (ADR-002, `002/decision-record.md:134-227`), bound by one shared scope-boundary protocol (ADR-003, `002/decision-record.md:231-324`). A closing gate re-runs the *original* review's exact scope, requiring 0 active P0 or an explicit operator-approved carry-over list (`002/plan.md:145-148`).

**What this hands to deep-alignment**: (1) an enumerated, non-sampled scoping contract with a baked-in established-gap allowlist; (2) a claim-adjudication finding schema as an anti-hallucination structure, not a later review pass; (3) hard read/write separation enforced at the tool level, not just prose; (4) never trust a loop's own self-reported dashboard rollup without a raw-record cross-check; (5) verify-first re-probing with a formal BLOCKED disposition, plus a collision-verified file-disjoint fleet partition.

### 8.5 Research vs Architecture Contradictions

**None found.** All 12 Accepted ADRs in `002-architecture-decision/decision-record.md` were cross-checked against the four reconciled research passes above; none of the four passes' findings conflicts with an ADR's stated assumption.

Detail, ADR by ADR:

- **ADR-001** (new mode-packet): assumes `loop-lock.cjs`, `convergence.cjs`, `verify-iteration.cjs`, `upsert.cjs` are shared and reusable. §8.1 confirms all four are genuinely shared. No contradiction.
- **ADR-002, ADR-011, ADR-012** (scoping tree, lane-config schema, adapter governance): design NEW, not-yet-built artifacts. Nothing in existing code could contradict a not-yet-implemented design; not applicable.
- **ADR-003** (discover/standardSource/check contract): a new abstraction, not a factual claim about existing code. §8.3's sk-doc path-drift finding is a grounding note for phase 005's implementation, not a contradiction of the contract shape itself.
- **ADR-004** (authority sequencing): its factual claims about each authority's own tooling (`validate_document.py`+`extract_structure.py`+`core_standards.md` for sk-doc, `SKILL.md`'s commit/branch rules for sk-git, DESIGN.md/token structure for sk-design, `SKILL.md` §2 Smart Routing for sk-code) are all confirmed in §8.3. The "§2 Smart Routing" reference is a hub-level summary that defers one file deeper to `stack_detection.md` for concrete markers - a precision nuance, not a false claim (§2 genuinely exists and genuinely covers routing). Not a contradiction.
- **ADR-005** (alignment contract - verify-first, suppression, read-only default, gated remediation): its justification cites the 130/131 precedent directly. §8.4 confirms that precedent in detail, strengthening rather than contradicting ADR-005's grounding.
- **ADR-006** (state machine, spec-folder-bound `alignment/` layout mirroring deep-review's `review/` convention): §8.4 confirms the 130/131 packet does use exactly this `review/`-subfolder shape (config, findings registry, state JSONL, iterations, prompts, dispatch-receipts). Consistent, not contradictory.
- **ADR-007** (boundary vs. `parent-skill-check.cjs`/`deep-review`): a scope/definition decision, not a factual claim the four passes could contradict.
- **ADR-008** (sk-code HYBRID): its Layer-1 deterministic-tooling claims (`verify_alignment_drift.py` for OPENCODE, the Webflow verify/minify chain for WEBFLOW) fell outside the standards-surface pass's original scoped file list. Independently re-verified in this reconciliation (§8.3): both are real. Confirmed, not contradicted.
- **ADR-009** (sk-design live-render, phase 010, dispatch only through `design-mcp-open-design`): its citations (`SKILL.md:30`, `shared/design_dispatch_boundary.md`) also fell outside the original scoped pass. Independently re-verified (§8.3): both exact. Confirmed, not contradicted.
- **ADR-010** (reduce-state.cjs promotion): the ADR most directly re-examined by this phase's own purpose. §8.1 triple-confirms its context (the ADR's own text, the runtime-engine research pass, and this reconciliation's independent filesystem check all agree `reduce-state.cjs` is mode-local today). Its decision (promote to shared) is forward-looking and unaffected.

Two items are flagged above as **nuances worth a reader's attention, explicitly not contradictions**: `verify-iteration.cjs`'s `:auto`-only usage asymmetry (a fact about deep-review's own YAML, not about the script's shared-vs-mode-local location), and ADR-004's "SKILL.md §2 Smart Routing" shorthand pointing at a hub-level summary rather than the concrete markers one file deeper. Neither changes any ADR's Decision or Status.

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
