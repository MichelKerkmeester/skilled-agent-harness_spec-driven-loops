---
title: "Acceptance Criteria: Phase 6: sk-code-ci-surface"
description: "The criteria this packet must satisfy before it may be closed: a read-only sk-code-ci packet with ten rule families, complete hub registration, a passing router union, canary, compiled-route and playbook evidence, the message-contract exception with an unchanged workflow, a coherent hub release, an additive result against the sibling surface removal, no ephemeral ids in code and no spec path in the packet."
trigger_phrases:
  - "sk code ci surface acceptance criteria"
  - "phase 6 sk code ci surface acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface"
    last_updated_at: "2026-10-23T15:25:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Authored the acceptance criteria for this planned phase"
    next_safe_action: "Run T001, then T002 to record the pattern inputs and the two frozen defaults"
    blockers:
      - "004-setup-caching-provisioning has not landed; .github/actions/setup/action.yml is absent"
      - "specs/sk-code/013-private-surface-skills/002-hub-surface-removal is Draft and edits the same registration files"
      - "The worktree is not provisioned, so parent-skill-check leg 12-lib fails before this phase starts"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-006-sk-code-ci-surface"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: sk-code-ci-surface

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface
**Level:** 3
**Status:** Planned
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. Every row names the R-id it serves, the requirement it closes, and a check whose expected result is a count or an exit status.

