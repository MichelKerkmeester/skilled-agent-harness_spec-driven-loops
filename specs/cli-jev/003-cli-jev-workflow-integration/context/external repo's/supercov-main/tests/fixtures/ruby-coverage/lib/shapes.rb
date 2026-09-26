# frozen_string_literal: true

# Construct corpus for the Ruby frontend. Every branch shape Ruby's Coverage
# module reports, plus everything it does not (operand-level MC/DC, ||=,
# loops, rescue flow, several statements on a line).
module Shapes
  def self.classify(a, b, c)
    if a && (b || c)
      :yes
    elsif a
      :half
    else
      :no
    end
  end

  def self.loops(items, flag)
    total = 0
    items.each { |i| total += i if i > 2 && flag }
    while total > 100
      total -= 50
    end
    for x in items do total += x end
    total
  end

  def self.logical(a, b, c)
    first = a || b
    second = a && (b || c)
    third = a ? 1 : 2
    fourth = a&.size
    [first, second, third, fourth]
  end

  def self.negation(a, b)
    return "not-both" if !(a && b)
    return "unreachable" unless a
    "both"
  end

  def self.memo(cache, key)
    cache[key] ||= key.to_s * 2
    @seen ||= []
    @seen << key
    cache[key]
  end

  def self.matcher(value)
    case value
    when 0 then :zero
    when Integer then value > 100 ? :big : :int
    when Array then :list
    end
  end

  def self.pattern(value)
    case value
    in Integer => n if n > 5 then :big
    in [first, *] then first
    in {k:} then k
    else :other
    end
  end

  def self.guarded(text)
    Integer(text)
  rescue ArgumentError
    -1
  rescue TypeError
    nil
  ensure
    @done = true
  end

  def self.strict(text)
    value = begin
      Integer(text)
    rescue ArgumentError
      raise RuntimeError, "bad input"
    else
      text.length
    end
    value + 1
  end

  def self.quiet(value)
    value.to_sym rescue :bad
  end

  def self.compact(a, b)
    if a then return "a" end
    x = 1; y = 2
    first, second = -> { x }, -> { y }
    first.call + second.call + (b ? 1 : 0)
  end

  def self.countdown(n)
    steps = 0
    steps += 1 until n <= steps
    steps
  end

  def self.spawned(argument)
    script = "require './lib/shapes'; puts Shapes.classify(#{argument}, false, true)"
    output = IO.popen(["ruby", "-e", script], &:read)
    output.strip
  end

  def self.threaded(values)
    results = []
    thread = Thread.new { values.each { |v| results << (v ? v * 2 : 0) } }
    thread.join
    results
  end

  # Lines Ruby's own line table never counts (`kind = case`, `detail = {`,
  # a bare `begin`, `if false`) are probed by the runtime; the `if false`
  # arm is dead code and not an obligation.
  def self.describe(value)
    kind = case
           when value.nil? then "nothing"
           when value.respond_to?(:each) then "many"
           else "one"
           end
    detail = {
      kind: kind,
      size: (value.respond_to?(:size) ? value.size : 1),
    }
    begin
      detail[:label] = value.to_s
    end
    if false
      raise "dead"
    end
    detail
  end

  def self.double(x) = x * 2

  # Both arms return, so the whole `if` has no value and the completion probe
  # goes into each arm instead of around the statement.
  def self.name_of(value)
    if value.nil?
      return "none"
    else
      return value.to_s
    end
  rescue NoMethodError
    "bad"
  end

  def self.parse_all(values)
    values.map { |v| Integer(v) rescue next -1 }
  end
end
