/**
 * LAB 6 - TASK 1: Safe Marks Analyser
 * Validates raw inputs, applies non-mutating transformations, and calculates grade statistics.
 */

/**
 * Validates and analyses an array of raw student marks.
 * 
 * @param {Array<number|string>} rawMarks - Raw input marks (numbers or valid numeric strings).
 * @returns {{ count: number, total: number, average: number, passed: number, highest: number|null }}
 * @throws {TypeError|Error|RangeError} When any mark is non-numeric, blank, non-finite, or outside [0, 100].
 */
export function analyseMarks(rawMarks) {
    // 1. Verify input is an array
    if (!Array.isArray(rawMarks)) {
        throw new TypeError("Invalid input: Expected an Array of marks.");
    }

    // 2. Safely handle empty input array without NaN or division by zero
    if (rawMarks.length === 0) {
        return {
            count: 0,
            total: 0,
            average: 0,
            passed: 0,
            highest: null
        };
    }

    // 3. Validate every item without mutating the original raw input array
    const validatedMarks = rawMarks.map((item, index) => {
        // Check for null, undefined, or empty/whitespace string
        if (item === null || item === undefined || (typeof item === "string" && item.trim() === "")) {
            throw new Error(`Validation Error at index [${index}]: Value cannot be empty, blank, or null.`);
        }

        // Reject boolean types or objects which Number() would coerce improperly
        if (typeof item === "boolean" || typeof item === "object") {
            throw new Error(`Validation Error at index [${index}]: Value "${item}" is not a valid number.`);
        }

        const num = Number(item);

        // Check if value is NaN
        if (Number.isNaN(num)) {
            throw new Error(`Validation Error at index [${index}]: Value "${item}" is non-numeric.`);
        }

        // Check for finiteness (reject Infinity / -Infinity)
        if (!Number.isFinite(num)) {
            throw new Error(`Validation Error at index [${index}]: Value "${item}" is not finite.`);
        }

        // Range check [0, 100]
        if (num < 0 || num > 100) {
            throw new RangeError(`Validation Error at index [${index}]: Mark "${num}" is out of allowable range [0, 100].`);
        }

        return num;
    });

    // 4. Non-mutating aggregations
    const count = validatedMarks.length;
    const total = validatedMarks.reduce((acc, curr) => acc + curr, 0);
    const average = count > 0 ? Number((total / count).toFixed(2)) : 0;
    const passed = validatedMarks.filter(mark => mark >= 50).length;
    const highest = count > 0 ? Math.max(...validatedMarks) : null;

    return {
        count,
        total: Number(total.toFixed(2)),
        average,
        passed,
        highest
    };
}
