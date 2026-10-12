# Iteration 1: Q1 part 1 — the sk-code hub: surface order and installed-surface assumptions

## Focus
Q1 part 1: inventory every place inside the sk-code hub that encodes the surface order (OpenCode, Obsidian, Webflow) and every place that assumes `sk-code-obsidian` and `sk-code-webflow` are installed. Named files read: `hub-router.json`, `mode-registry.json`, `SKILL.md`, `ROUTER.md` (lines 1–264 of 618; the read hit the 20k-char cap), `README.md` (head 130 of 140), `shared/references/stack-detection.md`, `leaf-manifest.json`, `graph-metadata.json`, `description.json`, the three surface packet `SKILL.md` heads, and the v4.0.0.4 note entry "One Surface Order Everywhere". Compiled routing (`.skilled/bin/compiled-route.cjs`, `.skilled/bin/lib/compiled-routing/`), canary fixtures, the advisor scorer/boosts/batteries, doctor commands, and install guides remain for Q1 part 2.

## Actions Taken
All commands exited 0; no tool failures; no retries needed.

1. Read state: `deep-research-config.json` (114 lines), `deep-research-strategy.md` (177 lines); `wc -l` on `deep-research-state.jsonl` = 1 line (a `type:"config"` record), `jq` count of `type=="iteration"` = 0 → this is iteration 1. (exec, exit 0)
2. Read `hub-router.json` (96 lines) and `mode-registry.json` (116 lines).
3. Read `SKILL.md` (209 lines), `shared/references/stack-detection.md` (156 lines), `ROUTER.md` (lines 1–264 of 618; remainder deferred to Q1 part 2).
4. Grep sweeps: order-pattern sweep across `.skilled/skills/sk-code` (60 hits, capped); hub-root sweep with bare-basename glob (70 hits — matched nested packet READMEs, not the hub-root files; see Reflection); surface-packet sweep (60 hits, mostly reference noise); v4.0.0.4 note sweep (2 hits).
5. Batch `cat`/`head` of `leaf-manifest.json` (275 lines), `graph-metadata.json` (287), `description.json` (57), `README.md` head -130, and the three surface `SKILL.md` heads (45 lines each); the output overflowed to a capture file and the omitted middle was extracted with one grep over that capture (exec, exit 0).

Tool-call count: 14 research calls (over the persona's 3–5 action target / 12 total guidance, under the config's `maxToolCallsPerIteration` = 24) + 1 narrative write + 1 verification exec. `research/research.md` was **not** updated despite `progressiveSynthesis: true`, because this run's ALLOWED WRITE PATHS list names only the iteration narrative, the delta file, and the append-gateway's own writes.

## Findings
Format: `| class | claim | evidence | priority |`. Every row was opened in this iteration.

