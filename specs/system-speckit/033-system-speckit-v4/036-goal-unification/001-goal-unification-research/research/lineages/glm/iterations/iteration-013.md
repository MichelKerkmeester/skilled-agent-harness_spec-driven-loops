# Iteration 13: A6 + A7 — Reconcile isolation (009) with auto-update authority (D7)

- **Lineage:** glm (cli-pi, glm-5.3-flash) - Program iteration 13 of 15, run 3 of 5 (charter allocation row 13)
- **Question:** Does a packet-shared `goal.md` re-introduce what 009-goal-isolation removed, who may write what, and does the shared-file design contradict 029's deliberate exclusions — or complete them?

## Actions Taken

1. Read the 009 problem statement, dependency, and negative control at their true lines (it-011 shifted the ADR; this iteration shifted the spec).
2. Read 029's scope/risks/requirements — the exclusion rationale, not just the rule.
3. Verified all four speckit command whitelists.
4. Read the goal template in full (one read settles every `goal.md.tmpl` citation made by three run-1 iterations).
5. Read 010's problem/purpose and grepped it for any reference to 009.

4 evidence calls (3 bash, 1 read) — well inside the 8-11 target; the reconciliations below are flagged where they are claims.

## Findings

### F1. 009's problem statement: two of three citations resolve, one shifts, and two uncited lines carry the reconciliation

it-006's `spec.md:48` — "the last session to set a goal replaces the prior session's record and every Pi input hook injects that replacement" — resolves **exactly** (`[SOURCE: specs/hooks/009-goal-isolation/spec.md:48]`). Its `:79` (GOAL_A→GOAL_B control, GOAL_A archived `status=active`) — **exact** (`[SOURCE: .../spec.md:79]`). Its `:77` for "any session can increment, pause, complete, clear, or verify the shared record" — shifted: `:77` is the mechanism ("`setGoal()` archives the existing record and replaces it...; `readGoalRecord()` has no session parameter; and the Pi adapter calls that unscoped read on `input`, `session_start`, and `turn_end`"), while the enumeration it quoted lives at **:81** ("unrelated sessions can receive another session's objective, increment its counters, verify it, pause it, complete it, or clear it") (`[SOURCE: .../spec.md:77]`, `[SOURCE: .../spec.md:81]`). Two uncited lines matter more: `:50` — "it must **never fall back to the legacy singleton during prompt injection**" — and `:54`, the packet's **Critical Dependency**: "the management command path must acquire the same native session identity as the injection hook. Pi can do this...; Cursor... must remain unsupported until it can" (`[SOURCE: .../spec.md:50]`, `[SOURCE: .../spec.md:54]`). The Cursor "unsupported" clause is the primary source for run 1's cursor degradation — stronger than the README row it-012 located — and `:54` restates ADR-001's cut-over-together rule (corrected line `decision-record.md:65`) as a dependency, not a preference. Also: 009's status today is "**In progress — implementation verified; delivery freshness pending**" (`[SOURCE: .../spec.md:64]`) — the contract this design builds on is itself freshness-pending; honest caveat for the risk register.

### F2. 029 did not omit tooling by oversight — it excluded it, with a reason, and its own description already speaks in durable-slice terms

The rule's delivery shape was prose only, deliberately: In Scope = "An 'Operator copy' paragraph inside the goal template's directive anchor" + "A playbook section on keeping the operator's copy current, with the child-to-parent amendment rule"; Out of Scope = "A validator rule - **nothing can check what an operator pasted**" and "Runtime goal surfaces - **the rule is agent behavior, not tooling**" (`[SOURCE: specs/system-speckit/033-system-speckit-v4/029-goal-operator-resync-rule/spec.md:66-72]`). And the packet's own frontmatter description states the trigger exactly as the design needs it: "to resend the parent goal.md in chat **whenever its durable slice changes**, so the operator's session objective never drifts from the file" (`[SOURCE: .../029-.../spec.md:3]`). Run 1 (it-007 F1) recorded the "agent behavior, not tooling" phrase as an observation; the deeper reading: 029's rationale excludes checking the **paste** (which indeed nothing can check — the operator's hands, playbook:105-106) and does *not* exclude detecting the **change**. The unified design mechanizes only the detection. No contradiction — the exclusions are precisely what the design must not overstep: it may not promise paste-verification, and 029's REQ-001 (the rendered template must contain "Operator copy", `[SOURCE: .../029-.../spec.md:91]`) is the prose artifact the design extends, not replaces.

### F3. The whitelist ladder: verified exactly, and it already encodes the read/write authority split

`plan.md:4`, `implement.md:4`, `complete.md:4` = `Read, Write, Edit, Bash, Grep, Glob, Task, opencode_goal, opencode_goal_status`; `resume.md:4` = the same list **without** `opencode_goal` (`[SOURCE: .opencode/commands/speckit/plan.md:4]`, `[SOURCE: .opencode/commands/speckit/implement.md:4]`, `[SOURCE: .opencode/commands/speckit/complete.md:4]`, `[SOURCE: .opencode/commands/speckit/resume.md:4]`). it-007 F4's citations resolve exactly. Resume is already a read-only goal surface; the mutation ladder (which commands may set) precedes this design.

