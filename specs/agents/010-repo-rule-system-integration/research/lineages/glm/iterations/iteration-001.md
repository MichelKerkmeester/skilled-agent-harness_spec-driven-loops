{"timestamp":"2026-09-11T20:13:41.564Z","runtime":"claude","status":"ok","freshness":"live","durationMs":1633,"cacheHit":false,"skillLabel":"sk-doc"}
C1. CONFIRMED — REPO RULES.md:15-17 (§1, item 4): "Every trigger that fires is loaded, not just the first… Three and four firing at once is the normal case, not an edge case." AGENTS.md:125 (Gate 5, step 3) repeats it nearly verbatim.

C2. CONFIRMED — AGENTS.md:121-122: "Trigger: the FIRST write of the session… Read-only turns never fire it." Consequence: on a read-only turn no rule file under repo-rules/ ever loads, so its content never governs that turn; only the framework's own unconditional standards (AGENTS.md:240) bind.

C3. CONFIRMED — prevent-overengineering.md:100-102: "## 3. TWO SIGNALS `AGENTS.md` DOES NOT CARRY — Its Restraint Signals table binds and is not repeated here." The file's only other table (:104-107) is the complementary pair, not the 7-row table at AGENTS.md:218-226.

C4. CONFIRMED — uncertainty-and-honesty.md:48-49: "The scale is the Confidence Thresholds table in `AGENTS.md` §2 and there is exactly one of it; this file carries no second copy." Read in full: no band table; the bands exist only at AGENTS.md:92-97.

C5. CONFIRMED — `ls repo-rules/` shows exactly 11 .md rule files, nothing else; REPO RULES.md §2 trigger rows (:40-50) = 11; §3 index rows (:58-68) = 11.

C6. CONFIRMED — all 11 `trigger_phrases` blocks read completely (each ends at its `importance_tier` key, lines 21-25): 194 phrases total, and no phrase appears in the frontmatter of two different files (closest near-pairs, e.g. "buried the verdict"/"buried the ask", are distinct).

C7. CONFIRMED — AGENTS.md spans exactly 502 lines (reads :1-250 and :251-502 cover the file; "roughly 500" ✓). CLAUDE.md is byte-identical at head (:1-15) and tail (:496-502), same length — certainly not a diverged copy; the residual link-vs-fresh-copy distinction is the one thing the read-only toolset cannot distinguish.

JUDGEMENT: Three. (1) Git Workspace Safety, AGENTS.md:326-335 — ten rows of sk-git policy that :324-329 itself say sk-git owns ("sk-git holds the exact grammar", :329); when its grammar, allowlist, or live-sync legs change, this copy goes stale. (2) Quick Reference, :450-474 — 23 rows whose flows restate gates the document already carries: :455 re-encodes Gate 5, :468 re-encodes the completion rule; :448 even warns a repeat "only creates a second copy to go stale." (3) :112-114 — advisor-metadata and two-stage hub-routing mechanics whose owners are named right there (skill-root-metadata-contract.md, skill-hub-routing.md); a two-line pointer would carry them. REPO RULES.md:85-88 shows the alternative works: name the owner, carry no mechanics, so each rule has exactly one place to change.
