# frozen_string_literal: true

require "minitest/autorun"
require_relative "../lib/shapes"

class ShapesTest < Minitest::Test
  def setup
    @values = [5, 500]
  end

  def test_matcher
    assert_equal :int, Shapes.matcher(@values[0])
    assert_equal :big, Shapes.matcher(@values[1])
  end

  def test_negation
    assert_equal "both", Shapes.negation(true, true)
  end

  def test_skipped
    skip "demonstrates skips"
  end
end
