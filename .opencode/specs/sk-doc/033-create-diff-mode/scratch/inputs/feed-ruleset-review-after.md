# Feed ruleset review findings (v2)

* * *

| Review property | Value |
| --- | --- |
| Mode | Documentation alignment review |
| Template type | Doc |
| Energy level | Deep |
| Perspectives | User, Business, Technical, Risk and Delivery |
| Review date | 18 July 2026 |
| Quality | Completeness 9, Clarity 9, Actionability 9, Accuracy 9, Relevance 9, Mechanism depth 9 |


* * *

## Verdict

> **Revision note:** this verdict was re-checked against the v2 ruleset;
> two previously-open items are now closed and one new gap was found.


* * *

The seven Feed documents do not yet form one approval-ready Product contract.


Implementation should wait until every blocking decision in this review has an approved outcome. Fixing the wording defects alone will not produce testable rules.

## Scope reviewed

* * *

- [Dead Deals](./Feed%25-%20Dead%20Deals.md)
- [Feed Functions](./Feed%25-%20Feed%20Functions.md)
- [How it Works](./Feed%20-%20How%20it%20Works.md)
- [Metrics & Analytics](./Feed%20-%20Metrics%20%26%20Analytics.md)
- [Patterns](./Feed%20-%20Patterns.md)
- [Ruleset Review Findings](./Feed%20-%20Ruleset%20Review%20Findings.md)
- [Weighted Ranking & Intelligent Discovery](./Feed%20-%20Weighted%20Ranking%20%26%20Intelligent%20Discovery.md)

The previous backlog review is no longer the current source for this audit. Its parent story is archived and the earlier child files are no longer active in the Product Owner export folder. New backlog work should be created only after the decisions in this document are settled.

## Revalidation result

* * *

The fresh cross-document pass confirms that every previously recorded blocker remains open. The seven copied ruleset rows still match Feed Functions and all eight ranking weight sets still total 100%.

This pass corrects several earlier overstatements and adds missing findings about lifecycle timing, ranking intent, partner repetition, overlapping application windows and geo behavior.

## Required authority model

* * *

No document currently declares a complete authority order. Use this ownership split and add it to every document header.

| Document | Subject it should own | Current issue |
| --- | --- | --- |
| Feed Functions | Approved collection rulesets, ranking signals, weights and pool behavior | It still says the behavior is not final and calls the rules proposed |
| Dead Deals | Partner lifecycle, subscription precedence, deal visibility and lead-position eligibility | One state has two meanings and different visibility outcomes |
| Patterns | Feed and Collection composition, rotation, expansion and end states | Fill, empty-state, repetition and fallback order remain incomplete |
| Metrics & Analytics | Counting, attribution, reporting definitions and validation measures | It cannot yet measure ruleset, ranking or rotation decisions |
| How it Works | Proposed current implementation baseline after Backend verification | It uses present tense but has no verification date or evidence that it matches production |
| Weighted Ranking & Intelligent Discovery | Future options and longer-term direction | Its hard-versus-soft philosophy conflicts with approved collection rules |
| Ruleset Review Findings | Open issues, decisions and readiness | It must never become a competing requirements source |

### Recommended remediation

* * *

- Put an authority, status, owner and last-verified date in each document
- Label current behavior, approved target behavior and future options separately
- Replace external requirement links with local source links where a local source exists
- Keep one canonical registry for names and identifiers

## What is aligned

* * *

The audit confirmed these points:

- The seven collection identifiers match across Feed Functions, How it Works and Patterns
- The ruleset summary in Feed Functions matches its detailed collection sections apart from the remaining Trending typo
- Every weight set in Feed Functions totals 100%
- Feed Functions and Weighted Ranking both prepare online and local pools separately, alternate them one for one and continue with the remaining pool after exhaustion
- How it Works, Feed Functions and Weighted Ranking all state that local or physical results are nearest-first
- Feed Functions and Weighted Ranking agree that direct single-deal retrieval is not a ranked list
- Dead-partner filtering is explicitly placed before scoring and inactive subscriptions hide deals, although their exact pipeline stage is not stated
- Metrics defines a qualified impression that can support an exposure-based Hidden Gems decision

These points reduce the decision load. They do not resolve the contracts below.

## Current target rules as written

* * *

This table reproduces the current Feed Functions targets. It does not resolve the contradictions recorded later in this review.

