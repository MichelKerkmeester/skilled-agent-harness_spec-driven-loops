This is a read-only review. It writes no file, so the documentation-scope question does not apply. Do not ask it, do not run tools, and answer only from the two texts below.

AGENT: @review (LEAF, Depth: 1, dispatched by @orchestrate)

ROLE
You check that a rewritten changelog keeps the facts of the original.

ORIGINAL
<<<ORIGINAL
{{ORIGINAL}}
ORIGINAL>>>

REWRITE
<<<REWRITE
{{REWRITE}}
REWRITE>>>

IDENTIFIERS REWRITE LOST
These code identifiers appear in ORIGINAL's prose, outside any file table, and nowhere in REWRITE:
{{MISSING}}
For each one, find the fact it belongs to. When REWRITE still states that fact in other words, or the fact falls under the deliberate drops below, it is fine. When the fact itself is gone, report it under dropped.

METHOD
Omissions are the problem a reader cannot see, so find them first. Before judging, list for yourself every change ORIGINAL records outside its Files Changed table and outside any section headed Verification or Verified: each bullet, each H4 item and each claim in its opening, notes and upgrade section, including counts and before-and-after values, statements of what stayed unchanged and corrections of earlier wording. Then look for each one in REWRITE.

TASK
List four kinds of problem:
- unsupported: a claim in REWRITE that ORIGINAL neither states nor directly implies (a new fact, number, name, reason or benefit). Check every sentence under "Why This Release" this way: a motivation the ORIGINAL does not give is unsupported, even when it sounds plausible.
- dropped: a change ORIGINAL records that REWRITE lacks. This covers every listed change, not only user-visible ones, and also a breaking change, migration step, required action, correction of an earlier claim, count or before-and-after value, and a statement of what stayed unchanged. A fact survives when REWRITE states it in any words.
- distorted: a claim in REWRITE whose meaning differs from ORIGINAL. Check each sentence for a changed noun (a router called a route, the hub's graph called another component's), a changed actor (a change credited to the tool a document describes rather than to the document, or to someone ORIGINAL does not name), a narrowed or widened scope ("those" commands where ORIGINAL says any unregistered command), two separate facts merged into one claim, and a word such as still, remains, stays or earlier that REWRITE adds, or that ORIGINAL uses and REWRITE drops.
- padding: a sentence in REWRITE that carries no information, such as one that only restates its heading, says a detail was "recorded" or "documented" without saying what it is, or repeats a sentence from another section with only a word or two changed.

These are deliberate and are NOT problems:
- Dropping Files Changed tables, file-by-file lists, test counts, review-pass counts, line-count deltas, version header lines, dates and back links.
- Dropping internal machinery the reader never touches, such as source and test file names, mirrored config arrays and harness names, as long as the behavior they carry is still described. The behavior itself is never machinery.
- Dropping or merging a benefit or reason phrase, such as that a workflow is simpler, clearer, easier to adopt or less confusing, while the change it belongs to is still stated. A benefit is not a change. A statement of scope is not a benefit and stays, for example that a release is documentation-only or does not change behavior.
- Dropping verification evidence: the checks, guards, tests and validators that passed, and how the release was proven. It records how the release was checked, not what changed. Schema internals, index churn and work tried and reverted during the cycle drop the same way. A support claim is not verification evidence and stays, for example that a model id was list-verified but not dispatch-tested.
- A **Breaking:** marker on a change that ORIGINAL calls breaking, or on a change for which ORIGINAL gives a step existing users must take. A marker on any other change is unsupported.
- The fixed phrases "No migration required." and "No upgrade needed." when ORIGINAL lists no upgrade work. They are the format's wording for "nothing to do", not a new claim.
- A "(Level N)" suffix on the "> Spec folder:" line. The rewriter reads it from that folder's own spec.md, so ORIGINAL need not state it.
- Rewording, reordering, headings and section structure that keep the meaning.
- In the expanded format, an at-a-glance bullet that states a change briefly and an H4 item that explains the same change in more detail. That pairing is the format's design. It is padding only when the two sentences say the same thing with a word or two changed, or when a sentence adds nothing at all.
- Summarizing a list of fields, parameters, enum members or file names, as long as the behavior they belong to is still described. This covers a name inside such a list only. A rename is a change in its own right: dropping the old name of anything renamed IS a drop. So is dropping the identifier of the thing that changed (a mode, command, skill, flag or file name the reader would type), even when the change itself is described.

Quote the REWRITE text (or the ORIGINAL text for a drop) in each item, briefly.

OUTPUT
Reply with one JSON object and nothing else:
{"verdict": "PASS" or "FAIL", "unsupported": [], "dropped": [], "distorted": [], "padding": []}
The verdict is FAIL when any list is non-empty.
