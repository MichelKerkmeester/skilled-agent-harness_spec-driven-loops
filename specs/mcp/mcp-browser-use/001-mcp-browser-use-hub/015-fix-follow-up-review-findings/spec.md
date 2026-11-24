---
title: "Feature Specification: Phase 15: fix-follow-up-review-findings"
description: "Fix the findings the generation-3 follow-up deep review confirmed in the mcp-browser-use hub: a dropped mode in the three-mode bundle, a stale Aside capability row, an unnormalized path guard and an installer that pipes remote code into bash."
trigger_phrases:
  - "fix follow up review findings"
  - "phase 15 fix follow up review findings"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 15: fix-follow-up-review-findings

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-24 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 15 |
| **Predecessor** | 014-fix-deep-review-findings |
| **Successor** | None |
| **Handoff Criteria** | Every REQ below is Met in `acceptance-criteria.md`. A gate-proven re-review is a later step, not part of this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the Fix the confirmed findings of the generation-3 follow-up deep review of the mcp-browser-use hub specification.

**Scope Boundary**: Files under `.skilled/skills/mcp-browser-use/`, the hub's compiled-routing fixture, the hub packet docs and, after the operator folded it in (Q006), the advisor scorer's id-noun anchor and its browser-hub entries.

**Dependencies**:
- The generation-3 review, `../review/review-report.md`, which lists each finding with the check that confirmed it.

**Deliverables**:
- The four hub fixes, a bundle canary case, the advisor id-noun and staging fixes, and the P2 doc corrections listed under Scope.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The follow-up deep review after phase 014 returned CONDITIONAL, with 10 P1 findings across four lineages. Checked against source, three hub P1 findings hold. A prompt that names all three mode ids routes to two of them. The hub capability matrix still advertises Aside `page.on(...)` events, which 014 removed from the Aside docs. The `./tmp` guard that 014 added to the Aside capture example accepts `./tmp/../..`. The Aside installer is also the only `install.sh` under `.skilled/skills` that pipes a downloaded script into bash. At the advisor stage, the last word of a skill id lifts that skill to the 0.82 floor on its own, and a bare `staging` lifts the browser hub on deploy work.

### Purpose
Every confirmed finding is fixed at its source, one shared word no longer names a skill, and the canary corpus carries a case that would have caught the dropped bundle mode.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "use mcp-chrome-devtools, mcp-aside-devtools and mcp-bladebro"
route orderedBundle mcp-chrome-devtools,mcp-aside-devtools      (fields action, selectionKind, targets[].workflowMode)

$ rg -n 'page.on' .skilled/skills/mcp-browser-use/SKILL.md
40:| Console and network | `bdg console --list`, CDP network methods | `page.on(...)` events | `see logs` rings |

