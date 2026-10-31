# Iteration 002 — Candidate (a): advisor-brief pointer

- Status: complete
- newInfoRatio: 0.75 (candidate mechanics are new; the admission bar and federation constraints carry over)
- Focus: What a pointer line in the advisor brief would emit, its silence condition, per-turn cost, action-vs-topic matching, portability, and the evidence for and against.

---

## 1. WHAT IT WOULD EMIT

**The brief today.** `renderAdvisorBrief` emits `Advisor: {freshness}; use {skill} {c}/{u} pass.` (or the ambiguous two-skill variant), then appends `\nDirectives:` + the fixed hygiene directive — appended *after* the 80-token route cap, so the directive is never truncated (`render.ts:438-449`; caps at `:90-93`; `HYGIENE_DIRECTIVE` at `:112`; `DIRECTIVES_LABEL` at `:118`). Three emit sites: ambiguous branch `render.ts:441`, normal branch `:449`, and the no-brief fallback `renderAdvisorFallbackDirective` `:486`.

**Measured sizes (this iteration).** Route line (sample): 42 bytes. `DIRECTIVES_LABEL`: 12 bytes. `HYGIENE_DIRECTIVE`: 207 bytes. Current full brief ≈ 261 bytes (≈65 tokens at the renderer's own 4-chars/token estimate, `render.ts:93`). A compact pointer line drafted for measurement ("Repo rules: before your first write in a repository with REPO RULES.md, match your action against its trigger table and load every rule file it names (Gate 5)."): 162 bytes ≈ 40 tokens.

**Candidate (a) emission.** A pointer is a second fixed directive in the same capsule, e.g. appended after the hygiene directive, naming the repo-root router (not the corpus path). It would ride the same delivery machinery: full delivery on first message and lifecycle boundaries, suppressed to route-only between them (`directive-lifecycle.ts:121-180`; boundary events `:72-74`; route-only head `:149`).

## 2. SILENCE CONDITION

Three nested silences exist today before any new one:

1. **No brief renders at all** when status ≠ ok, freshness ∉ {live, stale}, no recommendation passes threshold, or the top label fails sanitization (`render.ts:399-430`). The fallback directive still fires in these cases (`:476-489`), so a directive-level pointer would still emit on outage/no-match paths.
2. **Dedup suppression** keeps only the route head on proven repeats — a repeat in a known session drops the directives block entirely (`directive-lifecycle.ts:175-179`; handler call `user-prompt-submit.ts:361-374`; contract description `injection-contract.md:64`).
3. **Any missing evidence fails back to full delivery** — unknown session, unconfirmed identity, no transcript, clock instability, dedup kill switch (`directive-lifecycle.ts:125-135,147,157-162`; `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` restores always-full).

A pointer would add one more condition that does **not** exist today: repo relevance. The renderer is deliberately repo-agnostic — it "renders from typed advisor output only" and ignores prompt text (`render.ts:389-394`); the handler does carry `workspaceRoot` (`user-prompt-submit.ts:295,314-321,381`), so an existence check for `REPO RULES.md` is feasible at the handler, but it would split directive composition across surfaces. Without that check the pointer emits in every repo the hooks run in, including repos where Gate 5 has nothing to load (`AGENTS.md:94`).

## 3. PER-TURN CONTEXT COST (measured/estimated from code)

- **Full-delivery turns** (first message, startup/resume/compact/clear boundaries, directive content change, transcript shrink): +162 bytes ≈ +40 tokens on top of today's ~261-byte brief.
- **Suppressed turns** (proven repeats between boundaries): +0. The route head is retained; directives dropped (`directive-lifecycle.ts:149`).
- **Every turn regardless**: the pointer changes the directives string, which forces one full redelivery per session on rollout (`record.directives !== parts.directives` → full, `:168`).
- Honest basis note per 022's rule (F7): no log exists for a non-existent feature, so this cost is derived from the code path that fixes delivery frequency, not read from a log. The delivery rate is deterministic: once per session + boundaries.

## 4. ACTION VS TOPIC MATCHING

The brief fires per user prompt and its route line matches on prompt content (the advisor scores the prompt). The pointer directive itself matches **nothing** — it is a static standing reminder. It cannot key on "the action about to be taken" because at prompt time no action exists. The action match still happens in the model's head at write time, exactly as Gate 5 describes (`AGENTS.md:96`). So candidate (a) is a *reminder surface*, not an action-keyed surface; its claimed value is timing (it arrives before the model plans a turn's actions, where Gate 5 only fires at the first write).

