---
title: "Implementation Plan: Phase 2: frontend-reach"
description: "Change the frontend vocabulary and add file markers in the hub's routing sources. Regenerate the compiled route. Prove it by replaying the 22 probes and counting which ones name `sk-code-frontend`."
trigger_phrases:
  - "frontend reach plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: frontend-reach

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|---|---|
| **Language/Stack** | JSON and Markdown routing sources, Node 24 |
| **Framework** | The compiled router under `.skilled/bin/` |
| **Storage** | None |
| **Testing** | Probe replay through `compiled-route.cjs` |

### Overview
Change the frontend vocabulary and add file markers in the hub's routing sources. Regenerate the compiled route. Prove it by replaying the 22 probes and counting which ones name `sk-code-frontend`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `spec.md` section 2 states the problem and section 3 lists the files to change
- [ ] Every requirement in `spec.md` section 4 names a command and its expected output
- [ ] The predecessor phase's handoff criteria are met, or this is phase 1

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [ ] The probe replay in section 5 prints `frontend 13/13`, `review 1/1` and `negative 0/8`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/002-frontend-reach --strict --quiet` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry-driven routing

### Key Components
- **`mode-registry.json`**: Gains the `surfaceDetection` block that lets file context select the surface
- **`hub-router.json`**: Holds the stage-one vocabulary the compiled router scores

### Data Flow
A prompt and an optional surface hint enter `compiled-route.cjs`. The vocabulary classes score the prompt. The decision lists the workflow mode first and the surfaces after it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `hub-router.json` vocabulary classes | Stage-one scoring source | update | Probe replay |
| `mode-registry.json` aliases and `surfaceDetection` | Packet contract and file markers | update | `compiled-route-sync.cjs --check` exits 0 |
| `ROUTER.md` and `sk-code-frontend/ROUTER.md` `INTENT_SIGNALS` | Stage-two intent sources | update | `run-all-drift-guards.sh` router legs pass |
| `sk-code-ci` and `sk-code-skilled` routing | Other surfaces on the same router | unchanged | Baseline comparison in REQ-007 |

Required inventories:
- Same-class producers: every ledger row this phase owns is one producer, listed by id in `tasks.md`.
- Consumers of changed files: the rows above name each one and what proves it is unaffected.
- Matrix axes: the ledger verdict (`Confirmed`, `Changed`, `Refuted`, `Judgment`) is the one input axis, and each task states which verdicts it acts on.
- Algorithm invariant: N/A, this phase changes no parser, resolver or security path.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup loads the hub routing rule and reads the compiler's contract for a second specific surface. Implementation edits the registry, the vocabulary copies and the playbook. Verification replays the probes and runs the hub gates.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|---|---|---|
| Unit | N/A: no code changes | None |
| Integration | 22 probes through the compiled router | `compiled-route.cjs` |
| Manual | Hub gates | `sk-code-setup-check.cjs` |

Probe replay, run from the repository root:

```bash
while IFS=$'\t' read -r kind prompt; do
  hit=$(node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "$prompt" | grep -c '"workflowMode":"sk-code-frontend"')
  echo "$kind $hit"
done < specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/scratch/probes.txt | sort | uniq -c
```

Single-word keyword count:

```bash
node -e "const v=require('./.skilled/skills/sk-code/hub-router.json').vocabularyClasses;const k=[...v['code-frontend-aliases'].keywords,...v['code-frontend-visual'].keywords];console.log(k.filter(x=>!/[ -]/.test(x)).length)"
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| `compiled-route-sync.cjs` | Internal | Green | The compiled route cannot be regenerated |
| Phase 001 baseline | Internal | Yellow | No regression comparison for REQ-007 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A `negative` probe names `sk-code-frontend`, or a baseline prompt changes its first target.
- **Procedure**: Revert the phase commit with `git revert <sha>` and rerun `node .skilled/bin/compiled-route-sync.cjs --check`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|---|---|---|
| Setup | The predecessor phase's handoff criteria | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closing this phase and starting `003-frontend-content` |
<!-- /ANCHOR:phase-deps -->

---

