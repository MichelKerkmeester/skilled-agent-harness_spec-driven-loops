# Deep Review Report - system-spec-kit Runtime Rename

## Executive Summary

Verdict: **CONDITIONAL**

Release readiness state: `in-progress`. The conditional verdict requires remediation before release. `hasAdvisories` is false under the workflow rule because that flag is reserved for PASS results carrying only P2 items.

The detached lineage completed all 10 configured iterations inline with `cli-codex`, model `gpt-5.6-luna`, and stopped at `maxIterationsReached`. Early convergence signals were telemetry only. The final active finding counts are 0 P0, 2 P1, and 2 P2. The two P1 findings block a clean release-readiness result:

- **DR-001 P1:** the scripts freshness traversal follows the dangling `.opencode/skills/system-spec-kit/scripts/runtime -> ../runtime/dist` link and throws ENOENT while descending. The traversal and freshness error handling are at [.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:217-235,795-800].
- **DR-004 P1:** `chokidar` is declared by the runtime package but has no production import or require in the bounded runtime and scripts inventory. The only cited consumer is in the separately preserved advisor package. Evidence is at [.opencode/skills/system-spec-kit/runtime/package.json:41-45], [.opencode/skills/system-spec-kit/runtime/tsconfig.json:17-23], and [.opencode/specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:88-100].

The two P2 advisories are DR-002 for explicit hook target override scope and DR-003 for current runtime-facing MCP-server vocabulary. No P0 finding was observed. No implementation fix was made because this review was observation-only and the user restricted the write surface to this lineage directory.

## Planning Trigger

Follow-up planning is required before release. The packet requires a behavior-preserving move, live dependency ownership, and a ten-iteration review with no P0 or P1. [SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/spec.md:118-144]

The next planning action should cover:

1. Fix or redesign the freshness traversal boundary and prove the moved runtime distribution path.
2. Resolve the `chokidar` ownership decision and regenerate dependency evidence.
3. Update the overstated AC-006 evidence and complete the open review task T009 after the fixes.

