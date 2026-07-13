---
title: Non-Dev AI-System Authoring Guide
description: Authoring guide for the non-dev AI-system (Lane D) inputs - the packaging config an author fills from the example, the fixture and gold-set choices, the grader-calibration selections, and the operator run setup; and which schema, templates, and contracts stay code-owned in deep-improvement and are only cross-linked, never relocated here.
trigger_phrases:
  - "non-dev ai system authoring guide"
  - "lane d authoring guide"
  - "how to author a packaging config"
  - "ai-system packaging refine inputs"
  - "guarded refine authoring"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Non-Dev AI-System Authoring Guide

Authoring depth for the non-dev AI-system (Lane D) inputs. Lane D is run by
`/deep:ai-system-improvement` in `system-deep-loop/deep-improvement`; it benchmarks a
non-dev AI-system *packaging* against an independent grader and auto-refines the
packaging's technique docs behind hard guardrails. This guide covers what an author
WRITES to onboard a packaging: the config, the fixture and gold-set choices, the
grader selections, and the operator run setup. It does NOT restate the loop contract,
the scoring surface, the grader rubric, or the guardrail teachings — those are
code-coupled or lane-local in deep-improvement and are cross-linked, never copied.
Where this guide and a lane contract diverge, the contract prevails.

---

## 1. OVERVIEW: WHAT LANE D AUTHORING COVERS

A Lane D packaging ships one prompt system across runtimes (a CLI runtime, a claude.ai
Project, and a native skill). To make it refine-able, the packaging implements a
guarded loop host — `<packaging-root>/benchmark/_loop/loop.py` plus its frozen gates
and grader — that benchmarks the system with N-sample averaged outputs, re-grades them
with an independent different-family grader, proposes bounded technique-doc edits, and
promotes into an isolated git worktree only when held-out grades do not regress.

You do **not** hand-write that loop host. You author a small set of **doc-only inputs**
and then the scaffolder (`init_packaging.py`) renders the runtime from templates. This
guide is about those authoring inputs; running, scoring, promoting, and the guardrail
theory are the lane's job (sections 4 and 8).

### Lane boundary — what stays lane-local or code-owned

| This guide covers (authoring inputs) | Stays in deep-improvement (cross-link, never relocate) |
| --- | --- |
| The packaging config you fill from the example | `packaging_config.schema.json` (read by the scaffolder) |
| Fixture choices: visible / held-out / gold sets | The 9 `templates/*.template` runtime scaffolds |
| Grader model + gold-set calibration selections | `loop_contract.md` (the loop-host contract) |
| The operator run setup (env, flags, self-target profile) | `guardrails_teachings.md` and the grader rubric |

Author *to* those contracts; do not re-document them here. This guide names them only
as wayfinding so an author knows which input feeds which runtime seam.

---

## 2. WHERE THESE LIVE

All Lane D data and contracts sit under the `deep-improvement` mode-packet. Directory
names use underscores.

| Artifact | Location | Role |
| --- | --- | --- |
| Config example (copy this) | [`assets/non_dev_ai_system/packaging_config.example.json`](../../../../system-deep-loop/deep-improvement/assets/non_dev_ai_system/packaging_config.example.json) | The Barter Copywriter pilot config an author copies and rewrites |
| Config schema (code-owned) | [`assets/non_dev_ai_system/packaging_config.schema.json`](../../../../system-deep-loop/deep-improvement/assets/non_dev_ai_system/packaging_config.schema.json) | The validation contract the scaffolder reads |
| Runtime templates (code-owned) | [`assets/non_dev_ai_system/templates/`](../../../../system-deep-loop/deep-improvement/assets/non_dev_ai_system/templates) | The 9 `*.template` scaffolds rendered by exact filename |
| Self-target profile | [`assets/non_dev_ai_system/profiles/deep_loop_runtime.json`](../../../../system-deep-loop/deep-improvement/assets/non_dev_ai_system/profiles/deep_loop_runtime.json) | The `frozenSurfaces` / `editableTechDocs` / allow-list profile for self-target runs |
| Scaffolder | [`scripts/non-dev-ai-system/init_packaging.py`](../../../../system-deep-loop/deep-improvement/scripts/non-dev-ai-system/init_packaging.py) | Renders the runtime into the packaging root from the config |
| Lane-D references | [`references/non_dev_ai_system/`](../../../../system-deep-loop/deep-improvement/references/non_dev_ai_system/operator_guide.md) | Loop contract, fixtures, grader calibration, guardrail teachings, operator guide |

