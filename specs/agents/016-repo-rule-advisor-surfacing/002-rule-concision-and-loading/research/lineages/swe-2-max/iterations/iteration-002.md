---
title: "Iteration 2: Compression patterns, the card test, and per-rule token targets"
trigger_phrases: []
---
# Iteration 2: Compression patterns, the card test, and per-rule token targets

## Focus

Steer iteration 2: a list of compression patterns (name, one before/after sentence, bytes saved, enforcement at risk), then one line per rule with a token target or "no change" and the basis. Steering adds two tests: (a) whether a frontmatter+Fires-when+The-rule **card** alone keeps the enforcement the anatomy assigns, and which outside-card part carries what the card loses — naming the rules where the answer differs; (b) the §7 bare-imperative contrast as its own pattern, labelled as resting on two prohibitions.

All "bytes saved" figures are measured spans from the part decomposition (`scratch/parts-dump.txt`) or `wc -c`-verified text; modelled per-rule targets use the stated keep-rates. Unmeasured effects are marked UNKNOWN.

## Findings

### 1. THE CARD TEST (steer-required)

A card = frontmatter + `## Fires when` + `## The rule`. Measured independently this iteration (block spans, `wc -c`-consistent): **960–1,809 B per file, 18,207 B total** — the sibling lineage's claim (935–1,784 / 17,882) confirms within ~2% span conventions [SOURCE: measurement this iteration; steer.md:12]. Card-only load = **17.0% of corpus** (~83% cut).

**What the card drops is every numbered-section norm.** Per the part map, the card carries no body rule-statement — i.e., none of the operative prohibitions, procedures, or checklists. Whether that loses enforcement differs by file shape:

- **Card loses measured/operative enforcement — 6 files where the norms are enumerated prohibitions or procedures:** `communication-prose` (card 960 B drops "**No semicolon.**" at `communication-prose.md:109` — the single measured-effective sentence in the corpus, `prep/evidence-pack.md:46`); `communication` (drops the table/filler/first-line/cap bans the compliance baseline tracks); `blast-radius` (drops the reversibility-ladder table `:59-63` that *defines* irreversible); `uncertainty-and-honesty` (drops the LOGIC-SYNC halt form `:100-102` and the never-invent list `:66-68`); `evidence-and-proof` (drops the receipt test `:62-71`, command-evidence `:87-97`, baselines `:128-136`); `root-cause-and-debugging` (drops the 6-step loop `:51-60`, never-weaken `:111-114`, flake criteria `:123-125`).
- **Card ≈ sufficient — 2 files:** `skill-hub-routing` (the headline IS the operative norm — "report a mode as routed only after checking both stages" `:43`; the body is mechanism explanation + pointer table, rationale 712 + cross-refs 484 of 6,573); `answer-the-actual-request` (umbrella norm "answer the request made…never dressed as process" `:43-44` covers §1–6 as instances).
- **Partial — 5 files:** `delegation-and-orchestration` (headline covers §3–4 umbrella; loses the 5-step dispatch list `:71-91` and the verification checks `:134-146`), `communication-decisions` (loses ASK/DO/THEN `:102-111` and the estimate rule `:121-123`), `communication-handoff` (loses the structured-choice bar `:131-140` and in-flight/resume lines `:180-198`), `scope-discipline` (loses the always-yes list `:79-85` and adjacent-defect protocol `:94-100`), `prevent-overengineering` (loses the reversal-cost ladder `:58-66` the headline points to).

**Which outside-card part carries enforcement:** `failure-prevents` carries motivation, not norm content — no. `examples` — only 4 blocks exist; where present (`uncertainty-and-honesty.md:100-102`) they are load-bearing formats but cannot generalize. **`self-check` — yes, and it is the finding:** the checklist is already a compressed restatement of every section's norm (489–1,648 B/file). A **card + self-check "slim card"** (e.g. communication.md: 1,809+1,228 = 3,037 B vs 11,458, −73%) retains every norm in checkable form — the cheapest enforcement-preserving load the format already contains. The checklist was authored as a self-audit; measured here, it is also the corpus's ready-made compression surface.

### 2. COMPRESSION PATTERNS

