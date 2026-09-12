# Iteration 14: A8 + A2 — Budget arithmetic on the real parent goal of packet 036 (D6, D3)

- **Lineage:** glm (cli-pi, glm-5.3-flash) - Program iteration 14 of 15, run 4 of 5 (charter allocation row 14)
- **Question:** Does packet 036's real parent `goal.md` fit the 4000/3000 budgets under every counting variant, does the it-008 cap-chain arithmetic survive line-verification, and does the A2 extractor's promised fixture behave as designed on a live packet?

## Actions Taken

1. Read 036's parent `goal.md` in full (127 lines) and measured it.
2. Bracketed the durable slice under four counting definitions (theit-002-F4 boundary, minus scaffolding, minus anchors, minus H1).
3. Re-verified the cap chain in the core at its true lines — including the two lines it-008/it-002 cited that are not what they were said to be.
4. Read the engagement condition of the compact fallback and the objective clamp above the block builder.
5. Probed the third criterion-1 document (`spec-kit-docs.json`), the binding-table children's existence, and the playbook's 3000/cut-order/reporting-rule wording.

8 evidence calls (5 bash, 1 read, 1 combined awk/docsoverify, 1 label-length check) — inside the 8-11 target.

## Findings

### F1. The measurement: 036's parent is 4000-legal, 3000-warm, at 5% completion — and the 4000 cap is robust to counting while the 3000 tier is not