The packaging's rendered runtime (`benchmark/_loop/`, `benchmark/_gates/`,
`benchmark/grader/`) lands in the packaging root, never back in deep-improvement. Loop
state (`benchmark/_loop/state/`) is gitignored and hand-authored inputs stay outside it.

---

## 3. AUTHORABLE DOCS (DOC-ONLY)

These are the inputs an author fills or edits. Everything else is generated or
lane-local.

### 3.1 The packaging config

Copy [`packaging_config.example.json`](../../../../system-deep-loop/deep-improvement/assets/non_dev_ai_system/packaging_config.example.json)
and rewrite every field for the new system, validating against
[`packaging_config.schema.json`](../../../../system-deep-loop/deep-improvement/assets/non_dev_ai_system/packaging_config.schema.json).
The schema's required keys are the author's checklist:

| Field | What you author |
| --- | --- |
| `packaging_root` / `system_name` | Absolute path to the packaging and its human-readable name |
| `dimensions` | Ordered single-letter dimension keys, each with a `floor` and `max` |
| `score_total` / `ship_threshold` | Max score (e.g. 25) and the auto-ship threshold |
| `self_score_regex` | Regex that captures the system's self-reported score as group 1 |
| `frozen_surface` | The scoring docs to content-hash, each with `frozen_name`, `live_relpath`, `section_anchor`, `in_rubric` |
| `anchors` | Literal strings that must survive in the live scoring docs (erosion tripwire) |
| `technique_doc_map` | Dimension key -> the ONLY editable technique-doc relpath the proposer may edit |
| `derived_copies` / `synthesized_surfaces` | Source-to-copy derivations and docs needing human re-derivation |
| `fixtures` | `visible`, `held_out`, and `variants` id lists (section 3.3) |
| `models` | `proposer`, `grader`, and the `proposer_family` substring the grader must NOT contain |
| `harness` | Per-variant `benchmark_mode_instructions` system prompts (`{{CW}}` is the only token) |
| `lexicon` | `hard_blocker_words` and `hard_blocker_patterns` the deterministic linter enforces |

Self-target runs add `frozenSurfaces`, `editableTechDocs`, `allowedDiffRelpaths`, and
`excludedSessionPrefixes`; see the self-target profile above for a filled example.

### 3.2 Grader-calibration selections

Pick a `grader` model in a **different family** from the `proposer` (the loop raises a
kill-switch on a family match), and author a version-locked gold set of human-anchored
target scores that anchors the grader. The gold outputs and target scores must live
outside any tree the loop can write. The calibration protocol itself — the `calibrate.py`
two-grader agreement flow, the `<= 2 / 25` disagreement threshold, phantom-gap tracking,
and the strict-JSON grader reply shape — is lane-local in
[`grader_calibration.md`](../../../../system-deep-loop/deep-improvement/references/non_dev_ai_system/grader_calibration.md).
Follow it; do not restate it here.

### 3.3 Fixture-authoring choices

Author three fixture tiers and record their ids in `fixtures`:

- **`visible`** — proposer + grader see them; drive gap analysis and iteration targeting.
- **`held_out`** — grader only; drive the promotion gate. The proposer never sees ids,
  prompts, or seeds, so held-out seeds live outside any tree the proposer can read.
- **gold (optional)** — human-anchored calibration anchors, never optimized against.

Every fixture must produce a delimited `<DELIVERABLE>` output and held-out fixtures must
be sensitive to the dimensions being optimized. The full authoring rules — deliverable
contract, unpublished adversarial seeds, fixture-lint gating, `N >= 3` sampling — are
lane-local in
[`fixture_authoring.md`](../../../../system-deep-loop/deep-improvement/references/non_dev_ai_system/fixture_authoring.md).

### 3.4 Operator run setup

