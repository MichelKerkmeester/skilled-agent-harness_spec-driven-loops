---
title: "Resource Map: diagram-design source inventory"
description: "Line-count and dependency inventory of every source file under context/, with a recorded fate for each."
trigger_phrases:
  - "diagram-design resource map"
  - "diagram source inventory"
importance_tier: "normal"
contextType: "research"
version: 1.0.0.0
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/001-inventory-and-skill-contract"
    last_updated_at: "2026-08-12T05:53:36.000Z"
    last_updated_by: "claude"
    recent_action: "Inventoried every source file's size and dependency footprint"
    next_safe_action: "Consume via decision-record.md in phase 002"
    blockers: []
    key_files:
      - "resource-map.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Resource Map: diagram-design source inventory

Bounded known-context inventory for phase 001. Every count below was read directly from `../context/` in this worktree (`wc -l`, `grep -E '^import|^from'`).

---

## 1. `skills/diagram-design/references/` — 37 files, 6,002 lines total

| File | Lines | Fate |
|------|-------|------|
| `SKILL.md` | 539 | **Restructure** — becomes the new `SKILL.md`, reordered into `WHEN TO USE / SMART ROUTING / HOW IT WORKS / RULES / SUCCESS CRITERIA / REFERENCES` |
| `style-guide.md` | 139 | Port — becomes `references/style-guide.md` |
| `onboarding.md` | 275 | Port, trimmed to agent-mediated guidance only (no packet script claims a network fetch) |
| `output-spec.md` | 181 | Port — becomes `references/output-spec.md` |
| `export.md` | 136 | Port — becomes `references/export.md` |
| `import-drawio.md` | 171 | Port — becomes `references/import-drawio.md` |
| `import-mermaid.md` | 126 | Port — becomes `references/import-mermaid.md` |
| `primitive-annotation.md` | 36 | Port |
| `primitive-sketchy.md` | 43 | Port |
| `primitive-terminal.md` | 76 | Port |
| `primitive-icons.md` | 827 | Port (icon set ships in v1 — see decision-record.md §5) |
| `type-architecture.md` | 78 | Port |
| `type-bar.md` | 48 | Port |
| `type-data-flow.md` | 374 | Port |
| `type-dp-integration.md` | 410 | Port |
| `type-dp-security-matrix.md` | 379 | Port |
| `type-er.md` | 23 | Port |
| `type-flowchart.md` | 23 | Port |
| `type-gantt.md` | 45 | Port |
| `type-high-level.md` | 458 | Port |
| `type-it-state.md` | 470 | Port |
| `type-layers.md` | 26 | Port |
| `type-line.md` | 44 | Port |
| `type-loop.md` | 223 | Port |
| `type-medallion.md` | 356 | Port |
| `type-nested.md` | 22 | Port |
| `type-org-chart.md` | 44 | Port |
| `type-process.md` | 495 | Port |
| `type-pyramid.md` | 33 | Port |
| `type-quadrant.md` | 81 | Port |
| `type-radar.md` | 80 | Port |
| `type-scatter.md` | 39 | Port |
| `type-sequence.md` | 130 | Port |
| `type-state.md` | 21 | Port |
| `type-swimlane.md` | 20 | Port |
| `type-timeline.md` | 20 | Port |
| `type-tree.md` | 24 | Port |
| `type-venn.md` | 26 | Port |

All 27 `type-*.md` files port with light adaptation only (frontmatter block per `skill-reference-template.md`, cross-reference paths updated, kebab-case filenames already conform). None require restructuring — they are already scoped, single-purpose reference docs, exactly the `references/` shape `sk-create-skill` expects.

`type-flowchart.md` (23 lines) here is the source's SVG decision-tree diagram type, unrelated to `sk-create-flowchart`'s ASCII markdown mode — no naming collision once both live under `sk-doc` since the packet is `sk-create-diagram` and this is an internal reference filename, not a public identity.

---

## 2. `skills/diagram-design/scripts/` — 2 files, 2,141 lines total

| File | Lines | Dependencies | Fate |
|------|-------|---------------|------|
| `drawio_extract.py` | 856 | stdlib only (`argparse`, `base64`, `html`, `json`, `re`, `struct`, `sys`, `zlib`, `dataclasses`, `pathlib`, `typing`, `urllib.parse`, `xml.etree`) | Port as-is (Python filename exempt from kebab-case) |
| `mermaid_extract.py` | 1,285 | stdlib only (`argparse`, `html`, `json`, `re`, `sys`, `dataclasses`, `pathlib`, `typing`) | Port as-is |

Zero third-party dependencies — no `pip install` step needed for either script. This satisfies the "prefer available project tools, add a dependency only when required" quality principle without any trade-off.

---

## 3. `skills/diagram-design/assets/` — 100 HTML files, 1.4M total

| Category | Count | Fate |
|----------|-------|------|
| `template.html`, `template-dark.html`, `template-full.html`, `template-terminal.html` | 4 | Port — the four base scaffolds referenced by "To create a new diagram" in `SKILL.md` |
| `example-<type>.html` (minimal light, one per type) | 27 | Port — the canonical example for each diagram type |
| `example-<type>-dark.html`, `example-<type>-full.html` | ~54 | **Drop** — redundant with the light variant for an internal skill; the variant *pattern* (light/dark/full) stays documented in `SKILL.md` §10, just not shipped as 3x the asset count |
| `example-quadrant-consultant.html`, `example-loop-terminal.html`, `example-sequence-oauth*.html`, `example-import-*.html` | ~7 | Port — these demonstrate a distinct pattern (consultant 2x2, terminal variant, combined-fragment sequence, import fidelity) not covered by the canonical set |
| `icons.html`, `index.html` | 2 | `icons.html` ports (icon gallery); `index.html` (tabbed 27-diagram browser) drops — it is a source-repo browsing convenience, not skill content an agent reads |

Net: ~100 source assets → ~34 shipped assets (4 templates + 27 canonical examples + ~7 special-pattern examples + 1 icon gallery, with 2 dropped/absorbed), roughly a 3x reduction while keeping full type coverage.

---

## 4. Everything else in `context/` — dropped, out of packet scope

| Path | Reason |
|------|--------|
| `.claude-plugin/`, `.codex-plugin/`, `.github/workflows/ci.yml`, `LICENSE`, `SECURITY.md`, `THIRD_PARTY_LICENSES.md`, `.gitignore` | Third-party plugin distribution/CI metadata for the *source repo's own release process* — this repository has its own skill-packaging and CI |
| `commands/`, `prompts/` (Claude Code / Pi command and prompt-template wrappers) | Superseded by this repo's `/create:diagram` router + presentation + auto/confirm YAML pattern (phase 005) |
| `scripts/build-icons.py`, `scripts/fix-mojibake.py`, `scripts/lint-skin.py`, `scripts/lint-skin-baseline.txt`, `scripts/test-lint-a11y.py`, `scripts/verify-drawio-import.py`, `scripts/verify-mermaid-import.py`, `scripts/vendor/`, `scripts/fixtures/` | Source repo's own CI/lint tooling that validates *its* release process, not runtime content this skill's user needs — see spec.md "Out of Scope" |
| `docs/screenshots/` | README illustration images for the source repo's GitHub page |
| `README.md` | Source repo's own marketing/install README; this packet gets its own `README.md` from `skill-readme-template.md` in phase 005 |