| Collection | Primary | Relaxed | Final fallback |
| --- | --- | --- | --- |
| New Deals | Deal age up to 7 days | Up to 14 days, then up to 21 days | None |
| Trending | At least 10 applications in 14 days | At least 10 applications in 30 days | Completed plus upcoming application count, descending |
| New Brands | Partner age up to 60 days | Partner age up to 120 days | Partner ID, descending |
| Hidden Gems | Fewer than 5 applications in 14 days | Fewer than 10 applications in 14 days | Pending plus completed plus upcoming 14-day count, ascending |
| For You | Hard interest and minimum-follower rules combined with AND | None | None |
| Fit Check | Deal minimum followers no higher than creator followers | None | None |
| Your Vibe | At least one matching interest | None | None |

## Blocking findings

* * *

### 1. Feed Functions is treated as approved while it labels itself non-final

* * *

Feed Functions opens with a non-final warning. It also calls the weight sets and rulesets proposed. This report and prior Product work treat the same document as the approved Product source.

Weighted Ranking is correctly marked as future-facing, but its content is still easy to mistake for approved behavior because the documents do not state their authority relationship.

**Recommended action**

- Remove non-final and proposal language from approved parts of Feed Functions
- Mark any unsettled section or value individually
- Add an explicit current, approved target or future label to every Feed document
- Do not call Feed Functions definitive until its own status text agrees

### 2. The system has no single execution contract

* * *

Feed Functions starts with collection rulesets, then weighted scoring and mixed-pool assembly. Dead Deals adds lifecycle exclusion before scoring and a lead-position constraint after a deal remains eligible. Weighted Ranking omits the collection-ruleset and mixed-pool stages from its future pipeline. Patterns adds rotation and expansion after result generation.

The result is a set of compatible ideas without one declared order.

**Recommended action**

Define one Product sequence that covers:

1. Shared visibility and eligibility
2. Collection-specific Primary and Relaxed rules
3. Ranking within the online and local pools
4. Online-local assembly, duplicate prevention and lifecycle lead-position enforcement
5. Module fill, expansion and end-state behavior

Lead eligibility must be known before assembly and enforced against the final user-visible order. State which requirement wins if nearest-first alternation and the first-ten rule compete for the same position. Also state which future diversity behavior may change order and which promises it may never override.

### 3. Final fallback can be read as removing all eligibility

* * *

Feed Functions says Final fallback drops the rule or uses no filter. The intended meaning appears to be removal of the collection-specific rule only. It does not state this.

The following conditions must survive every ruleset tier and fallback:

- Dead and inactive-subscription deals remain excluded
- Hidden and already-applied deals remain excluded where the surface requires it
- Country, international-collaboration, content-type and local-distance eligibility remain active
- Dormant and reactivation-pending deals retain their approved lead-position restriction
- Tab and pool eligibility remain active

**Recommended action**

Define Final fallback as removal of only the named collection rule. Publish the shared eligibility list once and require every collection to reference it.

### 4. Tier activation and fill are undefined

* * *

Feed Functions uses phrases such as "comes up short" and "fill the collection" without a number or surface rule. Patterns sets `MIN_FILL` to 12 for dynamic carousel selection, but does not say which ruleset tier supplies those 12 deals.

Primary-only inventory, Primary plus Relaxed inventory and Final-fallback inventory can produce different rotation choices. Fixed carousels have no stated floor at all.

**Recommended action**

Define for each surface and tab:

- Initial fill target and pagination target
- Whether Relaxed supplements Primary or replaces and reranks it
- Whether online and local pools relax independently
- Which tier counts toward dynamic `MIN_FILL`
- Behavior for a short result and a zero result
- Whether a fixed module hides, collapses, shows an empty state or uses an approved replacement

Remove the claim that a three-tier function can never be empty. Shared eligible inventory can still be empty.

### 5. Automatic Final fallback conflicts with opt-in expansion

* * *

Patterns says a collection should stop at the boundary of matching deals, then ask the creator before loading deals beyond that collection. Feed Functions can automatically drop the collection rule through Final fallback.

If Final-fallback results load automatically, the creator may see non-matching deals before the expansion prompt. If they count as matching results, expansion may never appear.

**Recommended action**

Choose one contract:

- Final fallback remains automatic and the UI identifies the broader result tier
- Dropping the collection rule requires the creator's expansion opt-in

