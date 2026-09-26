# frozen_string_literal: true

require "minitest/autorun"
require_relative "../lib/shapes"

# Runs its tests on Minitest's thread pool. Probe observations attribute to
# the thread's own test; stdlib line/branch deltas that overlap go to the run.
class ParallelShapesTest < Minitest::Test
  parallelize_me!

  def test_classify_yes
    sleep 0.02
    assert_equal :yes, Shapes.classify(true, false, true)
  end

  def test_classify_no
    sleep 0.02
    assert_equal :no, Shapes.classify(false, false, false)
  end

  def test_logical
    sleep 0.02
    assert_equal ["ab", 3, 1, 2], Shapes.logical("ab", nil, 3)
  end

  def test_countdown
    sleep 0.02
    assert_equal 3, Shapes.countdown(3)
  end
end
