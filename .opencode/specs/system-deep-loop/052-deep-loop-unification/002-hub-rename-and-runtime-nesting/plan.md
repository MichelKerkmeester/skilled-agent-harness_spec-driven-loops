---
title: "Implementation Plan: Hub Rename + Runtime Nesting"
description: "Staged, gated plan for the irreversible structural merge of deep-loop-runtime into deep-loop-workflows as system-deep-loop."
trigger_phrases:
  - "hub rename runtime nesting plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting"
    last_updated_at: "2026-07-08T06:40:24.201Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Revised with corrections from 001-reference-research's research.md"
    next_safe_action: "Execute Stage 0 (recovery baseline + quiesce)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-002-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Hub Rename + Runtime Nesting

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript/CommonJS (`.ts`/`.cjs`), JSON metadata |
| **Framework** | git mv (rename-detection-preserving), vitest, `tsc` |
| **Testing** | `runtime/`'s own vitest suite (**71 files / 659 tests as of 001's research, not the earlier 47/379 estimate — 2 known pre-existing deterministic failures unrelated to the merge: `check-contract-drift.vitest.ts`, `executor-provenance-mismatch.vitest.ts`, neither in `loop-lock.vitest.ts`**), `system-spec-kit/mcp_server`'s `test:council` (**currently RED, 2/9 files failing, both pre-existing and unrelated: `multi-ai-council-runtime-parity.vitest.ts` expects a nonexistent `.toml` agent file; a persist-artifacts test expects a missing fixture**) |

### Overview
5 sub-stages, additive-first, isolating the one irreversible move (Stage 2) behind an explicit recovery baseline (Stage 0). Mirrors the sk-design (154) precedent's staging discipline, extended with two sub-stages 154 never needed: internal bidirectional path repair (Stage 3a) and the `system-spec-kit` tooling-borrow repair (Stage 3b).

**Revised per `001-reference-research/research/research.md`** (20-replica fanout + 5 substitute deep-dives, full findings there): this plan's original path-repair tables undercounted several sites and Stage 2's SKILL.md/README.md handling had a severe defect (would destroy real content). All corrections below are folded in; §1's finding numbering matches research.md's.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 001-reference-research synthesis reviewed; this plan revised if it surfaced corrections.
- [ ] Recovery baseline chosen (worktree snapshot or pre-move tag).

### Definition of Done
- [ ] `system-deep-loop/` exists, `runtime/` nested inside, `deep-loop-workflows/`+`deep-loop-runtime/` gone.
- [ ] Both coupling directions repaired; `npm test` green in `runtime/`; `npm run test:council` green in `system-spec-kit/mcp_server/`.
- [ ] Exactly one `graph-metadata.json`; version `2.0.0.0` consistent everywhere; `changelog/v2.0.0.0.md` written.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

See spec.md §8 for the target layout and the forward/reverse path-repair rule. Concrete site tables below.

### Class A — forward coupling (`runtime` → workflows-content), same hop-count, delete segment

