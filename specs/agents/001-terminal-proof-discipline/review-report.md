# Review Report: Terminal Proof Discipline Integration

## Verdict

**Verdict: REQUEST CHANGES**

The proof-over-appearance discipline is valuable, but the current insertion is not integrated into the framework's control architecture. It copies a benchmark-shaped five-step sequence into `Execution & Quality` while the authoritative homes for those rules already exist in the Four Laws, Operating Discipline, Mandatory Gates, Tool Routing, Startup and Resume Recovery, and the Quick Reference.

The result is more than stylistic duplication. The new block creates conflicting execution instructions around failed tests, retry limits, destructive sanitization, dependency installation and shell-based file inspection. It also labels a final check "mandatory" without placing it in the document's Mandatory Gates. The protocol should remain, but its parts should move to the sections that own their precedence and enforcement.

No existing HARD BLOCKER should be removed or weakened. The minimal correction is to distribute the protocol, clarify how remediation proceeds while a hard stop remains active, and add one new post-execution hard gate for final machine state.

### Review Scope

- Primary target: `AGENTS.md`, read in full, with the insertion at `AGENTS.md:275-289`.
- Supporting intent: `decision-record.md`, especially ADR-003 at lines 236-327.
- Supporting completion claims: `spec.md:64-72`, `plan.md:114-130`, `tasks.md:52-76`, `checklist.md:49-71` and `implementation-summary.md:47-63`.
- Structural evidence: the current diff is 16 insertions and no deletions in `AGENTS.md`.
- Document-quality evidence: `extract_structure.py AGENTS.md` detected a 451-word inserted subsection inside a 5,717-word framework and scored the document DQI 88. DQI does not assess the policy conflicts identified below.

## Findings

### Findings Summary

| ID | Severity | Type | Summary |
|---|---|---|---|
| TPD-001 | P1 | Conflict | `FIX and LOOP` contradicts the Four Laws' immediate halt on failed tests and introduces an uncoordinated retry threshold. |
| TPD-002 | P1 | Enforcement gap | `FINAL GATE (mandatory)` sits outside Mandatory Gates and duplicates weaker or narrower completion rules. |
| TPD-003 | P1 | Safety | The sanitization reminder can authorize destructive history and reflog changes without the required rollback and confirmation gate. |
| TPD-004 | P1 | Tool-routing conflict | Shell guidance for `cat`, `head`, `tail`, `grep` and `ls` conflicts with the framework's specialized search and read routing. |
| TPD-005 | P1 | Traceability | The packet marks the framework-gap mapping complete, but its cited evidence never performs an idea-by-idea placement analysis. |
| TPD-006 | P1 | Scope and mutation | "Install early" and "keep a no-install fallback" bypass scope, mutation and anti-gold-plating qualifications. |
| TPD-007 | P2 | Duplication | Most of TARGET, SOLVE FAST, RUN and CHECK, and FINAL GATE restate rules already present elsewhere. |
| TPD-008 | P2 | Placement | The subsection combines five separate policy domains and interrupts the transition from execution behavior to quality principles. |
| TPD-009 | P2 | Missing taxonomy | Task-specific proof obligations are compressed into prose instead of a reusable verification matrix. |
| TPD-010 | P2 | Tone and portability | Benchmark imperatives and Unix/Python-specific examples do not match the framework's trigger-rule-evidence style or universal scope. |

### TPD-001 [P1] Failed-test behavior has two authorities

- Evidence: Law 4 says to "Stop immediately" when tests fail at `AGENTS.md:24`, reinforced by `AGENTS.md:39`. The new step says to diagnose, fix and re-check at `AGENTS.md:282`.
- Evidence: the new rule switches approaches after two failures at `AGENTS.md:282`. Gate 1 permits up to three investigation iterations at `AGENTS.md:117`. Confidence Escalation asks after two failed attempts at `AGENTS.md:428`.
- Impact: an assistant cannot tell whether a failing test requires an immediate report and stop, a local repair loop, an approach switch or escalation. Because one source is a HARD BLOCKER, the ambiguity is operational rather than editorial.
- Finding class: cross-consumer.
- Scope proof: the conflicting instructions appear in the Four Laws, Gate 1, Execution Behavior, the inserted block and Confidence Escalation.
- Recommendation: keep Law 4 hard. Clarify that a failure halts forward progress and any completion claim. Put the permitted reproduce-diagnose-fix-rerun cycle in a new `Debugging & Iteration` paragraph under `Execution Behavior`, and make it defer to the existing escalation thresholds instead of defining another number.

