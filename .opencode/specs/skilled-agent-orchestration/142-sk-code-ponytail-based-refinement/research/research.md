---
title: "Research Report: Ponytail-Based Refinement of sk-code / sk-code-review"
description: "Prioritized, file-mapped recommendations for applying the external ponytail project's logic, hooks, and review mechanisms to the sk-code and sk-code-review skills. 10-iteration, 2-model deep research (Opus 4.8 + gpt-5.5-fast) with adversarial cross-verify. Research-only."
trigger_phrases:
  - "ponytail research report"
  - "ponytail sk-code recommendations"
  - "decision ladder sk-code"
  - "ponytail refinement findings"
importance_tier: "high"
_memory:
  continuity:
    packet_pointer: .opencode/specs/skilled-agent-orchestration/142-sk-code-ponytail-based-refinement
    last_updated_at: 2026-06-13T11:05:00Z
    last_updated_by: claude-opus
    recent_action: "12-iter deep research synthesized into research.md"
    next_safe_action: "Operator: /speckit:plan starting with Wave A additive doc rows"
---

# Research Report — Ponytail → sk-code / sk-code-review

**Method:** 10 generate iterations across 5 parallel waves (5 × Opus 4.8 via the account-2 `claude` CLI + 5 × gpt-5.5-fast-high via cli-opencode), each on a distinct angle; 1 round-2 adversarial cross-verify wave (each model refute-first against the other lane); plus orchestrator-side direct grep verification of every load-bearing factual claim. Read-only seats; orchestrator owns all writes (Gate-3 safe). **Research-only — no skill code changed in this packet.**

**All 7 load-bearing factual claims independently verified on disk** (Iron Law drift, no-vitest-in-CI, comment-hygiene allowed-before-violation ordering, mirror-sync-verify scope, Lane B correctness gate + sk-code benchmark verdicts, code_quality_checklist §7, router-sync guard behavior). Round 2 refuted **zero** recommendations as already-present or duplicative; it produced **two scope/framing corrections** (folded in below).

---

## 1. The core tension — resolved as complementary

Ponytail **gates design upfront** ("the best code is the code never written"; a 6-rung ladder; "a reflex, not a research project" — no loop). sk-code's **Iron Law is a verify loop** ("no completion without verification evidence"; Phase 1→1.5→2→3). These are **not** in conflict — they operate at different times:

> **Ponytail's ladder decides _what is the least code worth writing_ (Phase 1 entry, after read-first + surface routing). sk-code's Iron Law decides _can we claim the written result works_ (Phase 3).**

The transplant is coherent **only** if ponytail's "no-loop / reflex" stance is *not* imported literally to bypass READ-FIRST, SCOPE-LOCK, or Phase-3 verification. Every recommendation below respects that boundary.

---

## 2. Prioritized recommendations

Buckets: **ADOPT-NOW** (clear win, low/known risk), **ADOPT-LATER** (worth it, needs a decision or carries churn risk), **DO-NOT-ADOPT** (refuted / incompatible / redundant). Value/Effort and source iteration in each row. Corrections from round-2 verification are marked **[R2]**.

### ADOPT-NOW