The run is configured with flags and env knobs, not code. Dry-run is the safe default;
`--live` is the guarded loop. The knobs (`LOOP_FIXTURES`, `LOOP_VARIANTS`,
`LOOP_HELD_OUT`, `LOOP_SAMPLES`, `PROPOSER_MODEL`, `GRADER_MODEL`, `LOOP_ACCEPT_MARGIN`,
`LOOP_POLISH`, `LOOP_LOCK_TTL`, `LOOP_SKIP_PROBE`), the invocation shape, and the
conformance checklist are documented in
[`operator_guide.md`](../../../../system-deep-loop/deep-improvement/references/non_dev_ai_system/operator_guide.md).

---

## 4. WHAT STAYS LANE-LOCAL / CODE-OWNED

These are cross-linked, never moved to create-benchmark and never restated here. They
are read or enforced by runtime code, so a copy would silently drift from the truth.

| Contract | Why it is code-owned | Authority |
| --- | --- | --- |
| `packaging_config.schema.json` | Read by `init_packaging.py` to validate the config before rendering | [schema](../../../../system-deep-loop/deep-improvement/assets/non_dev_ai_system/packaging_config.schema.json) |
| The 9 `templates/*.template` scaffolds | Rendered by `init_packaging.py` by exact filename into the packaging runtime | [templates/](../../../../system-deep-loop/deep-improvement/assets/non_dev_ai_system/templates) |
| `loop_contract.md` | The formal contract the packaging-owned `loop.py` and `_gates/` implement and enforce | [loop_contract.md](../../../../system-deep-loop/deep-improvement/references/non_dev_ai_system/loop_contract.md) |
| `guardrails_teachings.md` | The twelve pilot teachings (T1-T12) and the guardrail each encodes | [guardrails_teachings.md](../../../../system-deep-loop/deep-improvement/references/non_dev_ai_system/guardrails_teachings.md) |

The 9 rendered scaffolds are `loop.py`, `gauntlet.py`, `gates.py`, `derive.py`,
`run.sh`, `regrade.py`, `grader_prompt.md`, `deterministic_lint.py`, and `calibrate.py`.
An author never hand-writes them and never relocates them into this packet — the
scaffolder owns their filenames and content, and template fixes land in-lane.

---

## 5. AUTHORING WORKFLOW

Complete these in order. The workflow produces inputs and renders the runtime; it never
runs a live benchmark.

1. **Copy the example config.** Start from `packaging_config.example.json`, never by
   copy-editing a sibling packaging (a hand-port once disabled floor enforcement via
   stale dimension keys).
2. **Fill every field.** Set `dimensions`/floors/maxes, `frozen_surface`, `anchors`,
   `technique_doc_map`, `derived_copies`, `harness`, and `lexicon`, then validate the
   config against `packaging_config.schema.json`.
3. **Choose models.** Set a `proposer` and a different-family `grader`; set
   `proposer_family` so the grader-family guard can enforce independence.
4. **Author fixtures.** Declare `visible`, `held_out`, and `variants` per
   [`fixture_authoring.md`](../../../../system-deep-loop/deep-improvement/references/non_dev_ai_system/fixture_authoring.md);
   keep held-out seeds and any gold set outside every loop-writable tree.
5. **Set up calibration.** Version-lock the gold set and follow
   [`grader_calibration.md`](../../../../system-deep-loop/deep-improvement/references/non_dev_ai_system/grader_calibration.md)
   so the grader agrees within `<= 2 / 25` before it is trusted.
6. **Render the runtime.** Run
   `python3 scripts/non-dev-ai-system/init_packaging.py --config <your-config.json> [--check-only]`;
   it writes `benchmark/_loop/`, `benchmark/_gates/`, and `benchmark/grader/` from the 9
   templates. Do not hand-write those files.
7. **Configure the run + conform.** Set the operator env/flags, run the dry-run and the
   dispatch-free gauntlet, and walk the conformance checklist in
   [`operator_guide.md`](../../../../system-deep-loop/deep-improvement/references/non_dev_ai_system/operator_guide.md)
   before any `--live` run.

---

## 6. ALWAYS / NEVER

### ✅ ALWAYS

- Fill a **copy** of `packaging_config.example.json`, validated against the in-lane
  `packaging_config.schema.json`.
- Keep held-out seeds and gold outputs version-locked **outside** any tree the loop can
  write.
