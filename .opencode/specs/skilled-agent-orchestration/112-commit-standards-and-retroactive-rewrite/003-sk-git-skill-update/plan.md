---
title: "Phase 003 Plan: sk-git Skill Update"
description: "Apply Phase 002 standards into sk-git skill content; mirror byte-identically across 4 runtime dirs."
trigger_phrases:
  - "112-sk-git-skill-update plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/112-commit-standards-and-retroactive-rewrite/003-sk-git-skill-update"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored phase 003 plan"
    next_safe_action: "Wait for phase 002 close, then begin runtime mirror diff baseline"
    blockers:
      - "Phase 002 must close with 7 ADRs Accepted"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-plan-2026-05-16"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 003 — sk-git Skill Update

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Mechanical content authoring. Edit `.opencode/skills/sk-git/` to match Phase 002 outputs, then `rsync` byte-identically to `.claude/`, `.codex/`, `.gemini/` mirrors. Refresh GIT-007 manual test if ADR-003 shifted trailer policy.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Acceptance |
|------|-------|------------|
| G1 | `.opencode/skills/sk-git/SKILL.md` §3 reflects all 7 Phase 002 ADRs | Manual review against decision-record |
| G2 | `commit_message_template.md` has 5+ worked examples | Count |
| G3 | `diff -r` between .opencode/ and each of .claude/, .codex/, .gemini/ is empty | Byte-identical |
| G4 | GIT-007 manual test passes against new trailer policy | Manual run |
| G5 | `validate.sh --strict` exits 0 | Validator passes |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`.opencode/` is the canonical source. Other runtime dirs receive byte-identical copies (per `feedback_new_agent_mirror_all_runtimes`). Mirrors must be real copies, not symlinks. Use `rsync -a --delete` for the copy.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Stage 1 — Pre-flight
- `diff -r .opencode/skills/sk-git/ .claude/skills/sk-git/` (and same for codex/gemini) to surface pre-existing drift
- Read Phase 002 outputs (`commit-standards.md`, `derivation-heuristics.md`, `decision-record.md`)

### Stage 2 — Edit `.opencode/skills/sk-git/`
- SKILL.md §3: type priority + scope derivation + packet-ID + trailer policy + special cases + length caps
- `assets/commit_message_template.md`: 5+ worked examples
- `references/commit_workflows.md`: link to derivation-heuristics
- `manual_testing_playbook/GIT-007-*`: update if trailer policy shifted

### Stage 3 — Sync mirrors
- `rsync -a --delete .opencode/skills/sk-git/ .claude/skills/sk-git/`
- Same for codex and gemini
- Verify mirrors are real copies, not symlinks

### Stage 4 — Verify
- `diff -r` each mirror against .opencode → empty
- Run GIT-007 manual scenario; record outcome
- Optional: decide if sk-git changelog bump is warranted
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Manual GIT-007 trailer scenario from the sk-git playbook. `diff -r` is the parity gate. No new automated tests added in this phase.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 002 outputs (commit-standards, derivation-heuristics, decision-record)
- `rsync` (macOS default)
- Read access to sk-git in all 4 runtime dirs
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git checkout -- .opencode/skills/sk-git .claude/skills/sk-git .codex/skills/sk-git .gemini/skills/sk-git` restores pre-phase state from main.
<!-- /ANCHOR:rollback -->
