---
title: "Decision Record: sk-create-diagram resource reorganization and code alignment"
description: "Subfolder taxonomy, filename-stability, and dispatch-vs-direct decisions for phase 008."
trigger_phrases:
  - "diagram reorg decision record"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/008-resource-reorganization-and-code-alignment"
    last_updated_at: "2026-08-12T18:40:07.000Z"
    last_updated_by: "claude"
    recent_action: "Recorded taxonomy and dispatch decisions before executing the move"
    next_safe_action: "Run the reorg script"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Decision Record: sk-create-diagram resource reorganization and code alignment

<!-- ANCHOR:context -->
## 1. CONTEXT

The operator asked for `references/` and `assets/` to be split into subfolders "to make more scannable," plus a code alignment pass and a code README on `scripts/`. Three judgment calls needed to be made before touching any file.
<!-- /ANCHOR:context -->

---

<!-- ANCHOR:decisions -->
## 2. DECISIONS

### Decision 1: Domain subfolder taxonomy, filenames unchanged

**Decision**: `references/` splits into `types/` (27 files), `primitives/` (4), `import-export/` (3), `foundations/` (3). `assets/` splits into `examples/` (34, including the 7 special-pattern variants) and `templates/` (4); `icons.html` stays at the `assets/` root. Filenames themselves are NOT changed (e.g. `type-architecture.md` stays `type-architecture.md`, just moves under `types/`) — no `type-`/`example-`/`primitive-` prefix stripping.

**Rationale**: `skill-reference-template.md`'s own "Folder Organization Principle" explicitly names this exact pattern ("domain subfolders for medium/complex skills," giving `references/backend/go/`, `references/frontend/react/` as the model). The four reference domains and two asset domains mirror the packet's own phase structure (phase 002 = foundations, phase 003 = types, phase 004 = import-export/primitives). Keeping filenames stable avoids a second class of rename (filename collisions, external mentions elsewhere in the repo, doubled diff noise) beyond the location change the operator actually asked for.

**Alternatives considered**:
- Strip the redundant prefix once nested (`types/architecture.md`) — rejected: the operator's ask was scannability of the folder tree, not filename minimalism; stripping prefixes is a separate, unrequested rename with its own blast radius (every citation would need a full filename rewrite, not just a path-prefix insert).
- One flat `references/domains/` catch-all — rejected: doesn't improve scannability over the current flat layout, just adds a layer.

### Decision 2: Reorg + relink executed directly, not dispatched to Deepseek

**Decision**: The file moves and the ~90-citation cross-reference rewrite across 59 files are executed directly (scripted `git mv` + literal token substitution + hand-enumerated bare-relative-link fixes), not dispatched to Deepseek v4 Flash via `cli-opencode` as the packet's earlier implementation phases were.

**Rationale**: This is a mechanical, enumerable, high-precision task — every old path has exactly one correct new path, and a single missed citation is a silently broken link (markdown renders regardless of whether the target resolves). Phase 007 already showed a real small-model reliability gap (dispatch 3 stopped mid-work with no error). For a task where completeness is verified by grep-for-zero-orphans rather than editorial judgment, a scripted rewrite against a hand-verified mapping table is strictly more reliable than a dispatched agent re-deriving the same mapping from prose instructions. The prior packet phases dispatched *authoring* work (judgment-heavy, needed grounding in source material); this phase is *mechanical* work (correctness-heavy, needs an exhaustive enumerable mapping) — different risk profile, different tool choice. Documented per the framework's "follow the brief's intent... when you deviate, record why."

**Alternatives considered**:
- Dispatch the whole reorg to Deepseek with the full mapping table in the prompt — rejected: still relies on the dispatched agent correctly applying ~90 substitutions across 59 files without a script's guarantee of exhaustive application, for no benefit over doing it directly with a script this session already had reason to build.

### Decision 3: New per-subfolder README indexes

**Decision**: Each new subfolder (`references/types/`, `references/primitives/`, `references/import-export/`, `references/foundations/`, `assets/examples/`, `assets/templates/`) gets a short navigational `README.md` listing its contents and linking back to `SKILL.md`.

**Rationale**: A bare subfolder with 27 same-shaped files and no index is not meaningfully more scannable than a flat list with a naming prefix — the win comes from the index letting a reader see the domain's contents at a glance without opening every file. This mirrors `scripts/README.md`'s own navigational-not-duplicative pattern (§8 "stays navigational," authoritative content lives in the actual files).
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:consequences -->
## 3. CONSEQUENCES

- Every future reference to a moved file (in this packet, in `sk-doc`'s registries, or in any other packet that might one day cite `sk-create-diagram`) must use the new subfolder path — the old flat paths no longer exist post-move.
- `SKILL.md`'s Smart Router resource-domain table and Resource Loading Levels section need the same subfolder awareness reflected in their `references/[domain]/` documentation, keeping the router's own documented contract accurate.
- The scripted approach produces a large, mechanical diff (rename-heavy) that should show clean `R`-status renames in `git status`, not delete+add pairs — verified after execution per sk-git's rename-history rule.
<!-- /ANCHOR:consequences -->
