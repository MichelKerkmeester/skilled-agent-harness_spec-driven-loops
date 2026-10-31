---
title: "Feature Specification: Phase 20: alignment-audit-fixes"
description: "An alignment audit of every file packet 054 touched found 46 misalignments, one of them a P0 that turns the CLI import-policy gate red. This phase fixes each evidenced finding in its owning file, closes the scope gap the first audit list left, and records the residuals the verify passes found."
trigger_phrases:
  - "alignment audit fixes"
  - "phase 20 alignment audit fixes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 20: alignment-audit-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-26 |
| **Branch** | `worktrees/217-weak-model-spec-authoring` |
| **Parent Spec** | ../spec.md |
| **Phase** | 20 of 20 |
| **Predecessor** | 019-follow-up-fixes |
| **Successor** | None |
| **Handoff Criteria** | The AST import check passes, every lane verifier's checks pass, and `validate.sh` on this folder prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20** of packet 054. The operator asked for an alignment check of everything 054 touched: code against sk-code, skill docs against sk-create-skill, playbooks, catalog entries, READMEs including the root one, routing, the advisor, changelogs, commands, agents, AGENTS.md and the repo rules. Four Opus medium leads audited one lane each. DeepSeek V4.1 Flash 1017 through cli-pi made the literal fixes and Sonnet 5.5 high made the judgment fixes.

**Scope Boundary**: the files named by a finding in `scratch/audit/findings.json` or by a verifier residual, plus the generated mirrors their owners' generators rewrite. Each lane owned disjoint files.

**Dependencies**:
- Phases 013 to 019 shipped the behavior the docs must now describe (Measured Behavior, Draft auto-repair, add-on removal, scaffold trim).

**Deliverables**:
- The audit: `scratch/audit/findings.json` (46 findings), four lane reports, `critic.md` and the corrected scope list `scope2.txt`
- The fixes, one cli-pi brief per literal finding in `scratch/briefs/` with runs in `scratch/runs/`
- `scratch/review.md`: the four verifier verdicts and residual outcomes
- The `v2.12.1.0` release note for system-spec-kit

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The new `draft-auto-repair.vitest.ts` imports the internal validation orchestrator, so the CLI AST import check exits 1 and the `npm run check` gate in CI fails (Measured Behavior below). The same audit found 45 more misalignments across the files 054 touched: playbook scenarios that expect a `v2.3` stamp fresh scaffolds no longer print, an orchestrate agent that treats exit 1 as a pass, stale changelogs, and advisor metadata that routes the new features to sk-doc.

### Purpose
Every file 054 touched agrees with its standard and with the shipped behavior, and every gate the audit named passes.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
Before the fix (lane A audit, from runtime/cli):
$ npx tsx evals/check-no-mcp-lib-imports-ast.ts
AST import policy check FAILED: 1 violation(s) found:
tests/draft-auto-repair.vitest.ts:28 → ../../lib/validation/orchestrator.js
EXIT=1

After the fix (closeout, from runtime/cli):
$ npx tsx evals/check-no-mcp-lib-imports-ast.ts
AST import policy check passed: no prohibited @spec-kit/runtime/{lib,core,handlers} internal imports found.
rc=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Fix the P0: add the `draft-auto-repair.vitest.ts` entry to the CLI import-policy allowlist, so the AST import check exits 0.
- Fix every other finding in its owning file: lane A code, lane B skill docs, catalog and playbook, lane C READMEs and changelogs, lane D agents, commands, advisor metadata and the critic's three cross-lane findings.
- Close the scope gap (A2) by having each lane's verifier re-audit the files in `scope2.txt` that the first list left out.
- Fix the residuals the verify passes found, where the fix is evidenced.
- Bump system-spec-kit to `2.12.1.0` with a compact release note, and regenerate the Hermes copies, runtime mirrors, compiled skill graph and trigger index.

### Out of Scope
- The TypeScript template-stamp copies (`carriesTokenGateStamp` in `orchestrator.ts`, `carriesClauseCutStamp` in `packet-synopsis.ts`) - the A7 fix shares one shell parser only.
- Em dashes that predate this phase in edited files - removing them means editing beyond the findings.
- Per-phase hours in the level-3 and level-3+ example `plan.md` critical path - the core `plan.md.tmpl` still carries a critical path with durations.

### Files to Change