### TPD-002 [P1] The mandatory final gate is outside Mandatory Gates

- Evidence: the Iron Law already blocks unverified completion at `AGENTS.md:11`. Law 3 repeats it at `AGENTS.md:23`. Verification Standards govern evidence at `AGENTS.md:84-90`. The Completion Verification Rule is a HARD BLOCK at `AGENTS.md:176-186`. Quick Reference repeats that flow at `AGENTS.md:493`.
- Evidence: the new `FINAL GATE (mandatory)` is located at `AGENTS.md:283` under a normal execution subsection and is scoped by `AGENTS.md:277` only to hidden tests, benchmarks and one-shot scripts.
- Impact: the strongest new mechanics, exact-path existence, clean rerun and output hygiene, have weaker structural authority than their label claims. They are also absent from the general completion path.
- Finding class: matrix/evidence.
- Scope proof: all completion authorities are enumerated above. Only the inserted subsection contains the three final-state checks.
- Recommendation: create `FINAL-STATE VERIFICATION [HARD] BLOCK` under `POST-EXECUTION GATES`, immediately before the existing Completion Verification Rule. The new gate should cover objective checks, exact artifacts and scoped final state. The existing Completion Verification Rule should remain intact as the additional spec-packet reconciliation gate.

### TPD-003 [P1] The sanitization rule bypasses destructive-operation governance

- Evidence: `AGENTS.md:285` requires removal from "EVERYWHERE" and explicitly names git history, branches and reflog.
- Evidence: `Blast-Radius Management` requires a rollback and operator confirmation before delete, overwrite or migration at `AGENTS.md:94-96`. Git Workspace Safety adds branch-specific constraints at `AGENTS.md:335-344`.
- Impact: a broad reading can trigger irreversible repository surgery for an ordinary removal request. It also collapses three different tasks, deleting a working-tree artifact, sanitizing persisted sensitive data and rewriting repository history, into one instruction.
- Finding class: cross-consumer.
- Scope proof: the reminder names destructive stores but contains no trigger, risk classification, rollback or approval requirement.
- Recommendation: move the rule to `Blast-Radius Management` as a qualified `Sanitization` bullet. Require an inventory of persistence locations, an explicit rollback and operator approval before any history, branch or reflog rewrite. Keep ordinary removal scoped to the requested surface.

### TPD-004 [P1] Terminal file inspection conflicts with Tool Routing

- Evidence: `AGENTS.md:287` directs assistants to use `cat`, `head`, `tail`, `grep` and `ls` patterns for inspection and verification.
- Evidence: `Code Search Decision Tree` at `AGENTS.md:350-360` assigns exact text to Grep, path discovery to Glob and content confirmation to Read.
- Impact: the same framework now gives two routing policies for identical work. The inserted rule is shell-specific and bypasses the specialized tools that the universal routing section designates.
- Finding class: cross-consumer.
- Scope proof: both instructions apply to file discovery and content inspection. Neither declares precedence.
- Recommendation: place non-interactive process rules in a new `Terminal Command Discipline` subsection under `Tools, Search & MCP Routing`. State that specialized Grep, Glob and Read routes remain authoritative. Keep only genuinely terminal-specific rules there: non-interactive execution, no pagers, flag discovery and recovery from unsupported commands.

### TPD-005 [P1] The packet's completed mapping task lacks its claimed evidence

