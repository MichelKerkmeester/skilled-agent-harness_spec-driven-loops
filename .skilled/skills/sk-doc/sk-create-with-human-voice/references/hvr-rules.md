---
title: Human Voice Rules (HVR) - Writing Standards Reference
description: Linguistic standards that eliminate detectable AI patterns and enforce natural human writing across all documentation.
trigger_phrases:
  - "hvr voice rules"
  - "human voice rules"
  - "ai writing tells"
  - "banned vocabulary list"
  - "natural writing standards"
importance_tier: important
contextType: general
version: 1.3.0.25
---

# Human Voice Rules (HVR) - Writing Standards Reference

Linguistic standards for all documentation output. These rules eliminate AI-detectable patterns and ensure every piece of writing reads as if a knowledgeable human wrote it.

---

## 1. OVERVIEW

### Purpose

AI-generated text carries tells: em dashes everywhere, three-item lists, hedging language, the same 20 overused words. Readers spot these patterns and trust drops. HVR defines what to aim for and what to avoid.

### Usage

Apply to all AI-generated documentation: READMEs, implementation summaries, decision records, install guides and spec folder docs.

A reply loads this file, and a document also loads the publish supplement, `hvr-publish-supplement.md`.

- Read the voice directives (Section 2) to understand the target voice
- Use word lists (Sections 6-8) as reference during writing
- Run the pre-publish checklist in `hvr-publish-supplement.md` before finalizing

---

## 2. VOICE DIRECTIVES

```yaml
voice_directives:
  active_voice:
    directive: "Use active voice. Subject before verb."
    wrong: "The meeting was cancelled by management."
    right: "Management cancelled the meeting."

  direct_address:
    directive: "Address the reader with 'you' and 'your'."
    wrong: "Users will find that the platform saves time."
    right: "You'll find the platform saves time."

  conciseness:
    directive: "Be direct. Cut fluff. Say it in fewer words."
    wrong: "It is important to note that the deadline is on Friday."
    right: "The deadline is Friday."

  simple_language:
    directive: "Use common words. If a simpler word exists, use it."
    wrong: "We need to facilitate the optimisation of our workflow processes."
    right: "We need to fix how we work."

  clarity:
    directive: "One idea per sentence when possible."
    wrong: "The platform, which was built last year by our engineering team who worked remotely, handles data processing and also does analytics while maintaining uptime."
    right: "The platform handles data processing and analytics. Our engineering team built it last year."

  conversational_tone:
    directive: "Write naturally. Read it aloud. If it sounds stiff, rewrite it."
    wrong: "One must consider the implications of such a decision."
    right: "Think about what this decision means."

  authenticity:
    directive: "Be honest. If something has problems, say so. No marketing spin."
    wrong: "Our revolutionary solution transforms every aspect of your workflow."
    right: "Our tool automates three manual steps in your invoicing process."

  practical_focus:
    directive: "Focus on actionable information. Back claims with data or examples."
    wrong: "Many companies have seen great success."
    right: "Acme Corp cut onboarding time from 3 weeks to 4 days."

  sentence_rhythm:
    directive: "Vary sentence lengths. Mix short (under 8 words) with medium (8-15) and long (15-25)."

  certainty:
    directive: "Prefer certainty when facts support it. Hedging weakens claims."
    wrong: "This approach might improve results."
    right: "This approach improves results."
    note: "Hedge only when genuine uncertainty exists."
```

The directives above state the target. Two tests and one exemplar decide whether a draft reaches it.

**Borrowability.** If any writer could have produced the sentence, it carries no sourcing. Rewrite it from what you actually observed. The failure it prevents: prose anyone could have written.

**Plain word.** When two words hold the same precision, keep the one with the concrete root. "Start" beats "commence". The failure it prevents: Latinate abstraction where a plain word holds the same precision.

**The exemplar.** One paragraph, written as this section prescribes:

```
We ran the migration at 2am. It finished in 9 minutes, not the 40 the old path needed. Two services stalled. The retry loop caught both. We migrated the remaining services the next morning.
```

---

## 3. PUNCTUATION STANDARDS

