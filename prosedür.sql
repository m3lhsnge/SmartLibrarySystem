CREATE OR ALTER PROCEDURE sp_CalculateFines
AS
BEGIN
    SET NOCOUNT ON;

    -- Günlük Ceza Tutarý (Örneðin: 5 TL)
    DECLARE @DailyFineAmount DECIMAL(10, 2) = 5.00;

    -- 1. Gecikmiþ ve henüz iade edilmemiþ kitaplarý bulup ceza tablosuna ekle
    INSERT INTO penalties (borrowing_id, user_id, penalty_amount, overdue_days, is_paid, created_at)
    SELECT 
        b.borrowing_id,
        b.user_id,
        DATEDIFF(day, b.due_date, GETDATE()) * @DailyFineAmount, -- Geciken Gün x 5 TL
        DATEDIFF(day, b.due_date, GETDATE()), -- Geciken Gün Sayýsý
        0, -- Ödenmedi (False)
        GETDATE()
    FROM borrowings b
    WHERE 
        b.status = 'BORROWED' -- Kitap hala öðrencideyse
        AND b.due_date < GETDATE() -- Ve teslim tarihi geçmiþse
        AND NOT EXISTS (SELECT 1 FROM penalties p WHERE p.borrowing_id = b.borrowing_id); -- Zaten ceza yazýlmamýþsa

    -- (Ýsteðe baðlý) 2. Eðer kitap iade edilmiþ ama geç getirilmiþse (RETURNED durumu)
    -- Bu kýsým þimdilik basitlik olsun diye kapalý, yukarýdaki kýsým iþini görür.
END