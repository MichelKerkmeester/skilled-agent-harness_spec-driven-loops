# Lineage Synthesis — mimo (MiMo v2.6 Pro, cli-pi, reasoningEffort high)

**Session**: `fanout-mimo-1790404524761-xsg1vq` · **Loop**: research · **Stop policy**: max-iterations
· **Iterations**: 10/10 · **Terminal stopReason**: `maxIterationsReached` (convergence reached the
0.05 telemetry threshold at iteration 9-10; per stop policy the loop consolidated rather than
synthesizing early)

**Citation convention**: orchestrator paths are relative to the phase folder
`specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/`
(e.g. `context/pi-skill-orchestrator-main/src/search.ts:27`); advisor paths are relative to the
repository root (e.g. `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:79`). All 34
cited paths and every cited line number were mechanically verified in range; 12 exact-line
citations were opened and matched (iteration-010.md). Every claim is labelled CONFIRMED (read in
code) or INFERRED (with what would confirm it).

---

## 1. Ranked recommendations

| Rank | Verdict | Recommendation | Findings |
|------|---------|----------------|----------|
| 1 | ADOPT | Read `disable-model-invocation` into the projection; demote manual-only skills with a visible reason | F8-3 |
| 2 | ADOPT | Name-mention rank-1 pin, verb/slash-gated | F6-1 |
| 3 | ADOPT | Pull recovery beside push: name the `advisor_recommend` CLI in the fail-open fallback and/or expose a recommend-backed model tool on hook runtimes | F3-1, F9-1 |
| 4 | ADOPT | For any pull result: ≤5 rows default / ≤8 max, descriptions ≤160 chars | F7-1 |
| 5 | ADOPT | Hard deadline race around the in-process Pi advisor call | F9-2 |
| 6 | ADOPT | Delivered-byte accounting for the brief; default-on dedup where supported | F2-1 |
| 7 | ADOPT | Candidate-count line ("N skills indexed") in the brief/stub | F1-2 |
| 8 | ADOPT | Explicit "no in-scope skill matched" line instead of silent absence | F4-3 |
| 9 | ADAPT | Soft scope preference (active hub/mode family), global pool always open | F4-1 |
| 10 | ADAPT | Pull surface backed by the advisor scorer, not substring search | F3-2 |
| 11 | ADAPT | Whole-brief bound: count the constant directive block | F7-2 |
| 12 | ADAPT | Truncate-and-keep ranking-signal metadata instead of drop-to-null | F7-3 |
| 13 | ADAPT | Negation-aware `depends_on` derivation assist in edge maintenance | F5-2 |
| 14 | ADAPT | Graph-health (missing/cycle) on the `advisor_status` trust surface | F5-3 |
| 15 | ADAPT | Static Pi deep-import contract guard for the hook surface | F8-4 |
| 16 | ADAPT | Document the boundary: zero-catalog-data brief invariant; catalog replacement only on system-prompt-owning surfaces (Pi first) | F1-1, F2-2 |

Rejected: brief-replaces-catalog in the advisor (F1-3); importing the extension's cost machinery
(F2-3); pull-replaces-push (F3-3); authorization set + load gate at brief time (F4-2); dependency
bundle in the brief (F5-1); the extension's raw substring ranker (F6-2); importing tie-breaks
(F6-3, already present); warn-not-delete and tmp+rename transplants (F8-1, F8-2).

---

## 2. RQ1 — Catalog cost

**Q**: How many tokens does each runtime spend on an eager skill catalog before the brief arrives;
does the brief replace or add; could the scope stub + on-demand search apply here, Pi first?

**A**: On this Pi setup the eager `<available_skills>` catalog is **≈5.5 KB ≈ 1.3–1.5K tokens**
(measured from on-disk frontmatter + observed block format — CONFIRMED), constant across turns but
paid in the system prompt. The advisor brief is **≈0.5–0.7 KB ≈ 130–180 tokens** (80-token head cap
at `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:79-81`, `:120-127`, plus the
constant `Directives:` + hygiene block at `render.ts:101-107`), paid on the user-message tail of
every delivered turn. The brief **adds to** the catalog — it is an input transform
(`.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:284-285`), while the extension
**replaces** it (`.skilled/skills/...` counterpart `context/pi-skill-orchestrator-main/src/catalog.ts:140-157`)
with a constant five-line stub (`context/pi-skill-orchestrator-main/src/scope.ts:104-118`).

