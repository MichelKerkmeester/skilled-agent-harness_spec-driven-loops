# frozen_string_literal: true

# One passing and one failing test-unit test; the gate checks the failure is
# reported as one. The adapter's result hooks once never installed, and every
# failing test-unit test was reported as passed without a test like this.
require "test/unit"
require_relative "../../lib/shapes"

class UnitStyleFailingTest < Test::Unit::TestCase
  def test_classifies
    assert_equal :yes, Shapes.classify(true, false, true)
  end

  def test_fails
    assert_equal :no, Shapes.classify(true, false, true)
  end
end
