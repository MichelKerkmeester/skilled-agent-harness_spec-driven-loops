---
title: "Implementation Plan: Phase 1: utilization-review"
description: "How the utilization review runs: nine playbook scenarios, eight advisor probes, two tool surfaces and a constructed boundary case, with fixes confined to the packet."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: utilization-review

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documents, Python 3 scanner, Node validators |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `hvr_scan.py` fixtures, `validate_document.py`, `validate-playbook-package.cjs`, `validate.sh --strict` |

### Overview
The review runs the shipped playbook against the shipped tools, supplies a target for each scenario written against a placeholder, and grades the mode by what a person would get rather than by whether the files conform. Fixes are confined to documents the packet owns. Anything needing a rule change, a hub change or a tool-behavior judgment is written up instead.
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
Test-then-repair. Every change in this phase is downstream of an observation, and no change was made to a file no observation implicated.

### Key Components
- **`scripts/hvr_scan.py`**: the mechanical pass, parsing the standard at run time
- **`references/scope-and-exemptions.md`**: the gate that decides which spans the standard governs
- **`references/scoring-and-verification.md`**: pass order, precedence arithmetic and the control pair
- **`manual-testing-playbook/`**: nine operator scenarios across three categories
- **`assets/voice-report-template.md`**: the fixed shape of a result

### Data Flow
A request reaches the advisor, the advisor scores the `sk-doc` hub, the hub's compiled route selects the mode, the mode loads the scope gate, runs the scanner, reads its findings as candidates, adds the judgment pass and reports through the template.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `assets/voice-report-template.md` | Producer of every voice report's shape | update | `hvr_scan.py` on it goes from exit 1 with 6 hard blockers to exit 0 with 0 |
| `references/scoring-and-verification.md` | Policy: arithmetic and the shipped worked example | update | The example block now matches live `hvr_scan.py` output on the file it cites |
| `references/scope-and-exemptions.md` | Policy: the scope gate | update | The added caveat cites an observed four-blocker run on a code-payload template |
| `README.md` | Consumer-facing entry point | update | The command's own presentation contract carries the hard block the row now names |
| `manual-testing-playbook/manual-testing-playbook.md` | Operator directory and contract | update | `validate-playbook-package.cjs` still prints `PASS` with `operator=9` |
| `SKILL.md` | Compiled-policy input | not a consumer, unchanged | No edit made, changes recorded as prepared text |
| Hub routing files | Stage-one advisor identity | not a consumer, unchanged | Routing gap written up rather than edited |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Control | The two shipped fixtures, run before and after every wave | `hvr_scan.py` |
| Manual | Nine operator scenarios across tell detection, the scope gate and scoring | `hvr_scan.py`, `git status --porcelain`, `sha256sum`, `diff` |
| Routing | Eight newcomer prompts against the live advisor | `.opencode/bin/skill-advisor.cjs advisor_recommend` |
| Contract | The playbook package and every edited document | `validate-playbook-package.cjs`, `validate_document.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `hvr_scan.py` and `references/hvr-rules.md` | Internal | Green | Every scenario quoting a number becomes ungradable |
| Skill advisor daemon | Internal | Green | The routing probes cannot run |
| `validate-playbook-package.cjs` | Internal | Green | The operator contract cannot be re-checked after a playbook edit |
| `validate_document.py` | Internal | Green | Edited documents cannot be verified against the sk-doc contract |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a downstream consumer breaks on the changed report-template separators, or the playbook operator count drops below nine
- **Procedure**: `git checkout -- .opencode/skills/sk-doc/sk-create-with-human-voice/` restores all five edited files. Nothing in this phase is committed, pushed or generated, so the working tree is the only state to revert.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Reading the packet and creating the phase |
| Core Implementation | Medium | Nine scenarios, eight probes, five fixes |
| Verification | Low | Four validators re-run from the final state, twice after an external revert |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. [Immediate action - e.g., disable feature flag]
2. [Revert code - e.g., git revert or redeploy previous version]
3. [Verify rollback - e.g., smoke test critical paths]
4. [Notify stakeholders - if user-facing]

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Phase 2b │
                    │  Parallel │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Control pair | None | Proof the parser still reads the standard | Every scenario quoting a number |
| Scope-gate wave | Control pair | Exemption classes confirmed against real spans | Tell-detection and scoring waves |
| Tell-detection wave | Scope-gate wave | Candidate handling and the judgment pass | Fix list |
| Scoring wave | Scope-gate wave | Both-number reporting | Fix list |
| Fix list | All three waves | Five edits inside the packet | Final validation |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Control pair** - minutes - CRITICAL
2. **Scope-gate wave** - the cheapest wave and the one that decides whether the others measure the right spans - CRITICAL
3. **Fix list and final validation** - CRITICAL

**Total Critical Path**: one session

**Parallel Opportunities**:
- The eight advisor probes run independently of every scenario
- Tell detection and scoring both depend only on the scope-gate wave and can follow it in either order
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Phase folder created and staged | The folder exists and `git status` shows it staged | Start |
| M2 | Nine scenarios recorded | Each has an outcome and evidence | Mid |
| M3 | Fixes verified | Four validators pass from the final state | End |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Repair the report template rather than exempt it

**Status**: Accepted

**Context**: The mode's own report template emitted six em dashes from inside its fenced payload, which the template-payload detection reports as six hard blockers. Every voice report authored from it inherited them. One reading is that a template's placeholder rows are carried text and belong in the exemption list.

**Decision**: Treat the fenced payload as prose the mode authored and repair it, replacing each em dash with the comma or colon the standard prescribes.

**Consequences**:
- The mode now holds itself to the standard it owns, and the scan on its own asset exits 0
- Downstream reports change separator, which is visible in any report generated after this phase

**Alternatives Rejected**:
- Record the six as accepted exemptions: the payload is the mode's own writing, not text it carries, so the exemption would be a way of not fixing it
- Rename the file so detection stops firing: that hides the finding instead of answering it

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
