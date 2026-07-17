# Feed Functions (revised)

* * *
> This document does NOT represent final production behaviour, implementation might differ
* * *

# Overview

**Changelog:** the scoring pipeline now runs in two passes — a cheap linear
pre-rank over the candidate pool, then the full weighted model on the top slice.

* * *
A Feed Function generates a custom filtered list of deals, displayed in visual feed pattern.

Feed Function is the technical term used throughout this doc.
But we call it a **Collection** when referring to it from a Product perspective.

Functions always serve distinct goals:
*   A personalized function needs creator-specific matching
*   A discovery function needs exploration
*   A top-deals function needs performance signals

Every function is built from three pieces which run in a fixed order:
1. **Rulesets & Overrides** → Filters the candidate pool
2. **Weighted Scoring & Decay** → Ranks whatever survives the filter
3. **Mixed Feed Behaviour** → Interleaves the ranked online and local lists

The proposals below assign relative weight priorities to ranking signals per function: what each function optimizes for, why those signals matter for that goal, and how the suggested weighting supports the intended business outcome.
* * *
##   

## Weighted Scoring
* * *
Weighted scoring is one half of the ranking, alongside Rulesets. A ruleset decides whether a deal is eligible at all. Weighted scoring decides the order among whatever survives that filter.

Each function picks a subset of signals below and gives each one a percentage weight. The percentages are relative priorities within that function, not independent probabilities, and every proposed set of weights sums to 100%.


Most signals return a value between 0 and 1, so a percentage weight scales them directly.
A few, like Interest Match and Application Velocity, are raw and unbounded.
####   

#### **Scoring Glossary (updated)**
* * *
Every signal used in the function algorithms below.

**Freshness**
*   How recently a deal was added
*   Full at creation. Decays to 0 over the window (`max(0, 1 - ageDays / window)`)

**Geo Proximity**
*   How close a local deal is to the creator
*   Near-full within 15 km (1.0 down to 0.95)
*   Beyond that, exponential decay over a 250 km scale

**Interest Match**
*   How well the deal matches the creator's interests
*   A soft signal, not a hard filter

**Acceptance Rate**
*   How well a deal converts, its acceptance quality
*   A pre-computed score with four windows (total, 7d, 14d, 30d); each function enables one

**Application Velocity**
*   Recent traction over the last 7 days
*   Applications per day: the 7-day count divided by 7
*   A raw, unbounded rate

**Follower Fit**
*   Whether the creator's follower count fits the deal
*   Bonus when the creator clears the minimum (capped at 2×), penalty below it
*   The penalty weight is unset today. So it is **bonus-only** and never filters anyone out

**Partner Freshness**
*   How recently the partner joined
*   Full for 7 days, then decays to 0 at 65 days

**Gender Match**
*   Whether the deal is aimed at the creator's gender
*   Bonus when the deal is unisex or matches the creator's gender
*   A mismatch is wired to subtract a penalty, but that weight is unset. So it is **bonus-only**

**Exploration**
*   Boosts deals tagged for discovery
*   A flat boost for deals with the `deal.exploration` tag

**Low Application Activity**
*   Rewards deals with little application traction
*   Inverted: full at 0 applications, 0 at 15
*   Blended across four windows (total, 7d, 14d, 30d). Each has its own weight

**Randomness**
*   Controlled entropy so feeds do not feel frozen
*   A seeded per-deal hash in \[0,1\]
*   Stable within a session, varies between sessions
* * *
##   

## Rulesets
* * *
Rulesets are hard filters applied before weighted scoring.
These help ensure a function shows deals that match its promise.

A hard filter is applied to the candidate pool before weighted scoring runs, keeping ineligible deals out. The ruleset filter decides what stays, the weighted ranking algorithms decide what order it comes in. This preserves the benefits of weighted ranking while preventing the failures that break a collection's promise.

Each ruleset has a degradation sequence, so a filter can widen gracefully instead of leaving a collection empty.

#### **Sequence**
* * *
A ruleset runs in three ordered steps:
1. **Primary** filters the pool first, then the weights rank whatever survives
2. **Relaxed** widens the rule and the weights rank again
3. **Final fallback** drops the rule entirely and sorts by the function's plain production sort instead

