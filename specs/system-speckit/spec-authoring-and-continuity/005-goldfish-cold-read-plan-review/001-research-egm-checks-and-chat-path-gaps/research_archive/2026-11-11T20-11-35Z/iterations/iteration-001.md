# Iteration 1: Which checks live only in the command workflows

## Focus

Strategy `## 11. NEXT FOCUS` was empty, so the first unchecked key question was taken: *which checks exist only in the three command workflow files and are absent from the chat path, and which are already duplicated there* (Q1). This is the evidence foundation for ranking the five candidate mechanisms — every ranking claim downstream depends on knowing whether the gap is missing *content*, missing *sequencing*, or missing *enforcement*.

Scope used: the three `speckit-*.yaml` assets, `AGENTS.md`, `system-spec-kit/SKILL.md`, `ROUTER.md`, `references/workflows/spec-authoring-card.md`, `templates/core/`, and the 42-rule validator registry behind `validate.sh`. Hooks were not inspected this iteration (deferred; it belongs to Q2's per-mechanism cost pass).

## Actions Taken

1. Sized all six comparison files (`wc -l` / `wc -c`) and listed the command asset directory.
2. Extracted the step and gate structure of the three YAMLs by scanning for gate/enforcement vocabulary.
3. Read the full gate blocks: `plan.yaml` quality_gates + workflow_enforcement, `complete.yaml` quality_gates + circuit_breaker + workflow_enforcement.
4. Mapped `AGENTS.md` section headings to its actual gate inventory.
5. Read `spec-authoring-card.md` sections 6, 7, 10, 11 — the only plan-quality text on the chat path.
6. Dumped the 42-rule `validator-registry.json` to establish what `validate.sh` actually enforces.
7. Cross-searched the entire `.skilled/` tree for the three planning-gate check ids outside the YAMLs.

## Findings

1. **The YAMLs carry six check families, and the chat path carries none of them as such.** `pre_execution` (threshold 70, hard block, `on_fail` names missing checks), `planning_gate` (threshold 70, `critical: true`, `HALTED` on fail), `post_execution` (threshold 70), `step_completion_rule`, `circuit_breaker` (CLOSED/OPEN/HALF_OPEN), and `critical_steps` verification. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:403-424]
   [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:461-468]

2. **The planning gate is the load-bearing one and it sits between planning and implementation.** `complete.yaml` places it "Between Step 7 and Step 8", weights eight checks to 70/100, and pairs it with `review_integration: { blocking: true, on_review_fail: "P0 items blocking. Address before implementation." }`. Nothing on the chat path runs any check at that position in the work. [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:504-519]

3. **Three planning-gate checks have zero enforcement outside the YAMLs:** `spec_no_clarification` (5 pts), `checklist_verified` (15 pts), `review_approval` (10 pts). A tree-wide search of `.skilled/` for those ids, excluding the three YAMLs, returns no hits — no validator rule, no skill doc, no hook. [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:511]
   [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:516-517]

4. **`spec_no_clarification` is checking for a marker the current template set never writes.** `templates/core/` contains no `[NEEDS CLARIFICATION` text at all, `validate.sh`'s registry carries no rule for it, and the only consumer anywhere is a completeness *score*, not a blocker. So 5 of the gate's 70 points rest on a convention that no chat-path scaffold asks a writer to follow. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh:19]
   [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:1]

5. **Duplicated — do not rebuild these.** Confidence thresholds are identical (80/40 boundaries, `plan.yaml` high "Proceed with citable source" / low "STOP - Ask clarification with A/B/C options", against the AGENTS.md confidence table). The strict validator command is the same string in both. Evidence citation (`[SOURCE: file:lines]` or `UNKNOWN`) is stated on both paths. The retry ceiling is 3 on both. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:440-442]
   [SOURCE: AGENTS.md:54-61]
   [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:309]
   [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:561]
   [SOURCE: AGENTS.md:189]

6. **Completion-time checks are duplicated too, and the chat path's version is the stronger one.** `complete.yaml` requires tasks marked `[x]`, every acceptance-criteria row verified, every P0/P1 checklist item closed, and `implementation-summary.md` present. AGENTS.md's COMPLETION VERIFICATION RULE requires the same three things plus a re-read of the request and its amendments, and it is backed by the registry's `AC_CLOSURE` rule at error severity. [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:583-591]
   [SOURCE: AGENTS.md:138-144]