- **F1-1** (ADAPT): stripping belongs to a system-prompt-owning extension with the conservative
  recognizer (`catalog.ts:95-134`, warn-not-delete at `context/pi-skill-orchestrator-main/src/index.ts:309-318`);
  the advisor should adopt the zero-catalog-data discipline as a brief-format invariant. Benefit:
  no double payment. Cost: a render guard. Risk: over-strictness for the recommended label itself —
  allowlisted (`render.ts:415-436`).
- **F1-2** (ADOPT): the stub's count line ("N lazy skill candidates are indexed",
  `scope.ts:108-115`) is constant-size; a "N skills indexed" line in the brief is the cheapest
  transferable unit. Benefit: discovery depth without catalog tokens. Cost: ~15 tokens/turn. Risk:
  stale counts — regenerate per turn as the extension does (`index.ts:298-301`).
- **F2-2** (ADAPT): catalog replacement is feasible only where a system prompt is owned — Pi's
  `before_agent_start` (`index.ts:281-326`); prompt-submit hooks are additive
  (`user-prompt-submit.ts:248-250` shape) [INFERRED for Codex/Cursor/Devin; would confirm from
  their hook contracts]. Pi first, elsewhere stub-discipline only.
- **F2-1** (ADOPT): total per-turn cost = O(catalog) + O(brief); the levers that control recurrence
  exist — Pi same-content dedup (`prompt-advisor.ts:129-152`), prompt-policy skip
  (`.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:60-67`), exact-prompt cache
  (`.skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts:10-13`), plugin transform dedup
  and in-flight coalescing (`.skilled/plugins/system-skill-advisor.js:390-391`, `:982-986`).
  Measure delivered bytes first; make dedup default-on. [The claim that cumulative brief cost can
  rival catalog cost in long sessions is INFERRED — provider price sheet + usage log would
  confirm.]
- **F2-3** (REJECT): adopting the extension's cost machinery adds nothing beyond the O(n) catalog
  term, which is a runtime concern.

## 3. RQ2 — Push versus pull

**Q**: What failure modes does each design have on our code; would a pull surface change routing
accuracy, latency or the observed `fail_open` "CLI fallback timed out"?

**A**: The observed 2026-09-26 line maps verbatim to
`.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:533`
(`'CLI_RETRYABLE_UNAVAILABLE exit 75: CLI fallback timed out'`), under the 2500 ms hook budget
(`.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:106`) and the caller-clamped
CLI fallback budget (`cli-fallback.ts:76`, `:145-158`). Push failure modes: prompt-path latency
budget, timeout → `fail_open` with a well-defined retryable envelope (`cli-fallback.ts:370-407`,
`:113-122`), degraded local-scorer answers honestly rendered `stale` (`cli-fallback.ts:313-321`),
`no_recommendation` distinguished from outage (`cli-fallback.ts:436-445`). Pull failure modes
(extension side): silent non-discovery (the model must think to search — the stub counters this at
`scope.ts:115-116`), 1-2 extra tool round-trips, and a shallow substring ranker
(`context/pi-skill-orchestrator-main/src/search.ts:19-38`) where a miss query finds nothing (bounded
auto-fallback at `index.ts:666-685` papers over it).

- **F3-1** (ADAPT): keep push primary; name the pull recovery — `node
  .skilled/bin/skill-advisor.cjs advisor_recommend …` (contract at
  `.skilled/skills/system-skill-advisor/SKILL.md:297`, `ARCHITECTURE.md:29,101`) — in the
  directives-only fallback (`render.ts:443-448`). Benefit: the observed failure class self-heals.
  Cost: one line. Risk: one wasted tool call on a truly broken daemon.
