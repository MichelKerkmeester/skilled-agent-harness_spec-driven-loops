---
title: "Implementation Plan: Strip tool over-grant from the read-and-guide /design:* wrappers"
description: "Set the four read-and-guide /design:* wrapper allowed-tools to the least-privilege set (Read, Glob, Grep) so they match the command-metadata.json toolPolicy SSOT, keeping md-generator as the only mutating wrapper."
trigger_phrases:
  - "d2-r1 tool over-grant"
  - "strip write edit bash design wrappers"
  - "read-and-guide least privilege"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/001-strip-tool-over-grant"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Mark plan phases complete; align L2 anchors to the manifest contract"
    next_safe_action: "Run D2-R2 to write per-command argument-hint and aliases to the wrappers"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-d2-r1-strip-tool-over-grant"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Strip tool over-grant from the read-and-guide /design:* wrappers

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | OpenCode command wrappers (`.opencode/commands/design/*.md` frontmatter) |
| **SSOT** | `.opencode/skills/sk-design/command-metadata.json` → `toolPolicy{mutatesWorkspace}` (read-only here) |
| **Gate** | `.opencode/skills/sk-design/design-command-surface-check.mjs` (tool-policy parity check) |
| **Verification** | Deterministic checker exit code + frontmatter grep; no test runtime |

### Overview
The four read-and-guide design commands (`interface`, `foundations`, `motion`, `audit`) only read and guide — they cite the shared design reference base and never mutate the workspace — yet every wrapper carries the same mutating toolset `Read, Write, Edit, Bash, Glob, Grep`. This phase removes `Write, Edit, Bash` from those four wrappers, leaving the least-privilege set `Read, Glob, Grep`, so each wrapper's declared tools match its `command-metadata.json` `toolPolicy.mutatesWorkspace: false`. The only mutating mode, `md-generator` (which runs the embedded Playwright extract-write-validate pipeline), keeps its full toolset and is left untouched. The change is frontmatter-only; the thin-bridge prose is not edited.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] D2-R3 (command-metadata SSOT) is complete: `command-metadata.json` exists and carries a `toolPolicy{mutatesWorkspace}` entry per command, and `design-command-surface-check.mjs` is present. — sibling 003-command-metadata-ssot landed both files.
- [x] The five current wrapper `allowed-tools` lines have been read. — baseline captured as `Read, Write, Edit, Bash, Glob, Grep` on all five.
- [x] The read-and-guide vs mutating split is confirmed against `sk-design/SKILL.md` (four doc-guidance modes are read-and-guide; `md-generator` is the only Write/Edit/Bash mode).

### Definition of Done
- [x] The four read-and-guide wrappers declare `allowed-tools: Read, Glob, Grep` (no Write/Edit/Bash). — grep confirms `audit/foundations/interface/motion` all read `Read, Glob, Grep`.
- [x] `md-generator` wrapper `allowed-tools` is unchanged. — still `Read, Write, Edit, Bash, Glob, Grep`.
- [x] `design-command-surface-check.mjs` clears the allowed-tools drift for the four wrappers. — surface drift dropped 14 → 10; remaining 10 is argument-hint + aliases (D2-R2).
- [x] Each of the four commands still loads its mode as a thin bridge. — frontmatter parses; bridge prose untouched.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Least-privilege command surface aligned to a single metadata source of truth. The wrapper frontmatter is a projection of `command-metadata.json`; the checker drift-gates the projection.

### Key Components
- **Read-and-guide wrappers** (`interface.md`, `foundations.md`, `motion.md`, `audit.md`): thin bridges into doc-guidance modes; target tool set `Read, Glob, Grep`.
- **Mutating wrapper** (`md-generator.md`): thin bridge into the Playwright extract mode; tool set `Read, Write, Edit, Bash, Glob, Grep` (frozen — out of scope to edit).
- **`command-metadata.json` `toolPolicy{mutatesWorkspace}`**: the SSOT this phase reads. `false` → no mutating tools; `true` → mutating tools allowed.
- **`design-command-surface-check.mjs`**: asserts each wrapper's `allowed-tools` matches its metadata `toolPolicy` (a `mutatesWorkspace:false` command carrying Write/Edit/Bash fails the gate).

