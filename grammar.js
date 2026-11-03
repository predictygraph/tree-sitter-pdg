// SPDX-FileCopyrightText: 2026 Reza Jelveh
//
// SPDX-License-Identifier: Apache-2.0

/**
 * @file Tree-sitter grammar for predictygraph (.pdg) diagrams
 * @license Apache-2.0
 * Mirrors docs/SPEC.md and src/predictygraph/parser.py in the main repo.
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'pdg',

  extras: $ => [/[ \t]/, $.comment],

  externals: $ => [],

  word: $ => $.identifier,

  rules: {
    source_file: $ => optional($._statements),

    // statements are separated by newlines or ';'
    _statements: $ => choice(
      seq($._statement, repeat(seq($._terminator, optional($._statement)))),
      seq(repeat1(seq($._terminator, optional($._statement)))),
    ),

    _terminator: _ => choice(/\r?\n/, ';'),

    _statement: $ => choice(
      $.graph_statement,
      $.css_import,
      $.css_block,
      $.default_statement,
      $.group,
      $.let_statement,
      $.def_statement,
      $.use_statement,
      $.edge_statement,
      $.node_statement,
    ),

    graph_statement: $ => prec.right(2, seq('graph', repeat($._modifier))),

    css_import: $ => seq('css', field('path', $.string)),

    css_block: $ => seq('css', '{', optional(alias($._css_body, $.css_content)), '}'),
    _css_body: $ => repeat1(choice(/[^{}]+/, seq('{', optional($._css_body), '}'))),

    default_statement: $ => prec.right(seq(
      'default',
      field('kind', choice('node', 'edge', 'group')),
      repeat($._modifier),
    )),

    group: $ => seq(
      'group',
      field('id', $.identifier),
      optional(field('label', $._label)),
      repeat($._modifier),
      $.block,
    ),

    // let NAME = VALUE
    let_statement: $ => seq(
      'let',
      field('name', $.identifier),
      '=',
      field('value', choice($.string, $.variable, alias(/[^\s{}";$][^\s{}";]*/, $.value))),
    ),

    // def NAME [PARAM[=DEFAULT]...] { ... }
    def_statement: $ => seq(
      'def',
      field('name', $.identifier),
      repeat($.parameter),
      $.block,
    ),

    parameter: $ => seq(
      field('name', $.identifier),
      optional(seq(token.immediate('='), field('default', $._attribute_value))),
    ),

    // use NAME ID ["Label"] [.class...] [PARAM=VALUE...]
    use_statement: $ => prec.right(seq(
      'use',
      field('block', $.identifier),
      field('id', $.identifier),
      optional(field('label', $._label)),
      repeat($._modifier),
    )),

    block: $ => seq('{', optional($._statements), '}'),

    node_statement: $ => prec.right(1, seq(
      field('id', $.identifier),
      optional(field('label', $._label)),
      repeat($._modifier),
    )),

    edge_statement: $ => prec.right(seq(
      $.endpoints,
      repeat1(seq($.arrow, $.endpoints)),
      optional(field('label', $._label)),
      repeat($._modifier),
    )),

    endpoints: $ => prec.left(seq($.identifier, repeat(seq(',', $.identifier)))),

    // `<?[-=.]+>` | `<[-=.]+` | `[-=.]{2,}`
    arrow: _ => token(choice(/<?[-=.]+>/, /<[-=.]+/, /[-=.][-=.]+/)),

    _modifier: $ => choice($.class, $.attribute),

    class: $ => token(seq('.', /\$?[A-Za-z_][\w-]*/)),

    attribute: $ => seq(
      field('key', alias($.identifier, $.attribute_name)),
      token.immediate('='),
      field('value', $._attribute_value),
    ),

    _attribute_value: $ => choice(
      alias(token.immediate(/"(?:[^"\\]|\\.)*"/), $.string),
      alias(token.immediate(prec(1, /\$[A-Za-z_]\w*/)), $.variable),
      alias(token.immediate(/[^\s{}";$][^\s{}";]*/), $.value),
    ),

    _label: $ => choice($.string, $.variable),

    // $NAME; `${NAME}` inside strings stays part of the string
    variable: _ => /\$[A-Za-z_]\w*/,

    identifier: _ => /[A-Za-z_][\w-]*/,

    string: _ => token(seq('"', repeat(choice(/[^"\\\n]/, /\\./)), '"')),

    // `#` followed by space/end of line; `#fff` is not a comment
    comment: _ => token(prec(-1, /#([ \t#!][^\n]*)?/)),
  },
});
