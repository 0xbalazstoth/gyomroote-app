const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ApiKeySchema } = require("./apiKey");

const UserSchema = Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		apiKeys: { type: [ApiKeySchema], default: [] },
		profileImageUrl: { type: String, default: "/default.png" },
		bio: { type: String },
		permissions: { type: [Object], default: [] },
		assignmentId: { type: String, default: "tuzolto" },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", UserSchema);
