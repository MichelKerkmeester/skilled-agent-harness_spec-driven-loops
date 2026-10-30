# Iteration 1: Current-state contract — what DEPTH does inside sk-prompt vs what REQ-002..011 demand

## Focus

Map the real DEPTH surface (skill, router, references, callers) against the demanded end-state in `specs/sk-prompt/010-sk-prompt-improvements/spec.md` REQ-002..011, so the replacement design inherits exactly what is load-bearing and knowingly drops the rest. steer.md checked before start: absent.

## Actions Taken

1. Read `.skilled/skills/sk-prompt/ROUTER.md` in full (269 lines) — intent model, machine router pseudocode, resource loading levels.
2. Read `.skilled/skills/sk-prompt/references/depth-framework.md` in full (452 lines) — phases, energy levels, perspectives, techniques, CLEAR integration.
3. Read `.skilled/skills/sk-prompt/SKILL.md` in full (322 lines) — pipeline, rules, agent contract.
4. Read `.skilled/agents/prompt-improver.md` (425 lines) and `.skilled/commands/prompt/improve.md` (89 lines) — caller contracts.
5. Inspected `assets/framework-registry.json`, `assets/cli-prompt-quality-card.md`, benchmark tree, and grep-measured DEPTH/depth-framework counts across skill, agent, command, and playbook.

## Findings

1. DEPTH is the router's default load, not an optional reference: `DEFAULT_RESOURCE = "references/depth-framework.md"` loads for every intent except FRAMEWORK and RAW — including UNKNOWN_FALLBACK — so a DEPTH-less build must either name a new default or delete the default-load step; leaving the pointer orphaned would break every routed run. [SOURCE: .skilled/skills/sk-prompt/ROUTER.md:116,144,254]
2. The confirm workflow's checkpoints are literally DEPTH phases: `improve.md` says the confirm YAML "pauses at the Discover phase, the Prototype phase and the Test phase," so removing DEPTH breaks the command's checkpoint contract, not just its prose; the three owned assets (`prompt_improve_presentation.txt`, `prompt_improve_auto.yaml`, `prompt_improve_confirm.yaml`) are the real carriers of the pipeline. [SOURCE: .skilled/commands/prompt/improve.md:39-45,88]
3. The one-pass-checklist shape REQ-002 demands already exists inside this repo as the fast path: `cli-prompt-quality-card.md` runs a task→framework table, a CLEAR 5-question pre-dispatch check, and explicit escalation triggers, and three `cli-*` cards mirror it via a no-inlining guard script — the rebuild can promote that proven pattern rather than invent one. [SOURCE: .skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md:17,27,66,85,188]
4. DEPTH's load-bearing internals the checklist must absorb or deliberately drop: four energy levels (Raw/Quick/Standard/Deep), a blocking 3–5-perspective minimum, five cognitive techniques, RICCE parts-check before CLEAR, CLEAR 40+/50 with per-dimension floors (C7 L7 E10 A7 R3), a max-1 improvement cycle, and proof-through-output metadata (Mode/Framework/Perspectives/Score). REQ-002's ~10-component list subsumes RICCE and part of the Test phase but silently drops perspectives, techniques and energy scaling — that is a design decision to record, not an oversight to inherit. [SOURCE: .skilled/skills/sk-prompt/references/depth-framework.md:45-50,98-102,259-274,371-398]
5. The modes table encodes effort as DEPTH rounds (10/3/0 for text/$short/$raw) and the agent's COMPOSE step "chooses DEPTH energy" from `complexity_hint` — with DEPTH gone, `$short`, `$refine`, `dispatch_mode` and `complexity_hint` lose their meaning unless a non-DEPTH effort knob replaces rounds. REQ-002 does not answer this; it is an extension the build needs. [SOURCE: .skilled/skills/sk-prompt/SKILL.md:99-108,271; .skilled/agents/prompt-improver.md:88,285]
6. CLEAR is specified twice with different depth: `depth-framework.md` §4 (dimensions, floors, checkpoint yaml) and `patterns-evaluation.md` §10 "CLEAR EVALUATION MASTERY" plus §11 multi-pass/comparative scoring. If CLEAR survives as REQ-007's "short screen," exactly one canonical home must be chosen — patterns-evaluation §10 is the richer source. [SOURCE: .skilled/skills/sk-prompt/references/depth-framework.md:257-365; .skilled/skills/sk-prompt/references/patterns-evaluation.md:602-739]
7. `assets/framework-registry.json` — which REQ-008 says to retire or reduce to aliases — is not a user-facing framework registry; it is data-only benchmark scaffold (slot templates `{{task}}`, `{{constraints}}`, `{{output_contract}}`) for five of the seven code frameworks, consumed by benchmark rigs. Retiring it touches benchmark tooling, not routing or prompting behavior — the REQ's acceptance criterion is aimed at the wrong artifact. [SOURCE: .skilled/skills/sk-prompt/assets/framework-registry.json:1-4]
8. REQ-005's gap is confirmed: `strip_source_prompt` has zero hits in ROUTER.md, and `score_intents()` runs keyword weights over the raw task text — a `$json` or "yaml" substring inside a pasted prompt steers intent today. The pasted-prompt guard is a real missing control. [SOURCE: .skilled/skills/sk-prompt/ROUTER.md:197-204; specs/sk-prompt/010-sk-prompt-improvements/spec.md:105]
9. REQ-004's target is verified at SKILL.md §4 ALWAYS#1 ("ALWAYS ask ONE comprehensive question ... in an interactive run whose request leaves the goal open"), but the same rule already exempts non-interactive runs ("proceeds on stated assumptions and flags each one") — deliver-first already half-exists for agents; the gap is interactive runs and the command's input gate, which BLOCKS until `prompt_input` is bound. [SOURCE: .skilled/skills/sk-prompt/SKILL.md:134-137; .skilled/commands/prompt/improve.md:13-19]
10. Spec's measured footprint checks out with one refinement: `manual-testing-playbook` carries DEPTH-or-depth-framework in 25 of 29 markdown files (exactly the spec's "25 files"); `.skilled/commands/prompt/` is `improve.md` plus a 3-file `assets/` dir, i.e. the spec's "(4 files)" is right only when assets are counted. [SOURCE: specs/sk-prompt/010-sk-prompt-improvements/spec.md:82; verified by grep counts this iteration]