7. **`validate.sh` already enforces the YAML file-shape family.** Of its 42 rules, `FILE_EXISTS`, `LEVEL_MATCH`, `LEVEL_DECLARED`, `PLACEHOLDER_FILLED`, `SCAFFOLD_NEVER_TOUCHED`, `SPEC_DOC_SUFFICIENCY`, `TEMPLATE_SOURCE` and `AC_CLOSURE` cover `spec_exists`, `plan_exists`, `tasks_exists`, `plan_has_approach`, `tasks_has_format` and `checklist` shape. Those YAML points add nothing a chat session does not already run. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:1]

8. **The gap is therefore sequencing plus judgment, not content.** Content the chat path already has: file shape, placeholders, AC closure, citations, confidence, retry cap, completion reconciliation. Content it lacks: any check positioned *before* implementation, and every check whose verdict needs a reader rather than a regex — review approval, checklist verification, and a numeric readiness threshold. [INFERENCE: based on findings 1, 6 and 7 — the two inventories partition cleanly along validator-decidable versus reader-decidable]

9. **Q4: a plan only its author can follow passes the chat path today.** The authoring card's section 6 acceptance is heading presence — "`plan.md` holds its three phases in one line each" — and its verify is a heading grep. Section 7 requires a `Verify:` clause per *task* line, but nothing requires a *phase* line to name a file, symbol or proof command. The card's own worked example is unanchored prose ("Setup reads the current archive count. Implementation adds `--keep <n>`.") and satisfies both gates. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:123-124]
   [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:139-144]
   [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:120]

10. **Q4 smallest fix: one existing line pair in a file the chat path already loads.** Change section 6's Acceptance line so each of the three phase lines must name a repo-relative path or symbol *and* the command that proves the phase done — promoting section 7's existing one-file/one-verify discipline one level up. Verify changes from `rg -n '^## 4'` printing one line to a check that each of the three lines carries a path token and a verify clause. No new file, hook, command or agent. [INFERENCE: based on findings 8 and 9 — the missing signal is phase-level anchoring, and the card already owns that vocabulary at task level]

11. **Cost of the "just load the workflows" option, measured.** The three YAMLs total 3,159 lines / 218,859 bytes (~55k tokens). The chat-path docs total 81,569 bytes (~20k tokens: AGENTS.md 27,372, SKILL.md 28,185, ROUTER.md 26,012). A shared one-page step reference at 1–2 KB (~250–500 tokens) is two orders of magnitude cheaper than either alternative, but is a *new file* — the last resort under the frozen preference order. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:1]
    [SOURCE: AGENTS.md:1]

12. **`ROUTER.md` carries no plan-quality or review signal.** Its only quality pointer is an `ON_DEMAND` row reading "Deep-dive quality standards". `SKILL.md` mentions review only as `/speckit:complete` Step 11 behaviour — the chat path *points at* the command path rather than reproducing it. That makes the card, not the router, the cheapest carrier for any new check. [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:133]
    [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:221-226]

## Questions Answered

- **Q1** — Which checks exist only in the three command workflow files and are absent from the chat path, and which are already duplicated there. Answered by findings 1–7: six YAML check families, of which the file-shape family and the completion family are duplicated; the pre-implementation family, the numeric thresholds, review approval, checklist verification and `spec_no_clarification` are absent.

## Questions Remaining

- **Q2** — per-mechanism cost, breakage and cross-runtime / child-dispatch behaviour for all five mechanisms. Untouched; needs the hook path inspected.
- **Q3** — how Level 1 and trivial edits stay light, and the one-sentence opt-out.
- **Q4** — partially answered (findings 9–10 name the hole and the fix); not closed until the fix is checked against Levels 1–3 and against a dispatched child with no user present.
- **Q5** — per-turn token cost per mechanism and the single recommendation. Finding 11 supplies the first measurement only.

## Ruled Out

- **Reading the three YAMLs in full to diff them.** The plan YAML alone is 885 lines and its gates are front-loaded into a contiguous block; two targeted reads of the gate blocks plus a vocabulary grep produced the same inventory at a fraction of the budget. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:403-424]
- **Treating `speckit-resume-*.yaml` and the presentation `.txt` assets as comparison targets.** The topic froze the comparison to plan, implement and complete; `resume` is the continuity path, not a protection gate, and the presentations are display text. Deferred rather than excluded — if a mechanism later needs the resume path this must be reopened.

