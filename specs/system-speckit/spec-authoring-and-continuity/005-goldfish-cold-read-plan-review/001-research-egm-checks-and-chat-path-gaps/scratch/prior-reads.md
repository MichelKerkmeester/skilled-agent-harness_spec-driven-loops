# Prior reads of the spec workflow (inputs for the hardening research)

Three independent reads. Each is one model's opinion until its cited line is checked.

## Fresh Fable 5.2 review of the synthesis

1. Checks on the five most load-bearing claims

- "Neither command has an automatic pre-coding dispatch" (§2.3): WRONG for plan. `speckit-plan.yaml:668` and `:672` show step 5 dispatching four opus Task agents with "No question asked". The only true part is that the wave runs before `plan.md` exists.
- "The gate already blocks, so no new termination path is needed" (§5): WRONG. `speckit-implement.yaml:386-392` sets threshold 70 with `plan_clarity` at 25, so a plan scoring 0 on clarity still passes at 75. `plan_clarity` appears nowhere else under `.skilled`, so it has no scoring definition.
- "Step 5 already generates `research/research.md`, so the headings go there" (§4): OVERSTATED. `speckit-plan.yaml:758-759` lists it, but `speckit-implement.yaml:258` calls it optional. On disk, 236 of 4,058 non-archived `plan.md` folders have one, so for most packets it is the new file §7 forbids.
- "The explorer wave is conclusion-free by contract": CONFIRMED at `speckit-plan.yaml:693`, `:713`, `:733`, `:753` (the cited `:692` is one line off).
- "No Level 3+ row; 3+ matches Level 3": CONFIRMED. `folder-structure.md:129/144/162` has no "3+" string anywhere, and `speckit-plan.yaml:296-301` matches `level_3`.

2. Attack

- **Self-contradiction.** §3 quotes upstream that a same-context review "is not a Goldfish review", and §2.2 says the contribution is the evaluator. §6 then requires an inline, no-dispatch paraphrase at every level, and §8 has the author mark it correct.
- **Same-session paraphrase is worth nothing as a comprehension check.** The author paraphrases intent from memory, not the document, so it cannot fail. Under auto the step 5 checkpoint is skipped (`speckit-plan.yaml:20`, `:789`), so nobody reads it.
- **The "build nothing" rung was skipped** (`prevent-overengineering.md:61`). No sentence names a failure happening today, and §11 admits the benefit is UNKNOWN.
- **Missed: implement step 1 is already a cold read** when `/speckit:implement` runs in a new session (`speckit-implement.yaml:485`). How often that happens is UNKNOWN.
- **The §8 counters are nearly empty.** `[DEVIATION:` appears in 9 files and there is one debug-delegation file across `specs/`, so they cannot show a delta.
- **Two smaller overstatements.** "Both commands run `recommend-level.sh`" holds only for plan's optional phase path (`speckit-plan.yaml:86`). The no-prompt rule (`:876`) covers auto, while the default mode is confirm (`:19`).
- **Level 1 should carry no plan-side check.**

3. Decision: dispatch

A check with the author as evaluator has no detection power, so a level that cannot afford a dispatch gets nothing. Adding a separate dispatch after the write does not touch the explorers' contract. It costs:
- one sub-agent run per covered plan, where the step already spends four;
- about 15 YAML lines;
- a skip path that reports "cold read not run" where no sub-agent tool exists or the session is a leaf child. Which runtimes that covers is UNKNOWN.

4. Recommendations

1. **Do first.** `speckit-implement.yaml`, step 1 and `quality_gates.pre_implementation`. Add `open_design_decisions` to step 1 outputs (`:485`) and define `plan_clarity` as full marks only when that list is empty or each entry is resolved in `plan.md`. An unresolved entry blocks regardless of total.
   - Levels: recorded at 1, blocking at 2, 3 and 3+.
   - Prevents: the gate passing at 75 while the implementer silently makes design choices.
2. `speckit-plan.yaml`, step 5, after `post_write_validation` (`:781`). Add one Task sub-agent given only `plan.md`, returning the two upstream paraphrases plus open decisions. The author fixes `plan.md` or records the disagreement, and findings never gate.
   - Levels: default on at 3 and 3+, on request at 2, never at 1.
   - Prevents: a plan whose parts do not connect passing its own confidence score.
3. `research/research.md` §2.3, §5, §6 and `spec.md:137`. Correct the two wrong claims and remove the Level 1 paraphrase row and the `research.md` host.
   - Levels: all.
   - Prevents: a plan built on a gate that does not block.
4. `speckit-plan.yaml`, the new step 5 block. Keep it default off until two real Level 2 or 3 packets show cold-read findings that changed `plan.md`, with the count recorded in each `implementation-summary.md`.
   - Levels: 2 and 3.
   - Prevents: paying for a check with no shown effect.

Do not build:
- A same-session paraphrase at any level.
- The critic, the five-stage pipeline or a new severity scale.
- A new agent file, report file or metrics file.

## Luna gap read

1. ALREADY COVERED: Critique is available optionally: deep-review can check spec-to-implementation alignment and completeness, while deep-ai-council supports multi-lens critique and adversarial review. Neither is a required part of speckit:plan (deep-review SKILL.md:25-30, 142-151; deep-ai-council SKILL.md:41-46, 124-139; speckit-plan.yaml:665-713). Implementation readiness is partial: planning checks for a technical approach and scores clarity, risks, and dependencies; implementation checks plan clarity, task breakdown, and checklist status (speckit-plan.yaml:461-468, 765-779; speckit-implement.yaml:382-403). I found no isolated, document-only comprehension check; the closest steps score the draft and offer it for user review (speckit-plan.yaml:623-635, 647-652).

