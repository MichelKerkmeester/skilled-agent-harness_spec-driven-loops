# Iteration 6: Rehome 20 rules; what steering is lost

## Focus
Angle (d) part 2: classify the 20 constitutional rule files against AGENTS.md/CLAUDE.md (already always-on) and name unique content that would vanish if the folder is deleted without a digest.

## Actions Taken
- Used constitutional README §4 as the 20-file inventory.
- Grep'd AGENTS.md/CLAUDE.md for each rule's distinctive phrases and for `constitutional/*.md` links.
- Sampled unique files: `memory-system-spec-kit-only.md`, `recorded-failure-must-route.md`, `bash-output-truncation-verdict-visibility.md`, `gate-enforcement.md`.

## Findings

### F-B6.1 Root docs already carry the high-frequency rules and link to 6 files
[SOURCE: AGENTS.md:39-41,71-72,90,116,363]
[SOURCE: CLAUDE.md:39-41,71-72,90,116,363] (byte-similar framework copy)

Linked from AGENTS.md/CLAUDE.md (delete-breaks-links unless retargeted):

| File | Also inlined in root docs? |
| --- | --- |
| `comment-hygiene.md` | Yes — HARD BLOCK paragraph |
| `regression-baseline-and-delta.md` | Yes — verification table |
| `finding-is-a-hypothesis.md` | Yes — verification table |
| `main-branch-direct-push.md` | Pointer only ("see constitutional/...") |
| `cli-dispatch-skill-preload.md` | Yes — Dispatch Rules table |
| `gate-tool-routing.md` | Pointer only (Code Search Decision Tree) |

That is **6 unique paths × 2 root docs = 12 links**, plus catalog/skill/install-guide mentions. Dispatch's "~16 links" is plausible once BARTER.md, install-guides, and SKILL.md are included; this run confirmed 12 in AGENTS+CLAUDE alone. **UNKNOWN** remaining link count outside those two files without a full-tree citation census (out of iteration budget).

### F-B6.2 Unique steering NOT in AGENTS.md body (would be lost)
Grep of AGENTS.md found **no** matches for: automated-writers, co-occurrence/causal, Fable, `/goal` vs `opencode-goal`, bash truncation / tool-results preview, recorded-failure routing, Claude native MEMORY.md ban, spec-folder-naming filename, recursion-control filename.

| File | Lost if deleted without rehome | Suggested new home |
| --- | --- | --- |
| `memory-system-spec-kit-only.md` | Owner 2026-05-31 native-memory ban | **Digest (standing).** High value, short. |
| `bash-output-truncation-verdict-visibility.md` | 2KB preview / `tool-results/` lag failure mode | **Digest or AGENTS verification table** (root docs already say "read the output"; this file adds the harness-specific trap). |
| `recorded-failure-must-route.md` | Detector-fired ≠ closed; points at `unactioned-recorded-failure-audit.mjs` | **Digest (standing)** + keep the audit script. |
| `entity-cooccurrence-is-not-causal.md` | Causal-graph methodology | Skill/docs for memory search, not every-turn. |
| `fable-governor.md` / `fable-subagent-model-policy.md` | Fable-specific dispatch constraints | Skill or `cli-*` packet; load when Fable is in play (Cursor glob / Claude path-scoped rule), not always-on. |
| `goal-prompting-runtime-specific.md` | `/goal` vs `opencode-goal` | Runtime-specific rule (path-scoped). |
| `automated-writers-never-overwrite-manual.md` | Generator vs hand-edit | Spec-kit skill / content-router docs. |
| `gate-enforcement.md` | Gate 3 edge cases (compaction, continuation) | Classifier already authoritative (`gate-3-classifier.ts`); file is a trigger-phrase index for search. **Do not treat as source of truth.** |
| `deep-skill-workflow-required.md` | PLAN-WORKFLOW LOCK already in AGENTS | Skip rehome. |
| `post-implementation-deep-review.md` | Deep-review workflow already in AGENTS §10 | Skip or one-line pointer. |
| `recursion-control.md` | Partial overlap with loop budgets | Deep-loop skill, not digest. |
| `spec-folder-naming.md` | AGENTS §3 naming conventions | Skip. |
| `verify-before-completion-claims.md` | Iron Law VERIFY | Skip. |

**Every-turn digest candidates (keep small):** native-memory ban, bash-truncation trap, recorded-failure-must-route, maybe main-branch-direct-push (currently link-only). Everything else is skill-scoped or already in AGENTS.md.

### F-B6.3 Keep-rules-as-docs vs full-deprecation (preview; verdict in iter 10)
If the folder remains as **unindexed markdown docs**, AGENTS.md links keep working and `/memory:learn` can die. Cost: a third copy still drifts from AGENTS.md (comment-hygiene already has three copies: root docs, constitutional file, `render.ts` + pre-commit checker).

If the folder is **deleted**, the 6 root-doc links and the unique rows in F-B6.2 must be rewritten first. Enforcement is **not** lost (iter 1). Search-time trigger matching (`memory_match_triggers`) **is** lost for those trigger phrase lists — that feature is the actual product of the constitutional tier, and iter 1-2 argue it is the wrong bus.

## Ruled Out
- Moving all 20 files verbatim into AGENTS.md (token budget; already huge).
- Assuming "16 links" are all in AGENTS.md (only 6 paths × 2 files confirmed).

## Assessment
- newInfoRatio: 0.55
- noveltyJustification: First per-file rehome classification; unique-loss set is 4 standing digest items + several skill-scoped rules, not 20.
- confidence: high on AGENTS.md overlap; medium on BARTER.md/other-root copies (not opened this iteration).

## Recommended Next Focus
Angle (e): freshness, decay, and supersession for the replacement digest vs today's constitutional `decay: false` / `last_confirmed` fields.
