# Iteration 3: Closing Q4 — the delivery prefix, and one decision per remaining v4.0.1.0 addition

## Focus

Close Q4 the way iteration 1 closed the other additions: one decision per v4.0.1.0 addition that had not yet been examined — conversation playbook scenarios, `/doctor:sk-skill`, `/doctor:symlink` and `/doctor:install`, `/doctor:agents-md`'s section manifest and the repository block (including the question "does either now require a rule about which lines an update may overwrite"), the `sk-code` web frontend surface, the worker-session nudge removal and `package_skill.py --strict`'s ROUTER.md enforcement — and re-check iteration 1's proposed wording for `AGENTS.md:70` against `system-skill-advisor` and Gate 5's loading rule.

Two ambiguities, resolved before research:

- The dispatch asks whether the manifest "now requires a rule about which lines an update may overwrite". Both readings are live: (a) ownership, meaning which bytes a rewrite may replace; (b) capacity, meaning which edits the manifest's byte budget will accept. The evidence says both are answered by the same mechanism, so the iteration answers both rather than picking one, and each gets its own finding.
- `package_skill.py --strict`'s ROUTER.md enforcement was already decided in iteration 2 (`f-iter002-003`) and is not re-litigated here; this iteration re-checks only the wording of the `AGENTS.md:70` proposal, which is what the dispatch names.

## Actions Taken

1. Read the config (lineage session id, `progressiveSynthesis`), the state log, the strategy, the findings registry and both prior iteration narratives; derived iteration 3 of 5 from the two `type: "iteration"` records.
2. Read the v4.0.1.0 release note's relevant sections with line numbers: doctor commands at `:90`, `:94`, `:98`, `:102`; frontend surface at `:43`, `:72`, `:80`; conversation scenarios at `:126`; worker nudge at `:157`; upgrade steps at `:182-191`.
3. Inventoried `.skilled/commands/doctor/` and its `.opencode/commands/doctor/` mirror to test `AGENTS.md:289`'s claim that command inventories live in `.opencode/commands/`.
4. Read the doctor:agents-md command router (`.skilled/commands/doctor/agents-md.md`) and the shipped section manifest (`.skilled/commands/doctor/assets/agents-md-manifest.json`): section order, `markers`, `budget`, `pins`, `derived`.
5. Read `agents-md-check.cjs`'s A6 (delivery budget) and A7/A8 (repository block, unmarked content) implementations, then ran the read-only check itself: `node .skilled/commands/doctor/scripts/agents-md-check.cjs --json`.
6. Probed all 54 skill roots that carry both `SKILL.md` and `ROUTER.md` for the link the release describes, and read the canonical form in three of them.
7. Grepped `system-skill-advisor` for its ROUTER.md contract (freshness signature, watcher, rebuild) to test the `AGENTS.md:70` wording against the advisor's actual model.
8. Grepped `AGENTS.md`, `REPO RULES.md` and all 13 rule files for the remaining addition names (`nudge`, `frontend`, `playbook`, `scenario`, `package_skill`, `tokens.css`, `CLAUDE`) and for the delivery-budget vocabulary (`16384`, `delivery prefix`, `prefix_bytes`).
9. Computed the byte cost of iteration 1's `AGENTS.md:70` proposal and of the minimal accurate variant against the 16,384-byte prefix.
10. Compared `v4.0.0.16:AGENTS.md`'s section order with the working tree's, to separate what v4.0.1.0 introduced from what it inherited.

## Findings

### f-iter003-001 (P2) — v4.0.1.0 enforces a 16,384-byte delivery prefix on `AGENTS.md`, no rule states it, and the packet's own `AGENTS.md:70` proposal exceeds it

The manifest added in this range composes `AGENTS.md`'s shipped sections and measures them against a budget: `prefix_bytes: 16384`, `max_bytes: 32768`, with the last pin being `anchor-blast-radius-management` [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json]. The pins' own justification states the stake: "The clause a runtime truncates away is a clause that does not exist there, so this section has to end inside the delivery prefix" [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json].