| AC-ID | R-id | REQ | Given / When / Then | Verification | Expected | Status | Waiver |
|-------|------|-----|---------------------|--------------|----------|--------|--------|
| AC-001 | R22 | REQ-001 | Given R22's packet, When its files are read, Then `SKILL.md`, `README.md`, a matching changelog, four references, two YAML templates and three workflow-doctrine symlinks exist, and the frontmatter is read-only | `test -f` each of `.skilled/skills/sk-code/sk-code-ci/{SKILL.md,README.md,changelog/v0.1.0.0.md,references/ci-workflow-standards.md,references/trigger-and-filter-rules.md,references/job-shape-rules.md,references/protected-set.md,assets/workflow-template.yml,assets/job-block-template.yml}`; `grep -c '^name: sk-code-ci$' .skilled/skills/sk-code/sk-code-ci/SKILL.md`; `grep -c 'allowed-tools: \[Read, Bash, Grep, Glob\]' .skilled/skills/sk-code/sk-code-ci/SKILL.md`; `grep -c 'packetKind: surface' .skilled/skills/sk-code/sk-code-ci/SKILL.md`; `test -L` each of the three `references/workflow-*.md` symlinks; `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` | every `test -f` and `test -L` exits `0`; each `grep -c` returns `1`; the `3g` line reads `all 4 surface packet(s) are read-only evidence-base and advisor-invisible` | Unmet | - |
| AC-002 | R22 | REQ-002 | Given R22's rule data, When the four references and two templates are searched, Then all ten rule families are present with the final review's corrected numbers and a real `file:line` citation | `for t in '8 entries' 'inert' 'push-only' 'max(<floor>' 'permissions: contents: read' 'cancel-in-progress' 'uses: ./.github/actions/setup' 'vars.SKILLED_CI' 'protected' 'workflow-template.yml'; do rg -q "$t" .skilled/skills/sk-code/sk-code-ci || echo "missing: $t"; done`; six separate `rg -c` checks, one per citation: `check-gate-inputs\.sh:109-121`, `trigger-index-rebuild\.yml:6-9`, `trigger-index-rebuild\.yml:78-84`, `message-contract\.yml:9`, `workflows/README\.md:73`, `trigger-index-rebuild\.yml:12`; four separate `rg -c` checks: `2,073`, `104`, `27 workflows`, `33 of 33` | the loop prints nothing; each of the six citation checks returns at least `1`; each of the four number checks returns at least `1` | Unmet | - |
| AC-003 | R22 | REQ-003 | Given R22's registration list, When every hub artifact is read, Then the registry, surface axis, router tie-break, router signal, two vocabulary classes, description keyword and leaf manifest all name `sk-code-ci` | `node -e "const r=require('./.skilled/skills/sk-code/mode-registry.json'),h=require('./.skilled/skills/sk-code/hub-router.json'),d=require('./.skilled/skills/sk-code/description.json'),l=require('./.skilled/skills/sk-code/leaf-manifest.json'); const m=r.modes.find(x=>x.workflowMode==='sk-code-ci'); const t=h.routerPolicy.tieBreak; console.log(Boolean(m),r.extensions['surface-axis'].surfaces.includes('sk-code-ci'),Number(t.indexOf('sk-code-ci')>=0)+Number(t.indexOf('sk-code-ci')<t.indexOf('sk-code-skilled'))===2,Boolean(h.routerSignals['sk-code-ci']),Boolean(h.vocabularyClasses['code-ci-aliases'])&&Boolean(h.vocabularyClasses['code-ci-runtime']),d.keywords.includes('sk-code-ci'),l.modes.some(x=>x.workflowMode==='sk-code-ci'))"` | seven `true` values | Unmet | - |
| AC-004 | R22 | REQ-004 | Given R22's `ROUTER.md` projections and the guard's surface lists, When the router-sync union runs, Then the parent map equals the children union plus the parent tier, including the new packet | `grep -c '"CI_WORKFLOW"' .skilled/skills/sk-code/ROUTER.md`; `grep -c 'sk-code-ci/references/' .skilled/skills/sk-code/ROUTER.md`; `grep -c "'sk-code-ci'" .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`; `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 1a,1b,2,3` | `2`; at least `8`; `2`; exit `0` with `router-sync: 4/4 checks passed` | Unmet | - |
| AC-005 | R22 | REQ-005 | Given R22's routing evidence, When the canary, the compiled-route suite and the playbook replay run, Then the CI prompt resolves to `[sk-code-review, sk-code-ci]` and the fixture's authored twin is byte-identical | `node -e "const f=require('./.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json'); console.log(f.cases.some(c=>c.id==='surface-bundle-ci'&&c.expectedModes.includes('sk-code-ci')))"`; `cmp .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`; `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs`; `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 4` | `true`; `cmp` exits `0` with no output; exit `0` with `pass 7` and `fail 0`, naming `a CI workflow prompt bundles the CI surface`; `router-sync: 1/1 checks passed` | Unmet | - |
| AC-006 | R23 | REQ-006 | Given R23's exception, When the rule data and the workflow are read, Then the every-branch trigger is recorded as intentional with its rationale, and `message-contract.yml` is unchanged | `grep -c 'intentional-exception' .skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md`; `grep -c 'message-contract.yml:9' .skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md`; `grep -c 'workflows/README.md:73' .skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md`; `grep -c "branches: \['\*\*'\]" .github/workflows/message-contract.yml`; `git diff --exit-code -- .github/workflows/message-contract.yml` | at least `1`; `1`; `1`; `1`; exit `0` with no output | Unmet | - |
| AC-007 | R22 | REQ-007 | Given R22's final tree, When the hub's own gates run, Then the parent-skill check, the drift guards, the compiled-route suites and this folder's validator all pass | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code`; `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh`; `node --test .skilled/bin/tests/compiled-route-*.test.cjs`; `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface --strict` | parent-skill prints `PASS` on the `3g`, `5b`, `5k-alias`, `5k-packet`, `5k-canary`, `5l` and `13b-version` lines and its only `FAIL` line, when one exists, is `12-lib`; drift guards exit `0` with `all 4 guards PASSED`; the suites exit `0`; the validator prints `RESULT: PASSED` | Unmet | - |
| AC-008 | R22 | REQ-008 | Given R22's hub release, When the four version fields and every surface document are read, Then all four read the same new version, the matching changelog exists, and every surface count matches the registry | `node -e "const v=[require('./.skilled/skills/sk-code/mode-registry.json').version,require('./.skilled/skills/sk-code/hub-router.json').version,require('./.skilled/skills/sk-code/description.json').version]; const m=require('fs').readFileSync('.skilled/skills/sk-code/SKILL.md','utf8').match(/^version: (.+)$/m); console.log(new Set([...v,m[1]]).size)"`; `test -f ".skilled/skills/sk-code/changelog/v$(node -e "console.log(require('./.skilled/skills/sk-code/mode-registry.json').version)").md"`; `for f in README.md shared/README.md shared/references/phase-detection.md feature-catalog/feature-catalog.md feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md; do grep -q 'sk-code-ci' .skilled/skills/sk-code/$f || echo "missing: $f"; done`; `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` | `1`; exit `0`; the loop prints nothing; exit `0` with `doc-claims: 4/4 checks passed` | Unmet | - |
| AC-009 | R22 | REQ-009 | Given R22's pre-phase snapshot and the post-phase registration, When they are compared, Then every mode and surface present before is still present, and `sk-code-ci` is present in all five lists | `node -e "const b=require('./specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/registration-before.json'); const a=require('./specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/registration-after.json'); console.log(b.modes.every(x=>a.modes.includes(x)), b.surfaces.every(x=>a.surfaces.includes(x)), a.modes.includes('sk-code-ci'), a.surfaces.includes('sk-code-ci'), a.tieBreak.includes('sk-code-ci'), a.routerSignals.includes('sk-code-ci'), a.keywords.includes('sk-code-ci'))"`; `git diff --name-only -- .skilled/skills/sk-code/mode-registry.json` | `true true true true true true true`; one modified file and no deleted mode entry | Unmet | - |
| AC-010 | R22, R23 | REQ-010 | Given R22's phase diff, When added lines outside `specs/` are searched, Then no added code or JSON comment names an R-id, a D-id or a phase number | `git diff -U0 -- . ':!specs/**' > /tmp/phase006-diff.txt; grep -E '^\+' /tmp/phase006-diff.txt > /tmp/phase006-added.txt; grep -E -e 'R2[2-3]' -e 'D[0-9]' -e 'phase [0-9]' -e '053-ci-workflow-efficiency' /tmp/phase006-added.txt` | no output, exit `1` | Unmet | - |
| AC-011 | R22 | REQ-002 | Given the composite-action rule and the tree, When `.github/actions/setup/action.yml` is absent, Then the rule reads `status: proposed` with the citation it will use once the action lands, and it reads `status: landed` when the action is present | `test -f .github/actions/setup/action.yml && echo present || echo absent`; `grep -c '^status: proposed$' .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md`; `grep -c '^status: landed$' .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` | `absent` with `1` proposed and `0` landed; or `present` with `0` proposed and `1` landed | Unmet | - |
| AC-012 | R22, R23 | REQ-010 | Given R22's packet, When its text is searched, Then it names no `specs/` path and no ephemeral id | `rg -c 'specs/' .skilled/skills/sk-code/sk-code-ci`; `rg -c -e 'R2[2-3]' -e 'D[0-9]' -e '053-ci-workflow-efficiency' .skilled/skills/sk-code/sk-code-ci` | no matches, `rg` exits `1`; no matches, `rg` exits `1` | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

This phase is planned and not built. AC-001 to AC-012 are all `Unmet`: the `sk-code-ci` packet does not exist, the hub has no CI surface entry, `ROUTER.md` has no `CI_WORKFLOW` map, the guard does not union the packet, the canary fixture has no CI case, the packet has no playbook scenario, and the message-contract exception is recorded only in this plan. The phase closes when the packet and its ten rule families exist, every hub artifact names `sk-code-ci`, the canary, compiled-route and playbook evidence route a CI prompt to `[sk-code-review, sk-code-ci]`, `message-contract.yml` is byte-identical, the hub's parent-skill and drift-guard batteries pass, and this folder's validator prints `RESULT: PASSED`.
<!-- /ANCHOR:closure -->
