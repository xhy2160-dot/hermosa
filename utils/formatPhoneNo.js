/**
 * Normalizes and validates a phone number to strict North American (+1 + 10 digits) format.
 * Accepts inputs like: "4165550199", "14165550199", "+1 (416) 555-0199", "416-555-0199"
 * 
 * @param {string|number} phone - The raw phone number input
 * @returns {string|null} The formatted number '+1XXXXXXXXXX' or null if invalid
 */
export function formatNAPhoneNumber(phone) {
    if (!phone) return null;

    // 1. Convert to string and strip all non-numeric characters
    const cleaned = String(phone).replace(/\D/g, '');

    // 2. Validate based on length
    if (cleaned.length === 10) {
        // Standard 10-digit number (e.g., 4165550199) -> add +1
        return `+1${cleaned}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
        // 11-digit number starting with 1 (e.g., 14165550199) -> replace 1 with +1
        return `+1${cleaned.slice(1)}`;
    }

    // 3. Return null if it doesn't match North American phone rules
    return null;
}