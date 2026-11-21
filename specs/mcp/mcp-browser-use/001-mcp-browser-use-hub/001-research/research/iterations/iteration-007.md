# Iteration 7: KQ7 security findings for the 004 safety rules

## Focus

Turn the constraints already captured in iterations 1/2/6 into three security findings the 004 safety rules can quote verbatim, plus the one-to-one REQ-002 mapping that makes them quotable. The "answered means" bar is: findings on signed-in profiles, stealth and site terms of service, and the npm binary supply chain, **each with a mitigation the 004 safety rules can quote** [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:74]. 004's scope names exactly these three families and REQ-002 requires each KQ7 risk in `research.md` to map to one packet rule [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:84] [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:113].

Interpretation: "security finding" means a risk statement plus a concrete, 004-quotable mitigation — not an exploit test and not an install (install and live probes remain a 006 operator stop-for-yes [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:98-100]). All Bladebro claims stay pinned to **v4.8.2**, published 2026-11-20T16:33:56Z, read 2026-11-21 [SOURCE: https://api.github.com/repos/dondai44423/bladebro/releases/latest]. The iteration-1 BLOCKED directions (broad Bladebro web search; live `bladebro` probes) were respected: only specific known upstream URLs were fetched and no binary was installed or run.

## Actions Taken

1. Read state: config (iteration 7, sessionId `2026-11-21T08:29:48.000Z`, `progressiveSynthesis: true`, budget 24 calls), state JSONL (6 prior iteration records + iteration_start for 7), strategy (KQ7 next focus; 11 BLOCKED approaches checked), findings registry (KQ2-KQ6 resolved; KQ1, KQ7, KQ8 open).
2. Verified packet-local write boundary: `iterations/iteration-007.md` and `deltas/iter-007.jsonl` absent, `research/research.md` present at the synthesis slot, no reducer-owned file scheduled for write.
3. Read the KQ7 "answered means" bar [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:74], 004 REQ-002 / scope / risk rows [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:84,113,139-140], the 004 dependency on KQ7 [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:46], the iteration-6 consent-gating finding [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-006.md:51-53], and the iteration-1 signed-in/stealth matrix rows [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-001.md:28-29].
4. Fetched the three specific upstream sources that supply the missing security detail: `STEALTH_BENCH.md`, `docs/browser-modes.md`, and the root `README.md` (all read 2026-11-21), reusing iteration-2/6 setup and releases-API evidence for the supply-chain family rather than re-fetching it.

## Findings

### Finding 1 — Signed-in profiles: a real-browser lane can mutate the operator's real account, so consent and ownership must be explicit

Bladebro's real-browser (`rb`) mode "can act in authenticated sessions" and the README warns "Actions in a signed-in profile can affect your account"; the operator must "choose the profile and account you want the agent to use before handing it control" [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md] [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/README.md]. Ownership differs by sub-mode: `attach` connects to a caller-owned debug endpoint and leaves the browser open on detach; `clone` imports a copy that auto-refreshes newer logins/cookies/storage while the source stays open; `profile` launches the live profile, requires closing the browser first, and branded Chrome 136+ refuses remote debugging on the default data directory [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md]. Consent controls are built in: `rb pause` blocks input, navigation, downloads, collection and tabs while reads/waits/eval stay available; `rb resume` re-enables; `rb off` returns to the agent browser; `rb forget` removes an imported clone [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md].

The other two modes confirm the same rule. Aside documents `--account` for direct tasks and `exec` only — never `aside mcp` or `aside repl` — pauses tasks for MFA/CAPTCHA/vault unlock/approvals, and mandates one manual plus a single-writer lock per account/profile [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:83-89] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:109-116] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:121,134,142-144]. Chrome's signed-in surface is a fallback only: `chrome_devtools_live` (`--autoConnect`) opens the user's signed-in Chrome, closes only the page ID it opened, and isolated instances start logged out [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:84-90] [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-001.md:28]. Detection/capture output is version-pinned and must be re-captured per session with cookie/credential values redacted [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:75,130-135].

**Quotable mitigation for 004 (R-SEC-1):** "Default to the Bladebro-owned agent-browser profile; use `BLADE_HOME`/`BLADE_FRESH=1` for task isolation. Any real-browser (`rb`) lane requires an explicit operator request, and the operator must select the profile/account before control is handed over. Use `attach` whenever the browser must remain caller-owned and open; do not use `profile` on a live branded Chrome. Gate mutations behind `rb pause`/`rb resume` and keep consent-sensitive actions human-in-the-loop. Never pass `--account` to `aside mcp` or `aside repl`, and keep a single-writer lock per account/profile. Re-capture detection output each session and redact cookie/credential values." This quotes directly against 004's existing high-impact risk row [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:140].

