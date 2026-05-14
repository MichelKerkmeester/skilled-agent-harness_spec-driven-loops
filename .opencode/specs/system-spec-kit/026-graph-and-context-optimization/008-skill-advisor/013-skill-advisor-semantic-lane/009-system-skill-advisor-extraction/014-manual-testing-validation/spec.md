---
title: "014 Manual Testing Validation"
description: "End-to-end manual testing of the Skill Advisor surface via cli-opencode runtime, validating 42+ scenarios across 9 categories using native MCP tool calls."
status: complete
completion_pct: 100
priority: high
assigned_to: cli-opencode
trigger_phrases:
  - "013/009/014 manual testing"
  - "advisor manual testing validation"
  - "skill advisor playbook run"
  - "014 manual testing"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/014-manual-testing-validation"
    last_updated_at: "2026-05-14T18:06:00Z"
    last_updated_by: "opencode-go/glm-5.1"
    recent_action: "Manual testing validation complete; 27 PASS, 0 FAIL, 15 INCONCLUSIVE, 0 GAP"
    next_safe_action: "Commit and update parent continuity"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "results/scenario-run-log.md"
    completion_pct: 100
---

# 014 Manual Testing Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## Summary

End-to-end manual testing of the post-013/009 Skill Advisor surface using the OpenCode runtime's native MCP tool calls. Validates all 42+ scenarios across 9 categories (native MCP tools, CLI hooks, compat/disable, operator H5, auto-update daemon, auto-indexing, lifecycle routing, scorer fusion, Python compat) using direct `mcp__system_skill_advisor__*` and `mcp__system_skill_advisor__skill_graph_*` invocations.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:scope -->
## Scope

- Run all 42 scenario files from the manual testing playbook
- Bucket each as PASS / FAIL / INCONCLUSIVE / GAP
- Validate all 8 advisor MCP tools are live-callable from OpenCode
- Verify cross-runtime hook behavior via file inspection
- Create missing scenarios for P0/P1 gaps (cap 5)
- Report final binding counts

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:out-of-scope -->
## Out of Scope

- Advisor production code changes (read-only)
- Spec-kit code or doc changes
- Root README or runtime config changes
- Tool-id / server-id / skill-id renames
- Branch creation, force-push, `--no-verify`

<!-- /ANCHOR:out-of-scope -->

---

<!-- ANCHOR:dependencies -->
## Dependencies

- Packet 011/012/013 shipped (advisor full extraction + doc alignment + spec-kit cleanup)
- Advisor vitest 291/291 (pre-D5b state confirmed)
- Advisor hook "live" status confirmed

<!-- /ANCHOR:dependencies -->