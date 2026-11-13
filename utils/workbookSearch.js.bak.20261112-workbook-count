// utils/workbookSearch.js
// Helpers for the global customer search (GET /api/customers/global-search).
//
// A customer's workbook is a Univer IWorkbookData JSON object stored in
// records.workbook:
//   { sheets: { <sheetId>: { name, cellData: { <row>: { <col>: { v, m, p } } } } },
//     sheetOrder: [<sheetId>, ...] }
//
// These helpers turn that structure into searchable plain-text rows, score a
// customer against a keyword, and build a short snippet around a workbook hit.

const MAX_SNIPPET_BEFORE = 70;
const MAX_SNIPPET_AFTER = 110;

/** Count non-overlapping occurrences of needle in haystack (both pre-lowercased). */
export function countOccurrences(haystack, needle) {
    if (!haystack || !needle) return 0;
    let count = 0;
    let idx = haystack.indexOf(needle);
    while (idx !== -1) {
        count++;
        idx = haystack.indexOf(needle, idx + needle.length);
    }
    return count;
}

/** Plain text of a single Univer cell. */
export function cellText(cell) {
    if (cell === null || cell === undefined) return '';
    if (typeof cell === 'string' || typeof cell === 'number') return String(cell);

    // Rich-text cell: the visible text lives in the document body stream.
    const stream = cell.p?.body?.dataStream;
    if (typeof stream === 'string' && stream.trim() !== '') {
        return stream.replace(/[\r\n]+/g, ' ').trim();
    }

    // Prefer the formatted display string (m, e.g. a formatted date) when the
    // cell carries one; otherwise fall back to the raw value (v). Using only
    // one of them avoids counting the same content twice.
    if (typeof cell.m === 'string' && cell.m.trim() !== '') return cell.m;
    if (cell.v !== null && cell.v !== undefined && String(cell.v).trim() !== '') {
        return String(cell.v);
    }
    if (typeof cell.m === 'number') return String(cell.m);
    return '';
}

/**
 * Flatten a workbook into one text entry per non-empty row.
 * @param {*} workbook - parsed object, JSON string, or plain string/null
 * @returns {Array<{sheetName: string|null, rowIndex: number, text: string}>}
 *          rowIndex is 1-based, matching what a user sees in the sheet.
 */
export function extractWorkbookRows(workbook) {
    if (!workbook) return [];

    if (typeof workbook === 'string') {
        try {
            workbook = JSON.parse(workbook);
        } catch {
            // Not JSON at all: treat the raw text as one searchable row.
            const text = workbook.trim();
            return text ? [{ sheetName: null, rowIndex: 1, text }] : [];
        }
    }
    if (typeof workbook !== 'object') return [];

    const sheets = workbook.sheets || {};
    const orderedIds = [
        ...(Array.isArray(workbook.sheetOrder) ? workbook.sheetOrder : []),
        ...Object.keys(sheets),
    ].filter((id, i, arr) => sheets[id] && arr.indexOf(id) === i);

    const rows = [];
    for (const sheetId of orderedIds) {
        const sheet = sheets[sheetId];
        const cellData = sheet?.cellData || {};
        const rowKeys = Object.keys(cellData).sort((a, b) => Number(a) - Number(b));
        for (const rowKey of rowKeys) {
            const cols = cellData[rowKey] || {};
            const colKeys = Object.keys(cols).sort((a, b) => Number(a) - Number(b));
            const cells = colKeys.map((c) => cellText(cols[c])).filter((t) => t !== '');
            if (cells.length) {
                rows.push({
                    sheetName: sheet.name || null,
                    rowIndex: Number(rowKey) + 1,
                    text: cells.join(' | '),
                });
            }
        }
    }
    return rows;
}

/** Build a windowed snippet of `text` around the first keyword/term hit. */
export function buildSnippet(text, keyword, terms = []) {
    if (!text) return text;
    const lower = text.toLowerCase();
    let idx = lower.indexOf(keyword);
    let hitLength = keyword.length;
    if (idx === -1) {
        for (const term of terms) {
            idx = lower.indexOf(term);
            if (idx !== -1) { hitLength = term.length; break; }
        }
    }
    if (idx === -1) return text.length > 180 ? `${text.slice(0, 180)}…` : text;

    const start = Math.max(0, idx - MAX_SNIPPET_BEFORE);
    const end = Math.min(text.length, idx + hitLength + MAX_SNIPPET_AFTER);
    return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
}

