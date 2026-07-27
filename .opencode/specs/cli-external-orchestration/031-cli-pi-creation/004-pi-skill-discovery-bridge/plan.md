---
title: "Implementation Plan: Pi skill-discovery bridge"
description: "Plan for designing a .pi/settings.json skills-discovery configuration and a live-verification protocol that determines whether Pi's recursive SKILL.md discovery respects this repo's 12-hub single-advisor-identity architecture or flattens it."
trigger_phrases: ["pi skill discovery plan", "pi settings.json skills design"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/004-pi-skill-discovery-bridge"
    last_updated_at: "2026-07-27T08:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored plan.md for phase 004 (planning only)"
    next_safe_action: "Author tasks.md, checklist.md"
    blockers: ["depends on 003-cli-pi-skill-packet landing first", "depends on 001-pi-contract-pin's live findings"]
    key_files: ["spec.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Pi skill-discovery bridge

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON config (`.pi/settings.json`, not yet created) + repo-native Markdown `SKILL.md` convention; no application code this phase |
| **Framework** | N/A — Pi's native skills-discovery mechanism (`.pi/skills/`, `~/.pi/agent/skills/`, `settings.json` `"skills"` array, `--skill` flag), consumed rather than built |
| **Storage** | None; the only artifact this phase's future implementation step would create is a single JSON config file |
| **Testing** | Manual, protocol-driven live observation inside a real `pi` CLI session (execution-time, gated on phase 001's install — not run in this planning phase) |

### Overview
Design a `.pi/settings.json` `"skills"` discovery configuration for `.opencode/skills/`, define a discovery-shape decision matrix across 4 candidate strategies (whole-tree pointer, enumerated-hub-paths, curated-mirror, `--skill`-flag-per-hub), and hand off a concrete live-verification protocol that determines whether Pi's recursive `SKILL.md` discovery respects this repo's 12-hub/51-file single-advisor-identity architecture or flattens it — with an explicit mitigation-or-accept decision framing either way. No repository file outside this phase folder is touched; `.pi/settings.json` itself is Planned-Create for a later, separately-approved step.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` §2/§3)
- [x] Success criteria measurable (`spec.md` §5, SC-001..SC-004)
- [x] Dependencies identified (`spec.md` §6 — 003-cli-pi-skill-packet, 001-pi-contract-pin)

### Definition of Done
- [ ] All P0/P1 requirements in `spec.md` §4 have a corresponding design artifact (candidate configuration + test) in this plan — Pending final cross-check (see `tasks.md` T010)
- [ ] The live-verification protocol (§4 below) is concrete enough to execute without redesign once Pi is installed — Pending phase-001 execution to confirm in practice
- [x] Every claim resting on pi.dev docs rather than live behavior is flagged "per pi.dev docs, unconfirmed" or "UNKNOWN, needs live verification" throughout `spec.md`/`plan.md`
- [ ] `spec.md`/`plan.md`/`tasks.md`/`checklist.md` are internally consistent (same requirement IDs, same handoff criteria) — Pending final cross-check (see `tasks.md` T012)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
N/A in the application-architecture sense — this is a decision-record-style comparison of discovery-configuration strategies plus a live-verification protocol design, not a runtime component build.

### Key Components
- **Discovery-surface inventory**: the enumerated list of the 12 hub-level `SKILL.md` paths and the 39 nested-mode + 2 vendor `SKILL.md` paths a naive recursive pointer would also find (confirmed live via `find`, see `spec.md` §1 answered_questions).
- **Candidate configuration set**: 4 named strategies, each with a predicted outcome and a falsifiable test —
  1. **Whole-Tree Pointer** — `"skills": [".opencode/skills"]`. Predicted outcome: all 51 `SKILL.md` files surfaced (flattening), since Pi's docs say directories are discovered recursively "wherever they contain a SKILL.md," with no documented depth limit.
  2. **Enumerated-Hub-Paths** — `"skills": [".opencode/skills/cli-external-orchestration", ".opencode/skills/sk-code", ...]` (12 entries, one per hub root). Predicted outcome: UNKNOWN — each entry is still a directory, and each hub root still directly contains its own nested-mode subdirectories, so recursive discovery may find those too. This candidate's real value is only provable by testing exactly one hub in isolation before generalizing.
  3. **Curated-Mirror** — a maintained directory (e.g. `.pi/skills-mirror/`) containing only the 12 hub-level `SKILL.md` files (real copies or symlinks), pointed at directly. Predicted outcome: correctly narrows discovery IF Pi's walker does not recurse into a mirrored file's *original* location — but carries the 029/030 symlink-fragility lesson forward (a mirror can silently diverge from its source, or content with relative links like `../shared/references/...` can resolve differently through a symlink).
  4. **`--skill`-Flag-Per-Hub** — twelve repeated `--skill <path>` invocation flags (or a `pi.skills`-style package.json-adjacent entry), one per hub. Predicted outcome: same open question as candidate 2, but at the CLI-invocation layer rather than the settings-file layer; relevant mainly to a scripted/deep-loop dispatch path rather than an interactive session.
- **Live-verification protocol**: the ordered steps (§4 below) to run once Pi is installed, with explicit pass/fail evidence criteria for "hub-respecting" vs. "flattened."
- **Mitigation decision record**: whichever strategy is chosen (or accept-and-document), with a re-verification trigger — recorded once live evidence exists, not in this planning phase.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is new-capability planning, not a bug fix, but it touches this repo's single-advisor-identity policy (enforced by `parent-skill-check.cjs`), so the inventory below is filled in per the addendum's applicability rule.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `.opencode/skills/` (51 `SKILL.md` files across 12 hubs) | Source tree Pi's discovery would read from | Read-only inventory; no repo files touched this phase | `find .opencode/skills -iname SKILL.md \| wc -l` = 51; `find .opencode/skills -maxdepth 2 -iname SKILL.md` = 12 (both run live, cited in `spec.md`) |
| `parent-skill-check.cjs` rules 2a/2b | Enforces single-advisor-identity inside this repo's OWN advisor system (no nested `graph-metadata.json`/`description.json`) | Not modified; used as the policy invariant this phase's mitigation strategy reasons about (Pi's discovery walker has no knowledge of this rule — it is a repo-internal constraint this phase must translate into a Pi-side config decision) | Rules re-read directly (lines 295-312) to ground the invariant description in `spec.md` |
| `.pi/settings.json` (does not exist yet) | N/A | Design only; Planned-Create, deferred past this phase | N/A this phase; a later, separately-approved implementation step applies it |

Required inventories:
- Same-class producers: `find .opencode/skills -iname SKILL.md` (51 results; 12 at hub-root depth via `-maxdepth 2`).
- Consumers: N/A — no repo symbol or config file changes this phase. The real "consumer" of this design is Pi's own (undocumented) discovery walker, which can only be tested empirically once installed, not by static analysis of this repo.
- Matrix axes: discovery-pointer granularity (whole-tree / per-hub-directory / per-hub-file / curated-mirror) × observed outcome (hub-only / flattened / rejected-invalid-config) — 4×3 candidate space, not all cells necessarily reachable (e.g. per-hub-file may be syntactically invalid per REQ-002's open question).
- Algorithm invariant: N/A — no path/redaction/parser/security code changes this phase.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm 003-cli-pi-skill-packet's exit state (`cli-pi` registered as hub's 6th mode; `parent-skill-check.cjs` + `validate_skill_package.py` passing) by reading its own `spec.md`/`checklist.md` — read-only, no edits outside this phase folder
- [x] Re-confirm the discovery-surface inventory live: `find .opencode/skills -iname SKILL.md` (51 total) and its 12-entry hub-root subset (`find .opencode/skills -maxdepth 2 -iname SKILL.md`) — done this authoring pass, cited in `spec.md`
- [x] Re-read pi.dev's skills-discovery documentation directly for the exact discovery/trust-prompt/cross-harness-example wording — the "directories are discovered recursively wherever they contain a SKILL.md" phrasing and the `{"skills": ["~/.claude/skills","~/.codex/skills"]}` example are quoted verbatim in `spec.md` §2

### Phase 2: Core Design
- [x] Draft the 4 candidate `.pi/settings.json` `"skills"` configurations plus the `--skill` flag alternative (documented in §3 above)
- [ ] Draft the live-verification protocol (ordered steps + pass/fail evidence) — drafted below; not yet executed (execution requires phase 001's Pi install)
- [x] Draft the mitigation-or-accept decision framing (not yet decided — the actual decision requires live evidence phase 001's coarse first pass may not fully resolve, since 001 only does a first-pass check across many unrelated Pi features)

**Live-verification protocol (to execute once Pi is installed, per phase 001)**:
1. Confirm `pi --version` succeeds and a project `.pi/` directory can be created (phase 001 precondition).
2. Apply Candidate 1 (Whole-Tree Pointer) in a scratch/test `.pi/settings.json`, scoped to this repo.
3. Start a `pi` session and ask it directly what skills it has discovered/available (exact in-session command or prompt phrasing TBD at execution time — Pi's docs do not name a specific `/skills`-style listing command in the research available to this phase; this is itself part of what needs live discovery).
4. Record the full returned identity list. Compare against the 12-hub expectation:
   - If exactly 12 identities matching the hub names appear → hub-respecting, candidate 1 is sufficient, no mitigation needed.
   - If more than 12 identities appear, including nested-mode names (e.g. `cli-devin`, `code-quality`, `deep-research`) → flattening confirmed.
5. If flattening is confirmed, repeat steps 2-4 with Candidate 2 (Enumerated-Hub-Paths), but scoped to ONLY the `cli-external-orchestration` hub path first (isolate the question before generalizing to all 12).
6. If Candidate 2 still surfaces nested-mode identities for that one hub, conclude directory-level enumeration does not suppress recursion; move to Candidate 3 (Curated-Mirror).
7. If Candidate 3 is tested, dispatch directly through the mirrored path AND directly through the real (non-mirrored) path, and diff the two responses — per the 029/030 symlink-parity lesson, do not assume they match without checking.
8. Record the final chosen (or accepted-tradeoff) strategy, its supporting evidence, and a re-verification trigger.

### Phase 3: Verification (of this phase's PLAN, not of Pi itself — PLANNING ONLY)
- [ ] Cross-check every requirement in `spec.md` §4 has a matching design artifact in this plan
- [ ] Confirm no claim in this phase's docs states unconfirmed live Pi behavior as fact
- [ ] Confirm `spec.md`/`plan.md`/`tasks.md`/`checklist.md` handoff criteria match the packet-level handoff table verbatim
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static inventory check | Confirm 12 hub / 51 total `SKILL.md` counts | `find`, `wc -l` — already run this phase; command and output cited verbatim in `spec.md` |
| Live discovery-shape probe (execution-time, NOT this phase) | Whichever candidate configuration(s) get applied, per the protocol in §4 | Real `pi` CLI session, in-session skill listing/invocation, phase 001's install |
| Symlink-parity check (if curated-mirror chosen) | Mirrored `SKILL.md` content resolves correctly under Pi | Direct live dispatch through the mirrored path AND the real path, diffed — not just static presence (029/030 lesson) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 003-cli-pi-skill-packet | Internal | Planned (not started) | No `cli-pi` hub-registered identity for this phase's design to reference concretely |
| 001-pi-contract-pin (Pi install + `.pi/` + `settings.json` merge live findings) | Internal | Planned (not started) | This phase's config design rests on documented-only `settings.json` merge behavior until 001 confirms it live |
| pi.dev skills documentation (`https://pi.dev/docs/latest/skills`) | External | Green (fetched, quoted verbatim in this phase's docs) | Docs could be incomplete or stale; live verification is still required regardless of documentation completeness |
| Pi CLI itself (the `pi` binary) | External | Not yet installed (phase 001 owns the install) | No live verification possible until then; this phase stays planning-only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: N/A for this phase itself — no repository file outside this phase folder is modified, and `.pi/settings.json` is never created here. This section instead documents the rollback for the FUTURE implementation step this phase's plan designs for.
- **Procedure**: If an applied `.pi/settings.json` configuration is found to leak nested-mode identities in a way that misroutes Pi sessions, delete or narrow the `"skills"` array entry and fall back to the next candidate in the decision matrix (§3). Because `.pi/settings.json` is additive project config with no coupling into this repo's own advisor/routing code (`mode-registry.json`, `hub-router.json`, any hub's `SKILL.md`), removing or editing it has zero blast radius on those files — Pi's own discovery config can be freely iterated without touching the repo's advisor system.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