| # | Recommendation | Target file(s) | Value/Effort | Source |
|--:|----------------|----------------|:-:|:-:|
| 1 | **Design Restraint Ladder** — encode ponytail's 6-rung order (YAGNI→stdlib→native→installed-dep→one-line→minimal) as a ~15-line subsection; attach at the Phase 0→1 transition, gate to intent=IMPLEMENTATION, run **after** surface+intent routing so rung vocabulary is surface-correct. **[R2]** Highest **value**, but the **highest-risk** ADOPT-NOW item (mutates the Phase-1 workflow + touches router precedence + Iron Law) — its clean integration is asserted, **not yet exercised**; prove it in the follow-up plan packet. | `sk-code/references/universal/code_quality_standards.md` (the subsection — it is in `DEFAULT_RESOURCE`, always-loaded) + a one-line precondition in `sk-code/references/phase_detection.md` (0→1) + one row in `SKILL.md` Phase Overview | High / S | iter-001 |
| 2 | Put the ladder text in the **existing** always-loaded universal doc — **not** a new `references/` file or `RESOURCE_MAP` key (a new routable doc trips the router-sync drift guard for ~15 lines — itself a ladder violation). Reference the CLAUDE.md anti-pattern table; do not restate it. | same as #1 | High / S | iter-001 F3/F4 |
| 3 | Add explicit **hand-rolled-stdlib** and **native-duplication** review rows (genuinely absent today — 0 grep hits). | `sk-code-review/references/code_quality_checklist.md` §6 Maintainability | High / S | iter-008 F1 |
| 4 | **Canary-lock the `Review status:` triplet** (`APPROVED`/`REQUESTED_CHANGES`/`COMMENTED`) — automation parses the final line by exact string match; drift silently breaks dispatcher gating. Wire as a **standalone script + new `.github/workflow` yml** (mirroring `comment-hygiene.yml`), **NOT** a vitest (no vitest is CI-gated here). **[R2]** Canary the **actual invariant string present in each file**, not a forced full-triplet — `references/pr_state_dedup.md` carries only the `COMMENTED` skip suffix. | `sk-code-review/SKILL.md` (final-line contract) + `README.md` + `changelog/v1.3.0.0.md` + `references/pr_state_dedup.md`; new `scripts/check-rule-copies.js` + `.github/workflows/rule-canary-sync.yml` | High / S | iter-005 F1 |
| 5 | Adopt **neutral `ceiling:` comment content** (shortcut + known ceiling + upgrade path = durable WHY, already allowed) — **not** the literal `// ponytail:` brand (reads as a perishable/cargo-cult label). | `sk-code` comment-hygiene policy / `references/universal/code_style_guide.md` | High / S | iter-004 F1, iter-001 F6 |
| 6 | Let `sk-code-review` treat a concrete ceiling comment as **P2-downgrade evidence** for KISS/YAGNI "too simple / missing-feature" false positives — **never** suppressing security/correctness/contract/persistence/auth findings. (Softest ADOPT-NOW: adds a review *behavior*, but bounded by the never-suppress floor.) | `sk-code-review/references/code_quality_checklist.md` §7 | Medium / S | iter-004 F2 |
| 7 | Add a **needed-ness KISS prompt** — "Was this new code asked for? If the requirement were dropped, would anything break? If not → removal candidate" — wired to a **removal** recommendation (cross-ref `removal_plan.md`), P2 default / P1 if it adds attack-surface/contract/regression risk. **No** new findingClass, **no** new severity tier (the enum is a fix-scope axis; "should this exist" is an action-direction already carried by `recommendation`). | `sk-code-review/references/code_quality_checklist.md` §7 KISS Checks | Medium / S | iter-007 F1 |
| 8 | Add a **`Replacement`** field to the removal-plan table ("what replaces removed code: nothing / stdlib API / native feature / shorter equivalent"). | `sk-code-review/references/removal_plan.md` §2 | Medium / S | iter-008 F3 |

> **[R2] Safe first implementation wave** (per both verifiers): ship the purely-additive doc rows first — #3 (stdlib/native), #8 (`Replacement` field), #4 (Review-status canary). Treat #1 (the ladder) as **highest-value-but-verify-integration**.

### ADOPT-LATER