## Dead Ends

- **Searching `.skilled/` for the planning-gate check ids to find a second implementation.** No hits outside the YAMLs at any depth. This is a confirmed absence, not a thin search — do not re-run it as a way of finding a hidden enforcer.

## Edge Cases

- **Ambiguous input:** "the chat path" could mean AGENTS.md alone or the whole loaded set (AGENTS.md + SKILL.md + ROUTER.md + card + templates + validate.sh). Chose the whole loaded set, because the topic enumerates exactly that set as what a writing chat session loads. Deferred alternative: AGENTS.md-only reading, which would make the gap look larger than it is.
- **Contradictory evidence:** present and recorded, not resolved — finding 4. The command gate blocks on `[NEEDS CLARIFICATION]` while no chat-path template or validator produces or requires that marker. Per the run's no-operator instruction this is reported with both sides cited and no LOGIC-SYNC halt; the resolution hypothesis (the marker predates the current template set, or was always a human-only convention) is unverified.
- **Missing dependencies:** none blocking. `resource-map.md` is absent, so the coverage gate was skipped and source coverage is my own selection, not an audited map.
- **Partial success:** hooks were not inspected, so any hook-carried check is invisible to findings 1–7. Findings 3's "zero hits outside the YAMLs" covers non-hook code and docs only; a hook that greps for these ids at runtime would not appear in a static tree search. Status stays `complete` because Q1's inventory of the *documented* chat path is closed, and the hook question is explicitly Q2's.

## Sources Consulted

- `.skilled/commands/speckit/assets/speckit-plan.yaml` (403-424 gates, 431 circuit breaker, 440-442 confidence, 461-468 enforcement, 309 strict validation)
- `.skilled/commands/speckit/assets/speckit-implement.yaml` (20, 382-397, 444-447)
- `.skilled/commands/speckit/assets/speckit-complete.yaml` (492-530 gates, 561 evidence, 572-591 enforcement)
- `AGENTS.md` (54-61 confidence, 138-144 completion verification, 189 retry cap)
- `.skilled/skills/system-spec-kit/SKILL.md` (221-226)
- `.skilled/skills/system-spec-kit/ROUTER.md` (133)
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` (111-127, 139-144)
- `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` (42 rules)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh:19`

## Assessment

- New information ratio: 0.90
- Questions addressed: Q1, Q4 (partial)
- Questions answered: Q1

## Reflection

- **What worked and why:** reading the gate *blocks* rather than the workflow *steps*. The three YAMLs front-load gates into contiguous sections, so the entire protection surface is reachable in ~150 lines of the 3,159. The vocabulary grep ("gate|MUST|HALT|refuse|forbid|NEVER|hard") found the block boundaries without a full read; that worked because these files are written in enforcement prose, so their gate language is lexically distinctive.
- **What did not work and why:** the first registry dump failed twice — the JSON is a bare array, so `j.rules` was `undefined`, and then the key-check printed index strings. Root cause: assuming a wrapper object for a file `validate.sh` reads positionally. Fixed by testing `Array.isArray` first. Cost two calls that a one-line peek would have avoided.
- **What I would do differently:** pin exact line numbers before writing prose, not after. Three claims were written against estimated lines and had to be re-grepped to avoid citing a range that did not say what the finding claimed — the validator resolves a `[SOURCE:]` tag only for path and line existence, so an approximate line would have passed the gate while being wrong.

## Recommended Next Focus

**Q2 — per-mechanism cost, breakage and portability.** The specific question the inventory now makes askable: *which of the five mechanisms can express a check positioned before implementation and decided by a reader, and what does each one cost per turn?* Start with `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` and `.skilled/hooks/` to establish what a hook can actually inject at prompt time versus tool time, since mechanism 3's cost and mechanism 5's authority both depend on that and neither is yet evidenced. Second target: the seven runtime capability matrix, for whether a hook-injected step survives in a dispatched child.

The `spec_no_clarification` contradiction (finding 4) should not be resolved this iteration either — it needs a decision about whether the marker is still live, which is operator territory and has no operator on this run.
