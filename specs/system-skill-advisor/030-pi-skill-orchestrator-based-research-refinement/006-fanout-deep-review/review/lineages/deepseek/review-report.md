# Deep Review Report — Lineage `deepseek`

Session `fanout-deepseek-1790437845885-htqb7q` · fan-out lineage `deepseek` (cli-pi / `deepseek-v4.1-flash`, max effort) · generation 1 ·
target `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/006-fanout-deep-review` (spec-folder) ·
stop policy `max-iterations`, 3 of 3 iterations run · stop reason `maxIterationsReached`.

This is the lineage-level report. The cross-lineage merge and the root `review/review-report.md` belong to the orchestrator, together with sibling lineage `mimo`.

---

## 1. Executive Summary

- **Overall verdict: PASS**
- **hasAdvisories: true** — 5 active P2 advisories, 0 active P0, 0 active P1.
- **Findings:** P0 = 0, P1 = 0, P2 = 5 (all active, first seen in this lineage, none repeated, none resolved, none re-graded).
- **Release readiness:** converged; nothing in this lineage blocks a release decision.
- **Review scope:** the 38 repo-relative paths in `goal-file-manifest.txt` — the changes phases 2 to 5 of packet `030-pi-skill-orchestrator-based-research-refinement` produced, plus the research-workflow fix made while closing phase 1 — read against the requirements in phases `002-hook-deadline-and-diagnostics` through `005-follow-up-fixes`. In the four deep-loop workflow files only `step_convergence_report` was normative and the surrounding convergence machinery was read as context; in `.pi/extensions/pi-cache-optimizer/index.ts` only the hash-verified edits section.
- **Coverage:** 4 of 4 declared dimensions (correctness, security, traceability, maintainability) with at least one full iteration each; `spec_code` = pass across the manifest-visible requirements; `checklist_evidence` = notApplicable (Level 1 target).
- **Why PASS rather than CONDITIONAL:** no correctness failure, security vulnerability or spec contradiction survived verification, and no finding reached P1. The five P2s are hardening, drift and dead-code advisories whose citations were re-read before recording.
- **Cost of being wrong, stated plainly:** every P2 here is safe to defer. Two of them (F003, F005) carry explicit upgrade conditions; if either becomes operational (outcome telemetry submitted for the phase-002 runtimes, or confirm-mode review used with `stop_policy: max-iterations`), the advisory becomes a P1 and the merged verdict becomes CONDITIONAL.

## 2. Planning Trigger

`/speckit:plan` **is** required for a follow-up remediation phase: five active P2 items have concrete file:line fixes, and two of them are cheap enough to fold into the next change that touches their file rather than waiting for a dedicated phase. No P0/P1 exists, so planning may be scheduled rather than urgent.

