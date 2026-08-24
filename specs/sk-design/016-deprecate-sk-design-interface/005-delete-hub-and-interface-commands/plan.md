---
title: "Implementation Plan: Delete the sk-design hub and interface commands"
description: "Verify the survivor is detached and green, then git-delete the sk-design judgment hub and the interface command namespace as a single scoped, operator-gated destructive change with a named rollback."
trigger_phrases:
  - "delete sk-design hub plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/005-delete-hub-and-interface-commands"
    last_updated_at: "2026-08-19T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored delete plan"
    next_safe_action: "Phase 006: repo-wide reference cleanup and reconcile"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/"
      - ".opencode/commands/interface/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Delete the sk-design hub and interface commands

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Remove the retired design *judgment* hub now that the extraction survivor is proven detached. The plan is deliberately narrow: confirm the extraction-before-deletion invariant holds (002–004 green, survivor tests pass, no reference escapes the survivor back into the hub), then delete `.opencode/skills/sk-design/` and `.opencode/commands/interface/` in one scoped git-tracked change. The reconcile of every *external* reference is explicitly deferred to phase 006 so this phase does exactly one reversible thing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- **Ready:** 002–004 landed and verified green — the survivor moved to a standalone root, rewired, and folded its condensed design-knowledge layer; backend suite 173/173; Class-S PASS on the new root; zero `../shared` / `skills/sk-design/` refs escape the survivor.
- **Done:** `.opencode/skills/sk-design/` absent; `.opencode/commands/interface/` absent; the `design-reference` capability still resolves via its `/design:` rebind; the deletion is a scoped diff that touches no non-sk-design, non-interface file; rollback named.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Aspect | Value |
|--------|-------|
| **Deleted (hub)** | `.opencode/skills/sk-design/` — parent hub + `sk-design-interface/`, `foundations`/`motion`/`audit` design modes, `shared/`, `benchmark/`, `styles/` remnants |
| **Deleted (commands)** | `.opencode/commands/interface/` — `design.md`, `design-reference.md`, and the auto/confirm/presentation assets |
| **Preserved** | the standalone `sk-design-md-generator/` survivor + its `styles/` corpus (out of scope; must remain intact) |
| **Rebind already done** | `/interface:design-reference` → `/design:design-reference` (rebound in a prior phase, before this delete) |
| **Mutation class** | destructive — operator-gated; git-tracked, restorable from HEAD until committed |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Re-confirm the extraction-before-deletion invariant before removing anything: survivor present at the standalone root, backend suite green, Class-S PASS, and a grep proving no reference inside the survivor still points at `skills/sk-design/` or `../shared`.

### Phase 2: Implementation

Delete the two trees (`git rm -r` semantics; the working tree already reflects the removal). Confirm the deletion is scoped — only `.opencode/skills/sk-design/**` and `.opencode/commands/interface/**` are removed, no adjacent path.

### Phase 3: Verification

`test -d` both deleted roots → absent. Confirm the survivor is untouched and the `/design:design-reference` rebind resolves. Confirm the scoped diff contains no concurrent unrelated work.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Real command evidence: `test -d .opencode/skills/sk-design` and `test -d .opencode/commands/interface` both fail (absent); the survivor backend suite still passes 173/173; a scoped `git status --porcelain` shows the deletions are confined to the two in-scope trees; a grep from the survivor for `skills/sk-design/` returns nothing (the survivor never depended on the hub after 004).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Upstream: 002 (extract), 003 (rewire + standalone identity), 004 (fold condensed design-knowledge). The delete is safe ONLY after all three are green.
- Downstream: 006 (repo-wide reference cleanup + reconcile) — every *external* reference to the deleted hub is inventoried and fixed there, not here.
- Tools: git (tracked deletion + rollback), Grep/Read for the invariant checks.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Uncommitted and fully reversible: `git checkout -- .opencode/skills/sk-design .opencode/commands/interface` restores both trees from HEAD. Because the delete is a pure removal with no rewrite of adjacent files, reversing it returns the repo to its post-004 state (hub present, survivor already standalone). Nothing is committed or pushed until the operator approves.
<!-- /ANCHOR:rollback -->
