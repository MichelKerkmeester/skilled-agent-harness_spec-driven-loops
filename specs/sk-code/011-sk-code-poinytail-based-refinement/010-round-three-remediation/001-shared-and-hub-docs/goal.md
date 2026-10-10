---
title: "Goal: Phase 1: shared-and-hub-docs"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs"
    last_updated_at: "2026-10-10T12:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-010-001-shared-and-hub-docs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: shared-and-hub-docs

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every pointer in the sk-code shared tier resolve, keep one copy of each Webflow pattern asset, point each copied fact to its owner and make every hub-root doc describe three surfaces at hub release 2.2.5.0.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Shared docs point to other packets with a backticked repo-root `.skilled/skills/sk-code/<packet>/...` path, and to files inside the shared tier with a `./` or `../` Markdown link relative to the linking file. |
| D2 | `SHARED_CONTROL_RESOURCES` keeps only the `shared/` paths `RESOURCE_MAP` references, seven after the pattern README leaves, and its comment names `DEFAULT_RESOURCE` as the rest of the control set, because the root-router contract rejects a declared control no map entry references. |
| D3 | The hub `README.md` carries the hub release version, and the `SKILL.md` version-authority sentence names it. |
| D4 | The comment-density rule is a `### Comment density` subsection inside `code-style-guide.md` section 4, whose `## 4. COMMENTING` heading keeps its text and number. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] From the repository root, `node specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs/scratch/check-links.cjs; echo "exit=$?"; rg -n 'references/webflow/|references/opencode/|references/motion_dev/|assets/webflow/|assets/universal/|assets/opencode/' .skilled/skills/sk-code/shared; echo "exit=$?"` prints `checked=127 missing=0`, `exit=0`, then only `exit=1`.
- [ ] From the repository root, `test -e .skilled/skills/sk-code/shared/assets; echo "shared=$?"; rg -n -i 'both supported surfaces|two surfaces|two code surfaces|both surfaces|WEBFLOW/OPENCODE detection|WEBFLOW and OPENCODE context|WEBFLOW and OPENCODE work|WEBFLOW or OPENCODE surfaces|sk-code-webflow/sk-code-opencode\)|`code-(webflow|opencode|review|quality)`|\[code-review' .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/ROUTER.md .skilled/skills/sk-code/README.md .skilled/skills/sk-code/description.json .skilled/skills/sk-code/hub-router.json .skilled/skills/sk-code/mode-registry.json .skilled/skills/sk-code/feature-catalog .skilled/skills/sk-code/shared; echo "rg=$?"` prints only `shared=1` and `rg=1`.
- [ ] From the repository root, `rg -c 'only become a failing validation outcome' .skilled/skills/sk-code/shared/references/workflow-verify.md; echo "old=$?"; rg -n 'hooks/git/pre-commit' .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md | cut -d: -f1` prints `old=1` and then only `139`.
- [ ] From the repository root, `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs | tail -1; node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js | head -1; node .skilled/bin/compiled-route-guard.cjs | grep 'sk-code '; node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs | grep 'checked='` prints `router-sync: 5/5 checks passed`, a line starting `OK: all rule invariants present`, a `sk-code` line ending in `fresh` and a line ending in `failed=0`.
- [ ] From the repository root, `grep -l -e '^version: 2.2.5.0' -e '"version": "2.2.5.0"' .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/ROUTER.md .skilled/skills/sk-code/README.md .skilled/skills/sk-code/description.json .skilled/skills/sk-code/hub-router.json .skilled/skills/sk-code/mode-registry.json | wc -l; python3 -I .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/changelog/v2.2.5.0.md | grep -o 'VALID\|Total issues: 0'` prints `6`, `VALID` and `Total issues: 0`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs --strict` prints `RESULT: PASSED`.
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
| Every shared pointer resolves and no legacy family remains | Pass | `check-links.cjs` -> `checked=127 missing=0`, `exit=0`, then `exit=1` |
| Shared pattern copies gone and no two-surface wording in owned files | Pass | `shared=1`, `rg=1`, one `**Surface list.**` line |
| validate.sh contract deferred and live hooks named | Pass | `old=1`, then `139` only |
| Router-sync, canary, compiled route and leaf manifest green | Pending orchestrator | router-sync `5/5 checks passed`, canary `OK: all rule invariants present`, leaf `checked=14 fresh=14 failed=0`; `compiled-route-guard.cjs` prints `sk-code stale-manifest` until T116 and T117 |
| Six carriers at 2.2.5.0 and the changelog validates | Pass | `6`, `VALID`, `Total issues: 0` |
| Folder validates under --strict | Pass | `validate.sh --strict` -> `Errors: 0  Warnings: 0`, `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Review defects | Three P2 defects (FIX-01 and FIX-02: `ROUTER.md:300` and `:301` link labels; FIX-03: changelog bullet crediting `workflow-verify.md` with the `validation-rules.md` pointer) were applied and re-verified. Records: `scratch/fix-units-applied.json`, tasks T168 to T170 |
| Doc-claims checker | `verify_doc_claims.cjs` ends at 3/4. The only hits left are the four `ROUTER.md:605` tier hits are a checker misreading, proved by a temp copy whose bullet no longer names `shared/` passing the `tiers` check. Child 005 owns the checker |
| Superseded plan checks | REQ-004 now holds in `sk-code-opencode/references/shared/workflow-guardrails.md` (the orchestrator amends spec REQ-004). T039 and T103 print MISSING under `check-unit.cjs` because T164 and T167 rewrote the same text, and the T125 count of `validation-rules.md` in `workflow-verify.md` is 0 because the pointer moved to `workflow-guardrails.md` |
<!-- /ANCHOR:log -->
