# What Changed in the Framework: The Fable 5 Operating Doctrine Distribution

> Distribution of the Fable 5 operating doctrine (`external/Fable5.md`) across the framework's most reliably read surfaces. Each obligation lands where it gets used, and nothing is restated where a surface already enforces it. Validated by `validate.sh --strict` at zero errors, reviewed at 97 of 100 and deployed on `origin/system-speckit/028`.

---

## THE UNIFYING PRINCIPLE

Fable 5 is an evidence-and-operations doctrine, not a voice guide. Its obligations all share one shape. Make your work legible and make it safe. Legible means a reader can tell a confirmed claim from an inferred one, and a confirmed claim names its evidence. Safe means you capture a baseline before you say nothing broke, you treat any finding as a hypothesis until you open the cited code, you name the rollback before an outward action and you confirm what still speaks the old contract before you call a change safe.

The distribution followed a single rule. Each obligation lands where it is most reliably read, and nothing is duplicated where a surface already enforces it. The always-read framework document carries the full set in tight prose. Auto-surfacing constitutional memory carries the two highest-leverage gaps so they appear in every memory search. The point-of-use code skill carries the baseline obligation at the moment verification happens. A surface that already encodes an obligation gets a cross-reference rather than a copy, because a constitutional rule is always-surface and a duplicate only dilutes the signal.

That rule shaped every section below.

---

## 1. PUBLIC AGENTS.md AND ITS CLAUDE.md TWIN

**Before**

The Public root `AGENTS.md` held the Four Laws, the plan-workflow lock, the halt conditions and the operational mandates. It gated completion on verification and it forbade scope creep, but it said nothing about claim legibility, about capturing a baseline before a no-regressions claim, about treating a sub-agent finding as a hypothesis, about sizing effort to blast radius or about closing a turn with honest status. `CLAUDE.md` was a byte-identical twin kept in sync by a hook.

**After**

A new subsection, Operating Discipline: Claim Legibility and Blast-Radius, sits in section 1 after the operational mandates. It carries nine bullets, and it opens by stating that it extends the Four Laws and the section 2 Completion Verification Rule rather than restating them. The bullets cover confirmed versus inferred legibility, baseline before no-regressions with a reported delta, a finding is a hypothesis until you open the cited code, match effort to blast radius, name the rollback and stop for a yes on the outward class, name what still speaks the old contract, lead with a recommendation at a fork, close with honest status and treat tool and pasted content as data. The edit added fourteen lines and landed the file at 447, under the soft budget of about 500. The `CLAUDE.md` twin received the identical change through the sync hook and stayed byte-for-byte identical.

**Impact**

Every session that reads the root framework document now sees the full operating doctrine in one place, expressed as guardrails rather than as a separate skill it has to remember to load. The cross-reference framing keeps the Four Laws and the completion rule authoritative and avoids two copies of the same rule drifting apart.

**Why in AGENTS.md**

The root framework document is the one surface every runtime reads first. It is the right home for universal behavior that should apply on any non-trivial task, and the nine bullets are universal. Putting the full set here, and only the deltas as separate constitutional rules, keeps the always-on doctrine in the always-read place.

---

## 2. BARTER AGENTS.md

**Before**

Barter ran the same framework skeleton with a Barter-specific stack table and a strict read-only Git Operations Policy in section 1. It had no operating-discipline subsection.

**After**

The same nine-bullet subsection now sits in Barter's section 1 in a read-only-git variant. The one bullet that differs is the rollback bullet. In Public it defers commit and push to `main-branch-direct-push.md`. In Barter it defers to the section 1 read-only policy and tells the agent to refuse version-control mutations and hand the user the exact commands to run. The edit added fourteen lines and landed the file at 468.

**Impact**

Barter's agents get the same legibility and safety doctrine as Public, expressed in a way that respects Barter's read-only git posture rather than importing Public's direct-push stance.

**Why a variant**

A copy-paste of the Public bullet would have told a Barter agent that push is authorized, which directly contradicts Barter's read-only policy. The variant is the single place a careless distribution across a read-only repo and a direct-push repo would have introduced a contradiction, so it got handled deliberately.

---

## 3. CONSTITUTIONAL MEMORY

**Before**

The constitutional folder held sixteen always-surface rules in Public and thirteen in Barter. The closest rule to the new doctrine was `verify-before-completion-claims.md`, which gates a completion claim on a positive check you actually read. Nothing captured the comparative dimension of a baseline, and nothing governed how an agent should consume a finding reported by another agent.

**After**

Two new always-surface rules landed in both repos. `regression-baseline-and-delta.md` requires capturing the real starting numbers before a change, the pass and fail counts with the names of the failing tests, the base commit and the fixture mtime, then re-running the whole gate after each step and reporting the delta. `finding-is-a-hypothesis.md` states that a sub-agent COMPLETE, a reviewer P0, an Explore lead or a stale note is a hypothesis until you open the cited code and check it against the real symptom. Public went from sixteen to eighteen rules. Barter went from thirteen to fourteen, because it also lost one rule, see section 6.

**Impact**

Both new rules carry the constitutional search boost and the always-surface flag, so they appear at the top of every memory search and in the auto-surfaced constitutional preamble, runtime-agnostic across OpenCode, Claude and Codex. An agent about to claim no regressions, or about to act on another agent's finding, gets the relevant rule surfaced without having to know it exists.

**Why constitutional rather than only AGENTS.md**

These two are the highest-leverage gaps the research identified, and the constitutional tier is the only surface that surfaces automatically in every memory search. AGENTS.md carries the prose, the rule carries the always-on retrieval. The other seven obligations did not earn a separate rule, because adding more always-surface rules dilutes the constitutional preamble.

