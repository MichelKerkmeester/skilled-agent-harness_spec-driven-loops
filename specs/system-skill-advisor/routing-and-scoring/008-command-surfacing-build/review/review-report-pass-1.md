# Review Report: Command Surfacing Build (merged fan-out)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Run: fan-out `1794550137809-1ecgc7`, four lineages, five iterations each, executor `cli-opencode` `opencode-go/deepseek-v4.1-flash` at reasoning effort max
- Reviewed range: commits `35c3188681..320e7b64d4` (37 commits), 206 paths in `review/review-scope.txt`
- Inputs to this synthesis: `review/deep-review-findings-registry.json` (merged, 43 open findings), the four lineage folders under `review/lineages/` and a fresh re-read of every cited file and line
- Root config: `review/deep-review-config.json`, status left at `initialized` because a second pass follows

---

## 1. Executive Summary

- **Verdict: PASS** after adversarial verification. The merged registry said CONDITIONAL with two P1 findings. Both were re-read and probed. Both drop to P2 (scenarios in section 3).
- **hasAdvisories: true**
- **Active counts after verification:** P0 0, P1 0, P2 42. One finding is refused (REFUTED). The coordinator's three queued items are verified as P2 and carried as Q1, Q2 and Q3.
- **Verdict breakdown of the 43:** 33 CONFIRMED, 9 CONFIRMED-ADJUSTED, 1 REFUTED.
- **Severity changes:** DR1-P1-001 and DR4-P1-001 are lowered from P1 to P2. Nothing is raised. R2-P2-001 stays P2 even though its own promotion trigger fired (the no-edit reach is now proven end to end), because the attached command carries `start` and `AGENTS.md:68` lets an explicit instruction outrank the policy.
- **Origin:** 23 of the 42 confirmed findings were introduced by this packet. 19 predate it, several on lines the packet edited.
- **Scope:** the scorer and attach path, the brief renderer with its hook readers, the routing-accuracy runner with its scorer, the doctor install, setup and AGENTS.md routes plus the shared docs that describe them.
- **Operator review focus:** recorded verbatim in `deep-review-config.json` `reviewFocus`. In short it asked for behaviour on claude, codex, opencode, pi, devin and dsh, the safety of offering a mutating command, holdout hygiene and docs that disagree with code. It is paraphrased here because the verbatim text carries punctuation this report's writing rules exclude.
- **Convergence:** the loop has **not converged**. Three of the four lineages (render-hooks-plugin, accuracy-runner and doctor-install) stopped at their five-iteration cap with a last novelty ratio above the 0.10 threshold (0.15, 0.11 and 0.125). Only scorer-attach reached 0.00. A second review pass after remediation is required before the loop counts as converged.
- **Release readiness:** `in-progress`.

---

## 2. Planning Trigger

The verdict alone does not require `/speckit:plan`, because PASS routes to a changelog. Remediation is still triggered here for two reasons. The coordinator queued a fix pass with three extra items. The loop also needs a second review pass over the fixed code before it can converge. The Planning Packet below groups every confirmed finding into file-disjoint work groups that a small-model worker swarm can build in parallel. The safety lane comes first: the two former P1 findings and the safety-shaped P2 findings.

