{"timestamp":"2026-09-12T12:40:46.888Z","runtime":"claude","status":"ok","freshness":"live","durationMs":953,"cacheHit":false,"skillLabel":"sk-code"}
# Iteration 1 — Ground truth

## 1. INVENTORY

The read-only gap is broad, not narrow: eight of the eleven rule files carry a firing condition that fires while merely reading and answering.

- `communication.md:37` — "About to write any substantive reply, an answer, an explanation, a close-out, a status." AGENTS.md `:404` confirms its trigger is "every substantive reply".
- `evidence-and-proof.md:34-38` — reporting a result, a number, a path, a tool/sub-agent's finding; closing out a turn.
- `uncertainty-and-honesty.md:33-37` — answering without certainty, naming an unverified path/flag/version, operator disagreement.
- `presenting-decisions.md:35-39` — recommendations, forks, trade-offs, ambiguous requests, long-run reports.
- `handoff-and-questions.md:35-39` — "About to end a turn, of any kind, substantive or not"; asks, forks, un-made decisions.
- `delegation-and-orchestration.md:41` — "About to answer a judgment question ... from your own reading alone."
- `root-cause-and-debugging.md:34-37` — anything failing; diagnosis is usually read-only investigation.
- `skill-hub-routing.md:38-39` — "Reporting that a mode is registered, routed, reachable or integrated. Running a per-hub gate and quoting its result."

Write-bound only: `prevent-overengineering.md:37-40`, `blast-radius.md:33-37`, `scope-discipline.md:35-39` (its `:39` "deciding what to do with the rest" is the one borderline firing).

The repository has already noticed this and built a second remedy. AGENTS.md `:239` states the four verification standards "bind unconditionally, including on a read-only turn where Gate 5 never fires and no rule file loads", and `:410` keeps two §8 clauses "because they bind regardless of what loads". `uncertainty-and-honesty.md:48-49` explicitly refuses to duplicate AGENTS.md §2's table. So the operative binding surface for read-only turns is AGENTS.md carriage plus one injected directive — not Gate 5, which by its own text (`AGENTS.md:122`) never fires there.

## 2. CANDIDATES

**C1 — the reply-disposition trio (communication / presenting-decisions / handoff-and-questions).**
Trigger: every substantive reply. Silence: none is available that does not defeat the rule — session-dedup would silence it after the first reply while `communication.md:40-42` says it must apply "whenever a reply is being written, or it silently stops applying to the short answers that need it most." There is no observable per-turn signal separating replies that need it from those that do not; every reply is the signal. Wrong-fire cost: a per-session directive line on every session forever, plus visible prompt pollution on Pi, where injected text lands on the user's own prompt (`injection-contract.md:66`). Bar: **retired side** — these are exactly the "disposition every turn" the governor/proof directives were retired for (`injection-contract.md:54`), and AGENTS.md `:402-410` already carries the operative clauses.

**C2 — uncertainty-and-honesty's fabrication prohibition (`:66-68`: never invent paths, flags, versions).**
Trigger candidate: any answer. Silence: **no observable signal exists**, and this is structural — prompt-time hooks "fire once per user turn, before the model call" (`injection-contract.md:46-48`). The defect lives in the reply, which does not exist yet when the hook decides. No current surface scores the to-be-generated text; the existing classifiers score the prompt (spec-gate, advisor) or resolve a path named in the prompt (vision, `injection-contract.md:100`). Wrong-fire cost: fires nearly every turn in a research-heavy repo — this packet is the live example. Bar: **retired side** — posture already carried unconditionally at AGENTS.md `:482-484`, no gate enforces it. If enforcement is wanted, that is a citation-check gate, not a directive.

**C3 — evidence-and-proof §7 "a finding is a hypothesis" (`:36`, `:129-134`).**
Trigger: a sub-agent/tool result being acted on. Silence: none at prompt time — the event is mid-turn and prompt-time has passed. The matching surface family is tool-time (`injection-contract.md:191-204` documents post-edit-quality as the precedent). Bar: **retired side** — AGENTS.md `:245` already carries it verbatim and unconditionally; no gate. Leave where it is.

