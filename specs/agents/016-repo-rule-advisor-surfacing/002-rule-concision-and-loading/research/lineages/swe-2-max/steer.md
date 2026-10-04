# STEER: swe-2-max (3 iterations), CONCISION
Scope is fixed here. Do not re-derive it.
Question: which sentences in a rule change behaviour, and what does shortening or removing each cost?
Files: the 13 in .skilled/repo-rules/, each a .md: answer-the-actual-request, blast-radius, communication, communication-decisions, communication-handoff, communication-prose, delegation-and-orchestration, evidence-and-proof, prevent-overengineering, root-cause-and-debugging, scope-discipline, skill-hub-routing, uncertainty-and-honesty.
Parts: Fires when, rule statement, failure it prevents, examples, self-check, "what this is not", cross-references, rationale.
Baseline, prep/evidence-pack.md §3: reading communication-prose.md roughly halves semicolons. Reading communication.md does not reduce tables.
Iteration 1: split each rule into the parts above. Output: one row per rule with bytes per part and total. State how bytes were counted. Totals must match prep/evidence-pack.md §1 where it gives them (for example communication.md 11,458).
Iteration 2: Output: a list of compression patterns, each with name, one before/after sentence, bytes saved, enforcement at risk. Then one line per rule: token target or "no change", and the basis.
Iteration 3: Output: shortened drafts of .skilled/repo-rules/communication.md and .skilled/repo-rules/evidence-and-proof.md, written inside your lineage directory only. Each draft has a ledger: sentence or part, keep or drop, enforcement kept or lost, bytes.

## STEERING for your next iteration (orchestrator)
Input from the loading lineage (deepseek-v4-1-flash-max, iteration 2, F10 and F16): a "card" made of a rule's frontmatter, its "Fires when" list and "The rule" statement measures 935 to 1,784 bytes per rule, 17,882 bytes for all 13. The REPO RULES.md index summaries are 193 bytes per rule, 2,509 total.
Loading cards instead of full files would cut a Gate 5 load by about 70 to 80 percent. Your concision work decides whether that is safe.
In your compression patterns, test this directly: does a card alone keep the enforcement your anatomy finds, and which part outside the card (failure it prevents, examples, self-check) carries enforcement the card loses? Name the rules where the answer differs.
Also: your §7 contrast (9-word semicolon ban moves, ~500-byte table block does not) is a lead worth one compression pattern of its own. Keep it labelled as resting on two prohibitions.

## STEERING for iteration 3 (orchestrator)
Your card test (iteration 2 §1) contradicts the loading lineage's recommendation that Gate 5 load cards (deepseek-v4-1-flash-max iteration 4 F24). Strongest finding so far.
Keep iteration 3 as planned (two drafts with ledgers). Add one short table first: a "card v2" made of "Fires when" + "The rule" + the self-check list, frontmatter excluded. Per rule: bytes, and whether it keeps the operative prohibitions your §1 says the plain card drops. Mark per rule: sufficient, partial, insufficient.
