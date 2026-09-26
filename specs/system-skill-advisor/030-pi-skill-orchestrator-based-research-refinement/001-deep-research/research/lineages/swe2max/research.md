# Lineage Synthesis — swe2max (cli-devin, model swe-2-max)

**Session**: `fanout-swe2max-1790404524761-xsg1vq` · **Loop**: research · **Stop policy**:
max-iterations · **Iterations**: 5/5 · **Terminal stopReason**: `maxIterationsReached`

**Citation convention**: orchestrator paths are relative to
`specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/context/pi-skill-orchestrator-main`
(e.g. `src/search.ts:26`); advisor paths are relative to the repository root
(e.g. `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:79`). All cited
paths resolve; ~40 cited line ranges were mechanically spot-opened and content-matched
in iteration 5. Every claim is labelled CONFIRMED (read in code) or INFERRED (with
what would confirm it).

**Cross-lineage**: the parallel mimo lineage (10 iterations, `../mimo/research.md`)
independently reached the same verdict partition; agreement/divergence is recorded
per finding (F26).

---

## 1. Ranked verdict table

| # | Verdict | Recommendation | Findings |
|---|---------|----------------|----------|
| 1 | ADOPT | Pull recovery beside push: name `advisor_recommend` in the directives-only fallback | F18, F19 |
| 2 | ADOPT | `disable-model-invocation` surfacing: parse slot exists, nothing consumes it; demote/exclude manual-only skills with a visible reason | F23, F26 |
| 3 | ADOPT | Name-mention rank-1 pin, gated to invocation-shaped contexts | F13, F23 |
| 4 | ADOPT | Explicit "no in-scope skill matched" line instead of silent absence | F15, F26 |
| 5 | ADOPT | Constant-size indexed-candidate count line in the brief | F1, F23 |
| 6 | ADOPT | Budget enforcement around the Pi in-process advisor call (2500ms is advisory, not raced) | F18, F19, F26 |
| 7 | ADOPT | Delivered-byte accounting; directive dedup default-on across adapters | F20, F22 |
| 8 | ADOPT | Pull-surface output shape: ≤5 default / ≤8 max, ≤160-char descriptions | F17, F23 |
| 9 | ADAPT | Soft scope preference in fusion (family/hub prior); global pool stays open | F25 |
| 10 | ADAPT | If a pull tool ships, back it with the advisor scorer, not substring search | F13, F18 |
| 11 | ADAPT | `depends_on` derivation assist: borrow conservative body-scan + negation guard | F14, F24 |
| 12 | ADAPT | Whole-brief bound: count (never clip) the constant directive block | F12, F20 |
| 13 | ADAPT | Truncate-and-keep ranking metadata instead of drop-to-null at 512 chars | F16, F23 |
| 14 | ADAPT | Graph-health (missing/cycle, sparse depends_on) on the `advisor_status` trust surface | F24 |
| 15 | ADAPT | Static deep-import contract guard for the Pi hook dist path | F18 |
| 16 | ADAPT | Scope-stub discipline as a brief-format invariant; catalog replacement only on system-prompt-owning surfaces (Pi first) | F1, F17 |
| — | REJECT | Pull-replaces-push | F15, F17, F26 |
| — | REJECT | Dependency bundle inside the brief | F14, F24 |
| — | REJECT | Importing the orchestrator's substring score table | F13 |
| — | REJECT | Authorization-set + load-gate transplant | F19, F25 |
| — | REJECT | Warn-not-delete and tmp+rename transplants (property-equivalent) | F19, F22 |
| — | REJECT | Brief-replaces-catalog inside the advisor | F1, F17 |

---

## 2. RQ1 — Catalog/index architecture and lazy visibility

**Q**: What does each runtime pay for skill visibility before any routing happens;
does the advisor brief replace or add; can the stub + on-demand search apply here?

