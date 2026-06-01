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
6. **006-deep-review** — deep-review loop over the built lane.
7. **007-deep-improvement-3lane-doc-rebuild** — three-lane documentation rebuild.
8. **008-playbook-manual-test-run** — manual playbook test run.
9. **009-sk-code-router-benchmarkability** — make sk-code's delegated router machine-readable so Lane C can benchmark it; harness reference-following + drift guard. (Originally standalone packet `126`; absorbed here.)
10. **010-skill-benchmark-live-playbook-mode** — Lane C "Mode B": benchmark a skill against its own `manual_testing_playbook` executed live via cli-opencode (dual-mode router CI gate + live default, browser executor, D4 ablation, generator). Realizes the Mode B deferred by `002-implementation-deep-research`. (Originally standalone packet `127`; absorbed here.)

Execution arc: 001 ✅ → 002 → 003 → 004 → 005 → 006 → 007 → 008 → 009 → 010.

## Consolidation — standalone packets 126/127 absorbed as phases 009/010

Two packets that began as track-level siblings were folded into this phase parent, since both continue the Lane C skill-benchmark work:

| Was (standalone) | Now (phase) |
| --- | --- |
| `126-sk-code-router-benchmarkability/` | `009-sk-code-router-benchmarkability/` |
| `127-skill-benchmark-live-playbook-mode/` | `010-skill-benchmark-live-playbook-mode/` |

`127` (now `010`) realizes the "Mode B" live-playbook benchmark that `002-implementation-deep-research` scoped as a follow-on; `126` (now `009`) is the prerequisite that made sk-code's router benchmarkable. Both retain their full Level-2 doc sets as phase children.

## Notes

- Parent keeps the lean trio (`spec.md`, `description.json`, `graph-metadata.json`) plus this `context-index.md`. Heavy per-phase docs live in the children.
- Sibling template: `121-deep-agent-improvement-benchmark-mode` (Lane B build), which used both a design-research phase and a dedicated implementation-deep-research phase before building — the same two-research-phase pattern is mirrored here (001 design → 002 implementation).
- Fixed design constraints carried into 002's strategy charter: (a) per-lane subdir layout (`skill-benchmark/` under `assets/`/`references/`/`scripts/` + `shared/`) is not a research question; (b) rename scope is narrow (skill + agent id + advisor + cross-refs; command verbs and the `agent-improvement` token family stay).
