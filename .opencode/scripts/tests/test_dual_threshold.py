#!/usr/bin/env python3
"""
TEST: DUAL-THRESHOLD VALIDATION
===============================
Tests for skill_advisor.py dual-threshold validation:
- calculate_uncertainty() function
- passes_dual_threshold() function
- Integration with skill recommendations

Run with: pytest test_dual_threshold.py -v
"""

import sys
import os
import pytest

# Add parent directory to path for import
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from skill_advisor import calculate_uncertainty, passes_dual_threshold, analyze_request


# ═══════════════════════════════════════════════════════════════════════════
# 1. CALCULATE_UNCERTAINTY TESTS
# ═══════════════════════════════════════════════════════════════════════════

class TestCalculateUncertainty:
    """Tests for the calculate_uncertainty() function."""

    # ───────────────────────────────────────────────────────────────────────
    # Base uncertainty from number of matches
    # ───────────────────────────────────────────────────────────────────────

    def test_five_or_more_matches_low_base(self):
        """5+ matches should give base uncertainty of 0.15"""
        result = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=0)
        assert result == 0.15, f"Expected 0.15, got {result}"

    def test_six_matches_low_base(self):
        """6 matches should still give base uncertainty of 0.15"""
        result = calculate_uncertainty(num_matches=6, has_intent_boost=True, num_ambiguous_matches=0)
        assert result == 0.15, f"Expected 0.15, got {result}"

    def test_three_to_four_matches_medium_base(self):
        """3-4 matches should give base uncertainty of 0.25"""
        result = calculate_uncertainty(num_matches=3, has_intent_boost=True, num_ambiguous_matches=0)
        assert result == 0.25, f"Expected 0.25, got {result}"

    def test_four_matches_medium_base(self):
        """4 matches should give base uncertainty of 0.25"""
        result = calculate_uncertainty(num_matches=4, has_intent_boost=True, num_ambiguous_matches=0)
        assert result == 0.25, f"Expected 0.25, got {result}"

    def test_one_to_two_matches_higher_base(self):
        """1-2 matches should give base uncertainty of 0.40"""
        result = calculate_uncertainty(num_matches=1, has_intent_boost=True, num_ambiguous_matches=0)
        assert result == 0.40, f"Expected 0.40, got {result}"

    def test_two_matches_higher_base(self):
        """2 matches should give base uncertainty of 0.40"""
        result = calculate_uncertainty(num_matches=2, has_intent_boost=True, num_ambiguous_matches=0)
        assert result == 0.40, f"Expected 0.40, got {result}"

    def test_zero_matches_high_base(self):
        """0 matches should give base uncertainty of 0.70"""
        result = calculate_uncertainty(num_matches=0, has_intent_boost=True, num_ambiguous_matches=0)
        assert result == 0.70, f"Expected 0.70, got {result}"

    # ───────────────────────────────────────────────────────────────────────
    # Intent boost penalty
    # ───────────────────────────────────────────────────────────────────────

    def test_no_intent_boost_adds_penalty(self):
        """No intent boost should add 0.15 penalty"""
        with_boost = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=0)
        without_boost = calculate_uncertainty(num_matches=5, has_intent_boost=False, num_ambiguous_matches=0)
        assert without_boost - with_boost == 0.15, "Intent penalty should be 0.15"

    def test_no_intent_boost_penalty_applied(self):
        """Without intent boost: 0.15 (base) + 0.15 (penalty) = 0.30"""
        result = calculate_uncertainty(num_matches=5, has_intent_boost=False, num_ambiguous_matches=0)
        assert result == 0.30, f"Expected 0.30, got {result}"

    # ───────────────────────────────────────────────────────────────────────
    # Ambiguity penalty
    # ───────────────────────────────────────────────────────────────────────

    def test_one_ambiguous_match_adds_penalty(self):
        """1 ambiguous match should add 0.10 penalty"""
        no_ambig = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=0)
        one_ambig = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=1)
        assert one_ambig - no_ambig == 0.10, "Single ambig should add 0.10"

    def test_two_ambiguous_matches_adds_penalty(self):
        """2 ambiguous matches should add 0.20 penalty"""
        no_ambig = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=0)
        two_ambig = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=2)
        assert two_ambig - no_ambig == pytest.approx(0.20, abs=0.01), "Two ambig should add 0.20"

    def test_three_ambiguous_matches_adds_capped_penalty(self):
        """3+ ambiguous matches should cap at 0.30 penalty"""
        no_ambig = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=0)
        three_ambig = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=3)
        assert three_ambig - no_ambig == pytest.approx(0.30, abs=0.01), "Three+ ambig should cap at 0.30"

    def test_five_ambiguous_matches_capped(self):
        """5 ambiguous matches should still cap at 0.30 penalty"""
        no_ambig = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=0)
        five_ambig = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=5)
        assert five_ambig - no_ambig == pytest.approx(0.30, abs=0.01), "Ambiguity penalty capped at 0.30"

    # ───────────────────────────────────────────────────────────────────────
    # Combined scenarios (documented examples)
    # ───────────────────────────────────────────────────────────────────────

    def test_example_low_uncertainty(self):
        """5 matches, intent boost, 0 ambiguous: 0.15 (LOW - proceed)"""
        result = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=0)
        assert result == 0.15, f"Expected 0.15, got {result}"
        assert result <= 0.35, "Should be LOW (proceed)"

    def test_example_borderline_low(self):
        """3 matches, intent boost, 1 ambiguous: 0.35 (LOW - proceed)"""
        result = calculate_uncertainty(num_matches=3, has_intent_boost=True, num_ambiguous_matches=1)
        # 0.25 (base) + 0 (intent) + 0.10 (ambig) = 0.35
        assert result == 0.35, f"Expected 0.35, got {result}"
        assert result <= 0.35, "Should be LOW (proceed)"

    def test_example_medium_uncertainty(self):
        """1 match, no intent boost, 0 ambiguous: 0.55 (MEDIUM - verify)"""
        result = calculate_uncertainty(num_matches=1, has_intent_boost=False, num_ambiguous_matches=0)
        # 0.40 (base) + 0.15 (no intent) + 0 (ambig) = 0.55
        assert result == 0.55, f"Expected 0.55, got {result}"
        assert 0.36 <= result <= 0.60, "Should be MEDIUM (verify)"

    def test_example_high_uncertainty(self):
        """1 match, no intent boost, 2 ambiguous: 0.75 (HIGH - clarify)"""
        result = calculate_uncertainty(num_matches=1, has_intent_boost=False, num_ambiguous_matches=2)
        # 0.40 (base) + 0.15 (no intent) + 0.20 (ambig) = 0.75
        assert result == 0.75, f"Expected 0.75, got {result}"
        assert result > 0.60, "Should be HIGH (clarify)"

    def test_example_max_uncertainty(self):
        """0 matches, no intent boost, 0 ambiguous: 0.85 (HIGH - clarify)"""
        result = calculate_uncertainty(num_matches=0, has_intent_boost=False, num_ambiguous_matches=0)
        # 0.70 (base) + 0.15 (no intent) + 0 (ambig) = 0.85
        assert result == 0.85, f"Expected 0.85, got {result}"
        assert result > 0.60, "Should be HIGH (clarify)"

    # ───────────────────────────────────────────────────────────────────────
    # Edge cases
    # ───────────────────────────────────────────────────────────────────────

    def test_max_penalty_capped_at_1(self):
        """Uncertainty should never exceed 1.0"""
        result = calculate_uncertainty(num_matches=0, has_intent_boost=False, num_ambiguous_matches=10)
        assert result <= 1.0, "Uncertainty should cap at 1.0"

    def test_uncertainty_rounded_to_two_decimals(self):
        """Result should be rounded to 2 decimal places"""
        result = calculate_uncertainty(num_matches=3, has_intent_boost=True, num_ambiguous_matches=1)
        # Check that result has at most 2 decimal places
        assert result == round(result, 2), "Should be rounded to 2 decimals"

    def test_negative_matches_handled(self):
        """Negative matches should use 0-match base (defensive)"""
        result = calculate_uncertainty(num_matches=-1, has_intent_boost=True, num_ambiguous_matches=0)
        # Should treat as 0 matches (0.70 base)
        assert result >= 0.70, "Negative matches should use high base"


