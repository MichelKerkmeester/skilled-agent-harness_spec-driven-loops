---
title: "Deep Review Report: OpenCode v1 removal"
description: "Generation 3 deep review of the OpenCode v1 removal as merged to main. Verdict PASS with eight P2 advisories; every prior P1 replays clean."
contextType: "review"
importance_tier: "normal"
---

# Deep Review Report: OpenCode v1 removal

<!-- MACHINE-OWNED: review-report generation=3 sessionId=2026-11-20T10:07:53.884Z -->

## 1. Executive Summary

- **Verdict: PASS.** `review-verdict.cjs` over the refreshed registry returned `verdict PASS`, `has_advisories true`.
- **hasAdvisories:** true. Eight P2 advisories are active.
- **Counts the verdict used:** active P0 = 0, active P1 = 0, active P2 = 8, search debt = 0, failed required gates = none. The terminal gates evidence, scope and coverage all passed at the stop.
- **Adversarial self-check:** no active P0 or P1 findings, so the Hunter/Skeptic/Referee pass had nothing to adjudicate and appended no rows. Iteration 5 separately re-read all eight P2s against the merged tree and confirmed each one at P2.
- **Review scope:** 281 files. That is the packet's own docs and scratch evidence (46 files) plus the 235 still-existing non-spec files changed by merge `06d02096e90` against its first parent. Closure commit `a2dc927a8a3` and parent fix `b18b80291d2` were read as packet docs. Changes merged in from origin/main were out of scope.
- **Run:** 5 iterations, executor cli-pi `deepseek-v4.1-flash-1017` with `--thinking max`, executor timeout 1800 s, stop policy `max-iterations`, stop reason `maxIterationsReached`. Generation 3, a restart of generation 2 (archived at `review-archive/20261120T100738Z/`).
- **Operator review focus:** Review the OpenCode v1 removal as merged to main: the code, test, CI and doc changes in merge 06d02096e90 (diff against its first parent), closure a2dc927a8a3 and parent fix b18b80291d2. Verify the prior review's fixes hold, OpenCode 2 is the only supported major, no v1 path survives outside the justified list, and packet evidence matches the code. The justified-list gap for skilled-loop was fixed in f6aa8dc052b; confirm it, don't re-report it.
- **Focus outcome:**
  - **Prior P1 replay:** DR4-P1-001, DR3-P1-001 and DR-001-P1-001 all replay as PASS on the merged tree (iteration 5).
  - **Supported majors:** OpenCode 2 is the only trusted family. The version probe resolves only `opencode` and `OPENCODE_BIN`.
  - **Justified list:** `003-v1-docs-and-playbooks-sweep/scratch/justified.txt` holds 32 rows, including `.skilled/bin/skilled-loop`, and all 32 paths resolve. The f6aa8dc052b fix holds and was not re-reported.

## 2. Planning Trigger

`/speckit:plan` is **not required**. The verdict is PASS, and the eight P2 items are advisories that can be batched into a follow-up packet at the owner's choice.

