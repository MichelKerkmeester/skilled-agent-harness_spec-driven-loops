---
title: "Session Handover Document: sk-vision packet (001-010)"
description: "Handover for the completed sk-vision packet: 001-005 shipped fork + 006-010 standards-realignment amendment, all gates green."
trigger_phrases:
  - "sk-vision handover"
  - "sk-vision resume"
  - "sk-vision session handover"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses"
    last_updated_at: "2026-08-16T10:30:00.000Z"
    last_updated_by: "pi"
    recent_action: "Wrote packet handover after 010 closed."
    next_safe_action: "Commit when the operator asks."
    blockers: []
    key_files:
      - "spec.md"
      - "handover.md"
      - "010-quality-gate/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-handover-20260816"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Session Handover Document

Handover for the sk-vision packet (`specs/sk-vision/001-sk-vision-fork-of-opencode-senses`): upstream OpenCode Senses fork into a class-S standalone skill with OpenCode + Pi adapters, plus the 006-010 amendment that brought the shipped skill to sk-create-skill conformance. **Status: complete** (nothing committed — commit is the operator's call).

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

**Status values:** draft | in_progress | review | complete | archived — this packet is **complete**.

**This handover serves:**
- The operator deciding on commit/push.
- Any future session resuming the packet (`/speckit:resume specs/sk-vision/001-sk-vision-fork-of-opencode-senses/`).
- Anyone auditing the 006-010 amendment evidence.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** pi, 2026-08-16 (autonomous run: 6 sequential `opencode-go/deepseek-v4-flash` worker agents; mission `c3f32976-2e06-4a0d-aa6e-235c7a4320b4`)
- **To Session:** operator / next implementer
- **Phase Completed:** ALL — 001-research (Complete), 002-005 (shipped, Complete), 006-010 (amendment, Complete)
- **Handover Time:** 2026-08-16
- **Recent action**: 010-quality-gate closed: every skill gate re-run from final state, metadata reconciled, final sweep clean; packet recursive strict gate 11/11 folders PASSED (0 errors / 0 warnings each)
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
| ------------ | --------- | ---------------------- |
| Standalone class-S skill holds the runtime package (ADR-001) | One advisor identity, matches sk-communication | `.opencode/skills/sk-vision/` owns `vision-runtime/` |
| Fork shipped Senses v0.2.0, moondream2 default (ADR-002/003) | PLAN.md audio/video/docs are unbuilt | `context/` stays the read-only dump |
| Rebrand to `sk-vision` incl. `SK_VISION_*` env + cache names (ADR-004) | No npm/cache collision; MIT notice kept | 13 `sk_vision_*` tools; `<SK-VISION>` envelope |
| 006-010 amendment after 002-005 shipped | Shipped skill docs were still scaffold stubs; catalog/playbook missing | SKILL.md/README rewritten; package hygiene; input.images wired; catalog + playbook + benchmark shipped |
| **Never publish to npm** | Fork is private; upstream identity belongs in LICENSE only | `publishConfig` + `publish:npm` removed from `vision-runtime/package.json` |
| Pi `input.images` auto-inspect wired with bounded 2s race | Closes the recorded P1 gap; mirrors OpenCode AttachmentInjector | `pi.on("input")` handler in `pi/sk-vision.ts`; never raises, skips extension/steer traffic |
| Catalog taxonomy: 5 categories / 16 features | One canonical capability inventory | `feature-catalog/` root + 16 anchored leaves |
| Playbook: VSN-001..016 in 5 categories | Operator validation corpus with evidence contract | `manual-testing-playbook/` + `benchmark/` run index; 2 live runs PASS |
| Gate = folder `RESULT: PASSED`, not wrapper exit code | Repo-wide COMMAND_TREE_PARITY drift makes wrapper exit 2 | All phase gates + 010 gate check folder results |
| `validate_catalog_package.py` (not `.cjs`) | The `.cjs` path in sk-create-feature-catalog SKILL.md is stale | Use the Python script; `.cjs` throws MODULE_NOT_FOUND |
| Metadata regenerated via `backfill-graph-metadata.js` | `generate-context.js` aborts with INSUFFICIENT_CONTEXT_ABORT outside a real memory-save session | All new folders + parent have fresh fingerprints |

### 2.2 Blockers Encountered

**Blockers**: one pre-existing repo-wide drift; two tooling quirks (all resolved/documented).

| Blocker | Status | Resolution/Workaround |
| ----------- | --------------- | --------------------- |
| `validate.sh --strict` wrapper exits 2 via repo-wide COMMAND_TREE_PARITY (missing `.claude/hooks/git-primary-reconcile.sh`, `.codex/hooks/git-primary-reconcile.sh`) | Open (pre-existing, unrelated to sk-vision) | Treat folder `RESULT: PASSED` + `Summary: Errors: 0` as the gate; original 002-005 children documented the same |
| `validate_catalog_package.cjs` does not exist | Resolved | Use `.opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` |
| `generate-context.js` aborts (INSUFFICIENT_CONTEXT_ABORT) | Resolved | Use `.opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js <folder>` |
| `~/.cache/sk-vision/venv` lacks `transformers` | Open (outside packet scope) | Live inference beyond `status`/no-model handlers needs the weight download / transformers; tests pass hermetically without it |

### 2.3 Files Modified

**Key files**: skill tree under `.opencode/skills/sk-vision/`, spec packet under `specs/sk-vision/001-sk-vision-fork-of-opencode-senses/`, load paths `.opencode/plugins/` + `.pi/extensions/`.

| File | Change Summary | Status |
| ----------- | -------------- | ---------------------- |
| `.opencode/skills/sk-vision/SKILL.md` | Rewritten as the real executable contract (13 tools, runtime, env vars, adapters, SUCCESS CRITERIA; v0.1.1.0) | complete |
| `.opencode/skills/sk-vision/README.md` | Rewritten: accurate layout, quick start, env vars | complete |
| `.opencode/skills/sk-vision/references/runtime-reference.md` | New: protocol, tool semantics, env defaults, hardware notes | complete |
| `.opencode/skills/sk-vision/leaf-manifest.json` + `leaf-aliases.json` | Regenerated (`ci-skill-root-metadata.cjs --fix`) | complete |
| `.opencode/skills/sk-vision/vision-runtime/package.json` | publishConfig + publish:npm removed; repository omitted; author neutralized; dual-host description | complete |
| `.opencode/skills/sk-vision/vision-runtime/python/runtime.test.ts` | Interpreter discovery via auto-provisioned cache venv (documented deviation — required for hermetic tests after `.venv` deletion) | complete |
| `.opencode/skills/sk-vision/vision-runtime/.venv` | Deleted (22MB python3.9 residue) | complete |
| `.opencode/skills/sk-vision/pi/sk-vision.ts` | Added bounded `on("input")` auto-inspect (2s race, 32-entry cache, `<SK-VISION>` transform, never raises) | complete |
| `.pi/extensions/README.md` | P1-gap note removed; shipped hook documented | complete |
| `.opencode/skills/sk-vision/feature-catalog/**` | Root + 5 categories + 16 per-feature files with source/test anchors | complete |
| `.opencode/skills/sk-vision/manual-testing-playbook/**` | Root + 16 scenarios (VSN-001..016) | complete |
| `.opencode/skills/sk-vision/benchmark/**` | Run-index scaffold + 2 live runs (`status-live-run`, `ocr-live-run`) both PASS with evidence | complete |
| `specs/.../spec.md` (parent) | Amended: phases 006-010, map, handoff, open questions; Status Complete | complete |
| `specs/.../006-*` … `010-*` | 5 new phase suites (43 files) with copy packs, tasks, checklists, summaries | complete |
| `specs/.../002-skill-scaffold/001-skill-md/implementation-summary.md` | Stale `completion_pct: 0` → 100 | complete |
| `specs/.../005-pi-adapter/spec.md` | Successor → 006-skill-contract-realignment | complete |
| `specs/.../graph-metadata.json` (parent + new folders) | children_ids, last_active_child_id → 010, fresh fingerprints via backfill | complete |

### 2.4 Traps & Scar Tissue

Carry only what the next reader cannot re-derive: where a trap bit, what triggers it, and whether the guard is load-bearing or defensive.

| Trap / blast site | Activation condition | Load-bearing or defensive? | How to avoid re-paying it |
| ----------------- | -------------------- | -------------------------- | ------------------------- |
| Wrapper exit 2 on `validate.sh --strict` | Repo-wide COMMAND_TREE_PARITY drift (missing git-hook mirrors) | Defensive | Gate on folder `RESULT: PASSED`; ignore wrapper code after verifying Summary 0/0 |
| `.cjs` catalog validator | Running `validate_catalog_package.cjs` | Load-bearing | Use `validate_catalog_package.py`; the `.cjs` name in the sk-doc SKILL.md is stale |
| `generate-context.js` abort | Running it outside a real memory-save session | Load-bearing | Use `backfill-graph-metadata.js <folder>` for metadata-only refresh |
| `.venv` deletion breaks `bun test` | Interpreter discovery hardcodes the deleted venv | Load-bearing | Tests must use the runtime's auto-provisioned `~/.cache/sk-vision/venv` (fixed in `runtime.test.ts`) |
| Stale leaf manifests | Editing `references/` without `--fix` | Defensive | Always re-run `ci-skill-root-metadata.cjs --fix` after reference changes |
| Catalog/playbook treated as leafRoots | Adding them to `leaf-manifest.config.json` | Defensive | They are NOT routable leaves; `leafRoots` stays `["references"]` |
| Hand-authored benchmark reports | Editing `skill-benchmark-report.md` / `results.csv` | Load-bearing | Renderer-owned; a run writes them via `run-manual-playbook-scenario.cjs` |
| Zero `session_dedup.fingerprint` values in continuity blocks | Reading continuity after any save | Defensive | Packet-wide convention (grandfathered); graph-metadata carries the real fingerprints |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point
- **File:** `specs/sk-vision/001-sk-vision-fork-of-opencode-senses/spec.md` (phase map + handoff criteria)
- **Next safe action**: commit when the operator asks — nothing is committed, nothing pushed; everything is untracked under `.opencode/skills/sk-vision/` (expected) plus spec amendments.
- **Cold-read order**: `spec.md` (parent map) → `010-quality-gate/implementation-summary.md` (gate evidence) → `.opencode/skills/sk-vision/SKILL.md` (the contract) → `feature-catalog/feature-catalog.md` + `manual-testing-playbook/manual-testing-playbook.md` (inventory + validation).
- **Context:** the packet is complete and green; the only open items are operator decisions (commit, npm publish (default no), GPU live-run expansion).

### 3.2 Priority Tasks Remaining

1. **Operator decision: commit** — `git add` the skill tree + spec amendments when the operator approves (nothing is staged).
2. **Optional: complete live playbook runs** — VSN-001..016 scenarios exist; running them needs the model cache venv with `transformers` (blocker recorded in 2.2) or an operator-approved weight download (~3.9GB).
3. **Optional: npm publish** — only if the operator explicitly reverses the "never publish" decision; `publishConfig` was removed.
4. **Advisor ingestion check** — advisor daemon already recommends `sk-vision` (0.95/0.12 on a vision prompt); re-smoke after any future SKILL.md edit.

### 3.3 Critical Context to Load

- [x] Continuity: `_memory.continuity` in the parent `spec.md` is current (completion_pct 100; next action = commit on operator ask)
- [x] Spec file: parent `spec.md` (phase map, 006-010 briefs, handoff criteria)
- [x] Gate evidence: `010-quality-gate/implementation-summary.md` (command → exit table)
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

Before handover, verify:
- [x] All in-progress work complete (10/10 phases; packet recursive strict 11/11 folders PASSED)
- [x] Current context saved: parent continuity updated; graph-metadata regenerated via backfill
- [x] No breaking changes left mid-implementation
- [x] Tests passing: `bun run build && bun test` 8/8; SKILL.md validator 0; package_skill PASS; fleet 13/13; catalog PASS violations 0; playbook PASS 16 scenarios; DQI 88/100
- [x] This handover document is complete
- [x] Final sweep: no `.venv`, no temp/bak files, no hub JSON on skill root, `context/` diff empty, nothing staged
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

- **Execution model:** phases 006-001 → 006-002 → 007 → 008 → 009 → 010 were implemented by sequential `opencode-go/deepseek-v4-flash` worker agents from their spec.md copy packs, each with a host-side folder gate. 006-001 was verified independently after its first gate tripped on the parity-drift wrapper exit (work itself was clean).
- **Deviations (documented by implementers):** `python/runtime.test.ts` edited (hermetic interpreter discovery — sanctioned by the 006-002 copy pack); `repository` field omitted from package.json (copy pack default); `prepublishOnly` kept (inert without a publish command).
- **Known limitations (recorded in 010):** live model inference beyond `status` needs `transformers` in the cache venv; tests cover no-model handlers only; GPU hardware proof remains Apple-Silicon-only (MPS).
- **Packet convention:** children keep zero `session_dedup.fingerprint` (grandfathered); real fingerprints live in `graph-metadata.json` derived blocks.
<!-- /ANCHOR:session-notes -->
