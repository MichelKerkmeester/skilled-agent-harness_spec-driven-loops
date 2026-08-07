---
title: "Research: Which Git Operations Warrant a Preflight Advisory"
description: "Ten forced-depth passes across two model families converge on a state-gated advisory design, refute three of the five rules originally proposed, and identify one confirmed live footgun with no rule today."
trigger_phrases:
  - "git advisory research findings"
  - "git advisory noise threshold"
  - "which git operations warrant advisory"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/001-advisory-research"
    last_updated_at: "2026-07-27T21:50:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Merged the ten-pass corpus into ranked findings"
    next_safe_action: "Operator reviews; phase 002 encodes only the confirmed set"
    blockers: []
    key_files:
      - "research.md"
      - "research/RUNNING-NOTES.md"
      - "research/manual-devin/devin-05.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-001"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Does the operator want the F4 config-filter finding handled here or split into its own packet?"
    answered_questions:
      - "The noise threshold is roughly 1 advisory per 100 git mutations per rule."
      - "The existing evaluator is command-only and cannot express state-gated git rules."
---
<!-- SPECKIT_TEMPLATE_SOURCE: research-core | v2.2 -->
# Research: Which Git Operations Warrant a Preflight Advisory

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:program -->
## 1. THE PROGRAM

Ten forced-depth passes, two model families, no early convergence.

| Half | Executor | Passes | Shape | Output |
|------|----------|--------|-------|--------|
| SOL | `openai/gpt-5.6-sol` high via `cli-opencode` | 5 | One iterating lineage | 120 KB, 41 key findings, 11 ruled-out directions |
| GLM | `glm-5-2` via `cli-devin` | 5 | Independent gap-targeted dispatches | 205 KB across 5 documents |

The SOL lineage stopped on `max-iterations` at convergence 0.75, not on convergence — forced depth
was the point. Its coverage spanned code 33, history 16, state 26, web 2, network 2.

The two halves were complementary rather than redundant, and in one case corroborating: SOL and GLM
independently measured reset at 13.56% and 13.5% of operations by different methods, and an
independent re-measure from the orchestrator returned 201 of 1486 reflog entries — the same 13.5%.

**A constraint that shapes how to read this corpus:** every `git ...` invocation is rejected by the
runtime guard in Devin's non-interactive session. GLM pass 01 therefore carries **zero measured
numbers** and is taxonomy plus inference only. Pass 02 onward worked around it by reading
`.git/logs/**` as plaintext. SOL was not blocked. Measurement claims from SOL and from GLM 02-05 are
checkable; those from GLM 01 are not.
<!-- /ANCHOR:program -->

---

<!-- ANCHOR:noise -->
## 2. THE CENTRAL ANSWER: WHERE THE NOISE THRESHOLD SITS

This was the question most likely to be answered by assertion. It was not.

**Measured prevalence in this repository** (primary reflog, 1486 entries over 34 days):

| Operation | Share of reflog transitions |
|-----------|----------------------------|
| commit | 73.55% |
| reset | 13.56% |
| rebase | 2.97% |
| amend | 0.47% |

**The discriminator that makes `reset` tractable.** 93% of resets are unstage-only —
`reset: moving to HEAD`, old SHA identical to new SHA. Verified independently at 188 of 201.
History-moving resets are therefore roughly **0.9%** of all operations.

A `reset` rule gated on the verb fires on one operation in seven and will be ignored. The same rule
gated on *old SHA differing from new SHA* fires on roughly one in a hundred and stays credible.
**The discriminator is the rule; the verb is not.** This generalises: every retained rule below is a
state discriminator, not an operation name.

**Two thresholds, two denominators, and they reconcile.** SOL proposes under 1 advisory per 100 git
mutations per rule and under 3 per 100 in aggregate — denominator is *all* git operations. The prior
art pass proposes a 1-in-20 target with 1-in-5 as a hard ceiling — denominator is *the operations
that rule watches*. These are compatible: a tightly-gated rule can fire on 1 in 20 of its own narrow
trigger set while remaining under 1 in 100 of all operations. Phase 002 should hold both.

