---
title: "Tasks: Pi skill-discovery bridge"
description: "Task breakdown for designing and hand off a live-verification protocol for Pi's skill-discovery configuration."
trigger_phrases: ["pi skill discovery tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/004-pi-skill-discovery-bridge"
    last_updated_at: "2026-07-27T09:53:30Z"
    last_updated_by: "claude-code"
    recent_action: "All 12 tasks complete; live discovery probe attempted, blocked on credentials"
    next_safe_action: "Commit; phase 005 may proceed with the accepted decision"
    blockers: ["Discovery-shape confirmation needs provider credentials this machine lacks"]
    key_files: ["implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-authoring", parent_session_id: null }
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Pi skill-discovery bridge

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Confirm 003-cli-pi-skill-packet's exit state (`cli-pi` registered as hub's 6th mode; `parent-skill-check.cjs` + `validate_skill_package.py` passing) by reading its `spec.md`/`checklist.md` — read-only, no edits outside this phase folder [EVIDENCE: `003-cli-pi-skill-packet` Status is `Complete`; `parent-skill-check.cjs` 0 warnings, 6 modes]
- [x] T002 Re-run and cite the discovery-surface inventory: `find .opencode/skills -iname SKILL.md | wc -l` (51) and `find .opencode/skills -maxdepth 2 -iname SKILL.md` (12 hub-root paths) — done, cited in `spec.md` §1/§2 [EVIDENCE: re-confirmed live, cited in spec.md]
- [x] T003 [P] Re-read pi.dev's skills-discovery doc page directly (`https://pi.dev/docs/latest/skills`) to confirm the exact "directories are discovered recursively wherever they contain a SKILL.md" wording and the `{"skills": ["~/.claude/skills","~/.codex/skills"]}` cross-harness example are quoted correctly — done, quoted verbatim in `spec.md` §2 [EVIDENCE: quoted verbatim in spec.md]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Draft Candidate A: Whole-Tree Pointer (`"skills": [".opencode/skills"]`) — predicted outcome: all 51 `SKILL.md` files surfaced (flattening); test = live skill-list/invocation probe (`plan.md` §3/§4) [EVIDENCE: attempted live via `pi --offline --approve -p "list every skill..."` with this exact config - config parsed and was accepted (no syntax error), dispatch reached the auth gate, blocked on missing provider credentials before a skill-list response could be observed]
- [x] T005 Draft Candidate B: Enumerated-Hub-Paths (`"skills": [".opencode/skills/cli-external-orchestration", ".opencode/skills/sk-code", ...]`, 12 entries) — predicted outcome: UNKNOWN whether directory-recursive discovery still finds nested-mode `SKILL.md` files inside each enumerated hub dir; test = probe against just one enumerated hub (`cli-external-orchestration`) to isolate the question before generalizing to all 12 (`plan.md` §3/§4) [EVIDENCE: drafted in plan.md §3; live test blocked on the same credential gap as T004]
- [x] T006 Draft Candidate C: Curated-Mirror (a maintained directory containing only the 12 hub-level `SKILL.md` files, real files or symlinks) — predicted outcome: correctly narrows discovery IF Pi's discovery only reads the pointed-at directory's immediate `SKILL.md` and does not walk into a mirrored file's original location; carries the 029/030 symlink-fragility lesson forward into its test design (`plan.md` §3) [EVIDENCE: drafted in plan.md §3, not live-tested - lowest priority candidate per the decision below]
- [x] T007 Draft Candidate D: Twelve `--skill <path>` flags (or a `pi.skills`-style package.json-adjacent entry) as a per-hub-explicit alternative to the `settings.json` array — predicted outcome: same open question as B/C, but at the CLI-invocation layer instead of config; relevant mainly to a scripted/deep-loop dispatch path rather than an interactive session (`plan.md` §3) [EVIDENCE: drafted in plan.md §3, confirmed real flag syntax via `pi --help` (`--skill <path>`, repeatable)]
- [x] T008 Draft the live-verification protocol: 8 ordered steps (install confirmed → apply one candidate → start `pi` → ask it to list/describe available skills → compare the returned identity list against the 12-hub expectation → escalate through candidates as needed → mirrored-path parity check → record decision) with explicit "hub-respecting" vs. "flattened" evidence criteria (`plan.md` §4) [EVIDENCE: protocol drafted and step 1-2 executed live this phase; steps 3+ blocked on provider credentials]
- [x] T009 Draft the mitigation-or-accept decision framing: under what live evidence each candidate would be accepted, narrowed further, or rejected; document the re-verification trigger (`spec.md` §4 REQ-007, §10 Open Questions) [EVIDENCE: decision recorded in implementation-summary.md - accept Candidate A initially, re-verify once credentials exist, re-verification trigger documented]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Cross-check every `spec.md` REQ-00x has a matching artifact in `plan.md`/`tasks.md` (P0 REQ-001..004, P1 REQ-005..007, P2 REQ-008 — verify each maps to a specific plan section or task) [EVIDENCE: cross-checked, all REQs map to a plan.md section or a T00x task]
- [x] T011 Grep this phase's authored files for any bare (unqualified) claim about live Pi discovery behavior; confirm each carries "per pi.dev docs, unconfirmed" or "UNKNOWN, needs live verification" [EVIDENCE: `grep -c "per pi.dev docs, unconfirmed\|UNKNOWN, needs live verification" spec.md plan.md` returns 4 and 1 hits respectively, non-zero]
- [x] T012 Confirm METADATA `Predecessor`/`Successor`/`Handoff Criteria` in `spec.md` match the packet-level handoff table exactly (003→004 inbound dependency, 004→005 outbound handoff criterion) [EVIDENCE: confirmed via direct grep of spec.md METADATA table]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 12 tasks marked `[x]` with evidence [EVIDENCE: this file]
- [x] No `[B]` blocked tasks remaining without a documented reason [EVIDENCE: 0 `[B]` markers]
- [x] `checklist.md`'s planning-completeness items verified; live-execution items (CHK-020/CHK-021) explicitly deferred, not falsely marked done [EVIDENCE: checklist.md]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- Depends on `../003-cli-pi-skill-packet/`; precedes `../005-pi-command-layer/`.
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
