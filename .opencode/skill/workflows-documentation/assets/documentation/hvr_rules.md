---
title: Human Voice Rules (HVR) - Writing Standards Reference
description: Linguistic standards that eliminate detectable AI patterns and enforce natural human writing across all documentation.
---

# Human Voice Rules (HVR) - Writing Standards Reference

Linguistic standards for all documentation output. These rules eliminate AI-detectable patterns and ensure every piece of writing reads as if a knowledgeable human wrote it.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

AI-generated text carries tells: em dashes everywhere, three-item lists, hedging language, the same 20 overused words. Readers spot these patterns quickly and trust drops. HVR defines what to aim for and what to avoid so that documentation sounds like a person wrote it.

### Usage

These rules apply to all AI-generated documentation: READMEs, implementation summaries, decision records, install guides and spec folder docs. Domain-specific content systems may extend these rules with additional constraints.

**How to apply HVR:**
- Read the voice directives first (Section 2) to understand the target voice
- Use the punctuation standards (Section 3) and word lists (Sections 6-11) as a reference during writing
- Run the pre-publish checklist (Section 12) before finalizing any document
- Templates that reference HVR include voice guide comments pointing to specific sections

**Scoring:** Hard blocker violations cost -5 points each. Soft deductions cost -2 or -1 per occurrence. A clean document starts at 100 and loses points for each violation found.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:voice-directives -->
## 2. VOICE DIRECTIVES

These directives define the target voice. They establish what to aim for before the remaining sections define what to avoid.

### 2.1 Voice Principles

```yaml
voice_directives:
  active_voice:
    directive: "Use active voice. Put the subject before the verb."
    examples:
      - wrong: "The meeting was cancelled by management."
        right: "Management cancelled the meeting."

  direct_address:
    directive: "Address the reader directly using 'you' and 'your'."
    examples:
      - wrong: "Users will find that the platform saves time."
        right: "You'll find the platform saves time."

  conciseness:
    directive: "Be direct. Cut fluff. Say it in fewer words."
    examples:
      - wrong: "It is important to note that the deadline is on Friday."
        right: "The deadline is Friday."

  simple_language:
    directive: "Use common words. If a simpler word exists, use it."
    examples:
      - wrong: "We need to facilitate the optimisation of our workflow processes."
        right: "We need to fix how we work."

  clarity:
    directive: "Focus on clarity. One idea per sentence when possible."
    examples:
      - wrong: "The platform, which was built last year by our engineering team who worked remotely, handles data processing and also does analytics while maintaining uptime."
        right: "The platform handles data processing and analytics. Our engineering team built it last year."

  conversational_tone:
    directive: "Write naturally. Read it aloud. If it sounds stiff, rewrite it."
    examples:
      - wrong: "One must consider the implications of such a decision."
        right: "Think about what this decision means."

  authenticity:
    directive: "Be honest. If something has problems, say so. No marketing spin."
    examples:
      - wrong: "Our revolutionary solution transforms every aspect of your workflow."
        right: "Our tool automates three manual steps in your invoicing process."

  practical_focus:
    directive: "Focus on practical, actionable information. Back claims with data or examples."
    examples:
      - wrong: "Many companies have seen great success."
        right: "Acme Corp cut onboarding time from 3 weeks to 4 days."

  sentence_rhythm:
    directive: "Vary sentence lengths to create rhythm."
    guidance:
      - "Mix short sentences (under 8 words) with medium (8-15) and long (15-25)"
      - "Use a short sentence after a complex idea for impact"
      - "Read your text aloud. If it sounds monotonous, vary the lengths"
    examples:
      - monotonous: "The platform processes data efficiently. The platform handles millions of requests daily. The platform scales automatically when needed."
        improved: "The platform processes data efficiently. Millions of requests daily. It scales when load increases, without manual intervention."
```

### 2.2 Certainty Principle

Prefer direct, certain language when the facts support it. Hedging weakens claims and is a common AI writing pattern.

```yaml
certainty_principle:
  directive: "Prefer certainty when facts support it"
  rationale: "Hedging weakens claims. When you know something is true, state it directly."
  examples:
    - hedging: "This approach might improve results."
      direct: "This approach improves results."
    - hedging: "Users could potentially save time."
      direct: "Users save an average of 2 hours per week."
    - acceptable_hedge: "Early data suggests a 15% improvement, pending final results."
  note: "Hedging is acceptable when genuine uncertainty exists. The rule targets unnecessary hedging, not honest uncertainty."
```

