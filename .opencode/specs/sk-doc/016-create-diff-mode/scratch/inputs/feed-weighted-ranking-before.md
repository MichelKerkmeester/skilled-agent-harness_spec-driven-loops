# Fv2 - Weighted Ranking & Intelligent Discovery

* * *
> This document is used to define what the updated Feed system **COULD** become.  
> The actual implementation may differ and should later replace this doc with production behavior.
* * *
##   

## Overview
* * *
The feed system evolves from simple filtering and sorting toward multi-factor weighted ranking

**From:** `Can this creator see this deal?`
**To:** `How relevant is this deal for this creator right now?`
* * *

#### **Philosophy**
* * *
The feed should no longer rely on hard yes/no filtering.
Binary eligibility works when the goal is simple: show every deal a creator qualifies for.

But when the goal shifts to relevance, binary rules create problems:
*   A deal that barely passes follower-count threshold gets the same visibility as a perfect match.
*   A deal that misses one filter by a fraction disappears entirely, even if the creator might want it.

Scoring replaces exclusion with gradation.
Deals receive positive scores for strong matches and penalties for weak matches,
then rank relative to each other.

Why this works well:
*   A deal that misses a filter still surfaces if it scores well on other signals.
*   A deal that barely qualifies does not dominate over better-suited alternatives.

This shift **solves three common problems** in the current feed:
* * *
1. **Empty feeds**

Problem: When no deal passes every filter, the feed goes blank.

Solution: Scoring surfaces the best available options even when none are perfect.

* * *
1. **Repetitive feeds**

Problem: Binary filtering converges on the same small set of eligible deals.

Solution: Scoring introduces variety by weighting multiple factors, not just one.

* * *
1. **Low diversity**

Problem: Hard filters favour a narrow slice of deals.

Solution: Scoring lets imperfect-but-interesting deals compete alongside perfect matches.

* * *
####   

