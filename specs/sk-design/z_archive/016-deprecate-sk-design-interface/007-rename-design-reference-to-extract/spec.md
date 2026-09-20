---
title: "Feature Specification: Rename /design:design-reference to /design:extract"
description: "Phase 007 renames the surviving design-reference command to /design:extract (file, owned assets, all six runtime mirrors), and closes the interface->design mirror residue that 016/006 documented but did not fully clean: broken .claude/commands/interface symlinks and stale, never-synced .codex/.pi interface-*.md prompt copies."
trigger_phrases:
  - "rename design-reference command"
  - "design extract command rename"
  - "clean up interface command mirrors"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/007-rename-design-reference-to-extract"
    last_updated_at: "2026-08-20T19:00:01Z"
    last_updated_by: "spec-author"
    recent_action: "Authored phase spec"
    next_safe_action: "Execute rename via git mv + runtime-mirror sync tooling"
    blockers: []
    key_files:
      - ".opencode/commands/design/design-reference.md"
      - ".opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/skills/system-spec-kit/scripts/pi/sync-prompts-pi.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: Rename /design:design-reference to /design:extract

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Structure** | Phase child of `016-deprecate-sk-design-interface` |
| **Priority** | P2 |
| **Created** | 2026-08-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/016-deprecate-sk-design-interface` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../006-reference-cleanup-and-reconcile/` |
| **Mutation Class** | mutates (rename + reference rewrite + generated-mirror regen + residue delete) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Phase 006 reconciled the *hub-identity* references left by the interface deprecation (advisor graph, command bridges, tests, docs) but its own scope table only lists live-contract docs and generated advisor artifacts — it never re-audited the `.claude/`, `.codex/`, and `.pi/` runtime command mirrors for the *specific* `interface:design` / `interface:design-reference` command files. Those were deleted from `.opencode/commands/interface/` in phase 005, but three runtimes were never told:

- `.claude/commands/interface/{design,design-reference}.md` are symlinks pointing at the now-deleted `.opencode/commands/interface/` — broken.
- `.codex/prompts/interface-{design,design-reference}.md` and `.pi/prompts/interface-{design,design-reference}.md` are real file copies dated before the phase-005 commit — never regenerated, so Codex and Pi still expose two dead `interface:*` prompts and have never carried a mirror for the current `/design:design-reference` command at all.

Separately, the operator now wants the surviving command renamed from `design-reference` to `extract` — `/design:design-reference` becomes `/design:extract`. This is a second, independent naming change riding the same command file, so it is done in the same phase rather than reopening 016 twice.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename the canonical command: `.opencode/commands/design/design-reference.md` -> `extract.md`, and its three owned assets (`design-reference-{auto.yaml,confirm.yaml,presentation.txt}` -> `extract-{auto.yaml,confirm.yaml,presentation.txt}`), via `git mv`.
- Rewrite every literal `/design:design-reference` invocation path, `design:design-reference` identifier, and owned-asset filename reference inside the renamed command file and its three assets to the `extract` naming.
- Regenerate every runtime command mirror from tooling: `sync-runtime-mirrors.cjs` (Claude/Cursor/Devin symlinks), `sync-prompts.cjs` (Codex), `sync-prompts-pi.cjs` (Pi) — no hand-authored mirror files.
- Delete the residual `interface:*` mirror files the tooling run does not reach: `.claude/commands/interface/` (whole directory; not covered by the mirror-sync orphan scan because no canonical `.opencode/commands/interface/*` exists to key it).
- Update literal `/design:design-reference` invocation-path mentions in live cross-skill docs: the six-runtime `design` agent defs (`.opencode/agents/design.md`, `.claude/agents/design.md` — canonical sources; `.codex/agents/design.toml`, `.pi/agents/design.md` regenerate from `.opencode/agents/design.md` via `sync-agents.cjs`/`sync-agents-pi.cjs`; `.cursor/agents/design.md` and `.devin/agents/design/AGENT.md` are symlinks to `.claude/agents/design.md` and need no edit), `sk-design-md-generator/references/creation-contract.md`, and `.opencode/commands/README.txt`.
- Update the `sk-design-md-generator/graph-metadata.json` `domains`/`key_topics` entries that name `design-reference` as the command identity.

