I'll start by exploring the directory structure to locate the exact files, then read them in parallel. This is a read-only critique task — no Gate 3 question applies.
Found all files. Now reading the core set in parallel.
Now I have the current classifier (which lacks `satisfiedBy`/`requiresGate3Prompt` — confirming phase 002 adds them). Reading the 034 design sources and findings in parallel.
Now reading the findings registry for exact finding text and the Gate-3 brief to understand the design rationale.
I have the full picture: the current classifier (`gate-3-classifier.ts`) lacks the new API; phase 002 adds it per iter-011's design; findings F-001/F-002/F-004/F-005/F-028/F-030/F-040 are the closed set. Cross-checked the satisfaction rule, the 6 tests, the prose bridge, and the parent phase map.

## Verdict

The P0 bridge correctly kills the halt on the 5 owned cells, but the safety surface it opens is **largely unenforced**: the skip is granted on a caller-supplied `validated` boolean with no defined validator, the `writeBoundary` field is decorative, the test matrix omits every multi-agent/multi-route surface where the bridge actually has to hold, and the unchanged session-wide reuse rule turns a command-scoped binding into a session-scoped one. Net: the design flips the measured cells but leaves 4 distinct loopholes a literal executor (the exact population this packet targets) will walk through.

## GAPS

### 1. `validated`/`"valid"` is undefined → the skip is a caller-supplied boolean, i.e. a literal-executor loophole (BLOCKER)

**Evidence:** `iter-011.md:64-68` (`BoundSpecFolder { path; source; validated: boolean }`), `iter-011.md:97-107` (satisfaction rule gates on `boundSpecFolder?.validated` with no call to any validator), `iter-011.md:36` (prose "bound a **valid** `spec_folder`" — "valid" never defined), `002/spec.md:71-74` (REQ-002 specifies the API but no validation contract), F-040 (`findings-registry.md:48` describes the design, defines no validity). Sources include `'flags'` (`iter-011.md:58`) which carry arbitrary strings.

**Gap:** Nothing in the design produces `validated: true` or defines the predicate. The entire premise of packet 034 is "GPT executes the letter" (synthesis.md:5). Here the letter is a boolean the caller sets freely: `--spec-folder ../` (source `flags`) or a target-path that resolves ambiguously (source `target_path_resolution`) → `validated:true` → `satisfiedBy:'prebound_spec_folder'` → gate skipped → any write. That is the loophole the brief asks about, and it is not verifiable at classify time because **no validator exists to call**. It also swallows the "stale/out-of-scope folder" concern: a deprecated folder, or one missing `description.json`/`graph-metadata.json` (which AGENTS.md §3 makes mandatory), passes if the caller flips the bit.

**Severity:** blocker — the safety guarantee of the whole package rests on an undefined boolean.

**Amendment:** REQ-002 must ship a `validateSpecFolderBinding()` with a concrete, testable predicate the satisfaction rule **calls** (not trusts): path resolves under `.opencode/specs/` or `specs/`; exists; contains the mandatory metadata files; `spec.md` Status ≠ Deprecated/Superseded; and (per Gap 6) is a leaf, not a phase parent. Add two tests: `flags` carrying an out-of-tree path → NOT satisfied; target-path that resolves to >1 candidate → NOT satisfied.

### 2. `writeBoundary` is declared but never enforced → writes outside the bound folder after the gate is skipped (MAJOR)

**Evidence:** `iter-011.md:74` (`writeBoundary?: string` on `CommandContract`), `iter-011.md:97-107` (satisfaction rule never references `writeBoundary`), `iter-011.md:36` (prose requires "the run remains inside that command's declared write boundary" as a satisfaction condition — but the code grants the skip without checking or returning it).

**Gap:** The one clause that makes the skip *safe* — "remains inside the write boundary" — is asserted in prose, absent from the satisfaction rule, and has no post-gate enforcement specified. So a command binds `specs/123-x` and the executor writes `src/parser.ts`; the gate was already skipped at classify time and nothing stops the out-of-boundary write. This is the brief's "binds a folder but writes OUTSIDE it," and it is unmitigated.

**Severity:** major.