`goal.md` measures **6,695 characters = 6,695 bytes** (identical under `LC_ALL=C` and `LC_ALL=en_US.UTF-8` — pure ASCII, so the bytes-vs-characters question is *vacuously* settled for this file), 127 lines (`[SOURCE: specs/system-speckit/033-system-speckit-v4/036-goal-unification/goal.md]` — measured). The durable slice, defined as the it-002-F4 reading run 1 froze (after the frontmatter's closing `---` at `:36`, before the `ANCHOR:log` comment at `:106`):

| Variant | Count | vs 4000 (D6: 036/goal.md:56; charter) | vs 3000 (playbook:112) |
|---|---|---|---|
| A — everything, incl. newlines | **3,732** | headroom 268 (6.7%) | over by 732 (124%) |
| A′ — excluding newlines | 3,663 | headroom 337 | over by 663 |
| C — minus `SPECKIT_TEMPLATE_SOURCE`/`HVR_REFERENCE`/ANCHOR comments | 3,430 | headroom 570 | over by 430 |
| D — C minus the H1 | 3,393 | headroom 607 (15.2%) | over by 393 |

Two conclusions, neither counting-ambiguous: **the 4000 cap verdict is robust** — every variant from the widest (A) to the design's own refined extraction (D) complies; **the 3000 number is not** — every variant exceeds it, 113-124%. And the packet's own continuity says `completion_pct: 5` (`[SOURCE: .../036-goal-unification/goal.md:28]`): the design's pilot packet sits at 93% of the error cap at 5% completion, with seven phases of binding rows and criteria still to write. It-008's recommendation folded the 3000 into "advice or retires" (deepseek it-008, O8-A). **Correction: the 036 numbers argue the warming tier is load-bearing** — the parent already lives in the 3000-4000 warning zone, so a 4000-only rule would give this packet's own author no signal until the error fires. It-008's O8-B (two-tier) is the reading the real numbers support; the continuation of the 010 precedent (`010/goal.md`'s slice = 1,986 = 66% of 3,000, playbook:112) vs 036's 124% is a measurable growth trajectory, not a hypothetical.

### F2. The cap chain: it-008's numbers survive, its mechanism and its ≈2,900 figure do not

Line-verified in the core: `DEFAULT_MAX_OBJECTIVE_CHARS = 4000` / `DEFAULT_MAX_GOAL_PROMPT_CHARS = 4000` / `DEFAULT_MAX_INJECTION_CHARS = 4800` (`:60-62`), `PROMPT_OVERHEAD_CHARS = 1900` (`:67`), ratio 0.12 / min 60 / max 600 (`:68-70`) (`[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:60-70]`) — it-008's constants exact, plus the uncited `:69` min-60 (immaterial at 4800). The derivations:

- Objective-section budget: `objectiveBudget = Math.max(240, Math.min(1200, maxGoalPromptChars - PROMPT_OVERHEAD_CHARS))` → 4000−1900 = 2100 → **1200** (`[SOURCE: .../goal-core.cjs:343-344]`) — it-008's arithmetic exact.
- Injected objective preview: `calculateObjectivePreviewChars` = `max(60, min(600, floor(4800 × 0.12)))` = **576** (`[SOURCE: .../goal-core.cjs:368-373]`), applied at `[SOURCE: .../goal-core.cjs:385-386]` — `objective = sanitizeInlineText(goal.objective, Math.min(4000, 576))` — the clamp it-002 cited at `:366` actually lives at `:385-386` (def at `:368-373`), with the plugin'sbyte-identical twin already read in it-012 (`opencode-goal.js:2618-2619`).
- **The prompt ceiling — the it-008 correction.** It-008/it-002 cited `:428` for "promptBudget = maxChars − blockOverhead". The real mechanism: `const promptBudget = Math.max(MIN_PROMPT_BUDGET_CHARS, maxChars - buildBlock('').length); const block = buildBlock(sanitizePromptText(goalPrompt, promptBudget)); if (block.length <= maxChars) return block;` (`[SOURCE: .../goal-core.cjs:417-419]`) — the ceiling is **dynamic**: 4800 minus the *entire empty block including the 576-char objective: line* (`:405-415`, `:385-386`), not the 1900 constant (which is the *build-time* reserve at `:343`). Summing the literal labels of `buildBlock('')` (`:405-415`: markers 33, status 14, `objective: `+576 = 587, `goal_prompt:` 12, last_check ≈ 45, usage ≈ 70, the directive line — **measured 132** (`:403`) — 13, plus 9 newlines, plus the goalId) gives |overhead| ≈ 890-925, hence **promptBudget ≈ 3,875-3,910** — **INFERRED** (the exact |buildBlock('')| is a one-call computation away; its constituents are all read). Under that arithmetic: :418 clamps a 4,000-legal prompt by ~90-125 chars and :419's early return succeeds — the compact fallback (`:421-430`, it-008's cited `:432` → `:421-430`) engages only if :419 fails, which needs |overhead| > 4797: practically never. **The ≈2,900 prompt budget is refuted** (no 2900 arises anywhere; 4800−1900 = 2900 was it-008 mixing the :343 reserve into the injection path). The qualitative conclusion — a 4,000-legal prompt is *not* injected in full, the criteria tail dies first — **survives**, now at the right site with the right number. Also verified: the injected prompt is the **generated RICCE skeleton** (`:338-361`), *not* the durable slice; the slice enters today's chain only via the `goal.goalPrompt || goal.objective` fallback at `:391` — which is, economically, the exact seam it-010's 4b (`goal_prompt ← slice projection`) needs: the landing pad already exists.

### F3. The silent truncation is not hypothetical — it is measurable on this packet today

036's objective+criteria read: the `**Objective:**` line = 161 chars; the seven `- [ ]` criteria = 1,021; total **1,182** (measured). Against the skeleton's 1,200 objective-section budget (`:343-344`): 1,182 = 98.5% — *fits, by 18 characters*. Against the 576 injected preview (`:385-386`): 1,182 = 205% — the injected `objective:` line would carry **49%** of the pointer+binding+criteria copy, silently dropping ≥606 characters — four of seven criteria — exactly the failuretmpl:36-37 warns about and 036's own criterion #2 (036:96) commissions the restored validator to catch. R6 ("silent truncation of criteria") is not a design risk; it is the *current state* of the design's own pilot packet, should the operator's set-string carry the full criteria copy. (The packet already self-reports the paste mechanism's1 real-world defect: "pasted copy carries terminal wrap artifacts; this file is the source" — `[SOURCE: .../036-goal-unification/goal.md:118]`.)

### F4. The A2 extractor vs its first live fixture: anchors resolve, the IF is pre-resolved, the fence is already gone — because 010 does not scaffold the parent

