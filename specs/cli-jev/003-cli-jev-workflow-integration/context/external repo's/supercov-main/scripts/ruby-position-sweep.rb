# frozen_string_literal: true

# Development gate for the Ruby frontend. For every file in a corpus it
# applies the plan's insertions the way the runtime does, adds the runtime's
# own load-time probes for lines this interpreter will not count, and checks
# against Ruby itself that
#   1. the transformed source compiles and keeps its line count,
#   2. every stdlib branch key the plan expects exists in the untouched
#      source where the plan says (Ruby 3.3 reads the keys there; 3.4+ reads
#      no keys at all, so the transformed positions are not checked),
#   3. every statement the plan expects to prove by a line is either on a
#      countable line or carries a load-time probe.
#
# With `--load` it also runs each file twice, once untouched and once
# transformed, each in its own process, and checks that
#   4. the transformation changed nothing: a file that loads untouched still
#      loads with its probes, which exercises every wrapped expression, and
#      defines the same number of methods.
# Library files that cannot load outside their own dependency tree fail both
# runs and are skipped.
#
# The runtime's own `Supercov::LoadTime` does the transformation and the
# column arithmetic here, so this sweep tests the code that ships.
#
# Usage:
#   cargo run -p supercov-engine --example ruby_plan -- FILES... > plan.json
#   ruby scripts/ruby-position-sweep.rb [--load] plan.json
#
# Exit status is non-zero when any file fails. Ruby 3.4+ is required, since
# 3.3 does not apply Coverage to code compiled by hand.

require "coverage"
require "json"
require_relative "../runtime/ruby/supercov_runtime"

# One file, transformed the way the runtime transforms it.
class SweptFile
  attr_reader :path, :plan, :source, :transformed, :probed_lines

  def initialize(path, plan)
    @path = path
    @plan = plan
    @source = File.binread(path)
    stub = begin
      Coverage.line_stub(path)
    rescue StandardError
      []
    end
    lines = plan["lines"].to_h { |line, id| [line.to_i, id] }
    extra, probes = Supercov::LoadTime.statement_probes(
      "$__supercov", 1 << 40, lines, plan["statementOffsets"] || {}, stub
    )
    @probed_lines = probes.each_value.to_h { |target| [target["id"], true] }
    @edits = Supercov::LoadTime.merge_edits(plan["edits"], extra)
    @transformed = Supercov::LoadTime.apply_edits(@source, @edits)
    @index = Supercov::LoadTime.index_edits(@source, @edits)
  end

  def shifted(span, kind) = Supercov::LoadTime.shift(span, kind, @index)

  # The keys as Ruby 3.3 looks them up: positions in the untouched source. A
  # key that proves nothing (an `if` whose decision is probed and whose arms
  # own their lines) is not checked: Ruby folds some of those away entirely,
  # `if x and false` for one, and nothing depends on them.
  def branch_keys
    plan["branches"].filter_map do |branch|
      next if branch["hits"].empty? && branch["decision"].nil?

      key = branch["key"]
      ["branch", key["group"], key["branch"], *key["unshifted"].flatten]
    end
  end

  # Statements the plan proves by their first line, and whether that line is
  # countable in the transformed source or carries a load-time probe.
  def unprovable_lines(reported_lines)
    plan["lines"].filter_map do |line, id|
      next if @probed_lines[id] || !reported_lines[line.to_i - 1].nil?

      "line #{line} is neither countable nor probed"
    end
  end
end

# Probe receiver for `--load`: every call returns exactly what the original
# expression evaluated to, so a file that behaves differently under probes
# raises here instead of passing silently.
class StubProbe
  def c(_key, _index, value) = value
  def d(_key, value) = value
  def w(_key, value) = value
  def f(_key, value) = value
  def l(_key, value) = value
  def ok(_key, value) = value
  def hm(_key, value) = value
  def fb(_key) = nil
  def pre(_key) = nil
  def es(_key) = nil
  def s(_key) = nil
  def n(_key, value) = value
  def hs(_key) = nil
  def h(_key, _index) = nil
  def hm0(_key) = nil
  def p(_key) = nil
  def ok0(_key) = nil
end

# `--load-one` runs in its own process: load one file, with or without its
# insertions, and report where Ruby says its methods are.
def load_one(plan_path, path, probed)
  plans = JSON.parse(File.read(plan_path))
  file = SweptFile.new(path, plans.fetch(path))
  synthetic = "/supercov-sweep/#{File.basename(path)}"
  $__supercov = StubProbe.new
  Coverage.start(lines: true, branches: true, methods: true)
  begin
    source = probed ? file.transformed : file.source.dup.force_encoding(Encoding::UTF_8)
    RubyVM::InstructionSequence.compile(source, synthetic, synthetic, 1).eval
  rescue Exception => error # rubocop:disable Lint/RescueException
    puts JSON.generate("status" => "unloadable", "error" => "#{error.class}: #{error.message.to_s.lines.first.to_s.strip}")
    return
  end
  reported = Coverage.result(stop: true, clear: true)[synthetic] || {}
  methods = (reported[:methods] || {}).keys.map { |method| [method[1].to_s, method[2], method[3], method[4], method[5]] }
  puts JSON.generate("status" => "loaded", "methods" => methods)