---

<!-- /ANCHOR:voice-directives -->
<!-- ANCHOR:punctuation-standards -->
## 3. PUNCTUATION STANDARDS

All documentation must follow these punctuation rules without exception. Violations are automatic deductions.

### 3.1 Em Dash Ban

Never use em dashes. Replace with commas, full stops or colons depending on context.

```yaml
em_dash_rule:
  symbol: "—"
  action: "NEVER use"
  replacements:
    - comma
    - full stop
    - colon
  examples:
    - wrong: "The platform — built for speed — handles millions of requests."
      right: "The platform, built for speed, handles millions of requests."
    - wrong: "One thing mattered — accuracy."
      right: "One thing mattered: accuracy."
```

### 3.2 Semicolon Ban

Never use semicolons. Split into two sentences or restructure using a conjunction.

```yaml
semicolon_rule:
  symbol: ";"
  action: "NEVER use"
  replacements:
    - "Split into two sentences"
    - "Use a conjunction (and, but, so)"
  examples:
    - wrong: "The data was clear; the market was shifting."
      right: "The data was clear. The market was shifting."
    - wrong: "Revenue grew 40%; costs dropped 15%."
      right: "Revenue grew 40% and costs dropped 15%."
```

### 3.3 Oxford Comma Ban

Never use the Oxford comma (the comma before "and" or "or" in a list of three or more items).

```yaml
oxford_comma_rule:
  action: "NEVER use"
  examples:
    - wrong: "We build tools for marketers, founders, and investors."
      right: "We build tools for marketers, founders and investors."
    - wrong: "The report covers revenue, retention, and churn."
      right: "The report covers revenue, retention and churn."
```

### 3.4 Asterisk Emphasis Ban

Never use asterisks for bold or emphasis in output content. Use the natural weight of the words instead. Asterisks are acceptable in Markdown source files for formatting purposes where rendering is expected.

```yaml
asterisk_rule:
  symbol: "*"
  action: "NEVER use for emphasis in output"
  note: "Acceptable in Markdown source files for structural formatting only"
  examples:
    - wrong: "This is *critically* important."
      right: "This is critically important."
    - wrong: "We saw **massive** growth."
      right: "We saw significant growth."
```

### 3.5 Ellipsis Usage

Limit ellipsis (...) to a maximum of one per piece. Use only for trailing thought, never for dramatic pauses or lazy transitions.

```yaml
ellipsis_rule:
  max_per_piece: 1
  allowed_use: "Trailing thought only"
  banned_use:
    - "Dramatic pauses"
    - "Lazy transitions between ideas"
    - "Indicating omission in output"
  examples:
    - wrong: "The results were... surprising... and frankly... alarming."
      right: "The results were surprising. And frankly alarming."
    - acceptable: "We kept wondering if there was a better way..."
```

---

<!-- /ANCHOR:punctuation-standards -->
<!-- ANCHOR:ai-structural-patterns -->
## 4. AI STRUCTURAL PATTERNS TO AVOID

AI models produce predictable structural patterns. Detecting and eliminating these patterns is essential to producing human-quality documentation.

### 4.1 "Not Just X, But Also Y" Ban

Never use the "not just X, but also Y" construction or any of its variants. This is one of the most recognisable AI writing patterns.

```yaml
not_just_x_but_y:
  action: "NEVER use"
  banned_variants:
    - "Not just X, but also Y"
    - "Not just X, but Y"
    - "Not only X but Y"
    - "Not only X, but also Y"
    - "It's not X, it's Y"
    - "It's not just X, it's Y"
    - "It isn't just X, it's Y"
    - "More than just X"
  replacements:
    - "State X. State Y as a separate sentence."
    - "Use 'and' to combine."
    - "Lead with the stronger point."
  examples:
    - wrong: "Not just a tool, but a complete platform."
      right: "A complete platform."
    - wrong: "It's not only fast, but also reliable."
      right: "It's fast and reliable."
    - wrong: "More than just analytics."
      right: "Full analytics with forecasting built in."
```

### 4.2 Three-Item Enumeration Fix

AI defaults to lists of exactly three items. Vary enumerations to 2, 4 or 5 items to break this pattern.

```yaml
enumeration_rule:
  banned: "Exactly 3 items in a list"
  allowed: [2, 4, 5]
  note: "If you naturally have 3 items, either cut one or add a fourth."
  examples:
    - wrong: "Speed, accuracy and reliability."
      right: "Speed and accuracy."
      also_right: "Speed, accuracy, reliability and uptime."
```

