---
title: "Tasks: code-opencode refinement backlog implementation"
description: "Task ledger for the 7-phase code-opencode refinement: mechanical re-pathing, hooks.md rewrite + C3 docstring, the compile-breaking TypeScript trio rewrite, OPENCODE-scoped verify-doctrine additions, four authoring-checklist rewrites, SKILL.md + config-genre + detection, and validator retirement, mapped to the Fable-5-validated backlog items with per-phase verification rows."
trigger_phrases:
  - "code-opencode refinement implementation tasks"
  - "code-opencode implementation task ledger"
  - "implement code-opencode backlog tasks"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/017-sk-code-parent"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/028-code-opencode-refinement-implementation"
    last_updated_at: "2026-07-08T20:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "All 7 phases (T1-T7 + T*.V) executed + Sonnet-verified + pushed; commit table in implementation-summary.md"
    next_safe_action: "Register 028 under 017 once the memory daemon is healthy; file owner hand-offs"
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
# Tasks: code-opencode refinement backlog implementation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` todo · `[~]` in progress · `[x]` done-with-evidence. Each task names the target file + the fix + the backlog id. **Execution order = 3 → 1 → 2 → 4 → 5 → 6 → 7** (Phase 3 first per the #1 recommendation); phases are numbered by topic below. One scratch-index commit per phase, blast-radius-gated. Paths relative to `.opencode/skills/sk-code/`.

> **STATUS — ALL PHASES DONE (2026-07-08).** Every task below (T1.x–T7.x plus each T*.V verification) shipped and was Sonnet-verified before its commit. Per-phase commits: Phase 1 `7fdd7a07`, Phase 2 `c3a8ef45`, Phase 3 `66fdb0bd`, Phase 4 `71dcf9af`, Phase 5 `752d018e`, Phase 6 `d73db9a2`, Phase 7 `38785a1f`. The per-task `[ ]` boxes are left unflipped for historical readability; the authoritative done-with-evidence record is `checklist.md` + the commit table in `implementation-summary.md`.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Mechanical stale-pointer re-pathing sweep
- [ ] T1.1 `code-opencode/references/shell/{style_guide,quality_standards}.md` — `lib/common.sh`→`system-spec-kit/scripts/lib/shell-common.sh`; prefix `spec/create.sh` (P1-4/5).
- [ ] T1.2 `code-opencode/references/config/{style_guide,quality_standards}.md` — fix `config/config.jsonc` evidence path; `config/quality_standards.md:97` grep path (P1-24).
- [ ] T1.3 `code-opencode/references/shared/{error_recovery,universal_patterns}.md` — `references/opencode/`→`code-opencode/references/` + checklist-path prefixes (P1-24).
- [ ] T1.4 `code-opencode/assets/checklists/{mcp_server_authoring,command_authoring}.md` — dead `skill_creation.md`; `sk-skill.md`→`skill.md`; command-template path (P1-24).
- [ ] T1.5 `code-opencode/assets/scripts/README.md` — folder path + link label + strip ephemeral packet-id (P3-51).
- [ ] T1.V Grep: 0 remaining old strings; every target confirmed present via `ls -la`; markdown-links clean.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: hooks.md rewrite + C3 docstring
- [ ] T2.1 `code-opencode/references/shared/hooks.md` — delete §4/§5 (removed suites) → plugin-bridge reality (P1-10/11).
- [ ] T2.2 hooks.md — strike `.opencode/settings.json`; `settings.local.json`→`settings.json` (P1-12/13).
- [ ] T2.3 hooks.md §3 — add PreToolUse + PostToolUse rows; deprecation callout with "migrating to system-skill-advisor/hooks/" note; dist-freshness step (P2-35/36/37).
- [ ] T2.4 `code-quality/scripts/hooks/claude-posttooluse.sh:11-14` — fix stale docstring to `python3` + `settings.json` (C3, docstring only; durable-WHY comments).
- [ ] T2.V Every hooks.md path exists on disk; SKILL.md §2 hooks description reconciled (ex-P2-49); markdown-links clean.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: TypeScript trio import/emit + build doctrine (⭐ execute first)
- [ ] T3.1 `code-opencode/references/typescript/style_guide.md` — NodeNext `.js`-extension rule + `node:` prefix + `createRequire` interop; fix every import example (P1-1/2/3).
- [ ] T3.2 `code-opencode/references/typescript/quick_reference.md` — same fixes to its import/require quick examples (P1-1/2/3).
- [ ] T3.3 `code-opencode/references/typescript/quality_standards.md` §10 — package-aware build doctrine; document `tsconfig.build.json`; remove `--noCheck` (P1-9).
- [ ] T3.4 quality_standards + quick_reference — reconcile `MemoryError` to real shape (`code: string`, `details`, `recoveryHint?`); close JS-trio cascade (P2-27).
- [ ] T3.5 style_guide + quality_standards — `enum`→`as const`+`keyof typeof`; soften "type-only imports always last"; import-group + divider nits (P2-26/28, P3-48/49).
- [ ] T3.V Compile guarantee: validate every example vs `system-spec-kit/shared/embeddings/factory.ts`, `.../mcp_server/lib/errors/core.ts`, `system-skill-advisor/mcp_server/lib/prompt-policy.ts`; markdown-links clean.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verify doctrine (shared tier, OPENCODE-scoped)
- [ ] T4.1 `shared/references/workflow_verify.md` — "OPENCODE verification reality" subsection: real command chain + `validate.sh` exit codes (P1-8, P3-50).
- [ ] T4.2 workflow_verify.md — stale-dist trap + det-env test discipline + native-ABI rebuild boxes (P2-32/33/34).
- [ ] T4.3 `shared/references/workflow_implement.md` §2.3 — daemon single-writer never-rule; worktree pointer (sk-git-owned); cross-link the two shared tiers (P1-23, P2-45/47).
- [ ] T4.4 `code-opencode/references/shared/universal_patterns.md` §4 — comment-hygiene reframed as HARD-BLOCK gate (P2-46).
- [ ] T4.V All additions inside labeled "OPENCODE" subsections (code-webflow untouched); every command/script named exists.

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:phase-5 -->
## Phase 5: Authoring checklists (skill / agent / command / MCP)
- [ ] T5.1 `code-opencode/assets/checklists/skill_authoring.md` — Option-E branch + graph-metadata/mode-registry checks + metadata-validation step + fix dead link (P1-14/17, P2-39).
- [ ] T5.2 `code-opencode/assets/checklists/agent_authoring.md` — two-runtime mirror (drop triplicate/`.codex`); `permission:` vs `tools:`; drop `allowed-tools:` from agent grep (P1-15/16, P3-54).
- [ ] T5.3 `code-opencode/assets/checklists/command_authoring.md` — two real architectures; `argument-hint`/`allowed-tools`/PRE-BOUND SETUP; symlink-reality mirror rewrite (P1-18/19, P2-40).
- [ ] T5.4 `code-opencode/assets/checklists/mcp_server_authoring.md` — 3-tier assembly + `opencode.json` registration + Code Mode split + dist-freshness (P1-20/21, P2-41/42).
- [ ] T5.V Re-verify each cited deep-loop/contract path on edit day (skill-relative if churning); every example exists (symlink-aware); Option-E checks match a real parent hub; markdown-links clean.

