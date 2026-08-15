# Merge Notes — pi-remote consolidation

> Provenance record for the consolidation of the pi-remote planning work into this
> single packet.

## What this packet is

The consolidated home for the pi-remote (mobile agent, Claude-Code-style) work. It
replaces two packets that previously lived under `specs/cli-external-orchestration/`:

- `044-pi-mobile-ui-ux-research` — earlier multi-surface UI/UX research (10 iterations).
- `047-pi-remote-desktop-parity-chat-ux` — the desktop-parity + chat-UX research, the
  Claude restyle plan, and the optimized phased implementation plan.

## How this tree was assembled

**Base (kept verbatim, unmodified):** the relocated tree —
- the parent `spec.md` + metadata,
- the 16 implementation phase children (`001-…` … `016-…`),
- `research/` (the deep-research run, `experience-parity/` sub-packet, `phase-gap/`),
- `review/` (the deep-review run).

**Overlay (added, non-destructive — nothing in the base was overwritten):** the newer
artifacts that the base did not contain —

| Added path | Source | What it is |
|---|---|---|
| `017-chat-ux-and-restyle/spec.md` | old `047/spec.md` | desktop-parity + chat-UX packet spec |
| `017-chat-ux-and-restyle/implementation-phases.md` | old `047` | the optimized 12-phase build plan |
| `017-chat-ux-and-restyle/restyle-plan.md` | old `047` | Claude design-system restyle plan |
| `017-chat-ux-and-restyle/restyle-plan-verification.md` | old `047` | adversarial verification of the restyle plan |
| `research/chat-ux-desktop-parity/` | old `047/research/` | merged Grok 4.5 + GPT SOL research synthesis + both lineages |
| `research/ui-ux/` | old `044/research/` (+ `044/spec.md`) | the 10-iteration UI/UX research |

The research overlays went into **new, distinctly-named subfolders** specifically so they
could not collide with the base tree's `research/` files (both trees carry files like
`deep-research-config.json` and `findings-registry.json`).

## Placement decision — resolved

The chat-UX + restyle plan was **promoted to a real phase child**,
`017-chat-ux-and-restyle/`, sitting alongside `001-…`–`016-…`. It carries its own
`description.json` + `graph-metadata.json` (generated with the sanctioned spec-kit tools;
`status: planned`). It is a plan child (spec + plan docs), not yet a full Level-3 child with
`plan.md`/`tasks.md`/`checklist.md`.

## Known issue — tree-wide stale graph metadata (needs a full regen)

The base tree's metadata predates its relocation and is **stale and internally
inconsistent**, independent of this merge:

- Every child's `description.json` / `graph-metadata.json` references the old path prefix
  `apps/pi-remote/001-…` (the tree now lives at `app-remote-agent-chat/001-…`).
- The parent `graph-metadata.json` `children_ids` lists children under **three** different
  historical conventions: `cli-external-orchestration/041-…`, `apps/pi-remote/041-…`, and
  `apps/pi-remote/001-…`. None match the current location.

The new `017` child was generated with the **correct current path**, so it is self-consistent
and points at the right target. Fixing the other 16 children + the parent requires a full
`generate-description` + `backfill-graph-metadata` pass over the whole packet — a separate
follow-up, not done here.

## What was removed

`specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/` and
`…/047-pi-remote-desktop-parity-chat-ux/` were removed, since their content now lives here.

## Not yet done (deliberately)

- Full-tree metadata regen (see the known-issue section above).
- `validate.sh --strict` was not run to closure — this is a relocation/merge, not a
  completion claim.