end

# A child that hangs (a file that starts a server at load, say) must not stop
# the sweep.
def run_child(arguments, timeout)
  output = +""
  reader, writer = IO.pipe
  pid = Process.spawn(*arguments, out: writer, err: File::NULL)
  writer.close
  deadline = Process.clock_gettime(Process::CLOCK_MONOTONIC) + timeout
  loop do
    remaining = deadline - Process.clock_gettime(Process::CLOCK_MONOTONIC)
    if remaining <= 0 || IO.select([reader], nil, nil, remaining).nil?
      Process.kill("KILL", pid)
      break
    end
    chunk = begin
      reader.read_nonblock(4096)
    rescue IO::WaitReadable
      next
    rescue EOFError
      break
    end
    output << chunk
  end
  reader.close
  Process.wait(pid)
  output
end

def load_result(plan_path, path, probed)
  output = run_child([RbConfig.ruby, __FILE__, "--load-one", plan_path, path, probed ? "probed" : "plain"], 20)
  JSON.parse(output.to_s.lines.last.to_s)
rescue JSON::ParserError
  { "status" => "crashed", "error" => output.to_s.lines.last.to_s.strip }
end

if ARGV.first == "--load-one"
  load_one(ARGV.fetch(1), ARGV.fetch(2), ARGV.fetch(3) == "probed")
  exit 0
end

load_mode = ARGV.delete("--load")
plan_path = ARGV.fetch(0)
plans = JSON.parse(File.read(plan_path))
Coverage.start(lines: true, branches: true, methods: true)

files = 0
failures = 0
probed_at_runtime = 0
loaded = 0
methods_seen = 0
plans.each do |path, plan|
  files += 1
  if plan["parseError"]
    puts "PARSE  #{path}: #{plan['parseError']}"
    failures += 1
    next
  end
  file = SweptFile.new(path, plan)
  probed_at_runtime += file.probed_lines.size
  if file.transformed.count("\n") != file.source.count("\n")
    puts "LINES  #{path}: line count changed"
    failures += 1
    next
  end
  # A synthetic path keeps Coverage entries apart between files.
  synthetic = "/supercov-sweep/#{files}/#{File.basename(path)}"
  begin
    RubyVM::InstructionSequence.compile(file.transformed, synthetic, synthetic, 1)
  rescue SyntaxError => error
    puts "SYNTAX #{path}: #{error.message.lines.first&.strip}"
    failures += 1
    next
  end
  # The untouched source, compiled apart, is where Ruby 3.3 reads the keys.
  plain_synthetic = "/supercov-sweep/#{files}/plain/#{File.basename(path)}"
  RubyVM::InstructionSequence.compile(file.source.dup.force_encoding(Encoding::UTF_8), plain_synthetic, plain_synthetic, 1)
  results = Coverage.result(stop: false, clear: true)
  reported = results[synthetic]
  plain_reported = results[plain_synthetic]
  if reported.nil? || plain_reported.nil?
    puts "COVER  #{path}: Ruby reported no coverage for the compiled file"
    failures += 1
    next
  end
  ruby_keys = {}
  plain_reported[:branches].each do |group, branches|
    branches.each_key do |branch|
      ruby_keys[["branch", group[0].to_s, branch[0].to_s, branch[2], branch[3], branch[4], branch[5]]] = true
    end
  end
  missing = file.branch_keys.reject { |key| ruby_keys[key] }.map { |key| "branch #{key[1..].inspect}" }
  missing.concat(file.unprovable_lines(reported[:lines]))
  if load_mode
    plain = load_result(plan_path, path, false)
    if plain["status"] == "loaded"
      probed = load_result(plan_path, path, true)
      if probed["status"] == "loaded"
        loaded += 1
        methods_seen += plain["methods"].length
        if plain["methods"].length != probed["methods"].length
          missing << "defines #{plain['methods'].length} method(s) untouched but #{probed['methods'].length} with probes"
        end
      else
        missing << "loads untouched but not with its probes: #{probed['error']}"
      end
    end
  end
  next if missing.empty?

  failures += 1
  puts "KEYS   #{path}:"
  missing.first(8).each { |entry| puts "         #{entry}" }
  puts "         ... #{missing.length - 8} more" if missing.length > 8
end

summary = "#{files} file(s), #{failures} failing, #{probed_at_runtime} statement line(s) probed at load time because Ruby does not count them"
summary += ", #{loaded} file(s) loaded and #{methods_seen} method key(s) checked" if load_mode
puts summary
exit(failures.zero? ? 0 : 1)
