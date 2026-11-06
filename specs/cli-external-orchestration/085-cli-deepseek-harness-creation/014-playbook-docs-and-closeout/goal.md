---
title: "Goal: Phase 14: playbook-docs-and-closeout"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "playbook docs and closeout goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/014-playbook-docs-and-closeout"
    last_updated_at: "2026-11-06T09:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Completed keyless closeout; playbook, docs, status map and strict gate recorded."
    next_safe_action: "Resolve open closeout checks and the keyed phase 013 dependency."
    blockers: ["Phase 013 provider keys and evidence absent", "Phases 006-012 remain incomplete", "AC-005 scan expectation conflicts with required active lines", ".env.example remains operator-gated", "Seven-count scratch baseline was not recorded"]
    key_files: ["spec.md", "tasks.md", "acceptance-criteria.md", "evidence/playbook-run/summary.md", "evidence/keyless-docs-sweep.txt"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-014-playbook-docs-and-closeout"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 14: playbook-docs-and-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The `cli-deepseek-harness` playbook runs with a recorded result per scenario, every governance doc and generated index names eight runtimes correctly and the whole packet passes recursive strict validation.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Route status in every doc is copied from phase 013 evidence, so an unproven route reads "configured, not verified" |
| D2 | Historical changelog entries keep their "seven" wording and are excluded from the stale-count sweep |
| D3 | `agents-md-manifest.json` and `trigger-index.json` are rebuilt by their generators, never hand-edited |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Every scenario in `cli-deepseek-harness/manual-testing-playbook/` has a recorded result, and key-gated rows cite phase 013 evidence or a blocked reason
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/085-cli-deepseek-harness-creation --strict --recursive` prints `RESULT: PASSED`
- [ ] The `/doctor:agents-md` check reports the manifest in sync and the sk-doc code-folder tests pass
- [ ] `lookup-trigger-index.mjs --json --scoring-only -- "deepseek harness"` returns the packet
- [ ] `rg -n -i 'seven (cli|runtime|mode|bridge)'` over `AGENTS.md`, `README.md`, `SECURITY.md`, the hub and `.skilled/skills/README.txt` matches only historical changelog entries
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
| Playbook, docs reconciliation and closeout | In Progress | The saved run covers 25 scenarios: 21 PASS, the initial MIR-001 FAIL reran to PASS, and three key-gated scenarios SKIP with reasons. The documentation sweep, manifest checks and trigger lookup pass; recursive strict validation passed 15/15. AC-002 and AC-005 remain open. Evidence: evidence/playbook-run/summary.md, evidence/playbook-run/mirrors__MIR-001-rerun.txt, evidence/keyless-docs-sweep.txt, evidence/recursive-strict-results.txt:4 |
| Alignment lane runner | Done | The operator directed that workers run only on OpenCode Go DeepSeek or cli-codex, so `/local-skilled-alignment` gained `cli-opencode` and `cli-codex` lane kinds and a `--critic` mode in `run-lanes.cjs`, `opencode-go` and `codex` presets with `opencode-go` the default, and an OpenCode Go critic. Runner tests 14/14, every asset test suite 0 fail, both workflow YAMLs parse. The assets are gitignored and operator-local |

### Deviations and findings

| Item | Note |
|------|------|
| Stale-count sweep scope | The broad scan finds four active host-runtime lines that are retained to describe the seven repository-opening runtimes, plus two historical hub changelog entries. AC-005 remains unmet because it expects only historical matches. Evidence: evidence/keyless-docs-sweep.txt |
| Key-gated work | Phase 013 has no evidence directory or provider key. Keyed route and fanout checks remain open; the routes stay Experimental/configured, not verified. Evidence: evidence/keyless-docs-sweep.txt and ../013-dsh-live-contract-pin/implementation-summary.md |
<!-- /ANCHOR:log -->