The live check confirms how tight that is: **"16368 of 16384 bytes to the last anchor, 27888 of 32768 bytes total"** — 16 bytes of headroom, from row A6 of a read-only run of `node .skilled/commands/doctor/scripts/agents-md-check.cjs --json`. A6 fails only when the prefix ends past the limit *and* no line inside the repository block contains the phrase `delivery prefix` [SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:480]. That phrase is the sole acknowledgment the check accepts, and it is read from the block only.

Nothing in the rule layer says any of this. `16384`, `delivery prefix` and `prefix_bytes` each return zero matches across `AGENTS.md`, `REPO RULES.md`, all 13 files under `.skilled/repo-rules/`, and even the command's own router `.skilled/commands/doctor/agents-md.md`. The budget is visible only in the manifest JSON, in the check's pass detail, and in a failure nobody has hit yet.

Consequence for this packet, measured rather than estimated:

- Iteration 1's proposal for `AGENTS.md:70` — `Routing means loading what the skill's sibling ROUTER.md resolves (its SKILL.md links it in one line), under the same loading rule as Gate 5.` — is **141 bytes against the 86 the sentence occupies today, a delta of +55**, which moves the last anchor from 16,368 to **16,423, or 39 bytes past the prefix**.
- The minimal accurate variant, naming `ROUTER.md` and changing nothing else (`what the router resolves` → `what the skill's sibling ROUTER.md resolves`), is still **+19 bytes → 16,387, three bytes past**.

So no version of "name `ROUTER.md` at `:70`" fits on budget. The edit has to arrive with a compensating trim of at least 19 bytes above the last anchor, or with a one-time acknowledgment line in the repository block that the same change removes again. Applying it as written and then running `/doctor:agents-md check` turns A6 from PASS to FINDING.

Why this is P2 and not P1: the check catches it, so nothing incorrect ships silently. The cost is a failed gate on the packet's headline recommendation and a re-edit, not a wrong rule in production.

Proposed one-line edit, `AGENTS.md:301` (the repository-block note, which `/doctor:agents-md` preserves):

- now: `<!-- Repository-owned. /doctor:agents-md keeps every line here; the sections above are shipped by Skilled. -->`
- proposed, appended to that line: `Edits above this block must keep the last pinned anchor inside the 16384-byte prefix; run /doctor:agents-md check before and after.`

Design warning the rule layer must carry, and it is the reason this belongs in the note and not in a rule file's prose about the check: **any standing line containing the words `delivery prefix` inside the block permanently silences A6**, because that is exactly what the check looks for [SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:480]. A rule that teaches the escape by quoting it into the block disables the gate it describes; teaching it in a rule file or the packet docs does not, because A6 reads only the block.

### f-iter003-002 (P3) — "Which lines may an update overwrite" already has a machine answer; the CLAUDE.md mirror premise is retired, and neither needs a rule

The ownership half is fully settled by the manifest and the checks, and restating it would duplicate an owner:

- **Shipped sections** are composed from the manifest's ordered section list — title, §1-§10, then the repository block — and A8 reports any repository content outside the block that matches no shipped section as "the content a replacement would drop" [SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs]. Live A8: `"no section outside the block"`.
- **The repository block** is preserved: A7 passes on `block 148 bytes, 4880 bytes of headroom`, and the note line itself states the contract [SOURCE: AGENTS.md:301].
- **`REPO RULES.md` is never overwritten.** `--create-router` creates it "from the shipped rows when it is missing"; no target rewrites an existing one [SOURCE: .skilled/commands/doctor/agents-md.md].

The topic's premise that "`CLAUDE.md` mirrors `AGENTS.md`" is now retired by the same command: `embed` folds a divergent `CLAUDE.md` into the repository block and **removes the file by default**, keeping it only under `--keep-claude-md` [SOURCE: .skilled/commands/doctor/agents-md.md]. No root `CLAUDE.md` exists in this checkout, and `CLAUDE` returns zero matches across `AGENTS.md`, `REPO RULES.md` and the 13 rule files — so no rule is stale on that axis, and none needs to instruct a mirror that the tool now folds away.

