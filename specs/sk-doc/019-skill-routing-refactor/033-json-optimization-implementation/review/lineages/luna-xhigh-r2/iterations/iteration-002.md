# Deep Review Iteration 002

## Dispatcher
- Route: Resolved route: mode=review target_agent=deep-review
- Target: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation`
- Mode: review
- Budget profile: scan
- Dimension: security
- Focus area: trust boundaries and unsafe side effects in scripts, generated artifacts, and CI/workflow hooks named by the packet.

## Dimension
security

## Files Reviewed
- `.github/workflows/routing-registry-drift.yml:10`
- `.github/workflows/routing-registry-drift.yml:58`
- `.github/workflows/routing-registry-drift.yml:82`
- `.github/workflows/routing-registry-drift.yml:147`
- `.github/workflows/routing-registry-drift.yml:149`
- `.github/workflows/routing-registry-drift.yml:156`
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:676`
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/score-routing-corpus.py:72`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:71`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:95`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts:28`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts:41`

## Findings - New
### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Workflow leaves token permissions implicit while npm-fetched tools execute** -- `.github/workflows/routing-registry-drift.yml:58` -- The workflow defines jobs immediately after the trigger block, with no top-level or job-level `permissions` floor before `actions/checkout`, `npx --yes vitest@4.0.18`, `npm ci`, and unqualified `npx vitest` execute in CI [SOURCE: .github/workflows/routing-registry-drift.yml:10] [SOURCE: .github/workflows/routing-registry-drift.yml:58] [SOURCE: .github/workflows/routing-registry-drift.yml:82] [SOURCE: .github/workflows/routing-registry-drift.yml:147] [SOURCE: .github/workflows/routing-registry-drift.yml:149] [SOURCE: .github/workflows/routing-registry-drift.yml:156]. If repository defaults grant a write-scoped `GITHUB_TOKEN`, a compromised npm dependency or action in this workflow has more repository authority than the job needs. Counterevidence lowers this to P2: the workflow uses `pull_request`, not `pull_request_target`, and this review found no `secrets.*` reference in the workflow. Add an explicit minimal permission block, such as `permissions: { contents: read }`, and raise only specific jobs if a future step needs more.
   - Finding class: cross-consumer
   - Scope proof: `rg -n "^permissions:|^[[:space:]]+permissions:" .github/workflows ...` found permissions blocks in other workflows but not this workflow; the reviewed workflow has two jobs and both execute dependency-backed commands.
   - Affected surface hints: ["routing-registry-drift workflow", "GITHUB_TOKEN permission boundary", "npm-backed CI tools"]

## Traceability Checks
- security.ci_token_permissions: partial - implicit token permissions remain while dependency-backed commands execute.
- security.subprocess_shell_injection: pass - reviewed Python subprocess sites use list-form arguments and no `shell=True` evidence was found [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:676] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/score-routing-corpus.py:72].
- security.derived_metadata_path_boundary: pass - derived sync resolves `workspaceRoot` and `skillDir`, rejects directories outside the workspace, then writes only the joined graph metadata path [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:71] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:95].
- security.derived_metadata_prompt_boundary: pass - derived values are length-limited, instruction-shaped content is rejected, and values pass through label sanitization before storage [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts:28] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts:41].
- security.declared_scope_paths: partial - two dispatcher-declared implementation anchors were missing in the current tree; the actual `init_skill.py` path was reviewed as workflow integration context.

## Integration Evidence
- `.github/workflows/routing-registry-drift.yml` was reviewed as the CI/workflow integration surface named by the bound packet.
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py` was reviewed for native bridge subprocess behavior.
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/score-routing-corpus.py` was reviewed for Gate 3 runner subprocess behavior.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts` and `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts` were reviewed for generated metadata trust boundaries.

## Edge Cases
- The declared scope path `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py` is stale; the current tree contains `.opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py`.
- The declared scope path `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-derived-v2.ts` was not present in the current tree.
- Absence of an explicit `permissions` block is severity-sensitive because repository/org defaults can change the actual token scope. This iteration keeps the finding at P2 because no secret use or `pull_request_target` trigger was found.

## Confirmed-Clean Surfaces
- Native bridge subprocess invocation: list-form `node` call, JSON stdin, fixed cwd, timeout, and explicit env builder.
- Gate 3 corpus runner invocation: list-form `node` call, fixed runner path, fixed cwd, and `check=False` with return-code handling.
- Derived metadata sync: workspace containment check before writing `graph-metadata.json`.
- Derived metadata sanitizer: instruction-shaped strings and markup-shaped prompt payloads are rejected before storage.

## Ruled Out
- P0 security blocker: no immediate credential exposure, destructive write, auth bypass, or `pull_request_target` execution path was evidenced in the reviewed security slice.
- Shell injection in reviewed Python subprocess sites: commands use list arguments rather than shell interpolation.
- Derived metadata path traversal: `skillDir` must stay under `workspaceRoot` before the write target is derived.
- Derived metadata prompt injection through generated labels: instruction-shaped and markup-shaped strings are rejected before storage.

## Verdict
Conditional: no new P0/P1 security finding was found in this iteration, but prior active P1 findings remain in the lineage and this iteration adds one P2 security advisory.

## Next Focus
- dimension: traceability
- focus area: feature catalog/code and playbook/capability evidence, with direct reconciliation against named packet acceptance gates.
- reason: correctness and security have now been covered; the remaining high-value risk is whether recorded evidence and integration claims actually trace to live artifacts.
- rotation status: advance to next dimension
- blocked/productive carry-forward: do not repeat parent status-matrix, phase-011 live-bridge acceptance, subprocess shell-injection, derived metadata sanitizer, or CI token-permission discovery except for remediation verification.
- required evidence: direct file:line reads of feature catalog/code surfaces, playbook/capability artifacts, and checklist rows that claim completion.

Review verdict: CONDITIONAL