### 4.3 Setup Language Removal

Remove filler phrases that signal what is coming next rather than stating it directly.

```yaml
banned_setup_phrases:
  - "In conclusion"
  - "In summary"
  - "It's worth noting"
  - "It's important to note"
  - "Let's explore"
  - "Let's dive in"
  - "Let's take a look"
  - "When it comes to"
  - "In the world of"
  - "In today's [X]"
  - "At its core"
  - "At the end of the day"
  - "Without further ado"
  - "As we all know"
  - "It goes without saying"
  - "First and foremost"
  - "Last but not least"
  - "With that in mind"
  - "On that note"
  - "That said"
```

---

<!-- /ANCHOR:ai-structural-patterns -->
<!-- ANCHOR:content-pattern-detection -->
## 5. CONTENT PATTERN DETECTION

### 5.1 Banned Metaphors and Cliches

These metaphors are overused in AI-generated content. Replace with direct, specific language.

```yaml
banned_metaphors:
  - "bridge the gap"             -> "connect"
  - "tip of the iceberg"         -> "one example"
  - "pave the way"               -> "enable" or "make possible"
  - "a world where"              -> remove or rephrase directly
  - "the landscape of"           -> remove or use specific noun
  - "at the heart of"            -> "central to" or state directly
  - "double-edged sword"         -> "trade-off" or "has downsides"
  - "game-changer"               -> state the specific change
  - "move the needle"            -> state the specific metric improvement
  - "low-hanging fruit"          -> "quick win" or state the specific action
  - "think outside the box"      -> remove entirely
  - "raise the bar"              -> "improve" or "set a higher standard"
  - "level the playing field"    -> "equalise access" or state the change
  - "a perfect storm"            -> state the specific factors
  - "the elephant in the room"   -> state the issue directly
  - "a deep dive"                -> "a detailed look" or "a thorough analysis"
  - "the bottom line"            -> state the conclusion directly
  - "food for thought"           -> remove entirely
  - "a breath of fresh air"      -> state what is different or better
  - "light at the end of the tunnel" -> state the specific positive outcome
```

### 5.2 Generalisation Fixes

Replace vague generalisations with specific, verifiable claims.

```yaml
generalisation_fixes:
  - vague: "Many companies"
    specific: "[Name company or number]"
  - vague: "Studies show"
    specific: "[Name the study, year]"
  - vague: "Experts agree"
    specific: "[Name the expert]"
  - vague: "In recent years"
    specific: "[Specific year or timeframe]"
  - vague: "A growing number of"
    specific: "[State the number or percentage]"
  - vague: "Research suggests"
    specific: "[Name the research, institution, year]"
  - vague: "Industry leaders"
    specific: "[Name the companies or people]"
  - vague: "Across industries"
    specific: "[Name the industries]"
  - vague: "Time and again"
    specific: "[State when and how often]"
  - vague: "Some people"
    specific: "[State who specifically or give a number]"
```

### 5.3 Unnecessary Modifiers

Cut these words. They add no meaning and weaken the sentence.

```yaml
unnecessary_modifiers:
  cut_always:
    - very
    - really
    - truly
    - absolutely
    - incredibly
    - extremely
    - quite
    - rather
    - somewhat
    - fairly
    - just
    - actually
    - basically
    - literally
    - simply
    - obviously
    - clearly
    - certainly
    - definitely
    - undoubtedly
    - essentially
  examples:
    - wrong: "This is a very important update."
      right: "This is an important update."
    - wrong: "The results were truly significant."
      right: "The results were significant."
    - wrong: "It's basically a CRM."
      right: "It's a CRM."
    - wrong: "We literally doubled revenue."
      right: "We doubled revenue."
```

### 5.4 Output Warnings

```yaml
output_warnings:
  - "Do not include meta-commentary about the writing process in output."
  - "Do not add disclaimers or notes about tone choices."
  - "Do not reference these rules in output."
  - "Do not explain why a word was avoided or replaced."
  - "Do not include phrases like 'I've kept this concise' or 'I avoided jargon'."
```

---

<!-- /ANCHOR:content-pattern-detection -->
<!-- ANCHOR:hard-blocker-words -->
## 6. HARD BLOCKER WORDS (-5 POINTS EACH)

These words trigger automatic failure. Never use them under any circumstances (except where noted in Section 8 for context-dependent blockers).

