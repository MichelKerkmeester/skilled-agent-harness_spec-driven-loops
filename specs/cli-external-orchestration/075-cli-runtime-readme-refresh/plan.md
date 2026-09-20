---
title: "Implementation Plan: Refresh the eight cli runtime READMEs and their folder maps"
description: "One delegated child per README, dispatched through the shared deep-loop runtime's cli-pi builder, with the main session owning the mechanical cli-pi link repoint and every acceptance check."
trigger_phrases:
  - "implementation plan"
  - "cli runtime readme approach"
  - "delegated readme refresh"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Refresh the eight cli runtime READMEs and their folder maps

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown; Node.js and Python for the repository's own validators |
| **Framework** | `sk-doc` (`sk-create-readme`) and `system-spec-kit` |
| **Storage** | None |
| **Testing** | `validate_document.py`, `check-markdown-links.cjs`, plus a packet-local `verify.sh` |

### Overview

Eight runtime READMEs share one edit contract, so the contract is written once and the work is fanned
out one child per file. Each child receives a committed prompt carrying that contract, its target's
exact folder inventory measured from disk, a scope lock naming a single writable path, and the self-check
commands; children run three at a time through the shared deep-loop runtime. The main session sets the
contract, audits strays after each batch, performs the mechanical cli-pi link repoint itself, and owns
every acceptance check.
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
- [x] The packet verifier passes from the final state
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fan-out with a single orchestrator. Read-only fan-out; the one structural edit per file is independent,
so no two children share a writable path and no merge step is needed.

### Key Components

- **The edit contract**: one text, generated into all eight prompts, so eight READMEs cannot drift into
  eight interpretations of "add a structure section".
- **The prompt emitter** (`scratch/build-prompts.cjs`): computes each packet's disk inventory and bakes it
  into the prompt artifact, so a child anchors on a measured snapshot rather than on its own read.
- **The dispatcher** (`scratch/dispatch-readmes.cjs`): imports the runtime's exported `buildLineageCommand`
  and `runLineageProcess`. Process construction and execution stay in the shared runtime; the dispatcher
  adds only the prompt files, a three-way concurrency cap, and one log per child.
- **The packet verifier** (`scratch/verify.sh`): the eight acceptance rows, run before and after.
- **The main session**: the cli-pi link repoint, the hermes mirror regeneration, hand-repair of whatever
  the children leave behind, and every acceptance check.

### Data Flow

Disk inventory → prompt emitter → eight committed prompt files → runtime builder constructs the argv →
runtime runner spawns 3 concurrent children with `cwd` at the worktree root → each child edits its one
README → per-child logs and a dispatch manifest are the evidence → the main session audits strays,
applies the link repoint, and runs the verifier.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No unit tests: the deliverable is prose, and the repository already ships the two authoritative gates for
it — the shared document validator and the markdown link checker. Both are run as before/after pairs so
each result is a comparison rather than an isolated number. The packet-local `verify.sh` adds the checks
the two shared gates do not make — per-directory and per-file coverage of each README's own folder map,
sequential heading numbering, presence of a fenced tree, and the mirror and pin-path conditions — and
prints one `RESULT:` line. Nothing in the deliverable is verified by inspection alone.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| `.skilled/skills/system-deep-loop/runtime` (`cli-pi` executor kind) | Runtime | Required; exports the builder and runner used for dispatch |
| `pi` on `PATH` | External binary | Required; probed before every dispatch, never assumed |
| `llmgateway` provider credentials | External | Required by the dispatched children |
| `sk-doc` validators and `system-spec-kit` link checker | In-repo tooling | Required; authoritative gates |
<!-- /ANCHOR:dependencies -->