For either choice, define the trigger, ordering, eligibility, label, analytics event and end state. Keep ruleset fallback, user expansion, dynamic rotation fallback and mixed-pool exhaustion as separate concepts.

### 6. Application and collaboration language is not coherent

* * *

Trending and Hidden Gems use generic application counts. Their fallback expressions use different status combinations. How it Works describes Trending as accepted creator activity. Metrics defines pending, accepted and rejected applications plus active, finished and completed collaborations. Weighted Ranking proposes an acceptance formula based on completed, planned and upcoming records.

These terms cannot be treated as interchangeable.

**Recommended action**

Create one canonical state dictionary that defines:

- Application, applicant, decision and collaboration
- Pending, accepted, rejected, cancelled and withdrawn applications
- Planned, upcoming, active, finished, completed and cancelled collaborations
- The event and timestamp that place a record in each count
- Whether one creator can contribute more than one count to a deal in the same window

Every threshold, sort and metric must cite this dictionary.

### 7. Acceptance rate has two conflicting definitions

* * *

Metrics defines acceptance rate as accepted decisions divided by accepted plus rejected decisions. Weighted Ranking proposes completed plus planned plus upcoming divided by applicants. Feed Functions references pre-computed acceptance rates without selecting either definition or stating the smoothing and cold-start behavior.

The second formula measures collaboration progression, not the same decision rate used by Metrics.

**Recommended action**

- Keep the reporting acceptance rate or approve a replacement
- Give any collaboration-outcome ratio a different name
- Define the ranking signal's exact numerator, denominator, time window, low-volume behavior and missing value
- Require Feed Functions to reference the approved signal contract

### 8. Percentage weights do not guarantee the stated priorities

* * *

Feed Functions combines signals that usually range from 0 to 1 with raw, unbounded Interest Match and Application Velocity values. A 21% raw signal can outweigh several bounded signals and stop behaving like a 21% priority.

The weight totals are correct. The signal scales are not yet comparable.

Three signals also lack a clear Product meaning:

- Follower Fit is weighted only after For You and Fit Check already remove below-minimum deals. It therefore rewards clearing the minimum by a larger margin instead of eligibility
- Gender Match is bonus-only, but unknown, unset and nonbinary profile or deal values have no approved outcome
- Exploration gives New Brands a 20% boost through a deal tag without an owner, expiry rule or default state

**Recommended action**

- Give every weighted signal an approved comparable range or cap
- Define clamping, missing values and whether remaining weights adjust when a signal is absent
- Add stable tie-breaking and null behavior for every ordering rule
- Validate that observed signal contribution matches the stated ranking intent
- Define the intended direction and range of Follower Fit after the hard filter
- Define Gender Match taxonomy and missing-value behavior
- Define who may assign the Exploration tag, when it expires and how untagged deals score

### 9. Hard rules and soft ranking still conflict across documents

* * *

Feed Functions separates hard collection rules from soft ranking. Weighted Ranking says scoring replaces exclusion and that a deal missing a filter may still surface. The same future document later acknowledges some hard candidate exclusions.

For You, Fit Check and Your Vibe rely on hard collection predicates and have no fallback. The future philosophy cannot silently soften them.

**Recommended action**

Use three terms everywhere:

- Shared eligibility exclusion
- Collection-promise rule
- Soft ranking preference

Update the future pipeline to preserve approved hard rules unless Product explicitly changes a collection promise.

### 10. The lifecycle state model is internally inconsistent

* * *

Dead Deals defines `REACTIVATION_PENDING` as an application-triggered state where the partner has been emailed, a seven-day deadline applies and deals remain visible. The detailed flow changes the state when the application arrives, then starts the deadline only when the email sends. A delayed or failed send has no stated outcome.

The document later uses the same state after a dead partner logs in, with no stated email or deadline and with deals still hidden. It acknowledges that pre-death and post-death behavior differ, but recovery context is not part of the state contract.

This conflicts with the statement that partner state alone determines deal visibility.

Recovery signals also differ. The pre-death flow uses application review or creator chat to return the partner to `ACTIVE`, while normal ranking also waits for availability confirmation. The post-death section uses application review or availability confirmation after claiming the recovery signals are the same.

The flow says later applications during the window appear in the day-three reminder. Applications received after that reminder cannot appear in it. No later messaging outcome is defined.

