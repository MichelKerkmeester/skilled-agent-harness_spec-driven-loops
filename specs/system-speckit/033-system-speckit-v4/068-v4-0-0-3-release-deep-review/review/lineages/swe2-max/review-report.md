# Deep Review Report — v4.0.0.2..v4.0.0.3 (swe2-max lineage)

## 1. Executive Summary

Ten review iterations over the release range, covering the deep-loop runtime,
git-contract gates, sk-doc/sk-code/sk-design/sk-prompt surfaces, hooks and
plugins across five runtimes, agent/command mirrors, repo rules, and root
docs. 14 findings remain active: 5 P1, 9 P2, 0 P0. The dominant defect class
is **silent coverage loss**: gates and telemetry that keep returning success
while skipping the content they exist to check (bundled git flags, the Devin
`write` tool, moved citations, mid-transcript blockers, legacy ledger rows).

Dimension coverage: correctness, security, traceability, maintainability —
all exercised, all four sweeps converged (iterations 6-10 produced no new
findings after five finding-bearing ones).

## 2. Planning Trigger

The release is **CONDITIONAL**: no P0 and no shipped-runtime data-loss path,
but five P1s each describe a working-as-coded defect that silently disables
enforcement or drops state. A remediation packet should land the P1 cluster
before the release is called done.

## 3. Active Finding Registry

| ID | Sev | Title | Evidence |
|----|-----|-------|----------|
| sw2m-P1-001 | P1 | Review-mode gateway rejects legacy `type:event` rows — graph_convergence/blocked-stop/pause/lineage telemetry cannot reach the ledger through the documented append path | `runtime/scripts/append-mode-event.cjs:396-464` — review schema `upcasters:[]` leaves no legacy path; only `deep_review.iteration_recorded` maps `type:"iteration"` |
| sw2m-P1-002 | P1 | `deep_review.recovery_baseline` staged to a mktemp EVENT_DIR in the opencode dispatch branch with no drain — the baseline event never reaches the ledger | `deep-review-auto.yaml:1299-1461` — drain loop removed in this range; codex branch unaffected |
| sw2m-P1-003 | P1 | `git-message-gate.mjs` bundled short flags (`-am`, `-sm`, `-qm`, `-aF`) bypass commit-message validation | `sk-git/scripts/hooks/git-message-gate.mjs:172-210` — flag scan reads standalone `-m`/`-F` only |
| sw2m-P1-004 | P1 | `git-rule-checks.mjs` advisory parser has the same bundled-flag blind spot | `sk-git/scripts/lib/git-rule-checks.mjs:97-113` |
| sw2m-P1-005 | P1 | `.devin/hooks.v1.json` + `DEVIN_TOOL_MAP` omit the `write` tool — whole-file writes bypass spec-gate enforce and post-edit-quality | `.devin/hooks.v1.json:76-110`; cursor twin maps Write→write |
| sw2m-P2-001 | P2 | `state_write_protocol` doc asserts event rows are canonical ledger events; implementation contradicts it | `deep-review-auto.yaml:114-117` |
| sw2m-P2-002 | P2 | SKILL.md NEVER rule 6 (config read-only) vs `step_update_config_status` writing `status:complete` — lead-ruled wording gap | `deep-review-auto.yaml:2322-2325` |
| sw2m-P2-003 | P2 | `v8.setFlagsFromString` runs before the protective try/catch — unsupported flag disables the gate silently | `git-message-gate.mjs:380-406` |
| sw2m-P2-004 | P2 | `check-repo-rules.cjs` stemmer diverges on its own documented example; coverage under-counts | `check-repo-rules.cjs:38-41` |
| sw2m-P2-005 | P2 | `validate_document.py` dereferences the shared frontmatter-values map unguarded — malformed/missing structure hard-crashes | `validate_document.py:1607-1652` |
| sw2m-P2-006 | P2 | citation-drift advisory excludes moved/renamed citations from the check pool and the unchecked count | `classifier-cite-drift-scan.mjs:862-983` |
| sw2m-P2-007 | P2 | goal verifier tail-windows evidence to the last 1200 chars — mid-transcript blockers invisible to the verdict | `goal/lib/goal-core.cjs:592-605` |
| sw2m-P2-008 | P2 | injection-screen `UNKNOWN_SESSION` bucket strands advisories or attributes them to an unrelated session | `classifier-injection-screen.js:31-96` |
| sw2m-P2-009 | P2 | `frontmatter-values.json` has two consumers with asymmetric failure semantics (spec-kit warns, sk-doc crashes) | `check-frontmatter-values-helper.cjs:100-107` ↔ `validate_document.py` (extends P2-005) |

