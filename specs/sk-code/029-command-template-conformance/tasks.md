---
title: "Tasks: Command Template Conformance"
description: "Ordered tasks: enumerate the real command files, audit each against the contract, fix the confirmed defects, verify through every runtime path."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "command template conformance tasks"
  - "sk-create-command audit tasks"
importance_tier: "high"
contextType: "tasks"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-code/029-command-template-conformance"
    last_updated_at: "2026-08-29T09:43:41Z"
    last_updated_by: "claude"
    recent_action: "Completed the audit tasks; both fixes verified through opencode, claude, cursor paths"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/commands/design/extract.md"
      - ".opencode/commands/rewrite/response.md"
      - ".opencode/commands/prompt/improve.md"
      - ".opencode/commands/rewrite/explain-visually.md"
      - ".opencode/commands/rewrite/response-by-external-agent.md"
    session_dedup:
      fingerprint: "sha256:90ca805a95486aed52b8496c450f9e01e5c26e5c10e2f2a36319b3bee518defc"
      session_id: "2026-08-29-sk-code-029"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Command Template Conformance

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` completed and evidenced; `[~]` explicitly deferred with a recorded reason and owner; `[ ]` pending.
- `T-NNN` identifiers are stable within this packet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Enumerate the real command files in scope and confirm the symlink topology. Evidence: 5 real files under `.opencode/commands/{design,rewrite,prompt}`; `.claude/commands/` and `.cursor/commands/` confirmed as symlinks into `.opencode/commands/`; `.codex`, `.pi`, `.devin` confirmed to have no commands directory in this scope.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Audit `design/extract.md` against the mandatory-gate rule. Evidence: `argument-hint` declared a required `<live-url>` with no gate present, violating `sk-create-command` Step 7.
- [x] T-003 Fix `design/extract.md`. Evidence: added a MANDATORY INPUT GATE section binding `live_url`, `output_dir`, `execution_mode`, modelled on `prompt/improve.md`'s gate shape.
- [x] T-004 Audit `rewrite/response.md` against the `allowed-tools` expectation. Evidence: no `allowed-tools` key present, so the command inherited an unrestricted tool set despite being a display-only, file-untouching command; both siblings declare a scoped set.
- [x] T-005 Fix `rewrite/response.md`. Evidence: added `allowed-tools: Read` to the frontmatter.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-006 Check candidate findings against the contract text before treating them as defects. Evidence: `design/extract.md`'s and `prompt/improve.md`'s shifted section numbering both carry the full six-section router shape, with `design/extract.md` inserting one extra `## 4. VISIBLE OUTPUT CONTRACT` section — conformant, not a defect. The three `rewrite/*` commands use a PURPOSE/CONTRACT/INSTRUCTIONS/EXAMPLES/NOTES vocabulary; `sk-create-command` Step 8 mandates fixed vocabulary only for routers, and these are not routers — conformant, left as-is.
- [x] T-007 Verify both fixes are visible through every runtime path. Evidence: the edited `design/extract.md` and `rewrite/response.md` content confirmed reachable through `.opencode/commands/`, `.claude/commands/`, and `.cursor/commands/`, since the latter two are symlinks into the former.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- `design/extract.md` has a mandatory input gate; `rewrite/response.md` declares `allowed-tools: Read`.
- Every other candidate finding was checked against the contract text and confirmed conformant, not silently assumed or silently dropped.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Approach and rollback: `plan.md`.
- Contract: `sk-doc/sk-create-command`.
<!-- /ANCHOR:cross-refs -->
