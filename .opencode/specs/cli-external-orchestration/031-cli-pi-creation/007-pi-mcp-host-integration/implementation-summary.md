---
title: "Implementation Summary: Pi MCP-host integration"
description: "Pre-work closeout for a still-Blocked phase: a live docs re-fetch found pi-mcp-extension now documents stdio transport, narrowing but not resolving the primary go/no-go gate, which requires installing the package - out of this planning phase's own scope."
trigger_phrases:
  - "pi mcp host integration summary"
  - "pi-mcp-extension implementation status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/007-pi-mcp-host-integration"
    last_updated_at: "2026-07-27T10:22:00Z"
    last_updated_by: "claude-code"
    recent_action: "Docs re-fetched live; pre-work closed out; phase stays Blocked"
    next_safe_action: "Commit as Blocked; phase 008 proceeds independently (no functional coupling)"
    blockers: ["Installing pi-mcp-extension and live-confirming its now-documented stdio config is out of this phase's own scope; deferred to a future execution phase"]
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-phase-007-planning"
      parent_session_id: null
    completion_pct: 60
    open_questions: ["Does the now-documented stdio config actually connect live? - requires installing pi-mcp-extension, deferred", "Which mechanism gives a safe Tier 2 opt-in: project/global split, or a gitignored project-local file?"]
    answered_questions: ["pi-mcp-extension v1.5.0 (author irahardianto) now documents a stdio transport shape, materially updating this phase's original authoring-time premise", "No per-tool permission/deny field exists in pi-mcp-extension's documented config schema", ".mcp.json's 5 native servers and code_mode's hardcoded Node path re-confirmed live, unchanged from spec.md's description"]
---
# Implementation Summary: Pi MCP-host integration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-pi-mcp-host-integration |
| **Completed** | N/A — phase stays Blocked, see Known Limitations |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase plans how this repo's 5 native MCP servers (plus 10 external UTCP manuals reached transitively through `code_mode`) translate into Pi's `.pi/mcp.json`, via the third-party `pi-mcp-extension` package. Unlike phases 004-006, this phase's own primary deliverable is a genuine live go/no-go verification — REQ-002 asks whether pi-mcp-extension's stdio transport actually works — and that verification requires installing new third-party software, which this phase's own spec.md explicitly puts out of scope ("Actually running `pi install`... this phase is planning only, per the packet-wide hard constraint"). This closeout therefore does NOT flip the phase to Complete. It does everything achievable without crossing that line: re-verifies every fact this phase's design rests on, and found one materially significant thing worth surfacing.

### A live docs re-fetch surfaced a real update

I re-fetched `https://pi.dev/packages/pi-mcp-extension` directly (a read-only WebFetch, not a mutation) to reconfirm the config shape this phase's whole risk framing depends on. The page now documents an explicit stdio config example (`"transport": "stdio"`, plus a `command`/`args`/`env` variant using `npx`) alongside the remote `streamable-http` example this phase was originally authored against. This is a genuine, material update to the phase's central premise: at authoring time, "the only documented example is remote streamable-http" was the whole reason REQ-002 was framed as an existential go/no-go question. Now that stdio is documented, REQ-002 narrows to a smaller, more concrete question — does the documented config actually connect in a live session — which still needs a live install to answer, but is a meaningfully smaller gap than the phase was originally scoped against.

### Source-tree re-verification

Direct reads of `.mcp.json` confirmed all 5 native servers (`sequential_thinking`, `mk-spec-memory`, `mk_skill_advisor`, `mk_code_index`, `code_mode`) exist exactly as `spec.md` describes, including `code_mode`'s hardcoded absolute Node path (`/Users/michelkerkmeester/.nvm/versions/node/v24.9.0/bin/node`, REQ-008's carried-forward portability risk) and `mk_skill_advisor`'s mutation-tool names (`advisor_rebuild`/`skill_graph_scan`/`skill_graph_propagate_enhances`, named verbatim in its own env-note comment). One additional finding worth flagging: `.mcp.json` itself carries a literal `"trusted"` value for `MK_SKILL_ADVISOR_TRUST_DEFAULT` today — a pre-existing Claude/OpenCode-side pattern, out of this phase's scope to fix, but worth a caution note for whoever eventually authors the real `.pi/mcp.json` translation (CHK-031).

### Files Changed

