---
title: "Implementation Summary"
description: "Doctor routes in _routes.yaml now become advisor bridges. A setup or health prompt surfaces a runnable /doctor:x line, a passing skill stays first and no pinned routing prompt moved."
trigger_phrases:
  - "doctor command routing implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/035-doctor-command-routing"
    last_updated_at: "2026-10-15T18:06:35Z"
    last_updated_by: "generate-context"
    recent_action: "Built T003 to T034 and ran gates G0 to G11, all passing"
    next_safe_action: "Review the diff, regenerate the trigger index, then commit"
    blockers: []
    key_files:
      - "specs/system-skill-advisor/035-doctor-command-routing/implementation-summary.md"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/render.ts"
      - ".skilled/commands/doctor/setup.md"
    session_dedup:
      fingerprint: "sha256:77d67a4b9fc6baeb76ee86ed64743621b8640af3018f1cbd1bf4d46708ca899b"
      session_id: "plan-035-2026-10-15"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1"
      - "Q2"
      - "Q3"
      - "Q4"
      - "Q5"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 035-doctor-command-routing |
| **Status** | Complete, not committed |
| **Completed** | 2026-10-15, working tree on `main` at HEAD `828cb749da` plus uncommitted changes |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The skill advisor now knows the doctor commands. Every route in `.skilled/commands/doctor/_routes.yaml` becomes a command bridge, and 15 of them are active in both scorers. A prompt such as "Help me set up skilled" now returns `/doctor:setup`, which returned nothing before. When a skill also passes, the skill stays first and the brief adds `Also: /doctor:<command> <target>` as a second line. A new `/doctor:setup` command lists every doctor target and runs five read-only checks.

### The /doctor:setup command

`.skilled/commands/doctor/setup.md` routes to `assets/doctor-setup.yaml` and `assets/doctor-setup-presentation.txt`. The workflow prints a 17-row target list, runs the sk-code setup check, the sk-git setup check, the trigger index check, the runtime mirror check and the advisor status probe, and names one repair command per failing check. Mirrors were generated for Claude, Cursor, Codex, Pi and Hermes.

### Bridge generation and ranking

`derive-command-bridges.cjs` reads `_routes.yaml` as a third source and writes the TypeScript keywords from the manifest phrases, the Python slash marker from the runnable string, and a lookup block in `render.ts`. `fusion.ts` gained two doctor-only rules. `requireDoctorPhraseAnchor` keeps a doctor bridge from passing on loose lexical overlap. `keepPassingSkillsAboveDoctorBridges` keeps a passing skill above any doctor bridge unless the prompt types `/doctor:`. The Python native wrapper sorts the same way.

### Brief text