## 4. Remediation Workstreams

1. **Ledger/telemetry integrity** (P1-001, P1-002, P2-001): teach the
   review gateway an upcast for legacy `type:event` rows or remove the dead
   append path; restore the opencode-branch EVENT_DIR drain for
   recovery_baseline; reconcile `state_write_protocol` wording.
2. **Git flag parsing** (P1-003, P1-004, P2-003): one shared argv scanner
   that resolves bundled short flags to their payload form; move
   `setFlagsFromString` inside the guard.
3. **Runtime tool-map parity** (P1-005): add `write` to `DEVIN_TOOL_MAP` +
   hooks.v1.json, mirroring the cursor mapping.
4. **Advisory completeness** (P2-006, P2-007, P2-008): count
   moved/unresolved citations as unchecked; widen the verifier window or
   checkpoint mid-transcript; route UNKNOWN_SESSION advisories to a visible
   sink.
5. **Shared-contract hardening** (P2-005, P2-009, P2-004): give
   `validate_document.py` the spec-kit helper's degrade-to-warn behavior;
   align the stemmer with its own documented example.

## 5. Spec Seed

Target packet: a remediation spec under
`specs/system-speckit/033-system-speckit-v4/` numbered for the v4.0.0.3
follow-up. Scope it to the five workstreams above; the registry JSON is the
source of truth for what must close.

## 6. Plan Seed

Phase 1: workstreams 1-3 (the P1s — enforcement and ledger integrity).
Phase 2: workstreams 4-5 (advisory completeness and contract hardening).
Each workstream already carries file:line evidence; fixes are local to the
named files plus their test surfaces (which exist for every one of them).

## 7. Traceability Status

Every finding carries file:line or commit evidence and a concrete failure
scenario in its iteration narrative (`iterations/iteration-001..010.md`).
Two candidates were adjudicated and withdrawn with reasons recorded
(iterations 3 and 5). One prior finding was re-adjudicated on later evidence
(P2-006 narrowed to reporting precision in iteration 5). The mirror-drift
signal that opened iteration 6 was fully disproven by the generators'
`--check` modes (12/12 in sync on both Pi and Codex) — recorded as
adjudicated, not as a finding.

## 8. Deferred Items

- `.pi/agents` sync checks absent from pre-commit MIRROR_CHECKS (CI-only
  coverage) — predates this release; noted for completeness, not a defect.
- `agent-roster-mirror-check.cjs` comment calls `.codex/agents`
  "independently-authored"; they are generated. Wording nit only.
- `AGENTS.md` last required anchor ends 25 bytes before the Devin cut —
  guarded by the rule-canary CI gate by design.
- `sk-prompt/README.md` version field lags SKILL.md (3.0.0.0 vs 3.0.2.0) —
  pre-existing; README is not the version authority.

## 9. Audit Appendix

- **Lineage**: `fanout-swe2-max-1791260058145-vgna23`, executor
  `cli-devin model=swe-2-max`, loop_type `review`, stopPolicy
  `max-iterations` (10), convergenceThreshold 0.1.
- **Iterations**: 10/10 complete; state records appended via the canonical
  gateway (`append-mode-event.cjs`), sequences 1-11.
- **Artifacts**: `iterations/iteration-001..010.md`, `deltas/iter-001..010.
  jsonl`, `logs/event-*.json`, `deep-review-findings-registry.json`
  (reducer-rebuilt: 14 open findings), `deep-review-dashboard.md`,
  `deep-review-strategy.md`, this report.
- **Convergence**: iterations 6-10 added zero new findings across mirrors,
  repo rules, root docs, sk-code/sk-prompt, sk-design, sk-create-* and the
  create/speckit command surfaces — the finding-bearing frontier closed at
  iteration 5; the remaining five iterations were verification sweeps.
- **Conflicts**: SKILL.md NEVER rule 6 vs the workflow's terminal status
  update — lead-ruled in favor of the YAML; recorded as sw2m-P2-002.