$ sed -n 33,39p .skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh
case "$SESSION_DIR" in
  ./tmp | ./tmp/*) ;;          (./tmp/../../x matches this arm)

$ grep -rln --include=install.sh -E 'curl[^|]*\| *(ba)?sh' .skilled/skills
.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh

In-process advisor probe, skill:confidence at 0.8 or above
fix the infinite loop in this function => system-deep-loop:0.820
update the build tooling for the monorepo => mcp-tooling:0.820
update the plan for the mode rollout => system-spec-kit:0.820, cli-external-orchestration:0.820, mcp-code-mode:0.820
fix the code in the parser => sk-code:0.826, local-webflow:0.820, mcp-browser-use:0.820
fix the config loader that reads the wrong settings file in staging => mcp-browser-use:0.820, sk-code:0.820
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Make a prompt that names all three mode ids route to all three, in tie-break order, and add that prompt to the canary corpus.
- Replace the Aside `page.on(...)` cell in the hub capability matrix with the capture the Aside packet documents.
- Reject a `--session-dir` that leaves `./tmp` after `..` segments in the Aside capture example.
- Download the Aside installer to a file, verify it before running, and keep the operator-yes flow.
- Count an id noun as naming its skill only when the lexical lane also matched another prompt word, and drop the bare `staging` explicit entry and hint for the browser hub.
- Remove `mcp-code-mode` from the hub's keyword list, so a prompt about code does not reach the hub.
- Correct the P2 drift the review lists: goal logs, the benchmark and playbook indexes, the `ROUTER.md` keyword list, the `leaf-scopes.json` description and the 014 release-note counts.

### Out of Scope
- The shared lexical anchor at 0.45. Two generic words, one of them a task-verb synonym, still pass it for every skill. It is not a finding of this review, and changing it moves pinned slices across the whole advisor.
- The `@latest` registrations in the Chrome install guide. Three install guides share that convention, so changing one hub alone would leave the repository inconsistent.
- The 006 status drift. Its spec says Complete while its continuity waits on five deferred routing findings, and settling those is the operator's call.
- The README version finding. Each Markdown doc carries its own version line, which the commit hook bumps, so a README at a different version from `SKILL.md` is not drift.
- The install-gate, engine and packet-wording P2 findings. They change security defaults or other packets, and the review left them unchecked.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/mcp-browser-use/hub-router.json` | Modify | Vocabulary or weights so the three mode ids score within `ambiguityDelta` |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json` | Modify | Add the three-mode bundle case |
| `.skilled/skills/mcp-browser-use/SKILL.md` | Modify | Aside capture cell in the capability matrix |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh` | Modify | Reject `..` segments in the session dir |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh` | Modify | Download, verify, then run the installer |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modify | The id noun needs another shared lexical token |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`, `lanes/lexical.ts` | Modify | Drop bare `staging`, add the `staging portal` phrase |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl` | Modify | Re-pin `doctor-none-04` (Q009) |
| `.skilled/skills/system-skill-advisor/SKILL.md`, `changelog/v2.0.3.0.md` | Modify, Create | Advisor release 2.0.3.0 |
| Hub `SKILL.md` keyword comment, `ROUTER.md`, `README.md`, metadata versions, `changelog/v1.1.3.0.md` | Modify, Create | Keyword and vocabulary sync, release 1.1.3.0 |
| Benchmark reports index, playbook result pointer, follow-up replay folder | Modify, Create | P2 drift and the follow-up replay |
| Activation manifest and its archive copy | Modify | Re-minted for the new policy hash |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The bundle prompt in Measured Behavior prints `orderedBundle` with targets `mcp-chrome-devtools,mcp-aside-devtools,mcp-bladebro`, and the canary corpus holds that case. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | `rg -n 'page.on' .skilled/skills/mcp-browser-use/SKILL.md` prints nothing. |
| REQ-003 | `repl-evidence-capture.sh <url> ./tmp/../../x` exits 1 with the session-dir message, and `./tmp/run1` still passes the guard. |
| REQ-004 | The Aside installer writes the downloaded script to a temporary file and runs it only after a check passes. No `curl ... \| bash` remains in `install.sh`. |
| REQ-005 | Each P2 drift item in Scope is corrected, and the replay passes every row except the known MBU-PB-04. |
| REQ-006 | The five probe prompts in Measured Behavior no longer lift system-deep-loop, mcp-tooling, mcp-code-mode or mcp-browser-use, and "run the doctor update check" still reaches system-skilled-doctor. |
| REQ-007 | All eight advisor ratchet metrics hold, and the full advisor suite fails only the known `system-skilled-bots` test. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The hub canary corpus and the two-stage replay pass, with the bundle case and two new out-of-domain rows added.
- **SC-002**: `validate.sh` on the hub epic with `--strict --recursive` prints RESULT: PASSED.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The Aside vendor publishes no checksum for its installer | Med | Pin the installer by content digest in the script, the pattern the Bladebro installer uses |
| Risk | A vocabulary change that lifts Bladebro can turn single-mode prompts into bundles | Med | Re-run the canary corpus and the replay after the change |
| Risk | Narrowing the id-noun anchor moves pinned advisor slices | Med | Run the ratchet, parity, command, doctor and ledger gates, and ask before any re-pin |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

N/A: this packet changes docs, routing data and install scripts, and runs no service.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: no `--session-dir` keeps the `./tmp` default and passes.
- Maximum input: a prompt naming all three modes plus generic browser words still routes the three-mode bundle.
- Failure path: an installer whose digest does not match exits 1 and runs nothing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 20 files in the hub and the advisor scorer, small edits each |
| Risk | 10/25 | Routing data and one install path |
| Research | 5/20 | Every finding already has a reproduction |
| **Total** | **27/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None. The operator settled the id-noun scope (Q006), the build path (Q007), the installer pin (Q008) and the doctor row (Q009).
<!-- /ANCHOR:questions -->

---