**C4 — skill-hub-routing ("registered is not routed", `:43`; AGENTS.md `:114`).**
Trigger: a prompt about wiring or reporting routing. Silence: available and observable — no routing vocabulary in the prompt; prompt classification is production machinery (Gate 2 matching, spec-gate's classifier at `injection-contract.md:82`). Wrong-fire cost: low elsewhere, but this repository talks routing constantly, so persistent false positives here. Bar: prong 1 clears — it is a specific prohibition. Prong 2 **fails**: `skill-hub-routing.md:75` says the per-hub gate "asserts only presence, never reachability. Several surfaces have no gate at all", so nothing enforces the claim the rule governs. Also carried at AGENTS.md `:114`. This lands on the repo's own precedent that unenforced prompt-time discipline stays in AGENTS.md (`:380`). If enforcement is wanted, build the check — that is a "change the rule" move.

**C5 — mass deletion at pre-push (open thread).**
The pre-commit chain notes "Mass-deletion guard: retained at pre-push only" (`.opencode/scripts/git-hooks/pre-commit:33-34`). Gate exists; but the violation is authored in a bash call, which prompt-time cannot observe, and deletion vocabulary has no resolving-path equivalent — no crisp silence signal. Lean: leave; the tool-time preflight family (`injection-contract.md:156-167`) is the only surface that could see it. Carried to iteration 2.

**C6 — the prior round's two refusals (context-gathering, design-loading).** Tested against the bar rather than restated: both are workflow/posture rules, which the corpus's own scope statement excludes ("Out: skill routing, workflow selection", `REPO RULES.md:85-89`), and whose content AGENTS.md `:178-181` already carries ("Plan before acting", "Use a research-first approach"). They fail **both** prongs, so the prior refusal is over-determined — reach was sufficient but not the only defect; an injection surface would not revive them.

## 3. SURFACE

Yes, the existing contract can carry new directive text with no new mechanism: the directive block is an extensible frozen array (`render.ts:91-95`), rendered under `DIRECTIVES_LABEL` (`:105-107`), with per-session delivery gating owned by `policy-plan.ts`/`directive-lifecycle.ts` (imports at `render.ts:7-20`), and every prompt-capable runtime already receives the brief (`injection-contract.md:66`; `skill-advisor-hook.md:53-58`).

But "can carry" is not "should carry". Three silence models exist in production, and a proposal must name which one it uses: once-per-session receipt dedup with fail-open to full delivery (`injection-contract.md:64`; `skill-advisor-hook.md:40`), classified-intent once per session until answered (`:82`), and positive-resolution per turn (`:100-101`). I found no candidate for which any of the three can be stated honestly.

## 4. PORTABILITY

The surviving directive is path-free: `render.ts:101` names concepts, zero workspace or hub paths — that is why it travels. The constraint (`spec.md:56`) is "hub names are stable; paths inside hubs are not", so injectable content may name a hub or a convention, never an intra-hub location. The mechanism already complies: install-anchored resolution, not CWD-relative (`skill-advisor-hook.md:36`, `:53`). If content-injection were ever wanted, the portable shape reads the workspace's own convention-anchored corpus (root `REPO RULES.md` → `repo-rules/`, `AGENTS.md:11`), with file-absence as the natural silence signal (`AGENTS.md:122`). The gate side models the same idea: the pre-commit chain skips cleanly where the toolchain is absent (`pre-commit:45-48`). No candidate this iteration survives to need this.

## 5. VERDICT

**Leave at Gate 5 — refuse new prompt-time injections, iteration 1.** No current-corpus candidate clears the recorded bar; each fails on a named prong, and C1/C2/C3 fail the noise constraint independently. The read-only bindings remain carried by AGENTS.md's unconditional clauses and — where a gate backs a prohibition and the fix is semantic and far from the gate — by the one surviving directive. Recorded refusal test: (1) the two-prong bar (`injection-contract.md:54`); (2) observability — prompt-time fires before generation, so reply-content violations have no trigger; (3) silence — an observable signal among the three production models; (4) portability — path-free or repo-sourced content. C4 and C2 carry a "change the rule instead" note: their gap is enforcement, and that is a gate proposal, not an injection.

Open threads for iteration 2, to test rather than restate: (T1) read the pre-push script and close C5; (T2) enumerate which sessions actually lack AGENTS.md (`render.ts:99-100` claims they exist) — only those justify directive reach for gate-backed content; (T3) verify the silence mechanics at code level in `policy-plan.ts`/`directive-lifecycle.ts` rather than doc level; (T4) one pass over pre-commit sub-gates for any prohibition with zero carriage and large authoring-to-enforcement distance.