- **F3-2** (ADAPT): if a pull tool is built, back it with the advisor scorer (same handler and
  thresholds as push, `cli-fallback.ts:323-331`) with the extension's bounded output shape (F7-1).
- **F3-3** (REJECT): pull-replaces-push trades a reported transport failure for silent
  non-discovery; the hybrid keeps both floors.
- **F9-1** (ADOPT): the OpenCode plugin already exposes a model-callable advisor tool
  (`.skilled/plugins/system-skill-advisor.js:1459-1497`) beside its pushed brief
  (`plugin:1457`) — pull-beside-push is the advisor's own existing pattern, generalized.

## 4. RQ3 — Scope model

**Q**: What in the advisor plays the role of profiles/groups/authorization set; would scope
preference raise precision, and what would it break?

**A**: The advisor has no session/task scope [CONFIRMED by absence — scorer lanes consume only
prompt-derived evidence]. Its scoping surfaces are the operator denylist
(`.skilled/skills/system-skill-advisor/runtime/lib/routing/route-exclusions.ts:5-13`, fail-safe
`:72-80`) and soft hub anchoring in the explicit lane
(`.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:93`;
`runtime/lib/scorer/aliases.ts:148`). The extension's model: one active scope (all/profile/group,
`context/pi-skill-orchestrator-main/src/scope.ts:4-7`), profile = union of group members
(`scope.ts:38-45`), empty profile exposes zero candidates (`scope.ts:96-100`,
`tests/scope.test.mjs:57`), bounded global fallback that never changes the scope
(`index.ts:622-648`, `:666-685`), and an authorization set replaced per fallback search and
cleared on scope change (`index.ts:602`, `:617-620`, `:196`, `:207`) guarding the load gate
(`index.ts:724-735`).

- **F4-1** (ADAPT): a soft family-preference term in fusion — the active hub/mode family biases
  candidates while the global pool stays open. Benefit: precision on family-adjacent ties. Cost:
  one weighting term. Risk: stale scope — bounded by the open pool and top-2 ambiguity widening
  (`render.ts:421-433`). [Precision gain is INFERRED — an offline replay with/without a family
  prior would confirm.]
- **F4-2** (REJECT): the authorization set gates loading, and the advisor loads nothing
  (`render.ts:384-441`); only the replace-on-change state hygiene transfers (the Pi hook already
  resets per lifecycle, `prompt-advisor.ts:206-212`).
- **F4-3** (ADOPT): emit an explicit empty-scope/no-match line (extension precedent
  `index.ts:687-696`) instead of the current silent absence (`render.ts:409-412`) — removes the
  did-the-advisor-run misreading at ~one line's cost.

## 5. RQ4 — Dependencies

**Q**: Does the advisor act on `depends_on`/`enhances` at recommendation time; should it return a
dependency bundle?

**A**: It acts on edges only as score propagation — multipliers `enhances` 0.55, `siblings`/
`depends_on` 0.35, `prerequisite_for` 0.30, `conflicts_with` -0.35 with BFS depth 2 / breadth 4
(`.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:83-85`;
`runtime/lib/scorer/lanes/graph-causal.ts:28-30`) over hand-authored edge metadata
(`runtime/lib/cross-skill-edges/metadata-loader.ts:119-135`). No bundle exists anywhere in the
brief or handler [CONFIRMED by absence], and the brief carries at most two labels
(`render.ts:409-433`). The extension loads root + recursive closure in one call
(`context/pi-skill-orchestrator-main/src/dependencies.ts:50-93`, `index.ts:736-746`) with
missing/cycle reporting and negation-aware detection (`dependencies.ts:8-21`).

- **F5-1** (REJECT): a dependency bundle in the brief spends the 80-token budget on what the skill
  body restates; bundle loading is the runtime loading layer's job.
- **F5-2** (ADAPT): borrow the extension's conservative body-scan patterns + negation guard
  (`dependencies.ts:23-38`) into a reviewed `depends_on` derivation assist beside
  `detectInboundEnhances` (`.skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/detect-inbound-enhances.ts:1-4`).
  Benefit: graph-causal weights track reality. [Effect size INFERRED — a corpus run counting
  accepted candidates would confirm.]
