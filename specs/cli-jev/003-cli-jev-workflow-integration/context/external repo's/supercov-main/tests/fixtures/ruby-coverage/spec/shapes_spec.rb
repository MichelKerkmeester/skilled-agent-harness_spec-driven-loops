# frozen_string_literal: true

require_relative "../lib/shapes"

RSpec.describe Shapes do
  it "classifies" do
    expect(Shapes.classify(true, false, true)).to eq(:yes)
    expect(Shapes.classify(false, false, false)).to eq(:no)
    expect(Shapes.classify(true, false, false)).to eq(:half)
  end

  it "loops" do
    expect(Shapes.loops([1, 3, 4], true)).to eq(15)
    expect(Shapes.loops([], false)).to eq(0)
    expect(Shapes.loops([50, 60, 70], true)).to eq(260)
  end

  it "evaluates logical operators" do
    expect(Shapes.logical(nil, 5, nil)).to eq([5, nil, 2, nil])
    expect(Shapes.logical("ab", nil, 3)).to eq(["ab", 3, 1, 2])
    expect(Shapes.logical("ab", 1, nil)).to eq(["ab", 1, 1, 2])
  end

  it "negates" do
    expect(Shapes.negation(true, true)).to eq("both")
    expect(Shapes.negation(true, false)).to eq("not-both")
  end

  it "memoizes" do
    cache = {}
    expect(Shapes.memo(cache, 1)).to eq("11")
    expect(Shapes.memo(cache, 1)).to eq("11")
  end

  it "matches" do
    expect(Shapes.matcher(0)).to eq(:zero)
    expect(Shapes.matcher(500)).to eq(:big)
    expect(Shapes.matcher(7)).to eq(:int)
    expect(Shapes.matcher("x")).to be_nil
  end

  it "pattern matches" do
    expect(Shapes.pattern(9)).to eq(:big)
    expect(Shapes.pattern([3])).to eq(3)
    expect(Shapes.pattern({ k: 4 })).to eq(4)
    expect(Shapes.pattern("s")).to eq(:other)
  end

  it "rescues" do
    expect(Shapes.guarded("12")).to eq(12)
    expect(Shapes.guarded("nope")).to eq(-1)
    expect(Shapes.guarded(nil)).to be_nil
    expect(Shapes.strict("12")).to eq(3)
    expect { Shapes.strict("x") }.to raise_error(RuntimeError)
    expect(Shapes.quiet("ok")).to eq(:ok)
    expect(Shapes.quiet(nil)).to eq(:bad)
  end

  it "handles compact lines and countdowns" do
    expect(Shapes.compact(true, false)).to eq("a")
    expect(Shapes.compact(false, true)).to eq(4)
    expect(Shapes.countdown(3)).to eq(3)
    expect(Shapes.countdown(0)).to eq(0)
  end

  it "reaches child processes and threads" do
    expect(Shapes.spawned("true")).to eq("yes")
    expect(Shapes.threaded([1, nil, 2])).to eq([2, 0, 4])
  end

  it "describes values through lines Ruby does not count" do
    expect(Shapes.describe(nil)).to include(kind: "nothing", label: "")
    expect(Shapes.describe([1, 2])).to include(kind: "many", size: 2)
    expect(Shapes.double(4)).to eq(8)
    expect(Shapes.name_of(nil)).to eq("none")
    expect(Shapes.name_of(7)).to eq("7")
    expect(Shapes.parse_all(%w[1 x 3])).to eq([1, -1, 3])
  end

  it "is pending", :pending do
    raise "not yet"
  end

  xit "is skipped" do
    raise "never runs"
  end
end