## Ruled Out

- Treating `framework-registry.json` as the framework *selection* surface REQ-008 implies: it is benchmark scaffold data; the selection surface is SKILL.md §3's matrix + patterns-evaluation §2. [evidence: finding 7]
- Assuming `.claude/commands` or other mirrors carry the pipeline: the command's DEPTH lives in `.skilled/commands/prompt/assets/*.yaml`, canonical in-repo.

## Dead Ends

- None definitive yet; playbook file-count basis was ambiguous until measured three ways (17 files bare `DEPTH`, 24 `depth-framework`, 25 either token — spec's 25 confirmed).

## Edge Cases

- Ambiguous input: spec.md Files-to-Change "(4 files)" for `.skilled/commands/prompt/` — resolved as `improve.md` + 3 files under `assets/`; recorded literally.
- Contradictory evidence: none this iteration.
- Missing dependencies: `../AI Systems/...` sibling tree not yet read (scheduled iteration 2); public-source verification scheduled iteration 3.
- Partial success: none — all planned reads succeeded.

## Sources Consulted

- specs/sk-prompt/010-sk-prompt-improvements/spec.md:32-112 (problem, scope, REQ-001..011)
- specs/sk-prompt/010-sk-prompt-improvements/scratch/prompt-improver-survey.md:1-34
- .skilled/skills/sk-prompt/SKILL.md:60-292 (routing, pipeline, rules, agent contract)
- .skilled/skills/sk-prompt/ROUTER.md:23-268 (intent model, machine router)
- .skilled/skills/sk-prompt/references/depth-framework.md:16-413
- .skilled/skills/sk-prompt/references/patterns-evaluation.md:20-739 (section map + CLEAR §10-11)
- .skilled/skills/sk-prompt/assets/framework-registry.json:1-56
- .skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md:17-206
- .skilled/agents/prompt-improver.md:24-338
- .skilled/commands/prompt/improve.md:1-89
- grep counts: DEPTH/depth-framework across skill, agent, command, playbook (25/29 playbook files)

## Assessment

- New information ratio: 0.90 (9 of 10 findings fully new; finding 10 partially new — confirms rather than refutes a spec measurement)
- Questions addressed: Q1 (checklist contents — internal-references half), Q5 (caller needs — command/agent surface half), Q2 (registry artifact mis-aimed, partial)
- Questions answered: none in full — each needs the sibling/public-source half before ticking

## Reflection

- What worked: reading ROUTER.md before the references exposed DEPTH's *loading* role (default resource), which the SKILL.md pipeline view alone hides; the caller files then revealed the checkpoint-name coupling.
- What did not work: `grep -rc` per-file output over the whole skill was noisy for the playbook claim; switching to `grep -rl` three ways inside the directory gave the clean 17/24/25 breakdown.
- What I would do differently: none — batch order (router → depth → callers → counts) was efficient.

## Recommended Next Focus

Iteration 2: the AI Systems sibling — `../AI Systems/AI Systems/Prompt Improver/sk-prompt-improver` (deliver-first, `strip_source_prompt()`, `benchmark/router/run_fixtures.sh` 32/32) — plus what its kernel does for checklist/scoring, and the remaining caller-contract detail (per-model profiles, transparency report fields in the command YAML assets).
