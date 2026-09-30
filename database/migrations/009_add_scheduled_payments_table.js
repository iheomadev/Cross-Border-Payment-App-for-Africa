/* eslint-disable camelcase */
// Migration 009: Add controller-required columns to scheduled_payments.
// The table itself was already created by 007_add_scheduled_payments.js.
// This migration adds the columns needed by scheduledPaymentController.js.
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('scheduled_payments', {
    frequency: {
      type: 'varchar(20)',
      check: "frequency IN ('daily', 'weekly', 'monthly')",
    },
    next_run_at: {
      type: 'timestamptz',
    },
    active: {
      type: 'boolean',
      default: true,
      notNull: true,
    },
    last_run_at: {
      type: 'timestamptz',
    },
    failed_attempts: {
      type: 'integer',
      default: 0,
    },
  });

  pgm.createIndex('scheduled_payments', 'next_run_at', {
    name: 'idx_scheduled_payments_next_run_at',
  });
  pgm.createIndex('scheduled_payments', 'active', {
    name: 'idx_scheduled_payments_active',
  });
};

exports.down = (pgm) => {
  pgm.dropIndex('scheduled_payments', 'active', {
    name: 'idx_scheduled_payments_active',
  });
  pgm.dropIndex('scheduled_payments', 'next_run_at', {
    name: 'idx_scheduled_payments_next_run_at',
  });
  pgm.dropColumns('scheduled_payments', [
    'frequency',
    'next_run_at',
    'active',
    'last_run_at',
    'failed_attempts',
  ]);
};
