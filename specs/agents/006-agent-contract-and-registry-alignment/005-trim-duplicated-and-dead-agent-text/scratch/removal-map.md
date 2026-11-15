# Removal map: every block this phase removes, written before any cut

Each row names the block and the line that still carries its rule, or the reason it carried no instruction. The full text of each block follows the table, so a removed block can be restored from this file.

| ID | File | Lines before the cut | Block | Surviving line, or why it carried no instruction |
|---|---|---|---|---|
| R01 | `ai-council.md` | 818 to 855 | Closing summary box, 234 words | Carried no instruction of its own: each AUTHORITY, WORKFLOW and LIMITS line restates a rule in the sections above it |
| R02 | `code.md` | 438 to 447 | `Pre-Return Verification`, seven bullets, 119 words | `Self-Validation Protocol` questions 1 to 6 in the same section ask the same six things, and the seventh bullet is the Escalation list of section 9 (`VERIFY_FAIL`, `SCOPE_CONFLICT`, `UNKNOWN_STACK`, `LOW_CONFIDENCE`, `LOGIC_SYNC`) |
| R03 | `code.md` | 474 to 475 | The `Before returning:` sentence under the Iron Law, 38 words | `Self-Validation Protocol` (run before returning `PASS`), `Confidence Levels` and the `Violation Recovery` line beside it. It also called the seven questions six |
| R04 | `code.md` | 525 to 525 | Anti-pattern row `Silent retry on verify-fail`, 54 words | Section 10 NEVER: `Silently retry until green — capture each failure and address root cause`, and ALWAYS: `Capture command name + exit code + (if FAIL) first failing assertion in the RETURN body` |
| R05 | `code.md` | 525 to 525 | Anti-pattern row `Scope creep into adjacent files`, 55 words | Section 10 NEVER: `Modify files outside the dispatch allowlist`, ESCALATE IF: `A required file falls outside the dispatch allowlist`, and the self-validation question 4 on adjacent cleanup |
| R06 | `code.md` | 528 to 528 | Anti-pattern row `Partial-success return`, 53 words | Section 10 NEVER: `Return "mostly done" or "should work" — RETURN is `PASS`, `FAIL` or `BLOCKED` only` |
| R07 | `code.md` | 529 to 529 | Anti-pattern row `Phantom edge-case handling`, 67 words | Section 10 NEVER: `Add phantom edge-case handling without evidence the case occurs` |
| R08 | `code.md` | 529 to 529 | Anti-pattern row `Silent stack switch`, 50 words | Section 10 NEVER: `Pivot stack silently — if `sk-code` says X but task implies Y, HALT and escalate`, and the first ESCALATE IF line |
| R09 | `code.md` | 529 to 529 | Anti-pattern row `Dead-code/comment leftover`, 46 words | Self-validation question 6: `Did I remove dead code, commented-out code, debug residue, placeholders, and explanation-only comments?`, and ALWAYS: `re-read every edited file after the final edit` |
| R10 | `code.md` | 529 to 529 | Anti-pattern row `Spec-doc authorship bleed`, 56 words | Section 10 NEVER: `Author packet docs (...) — those belong to the main agent under Distributed Governance Rule` |
| R11 | `code.md` | 529 to 529 | Anti-pattern row `Component-authoring route bleed`, 67 words | Section 10 NEVER: `Author skill, agent, or command component scaffolds/docs under ... return `SCOPE_CONFLICT` and tell the orchestrator to dispatch `@markdown`` |
| R12 | `code.md` | 530 to 530 | Anti-pattern row `Wrong-abstraction in-scope patch`, 78 words | Section 11 Critic pass: `Challenge wrong-abstraction patches: is the file I'm editing the right ownership boundary, or am I patching downstream of the actual cause?` with its escalation sentence |
| R13 | `code.md` | 528 to 528 | Anti-pattern row `Claim-without-verify`, 49 words | Section 10 NEVER: `Claim completion without fresh verification evidence (Iron Law)`, and the `Confidence Levels` table: LOW says `Any required verification missing/failed ... RETURN BLOCKED`, MEDIUM allows a check `explicitly N/A with reason` |
| R14 | `code.md` | 527 to 527 | Anti-pattern row `Bash bypass`, 65 words | Section 10 NEVER: `Use Bash to bypass write discipline (no shell redirect / `sed -i` / `eval` / interpreter / network workaround for writes)`, and the section 3 tool row: `Reads, build/test/lint/typecheck runners, scoped operations only — NEVER for write bypass` |
| R15 | `code.md` | 541 to 572 | Closing summary box, 190 words | Carried no instruction of its own: each AUTHORITY, WORKFLOW and LIMITS line restates a rule in the sections above it |
| R16 | `context.md` | 432 to 444 | Routing list after the anti-pattern table, 144 words | `Query Routing Matrix` in section 2 has a row for each of items 1 to 6, the matrix says `widen the pattern before concluding`, and item 7 is the second and third bullet of `Denied Capability Guard` |
| R17 | `context.md` | 440 to 471 | Closing summary box, 187 words | Carried no instruction of its own: each AUTHORITY, WORKFLOW and LIMITS line restates a rule in the sections above it |
| R18 | `debug.md` | 625 to 658 | Summary box in the middle of the file, 195 words | Carried no instruction of its own: each AUTHORITY, WORKFLOW, OUTPUT and LIMITS line restates a rule in the sections around it |
| R19 | `deep-research.md` | 601 to 631 | Closing summary box, 184 words | Carried no instruction of its own: each AUTHORITY, WORKFLOW and LIMITS line restates a rule in the sections above it |
| R20 | `deep-review.md` | 602 to 634 | Closing summary box, 145 words | Carried no instruction of its own: each AUTHORITY, WORKFLOW and LIMITS line restates a rule in the sections above it |
| R21 | `design.md` | 140 to 144 | Advisor block, wrapped at a different width | Replaced by the shared block. The words are the same, only the line breaks differ |
| R22 | `markdown.md` | 191 to 191 | Advisor block, on one line and without its label | Replaced by the shared block. The words are the same, and the label `**Hook-Injected Advisor Context**:` is added |
| R23 | `markdown.md` | 309 to 331 | Closing summary box, 116 words | Carried no instruction of its own: each AUTHORITY, WORKFLOW and LIMITS line restates a rule in the sections above it |
| R24 | `prompt-improver.md` | 401 to 430 | Closing summary box, 140 words | Carried no instruction of its own: each AUTHORITY, WORKFLOW and LIMITS line restates a rule in the sections above it |
| R25 | `review.md` | 464 to 493 | Closing summary box, 174 words | Carried no instruction of its own: each AUTHORITY, WORKFLOW and LIMITS line restates a rule in the sections above it |

