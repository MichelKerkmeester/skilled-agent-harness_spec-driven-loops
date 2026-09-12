---
title: "Deep Review Report: goal unification, all three passes"
description: "Phase-level roll-up of the three review lineages: 32 findings across 13 iterations, their severities, and the disposition of every one."
trigger_phrases:
  - "goal unification review report"
  - "goal review findings"
  - "goal deep review passes"
  - "goal review disposition"
importance_tier: important
contextType: research
---

# Deep Review Report: goal unification, all three passes

> Phase-level roll-up of three review lineages. Each lineage under `lineages/` holds its own report
> and iteration evidence; this document is the one record that reads across them. Every finding is
> listed with where it ended up.

---

<!-- ANCHOR:executive-summary -->
## 1. EXECUTIVE SUMMARY

Three lineages, thirteen iterations, DeepSeek throughout, stop policy max-iterations. No pass found a
blocking defect. The first pass found five required fixes and ten advisories; the second and third
found no required fixes and seventeen advisories between them.

| Pass | Iterations | Verdict | P0 | P1 | P2 |
|---|---:|---|---:|---:|---:|
| First | 3 | Remediate | 0 | 5 | 10 |
| Second | 5 | Pass | 0 | 0 | 7 |
| Third | 5 | Pass | 0 | 0 | 10 |

All five required fixes are shipped and pinned by tests. Of the twenty-seven advisories, twenty-four
are built, two are kept as recorded decisions, and one was rejected after an experiment disproved it.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:required-fixes -->
## 2. THE FIVE REQUIRED FIXES

Each was a leak, an escape or a contract contradiction, and none was deferrable.

1. **A fence carrying trailing whitespace leaked the frontmatter** into every goal surface, session
   identifier included. The extractor now tolerates a padded fence and fails closed on an unclosed one.
2. **A symlinked packet escaped the workspace,** so a bind could read and a log could write a document
   outside it. Resolution now goes through the real path and checks containment.
3. **Pointer-less records still injected their stored objective,** which contradicted two frozen
   decisions. A record without a pointer no longer injects one.
4. **The promised set-time budget report was missing,** so an over-budget objective was clamped in
   silence. A text goal past the cap now reports the truncation.
5. **The OpenCode injection carried no resend reminder,** although the decision says the reminder rides
   every injected turn. It does now, naming that runtime's own record command.
<!-- /ANCHOR:required-fixes -->

---

<!-- ANCHOR:advisories -->
## 3. THE TWENTY-SEVEN ADVISORIES

**Leaks and correctness, seven.** Runtime and validator measured different slices once a fence carried
whitespace. An unclosed opener made the validator measure the whole document. A bare carriage return
leaked frontmatter. A log row carrying anchor markup passed the sanitiser and failed the packet.
Non-UTF-8 documents corrupted on the first append. A carriage-return-plus-newline file gained a bare
newline row. Binding-table containment was lexical only.

**Locking and concurrency, three.** The packet lock was keyed lexically, so an alias bypassed it and
lost a row. Its scope was the state directory rather than the workspace, so two sessions with
different state directories did not serialise. A rebind archived in the core and overwrote in place in
the plugin.

**Plugin and core divergence, six.** The plugin exposed no unbind and no log, and an unknown action
fell through to show. Its brief cache keyed on file time and size rather than content. It resolved
packets against the directory it was handed, so a bind from a subdirectory failed. It omitted the
budget field its command-line twin prints. The two renderers had no parity test. They disagreed on
which workspace wins.

**Wiring gaps, five.** The bind table in the planning workflow was referenced by no step. The save path
gave an unlocked append equal footing. Setting a text goal on a bound record drops the pointer. Claude
Code and Codex had no resend mechanism. The Cursor command advertised actions it fails closed on.

**Documentation drift, six.** The changelog contradicted itself on Devin. An older packet still
required documents to call Devin decommissioned. The hook README misstated what the plugin imports and
which flags the packet action needs. The recorded Devin limitation named two emitters where three
exist. The log rule's carve-out was undecidable from any shipped surface.
<!-- /ANCHOR:advisories -->

---

<!-- ANCHOR:disposition -->
## 4. DISPOSITION

**Built:** twenty-four. Tolerant fences and carriage-return normalisation in both extractors, real-path
locking and containment, a sanitiser that neutralises anchor markup, a named refusal for a non-UTF-8
append, unbind and log on the plugin with an error on an unknown action, a content-addressed cache key,
workspace resolution shared by both implementations, a renderer parity test, archiving on rebind,
criteria as their own rendered field, a hash-based resend signal for the two runtimes without a
session record, a check that keeps the three workflow files identical, the hooks directory added to the
retrieval corpus, link notation and real-path containment in the binding-row rule, and the
documentation corrections.

**Kept as recorded decisions:** two. The duplicated envelope aliases stay because a live test depends
on them, and the unused plugin timestamp stays because a record schema does.

**Rejected with evidence:** one. Rooting the packet lock in the record-store override was implemented,
probed and reverted. An end-to-end run showed the lock split and four of ten rows lost. A regression
test now pins contention across two state directories.
<!-- /ANCHOR:disposition -->

---

<!-- ANCHOR:open -->
## 5. NOTHING DEFERRED

The Devin host merge rule was the last open item and is now settled by a live run: with a write-intent
prompt so a second producer fired, a Devin session reported both hook contexts in the same turn, so the
host concatenates rather than keeping one. That is host behaviour rather than a documented contract, so
it is worth re-checking after a Devin upgrade.
<!-- /ANCHOR:open -->