### F4. The template: run 1's it-007 citations were precise; its it-002 citations were not — and two uncited lines are the design

Every template citation now verifiable against the file:

| Run-1 claim (cited) | Verdict | Actual |
|---|---|---|
| it-007: "changing a frozen decision 'is an amendment'" (`:48`) | **exact** | `:48` "Frozen choices. Changing one is an amendment." |
| it-007: operator-copy heading (`:54`), resend rule (`:58`), child→parent (`:60`) | **exact** | `:54` "### Operator copy"; `:56-59` the hold/judge/resend rule; `:60-61` the amendment rule |
| it-006: binding "authoritative for its phase" (`:71`) | **exact** | `:70-71` "Each is authoritative for its phase and binds as if written here." |
| it-002: `ANCHOR:directive` (`:48`) | **wrong** | `:41` |
| it-002: `ANCHOR:log` (`:99`) | **wrong** | `:101` (`:99` is a `---`) |
| it-002: `IF level:phase` (`:65`) | **off by one** | `:66` (`:85` closes it) |
| it-002: the continuity block (`:16`) | **inside the block** | block is `:12-27` (`_memory:` at `:12`, `continuity:` at `:13`); `:16` is `last_updated_by: "scaffold"` |
| it-004/it-008: zero fingerprint (`:21`) | **adjacent** | `:21` is `session_dedup:`; the `sha256:000…0` value is `:22` |
| it-002/it-006/it-008: "Everything above the log is DURABLE" (`:38`) | **shifted** | `:34-37` (the DURABLE blockquote); `:38` is blank |
| it-008: "truncated objective loses its tail" (`:39`) | **shifted** | `:36-37`, same blockquote |

Uncited lines that do design work: **`:77-78`** — "Precedence. Decisions above outrank child detail. Child detail outranks any summary of it. **Name a conflict rather than resolving it silently.**" — this *is* the ratification principle, already scaffolded: a child change neither overwrites the parent nor asks; it names the difference. And **`:104-106`** — "Everything below [the log] is VOLATILE. It is not part of the directive, it is not copied into the objective, and it is expected to grow." — the VOLATILE half of the durable/volatile split that three run-1 iterations cited only the DURABLE half of. Also `:80-81`: "Stop. Only the criteria below decide done. **An evaluator sees the objective string, not these files.**" (`[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:12-27]`, `:34-37`, `:41`, `:48`, `:54-61`, `:66`, `:70-71`, `:77-78`, `:80-81`, `:85`, `:101`, `:104-106`).

### F5. The payload tension: the trigger says "anything above the log", the payload says "the full text of this file" — taken literally they disagree

The playbook: "1. Whenever anything above the log changes (the objective, a decision, the binding table, a criterion), resend **the full text of the parent `goal.md`** in chat, unprompted, so the operator can paste it over the session objective" (`[SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:73-75]`), and the template: "resend the full text of this file in chat" (`[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:56-59]`). Rule 3 of the same list: "Log entries never trigger a resend; the log is not part of the objective" (`[SOURCE: .../playbook.md:79]`). Read literally, "full text of this file" ships the frontmatter (`_memory.continuity`, `:12-27`) and the VOLATILE log (`:104-106`) — the very stuff rule 3 and the DURABLE/VOLATILE fence say must not steer. Run 1 (it-002 F4, it-010 F1) assigned the resend the **durable slice** without noting that this *reinterprets* the primary source's payload wording. **CLAIM (design):** the slice-only reading is correct, witnessed three ways — the log is "not copied into the objective" (`tmpl:104-106`) and what the operator pastes *is* what the runtime judges ("An evaluator sees the objective string, not these files", `tmpl:80-81`; "a string the runtime holds for the current session and judges completion against", playbook:103-104) — and 010's purpose is that "the string an operator sets stays small and stays true" (`[SOURCE: specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/spec.md:61-65]`; the 15,028-byte precedent at `:61` — exact). Implementation consequence: the implementing packet must either reword the playbook's "full text of this file" to "the full durable slice" or the very first implementation will faithfully ship the log. Run 1's D3/D4 verdicts **stand**; this is the under-argued seam they crossed.

### F6. 010 and 009 never reference each other — the reconciliation this charter demands has no inherited precedent

010's problem/purpose (the 15,028-byte story; "Give a packet a short durable directive… so the string an operator sets stays small" — `[SOURCE: .../010-goal-file-addon/spec.md:61]`, `:65`) contains **zero** references to 009, isolation, the singleton, or the goal core (grep: no hits). 010's continuity stamps it at 2026-08-30 (`[SOURCE: .../010-.../spec.md:16-17]`), twenty days after 009's 2026-08-10 creation (`009/spec.md:65`). The two halves of today's design — the shared durable file and the session-isolated goal core — were authored on different tracks (system-speckit vs hooks) without cross-reference. **CLAIM:** run 1's it-006 F5 reconciliation (shared directive safe / shared selection+liveness not) is therefore not a Reading of prior art — it is the first reconciliation of these two packets, and it-011's corrected ADR lines are its missing anchor.