```json Planning Packet
{
  "triggered": true,
  "triggerReason": "Advisory remediation queued by the coordinator and a second review pass is required, because three lineages stopped at the iteration cap above the 0.10 threshold",
  "verdict": "PASS",
  "hasAdvisories": true,
  "counts": { "p0": 0, "p1": 0, "p2": 42, "queued": 3, "refuted": 1 },
  "activeFindings": [
    { "id": "DR1-P1-001", "severity": "P2", "previousSeverity": "P1", "verdict": "CONFIRMED-ADJUSTED", "location": ".skilled/commands/doctor/scripts/agents-md-embed.cjs:1364", "origin": "pre-existing", "workGroup": "WG1" },
    { "id": "DR4-P1-001", "severity": "P2", "previousSeverity": "P1", "verdict": "CONFIRMED-ADJUSTED", "location": ".skilled/commands/doctor/scripts/agents-md-embed.cjs:783", "origin": "pre-existing", "workGroup": "WG1" },
    { "id": "DR4-P2-001", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/scripts/agents-md-embed.cjs:1289", "origin": "pre-existing", "workGroup": "WG1" },
    { "id": "DR1-P2-003", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/scripts/agents-md-embed.cjs:598", "origin": "pre-existing", "workGroup": "WG1" },
    { "id": "R2-P2-001", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:353", "origin": "introduced", "workGroup": "WG2" },
    { "id": "R1-P2-001", "severity": "P2", "verdict": "CONFIRMED-ADJUSTED", "location": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:385", "origin": "introduced", "workGroup": "WG2" },
    { "id": "R1-P2-002--95282927956e", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:266", "origin": "introduced", "workGroup": "WG2" },
    { "id": "R4-P2-001--d1528b81a2ca", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:123", "origin": "introduced", "workGroup": "WG2" },
    { "id": "R4-P2-002--828881666f76", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:750", "origin": "pre-existing", "workGroup": "WG2" },
    { "id": "R1-P2-005", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/lib/render.ts:226", "origin": "introduced", "workGroup": "WG3" },
    { "id": "R2-P2-003", "severity": "P2", "verdict": "CONFIRMED-ADJUSTED", "location": ".skilled/skills/system-skill-advisor/runtime/lib/render.ts:233", "origin": "introduced", "workGroup": "WG3" },
    { "id": "R4-P2-002--de3d8b259d8e", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/lib/render.ts:522", "origin": "introduced", "workGroup": "WG3" },
    { "id": "Q1-ai-session-child-test-isolation", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/tests/command-brief-golden.vitest.ts:213", "origin": "introduced", "workGroup": "WG3" },
    { "id": "iter5-P2-credential-hardening-allowlist", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:782", "origin": "introduced", "workGroup": "WG4" },
    { "id": "iter2-P2-arena-precondition-unverified", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:986", "origin": "introduced", "workGroup": "WG4" },
    { "id": "iter4-P2-g2-label-grammar-duplication", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:929", "origin": "introduced", "workGroup": "WG4" },
    { "id": "DR1-P2-001", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/scripts/agents-md-check.cjs:709", "origin": "pre-existing", "workGroup": "WG5" },
    { "id": "DR1-P2-002", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/scripts/agents-md-check.cjs:731", "origin": "pre-existing", "workGroup": "WG5" },
    { "id": "DR3-P2-001", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/scripts/agents-md-check.cjs:649", "origin": "introduced", "workGroup": "WG5" },
    { "id": "DR5-P2-003", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/scripts/agents-md-check.cjs:809", "origin": "pre-existing", "workGroup": "WG5" },
    { "id": "DR3-P2-004", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/scripts/README.markdown:102", "origin": "pre-existing", "workGroup": "WG5" },
    { "id": "DR5-P2-001", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/scripts/codex-hook-approval-check.cjs:59", "origin": "introduced", "workGroup": "WG6" },
    { "id": "DR5-P2-002", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/scripts/hook-wiring-check.cjs:123", "origin": "introduced", "workGroup": "WG6" },
    { "id": "DR3-P2-002", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:165", "origin": "introduced", "workGroup": "WG6+WG7" },
    { "id": "DR3-P2-003", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/assets/doctor-symlink-check.yaml:67", "origin": "introduced", "workGroup": "WG7" },
    { "id": "DR2-P2-003", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/setup.md:75", "origin": "pre-existing", "workGroup": "WG7" },
    { "id": "Q3-hook-health-needs-debug", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/assets/doctor-setup.yaml:59", "origin": "introduced", "workGroup": "WG7" },
    { "id": "DR2-P2-001", "severity": "P2", "verdict": "CONFIRMED-ADJUSTED", "location": ".skilled/commands/doctor/assets/doctor-install-presentation.txt:78", "origin": "pre-existing", "workGroup": "WG8" },
    { "id": "DR2-P2-002", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:89", "origin": "introduced", "workGroup": "WG8" },
    { "id": "iter5-P2-holdout-secondary-split-publication", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:537", "origin": "introduced", "workGroup": "WG9" },
    { "id": "iter1-P2-readme-inventory-drift", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:29", "origin": "introduced", "workGroup": "WG10" },
    { "id": "iter3-P2-readme-restore-exit3", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:113", "origin": "introduced", "workGroup": "WG10" },
    { "id": "iter1-P2-offer-reached-unknown", "severity": "P2", "verdict": "CONFIRMED-ADJUSTED", "location": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:111", "origin": "introduced", "workGroup": "WG10" },
    { "id": "R1-P2-004", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/hooks/shared/session-readers/devin.mjs:395", "origin": "pre-existing", "workGroup": "WG11" },
    { "id": "R1-P2-003", "severity": "P2", "verdict": "CONFIRMED-ADJUSTED", "location": ".skilled/hooks/shared/session-readers/dsh.mjs:195", "origin": "pre-existing", "workGroup": "WG11" },
    { "id": "R1-P2-002--fabc628596e7", "severity": "P2", "verdict": "CONFIRMED-ADJUSTED", "location": ".skilled/hooks/shared/session-readers/claude.mjs:217", "origin": "pre-existing", "workGroup": "WG11" },
    { "id": "R4-P2-001--09ff48e9a0b9", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/hooks/shared/session-readers/index.mjs:28", "origin": "pre-existing", "workGroup": "WG11" },
    { "id": "R2-P2-002", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:239", "origin": "pre-existing", "workGroup": "WG12" },
    { "id": "iter4-P2-bench-runtime-matrix-incomplete", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts:26", "origin": "pre-existing", "workGroup": "WG12" },
    { "id": "R3-P2-001--0e0d904eb571", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/README.md:176", "origin": "introduced", "workGroup": "WG13" },
    { "id": "R3-P2-002--5522ea1fe8dd", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/ARCHITECTURE.md:142", "origin": "pre-existing", "workGroup": "WG13" },
    { "id": "R3-P2-002--ecbea1260371", "severity": "P2", "verdict": "CONFIRMED-ADJUSTED", "location": ".skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:45", "origin": "introduced", "workGroup": "WG13" },
    { "id": "Q2-command-policies-doc", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:45", "origin": "introduced", "workGroup": "WG13" },
    { "id": "R4-P2-003", "severity": "P2", "verdict": "CONFIRMED", "location": "AGENTS.md:65", "origin": "pre-existing", "workGroup": "WG14" },
    { "id": "iter3-P2-phase007-open-evidence", "severity": "P2", "verdict": "CONFIRMED", "location": "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:120", "origin": "introduced", "workGroup": "WG14" }
  ],
  "refuted": [
    { "id": "R3-P2-001--16e5737e0e56", "location": ".skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:176", "reason": "skill-advisor-brief.ts:519-522 passes subprocessTimeoutMs to runAdvisorSubprocess and subprocess.ts:298 falls back to the SPECKIT_OPENCODE_HOOK_TIMEOUT_MS reader when it is unset, so the brief path does honour the variable" }
  ],
  "remediationWorkstreams": [
    { "id": "WG1", "order": 1, "lane": "safety", "title": "Embed engine write safety", "files": [".skilled/commands/doctor/scripts/agents-md-embed.cjs", ".skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs", ".skilled/commands/doctor/assets/doctor-agents-md-embed.yaml"], "findings": ["DR1-P1-001", "DR4-P1-001", "DR4-P2-001", "DR1-P2-003"] },
    { "id": "WG2", "order": 2, "lane": "safety", "title": "Attach-path guards and the dead policy table", "files": [".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts", ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts", ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs", ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md", ".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts"], "findings": ["R2-P2-001", "R1-P2-001", "R1-P2-002--95282927956e", "R4-P2-001--d1528b81a2ca", "R4-P2-002--828881666f76"] },
    { "id": "WG3", "order": 3, "lane": "safety", "title": "Renderer contract and child-marker test isolation", "files": [".skilled/skills/system-skill-advisor/runtime/lib/render.ts", ".skilled/skills/system-skill-advisor/runtime/tests/command-brief-golden.vitest.ts", ".skilled/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts", ".skilled/skills/system-skill-advisor/runtime/tests/render-child-session.vitest.ts"], "findings": ["R1-P2-005", "R2-P2-003", "R4-P2-002--de3d8b259d8e", "Q1-ai-session-child-test-isolation"] },
    { "id": "WG4", "order": 4, "lane": "safety", "title": "Behaviour runner containment", "files": [".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs", ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs", ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs", ".skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts"], "findings": ["iter5-P2-credential-hardening-allowlist", "iter2-P2-arena-precondition-unverified", "iter4-P2-g2-label-grammar-duplication"] },
    { "id": "WG5", "order": 5, "lane": "advisory", "title": "AGENTS.md check engine truth", "files": [".skilled/commands/doctor/scripts/agents-md-check.cjs", ".skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs", ".skilled/commands/doctor/scripts/README.markdown"], "findings": ["DR1-P2-001", "DR1-P2-002", "DR3-P2-001", "DR5-P2-003", "DR3-P2-004"] },
    { "id": "WG6", "order": 6, "lane": "advisory", "title": "Hook check scripts", "files": [".skilled/commands/doctor/scripts/codex-hook-approval-check.cjs", ".skilled/commands/doctor/scripts/hook-wiring-check.cjs", ".skilled/commands/doctor/scripts/tests/codex-hook-approval-check.test.cjs", ".skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs"], "findings": ["DR5-P2-001", "DR5-P2-002", "DR3-P2-002"] },
    { "id": "WG7", "order": 7, "lane": "advisory", "title": "Setup, mirrors and symlink workflow contracts", "files": [".skilled/commands/doctor/assets/doctor-setup.yaml", ".skilled/commands/doctor/setup.md", ".skilled/commands/doctor/assets/doctor-setup-presentation.txt", ".skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml", ".skilled/commands/doctor/assets/doctor-symlink-check.yaml", ".skilled/commands/doctor/scripts/tests/doctor-setup-contract.test.cjs"], "findings": ["DR3-P2-002", "DR3-P2-003", "DR2-P2-003", "Q3-hook-health-needs-debug"] },
    { "id": "WG8", "order": 8, "lane": "advisory", "title": "Install guide and embedder host binding", "files": [".skilled/commands/doctor/assets/doctor-install-presentation.txt", ".skilled/commands/doctor/assets/doctor-install.yaml", ".skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml", ".skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs", ".skilled/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs"], "findings": ["DR2-P2-001", "DR2-P2-002"] },
    { "id": "WG9", "order": 9, "lane": "advisory", "title": "Holdout rows out of the published baseline", "files": [".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs", ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json", ".skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts"], "findings": ["iter5-P2-holdout-secondary-split-publication"] },
    { "id": "WG10", "order": 10, "lane": "advisory", "title": "Routing-accuracy README truth", "files": [".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md"], "findings": ["iter1-P2-readme-inventory-drift", "iter3-P2-readme-restore-exit3", "iter1-P2-offer-reached-unknown"] },
    { "id": "WG11", "order": 11, "lane": "advisory", "title": "Session readers", "files": [".skilled/hooks/shared/session-readers/claude.mjs", ".skilled/hooks/shared/session-readers/devin.mjs", ".skilled/hooks/shared/session-readers/dsh.mjs", ".skilled/hooks/shared/session-readers/pi.mjs", ".skilled/hooks/shared/session-readers/index.mjs", ".skilled/hooks/shared/session-readers/README.md", ".skilled/hooks/shared/tests/session-readers/", ".skilled/skills/system-skill-advisor/runtime/tests/hooks/advisor-runtime-list-parity.vitest.ts"], "findings": ["R1-P2-004", "R1-P2-003", "R1-P2-002--fabc628596e7", "R4-P2-001--09ff48e9a0b9"] },
    { "id": "WG12", "order": 12, "lane": "advisory", "title": "Subprocess output cap and bench matrix", "files": [".skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts", ".skilled/skills/system-skill-advisor/runtime/tests/subprocess-output-cap.vitest.ts", ".skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts"], "findings": ["R2-P2-002", "iter4-P2-bench-runtime-matrix-incomplete"] },
    { "id": "WG13", "order": 13, "lane": "advisory", "title": "Advisor docs against code", "files": [".skilled/skills/system-skill-advisor/README.md", ".skilled/skills/system-skill-advisor/ARCHITECTURE.md", ".skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md", ".skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md"], "findings": ["R3-P2-001--0e0d904eb571", "R3-P2-002--5522ea1fe8dd", "R3-P2-002--ecbea1260371", "Q2-command-policies-doc"] },
    { "id": "WG14", "order": 14, "lane": "operator-and-coordinator", "title": "Root framework doc and packet status", "files": ["AGENTS.md", "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md"], "findings": ["R4-P2-003", "iter3-P2-phase007-open-evidence"], "gate": "AGENTS.md is the shared framework document, so its edit waits for the operator. The packet status is the coordinator's." }
  ],
  "specSeed": [
    "A failed write inside an embed apply restores from the backup, prints the backup and undo lines and exits with a code the workflow reads as undone, never as nothing written",
    "Embed refuses a symlinked router or Cursor mirror the same way it refuses a symlinked root document",
    "A prompt matching the shared no-edit wording attaches no mutating command on the hub route path, as it already attaches none on the scorer path",
    "A typed command counts only when it is not part of a file name. The deep-loop gate opens only for the typed command being attached",
    "COMMAND_POLICIES is removed and every doc names TRACKED_COMMANDS as the attach-path policy source",
    "Renderer tests isolate themselves from AI_SESSION_CHILD",
    "A live behaviour arm starts only in a prepared arena and only with an allowlisted child environment",
    "The committed command baseline publishes no per-row outcome for a holdout row",
    "Doctor check output never counts a known gap as expected and never reports a mention as a wired hook",
    "The /doctor:setup advisor leg says when hook health is not recorded and why"
  ],
  "planSeed": [
    "WG1 to WG4 first, in parallel, each with one failing-then-passing test per finding",
    "WG5 to WG13 next, in parallel, using the repair line text fixed in section 4 so WG6 and WG7 need no hand-off",
    "WG14 waits for the operator (AGENTS.md) and the coordinator (phase 007 status)",
    "Then a second /deep:review pass over the remediation diff with the same four lineages and the 0.10 threshold"
  ],
  "findingClasses": ["class-of-bug", "cross-consumer", "instance-only", "safety-of-offering-a-mutating-command", "wrong-command-offer", "false-command-match", "credential-hardening", "defence-in-depth", "measurement-hygiene", "metric-semantics", "documentation-drift", "doc-code-drift", "dead-generated-surface", "dead-control-flow", "latent-test-defect", "duplicated-source-of-truth", "checklist-evidence"],
  "affectedSurfacesSeed": [
    "agents-md-embed apply, compose and restore",
    "agents-md-check A10 and A11",
    "codex-hook-approval-check and hook-wiring-check",
    "doctor setup, runtime-mirrors, symlink-check, install and embedder workflows",
    "command-attach attachCommand and typedCommandIn",
    "derive-command-bridges generated blocks",
    "render.ts commandLabel and the child downgrade",
    "advisor renderer test suite",
    "run-command-behaviour child environment and first-turn guard",
    "capture-command-routing-baseline rows map and the slice test",
    "shared session readers for claude, devin, dsh and pi",
    "advisor subprocess and the hook-brief bench",
    "advisor README, ARCHITECTURE and two feature-catalog pages",
    "root AGENTS.md Gate 2 direct call",
    "packet phase map"
  ],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

### 3.1 Full table (43 merged findings plus 3 queued items)

Verdict key: CONFIRMED means the defect is real as stated. ADJUSTED means real but the severity or the description is corrected. REFUTED means the code does not do what the finding says. Origin is from `git blame` against `35c3188681`: introduced means the cited lines came from the reviewed range, pre-existing means they predate it.

| Id | Sev after (before) | Verdict | Location | Origin | Fix in one line |
|---|---|---|---|---|---|
| DR1-P1-001 | P2 (P1) | ADJUSTED | `.skilled/commands/doctor/scripts/agents-md-embed.cjs:1364` | pre-existing | Catch a throw in the write loop, call `restoreFromBackup`, print the backup and undo lines and return a distinct exit the workflow reads as undone |
| DR4-P1-001 | P2 (P1) | ADJUSTED | `.skilled/commands/doctor/scripts/agents-md-embed.cjs:783` | pre-existing | Throw `PreconditionError` in `compose` when `REPO RULES.md` or `.cursor/rules/repo-local.md` is a symlink, as `:652` does for the root document |
| DR4-P2-001 | P2 | CONFIRMED | `.skilled/commands/doctor/scripts/agents-md-embed.cjs:1289` | pre-existing | Run `assertWritable` and the per-entry sha256 check inside `restoreFromBackup`, as `commandRestore` already does |
| DR1-P2-003 | P2 | CONFIRMED | `.skilled/commands/doctor/scripts/agents-md-embed.cjs:598` | pre-existing | Fail plan and apply on a non-empty `foreign` list exactly as they fail on `dropped` |
| R2-P2-001 | P2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:353` | introduced | Return no command from `attachCommand` when the shared no-edit pattern matches |
| R1-P2-001 | P2 | ADJUSTED | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:385` | introduced | Open the deep-loop gate only when the typed `/deep:` command equals the command being attached |
| R1-P2-002--95282927956e | P2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:266` | introduced | Treat a `/` or a `.` followed by a word character after the key as a continuation so a file name never matches |
| R4-P2-001--d1528b81a2ca | P2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:123` | introduced | Delete the `COMMAND_POLICIES` emitter and block, because the live reader `TRACKED_COMMANDS` covers 11 attachable commands it lacks |
| R4-P2-002--828881666f76 | P2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:750` | pre-existing | Delete the empty semantic-search branch |
| R1-P2-005 | P2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:226` | introduced | Skip the row backfill in `commandLabel` when `needsMode` is true |
| R2-P2-003 | P2 | ADJUSTED | `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:233` | introduced | Read `mutating` from the row whose command equals the printed command and treat an unknown command as writing |
| R4-P2-002--de3d8b259d8e | P2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:522` | introduced | Keep the literal and add a parity test against `isChildSession` in `spec-gate-core.mjs` instead of a cross-package import |
| Q1 (queued item i) | P2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/tests/command-brief-golden.vitest.ts`, `tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` | introduced | Stub `AI_SESSION_CHILD` to an empty string in `beforeEach` and unstub in `afterEach`, as `render-child-session.vitest.ts` does |
| iter5-P2-credential-hardening-allowlist | P2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:782` | introduced | Build the child environment from an allowlist instead of deleting three GitHub token names |
| iter2-P2-arena-precondition-unverified | P2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:986` | introduced | Have the arena builder write a marker and refuse a live arm when it is missing |
| iter4-P2-g2-label-grammar-duplication | P2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:929` | introduced | Export the g2 row map from the runner and label rows from it instead of from a regex |
| DR1-P2-001 | P2 | CONFIRMED | `.skilled/commands/doctor/scripts/agents-md-check.cjs:709` | pre-existing | Consult `expectsAbsent` before the symlink branch |
| DR1-P2-002 | P2 | CONFIRMED | `.skilled/commands/doctor/scripts/agents-md-check.cjs:731` | pre-existing | Reword the pass detail to say the file names the root document and carries no shipped line |
| DR3-P2-001 | P2 | CONFIRMED | `.skilled/commands/doctor/scripts/agents-md-check.cjs:649` | introduced | Leave the pointer-missing entry out of the "as expected" count and count it on its own |
| DR5-P2-003 | P2 | CONFIRMED | `.skilled/commands/doctor/scripts/agents-md-check.cjs:809` | pre-existing | Report a width-mismatched router row as malformed with its line instead of dropping it |
| DR3-P2-004 | P2 | CONFIRMED | `.skilled/commands/doctor/scripts/README.markdown:102` | pre-existing | Say four children and name the A12 manifest generator here and in the module header |
| DR5-P2-001 | P2 | CONFIRMED | `.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs:59` | introduced | Reject a flag value that starts with `-`, as `hook-wiring-check.cjs:87` does |
| DR5-P2-002 | P2 | CONFIRMED | `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:123` | introduced | Match the marker as the script path inside a `type: command` entry's `command`, never in the serialized payload |
| DR3-P2-002 | P2 | CONFIRMED | `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:165` | introduced | Print a repair line in the absent branch and route setup to that line instead of to `/doctor:runtime-mirrors` |
| DR3-P2-003 | P2 | CONFIRMED | `.skilled/commands/doctor/assets/doctor-symlink-check.yaml:67` | introduced | Add the hook-wiring exit 1 to the output block as WARN |
| DR2-P2-003 | P2 | CONFIRMED | `.skilled/commands/doctor/setup.md:75` | pre-existing | Name the socket-directory write in the workflow's mutation boundary or drop it from `setup.md` |
| Q3 (queued item iii) | P2 | CONFIRMED | `.skilled/commands/doctor/assets/doctor-setup.yaml:59` | introduced | Print "hook health not recorded" with the reason when `data.hookHealth` is absent |
| DR2-P2-001 | P2 | ADJUSTED | `.skilled/commands/doctor/assets/doctor-install-presentation.txt:78` | pre-existing | Replace "the seven" with the six names plus "the ones already there" and record the missing dsh install row as a decision |
| DR2-P2-002 | P2 | CONFIRMED | `.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:89` | introduced | Run `ollama serve` and `ollama pull` with `OLLAMA_HOST` taken from the resolved URL. Otherwise refuse start and pull for a non-local URL |
| iter5-P2-holdout-secondary-split-publication | P2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:537` | introduced | Leave holdout rows out of the published `rows` map and compare only non-holdout rows in the slice test |
| iter1-P2-readme-inventory-drift | P2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:29` | introduced | Set the count to 14 and list every code and data file |
| iter3-P2-readme-restore-exit3 | P2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:113` | introduced | Document exit 3 (`head_moved`) and that it skips the restore |
| iter1-P2-offer-reached-unknown | P2 | ADJUSTED | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:111` | introduced | Reword the README: `offerReached` counts offers whose brief was not shown missing, so `unknown` counts |
| R1-P2-004 | P2 | CONFIRMED | `.skilled/hooks/shared/session-readers/devin.mjs:395` | pre-existing | Fall through to `loadTranscript` before returning `store_unreadable` on a database open or projection failure |
| R1-P2-003 | P2 | ADJUSTED | `.skilled/hooks/shared/session-readers/dsh.mjs:195` | pre-existing | Keep the fail-closed rule and pin it with a test and a reader README sentence |
| R1-P2-002--fabc628596e7 | P2 | ADJUSTED | `.skilled/hooks/shared/session-readers/claude.mjs:217` | pre-existing | Open `containment.path` instead of the caller path in the claude, devin, dsh and pi readers |
| R4-P2-001--09ff48e9a0b9 | P2 | CONFIRMED | `.skilled/hooks/shared/session-readers/index.mjs:28` | pre-existing | Add `Object.keys(capabilities)` to the runtime list parity test |
| R2-P2-002 | P2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:239` | pre-existing | Cap stdout and stderr the way `capStdout` caps them in the hook fallback |
| iter4-P2-bench-runtime-matrix-incomplete | P2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts:26` | pre-existing | Fill the matrix for every value in `ADVISOR_RUNTIME_VALUES` |
| R3-P2-001--0e0d904eb571 | P2 | CONFIRMED | `.skilled/skills/system-skill-advisor/README.md:176` | introduced | Say 46 rows here and in `feature-catalog/scorer-fusion/command-meaning-matching.md:26` |
| R3-P2-002--5522ea1fe8dd | P2 | CONFIRMED | `.skilled/skills/system-skill-advisor/ARCHITECTURE.md:142` | pre-existing | Add the DSH prompt adapter (`hooks/dsh/prompt-advisor.mjs`) to the adapter sentence |
| R3-P2-002--ecbea1260371 | P2 | ADJUSTED | `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:45` | introduced | Add `mutating` to the documented row shape and name it as the child downgrade's input |
| Q2 (queued item ii) | P2 | CONFIRMED | `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:45` | introduced | Name `TRACKED_COMMANDS[command].policy` as the attach-path policy source |
| R4-P2-003 | P2 | CONFIRMED | `AGENTS.md:65` | pre-existing | Show the direct call with `--json -` and the request on stdin |
| iter3-P2-phase007-open-evidence | P2 | CONFIRMED | `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:120` | introduced | Close phase 007 or record in the phase map why phases 10 to 13 closed past it |
| R3-P2-001--16e5737e0e56 | none | REFUTED | `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:176` | pre-existing | No change |

