﻿"use strict";
const DBMixin = require("../mixins/db.mixin");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const hat = require("hat");
const AuthenticationMixin = require("../mixins/authentication.mixin");
const { MoleculerError } = require("moleculer").Errors;
const UserExistsError = require("../exceptions/userExists.error");

module.exports = {
	name: "users",
	mixins: [DBMixin("users"), AuthenticationMixin],
	model: User,
	settings: {
		fields: ["_id", "email", "firstName", "lastName", "bio"],
		entityValidator: {
			email: { type: "email" },
			password: { type: "string" },
			firstName: { type: "string" },
			lastName: { type: "string" },
			bio: { type: "string", optional: true },
		},
	},

	actions: {
		count: false,
		remove: false,
		insert: false,
		find: false,

		/**
		 * Create a new user entity
		 * @actions
		 * @param {Object} user - User entity
		 * @returns {Object} Created entity & API key
		 */
		create: {
			auth: false,
			params: {
				user: {
					type: "object",
				},
			},

			async handler(ctx) {
				const user = new User(ctx.params.user);
				await this.validateEntity(user);
				user.password = bcrypt.hashSync(user.password, 10);
				user.apiKeys.push({
					token: hat(256),
				});

				try {
					//Check if email already exists
					const existingUser = await User.findOne({
						email: user.email,
					});
					if (existingUser) {
						console.error("Email already exists");

						throw new UserExistsError();
					} else {
						await user.save();

						const response = await this.transformDocuments(
							ctx,
							{},
							user
						);
						response.apiKey = user.apiKeys;
						return response;
					}
				} catch (err) {
					if (err instanceof MoleculerError) {
						throw err;
					}
				}
			},
		},
	},

	methods: {},
};