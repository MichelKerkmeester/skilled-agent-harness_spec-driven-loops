---
title: "Research Record: Per-Runtime Reference Map for the Skilled Source-Root Move"
description: "Map, per CLI runtime, every symlink and every runtime file that would point at a stale path if .skilled replaced .opencode as the source root, and map the same across skills, code, READMEs and root documents."
trigger_phrases:
  - "per runtime symlink map"
  - "stale opencode path references"
  - "skilled reference map"
  - "runtime file path inventory"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/002-per-runtime-reference-map"
    last_updated_at: "2026-09-16T12:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Reconcile both lanes into one verified per-row map"
    next_safe_action: "Design the cutover in 003-migration-design from the maps"
    blockers: []
    key_files:
      - "research/research.md"
      - "scratch/topic.txt"
      - "research/maps/map-a-symlinks.tsv"
      - "research/maps/map-c-references.tsv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-002-reference-map"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which command rebuilds council-graph.sqlite?"
    answered_questions:
      - "Which runtime files are generated, and by which command, rather than authored by hand?"
---
# Research Record: Per-Runtime Reference Map for the Skilled Source-Root Move

<!-- SPECKIT_LEVEL: research -->
<!-- SPECKIT_TEMPLATE_SOURCE: research-record | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | research |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-16 |
| **Findings** | `research/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 001 established what kinds of thing the move breaks and which of them cannot be fixed by a rewrite. It did not produce the list someone executing the move would work from. A cutover needs to know, for each of the seven runtimes, which symlinks point where today and what they must point at afterwards, which runtime configuration files carry a path that will go stale, and — across the 4,260 tracked files that name `.opencode` — which references are code that constructs a path, which are runnable instructions, which are prose, and which are historical records that must not be rewritten at all.

### Purpose

Produce that map, per runtime and per area, with every row cited and classified, so phase 003 can sequence the cutover from a complete list rather than from categories. The findings live in `research/research.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Per-runtime symlink maps** for `.claude/`, `.codex/`, `.cursor/`, `.devin/`, `.hermes/`, `.pi/` and the internal links inside `.opencode/`, plus the root-level links (`CLAUDE.md`, `.mcp.json`) and the links under `specs/`. The seed inventory enumerates 435 links; 381 resolve into `.opencode/`.
- **Runtime files that reference outdated paths**: the non-symlink files under each runtime root that name `.opencode` — settings, hook registrations, MCP configs, sync manifests, generated prompts and agents — and the home-level configuration those runtimes read.
- **Skills**: for each skill, the `SKILL.md`, `README.md`, references, assets, scripts, runtime code, tests, feature catalogs, testing playbooks, changelogs and benchmarks that name the path.
- **Code**: every source file that constructs, matches or hardcodes a `.opencode` path, as distinct from mentioning it.
- **Root documents and CI**: `README.md`, `AGENTS.md`, `PUBLIC-RELEASE.md`, `CONTRIBUTING.md`, `REPO RULES.md`, `opencode.json`, `.utcp_config.json`, `.gitignore`, and the workflows under `.github/`.

### Out of Scope

- `barter/`, whose links resolve into a different checkout, and the stray leading-space ` specs/` directory the phase-001 run left behind.
- The cutover sequence and the choice of final layout. Where a row's required change depends on that choice, the map says so and names both outcomes; phase 003 decides.
- Changing any file. This phase maps; it edits nothing outside its own `research/` directory.

### Research Method

Two lanes from different model families, with convergence allowed so a lane stops once it stops finding new rows:

| Lane | Executor | Model | Iteration cap |
|------|----------|-------|---------------|
| `swe2` | cli-devin | `swe-2-max` | 10 |
| `deepseek-pi` | cli-pi | `deepseek-v4.1-flash` through the LLM Gateway (DevPass), thinking `max` | 10 |

Both lanes start from the deterministic seed inventory in `scratch/seed-inventory/`, built by `scratch/build-seed-inventory.py`, and from phase 001's verified findings. The brief is frozen in `scratch/topic.txt`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which command rebuilds the tracked `council-graph.sqlite`, and are its stored paths regenerated or migrated?
- Do opencode's plugin glob, Devin's skill scan and Pi's extension imports follow a symlinked directory? `research/research.md` §8 lists the rest.
<!-- /ANCHOR:questions -->