No repository files were changed by this phase beyond its own spec folder. No `.pi/mcp.json` was authored, no package was installed.

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Modified | Problem Statement, Risks table, and Open Questions corrected to reflect the live docs re-fetch finding; dependency-status rows refreshed (phases 001/006 now Complete) |
| `plan.md` | Modified | Overview and dependency table refreshed with the same finding; Definition of Ready/Done checked off where achievable |
| `tasks.md`, `checklist.md` | Modified | Pre-work items (docs re-fetch, source-tree re-reads, policy decisions not requiring live install) marked `[x]` with evidence; every install-dependent item marked `[B]` with an explicit deferred reason |
| `implementation-summary.md` | Created | This document |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I did not dispatch LUNA or GLM-5.2 for this phase: there is no code diff, and the phase's own Hard Constraint forbids the one action (installing pi-mcp-extension) that would produce one. I did the achievable pre-work directly — a live WebFetch of the package docs, direct reads of `.mcp.json`, and a re-check of the phases-001/006 dependency status — and made the deliberate call not to cross the install line even though the goal driving this run is "execute autonomously." Crossing it would have violated this phase's own explicitly-stated scope boundary, which the packet's own governance treats as frozen (`PLAN-WORKFLOW LOCK`-equivalent discipline: a named scope boundary is not something to route around because a broader directive says "keep going").
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Do not install pi-mcp-extension, even to resolve the phase's own primary open question | `spec.md`'s Out of Scope section states this as a Hard Constraint, not a soft preference, identically to how phases 004-006 forbade installing/writing their own respective future-execution artifacts |
| Set Status to "Blocked", not "Complete" | Unlike phases 004-006 (whose planning-only scope was fully satisfiable without any install), this phase's central deliverable — a live yes/no on stdio transport — is genuinely unresolved. Marking it "Complete" would misrepresent an open P0 gate as closed |
| Still re-fetch pi-mcp-extension's docs live, even though the phase can't act on a changed answer this session | Docs can drift, and this phase's own risk log already anticipated that ("re-verify rather than trusting this snapshot indefinitely"). The re-fetch was cheap and it surfaced a genuinely material update — confirming the "spend lavishly where confirmation is cheap" principle paid off here |
| Mark every install-dependent checklist/task item `[B]` with an explicit `[DEFERRED: ...]` reason rather than leaving them `[ ]` or force-completing them | States the truth plainly: out of scope by design, not stalled and not falsely verified |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Live WebFetch of `https://pi.dev/packages/pi-mcp-extension` | PASS — v1.5.0, author `irahardianto`; found a material update (stdio config now documented) vs. this phase's authoring-time snapshot |
| `.mcp.json` direct read: 5 native servers present, `code_mode`'s hardcoded Node path, `mk_skill_advisor`'s mutation-tool names | PASS — all match `spec.md`'s description exactly, zero drift |
| `001-pi-contract-pin` and `006-pi-agent-bridge` dependency status re-confirmed | PASS — both Complete |
| `.pi/` and `.claude/agents/` untouched by this closeout | PASS — `git status --porcelain` on both returns nothing |
| `validate.sh --strict` against this phase folder | Run at commit time via the main-tree round-trip pattern (worktree lacks the toolchain); result recorded in the commit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **REQ-002, this phase's PRIMARY go/no-go gate, remains unresolved.** The live docs re-fetch narrowed the question (stdio IS documented now) but did not answer whether the documented config actually connects in a real Pi session. Resolving it requires installing `pi-mcp-extension`, which is explicitly out of this phase's own scope. A future execution phase must run the single-entry `sequential_thinking` stdio probe (`tasks.md` T003-T005) before any of the rest of this phase's design can be trusted as final.
2. **No `.pi/mcp.json` file exists**, and none of the deny-by-default policy design has been enforced in a real config. The Tier 1/Tier 2 split and the `call_tool_chain` policy decision are designed (`plan.md` §3, `tasks.md` T011/T012) but not yet applied.
3. **The Tier 2 mechanism question (global `~/.pi/agent/mcp.json` vs. a project-local gitignored file) is unresolved** — it depends on `pi-mcp-extension`'s actual project/global override semantics, which are unconfirmed without a live install.
4. **`.mcp.json` itself carries a pre-existing pattern worth a caution note**: a literal `"trusted"` value for `MK_SKILL_ADVISOR_TRUST_DEFAULT`. Not this phase's bug to fix, but a real thing whoever authors the eventual `.pi/mcp.json` translation should not blindly copy forward.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