Dead Deals also says lifecycle behavior maps to three discrete deal flags, while its table shows only visibility and lead eligibility.

Inactive Subscription appears in the feed-behavior state table even though it is absent from the canonical activity states and later becomes a separate precedence rule.

**Recommended action**

- Use distinct lifecycle labels for pre-death reactivation and post-death recovery or define an explicit recovery context that changes visibility
- Publish one transition table with entry trigger, deadline, visibility, lead eligibility, email behavior and exit condition
- Approve one list of meaningful, qualifying and soft activity signals
- Define subscription interruption and resumption for every lifecycle state
- Name the third deal flag or correct the stated flag count
- Define the state and deadline outcome when email delivery is delayed or fails
- Treat subscription status as a separate dimension or add it to the canonical state model
- Define the reminder inclusion cutoff and messaging for applications received after the reminder

### 11. The lifecycle lead rule has no place in the final result contract

* * *

Dormant and pre-death reactivation-pending deals remain eligible but cannot occupy `FIRST_10_DEALS`. A pre-score exclusion cannot express that outcome. Feed Functions does not include a lead-position stage.

The first-ten boundary is inconsistent and incomplete. `CAN_LEAD` refers to a feed or collection, while `FIRST_10_DEALS` refers to a feed or carousel. Neither definition covers tabs, pagination, response boundaries or mixed results.

**Recommended action**

- Define where the first ten positions are measured
- Apply the lead rule to the final user-visible order instead of limiting it to the candidate pool
- State whether non-leading inventory counts toward fill targets
- Define behavior when fewer than ten lead-eligible deals exist

### 12. How it Works describes a different model for every collection

* * *

How it Works presents a direct-filter and direct-sort model in present tense. Feed Functions presents target rulesets and weighted ranking. The drift affects every collection, including Trending, but no evidence proves that How it Works matches current production.

Examples include New Deals sorted directly by creation time, New Brands always sorted by partner ID, Hidden Gems always sorted by an application sum and personalized collections ordered randomly or by creation time.

How it Works also says `all_deals_feed_url` is used only to fill the Feed. Feed Functions calls it the primary creator discovery surface.

Its pipeline also omits dead-partner filtering, inactive-subscription hiding and lead-position behavior. `picked_for_you_feed_url` is described as the same as For You without follower filtering, which could inherit New-feed creation sorting, then it declares random ordering without an exception.

**Recommended action**

Verify How it Works against Backend behavior before assigning it current-state authority. Then add a current-versus-approved-target table for every function with a last-verified date. Do not rewrite legacy field names as Product intent.

### 13. Personalization predicates and missing data are undefined

* * *

The hard interest rule can mean exact profile-interest overlap, content-type overlap or future semantic relevance. Follower count can mean the highest connected account, one selected account or another aggregate. How it Works currently uses the highest connected social account, but Feed Functions only says `creator_followers`.

No outcome exists for missing interests, no connected account, stale follower data or a deal without a minimum follower value.

**Recommended action**

- Define the exact Boolean interest predicate separately from the soft Interest Match score
- Confirm the follower source and freshness requirement
- Define outcomes for absent, hidden, disconnected and stale values
- Define whether a collection hides, returns no results or presents a profile-completion state
- Keep future semantic matching outside the hard predicate until approved

### 14. Time-window boundaries are missing

* * *

The documents use 7, 14, 21, 30, 60 and 120-day windows without a computation contract. Expressions such as `created_at ≤ 7d` compare a timestamp label with a duration and can be read in the wrong direction.

Dead Deals defines the reactivation window as seven days from email send, with one fixed deadline that cannot restart. It still lacks timezone and cutoff inclusivity. The 21-day dormancy rule also lacks its activity timestamp and boundary rule.

**Recommended action**

For every window, define:

- Rolling duration or calendar-day behavior
- Timezone
- Inclusive or exclusive cutoff
- Source timestamp
- Event time used after a status change

Use deal-age or explicit cutoff language in Product rules.

## Collection and ranking findings

* * *

### 15. New Deals widens beyond its scoring window

* * *

New Deals can admit deals aged 8 to 21 days, while its leading Freshness signal reaches zero after day 7. Those relaxed deals rank mainly through interest, randomness and proximity.

Feed Functions also calls this "two widening tiers" while it evaluates 7, 14 and 21-day cutoffs.

**Recommended action**