**Amendment:** Make the satisfaction rule require a non-empty `writeBoundary`, **return** it on the result, and add a runtime invariant (the phase-002 spec or the autonomous profile rule 2, `iter-011.md:172`) that any write whose resolved path is not under `writeBoundary` re-opens Gate 3 (treated as a violation-recovery event). Add a test: bound folder + a write outside `writeBoundary` → `requiresGate3Prompt` flips back to true.

### 3. Orchestrate/E4 hand-off is untested, and F-019/F-020 are owned by phase 007 though the bridge lands globally (MAJOR)

**Evidence:** `002/spec.md:44` (closes list = F-001,F-002,F-004,F-005,F-028,F-030,F-040 — **F-019/F-020 absent**), `002/spec.md:87` (acceptance cells RVB-008,RSB-008,ACB-004,IMB-004,IMB-005 — none is an orchestrate/E4 cell), `035/spec.md:122` (phase 007 owns F-019/F-020/F-021/F-022/F-039), `iter-011.md:119-156` (6 tests — none is a hand-off/child-agent case), F-020 (`findings-registry.md:28`: Gate-3 sits position-buried at orchestrate.md line 387, executor acts on what it reads first).

**Gap:** Phase 002 edits AGENTS.md Gate-3 **globally**, but the E4 path's operative block lives in `orchestrate.md` (F-020), which 002 does not touch and 007 fixes by a *different* mechanism (hoisting, not the bridge). Between 002 landing and 007 landing, an orchestrate-dispatched child agent re-classifies the same prompt: if it receives the bound `spec_folder` through the Task prompt but **not** the `commandContract` object, its `classifyPrompt` returns `requiresGate3Prompt:true` and it re-halts — a regression on exactly the F-020 path the package claims to clear. The test matrix never exercises the parent→child options hand-off.

**Severity:** major.

**Amendment:** Add a 7th test: child-agent re-classify with `boundSpecFolder` present but `commandContract:null` → assert the intended verdict (and define it: either propagate the contract through the dispatch, or treat a bound folder + autonomous parent as sufficient). Add a cross-phase dependency note to `002/spec.md` §6: phase 002's bridge is not safe on E4 until phase 007's `EXECUTOR CONTRACT` block propagates `boundSpecFolder`+`commandContract` to dispatched children.

### 4. Router commands (`/doctor`): the autonomous bridge and the preserved router clause conflict with no stated precedence (MAJOR)

**Evidence:** `iter-011.md:36` (bridge: "Do NOT emit the generic A-E prompt"), `iter-011.md:37-40` (Router-commands bullet preserved verbatim in the After block: "mutates routes require the same spec-folder discipline as any other file/database mutation… before asking or acting"), `iter-011.md:119-156` (no `/doctor`/router test).

**Gap:** For an autonomous `/doctor:<mutates-target>` with a bound folder, a literal executor now reads two applicable clauses with opposite imperatives — bridge: "do not ask"; router clause: "require spec-folder discipline before asking or acting." The package targets literal executors; unresolved clause conflicts are precisely their failure mode. No precedence sentence reconciles them.

**Severity:** major.

**Amendment:** Add one precedence line to the bridge ("the Router-commands clause governs per-route mutation class; the autonomous bridge applies only to routes the router manifest marks autonomous-and-bound") and add a test: autonomous `/doctor` on a `mutates` route with a bound folder vs. unbound → distinct verdicts.

### 5. Session-wide reuse rule + unconditional `prior_answer` → an autonomous binding leaks across task boundaries (MAJOR; also a Claude regression)

**Evidence:** `iter-011.md:41` (unchanged "The answer applies for the **ENTIRE** session — re-ask ONLY when user says 'new task'"), `iter-011.md:45` (recovery exception extends to "an autonomous command contract has validly bound a spec folder for the current run"), `iter-011.md:97-99` (prior_answer branch: `core.triggersGate3 && boundSpecFolder.validated && source==='prior_answer'` — **no executionMode gate, no task-boundary check**), `iter-011.md:144-148` (test 5: interactive `save context` + prior_answer → satisfied). The bridge promises "this **command-scoped** run" (`iter-011.md:36`) but the prior_answer path is session-scoped.

