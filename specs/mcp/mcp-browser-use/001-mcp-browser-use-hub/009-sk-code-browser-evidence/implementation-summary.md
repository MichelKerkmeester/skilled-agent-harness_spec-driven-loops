---
title: "Implementation Summary"
description: "sk-code's sk-code-frontend verification row names the mcp-browser-use hub, so a changed page is opened in whichever browser mode the user has installed. Router 2.3.24.0, sk-code 3.12.2.0."
trigger_phrases:
  - "sk code browser evidence implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/009-sk-code-browser-evidence"
    last_updated_at: "2026-11-22T21:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Validation passes for 009 and the parent after the tsx link and repair"
    next_safe_action: "Operator decides on commit and push. A live browser run of the row is open"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-22-sk-code-browser-evidence"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-sk-code-browser-evidence |
| **Status** | Complete |
| **Completed** | 2026-11-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Sk-code's frontend verification row now names the `mcp-browser-use` hub. When an agent changes a page, the row asks it to open that page in whichever browser mode the user has installed (Chrome DevTools, Aside or Bladebro), and to record a screenshot at the affected viewport and the console result. If no mode is installed, the row asks for NOT RUN with the reason. Before this change, the row asked for "the page rendered in a browser" and named no tool, so nothing pointed an agent at the browser tooling this repository ships.

### Phase 9: sk-code-browser-evidence

The agent uses a browser session it owns, and opens the user's signed-in browser only when the user asks. The row names the hub, not one mode, because each user may run a different browser mode. The change is a verification step, and routing stays as it was.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/ROUTER.md` | Modified | Section 5 `sk-code-frontend` row names the hub; version 2.3.23.0 to 2.3.24.0 |
| `.skilled/skills/sk-code/SKILL.md` | Modified | Version 3.12.1.0 to 3.12.2.0 |
| `.skilled/skills/sk-code/description.json` | Modified | Version 3.12.1.0 to 3.12.2.0 |
| `.skilled/skills/sk-code/mode-registry.json` | Modified | Version 3.12.1.0 to 3.12.2.0 |
| `.skilled/skills/sk-code/hub-router.json` | Modified | Version 3.12.1.0 to 3.12.2.0 |
| `.skilled/skills/sk-code/changelog/v3.12.2.0.md` | Created | Changelog entry for 3.12.2.0 |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md` | Modified | Phase map row 9 set to Complete; handoff row 008 to 009 |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md` | Modified | Binding row for 009 |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/009-sk-code-browser-evidence/` | Created | This packet |
### Follow-ups, same day

The operator asked for the four follow-ups this packet first left out.

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/SKILL.md` (3.12.3.0), `mode-registry.json`, `hub-router.json`, `description.json`, `changelog/v3.12.3.0.md` | Modified, created | Pure browser inspection goes to the `mcp-browser-use` hub, which routes to its Chrome DevTools, Aside or Bladebro mode |
| `.skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md` (1.0.6.0) | Modified | A claimed LCP, CLS or INP improvement cites a baseline and a current number measured through any browser mode, or says NOT MEASURED with the reason |
| `.skilled/skills/cli-orca/` `ROUTER.md` (1.0.4.0), `SKILL.md` (0.1.11.0), `README.md`, `references/mutation-and-browser-boundaries.md`, three feature-catalog files, `changelog/v0.1.11.0.md` | Modified, created | Both `FOREIGN_OWNERS` browser handoffs name `mcp-browser-use`; prose names all three modes, Bladebro included |
| `local-webflow/references/` (8 files, outside this repository, in the site repository the skill is linked from) | Modified | 11 dead `mcp-tooling/mcp-chrome-devtools` paths now read `mcp-browser-use/mcp-chrome-devtools`; each file's version bumped |

Checks for the follow-ups: the sk-code hub check printed `OK: parent-skill-check — all hard invariants passed, 0 warnings`; router-sync printed `5/5 checks passed`. In cli-orca, a grep for the old mode names returned no lines, the playbook validator exited 0 with `violations=0`, the catalog validator printed `PASS: 0 violations` and the link checker reported `failures=0`. In local-webflow no `mcp-tooling/mcp-chrome-devtools` path remains, and each rewritten path resolves from the skill's linked location in this repository.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Nothing was committed or pushed. The checks ran in this order: the parent-skill checker, the router sync verifier, strict validation of this packet, the recursive strict run on the parent, then the goal checker. The before state in `spec.md`'s Measured Behavior block was read from HEAD, and the after state was read from the worktree files.

The first strict validation failed on generated metadata. `repair-derived.cjs` could not run, because `node_modules/tsx` was missing in this worktree. The unblocking step was a symlink from `.skilled/skills/system-spec-kit/node_modules/tsx` to worktree 514's copy, not an install. Then `repair-derived.cjs --apply` ran on this packet and on the parent. Both now validate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Name the hub, not one browser mode | Each user may have a different browser mode installed. The operator decided this on 2026-11-22, which overrides an unverified reviewer suggestion to pin the Chrome DevTools mode |
| Report NOT RUN with a reason when no browser run happens | A missing browser run then shows in the report, and is never skipped silently |
| Use an agent-owned browser session, and open the signed-in browser only on request | Opening the user's signed-in browser without asking would expose their session |
| Leave routing, advisor signals and graph edges alone | The change is a verification step. The earlier advisor replay recommended the same route, carried as evidence below |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `parent-skill-check.cjs .skilled/skills/sk-code` | `OK: parent-skill-check — all hard invariants passed, 0 warnings`, exit 0 |
| `verify-router-sync.cjs` | `router-sync: 5/5 checks passed`, exit 0 |
| `rg -c 'mcp-browser-use' .skilled/skills/sk-code/ROUTER.md` | 1 |
| Advisor replay, "verify the css change on the pricing page renders correctly" | Carried from the earlier run: local-webflow, then sk-code. Not re-run here. The rerun exited 69, because `system-skill-advisor` has no dist build in this worktree. The build was not run |
| `validate.sh` on this packet, `--strict` | `RESULT: PASSED`, `Summary: Errors: 0  Warnings: 0`, exit 0. A stale fingerprint from the final doc edits was cleared by `repair-derived.cjs --apply`. The four frontmatter narrative warnings were cleared by shortening `recent_action` and `next_safe_action` |
| `validate.sh` on the parent, `--recursive --strict` | `RESULT: PASSED` for all 10 folders (the parent and 001 to 009), exit 0. Warnings remain only in 001-research and 006-verification, outside this packet |
| `check-goal.cjs` on this packet and on the parent | `RESULT: PASSED (5/5 checks)` on each, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Validation depends on a symlinked `tsx`.** `.skilled/skills/system-spec-kit/node_modules/tsx` points at worktree 514's copy. A clean checkout needs its own `tsx` before `repair-derived.cjs` and the strict validations can run.
2. **No live browser run.** The new row's browser steps have not run on a real page. Workaround: run the row once on a changed page through an installed browser mode, and record the result.
3. **Advisor replay not re-run.** Workaround: build the `system-skill-advisor` runtime, then replay the prompt named in the Verification table.
<!-- /ANCHOR:limitations -->

---