Verdict: no rule. The ownership question is answered by A7/A8 plus the note line, and the only thing the rule layer lacks is the capacity budget, which is f-iter003-001.

### f-iter003-003 (P3) — Every remaining v4.0.1.0 addition is already carried by its owner; none needs an `AGENTS.md` or repo-rule statement

Decided one at a time, each with the evidence that settles it:

| Addition | Released as | Owning route that already carries it | Rule needed? |
|---|---|---|---|
| Conversation playbook scenarios | multi-turn scenario runner `run-conversation-scenario.cjs`, kept outside the repository [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:126] | `sk-doc`'s ROUTER has a `playbook-conversation` intent fired by "playbook conversation / multi-turn conversation script / json conversation / conversation runner", and it scores double [SOURCE: .skilled/skills/sk-doc/ROUTER.md:103]. The runner ships at `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | No. Gate 2's artifact trigger already sends a `.md` write through `sk-doc` |
| `/doctor:sk-skill` | check, then `convert` a skill, with an undo block [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:90] | `.skilled/commands/doctor/sk-skill.md`, mirrored at `.opencode/commands/doctor/sk-skill.md` | No. `AGENTS.md:289` already delegates the command inventory to the runtime |
| `/doctor:install`, `/doctor:symlink` | setup steps with no write; link, check and unlink a project [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:94] | `.skilled/commands/doctor/install.md` and `symlink.md`, both mirrored under `.opencode/commands/doctor/` | No. Same delegation, and `blast-radius.md` already governs an install |
| `sk-code` web frontend surface | `sk-code-frontend` loads beside a coding workflow for web UI [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:72] | `sk-code`'s ROUTER bundles `sk-code-frontend` from request vocabulary alone, across six topic files [SOURCE: .skilled/skills/sk-code/ROUTER.md:153]; the packet exists at `.skilled/skills/sk-code/sk-code-frontend/` | No. Gate 2's code-write trigger already routes through `sk-code` |
| Worker-session nudge removal | a worker no longer gets told to save into its parent's spec folder [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:157] | `nudge` appears nowhere in `AGENTS.md`, `REPO RULES.md` or the 13 rule files; the one match is the English word in prose [SOURCE: .skilled/repo-rules/answer-the-actual-request.md:55]. Gate 3's child-dispatch exemption stands on its own text | No, and nothing to delete |
| `package_skill.py --strict` ROUTER.md enforcement | a skill keeping its router in `SKILL.md` fails strict packaging [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:60] | Already decided in iteration 2: the placement half is machine-enforced, the reachability half is the rule's subject [SOURCE: .skilled/repo-rules/skill-hub-routing.md:78] | No change to the decision |

The one thing this table proves positively: `AGENTS.md:289`'s claim that command inventories "are injected by the runtime and live in `.opencode/commands/`" is accurate for all four new doctor commands, which are mirrored there beside their `.skilled/commands/` sources. That citation needs no refresh.

### f-iter003-004 (P3) — Iteration 1's `AGENTS.md:70` wording is accurate in substance and needs one precision fix plus the budget correction

Checked against the three things that could make it wrong:

- **The shape is universal.** All 54 skill roots carrying both files mention `ROUTER.md` in `SKILL.md`. The canonical form is a single relative link: `Read [`ROUTER.md`](./ROUTER.md) before selecting skill-local resources; open only the matched files.` [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:96], repeated at [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:61] and [SOURCE: .skilled/skills/sk-doc/SKILL.md:59].
- **The advisor treats the router as part of the skill.** Its freshness signature includes `ROUTER.md`, a router-only change marks the index stale, and the watcher subscribes to it [SOURCE: .skilled/skills/system-skill-advisor/changelog/v0.17.24.0.md:22], so "what the skill's sibling `ROUTER.md` resolves" matches the advisor's model rather than contradicting it.
- **Gate 5's loading rule** is "Loading is a Read, not a Gate Action" plus "LOAD every rule file it names" [SOURCE: AGENTS.md:97-98]. Saying routing loads "under the same loading rule as Gate 5" remains coherent: the load is mandatory, its content stays advisory.