**Gap:** Nothing constrains how a binding's `source` transitions to `'prior_answer'` across runs, and the prior_answer branch fires for **any** executionMode including INTERACTIVE. So: run 1 binds `specs/100-foo` autonomously → run 2 in the same session is an unrelated interactive "fix the parser bug" re-presented with `source:'prior_answer'` → `satisfiedBy:'prior_answer'` → gate skipped → writes land in `specs/100-foo`. The session rule blocks re-asking unless the user *verbatim* says "new task." This both defeats the command-scoping promise and regresses Claude's correct behavior (Claude re-asks on a genuinely new task; the unconditional prior_answer path suppresses that).

**Severity:** major.

**Amendment:** Constrain `prior_answer` satisfaction to require the originating answer to be an **interactive** Gate-3 answer (or an explicit carry-over), never an autonomous `prebound_spec_folder` re-tagged as `prior_answer`; add a test for cross-task reuse (autonomous binding then a new interactive write) → `requiresGate3Prompt:true`.

### 6. Phase-parent binding: no leaf/parent awareness → binding a phase parent violates the lean-trio policy (MAJOR)

**Evidence:** `iter-011.md:64-68` (`BoundSpecFolder` has no `isLeaf`/`parentRef`/`childRef` field), `iter-011.md:97-107` (satisfaction rule has no parent check), AGENTS.md §3 Phase Parent Mode (a phase parent "needs ONLY the lean trio {spec.md, description.json, graph-metadata.json}; heavy docs (plan.md, tasks.md, checklist.md…) live in the phase children"; resume honors `derived.last_active_child_id`).

**Gap:** Binding `specs/035-gpt-reliability-fixes` (a phase parent) is path-shaped and would pass a naïve `validateSpecFolderBinding`, but writing `plan.md`/`tasks.md` there directly violates the lean-trio policy — heavy docs belong in the phase child, resolved via `last_active_child_id`. The classifier has zero awareness of this distinction, so an autonomous write command can pollute a phase parent. (This is the concrete reason the Gap-1 validator must read graph-metadata, not just `exists()`.)

**Severity:** major.

**Amendment:** Add `isLeaf`/`resolvedChildId` to `BoundSpecFolder`; `validateSpecFolderBinding` must, for a phase parent, resolve `last_active_child_id` (or fail) and bind the child. Add a test: bind a phase-parent path → either auto-resolves to the active child or is NOT satisfied.

### 7. `:confirm` is absent from the classifier vocabulary; autonomous-confirm is untested (MINOR)

**Evidence:** `gate-3-classifier.ts:108-141` (vocabulary lists `:auto` at :119 but **not** `:confirm`), `gate-3-classifier.ts:198-200` (special-case only for `:auto`), F-008 (`findings-registry.md:16`: confirm.yaml "only consumes already-bound setup values"), `iter-011.md:119-156` (the single confirm test, :151-156, is **interactive**-confirm-still-asks; autonomous-confirm+bound is not covered).

**Gap:** `/deep:review:confirm` is classified only via the `/deep:review` substring match — the classifier never sees confirm's distinct "already-bound, no re-render" semantics. The one confirm test guards the interactive case; the autonomous-confirm-with-bound-folder case (where F-008 says values are already consumed) has no asserted verdict, so a literal executor's behavior there is unspecified.

**Severity:** minor.

**Amendment:** Add `:confirm` to the vocabulary with documented semantics and a test for autonomous-confirm+bound → defined verdict (satisfied, given F-008's already-bound contract) so the behavior is asserted rather than emergent.

---
**Coverage check vs. the brief:** loophole/"validly bound" verifiability → Gap 1; writes outside the bound folder → Gap 2; orchestrate/E4 hand-offs → Gap 3; `/doctor` router mixed mutation classes → Gap 4; VIOLATION-RECOVERY + session-rule interaction → Gap 5; nested/phase-child folders → Gap 6; `:confirm` + partial binding → Gap 7 (partial/ambiguous binding folded into Gap 1's amendment); Claude regression → Gap 5. All claims are verifiable against the cited `file:line`.