# ═══════════════════════════════════════════════════════════════════════════
# 2. PASSES_DUAL_THRESHOLD TESTS
# ═══════════════════════════════════════════════════════════════════════════

class TestPassesDualThreshold:
    """Tests for the passes_dual_threshold() function."""

    # ───────────────────────────────────────────────────────────────────────
    # Basic threshold checks
    # ───────────────────────────────────────────────────────────────────────

    def test_both_pass_returns_true(self):
        """High confidence + low uncertainty = PASS"""
        result = passes_dual_threshold(confidence=0.85, uncertainty=0.20)
        assert result is True, "Should pass when both thresholds met"

    def test_low_confidence_fails(self):
        """Low confidence fails even with low uncertainty"""
        result = passes_dual_threshold(confidence=0.50, uncertainty=0.20)
        assert result is False, "Should fail with low confidence"

    def test_high_uncertainty_fails(self):
        """High uncertainty fails even with high confidence"""
        result = passes_dual_threshold(confidence=0.90, uncertainty=0.50)
        assert result is False, "Should fail with high uncertainty"

    def test_both_fail_returns_false(self):
        """Low confidence + high uncertainty = FAIL"""
        result = passes_dual_threshold(confidence=0.50, uncertainty=0.60)
        assert result is False, "Should fail when both thresholds missed"

    # ───────────────────────────────────────────────────────────────────────
    # Boundary conditions (default thresholds: conf=0.8, uncert=0.35)
    # ───────────────────────────────────────────────────────────────────────

    def test_exact_confidence_threshold(self):
        """Confidence exactly at threshold (0.8) should pass"""
        result = passes_dual_threshold(confidence=0.80, uncertainty=0.20)
        assert result is True, "Exact threshold should pass (>=)"

    def test_just_below_confidence_threshold(self):
        """Confidence just below threshold (0.79) should fail"""
        result = passes_dual_threshold(confidence=0.79, uncertainty=0.20)
        assert result is False, "Below threshold should fail"

    def test_exact_uncertainty_threshold(self):
        """Uncertainty exactly at threshold (0.35) should pass"""
        result = passes_dual_threshold(confidence=0.85, uncertainty=0.35)
        assert result is True, "Exact threshold should pass (<=)"

    def test_just_above_uncertainty_threshold(self):
        """Uncertainty just above threshold (0.36) should fail"""
        result = passes_dual_threshold(confidence=0.85, uncertainty=0.36)
        assert result is False, "Above threshold should fail"

    def test_both_at_exact_thresholds(self):
        """Both at exact thresholds should pass"""
        result = passes_dual_threshold(confidence=0.80, uncertainty=0.35)
        assert result is True, "Both at exact thresholds should pass"

    # ───────────────────────────────────────────────────────────────────────
    # Custom thresholds
    # ───────────────────────────────────────────────────────────────────────

    def test_custom_confidence_threshold(self):
        """Custom confidence threshold (0.7 per AGENTS.md §4)"""
        result = passes_dual_threshold(confidence=0.70, uncertainty=0.30, conf_threshold=0.70)
        assert result is True, "Should pass with 0.70 threshold"

    def test_custom_confidence_below_threshold(self):
        """Below custom confidence threshold"""
        result = passes_dual_threshold(confidence=0.69, uncertainty=0.30, conf_threshold=0.70)
        assert result is False, "Should fail below custom threshold"

    def test_custom_uncertainty_threshold(self):
        """Custom uncertainty threshold"""
        result = passes_dual_threshold(confidence=0.85, uncertainty=0.40, uncert_threshold=0.45)
        assert result is True, "Should pass with higher uncert threshold"

    # ───────────────────────────────────────────────────────────────────────
    # Confident Ignorance state
    # ───────────────────────────────────────────────────────────────────────

    def test_confident_ignorance_fails(self):
        """High confidence + high uncertainty = FAIL (dangerous state)"""
        result = passes_dual_threshold(confidence=0.90, uncertainty=0.60)
        assert result is False, "Confident ignorance should fail"

    def test_confident_ignorance_borderline(self):
        """Confidence 0.85, uncertainty 0.40 = FAIL (confident ignorance)"""
        result = passes_dual_threshold(confidence=0.85, uncertainty=0.40)
        assert result is False, "Borderline confident ignorance should fail"


