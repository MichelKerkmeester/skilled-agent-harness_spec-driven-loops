# What Changed in 144: Operating Like Fable 5

> Spec 144 turns Fable-5 from a doctrine into measurable, routed and machine-checkable operating behavior across the agent framework.

---

## THE UNIFYING PRINCIPLE

Fable-5 is not a style preference. It is a control system for agent work. A useful agent reasons outward, acts on the task, keeps evidence close to every load-bearing claim and stops adding ritual where structure can carry the rule.

This packet applies that principle in layers. First it puts the doctrine where agents already read. Then it measures the behavior, sends compact governor instructions through the right channels, tightens point-of-use verification and makes dispatch provenance and evidence legible to machines.

That rule shaped every section below.

---

## 1. DOCTRINE DISTRIBUTION

**Before**

The Fable-5 doctrine lived outside the surfaces agents were guaranteed to read. The framework already had the Four Laws, halt conditions and completion verification, but it did not consistently tell agents to separate confirmed from inferred claims, capture baselines before no-regressions claims, treat findings as hypotheses, size effort to blast radius or name rollback before outward action.

**After**

Phase 001 distributed the doctrine across the highest-read surfaces. Public `AGENTS.md` gained the Operating Discipline subsection, `CLAUDE.md` stayed byte-identical, Barter gained a read-only-git variant and `sk-code/SKILL.md` gained the Baseline and blast-radius line. Two constitutional rules were added: `regression-baseline-and-delta.md` and `finding-is-a-hypothesis.md`. `main-branch-direct-push.md` gained the non-git outward and irreversible action step.

**Impact**

The doctrine now appears in the normal control path instead of depending on memory or goodwill. The always-read documents carry the full discipline, constitutional memory carries the two highest-leverage reminders and `sk-code` carries the baseline rule where verification happens.

**Why distribution mattered**

A rule that lives in one external note is easy to miss. A rule distributed by surface responsibility is harder to bypass and easier to keep concise.

---

## 2. RESEARCH TO IMPLEMENTATION MAP

**Before**

The packet had a doctrine and a set of intuitions about where that doctrine might change behavior. It did not yet have an approved map of adjustable surfaces, ranked by behavioral leverage, cost and blast radius.

**After**

Phase 002 produced recommend-only research. It synthesized six lineages, preserved per-lineage attribution in `fanout-attribution.md` and delivered `recommendations.md` with A, B and C tiers. Every item was tagged for tier, leverage, blast, convergence and dedup against round 1. The recommendations trace directly into phases 003 through 009.

**Impact**

The implementation work stopped being a pile of plausible edits. It became an ordered sequence: measurement, doctrine quick wins, governor capsule, subagent recursion, `sk-code` rituals, provenance and evidence contract.

**Why recommend-only was right**

The phase needed to answer where to intervene before changing the framework. Keeping it research-only gave later phases a signed-off map instead of mixing discovery with edits.

---

## 3. MEASUREMENT AND LOW-BLAST DOCTRINE

**Before**

Behavioral efficiency could be described but not measured against a captured reference. A dead `AGENTS.md:217` pointer also misled a research lineage into concluding OpenCode had no per-turn hook, which proved the pointer was not cosmetic.

**After**

Phase 003 defined the fable-5 measurement baseline, including five metrics, the C1, C2 and C3 scope, a `fable-metrics.cjs` path over the phase 002 corpus, non-blocking advisory behavior and a read-only route. Phase 004 shipped the quick wins from recommendations A1, A2 and A3: repaired the dead hook pointer, planned `check-doc-pointers.sh`, added the section 1 efficiency spine and added scar-tissue handoff discipline to the handover template.

**Impact**

The framework gained a way to measure movement before claiming improvement, and it removed a concrete false-negative source from the docs. The pointer check addresses the class of broken AGENTS references instead of only repairing one line.

**Why these came before deeper machinery**

Measurement and pointer correctness are cheap, low-blast and foundational. They make later governor and provenance work easier to evaluate and harder to misread.

---

## 4. GOVERNOR CHANNELS

**Before**

The per-turn skill-advisor hook could remind the primary agent, but it did not cover deep-loop iterations and dispatched subagents. A doctrine that only reaches the parent agent leaves delegated work outside the behavior it is supposed to enforce.

**After**

Phase 005 created the durable governor doctrine record at `.opencode/skills/system-spec-kit/constitutional/fable-governor.md` and targeted `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts` for the compact per-turn capsule. Phase 006 opened the subagent-visible governor channel through prompt-pack and agent prompts, added recursion-control coverage and defined an executor-config governor field.

