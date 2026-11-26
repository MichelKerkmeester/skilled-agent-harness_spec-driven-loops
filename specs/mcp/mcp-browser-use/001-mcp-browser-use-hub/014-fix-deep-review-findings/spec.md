---
title: "Feature Specification: Phase 14: fix-deep-review-findings"
description: "The deep review of the browser-use hub epic returned FAIL with 2 distinct P1 and 18 distinct P2 defects. This phase fixes every one of them so a follow-up review can pass."
trigger_phrases:
  - "fix deep review findings"
  - "phase 14 fix deep review findings"
  - "browser hub deep review remediation"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 14: fix-deep-review-findings

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-24 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 14 |
| **Predecessor** | 013-fix-alignment-findings-for-browser-hub-docs |
| **Successor** | None |
| **Handoff Criteria** | `node --test .skilled/bin/tests/mcp-installers.test.cjs` passes 5 of 5, and every row of `acceptance-criteria.md` is Met |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the mcp-browser-use hub epic. It acts on the deep review recorded in `../review/review-report.md`.

**Scope Boundary**: the files each finding in `../review/deep-review-findings-registry.json` `openFindings` cites, the same-class siblings the plan's affected-surfaces table names, and the release entries the fixes require. Nothing else.

**Dependencies**:
- The review registry and report in `../review/`, read as data.
- Phases 003, 004, 005, 011 and the parent packet, whose docs some findings correct.

**Deliverables**:
- Both P1 defects fixed, with the installer parity test green.
- All 18 distinct P2 defects fixed or closed by a recorded decision.
- Phase and parent packet state that matches the tree.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep review of phases 001 to 013 returned FAIL. Phase 013 changed one of two installer helper copies that a test requires to be identical, so the parity test is red, and the Bladebro lane rule offers an unpinned `npx -y` launch without an operator yes. Eighteen smaller defects leave packet state behind the tree, installers on floating or unverified packages, docs teaching calls that throw, and routing vocabulary that leaks.

### Purpose
Every finding in the review registry is fixed at its source, so the installer parity test passes and a follow-up deep review can record `checklist_evidence` as pass.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node --test .skilled/bin/tests/mcp-installers.test.cjs
  ✖ both copies of the helper library are identical
ℹ tests 5
ℹ pass 4
ℹ fail 1
(exit 1)

$ diff .skilled/skills/mcp-code-mode/scripts/_utils.sh .skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh
160c160
<     local min_version="${1:-18}"
---
>     local min_version="${1:-20}"
164c164
<         log_info "Install Node.js 18+ from: https://nodejs.org/"
---
>         log_info "Install Node.js ${min_version}+ from: https://nodejs.org/"
(exit 1)

$ rg -n 'npx -y bladebro' .skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md
60:- **MCP through Code Mode** with `bladebro mcp` (or `npx -y bladebro mcp`) when the binary is unavailable, ...

$ grep -n '@alpha' .skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh
28:readonly MCP_PACKAGE="browser-debugger-cli@alpha"

$ npm view browser-debugger-cli dist-tags --json
{ "alpha": "0.7.2", "latest": "0.23.0" }

$ bdg --version
0.6.10

$ npm view bladebro@4.8.2 scripts --json
(empty: the package declares no lifecycle scripts)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Restore installer helper parity so both `_utils.sh` copies are identical again.
- Remove the ungated `npx -y bladebro mcp` offer and harden the Bladebro installer's ordering and launcher check.
- Pin the Chrome DevTools installer and its docs to `browser-debugger-cli@0.6.10`, the version the docs describe.
- Correct Aside capture guidance, its example default path and its playbook census, the BB-015 browser precondition and the ClickUp evidence citations.
- State the own-Chrome attach rule, tighten generic aliases and widen tie-break vocabulary, with a new two-stage replay that records paraphrase and out-of-domain rows.
- Bring the 003, 004, 005, 011 and parent packet docs in line with the tree, and cut Chrome DevTools and Aside releases for the 013 and 014 changes.
- Fix the shared advisor scorer so stage one stops lifting `mcp-browser-use` to the 0.82 confidence floor on out-of-domain prompts that carry only lexical overlap, and stops reading a bare `har` token as a browser anchor. The operator widened the scope to this on 2026-11-24 (decision Q001 in `decision-record.md`), so AC-018, AC-020 and goal criterion 5 stay as written. The fix that landed makes the task-intent floor require the prompt to name the skill: an explicit-lane hit, a declared lexical hint, a lexical score of 0.45 or more, or the noun the skill id ends in. It also drops the bare `har` token and hint, and narrows the browser read-only lift to "chrome performance trace" or "browser performance trace". It moves `unknown_count` from 13 to 14 on one already-wrong corpus row (decision Q003). A stricter gate cost typed `/create:` rows and a bare "doctor" control, so the operator asked for a narrower anchor and approved its re-pins (decision Q004).