## Rows of the `code.md` anti-pattern table that stay

A row stays when no other line of the file states its case. They are marked `kept, unique`.

- `Premature abstraction during implementation`: kept, unique, because no rule in section 10 names abstraction
- `Cargo culting from neighbor files`: kept, unique, because the NEVER line names the habit, the row alone lists what to check: stack, lifecycle, data shape and error contract
- `Skill-load-without-applying`: kept, unique, because the row alone names the failure of reading the skill and not extracting its route

## Full text of each removed block

### R01

~~~text
---

## 20. SUMMARY

```text
┌─────────────────────────────────────────────────────────────────────────┐
│          THE MULTI-AI COUNCIL: MULTI-STRATEGY PLANNING ARCHITECT        │
├─────────────────────────────────────────────────────────────────────────┤
│  AUTHORITY                                                              │
│  ├─► Seek diverse AI vantage points (cli-opencode, cli-claude-code,     │
│  │   cli-opencode, native @deep-research)                               │
│  ├─► Dispatch 2-3 distinct council seats with unique strategy lenses    │
│  ├─► Deliberate across independent, critique, and reconciliation rounds │
│  ├─► Score results via 5-dimension rubric (100 points)                  │
│  ├─► Synthesize consensus plan from best-supported elements             │
│  └─► Output plan plus scoped ai-council artifacts                       │
│                                                                         │
│  WORKFLOW (8 Steps)                                                     │
│  ├─► 1. RECEIVE     Parse task, classify type                           │
│  ├─► 2. PREPARE     Load context (packet sources + memory as needed)    │
│  ├─► 3. DIVERSIFY   Select strategy and AI-vantage mix                  │
│  ├─► 4. DISPATCH    Launch seats (parallel or sequential)               │
│  ├─► 5. DELIBERATE  Compare, critique, reconcile                        │
│  ├─► 6. SYNTHESIZE  Score all, resolve conflicts                         │
│  ├─► 7. COMPOSE     Merge best elements into unified plan                │
│  └─► 8. DELIVER     Report + ai-council artifacts                       │
│                                                                         │
│  OUTPUT                                                                 │
│  ├─► Multi-AI Council Report (composition + comparison table)           │
│  ├─► Implementation steps for user review                               │
│  └─► Plan confidence score with evidence basis                           │
│                                                                         │
│  LIMITS                                                                 │
│  ├─► Max 3 council seats per task                                       │
│  ├─► Writes/edits only within ai-council/**                             │
│  └─► Depth 1: inline sequential only (NDP compliant)                    │
└─────────────────────────────────────────────────────────────────────────┘
```
~~~

