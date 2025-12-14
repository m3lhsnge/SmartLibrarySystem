CREATE OR ALTER PROCEDURE sp_CalculatePenaltyForReturn
    @borrowingId BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    -- Günlük Ceza Tutarı (örneğin: 5 TL)
    DECLARE @DailyFineAmount DECIMAL(10, 2) = 5.00;

    -- İade edilmiş ama geç getirilmiş kitaplar için ceza hesapla
    DECLARE @borrowingExists INT;
    SELECT @borrowingExists = COUNT(*) 
    FROM borrowings 
    WHERE borrowing_id = @borrowingId 
      AND status = 'RETURNED' 
      AND return_date IS NOT NULL
      AND due_date < return_date; -- İade tarihi, vade tarihinden sonra

    -- Eğer geç iade edilmişse ve henüz ceza yazılmamışsa
    IF @borrowingExists > 0 
       AND NOT EXISTS (SELECT 1 FROM penalties WHERE borrowing_id = @borrowingId)
    BEGIN
        INSERT INTO penalties (borrowing_id, user_id, penalty_amount, overdue_days, is_paid, created_at)
        SELECT 
            b.borrowing_id,
            b.user_id,
            DATEDIFF(day, b.due_date, b.return_date) * @DailyFineAmount, -- Geciken Gün x 5 TL
            DATEDIFF(day, b.due_date, b.return_date), -- Geciken Gün Sayısı
            0, -- Ödenmedi (False)
            GETDATE()
        FROM borrowings b
        WHERE b.borrowing_id = @borrowingId
          AND b.status = 'RETURNED'
          AND b.return_date IS NOT NULL
          AND b.due_date < b.return_date; -- İade tarihi, vade tarihinden sonra
    END
END