**Impact**

The doctrine now has a path to both the main reminder surface and the delegated execution surface. Malformed governor configuration is specified to fail with a clear `ExecutorConfigError` rather than silently falling back.

**Why two channels were needed**

The per-turn hook and subagent prompts do different work. One reminds the active agent. The other shapes delegated iterations that never see the parent hook.

---

## 5. VERIFICATION RITUALS IN sk-code

**Before**

`sk-code` already enforced verification before completion claims, but it did not require a mutation-check, did not name each rung's blind spot in advance and did not force a structural seam to close a deferred decision.

**After**

Phase 007 added an eight-line Verification Rituals subsection to `.opencode/skills/sk-code/SKILL.md`, confined to the verification section. It added B4 mutation-check and claim-falsifier guidance, B5 verification ladder guidance from unit to in-memory to on-server to live and recommendation 11 for decision-economy plus fail-closed construction.

**Impact**

A green test is no longer enough by itself. The agent must prove the test bites, name what each verification rung cannot see and avoid bare TODOs or dead controls that pretend to be safety.

**Why point-of-use mattered**

Verification rules bite only when the agent is verifying. `sk-code` is the right surface because it is loaded during code work, and the edit avoids changing smart-router behavior.

---

## 6. FAIL-LOUD PROVENANCE

**Before**

The executor audit recorded the requested model from config, not the actual model a CLI ran. That meant a substitution could produce a success-looking provenance record even when the actual execution did not match the caller-approved model.

**After**

Phase 008 added `model_mismatch` to `DispatchFailureReason`, introduced actual-model extraction for opencode JSON event streams, normalized model ids and failed loud on detectable requested-versus-actual mismatches after a clean spawn. `resolveFallback` gained an optional caller-approved model set so fallback routing cannot substitute an unapproved model while preserving configured separate-pool fallback behavior. The new `executor-provenance-mismatch.vitest.ts` suite covers 10 mismatch, match, native, fallback and compatibility cases.

**Impact**

When the system has a reliable actual-model signal, it refuses to write a dishonest success record. The fix guards the class at the provenance recording seam and keeps lost-provenance crashes loud.

**Why this is bounded**

The guard only catches detectable mismatches. Codex, Claude Code and native paths return null when no reliable stdout actual-model signal exists. The requested-versus-actual check is gated behind `SPECKIT_PROVENANCE_CHECK=1`, while the reason type and fallback approval guard remain active.

---

## 7. EVIDENCE CONTRACT

**Before**

A load-bearing claim at the dispatch boundary had no fixed machine-checkable shape for its proof. Evidence could be present in prose, but post-dispatch validation could not classify the record as absent, present or malformed.

**After**

Phase 009 added `.opencode/skills/deep-loop-runtime/lib/deep-loop/evidence-contract.ts` with `validateEvidenceContract(input)`. The contract defines `claim_class`, `would_confirm`, `gate_delta`, `scope_state` and `child_result_verified`, with allowed enum values for `claim_class` and `scope_state`. Post-dispatch validation maps malformed evidence to advisory warnings without adding a new failure reason. The agent IO contract now documents optional `AGENT_IO_EVIDENCE` v1 and states that absence never blocks.

**Impact**

Evidence becomes structured enough to inspect without becoming a hard gate. Valid evidence passes, malformed evidence warns with `ok:true` and absent evidence stays green.

**Why advisory-only was deliberate**

The producer retrofit is a follow-on phase. Making absence fail now would break existing agents before they have a chance to emit the new group. Advisory validation lets the schema land safely first.

---

## CURRENT STATE

Spec 144 now has a complete phase-local narrative for how Fable-5 moved from doctrine to operating behavior. Phase 001 distribution and phase 002 research are complete with pass evidence. Phases 003 through 007 preserve their extracted checklist-defined pending or planned gates. Phase 008 passed the full deep-loop-runtime suite with 376 tests, proved the mismatch mutation check bites and recorded 14 completed task items. Phase 009 passed strict spec validation, passed 8 evidence-contract unit cases, passed 3 post-dispatch integration cases and passed the full deep-loop-runtime suite with 376 tests.

The packet's current shape is coherent: doctrine surfaces tell agents how to behave, research explains why those surfaces were chosen, measurement defines how improvement is judged, governor channels carry the compact rule to agents and subagents, `sk-code` makes verification harder to fake, provenance fails loud when it can detect a lie and the evidence contract gives dispatch claims a machine-checkable proof shape.
