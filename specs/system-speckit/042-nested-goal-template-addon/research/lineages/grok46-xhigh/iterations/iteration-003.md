# Iteration 3: Binding, stop-gate asymmetry, drift and size cap

## Focus

Parent-to-child `goal.md` references are a prompt convention, not a dereference mechanism. Decide wording, precedence, validation, whether AC_CLOSURE can be the packet-level stop check, and how to split durable directive from volatile log given packet 033's 15028-byte three-phase file.

## Actions Taken

1. Confirmed `goal-core.cjs` `readFileSync`/`existsSync` touch only state JSON, git/.opencode roots, and legacy paths — never paths parsed from the objective string.
2. Re-read 033 `goal.md` structure (objective, decisions, three-phase map, progress log) and measured 15028 bytes / 204 lines.
3. Read `check-ac-closure.sh` activation (Level ≥ 2, cutoff, completion-claim detection) and `acceptance-criteria.md.tmpl` closure statement.
4. Cross-checked phase-parent lean-trio (no AC at parent) against AC_CLOSURE's numeric-level skip below 2.
5. Derived wording, precedence, validators, and a parent size cap from those facts plus iteration 2's 4000-char runtime cap.

## Findings

### F12. Nothing dereferences a path inside a goal string

`goal-core.cjs` filesystem reads are scope/state/legacy only (`.git`, `.opencode/skills`, state JSON). No parser extracts `specs/.../goal.md` from `objective` or `goalPrompt`. OpenCode plugin injection renders the stored strings into the system prompt; the working agent may *choose* to Read a path if the string names one. The Stop-hook evaluator (if Claude's product feature works as the operator described) and OpenCode's heuristic verifier both see **only the stored objective/evidence**, not child files. [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:132] [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:625-675] [SOURCE: file:.opencode/hooks/goal/README.md:33-37]

**Binding is a prompt convention.** Reliability comes from (1) wording the agent cannot miss, (2) a validator that the files exist **in the packet**, and (3) keeping the frozen/injected string self-contained for stop.

### F13. Required wording and precedence (put these in the template, copy a subset into the set string)

Template durable section (parent `goal.md`) should contain this block verbatim:

```text
BINDING
- This file is the session objective. Child files named below are procedure and local detail only.
- Read every listed child `goal.md` before acting on that phase.
- PRECEDENCE: when a child file conflicts with this parent, the parent DECISIONS and COMPLETION CRITERIA win. Do not re-litigate parent decisions from child prose.
- STOP: treat only the COMPLETION CRITERIA in this parent file as the stop condition. Child progress logs are not stop criteria.
```

The **set string** (what `opencode_goal` / native Goal actually stores) should be a pointer, not the file:

```text
Execute the parent goal file at specs/<track>/<packet>/goal.md.
Follow its BINDING and PRECEDENCE rules. Stop only when that file's COMPLETION CRITERIA are all met.
Do not treat child goal.md files as stop conditions.
```

That set string is ~200 characters, stable across phase additions, and fits every 4000-char cap. Child paths live **in the file**, which the working agent can Read; they do not need to live in the frozen string.

If Claude's Stop hook truly never re-reads the file, the COMPLETION CRITERIA must also be **copied into the set string** (or the hook will evaluate only the pointer). That is the stop-gate asymmetry. Recommendation: put 3–7 checkable bullets in both the parent file and the set string; keep child lists out of the set string.

### F14. Packet validation that makes the convention reliable

Add a **present-file** validator (like AC_CLOSURE: silent when `goal.md` is absent; error when present and malformed). Suggested checks:

| Check | Applies | Failure |
|-------|---------|---------|
| Durable vs log sections exist (named headings) | any present `goal.md` | warn/error under `--strict` |
| Parent BINDING block present on phase-parent | phase-parent with `goal.md` | error |
| Each listed child path exists, is a `goal.md`, and stays inside the packet tree | phase-parent | error |
| Parent durable section (excluding `## Progress` / log) ≤ cap (see F16) | phase-parent | error |
| Child `goal.md` does not contain a DECISIONS table that contradicts parent IDs | optional/warn | warn |
| Set-string is not stored in the file (no requirement) | n/a | n/a |

This is **not** a runtime dereference. It is packet hygiene so the convention does not rot.

Do not put this in `requiredAddonDocs`. Mirror AC's optional-present pattern but keep `goal.md` on `lazyAddonDocs` (iteration 1): absence is silent; presence is gated.

### F15. AC_CLOSURE cannot be the runtime stop check; it can be the L2+ packet-close check

`AC_CLOSURE` (`check-ac-closure.sh`):

- Default-on ERROR for Levels whose numeric level is ≥ 2
- Inactive below Level 2 (`level_num -lt 2` → pass with "not active below Level 2")
- Phase-parent public level is `phase`; `_acc_numeric_level("phase")` strips to empty → defaults to 1 → **gate off**
- Grandfathered by `Created` date vs `SPECKIT_AC_CLOSURE_CUTOFF` (default 2026-08-30)
- Fires when the packet **claims completion** (`spec.md` / `implementation-summary.md` Status cell is complete/done/…) with unmet AC rows
- Reads `acceptance-criteria.md`, not any goal string
- Waiver requires a real ADR in `decision-record.md`

[SOURCE: file:.opencode/skills/system-spec-kit/scripts/rules/check-ac-closure.sh:9-14] [SOURCE: file:.opencode/skills/system-spec-kit/scripts/rules/check-ac-closure.sh:221-224] [SOURCE: file:.opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md:503-504] [SOURCE: file:.opencode/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:34-36]

Phase-parent lean trio **forbids** `acceptance-criteria.md` at the parent. [SOURCE: file:.opencode/skills/system-spec-kit/references/structure/phase-definitions.md:97-99]

**Decision:**

- Runtime stop (OpenCode idle verifier / possible Claude Stop hook / Cursor has no stop): use parent COMPLETION CRITERIA copied into the short set string. AC_CLOSURE never runs at session stop.
- Packet close (L2+ children, post-cutoff): AC_CLOSURE **is** the right packet-level gate. Nested-goal should **point at** it ("packet may close only when `acceptance-criteria.md` is all Met/Waived/Superseded") as one parent completion bullet, not replace it.
- Phase-parent closeability stays outside AC_CLOSURE. Parent completion criteria should be: every listed child that is L2+ has AC_CLOSURE passing, and parent-specific outcomes in the durable section are met. That is a **new parent rule** or a recursive `validate.sh` of children — not AC_CLOSURE on the parent file.

### F16. 033 is the drift exhibit: mix of durable decisions and a growing progress log

Confirmed: `specs/system-speckit/033-spec-kit-template-optimization/goal.md` is **15028 bytes**, 204 lines. Section 4 PHASE MAP lists **three** phases (001, 002, 003). Sections 9–11 are Progress / Post-review remediation / Follow-on fixes — volatile log. Sections 1–3, 7–8 (Objective, Gate 3, Decisions, Constraints, Proof) are the durable directive. [SOURCE: file:specs/system-speckit/033-spec-kit-template-optimization/goal.md:1-50] [SOURCE: file:specs/system-speckit/033-spec-kit-template-optimization/goal.md:94-204]

This lineage cannot observe the "live frozen condition still described two phases" (that would be session state). What is confirmed is the **file** grew a third phase and a long progress log. That is sufficient to require a split: a frozen/injected string that still says "two phases" would diverge from section 4. The nested-goal design's answer is: **do not freeze the log; freeze a pointer plus short completion criteria.**

Proposed split:

| Section | Durable (may be frozen / must stay small) | Volatile (file only, never copied into set string) |
|---------|-------------------------------------------|-----------------------------------------------------|
| Objective (one sentence) | yes | |
| BINDING + PRECEDENCE | yes | |
| DECISIONS table (stable IDs) | yes | |
| COMPLETION CRITERIA (3–7 bullets) | yes | |
| Child path list | file only (working agent Reads the file) | |
| PHASE MAP narrative | file only | |
| PROGRESS / evidence tables | | yes |
| Remediation / follow-on | | yes |

**Parent size cap:** enforce on the **durable** slice, not the whole file.

- Whole-file cap would punish the log and recreate 033's problem (people would stop updating progress, or the validator would nag forever).
- Durable cap should sit **at or under the runtime objective cap (4000)** so that if an operator pastes the durable section into `/goal set` it still fits. Recommend **2000 characters** for the durable section as a packet rule (half the runtime cap, leaving room for RICCE wrapping in `buildGoalPrompt`). The set-string pointer stays ~200 chars.
- Child `goal.md` files: no whole-file cap; optional durable-section cap at 4000 so a child can itself be set as a session goal during that phase.

033's durable sections 1–3+7–8 are still large (decisions + proof table). A real parent template should force Decisions to IDs + one line, and Proof to "see child AC / validate.sh", so the durable slice stays under 2000.

### F17. Naming collision

`speckit-goal-offer-contract.test.cjs` forbids the substring `goal.md` in speckit command/presentation files because a stale **command** was named `goal.md`. Packet files named `goal.md` already exist (033, several other specs). Keep the packet basename `goal.md` for operator familiarity; do not mention that basename in speckit command markdown. Validator and templates live under system-spec-kit, not commands/speckit.

## Questions Answered

- Q4 binding/precedence/validation: answered (convention + packet validator; no runtime dereference).
- Q5 AC_CLOSURE vs stop: answered (complementary, not a substitute; parent phase packets cannot use it).
- Q6 durable/log split and parent cap: answered (cap the durable slice at 2000; no whole-file cap).

## Dead Ends

- **Runtime path-follower inside goal-core / Stop hook:** out of scope and contradicts both systems' "string in, string out" model. Ruled out.
- **Using AC_CLOSURE as the session stop evaluator:** wrong process, wrong file, wrong level for phase-parent. Ruled out as a substitute; retained as L2+ packet-close complement.
- **Whole-file size cap on parent goal.md:** would fight the progress log that 033 needs. Ruled out.
- **Putting child paths into the frozen set string:** reintroduces 4000-cap overflow and freeze-drift when phases are added. Ruled out.

## Assessment

- newInfoRatio: 0.70
- noveltyJustification: 033 byte count, AC_CLOSURE level skip, and the durable-slice cap (vs whole-file cap) were not in iterations 1–2.
- confidence: high on file facts; medium on Claude Stop-hook re-read behavior (unverified).

## Reflection

The binding problem is solved by refusing to make the set string a map of children. The working agent has Read; the stop evaluator does not. Put stoppable claims in the short string; put overflow behind a path the worker follows.

## Recommended Next Focus

None — maxIterations 3 reached. Synthesis should compile the six decisions.

## SCOPE VIOLATIONS

None.