- **F5-3** (ADAPT): surface missing/cycle gaps on `advisor_status`
  (`.skilled/skills/system-skill-advisor/ARCHITECTURE.md:29`) — operator visibility, no model
  noise.

## 6. RQ5 — Ranking signals

**Q**: What does the extension rank on; does any signal map onto a lane gap?

**A**: The extension ranks on one weighted-substring table — name equality +200, prefix +80,
substring +60, description substring +35, token bonuses +45/+24/+8/+4
(`context/pi-skill-orchestrator-main/src/search.ts:19-38`) with alphabetical tie-break
(`search.ts:50`). The advisor fuses five calibrated lanes (weights 0.42/0.28/0.13/0.12/0.05,
`.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:8-13`) with synonym
expansion and category hints (`runtime/lib/scorer/lanes/lexical.ts:9-40`), evidence caps and
clamps (`advisor-scorer.md:69`), and deterministic tie-breaks
(`runtime/lib/scorer/fusion.ts:306`, `:749-776`) — a strict superset of the extension's signals.

- **F6-1** (ADOPT): the one gap — name-mention dominance. The extension's +200 makes a literal
  skill name guaranteed top-1; the advisor only raises the explicit lane
  (`runtime/lib/scorer/lanes/explicit.ts:317-321`, weight 0.42) with no rank-1 pin
  (`advisor-scorer.md:109` has only the derived-dominant pin). Pin a named skill to top-1,
  verb/slash-gated (`dependencies.ts:28-34`-style shapes) to avoid prose-mention false pins.
  [The pile-up failure mode is INFERRED — a fusion replay would confirm.]
- **F6-2** (REJECT): importing the raw score table would subtract capability.
- **F6-3** (REJECT as adoption): deterministic tie-breaks already exist; keep as a tuning
  invariant because the Pi dedup cache suppresses only identical brief content
  (`prompt-advisor.ts:140`).

## 7. RQ6 — Output bounds

**Q**: Where does the advisor bound its brief; would the extension's limits change what the model
sees?

**A**: Extension bounds: results clamped 1..8 with default 5 (`search.ts:46`, schema `index.ts:590`),
descriptions flattened/truncated to `catalogDescriptionMax` default 160, clamp 0..240
(`context/pi-skill-orchestrator-main/src/config.ts:45`, `:138-139`; `index.ts:603-609`), ingestion
slice 1024 chars (`catalog.ts:5-13`). Advisor bounds: head capped 80/120/120 tokens
(`render.ts:79-81`), ≤2 labels (`render.ts:409-433`), source refs ≤8
(`.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:250`), transport caps
1 MiB stdout (`cli-fallback.ts:80`), 64 KiB prompt (`user-prompt-submit.ts:107`), 32 KiB raw input
(`prompt-advisor.ts:8`), and metadata values >512 chars dropped to null
(`.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/metadata-sanitizer.ts:11`, `:34`).
The brief's directive block sits outside the token cap (`render.ts:430`, `:438`) — real worst case
is ~138 tokens, not 80.

- **F7-1** (ADOPT): the 5/8 + 160-char shape is the right output shape for the F3-2 pull surface;
  the pushed brief is already smaller and unchanged.
- **F7-2** (ADAPT): make the bound whole-brief — count (never clip) the constant directive.
  Benefit: honest cost accounting for F2-1.
- **F7-3** (ADAPT): truncate-and-keep for ranking signal fields instead of drop-to-null —
  partial signal beats none (the extension keeps prefixes, `catalog.ts:7-13`).
  [Ranking impact INFERRED — a with/without over-length-signal score comparison would confirm.]

## 8. RQ7 — Robustness patterns

**Q**: Which of conservative catalog removal, atomic writes, `disable-model-invocation` respect and
Pi-compat tests does the advisor lack, and which would matter?