**A**: The orchestrator strips Pi's eager `<available_skills>` block and replaces it
with a constant five-line scope stub — name, count, and fixed instructions, with no
skill data (`src/index.ts:281-326`, `src/catalog.ts:95-157`, `src/scope.ts:104-118`).
The advisor hides its index too (SQLite graph), but *adds* a ~80-token verdict line
plus a constant directives block to every fired prompt
(`.skilled/skills/system-skill-advisor/runtime/lib/render.ts:79-85,435-440`) — and it
cannot remove the runtime's own catalog, which on Pi is emitted into the system prompt
independently of any hook. CONFIRMED. The two designs are complementary boundaries:
the orchestrator owns a system-prompt surface and removes content; the advisor owns a
prompt-append surface and can only add.

- **V16 ADAPT** — scope-stub discipline. Where the advisor stack owns a system-prompt
  surface (a Pi extension), an orchestrator-style strip+stub is feasible; on
  hook-only runtimes it is not. The transferable invariant is the advisor side: the
  brief already contains zero catalog data (`render.ts:377-440` renders labels only).
  Benefit: no double catalog payment on Pi. Cost: a system-prompt-owning extension.
  Risk: catalog-format drift — mitigated by the orchestrator's own warn-not-delete
  detector (`catalog.ts:163-188`). [INFERRED for non-Pi runtimes; would confirm from
  their hook contracts.]
- **V5 ADOPT** — the count line. "N lazy skill candidates are indexed"
  (`src/scope.ts:108-115`) is constant-size and tells the model discovery depth
  exists. An "N skills indexed" line in the advisor brief costs ~15 tokens and is the
  cheapest transferable unit of the lazy design. CONFIRMED mechanism; benefit
  INFERRED (model may already infer depth from the brief's presence — an A/B render
  would confirm behavior change).
- **REJECT** — brief-replaces-catalog: the advisor emits via `additionalContext`/
  transform append only (`user-prompt-submit.ts:357-362`,
  `prompt-advisor.ts:284-285`); it cannot delete prompt bytes it does not own.
  CONFIRMED by interface shape.

## 3. RQ2 — Push vs pull: failure modes and a possible pull surface

**Q**: What failure modes does each design exhibit on our code; would a pull surface
change routing accuracy, latency, or the observed `fail_open` behavior?

**A**: Push failure surface (CONFIRMED): typed subprocess errors
(`subprocess.ts:45-54`), one jittered SQLITE_BUSY retry (`subprocess.ts:303-321`),
warm-CLI probe at 250ms with a retryable envelope (`cli-fallback.ts:76-122`),
hook-level `{}` fail-open (`user-prompt-submit.ts:376-387`), and — when a brief
can't be produced — either directives-only or nothing reaches the model
(`render.ts:388-395`, `skill-advisor-brief.ts:486-504`). The model gets zero routing
signal on an outage and cannot recover in-turn. Pull failure modes (CONFIRMED):
silent non-discovery (the model must think to call `skill_search` — the stub's fixed
instruction counteracts this, `src/scope.ts:112-115`), 1–2 extra tool round-trips,
and a shallow substring ranker (`src/search.ts:19-38`) where a miss finds nothing —
which the bounded auto-fallback papers over (`index.ts:666-696`).

- **V1 ADOPT** — pull recovery beside push. The orchestrator proves a model can drive
  retrieval when handed the tool name (`index.ts:596-650`). Naming
  `node .skilled/bin/skill-advisor.cjs advisor_recommend …` in the directives-only
  fallback turns the observed `fail_open` class into a self-healing one. Benefit:
  the measured failure mode (CLI fallback timed out) gets an in-turn recovery path.
  Cost: one line in the fallback directive + a documented command. Risk: one wasted
  tool call on a truly dead daemon. CONFIRMED mechanism; benefit INFERRED (a failure
  replay would confirm the model actually uses the named command).
