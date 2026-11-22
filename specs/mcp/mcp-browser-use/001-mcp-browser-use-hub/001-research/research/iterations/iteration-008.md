# Iteration 8: KQ8 — does Bladebro take over Aside's deterministic signed-in work?

## Focus

Answer KQ8 with a yes/no and the cases that decide it. The "answered means" bar is "A yes or no with the cases that decide it" [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:75]. This is the last open key question and the single dependency 004 is waiting on: its scope is conditional — "Changing Aside's scope — only if 001-research KQ8 says Bladebro takes over its deterministic signed-in work" [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:90] [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:148] [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:46].

Ambiguity resolved narrowly: "deterministic signed-in work" is read as Aside's `aside repl` lane under a signed-in account (deterministic, evidence-friendly, single-writer, human-gated) — not the broader class of all signed-in browser work. The deferred reading (all signed-in work, including agentic/stealth) is handled explicitly in Finding 5 as complement cases rather than folded into the decision. All Bladebro claims stay pinned to **v4.8.2**, published 2026-11-20T16:33:56Z, read 2026-11-21. Per the recommended next focus, this iteration used already-captured KQ1/KQ2/KQ7 evidence plus the previously unread 004 scope lines; no upstream docs were re-fetched and no binary was installed or run (the iteration-1 BLOCKED directions were respected).

## Actions Taken

1. Read state: config (iteration 8, sessionId `2026-11-21T08:29:48.000Z`, `progressiveSynthesis: true`, budget 24 calls), deep-research-state.jsonl (7 prior iteration records + iteration_start for 8), strategy (KQ8 next focus; BLOCKED approaches checked), findings registry (KQ1 + KQ8 open, KQ2-KQ7 resolved).
2. Verified packet-local write boundary: `iterations/iteration-008.md` and `deltas/iter-008.jsonl` absent, `research/research.md` present at the synthesis slot, no reducer-owned file scheduled for write.
3. Read the KQ8 "answered means" bar [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:75], the full KQ1 capability matrix [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-001.md:20-38], the KQ7 R-SEC-1/R-SEC-2 findings [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-007.md:18-32], and the canonical synthesis [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md:15-30,110-113].
4. Read the decisive local contracts: 004's scope/out-of-scope/open-question/dependency lines [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:46,90,148] and Aside's deterministic REPL, profile-binding, permission, and single-writer rules [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:55-63,102-104,107,116,120-122,132,142-144].

## Findings

### Finding 1 — Decision: NO. Bladebro does not take over Aside's deterministic signed-in work

Keep Aside as the owner of deterministic signed-in work; Bladebro is a complement, not a replacement. The three cases below each independently decide "no", so the answer is not a close judgment call. Because KQ8 says no, 004's conditional out-of-scope line does not fire: "Changing Aside's scope" stays out of scope and 004's single KQ8 dependency resolves to "no change to Aside" [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:90] [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:148] [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:46].

### Finding 2 — Deciding case 1 (determinism): agentic `run` plans cannot satisfy "deterministic"

Aside's deterministic lane is `aside repl "<JavaScript>"` — a persistent, sandboxed ES2023+/Playwright REPL with a 120-second call timeout, no `import`/`require`, independently verified artifacts, and deterministic evidence-friendly steps (tab, snapshot, screenshot) [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:55-63] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:102-104] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:132]. Bladebro's closest analogue is `run` plans with branches, bounded loops and up to 1000 steps that return `completed`/`stopped` [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-001.md:21] [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md:100]. A goal-driven plan with branches and loops is agentic, not replay-deterministic, so it fails the defining word of "deterministic signed-in work" [INFERENCE: based on the `run` plan contract and the `aside repl` contract].

### Finding 3 — Deciding case 2 (consent/ownership): R-SEC-1/R-SEC-2 gates make Bladebro the heavier default

Aside's signed-in account is the default owner, gated by a single-writer rule per account/profile, permission modes Read only/Guard(default)/Full with Deny winning, saved-password values never exposed, and MFA/CAPTCHA/vault-unlock/approval pauses that require a human [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:116] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:120-122] [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-001.md:28]. Bladebro's equivalent real-browser lane is `rb` ("your browser"), which is explicitly NOT its default — the default is the owned agent-browser profile with injection off; `rb` requires an explicit operator request, operator selection of profile/account before handoff, `attach` to keep a caller-owned browser open, and `rb pause`/`resume` consent gating (R-SEC-1); a stealth ToS gate and terminal `blocked:` verdict apply (R-SEC-2) [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-007.md:18-32] [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md:110-112] [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-001.md:28]. Promoting `rb` to the default for deterministic signed-in work would invert R-SEC-1's owned-profile default and force every such task through a real-browser consent gate — a safety regression, not a takeover [INFERENCE: based on R-SEC-1 and Aside's default-signed-in model].

### Finding 4 — Deciding case 3 (contract/scope): 004 explicitly gates the takeover on this answer

004 lists "Changing Aside's scope — only if 001-research KQ8 says Bladebro takes over its deterministic signed-in work" as out of scope [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:90], restates "Does Bladebro take over Aside's deterministic signed-in work? 001-research KQ8 answers it, and this scope changes if it does" as its only open question [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:148], and lists KQ8 as a dependency [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:46]. A "no" answer is the contract-clean outcome: 004 stays within its authored scope and does not touch the Aside packet. This is the deciding case that makes "no" the conservative, in-scope answer even if the capability cases were judged a tie [INFERENCE: based on the three 004 lines].

