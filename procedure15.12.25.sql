USE Kutuphane;
GO

-- Eğer prosedür önceden varsa sil (Temiz kurulum)
IF OBJECT_ID('sp_CalculatePenaltyForReturn', 'P') IS NOT NULL 
    DROP PROCEDURE sp_CalculatePenaltyForReturn;
GO

CREATE PROCEDURE sp_CalculatePenaltyForReturn
    @borrowingId BIGINT -- Hangi �d�n� i�lemi i�in hesaplayaca��z?
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @DailyFine DECIMAL(10, 2) = 5.00; -- G�nl�k Ceza Tutar�

    -- DEMO İ�İN BASİT MANTIK:
    -- Eğer return_date > due_date ise en az 1 g�nl�k (5 TL) ceza yaz.
    
    INSERT INTO penalties (borrowing_id, user_id, penalty_amount, overdue_days, is_paid, created_at)
    SELECT 
        b.borrowing_id,
        b.user_id,
        @DailyFine,      -- Sabit 1 g�nl�k ceza
        1,               -- 1 g�n gecikme olarak i�lenir
        0, -- �denmedi (False)
        GETDATE()
    FROM borrowings b
    WHERE 
        b.borrowing_id = @borrowingId
        AND b.return_date IS NOT NULL     -- �ade edilmi�
        AND b.return_date > b.due_date    -- Ve ge� kalm��
        AND NOT EXISTS (SELECT 1 FROM penalties p WHERE p.borrowing_id = b.borrowing_id); 
END;
GO