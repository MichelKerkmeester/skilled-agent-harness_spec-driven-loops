---
title: "Decision Record: sk-create-diagram adherence audit and artifact completion"
description: "Asset-template applicability, code-standards scope, and playbook/catalog taxonomy decisions for phase 007."
trigger_phrases:
  - "diagram audit decision record"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/007-adherence-audit-and-artifact-completion"
    last_updated_at: "2026-08-12T08:25:12.000Z"
    last_updated_by: "claude"
    recent_action: "Recorded taxonomy and applicability decisions ahead of dispatch"
    next_safe_action: "Dispatch audit+fix pass using this taxonomy"
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

# Decision Record: sk-create-diagram adherence audit and artifact completion

<!-- ANCHOR:context -->
## 1. CONTEXT

This phase closes two gaps left after packet 028's phase 006 closeout: a literal template/code-standards adherence pass, and the manual-testing-playbook/feature-catalog artifacts phase 001 deferred or never addressed. Three judgment calls needed to be made before dispatching authoring work.
<!-- /ANCHOR:context -->

---

<!-- ANCHOR:decisions -->
## 2. DECISIONS

### Decision 1: skill-asset-template.md does not apply to the 39 HTML assets

**Decision**: The 39 files under `sk-create-diagram/assets/` (27 canonical diagram examples + 4 base templates + 7 special-pattern examples + `icons.html`) are exempt from `skill-asset-template.md`'s markdown structure (frontmatter, `## 1. OVERVIEW`, numbered sections). Kebab-case naming and SKILL.md/reference cross-referencing conventions still apply and are audited.

**Rationale**: `skill-asset-template.md` targets authored markdown assets (templates, reference tables, examples-as-prose) with a frontmatter+section contract meant for progressive disclosure. `sk-create-diagram`'s assets are not documentation about diagrams — they ARE the skill's deliverable output shape (self-contained editorial HTML/SVG files), the same artifact class the skill teaches an agent to produce. Forcing markdown frontmatter and `## OVERVIEW` sections into these files would corrupt them as valid rendered diagram examples. No sibling `sk-create-*` packet ships non-markdown assets to compare against directly; this is a first-of-kind case, decided on the template's own stated purpose ("provide copy-paste starting points," "show working examples of skill outputs") rather than a literal section-by-section fit.

**Alternatives considered**:
- Wrap each HTML file's purpose in a markdown frontmatter block before the `<!DOCTYPE html>` line — rejected: breaks the file as valid HTML and as a usable example.
- Create parallel `.md` description files per asset — rejected: 39 additional files with no reader, pure overhead not required by any cited rule.

### Decision 2: manual-testing-playbook/ and feature-catalog/ ship as packet-local subdirectories

**Decision**: Both packages live at `sk-create-diagram/manual-testing-playbook/` and `sk-create-diagram/feature-catalog/`, mirroring `sk-create-diff`'s shipped shape — not as new entries in `sk-doc`'s shared master `.opencode/skills/sk-doc/{manual-testing-playbook,feature-catalog}/` indexes.

**Rationale**: Reading both `sk-create-manual-testing-playbook/SKILL.md` §3 and `sk-create-feature-catalog/SKILL.md` §3, the canonical package contract is explicitly packet-local (`<skill>/manual-testing-playbook/`, `<skill>/feature-catalog/`), and `sk-create-diff` — the closest sibling in scope and maturity — ships exactly this shape. The `sk-doc`-level `manual-testing-playbook/`+`feature-catalog/` directories are a different, hub-scoped artifact class (categorized by cross-cutting routing/dispatch concerns like `intent-detection/`, `cross-cli-dispatch/`, not per-mode feature inventories) and are out of scope here per both packets' NEVER rule "add a packet-local `graph-metadata.json`" boundary and family-boundary sections, which assume the advisor identity — and by extension the master indexes — live at the hub root, not the packet.

**Alternatives considered**:
- Add a `sk-create-diagram` section to the shared master indexes instead — rejected: contradicts both packets' explicit canonical package shape and the `sk-create-diff` precedent; would also require touching shared hub-owned files, which this phase's scope explicitly avoids.

### Decision 3: Feature/scenario taxonomy — 3 categories, 9 features each

**Decision**: Both packages use the same 3-category, 9-feature taxonomy, matched 1:1 between catalog (current-state) and playbook (test scenario):

| Category | Feature ID | Feature |
|---|---|---|
| `diagram-generation` | DIA-001 | Diagram type selection & smart routing (27 types) |
| `diagram-generation` | DIA-002 | Editorial style guide & 5 mandatory connector rules |
| `diagram-generation` | DIA-003 | Agent-mediated onboarding flow |
| `diagram-generation` | DIA-004 | Primitive variants (annotation, sketchy, terminal, icon set) |
| `import-export` | IMP-001 | draw.io import (`drawio_extract.py`) |
| `import-export` | IMP-002 | Mermaid import (`mermaid_extract.py`) |
| `import-export` | IMP-003 | PNG/SVG export guidance |
| `command-and-hub-integration` | CMD-001 | `/create:diagram` command (auto/confirm modes) |
| `command-and-hub-integration` | CMD-002 | `sk-doc` hub registration (mode-registry/hub-router/command-metadata) |

**Rationale**: Both contracts explicitly discourage exhaustive per-instance enumeration (feature-catalog's "Do not overload the root catalog with exhaustive source-file tables"; the 27 diagram types are instances of one routing capability, DIA-001, not 27 separate features) and both explicitly favor a small, stable, capability-level taxonomy. `sk-create-diff` shipped 8 catalog features / 11 playbook scenarios across 3 categories at comparable packet complexity; 9/9 across 3 categories is proportionate for a packet with more surface area (27 diagram types vs. 5 diff formats) without inflating either package past what a reviewer can hold in mind.

**Alternatives considered**:
- One feature per diagram type (27 features) — rejected: explicitly against both contracts' "current shipped behavior, not exhaustive enumeration" guidance; would make the packages unreadable as an inventory.
- Fewer, coarser categories (e.g. one "core" category) — rejected: loses the natural generation/import-export/integration split that already exists in the packet's own phase structure (phases 002-003 vs. 004 vs. 005).
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:consequences -->
## 3. CONSEQUENCES

- Audit dispatches operate on a fixed, enumerable file list (SKILL.md, 37 references, 2 scripts, config surfaces) rather than an open-ended sweep — bounds the Deepseek v4 Flash dispatch scope and makes coverage independently checkable.
- The playbook/catalog taxonomy is fixed before authoring starts, removing ambiguity for the dispatched authoring agents and making cross-reference wiring (playbook scenario -> catalog feature) mechanical rather than judgment-dependent.
- No shared `sk-doc` hub files are touched by this phase, keeping blast radius identical to phases 001-004 (packet-local only) rather than phase 005's wider hub-registry radius.
<!-- /ANCHOR:consequences -->
