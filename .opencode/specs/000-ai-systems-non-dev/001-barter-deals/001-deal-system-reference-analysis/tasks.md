# Tasks: Deal System Reference Analysis Implementation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file/section affected)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: P0 Operational Fixes

- [ ] T001 Update Standards Section 2: change title max length from 80 to 50 characters (System Prompt - Section 2)
- [ ] T002 Update Deal Templates - Requirements Section: add "1x Instagram Story with product tag and link to @[brand]" as standard deliverable (All Deal Type Templates)
- [ ] T003 Create Follower Requirement Guidance section: document 1500+ baseline, 3000-5000+ for premium, always total not split per platform (System Prompt - New Section)
- [ ] T004 Enhance Market Data section: add value-to-application warnings for EUR ranges (below 50, 50-75, 75-150, 150-300, 300+) (System Prompt - Market Data Section)
- [ ] T005 Create Campaign Goal Input section: add goal parameter (awareness/sales/reviews/UGC) as Question 0, document template impact per goal type (System Prompt - Section 0 Input Parameters)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: P1 Short-Term Deal Quality Improvements

- [ ] T006 Create Paid + Barter Hybrid routing path: add routing triggers ("payment", "paid collaboration"), template changes (itemized "What Do You Get?" section, mandatory WeTransfer), payment ranges EUR 50-150 base + EUR 50-100 ad rights (System Prompt - Section 4 Smart Routing)
- [ ] T007 Create Hashtag Strategy section: document 5-10 niche hashtag guidance, flag generic high-volume hashtags (#love, #instagood), add suggested hashtag sets per category (System Prompt - New Section)
- [ ] T008 Create Deal Attractiveness Self-Check section: 7-criteria pre-export quality gate (value EUR 50+, deliverables concrete, follower-to-value match, goal-content alignment, niche hashtags, story included, title under 50 chars) (System Prompt - New Section)
- [ ] T009 Create Post-Creation Optimization Playbook section: 6-step diagnostic for low-application deals (increase value EUR 25-50, make deliverables concrete, lower follower requirements 500-1000, verify category, add compensation, highlight location) (System Prompt - New Section)
- [ ] T010 Create Category Selection Strategy section: document "choose only categories that truly match", "too broad means wrong creators", "too narrow means too few applications" (System Prompt - New Section)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: P1 Medium-Term System Expansion

- [ ] T011 Create Gift Card routing path: add routing triggers ("gift card", "voucher", "credit", "spend freely"), template changes (freedom-of-choice ABOUT hook, redemption guidance, no shipping references), value ranges EUR 75-125 standard, EUR 125-250 premium (System Prompt - Section 4 Smart Routing)
- [ ] T012 Create Subscription routing path: add routing triggers ("subscription", "membership", "year access", "annual plan"), template changes (duration-based value framing, activation process, follow-up content option), value ranges EUR 100-200 solid, EUR 200+ ideal (System Prompt - Section 4 Smart Routing)
- [ ] T013 [P] Create Multi-Language Support Framework section: document brand country to language mapping (NL/BE → Dutch, DE → German, UK/international → English), create parallel template variants structure, document German terminology glossary, note Phase 2 work for HVR per-language rules (System Prompt - New Section)
- [ ] T014 [P] Create Barter App Terminology Mapping section: document platform UI labels ("Categories" never "Interests"), total followers never split per platform, field name mappings (System Prompt - New Section)
- [ ] T015 [P] Create Scope Boundaries section: document regulated products (alcohol, tobacco, pharmaceuticals) require compliance language, sensitive categories (gambling, adult, political) block or flag, giveaway vs barter validation, geographic mismatch detection (System Prompt - New Section)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification and Documentation

- [ ] T016 Manual test Paid + Barter Hybrid routing: create sample deal brief with "paid collaboration" signal, verify itemized output, check WeTransfer inclusion (ChatGPT Project Testing)
- [ ] T017 Manual test Gift Card routing: create sample deal brief with "gift card" signal, verify freedom-of-choice framing, check redemption guidance (ChatGPT Project Testing)
- [ ] T018 Manual test Subscription routing: create sample deal brief with "subscription" signal, verify duration-based framing, check activation process (ChatGPT Project Testing)
- [ ] T019 Manual test Campaign Goal routing: test all 4 goal types (awareness/sales/reviews/UGC), verify template output differences (discount codes for sales, usage rights for UGC, etc.) (ChatGPT Project Testing)
- [ ] T020 Manual test Multi-Language routing: test NL, DE, EN brand inputs, verify correct language template selection and terminology (ChatGPT Project Testing)
- [ ] T021 Manual test Deal Attractiveness Self-Check: create deals that violate each of 7 criteria, verify warnings appear (ChatGPT Project Testing)
- [ ] T022 Run validate.sh on spec folder, fix any errors, re-validate until pass (Bash execution)
- [ ] T023 Update implementation-summary.md with final changes: list all knowledge base sections created/modified, document key decisions, note known limitations (implementation-summary.md)
- [ ] T024 Clean scratch/ folder: remove any temporary notes or drafts (scratch/ directory)
- [ ] T025 Synchronize all spec documents: ensure spec.md, plan.md, tasks.md, checklist.md, decision-record.md all reference same 19 recommendations (All spec files)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks (T001-T005) marked `[x]`
- [ ] All P1 short-term tasks (T006-T010) marked `[x]`
- [ ] All P1 medium-term tasks (T011-T015) marked `[x]`
- [ ] All verification tasks (T016-T025) marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] validate.sh passes with zero errors
- [ ] Manual verification of all 3 new deal type routings passed
- [ ] All spec documents contain zero placeholder content
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research Source**: See `research.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
25 tasks across 4 phases
Phase 1: 5 P0 operational fixes
Phase 2: 5 P1 short-term quality improvements
Phase 3: 5 P1 medium-term system expansion
Phase 4: 10 verification and documentation tasks
-->