### Data Flow
1. Implementer reads `command-metadata.json` and resolves each command's `toolPolicy.mutatesWorkspace`.
2. For every `mutatesWorkspace:false` command, the wrapper `allowed-tools` line is rewritten to `Read, Glob, Grep`.
3. The `mutatesWorkspace:true` command (`md-generator`) is left as-is.
4. The checker re-reads both surfaces and confirms tool-policy parity; exit 0 means no mutation-free command still declares mutating tools.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm the SSOT
- [x] Verify D2-R3 has landed: `command-metadata.json` and `design-command-surface-check.mjs` exist. — both present under `sk-design/`.
- [x] Read `toolPolicy.mutatesWorkspace` for all five commands; confirm the four doc-guidance commands are `false` and `md-generator` is `true`. — confirmed against the SSOT.
- [x] Read the five current wrapper `allowed-tools` lines to capture the baseline. — all five baselined at `Read, Write, Edit, Bash, Glob, Grep`.

### Phase 2: Strip the over-grant
- [x] Rewrite `interface.md` `allowed-tools` to `Read, Glob, Grep`. — line 4 now `Read, Glob, Grep`.
- [x] Rewrite `foundations.md` `allowed-tools` to `Read, Glob, Grep`. — line 4 now `Read, Glob, Grep`.
- [x] Rewrite `motion.md` `allowed-tools` to `Read, Glob, Grep`. — line 4 now `Read, Glob, Grep`.
- [x] Rewrite `audit.md` `allowed-tools` to `Read, Glob, Grep`. — line 4 now `Read, Glob, Grep`.
- [x] Leave `md-generator.md` `allowed-tools` untouched. — still `Read, Write, Edit, Bash, Glob, Grep`.

### Phase 3: Verification
- [x] Run `design-command-surface-check.mjs`; confirm the allowed-tools drift for the four wrappers is gone. — surface drift dropped 14 → 10; the 4 allowed-tools drifts cleared.
- [x] Grep the four wrappers to confirm no `Write`, `Edit`, or `Bash` remains in `allowed-tools`. — none remain.
- [x] Grep `md-generator.md` to confirm its mutating tools are intact. — `Write, Edit, Bash` still present.
- [x] Confirm each of the four commands still loads its mode (bridge prose intact, frontmatter still valid). — wrappers still parse; bridge prose unchanged.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Wrapper `allowed-tools` equals metadata `toolPolicy` | `design-command-surface-check.mjs` |
| Static | No `Write`/`Edit`/`Bash` in the four read-and-guide wrappers; md-generator intact | Grep over `allowed-tools` lines |
| Smoke | Each thin bridge still loads its mode | Manual command load / frontmatter parse |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| D2-R3 command-metadata SSOT (`command-metadata.json` + `toolPolicy{mutatesWorkspace}`) | Internal (sibling phase) | Required first | No SSOT to align against — phase cannot start |
| `design-command-surface-check.mjs` | Internal (sibling phase) | Required first | No deterministic parity gate to verify against |
| `sk-design/SKILL.md` read-and-guide vs mutating split | Internal | Green | Mode classification ambiguous |

**Sequencing:** This phase MUST run AFTER D2-R3. `command-metadata.json` may not exist yet when this is picked up; if so, the phase blocks on D2-R3 rather than authoring the metadata itself. The implementer reads the metadata `toolPolicy` as the source of truth and only edits wrapper frontmatter.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A stripped wrapper fails to load its mode, or the checker regresses.
- **Procedure**: Restore the affected wrapper's `allowed-tools` line to the prior `Read, Write, Edit, Bash, Glob, Grep` value; re-run the checker.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
D2-R3 (metadata SSOT + checker) ──> Phase 1 (Confirm SSOT) ──> Phase 2 (Strip) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| D2-R3 (sibling) | None | Confirm SSOT |
| Confirm SSOT | D2-R3 | Strip |
| Strip | Confirm SSOT | Verify |
| Verify | Strip | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm SSOT | Low | 15 minutes |
| Strip over-grant (4 wrappers) | Low | 20 minutes |
| Verification (checker + grep) | Low | 15 minutes |
| **Total** | | **~50 minutes** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline `allowed-tools` lines captured for all five wrappers. — all five baselined at `Read, Write, Edit, Bash, Glob, Grep`.
- [x] Checker surface-drift baseline captured before the edit. — implementer baseline `drift=14`.
- [x] Confirmed `md-generator.md` is excluded from the edit set. — left byte-unchanged.

### Rollback Procedure
1. **Immediate**: Restore the failing wrapper's `allowed-tools` line to `Read, Write, Edit, Bash, Glob, Grep`.
2. **Verify**: Re-run `design-command-surface-check.mjs`; confirm it returns to its prior result.
3. **Scope check**: Confirm no file outside the four wrapper frontmatter blocks was changed.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Frontmatter-only revert; no data to preserve.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Frontmatter-only edit to four wrappers; md-generator frozen
- Depends on D2-R3 metadata SSOT + checker
- Per-command allowed-tools target in §3 / Phase 2
-->
