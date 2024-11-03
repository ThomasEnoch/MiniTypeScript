function tokenizer(input) {
    let current = 0;
    const tokens = [];

    while (current < input.length) {
        let char = input[current];

        if (isWhiteSpace(char)) {
            current++;
            continue;
        }

        if (isSingleLineComment(char, input, current)) {
            current = skipSingleLineComment(input, current);
            continue;
        }

        if (isMultiLineComment(char, input, current)) {
            current = skipMultiLineComment(input, current);
            continue;
        }

        if (isNumber(char)) {
            const { value, newIndex } = readNumber(input, current);
            tokens.push({ type: 'number', value });
            current = newIndex;
            continue;
        }

        if (isString(char)) {
            const { value, newIndex } = readString(input, current);
            tokens.push({ type: 'string', value });
            current = newIndex;
            continue;
        }

        if (isIdentifierStart(char)) {
            const { value, newIndex } = readIdentifierOrKeyword(input, current);
            tokens.push(value);
            current = newIndex;
            continue;
        }

        if (isSingleCharToken(char)) {
            tokens.push({ type: getSingleCharTokenType(char), value: char });
            current++;
            continue;
        }

        throw new TypeError(`Unexpected character: ${char}`);
    }

    return tokens;
}

function isWhiteSpace(char) {
    return /\s/.test(char);
}

function isSingleLineComment(char, input, current) {
    return char === '/' && input[current + 1] === '/';
}

function skipSingleLineComment(input, current) {
    let char = input[current];
    while (char !== '\n' && current < input.length) {
        char = input[++current];
    }
    return current;
}

function isMultiLineComment(char, input, current) {
    return char === '/' && input[current + 1] === '*';
}

function skipMultiLineComment(input, current) {
    let char = input[current];
    while (current < input.length) {
        if (char === '*' && input[current + 1] === '/') {
            return current + 2;
        }
        char = input[++current];
    }
    return current;
}

function isNumber(char) {
    return /\d/.test(char);
}

function readNumber(input, current) {
    let value = '';
    let char = input[current];
    while (isNumber(char)) {
        value += char;
        char = input[++current];
    }
    return { value, newIndex: current };
}

function isString(char) {
    return char === '"' || char === "'";
}

function readString(input, current) {
    let quoteType = input[current];
    let value = '';
    let char = input[++current];
    while (char !== quoteType) {
        value += char;
        char = input[++current];
    }
    return { value, newIndex: current + 1 };
}

function isIdentifierStart(char) {
    return /[a-zA-Z_]/.test(char);
}

function readIdentifierOrKeyword(input, current) {
    let value = '';
    let char = input[current];
    while (/\w/.test(char)) {
        value += char;
        char = input[++current];
    }
    const keywords = ['let', 'const', 'function', 'if', 'else'];
    const type = keywords.includes(value) ? 'keyword' : 'identifier';
    return { value: { type, value }, newIndex: current };
}

function isSingleCharToken(char) {
    return '(){};,+-*/='.includes(char);
}

function getSingleCharTokenType(char) {
    const singleCharTokens = {
        '(': 'paren',
        ')': 'paren',
        '{': 'brace',
        '}': 'brace',
        ',': 'comma',
        ';': 'semicolon',
        '+': 'operator',
        '-': 'operator',
        '*': 'operator',
        '/': 'operator',
        '=': 'operator'
    };
    return singleCharTokens[char];
}

console.log(tokenizer(`let x = 42; // this is a comment`
/*
*
* This is a multiLine Comment
*
*
* */
));