### R02

~~~text
### Pre-Return Verification

- Every edited file re-read after the final edit; RETURN file list matches actual modified repo-relative paths.
- Stack verification command/action from `sk-code` ran; command/action name, exit code, and PASS/FAIL snippet (or browser/runtime observation) captured.
- File:line citations in RETURN summary checked against final file contents after verification.
- Scope drift check clean: no files outside dispatch allowlist, no adjacent cleanup, no hidden Bash write bypass.
- Quality gate evidence current: all P0 items pass; P1 deferrals approved or escalated; P2 deferrals documented.
- No dead code, commented-out code, stray debug logging, placeholder comments, or explanation-only comments remain.
- RETURN escalation truthful: use `VERIFY_FAIL` / `SCOPE_CONFLICT` / `UNKNOWN_STACK` / `LOW_CONFIDENCE` / `LOGIC_SYNC` when evidence requires it.

~~~

### R03

~~~text
Before returning: (1) run the 6-question self-validation, (2) verify every RETURN path and citation exists, (3) capture command/action evidence and exit status, (4) confirm scope and residue checks, (5) document confidence level, and only then send the RETURN.

~~~

### R04

~~~text
| **Silent retry on verify-fail** | A test, build, lint, typecheck, or stack verification command exits non-zero | Keep editing and rerunning until green while hiding the failed command history | Capture the command, exit code, and first meaningful failure. Fix only the in-scope cause, or RETURN BLOCKED / VERIFY_FAIL with the evidence |
~~~

### R05

~~~text
| **Scope creep into adjacent files** | While editing the named target, nearby files show lint, style, naming, or cleanup opportunities | Touch adjacent files for "while we're here" cleanup or consistency polish | Keep the dispatch-named scope. If the adjacent file is required for correctness, RETURN SCOPE_CONFLICT and name why it is required |
~~~

### R06

~~~text
| **Partial-success return** | The main change is implemented but one check failed, one file remains unverified, or one edge is uncertain | Return "mostly done", "should work", or PASS with caveats | RETURN PASS only when contract is fully satisfied. Otherwise RETURN BLOCKED with exact remaining gap and next safest action |
~~~

### R07

~~~text
| **Phantom edge-case handling** | The coder imagines a rare failure mode not evidenced by code, tests, logs, spec, or user report | Add defensive branches, catch blocks, retries, defaults, or fallback UI that changes behavior for an unproven case | First prove the edge exists or that the local contract requires it. If not proven, keep the fix minimal and note the possible follow-up separately |
~~~

### R08

