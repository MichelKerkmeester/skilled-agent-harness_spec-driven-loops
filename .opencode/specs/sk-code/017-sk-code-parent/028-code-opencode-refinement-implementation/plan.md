---
title: "Implementation Plan: code-opencode refinement backlog"
description: "Level 2 plan turning the Fable-5-validated backlog (24 P1 + 21 P2 + 7 P3 + sk-code-owned C1) into 7 sequenced phases against the sk-code code-opencode surface sub-skill: mechanical re-pathing, hooks.md rewrite, the compile-breaking TypeScript trio rewrite (first), OPENCODE-scoped verify-doctrine additions, four authoring-checklist rewrites, SKILL.md + config-genre + detection, and validator retirement, with deep-loop path citations and parent-registration deferred to the live migration."
trigger_phrases:
  - "code-opencode refinement implementation plan"
  - "code-opencode implementation phases"
  - "implement code-opencode backlog plan"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/017-sk-code-parent"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/028-code-opencode-refinement-implementation"
    last_updated_at: "2026-07-08T20:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Executed all 7 phases in the planned order (3-first); each Sonnet-verified and pushed as an isolated scratch-index commit"
    next_safe_action: "Register 028 under the 017 parent once the memory daemon is healthy; file owner hand-offs"
    blockers:
      - "028 registration under 017 needs generate-context.js (memory daemon), operator-gated"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: code-opencode refinement backlog

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Land the validated code-opencode refinement backlog in 7 risk-ordered phases. Source of truth: `../027-.../research/final-synthesis.md` §B (backlog) + §C (batches). **Execution order: 3 → 1 → 2 → 4 → 5 → 6 → 7** — Phase 3 (TypeScript trio) ships first because it is the only cluster where following the skill verbatim yields non-compiling code; Phases 1/2/4 are independent low-risk do-now; Phases 5/6/7 are larger and go last. Each phase is one focused scratch-index commit, blast-radius-gated to its files. Paths are under `.opencode/skills/sk-code/code-opencode/` unless prefixed; the two workflow docs are under `.opencode/skills/sk-code/shared/references/`.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Applied to every phase:
- **Symlink-aware existence:** confirm any "dead"/target reference with `ls -la` / `find -type l`, never a glob (the P2-40 lesson: `.claude/commands` is a live symlink).
- **Comment-hygiene HARD BLOCK:** any script touched (Phase 7) carries durable WHY only — no ADR/REQ/CHK/task-ids or spec paths in code comments.
- **Shared-tier scoping:** Phase 4 additions go in labeled "OPENCODE reality" subsections only (files symlinked into code-webflow).
- **Per-phase verify:** markdown-link check clean; `parent-skill-check` STRICT 0 on sk-code; sk-code vocab/router drift-guards green; plus the phase-specific gate in `tasks.md`.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

code-opencode is an invokable parent-hub SURFACE packet: language trios (`references/{typescript,javascript,python,shell,config}/`), a shared tier (`references/shared/{universal_patterns,code_organization,hooks,alignment_verification_automation}.md`), the implement/debug/verify workflow doctrine (symlinks into `sk-code/shared/references/`), and authoring checklists (`assets/checklists/`) + `assets/scripts/`. This packet edits DOCS/ASSETS only; it changes no shipped code. The two workflow docs are shared with code-webflow (symlinked) — the single cross-surface blast-radius surface, handled by OPENCODE-scoped subsections.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

**Phase 1 — Mechanical stale-pointer re-pathing sweep.** Files: shell + config trios (evidence paths), `references/shared/{error_recovery,universal_patterns}.md`, `assets/checklists/{mcp_server,command}_authoring.md`, `assets/scripts/README.md`. Backlog P1-4/5, P1-24, P3-51. Pure find-replace of ~10 dead pointers. Effort S / risk minimal.

