---
title: "Feature Specification: Codex and Claude hooks discovery mirrors"
description: "Extend the .cursor/hooks/ discovery-mirror pattern to the other two hook-config-driven runtimes: .codex/hooks/ (16 symlinks) and .claude/hooks/ (18 symlinks), with a per-file empirical sweep establishing exactly which scripts do not behave identically through a symlink."
trigger_phrases: ["codex hooks mirror", "claude hooks mirror", "hook discovery symlink folders"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/017-codex-claude-hooks-discovery-mirrors"
    last_updated_at: "2026-07-25T17:05:00Z"
    last_updated_by: "opencode"
    recent_action: "Linked successor phase 018."
    next_safe_action: "None; phase remains Complete."
    blockers: []
    key_files: [".codex/hooks/README.md", ".claude/hooks/README.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "codex-claude-hooks-discovery-mirrors", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Mirror scope: only scripts each runtime's own config actually invokes, extracted programmatically rather than by listing hook directories.", "Repoint the configs at the mirrors: no -- 4 of 34 scripts do not behave identically through a symlink, established per-file rather than assumed from the cursor finding.", "Basename collisions: guarded by prefixing the owning skill directory; none actually occurred."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Codex and Claude hooks discovery mirrors

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/030-cli-cursor-creation` |
| **Predecessor** | `../016-cursor-mcp-wiring-and-route-guard-fix/spec.md` |
| **Successor** | `../018-cursor-spec-gate-prebind/spec.md` |
| **Handoff Criteria** | `.codex/hooks/` and `.claude/hooks/` each hold a symlink to every script their own runtime config invokes, none broken; both runtime configs are unchanged; and each mirror's README names the exact scripts that do NOT behave identically through a symlink, determined by a per-file real-path comparison rather than inherited from the Cursor finding. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `.cursor/hooks/` discovery mirror gave the Cursor runtime a single place to see its full hook inventory. Codex and Claude have equivalent hook surfaces — 16 and 18 distinct scripts respectively, scattered across `.opencode/bin/`, `.opencode/scripts/`, and five different skill trees — with no such index. The operator asked for the same treatment.

The Cursor work also produced a finding that could not simply be carried over: 4 of its 13 mirrored scripts silently produced no output when invoked through a symlink, because their entrypoint guard compares the invocation path against the ESM-resolved real path. Whether that applies to Codex/Claude — and to which specific files — is an empirical question, not something to infer from the Cursor result.

### Purpose
Create `.codex/hooks/` and `.claude/hooks/` as symlink mirrors of exactly what each runtime's own config invokes, and establish per-file, by comparing each script's symlink-invoked output against its real-path output, which ones are safe to invoke through the mirror and which are not — so each README states the actual affected set rather than a generalization.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Programmatically extract every `.opencode/...` script path from `.codex/hooks.json` and `.claude/settings.json`, including paths embedded inside `bash -c` wrappers.
- Confirm every extracted path resolves on disk before linking.
- Create `.codex/hooks/` (16) and `.claude/hooks/` (18) with relative symlinks, disambiguating any basename collision by prefixing the owning skill directory.
- Confirm no broken symlinks in either mirror.
- Sweep all 34 scripts, comparing symlink-invoked stdout against real-path stdout for each, to determine the affected set empirically.
- Write a README per mirror naming that runtime's exact affected scripts and stating that the runtime config must keep pointing at real paths.
- Leave `.codex/hooks.json` and `.claude/settings.json` completely unchanged.

### Out of Scope
- Repointing either runtime config at its mirror — rejected on the same evidence as the Cursor mirror.
- Fixing the entrypoint-guard's symlink intolerance in the shared `.ts` sources — a behavior change to code four runtimes depend on, not requested.
- Root-causing `install-codex-hooks.mjs`'s differing output beyond noting it: it is a CLI utility rather than a stdin-driven hook, so the guard explanation does not obviously apply and asserting one would overstate the evidence.
- OpenCode — it has no `hooks.json`-style config; its advice is delivered by plugin bridge, so there is no invocation list to mirror.

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `.codex/hooks/*` (16 symlinks + README) | Create | Mirror of everything `.codex/hooks.json` invokes. |
| `.claude/hooks/*` (18 symlinks + README) | Create | Mirror of everything `.claude/settings.json` invokes. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | Each mirror contains a symlink to every script its own runtime config invokes, extracted programmatically rather than by hand. | P0 |
| REQ-002 | No symlink in either mirror is broken. | P0 |
| REQ-003 | `.codex/hooks.json` and `.claude/settings.json` remain byte-identical. | P0 |
| REQ-004 | The affected-script set is determined per file by real-path comparison, never inherited from the Cursor finding or inferred from file extension. | P0 |
| REQ-005 | Each README names its runtime's exact affected scripts and states the do-not-repoint rule. | P1 |
| REQ-006 | Symlink targets are relative, not absolute machine-specific paths. | P1 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: All 34 extracted paths resolve on disk before linking. **MET** — 16/16 Codex, 18/18 Claude.
- **SC-002**: `find .codex/hooks .claude/hooks -type l ! -exec test -e {} \; -print` returns empty. **MET**.
- **SC-003**: Per-file sweep completed for all 34. **MET** — Codex 14/16 identical, Claude 16/18 identical.
- **SC-004**: The 4 differing scripts are named individually in the relevant README. **MET** — Codex: `session-start.js`, `user-prompt-submit.js`; Claude: `session-prime.js`, `install-codex-hooks.mjs`.
- **SC-005**: A false-positive reading was caught and corrected before it reached the docs. **MET** — an initial pass mistook "empty output" for a tripped guard; several Claude/Codex hooks legitimately approve by emitting nothing, so the sweep was redone as a symlink-vs-real comparison.
- **SC-006**: Both runtime configs unchanged. **MET**.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- **A future edit repoints a runtime config at its mirror, silently darkening session priming or prompt-time context.** Mitigation: each README names the affected scripts explicitly and states the rule; the affected set is per-runtime, so neither README relies on the reader having seen the Cursor one.
- **The Cursor finding could have been over-generalized into "all compiled `.js` hooks break through symlinks."** Mitigation: the sweep disproved that — Claude's `user-prompt-submit.js` works through its symlink while Codex's identically-named sibling does not; the READMEs state this explicitly so nobody re-derives the wrong rule.
- **Mirrors drift as hooks are added or removed.** Mitigation: same class of drift the existing "Adding/Removing a Hook" maintenance checklist already covers for every runtime; the extraction is scripted, so regenerating is cheap.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- **NFR-P01**: Symlink targets stay relative so the mirrors survive a fresh clone on another machine.

## 8. EDGE CASES
- Two different skills owning scripts with the same basename would collide in a flat mirror; the generator prefixes the owning skill directory in that case. No collision actually occurred across either runtime.
- A hook that legitimately emits nothing on approve is indistinguishable from a tripped guard when tested in isolation — which is exactly the false positive this phase hit and corrected. Any future re-sweep must compare against the real path, never test the symlink alone.

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|---|---|---|
| Scope | 7/25 | Two symlink folders plus two READMEs; no code, no config change. |
| Risk | 5/25 | Additive and organizational; neither runtime config was touched. |
| Research | 8/20 | Required programmatic extraction from two different config schemas plus a 34-script empirical sweep, including catching and correcting a false positive. |
| **Total** | **20/70** | **Level 2** |

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Mirror mistaken for the wiring source | Low | Medium (4 hooks would silently go dark) | Named affected sets + explicit rule in both READMEs |
| Over-generalized "all .js break" rule | Medium | Low (unnecessary caution) | Counter-example documented in the Claude README |
| Broken symlink after a future file move | Low | Low (organizational only) | Cheap `find ... ! -exec test -e` re-check |

## 11. USER STORIES
- As the operator, I want each runtime's full hook inventory visible in one folder, the same way Cursor's now is, instead of scattered across five skill trees.
- As a maintainer, I want to know precisely which scripts are unsafe to invoke through the mirror, per runtime, rather than a blanket warning I have to re-verify myself.

## 12. OPEN QUESTIONS
None — the affected set was determined empirically for every mirrored script.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../016-cursor-mcp-wiring-and-route-guard-fix/spec.md` (predecessor)
- `../014-cursor-hooks-discovery-mirror/spec.md` (the pattern this phase extends cross-runtime)
- `.codex/hooks/README.md`, `.claude/hooks/README.md`
