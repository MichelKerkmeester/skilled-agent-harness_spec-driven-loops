# Deep Research Strategy — swe2max lineage

Lineage: `swe2max` (cli-devin, swe-2-max) under fan-out session `2026-09-26-030-001-fanout`.
Session: `fanout-swe2max-1790404524761-xsg1vq`. Stop policy: max-iterations (5).

## 1. TOPIC

Compare the pi-skill-orchestrator Pi extension with system-skill-advisor and determine which
orchestrator mechanisms (lazy catalog with scope stub, model-pulled skill_search with bounded
results, profile/group scopes with bounded global fallback, recursive dependency loading,
ranking signals, output bounds, robustness patterns) the advisor should adopt, adapt, or
reject to improve routing precision, prompt cost, and robustness.

## 2. KEY QUESTIONS (remaining)

- [x] RQ1 Catalog cost — tokens per runtime for eager catalog; does the brief replace or add to it; can scope stub + on-demand search apply (Pi first)?
- [x] RQ2 Push versus pull — failure modes of pushed brief vs model-pulled skill_search; the observed `fail_open` / `CLI fallback timed out` data point; would pull change accuracy/latency/failures?
- [x] RQ3 Scope model — advisor counterpart to profiles/groups + bounded global fallback + authorization set; would scope preference raise precision and what breaks?
- [x] RQ4 Dependencies — does the advisor act on depends_on/enhances edges at recommend time; should it return a dependency bundle?
- [x] RQ5 Ranking signals — what the extension ranks on; mapping onto advisor lane gaps.
- [x] RQ6 Output bounds — where the advisor bounds its brief vs the extension's 5-default/8-max + description truncation.
- [x] RQ7 Robustness — conservative catalog removal, atomic writes, disable-model-invocation, version-compat tests: which does the advisor lack?

## 3. NON-GOALS

- No edits to the orchestrator source or the advisor.
- No running advisor tests, validate.sh, generate-context.js, or git writes.
- Token Saver only where it bears on advisor output size / brief format / lazy discovery.

## 4. STOP CONDITIONS

- Hard cap: 5 iterations (stopPolicy=max-iterations). Convergence before that is telemetry only.

## 5. ANSWERED QUESTIONS

All seven answered — see `research.md` §§2–8 for the full answer shape and verdict table.

- RQ1: brief adds to the catalog (append-only surfaces); stub discipline transfers, catalog removal only on system-prompt-owning surfaces. ADAPT stub / ADOPT count line.
- RQ2: push fails typed-and-silent-absence; pull fails silent-non-discovery. ADOPT pull recovery beside push + Pi-call budget enforcement; REJECT pull-replaces-push.
- RQ3: advisor has no per-context scope — only the static denylist and the prompt-policy fire gate. ADAPT soft family prior; ADOPT no-match line; REJECT auth-set transplant.
- RQ4: advisor propagates score over edges but returns no bundle; edge store populated but depends_on sparse (3/15). ADAPT derivation assist + status surfacing; REJECT bundle-in-brief.
- RQ5: orchestrator signals are a subset of the lexical lane except the name-mention guarantee. ADOPT invocation-gated rank-1 pin; REJECT score-table import.
- RQ6: advisor bounds are tighter (80/120, ≤2 labels) but directives sit outside the cap and dedup covers only the static tail. ADOPT pull-surface shape + delivered-byte accounting; ADAPT whole-brief bound + truncate-and-keep.
- RQ7: advisor defends delivery, orchestrator defends writes — mostly property-equivalent. ADOPT disable-model-invocation surfacing (the one real gap); ADAPT Pi deep-import contract guard; REJECT write-path transplants.

## 6. WHAT WORKED

- Mechanism-family ordering: orchestrator core → orchestrator scope/deps → advisor read path → advisor delivery path → verification pass. Each iteration closed one side cleanly.
- SQLite schema + live counts gave cheap CONFIRMED evidence for edge sparsity (depends_on 3/15).
- Reading the caller sites (hook → CLI fallback → subprocess) instead of module docs gave the real failure taxonomy.
- Cross-lineage comparison with completed mimo research.md confirmed the verdict partition independently.

## 7. WHAT FAILED

- Nothing blocking. The one iteration-4 gap (missing `route-exclusions.ts` denylist) was caught and closed in iteration 5's verification pass.

## 8. EXHAUSTED APPROACHES

[None]

## 9. RULED OUT DIRECTIONS

- TUI surface deep-read (ui.ts, autocomplete.ts, shortcuts.ts) — manager-side discovery, not model context (iter 1).
- Full token-saver.ts read — spec bounds it to output-size bearing (iter 2).
- projection.ts / executor-delegation.ts / feedback-calibration.ts deep reads — lane contract sufficient (iter 3).
- Full plugin file + devin/cursor adapters — lifecycle mirrors (iter 4).
- Live advisor_recommend invocation — would write runtime state outside the lineage (iter 5).

## 10. NEXT FOCUS

Complete — synthesis written (`research.md`, `findings-registry.json`, `deep-research-dashboard.md`); terminal synthesis record appended with `stopReason: "maxIterationsReached"`.

## 11. KNOWN CONTEXT

Reading list per phase spec.md:
- Orchestrator: `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/context/pi-skill-orchestrator-main/` — src/*.ts, docs/*.md, tests/*.mjs
- Advisor: `.skilled/skills/system-skill-advisor/` — ARCHITECTURE.md, references/, hooks/, runtime/{handlers,lib}, `.skilled/plugins/system-skill-advisor.js`

## 12. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05 (newInfoRatio)
- Write surface: this lineage directory only
- Citations: file:line on both sides, claims marked confirmed/inferred