- **V10 ADAPT** — if a pull tool is built, back it with `advisor_recommend`'s scorer
  (five-lane fusion, `lane-registry.ts:8-19`) rendered in the orchestrator's bounded
  shape — not the orchestrator's ranker (see RQ5). CONFIRMED adapter points.
- **REJECT** — pull-replaces-push: trades a reported, typed failure for silent
  non-discovery. CONFIRMED asymmetry; mimo lineage concurs (F3-3).
- **V6 ADOPT** — enforce the budget around the Pi in-process call. The Pi hook
  `await`s the imported handler with no race (`prompt-advisor.ts:243-250`); the
  2500ms figure is a budget the handler self-reports against, not a deadline.
  Wrap in a deadline race. Benefit: hook can never stall a send. Cost: a
  `Promise.race`. Risk: truncated brief on a slow-but-fine call — bounded by
  fail-open. [INFERRED overshoot risk; one instrumented slow session would confirm.]
  Mimo ADOPTs the same fix (F9-2).

## 4. RQ3 — Profiles, groups, and scope

**Q**: What in the advisor plays the role of profiles/groups/authorization set; would
scope preference raise precision; what would it break?

**A**: The orchestrator has a real scope algebra: one active scope of
all/profile/group (`src/scope.ts:4-7`), profiles as unions of group members
(`scope.ts:38-45`), empty profile = zero candidates (`scope.ts:96-100`), bounded
global fallback that never mutates the scope (`index.ts:621-648,666-696`), and an
authorization set populated per fallback search and cleared on scope change
(`index.ts:602,616-619`) guarding the load gate (`index.ts:716-735`). The advisor
has *no* per-context scope [CONFIRMED by absence — scorer lanes consume only
prompt-derived evidence]. Its only exclusion surface is the operator denylist
(`route-exclusions.ts:59-99` — committed + local override, fail-safe to empty).
Its only prompt-side partitioning is `shouldFireAdvisor`
(`prompt-policy.ts:83-197`), which partitions *prompts*, not skills.

- **V9 ADAPT** — soft scope preference. A family/hub prior added to fusion — the
  active context biases candidates while the global pool stays open, mirroring the
  orchestrator's own "bounded fallback never changes the scope" discipline
  (`index.ts:638`). Benefit: precision on family-adjacent ties. Cost: one weighting
  term + scope signal source. Risk: stale scope — bounded by the open pool and the
  existing top-2 ambiguity widening (`render.ts:421-433`). [INFERRED precision gain;
  an offline replay with/without the prior would confirm.]
- **V4 ADOPT** — explicit no-match line. The orchestrator emits
  "No matching skills found in the active scope…" (`index.ts:687-696`); the advisor
  today emits nothing (`render.ts:409-412` → null → no brief). Emitting an explicit
  no-match line removes the did-the-advisor-run ambiguity. Benefit: operators and
  models can distinguish silence from abstention. Cost: ~1 line on no-match turns.
  Risk: slight token cost on abstaining turns — bounded by the existing fallback
  directive path. CONFIRMED absence + precedent.
- **REJECT** — authorization-set + load gate transplant: the gate exists to
  authorize *loading* (`index.ts:716-735`); the advisor loads nothing — its
  recommendations are names, not loads. The only transferable property (state
  reset on lifecycle) is already embodied (`prompt-advisor.ts:206-212`). CONFIRMED.

## 5. RQ4 — Dependency loading

**Q**: Does the advisor act on `depends_on`/`enhances` at recommendation time; should
it return a dependency bundle?

**A**: The orchestrator loads root + recursive closure in one call:
`resolveDependencyGraph` DFS with cycle/missing reporting, five conservative
body-scan patterns, a negation guard, `isModelVisibleSkill` filtering on auto edges
(`src/dependencies.ts:8-93`, `index.ts:736-746`). The advisor acts on edges as *score
propagation only* — `enhances` 0.55, `siblings`/`depends_on` 0.35,
`prerequisite_for` 0.30, `conflicts_with` −0.35, BFS depth 2/breadth 4
(`lanes/graph-causal.ts:28-34,91-95`) over a SQLite `skill_edges` store now holding
3 `depends_on`, 20 `enhances`, 5 `prerequisite_for`, 32 `siblings` across 15 nodes
[CONFIRMED by schema + counts]. No bundle exists anywhere in the recommend path
[CONFIRMED by absence].

