---
title: "Decision Record: Phase 013 - Design Commands Refactor (Assets, Workflow YAML, Presentation Dashboard)"
description: "Decision record for the interview-question design of each design command's presentation asset and the auto-vs-confirm default execution mode per command."
trigger_phrases:
  - "design command interview question design"
  - "auto vs confirm default design commands"
  - "design presentation asset decision"
  - "design command router split decision"
importance_tier: "high"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/013-design-commands-asset-refactor"
    last_updated_at: "2026-07-06T10:00:05.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Moved ADR-001 and ADR-002 from Proposed to Accepted after the verification pass"
    next_safe_action: "Carry both accepted ADRs into implementation once Phases 006-012 settle"
---
# Decision Record: Phase 013 - Design Commands Refactor (Assets, Workflow YAML, Presentation Dashboard)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Interview-Question Design for the Presentation Asset

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (planning-only; router+assets refactor not yet implemented) |
| **Date** | 2026-07-06 |
| **Deciders** | Phase packet owner, user-provided task scope |

---

<!-- ANCHOR:adr-001-context -->
### Context

The user's task brief asks for a consolidated interview-style setup prompt per mode "as experienced in Claude Design," mirroring `.opencode/commands/speckit/plan.md` + `speckit_plan_presentation.txt`. Today, each `/design:*` command already gathers its required input through scattered Ask-first questions (one per precondition) rather than one consolidated prompt. The presentation asset needs a single, coherent question set per mode instead of a re-derived or newly invented interview.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Build each mode's consolidated setup prompt directly out of that mode's existing `PRECONDITIONS` and `REGISTER` question wording, in this fixed order: (1) the mode's primary required input (target / axis / component-state / live URL, per mode), (2) the register posture question (Brand vs Product) already defined in every command's `REGISTER` section, (3) the mode's task lane or mode hint when the command has one (currently only `interface`, via `--mode`), and (4) the execution-mode question (`:auto` vs `:confirm`) only when no suffix was given.

**How it works**: The presentation asset's Consolidated Prompt Template asks these in one block, once, mirroring `speckit_plan_presentation.txt`'s "Never split these questions into separate visible prompts" rule. No new question is invented beyond what the current command already asks; the interview only consolidates existing Ask-first wording into one turn and adds the execution-mode selector.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Consolidate existing Ask-first/Register wording into one ordered prompt** | Behavior-preserving, matches the `speckit_plan_presentation.txt` reference shape, no new question content invented | Requires careful ordering per mode so the interview reads naturally | 9/10 |
| Invent an entirely new, richer interview per mode (extra qualifying questions beyond today's preconditions) | Could feel more like a design-manager conversation | Adds new required input the current commands do not ask for today, breaking behavior preservation | 3/10 |
| Keep separate sequential Ask-first prompts (no consolidation) | Simplest, least change | Does not satisfy the phase brief's explicit request for a consolidated interview-style prompt; diverges from the `speckit`/`create`/`deep` pattern | 4/10 |
| One universal prompt shared by all five modes (no per-mode primary input) | Simplifies the presentation asset count | Cannot represent each mode's distinct primary input (target vs axis vs component-state vs URL) without becoming vague | 5/10 |

**Why this one**: Consolidating the current Ask-first and Register wording into one ordered prompt satisfies the phase brief's interview-style requirement without inventing new required input, keeping the split behavior-preserving.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Users answer one consolidated prompt instead of encountering Ask-first questions one at a time across a session.
- The presentation asset becomes the single place to tune interview wording without touching routing logic.
- The design command family gains the same interaction shape as `speckit`/`create`/`deep`.

**What it costs**:
- Five presentation assets must each define their own primary-input question and keep it synchronized with the router's precondition. Mitigation: the content-inventory mapping in `plan.md` traces each precondition to its presentation-asset question.
- The consolidated prompt is slightly longer than a single Ask-first question for modes with only one required input. Mitigation: keep the prompt terse and mode-scoped, following the `speckit_plan_presentation.txt` example's compact style.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Consolidated wording drifts from the router's actual precondition over time | M | Require the presentation asset to cite the exact Ask-first question text at authoring time, per REQ-003 |
| A mode's task lane menu (e.g. interface's six lanes) makes the prompt feel cluttered | L | Keep the task-lane question optional and only ask it when the mode has more than one lane, as `interface` does today |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The phase brief explicitly requires a consolidated interview-style setup prompt per mode. |
| 2 | **Beyond Local Maxima?** | PASS | The decision compares consolidation, a richer invented interview, no consolidation, and a universal cross-mode prompt. |
| 3 | **Sufficient?** | PASS | Reusing existing precondition and register wording is enough to build the interview without inventing new required input. |
| 4 | **Fits Goal?** | PASS | The approach preserves current command behavior while adding the requested interview-style presentation. |
| 5 | **Open Horizons?** | PASS | A later phase can add genuinely new qualifying questions through an explicit decision without breaking this ADR's ordering rule. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes** (planned, not yet implemented):
- Draft each mode's Consolidated Prompt Template from its current `PRECONDITIONS` Ask-first wording and `REGISTER` Ask-first wording.
- Add the task-lane/mode-hint question only for modes with more than one lane (currently `interface`).
- Add the execution-mode question only when no `:auto`/`:confirm` suffix is present.

**How to roll back**: Remove the consolidated prompt from the presentation asset and restore the current per-precondition Ask-first sequencing in the router/workflow YAML, then re-run strict validation.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Auto vs Confirm Default Behavior Per Mode

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (planning-only; router+assets refactor not yet implemented) |
| **Date** | 2026-07-06 |
| **Deciders** | Phase packet owner, user-provided task scope |

