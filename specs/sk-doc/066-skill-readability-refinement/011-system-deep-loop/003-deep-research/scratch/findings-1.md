### .skilled/skills/system-deep-loop/deep-research/README.md
- [P2] .skilled/skills/system-deep-loop/deep-research/README.md:41 | 1 | The README template bans semicolons in README prose, and this is the file's only one. | Replace `.../mode-registry.json`); this packet...` with `.../mode-registry.json`. This packet...` so the semicolon becomes a full stop.
- [P2] .skilled/skills/system-deep-loop/deep-research/README.md:78 | 9 | "now include" is a temporal change marker in a current-state README. | Delete `now `: `Lifecycle controls include [run-now control]...`
- [P2] .skilled/skills/system-deep-loop/deep-research/README.md:82 | 7 | The Externalized State paragraph packs five file roles and three ownership rules into one block; the README template asks for an itemized inventory. | Replace line 82 with:
  ```text
  All continuity lives in packet files under `{spec_folder}/research/`, not in conversation memory.
  - **Config:** `deep-research-config.json` holds settings.
  - **Log:** the append-only `deep-research-state.jsonl` records every iteration, event and convergence signal.
  - **Strategy:** `deep-research-strategy.md` tracks focus areas, what worked, what failed and exhausted approaches.
  - **Registry:** `findings-registry.json` indexes every discovery.
  - **Dashboard:** `deep-research-dashboard.md` shows convergence trends.
  - **Reducer:** machine-owns the strategy sections, the registry and the dashboard.
  - **Agent:** writes only iteration files and JSONL records.
  - **Workflow:** owns the canonical `research.md`.
  ```
- [P2] .skilled/skills/system-deep-loop/deep-research/README.md:205 | 1 | The capability-matrix row names OpenCode twice and omits Copilot, which the matrix actually covers. | Replace `across OpenCode, Claude and OpenCode executors` with `across OpenCode, Copilot and Claude executors`.

### .skilled/skills/system-deep-loop/deep-research/ROUTER.md
- [P2] .skilled/skills/system-deep-loop/deep-research/ROUTER.md:23 | 7 | The OVERVIEW is one sentence carrying the trigger vocabulary, hub selection, the default reference, the conditional reference families and the asset family. | Replace line 23 with:
  ```text
  - Requests reach this skill when they name `autoresearch`, a deep research loop, autonomous or iterative research, a multi-round investigation, a convergence check, a stuck loop, a research state packet or a `spec.md` anchoring question. The `system-deep-loop` hub's `research` mode selects this packet.
  - It routes to two resource families. The `references/` doctrine starts at `references/guides/quick-reference.md` on every invocation and adds the loop protocol, spec anchoring, convergence, state, recovery, runtime-parity and resource-map references. The `assets/` markdown templates and prompt assets load on explicit request.
  ```

### .skilled/skills/system-deep-loop/deep-research/SKILL.md
- [P2] .skilled/skills/system-deep-loop/deep-research/SKILL.md:19 | 1 | An H3 subsection sits in the H1 intro zone before Section 1; the SKILL template allows no subsections in the intro and requires the body to open with numbered H2s. | Move lines 19-30 to immediately after line 80 (`## 3. HOW IT WORKS`), before `### Invocation Contract`, keeping the block verbatim and one blank line on each side. The move is line-count neutral, so the cited lines at 95, 129, 148, 154 and 224 keep their numbers.
- [P1] .skilled/skills/system-deep-loop/deep-research/SKILL.md:229 | 10 | "(see §8 EXAMPLES)" points to a section that does not exist; §8 is REFERENCES AND RELATED RESOURCES and this file has no EXAMPLES section. | Delete ` (see §8 EXAMPLES)` so the sentence reads `...flags on the command. Each lineage...`

### .skilled/skills/system-deep-loop/deep-research/assets/deep-research-dashboard.md
- [P2] .skilled/skills/system-deep-loop/deep-research/assets/deep-research-dashboard.md:83 | 10 | `## 6A.` is a letter-suffixed H2, the file's only validator warning. | Rename to `## 7. DIVERGENT PIVOTS`; shift `## 7. NEXT FOCUS` to 8, `## 8. ACTIVE RISKS` to 9, `## 9. EXAMPLE (POPULATED)` to 10. The reducer emits the same titles at `scripts/reduce-state.cjs:2887, 3011, 3016, 3023, 3035`, so change them to 7, 8, 9, 10, 11 in the same commit.
- [P2] .skilled/skills/system-deep-loop/deep-research/assets/deep-research-dashboard.md:130 | 1 | The populated example labels the trend section `## 5. CONVERGENCE TREND`, but section 5 above and the reducer both use `## 5. TREND`. | Replace `## 5. CONVERGENCE TREND` with `## 5. TREND`.

### .skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md
- [P2] .skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md:131 | 10 | Sections 10A and 11A carry letter suffixes, and 11A sits before 11, so the file reads 10, 10A, 11A, 11, 12. | Renumber in document order, reserving 13 for the reducer's optional rejected-pattern cache: `10A`→`11`, `11A`→`12`, `11`→`14`, `12`→`15`, `13`→`16`. Change line 180 to `reducer controls Sections 3, 6, 7-14, including Section 11 pivot lineage`, and change the reducer titles at `scripts/reduce-state.cjs:2762, 2769, 2783, 2809` to 11, 12, 13, 14.

### .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-graph.md
- clean

### .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-recovery.md
- [P2] .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-recovery.md:17 | 3 | The intro opens with "This reference covers...", a pure pointer sentence that restates the Purpose. | Replace the first sentence with `When a research run stalls, the recovery ladder runs from retrying one source to state reconstruction and operator escalation.` Keep the second sentence, `The stop contract lives in `convergence.md`.`

### .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-reference-only.md
- clean