### 3.2 Verified scenarios for the two former P1 findings

**DR1-P1-001, `agents-md-embed.cjs:1364`, lowered to P2.**

- Input: the `claude-only` fixture (a repository with only `CLAUDE.md`), `plan --create-router`, then `apply --plan-digest <digest> --create-router` with the second write failing. The probe used the engine's own `hooks.write` seam to throw `EACCES` on the second call.
- What happens: `AGENTS.md` is created, then the throw leaves the bare loop at `:1365-1374`. `main` re-throws it because it is not an allowlist, precondition or usage error (`:1562-1572`), so the CLI's outer catch prints `ERROR: <message>` and exits 2 (`:1579-1581`). No restore runs and apply prints no backup or undo line. The probe tree after the run held `AGENTS.md` and the untouched `CLAUDE.md`. The workflow then reads exit 2 as "nothing was written" (`doctor-agents-md-embed.yaml:100` and `:104`), which is false here.
- What should happen: the loop catches the throw, calls `restoreFromBackup`, prints the backup and undo lines and ends with STATUS=FAIL under an exit code the workflow maps to "the run was undone".
- Why P2 and not P1: reach needs an I/O fault on an allowlisted path after every precondition passed. The shapes a link install produces are refused before any byte (probe: a `REPO RULES.md` linked outside the root exits 2 with "resolves outside the target root through a link, nothing was written"). The backup is complete before the first write (`:1361`) and the plan the operator approved already printed `backup:` and `undo:` (`:1228-1230`), so nothing is lost. It is a recoverability gap, not a wrong result on a default path.
- Test: in `agents-md-embed.test.cjs`, a write hook that throws on the second call. Today `main` throws and `AGENTS.md` stays. After the fix `main` returns non-zero with `restored` and `undo:` in its output. `treeDigest` then equals the pre-run digest.

