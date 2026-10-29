/**
 * LAB 6 - TASK 3: Reusable Revision Tracker Factory
 * Encapsulates internal state through JavaScript closures.
 */

/**
 * Creates an independent revision tracker instance using closures.
 * 
 * @param {number} [start=0] - Optional initial minutes (defaults to 0).
 * @returns {{ add: Function, current: Function, reset: Function }}
 */
export function createTracker(start = 0) {
    // Private state encapsulated strictly within this closure scope
    let totalMinutes = (typeof start === "number" && !Number.isNaN(start) && start >= 0) ? start : 0;

    return {
        /**
         * Adds one or more minute intervals to the tracker using rest parameters.
         * 
         * @param  {...number} minutes - Variable number of minute values to accumulate.
         * @returns {number} The updated cumulative total minutes.
         */
        add(...minutes) {
            if (minutes.length === 0) {
                return totalMinutes;
            }

            for (const m of minutes) {
                const val = Number(m);
                if (Number.isNaN(val) || !Number.isFinite(val) || val < 0) {
                    throw new TypeError(`Invalid duration "${m}": Minutes must be a non-negative finite number.`);
                }
                totalMinutes += val;
            }

            return totalMinutes;
        },

        /**
         * Retrieves the current cumulative revision minutes.
         * 
         * @returns {number} Current minutes.
         */
        current() {
            return totalMinutes;
        },

        /**
         * Resets the tracker's internal accumulated minutes back to 0.
         * 
         * @returns {number} 0.
         */
        reset() {
            totalMinutes = 0;
            return totalMinutes;
        }
    };
}