- Approve zero Freshness for relaxed inventory or align the scoring window with the active ruleset tier
- Name the stages Primary, Relaxed 1 and Relaxed 2
- Define a fill check after each stage

### 16. Trending has field, status and window drift

* * *

Feed Functions uses `completed_applications_count` in its overview and Final fallback definition, then uses the legacy `complated_applications_count` spelling in the detailed explanation. How it Works records the legacy spelling in its present-tense behavior, but Backend has not verified that mapping in these documents.

Trending qualifies on 14 or 30-day application activity, ranks partly on 14-day acceptance and 7-day velocity, then falls back to what appears to be an all-time completed plus upcoming count. A deal admitted through days 15 to 30 may have little or no value in its leading ranking windows.

The collection description says the threshold keeps zero-traction deals out, but the rule also excludes deals with one through nine applications while the filter holds.

**Recommended action**

- Correct the remaining typo in Feed Functions
- Keep the legacy name only in a Backend-verified current-state mapping
- Define which statuses and timestamps count toward 14-day and 30-day traction
- Approve the cross-window ranking behavior or align ranking with the active tier

### 17. New Brands breaks its own 60-day promise

* * *

New Brands says partners past 60 days should not pose as new. Relaxed permits ages 61 to 120 days. Final fallback removes the age restriction. Partner Freshness carries 42% of the score and reaches zero at day 60.

The fallback uses partner ID as a recency proxy while the ruleset uses partner creation time.

The collection promises partner discovery but ranks deal rows. Nothing limits one new partner with many deals from occupying much of the visible collection.

**Recommended action**

- Decide whether 61 to 120-day partners remain acceptable under low inventory
- Decide whether partners of any age may appear automatically
- Define how 61 to 120-day partners rank
- Use an approved recency value and document any legacy ID mapping
- Decide whether the collection promises unique partners or deals from new partners
- Define the allowed repetition of one partner within a carousel, page and Feed surface

### 18. Hidden Gems means low demand in one document and low exposure in another

* * *

Feed Functions uses low application activity. Weighted Ranking describes low exposure and low impressions. Patterns assigns Hidden Gems to Performance, while Feed Functions calls it a discovery and fairness collection.

Low applications can mean weak demand, poor offer quality or limited exposure. Metrics now defines qualified impressions and CTR, so exposure and response can be measured separately.

Feed Functions also describes the same rule as preventing a formerly popular deal from staying buried and preventing an unpopular deal from staying buried. Neither description states the real 14-day low-application condition.

Low Application Activity carries 43% of the ranking across total, 7-day, 14-day and 30-day counts. A recent application contributes to every overlapping window, while a lifetime count can continue suppressing a deal that now has low activity. The ruleset itself uses only the 14-day count.

**Recommended action**

Choose one Product meaning:

- Low application demand
- Low exposure
- Low exposure with an approved quality or response condition

Then align the collection description, goal category, rule, ranking signals and success measures. If low applications remain the proxy, say so directly.

Approve whether the overlapping windows should amplify recent applications. If not, define one non-overlapping or approved decay contract and state how lifetime history affects current Hidden Gems eligibility.

### 19. Local ordering is aligned in intent but incomplete as a contract

* * *

All three relevant documents favor nearest-first local results. Feed Functions also defines collection fallback sorts and says mixed assembly never reranks. It does not state whether the fallback sort applies to local deals, online deals or both.

The documents also do not list which collections use both pools on each tab.

**Recommended action**

- Promote nearest-first local ordering into the approved Feed Functions contract
- Define the role of collection score and Final-fallback sort within the local pool
- Publish a collection-by-tab pool matrix
- Define tie behavior when distance or fallback values match

### 20. Geo radius and missing-location behavior are not aligned

* * *

How it Works lists a 150 km default region that was initially 50 km, a 250 km extended region chosen to reduce database load and a front-end-selected radius of 150 or 250 km. It does not identify one approved Product default or which surfaces may change it.

Feed Functions uses a 250 km scoring decay across several collections. Weighted Ranking proposes default-location or secondary ordering when coordinates are unavailable and says the creator should understand when current-location ordering is unavailable. Feed Functions does not approve that fallback or define stale-coordinate behavior.

**Recommended action**

