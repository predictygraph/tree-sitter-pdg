; Keywords
["graph" "css" "default" "group"] @keyword
["node" "edge"] @type.builtin
(default_statement kind: _ @type.builtin)

; Declarations
(group id: (identifier) @module)
(node_statement id: (identifier) @variable)
(endpoints (identifier) @variable)

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
