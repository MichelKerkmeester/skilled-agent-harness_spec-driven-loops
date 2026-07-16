---
title: "Feature Specification: Resolve the skill-advisor workspace root by walk-up to stop nested .opencode/.advisor-state [template:level_2/spec.md]"
description: "The skill advisor wrote its generation state to <cwd>/.opencode/skills/.advisor-state whenever it ran with a subdirectory as the working directory, creating stray nested .opencode trees across the repo. Resolve the workspace root deterministically from the module location instead of process.cwd()."
trigger_phrases:
  - "advisor workspace root"
  - "nested .opencode"
  - "advisor-state"
  - "skill-graph-generation"
  - "resolveWorkspaceRoot"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/008-advisor-workspace-root-resolution"
    last_updated_at: "2026-06-21T15:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixed resolver and cleaned strays"
    next_safe_action: "Recycle advisor daemon to activate"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-advisor-root-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Scope: full root-cause fix plus cleanup (operator-elected)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Resolve the skill-advisor workspace root by walk-up to stop nested .opencode/.advisor-state

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-21 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The skill advisor persists a `skill-graph-generation.json` under `.opencode/skills/.advisor-state/`. Both the startup scan and the daemon initialization resolved the target with `process.cwd()`. When an `opencode run` or advisor hook fired with a subdirectory as its working directory (for example the embedded `sk-design-md-generator/tool/`, which is its own npm project), the advisor wrote `<subdir>/.opencode/skills/.advisor-state/` and created a stray nested `.opencode` tree.

`resolveWorkspaceRoot()` already existed but its `import.meta.dirname` candidate used a fixed `../../../..` depth that is wrong at runtime: the compiled file lives one level deeper under `dist/mcp_server/`, so that candidate never matched and the function always fell back to `process.cwd()`. The result was 13 stray nested `.advisor-state` directories across the repo. They are gitignored (`**/.advisor-state/`), so they never entered version control, but they are disk clutter and a sign of an incorrect root resolution.

The purpose is to resolve the canonical workspace root deterministically so the advisor never writes into a subdirectory again.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Rewrite `resolveWorkspaceRoot()` in `advisor-server.ts` to walk up from the module location to the directory whose `.opencode/skills/system-skill-advisor` exists.
- Route the two `process.cwd()` write-path call sites (startup scan, daemon init) through `resolveWorkspaceRoot()`.
- Remove the pre-existing stray nested `.advisor-state` directories in the main tree.

**Out of scope:**
- `resolveSkillGraphSourceDir()`'s sibling `import.meta.dirname` depth (read path, does not create nesting), noted as a follow-up.
- Stray `.advisor-state` directories inside isolated git worktrees (left untouched to avoid interfering with other sessions).
- Any change to the gitignore (the `**/.advisor-state/` rule already prevents commits).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- R1: `resolveWorkspaceRoot()` MUST return the repo root regardless of the process working directory.
- R2: The resolution MUST be correct whether the module runs from source (`mcp_server/`) or compiled (`dist/mcp_server/`).
- R3: The advisor MUST NOT create any `.opencode` directory under a subdirectory when invoked from that subdirectory.
- R4: Existing canonical state at `<root>/.opencode/skills/.advisor-state/` MUST be preserved.
- R5: Cleanup MUST remove only `.advisor-state` leaves, never a parent `.opencode` that holds other content.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The resolver returns the repo root when invoked with a subdirectory cwd (verified).
- Typecheck of the advisor mcp_server passes. Dist rebuilds.
- Zero stray nested `.advisor-state` directories remain in the main tree.
- The canonical `.opencode/skills/.advisor-state/` is intact.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- The advisor is a shared daemon used by every session. The source fix is committed and dist rebuilt, but the running daemon keeps the old dist until a `/mcp` reconnect or a fresh session (the advisor launcher exits on child SIGTERM, so it is not transparent-recycle).
- A leftover stray `.opencode/skills` at a subdir cwd could have re-fooled a cwd-first resolver. Cleanup-first plus the walk-up (which requires `.opencode/skills/system-skill-advisor`, never present in a stray) removes that risk.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- Determinism: root resolution does not depend on cwd or invocation surface.
- Blast radius: the change is internal to root resolution. The public tool surface is unchanged.
- Reversibility: revert is a single-file `git revert` of the source change.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Compiled dist runs one directory deeper than source, handled by walk-up rather than a fixed depth.
- A subdirectory that is its own npm project (the embedded `tool/`), no longer mistaken for a workspace root.
- A subdirectory carrying a leftover stray `.opencode/skills`, where the walk-up requires `system-skill-advisor` under it, which a stray never has.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Low complexity: one function rewrite plus two call-site swaps (17 insertions, 10 deletions) and a leaf-only cleanup. Risk concentrates in the shared-daemon deploy, mitigated by the deterministic resolver and the typecheck/dist gate.
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None. Scope was settled with the operator (full root-cause fix plus cleanup).
<!-- /ANCHOR:questions -->