| Rule | Symbol | Action | Replace With |
|------|--------|--------|--------------|
| **Em Dash Ban** | — | NEVER use | Comma, full stop or colon |
| **Semicolon Ban** | ; | NEVER use | Two sentences, or a conjunction |
| **Oxford Comma Ban** | , and | NEVER use | Drop the comma before "and"/"or" |
| **Asterisk Emphasis** | * | NEVER in output | Natural word weight (OK in Markdown source) |
| **Ellipsis** | ... | Max 1 per piece | Trailing thought only, never dramatic pauses |
| **Quotation Marks** | " " | Straight quotes only | Never curly quotes (" ") |
| **Emoji** | 🎯 | Max 1 per piece | Must add clarity or tone, not decoration |

**Examples:**
```
Em dash:    WRONG: "The platform — built for speed — handles millions."
            RIGHT: "The platform, built for speed, handles millions."

Semicolon:  WRONG: "The data was clear; the market was shifting."
            RIGHT: "The data was clear. The market was shifting."

Oxford:     WRONG: "revenue, retention, and churn"
            RIGHT: "revenue, retention and churn"
```

---

## 4. AI STRUCTURAL PATTERNS TO AVOID

### "Not Just X, But Also Y" Ban

Never use this construction or variants: "not only X but Y", "it's not X, it's Y", "more than just X". Lead with the stronger point or use "and".

```
WRONG: "Not just a tool, but a complete platform."
RIGHT: "A complete platform."
```

### Tables In A Reply

Scoped to a conversational reply, never to a document. A document is returned to and
scanned, so a table earns its place there. A reply is read once, and a grid makes the
reader parse rows and columns to reach one fact that a sentence would have handed them.

Put one or two facts in a sentence. Put parallel items in a bulleted list. Reserve the
table for a file someone comes back to.

```
WRONG (in a reply):
| File | What changed |
|------|--------------|
| a.md | trimmed      |

RIGHT (in a reply):
Trimmed `a.md`.
```

### Literal Over Figurative

In a reply, replace an idiom the reader must decode with the plain statement. The failure it prevents: a reader decoding instead of reading.

```
WRONG: "We should circle back on the pricing next week."
RIGHT: "I will send you the pricing next week."
```

### Three-Item Enumeration Fix

AI defaults to exactly three items. Use 2, 4 or 5 instead. If you naturally have 3, cut one or add a fourth.

### Triple-Header Pattern Fix

AI tends to use exactly three H3 subsections under each H2 section. Vary the count. Use 2, 4 or 5 subsections based on actual content needs. If you genuinely have three subsections, verify each one carries its weight.

### Setup Language Removal

Cut these filler phrases that signal what's coming instead of stating it:

- "In conclusion" / "In summary"
- "It's worth noting" / "It's important to note"
- "Let's explore" / "Let's dive in" / "Let's take a look"
- "When it comes to" / "In the world of"
- "In today's [X]" / "At its core"
- "At the end of the day" / "Without further ado"
- "As we all know" / "It goes without saying"
- "First and foremost" / "Last but not least"
- "With that in mind" / "On that note" / "That said"
- "In simple terms" / "Simply put" / "Put simply"

### Analogy Overuse Fix

Analogies help readers grasp technical concepts. Overusing them is an AI tell.

| Rule | Limit | Example |
|------|-------|---------|
| **One analogy per concept** | 1 max | Do not stack "like a librarian" and "like a filing cabinet" for the same feature |
| **"Think of it as/like"** | 2 per document max | Third occurrence signals AI pattern |
| **Placement** | After the technical statement | State the fact first, then the analogy. Never lead with the analogy. |
| **Drop when unnecessary** | If plain language is clear | "The script validates inputs" needs no analogy |

### Nominalization And Stacked Compression

Turn the noun back into its verb, then cut the metaphor. The failure it prevents: abstract nouns hiding actions, metaphor piled on nominalization.

```
WRONG: "The implementation of the optimization delivers a bridge between the two systems."
RIGHT: "The optimization connects the two systems."
```

### Banned Metaphors

Replace with direct language:

| Banned | Use Instead |
|--------|-------------|
| "bridge the gap" | "connect" |
| "tip of the iceberg" | "one example" |
| "pave the way" | "enable" |
| "game-changer" | state the specific change |
| "move the needle" | state the specific metric |
| "low-hanging fruit" | "quick win" |
| "deep dive" | "detailed look" |
| "at the heart of" | "central to" |
| "a world where" | remove or rephrase |
| "raise the bar" | "improve" |
| "double-edged sword" | "trade-off" |
| "level the playing field" | "equalise access" |
| "perfect storm" | state the specific factors |
| "elephant in the room" | state the issue directly |
| "the bottom line" | state the conclusion |
| "food for thought" | remove entirely |
| "breath of fresh air" | state what's different |
| "light at the end of the tunnel" | state the positive outcome |

