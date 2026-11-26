---
title: "Feature Specification: Phase 16: fix-second-follow-up-findings"
description: "A prompt naming one mode by id and another by alias drops the alias mode, Aside docs still pipe the installer into bash, an Aside prose request defers, the front door splices the task into a shell argument, and a Node fix installs the wrong version."
trigger_phrases:
  - "fix second follow up findings"
  - "phase 16 fix second follow up findings"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 16: fix-second-follow-up-findings

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
| **Phase** | 16 of 16 |
| **Predecessor** | 015-fix-follow-up-review-findings |
| **Successor** | None |
| **Handoff Criteria** | Every REQ below is Met in `acceptance-criteria.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the mcp-browser-use hub specification. It fixes the findings of the generation-4 follow-up deep review that held against source.

**Scope Boundary**: Files under `.skilled/skills/mcp-browser-use/`, the hub's compiled-routing router and canary fixture with their authored archive copies, the activation manifest and the hub packet docs.

**Dependencies**:
- The generation-4 review, `../review/review-report.md`, which lists each finding with the check that confirmed or refuted it.

**Deliverables**:
- The five confirmed P1 fixes, two canary cases, release 1.1.4.0 and a 56-row replay.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The generation-4 review found five P1 defects that hold against source. A prompt naming one mode by its id and another by its alias drops the alias mode, because the full id also contains the alias and counts twice. Eight Aside files still teach `curl ... | bash`, bypassing the digest-pinned wrapper that 015 added. An Aside request in plain prose defers, since bare `aside` was removed in 014 and no prose form replaced it. The hub `SKILL.md` tells agents to splice the user's task into a double-quoted `--prompt` argument. The bdg Node fix installs Node 18 under a Node 20 requirement.

### Purpose
Every confirmed finding is fixed at its source, and the canary corpus carries a case that fails without the router change.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "use mcp-chrome-devtools and bladebro"
route single mcp-chrome-devtools          (fields action, selectionKind, targets[].workflowMode)
$ ... --prompt "use mcp-bladebro and aside browser"
route single mcp-bladebro
$ ... --prompt "open it in aside"
defer
$ ... --prompt "check the pricing page in aside and in chrome devtools"
route single mcp-chrome-devtools

$ grep -rnE "curl[^|]*[|] *(ba)?sh" .skilled/skills/mcp-browser-use/mcp-aside-devtools  (excluding the dated research note)
INSTALL-GUIDE.md:21, :49, :83; README.md:56; feature-catalog/install/install-and-doctor.md:24;
SKILL.md:75; references/troubleshooting.md:62; manual-testing-playbook/recovery-and-failure/missing-binary.md:50;
mcp-servers/aside-cli/README.md:25, :43; scripts/doctor.sh:36

$ sed -n 62p .skilled/skills/mcp-browser-use/SKILL.md
... `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "<task>"` ...

$ sed -n 179,188p .skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md
# bdg requires Node.js 20.x or higher
...
nvm install 18
nvm use 18
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Count a matched keyword once when it sits inside a longer keyword the same prompt matched, so an id and an alias score alike, and add that case to the canary corpus.
- Add `in aside` to Aside's vocabulary and check it against the out-of-domain "aside" prompts.
- Point every Aside install surface at `scripts/install.sh`.
- Pass the task to the front door on stdin through a quoted heredoc in the hub `SKILL.md` and playbook.
- Install Node 20 in the bdg troubleshooting fix.

### Out of Scope
- The `ROUTER.md` machine-router callout and the other seven hubs' `--prompt "<task>"` lines. `compiled-routing-lockstep-parity.test.cjs` pins that wording across every hub, so changing it is a fleet-wide decision.
- The dated `aside-online-research-2026-07-17.md` note. It records what was true on that date.
- The refuted README release finding and the 24 unchecked P2 findings.
- The `007-sk-doc` served-versus-authored drift. It predates this phase and belongs to sk-doc.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs` and its archive copy | Modify | Drop a match contained in a longer match |
| `.../fixtures/canary-cases.v1.json` and its archive copy | Modify | Mixed id-and-alias bundle and Aside prose cases |
| `.skilled/skills/mcp-browser-use/hub-router.json`, `ROUTER.md`, `graph-metadata.json` | Modify | `in aside` phrase and regenerated intent signals |
| Seven Aside docs and `scripts/doctor.sh` | Modify | Install through the pinned wrapper |
| Hub `SKILL.md`, `manual-testing-playbook/manual-testing-playbook.md` | Modify | Stdin heredoc for the front door |
| `mcp-chrome-devtools/references/troubleshooting.md` | Modify | Node 20 |
| Hub metadata versions, `changelog/v1.1.4.0.md`, reports index, second follow-up replay folder | Modify, Create | Release 1.1.4.0 and the 56-row replay |
| Activation manifest and its archive copy | Modify | Re-minted for the new policy hash |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | "use mcp-chrome-devtools and bladebro" and "use mcp-bladebro and aside browser" print `orderedBundle` with both modes, the three-id prompt still routes all three, and the canary harness fails without the router change. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | No hub file outside the dated research note, benchmark reports and changelogs pipes the Aside installer into a shell. |
| REQ-003 | "open it in aside" routes to Aside, and "set that aside ..." and "as an aside ..." still defer. |
| REQ-004 | The hub `SKILL.md` and playbook pass the task on stdin, and a task holding `$()` and a backtick routes without running them. |
| REQ-005 | The bdg Node fix installs and uses Node 20. |
| REQ-006 | The replay fails only MBU-PB-04, the advisor ratchet and suite are unchanged, and the hub checks pass. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The canary corpus and the 56-row replay pass, with only the known MBU-PB-04 failure.
- **SC-002**: `validate.sh` on the hub epic with `--strict --recursive` prints RESULT: PASSED.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The lockstep parity test pins the `ROUTER.md` callout wording | Low | Leave the callout and record the fleet-wide change as an operator decision |
| Risk | Dropping contained matches lowers some single-mode scores | Med | Canary corpus, the 56-row replay and the out-of-domain rows |
| Risk | `in aside` matches ungrammatical prose such as "put this in aside notes" | Low | Normal English says "in an aside", which does not match; recorded in the replay limitations |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

N/A: this packet changes routing data, one scoring rule and docs, and runs no service.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty prompt matches no keyword and defers, as before.
- Maximum input: a prompt naming all three modes by id routes the three-mode bundle.
- Failure path: a task with `"$(touch /tmp/x)"` and a backtick, passed through the quoted heredoc, routes and creates no file.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 25 files, small edits each |
| Risk | 8/25 | One scoring rule in one hub router |
| Research | 4/20 | Every finding already has a reproduction |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should every hub's `ROUTER.md` callout and `SKILL.md` line move to `--prompt-stdin`? That is a fleet-wide change, outside this hub, and the operator's call.
<!-- /ANCHOR:questions -->

---