- Pick a grader whose family differs from the proposer, and set `proposer_family` so the
  guard can enforce it.
- Render the runtime with `init_packaging.py`; dry-run and pass the gauntlet before
  `--live`.

### ❌ NEVER

- Hand-relocate the code-read `packaging_config.schema.json`, the 9 `*.template`
  scaffolds, or `loop_contract.md` into create-benchmark.
- Hand-write any of the 9 rendered runtime files instead of scaffolding them.
- Restate the guardrail teachings (`guardrails_teachings.md`) or the grader rubric in
  this guide.
- Edit the frozen scoring surface, or copy-edit a sibling packaging to onboard.

---

## 7. SUCCESS CRITERIA

- The config validates against `packaging_config.schema.json` and
  `init_packaging.py --check-only` is clean.
- `python3 benchmark/_loop/loop.py --dry-run` exits 0 (gates + grader-family guard + gap
  analysis).
- The red-team gauntlet passes its dispatch-free battery (9 attacks, 10 checks, all green).
- The grader is a different family from the proposer and agrees with the gold set within
  the calibration threshold.
- Held-out fixtures produce gradeable `<DELIVERABLE>` output and are sensitive to the
  optimized dimensions; the gold set is version-locked outside every loop-writable tree.

---

## 8. RELATED / CROSS-LINKS

### Lane-local authorities (author to these; do not restate)

| File | What it owns |
| --- | --- |
| [`operator_guide.md`](../../../../system-deep-loop/deep-improvement/references/non_dev_ai_system/operator_guide.md) | Invocation, non-negotiable guardrails, onboarding, conformance checklist |
| [`loop_contract.md`](../../../../system-deep-loop/deep-improvement/references/non_dev_ai_system/loop_contract.md) | Required files, argv, env knobs, journal events, kill-switches, lock/resume |
| [`fixture_authoring.md`](../../../../system-deep-loop/deep-improvement/references/non_dev_ai_system/fixture_authoring.md) | Visible / held-out / gold fixtures, deliverable contract, N-sample sampling |
| [`grader_calibration.md`](../../../../system-deep-loop/deep-improvement/references/non_dev_ai_system/grader_calibration.md) | Different-family requirement, two-grader agreement, phantom gap, gold set |
| [`guardrails_teachings.md`](../../../../system-deep-loop/deep-improvement/references/non_dev_ai_system/guardrails_teachings.md) | The twelve pilot teachings and the guardrail each encodes |

### Code-owned assets and scaffolder

| Artifact | Role |
| --- | --- |
| [`packaging_config.schema.json`](../../../../system-deep-loop/deep-improvement/assets/non_dev_ai_system/packaging_config.schema.json) | Config validation contract read by the scaffolder |
| [`packaging_config.example.json`](../../../../system-deep-loop/deep-improvement/assets/non_dev_ai_system/packaging_config.example.json) | The pilot config to copy and rewrite |
| [`templates/`](../../../../system-deep-loop/deep-improvement/assets/non_dev_ai_system/templates) | The 9 runtime scaffolds rendered by exact filename |
| [`profiles/deep_loop_runtime.json`](../../../../system-deep-loop/deep-improvement/assets/non_dev_ai_system/profiles/deep_loop_runtime.json) | Self-target profile (frozen surfaces, editable tech docs, diff allow-list) |
| [`init_packaging.py`](../../../../system-deep-loop/deep-improvement/scripts/non-dev-ai-system/init_packaging.py) | The scaffolder that renders the runtime from the config |

### Owning skill and sibling family

- [`deep-improvement SKILL.md`](../../../../system-deep-loop/deep-improvement/SKILL.md) — the mode that owns and runs Lane D (`/deep:ai-system-improvement`).
- [`model_benchmark_fixture_guide.md`](../model_benchmark/model_benchmark_fixture_guide.md) — the sibling Lane B authoring guide in this packet.
- [`../../SKILL.md`](../../SKILL.md) — the `create-benchmark` packet contract for the benchmark-document families this packet authors.

---

*End of non-dev AI-system authoring guide — the loop contract, scoring surface, grader rubric, and guardrail teachings stay code-owned or lane-local in deep-improvement (sections 4 and 8).*