- Separate the local eligibility radius from the Geo Proximity scoring scale
- Approve the default, extended and user-selectable radius per surface and tab
- Define whether missing or stale coordinates use default location, hide local inventory or show a location state
- Define how the Geo Proximity weight behaves when current coordinates are unavailable
- Record the location source and freshness in validation metrics

### 21. Plain production sort conflicts with two fallbacks

* * *

Feed Functions defines a plain production sort as one database field. Trending and Hidden Gems each sort by a sum of several fields. Under the document's own definition, neither fallback is a plain production sort.

**Recommended action**

Choose one contract:

- Allow approved computed expressions as production sorts
- Define one named aggregate value for each fallback
- Remove the one-field restriction

Whichever contract Product approves must also define null behavior and a stable tie-breaker.

### 22. Ranking-intent prose does not match effective priorities

* * *

New Deals calls Acceptance Rate and Randomness intentionally low, but Randomness is the third-largest listed weight at 15%, above Geo Proximity and Acceptance Rate. Trending also calls Randomness low while it is third-largest at 15%, above Freshness and Geo Proximity.

For You omits Gender Match from its ranking intent even though it is the third-largest listed signal at 17%. Raw signal scale can widen these differences further.

**Recommended action**

- Reconcile each ranking-intent statement with the approved normalized contribution of its signals
- Change the prose, the weights or both when a supporting signal ranks above a named priority
- Validate the final contribution order with representative inventory before approval

## Pattern and experience findings

* * *

### 23. Fixed and dynamic modules lack empty and short-result behavior

* * *

Patterns says all seven collections appear in the fixed Feed section. Hard-rule collections can have no results because of inventory or missing creator data. Only dynamic modules have a stated inventory floor.

**Recommended action**

Define module behavior for zero results, fewer than the target and loss of inventory during pagination. Include fixed carousels, dynamic carousels, collection pages and every Feed tab.

### 24. Repetition, exhaustion and refresh are undefined

* * *

The Feed and Collection patterns repeat while inventory exists, then end after every available deal has been viewed. There is no shared definition of viewed, no inventory snapshot and no duplicate rule across grids, carousels, promos and mixed pools.

Refresh promises a new order without stating whether previously viewed deals return, whether collection cooldown resets or whether only new inventory appears.

**Recommended action**

- Base viewed on the approved qualified-impression definition or choose another explicit event
- Define the inventory and session boundary used for exhaustion
- Prevent duplicate deal IDs within the approved surface boundary
- Define refresh, cooldown and seen-state reset behavior
- Define seeded randomness so pagination does not reshuffle earlier results

### 25. Dynamic rotation is not fully specified

* * *

Patterns gives `MIN_FILL` a value of 12 and `MIN_GAP` a default of two rotations, but does not define the smallest gap after relaxation. It also does not state what counts as the previous carousel when deal blocks and promos sit between collection modules.

The generic "More deals for you" fallback can be confused with the personalized For You collection. Its tab behavior, ordering, duplicate rules and empty outcome are missing.

**Recommended action**

- Define the eligible tier used by `MIN_FILL`
- Define the allowed `MIN_GAP` relaxation sequence and final no-fill outcome
- Define adjacency in terms of collection modules
- Rename the generic fallback so it cannot be confused with For You
- Define its shared eligibility, ordering, tab scope and empty behavior

### 26. Pattern layouts are hard to maintain

* * *

The fixed Feed, dynamic Feed and Collection layouts use disconnected blank numbers followed by unnumbered module descriptions. The format makes position and analytics mapping fragile.

**Recommended action**

Place each module description directly beside its position number. Give every module a stable type and placement name that Metrics can use.

## Measurement findings

* * *

### 27. Source attribution cannot support the promised funnel reporting

* * *

Metrics defines attribution for a deal-detail open. The dashboard also promises submitted applications and completed collaborations by source. It does not define how the source continues beyond the click or how long it remains valid.

Feed and Collection are treated as competing source types even though a collection carousel can sit inside the Feed. Card position is optional even though the document says position is needed to interpret impressions and CTR.

**Recommended action**

Define a hierarchical source context with:

- Surface and tab
- Module type and collection identity
- Fixed or dynamic placement
- Module position and card position
- Feed function and active rule version

Define the attribution rule and window for click, application and collaboration outcomes. Record unknown position as an explicit value instead of silently dropping it.

### 28. Ruleset, ranking and rotation behavior cannot be validated

* * *