**Phase 2 — hooks.md rewrite (+ C3 docstring).** File: `references/shared/hooks.md` (+ `code-quality/scripts/hooks/claude-posttooluse.sh` docstring). Backlog P1-10/11/12/13, P2-35/36/37, C3. Delete fabricated §4/§5 removed-suites; strike `.opencode/settings.json`; `settings.local.json`→`settings.json`; add the live PreToolUse/PostToolUse rows + deprecation callout (document CURRENT legacy paths with a "migrating to system-skill-advisor/hooks/" note — C7 mid-flight); dist-freshness step. Effort M / risk low.

**Phase 3 — TypeScript trio import/emit + build-doctrine rewrite ⭐ FIRST.** Files: `references/typescript/{style_guide,quick_reference,quality_standards}.md`. Backlog P1-1/2/3/9, P2-26/27/28, P3-48/49. Add NodeNext rules (relative imports need `.js`; `node:` prefix; `createRequire` interop); fix every import example; package-aware build doctrine (`tsc --build` root vs `tsc -p tsconfig.build.json` satellites; document `tsconfig.build.json`; drop `--noCheck`); reconcile `MemoryError`; `enum`→`as const`. Effort M-L / risk low (correctness-critical).

**Phase 4 — Verify-doctrine additions (shared tier, OPENCODE-scoped).** Files: `shared/references/workflow_{verify,implement}.md`, `references/shared/universal_patterns.md`. Backlog P1-8/23, P2-32/33/34/45/46/47, P3-50. Add an "OPENCODE verification reality" subsection (real command chain + stale-dist/det-env/native-ABI traps + `validate.sh` exit codes); daemon single-writer never-rule; worktree pointer; comment-hygiene as HARD-BLOCK gate; cross-link the two shared tiers. Effort M / risk low-med.

**Phase 5 — Authoring-checklist rewrites.** Files: `assets/checklists/{skill,agent,command,mcp_server}_authoring.md`. Backlog P1-14..21, P2-39/40/41/42, P3-54. skill: Option-E branch + metadata checks. agent: two-runtime mirror + `permission:`/`tools:` schemas. command: two real architectures + PRE-BOUND SETUP + symlink-reality mirror. mcp: 3-tier launcher+daemon+socket + `opencode.json` + Code Mode split. Re-verify deep-loop/contract paths on edit day. Effort L / risk medium.

**Phase 6 — SKILL.md + config genre + detection.** Files: `SKILL.md`, `references/config/style_guide.md`, `shared/references/stack_detection.md`. Backlog P1-22/6/7, P2-43, P3-52/53. Separate surface trigger from extension sub-detection; split JSONC-behavior vs strict-JSON-descriptor genres; add YAML detection row (62 live files); acknowledge changelog/`.sock`/assets-scripts. Effort M / risk low.

**Phase 7 — Validator retirement (C1) + assets/scripts doc.** Files: `assets/scripts/verify_stack_folders.py`, `SKILL.md` §4, `assets/scripts/README.md`, `../../manual_testing_playbook/08--design-restraint/stack-folders-validator.md`. Backlog P1-25, C1. Retire/rewrite the always-failing validator; retire the impossible DR-004; document `assets/scripts/`. Intra-sk-code only. Effort S-M / risk low.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Per-phase verification lives in `tasks.md` (T*.V rows). The load-bearing gate is the **Phase 3 compile guarantee:** every rewritten TypeScript example is checked against a living compiling exemplar (`system-spec-kit/shared/embeddings/factory.ts`, `system-spec-kit/mcp_server/lib/errors/core.ts`, `system-skill-advisor/mcp_server/lib/prompt-policy.ts`) so no `nodenext`/`verbatimModuleSyntax`-breaking example survives. Program-wide: a symlink-aware existence sweep (0 code-opencode refs to a nonexistent path), markdown-link check clean, `parent-skill-check` STRICT 0, vocab-sync + router drift-guards green, and `validate.sh --strict` Errors 0 at close.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

**Source dependency:** the backlog is defined by sibling packet 027's `final-synthesis.md`.