**DR4-P1-001, `agents-md-embed.cjs:783`, lowered to P2.**

- Input: `.cursor/rules/repo-local.md` is a symlink to `../../.github/ci.yml` inside the repository and the block carries content (probe on the `foreign` fixture).
- What happens: plan prints `target .cursor/rules/repo-local.md: replace` with a diff whose before side is the CI file's bytes. Apply writes the mirror text through the link into `.github/ci.yml` and ends `STATUS=OK`. A second probe with `REPO RULES.md` linked to an in-root table file wrote the added router row into that file. The backup recorded `symlink: true`.
- What should happen: compose refuses a symlinked router or mirror the way it refuses a symlinked root document (`:652-654`).
- Why P2 and not P1: the finding's own case is wrong. It says the link install mode produces `REPO RULES.md -> AGENTS.md`, but `symlink-manifest.json:24` links `REPO RULES.md` to the Skilled checkout's own file and `:8` links `.cursor` to the checkout's folder. Both resolve outside the target root. `assertWritable` (`:900-904`) refuses them before any backup (probe exit 2). A `REPO RULES.md` linked to `AGENTS.md` is a no-op because `AGENTS.md` has no trigger table (probe: router `unchanged`). What remains is a hand-made link inside the root, whose bytes the plan's diff shows and the backup restores. No security boundary is crossed.
- Test: a fixture whose mirror links to an in-root file. Today plan exits 0 and lists `replace`. After the fix plan exits 2 and names the link with its target. The linked file stays unchanged.

### 3.3 Verified scenarios for the safety-shaped P2 findings

**R2-P2-001, `command-attach.ts:353`, hub attach ignores a no-edit request. Reach proven.**

- Input: the prompt "use sk-doc to create a skill called invoice-parser, do not change anything yet" with `SPECKIT_COMPILED_ROUTING` unset (`sk-doc` is in `DEFAULT_ON_HUBS`, `compiled-routing-flag.ts:32-40`).
- What happens: `compiled-route.cjs --hub sk-doc` returns `route/single/sk-create-skill` for this and three other no-edit prompts (probe). The full `advisor_recommend` call returns `sk-doc` at 0.8932 with `command: /create:skill` and `policy: start` (probe). The scorer path rules out every command on the same wording (`fusion.ts:887`).
- What should happen: `attachCommand` returns no command when `NO_EDIT_REQUEST` matches.
- Why it stays P2: `start` makes the command's setup ask before writing. `AGENTS.md:68` also says an explicit instruction outranks the policy. A transcript in which a runtime starts the writing steps on such a prompt would raise it to P1.
- Test: `attachCommand('sk-doc', <single sk-create-skill route>, '<the prompt above>')` returns `/create:skill` today and `undefined` after.