A plain production sort is a single-column database order, like `created_at DESC`.
No signals, no weights, no scoring, just one field deciding the order.

Step 3 matters because the weighted score can't be trusted once the rule is dropped. The signal the ruleset exists to protect is still 0 across an unfiltered pool, so ranking by the same weights would just reproduce the failure the ruleset was built to prevent.
* * *
####   

#### **Degradation**
* * *
A function using all three tiers never ends up empty.
This mirrors the guaranteed fallback in [Patterns](https://app.clickup.com/90151466006/v/dc/2kyq4d0p-20955/2kyq4d0p-78075) (Collection rotation, Step 4).

Not every function uses all three tiers:
*   Skipping Relaxed means nothing loosens if Primary comes up short
*   Skipping Final fallback means nothing replaces the rule if every tier tried still comes up short

There's no guaranteed full list in this case, the function shows fewer deals instead.
Once the creator hits the bottom of the list, an expansion state will appear as defined in Patterns.
* * *
####   

#### **Proposed rulesets**
* * *
An overview of every proposed ruleset per function:

**New Deals**
**`(`**`new_deals_feed_url)`
* * *
Stops deals older than 21 days from still scoring as new.

*   **Primary:** `created_at ≤ 7d`
*   **Relaxed:** `created_at ≤ 14d`, then `≤ 21d`
*   **Final fallback:** `no_fallback`
####   

**Trending**
`(top10_deals_feed_url)`
* * *
Keeps deals with zero traction off the "what's hot" list.

*   **Primary:** `≥ 10 application in last 14d`
*   **Relaxed:** `≥ 10 application in last 30d`
*   **Final fallback:** `completed_applications_count + upcoming_applications_count DESC`
####   

**New Brands**
`(new_partners_feed_url)`
* * *
Stops partners past their first 60 days from posing as newly joined.

*   **Primary:** `partner_created_at ≤ 60d`
*   **Relaxed:** `partner_created_at ≤ 120d`
*   **Final fallback:** `partner_id DESC`
####   

**Hidden Gems**
`(hidden_gem_feed_url)`
* * *
Stops a deal that ever went popular from staying buried forever.

*   **Primary:** `< 5 applications in last 14d`
*   **Relaxed:** `< 10 applications in last 14d`
*   **Final fallback:** `last14_days_pending_applications_count + last14_days_completed_applications_count + last14_days_upcoming_applications_count ASC`
####   

**For You**
`(deals_for_me_feed_url)`
* * *
Keeps out deals the creator can't realistically get or isn't interested in.

*   **Primary:** `hard interest + min-follower filter`
*   **Relaxed:** `no_relaxation`
*   **Final fallback:** `no_fallback`
####   

**Fit Check**
`(deals_for_my_follower_count_feed_url)`
* * *
Keeps out deals the creator's follower count can't reach.

*   **Primary:** `deal_min_followers ≤ creator_followers`
*   **Relaxed:** `no_relaxation`
*   **Final fallback:** `no_fallback`
####   

**Your Vibe**
`(picked_for_you_feed_url)`
* * *
Keeps the feed feeling personally picked, not random.

*   **Primary:** `≥ 1 matching interest`
*   **Relaxed:** `no_relaxation`
*   **Final fallback:** `no_fallback`
* * *
##   

## Mixed Feed Behaviour
* * *
This behaviour runs last, after Rulesets and Weighted Scoring have already done their work on each pool separately. It never re-filters or re-ranks a deal, it only decides the order the two lists are woven together in.

This applies to `all_deals_feed_url` and functions that use both online and local deal pools. It does not apply to functions that intentionally show only online deals or only local deals.

A function mixing both pools should not show one large block of online deals followed
by local deals, or the reverse. It should build two lists first:
*   Online deals, ordered by this function's discovery ranking
*   Local deals, ordered nearest-first

The final result then interleaves those lists so creators see both deal types early:

```markdown
1. Online deal
2. Nearest local deal
3. Online deal
4. Next-nearest local deal
```

If one list has fewer deals, the function keeps showing the remaining deals from the other list. The creator should never see empty spaces or dead ends because one deal type ran out.
* * *
##   

# Functions
* * *
Every function below follows the same breakdown: current behavior and goal, ranking intent,
the weighted algorithm, its ruleset if it has one, and its identity in the creator app.

### Deal `(deal_feed_url)`
* * *
A single-deal detail view, not a multi-item function. Ranking weights do not apply because ranking is for ordered lists, not single-item retrieval.

Future extensions could add discovery around this entry point, creating new functions that would each carry their own ranking strategy: similar deals, recommended alternatives, nearby deals, related creators and AI-generated recommendations.

**Current Behavior:** Single deal retrieval
**Future Direction:** Potential extensions with similar deals, alternatives and recommendations
**Goal:** Increase engagement beyond a single deal
* * *
###   

### All Deals `(all_deals_feed_url)`
* * *
The primary discovery surface for all creators. The All Deals function needs to be relevant enough to keep creators engaged, exploratory enough to surface new deals and partners they would not find otherwise.

**Current Behavior:** Broad discovery function, mostly random ordering
**Future Direction:** Balanced exploration function
**Goal:** Encourage discovery while remaining relevant
* * *

#### Algorithm
* * *
This algorithm balances freshness, proximity and randomness for broad discovery.

**Ranking intent**
* * *
1. Freshness and geo proximity carry the function because discovery should feel current
2. Interest match adds relevance without narrowing the experience
3. Randomness, gender and acceptance are supporting signals
* * *

**Weights**
* * *
**Freshness:** `26% Weight`
Decays to 0 over 7 days from creation.

**Geo proximity:** `26% Weight`
Near-full within 10 km, then decays over a 250 km scale.

**Interest match:** `15% Weight`
Scores how well the deal matches the creator's interests.

**Randomness:** `15% Weight`
Seeded per-deal entropy. Stable within a session, varies between sessions.

**Gender match:** `10% Weight`
Bonus when the deal is unisex or matches the creator's gender. Bonus-only.

**Acceptance rate:** `8% Weight`
Uses total deal acceptance rate since inception.
* * *
###   

### 1\. New Deals `(new_deals_feed_url)`
* * *
A creator opening "New Deals" expects to see recent deals.
Anything that's not recent, breaks that promise.

**Current Behavior:** Ordered by newest deals
**Future Direction:** Freshness-first function with basic personalization
**Goal:** Help creators discover new opportunities quickly
* * *

#### **Ruleset**
* * *
This ruleset stops deals older than 21 days from still scoring as new.

**Sequence**
* * *
**Primary:** `created_at ≤ 7d`
The deal was created 7 days ago or less.
* * *
**Relaxed:** `created_at ≤ 14d`, then `≤ 21d`
Widen to 14 days, then 21 days if still short.
* * *
**Final fallback:** `no_fallback`
Deals older than 21 days are excluded, not shown with no filter.
* * *

The ruleset applies a **freshness window** in **two** widening **tiers**:
1. Deals created within the last 7 days
2. Widens to 14, then 21 days if there aren't enough to fill the collection

Which means that:
*   A deal older than 21 days never appears
*   The rule never relaxes past 21 days, and there is no fallback
*   The function shows fewer deals rather than breaking its freshness promise
* * *

#### Algorithm
* * *
This algorithm ranks by freshness first, with light interest and proximity on top.

**Ranking intent**
* * *
1. Freshness dominates because creators chose this function to see what is new
2. Interest and proximity provide basic relevance
3. Acceptance rate and randomness stay intentionally low

**Weights**
* * *
**Freshness:** `41% Weight`
Decays to 0 over 7 days from creation.

**Interest Match:** `18% Weight`
Scores how well the deal matches the creator's interests.

**Randomness:** `15% Weight`
Seeded per-deal entropy. Stable within a session, varies between sessions.

**Geo Proximity:** `13% Weight`
Near-full within 10 km, then decays over a 250 km scale.

**Gender Match:** `8% Weight`
Bonus when the deal is unisex or matches the creator's gender. Bonus-only.

**Acceptance Rate:** `5% Weight`
Uses total deal acceptance rate since inception.
* * *
###   

### 2\. Trending `(top10_deals_feed_url)`
* * *
A creator opening "Trending" expects to see deals with real marketplace traction.
Anything that doesn't have traction, breaks that promise.

**Current Behavior:** Based on accepted creator counts
**Future Direction:** High-performing and trending deals
**Goal:** Surface deals that are performing well across the marketplace
* * *

#### **Ruleset**
* * *
This ruleset keeps deals with zero traction off the "what's hot" list.

**Sequence**
* * *
**Primary:** `≥ 10 application in last 14d`
At least 10 applications in the past 14 days.
* * *
**Relaxed:** `≥ 10 application in last 30d`
Widen the window to 30 days.
* * *
**Final fallback:** `completed_applications_count + upcoming_applications_count DESC`
No filter, sort by total completed plus upcoming applications.
* * *

The ruleset applies a **traction bar** in **two** widening **tiers**:
1. At least 10 applications in the last 14 days
2. Widens to 10 applications in the last 30 days if there aren't enough

Which means that:
*   A deal with no real traction never appears while the filter holds
*   If both tiers come up short, the final fallback drops the filter and sorts by `complated_applications_count + upcoming_applications_count DESC`, the existing production sort
* * *

#### Algorithm
* * *
This algorithm ranks by acceptance quality and recent application velocity.

**Ranking intent**
* * *
1. Acceptance rate and application velocity carry the function to highlight performance
2. Freshness prevents old winners from holding the list forever
3. Geo proximity and randomness stay low because the function should show trending deals

**Weights**
* * *
**Acceptance Rate:** `27% Weight`
Uses the 14-day deal acceptance rate.

**Application Velocity:** `27% Weight`
Measures recent applications per day over the last 7 days.

**Randomness:** `15% Weight`
Seeded per-deal entropy. Stable within a session, varies between sessions.

**Freshness:** `13% Weight`
Decays to 0 over 7 days from creation.

**Geo Proximity:** `10% Weight`
Near-full within 10 km, then decays over a 250 km scale.

**Gender Match:** `8% Weight`
Bonus when the deal is unisex or matches the creator's gender.
* * *
###   

### 3\. New Brands `(new_partners_feed_url)`
* * *
A creator opening "New Brands" expects to discover partners who recently joined Barter, not established partners recycling visibility.

**Current Behavior:** Sorted by newest partners
**Future Direction:** Partner discovery function
**Goal:** Help new partners receive visibility and marketplace discovery
* * *

#### **Ruleset**
* * *
This ruleset stops partners past their first 60 days from posing as newly joined.

**Sequence**
* * *
**Primary:** `partner_created_at ≤ 60d`
The partner joined 60 days ago or less.
* * *
**Relaxed:** `partner_created_at ≤ 120d`
Widen to 120 days.
* * *
**Final fallback:** `partner_id DESC`
No filter, sort by partner ID.
* * *

The ruleset applies a **partner-freshness window** in **two** widening **tiers**:
1. Partners who joined within the last 60 days
2. Widens to 120 days if there aren't enough to fill the collection

Which means that:
*   A partner past their first 120 days never appears while the filter holds
*   If both tiers come up short, the final fallback drops the filter and sorts by `partner_id DESC`, the existing production sort
* * *

#### Algorithm
* * *
This algorithm ranks by partner freshness, with boosts for exploration-tagged deals.

**Ranking intent**
* * *
1. Partner freshness carries the function because the product goal is visibility for new entrants
2. Exploration gives Product a way to highlight discovery-worthy partners
3. Deal freshness and randomness support variety without shifting away from partners

**Weights**
* * *
**Partner Freshness:** `42% Weight`
Partners experience a drop-off between 7 and 60 days. After that, the score reaches 0.

**Exploration:** `20% Weight`
Flat boost for deals tagged for discovery.

**Freshness:** `15% Weight`
Decays to 0 over 7 days from creation.

**Randomness:** `15% Weight`
Seeded per-deal entropy. Stable within a session, varies between sessions.

**Gender Match:** `8% Weight`
Bonus when the deal is unisex or matches the creator's gender.
* * *
###   

### 4\. Hidden Gems `(hidden_gem_feed_url)`
* * *
A creator opening "Hidden Gems" expects to discover overlooked deals.
Deals the rest of the marketplace hasn't noticed, not deals buried because they're low quality.

**Current Behavior:** Low application activity
**Future Direction:** Discovery and fairness function
**Goal:** Prevent feed monopolization and improve deal fairness
* * *

#### **Ruleset**
* * *
This ruleset stops an unpopular deal from staying buried forever.

**Sequence**
* * *
**Primary:** `< 5 applications in last 14d`
Fewer than 5 applications in the past 14 days.
* * *
**Relaxed:** `< 10 applications in last 14d`
Widen the cap to under 10.
* * *
**Final fallback:** `last14_days_pending_applications_count + last14_days_completed_applications_count +`
`last14_days_upcoming_applications_count ASC`
No filter, sort by fewest recent applications first.
* * *

The ruleset applies a **low-application cap** in **two** widening **tiers**:
1. Fewer than 5 applications in the last 14 days
2. Widens to fewer than 10 if there aren't enough to fill the collection

Which means that:
*   A deal with high recent traction never appears while the filter holds
*   If both tiers come up short, the filter drops and deals sort by fewest recent applications first
*   The fallback sort is `last14_days_pending_applications_count + last14_days_completed_applications_count + last14_days_upcoming_applications_count ASC`, the existing production sort
* * *

#### Algorithm
* * *
This algorithm ranks by low application activity, with strong interest matching on top.

**Ranking intent**
* * *
1. Low application activity carries the function because the goal is to surface overlooked deals
2. Interest match is intentionally strong so fairness does not create irrelevant recommendations
3. Geo proximity and randomness provide support without weakening the hidden-gem promise

**Weights**
* * *
**Interest Match:** `24% Weight`
Scores how well the deal matches the creator's interests.

**Randomness:** `15% Weight`
Seeded per-deal entropy. Stable within a session, varies between sessions.

**Total -** **Low Application Activity**: `14% Weight`
Inverted: full at 0 applications, 0 at 10, using the all-time count.

**7d -** **Low Application Activity**: `12% Weight`
Inverted: full at 0 applications, 0 at 10, over the last 7 days.

**Geo Proximity:** `10% Weight`
Near-full within 10 km, then decays over a 250 km scale.

**14d -** **Low Application Activity**: `9% Weight`
Inverted: full at 0 applications, 0 at 10, over the last 14 days.

**Gender Match:** `8% Weight`
Bonus when the deal is unisex or matches the creator's gender.

**30d - Low Application Activity**: `8% Weight`
Inverted: full at 0 applications, 0 at 10, over the last 30 days.
* * *
###   

### 5\. For You `(deals_for_me_feed_url)`
* * *
A creator opening "For You" expects to see deals they can get and care about.
This is the most personalized collection, and the promise is personal relevance.

**Current Behavior:** Interest and follower filtering
**Future Direction:** Highly personalized recommendation function
**Goal:** Maximize creator relevance and application likelihood
* * *

#### **Ruleset**
* * *
This ruleset keeps out deals the creator can't realistically get or isn't interested in.

**Sequence**
* * *
**Primary:** `hard interest + min-follower filter`
The deal must match one of the creator's interests, and must clear the minimum follower count
* * *
**Relaxed:** `no_relaxation`
This rule never loosens
* * *
**Final fallback:** `no_fallback`
If a deal fails the rule, it never shows
* * *

The ruleset applies **two hard filters** as an **AND** condition:
1. The deal must match at least one of the creator's interests
2. The creator's follower count must meet the deal's minimum

Which means that:
*   A deal with no interest overlap never appears
*   The rule never loosens, and there is no fallback
*   The function shows fewer deals rather than degrading relevance
* * *

#### Algorithm
* * *
This algorithm ranks by personal fit, with interest match and follower compatibility in the lead.

**Ranking intent**
* * *
1. Interest match and follower fit share the lead because it must feel personal and achievable
2. Acceptance rate adds recent marketplace proof
3. Proximity, freshness and randomness make the function feel alive

**Weights**
* * *
**Interest Match:** `21% Weight`
Scores how well the deal matches the creator's interests.

**Follower Fit:** `21% Weight`
Bonus when the creator clears the deal's minimum follower count.

**Gender Match:** `17% Weight`
Bonus when the deal is unisex or matches the creator's gender.

**Randomness:** `15% Weight`
Seeded per-deal entropy. Stable within a session, varies between sessions.

**Acceptance Rate:** `12% Weight`
Uses the 14-day deal acceptance rate.

**Geo Proximity:** `8% Weight`
Near-full within 10 km, then decays over a 250 km scale.

**Freshness:** `6% Weight`
Decays to 0 over 7 days from creation.
* * *
###   

### 6\. Fit Check `(deals_for_my_follower_count_feed_url)`
* * *
A creator opening "Fit Check" expects to see deals their follower count can reach.
This is about practical eligibility. No teasing creators with deals they can't qualify for.

**Current Behavior:** Follower-count-focused function
**Future Direction:** Creator-size compatibility function
**Goal:** Show deals realistically achievable for the creator
* * *

#### **Ruleset**
* * *
This ruleset keeps out deals the creator's follower count can't apply to.

**Sequence**
* * *
**Primary:** `deal_min_followers ≤ creator_followers`
The creator's follower count must meet or exceed the deal's minimum.
* * *
**Relaxed:** `no_relaxation`
This rule never loosens.
* * *
**Final fallback:** `no_fallback`
If a deal fails the rule, it never shows.
* * *

The ruleset applies **one hard filter**:
*   `deal_min_followers ≤ creator_followers`

Which means that:
*   A deal that asks for more followers than the creator has never appears
*   The rule never loosens, and there is no fallback
*   The function shows fewer deals rather than degrading relevance
* * *

#### Algorithm
* * *
This algorithm ranks by follower compatibility, with acceptance rate as practical proof.

**Ranking intent**
* * *
1. Follower fit clearly leads because this function is about realistic access
2. Acceptance rate gives practical proof that creators can get approved
3. Freshness, proximity, interest match and randomness keep the function useful

**Weights**
* * *
**Follower fit:** `30% Weight`
Bonus when the creator clears the deal's minimum follower count.

**Acceptance rate:** `20% Weight`
Uses the 14-day deal acceptance rate.

**Randomness:** `15% Weight`
Seeded per-deal entropy. Stable within a session, varies between sessions.

**Freshness:** `10% Weight`
Decays to 0 over 7 days from creation.

**Geo proximity:** `10% Weight`
Near-full within 10 km, then decays over a 250 km scale.

**Gender match:** `8% Weight`
Bonus when the deal is unisex or matches the creator's gender.

**Interest match:** `7% Weight`
Scores how well the deal matches the creator's interests.
* * *
###   

### 7\. Your Vibe `(picked_for_you_feed_url)`
* * *
A creator opening "Your Vibe" expects deals that match their interests.
Deals that feel personally picked, not random.

**Current Behavior:** Interest-based function
**Future Direction:** Interest and semantic personalization
**Goal:** Increase perceived personalization quality
* * *

#### **Ruleset**
* * *
This ruleset keeps the feed feeling personal.

**Sequence**
* * *
**Primary:** `≥ 1 matching interest`
The deal must match at least one of the creator's interests.
* * *
**Relaxed:** `no_relaxation`
This rule never loosens.
* * *
**Final fallback:** `no_fallback`
If a deal fails the rule, it never shows.
* * *

The ruleset applies **one hard filter**:
*   The deal must match at least one of the creator's interests

Which means that:
*   A deal with no interest overlap never appears
*   The rule never loosens, and there is no fallback
*   The function shows fewer deals rather than degrading relevance
* * *

#### Algorithm
* * *
This algorithm ranks by interest match, with geo proximity for local relevance.

**Ranking intent**
* * *
1. Interest match clearly leads because this function should feel personally selected
2. Geo proximity gives strong local relevance when nearby opportunities fit the creator
3. Freshness, acceptance rate and randomness keep the function useful

**Weights**
* * *
**Interest match:** `36% Weight`
Scores how well the deal matches the creator's interests.

**Geo proximity:** `20% Weight`
Near-full within 10 km, then decays over a 250 km scale.

**Randomness:** `15% Weight`
Seeded per-deal entropy. Stable within a session, varies between sessions.

**Freshness:** `11% Weight`
Decays to 0 over 7 days from creation.

**Acceptance rate:** `10% Weight`
Uses the 14-day deal acceptance rate.

**Gender match:** `8% Weight`
Bonus when the deal is unisex or matches the creator's gender.
* * *
###