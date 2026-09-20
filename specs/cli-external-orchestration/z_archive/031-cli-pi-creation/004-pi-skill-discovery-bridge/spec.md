---
title: "Feature Specification: Pi skill-discovery bridge"
description: "Plan and design-verify how .pi/settings.json's \"skills\" array (or --skill flags) is pointed at .opencode/skills/, and whether Pi's recursive SKILL.md discovery respects this repo's 12-hub single-advisor-identity design or flattens all 39 nested-mode SKILL.md files into independently-discovered skills, requiring a documented mitigation or accepted tradeoff."
trigger_phrases: ["pi skill discovery", "pi settings.json skills array", "pi skill flattening", "pi hub mode discovery"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/004-pi-skill-discovery-bridge"
    last_updated_at: "2026-07-27T09:53:30Z"
    last_updated_by: "claude-code"
    recent_action: "Design complete; live probe blocked on credentials, decision accepted"
    next_safe_action: "Commit phase 004; phase 005 proceeds with accepted decision"
    blockers: ["Discovery-shape confirmation needs provider credentials this machine lacks"]
    key_files: ["implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-authoring", parent_session_id: null }
    completion_pct: 90
    open_questions: ["Does discovery surface only the pointed-at dir's SKILL.md or every nested one?", "Does the skills array accept a file path or only directory paths?", "If flattened, does Pi's selection heuristic bypass the hub directly?", "Does a curated-mirror approach break relative paths inside SKILL.md?", "Should sk-design's 2 vendor SKILL.md files need a different approach?"]
    answered_questions: ["Inventory confirmed live: 51 SKILL.md files, 12 at hub-root depth", "2 of 51 are vendor files inside sk-design's playwright-core, not repo content", "parent-skill-check.cjs rules 2a/2b confirmed: one advisor identity per hub", "Nested mode SKILL.md files omit hub-level disambiguation prose (9.5KB hub vs 31-33KB modes)"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Pi skill-discovery bridge

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
| **Priority** | P0 |
| **Status** | Complete - design fully verified; live discovery-shape confirmation accepted-deferred (blocked on provider credentials, re-verification trigger documented in `implementation-summary.md`) |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 11 |
| **Predecessor** | 003-cli-pi-skill-packet |
| **Successor** | 005-pi-command-layer |
| **Handoff Criteria** | A live `pi` session's skill discovery is confirmed to expose the intended skill set — either exactly the 12 hub-level `SKILL.md` identities, or a documented-and-mitigated/accepted divergence — not silently assumed, before phase 005 begins bridging commands on top of it. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the CLI Pi creation specification.

**Scope Boundary**: Configure and design-verify how Pi's native skill-discovery mechanism (`.pi/settings.json`'s `"skills"` array, or repeated `--skill <path>` flags) is pointed at this repo's `.opencode/skills/` tree, and determine — empirically, not by assumption — whether Pi's recursive `SKILL.md` discovery preserves this repo's single-advisor-identity, hub/mode architecture (12 hub-level `SKILL.md` files are the only advisor-routable identities; the 39 nested per-mode `SKILL.md` files, e.g. `cli-external-orchestration/cli-devin/SKILL.md`, are deliberately NOT independent advisor identities — `parent-skill-check.cjs` rules 2a/2b enforce this inside this repo's own advisor system) or instead flattens every nested mode into an independently-discovered "skill", diverging from `mode-registry.json`-driven routing. This is the phase's central open risk; design the mitigation (or explicitly accepted tradeoff) strategy, not just the config shape.

**Dependencies**:
- 003-cli-pi-skill-packet must have landed: `cli-pi` registered as the hub's 6th mode, `parent-skill-check.cjs` and `validate_skill_package.py` both passing against the hub (the predecessor's outbound handoff criterion into this phase).
- 001-pi-contract-pin's live `.pi/` directory-creation and `settings.json`-merge findings ("Project settings override global settings. Nested objects are merged.", per pi.dev docs) — this phase's config design rests on that merge behavior being real, not merely documented.
- The Pi CLI itself installed and reachable (`pi --version` succeeds), per phase 001 — no live command in this phase requires it, but the live-verification protocol this phase designs does.