- **REJECT** — dependency bundle in the brief: it would spend the 80-token budget on
  names the skill body itself restates on load. Bundle loading is the runtime
  loading layer's job. CONFIRMED.
- **V11 ADAPT** — `depends_on` derivation assist. With only 3 depends_on edges over
  15 skills, edge coverage is sparse; borrowing the orchestrator's conservative
  body-scan + negation guard (`dependencies.ts:8-38`) beside
  `detect-inbound-enhances.ts` would let graph-causal weights track reality.
  Benefit: ranking edges stop depending on hand-authoring. Cost: a reviewed
  suggestion workflow (edges are curated metadata). Risk: false-positive edges —
  mitigated by the same negation guard and review. [Effect size INFERRED; a corpus
  run counting accepted candidates would confirm.]
- **V14 ADAPT** — surface missing/cycle gaps on `advisor_status`. The orchestrator
  reports `bundle.missing`/`bundle.cycles` (`index.ts:736-746`); the advisor could
  surface edge-store health on its existing trust surface
  (`ARCHITECTURE.md` status contract). Benefit: operator visibility into sparse or
  broken edges. Cost: a status field. Risk: none — operator-facing only. CONFIRMED
  counterpart surface.

## 6. RQ5 — Ranking signals

**Q**: What does the orchestrator rank on; does any signal map onto a lane gap?

**A**: The orchestrator ranks on one weighted-substring table — name-exact +200,
prefix +80, name/desc substring +60/+35, token bonuses 45/24/8/4
(`src/search.ts:19-38`) with alphabetical tie-break (`search.ts:50`). The advisor
fuses five lanes — explicit_author 0.42, lexical 0.28, graph_causal 0.13,
derived_generated 0.12, semantic_shadow 0.05 (`lane-registry.ts:8-19`) — with
synonym expansion, category hints, deterministic `localeCompare` tie-breaks
(`fusion.ts:306,749-776`), and env-overridable weights (`lane-registry.ts:37-50`).
Every orchestrator signal is a strict subset of the lexical lane's capability —
except one.

- **V3 ADOPT** — name-mention rank-1 pin. The orchestrator's +200 makes a literal
  skill name guaranteed top-1; the advisor scores an exact mention 1.0 inside a
  0.42-weight lane (`explicit.ts:317-321`), so a fused competitor can outrank a named
  skill. Pin a named skill to rank-1, gated to invocation-shaped contexts (verb /
  `/skill:` / `skill("…")` mention shapes — the orchestrator's own dependency
  patterns, `dependencies.ts:28-34`) so prose mentions don't false-pin. Benefit:
  eliminates the "I named it, it routed elsewhere" failure. Cost: a fusion
  post-pass. Risk: false pins — mitigated by the gate. [INFERRED failure mode; a
  fusion replay would confirm whether a named skill can lose today.]
- **REJECT** — importing the substring score table: strictly less capable than the
  lexical lane. CONFIRMED.
- **REJECT** (as adoption) — deterministic tie-breaks: already embodied
  (`fusion.ts:306,749-776`); keep as a tuning invariant since Pi dedup suppresses
  only identical content (`prompt-advisor.ts:140`). CONFIRMED.

## 7. RQ6 — Output bounds

**Q**: Where does each system bound what the model sees; would the orchestrator's
limits change the advisor's output?

