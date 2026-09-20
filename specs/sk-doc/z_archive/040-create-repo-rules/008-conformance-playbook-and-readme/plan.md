---
title: "Implementation Plan: Phase 8: Conformance, Playbook and README"
description: "[2-3 sentences: what this implements and the technical approach]"
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
# Implementation Plan: Phase 8: Conformance, Playbook and README

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, with Python 3 and Node validators |
| **Framework** | sk-doc packet conventions |
| **Storage** | None |
| **Testing** | `validate-playbook-package.cjs`, `validate_document.py`, `validate_skill_package.py` |

### Overview
[2-3 sentences: what this implements and the technical approach]
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
[MVC | MVVM | Clean Architecture | Serverless | Monolith | Other]

### Key Components
- **Root playbook**: the operator directory, review protocol, grading rules and orchestration guidance.
- **Category folders**: one file per scenario, carrying the nine-column contract and the execution truth.
- **README**: the conceptual entry point, on the nine-section skeleton the sibling create modes share.
- **Allowlist entry**: converts a clean run into a standing guarantee.

### Data Flow
[Brief description of how data moves through the system]
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| producer | `sk-create-manual-testing-playbook` owns the package contract and validator | unchanged | Contract read before authoring; validator run unmodified |
| policy | `sk-create-skill` owns the ALWAYS and NEVER rules | unchanged | Audit run against them; one violation fixed in this packet |
| consumer | `playbook-failclosed-allowlist.txt` gates the fleet run | update | One line added at line 45, fleet run confirms discovery |
| docs | `sk-create-repo-rule/README.md` describes the mode | update | Rewritten and validated as a readme |
| tests | No automated feature suite exists for this mode | not a consumer | Cross-reference section states this plainly rather than implying coverage |

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
| Package | Playbook operator-scenario contract | `validate-playbook-package.cjs` |
| Fleet | Every playbook root, scanned count against roots on disk | `validate-playbook-package.cjs` with no package argument |
| Document | README and all 10 per-feature files | `validate_document.py` |
| Command | Every bash command in the package, run against the live corpus | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `validate-playbook-package.cjs` | Internal | Green | Without it the package ships unchecked |
| `validate_document.py` | Internal | Green | Gates the README and per-feature files |
| Live `repo-rules/` corpus | Internal | Green | Every scenario claim is verified against it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the fleet validator regresses, or the allowlist entry blocks an unrelated change.
- **Procedure**: `git checkout` the packet directory and remove line 45 from the allowlist. Nothing binds at runtime, so no rule behaviour changes either way.
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
| Setup | Low | Reading the playbook contract, the skill rules and HVR |
| Core Implementation | Med | Root playbook, ten scenario files and the README rewrite |
| Verification | Med | Running every command against the corpus, then three validator levels |
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
4. Report the validator output and the unresolved-link findings honestly, including the four intentional template placeholders.

### Data Reversal
- **Has data migrations?** [Yes/No]
- **Reversal procedure**: [Steps or "N/A"]
<!-- /ANCHOR:enhanced-rollback -->

---