- **Anchors: all present** — `ANCHOR:directive` :42 (`/ANCHOR:directive` :65), `ANCHOR:binding` :69 (:88), `ANCHOR:completion` :92 (:102), `ANCHOR:log` :106 (:127) (`[SOURCE: .../036-goal-unification/goal.md:42,65,69,88,92,102,106,127]`). The it-010 fixture-3 (missing log anchor) is **not** exercised by this file; the extractor's documented fallback stays hypothetical on this fixture.
- **The phase conditional: already resolved** — no literal `IF level` survives in the rendered file (grep: none). 029:91's "rendered through `inline-gate-renderer.ts`" is thereby *corroborated by artifact*: the it-010 F3 requirement ("the conditional must be *resolved*, not stripped") is what 010's renderer already does; the tmpl's `<!-- IF level:phase -->` (it-013: true line :66) survives only in the template.
- **The DURABLE fence: absent** — the tmpl's "Everything above the log is DURABLE" blockquote (tmpl:34-37) has no counterpart in 036 (grep: no `> Everything` hit). Cause found, in 036's own log: "Parent `goal.md` rendered by hand | Phase mode scaffolds child goals from `--with-goal` but not the parent; rendered from `goal.md.tmpl` at level phase" (`[SOURCE: .../036-goal-unification/goal.md:126]`). **New finding: 010's phase-mode delivery gap** — theparent goal.md is outside `--with-goal`'s scope, 036 was hand-rendered, and the fence omission is the likely signature. It-010's extractor step "remove the durable/volatile blockquote" (deepseek it-010 F3) degrades to a no-op here — harmless, but the only live parent already deviates from the template it came from.
- **Continuity, confirmed live:** `packet_pointer: "system-speckit/033-system-speckit-v4/036-goal-unification"` (`:14`) — the machine-readable pointer the design needs **already exists** in the frontmatter, outside the durable slice; `last_updated_by: "claude-code"` (`:16`); `session_dedup.fingerprint` = the **zero placeholder** (`:25`) — it-004 F4's inference (goal.md never carries a real fingerprint) confirmed on the design's own packet; `last_updated_at: 2026-09-11T07:30:00Z` (`:15`).

### F5. Criterion #1 (036:95) is measurably unmet today — in the direction it-013 predicted

Criterion #1: "`goal.md.tmpl`, the set-string playbook and `spec-kit-docs.json` agree on the frontmatter-strip boundary and the 4000-character durable budget" (`[SOURCE: .../036-goal-unification/goal.md:95]`). Today: the template's durable prose carries **no number** (tmpl:34-37 says only "the runtime goal surfaces cap what they will hold"); the playbook's budget figure is 3,000 and appears only inside the worked example (`[SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:112]` — it-008's `:57` anchor shifted: `:57` states a budget *exists* and "the rule reports a slice that exceeds it" — a promise kept by the since-deleted `check-goal-shape.sh`, exactly as the charter:18 recorded); `spec-kit-docs.json` (`.opencode/skills/system-spec-kit/templates/spec-kit-docs.json`) references `goal.md` and `goal.md.tmpl` but contains **zero** occurrences of "4000" (grep count: 0). The 4,000 number today lives only in 036's own D6 (`:56`) and the charter. Add the units mismatch: 010:61 measures in **bytes** ("15,028 bytes"), 036:96 restores the rule over "**4000 characters**" — identical here (ASCII, F1) but a real choice for the restored rule. **Criterion #1 is currently failing on all three axes** (boundary wording — it-013 F5's tension; budget number; units) — which is not a flaw: it is the criterion correctly predicting its own work.

### F6. Criterion #2's precondition holds; criterion #5 already conflicts with today's ladder — by the packet's own naming rule

All seven binding-table children's `goal.md` exist (3,350-4,183 bytes; `001` = 4,183 — a *child*, so D6's parents-only 4000 cap correctly does not bite) (`[SOURCE: .../036-goal-unification/00{1..7}-*/goal.md]` — existence + sizes verified). Criterion #5, though, reads: "speckit plan, implement, complete, **resume and save** update the parent `goal.md` when a decision, binding row or criterion changes, and resend the stripped slice in chat" (`[SOURCE: .../036-goal-unification/goal.md:99]`) — while today's whitelists make resume read-only (`resume.md:4` lacks `opencode_goal`; it-013 F3) and know no `save`-side goal write. That is precisely the conflict the template's — and 036's — precedence rule anticipates: "Name a conflict rather than resolving it silently" (`[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:77-78]`, mirrored at 036:85-86). The packet's own rule fires on the packet: the implementation must either widen resume/save (amending it-007's read-only precedent, it-013 F3) or amend criterion #5 — either way, *named, not silent*.

### F7. Bonus: 036's own criterion #2 specifies more than run 1's enforcement site