**Deliverables**:
- A documented `.pi/settings.json` "skills" configuration design (multiple candidate shapes, none applied yet) plus a concrete, executable live-verification protocol to run once phase 001's install is available.
- A discovery-shape decision matrix: whole-tree pointer vs. enumerated-hub-paths vs. curated-mirror vs. `--skill`-flag-per-hub, each scored against the flattening-divergence risk.
- A recorded mitigation-or-accepted-tradeoff decision framing, with an explicit re-verification trigger.
- An explicit inventory of what a naive `.opencode/skills/` recursive pointer would surface today: 51 total `SKILL.md` files (12 hub identities + 39 nested-mode files), including 2 unrelated vendor `SKILL.md` files shipped inside `sk-design/design-md-generator/backend/node_modules/playwright-core/`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Unlike Devin and Cursor (`029-cli-devin-revival`, `030-cli-cursor-creation`), which have no shared skill format at all and needed bespoke, repo-authored hook adapters to bridge this repo's guard/skill content into their native surfaces, Pi natively speaks `SKILL.md` and documents ingesting external `SKILL.md` trees directly — its own docs' only cross-harness example shows `{"skills": ["~/.claude/skills", "~/.codex/skills"]}`. That closes the "no shared format" gap 029/030 had to work around, but it opens a different one that has no precedent in either prior packet: this repo's skill tree is not a flat bag of independently-usable `SKILL.md` files. It is a deliberate two-tier architecture — exactly 12 hub-level `SKILL.md` files are the only advisor-routable identities, each hub internally dispatching to N nested per-mode `SKILL.md` files (39 of them, confirmed live) via `mode-registry.json`/`hub-router.json`, a design `parent-skill-check.cjs` rules 2a/2b actively enforce inside this repo's own advisor system (no nested `graph-metadata.json`/`description.json` may re-introduce a second advisor identity). Pi's documented discovery behavior — "directories are discovered recursively wherever they contain a SKILL.md" — says nothing about respecting that hub/mode boundary. Per pi.dev docs, unconfirmed: whether pointing `.pi/settings.json`'s `"skills"` array at `.opencode/skills/` (or even at a single hub subdirectory) surfaces only the 12 intended identities or also flattens all 39 nested-mode files — plus the 2 unrelated vendor `SKILL.md` files bundled inside `sk-design/design-md-generator/backend/node_modules/playwright-core/` — into independently-invokable skills that bypass the intended routing.

### Purpose
Design, and hand off a concrete live-verification protocol for, a `.pi/settings.json` skills-discovery configuration that — once tested against the real Pi CLI in phase 001 or this phase's own future implementation pass — either (a) confirms recursive discovery naturally respects the hub boundary, (b) is deliberately narrowed (e.g. by pointing `"skills"` at exactly the 12 hub-level paths rather than the tree root, if that genuinely suppresses recursion into nested-mode subdirectories), or (c) accepts and documents flattened exposure as a known, bounded tradeoff — so phase 005 (command layer) and every later phase inherits a stated, falsifiable answer instead of a silent assumption.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Enumerate the exact discovery surface at stake: 12 hub-level `SKILL.md` files vs. 51 total `SKILL.md` files findable under `.opencode/skills/` (confirmed via `find .opencode/skills -iname SKILL.md`), itemizing the 39 nested-mode files and the 2 vendor files.
- Design (not apply) at least 3 candidate `.pi/settings.json` `"skills"` array configurations, plus the `--skill <path>` CLI-flag alternative, each addressing a different discovery-shape hypothesis.
- Design a concrete live-verification protocol: ordered steps, what to ask a live `pi` session, and what "hub-respecting" vs. "flattened" evidence looks like — executable by phase 001 or a later implementation pass without redesign.
- Design the mitigation strategy for the flattening failure mode, including testing whether enumerating the 12 hub-root directories in the `"skills"` array actually suppresses recursion into each hub's own nested-mode subdirectories (a directory pointer is not obviously equivalent to a single-file pointer, and this repo has no evidence either way).
- Design a curated-mirror fallback (a maintained directory containing only the 12 hub-level `SKILL.md` files, real copies or symlinks) for use if direct enumeration cannot suppress recursion, explicitly carrying forward the 029/030 symlink-fragility lesson (a mirrored/symlinked source can silently diverge from the real path) into the verification protocol.
- Record the decision (or accepted tradeoff) and its re-verification trigger, for phase 005 and beyond to consume.