- Evidence: `plan.md:116` and `tasks.md:54-55` say the terminal steps were mapped to framework gaps. `checklist.md:51-52` marks that mapping complete and cites ADR-003 plus `spec.md` section 2.
- Evidence: `spec.md:64-72` states that mechanics were absent but does not map any mechanic to an existing section. ADR-003 at `decision-record.md:248-267` evaluates where to store the full protocol versus the one-line capsule, then chooses one new subsection. It does not compare TARGET, SOLVE FAST, RUN and CHECK, FIX and LOOP, FINAL GATE, task reminders, shell rules or hook text with existing framework owners.
- Impact: the decision process proves persistence location, not integration architecture. The unchecked assumption, that "AGENTS.md section 4" means "one new block in section 4", directly explains the operator's copy-and-paste concern.
- Finding class: matrix/evidence.
- Scope proof: the cited documents contain no section-by-section placement matrix. The first complete mapping appears in this review.
- Recommendation: treat the original storage decision as still valid, but amend its implementation interpretation. `AGENTS.md` remains the durable home while the protocol is distributed across its existing authorities.

### TPD-006 [P1] Dependency and fallback instructions are insufficiently bounded

- Evidence: `AGENTS.md:280` says "Install early if needed and keep a no-install fallback."
- Evidence: Scope Lock at `AGENTS.md:22` prohibits adjacent work. Gate 3 at `AGENTS.md:127-148` governs mutations. Quality Principles at `AGENTS.md:295-298` prefer simplicity and stated scope. Anti-Patterns at `AGENTS.md:300-309` reject gold-plating.
- Impact: installing a dependency changes machine or repository state, while maintaining two execution paths can create unnecessary scope and verification work. The sentence treats both as default implementation tactics.
- Finding class: cross-consumer.
- Scope proof: the inserted rule contains no condition for offline, one-shot or restricted environments and no reference to mutation gates.
- Recommendation: retain "prefer already available tools" in Quality Principles. Move dependency acquisition to terminal discipline with explicit scope and mutation checks. Require a no-install fallback only when the target environment cannot rely on dependency installation.

### TPD-007 [P2] The protocol duplicates established rules instead of extending them

- Evidence: TARGET duplicates `Plan before acting` at `AGENTS.md:260`, `Confirmed vs inferred` at `AGENTS.md:88` and `Reason from actual data` at `AGENTS.md:271`.
- Evidence: SOLVE FAST duplicates Ownership and Completion at `AGENTS.md:264-267` plus simplicity and stated-scope rules at `AGENTS.md:295-297`.
- Evidence: RUN and CHECK duplicates the Iron Law at `AGENTS.md:11`, Law 3 at `AGENTS.md:23`, baseline verification at `AGENTS.md:89` and the Completion Verification Rule at `AGENTS.md:176-186`.
- Evidence: FINAL GATE duplicates Scope Lock at `AGENTS.md:22`, completion verification at `AGENTS.md:176-186`, the final communication receipt at `AGENTS.md:101` and Quick Reference at `AGENTS.md:493`.
- Impact: future changes must keep multiple formulations synchronized. An assistant must infer which copy is authoritative when wording diverges.
- Recommendation: add only the missing mechanics to the established rules: objective proof design, safe negative control, exact artifact existence, clean rerun and scoped-output hygiene.

### TPD-008 [P2] One subsection carries five unrelated policy domains

- Evidence: `AGENTS.md:275-289` contains execution lifecycle, debugging, verification taxonomy, shell operation and hook architecture.
- Evidence: the block sits after `Execution Behavior` and before `Quality & Anti-Patterns`, so the hook pointer and destructive-data rule interrupt an otherwise coherent section transition.
- Impact: readers cannot predict where to find a rule, and section ownership no longer communicates precedence.
- Recommendation: remove the standalone subsection after distributing its content. No new top-level section is needed.

### TPD-009 [P2] Task-specific proofs need a compact verification matrix

- Evidence: `AGENTS.md:285` places sanitization, transformation, calculation, performance and exact-format verification into one long paragraph.
- Impact: each task class has a useful invariant, but the paragraph gives destructive sanitization the same weight and handling as a computed answer. It is difficult to scan and impossible to reference by row.
- Recommendation: add a small `Task-specific proof` table to `Verification Standards`. Keep sanitization in Blast-Radius Management and point the table to that rule.