---

### Context

The `speckit`/`create`/`deep` command families expose `:auto` and `:confirm` execution modes with a documented default when no suffix is given. The five `/design:*` commands do not have this dimension today; each command runs directly against `$ARGUMENTS` and only asks a question when a required input is genuinely missing. Adding `:auto`/`:confirm` needs one clear default rule so the five modes do not diverge into five independently-invented behaviors.

---

### Decision

**We chose**: Apply one uniform default rule across all five modes: when no `:auto`/`:confirm` suffix is given, the router checks whether `$ARGUMENTS` already supplies the mode's full required input set (per REQ-004's content-inventory mapping). If it does, the command proceeds autonomously without a prompt, exactly as it does today (e.g. `/design:interface dashboard-shell --mode redesign` keeps working with zero prompts). If any required input is missing, the router falls back to the `:confirm` consolidated setup prompt from ADR-001, once, rather than the old one-question-at-a-time Ask-first sequence. Explicit `:auto` always skips the prompt and uses the Auto Fail-Fast Display when a required input still cannot be resolved; explicit `:confirm` always shows the consolidated prompt once, even when `$ARGUMENTS` is fully specified, so a user can adjust before running.

**How it works**: The default is not "one mode always auto, another always confirm" — it is a single shared resolution rule (positional completeness decides the no-suffix default) applied identically to all five modes, so today's zero-prompt ergonomics are preserved for fully-specified invocations while incomplete invocations gain the new consolidated-prompt experience instead of sequential Ask-first questions.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared resolution rule: auto when `$ARGUMENTS` is complete, else confirm-once** | Preserves today's zero-prompt ergonomics for complete invocations, consistent across all five modes, satisfies the phase brief's request for both interview design and default-behavior documentation | Requires the router to check argument completeness before choosing a default, adding one decision step | 9/10 |
| Always default to `:confirm` for every mode when no suffix is given | Simple, matches `speckit:plan`'s own no-suffix default | Breaks today's zero-prompt behavior for already-complete invocations like the documented `/design:interface dashboard-shell --mode redesign` example, a behavior-preservation regression | 4/10 |
| Always default to `:auto` for every mode when no suffix is given | Keeps today's non-interactive feel for complete invocations | Silently fails or under-specifies for incomplete invocations instead of asking, which is worse than today's per-precondition Ask-first behavior | 3/10 |
| Per-mode independent default (e.g. `md-generator` defaults confirm because it needs a URL, others default auto) | Could match each mode's typical completeness pattern | Creates five independently-reasoned defaults with no single documented rule, the exact inconsistency risk named in `spec.md` R-002 | 5/10 |

**Why this one**: A single shared resolution rule keyed on argument completeness satisfies both the behavior-preservation requirement (complete invocations keep working with zero prompts) and the consistency requirement (one rule, not five ad hoc choices), while still gaining the new consolidated-prompt experience for incomplete invocations.

### Revalidation Note

Not applicable; this decision has not yet reached an implementation or revalidation pass. This ADR will be revalidated once the later implementation phase drafts the actual router mode-routing logic against real `$ARGUMENTS` parsing.

---

### Consequences

**What improves**:
- Existing scripts, muscle memory, and documented examples that call `/design:*` commands with complete arguments keep working with no new prompt.
- Incomplete invocations get one consolidated, interview-style prompt instead of a scattered Ask-first sequence.
- All five modes follow the same rule, so a reviewer can audit consistency with one ADR instead of five per-mode judgment calls.

**What it costs**:
- The router must evaluate argument completeness before choosing a default, which is a small new routing responsibility. Mitigation: keep this check in the router's `Mode Routing` section, reusing the same required-input list already named in each command's `PRECONDITIONS`.
- `:confirm` explicitly requested on a complete invocation still shows the prompt once, which is a minor behavior addition (not a removal) relative to today. Mitigation: this only occurs when the user explicitly opts into `:confirm`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Argument-completeness detection differs subtly from today's Ask-first "missing input" detection | M | Require the router's completeness check to reuse the exact same required-input list as the current `PRECONDITIONS` section, not a new heuristic |
| A future mode is added without updating this shared rule | L | State the rule in this ADR as the default for any future `/design:*` mode, not just the current five |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The phase brief explicitly requires a documented decision on auto-vs-confirm default behavior per mode. |
| 2 | **Beyond Local Maxima?** | PASS | The decision compares a shared completeness-based rule, always-confirm, always-auto, and independent per-mode defaults. |
| 3 | **Sufficient?** | PASS | One shared rule is enough to cover all five current modes without per-mode special-casing. |
| 4 | **Fits Goal?** | PASS | The rule preserves today's zero-prompt behavior for complete invocations while adding the requested interactive dimension. |
| 5 | **Open Horizons?** | PASS | A future mode or a future `:autopilot` addition can adopt the same rule without contradicting this ADR. |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes** (planned, not yet implemented):
- Add an argument-completeness check to each mode's router `Mode Routing` section, reusing the mode's existing required-input list.
- Route to `:auto` behavior when complete and no suffix is given; route to the `:confirm` consolidated prompt when incomplete and no suffix is given.
- Keep explicit `:auto` and explicit `:confirm` suffixes authoritative regardless of completeness, per their own documented behavior.

**How to roll back**: Remove the argument-completeness default check and restore the current direct-execution-with-Ask-first behavior for all five modes, then re-run strict validation.