Metrics has no measure for candidate counts, active tier, fallback reason, short fill, pool exhaustion, lifecycle suppression, selected rotation collection or generic fallback. Patterns asks for rotation relaxations to be logged, but Metrics defines no such reporting.

**Recommended action**

Require the following measures for every request or aggregate view:

- Collection, feed function, tab, pool and rule version
- Ranking version, experiment cohort and location source
- Candidate count before and after shared eligibility
- Candidate count at Primary, each Relaxed stage and Final fallback
- Fill target, selected tier, final result count and no-fill reason
- Local or online pool exhaustion and duplicate prevention
- Lifecycle exclusion and lead-position movement
- Dynamic gate failures, relaxations and selected collection
- Expansion prompt impression, acceptance and resulting inventory

Add short-fill, empty-module, Final-fallback, expansion, generic-fallback and duplicate rates to the Backoffice views.

### 29. Goal categories have no success contract

* * *

Patterns assigns Discovery, Performance and Personalization goals. Metrics supplies broad engagement and conversion measures but no primary measure or guardrail per goal.

**Recommended action**

Choose a primary outcome and a guardrail for each goal category. Keep qualified impressions and exposure distribution available for fairness collections. Keep application and collaboration outcomes available for performance collections. Keep relevance and conversion outcomes available for personalization collections.

### 30. Time and country reporting can drift from eligibility

* * *

Metrics says reports should display a timezone but does not tie it to ruleset cutoff computation. Country reports default to creator home country, while eligibility can use home country, current country, deal country and partner country.

It is also unclear whether reports use the event-time country value or a creator's current profile value.

**Recommended action**

- Use the approved ruleset timezone in validation views
- Record which country dimension each result uses
- Define whether reporting uses event-time or current values
- Keep filter eligibility and reporting dimensions distinct but traceable

### 31. Lifecycle-held applications can distort feed metrics

* * *

Dead Deals says pending applications remain pending through dormancy and death so a returning partner can act on them. Accepted creators form a separate cohort and see a closed deal. Long-held pending records can increase pending age and may affect Trending, Hidden Gems or decision-time reporting if status rules do not segment them.

**Recommended action**

Define whether lifecycle-held applications count in each ruleset and metric. Report them as a separate cohort where they would distort normal partner response measures.

## Additional clarification opportunities

* * *

### Direct deal retrieval

`deal_feed_url` returns a requested deal without defining behavior for dead, inactive-subscription, hidden or otherwise ineligible deals. Define which audiences may see a closed detail view and which requests return no discoverable deal.

### Country and international-collaboration rules

How it Works labels both online and physical eligibility as "Deal accepts international collaborations" while also describing deals that do not accept them. The grouped bullets do not make AND and OR precedence clear. Replace them with one decision table for home country, current country, accepted countries, deal country and distance.

### Cache freshness for hard inputs

How it Works defines a 15-minute context cache for location, country, radius and content type, with movement invalidation after more than 3 km. It does not state whether interests, followers, partner state, subscription or other hard inputs are cached. Define the cache scope first, then define the freshness outcome for every hard input.

### Final-fallback rationale

Feed Functions says the protected signal is zero across an unfiltered pool. That claim is not true for every collection. An expanded pool can still contain positive freshness, velocity or low-activity values. Describe Final fallback as an approved degradation policy instead of relying on a universal zero-signal claim.

### User-facing and technical status language

Dead Deals uses partner state, partner-side deal status and creator-facing labels such as draft, closed, cancelled and live without a single mapping. Post-death login leaves deals hidden and described as both draft and cancelled, while qualifying recovery changes Closed to live.

Create a lifecycle matrix by audience. Cover accepted creators, pending applicants and creators who have not applied.

### Naming registry

The documents use New, New Barter deals and New Deals. They also use Top 10 Deals and Trending, New partners and New Brands, Deals for me and For You, Picked for you and Your Vibe, plus Physical and Local.

Create one registry with display name, technical identifier, legacy name, goal category, supported pools and supported tabs. Track Feed function and Collection as separate analytics dimensions.

The future feed-priority table also omits New Brands and Fit Check. Add both collections or label the table as examples instead of a complete registry.

### Product behavior versus technology options

Weighted Ranking lists named storage, search and ranking technologies. These options do not define user or business behavior and have no approval status. Move them to a separately owned technical note or label them as non-normative hypotheses so they cannot be mistaken for Product requirements.