**Caveat, stated by the research rather than extracted from it:** reflog rates are prevalence
ceilings, not advisory fire rates. The repository has no Bash-hook invocation log, so true fire rates
cannot be derived. Treat every number here as an upper bound.
<!-- /ANCHOR:noise -->

---

<!-- ANCHOR:refuted -->
## 3. WHAT THE RESEARCH REFUTED, INCLUDING MY OWN PROPOSAL

Three of the five rules proposed before this research ran did not survive it. Recording this plainly
because the proposal was mine and the incident list that motivated it was written from memory.

| Originally proposed | Verdict | Why |
|---------------------|---------|-----|
| `push-identity-mismatch` — compare active `gh` account to remote owner | **Narrowed, and cannot predict** | Ruled out: "treating gh identity, API permission, or network snapshots as remote outcome proof." A local identity snapshot is raceable and does not prove the push will fail. It may be reported as neutral information; it may not be framed as a prediction. |
| `worktree-push-reconcile` — advise when pushing from a linked worktree | **Narrowed** | Ruled out as a *generic* warning: "generic push, account, detached-worktree, and nondestructive multi-ref warnings." Needs positive destination evidence, not merely detached or linked HEAD. |
| `shared-tree-staging` — advise on `git add <dir>` against a dirty tree | **Narrowed** | Ruled out: "path-count-only, cross-top-level, and unconditional selective-commit warnings." Survives only where an *objective mismatch* exists: held-back staged paths, one-sided inferred renames, forced ignored files, or reproducible expansion beyond explicit paths. |

Two further ruled-out directions bear on scope: **do not duplicate existing pre-push branch-naming
and permission enforcement** (raised twice, independently). Several rules I would have written
already exist as blocking checks, and re-advising them is pure noise.

The full 11 ruled-out directions are in `research/lineages/sol/findings-registry.json`. The list is
as valuable as the findings: it is what stops this from becoming the advisory that gets skimmed past.
<!-- /ANCHOR:refuted -->

---

<!-- ANCHOR:findings -->
## 4. CANDIDATE RULES

### 4.1 Confirmed — verified against this repository, not reasoned from git semantics

**F4 — the config clean-filter footgun. No rule today. Highest-value finding in the corpus.**

`.gitattributes` maps `opencode.json`, `.claude/mcp.json`, `.vscode/mcp.json` and
`.codex/config.toml` to a `maintainer-flags` clean filter that silently rewrites the committed blob.
The `.gitattributes` file documents the behaviour verbatim: `cat opencode.json` shows `"true"`
locally; `git show HEAD:opencode.json` shows `"false"`. Five `SPECKIT_CODE_GRAPH_INDEX_*` keys are
gated, and all five are currently `"true"` locally.

Pre-evaluable in full: detect a filter-mapped path among staged paths, then check whether the diff
touches the gated keys. Noise: very low — fires only when editing one of four files *and* touching
those keys. This is a live, verified divergence between what the operator sees and what they commit.

**Worktree-origin pushes are not an edge case here.** 32 linked worktrees, 824 worktree reflog
entries. Whatever phase 002 encodes about worktree pushes will fire in practice.

### 4.2 Strong — mechanism confirmed from git semantics, frequency inferred

Nine candidates in the *success-while-doing-less-than-asked* class, all fully pre-evaluable
(`research/manual-devin/devin-05.md` §1):

| ID | Operation | Discriminator |
|----|-----------|---------------|
| F1 | `git commit --only <paths>` where a named path is untracked or unmodified | `git diff --name-only -- <paths>` empty |
| F2 | `git add <pathspec>` matching nothing | `git add -n` prints nothing |
| F3 | `git add <pathspec>` matching only ignored files | `git check-ignore` non-empty |
| F5 | `git restore` / `git checkout --` on a path with staged changes | `git diff --cached --name-only` non-empty and no `--staged` |
| F6 | `git checkout <ref> -- <paths>` silently stages the restored content | Command shape alone |
| F7 | `git merge -X ours` / `-X theirs` auto-resolves one-sidedly, reports clean | Flag on the command |
| F8 | `git add -u` while untracked files exist | `git status --porcelain` shows `??` |
| F9 | Case-only pathspec under `core.ignorecase=true` | `core.ignorecase` true and case-insensitive `ls-files` match |

