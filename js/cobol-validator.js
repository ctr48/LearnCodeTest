let cobolEditor;

window.onload = function() {
    cobolEditor = CodeMirror(document.getElementById('cobolide'), {
        value: `IDENTIFICATION DIVISION.
PROGRAM-ID. HELLO.
PROCEDURE DIVISION.
    DISPLAY "Hello world!".
    STOP RUN.`,
        mode: 'cobol', 
        lineNumbers: true,
        theme: 'default'
    });
}

const cobolKeywords = [
    'identification', 'division', 'program-id', 'author', 'installation',
    'date-written', 'date-compiled', 'environment', 'configuration', 'section',
    'source-computer', 'object-computer', 'input-output', 'file-control', 
    'data', 'file','working-storage', 'local-storage', 'linkage', 'procedure',
    'accept', 'add', 'call', 'compute', 'display', 'divide', 'else', 'end-if',
    'if', 'move', 'multiply', 'perform', 'read', 'return', 'rewrite', 'stop',
    'string', 'subtract', 'unstring', 'write', 'exec', 'eval', 'exit', 'goback',
    'initialize', 'invoke', 'set', 'sort', 'search', 'alter', 'continue', 'entry', 
    'merge', 'use', 'allocate', 'free', 'validate'
];

CodeMirror.defineSimpleMode("cobol", {
    start: [
        {regex: /`(\d+\.\d+)?/,                           token: "string"},
        {regex: /(?:identification|id|environment|data|procedure)\s+division/i,  token: "keyword"},
        {regex: /\s+(?:function|end-function)(?:\s+[a-z0-9-]+)?/i,      token: "keyword"},
        {regex: new RegExp(`\\b(?:${cobolKeywords.join("|")})\\b`, "i"),  token: "keyword"},
        {regex: /\*[a-z0-9-]+\*/i,                           token: "variable-2"},
        {regex: /\s+(?:end-if|end-perform|end-read|end-return)\b/i, token: "keyword"},
        {regex: /(?:[a-z0-9-]+)(?=\s+section\.|\.)/i,          token: "def"},
        {regex: /(?:[a-z0-9-]+)(?=\s+division\.)/i,           token: "def"},
        {regex: /(?:^|\s+)(?:if|perform|end-read|read)\s/i,    token: "keyword"},
        {regex: /\.\s*$/i,                                 token: "meta"}
    ],
    meta: {
        dontIndentStates: ["comment"],
        lineComment: "*",
        fold: "indent"
    }
});

function checkCode() {
    const userCode = cobolEditor.getValue().toLowerCase();
    const requiredElements = [
        'identification division',
        'program-id',
        'procedure division',
        'display',
        'stop run'
    ];
  
    const result = requiredElements.every(element => userCode.includes(element));

    const outputElement = document.getElementById('output');
    if (result) {
        outputElement.textContent = "Great! Your COBOL program is valid.\\nOutput:\\nHello world!";
        outputElement.style.color = "green";
    } else {
        outputElement.textContent = "Your program is missing some key elements. Please try again.";
        outputElement.style.color = "red";
    }
}

document.getElementById('runbtn').addEventListener('click', checkCode);