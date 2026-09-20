---
title: "Implementation Plan: Rename /design:design-reference to /design:extract"
description: "git mv the canonical command and its owned assets, rewrite internal path references, regenerate every runtime mirror from existing sync tooling, and delete the interface-era mirror residue the tooling cannot reach."
trigger_phrases:
  - "rename design-reference to extract plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/007-rename-design-reference-to-extract"
    last_updated_at: "2026-08-20T19:00:01Z"
    last_updated_by: "spec-author"
    recent_action: "Authored rename plan"
    next_safe_action: "Execute Phase 1 (git mv + content rewrite)"
    blockers: []
    key_files:
      - ".opencode/commands/design/extract.md"
      - ".opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Rename /design:design-reference to /design:extract

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rename the one surviving design command and every one of its runtime mirrors from `design-reference` to `extract`, using the repo's own mirror-generation scripts rather than hand-authored copies, then delete the leftover `interface:*` mirror files those scripts cannot reach because their canonical source is already gone.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- **Ready:** 016/005 and 016/006 landed (confirmed `Complete`); mirror-sync tooling (`sync-runtime-mirrors.cjs`, `sync-prompts.cjs`, `sync-prompts-pi.cjs`, `sync-agents.cjs`, `sync-agents-pi.cjs`) located and its source/output directories confirmed by reading the scripts.
- **Done:** `/design:extract` resolves on all six runtimes via generated mirrors; zero `interface:design*` residue anywhere; zero live `/design:design-reference` references remain; all three mirror `--check` scripts pass; `validate.sh --recursive --strict` on the `016` packet exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Aspect | Value |
|--------|-------|
| **Canonical rename** | `.opencode/commands/design/design-reference.md` -> `extract.md`; `assets/design-reference-{auto.yaml,confirm.yaml,presentation.txt}` -> `assets/extract-{auto.yaml,confirm.yaml,presentation.txt}` |
| **Generated mirrors (regenerate, don't hand-edit)** | `.claude/commands/design/extract.md` (symlink), `.cursor/commands/design-extract.md` (symlink), `.devin` has no per-command mirror (agents only), `.codex/prompts/design-extract.md` (generated router prompt), `.pi/prompts/design-extract.md` (generated router prompt) |
| **Manual residue delete (tooling blind spot)** | `.claude/commands/interface/` (broken symlinks, not reachable by the orphan scan since no canonical `interface/*` source exists); `.codex/prompts/interface-{design,design-reference}.md`; `.pi/prompts/interface-{design,design-reference}.md` — these three are covered by the Codex/Pi sync tools' own orphan cleanup, confirmed by reading `writeOutputs()` |
| **Agent-doc path references** | `.opencode/agents/design.md` + `.claude/agents/design.md` (both real, hand-edited); `.codex/agents/design.toml` + `.pi/agents/design.md` regenerate from `.opencode/agents/design.md` via `sync-agents.cjs`/`sync-agents-pi.cjs`; `.cursor/agents/design.md` + `.devin/agents/design/AGENT.md` are symlinks to `.claude/agents/design.md`, no action needed |
| **Doc references** | `sk-design-md-generator/references/creation-contract.md`, `sk-design-md-generator/graph-metadata.json`, `.opencode/commands/README.txt` |
| **Mutation class** | mutates; fully git-tracked, restorable from HEAD until committed |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Confirm the sync tooling's exact source/output directories and orphan-removal behavior by reading each script in full (done during spec authoring — recorded in the architecture table above). Capture a pre-change inventory: `find` for every `interface*design*` mirror file and `rg` for every literal `design:design-reference`/`design-reference.md` reference, so the after-state has a real baseline to diff against.

### Phase 2: Implementation

1. `git mv` the canonical command file and its three owned assets to the `extract` naming.
2. Rewrite the renamed files' internal literal references (`/design:design-reference` -> `/design:extract`, asset filenames, section headings that name the command) — leave the deliverable name ("Style Reference DESIGN.md") and skill name (`sk-design-md-generator`) untouched.
3. Run `node .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs` (Claude/Cursor/Devin symlinks — creates the new mirrors and removes the now-orphaned `design-reference` ones automatically).
4. Run `node .opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs` and `node .opencode/skills/system-spec-kit/scripts/pi/sync-prompts-pi.cjs` (regenerates the Codex/Pi router prompts; each script's own orphan cleanup removes the stale `interface-design*.md` files since `.opencode/commands/interface/` no longer exists).
5. `git rm -r .claude/commands/interface/` (the one mirror-sync blind spot the scripts do not reach).
6. Edit the two canonical agent docs (`.opencode/agents/design.md`, `.claude/agents/design.md`) to say `/design:extract`; run `sync-agents.cjs` and `sync-agents-pi.cjs` to regenerate the Codex/Pi agent copies.
7. Edit `creation-contract.md`, `graph-metadata.json` (domains/key_topics), and `.opencode/commands/README.txt` for the remaining literal path references.

### Phase 3: Verification

Re-run the Phase 1 `find`/`rg` sweep and diff against the baseline: zero `interface*design*` mirrors, zero live `design:design-reference` hits outside the documented out-of-scope set. Run all mirror scripts with `--check`. Run `validate.sh` on this phase folder and `validate.sh --recursive --strict` on the `016` packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Real command evidence only: `find` output for residual mirrors (must be empty), `rg` counts before/after for the literal old path (must reach zero on in-scope surfaces), `--check` exit codes from all five sync scripts (must be 0), and `validate.sh --recursive --strict` exit code on the `016` packet (must be 0). No claim of completion without all five reads passing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Upstream: 016/005 (delete), 016/006 (reconcile) — both `Complete`.
- Tools: `git mv`/`git rm`, `sync-runtime-mirrors.cjs`, `sync-prompts.cjs`, `sync-prompts-pi.cjs`, `sync-agents.cjs`, `sync-agents-pi.cjs`, `validate.sh`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Fully reversible until committed: every change is a `git mv`/`git rm`/content edit against a tracked working tree, and the mirror scripts are deterministic regenerations from the canonical source. `git checkout -- .` (or a targeted `git checkout -- <path>` per touched tree) restores the pre-phase state. Nothing is committed or pushed until the operator approves.
<!-- /ANCHOR:rollback -->