### Finding 5 — Complement cases (where Bladebro wins) are not takeover, and define the routing tie-break

Three cases favour Bladebro, but none is "deterministic signed-in work": (a) stealth/anti-detection on a signed-in site — Bladebro is the only stealth surface (R-SEC-2), Aside documents none [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-001.md:29] [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md:111]; (b) a caller-owned browser that must stay open — `rb attach` connects to a caller-owned debug endpoint and leaves the browser open on detach, whereas Aside has no equivalent isolation and requires a bound profile [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-007.md:20] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:107,120]; (c) agentic, branching signed-in workflows where determinism is not required — `run` plans are the better fit [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-001.md:21]. The hub-router tie-break already encodes an Aside↔Bladebro overlap on agentic signed-in work [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md:64]. With KQ8 = no, that tie-break should route deterministic signed-in proof → Aside and agentic/stealth signed-in → Bladebro, keeping both modes rather than removing either.

## Questions Answered

- **KQ8 — answered. No.** Bladebro does not take over Aside's deterministic signed-in work. Deciding cases: (1) agentic `run` plans cannot satisfy determinism; (2) the R-SEC-1/R-SEC-2 real-browser consent gates make Bladebro the heavier, non-default lane; (3) 004 explicitly gates the takeover on a "yes" and a "no" keeps it in scope. Complement cases (stealth, caller-owned attach, agentic branching) go to Bladebro via the hub tie-break without changing Aside's scope.

## Questions Remaining

- None of KQ1-KQ8 remain unanswered. KQ1's Lighthouse contradiction is a documented open contradiction, not an unanswered key question; it is KQ1-owned and does not affect KQ8.

## Ruled Out

- Broad web search for Bladebro facts: BLOCKED since iteration 1; not retried (no upstream fetch needed).
- Live `bladebro` probes or installing the binary: BLOCKED since iteration 1; install is a 006 operator stop-for-yes and a charter non-goal [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:98-100].

## Dead Ends

None. The decision was reachable from already-captured KQ1/KQ2/KQ7 evidence plus the 004 scope lines; no new search was required. Candidates for reducer promotion to strategy "Exhausted Approaches": none — no research direction was eliminated here.

## Edge Cases

- **Ambiguous input**: "deterministic signed-in work" could mean all signed-in work or specifically Aside's deterministic `repl` lane. Selected the narrow `aside repl` reading as the decision subject; handled the broader reading explicitly as Bladebro complement cases (Finding 5).
- **Contradictory evidence**: none new. 004's takeover line is conditional, not a conflicting claim; a "no" answer simply leaves the condition false.
- **Missing dependencies**: `bladebro` absent from PATH (non-goal); all Bladebro claims are pinned v4.8.2 upstream evidence, not observed results.
- **Partial success**: none — all targeted local evidence was obtained.

## Sources Consulted

- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:75,98-100
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:46,90,148
- .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:55-63,102-104,107,116,120-122,132,142-144
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-001.md:20-38
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-007.md:18-32
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md:15-30,64,100,110-113

## Assessment

- New information ratio: 0.70 — one finding fully new (the explicit NO decision plus the previously unread 004 scope lines as the contract deciding case); four findings partially new (determinism, consent/ownership, and complement cases reframe already-captured KQ1/KQ2/KQ7 evidence; the routing tie-break reuses KQ3 evidence). (1 + 0.5×4) / 5 = 0.60, plus a +0.10 synthesis bonus for closing the last open decision and giving 004 an in-scope resolution = 0.70.
- Questions addressed: KQ8. Questions answered: KQ8.
- Questions remaining: none (KQ1 Lighthouse contradiction remains a documented sub-issue).

## Reflection

- **Worked**: reading 004's conditional out-of-scope line first turned a subjective "who is better at signed-in work" comparison into a contract-gated decision with a conservative default ("no" = no scope change). Framing the answer as three independent deciding cases, then separating complement cases, kept the "no" from overclaiming that Bladebro is inferior in every signed-in scenario.
- **Did not work**: nothing failed. The only limitation is the ambiguity of "deterministic signed-in work"; recorded as an edge case with the narrow reading chosen and the broad reading handled as complement cases.
- **What I would do differently**: nothing for KQ8. For the remaining synthesis work, add the KQ8 section to `research.md`, update its status line to all-questions-answered, and add the KQ8 consequence to the 004 per-phase note so the next session sees a complete handoff.

## Recommended Next Focus

KQ8 is the last key question; no new research focus is required. The remaining work is synthesis and closure: (1) write the KQ8 answer into `research.md` and flip its status to "KQ1-KQ8 answered"; (2) add the KQ8 consequence to the 004 per-phase note (Bladebro does not change Aside's scope; hub tie-break routes deterministic signed-in → Aside, agentic/stealth signed-in → Bladebro); (3) let the reducer tick KQ8 resolved in the registry and strategy. The KQ1 Lighthouse contradiction may be resolved in a later iteration if depth budget remains, but it is not required for the charter's "answered means" bar.