### Generalisation Fixes

Replace vague claims with specifics:

| Vague | Fix |
|-------|-----|
| "Many companies" | Name the company or give a number |
| "Studies show" | Name the study and year |
| "Experts agree" | Name the expert |
| "In recent years" | Give the specific year or date |
| "A growing number of" | State the number or percentage |
| "Research suggests" | Name the institution and year |
| "Industry leaders" | Name the companies or people |
| "Some people" | State who, or give a number |

### Unnecessary Modifiers

Cut these words. They add no meaning: very, really, truly, absolutely, incredibly, extremely, quite, rather, somewhat, fairly, just, actually, basically, literally, simply, obviously, clearly, certainly, definitely, undoubtedly, essentially.

### Copula Avoidance Ban

When "is" or "are" works, use it. Do not substitute elaborate constructions.

| Banned Substitute | Use Instead |
|-------------------|-------------|
| "serves as" | "is" |
| "stands as" | "is" |
| "functions as" | "is" |
| "acts as" | "is" (when not literal acting) |
| "boasts" | "has" |
| "features" | "has" or "includes" |
| "offers" | "has" or "provides" (when describing attributes) |

Acceptable when they add genuine meaning (e.g., "The firewall acts as a barrier").

### Synonym Cycling Fix

When referring to the same thing, use the same word. AI cycles through synonyms because of repetition penalties. If you write "the server" in one sentence, do not switch to "the system" and then "the platform" in the next two. Natural variation (e.g., a name and "she") is fine. The signal is 3+ different words for the same entity in one piece.

### False Ranges

Remove "from X to Y" constructions where the endpoints are not on a meaningful scale.

```
WRONG: "From startups to enterprises, everyone benefits."
RIGHT: "Startups and enterprises both benefit."

OK: "Temperatures range from -10C to 40C." (genuine measurable range)
```

### Generic Positive Conclusions

End with specifics, not sentiments. Never use these closers:

- "The future looks bright"
- "Exciting times lie ahead"
- "This represents a major step forward"
- "The possibilities are endless"
- "We look forward to what's next"
- "This is just the beginning"
- "The best is yet to come"

### Fragmented Headers

Remove generic sentences that restate the heading. Jump straight to substance.

```
WRONG:
### Error Handling
Error handling is an important part of any application.
[actual content follows]

RIGHT:
### Error Handling
The API returns structured JSON errors with HTTP status codes and machine-readable error types.
```

### Significance Inflation

State what happened without editorialising its importance. If something genuinely is a turning point, provide evidence instead of declaring it.

Banned phrases:
- "marks a pivotal moment in"
- "setting the stage for"
- "indelible mark"
- "is a testament to"
- "underscores the importance of"
- "reflects broader trends in"
- "represents a shift in"
- "shaping the future of"

### Output Warnings

Never include meta-commentary about the writing process. No disclaimers about tone. No references to these rules in output. No "I've kept this concise" or "I avoided jargon." No knowledge-cutoff disclaimers ("as of my last update", "based on available information"). No training-data hedging ("Up to my last training update").

---

## 5. VOICE PERSONALITY

This section binds writing you own. A projection or rewrite that carries someone else's message skips it, because a reaction the original never held is a fidelity defect.

Avoiding AI patterns is only half the job. Sterile, voiceless writing that follows every rule can still read as AI-generated. Clean writing needs personality.

### Have Opinions

React to facts. Do not just report them neutrally.

```
FLAT:   "The results were mixed."
VOICED: "The results surprised us. Half the metrics improved while the others dropped."
```

### Acknowledge Complexity

Express mixed feelings. Real people do not sort everything into neat categories. When something has trade-offs, say so instead of presenting a clean conclusion.

### Controlled Imperfection

Perfect structure feels algorithmic. Allow occasional tangents and asides when they add authenticity. This does not override conciseness or clarity. It means choosing natural flow over mechanical symmetry.

### Emotional Specificity

Name specific feelings and images, not abstract labels.

```
ABSTRACT: "The results were disappointing."
SPECIFIC: "We expected at least a 10% lift. We got 2%."
```

---

## 6. HARD BLOCKER WORDS

Never use these. Each occurrence is automatic failure.

