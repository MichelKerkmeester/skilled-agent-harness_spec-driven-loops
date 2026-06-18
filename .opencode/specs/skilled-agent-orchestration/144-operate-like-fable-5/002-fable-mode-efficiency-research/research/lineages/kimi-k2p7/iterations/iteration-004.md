# Iteration 004 — Ranked, tiered, deduped surface×delta recommendation map

## Focus

Synthesize iterations 1–3 into a ranked recommendation map. Each item is tagged with tier (A=doctrine, B=mechanism, C=measurement), leverage/blast/cost scores, the best surface from iteration 3, and a dedup note vs round 1. Score = `Leverage*2 - Blast - Cost`.

## Sources

- `[SOURCE: file:iterations/iteration-001.md]`
- `[SOURCE: file:iterations/iteration-002.md]`
- `[SOURCE: file:iterations/iteration-003.md]`

---

## Scoring rubric

| Dimension | 1 | 3 | 5 |
|-----------|---|---|---|
| **Leverage** | Nice-to-have | Materially improves output quality | Changes default behavior across most agent work |
| **Blast** | Self-contained, reversible | Touches 2-3 files or one skill | Touches root contract or many agents/commands |
| **Cost** | One edit + test | Skill/agent/command update + docs | New surface + cross-runtime wiring + validation |

---

## Ranked recommendation table

| Rank | ID | Delta | Surface | Tier | Leverage | Blast | Cost | Score | Dedup vs round 1 |
|------|----|-------|---------|------|----------|-------|------|-------|------------------|
| 1 | B1 | Ride `UserPromptSubmit` hook with compact fable-5 governor brief | `system-skill-advisor` hook brief | B | 5 | 1 | 2 | **7** | net-new |
| 2 | B2 | Add mutation-check ritual after GREEN | `sk-code/SKILL.md` | B | 5 | 1 | 2 | **7** | net-new |
| 3 | B6 | Turn rotting lists into self-auditing tests | `system-spec-kit` validation scripts + conventions | B | 4 | 1 | 2 | **6** | net-new |
| 4 | B8 | Embed `governor-block.md` in CLAUDE.md for Opus runtimes | Public `CLAUDE.md` (or model-specific mirror) | B | 4 | 1 | 2 | **6** | net-new |
| 5 | C1 | Port `leak_test.py` as `/doctor fable-leak` | `.opencode/commands/doctor/` | C | 4 | 1 | 2 | **6** | net-new |
| 6 | A1 | Add fable-5 one-line model + self-check before sending as constitutional rule | `system-spec-kit/constitutional/` | A | 3 | 1 | 1 | **4** | net-new |
| 7 | B9 | Add `// DECISION:` marker + reject-wrong-framings to prompt craft | `sk-prompt/SKILL.md` + prompt assets | B | 3 | 1 | 1 | **4** | net-new |
| 8 | B3 | Add verification ladder to test policy | `sk-code/SKILL.md` + test conventions | B | 4 | 2 | 3 | **3** | net-new |
| 9 | A2 | Add Fable lexicon reference | `sk-prompt/SKILL.md` or `system-spec-kit/constitutional/` | A | 3 | 1 | 2 | **3** | net-new |
| 10 | B7 | Add reuse maps + single-event blast-radius lists to packet conventions | `system-spec-kit` templates + `resource-map.md` | B | 3 | 2 | 2 | **2** | net-new |
| 11 | B4 | Add adversarial review fleet with claim/verdict/evidence schema | `deep-review` skill + `review` agent | B | 4 | 3 | 3 | **2** | net-new |
| 12 | B10 | Add multi-agent orchestration house rules (typed output, two-stage review) | `orchestrate` agent + `deep-loop-workflows` | B | 4 | 3 | 3 | **2** | net-new |
| 13 | C2 | Add execution-mechanics benchmark (tool actions/prose block, result-first rate) | `deep-loop-workflows` / `deep:model-benchmark` | C | 3 | 1 | 3 | **2** | net-new |
| 14 | B5 | Add scar-tissue curation + cold-successor handoff protocol | `system-spec-kit` handover template + conventions | B | 3 | 2 | 3 | **1** | net-new |

---

## Tier summaries

### Tier A — Doctrine text (lowest blast, changes how the model frames work)

- **A1: Fable-5 one-line model + self-check before sending** — A new constitutional rule distilling "Reason about the problem and the person, never about yourself" plus the five-item self-check. Reads reliably wherever the skill-advisor hook is active; costs one rule file.
- **A2: Fable lexicon reference** — A reference doc or folded lexicon section standardizing `pin`, `verify`, `trap`, `drift`, `deliberately`, `load-bearing`, `seam`, `byte-identical`, `fixpoint`, `would misdirect`, `scar tissue`, `flat wrong`. Low blast; mostly hygiene.

