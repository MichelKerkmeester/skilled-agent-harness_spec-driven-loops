# Context: Extension Source Snapshots

Pinned source snapshots of the three researched pi fast-mode extensions, used as
implementation references by this packet. Shallow clones with `.git` removed;
commits are pinned here and cited in the phase docs.

| Package | Upstream | Commit | Role |
|---------|----------|--------|------|
| pi-openai-fast-mode | github.com/johncmunson/pi-openai-fast-mode | `9b28456` (v0.3.0) | **Fork base** — engine, config, widget indicator, /fast + --fast |
| pi-gpt-fast-mode | github.com/devwithpug/pi-gpt-fast-mode | `2ac61e0` | **Handoff reference** — `src/handoff.ts` env pattern (`PI_GPT_FAST_MODE`) |
| pi-fast-mode (TheBinaryGuy) | github.com/TheBinaryGuy/pi-fast-mode | `e2827b6` | **UX reference** — footer-composition indicator; considered and rejected (fights pi-statusline's footer) |

Refresh policy: re-clone and re-pin when the fork base needs a newer upstream; do not edit these snapshots in place.
