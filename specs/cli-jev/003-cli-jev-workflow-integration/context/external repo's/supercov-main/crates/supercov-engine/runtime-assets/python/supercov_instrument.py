"""The transform of the Supercov Python frontend: probes into a parsed module.

`supercov_probes` imports this only when it compiles a planned file whose
probed bytecode is not cached yet. Every measured interpreter imports
`supercov_probes`, and most of them -- the children of a subprocess-heavy
suite -- only ever load cached bytecode, so the `ast` module and this
transform stay out of their start-up.

Stdlib only, CPython 3.9 or newer.
"""

from __future__ import annotations

import ast

from supercov_probes import PROBE_NAMES, FileProbes, SiteProbes

def _key(node: ast.stmt) -> tuple[int, int]:
    decorators = getattr(node, "decorator_list", None)
    if decorators:
        first = decorators[0]
        # The plan's span opens at the `@`, one column before the expression.
        return (first.lineno, first.col_offset - 1)
    return (node.lineno, node.col_offset)


def _at(node: ast.AST, line: int, column: int) -> ast.AST:
    """Give every node of a generated subtree one source position.

    The position is the statement the probe stands for, so the compiled
    code's line table stays the original file's and a traceback through a
    probe -- there is none, but a profiler's frame is possible -- names the
    real line.
    """
    for child in ast.walk(node):
        child.lineno = line
        child.col_offset = column
        child.end_lineno = line
        child.end_col_offset = column
    return node


def _identifiers(tree: ast.AST) -> set[str]:
    names: set[str] = set()
    for node in ast.walk(tree):
        for field in ("id", "arg", "name", "asname", "attr"):
            value = getattr(node, field, None)
            if isinstance(value, str):
                names.add(value)
        for value in getattr(node, "names", ()):
            if isinstance(value, str):
                names.add(value)
    return names


def choose_alias(tree: ast.AST, stem: str) -> str:
    """A module-level name the file does not use anywhere.

    A single leading underscore: a double one would be mangled inside class
    bodies, and the probes there read the same module global as everywhere.
    """
    taken = _identifiers(tree)
    candidate = f"_scv_{stem}"
    counter = 0
    while candidate in taken:
        counter += 1
        candidate = f"_scv_{stem}{counter}"
    return candidate


def _is_docstring(statement: ast.stmt) -> bool:
    return (
        isinstance(statement, ast.Expr)
        and isinstance(statement.value, ast.Constant)
        and isinstance(statement.value.value, str)
    )


def _is_future_import(statement: ast.stmt) -> bool:
    return isinstance(statement, ast.ImportFrom) and statement.module == "__future__"


def _exits(body: list, make_hit, k: int) -> None:
    """Insert `hit(k)` before every statement that leaves a try body early.

    A `return` anywhere in the body leaves it; a `break` or `continue` leaves
    it only when the loop it belongs to encloses the try. Nested functions,
    classes and lambdas are their own scopes and are not entered.
    """

    def walk(statements: list, loop_depth: int) -> None:
        index = 0
        while index < len(statements):
            statement = statements[index]
            leaves = isinstance(statement, ast.Return) or (
                isinstance(statement, (ast.Break, ast.Continue)) and loop_depth == 0
            )
            if leaves:
                statements.insert(index, make_hit(k, statement.lineno, statement.col_offset))
                index += 1
            elif not isinstance(statement, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                nested_loop = isinstance(statement, (ast.For, ast.AsyncFor, ast.While))
                for field, value in ast.iter_fields(statement):
                    if isinstance(value, list) and value and all(isinstance(item, ast.stmt) for item in value):
                        walk(value, loop_depth + (1 if nested_loop else 0))
                    elif isinstance(value, list):
                        for item in value:
                            # except handlers and match cases carry bodies
                            for inner_field, inner in ast.iter_fields(item) if isinstance(item, ast.AST) else ():
                                if isinstance(inner, list) and inner and all(isinstance(x, ast.stmt) for x in inner):
                                    walk(inner, loop_depth)
            index += 1

    walk(body, 0)


class _Inserter(ast.NodeTransformer):
    """Insert probes into every statement list of a tree.

    Works field by field rather than by node kind, so `Try`'s handlers and
    `finalbody`, `match_case.body`, `TryStar` on 3.11+ and whatever a later
    interpreter adds are covered the same way.
    """

    def __init__(self, probes: FileProbes, names: dict[str, str]) -> None:
        self.probes = probes
        self.hits = names["hits_get"]
        self.value = names["value_probe"]
        self.names = names
        self.inserted = 0
        # Tests of `if` and `while` statements whose outcome their branches
        # record: the expression is left as the program wrote it.
        self.branch_tests: set[int] = set()
        # (limitation id, reason, obligation id): what this file's probes
        # cannot observe, for the runtime to declare.
        self.limitations: list = []

    def _call(self, alias: str, arguments: list, node: ast.AST) -> ast.Call:
        """`alias(*arguments)` positioned on `node`; constants get positions
        too, the wrapped expression keeps its own."""
        call = ast.Call(
            func=ast.Name(id=self.names[alias], ctx=ast.Load()), args=arguments, keywords=[]
        )
        for argument in arguments:
            if isinstance(argument, ast.Constant) and not hasattr(argument, "lineno"):
                _at(argument, node.lineno, node.col_offset)
        _at(call.func, node.lineno, node.col_offset)
        call.lineno, call.col_offset = node.lineno, node.col_offset
        call.end_lineno, call.end_col_offset = node.end_lineno, node.end_col_offset
        self.inserted += 1
        return call

    @staticmethod
    def _span(node: ast.AST):
        return (node.lineno, node.col_offset, node.end_lineno, node.end_col_offset)

    def visit(self, node: ast.AST) -> ast.AST:
        branch_test = id(node) in self.branch_tests
        node = super().visit(node)
        if not isinstance(node, ast.expr) or not hasattr(node, "end_col_offset"):
            return node
        span = self._span(node)
        # Innermost first: a test that is its own single condition becomes
        # `decision(d, condition(d, 0, test, inv))`.
        leaf = self.probes.leaves.get(span)
        if leaf is not None:
            d, index, inverted = leaf
            node = self._call(
                "condition_probe",
                [ast.Constant(value=d), ast.Constant(value=index), node, ast.Constant(value=inverted)],
                node,
            )
        d = self.probes.decisions.get(span)
        if d is not None:
            node = self._call("decision_probe", [ast.Constant(value=d), node], node)
        slot = None if branch_test else self.probes.singles.get(span)
        if slot is not None:
            # `d1(slot, test)`: the truth as written is the whole vector.
            node = self._call("single_probe", [ast.Constant(value=slot), node], node)
        return node

    def visit_BoolOp(self, node: ast.BoolOp) -> ast.AST:
        # A BoolOp inside a decision's tree is observed through its leaves;
        # one outside any decision reports its own short-circuits.
        g = self.probes.boolops.get(self._span(node))
        node = self.generic_visit(node)  # type: ignore[assignment]
        if g is None:
            return node
        for index in range(1, len(node.values)):
            operand = node.values[index]
            node.values[index] = self._call(
                "operand_probe", [ast.Constant(value=g), ast.Constant(value=index), operand], operand
            )
        return self._call("boolop_probe", [ast.Constant(value=g), node], node)

    def _hit(self, k: int, line: int, column: int) -> ast.stmt:
        node = ast.Assign(
            targets=[
                ast.Subscript(
                    value=ast.Call(func=ast.Name(id=self.hits, ctx=ast.Load()), args=[], keywords=[]),
                    slice=ast.Constant(value=k),
                    ctx=ast.Store(),
                )
            ],
            value=ast.Constant(value=1),
        )
        # Which byte it stores: a structural probe right before its head's
        # probe is left out, the head standing for both.
        node._scv_k = k
        self.inserted += 1
        return _at(node, line, column)

    def _hits(self, ks, anchor: ast.AST) -> list[ast.stmt]:
        return [self._hit(k, anchor.lineno, anchor.col_offset) for k in ks]

    def _body(self, statements: list[ast.stmt]) -> list[ast.stmt]:
        out: list[ast.stmt] = []
        for statement in statements:
            k = self.probes.statements.get(_key(statement))
            probe = None if k is None else self._hit(k, statement.lineno, statement.col_offset)
            # Nothing may precede a `from __future__` import, so its probe
            # follows it; if the import raises, the module never runs at all.
            if probe is not None and not _is_future_import(statement):
                out.append(probe)
            visited = self.visit(statement)
            if isinstance(visited, list):
                out.extend(visited)
            else:
                out.append(visited)
            if probe is not None and _is_future_import(statement):
                out.append(probe)
        return out

    # -- branches ------------------------------------------------------------

    def _branches(self, node: ast.AST) -> ast.AST:
        """A one-condition `if` or `while` records its outcome by the branch
        it takes: a byte store at the head of the body for true, and at the
        head of the `else` -- the program's own, or one added -- for false.

        The interpreter's own test decides the branch, so the condition's
        `__bool__` runs exactly once, as it does without Supercov, and no
        call is made. `while`'s `else` runs when the test is false and not
        after a `break`, which is exactly when the test was evaluated false.
        """
        test = node.test  # type: ignore[attr-defined]
        slot = self.probes.singles.get(self._span(test))
        if slot is None:
            return self.generic_visit(node)
        self.branch_tests.add(id(test))
        try:
            node = self.generic_visit(node)
        finally:
            self.branch_tests.discard(id(test))
        if node.test is not test:  # type: ignore[attr-defined]
            return node
        # A branch that starts with its head's probe records the outcome by
        # that probe alone: the layout says the head implies it.
        when_true, when_false = self.probes.single_heads.get(self._span(test), (None, None))
        first = node.body[0]  # type: ignore[attr-defined]
        if when_true is None or getattr(first, "_scv_k", None) != when_true:
            node.body.insert(0, self._hit(slot + 1, first.lineno, first.col_offset))  # type: ignore[attr-defined]
        orelse = node.orelse  # type: ignore[attr-defined]
        if when_false is None or not orelse or getattr(orelse[0], "_scv_k", None) != when_false:
            orelse.insert(0, self._hit(slot, test.lineno, test.col_offset))
        return node

    visit_If = _branches
    visit_While = _branches

    # -- loops ---------------------------------------------------------------

    def _loop(self, node: ast.AST):
        """`for`: a local flag set by the body's first statement, checked after
        the whole statement. `entered` and `zero` are exact per execution."""
        span = self._span(node.iter)  # type: ignore[attr-defined]
        plan = self.probes.loops.get(span)
        node = self.generic_visit(node)
        if plan is None:
            return node
        entered, zero = plan
        flag = f"{self.hits}_f{entered}"
        line, column = node.lineno, node.col_offset
        reset = _at(ast.Assign(targets=[ast.Name(id=flag, ctx=ast.Store())], value=ast.Constant(value=0)), line, column)
        first = node.body[0]  # type: ignore[attr-defined]
        # `flag = hits()[entered] = 1`: the flag and the hit in one statement.
        # A body that starts with its head's probe stores the head's byte
        # here instead, and loses that probe: the head implies `entered`.
        head = self.probes.loop_heads.get(entered)
        if head is not None and getattr(first, "_scv_k", None) == head:
            node.body.pop(0)  # type: ignore[attr-defined]
            entered = head
        mark = _at(
            ast.Assign(
                targets=[
                    ast.Name(id=flag, ctx=ast.Store()),
                    ast.Subscript(
                        value=ast.Call(func=ast.Name(id=self.hits, ctx=ast.Load()), args=[], keywords=[]),
                        slice=ast.Constant(value=entered),
                        ctx=ast.Store(),
                    ),
                ],
                value=ast.Constant(value=1),
            ),
            first.lineno,
            first.col_offset,
        )
        node.body.insert(0, mark)  # type: ignore[attr-defined]
        after = _at(
            ast.If(
                test=ast.UnaryOp(op=ast.Not(), operand=ast.Name(id=flag, ctx=ast.Load())),
                body=[self._hit(zero, line, column)],
                orelse=[],
            ),
            line,
            column,
        )
        self.inserted += 2
        return [reset, node, after]

    visit_For = _loop
    visit_AsyncFor = _loop

    def visit_comprehension(self, node: ast.comprehension) -> ast.AST:
        span = self._span(node.iter)
        node = self.generic_visit(node)  # type: ignore[assignment]
        plan = self.probes.loops.get(span)
        if plan is not None:
            entered, zero = plan
            node.iter = self._call(
                "aiter_probe" if node.is_async else "iter_probe",
                [ast.Constant(value=entered), ast.Constant(value=zero), node.iter],
                node.iter,
            )
        return node

    # -- try -----------------------------------------------------------------

    def _try(self, node: ast.AST):
        first = node.body[0]  # type: ignore[attr-defined]
        plan = self.probes.tries.get((first.lineno, first.col_offset))
        star = type(node).__name__ == "TryStar"
        node = self.generic_visit(node)
        if plan is None:
            return node
        success, handlers, raised, has_finally = plan
        body = node.body  # type: ignore[attr-defined]
        # Completing the body is success, and so is leaving it early: a
        # `return`, or a `break`/`continue` whose loop is outside the try.
        _exits(body, self._hit, success)
        last = body[-1]
        body.append(self._hit(success, last.end_lineno or last.lineno, last.col_offset))
        for index, handler in enumerate(node.handlers):  # type: ignore[attr-defined]
            selected, _, _ = handlers[index]
            anchor = handler.body[0]
            probes = [raised, selected] + [
                missed for selected_, missed, bare in handlers[:index] if not bare
            ]
            handler.body[0:0] = self._hits(probes, anchor)
        catch_all = node.handlers and (  # type: ignore[attr-defined]
            node.handlers[-1].type is None  # type: ignore[attr-defined]
            or (isinstance(node.handlers[-1].type, ast.Name) and node.handlers[-1].type.id == "BaseException")  # type: ignore[attr-defined]
        )
        if star:
            # `except*` splits an exception group across handlers; a clause
            # that matched nothing is not a jump a probe can stand in for.
            for _, missed, bare in handlers:
                if not bare:
                    self.limitations.append(
                        (
                            "python-try-star-miss-unobserved",
                            "an except* clause that matched no exception in the group is not observed",
                            self.probes.relative,
                            # A limitation names the obligation, not one of
                            # its alternatives: the handler's id without the
                            # `:missed` the alternative carries.
                            self.probes.ids[missed - self.probes.base].rsplit(":", 1)[0],
                        )
                    )
        if not star and not catch_all:
            # No handler matched: every typed handler was missed, and a
            # `finally` is reached the way an exception reaches it.
            probes = [missed for _, missed, bare in handlers if not bare]
            if has_finally:
                probes.append(raised)
            anchor = node.handlers[-1] if node.handlers else node  # type: ignore[attr-defined]
            handler = ast.ExceptHandler(
                type=ast.Name(id="BaseException", ctx=ast.Load()),
                name=None,
                body=self._hits(probes, anchor) + [ast.Raise(exc=None, cause=None)],
            )
            _at(handler, anchor.lineno, anchor.col_offset)
            for probe in handler.body[:-1]:
                _at(probe, anchor.lineno, anchor.col_offset)
            node.handlers.append(handler)  # type: ignore[attr-defined]
            self.inserted += 1
        return node

    visit_Try = _try
    visit_TryStar = _try

    # -- match ---------------------------------------------------------------

    def visit_Match(self, node: ast.Match) -> ast.AST:
        plan = self.probes.matches.get((node.lineno, node.col_offset))
        node = self.generic_visit(node)  # type: ignore[assignment]
        if plan is None:
            return node
        cases, no_case = plan
        for index, case in enumerate(node.cases):
            selected, _, _ = cases[index]
            anchor = case.body[0]
            probes = [selected]
            if no_case is not None:
                probes.append(no_case[0])
            probes += [missed for _, missed, irrefutable in cases[:index] if not irrefutable]
            # A later irrefutable case is "not selected" exactly when an
            # earlier one was.
            probes += [missed for _, missed, irrefutable in cases[index + 1 :] if irrefutable]
            case.body[0:0] = self._hits(probes, anchor)
        if not any(irrefutable for _, _, irrefutable in cases):
            probes = [missed for _, missed, irrefutable in cases if not irrefutable]
            if no_case is not None:
                probes.append(no_case[1])
            # match_case has no source coordinates; its pattern does.
            anchor = node.cases[-1].pattern
            wildcard = ast.match_case(
                pattern=ast.MatchAs(pattern=None, name=None),
                guard=None,
                body=self._hits(probes, anchor) or [ast.Pass()],
            )
            _at(wildcard.pattern, anchor.lineno, anchor.col_offset)
            for statement in wildcard.body:
                _at(statement, anchor.lineno, anchor.col_offset)
            node.cases.append(wildcard)
            self.inserted += 1
        return node

    def generic_visit(self, node: ast.AST) -> ast.AST:
        for field, value in ast.iter_fields(node):
            if isinstance(value, list):
                if value and all(isinstance(item, ast.stmt) for item in value):
                    setattr(node, field, self._body(value))
                else:
                    setattr(
                        node,
                        field,
                        [self.visit(item) if isinstance(item, ast.AST) else item for item in value],
                    )
            elif isinstance(value, ast.AST):
                setattr(node, field, self.visit(value))
        return node

    def _function(self, node: ast.AST) -> ast.AST:
        k = self.probes.functions.get(_key(node))  # type: ignore[arg-type]
        node = self.generic_visit(node)
        if k is not None:
            body = node.body  # type: ignore[attr-defined]
            first = body[0]
            # The entry probe is the first statement, after a docstring so
            # `__doc__` is what the file says it is.
            position = 1 if _is_docstring(first) else 0
            anchor = body[position] if position < len(body) else first
            # The first statement's probe, right here, stands for the entry.
            head = self.probes.entry_heads.get(k)
            if head is None or getattr(anchor, "_scv_k", None) != head:
                body.insert(position, self._hit(k, anchor.lineno, anchor.col_offset))
        return node

    visit_FunctionDef = _function
    visit_AsyncFunctionDef = _function

    def visit_Lambda(self, node: ast.Lambda) -> ast.AST:
        node = self.generic_visit(node)  # type: ignore[assignment]
        k = self.probes.lambdas.get(
            (node.lineno, node.col_offset, node.end_lineno, node.end_col_offset)
        )
        if k is not None:
            # A lambda has no statements: its body is wrapped in a call that
            # records the entry and hands the value back unchanged.
            node.body = _at(
                ast.Call(
                    func=ast.Name(id=self.value, ctx=ast.Load()),
                    args=[ast.Constant(value=k), node.body],
                    keywords=[],
                ),
                node.body.lineno,
                node.body.col_offset,
            )  # type: ignore[assignment]
            self.inserted += 1
        return node




def instrument_sites(tree: ast.Module, sites: SiteProbes, alias: str) -> None:
    """Record an assertion site before the first statement on each of its lines."""
    seen: set[int] = set()

    def walk(statements: list) -> None:
        index = 0
        while index < len(statements):
            statement = statements[index]
            if statement.lineno in sites.lines and statement.lineno not in seen:
                seen.add(statement.lineno)
                call = ast.Expr(
                    value=ast.Call(
                        func=ast.Name(id=alias, ctx=ast.Load()),
                        args=[ast.Constant(value=sites.relative), ast.Constant(value=statement.lineno)],
                        keywords=[],
                    )
                )
                statements.insert(index, _at(call, statement.lineno, statement.col_offset))
                index += 1
            for field, value in ast.iter_fields(statement):
                if isinstance(value, list) and value and all(isinstance(item, ast.stmt) for item in value):
                    walk(value)
                elif isinstance(value, list):
                    for item in value:
                        if isinstance(item, ast.AST):
                            for _, inner in ast.iter_fields(item):
                                if isinstance(inner, list) and inner and all(isinstance(x, ast.stmt) for x in inner):
                                    walk(inner)
            index += 1

    walk(tree.body)


def instrument(tree: ast.Module, probes, report=None) -> ast.Module:
    """Insert the plan's probes into a parsed module, in place."""
    if isinstance(probes, SiteProbes):
        alias = choose_alias(tree, "s")
        instrument_sites(tree, probes, alias)
        _import_aliases(tree, {"site_probe": alias})
        return tree
    taken = _identifiers(tree)
    names = {}
    for attribute, stem in PROBE_NAMES.items():
        candidate = f"_scv_{stem}"
        counter = 0
        while candidate in taken:
            counter += 1
            candidate = f"_scv_{stem}{counter}"
        taken.add(candidate)
        names[attribute] = candidate
    inserter = _Inserter(probes, names)
    inserter.visit(tree)
    _import_aliases(tree, names)
    if report is not None:
        for limitation in inserter.limitations:
            report(*limitation)
    return tree