**P1 — Bare imperative vs justified block (rests on exactly two prohibitions).**
Before: "**No tables in a reply.** A table makes the reader parse a grid to reach one fact, and it reads as a form rather than an answer. One or two facts go in a sentence… The one exception is the in-flight block in [`communication-handoff.md`] §6…" (`communication.md:91-96`, ~500 B).
After: "**No tables in a reply.** One or two facts go in a sentence; parallel items go in a bulleted list; tables only in files someone returns to — exception: the in-flight block (`communication-handoff.md` §6)." (~200 B).
Bytes saved: ~300 here; ~2,000–3,000 corpus-wide applied to justification-tailed directives.
Enforcement at risk: rests on two prohibitions only — the bare imperative "No semicolon." (`communication-prose.md:109`, ~55 B) is the one measured-effective read (37.0%→17.0%, `prep/evidence-pack.md:46`); the ~500 B justified table block shows no effect (17.4%→20.3%, `:45`). Confounded: different base rates, detection ambiguity for legit tables (`prep/evidence-pack.md:51`), n=2. Directional only: consistent with "the imperative is the unit", not proof.

**P2 — Repeated-pointer dedup.**
Before: "the same floor, see [`communication-prose.md`](communication-prose.md) §4" tail repeated verbatim at `communication.md:87,118,190,204`.
After: keep the first; drop three (~170 B).
Bytes saved: ~170 B in this file; ~400–600 B corpus (dedup all repeated see-tails).
Enforcement at risk: none measured — pointer aids navigation; UNKNOWN whether repetition reinforces recall.

**P3 — Self-check folding (inverse of the card finding — do NOT cut blindly).**
Before: 12-item checklist `communication.md:239-250` (1,228 B) restating §§1–10.
After (option A): drop where every section already bold-leads its norm — saves up to 10,941 B corpus (10.2%). After (option B): keep checklist, cut the prose restatements — saves the duplicated prose instead.
Enforcement at risk: HIGH if option A — the checklist is the only scannable final-pass surface and (per §1) the cheapest full-norm restatement for slim loading. The corpus already bold-leads every norm, so B is the defensible direction for files whose norms outnumber their headings; UNKNOWN whether dual presentation (norm + checklist) reinforces compliance.

**P4 — Boilerplate dedup.**
Before: "`> Routed from [`REPO RULES.md`]… Load before X. / > Expands `AGENTS.md`, never overrides it. Where they appear to disagree, `AGENTS.md` wins and this file is wrong. Say so.`" (~207–266 B ×13; skill-hub 516 B).
After: the one-line trigger ("Load before writing any substantive reply", ~40–60 B); the precedence half duplicates `AGENTS.md` Gate 5 verbatim ("Where the two disagree, this document wins", `~/.claude/CLAUDE.md` Gate 5 text) — pure redundancy.
Bytes saved: ~150–460 B/file ≈ 2,400 B corpus. Enforcement risk: LOW — precedence still binds via the always-loaded doc; keep skill-hub's extra carve-out sentence (it is content: the §4 routing boundary, `skill-hub-routing.md:29`).

**P5 — trigger_phrases relocation.**
Before: 25–33 phrases per file in YAML head (e.g. `communication-handoff.md:4-33`, ~750 B; frontmatter totals 10,246 B corpus).
After: phrases live in a generated sidecar; file keeps title+description+tier+contextType (~200–250 B). Phrases serve the `sk-create-repo-rule` collision check and retrieval, never model behaviour.
Bytes saved: ~6,800 B corpus. Enforcement risk: NONE for behaviour; it is a loading/authorship change, not text the model acts on — flag: requires the collision-check consumer to read the sidecar.

**P6 — AGENTS.md restatement removal.**
Before: "`AGENTS.md` §3 Execution Behavior binds: no early stop, no 'natural checkpoint' on incomplete work, no asking permission to continue an approved, in-scope step." (`scope-discipline.md:123-125`, ~380 B incl. following clauses).
After: the deferral form the corpus itself uses — "the scale is the Confidence Thresholds table in `AGENTS.md` §2 and there is exactly one of it; this file carries no second copy" (`uncertainty-and-honesty.md:48-49`).
Bytes saved: ~500–900 B corpus. Enforcement risk: NONE — `AGENTS.md` is always loaded (`prep/evidence-pack.md:21`); restated bytes are pure redundancy to a reading model.

