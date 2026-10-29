/**
 * LAB 6 - TASK 2: Non-Mutating Catalogue Report
 * Functional array methods: map, filter, reduce, find, some, every, sort
 */

/**
 * Sample initial book catalogue
 */
export const defaultBooks = Object.freeze([
    { title: "  Clean Architecture  ", price: 34.99, stock: 12, category: "Software Design" },
    { title: "Eloquent JavaScript", price: 29.50, stock: 0, category: "Web Engineering" },
    { title: "Designing Data-Intensive Applications", price: 45.00, stock: 8, category: "Databases" },
    { title: "You Don't Know JS Yet", price: 24.00, stock: 15, category: "Web Engineering" },
    { title: "The Pragmatic Programmer", price: 42.50, stock: 5, category: "Software Design" },
    { title: "Computer Networking: A Top-Down Approach", price: 68.00, stock: 3, category: "Networking" }
]);

/**
 * Builds a comprehensive analytical catalogue report without mutating the original books array.
 * 
 * @param {Array<Object>} books - The source books array.
 * @param {string} [searchText=""] - Search term to filter books by title or category.
 * @param {number} [discount=0.10] - Fractional discount rate (e.g. 0.10 for 10%).
 * @returns {Object} Comprehensive analytics and filtered sets.
 */
export function buildReport(books, searchText = "", discount = 0.10) {
    if (!Array.isArray(books)) {
        throw new TypeError("Expected books to be an Array.");
    }

    const query = searchText ? searchText.trim().toLowerCase() : "";

    // 1. Array.prototype.map - Normalize titles and apply discount to create new immutable copies
    const normalizedCatalogue = books.map((book) => {
        const normalizedTitle = book.title.trim();
        const discountedPrice = Number((book.price * (1 - discount)).toFixed(2));
        
        return {
            ...book,
            title: normalizedTitle,
            originalPrice: book.price,
            discountedPrice,
            stockValue: Number((book.price * book.stock).toFixed(2))
        };
    });

    // 2. Array.prototype.filter - Case-insensitive search match across title or category
    const searchMatches = normalizedCatalogue.filter((book) => {
        if (!query) return true;
        return (
            book.title.toLowerCase().includes(query) ||
            book.category.toLowerCase().includes(query)
        );
    });

    // 3. Array.prototype.reduce - Calculate total inventory stock value and total unit count
    const totalInventoryValue = books.reduce((sum, book) => sum + (book.price * book.stock), 0);
    const totalUnitsInStock = books.reduce((sum, book) => sum + book.stock, 0);

    // 4. Array.prototype.find - Find first out-of-stock item or specific highlight
    const firstOutOfStockItem = normalizedCatalogue.find(book => book.stock === 0) || null;

    // 5. Array.prototype.some - Check if ANY book is out of stock
    const hasOutOfStockItems = normalizedCatalogue.some(book => book.stock === 0);

    // 6. Array.prototype.every - Check if ALL books meet a pricing criterion (e.g. under $100)
    const allUnderOneHundred = normalizedCatalogue.every(book => book.price < 100);

    // 7. Array.prototype.sort (Non-Mutating) - Create shallow copy with slice/spread before sorting
    const sortedByPriceAsc = [...normalizedCatalogue].sort((a, b) => a.price - b.price);

    return {
        query,
        discountRate: `${(discount * 100).toFixed(0)}%`,
        totalInventoryValue: Number(totalInventoryValue.toFixed(2)),
        totalUnitsInStock,
        hasOutOfStockItems,
        allUnderOneHundred,
        firstOutOfStockItem,
        searchMatches,
        sortedByPriceAsc,
        originalCatalogueLength: books.length
    };
}