```yaml
hard_blockers:
  core_15:
    - delve            # use "look at" or "examine"
    - embark           # use "start" or "begin"
    - realm            # use "area" or "field"
    - tapestry         # use "mix" or "combination"
    - illuminate       # use "explain" or "clarify"
    - unveil           # use "reveal" or "announce"
    - elucidate        # use "explain" or "clarify"
    - abyss            # remove or use "gap"
    - revolutionise    # use "change" or "transform"
    - game-changer     # state the specific change
    - groundbreaking   # use "new" or "first"
    - cutting-edge     # use "latest" or "advanced"
    - ever-evolving    # use "changing" or remove
    - shed light       # use "explain" or "show"
    - dive deep        # use "examine" or "look closely at"

  extended:
    - leverage       # use "use" instead
    - foster         # use "support" or "encourage" instead
    - nurture        # use "develop" or "grow" instead
    - resonate       # use "connect with" or "matter to" instead
    - empower        # use "enable" or "give [specific ability]" instead
    - disrupt        # use "change" or state the specific change
    - curate         # use "select" or "choose" instead
    - harness        # use "use" instead
    - elevate        # use "improve" or "raise" instead
    - robust         # use "strong" or "reliable" instead
    - seamless       # use "smooth" or describe the experience
    - holistic       # use "complete" or "whole" instead
    - synergy        # use "combined effect" or state what works together
    - unpack         # use "explain" or "break down" instead
    - landscape      # as noun for "field/industry"
    - ecosystem      # as metaphor
    - journey        # as metaphor for process
    - paradigm       # use "model" or "approach" instead
    - enlightening   # use "helpful" or "informative" instead
    - esteemed       # use "respected" or remove
    - remarkable     # use "notable" or state the specific quality
    - skyrocket      # use "increase" or "grow" + specific number
    - skyrocketing   # use "increasing" or "growing" + specific number
    - utilize        # use "use" instead
    - utilizing      # use "using" instead
```

<!-- /ANCHOR:hard-blocker-words -->
<!-- ANCHOR:phrase-hard-blockers -->
## 7. PHRASE HARD BLOCKERS (-5 POINTS EACH)

These phrases trigger automatic failure. Never use them.

```yaml
phrase_blockers:
  - "It's important to"
  - "It's worth noting"
  - "It goes without saying"
  - "At the end of the day"
  - "Moving forward"
  - "In today's world"
  - "In today's digital landscape"
  - "When it comes to"
  - "Dive into"
  - "I'd love to"
  - "Navigating the [X]"
  - "That being said"
  - "Having said that"
  - "Let me be clear"
  - "The reality is"
  - "Here's the thing"
  - "In a world where"
  - "You're not alone"
```

<!-- /ANCHOR:phrase-hard-blockers -->
<!-- ANCHOR:context-dependent-blockers -->
## 8. CONTEXT-DEPENDENT BLOCKERS

Words that are blocked in most contexts but may be acceptable in specific technical or literal usage.

```yaml
context_dependent:  # -5 when metaphorical, OK when literal
  - "navigating"     # blocked: challenges, market | allowed: website, GPS
  - "landscape"      # blocked: marketing, competitive | allowed: photography, orientation
  - "unlock"         # blocked: potential, growth | allowed: door, phone
  - "ecosystem"      # blocked: startup, partner | allowed: biological, environmental
  - "journey"        # blocked: customer, learning | allowed: London to Edinburgh
  - "deep dive"      # blocked: into analytics | allowed: scuba context
```

---

<!-- /ANCHOR:context-dependent-blockers -->
<!-- ANCHOR:soft-deductions-2-points -->
## 9. SOFT DEDUCTIONS (-2 POINTS EACH)

These words are not hard blockers but carry a -2 point penalty per occurrence. Use sparingly or replace.

```yaml
soft_deductions_minus_2:
  - word: "craft / crafting"
    note: "As verb for 'create' (any tense). Acceptable as noun (craft beer)."
  - word: "journey"
    note: "When not hard-blocked by context rules."
  - word: "pivotal"
    note: "Use 'important' or 'key' instead."
  - word: "intricate"
    note: "Use 'complex' or 'detailed' instead."
  - word: "testament"
    note: "Use 'proof' or 'evidence' instead."
  - word: "disruptive"
    note: "Use 'new' or describe the specific change."
  - word: "transformative"
    note: "Use 'significant' or describe the specific effect."
  - word: "innovative"
    note: "Use 'new' or describe what is different."
  - word: "strategic"
    note: "When used as filler adjective. Acceptable in genuine strategy contexts."
  - word: "impactful"
    note: "Use 'effective' or 'significant' instead."
  - word: "scalable"
    note: "When used as buzzword. Acceptable in genuine technical contexts."
  - word: "actionable"
    note: "When used as buzzword. Acceptable in genuine instruction contexts."
  - word: "discover"
    note: "When used as hype ('discover our new...'). Acceptable in factual discovery contexts."
  - word: "remains to be seen"
    note: "Classic AI hedging phrase. Use 'we don't know yet' or state the uncertainty directly."
  - word: "glimpse into"
    note: "AI-typical phrasing. Use 'look at' or 'overview of' instead."
  - word: "you're not alone"
    note: "AI comfort phrase. State the specific commonality instead."
```

