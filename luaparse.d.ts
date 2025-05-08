import * as ast from "./lib/ast.d";
export * from "./lib/ast.d";

interface BaseNode {
    type: string;
}

interface ParseOptions {
    /** Explicitly tell the parser when the input ends. */
    wait: boolean;
    /** Store comments as an array in the chunk object. */
    comments: boolean;
    /** Track identifier scopes. */
    scope: boolean;
    /** Store location information on each syntax node. */
    locations: boolean;
    /** Store the start and end character locations on each syntax node. */
    ranges: boolean;
    /**
     * A callback which will be invoked when a syntax node has been completed.
     * The node which has been created will be passed as the only parameter.
     */
    onCreateNode: (node: ast.Node) => void;
    /** A callback which will be invoked when a new scope is created. */
    onCreateScope: () => void;
    /** A callback which will be invoked when the current scope is destroyed. */
    onDestroyScope: () => void;
    /**
     * A callback which will be invoked when a local variable is declared.
     * The identifier will be passed as the only parameter.
     */
    onLocalDeclaration: null | ((name: string) => void);
    luaVersion: "5.1" | "5.2" | "5.3" | "5.4" | "FiveM5.4";
    /**
     * Whether to allow code points ≥ U+0080 in identifiers, like LuaJIT does.
     * See 'Note on character encodings' below if you wish to use this option.
     * Note: setting luaVersion: 'LuaJIT' currently does not enable this option; this may change in the future.
     */
    extendedIdentifiers: false;
    /**
     * Defines the relation between code points ≥ U+0080 appearing in parser input and raw bytes in source code,
     * and how Lua escape sequences in JavaScript strings should be interpreted.
     * See the Encoding modes section https://github.com/fstirlitz/luaparse#encoding-modes for more information.
     */
    encodingMode: "none" | "pseudo-latin1" | "x-user-defined";

    /**
     * Debug logs the parser's internal state to the console.
     * This is useful for debugging the parser itself, but may be useful for debugging your code as well.
     */
    debug: boolean;
}
interface ParseResult {
    globals: any[];
    scopes: any[];
    body: any;
}

declare const enum TokenTypes {
    EOF = 1,
    StringLiteral = 2,
    Keyword = 4,
    Identifier = 8,
    NumericLiteral = 16,
    Punctuator = 32,
    BooleanLiteral = 64,
    NilLiteral = 128,
    VarargLiteral = 256,
}
declare const enum Errors {
    unexpected = "unexpected %1 '%2' near '%3'",
    unexpectedEOF = "unexpected symbol near '<eof>'",
    expected = "'%1' expected near '%2'",
    expectedToken = "%1 expected near '%2'",
    unfinishedString = "unfinished string near '%1'",
    malformedNumber = "malformed number near '%1'",
    decimalEscapeTooLarge = "decimal escape too large near '%1'",
    invalidEscape = "invalid escape sequence near '%1'",
    hexadecimalDigitExpected = "hexadecimal digit expected near '%1'",
    braceExpected = "missing '%1' near '%2'",
    tooLargeCodepoint = "UTF-8 value too large near '%1'",
    unfinishedLongString = "unfinished long string (starting at line %1) near '%2'",
    unfinishedLongComment = "unfinished long comment (starting at line %1) near '%2'",
    ambiguousSyntax = "ambiguous syntax (function call x new statement) near '%1'",
    noLoopToBreak = "no loop to break near '%1'",
    labelAlreadyDefined = "label '%1' already defined on line %2",
    labelNotVisible = "no visible label '%1' for <goto>",
    gotoJumpInLocalScope = "<goto %1> jumps into the scope of local '%2'",
    cannotUseVararg = "cannot use '...' outside a vararg function near '%1'",
    invalidCodeUnit = "code unit U+%1 is not allowed in the current encoding mode",
    unknownAttribute = "unknown attribute '%1'",
}

export interface Token {
    type: number;
    value: string;
    line: number;
    lineStart: number;
    range: [number, number];
}

export interface Parser {
    write(segment: string): void;
    end(segment: string): ast.Chunk;
    lex(): Token;
}

declare module "luaparse-fivem" {
    export const version: string;
    export const tokenTypes: TokenTypes;
    export const errors: Errors;

}

export function parse(
    code: string,
    options?: Partial<ParseOptions>
  ): ParseResult;
export function parse(code: string, options: Partial<ParseOptions> & { wait: true }): Parser;
export function parse(code: string, options?: Partial<ParseOptions>): ast.Chunk;
export function parse(options?: Partial<ParseOptions>): Parser;