### Finding 2 — Stealth and site terms of service: Bladebro is an anti-detection tool, so ToS/legal use is an operator gate and `blocked:` is a stop, not a hurdle

`STEALTH_BENCH.md` records 68/80 (85.0%) production-protected sites passed "without being blocked by an anti-bot, CAPTCHA, or page-load wall", across 11 anti-bot vendors, from a single residential IP with zero proxy rotation, zero CAPTCHA solver and zero fingerprint farm, one persistent profile, and zero benchmark-specific flags; the named gap is Akamai (3/6) [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/STEALTH_BENCH.md]. The disclosed method is a visit-and-browse visitor simulation with the acting model as judge (OpenCode + NVIDIA Nemotron 3.5 Lightning substituting for the closed `bu-2-0`/screenshot judge), so the figure measures anti-bot evasion, not task completion [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/STEALTH_BENCH.md]. The README lists as an explicit limit: "Interactive challenges can stop a task with a `blocked:` verdict" [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/README.md]. Stealth is Bladebro-only: the Chrome DevTools and Aside packets document no stealth or anti-detection feature, and iteration 1's matrix records Bladebro as the single stealth surface [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-001.md:29] [INFERENCE: cross-product of the three capability rows].

The security consequence is that a category that exists to avoid anti-bot detection can be pointed at sites where evasion breaches their terms of service or applicable law; no upstream security document delegates that judgment to the agent.

**Quotable mitigation for 004 (R-SEC-2):** "Treat stealth as operator-authorized only. Before enabling a real-browser lane on a target site, the operator must confirm the site's terms of service and access rules; do not use Bladebro to evade CAPTCHAs, anti-bot walls, or access controls where doing so breaches those terms or applicable law. A `blocked:` verdict is terminal — report it and stop; do not re-issue the action, swap fingerprints, or otherwise route around the challenge. Keep stealth usage and the pinned v4.8.2 benchmark claim in the packet changelog, and prefer the agent-browser lane where stealth is not required." No upstream doc supplies a ToS policy, so this is an operator-owned consent gate derived from the benchmark and the `blocked:` limit (edge case recorded below).

### Finding 3 — npm binary supply chain: a global install pulls optional native binaries, so trust rests on the registry plus published digests