```json
{
  "triggered": true,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    { "id": "F001", "severity": "P2", "dimension": "maintainability", "title": "Dead exported fallback-gate helper has no caller", "file": ".skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts", "line": 160 },
    { "id": "F002", "severity": "P2", "dimension": "correctness", "title": "Operator budget above the shim kill ceiling is silently ineffective", "file": ".skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts", "line": 105 },
    { "id": "F003", "severity": "P2", "dimension": "maintainability", "title": "Runtime vocabulary drift - three hardcoded enum copies reject the four runtimes phase 002 added", "file": ".skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts", "line": 349 },
    { "id": "F004", "severity": "P2", "dimension": "security", "title": "Diagnostics log created with default permissions under os.tmpdir()", "file": ".skilled/skills/system-skill-advisor/runtime/lib/metrics.ts", "line": 182 },
    { "id": "F005", "severity": "P2", "dimension": "traceability", "title": "Confirm-mode review workflow never consumes stop_policy, so max-iterations can stop before the ceiling", "file": ".skilled/commands/deep/assets/deep-review-confirm.yaml", "line": 38 }
  ],
  "remediationWorkstreams": [
    "WS-1 (P2, small): clamp or document the Claude shim budget ceiling - F002",
    "WS-2 (P2, small): one-line fix for the confirm-mode review telemetry clause - F005",
    "WS-3 (P2, small): delete or re-consume the dead fallback-gate export - F001",
    "WS-4 (P2, medium): derive the three runtime enums from ADVISOR_RUNTIME_VALUES - F003",
    "WS-5 (P2, small): 0o700/0o600 on the diagnostics root and files - F004"
  ],
  "specSeed": [
    "Record the intentional ceiling of SPECKIT_CLAUDE_HOOK_TIMEOUT_MS in the phase-002 hook contract.",
    "State whether confirm-mode review must honor stop_policy=max-iterations, or that the operator is the guard.",
    "Name ADVISOR_RUNTIME_VALUES as the single runtime vocabulary for every input enum, not just record validators.",
    "State the diagnostics-root permission expectation for shared-host runs."
  ],
  "planSeed": [
    "WS-1: clamp the pass-through to CHILD_TIMEOUT_MS minus the emit margin in the Claude hook shim, or document the 2500 ms ceiling beside the variable.",
    "WS-2: add the auto-mode max-iterations telemetry clause to step_check_convergence in deep-review-confirm.yaml, or document the confirm-mode difference at line 38.",
    "WS-3: delete shouldTrySkillAdvisorCliFallback and rebuild dist, or wire it to a live consumer with a test.",
    "WS-4: derive the daemon schema, the tool descriptor and the CLI manifest enums from ADVISOR_RUNTIME_VALUES; rebuild dist.",
    "WS-5: create the metrics root with mode 0o700 (explicit chmod, since mkdir recursive does not repair an existing directory) and write files 0o600."
  ],
  "findingClasses": ["dead-code", "boundary", "drift", "hardening", "consistency"],
  "affectedSurfacesSeed": [
    "hooks/lib/skill-advisor-cli-fallback.ts",
    "system-spec-kit Claude hook shim",
    "runtime/schemas/advisor-tool-schemas.ts",
    "runtime/skill-advisor-cli-manifest.ts",
    "runtime/tools/advisor-validate.ts",
    "runtime/lib/metrics.ts",
    "deep-review-confirm.yaml",
    "deep-review-auto.yaml"
  ],
  "fixCompletenessRequired": false
}
```