Precision fix: the parenthetical `(its SKILL.md links it in one line)` describes the release's shape, not a property every skill satisfies. `sk-doc`'s `SKILL.md` names `ROUTER.md` on nine lines [SOURCE: .skilled/skills/sk-doc/SKILL.md:19], so "in one line" invites a reader to treat a compliant file as non-compliant. Proposed wording, still one sentence, still inside the budget discussion above:

- `Routing means loading what the skill's sibling ROUTER.md resolves (its SKILL.md carries a relative link to it), under the same loading rule as Gate 5.`

That variant is 141 bytes against the current 86 — the +55 that f-iter003-001 measures. Trim or acknowledge before applying.

### f-iter003-005 (P3) — `AGENTS.md`'s §4-before-§3 numbering is pre-existing, and the manifest now freezes whatever order it declares

`AGENTS.md` runs §1 (line 7), §2 (45), **§4 (117), §3 (173)**, §5 (212) and so on. The manifest declares that same order — `s4-verification` before `s3-execution-quality` — so every `embed` reproduces it [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json].

This is not a v4.0.1.0 regression: `git show v4.0.0.16:AGENTS.md` already had §4 at line 117 and §3 at line 173. What changed is that the order is now machine-owned; a hand reorder that does not also edit the manifest's `sections` array is reverted on the next `embed`. Cross-references still resolve by number, and iteration 2 verified the rule layer's `§3` and `§4` citations point at real headings. Recorded as a scope boundary for the follow-up implementation, not as a repair this packet should make.

## Ruled Out

- **A rule is needed for conversation playbook scenarios.** No: `sk-doc`'s `playbook-conversation` intent already routes the request, and the runner is documented by the skill that ships it [SOURCE: .skilled/skills/sk-doc/ROUTER.md:103].
- **`/doctor:install` and `/doctor:symlink` need a rule because they mutate a project.** No: the commands own their own plan-then-yes discipline, `blast-radius.md` governs any install, and `AGENTS.md:289` already delegates the inventory.
- **The worker-session nudge removal leaves a dangling rule.** No: zero references to a nudge in the rule layer; only an unrelated English use of the word.
- **`AGENTS.md:70`'s proposal is simply wrong.** No: it is substantively right and self-consistent with Gate 5 and the advisor. Only the `one line` parenthetical and the byte budget need correcting.
- **The `§4`-before-`§3` order was introduced by the manifest.** No: identical order at `v4.0.0.16`.
- **A rule is needed about which lines an update may overwrite.** No: A7/A8 plus the note line own it; the gap is capacity, not ownership.

## Dead Ends

- **Treating "the manifest requires a rule about which lines an update may overwrite" as a single question.** It splits into ownership (settled by A7/A8) and capacity (unstated, and load-bearing). Asking it as one question would have produced either a duplicated rule or a missed budget.

## Edge Cases

- Ambiguous input: "which lines an update may overwrite" — read as both ownership and capacity, answered separately rather than collapsed.
- Contradictory evidence: none open. The topic's `CLAUDE.md` mirror premise conflicts with `agents-md.md`'s `--remove-claude-md` default; the tool is the observed behaviour and the premise is recorded as retired.
- Missing dependencies: none. Every probe target existed; the check ran clean and returned JSON.
- Partial success: none. All planned probes ran. `research/research.md` remains unwritten because it is outside this dispatch's allowlist (see scope note).

## Sources Consulted

