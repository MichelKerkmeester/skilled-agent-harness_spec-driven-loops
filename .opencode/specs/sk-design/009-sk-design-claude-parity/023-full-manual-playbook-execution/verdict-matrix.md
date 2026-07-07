---
title: "Verdict Matrix: Phase 023 - Full Manual Playbook Execution"
description: "3-tier rollup (dispatch, scenario, release-readiness) for the first genuine end-to-end manual execution of sk-design's manual_testing_playbook, 56 real cli-opencode dispatches across 37 scenario IDs."
trigger_phrases:
  - "verdict matrix"
  - "phase 023 release readiness"
  - "sk-design playbook release gate"
importance_tier: "high"
contextType: "general"
---
# Verdict Matrix: Phase 023 - Full Manual Playbook Execution

Aggregated from the 10 child waves' own `dispatch-log.md` files (Tier 1, authoritative). This document is Tier 2 (per-scenario rollup) and Tier 3 (release-readiness gate). All figures cross-checked directly against each wave's dispatch-log.md, not from memory.

---

## Tier 3: Release-Readiness Gate

Computed exactly per `manual_testing_playbook.md` Section 5's rule: **READY** requires zero FAIL features, all 16 critical-path scenarios PASS, 100% coverage, no unresolved blocking triage.

| Gate Check | Result |
|---|---|
| Coverage | 37/37 scenario IDs dispatched (100%) — 56 real `opencode run` calls across 10 waves |
| Scenario-level verdicts | 20 PASS / 8 PARTIAL / 9 FAIL |
| Zero FAIL features? | **No** — 9 scenario-level FAILs |
| All 16 critical-path scenarios PASS? | **No** — 9 PASS / 2 PARTIAL / 5 FAIL (see table below) |
| **RELEASE VERDICT** | **NOT READY** |

### Critical-path scenario detail (16 of 37)

| Scenario | Verdict | Why (if not PASS) |
|---|---|---|
| MR-001 | PASS | |
| MR-002 | PASS | |
| MR-003 | PASS | |
| MR-004 | PARTIAL | Advisor probe top-1 `sk-code` (0.872) over `sk-design` (0.8486); live dispatch itself resolved correctly |
| MR-005 | PASS | |
| MR-007 | **FAIL** | Advisor routes Open Design wiring to `sk-code`, not `sk-design`; live dispatch also used `apply_patch` (mutating) against a global config file |
| AI-001 | **FAIL** | Rolls up 6 probes (P1-P5 PASS); P6 (Open Design) advisor probe routes to `sk-code` top-1, the scenario's own literal FAIL trigger |
| AI-002 | PASS | |
| TV-001 | **FAIL** | Rolls up 4 variants (V2,V4 PASS); V1 escalated into `sk-code` and made a real, self-caught+reverted repo edit; V3 misrouted to `foundations` via a real `design-interface/SKILL.md` routing-prose conflict |
| TV-002 | **FAIL** | Rolls up 4 variants (V1-V3 PASS); V4 made zero skill-tool calls, answered as generic copywriting |
| MG-001 | PASS | |
| MG-004 | **FAIL** | Resolved `foundations` instead of `md-generator`; never loaded `design-md-generator/SKILL.md`; brief values appeared as unlabeled CSS custom properties |
| SR-003 | PASS | |
| PB-001 | PASS | |
| PB-002 | PARTIAL | Advisor probe missed `sk-design` top-1 (infra: native advisor unavailable, local fallback used); resolved a bundled `audit`+`foundations` rather than pure `foundations` |
| PB-003 | PASS | |

---

## Tier 2: Full Scenario Rollup (37 IDs)

Feature-verdict rule (`manual_testing_playbook.md` Section 5): PASS iff every constituent dispatch PASS; PARTIAL iff at least one PARTIAL and none FAIL; FAIL iff any constituent dispatch FAIL.

