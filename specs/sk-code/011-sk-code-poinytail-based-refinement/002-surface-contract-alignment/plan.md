---
title: "Implementation Plan: Phase 2: surface-contract-alignment"
description: "Brings every sk-code hub document to the one surface precedence order that stack-detection.md already states, adds Obsidian wherever the other surfaces are listed, corrects the stale stack-folder scenario and adds a workflow-plus-Obsidian canary case. The edits are Markdown and one JSON fixture, checked before and after through both routing stages, and the SKILL.md edit needs a compiled-routing re-mint because SKILL.md bytes feed the sk-code policy hash."
trigger_phrases:
  - "surface contract alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: surface-contract-alignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs and one JSON fixture; Node.js and Python 3 check scripts; bash |
| **Framework** | sk-code parent hub: stage one is the skill advisor, stage two is `hub-router.json` plus root `ROUTER.md`, served through the compiled router |
| **Storage** | None |
| **Testing** | `rg`, `verify_stack_folders.py`, `parent-skill-check.cjs`, `validate-playbook-package.cjs`, `skill_advisor.py`, `compiled-route.cjs`, `compiled-route-status.cjs`, `compiled-route-guard.cjs`, `compiled-route-admission.cjs`, and an inline assertion over the canary harness export `typedGold` |

### Overview
`shared/references/stack-detection.md:40` is the authority: OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN. This phase rewrites every hub line that states a different order or lists the surfaces without Obsidian. It also fixes the DR-004 scenario so it matches the validator, adds an Obsidian surface-detection scenario and two Obsidian advisor probes, and adds one surface-bundle canary case. Every routing check runs before the first edit and again after the last one, and the plan reports any difference.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-authority doc alignment. One reference states the contract and every other document is edited to restate it, with no new mechanism.