Note on `fixCompletenessRequired`: the target touches security, path handling, env precedence, schema boundaries, persistence and shared policy, so the security-sensitive stabilization clause applied to the review itself (the F004 surface was re-read in iteration 3 after its iteration-2 recording). No P0/P1 exists, so no fix replay is pending; if WS-1…WS-5 are implemented, the follow-up phase must replay the cited lines and re-run the pinned tests before claiming closure.

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | Impact | Fix recommendation | Disposition | Class | Scope proof | Affected surface hints |
|----|----------|-----------|-------|----------|--------|--------------------|-------------|-------|-------------|------------------------|
| F001 | P2 | maintainability | Dead exported fallback-gate helper has no caller | `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:160` — `shouldTrySkillAdvisorCliFallback()` has no consumer | Dead export invites a future caller to re-introduce the retired layered retry path | Delete the export (and rebuild dist), or wire it to a live consumer with a test | active | dead-code | Repo-wide symbol search over `.skilled`, `.opencode`, `.pi` (source and compiled) found only the definition and its `runtime/dist` twin; compared against every import of the fallback module | `hooks/lib/skill-advisor-cli-fallback.ts` |
| F002 | P2 | correctness | Operator budget above the shim kill ceiling is silently ineffective | `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:105-117` — `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` is passed through only when unset, but the spawn always kills at `CHILD_TIMEOUT_MS = 2500`; the advisor applies the operator value via `positiveIntFromEnv` as its real CLI budget | An operator setting 5000 ms gets a child killed at 2500 ms, so the turn returns `{}` — the lost-guardrail outcome phase 002 exists to remove | Clamp the pass-through to `CHILD_TIMEOUT_MS` minus margin, or document the 2500 ms ceiling beside the variable | active | boundary | Read the shim spawn/limit block, the advisor `claudeHookTimeoutMs` plumbing and the fallback timer; nested deadline chain 2800/2500/2200 verified by hand | spec-kit Claude shim; advisor hook budget env |
| F003 | P2 | maintainability | Runtime vocabulary drift - three hardcoded enum copies reject the four runtimes phase 002 added | `runtime/schemas/advisor-tool-schemas.ts:349` (daemon zod), `runtime/tools/advisor-validate.ts:22` (tool descriptor), `runtime/skill-advisor-cli-manifest.ts:89` (CLI manifest) | A Pi/Codex/Cursor/Devin outcome event is rejected by the daemon (`-32602`) and the CLI although the persist-side validators accept all seven runtimes | Derive all three enums from `ADVISOR_RUNTIME_VALUES`, or document the intentional narrowing | active | drift | Grepped the runtime and hooks trees for the three-value literal; found exactly three source copies plus dist twins; compared against the accept-side validators in `metrics.ts` | `runtime/schemas/advisor-tool-schemas.ts`, `runtime/tools/advisor-validate.ts`, `runtime/skill-advisor-cli-manifest.ts` |
| F004 | P2 | security | Diagnostics log created with default permissions under `os.tmpdir()` | `runtime/lib/metrics.ts:182`, `:274-278`, `:302-325` — root via `mkdir(dirname(path), {recursive:true})` with no mode; JSONL appended with default modes | On a shared Linux host a default umask exposes a 0755 directory and 0644 files holding skill labels, runtimes, timing and error detail; written only with `SKILL_ADVISOR_DEBUG` on | Create the root `0o700` and the files `0o600`; `mkdir` recursive does not repair an existing directory, so chmod explicitly | active | hardening | Read the metrics root constant, `ensureParentDir`, the bounded-JSONL append/rename paths and the prompt-free closed schema; no chmod anywhere in the module | `runtime/lib/metrics.ts` |
| F005 | P2 | traceability | Confirm-mode review workflow never consumes `stop_policy`, so `max-iterations` can stop before the ceiling | `.skilled/commands/deep/assets/deep-review-confirm.yaml:38` (contract) vs. `:618-660` (`step_check_convergence`) — confirm extracts `stop_policy` (`:569`) and stores it (`:433`, `:447`) but promotes all-dimensions-clean (`:627`) and composite convergence to a STOP candidate with no `max-iterations` guard; only `deep-review-auto.yaml` implements the clause (`:624`, `:646`) | Under confirm mode with `stop_policy: max-iterations`, an operator who asked for exactly N iterations is offered an early stop at the first clean sweep | Add the auto-mode telemetry clause to confirm, or document the confirm-mode difference at line 38 | active | consistency | Statement-level diff of `step_check_convergence` across all four YAMLs; grep for `stop_policy`, `max-iterations`, `telemetry` and `effective_min_iterations`; ledger scope shapes cross-checked against `deep-review-ledger-schema.vitest.ts` | `deep-review-confirm.yaml`, `deep-review-auto.yaml` |

Every finding above cites a line that was re-read at recording time; no inference-only entry is present, and no finding was held only in context.

## 4. Remediation Workstreams

**P0 — none.** No blocker exists in this lineage, so no workstream is ordering-blocking. Had one existed, it would be listed first and would force the FAIL verdict.

**P1 — none.** Nothing degrades behavior under default configuration.

**P2 advisories — ordered by cost/benefit, none blocking:**

1. **WS-1 · F002 — shim budget ceiling** (`system-spec-kit` Claude shim). Small, self-contained: clamp the pass-through or document the ceiling. The default path is already correct, so the fix is about not promising a knob the shim overrides.
2. **WS-2 · F005 — confirm-mode review telemetry clause** (`deep-review-confirm.yaml`). Small: port one clause from auto, or record the design difference in a comment. Decide first whether confirm mode is intended to be operator-guarded — that decision is the fix.
3. **WS-3 · F001 — dead fallback-gate export**. Small and mechanical: delete plus dist rebuild, or re-consume with a test. Take it with the next change that touches the hook caller.
4. **WS-4 · F003 — runtime enum drift**. Medium and mechanical: derive three enums from the canonical tuple, rebuild dist, and extend the existing schema tests to assert all seven runtimes are accepted.
5. **WS-5 · F004 — diagnostics permissions**. Small: explicit `0o700`/`0o600` with a chmod on the resolved root rather than relying on `mkdir` mode.

Note the shared sequencing risk: F003 and F001 both require a dist rebuild, and F003's three call sites also feed the CLI manifest and the tool descriptor, so a partial fix would leave the drift half-repaired and harder to see.

