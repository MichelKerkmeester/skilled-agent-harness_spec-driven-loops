---
title: "Feature Specification: Phase 13: fix-alignment-findings-for-browser-hub-docs"
description: "Two alignment runs over the browser hub found 112 defects: docs that name commands bdg 0.6.10 rejects, scripts that fail on macOS, Code Mode blocks that never run and a routing miss for an own-Chrome attach request. This phase fixes all of them."
trigger_phrases:
  - "fix alignment findings for browser hub docs"
  - "phase 13 fix alignment findings for browser hub"
  - "browser hub alignment fixes"
  - "own chrome attach routing lift"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: fix-alignment-findings-for-browser-hub-docs

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-23 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-browser-hub-doc-topic |
| **Successor** | None |
| **Handoff Criteria** | Every finding in both run folders is fixed or named as open, and the hub gates pass from the final state |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the browser hub specification. Phase 12 added the `mcp-browser-use` topic and ran both alignment commands. This phase fixes what they found.

**Scope Boundary**: every finding in the doc run `~/.local/state/local-doc-alignment/Skilled/20261123T181518Z/` (91 findings) and the skilled run `~/.local/state/local-skilled-alignment/Skilled/20261123T181658Z/` (21 findings), including the few that sit outside the hub, plus the open items the runs surfaced next to them.

**Dependencies**:
- The two run folders above, which hold `findings.json` for each run.
- bdg 0.6.10 installed at `/opt/homebrew/lib/node_modules/browser-debugger-cli`, read as the source of truth for command shapes.

**Deliverables**:
- Fixed docs across the three browser modes, the hub root, `mcp-code-mode` and the other docs the findings name.
- Fixed hub scripts, an advisor routing lift, a Devin model entry and a freshness-panel fix.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The browser hub's docs and scripts describe a bdg and a Code Mode that no longer behave that way. Readers copy `bdg cdp` calls with positional JSON, which bdg 0.6.10 rejects. They also copy Code Mode blocks with top-level `await`, which the wrapper refuses, and run `install.sh`, which finds no Chrome on macOS. A request to attach to the operator's own Chrome also routed nowhere.

### Purpose
Every command, script and routing claim the hub makes works as written against bdg 0.6.10, Code Mode and the live advisor.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/commands/assets/local-skilled-alignment/run-probes.cjs --probes probes-p03.json
pass       P01    want=mcp-browser-use/mcp-chrome-devtools      got=mcp-browser-use/mcp-chrome-devtools
pass       P02    want=mcp-browser-use/mcp-chrome-devtools      got=mcp-browser-use/mcp-chrome-devtools
fail       P03    want=mcp-browser-use/mcp-chrome-devtools      got=-
pass       P04    want=mcp-browser-use/mcp-chrome-devtools      got=mcp-browser-use/mcp-chrome-devtools
pass       P05    want=mcp-browser-use/mcp-chrome-devtools      got=mcp-browser-use/mcp-chrome-devtools
pass       P06    want=mcp-browser-use/mcp-chrome-devtools      got=mcp-browser-use/mcp-chrome-devtools
fail       P07    want=mcp-browser-use/mcp-chrome-devtools      got=-
pass       C01    want=mcp-browser-use/mcp-aside-devtools       got=mcp-browser-use/mcp-aside-devtools
pass       C02    want=mcp-browser-use/mcp-bladebro             got=mcp-browser-use/mcp-bladebro
STATUS=FINDINGS run-probes: pass=7 fail=2 cannot_run=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Apply the literal fixes from the doc run and fix each judgment finding by hand against bdg 0.6.10, Code Mode and the advisor.
- Fix the hub scripts the findings name: the macOS check, the Node minimum, the CDP domain count and the console checks.
- Lift the advisor's read-only floor for an own-Chrome attach request, with a negative control.
- Add the live Devin model `deepseek-v4-1-flash-1017-max` to both allowlists and stop the freshness panel from reporting private `local-*` skills as gone.
- Name the bdg port defect in the v4.2.0.0 release notes and add `cli-vibe` to the doc-alignment preset kinds.

### Out of Scope
- Aside's `examples/repl-evidence-capture.sh` - it needs a live signed-in Aside run to verify, so its docs are fixed and the script stays open.
- The adjacent defects listed in `implementation-summary.md` - they sit outside the topic scope the runs checked.
- A new feature-catalog leaf for the port defect - the catalog keeps its 31 features by decision.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/**` | Modify | References, install docs, README, SKILL, catalog, playbook, changelog, scripts and examples |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/**` | Modify | Docs the Aside findings name |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modify | Own-Chrome attach lift |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Devin allowlist entry |
| `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs` | Modify | Skip private `local-*` ids |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No doc in scope passes JSON to `bdg cdp` as a positional argument | `rg "bdg cdp [A-Za-z]+\.[A-Za-z]+ ['\"{]"` over the topic scope and hub root prints nothing |
| REQ-002 | `install.sh` finds Chrome on macOS and counts CDP domains | The fixed `detect_chrome_path` prints the Chrome path and `verify_installation` logs `CDP domains available: 53` |
| REQ-003 | An own-Chrome attach request routes to the hub | `run-probes.cjs` prints `pass=9 fail=0` for the P03 probe file |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The new lift does not capture an explain question about a page or Chrome itself | `advisor_recommend` returns no recommendation for both negative-control prompts |
| REQ-005 | The example scripts count console errors | Each jq filter reads `.messages[]` with `type == "error"` from `bdg console --list --json` |
| REQ-006 | No hub gate regresses | Hub check, five playbook validators, advisor suite and freshness panel match or beat their baselines |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The P03 probe file passes 9 of 9, and both negative controls stay unrouted.
- **SC-002**: The doc-run recheck shows 0 literal findings still open, and the skilled-run recheck shows both failing battery rows passing.
- **SC-003**: `validate.sh --strict --recursive` on the hub prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | bdg 0.6.10's installed source | A newer bdg can change output shapes the docs now quote | Each shape is read from a named source file, so a later bump has a place to recheck |
| Risk | A read-only lift captures unrelated prompts | Med | The lift needs an attach verb, and two negative controls pin it in `route-gates.vitest.ts` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Committing waits for the operator under hub decision D8.
<!-- /ANCHOR:questions -->

---
