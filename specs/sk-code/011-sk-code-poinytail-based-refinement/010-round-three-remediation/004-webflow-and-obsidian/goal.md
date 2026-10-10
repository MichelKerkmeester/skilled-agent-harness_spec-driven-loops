---
title: "Goal: Phase 4: webflow-and-obsidian"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian"
    last_updated_at: "2026-10-10T12:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-010-004-webflow-and-obsidian"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: webflow-and-obsidian

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every file and section pointer in the shipped Webflow templates and references and in the Obsidian `SKILL.md`, playbook and README open something that exists, and close the Obsidian playbook root's document-validator error, without changing any route.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Template pointers name the full repository path `.skilled/skills/sk-code/sk-code-webflow/references/...`, and `component-template.js` points at the `references/javascript/style-guide/` folder. |
| D2 | Obsidian `SKILL.md` section 4 lists exactly the seven checklists under `assets/`, and no line names a file the packet does not ship. |
| D3 | The playbook root gains `## 1. OVERVIEW` above its intro paragraph, and the one `document_type_fallback` warning stays because the validator, not the file, decides it. |
| D4 | `sk-code-webflow` moves to 1.1.1.0 and `sk-code-obsidian` to 0.1.3.0, each with one changelog entry in its own `changelog/` folder. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n 'references/webflow|§13 Action Routing|§13 handles|§10 Form Validation|quick-reference\.md\)? §3 Form' .skilled/skills/sk-code/sk-code-webflow --glob '!**/changelog/**'; rg -n '\[[a-z]+_[a-z_]+\.md\]' .skilled/skills/sk-code/sk-code-webflow/references/shared/dev-workflow/common-commands.md; echo "exit=$?"` prints only `exit=1`.
- [ ] `for p in $(rg -o --no-filename '\.skilled/skills/sk-code/sk-code-webflow/references/[A-Za-z0-9_./-]+' .skilled/skills/sk-code/sk-code-webflow/assets/templates/); do test -e "$p" && echo "OK $p" || echo "MISSING $p"; done` prints nine lines starting `OK` and no line starting `MISSING`.
- [ ] `rg -n 'single-stylesheet-ownership|screenshot-fixture-harness|obsidian-api-boundary|renderer-implementation-checklist|comment-grammar-checklist|debug-checklist' .skilled/skills/sk-code/sk-code-obsidian --glob '!**/changelog/**'` prints nothing and exits 1.
- [ ] `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs | tail -1; node .skilled/bin/compiled-route-guard.cjs | grep 'sk-code '; node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code` prints `router-sync: 5/5 checks passed`, a `sk-code` line ending in `fresh` and a line starting `leaf-manifest.json OK (`.
- [ ] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook` prints `PASS package=sk-code/sk-code-obsidian tier=FAIL_CLOSED scenarios=27 categories=7 operator=27 routing_gold_excluded=0 violations=0 warnings=0` and exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| No legacy pointer, dead section pointer or old dev-workflow label remains in the Webflow packet | Done | Criterion 1 command prints only `exit=1` (verified 2026-10-10) |
| All nine template pointers exist | Done | Criterion 2 loop prints nine `OK` lines and no `MISSING` |
| No old reference or checklist name anywhere in the Obsidian packet | Done | Criterion 3 `rg` prints nothing and exits 1 |
| Router-sync 5/5, compiled route fresh, leaf manifest OK | Pending orchestrator | `router-sync: 5/5 checks passed` and `leaf-manifest.json OK (59ea33fd...)`. The route guard prints `sk-code  stale-manifest` after sibling changes, so the re-mint waits for the orchestrator |
| Obsidian playbook package validator passes | Done | `PASS package=sk-code/sk-code-obsidian tier=FAIL_CLOSED scenarios=27 categories=7 operator=27 routing_gold_excluded=0 violations=0 warnings=0`, exit 0 |
| Strict spec validation passes | Done | `RESULT: PASSED`, `Errors: 0  Warnings: 0` |

### Deviations and findings

| Item | Note |
|------|------|
| Phase 1 baselines | The builder saved no before captures under scratch/, so the verifier rebuilt them from `git archive HEAD`. Findings row count was 35 as planned, hard-blocker counts matched the plan |
| Transient router-sync failure | `verify_router_sync.cjs` printed 4/5 for a few minutes while child 005 was mid-edit (`PARENT_TIER_ALLOWLIST is not defined`) and returned to 5/5 without any change here |
| Comment-density sentence | The two Webflow budget rows say the shared guide section 4 owns comment density. That sentence lands with child 001, so recheck the link text after it merges |
| Residue fix units | Applied by the builder and re-verified: T072 and T073 in `manual-testing-playbook/token-cost-baseline/ceiling-load-all.md`, T074 in `references/performance/interaction-gated-loading.md`. Checks returned `1`, `1`, `1` and `test -e` exit 0. Units moved to scratch/fix-units-applied.json |
| Doc-claims hits | The 20 hits child 005's `verify_doc_claims.cjs` reported in these packets were fixed by units T075 to T091 and re-verified: 17 of 17 checks match, no `sk-code-webflow` or `sk-code-obsidian` line remains, both playbook package validators pass. This extended the edited files beyond spec.md, because the parent goal requires `doc-claims 4/4`. The orchestrator records the scope amendment. Criterion 4 route guard reads `stale-manifest` and needs the re-mint |
<!-- /ANCHOR:log -->