```json
{
  "title": "Planning Packet",
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "DR1-P2-001", "severity": "P2", "file": ".skilled/hooks/cli-dispatch/lib/opencode-version.mjs:121"},
    {"id": "DR2-P2-001", "severity": "P2", "file": ".skilled/commands/doctor/scripts/opencode-version-battery.cjs:966"},
    {"id": "DR2-P2-002", "severity": "P2", "file": ".opencode/plugins/lib/v2-bridge.js:348"},
    {"id": "DR3-P2-001", "severity": "P2", "file": "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/event-capture.txt:1"},
    {"id": "DR3-P2-002", "severity": "P2", "file": "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/tasks.md:157"},
    {"id": "DR4-P2-001", "severity": "P2", "file": ".github/workflows/opencode-v2-battery.yml:122"},
    {"id": "DR4-P2-002", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts:527"},
    {"id": "DR4-P2-003", "severity": "P2", "file": ".opencode/plugins/lib/v2-bridge.js:327"}
  ],
  "remediationWorkstreams": [
    {"id": "WS-P2-runtime", "findings": ["DR1-P2-001", "DR2-P2-001", "DR2-P2-002", "DR4-P2-003"], "advisory": true},
    {"id": "WS-P2-tests-ci", "findings": ["DR4-P2-001", "DR4-P2-002"], "advisory": true},
    {"id": "WS-P2-packet-evidence", "findings": ["DR3-P2-001", "DR3-P2-002"], "advisory": true}
  ],
  "specSeed": ["Optional follow-up packet for the eight P2 advisories of the OpenCode v1 removal review"],
  "planSeed": ["Decide the opencode2 vocabulary", "Pin the battery server bind address", "Surface unmapped plugin hook keys", "Wire the remove-v1 test into CI", "Run the parser parity test over the corpus", "Rename dualPlugin", "Correct the event-capture header and the CHK-041 command"],
  "findingClasses": ["latent-correctness", "latent-security/unverified-bind-default", "silent-degradation/guard-availability", "documentation-residue/stale-evidence-header", "verification-reproducibility/under-specified-proof-command", "test-inventory", "duplicated-rule-guard-breadth", "naming-residue"],
  "affectedSurfacesSeed": [".skilled/hooks/cli-dispatch/lib", ".skilled/commands/doctor/scripts", ".opencode/plugins/lib/v2-bridge.js", ".github/workflows/opencode-v2-battery.yml", ".skilled/skills/system-deep-loop/runtime/tests/unit", "070-opencode-v1-removal/001-v1-runtime-code-and-tests"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | file:line | Evidence | Impact | Fix recommendation | Disposition | findingClass | scopeProof | affectedSurfaceHints |
|----|-----|-------|-----------|-----------|----------|--------|--------------------|-------------|--------------|------------|----------------------|
| DR1-P2-001 | P2 | `opencode2` is still a live v2 launcher name in tests and docs, but the version probe no longer trusts it | correctness | `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:121` | `trustedExecutables()` resolves only `opencode` plus `OPENCODE_BIN` (`:121-133`). `opencode-models-form.test.cjs:51-53`, `system-dist-freshness-guard.test.cjs:196-208` and `dispatch-audit.test.mjs:267,672` still treat `opencode2` as a v2 spelling | A path-qualified `.../opencode2 run` resolves to `unknown`, not `v2`. Latent while no install uses that name | Pick one rule: retire `opencode2` everywhere, or trust it again in the probe | active (confirmed iteration 5) | latent-correctness | merge diff `06d02096e90^1..06d02096e90` | cli-dispatch preflight evaluate(); opencode-models-form test vocabulary |
| DR2-P2-001 | P2 | Private battery server bind address left to the package default while inheriting the full environment | security | `.skilled/commands/doctor/scripts/opencode-version-battery.cjs:966` | `readV2` spawns `serve --port <port>` with no host flag. `v2ServerEnv` (`:339-347`) spreads the parent env, while the client and `findFreePort` assume `127.0.0.1` (`:867`, `:974`) | If `serve` binds every interface, a shared-network host exposes a credentialed server for the battery's lifetime. Unverified | Pass an explicit loopback host flag, or assert the bound address from the banner | active (confirmed iteration 5) | latent-security/unverified-bind-default | spawn unchanged by the merge; scope is the v2-only battery leg the merge kept | readV2; --family=v2 doctor leg; opencode-v2-battery.yml |
| DR2-P2-002 | P2 | Unmapped plugin hook key dropped with no runtime signal | security | `.opencode/plugins/lib/v2-bridge.js:348` | `skippedKeys` lists keys outside `MAPPED_HOOKS` (`:16-23`) and is attached only as a non-enumerable property of the cleanup function (`:429`). It is never logged or thrown | A guard plugin that registers an unmapped key loads with no effect and no failing signal. The merge removed the v1 `server` path that forwarded every key | Log or throw on non-empty `skippedKeys` at setup, or assert it is empty in the registration tests | active (confirmed iteration 5) | silent-degradation/guard-availability | new on the v2-only path after the merge | dualPlugin setup contract; every plugin under .opencode/plugins/ |
| DR3-P2-001 | P2 | The event-capture evidence file contradicts itself on whether a live session ran | correctness | `.../001-v1-runtime-code-and-tests/scratch/event-capture.txt:1` | The header says "static, no live session was launched", while `:22-23` record a live capture on 2.3.2 (logger plugin, exit 0) | A closure audit that reads the header first concludes the live evidence does not exist | Rewrite the header to describe both the static and the live parts | active (confirmed iteration 5) | documentation-residue/stale-evidence-header | packet evidence file | 001 closure evidence chain (T004, T017, CHK-003, CHK-023) |
| DR3-P2-002 | P2 | CHK-041's recorded "prints 0" is not reproducible from the command as written | correctness | `.../001-v1-runtime-code-and-tests/tasks.md:157` | `rg -n -e '070-' -e 'REQ-0' <changed files> | wc -l` returns 125 over the merged file list. 116 hits are trigger-index and fixture data, the rest non-comment uses | No real hygiene breach, but the proof command cannot reproduce its recorded result | Narrow the command to code comments in source files, or record the narrowing used | active (confirmed iteration 5) | verification-reproducibility/under-specified-proof-command | merged file list `git diff --name-only 06d02096e90^1 06d02096e90` | 001 CHK-041 closure claim |
| DR4-P2-001 | P2 | The only remove-v1 end-to-end test runs in no workflow, while its file path triggers the battery workflow | correctness | `.github/workflows/opencode-v2-battery.yml:122` | The workflow runs four `node --test` files. `opencode-setup-classify.test.cjs`, the only suite that runs `opencode-setup.sh remove-v1` end to end (its header `:7-9`), is not among them | The one destructive mode the merge added has no CI execution | Add the classify test to the battery's unit step | active (confirmed iteration 5) | test-inventory | workflow added by the merge | .github/workflows/README.md:41; opencode-setup-classify.test.cjs |
| DR4-P2-002 | P2 | Parser parity case iterates a 9-element list while the same file loads a 13-entry corpus | correctness | `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts:527` | `for (const output of VERSION_OUTPUTS)` (`:520-529`) runs over nine hand-written outputs, while the corpus loaded 15 lines above holds 13 | Parity between the ESM and CJS parsers is checked on a narrower set than the corpus the file already has | Iterate the corpus outputs in the parity case | active (confirmed iteration 5) | duplicated-rule-guard-breadth | test changed by the merge | opencode-version-corpus.json |
| DR4-P2-003 | P2 | Primary plugin export builder still named `dualPlugin` | correctness | `.opencode/plugins/lib/v2-bridge.js:327` | `export function dualPlugin(id, factory)`, whose JSDoc now describes a single-target `{ id, setup }` builder. 20 plugin entry files call it | A name from the dual-compat era misdescribes the v2-only contract | Rename (keep an alias for one release) and update ARCHITECTURE.md `:57,61,112,123` | active (confirmed iteration 5) | naming-residue | builder rewritten by the merge | .opencode/plugins/ARCHITECTURE.md |

## 4. Remediation Workstreams

- **P0:** none.
- **P1:** none.
- **P2 advisories** (separate, non-blocking):
  1. **WS-P2-runtime:** DR1-P2-001, DR2-P2-001, DR2-P2-002, DR4-P2-003.
  2. **WS-P2-tests-ci:** DR4-P2-001, DR4-P2-002.
  3. **WS-P2-packet-evidence:** DR3-P2-001, DR3-P2-002.

## 5. Spec Seed

- If the owner takes the advisories, they fit one small follow-up phase under `002-opencode-v1-v2-dual-compat`, or a child of this packet. The eight P2 rows above, with their file:line refs, become its requirements.
- Record the `opencode2` decision (retire or trust) as an ADR, since it touches the probe, tests and docs together.

## 6. Plan Seed

1. Decide the `opencode2` rule and apply it to the probe and the three test files (DR1-P2-001).
2. Pin the battery's `serve` host to loopback, or assert it from the banner (DR2-P2-001).
3. Make `dualPlugin` setup report a non-empty `skippedKeys` (DR2-P2-002).
4. Add `opencode-setup-classify.test.cjs` to `opencode-v2-battery.yml` (DR4-P2-001).
5. Run the parser parity case over the corpus (DR4-P2-002).
6. Rename `dualPlugin` and update ARCHITECTURE.md (DR4-P2-003).
7. Fix the event-capture header and the CHK-041 proof command in phase 001 (DR3-P2-001, DR3-P2-002).

## 7. Traceability Status

- **Core protocols:**
  - **spec_code:** pass. The trust list and parser match the spec's "OpenCode 2 only" claim (`opencode-version.mjs:121-142`).
  - **checklist_evidence:** pass. 003 AC-004, AC-006 and AC-007 and the closure statement were re-read on the merged tree. The ADR-001 replacement command for AC-006 prints 0, and all 32 justified paths resolve.
  - Summary: required 4, executed 4, pass 4, partial 0, fail 0, blocked 0, notApplicable 2, gating failures 0.
- **Overlay protocols:**
  - **feature_catalog_code:** pass. The opencode-version-dispatch catalog entry describes the major-1 refusal the code performs.
  - **playbook_capability:** pass (iteration 3).
  - **skill_agent:** notApplicable this run.
  - **agent_cross_runtime:** notApplicable. No mirror claim was made.
- **AC_COVERAGE:** advisory signal only. All rows of the three phases' `acceptance-criteria.md` are Met or Superseded with evidence, and no shortfall was found.

## 8. Deferred Items

- The `opencode2` vocabulary decision (DR1-P2-001) is a product choice, not a defect fix.
- The battery bind default (DR2-P2-001) needs a check of OpenCode 2's `serve` default before its severity can move either way. Its downgrade trigger is that `serve` binds loopback by default, and its escalation trigger is that it binds every interface.

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Saturated directions: none recorded. Remaining frontier: none (default depth mode, no divergent pivot).

## 9. Search Ledger

- **searchCoverage:**
  - required bug classes: regression_at_removed_api, error_swallowed_as_success, doc_code_divergence, stale_proof_command, test_coverage_gap;
  - all covered;
  - ruled out: regression_at_removed_api, error_swallowed_as_success;
  - deferred: none. Blocked: none.
  - graphCoverageMode: graphless_fallback.
- **candidateCoverage:** covered 14 classes, including destructive-operation-scope, secret-exposure, trust-boundary, injection, justified-list-drift and guard-availability.
- **ruledOutCandidates:** recorded per iteration in the registry, for example SL-201 (trust-boundary in `opencode-version.mjs`, iteration 2).
- **hasSearchDebt:** false. `searchDebt` is empty.
- **cleanSearchProof:** see `deep-review-findings-registry.json`.

## 10. Audit Appendix

- **Convergence:**
  - Iterations 1–5 all completed, with no error or timeout.
  - newFindingsRatio by iteration: 1, 1, 0.4, 0.375, 0.
  - Stop decision at iteration 6: `STOP` / `maxIterationsReached`, graph decision `STOP_BLOCKED` (telemetry under stop policy max-iterations).
  - Terminal gates: evidence pass (all findings cited), scope pass (all findings in scope), coverage pass (coverage complete).
- **Coverage:** correctness (iterations 1 and 5), security (iteration 2), traceability (iteration 3), maintainability (iteration 4). Dimension coverage 4/4.
- **Fix-completeness replay (iteration 5):**
  - **DR4-P1-001:** PASS. Both hook paths in `.vibe/plugins/repo-guards/session-cleanup.mjs` call `.factory(...)`, and `runGuard` in `lib/hook-io.mjs:112-124` writes the error to stderr before failing open.
  - **DR3-P1-001:** PASS. 003 AC-004 Met agrees with 003 `implementation-summary.md`.
  - **DR-001-P1-001:** PASS. The 003 closure statement reads "Closeable: Yes".
- **Ruled-out claims:**
  - No remaining `.server` caller.
  - The parser parity guard exists (narrower than the corpus, see DR4-P2-002).
  - Justified-list drift is closed by f6aa8dc052b.
- **Sources reviewed:** the 281 scope files listed in `deep-review-config.json#reviewScopeFiles`. Per-iteration narratives are in `iterations/iteration-001.md` through `iteration-005.md`.

### Core Protocols

| Protocol | Status | Iteration | Evidence |
|----------|--------|-----------|----------|
| spec_code | pass | 3, rechecked 5 | `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:121-142` |
| checklist_evidence | pass | 3, rechecked 5 | `003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:57,59` |

### Overlay Protocols

| Protocol | Status | Iteration | Notes |
|----------|--------|-----------|-------|
| feature_catalog_code | pass | 3 | opencode-version-dispatch entry matches the refusal |
| playbook_capability | pass | 3 | no code behind it changed after iteration 3 |
| skill_agent | notApplicable | 5 | no skill-agent contract in scope |
| agent_cross_runtime | notApplicable | 5 | no mirror claim made |
