# Context index — 122 phase restructure

Migration bridge for the phase-parent `122-deep-improvement-skill-benchmark-mode`.

## Placeholder → real phases (initial decomposition)

The packet was initialized with two empty placeholders, replaced by the real phase decomposition:

| Placeholder (removed) | Real phase |
| --------------------- | ---------- |
| `001-research-placeholder/` | `001-skill-benchmark-deep-research/` |
| `002-placeholder/` | `002-skill-rename-deep-improvement/` |
| — (new) | `003-skill-benchmark-mode/` |
| — (new) | `004-validation-and-docs/` |

## Renumber — inserted implementation-research phase

After Phase 001 (design research) completed, a dedicated implementation-deep-research phase was inserted at `002` (mirroring sibling packet 121, which ran design research **and** implementation research as separate phases before building its benchmark lane). The three downstream scaffold phases shifted up by one so the folder number matches execution order:

| Was | Now |
| --- | --- |
| `002-skill-rename-deep-improvement/` | `003-skill-rename-deep-improvement/` |
| `003-skill-benchmark-mode/` | `004-skill-benchmark-mode/` |
| `004-validation-and-docs/` | `005-validation-and-docs/` |
| — (new) | `002-implementation-deep-research/` |

## Phase order & dependencies (current)

1. **001-skill-benchmark-deep-research** — design research (5× MiniMax-2.7 / 5× DeepSeek-v4-pro / 5× GPT-5.5-xhigh-fast / 5× Opus-4.8-native). **Complete.** Informs 002 + 003 + 004.
2. **002-implementation-deep-research** — implementation research turning the 001 design into a build-ready playbook (depends on 001). Same 4-model × 5-iter machinery.
3. **003-skill-rename-deep-improvement** — rename `deep-agent-improvement` → `deep-improvement`, narrow scope (depends on 001 + 002).
4. **004-skill-benchmark-mode** — design + build Lane C (depends on 001 + 002 + 003).
5. **005-validation-and-docs** — three-lane docs, advisor, hardening (depends on 003 + 004).

Execution arc: 001 ✅ → 002 (impl research) → 003 (rename) → 004 (build) → 005 (docs).

## Notes

- Parent keeps the lean trio (`spec.md`, `description.json`, `graph-metadata.json`) plus this `context-index.md`. Heavy per-phase docs live in the children.
- Sibling template: `121-deep-agent-improvement-benchmark-mode` (Lane B build), which used both a design-research phase and a dedicated implementation-deep-research phase before building — the same two-research-phase pattern is mirrored here (001 design → 002 implementation).
- Fixed design constraints carried into 002's strategy charter: (a) per-lane subdir layout (`skill-benchmark/` under `assets/`/`references/`/`scripts/` + `shared/`) is not a research question; (b) rename scope is narrow (skill + agent id + advisor + cross-refs; command verbs and the `agent-improvement` token family stay).