#### **Features**
* * *
These features build on the current Feed v2 model described in [this document](https://app.clickup.com/90151466006/docs/2kyq4d0p-20955/2kyq4d0p-76635).

Each Fv2 feature maps to a next-generation counterpart.
Alongside new capabilities like semantic similarity, adaptive discovery and impression-awareness.

| Fv2 | Fv2 - Next-Gen |
| ---| --- |
| Filtering | Weighted ranking |
| Eligibility rules | Dynamic per-user scoring |
| Simple sorting | Multi-factor ranking |
| Randomization | Personalized recommendations |
| Distance ordering | Intelligent exploration |
| Created date ordering | Feed diversity |
| Application count ordering | Performance-aware scoring |
|  | Semantic similarity |
|  | Adaptive discovery |
|  | Impression-awareness |

####   

#### **Architecture**
* * *
Each stage in this pipeline has a distinct responsibility, allowing teams to tune retrieval, ranking and diversity independently without affecting the rest of the system.

The feed system is expected to evolve toward:

```markdown
Creator Request
    ↓
Precomputed Context
    ↓
Deal Candidate Retrieval
    ↓
Weighted Ranking Engine
    ↓
Exploration & Diversity Layer
    ↓
Final Feed Response
```

#### **Technologies**
* * *
Potential technologies we can use per area.

| Area | Technology |
| ---| --- |
| Source of truth | PostgreSQL |
| Feed retrieval & ranking | OpenSearch / Elasticsearch |
| Semantic search | OpenSearch Vector Search |
| Real-time interaction state | Redis |
| Analytics / historical events | PostgreSQL / ClickHouse |
| Future ML ranking | Vespa / ML reranker |

####   

#### **Roadmap**
* * *
Each phase builds on the previous: ranking first, then awareness of what creators have seen,
then understanding of what deals actually mean.

| Phase | Goal |
| ---| --- |
| Phase 1 | OpenSearch weighted ranking |
| Phase 2 | Impression-aware feeds |
| Phase 3 | Semantic similarity |
| Phase 4+ | Future capablities |

##   

## Weighted Ranking System
* * *
Weighted ranking replaces simple yes/no relevance decisions with continuous scoring.

#### **Score-Based Ranking**
* * *
Each deal receives a numerical score based on multiple signals, surfacing the most relevant deals instead of only eligible ones. Different feeds assign different weights to the same signals to serve different goals.

This does not mean every rule becomes soft.
Some rules still define whether a deal belongs in the candidate pool at all:
*   A hidden deal should stay excluded.
*   An already-applied deal should not reappear as a normal recommendation.
*   A physical/local deal should respect the relevant distance or country rules.
*   A single-deal feed should return the requested deal, not a ranked list.

Every deal can receive a score. Example:

```markdown
final_score =
    text_relevance
  + freshness_score
  + geo_score
  + interest_match_score
  + follower_match_score
  + acceptance_rate_score
  + popularity_score
  + diversity_score
  - seen_penalty
  - rejection_penalty
```

Each feed may use different weights
* * *

| Feed | Prioritizes |
| ---| --- |
| All Deals / Mixed Feeds | Online-local balance + discovery |
| New Deals | Freshness |
| Top Deals | Popularity + Acceptance |
| Hidden Gems | Low exposure |
| Deals For Me | Personalization |
| Picked For You | Interest matching |
| Local / Physical Deals | Nearest-first proximity + secondary relevance |

#### **Bag-Aware Ranking**
* * *
Ranking should happen after the correct deal bag has been selected.
The same score should not blindly apply to every pool.

| Bag | Ranking Principle |
| ---| --- |
| All Deals | Rank online and physical pools separately, then assemble the feed intentionally |
| Online | Rank by the feed's purpose, such as freshness, personalization or performance |
| Physical | Order nearest-first, then use secondary ranking signals where useful |
| Nothing | Define a custom rule, because the normal bag assumptions do not apply |

For physical experiences, distance is stronger than a normal score boost. The nearest relevant local deal should not lose its position only because a farther deal is newer or more popular.
* * *
##   

## Ranking Signals
* * *
These are the measurable attributes used to calculate a deal's score. They fall into three categories: creator-based, deal-based and platform-level, each of which contributes a different perspective on relevance.

#### **Creator-Based**
* * *
Creator-based signals capture who the creator is, where they are and what they have already seen or done. They allow the feed to personalize results to each individual creator.

| Signal | Business Meaning |
| ---| --- |
| Follower count | Deal eligibility & creator size fit |
| Creator interests | Relevance to creator profile |
| Creator country | Regional eligibility |
| Current location | Geo relevance |
| Seen deals | Feed freshness & repetition prevention |
| Applied deals | Exclude already-applied deals |
| Hidden deals | Exclude explicitly hidden deals |
| Creator engagement history | Predict creator likelihood to apply |
| Content type affinity | Match creator preferred content |

#### **Deal-Based**
* * *
Deal-based signals describe the deal itself: its freshness, how well it converts, its popularity and its category. They determine how attractive a deal is independently of any specific creator.

| Signal | Business Meaning |
| ---| --- |
| Deal freshness | Newer deals may be prioritized |
| Acceptance rate | Easier / more creator-friendly deals |
| Rejection rate | Potentially low-converting deals |
| Popularity | High demand deals |
| Low exposure | Hidden gem discovery |
| Geo distance | Local relevance |
| Content type | Category matching |
| Partner recency | New partner discovery |
| Application velocity | Trend detection |
| Completion history | Reliability indicator |

#### **Platform-Level**
* * *
Platform-level signals protect marketplace health. They prevent any single partner, category or deal from dominating feeds by ensuring diversity, balancing exposure and surfacing fresh content.

| Signal | Business Meaning |
| ---| --- |
| Exploration ratio | Prevent over-optimization |
| Diversity score | Avoid repetitive feed |
| Category balancing | Avoid single-category dominance |
| Partner balancing | Prevent large partners dominating |
| Impression saturation | Reduce repeated exposure |
| Feed novelty | Surface unseen deals |

##   

## Geo Ranking & Distance Logic
* * *
Geo ranking should not behave the same way in every feed.
It has two roles: supporting broad discovery and protecting the local/physical feed promise.

**Broad Discovery Feed**
* * *
In broad discovery feeds, distance can act as one relevance signal among others.

Nearby deals receive a boost, farther deals receive less of that boost, and other signals such as freshness, interests, acceptance rate or diversity can still affect the final order.

**Physical Feeds**
* * *
In physical (local) feeds, distance is not just a boost. It is the core promise of the surface.

Physical deals should be ordered from nearest to furthest first. Freshness, popularity, acceptance rate and personalization can support the order, but they should not move a farther deal ahead of a closer relevant deal.

The future feed system may support:
*   Geo filtering
*   Geo decay scoring
*   Dynamic search radius
*   City-level personalization
*   Country-level personalization
*   Travel-aware feeds

For broad discovery:

```java
Closer = Higher Score
Further = Lower Score
```

For local/physical surfaces:

```java
Nearest = First
Secondary relevance = Tie-breaker
```

This allows:
*   Better discovery
*   More feed diversity
*   Less repetitive local feeds
*   A local feed that still keeps its nearest-first promise
* * *

#### **Geo Concepts**
* * *
Geo concepts describe how location can shape feed relevance beyond a simple nearest-first sort.
They should help the feed stay useful in different location contexts, such as dense cities, nearby regions, travel situations or tourist-heavy areas.

These concepts are optional ranking extensions:
* * *

| Concept | Example |
| ---| --- |
| Local boost | Nearby deals boosted |
| Travel mode | Larger radius while abroad |
| City exploration | Nearby cities partially boosted |
| Density balancing | Avoid over-showing dense areas |
| Popular destination boosting | Tourist-aware feed behavior |

###   

#### **Location Fallback**
* * *
If current coordinates are unavailable, the feed may fall back to the creator's default location
or another reasonable secondary order. When this happens, the user should understand that
current-location ordering is unavailable.

Location context should refresh when the creator moves significantly, so local ordering does not stay tied to an old position.
* * *

#### **Online / Local Alternation**
* * *
Mixed surfaces and sidescrolls should not let the larger online pool bury local deals. The All Deals Bag already points toward this by combining online and physical results. Future ranking should make the merge rule explicit.

Online and local deals should be prepared as separate pools before they are merged:
*   Online deals rank by the feed's purpose, such as freshness, personalization or performance.
*   Local deals rank nearest-first, with secondary relevance used only after proximity.
*   The final mixed surface alternates between the two pools.

```bash
Online deal
Nearest local deal
Online deal
Next-nearest local deal
...
```

The default mixed pattern is `online, local, online, local`. The first local slot should contain the nearest available local deal, and each later local slot should contain the next-nearest available local deal.

If one pool runs out, the feed should continue with the remaining deals from the other pool without leaving gaps or placeholders. Duplicate deals should not appear twice in the same surface.
* * *
##   

## Semantic Search & AI Search
* * *
Semantic search moves beyond keyword matching to understand the meaning behind deals and creator preferences. It enables natural-language queries and similarity-based recommendations that surface deals a creator might not find through filtering alone.

The feed may support:
*   Natural-language search
*   Similar deal search
*   Semantic creator/deal matching
*   Interest inference
*   AI recommendations
*   Embedding-based matching

Example future queries:

```bash
"Show me eco-friendly fashion deals"
"Deals similar to this creator"
"Find hidden gems for food creators"
```

**Potential Semantic Capabilities**
* * *

| Capability | Business Value |
| ---| --- |
| Similar deals | Better discovery |
| Similar creators | Better partner targeting |
| Semantic interests | Better personalization |
| Natural language search | Improved creator UX |
| AI feed generation | Fully personalized feed |

##   

## Exploration vs Exploitation
* * *
The feed must balance **exploitation** (showing deals proven to perform well) with **exploration** (surfacing undiscovered or low-exposure deals). Without exploration, popular deals and large partners crowd out everything else, stagnating the marketplace.
####   

#### **Exploitation**
* * *
Show deals likely to perform well.

Example:
*   High acceptance rate
*   High CTR
*   Strong creator match
*   Popular deals
####   

#### **Exploration**
* * *
Show deals that need discovery.

Example:
*   New deals
*   Low-impression deals
*   Hidden gems
*   New partners
*   Experimental content

Without exploration, feeds risk:
*   Large partners dominating
*   New deals never surfacing
*   Feed stagnation
*   Poor marketplace health

**Potential Exploration Strategies**
* * *

| Strategy | Business Goal |
| ---| --- |
| Random exploration slots | Discoverability |
| New partner boosts | Marketplace growth |
| Low-impression boosts | Fairness |
| Time-decay balancing | Prevent feed lock-in |
| Semantic exploration | Discover adjacent interests |

##   

## Seen Deals & Impression Awareness
* * *
A feed repeating the same deals creates fatigue.

Impression awareness tracks what a creator has seen and replaces binary removal with graduated penalties: seen once gets a small penalty, seen repeatedly a larger one, clicked a discount, hidden a full exclusion.

Tracking these interactions feeds data back into ranking, teaching the feed what a creator values.

The future feed system may become aware of:
*   Previously seen deals
*   Repeated impressions
*   Click behavior
*   Ignore behavior
*   Hide behavior
*   Application behavior

Instead of binary exclusion:

```cs
Seen deal = remove
```

The feed may instead use:

```java
Seen recently = penalty
Seen many times = larger penalty
Clicked previously = reduced penalty
Hidden explicitly = exclusion
```

**Potential Creator Interaction Signals**
* * *

| Signal | Business Meaning |
| ---| --- |
| Impression count | Feed saturation |
| Click-through rate | Creator interest |
| Hide rate | Negative interest |
| Application rate | Deal conversion |
| Return impressions | Re-engagement |
| Scroll depth | Feed quality |

##   

## Acceptance & Rejection Rates
* * *
Smoothed rates prevent low-sample distortion. A deal with 1 acceptance from 1 applicant should not rank equally to one with 100 from 100. Bayesian smoothing blends individual deal data with broader segment averages for fairer comparisons.

The feed may use smoothed acceptance/rejection rates.

**Acceptance Rate**
* * *
Potential formula:

```plain
(completed + planned + upcoming)
/
applicants
```

**Rejection Rate**
* * *
Potential formula:

```plain
rejected
/
applicants
```

**Bayesian Smoothing**
* * *
To avoid low-sample distortion:

```erlang
1 accepted / 1 applicant = 100%
```

The system may use:

```plain
smoothed_rate =
(successes + prior_rate * prior_weight)
/
(trials + prior_weight)
```

This allows:
*   Stable ranking
*   Fairer comparison
*   Reduced noise
*   Better marketplace quality

**Potential Segmentation**
* * *

| Prior Type | Example |
| ---| --- |
| Global | Entire platform |
| Country-based | Netherlands acceptance rate |
| Content-type-based | UGC acceptance rate |
| Partner-tier-based | Enterprise partner behavior |
| Category-based | Travel vs Food |

##   

## Potential Future Feed Features
* * *

| Feature | Business Value |
| ---| --- |
| AI-generated feeds | Fully personalized discovery |
| Semantic recommendations | Better relevance |
| Dynamic creator personas | Adaptive personalization |
| Trend detection | Real-time surfacing |
| Geo-intent prediction | Smarter local feeds |
| Partner fairness balancing | Marketplace health |
| Sponsored ranking | Monetization |
| Seasonal ranking | Campaign optimization |
| Time-of-day ranking | Contextual relevance |
| Social-proof ranking | Conversion optimization |