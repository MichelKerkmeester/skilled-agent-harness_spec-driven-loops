# Iteration 3: Cross-Domain No-Destination Semantics

## Focus

This iteration compared how OS schedulers, IP routing, DNS resolution, load balancers, and human no-wrong-door services handle a request with no clear destination. The transfer test was deliberately narrow: a mechanism counts only if it changes the skill router's control contract for abstention, fallback, or failure visibility. Domain-specific implementation details such as CPU power states, packet formats, DNS record syntax, and target-health algorithms were treated as decorative analogy and excluded.

## Findings

1. “No destination” is not one state. Linux has valid work absence (only the special idle task remains); IP has no matching reachable route; DNS distinguishes useful negative answers such as NXDOMAIN/NODATA from resolution failure; a load balancer may have registered but unhealthy destinations; and a no-wrong-door service may receive a valid request outside its competence. These differ along four axes—whether work exists, whether a destination exists, whether it is healthy/eligible, and whether the negative answer is authoritative. The transferable mechanism is a typed control result such as `idle`, `no-match`, `dependency-failure`, `degraded-fallback`, or `handoff-required`, never an undifferentiated null that a caller silently converts to a child mode. [SOURCE: https://www.kernel.org/doc/html/latest/driver-api/pm/cpuidle.html] [SOURCE: https://www.rfc-editor.org/rfc/rfc4191.html] [SOURCE: https://www.rfc-editor.org/rfc/rfc9520.html] [SOURCE: https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-troubleshooting.html] [SOURCE: https://www.modernslavery.gov.au/practice-guidelines-organisations/section-42-practice-areas/practice-area-2-referral] [INFERENCE: the cross-domain state distinctions map to router control outcomes, while their domain-specific execution mechanics do not]

2. A default is a bounded route, not proof that a destination was classified. RFC 4191 first uses longest-prefix matching and reachability, consults a less-preferred route when necessary, and reports “No Route To Destination” when neither a specific nor default route remains. AWS Network Load Balancer's opposite-looking fail-open behavior is explicitly conditional: only when all registered targets are unhealthy does it route to unhealthy targets. The transferable rule is therefore policy-first: a skill fallback may select a generic handler only when that handler's contract explicitly accepts the request class and the degraded-risk policy permits it; otherwise the router must expose abstention. Fail-open is unsuitable for mutation-capable requests because availability does not compensate for execution by the wrong authority. [SOURCE: https://www.rfc-editor.org/rfc/rfc4191.html] [SOURCE: https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-troubleshooting.html] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:108] [INFERENCE: IP fail-closed and load-balancer fail-open are policy choices for different failure costs, not competing universal defaults]

3. Negative results can be reusable without becoming positive routes. RFC 9520 preserves the distinction between NXDOMAIN/NODATA and resolver failure and requires bounded caching of resolution failures; RFC 4191 invalidates affected destination-cache entries when routing information changes. A skill router can transfer this as a negative decision cache keyed by the normalized request signature, policy hashes, reason code, and expiry, invalidated when the registry or policy changes. That can suppress repeated scoring or repeated clarification within a stable context while keeping the negative result visible; it must not turn a cached abstention into a default child. [SOURCE: https://www.rfc-editor.org/rfc/rfc9520.html] [SOURCE: https://www.rfc-editor.org/rfc/rfc4191.html] [INFERENCE: policy-versioned negative caching preserves both failure visibility and bounded reuse]

4. The scheduler's idle task is a neutral control-plane sink, not a user-work handler. Linux documents the special idle task as what remains when there are no tasks to run, so the scheduler preserves the invariant that unmatched work is not fabricated merely to keep a normal class busy. For skill routing, the transferable part is an explicit router-owned `needs_disambiguation`/`defer` outcome that can load a routing helper; the non-transferable part is doing nothing, because a conversational system still owes the caller a visible next action. This supports the existing defer-routed hub shape more strongly than a named default child. [SOURCE: https://www.kernel.org/doc/html/latest/driver-api/pm/cpuidle.html] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:231] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/scaffold/hub_skill_scaffold.md:71] [INFERENCE: a neutral sentinel preserves classification truth while the routing helper supplies the user-facing recovery]

5. No-wrong-door intake separates conversational ownership from execution authority. Australian government referral guidance says an initial contact should be directed to appropriate support even when the receiving organisation is not set up to provide it, while also requiring the organisation not to act beyond its resources or expertise, to communicate options, and to obtain informed consent before sharing referral information. Its examples retain immediate or outreach support during assessment and transition. The transferable mechanism is a typed handoff in which the current mode keeps the request envelope until the destination explicitly accepts or rejects it, with scoped context transfer and a visible reason; the receiving mode's packet contract still determines what it may execute. [SOURCE: https://www.modernslavery.gov.au/practice-guidelines-organisations/section-42-practice-areas/practice-area-2-referral] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:60] [INFERENCE: maintaining intake continuity through acceptance prevents a wrong-door bounce without granting the intake mode the destination's authority]

## Ruled Out

- Treating every no-destination state as the same null/default outcome: the authoritative sources distinguish absence of work, absence of a route, useful negative answers, dependency failure, unhealthy destinations, and wrong initial contact.
- Using a default mode as an unlabelled substitute for absent evidence: IP defaults remain real bounded routes, and the absence of both specific and default routes stays visible.
- Transferring load-balancer fail-open behavior to mutation-capable skill requests: routing to a known-unhealthy target trades correctness for availability, a trade that is not safe when a wrong mode can mutate state.

## Dead Ends

- A universal “always fail closed” or “always fail open” law is a dead end. The sources instead make the choice conditional on outcome type, destination capability, and the cost of retry versus wrong execution.
- Copying domain mechanisms literally—CPU idle loops, routing-table prefixes, DNS TTL syntax, or health-check algorithms—adds machinery without improving the skill-routing contract.

## Edge Cases

- Ambiguous input: “human receptionist” was interpreted as an authoritative no-wrong-door intake and referral protocol, not conversational style or staffing behavior.
- Contradictory evidence: none. IP discard and load-balancer fail-open appear opposed, but they answer different explicit failure-cost policies and therefore support typed policy rather than one universal fallback.
- Missing dependencies: no observed skill-routing traffic corpus was available, so the transfer is contract-level and makes no empirical frequency, latency, or success-rate claim.
- Partial success: none. The mechanism question is answered; the concrete typed handoff protocol is intentionally deferred to the next iteration.

## Sources Consulted

- https://www.kernel.org/doc/html/latest/driver-api/pm/cpuidle.html
- https://www.rfc-editor.org/rfc/rfc4191.html
- https://www.rfc-editor.org/rfc/rfc9520.html
- https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-troubleshooting.html
- https://www.modernslavery.gov.au/practice-guidelines-organisations/section-42-practice-areas/practice-area-2-referral
- `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:108`
- `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:231`
- `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:60`
- `.opencode/skills/sk-doc/create-skill/assets/parent_skill/scaffold/hub_skill_scaffold.md:71`

## Assessment

- New information ratio: 1.00 (5 fully new findings / 5 total findings)
- Questions addressed: Which no-destination semantics from other routing systems transfer, and what do they imply for abstention, defaults, and failure visibility?
- Questions answered: Which no-destination semantics from other routing systems transfer, and what do they imply for abstention, defaults, and failure visibility?

The answer is a typed negative-control contract: abstain with a reason when no safe route exists, allow defaults only as explicit capability-bounded routes, cache negative decisions only with policy identity and expiry, expose degraded fail-open behavior, and retain intake ownership until a bounded handoff is accepted.

## Reflection

- What worked and why: comparing each system by state and failure-cost semantics, rather than surface vocabulary, separated transferable control mechanisms from decorative analogy.
- What did not work and why: the warm-handoff health-service page failed to open through the browser, so the iteration used accessible Australian government referral guidance and did not depend on the failed page.
- What I would do differently: define the candidate handoff state machine before source collection so each cross-domain mechanism can be tested directly against its acceptance, rejection, timeout, and rollback transitions.

## Recommended Next Focus

No-wrong-door and handoff routing, where any mode may accept a request and transfer it through a bounded typed protocol.
