# Deep Review Iteration 005

## Dimension

Maintainability: ownership boundaries, adapter coupling, policy centralization, and safe follow-on change cost.

## Files Reviewed

- `.opencode/runtime-hooks/README.md:18-94`
- `.opencode/runtime-hooks/task-dispatch/claude/task-dispatch-guard.cjs:20-105`
- `.opencode/runtime-hooks/task-dispatch/cursor/task-dispatch-guard.mjs:21-133`
- `.opencode/runtime-hooks/mcp-route-guard/claude/mcp-route-guard.cjs:21-72`
- `.opencode/runtime-hooks/mcp-route-guard/cursor/mcp-route-guard.mjs:25-122`
- `.opencode/runtime-hooks/post-edit-quality/codex/post-edit-quality.cjs:15-163`
- `.opencode/runtime-hooks/dispatch/codex/dispatch-preflight-lint.mjs:17-112`

## Findings by Severity

### P0

None.

### P1

#### R5-P1-001: Relocated adapters retain a hard dependency on system-spec-kit

- File: `.opencode/runtime-hooks/README.md:20`
- Evidence: The new ownership contract says the enforcement layer can be adopted or removed independently of skill content, but five relocated adapters load `../../../skills/system-spec-kit/runtime/lib/hook-adapter-shared.cjs`: task-dispatch for Claude and Devin, plus MCP route guard for Claude, Codex, and Devin. The README acknowledges this at lines 37 and 92 but equates the repository-local skill import with a Node builtin. It is not equivalent: removing or packaging without `system-spec-kit` makes those adapter entrypoints fail during module loading before their fail-open handlers run. [SOURCE: `.opencode/runtime-hooks/README.md:20,37,91-92`; `.opencode/runtime-hooks/task-dispatch/claude/task-dispatch-guard.cjs:24-25`; `.opencode/runtime-hooks/mcp-route-guard/claude/mcp-route-guard.cjs:25-26`]
- Finding class: cross-consumer
- Scope proof: Exact search for `hook-adapter-shared.cjs` found five executable consumers under the relocated tree and the two README disclosures; the helper remains under `.opencode/skills/system-spec-kit/` rather than the independently-owned runtime-hook tree.
- Affected surface hints: `task-dispatch adapters`, `MCP route-guard adapters`, `runtime-hooks packaging`, `system-spec-kit ownership`
- Recommendation: Move the generic CJS adapter helper to a neutral runtime-hook library and update all five relocated consumers plus the still-skill-owned spec-gate consumer, or explicitly drop the independent adoption/removal guarantee and define `system-spec-kit` as a required runtime dependency.

Claim adjudication:

```json
{"findingId":"R5-P1-001","claim":"Five relocated adapters cannot be adopted or removed independently of skill content because module loading still requires a helper owned by system-spec-kit.","evidenceRefs":[".opencode/runtime-hooks/README.md:20,37,91-92",".opencode/runtime-hooks/task-dispatch/claude/task-dispatch-guard.cjs:24-25",".opencode/runtime-hooks/mcp-route-guard/claude/mcp-route-guard.cjs:25-26"],"counterevidenceSought":"Searched every changed runtime-hook adapter for the helper import and checked whether a neutral alias, vendored copy, package dependency, or loader fallback preserved standalone use.","alternativeExplanation":"The repository may always ship system-spec-kit with runtime-hooks, but that operational assumption contradicts the new README's explicit independent adoption/removal property and is not encoded as a package dependency.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Downgrade if the independent-use claim is formally removed and system-spec-kit is declared and validated as a mandatory deployment dependency, or if the helper is relocated behind a neutral stable import."}
```

### P2

#### R5-P2-001: Cursor guards depend on Claude adapter executables and response envelopes

- File: `.opencode/runtime-hooks/task-dispatch/cursor/task-dispatch-guard.mjs:41`
- Evidence: Both Cursor adapters spawn a sibling Claude adapter by hard-coded repository path, then parse Claude's `hookSpecificOutput` envelope before translating it to Cursor output. The runtime-neutral cores already exist one directory above each adapter. This makes a Claude adapter path, exit, or response-envelope refactor a coordinated Cursor change even when the neutral policy API is unchanged. An exact test search found no automated test naming either Cursor adapter. [SOURCE: `.opencode/runtime-hooks/task-dispatch/cursor/task-dispatch-guard.mjs:41,78-120`; `.opencode/runtime-hooks/mcp-route-guard/cursor/mcp-route-guard.mjs:36,83-110`]
- Finding class: cross-consumer
- Scope proof: Exact search found both `GUARD_SCRIPT_RELATIVE` constants point to `claude/` siblings, while the reviewed Claude adapters call their concern-local neutral cores directly. No changed automated test directly names either Cursor adapter.
- Affected surface hints: `Cursor task-dispatch adapter`, `Cursor MCP route-guard adapter`, `Claude adapter envelopes`
- Recommendation: Have Cursor adapters invoke the neutral cores directly and own only Cursor input/output translation, or add a tested neutral adapter protocol so Claude output shape is not the implicit cross-runtime API.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | fail | Prior traceability failures remain active; maintainability review additionally found that the stated independent ownership boundary has five cross-skill imports. |
| `checklist_evidence` | fail | Prior evidence gaps remain active; no new checklist adjudication was performed in this dimension. |
| `skill_agent` | fail | Five relocated adapters still import a system-spec-kit-owned helper. |
| `agent_cross_runtime` | partial | Neutral cores centralize policy, but two Cursor adapters use Claude adapters as their executable protocol boundary. |
| `feature_catalog_code` | pass | Unchanged from iteration 4; this dimension did not re-enter feature-catalog mapping. |
| `playbook_capability` | fail | Unchanged from iteration 4; this dimension did not re-enter playbook-path analysis. |

## Verdict

CONDITIONAL. One new P1 ownership-boundary failure requires remediation; one P2 cross-runtime coupling advisory remains. No P0 was found.

## Next Dimension

None. All configured dimensions are covered; proceed to reducer validation and synthesis.

Review verdict: CONDITIONAL
