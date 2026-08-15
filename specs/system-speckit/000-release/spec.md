# 000-release — v4.0.0.0 Release Notes & README Refresh (Planning Capture)

> **Phase parent — lean trio.** Root purpose only. The full plan lives in `plan.md`; each phase child holds its own charter.
> **Status:** PLANNING CAPTURE (temporary). No shipped runtime touched yet.

---

## Root Purpose

Gather every change between the last public GitHub release (`v3.6.0.0`, 2026-06-18) and the
`skilled/v4.0.0.0` branch head (2026-08-14) — **2,826 commits** — and turn them into:

1. Public **release notes** for the v4 GitHub release.
2. A refreshed **public root `README.md`**.

The v4 cycle refactored how skills work, rebuilt `system-spec-kit` and `system-deep-loop`,
added the `cli-external-orchestration` skill family, and reworked `sk-doc`, `sk-design`,
`mcp-tooling`, the advisor, and hooks. The scope is large but **mostly already documented**:
each shipped packet carries its own `implementation-summary.md`, so the release's table of
contents is essentially the packet list in `plan.md`.

## Cost Thesis

Do not feed 2,826 diffs to a model. 97% of commits are conventional-commit format, so
grouping is deterministic and free. The only real token spend is turning pre-grouped,
already-documented packet summaries into narrative — small inputs, ideal for cheap/free
models (GLM 5.2 high via cli-devin; DeepSeek V4 Flash via opencode-go pi). A capable model
(this session) writes the final public-facing prose.

## Phase Map

| Phase | Child | Purpose | Model tier |
|-------|-------|---------|-----------|
| 1 | `001-context-pack` | Deterministic git + packet context pack (the seed) | $0 script |
| 2 | `002-per-packet-extraction` | One cheap worker per packet → normalized release fragments | cheap/free, parallel |
| 3 | `003-deep-research-synthesis` | Seeded deep-research depth layer (cross-cutting themes) | GLM 5.2 + DeepSeek Flash |
| 4 | `004-release-notes-reduce` | Reduce → `release-notes-v4.0.0.0.md` via sk-doc changelog packet | Opus (this session) |
| 5 | `005-readme-update` | Surgical root README refresh | Opus (this session) |

## Non-Goals

- No modification of shipped runtime during **planning**. Any change to the deep-research
  mode (Phase 3) is its own Gate-3 packet under `system-deep-loop`, minimal and reversible.
- Not a per-minor changelog backfill unless explicitly chosen — one consolidated v3.6→v4 note.

## Metadata Note

`description.json` / `graph-metadata.json` here are hand-written lean stubs (spec-memory MCP
was disconnected at authoring time). Regenerate with `generate-description.js` + graph
backfill before relying on memory search / graph traversal.
