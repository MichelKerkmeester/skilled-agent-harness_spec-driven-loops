---
title: "Implementation Plan: Phase 2: hub-scaffold-and-mode-migration"
description: "Author the hub skeleton first so the packet has a destination, move the mode into it by git mv, retag it as the hub's transport, then re-author every doc that names the packet's home. The old hub keeps its registration until phase 003, so the mode answers from the new home while the old row is still present."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
  - "hub scaffold"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-orca/002-consolidate-official-orca-skills/review/containment/quarantine/1/content/specs/cli-jev/002-cli-jev-hub-migration/002-hub-scaffold-and-mode-migration"
    last_updated_at: "2026-09-20T14:35:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Plan authored at closeout, mirroring the executed hub stand-up"
    next_safe_action: "Run phase 003: decouple the old hub and rewire dispatch, hooks and rosters"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-002-hub-scaffold-and-mode-migration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: hub-scaffold-and-mode-migration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON skill artifacts; Node.js CommonJS tooling for the generators and the doctor |
| **Framework** | sk-doc's parent-hub templates and its `parent-skill-check.cjs` / `validate_skill_package.py` gates |
| **Storage** | Repository filesystem under `.skilled/skills/`; git index carries the mode rename |
| **Testing** | The doctor's hard invariants, the package validator's three sub-checks, the compiled-route CLI's legacy sentinel, and a read-only reviewer dispatch |

### Overview
The hub skeleton is authored first, because the mode needs a destination that already declares the transport contract it is about to satisfy. The packet then moves by `git mv` into `cli-usage/`, and the retag happens in the same breath: the registry row, the `transport-axis` extension, and the packet `SKILL.md` frontmatter name. Only after the hub validates does the identity pass run over the mode's own docs, and only after that does the read-only review dispatch window open, because reviewers should see the final bytes rather than a half-re-authored tree.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Author-then-move-then-retag-then-rewrite. The destination is created before the source is touched, so no intermediate state leaves the mode unreachable from any registry: the old hub keeps its row, and the new hub is registered in full before the folder arrives.

### Key Components
- **The hub's routing artifacts**: `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json` and the thin `SKILL.md`. The registry declares the transport contract; the router declares a single `cli-usage` signal with `defaultMode: null` and no hub-identity catch-all class, because one mode answering one vocabulary needs no fallback.
- **The `transport-axis` extension**: the axis moves to the hub that now owns the transported mode. It declares `transports: ["cli-usage"]` and carries the same selects-versus-acts doctrine.
- **The mode move**: `mkdir -p` then `git mv`, because `git mv` does not create the destination's parent, and the rename must be recorded rather than copied.
- **The packet retag**: `packetKind: "transport"`, `packetSkillName: cli-usage`, `grandfatheredFolderMismatch: false`, the eighth alias set preserved, and the packet `SKILL.md` frontmatter name rewritten to match.
- **The identity pass**: the mode's own docs name the new hub in place of the old family, and the reference pages take Jev-domain titles because they document an external tool surface rather than the packet's routing identity.
- **The hub's own verification surface**: a root playbook index over three `CJ-` routing scenarios, and a benchmark baseline file that names where the transport's 22-scenario evidence lives.

### Data Flow
Hub skeleton authored → `git mv` the packet into `cli-usage/` → retag registry, axis, router and packet frontmatter → regenerate `leaf-manifest.json` → run the doctor and the package validator → identity pass over the mode's own docs → reviewer dispatch → triage → re-gate on the final bytes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No unit tests apply to the hub artifacts themselves: the doctor is the test. `parent-skill-check.cjs` evaluates 42 numbered invariants over the hub, including the two that would catch a half-moved mode (`3c` packet folder resolution, `3d-name-frontmatter` against `packetSkillName`) and the transport contract (`3f`, `3h`, `5i`). The package validator adds the skill-package shape and the compiled-routing marker check. The compiled-route CLI proves the hub's legacy state is the documented one rather than a broken lookup. Finally, two independently dispatched read-only reviewers re-derive the phase's claims from the tree, which is how the dead hub-benchmark link, three false `ROUTER.md` claims and one stale catalog title were caught.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 001, because the mode's provenance citations now point at `specs/cli-jev/001-cli-jev-creation`.
- The sk-doc parent-skill templates, because they define the hub, registry, router, description and graph-metadata shapes the doctor checks.
- Phase 003, which consumes this phase's output: the old hub's row, the dispatch `packetPath` and the two hook suites all assume the packet now lives at `cli-jev/cli-usage`.
- Phase 004, which mints the activation manifest this phase deliberately leaves absent.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Move the folder back with `git mv .skilled/skills/cli-jev/cli-usage .skilled/skills/cli-external-orchestration/cli-jev`, restore the packet `SKILL.md` frontmatter name to `cli-jev`, restore the mode key and `transport-axis` block in the old hub's `mode-registry.json`, and delete the hub directory. The old hub's other seven modes were never touched outside its registry and router, so no mode behavior needs re-deriving.
<!-- /ANCHOR:rollback -->

---