AC-006 is currently marked Met even though its cited dependency proof does not establish a runtime consumer. AC-010 and T009 remain open. [SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/acceptance-criteria.md:62-66] [SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/tasks.md:51-70]

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "DR-001", "severity": "P1", "title": "Scripts freshness scan follows a missing moved-runtime distribution link", "findingClass": "class-of-bug"},
    {"id": "DR-004", "severity": "P1", "title": "Runtime manifest keeps chokidar on an advisor-only consumer claim", "findingClass": "class-of-bug"},
    {"id": "DR-002", "severity": "P2", "title": "Hook target overrides accept any regular absolute file", "findingClass": "instance-only"},
    {"id": "DR-003", "severity": "P2", "title": "Current runtime guidance retains retired server vocabulary", "findingClass": "matrix/evidence"}
  ],
  "remediationWorkstreams": [
    "Repair freshness traversal and prove moved-runtime build ordering",
    "Resolve chokidar ownership and regenerate dependency evidence",
    "Correct current runtime identity guidance",
    "Document or constrain explicit hook target overrides"
  ],
  "specSeed": [
    "Require classified missing-dist behavior at the moved-runtime symlink boundary",
    "Require every direct runtime dependency to have a live production consumer or removal evidence",
    "Require current runtime-facing guidance to use runtime or engine identity"
  ],
  "planSeed": [
    "Fix DR-001 and replay freshness and validation gates",
    "Resolve DR-004 and regenerate the lockfile",
    "Update DR-003 guidance and replay exact residue checks",
    "Replay DR-002 override hardening after implementation"
  ],
  "findingClasses": ["class-of-bug", "instance-only", "matrix/evidence"],
  "affectedSurfacesSeed": [
    "scripts freshness walker",
    "runtime manifest and lockfile",
    "Claude lifecycle shims",
    "operator and fixture documentation",
    "AC-006, AC-010, and T009 evidence"
  ],
  "fixCompletenessRequired": false
}
```

## Active Finding Registry

| ID | Severity | Status | Evidence | Release impact |
|---|---|---|---|---|
| DR-001 | P1 | Open | [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:217-235,795-800] | Freshness and validation diagnostics fail at the moved-runtime symlink boundary |
| DR-004 | P1 | Open | [SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:41-45] [SOURCE: .opencode/skills/system-spec-kit/runtime/tsconfig.json:17-23] | Dependency audit and AC-006 consumer claim are not proven |
| DR-002 | P2 | Open | [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:37-68,91-128] | Explicit operator or test override can select any existing absolute regular file |
| DR-003 | P2 | Open | [SOURCE: .opencode/bin/README.md:183] [SOURCE: README.md:771] | Current guidance can misidentify the runtime library as an MCP server |

### DR-001 - Scripts freshness scan follows a missing moved-runtime distribution link

The scripts package source scan treats its `runtime` entry as a directory. The entry is a dangling symlink to `../runtime/dist` in the observed checkout. The walker checks existence and then calls `statSync(child)` while descending, so the missing target raises ENOENT rather than becoming a classified missing candidate. The freshness consumer catches that exception and reports the supplied `DIST FRESHNESS CHECK ERROR`. [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:217-235,795-800] [SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:12-16]

Claim adjudication is confirmed with high confidence. The producer inventory is the generic scripts walker and the dangling symlink. The consumers are the package freshness check and the validation front end at [.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:614-669] and [.opencode/skills/system-spec-kit/scripts/spec/validate.sh:275-301].

Recommended remediation: exclude generated cross-package links from the scripts source walk or model the dependency boundary explicitly, then add a clean build-order regression check.

### DR-004 - Runtime manifest keeps chokidar on an advisor-only consumer claim

The runtime manifest declares `chokidar` and the runtime TypeScript config maps its types. A bounded production-source search over runtime and scripts found only those declaration and path-map entries, with no import, require, or dynamic import. The lockfile proves installation, not a live consumer. [SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:41-45] [SOURCE: .opencode/skills/system-spec-kit/runtime/tsconfig.json:17-23] [SOURCE: .opencode/skills/system-spec-kit/package-lock.json:1176-1185,2051-2065]

The implementation summary cites `.opencode/skills/system-skill-advisor/mcp-server/advisor-server.ts:101`. That package is explicitly preserved by the spec and is not a runtime consumer. [SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/spec.md:65-68] [SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:88-100]

Claim adjudication is confirmed with high confidence. Recommended remediation: remove `chokidar` and its path mapping if the source inventory is authoritative, or add a real runtime consumer and regenerate the lockfile.

### DR-002 - Hook target overrides accept any regular absolute file

The Claude prompt and directive lifecycle shims accept an explicit override when it is an absolute path to an existing regular file. The override is not constrained to the repository or an approved runtime root. The normal install-anchored ancestor walk is bounded, and the child process has bounded input, output, timeout, and kill behavior. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:37-68,91-128] [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts:30-75]

This remains a P2 instance-only advisory because the input is an explicit operator or test environment override and the normal path is bounded. Recommended remediation: document the override as trusted operator or test-only input, or constrain it to an approved root.

### DR-003 - Current runtime guidance retains retired server vocabulary

Current operator and fixture guidance uses generic MCP-server or `mcp_server` labels while pointing at the runtime package. Examples include the operator ENV reference label, the root stress-test link label, fixture documentation, and the Devin fallback text. [SOURCE: .opencode/bin/README.md:183] [SOURCE: README.md:771] [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/fixtures/README.md:3,13,38] [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/fixtures/hooks/README.md:33] [SOURCE: .devin/hooks.v1.json:35]

The exact retired path and npm-name scan was separately clean, so preserved advisor references were not misclassified. Recommended remediation: rename current runtime labels to runtime or engine and retain MCP wording only for the advisor package or historical evidence.

## Remediation Workstreams

### Workstream A - Freshness and build-order correctness

Owner surface: `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs`, runtime dist provisioning, and `validate.sh`.

- Decide whether generated cross-package symlinks are excluded from source traversal or represented as an explicit dependency boundary.
- Preserve a classified missing-dist result instead of raw ENOENT.
- Run a clean build-order and freshness replay after the implementation.
- Reopen DR-001 only after the supplied error path and the missing-dist path both pass.

### Workstream B - Dependency contract

Owner surface: runtime manifest, runtime TypeScript config, package lockfile, and AC-006 evidence.

- Confirm whether any runtime production consumer for `chokidar` exists.
- If none exists, remove the declaration and path mapping and regenerate the lockfile.
- If a consumer is required, add or restore it under the runtime ownership boundary and document it.
- Replace the advisor-only citation in the dependency evidence.

### Workstream C - Runtime identity and operator guidance

Owner surface: runtime fixture docs, Devin fallback text, operator README, and root README.

- Rename current runtime labels and commands.
- Retain `system-skill-advisor/mcp-server` references where they explicitly identify the preserved advisor package.
- Keep historical evidence untouched.
- Replay the bounded exact old-path and old-npm-name search.

### Workstream D - Explicit override hardening

Owner surface: Claude lifecycle shims and their hardening tests.

- Document the two environment overrides as trusted operator or test-only controls.
- Prefer an approved-root check if the deployment contract does not require arbitrary absolute targets.
- Preserve the existing input, output, timeout, and fail-open behavior.

## Spec Seed

This seed is a proposed follow-up input. It was not written into the spec packet because the authorized write surface was the lineage directory.

- **REQ-R1:** The scripts freshness check must classify a missing moved-runtime distribution link without throwing an unhandled ENOENT.
- **REQ-R2:** Every direct runtime dependency must have a production consumer inside the owning runtime boundary or be removed with a regenerated lockfile.
- **REQ-R3:** Current runtime-facing guidance must use the runtime or engine identity. MCP terminology remains only for the explicitly preserved advisor or historical surfaces.
- **REQ-R4:** Explicit hook target overrides must be documented as trusted controls and constrained to an approved root when the deployment contract permits.
- **Acceptance update:** AC-006 must cite a live consumer or removal evidence. AC-010 must remain unmet until the ten-iteration review is rerun after remediation and no P0 or P1 remains.

## Plan Seed

1. Repair the freshness traversal or make the runtime distribution dependency explicit.
2. Regenerate and inspect the runtime lockfile after resolving `chokidar` ownership.
3. Update current runtime labels and fallback guidance while preserving advisor and historical references.
4. Add or update focused regression coverage for the freshness boundary, dependency inventory, and explicit hook override scope.
5. Run the repository-authoritative build, validation, and test gates in a follow-up implementation session.
6. Rerun the review dimensions that cover correctness, traceability, and security. Do not mark the packet release-ready while DR-001 or DR-004 remains active.

Those commands were not run in this lineage because they can write generated output outside the user-bound artifact directory.

## Traceability Status

### Core protocols

| Protocol | Result | Evidence |
|---|---|---|
| `spec_code` | Partial | Package rename and exact residue checks pass, but the `chokidar` consumer claim remains unresolved. [SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/spec.md:58-68] |
| `checklist_evidence` | Partial | AC-010 and T009 are open, and AC-006 overstates dependency proof. [SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/acceptance-criteria.md:62-66] |

### Overlay protocols

- `skill_agent`: not applicable to this package/spec-folder target.
- `agent_cross_runtime`: not applicable to the requested target.
- `feature_catalog_code`: not applicable because the catalog is outside the review scope.
- `playbook_capability`: partial. Council and playbook references were checked where listed in scope.

### Boundary checks

- The bounded exact live-surface search found no `system-spec-kit/mcp-server` or `@spec-kit/mcp-server` matches.
- The runtime ENV reference and source-dist alignment checker keep preserved advisor references separate from the runtime package. [SOURCE: .opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:307-318] [SOURCE: .opencode/skills/system-spec-kit/scripts/evals/check-source-dist-alignment.ts:136-150]
- The suspected freshness cache-glob mismatch was ruled out because the test cleanup glob matches the producer's current `system-spec-kit-runtime` cache identity. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-dist-freshness.sh:10-18,32-44,76-79] [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:265-268]
- Resource-map coverage was skipped because `resource-map.md` was absent at initialization and emission was disabled.

AC_COVERAGE: exempt because `checklist.md` is absent. AC-010 and T009 are still explicitly open packet claims and are reported through `checklist_evidence`.

## Deferred Items

- Repository validation, package builds, test suites, generated-output checks, and `generate-context.js` were not run. The user explicitly prohibited commands that could write outside the lineage directory.
- No spec packet, source file, lockfile, or external continuity metadata was modified.
- Graph-backed coverage was unavailable. The lineage records graphless fallback ledgers with direct reads, exact searches, producer-consumer traces, and negative-control reviews.
- AC-006 correction, AC-010 completion, T009 completion, and any remediation implementation require a follow-up session with a broader write surface.
- No resource map was emitted.

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 2
- Selected directions: correctness workspace and freshness, security hook and transport boundaries, traceability identity and acceptance evidence, maintainability consumer and documentation matrix
- Saturated directions: none recorded
- Remaining frontier: remediate DR-001 and DR-004, then replay affected correctness and traceability gates
- Council artifact references: none

## Search Ledger

- `graphCoverageMode`: `graphless-fallback`
- Required bug classes covered: `workspace_path_resolution`, `dependency_manifest_alignment`, `dist_freshness_boundary`, `hook_target_resolution`, `retired_identity_residue`, `verification_evidence_alignment`, `maintainability_residue`, and `test_isolation`
- Additional classes covered: `api_contract`, `dependency_contract`, `freshness_traversal`, `build_order`, `integration_boundary`, `hook_override_scope`, `path_traversal_classification`, `permission_fail_closed`, `network_bind_auth`, `preserved_set_boundary`, `documentation_drift`, and `consumer_matrix_gap`
- Search debt: none recorded inside the lineage. Repository gate execution, clean-install execution, and continuity save were deferred by the user-boundary contract.
- Ruled-out candidates: the freshness cache-glob mismatch, exact retired path and npm-name residue, runtime/advisor ownership collapse, Gate 3 path-classification widening, Devin fail-open permission paths, and unauthenticated remote model-server exposure
- Clean-search proof: bounded exact search returned no `system-spec-kit/mcp-server` or `@spec-kit/mcp-server` matches in the live surface; the current `chokidar` search returned only manifest and TypeScript path-map entries.
- Iteration search ledgers: `CO-001` through `CO-006`, `SE-001` through `SE-004`, `TR-001` through `TR-010`, `MA-001` through `MA-011`, `CO-009` through `CO-013`, and `SE-010` through `SE-013` are embedded in the per-iteration JSONL deltas.

## Audit Appendix

### Invocation and binding

- Session: `fanout-luna-max-pass3-1788562574615-h6l4fh`
- Executor: `cli-codex model=gpt-5.6-luna`
- Loop type: `review`
- Stop policy: `max-iterations`
- Maximum iterations: `10`
- Convergence threshold: `3`
- Review target: `.opencode/specs/system-speckit/053-spec-kit-runtime-rename`
- Artifact directory: `.opencode/specs/system-speckit/053-spec-kit-runtime-rename/review/lineages/luna-max-pass3`
- Execution mode: `AUTONOMOUS`
- Lineage mode binding: `auto`, resolved to a new lineage
- Nested dispatch: prohibited and not used

### Iteration receipts

| Iteration | Dimension | Markdown | Delta |
|---:|---|---|---|
| 1 | correctness | [iterations/iteration-001.md](iterations/iteration-001.md) | [deltas/iter-001.jsonl](deltas/iter-001.jsonl) |
| 2 | security | [iterations/iteration-002.md](iterations/iteration-002.md) | [deltas/iter-002.jsonl](deltas/iter-002.jsonl) |
| 3 | traceability | [iterations/iteration-003.md](iterations/iteration-003.md) | [deltas/iter-003.jsonl](deltas/iter-003.jsonl) |
| 4 | maintainability | [iterations/iteration-004.md](iterations/iteration-004.md) | [deltas/iter-004.jsonl](deltas/iter-004.jsonl) |
| 5 | correctness | [iterations/iteration-005.md](iterations/iteration-005.md) | [deltas/iter-005.jsonl](deltas/iter-005.jsonl) |
| 6 | security | [iterations/iteration-006.md](iterations/iteration-006.md) | [deltas/iter-006.jsonl](deltas/iter-006.jsonl) |
| 7 | traceability | [iterations/iteration-007.md](iterations/iteration-007.md) | [deltas/iter-007.jsonl](deltas/iter-007.jsonl) |
| 8 | maintainability | [iterations/iteration-008.md](iterations/iteration-008.md) | [deltas/iter-008.jsonl](deltas/iter-008.jsonl) |
| 9 | correctness | [iterations/iteration-009.md](iterations/iteration-009.md) | [deltas/iter-009.jsonl](deltas/iter-009.jsonl) |
| 10 | security | [iterations/iteration-010.md](iterations/iteration-010.md) | [deltas/iter-010.jsonl](deltas/iter-010.jsonl) |

### Canonical state receipts

- [deep-review-config.json](deep-review-config.json): immutable initialization configuration with the supplied bindings.
- [deep-review-state.jsonl](deep-review-state.jsonl): 10 iteration records plus the synthesis-complete event.
- [deep-review-findings-registry.json](deep-review-findings-registry.json): final active registry with 4 findings.
- [deep-review-strategy.md](deep-review-strategy.md): final dimension coverage, convergence, and handoff strategy.
- [deep-review-dashboard.md](deep-review-dashboard.md): final status view.
- [logs/fanout-lineage.out](logs/fanout-lineage.out): phase and iteration receipt log.

### Proof limitations

The observed freshness failure and the dependency mismatch are confirmed from source and filesystem evidence. Repository-level build and validation gates remain unexecuted by explicit user boundary, so this report does not claim a green repository state. Continuity save is recorded as skipped for the same reason.

Review verdict: CONDITIONAL