## 5. Spec Seed

- Add to the phase-002 hook contract: the effective ceiling for `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS`, and that values above the shim kill are clamped (or rejected) rather than honored.
- Add to the deep-loop review workflow contract: whether `stop_policy: max-iterations` binds confirm mode, or that confirm mode defers to the operator.
- Add to the phase-002 runtime-label requirement: `ADVISOR_RUNTIME_VALUES` governs every input enum and record validator, not only the persist side; enumerate the readers that must derive from it.
- Add to the phase-002 diagnostics requirement: expected permissions on the temp diagnostics root for shared-host runs.
- Add a line to the phase-005 follow-up list recording that `goal-file-manifest.txt` is the normative review scope for the fan-out phase.

## 6. Plan Seed

- **T-101** Clamp or document the Claude shim budget ceiling (`SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` vs. `CHILD_TIMEOUT_MS`); add a test asserting an over-ceiling operator value cannot produce a silent `{}` turn.
- **T-102** Decide the confirm-mode review contract, then either port the `max-iterations` telemetry clause from `deep-review-auto.yaml` or document the difference at `deep-review-confirm.yaml:38`.
- **T-103** Remove or re-consume `shouldTrySkillAdvisorCliFallback`; rebuild dist.
- **T-104** Derive the three runtime enums from `ADVISOR_RUNTIME_VALUES`; extend the schema test to accept all seven runtimes; rebuild dist.
- **T-105** Set the diagnostics root to `0o700` (explicit chmod) and files to `0o600`; note the pre-existing-directory case in a test if one can be written hermetically.
- **T-106** Re-run the pinned tests named in iteration 3 as the closure gate for T-101…T-105 (`run-now-yaml-control.vitest.ts`, `hash-verified-edits.test.ts`, `prompt-advisor.vitest.ts`, `deep-review-ledger-schema.vitest.ts`).

## 7. Traceability Status

**Core protocols**

| Protocol | Level | Status | Evidence | Unresolved drift |
|----------|-------|--------|----------|------------------|
| `spec_code` | core | pass | Phase 002 REQ-001/003/004/007, 003 REQ-001..005/007, 004 REQ-001..007, 005 REQ-001..005 against the manifest-visible implementations and their pinned tests (iterations 1-3) | None. F005 is a cross-variant contract inconsistency inside the changed machinery, recorded as a P2 finding rather than a spec contradiction. Phase 005 REQ-006 (`check-contract-drift.cjs`) and REQ-007 (trigger index) are outside `goal-file-manifest.txt` and are recorded as not reviewable in scope, not as pass. |
| `checklist_evidence` | core | notApplicable | `006-fanout-deep-review/spec.md` declares `SPECKIT_LEVEL: 1`; the target has no `checklist.md` and no `acceptance-criteria.md` | None — nothing to reconcile. |

**Overlay protocols**

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `feature_catalog_code` | overlay | notApplicable | No feature catalog for this target. |
| `playbook_capability` | overlay | notApplicable | No playbook claims for this target. |

**AC_COVERAGE:** exempt — the target is a Level 1 packet, which the lifecycle predicate excludes.

**Verification notes the merge should keep** (each re-read during the run, none inferred from prose):

- Fan-out review close: `step_convergence_report` exempts the root dashboard when lineage logs exist; both branches proven by `run-now-yaml-control.vitest.ts:293-400`.
- `edit_lines`: the short-count refusal names the final empty line and offers a safe retry; the moved-line refusal and the strict-other-mismatch path are unchanged (`.pi/extensions/pi-cache-optimizer/index.ts:8148-8175`, tests `hash-verified-edits.test.ts:123-127`).
- Plugin mirror: `.opencode/plugins/system-skill-advisor.js` and `.skilled/plugins/system-skill-advisor.js` are byte-identical (md5 `28114f4c629b341a44ce9f7bfef76ef5`); the duplication is a follow-on-change risk, not drift.
- Ledger scope shapes: review events key scope on `sessionId`, research events on `lineageId`, each matching its mode's ledger schema (`deep-review-ledger-schema.vitest.ts:162`) — the asymmetry is correct.
- Nested deadline chain 2800 ms adapter / 2500 ms shim kill / 2200 ms advisor budget holds for the default path (F002 covers the operator-override case).

