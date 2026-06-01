---
title: "Lane C Skill-Benchmark Operator Guide"
description: "How to run Lane C (skill-benchmark): invocation, the opt-in advisor probe, Mode A pipeline, dimension coverage, verdict bands, and target eligibility for benchmarking whether a skill is well-routed, discoverable, efficient, and useful in practice."
trigger_phrases:
  - "skill-benchmark operator guide"
  - "run Lane C"
  - "start-skill-benchmark-loop"
  - "skill benchmark invocation"
importance_tier: important
contextType: reference
---

# Lane C Skill-Benchmark Operator Guide

Lane C benchmarks whether a *skill* is well-routed, discoverable, efficient, and useful **in practice** — distinct from `sk-doc`/`validate.sh` (doc shape) and manual testing playbooks (described behavior). It emits a ranked, remediable Skill Benchmark Report.

---

## 1. OVERVIEW

Run Lane C with `loop-host.cjs --mode=skill-benchmark` (or `/deep:start-skill-benchmark-loop`). The orchestrator runs the D5 structural hard gate first, then per-scenario contamination-lint → router-replay → score, then writes a dual JSON+Markdown report. Mode A is deterministic and is the CI gate; the D1-inter advisor probe and live trace are opt-in / follow-on.

> **Mode B (live playbook) — BUILT** (packet `122-deep-improvement-skill-benchmark-mode/010-skill-benchmark-live-playbook-mode`). Beyond the synthetic-fixture Mode A above, Lane C can now use a skill's own `manual_testing_playbook` as the corpus and score it in two trace-modes over one parser:
> - `--trace-mode router` (default for `run()` / CI) — deterministic router-replay over the real playbook prompts, scored against the playbook's expected-ref gold (replaces the old empty-gold fixtures).
> - `--trace-mode live` — real `cli-opencode` dispatch; routing/advisor scenarios are run as routing-analysis prompts (the model states its routing as JSON, graded vs gold + observed activation); browser scenarios (MR/CB) route to a `bdg` browser executor; D4 usefulness is an **approximate** skill-on/off ablation. A↔B divergence is reported as a finding.
> - Flags: `--scenarios <ids|critical>`, `--executor`, `--playbook-dir`. Live model via env `SKILL_BENCH_OPENCODE_MODEL` / `SKILL_BENCH_OPENCODE_VARIANT`.
> - **Live model guidance:** `gpt-5.5-fast --variant high` completes (~78s); `xhigh` is too slow and times out. Live is advisory (cost + nondeterminism) — the gated verdict stays driven by router mode + the D5 hard gate. Auto-CREATE generator (`playbook-generator.cjs`) is opt-in + staged.

## 2. INVOCATION

```bash
# Mode A (router-replay, deterministic — the CI gate). Run on a skill that has an
# INTENT_SIGNALS + RESOURCE_MAP smart router in its SKILL.md.
node .opencode/skills/deep-improvement/scripts/shared/loop-host.cjs \
  --mode=skill-benchmark \
  --skill=<skill-id-or-root> \
  --outputs-dir=<path> \
  [--fixtures-dir=<path>] [--trace-mode=router] [--advisor-mode=python]
```

`--advisor-mode=python` enables the **D1-inter** advisor probe — the deterministic in-repo SQLite advisor, scored out-of-band so the answer cannot leak. It is **off by default** (and in CI) to keep the pure-router path fast and dependency-free; enable it to lift a Mode A run from 4-dimension to 5-dimension coverage.

Command surface: `/deep:start-skill-benchmark-loop` (see `commands/deep/start-skill-benchmark-loop.md`).

## 3. WHAT RUNS (MODE A)

1. **D5 connectivity** (static, hard gate) — runs first; dead routed paths, dead intent keys, path escapes, orphan refs, unparseable router. Any P0 caps the verdict to `BLOCKED-BY-STRUCTURE`.
2. **Fixtures** — public/private pairs under `assets/skill-benchmark/fixtures/<skill-id>/` (`<id>.public.json` + `<id>.private.json`).
3. **Per scenario** — contamination-lint the public prompt (a leak is a fixture failure), then router-replay, then join with private gold to score.
4. **Report** — `skill-benchmark-report.json` + `skill-benchmark-report.md` (rendered FROM the JSON, anti-drift).

## 4. DIMENSIONS

| Dim | What | Mode A |
| --- | ---- | ------ |
| D1-intra | in-skill router selects expected intents/resources | scored |
| D2 | unprompted discovery (router-replay recall proxy) | scored |
| D3 | efficiency (over-routing proxy) | scored |
| D5 | structural connectivity | scored (hard gate) |
| D1-inter | advisor selects the right skill | scored when `--advisor-mode=python` (else `unscored-mode-a`) |
| D4 | usefulness via skill-on/off ablation | unscored (needs live mode) |

D1-inter is **built and deterministic** but opt-in (`--advisor-mode=python`). Only D4 and the live in-situ trace (Mode B) remain follow-on — see the 002 implementation playbook. Mode A is honest about its coverage: the aggregate normalizes over the dimensions actually measured.

## 5. VERDICT BANDS

`PASS` ≥80 & no gate · `CONDITIONAL` 50–79 · `FAIL` <50 · `BLOCKED-BY-STRUCTURE` on any D5 P0. (Provisional — calibrate on 2-3 pilots.)

## 6. TARGET ELIGIBILITY

Mode A needs a parseable `INTENT_SIGNALS` + `RESOURCE_MAP` router (e.g. the `cli-*` skills). Skills without that pattern report `router_unparseable` and gate — that is a real signal that the skill is not smart-router-routable, not a harness bug. A skill that routes via a different mechanism is a candidate for live-mode (Mode B) measurement once built.
