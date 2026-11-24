---
title: "Implementation Plan: Phase 14: fix-deep-review-findings"
description: "Fix the 20 distinct defects of the hub deep review in five file-owner lanes run in parallel, then close the parent and phase docs from the orchestrating session. Proof is the installer parity test, the hub gates and a new two-stage routing replay."
trigger_phrases:
  - "fix deep review findings plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 14: fix-deep-review-findings

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash installer scripts, JSON routing registries, Markdown skill and spec docs |
| **Framework** | Skilled parent-hub skills, the skill advisor and the compiled hub router |
| **Storage** | None |
| **Testing** | `node --test`, `parent-skill-check.cjs`, `validate-playbook-package.cjs`, vitest, `validate.sh --strict` |

### Overview
The phase fixes the defects in their source files: one helper copy, two installers, three mode packets, the hub routing vocabulary and six spec packets. Five lanes own disjoint file sets and run at the same time, and the orchestrating session closes the files that depend on lane results. The installer parity test, the hub gates and a new two-stage replay prove the result.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: `spec.md` names one requirement per distinct defect
- [x] Success criteria measurable: each `acceptance-criteria.md` row names its command
- [x] Dependencies identified: the parity test fails as the review said (`tasks.md` T001)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/bin/tests/mcp-installers.test.cjs` prints `pass 5` and `fail 0`, and `validate.sh --strict --recursive` on the hub prints `RESULT: PASSED` for every folder
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at source

### Key Components
- **Lane A, Chrome DevTools and the shared helper**: owns `.skilled/skills/mcp-code-mode/scripts/_utils.sh`, the `mcp-code-mode` changelog and version line, and everything under `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/`. Tasks T004 to T006.
- **Lane B, Aside**: owns everything under `.skilled/skills/mcp-browser-use/mcp-aside-devtools/`. Tasks T007 to T010.
- **Lane C, Bladebro**: owns everything under `.skilled/skills/mcp-browser-use/mcp-bladebro/`, plus `004-bladebro-mode/spec.md` and `001-research/research/research.md`. Tasks T011 to T014.
- **Lane D, hub routing**: owns the hub root files (`SKILL.md`, `ROUTER.md`, `README.md`, `mode-registry.json`, `hub-router.json`, `graph-metadata.json`, `description.json`, `leaf-manifest.json`, `changelog/`), a new folder under `benchmark/reports/compiled-routing/`, and the generated routing artifacts its official rebuild commands write. It alone may rebuild or replay the advisor. Tasks T015 to T017.
- **Lane E, phase packet docs**: owns `003-mode-relocation/{goal.md,acceptance-criteria.md,implementation-summary.md}`, `004-bladebro-mode/{goal.md,implementation-summary.md}`, `005-routing-and-surfaces/goal.md` and `011-bdg-eval-port-note/goal.md`. Tasks T018 to T021.
- **Lane O, the orchestrating session**: owns the parent `spec.md`, `goal.md` and `graph-metadata.json`, `005-routing-and-surfaces/{implementation-summary.md,tasks.md}` and this packet. Tasks T022 to T031.
- **Lane S, the advisor scorer, owned by the orchestrating session under Q001**: owns `system-skill-advisor/runtime/lib/scorer/{fusion.ts,scoring-constants.ts,lanes/explicit.ts,lanes/lexical.ts}`, the ratchet baseline `scripts/routing-accuracy/scorer-eval-baseline.json`, the `tsUnknown` bound in `tests/parity/python-ts-parity.vitest.ts` (Q003), the command routing baseline, the doctor slice row and the divergence ledger (Q004), the advisor `SKILL.md` version line and its `changelog/`, and the `dist/` build the runtime's own `npm run build` writes. Every variant is scored in-process from the TS source before one is built, and the corpus gate accepts a variant only when no ratchet metric drops.

### Data Flow
Lanes A to E read the review registry as data and write only their owned files. Lane O reads each lane's report, checks the diff against the owned list, then writes the files that quote lane results: 003 criterion 4 after lane A, the 005 notes after lane D, and the parent packet last.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Imported from the review's Planning Packet as inert data, then checked against the tree by the plan explorers and this session. `fixCompletenessRequired` is true. The finding classes imported are `regression`, `security-contract-contradiction`, `stale-goal-state`, `traceability-drift`, `packet-doc state drift`, `non-durable-criterion`, `template residue`, `stale-parent-metadata`, `continuity drift`, `supply-chain-hardening`, `unpinned-dependency`, `release-history-drift`, `doc-drift-after-live-result`, `stale example after a verified fix`, `scenario-precondition-gap`, `evidence-retention-gap`, `doc-contract-drift`, `orphaned-unmet-requirement`, `brittle-acceptance-evidence`, `understated-known-limitation` and `alias-overreach`. The opus-1 ids carry `UNKNOWN`.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp-chrome-devtools/scripts/_utils.sh:160,164` | Producer: the changed helper copy | update | Parity test `.skilled/bin/tests/mcp-installers.test.cjs:49-55` |
| `mcp-code-mode/scripts/_utils.sh:160,164` | Producer: the second copy, held identical by the test | update | Same test, and `mcp-code-mode/scripts/README.md:70` already claims parity |
| `mcp-chrome-devtools/scripts/install.sh:30,315` and `mcp-code-mode/scripts/install.sh:29,169` | Consumers: each passes `MIN_NODE_VERSION` explicitly (20 and 18) | unchanged | `rg -n 'MIN_NODE_VERSION' ` on both scripts |
| `mcp-chrome-devtools/scripts/install.sh:28` | Producer: installs `browser-debugger-cli@alpha`, which resolves to 0.7.2 today | update to `@0.6.10` | `npm view browser-debugger-cli dist-tags` and `rg -n '@alpha'` |
| Live docs under `mcp-chrome-devtools/` naming `@alpha` (SKILL.md, INSTALL-GUIDE, README, references, mcp-servers, catalog and playbook files) | Consumers: tell agents what to install | update | `rg -n 'browser-debugger-cli@alpha' ` prints nothing outside changelog and reports |
| `mcp-chrome-devtools/changelog/v1.0.27.0.md` | Published release note that 013 rewrote | restore to its 011 text | `git log --follow` and `git diff` against the 011 commit |
| `mcp-bladebro/SKILL.md:60` | Producer: the ungated `npx -y bladebro mcp` offer | update | `rg -n 'npx -y bladebro'` |
| `mcp-bladebro/references/mcp-wiring.md:44`, `mcp-servers/bladebro-mcp/README.md:35`, `feature-catalog/transport/mcp-code-mode-lane.md:26` | Consumers: already gate the npx path on an operator yes | add the `4.8.2` pin where missing | Same `rg` |
| `004-bladebro-mode/spec.md:82`, `001-research/research/research.md:57` | Packet copies of the npx rule | gate it, with an amendment note in the research | Same `rg` |
| `.utcp_config.json` `bladebro` manual | Launches the installed `bladebro mcp` binary | not a consumer: no `npx` launch | `rg -n -A8 '"bladebro"' .utcp_config.json` |
| `mcp-bladebro/scripts/install.sh:111,122-139` and `doctor.sh:19-20,75-101` | Producer and checker of the install order and the digests | update both together | `bash -n`, `rg -n 'ignore-scripts'` |
| `mcp-aside-devtools/SKILL.md:147`, `README.md:189`, catalog rows | Teach `page.on` and `page.context()`, which throw on Aside 1.26.626.1517 | update | `rg -n 'page\.on\(|page\.context\(\)'` |
| `mcp-aside-devtools/examples/repl-evidence-capture.sh:12` and `examples/README.md:51` | Example default path | update to the `./tmp/` form | `bash -n` and `rg -n 'OUT_DIR='` |
| `mcp-aside-devtools/manual-testing-playbook/manual-testing-playbook.md:35` | Hand-typed census | update | Playbook validator `warnings=0` |
| `mcp-bladebro/manual-testing-playbook/real-browser/attach-mode-reads.md:45` | BB-015 launch steps | add the Chrome 136+ precondition and triage row | `rg -n '136'` |
| `mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/` | Live-run evidence citations | re-anchor or disclose | Listing against every cited path |
| `hub-router.json:101` and `ROUTER.md:51` (`my own chrome` to Chrome DevTools), `hub-router.json:164-165` and `ROUTER.md:54` (caller-owned to Bladebro) | Producers of the own-Chrome split | state the rule in `SKILL.md:30` and `ROUTER.md` | `rg -n -i 'own chrome'` |
| `hub-router.json:91,125,153-154`, `mode-registry.json:43,74,116-117`, `graph-metadata.json` vocabulary | Generic aliases `lighthouse`, `aside`, `rb attach`, `rb status` | tighten | Advisor and hub-router replay of the R6, R7 and 005 REQ-009 phrases |
| `benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/` | Six recorded rows, each holding a literal keyword | leave as history, add a new dated run | New run's `results.csv` |
| `system-skill-advisor/runtime/lib/scorer/fusion.ts:1207` (`confidenceFor` call site) and `confidenceFor` itself | Producer: lifts any skill with task intent and a lexical hit to the 0.82 floor, with no explicit anchor | gate the floor branches on an explicit-lane score | Ratchet `tests/parity/scorer-eval-baseline-ratchet.vitest.ts`, the 49-row two-stage replay |
| `system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:47` (`har` token boost) and `lanes/lexical.ts:30` (`har` category hint) | Producers: a bare `har` token anchors the browser hub in two lanes | drop both | Same ratchet and replay rows MBU-N-08, MBU-N-14, MBU-T-03, MBU-P-05, MBU-P-14 |
| `system-skill-advisor/runtime/lib/scorer/fusion.ts` `readOnlyRouteAllowed` browser regex | Producer: a bare "performance trace" lifts the hub to 0.82 on any prompt | narrow to a browser word beside it | Replay rows MBU-N-07, MBU-N-17, MBU-P-07 |
| `003`, `004`, `005`, `011` goal and closure docs, parent `spec.md`, `goal.md`, `graph-metadata.json` | Packet state the review compared with the tree | update | Each criterion's own check, and `validate.sh --strict --recursive` |