def _import_aliases(tree: ast.Module, names: dict[str, str]) -> None:
    # The aliases are imported from this module so the probes resolve in
    # whatever namespace the file is executed in. After the docstring and
    # any `from __future__` imports, which nothing may precede.
    position = 0
    while position < len(tree.body) and (
        _is_future_import(tree.body[position])
        or (position == 0 and _is_docstring(tree.body[position]))
    ):
        position += 1
    anchor = tree.body[position] if position < len(tree.body) else None
    line, column = (anchor.lineno, anchor.col_offset) if anchor is not None else (1, 0)
    # Fail-safe: probed bytecode can outlive the run in a cache Supercov does
    # not own -- pytest's rewriter caches what it compiles -- and a plain run
    # loading it must still import. Without the runtime the aliases become
    # sinks that accept every probe and record nothing.
    imports = ", ".join(f"{attribute} as {alias}" for attribute, alias in names.items())
    # Conditions take an inversion flag *after* the value. One generic
    # last-argument sink changes program behavior when cached code outlives
    # the runtime. Keep the callable signatures' value positions explicit.
    fallbacks = {
        "condition_probe": "lambda d, i, value, inverted: not not value",
        "decision_probe": "lambda d, value: not not value",
        "single_probe": "lambda k, value: not not value",
        "site_probe": "lambda file, line: None",
    }
    sinks = "\n".join(
        f"    {alias} = {fallbacks.get(attribute, '_scv_sink')}"
        for attribute, alias in names.items()
    )
    fallback = ast.parse(
        f"try:\n    from supercov_probes import {imports}\nexcept ImportError:\n"
        f"    class _scv_sink:\n        def __setitem__(self, key, value):\n            pass\n"
        f"        def __call__(self, *arguments):\n            return arguments[-1] if arguments else self\n"
        f"    _scv_sink = _scv_sink()\n{sinks}\n"
    ).body
    for statement in fallback:
        _at(statement, line, column)
    tree.body[position:position] = fallback
