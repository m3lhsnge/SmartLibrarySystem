package com.library.management.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "penalties")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Penalty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "penalty_id")
    private Long penaltyId;

    @ManyToOne
    @JoinColumn(name = "borrowing_id", nullable = false)
    private Borrowing borrowing;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "penalty_amount", nullable = false, precision = 10, scale = 2)
    @JsonProperty("amount")
    private BigDecimal penaltyAmount;

    @Column(name = "overdue_days", nullable = false)
    private Integer overdueDays;

    @JsonProperty("paid")
    @Column(name = "is_paid")
    private Boolean isPaid = false;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @JsonProperty("createdAt")
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}