`npm install -g bladebro` selects the native package through optional dependencies (`bladebro-darwin-arm64` / `bladebro-darwin-x64`), has no postinstall script, and publishes standalone binaries with `.sha256` sidecars on GitHub Releases [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/setup.md]. The v4.8.2 macOS digests are arm64 `sha256:7324e502b1710f8fb0a073b1f71d3647266d986a50e7351cb4257ec4eb5d8fa8` and x64 `sha256:d839f5f8a8bed8f616e68029350b1c36f8bc12ee2a16deb32b6f7df93a5a36c3` [SOURCE: https://api.github.com/repos/dondai44423/bladebro/releases/latest]. The README confirms the npm distribution, Apache-2.0 license, a published `SECURITY.md`, and that the five tools ship in one Rust binary [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/README.md]. Risk surface: a global install implicitly trusts the registry plus an optional native artifact, and upstream ships fast (≈40 releases in four months), so an unpinned install can silently change behavior; that drift is already a 004 dependency risk [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:139].

**Quotable mitigation for 004 (R-SEC-3):** "Installation remains an operator stop-for-yes owned by 006 — never install implicitly. Pin the exact version the packet was authored against (v4.8.2) and record its read date in the packet changelog. Leave optional dependencies enabled but verify the resolved native package's SHA-256 against the published release sidecars (`shasum -a 256 -c`) before use; for higher assurance prefer the standalone prebuilt binary plus digest over npm. Re-verify CLI flags against the installed binary before relying on captured output. Roll back with `npm uninstall -g bladebro`, and remove the doctor-reported data root only after confirming no needed named sessions remain." [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-006.md:24-26,35].

### Finding 4 — The three findings map one-to-one onto 004 REQ-002, so KQ7 is quotable as written

004 REQ-002 requires "each KQ7 risk in `research.md` maps to one rule in the packet", and 004's scope names exactly the three families found here [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:113] [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:84]. The mapping is complete and disjoint:

| 004 safety rule | KQ7 risk family | Source finding | Quotable mitigation |
|---|---|---|---|
| R-SEC-1 | Signed-in profiles | Finding 1 | owned-profile default, explicit lane request, operator profile/account selection, `attach` for caller-owned, `pause`/`resume`, no `--account` on mcp/repl, single-writer lock, redaction |
| R-SEC-2 | Stealth & site terms of service | Finding 2 | operator ToS gate, no anti-bot/ToS evasion, `blocked:` terminal, logged pinned usage, agent-browser default |
| R-SEC-3 | npm binary supply chain | Finding 3 | operator install yes, pin v4.8.2 + read date, verify SHA-256 sidecars, prefer standalone binary, re-verify flags, staged rollback |

This closes the KQ7 "answered means" bar: every required family has a finding and a mitigation that 004 can quote verbatim [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:74].

## Questions Answered

- **KQ7 — answered.** Three cited risk findings (signed-in profiles, stealth + site ToS, npm supply chain), each with a quotable mitigation, plus a one-to-one REQ-002 mapping. Synthesized into `research.md` KQ7 and the 004 per-phase handoff.

## Questions Remaining

- KQ1 — capability matrix drafted but not registry-resolved; its Lighthouse contradiction remains open.
- KQ8 — whether Bladebro takes over Aside's deterministic signed-in work (the last open decision).

## Ruled Out

- Broad web search for Bladebro facts: BLOCKED since iteration 1; specific known URLs were fetched instead.
- Live `bladebro` probes or installing the binary: BLOCKED since iteration 1; install is a 006 operator stop-for-yes and a charter non-goal [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:98-100].

## Dead Ends

None. The stealth evidence came from a single named doc linked from the already-captured README (`STEALTH_BENCH.md`), so no search was needed.

## Edge Cases

- **Ambiguous input**: "site terms of service" has no upstream security doc. Selected the narrowest evidence-backed reading — an operator-owned legal/consent gate evidenced by the anti-bot benchmark and the `blocked:` verdict — and deferred any jurisdiction-specific legal analysis.
- **Contradictory evidence**: none new. Asset naming differs between the setup table (`*-darwin-*`) and release assets (`*-macos-*`) but digests match; iteration 1's Lighthouse contradiction remains KQ1-owned.
- **Missing dependencies**: no `bladebro` binary on PATH (non-goal), so expected claims are pinned v4.8.2 upstream evidence, not observed results — mitigated by the doctor/version verification steps in iteration 6.
- **Partial success**: none — all three targeted upstream docs and all local evidence were obtained.

## Sources Consulted

- https://raw.githubusercontent.com/dondai44423/bladebro/main/STEALTH_BENCH.md (fetched 2026-11-21)
- https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md (fetched 2026-11-21)
- https://raw.githubusercontent.com/dondai44423/bladebro/main/README.md (fetched 2026-11-21)
- https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/setup.md (iteration 2/6, reused for npm supply chain)
- https://api.github.com/repos/dondai44423/bladebro/releases/latest (v4.8.2, iteration 1/6, reused)
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:68,74,98-100
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:46,84,113,139-140
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-001.md:28-29
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-006.md:24-26,35,51-53
- .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:84-90
- .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:21-37,75,83-89,109-116,121,130-135,134,142-144

## Assessment

- New information ratio: 0.73 — one finding fully new (stealth benchmark detail + site-ToS angle); three partially new (signed-in profile and npm supply-chain facts are reframed as quotable rules from iterations 1/2/6 evidence, and the REQ-002 mapping is synthesis derived from those findings plus the 004 spec). (1.0 + 0.5×3) / 4 = 0.625, plus a +0.10 synthesis bonus for resolving KQ7 into a cleaner one-rule-per-risk model = 0.725, rounded 0.73.
- Questions addressed: KQ7. Questions answered: KQ7.
- Questions remaining: KQ1 (matrix drafted, not registry-resolved), KQ8 (Aside overlap decision).

## Reflection

- **Worked**: leading with 004's REQ-002 ("each KQ7 risk maps to one rule") turned a broad security topic into a deliverable with a fixed shape, so the findings were written as already-quotable rules rather than raw risk notes. Reusing the iteration-2/6 supply-chain and consent evidence avoided re-fetching docs, while the single new fetch (`STEALTH_BENCH.md`) supplied the genuinely missing ToS/evasion evidence.
- **Did not work**: nothing failed. The only limitation is that no upstream doc supplies a site-ToS policy, so R-SEC-2 is an operator consent gate inferred from anti-bot evasion evidence and the `blocked:` verdict — recorded as an ambiguity rather than overclaimed.
- **What I would do differently**: nothing for KQ7. For KQ8, decide yes/no from the capability asymmetry (Bladebro agentic `run` plans vs Aside deterministic `repl`) plus the R-SEC-1 consent/stealth constraint, and check 004's "Changing Aside's scope" out-of-scope line [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:90].

## Recommended Next Focus

KQ8: decide yes or no on Bladebro taking over Aside's deterministic signed-in work, with the deciding cases — compare Bladebro's agentic `run` plans and `rb` consent/stealth constraints (R-SEC-1/R-SEC-2) against Aside's deterministic `repl`, single-writer-per-account rule and MFA/approval gates; then state the 004 scope consequence (its "Changing Aside's scope" out-of-scope line) for whichever answer wins. Use the already-captured KQ1/KQ2/KQ7 evidence rather than re-fetching upstream docs.
