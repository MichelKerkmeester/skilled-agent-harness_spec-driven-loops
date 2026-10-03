# Phrase-boost bound

- Doctor asset: `.skilled/commands/doctor/assets/doctor-skill-advisor.yaml:288` `phrase_boost_range: "[-1.0, 2.0]"`; validator text at `:265` ("phrase boosts are numeric in [-1.0, 2.0]").
- Current map extremes (from the built module): 114 phrases, 154 amounts, min -0.6, max 1.8, all inside the interval.
- Decision: declare `PHRASE_BOOST_BOUND = { min: -1.0, max: 2.0 }` beside the map and enforce it in the existing guard suite (`tests/command-bridge-resolution-guard.vitest.ts`), which already imports `PHRASE_BOOSTS`; a second test pins the doctor asset's interval to the constant so the two cannot drift. No runtime clamp change: the lane already clamps each emitted score to at most 1.