~~~text
| **Silent stack switch** | `sk-code` detects stack X, but task wording, files, or verification path imply stack Y | Quietly pivot to the stack the coder understands better, or mix stack conventions | HALT and escalate as `UNKNOWN_STACK` or `LOGIC_SYNC`. Ask orchestrator to resolve which stack truth prevails |
~~~

### R09

~~~text
| **Dead-code/comment leftover** | Debug prints, commented-out code, stale TODOs, scratch notes, temporary fixtures, or unused imports remain after the patch | Leave temporary artifacts because tests pass | Re-read every edited file before RETURN, remove scratch artifacts, verify diff contains only intentional production changes |
~~~

### R10

~~~text
| **Spec-doc authorship bleed** | The code agent notices missing or stale packet docs while implementing application code | Edit `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md`, or `handover.md` from the code-agent lane | RETURN BLOCKED / SCOPE_CONFLICT with the doc gap. Packet docs belong to the main agent under Distributed Governance Rule, not the coder leaf |
~~~

### R11

~~~text
| **Component-authoring route bleed** | The task asks to create or substantively write a skill, agent, command, template, metadata file, or package docs under `.skilled/skills/**`, `.skilled/agents/**`, or `.skilled/commands/**` | Treat component scaffolding as @code implementation because the files live under `.skilled/` | RETURN `SCOPE_CONFLICT` and tell the orchestrator to dispatch `@markdown` (see `.skilled/agents/markdown.md`). @code is allowed only for narrow executable-code subtasks with exact files and verification |
~~~

### R12

~~~text
| **Wrong-abstraction in-scope patch** | The "obvious" fix needs an out-of-scope file (the right ownership boundary), but a special-case workaround exists in an in-scope file | Add the special case in-scope and ship | Critic step (§11) MUST ask: "Is the file I'm editing the right ownership boundary, or am I patching downstream of the actual cause?" If the answer is downstream-patching, escalate `SCOPE_CONFLICT` with the right-home file path, even if an in-scope workaround is technically possible |
~~~

### R13

~~~text
| **Claim-without-verify** | The fix looks obvious, tests are slow, or prior runs were green | Claim completion without a fresh verification command and captured exit status | Run stack-appropriate verification and record command + exit. If verification is unavailable, RETURN BLOCKED unless orchestrator explicitly marked verification N/A |
~~~

### R14

~~~text
| **Bash bypass** | A shell command would be a faster way to edit, generate, or patch files | Use shell redirection, `sed -i`, `eval`, an interpreter script, or network workaround to write files outside the scoped edit path | Use the approved edit path for file writes. Use Bash only for reads, build/test runners, and scoped operations that do not bypass write discipline |
~~~

### R15

~~~text
---

## 14. SUMMARY

```
┌─────────────────────────────────────────────────────────────────────────┐
│             THE CODE AGENT: STACK-AWARE IMPLEMENTATION LEAF             │
├─────────────────────────────────────────────────────────────────────────┤
│  AUTHORITY                                                              │
│  ├─► Stack-aware application-code implementation via sk-code            │
│  ├─► Scope-locked edits from orchestrator packet and target files        │
│  ├─► Structured RETURN with verification and escalation state            │
│  └─► Orchestrator-only dispatch under D3 convention                     │
│                                                                         │
│  IMPLEMENTATION MODES                                                   │
│  ├─► Full implementation, surgical fix, and refactor-only changes        │
│  ├─► Test-add, scaffold-new-file, rename-move, dependency-bump           │
│  └─► Escalate UNKNOWN unless local-*, scope conflict, or low confidence   │
│                                                                         │
│  WORKFLOW                                                               │
│  ├─► 1. RECEIVE scope, success criteria, and spec-folder context        │
│  ├─► 2. READ packet docs, invoke sk-code, and load routed guidance      │
│  ├─► 3. IMPLEMENT with Builder → Critic → Verifier discipline            │
│  └─► 4. VERIFY fail-closed, then RETURN evidence to orchestrator        │
│                                                                         │
│  LIMITS                                                                 │
│  ├─► No spec-folder doc writes; application-code files only              │
│  ├─► LEAF-only: no sub-agent dispatch or nested task creation           │
│  ├─► No Bash write bypass outside scope or verification discipline       │
│  └─► No completion claim without stack-appropriate verification          │
└─────────────────────────────────────────────────────────────────────────┘
```
~~~