### TPD-010 [P2] The inserted voice is benchmark-shaped rather than framework-shaped

- Evidence: phrases such as "SOLVE FAST", "Ship", "Never end with nothing" and "stdlib first" at `AGENTS.md:279-287` read as an executor prompt. The surrounding framework more often uses named triggers, rule tables, explicit precedence and source pointers.
- Evidence: `stdlib`, `grep`, `cat`, `head`, `tail` and `ls` assume particular runtimes or shells despite the document's universal multi-repository role at `AGENTS.md:1-11`.
- Impact: the section feels pasted because its rhetoric and abstraction level come from the benchmark source rather than the framework.
- Recommendation: preserve the direct tone but translate each rule into the framework's existing vocabulary: objective proof, hard gate, scope, blast radius, routing and evidence receipts.

## Protocol-to-Framework Mapping

| Protocol idea | Existing overlap | Correct durable home | Minimal integration |
|---|---|---|---|
| Final-machine-state trigger | Iron Law (`AGENTS.md:11`), Four Laws (`AGENTS.md:19-24`) | `Operating Discipline > Verification Standards` | Define objective proof planning for machine-state tasks without creating a parallel lifecycle. |
| TARGET: 1-5 objective criteria | Planning and Approach (`AGENTS.md:259-262`) | `Execution Behavior > Planning & Approach` | Add one bullet requiring stated acceptance criteria to become observable pass/fail checks before changes. |
| TARGET: exact path and format | Confirmed vs inferred (`AGENTS.md:88`) | New post-execution final-state gate | Verify exact artifact identity and format before completion. |
| TARGET: exact error or symbol | Code Search Decision Tree (`AGENTS.md:350-358`) | `Tools > Code Search Decision Tree` | Add a bug/error route: exact symptom or symbol, then callers and consumers, then Read. |
| TARGET: fix the root once | Systems lens (`AGENTS.md:316`) | New `Execution Behavior > Debugging & Iteration` | Reproduce, trace producers/consumers, fix the root cause and rerun the same check. |
| TARGET: watch the check fail first | Finding is a hypothesis (`AGENTS.md:90`) | `Verification Standards` | Add a safe negative-control rule: observe the exact symptom before the fix when practical and non-destructive. |
| TARGET: never assume | Honesty (`AGENTS.md:48-53`), actual-data reasoning (`AGENTS.md:269-271`) | Existing `Verification Standards` | Add no new section. Fold the idea into objective-proof wording. |
| SOLVE FAST: complete output early | Ownership and Completion (`AGENTS.md:264-267`) | Existing `Ownership & Completion` | Add "produce the smallest complete result early" as one sentence. |
| SOLVE FAST: simple over elaborate | Quality Principles (`AGENTS.md:293-298`) | Existing `Quality Principles` | Tighten "Prefer simplicity" to prefer the smallest complete solution. |
| Prefer installed tools | Simplicity and scope (`AGENTS.md:295-297`) | `Quality Principles` | Prefer available project tools before adding dependencies. |
| Install early | Gate 3 (`AGENTS.md:127-148`), blast radius (`AGENTS.md:92-96`) | New `Terminal Command Discipline` | Treat installation as a scoped mutation. Verify need and authority first. |
| Keep a no-install fallback | Gold-plating check (`AGENTS.md:307`) | `Quality Principles` | Qualify it: only when the execution environment requires one. |
| RUN: execute workspace gate | Law 3 (`AGENTS.md:23`), baseline standard (`AGENTS.md:89`) | `Verification Standards` and final-state gate | Require the authoritative whole gate after focused checks. |
| RUN: read real output | Confirmed vs inferred (`AGENTS.md:88`), actual-data reasoning (`AGENTS.md:271`) | `Verification Standards` | Add "a command is evidence only after its output and exit status are read." |
| RUN: edge and boundary cases | Systems lens (`AGENTS.md:316`) | `Verification Standards` | Add boundary cases to the objective proof plan when the task exposes them. |
| FIX and LOOP | Frequent self-checks (`AGENTS.md:270`) | New `Execution Behavior > Debugging & Iteration` | Put the bounded remediation loop here, subordinate to Law 4 and Section 7 escalation. |
| Switch a repeated approach | Gate 1 and Escalation (`AGENTS.md:117`, `AGENTS.md:426-428`) | Existing `Confidence & Clarification > Escalation` | Do not add another numeric threshold. Say repeated attempts without new evidence require a changed approach or escalation. |
| FINAL: artifact exists | No exact equivalent | New `POST-EXECUTION > FINAL-STATE VERIFICATION [HARD] BLOCK` | Add exact path and artifact check. |
| FINAL: all criteria pass cleanly | Completion Verification (`AGENTS.md:176-186`) | New final-state gate, then existing Completion Verification | General gate reruns objective checks. The packet gate remains responsible for spec docs and metadata. |
| FINAL: no stray output | Scope Lock (`AGENTS.md:22`) | New final-state gate | Inspect scoped diff/status and remove task-created temporary output. |
| Leave a best-effort result | Ownership (`AGENTS.md:264-267`), final communication (`AGENTS.md:101`) | `Ownership & Completion` and `Communication` | Require a concrete result or explicit blocked state, never a false completion claim. |
| Sanitization across stores | Blast radius (`AGENTS.md:92-96`), Git Safety (`AGENTS.md:335-344`) | `Blast-Radius Management` | Separate working-tree removal from sensitive-data history rewriting and require approval. |
| Transform every variant and rescan | Systems lens (`AGENTS.md:316`) | `Verification Standards > Task-specific proof` | Inventory variants, transform them and rescan for residue. |
| Compute independently twice | Confirmed vs inferred (`AGENTS.md:88`) | `Verification Standards > Task-specific proof` | Require an independent derivation for load-bearing computed answers. |
| Measure time or speed | Baseline standard (`AGENTS.md:89`) | `Verification Standards > Task-specific proof` | Measure actual runtime and report conditions plus delta. |
| Match names, paths and formats | Scope Lock (`AGENTS.md:22`) | Objective proof plan and final-state gate | Check exact identity before and after execution. |
| Non-interactive commands | No current dedicated home | New `Tools > Terminal Command Discipline` | Require non-interactive flags and disable pagers. |
| Shell file inspection | Code Search Decision Tree (`AGENTS.md:350-360`) | Existing tool routing | Remove shell duplicates. Specialized Grep, Glob and Read remain authoritative. |
| Start long work early | Planning (`AGENTS.md:259-262`) | `Terminal Command Discipline` | Start early only after prerequisites, scope and mutation gates pass. |
| Verify flags, APIs and filenames | Actual-data reasoning (`AGENTS.md:271`) | `Terminal Command Discipline` | Probe supported commands and paths before relying on them. |
| Recover from unknown option | Escalation (`AGENTS.md:426-428`) | `Debugging & Iteration` | Inspect the available interface, change the approach and do not repeat the same guess. |
| Directive capsule pointer | Hook-capable runtime text (`AGENTS.md:383-387`) | `Startup & Resume Recovery` | Add a short `Directive Capsule` paragraph beside the existing hook contract pointers. |

