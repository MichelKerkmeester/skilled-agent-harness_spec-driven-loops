---
title: "Implementation Plan: Phase 2: dsh-offline-contract-pin"
description: "Capture the dsh 0.2.2-rc.1 headless contract with read-only probes under disposable DSH_HOME directories and draft patches in scratch, then save each output verbatim under evidence. No provider call and no write outside the phase folder."
trigger_phrases:
  - "dsh offline contract pin plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: dsh-offline-contract-pin

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell probes, YAML draft patches, Node `-e` JSON parse |
| **Framework** | `dsh` 0.2.2-rc.1 headless profile |
| **Storage** | Text captures under `evidence/` |
| **Testing** | Exit codes, `node -e` JSON parse, `diff` of `~/.dsh` listings |

### Overview
The orchestrating Claude session runs each probe from a temp cwd with `DSH_HOME=$(mktemp -d)` and saves stdout, stderr and exit code under `evidence/`. Draft route, lineage and stub-plugin patches live in `scratch/` and never leave the phase. Authoring mode is `system-spec-kit` for the docs and `sk-code` (`sk-code-skilled` verification surface, shell) for the probes. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/phase-plan.md:66-83]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `command -v dsh` prints a path and `dsh --version </dev/null` prints `0.2.2-rc.1` under a temp `DSH_HOME`
- [x] `ls -R ~/.dsh` listing saved to `scratch/dsh-home-before.txt`
- [x] `env | rg -c 'LLMGATEWAY_API_KEY|OPENCODE_API_KEY|DEEPSEEK_API_KEY'` prints 0 in the probe shell (the keyless run used `env -i`, and stderr reports the key as not set)

### Definition of Done
- [x] All acceptance criteria met
- [x] `diff scratch/dsh-home-before.txt scratch/dsh-home-after.txt` prints nothing and the empty diff is saved in `evidence/`
- [x] `validate.sh <phase folder> --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: isolated read-only probes.

### Key Components
- **Disposable `DSH_HOME`**: a fresh `mktemp -d` per probe so first-boot profile writes stay out of `~/.dsh`.
- **Draft patches in `scratch/`**: one route patch per roster entry, one lineage patch and one stub relative-plugin patch.

### Data Flow
A probe command reads the draft patches, composes the headless profile in its temp home and writes stdout, stderr and the exit code to files under `evidence/`. Nothing flows back into the repository outside the phase folder.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: this phase fixes no reported finding and changes no shared surface. It only writes inside its own folder.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup saves the `~/.dsh` listing and drafts the patches. Implementation runs the probes. Verification parses the captures and diffs the listing.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The last stdout line of the keyless run | `node -e` JSON parse exits 0 |
| Integration | Route plus lineage patch composition | `dsh --dump-config` per route, `rg` for provider, model and disabled rows |
| Manual | Home isolation | `diff` of the `~/.dsh` listings prints nothing |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `dsh` 0.2.2-rc.1 on the path | External | Green (`command -v dsh` prints `/Users/michelkerkmeester/.local/bin/dsh`) | No probe can run |
| npm registry read for `npm view` | External | Green (`evidence/dist-tags.json` captured 2026-11-06) | `dist-tags.json` waits and REQ-001 stays open |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a probe wrote into `~/.dsh` (the listing diff is not empty) or a capture holds a credential.
- **Procedure**: delete the offending file under `evidence/`, report the `~/.dsh` diff to the operator, who decides whether to remove the new entries, and rerun the probe with a fresh temp `DSH_HOME`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (listing, drafts) | Phase 001 synthesis | Implementation |
| Implementation (probes) | Setup | Verification |
| Verification (parse, diff, validate) | Implementation | Phases 003, 004, 006 and 008 |
<!-- /ANCHOR:phase-deps -->

---