<!-- /ANCHOR:soft-deductions-2-points -->
<!-- ANCHOR:soft-deductions-1-point -->
## 10. SOFT DEDUCTIONS (-1 POINT EACH)

These carry a -1 point penalty per occurrence. Some are acceptable in small quantities but flag overuse.

```yaml
soft_deductions_minus_1:
  hedging:
    - "I think"
    - "I believe"
    - "perhaps"
    - "maybe"
    - "might"
    - "could potentially"
    - "probably"

  filler_words:
    - "actually"
    - "basically"
    - "essentially"
    - "literally"
    - "honestly"
    - "frankly"

  unnecessary_transitions:
    - word: "however"
      note: "Max 2 per piece. Penalty applies to 3rd+ occurrence."
    - "furthermore"
    - "moreover"
    - "additionally"
    - "consequently"

  weak_adjectives:
    - "nice"
    - "good"
    - "great"
    - "amazing"
    - "awesome"
    - "incredible"
    - "fantastic"
    - "wonderful"
    - word: "stark"
      note: "Use 'clear' or 'sharp' instead."
    - word: "powerful"
      note: "When used as filler adjective. Use 'effective' or state specific capability."

  vague_verbs:
    - word: "get"
      note: "Replace with specific verb (obtain, receive, achieve)."
    - word: "do"
      note: "Replace with specific verb (complete, execute, perform)."
    - word: "make"
      note: "When a specific verb exists (build, create, produce)."
    - word: "put"
      note: "Replace with specific verb (place, position, invest)."
    - word: "take"
      note: "Replace with specific verb (accept, adopt, require)."
    - word: "opened up"
      note: "Use specific verb: 'created', 'enabled', 'started'."

  ai_phrases:
    - "I'd be happy to"
    - "Great question"
    - "That's a great point"
    - "I appreciate you sharing"
    - "Let me help you with that"
    - word: "imagine"
      note: "As setup phrase ('Imagine a world where...'). State directly instead."
    - word: "exciting"
      note: "AI-typical enthusiasm adjective. State specific reason for interest."

  buzzwords:
    - "synergise"
    - "operationalise"
    - "incentivise"
    - word: "onboarding"
      note: "Penalty when overused. Acceptable once per piece in HR/SaaS context."
    - word: "bandwidth"
      note: "Metaphorical use only (e.g. 'I don't have the bandwidth'). Acceptable in networking context."
    - "circle back"
    - word: "deep dive"
      note: "As noun. Verb form is a hard blocker."
    - "move the needle"
    - "low-hanging fruit"
    - word: "boost"
      note: "When used as hype filler. Use 'increase' or 'improve' instead."
    - word: "inquiries"
      note: "Use 'questions' instead."
```

<!-- /ANCHOR:soft-deductions-1-point -->
<!-- ANCHOR:context-dependent-flags -->
## 11. CONTEXT-DEPENDENT FLAGS

These words are not penalised automatically but should be checked for clarity and precision.

```yaml
context_flags:
  - word: "it"
    flag: "Check if 'it' has a clear antecedent. Replace with specific noun if ambiguous."
    example:
      wrong: "The platform processes data fast. It is reliable."
      right: "The platform processes data fast. The platform is reliable."

  - word: "this"
    flag: "Check if 'this' has a clear referent. Replace with 'this [noun]' if vague."
    example:
      wrong: "Revenue dropped. This concerned the board."
      right: "Revenue dropped. This decline concerned the board."

  - word: "things"
    flag: "Replace with specific noun. 'Things' is almost always too vague."
    example:
      wrong: "There are a few things to consider."
      right: "There are a few factors to consider."

  - word: "stuff"
    flag: "Replace with specific noun. Acceptable only in very casual or colloquial content."
    example:
      wrong: "We handle all the technical stuff."
      right: "We handle all the technical configuration."

  - word: "solution"
    flag: "Overused in B2B. Replace with what it actually is (platform, tool, service)."
    example:
      wrong: "Our solution helps teams collaborate."
      right: "Our project management tool helps teams collaborate."

  - word: "excited"
    flag: "AI-typical enthusiasm. Replace with specific reason for interest. See also 'exciting' in Section 10 (-1 deduction)."
    example:
      wrong: "We're excited to announce our new feature."
      right: "We're releasing a new feature that reduces load time by 40%."
```

