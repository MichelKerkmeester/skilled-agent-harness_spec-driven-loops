---
title: "Research Synthesis: Goal unification, run 2 — verification of the packet-goal design (D1-D7)"
description: "Run-2 verdicts on the run-1 decision matrix: where this lineage agrees, corrects, or overturns, with resolving citations, the consolidated correction register, and the implementation-facing gaps it closed."
trigger_phrases:
  - "goal unification run 2"
  - "goal unification verification"
  - "goal decision matrix verdicts"
importance_tier: important
contextType: research
generated_by: "fanout lineage glm (iterations 11-15, cli-pi glm-5.3-flash)"
stop_reason: "maxIterationsReached"
---

# Research Synthesis: Goal unification, run 2 (fanout lineage `glm`, iterations 11-15)

> Scope: research only; this lineage's write surface was this directory. Baseline: the run-1 lineage's
> synthesis at `../lineages/deepseek/research.md` (iterations 1-10). Every claim carries a `file:line`
> citation that resolves in this repository as of 2026-09-11; design conclusions are marked **CLAIM**;
> unconfirmed items are **UNKNOWN**/**INFERRED** with what would confirm them. Iteration narratives:
> `iterations/iteration-011.md` … `iteration-015.md`; deltas: `deltas/iter-011.jsonl` … `iter-015.jsonl`;
> state: `deep-research-state.jsonl` (ledger note in `state-events.jsonl`).

---

## 1. Objective and method

Verify, refute, and deepen the run-1 decision matrix (D1-D7) before this packet builds: five iterations
per the charter's allocation rows 11-15 — the weakest-evidenced angle (it-011: A1, judged weakest because
run 1's decisive second pass there was declared scenario-analysis by its own author), then A5, A6+A7,
A8+A2, synthesis. Average `newInfoRatio` 0.60, non-monotonic (0.60 → 0.55 → 0.65 → 0.70 → 0.50): a
verification resurgence, then the synthesis dip. 27 corrections recorded across the four evidence
iterations' ledgers; **no chosen run-1 option was overturned** — one recommendation changed (D6), five
foundations were corrected (D1, D3, D4, D5, D7), one decision survived untouched (D2).

---

## 2. The ranked verdicts per decision (the deliverable)

Ranked by (degree of correction × verification confidence). **Run 2 overturns no chosen option.**

### 1. D6 — budget and truncation: **CORRECTED** (the only recommendation change)

Run 1 (deepseek it-008): O8-A — enforce 4000 in the TS validator, 3000 folded into "advice or retires";
the mechanism: a 4000-legal prompt "cannot be injected in full" (≈2,900-char prompt budget, compact-path
truncation). Run 2:

- **Recommendation O8-A → O8-B.** 036's real parent `goal.md` measures **3,732** characters (widest
  counting: after the frontmatter's closing `---` at `:36`, before `ANCHOR:log` at `:106`, newlines
  included) down to **3,393** (the design's refined extraction: anchors, scaffold comments, and H1
  removed) — **4000-legal under every counting variant** (headroom 268-607, 6.7-15.2%) and
  **3000-warm under every variant** (113-124%) — at `completion_pct: 5`
  (`[SOURCE: specs/system-speckit/033-system-speckit-v4/036-goal-unification/goal.md:28]`, `:56`).
  The packet is 5% complete and already at 93% of the error cap, with seven phases of binding rows and
  criteria still to write. A 4000-only rule gives this packet's own author no warning. The 010 precedent
  (slice 1,986 = 66% of 3,000, playbook:112) vs 036 (124%) is a measured growth trajectory.
- **Mechanism corrected.** The injected prompt ceiling is dynamic:
  `promptBudget = Math.max(MIN_PROMPT_BUDGET_CHARS, maxChars - buildBlock('').length)` at
  `[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:417]`, then
  `buildBlock(sanitizePromptText(goalPrompt, promptBudget))` and an early `return` when the full block
  fits (`:418-419`) — the compact fallback (`:421-430`; run 1's `:428`/`:432`) engages only when :419
  fails, which a legal prompt cannot cause. **INFERRED** (constituents read, sum estimated):
  |buildBlock('')| ≈ 890-925 (markers 33, status 14, `objective: `+576 = 587, `goal_prompt:` 12,
  last_check ≈ 45, usage ≈ 70, the directive line — **measured 132** at `:403` — closer 13, 9 newlines,
  goalId), hence **promptBudget ≈ 3,875-3,910**, not ≈2,900 (no 2900 arises anywhere; 4800−1900 = 2900
  was run 1 mixing the :343 *build-time* reserve into the *injection* path). What would confirm: one
  evaluation of `buildBlock('')` in a scratch import.
- **Constants and derivations: confirmed.** 4000/4000/4800 (`goal-core.cjs:60-62`), 1900/0.12/60/600
  (`:67-70`), objectiveBudget 1200 (`:343-344`), preview 576 (`:368-373`, applied at `:385-386`), the
  plugin's duplicated copies (`opencode-goal.js:29-31`, `:45-48` — the numeric policy lives twice; the
  drift risk R3 is wider than the two renderers).
- **The silent truncation is current state, not a risk.** 036's objective+criteria = **1,182** chars
  (161 + 1,021): 98.5% of the 1,200 skeleton section (fits by 18) but 205% of the 576 injected preview —
  49% injected, ≥606 characters (four of seven criteria) silently lost if the set-string carries the full
  copy (`[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:385-386]`, `:343-344`; the 036:118 log row
  records the paste mechanism's live defect: "terminal wrap artifacts; this file is the source").
- **Enforcement, extended.** 036's criterion #2 (`036/goal.md:96`) commissions **two** restored rules —
  the 4000 durable budget *and* binding-row existence — the second of which run 1 never recorded. Its
  precondition holds today: all seven binding-table children's `goal.md` exist (3,350-4,183 bytes;
  001's 4,183 is a *child*, so the parents-only cap correctly does not bite). Units: the restored rule
  says "characters" (`036/goal.md:96`); the 010 precedent speaks "bytes" (`010/spec.md:61`) — identical
  here (6,695 = 6,695, ASCII-verified under `LC_ALL=C` and `en_US.UTF-8`), a real choice for the rule.

### 2. D3 — the strip: **AGREE, with corrections**

O2-B (the marker slice, anchors resolved) survives. Corrections: (a) the **payload wording** — the
trigger says "anything above the log" (`playbook.md:73-75`) while the mandated payload says "the full
text of this file" (`tmpl:56-59`, `playbook.md:74-75`); taken literally that ships the frontmatter and
the VOLATILE log the same rules exclude (`tmpl:104-106`, `playbook.md:79`). **CLAIM:** the durable-slice
reading is right, witnessed by tmpl:104-106, tmpl:80-81 and playbook:103-104 — and 036's own
hand-rendered copy already words it correctly: "resend the durable slice in chat, frontmatter excluded"
(`[SOURCE: .../036-goal-unification/goal.md:62]`). Criterion #1 (`036/goal.md:95`) — tmpl, playbook and
`spec-kit-docs.json` must "agree" — is measurably unmet today: the template carries no number, the
playbook's only 3,000 sits inside the worked example (`playbook.md:112` — it-008's `:57` anchor shifted;
:57 *promises* a reporting rule the deleted checker no longer keeps), and `spec-kit-docs.json` names the
goal docs but contains zero "4000". Fixture behavior: all four anchors present with closers
(`036/goal.md:42/65, 69/88, 92/102, 106/127`); no literal `IF` survives (029:91's renderer, corroborated
by artifact); the DURABLE fence is absent — 010's phase mode "scaffolds child goals … but not the
parent" (`[SOURCE: .../036-goal-unification/goal.md:126]`), the hand-render being the drift signature;
`ANCHOR:log` present, so it-010's missing-anchor fallback stays hypothetical on this fixture.

### 3. D4 — resend: **AGREE, with corrections**

O4-A (edge trigger on the durable-slice hash, packet-scoped dedup) survives. 029's exclusions are the
boundary, not an obstacle: "A validator rule — nothing can check what an operator pasted" and "the rule
is agent behavior, not tooling" (`[SOURCE: .../029-goal-operator-resync-rule/spec.md:71-72]`), whose own
description states the trigger as "whenever its durable slice changes" (`:3`) — 029 excluded
paste-verification, not change-detection; the design mechanizes only detection. New: criterion #5
(`036/goal.md:99`) says "plan, implement, complete, **resume and save** update the parent" while today's
ladder makes resume read-only (`[SOURCE: .opencode/commands/speckit/resume.md:4]` — no `opencode_goal`)
— a conflict the packet's own rule catches: "Name a conflict rather than resolving it silently"
(`[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:77-78]`, mirrored 036:85-86).
The implementation must widen the whitelist or amend the criterion — named, not silent.

### 4. D1 — binding: **AGREE, grounding corrected**

O1-B (explicit per-session pointer, never inferred) survives. Corrections: the carrier claim —
"written by the *stop* path" — is half the story: the stop hook writes it (`session-stop.ts:518-521`,
`:528-534`) **and** the "lifecycle prompt/stop hooks persist lastSpecFolder" per the codex adapter's own
comment (`[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs:56-58]`)
plus the stop source's "another writer" remark (`session-stop.ts:505-509`); the second writer is
**INFERRED** to be `user-prompt-submit.ts` (present in the same directory; the confirming grep is the
one call it-011 did not spend at its 12-call cap). All readers fail open to null
(`completion-evidence.ts:39-50`, `completion-evidence-stop.cjs:61-72`, `post-compaction.cjs:81-95`), and
the prime hint already ships the "suggestion the operator confirms" pattern
(`[SOURCE: .opencode/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js:135-138]`).
The 'unbound' precedent: **it-009's "the CLI prints" is refuted** — zero `unbound` in `goal-core.cjs`/
`bin/goal.cjs`; the precedent lives at `[SOURCE: specs/hooks/009-goal-isolation/spec.md:152]` (REQ-012:
"a new or forked id starts **unbound** unless an explicit clone action is specified") — it-010's open
gap #3 resolves: adoption is documentation continuity, not code compatibility. And the pointer
vocabulary already exists: `packet_pointer` in the goal's own continuity block
(`[SOURCE: .../036-goal-unification/goal.md:14]`) — the record-side pointer can ratify-adopt it.
Constraint anchors corrected: the ADR's cut-over/never-guess/opaque/composition/no-fallback lines are
`decision-record.md:65/72/73/85/87` (run 1's :36/:41/:43/:47/:51 land in the anchor region), the
one-shared-resolver mitigation is `:129`, the decision sentence `:83`.

### 5. D7 — isolation × authority: **AGREE, grounding corrected and strengthened**

The chosen split (shared directive; per-session selection/liveness/telemetry/locks) survives
reconciliation. Strengthened: 009's own Critical Dependency — "the management command path must acquire
the same native session identity as the injection hook" (`[SOURCE: specs/hooks/009-goal-isolation/spec.md:54]`)
— and the ADR's recorded mitigation "One shared resolver and an end-to-end set-then-inject canary test"
(`[SOURCE: specs/hooks/009-goal-isolation/decision-record.md:129]`) pre-derive the bind-resolver design
and its acceptance test; the failure enumeration run 1 cited at `:77` lives at `:81` (`:77` is the
mechanism); `:48` and `:79` resolve exactly; the uncited `:50` adds "never fall back … during prompt
injection". 029's exclusions bound the design (detection yes, paste-verification no — see D4). The
auto-write surface (log + continuity bookkeeping) is *new* tooling: today only the scaffold ever wrote
the continuity block (`tmpl:16` — 036's own copy says `claude-code`, `036/goal.md:16`), and 029 deferred
exactly that. Caveat recorded: 009's status is "In progress — implementation verified; **delivery
freshness pending**" (`[SOURCE: specs/hooks/009-goal-isolation/spec.md:64]`).

### 6. D5 — runtimes: **AGREE in substance; the citation layer corrected**

16/16 feasibility claims verified, 0 overturned. Corrections: the hub's delivery matrix lives at
`README.md:66-71` (run 1's :96-:103 are the KEY FILES rows; mtimes Sep 6/Aug 21/Aug 15 prove the repo
did not drift — the citations did); "does not import this core" is `README.md:25`, not `:31`; the
Claude/Codex "by-design" rows are `README.md:69-70` and a Devin row run 1 never mentioned sits at
`:71`; the plugin's identity extraction accepts **three** spellings
(`[SOURCE: .opencode/plugins/opencode-goal.js:353-356]`) behind its own fail-closed
`requireSessionID` (`:333-339`), and its `:281` is the normalized option, not a context read; the
Devin hook enumeration completes to four events (SessionStart, UserPromptSubmit, **Stop, SessionEnd**,
`.devin/hooks.v1.json`); 44 Claude memory goal files, no `/goal` command, no goal hook in
`.claude/hooks/`, the Codex goals SQLite + `prompts/goal_opencode.md` — all confirmed. The pi
host-cap UNKNOWN **stands, now as a recorded negative**: the installed runtime documents the
`input → transform` mechanism and a 50KB/2,000-line truncation rule, but that rule governs *tool
output* (`/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:905-955`, `:2170-2192`) — no documented cap on injected prompt text. The design counsel is
unchanged: treat the core's 4800 as the only enforced ceiling; and it-014 found the landing pad for the
slice→prompt projection already in the core: `goal.goalPrompt || goal.objective` at
`[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:391]`.

### 7. D2 — store fate: **AGREE, untouched**

O3-B (demote the store to a per-session index + telemetry; the directive read from `goal.md`) survives
without contest. +1 migration fact: legacy adoption is conditional —
`canAdoptLegacyScope = resolve(stateDir) === resolve(workspaceStateDir)` (`[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:195]`)
— so a store redirected via `OPENCODE_GOAL_STATE_DIR` (`:42`; the ADR's `MK_GOAL_STATE_DIR` spelling at
`decision-record.md:71` vs the code's at `goal-core.cjs:42-43` — a documentation drift it-011 added to
R9's class) never adopts legacy scoped keys. The record-side pointer (it-009 F2) can adopt the
frontmatter's existing `packet_pointer` (036:14) at bind time rather than inventing a second pointer
vocabulary — the naming-collision caution (run 1's R10, `thin-continuity-record.ts:46/:211`) thereby
loses most of its force: the *file-side* vocabulary already exists and is continuity's own.

---

## 3. The consolidated correction register (27 corrections, 4 clusters + 3 mechanism + 2 precedent)

| Cluster | Corrections | Resolving citations |
|---|---|---|
| ADR-001 lines (it-011) | 5 (:36/:41/:43/:47/:51 → :65/:72/:73/:85/:87; decision :83; mitigation :129; risk :131) | `specs/hooks/009-goal-isolation/decision-record.md` |
| 009 problem + template + playbook anchors (it-013) | 10 (`:77`→:81; tmpl: :41/:48 — one right one wrong on the *same* cited line — :65→:66, :99→:101, :16→:12-27, :21→:22, :38→:34-37, :39→:36-37; playbook:57→:112) | `specs/hooks/009-goal-isolation/spec.md`; `goal.md.tmpl`; `playbook.md` |
| README + plugin anchors (it-012) | 5 (`:96`→:66, `:99`→:67, `:102-103`→:69-70, `:31`→:25; plugin `:334`→:333-339/:353-356, `:281`→option field) | `.opencode/hooks/goal/README.md`; `.opencode/plugins/opencode-goal.js` |
| Carrier + detector + budget mechanism (it-011/it-014) | 4 (two-writer carrier; `ambiguous_transcript` at :103; promptBudget :428→:417-418; compact :432→:421-430) | `session-stop.ts`; `completion-evidence-stop.cjs:56-58`; `goal-core.cjs` |
| Recommendation + numbers | 3 (O8-A→O8-B; ≈2,900→≈3,875-3,910 INFERRED; 3,000-anchor :57→:112) | this document, D6 |
| Completions run 1 lacked | 2 (Devin: 4 hook events; plugin: 3-spelling identity) | `.devin/hooks.v1.json`; `opencode-goal.js:353-356` |

Confirmed-unchanged (sample): the composite scope key excluding the packet (`goal-core.cjs:191-193`),
fail-closed identity (`:177-179`), the plugin caps (`:29-31`), 009's REQ-001/006/010 + SC-004
(`009/spec.md:136/141/150/164`), the whitelist ladder (`plan.md:4`…`resume.md:4`), the 576/1200/4800
numbers, the objective-copy semantics (`playbook.md:100-106`), 036's criterion #2 precondition (7/7
children's goal.md exist).

## 4. New facts the implementation packet must own

1. **Criterion #1 fails three ways today** — boundary wording (tmpl:56-59 / playbook:74-75 vs 036:62),
   budget number (3,000 at playbook:112 vs 4,000 at 036:56, silent in `spec-kit-docs.json`), units
   (bytes, 010:61 vs characters, 036:96).
2. **Criterion #5 vs the read-only resume whitelist** (`036/goal.md:99` vs `resume.md:4`) — widen or
   amend; it-013's own rule (tmpl:77-78) demands it be named.
3. **A second restored validator rule** — binding-row existence (036:96); precondition currently green.
4. **The 010 phase-parent scaffold gap** — "Phase mode scaffolds child goals … but not the parent"
   (036:126); 036 was hand-rendered; the missing DURABLE fence is the drift signature.
5. **The warning tier is load-bearing** — 036's parent: 3,393-3,732 chars at `completion_pct: 5`.
6. **The 576-preview truncation is live** — 1,182 vs 576 on this packet (49% injected).
7. **The promptBudget is dynamic** — ≈3,875-3,910 (INFERRED; confirm by evaluating `buildBlock('')`).
8. **One shared resolver + set-then-inject canary** — prescribed, not invented: `decision-record.md:129`,
   `009/spec.md:54`.
9. **The 029 boundary** — detection mechanized; paste-verification stays excluded (`029:71-72`); the
   criterion-1 wording ("the playbook binds the agent regardless" notwithstanding, `:116`) inherits the
   pre-029 stale-packet risk for every goal.md that predates 036.
10. **The pointer adoption path** — the record-side bind can ratify-adopt the frontmatter's
    `packet_pointer` (036:14) instead of minting a second vocabulary.
11. **The redirected-store fact** — `goal-core.cjs:195`: legacy adoption only when the store *is* the
    workspace's; redirected stores never adopt.
12. **009 is freshness-pending** (`009/spec.md:64`) — the contract being extended still owes its own
    delivery freshness; the implementation packet's verification gate (036:101: hook `node --test` +
    plugin tests + `validate.sh --strict`) is where that debt comes due.

## 5. Open gaps: status after run 2

| it-010 gap | Status |
|---|---|
| G1 host injection caps | **stands**, now a recorded negative (pi: mechanism documented, no char cap; `extensions.md:905-955`, `:2170-2192`) |
| G2 plugin import seam | **advanced, unresolved** — the duplication of the budget policy (`opencode-goal.js:45-48` vs `goal-core.cjs:67-70`) makes the shared module more valuable; the `:391` fallback is the ready seam; the import itself remains **UNKNOWN** (wouldConfirm: the import attempt in the plugin's ESM runtime) |
| G3 'unbound' vocabulary | **closed** — the precedent is 009's REQ-012 (`spec.md:152`), not the CLI; adoption is documentation continuity |
| G4 ratification UX | **closed in principle** — the mechanism is the template's naming rule (tmpl:77-78); the command-side UX remains a design pass |
| G5 036's goal.md vs 4000 | **closed** — 3,393-3,732, 4000-legal, 3000-warm, at 5% completion |

## 6. Confirmed vs inferred vs unknown

**Confirmed this lineage:** every correction-register citation; the 036 measurement (6,695 = 6,695
chars/bytes, durable slice 3,393-3,732; objective+criteria 1,182; 7/7 children's goal.md, 3,350-4,183
bytes); the :417-419 clamp and :419 early-return; :385-386's 576 clamp; :343-344's 1,200; :391's
fallback; the anchor/IF/fence/pointer/zero-fingerprint facts; the four-event Devin registration; the
README delivery matrix at :66-71; 029's exclusions; the 010↔009 zero-cross-reference.

**INFERRED (what would confirm):** the |buildBlock('')| ≈3,875-3,910 prompt ceiling (evaluate it once);
the second `lastSpecFolder` writer = `user-prompt-submit.ts` (grep its assignments); the plugin's
`ctx.directory` read site (the :281 line is the normalized option); |overhead| constituents' variability
(goalId/verdict lengths).

**UNKNOWN (unchanged or newly recorded):** host injection caps for pi/cursor/devin/claude/codex (pi:
recorded negative; the others unsearched); whether the core honors the ADR's `MK_GOAL_*` spellings; the
exact "malformed legacy" CLI output wording (it-011's probe slipped its path); the content of
`references/validation/validation-rules.md` (it-014's probe used the wrong sibling dir; it-008's "no
goal" negative stands unre-verified); whether `unbound` occurs in the plugin/pi adapter (the it-011
grep's head cut).

## 7. What this lineage did not do

Research only: no code, template, or validator edits; no writes outside
`research/lineages/glm/`; no `generate-context.js`, no `validate.sh`, no git writes (per the invocation's
containment rule); the gateway note stands (`state-events.jsonl`, `initialized` event). Evidence-call
discipline: 12 (it-011, at the cap) / 9 (it-012) / 4 (it-013) / 8 (it-014) / 0 (it-015, `thought`) — 33
total, each iteration inside the skill's 8-11 target or its 12 ceiling. The successor surface is the
implementation packet: the correction register (§3), the criterion gaps (§4.1-4.3), and the open seam
(§5 G2) are its entry points.
