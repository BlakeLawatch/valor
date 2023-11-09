import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { tournamentsService } from "./TournamentsService.js"

class MatchesService {
    async getMatches() {
        const matches = await dbContext.Matches.find()
        return matches
    }
    async getMatchesByTournament(tournamentId) {
        const tournament = await tournamentsService.getTournamentById(tournamentId)
        if (!tournament) {
            throw new BadRequest(`${tournamentId} is not a valid ID`)
        }
        const matches = await dbContext.Matches.find({ tournamentId: tournament.id })
        return matches
    }
    async getMatchById(matchId) {
        const match = await dbContext.Matches.findById(matchId)
        if (!match) {
            throw new BadRequest(`${matchId} is not a valid ID`)
        }
        return match
    }
    async createMatch(match, userId) {
        const tournament = await tournamentsService.getTournamentById(match.tournamentId)
        if (tournament.creatorId != userId) {
            throw new Forbidden(`You can't create a match for a tournament you don't own`)
        }
        if (!tournament) {
            throw new BadRequest(`${match.tournamentId} is not a valid id`)
        }
        const newMatch = await dbContext.Matches.create(match)
        return newMatch
    }
    async destroyMatch(matchId, userId) {
        const match = await this.getMatchById(matchId)
        if (!match) {
            throw new BadRequest(`${matchId} is not a valid match id`)
        }
        const tournament = await tournamentsService.getTournamentById(match.tournamentId)
        if (!tournament) {
            throw new BadRequest(`${match.tournamentId} This tournament is not attached to a match somehow`)
        }
        if (tournament.creatorId != userId) {
            throw new Forbidden(`You cannot destroy a match on a tournament that does not belong to you`)
        }
        const destroyedMatch = await dbContext.Matches.remove(match)
        return destroyedMatch
    }
}

export const matchesService = new MatchesService()