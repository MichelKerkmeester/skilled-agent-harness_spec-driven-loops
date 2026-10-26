---
title: "Implementation Plan: Phase 10: alignment-audit"
description: "Runs four read-only audit lanes over the 705-file scope, fixes the findings in 28 batches with a verify command each, re-audits, fixes the nine new findings in 11 more batches, then releases versions, changelogs and regenerated mirrors."
trigger_phrases:
  - "alignment audit plan"
  - "alignment audit lanes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 10: alignment-audit

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Node CommonJS and ES modules, Bash, Python, YAML and JSON. The audit edits all of them |
| **Framework** | None. The existing validators, drift guards, generators and test suites are the instruments |
| **Storage** | None. Working files live under the session scratchpad, never in the repository |
| **Testing** | The quality gate, `actionlint`, `shellcheck`, the skill, playbook and document validators, the route guard and admission check, the mirror `--check` runs, four node suites and the strict spec validator |

### Overview
Four read-only lanes audited one question group each: CODE answered the code question, DOCS the skill documents and playbooks, READ the READMEs, root README and changelogs, and ROUT routing, the advisor, commands and agents. Their 38 findings went to implementers in 28 batches, run by a DeepSeek worker through the pi CLI with a native Sonnet check, or by Sonnet alone. A re-audit read every fix and raised nine new findings, which 11 more batches fixed. A release stage then raised fifteen versions, wrote the changelog entries and ran the generators. This phase's own work ran the final-state gates again and recorded the result.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The scope file lists 705 files, symlinks resolved, all present: `wc -l` on it printed `705`.
- [x] The ten questions are the requirements in `spec.md` section 4.
- [x] Command rules are fixed: no git writes, no deletes and no background jobs, and temporary files go under the session scratchpad.

