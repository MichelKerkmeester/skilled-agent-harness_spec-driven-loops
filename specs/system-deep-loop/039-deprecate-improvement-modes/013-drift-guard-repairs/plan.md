---
title: "Implementation Plan: Phase 13: drift-guard-repairs"
description: "Recapture the routing corpus baseline into this phase and update router-sync check 1b to respect Git ignore rules."
trigger_phrases:
  - "drift guard repairs plan"
  - "routing corpus proof commands"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13: drift-guard-repairs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, Node.js, Python 3 and Git |
| **Framework** | GitHub Actions routing drift workflow |
| **Storage** | JSON baseline artifacts under this child |
| **Testing** | Node.js built-in test runner, Vitest and the corpus scorer |

### Overview
Lane 01 will make router-sync check 1b apply Git ignore rules to its filesystem walk. Lane 02 will recapture the full routing baseline into this child and repoint the workflow to the new artifacts. Both lanes keep the current CI floors and leave corpus rows and the archived baseline unchanged.

### Starting Measurements

The corrected measurement in the decision ledger uses commit `4edbf2c666` with `SYSTEM_SKILL_ADVISOR_DB_DIR` set to a new empty directory, built-in semantic scoring off and forced local scoring. The corpus scorer passed with the workflow's exact floors before the stale pin was repaired. Source: [decision-ledger.txt, line 15](scratch/evidence/decision-ledger.txt#L15).

| Metric | CI-regime result | Existing floor |
|--------|--------------|----------------|
| Advisor accuracy | 0.5487 | Minimum 0.5333 |
| Gate 3 F1 | 0.9843 | Minimum 0.9843 |
| Joint TT | 104 | Minimum 101 |
| Joint TF | 87 | No separate floor |
| Joint FT | 3 | Maximum 3 |
| Joint FF | 1 | Maximum 1 |

The corrected values match the independent re-score in [lane-02-baseline-recapture.txt](scratch/evidence/lane-02-baseline-recapture.txt). The scorer ratchet passed 7 of 7 checks and the golden prompt suite passed 10 of 10. The CI run on main remains pending.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Both lane scopes are recorded in `scratch/files.txt`.
- [ ] The ledger and current workflow floors are reviewed.
- [ ] Lane evidence paths are available for final review.

### Definition of Done
- [ ] REQ-001 and REQ-002 pass their stated checks.
- [ ] The generated metadata matches the final packet docs.
- [ ] Both strict validators and the runtime proof commands pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Keep the two repairs independent until review. The router-sync lane changes the check and its test. The baseline lane captures new artifacts in this child and changes only the workflow's baseline pointer.

### Key Components
- **Lane 01**: `verify-router-sync.cjs` applies Git ignore rules to check 1b. Its regression test covers an ignored cache doc and a non-ignored untracked doc.
- **Lane 02**: `capture-top3.mjs` records top-3 results. Six files under `baseline/` hold the recaptured hashes, metrics and raw output.
- **Workflow**: `routing-registry-drift.yml` reads the child baseline and keeps the existing thresholds.

### Data Flow
The baseline capture reads the current routing corpus and scorer outputs, records the corpus hashes and writes its evidence under this child. The workflow validates those hashes before it runs the corpus scorer. Check 1b walks the documentation files, filters Git-ignored paths when the hub is a repository and reports every remaining unrouted doc. If Git is missing or the hub is not a repository, it keeps the full walked list.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Lane 01: Router-sync ignore filtering
Update check 1b to apply Git ignore rules. Preserve the full walk when Git is missing or the hub is not a repository. Add regression cases for an ignored `.pytest_cache/README.md` and a non-ignored untracked doc.

### Lane 02: Full baseline recapture
Run the phase-local capture script and record the corpus hashes, scorer metrics and raw command output in six files under `baseline/`. Repoint the workflow to this child's baseline. Keep every CI floor unchanged.

### Review and metadata
Review both lane diffs and the two lane evidence files. Confirm that the changed paths match `scratch/files.txt`. Refresh `description.json` and `graph-metadata.json` from the final docs after lane integration.

### Closeout
Run the proof commands below and both strict spec validators. Commit the scoped changes, push the branch and confirm the routing drift CI run on main.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The decision ledger records the starting measurements above. Re-run the workflow's proof commands after the lane outputs are reviewed.

**Router-sync proof**

```bash
node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs
node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 1b
bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh
```

**Corpus proof**

Run the golden prompt and scorer ratchet suites from the advisor runtime:

```bash
(cd .opencode/skills/system-skill-advisor/runtime && npx vitest run tests/routing-golden-prompts.vitest.ts)
(cd .opencode/skills/system-skill-advisor/runtime && npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts)
```

Run the corpus scorer with the exact floors used by the workflow:

```bash
(cd .opencode/skills/system-skill-advisor/runtime && python3 scripts/routing-accuracy/score-routing-corpus.py   --dataset "$PWD/scripts/routing-accuracy/labeled-prompts.jsonl"   --min-advisor-accuracy 0.5333   --min-gate3-f1 0.9843   --min-joint-tt 101   --max-joint-ft 3   --max-joint-ff 1   --require-historical-clean)
```

The workflow's SHA-256 pin check must accept the child baseline before this scoring command runs.

**Packet validation**

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-deep-loop/039-deprecate-improvement-modes/013-drift-guard-repairs --strict
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-deep-loop/039-deprecate-improvement-modes --strict
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The router-sync guard, its Node.js test and the routing drift workflow.
- The current routing corpus and scorer in the advisor runtime.
- Git for ignore checks, corpus revision identification and the workflow's commit context.
- The two lane evidence files under `scratch/evidence/`.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If a proof command fails, revert only the scoped router-sync, test, workflow, capture-script and child-baseline changes. Keep the corpus rows and archived baseline untouched. Re-run the failed proof command after the rollback.
<!-- /ANCHOR:rollback -->

---