Required inventories:
- Same-class producers: `rg -n 'npx -y bladebro|browser-debugger-cli@|page\.on\(|page\.context\(\)|/tmp/aside' .skilled/skills/mcp-browser-use` and `rg -n "rg -c" specs/mcp/mcp-browser-use/001-mcp-browser-use-hub --glob '!review*/**'`.
- Consumers of changed symbols: `rg -n '_utils.sh|check_node_version|MIN_NODE_VERSION' .skilled` (two sourcing installers, two explicit minimums) and `rg -n 'PINNED_VERSION|DIGEST_' .skilled/skills/mcp-browser-use/mcp-bladebro`.
- Matrix axes: routing replays cover mode (3) by request kind (named tool, tie-break, paraphrase, out-of-domain). The new run keeps the 6 original rows and adds at least one paraphrase per tie-break and every out-of-domain phrase the review names.
- Algorithm invariant: no doc or script fetches or launches a package without an exact version, a digest check and an operator yes. Adversarial cases: a missing binary, a launcher digest mismatch and a future version that adds a lifecycle script.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reproduces the parity failure and records the gate baselines. Implementation runs lanes A to E in parallel, then lane O closes the dependent docs. Verification diffs each lane against its owned files and reruns every gate from the final tree.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The two helper copies and both installers' syntax | `node --test .skilled/bin/tests/mcp-installers.test.cjs`, `bash -n` |
| Integration | Hub structure, playbooks, routing both stages, advisor scorer | `parent-skill-check.cjs`, `validate-playbook-package.cjs`, `skill-advisor.cjs advisor_recommend`, `compiled-route.cjs --hub mcp-browser-use`, `npx vitest run` |
| Manual | Reading each corrected doc against the live result it reports | Read of the cited file and line |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The skill advisor runtime and compiled hub router | Internal | Green | Lane D cannot prove the alias fixes, so T016 to T017 stay open |
| The npm registry, read-only (`npm view`) | External | Green | The bdg pin and the Bladebro script facts could not be rechecked |
| Installed `bladebro` 4.8.2 and `bdg` 0.6.10 | External | Green | The launcher digest could not be read from the installed package |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate that passed at baseline fails after the lanes land, or a routing replay drops a real browser request.
- **Procedure**: `git restore --source=HEAD -- <the lane's owned paths>` for the lane that caused it, then rerun the gate. Nothing is committed until the operator says so, so no commit needs reverting.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The review registry and the baselines | Implementation |
| Implementation | Setup, and lanes A and D before lane O's dependent tasks | Verification |
| Verification | Every lane report checked against its owned files | Closing this packet |
<!-- /ANCHOR:phase-deps -->

---
