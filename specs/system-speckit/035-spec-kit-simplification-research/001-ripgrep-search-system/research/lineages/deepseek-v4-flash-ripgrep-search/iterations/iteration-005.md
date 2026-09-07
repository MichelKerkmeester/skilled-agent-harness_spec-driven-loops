# Iteration 005 — NEW ANGLE: coverage — `repo-rules/` trigger_phrases are dead to the keyed lane

**Focus:** Round one's footprint angle (q-footprint) measured AGENTS/CLAUDE/REPO RULES *instructions* and ruled out a repo-rules rule — but never checked whether the `repo-rules/*.md` documents themselves carry `trigger_phrases` frontmatter and whether the keyed lane can reach them. This pass: which files outside the corpus roots carry author-declared trigger phrases, and who consumes them.

**Method:** Census of `repo-rules/*.md` frontmatter; index lookup of a sample of those phrases (Python membership test against the committed phrases table); read `sk-create-repo-rule` contract (template + SKILL.md + manual-testing-playbook) to find the intended consumer; compare against the conventions §9 root-coverage table.

## Findings

### N7 — 164 AUTH-DECLARED TRIGGER PHRASES IN `repo-rules/` ARE UNREACHABLE BY GATE 1 (P1, new)

- **Path:line:** `repo-rules/{blast-radius,communication,delegation-and-orchestration,evidence-and-proof,prevent-overengineering,root-cause-and-debugging,scope-discipline,skill-hub-routing,uncertainty-and-honesty}.md` frontmatter (164 `- "…"` members total, 16-23 per file); corpus roots `runtime/cli/retrieval/lib/corpus.mjs:16` (['specs', '.opencode/skills', '.opencode/install-guides']); index membership probe: 'one idea per sentence', 'atomic paragraphs', 'plain words', 'cut filler', 'empty opener', 'corporate language', 'marketing language' → ABSENT from `runtime/data/trigger-index.json`
- **Claimed vs actual:** The 9 repo-rule documents carry the SAME frontmatter contract as spec docs (title/description/trigger_phrases/importance_tier/contextType — grep-convention.mjs:34-40 canonical-keys order matches the repo-rule templates), but the corpus walker never reaches the repository root, so 164 phrases are dead to Gate 1: a prompt "plain words" or "one idea per sentence" can never surface the rule that owns the phrase. The conventions §9 root table (retrieval-conventions.md:264-281) decides AGAINST root `README.md` and the five runtime mirrors — and is SILENT about `repo-rules/`, `AGENTS.md`, `CLAUDE.md`, `REPO RULES.md`, and `referenced root docs`. The exclusion of repo-rules is therefore undocumented: neither a decision row nor a reason.
- **Severity:** P1 — dead retrieval surface PLUS an undocumented coverage exclusion. Either the rules are meant to be retrieved (they are repo-local, author-declared, stable — exactly the keyed lane's target class) and should join the corpus, or the frontmatter is decorative and should be retired with the collision check.
- **Recommendation:** Decision, not diagnosis: (a) add `repo-rules` to CORPUS_ROOTS (blast radius: +9 docs to the index, regenerated manifest hash, fixture churn — aligned with the standing answer that the corpus is limited to trigger_phrases-governed docs), or (b) remove the trigger_phrases requirement from the repo-rule template and the frontmatter from the 9 files, and update the conventions §9 table to state the repo-root exclusion explicitly (add rows for `repo-rules/`, `AGENTS.md`/`CLAUDE.md`/`REPO RULES.md`).

### N8 — THE REPO-RULE TEMPLATE REQUIRES TRIGGER PHRASES BUT ONLY MANUAL COLLISION CHECKING (P2, new)

- **Path:line:** `.opencode/skills/sk-doc/sk-create-repo-rule/assets/repo-rule-template.md:4-8` (trigger_phrases in the template), `SKILL.md:170` ("Verify: … no trigger phrase collides with another rule")
- **Claimed vs actual:** The authoring contract treats a rule's trigger phrases as a meaningful identity (uniqueness verified against other rules) but nothing verifies them mechanically: no rule-level checker exists (rules/ check-grep-convention-helper.mjs is spec-folder scoped; its `genericTriggerReason` is not invoked over repo-rules), and the trigger index doesn't index them, so the uniqueness claim has no enforcement and the phrases have no consumer.
- **Severity:** P2 — the verification step is a playbook item; the identity it protects is currently cosmetic.
- **Recommendation:** Fold into N7's decision: if (a), the index regenerates and Gate 1 serves the rules (and sk-create-repo-rule's collision step becomes a generator-side duplicate check); if (b), drop the frontmatter from template and corpus.

## Ruled out this pass

- Repo-rule as `rule.md` under `.opencode/skills`: no; the repo-local layer's home is the repository root by design (REPO RULES.md: "a router to per-rule documents under `repo-rules/`"), and round one ruled out a repo-rules *rule* for Gate 5 load timing — that ruling is about instruction placement, NOT about document indexing, and does not conflict with N7's option (a).
- AGENTS.md/CLAUDE.md/REPO RULES.md frontmatter: AGENTS.md and REPO RULES.md carry no `trigger_phrases` at all (grep: zero hits), so those files are NOT part of the dead-surface problem — only repo-rules/*.md are.

## Open questions

1. Was `repo-rules` ever INDEXED in a prior generator version (pre-decommission), and its exclusion an unintended side effect of the roots being trimmed to three? (Cannot answer without git history — prohibited. Flag as a review question for the repo owner.)
2. If repo-rules join the corpus, do their `importance_tier`/`contextType` fields need the same rules as spec docs, or does the index need a root-marker to distinguish rule docs in results? (No marker exists today; paths distinguish them.)