### Out of Scope

- **Renaming the skill** — `sk-design-md-generator` stays verbatim (matches 016's own decision).
- **Descriptive prose** that uses "design-reference" as a generic capability description rather than a literal command path (`README.md`, `README.txt` agent-index one-liners, `cli-external-orchestration` docs, `sk-code-handoff.md`) — left as-is; the capability is still literally a design-reference extraction regardless of what the command is called.
- **`sk-doc/sk-create-command/assets/command-contract.json`** — a worked example already carrying the pre-016 `/interface:design-reference` alias; 016/006 already classified command-contract worked examples as illustrative, not a live route. Left untouched.
- **Generated diagnostic/routing artifacts not keyed to this command** — `command-bridges.generated.json` currently carries zero `design`/`sk-design` entries (confirmed by grep before editing), so no regen is needed there; compiled-routing and `skill-graph.json` remain 016's documented main-side-regen residual.
- **Frozen evidence** — benchmark reports, `manual-testing-playbook` scenario fixtures that merely contain the substring "design-reference" as descriptive keyword text (not a literal command invocation), and prior `specs/**` history.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001** — `.opencode/commands/design/extract.md` exists with its three owned assets renamed to the `extract-*` naming; `design-reference.md` and its assets no longer exist.
- **REQ-002** — All six runtimes resolve `/design:extract` (or the runtime-native equivalent path) through their own discovery convention, generated by the existing sync tooling, not hand-authored.
- **REQ-003** — No runtime carries a residual `interface:design` or `interface:design-reference` mirror (broken symlink or stale file) anywhere.
- **REQ-004** — No live surface (agent defs, creation-contract.md, `.opencode/commands/README.txt`) still names the invocation path `/design:design-reference`.
- **REQ-005** — `sync-runtime-mirrors.cjs --check`, `sync-prompts.cjs --check`, and `sync-prompts-pi.cjs --check` all pass with zero drift after the change.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `rg -l "design:design-reference|design-reference\.md|interface[:/-]design"` over live surfaces (excluding the documented out-of-scope set) returns zero hits.
- `find .claude/commands .codex/prompts .cursor/commands .pi/prompts .devin/agents -iname "*interface*design*"` returns nothing.
- All three mirror-sync scripts pass `--check` with zero drift; `validate.sh` on this phase folder and `validate.sh --recursive --strict` on the `016` packet both exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Risk: hand-authoring a mirror instead of regenerating it** — would silently fork from the canonical file the next time tooling runs. Mitigated by using `sync-runtime-mirrors.cjs`/`sync-prompts.cjs`/`sync-prompts-pi.cjs` exclusively for every mirror, never a manual `ln -s` or copy.
- **Risk: mirror-sync orphan scan blind spot** — confirmed by reading the script: `.claude/commands/interface/` is never a key in its per-directory orphan scan because no canonical `.opencode/commands/interface/*` exists, so the tool will not remove it. Mitigated by an explicit manual `git rm -r` of that directory as its own named step, verified afterward by `find`.
- **Dependency:** 005 (delete) and 006 (reconcile) — this phase assumes both landed cleanly, which is confirmed (both `Complete`, packet `Complete`).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — the rename target, mirror-sync tooling, and out-of-scope boundary were all confirmed by reading the tooling and the affected files before execution.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:phase-navigation -->
## PHASE NAVIGATION

- **Parent:** `../spec.md`
- **Predecessor:** `../006-reference-cleanup-and-reconcile/spec.md`
- **Successor:** — (none yet)
<!-- /ANCHOR:phase-navigation -->