## 8. Deferred Items

- **F003 upgrade condition:** if any workflow is expected to submit outcome telemetry for `pi`, `codex`, `cursor` or `devin`, the drift becomes P1 and the merged verdict becomes CONDITIONAL.
- **F005 upgrade condition:** if confirm mode with `stop_policy: max-iterations` is an operational lane, the contract violation becomes P1.
- **Adjacent-surface observation (out of manifest, not a finding):** `.skilled/bin/skill-advisor.cjs:91` creates the IPC socket directory with `mode: 0o700`, but `mkdirSync(recursive)` does not repair an attacker-pre-created directory, and `.skilled/bin/lib/launcher-ipc-bridge.cjs` has no chmod. Same hardening class as F004, outside the review scope.
- **Plugin duplication:** the two byte-identical plugin copies remain a follow-on-change risk; suggested resolution is a generation step or a symlink, out of scope for a fix phase.
- **`metrics.ts` comment wording:** the bounded-log comment says read-trim-rewrite amortizes while the full read runs on every append; cap is 200 records so the cost is negligible. Wording nit only, deliberately not filed.
- **Phase 005 REQ-006 / REQ-007:** not reviewable from the manifest scope; they need their own check in the phase that owns those files.

## Dimension Expansion Map

- **Selected review directions:** D1 correctness on the phase 2/3 hook and runtime wiring (iteration 1); D2 security on the output, schema, plugin and diagnostics surfaces (iteration 2); D3 traceability across phases 002-005 plus D4 maintainability on the YAMLs, the Pi extension, docs and tests (iteration 3).
- **Completed pivots:** 0. **Failed pivots:** 0. **Audited overrides:** 0.
- **Saturated directions:** none — the lineage used one focus per iteration by design and no dimension was revisited for lack of yield.
- **Council artifact references:** none (no `@ai-council` artifact in this lineage).
- **Remaining frontier:** none for this lineage. The cost of that statement is real: 3 iterations over 38 files is breadth-first, so per-file depth beyond the cited lines is a residual, unquantified gap rather than a reviewed-clean area.

## 9. Search Ledger

- `searchCoverage`: not captured in this lineage's state (the runner wrote iteration records without the search-depth block).
- `candidateCoverage`: not captured.
- `searchDebt`: empty. `hasSearchDebt: false`.
- `ruledOutCandidates`: the disproved directions are enumerated in the Audit Appendix below and in `deep-review-strategy.md` §10.
- `cleanSearchProof`: not captured.

*No search-depth state captured (legacy v1 record)*

## 10. Audit Appendix

**Convergence summary.** Stop policy `max-iterations`; convergence was telemetry only. Three iterations ran to the configured cap and the loop did not synthesize early. The severity-weighted new-findings ratio decayed 1.00 → 0.50 → 0.20 while the finding count grew 2 → 4 → 5; the terminal ratio is 0.20, well above the 0.10 threshold, so the decayed score was never the reason to stop — the cap was.

**Coverage summary.** 38 of 38 manifest entries reviewed (several across two iterations), plus 1 out-of-manifest context file (`runtime/tools/advisor-validate.ts`, cited inside F003 and marked as context). Dimensions 4/4. Core protocols 1 pass + 1 notApplicable. Overlays 0/0 applicable.

**Ruled-out claims (each disproved with evidence, not by absence).**

