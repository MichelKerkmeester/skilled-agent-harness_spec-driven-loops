<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: standard-v2 -->

# Plan: LinkedIn Ghostwriter System Audit Fixes — Pieter Bertram

## Approach

Fixes organized into 4 phases, each independently deployable. Later phases depend on earlier phases where noted.

---

## Phase 1: Canonicalization (P0 — Critical Path)

**Goal:** Establish single sources of truth for all duplicated definitions.

### 1.1 Hard Blocker Unification
1. Compile master list of ALL hard blockers from Voice DNA (~30), QV (~17), and HVE (~9)
2. Deduplicate — estimated 35-40 unique terms
3. Write canonical hard blocker section in Quality Validators
4. In Voice DNA: replace hard blocker section with reference to QV
5. In HVE: replace hard blocker section with reference to QV + list only Pieter-ADDITIONAL terms
6. Update HVE precedence rule: "HVE may ADD blockers but NEVER downgrade QV severity"
7. Resolve "leverage" dual-listing within QV (remove from warning flags)

### 1.2 PRELOAD_GROUPS Key Fix
1. In System Prompt, rename PRELOAD_GROUPS keys to match detect_mode() output:
   - `brand_group` → `barter_group`
   - `creation_quick` → `quick_group`
   - `creation_raw` → `raw_group`
   - `optimization_group` → `optimize_group`
2. Add missing groups: `leadership_group`, `feature_group`, `creator_group`, `interactive_group`
3. Define correct file sets for each new group

### 1.3 Pieter Test Canonicalization
1. Keep canonical version in System Prompt (Groundedness/Authenticity/Contribution/Coffee/Boldness)
2. In Interactive Mode: replace local redefinition with reference: "Apply Pieter Test (see System Prompt §4.3)"
3. In DEPTH Framework: verify alignment (already matches), add cross-reference

### 1.4 Perspective Minimums Canonicalization
1. Define canonical table in System Prompt:
   - Raw: 0, Quick: 2, Standard: 3, Deep: 5
2. In DEPTH Framework: reference System Prompt table, remove local definition
3. In Interactive Mode: remove blanket "minimum 3" — reference System Prompt table

---

## Phase 2: Validation Hardening (P1)

**Goal:** Close gaps in what the scoring system can detect.
**Depends on:** Phase 1 (hard blocker list must be canonical first)

### 2.1 3-Item List Detection
1. Add new rule to QV soft deductions: "Exactly 3-item list/sequence: -2 per occurrence"
2. Add guidance: "Prefer 2, 4, or 5 items for lists, sequences, and parallel constructions"
3. Add to Pieter Test commentary as quality signal

### 2.2 Missing State Machine States
1. Define `engagement_routing` state with: action (load Engagement Rules), transitions, nextState
2. Define `optimize_routing` state with: action (load Platform Strategy), transitions, nextState

### 2.3 Influencer Contradiction Resolution
1. Amend Hard Blocker 1: "influencer(s) — EXCEPTION: permitted when explicitly discussing the historical term in contrast to 'creator'"
2. Add example to QV

### 2.4 Feature Fallback Fix
1. In FALLBACK_CHAINS: change `"feature": ["Context - Personal", "Voice DNA"]` to `"feature": ["Context - Industry Extensions", "Voice DNA"]`

---

## Phase 3: Synchronization (P2)

**Goal:** Align all cross-file references and formatting constraints.
**Depends on:** Phase 1

### 3.1 Formatting Constraint Table
1. Create single reference table for: arrows (max), hashtags (range), banned emoji (complete list), CTA rules per energy level
2. Place in Content Standards as canonical source
3. Update QV scoring to reference CS table
4. Update Voice DNA to reference CS table

### 3.2 Reference Fixes
1. Interactive Mode: "Section 4 Command Shortcuts" → "Section 3.1 Commands"
2. System Prompt: "Context - Brand" → "Context - Brand Extensions", "Context - Industry" → "Context - Industry Extensions"
3. System Prompt: Remove stale HTML comment re: Canonical Stats Registry

### 3.3 Keyword Collision Fix
1. In detect_mode(), move "founder" from $feature keyword list to $personal
2. Add "startup spotlight" or "celebrate" as $feature replacement keywords

### 3.4 AGENTS.md $raw Exception
1. Update line 151: "except $quick" → "except $quick/$raw"

---

## Phase 4: Strategic Improvements (P3)

**Goal:** Architectural refinements and data collection.
**Independent of Phases 1-3.**

### 4.1 Cognitive Framework Arbitration
1. Add to AGENTS.md: "Sequential Thinking Protocol applies to system-level reasoning. DEPTH Framework applies to content creation. They do not overlap."

### 4.2 Dead Code / Low-Priority Cleanup
1. Remove unreachable Raw energy path in processing state
2. Add resetTo: start in complete state
3. Add explicit Voice DNA dependency note in DEPTH Framework

### 4.3 CORINA Questionnaire
1. Schedule data collection session with Pieter
2. Fill all sections of CORINA → MISSING_CONTEXT.md
3. Update Context - Personal with verified data
