;;; SPDX-FileCopyrightText: 2026 Reza Jelveh
;;;
;;; SPDX-License-Identifier: Apache-2.0

; Keywords
["graph" "css" "default" "group" "let" "def" "use"] @keyword
["node" "edge"] @type.builtin
(default_statement kind: _ @type.builtin)

; Declarations
(group id: (identifier) @module)
(node_statement id: (identifier) @variable)
(endpoints (identifier) @variable)

(def_statement name: (identifier) @function)
(use_statement block: (identifier) @function.call)
(use_statement id: (identifier) @module)
(let_statement name: (identifier) @variable)
(parameter name: (identifier) @variable.parameter)
(variable) @variable

; Labels and strings
(string) @string
(css_import path: (string) @string.special.path)

; Styling
(class) @attribute
(attribute key: (attribute_name) @property)
(attribute value: (value) @constant)
"=" @operator

; Edges
(arrow) @operator

; Punctuation
["{" "}"] @punctuation.bracket
["," ";"] @punctuation.delimiter

(comment) @comment @spell