| Claim | Why it was ruled out | Evidence |
|-------|----------------------|----------|
| Shim stdin/stdout boundary math is off by one | `MAX_STDIN_BYTES + 1` chunk arithmetic, `INPUT_OVERFLOW`, `ENOBUFS`/`ETIMEDOUT`/`NONZERO_EXIT`/`INVALID_JSON` fail-open branches and the absolute-file override guard are correct | `system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:81-146` |
| Pi directive dedup can grow unbounded or drop a live session | Eviction runs only for unseen sessions and always leaves room for the incoming key; headless-brief normalization lets an identical block dedup with or without a head | `hooks/pi/prompt-advisor.ts:18-32`, `:78-154` |
| Pi's first import candidate is a dead path | Deliberate dual resolution — the symlink location of record plus the realpath fallback under `.skilled/...`, phase 002 REQ-004 requires a test for both | `002-hook-deadline-and-diagnostics/spec.md` REQ-004, `prompt-advisor.vitest.ts:138`, `:158` |
| `metrics.ts` trim is a cost regression | Cap is 200 records; read-trim-rewrite is crash-safe via temp-file rename | `runtime/lib/metrics.ts:302-320` |
| Prompt injection reaches the model through the renderer | Labels are unicode-folded, control-char-stripped and instruction-shape-rejected; only enum-checked freshness, sanitized labels and numeric scores are interpolated | `runtime/lib/render.ts:94-96`, `:140-156`, `:426-451` |
| The plugin spawns through a shell | Argument vector, no shell; stdout capped; JSON parse guarded; term/deadline kill present | `.skilled/plugins/system-skill-advisor.js:780-799`, `:1075-1081` |
| Workspace-root allowlist is bypassable | Separator-aware prefix match on the realpath-canonicalized form; the handler's weaker re-canonicalization cannot widen it | `runtime/schemas/advisor-tool-schemas.ts:116-151`, `handlers/advisor-recommend.ts:62-69` |
| Plugin/renderer fallback texts have drifted | String-equal for every status/freshness pair the CLI path can emit; `degraded` is defensive-only because `parseCliResponse` never emits it | `render.ts:455-473` vs plugin `:67-84`, `:1342-1346` |
| Plugin mirror drift | Byte-identical copies (md5 `28114f4c629b341a44ce9f7bfef76ef5`) | `.opencode/plugins/system-skill-advisor.js`, `.skilled/plugins/system-skill-advisor.js` |
| The fan-out review close is still blocked by a root dashboard | The convergence command exempts the dashboard when lineage logs exist; both branches proven by the YAML control test | `run-now-yaml-control.vitest.ts:293-400` |
| `edit_lines` short-count refusal is user-hostile | The branch is self-describing and offers a safe retry; other mismatches keep the strict message | `pi-cache-optimizer/index.ts:8158-8175` |
| Research/review ledger `scope` key asymmetry is a defect | Review keys on `sessionId`, research on `lineageId`, each matching its mode's ledger schema | `deep-review-ledger-schema.vitest.ts:162` |
| Phase 003 REQ-007 doc claims drift from code | Docs place the gate ahead of the CLI and name the CLI as the hook's front door with no native builder on the hook path | `hooks/skill-advisor-hook.md:37-39`, `ARCHITECTURE.md:133` |

**Sources reviewed.** The full manifest list is `goal-file-manifest.txt` (38 entries); per-file dimensions, last iteration and per-file finding attribution are in `deep-review-strategy.md` §14 (`FILES UNDER REVIEW`). Iteration narratives with their ruled-out and dead-end sections: `iterations/iteration-001.md`, `iteration-002.md`, `iteration-003.md`.

**Cross-reference appendix.** Core protocols: `spec_code` (pass, iterations 1-3), `checklist_evidence` (notApplicable). Overlay protocols: `feature_catalog_code` (notApplicable), `playbook_capability` (notApplicable).

**Execution disclosure.** This lineage ran under the detached fan-out executor: every iteration and this synthesis were performed inline by the process that received the orchestration prompt. No nested CLI, agent or subprocess ran an iteration; the per-iteration executor-dispatch steps of the workflow are satisfied by that process. Because the first attempt exited without this report artifact, the report was compiled in a second attempt from the same lineage state — the iteration files and state records are unchanged, the terminal `synthesis_complete` record still carries `stopReason: maxIterationsReached`, and no finding was added, re-graded or dropped while compiling. The canonical ledger gateway path was not exercised for the terminal event; the record was written directly to the lineage state log.

**Handoff.** The merged root `review/review-report.md`, the cross-lineage dedup with sibling lineage `mimo`, and the fan-out close are the orchestrator's. If the merged report adjudicates F003 or F005 upward, the citations above are the evidence base. If F005 is accepted as a deliberate confirm-mode design difference, it closes with a one-line note at `deep-review-confirm.yaml:38`.

Report status: complete
