# frozen_string_literal: true

# One passing and one failing test. The passing fixture never exercises a
# runner's failure path, so the gate runs this file and checks the failure is
# reported as one.
require "minitest/autorun"
require_relative "../../lib/shapes"

class ShapesFailingTest < Minitest::Test
  def test_classifies
    assert_equal :yes, Shapes.classify(true, false, true)
  end

  def test_fails
    assert_equal :no, Shapes.classify(true, false, true)
  end
end
