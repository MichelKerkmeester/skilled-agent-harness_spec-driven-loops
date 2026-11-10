# Token-or-scale scenario against SKD-010

**Decision: add it**, as `value-discipline/value-names-its-source.md` (`SKD-013`).

**What SKD-010 tests:** one spatial value ("What padding should this card have"), returned from the spacing scale with the scale named. One value, one source, no tokens in play.

**What SKD-020 tests:** a conflict. The project's token says 24px, the skill said 32px, and the skill must defer.

**What neither tests:** a request for several values at once (spacing, radius, shadow) where some come from installed tokens and some from the scales, and every value must name its source: a token, a scale step, or a reported gap. A reply that mixes sourced and unsourced values passes SKD-010 on its one spatial value and never meets SKD-020's conflict. The Barter copy (`SKD-013`, "Every Barter value names its source") tests exactly this against a Barter profile. The generic version drops the profile and uses the tokens the app installs.

**Barter-only, not carried over:** the profile load, the `fe-creators-mobile` surface, the Barter token constants.