| Scenario | Constituent dispatches | Verdict | Wave |
|---|---|---|---|
| MR-001 | MR-001 | PASS | 001 |
| MR-002 | MR-002 | PASS | 001 |
| MR-003 | MR-003 | PASS | 001 |
| MR-004 | MR-004 | PARTIAL | 001 |
| MR-005 | MR-005 (S1) | PASS | 010 |
| MR-006 | MR-006 | PASS | 001 |
| MR-007 | MR-007 | **FAIL** | 002 |
| AI-001 | P1,P2,P3,P4,P5,P6 | **FAIL** | 003 + 010(P5) |
| AI-002 | AI-002 | PASS | 002 |
| AI-003 | AI-003 | PASS | 002 |
| AI-004 | AI-004 | PASS | 002 |
| TV-001 | V1,V2,V3,V4 | **FAIL** | 004 |
| TV-002 | V1(004),V2,V3,V4(005) | **FAIL** | 004 + 005 |
| TV-003 | TV-003 | **FAIL** | 005 |
| TV-004 | TV-004 | **FAIL** | 005 |
| TV-005 | TV-005 | PASS | 006 |
| MG-001 | MG-001 (S4) | PASS | 010 |
| MG-002 | MG-002 (S5) | PARTIAL | 010 |
| MG-003 | MG-003 (S6) | PARTIAL | 010 |
| MG-004 | MG-004 (S7) | **FAIL** | 010 |
| SR-001 | SR-001 | **FAIL** | 002 |
| SR-002 | P1,P2,P3 | PASS | 006 |
| SR-003 | SR-003 | PASS | 006 |
| SR-004 | SR-004 | PASS | 007 |
| PB-001 | PB-001 | PASS | 007 |
| PB-002 | PB-002 | PARTIAL | 007 |
| PB-003 | PB-003 (S3) | PASS | 010 |
| PB-004 | PB-004 | PASS | 007 |
| PB-005 | primary + negative control | PASS | 007 |
| PB-006 | PB-006 | PARTIAL | 008 |
| PB-007 | PB-007 | PARTIAL | 008 |
| FR-001 | foundations,interface,motion(008),audit(009),md-generator(S8,010) | PARTIAL | 008 + 009 + 010 |
| FR-002 | motion(009),md-generator(S9,010) | PASS | 009 + 010 |
| HM-001 | HM-001 | **FAIL** | 009 |
| HM-002 | HM-002 | PASS | 009 |
| HM-003 | HM-003 | PASS | 009 |
| HM-004 | HM-004 | PARTIAL | 009 |

**Totals: 20 PASS / 8 PARTIAL / 9 FAIL / 37 scenarios.**

---

## Real bugs found — REMEDIATED in phase 024 (see `../024-manual-playbook-bug-remediation/`)

All 8 bugs below were fixed and re-verified via live re-dispatch of their constituent scenarios; final state is 12/12 confirmed PASS. Fix-round and final verdict noted per item; full evidence and file-level diffs are in phase 024's `implementation-summary.md`.