**Core blockers:**
`delve`, `embark`, `realm`, `tapestry`, `illuminate`, `unveil`, `elucidate`, `abyss`, `revolutionise`, `game-changer`, `groundbreaking`, `cutting-edge`, `ever-evolving`, `shed light`, `dive deep`

**Extended blockers:**
`leverage` (use "use"), `foster` (use "support"), `nurture` (use "develop"), `resonate` (use "connect with"), `empower` (use "enable"), `disrupt` (use "change"), `curate` (use "select"), `harness` (use "use"), `elevate` (use "improve"), `robust` (use "strong"), `seamless` (use "smooth"), `holistic` (use "complete"), `synergy` (use "combined effect"), `unpack` (use "explain"), `landscape` (as industry noun), `ecosystem` (as metaphor), `journey` (as process metaphor), `paradigm` (use "model"), `enlightening` (use "helpful"), `esteemed` (use "respected"), `remarkable` (use "notable"), `skyrocket/skyrocketing` (use "increase"), `utilize/utilizing` (use "use/using")

**Context-dependent** (-5 when metaphorical, OK when literal):
`navigating` (blocked: challenges | OK: website), `landscape` (blocked: competitive | OK: photography), `unlock` (blocked: potential | OK: door), `ecosystem` (blocked: startup | OK: biological), `journey` (blocked: customer | OK: actual travel)

---

## 7. PHRASE HARD BLOCKERS

Never use any of these:

- "It's important to" / "It's worth noting"
- "It goes without saying" / "At the end of the day"
- "Moving forward" / "In today's world"
- "In today's digital landscape"
- "When it comes to" / "Dive into"
- "I'd love to" / "Navigating the [X]"
- "That being said" / "Having said that"
- "Let me be clear" / "The reality is"
- "Here's the thing" / "In a world where"
- "You're not alone"
- "The real question is" / "The truth is"
- "Here's what you need to know" / "What most people don't realise is"

---

## 8. SOFT DEDUCTIONS

### -2 Points Each

| Word | Note |
|------|------|
| craft/crafting | As verb for "create". OK as noun (craft beer). |
| pivotal | Use "important" or "key" |
| intricate | Use "complex" or "detailed" |
| testament | Use "proof" or "evidence" |
| disruptive | Use "new" or describe the change |
| transformative | Use "significant" or describe the effect |
| innovative | Use "new" or describe what's different |
| impactful | Use "effective" or "significant" |
| scalable | When used as buzzword. OK in genuine technical contexts. |
| actionable | When used as buzzword. OK in genuine instruction contexts. |
| strategic | When used as filler adjective. OK in genuine strategy contexts. |
| remains to be seen | Use "we don't know yet" |
| glimpse into | Use "look at" or "overview of" |
| you're not alone | AI comfort phrase. State the specific commonality. |
| discover | When hype. OK in factual discovery contexts. |

### -1 Point Each

**Hedging:** "I think", "I believe", "perhaps", "maybe", "might", "could potentially", "probably"

**Filler:** "actually", "basically", "essentially", "literally", "honestly", "frankly"

**Transitions** (penalty on 3rd+ use): "however", "furthermore", "moreover", "additionally", "consequently"

**Weak adjectives:** "nice", "good", "great", "amazing", "awesome", "incredible", "fantastic", "wonderful", "stark" (use "clear"), "powerful" (when filler)

**Vague verbs:** "get" (use specific: obtain, receive), "do" (use: complete, execute), "make" (use: build, create), "put" (use: place, position), "take" (use: accept, adopt, require), "opened up" (use: created, enabled)

**AI phrases:** "I'd be happy to", "Great question", "That's a great point", "I appreciate you sharing", "Let me help you with that", "imagine" (as setup), "exciting" (as AI enthusiasm)

**Buzzwords:** "synergise", "operationalise", "incentivise", "circle back", "move the needle", "low-hanging fruit", "boost" (as hype filler), "inquiries" (use "questions")

### Context Flags (not penalised, but check)

- **"it"** - Does it have a clear antecedent? Replace with specific noun if ambiguous.
- **"this"** - Always follow with a noun: "This decline" not just "This".
- **"things"/"stuff"** - Replace with specific noun.
- **"solution"** - Overused in B2B. Say what it is: platform, tool, service.
- **"excited"** - AI-typical enthusiasm. State the specific reason for interest instead.
