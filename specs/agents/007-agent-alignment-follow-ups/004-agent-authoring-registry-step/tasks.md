---
title: "Tasks: Phase 4: agent-authoring-registry-step"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "agent authoring registry step tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: agent-authoring-registry-step

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables**: `S` is `.skilled/skills/sk-doc/sk-create-agent/SKILL.md`. `G` is `.skilled/agents/agent-registry.json`. `scratch/` is this folder's `scratch/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Save the two Measured Behavior commands with their output, and the field names of one registry record (`scratch/baseline.txt`). Verify: `rg -c 'agent file without a registry record: zz-probe' scratch/baseline.txt` prints 1, and `git status --short .skilled/agents` prints no line. Observed: `scratch/baseline.txt` holds both commands with their output and the eight field names. The search printed 1 and `git status --short .skilled/agents` printed no line at that point.
- [x] T002 Read the two `/create:agent` workflow assets and record whether they restate the creation steps (`scratch/baseline.txt`). Verify: `rg -c 'create-agent assets restate steps:' scratch/baseline.txt` prints 1. Observed: the two assets run their own six-step workflow and do not copy the skill's steps. They never name the registry or run the roster check. The search printed 1.
- [x] T003 Read the version rule in the `sk-doc` hub and record which files a packet change must touch (`scratch/baseline.txt`). Verify: `rg -c 'version files:' scratch/baseline.txt` prints 1. Observed: a mode packet's `SKILL.md` version equals its own newest changelog entry and is changed by hand with the release. The search printed 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add a step before the validation step that tells the author to add a record to the registry, names each field a record carries and says to run `node .skilled/bin/sync-agent-roster.cjs` afterwards (`.skilled/skills/sk-doc/sk-create-agent/SKILL.md`). Verify: `rg -c 'agent-registry' .skilled/skills/sk-doc/sk-create-agent/SKILL.md` prints 1 or more. Observed: the search printed 1. The new step 13 names all eight fields and `templateExceptions`.
- [x] T005 Quote the error text in the validation step, where it names the roster check (`.skilled/skills/sk-doc/sk-create-agent/SKILL.md`). Verify: `rg -c 'agent file without a registry record' .skilled/skills/sk-doc/sk-create-agent/SKILL.md` prints 1. Observed: the search printed 1. The text sits in step 14, the validation step.
- [x] T006 Bump the packet version and add the changelog entry the version rule requires (`.skilled/skills/sk-doc/sk-create-agent/changelog/`). Verify: the newest file name under that folder matches `rg -n '^version:' .skilled/skills/sk-doc/sk-create-agent/SKILL.md`. Observed: `5:version: 1.0.8.0` and the newest changelog file is `v1.0.8.0.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Follow the new step with a throwaway agent: copy `context.md` to `zz-probe.md`, add a `zz-probe` record, rewrite the rosters, run the check and save every output (`scratch/probe.txt`). Verify: `rg -c 'agent-roster: OK' scratch/probe.txt` prints 1 or more, after a line `agent file without a registry record: zz-probe`. Observed: `scratch/probe.txt` shows `agent file without a registry record: zz-probe` and exit 1 with the file alone, then `agent-roster: OK` and exit 0 with the record added and the rosters rewritten.
- [x] T008 Remove the throwaway file and record and rewrite the rosters (`.skilled/agents/agent-registry.json`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`, and `git status --short .skilled/agents .claude/agents .codex/agents` prints no line. Observed: `agent-roster: OK`, exit 0. The registry and `README.txt` show no diff, a search for `zz-probe` across the runtime trees found nothing, and `orchestrate.md` equals the phase 3 expected file. `git status --short .skilled/agents` lists only `orchestrate.md`, which is the phase 3 change.
- [x] T009 Run the hub's vocabulary and version checks named in the hub `SKILL.md` and save the output (`scratch/after.txt`). Verify: the version check exits 0, and the vocabulary check reports the same drift count as on the commit before the edit. Observed: the version check printed `364 files | ok=357 skip-no-frontmatter=7`, exit 0. The vocabulary check printed `drift=6`, `RESULT: FAILED`, exit 1, and printed the same on a clean export of the commit before the edit. The verify clause was amended from `each check exits 0`, because that failure is older than this phase and is not from it.
- [x] T010 Run strict validation on this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/007-agent-alignment-follow-ups/004-agent-authoring-registry-step --strict --quiet` prints `RESULT: PASSED`. Observed: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh on this folder with `--strict --quiet` printed `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `scratch/probe.txt` shows the check failing without the record and passing with it, and `git status --short .skilled/agents` prints no line
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---
