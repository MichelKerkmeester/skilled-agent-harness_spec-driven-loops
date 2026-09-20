---
title: "Plan: align sk-doc's root ROUTER.md with all fourteen registered modes"
description: "Baseline first, then apply the four recorded deltas, then close the routing holes the replay found, with a negative control on the parity check and a byte-identical advisor regression as the closing gate."
trigger_phrases:
  - "router alignment plan"
  - "replay before and after"
  - "byte identical advisor regression"
  - "plan core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: align sk-doc's root ROUTER.md with all fourteen registered modes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:approach -->
## 1. APPROACH

Measurement decides the work. The structural properties the brief names (key parity, leaf
resolution, `FULL_INVENTORY` completeness) are cheap to check and were already clean, so
the packet's value is in the behavioural check no gate performs: replay one realistic
request per registered mode and read what each stage returns.

Four principles held throughout.

**Baseline before anything.** The advisor regression, both named gates, the compiled
route guard, the command-binding test and a 23-probe replay were captured into
`scratch/baseline/` before the first edit. Nothing was stashed to compare, because the
tree is shared.

**Additive, never substitutive.** Every routing change adds vocabulary or an intent. No
keyword was deleted and no leaf was removed from any intent, which is what makes REQ-005
checkable as a subset relation rather than an argument.

**Fix both stages when they disagree.** `repo-rules/skill-hub-routing.md` section 1 is
explicit: a stage-one hit with no stage-two intent, or the reverse, means the two
disagree about the same phrasing, and the fix belongs on both sides.

**A change is not finished while it leaves documents lying.** Nulling the command binding
falsified statements in three files; repairing them is part of the change, not a separate
tidy-up.
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:decisions -->
## 2. DECISIONS

| Decision | Chosen | Rejected, and why |
|---|---|---|
| `/doc:quality` | Set the registry field to `null` | Build the command. It adds a third entry to an already-red bridge guard, and regenerating the bridges rewrites the two advisor files REQ-003 requires byte-stable |
| `defaultResource` | Prepend `ROUTER.md`, keep the cheat sheet | Replace the cheat sheet. That would strip its only router binding to fix a problem that adding one entry solves |
| Defer branch | Read `routerPolicy.defaultResource` | Hardcode the second path in `SKILL.md`. Two sources for one fact is what caused the drift |
| Agent and command lanes | Add two intents beside `AGENT_COMMAND` | Split `AGENT_COMMAND` in two. Replay proved the paired case then loses half its leaves to the ambiguity delta |
| Parent hub | A separate `PARENT_HUB` intent | Fold the templates into `SKILL_CREATION`. That pulls six hub templates into every plain skill request |
| `quality-actions` width | Leave it, record it | Narrow it. It changes what all fourteen modes receive and needs its own full-matrix measurement |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:proof -->
## 3. PROOF PLAN

Defined before the first file changed.

| # | Check | Command | Pass condition |
|---|---|---|---|
| 1 | Structural parity | `node scratch/align-check.cjs` | exit 0; equal key sets; zero unresolved leaves; `FULL_INVENTORY` a superset |
| 2 | Both stages, every mode | `node scratch/replay.cjs scratch/tasks.txt scratch/after-replay` | no `(none)` in either stage column on the fourteen mode rows |
| 3 | Advisor untouched | `skill_advisor_regression.py --dataset fixtures/skill-advisor-regression-cases.jsonl` | report deep-equals `scratch/baseline/reg-baseline.json` |
| 4 | Named gates | `parent-skill-check.cjs .opencode/skills/sk-doc`; `ci-skill-root-metadata.cjs` | both diff clean against baseline; 14 modes, 0 warnings; 14/14 |
| 5 | Negative control | add a signals-only intent, run checks 1 and 4 | both fail, naming the orphan; restore byte-identical |
<!-- /ANCHOR:proof -->

---

<!-- ANCHOR:sequence -->
## 4. SEQUENCE

### Phase 1: Setup

Read the four Wave A specs and extract every item addressed to this stream. Load
`REPO RULES.md`, then the two rule files its trigger table names for this work.
Capture every baseline into `scratch/baseline/` before touching a file. Read the machine
contracts that will judge the result: `router-replay.cjs` scoring semantics,
`root-router-contract.cjs` violation codes, `leaf-resource-contract.cjs` pair resolution,
and the two advisor tests that read the registry.

### Phase 2: Implementation

Apply the four recorded deltas, then the routing additions, replaying after each edit
rather than at the end. Repair the statements the registry edit falsified. Regenerate
`leaf-manifest.json` once.

### Phase 3: Verification

Run the negative control on the parity check and restore byte-identical, then the full
proof plan from the final state, diffing each gate against its baseline.
<!-- /ANCHOR:sequence -->

---

<!-- ANCHOR:rollback -->
## 5. ROLLBACK

Nothing is committed and nothing is pushed. Every change is a working-tree edit to 23
tracked files under `.opencode/skills/sk-doc/` plus this new spec folder;
`git checkout -- .opencode/skills/sk-doc` reverses all of it, and `leaf-manifest.json`
regenerates byte-identically either way. No data, no schema, no deployed surface is
touched, and no gate that was green is left red.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:references -->
## 6. REFERENCES

- `specs/sk-doc/039-create-with-human-voice/spec.md` section 6, items for this stream
- `specs/sk-doc/041-quality-control-assessment/spec.md` section 7, three recorded items
- `specs/sk-doc/042-sk-doc-shared-audit/spec.md` section 9.1, the `defaultResource` item
- `specs/sk-doc/043-repo-rules-router-audit/implementation-summary.md`, the transfer verdicts
- `repo-rules/skill-hub-routing.md`, the two-stage rule and the narrow-alias rule
<!-- /ANCHOR:references -->

---