1. **Open Design wiring misroutes at the advisor tier** (`MR-007`, `AI-001`-P6): both the standalone probe and, for `MR-007`, the live dispatch's own internal advisor call rank `sk-code` above `sk-design` for "wire Open Design" prompts. — **Fixed Round 1** (`skill_advisor.py` `PHRASE_INTENT_BOOSTERS` + `graph-metadata.json`/`description.json` sync). **Final verdict: PASS** (both dispatches).
2. **`design-interface/SKILL.md`'s own routing prose conflicts with the registry's `commandProjectionParity`** (`TV-001`-V3, `TV-003`): "hierarchy"/"clarify" vocabulary pulls requests to `foundations` even when the registry maps the same verb to `interface`. — **Fixed Round 1** (mirrored transform-verb-precedence exception in both `sk-design/SKILL.md` and `design-interface/SKILL.md`). **Final verdict: PASS** (both dispatches).
3. **`interface` mode skips its own ALWAYS-marked shared resources** (`SR-001`): `context_loading_contract.md` never loaded despite being marked non-optional in `design-interface/SKILL.md`'s own Resource Loading Levels table. — **Fixed Round 2** (citation-required clause; Round 1's prose-only rule was insufficient to compel a separate tool call). **Final verdict: PASS on the scenario's literal criteria** (genuine tool-call load confirmed via raw JSONL grep); the specific citation-phrasing mechanism still doesn't reliably fire in the visible response text — accepted as a known, non-blocking imperfection.
4. **`typeset`/`colorize` excluded-alias rule is not enforced** (`TV-004`): `foundations` loads alongside `interface` specifically because of these two excluded terms, the scenario's own literal FAIL trigger. — **Fixed Round 1** (mode-vocabulary-guardrail exception in `sk-design/SKILL.md`). **Final verdict: PASS**.
5. **`md-generator`'s router precedence loses to `foundations` on a brief-only, no-URL request** (`MG-004`): the anti-hallucination authoring-boundary docs (`references/authoring_boundary.md`, `assets/source_of_truth_router_card.md`) are never reached because the mode never resolves. — **Fixed Round 3** (Round 1 fixed router precedence so the mode now resolves; Round 2's label-based fix targeted the wrong invariant and regressed on table coverage; Round 3 rewrote `design-md-generator/SKILL.md` ALWAYS #10/NEVER #6 and `authoring_boundary.md` Section 5 to forbid ANY Tokens-table output on a brief-only request and require both boundary docs cited by path). **Final verdict: PASS** — zero Tokens-table content, both docs cited by path, explicit out-of-scope statement + URL-ask.
6. **Hub manager violates "intake before routing"** (`HM-001`): declares a full mode bundle before asking for the screenshots/deck it needs. — **Fixed Round 2** ("No hedge-everything bundling" rule; Round 1's general ordering rule wasn't specific enough against a prompt naming multiple candidate modes). **Final verdict: PASS** (genuine 5-field intake, one focused narrowing question, no bundle declared).
7. **Weak-signal transform-verb prompts can produce zero skill routing at all** (`TV-002`-V4): "delight ... gratuitous" produced a fully generic copywriting answer with no `skill` tool call. — **Fixed Round 2** (additional `PHRASE_INTENT_BOOSTERS` entries targeting the exact weak-signal phrasing; prose-only fixes don't touch the advisor's raw keyword-scoring weights). **Final verdict: PASS** (advisor confidence 0.68 -> 0.95, clean route to `sk-design` -> `design-audit`).
8. **`MG-002`/`MG-003` advisor-tier consistently loses to `sk-doc`** on DESIGN.md-validation-shaped prompts — same pattern both times, worth checking if it's a systematic vocabulary gap rather than two independent misses. — **Fixed Round 1** (same `design-md-generator/SKILL.md` + graph-metadata sync as bug 5). **Final verdict: PASS** (both dispatches, no further work needed).

## PB-002 — fixed in phase 025 (see `../025-pb002-advisor-and-audit-bundle-fix/`)

A fresh audit (see below) confirmed `PB-002`'s two original defects — advisor probe missing `sk-design` top-1, and the live dispatch bundling `audit`+`foundations` instead of resolving pure `foundations` — were both still live. **Fixed**: (1) `sk-design/SKILL.md`'s Mode Vocabulary Guardrails `audit` bullet got a new "single-axis static review" exception so a review scoped to one `foundations`-owned axis with its own procedure card stays pure `foundations`; (2) `sk-design/graph-metadata.json`'s `intent_signals`/`derived.trigger_phrases` got design-scoped review/proof-gate phrases, picked up live by the skill-advisor daemon's file watcher (no restart needed) — confirmed via the live daemon path, `sk-design` moved from #2 (0.82, losing to `sk-code` 0.8247) to top-1 at confidence 0.9095. **Final verdict: PASS** — both halves independently re-verified; zero regression on `AI-002` (still `sk-code` top-1, 0.913) or `AI-004` (still `sk-code` top-1, 0.8993, unchanged).

## Fresh audit (post-024) — new findings, not yet all resolved

A fresh, independent Opus-max audit of the whole sk-design family (parent hub + 6 subskills), cross-referenced against the remaining never-fixed items (`MR-004`, `PB-002`, `PB-006`, `PB-007`, `FR-001`, `HM-004`), surfaced:

- **`MR-004` and `HM-004`'s originally-claimed root causes were REFUTED** by adversarial re-verification — the underlying facts cited were accurate, but neither claim's causal mechanism reproduced against the actual dispatch evidence. See the audit's full reasoning; both remain formally open/PARTIAL but not attributable to the mechanisms first proposed.
- **New, still-open logic-sync conflict on `MR-004`**: phase 025's regression sweep found `MR-004`'s live-daemon path currently returns `sk-code` top-1 (0.8719) over `sk-design` (0.8507, #2, ambiguous) — reproduced twice in isolated dispatches — directly contradicting the fresh audit's own REFUTED verdict (which tested the same prompt against the local-fallback scorer while the native daemon was unavailable, and got `sk-design` 0.95 > `sk-code` 0.86). **Neither test is wrong; they hit two different scoring backends that disagree.** `MR-004` needs its own investigation against the live daemon path specifically — out of scope for phase 025, not yet started.
- **New pre-existing bug found (not caused by phase 025 or 024)**: `skill_advisor.py`'s standalone CLI fallback scorer has a bare `"design review"` keyword entry that substring-matches even inside a negation clause — `AI-004`'s prompt ("...not a visual or UI design review") wrongly scores `sk-design` top-1 (0.95) via that one script's local fallback path, even though the live daemon path (what real dispatches use) correctly resolves `sk-code` (confirmed via two independent regression checks). Confirmed pre-existing via `git stash` test. Not yet fixed — low priority since the scenario's real grading path is unaffected.
- 4 confirmed, fixed defects independent of any scenario (family-mislabel front-matter on 3 mode packets, a nonexistent-command doc bug in `command-metadata.json`, `FR-001`'s index-vs-feature-file prompt mismatch, and this PB-002 fix) — see phase 025's `implementation-summary.md` for full detail.
- `PB-006`, `PB-007`, `FR-001` remain judged model-execution variance, not file defects (accept-as-is) — no action taken.
- Real Open Design RUN side effect (see below) — operator decided to accept the risk as-is.

## Real side effects from this execution run (operator-visible, not silently absorbed)

- **Self-caught and reverted** (confirmed clean via `git status`): `AI-002`'s edit to `executor-config.ts`+vitest; `TV-001`-V1's edit to `README.md`.
- **`~/.config/opencode/opencode.json`** was mutated by `MR-007`/`AI-001`-P6 (added a native `open-design` MCP entry) — reverted separately this session after confirming `.utcp_config.json`'s Code Mode entry is this repo's actual canonical wiring; the packet's own docs (~11 files) were corrected to stop recommending the native path for this repo.
- **`DESIGN.md` (repo root, untracked) + empty `design-extracts/example-com/`** from `AI-001`-P5 (a timed-out first attempt left the empty dir; the successful retry wrote `DESIGN.md` to repo root instead of a sandbox, since the prompt never specifies an output path) — cleaned up as part of this phase's close-out (see `implementation-summary.md`).
- **A real Open Design project + generation run** were created by `HM-004` (project `linear-grounded-settings-page`, run `b8362f10-b306-4254-83d7-2bfc343183dc`) — left running. A fresh audit (see `../024-manual-playbook-bug-remediation/`'s follow-up findings) confirmed the packet's mutating-verb gates (`design-mcp-open-design/SKILL.md` ALWAYS #4/#5, ESCALATE #3, NEVER #5/#6) are prose-only with no structural interceptor on a live `start_run`. **Operator decision (2026-07-07): accept the live-run risk as-is** — a hard structural stop (plan-echo gate, or an infra-level dry-run/token gate on the `od` CLI) would weaken the live-execution fidelity `HM-004`-shaped scenarios exist to test. Cleanup of a leaked run stays a manual operator action through Open Design itself, never something this skill automates on its own initiative; this is now documented directly in `design-mcp-open-design/SKILL.md`'s ALWAYS #4.