`render.ts` shows a doctor bridge as its runnable string, never as its raw id. The Claude hook sets a setup-wording flag, and a no-match brief for a setup, install, check or configure prompt adds `For setup or health checks, run /doctor:setup.` (47 bytes).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/setup.md`, `assets/doctor-setup.yaml`, `assets/doctor-setup-presentation.txt` | Created | The `/doctor:setup` command |
| `.claude/commands/doctor/setup.md`, `.cursor/commands/doctor-setup.md`, `.codex/prompts/doctor-setup.md`, `.pi/prompts/doctor-setup.md`, `.hermes/prompts/doctor-setup.md` | Generated | Runtime mirrors |
| `.skilled/commands/doctor/_routes.yaml` | Modified | `/doctor:setup` route, `/doctor:env` entry, `/doctor:update` phrases, header, reach probe invocation |
| `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs`, `assets/doctor-router-reach.yaml` | Created, modified | Doctor reach probe and its wiring |
| `.skilled/commands/README.txt` | Modified | Ten doctor commands and the Setup row |
| `runtime/scripts/command-bridges/derive-command-bridges.cjs`, `scoring-compatibility.json`, `command-bridges.generated.json`, `README.md` | Modified | Third source, activation, generated output, documentation |
| `runtime/lib/scorer/projection.ts`, `runtime/scripts/skill_advisor.py`, `runtime/lib/render.ts` | Modified | Generated blocks, Python sort key, doctor rendering and the hint |
| `runtime/lib/scorer/fusion.ts`, `hooks/claude/user-prompt-submit.ts` | Modified | Doctor ordering rules and the setup-wording flag |
| `runtime/scripts/routing-accuracy/doctor-prompts.jsonl` | Created | 40-row doctor slice |
| `runtime/tests/doctor-routing-slice.vitest.ts`, `doctor-command-bridges.vitest.ts`, `scorer/doctor-ordering.vitest.ts`, `doctor-brief-render.vitest.ts`, `hooks/doctor-setup-hint.vitest.ts` | Created | New proofs |
| `runtime/tests/command-bridges-drift-guard.vitest.ts`, `command-bridge-resolution-guard.vitest.ts`, `manual-testing-playbook.vitest.ts`, `python/test_skill_advisor.py` | Modified | Tests updated for the doctor source, plus one Python ordering test |
| `manual-testing-playbook/doctor-commands/` (7 files, DOC-385 to DOC-391), `manual-testing-playbook.md` | Created, modified | Agent-runnable scenarios and their index |
| `feature-catalog/scorer-fusion/doctor-command-routing.md`, `feature-catalog.md`, `leaf-manifest.json`, `leaf-aliases.json` | Created, modified | Catalog entry and regenerated leaf metadata |
| `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md`, `README.md` | Modified | `/doctor:setup` in the spec-kit doctor catalog and the root command list |

Paths starting with `runtime/`, `hooks/`, `manual-testing-playbook/` or `feature-catalog/` are under `.skilled/skills/system-skill-advisor/`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash on cli-pi (`llmgateway/deepseek-v4.1-flash`, thinking max) made every edit outside this folder, one short brief at a time. The orchestrator backed up each target, diffed the result against the brief, ran the tests and ran a mutation check for each proof. No DeepSeek edit needed a self-edit by the orchestrator. The orchestrator ran the generators, the mirror sync scripts and `ci-skill-root-metadata.cjs --fix` itself, and wrote the docs in this folder.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A passing skill keeps first place and the doctor line comes second | The operator decided it, and the Python scorer already orders skills above commands |
| The doctor slice gets its own file and gate | The three existing corpora are hash-pinned by the baseline and by CI |
| Python carries slash markers only | A Python marker found in a prompt counts as explicit command intent, which would rank the command first |
| The no-match hint shows only on setup, install, check or configure wording | The operator decided it on 2026-10-15, so unrelated prompts carry no extra text |
| `/doctor:deep-loop` and the `/doctor:mcp` sub-actions wait for a later wave | The operator decided it on 2026-10-15, and the research never measured them |
| Level 2, one packet | `recommend-level.sh` scored 58, and the phase score of 10 meets neither phase threshold |

### Deviations from the plan

1. **A second ordering rule.** The plan named one rule. Wave A showed `/doctor:env list` passing on "Help me set up skilled" and `/doctor:git hooks` coming second on a worktree prompt, both from loose lexical overlap. `requireDoctorPhraseAnchor` makes a doctor bridge pass only on an explicit-author match. It touches doctor ids only and changes no weight, threshold or confidence constant.
2. **Two slice rows changed.** "skill budget audit" and "router reach check" now expect `sk-code` first and the doctor bridge second. The doctor phrase anchor lifts low-information abstention, so `sk-code` passes, and the operator rule keeps a passing skill first.
3. **One `/doctor:env` phrase renamed.** "list skilled environment switches" hit the read-only explainer floor on "list", so the reach probe failed it. It became "skilled environment switch values".
4. **The Python native wrapper needed a sort key.** It re-sorted results by score and put doctor bridges above skills. A key now keeps them below unless the prompt types `/doctor:`, with a new Python test.
5. **Two existing tests changed.** The bridge drift guard now projects doctor entries from `_routes.yaml` and counts hand-authored entries over non-doctor ids. The resolution guard takes the first token of a runnable string such as `/doctor:env list`.
6. **No CI workflow edit at T010.** `scratch/ci-yaml-check.md` shows every job that runs the generator already has the `yaml` parser.
7. **Model.** The plan named an opencode-go model. The operator directed `llmgateway/deepseek-v4.1-flash` on cli-pi.
8. **Advisor leg invocation fixed during T028.** The live run showed `advisor_status --format json --warm-only` exiting 64 because `workspaceRoot` is required. The `/doctor:setup` workflow, its route and DOC-391 now pass `--workspace-root "$PWD" --timeout-ms 500`, which exits 0.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| G0 build and typecheck | Both exit 0 |
| G1 bridge drift | Exit 0, `"status": "fresh"`, doctorRoutes 16, generated 43, typescriptActive 20, pythonActive 30 |
| G2 route manifest | Exit 0, `OK: route-validate — 14 routes validated, 2 warnings` (13 at baseline, both warnings are existing `--dry-run` notices) |
| G3 targeted suites | Exit 0, `Test Files 9 passed (9)`, `Tests 66 passed (66)` |
| G4 full advisor suite | Exit 0, `Test Files 143 passed (143)`, `Tests 1084 passed, 6 skipped (1090)`. Baseline 138 files, 1054 passed, 6 skipped |
| G5 Python suite | Exit 0, `Summary: pass=66, fail=0` (65 at baseline plus the new ordering test) |
| G6 routing benchmark | Capture exit 0: labeled 155 of 195, holdout 49 of 66, ambiguity 19 of 24, unknown 13, gold-none false fires 5, all equal to baseline. Corpus gate exit 0, `"overall_pass": true`, correct 113 |
| G7 scorer parity | Exit 0, 2 files, 11 tests passed |
| G8 doctor slice | Exit 0, 2 tests passed |
| G9 reach probe | Exit 0, `STATUS=OK phrases=82 bridges=15` |
| G10 mirrors and catalog | All five checks exit 0. Runtime mirrors 185 in sync, Codex, Pi and Hermes prompts 37 in sync each, `STATUS=OK command-catalog-mirror` |
| G11 per-prompt comparison | Exit 0, lost 0, gained 0, missing 0 against `scratch/baseline-per-prompt.json`. Every row stayed where it was, so no re-capture was needed |
| Playbook validators | Inventory test 1 passed (61 scenarios). `validate-playbook-package.cjs`: `SKIP package=system-skill-advisor ... scenarios=61 ... violations=0 warnings=1`, the warning existing before. Topology validator: SKIP, standalone root |
| Catalog validators | `PACKAGE system-skill-advisor: PASS tier=fail violations=0` and `PACKAGE system-spec-kit: PASS tier=fail violations=0` |
| Leaf metadata | `ci-skill-root-metadata.cjs --skill system-skill-advisor`: `OK`, after `--fix` added 8 leaves |
| Probe prompts (live daemon) | "Help me set up skilled" gives `use /doctor:setup 0.90/0.12 pass`. "check my environment variables" gives `use /doctor:env list 0.90/0.16 pass`. "check my git hooks setup" gives `use sk-git 0.82/0.20 pass` then `Also: /doctor:git setup`. "install the frobnicator widget" gives the hint. The photosynthesis prompt gives `Advisor: no skill matched.` alone |
| T028 `/doctor:setup` run | sk-code exit 0, sk-git exit 0, trigger index exit 1 (stale, repair `/doctor:speckit`), runtime mirrors exit 0, advisor exit 0. A hash of `git diff HEAD --stat` plus the untracked list was identical before and after |

### Mutation checks

Every proof failed under its mutation and passed once restored. Slice wave flipped early: 1 failed. Router without a `skill_agent` tag: deriver exit 1 with a named error. Lookup value changed: 1 of 3 failed. Ordering rule a no-op: 2 of 6 failed. Slash exemption removed: 1 failed. Companion line removed: 2 of 7 failed. Top doctor label removed: 2 of 7 failed. Renderer hint flag removed: 2 of 8 failed. Hook flag forced false: 5 of 8 failed. Phrase-anchor rule a no-op: 1 of 10 failed. Generated keyword removed: 1 of 3 failed. Reach phrase renamed: `STATUS=FAIL` exit 1. Python sort key removed: `pass=65 fail=1`. Playbook row removed: inventory test failed.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Trigger index stale.** The new and edited docs make `generate-trigger-index.mjs --check` report stale documents. Regenerating it is the operator's step, so the `/doctor:setup` trigger-index leg reports FAIL until then.
2. **Existing defects left alone.** The `/doctor:skill-advisor` routes in `_routes.yaml` (lines 90 and 113) and `doctor-skill-advisor-rebuild.yaml` still call `advisor_status` without `--workspace-root`, which exits 64. HVR hard blockers that existed before this packet remain in `.skilled/commands/README.txt` (2), the advisor `manual-testing-playbook.md` (8) and the advisor `feature-catalog.md` (1).
3. **Not committed.** Evidence is pinned to HEAD `828cb749da` plus the working tree, because this packet was built without a commit.
<!-- /ANCHOR:limitations -->

---