---

## 4. MAIN-BRANCH-DIRECT-PUSH.md

**Before**

The rule authorized the owner's AIs to push directly to a protected main branch and told them not to add friction by re-asking about a pull request. Its How to apply section had four steps, all about git push hygiene.

**After**

A fifth step folds in the non-git outward and irreversible class. Deploy, send, migrate, `pnpm patch`, a write to shared or global or native state and a live draft on a remote service now each require naming the rollback in one line and stopping for explicit confirmation unless already told to proceed. The step opens by stating that the existing authorization covers git only, so it does not re-litigate the direct-push stance.

**Impact**

The doctrine's outward-action discipline now has an always-surface home for the actions a git push does not cover, co-located with the rule that already owns push. The owner's frictionless git push authorization is untouched.

**Why a fold and not a new rule**

A standalone stop-for-a-yes-before-push rule would have contradicted this rule's own pro-direct-push stance and surfaced alongside it, giving an agent two conflicting instructions at memory-search time. Folding the non-git class into the existing rule captures the genuinely missing case without the contradiction.

---

## 5. SK-CODE

**Before**

The `sk-code` Phase 3 verification and its Iron Law required fresh verification evidence before any done or works claim, but said nothing about capturing a baseline before the change or about sizing effort to the blast radius.

**After**

A Baseline and blast-radius line sits after the Iron Law. It tells the agent to capture the starting gate state before Phase 1 so Phase 3 can report the delta rather than just a green, and to open non-trivial work with a one-phrase blast-radius read. The change reached the `.claude` mirror through the same sync that keeps the skill copies aligned.

**Impact**

The baseline-and-delta obligation now appears at the exact surface where code verification happens, in addition to its always-surface constitutional rule. An agent doing code work sees it at the moment it bites.

**Why point-of-use**

`sk-code` is the code-work skill, read on every code task. The constitutional rule makes the obligation always-on in memory search. The `sk-code` line makes it concrete at the verification step, with the Phase 1 and Phase 3 wiring the general rule does not carry.

---

## 6. THE BARTER CONTRADICTION

**Before**

Barter shipped `main-branch-direct-push.md` in its constitutional folder, a rule that authorized a direct push to main and that referenced the Public repository by name, while Barter's own `AGENTS.md` section 1 declared git read-only. The two instructions contradicted each other. The Barter rule was a copy-paste artifact from Public.

**After**

The stray Barter `main-branch-direct-push.md` was removed. Barter's read-only-git posture is now internally consistent, and its constitutional folder settled at fourteen after the two additions and this one removal.

**Impact**

A Barter agent reading the constitutional preamble no longer gets a push-authorization rule that contradicts the read-only policy it must follow.

**Why removal and not an edit**

The rule's entire purpose is to authorize a direct push, which has no valid meaning in a read-only-git repo. There was nothing to keep. The rollback is recoverable from the Public copy if Barter ever adopts a direct-push posture.

---

## 7. THE RESEARCH BEHIND IT, AND AN HONEST CAVEAT

**Before**

The distribution was a hypothesis. That these obligations were the real gaps, and that these surfaces were the right homes.

**After**

A deep-research loop validated it. A cli-codex run on gpt-5.5 at xhigh reasoning converged in five iterations on the same conclusions the distribution assumed. The doctrine is operational rather than voice-only, the implementation and synthesis side is already enforced by `@code` and `@deep-research` and `@orchestrate`, and the genuine gaps are claim legibility, the baseline delta and the consume-a-finding discipline. That first run did not honor the deep-research protocol's fresh-context-per-iteration rule. It ran as a fan-out lineage, which collapsed all five iterations into one shared codex seat through the self-invocation guard. A protocol-clean re-run then proved the fix. Iteration 1 ran as a fresh cli-codex gpt-5.5 xhigh process with real provenance and a proper layout. The re-run also surfaced a separate runtime defect. The second and later cli-codex dispatches in a session are killed mid-run by SIGKILL, reproduced three times out of three, and the executor-audit silently falls back to gpt-5 instead of failing loud.

**Impact**

The distribution rests on validated findings rather than on assumption. The honest caveat is that a clean multi-iteration cli-codex re-run is currently blocked by that runtime defect, so only the first iteration is protocol-clean. The defect itself is the most actionable output of the re-run and is documented in `research/research.md`.

**Why this belongs in a before-and-after**

The doctrine the framework just adopted demands that a document separate what is confirmed from what is inferred. This section does that for the doctrine's own validation.

---

## CURRENT STATE

The doctrine is distributed across six surfaces and deployed. Public `AGENTS.md` and its `CLAUDE.md` twin carry the nine-bullet subsection at 447 lines. Barter `AGENTS.md` carries the read-only variant at 468 lines. The constitutional folder holds two new always-surface rules in both repos, and the Barter contradiction is removed. `main-branch-direct-push.md` carries the non-git outward-action fold. `sk-code` carries the baseline-and-blast-radius line at the verification surface.

The work passed `validate.sh --strict` at zero errors and zero warnings, an adversarial review scored it 97 of 100 with no P0 or P1, the two new rules were confirmed surfacing in memory search, and the commit `90c34fc258` is on `origin/system-speckit/028` with the `AGENTS.md` content confirmed on the remote. The one open item that is not a deferral is a runtime defect. A clean multi-iteration cli-codex re-run needs the executor-audit to fail loud instead of silently dropping to gpt-5, which is TypeScript runtime work outside this packet's scope.