## Proposed Integration Plan

### Placement Plan

| Order | Exact section | Change | Protocol pieces absorbed |
|---|---|---|---|
| 1 | `1. CRITICAL RULES > The Four Laws` | Clarify the effect of HALT without relaxing it. A failed test blocks forward progress and completion until the permitted remediation loop returns green. | FIX and LOOP precedence. |
| 2 | `1. CRITICAL RULES > Operating Discipline > Verification Standards` | Add objective proof, observed command evidence, safe negative control and a task-specific proof matrix. | TARGET, RUN and CHECK, transformation, calculation, performance, exact format. |
| 3 | `1. CRITICAL RULES > Operating Discipline > Blast-Radius Management` | Add qualified sanitization and dependency-acquisition rules. | Removal everywhere, history/reflog safety, install behavior. |
| 4 | `2. MANDATORY GATES > POST-EXECUTION GATES` | Add `FINAL-STATE VERIFICATION [HARD] BLOCK` before the existing Completion Verification Rule. | Exact artifact, clean rerun, no stray outputs, no unrelated changes. |
| 5 | `4. EXECUTION & QUALITY > Request Analysis & Execution > Execution Behavior` | Add one objective-check planning bullet, one smallest-complete-result sentence and a short `Debugging & Iteration` paragraph. | TARGET, SOLVE FAST, FIX and LOOP, unknown-command recovery. |
| 6 | `4. EXECUTION & QUALITY > Quality Principles` | Qualify available-tool and fallback preferences. | Installed tools, simplicity, no-install fallback. |
| 7 | `5. TOOLS, SEARCH & MCP ROUTING > Code Search Decision Tree` | Add an exact-symptom and caller-tracing row. | Error/symbol/caller search. |
| 8 | `5. TOOLS, SEARCH & MCP ROUTING > Required Tools & Search Routing` | Add `Terminal Command Discipline` after the search table. Keep it subordinate to specialized tool routing. | Non-interactive operation, no pagers, command discovery, long-running work. |
| 9 | `6. STARTUP & RESUME RECOVERY` | Add `Directive Capsule` before Recovery Flow. | Per-turn proof disposition and injection-contract pointer. |
| 10 | `9. QUICK REFERENCE` | Add a `Machine-state task` row and make `Claim completion` pass through final-state verification before packet reconciliation. | Whole protocol discoverability. |
| 11 | `4. EXECUTION & QUALITY` | Remove the now-empty standalone `Terminal Discipline - Proof Over Appearance` block. | Eliminates duplicate authority. |

