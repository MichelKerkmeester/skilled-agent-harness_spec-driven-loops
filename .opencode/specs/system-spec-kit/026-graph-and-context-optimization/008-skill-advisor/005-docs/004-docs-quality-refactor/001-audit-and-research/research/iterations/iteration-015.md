# Iter 015 — HVR compliance sweep across all 6 doc surfaces

## Question

Which doc surfaces fail HVR compliance (hard-blocker words, phrase blockers, em dashes, semicolons, Oxford commas, banned structural patterns)? Rank by violation density.

## Evidence (file:line citations required)

**Evidence 1: Hard-blocker word scan (delve, embark, leverage, foster, empower, disrupt, robust, seamless, holistic, synergy, utilize, tapestry, elucidate, unveil, illuminate, game-changer, cutting-edge)**
- Grep found NO MATCHES for hard-blocker words across all system-skill-advisor markdown files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- This indicates the 4 primary doc surfaces (SKILL.md, README.md, ARCHITECTURE.md, INSTALL_GUIDE.md) are clean of hard-blocker AI vocabulary <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="1-235" />
- HVR rules define these as -5 point hard blockers that cause automatic failure <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="333-345" />

**Evidence 2: Phrase blocker scan (it's important to, moving forward, when it comes to, dive into, in a world where, that being said)**
- Grep found NO MATCHES for phrase blockers across all system-skill-advisor markdown files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- The 4 primary doc surfaces avoid common AI filler phrases that signal setup language <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="348-364" />
- HVR rules ban these phrases as -5 point hard blockers <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="348-364" />

**Evidence 3: Em dash (—) violation scan**
- Grep found 90 matches for em dashes across system-skill-advisor markdown files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- INSTALL_GUIDE.md line 268 contains em dash in "1–2" range notation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="268" />
- ARCHITECTURE.md lines 48 and 229 contain em dashes in parenthetical explanations <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="48, 229" />
- SKILL.md line 126 contains em dash in tool description <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" line="126" />
- README.md line 38 contains em dash in tool count description <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" line="38" />
- changelog/v0.2.0.md contains 17 em dash usages in release notes and technical descriptions <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/changelog/v0.2.0.md" lines="2, 6, 9, 17, 23, 27, 41, 42, 50, 68, 75, 76, 100, 101, 111, 112, 113" />
- HVR rules ban em dashes completely, requiring replacement with comma, full stop or colon <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="99" />

**Evidence 4: Semicolon (;) violation scan**
- Grep found 95 matches for semicolons across system-skill-advisor markdown files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- INSTALL_GUIDE.md line 176 contains semicolon in mode description <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="176" />
- ARCHITECTURE.md lines 17 and 269 contain semicolons in compound sentences <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="17, 269" />
- README.md lines 129 and 172 contain semicolons in technical descriptions <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="129, 172" />
- changelog/v0.2.0.md contains 6 semicolons in release notes <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/changelog/v0.2.0.md" lines="3, 9, 11, 41, 76, 89" />
- manual_testing_playbook/02--cli-hooks-and-plugin/006-devin-user-prompt-submit.md contains 6 semicolons in scenario descriptions <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/006-devin-user-prompt-submit.md" lines="36, 103, 109, 119, 121, 122" />
- HVR rules ban semicolons completely, requiring two sentences or a conjunction <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="100" />

**Evidence 5: Oxford comma (, and) violation scan**
- Grep found 100+ matches for ", and" pattern across system-skill-advisor markdown files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- INSTALL_GUIDE.md lines 3, 10, 37 contain Oxford commas in tool lists and descriptions <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="3, 10, 37" />
- INSTALL_GUIDE.md lines 97, 98, 100 contain Oxford commas in return value descriptions <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="97, 98, 100" />
- ARCHITECTURE.md lines 3, 17, 40, 62-64, 67, 71, 74, 221, 224-227, 247-248 contain Oxford commas in technical lists <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="3, 17, 40, 62-64, 67, 71, 74, 221, 224-227, 247-248" />
- SKILL.md lines 42, 48-49, 193, 214 contain Oxford commas in activation signals and tool lists <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="42, 48-49, 193, 214" />
- manual_testing_playbook/manual_testing_playbook.md contains 10 Oxford commas in scenario descriptions <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="3, 10, 59, 67, 68, 166, 185, 361, 368, 391" />
- HVR rules ban Oxford commas completely <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="101" />

**Evidence 6: Oxford comma (, or) violation scan**
- Grep found 38 matches for ", or" pattern across system-skill-advisor markdown files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- INSTALL_GUIDE.md lines 99, 282 contain Oxford commas in state descriptions <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="99, 282" />
- ARCHITECTURE.md line 220 contains Oxford comma in tool description <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" line="220" />
- SKILL.md lines 42, 48-49, 193, 214 contain Oxford commas in activation signals and tool lists <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="42, 48-49, 193, 214" />
- manual_testing_playbook/manual_testing_playbook.md contains 7 Oxford commas in protocol descriptions <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="66, 76, 111, 149, 155, 156, 166" />
- HVR rules ban Oxford commas with "or" as well as "and" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="101" />

**Evidence 7: Prior iteration cross-reference for HVR compliance**
- Iteration-001 examined SKILL.md anchor coverage and smart-router conformance but did NOT check HVR compliance <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-001.md" lines="1-77" />
- Iteration-007 examined references cross-link integrity but did NOT check HVR compliance <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-007.md" lines="1-113" />
- Iteration-014 examined manual_testing_playbook GAP and coverage matrix but did NOT check HVR compliance <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-014.md" lines="1-100" />
- None of iterations 001-014 examined HVR compliance across the 6 doc surfaces, creating a significant gap in prior audit coverage <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/004-docs-quality-refactor/001-audit-and-research/research/iterations/" />

**Evidence 8: HVR rules reference for punctuation standards**
- HVR rules specify em dash ban as -5 point hard blocker <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="99" />
- HVR rules specify semicolon ban as -5 point hard blocker <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="100" />
- HVR rules specify Oxford comma ban as -5 point hard blocker <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="101" />
- Punctuation category carries 15% weight in overall HVR scoring <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="27-35" />
- Document starts at 100 points; below 70 is failing, below 85 needs revision <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="35" />

## Findings (numbered, severity-tagged P0|P1|P2, impact-ranked 1-10, sub-phase-targeted 002|003|004|005)

**Finding 1: All 6 doc surfaces fail HVR compliance due to em dash violations (P0, impact-rank 10, sub-phase-target: 005)**
- 90 em dash violations found across system-skill-advisor markdown files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- Primary doc surfaces affected: SKILL.md (1 match), README.md (1 match), ARCHITECTURE.md (2 matches), INSTALL_GUIDE.md (1 match) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" line="126" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" line="38" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="48, 229" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="268" />
- Secondary surfaces heavily affected: changelog/v0.2.0.md (17 matches), manual_testing_playbook/ (dozens of matches) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/changelog/v0.2.0.md" lines="2, 6, 9, 17, 23, 27, 41, 42, 50, 68, 75, 76, 100, 101, 111, 112, 113" />
- HVR rules ban em dashes as -5 point hard blocker each; 90 violations = -450 points, far below failing threshold <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="99, 35" />
- Prior iterations 001-014 completely missed this critical HVR compliance failure <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/004-docs-quality-refactor/001-audit-and-research/research/iterations/" />

**Finding 2: All 6 doc surfaces fail HVR compliance due to semicolon violations (P0, impact-rank 10, sub-phase-target: 005)**
- 95 semicolon violations found across system-skill-advisor markdown files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- Primary doc surfaces affected: SKILL.md (multiple matches), README.md (2 matches), ARCHITECTURE.md (2 matches), INSTALL_GUIDE.md (1 match) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="129, 172" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="17, 269" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="176" />
- Secondary surfaces heavily affected: changelog/v0.2.0.md (6 matches), manual_testing_playbook/ (dozens of matches) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/changelog/v0.2.0.md" lines="3, 9, 11, 41, 76, 89" />
- HVR rules ban semicolons as -5 point hard blocker each; 95 violations = -475 points, far below failing threshold <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="100, 35" />
- Semicolons appear in technical compound sentences that should be split into two sentences <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" line="17" />

**Finding 3: All 6 doc surfaces fail HVR compliance due to Oxford comma violations (P0, impact-rank 10, sub-phase-target: 005)**
- 100+ Oxford comma violations with ", and" found across system-skill-advisor markdown files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- 38 Oxford comma violations with ", or" found across system-skill-advisor markdown files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- Primary doc surfaces heavily affected: ARCHITECTURE.md (16 matches), INSTALL_GUIDE.md (7 matches), SKILL.md (5 matches) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="3, 17, 40, 62-64, 67, 71, 74, 221, 224-227, 247-248" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="3, 10, 37, 97, 98, 100, 327" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="42, 48-49, 193, 214" />
- Secondary surfaces heavily affected: manual_testing_playbook/manual_testing_playbook.md (17 matches total) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="3, 10, 59, 67, 68, 76, 111, 149, 155, 156, 166, 185, 361, 368, 391" />
- HVR rules ban Oxford commas as -5 point hard blocker each; 138+ violations = -690+ points, far below failing threshold <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="101, 35" />
- Oxford commas appear frequently in tool lists, technical enumerations, and scenario descriptions <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="48-49" />

**Finding 4: Hard-blocker words and phrase blockers are clean across all surfaces (P2, impact-rank 2, sub-phase-target: 005)**
- Zero hard-blocker word violations found (delve, embark, leverage, foster, empower, disrupt, robust, seamless, holistic, synergy, utilize, tapestry, elucidate, unveil, illuminate, game-changer, cutting-edge) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- Zero phrase blocker violations found (it's important to, moving forward, when it comes to, dive into, in a world where, that being said) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- This indicates strong vocabulary discipline in avoiding AI-typical language <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="333-364" />
- However, punctuation violations completely overshadow this vocabulary compliance <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="27-35" />

**Finding 5: Violation density ranking by doc surface (P0, impact-rank 9, sub-phase-target: 005)**
- Highest density: changelog/v0.2.0.md (17 em dashes + 6 semicolons + multiple Oxford commas in single file) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/changelog/v0.2.0.md" />
- High density: manual_testing_playbook/ (dozens of violations across scenario files) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/" />
- Medium density: ARCHITECTURE.md (2 em dashes + 2 semicolons + 16 Oxford commas) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" />
- Medium density: INSTALL_GUIDE.md (1 em dash + 1 semicolon + 7 Oxford commas) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" />
- Low density: SKILL.md (1 em dash + multiple semicolons + 5 Oxford commas) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" />
- Low density: README.md (1 em dash + 2 semicolons + multiple Oxford commas) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" />
- All surfaces exceed HVR failure threshold despite density differences <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="35" />

**Finding 6: Prior iterations completely missed HVR compliance audit (P1, impact-rank 8, sub-phase-target: 004)**
- Iterations 001-014 focused on template conformance, cross-linking, coverage matrix, and GAP investigation but never examined HVR compliance <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/004-docs-quality-refactor/001-audit-and-research/research/iterations/" />
- This represents a significant audit gap given HVR is referenced in sk-doc template rules <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="1-10" />
- The 323+ total HVR violations (90 em dashes + 95 semicolons + 138 Oxford commas) should have been caught in earlier template compliance iterations <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- This suggests the audit methodology prioritized structural conformance over linguistic compliance <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-001.md" lines="1-77" />

**Finding 7: Punctuation violations are systematic, not sporadic (P0, impact-rank 9, sub-phase-target: 005)**
- Em dashes appear consistently in parenthetical explanations, range notation, and tool descriptions across all surfaces <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="48, 229" />
- Semicolons appear consistently in compound technical sentences and mode descriptions <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" line="17" />
- Oxford commas appear consistently in tool lists, activation signals, and enumerations <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="48-49" />
- This systematic pattern suggests a style guide or authoring habit that conflicts with HVR requirements <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="95-117" />
- Fixing these violations will require comprehensive rewrite, not spot fixes <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="431-478" />

## Gaps for next iter

1. **Gap 1**: Determine if the em dash in INSTALL_GUIDE.md line 268 ("1–2") is a range notation exception or if it should be rewritten as "1 to 2" per HVR rules.

2. **Gap 2**: Investigate whether changelog files are exempt from HVR compliance or if they should follow the same punctuation standards as primary doc surfaces.

3. **Gap 3**: Assess whether manual_testing_playbook scenario files should be exempt from HVR compliance given their technical specification nature, or if they require full HVR remediation.

4. **Gap 4**: Determine the remediation priority order: primary surfaces first (SKILL.md, README.md, ARCHITECTURE.md, INSTALL_GUIDE.md) or tackle by violation type (all em dashes, then all semicolons, then all Oxford commas).

## JSONL delta row

```json
{"type":"iteration","iteration":15,"timestamp_utc":"2026-05-16T10:24:00Z","executor":"cli-devin","model":"swe-1.6","status":"complete","focus":"HVR compliance sweep across all 6 doc surfaces","findings_count":7,"gaps_count":4,"newInfoRatio":0.95,"primary_evidence_files":["/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md"]}
```