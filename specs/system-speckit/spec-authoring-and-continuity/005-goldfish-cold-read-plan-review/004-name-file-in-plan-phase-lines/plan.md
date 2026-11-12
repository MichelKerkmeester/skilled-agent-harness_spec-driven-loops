---
title: "Implementation Plan: Phase 4: name-file-in-plan-phase-lines"
description: "The phase examples in the plan template and authoring card will name files, the skill entry sentence will state its plan and implement intent, and the generated golden snapshot will be refreshed. The focused snapshot suite and strict child validator prove the result."
trigger_phrases:
  - "name file in plan phase lines plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: name-file-in-plan-phase-lines

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | system-spec-kit templates and intent router |
| **Storage** | None |
| **Testing** | Focused Vitest snapshot suite and strict packet validator |

### Overview
Update the core plan template and authoring-card examples so every phase description names its file while task lines continue to carry verification commands. Narrow the skill's card entry sentence to plan and implement requests, then regenerate and verify the existing plan snapshots.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] The focused scaffold snapshot suite passes without update mode.
- [x] The strict child validator prints `RESULT: PASSED`.
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation contract alignment

### Key Components
- **`.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl`**: Source of the phase example rendered into new plans.
- **`.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md`**: Matching example for packet authors.
- **`.skilled/skills/system-spec-kit/SKILL.md`**: Entry sentence for the authoring card on plan and implement intents.
- **`.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap`**: Generated record for the rendered plan templates.

### Data Flow
The router maps plan and implement intents to the authoring card. Authors follow the same filename pattern in the card and the template; the focused snapshot suite renders the template for each level and compares the generated snapshot.

### Decisions made in the review pass

These close choices the first draft left to the implementer. Each is written into the task that carries it.

- **Exact wording.** T002 to T004 each point at an edit file under `scratch/` that holds the old line and the new line. Each old line was matched exactly once against its source on 2026-11-11.
- **The example text.** All three phase sentences name `scripts/rotate-logs.sh`, the file the card's own task example at section 7 already uses. Only the GOOD example changes. The instruction before it, the card's rule text at lines 113 and 123, and the ownership sentence at `plan.md.tmpl:126` stay as they are, as the evidence review asked.
- **The skill sentence.** `SKILL.md:94` splits into two sentences: `The intent keywords choose the rest through RESOURCE_MAP.` and `A plan or implement request starts with references/workflows/spec-authoring-card.md.` Phase 5 later widens what counts as an implement request, and the sentence stays true after it.
- **Regenerate, then prove the size of the change.** The template line is pinned four times in the snapshot file, at lines 483, 943, 1593 and 2433. T005 runs the suite with `--update` and requires `git diff --numstat` to report 4 added and 4 removed lines. The first draft asked the implementer to review the diff and keep only the right changes, which is a judgment call.
- **The card guard runs with the card edit.** `check-card-sync.sh` is the read-only guard for the card and the router that loads it. It printed `CARD SYNC OK` on 2026-11-11, and T003 requires it again after the edit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl`, `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md`, and `.skilled/skills/system-spec-kit/SKILL.md` to confirm the current examples and entry sentence.
Implementation updates `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl`, `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md`, and `.skilled/skills/system-spec-kit/SKILL.md`, then regenerates `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap`.
Verification runs `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` against that snapshot and validates this packet's `spec.md`, `plan.md`, and `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

From the repository root, regenerate the snapshot with `SPECKIT_ROOT=.skilled/skills/system-spec-kit; CLI_ROOT="$SPECKIT_ROOT/runtime/cli"; (cd "$CLI_ROOT" && npx vitest run --config ../../vitest.config.ts --project cli tests/scaffold-golden-snapshots.vitest.ts --update)`. Then run the same command without `--update`; it must exit 0 with the focused snapshot file passed. Finish with `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines --strict --quiet` and require `RESULT: PASSED`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Vitest is already a dev dependency of the system-spec-kit CLI package. No package or runtime dependency is added. Phase 3 is the parent sequence predecessor, but the documentation edits have no code dependency on it.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the focused test still fails and the working-tree diff for the four scoped files contains only this phase. Run `git diff -- .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md .skilled/skills/system-spec-kit/SKILL.md .skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap | git apply --reverse` to restore their indexed contents, then rerun the focused test; there is no runtime or stored-data state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this inventory for the reported documentation-contract finding. The change aligns two authoring sources, their plan/implement entry point and the generated snapshot consumer.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl | Authoritative plan-phase example | Update | T002 checks the one-line example names a file for each phase. |
| .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md | Matching authoring guidance | Update | T003 checks the aligned phase example. |
| .skilled/skills/system-spec-kit/SKILL.md | Plan/implement entry point to the card | Update | T004 checks the scoped entry sentence. |
| .skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap | Generated plan-template output | Regenerate | T005 regenerates and checks the diff is 4 lines in and 4 out; T006 runs the focused snapshot suite without update mode. |

Required inventories:
- Same-class producers: The template and card are the two phase-example sources, confirmed by the cited lines in phase-facts.md and re-read at template line 124 and card line 120; T002 and T003 verify them.
- Consumers of changed text: The skill entry routes plan/implement requests to the card, and the snapshot suite captures the rendered template; T004, T005 and T006 verify them.
- Matrix axes: N/A. The packet introduces no runtime inputs or combinatorial behavior.
- Algorithm invariant: N/A. The packet changes documentation and generated snapshots, with no parser, resolver, path or security behavior.
<!-- /ANCHOR:affected-surfaces -->


<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

~~~
Setup ──► Implementation ──► Verification
~~~

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Packet closure |
<!-- /ANCHOR:phase-deps -->

---
