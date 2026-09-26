# frozen_string_literal: true

# Supercov's stdlib-only Ruby runtime.
#
# Rust decides the denominator ahead of the run and ships it as a probe plan.
# This file, loaded through RUBYOPT before any application code, does three
# things and nothing else:
#
# 1. Starts Ruby's own Coverage module and turns its per-phase deltas into
#    first-sighting hits. On Ruby 3.4+ it asks for line events alone: a
#    statement that starts a branch body or method body proves the branch,
#    the method and the decision outcome (the plan's `implied` map), and the
#    rest is probed. Asking for `branches` and `methods` too made every sample
#    rebuild both tables for every loaded file -- 80% of the runtime's cost.
#    Ruby 3.3 cannot apply probes, so it keeps matching the plan's keys.
# 2. Installs a RubyVM::InstructionSequence.load_iseq hook that splices the
#    plan's probe calls into application sources in memory as they load. The
#    files on disk are never touched; no insertion contains a newline.
# 3. Writes commit-framed evidence records that Rust joins into the run.
#
# It never computes a coverage verdict and never requires anything outside
# the standard library.

require "coverage"
# No `require "json"`: this file loads through RUBYOPT before Bundler sets up,
# and activating the json default gem here would clash with an application
# whose Gemfile pins another version. The plan is a Ruby literal and the
# evidence records use the small encoder below.