| File | Before | After |
|---|---|---|
| `runtime/scripts/render-command-contract.cjs:11` (require) | `require('../../deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs')` | `require('../../shared/rollout/resolve-injection-mode.cjs')` |
| `runtime/scripts/render-command-contract.cjs` (its own `WORKSPACE_ROOT` constant, separate from the require above — **missed in the original table, confirmed by 001's research**) | `path.resolve(__dirname,'..','..','..','..')` | add one more `'..'` |
| `runtime/scripts/compile-command-contracts.cjs` (44 literals + `WORKSPACE_ROOT` anchor, plus 2 self-referencing literals at lines 22-23 pointing at `executor-audit.ts`/`post-dispatch-validate.ts` — rendered into contract markdown, not `sha256File`-checked, so won't crash but leaves dead paths in every compiled `/deep:*` contract if missed) | `.opencode/skills/deep-loop-workflows/...`; `path.resolve(__dirname,'..','..','..','..')` | `.opencode/skills/system-deep-loop/...`; add one more `'..'` |
| `runtime/scripts/check-contract-drift.cjs` (`SHARED_AUTHORITY_SOURCES`) | same family | rename only |
| `runtime/scripts/fanout-run.cjs:942-943` | `'.opencode/skills/deep-loop-workflows/deep-review/SKILL.md'` | `'.opencode/skills/system-deep-loop/deep-review/SKILL.md'` |
| **10 files in `runtime/tests/unit/*.vitest.ts`, not 7 as originally listed** — the 3-ups `nodeRequire()` style (7 files, e.g. `nodeRequire('../../../deep-loop-workflows/deep-research/scripts/reduce-state.cjs')`) **plus 3 more using `WORKSPACE_ROOT`-anchored literals, missed originally**: `meta-loop-lane-d-packaging.vitest.ts:15,19,24` (load-bearing `readJson` calls), `check-contract-drift.vitest.ts:51,53`, `prompt-pack.vitest.ts:102,104,115-145` (also hardcodes a machine-specific absolute path, a pre-existing unrelated portability issue) | 3 ups (nodeRequire style) / `WORKSPACE_ROOT` literal (other 3) | same 3 ups, delete segment / add one more `'..'` |
| `runtime/tests/unit/runtime-capabilities-matrix-conformance.vitest.ts:25` and `deep-research-convergence-floor.vitest.ts:24` (both use `resolve(__dirname,'..','..','..','deep-loop-workflows')`-style path arithmetic, a different shape than the nodeRequire rows above — **needs an ADDED hop, not same-hop-delete-segment**) | 4-ups-then-literal-segment | 5-ups-then-literal-segment (verify against live file before editing, this shape is easy to get backwards) |

### Class B — reverse coupling (workflows-content → `runtime`), minus one hop, rename segment

| File | Before | After |
|---|---|---|
| `deep-research/scripts/reduce-state.cjs:15` | `require('../../../deep-loop-runtime/lib/deep-loop/artifact-root.cjs')` (3 ups) | `require('../../runtime/lib/deep-loop/artifact-root.cjs')` (2 ups) |
| `deep-research/scripts/runtime-capabilities.cjs:18` (**missed in original table**) | 3 ups | 2 ups, rename |
| `deep-review/scripts/reduce-state.cjs:14` (**missed — original only named `deep-research`'s copy**) | 3 ups | 2 ups, rename |
| `deep-review/scripts/runtime-capabilities.cjs:18` (**missed**) | 3 ups | 2 ups, rename |
| `deep-ai-council/scripts/orchestrate-topic.cjs:14-18` (5 requires) | 3 ups | 2 ups, rename |
| `deep-ai-council/scripts/orchestrate-session.cjs:16-18` (3 requires, **missed in original table**) | 3 ups | 2 ups, rename |
| `deep-ai-council/scripts/tests/*.vitest.ts` (nested one level deeper) | 4 ups | 3 ups, rename |
| `deep-improvement/scripts/shared/improvement-journal.cjs:24` | 4 ups | 3 ups, rename |
| `deep-improvement/scripts/shared/reduce-state.cjs:124` (`path.join` array form) | `path.join(__dirname,'..','..','..','..','deep-loop-runtime','lib','deep-loop')` | `path.join(__dirname,'..','..','..','runtime','lib','deep-loop')` |
| `deep-ai-council/scripts/replay-graph-from-artifacts.cjs:26,56,65` (**missed — different shape entirely, not hop-count math**: a repo-root-detection walk building `path.join(root,'.opencode','skills','deep-loop-runtime',...)`) | segment `'deep-loop-runtime'` | needs a segment **inserted**, not hop-decremented: `'system-deep-loop','runtime'` |

All Class-B files not called out above follow the standard pattern regardless of depth (`scripts/` = 3→2 ups; `scripts/{tests,shared}/` = 4→3 ups). None of `orchestrate-session.cjs`, `replay-graph-from-artifacts.cjs`, or `deep-ai-council/scripts/tests/*.vitest.ts` are exercised by any wired `npm test`/`npm run test:council` — verify these by direct read after editing, not by trusting a green test run.

### `system-spec-kit` tooling-borrow (Stage 3b, load-bearing — do not defer to child 003)

**This is really ~15+ sites, not 4** — confirmed by 001's research. Core config-file pair:

| File | Before | After |
|---|---|---|
| `runtime/package.json` `typecheck` script | `../system-spec-kit/node_modules/.bin/tsc ...` | `../../system-spec-kit/node_modules/.bin/tsc ...` |
| `runtime/tsconfig.json` `typeRoots` | `["../system-spec-kit/node_modules/@types"]` | `["../../system-spec-kit/node_modules/@types"]` |
| `system-spec-kit/mcp_server/package.json` `test:council` (**the line has TWO `../../deep-loop-runtime/` occurrences, not one — `council-graph-script.vitest.ts` AND `council-graph-value-scenarios.vitest.ts`, both need the fix**) | `../../deep-loop-runtime/tests/integration/{council-graph-script,council-graph-value-scenarios}.vitest.ts` | `../../system-deep-loop/runtime/tests/integration/{...}.vitest.ts` |
| `system-spec-kit/mcp_server/vitest.config.ts` include glob | `'../deep-loop-runtime/tests/**/*.{vitest,test}.ts'` | `'../system-deep-loop/runtime/tests/**/*.{vitest,test}.ts'` |

**Missed production-code sites (fix in this stage, same pattern as the config pair above):**

| File | Before | After |
|---|---|---|
| `runtime/lib/deep-loop/artifact-root.cjs:18` | `path.join(__dirname,'..','..','..','system-spec-kit','shared','review-research-paths.cjs')` (3 ups) | add one more `'..'` (4 ups) |
| `runtime/tests/unit/artifact-root.vitest.ts:11` | `'../../../system-spec-kit/shared/review-research-paths.cjs'` | add one more `'../'` |

**`test:council`-internal fix required in this stage even though the file is `system-spec-kit`-owned** — otherwise `test:council` hard-crashes on the very first file it runs, making Phase 3's exit gate unrunnable regardless of whether 002's own edits are correct:

| File | Issue | Fix |
|---|---|---|
| `system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts` | `readdirSync` on `PLAYBOOK_ROOT = join(WORKSPACE_ROOT, '.opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook')` as its FIRST statement — throws synchronously (ENOENT) post-move if unfixed, plus a second hardcoded path + 2 regexes referencing `deep-loop-runtime/tests` | Update `PLAYBOOK_ROOT`, `DEEP_LOOP_RUNTIME_TEST_ROOT`, and both regex patterns to the new paths |

Informational, lower-severity, likely swept by the residual-grep sweep in child 003 without needing itemization here: `mcp_server/tests/memory-runtime-retention.vitest.ts:9`, `scripts/tests/deep-review-auto-restart-contract.vitest.ts:19`.

**Test-suite reliability caveat**: `tests/unit/dependency-seams.vitest.ts` does NOT fail post-move — it computes `skillsRoot` via a relative walk that becomes one level too shallow after the merge, so its "never resolves an external dependency through a sibling skill" assertion trivially passes regardless of whether a real reach-in regression exists. A green run of this specific file after the move should NOT be trusted as confirming no regression — re-derive `skillsRoot` correctly (should still resolve to `.opencode/skills/`, not `.opencode/skills/system-deep-loop/`) as part of this stage's edits, don't just leave it as-is. Two more files (`optimizer-manifest-anti-convergence.vitest.ts`, `deep-research-convergence-floor.vitest.ts`) use the same `resolve(testDir,'..','..','..','..')` idiom and need an ADDED hop post-move (already captured in the Class A table above) — without the fix they fail loudly (ENOENT), which is the safer failure mode of the two.

Decision: fix paths only, do not decouple `runtime/`'s TypeScript tooling from `system-spec-kit` in this phase — bundling a decoupling change would make a merge failure and a decoupling failure indistinguishable during validation. Tracked as follow-up hardening, out of scope.

### Stage 2 addendum — `SKILL.md` → `README.md` handling (CORRECTED, was a severe defect)

**`runtime/README.md` already exists today** (18,543 bytes, real distinct content — the pre-existing operator-facing overview), separate from `SKILL.md` (22,320 bytes, the routable-skill identity file). The original plan's "demote SKILL.md → README.md" instruction was written as if README.md didn't already exist — as literally written it would either silently overwrite real content or fail outright on `git mv` to an existing target.

**Corrected Stage 2 procedure**: do NOT `git mv`/overwrite `README.md`. Instead: (1) read both files in full; (2) fold whatever genuinely-useful identity/activation-trigger/contributor-guidance content from `SKILL.md` is worth preserving into a NEW section of the existing `README.md` (or a clearly-separated appendix), stripping the routable-skill frontmatter (`name:`/`version:`/`allowed-tools:`) entirely — do not leave a second frontmatter block; (3) delete `SKILL.md` only after its useful content is confirmed folded in, not before; (4) grep for any consumer expecting `runtime/SKILL.md` specifically before deleting (see the Lane-D profile below — it's one, there may be others).

**Also fix in this stage**: `deep-loop-workflows/deep-improvement/assets/non_dev_ai_system/profiles/deep-loop-runtime.json` (a live, consumed Lane-D self-target benchmark profile reached via `/deep:ai-system-improvement --self-target deep-loop-runtime`) has `"packaging_root": ".opencode/skills/deep-loop-runtime"`, 4 `frozenSurfaces[].relpath`, 5 `editableTechDocs[].relpath`, 5 `allowedDiffRelpaths` (all under the moving paths), AND `"frozen_surface": [{"live_relpath": "SKILL.md", "section_anchor": "## 3. HOW IT WORKS", ...}]` — this last field is not caught by any grep-based verification since it's a bare filename, not a skill-name string, and it directly conflicts with the corrected Stage 2 procedure above (the file it expects to score/freeze won't exist in that form). Update all path fields to `system-deep-loop/...`, and either repoint `live_relpath` to `README.md` with a confirmed-present anchor, or explicitly retire Lane-D self-targeting of `runtime` as part of this edit — don't leave it silently stale.

### `graph-metadata.json` consolidation

Fresh-author (not N-way merge), matching the 154 precedent. Carry forward `depends_on: system-spec-kit`, `enhances: system-spec-kit`, `siblings: sk-prompt`. Drop the `deep-loop-runtime ↔ deep-loop-workflows` edges entirely — they become intra-skill structure. Preserve `deep-loop-runtime`'s `packet_id: "116-deep-skill-evolution"` lineage narratively (this packet's spec.md + the new `changelog/v2.0.0.0.md`), not structurally.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (Stage 0 — pre-flight, no tracked-file changes)
- [ ] Establish recovery baseline (worktree snapshot or pre-move tag).
- [ ] Quiesce: confirm zero in-flight `/deep:*` sessions, zero stale writer-lock files under `runtime/database/`.
- [ ] Capture baseline: `cd deep-loop-runtime && npm test` (expect ~71 files/659 tests; 2 known pre-existing failures — `check-contract-drift.vitest.ts`, `executor-provenance-mismatch.vitest.ts` — record the EXACT current numbers, don't assume they still match this snapshot). Also capture `cd system-spec-kit/mcp_server && npm run test:council` (expect 2/9 files failing, pre-existing, unrelated).
- [ ] Snapshot SQLite checksums + `observability-events.jsonl` line count.

### Phase 2: Core Implementation
- [ ] **Stage 1**: `git mv deep-loop-workflows system-deep-loop`; edit identity fields (`SKILL.md`, `description.json`, `mode-registry.json`, `hub-router.json`, `graph-metadata.json` `skill_id`, README title) inside that tree only.
- [ ] **Stage 2**: `git mv deep-loop-runtime system-deep-loop/runtime`; delete `runtime/graph-metadata.json`; apply the CORRECTED SKILL.md/README.md reconciliation procedure above (fold content, do not overwrite); fix the Lane-D self-target profile.
- [ ] **Stage 3a**: apply the expanded Class A + Class B path repairs above (10+16 files, plus the 2 special-shape files).
- [ ] **Stage 3b**: apply the expanded `system-spec-kit` tooling-borrow repairs above (config pair + `artifact-root.cjs`/test companion + `council-playbook-anchor-integrity.vitest.ts`); re-derive `dependency-seams.vitest.ts`'s `skillsRoot` correctly, don't just leave its now-blind assertion in place.
- [ ] **Stage 3c (new — closes the B.2 sequencing gap)**: pull forward just the 3 router `.md` one-liners (`.opencode/commands/deep/{research,review,ai-council}.md`) that invoke `render-command-contract.cjs` by hardcoded path — a 1-line edit each, needed so Phase 3's live-verification step below has a working command surface before child 003 formally lands. Does not touch any other file in child 003's scope.
- [ ] **Stage 4**: fresh-author `graph-metadata.json`; bump version to `2.0.0.0` across `SKILL.md`/`description.json`/`mode-registry.json`/`hub-router.json`; write `changelog/v2.0.0.0.md`.

### Phase 3: Verification
- [ ] `package_skill.py --check` on the renamed hub and all 4 mode packets.
- [ ] `find system-deep-loop -iname graph-metadata.json | wc -l` == 1.
- [ ] `cd system-deep-loop/runtime && npm test` — compare against the Stage-0 baseline (71 files/659 tests, 2 known pre-existing failures), not the stale 47/379 figure. Pass = no NEW failures beyond the 2 already-known ones.
- [ ] `cd system-deep-loop/runtime && npm run typecheck` succeeds.
- [ ] `cd system-spec-kit/mcp_server && npm run test:council` — compare against the Stage-0 baseline (already RED, 2/9 files, both pre-existing and unrelated to the merge). Pass = no NEW failures beyond the 2 already-known ones.
- [ ] `git log --follow -- system-deep-loop/runtime/database/observability-events.jsonl` surfaces pre-move commits; SQLite checksums + jsonl line count match Stage-0 snapshot.
- [ ] A live `/deep:research` or `/deep:review` short run confirms reverse-direction `require()`s resolve at execution time. **Use `kind: cli-opencode` or plain in-session (non-fanout) dispatch — NOT `cli-claude-code`.** 001's research confirmed `cli-claude-code`'s headless subprocess dispatch fails macOS Keychain auth in this environment (`Not logged in · Please run /login`, reproduced 5/5 in the research fanout); this is an unrelated, unresolved infra gap that would make this verification step's failure ambiguous (broken `require()` vs. known auth gap) if not avoided.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/integration | `runtime/`'s full vitest suite | `npm test` inside `runtime/` |
| Cross-skill integration | `system-spec-kit`'s council test glob | `npm run test:council` in `mcp_server/` |
| Static | Residual grep for old names inside code paths | `grep -rn "deep-loop-workflows\|deep-loop-runtime" system-deep-loop --include="*.cjs" --include="*.ts"` |
| Live | Real loop dispatch confirms reverse `require()`s resolve | A short `/deep:research` or `/deep:review` run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001-reference-research synthesis | Internal | Pending | This phase does not start until 001 completes |
| Git rename-detection (`-M`/similarity) | Tooling | Confirmed reliable at both directory and single-file scope | N/A |

### Downstream
Child 003's reference-migration edits target paths that only exist once this phase lands.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `runtime`'s vitest suite or `test:council` shows any failure NEW beyond the 2+2 known pre-existing ones captured at Stage 0; residual-grep sweep finds unresolved code-path hits; SQLite/jsonl checksums don't match post-move; `dependency-seams.vitest.ts` passing is not itself a trust signal — confirm its `skillsRoot` derivation was actually corrected, not just left green-by-accident.
- **Procedure**: Stages 1/3a/3b/4 (text-only edits) revert cleanly via `git revert`. Stage 2 (the physical move) rolls back via the Stage-0 recovery baseline (`git restore`/reset to the pre-move tag, or discard the worktree).
<!-- /ANCHOR:rollback -->
