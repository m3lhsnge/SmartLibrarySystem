USE Kutuphane;
GO

CREATE TRIGGER trg_BookStockManagement
ON borrowings
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. DURUM: YENÝ ÖDÜNÇ ALMA (INSERT)
    -- Borrowing tablosuna yeni satýr eklendiðinde çalýþýr
    IF EXISTS (SELECT * FROM inserted) AND NOT EXISTS (SELECT * FROM deleted)
    BEGIN
        UPDATE books
        SET available_copies = available_copies - 1
        FROM books b
        INNER JOIN inserted i ON b.book_id = i.book_id;
    END

    -- 2. DURUM: ÝADE ETME (UPDATE)
    -- return_date alaný güncellendiðinde (yani kitap döndüðünde) çalýþýr
    IF UPDATE(return_date)
    BEGIN
        UPDATE books
        SET available_copies = available_copies + 1
        FROM books b
        INNER JOIN inserted i ON b.book_id = i.book_id
        WHERE i.return_date IS NOT NULL AND i.status = 'RETURNED'; -- Status kontrolü de ekledik garanti olsun
    END
END;
GO