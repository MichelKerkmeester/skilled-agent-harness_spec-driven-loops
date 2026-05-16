---
title: "Tasks: Child 002 README marketing rewrite"
description: "Single-file task list."
trigger_phrases:
  - "029/002 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-system-code-graph-uplift/002-readme-marketing-rewrite"
    last_updated_at: "2026-05-16T11:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored task list"
    next_safe_action: "Execute T201 (frontmatter)"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000297"
      session_id: "029-002-tasks"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Tasks: Child 002

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T101 Read root README §1 for problem-hook pattern
- [x] T102 Read system-spec-kit README §1 for solution-breakdown pattern
- [x] T103 Confirm tool count is 11 and namespace is `mcp__mk_code_index__*`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Section authoring (system-code-graph/README.md)
- [ ] T201 Author frontmatter + H1 + tagline blockquote
- [ ] T202 Author TOC with double-dash anchors
- [ ] T203 Author §1 OVERVIEW: problem hook + solution breakdown + Key Statistics table + How This Compares + Cross-Skill Integration
- [ ] T204 Author §2 QUICK START: 5-step sequence (verify, configure, install, scan, query)
- [ ] T205 Author §3 FEATURES: per-tool capability summary with 11 tools
- [ ] T206 Author §4 STRUCTURE: directory tree + key file pointers
- [ ] T207 Author §5 CONFIGURATION: env vars + maintainer mode + per-runtime configs
- [ ] T208 Author §6 USAGE EXAMPLES: 3-4 concrete scenarios
- [ ] T209 Author §7 TROUBLESHOOTING: readiness blocked, parser quarantine, missing dist, MCP namespace
- [ ] T210 Author §8 FAQ
- [ ] T211 Author §9 RELATED DOCUMENTS
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T301 Banned-word grep clean: `leverage|empower|seamless|disrupt|harness|delve|realm|cutting-edge|game-changer|revolutionise`
- [ ] T302 Banned-phrase grep clean: `It's important to|Dive into|When it comes to|Let me be clear|In today's world`
- [ ] T303 Strict-validate child 002 exits 0
- [ ] T304 Strict-validate parent 029 exits 0
- [ ] T305 Fill implementation-summary.md with grep + validate evidence
- [ ] T306 Commit on main referencing 029/002
- [ ] T307 Push to origin/main
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 2 + 3 tasks marked `[x]`
- [ ] Strict-validate exit 0 on both packets
- [ ] Banned-word and banned-phrase greps clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent decisions**: `../spec.md` §5 (D1)
- **Research evidence**: `../research/research.md` §6.4, §11
<!-- /ANCHOR:cross-refs -->
