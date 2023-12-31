import { Schema } from "mongoose";

export const TournamentSchema = new Schema(
  {
    name: { type: String, required: true, maxLength: 75 },
    description: { type: String, required: true, maxLength: 1000 },
    gameId: { type: Number },
    signUpDeadline: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },
    address: { type: String, maxLength: 100 },
    region: { type: String, enum: ['west', 'midwest', 'southwest', 'southeast', 'northeast'] },
    entryPrice: { type: String, maxLength: 10000 },
    prizePool: { type: String, maxLength: 1000 },
    capacity: { type: Number, maxLength: 100000 },
    onlineOnly: { type: Boolean, default: false },
    imgUrl: { type: String, maxLength: 20000 },
    twitchUsername: { type: String, maxLength: 500 },
    winnerId: { type: Schema.Types.ObjectId, ref: 'Account' },
    isLocked: { type: Boolean, default: false },
    isLive: { type: Boolean, default: false },
    isCancelled: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    gameName: { type: String, maxLength: 500 },
    gameImg: { type: String, maxLength: 20000 },
    instagramUrl: { type: String, maxLength: 500 },
    facebookUrl: { type: String, maxLength: 500 },
    twitterUrl: { type: String, maxLength: 500 },
    youTubeUrl: { type: String, maxLength: 500 },
    website: { type: String, maxLength: 500 },
    creatorId: { type: Schema.Types.ObjectId, required: true }

  },
  {
    timestamps: true, toJSON: { virtuals: true }
  }
)

TournamentSchema.virtual('playerCount', {
  localField: '_id',
  foreignField: 'tournamentId',
  ref: 'Player',
  count: true
})