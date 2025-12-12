CREATE TRIGGER trg_ReturnBook_IncreaseStock
ON borrowings
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    --durumunda çalýþan trigger 

    -- Durum 'RETURNED' olduysa stoðu artýr
    IF UPDATE(status)
    BEGIN
        UPDATE books
        SET available_copies = available_copies + 1
        FROM books b
        INNER JOIN inserted i ON b.book_id = i.book_id
        INNER JOIN deleted d ON i.borrowing_id = d.borrowing_id
        WHERE i.status = 'RETURNED' -- Yeni durum ÝADE
          AND d.status <> 'RETURNED'; -- Eski durum ÝADE DEÐÝLSE
          
        PRINT 'Kitap iade alýndý, stok 1 artýrýldý.';
    END
END;