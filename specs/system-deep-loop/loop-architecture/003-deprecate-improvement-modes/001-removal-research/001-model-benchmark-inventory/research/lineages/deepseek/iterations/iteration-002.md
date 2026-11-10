# Iteration 2: `.skilled/commands/deep/` command surfaces

## Focus

The `/deep:model-benchmark` command family: `model-benchmark.md`, `assets/deep-model-benchmark-auto.yaml`, `assets/deep-model-benchmark-confirm.yaml`, `assets/deep-model-benchmark-presentation.txt`, plus the Lane B cross-references inside the shared agent-improvement command surfaces and the commands README/compiled/legacy manifolds.

## Actions Taken

- Sized the command family with `wc -l` (145/246/276/489 lines) and read `model-benchmark.md` plus the presentation head and the YAML identity lines.
- Mapped Lane B cross-references in `agent-improvement.md`, `assets/deep-agent-improvement-{auto,confirm}.yaml`, `assets/deep-agent-improvement-presentation.txt`, `assets/compiled/README.md`, `assets/legacy/README.md`.
- Searched every `deep[-_]model[-_]benchmark` asset-name reference repo-wide within `.skilled` and read `.skilled/commands/README.txt` context.

## Findings

1. `.skilled/commands/deep/model-benchmark.md` (145 lines) is the dedicated command router: frontmatter, setup gate, `lane = model-benchmark` fixed, owned-asset table, YAML loading rules. **DELETE** the whole file [SOURCE: .skilled/commands/deep/model-benchmark.md:1-145]
2. `.skilled/commands/deep/assets/deep-model-benchmark-auto.yaml` (246 lines) is the autonomous Lane B workflow (role "Model Benchmark Specialist", outputs under `deep-improvement/benchmark/model-benchmark/{run_label}`). **DELETE** the whole file [SOURCE: .skilled/commands/deep/assets/deep-model-benchmark-auto.yaml:4-5,187]
3. `.skilled/commands/deep/assets/deep-model-benchmark-confirm.yaml` (276 lines) is the interactive Lane B workflow with guarded promotion via `promote-candidate.cjs`. **DELETE** the whole file [SOURCE: .skilled/commands/deep/assets/deep-model-benchmark-confirm.yaml:4-5,255]
4. `.skilled/commands/deep/assets/deep-model-benchmark-presentation.txt` (489 lines) is the Lane B presentation contract (setup questions, dashboards, next steps). **DELETE** the whole file [SOURCE: .skilled/commands/deep/assets/deep-model-benchmark-presentation.txt:1-489]
5. Both Lane B YAMLs record state through the append gateway with `--mode model-benchmark`; deleting them removes the last command-surface caller of that gateway mode, but the gateway/ledger mode registration and its schema packages must be inventoried separately. **DELETE with dependency** (indirect wiring runs in iteration 9) [SOURCE: .skilled/commands/deep/assets/deep-model-benchmark-auto.yaml:117]
6. Lane B YAML steps invoke shared packet scripts: `scripts/shared/loop-host.cjs --mode=model-benchmark`, `scripts/model-benchmark/lib/reviewer-scorer.cjs`, `scripts/shared/promote-candidate.cjs`, `scripts/shared/improvement-journal.cjs`, `scripts/shared/reduce-state.cjs`. The shared/ scripts are also the Lane A engine: **SHARED-WITH-AGENT-IMPROVEMENT**; the `scripts/model-benchmark/**` executables are Lane B-only and are inventoried in iteration 3 [SOURCE: .skilled/commands/deep/assets/deep-model-benchmark-confirm.yaml:228,238,255,262]
7. The Lane B run contract writes `{spec_folder}/improvement/model-benchmark-config.json` (spec-local) and outputs into `.skilled/skills/system-deep-loop/deep-improvement/benchmark/model-benchmark/{run_label}`. Neither is a static repo artifact; deletion planning only needs to confirm no committed outputs directory exists [SOURCE: .skilled/commands/deep/assets/deep-model-benchmark-presentation.txt:19]
8. `.skilled/commands/deep/agent-improvement.md` hands off to Lane B at four sites (lane resolution, routing step 4, step 5 note, final related-commands note). **EDIT** these four sites; the Lane A file itself survives [SOURCE: .skilled/commands/deep/agent-improvement.md:66,85-86,103,123]
9. `assets/deep-agent-improvement-presentation.txt` carries the deep Lane B block: lane markers, conflict handling, auto-route diagram, handoff parse, and the entire "Model-Benchmark Mode (Lane B)" section through the command map row. **EDIT** the block (lines 35-501 region), removing Lane B text while keeping the Lane A statements [SOURCE: .skilled/commands/deep/assets/deep-agent-improvement-presentation.txt:35,50,74-94,151-155,473-486,491]
10. `assets/compiled/README.md:23` and `assets/legacy/README.md:23` both state that `deep/model-benchmark` is a fallback-only, not compiler-managed entry. **EDIT** both sentences to keep only `deep/agent-improvement`; the compiled/ and legacy/ trees themselves contain no model-benchmark bodies (confirmed: only ai-council/research/review files exist there) [SOURCE: .skilled/commands/deep/assets/compiled/README.md:23]
11. The Lane A YAMLs themselves consume the model-benchmark asset `assets/model-benchmark/benchmark-profiles/default.json` and script `scripts/model-benchmark/run-benchmark.cjs` for their packet-local fixture step. Both are **SHARED-WITH-AGENT-IMPROVEMENT** and must not be deleted with the Lane B-only files [SOURCE: .skilled/commands/deep/assets/deep-agent-improvement-auto.yaml:258,265]
12. Filename drift: the agent-improvement presentation references `deep_model-benchmark_{auto,confirm}.yaml` with underscores while the real assets are `deep-model-benchmark-*.yaml`. Any edit must not propagate the wrong name; recorded here as a latent bug in the deleting change [SOURCE: .skilled/commands/deep/assets/deep-agent-improvement-presentation.txt:92,154]
13. `.skilled/commands/README.txt` lists the command in the tree (`model-benchmark.md`) and in the command table with usage. **EDIT** both lines [SOURCE: .skilled/commands/README.txt:100,181]