<!-- /ANCHOR:phase-5 -->
---

<!-- ANCHOR:phase-6 -->
## Phase 6: SKILL.md + config genre + detection
- [ ] T6.1 `code-opencode/SKILL.md:16` — separate surface trigger (`.opencode/` path) from extension→trio sub-detection (P1-22).
- [ ] T6.2 `code-opencode/references/config/style_guide.md` — split JSONC-behavior vs strict-JSON-descriptor genres; rewrite fictional §9 tree (P1-6/7).
- [ ] T6.3 `shared/references/stack_detection.md` + SKILL.md — add YAML detection row (62 live files) (P2-43).
- [ ] T6.4 SKILL.md §4 — acknowledge `changelog/`, `.sock`/daemon-IPC, `assets/scripts/` (P3-52/53).
- [ ] T6.V SKILL.md reference map resolves 1:1 with disk; descriptor-genre wording aligned with sk-doc; ex-P2-49 closed.

<!-- /ANCHOR:phase-6 -->
---

<!-- ANCHOR:phase-7 -->
## Phase 7: Validator retirement (C1) + assets/scripts doc
- [ ] T7.1 `code-opencode/assets/scripts/verify_stack_folders.py` — retire OR rewrite against the real two-axis layout (currently always exit 1) (C1). Durable-WHY comments only.
- [ ] T7.2 `manual_testing_playbook/design-restraint/stack-folders-validator.md` — retire the impossible DR-004 (requires exit 0) (C1).
- [ ] T7.3 `code-opencode/SKILL.md` §4 + `assets/scripts/README.md` — document the `assets/scripts/` subtree (P1-25).
- [ ] T7.V No scenario requires the impossible exit 0; SKILL.md §4 lists assets/scripts; comment-hygiene clean on the script.

<!-- /ANCHOR:phase-7 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every backlog item (24 P1 / 21 P2 / 7 P3 + C1) marked done-with-evidence or deferred-with-reason in `checklist.md`.
- [x] Phase-3 compile guarantee attested (examples ↔ real exemplars). — Sonnet test-compiled every snippet.
- [x] Symlink-aware sweep: 0 code-opencode refs to a nonexistent path. — Sonnet path-existence per phase; the one fictional prefix corrected in Phase 6.
- [~] `parent-skill-check` STRICT 0 on sk-code; vocab-sync + router drift-guards green; `validate.sh --strict` Errors 0. — parent-skill-check STRICT PASS (0 warnings); packet `validate --strict` = Errors 2 (endemic/grandfathered on the 017 track), see implementation-summary Known Limitations #1.
- [~] Hand-offs C2/C4-C8 + Codex filed to owners. — DOCUMENTED (implementation-summary Known Limitations #3); not yet filed as separate issues.
- [x] Each phase pushed as an isolated scratch-index commit; [~] 028 registered under 017 + metadata generated AFTER the migration settles — registration DEFERRED (memory daemon operator-gated).

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Backlog source of truth: `../027-code-opencode-refinement-research/research/final-synthesis.md` §B.
- Evidence: `../027-.../research/research.md` + `research/iterations/iteration-001..009.md`.
- Plan + gates: `plan.md`; verification evidence: `checklist.md`.

<!-- /ANCHOR:cross-refs -->