### Out of Scope
- A live browser rerun of the ClickUp playbook - it needs an operator-approved live session, so the evidence finding is closed by disclosure instead.
- Installing or upgrading bdg or Bladebro - an install is an operator stop-for-yes, and no finding needs one.
- The `mcp-code-mode` and `mcp-mobbin` playbook census warnings - they are outside the browser hub and were not raised by the review.
- Rerunning the deep review inside this phase - the operator chose to run it after the 014 commit (decision Q002).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/mcp-code-mode/scripts/_utils.sh`, `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh` | Modify | Make the two helper copies identical |
| `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/` (install script, SKILL.md, INSTALL-GUIDE, references, changelog) | Modify/Create | Pin bdg 0.6.10, restore the 1.0.27.0 note, add 1.0.28.0 |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/` (SKILL.md, README, catalog, example, playbook root, changelog) | Modify/Create | Capture guidance, example path, derived census, 1.1.13.0 entry |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/` (SKILL.md, install and doctor scripts, BB-015, ClickUp report, changelog) | Modify/Create | Gate the npx path, install order and launcher digest, Chrome 136+ precondition, evidence citations |
| `.skilled/skills/mcp-browser-use/` root (SKILL.md, ROUTER.md, mode-registry.json, hub-router.json, graph-metadata.json, benchmark/reports/compiled-routing/) | Modify/Create | Own-Chrome rule, alias and tie-break vocabulary, a new two-stage replay |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/` (parent spec, goal, graph metadata, and the 001, 003, 004, 005, 011 docs) | Modify | Packet state that matches the tree |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/{fusion.ts,scoring-constants.ts,lanes/explicit.ts,lanes/lexical.ts}` | Modify | Stop the task-intent floor lifting a skill the prompt does not name, stop a bare `har` token or hint anchoring the browser hub, and stop a bare "performance trace" lifting it (Q001) |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/{scorer-eval-baseline.json,command-routing-baseline.json,doctor-prompts.jsonl}`, `runtime/tests/parity/{python-ts-parity.vitest.ts,fixtures/local-native-approved-divergences.json}` | Modify | Re-pins the narrowed gate causes: `unknown_count` 13 to 14, the command baseline re-captured by its script, one doctor row, three resolved ledger rows (Q003, Q004) |
| `.skilled/skills/system-skill-advisor/` (`SKILL.md` version line, `changelog/`) | Modify/Create | Version bump and a changelog entry for the scorer change |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. Each requirement names the finding ids it closes, from `../review/deep-review-findings-registry.json`.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The two `_utils.sh` copies are byte-identical, with the default `${1:-18}` and the hint `Install Node.js ${min_version}+`, and `node --test .skilled/bin/tests/mcp-installers.test.cjs` passes 5 of 5 (O1-I1-P1-001, R1-P1-001) |
| REQ-002 | No Bladebro doc offers a `npx -y bladebro` launch without both an operator yes and the `bladebro@4.8.2` pin, including `004-bladebro-mode/spec.md` and `001-research/research/research.md` (R2-P1-001) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The 003 and 004 goal criteria that hold are ticked with evidence, and their continuity no longer reads 0 percent (O1-I1-P2-002, O2-I3-P2-001, R1-P2-002, O4-I3-P2-002) |
| REQ-004 | 003's closure statement, goal log and implementation summary agree that AC-002 is Met (O4-I3-P2-001) |
| REQ-005 | 005 goal criterion 1 says what its evidence shows (R1-P2-003) |
| REQ-006 | 011's goal criterion and the parent 011 to 012 handoff row use a presence check, not a count (O1-I1-P2-001, R3-P2-001) |
| REQ-007 | The parent handoff table holds no `TBD` row and the parent Branch row names `main` (O1-I3-P2-001, O4-I3-P2-003, O2-I3-P2-002, R3-P2-002) |
| REQ-008 | Parent `spec.md`, `goal.md` and `graph-metadata.json` agree on status and continuity (O1-I3-P2-002, O4-I3-P2-004) |
| REQ-009 | The Chrome DevTools installer and its live docs install `browser-debugger-cli@0.6.10`, not `@alpha` (O1-I2-P2-002, R2-P2-002, O2-I5-P2-001) |
| REQ-010 | The Bladebro installer installs with lifecycle scripts disabled and verifies the JS launcher before use, and the doctor checks the same digest (O1-I2-P2-001, O2-I2-P2-001) |
| REQ-011 | The published Chrome DevTools v1.0.27.0 note is restored, and new Chrome DevTools 1.0.28.0 and Aside 1.1.13.0 entries record the 013 and 014 changes, each with a matching packet version (O1-I4-P2-001, R4-P2-001) |
| REQ-012 | Aside docs and catalog rows teach `page.console.logs()` and `page.evaluate` capture, not `page.on` or `page.context()` (O2-I4-P2-001) |
| REQ-013 | The Aside evidence example defaults to the `./tmp/` form ASD-007 uses, and its README agrees (O4-I4-P2-001) |
| REQ-014 | The Aside playbook root states no hand-typed census, so its validator prints no `HAND_TYPED_CENSUS` warning (O1-I6-P2-001) |
| REQ-015 | BB-015 states the branded Chrome 136+ default-profile precondition and has a matching triage row (O2-I6-P2-001) |
| REQ-016 | The ClickUp live-run report cites only evidence that exists, and says plainly what was not retained (O2-I3-P2-003) |
| REQ-017 | The hub SKILL.md and ROUTER.md state the own-Chrome attach rule the hub router applies (O2-I1-P2-001) |
| REQ-018 | The two out-of-domain prompts in 005 REQ-009 no longer reach the hub, and 005 records the closure (O2-I3-P2-004) |
| REQ-019 | Paraphrased tie-break requests route to the intended mode, recorded in a new two-stage replay with paraphrase rows (R5-P2-001) |
| REQ-020 | Generic aliases no longer route out-of-domain prompts, and 005's T020 note states the measured leak (R6-P2-001, with R7-P2-001 folded in) |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/bin/tests/mcp-installers.test.cjs` prints `pass 5` and `fail 0`.
- **SC-002**: `rg -n 'npx -y bladebro' .skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md` prints no line without an operator-yes and pin caveat.
- **SC-003**: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/mcp-browser-use` prints `OK` with 0 warnings, and the Aside playbook validator prints no warning.
- **SC-004**: `validate.sh --strict --recursive` on the hub prints `RESULT: PASSED` for the parent and every child.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The skill advisor and its compiled routing, which alias changes feed | An unrebuilt index keeps the old scores and hides the fix | One lane alone changes routing vocabulary, rebuilds, and replays both stages |
| Risk | Tightening an alias drops a real browser request | Med | Replay every recorded benchmark row before and after, and keep each mode's real-request row passing |
| Risk | Parallel lanes edit the same file | Med | Each lane owns a disjoint file list and stops to report if a fix needs another file |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. The phase changes docs, installer scripts and routing vocabulary, with no service to time.
- **NFR-P02**: N/A. Nothing here has a throughput target.

### Security
- **NFR-S01**: No install or package launch runs without an operator yes, in any edited doc or script.
- **NFR-S02**: Every installer edited here names an exact package version and verifies what it fetched before use.

### Reliability
- **NFR-R01**: The installer parity test passes 5 of 5 from the final tree.
- **NFR-R02**: The advisor suite keeps its baseline, with no failure beyond the known empty `system-skilled-bots` folder.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a machine with no `bladebro` binary gets the install guidance and an operator-yes stop, never an implicit `npx` fetch.
- Maximum input: a Chrome DevTools install with Node 20 passes the explicit `MIN_NODE_VERSION`, and the shared default of 18 still serves the Code Mode installer.
- Failure path: a Bladebro launcher whose digest does not match the pin makes the installer exit non-zero before the binary runs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 35 files across three mode packets, the hub root and six spec packets |
| Risk | 8/25 | Installer scripts and routing vocabulary, no auth, data or API change |
| Research | 4/20 | The review already located every defect with file and line |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the ClickUp evidence finding need the raw output back? Decision: no. A rerun needs a live session, so the report discloses what was kept and the 008 known limitation stands.
- Does the scope-gate failure need a code change? Decision: no. The re-review adds the 2026-11-22 ClickUp report folder to its scope list.
<!-- /ANCHOR:questions -->

---