# ═══════════════════════════════════════════════════════════════════════════
# 3. INTEGRATION TESTS
# ═══════════════════════════════════════════════════════════════════════════

class TestDualThresholdIntegration:
    """Tests for dual-threshold integration with analyze_request()."""

    def test_analyze_returns_uncertainty(self):
        """analyze_request() should include uncertainty in results"""
        results = analyze_request("how does authentication work")
        if results:  # May be empty if no skills loaded
            assert 'uncertainty' in results[0], "Results should include uncertainty"

    def test_high_confidence_low_uncertainty_recommendation(self):
        """Strong intent should produce high confidence, low uncertainty"""
        results = analyze_request("git commit branch merge worktree")
        if results:
            top_result = results[0]
            if top_result.get('skill') == 'workflows-git':
                conf = top_result.get('confidence', 0)
                uncert = top_result.get('uncertainty', 1.0)
                # Strong git keywords should produce good scores
                assert conf >= 0.7, f"Expected conf >= 0.7, got {conf}"
                assert uncert <= 0.50, f"Expected uncert <= 0.50, got {uncert}"

    def test_ambiguous_query_higher_uncertainty(self):
        """Ambiguous query should have higher uncertainty"""
        results = analyze_request("debug")  # Ambiguous - could be multiple skills
        if results:
            top_result = results[0]
            uncert = top_result.get('uncertainty', 0)
            # Ambiguous keyword should increase uncertainty
            assert uncert >= 0.25, f"Ambiguous query should have uncert >= 0.25, got {uncert}"

    def test_empty_query_no_results(self):
        """Empty query should return no results"""
        results = analyze_request("")
        assert results == [], "Empty query should return empty list"

    def test_stop_words_only_no_results(self):
        """Query with only stop words should return no results (unless boost)"""
        results = analyze_request("the and or")
        # May return empty or low confidence results
        if results:
            # Should have high uncertainty due to no meaningful matches
            assert results[0].get('uncertainty', 0) >= 0.50


