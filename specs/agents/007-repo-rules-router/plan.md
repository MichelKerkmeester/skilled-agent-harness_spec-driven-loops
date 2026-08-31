---
title: "Implementation Plan: Repo Rules Router and Thinking-Discipline Rule Snippets"
description: "Create a root REPO RULES.md router plus six on-demand rule snippets under /repo-rules, expanding the compressed operating-discipline rows in AGENTS.md without adding a line to the always-loaded surface."
trigger_phrases:
  - "repo rules plan"
  - "rule snippet architecture"
  - "router precedence ladder"
  - "on-demand doctrine"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Repo Rules Router and Thinking-Discipline Rule Snippets

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown doctrine; no executable surface |
| **Framework** | `AGENTS.md` behavior framework (§3 pointer at `AGENTS.md:153`) |
| **Storage** | Flat files: root `REPO RULES.md` + `repo-rules/*.md` |
| **Testing** | Link resolution, git-ignore check, `validate.sh --strict` on the packet |

### Overview
`AGENTS.md` already contains the correct rules; it lacks the room to say how to apply them, because it loads on every turn. The approach is a two-tier split that mirrors how a router works elsewhere in this repo: a thin always-reachable router that maps *the action you are about to take* to exactly one file, and thick leaf documents that load only when their trigger fires. Nothing is moved out of `AGENTS.md` — the rows stay authoritative and the leaves expand them — so there is no window where a rule lives in neither place.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` §2-§3)
- [x] Success criteria measurable (`spec.md` §5, `acceptance-criteria.md`)
- [x] Dependency identified: `AGENTS.md:153` pointer confirmed present and unmodified

### Definition of Done
- [x] All acceptance criteria met (`acceptance-criteria.md` all rows `Met`)
- [x] Every router link resolves to an existing file
- [x] Docs synchronized (spec / plan / tasks / acceptance-criteria / implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Router + leaves. One thin dispatcher, six independent leaf documents, no shared state and no inheritance between leaves.

### Key Components
- **`AGENTS.md` §3 (unmodified)**: the entry hook. Already binds the runtime to `REPO RULES.md`.
- **`REPO RULES.md` (router)**: loading protocol, precedence ladder, trigger table, index, scope statement. Holds no rule text — that is what keeps a rule change to one file.
- **`repo-rules/*.md` (six leaves)**: each one `Fires when` → `The rule` (one sentence) → expanded body → `Self-check`. Independently readable.

### Data Flow
```
turn begins
   │
   ▼
AGENTS.md §3 ──► "REPO RULES.md, when the repository has one"
   │
   ▼
REPO RULES.md ──► match on THE ACTION about to be taken
   │                 (not on the topic of the request)
   ├── no match ────────────► AGENTS.md alone governs; stop
   ├── one match ───────────► load that leaf
   └── two matches ─────────► load both; more specific wins on conflict
   │
   ▼
leaf: Fires when → The rule → body → Self-check
   │
   ▼
precedence check: AGENTS.md hard blocker > live operator instruction > leaf > judgment
```

### Trigger design
Triggers are written on the **action about to be taken**, not the subject matter, because an action is the one thing an agent can match against its own next tool call. "You are about to delete, overwrite, migrate" is checkable; "this is a risky task" is not.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix. The inventory below is retained because this packet creates a file that an existing instruction already points at, which is a producer/consumer relationship worth proving rather than assuming.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `AGENTS.md:153` | Consumer — instructs runtimes to apply `REPO RULES.md` | unchanged | `grep -n "REPO RULES" AGENTS.md` → single hit at 153, wording already conditional |
| `.opencode/skills/sk-code/sk-code-obsidian/references/*.md` | Mentions `REPO RULES.md` of a *different* repository (the Obsidian plugin repo) | not a consumer | `grep -rn "REPO RULES" .opencode/` → 2 hits, both scoped to `<plugin-repo>` |
| `specs/sk-code/007-.../plan.md`, `tasks.md` | Historical references to another repo's file | not a consumer | same grep; both under `specs/`, both third-party-scoped |
| `.gitignore` | Could silently exclude the new paths | unchanged | `git check-ignore -v` on the new paths → exit 1 (no match) |

Required inventories:
- Consumers of the name: `grep -rn "REPO RULES" . --include=*.md`
- Router link integrity: extract every `repo-rules/*.md` href from the router and test each with `[ -f ]`
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns the numbered task state (T001-T018); the phases below say what each stage has to establish before the next one can start.

### Phase 1: Analysis
- [x] Read `AGENTS.md` end to end and outline all ten sections
- [x] Classify every existing `REPO RULES.md` reference as a real consumer or a third-party mention, which is what settles the router's location
- [x] Select the compressed operating-discipline rows worth expanding, subtracting everything skill-, workflow-, spec- and dispatch-related

### Phase 2: Authoring
- [x] Write the router against the selection decision: loading protocol, precedence ladder, trigger table, index, scope statement
- [x] Write the six leaves to one shape — `Fires when`, `The rule`, body, `Self-check`
- [x] Cross-link composing rules by filename, never by restating the other rule

### Phase 3: Verification
- [x] Resolve every router link against the filesystem; confirm nothing is git-ignored
- [x] Negative control on the exclusion rule: sweep for `skill`, `workflow`, `spec folder`, `mcp`, `advisor`, `dispatch`, fix what the sweep finds, re-sweep clean
- [x] Count the four required sections in each leaf
- [x] `validate.sh <folder> --strict`, requiring an explicit `RESULT: PASSED`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Link integrity | Every `repo-rules/*.md` href in the router resolves | `grep -o` + `[ -f ]` loop |
| Visibility | New paths are not git-ignored | `git check-ignore -v` |
| Exclusion | No skill/workflow/spec-mechanics content leaked into a leaf | `grep -in` for `skill`, `workflow`, `spec folder`, `agent`, `mcp` across `repo-rules/` |
| Packet validation | Spec-doc contract | `validate.sh <folder> --strict`, require `RESULT: PASSED` |
| Manual | Each leaf readable standalone; each has all four required sections | Read-through against REQ-006 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `AGENTS.md` §3 pointer | Internal | Green — verified at `AGENTS.md:153` | Rules become unreachable; they would need an explicit load instruction elsewhere |
| `system-spec-kit` `create.sh` / `validate.sh` | Internal tooling | Green | Packet docs would need hand-scaffolding from the templates |
| Spec Kit Memory MCP / Skill Advisor MCP | Internal tooling | **Red — both timed out this session** | Gate 1 trigger matching and post-save indexing unavailable; packet docs still author and validate normally |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the rule set proves to contradict `AGENTS.md`, or the split is judged not worth the indirection.
- **Procedure**: `git rm "REPO RULES.md" && git rm -r repo-rules/`. Additive-only change to seven previously non-existent paths, so removal restores the exact prior state — `AGENTS.md` §3's "when the repository has one" simply stops matching again.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Analyze AGENTS.md, select rows) ──► Phase 2 (Author router + 6 leaves) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Analyze | None | Author |
| Author router | Analyze | Verify |
| Author leaves | Analyze | Verify |
| Verify | Author router, Author leaves | None |

The router and the leaves are authored against the same selection decision, so the trigger table and the `Fires when` blocks cannot drift apart.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Analyze `AGENTS.md`, select expandable rows | Med | ~30 min |
| Author router + 6 leaves (~900 lines) | Med | ~2 hours |
| Verification + packet docs | Low | ~45 min |
| **Total** | | **~3-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes — additive markdown only, no backup needed
- [x] No feature flag — the rules are inert until an action matches a trigger
- [x] No monitoring — no runtime surface

### Rollback Procedure
1. `git rm "REPO RULES.md"` and `git rm -r repo-rules/`
2. Commit; `AGENTS.md` needs no edit because its pointer is conditional
3. Verify with `grep -rn "REPO RULES" . --include=*.md` — only the pointer and the two third-party-scoped `sk-code` mentions remain
4. No stakeholder notification — repository-internal doctrine

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — nothing persisted, nothing generated, nothing published
<!-- /ANCHOR:enhanced-rollback -->

---