**A**: Orchestrator bounds: results clamped 1..8 default 5 (`search.ts:46`,
`index.ts:590,600`), descriptions flattened and truncated to
`catalogDescriptionMax` default 160, hard clamp 0..240 (`index.ts:603-609`,
`config.ts:45,138-139`), ingestion slice 1024 chars (`catalog.ts:5-13`), and a
five-line constant stub. Advisor bounds: 80-token head cap, 120 on ambiguity,
≤2 labels (`render.ts:79-85,409-433`), ≤8 source fingerprints
(`skill-advisor-brief.ts:250`), 64KB prompt clamp (`user-prompt-submit.ts:107-134`),
32KB Pi capture (`prompt-advisor.ts:8-10`), 1MiB CLI stdout cap
(`cli-fallback.ts:80`), 512-char metadata drop-to-null
(`metadata-sanitizer.ts:9-11`), and content-equality directive dedup in three
adapters (`user-prompt-submit.ts:303-345`, `prompt-advisor.ts:129-152`,
plugin `splitDirectiveBrief`). CONFIRMED throughout.

- **V8 ADOPT** — the 5/8 + 160-char shape as the output contract for any advisor
  pull surface (V1/V10). CONFIRMED it is the right shape — bounded, numbered,
  name+description rows; the pushed brief is already tighter.
- **V12 ADAPT** — whole-brief bound. The directive block is appended *after*
  `capText` (`render.ts:435-440`), so the real worst case is ~138 tokens, not 80.
  Count the constant block in the delivered-byte budget — never clip it (it is a
  guardrail). Benefit: honest cost accounting. Cost: a metric change. Risk: none.
  CONFIRMED.
- **V13 ADAPT** — truncate-and-keep for ranking metadata. The advisor drops >512
  char metadata values to null (`metadata-sanitizer.ts:9-11,34`); the orchestrator
  keeps a bounded prefix (`catalog.ts:7-13`). Partial signal beats none for ranking
  inputs. [Ranking impact INFERRED; a with/without score comparison on over-length
  records would confirm.]
- **V7 ADOPT** — delivered-byte accounting + dedup default-on. Three adapters dedup
  the constant tail but each is independently gated; measuring delivered bytes per
  turn is the prerequisite for every cost claim in this packet. CONFIRMED the
  mechanism exists partially (dedup) and is missing (accounting).

## 8. RQ7 — Robustness and compatibility

**Q**: Which of the orchestrator's robustness patterns does the advisor lack, and
which would matter?

**A**: Side by side — orchestrator robustness is write/config-path defense
(tmp+rename `profiles.ts:61-68`, fail-safe catalog detector `catalog.ts:163-188`,
`disable-model-invocation` honored at catalog/load/dependency time
`catalog.ts:38`, `index.ts:716-721`, `dependencies.ts:77-82`, Pi compat tests);
advisor robustness is delivery-path defense (typed failure taxonomy
`subprocess.ts:45-54`, layered fallback `cli-fallback.ts:160-168`, prompt clamps,
sanitized labels `render.ts:129-145`, append-atomic metrics `metrics.ts:295-310`,
fail-safe durable store `directive-lifecycle-file-store.ts:3-6`, kill switches
`user-prompt-submit.ts:232`, `prompt-advisor.ts:60-69`). CONFIRMED. Each side
defends the boundary it owns.

- **V2 ADOPT** — `disable-model-invocation` surfacing. The orchestrator honors it at
  every decision point; the advisor never reads it — `parseDocFrontmatter` collects
  arbitrary scalars (`doc-frontmatter.ts:89-139`) so the parse slot already exists,
  but nothing consumes the flag. Today the advisor can recommend a manual-only
  skill the model is not allowed to invoke. Surface it in the projection and
  demote/exclude with a visible reason. Benefit: briefs stop naming uninvokable
  skills. Cost: projection field + lane guard. Risk: flag set after indexing —
  covered by the freshness cycle. [INFERRED that a live brief can name a
  manual-only skill today; a fixture run would confirm.]
- **REJECT** — warn-not-delete transplant: embodied by the renderer's fail-closed
  instruction-label guard (`render.ts:83-85,129-145`). CONFIRMED equivalent.