| class | claim | evidence | priority |
| --- | --- | --- | --- |
| ORDER | `hub-router.json:7` tieBreak is `["sk-code-quality","sk-code-review","sk-code-opencode","sk-code-obsidian","sk-code-webflow"]` — the hub's one full rank; `SKILL.md:74` defines it as the bundle order and calls it the detection precedence OPENCODE > OBSIDIAN > WEBFLOW. | read `.skilled/skills/sk-code/hub-router.json:7`; `.skilled/skills/sk-code/SKILL.md:74` | P1 |
| ORDER | `shared/references/stack-detection.md:39` states "**Precedence**: OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN", implemented in §2 as early-return bash blocks in that order (OPENCODE first, OBSIDIAN second, WEBFLOW third). | read `.skilled/skills/sk-code/shared/references/stack-detection.md:37-63` | P1 |
| ORDER | `SKILL.md:139` restates "at precedence OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN". | read `.skilled/skills/sk-code/SKILL.md:139` | P2 |
| ORDER | `hub-router.json` routerSignals object literal orders keys quality `:21`, review `:26`, webflow `:31`, opencode `:36`, obsidian `:42` — Webflow precedes OpenCode in the JSON text even though tieBreak ranks OpenCode first. | read `.skilled/skills/sk-code/hub-router.json:20-47` | P2 |
| ORDER | `mode-registry.json` is Webflow-first: `:19` `"surfaces": ["sk-code-webflow","sk-code-opencode","sk-code-obsidian"]`; `:5` description `(sk-code-webflow/sk-code-opencode/sk-code-obsidian)`; `modes[]` entries run webflow `:60`, opencode `:78`, obsidian `:96`. | read `.skilled/skills/sk-code/mode-registry.json:5,19,60-114` | P2 |
| ORDER | `SKILL.md` lists Webflow-first at `:15` (three read-only evidence packets), `:36-38` (surface table), `:40` ("The hub has exactly three surfaces, WEBFLOW …, OPENCODE … and OBSIDIAN …"). | read `.skilled/skills/sk-code/SKILL.md:15,32-40` | P2 |
| ORDER | `sk-code-quality/SKILL.md:15,37,48,190,196,289` and `sk-code-quality/README.md:59,108` list "`sk-code-webflow` / `sk-code-opencode` / `sk-code-obsidian`" Webflow-first. | grep sweep hits, lines as listed | P2 |
| ORDER | The review packet is internally mixed: `sk-code-review/references/review-core.md:68` says "`OPENCODE`, `OBSIDIAN` or `WEBFLOW`" while `sk-code-review/SKILL.md:39,42,499` list Webflow-first. | grep sweep hits | P2 |
| ORDER | `leaf-manifest.json` `modes[]` runs obsidian `:35-36`, opencode `:114-115`, quality `:123-124`, review `:139-140`, webflow `:270-271` — a third variant (Obsidian first, Webflow last). | `cat leaf-manifest.json` (275 lines) in batch capture; line offsets derived from the captured `wc -l` framing | P2 |
| ORDER | The advisor-facing files are Webflow-first: `graph-metadata.json:282` causal_summary says "(sk-code-webflow, sk-code-opencode, sk-code-obsidian)"; `README.md:23,55-57,90` and `description.json:2,45-49` likewise. | batch capture of `graph-metadata.json`, `README.md`, `description.json` | P2 |
| ORDER / DOC | `v4.0.0.4.md:297` claims "Every sk-code file that ranks the code surfaces now says OpenCode, then Obsidian, then Webflow". True for the two ranking encodings (rows 1–2); the hub still carries at least five Webflow-first lists (rows 5–10), so an external reader sees a different order depending on which file they open. | read `.skilled/changelog/skilled/v4.0.0.4.md:295-297` | P1 |
| PRESENCE | `hub-router.json:31-46` registers `sk-code-webflow` and `sk-code-obsidian` as first-class routerSignals (weight 4 each); their keyword classes `:73-94` fire on generic words ("webflow", "frontend", "html", "css", "obsidian", "manifest.json", "vault", "note database"). Deleting the packets leaves live signals that match and then find nothing. | read `.skilled/skills/sk-code/hub-router.json:20-46,73-94` | P1 |
| PRESENCE | tieBreak `:7` and `mode-registry.json:19,60-114` enumerate both packets as installed modes; no hub file marks them optional, example, or deletable. | reads above | P1 |
| PRESENCE | `SKILL.md:15` ("three read-only evidence packets") and `:40` ("The hub has exactly three surfaces") assert the two example packets are present. | read `.skilled/skills/sk-code/SKILL.md:15,40` | P1 |
| PRESENCE | `SKILL.md:17` assumes `sk-code-obsidian` exists ("carries a pre-release 0.x line in its own changelog"). | read `.skilled/skills/sk-code/SKILL.md:17` | P2 |
| PRESENCE | `stack-detection.md` — the shared layer every mode consumes — hardcodes the operator's project: `:30` defines OBSIDIAN as "The Note Database Obsidian plugin", `:45-50` are that repo's detection markers, `:67-75` the symlink guard describes "The Obsidian plugin repository symlinks `.opencode`, `.claude`, `.codex`, `.cursor`, and `.devin` at its root back to this hub". | read `.skilled/skills/sk-code/shared/references/stack-detection.md:26-50,67-75` | P1 |
| PRESENCE | `stack-detection.md:138-144` test cases cite operator-only paths ("Obsidian Plugin/.worktrees/001-*/src/views", "apps/desktop/src/styles/app.css"). | read `.skilled/skills/sk-code/shared/references/stack-detection.md:129-148` | P2 |
| PRESENCE | `sk-code-quality/SKILL.md:192` loads OBSIDIAN target checklists from `../sk-code-obsidian/assets/` — the stack-agnostic quality mode depends on the obsidian packet's assets. | grep sweep hit, line 192 | P1 |
| PRESENCE | `graph-metadata.json:229-254` hardcodes `sk-code-webflow/SKILL.md` and `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md` in advisor resource hints; `description.json:45-49` carries both packet names. | batch capture | P2 |
| PRESENCE | `ROUTER.md:41-42` declares evidence surfaces "registered in `mode-registry.json`, typed in `leaf-manifest.json`", folded into the §11 RESOURCE_MAP projection, with "a drift guard [that] enforces that the parent projection equals the union of all surface maps plus the parent-owned universal/shared tier" — a deleted surface is an input that guard was not written to expect. Guard behavior itself is unobserved (Q2). | read `.skilled/skills/sk-code/ROUTER.md:39-42` | P1 |
| PRESENCE | `sk-code-obsidian/SKILL.md:2-3,17-23` defines the packet as the operator's Note Database plugin (plugin id `note-database`, package `obsidian-note-database`) — the packet body itself is operator-specific. | read `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md:1-45` (head, batch capture) | P1 |
| OK | `SKILL.md:95-101` `load_if_available()` checks `path.exists()` before loading, so a deleted surface packet is skipped at load time rather than erroring — the hub's loader tolerates deletion (metadata, signals, docs, and guards still reference the packets; rows 12–21). | read `.skilled/skills/sk-code/SKILL.md:88-135` | P1 |
| OK | Workflow modes are declared stack-agnostic (`mode-registry.json:25-26,43-44` `packetKind: "workflow"`; `SKILL.md:25-30`), and `hub-router.json:5-6` keeps `defaultMode: null` with a `shared/README.md` fallback (`:14-16`) — the zero-signal branch does not depend on the example surfaces. | reads above | P2 |
| OK | The shared doctrine is genuinely shared: `workflow-implement/debug/verify` live once under `shared/references/` and are symlinked into each surface (`SKILL.md:42,170,184`; the `sk-code-obsidian` leaf list includes `references/workflow-*.md`). | read `.skilled/skills/sk-code/SKILL.md:42,170,184`; `cat leaf-manifest.json` | P2 |
| OK | `--surface-hint` semantics are documented consistently across `v4.0.0.4.md:297`, `SKILL.md:63` and `ROUTER.md:37`: the hint only reorders surfaces the prompt already matched; "a hint never adds or drops a target". | reads above | P2 |

