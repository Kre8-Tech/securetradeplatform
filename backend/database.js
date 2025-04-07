// backend/database.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./secure_trade_portal.db"
  },
  useNullAsDefault: true
});

// Create users table
knex.schema.hasTable('users').then(exists => {
  if (!exists) {
    return knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.string('role').notNullable();
      table.boolean('blocked').defaultTo(false);
      table.boolean('redFlagged').defaultTo(false);
      table.string('membershipType').nullable();
      table.string('contactDetails').nullable();
      table.string('businessName').nullable();
      table.string('contactPerson').nullable();
    }).then(async () => {
      // Insert superadmin user if it doesn't exist
      const superadminUser = await knex('users').where({ email: 'superadmin@example.com' }).first();
      if (!superadminUser) {
        const hashedPassword = bcrypt.hashSync('superadmin123', 10);
        await knex('users').insert({
          name: 'Superadmin User',
          email: 'superadmin@example.com',
          password: hashedPassword,
          role: 'admin',
          blocked: false, // Ensure superadmin is not blocked
          redFlagged: false,
          membershipType: 'superadmin',
          contactDetails: JSON.stringify({ whatsapp: '+265999999999', location: 'Lilongwe', areasOfOperation: [] }),
          businessName: 'Superadmin Business',
          contactPerson: 'Superadmin Contact Person'
        });
        console.log('Superadmin user inserted successfully.');
      }
    });
  }
});

// Create transactions table
knex.schema.hasTable('transactions').then(exists => {
  if (!exists) {
    return knex.schema.createTable('transactions', table => {
      table.increments('id').primary();
      table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('description').notNullable();
      table.decimal('amount').notNullable();
      table.string('paymentMode').notNullable();
      table.string('status').defaultTo('Pending');
    });
  }
});

// Create merchants table
knex.schema.hasTable('merchants').then(exists => {
  if (!exists) {
    return knex.schema.createTable('merchants', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').unique().notNullable();
      table.string('role').defaultTo('merchant');
      table.string('location').notNullable();
      table.string('contact').notNullable();
      table.boolean('blocked').defaultTo(false);
    });
  }
});

// Create couriers table
knex.schema.hasTable('couriers').then(exists => {
  if (!exists) {
    return knex.schema.createTable('couriers', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').unique().notNullable();
      table.string('role').defaultTo('courier');
      table.string('location').notNullable();
      table.string('contact').notNullable();
      table.boolean('blocked').defaultTo(false);
    });
  }
});

// Create notifications table
knex.schema.hasTable('notifications').then(exists => {
  if (!exists) {
    return knex.schema.createTable('notifications', table => {
      table.increments('id').primary();
      table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('type').notNullable();
      table.string('message').notNullable();
    });
  }
});

// Create reports table
knex.schema.hasTable('reports').then(exists => {
  if (!exists) {
    return knex.schema.createTable('reports', table => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.date('date').notNullable();
      table.text('content').notNullable();
    });
  }
});

module.exports = knex;