- **REJECT** — atomic-write transplant: the advisor's only durable writes are
  append-atomic bounded JSONL (`metrics.ts:295-310`) and a fail-safe delegated
  lifecycle store; property-equivalent already. CONFIRMED.
- **V15 ADAPT** — contract guard for the deep import. The Pi hook deep-imports a
  compiled dist path (`prompt-advisor.ts:47-50`); the orchestrator ships
  Pi-compatibility contract tests. Add a static deep-import/contract guard over
  `hooks/pi/**` so a dist-layout drift fails loudly instead of silently degrading
  to `advisorFailed`. Benefit: surface drift detected at test time. Cost: one
  contract test. Risk: none. CONFIRMED gap.

---

## 9. Cross-lineage agreement

Independent mimo lineage (`../mimo/research.md`, 10 iterations) reached the same
verdict partition on every shared mechanism: ADOPT pull-recovery-beside-push
(mimo F3-1/F9-1 ≈ V1), output shape for a pull surface (F7-1 ≈ V8), count line
(F1-2 ≈ V5), no-match line (F4-3 ≈ V4), disable-model-invocation surfacing
(F8-3 ≈ V2), deadline enforcement on the Pi call (F9-2 ≈ V6); ADAPT soft scope
(F4-1 ≈ V9), scorer-backed pull (F3-2 ≈ V10), graph-health surface (F5-3 ≈ V14),
whole-brief bound (F7-2 ≈ V12), truncate-and-keep (F7-3 ≈ V13), Pi contract guard
(F8-4 ≈ V15); REJECT push replacement (F3-3), bundle-in-brief (F5-1), raw ranker
(F6-2), auth-set transplant (F4-2), write-path transplants (F8-1/F8-2). Sole
divergence: framing of V6 — mimo calls it a "deadline race"; this lineage frames
the same fix as budget enforcement around an un-raced await. Direction is
identical; rank ordering differs marginally.

## 10. Negative knowledge (explicitly not pursued)

1. Live `advisor_recommend` replay — would spawn the daemon and write runtime state
   outside the lineage write surface.
2. Provider cache-pricing arithmetic for long-session cumulative brief cost — no
   price sheet in-repo; the delivered-byte accounting (V7) is the local prerequisite.
3. Token Saver internals beyond lazy-discovery bearing on output bounds — bounded
   out of scope by the phase spec.
4. TUI surfaces (`ui.ts`, `autocomplete.ts`, `shortcuts.ts`) — manager-side
   discovery, deliberately separate from model context
   (`docs/architecture.md:82-88`).
5. Devin/Cursor hook adapters — same lifecycle module, thin shims; no new mechanism.
6. `projection.ts`, `executor-delegation.ts`, `feedback-calibration.ts` deep reads —
   lane contract sufficient from registry + lane sources.

## 11. Convergence report

- **Stop reason**: `maxIterationsReached` (5/5).
- **Question coverage**: RQ1–RQ7 answered (7/7); every verdict carries both-side
  citations or a stated absence.
- **newInfoRatio trend**: 1.00, 0.95, 0.90, 0.85, 0.35 — monotone decline; the 0.05
  convergence threshold was not reached inside the cap, so no early-synthesis
  telemetry decision was needed.
- **Quality guards**: source diversity (both codebases; source + docs + SQLite
  schema + tests) pass; focus alignment (one mechanism family per iteration) pass;
  every load-bearing verdict cites at least one file on each side.
- **Evidence**: 5 iteration files, 5 delta files, 30 findings across the delta log,
  ~40 cited ranges mechanically verified (iteration 5), 0 failed citations.

Per-iteration detail: `iterations/iteration-001.md` … `iterations/iteration-005.md`.
Machine records: `deep-research-state.jsonl`, `deltas/iter-001.jsonl` …
`deltas/iter-005.jsonl`, `findings-registry.json`.