**P7 — Embedded justification-clause cut.**
Before: "A table makes the reader parse a grid to reach one fact, and it reads as a form rather than an answer." (`communication.md:91-92`, ~105 B appended to the 4-word norm).
After: the norm alone. Applies to persuasion clauses attached to imperatives corpus-wide ("deliberating costs more than being wrong would", `blast-radius.md:74-75`; "and it is the one mutation that feels like a read", `blast-radius.md:146`).
Bytes saved: ~1,500–3,000 B. Enforcement at risk: UNKNOWN — a model executes norms, not arguments; weak inverse evidence from P1 (the justified block is the dead rule).

**P8 — Meta/provenance removal.**
Before: "This file carries what `AGENTS.md` §8 used to hold in full. Its trigger is deliberately the broadest in the set…" (`communication.md:45-47`, 262 B); "This rule is a pointer, deliberately." (`skill-hub-routing.md:102`, 247 B); "`> One lens, stated as such.`" disclosure (`delegation-and-orchestration.md:61-65`, 366 B).
After: delete (provenance is not behavioural) — EXCEPTION: the one-lens disclosure is an epistemic marker the file's own §4/§6 requires; keep it.
Bytes saved: ~1,100–1,700 B. Enforcement risk: low; the exception is real — do not blanket-delete.

**P9 — Multi-statement collapse (triplicated norm).**
Before: "**Match length to the question.** A first answer rarely needs pages. A question that resolves in three lines gets three lines; opening with a wall of text answers a question nobody asked and buries the one they did." + "Length is earned by the reader's need, never by the work you did to get there. Effort spent is not a reason to spend the reader's attention." (`communication.md:81-87`, ~440 B — one norm stated three times).
After: "**Match length to the question — the reader's need, never the effort spent.** A question that resolves in three lines gets three lines." (~140 B).
Bytes saved: ~1,000–2,000 B where a norm appears in 2–3 phrasings (`communication.md:199-204` is another).
Enforcement at risk: MEDIUM — the extra statements often carry the norm's boundary (effort-vs-need axis); collapse must keep the axis phrase or coverage narrows.

**P10 — Enumeration punctuation compression.**
Before: "file paths, line numbers, function or symbol names; CLI flags, environment variables, config keys; API shapes, parameter names, return types; version numbers, dates, benchmark figures" (`uncertainty-and-honesty.md:66-68`, ~190 B).
After: flat comma list (~120 B, −37%); the grouping semicolons and "under any pressure to sound complete" frame go.
Bytes saved: ~100–300 B/file where present. Enforcement risk: none if the list stays complete — completeness is the norm.

**Non-patterns (checked, rejected):** markdown tables are already the compressed form of their taxonomy (~5,200 B across 11 tables — keep); `## ` headings are navigation, ~35 B each; hard-wrapping costs nothing.

### 3. PER-RULE TOKEN TARGETS (4 B/token, `prep/evidence-pack.md:19`)

Keep-rates used: fires-when 100%, rule-statement 85% (trim embedded justification), failure-prevents 50%, examples 100%, cross-refs 40%, rationale 20%, what-this-is-not 60%, self-check 50% (P3-B), frontmatter→~250 B (P5), header→~300 B (P4). Judgment adjustments noted.