### Editorial defects

Correct the remaining low-risk text defects during the source update:

- Feed Functions uses singular "application" for thresholds of ten
- Feed Functions is missing an article in its opening Feed Function definition
- Weighted Ranking misspells "capabilities" in its roadmap
- Metrics links to the old Backoffice filename

### Local documentation links

Metrics links to `Feed - Backoffice.md`, but the current file is `Feed - Backoffice - Features.md`. Patterns points to external feed-function definitions even though the local Feed Functions file should hold approved Product behavior. Update these links after the authority model is approved.

## Document-specific actions

* * *

| Document | Required improvement |
| --- | --- |
| Feed Functions | Remove conflicting status text, fix Trending, define shared eligibility and tier activation, resolve fallback and expansion, approve signal contracts, resolve geo behavior and align ranking intent |
| Dead Deals | Separate pre-death and post-death recovery, align recovery signals, define state and email timing, define the first-ten boundary and map lifecycle outcomes by audience |
| How it Works | Verify it against Backend behavior, add current-versus-target rows for every function, add the naming crosswalk and replace country bullets with a decision table |
| Metrics & Analytics | Add lifecycle and application state mappings, hierarchical source attribution, ruleset and rotation measures, experiment and location context, goal-level success measures and the corrected Backoffice link |
| Patterns | Connect numbered positions to modules, define fixed and dynamic fill behavior, order every fallback, define expansion, prevent duplicates and define viewed, refresh and exhaustion |
| Weighted Ranking & Intelligent Discovery | Keep it future-facing, preserve hard rules, add the full pipeline, complete the collection table, separate reporting and ranking rates and move technology options outside Product behavior |
| Ruleset Review Findings | Track decisions and readiness only, with links back to the owning source |

## Decision register

* * *

| Decision | Owner | Blocking |
| --- | --- | --- |
| Document authority and approved target status | Product | Yes |
| Shared eligibility and final user-visible execution order | Product with Backend validation | Yes |
| Fill targets, tier transitions and fallback versus expansion | Product and Design | Yes |
| Application and collaboration state dictionary | Product, Backend and Data | Yes |
| Acceptance-rate and ranking-signal definitions | Product and Data | Yes |
| Signal ranges, missing values and stable ordering | Product, Data and Backend | Yes |
| Follower Fit, Gender Match and Exploration tag meaning | Product and Data | Yes |
| Partner recovery states and qualifying activity | Product and Operations | Yes |
| Lifecycle email timing and reminder cutoff | Product and Operations | Yes |
| First-ten boundary and lifecycle lead behavior | Product and Design | Yes |
| Interest predicate, follower source and missing-profile outcome | Product | Yes |
| Time-window and country boundary rules | Product with Data validation | Yes |
| New Deals relaxed ranking | Product | Yes |
| Trending status and window behavior | Product and Data | Yes |
| New Brands age promise and fallback | Product | Yes |
| New Brands partner repetition and collection granularity | Product | Yes |
| Hidden Gems demand versus exposure definition | Product and Data | Yes |
| Hidden Gems overlapping-window contribution | Product and Data | Yes |
| Local pool ordering and collection-by-tab matrix | Product | Yes |
| Geo radius, location fallback and missing-coordinate outcome | Product and Data | Yes |
| Fixed, dynamic and expansion empty states | Product and Design | Yes |
| Attribution, rule telemetry and goal measures | Product and Data | Yes |

## Recommended action order

* * *

1. Approve the authority model and label every document
2. Create the canonical naming, lifecycle, application and collaboration dictionaries
3. Approve the shared execution order, preserved eligibility and lead-position outcome
4. Define fill targets, tier transitions, Final fallback, expansion and empty states
5. Resolve score ranges, signal meaning, acceptance rate, time boundaries and missing data
6. Resolve New Deals, Trending, New Brands and Hidden Gems conflicts, including partner repetition and overlapping windows
7. Approve local-pool precedence, geo radius, location fallback, supported pool and tab mapping, duplicate rules and session behavior
8. Extend Metrics with attribution, rule decisions, rotation behavior and goal measures
9. Update each owning source document and remove duplicated conflicting language
10. Create new acceptance-ready backlog work from the approved sources

No ruleset is ready for implementation approval until steps 1 through 8 are complete. Step 9 makes the decisions durable. Step 10 turns them into scoped delivery work.