function fieldScore(value, keyword, terms, { exact, startsWith, contains }) {
    if (!value) return 0;
    const v = String(value).toLowerCase();
    if (v === keyword) return exact;
    if (v.startsWith(keyword)) return startsWith;
    if (v.includes(keyword)) return contains;
    // Multi-word keyword: partial credit when every term appears in the field.
    if (terms.length > 1 && terms.every((t) => v.includes(t))) return Math.round(contains * 0.8);
    if (terms.length > 1 && terms.some((t) => v.includes(t))) return Math.round(contains * 0.4);
    return 0;
}

/**
 * Score one customer against a keyword.
 * @param {{name?, email?, phone?}} customer
 * @param {string} keywordRaw - the raw user keyword (any case)
 * @param {Array} rows - output of extractWorkbookRows()
 * @returns {{score:number, matchedIn:string[], workbookMatchCount:number,
 *            snippet:{text:string, sheetName:string|null, rowIndex:number}|null}}
 */
export function scoreCustomer(customer, keywordRaw, rows = []) {
    const keyword = String(keywordRaw || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (!keyword) return { score: 0, matchedIn: [], workbookMatchCount: 0, snippet: null };
    const terms = [...new Set(keyword.split(' ').filter(Boolean))];
    const digits = keyword.replace(/\D/g, '');

    let score = 0;
    const matchedIn = [];

    const nameScore = fieldScore(customer.name, keyword, terms, { exact: 100, startsWith: 65, contains: 45 });
    if (nameScore) { score += nameScore; matchedIn.push('name'); }

    const emailScore = fieldScore(customer.email, keyword, terms, { exact: 95, startsWith: 55, contains: 38 });
    if (emailScore) { score += emailScore; matchedIn.push('email'); }

    // Phone: stored as +1XXXXXXXXXX, so compare on digits as well as raw text
    // (a typed "(647) 987-5030" or "647987" should still match).
    let phoneScore = fieldScore(customer.phone, keyword, terms, { exact: 95, startsWith: 55, contains: 38 });
    if (digits.length >= 3 && customer.phone) {
        const phoneDigits = String(customer.phone).replace(/\D/g, '');
        if (phoneDigits === digits || phoneDigits === `1${digits}`) phoneScore = Math.max(phoneScore, 95);
        else if (phoneDigits.includes(digits)) phoneScore = Math.max(phoneScore, 42);
    }
    if (phoneScore) { score += phoneScore; matchedIn.push('phone'); }

    // Workbook content
    let workbookMatchCount = 0;
    let bestRow = null;
    let bestRowScore = 0;
    for (const row of rows) {
        const rowLower = row.text.toLowerCase();
        const phraseHits = countOccurrences(rowLower, keyword);
        let hits = phraseHits;
        if (!phraseHits && terms.length > 1) {
            hits = terms.reduce((sum, t) => sum + countOccurrences(rowLower, t), 0);
        }
        if (hits > 0) {
            workbookMatchCount += hits;
            const rowScore = phraseHits * 3 + hits; // phrase rows rank above scattered term rows
            if (rowScore > bestRowScore) { bestRowScore = rowScore; bestRow = row; }
        }
    }
    if (workbookMatchCount > 0) {
        // First hit matters most; repeated hits add up but are capped so a
        // workbook with many hits cannot bury an exact name/email/phone match.
        score += Math.min(10 + (workbookMatchCount - 1) * 4, 50);
        if (terms.length > 1 && bestRow && terms.every((t) => bestRow.text.toLowerCase().includes(t))) {
            score += 5;
        }
        matchedIn.push('workbook');
    }

    return {
        score,
        matchedIn,
        workbookMatchCount,
        snippet: bestRow
            ? { text: buildSnippet(bestRow.text, keyword, terms), sheetName: bestRow.sheetName, rowIndex: bestRow.rowIndex }
            : null,
    };
}