Criterion #2: "A restored validator rule fails a parent `goal.md` whose durable slice exceeds 4000 characters **or whose binding table names a child `goal.md` that does not exist**" (`[SOURCE: .../036-goal-unification/goal.md:96]`). It-008's D6 enforcement (a 4000 rule beside the anchor checks, `spec-doc-structure.ts:207/:229`) covers the first clause; the second — binding-row existence — is a *second* restored rule run 1 never recorded, and its precondition is绿 today (F6). The design's enforcementTODO is thereby larger by one rule than run 1's synthesis knew.

## Corrections ledger (run 1 → run 2)

| # | Surface | Run 1 said | Run 2 verdict | Resolving citation |
|---|---|---|---|---|
| 1 | Prompt-truncation mechanism | the compact fallback cuts it (`:428`, `:432`) | the :417-418 label-clamp does; compact almost never engages (:419 early-returns) | `goal-core.cjs:417-419`, `:421-430` |
| 2 | Prompt budget ≈ 2,900 | 4800−1900 | REFUTED: 4800−\|buildBlock('')\| ≈ 3,875-3,910 (dynamic; includes the 576 preview; goalId-dependent) — INFERRED sum, 1-call confirmation noted | `:403` (132, measured), `:405-415`, `:417` |
| 3 | "3,000" citation | playbook:57 | the 3,000 lives at :112 (a measurement, not a rule); :57 promises a reporting rule the deleted checker no longer keeps | `playbook.md:57`, `:112` |
| 4 | Validation-rules.md | (it-008: "goal" absent) | negative stands unre-verified — this pass probed the wrong sibling dir (references/structure/); the real link target is `../validation/validation-rules.md` | `playbook.md:137` |
| 5 | O8-A over O8-B | 4000-only, 3000 retires | CORRECTED by measurement: 036's parent = 3,393-3,732 (113-124% of 3,000, 93% of 4,000) at 5% completion — the warning tier is load-bearing | this file, F1; `036/goal.md:28,56` |
| 6 | continuity fingerprint (it-004) | inferred zero-placeholder | **confirmed on the live parent** | `036/goal.md:25` |
| 7 | D1/D2 pointer | a new record field | a machine-readable `packet_pointer` already exists in the frontmatter (036:14) — the record-side pointer can ratify-adopt it | `036/goal.md:14` |

## What worked / what failed / ruled out

- **Worked:** measuring under *all four* counting variants before comparing to either threshold — the conclusion that survived (4000-robust, 3000-fragile) is exactly the one neither single counting would have licensed; reading :417-419 before attributing truncation to the compact path.
- **Failed:** the validation-rules.md existence probe used `references/structure/` — the playbook's own link (`:137`) says `../validation/`; the it-008 negative-result therefore stands *unverified by this lineage*; the |buildBlock('')| sum is inferred (its 10 constituents are read, the summation and the goalId/verdict variability are not — the 1-call confirmation: evaluating `buildBlock('')` in a scratch import).
- **Ruled out:** (a) *units doubt* — 6,695 = 6,695 (ASCII; `wc -m` under C and UTF-8 identical), so no char/bytes adjustment applies to this packet, though the restored rule must still choose (criterion says characters; the 010 precedent speaks bytes); (b) *compact-path truncation as the mechanism* — :417-419's clamp precedes :419's early return, so :421-430 runs only in a corner (|overhead|+3 > 4,800) that a legal prompt cannot reach.

## Assessment

- `newInfoRatio`: 0.7 — the highest of this lineage, as befits the quantitative iteration: the mechanism/number corrections to it-008's cap chain, the 3000-warm/4000-robust measurement, criterion #1's three-way disagreement quantified, the criterion-#5-vs-whitelist conflict, the 010 phase-parent scaffold gap, the second restored rule (binding-row existence), and the live 1,182-vs-576 truncation; the anchors/IF/zero-fingerprint/pointer facts are confirmations.
- Convergence telemetry: 0.7 >> 0.05 — the final iteration proceeds to synthesis at the cap.
- Confidence: high on every measured/verified number (all read or computed this iteration); the |buildBlock('')| ≈3,875-3,910 prompt ceiling is the one inferred quantity, flagged with its confirming call.

## Recommended Next Focus

None — the lineage reaches its cap. Iteration 15: the final ranked synthesis per D1-D7, stating where run 2 agrees with, corrects, or overturns run 1.