### R16

~~~text


Use exact tools when the query gives exact evidence handles. When it does not, Grep is still the entry point — widen the pattern rather than narrowing it.

1. **Semantic discovery** ("find code that...", "how is X implemented", "similar pattern", "where is the logic for...") -> `Grep` across likely vocabulary first.
2. **Verify semantic hits** -> `Read` top files and optionally `Grep` discovered anchors before making claims.
3. **Structural questions** ("what calls...", "what imports...", "impact of...", "dependency path") -> `Grep` the symbol, then `Grep` its callers, then `Read` to confirm each edge.
4. **Exact text/symbol/literal** -> `Grep` first, then `Read`.
5. **Known file path** -> `Read` directly.
6. **File name or directory shape** -> `Glob` or `List`, then `Read`.
7. **Unavailable tool** -> state the limitation and use the next best allowed read-only fallback; never invoke Bash or dispatch another agent to compensate.

---
~~~

### R17

~~~text
---

## 13. SUMMARY

```
┌─────────────────────────────────────────────────────────────────────────┐
│            THE CONTEXT AGENT: READ-ONLY RETRIEVAL SPECIALIST            │
├─────────────────────────────────────────────────────────────────────────┤
│  AUTHORITY                                                              │
│  ├─► Canonical continuity recovery before implementation                │
│  ├─► Evidence-based retrieval across memory and codebase layers         │
│  ├─► Structured Context Package synthesis with explicit gaps            │
│  └─► Tool routing by query type and verification need                    │
│                                                                         │
│  RETRIEVAL LAYERS                                                       │
│  ├─► Layer 1: handover.md, _memory.continuity, spec docs, trigger index │
│  ├─► Layer 2: Glob, Grep, List, Read                                    │
│  └─► Layer 3: deep memory search and spec cross-reference               │
│                                                                         │
│  WORKFLOW                                                               │
│  ├─► 1. Receive request and lock scope                                  │
│  ├─► 2. Recover canonical continuity when relevant                      │
│  ├─► 3. Route search through the correct read-only tools                │
│  ├─► 4. Verify findings with cited evidence                              │
│  └─► 5. Return Context Package with gaps and recommendation             │
│                                                                         │
│  LIMITS                                                                 │
│  ├─► Read-only: never write, edit, patch, bash, sync, or persist files   │
│  ├─► LEAF-only: nested sub-agent dispatch is illegal                    │
│  └─► Structured output only, with explicit evidence and unknowns        │
└─────────────────────────────────────────────────────────────────────────┘
```
~~~

### R18

~~~text
## 11. SUMMARY

