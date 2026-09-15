**Verdict: safe after the listed repairs.** Every hard blocker, gate output token, mandatory wait and the machine-read Gate 1 line survive unchanged, but the Gate 4 rewrite rests on a false audit finding and four rule files plus three agent mirrors now point at AGENTS.md headings that no longer exist.

Evidence for the unchanged core: the Four Laws, PLAN-WORKFLOW LOCK steps 1-3, Comment Hygiene, the Gate 3 fires-when sentence, the options list and the tokens `SKILL ROUTING:`, `ARTIFACT:`, `REPO RULES:`, `LOGIC-SYNC REQUIRED:` and `Before I proceed, I need to ask about documentation:` are byte-for-byte at `AGENTS.md:13-16, 20-25, 30, 46-54, 82, 97, 104, 242`. The Gate 1 line at `AGENTS.md:62` has the same md5 as `agents-md.original-496.md:81`, and `sync-gate1-pointers.cjs --check` printed `PASS: 2 instruction files carry the root Gate 1 lookup` with exit 0.

**1. Loss table** (original line, first six words, where it lives now)

| Orig | First six words | Lives now |
|---|---|---|
| 3 | Universal behavior framework defining guardrails, standards | `AGENTS.md:3` |
| 9 | Code work routes through the sk-code | `AGENTS.md:81` + `sk-code/SKILL.md:132` (surface detection, disambiguation) |
| 11 | This document is shared across repositories | `AGENTS.md:3, 91, 96` + `REPO RULES.md:29-32` |
| 13 | The Iron Law: NO completion claims | `AGENTS.md:15` (Law 3). The name is still cited by `.opencode/agents/code.md:64` and its `.claude` and `.pi` mirrors. See defect 6e. |
| 21, 32, 50, 88, 146, 159, 173, 202, 231-233, 320, 385, 393, 415, 474, 483, 492 | Expanded by ... blockquotes | `REPO RULES.md:38-51` trigger table, routed by `AGENTS.md:9` |
| 28 | Law 4 blocks forward progress and | `AGENTS.md:16` |
| 40 tail | A blocking contract is step 2 | `AGENTS.md:26`, shortened, same meaning |
| 42 | Reinventing a workflow's core feature because | `AGENTS.md:23-25`. The HARD-violation label for this specific failure is gone. |
| 73 | Phase-qualification guard: a new phased packet | `AGENTS.md:55` + `phase-definitions.md:59-62, 73-74` |
| 74 | New/unrelated means outside the active packet's | `quick-reference.md:240, 258, 276` via `AGENTS.md:55` |
| 99 tail | The CLI is the advisor's single front door | `system-skill-advisor/SKILL.md:297` carries the whole dropped sentence, `skill-advisor-hook.md:38, 101, 147` |
| 102 | Each skill's router owns what applies | `skill-hub-routing.md:49-60`. "already in context is not re-read" only at `REPO RULES.md:14`. "follow it anyway and propose the amendment" is **LOST** for the artifact-trigger case. See defect 7. |
| 104 tail | (a few characters in one file); any | `AGENTS.md:98, 222` |
| 108 | Skills are on-demand domain expertise invoked | `AGENTS.md:80-83` |
| 110 | Advisor metadata placement. These filenames also | `skill-root-metadata-contract.md:32, 65-71`, reached through `skill-hub-routing.md:108`, loaded by `REPO RULES.md:51` |
| 112 | A parent hub projects one advisor identity | `skill-hub-routing.md:43, 49-60` + `parent-skills-nested-packets.md:112-114`. Surviving clause `AGENTS.md:145` |
| 115 | Gate 2 and the deep-mode SKILL.md invariants | `deep-research/SKILL.md:263, 359`, `deep-review/SKILL.md:50` |
| 117 | When command-spec-kit matches alongside cli-* | `AGENTS.md:88` rewritten on a false premise. See defect 1. |
| 123 tail | Two triggers fire → load both | `REPO RULES.md:15-18` |
| 124 | Loading means reading. A rule you named | `AGENTS.md:95` + `REPO RULES.md:13-14` |
| 125 | This gate binds the LOAD, not the | `AGENTS.md:96` + `REPO RULES.md:20-32` |
| 134 | Exception: If the user already answered | `AGENTS.md:57` |
| 148 | Spend lavishly where confirmation is cheapest | **LOST**. No hit in `repo-rules/`. A principle, not a rule. |
| 150-153 | Two registers: While working: Clipped | `uncertainty-and-honesty.md:117-123`, `presenting-decisions.md:117-126`, register pick at `communication.md:65-72` which `AGENTS.md:252` loads every reply |
| 155 | Follow the brief's intent, not just | **LOST**. Nearest is `scope-discipline.md:115-117`, which leans the other way (build what was specified). |
| 161 | Match effort to blast-radius. Open non-trivial | `blast-radius.md:46-54`. Narrowed: fires only on a `REPO RULES.md:44` trigger now, not on all non-trivial work. |
| 163-165 | Name what still speaks the old | `blast-radius.md:100-114, 117-134, 138-142` |
| 169 | Flow: Parse request → Read files first | `AGENTS.md:13`, `prevent-overengineering.md:89-98`, `AGENTS.md:157-162` |
| 176-178 | Plan before acting on multi-step work | `AGENTS.md:116`, `scope-discipline.md:135-153`, `evidence-and-proof.md:162-169, 203-217` |
| 179 | Make one pre-write pass before adding | `prevent-overengineering.md:89-98, 151-152`. The rungs pointer is gone, see defect 6d. |
| 180 | Repo-local rules load at Gate 5 | `AGENTS.md:9, 90-98`, `REPO RULES.md:3-6` |
| 183 | Take responsibility for issues encountered during | `root-cause-and-debugging.md:129-133` |
| 184 | Produce the smallest complete result early | Partial only. `prevent-overengineering.md:136-139` (fallbacks), `scope-discipline.md:52-58` (narrowing). "complete in-scope artifact over scaffolding" is stated nowhere. |
| 185-186 | Do not stop early when the | `AGENTS.md:117-118`, `scope-discipline.md:127-131` |
| 189-191 | Reproduce the exact symptom when safe | `root-cause-and-debugging.md:49-64, 84-97, 103-105` |
| 192 tail | That count governs this debugging loop | **LOST**. See defect 3. |
| 195-196 | Use frequent self-checks and reasoning loops | Each rule's SELF-CHECK, e.g. `evidence-and-proof.md:226-240, 203-217` |
| 204-206, 208-209 | Solve the stated problem, at the | `prevent-overengineering.md:44-49, 136-143`, `evidence-and-proof.md:219-222`, `uncertainty-and-honesty.md:76-85`, `AGENTS.md:270` |
| 213 | One table, not a checklist to | Dropped meta. Table intact `AGENTS.md:129-137` |
| 247 | Proof plans, negative controls, final-state proof | `evidence-and-proof.md:116-121, 139-149, 162-169, 173-182` |
| 258 | The Completion Verification Rule remains an | Cross-reference, `AGENTS.md:164` follows directly |
| 262 | (exit 0 = pass, including a run | `validation-rules.md:44`, `system-spec-kit/SKILL.md:115-119` |
| 263-268 | Load checklist.md → verify ALL items | `AGENTS.md:167-168`, `system-spec-kit/SKILL.md:439-456` |
| 269 | When SPECKIT_COMPLETION_FRESHNESS=true, completion claims must | `validation-rules.md:114-128`, runs inside the `--strict` call `AGENTS.md:166` mandates |
| 274-278 | The harness has four ways of | `AGENTS.md:166`, `validation-rules.md:759-782` |
| 284 | Compose the session JSON yourself rather | **LOST**. `save-workflow.md:151-152` names the mechanism, not the obligation. |
| 285 | The save writes metadata, not prose | `save-workflow.md:255-270`, `commands/speckit/save.md:61`. The frontmatter-shortcut exception is LOST and `AGENTS.md:185` now binds the strict form. The writer pointer is gone, see defect 4. |
| 286 | Read the post-save quality review before | `save-workflow.md:553-559` (MUST patch HIGH). `save.md:61` says "when practical", weaker. |
| 290-294 | The bound packet's goal.md is the | `AGENTS.md:178`, `system-spec-kit/SKILL.md:483`. "acknowledge in one line ... do not ask whether to proceed" lives only in `speckit-plan.yaml:204`, `speckit-implement.yaml:169`, `speckit-complete.yaml:262`, `speckit-resume-*.yaml:48`. |
| 302-303 | Aligned with ORIGINAL request? No scope | `scope-discipline.md:157-166`, `AGENTS.md:167-169`, `system-spec-kit/SKILL.md:523` |
| 315 tail | Semantic paraphrase, vector and BM25 fusion | `system-spec-kit/SKILL.md:466` |
| 316 tail | Triggers: worktree, branch, commit, merge | `sk-git/SKILL.md:78-79, 99` |
| 324-331 | Ask-first worktree vs. branch ... Git hooks | `AGENTS.md:198-200`, `sk-git/SKILL.md:276, 295-297, 301-307, 361-362, 375, 382, 488-494, 509, 518` |
| 335 | Match the need to a capability | `AGENTS.md:204`, `uncertainty-and-honesty.md:70`, `root-cause-and-debugging.md:99` |
| 346 | Follow the capability routes above for | **LOST**. No hit in `repo-rules/`. Low value. |
| 347-348 | Verify that commands, flags, APIs, and | `root-cause-and-debugging.md:99-101`, `blast-radius.md:138-142` |
| 353, 357 | Two systems. Native MCP servers are | `AGENTS.md:216`, `mcp-code-mode/SKILL.md:258-259, 271-296, 303-312` |
| 355 | The Skill Advisor runs outside both | **LOST** as a negative claim. Positive form at `system-skill-advisor/SKILL.md:297`. Cut before the audit. |
| 367, 371 tail | not this document's. Each has one | `AGENTS.md:224`, `system-spec-kit/SKILL.md:536` |
| 375 tail | Discovery keys on spec.md, so a | **LOST**. No hit under `references/structure/`. A fact, not a rule. |
| 389 | If implementation evidence conflicts with the | `uncertainty-and-honesty.md:89-99` |
| 401-405 | How a reply reads is governed | `AGENTS.md:252`, `REPO RULES.md:47-50` |
| 417-436 | When using the orchestrate agent or | `delegation-and-orchestration.md` whole, `AGENTS.md:260`, `system-spec-kit/SKILL.md:59-61` |
| 442-468 | Entry points only. Where a Flow | `AGENTS.md:266`. Orders verified: 448 and 465 at `SKILL.md:462`, 450 at `sk-code/SKILL.md:39`, 453 at `sk-git/SKILL.md:330-336`, 463 at `AGENTS.md:157-168`, 464 at `AGENTS.md:178`, 466 at `SKILL.md:464` + `retrieval-conventions.md:44` + `retrieval/README.md:78`. |
| 472-479 | Documentation & Honesty table | `AGENTS.md:270, 69-74`, `uncertainty-and-honesty.md:62-72` |
| 481-488 | Dispatch Rules table | `AGENTS.md:271`, `delegation-and-orchestration.md:69-91`. Agent I/O contract still pointed at from `system-spec-kit/SKILL.md`. Heading now dangling, see defect 6b. |
| 490-494 | At a fork, lead with your | `AGENTS.md:252`, `presenting-decisions.md:48, 70-74` |

**2. Delegate-truth table**

| Audit row | Delegate line checked | Verdict |
|---|---|---|
| 1 | `system-spec-kit/SKILL.md:462` continuity ladder, `sk-git/SKILL.md:330-336`, `sk-code/SKILL.md:39` | confirmed |
| 2 | `REPO RULES.md:57-70`, `uncertainty-and-honesty.md:48`, `presenting-decisions.md:48` | confirmed |
| 3 | `scope-discipline.md:135-153`, `evidence-and-proof.md:203-217`, `root-cause-and-debugging.md:129-133, 49-60`, `prevent-overengineering.md:89-98` | confirmed, except bullet 177 (smallest complete result) had no delegate cited and none exists |
| 4 | `uncertainty-and-honesty.md:117, 122`, `scope-discipline.md:113-117`, `evidence-and-proof.md:100-112` | confirmed. "Nothing replaces them" is honest: line 148 is lost. |
| 5 | `system-spec-kit/SKILL.md:61`, `REPO RULES.md:88-92` | confirmed |
| 6 | `sk-code/SKILL.md:132` | confirmed |
| 7 | `sk-git/SKILL.md:276, 361, 494, 295-297, 307` | confirmed. Disable flags are deferred to `references/continuous-integration.md`, which I did not open. |
| 8 | `skill-root-metadata-contract.md:32`, `skill-hub-routing.md:43` | confirmed. Note the rule is tier `normal` and loads only on the `REPO RULES.md:51` action. |
| 9 | `REPO RULES.md:38-51`. Claim that `root-cause-and-debugging.md` carries none of the three halt conditions | confirmed by full read |
| 10 | `validation-rules.md:759-763`, taxonomy at `:44` inside §1 | confirmed |
| 11 | `uncertainty-and-honesty.md:93, 95-99`, `root-cause-and-debugging.md:137-146` | confirmed |
| 12 | `prevent-overengineering.md:44-45, 136-139, 141, 130-131`, `evidence-and-proof.md:219-222`, `uncertainty-and-honesty.md:76-85` | confirmed |
| 13 | `skill-hub-routing.md:66` | confirmed |
| 14 | `quick-reference.md:270-276`, `phase-definitions.md:59-62` | confirmed. Applied form kept the option rationales at `AGENTS.md:50-54`, safer than the audit's collapse. |
| 15 | `evidence-and-proof.md:237`, `validation-rules.md:123` confirmed. `save-workflow.md:24-28` | **weaker than claimed**: those lines govern CLI-target authority, not composition or the post-save review. The review is at `:553-559`, the composition obligation is nowhere. |
| 16 | structural | confirmed |
| 17 | `root-cause-and-debugging.md:99-101`, `blast-radius.md:138-142` | confirmed. Applied form kept "Read the final output and exit status" at `AGENTS.md:212`, which the audit's replacement dropped. |
| 18 | `REPO RULES.md:66-69`, `communication.md:40-47`. Zero prior refs to `communication-prose.md` | confirmed |
| 19 | `AGENTS.md:13`, `prevent-overengineering.md:89-98` | confirmed |
| 20 | `040/.../implementation-summary.md:131` (audit said 130), `system-spec-kit/SKILL.md:460`, `uncertainty-and-honesty.md:70` | confirmed |
| 21 | `blast-radius.md:46-54, 57-63, 100-114, 117-134, 138-142` | confirmed |
| 22 | `system-spec-kit/SKILL.md:483` | confirmed for two bullets. The after-set clause is not at `:483` and lives only in the speckit YAMLs. |
| 23 | `prevent-overengineering.md:103-104` | confirmed |
| 24 | `evidence-and-proof.md:181-182`, `REPO RULES.md:29` | confirmed |
| 25 | `AGENTS.md:57` | confirmed |
| 26 | `uncertainty-and-honesty.md:48` | confirmed |
| 27 | `scope-discipline.md:157-166`, `system-spec-kit/SKILL.md:523` | confirmed |
| word 102 | pre-audit `AGENTS.md:124` | confirmed then, but the applied Gate 5 cut removed two of those clauses, so "same loading rule as Gate 5" now resolves to less |
| word 99 | `skill-advisor-hook.md:101, 147`, plus `system-skill-advisor/SKILL.md:297` verbatim | confirmed |
| word 253 | `validation-rules.md:44`, `system-spec-kit/SKILL.md:115-119` | confirmed |
| word 298 | `system-spec-kit/SKILL.md:466` | confirmed. Applied path is relative, see defect 2. |
| word 299 | `sk-git/SKILL.md:78-99` | confirmed |
| word 77 | `delegation-and-orchestration.md:86-91` | confirmed |
| word 117 | "command-spec-kit is not a live skill ... appears in no advisor data file" | **absent, claim is false.** `system-skill-advisor/runtime/lib/scorer/projection.ts:65-78` (hand-authored bridge) and `:159-163` (generated bridge, `routingEnabled: true`, `lifecycleStatus: 'active'`) define it, keyed to `/speckit:plan`, `/speckit:resume`, `/deep:research`, `/deep:review`. The audit searched `runtime/data/` and test fixtures only. |
| word 116 | `cli-external-orchestration/SKILL.md:186` | confirmed |
| word 123-125 | `REPO RULES.md:15-18, 29-32` | confirmed |
| word 344-352 | `system-spec-kit/SKILL.md:536`, `folder-structure.md:94` | confirmed |

**3. Defects introduced, with repair text**

1. `AGENTS.md:88` names an identity form the advisor never emits. The brief will say `command-spec-kit`, and the tiebreaker no longer names it. Replace the bullet with:
   ```
   - **Skill advisor ambiguity.** When the advisor's `command-spec-kit` bridge (its keywords are `/speckit:plan`, `/speckit:resume`, `/deep:research` and `/deep:review`) matches alongside `cli-*` for iteration phrases, `command-spec-kit` wins. The CLI executor is a tool inside the command's workflow, not a replacement for it.
   ```
2. `AGENTS.md:193` carries a path that does not resolve from the repo root. Replace `references/retrieval/retrieval-conventions.md` with `system-spec-kit/references/retrieval/retrieval-conventions.md`.
3. `AGENTS.md:119` says three failed fixes and `AGENTS.md:246` says two failed attempts, and the sentence that said which count governs which loop (original 192) is gone. `root-cause-and-debugging.md:87` explicitly defers the count to this document. Replace line 119 with:
   ```
   - **Stop local retries after three failed fixes for the same symptom**, then escalate per §7. That count governs the debugging loop. §7's two-attempt bound governs confidence, not retries.
   ```
4. `AGENTS.md:171-174` lost every pointer to the writer and to `save-workflow.md`, while the self-check at `AGENTS.md:185` still names `generate-context.js` with nothing in the document introducing it. Add under line 174:
   ```
   - The save runs the continuity writer `generate-context.js` through `/speckit:save`. Composition, what the writer touches and the post-save review are `system-spec-kit/references/memory/save-workflow.md`'s. HIGH review issues are patched by hand.
   ```
5. `AGENTS.md:26` says "The full discipline is `scope-discipline.md` §6", but `scope-discipline.md:104-109` §5 defers back to this document and §6 at `:113-117` is three lines. Pre-existing from the pre-audit file, not introduced by the audit. Replace the last sentence with: `The adjacent case, a frozen scope you believe is wrong, is [`scope-discipline.md`](repo-rules/scope-discipline.md) §5 and §6.`
6. Inbound references broken by the cut, in files outside AGENTS.md:
   - a. `repo-rules/scope-discipline.md:123` cites "§3 Ownership & Completion", a label deleted by row 3. Replace with "`AGENTS.md` §3 Execution Behavior binds".
   - b. `repo-rules/delegation-and-orchestration.md:73` cites "`AGENTS.md` Dispatch Rules", a heading deleted by row 2. Replace with "per `AGENTS.md` §10 Operational Mandates, the CLI dispatch bullet".
   - c. `repo-rules/presenting-decisions.md:125-126` says "Those are different obligations and `AGENTS.md` §3 holds both." Row 4 removed both registers, so §3 holds neither. Replace with "Those are different obligations. `uncertainty-and-honesty.md` §6 holds the first and this section holds the second."
   - d. `repo-rules/prevent-overengineering.md:69-70` says "`AGENTS.md` §3 names the code skill's universal quality standards as the authoritative rungs." That clause was in original 179 and is gone. `AGENTS.md:125` names the tiers only for the coverage floor. Replace with "For code, the code skill's universal quality standards are the authoritative rungs."
   - e. `.opencode/agents/code.md:64`, `.claude/agents/code.md:50`, `.pi/agents/code.md:58` say "FROZEN per `AGENTS.md` Iron Law". The term no longer exists in AGENTS.md. Replace with "FROZEN per `AGENTS.md` §1 Law 2 SCOPE LOCK".
7. `AGENTS.md:81` lost two clauses that bind before any rule file loads: a skill already in context is not re-read, and a wrongly resolved skill contract is followed and amended. PLAN-WORKFLOW LOCK step 4 at `AGENTS.md:26` binds plan-named workflows only, so the artifact-trigger case is now uncovered. Append to line 81:
   ```
   A skill already in context is not re-read. A resolved contract that is wrong for this case is followed and amended, as PLAN-WORKFLOW LOCK step 4 says.
   ```
8. `AGENTS.md:198` "never create a branch yourself" is ambiguous, because `sk-git`'s own commands create branches and the AI runs them. Original 327 named the primitives. Replace the bullet's first sentence and add a closing one:
   ```
   - **Never choose the workspace yourself, and never create a branch with git primitives.** When a git workspace trigger fires, ask the operator to choose **A) Create a git worktree** or **B) Work on current branch**, and wait. Branches come only from `sk-git`'s commands.
   ```

Pre-existing and out of scope, noted only: `cli-external-orchestration/SKILL.md:179` and the seven `cli-*/SKILL.md` files cite "AGENTS.md §7" for the agent directory, which is §9 in every version. `.opencode/agents/code.md:360-361` cites §4 for confidence and Logic-Sync, which are §2 and §7.

**4. Semantic drift**

- Original 117 `When command-spec-kit matches alongside cli-* ... command-spec-kit wins` became `AGENTS.md:88` `When a /speckit:* or /deep:* command identity matches ... the command identity wins`. The advisor scores `command-spec-kit`, four commands only, and `/speckit:save` routes through a different bridge (`projection.ts:79-108`). Wider and misnamed.
- Original 327 `Never create a branch with git branch, git checkout -b, or git switch -c. Branches are created only through sk-git's worktree and dedicated-branch commands` became `AGENTS.md:198` `never create a branch yourself`. Either over-broad or under-specified.
- Original 192 `That count governs this debugging loop, not Section 7's own bound` is gone, leaving `AGENTS.md:119` three and `AGENTS.md:246` two side by side.
- Original 102 `If the resolved contract is wrong for this case, follow it anyway and propose the amendment` is gone. `AGENTS.md:26` step 4 covers plan-named workflows only.
- Original 161 `Open non-trivial work with stakes read` bound on all non-trivial work. `blast-radius.md:46-54` binds only when a `REPO RULES.md:44` trigger fires.
- Original 286 `HIGH issues must be patched by hand` survives at `save-workflow.md:559` as MUST, but the command that runs the save says `patch HIGH metadata issues when practical` at `commands/speckit/save.md:61`.
- Original 293 `After a goal is set, acknowledge it in one line and continue immediately ... do not ask whether to proceed` moved to the speckit YAMLs. On a bound session outside a `/speckit:*` command, only `AGENTS.md:178` `never stop work for an unset goal` remains.
- Original 125 `you say so rather than following it` became `AGENTS.md:96` `you say so`. Minor.

**5. The two judgment calls**

Quick reference table: I agree with the deletion. Five of seven runtimes visibly carry a command inventory. Claude Code injected the full skill list in this session. Pi generates 36 prompt stubs from `.opencode/commands` per `.pi/SYNC.md:27`. Codex has `.codex/prompts`, Hermes has `.hermes/prompts` and `.hermes/skills`, Cursor has `.cursor/rules/skill-routing.md`, OpenCode reads `.opencode/commands` natively. Devin is UNKNOWN: `.devin/` holds agents, hooks, the playbook and `mcp_config.json` and no prompt mirror I could find. Every ordering row that carried real information resolves to an owner I opened (listed in the loss table). If Devin turns out to have no inventory, add one line to its instruction file rather than restoring the table.

Git safety table: I agree with the cut, on one condition. Both mandatory waits stay at `AGENTS.md:198-199`, and `sk-git/SKILL.md:276` and `:301-307` carry them with MANDATORY. The delegated rows are mechanics that only matter once git work starts, and any git action routes `sk-git` at Gate 2. The one real gap is the allocator rule at `sk-git/SKILL.md:361`, which binds only after the skill loads. Line 198 is meant to close that path and its wording does not, so the cut is safe once defect 8 is applied.

**6. Restore and cut further**

Restore, each for the reason in its defect: the `command-spec-kit` name (1), the retry-count sentence (3), the memory-save writer pointer (4), the two artifact-trigger clauses (7), the branch-primitives wording (8) and the full retrieval-conventions path (2). I would not restore "Spend lavishly", "intent not letter", "smallest complete result", the terminal-routing sentence, the graph-edges fact or the no-MCP-transport claim. They are principles or facts rather than rules, and "intent not letter" cuts against `scope-discipline.md:115-117`.

Cut further:
- `AGENTS.md:145` last sentence, "A registry entry is never proof a request reaches the mode." `REPO RULES.md:51` loads `skill-hub-routing.md` on the exact action of reporting a mode routed, so the sentence never fires on a no-load turn, and `skill-hub-routing.md:43, 66-77` carry it.
- `AGENTS.md:260` last sentence, "Hermes has none, its personas are inlined, see `cli-hermes`." Runtime-specific mechanics that `cli-hermes/SKILL.md:252` carries and loads on any Hermes dispatch. Keeps §9 runtime-agnostic.
- `AGENTS.md:83` middle sentence, "Never ingest a skill tree wholesale, it costs more context than it returns." Advice, not a rule.
- `AGENTS.md:74` the Override row of the confidence table. It restates the Logic-Sync halt at `AGENTS.md:242`.

Status: read-only pass, no file written, nothing pending on my side. The one thing that is the operator's to do is decide whether to apply the eight repairs, six of which touch AGENTS.md and the rest touch four rule files and three agent mirrors.