# ═══════════════════════════════════════════════════════════════════════════
# 4. THRESHOLD DOCUMENTATION TESTS
# ═══════════════════════════════════════════════════════════════════════════

class TestThresholdDocumentation:
    """Tests verifying documented threshold values."""

    def test_agents_md_readiness_thresholds(self):
        """AGENTS.md §4: READINESS = (conf >= 0.70) AND (uncert <= 0.35)"""
        # Ready state
        assert passes_dual_threshold(0.70, 0.35, conf_threshold=0.70) is True
        # Not ready - low confidence
        assert passes_dual_threshold(0.69, 0.35, conf_threshold=0.70) is False
        # Not ready - high uncertainty
        assert passes_dual_threshold(0.70, 0.36, conf_threshold=0.70) is False

    def test_gate3_routing_threshold(self):
        """Gate 3 skill routing uses conf_threshold=0.8"""
        # Passes Gate 3
        assert passes_dual_threshold(0.80, 0.30, conf_threshold=0.80) is True
        # Fails Gate 3 (would pass AGENTS.md §4)
        assert passes_dual_threshold(0.75, 0.30, conf_threshold=0.80) is False

    def test_uncertainty_threshold_fixed(self):
        """Uncertainty threshold is always 0.35 per AGENTS.md"""
        # Passes at exactly 0.35
        assert passes_dual_threshold(0.85, 0.35, uncert_threshold=0.35) is True
        # Fails at 0.36
        assert passes_dual_threshold(0.85, 0.36, uncert_threshold=0.35) is False


# ═══════════════════════════════════════════════════════════════════════════
# 5. UNCERTAINTY LEVEL CLASSIFICATION TESTS
# ═══════════════════════════════════════════════════════════════════════════

class TestUncertaintyLevels:
    """Tests for uncertainty level classifications."""

    def test_low_uncertainty_range(self):
        """<= 0.35 is LOW (proceed)"""
        for uncert in [0.0, 0.15, 0.25, 0.35]:
            # Should pass if confidence is sufficient
            assert passes_dual_threshold(0.85, uncert), f"Uncert {uncert} should be LOW (pass)"

    def test_medium_uncertainty_range(self):
        """0.36-0.60 is MEDIUM (verify first)"""
        for uncert in [0.36, 0.45, 0.55, 0.60]:
            # Should fail even with high confidence
            assert not passes_dual_threshold(0.95, uncert), f"Uncert {uncert} should be MEDIUM (fail)"

    def test_high_uncertainty_range(self):
        """> 0.60 is HIGH (require clarification)"""
        for uncert in [0.61, 0.70, 0.85, 1.0]:
            # Should definitely fail
            assert not passes_dual_threshold(0.99, uncert), f"Uncert {uncert} should be HIGH (fail)"


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