F1 is the original incident. F3 rates as medium-frequency because this repository's gitignore is
dense. F5 is the index-versus-worktree gap — the same class as the containment breach that motivated
this packet.

### 4.3 Retained destructive rules, each narrowed to positive state

Never the verb; always the state (SOL finding 3): published containment, non-empty exact-path
overwrite, clean dry-run removals, unique branch commits, dirty or active forced worktree removal,
unrescued stash entries, non-empty immediate-expiry or prune exposure.

Correspondingly, **stay silent where git already blocks or preserves state** (SOL finding 4):
`branch -d`, checked-out branch deletion, ordinary dirty worktree removal, `clean` without force,
conflicted `stash pop`. Git's own gates already cover these; advising on top of them is noise.

### 4.4 sk-git rule classification

Every ALWAYS / NEVER / ESCALATE rule was classified in `research/manual-devin/devin-03.md` (69 KB).
The distribution is roughly half mechanical, a large partial tier, and about twenty judgement-only
rules that no hook can check. The precise tally should be read from that document rather than from a
count here; the operative point is that **a substantial minority are judgement-only and must not be
encoded**, because encoding judgement as mechanism is how false positives get manufactured.
<!-- /ANCHOR:findings -->

---

<!-- ANCHOR:blocker -->
## 5. THE ARCHITECTURAL BLOCKER FOR PHASE 003

`evaluate(command, rules)` in `dispatch-rule-checks.mjs` accepts **command text only**. It has no
repository-state parameter.

Direct branch creation and `--no-verify` are command-only and work today. Essentially every valuable
rule above is state-gated and does not. Phase 003 must either extend the evaluator signature or
build a git-specific sibling — that decision is now the phase's central design question, and it was
not visible when the packet was scaffolded.

A second constraint from SOL finding 6: git state carries no session-owner field, and `PreToolUse`
sees only the pre-hook candidate command. Advisories must therefore be **neutral** and cannot
guarantee final commit contents. This directly limits how the shared-tree and identity rules can be
worded.
<!-- /ANCHOR:blocker -->

---

<!-- ANCHOR:design -->
## 6. DESIGN REQUIREMENTS FROM PRIOR ART

Every surface that warns about git — git's own `advice.*`, pre-commit, IntelliJ, VS Code, GitHub
push-protection — ships the same **three fatigue tiers**: per-rule opt-out, grouped opt-out, global
kill. Shipping only a global on/off reproduces the documented VS Code toggle-and-forget failure.

Two failure modes that are not frequency at all:

1. **Legibility.** A rare, correct warning that does not map to operator intent is dismissed as a
   non-sequitur. Fixed by message framing, not by firing less.
2. **Placement.** A warning inside a noisy stream, or shown once and missed, teaches that the source
   is unreliable.

Both reduce to one requirement: **the advisory must appear where the operator is already reading and
must name the operation they just invoked.** This is prior to the frequency budget, not a refinement
of it.
<!-- /ANCHOR:design -->

---

<!-- ANCHOR:handoff -->
## 7. HANDOFF TO PHASE 002

1. Encode only §4.1 and §4.2. Every rule is a state discriminator; none is a verb match.
2. Carry both noise denominators from §2 and record the expected fire rate per rule.
3. Do not encode the §4.4 judgement-only tier, and do not re-advise anything the pre-push hook
   already blocks.
4. Resolve the §5 evaluator question before writing frontmatter, because it determines whether
   `hard_rules:` can express these rules at all. If it cannot, phase 002 and 003 invert in order.
5. Treat §4.2 as mechanism-confirmed and frequency-inferred. The prior program's error rate on
   unverified claims was material; two of six re-tested claims were wrong.

**Open for the operator:** F4 is a confirmed live footgun affecting four config files, and it is
only incidentally a git-advisory finding. It may deserve its own remediation rather than waiting on
this packet's four phases.
<!-- /ANCHOR:handoff -->