**A**: (1) Warn-not-delete on unknown prompt formats (`index.ts:309-318`, `catalog.ts:163-188`)
finds its counterpart in the renderer's fail-closed instruction-label guard
(`render.ts:83-84`, `:129-145`, `:380-383`) — **F8-1 REJECT** (already embodied). (2) Atomic
tmp+rename config writes (`context/pi-skill-orchestrator-main/src/profiles.ts:61-68`) vs the
advisor's append-atomic metrics (`runtime/lib/metrics.ts:303`) and fail-safe delegated lifecycle
store (`hooks/lib/directive-lifecycle-file-store.ts:3-6`) — **F8-2 REJECT** (property-equivalent).
(3) `disable-model-invocation` is honored everywhere by the extension
(`catalog.ts:38`, `index.ts:716-721`, `dependencies.ts:77-82`, `tests/scope.test.mjs:131`) and
nowhere by the advisor [CONFIRMED by absence — no runtime module reads the flag; only the manual
denylist exists] — **F8-3 ADOPT**: read it into the projection
(frontmatter parser at `runtime/lib/skill-graph/doc-frontmatter.ts:89-139`) and demote manual-only
skills with a visible reason; the flag is part of the shared skill contract
(`.skilled/skills/sk-doc/shared/assets/skill-contract.json`) and Pi enforces it at load time
[INFERRED that a brief can recommend a manual-only skill today — a fixture run would confirm].
(4) Contract-guard tests (`context/pi-skill-orchestrator-main/tests/pi-compatibility.test.mjs:16-52`)
vs the advisor's behavioral hook tests (`.skilled/skills/system-skill-advisor/runtime/tests/hooks/`)
— **F8-4 ADAPT**: add the static deep-import ban over `hooks/pi/**`.
Plus **F9-2 ADOPT**: the plugin hard-kills its subprocess at the deadline
(`.skilled/plugins/system-skill-advisor.js:1009-1010`, `:1061-1078`) while the Pi hook awaits
in-process (`prompt-advisor.ts:242-250`) — race the promise against the 2500 ms budget
[INFERRED overshoot risk; one instrumented slow session would confirm].

## 9. Negative knowledge (explicitly not pursued)

1. Live `advisor_recommend` replay for F6-1/F8-3 — would spawn the daemon and write runtime state
   outside this lineage's write surface.
2. Provider cache-pricing arithmetic (F2-1's long-session projection) — no price sheet in the repo.
3. Token Saver internals beyond the lazy-discovery (tool-schema deferral) boundary — out of scope.
4. Profiles/groups manager UX port — configuration surface, not routing.
5. Orchestrator-side sources `ui.ts`, `autocomplete.ts`, `shortcuts.ts`, `notifications.ts`,
   `docs/usage.md`, `docs/commands.md`, `docs/configuration.md` — reviewed, no verdict-changing
   content (manager/editor discovery is deliberately separate from model context,
   `context/pi-skill-orchestrator-main/docs/architecture.md:82-88`).

## 10. Convergence report

- **Stop reason**: `maxIterationsReached` (10/10).
- **Question coverage**: RQ1-RQ7 answered (7/7); every verdict carries both-side citations or a
  stated absence.
- **newInfoRatio trend**: 1.00, 0.90, 0.85, 0.80, 0.75, 0.70, 0.65, 0.60, 0.50, 0.35 — monotonic
  decline; the 0.05 convergence threshold was approached at iterations 9-10 and treated as
  telemetry only per stop policy (iteration 9 broadened angles instead of synthesizing early).
- **Quality guards**: source diversity (both codebases, source + docs + tests + plugin) pass;
  focus alignment (one RQ family per iteration) pass; no single-weak-source claims — every
  load-bearing verdict cites at least one file on each side.
- **Evidence**: 10 iteration files, 10 delta files, 28 registry findings, 34 unique cited paths
  verified, 12 content spot-checks passed, 0 failed citations.

Per-iteration detail: `iterations/iteration-001.md` … `iterations/iteration-010.md`.
Machine records: `deep-research-state.jsonl`, `deltas/iter-001.jsonl` … `deltas/iter-010.jsonl`,
`findings-registry.json`.