| rule | now (B) | target (B ≈ tok) | basis |
|---|---:|---:|---|
| answer-the-actual-request | 5,644 | ~5,000 ≈1,250 (−11%) | leanest file (no rationale/examples/cross-refs); trim only what-not + checklist tightening |
| blast-radius | 7,154 | ~5,400 ≈1,350 (−24%) | two tables already compressed; cut §3 rollback-prose justification |
| communication-decisions | 8,024 | ~5,400 ≈1,350 (−33%) | triage §3 and ASK/DO/THEN overlap; §28 boundary note is rationale |
| communication-handoff | 10,803 | ~7,500 ≈1,875 (−31%) | §1 status/handback restates e-and-p §10 (P6); runtime table is informational — keep, it earns |
| communication-prose | 6,882 | ~5,500 ≈1,375 (−20%) | **most conservative — the one measured-effective file**: keep every prohibition byte; cut only HVR-deferral + words-section elaboration |
| communication | 11,458 | ~7,800 ≈1,950 (−32%) | P1+P2+P9+P10; what-not 695→~400; keep self-check |
| delegation-and-orchestration | 11,712 | ~8,400 ≈2,100 (−28%) | git-pathspec mechanics `:189-201` (~700 B) belongs in sk-git; keep one-lens marker |
| evidence-and-proof | 11,823 | ~8,500 ≈2,125 (−28%) | §1 states the receipt principle 3× (~1,800 B → ~900); §11 overlaps §1; merge the two checklists |
| prevent-overengineering | 7,374 | ~5,200 ≈1,300 (−29%) | 649 B blockquote self-defense is rationale; restraint items already tight |
| root-cause-and-debugging | 6,591 | ~5,300 ≈1,325 (−20%) | densest file (65% normative); smallest justified cut — table+loop already compressed |
| scope-discipline | 6,725 | ~5,000 ≈1,250 (−26%) | P6 restatement out (~400 B); §8 three items already minimal |
| skill-hub-routing | 6,573 | ~4,200 ≈1,050 (−36%) | mechanism+pointer mass (rationale 712 + xref 484) compresses hardest — it is a pointer file by design |
| uncertainty-and-honesty | 6,329 | ~4,700 ≈1,175 (−26%) | §6 two-registers/qualify-test overlap (~400 B); keep LOGIC-SYNC template |
| **TOTAL** | **107,092** | **~77,000 ≈19,250 (−28%)** | ~26.8k → ~19.3k tokens of read cost |

## Questions Answered

- Does a card keep enforcement? Only where the file is umbrella-shaped (skill-hub, answer-the-actual-request); it drops every operative prohibition where norms are enumerated (6 files incl. the only measured-effective one). The recoverable carrier is self-check: card+checklist is the corpus's own compressed form.
- Compression patterns: 10 named (P1–P10) with measured savings and per-pattern risk; non-patterns checked and rejected.
- Per-rule targets: ~77,000 B ≈ 19,250 tokens (−28%), basis tied to the part map per file.

## Questions Remaining

- Whether justification sentences aid *model* compliance (as opposed to human persuasion) — UNKNOWN, unmeasured.
- Whether dropping self-check or the prose it duplicates loses enforcement — UNKNOWN; P3-B is the safe direction.

## Ruled Out

- Cutting markdown tables: already the compressed form.
- Cutting `fires-when`: it is the load decision — the file's own trigger needs it when loading is per-file.
- Blanket meta-deletion: the one-lens disclosure is a required epistemic marker.

## Assessment

- `newInfoRatio`: `0.85`
- Novelty justification: the card test converts the loading lineage's hypothesis into a per-file verdict with named divergent cases, and surfaces the self-check as the corpus's own compressed norm restatement — the slim-load surface nobody designed it to be.
- Confidence: high on byte figures (all measured); LOW-MEDIUM on enforcement-at-risk calls (one measured prohibition total; everything else is structural inference, marked UNKNOWN).

## Reflection

- Worked: the part map pays off twice — card boundaries computed from it in seconds, and each pattern's savings cites a measured span rather than an estimate.
- Worked: independent card measurement (18,207 vs claimed 17,882) — trust-but-verify on the sibling's F10.
- Limitation: enforcement-at-risk is the weak column — one measured prohibition cannot calibrate the other 12 files; every risk cell says which side of UNKNOWN it falls on.

## Recommended Next Focus

Iteration 3 per steer: shortened `communication.md` and `evidence-and-proof.md` drafts inside this lineage, each with a keep/drop ledger (part, keep/drop, enforcement kept/lost, bytes). Draft method: apply P1–P10 conservatively — every prohibition and procedure survives verbatim; justification, restatement, meta and apparatus compress.

## Sources Consulted

- [SOURCE: steer.md (lineage dir, updated steering §11-15)]
- [SOURCE: prep/evidence-pack.md:19-26,45-51]
- [SOURCE: .skilled/repo-rules/ — all 13 files, cited at file:line above]
- [SOURCE: scratch/classify-parts.py; scratch/parts-dump.txt]
- [SOURCE: card measurement, this iteration (block spans, reported inline)]