All paths below are under `.skilled/skills/system-spec-kit/` unless they start with a dot or name a root file.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/cli/evals/import-policy-allowlist.json` | Modify | Allowlist the Draft auto-repair test (A1) |
| `runtime/cli/spec/check-example-drift.sh`, `runtime/cli/lib/status-classifier.sh`, `runtime/cli/rules/check-measured-behavior.sh` | Modify | Header, strict mode and one shared stamp parser (A3, A4, A7) |
| `runtime/cli/tests/{card-sync,example-drift,template-fill-guidance}.vitest.ts`, `runtime/lib/validation/orchestrator.ts` | Modify | MODULE headers and a TSDoc (A5, A6) |
| `feature-catalog/` and `manual-testing-playbook/` | Modify and Create | Two new catalog leaves, two new scenarios (485, 486), v2.4 stamps, no phase or packet ids (B-01 to B-14) |
| `SKILL.md`, `templates/`, `references/` | Modify | Word limit, template tree and path fixes, `v2.3-or-later` wording, version 2.12.1.0 |
| `README.md` (root), `README.md`, `runtime/cli/spec/README.md`, `changelog/v2.9.0.0.md` to `v2.12.0.0.md`, `changelog/v2.12.1.0.md` | Modify and Create | Rule counts, `--quiet` and Draft auto-repair, compact release entries, the new release note |
| `specs/system-speckit/054-weak-model-spec-authoring/changelog/` | Modify | Root changelog through phase 019, phase changelogs on the template heading set |
| `.skilled/agents/orchestrate.md`, `.claude/agents/orchestrate.md` and generated mirrors | Modify | Exit-code rule, real template source, no `Level template contract` |
| `.skilled/commands/speckit/{plan,implement,complete}.md`, command READMEs | Modify | Three warn-only rules named, no em dashes |
| `graph-metadata.json`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modify | Spec-scoped advisor phrases and the recompiled graph |
| `.env.example`, `assets/complexity-decision-matrix.md`, `templates/examples/level-*/tasks.md` | Modify | The switch listed, no effort estimates |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `npx tsx evals/check-no-mcp-lib-imports-ast.ts` from `runtime/cli` prints `AST import policy check passed` and exits 0, and `npm run check` there exits 0 |
| REQ-002 | Every P1 finding is fixed in its owning file and its lane verifier confirms it, or it is closed by a recorded re-audit |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every P2 finding is fixed, or recorded with a reason in `scratch/review.md` |
| REQ-004 | The targeted checks each lane named pass on the final tree: the seven CLI vitest files, the catalog and playbook validators, the skill package gate, the mirror and Hermes checks and the compiled skill graph freshness check |
| REQ-005 | Every residual a verifier found is fixed or recorded as open, with its severity, in `scratch/review.md` |
| REQ-006 | `validate.sh` on this folder with `--strict` prints `RESULT: PASSED` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The AST import check prints `passed` and exits 0, where it printed `FAILED: 1 violation(s)` and exited 1 before.
- **SC-002**: The seven targeted CLI vitest files print `Tests 117 passed (117)`, and the playbook validator prints `scenarios=112 violations=0`.
- **SC-003**: `skill-graph-freshness.cjs --strict` prints `SIGNAL DRIFT compiled vs disk: none`, and the probe `add a measured behavior block to the spec` tops out at system-spec-kit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The first scope list matched another 054 packet's trailer and left out files the weak-model work touched | Findings in the left-out files go unseen | Rebuild it as `scope2.txt` and have each lane verifier re-audit the delta (A2) |
| Risk | Four lanes edit in parallel, and a generator one lane runs (Hermes sync, trigger index) rewrites files another lane is still changing | Medium | Disjoint files per lane, and every generated check reruns once more at close |
| Risk | New advisor phrases steal prompts sk-doc owns | Medium | Spec-scoped phrases only, and a probe that sk-doc prompts still route to sk-doc |
| Risk | Strict mode on `check-example-drift.sh` stops the scan at the first failing example | Low | A drift fixture run before and after shows the same three FAIL lines and exit 1 |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

- **NFR-R01**: No edited file changes mode: `check-example-drift.sh`, `status-classifier.sh` and `check-measured-behavior.sh` stay `-rwxr-xr-x`.
- **NFR-R02**: No added line in the tracked diff holds an em dash.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a stamp with an empty source prints `-` from `speckit_template_stamp`, so the tab read stays aligned and the rule still skips it.
- Maximum input: a fixture with several drifted examples prints every FAIL line under strict mode, not only the first.
- Failure path: a finding whose fix already landed by the time its implementer ran is confirmed by its check and left unedited.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 77 tracked files in the worktree diff and five new ones, across code, docs, agents, commands and advisor metadata |
| Risk | 8/25 | Mostly docs; three shell scripts and one allowlist change behavior |
| Research | 8/20 | A four-lane audit plus a critic, already done |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Should the speckit workflow steps run the guard scripts the command docs promise (R2)? Decision: yes, wired into every `post_write_validation` gate as a non-blocking check, since a failure concerns the skill's own examples or card, not the packet.
- Should `repair derived metadata after editing docs` route to system-spec-kit first? It now ranks second, 0.8622 against sk-doc's 0.8681. Open for the operator.
<!-- /ANCHOR:questions -->

---