### F7. The reconciliation, constraint by constraint (the it-13 verdict)

| 009/ADR requirement (true citation) | Shared goal.md consequence | Verdict |
|---|---|---|
| REQ-001: no identity → no injection; mutations write nothing (`009/spec.md:136`) | Reading goal.md for chat needs no identity; *injection* still requires the store's fail-closed scope (`goal-core.cjs:177`) | no conflict — the "read for chat, inject only scoped" split it-006 F4 proposed is requirement-shaped |
| REQ-002/003: concurrent goals; mutations leave session B byte-equivalent (`:137-138`) | These govern the **store**; the shared file is content, mutated by its working session — the residual concurrent-edit risk (it-006 F6.1) lives *outside* 009's contract; the store's locks (`goal-core.cjs:524`) never covered it | no regression; the file's conflict layer is git + the template's naming rule (`tmpl:77-78`) |
| REQ-005: management bound to the current session, no repo-global fallback (`:140`) | The bind resolver writes the pointer into the **per-session record**; the packet path never becomes the key | satisfied by construction (it-009 F2 record) |
| REQ-006 + SC-004: legacy never auto-claimed (`:141`, `:164`; ADR `:87`) | Auto-update touching the *log and continuity bookkeeping* is not auto-claiming *state*; adoption remains an explicit bind | satisfied; the design's "auto" and 009's "never automatically" operate on disjoint surfaces |
| ADR: management and injection cut over together (`:65`) + the Critical Dependency (`:54`) + the recorded mitigation "one shared resolver and an end-to-end set-then-inject canary test" (`:129`) | The bind (write) and the read must derive the key identically — the strongest constraint the design inherits, and it ships with its own acceptance test | satisfied by the single-resolver requirement it-006 F3 named, now anchored at three agreed lines |
| 029: the rule is agent behavior; nothing checks the paste (`:71-72`) | The design mechanizes change-detection (the slice hash) and *must not* promise paste-verification | consistent by construction; 029's exclusions bound the design, they do not forbid it |

**Authority ladder (restated, every rung citing its enforcement point):** (1) the durable slice — edited by the working session, command-mediated at set time (whitelists, F3), amendments applied parent-first then resent (`playbook:76-77`, `tmpl:60-61`), conflicts named not silently resolved (`tmpl:77-78`); (2) the log + continuity bookkeeping — the working agent, unprompted (`playbook:70-71` "the agent working the packet owns the resync"), the only Auto-Write surface, and *new* tooling (today `last_updated_by: "scaffold"` once, `tmpl:16`; it-007 F3 "validated but never maintained" — nothing maintains it today, and 029 deferred exactly this); (3) selection/liveness/telemetry/locks — the 009 store, untouched in kind (`009/spec.md:136-143`; `goal-core.cjs:174-208`). Run 1's D7 chosen split (it-006 F5, it-007 O7-A) **survives reconciliation**; what changes is its grounding: three of its four run-1 citation pillars were shifted (ADR, here F1; 009 problem, here F1) and its strongest witness — 029's exclusion rationale — was uncited.

## What worked / what failed / ruled out

- **Worked:** reading 029's *scope* rather than its requirement — the exclusions carry the design's boundary conditions; reading the template whole — one read either convicted or acquitted nine run-1 citations.
- **Failed:** nothing blocked; the payload-tension finding (F5) requiredno extra evidence — the two contradictory quotations were already in run 1's own(delta) corpus, unmatched until side by side.
- **Ruled out:** (a) *that the design contradicts 029's "not tooling" exclusion* — the exclusion addresses paste-verification and runtime goal surfaces as 029 scoped them; detection-of-change is outside both exclusions; (b) *that a shared goal.md re-opens 009's REQ-002/003* — those requirements govern the store, and the file's concurrent-edit residual was never in 009's contract.

## Assessment

- `newInfoRatio`: 0.65 — genuinely new: 029's exclusion rationale as the design boundary, its durable-slice trigger vocabulary in the packet description, the 010↔009 zero-cross-reference, the "full text of this file" vs durable-slice payload tension with three resolving witnesses, the template's precedence/naming rule as the pre-existing ratification principle, the 009 `:50`/`:54`/`:81`-shift corrections, and nine re-anchored template citations; the reconciliation verdict itself confirms run 1's D7 in substance.
- Convergence telemetry: 0.65 >> 0.05 — continuing to the cap.
- Confidence: high on F1-F4, F6 (read directly); F5's resolution and F7's ladder are design claims, flagged as such with their witnesses.

## Recommended Next Focus

Iteration 14 (A8+A2): measure packet 036's real goal.md against the 4000/3000 budgets and the A2 extractor's expectations — the last unresolved quantity in run 1's synthesis (its own open gap: "The real size of packet 036's parent goal.md against the 4000 budget").
