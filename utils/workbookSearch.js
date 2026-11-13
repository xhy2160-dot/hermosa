// utils/workbookSearch.js
// Helpers for the workbook keyword search (GET /api/customers/global-search).
//
// A customer's workbook is a Univer IWorkbookData JSON object stored in
// records.workbook:
//   { sheets: { <sheetId>: { name, cellData: { <row>: { <col>: { v, m, p } } } } },
//     sheetOrder: [<sheetId>, ...] }
//
// The search counts how many times a keyword (e.g. a treatment name such as
// "botox") occurs in the *extracted cell text* of a workbook — never in the
// raw JSON keys/structure. These helpers only turn one workbook at a time
// into plain-text rows and count occurrences in those rows, so callers can
// page through records in small batches and keep memory bounded.

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

/**
 * Count how many times a keyword occurs in one workbook's extracted text.
 *
 * The keyword is matched as a full phrase (multi-word keywords count phrase
 * occurrences only), case-insensitively, summed over the workbook's rows.
 * Counting is per row — the same rule the original search used — so a phrase
 * split across two cells/rows by the ' | ' row join is not counted.
 *
 * @param {*} workbook - parsed object, JSON string, or plain string/null
 * @param {string} keywordRaw - the raw user keyword (any case)
 * @returns {number} total occurrences of the keyword in the workbook text
 */
export function countWorkbookMatches(workbook, keywordRaw) {
    const keyword = String(keywordRaw || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (!keyword) return 0;

    let total = 0;
    for (const row of extractWorkbookRows(workbook)) {
        total += countOccurrences(row.text.toLowerCase(), keyword);
    }
    return total;
}