**R1-P2-001, `command-attach.ts:385`, any `/deep:` mention opens the deep-loop gate. Reach narrowed.**

- Input: a single-mode review route and the prompt "what did /deep:ai-council decide".
- What happens: `attachCommand` returns `/deep:review` (probe). On the top recommendation `attachTypedCommand` then replaces it with the typed `/deep:ai-council` (probe of `typedCommandForTop`), which masks the bug in the common case. It still reaches the reader when the `/deep:` text names no tracked command (a typo such as `/deep:reviw`) or when a lower recommendation is enriched (`compiledRouteTopOnly` false, which the prompt hooks never send).
- What should happen: the gate opens only when the typed `/deep:` command equals the command being attached.
- Test: the call above returns `/deep:review` today and `undefined` after, while "run /deep:review now" still returns `/deep:review`.

**R1-P2-002--95282927956e, `command-attach.ts:266`, a file name reads as a typed command.**

- Input: "open /create:readme.md and summarise it" with `sk-doc` on top.
- What happens: `typedCommandIn` returns `/create:readme` and `typedCommandForTop` returns it with `policy: start` (probe), so a request to read a file is offered a writing command.
- What should happen: a `/` or a `.` followed by a word character after the key cancels the match. A sentence-ending period still ends a command.
- Test: `typedCommandIn('see /create:skill.md for details')` returns `/create:skill` today and `undefined` after, while `typedCommandIn('run /create:skill.')` keeps returning `/create:skill`.

**R1-P2-005, `render.ts:226`, `needsMode` is overridden by a generated row. Latent.**

- Input: `renderAdvisorBrief` with a top recommendation `{ skill: 'command-create-agent', needsMode: true }` and no `command`.
- What happens: the head reads `use sk-doc → /create:agent (start)` (probe on the built renderer) instead of `(needs a mode)`.
- Reach: none today. `needsMode` is set only for hubs in `MODE_COMMANDS` (`command-attach.ts:394-399`) and no hub id has a command row (probe returned an empty list).
- What should happen: `commandLabel` skips the row backfill when `needsMode` is true.
- Test: the input above prints `/create:agent` today and `(needs a mode)` after.

**R2-P2-003, `render.ts:233`, the child downgrade reads the wrong row. Latent.**

- Input: a child session and `{ skill: 'command-speckit-search', command: '/doctor:speckit', policy: 'run' }`. The skill's row is `run` and `read-only`, while `/doctor:speckit` is `run` and `add-only` (`command-attach.ts:105`).
- What happens: the head reads `/doctor:speckit (run)` in the child (probe) where `(parent-named only)` is due.
- Adjustment: the lineage's example (`sk-doc` with `/doctor:overlay apply`) does not reproduce. `sk-doc` has no row and `/doctor:overlay apply` is `ask`, so the pair renders `(parent-named only)`. No producer pairs a command with another command's row today. A recommendation with no row already downgrades (probe).
- Test: the input above prints `(run)` today and `(parent-named only)` after.

**iter1-P2-offer-reached-unknown, `score-command-transcripts.mjs:1293`, adjusted to a README defect.**

- Input: an OpenCode run log, whose brief state is always `unknown` (`command-offer.mjs:207-208`), with an offered command on each row.
- What happens: `offerReached` equals `offered`, because the tally counts `briefDelivered !== false`.
- Adjustment: this is the rule the packet specified. Phase 013 task T022 says "add 1 to a new `offerReached` when `result.offered` and `result.briefDelivered !== false`". SC-002 pins OpenCode at `offerReached` 3 with `deliveryUnknown` 24. The code is right. The README line at `:111` ("offers on a turn whose brief arrived") is wrong.
- Test: no code change, so no failing test. The phase 013 SC-002 summary pin already holds the rule.

**iter5-P2-credential-hardening-allowlist, `run-command-behaviour.mjs:782`.**

