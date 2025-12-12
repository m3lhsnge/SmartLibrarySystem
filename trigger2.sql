CREATE TRIGGER trg_BorrowBook_DecreaseStock
ON borrowings
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    --ödünç durumunda çalýþan trigger
    
    -- 'available_copies' sütununu 1 azalt
    UPDATE books
    SET available_copies = available_copies - 1
    FROM books b
    INNER JOIN inserted i ON b.book_id = i.book_id;
    
    PRINT 'Kitap ödünç verildi, stok 1 azaltýldý.';
END;