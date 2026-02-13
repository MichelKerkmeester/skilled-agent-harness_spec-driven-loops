# Audit Report: Pieter Bertram LinkedIn Ghostwriter System

> **Date:** 2026-02-10
> **Audited by:** Orchestrated analysis (4 parallel agents)
> **Scope:** 12 knowledge base files, 20 exported posts, full architecture
> **Total Findings:** 35 unique issues (8 Critical, 11 Medium, 7 Low, plus systemic post-level evidence)

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Critical Findings](#critical-findings)
3. [Medium Findings](#medium-findings)
4. [Low Findings](#low-findings)
5. [Post-Level Evidence](#post-level-evidence)
6. [Root Cause Analysis](#root-cause-analysis)
7. [Fix Priority Matrix](#fix-priority-matrix)

---

## System Overview

The system is a modular LinkedIn ghostwriter for Pieter Bertram (Founder/CEO of Barter) with:

- **AGENTS.md** as master entry point overriding AI defaults
- **12 knowledge base files** organized into system/, voice/, rules/, context/
- **Semantic routing** via commands ($personal, $leadership, $barter, $feature, $industry, $creator, $quick, $raw, $engagement, $optimize)
- **4 Energy Levels** (Raw/Quick/Standard/Deep) controlling validation rigor
- **4 Voice Modes** (Kitchen Table/Coffee Chat/Conference/Fireside) controlling tone
- **DEPTH Framework** (Discover/Engineer/Prototype/Test/Harmonize) for cognitive rigor
- **100-point scoring rubric** with 12 hard blockers and 5-question Pieter Test
- **20 exported posts** covering all voice modes and topic categories

**Assessment:** The voice and content quality are genuinely strong — Pieter's personality comes through convincingly. But the enforcement infrastructure has significant fractures.

---

## Critical Findings

### C-01: PRELOAD_GROUPS Routing Engine Is 73% Broken

**Severity:** Critical
**File:** System Prompt v0.130 (lines 340, 265-274, 374-392)

**Description:** `detect_mode()` returns keys like `leadership`, `barter`, `creator` — but `PRELOAD_GROUPS` expects different key names. The `linkedin_workflow()` builds a key as `f"{mode}_group"` to look up PRELOAD_GROUPS, but 8 of 11 modes don't match.

**Evidence:**

| Mode returned by detect_mode() | Key constructed | PRELOAD_GROUPS match? |
|---|---|---|
| `personal` | `personal_group` | YES |
| `leadership` | `leadership_group` | NO (key missing) |
| `barter` | `barter_group` | NO (key is `brand_group`) |
| `feature` | `feature_group` | NO (key missing) |
| `creator` | `creator_group` | NO (key missing) |
| `quick` | `quick_group` | NO (key is `creation_quick`) |
| `raw` | `raw_group` | NO (key is `creation_raw`) |
| `optimize` | `optimize_group` | NO (key is `optimization_group`) |
| `engagement` | `engagement_group` | YES |
| `industry` | `industry_group` | YES |
| `interactive` | `interactive_group` | NO (key missing) |

**Impact:** 8/11 modes silently fall through to `creation_standard` default. `$barter` loads generic creation docs instead of brand context. `$leadership` gets no personal context. The entire preload optimization layer is non-functional for most commands.

---

### C-02: Three Competing Pieter Tests

**Severity:** Critical
**Files:** System Prompt v0.130 (lines 574-578), Interactive Mode v0.121 (lines 587-594), DEPTH Framework v0.121 (lines 184-190)

**Description:** The "5-question Pieter Test" exists in 3 different versions. System Prompt and DEPTH Framework agree, but Interactive Mode defines completely different questions.

**Evidence:**

**System Prompt & DEPTH Framework version:**
1. **Groundedness** — From real experience?
2. **Authenticity** — Would Pieter say this?
3. **Contribution** — Adds value?
4. **Coffee** — Would spark conversation?
5. **Boldness** — Takes a real stance?

**Interactive Mode version:**
1. Does this sound conversational and approachable?
2. Is it genuine and founder-authentic, not corporate?
3. Does it feel experience-driven, not theoretical?
4. Is it personal without being performative?
5. Does it avoid generic startup/LinkedIn jargon?

**Impact:** A post could pass one version and fail another. Question 5 is particularly divergent: "Takes a real stance?" (boldness) vs "Avoids generic jargon" (style check). Bold content with some jargon passes canonical test but fails Interactive Mode's test.

---

### C-03: Perspective Minimums — 3 Files, 3 Different Numbers

**Severity:** Critical
**Files:** System Prompt v0.130 (lines 293-306), DEPTH Framework v0.121 (lines 118-129), Interactive Mode v0.121 (lines 47, 319)

**Description:** Three different perspective minimum requirements are stated, conflicting for Raw and Deep energy levels.

**Evidence:**

| Energy Level | System Prompt | DEPTH Framework | Interactive Mode |
|---|---|---|---|
| Raw | **0** | **1** | **3** |
| Quick | 2 | 2 | **3** |
| Standard | 3 | 3 | **3** |
| Deep | **5** | **4** | **3** |

**Impact:** For Raw mode, the system is told to do 0, 1, or 3 perspectives depending on which file controls. For Deep mode, 3, 4, or 5. This is a blocking gate.

---

### C-04: Hard Blocker "Split-Brain" — 3 Files, 3 Different Lists

**Severity:** Critical
**Files:** Voice DNA v0.122 (lines 186-221), Quality Validators v0.122 (lines 69-125, 299-339), Human Voice Extensions v0.100 (line 72)

**Description:** Three files independently maintain hard blocker lists that don't agree:

- **Voice DNA** labels ~30 terms as "HARD BLOCKERS — Automatic Rejection"
- **Quality Validators** (the actual scorer) only formally blocks ~17 of these
- **Human Voice Extensions** adds "nurture" and "resonate" as hard blockers that QV doesn't know about

**Evidence of gap — terms Voice DNA calls "hard blocker" but QV only soft-deducts or ignores:**
- "crushing it" → QV: -2 deduction (not hard blocker)
- "game-changer" → QV: -1 deduction (not hard blocker)
- "synergy" → QV: -1 deduction (not hard blocker)
- "hustle", "grind", "10X", "let me tell you", "you won't believe" → Not in QV at all
- "nurture", "resonate" → In HVE as hard blockers, absent from QV entirely

**Impact:** A post containing "Hustle culture is real" passes QV validation (no blocker triggered) but violates Voice DNA (hard blocker — automatic rejection). The scoring system cannot enforce the voice rules it depends on.

---

### C-05: HVE Precedence Paradox — Override Rule Downgrades Hard Blockers

**Severity:** Critical
**Files:** Human Voice Extensions v0.100 (lines 7, 44-51) vs Quality Validators v0.122 (lines 121-124)

**Description:** HVE declares "Pieter-specific rules take precedence where conflicts exist." But HVE lists "It's worth noting" and "It's important to note" as -1 penalties, while QV lists them as Hard Blocker 12 (score = 0, immediate rejection).

**Evidence:**

QV lines 121-123:
> `blocker_12_setup_language: pattern: "In conclusion", "In summary", "To summarize", "As mentioned", "It's worth noting", "It's important to note"`

HVE lines 44-51:
> `pieter_setup_language: banned: ["It's worth noting", "It's important to note"] penalty: "-1 per occurrence"`

HVE line 7:
> `Pieter-specific rules take precedence where conflicts exist.`

**Impact:** If HVE takes precedence, a hard blocker gets downgraded to a -1 deduction. The severity enforcement is inverted.

---

### C-06: "leverage" Is Both Hard Blocker AND Soft Deduction in Same File

**Severity:** Critical
**File:** Quality Validators v0.122 (line 112 vs line 306)

**Description:** Within QV itself, "leverage" appears as Hard Blocker 10 (score = 0, immediate rejection) AND as a Warning Flag (-1 deduction). These are mutually exclusive outcomes.

**Evidence:**
- QV line 112 (Hard Blocker 10): `"...leverage"` in blocker list
- QV line 306 (Warning Flags): `"leverage" (as verb) | -1 | Corporate jargon | "use" or "apply"`

**Impact:** Ambiguous enforcement. An LLM following these rules must choose one interpretation and will do so inconsistently across sessions.

---

### C-07: Two Undefined State Machine States

**Severity:** Critical
**File:** Interactive Mode v0.121 (lines 281-282)

**Description:** The state machine routes `$engagement` to `engagement_routing` and `$optimize` to `optimize_routing`, but neither state is defined.

**Evidence:**
```yaml
states:
  start:
    routes:
      $engagement: engagement_routing   # UNDEFINED
      $optimize: optimize_routing       # UNDEFINED
```

**Impact:** These commands hit undefined states with no actions, transitions, or nextState. The AI must improvise behavior.

---

### C-08: $feature Fallback Loads Wrong Context

**Severity:** Critical
**File:** System Prompt v0.130 (line 253 vs lines 113-115)

**Description:** $feature posts are about OTHER startups/founders. But the fallback chain loads `Context - Personal` (Pieter's bio) instead of `Context - Industry`.

**Evidence:**
- Fallback chain line 253: `"feature": ["Context - Personal", "Voice DNA"]`
- Section 3.1 line 113-114: `SYMPATHETIC PATH ("feature") → Load: Voice DNA + Quality + Standards + Context Industry + DEPTH`

**Impact:** When confidence is MEDIUM, a feature post gets Pieter's biographical information when it needs ecosystem/startup context.

---

## Medium Findings

### M-01: "founder" Keyword Routing Collision
**Files:** System Prompt v0.130 (lines 380, 164-170)
"founder" triggers `$feature` mode (for OTHER startups) but is also a synonym for `personal_journey`. A request like "Write about my founder journey" gets routed to feature mode. `detect_mode()` uses first-match, so `$feature` wins.

### M-02: AGENTS.md Narrows $raw Exception
**Files:** AGENTS.md (line 151) vs System Prompt (line 64) vs Interactive Mode (line 35)
AGENTS.md (highest authority) excludes only `$quick` from "never self-answer." System Prompt and Interactive Mode exclude both `$quick` AND `$raw`. This means `$raw` must wait for user input (per AGENTS.md) while simultaneously being designed to skip all questions.

### M-03: Two Competing Cognitive Frameworks
**Files:** AGENTS.md (lines 39-60) vs DEPTH Framework (entire file)
AGENTS.md defines a "Sequential Thinking Protocol" (5 stages with MCP tools). DEPTH defines a different 5-phase methodology. No arbitration rule exists.

### M-04: Cross-Reference Points to Wrong Section
**File:** Interactive Mode v0.121 (lines 40, 749)
References "Section 4 'Command Shortcuts'" in System Prompt, but Section 4 is Validation Flow. Commands are in Section 3.

### M-05: Arrow Count Maximum Differs
**Files:** Content Standards v0.122 (line 28) vs Voice DNA v0.122 (line 311)
CS: "2-4 item contrasts" vs DNA: "2-5 key insights." A post with 5 arrows is valid per DNA but violates CS.

### M-06: Hashtag Minimum Differs
**Files:** Content Standards v0.122 (line 25) vs Quality Validators v0.122 (line 172)
CS: "2-5 at end" vs QV scoring: "3-5 hashtags." Posts with 2 hashtags are valid per CS but penalized by QV.

### M-07: Banned Emoji Lists Don't Match
**Files:** Content Standards, Quality Validators, Voice DNA
CS bans 4 emoji. QV bans 5. DNA bans 7. Only caught by Voice DNA, not the scoring system.

### M-08: Quick Energy CTA Rule Conflicts
**Files:** Content Standards (line 165) vs Quality Validators (line 253)
CS: "CTA: Optional" vs QV: "CTA Required: No." "Optional" != "No" — an LLM may remove fitting CTAs.

### M-09: HVE -5 Phrase Blockers Invisible to QV
**Files:** Human Voice Extensions v0.100 (lines 59-65) vs Quality Validators
"I'd love to", "Navigating the [X]", "Dive into", "In today's world" carry -5 each but QV doesn't track them. A post with "I'd love to dive into" gets -10 from HVE but 0 from QV.

### M-10: HVE "It's not X, it's Y" Pattern Ban Unenforced
**Files:** Human Voice Extensions v0.100 (lines 35-36) vs Quality Validators
Structural pattern banned in HVE with no enforcement mechanism in QV scoring.

### M-11: Filename Mismatch in References
**File:** System Prompt v0.130 (lines 132-145, 247-273)
Routing references "Context - Brand" and "Context - Industry" but actual files are "Context - Brand Extensions" and "Context - Industry Extensions."

---

## Low Findings

| ID | Issue | File |
|----|-------|------|
| L-01 | Dead code: `processing` state defines Raw energy path that's never reached (raw_delivery skips to delivery) | Interactive Mode |
| L-02 | `complete` state has `reset: true` but no target state defined | Interactive Mode |
| L-03 | Stale HTML comment references non-existent "Canonical Stats Registry" file | System Prompt |
| L-04 | DEPTH references "8 personality traits" 6 times without defining them (implicit Voice DNA dependency) | DEPTH Framework |
| L-05 | Engagement rules don't reference Voice Modes — comments may sound different from posts | Engagement |
| L-06 | QV word count range (100-300) doesn't fit Quick (50-100) or Repost (40-80) types | QV vs CS |
| L-07 | 6 topic categories don't map 1:1 to 6 templates (leadership + creator have no template; D + E have no category) | DEPTH vs CS |

---

## Post-Level Evidence

The 20 exported posts were audited against the rules. **17 of 20 posts (85%) have issues:**

### The 3-Item List Epidemic (Systemic — 80% of Posts)

**16 of 20 posts** contain exactly 3-item constructions — the single most detectable AI pattern. The rules explicitly ban this ("Use 2, 4 or 5 items instead"), yet the validation system doesn't check for it.

| Post | Evidence |
|------|----------|
| #001 | "hiring, leading through uncertainty, making decisions with incomplete information" |
| #003 | 3 arrows: -> 12,000+ creators... -> 1,000+ brands... -> 94% content delivery rate |
| #005 | "You see the decisions. You see the focus. You see what they said no to." |
| #006 | "Timing. Market conditions. Luck." AND 3 quoted startup maxims |
| #007 | 3 arrows: -> Same output -> Better mornings -> People actually disconnected |
| #008 | "Values fit first. Skills second. Speed last." |
| #009 | "History. Psychology. Fiction." |
| #012 | 3 arrows: -> Values alignment... -> Working style... -> Perspective... |
| #013 | 3 arrows: -> Long-term... -> Creative control... -> Brand alignment... |
| #014 | "Listened. Rebuilt. Shipped again." |
| #015 | "Maybe it's a newsletter... Maybe it's a course... Maybe it's consulting..." AND 2 more triple constructions |
| #016 | "The friendships... The hobbies... The version..." |
| #019 | "The relief. The pride. The 'finally' energy." |
| #020 | "Updates. Blockers. Next steps." |

**Only posts #002, #010, #017, and #011 are free of this pattern.**

### Invalid Energy Levels (3 Posts)

Posts #016 (`Reflective`), #018 (`Authoritative`), #019 (`Casual`) use energy levels that don't exist. Valid values: Raw/Quick/Standard/Deep. The system accepts non-canonical values without rejection.

### Banned Hooks Used Without Penalty (2 Posts)

| Post | Hook Used | Rule |
|------|-----------|------|
| #006 | "Unpopular opinion:" | Hooks to Avoid: "Usually popular opinions" |
| #009 | "Hot take:" | Hooks to Avoid: "Performative" |

Neither score reflects any deduction.

### Banned Structural Pattern (1 Post)

Post #007: "It's not about working less. It's about protecting the recovery..." — HVE Sec. 2 bans "It's not X, it's Y" pattern. Score of 85 reflects no penalty.

### Hard Blocker / Global Rule Contradiction (1 Post)

Post #018 uses "influencer" twice while discussing the old way of influencer marketing. Hard Blocker 1 says immediate rejection. Global Rule 1 says "replace with Creator unless discussing the old way." Rules directly contradict.

### Score Inflation (~30% of Posts)

| Post | Score Given | Estimated Correct | Delta | Missed Deductions |
|------|-------------|-------------------|-------|-------------------|
| #015 | 94 | ~88-90 | -4 to -6 | "optimise" (-2) + 3-item patterns (-3) |
| #012 | 92 | ~89 | -3 | "optimise" (-2) + 3-item arrows (-1) |
| #006 | 88 | ~84-85 | -3 to -4 | Banned hook + 3-item patterns |
| #007 | 85 | ~83 | -2 | Banned structural pattern + 3-item arrows |

### What the Validation System DOES Catch

To be fair, the system successfully prevents:
- Hard blocker AI vocabulary (delve, embark, realm, etc.) — 0 violations
- Engagement bait — 0 violations
- Currency format — EUR used correctly throughout
- External links in body — 0 violations
- Emoji compliance — all posts use 0-1 approved emoji
- Hashtag placement — all at end
- Paragraph length — all short paragraphs

### What the Validation System DOES NOT Catch

| Blind Spot | Frequency | Severity |
|------------|-----------|----------|
| 3-item lists (top AI signal) | 80% of posts | High |
| Banned hooks | 10% of posts | High |
| Invalid energy levels | 15% of posts | High |
| HVE structural patterns | 5% of posts | Medium |
| AI vocabulary deductions | 10% of posts | Medium |
| Score accuracy | ~30% inflated | Medium |
| Influencer contradiction | Systemic | High |

---

## Root Cause Analysis

Three systemic root causes explain most findings:

### Root Cause A: "Split-Brain Validation"
Voice DNA, Quality Validators, and Human Voice Extensions each maintain **independent** hard blocker lists that were never synchronized. QV (the actual scorer) has an incomplete view of what should trigger rejection.
-> **Affects:** C-04, C-05, C-06, M-09, M-10, and all post-level rule slippage

### Root Cause B: "Routing Engine Drift"
PRELOAD_GROUPS keys don't match detect_mode() output. Section references point to wrong sections. Filenames referenced don't match actual filenames on disk.
-> **Affects:** C-01, C-08, M-01, M-04, M-11

### Root Cause C: "Triple-Definition Problem"
Key concepts (Pieter Test, perspective minimums, energy levels, banned terms) are defined in 3 different files with 3 different values. No single source of truth.
-> **Affects:** C-02, C-03, M-02, M-05, M-06, M-07, M-08

---

## Fix Priority Matrix

| Priority | Fix | Findings Resolved | Effort |
|----------|-----|-------------------|--------|
| **P0** | Canonicalize hard blockers in ONE file (QV) | C-04, C-05, C-06, M-09, M-10 | Medium |
| **P0** | Fix PRELOAD_GROUPS keys to match detect_mode() | C-01 | Low |
| **P1** | Canonicalize Pieter Test — one version, one file | C-02 | Low |
| **P1** | Canonicalize perspective minimums — one table | C-03 | Low |
| **P1** | Add 3-item list detection to QV scoring | Post epidemic | Low |
| **P2** | Define missing states ($engagement, $optimize) | C-07 | Low |
| **P2** | Resolve "influencer" contradiction | Post #018 conflict | Low |
| **P2** | Fix HVE precedence rule (extend only, never downgrade) | C-05 | Low |
| **P2** | Fix $feature fallback chain | C-08 | Low |
| **P2** | Synchronize formatting constraints | M-05, M-06, M-07, M-08 | Medium |
| **P3** | Fix filename/section references | M-04, M-11 | Low |
| **P3** | Fix "founder" keyword collision | M-01 | Low |
| **P3** | Resolve competing cognitive frameworks | M-03 | Medium |
| **P3** | Fill CORINA questionnaire | Strategic gap | High |