### Key Components
- **Authority**: `.skilled/skills/sk-code/shared/references/stack-detection.md:40` states the precedence, and the file loads on every route (`.skilled/skills/sk-code/ROUTER.md:320-324`, `DEFAULT_RESOURCE`).
- **Restating documents**: `shared/references/universal/code-quality-standards.md:53`, hub `SKILL.md:38,67,79,136,155-157,163,193`, `ROUTER.md:26,30,37,45,260,265,271,300`, `shared/README.md:31`, and the hub playbook files named in `tasks.md`.
- **Compiled router inputs**: `SKILL.md`, `hub-router.json` and `mode-registry.json`. The sk-code compiler hashes all three into `provenancePolicy.sourceHashes` (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:332-343`), and that hash set is part of `effectivePolicyHash` (`registry-compiler.cjs:355-356`). The compiler also parses `UNKNOWN_FALLBACK_CHECKLIST` out of `SKILL.md` and needs at least three quoted items (`registry-compiler.cjs:85-92`).
- **Canary fixture**: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:58-204` holds nine cases, one of them a single-mode Obsidian case (`:142-157`). None of them bundles a workflow mode with Obsidian.

### Data Flow
The advisor scores the prompt and picks `sk-code`. The compiled router then compiles the three hub inputs into a policy, compares its hash with the activation manifest at `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json`, and serves the compiled decision only when the two match (`.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:106-126`). Any change to `SKILL.md` bytes therefore changes the hash. A read-only in-memory compile at plan time confirmed it: the current policy hash `128cfc2b105f9fdc9a76f92fbdddacb2c9867df0daf0090f21dd4d16f1dcccb8` became `a349a07d11bab7c871e6c18eb767e3681b62578d51728c8ce2745275b971aa01` after a one-sentence change to line 136. Until the manifest is re-minted, `compiled-route.cjs --hub sk-code` prints `{"servingAuthority":"legacy","hubId":"sk-code"}` for every prompt. Edits to `ROUTER.md`, the references, the playbook and the fixture do not change the hash.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run every command from the repository root. `$S` is `specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/scratch`. Each check runs twice with `TAG=before` and `TAG=after`, and T040 diffs the two probe runs.

**Two-stage probe set.** Six prompts cover each surface through both routing stages:

```bash
S=specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/scratch
TAG=before   # set to after for the second run
while IFS='|' read -r id p; do
  a=$(python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "$p" --threshold 0.8 | jq -r '.[0] | "\(.skill) \(.confidence)"')
  r=$(node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "$p" | jq -c '{action,selectionKind,servingAuthority,modes:[.targets[]?.workflowMode]}')
  printf '%s\t%s\t%s\n' "$id" "$a" "$r"
done > "$S/$TAG-probes.tsv" <<'EOF'
W1|Add a Lenis smooth-scroll initializer to src/2_javascript/scroll.js and gate it behind an IntersectionObserver.
W2|review my webflow animation for jank
C1|Add set -euo pipefail and a trap to .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh to clean up the temp dir on exit.
C2|Handle empty prompts in .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts with a TypeScript console.error fallback.
B1|Rename the table cell classes in src/views/DatabaseView.ts of the Note Database Obsidian plugin to the .db-* naming convention.
B2|code review my obsidian plugin
EOF
```

Plan-time output of this loop on 2026-10-09, before any edit:

| ID | Advisor top-1 | Compiled route |
|----|---------------|----------------|
| W1 | sk-code 0.8617 | route single `sk-code-webflow` |
| W2 | sk-code 0.95 | route surfaceBundle `sk-code-review`, `sk-code-webflow` |
| C1 | system-spec-kit 0.8801 | route single `sk-code-quality` |
| C2 | sk-code 0.95 | route single `sk-code-opencode` |
| B1 | sk-code 0.9448 | route single `sk-code-obsidian` |
| B2 | sk-code 0.95 | route surfaceBundle `sk-code-review`, `sk-code-obsidian` |

**SA-001 battery.** The prompts are read from the scenario table itself, so P16 and P17 are picked up once T031 adds them:

```bash
grep -E '^\| [PN][0-9]+ \|' .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md \
  | sed -E 's/^\| ([PN][0-9]+) \|.*\| `([^`]+)`.*$/\1|\2/' \
  | while IFS='|' read -r id p; do
      printf '%s\t%s\n' "$id" "$(python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "$p" --threshold 0.8 | jq -r '.[0] | "\(.skill) \(.confidence)"')"
    done > "$S/$TAG-sa001.tsv"
```

Plan-time baseline: sk-code was top-1 on 11 of 15 positives (P1, P4, P11 and P15 went elsewhere) and on 2 of 5 negatives (N1 and N5). SA-001 therefore already fails its own aggregate rule (`advisor-probe-battery.md:58-59`) before this phase touches anything. This phase changes no advisor input, so the scores are expected to stay the same. SC-002 therefore judges each probe against its own baseline: no probe may get worse, and the new Obsidian probes P16 and P17 must give sk-code at 0.80 or higher. T041 holds the comparison. The battery's aggregate failure is out of scope.

**Canary assertion.** No existing command asserts the fixture's `expectedAction`, `expectedSelectionKind` and `expectedModes`; this is a gap. `harness/build-artifacts.cjs` is a generator, not a test. Run as a script, it writes `compiled/` and `activation/` under the `001-sk-code` folder and then reads `activation/manifest.prior.json` (`build-artifacts.cjs:137-155`), which does not exist there, so do not run it. The read-only assertion below uses only the harness exports `loadSnapshot` and `typedGold` (`build-artifacts.cjs:198-202`), which write nothing:

```bash
node -e '
const H=require("./.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs");
const {fixture,snapshot}=H.loadSnapshot();
const rows=H.typedGold(snapshot,fixture).cases;
let bad=0;
fixture.cases.forEach((c,i)=>{const r=rows[i];const modes=r.targetQualifiedIds.map(q=>q.split("/")[1]);
 const ok=r.decisionAction===c.expectedAction&&(!c.expectedSelectionKind||r.selectionKind===c.expectedSelectionKind)&&(!c.expectedModes||JSON.stringify(modes)===JSON.stringify(c.expectedModes));
 if(!ok)bad++;console.log(ok?"OK":"FAIL",c.id,r.decisionAction,r.selectionKind||"-",modes.join(","));});
console.log("cases",rows.length,"failures",bad);process.exit(bad?1:0)'
```

Plan-time result: `cases 9 failures 0`, exit 0. Evaluating the proposed new case in memory gave `route surfaceBundle sk-code-review,sk-code-obsidian`.

**Hub-routing rule.** `.skilled/repo-rules/skill-hub-routing.md` §3 requires the per-hub checker to run with the hub path, plus a replay of both stages: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code`. The plan-time result was an `OK: parent-skill-check` line reporting all hard invariants passed and 0 warnings, exit 0.

**Known red baseline.** `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` exits 1 before any edit, because its `alignment-drift` guard scans the whole repository and fails on files outside sk-code, while `stack-folders` passes. Only the stack-folders verdict and the exit-code delta count here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Research basis**: `../001-ponytail-deep-research/research/research.md` Sections 7 (D3), 8, 10 (idea 1) and 11 (recommendations 1, 3 and 5).
- **Phase 003 edits the same file**: `code-quality-standards.md:42-53` is phase 003's target (`research.md` Section 15). This phase changes only the parenthetical on line 53. Land this phase first, or phase 003 has to carry the same correction.
- **Compiled-routing re-mint (in scope, T035)**: the `SKILL.md` edits leave the sk-code activation manifest stale. T035 runs only after every `SKILL.md` edit is in place. It runs `node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code`, copies `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` over `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json`, and proves that `compiled-route.cjs` serves compiled routing and `compiled-route-guard.cjs` reports sk-code fresh. This is the same refresh-and-copy step the pre-commit route-remint gate prints (`.skilled/scripts/git-hooks/pre-commit:460-462`). If that gate later runs on the commit, it re-mints against the same inputs and finds nothing to change.
- **Authored copy of the canary fixture (in scope, T034)**: `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` is byte-identical to the promoted fixture today. `compiled-route-sync.cjs` rebuilds the promoted tree from that authored copy (`.skilled/bin/compiled-route-sync.cjs:4-23`), so T034 copies the edited fixture over it and `cmp` proves the two match.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

1. Restore every modified tracked file: `git restore --source=HEAD -- .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/ROUTER.md .skilled/skills/sk-code/shared/README.md .skilled/skills/sk-code/shared/references .skilled/skills/sk-code/manual-testing-playbook .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json`. All of these paths are tracked.
2. Delete the one new file: `.skilled/skills/sk-code/manual-testing-playbook/surface-detection/obsidian-detection.md`.
3. Restore the manifests together with `SKILL.md`, never on their own. A restored manifest next to an edited `SKILL.md`, or the reverse, leaves sk-code on legacy routing.
4. Confirm the rollback: `node .skilled/bin/compiled-route-guard.cjs` lists sk-code as `fresh`, and `node .skilled/bin/compiled-route-status.cjs --hub sk-code --pretty` reports `effectivePolicyHash` `128cfc2b105f9fdc9a76f92fbdddacb2c9867df0daf0090f21dd4d16f1dcccb8` with `causeCode` `compiled-serving`.
<!-- /ANCHOR:rollback -->

---