module Supercov
  PLAN_VERSION = 1
  EVIDENCE_VERSION = 1
  PLAN_ENV = "SUPERCOV_RUBY_PLAN"
  EVIDENCE_DIR_ENV = "SUPERCOV_RUBY_EVIDENCE_DIR"
  RUN_ID_ENV = "SUPERCOV_RUN_ID"
  WORKER_ENV = "SUPERCOV_RUBY_WORKER"
  CONTEXT_ENV = "SUPERCOV_CONTEXT"
  DEBUG = !ENV["SUPERCOV_RUBY_DEBUG"].to_s.empty?
  # Escape hatch: a comma-separated list of path fragments to measure through
  # Ruby's Coverage module alone, without probe insertions.
  SKIP_PROBES = ENV["SUPERCOV_RUBY_SKIP_PROBES"].to_s.split(",").map(&:strip).reject(&:empty?)

  TRANSPORT_MAGIC = "SCVRUBY1".b
  TRANSPORT_VERSION = 1
  TRANSPORT_HEADER_SIZE = 64
  TRANSPORT_RECORD_HEADER_SIZE = 16
  TRANSPORT_INITIAL_CAPACITY = 1024 * 1024
  TRANSPORT_MAX_CAPACITY = 512 * 1024 * 1024
  TRANSPORT_MAX_RECORD_SIZE = 4 * 1024 * 1024
  MAX_OPEN_EVALUATIONS = 64

  # Evidence transport: a preallocated file of framed JSON records. Each frame
  # is [commit u8][3 zero][length u32][checksum u32][4 zero][payload][pad to 8].
  # The commit byte is written last so a killed process never leaves a
  # committed frame without its payload.
  # JSON output and plan input without the json gem.
  module Encode
    module_function

    # The plan file is a Ruby literal written by Supercov itself.
    def load_plan(path)
      plan = Kernel.eval(File.read(path, encoding: "UTF-8"), TOPLEVEL_BINDING.dup, path, 1) # rubocop:disable Security/Eval
      raise "Supercov Ruby plan #{path} is not a Hash" unless plan.is_a?(Hash)

      plan
    end

    ESCAPES = { '"' => '\\"', "\\" => "\\\\", "\n" => "\\n", "\r" => "\\r", "\t" => "\\t", "\b" => "\\b", "\f" => "\\f" }.freeze

    def json(value, out = +"")
      case value
      when nil then out << "null"
      when true then out << "true"
      when false then out << "false"
      when Integer then out << value.to_s
      when Float
        raise ArgumentError, "non-finite float #{value}" unless value.finite?

        out << value.to_s
      when String then string(value, out)
      when Symbol then string(value.to_s, out)
      when Array
        out << "["
        value.each_with_index do |item, index|
          out << "," if index > 0
          json(item, out)
        end
        out << "]"
      when Hash
        out << "{"
        first = true
        value.each do |key, item|
          out << "," unless first
          first = false
          string(key.to_s, out)
          out << ":"
          json(item, out)
        end
        out << "}"
      else
        string(value.to_s, out)
      end
      out
    end

    def string(text, out)
      text = text.encode("UTF-8", invalid: :replace, undef: :replace) unless text.encoding == Encoding::UTF_8 && text.valid_encoding?
      text = text.scrub unless text.valid_encoding?
      out << '"'
      out << text.gsub(/["\\\x00-\x1f]/) { |char| ESCAPES[char] || format("\\u%04x", char.ord) }
      out << '"'
    end
  end

  # Load-time repair of one file's plan, and the only implementation of the
  # column arithmetic the runtime needs. Ruby decides for itself which lines
  # it will ever count, so a statement whose first line this interpreter does
  # not count is given a probe here, and every key on an affected line moves
  # by the same rule the instrumenter applied to the planned insertions.
  # `scripts/ruby-position-sweep.rb` drives these functions over real corpora,
  # which is what keeps that rule honest.
  module LoadTime
    module_function

    def line_starts(source)
      starts = [0]
      source.each_byte.with_index { |byte, index| starts << index + 1 if byte == 10 }
      starts
    end

    # Probes for the plan's statements whose first line `stub` (Ruby's own
    # `Coverage.line_stub`) shows this interpreter will never count. Returns
    # the insertions and the probe targets they need, numbered from `first_key`.
    # `blocked` ranges (Ractor blocks, where no probe may run) get no probe;
    # their statements come back in the third element for the caller to declare.
    def statement_probes(receiver, first_key, lines, statement_offsets, stub, blocked = [])
      edits = []
      probes = {}
      skipped = []
      key = first_key
      lines.each do |line, id|
        next unless stub[line - 1].nil?

        span = statement_offsets[id]
        next if span.nil?

        if blocked.any? { |start, finish| span[0] >= start && span[0] < finish }
          skipped << id
          next
        end

        probes[key] = { "kind" => "statement", "id" => id }
        edits << { "offset" => span[0], "text" => "#{receiver}.s(#{key}); ", "rank" => "statement", "scope" => span[1] }
        key += 1
      end
      [edits, probes, skipped]
    end

    # Planned and load-time insertions in the order they are applied: where
    # both sit at one offset the load-time probe goes first, so the statement
    # is observed before anything wrapping it.
    def merge_edits(planned, extra)
      return planned if extra.empty?

      ranked = extra.map { |edit| [0, edit] } + planned.map { |edit| [1, edit] }
      ranked.each_with_index.sort_by { |(rank, edit), index| [edit["offset"], rank, index] }.map { |(_, edit), _| edit }
    end

    # The insertions grouped by the line they sit on. A key's span only ever
    # moves because of insertions on its own first and last lines, so this is
    # built once per file and every key then looks at two short lists.
    def index_edits(source, edits)
      starts = line_starts(source)
      by_line = {}
      edits.each do |edit|
        line = line_of(starts, edit["offset"])
        (by_line[line] ||= []) << edit
      end
      { starts: starts, by_line: by_line }
    end

    def line_of(starts, offset)
      low = 0
      high = starts.length - 1
      while low < high
        middle = (low + high + 1) / 2
        if starts[middle] <= offset
          low = middle
        else
          high = middle - 1
        end
      end
      low + 1
    end

    # Where a key's span lands once the insertions are in place. Insertions
    # strictly inside the span move what follows them; at the edges the key's
    # kind decides, exactly as in the instrumenter's `shifted`.
    def shift(span, kind, index)
      starts = index[:starts]
      start_line, start_column = span[0]
      end_line, end_column = span[1]
      start_offset = starts[start_line - 1] + start_column
      end_offset = starts[end_line - 1] + end_column
      start_shift = 0
      (index[:by_line][start_line] || []).each do |edit|
        offset = edit["offset"]
        moves = offset < start_offset ||
          (offset == start_offset &&
            if kind == "point"
              true
            elsif edit["rank"] == "closer"
              false
            elsif kind == "list"
              end_offset < edit["scope"]
            elsif edit["rank"] == "opener"
              end_offset <= edit["scope"]
            else
              true
            end)
        start_shift += edit["text"].bytesize if moves
      end
      end_shift = 0
      (index[:by_line][end_line] || []).each do |edit|
        offset = edit["offset"]
        closer = edit["rank"] == "closer"
        moves = offset < end_offset ||
          (offset == end_offset &&
            if kind == "point"
              true
            elsif closer && kind == "list"
              edit["scope"] >= start_offset
            elsif closer
              edit["scope"] > start_offset
            else
              false
            end)
        end_shift += edit["text"].bytesize if moves
      end
      [[start_line, start_column + start_shift], [end_line, end_column + end_shift]]
    end

    # Sources are read as bytes; Ruby's default source encoding is UTF-8 and a
    # magic comment in the file still overrides it when compiling.
    # The result is UTF-8 whatever the bytes were read as, which is what Ruby
    # assumes for a file it compiles itself; a magic comment in the source
    # still wins. Returning the binary string for a file with no insertions
    # made its literals and regexps ASCII-8BIT under measurement.
    def apply_edits(source, edits)
      return source.dup.force_encoding(Encoding::UTF_8) if edits.empty?

      pieces = []
      cursor = 0
      edits.each do |edit|
        offset = edit["offset"]
        pieces << source.byteslice(cursor, offset - cursor)
        pieces << edit["text"].b
        cursor = offset
      end
      pieces << source.byteslice(cursor, source.bytesize - cursor)
      pieces.join.force_encoding(Encoding::UTF_8)
    end
  end

  class Transport
    attr_reader :path

    def initialize(directory, worker, pid)
      Dir.mkdir(directory) unless Dir.exist?(directory)
      safe_worker = worker.gsub(/[^A-Za-z0-9._-]/, "_")
      token = format("%x-%x", Process.clock_gettime(Process::CLOCK_REALTIME, :nanosecond), object_id & 0xFFFF)
      @path = File.join(directory, "#{safe_worker}.#{pid}.#{token}.mmap")
      @file = File.open(@path, File::RDWR | File::CREAT | File::EXCL, 0o600)
      @file.binmode
      @file.sync = true
      @capacity = TRANSPORT_INITIAL_CAPACITY
      @file.truncate(@capacity)
      @cursor = TRANSPORT_HEADER_SIZE
      @dropped = 0
      @lock = Mutex.new
      header = [TRANSPORT_MAGIC, TRANSPORT_VERSION, TRANSPORT_HEADER_SIZE, @capacity, 0, pid].pack("a8L<L<Q<Q<Q<")
      @file.pwrite(header.ljust(TRANSPORT_HEADER_SIZE, "\0"), 0)
    end

    # Probes fire from whichever thread runs the test, so frame allocation and
    # the two writes happen under one lock; a torn frame would otherwise be
    # read back as corruption.
    def write(record)
      payload = Encode.json(record).b
      @lock.synchronize do
        if payload.bytesize > TRANSPORT_MAX_RECORD_SIZE
          drop
          return
        end
        payload_end = @cursor + TRANSPORT_RECORD_HEADER_SIZE + payload.bytesize
        next_cursor = (payload_end + 7) & ~7
        if next_cursor > @capacity && !grow(next_cursor)
          drop
          return
        end
        frame = [0, 0, 0, 0, payload.bytesize, checksum(payload), 0].pack("CCCCL<L<L<")
        @file.pwrite(frame + payload + ("\0" * (next_cursor - payload_end)), @cursor)
        @file.pwrite("\x01".b, @cursor)
        @cursor = next_cursor
      end
    end

    def close
      @lock.synchronize { @file.close unless @file.closed? }
    end

    private

    def checksum(payload)
      value = 0x811C9DC5
      payload.each_byte do |byte|
        value ^= byte
        value = (value * 0x01000193) & 0xFFFFFFFF
      end
      value
    end

    def grow(required)
      capacity = @capacity
      capacity = [capacity * 2, TRANSPORT_MAX_CAPACITY].min while capacity < required && capacity < TRANSPORT_MAX_CAPACITY
      return false if capacity < required

      @file.truncate(capacity)
      @capacity = capacity
      @file.pwrite([capacity].pack("Q<"), 16)
      true
    end

    def drop
      @dropped += 1
      @file.pwrite([@dropped].pack("Q<"), 24)
    end
  end

  class Runtime
    attr_reader :plan, :root, :worker, :closed
    attr_accessor :adapter_active

    def initialize(plan_path, evidence_dir, run_id, worker)
      @plan = Encode.load_plan(plan_path)
      raise "unsupported Supercov Ruby plan version #{@plan['version'].inspect}" unless @plan["version"] == PLAN_VERSION

      @root = File.realpath(@plan["root"])
      @files = @plan["files"]
      @probes = {}
      @plan["probes"].each { |key, target| @probes[Integer(key)] = target }
      @receiver = @plan["receiver"] || "$__supercov"
      # Keys for probes synthesized at load time never collide with the plan's.
      @dynamic_key = 1 << 40
      @evidence_dir = evidence_dir
      @run_id = run_id
      @worker = worker
      @adapter_active = false
      @closed = false
      @mutex = Mutex.new
      @seen_lock = Mutex.new
      @transport = nil
      @transport_pid = nil
      @context = 0
      @next_context = 1
      @identities = {}
      @seen_hits = {}
      @seen_vectors = {}
      @vector_counts = {}
      @open = {}
      @loop_state = {}
      @arrivals = {}
      @limitations = {}
      @active_threads = {}
      @asserted = {}
      @assertion_hooks = {}
      @seen_sites = {}
      # Files the assertion libraries and this runtime own. A hooked method
      # sits below the helper the test actually called -- every Minitest
      # `assert_equal` reaches `assert` in the same file -- so the caller
      # scan skips these to reach the test's own frame.
      @assertion_frames = { __FILE__ => true }
      @realpath_cache = {}
      @saw_file = false
      @matched_file = false
      # Ruby 3.4 applies Coverage to iseqs compiled through a load hook;
      # 3.3 does not, so it runs on stdlib coverage alone and declares every
      # probe-only obligation unmeasured.
      @probes_supported = (RUBY_VERSION.split(".").first(2).map(&:to_i) <=> [3, 4]) >= 0
      # Coverage's branch and method keys are read only where probes cannot
      # stand in for them.
      @stdlib_keys = !@probes_supported
      compile_file_plans
    end

    def probes_supported? = @probes_supported

    # Ruby's own line table decides which lines can ever be counted. A plan
    # statement whose first line is not countable on this interpreter (the
    # `case ... in` line on 3.3, for example) is declared unmeasured instead
    # of appearing as a gap the tests could never close.
    def declare_uncountable_lines
      @lines_by_file.each_key { |absolute| declare_uncountable_lines_for(absolute) }
    end

    def declare_uncountable_lines_for(absolute)
      lines = @lines_by_file[absolute]
      return if lines.nil? || !File.file?(absolute)

      stub = begin
        Coverage.line_stub(absolute)
      rescue StandardError
        return
      end
      lines.each do |line, id|
        next unless stub[line - 1].nil?

        limitation(
          "ruby-line-not-countable",
          "Ruby #{RUBY_VERSION} records no line event for this statement's first line, so it cannot be observed on this interpreter",
          relative(absolute),
          id,
        )
      end
    end

    def declare_probe_gap(obligations)
      obligations.each do |id|
        limitation(
          "ruby-probe-obligations-need-3.4",
          "Ruby #{RUBY_VERSION} does not measure code compiled by a load hook, so obligations that need a probe (multi-condition decisions, ||=, loops, rescue flow, same-line statements) are unmeasured; Ruby 3.4 or newer measures them",
          nil,
          id,
        )
      end
    end

    # -- plan compilation ---------------------------------------------------

    def compile_file_plans
      @lines_by_file = {}
      @statement_offsets_by_file = {}
      @branch_keys_by_file = {}
      @method_keys_by_file = {}
      @cases_by_file = {}
      @edits_by_file = {}
      @span_field_by_file = {}
      @implied = {}
      @files.each do |relative, file_plan|
        absolute = File.join(@root, relative)
        @lines_by_file[absolute] = file_plan["lines"].transform_keys(&:to_i)
        @statement_offsets_by_file[absolute] = file_plan["statementOffsets"] || {}
        @cases_by_file[absolute] = file_plan["cases"]
        @edits_by_file[absolute] = file_plan["edits"]
        (file_plan["implied"] || {}).each { |id, plan| @implied[id] = plan }
        index_file_keys(absolute, file_plan, @probes_supported ? "span" : "unshifted")
      end
    end

    # Positions the runtime will look for in Ruby's results: the shifted ones
    # while this file carries its insertions, the source's own otherwise.
    def index_file_keys(absolute, file_plan, span_field)
      @span_field_by_file[absolute] = span_field
      keys = {}
      file_plan["branches"].each do |branch|
        key = branch["key"]
        keys[[key["group"], key["branch"], *flatten_span(key[span_field])]] = branch
      end
      @branch_keys_by_file[absolute] = keys
      @method_keys_by_file[absolute] = file_plan["methods"].to_h { |method| [flatten_span(method[span_field]), method["id"]] }
    end

    def flatten_span(span)
      [span[0][0], span[0][1], span[1][0], span[1][1]]
    end

    # -- source transformation ----------------------------------------------

    # Called by the load_iseq hook for every file Ruby is about to compile.
    # Returns nil for files outside the plan so the default loader runs.
    def compile(path)
      return nil unless @probes_supported

      absolute = realpath(path)
      edits = absolute && @edits_by_file[absolute]
      return nil if edits.nil?

      if SKIP_PROBES.any? { |fragment| absolute.include?(fragment) }
        uninstrumented(absolute, "SUPERCOV_RUBY_SKIP_PROBES asked for this file to be measured through Ruby's Coverage module alone")
        return nil
      end

      source = File.binread(path)
      edits = probe_uncountable_lines(absolute, source, edits)
      # Nothing to insert: Ruby's own loader compiles the untouched file, with
      # whatever cache (bootsnap) it keeps, exactly as without Supercov.
      return nil if edits.empty?

      transformed = LoadTime.apply_edits(source, edits)
      RubyVM::InstructionSequence.compile(transformed, path, path, 1)
    rescue SyntaxError, StandardError => error
      # Measuring must never break the program: this file loads unmodified,
      # and everything only a probe could have proven there is declared.
      uninstrumented(
        absolute,
        "Supercov could not compile this file with its probes (#{error.class}: #{error.message.to_s.lines.first.to_s.strip}), so it was measured through Ruby's Coverage module alone",
      )
      nil
    end

    # One file carries no insertions, because compiling it with them failed
    # or because the run asked for it to be left alone. Ruby loads and
    # measures the untouched source instead, so its keys revert to the
    # positions in that source and its probe obligations are declared.
    def uninstrumented(absolute, reason)
      return if absolute.nil? || @edits_by_file.delete(absolute).nil?

      file_plan = @files[relative(absolute)]
      return if file_plan.nil?

      index_file_keys(absolute, file_plan, "unshifted")
      # Only what a probe would have proven is declared: Ruby still applies
      # Coverage to the untouched source, so lines, methods and the branches
      # it reports itself stay measured and keep their place in the total.
      debug("#{relative(absolute)}: #{reason}")
      (file_plan["probeObligations"] || []).each do |id|
        limitation("ruby-file-not-instrumented", reason, relative(absolute), id)
      end
      # Ruby 3.4+ reads no branch or method keys, so what only a key proved
      # in this file, and no line-owned statement implies, is declared too.
      if @probes_supported
        key_only_obligations(file_plan).each do |id|
          limitation("ruby-file-not-instrumented", reason, relative(absolute), id)
        end
      end
      declare_uncountable_lines_for(absolute)
    end

    def key_only_obligations(file_plan)
      keyed = []
      file_plan["branches"].each do |branch|
        keyed.concat(branch["hits"])
        if (decision = branch["decision"])
          keyed << decision["id"] << decision["outcome"]
        end
      end
      file_plan["cases"].each do |case_plan|
        case_plan["clauses"].each { |clause| keyed << clause["missed"] << clause["selected"] }
        if (no_match = case_plan["noMatch"])
          keyed << no_match["matched"] << no_match["unmatched"]
        end
      end
      file_plan["methods"].each { |method| keyed << method["id"] }
      # Implications whose statement Ruby's own line table observes still
      # hold in an untouched file; those behind a probe do not.
      line_owned = file_plan["lines"].values
      implied = (file_plan["implied"] || {}).flat_map do |id, plan|
        next [] unless line_owned.include?(id)

        (plan["hits"] || []) + (plan["decisions"] || []).flat_map { |decision| [decision["id"], decision["outcome"]] }
      end
      (keyed - implied).map { |id| obligation_of(id) }.uniq
    end

    # A point is its own obligation; an alternative belongs to its branch.
    def obligation_of(id)
      id.count(":") >= 3 ? id.rpartition(":").first : id
    end

    # Ruby's own line table decides which lines can be counted. A statement
    # the plan expects to prove by its first line, on a line this interpreter
    # never counts (`begin`, a `case` without subject, a multi-line literal),
    # gets a statement probe here instead, and the stdlib keys on those lines
    # are re-shifted with the same rule Rust applied to the planned edits.
    def probe_uncountable_lines(absolute, source, edits)
      lines = @lines_by_file[absolute]
      offsets = @statement_offsets_by_file[absolute]
      return edits if lines.nil? || lines.empty? || offsets.nil?

      stub = begin
        Coverage.line_stub(absolute)
      rescue StandardError
        return edits
      end
      blocked = @files[relative(absolute)]["ractorBlocks"] || []
      extra, probes, skipped = LoadTime.statement_probes(@receiver, @dynamic_key, lines, offsets, stub, blocked)
      skipped.each do |id|
        limitation(
          "ruby-line-not-countable",
          "Ruby #{RUBY_VERSION} records no line event for this statement's first line, and inside a Ractor block no probe can stand in for it",
          relative(absolute),
          id,
        )
      end
      return edits if extra.empty?

      @probes.merge!(probes)
      @dynamic_key += probes.size
      merged = LoadTime.merge_edits(edits, extra)
      reshift_keys(absolute, source, merged)
      merged
    end

    # The plan's keys are positions in the source Rust transformed; the
    # load-time probes move some of them again.
    def reshift_keys(absolute, source, edits)
      index = LoadTime.index_edits(source, edits)
      file_plan = @files[relative(absolute)]
      file_plan["branches"].each do |branch|
        key = branch["key"]
        key["span"] = LoadTime.shift(key["unshifted"], key["kind"], index)
      end
      file_plan["cases"].each do |case_plan|
        case_plan["clauses"].each do |clause|
          clause["key"]["span"] = LoadTime.shift(clause["key"]["unshifted"], clause["key"]["kind"], index)
        end
        no_match = case_plan["noMatch"]
        no_match["key"]["span"] = LoadTime.shift(no_match["key"]["unshifted"], no_match["key"]["kind"], index) if no_match
      end
      file_plan["methods"].each do |method|
        method["span"] = LoadTime.shift(method["unshifted"], "node", index)
      end
      index_file_keys(absolute, file_plan, "span")
    end

    def realpath(path)
      cached = @realpath_cache[path]
      return cached unless cached.nil?

      resolved = begin
        File.realpath(path)
      rescue SystemCallError
        false
      end
      @realpath_cache[path] = resolved
      resolved
    end

    def relative(absolute)
      return nil unless absolute

      @saw_file = true
      return nil unless absolute.start_with?(@root + "/")

      @matched_file = true
      absolute[(@root.length + 1)..]
    end

    # -- identity -----------------------------------------------------------

    # The phase a probe attributes to: the thread's own phase when a runner
    # drives tests on several threads, else the process-wide current phase
    # (threads a test spawns inherit that).
    def current_context
      Thread.current[:__supercov_context] || @context
    end

    # Enter a test phase (nil for background). Flushes the stdlib coverage
    # delta accumulated for the phase that ends and starts a fresh window.
    # Stdlib counters are process-wide, so a delta collected while another
    # thread is mid-phase belongs to no single test: it goes to the run's
    # background and the run says so. Probe hits stay exact per thread.
    def switch(identity)
      @mutex.synchronize do
        thread = Thread.current
        ending = thread[:__supercov_context] || @context
        settle_arrivals(ending)
        sample_stdlib(thread, ending)
        if identity.nil?
          @context = 0
          thread[:__supercov_context] = nil
          @active_threads.delete(thread)
        else
          @context = @next_context
          @next_context += 1
          stored = {
            "worker" => identity[:worker] || @worker,
            "test" => identity[:test],
            "retry" => identity[:retry].to_i,
            "phase" => identity[:phase],
          }
          @identities[@context] = stored
          record({ "t" => "phase", "ctx" => @context, "at" => now_ms }.merge(stored))
          thread[:__supercov_context] = @context
          @active_threads[thread] = @context
          hook_assertions if identity[:phase] == "call"
        end
        @context
      end
    end

    # Flush the stdlib coverage delta into `context`. Stdlib counters are
    # process-wide, so a delta collected while another thread is mid-phase
    # belongs to no single test: it goes to the run's background and the run
    # says so. Probe hits stay exact per thread.
    def sample_stdlib(thread, context)
      overlapping = @active_threads.any? { |other, ctx| other != thread && ctx != 0 && other.alive? }
      if overlapping
        limitation(
          "ruby-concurrent-test-phases",
          "tests ran concurrently in threads; line, branch and method observations made while phases overlapped are attributed to the run, not to a test (probe observations stay exact)",
        )
        collect_stdlib(0)
      else
        collect_stdlib(context)
      end
    end

    # The first assertion of a call phase. The stdlib delta the phase has
    # accumulated is sampled into it, then the marker says everything the
    # phase recorded so far ran before an assertion; the report links it to
    # that assertion once the phase passes. Sampling once keeps the cost to
    # one `Coverage.result` per test: later assertions cost a hash lookup.
    def assertion
      context = current_context
      return if context.zero? || @asserted[context]

      @mutex.synchronize do
        return if @asserted[context]

        identity = @identities[context]
        return if identity.nil? || identity["phase"] != "call"

        @asserted[context] = true
        sample_stdlib(Thread.current, context)
        record("t" => "assert", "ctx" => context)
      end
    end

    # Where in the test an assertion ran, so an assertion map can tell one
    # site from another. Ruby backtraces carry no column, so this reports the
    # file and line only; the report resolves the column against the syntax
    # inventory Supercov captured before the run, and a frame that is not an
    # inventoried site matches nothing rather than inventing a witness.
    #
    # Recorded once per site per test: the first sighting pays for the caller
    # scan and one write, later ones a hash lookup. Only the call phase is
    # reported, because setup and teardown assertions witness no test.
    #
    # A backtrace costs about as much as the window it asks for, and the
    # test's own frame is usually one or two above the hooked method: every
    # Minitest `assert_equal` calls `assert`, every RSpec `expect(x).to` calls
    # `to`. Ask for a small window and widen only when every frame in it still
    # belongs to the assertion library, which keeps the common call cheap
    # without capping how deep a helper may sit.
    ASSERTION_FRAME_WINDOWS = [4, 24].freeze
    # Frames to skip before the caller: this method, and the hook that called it.
    ASSERTION_FRAME_OFFSET = 2

    def assertion_site
      context = current_context
      return if context.zero?

      identity = @identities[context]
      return if identity.nil? || identity["phase"] != "call"

      ASSERTION_FRAME_WINDOWS.each do |window|
        locations = caller_locations(ASSERTION_FRAME_OFFSET, window) || []
        locations.each do |location|
          path = location.absolute_path || location.path
          next if path.nil?
          next if @assertion_frames[path]

          line = location.lineno
          key = [context, path, line]
          return if @seen_sites[key]

          @seen_lock.synchronize do
            return if @seen_sites[key]

            @seen_sites[key] = true
          end
          record("t" => "asite", "ctx" => context, "f" => path, "l" => line)
          return
        end
        # Every frame was the library's own and the window was full: the
        # caller sits deeper, so look again with a wider one.
        return if locations.length < window
      end
    end

    # Each assertion library reaches the runtime through one method: every
    # Minitest assert_*/refute_* ends in `assert`, every RSpec expectation in
    # `to`/`not_to`, every test-unit assertion runs inside `_wrap_assertion`.
    # Prepending to the module reaches the classes that already include it.
    ASSERTION_METHODS = {
      "Minitest::Assertions" => %i[assert],
      "RSpec::Expectations::ExpectationTarget" => %i[to not_to to_not],
      "Test::Unit::Assertions" => %i[_wrap_assertion],
    }.freeze

    # Hooked when a call phase starts rather than at install, so a library
    # loaded late -- Cucumber pulls rspec-expectations in with its World --
    # is still caught; a hooked library costs one hash lookup per phase.
    def hook_assertions
      return if @assertion_hooks.size == ASSERTION_METHODS.size

      ASSERTION_METHODS.each do |name, methods|
        next if @assertion_hooks[name] || !Object.const_defined?(name)

        owner = Object.const_get(name)
        # The library's own file, so the caller scan can step over the
        # helpers that reach the hooked method.
        methods.each do |method_name|
          next unless owner.method_defined?(method_name) || owner.private_method_defined?(method_name)

          source = owner.instance_method(method_name).source_location
          @assertion_frames[source.first] = true if source&.first
        end
        runtime = self
        hook = Module.new do
          methods.each do |method_name|
            define_method(method_name) do |*args, **options, &block|
              runtime.assertion
              runtime.assertion_site
              super(*args, **options, &block)
            end
          end
        end
        owner.prepend(hook)
        @assertion_hooks[name] = true
      end
    end

    def child_environment
      identity = @identities[current_context]
      return {} if identity.nil?

      { CONTEXT_ENV => [Marshal.dump(identity)].pack("m0") }
    end

    # `file` is where the runner says the test is defined. Assertion maps
    # select tests by source file and name, and a runner identity alone
    # ("CalcTest#test_x", "spec/m_spec.rb[1:1]") is not a path. Adapters that
    # cannot name the file leave it nil and the report falls back to deriving
    # one from the identity.
    def outcome(worker, test, retry_index, phase, outcome, xfail, runner, file = nil)
      @mutex.synchronize do
        entry = {
          "t" => "outcome",
          "worker" => worker,
          "test" => test,
          "retry" => retry_index.to_i,
          "phase" => phase,
          "outcome" => outcome,
          "xfail" => xfail ? true : false,
          "runner" => runner,
        }
        entry["file"] = file if file
        record(entry)
      end
    end

    # -- stdlib coverage deltas ---------------------------------------------

    def collect_stdlib(context)
      result = Coverage.result(stop: false, clear: true)
      result.each do |path, data|
        lines = @lines_by_file[path]
        next if lines.nil?

        executed = data[:oneshot_lines] || []
        executed.each do |line|
          id = lines[line]
          hit(context, id) if id
        end
        next unless @stdlib_keys

        keys = @branch_keys_by_file[path]
        selected = {}
        (data[:branches] || {}).each do |group, branches|
          group_type = group[0].to_s
          branches.each do |branch, count|
            next if count.zero?

            key = [group_type, branch[0].to_s, branch[2], branch[3], branch[4], branch[5]]
            selected[key] = count
            plan = keys[key]
            if plan.nil?
              debug("unmatched stdlib branch key #{key.inspect} in #{path}")
              next
            end
            plan["hits"].each { |id| hit(context, id) }
            if (decision = plan["decision"])
              vector(context, decision["id"], decision["value"] ? "2" : "1", decision["value"])
              hit(context, decision["outcome"])
            end
          end
        end
        derive_cases(context, @cases_by_file[path], selected, @span_field_by_file[path])
        methods = @method_keys_by_file[path]
        (data[:methods] || {}).each do |method, count|
          next if count.zero?

          id = methods[[method[2], method[3], method[4], method[5]]]
          hit(context, id) if id
        end
      end
    end

    # A when/in clause was missed in every execution that selected a later
    # clause or fell through to the implicit else; an explicit else was
    # missed in every execution that selected an earlier clause. Counts, not
    # flags: one phase can hold both kinds of execution.
    def derive_cases(context, cases, selected, span_field)
      cases.each do |case_plan|
        clauses = case_plan["clauses"]
        no_match = case_plan["noMatch"]
        counts = clauses.map { |clause| selected[key_of(clause["key"], span_field)] || 0 }
        implicit = no_match ? (selected[key_of(no_match["key"], span_field)] || 0) : 0
        if no_match
          hit(context, no_match["unmatched"]) if implicit.positive?
          hit(context, no_match["matched"]) if counts.sum.positive?
        end
        clauses.each_with_index do |clause, index|
          later = counts[(index + 1)..].sum + implicit
          earlier = counts[0...index].sum
          explicit_else = clause["key"]["branch"] == "else"
          missed = explicit_else ? earlier.positive? : later.positive?
          hit(context, clause["missed"]) if missed
        end
      end
    end

    def key_of(key, span_field)
      [key["group"], key["branch"], *flatten_span(key[span_field])]
    end

    # -- observations -------------------------------------------------------

    def hit(context, id)
      key = [context, id]
      return if @seen_hits[key]

      @seen_lock.synchronize do
        return if @seen_hits[key]

        @seen_hits[key] = true
      end
      record("t" => "hit", "ctx" => context, "id" => id)
      imply(context, id)
    end

    # What one observation proves besides itself: the branch alternatives and
    # the method whose body starts with this statement, and the
    # single-condition decision outcome it decides. One hash lookup per first
    # sighting; nothing per execution.
    def imply(context, id)
      implied = @implied[id]
      return if implied.nil?

      (implied["hits"] || []).each { |other| hit(context, other) }
      (implied["decisions"] || []).each do |decision|
        vector(context, decision["id"], decision["value"] ? "2" : "1", decision["value"])
        hit(context, decision["outcome"])
      end
    end

    def vector(context, decision_id, digits, outcome)
      key = [context, decision_id, digits]
      return if @seen_vectors[key]

      @seen_lock.synchronize do
        return if @seen_vectors[key]

        @seen_vectors[key] = true
        count_key = [context, decision_id]
        @vector_counts[count_key] = (@vector_counts[count_key] || 0) + 1
      end
      record("t" => "dec", "ctx" => context, "id" => decision_id, "v" => digits, "o" => outcome ? 1 : 0)
    end

    def limitation(id, reason, file = nil, obligation = nil)
      key = [id, file, obligation]
      return if @limitations[key]

      @limitations[key] = true
      entry = { "t" => "limitation", "id" => id, "reason" => reason }
      entry["file"] = file if file
      entry["obligation"] = obligation if obligation
      record(entry)
    end

    # -- probe callbacks (the receiver bound to $__supercov) ----------------

    # Condition leaf: records the operand's truthiness and passes it through.
    def probe_condition(key, index, value)
      target = @probes[key]
      frame_key = [current_context, key]
      stack = (@open[frame_key] ||= [])
      last = stack.last
      if last.nil? || index <= last[:last]
        stack.shift if stack.length >= MAX_OPEN_EVALUATIONS
        last = { values: Array.new(target["width"]), last: -1 }
        stack << last
      end
      last[:last] = index
      last[:values][index] = value ? true : false
      value
    end

    # Decision outcome: closes the innermost open evaluation.
    def probe_decision(key, value)
      target = @probes[key]
      frame_key = [current_context, key]
      stack = @open[frame_key]
      frame = stack && stack.pop
      truthy = value ? true : false
      values = if frame
                 frame[:values]
               elsif target["width"] == 1
                 # A lone condition carries no c() wrapper: its value is the
                 # outcome, read back through the condition's own negation.
                 [target["not"][0] ? !truthy : truthy]
               else
                 Array.new(target["width"])
               end
      finish_decision(target, values, truthy)
      value
    end

    def finish_decision(target, values, outcome)
      values = values.map { |v| v.nil? ? nil : v }
      target["not"].each_with_index do |negated, index|
        values[index] = !values[index] if negated && !values[index].nil?
      end
      expected = evaluate_tree(target["tree"], values)
      if expected.nil? || expected != outcome
        limitation("ruby-decision-vector-inconsistent", "observed condition values do not evaluate to the observed outcome", nil, target["id"])
        return
      end
      digits = values.map { |v| v.nil? ? "0" : (v ? "2" : "1") }.join
      vector(current_context, target["id"], digits, outcome)
      hit(current_context, outcome ? target["outcomeTrue"] : target["outcomeFalse"])
      target["logical"].each do |logical|
        previous = logical["previousLeaves"].any? { |i| !values[i].nil? }
        operand = logical["operandLeaves"].any? { |i| !values[i].nil? }
        if operand
          hit(current_context, logical["evaluated"])
        elsif previous
          hit(current_context, logical["shortCircuit"])
        end
      end
    end

    def evaluate_tree(tree, values)
      return values[tree] if tree.is_a?(Integer)

      op = tree["op"]
      result = nil
      tree["items"].each do |item|
        result = evaluate_tree(item, values)
        return nil if result.nil?
        break if (op == "and" && result == false) || (op == "or" && result == true)
      end
      return nil if result.nil?

      tree["negate"] ? !result : result
    end

    # while/until predicate: a decision plus the loop's zero/entered outcomes.
    def probe_while(key, value)
      target = @probes[key]
      truthy = value ? true : false
      probe_decision(key, value)
      loop_target = target["loop"]
      if loop_target
        enters = loop_target["until"] ? !truthy : truthy
        state_key = [current_context, loop_target["id"]]
        expecting_first = !@loop_state.key?(state_key) || @loop_state[state_key]
        if enters
          hit(current_context, loop_target["entered"]) if expecting_first
          @loop_state[state_key] = false
        else
          hit(current_context, loop_target["zero"]) if expecting_first
          @loop_state[state_key] = true
        end
      end
      value
    end

    # for-loop head: the next body probe decides between zero and entered.
    def probe_for(key, collection)
      target = @probes[key]
      state_key = [current_context, target["id"]]
      hit(current_context, target["zero"]) if @loop_state[state_key] == :pending
      @loop_state[state_key] = :pending
      collection
    end

    def probe_for_body(key)
      target = @probes[key]
      state_key = [current_context, target["id"]]
      hit(current_context, target["entered"]) if @loop_state[state_key] == :pending
      @loop_state[state_key] = :entered
      nil
    end

    # Value-context `&&`/`||`/`||=`/`&&=`: the left operand decides the branch.
    def probe_logical(key, left)
      target = @probes[key]
      truthy = left ? true : false
      short = target["op"] == "or" ? truthy : !truthy
      hit(current_context, short ? target["shortCircuit"] : target["evaluated"])
      left
    end

    # Operator assignment on a target that cannot be re-read: `pre` counts
    # arrivals, `es` counts right sides that started. An arrival whose right
    # side never started was a short-circuit; the check runs at the next
    # arrival and when the phase ends, so recursion inside the right side
    # cannot be mistaken for one.
    def probe_arrival(key)
      target = @probes[key]
      state = (@arrivals[[current_context, key]] ||= [0, 0])
      settle_arrival(current_context, target, state)
      state[0] += 1
      nil
    end

    def probe_evaluation_started(key)
      target = @probes[key]
      state = (@arrivals[[current_context, key]] ||= [0, 0])
      state[1] += 1
      hit(current_context, target["evaluated"])
      nil
    end

    def settle_arrival(context, target, state)
      hit(context, target["shortCircuit"]) if state[0] > state[1]
    end

    def settle_arrivals(context)
      @arrivals.each do |(ctx, key), state|
        next unless ctx == context

        settle_arrival(ctx, @probes[key], state)
      end
    end

    def probe_statement(key)
      hit(current_context, @probes[key]["id"])
      nil
    end

    # `&.`: the receiver decides which alternative ran.
    def probe_safe_navigation(key, value)
      target = @probes[key]
      hit(current_context, value.nil? ? target["nil"] : target["called"])
      value
    end

    # Where a branch or method body would start when it has no statement.
    def probe_hits(key)
      @probes[key]["ids"].each { |id| hit(current_context, id) }
      nil
    end

    # rescue flow
    def probe_handler(key, index)
      target = @probes[key]
      hit(current_context, target["raised"])
      handlers = target["handlers"]
      hit(current_context, handlers[index]["selected"])
      handlers[0...index].each { |handler| hit(current_context, handler["missed"]) }
      nil
    end

    def probe_propagated(key)
      target = @probes[key]
      hit(current_context, target["raised"])
      target["handlers"].each { |handler| hit(current_context, handler["missed"]) }
      nil
    end

    def probe_ok(key, value)
      hit(current_context, @probes[key]["success"])
      value
    end

    def probe_ok0(key)
      hit(current_context, @probes[key]["success"])
      nil
    end

    def probe_rescue_modifier(key, value)
      hit(current_context, @probes[key]["raised"])
      value
    end

    # -- transport ----------------------------------------------------------

    def record(entry)
      ensure_transport
      @transport.write(entry)
    end

    def ensure_transport
      pid = Process.pid
      return if @transport && @transport_pid == pid

      # A forked child inherits the parent's Ruby objects; it must own its
      # own evidence file and re-declare the phase it is running inside.
      forked = !@transport_pid.nil?
      @transport&.close if forked
      worker = forked ? "#{@worker}-#{pid}" : @worker
      @worker = worker
      @transport = Transport.new(@evidence_dir, worker, pid)
      @transport_pid = pid
      @transport.write(
        "t" => "process",
        "v" => EVIDENCE_VERSION,
        "run" => @run_id,
        "pid" => pid,
        "worker" => worker,
        "ruby" => RUBY_VERSION,
        "executable" => RbConfig.ruby,
        "argv" => ARGV.dup,
      )
      identity = @identities[@context]
      @transport.write({ "t" => "phase", "ctx" => @context, "at" => now_ms }.merge(identity)) if forked && @context != 0 && identity
    end

    def close
      unmatched = @mutex.synchronize do
        return if @closed

        settle_arrivals(@context)
        collect_stdlib(@context)
        @closed = true
        record("t" => "exit", "at" => now_ms)
        @transport&.close
        @worker == "main" && @saw_file && !@matched_file
      end
      return unless unmatched

      # Every file Ruby loaded lay outside the measured tree, which is what a
      # run reports as zero coverage without a word of explanation. Name the
      # root so the mismatch is visible.
      warn "[supercov] none of the files Ruby loaded lay under the measured root #{@root}"
    end

    def now_ms
      Process.clock_gettime(Process::CLOCK_REALTIME, :millisecond)
    end

    def debug(message)
      warn("[supercov:debug] #{message}") if DEBUG
    end
  end

  # The object bound to $__supercov. Method names are short because they are
  # spliced into user source; each forwards to the runtime.
  class Probe
    def initialize(runtime)
      @runtime = runtime
    end

    def c(key, index, value) = @runtime.probe_condition(key, index, value)
    def d(key, value) = @runtime.probe_decision(key, value)
    def w(key, value) = @runtime.probe_while(key, value)
    def f(key, collection) = @runtime.probe_for(key, collection)
    def fb(key) = @runtime.probe_for_body(key)
    def l(key, left) = @runtime.probe_logical(key, left)
    def pre(key) = @runtime.probe_arrival(key)
    def es(key) = @runtime.probe_evaluation_started(key)
    def s(key) = @runtime.probe_statement(key)
    def n(key, value) = @runtime.probe_safe_navigation(key, value)
    def hs(key) = @runtime.probe_hits(key)
    def h(key, index) = @runtime.probe_handler(key, index)
    def hm(key, value) = @runtime.probe_rescue_modifier(key, value)
    def hm0(key) = @runtime.probe_rescue_modifier(key, nil)
    def p(key) = @runtime.probe_propagated(key)
    def ok(key, value) = @runtime.probe_ok(key, value)
    def ok0(key) = @runtime.probe_ok0(key)
  end

  module Loader
    def load_iseq(path)
      runtime = Supercov.runtime
      if runtime && !runtime.closed
        compiled = runtime.compile(path)
        return compiled if compiled
      end
      defined?(super) ? super : nil
    end
  end

  # Runner adapters attach when their classes finish defining.
  module Attach
    def self.install(runtime)
      tracer = TracePoint.new(:end) do |tp|
        name = tp.self.name
        if name == "RSpec::Core::Example"
          require_relative "supercov_rspec"
          Supercov::RSpecAdapter.install(runtime)
        elsif name == "Minitest::Test"
          require_relative "supercov_minitest"
          Supercov::MinitestAdapter.install(runtime)
        elsif name == "Test::Unit::TestCase"
          require_relative "supercov_testunit"
          Supercov::TestUnitAdapter.install(runtime)
        elsif name == "Cucumber::Runtime"
          require_relative "supercov_cucumber"
          Supercov::CucumberAdapter.install(runtime)
        end
      rescue StandardError => error
        runtime.limitation("ruby-runner-adapter-failed", "runner adapter failed to install: #{error.class}: #{error.message}")
      end
      tracer.enable
    end
  end

  # Child processes and threads inherit the current phase identity.
  module Propagation
    def self.install(runtime)
      Process.singleton_class.prepend(Module.new do
        define_method(:spawn) do |*args, **kwargs, &block|
          args = Supercov::Propagation.with_environment(runtime, args)
          super(*args, **kwargs, &block)
        end
      end)
      Kernel.singleton_class.prepend(Module.new do
        define_method(:spawn) do |*args, **kwargs, &block|
          args = Supercov::Propagation.with_environment(runtime, args)
          super(*args, **kwargs, &block)
        end
        define_method(:system) do |*args, **kwargs, &block|
          args = Supercov::Propagation.with_environment(runtime, args)
          super(*args, **kwargs, &block)
        end
      end)
      Kernel.prepend(Module.new do
        define_method(:spawn) do |*args, **kwargs, &block|
          args = Supercov::Propagation.with_environment(runtime, args)
          super(*args, **kwargs, &block)
        end
        define_method(:system) do |*args, **kwargs, &block|
          args = Supercov::Propagation.with_environment(runtime, args)
          super(*args, **kwargs, &block)
        end
      end)
      IO.singleton_class.prepend(Module.new do
        define_method(:popen) do |*args, **kwargs, &block|
          args = Supercov::Propagation.with_environment(runtime, args)
          super(*args, **kwargs, &block)
        end
      end)
    end

    def self.with_environment(runtime, args)
      additions = runtime.child_environment
      return args if additions.empty?

      if args.first.is_a?(Hash)
        [args.first.merge(additions), *args[1..]]
      else
        [additions, *args]
      end
    end
  end

  @runtime = nil

  def self.runtime
    @runtime
  end

  def self.install
    return @runtime if @runtime

    plan_path = ENV[PLAN_ENV]
    evidence_dir = ENV[EVIDENCE_DIR_ENV]
    run_id = ENV[RUN_ID_ENV]
    return nil if plan_path.to_s.empty? || evidence_dir.to_s.empty? || run_id.to_s.empty?

    worker = ENV[WORKER_ENV].to_s
    if worker.empty?
      number = ENV["TEST_ENV_NUMBER"].to_s
      worker = number.empty? ? "main" : "worker-#{number}"
    end
    keys = (RUBY_VERSION.split(".").first(2).map(&:to_i) <=> [3, 4]).negative?
    Coverage.start(oneshot_lines: true, **(keys ? { branches: true, methods: true } : {}))
    runtime = Runtime.new(plan_path, evidence_dir, run_id, worker)
    $__supercov = Probe.new(runtime)
    RubyVM::InstructionSequence.singleton_class.prepend(Loader)
    @runtime = runtime
    inherited = ENV[CONTEXT_ENV]
    if inherited && !inherited.empty?
      begin
        identity = Marshal.load(inherited.unpack1("m0"))
        raise TypeError, "identity is not a Hash" unless identity.is_a?(Hash)

        runtime.switch(worker: identity["worker"], test: identity["test"], retry: identity["retry"], phase: identity["phase"])
      rescue ArgumentError, TypeError, KeyError
        runtime.limitation("ruby-inherited-context-invalid", "SUPERCOV_CONTEXT was not a valid Supercov identity")
      end
    end
    runtime.declare_probe_gap(runtime.plan["probeObligations"] || []) unless runtime.probes_supported?
    runtime.declare_uncountable_lines unless runtime.probes_supported?
    Attach.install(runtime)
    Propagation.install(runtime)
    at_exit { runtime.close }
    runtime
  rescue StandardError => error
    warn("[supercov] Ruby runtime disabled: #{error.class}: #{error.message}")
    nil
  end
end

Supercov.install
