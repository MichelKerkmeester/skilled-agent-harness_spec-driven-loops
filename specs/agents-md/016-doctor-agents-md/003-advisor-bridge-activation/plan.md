---
title: "Implementation Plan: Activate the doctor helper and agents-md advisor bridges"
description: "Four activation entries in one list feed the deriver, which regenerates three tracked surfaces and one rendered lookup; the reach probe then proves all 28 bridges over every declared phrase, and the ratchet proves no skill score moved."
trigger_phrases:
  - "advisor bridge activation plan"
  - "bridge activation gates"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Activate the doctor helper and agents-md advisor bridges

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and Python generated from one Node deriver, plus JSON fixtures |
| **Framework** | The advisor package (`vitest`, `node:test`, `pytest`) |
| **Storage** | None. The probe and the ratchet score from a filesystem projection under an empty database directory |
| **Testing** | `vitest` for the advisor, `node:test` for the doctor scripts, `pytest` for the Python lane |

### Overview
The activation list is the only hand-written input. Adding four entries there and running the deriver once rewrites the bridge inventory, the TypeScript projection and the Python markers, and the deriver's own `--check` mode then proves the three copies match the inputs. The reach probe, the routing slice, the ratchet and the two suites decide whether the result is correct, so none of them is a restatement of the edit.
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
- [x] `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` exits 0 with `STATUS=OK phrases=164 bridges=28`
- [x] Docs updated (spec/plan/tasks/implementation summary, the catalog note, the advisor changelog)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Generated-projection pipeline. One activation list, one deriver, three generated consumers.

### Key Components
- **`scoring-compatibility.json`**: the hand-written activation list, one entry in each lane per bridge.
- **`derive-command-bridges.cjs`**: reads the route manifest, the allow list and the command metadata, merges the activation list, and writes the inventory plus the two generated projection blocks.
- **`doctor-phrase-reach.cjs`**: recomputes the admitted bridges from the manifest and the activation list, then scores every declared phrase and runnable string through the built scorer.
- **`doctor-prompts.jsonl`**: the routing slice, whose waves activate with the bridges they name.

### Data Flow
A route's manifest phrases and runnable string flow into the deriver, which writes them into the three generated surfaces. At scoring time the projection carries the bridge and the scorer weighs a prompt against its phrases; the probe and the slice suite read the same scorer the brief does, so a bridge that is admitted but unreachable fails there rather than at a session.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Four independent gates, each answering a different question. The probe answers "does every advertised wording reach its own bridge". The slice suite answers "does a prompt land where the fixture says, with the second line the brief actually renders". The ratchet answers "did any skill score move", which is the one risk a doctor bridge could carry into unrelated routing. The two suites answer "did anything else break", and the doctor suite adds the route-manifest contract on top.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `@spec-kit/shared` build and the advisor `tsc` build must both succeed before any probe runs, because the probe refuses a `dist/runtime` older than its source. The derivation depends on `yaml` for the manifest read. Nothing else is new.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete the four entries from `scoring-compatibility.json`, rerun the deriver and the advisor build, and delete the thirteen slice rows and the changelog entry. The four bridges return to derived-and-inactive, the probe reports 24 bridges again, and the version returns to the previous one. No route, phrase, workflow or dataset changes, so nothing else needs reverting.
<!-- /ANCHOR:rollback -->

---