## 5. PORTABILITY

- The pointer must name the repo-root router (`REPO RULES.md`), never the corpus path: the corpus location differs per repo — `.skilled/repo-rules/` here, `repo-rules/` (root) in the sibling layer, `Obsidian Plugin/repo-rules/` in the sibling itself (F9). The router exists at every repo root that opts in (`REPO RULES.md:3-6`; sibling has its own).
- Hooks travel by symlink: `Obsidian Plugin/.skilled` → `Public/.skilled` (listing), so the same code emits in the sibling. An existence check on `REPO RULES.md` would be correct in both repos.
- Runtimes: the same directive text reaches Claude/Cursor/Devin/Codex/Pi through the shared handler and OpenCode through the plugin mirror (`injection-contract.md:65-66`; plugin mirror `plugins/system-skill-advisor.js:68-73,1229-1236`). A pointer added to `render.ts` alone would not reach OpenCode unless the plugin mirror is updated — the plugin duplicates the separator/block machinery and prefers the compiled renderer when available (`system-skill-advisor.js:69-70`).

## 6. EVIDENCE FOR

- It fires **before the first write** (per user prompt), so it can precede the model's plan; Gate 5 fires only at the first write (`AGENTS.md:93-94`).
- It survives the exact case the hygiene directive was built for: "hook-capable runtimes receive the comment hygiene rule even when AGENTS.md is absent from session context" (`render.ts:110-111`). In a runtime without AGENTS.md, Gate 5 is absent entirely; a pointer would be the only trace of the repo-rules obligation.
- Boundary redelivery means the pointer returns after compact/clear, when the model's memory of the router is weakest (`directive-lifecycle.ts:72-74`).

## 7. EVIDENCE AGAINST

- **022's admission bar**: a prompt-time injection earns its slot by naming a specific prohibition a gate enforces, not by restating a disposition the always-loaded document already carries (`022 implementation-summary.md:51`). The pointer names an obligation (Gate 5) that AGENTS.md §2 carries in context in this repo family; it names no specific prohibition. The two directives retired before it failed exactly this test (`injection-contract.md:54`).
- **The hygiene comparison is asymmetric**: hygiene survived because a pre-commit gate enforces it as tooling (`injection-contract.md:54`). Repo rules have no enforcing tooling; the "gate" is documentation itself, so the pointer is weaker than the one directive that survived.
- **Blast radius**: three emit sites in `render.ts` (`:441,:449,:486`), the OpenCode plugin mirror (`system-skill-advisor.js:68-73`), and exact-string tests that pin the brief byte-for-byte (`runtime/tests/legacy/advisor-renderer.vitest.ts:15-22,30-38`), plus the policy-plan/observation-sink suites.
- **A content change forces one full redelivery in every live session** (`directive-lifecycle.ts:168`) — a one-time cost, but it lands in every session at rollout.
- **No repo-relevance signal exists**; unconditional emission adds bytes in repos where the pointer is false, and conditional emission splits directive composition across the renderer and the handler.

## 8. RULED OUT / TENSION NOTES

- Naming the corpus path in the pointer text — ruled out on portability (F9: three different corpus locations).
- Treating the pointer as an action-keyed surface — it cannot match actions at prompt time (section 4).

## 9. NEXT FOCUS

Candidate (b): `corpus.mjs` `CORPUS_ROOTS` and the Gate 1 lookup — what a lookup would return for rule files, the committed-index cost, the silence path (exit 1 no-hit), and the documented decision-against at `retrieval-conventions.md:284`.