- `.skilled/changelog/skilled/v4.0.1.0.md:43,60,72,80,90,94,98,102,126,157,182-191`
- `AGENTS.md:7,45,70,93,97-98,117,173,212,289,298-302`
- `REPO RULES.md:1-60`
- `.skilled/repo-rules/answer-the-actual-request.md:55`; all 13 rule files grepped for `nudge`, `frontend`, `playbook`, `scenario`, `package_skill`, `tokens.css`, `CLAUDE`, `16384`, `delivery prefix`
- `.skilled/commands/doctor/agents-md.md` (route contract, flag table)
- `.skilled/commands/doctor/assets/agents-md-manifest.json` (`markers`, `budget`, `sections`, `pins`, `derived`)
- `.skilled/commands/doctor/scripts/agents-md-check.cjs:480-560` (A6 escape, A7 block, A8 unmarked)
- `node .skilled/commands/doctor/scripts/agents-md-check.cjs --json` (live rows A6, A7, A8)
- `.skilled/skills/system-spec-kit/SKILL.md:96`; `.skilled/skills/system-skill-advisor/SKILL.md:61`; `.skilled/skills/sk-doc/SKILL.md:19,57,59,66,80,81,91,130,149`; 54-skill link probe
- `.skilled/skills/system-skill-advisor/changelog/v0.17.24.0.md:22`
- `.skilled/skills/sk-doc/ROUTER.md:99-107`
- `.skilled/skills/sk-code/ROUTER.md:153-165`
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs`
- `.skilled/commands/doctor/` and `.opencode/commands/doctor/` inventories
- `git show v4.0.0.16:AGENTS.md` (`## ` headings)

## Assessment

- New information ratio: 0.72
- Questions addressed: Q4 (closed), plus a correction to Q2's already-answered wording proposal
- Questions answered: Q4
- Calculation: 5 findings — 1 fully new (f-iter003-001), 4 partially new (f-iter003-002 through -005, each closing an open branch with a negative or a boundary) → (1 + 4×0.5) / 5 = 0.60, plus the +0.10 simplicity bonus for closing the last open question with one model ("the additions are already owned; the only unstated obligation is capacity") → 0.70, plus 0.02 for the live-measured budget arithmetic that turns a proposed edit into a checked one → 0.72.

## Reflection

- What worked and why: reading the checker's *failure branch* instead of only its detail string. The detail said "16368 of 16384"; the branch said what would fail and that one phrase in the repository block silences it. That single read turned a cosmetic observation into a finding with an edit consequence and a footgun warning. The second thing that worked was computing the byte delta before recommending the edit, which is what caught that even the minimal rename breaks the budget.
- What did not work and why: nothing failed this iteration. The one correction to method is earlier: iteration 1 proposed a one-line edit without checking whether the file it edits is byte-budgeted. The root cause is treating an `AGENTS.md` edit as prose editing when v4.0.1.0 made it a composition against a manifest.
- What I would do differently: for any file that a generator composes, read the generator's budget and its failure branches before proposing content, not after the proposal is written down.

## Questions Answered

- Q4: "Does v4.0.1.0 add a mandatory behavior … that AGENTS.md or a repo rule should state?" — Yes, exactly one: the 16,384-byte delivery prefix and its single-line acknowledgment, stated nowhere in the rule layer (f-iter003-001). Every other addition is already carried by its owner (f-iter003-003).

## Questions Remaining

- None at the key-question level. Three carried-forward items stay open as refinements rather than questions: (a) the `AGENTS.md:70` edit's compensating trim is a follow-up decision, not research; (b) `research/research.md` synthesis is unowned while the dispatch allowlist excludes it; (c) iteration 2's note that the gateway projection keeps only seven fields still governs how this packet's own state is read.

## Next Focus

No key question remains. If a fourth iteration runs, its highest-value target is the only unverified surface left: `research/research.md` synthesis, which needs a dispatch that writes it — the evidence for every finding is already in the three iteration narratives and their deltas.

## Gateway Record and Scope Notes

The canonical iteration record is recorded through `append-mode-event.cjs --mode research --run-directory specs/agents-md/017-v4-0-1-0-rules-refresh/research`, from a single-record temp file outside the repository so no unlisted packet path is created.

Scope note, unchanged from iterations 1 and 2: `progressiveSynthesis` is `true` in the config, but `research/research.md` is not in this dispatch's ALLOWED WRITE PATHS. The narrower allowlist governs; synthesis remains unowned.

No write outside `specs/agents-md/017-v4-0-1-0-rules-refresh/research/` was issued, no repository file was modified to verify a claim, and the doctor check was run read-only (`check`, never `embed`).