### Options (preliminary — Q3 is a later iteration; recorded here so the reducer can rank them)

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
| --- | --- | --- | --- | --- |
| A. Derive the rank from registry metadata | Add rank/example (and native/fallback on opencode) fields per `modes[]` entry in `mode-registry.json:22-114`; mint `hub-router.json:7` tieBreak (and any compiled manifest) from it | registry + compiled-routing mint + drift guards + canary fixtures regenerated | parity/canary breakage until regenerated; advisor-invisible metadata change only | Hand-edit `hub-router.json:7` — fails: the rank is also asserted in `stack-detection.md:39` and `SKILL.md:74,139`, the compiled manifest/canaries encode it (Q1 part 2 to confirm), and the five Webflow-first lists (rows 5–10) would still contradict it |
| B. Docs-only example marking | Mark the two packets as examples to delete/replace in `SKILL.md`, `README.md`, `stack-detection.md`, and the doctor output | prose edits only | routing behavior unchanged — tieBreak and live signals still advertise both packets; nothing scaffolds a user surface | Change nothing — fails the operator requirement that the doctor and everything else assume the examples are gone |
| C. Rely on `--surface-hint` as the priority mechanism | No code change; document that users pass their surface as a hint | zero new code | per `v4.0.0.4.md:297` / `SKILL.md:63`, the hint only leads on keyword ties for surfaces the prompt already matched; a user surface still cannot outrank OpenCode for prompts that do not name both | None cheaper — but alone it cannot satisfy "user surface outranks OpenCode"; at most a complement to A |

## Questions Answered
None fully answered this iteration. Q1 is partially covered: the hub-side encodings are inventoried (rows 1–21), while the compiled-routing runtime/manifest, canary fixtures, advisor scorer/boosts/batteries, doctor commands, and install guides remain for Q1 part 2. Recorded `answeredQuestions: []` so the reducer does not tick Q1 early.

## Questions Remaining
- Q1 (part 2: `.skilled/bin/compiled-route.cjs`, `.skilled/bin/lib/compiled-routing/`, compiled manifest, canary fixtures, advisor scorer/boosts/batteries, `.skilled/commands/doctor/`, install guides/READMEs)
- Q2, Q3, Q4, Q5, Q6 — untouched this iteration.