2. GAPS (ranked by value): 1) Readiness: a plan can pass without explicitly listing every file to create, change, or delete and settling interfaces or data structures. Add those items to the existing planning gate; fail back to planning if impactful decisions remain open (speckit-plan.yaml:461-464, 324-348; speckit-implement.yaml:382-403). 2) Comprehension: the author’s confidence score can miss unclear intent. Add a fresh-context reader that sees only spec.md and paraphrases it before approval; resolve material mismatches in the existing specification step (speckit-plan.yaml:616-635). 3) Critique: planning’s four agents explore codebase patterns and report findings, but the plan does not require them to critique the draft (speckit-plan.yaml:668-713). Add a conditional design, structure, and style critique after drafting, using the existing council skill (deep-ai-council SKILL.md:41-46).

3. LEVEL FIT: For all three gaps, exempt Level 1 to keep simple fixes light; Level 1 is explicitly the baseline for simple changes and bug fixes (speckit-plan.yaml:257-273). At Level 2, make the checks conditional on scope or unresolved risk; at Level 3, use the full checks. For 3+, scale them by phase or major design area. The requested folder-structure section defines Levels 1–3 only; exact 3+ requirements are UNKNOWN (folder-structure.md:127-174; system-spec-kit SKILL.md:200).

4. DO NOT ADOPT:
- Don’t add separate commands or agents for these checks; the existing planning steps and optional council cover the needed entry points (speckit-plan.yaml:665-779; deep-ai-council SKILL.md:41-46).
- Don’t require the full review process for Level 1 simple fixes (speckit-plan.yaml:257-273).
- Don’t impose EGM’s fixed one-re-audit limit on every review; deep-review uses convergence and quality gates, and council uses a convergence rule (deep-review SKILL.md:300-319; deep-ai-council SKILL.md:124-139).
## DeepSeek gap read

1. ALREADY COVERED
- Critic review (EGM #2): deep-review runs four dimensions in a fresh context per iteration, continuity kept in files not memory (deep-review/SKILL.md:138-152); findings must cite `[SOURCE: file:line]` (:235); P0/P1/P2 blocking table (:161-179) plus adversarial P0 replay gate (:317-318); convergence re-audits (:303,:309). Plan-side hidden-dependency hunt exists for fix/security packets — same-class producers, consumers, matrix axes, invariants (speckit-plan.yaml:332-348).
- Implementation readiness (EGM #3), partly: hard pre-implementation gate at 70 with plan_clarity + task_breakdown_quality (speckit-implement.yaml:384-393); planning gate bars `[NEEDS CLARIFICATION]` (speckit-plan.yaml:461-464); requirement→task coverage mapping (speckit-implement.yaml:527-528); hard post-implementation gate (:394-403).
- "One re-audit, then accept": confidence escalation at 2 attempts/10 min (plan.yaml:445), circuit breaker at 3 failures (:429-433), review config frozen after init so a loop cannot drift (deep-review:249).
- Skip for simple work (EGM's own carve-out): trivial/whitespace changes exempt (system-spec-kit/SKILL.md:48-54); Level 1 is four docs (folder-structure.md:129-137).

2. GAPS
G1 (highest) — EGM #1 is absent. The plan gate scores the author's own confidence "after drafting plan.md" (plan.yaml:765-780) and validate.sh checks structure only (:781-786), so a plan only its author can follow reaches step 6, where the implementer resolves the ambiguity silently. Smallest fix: one activity in implement.yaml step_1 (:480) dispatching existing read-only @context with spec.md+plan.md alone, paraphrase recorded at the step checkpoint.
G2 — readiness is attribute-scored, not decision-free: nothing requires plan/tasks to name each file created/changed/deleted with structures and signatures; the gate scores check ids, not contents (implement.yaml:388-392). Fix: one check in step_5 `checks` (:559) — every file named, else STOP.
G3 — design-time critic is opt-in: ai-council's adversarial cross-seat critique exists (deep-ai-council:124-127) but neither workflow suggests it (no mention in plan.yaml), so hidden-dependency plans ship. Fix: one suggestion line at plan.yaml's medium-confidence branch (:775).

3. LEVEL FIT
All three extend existing steps, using step_4's precedent "Skip for Level 1, MANDATORY for Level 2+" (implement.yaml:539). L1 (folder-structure.md:131-137) never triggers them. L2 gains G2. L3 (same core set, :164-179) adds G1. L3+ applies per child phase, since phase parents stay lean (SKILL.md:106).

4. DO NOT ADOPT
- A new Goldfish agent/command per stage: @context, deep-review and ai-council already own those surfaces (SKILL.md:318).
- Mandatory parallel multi-critic fan-out: contradicts ask-user above 20% complexity (plan.yaml:611) and the single-agent fallback (:386).
- A new trade-offs/audit ledger: review-report.md and decision-record.md are it (deep-review:132-136; folder-structure.md:177).
- A separate simple-fix exemption: exists (SKILL.md:48-54).
- Stage-specific re-audit machinery: convergence + circuit breaker already bound it.

UNKNOWN: named `.opencode/commands/speckit/assets/*.yaml` do not exist; canonical `.skilled/commands/speckit/assets/*.yaml` cited instead. Template internals not verified. Read-only; nothing written.
