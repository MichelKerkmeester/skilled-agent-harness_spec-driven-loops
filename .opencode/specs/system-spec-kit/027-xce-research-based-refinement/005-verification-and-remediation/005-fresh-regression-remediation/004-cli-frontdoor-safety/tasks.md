---
title: "Tasks: CLI Front-Door Safety Remediation"
description: "One task per deep-review finding in this sub-phase (6 total): finding id + file:line + registry recommendation + Round-2 status tag. Scaffold only."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/tasks.md"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded sub-phase tasks from fresh-regression-75 registry"
    next_safe_action: "Operator review; then implement fixes per tasks.md"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CLI Front-Door Safety Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] 004-S1 Capture the subsystem test/validation baseline.
- [ ] 004-S2 Re-open each finding's cited file:line to confirm real vs refuted before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

One task per finding (id + file:line + registry recommendation + Round-2 status tag):

- [ ] 004-T001 · `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:753` — Before probing or connecting, centralize a client-side IPC perimeter check: lstat the final socket directory and reject symlinks, require current uid ownership when process.getuid exists, reject group _[downgraded→P2]_
- [ ] 004-T002 · `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts:353` — Carry a separate promptTime boolean out of parseCliArgs/default env detection and reject mutation tools before callTool when promptTime is true, regardless of --trusted or trusted env. Add regression  _[refuted-Round2 → harden-anyway]_
- [ ] 004-T003 · `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:18` — Normalize the bridge tool name before policy checks using the same snake/kebab/camel alias map as code-index-cli, or block by canonical CLI tool definition after alias resolution. Add tests for codeGr _[downgraded→P2]_
- [ ] 004-T004 · `.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:924` — Before probing or connecting, validate the socket directory and socket path with lstat/stat: current uid ownership, not group/world-writable, no symlinked socket path, and allowed root containment. Re _[downgraded→P2]_
- [ ] 004-T005 · `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:982` — Make spec-memory mirror the other two CLIs: either add `|| isErrorPayload(payload)` to `extractToolPayload` (skill-advisor style) or change line 982 to `return isError || isErrorPayload(payload) ? EXI _[downgraded→P2]_
- [ ] 004-T006 · `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts:428` — Reject inline values for --trusted/--maintainer, or parse --trusted=true|false with the same boolean parser used for --warm-only. Add tests proving --trusted=false and --trusted=0 do not satisfy the m _[P2]_
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] 004-V1 vitest + shell exit-code assertions across the three CLIs.
- [ ] 004-V2 Whole-gate delta reported (no regressions).
- [ ] 004-V3 Update each finding's status in the registry (fixed/refuted).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 6 findings resolved (fixed or refuted-with-reason); verification gate green. No fixes applied in this scaffold.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Registry: `../../review/fresh-regression-75/deep-review-findings-registry.json`
- Coverage: `../fix-coverage.json`
<!-- /ANCHOR:cross-refs -->