## Ruled Out
- Broad repo-wide order grep before reading the named hub files: the bare-basename glob matched nested packet READMEs first and the 70-hit cap exhausted before the hub-root files; targeted reads were cheaper. (Evidence: grep result counts and file paths in Actions Taken item 4.)
- Treating `mode-registry.json:19` `surfaces` array as the ranking: it is a declaration list; the rank lives in `hub-router.json:7` tieBreak plus the `stack-detection.md:39` precedence. Conflating them would misstate the v4.0.0.4 claim's accuracy.

## Dead Ends
- None definitively eliminated. The BREAK-class observation (deleting the two packets in a throwaway copy) was intentionally not attempted: this iteration's focus is the static hub inventory; the deletion experiment is Q2's focus. No throwaway copy was created.

## Edge Cases
- Ambiguous input: none material. "Q1 part 1" was read as the hub-static inventory, per the dispatch's file list.
- Contradictory evidence: the ordering inconsistency (rank OpenCode-first vs. five Webflow-first lists) is recorded as rows 5–11 rather than resolved — the release note's "every file" claim does not match the hub text.
- Missing dependencies: none. `resource-map.md` is absent by config (`resource_map_present: false`); no coverage gate applied.
- Partial success: `ROUTER.md` lines 265–618 (§8–§11, including the §11 RESOURCE_MAP projection the drift-guard row cites) and `README.md` lines 131–140 were not read — noted for Q1 part 2. Status remains `complete`: the focus's core inventory is answered.

## Sources Consulted
- `.skilled/skills/sk-code/hub-router.json:1-96` (full read)
- `.skilled/skills/sk-code/mode-registry.json:1-116` (full read)
- `.skilled/skills/sk-code/SKILL.md:1-209` (full read)
- `.skilled/skills/sk-code/ROUTER.md:1-264` (partial; 265-618 deferred)
- `.skilled/skills/sk-code/README.md:1-130` (head; 131-140 deferred)
- `.skilled/skills/sk-code/leaf-manifest.json` (275 lines, batch capture)
- `.skilled/skills/sk-code/graph-metadata.json` (287 lines, batch capture)
- `.skilled/skills/sk-code/description.json` (57 lines, batch capture)
- `.skilled/skills/sk-code/shared/references/stack-detection.md:1-156` (full read)
- `.skilled/skills/sk-code/sk-code-opencode/SKILL.md:1-45` (head)
- `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md:1-45` (head)
- `.skilled/skills/sk-code/sk-code-webflow/SKILL.md:1-45` (head)
- `.skilled/skills/sk-code/sk-code-quality/SKILL.md:15,37,48,190,192,196,225,289` (grep hits)
- `.skilled/skills/sk-code/sk-code-review/SKILL.md:39,42,499`; `.skilled/skills/sk-code/sk-code-review/references/review-core.md:68` (grep hits)
- `.skilled/skills/sk-code/sk-code-obsidian/scripts/run-source-gates.sh:41` (grep hit)
- `.skilled/changelog/skilled/v4.0.0.4.md:293-299` (grep context)
- State files: `deep-research-config.json`, `deep-research-strategy.md`, `deep-research-state.jsonl` (lineage-local)

## Assessment
- New information ratio: 0.90 (first iteration; 25 findings, all new inventory — 0.90 rather than 1.0 because two rows restate the v4.0.0.4 note's own claim rather than adding new evidence)
- Questions addressed: Q1 (hub-side part only)
- Questions answered: none fully

## Reflection
- What worked and why: reading the named hub-root files directly first located the only true rank (`hub-router.json:7` + `stack-detection.md:39`) immediately, which then anchored the classification of every list as "variant" rather than "rank". The batch `cat` + overflow-grep pattern covered six remaining files in two calls.
- What did not work and why: bare-basename grep globs (`{README.md,...}`) match at any depth, so walk order under the hit cap surfaced nested packet READMEs instead of the hub-root files — two sweep calls returned mostly noise ("example.com" fixtures, benchmark reports).
- What I would do differently: anchor globs to the hub root (or read named files directly), and split the `ROUTER.md` read explicitly so §8–§11 is covered in Q1 part 2. Budget note: 14 research calls vs the 3–5 target — the focus named 10+ files; the config cap is 24.

## Recommended Next Focus
Q1 part 2: the compiled-routing runtime and its consumers — `.skilled/bin/compiled-route.cjs`, `.skilled/bin/lib/compiled-routing/` (manifest + mint), canary fixtures, the advisor scorer/boosts/batteries, `.skilled/commands/doctor/` checks, install guides/READMEs — plus `ROUTER.md:265-618` (§8–§11 RESOURCE_MAP projection and drift guard). Then Q2's throwaway-copy deletion experiment.
