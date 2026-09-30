/* eslint-disable camelcase */
// Migration 005: Create claimable_balances table.
// Note: scheduled_payments is created by 007_add_scheduled_payments.js.
// The duplicate createTable for scheduled_payments that was here has been removed.
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('claimable_balances', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    // Stellar claimable balance ID (starts with 00000000...)
    balance_id: { type: 'varchar(72)', notNull: true, unique: true },
    user_id: {
      type: 'uuid',
      references: '"users"',
      onDelete: 'SET NULL',
    },
    asset: { type: 'varchar(12)', notNull: true },
    amount: { type: 'decimal(20,7)', notNull: true },
    claimant_wallet: { type: 'varchar(56)', notNull: true },
    expires_at: { type: 'timestamptz' },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'active',
      check: "status IN ('active','claimed','expired','cancelled')",
    },
    created_at: { type: 'timestamptz', default: pgm.func('NOW()') },
    updated_at: { type: 'timestamptz', default: pgm.func('NOW()') },
  });

  pgm.createIndex('claimable_balances', ['status', 'expires_at'], {
    name: 'idx_claimable_balances_status_expires',
  });
  pgm.createIndex('claimable_balances', 'user_id', {
    name: 'idx_claimable_balances_user',
  });
};

exports.down = (pgm) => {
  pgm.dropIndex('claimable_balances', 'user_id', { name: 'idx_claimable_balances_user' });
  pgm.dropIndex('claimable_balances', ['status', 'expires_at'], {
    name: 'idx_claimable_balances_status_expires',
  });
  pgm.dropTable('claimable_balances');
};