## Ruled Out

- Searching for model-benchmark inside `research.md`, `review.md`, `ai-council.md`: no matches; the three sibling command files do not reference Lane B.
- Treating all `deep-agent-improvement-*` mentions as DELETE: the Lane A surfaces survive; only their Lane B paragraphs are edits.
- Treating `run-benchmark.cjs` / `benchmark-profiles/default.json` as Lane B-only: Lane A YAMLs call them directly (finding 11), so they are shared.

## Dead Ends

- `assets/compiled/manifest.jsonl` and `assets/legacy/` bodies: confirmed no model-benchmark pairs exist; only the README sentences mention it.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none; all named files exist.
- Partial success: none.

## Sources Consulted

- .skilled/commands/deep/model-benchmark.md
- .skilled/commands/deep/assets/deep-model-benchmark-auto.yaml
- .skilled/commands/deep/assets/deep-model-benchmark-confirm.yaml
- .skilled/commands/deep/assets/deep-model-benchmark-presentation.txt
- .skilled/commands/deep/agent-improvement.md
- .skilled/commands/deep/assets/deep-agent-improvement-auto.yaml
- .skilled/commands/deep/assets/deep-agent-improvement-confirm.yaml
- .skilled/commands/deep/assets/deep-agent-improvement-presentation.txt
- .skilled/commands/deep/assets/compiled/README.md
- .skilled/commands/deep/assets/legacy/README.md
- .skilled/commands/README.txt

## Assessment

- New information ratio: 1.0
- Questions addressed: KQ2 (partially: command surface complete, packet surface deferred to iteration 3)
- Questions answered: none (KQ2 completes with iteration 3)

## Reflection

- What worked and why: sizing files first surfaced that the command surface is four delete-only files plus edits inside Lane A surfaces; the Lane B/Lane A seam (shared scripts) emerged from reading the YAML step bodies rather than the prose.
- What did not work and why: nothing material.
- What I would do differently: begin packet-level classification (iteration 3) with the Lane A-consumed asset list already in hand, to avoid re-deriving the shared subset.

## Recommended Next Focus

Iteration 3: the `deep-improvement/` packet — `SKILL.md` §Lane B, `references/model-benchmark/**`, `assets/model-benchmark/**`, `scripts/model-benchmark/**`, `scripts/shared/loop-host.cjs` mode dispatch, feature-catalog model-benchmark-mode pages, manual-testing-playbook model-benchmark pages, behavior-benchmark scenario, routing-allowlist.json, and the Lane A-shared dependency boundary.