| # | Recommendation | Target | Value/Effort | Source |
|--:|----------------|--------|:-:|:-:|
| 9 | **Canonicalize the Iron Law wording first, then** canary a minimal stable substring (`NO COMPLETION CLAIMS WITHOUT`). It is **already drifted 3 ways** — `sk-code/SKILL.md:45` "fresh verification evidence from the detected surface" vs `:137` "surface-appropriate verification" vs `CLAUDE.md:11` "stack-appropriate verification". A byte-canary would fail day one; locking before canonicalizing freezes the inconsistency. | `sk-code/SKILL.md` + `CLAUDE.md` | High / M | iter-005 F2 |
| 10 | `shrink` review row ("same behavior, equally clear, fewer lines") — most subjective of the three review additions; defer for style-churn risk; constrain to equal-clarity + behavior-preserving. | `sk-code-review/references/code_quality_checklist.md` §7 | Medium / S | iter-008 F2 |
| 11 | Fold a **`code_loc` + over-engineering-markers** metric into the **existing** deep-improvement Lane B sweep, reported only after the **correctness gate** (which ponytail's harness dangerously omits). Achievable as a reporter-layer add — `correctness-gate.cjs` already ranks eligible-only. | `deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs` + `sweep-benchmark.cjs` + `sweep-reporter.cjs` | Medium / M | iter-006 F1-F3 |
| 12 | Promote `mirror-sync-verify.cjs` from a deep-improvement **promotion-only** gate to a **repo-wide agent-mirror pre-commit + CI gate** (it already does token-set + path-normalized 3-runtime parity; today nothing catches a hand edit to `.claude`/`.codex` mirrors at commit time). | `deep-improvement/scripts/lib/mirror-sync-verify.cjs` → `.opencode/hooks/pre-commit` + `.github/workflows/` | High / S | iter-009 F1 |
| 13 | Add `verify_stack_folders.py` — assert sk-code's declared `STACK_FOLDERS` ↔ on-disk `references/<surface>/`+`assets/<surface>/` stay in sync (the §1 "update STACK_FOLDERS to match" instruction is unenforced today; router-sync checks `RESOURCE_MAP` paths, not `STACK_FOLDERS`). | new `sk-code/assets/scripts/verify_stack_folders.py` + retarget checklist | Medium / S | iter-009 F3 |
| 14 | `SK_CODE_REVIEW_DEPTH` env var (env>config>default, mirroring `SK_CODE_REVIEW_MIN_CHANGED_LINES`) that **names + persists the already-existing ON_DEMAND tier** — alias only, floors immutable. The *only* salvageable graft from the intensity-slider lens. | `sk-code-review/SKILL.md` §9 | Medium / S | iter-003 F4 |
| 15 | SessionStart surface-priming hook + UserPromptSubmit standards-injection hook (compact, generated). Real UX value; deferred for the 3-runtime wiring/drift cost. | `sk-code/scripts/hooks/` + `.claude`/`.codex` settings + optional `.opencode/plugins/sk-code.mjs` | High / M | iter-002 F1-F3 |
| 16 | Cross-runtime canary for shared **review-agent** invariants (`.opencode`/`.claude`/`.codex`), narrowly scoped — do **not** link the agents' `APPROVE/REQUEST CHANGES/BLOCK` header vocab to the skill's `Review status:` contract (deliberately separate surfaces). | review-agent mirrors | Medium / M | iter-005 F3 |
| 17 | Implementer **anti-stall** rule in `sk-code` §4 RULES: "build the simplest correct implementation of the requirement *as specified* — don't stall; if part looks unnecessary, implement-as-specified **and** raise a scope-amendment recommendation in the same response; never silently cut scope (SCOPE-LOCK), never block solely to ask when a safe minimal version exists." | `sk-code/SKILL.md` §4 | Medium / S | iter-007 F2 |

### DO-NOT-ADOPT (negative knowledge)

| Rejected | Why | Source |
|----------|-----|:-:|
| `sk-code` verification **lite/full/ultra slider** (the "most overrated" transplant) | `lite` lowers Phase-3 evidence = Iron-Law breach; `full/ultra` just rename existing conditional escalation ("when runtime behavior changes"). | iter-003, iter-010 |
| `sk-code-review` depth slider that relaxes the ALWAYS/security floor | ALWAYS/CONDITIONAL/ON_DEMAND tiers + the taxonomy-gated M-2 "safe lite" already cover graduated depth without lowering floors. | iter-003 |
| Standalone **PromptFoo clone** | Duplicates the existing deep-improvement Lane B sweep **and** copies ponytail's missing correctness gate. Fold one metric in instead (#11). | iter-006 |
| Standalone **ponytail-review** skill | Violates the "one review baseline" rule; would split severity/output doctrine. Merge the checks as rows instead (#3, #8, #10). | iter-008 |
| `net: -N lines` / LOC as a **severity gate or score** | Incentivizes under-solving; contradicts the P0/P1/P2 non-numeric gating contract. At most optional supporting evidence in the Removal/Iteration Plan. | iter-006, iter-008 |
| New **findingClass** or severity tier for over-engineering/YAGNI | `findingClass` is a fix-scope/propagation axis; "code that should not exist" is an action-direction already carried by `recommendation` + `removal_plan.md`. | iter-007 F3 |
| Adding `ceiling:` to comment-hygiene **`ALLOWED_PATTERNS`** | Allowed patterns are checked **before** violation patterns (`check-comment-hygiene.sh:194-199`), so a forbidden ID on the same line would be silently skipped — a bypass. Use a separate detector if tool recognition is needed. | iter-004 |
| Literal `// ponytail:` brand prefix | Reads as a perishable/cargo-cult label; keep the ceiling+upgrade-path **content** (#5), drop the brand. | iter-001 F6, iter-004 |
| Repo-visible `.sk-code-active` flag file by default | SessionStart writes would dirty the repo; use a runtime/cache path only if persistence is explicitly accepted. | iter-002 F5 |
| Ponytail's intensity **state-machine** / per-session persistence | Multi-axis (breadth×depth×strictness) over hard floors can't be honestly represented by a single dial; disproportionate maintenance. | iter-001, iter-003 |
| Byte-equality copies / always-on per-turn injection / 9-host fan-out for skills | Don't scale to a multi-file router: the repo already uses token-set comparison; skills live **once** and are `Read()` by every runtime (no per-host adapter needed — only *agents* have a mirror problem); on-demand progressive disclosure is the correct opposite of always-on injection. | iter-009 F4 |

---

## 3. Precedence / conflict matrix

| Boundary | Rule for any adopted mechanism |
|----------|-------------------------------|
| **Comment hygiene HARD BLOCK** | Neutral `ceiling:` content is durable-WHY (allowed); never the `ponytail:` brand; never whitelisted in `ALLOWED_PATTERNS`. |
| **Surface-router precedence** | Ladder + hooks run **after** surface detection; they consume `OPENCODE>WEBFLOW>UNKNOWN`, never compete with it. |
| **Iron Law** | No `lite`/intensity mode may lower Phase-3 evidence. |
| **READ-FIRST / SCOPE-LOCK** | Ponytail's "reflex, not research" → "post-read reflex"; YAGNI challenge → surfaced scope-amendment, never silent scope-cutting. |
| **P0/P1/P2 non-numeric gating** | No LOC / `net -N` / numeric threshold decides blocking severity. |
| **Security/correctness floor** | Ceiling comments, depth aliases, and YAGNI checks never suppress security/auth/persistence/sandboxing/public-contract/correctness findings. |
| **One review baseline** | Merge ponytail-review ideas as rows; no second review skill/output-contract/doctrine. |
| **Hook/runtime parity** | Claude/Codex settings hooks and the OpenCode plugin are different surfaces; one implementation ≠ parity. |
| **Canary discipline** | Lock only automation-parsed strings or safety invariants; canonicalize drift first; never lock volatile prose/version-numbers/file-counts/example-paths. |

---

## 4. Bonus latent defects surfaced (not in original scope, worth fixing)

1. **Iron Law wording is already drifted 3 ways** (`sk-code/SKILL.md:45` "fresh verification evidence from the detected surface" / `:137` "surface-appropriate verification" / `CLAUDE.md:11` "stack-appropriate verification"). Canonicalize before any canary (#9).
2. **`mirror-sync-verify.cjs` is mis-scoped** — it's a working `check-rule-copies.js` analog but fires only during a guarded deep-improvement promotion; a hand edit to a `.claude`/`.codex` agent mirror is caught by **nothing** at commit/CI time (#12). The 3-runtime mirror convention has no enforcing gate today.
3. **`STACK_FOLDERS` ↔ `references/` binding is unenforced** — the sk-code §1 template-adoption instruction ("update STACK_FOLDERS to match") has no validator (#13).

---

## 5. Suggested sequencing for the follow-up `/speckit:plan`

1. **Wave A (safe, additive docs):** #3 stdlib/native rows, #8 `Replacement` field, #7 needed-ness prompt, #5 neutral ceiling-comment convention, #6 P2-downgrade evidence. Pure checklist/policy text; no workflow change.
2. **Wave B (guards, proven patterns):** #4 Review-status canary (per-file scoped), #12 promote mirror-sync to a repo-wide gate, #13 `verify_stack_folders.py` — all reuse the `comment-hygiene.yml` script-from-yml gate pattern.
3. **Wave C (needs a decision / integration proof):** #9 canonicalize Iron Law then canary; #1 Design Restraint Ladder (prove clean Phase-1 integration against router precedence + Iron Law before shipping); #14 `SK_CODE_REVIEW_DEPTH` alias; #17 implementer anti-stall rule.
4. **Wave D (heavier, optional):** #11 simplicity metric in Lane B sweep; #15 hooks; #16 cross-runtime review-agent canary.

**This packet stops at recommendations.** Next: `/speckit:plan` (start with Wave A) → `/speckit:implement`.

---

<!-- ANCHOR:references -->
## 6. Provenance

12 iterations recorded in `research/deep-research-state.jsonl` (10 generate + 2 verify); per-iteration narratives in `research/iterations/iteration-0NN.md`; deltas in `research/deltas/`. Models: `claude-opus-4-8` (account-2 CLI, read-only) ×6, `openai/gpt-5.5-fast` (cli-opencode, read-only) ×6. Every recommendation cites a grep-traceable path; every load-bearing factual claim was independently verified on disk by the orchestrator.

Representative evidence:
- [SOURCE: .opencode/skills/sk-code/SKILL.md:45] — Iron Law "no completion claim without fresh verification evidence from the detected surface" (drift baseline for rec #9).
- [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:194-199] — ALLOWED_PATTERNS checked before VIOLATION_PATTERNS (basis for the "do not whitelist `ceiling:`" rule, #5/DO-NOT-ADOPT).
- [SOURCE: .opencode/skills/sk-code-review/references/code_quality_checklist.md:141-142] — "P2 default … escalate to P1 if … behavior/regression risk" (basis for recs #6/#7).
- [SOURCE: .opencode/skills/deep-improvement/scripts/lib/mirror-sync-verify.cjs] — existing 3-runtime parity check, mis-scoped to promotion-time (basis for rec #12).

<!-- /ANCHOR:references -->