### Out of Scope
- Actually installing Pi or running any live `pi` command — phase 001 owns the install and the first coarse live check across many features; this phase is planning-only (hard constraint, not a phase-boundary preference).
- Writing `.pi/settings.json` to the repo root, or creating any `.pi/` directory content — deferred to a later, explicitly-approved implementation step, after this plan's protocol is actually run.
- Command/prompt-template bridging (`005-pi-command-layer`), agent bridging (`006-pi-agent-bridge`), MCP host integration (`007-pi-mcp-host-integration`), or extension/hook wiring (`008-pi-hook-extension-layer`) — this phase is skills discovery ONLY.
- Modifying `mode-registry.json`, `hub-router.json`, or any hub's `SKILL.md`/`description.json`/`graph-metadata.json` — those are owned by phase 003 (registration) and are read-only reference material for this phase.
- Deciding the final production configuration for all 12 hubs individually — this phase designs the general strategy and tests its logic against `cli-external-orchestration` (this packet's own hub) as the representative case; applying the identical, validated strategy to the other 11 hubs is mechanical follow-through, not new design work, and is noted as generalizing rather than re-derived per hub.

### Files to Change

Planning-only phase: no repository file outside this phase folder is touched. The table below describes the configuration surface this phase's plan targets for a later, explicitly-approved implementation step — not a change made now.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/settings.json` (repo root; does not exist yet) | Planned-Create | Target config: a `"skills"` array pointing at either `.opencode/skills/` (whole-tree hypothesis) or an enumerated list of the 12 hub-level paths (narrowed hypothesis) — exact shape decided by the live-verification protocol this phase designs, applied only in a later, separately-approved step. |
| `.opencode/skills/**/SKILL.md` (51 files) | Read-only reference | Inventoried, not modified — the discovery-surface enumeration this phase's plan is built from. |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Read-only reference | Rules 2a/2b confirm the single-advisor-identity invariant this phase's mitigation strategy must reason about (a repo-internal enforcement mechanism Pi has no knowledge of). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Enumerate the exact discovery-surface inventory (12 hub-level `SKILL.md` identities vs. 51 total `SKILL.md` files findable under `.opencode/skills/`, itemizing the 39 nested-mode files and the 2 vendor files) and record it in this phase's spec/plan. | `find .opencode/skills -iname SKILL.md \| wc -l` (51) and `find .opencode/skills -maxdepth 2 -iname SKILL.md` (the 12 hub-root paths) are both cited verbatim, with their real output, in this phase's docs. |
| REQ-002 | Design at least 3 candidate `.pi/settings.json` `"skills"` configuration shapes (whole-tree pointer, enumerated-hub-paths array, curated-mirror directory) plus the `--skill` CLI-flag alternative, each with its own falsifiable pass/fail discovery-shape test. | `plan.md` documents all 4 candidates, each with a predicted outcome and a named test. |
| REQ-003 | Design a concrete live-verification protocol (ordered steps, exact commands/prompts, and explicit "hub-respecting" vs. "flattened" evidence criteria) that phase 001 or this phase's own future implementation pass can execute once Pi is installed. | The protocol is procedural enough that a different agent/session could run it without re-deriving the test design; `tasks.md` cross-references it directly. |
| REQ-004 | Every claim in this phase's docs that rests on pi.dev documentation rather than confirmed live Pi behavior is explicitly flagged (e.g. "per pi.dev docs, unconfirmed" or "UNKNOWN, needs live verification"). | A grep of this phase's authored files for confident, unqualified claims about live Pi discovery behavior returns zero matches; every such claim carries the qualifier. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Document why a directory-level "enumerate the 12 hub roots" pointer may NOT be sufficient mitigation on its own: each hub root itself contains nested-mode subdirectories that a directory-recursive discovery mechanism would plausibly still walk into and find — this is untested, not assumed safe. | `spec.md`/`plan.md` states this specific failure mode explicitly, distinct from the whole-tree-pointer failure mode. |
| REQ-006 | Carry forward the 029/030 symlink-fragility lesson (a discovery mirror can silently diverge from its source) into the verification protocol: if a curated-mirror/symlink mitigation is chosen, the protocol must test the mirrored path directly under a live `pi` session, not just confirm static config presence. | The live-verification protocol in `plan.md`/`tasks.md` includes an explicit mirrored-path dispatch test as a distinct step, not folded silently into the whole-tree test. |
| REQ-007 | Record the accepted decision framing (mitigate vs. accept-and-document) with an explicit re-verification trigger (e.g. "re-test if Pi's skills-discovery behavior changes across a version bump" or "re-test once phase 001's live probe returns"). | `spec.md` Open Questions / `plan.md` records the trigger condition in prose, not just the decision itself. |

### P2 - Nice to have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Note whether the chosen strategy needs a hub-specific exception — in particular `sk-design`, whose tree also bundles 2 unrelated vendor `SKILL.md` files inside `design-md-generator/backend/node_modules/playwright-core/`, which a naive whole-tree pointer would also surface as if they were real repo skills. | Open Questions records this as an explicit follow-up, not silently generalized away. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A discovery-shape decision matrix exists (mitigate vs. accept), grounded in the real 12-vs-51 inventory (REQ-001), not a guess about Pi's behavior.
- **SC-002**: A concrete, executable live-verification protocol exists that a later phase (or this phase's own implementation pass) can run once Pi is installed, with defined pass/fail evidence for "hub-respecting" vs. "flattened" (REQ-003).
- **SC-003**: The packet-level successor handoff criterion — "a live pi session's skill discovery is confirmed to expose the intended skill set (documented divergence accepted or mitigated, not silently assumed)" — has a fully designed path to being satisfied, even though the PLANNING ONLY constraint means it cannot be executed inside this phase.
- **SC-004**: No claim in this phase's docs states unconfirmed Pi discovery behavior as if it were already verified (REQ-004).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Pi's recursive discovery flattens all 39 nested-mode `SKILL.md` files into independent skills | Bypasses `mode-registry.json`-driven routing; nested-mode content is individually coherent (own name/description/WHEN TO USE) but does not restate hub-level cross-mode disambiguation and tie-break prose that only lives in the 9.5KB hub `SKILL.md`, so a flattened invocation could skip real routing guardrails | Live-verify per the designed protocol; if confirmed, either narrow the `"skills"` pointer or accept + document the exact blast radius |
| Risk | Enumerating the 12 hub-root directories does not suppress recursion into their own nested-mode subdirectories (a hub root dir still contains its modes) | The "point at 12 hub paths" mitigation could be a no-op, giving false confidence | Explicitly test directory-pointer recursion depth against one hub (`cli-external-orchestration`) before generalizing to all 12; never assume enumerating parents stops recursion into children |
| Risk | A curated-mirror/symlink fallback silently diverges from the live source (029/030 precedent: symlinked hook sources broke silently against `process.argv[1]`/`import.meta.url` comparisons) | Pi could read stale or subtly different content than the real repo tree, or relative links inside a mirrored `SKILL.md` (e.g. `../shared/references/...`) could resolve incorrectly | Test the mirrored path directly under a live session (REQ-006); never assume symlink parity from static config alone |
| Risk | pi.dev docs' only cross-harness discovery example (`~/.claude/skills`, `~/.codex/skills`) points at other tools' flat skill roots, not a nested hub/mode tree — no documented precedent exists for a hierarchical source shaped like this repo's | Untested territory in both directions; the docs give no signal either way | Treat as the phase's central unresolved question, not an assumption of either outcome |
| Dependency | 003-cli-pi-skill-packet | `cli-pi` mode + hub registration must exist before this phase's config design references a concrete, live packet | Do not begin any implementation of this phase's plan before 003's exit criteria are met |
| Dependency | 001-pi-contract-pin's live `.pi/` and `settings.json` merge findings | This phase's config design assumes project `settings.json` merges over global per pi.dev docs; unconfirmed until phase 001 runs a live check | Treat phase 001's live findings as the gating input before applying any configuration this phase designs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The chosen (or accepted-tradeoff) discovery strategy must not depend on a one-time manual fix — if a curated mirror is chosen, it needs a documented refresh path (regenerate whenever a hub gains/loses a mode) so it does not silently drift stale relative to `.opencode/skills/`.

### Maintainability
- **NFR-M01**: Whatever `.pi/settings.json` shape is ultimately chosen should generalize to all 12 hubs without per-hub bespoke logic; a strategy that only works for `cli-external-orchestration` and needs hand-tuning per hub is a documented gap, not a silent limitation.

---

## 8. EDGE CASES

- **A hub with an unusually deep or vendor-contaminated tree** (`sk-design/design-md-generator/backend/node_modules/playwright-core/` contains 2 unrelated vendor `SKILL.md` files at real depth inside the repo's `.opencode/skills/` tree): a naive whole-tree pointer would surface these as if they were real repo skills; the mitigation strategy must account for vendor-directory contamination, not just intra-repo hub/mode nesting.
- **`.pi/settings.json`'s `"skills"` array accepts directories but not literal file paths** (UNKNOWN, needs live verification): if true, the "enumerate 12 hub `SKILL.md` file paths directly" mitigation is not syntactically available at all, and only a curated-mirror-directory approach remains viable.
- **Pi's model does not use a simple "list every discovered SKILL.md" selection heuristic** (e.g. it could embed/rank by description similarity, or only surface skills matching keyword overlap with the current prompt): flattening could be present in the config but rarely or never actually surfaced in practice — this changes the mitigation's urgency but not whether the underlying divergence exists, and both must be tested, not conflated.
- **Global `~/.pi/agent/skills/` also exists on the operator's machine** and could itself contain unrelated skills that merge with this repo's project-level discovery: out of scope for this phase (a project-level `.pi/settings.json` concern only), but worth noting as a related merge-surface phase 001 should also account for.

---

## 9. USER STORIES

### US-001: Pi's skill list matches this repo's intended 12 identities (Priority: P0)

**As a** developer dispatching work through Pi in this repo, **I want** Pi's discovered skill set to match the repo's 12 hub-level advisor identities, **so that** Pi's routing behavior is not silently more granular (or more confusing) than every other runtime already wired into this repo.

**Acceptance Criteria**:
1. **Given** a live `pi` session with the chosen `.pi/settings.json` configuration applied, **When** the session's available skills are inspected, **Then** the observed identity list is compared against the 12-hub expectation and the result (match, narrower, or flattened) is recorded as evidence, not assumed.
2. **Given** the observed result is flattened, **When** the mitigation decision is made, **Then** the decision (mitigate further or accept-and-document) states the concrete blast radius — which nested-mode identities are exposed and what routing guardrail each one skips.

### US-002: The mitigation strategy is tested, not assumed (Priority: P0)

**As an** implementer of this phase's future execution pass, **I want** each candidate configuration's predicted outcome checked against real evidence before it is chosen, **so that** the packet does not repeat the 029/030 pattern of shipping a config that "should" work by design but was never live-verified.

**Acceptance Criteria**:
1. **Given** the enumerated-hub-paths candidate, **When** it is tested against one representative hub (`cli-external-orchestration`), **Then** the test explicitly checks whether that hub's own nested-mode `SKILL.md` files are also discovered, not just whether the hub's own `SKILL.md` is discovered.
2. **Given** a curated-mirror candidate is tested, **When** the mirrored path is dispatched to directly, **Then** the response is compared against a direct dispatch to the real (non-mirrored) path, following the 029/030 symlink-parity lesson.

### US-003: Every unconfirmed claim stays legible as unconfirmed (Priority: P1)

**As a** reviewer of this phase's plan, **I want** every claim about live Pi discovery behavior to be clearly flagged as documented-only versus live-verified, **so that** a later phase never inherits a confidently-stated but actually-untested assumption.

**Acceptance Criteria**:
1. **Given** any statement in this phase's docs about how Pi's discovery behaves, **When** it is not backed by a live command run in this phase, **Then** it carries an explicit "per pi.dev docs, unconfirmed" or "UNKNOWN, needs live verification" qualifier.
2. **Given** the discovery-surface inventory (12 vs. 51), **When** it is cited, **Then** it is cited as a live, locally-run `find` result (which it is), not conflated with the docs-only claims about Pi's own discovery walker.

---

## 10. OPEN QUESTIONS

- Does Pi's recursive `SKILL.md` discovery, when pointed at `.opencode/skills/` (or any hub subdirectory), surface ONLY the pointed-at directory's own `SKILL.md`, or every `SKILL.md` found at any depth below it? UNKNOWN, needs live verification — this is the central question this phase's plan is built to test, not to answer from docs alone.
- Does `.pi/settings.json`'s `"skills"` array (or the `--skill` flag) accept a literal `SKILL.md` FILE path, or only directory paths? pi.dev docs' only example uses directory paths (`~/.claude/skills`); UNKNOWN whether a 12-file-path enumeration is even syntactically valid.
- If flattening is confirmed, does Pi's model actually invoke a flattened nested-mode skill directly (bypassing the hub), or does it still tend to reach the hub-level file first due to Pi's own skill-selection heuristic? UNKNOWN — Pi's skill-picking algorithm (keyword match, embedding similarity, or full listing in the system prompt) is undocumented in the research available to this phase and needs its own live check, likely in phase 001 or this phase's execution pass.
- Does a curated-mirror/symlink-of-12-files approach introduce any relative-path breakage inside the mirrored `SKILL.md` content (e.g. links to `../shared/references/...` that resolve differently through a symlink)? Carry the 029/030 symlink lesson forward — test, don't assume.
- Should this phase's chosen strategy be applied identically to all 12 hubs, or does `sk-design` (which nests 3 modes plus a transport packet plus 2 unrelated vendor `SKILL.md` files inside its own tree) need a hub-specific exception because of the vendor-file contamination risk? Recorded as a P2 follow-up (REQ-008), not resolved here.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../003-cli-pi-skill-packet/spec.md` (predecessor — hub registration this phase's design targets)
- `../005-pi-command-layer/spec.md` (successor)
- `../001-pi-contract-pin/spec.md` (live Pi install + `.pi/` + `settings.json` merge findings this phase's config design depends on)
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs` (rules 2a/2b — the single-advisor-identity invariant this phase's mitigation strategy reasons about)
- `../spec.md` (phase-parent packet)