### Final Structure

No new top-level section is needed. The resulting framework should read as follows:

```text
1. CRITICAL RULES
   Safety Constraints
     The Four Laws
   Operating Discipline
     Verification Standards
       Task-specific proof matrix
     Blast-Radius Management
     Communication

2. MANDATORY GATES
   PRE-EXECUTION GATES
   POST-EXECUTION GATES
     Memory Save Rule
     Final-State Verification [HARD] BLOCK
     Completion Verification Rule [HARD] BLOCK
     Violation Recovery

4. EXECUTION & QUALITY
   Request Analysis & Execution
     Execution Behavior
       Planning & Approach
       Ownership & Completion
       Debugging & Iteration
       Verification & Reasoning
   Quality & Anti-Patterns

5. TOOLS, SEARCH & MCP ROUTING
   Required Tools & Search Routing
     Code Search Decision Tree
     Terminal Command Discipline

6. STARTUP & RESUME RECOVERY
   Directive Capsule
   Recovery Flow
   Daemon CLI Transport Fallback

9. QUICK REFERENCE
   Machine-state task
   Claim completion
```

### Why This Is Minimal

- It adds one hard gate and three small local subsections, not a new policy layer.
- It reuses the existing Four Laws, evidence table, blast-radius rules, tool router and hook section.
- It preserves ADR-003's durable-home decision: all detail remains in `AGENTS.md`. Only the assumption that it must be one subsection changes.
- It keeps the existing Completion Verification Rule unchanged in authority and extends the general gate before it.
- It removes duplicate prose only after every useful invariant has a named owner.

## Sample Integrated Content

The following sample shows the intended density and tone. It is not a full replacement patch.

### Four Laws Clarification

```markdown
4. **HALT** - Stop forward progress and do not claim completion if uncertainty remains, line numbers do not match or tests fail. A failing check may enter the bounded remediation loop in Section 4, but the hard stop remains until the authoritative gate passes.
```

This keeps the blocker intact while resolving the apparent conflict with diagnosis and repair.

### Verification Standards

```markdown
| Standard | Rule |
|---|---|
| **Objective proof plan** | For machine-state tasks, translate the acceptance criteria into 1-5 observable pass/fail checks before changing files. Include exact paths, formats and boundary cases that affect the result. |
| **Observed command evidence** | A command counts as evidence only after its output and exit status are read. Run focused checks during repair, then rerun the authoritative whole gate. |
| **Safe negative control** | When practical and non-destructive, reproduce the exact failing symptom before the fix so the same check proves the change. |
| **Final-state proof** | Before completion, prove that required artifacts exist, objective checks pass from the final state and the scoped diff contains no task-created residue. |
```

