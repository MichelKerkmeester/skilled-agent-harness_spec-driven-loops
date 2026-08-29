---
title: "Implementation Plan: Surface-Reality Conformance"
description: "Execution plan for building the cross-repo skill-reference drift guard, repairing the citations it found broken, and proving it cannot pass falsely."
trigger_phrases:
  - "obsidian surface reality conformance plan"
  - "sk-code-obsidian phase 013 plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/013-surface-reality-conformance"
    last_updated_at: "2026-08-29T00:05:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Surface-reality conformance guard + repair"
    next_safe_action: "None — this is the packet's final planned phase"
    blockers: []
    key_files:
      - "../../../tools/naming/scan-skill-references.mjs"
      - "../../../../Code_Environment/Public/.opencode/skills/sk-code/sk-code-obsidian/references/skill-reference-integrity.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-013"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Surface-Reality Conformance

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js drift-guard script (`.mjs`, no dependencies beyond Node's `fs`/`path`), markdown documentation, bash gate-runner wiring |
| **Framework** | The packet's existing `scripts/run-source-gates.sh` guard pattern (a guard is SKIP, not FAIL, if its script is absent) |
| **Storage** | One new script, one new reference document, edits to `SKILL.md` and the gates runner, 14 documents repaired |
| **Testing** | The guard run against the live post-rename tree; the plugin's own gate suite (`tsc`, `build`, `vitest`, `screenshots:verify`, `lint`) re-run to confirm no regression |

### Overview
Phase 010's 235-file rename passed every plugin gate cleanly because none of those gates read this
packet's prose — the packet lives in a different repository from the plugin's `tsc`/`vitest`/`lint`
toolchain. This phase closes that blind spot with a purpose-built guard,
`tools/naming/scan-skill-references.mjs`, that extracts filename/path citations from the packet's
markdown and resolves each one against the real plugin tree. Its first run reports `broken : 23` —
concrete proof the blind spot was real, not hypothetical. 14 documents are repaired across 26
substitutions, and the guard is wired into both `SKILL.md` and `run-source-gates.sh` so it becomes a
standing check, not a one-off script. The guard is then proven honest in both directions: a sentinel
path that must never resolve is confirmed to fail, and a deliberately planted dead citation is caught
and then confirmed cleared once removed. The plugin's own gate suite is re-run to confirm this
phase's changes (a new script, new documentation, edited packet markdown) introduce no regression.
The guard's own limit — it resolves paths, not claims — is carried forward explicitly as a standing
risk, not folded into a false "fully verified" claim.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Confirmed the existing `run-source-gates.sh` guard pattern (SKIP on absent script, not FAIL) as
      the integration model for the new guard.
- [x] Confirmed the packet's markdown does cite specific plugin filenames/paths, making a
      citation-resolution guard meaningful rather than a no-op.

### Definition of Done
- [x] `tools/naming/scan-skill-references.mjs` built and runs deterministically offline.
- [x] `references/skill-reference-integrity.md` written, documenting the guard's method and its
      sentinel counter-example.
- [x] `SKILL.md` updated: reference-map row, assets note naming the gates runner, two executable
      checks under INTEGRATION POINTS.
- [x] `scripts/run-source-gates.sh` updated to run the guard as a fourth check.
- [x] First run against the live tree: `broken : 23`. After repairing 14 documents (26
      substitutions), re-run: `broken : 0`.
- [x] Sentinel counter-example confirmed rejected (`counter-example rejected : yes`); planted dead
      citation caught (rc 1, `broken : 1`) then cleared (rc 0, `broken : 0`).
- [x] `bash scripts/run-source-gates.sh` reports all four guards PASS, rc 0.
- [x] Plugin gate suite re-confirmed at exact baseline: `tsc` 0, `build` 0, `vitest` 386,
      `screenshots:verify` 180 current, `lint` 115 (100 errors, 15 warnings).

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Resolve, don't assume. The guard extracts every filename/path citation from the packet's markdown
and checks each one against the real filesystem, rather than trusting that a rename's plugin-gate
success implies the packet's own prose stayed current.

### Key Components
- **`tools/naming/scan-skill-references.mjs`**: the drift guard. Extracts citations from the
  `sk-code-obsidian` packet's markdown, resolves each against the real plugin repository tree, and
  reports a `broken` count. Deterministic and offline — no network, no model dispatch, matching the
  existing guard family's constraints in `run-source-gates.sh`.
- **`references/skill-reference-integrity.md`**: documents why the guard exists, its resolution
  method, and — critically — the sentinel exclusion. One constant path is defined as a value that
  must never exist, so the guard has a built-in negative control: if that sentinel ever resolves, the
  guard's own logic is broken and its "broken : 0" result cannot be trusted.
- **`SKILL.md` wiring**: a reference-map row pointing at the new reference document, an assets note
  naming `run-source-gates.sh` as the runner, and two checks added under INTEGRATION POINTS so a
  reader of `SKILL.md` finds the guard without needing to discover it independently.
- **`run-source-gates.sh` wiring**: the guard is added as a fourth check alongside `scan-naming.mjs`,
  `scan-comments.mjs`, and `scan-folder-docs.mjs`, following the same SKIP-not-FAIL pattern for an
  absent script — this guard is not treated as a special case.
- **The counter-example proof**: after documenting the sentinel, the guard was found to be flagging
  the very document that explains the sentinel's exclusion, because the exclusion constant's own
  description looked like a citation. A scoped exclusion was added for that one constant — not a
  general allowlist — so the guard still catches every other broken citation while correctly not
  flagging the sentinel's own definition.
- **Bidirectional proof**: a citation to a deliberately nonexistent file was planted; the guard
  returned rc 1 and `broken : 1`. The planted citation was removed; the guard returned rc 0 and
  `broken : 0`. This confirms the guard responds to both directions of the underlying condition,
  not just the "everything already passes" case.

### Data Flow
`packet markdown` -> extract filename/path citations -> resolve each against the live plugin tree ->
report `broken` count.
`sentinel constant (must never exist)` -> attempt resolution -> must fail -> `counter-example
rejected : yes`, or the guard's own result is untrusted.
`first run (broken : 23)` -> repair 14 documents, 26 substitutions -> re-run (`broken : 0`) -> wire
into `SKILL.md` + `run-source-gates.sh` -> re-run full plugin gate suite to confirm no regression.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase
state. In brief: build the guard and its reference documentation, run it against the live tree to
surface the real drift count, repair every broken citation, wire the guard into `SKILL.md` and the
gates runner, prove the guard cannot pass falsely in both directions, then re-run the full plugin
gate suite to confirm no regression.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Drift detection (first run) | Confirm the guard finds real, pre-existing drift from the phase 010 rename | `node tools/naming/scan-skill-references.mjs` (initial: `broken : 23`) |
| Drift detection (post-repair) | Confirm every broken citation was actually fixed, not just some | `node tools/naming/scan-skill-references.mjs` (after repair: `broken : 0`) |
| Counter-example (sentinel) | Confirm the guard's resolver cannot trivially report zero regardless of real state | Guard's built-in sentinel check (`counter-example rejected : yes`) |
| Counter-example (planted/removed) | Confirm the guard responds correctly to both a broken and a fixed state | Plant a dead citation (rc 1, `broken : 1`) -> remove it (rc 0, `broken : 0`) |
| Gate-suite integration | Confirm the guard runs as part of the standing gate set | `bash scripts/run-source-gates.sh` — all four guards PASS, rc 0 |
| Plugin regression check | Confirm this phase's changes did not affect plugin build/test/lint | `npx tsc --noEmit` (0), `npm run build` (0), `npx vitest run` (386), `npm run screenshots:verify` (180), `npm run lint` (115: 100/15) |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `scripts/run-source-gates.sh`'s existing guard pattern | Internal | Green — read directly, followed exactly | The integration model for wiring the new guard in without a special case |
| Phase 010's 235-file rename | Internal (predecessor) | Green — the historical event this guard verifies against | The source of the drift the guard's first run (`broken : 23`) detects |
| The live plugin repository tree | Internal | Green — read/resolved directly by the guard at runtime | The guard's entire mechanism depends on filesystem resolution against the real tree, not a cached listing |
| The plugin's own gate suite (`tsc`, `build`, `vitest`, `screenshots:verify`, `lint`) | Internal | Green — re-run live, exact baseline match | Confirms this phase's script/doc/markdown changes introduced no regression |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the guard is later found to produce a false pass (a citation it should catch resolves
  incorrectly), or one of the 26 repair substitutions is found to have introduced an incorrect path.
- **Procedure**: `tools/naming/scan-skill-references.mjs` and `references/skill-reference-integrity.md`
  are new files — delete them and revert the two wiring edits in `SKILL.md` and
  `scripts/run-source-gates.sh` via `git checkout` to fully remove the guard. The 14 repaired
  documents' individual substitutions are each independently `git diff`-visible and revertible file
  by file if a specific repair is found wrong; re-running the guard after any revert immediately
  confirms whether `broken` returns to a nonzero count.

<!-- /ANCHOR:rollback -->