### Tier B — Mechanisms (change process or prompt behavior)

- **B1: Ride `UserPromptSubmit` hook with compact fable-5 governor brief** — The highest-leverage, lowest-blast mechanism. The hook already fires prompt-time across Claude/Codex/OpenCode and fails open. Inject a brief version of the recursion-control + output-shape rules when the prompt matches high-effort code/research tasks. No file outside `system-skill-advisor` needs to change.
- **B2: Mutation-check ritual after GREEN** — Add the fifth step to `sk-code/SKILL.md` Phase 3 and any test-policy doc: after GREEN, deliberately break the code, confirm the test fails, restore. Self-contained to sk-code.
- **B3: Verification ladder** — Add the five-layer ladder (unit → in-memory → on-server → live → headless) to `sk-code/SKILL.md`, with a note that "in-memory-green is not production-green." Touches test conventions.
- **B4: Adversarial review fleet with claim/verdict/evidence schema** — Upgrade `deep-review` skill and `review` agent to require a `claim / verdict / evidence (file:line + verbatim quote)` triple. Higher blast because it changes review output format.
- **B5: Scar-tissue curation + cold-successor handoff protocol** — Extend `system-spec-kit` handover template with a "Traps already hit" section and a cold-reader checklist. Medium cost because it changes how every packet closes out.
- **B6: Rotted-list → self-auditing test** — Add a convention to `system-spec-kit`: when a list will rot, replace it with a table-walking test or grep-driven assertion. Low blast; high leverage because it prevents doc drift.
- **B7: Reuse maps + single-event blast-radius lists** — Extend `resource-map.md` or add a `reuse-map.md` template; add a "Blast radius on X" checklist convention for trigger events like dependency upgrades. Medium cost.
- **B8: Embed `governor-block.md` in CLAUDE.md for Opus runtimes** — Paste the 8-rule Opus governor block into the Public `CLAUDE.md` (or a model-specific mirror) so Opus-backed sessions get it by default. Low blast; model-specific.
- **B9: `// DECISION:` marker + reject-wrong-framings** — Add to `sk-prompt/SKILL.md` and prompt assets: commit open choices with a one-line marker; reframe false dichotomies instead of answering them. Low blast.
- **B10: Multi-agent orchestration house rules** — Add typed output schema (`DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED`) and two-stage review (spec-compliance then quality) to `orchestrate.md` and `deep-loop-workflows` prompts. Higher blast but high leverage for fleet work.

### Tier C — Measurement (makes efficiency observable)

- **C1: Port `leak_test.py` as `/doctor fable-leak`** — A command that scans transcripts (OpenCode/Claude/Codex logs where available) and reports median words/msg, tool:text ratio, unsolicited-caveat %, and self-opener % against a Fable target. Low blast; enables data-driven iteration.
- **C2: Execution-mechanics benchmark** — A `deep:model-benchmark` or `/doctor` surface measuring tool actions per prose block and result-first opener rate. Complements C1.

---

## Dedup confirmation vs round 1

None of the 14 recommendations re-ship round 1's delivered set:

| Round 1 shipped | Not re-recommended here |
|-----------------|-------------------------|
| Operating Discipline subsection in AGENTS.md/CLAUDE.md | Not duplicated; cross-referenced only. |
| `regression-baseline-and-delta.md` | Not duplicated. |
| `finding-is-a-hypothesis.md` | Not duplicated. |
| `main-branch-direct-push.md` 5th bullet | Not duplicated. |
| `sk-code/SKILL.md` baseline line | Not duplicated. |

All recommendations are net-new mechanisms, rituals, doctrine, or measurements from the round-2 sources.

---

## Dead Ends / Ruled Out

- **Direct AGENTS.md expansion for Tier A** — ruled out because Public AGENTS.md is at 446 lines and the ~500-line budget is a hard constraint. Tier A items go to constitutional rules instead.
- **Barter AGENTS.md** — excluded from recommendations until the owner resolves the read-only-git vs `main-branch-direct-push.md` contradiction.
- **Model-specific governor for non-Opus models** — the `governor-block.md` is Opus-targeted; other models may need separate governors, but that is out of scope for this round.

---

## Assessment

- **Status:** complete
- **newInfoRatio:** 0.45
- **Novelty justification:** This iteration is synthesizing, not discovering new sources. The map itself is new, but most of the underlying findings were produced in iterations 1–3. The value added is ranking, tiering, surface mapping, and dedup confirmation.
- **Focus track:** synthesis
- **Key questions touched:** Q3 (answered), Q5 (partial: top risks identified; full risk table in iteration 5).