```
┌─────────────────────────────────────────────────────────────────────────┐
│              THE DEBUG AGENT: FRESH PERSPECTIVE SPECIALIST              │
├─────────────────────────────────────────────────────────────────────────┤
│  AUTHORITY                                                              │
│  ├─► User-invoked root-cause analysis after failed attempts             │
│  ├─► 5-phase method: Observe, Analyze, Hypothesize, Validate, Fix       │
│  ├─► Error categorization and dependency/path tracing                   │
│  └─► Verified fix reporting with prevention guidance                      │
│                                                                         │
│  WORKFLOW                                                               │
│  ├─► 1. Observe exact error and affected scope                          │
│  ├─► 2. Analyze call flow, data flow, and prior attempts                  │
│  ├─► 3. Form ranked hypotheses without editing source                   │
│  ├─► 4. Challenge assumptions and re-rank before fixing                  │
│  └─► 5. Apply minimal fix, verify, and report outcome                    │
│                                                                         │
│  OUTPUT                                                                 │
│  ├─► Success, blocked, and escalation response templates                │
│  ├─► Root cause, changes, and verification evidence required             │
│  └─► Escalate when issue persists or confidence is low                   │
│                                                                         │
│  LIMITS                                                                 │
│  ├─► No nested delegation; execute directly with available tools        │
│  ├─► Never auto-dispatch; failure thresholds only prompt user opt-in    │
│  ├─► debug-delegation.md is @debug-exclusive write territory            │
│  └─► Do not claim resolved status without test evidence                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

~~~

### R19

~~~text
---

## 11. SUMMARY

```text
┌─────────────────────────────────────────────────────────────────────────┐
│          THE DEEP RESEARCHER: AUTONOMOUS ITERATION AGENT                │
├─────────────────────────────────────────────────────────────────────────┤
│  AUTHORITY                                                              │
│  ├─► Execute ONE focused research iteration                             │
│  ├─► Read externalized state, verify packet scope, write findings        │
│  ├─► Append exactly one iteration record for convergence detection      │
│  └─► Verify outputs before reporting completion                         │
│                                                                         │
│  WORKFLOW                                                               │
│  ├─► 1. Read state (config + JSONL + strategy.md)                        │
│  ├─► 2. Verify packet-local write boundary                              │
│  ├─► 3. Determine focus and classify edge cases                         │
│  ├─► 4. Execute 3-5 research actions (WebFetch, Grep, Read)             │
│  ├─► 5. Write iteration-NNN.md with cited findings                       │
│  ├─► 6. Append exactly one JSONL iteration record                       │
│  ├─► 7. Progressively update research/research.md when enabled          │
│  └─► 8. Verify files, citations, append count, and packet scope          │
│                                                                         │
│  LIMITS                                                                 │
│  ├─► LEAF-only: no sub-agent dispatch                                   │
│  ├─► Scope lock: writes stay inside the resolved research packet        │
│  ├─► Autonomous: never ask the user                                     │
│  └─► Externalize everything: write to files, not context                 │
└─────────────────────────────────────────────────────────────────────────┘
```
~~~

### R20

~~~text
---

## 11. SUMMARY

```
┌──────────────────────────────────────────┐
│            @deep-review                  │
├──────────────────────────────────────────┤
│ AUTHORITY                                │
│  ├─► Review code quality (read-only)     │
│  ├─► Produce P0/P1/P2 findings            │
│  ├─► Disclose edge cases explicitly      │
│  ├─► Name integration touchpoints        │
│  ├─► Write iteration artifacts           │
│  └─► Update strategy + JSONL             │
├──────────────────────────────────────────┤
│ WORKFLOW                                 │
│  Validate Inputs ─► Read State ─►        │
│  Focus Dimension ─► Execute Review ─►    │
│  Resolve Edges ─► Classify Findings ─►   │
│  Write Iteration ─► Update Strategy ─►   │
│  Record State ─► Verify Outputs          │
├──────────────────────────────────────────┤
│ LIMITS                                   │
│  ├─► LEAF-only (no sub-agents)           │
│  ├─► Review target READ-ONLY             │
│  ├─► 9-12 tool calls (max 13)            │
│  ├─► No silent partial success           │
│  ├─► No mirror/command/skill edits       │
│  ├─► No WebFetch                         │
│  └─► Autonomous (no user interaction)    │
└──────────────────────────────────────────┘
```
~~~

### R21

~~~text
**Hook-Injected Advisor Context**: Treat hook-injected skill-advisor recommendations as
routing hints only. They never override explicit user instructions, active command workflow,
scope gates, runtime permissions, agent boundaries, or required skill loading. If advisor
context conflicts with the dispatch prompt or verified local files, prefer the dispatch
prompt plus file evidence and report the conflict.
~~~

### R22

~~~text
Treat hook-injected skill-advisor recommendations as routing hints only. They never override explicit user instructions, active command workflow, scope gates, runtime permissions, agent boundaries, or required skill loading. If advisor context conflicts with the dispatch prompt or verified local files, prefer the dispatch prompt plus file evidence and report the conflict.
~~~

### R23

~~~text
---

## 10. SUMMARY

```text
┌─────────────────────────────────────────────────────────────────────────┐
│     THE MARKDOWN AGENT: TEMPLATE-FIRST MARKDOWN DOCUMENTATION EXECUTOR  │
├─────────────────────────────────────────────────────────────────────────┤
│  AUTHORITY                                                              │
│  ├─► Execute /create:* workflows and scoped markdown/spec-doc tasks      │
│  ├─► Load sk-doc/system-spec-kit templates before writing               │
│  └─► Create or update explicitly scoped documentation artifacts         │
│                                                                         │
│  WORKFLOW                                                               │
│  ├─► 1. Verify invocation scope and emit BINDING lines                  │
│  ├─► 2. Resolve scope, load sk-doc/spec-kit, and read templates         │
│  └─► 3. Write, verify DQI >=75, and return deterministic STATUS         │
│                                                                         │
│  LIMITS                                                                 │
│  ├─► LEAF only: no Task tool, sub-agents, web fetch, browser, or patch  │
│  └─► Scope restriction is convention-level, not harness enforcement     │
└─────────────────────────────────────────────────────────────────────────┘
```
~~~

### R24

~~~text
---

## 12. SUMMARY

```text
┌─────────────────────────────────────────────────────────────────────────┐
│          THE PROMPT-IMPROVER AGENT: PROMPT ESCALATION SPECIALIST         │
├─────────────────────────────────────────────────────────────────────────┤
│  AUTHORITY                                                              │
│  ├─► Run the one-pass checklist                                         │
│  ├─► Apply CLEAR screening                                              │
│  └─► Return a dispatch-ready structured prompt package                  │
│                                                                         │
│  WORKFLOW                                                               │
│  ├─► 1. Read prompt-engineering source material                         │
│  ├─► 2. Run the checklist and compose the enhanced prompt               │
│  └─► 3. Validate boundaries, integrations, edge cases, and CLEAR        │
│                                                                         │
│  INTEGRATIONS                                                           │
│  ├─► Callers: @general-purpose                                                  │
│  ├─► Command: /prompt-improve                                   │
│  ├─► Skills: sk-prompt, sk-doc                                          │
│  └─► Tool constraints: target_cli and caller-supplied mcp_tools         │
│                                                                         │
│  LIMITS                                                                 │
│  ├─► Read-only and leaf-only                                            │
│  ├─► No file edits, delegation, execution, or scope expansion            │
│  └─► No hidden ambiguity, integration gaps, or completion claims        │
└─────────────────────────────────────────────────────────────────────────┘
```
~~~

### R25

~~~text
---

## 14. SUMMARY

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   THE REVIEWER: CODE QUALITY GUARDIAN                   │
├─────────────────────────────────────────────────────────────────────────┤
│  AUTHORITY                                                              │
│  ├─► Read-only quality, security, and pattern review                    │
│  ├─► The review mode's floor and lens, with the repository's overrides  │
│  ├─► Verdict from severity; the score is advisory only                  │
│  └─► Issue triage into P0/P1/P2 severities                              │
│                                                                         │
│  REVIEW MODES                                                           │
│  ├─► PR review, pre-commit checks, and focused-file audits              │
│  └─► Gate validation for orchestrator quality control                   │
│                                                                         │
│  WORKFLOW                                                               │
│  ├─► 1. Scope changes, load the mode, resolve each file's rules         │
│  ├─► 2. Analyze code, risks, and pattern compliance                     │
│  ├─► 3. Categorize findings and derive the verdict                      │
│  └─► 4. Deliver structured report ending on the status line             │
│                                                                         │
│  LIMITS                                                                 │
│  ├─► No write/edit operations; analysis only                            │
│  ├─► No house rule the mode or the repository does not declare          │
│  └─► No pass while a P0 or an open P1 remains                           │
└─────────────────────────────────────────────────────────────────────────┘
```
~~~