---

<!-- /ANCHOR:context-dependent-flags -->
<!-- ANCHOR:pre-publish-checklist -->
## 12. PRE-PUBLISH CHECKLIST

Run through this checklist before finalising any content.

```yaml
pre_publish_checklist:
  punctuation:
    - "No em dashes anywhere"
    - "No semicolons anywhere"
    - "No Oxford commas"
    - "No asterisks for emphasis"
    - "Max 1 ellipsis per piece"

  structure:
    - "No 'not just X, but also Y' patterns"
    - "No exactly 3-item enumerations"
    - "No setup language (Section 4)"

  content:
    - "No banned metaphors (Section 5)"
    - "No vague generalisations without specifics"
    - "No unnecessary modifiers"
    - "No meta-commentary about writing process"

  words:
    - "No hard blocker words (Section 6)"
    - "No phrase hard blockers (Section 7)"
    - "Context-dependent words checked (Section 8)"

  clarity:
    - "Pronouns have clear antecedents"
    - "Every claim is specific, not vague"
    - "'This' always followed by a noun"
    - "No orphaned 'it' references"

  voice:
    - "Active voice used throughout (no unnecessary passive constructions)"
    - "Reader addressed directly where appropriate (you/your)"
    - "Sentences vary in length (not all same pattern)"
    - "No hedging when certainty is possible"
    - "Claims backed by data or examples where possible"
```

---

<!-- /ANCHOR:pre-publish-checklist -->
<!-- ANCHOR:template-integration -->
## 13. TEMPLATE INTEGRATION GUIDE

This section explains how templates should reference and apply HVR.

### For Template Authors

When creating or updating documentation templates, follow these principles:

1. **Write template guidance in human voice.** Template instructions should model the style they promote. If your template says "write a brief summary," make that instruction itself concise and direct.

2. **Include an HVR checklist section.** Every template that produces user-facing documentation should include an HVR compliance checklist. Reference this file rather than duplicating the rules.

3. **Show, don't tell.** Include example text in templates that demonstrates the desired voice. Placeholder text like "[2-3 sentences summarizing what was implemented]" should be accompanied by a concrete example written in HVR style.

4. **Flag common violations in context.** If a specific document type tends to produce certain AI patterns (e.g., decision records overusing "furthermore"), call that out in the template guidance.

### Templates That Apply HVR

| Template               | Location                                                                                 | HVR Focus Areas                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Implementation Summary | `.opencode/skill/system-spec-kit/templates/*/implementation-summary.md`                  | Narrative prose over tables, explain "why" not just "what", direct address       |
| Decision Record        | `.opencode/skill/system-spec-kit/templates/level_3*/decision-record.md`                  | Clear rationale language, no hedging on decisions, active voice for consequences |
| README                 | `.opencode/skill/workflows-documentation/assets/documentation/readme_template.md`        | Welcoming tone, progressive disclosure, practical focus                          |
| Install Guide          | `.opencode/skill/workflows-documentation/assets/documentation/install_guide_template.md` | Direct instructions, imperative mood, specific over vague                        |

### Quick Reference for Writers

Write like you're explaining to a colleague. Be direct. Be specific. Back up claims with evidence. Cut words that add no meaning. Read it aloud. If it sounds like a robot wrote it, rewrite it.

---

<!-- /ANCHOR:template-integration -->
<!-- ANCHOR:related-resources -->
## 14. RELATED RESOURCES

### Templates
- [readme_template.md](./readme_template.md) - README creation template (references HVR in Section 9)
- [install_guide_template.md](./install_guide_template.md) - Install guide creation template

### Standards
- [core_standards.md](../../references/core_standards.md) - Document formatting standards
- [validation.md](../../references/validation.md) - Document validation rules

### Skill Reference
- [workflows-documentation SKILL.md](../../SKILL.md) - Parent skill with HVR enforcement rules

<!-- /ANCHOR:related-resources -->
