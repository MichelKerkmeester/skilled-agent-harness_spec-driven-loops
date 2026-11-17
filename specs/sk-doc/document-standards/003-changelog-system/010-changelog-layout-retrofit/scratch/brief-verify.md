This is a read-only review. Do not run tools and do not ask anything. Answer only from the two texts below.

ROLE
You check that a rewritten changelog states exactly the facts of the original. The rewrite moved the entry into a new layout: plain bullets instead of bold lead-in bullets, split sentences, new or reworded headings, a glance table, alert boxes and folded blocks. It was not allowed to drop, add or change any fact.

ORIGINAL
<<<ORIGINAL
{{ORIGINAL}}
ORIGINAL>>>

REWRITE
<<<REWRITE
{{REWRITE}}
REWRITE>>>

METHOD
List for yourself every fact in ORIGINAL: each change, number, name, condition, reason, before-and-after value, statement of what stayed unchanged, recommendation and requirement. Then find each one in REWRITE. Then read each REWRITE sentence, heading, table row and alert line and find where ORIGINAL says it.

TASK
Report three kinds of problem. Quote the text briefly in each item.
- dropped: a fact in ORIGINAL that REWRITE no longer states in any words. Nothing may be dropped, including verification details, reasons and benefits.
- added: a claim in REWRITE that ORIGINAL neither states nor directly implies, such as a new reason, benefit, example, test result, upgrade step or explanation of a term.
- changed: a claim whose meaning differs, such as a changed noun, a changed actor, a widened or narrowed scope, two facts merged into one wrong claim, a lost or added word such as still, now, no longer or already, a recommendation turned into a requirement or the reverse, a change marked as breaking that ORIGINAL did not mark as breaking or the reverse, or a reason or condition (because, so, if, when) split into sentences that no longer link it to what it explains or governs.

Not problems: splitting sentences or bullets, plainer synonyms that keep the meaning, reordering, a bold lead turned into a plain sentence that keeps its meaning, a heading or glance row that restates a fact the body states, a fact stated in both a summary and its section, a name put in code formatting, and layout scaffolding such as &nbsp; lines, anchors, folded-block summaries, a Spec folders count and the fixed opening of the breaking-change box ("N changes can break an existing setup. Read these before you update.") when ORIGINAL marks exactly those N changes as breaking.

OUTPUT
Reply with one JSON object and nothing else:
{"verdict": "PASS" or "FAIL", "dropped": [], "added": [], "changed": []}
The verdict is FAIL when any list is non-empty.