```markdown
| Task type | Required proof |
|---|---|
| **Filter or transform** | Inventory every in-scope variant, process each one and rescan for residue. |
| **Computed answer** | Confirm the result through an independent derivation before writing it. |
| **Performance claim** | Measure actual runtime under stated conditions and report the baseline and delta. |
| **Exact artifact** | Verify the required filename, path, format and content shape directly. |
```

### Blast-Radius Management

```markdown
- **Sanitize by persistence boundary** - Distinguish working-tree removal from sensitive-data eradication. Inventory every persistence location, but do not rewrite history, branches or reflogs until the rollback is named and the operator approves the destructive action.
- **Acquire dependencies deliberately** - Prefer tools already available in the project. Installation is a scoped mutation and must pass the same approval and verification rules as other changes. Add a no-install fallback only when the target environment requires it.
```

### Final-State Verification Gate

```markdown
#### FINAL-STATE VERIFICATION [HARD] BLOCK
Trigger: Before claiming a machine-state task is done or that its output works.
1. Confirm every required artifact exists at the exact path and matches the required format.
2. Rerun the objective proof plan and the authoritative workspace gate from the final state. Read the output and exit status.
3. Inspect the scoped diff or status. Remove task-created temporary output and confirm no unrelated file was changed.
4. If any check fails, keep the completion claim blocked, enter the bounded remediation loop or report the blocker with evidence.

The existing Completion Verification Rule remains an additional requirement for spec-packet completion and metadata reconciliation.
```

### Execution Behavior

```markdown
**Planning & Approach:**
- **Define proof before implementation.** Convert acceptance criteria into observable checks and identify the authoritative final gate before changing files.

**Ownership & Completion:**
- **Produce the smallest complete result early.** Prefer a complete in-scope artifact over scaffolding or parallel fallback paths that the target environment does not require.

**Debugging & Iteration:**
- Reproduce the exact symptom when safe, trace the responsible producer and its consumers, fix the root cause and rerun the same check.
- A failed check blocks forward progress and completion under Law 4. If an attempt repeats without new evidence, change the approach or follow Section 7 escalation. Do not repeat the same guess.
```

### Code Search and Terminal Commands

```markdown
| Need | Use |
|---|---|
| Bug or exact failure | **Grep** the exact error or symbol, identify callers and consumers, then **Read** the responsible files before editing. |
```

```markdown
#### Terminal Command Discipline

- Use non-interactive commands and disable pagers. Never open an interactive editor from an automated session.
- Follow the Grep, Glob and Read routes above for workspace discovery and inspection. Terminal commands do not override specialized tool routing.
- Verify that commands, flags, APIs and paths exist before relying on them. If an option is unsupported, inspect the available interface and change the command instead of repeating the guess.
- Start long-running builds only after prerequisites, scope and mutation gates pass. Read the final output and exit status.
```

### Directive Capsule

```markdown
#### Directive Capsule

Hook-capable runtimes may restate the operating disposition on each turn, including comment hygiene, governor and proof-over-appearance guidance. The capsule is a short reminder. This framework remains the durable source of the full rules. See `.opencode/skills/system-spec-kit/references/hooks/injection-contract.md`.
```

### Quick Reference

```markdown
| Task | Flow |
|---|---|
| **Machine-state task** | Define objective checks -> implement the smallest complete result -> run and inspect -> repair against the same checks -> pass Final-State Verification |
| **Claim completion** | Final-State Verification -> packet `validate.sh --strict` when applicable -> checklist evidence -> completion-metadata reconciliation |
```

## Closing Assessment

The protocol should not be deleted or diluted. Its strongest additions are the objective proof plan, safe pre-fix reproduction, exact artifact check, clean final rerun and residue sweep. Those mechanics become more enforceable when they extend the framework's existing authorities instead of competing with them from one standalone block.

Review status: REQUESTED_CHANGES