### Definition of Done
- [x] Every row of `acceptance-criteria.md` is `Met`, with the command and its output in the cell. All eighteen are `Met` on 2026-10-26.
- [x] The code gate, the route guard, the admission check, the mirror checks and the four node suites exit 0 on the final tree.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate --recursive --strict | tail -1` prints `RESULT: PASSED`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: audit, fix, re-audit, release. Each stage hands the next a typed list, and no stage trusts the one before it.

### Key Components
- **Audit lanes**: four read-only lanes, each with a `checked` list, a `not_covered` list and findings that carry an id, a question, a severity, the files and the problem.
- **Fix batches**: one batch per finding or small related group, each ending with a verify command the implementer ran and the conductor ran again.
- **Re-audit**: four reviewers re-check each fix, mark it `fixed` or `not_fixed` and raise new findings with a rule, evidence and a mechanical or judgment fix.
- **Release stage**: version bumps, changelog entries, the Hermes sync, the route-manifest refresh and a last full set of check legs.

### Data Flow
1. The scope file feeds the lanes.
2. Lane findings become fix batches b1 to b28.
3. The re-audit reads the working tree and returns results plus new findings.
4. New findings become fix batches c1 to c11.
5. The release stage regenerates what generators own and runs every check leg.
6. This phase records the ledger and re-runs the final-state gates before it claims anything.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Test files beside their source | Six tests sat next to the code they cover | update: moved under `tests/` | `node --test` over the moved suites, all green |
| `sk-code/ROUTER.md` section numbers | Sections 4 and 5 were missing | update: renumbered 1 to 10, citations moved | `verify-router-sync.cjs` and `parent-skill-check.cjs` exit 0 |
| `hub-router.json`, `mode-registry.json`, `ROUTER.md` vocabulary | Decides which mode a request reaches | update: CI and quality-config words added | `compiled-route.cjs` prompts, `compiled-route-admission.cjs --all` |
| Route manifests of four hubs | Generated from the router files | regenerate | `compiled-route-guard.cjs` exits 0 |
| `derive-command-bridges.cjs` and `_routes.yaml` | Derives advisor bridges from routes | update: `default_target` | `derive-command-bridges.cjs --check`, the advisor probe for `/doctor:ci` |
| `playbook-corpus-manifest.json` | Lists homogeneous routing-gold roots | update: narrowed to subfolders | `validate-playbook-package.cjs --package cli-external-orchestration` |
| Hermes skill copies | Generated from `SKILL.md` | regenerate | `sync-skills-hermes.cjs --check` |
| `.claude/agents/code.md` | The Claude dialect copy, written by hand | update | `check-agent-mirror-sync.cjs --all` |

Required inventories:
- Same-class producers: the test-placement class was searched in `.skilled/hooks`, `sk-code-quality/scripts` and `sk-code-review/scripts`, and the stale-citation class by `rg 'section 11'` over the sk-code hub.
- Consumers of changed paths: `rg` over tracked non-spec, non-changelog files for each old test path found the Hermes copy of sk-code-quality, which the sync fixed.
- Matrix axes: finding severity (P1, P2), kind (mechanical, judgment), generated or hand-written. Row count: 47 findings, 28 plus 11 batches.
- Algorithm invariant: every fix passes its verify command twice, once for the implementer and once for the conductor.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns the task rows and their checkboxes. The stages run in this order.

| Stage | Work | Output |
|-------|------|--------|
| Audit | CODE, DOCS, READ and ROUT lanes | 38 findings |
| Fix round 1 | 28 batches, b1 to b28 | Files edited, one batch left an open remainder |
| Re-audit | Four reviewers | 38 results and 9 new findings |
| Fix round 2 | 11 batches, c1 to c11 | New findings fixed, one batch left open |
| Release | 15 versions, 15 changelogs, generators | All check legs rc 0 |
| Record | This phase | Ledger, final-state run, validation |

### Verification commands
1. `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --lines file --format json --files <final code set>` prints gate `NO_BLOCKER_FOUND`.
2. `node .skilled/bin/compiled-route-guard.cjs` and `node .skilled/bin/compiled-route-admission.cjs --all` exit 0.
3. `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` exits 0.
4. `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate --recursive --strict | tail -1` prints `RESULT: PASSED`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The moved hook tests, the quality, doctor and sk-code-skilled suites | `node --test` |
| Integration | Gate inputs, workflow lint, route and mirror checks | `check-gate-inputs.sh`, `actionlint`, the guards and `--check` modes |
| Manual | The CI routing prompts and the bare `/doctor:ci` advisor probe | `compiled-route.cjs --prompt` and `skill-advisor.cjs advisor_recommend` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001 to 009 landed | Internal | Green | The audited files would be missing |
| The cli-pi transport with a DeepSeek model | External | Green for 20 of the 28 first-round batches | A batch falls back to Sonnet alone |
| The generators (Hermes sync, route manifest, bridge deriver) | Internal | Green | A generated copy would drift |
| The operator | External | Open for four questions in `spec.md` section 10, none an acceptance criterion | The recorded open items stay open, and the phase closes without them |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate that passed before the audit fails after a batch lands.
- **Procedure**: nothing is committed yet, so `git diff` shows each batch's change. Revert one batch by restoring its files from `HEAD` once the operator approves, regenerate the mirrors and rerun section 4.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Audit ──► Fix round 1 ──► Re-audit ──► Fix round 2 ──► Release ──► Record
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit | Phase 009 | Fix round 1 |
| Fix round 1 | Audit | Re-audit |
| Re-audit | Fix round 1 | Fix round 2 |
| Fix round 2 | Re-audit | Release |
| Release | Fix round 2 | Record |
| Record | Release | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit | Med | Four lanes in parallel |
| Fixes | Med | 39 batches, most under four minutes each |
| Release and record | Med | One release pass and one final-state run |
| **Total** | | **An estimate, not measured** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes): N/A, no data changes
- [ ] Feature flag configured: N/A
- [ ] Monitoring alerts set: N/A

### Rollback Procedure
1. Restore the batch's files from `HEAD` after the operator approves.
2. Regenerate the Hermes copies and route manifests.
3. Rerun the section 4 verification commands.
4. Record the revert and its cause in `goal.md` section 4.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
