USE Kutuphane;
GO

-- Eðer prosedür önceden varsa sil (Temiz kurulum)
IF OBJECT_ID('sp_CalculatePenaltyForReturn', 'P') IS NOT NULL 
    DROP PROCEDURE sp_CalculatePenaltyForReturn;
GO

CREATE PROCEDURE sp_CalculatePenaltyForReturn
    @borrowingId BIGINT -- Hangi ödünç iþlemi için hesaplayacaðýz?
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @DailyFine DECIMAL(10, 2) = 5.00; -- Günlük Ceza Tutarý

    -- 1. Kitap iade edilmiþ mi? (Return Date dolu mu?)
    -- 2. Günü Geçmiþ mi? (Return Date > Due Date)
    -- 3. Zaten cezasý kesilmiþ mi? (Mükerrer olmasýn)
    
    INSERT INTO penalties (borrowing_id, user_id, penalty_amount, overdue_days, is_paid, created_at)
    SELECT 
        b.borrowing_id,
        b.user_id,
        DATEDIFF(day, b.due_date, b.return_date) * @DailyFine, -- (Gecikme Günü x 5 TL)
        DATEDIFF(day, b.due_date, b.return_date),
        0, -- Ödenmedi (False)
        GETDATE()
    FROM borrowings b
    WHERE 
        b.borrowing_id = @borrowingId
        AND b.return_date IS NOT NULL     -- Ýade edilmiþ
        AND b.return_date > b.due_date    -- Ve geç kalmýþ
        AND NOT EXISTS (SELECT 1 FROM penalties p WHERE p.borrowing_id = b.borrowing_id); 
END;
GO