**Migration coordination (defer only these):** deep-loop path citations inside Phase 5 (re-verify on edit day; skill-relative wording if the `deep-loop-workflows→system-deep-loop` rename still churns); P2-38's provisional deep-loop drift-tool mentions; registering 028 under the 017 parent + generating `description.json`/`graph-metadata.json` (after the sk-code spec-folder renumber-migration settles — same isolation strategy as 027). Everything else is executable now.

**Key decisions (recorded):** (D-1) Phase 3 first — highest harm-prevention, only compile-breaking cluster. (D-2) only C1 (+ C3 docstring) implemented here; C2/C4-C8 + Codex are separate owner hand-offs — never mix code bugs into doc PRs. (D-3) C3 downgraded High→Low — the live gate works; only its docstring is stale. (D-4) shared-tier edits are OPENCODE-scoped subsections. (D-6) symlink-aware existence checks are mandatory.

**Hand-offs (file as separate owner issues):** C2 (exit-2-as-clean coverage gap → code-quality + system-spec-kit), C4/C5/C6 (system-spec-kit cleanup), C7 (hooks migration → system-spec-kit ↔ system-skill-advisor), C8 (alignment SH-WARN exclusion → sk-code), `agents/README.txt:8` `.codex` aspiration (→ `.opencode/agents` owner).

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Docs-only change with per-phase isolation: each phase is one scratch-index commit, blast-radius-gated to its files. Rollback = revert that phase's commit (no build/runtime dependency; no shipped-code behavior changes). The recovery baseline is the pre-work HEAD recorded in the sibling 027 packet. Because writes are isolated to code-opencode docs + one sk-code script, no other surface or the live migration is affected by a revert.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 3 — TypeScript trio | 027 validated backlog | (none — independent, ships first) |
| Phase 1 — re-pathing sweep | 027 backlog | (none) |
| Phase 2 — hooks.md rewrite | 027 backlog | Phase 6 SKILL.md hooks reconcile (ex-P2-49) |
| Phase 4 — verify doctrine | 027 backlog | (none) |
| Phase 5 — authoring checklists | 027 backlog; live-migration path re-verify | (none) |
| Phase 6 — SKILL.md + config + detection | Phase 2 (hooks over-claim closure) | (none) |
| Phase 7 — validator retirement | intra-sk-code | (none) |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 — re-pathing sweep | Low | ~10 dead pointers, pure symlink-aware find-replace |
| Phase 2 — hooks.md rewrite | Medium | Delete fabricated suites + add live hooks; authority cross-check |
| Phase 3 — TypeScript trio | Medium-Large | Correctness-critical; every example validated vs a compiling exemplar |
| Phase 4 — verify doctrine | Medium | Additive OPENCODE-scoped subsections in symlinked shared files |
| Phase 5 — authoring checklists | Large | Four substantive rewrites (Option-E, two command architectures, 3-tier MCP) |
| Phase 6 — SKILL.md + config + detection | Medium | Marker split + config-genre split + YAML row |
| Phase 7 — validator retirement | Small-Medium | Retire/rewrite one script + one playbook scenario |
| **Total** | | **Medium-Large docs/asset implementation increment** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm all edits are docs/assets (+ one sk-code script), additive/surgical, no new runtime logic.
- [ ] Confirm every "dead reference" removed was checked symlink-aware (`ls -la`/`find -type l`).
- [ ] Confirm shared-tier additions (Phase 4) are OPENCODE-labeled subsections; code-webflow doctrine unchanged.

### Rollback Procedure
1. Revert the affected phase's scratch-index commit — each phase is file-scoped and independent.
2. Re-run the phase gate (markdown-links, parent-skill-check STRICT, vocab/router drift-guards) against the reverted tree.
3. Re-run `validate.sh --strict` before re-promotion.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: filesystem-only revert of markdown/asset files + one script; no persisted data migration involved.

<!-- /ANCHOR:enhanced-rollback -->