- Input: an operator shell with `SSH_AUTH_SOCK`, an AWS profile and `NPM_TOKEN` set runs `--runtime claude --set g2 --out <log>` from a prepared arena.
- What happens: `childEnv` copies `process.env` and removes only `GH_TOKEN`, `GITHUB_TOKEN` and `GH_ENTERPRISE_TOKEN` (`:782-789`). The turn runs with `--permission-mode bypassPermissions` (`:126`), so a shell step in it can use the SSH agent, the npm token or the cloud profile.
- What should happen: the child environment is built from an allowlist (path, home, locale, terminal, temp folder and the runtime's own configuration and provider key) or the runner refuses a live arm while such variables are set.
- Why P2: the header's stated threat is a push through this repository's remote. The remote guard at `:986-992` closes it. No fixture prompt asks for network work.
- Test: export `childEnv` and assert `SSH_AUTH_SOCK`, `AWS_ACCESS_KEY_ID` and `NPM_TOKEN` are absent from its result. Today they are present.

**iter2-P2-arena-precondition-unverified, `run-command-behaviour.mjs:986`.**

- Input: a local checkout after `git remote remove origin`, clean status, with an ignored `.env` and outer git hooks, then a live arm.
- What happens: `remoteNames()` is empty and the dirty check passes, so turns with bypassed permissions run in a tree that never went through `prepare-behaviour-arena.mjs` and its dotenv and hook refusals.
- What should happen: the arena builder writes a marker under the clone's `.git` folder and the first-turn guard refuses a live arm without it (`EXIT_REFUSED`, code `arena_unprepared`).
- Test: a temporary repository with no remote and no marker passes the guard today and returns `arena_unprepared` after.

### 3.4 Evidence and tests for the remaining findings

Each line gives the evidence read in this synthesis and a test that fails today and passes after. Where no such test can exist, the line says so.

- **DR4-P2-001** `restoreFromBackup` (`:1284-1305`) copies with `path.join` and `copyFileSync` only, while `commandRestore` runs `assertWritable` and the sha256 check (`:1453`, `:1464`). Test: a write hook that damages the backup copy of `AGENTS.md` and drops a line. Today the damaged bytes are restored silently, after the restore stops on the hash mismatch and says so.
- **DR1-P2-003** `foreign` is built at `:587-596` and read only by unit tests (`agents-md-embed.test.cjs:395-974`). Test: a write hook that adds a line above the block. Today apply ends `STATUS=OK`, after it ends `STATUS=FAIL` with a restore.
- **R4-P2-001--d1528b81a2ca** The only `COMMAND_POLICIES` references are its declaration, its emitter (`derive-command-bridges.cjs:1218`) and prose. `advisor-recommend.ts:478` reads `TRACKED_COMMANDS`. A probe found 11 tracked commands missing from `COMMAND_POLICIES`. All 11 are reachable through `MODE_COMMANDS` (`/create:benchmark`, `/create:command`, `/create:diff`, `/create:goal`, `/create:repo-rule`, `/create:skill-parent`, `/create:with-human-voice`, `/deep:ai-council`, `/design:chart`, `/design:diagram` and `/design:extract`). So the scorer lineage's preferred fix (point the attach path at `COMMAND_POLICIES`) would strip the policy from those 11. Delete it instead. Test: `'COMMAND_POLICIES' in await import('../lib/command-attach.js')` is true today and false after, with the deriver's check mode still exiting 0.
- **R4-P2-002--828881666f76** `fusion.ts:750-751` is an `if` with an empty body. Test: none can fail, because removing it changes no output. The scorer suite is the guard.
- **R4-P2-002--de3d8b259d8e** `render.ts:522` compares the literal while `spec-gate-core.mjs:101-106` exports the constant and `isChildSession`. Both accept exactly `'1'` today. Test: a parity test over `'1'`, `'0'`, `'true'` and an empty value. It passes today and guards the drift the finding describes.
- **Q1 (queued item i)** Both files call `renderAdvisorBrief` with no `childSession` option, so `render.ts:522` reads the caller's environment. Under `AI_SESSION_CHILD=1` the built renderer turns `/create:readme (start)` into `(parent-named only)` (probe). The golden file asserts eight `expectedHead` values with `(start)` or `(ask)` plus the ambiguous head. The envelope file asserts one. That makes 10, which matches the coordinator's 10 failures. Without the variable both files pass (12 of 12 and 3 of 3, exit 0). Test: the two files run under `AI_SESSION_CHILD=1` fail today and pass after.
- **iter4-P2-g2-label-grammar-duplication** The runner defines six ids (`run-command-behaviour.mjs:678-698`) and `assertRunnable` accepts any of them (`:724-727`). The scorer rebuilds labels from `STARTED_ROW` (`score-command-transcripts.mjs:929`) and returns `unknown_row` on a miss (`:1156`). All six current ids match. Test: an id added to the shared map outside the regex grammar scores `unknown_row` today and its label after.
- **DR1-P2-001** `copyVerdict` returns `PASS / symlink` at `:709-713` before `expectsAbsent` is read. Probe: `.codex/AGENTS.md -> ../AGENTS.md` reported `PASS symlink`. Test: that tree reports `PASS` today and `FINDING` after.
- **DR1-P2-002** `namesRoot` uses `.some` (`:727`) while the detail at `:731` says every line. Test: a `CLAUDE.md` holding the pointer and one local line reports "every line names" today and the corrected wording after.
- **DR3-P2-001** The INFO branch added at `:693-700` is excluded from `failed` and `unmeasured` (`:646-649`). Probe: a tree without `CLAUDE.md` reported `5/6 copies as expected` with the INFO entry inside the five and its `pointer missing` line printed beneath. Test: that tree counts the INFO entry as expected today and separately after.
- **DR5-P2-003** `parseTableRows` drops a row whose width differs (`agents-md-check.cjs:809`) while `addRouterRows` keys rows by rule path with no width check (`agents-md-embed.cjs:329-330`, `:361`). Test: a router row with a literal pipe in its summary reports a missing trigger row today and a malformed row with its line after.
- **DR3-P2-004** `defaultTools` wires four children (`:875-884`) and `spawnSync` runs at `:447`, `:666`, `:768` and `:859`. The README row and the header at `:15` say three. Test: a doc check that the count word equals the `defaultTools` entry count fails today.
- **DR5-P2-001** Probe: `codex-hook-approval-check.cjs --root --json` printed `SKIP no-codex-hooks` and exited 0, while `hook-wiring-check.cjs --root --json` refused with usage. Test: the first call exits 0 today and 2 after.
- **DR5-P2-002** `JSON.stringify(payload).includes(runtime.marker)` at `:123`. Probe: a `.claude/settings.json` whose only prompt entry is `echo hooks/claude/user-prompt-submit.js` printed `ok claude`. Test: an entry that names the marker only in a `description` field reports `ok` today and `hook-missing` after.
- **DR3-P2-002** The absent branch (`codex-hook-approval-check.cjs:171-179`) prints no `repair` line, `doctor-runtime-mirrors.yaml:165-166` promises one and `doctor-setup.yaml:61` routes the state to `/doctor:runtime-mirrors`, whose Codex row only reads. WG6 adds this line and WG7 routes to it: `repair: copy the advisor UserPromptSubmit entry from the Skilled checkout's .codex/hooks.json into <root>/.codex/hooks.json, then approve it with /hooks in a Codex session`. Test: a hooks file without the advisor entry prints no `repair:` today and prints it after.
- **DR3-P2-003** The output block (`doctor-symlink-check.yaml:66-69`) maps only the engine's exits. The step at `:60`, added in this range, ends WARN on hook exit 1. Test: a contract assertion that the output block names the hook check's exit 1 fails today.
- **DR2-P2-003** `setup.md:75` allows one out-of-repository write while `doctor-setup.yaml:23-28` declares `allowed_targets: []` and forbids `**/*`. Test: a contract assertion that the workflow boundary names the socket directory fails today.
- **Q3 (queued item iii)** `doctor-setup.yaml:59` shows hook health only when `data.hookHealth` is present. `advisor-status.ts:487-501` adds it only when diagnostic records exist. `persistAdvisorHookDiagnosticRecord` writes them only when `SKILL_ADVISOR_DEBUG` is set (`metrics.ts:320`, `:450`). The opt-in was a deliberate v0.3.0.0 decision, so the smallest fix is in the setup text, not in the writer. Test: a contract assertion that the advisor leg names the absent case fails today.
- **DR2-P2-001** "the seven" at `:78` can be read as the six names plus "the ones already there", which `:71` accepts. `symlink-manifest.json` has no `dsh` row, so the guide matches the engine. The residual defect is the ambiguous count and no install path for dsh. Test: a contract assertion that the count word equals the listed accepted values fails today.
- **DR2-P2-002** The probe step reads `OLLAMA_BASE_URL` (`:89`) while the start and pull steps (`:125-126`) bind no host. Test: a contract assertion that both mutating steps name `OLLAMA_HOST` from the resolved URL fails today.
- **iter5-P2-holdout-secondary-split-publication** `rows[row.id]` at `:537` writes every row. The committed baseline holds 176 rows, of which 44 have ids marked holdout (ids counted, no prompt text read). `command-routing-slice.vitest.ts:91-107` compares them all and tells the developer to recapture. `holdout-independent.vitest.ts:5-18` names this split a secondary signal, while `spec.md:144` still uses it as acceptance evidence. Test: an assertion that no baseline row id belongs to the holdout split finds 44 today and 0 after.
- **iter1-P2-readme-inventory-drift** The folder holds 14 code files (13 `.mjs` and one `.py`) against "9" at `:29`. It held 8 before the range. Test: a doc check comparing the count with the folder fails today.
- **iter3-P2-readme-restore-exit3** `EXIT_HEAD_MOVED = 3` (`run-command-behaviour.mjs:69`) and the head-moved branch skips the restore (`:1032-1037`). The README row at `:113` lists only exit 2 and an unconditional restore. Test: a doc check that the README names exit 3 fails today.
- **R1-P2-004** On an open failure (`devin.mjs:399-404`) or a projection failure (`:419-420`, `:438-440`) the loader returns `store_unreadable` without trying `loadTranscript` (`:447`). This matches the reader README's code table, so it is a design gap. Test: a corrupt `sessions.db` beside an intact transcript returns `store_unreadable` today and `ok` after.
- **R1-P2-003** `dsh.mjs:195` keeps a record only for `source.kind === 'user'`. The injected list added in this range files a sourceless message as `unknown` (`:244-256`), which the reader README documents at `:36`. Whether DSH ever emits a sourceless operator message is not shown. Test: a sourceless `user/message` lands in `injected` with source `unknown`. It passes today and pins the documented rule.
- **R1-P2-002--fabc628596e7** `claude.mjs:213` records `containment.path` and `:217` opens `transcriptPath`. For a link both name the same file, so the two can differ only if the path is swapped between check and open inside the user's own store. The lineage's claim that `pi.mjs` already closes the gap is wrong: it also reads `filePath` after the guard (`pi.mjs:245-256`). Test: no deterministic failing test, because the gap is a race.
- **R4-P2-001--09ff48e9a0b9** `capabilities` (`index.mjs:28-65`) spells seven runtimes and no test compares it with `ADVISOR_RUNTIME_VALUES`. Today the two sets agree. Test: the added comparison passes today and fails the day a runtime is added to one list only.
- **R2-P2-002** `stdout += chunk` with no ceiling (`subprocess.ts:238-243`), while the hook fallback caps at 1 MiB (`skill-advisor-cli-fallback.ts:92`, `:214-218`). Only the timeout bounds it. Test: a fake child writing 2 MiB yields 2 MiB today and at most the cap after.
- **iter4-P2-bench-runtime-matrix-incomplete** Run with `SPECKIT_RUN_BENCHES=true`, the bench file failed one of four tests with `TypeError: Cannot convert undefined or null to object` at `:95` (exit 1). The runtime tuple already held seven values before the range, when the matrix had three, so the gap predates the packet. Test: the bench file itself fails today and passes after.
- **R3-P2-001--0e0d904eb571** `counts.typescriptActive` is 46 and 46 entries carry `embeddingText` in `command-bridges.generated.json`. Both 45 sentences came from the range. Test: a doc check against `counts.typescriptActive` fails today.
- **R3-P2-002--5522ea1fe8dd** `hooks/dsh/prompt-advisor.mjs` ships a DSH adapter and predates the range. The sentence at `:142` names five adapters plus the plugin. Test: a doc check that every adapter folder under `hooks/` is named fails today.
- **R3-P2-002--ecbea1260371** The four-field recommendation contract at `:41-43` is accurate, since the output carries no `mutating`. The defect is `:45`, which gives the row shape as `{ command, policy?, ownerSkillId }` while `command-attach.ts:51` adds `mutating`, the field `render.ts:233` reads. Test: a doc check that `:45` names every `CommandRow` field fails today.
- **Q2 (queued item ii)** `advisor-recommend.md:45` says the compiled-route attach takes its policy from `COMMAND_POLICIES[command]`. The code reads `TRACKED_COMMANDS[command].policy` (`advisor-recommend.ts:478`). Test: the doc check above, extended to the policy source, fails today.
- **R4-P2-003** The Gate 2 direct call passes the prompt in argv. `skill-advisor-cli.ts:391-397` already accepts `--json -` and reads stdin. Test: a doc check that the example uses `--json -` fails today.
- **iter3-P2-phase007-open-evidence** The phase map shows 007 In Progress while 010 to 013 are Complete (`spec.md:120-125`). Phase 007 has 25 open tasks and its summary says "Not completed" (`007-per-runtime-behaviour-proof/implementation-summary.md:49`). Test: `validate.sh --strict` on the parent reports the open phase today.

### 3.5 Refuted finding

**R3-P2-001--16e5737e0e56**, `hooks/skill-advisor-hook.md:176`. The finding says the brief layer never reads `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS`. The brief calls `runAdvisorSubprocess` with `timeoutMs: options.subprocessTimeoutMs` (`skill-advisor-brief.ts:519-522`). `runAdvisorSubprocess` falls back to `defaultTimeoutMs()`, which reads that variable, whenever the option is unset (`subprocess.ts:118-120`, `:298`). Only the Claude hook passes its own value (`hooks/claude/user-prompt-submit.ts:352`). The document's list of consumers is accurate for the brief path.

---

## 4. Remediation Workstreams

Every group owns its files alone, so the groups can run in parallel. The safety lane goes first. Each finding gets one test that fails before its fix and passes after, as listed in section 3.

1. **WG1 Embed engine write safety (safety lane).** DR1-P1-001, DR4-P1-001, DR4-P2-001 and DR1-P2-003. Files: `agents-md-embed.cjs`, its test file and `doctor-agents-md-embed.yaml` (give the new "undone" exit its own row in phase 4).
2. **WG2 Attach-path guards (safety lane).** R2-P2-001, R1-P2-001, R1-P2-002--95282927956e, R4-P2-001--d1528b81a2ca and R4-P2-002--828881666f76. Files: `command-attach.ts`, `scorer/fusion.ts`, `derive-command-bridges.cjs`, `command-bridges/README.md` and a new `tests/command-attach-guards.vitest.ts`. Move `NO_EDIT_REQUEST` into the import-free `command-attach.ts` and import it in `fusion.ts`, so one pattern serves both paths. Delete `COMMAND_POLICIES` at its emitter and regenerate. A third copy of the no-edit pattern sits in `scorer/text.ts:148`, which this group leaves alone and records.
3. **WG3 Renderer contract and test isolation (safety lane).** R1-P2-005, R2-P2-003, R4-P2-002--de3d8b259d8e and Q1. Files: `render.ts`, `command-brief-golden.vitest.ts`, `hooks/skill-advisor-cli-fallback-envelope.vitest.ts` and `render-child-session.vitest.ts`.
4. **WG4 Behaviour runner containment (safety lane).** iter5-P2-credential-hardening-allowlist, iter2-P2-arena-precondition-unverified and iter4-P2-g2-label-grammar-duplication. Files: `run-command-behaviour.mjs`, `prepare-behaviour-arena.mjs`, `score-command-transcripts.mjs` and a new `tests/command-behaviour-guards.vitest.ts`.
5. **WG5 AGENTS.md check truth.** DR1-P2-001, DR1-P2-002, DR3-P2-001, DR5-P2-003 and DR3-P2-004. Files: `agents-md-check.cjs`, its test file and `scripts/README.markdown`.
6. **WG6 Hook check scripts.** DR5-P2-001, DR5-P2-002 and the script half of DR3-P2-002 (the repair line text is fixed in section 3.4). Files: `codex-hook-approval-check.cjs`, `hook-wiring-check.cjs` and their two test files.
7. **WG7 Doctor workflow contracts.** The workflow half of DR3-P2-002, DR3-P2-003, DR2-P2-003 and Q3. Files: `doctor-setup.yaml`, `setup.md`, `doctor-setup-presentation.txt`, `doctor-runtime-mirrors.yaml`, `doctor-symlink-check.yaml` and a new `tests/doctor-setup-contract.test.cjs`.
8. **WG8 Install guide and embedder host.** DR2-P2-001 and DR2-P2-002. Files: `doctor-install-presentation.txt`, `doctor-install.yaml`, `doctor-skill-advisor-embedder.yaml`, `doctor-install-contract.test.cjs` and `skill-advisor-route-contract.test.cjs`.
9. **WG9 Holdout rows out of the baseline.** iter5-P2-holdout-secondary-split-publication. Files: `capture-command-routing-baseline.mjs`, `command-routing-baseline.json` (recaptured with `--write`) and `command-routing-slice.vitest.ts`. The worker counts holdout rows by id and split only and never prints their prompt text.
10. **WG10 Routing-accuracy README.** iter1-P2-readme-inventory-drift, iter3-P2-readme-restore-exit3 and iter1-P2-offer-reached-unknown. File: `routing-accuracy/README.md`.
11. **WG11 Session readers.** R1-P2-004, R1-P2-003, R1-P2-002--fabc628596e7 and R4-P2-001--09ff48e9a0b9. Files: the claude, devin, dsh, pi and index readers, the readers' README, their tests and `advisor-runtime-list-parity.vitest.ts`.
12. **WG12 Subprocess cap and bench.** R2-P2-002 and iter4-P2-bench-runtime-matrix-incomplete. Files: `subprocess.ts`, a new `tests/subprocess-output-cap.vitest.ts` and the bench file.
13. **WG13 Advisor docs.** R3-P2-001--0e0d904eb571, R3-P2-002--5522ea1fe8dd, R3-P2-002--ecbea1260371 and Q2. Files: the skill `README.md`, `ARCHITECTURE.md` and the two feature-catalog pages. The wording follows WG2's decision to delete `COMMAND_POLICIES`, which is fixed here, so the group does not wait for WG2.
14. **WG14 Operator and coordinator items.** R4-P2-003 waits for the operator, because `AGENTS.md` is the shared framework document mirrored to every runtime. If its Gate 2 section is a shipped body, the agents-md manifest needs regenerating with it. iter3-P2-phase007-open-evidence belongs to the coordinator.

---

## 5. Spec Seed

- A failed write inside an embed apply restores from the backup, prints the backup and undo lines and exits with a code the workflow reads as undone.
- Embed refuses a symlinked router or Cursor mirror with the same rule it applies to a symlinked root document.
- A no-edit prompt attaches no mutating command on either the scorer path or the hub route path, through one shared pattern.
- A typed command is matched only outside a file name. The deep-loop gate opens only for the typed command it attaches.
- `TRACKED_COMMANDS` is the one attach-path policy table and every doc says so.
- The renderer's tests set or clear `AI_SESSION_CHILD` themselves.
- A live behaviour arm starts only in a marked arena and with an allowlisted child environment.
- The published command baseline carries no per-row outcome for a holdout row.
- Doctor checks never count a known gap as expected, never read a mention as a wired hook and always print the repair they promise.
- The setup advisor leg states when hook health is not recorded.

---

## 6. Plan Seed

1. Dispatch WG1, WG2, WG3 and WG4 in parallel. Each worker writes the failing test first, confirms it fails, applies the fix and confirms it passes.
2. Dispatch WG5 to WG13 in parallel under the same rule.
3. Run each touched test file alone as `env -u AI_SESSION_CHILD npx vitest run <file>` or `node --test <file>`. Run the deriver's check mode after WG2.
4. Hand WG14 to the operator (AGENTS.md) and the coordinator (phase 007 status).
5. Run a second `/deep:review` fan-out over the remediation diff with the same four lineages and the 0.10 threshold. The loop counts as converged only when every lineage stops below the threshold.

---

## 7. Traceability Status

### Core protocols

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | partial | Twelve findings are docs that disagree with code (R3-P2-001--0e0d904eb571, R3-P2-002--5522ea1fe8dd, R3-P2-002--ecbea1260371, Q2, iter1-P2-readme-inventory-drift, iter3-P2-readme-restore-exit3, iter1-P2-offer-reached-unknown, DR3-P2-004, DR2-P2-003, DR3-P2-002, DR3-P2-003 and R4-P2-003). One claimed drift was refuted. |
| `checklist_evidence` | partial | The phased parent has no root checklist. Phase 007 holds 25 open tasks while later phases are Complete (iter3-P2-phase007-open-evidence). |
| `AC_COVERAGE` | exempt | The parent has no `acceptance-criteria.md`. Child phases own theirs. |

### Overlay protocols

| Protocol | Status | Evidence |
|---|---|---|
| `skill_agent` | pass | The scorer-attach lineage matched 36 doctor bridge owners to their router tags with no mismatch. Not re-run here. |
| `agent_cross_runtime` | partial | dsh has an advisor prompt adapter but no install row in `symlink-manifest.json` and no name in `ARCHITECTURE.md:142`. The per-runtime behaviour proof (phase 007) is open. |
| `feature_catalog_code` | partial | `advisor-recommend.md:45` names the wrong policy table and an incomplete row shape. `command-meaning-matching.md:26` gives 45 rows where the artifact holds 46. |
| `playbook_capability` | notApplicable | No lineage reviewed a playbook file against its capability. This synthesis added none. |

Resource Map Coverage Gate: skipped. `resource-map.md` does not exist in the spec folder, so `resource_map_present` is false in the root config. No lineage emitted a `resource-map.md` either.

---

## 8. Deferred Items

- **R2-P1-001 (resolved by the render-hooks-plugin lineage).** The child downgrade still has no per-request input: `SkillAdvisorBriefOptions` carries no `childSession`, so a host that serves a child in-process without setting `AI_SESSION_CHILD` renders a parent brief. The lineage closed it at P1 because the behaviour matches `skill-advisor-hook.md:39`. It reopens as P1 the moment a host is shown dispatching a child in-process.
- **`run` commands that write.** `/doctor:deep-loop` and `/doctor:speckit` are `run` with class `add-only` (`command-attach.ts:80`, `:105`), so they start without asking and add files. The scorer-attach lineage summary said no `run` row writes. Whether `add-only` under `run` is intended belongs in a decision, not a fix.
- **dsh install path.** `/doctor:install` cannot link a dsh runtime because `symlink-manifest.json` has no `dsh` row. Adding one is a feature decision.
- **DR1-P1-001 reach on sandboxed runtimes.** If a supported runtime's sandbox denies a write to one of the allowlisted paths on a default install, the mid-apply fault becomes reachable on a default path and the finding returns to P1. Not verified here.
- **R1-P2-003 reach.** Whether DSH ever emits an operator message with no `source` is not shown by any fixture or store read here.
- **Third no-edit pattern.** `scorer/text.ts:148` holds a copy of the no-edit wording beside `fusion.ts:677`. WG2 records it and leaves it.

---

## Dimension Expansion Map

- All four lineages covered all four dimensions (`dimensionCoverage` true for correctness, security, traceability and maintainability in every lineage registry).
- Divergence state is empty in every lineage registry: no pivot started, completed or failed, no audited override, no saturated direction and no remaining frontier recorded.
- Selected directions in the lineages: per-runtime branch logic, mutating-command safety, holdout hygiene and doc-code agreement, plus filesystem write containment in doctor-install.
- This map records breadth only and changes no verdict.

---

## Search Ledger

| Lineage | searchCoverage rows | candidateCoverage rows | searchDebt | ruledOutCandidates | cleanSearchProof |
|---|---|---|---|---|---|
| scorer-attach | 6 | 5 | 0 | 14 | 14 |
| render-hooks-plugin | 6 | 5 | 0 | 10 | 10 |
| accuracy-runner | 6 | 5 | 0 | 9 | 9 |
| doctor-install | 6 | 5 | 0 | 5 | 5 |

hasSearchDebt: false. The graph was unavailable in every lineage, which recorded `graphless_fallback` with direct reads.

---

## 9. Audit Appendix

### Convergence

Confirmed from each lineage's `deep-review-state.jsonl` (`newFindingsRatio` per iteration) and its `synthesis_complete` event.

| Lineage | Iterations | Stop reason | Novelty per iteration | Last ratio against 0.10 |
|---|---|---|---|---|
| scorer-attach | 5 | converged | 1.00, 0.33, 0.40, 0.29, 0.00 | below |
| render-hooks-plugin | 5 | maxIterationsReached | 1.00, 1.00, 0.33, 0.23, 0.15 | above |
| accuracy-runner | 5 | maxIterationsReached | 1.00, 1.00, 1.00, 1.00, 0.11 | above |
| doctor-install | 5 | maxIterationsReached | 1.00, 0.27, 0.21, 0.29, 0.125 | above |

Three lineages stopped at their cap above the 0.10 threshold. The fan-out therefore did not converge. A second review pass after remediation is required before the loop counts as converged.

### Dimension order per lineage

- scorer-attach, render-hooks-plugin and accuracy-runner: correctness, security, traceability, maintainability, then one pass over all four.
- doctor-install: correctness twice, then traceability, security and maintainability.

### Probes run in this synthesis

All read-only or confined to temporary directories that were removed.

- `agents-md-embed.cjs` in-process on fixture trees: a write hook throwing on the second write, an in-root router link, an in-root mirror link to a CI file, a router linked to `AGENTS.md` and a router linked outside the root.
- `agents-md-check.cjs --json` on a fixture with no `CLAUDE.md` and a linked `.codex/AGENTS.md`.
- `codex-hook-approval-check.cjs --root --json` and `hook-wiring-check.cjs` on a settings file that only echoes the marker.
- `command-attach.ts` through `node --experimental-strip-types`: `attachCommand`, `typedCommandIn`, `typedCommandForTop`, the hub row lookup and the policy table comparison.
- `compiled-route.cjs --hub sk-doc --prompt-stdin` on four no-edit prompts.
- `skill-advisor.cjs advisor_recommend` on five no-edit prompts.
- The built `render.js` with `needsMode`, child-session and `AI_SESSION_CHILD=1` inputs.
- `env -u AI_SESSION_CHILD npx vitest run` on `tests/command-brief-golden.vitest.ts` (12 passed) and on `tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` (3 passed).
- The bench file with `SPECKIT_RUN_BENCHES=true` (1 of 4 failed).
- `git blame` on every cited line range, with each blamed commit tested as an ancestor of `35c3188681`.

### Holdout handling

No row of `command-prompts.jsonl` was read. The holdout count in this report comes from baseline row ids that carry the holdout marker, counted without printing them.

### Lineage artifact notes

- The four lineage configs carry three different `reviewFocus` texts. The doctor-install config records a `createdAt` later than the run's end. The root config takes the focus shared by two lineages and the start time from `orchestration-status.log`.
- The accuracy-runner `synthesis_complete` event records release readiness `converged` with stop reason `maxIterationsReached`, which the workflow's rule maps to `in-progress`.
- `fanout-attribution.md` lists the lineage-level verdicts (three PASS and one CONDITIONAL). This report supersedes them.
- Each lineage built its own strategy, registry and dashboard. No root state log exists yet, because closeout and the append gateway run after the second pass.

### Sources reviewed

`review/deep-review-findings-registry.json`, `review/review-scope.txt`, `review/orchestration-summary.json`, the four lineage registries, state logs, configs, iteration files and lineage reports, every file cited in section 3, `scratch/launch/review1.sh`, `deep-review/SKILL.md`, `references/state/state-format.md` section 7, `references/protocol/completion-criteria.md` and the synthesis phase of `deep-review-auto.yaml`.
